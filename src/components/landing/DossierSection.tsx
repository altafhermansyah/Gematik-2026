"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function DossierSection() {
  const gateways = [
    {
      num: "01",
      title: "Atlas Global",
      desc: "Eksplorasi bola dunia 3D yang memetakan krisis biofisik dan inovasi teknologi.",
      link: "/atlas",
    },
    {
      num: "02",
      title: "Kasus Empiris",
      desc: "Telaah mendalam AlphaFold, bioakustik, dan model AI teruji beserta sumber primer.",
      link: "/cases/alphafold-protein-structures",
    },
    {
      num: "03",
      title: "Diagnosa Kuis",
      desc: "Asesmen diagnostik mandiri untuk menentukan titik awal dan memotong skill yang telah dikuasai.",
      link: "/quiz",
    },
    {
      num: "04",
      title: "Jalur Belajar",
      desc: "Skill graph interaktif dengan materi kurasi dan pelacakan progres lokal di browser.",
      link: "/paths",
    },
  ];

  return (
    <section className="relative w-full border-t border-white/[0.06] bg-[#0d0f12] py-28 px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="space-y-4 mb-16">
          <div className="font-mono text-xs text-slate-500">
            05 • GERBANG EKSPLORASI
          </div>

          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Pilih titik awal Anda.
          </h2>

          <p className="text-base text-slate-400 max-w-2xl">
            Seluruh konten dapat diakses langsung tanpa registrasi akun. Mulai perjalanan
            Anda dari sudut pandang yang paling sesuai.
          </p>
        </div>

        {/* 4 Minimalist Gateways with Hairline Borders */}
        <div className="grid grid-cols-1 gap-px bg-white/[0.08] sm:grid-cols-2 lg:grid-cols-4 rounded overflow-hidden border border-white/[0.08]">
          {gateways.map((g) => (
            <Link
              key={g.num}
              href={g.link}
              className="group flex flex-col justify-between bg-[#0d0f12] p-8 transition-colors hover:bg-[#12151b]"
            >
              <div className="space-y-4">
                <div className="font-mono text-xs text-amber-500">
                  {g.num}
                </div>

                <h3 className="text-lg font-semibold text-white group-hover:text-amber-400 transition-colors">
                  {g.title}
                </h3>

                <p className="text-xs text-slate-400 leading-relaxed font-sans">
                  {g.desc}
                </p>
              </div>

              <div className="mt-8 flex items-center gap-2 font-mono text-xs text-slate-500 group-hover:text-slate-200 transition-colors">
                <span>Buka modul</span>
                <ArrowRight className="h-3.5 w-3.5 text-amber-500 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
