"use client";

import { useEffect, useRef, useState } from "react";

interface CoordinatePoint {
  id: string;
  name: string;
  location: string;
  coords: string;
  ratio: number;
}

const PRESETS: CoordinatePoint[] = [
  { id: "01", name: "Rainforest Connection", location: "Sumatra, ID", coords: "-1.60° S, 103.60° E", ratio: 0.32 },
  { id: "02", name: "AlphaFold EMBL-EBI", location: "Cambridge, UK", coords: "52.08° N, 0.19° E", ratio: 0.50 },
  { id: "03", name: "AgriSat Early Warning", location: "Sahel Region", coords: "14.49° N, 14.45° E", ratio: 0.68 },
];

export function PulseWaveform() {
  const [activeIdx, setActiveIdx] = useState(1);
  const active = PRESETS[activeIdx];
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let frameId: number;
    let t = 0;

    const render = () => {
      t += 0.03;
      const w = canvas.width;
      const h = canvas.height;
      const midY = h / 2;

      ctx.clearRect(0, 0, w, h);

      // Single razor-thin baseline
      ctx.beginPath();
      ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
      ctx.lineWidth = 1;

      const targetX = w * active.ratio;
      const waveSpan = 120;

      for (let x = 0; x < w; x += 2) {
        let y = midY;
        const dist = Math.abs(x - targetX);
        if (dist < waveSpan) {
          const envelope = Math.cos((dist / waveSpan) * (Math.PI / 2));
          const wave = Math.sin((x - targetX) * 0.08 - t * 2) * 20;
          y = midY + wave * envelope;
        }

        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Single clean solid amber dot (no blurry glow, crisp & minimal)
      const dotX = targetX;
      const dotY = midY - 14;

      ctx.fillStyle = "#f59e0b";
      ctx.beginPath();
      ctx.arc(dotX, dotY, 4, 0, Math.PI * 2);
      ctx.fill();

      frameId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(frameId);
  }, [active]);

  return (
    <div className="w-full py-8">
      {/* Waveform line */}
      <div className="relative flex items-center">
        <canvas
          ref={canvasRef}
          width={1100}
          height={80}
          className="h-16 w-full"
        />
        {/* Right side label matching reference: "alternating current • 50 Hz" */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 font-mono text-xs text-slate-500 hidden sm:block">
          rantai biofisik • <span className="text-slate-400">{active.coords}</span>
        </div>
      </div>

      {/* Preset switcher: pure text, minimal */}
      <div className="mt-2 flex items-center justify-between font-mono text-xs text-slate-500">
        <div className="flex items-center gap-6">
          <span className="text-slate-600">titik pantau:</span>
          {PRESETS.map((p, idx) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setActiveIdx(idx)}
              className={`transition-colors cursor-pointer ${
                activeIdx === idx
                  ? "text-amber-400 underline underline-offset-4"
                  : "text-slate-500 hover:text-slate-300"
              }`}
            >
              {p.id} {p.name}
            </button>
          ))}
        </div>

        <div className="hidden sm:block text-slate-600">
          {active.location}
        </div>
      </div>
    </div>
  );
}
