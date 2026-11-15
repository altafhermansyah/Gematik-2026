import type { MetadataRoute } from "next";
import { getSiteOrigin } from "@/lib/seo/metadata";

const PUBLIC_PATHS = [
  "/",
  "/atlas",
  "/cases/",
  "/llms.txt",
  "/llms-full.txt",
];

export default function robots(): MetadataRoute.Robots {
  const origin = getSiteOrigin();

  return {
    rules: [
      {
        userAgent: "*",
        allow: PUBLIC_PATHS,
        disallow: ["/api/"],
      },
      {
        userAgent: [
          "OAI-SearchBot",
          "GPTBot",
          "ClaudeBot",
          "PerplexityBot",
          "Google-Extended",
        ],
        allow: PUBLIC_PATHS,
        disallow: ["/api/"],
      },
    ],
    sitemap: `${origin}/sitemap.xml`,
    host: origin,
  };
}
