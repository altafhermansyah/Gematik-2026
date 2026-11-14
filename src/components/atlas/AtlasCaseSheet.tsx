import type { CSSProperties } from "react";
import Link from "next/link";
import type { Locale } from "@/lib/i18n/localized";
import { formatTemplate } from "@/lib/i18n/messages";
import { formatMetricValue, formatTechnologyTag } from "@/lib/format";
import type { AtlasCase } from "@/modules/atlas/types";

export type AtlasCaseSheetLabels = {
  fileLabel: string;
  close: string;
  readFullCase: string;
  metricsHeading: string;
  sourcesTemplate: string;
  featuredBadge: string;
};

type AtlasCaseSheetProps = {
  selectedCase: AtlasCase | null;
  detailHref: string;
  locale: Locale;
  labels: AtlasCaseSheetLabels;
  onClose: () => void;
};

export default function AtlasCaseSheet({
  selectedCase,
  detailHref,
  locale,
  labels,
  onClose,
}: AtlasCaseSheetProps) {
  const isOpen = selectedCase !== null;

  return (
    <aside
      aria-hidden={!isOpen}
      aria-label={selectedCase?.title}
      className={`atlas-sheet fixed inset-y-0 right-0 z-50 flex w-full max-w-[27.5rem] flex-col transition-transform ${
        isOpen ? "translate-x-0" : "pointer-events-none translate-x-full"
      }`}
    >
      {selectedCase && (
        <>
          <span className="atlas-sheet-stack" aria-hidden="true">
            <span className="atlas-sheet-edge atlas-sheet-edge--outer" />
            <span className="atlas-sheet-edge atlas-sheet-edge--inner" />
          </span>

          <span
            className="atlas-sheet-ribbon"
            style={{ backgroundColor: selectedCase.domain.color }}
            aria-hidden="true"
          />

          <div className="atlas-sheet-header">
            <div className="atlas-dossier-tab">
              <span
                className="swatch"
                style={{ backgroundColor: selectedCase.domain.color }}
                aria-hidden="true"
              />
              <span className="micro font-semibold text-[var(--ink)]">
                {labels.fileLabel}
              </span>
              <span className="atlas-dossier-code tnum">
                {selectedCase.countryCode}
                {selectedCase.year ? ` · ${selectedCase.year}` : ""}
              </span>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="atlas-close-btn"
            >
              <span>{labels.close}</span>
              <span aria-hidden="true" className="atlas-close-glyph">
                ×
              </span>
            </button>
          </div>

          <div
            key={selectedCase.slug}
            className="atlas-sheet-body flex-1 overflow-y-auto px-6 pb-10 pt-5"
          >
            <div
              aria-live="polite"
              className="sheet-settle-item"
              style={{ "--settle-i": 0 } as CSSProperties}
            >
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5 text-[0.75rem] t-soft">
                <span className="font-medium text-[var(--ink)]">
                  {selectedCase.domain.name}
                </span>
                <span className="t-faint" aria-hidden="true">
                  /
                </span>
                <span className="t-faint tnum">
                  {selectedCase.region ?? selectedCase.countryCode},{" "}
                  {selectedCase.countryCode}
                </span>
                {selectedCase.featured && (
                  <span className="atlas-editor-stamp">
                    {labels.featuredBadge}
                  </span>
                )}
              </div>

              <h2
                id="atlas-sheet-title"
                className="atlas-sheet-title mt-3"
              >
                {selectedCase.title}
              </h2>
              <p className="small t-soft mt-3 leading-relaxed">
                {selectedCase.summary}
              </p>
            </div>

            <div
              className="atlas-double-rule sheet-settle-item mt-6"
              style={{ "--settle-i": 1 } as CSSProperties}
              aria-hidden="true"
            />

            {selectedCase.metrics && selectedCase.metrics.length > 0 && (
              <section
                className="atlas-metric-slip sheet-settle-item mt-5"
                style={
                  {
                    "--slip-accent": selectedCase.domain.color,
                    "--settle-i": 2,
                  } as CSSProperties
                }
              >
                <svg
                  viewBox="0 0 18 32"
                  fill="none"
                  className="atlas-paperclip"
                  aria-hidden="true"
                >
                  <path
                    d="M5.5 9V22.5C5.5 24.7 7.3 26.5 9.5 26.5C11.7 26.5 13.5 24.7 13.5 22.5V7C13.5 4.2 11.3 2 8.5 2C5.7 2 3.5 4.2 3.5 7V21.5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>

                <div className="atlas-slip-head">
                  <h3 className="micro font-semibold text-[var(--ink)]">
                    {labels.metricsHeading}
                  </h3>
                  <span className="atlas-slip-ref tnum" aria-hidden="true">
                    {selectedCase.countryCode}
                    {selectedCase.year ? `-${selectedCase.year}` : ""}
                  </span>
                </div>

                <dl className="atlas-slip-rows mt-3">
                  {selectedCase.metrics.slice(0, 2).map((metric, index) => (
                    <div key={index} className="atlas-slip-row">
                      <dt className="atlas-slip-dt">
                        <span className="atlas-slip-idx tnum" aria-hidden="true">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <span className="micro t-soft leading-snug">
                          {metric.label}
                        </span>
                      </dt>
                      <dd className="mt-1.5 flex flex-wrap items-baseline gap-x-1.5 pl-6">
                        <span className="num text-[1.9rem] leading-none text-[var(--ink)] tnum">
                          {formatMetricValue(metric.value, locale)}
                        </span>
                        <span className="text-[0.75rem] t-soft">
                          {metric.unit}
                        </span>
                      </dd>
                    </div>
                  ))}
                </dl>
              </section>
            )}

            <div
              className="sheet-settle-item mt-5 flex flex-wrap gap-1.5"
              style={{ "--settle-i": 3 } as CSSProperties}
            >
              {selectedCase.sdgs?.map((sdg) => (
                <span key={`sdg-${sdg}`} className="chip tnum">
                  SDG {sdg}
                </span>
              ))}
              {selectedCase.technologies?.slice(0, 4).map((technology) => (
                <span key={technology} className="chip">
                  {formatTechnologyTag(technology)}
                </span>
              ))}
            </div>

            <div
              className="sheet-settle-item mt-7 border-t hairline pt-5"
              style={{ "--settle-i": 4 } as CSSProperties}
            >
              <Link
                href={detailHref}
                className="btn btn-ink flex w-full justify-between px-5"
              >
                <span>{labels.readFullCase}</span>
                <span aria-hidden="true">→</span>
              </Link>
              <p className="micro t-faint mt-3 text-center">
                {formatTemplate(labels.sourcesTemplate, {
                  count: selectedCase.sourcesCount ?? 0,
                })}
              </p>
            </div>
          </div>
        </>
      )}
    </aside>
  );
}
