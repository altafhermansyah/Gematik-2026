import type { Locale } from "@/lib/i18n/localized";
import { DEFAULT_LOCALE, resolveLocalized } from "@/lib/i18n/localized";
import {
  getDomainBySlug,
  getDomains,
  getPublishedCases,
} from "@/modules/content/store";
import type { AtlasCase, AtlasDomain } from "./types";

/**
 * Mengambil daftar bidang masalah terurut untuk filter dan legenda Atlas.
 */
export function getAtlasDomains(locale: Locale = DEFAULT_LOCALE): AtlasDomain[] {
  return getDomains().map((domain) => ({
    slug: domain.slug,
    name: resolveLocalized(domain.name, `${domain.slug}.name`, locale),
    color: domain.color,
    order: domain.order,
  }));
}

/**
 * Mengambil kasus terbit untuk Atlas.
 *
 * Sebelumnya fungsi ini melakukan query Prisma. Sejak migrasi ke konten lokal,
 * sumbernya adalah array bertipe di `src/content/cases` sehingga tidak ada I/O
 * dan fungsi ini sinkron.
 */
export function getAtlasCases(locale: Locale = DEFAULT_LOCALE): AtlasCase[] {
  return getPublishedCases().map((caseStudy) => {
    const domain = getDomainBySlug(caseStudy.domainSlug);
    if (!domain) {
      throw new Error(
        `Konten Atlas tidak valid: kasus "${caseStudy.slug}" merujuk domain tak dikenal "${caseStudy.domainSlug}"`
      );
    }

    return {
      slug: caseStudy.slug,
      title: resolveLocalized(caseStudy.title, `${caseStudy.slug}.title`, locale),
      summary: resolveLocalized(
        caseStudy.summary,
        `${caseStudy.slug}.summary`,
        locale
      ),
      lat: caseStudy.lat,
      lng: caseStudy.lng,
      countryCode: caseStudy.countryCode,
      region: caseStudy.region,
      featured: caseStudy.featured,
      year: caseStudy.year,
      sdgs: [...caseStudy.sdgs],
      technologies: [...caseStudy.technologies],
      metrics: caseStudy.metrics.map((metric, index) => ({
        label: resolveLocalized(
          metric.label,
          `${caseStudy.slug}.metrics[${index}].label`,
          locale
        ),
        value: metric.value,
        unit: resolveLocalized(
          metric.unit,
          `${caseStudy.slug}.metrics[${index}].unit`,
          locale
        ),
      })),
      sourcesCount: caseStudy.sources.length,
      domain: {
        slug: domain.slug,
        name: resolveLocalized(domain.name, `${domain.slug}.name`, locale),
        color: domain.color,
      },
    };
  });
}
