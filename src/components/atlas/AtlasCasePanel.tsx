import Link from "next/link";
import type { AtlasCase } from "@/modules/atlas/types";

export type AtlasCasePanelLabels = {
  empty: string;
  readFullCase: string;
};

type AtlasCasePanelProps = {
  selectedCase: AtlasCase | null;
  labels: AtlasCasePanelLabels;
};

export default function AtlasCasePanel({ selectedCase, labels }: AtlasCasePanelProps) {
  return (
    <div
      aria-live="polite"
      className="rounded-lg border border-slate-800 bg-slate-900/90 p-5 text-slate-200"
    >
      {selectedCase ? (
        <article className="space-y-4">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <span
                  className="inline-block h-2.5 w-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: selectedCase.domain.color }}
                  aria-hidden="true"
                />
                <span className="font-medium text-slate-300">
                  {selectedCase.domain.name}
                </span>
              </div>
              <span className="font-mono text-slate-400">
                {selectedCase.region
                  ? `${selectedCase.region}, ${selectedCase.countryCode}`
                  : selectedCase.countryCode}
              </span>
            </div>
            <h2 className="mt-2 text-lg font-semibold text-slate-50 tracking-tight">
              {selectedCase.title}
            </h2>
          </div>

          <p className="text-sm leading-relaxed text-slate-300">
            {selectedCase.summary}
          </p>

          <div className="pt-2 border-t border-slate-800/80">
            <Link
              href={`/cases/${selectedCase.slug}`}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-amber-400 hover:text-amber-300 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded"
            >
              {labels.readFullCase}
              <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        </article>
      ) : (
        <div className="py-6 text-center text-sm text-slate-400">
          <p>{labels.empty}</p>
        </div>
      )}
    </div>
  );
}
