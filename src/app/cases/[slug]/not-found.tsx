import Link from "next/link";
import { DEFAULT_LOCALE } from "@/lib/i18n/localized";
import { getMessages } from "@/lib/i18n/messages";

export default function CaseNotFound() {
  const t = getMessages(DEFAULT_LOCALE);

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6">
      <div className="max-w-md w-full rounded-xl border border-slate-800 bg-slate-900/80 p-8 text-center shadow-lg space-y-4">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-800 text-slate-400">
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        <h1 className="text-xl font-semibold text-slate-100">
          {t.cases.notFound.title}
        </h1>

        <p className="text-sm text-slate-400 leading-relaxed">
          {t.cases.notFound.description}
        </p>

        <div className="pt-2 flex justify-center">
          <Link
            href="/atlas"
            className="inline-flex items-center gap-1.5 rounded-lg bg-amber-500 px-5 py-2.5 text-sm font-medium text-slate-950 hover:bg-amber-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
          >
            <span aria-hidden="true">&larr;</span>
            <span>{t.common.backToAtlas}</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
