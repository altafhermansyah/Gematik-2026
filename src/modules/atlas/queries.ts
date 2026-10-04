import { prisma } from "@/lib/prisma";
import { pickLocalized, DEFAULT_LOCALE } from "@/lib/i18n/localized";
import type { AtlasCase } from "./types";

/**
 * Fetches published cases for the Atlas module.
 * Maps localized JSON fields to plain strings on the server.
 * Skips and logs rows whose localized JSON text fails validation with contextual metadata.
 * Database errors are intentionally uncaught here to propagate to the route error boundary.
 */
export async function getAtlasCases(): Promise<AtlasCase[]> {
  const rows = await prisma.case.findMany({
    where: { status: "PUBLISHED" },
    select: {
      slug: true,
      title: true,
      summary: true,
      lat: true,
      lng: true,
      countryCode: true,
      region: true,
      domain: {
        select: {
          slug: true,
          name: true,
          color: true,
        },
      },
    },
    orderBy: [
      { featured: "desc" },
      { slug: "asc" },
    ],
  });

  const validCases: AtlasCase[] = [];

  for (const row of rows) {
    const titleResult = pickLocalized(row.title, DEFAULT_LOCALE);
    if (!titleResult.ok) {
      console.error(
        `[modules/atlas/queries] getAtlasCases: case "${row.slug}" field "title" failed validation: ${titleResult.error}`
      );
      continue;
    }

    const summaryResult = pickLocalized(row.summary, DEFAULT_LOCALE);
    if (!summaryResult.ok) {
      console.error(
        `[modules/atlas/queries] getAtlasCases: case "${row.slug}" field "summary" failed validation: ${summaryResult.error}`
      );
      continue;
    }

    const domainNameResult = pickLocalized(row.domain.name, DEFAULT_LOCALE);
    if (!domainNameResult.ok) {
      console.error(
        `[modules/atlas/queries] getAtlasCases: case "${row.slug}" field "domain.name" failed validation: ${domainNameResult.error}`
      );
      continue;
    }

    validCases.push({
      slug: row.slug,
      title: titleResult.value,
      summary: summaryResult.value,
      lat: row.lat,
      lng: row.lng,
      countryCode: row.countryCode,
      region: row.region,
      domain: {
        slug: row.domain.slug,
        name: domainNameResult.value,
        color: row.domain.color,
      },
    });
  }

  return validCases;
}
