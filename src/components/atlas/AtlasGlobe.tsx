"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import createGlobe, { type Globe } from "cobe";
import type { AtlasCase } from "@/modules/atlas/types";
import {
  ROTATION_SPEED,
  INITIAL_PHI,
  INITIAL_THETA,
  DRAG_FACTOR,
  MIN_THETA,
  MAX_THETA,
  MAX_DPR,
  DEFAULT_MARKER_SIZE,
  SELECTED_MARKER_SIZE,
  GLOBE_DARK,
  GLOBE_DIFFUSE,
  GLOBE_MAP_SAMPLES,
  GLOBE_MAP_BRIGHTNESS,
  GLOBE_BASE_COLOR_RGB,
  GLOBE_DEFAULT_MARKER_COLOR_RGB,
  GLOBE_GLOW_COLOR_RGB,
  SELECTED_MARKER_COLOR_RGB,
  hexToRgb01,
  getSafeMarkerId,
} from "@/modules/atlas/constants";

export type AtlasGlobeLabels = {
  emptyTitle: string;
  emptyDescription: string;
  webglUnavailableTitle: string;
  webglUnavailableDescription: string;
  canvasAria: string;
};

type AtlasGlobeProps = {
  cases: AtlasCase[];
  selectedSlug: string | null;
  onSelect: (slug: string) => void;
  labels: AtlasGlobeLabels;
};

const emptySubscribe = () => () => {};

function getWebglSupported(): boolean {
  try {
    const testCanvas = document.createElement("canvas");
    return Boolean(
      testCanvas.getContext("webgl2") || testCanvas.getContext("webgl")
    );
  } catch {
    return false;
  }
}

/**
 * Projects a spherical [lat, lng] coordinate to 2D canvas pixel coordinates
 * and calculates whether the marker is currently on the front-facing hemisphere.
 */
function projectMarker(
  lat: number,
  lng: number,
  phi: number,
  theta: number,
  width: number,
  height: number,
  elevation = 0.05
) {
  const radLat = (lat * Math.PI) / 180;
  const radLng = (lng * Math.PI) / 180 - Math.PI;
  const cosLat = Math.cos(radLat);
  const r = 0.8 + elevation;
  const pt0 = -cosLat * Math.cos(radLng) * r;
  const pt1 = Math.sin(radLat) * r;
  const pt2 = cosLat * Math.sin(radLng) * r;

  const cosL = Math.cos(theta);
  const cosF = Math.cos(phi);
  const sinL = Math.sin(theta);
  const sinF = Math.sin(phi);

  const c = cosF * pt0 + sinF * pt2;
  const s = sinF * sinL * pt0 + cosL * pt1 - cosF * sinL * pt2;

  const aspect = width / height;
  const x = (((c / aspect) + 1) / 2) * width;
  const y = ((-s + 1) / 2) * height;
  const visible =
    -sinF * cosL * pt0 + sinL * pt1 + cosF * cosL * pt2 >= 0 ||
    c * c + s * s >= 0.64;

  return { x, y, visible };
}

/**
 * Finds the front-facing marker closest to the given screen coordinates within hitRadius pixels.
 */
function findMarkerAtPoint(
  clientX: number,
  clientY: number,
  canvas: HTMLCanvasElement,
  phi: number,
  theta: number,
  casesList: AtlasCase[],
  hitRadius = 26
): string | null {
  const rect = canvas.getBoundingClientRect();
  const clickX = clientX - rect.left;
  const clickY = clientY - rect.top;

  let closestSlug: string | null = null;
  let minDistance = hitRadius;

  for (const c of casesList) {
    const { x, y, visible } = projectMarker(
      c.lat,
      c.lng,
      phi,
      theta,
      rect.width,
      rect.height
    );
    if (!visible) continue;

    const dist = Math.hypot(clickX - x, clickY - y);
    if (dist < minDistance) {
      minDistance = dist;
      closestSlug = c.slug;
    }
  }

  return closestSlug;
}

