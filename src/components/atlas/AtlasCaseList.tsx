"use client";

import type { AtlasCase } from "@/modules/atlas/types";

type AtlasCaseListProps = {
  cases: AtlasCase[];
  selectedSlug: string | null;
  onSelect: (slug: string) => void;
};

export default function AtlasCaseList({
  cases,
  selectedSlug,
  onSelect,
}: AtlasCaseListProps) {
  if (cases.length === 0) {
    return (
      <div className="py-8 text-center text-sm text-slate-400">
        No published cases yet.
      </div>
    );
  }

  return (
    <nav aria-label="Atlas cases list" className="w-full">
      <ul className="divide-y divide-slate-800/80 border-y border-slate-800/80">
        {cases.map((c) => {
          const isSelected = c.slug === selectedSlug;
          const location = c.region ? `${c.region}, ${c.countryCode}` : c.countryCode;

          return (
            <li key={c.slug}>
              {/*
                aria-current="true" communicates the active selection state within the
                collection to assistive technology, adhering to standard single-selection navigation list patterns.
              */}
              <button
                type="button"
                onClick={() => onSelect(c.slug)}
                aria-current={isSelected ? "true" : undefined}
                className={`w-full py-3.5 px-3 text-left transition-colors flex flex-col gap-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-inset ${
                  isSelected
                    ? "bg-slate-800/80 border-l-2 border-l-amber-500 pl-2.5"
                    : "hover:bg-slate-900/60"
                }`}
              >
                <div className="flex items-baseline justify-between gap-3">
                  <span className="font-medium text-sm text-slate-100 line-clamp-1">
                    {c.title}
                  </span>
                  <span className="text-xs text-slate-400 shrink-0 font-mono">
                    {location}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span
                    className="inline-block h-2 w-2 rounded-full shrink-0"
                    style={{ backgroundColor: c.domain.color }}
                    aria-hidden="true"
                  />
                  <span>{c.domain.name}</span>
                </div>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
