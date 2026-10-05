import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCaseBySlug } from "@/modules/cases/queries";
import { DEFAULT_LOCALE } from "@/lib/i18n/localized";
import { getMessages } from "@/lib/i18n/messages";
import CaseHeader from "@/components/cases/CaseHeader";
import CaseSection from "@/components/cases/CaseSection";
import CaseMetrics from "@/components/cases/CaseMetrics";
import CaseSources from "@/components/cases/CaseSources";

type CasePageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: CasePageProps): Promise<Metadata> {
  const { slug } = await params;
  const caseDetail = await getCaseBySlug(slug);
  const t = getMessages(DEFAULT_LOCALE);

  if (!caseDetail) {
    return {
      title: t.cases.meta.notFoundTitle,
    };
  }

  return {
    title: `${caseDetail.title}${t.cases.meta.titleSuffix}`,
    description: caseDetail.summary,
  };
}

export default async function CasePage({ params }: CasePageProps) {
  const { slug } = await params;
  const caseDetail = await getCaseBySlug(slug);

  if (!caseDetail) {
    notFound();
  }

  const t = getMessages(DEFAULT_LOCALE);

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[68ch] mx-auto space-y-8">
        {/* Navigation back to Atlas preserving selection */}
        <div>
          <Link
            href={`/atlas?case=${encodeURIComponent(caseDetail.slug)}`}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-400 hover:text-slate-200 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded py-1 px-1 -ml-1"
          >
            <span aria-hidden="true">&larr;</span>
            <span>{t.common.backToAtlas}</span>
          </Link>
        </div>

        <article className="space-y-10">
          {/* Header */}
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

          {/* Core Content Sections */}
          <div className="space-y-8">
            <CaseSection
              title={t.cases.sections.problem}
              content={caseDetail.problem}
            />

            <CaseSection
              title={t.cases.sections.solution}
              content={caseDetail.solution}
            />

            <CaseSection
              title={t.cases.sections.aiRole}
              content={caseDetail.aiRole}
            />

            <CaseSection
              title={t.cases.sections.impact}
              content={caseDetail.impact}
            />
          </div>

          {/* Metrics block (renders nothing if metrics are empty) */}
          <CaseMetrics
            title={t.cases.sections.metrics}
            metrics={caseDetail.metrics}
          />

          {/* Verifiable Sources */}
          <CaseSources
            title={t.cases.sections.sources}
            opensInNewTab={t.common.opensInNewTab}
            accessedPrefix={t.cases.sources.accessedPrefix}
            sources={caseDetail.sources}
          />
        </article>
      </div>
    </main>
  );
}