export default function AtlasGlobe({
  cases,
  selectedSlug,
  onSelect,
  labels,
}: AtlasGlobeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const globeRef = useRef<Globe | null>(null);

  // Keep interaction and selection state in refs to prevent per-frame React re-renders
  const selectedSlugRef = useRef<string | null>(selectedSlug);
  useEffect(() => {
    selectedSlugRef.current = selectedSlug;
  }, [selectedSlug]);

  const onSelectRef = useRef(onSelect);
  useEffect(() => {
    onSelectRef.current = onSelect;
  }, [onSelect]);

  const [runtimeError, setRuntimeError] = useState(false);
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null);
  const hoveredSlugRef = useRef<string | null>(null);

  const isWebglSupported = useSyncExternalStore(
    emptySubscribe,
    getWebglSupported,
    () => true
  );

  const isWebglUnavailable = !isWebglSupported || runtimeError;

  const casesRef = useRef(cases);
  useEffect(() => {
    casesRef.current = cases;
  }, [cases]);

  // Update marker sizes and highlights on selection change without destroying WebGL context
  useEffect(() => {
    if (!globeRef.current || cases.length === 0) return;

    try {
      const markers = cases.map((c) => {
        const isSelected = c.slug === selectedSlug;
        return {
          id: getSafeMarkerId(c.slug),
          location: [c.lat, c.lng] as [number, number],
          size: isSelected ? SELECTED_MARKER_SIZE : DEFAULT_MARKER_SIZE,
          color: isSelected ? SELECTED_MARKER_COLOR_RGB : hexToRgb01(c.domain.color),
        };
      });

      globeRef.current.update({ markers });
    } catch (err) {
      console.error("[components/atlas/AtlasGlobe] Failed to update markers:", err);
    }
  }, [cases, selectedSlug]);

  // Main globe lifecycle effect: created once per mount
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container || casesRef.current.length === 0 || !isWebglSupported) return;

    let isMounted = true;
    const onContextLost = (e: Event) => {
      e.preventDefault();
      if (!isMounted) return;
      console.warn("[components/atlas/AtlasGlobe] WebGL context lost:", e);
      setRuntimeError(true);
    };

    const onContextRestored = () => {
      if (!isMounted) return;
      console.info("[components/atlas/AtlasGlobe] WebGL context restored.");
      setRuntimeError(false);
    };

    canvas.addEventListener("webglcontextlost", onContextLost);
    canvas.addEventListener("webglcontextrestored", onContextRestored);

    const dpr = Math.min(
      typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1,
      MAX_DPR
    );

    let phi = INITIAL_PHI;
    let theta = INITIAL_THETA;
    let dragging = false;
    let lastX = 0;
    let lastY = 0;
    let rafId = 0;

    // Monitor prefers-reduced-motion to pause auto-rotation
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let prefersReducedMotion = mediaQuery.matches;
    const onMotionPreferenceChange = (e: MediaQueryListEvent) => {
      prefersReducedMotion = e.matches;
    };
    mediaQuery.addEventListener("change", onMotionPreferenceChange);

    const initialMarkers = casesRef.current.map((c) => {
      const isSelected = c.slug === selectedSlugRef.current;
      return {
        id: getSafeMarkerId(c.slug),
        location: [c.lat, c.lng] as [number, number],
        size: isSelected ? SELECTED_MARKER_SIZE : DEFAULT_MARKER_SIZE,
        color: isSelected ? SELECTED_MARKER_COLOR_RGB : hexToRgb01(c.domain.color),
      };
    });

    const initialWidth = Math.max(
      1,
      Math.round(container.offsetWidth || container.clientWidth || 720)
    );
    const initialHeight = Math.max(
      1,
      Math.round(container.offsetHeight || container.clientHeight || 720)
    );

    let globeInstance: Globe;
    try {
      globeInstance = createGlobe(canvas, {
        devicePixelRatio: dpr,
        width: initialWidth,
        height: initialHeight,
        phi,
        theta,
        dark: GLOBE_DARK,
        diffuse: GLOBE_DIFFUSE,
        mapSamples: GLOBE_MAP_SAMPLES,
        mapBrightness: GLOBE_MAP_BRIGHTNESS,
        baseColor: GLOBE_BASE_COLOR_RGB,
        markerColor: GLOBE_DEFAULT_MARKER_COLOR_RGB,
        glowColor: GLOBE_GLOW_COLOR_RGB,
        markers: initialMarkers,
      });
      globeRef.current = globeInstance;
    } catch (err) {
      console.error(
        "[components/atlas/AtlasGlobe] createGlobe failed to initialize WebGL shaders/pipeline:",
        err
      );
      queueMicrotask(() => setRuntimeError(true));
      mediaQuery.removeEventListener("change", onMotionPreferenceChange);
      canvas.removeEventListener("webglcontextlost", onContextLost);
      return;
    }

    // Single animation frame loop: keeps calling globeInstance.update every frame.
    // Selection only stops phi from advancing; rendering never halts.
    const tick = () => {
      if (!dragging && !selectedSlugRef.current && !prefersReducedMotion) {
        phi += ROTATION_SPEED;
      }
      globeInstance.update({ phi, theta });

      // Update floating tooltip position in lockstep with globe rotation
      if (tooltipRef.current) {
        const activeSlug = hoveredSlugRef.current || selectedSlugRef.current;
        if (!activeSlug) {
          tooltipRef.current.style.opacity = "0";
          tooltipRef.current.style.pointerEvents = "none";
        } else {
          const c = casesRef.current.find((item) => item.slug === activeSlug);
          if (c) {
            const w = container.offsetWidth || 720;
            const h = container.offsetHeight || 720;
            const { x, y, visible } = projectMarker(c.lat, c.lng, phi, theta, w, h);
            if (visible) {
              tooltipRef.current.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -100%) translateY(-14px)`;
              tooltipRef.current.style.opacity = "1";
              tooltipRef.current.style.pointerEvents = "auto";
            } else {
              tooltipRef.current.style.opacity = "0";
              tooltipRef.current.style.pointerEvents = "none";
            }
          }
        }
      }

      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    // Pointer events for dragging and direct marker clicks/hovers
    let startX = 0;
    let startY = 0;
    let startTime = 0;
    let hasDragged = false;

    const onDown = (e: PointerEvent) => {
      dragging = true;
      hasDragged = false;
      startX = e.clientX;
      startY = e.clientY;
      lastX = e.clientX;
      lastY = e.clientY;
      startTime = performance.now();
      canvas.setPointerCapture(e.pointerId);
    };

    const onMove = (e: PointerEvent) => {
      if (dragging) {
        const dist = Math.hypot(e.clientX - startX, e.clientY - startY);
        if (dist > 5) {
          hasDragged = true;
        }
        phi += (e.clientX - lastX) / DRAG_FACTOR;
        theta = Math.max(MIN_THETA, Math.min(MAX_THETA, theta + (e.clientY - lastY) / DRAG_FACTOR));
        lastX = e.clientX;
        lastY = e.clientY;
        globeInstance.update({ phi, theta });
      } else {
        // Hover detection when moving over canvas
        const hovered = findMarkerAtPoint(e.clientX, e.clientY, canvas, phi, theta, casesRef.current, 26);
        if (hovered) {
          canvas.style.cursor = "pointer";
          if (hoveredSlugRef.current !== hovered) {
            hoveredSlugRef.current = hovered;
            setHoveredSlug(hovered);
          }
        } else {
          canvas.style.cursor = "grab";
          if (hoveredSlugRef.current !== null) {
            hoveredSlugRef.current = null;
            setHoveredSlug(null);
          }
        }
      }
    };

    const onUp = (e: PointerEvent) => {
      const wasDragging = dragging;
      dragging = false;

      // Detect click / tap if pointer didn't drag significantly and duration is short
      if (wasDragging && !hasDragged && performance.now() - startTime < 500) {
        const clickedSlug = findMarkerAtPoint(e.clientX, e.clientY, canvas, phi, theta, casesRef.current, 26);
        if (clickedSlug) {
          onSelectRef.current(clickedSlug);
        }
      }
    };

    const onLeave = () => {
      if (!dragging) {
        canvas.style.cursor = "grab";
        if (hoveredSlugRef.current !== null) {
          hoveredSlugRef.current = null;
          setHoveredSlug(null);
        }
      }
    };

    canvas.addEventListener("pointerdown", onDown);
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerup", onUp);
    canvas.addEventListener("pointercancel", onUp);
    canvas.addEventListener("pointerleave", onLeave);

    // ResizeObserver to handle container size changes with logical dimensions.
    // Ignores zero/NaN sizes and triggers an immediate redraw in the same frame.
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        if (
          width > 0 &&
          height > 0 &&
          !Number.isNaN(width) &&
          !Number.isNaN(height) &&
          globeRef.current
        ) {
          const roundedWidth = Math.round(width);
          const roundedHeight = Math.round(height);
          if (roundedWidth > 0 && roundedHeight > 0) {
            globeRef.current.update({
              width: roundedWidth,
              height: roundedHeight,
            });
            // Immediately redraw in the same frame after size change
            globeRef.current.update({ phi, theta });
          }
        }
      }
    });
    resizeObserver.observe(container);

    return () => {
      isMounted = false;
      cancelAnimationFrame(rafId);
      mediaQuery.removeEventListener("change", onMotionPreferenceChange);
      resizeObserver.disconnect();
      canvas.removeEventListener("webglcontextlost", onContextLost);
      canvas.removeEventListener("webglcontextrestored", onContextRestored);
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerup", onUp);
      canvas.removeEventListener("pointercancel", onUp);
      canvas.removeEventListener("pointerleave", onLeave);
      globeInstance.destroy();
      globeRef.current = null;
    };
  }, [isWebglSupported]);

  if (cases.length === 0) {
    return (
      <div className="relative mx-auto aspect-square w-full max-w-[720px] flex flex-col items-center justify-center rounded-xl border border-slate-800/80 bg-slate-900/40 p-6 text-center text-slate-400">
        <p className="text-sm font-medium text-slate-300">{labels.emptyTitle}</p>
        <p className="mt-1 text-xs text-slate-500">
          {labels.emptyDescription}
        </p>
      </div>
    );
  }

  if (isWebglUnavailable) {
    return (
      <div className="relative mx-auto aspect-square w-full max-w-[720px] flex flex-col items-center justify-center rounded-xl border border-slate-800 bg-slate-900/60 p-6 text-center text-slate-400">
        <p className="text-sm font-medium text-slate-200">{labels.webglUnavailableTitle}</p>
        <p className="mt-1.5 max-w-sm text-xs text-slate-400 leading-relaxed">
          {labels.webglUnavailableDescription}
        </p>
        {runtimeError && (
          <button
            type="button"
            onClick={() => setRuntimeError(false)}
            className="mt-4 rounded-md bg-amber-500 px-3.5 py-1.5 text-xs font-semibold text-slate-950 shadow hover:bg-amber-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400 transition-colors"
          >
            Coba lagi
          </button>
        )}
      </div>
    );
  }

  const activeSlug = hoveredSlug || selectedSlug;
  const activeCase = activeSlug ? cases.find((c) => c.slug === activeSlug) : null;

  return (
    <div
      ref={containerRef}
      className="relative mx-auto aspect-square w-full max-w-[720px]"
    >
      {/*
        Quarantined Canvas Mount Container.
        cobe v2 mutates the DOM by creating a wrapper <div> (Z) and reparenting canvas inside it.
        Isolating <canvas> inside its own dedicated <div> guarantees that cobe's DOM mutations
        never interfere with React's Fiber reconciliation.
      */}
      <div className="absolute inset-0">
        <canvas
          ref={canvasRef}
          role="img"
          aria-label={labels.canvasAria}
          className="h-full w-full cursor-grab touch-none active:cursor-grabbing"
        />
      </div>

      {/*
        Floating Interactive Marker Tooltip.
        Positioned smoothly in lockstep with the globe rotation via requestAnimationFrame.
        Clickable so clicking either the globe dot or the floating tooltip selects the case.
      */}
      <div
        ref={tooltipRef}
        className="absolute left-0 top-0 pointer-events-none transition-opacity duration-150 z-20"
        style={{ opacity: 0 }}
      >
        {activeCase && (
          <button
            type="button"
            onClick={() => onSelect(activeCase.slug)}
            className="cursor-pointer whitespace-nowrap rounded-md bg-slate-900/95 px-2.5 py-1 text-xs font-medium text-slate-100 shadow-xl border border-slate-700/80 hover:bg-slate-800 transition-colors pointer-events-auto"
          >
            {activeCase.title}
          </button>
        )}
      </div>
    </div>
  );
}
