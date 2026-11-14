"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import type { AtlasCase } from "@/modules/atlas/types";

type AtlasCaseRailProps = {
  cases: AtlasCase[];
  selectedSlug: string | null;
  onSelect: (slug: string) => void;
  emptyLabel: string;
};

export default function AtlasCaseRail({
  cases,
  selectedSlug,
  onSelect,
  emptyLabel,
}: AtlasCaseRailProps) {
  const itemRefs = useRef<Map<string, HTMLButtonElement>>(new Map());

  // Keep the selected card visible when the selection came from the globe.
  useEffect(() => {
    if (!selectedSlug) return;
    const node = itemRefs.current.get(selectedSlug);
    if (!node) return;
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    node.scrollIntoView({
      block: "nearest",
      inline: "nearest",
      behavior: reduceMotion ? "auto" : "smooth",
    });
  }, [selectedSlug]);

  if (cases.length === 0) {
    return <p className="small t-soft py-6">{emptyLabel}</p>;
  }

  return (
    <div className="rail mt-2" role="list">
      {cases.map((caseStudy) => {
        const isSelected = caseStudy.slug === selectedSlug;
        return (
          <div key={caseStudy.slug} role="listitem" className="flex">
            <button
              ref={(node) => {
                if (node) itemRefs.current.set(caseStudy.slug, node);
                else itemRefs.current.delete(caseStudy.slug);
              }}
              type="button"
              onClick={() => onSelect(caseStudy.slug)}
              aria-current={isSelected ? "true" : undefined}
              className="rail-card"
              style={
                { "--domain-color": caseStudy.domain.color } as CSSProperties
              }
            >
              <span className="rail-folder-tab">
                <span
                  className="rail-folder-dot"
                  style={{ backgroundColor: caseStudy.domain.color }}
                  aria-hidden="true"
                />
                <span className="font-semibold tracking-[0.06em] tnum">
                  {caseStudy.countryCode}
                </span>
                {caseStudy.year && (
                  <span className="t-faint tnum">· {caseStudy.year}</span>
                )}
              </span>

              <span className="rail-folder-back-plate" aria-hidden="true" />

              <span className="rail-folder-sheets" aria-hidden="true">
                <span className="rail-folder-sheet rail-folder-sheet--back">
                  <span className="rail-sheet-line" />
                </span>
                <span className="rail-folder-sheet rail-folder-sheet--front">
                  <span
                    className="rail-sheet-stripe"
                    style={{ backgroundColor: caseStudy.domain.color }}
                  />
                  <span className="rail-sheet-line" />
                  <span className="rail-sheet-line rail-sheet-line--short" />
                </span>
              </span>

              <span className="rail-folder-front">
                <span
                  className="rail-tab"
                  style={{ backgroundColor: caseStudy.domain.color }}
                  aria-hidden="true"
                />
                <span className="block text-[0.9375rem] font-medium leading-snug">
                  {caseStudy.title}
                </span>
                <span className="rail-meta mt-auto block pt-3 text-[0.6875rem] t-soft">
                  {caseStudy.domain.name}
                  {caseStudy.region ? `, ${caseStudy.region}` : ""}
                </span>
              </span>
            </button>
          </div>
        );
      })}
    </div>
  );
}
