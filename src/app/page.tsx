import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Navbar } from "@/components/common/Navbar";
import { Footer } from "@/components/common/Footer";
import { PulseWaveform } from "@/components/landing/PulseWaveform";
import { WireframeGlobeSection } from "@/components/landing/WireframeGlobeSection";
import { ValueChainSection } from "@/components/landing/ValueChainSection";
import { StatsSection } from "@/components/landing/StatsSection";
import { SystemTelemetry } from "@/components/landing/SystemTelemetry";
import { DossierSection } from "@/components/landing/DossierSection";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#0d0f12] text-[#e5e7eb] flex flex-col selection:bg-amber-500 selection:text-black">
      {/* Minimal Top Navigation */}
      <Navbar />

      <main className="flex-1">
        {/* ========================================================
            HERO SECTION (Matching reference screenshot 1 & 3)
            ======================================================== */}
        <section className="relative pt-16 pb-20 sm:pt-24 sm:pb-28 px-6 lg:px-8">
          <div className="mx-auto max-w-6xl space-y-10">
            {/* Subtitle tag matching reference */}
            <div className="font-mono text-xs tracking-widest text-slate-500 uppercase">
              KARSALOKA PRESENTS
            </div>

            {/* Main Headline: Solid White, Zero Gradient, Pure Typography */}
            <div className="space-y-6 max-w-3xl">
              <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-white leading-[1.1]">
                Dari masalah dunia,
                <br />
                menjadi bagian solusinya.
              </h1>

              <p className="text-base sm:text-lg text-slate-400 leading-relaxed font-sans">
                Setiap krisis iklim dan kerawanan pangan di planet ini berakar dari
                sistem nyata. KarsaLoka memetakan krisis biofisik global, merujuk
                inovasi kecerdasan buatan berbasis bukti terverifikasi, hingga menyusun
                kurikulum kapasitas personal Anda.
              </p>
            </div>

            {/* Manifest note matching screenshot 1/3: "this page practises what it preaches" */}
            <div className="font-mono text-xs leading-relaxed max-w-xl text-slate-400 space-y-1">
              <div className="text-slate-500">prinsip rekayasa karsaloka —</div>
              <div className="text-amber-400">
                tanpa login • 100% sumber terverifikasi • nol pelacak • deterministik
              </div>
            </div>

            {/* Pure Hairline Pulse Waveform Line */}
            <PulseWaveform />

            {/* Actions & Scroll Indicator */}
            <div className="pt-6 flex flex-wrap items-center justify-between gap-6 font-mono text-xs text-slate-500 border-t border-white/[0.06]">
              {/* Direct links */}
              <div className="flex items-center gap-6">
                <Link
                  href="/atlas"
                  className="inline-flex items-center gap-2 text-white hover:text-amber-400 transition-colors"
                >
                  <span>Buka Atlas Global</span>
                  <ArrowRight className="h-3.5 w-3.5 text-amber-500" />
                </Link>

                <Link
                  href="/quiz"
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  Diagnosa Kuis →
                </Link>
              </div>

              {/* Scroll Indicator matching reference bottom left/right */}
              <div className="flex items-center gap-8 text-[11px] text-slate-600">
                <div className="flex items-center gap-2">
                  <span>SCROLL</span>
                  <span className="h-3 w-px bg-slate-700" />
                </div>
                <div className="tracking-widest">
                  |....|....|....|....| <span className="text-amber-500">01</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================
            01 • ATLAS KRISIS (Wireframe Globe matching screenshot 2)
            ======================================================== */}
        <WireframeGlobeSection />

        {/* ========================================================
            02 • RANTAI NILAI UTAMA (Line-Art schematic matching screenshot 4)
            ======================================================== */}
        <ValueChainSection />

        {/* ========================================================
            03 • DATA EMPIRIS (Dot-Matrix & Big Number matching screenshot 5)
            ======================================================== */}
        <StatsSection />

        {/* ========================================================
            04 • FILOSOFI REKAYASA (Clean Spec Table)
            ======================================================== */}
        <SystemTelemetry />

        {/* ========================================================
            05 • GERBANG EKSPLORASI (Clean Border-Grid Gateways)
            ======================================================== */}
        <DossierSection />
      </main>

      {/* Minimal Universal Footer */}
      <Footer />
    </div>
  );
}
