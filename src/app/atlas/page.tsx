import type { Metadata } from "next";
import { preload } from "react-dom";
import SiteHeader from "@/components/site/SiteHeader";
import AtlasExplorer, {
  type AtlasExplorerLabels,
} from "@/components/atlas/AtlasExplorer";
import { getAtlasCases, getAtlasDomains } from "@/modules/atlas/queries";
import { DEFAULT_LOCALE, type Locale } from "@/lib/i18n/localized";
import { getMessages } from "@/lib/i18n/messages";

type AtlasPageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

function readLocale(value: string | string[] | undefined): Locale {
  return value === "en" ? "en" : DEFAULT_LOCALE;
}

export async function generateMetadata({
  searchParams,
}: AtlasPageProps): Promise<Metadata> {
  const resolved = await searchParams;
  const t = getMessages(readLocale(resolved.lang));
  return {
    title: t.atlas.meta.title,
    description: t.atlas.meta.description,
  };
}

export default async function AtlasPage({ searchParams }: AtlasPageProps) {
  const resolved = await searchParams;
  const locale = readLocale(resolved.lang);
  const t = getMessages(locale);

  const cases = getAtlasCases(locale);
  const domains = getAtlasDomains(locale);

  const rawCase = resolved.case;
  const caseSlug = typeof rawCase === "string" ? rawCase : null;

  const rawDomain = resolved.domain;
  const domainSlug =
    typeof rawDomain === "string" && domains.some((d) => d.slug === rawDomain)
      ? rawDomain
      : null;

  const rawQuery = resolved.q;
  const searchQuery = typeof rawQuery === "string" ? rawQuery : "";

  const initialSelectedSlug =
    caseSlug && cases.some((c) => c.slug === caseSlug) ? caseSlug : null;

  const labels: AtlasExplorerLabels = {
    title: t.atlas.stage.title,
    description: t.atlas.stage.description,
    indexHeading: t.atlas.stage.indexHeading,
    stats: t.atlas.stats,
    filters: t.atlas.filters,
    rail: t.atlas.rail,
    sheet: {
      fileLabel: t.cases.fileLabel,
      close: t.atlas.sheet.close,
      readFullCase: t.atlas.sheet.readFullCase,
      metricsHeading: t.atlas.sheet.metricsHeading,
      sourcesTemplate: t.atlas.sheet.sourcesTemplate,
      featuredBadge: t.atlas.sheet.featuredBadge,
    },
    globe: {
      emptyTitle: t.atlas.globe.emptyTitle,
      emptyDescription: t.atlas.globe.emptyDescription,
      webglUnavailableTitle: t.atlas.globe.webglUnavailableTitle,
      webglUnavailableDescription: t.atlas.globe.webglUnavailableDescription,
      canvasAriaTemplate: t.atlas.globe.canvasAriaTemplate,
      keyboardHint: t.atlas.globe.keyboardHint,
      legendHeading: t.atlas.globe.legendHeading,
      pauseRotation: t.atlas.controls.pauseRotation,
      resumeRotation: t.atlas.controls.resumeRotation,
      focusIndonesia: t.atlas.controls.focusIndonesia,
      resetView: t.atlas.controls.resetView,
      tryAgain: t.common.tryAgain,
      resetFilters: t.atlas.filters.resetFilters,
    },
    sections: {
      globeAria: t.atlas.sections.globeAria,
      railAria: t.atlas.sections.railAria,
    },
  };

  const isIndonesiaOnly = resolved.country === "ID";
  const isFeaturedOnly = resolved.featured === "1";
  const explorerKey = `${locale}:${domainSlug ?? ""}:${initialSelectedSlug ?? ""}:${searchQuery}:${isIndonesiaOnly ? "ID" : ""}:${isFeaturedOnly ? "1" : ""}`;

  preload("/globe/planet.glb", {
    as: "fetch",
    crossOrigin: "anonymous",
    fetchPriority: "high",
  });
  preload("/globe/planet-lights.webp", {
    as: "image",
    type: "image/webp",
    crossOrigin: "anonymous",
    fetchPriority: "high",
  });

  return (
    <main id="main" className="night-stage night">
      <SiteHeader locale={locale} labels={t.nav} />
      <AtlasExplorer
        key={explorerKey}
        cases={cases}
        domains={domains}
        initialSelectedSlug={initialSelectedSlug}
        initialDomainSlug={domainSlug}
        initialSearchQuery={searchQuery}
        initialIndonesiaOnly={isIndonesiaOnly}
        initialFeaturedOnly={isFeaturedOnly}
        locale={locale}
        labels={labels}
      />
    </main>
  );
}
