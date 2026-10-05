import { DEFAULT_LOCALE } from "@/lib/i18n/localized";
import { getMessages } from "@/lib/i18n/messages";

export default function CaseLoading() {
  const t = getMessages(DEFAULT_LOCALE);

  return (
    <main
      role="status"
      aria-label={t.cases.loading.ariaLabel}
      className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-[68ch] mx-auto space-y-8 animate-pulse">
        {/* Back button skeleton */}
        <div className="h-5 w-28 rounded bg-slate-800/80" />

        {/* Header skeleton */}
        <div className="space-y-4 border-b border-slate-800 pb-8">
          <div className="flex items-center gap-2">
            <div className="h-2.5 w-2.5 rounded-full bg-slate-800" />
            <div className="h-4 w-24 rounded bg-slate-800/80" />
          </div>

          <div className="space-y-2">
            <div className="h-9 w-3/4 rounded bg-slate-800" />
            <div className="h-9 w-1/2 rounded bg-slate-800/80" />
          </div>

          <div className="h-4 w-36 rounded bg-slate-800/60" />

          <div className="space-y-2 pt-2">
            <div className="h-4 w-full rounded bg-slate-800/70" />
            <div className="h-4 w-5/6 rounded bg-slate-800/70" />
          </div>

          <div className="flex gap-2 pt-2">
            <div className="h-6 w-16 rounded bg-slate-800/60" />
            <div className="h-6 w-24 rounded bg-slate-800/60" />
          </div>
        </div>

        {/* Section skeletons */}
        <div className="space-y-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-3">
              <div className="h-6 w-36 rounded bg-slate-800" />
              <div className="space-y-2">
                <div className="h-4 w-full rounded bg-slate-800/60" />
                <div className="h-4 w-11/12 rounded bg-slate-800/60" />
                <div className="h-4 w-4/5 rounded bg-slate-800/60" />
              </div>
            </div>
          ))}
        </div>

        {/* Sources skeleton */}
        <div className="space-y-4 pt-4 border-t border-slate-800">
          <div className="h-6 w-44 rounded bg-slate-800" />
          <div className="space-y-3 pl-4">
            <div className="h-4 w-3/4 rounded bg-slate-800/60" />
            <div className="h-4 w-2/3 rounded bg-slate-800/60" />
          </div>
        </div>
      </div>
      <span className="sr-only">{t.cases.loading.srText}</span>
    </main>
  );
}
