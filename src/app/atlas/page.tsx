import type { Metadata } from "next";
import { getAtlasCases } from "@/modules/atlas/queries";
import AtlasExplorer from "@/components/atlas/AtlasExplorer";

export const metadata: Metadata = {
  title: "Atlas Inovasi Global | KarsaLoka",
  description:
    "Jelajahi inovasi teknologi dan peran AI dalam menyelesaikan tantangan global.",
};

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

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <AtlasExplorer
        cases={cases}
        initialSelectedSlug={initialSelectedSlug}
      />
    </main>
  );
}
