"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import createGlobe from "cobe";

export type GlobePoint = {
  slug: string;
  title: string;
  lat: number;
  lng: number;
  color: string; // hex dari Domain.color, contoh "#34d399"
};

const hexToRgb = (hex: string): [number, number, number] => {
  const n = parseInt(hex.replace("#", ""), 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
};

export default function AtlasGlobe({ points }: { points: GlobePoint[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const router = useRouter();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let phi = 0;
    let theta = 0.25;
    let dragging = false;
    let lastX = 0;
    let lastY = 0;
    let raf = 0;

    const globe = createGlobe(canvas, {
      devicePixelRatio: dpr,
      width: canvas.offsetWidth * dpr,
      height: canvas.offsetHeight * dpr,
      phi,
      theta,
      dark: 1,
      diffuse: 1.2,
      mapSamples: 16000,
      mapBrightness: 6,
      baseColor: [0.2, 0.25, 0.4],
      markerColor: [1, 0.7, 0.2],
      glowColor: [0.1, 0.2, 0.5],
      markers: points.map((p) => ({
        id: p.slug,
        location: [p.lat, p.lng] as [number, number],
        size: 0.06,
        color: hexToRgb(p.color),
      })),
    });

    // cobe v2 tidak punya onRender: putar globe sendiri lewat requestAnimationFrame
    const tick = () => {
      if (!dragging) phi += 0.003;
      globe.update({ phi, theta });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const onDown = (e: PointerEvent) => {
      dragging = true;
      lastX = e.clientX;
      lastY = e.clientY;
      canvas.setPointerCapture(e.pointerId);
    };
    const onMove = (e: PointerEvent) => {
      if (!dragging) return;
      phi += (e.clientX - lastX) / 200;
      theta = Math.max(-1, Math.min(1, theta + (e.clientY - lastY) / 200));
      lastX = e.clientX;
      lastY = e.clientY;
    };
    const onUp = () => {
      dragging = false;
    };

    canvas.addEventListener("pointerdown", onDown);
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerup", onUp);
    canvas.addEventListener("pointercancel", onUp);

    return () => {
      cancelAnimationFrame(raf);
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerup", onUp);
      canvas.removeEventListener("pointercancel", onUp);
      globe.destroy();
    };
  }, [points]);

  return (
    <div className="relative mx-auto aspect-square w-full max-w-[720px]">
      <canvas
        ref={canvasRef}
        className="h-full w-full cursor-grab touch-none active:cursor-grabbing"
      />
      {points.map((p) => {
        const visible = `var(--cobe-visible-${p.slug}, 0)`;
        return (
          <button
            key={p.slug}
            type="button"
            onClick={() => router.push(`/cases/${p.slug}`)}
            className="absolute whitespace-nowrap rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-slate-900 shadow-lg transition-[opacity,transform] duration-300"
            style={{
              positionAnchor: `--cobe-${p.slug}`,
              bottom: "anchor(top)",
              left: "anchor(center)",
              opacity: visible,
              // scale 0 saat marker di belakang globe, jadi tidak bisa terklik
              transform: `translateX(-50%) scale(${visible})`,
            }}
          >
            {p.title}
          </button>
        );
      })}
    </div>
  );
}
