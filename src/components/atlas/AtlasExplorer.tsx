"use client";

import { useCallback, useEffect, useState } from "react";
import type { AtlasCase } from "@/modules/atlas/types";
import AtlasGlobe, { type AtlasGlobeLabels } from "./AtlasGlobe";
import AtlasCaseList, { type AtlasCaseListLabels } from "./AtlasCaseList";
import AtlasCasePanel, { type AtlasCasePanelLabels } from "./AtlasCasePanel";

export type AtlasExplorerLabels = {
  headingTitle: string;
  headingDescription: string;
  globeSectionAria: string;
  panelSectionAria: string;
  listSectionAria: string;
  casesHeading: string;
  clearSelection: string;
  panel: AtlasCasePanelLabels;
  list: AtlasCaseListLabels;
  globe: AtlasGlobeLabels;
};

type AtlasExplorerProps = {
  cases: AtlasCase[];
  initialSelectedSlug: string | null;
  labels: AtlasExplorerLabels;
};

export default function AtlasExplorer({
  cases,
  initialSelectedSlug,
  labels,
}: AtlasExplorerProps) {
  const [selectedSlug, setSelectedSlug] = useState<string | null>(initialSelectedSlug);

  const handleSelect = useCallback((slug: string) => {
    setSelectedSlug((prev) => (prev === slug ? null : slug));
  }, []);

  const handleClear = useCallback(() => {
    setSelectedSlug(null);
  }, []);

  // Mirror selection into the URL without triggering server re-renders or executing side effects during render
  useEffect(() => {
    if (typeof window === "undefined") return;

    const url = new URL(window.location.href);
    const currentParam = url.searchParams.get("case");

    if (selectedSlug) {
      if (currentParam !== selectedSlug) {
        url.searchParams.set("case", selectedSlug);
        window.history.replaceState(null, "", url.toString());
      }
    } else {
      if (currentParam !== null) {
        url.searchParams.delete("case");
        window.history.replaceState(null, "", url.toString());
      }
    }
  }, [selectedSlug]);

  // Listen to browser forward/backward navigation
  useEffect(() => {
    const onPopState = () => {
      const params = new URLSearchParams(window.location.search);
      const slug = params.get("case");
      setSelectedSlug(slug && cases.some((c) => c.slug === slug) ? slug : null);
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, [cases]);

  // Pressing Escape clears the selection
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClear();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [handleClear]);

  const selectedCase = cases.find((c) => c.slug === selectedSlug) ?? null;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <header className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-100">
          {labels.headingTitle}
        </h1>
        <p className="mt-2 text-sm text-slate-400 max-w-2xl">
          {labels.headingDescription}
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Globe column (Left on desktop, top on mobile) */}
        <section
          aria-label={labels.globeSectionAria}
          className="lg:col-span-7 w-full flex items-center justify-center min-w-0"
        >
          <AtlasGlobe
            cases={cases}
            selectedSlug={selectedSlug}
            onSelect={handleSelect}
            labels={labels.globe}
          />
        </section>

        {/* Details & List column (Right on desktop, bottom on mobile) */}
        <div className="lg:col-span-5 w-full flex flex-col gap-6 min-w-0">
          <section aria-label={labels.panelSectionAria}>
            <AtlasCasePanel
              selectedCase={selectedCase}
              labels={labels.panel}
            />
          </section>

          <section
            aria-label={labels.listSectionAria}
            className="rounded-lg border border-slate-800 bg-slate-900/60 p-4"
          >
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                {labels.casesHeading} ({cases.length})
              </h2>
              {selectedSlug && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="text-xs text-amber-400 hover:text-amber-300 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded px-1"
                >
                  {labels.clearSelection}
                </button>
              )}
            </div>
            <AtlasCaseList
              cases={cases}
              selectedSlug={selectedSlug}
              onSelect={handleSelect}
              labels={labels.list}
            />
          </section>
        </div>
      </div>
    </div>
  );
}
