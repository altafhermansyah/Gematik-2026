import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SiteHeader from "@/components/site/SiteHeader";
import SiteFooter from "@/components/site/SiteFooter";
import CaseDetailView from "@/components/cases/CaseDetailView";
import { getCaseBySlug } from "@/modules/cases/queries";
import { getPublishedCases } from "@/modules/content/store";
import { DEFAULT_LOCALE } from "@/lib/i18n/localized";
import { getMessages, messages } from "@/lib/i18n/messages";

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
    return { title: t.cases.meta.notFoundTitle };
  }

  return {
    title: `${caseDetail.title}${t.cases.meta.titleSuffix}`,
    description: caseDetail.summary,
  };
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
