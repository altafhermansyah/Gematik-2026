import type { Metadata } from "next";
import { getAtlasCases } from "@/modules/atlas/queries";
import AtlasExplorer, {
  type AtlasExplorerLabels,
} from "@/components/atlas/AtlasExplorer";
import { DEFAULT_LOCALE } from "@/lib/i18n/localized";
import { getMessages, formatTemplate } from "@/lib/i18n/messages";

export async function generateMetadata(): Promise<Metadata> {
  const t = getMessages(DEFAULT_LOCALE);
  return {
    title: t.atlas.meta.title,
    description: t.atlas.meta.description,
  };
}

type AtlasPageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function AtlasPage({ searchParams }: AtlasPageProps) {
  const cases = await getAtlasCases();
  const resolvedParams = await searchParams;
  const rawCaseSlug = resolvedParams.case;
  const caseSlug = typeof rawCaseSlug === "string" ? rawCaseSlug : null;

  // Only pass initialSelectedSlug if it exists in the validated cases dataset
  const initialSelectedSlug =
    caseSlug && cases.some((c) => c.slug === caseSlug) ? caseSlug : null;

  const t = getMessages(DEFAULT_LOCALE);

  const labels: AtlasExplorerLabels = {
    headingTitle: t.atlas.header.title,
    headingDescription: t.atlas.header.description,
    globeSectionAria: t.atlas.sections.globeAria,
    panelSectionAria: t.atlas.sections.panelAria,
    listSectionAria: t.atlas.sections.listAria,
    casesHeading: t.atlas.list.casesHeading,
    clearSelection: t.atlas.list.clearSelection,
    panel: {
      empty: t.atlas.panel.empty,
      readFullCase: t.atlas.panel.readFullCase,
    },
    list: {
      empty: t.atlas.list.empty,
      navAria: t.atlas.list.navAria,
    },
    globe: {
      emptyTitle: t.atlas.globe.emptyTitle,
      emptyDescription: t.atlas.globe.emptyDescription,
      webglUnavailableTitle: t.atlas.globe.webglUnavailableTitle,
      webglUnavailableDescription: t.atlas.globe.webglUnavailableDescription,
      canvasAria: formatTemplate(t.atlas.globe.canvasAriaTemplate, {
        count: cases.length,
      }),
    },
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <AtlasExplorer
        cases={cases}
        initialSelectedSlug={initialSelectedSlug}
        labels={labels}
      />
    </main>
  );
}
