"use client";

import {
  type CSSProperties,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import type { AtlasCase, AtlasDomain } from "@/modules/atlas/types";
import { caseLatLngToSpherePoint } from "@/modules/home/planet-coordinates";
import {
  EARTH_ASSETS,
  clamp,
  createPlaceholderEarthMesh,
  disposeMaterial,
  disposeSceneObjects,
  loadParallelEarthAssets,
  type CloudLayerConfig,
} from "@/modules/three/earth-builder";

export type AtlasGlobeLabels = {
  emptyTitle: string;
  emptyDescription: string;
  webglUnavailableTitle: string;
  webglUnavailableDescription: string;
  canvasAriaTemplate: string;
  keyboardHint: string;
  legendHeading: string;
  pauseRotation: string;
  resumeRotation: string;
  focusIndonesia: string;
  resetView: string;
  tryAgain: string;
  resetFilters: string;
};

type AtlasGlobeProps = {
  cases: AtlasCase[];
  domains?: AtlasDomain[];
  selectedSlug: string | null;
  onSelect: (slug: string) => void;
  onClearSelection?: () => void;
  onResetFilters?: () => void;
  labels: AtlasGlobeLabels;
};

const PLANET_RADIUS = 1.82;
const CAMERA_FOV = 36;
const CAMERA_DISTANCE = 7.2;
const MAX_DPR = 1.5;
const MIN_PITCH = -1.15;
const MAX_PITCH = 1.15;
const OVERSHOOT_PITCH_LIMIT = 1.26;
const PITCH_RUBBER_FACTOR = 0.25;
const AUTO_ROTATE_SPEED = 0.0012;
const DRAG_SENSITIVITY = 0.0046;
const CLICK_THRESHOLD_SQ = 36;

const DEFAULT_FOCUS_COORDS = { lat: 6.0, lng: 86.0 } as const;
const INDONESIA_FOCUS_COORDS = { lat: -2.5, lng: 112.0 } as const;
const SELECTED_PIN_HEX = "#f8df86";

const ATLAS_CLOUD_CONFIGS: readonly CloudLayerConfig[] = [
  { height: 1.016, opacity: 0.24, spin: 0.011, initialYaw: 0.28 },
  { height: 1.031, opacity: 0.14, spin: -0.006, initialYaw: 1.4 },
];

const UP_AXIS = new THREE.Vector3(0, 1, 0);

function shortestAngleDelta(from: number, to: number): number {
  const twoPi = Math.PI * 2;
  const raw = (to - from) % twoPi;
  if (raw > Math.PI) return raw - twoPi;
  if (raw < -Math.PI) return raw + twoPi;
  return raw;
}

function latLngToCameraAngles(lat: number, lng: number): {
  yaw: number;
  pitch: number;
} {
  return {
    yaw: Math.PI + (lng * Math.PI) / 180,
    pitch: clamp((lat * Math.PI) / 180, MIN_PITCH, MAX_PITCH),
  };
}

/**
 * Extracts concise case identity (e.g. "Rainforest Connection" from
 * "Rainforest Connection: Pemantauan Bioakustik Hutan Sumatra Barat")
 * so labels remain legible directly on the globe without hover.
 */
function getShortPinName(title: string): string {
  const colonIdx = title.indexOf(":");
  if (colonIdx > 2 && colonIdx <= 28) {
    return title.slice(0, colonIdx).trim();
  }
  if (title.length <= 24) return title;
  const cut = title.slice(0, 23);
  const lastSpace = cut.lastIndexOf(" ");
  return `${(lastSpace > 10 ? cut.slice(0, lastSpace) : cut).trim()}…`;
}

/**
 * Generates an inverted sculpted Google Maps-style teardrop beacon profile
 * rising vertically along +Y (y = 0.145 needle junction -> y = 0.352 top crown).
 */
function createTeardropPinGeometry(): THREE.LatheGeometry {
  const points: THREE.Vector2[] = [
    new THREE.Vector2(0.0, 0.144),
    new THREE.Vector2(0.0075, 0.158),
    new THREE.Vector2(0.0185, 0.184),
    new THREE.Vector2(0.0325, 0.214),
    new THREE.Vector2(0.0435, 0.244),
    new THREE.Vector2(0.0475, 0.272),
    new THREE.Vector2(0.0445, 0.302),
    new THREE.Vector2(0.0345, 0.326),
    new THREE.Vector2(0.0185, 0.343),
    new THREE.Vector2(0.0, 0.351),
  ];
  return new THREE.LatheGeometry(points, 24);
}

type RectBox = {
  left: number;
  top: number;
  right: number;
  bottom: number;
};

function boxesOverlap(a: RectBox, b: RectBox, padding: number): boolean {
  return !(
    a.right + padding < b.left ||
    a.left - padding > b.right ||
    a.bottom + padding < b.top ||
    a.top - padding > b.bottom
  );
}

type PinEntry = {
  slug: string;
  domainColor: string;
  vividColor: THREE.Color;
  deepColor: THREE.Color;
  pulsePhase: number;
  normal: THREE.Vector3;
  group: THREE.Group;
  dotMesh: THREE.Mesh;
  dotMat: THREE.MeshBasicMaterial;
  pulseRingMesh: THREE.Mesh;
  pulseRingMat: THREE.MeshBasicMaterial;
  needleMat: THREE.MeshStandardMaterial;
  headMat: THREE.MeshStandardMaterial;
  reticleMesh: THREE.Mesh;
  reticleMat: THREE.MeshBasicMaterial;
  hitMesh: THREE.Mesh;
  currentScale: number;
  targetScale: number;
};

type SharedPinAssets = {
  needleGeo: THREE.CylinderGeometry;
  teardropGeo: THREE.LatheGeometry;
  recessChannelGeo: THREE.TorusGeometry;
  crownBeadGeo: THREE.SphereGeometry;
  dotGeo: THREE.CircleGeometry;
  pulseRingGeo: THREE.RingGeometry;
  reticleGeo: THREE.TorusGeometry;
  hitGeo: THREE.SphereGeometry;
  recessChannelMat: THREE.MeshStandardMaterial;
  hitMat: THREE.MeshBasicMaterial;
};

function subscribeReducedMotion(onStoreChange: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", onStoreChange);
  return () => mq.removeEventListener("change", onStoreChange);
}

function getReducedMotionSnapshot(): boolean {
  return typeof window !== "undefined"
    ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
    : false;
}

function getReducedMotionServerSnapshot(): boolean {
  return false;
}

export default function AtlasGlobe({
  cases,
  domains,
  selectedSlug,
  onSelect,
  onClearSelection,
  onResetFilters,
  labels,
}: AtlasGlobeProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);

  const labelElsRef = useRef<Map<string, HTMLButtonElement>>(new Map());
  const lineElsRef = useRef<Map<string, SVGLineElement>>(new Map());
  const labelDimsRef = useRef<Map<string, { w: number; h: number }>>(new Map());
  const lastSlotRef = useRef<Map<string, number>>(new Map());

  const prefersReducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot
  );
  const [userPauseOverride, setUserPauseOverride] = useState<boolean | null>(
    null
  );
  const isPaused = userPauseOverride ?? prefersReducedMotion;
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null);
  const [runtimeError, setRuntimeError] = useState(false);
  const [retryNonce, setRetryNonce] = useState(0);

  // Refs synced from React props/state so WebGL runs uninterrupted across filters & selection.
  const prefersReducedMotionRef = useRef(prefersReducedMotion);
  const isPausedRef = useRef(isPaused);
  const requestRenderRef = useRef<(() => void) | null>(null);
  const hoveredSlugRef = useRef(hoveredSlug);
  const hoveredViaLabelRef = useRef<string | null>(null);
  const focusedSlugRef = useRef<string | null>(null);
  const selectedSlugRef = useRef(selectedSlug);
  const casesRef = useRef(cases);
  const onSelectRef = useRef(onSelect);
  const onClearRef = useRef(onClearSelection);

  useEffect(() => {
    prefersReducedMotionRef.current = prefersReducedMotion;
    requestRenderRef.current?.();
  }, [prefersReducedMotion]);

  useEffect(() => {
    isPausedRef.current = isPaused;
    requestRenderRef.current?.();
  }, [isPaused]);

  useEffect(() => {
    hoveredSlugRef.current = hoveredSlug;
    requestRenderRef.current?.();
  }, [hoveredSlug]);

  useEffect(() => {
    selectedSlugRef.current = selectedSlug;
    requestRenderRef.current?.();
  }, [selectedSlug]);

  useEffect(() => {
    casesRef.current = cases;
    requestRenderRef.current?.();
  }, [cases]);

  useEffect(() => {
    onSelectRef.current = onSelect;
    onClearRef.current = onClearSelection;
  }, [onSelect, onClearSelection]);

  // Measure real floating label dimensions whenever case list changes.
  useEffect(() => {
    const dims = new Map<string, { w: number; h: number }>();
    for (const [slug, el] of labelElsRef.current.entries()) {
      dims.set(slug, {
        w: el.offsetWidth || 128,
        h: el.offsetHeight || 24,
      });
    }
    labelDimsRef.current = dims;
  }, [cases]);

  const initialFocus = useMemo(() => {
    const initialCase = selectedSlug
      ? cases.find((c) => c.slug === selectedSlug)
      : undefined;
    return initialCase
      ? latLngToCameraAngles(initialCase.lat, initialCase.lng)
      : latLngToCameraAngles(
          DEFAULT_FOCUS_COORDS.lat,
          DEFAULT_FOCUS_COORDS.lng
        );
    // Compute initial framing only on initial mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const yawRef = useRef(initialFocus.yaw);
  const pitchRef = useRef(initialFocus.pitch);
  const targetYawRef = useRef(initialFocus.yaw);
  const targetPitchRef = useRef(initialFocus.pitch);
  const holdAutoUntilRef = useRef(0);

  const pinsGroupRef = useRef<THREE.Group | null>(null);
  const sharedPinAssetsRef = useRef<SharedPinAssets | null>(null);
  const pinEntriesRef = useRef<PinEntry[]>([]);
  const hitMeshesRef = useRef<THREE.Mesh[]>([]);
  const lastFlownSlugRef = useRef<string | null>(selectedSlug);
  const [pulsedControl, setPulsedControl] = useState<
    "indonesia" | "reset" | null
  >(null);
  const pulseTimerRef = useRef<number | null>(null);

  const triggerControlPulse = useCallback((control: "indonesia" | "reset") => {
    if (pulseTimerRef.current !== null) {
      window.clearTimeout(pulseTimerRef.current);
    }
    setPulsedControl(control);
    pulseTimerRef.current = window.setTimeout(() => {
      setPulsedControl(null);
      pulseTimerRef.current = null;
    }, 520);
  }, []);

  const flyToLatLng = useCallback((lat: number, lng: number, holdMs = 2600) => {
    const { yaw, pitch } = latLngToCameraAngles(lat, lng);
    targetPitchRef.current = pitch;
    targetYawRef.current =
      yawRef.current + shortestAngleDelta(yawRef.current, yaw);
    holdAutoUntilRef.current = performance.now() + holdMs;
    requestRenderRef.current?.();
  }, []);

  const handleFocusIndonesia = useCallback(() => {
    flyToLatLng(INDONESIA_FOCUS_COORDS.lat, INDONESIA_FOCUS_COORDS.lng, 2800);
    triggerControlPulse("indonesia");
  }, [flyToLatLng, triggerControlPulse]);

  const handleResetView = useCallback(() => {
    flyToLatLng(DEFAULT_FOCUS_COORDS.lat, DEFAULT_FOCUS_COORDS.lng, 1200);
    triggerControlPulse("reset");
  }, [flyToLatLng, triggerControlPulse]);

  const applyPinHighlights = useCallback(() => {
    const selected = selectedSlugRef.current;
    const hovered = hoveredSlugRef.current;

    for (const entry of pinEntriesRef.current) {
      const isSelected = entry.slug === selected;
      const isHovered = entry.slug === hovered;

      if (isSelected) {
        entry.headMat.color.copy(entry.vividColor);
        entry.headMat.emissive.copy(entry.vividColor);
        entry.headMat.emissiveIntensity = 0.68;
        entry.needleMat.emissiveIntensity = 0.55;
        entry.dotMat.color.copy(entry.vividColor);
        entry.dotMat.opacity = 1;
        entry.pulseRingMat.color.copy(entry.vividColor);
        entry.reticleMat.color.set(SELECTED_PIN_HEX);
        entry.reticleMat.opacity = 0.96;
        entry.reticleMesh.visible = true;
        entry.targetScale = 1.3;
      } else if (isHovered) {
        entry.headMat.color.copy(entry.vividColor);
        entry.headMat.emissive.copy(entry.vividColor);
        entry.headMat.emissiveIntensity = 0.62;
        entry.needleMat.emissiveIntensity = 0.48;
        entry.dotMat.color.copy(entry.vividColor);
        entry.dotMat.opacity = 0.96;
        entry.pulseRingMat.color.copy(entry.vividColor);
        entry.reticleMat.color.copy(entry.vividColor);
        entry.reticleMat.opacity = 0.92;
        entry.reticleMesh.visible = true;
        entry.targetScale = 1.22;
      } else {
        entry.headMat.color.copy(entry.deepColor);
        entry.headMat.emissive.copy(entry.vividColor);
        entry.headMat.emissiveIntensity = 0.36;
        entry.needleMat.emissiveIntensity = 0.3;
        entry.dotMat.color.copy(entry.vividColor);
        entry.dotMat.opacity = 0.88;
        entry.pulseRingMat.color.copy(entry.vividColor);
        entry.reticleMesh.visible = false;
        entry.targetScale = 1.0;
      }
    }
  }, []);

  const rebuildPins = useCallback(
    (caseList: AtlasCase[]) => {
      const group = pinsGroupRef.current;
      const assets = sharedPinAssetsRef.current;
      if (!group || !assets) return;

      for (const prev of pinEntriesRef.current) {
        prev.headMat.dispose();
        prev.needleMat.dispose();
        prev.dotMat.dispose();
        prev.pulseRingMat.dispose();
        prev.reticleMat.dispose();
        group.remove(prev.group);
      }

      const nextEntries: PinEntry[] = [];
      const nextHits: THREE.Mesh[] = [];

      caseList.forEach((caseStudy, index) => {
        const coords = caseLatLngToSpherePoint(
          caseStudy.lat,
          caseStudy.lng,
          PLANET_RADIUS * 1.002
        );
        const normal = new THREE.Vector3(coords.x, coords.y, coords.z).normalize();

        // Deepen & saturate domain hex so pins keep vivid distinct colors under 3D lighting.
        const vividColor = new THREE.Color(caseStudy.domain.color).offsetHSL(
          0,
          0.14,
          -0.06
        );
        const deepColor = new THREE.Color(caseStudy.domain.color).offsetHSL(
          0,
          0.18,
          -0.18
        );

        const pinGroup = new THREE.Group();
        pinGroup.position.set(coords.x, coords.y, coords.z);
        pinGroup.quaternion.setFromUnitVectors(UP_AXIS, normal);

        const dotMat = new THREE.MeshBasicMaterial({
          color: vividColor.clone(),
          transparent: true,
          opacity: 0.9,
          side: THREE.DoubleSide,
          depthWrite: false,
          toneMapped: false,
        });
        const dotMesh = new THREE.Mesh(assets.dotGeo, dotMat);
        dotMesh.rotation.x = -Math.PI / 2;
        dotMesh.position.y = 0.004;

        const pulseRingMat = new THREE.MeshBasicMaterial({
          color: vividColor.clone(),
          transparent: true,
          opacity: 0.6,
          side: THREE.DoubleSide,
          depthWrite: false,
          toneMapped: false,
        });
        const pulseRingMesh = new THREE.Mesh(assets.pulseRingGeo, pulseRingMat);
        pulseRingMesh.rotation.x = -Math.PI / 2;
        pulseRingMesh.position.y = 0.0045;

        const needleMat = new THREE.MeshStandardMaterial({
          color: deepColor.clone(),
          emissive: vividColor.clone(),
          emissiveIntensity: 0.3,
          roughness: 0.28,
          metalness: 0.45,
          toneMapped: false,
        });
        const needleMesh = new THREE.Mesh(assets.needleGeo, needleMat);

        const headMat = new THREE.MeshStandardMaterial({
          color: deepColor.clone(),
          emissive: vividColor.clone(),
          emissiveIntensity: 0.36,
          roughness: 0.3,
          metalness: 0.14,
          toneMapped: false,
        });
        const headMesh = new THREE.Mesh(assets.teardropGeo, headMat);

        const recessMesh = new THREE.Mesh(
          assets.recessChannelGeo,
          assets.recessChannelMat
        );
        recessMesh.rotation.x = Math.PI / 2;
        recessMesh.position.y = 0.272;

        const crownBeadMesh = new THREE.Mesh(assets.crownBeadGeo, headMat);
        crownBeadMesh.position.y = 0.351;

        const reticleMat = new THREE.MeshBasicMaterial({
          color: vividColor.clone(),
          transparent: true,
          opacity: 0.92,
          toneMapped: false,
        });
        const reticleMesh = new THREE.Mesh(assets.reticleGeo, reticleMat);
        reticleMesh.position.y = 0.272;
        reticleMesh.rotation.set(Math.PI / 2 - 0.38, 0, 0);
        reticleMesh.visible = false;

        const hitMesh = new THREE.Mesh(assets.hitGeo, assets.hitMat);
        hitMesh.position.y = 0.23;
        hitMesh.userData.slug = caseStudy.slug;

        pinGroup.add(
          dotMesh,
          pulseRingMesh,
          needleMesh,
          headMesh,
          recessMesh,
          crownBeadMesh,
          reticleMesh,
          hitMesh
        );
        group.add(pinGroup);

        nextEntries.push({
          slug: caseStudy.slug,
          domainColor: caseStudy.domain.color,
          vividColor,
          deepColor,
          pulsePhase: index * 0.78,
          normal,
          group: pinGroup,
          dotMesh,
          dotMat,
          pulseRingMesh,
          pulseRingMat,
          needleMat,
          headMat,
          reticleMesh,
          reticleMat,
          hitMesh,
          currentScale: 1,
          targetScale: 1,
        });
        nextHits.push(hitMesh);
      });

      pinEntriesRef.current = nextEntries;
      hitMeshesRef.current = nextHits;
      applyPinHighlights();
    },
    [applyPinHighlights]
  );

  useEffect(() => {
    rebuildPins(cases);
  }, [cases, rebuildPins]);

  useEffect(() => {
    applyPinHighlights();

    if (!selectedSlug) {
      lastFlownSlugRef.current = null;
      return;
    }

    if (lastFlownSlugRef.current === selectedSlug) return;
    const match = cases.find((c) => c.slug === selectedSlug);
    if (match) {
      lastFlownSlugRef.current = selectedSlug;
      flyToLatLng(match.lat, match.lng, 2800);
    }
  }, [selectedSlug, hoveredSlug, cases, applyPinHighlights, flyToLatLng]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container || runtimeError) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      });
    } catch (error) {
      console.error(
        "[components/atlas/AtlasGlobe] Failed to create WebGLRenderer:",
        error
      );
      queueMicrotask(() => setRuntimeError(true));
      return;
    }

    renderer.setClearColor(0x000000, 0);
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.24;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(CAMERA_FOV, 1, 0.1, 40);
    scene.add(camera);

    const ambientLight = new THREE.AmbientLight(0xdff4ef, 0.62);
    const keyLight = new THREE.DirectionalLight(0xffffff, 1.35);
    keyLight.position.set(-7.5, 2.4, 5.5);
    const rimFillLight = new THREE.DirectionalLight(0x88f7d0, 0.35);
    rimFillLight.position.set(6.0, -1.5, 2.0);
    camera.add(keyLight);
    camera.add(rimFillLight);
    scene.add(ambientLight);

    const planetRoot = new THREE.Group();
    scene.add(planetRoot);

    const placeholderEarth = createPlaceholderEarthMesh(PLANET_RADIUS);
    planetRoot.add(placeholderEarth);

    const pinsGroup = new THREE.Group();
    planetRoot.add(pinsGroup);
    pinsGroupRef.current = pinsGroup;

    // Shared pin geometries & static materials reused across all cases.
    const needleGeo = new THREE.CylinderGeometry(0.0068, 0.002, 0.156, 12);
    needleGeo.translate(0, 0.078, 0);
    const teardropGeo = createTeardropPinGeometry();
    const recessChannelGeo = new THREE.TorusGeometry(0.045, 0.0042, 10, 26);
    const crownBeadGeo = new THREE.SphereGeometry(0.012, 14, 10);
    const dotGeo = new THREE.CircleGeometry(0.0115, 20);
    const pulseRingGeo = new THREE.RingGeometry(0.018, 0.027, 28);
    const reticleGeo = new THREE.TorusGeometry(0.068, 0.0028, 8, 36);
    const hitGeo = new THREE.SphereGeometry(0.115, 10, 8);

    const recessChannelMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color("#07120e"),
      roughness: 0.45,
      metalness: 0.35,
    });
    const hitMat = new THREE.MeshBasicMaterial({
      transparent: true,
      opacity: 0,
      depthWrite: false,
    });

    sharedPinAssetsRef.current = {
      needleGeo,
      teardropGeo,
      recessChannelGeo,
      crownBeadGeo,
      dotGeo,
      pulseRingGeo,
      reticleGeo,
      hitGeo,
      recessChannelMat,
      hitMat,
    };

    rebuildPins(casesRef.current);

    let disposed = false;
    const extraTextures: THREE.Texture[] = [];
    let cloudLayers: { mesh: THREE.Mesh; spin: number }[] = [];
    let activePlanetMesh: THREE.Mesh | null = null;
    const planetTimeUniform = { value: 0 };

    const fallbackNightTex = new THREE.DataTexture(
      new Uint8Array([0, 0, 0, 255]),
      1,
      1,
      THREE.RGBAFormat
    );
    fallbackNightTex.needsUpdate = true;
    const nightTexUniform: { value: THREE.Texture } = { value: fallbackNightTex };

    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath(EARTH_ASSETS.dracoPath);
    const gltfLoader = new GLTFLoader();
    gltfLoader.setDRACOLoader(dracoLoader);
    const texLoader = new THREE.TextureLoader();

    loadParallelEarthAssets({
      gltfLoader,
      texLoader,
      planetRadius: PLANET_RADIUS,
      nightTexUniform,
      planetTimeUniform,
      cloudConfigs: ATLAS_CLOUD_CONFIGS,
      nightMinimumDay: 0.14,
      isDisposed: () => disposed,
      onTextureCreated: (tex) => {
        extraTextures.push(tex);
      },
      onPlanetReady: (mesh) => {
        activePlanetMesh = mesh;
        planetRoot.add(mesh);
        planetRoot.remove(placeholderEarth);
        placeholderEarth.geometry.dispose();
        disposeMaterial(placeholderEarth.material);
        requestRenderRef.current?.();
      },
      onCloudsReady: (layers) => {
        cloudLayers = layers;
        for (const layer of layers) {
          planetRoot.add(layer.mesh);
        }
        requestRenderRef.current?.();
      },
    });

    const updateSize = () => {
      const rect = container.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return;
      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      renderer.setPixelRatio(dpr);
      renderer.setSize(rect.width, rect.height, false);
      camera.aspect = rect.width / rect.height;
      camera.updateProjectionMatrix();

      const dims = new Map<string, { w: number; h: number }>();
      for (const [slug, el] of labelElsRef.current.entries()) {
        dims.set(slug, {
          w: el.offsetWidth || 128,
          h: el.offsetHeight || 28,
        });
      }
      labelDimsRef.current = dims;
      requestRenderRef.current?.();
    };
    updateSize();

    const resizeObserver = new ResizeObserver(() => updateSize());
    resizeObserver.observe(container);

    const raycaster = new THREE.Raycaster();
    const pointerNdc = new THREE.Vector2();
    const earthColliderSphere = new THREE.Sphere(
      new THREE.Vector3(0, 0, 0),
      PLANET_RADIUS * 0.992
    );
    const camDirVec = new THREE.Vector3();
    const sphereHitPoint = new THREE.Vector3();
    const tipLocalVec = new THREE.Vector3(0, 0.375, 0);
    const tipWorldVec = new THREE.Vector3();
    const headLocalVec = new THREE.Vector3(0, 0.355, 0);
    const headWorldVec = new THREE.Vector3();

    const pickPinAtClient = (clientX: number, clientY: number): string | null => {
      const hitsList = hitMeshesRef.current;
      if (hitsList.length === 0) return null;

      const rect = canvas.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return null;

      pointerNdc.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      pointerNdc.y = -(((clientY - rect.top) / rect.height) * 2 - 1);

      camera.updateMatrixWorld();
      raycaster.setFromCamera(pointerNdc, camera);
      camDirVec.copy(camera.position).normalize();

      const globeHit = raycaster.ray.intersectSphere(
        earthColliderSphere,
        sphereHitPoint
      );
      const globeDist = globeHit
        ? globeHit.distanceTo(camera.position)
        : Infinity;

      const intersections = raycaster.intersectObjects(hitsList, false);
      for (const hit of intersections) {
        if (hit.distance > globeDist + 0.1) continue;
        const slug = hit.object.userData.slug as string | undefined;
        if (!slug) continue;
        const entry = pinEntriesRef.current.find((p) => p.slug === slug);
        if (entry && entry.normal.dot(camDirVec) > -0.18) {
          return slug;
        }
      }
      return null;
    };

    let pointerDownId: number | null = null;
    let pointerDownPos: { x: number; y: number } | null = null;
    let lastPointerPos: { x: number; y: number } | null = null;
    let dragDistanceSq = 0;

    const onDown = (event: PointerEvent) => {
      pointerDownId = event.pointerId;
      pointerDownPos = { x: event.clientX, y: event.clientY };
      lastPointerPos = { x: event.clientX, y: event.clientY };
      dragDistanceSq = 0;
      canvas.setPointerCapture(event.pointerId);
    };

    const onMove = (event: PointerEvent) => {
      if (pointerDownId === event.pointerId && lastPointerPos && pointerDownPos) {
        const dx = event.clientX - lastPointerPos.x;
        const dy = event.clientY - lastPointerPos.y;
        lastPointerPos = { x: event.clientX, y: event.clientY };

        const totalDx = event.clientX - pointerDownPos.x;
        const totalDy = event.clientY - pointerDownPos.y;
        dragDistanceSq = totalDx * totalDx + totalDy * totalDy;

        targetYawRef.current -= dx * DRAG_SENSITIVITY;
        const deltaPitch = dy * DRAG_SENSITIVITY;
        const curPitch = targetPitchRef.current;
        const nextRaw = curPitch + deltaPitch;
        // #19 Rubber band past polar bounds with gentle resistance
        const pushingPastNorth = nextRaw > MAX_PITCH && deltaPitch > 0;
        const pushingPastSouth = nextRaw < MIN_PITCH && deltaPitch < 0;
        const effectiveDelta =
          pushingPastNorth || pushingPastSouth
            ? deltaPitch * PITCH_RUBBER_FACTOR
            : deltaPitch;
        targetPitchRef.current = clamp(
          curPitch + effectiveDelta,
          -OVERSHOOT_PITCH_LIMIT,
          OVERSHOOT_PITCH_LIMIT
        );
        // #14 Don't tween while held: follow pointer 1:1 during active drag
        yawRef.current = targetYawRef.current;
        pitchRef.current = targetPitchRef.current;
        holdAutoUntilRef.current = performance.now() + 2600;
        if (hoveredSlugRef.current !== null) {
          hoveredSlugRef.current = null;
          setHoveredSlug(null);
        }
        requestRenderRef.current?.();
        return;
      }

      const hitSlug = pickPinAtClient(event.clientX, event.clientY);
      canvas.style.cursor = hitSlug ? "pointer" : "grab";
      if (hitSlug !== null) {
        hoveredViaLabelRef.current = null;
      }
      if (hitSlug !== hoveredSlugRef.current) {
        hoveredSlugRef.current = hitSlug;
        setHoveredSlug(hitSlug);
        requestRenderRef.current?.();
      }
    };

    const endDrag = (event: PointerEvent, allowSelectClick: boolean) => {
      if (pointerDownId === event.pointerId) {
        if (canvas.hasPointerCapture(event.pointerId)) {
          canvas.releasePointerCapture(event.pointerId);
        }
        if (allowSelectClick && dragDistanceSq < CLICK_THRESHOLD_SQ) {
          const hitSlug = pickPinAtClient(event.clientX, event.clientY);
          if (hitSlug) {
            onSelectRef.current(hitSlug);
          } else if (selectedSlugRef.current) {
            onClearRef.current?.();
          }
        }
        // Settle back within polar bounds after release (#19)
        targetPitchRef.current = clamp(
          targetPitchRef.current,
          MIN_PITCH,
          MAX_PITCH
        );
        pointerDownId = null;
        pointerDownPos = null;
        lastPointerPos = null;
        requestRenderRef.current?.();
      }
    };

    const onUp = (event: PointerEvent) => endDrag(event, true);
    const onCancel = (event: PointerEvent) => endDrag(event, false);
    const onLeave = () => {
      if (hoveredSlugRef.current !== null) {
        hoveredSlugRef.current = null;
        setHoveredSlug(null);
        requestRenderRef.current?.();
      }
      canvas.style.cursor = "grab";
    };

    const onKeyDown = (event: KeyboardEvent) => {
      const yawStep = 0.14;
      const pitchStep = 0.1;
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        targetYawRef.current -= yawStep;
        holdAutoUntilRef.current = performance.now() + 2400;
        requestRenderRef.current?.();
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        targetYawRef.current += yawStep;
        holdAutoUntilRef.current = performance.now() + 2400;
        requestRenderRef.current?.();
      } else if (event.key === "ArrowUp") {
        event.preventDefault();
        targetPitchRef.current = clamp(
          targetPitchRef.current + pitchStep,
          MIN_PITCH,
          MAX_PITCH
        );
        holdAutoUntilRef.current = performance.now() + 2400;
        requestRenderRef.current?.();
      } else if (event.key === "ArrowDown") {
        event.preventDefault();
        targetPitchRef.current = clamp(
          targetPitchRef.current - pitchStep,
          MIN_PITCH,
          MAX_PITCH
        );
        holdAutoUntilRef.current = performance.now() + 2400;
        requestRenderRef.current?.();
      } else if (event.key === "Home") {
        event.preventDefault();
        handleResetView();
      }
    };

    const onContextLost = (event: Event) => {
      event.preventDefault();
      setRuntimeError(true);
    };

    const onContextRestored = () => {
      setRuntimeError(false);
      requestRenderRef.current?.();
    };

    canvas.addEventListener("webglcontextlost", onContextLost);
    canvas.addEventListener("webglcontextrestored", onContextRestored);
    canvas.addEventListener("pointerdown", onDown);
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerup", onUp);
    canvas.addEventListener("pointercancel", onCancel);
    canvas.addEventListener("pointerleave", onLeave);
    canvas.addEventListener("keydown", onKeyDown);

    let rafId = 0;
    let lastTs = performance.now();

    const updateOverlays = () => {
      const width = container.clientWidth;
      const height = container.clientHeight;
      if (width <= 0 || height <= 0) return;

      camDirVec.copy(camera.position).normalize();
      const occupiedBoxes: RectBox[] = [];

      // 1) Position active hover/selected detail tooltip and reserve its bounding box.
      const activeSlug = hoveredSlugRef.current ?? selectedSlugRef.current;
      const tooltipEl = tooltipRef.current;
      if (tooltipEl) {
        const activeEntry = activeSlug
          ? pinEntriesRef.current.find((p) => p.slug === activeSlug)
          : null;

        if (activeEntry && activeEntry.normal.dot(camDirVec) > -0.15) {
          tipWorldVec.copy(tipLocalVec).multiplyScalar(activeEntry.currentScale);
          activeEntry.group.localToWorld(tipWorldVec);
          tipWorldVec.project(camera);

          const px = (tipWorldVec.x * 0.5 + 0.5) * width;
          const py = (-tipWorldVec.y * 0.5 + 0.5) * height;
          const clampedX = clamp(px, 126, width - 126);
          const clampedY = clamp(py, 92, height - 24);

          tooltipEl.style.left = `${clampedX}px`;
          tooltipEl.style.top = `${clampedY}px`;
          tooltipEl.style.transform = "translate(-50%, calc(-100% - 12px))";
          tooltipEl.style.opacity = "1";
          tooltipEl.dataset.open = "true";

          const tw = tooltipEl.offsetWidth || 240;
          const th = tooltipEl.offsetHeight || 76;
          occupiedBoxes.push({
            left: clampedX - tw / 2,
            right: clampedX + tw / 2,
            top: clampedY - th - 12,
            bottom: clampedY - 12,
          });
        } else {
          tooltipEl.style.opacity = "0";
          tooltipEl.dataset.open = "false";
        }
      }

      // 2) Sort front-facing pins so center-facing / focused pins claim labels cleanly.
      const candidates = pinEntriesRef.current
        .map((entry) => ({
          entry,
          facing: entry.normal.dot(camDirVec),
        }))
        .sort((a, b) => {
          const aFocus = a.entry.slug === focusedSlugRef.current ? 2 : a.entry.slug === selectedSlugRef.current ? 1 : 0;
          const bFocus = b.entry.slug === focusedSlugRef.current ? 2 : b.entry.slug === selectedSlugRef.current ? 1 : 0;
          if (aFocus !== bFocus) return bFocus - aFocus;
          return b.facing - a.facing;
        });

      const isNarrow = width < 520;
      const margin = isNarrow ? 10 : 6;
      const collisionPad = isNarrow ? 9 : 6;
      const maxVisibleLabels = isNarrow ? 5 : candidates.length;
      let shownLabels = 0;

      for (const { entry, facing } of candidates) {
        const labelEl = labelElsRef.current.get(entry.slug);
        const lineEl = lineElsRef.current.get(entry.slug);
        if (!labelEl) continue;

        const isFocused = entry.slug === focusedSlugRef.current;
        const isLabelHovered = entry.slug === hoveredViaLabelRef.current;
        const isActiveTooltipOwner =
          entry.slug === activeSlug &&
          !isLabelHovered &&
          tooltipEl &&
          tooltipEl.style.opacity === "1";

        const overMobileCap =
          shownLabels >= maxVisibleLabels && !isFocused && !isLabelHovered;

        if (
          overMobileCap ||
          (facing <= 0.1 && !isFocused && !isLabelHovered) ||
          isActiveTooltipOwner
        ) {
          labelEl.style.opacity = "0";
          labelEl.style.pointerEvents = "none";
          if (!isFocused) {
            labelEl.style.transform = "translate3d(-9999px, -9999px, 0)";
          }
          if (lineEl) lineEl.style.opacity = "0";
          continue;
        }

        headWorldVec.copy(headLocalVec).multiplyScalar(entry.currentScale);
        entry.group.localToWorld(headWorldVec);
        headWorldVec.project(camera);

        const pinX = (headWorldVec.x * 0.5 + 0.5) * width;
        const pinY = (-headWorldVec.y * 0.5 + 0.5) * height;
        const dims = labelDimsRef.current.get(entry.slug) ?? {
          w: labelEl.offsetWidth || 128,
          h: labelEl.offsetHeight || 28,
        };
        const { w, h } = dims;

        // Six clean directional anchor slots relative to pin tip; check previous slot first for stability.
        const slots: Array<{ x: number; y: number }> = [
          { x: clamp(pinX - w / 2, margin, width - w - margin), y: pinY - h - 18 },
          { x: pinX + 16, y: pinY - h - 10 },
          { x: pinX - w - 16, y: pinY - h - 10 },
          { x: pinX + 16, y: pinY + 12 },
          { x: pinX - w - 16, y: pinY + 12 },
          { x: clamp(pinX - w / 2, margin, width - w - margin), y: pinY + 18 },
        ];

        const prevSlot = lastSlotRef.current.get(entry.slug);
        const slotOrder =
          prevSlot !== undefined && prevSlot >= 0 && prevSlot < slots.length
            ? [
                prevSlot,
                ...[0, 1, 2, 3, 4, 5].filter((idx) => idx !== prevSlot),
              ]
            : [0, 1, 2, 3, 4, 5];

        let chosenBox: RectBox | null = null;
        let chosenSlot = 0;

        for (const slotIdx of slotOrder) {
          const pos = slots[slotIdx];
          if (
            pos.x < margin ||
            pos.x + w > width - margin ||
            pos.y < margin ||
            pos.y + h > height - margin
          ) {
            continue;
          }
          const box: RectBox = {
            left: pos.x,
            top: pos.y,
            right: pos.x + w,
            bottom: pos.y + h,
          };
          const overlaps = occupiedBoxes.some((other) =>
            boxesOverlap(box, other, collisionPad)
          );
          if (!overlaps) {
            chosenBox = box;
            chosenSlot = slotIdx;
            break;
          }
        }

        if (!chosenBox && isFocused) {
          const fx = clamp(pinX - w / 2, margin, width - w - margin);
          const fy = clamp(pinY - h - 18, margin, height - h - margin);
          chosenBox = { left: fx, top: fy, right: fx + w, bottom: fy + h };
        }

        if (!chosenBox) {
          labelEl.style.opacity = "0";
          labelEl.style.pointerEvents = "none";
          labelEl.style.transform = "translate3d(-9999px, -9999px, 0)";
          if (lineEl) lineEl.style.opacity = "0";
          continue;
        }

        shownLabels += 1;
        lastSlotRef.current.set(entry.slug, chosenSlot);
        occupiedBoxes.push(chosenBox);

        const horizonFade = isFocused
          ? 1
          : clamp((facing - 0.1) / 0.24, 0, 1);

        labelEl.style.transform = `translate3d(${chosenBox.left}px, ${chosenBox.top}px, 0)`;
        labelEl.style.opacity = horizonFade.toFixed(2);
        labelEl.style.pointerEvents = horizonFade > 0.25 ? "auto" : "none";

        if (lineEl) {
          const anchorX = clamp(pinX, chosenBox.left + 8, chosenBox.right - 8);
          const anchorY = clamp(pinY, chosenBox.top, chosenBox.bottom);
          lineEl.setAttribute("x1", pinX.toFixed(1));
          lineEl.setAttribute("y1", pinY.toFixed(1));
          lineEl.setAttribute("x2", anchorX.toFixed(1));
          lineEl.setAttribute("y2", anchorY.toFixed(1));
          lineEl.style.opacity = (horizonFade * 0.56).toFixed(2);
        }
      }
    };

    const tick = (now: number) => {
      rafId = 0;
      if (disposed) return;

      if (document.hidden) {
        lastTs = now;
        if (!isPausedRef.current) {
          rafId = requestAnimationFrame(tick);
        }
        return;
      }

      const dt = Math.min((now - lastTs) * 0.001, 0.05);
      lastTs = now;
      const dtNorm = dt * 60;

      if (!isPausedRef.current && !prefersReducedMotionRef.current) {
        planetTimeUniform.value += dt;
        for (const layer of cloudLayers) {
          layer.mesh.rotation.y += layer.spin * dt;
        }
      }

      if (
        !isPausedRef.current &&
        pointerDownId === null &&
        hoveredSlugRef.current === null &&
        focusedSlugRef.current === null &&
        now > holdAutoUntilRef.current
      ) {
        targetYawRef.current += AUTO_ROTATE_SPEED * dtNorm;
      }

      const ease = 1 - Math.exp(-8.5 * dt);
      const yawDiff = targetYawRef.current - yawRef.current;
      const pitchDiff = targetPitchRef.current - pitchRef.current;
      let hasActiveTransition =
        pointerDownId !== null ||
        Math.abs(yawDiff) > 0.0004 ||
        Math.abs(pitchDiff) > 0.0004;

      if (pointerDownId !== null) {
        yawRef.current = targetYawRef.current;
        pitchRef.current = targetPitchRef.current;
      } else {
        if (Math.abs(yawDiff) > 0.0004) {
          yawRef.current += yawDiff * ease;
        } else {
          yawRef.current = targetYawRef.current;
        }
        if (Math.abs(pitchDiff) > 0.0004) {
          pitchRef.current += pitchDiff * ease;
        } else {
          pitchRef.current = targetPitchRef.current;
        }
      }

      const cosPitch = Math.cos(pitchRef.current);
      camera.position.set(
        CAMERA_DISTANCE * cosPitch * Math.sin(yawRef.current),
        CAMERA_DISTANCE * Math.sin(pitchRef.current),
        CAMERA_DISTANCE * cosPitch * Math.cos(yawRef.current)
      );
      camera.lookAt(0, 0, 0);

      const selected = selectedSlugRef.current;
      const hovered = hoveredSlugRef.current;
      const animClock = now * 0.001;

      for (const entry of pinEntriesRef.current) {
        const scaleDiff = entry.targetScale - entry.currentScale;
        if (Math.abs(scaleDiff) > 0.001) {
          entry.currentScale += scaleDiff * ease;
          hasActiveTransition = true;
        } else {
          entry.currentScale = entry.targetScale;
        }
        entry.group.scale.setScalar(entry.currentScale);

        const isActive = entry.slug === selected || entry.slug === hovered;
        if (
          !prefersReducedMotionRef.current &&
          (!isPausedRef.current || isActive)
        ) {
          const speed = isActive ? 0.85 : 0.42;
          const wave = ((animClock * speed + entry.pulsePhase) % 1 + 1) % 1;
          const ringScale = 1.0 + wave * (isActive ? 1.15 : 0.85);
          entry.pulseRingMesh.scale.setScalar(ringScale);
          entry.pulseRingMat.opacity =
            (1 - wave) * (isActive ? 0.82 : 0.46);
          hasActiveTransition = true;
        } else {
          entry.pulseRingMesh.scale.setScalar(1.0);
          entry.pulseRingMat.opacity = isActive ? 0.65 : 0.42;
        }

        if (
          entry.reticleMesh.visible &&
          !isPausedRef.current &&
          !prefersReducedMotionRef.current
        ) {
          entry.reticleMesh.rotation.z += dt * 1.15;
        }
      }

      renderer.render(scene, camera);
      updateOverlays();

      if (!isPausedRef.current || hasActiveTransition) {
        rafId = requestAnimationFrame(tick);
      }
    };

    const scheduleRender = () => {
      if (disposed || rafId !== 0) return;
      lastTs = performance.now();
      rafId = requestAnimationFrame(tick);
    };
    requestRenderRef.current = scheduleRender;
    scheduleRender();

    return () => {
      disposed = true;
      requestRenderRef.current = null;
      cancelAnimationFrame(rafId);
      resizeObserver.disconnect();
      canvas.removeEventListener("webglcontextlost", onContextLost);
      canvas.removeEventListener("webglcontextrestored", onContextRestored);
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerup", onUp);
      canvas.removeEventListener("pointercancel", onCancel);
      canvas.removeEventListener("pointerleave", onLeave);
      canvas.removeEventListener("keydown", onKeyDown);

      pinsGroupRef.current = null;
      sharedPinAssetsRef.current = null;
      pinEntriesRef.current = [];
      hitMeshesRef.current = [];

      // Dispose shared pin assets + textures cleanly without calling loseContext(),
      // avoiding poisoning React Strict Mode / SPA remounts on the same element.
      needleGeo.dispose();
      teardropGeo.dispose();
      recessChannelGeo.dispose();
      crownBeadGeo.dispose();
      dotGeo.dispose();
      pulseRingGeo.dispose();
      reticleGeo.dispose();
      hitGeo.dispose();
      recessChannelMat.dispose();
      hitMat.dispose();
      fallbackNightTex.dispose();
      for (const tex of extraTextures) tex.dispose();
      if (activePlanetMesh) {
        disposeSceneObjects(activePlanetMesh);
      }
      disposeSceneObjects(scene);
      dracoLoader.dispose();
      renderer.dispose();
    };
  }, [runtimeError, retryNonce, handleResetView, rebuildPins]);

  const legendDomains = useMemo(() => {
    if (domains && domains.length > 0) return domains;
    const seen = new Map<string, AtlasDomain>();
    for (const c of cases) {
      if (!seen.has(c.domain.slug)) {
        seen.set(c.domain.slug, { ...c.domain, order: seen.size });
      }
    }
    return [...seen.values()];
  }, [domains, cases]);

  const activeSlug = hoveredSlug ?? selectedSlug;
  const activeCase = activeSlug
    ? cases.find((c) => c.slug === activeSlug)
    : null;
  const activeLeadMetric = activeCase?.metrics?.[0] ?? null;
  const canvasAria = labels.canvasAriaTemplate.replace(
    "{count}",
    String(cases.length)
  );

  if (runtimeError) {
    return (
      <div className="mx-auto flex min-h-[18rem] w-full max-w-[38rem] flex-col items-center justify-center border border-dashed hairline-strong px-8 py-14 text-center">
        <p className="text-base font-medium">{labels.webglUnavailableTitle}</p>
        <p className="small t-soft mt-2 max-w-[36ch]">
          {labels.webglUnavailableDescription}
        </p>
        <button
          type="button"
          onClick={() => {
            setRuntimeError(false);
            setRetryNonce((prev) => prev + 1);
          }}
          className="stage-control mt-5"
        >
          {labels.tryAgain}
        </button>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div
        ref={containerRef}
        className="globe-shell relative mx-auto aspect-square w-full max-w-[38rem] sm:max-w-[42rem]"
      >
        <div
          className="pointer-events-none absolute inset-[6%] rounded-full bg-[radial-gradient(circle_at_45%_46%,rgb(63_226_149_/_0.11)_0%,rgb(56_189_248_/_0.07)_42%,transparent_66%)]"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute inset-[4%] rounded-full border border-[rgb(233_238_221_/_0.13)]"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute inset-[10%] rounded-full border border-[rgb(233_238_221_/_0.06)]"
          aria-hidden="true"
        />

        <div className="absolute inset-0">
          <canvas
            key={retryNonce}
            ref={canvasRef}
            tabIndex={0}
            role="img"
            aria-label={canvasAria}
            className="h-full w-full cursor-grab touch-none active:cursor-grabbing focus-visible:rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--focus-on-night)]"
          />
        </div>

        {/* Hairline SVG leader lines connecting visible pin tags to 3D pin crowns. */}
        <svg
          className="pointer-events-none absolute inset-0 z-[12] h-full w-full"
          aria-hidden="true"
        >
          {cases.map((caseStudy) => (
            <line
              key={caseStudy.slug}
              ref={(el) => {
                if (el) lineElsRef.current.set(caseStudy.slug, el);
                else lineElsRef.current.delete(caseStudy.slug);
              }}
              stroke={caseStudy.domain.color}
              strokeWidth={1.35}
              strokeOpacity={0.92}
              style={{ opacity: 0 }}
            />
          ))}
        </svg>

        {/* Always-visible non-overlapping pin callouts (clickable + keyboard accessible). */}
        <ul className="m-0 list-none p-0">
          {cases.map((caseStudy) => {
            const isSelected = caseStudy.slug === selectedSlug;
            const shortName = getShortPinName(caseStudy.title);
            return (
              <li key={caseStudy.slug}>
                <button
                  type="button"
                  ref={(el) => {
                    if (el) labelElsRef.current.set(caseStudy.slug, el);
                    else labelElsRef.current.delete(caseStudy.slug);
                  }}
                  onClick={() => onSelect(caseStudy.slug)}
                  onMouseEnter={() => {
                    hoveredViaLabelRef.current = caseStudy.slug;
                    hoveredSlugRef.current = caseStudy.slug;
                    setHoveredSlug(caseStudy.slug);
                    requestRenderRef.current?.();
                  }}
                  onMouseLeave={() => {
                    if (hoveredViaLabelRef.current === caseStudy.slug) {
                      hoveredViaLabelRef.current = null;
                    }
                    if (hoveredSlugRef.current === caseStudy.slug) {
                      hoveredSlugRef.current = null;
                      setHoveredSlug(null);
                    }
                    requestRenderRef.current?.();
                  }}
                  onFocus={() => {
                    focusedSlugRef.current = caseStudy.slug;
                    flyToLatLng(caseStudy.lat, caseStudy.lng, 2800);
                  }}
                  onBlur={() => {
                    if (focusedSlugRef.current === caseStudy.slug) {
                      focusedSlugRef.current = null;
                      requestRenderRef.current?.();
                    }
                  }}
                  aria-pressed={isSelected}
                  className="globe-pin-label"
                  style={
                    {
                      "--pin-accent": caseStudy.domain.color,
                    } as CSSProperties
                  }
                >
                  <span
                    className="swatch shrink-0"
                    style={{ backgroundColor: caseStudy.domain.color }}
                    aria-hidden="true"
                  />
                  <span className="truncate font-medium">{shortName}</span>{" "}
                  <span
                    className="tnum shrink-0 text-[0.625rem] font-semibold"
                    style={{ color: caseStudy.domain.color }}
                  >
                    {caseStudy.countryCode}
                  </span>
                  <span className="sr-only">
                    {": "}
                    {caseStudy.title} ({caseStudy.region ?? caseStudy.countryCode}
                    {", "}
                    {caseStudy.domain.name})
                  </span>
                </button>
              </li>
            );
          })}
        </ul>

        {/* Rich tooltip card for hovered / selected pin. */}
        <div
          ref={tooltipRef}
          className="globe-tooltip pointer-events-none"
          style={{ opacity: 0, left: 0, top: 0 }}
          aria-hidden="true"
        >
          {activeCase && (
            <>
              <span className="flex items-center gap-2 text-[0.6875rem] t-soft">
                <span
                  className="swatch"
                  style={{ backgroundColor: activeCase.domain.color }}
                />
                {activeCase.domain.name}
              </span>
              <span className="mt-1 block text-[0.8125rem] font-medium leading-snug">
                {activeCase.title}
              </span>
              <span className="mt-1 block text-[0.6875rem] t-faint tnum">
                {activeCase.region ?? activeCase.countryCode},{" "}
                {activeCase.countryCode}
                {activeCase.year ? `, ${activeCase.year}` : ""}
              </span>
              {activeLeadMetric && (
                <span className="mt-1.5 flex items-baseline gap-1.5 border-t border-[rgb(24_33_28_/_0.12)] pt-1.5 text-[0.6875rem] tnum">
                  <strong className="font-semibold text-[var(--ink)]">
                    {activeLeadMetric.value.toLocaleString()}{" "}
                    {activeLeadMetric.unit}
                  </strong>
                  <span className="truncate text-[var(--ink-faint)]">
                    {activeLeadMetric.label}
                  </span>
                </span>
              )}
            </>
          )}
        </div>

        {cases.length === 0 && (
          <div className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-3 rounded-2xl bg-[rgb(4_9_20_/_0.82)] p-6 text-center backdrop-blur-sm">
            <p className="text-base font-medium">{labels.emptyTitle}</p>
            <p className="small t-soft max-w-[34ch]">
              {labels.emptyDescription}
            </p>
            {onResetFilters && (
              <button
                type="button"
                onClick={onResetFilters}
                className="stage-control mt-1"
              >
                {labels.resetFilters}
              </button>
            )}
          </div>
        )}
      </div>

      <div className="mt-2 flex flex-wrap items-center justify-center gap-2">
        <button
          type="button"
          aria-pressed={isPaused}
          onClick={() =>
            setUserPauseOverride(
              (previous) => !(previous ?? prefersReducedMotion)
            )
          }
          className="stage-control"
        >
          <span
            key={isPaused ? "paused" : "playing"}
            className="stage-control-swap"
          >
            {isPaused ? labels.resumeRotation : labels.pauseRotation}
          </span>
        </button>
        <button
          type="button"
          data-pulse={pulsedControl === "indonesia" ? "true" : undefined}
          onClick={handleFocusIndonesia}
          className="stage-control"
        >
          {labels.focusIndonesia}
        </button>
        <button
          type="button"
          data-pulse={pulsedControl === "reset" ? "true" : undefined}
          onClick={handleResetView}
          className="stage-control"
        >
          {labels.resetView}
        </button>
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-center gap-x-4 gap-y-2.5">
        {legendDomains.map((domain) => (
          <span
            key={domain.slug}
            className="inline-flex items-center gap-1.5 text-[0.6875rem] t-faint"
          >
            <span
              className="swatch"
              style={{ backgroundColor: domain.color }}
              aria-hidden="true"
            />
            {domain.name}
          </span>
        ))}
      </div>

      <p className="micro t-faint mx-auto mt-5 max-w-[42ch] border-t border-[rgb(150_175_230_/_0.14)] pt-3.5 text-center leading-relaxed">
        {labels.keyboardHint}
      </p>
    </div>
  );
}
