"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import type { Locale } from "@/lib/i18n/localized";
import { formatTemplate } from "@/lib/i18n/messages";
import { localeHref } from "@/lib/i18n/urls";
import { useSharedIndicator } from "@/lib/motion/useSharedIndicator";
import type { AtlasCase, AtlasDomain } from "@/modules/atlas/types";
import AtlasGlobe, { type AtlasGlobeLabels } from "./AtlasGlobe";
import AtlasCaseRail from "./AtlasCaseRail";
import AtlasCaseSheet, {
  type AtlasCaseSheetLabels,
} from "./AtlasCaseSheet";

export type AtlasFilterLabels = {
  searchPlaceholder: string;
  searchAria: string;
  clearSearch: string;
  allDomains: string;
  indonesiaOnly: string;
  featuredOnly: string;
  filterByDomainAria: string;
  resetFilters: string;
  showingCountTemplate: string;
};

export type AtlasExplorerLabels = {
  title: string;
  description: string;
  indexHeading: string;
  stats: {
    cases: string;
    countries: string;
    metrics: string;
  };
  filters: AtlasFilterLabels;
  rail: {
    heading: string;
    hint: string;
    empty: string;
  };
  sheet: AtlasCaseSheetLabels;
  globe: AtlasGlobeLabels;
  sections: {
    globeAria: string;
    railAria: string;
  };
};

type AtlasExplorerProps = {
  cases: AtlasCase[];
  domains?: AtlasDomain[];
  initialSelectedSlug: string | null;
  initialDomainSlug?: string | null;
  initialSearchQuery?: string;
  initialIndonesiaOnly?: boolean;
  initialFeaturedOnly?: boolean;
  locale?: Locale;
  labels: AtlasExplorerLabels;
};

