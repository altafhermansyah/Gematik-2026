import { DEFAULT_LOCALE, type Locale, resolveLocalized } from "@/lib/i18n/localized";
import type { CaseDetail } from "@/modules/cases/types";
import { getDomains, getPublishedCases } from "@/modules/content/store";
import { getSiteOrigin, SITE_NAME } from "./metadata";

/**
 * Serializes JSON-LD safely for inline `<script type="application/ld+json">`
 * by escaping `<` as `\u003c` to prevent XSS `</script>` breakout.
 */
export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export function buildHomeJsonLd(locale: Locale = DEFAULT_LOCALE) {
  const origin = getSiteOrigin();
  const cases = getPublishedCases();
  const domains = getDomains();

  const countryCount = new Set(cases.map((item) => item.countryCode)).size;
  const metricCount = cases.reduce((sum, item) => sum + item.metrics.length, 0);
  const languageTag = locale === "en" ? "en-US" : "id-ID";

  const siteDescription =
    locale === "en"
      ? `Curated atlas of ${cases.length} proven AI and field-tested technology innovations across ${countryCount} countries with ${metricCount} metrics cited directly from primary sources.`
      : `Atlas kurasi ${cases.length} inovasi AI dan teknologi yang terbukti berdampak di ${countryCount} negara, dengan ${metricCount} metrik dampak dikutip langsung dari sumber primer.`;

  const itemListName =
    locale === "en"
      ? "Verified AI & Field Innovation Case Studies"
      : "Daftar Studi Kasus Inovasi Terverifikasi";

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${origin}/#website`,
        url: `${origin}/`,
        name: SITE_NAME,
        description: siteDescription,
        inLanguage: languageTag,
        publisher: {
          "@id": `${origin}/#organization`,
        },
      },
      {
        "@type": "EducationalOrganization",
        "@id": `${origin}/#organization`,
        name: SITE_NAME,
        url: `${origin}/`,
        description:
          locale === "en"
            ? "Open interactive observatory and evidence-grounded field archive mapping AI and technology solutions aligned with UN Sustainable Development Goals."
            : "Observatory interaktif dan arsip bukti lapangan terbuka yang memetakan inovasi AI serta teknologi untuk UN Sustainable Development Goals.",
        knowsAbout: [
          ...domains.map((domain) =>
            resolveLocalized(domain.name, `${domain.slug}.name`, locale)
          ),
          "UN Sustainable Development Goals",
          "Applied Artificial Intelligence",
        ],
      },
      {
        "@type": "ItemList",
        "@id": `${origin}/#cases`,
        name: itemListName,
        numberOfItems: cases.length,
        itemListElement: cases.map((caseStudy, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: resolveLocalized(caseStudy.title, `${caseStudy.slug}.title`, locale),
          description: resolveLocalized(
            caseStudy.summary,
            `${caseStudy.slug}.summary`,
            locale
          ),
          url: `${origin}/cases/${caseStudy.slug}`,
        })),
      },
    ],
  };
}

export function buildCaseJsonLd(
  caseDetail: CaseDetail,
  locale: Locale = DEFAULT_LOCALE
) {
  const origin = getSiteOrigin();
  const caseUrl = `${origin}/cases/${caseDetail.slug}`;
  const languageTag = locale === "en" ? "en-US" : "id-ID";
  const metricsSummary = caseDetail.metrics
    .map((metric) => `${metric.label}: ${metric.value} ${metric.unit}`.trim())
    .join("; ");
  const placeName = [caseDetail.region, caseDetail.countryCode]
    .filter(Boolean)
    .join(", ");

  return {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    "@id": `${caseUrl}#article`,
    url: caseUrl,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": caseUrl,
    },
    headline: caseDetail.title,
    description: caseDetail.summary,
    abstract: `${caseDetail.impact}${metricsSummary ? ` (${metricsSummary})` : ""}`,
    articleSection: caseDetail.domain.name,
    inLanguage: languageTag,
    ...(caseDetail.year ? { datePublished: `${caseDetail.year}-01-01` } : {}),
    keywords: [
      caseDetail.domain.name,
      ...caseDetail.technologies,
      ...caseDetail.sdgs.map((sdg) => `SDG ${sdg}`),
    ],
    image: `${origin}/cases/${caseDetail.slug}/opengraph-image`,
    author: {
      "@type": "EducationalOrganization",
      "@id": `${origin}/#organization`,
      name: SITE_NAME,
    },
    publisher: {
      "@type": "EducationalOrganization",
      "@id": `${origin}/#organization`,
      name: SITE_NAME,
    },
    spatialCoverage: {
      "@type": "Place",
      name: placeName,
      address: {
        "@type": "PostalAddress",
        ...(caseDetail.region ? { addressRegion: caseDetail.region } : {}),
        addressCountry: caseDetail.countryCode,
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: caseDetail.lat,
        longitude: caseDetail.lng,
      },
    },
    about: [
      {
        "@type": "Thing",
        name: caseDetail.domain.name,
      },
      ...caseDetail.sdgs.map((sdg) => ({
        "@type": "DefinedTerm",
        name: `UN SDG ${sdg}`,
      })),
    ],
    citation: caseDetail.sources.map((source) => ({
      "@type": "CreativeWork",
      name: source.title,
      url: source.url,
      publisher: {
        "@type": "Organization",
        name: source.publisher,
      },
    })),
  };
}
