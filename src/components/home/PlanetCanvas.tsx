"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { caseLatLngToSpherePoint } from "@/modules/home/planet-coordinates";
import {
  EARTH_ASSETS,
  clamp,
  createPlaceholderEarthMesh,
  disposeMaterial,
  disposeSceneObjects,
  hexToVec3,
  lerp,
  loadParallelEarthAssets,
  mulberry32,
  type CloudLayerConfig,
} from "@/modules/three/earth-builder";

export type PlanetCasePoint = {
  slug: string;
  lat: number;
  lng: number;
  color: string;
};

type PlanetCanvasProps = {
  casePoints: readonly PlanetCasePoint[];
};

const CONFIG = {
  rimColor: "#c1faff",
  glowColor: "#3a6cff",
  glowIntensity: 2.8,
  planetRadius: 1.95,
  spin: 0.03,
  initRotation: 2.07,
  tilt: 0.37,
  bgColor: "#040a1e",
  flameColor: "#3a6cff",
  atmoColor: "#9fc4ff",
  atmoCount: 140,
  atmoSize: 22,
  atmoSpeed: 0.8,
  starColor: "#cfe0ff",
  starCount: 750,
  starSize: 1.6,
  starFlicker: 1,
  markerColor: "#ffd27a",
  markerCount: 60,
  markerSize: 16,
  markerSpeed: 0.5,
  caseMarkerColor: "#5df0a8",
  caseMarkerSize: 24,
  caseMarkerSpeed: 0.65,
} as const;

const HOME_CLOUD_LAYERS: readonly CloudLayerConfig[] = [
  { height: 1.006, opacity: 0.52, spin: 0.06, initialYaw: 0.0 },
  { height: 1.032, opacity: 0.42, spin: 0.12, initialYaw: 2.3 },
];

type Stop = { p: number; v: number };

const STOPS_X: readonly Stop[] = [
  { p: 0, v: 0 },
  { p: 0.32, v: -3.1 },
  { p: 0.64, v: 3.2 },
  { p: 1, v: 0 },
];
const STOPS_Y: readonly Stop[] = [
  { p: 0, v: -4.5 },
  { p: 0.32, v: 0.55 },
  { p: 0.64, v: 0.45 },
  { p: 1, v: 0.15 },
];
const STOPS_S: readonly Stop[] = [
  { p: 0, v: 2.15 },
  { p: 0.32, v: 1.0 },
  { p: 0.64, v: 0.92 },
  { p: 1, v: 1.12 },
];

const ENTRY_DUR = 0.85;
const ENTRY_START_Y = -0.55;

function sampleStops(stops: readonly Stop[], p: number): number {
  if (p <= stops[0].p) return stops[0].v;
  const last = stops[stops.length - 1];
  if (p >= last.p) return last.v;
  for (let i = 0; i < stops.length - 1; i++) {
    const a = stops[i];
    const b = stops[i + 1];
    if (p >= a.p && p <= b.p) {
      const u = (p - a.p) / (b.p - a.p);
      const s = u * u * (3 - 2 * u);
      return lerp(a.v, b.v, s);
    }
  }
  return last.v;
}

function projectCasesOntoMesh(
  geomRadius: number,
  casePoints: readonly PlanetCasePoint[]
): { positions: Float32Array; seeds: Float32Array } {
  const positions = new Float32Array(casePoints.length * 3);
  const seeds = new Float32Array(casePoints.length);
  const targetRadius = geomRadius * 1.015;

  casePoints.forEach((pt, idx) => {
    const point = caseLatLngToSpherePoint(pt.lat, pt.lng, targetRadius);
    positions[idx * 3] = point.x;
    positions[idx * 3 + 1] = point.y;
    positions[idx * 3 + 2] = point.z;
    seeds[idx] = (idx * 0.23) % 1;
  });

  return { positions, seeds };
}

