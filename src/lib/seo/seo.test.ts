import { afterEach, describe, it } from "node:test";
import assert from "node:assert/strict";
import { getCaseBySlug } from "@/modules/cases/queries";
import { getDomains, getPublishedCases } from "@/modules/content/store";
import { buildCaseJsonLd, buildHomeJsonLd, serializeJsonLd } from "@/lib/seo/json-ld";
import { generateLlmsFullTxt, generateLlmsTxt } from "@/lib/seo/llms";
import {
  buildPageMetadata,
  clampMetaDescription,
  clampMetaTitle,
  DEFAULT_SITE_ORIGIN,
  getSiteOrigin,
} from "@/lib/seo/metadata";

const ENV_KEYS = [
  "NEXT_PUBLIC_SITE_URL",
  "SITE_URL",
  "VERCEL_PROJECT_PRODUCTION_URL",
  "VERCEL_URL",
] as const;

const savedEnv: Partial<Record<(typeof ENV_KEYS)[number], string | undefined>> = {
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  SITE_URL: process.env.SITE_URL,
  VERCEL_PROJECT_PRODUCTION_URL: process.env.VERCEL_PROJECT_PRODUCTION_URL,
  VERCEL_URL: process.env.VERCEL_URL,
};

function clearSiteEnv() {
  for (const key of ENV_KEYS) {
    delete process.env[key];
  }
}

afterEach(() => {
  for (const key of ENV_KEYS) {
    if (savedEnv[key] === undefined) {
      delete process.env[key];
    } else {
      process.env[key] = savedEnv[key];
    }
  }
});

