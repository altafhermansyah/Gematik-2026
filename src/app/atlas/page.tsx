// src/app/atlas/page.tsx
import { prisma } from "@/lib/prisma";
import AtlasGlobe from "@/components/globe/AtlasGlobe";

type Localized = { id: string; en: string };

export default async function AtlasPage() {
  const cases = await prisma.case.findMany({
    where: { status: "PUBLISHED" },
    select: {
      slug: true,
      title: true,
      lat: true,
      lng: true,
      domain: { select: { color: true } },
    },
  });

  const points = cases.map((c) => ({
    slug: c.slug,
    title: (c.title as Localized).id,
    lat: c.lat,
    lng: c.lng,
    color: c.domain.color,
  }));

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 p-6">
      <AtlasGlobe points={points} />
    </main>
  );
}
