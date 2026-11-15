import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SiteHeader from "@/components/site/SiteHeader";
import SiteFooter from "@/components/site/SiteFooter";
import CaseDetailView from "@/components/cases/CaseDetailView";
import { getCaseBySlug } from "@/modules/cases/queries";
import { getPublishedCases } from "@/modules/content/store";
import { DEFAULT_LOCALE } from "@/lib/i18n/localized";
import { getMessages, messages } from "@/lib/i18n/messages";
import { buildCaseJsonLd, serializeJsonLd } from "@/lib/seo/json-ld";
import {
  buildPageMetadata,
  clampMetaTitle,
} from "@/lib/seo/metadata";

type CasePageProps = {
  params: Promise<{ slug: string }>;
};

/**
 * Every published case is known at build time. This both pre-renders the page
 * and triggers `assertContentIntegrity()`, so broken content fails the build
 * instead of shipping silently.
 */
export function generateStaticParams(): { slug: string }[] {
  return getPublishedCases().map((caseStudy) => ({ slug: caseStudy.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: CasePageProps): Promise<Metadata> {
  const { slug } = await params;
  const caseDetail = getCaseBySlug(slug);
  const t = getMessages(DEFAULT_LOCALE);

  if (!caseDetail) {
    return {
      title: t.cases.meta.notFoundTitle,
      robots: { index: false, follow: false },
    };
  }

  const locationLabel = [caseDetail.region, caseDetail.countryCode]
    .filter(Boolean)
    .join(", ");
  const shortTitle = clampMetaTitle(
    caseDetail.title,
    Math.max(36, 62 - t.cases.meta.titleSuffix.length)
  );

  return buildPageMetadata({
    title: `${shortTitle}${t.cases.meta.titleSuffix}`,
    description: caseDetail.summary,
    pathname: `/cases/${caseDetail.slug}`,
    locale: DEFAULT_LOCALE,
    imagePath: `/cases/${caseDetail.slug}/opengraph-image`,
    imageAlt: `${caseDetail.title} | ${caseDetail.domain.name} (${locationLabel})`,
    ogType: "article",
    ...(caseDetail.year ? { publishedTime: `${caseDetail.year}-01-01` } : {}),
    keywords: [
      caseDetail.domain.name,
      ...(caseDetail.region ? [caseDetail.region] : []),
      ...caseDetail.technologies,
      ...caseDetail.sdgs.map((sdg) => `SDG ${sdg}`),
    ],
  });
}

export default async function CasePage({ params }: CasePageProps) {
  const { slug } = await params;
  const caseId = getCaseBySlug(slug, "id");
  const caseEn = getCaseBySlug(slug, "en");

  if (!caseId || !caseEn) notFound();

  const published = getPublishedCases();
  const metricCount = published.reduce(
    (total, caseStudy) => total + caseStudy.metrics.length,
    0
  );
  const t = getMessages(DEFAULT_LOCALE);

  return (
    <main id="main">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd(buildCaseJsonLd(caseId, DEFAULT_LOCALE)),
        }}
      />
      <SiteHeader locale={DEFAULT_LOCALE} labels={t.nav} />
      <div className="wrap py-8 sm:py-12">
        <CaseDetailView
          caseByLocale={{ id: caseId, en: caseEn }}
          messagesByLocale={messages}
        />
      </div>
      <SiteFooter
        locale={DEFAULT_LOCALE}
        labels={t.footer}
        caseCount={published.length}
        metricCount={metricCount}
      />
    </main>
  );
}