describe("SEO & GEO core modules", () => {
  it("resolves and normalizes getSiteOrigin safely", () => {
    clearSiteEnv();
    assert.equal(getSiteOrigin(), DEFAULT_SITE_ORIGIN);

    process.env.VERCEL_PROJECT_PRODUCTION_URL = "karsaloka.id";
    assert.equal(getSiteOrigin(), "https://karsaloka.id");

    process.env.NEXT_PUBLIC_SITE_URL = "https://atlas.karsaloka.id/trailing/";
    assert.equal(getSiteOrigin(), "https://atlas.karsaloka.id");

    process.env.NEXT_PUBLIC_SITE_URL = "javascript:alert(1)";
    assert.equal(getSiteOrigin(), "https://karsaloka.id");
  });

  it("clamps long titles and descriptions at word boundaries", () => {
    assert.equal(clampMetaTitle("Short Title"), "Short Title");

    const longTitle =
      "KarsaLoka Atlas Inovasi AI dan Teknologi Lapangan di Sebelas Negara Berkembang Dunia";
    const clampedTitle = clampMetaTitle(longTitle, 68);
    assert.ok(clampedTitle.length <= 68);
    assert.ok(clampedTitle.endsWith("…"));

    const longDesc =
      "Sebuah arsip terbuka yang memetakan enam belas inovasi berbasis kecerdasan buatan dan sains terapan yang sudah berjalan di sebelas negara dengan setiap angka dampak ditautkan langsung ke sumber primernya.";
    const clampedDesc = clampMetaDescription(longDesc, 160);
    assert.ok(clampedDesc.length <= 160);
    assert.ok(clampedDesc.endsWith("…"));
  });

  it("builds complete Metadata with canonical, hreflang, OpenGraph, and Twitter large image", () => {
    clearSiteEnv();
    const meta = buildPageMetadata({
      title: "Pelepasan Nyamuk Wolbachia | KarsaLoka",
      description:
        "Uji klinis acak di Yogyakarta menurunkan kasus dengue simtomatik sebesar 77% menurut NEJM 2021.",
      pathname: "/cases/wmp-wolbachia-dengue-yogyakarta",
      locale: "id",
      imagePath: "/cases/wmp-wolbachia-dengue-yogyakarta/opengraph-image",
      ogType: "article",
      hasLocaleQueryAlternates: false,
    });

    assert.equal(
      meta.alternates?.canonical,
      `${DEFAULT_SITE_ORIGIN}/cases/wmp-wolbachia-dengue-yogyakarta`
    );
    assert.equal(
      (meta.openGraph as { type?: string })?.type,
      "article"
    );
    assert.equal(meta.openGraph?.locale, "id_ID");
    const ogImages = meta.openGraph?.images as Array<{
      url: string;
      width: number;
      height: number;
      type: string;
    }>;
    assert.equal(
      ogImages[0].url,
      `${DEFAULT_SITE_ORIGIN}/cases/wmp-wolbachia-dengue-yogyakarta/opengraph-image`
    );
    assert.equal(ogImages[0].width, 1200);
    assert.equal(ogImages[0].height, 630);
    assert.equal(ogImages[0].type, "image/png");

    const twitter = meta.twitter as { card?: string; images?: Array<{ url: string }> };
    assert.equal(twitter.card, "summary_large_image");
    assert.equal(
      twitter.images?.[0]?.url,
      `${DEFAULT_SITE_ORIGIN}/cases/wmp-wolbachia-dengue-yogyakarta/opengraph-image`
    );
  });

  it("builds English query alternates when hasLocaleQueryAlternates is enabled", () => {
    clearSiteEnv();
    const meta = buildPageMetadata({
      title: "KarsaLoka Atlas",
      description: "Explore 16 verified AI and field technology deployments.",
      pathname: "/atlas",
      locale: "en",
      hasLocaleQueryAlternates: true,
    });

    assert.equal(meta.alternates?.canonical, `${DEFAULT_SITE_ORIGIN}/atlas?lang=en`);
    assert.deepEqual(meta.alternates?.languages, {
      "id-ID": `${DEFAULT_SITE_ORIGIN}/atlas`,
      "en-US": `${DEFAULT_SITE_ORIGIN}/atlas?lang=en`,
      "x-default": `${DEFAULT_SITE_ORIGIN}/atlas`,
    });
    assert.equal(meta.openGraph?.locale, "en_US");
  });

  it("sanitizes `<` characters inside serializeJsonLd to prevent script breakout XSS", () => {
    const raw = serializeJsonLd({ headline: "Test </script><script>alert(1)</script>" });
    assert.equal(raw.includes("<"), false);
    assert.ok(raw.includes("\\u003c/script>\\u003cscript>"));
    assert.equal(
      JSON.parse(raw).headline,
      "Test </script><script>alert(1)</script>"
    );
  });

  it("builds Home and Case JSON-LD graphs matching published catalog data", () => {
    clearSiteEnv();
    const published = getPublishedCases();
    const homeLd = buildHomeJsonLd("id");
    assert.equal(homeLd["@context"], "https://schema.org");
    assert.equal(homeLd["@graph"].length, 3);

    const itemList = homeLd["@graph"][2] as {
      "@type": string;
      numberOfItems: number;
      itemListElement: Array<{ position: number; url: string }>;
    };
    assert.equal(itemList["@type"], "ItemList");
    assert.equal(itemList.numberOfItems, published.length);
    assert.equal(itemList.itemListElement.length, published.length);

    const sampleSlug = published[0].slug;
    const caseDetail = getCaseBySlug(sampleSlug, "id");
    assert.ok(caseDetail);

    const caseLd = buildCaseJsonLd(caseDetail, "id");
    assert.equal(caseLd["@type"], "TechArticle");
    assert.equal(caseLd.spatialCoverage.geo.latitude, caseDetail.lat);
    assert.equal(caseLd.spatialCoverage.geo.longitude, caseDetail.lng);
    assert.equal(caseLd.citation.length, caseDetail.sources.length);
  });

  it("generates complete GEO llms.txt and llms-full.txt covering every case, domain, and metric", () => {
    clearSiteEnv();
    const published = getPublishedCases();
    const domains = getDomains();

    const llms = generateLlmsTxt(DEFAULT_SITE_ORIGIN);
    const llmsFull = generateLlmsFullTxt(DEFAULT_SITE_ORIGIN);

    assert.ok(llms.startsWith("# KarsaLoka"));
    assert.ok(llms.includes(`${DEFAULT_SITE_ORIGIN}/llms-full.txt`));
    assert.ok(llms.includes(`${DEFAULT_SITE_ORIGIN}/sitemap.xml`));

    for (const domain of domains) {
      assert.ok(llms.includes(`\`${domain.slug}\``));
    }

    for (const item of published) {
      const caseUrl = `${DEFAULT_SITE_ORIGIN}/cases/${item.slug}`;
      assert.ok(llms.includes(caseUrl), `llms.txt missing ${item.slug}`);
      assert.ok(llmsFull.includes(caseUrl), `llms-full.txt missing ${item.slug}`);

      for (const metric of item.metrics) {
        assert.ok(
          llmsFull.includes(metric.quote),
          `llms-full.txt missing verbatim quote for ${item.slug}`
        );
      }
    }
  });
});
