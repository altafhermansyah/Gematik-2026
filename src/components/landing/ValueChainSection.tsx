"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function ValueChainSection() {
  return (
    <section className="relative w-full border-t border-white/[0.06] bg-[#0d0f12] py-28 px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="space-y-6">
          <div className="font-mono text-xs text-slate-500">
            02 • RANTAI NILAI UTAMA
          </div>

          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Dari krisis nyata, ke tindakan terarah.
          </h2>

          <p className="max-w-3xl text-base text-slate-400 leading-relaxed">
            Banyak orang ingin berkontribusi namun terhambat karena informasi yang
            tercecer: berita bencana di media sosial, kode riset di jurnal ilmiah, dan
            kursus belajar di tempat ketiga. KarsaLoka menyatukannya dalam satu rantai
            nilai berurutan.
          </p>
        </div>

        {/* 3 Step Breakdown & Hairline Line-Art Schematic */}
        <div className="mt-16 grid grid-cols-1 items-end gap-12 lg:grid-cols-12">
          {/* Left Column: Minimal Text Breakdown */}
          <div className="space-y-6 lg:col-span-5 font-mono text-xs">
            <div className="space-y-3 border-l border-white/[0.12] pl-4">
              <div>
                <span className="text-amber-400 font-bold">01 MASALAH</span>
                <p className="mt-0.5 text-slate-400 font-sans">
                  Menampilkan titik krisis biofisik global dari data satelit dan laporan
                  empiris.
                </p>
              </div>

              <div>
                <span className="text-amber-400 font-bold">02 INOVASI</span>
                <p className="mt-0.5 text-slate-400 font-sans">
                  Mempelajari arsitektur model AI dan teknologi yang telah memecahkannya di
                  lapangan.
                </p>
              </div>

              <div>
                <span className="text-amber-400 font-bold">03 JALUR</span>
                <p className="mt-0.5 text-slate-400 font-sans">
                  Kuis singkat menyusun roadmap personal; materi yang sudah Anda kuasai
                  langsung dilewati.
                </p>
              </div>
            </div>

            <div className="rounded border border-white/[0.08] bg-[#12151b] p-3 text-slate-400">
              <span className="text-amber-400">rantai ide: </span>
              Masalah → Inovasi → Jalur Tindakan
            </div>

            <div>
              <Link
                href="/quiz"
                className="inline-flex items-center gap-2 text-slate-300 hover:text-white transition-colors"
              >
                <span>Mulai Kuis Diagnosa</span>
                <ArrowRight className="h-3.5 w-3.5 text-amber-500" />
              </Link>
            </div>
          </div>

          {/* Right Column: Architectural Hairline Line-Art matching screenshot 4 */}
          <div className="lg:col-span-7">
            <div className="w-full">
              <svg
                viewBox="0 0 600 240"
                className="w-full text-slate-700"
                fill="none"
              >
                {/* Horizontal baseline */}
                <line
                  x1="20"
                  y1="210"
                  x2="580"
                  y2="210"
                  stroke="currentColor"
                  strokeWidth="0.8"
                  strokeOpacity="0.4"
                />

                {/* --- 01 SENSOR / SATELLITE DISH (MASALAH) --- */}
                {/* Dish tripod stand */}
                <line x1="70" y1="210" x2="100" y2="150" stroke="currentColor" strokeWidth="0.8" />
                <line x1="130" y1="210" x2="100" y2="150" stroke="currentColor" strokeWidth="0.8" />
                <line x1="100" y1="210" x2="100" y2="150" stroke="currentColor" strokeWidth="0.8" />
                {/* Dish parabola */}
                <path
                  d="M 60 110 Q 100 160 140 120"
                  stroke="currentColor"
                  strokeWidth="0.8"
                />
                {/* Receiver arm & amber feed horn */}
                <line x1="100" y1="145" x2="115" y2="95" stroke="currentColor" strokeWidth="0.8" />
                <circle cx="115" cy="95" r="2.5" fill="#f59e0b" />
                {/* Signal waves */}
                <path d="M 125 80 Q 135 90 135 105" stroke="currentColor" strokeWidth="0.8" strokeDasharray="2 2" strokeOpacity="0.5" />
                <path d="M 135 70 Q 150 85 150 110" stroke="currentColor" strokeWidth="0.8" strokeDasharray="2 2" strokeOpacity="0.3" />

                {/* --- 02 CHIP / NEURAL LATTICE (INOVASI) --- */}
                {/* Center processor square */}
                <rect
                  x="260"
                  y="120"
                  width="70"
                  height="70"
                  stroke="currentColor"
                  strokeWidth="0.8"
                />
                <rect
                  x="272"
                  y="132"
                  width="46"
                  height="46"
                  stroke="currentColor"
                  strokeWidth="0.8"
                  strokeOpacity="0.4"
                />
                {/* Internal circuit lines */}
                <line x1="295" y1="132" x2="295" y2="178" stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.3" />
                <line x1="272" y1="155" x2="318" y2="155" stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.3" />
                <circle cx="295" cy="155" r="3" fill="#f59e0b" />
                {/* Connector pins */}
                <line x1="280" y1="120" x2="280" y2="105" stroke="currentColor" strokeWidth="0.8" />
                <line x1="295" y1="120" x2="295" y2="105" stroke="currentColor" strokeWidth="0.8" />
                <line x1="310" y1="120" x2="310" y2="105" stroke="currentColor" strokeWidth="0.8" />
                <line x1="280" y1="190" x2="280" y2="210" stroke="currentColor" strokeWidth="0.8" />
                <line x1="295" y1="190" x2="295" y2="210" stroke="currentColor" strokeWidth="0.8" />
                <line x1="310" y1="190" x2="310" y2="210" stroke="currentColor" strokeWidth="0.8" />

                {/* Connecting trace between 1 and 2 */}
                <path
                  d="M 140 135 H 200 V 155 H 260"
                  stroke="currentColor"
                  strokeWidth="0.8"
                  strokeDasharray="3 3"
                  strokeOpacity="0.3"
                />

                {/* --- 03 STEPPED GRAPH / ROADMAP (JALUR) --- */}
                {/* Stepped elevation line */}
                <path
                  d="M 430 210 V 170 H 470 V 130 H 510 V 90 H 550 V 210"
                  stroke="currentColor"
                  strokeWidth="0.8"
                />
                {/* Node dots on steps */}
                <circle cx="450" cy="170" r="2.5" fill="#6b7280" />
                <circle cx="490" cy="130" r="2.5" fill="#6b7280" />
                <circle cx="530" cy="90" r="3.5" fill="#f59e0b" />
                {/* Connecting trace between 2 and 3 */}
                <path
                  d="M 330 155 H 380 V 170 H 430"
                  stroke="currentColor"
                  strokeWidth="0.8"
                  strokeDasharray="3 3"
                  strokeOpacity="0.3"
                />
              </svg>

              {/* Step Labels below each schematic matching screenshot 4 */}
              <div className="mt-2 flex items-center justify-between px-6 font-mono text-xs text-slate-500">
                <span className="w-1/3 text-center">01 masalah</span>
                <span className="w-1/3 text-center">02 inovasi</span>
                <span className="w-1/3 text-center">03 jalur</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
