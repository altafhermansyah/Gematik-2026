"use client";

import { useEffect } from "react";
import Link from "next/link";
import { DEFAULT_LOCALE } from "@/lib/i18n/localized";
import { getMessages } from "@/lib/i18n/messages";

type CaseErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function CaseError({ error, reset }: CaseErrorProps) {
  const t = getMessages(DEFAULT_LOCALE);

  useEffect(() => {
    // Log contextual diagnostics for developers without leaking sensitive data to users
    console.error("[app/cases/[slug]/error] Case route error encountered:", error);
  }, [error]);

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6">
      <div className="max-w-md w-full rounded-xl border border-slate-800 bg-slate-900/80 p-8 text-center shadow-lg space-y-4">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-500/10 text-amber-500 mb-2">
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
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>

        <h1 className="text-xl font-semibold text-slate-100">
          {t.cases.error.title}
        </h1>

        <p className="text-sm text-slate-400 leading-relaxed">
          {t.cases.error.description}
        </p>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => reset()}
            className="w-full sm:w-auto rounded-lg bg-amber-500 px-5 py-2.5 text-sm font-medium text-slate-950 hover:bg-amber-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
          >
            {t.common.tryAgain}
          </button>

          <Link
            href="/atlas"
            className="w-full sm:w-auto rounded-lg border border-slate-700 bg-slate-800/80 px-5 py-2.5 text-sm font-medium text-slate-200 hover:bg-slate-700 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
          >
            {t.common.backToAtlas}
          </Link>
        </div>
      </div>
    </main>
  );
}
