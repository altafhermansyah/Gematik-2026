"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function StatsSection() {
  return (
    <section className="relative w-full border-t border-white/[0.06] bg-[#0d0f12] py-32 px-6 lg:px-8 overflow-hidden">
      {/* Dot Matrix Background matching reference screenshot 5 */}
      <div className="pointer-events-none absolute inset-0 dot-matrix-bg opacity-25" />

      <div className="relative mx-auto max-w-6xl">
        {/* Section Index Marker */}
        <div className="flex items-center justify-between font-mono text-xs text-slate-500 mb-12">
          <span>03 • DATA EMPIRIS</span>
          <span className="hidden sm:inline">PEER-REVIEWED & OPEN ACCESS</span>
        </div>

        {/* Center Display: Giant Number matching screenshot 5 */}
        <div className="flex flex-col items-center text-center my-10">
          <div className="text-8xl sm:text-9xl font-bold tracking-tight text-white font-mono">
            15
          </div>

          <div className="mt-4 font-mono text-xs sm:text-sm tracking-widest text-slate-400 uppercase">
            STUDI KASUS EMPIRIS • 0 HALUSINASI
          </div>

          <div className="mt-2 font-mono text-xs text-amber-400">
            100% bersumber dari jurnal Nature, EMBL, dan laporan terbuka
          </div>
        </div>

        {/* Bottom Split: Left Terminal Box + Right Clean Metric Rows */}
        <div className="mt-20 grid grid-cols-1 items-end gap-12 lg:grid-cols-12">
          {/* Left Terminal Note Box matching screenshot 5 */}
          <div className="lg:col-span-6">
            <div className="rounded border border-white/[0.08] bg-[#12151b]/80 p-5 font-mono text-xs leading-relaxed text-slate-400">
              <div className="text-slate-500 mb-2">standar integritas data —</div>
              <p>
                Setiap kasus inovasi wajib memiliki minimal satu rujukan primer yang
                dapat diakses dan diverifikasi publik.
              </p>
              <p className="mt-2 text-slate-300">
                Tidak ada angka karangan; metrics hanya berisi data yang terverifikasi
                dari penelitian dan implementasi lapangan langsung.
              </p>
            </div>
          </div>

          {/* Right Metrics Grid */}
          <div className="lg:col-span-6 font-mono text-xs space-y-4">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-2 text-slate-400">
              <span>Domain Masalah</span>
              <span className="text-white">06 (Iklim, Pangan, Sains, dll.)</span>
            </div>
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-2 text-slate-400">
              <span>Aksesibilitas</span>
              <span className="text-white">100% Terbuka Tanpa Registrasi</span>
            </div>
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-2 text-slate-400">
              <span>Pelacak & Cookie</span>
              <span className="text-white">0 Tracker (Privasi Penuh)</span>
            </div>
            <div className="flex items-center justify-between pt-1 text-slate-400">
              <span>Jalur Belajar Adaptif</span>
              <span className="text-amber-400">Graph Interaktif Tersedia</span>
            </div>

            <div className="pt-2">
              <Link
                href="/cases/alphafold-protein-structures"
                className="inline-flex items-center gap-2 text-slate-300 hover:text-white transition-colors"
              >
                <span>Lihat Contoh Kasus (AlphaFold)</span>
                <ArrowRight className="h-3.5 w-3.5 text-amber-500" />
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Tick Indicator matching screenshot */}
        <div className="mt-16 flex items-center justify-between font-mono text-[11px] text-slate-600 border-t border-white/[0.06] pt-4">
          <span>03 • STATS</span>
          <span>|....|....|....|....|</span>
        </div>
      </div>
    </section>
  );
}
