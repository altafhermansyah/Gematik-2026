"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function WireframeGlobeSection() {
  return (
    <section className="relative w-full border-t border-white/[0.06] bg-[#0d0f12] py-28 px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-12">
          {/* Left Column: Editorial Text */}
          <div className="space-y-6 lg:col-span-6">
            <div className="font-mono text-xs text-slate-500">
              01 • ATLAS KRISIS BIOFISIK
            </div>

            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Bila krisis dunia dipetakan ke koordinat nyata...
            </h2>

            <p className="text-base text-slate-400 leading-relaxed">
              Masalah iklim, kepunahan hayati, dan kerawanan pangan tidak terjadi di ruang
              hampa. Setiap tantangan memiliki koordinat spasial, ekosistem lokal, dan
              komunitas yang terdampak langsung.
            </p>

            <p className="text-base text-slate-400 leading-relaxed">
              Di Atlas KarsaLoka, setiap titik di bola bumi merepresentasikan masalah
              nyata yang telah memiliki pembuktian teknologi teruji—bukan hipotesis,
              melainkan inovasi lapangan yang diverifikasi dengan sumber primer.
            </p>

            {/* Monospaced Data Block matching reference */}
            <div className="rounded border border-white/[0.08] bg-[#12151b] p-4 font-mono text-xs space-y-1">
              <div className="text-slate-500">pemetaan geospasial</div>
              <div className="text-amber-400">
                15 titik terverifikasi → 6 domain global → 100% koordinat riil
              </div>
            </div>

            <div className="pt-2">
              <Link
                href="/atlas"
                className="inline-flex items-center gap-2 font-mono text-xs text-slate-300 hover:text-white transition-colors"
              >
                <span>Buka Atlas Bola Dunia</span>
                <ArrowRight className="h-3.5 w-3.5 text-amber-500" />
              </Link>
            </div>
          </div>

          {/* Right Column: Pure Hairline Wireframe Globe matching reference screenshot 2 */}
          <div className="flex items-center justify-center lg:col-span-6">
            <div className="relative flex items-center justify-center">
              <svg
                viewBox="0 0 400 400"
                className="h-80 w-80 sm:h-96 sm:w-96 text-slate-700"
                fill="none"
              >
                {/* Outer bounding circle */}
                <circle
                  cx="200"
                  cy="200"
                  r="150"
                  stroke="currentColor"
                  strokeWidth="0.75"
                  strokeOpacity="0.4"
                />

                {/* Concentric latitude ellipses */}
                <ellipse
                  cx="200"
                  cy="200"
                  rx="150"
                  ry="40"
                  stroke="currentColor"
                  strokeWidth="0.75"
                  strokeOpacity="0.3"
                />
                <ellipse
                  cx="200"
                  cy="140"
                  rx="130"
                  ry="30"
                  stroke="currentColor"
                  strokeWidth="0.75"
                  strokeOpacity="0.25"
                />
                <ellipse
                  cx="200"
                  cy="260"
                  rx="130"
                  ry="30"
                  stroke="currentColor"
                  strokeWidth="0.75"
                  strokeOpacity="0.25"
                />

                {/* Longitude ellipses */}
                <ellipse
                  cx="200"
                  cy="200"
                  rx="45"
                  ry="150"
                  stroke="currentColor"
                  strokeWidth="0.75"
                  strokeOpacity="0.35"
                />
                <ellipse
                  cx="200"
                  cy="200"
                  rx="95"
                  ry="150"
                  stroke="currentColor"
                  strokeWidth="0.75"
                  strokeOpacity="0.35"
                />

                {/* Center axis line */}
                <line
                  x1="200"
                  y1="50"
                  x2="200"
                  y2="350"
                  stroke="currentColor"
                  strokeWidth="0.75"
                  strokeOpacity="0.2"
                />
                <line
                  x1="50"
                  y1="200"
                  x2="350"
                  y2="200"
                  stroke="currentColor"
                  strokeWidth="0.75"
                  strokeOpacity="0.2"
                />

                {/* Coordinate Markers (Clean discrete dots) */}
                {/* Sumatra point */}
                <circle cx="270" cy="210" r="3" fill="#f59e0b" />
                <circle cx="270" cy="210" r="7" stroke="#f59e0b" strokeWidth="0.5" strokeOpacity="0.4" />

                {/* London point */}
                <circle cx="190" cy="115" r="2.5" fill="#f59e0b" />

                {/* Sahel point */}
                <circle cx="215" cy="180" r="2.5" fill="#f59e0b" />

                {/* Orbit dots surrounding the globe (matching reference screenshot 2) */}
                {Array.from({ length: 28 }).map((_, i) => {
                  const angle = (i / 28) * Math.PI * 2;
                  const x = 200 + Math.cos(angle) * 185;
                  const y = 200 + Math.sin(angle) * 185;
                  return (
                    <circle
                      key={i}
                      cx={x}
                      cy={y}
                      r="1.2"
                      fill="#6b7280"
                      opacity="0.6"
                    />
                  );
                })}
              </svg>

              {/* Minimal caption below globe */}
              <div className="absolute -bottom-6 font-mono text-[11px] text-slate-600">
                lat -1.6000 • lng 103.6000 // sumatra
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
