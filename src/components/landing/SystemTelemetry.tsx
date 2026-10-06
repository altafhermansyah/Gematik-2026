"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function SystemTelemetry() {
  const specs = [
    { label: "Arsitektur Web", value: "Next.js 16 (React 19 App Router)" },
    { label: "Basis Data & ORM", value: "PostgreSQL + Prisma 7 (@prisma/adapter-pg)" },
    { label: "Mesin Globe", value: "cobe WebGL (Headless, DPR 2.0)" },
    { label: "Visualisasi Graf", value: "@xyflow/react Skill Canvas" },
    { label: "Mesin Kuis", value: "Rule-based deterministik (0 API latency)" },
    { label: "Ukuran Bundle Client", value: "< 65 KB Gzipped" },
    { label: "Autentikasi Pengunjung", value: "0 Cookie • Tanpa Login" },
  ];

  return (
    <section className="relative w-full border-t border-white/[0.06] bg-[#0d0f12] py-28 px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 items-start gap-16 lg:grid-cols-12">
          {/* Left Column */}
          <div className="space-y-6 lg:col-span-6">
            <div className="font-mono text-xs text-slate-500">
              04 • FILOSOFI REKAYASA
            </div>

            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Beban rendah. Dampak nyata.
            </h2>

            <p className="text-base text-slate-400 leading-relaxed">
              Platform KarsaLoka dirancang tanpa beban komputasi berlebih. Tidak ada
              ketergantungan API pihak ketiga saat proses penilaian, tidak ada pelacak
              privasi, dan seluruh kode dioptimalkan untuk meminimalkan jejak transfer data.
            </p>

            <p className="text-base text-slate-400 leading-relaxed">
              Hasil diagnosa kuis dan progres belajar disimpan secara lokal di peramban
              Anda melalui state terisolasi, menjaga privasi seutuhnya sekaligus
              memungkinkan akses instan tanpa jaringan yang kencang.
            </p>

            <div className="pt-2">
              <Link
                href="/atlas"
                className="inline-flex items-center gap-2 font-mono text-xs text-slate-300 hover:text-white transition-colors"
              >
                <span>Buka Globe Atlas</span>
                <ArrowRight className="h-3.5 w-3.5 text-amber-500" />
              </Link>
            </div>
          </div>

          {/* Right Column: Clean Spec Table */}
          <div className="lg:col-span-6">
            <div className="rounded border border-white/[0.08] bg-[#12151b] p-6 font-mono text-xs">
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-3 text-slate-400">
                <span>spesifikasi rekayasa</span>
                <span className="text-amber-400">v1.0.1</span>
              </div>

              <div className="divide-y divide-white/[0.04] py-2">
                {specs.map((s) => (
                  <div
                    key={s.label}
                    className="flex items-center justify-between py-2.5"
                  >
                    <span className="text-slate-500">{s.label}</span>
                    <span className="text-slate-300 text-right">{s.value}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between border-t border-white/[0.08] pt-3 text-[11px] text-slate-500">
                <span>kepatuhan privasi</span>
                <span className="text-emerald-400">100% mandiri</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