function sampleLandPoints(
  mesh: THREE.Mesh,
  geomRadius: number,
  baseTexture: THREE.Texture | null
): { positions: Float32Array; seeds: Float32Array } {
  const geometry = mesh.geometry;
  const posAttr = geometry.getAttribute("position");
  const uvAttr = geometry.getAttribute("uv");
  const indexAttr = geometry.getIndex();

  if (!posAttr || !uvAttr) {
    return { positions: new Float32Array(0), seeds: new Float32Array(0) };
  }

  let texData: Uint8ClampedArray | null = null;
  let texW = 0;
  let texH = 0;
  const flipY = baseTexture ? baseTexture.flipY : false;

  const img = baseTexture?.image as
    | (CanvasImageSource & { width?: number; height?: number })
    | undefined;
  if (img && img.width && img.height) {
    try {
      const maxSampleDim = 128;
      const sampleW = Math.min(img.width, maxSampleDim);
      const sampleH = Math.min(img.height, maxSampleDim);
      const offscreen = document.createElement("canvas");
      offscreen.width = sampleW;
      offscreen.height = sampleH;
      const ctx = offscreen.getContext("2d", { willReadFrequently: true });
      if (ctx) {
        ctx.drawImage(img, 0, 0, sampleW, sampleH);
        texData = ctx.getImageData(0, 0, sampleW, sampleH).data;
        texW = sampleW;
        texH = sampleH;
      }
    } catch {
      texData = null;
    }
  }

  const triCount = indexAttr
    ? Math.floor(indexAttr.count / 3)
    : Math.floor(posAttr.count / 3);
  const cumAreas = new Float32Array(triCount);
  const v0 = new THREE.Vector3();
  const v1 = new THREE.Vector3();
  const v2 = new THREE.Vector3();
  const e1 = new THREE.Vector3();
  const e2 = new THREE.Vector3();
  const cross = new THREE.Vector3();

  let totalArea = 0;
  for (let t = 0; t < triCount; t++) {
    const i0 = indexAttr ? indexAttr.getX(t * 3) : t * 3;
    const i1 = indexAttr ? indexAttr.getX(t * 3 + 1) : t * 3 + 1;
    const i2 = indexAttr ? indexAttr.getX(t * 3 + 2) : t * 3 + 2;
    v0.fromBufferAttribute(posAttr, i0);
    v1.fromBufferAttribute(posAttr, i1);
    v2.fromBufferAttribute(posAttr, i2);
    e1.subVectors(v1, v0);
    e2.subVectors(v2, v0);
    cross.crossVectors(e1, e2);
    totalArea += 0.5 * cross.length();
    cumAreas[t] = totalArea;
  }

  if (triCount === 0 || totalArea <= 0) {
    return { positions: new Float32Array(0), seeds: new Float32Array(0) };
  }

  const rand = mulberry32(202606);
  const picked: number[] = [];
  const seedsList: number[] = [];
  const p = new THREE.Vector3();

  let attempts = 0;
  const maxAttempts = CONFIG.markerCount * 40;
  while (picked.length < CONFIG.markerCount && attempts < maxAttempts) {
    attempts++;
    const target = rand() * totalArea;
    let lo = 0;
    let hi = triCount - 1;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (cumAreas[mid] < target) lo = mid + 1;
      else hi = mid;
    }

    const i0 = indexAttr ? indexAttr.getX(lo * 3) : lo * 3;
    const i1 = indexAttr ? indexAttr.getX(lo * 3 + 1) : lo * 3 + 1;
    const i2 = indexAttr ? indexAttr.getX(lo * 3 + 2) : lo * 3 + 2;

    let r1 = rand();
    let r2 = rand();
    if (r1 + r2 > 1) {
      r1 = 1 - r1;
      r2 = 1 - r2;
    }
    const r0 = 1 - r1 - r2;

    const u =
      r0 * uvAttr.getX(i0) + r1 * uvAttr.getX(i1) + r2 * uvAttr.getX(i2);
    const v =
      r0 * uvAttr.getY(i0) + r1 * uvAttr.getY(i1) + r2 * uvAttr.getY(i2);

    if (texData && texW > 0 && texH > 0) {
      const px = clamp(Math.floor(((u % 1) + 1) % 1 * texW), 0, texW - 1);
      const rawV = ((v % 1) + 1) % 1;
      const py = clamp(
        Math.floor((flipY ? 1 - rawV : rawV) * texH),
        0,
        texH - 1
      );
      const idx = (py * texW + px) * 4;
      const cr = texData[idx];
      const cg = texData[idx + 1];
      const cb = texData[idx + 2];
      if (cb > cr + 6 && cb > cg + 6) {
        continue;
      }
    }

    v0.fromBufferAttribute(posAttr, i0);
    v1.fromBufferAttribute(posAttr, i1);
    v2.fromBufferAttribute(posAttr, i2);
    p.copy(v0)
      .multiplyScalar(r0)
      .addScaledVector(v1, r1)
      .addScaledVector(v2, r2);
    if (p.lengthSq() > 0) {
      p.normalize().multiplyScalar(geomRadius * 1.012);
    }
    picked.push(p.x, p.y, p.z);
    seedsList.push(rand());
  }

  return {
    positions: new Float32Array(picked),
    seeds: new Float32Array(seedsList),
  };
}

