import type { MetadataRoute } from "next";
import { getSiteOrigin } from "@/lib/seo/metadata";
import { getPublishedCases } from "@/modules/content/store";

const FALLBACK_LAST_MODIFIED = new Date("2026-11-01T00:00:00.000Z");

function resolveCaseLastModified(accessedDates: Array<string | null>): Date {
  let latestTimestamp = 0;

  for (const raw of accessedDates) {
    if (!raw) continue;
    const parsed = Date.parse(raw);
    if (!Number.isNaN(parsed) && parsed > latestTimestamp) {
      latestTimestamp = parsed;
    }
  }

  return latestTimestamp > 0 ? new Date(latestTimestamp) : FALLBACK_LAST_MODIFIED;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const origin = getSiteOrigin();
  const cases = getPublishedCases();

  const coreEntries: MetadataRoute.Sitemap = [
    {
      url: `${origin}/`,
      lastModified: FALLBACK_LAST_MODIFIED,
      changeFrequency: "weekly",
      priority: 1,
      alternates: {
        languages: {
          id: `${origin}/`,
          en: `${origin}/?lang=en`,
        },
      },
    },
    {
      url: `${origin}/atlas`,
      lastModified: FALLBACK_LAST_MODIFIED,
      changeFrequency: "weekly",
      priority: 0.9,
      alternates: {
        languages: {
          id: `${origin}/atlas`,
          en: `${origin}/atlas?lang=en`,
        },
      },
    },
  ];

  const caseEntries: MetadataRoute.Sitemap = cases.map((caseStudy) => ({
    url: `${origin}/cases/${caseStudy.slug}`,
    lastModified: resolveCaseLastModified(
      caseStudy.sources.map((source) => source.accessedAt)
    ),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [...coreEntries, ...caseEntries];
}
