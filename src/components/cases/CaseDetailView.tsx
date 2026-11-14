"use client";

import { useEffect, useSyncExternalStore } from "react";
import Link from "next/link";
import type { Locale } from "@/lib/i18n/localized";
import type { Messages } from "@/lib/i18n/messages";
import { formatTechnologyTag } from "@/lib/format";
import { localeHref } from "@/lib/i18n/urls";
import {
  readLocaleFromUrl,
  subscribeLocaleChange,
} from "@/lib/i18n/locale-events";
import type { CaseDetail } from "@/modules/cases/types";
import CaseHeader from "./CaseHeader";
import CaseSection from "./CaseSection";
import CaseMetrics from "./CaseMetrics";
import CaseSources from "./CaseSources";

type CaseDetailViewProps = {
  caseByLocale: Record<Locale, CaseDetail>;
  messagesByLocale: Record<Locale, Messages>;
};

const SECTION_ANCHORS = [
  { id: "problem", key: "problem" },
  { id: "solution", key: "solution" },
  { id: "ai-role", key: "aiRole" },
  { id: "impact", key: "impact" },
  { id: "metrics", key: "metrics" },
  { id: "sources", key: "sources" },
] as const;

export default function CaseDetailView({
  caseByLocale,
  messagesByLocale,
}: CaseDetailViewProps) {
  const locale = useSyncExternalStore(
    subscribeLocaleChange,
    readLocaleFromUrl,
    () => "id" as Locale
  );

  const caseDetail = caseByLocale[locale];
  const t = messagesByLocale[locale];

  useEffect(() => {
    document.title = `${caseDetail.title}${t.cases.meta.titleSuffix}`;
  }, [caseDetail.title, t.cases.meta.titleSuffix]);

  return (
    <article>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href={localeHref(
            `/atlas?case=${encodeURIComponent(caseDetail.slug)}`,
            locale
          )}
          className="draw small t-soft inline-flex min-h-[28px] items-center gap-1.5"
        >
          <span aria-hidden="true">←</span> {t.common.backToAtlas}
        </Link>
        <p className="micro t-faint">{t.cases.fileLabel}</p>
      </div>

      <div className="mt-8">
        <CaseHeader
          title={caseDetail.title}
          summary={caseDetail.summary}
          countryCode={caseDetail.countryCode}
          region={caseDetail.region}
          year={caseDetail.year}
          sdgs={caseDetail.sdgs}
          technologies={caseDetail.technologies}
          domain={caseDetail.domain}
        />
      </div>

      <div className="case-shell mt-12">
        <div className="min-w-0">
          <CaseSection
            id={SECTION_ANCHORS[0].id}
            index="01"
            title={t.cases.sections.problem}
            content={caseDetail.problem}
          />
          <CaseSection
            id={SECTION_ANCHORS[1].id}
            index="02"
            title={t.cases.sections.solution}
            content={caseDetail.solution}
          />
          <CaseSection
            id={SECTION_ANCHORS[2].id}
            index="03"
            title={t.cases.sections.aiRole}
            content={caseDetail.aiRole}
          />
          <CaseSection
            id={SECTION_ANCHORS[3].id}
            index="04"
            title={t.cases.sections.impact}
            content={caseDetail.impact}
          />

          <CaseMetrics
            id={SECTION_ANCHORS[4].id}
            index="05"
            title={t.cases.sections.metrics}
            sourceQuotePrefix={t.cases.metrics.sourceQuotePrefix}
            opensInNewTab={t.common.opensInNewTab}
            locale={locale}
            metrics={caseDetail.metrics}
            accentColor={caseDetail.domain.color}
          />

          <CaseSources
            id={SECTION_ANCHORS[5].id}
            index="06"
            title={t.cases.sections.sources}
            opensInNewTab={t.common.opensInNewTab}
            accessedPrefix={t.cases.sources.accessedPrefix}
            locale={locale}
            sources={caseDetail.sources}
          />

          <footer className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t hairline pt-6">
            <Link
              href={localeHref(
                `/atlas?domain=${encodeURIComponent(caseDetail.domain.slug)}`,
                locale
              )}
              className="btn btn-ghost"
            >
              {t.cases.footer.exploreDomain}
            </Link>
            <Link
              href={localeHref("/atlas", locale)}
              className="draw small t-soft inline-flex min-h-[28px] items-center"
            >
              {t.cases.footer.backToAtlas}
            </Link>
          </footer>
        </div>

        <aside className="case-rail" aria-label={t.cases.fileLabel}>
          <p className="micro t-faint pt-3">{t.cases.rail.contents}</p>
          <nav className="mt-2 mb-7" aria-label={t.cases.rail.contents}>
            <ul>
              {SECTION_ANCHORS.map((anchor) => (
                <li key={anchor.id}>
                  <a
                    href={`#${anchor.id}`}
                    className="draw small flex min-h-[28px] items-center gap-2 py-1 t-soft"
                  >
                    <span className="num micro t-faint tnum">
                      {String(
                        SECTION_ANCHORS.indexOf(anchor) + 1
                      ).padStart(2, "0")}
                    </span>
                    {t.cases.sections[anchor.key]}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <dl>
            <div className="case-rail-row">
              <dt>{t.cases.rail.location}</dt>
              <dd>
                {caseDetail.region ?? caseDetail.countryCode},{" "}
                {caseDetail.countryCode}
              </dd>
            </div>
            {caseDetail.year && (
              <div className="case-rail-row">
                <dt>{t.cases.rail.year}</dt>
                <dd className="tnum">{caseDetail.year}</dd>
              </div>
            )}
            <div className="case-rail-row">
              <dt>{t.cases.rail.domain}</dt>
              <dd className="flex items-center gap-1.5">
                <span
                  className="swatch"
                  style={{ backgroundColor: caseDetail.domain.color }}
                  aria-hidden="true"
                />
                {caseDetail.domain.name}
              </dd>
            </div>
            <div className="case-rail-row">
              <dt>{t.cases.rail.sdgs}</dt>
              <dd className="tnum">{caseDetail.sdgs.join(", ")}</dd>
            </div>
            <div className="case-rail-row">
              <dt>{t.cases.rail.technologies}</dt>
              <dd>
                {caseDetail.technologies
                  .map((technology) => formatTechnologyTag(technology))
                  .join(", ")}
              </dd>
            </div>
            <div className="case-rail-row">
              <dt>{t.cases.rail.metrics}</dt>
              <dd className="tnum">{caseDetail.metrics.length}</dd>
            </div>
            <div className="case-rail-row">
              <dt>{t.cases.rail.sources}</dt>
              <dd className="tnum">{caseDetail.sources.length}</dd>
            </div>
          </dl>
        </aside>
      </div>
    </article>
  );
}