function createRadarMaterial(
  colorHex: string,
  size: number,
  speed: number,
  uTime: { value: number },
  uRes: { value: THREE.Vector2 }
): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    uniforms: {
      uColor: { value: hexToVec3(colorHex) },
      uTime,
      uSize: { value: size },
      uSpeed: { value: speed },
      uRes,
    },
    vertexShader: `
      attribute float seed;
      uniform float uSize;
      uniform vec2 uRes;
      varying float vSeed;
      varying float vFade;
      void main(){
        vSeed = seed;
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        vec3 vn = normalize(normalMatrix * normalize(position));
        vec3 vd = normalize(-mv.xyz);
        vFade = smoothstep(0.15, 0.5, dot(vn, vd));
        gl_PointSize = max(uSize * uRes.y / 900.0 * (7.0 / max(-mv.z, 1.0)), 2.0);
        gl_Position = projectionMatrix * mv;
      }
    `,
    fragmentShader: `
      uniform vec3 uColor;
      uniform float uTime;
      uniform float uSpeed;
      varying float vSeed;
      varying float vFade;
      void main(){
        if (vFade <= 0.001) discard;
        vec2 p = gl_PointCoord - 0.5;
        float d = length(p) * 2.0;
        if (d > 1.0) discard;
        float core = smoothstep(0.30, 0.0, d) * 1.2;
        float ph = fract(uTime * uSpeed + vSeed);
        float ring = smoothstep(0.07, 0.0, abs(d - ph)) * (1.0 - ph);
        gl_FragColor = vec4(uColor, clamp(core + ring, 0.0, 1.0) * vFade);
      }
    `,
    transparent: true,
    depthTest: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
}

