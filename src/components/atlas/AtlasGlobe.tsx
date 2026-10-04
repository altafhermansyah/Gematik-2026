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

type AtlasGlobeProps = {
  cases: AtlasCase[];
  selectedSlug: string | null;
  onSelect: (slug: string) => void;
};

const emptySubscribe = () => () => {};

function getSupportsAnchor(): boolean {
  return (
    typeof CSS !== "undefined" &&
    typeof CSS.supports === "function" &&
    CSS.supports("position-anchor", "--x")
  );
}

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

export default function AtlasGlobe({
  cases,
  selectedSlug,
  onSelect,
}: AtlasGlobeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const globeRef = useRef<Globe | null>(null);

  // Keep interaction and selection state in refs to prevent per-frame React re-renders
  const selectedSlugRef = useRef<string | null>(selectedSlug);

  useEffect(() => {
    selectedSlugRef.current = selectedSlug;
  }, [selectedSlug]);

  const [runtimeError, setRuntimeError] = useState(false);
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null);

  // Read client platform capabilities safely without hydration mismatch or cascading renders
  const supportsAnchor = useSyncExternalStore(
    emptySubscribe,
    getSupportsAnchor,
    () => false
  );

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

    let globeInstance: Globe;
    try {
      globeInstance = createGlobe(canvas, {
        devicePixelRatio: dpr,
        width: container.offsetWidth,
        height: container.offsetHeight,
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
      return;
    }

    // Single animation frame loop driving auto-rotation
    const tick = () => {
      if (!dragging && !selectedSlugRef.current && !prefersReducedMotion) {
        phi += ROTATION_SPEED;
        globeInstance.update({ phi, theta });
      }
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    // Pointer events for dragging
    const onDown = (e: PointerEvent) => {
      dragging = true;
      lastX = e.clientX;
      lastY = e.clientY;
      canvas.setPointerCapture(e.pointerId);
    };

    const onMove = (e: PointerEvent) => {
      if (!dragging) return;
      phi += (e.clientX - lastX) / DRAG_FACTOR;
      theta = Math.max(MIN_THETA, Math.min(MAX_THETA, theta + (e.clientY - lastY) / DRAG_FACTOR));
      lastX = e.clientX;
      lastY = e.clientY;
      globeInstance.update({ phi, theta });
    };

    const onUp = () => {
      dragging = false;
    };

    canvas.addEventListener("pointerdown", onDown);
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerup", onUp);
    canvas.addEventListener("pointercancel", onUp);

    // ResizeObserver to handle container size changes with logical dimensions
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        if (width > 0 && height > 0 && globeRef.current) {
          globeRef.current.update({
            width: Math.round(width),
            height: Math.round(height),
          });
        }
      }
    });
    resizeObserver.observe(container);

    return () => {
      cancelAnimationFrame(rafId);
      mediaQuery.removeEventListener("change", onMotionPreferenceChange);
      resizeObserver.disconnect();
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerup", onUp);
      canvas.removeEventListener("pointercancel", onUp);
      globeInstance.destroy();
      globeRef.current = null;
    };
  }, [isWebglSupported]);

  if (cases.length === 0) {
    return (
      <div className="relative mx-auto aspect-square w-full max-w-[720px] flex flex-col items-center justify-center rounded-xl border border-slate-800/80 bg-slate-900/40 p-6 text-center text-slate-400">
        <p className="text-sm font-medium text-slate-300">No published cases yet</p>
        <p className="mt-1 text-xs text-slate-500">
          Cases published in the database will appear on the interactive globe.
        </p>
      </div>
    );
  }

  if (isWebglUnavailable) {
    return (
      <div className="relative mx-auto aspect-square w-full max-w-[720px] flex flex-col items-center justify-center rounded-xl border border-slate-800 bg-slate-900/60 p-6 text-center text-slate-400">
        <p className="text-sm font-medium text-slate-200">Interactive 3D Globe Unavailable</p>
        <p className="mt-1.5 max-w-sm text-xs text-slate-400 leading-relaxed">
          WebGL is disabled or unsupported by your current browser environment. You can explore all cases directly using the case list.
        </p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative mx-auto aspect-square w-full max-w-[720px]"
    >
      <canvas
        ref={canvasRef}
        role="img"
        aria-label={`Interactive globe showing ${cases.length} published cases. Use the case list to browse cases.`}
        className="h-full w-full cursor-grab touch-none active:cursor-grabbing"
      />

      {/*
        Marker Overlay using CSS Anchor Positioning.
        Only rendered if supported by the browser; otherwise progressive enhancement relies on the accessible list.
        Buttons are marked aria-hidden and tabIndex -1 to prevent redundant accessibility tree noise, as the list is the primary accessible path.
      */}
      {supportsAnchor &&
        cases.map((c) => {
          const safeId = getSafeMarkerId(c.slug);
          const isSelected = c.slug === selectedSlug;
          const isHovered = c.slug === hoveredSlug;
          const showLabel = isSelected || isHovered;

          return (
            <button
              key={c.slug}
              type="button"
              aria-hidden="true"
              tabIndex={-1}
              onClick={() => onSelect(c.slug)}
              onPointerEnter={() => setHoveredSlug(c.slug)}
              onPointerLeave={() => setHoveredSlug((prev) => (prev === c.slug ? null : prev))}
              className="absolute pointer-events-auto"
              style={{
                positionAnchor: `--cobe-${safeId}`,
                bottom: "anchor(top)",
                left: "anchor(center)",
                translate: "-50% 0",
                scale: `var(--cobe-visible-${safeId}, 0)`,
                opacity: `var(--cobe-visible-${safeId}, 0)`,
              }}
            >
              {/*
                Transparent circular hit target (32px minimum, 44px on coarse pointer)
                centered over the anchor point.
              */}
              <span
                className="absolute left-1/2 top-full -translate-x-1/2 -translate-y-1/2 h-8 w-8 pointer-coarse:h-11 pointer-coarse:w-11 rounded-full cursor-pointer"
                aria-hidden="true"
              />

              {/* Text label: visible only when selected or hovered */}
              {showLabel && (
                <span className="block whitespace-nowrap rounded-md bg-slate-900/95 px-2.5 py-1 text-xs font-medium text-slate-100 shadow-md border border-slate-700/80 mb-1 transition-opacity">
                  {c.title}
                </span>
              )}
            </button>
          );
        })}
    </div>
  );
}
