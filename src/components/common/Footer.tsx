import Link from "next/link";

export function Footer() {
  return (
    <footer className="w-full border-t border-white/[0.06] bg-[#0d0f12] py-12 px-6 lg:px-8 font-mono text-xs text-slate-500">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="text-slate-300 tracking-wider">
              KARSALOKA • PLATFORM INOVASI GLOBAL
            </div>
            <div className="text-[11px] text-slate-500">
              Karya Lomba Web Design GEMATIK VI 2026 • Universitas Teknokrat Indonesia
            </div>
          </div>

          <div className="text-[11px] text-slate-500">
            &ldquo;Empowering Global Innovators for an Intelligent Future&rdquo;
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-white/[0.04] pt-6 text-[11px] text-slate-600">
          <div className="flex items-center gap-6">
            <Link href="/atlas" className="hover:text-slate-400 transition-colors">
              Atlas
            </Link>
            <Link href="/cases/alphafold-protein-structures" className="hover:text-slate-400 transition-colors">
              Kasus
            </Link>
            <Link href="/quiz" className="hover:text-slate-400 transition-colors">
              Diagnosa
            </Link>
            <Link href="/paths" className="hover:text-slate-400 transition-colors">
              Roadmap
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <span>LAT -1.6000, 103.6000</span>
            <span>•</span>
            <span>UTC+7</span>
            <span>•</span>
            <span>© 2026 KARSALOKA</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