export default function PlanetCanvas({ casePoints }: PlanetCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [webglFailed, setWebglFailed] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let disposed = false;
    let rafId = 0;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: false,
        antialias: true,
        powerPreference: "high-performance",
      });
    } catch {
      const id = window.setTimeout(() => setWebglFailed(true), 0);
      return () => window.clearTimeout(id);
    }

    const width = window.innerWidth || 1280;
    const height = window.innerHeight || 720;
    const dpr = clamp(window.devicePixelRatio || 1, 1, 1.5);

    renderer.setPixelRatio(dpr);
    renderer.setSize(width, height, false);
    renderer.outputEncoding = THREE.sRGBEncoding;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 200);
    camera.position.set(0, 0, 8);
    scene.add(camera);

    const bgGeo = new THREE.PlaneGeometry(2, 2);
    const bgMat = new THREE.ShaderMaterial({
      uniforms: {
        uBg: { value: hexToVec3(CONFIG.bgColor) },
        uGlow: { value: hexToVec3(CONFIG.flameColor) },
      },
      vertexShader: `
        varying vec2 vUv;
        void main(){
          vUv = uv;
          gl_Position = vec4(position.xy, 0.0, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 uBg;
        uniform vec3 uGlow;
        varying vec2 vUv;
        void main(){
          vec2 uv = 2.0 * vUv - 1.0;
          vec3 col = uBg * (1.0 - 0.42 * length(uv));
          float corner = smoothstep(-0.75, 1.0, -uv.y * uv.x);
          col += uGlow * (corner * corner * 0.085);
          gl_FragColor = vec4(col, 1.0);
        }
      `,
      depthTest: false,
      depthWrite: false,
    });
    const bgMesh = new THREE.Mesh(bgGeo, bgMat);
    bgMesh.frustumCulled = false;
    bgMesh.renderOrder = -100;
    scene.add(bgMesh);

    const ambientLight = new THREE.AmbientLight(0xffffff, 1.15);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.65);
    directionalLight.position.set(0, 10, 2);
    scene.add(directionalLight);

    const worldGroup = new THREE.Group();
    worldGroup.position.set(STOPS_X[0].v, STOPS_Y[0].v + ENTRY_START_Y, 0);
    worldGroup.scale.setScalar(STOPS_S[0].v);
    scene.add(worldGroup);

    const planetGroup = new THREE.Group();
    planetGroup.rotation.z = CONFIG.tilt;
    planetGroup.rotation.y = CONFIG.initRotation;
    worldGroup.add(planetGroup);

    const cloudGroup = new THREE.Group();
    cloudGroup.rotation.z = CONFIG.tilt;
    cloudGroup.visible = false;
    worldGroup.add(cloudGroup);

    const glowGeo = new THREE.PlaneGeometry(2, 2);
    const glowMat = new THREE.ShaderMaterial({
      uniforms: {
        uGlow: { value: hexToVec3(CONFIG.glowColor) },
        uIntensity: { value: CONFIG.glowIntensity },
      },
      vertexShader: `
        varying vec2 vUv;
        void main(){
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 uGlow;
        uniform float uIntensity;
        varying vec2 vUv;
        void main(){
          float d = length(vUv - 0.5) * 2.0;
          float a = pow(clamp(1.0 - d, 0.0, 1.0), 2.2);
          gl_FragColor = vec4(uGlow * a * uIntensity, a);
        }
      `,
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const glowMesh = new THREE.Mesh(glowGeo, glowMat);
    glowMesh.scale.setScalar(CONFIG.planetRadius * 2.3);
    worldGroup.add(glowMesh);

    const uRes = { value: new THREE.Vector2(width, height) };
    const planetTime = { value: 0 };
    const starTime = { value: 0 };
    const markerTime = { value: 0 };
    const atmoTime = { value: 0 };

    const placeholderMesh = createPlaceholderEarthMesh(
      CONFIG.planetRadius,
      CONFIG.rimColor
    );
    planetGroup.add(placeholderMesh);

    let casePts: THREE.Points | null = null;
    if (casePoints.length > 0) {
      const projected = projectCasesOntoMesh(CONFIG.planetRadius, casePoints);
      const caseGeo = new THREE.BufferGeometry();
      caseGeo.setAttribute(
        "position",
        new THREE.BufferAttribute(projected.positions, 3)
      );
      caseGeo.setAttribute(
        "seed",
        new THREE.BufferAttribute(projected.seeds, 1)
      );
      casePts = new THREE.Points(
        caseGeo,
        createRadarMaterial(
          CONFIG.caseMarkerColor,
          CONFIG.caseMarkerSize,
          CONFIG.caseMarkerSpeed,
          markerTime,
          uRes
        )
      );
      planetGroup.add(casePts);
    }

    const moteRand = mulberry32(4201);
    const motePos = new Float32Array(CONFIG.atmoCount * 3);
    const moteSize = new Float32Array(CONFIG.atmoCount);
    const moteSeed = new Float32Array(CONFIG.atmoCount);
    for (let i = 0; i < CONFIG.atmoCount; i++) {
      motePos[i * 3] = moteRand() * 2 - 1;
      motePos[i * 3 + 1] = moteRand() * 2 - 1;
      motePos[i * 3 + 2] = moteRand() * 2 - 1;
      moteSize[i] = CONFIG.atmoSize * (0.4 + moteRand());
      moteSeed[i] = moteRand() * 10;
    }
    const moteGeo = new THREE.BufferGeometry();
    moteGeo.setAttribute("position", new THREE.BufferAttribute(motePos, 3));
    moteGeo.setAttribute("size", new THREE.BufferAttribute(moteSize, 1));
    moteGeo.setAttribute("seed", new THREE.BufferAttribute(moteSeed, 1));

    const moteMat = new THREE.ShaderMaterial({
      uniforms: {
        uTime: atmoTime,
        uRes,
        uColor: { value: hexToVec3(CONFIG.atmoColor) },
      },
      vertexShader: `
        attribute float size;
        attribute float seed;
        uniform float uTime;
        uniform vec2 uRes;
        varying float vA;
        vec3 warp(vec3 p, float t){
          float c=0.9,a=1.9,b=0.02,s=0.05; p*=2.;
          p.x+=c*sin(s*t+a*p.y)+t*b; p.y+=c*cos(s*t+a*p.x); p.y+=c*sin(s*t+a*p.z)+t*b;
          p.z+=c*cos(s*t+a*p.y); p.z+=c*sin(s*t+a*p.x)+t*b; p.x+=c*cos(s*t+a*p.z);
          return cos(p+vec3(1,2,4));
        }
        void main(){
          vec3 v = position*4.0 + warp(position, uTime)*1.2;
          vec4 mv = modelViewMatrix * vec4(v, 1.0);
          float r = length(v);
          float farF = 1.0 - smoothstep(5.0, 6.5, r);
          float nearF = smoothstep(0.0, 0.5, -mv.z);
          vA = farF * nearF;
          gl_PointSize = max(size * uRes.y / 900.0 / -mv.z, 1.0);
          gl_Position = projectionMatrix * mv;
        }
      `,
      fragmentShader: `
        uniform vec3 uColor;
        varying float vA;
        void main(){
          vec2 p = gl_PointCoord - 0.5;
          float l = length(p);
          if (l > 0.5) discard;
          float tex = smoothstep(0.5, 0.0, l);
          gl_FragColor = vec4(uColor * tex, tex * vA * 0.55);
        }
      `,
      transparent: true,
      depthWrite: false,
      depthTest: false,
      blending: THREE.AdditiveBlending,
    });
    const motePoints = new THREE.Points(moteGeo, moteMat);
    motePoints.frustumCulled = false;
    scene.add(motePoints);

    const starRand = mulberry32(9901);
    const starPos = new Float32Array(CONFIG.starCount * 3);
    const starSeed = new Float32Array(CONFIG.starCount);
    const starBright = new Float32Array(CONFIG.starCount);
    for (let i = 0; i < CONFIG.starCount; i++) {
      const u = starRand() * 2 - 1;
      const theta = starRand() * Math.PI * 2;
      const root = Math.sqrt(Math.max(0, 1 - u * u));
      starPos[i * 3] = 90 * root * Math.cos(theta);
      starPos[i * 3 + 1] = 90 * root * Math.sin(theta);
      starPos[i * 3 + 2] = 90 * u;
      starSeed[i] = starRand() * 20;
      starBright[i] = 0.35 + starRand() * 0.65;
    }
    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute("position", new THREE.BufferAttribute(starPos, 3));
    starGeo.setAttribute("seed", new THREE.BufferAttribute(starSeed, 1));
    starGeo.setAttribute("bright", new THREE.BufferAttribute(starBright, 1));

    const starMat = new THREE.ShaderMaterial({
      uniforms: {
        uTime: starTime,
        uSize: { value: CONFIG.starSize },
        uFlicker: { value: CONFIG.starFlicker },
        uColor: { value: hexToVec3(CONFIG.starColor) },
        uRes,
      },
      vertexShader: `
        attribute float seed;
        attribute float bright;
        uniform float uTime;
        uniform float uSize;
        uniform float uFlicker;
        uniform vec2 uRes;
        varying float vTw;
        void main(){
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          float tw = 0.6 + 0.4 * sin(uTime * uFlicker + seed);
          vTw = bright * tw;
          gl_PointSize = max(uSize * uRes.y / 900.0 * (90.0 / max(-mv.z, 1.0)), 1.0);
          gl_Position = projectionMatrix * mv;
        }
      `,
      fragmentShader: `
        uniform vec3 uColor;
        varying float vTw;
        void main(){
          vec2 p = gl_PointCoord - 0.5;
          float l = length(p);
          if (l > 0.5) discard;
          float core = smoothstep(0.5, 0.0, l);
          gl_FragColor = vec4(uColor, core * vTw);
        }
      `,
      transparent: true,
      depthWrite: false,
      depthTest: true,
      blending: THREE.AdditiveBlending,
    });
    const starPoints = new THREE.Points(starGeo, starMat);
    starPoints.frustumCulled = false;
    scene.add(starPoints);

    const cloudMeshes: { mesh: THREE.Mesh; spin: number }[] = [];

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let reduceMotion = motionQuery.matches;

    let entryActive = !reduceMotion;
    let entryElapsed = 0;
    let entryY = reduceMotion ? 0 : ENTRY_START_Y;

    let curP = 0;
    let curX: number = STOPS_X[0].v;
    let curY: number = STOPS_Y[0].v;
    let curS: number = STOPS_S[0].v;
    let spinPhase = 0;

    const getScrollProgress = () => {
      const maxScroll = Math.max(
        1,
        document.documentElement.scrollHeight - window.innerHeight
      );
      return clamp(window.scrollY / maxScroll, 0, 1);
    };

    const syncStaticScroll = () => {
      const p = getScrollProgress();
      const sideScale = clamp((window.innerWidth || 1200) / 1200, 0.5, 1);
      curP = p;
      curX = sampleStops(STOPS_X, p) * sideScale;
      curY = sampleStops(STOPS_Y, p);
      curS = sampleStops(STOPS_S, p);
      worldGroup.position.set(curX, curY, 0);
      worldGroup.scale.setScalar(curS);
      planetGroup.rotation.y = CONFIG.initRotation + p * Math.PI * 1.6;
      cloudGroup.rotation.y = planetGroup.rotation.y;
    };

    const renderScene = () => {
      glowMesh.quaternion.copy(camera.quaternion);
      motePoints.position.copy(camera.position);
      renderer.render(scene, camera);
    };

    const fallbackBlackTex = new THREE.DataTexture(
      new Uint8Array([0, 0, 0, 255]),
      1,
      1
    );
    fallbackBlackTex.needsUpdate = true;

    const nightTexUniform: { value: THREE.Texture } = {
      value: fallbackBlackTex,
    };
    const extraDisposableTextures: THREE.Texture[] = [fallbackBlackTex];

    const texLoader = new THREE.TextureLoader();
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath(EARTH_ASSETS.dracoPath);
    dracoLoader.preload();

    const gltfLoader = new GLTFLoader();
    gltfLoader.setDRACOLoader(dracoLoader);

    loadParallelEarthAssets({
      gltfLoader,
      texLoader,
      planetRadius: CONFIG.planetRadius,
      nightTexUniform,
      planetTimeUniform: planetTime,
      cloudConfigs: HOME_CLOUD_LAYERS,
      rimColor: CONFIG.rimColor,
      isDisposed: () => disposed,
      onTextureCreated: (tex) => extraDisposableTextures.push(tex),
      onCloudsReady: (layers) => {
        for (const layer of layers) {
          cloudGroup.add(layer.mesh);
          cloudMeshes.push(layer);
        }
        cloudGroup.visible = true;
      },
      onPlanetReady: (planetMesh, { rawRadius, mapTexture }) => {
        const land = sampleLandPoints(planetMesh, rawRadius, mapTexture);
        if (land.positions.length > 0) {
          const landGeo = new THREE.BufferGeometry();
          landGeo.setAttribute(
            "position",
            new THREE.BufferAttribute(land.positions, 3)
          );
          landGeo.setAttribute(
            "seed",
            new THREE.BufferAttribute(land.seeds, 1)
          );
          const landPts = new THREE.Points(
            landGeo,
            createRadarMaterial(
              CONFIG.markerColor,
              CONFIG.markerSize,
              CONFIG.markerSpeed,
              markerTime,
              uRes
            )
          );
          planetMesh.add(landPts);
        }

        planetGroup.remove(placeholderMesh);
        placeholderMesh.geometry.dispose();
        placeholderMesh.material.dispose();
        planetGroup.add(planetMesh);

        if (reduceMotion) {
          syncStaticScroll();
          renderScene();
        }
      },
      onUpdatedStaticFrame: () => {
        if (reduceMotion) renderScene();
      },
    });

    const handleResize = () => {
      if (disposed) return;
      const w = window.innerWidth || 1280;
      const h = window.innerHeight || 720;
      const nextDpr = clamp(window.devicePixelRatio || 1, 1, 1.5);

      camera.aspect = w / h;
      camera.updateProjectionMatrix();

      renderer.setPixelRatio(nextDpr);
      renderer.setSize(w, h, false);
      uRes.value.set(w, h);

      if (reduceMotion) {
        syncStaticScroll();
        renderScene();
      }
    };

    window.addEventListener("resize", handleResize);

    const handleScrollForReducedMotion = () => {
      if (reduceMotion) {
        syncStaticScroll();
        renderScene();
      }
    };
    window.addEventListener("scroll", handleScrollForReducedMotion, {
      passive: true,
    });

    let lastTime = performance.now();

    const tick = (now: number) => {
      if (disposed || document.hidden) {
        rafId = 0;
        return;
      }
      const dt = Math.min(0.05, Math.max(0.001, (now - lastTime) * 0.001));
      lastTime = now;

      planetTime.value += dt / 12;
      starTime.value += dt;
      markerTime.value += dt;
      atmoTime.value = now * 0.001 * CONFIG.atmoSpeed * 8;

      const pTarget = getScrollProgress();
      curP += (pTarget - curP) * Math.min(1, dt * 4.5);

      const sideScale = clamp((window.innerWidth || 1200) / 1200, 0.5, 1);
      const damp = Math.min(1, dt * 3.2);
      curX += (sampleStops(STOPS_X, curP) * sideScale - curX) * damp;
      curY += (sampleStops(STOPS_Y, curP) - curY) * damp;
      curS += (sampleStops(STOPS_S, curP) - curS) * damp;

      if (entryActive) {
        entryElapsed += dt;
        const t = clamp(entryElapsed / ENTRY_DUR, 0, 1);
        const eased = 1 - Math.pow(1 - t, 3);
        entryY = lerp(ENTRY_START_Y, 0, eased);
        if (t >= 1) {
          entryActive = false;
          entryY = 0;
        }
      }

      worldGroup.position.set(curX, curY + entryY, 0);
      worldGroup.scale.setScalar(curS);

      spinPhase += dt * CONFIG.spin;
      const planetRot =
        CONFIG.initRotation + spinPhase + curP * Math.PI * 1.6;
      planetGroup.rotation.y = planetRot;
      cloudGroup.rotation.y = planetRot;

      for (const layer of cloudMeshes) {
        layer.mesh.rotation.y += dt * layer.spin;
      }

      renderScene();
      rafId = requestAnimationFrame(tick);
    };

    const startAnimation = () => {
      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = 0;
      }
      if (reduceMotion) {
        syncStaticScroll();
        renderScene();
      } else if (!document.hidden) {
        lastTime = performance.now();
        rafId = requestAnimationFrame(tick);
      }
    };

    const handleVisibilityChange = () => {
      if (disposed || reduceMotion) return;
      if (document.hidden) {
        if (rafId) {
          cancelAnimationFrame(rafId);
          rafId = 0;
        }
      } else {
        lastTime = performance.now();
        if (!rafId) {
          rafId = requestAnimationFrame(tick);
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    startAnimation();

    const handleMotionChange = (event: MediaQueryListEvent) => {
      reduceMotion = event.matches;
      entryActive = false;
      entryY = 0;
      startAnimation();
    };
    motionQuery.addEventListener("change", handleMotionChange);

    return () => {
      disposed = true;
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScrollForReducedMotion);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      motionQuery.removeEventListener("change", handleMotionChange);

      dracoLoader.dispose();
      disposeSceneObjects(scene);

      if (casePts && !casePts.parent) {
        casePts.geometry.dispose();
        disposeMaterial(casePts.material as THREE.Material);
      }

      extraDisposableTextures.forEach((tex) => tex.dispose());
      renderer.dispose();
    };
  }, [casePoints]);

  if (webglFailed) {
    return <div className="cosmos-fallback-backdrop" aria-hidden="true" />;
  }

  return (
    <canvas
      ref={canvasRef}
      className="planet-canvas"
      aria-hidden="true"
    />
  );
}