export default function AtlasExplorer({
  cases,
  domains,
  initialSelectedSlug,
  initialDomainSlug = null,
  initialSearchQuery = "",
  initialIndonesiaOnly = false,
  initialFeaturedOnly = false,
  locale = "id",
  labels,
}: AtlasExplorerProps) {
  const [selectedSlug, setSelectedSlug] = useState<string | null>(
    initialSelectedSlug
  );
  const [activeDomain, setActiveDomain] = useState<string | null>(
    initialDomainSlug
  );
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [indonesiaOnly, setIndonesiaOnly] = useState(initialIndonesiaOnly);
  const [featuredOnly, setFeaturedOnly] = useState(initialFeaturedOnly);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const { containerRef: spectrumRef, indicatorRef: spectrumIndicatorRef } =
    useSharedIndicator<HTMLDivElement>({
      activeKey: activeDomain ?? "__all__",
      orientation: "vertical",
    });

  const domainList = useMemo<AtlasDomain[]>(() => {
    if (domains && domains.length > 0) return domains;
    const seen = new Map<string, AtlasDomain>();
    for (const c of cases) {
      if (!seen.has(c.domain.slug)) {
        seen.set(c.domain.slug, { ...c.domain, order: seen.size });
      }
    }
    return [...seen.values()];
  }, [domains, cases]);

  const domainCounts = useMemo(() => {
    const counts = new Map<string, number>();
    for (const c of cases) {
      counts.set(c.domain.slug, (counts.get(c.domain.slug) ?? 0) + 1);
    }
    return counts;
  }, [cases]);

  const summaryStats = useMemo(
    () => ({
      cases: cases.length,
      countries: new Set(cases.map((c) => c.countryCode)).size,
      metrics: cases.reduce(
        (total, caseStudy) => total + (caseStudy.metrics?.length ?? 0),
        0
      ),
    }),
    [cases]
  );

  const filteredCases = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return cases.filter((caseStudy) => {
      if (activeDomain && caseStudy.domain.slug !== activeDomain) return false;
      if (indonesiaOnly && caseStudy.countryCode !== "ID") return false;
      if (featuredOnly && !caseStudy.featured) return false;
      if (!query) return true;

      return (
        caseStudy.title.toLowerCase().includes(query) ||
        caseStudy.summary.toLowerCase().includes(query) ||
        caseStudy.countryCode.toLowerCase().includes(query) ||
        (caseStudy.region?.toLowerCase().includes(query) ?? false) ||
        caseStudy.domain.name.toLowerCase().includes(query) ||
        (caseStudy.technologies?.some((tag) =>
          tag.replace(/-/g, " ").toLowerCase().includes(query)
        ) ??
          false) ||
        (caseStudy.sdgs?.some(
          (sdg) =>
            `sdg ${sdg}` === query || `sdg${sdg}` === query || String(sdg) === query
        ) ??
          false)
      );
    });
  }, [cases, activeDomain, indonesiaOnly, featuredOnly, searchQuery]);

  // A filtered-out case must never stay open in the sheet.
  const selectedCase = useMemo(
    () => filteredCases.find((c) => c.slug === selectedSlug) ?? null,
    [filteredCases, selectedSlug]
  );
  const effectiveSelectedSlug = selectedCase?.slug ?? null;

  const handleSelect = useCallback((slug: string) => {
    setSelectedSlug((previous) => (previous === slug ? null : slug));
  }, []);

  const handleClearSelection = useCallback(() => {
    setSelectedSlug(null);
  }, []);

  const handleResetFilters = useCallback(() => {
    setActiveDomain(null);
    setIndonesiaOnly(false);
    setFeaturedOnly(false);
    setSearchQuery("");
  }, []);

  // Mirror view state into the URL so a filtered atlas can be shared and the
  // language switch (a full navigation) keeps the current view.
  useEffect(() => {
    const url = new URL(window.location.href);
    const setOrDelete = (key: string, value: string | null) => {
      if (value) url.searchParams.set(key, value);
      else url.searchParams.delete(key);
    };

    setOrDelete("case", effectiveSelectedSlug);
    setOrDelete("domain", activeDomain);
    setOrDelete("country", indonesiaOnly ? "ID" : null);
    setOrDelete("featured", featuredOnly ? "1" : null);
    setOrDelete("q", searchQuery.trim() || null);

    if (url.toString() !== window.location.href) {
      window.history.replaceState(null, "", url.toString());
    }
  }, [
    effectiveSelectedSlug,
    activeDomain,
    indonesiaOnly,
    featuredOnly,
    searchQuery,
  ]);

  useEffect(() => {
    const onPopState = () => {
      const params = new URLSearchParams(window.location.search);
      const slug = params.get("case");
      const domain = params.get("domain");

      setSelectedSlug(slug && cases.some((c) => c.slug === slug) ? slug : null);
      setActiveDomain(
        domain && domainList.some((d) => d.slug === domain) ? domain : null
      );
      setSearchQuery(params.get("q") ?? "");
      setIndonesiaOnly(params.get("country") === "ID");
      setFeaturedOnly(params.get("featured") === "1");
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, [cases, domainList]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const isTyping =
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.isContentEditable;

      if (event.key === "Escape") {
        if (isTyping && searchQuery) {
          setSearchQuery("");
        } else {
          handleClearSelection();
        }
      } else if (event.key === "/" && !isTyping) {
        event.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [handleClearSelection, searchQuery]);

  const hasActiveFilters =
    activeDomain !== null ||
    indonesiaOnly ||
    featuredOnly ||
    searchQuery.trim().length > 0;

  const shownText = formatTemplate(labels.filters.showingCountTemplate, {
    shown: filteredCases.length,
    total: cases.length,
  });

  const detailHref = selectedCase
    ? localeHref(`/cases/${encodeURIComponent(selectedCase.slug)}`, locale)
    : "#";

  return (
    <div className="relative pb-8">
      <div className="stage-word" aria-hidden="true">
        ATLAS
      </div>

      <div className="wrap relative z-10 pt-5 sm:pt-8">
        <div className="atlas-layout">
          <div className="atlas-intro relative z-20 lg:pt-4">
            <h1 className="title max-w-[11ch] t-strong">{labels.title}</h1>
            <p className="small t-soft mt-3 max-w-[31ch]">
              {labels.description}
            </p>

            <div className="mt-7">
              <label htmlFor="atlas-search" className="sr-only">
                {labels.filters.searchAria}
              </label>
              <div className="relative">
                <input
                  id="atlas-search"
                  ref={searchInputRef}
                  type="search"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder={labels.filters.searchPlaceholder}
                  aria-label={labels.filters.searchAria}
                  className="atlas-search"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    aria-label={labels.filters.clearSearch}
                    className="absolute right-0 top-1/2 -translate-y-1/2 px-1 text-lg leading-none t-faint"
                  >
                    ×
                  </button>
                )}
              </div>

              <div className="mt-3 flex flex-wrap gap-1.5">
                <button
                  type="button"
                  aria-pressed={indonesiaOnly}
                  onClick={() => setIndonesiaOnly((previous) => !previous)}
                  className="stage-control"
                >
                  {labels.filters.indonesiaOnly}
                </button>
                <button
                  type="button"
                  aria-pressed={featuredOnly}
                  onClick={() => setFeaturedOnly((previous) => !previous)}
                  className="stage-control"
                >
                  {labels.filters.featuredOnly}
                </button>
                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={handleResetFilters}
                    className="stage-control"
                  >
                    {labels.filters.resetFilters}
                  </button>
                )}
              </div>
            </div>
          </div>

          <section
            aria-label={labels.sections.globeAria}
            className="atlas-globe relative z-10"
          >
            <AtlasGlobe
              cases={filteredCases}
              domains={domainList}
              selectedSlug={effectiveSelectedSlug}
              onSelect={handleSelect}
              onClearSelection={handleClearSelection}
              onResetFilters={handleResetFilters}
              labels={labels.globe}
            />
          </section>

          <div className="atlas-filters relative z-20">
            <div className="flex items-baseline justify-between gap-3">
              <h2 className="micro t-faint">{labels.indexHeading}</h2>
              <span className="micro t-faint tnum">{shownText}</span>
            </div>

            <div
              ref={spectrumRef}
              className="spectrum relative mt-2"
              role="group"
              aria-label={labels.filters.filterByDomainAria}
            >
              <span
                ref={spectrumIndicatorRef}
                className="spectrum-indicator"
                aria-hidden="true"
              />
              <button
                type="button"
                data-indicator-key="__all__"
                aria-pressed={activeDomain === null}
                onClick={() => setActiveDomain(null)}
                className="spectrum-row stagger-row"
                style={{ "--row-i": 0 } as CSSProperties}
              >
                <span
                  className="swatch"
                  style={{ backgroundColor: "var(--on-night-faint)" }}
                  aria-hidden="true"
                />
                <span className="text-[0.8125rem]">
                  {labels.filters.allDomains}
                </span>
                <span className="spectrum-count tnum">{cases.length}</span>
              </button>

              {domainList.map((domain, index) => (
                <button
                  key={domain.slug}
                  type="button"
                  data-indicator-key={domain.slug}
                  aria-pressed={activeDomain === domain.slug}
                  onClick={() =>
                    setActiveDomain((previous) =>
                      previous === domain.slug ? null : domain.slug
                    )
                  }
                  className="spectrum-row stagger-row"
                  style={{ "--row-i": index + 1 } as CSSProperties}
                >
                  <span
                    className="swatch"
                    style={{ backgroundColor: domain.color }}
                    aria-hidden="true"
                  />
                  <span className="text-[0.8125rem]">{domain.name}</span>
                  <span className="spectrum-count tnum">
                    {domainCounts.get(domain.slug) ?? 0}
                  </span>
                </button>
              ))}
            </div>

            <dl className="mt-5 grid grid-cols-3 gap-3 border-t hairline pt-4">
              <div>
                <dt className="micro t-faint">{labels.stats.cases}</dt>
                <dd className="num mt-0.5 text-lg tnum">
                  {summaryStats.cases}
                </dd>
              </div>
              <div>
                <dt className="micro t-faint">{labels.stats.countries}</dt>
                <dd className="num mt-0.5 text-lg tnum">
                  {summaryStats.countries}
                </dd>
              </div>
              <div>
                <dt className="micro t-faint">{labels.stats.metrics}</dt>
                <dd className="num mt-0.5 text-lg tnum">
                  {summaryStats.metrics}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        <section
          aria-label={labels.sections.railAria}
          className="relative z-20 mt-4 border-t hairline-strong pt-4"
        >
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="micro t-soft">{labels.rail.heading}</h2>
            <p className="micro t-faint">{labels.rail.hint}</p>
          </div>
          <AtlasCaseRail
            cases={filteredCases}
            selectedSlug={effectiveSelectedSlug}
            onSelect={handleSelect}
            emptyLabel={labels.rail.empty}
          />
        </section>
      </div>

      <AtlasCaseSheet
        selectedCase={selectedCase}
        detailHref={detailHref}
        locale={locale}
        labels={labels.sheet}
        onClose={handleClearSelection}
      />
    </div>
  );
}
