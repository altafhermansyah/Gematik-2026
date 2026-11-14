import type { Locale } from "@/lib/i18n/localized";
import { DEFAULT_LOCALE, resolveLocalized } from "@/lib/i18n/localized";
import { getDomainBySlug, getPublishedCaseBySlug } from "@/modules/content/store";
import type { CaseDetail } from "./types";

/**
 * Mengambil satu kasus terbit berdasarkan slug.
 *
 * Sebelumnya fungsi ini melakukan query Prisma lalu memvalidasi `metrics`
 * dengan Zod. Pada model konten lokal, `metrics` sudah berbentuk tipe yang
 * dijamin `satisfies` dan diperiksa `assertContentIntegrity()`, sehingga
 * validasi runtime dan pembungkus `cache()` (untuk dedup antara
 * `generateMetadata` dan komponen halaman) tidak lagi diperlukan: tidak ada I/O
 * yang bisa diulang.
 *
 * Mengembalikan `null` bila slug tidak ada atau kasusnya belum terbit, sehingga
 * halaman bisa memanggil `notFound()`.
 */
export function getCaseBySlug(
  slug: string,
  locale: Locale = DEFAULT_LOCALE
): CaseDetail | null {
  const caseStudy = getPublishedCaseBySlug(slug);
  if (!caseStudy) {
    return null;
  }

  const domain = getDomainBySlug(caseStudy.domainSlug);
  if (!domain) {
    throw new Error(
      `Konten kasus tidak valid: kasus "${caseStudy.slug}" merujuk domain tak dikenal "${caseStudy.domainSlug}"`
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
    problem: resolveLocalized(
      caseStudy.problem,
      `${caseStudy.slug}.problem`,
      locale
    ),
    solution: resolveLocalized(
      caseStudy.solution,
      `${caseStudy.slug}.solution`,
      locale
    ),
    aiRole: resolveLocalized(
      caseStudy.aiRole,
      `${caseStudy.slug}.aiRole`,
      locale
    ),
    impact: resolveLocalized(
      caseStudy.impact,
      `${caseStudy.slug}.impact`,
      locale
    ),
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
      quote: metric.quote,
      sourceUrl: metric.sourceUrl,
    })),
    countryCode: caseStudy.countryCode,
    region: caseStudy.region,
    lat: caseStudy.lat,
    lng: caseStudy.lng,
    year: caseStudy.year,
    sdgs: [...caseStudy.sdgs],
    technologies: [...caseStudy.technologies],
    domain: {
      slug: domain.slug,
      name: resolveLocalized(domain.name, `${domain.slug}.name`, locale),
      color: domain.color,
    },
    sources: caseStudy.sources.map((source) => ({
      title: source.title,
      publisher: source.publisher,
      url: source.url,
      accessedAt: source.accessedAt,
    })),
  };
}
