"use client";

import { useEffect } from "react";

type AtlasErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function AtlasError({ error, reset }: AtlasErrorProps) {
  useEffect(() => {
    // Log contextual diagnostics for developers without leaking sensitive data to users
    console.error("[app/atlas/error] Atlas route error encountered:", error);
  }, [error]);

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6">
      <div className="max-w-md w-full rounded-xl border border-slate-800 bg-slate-900/80 p-8 text-center shadow-lg">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-500/10 text-amber-500 mb-4">
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
          Unable to Load Atlas
        </h1>

        <p className="mt-2 text-sm text-slate-400 leading-relaxed">
          We couldn&apos;t load the atlas right now. Please try again.
        </p>

        <div className="mt-6 flex justify-center">
          <button
            type="button"
            onClick={() => reset()}
            className="rounded-lg bg-amber-500 px-5 py-2.5 text-sm font-medium text-slate-950 hover:bg-amber-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 transition-colors"
          >
            Try again
          </button>
        </div>
      </div>
    </main>
  );
}
