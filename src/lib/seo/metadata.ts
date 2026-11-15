import type { Metadata } from "next";
import { DEFAULT_LOCALE, type Locale } from "@/lib/i18n/localized";

export const DEFAULT_SITE_ORIGIN = "https://karsaloka.vercel.app";
export const SITE_NAME = "KarsaLoka";
export const OG_IMAGE_WIDTH = 1200;
export const OG_IMAGE_HEIGHT = 630;

function normalizeOriginCandidate(raw: string | undefined): string | null {
  if (!raw) return null;
  const trimmed = raw.trim();
  if (!trimmed) return null;

  const withProtocol = /^https?:\/\//i.test(trimmed)
    ? trimmed
    : `https://${trimmed}`;

  try {
    const parsed = new URL(withProtocol);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return null;
    }
    return parsed.origin;
  } catch {
    return null;
  }
}

export function getSiteOrigin(): string {
  const candidates = [
    process.env.NEXT_PUBLIC_SITE_URL,
    process.env.SITE_URL,
    process.env.VERCEL_PROJECT_PRODUCTION_URL,
    process.env.VERCEL_URL,
  ];

  for (const candidate of candidates) {
    const normalized = normalizeOriginCandidate(candidate);
    if (normalized) return normalized;
  }

  return DEFAULT_SITE_ORIGIN;
}

function collapseWhitespace(input: string): string {
  return input.replace(/\s+/g, " ").trim();
}

function truncateAtWordBoundary(input: string, maxLength: number): string {
  const clean = collapseWhitespace(input);
  if (clean.length <= maxLength) return clean;
  if (maxLength <= 1) return clean.slice(0, Math.max(0, maxLength));

  const budget = maxLength - 1;
  let slice = clean.slice(0, budget);
  const lastSpace = slice.lastIndexOf(" ");

  if (lastSpace >= Math.floor(budget * 0.5)) {
    slice = slice.slice(0, lastSpace);
  }

  slice = slice.replace(/[\s,;:\-\u2013\u2014]+$/u, "");
  return `${slice}…`;
}

export function clampMetaTitle(title: string, maxLength = 68): string {
  return truncateAtWordBoundary(title, maxLength);
}

export function clampMetaDescription(
  description: string,
  maxLength = 160
): string {
  return truncateAtWordBoundary(description, maxLength);
}

export interface PageMetadataOptions {
  title: string;
  description: string;
  pathname: string;
  locale?: Locale;
  imagePath?: string;
  imageAlt?: string;
  ogType?: "website" | "article";
  keywords?: string[];
  publishedTime?: string;
  hasLocaleQueryAlternates?: boolean;
}

function normalizePathname(pathname: string): string {
  if (!pathname || pathname === "/") return "/";
  return pathname.startsWith("/") ? pathname : `/${pathname}`;
}

export function buildPageMetadata({
  title,
  description,
  pathname,
  locale = DEFAULT_LOCALE,
  imagePath = "/opengraph-image",
  imageAlt,
  ogType = "website",
  keywords,
  publishedTime,
  hasLocaleQueryAlternates = false,
}: PageMetadataOptions): Metadata {
  const origin = getSiteOrigin();
  const basePath = normalizePathname(pathname);
  const canonicalPath =
    hasLocaleQueryAlternates && locale === "en" ? `${basePath}?lang=en` : basePath;
  const canonicalUrl = new URL(canonicalPath, origin).toString();
  const imageUrl = new URL(normalizePathname(imagePath), origin).toString();

  const safeTitle = clampMetaTitle(title);
  const safeDescription = clampMetaDescription(description);
  const resolvedAlt = collapseWhitespace(imageAlt ?? safeTitle);

  const languages = hasLocaleQueryAlternates
    ? {
        "id-ID": new URL(basePath, origin).toString(),
        "en-US": new URL(`${basePath}?lang=en`, origin).toString(),
        "x-default": new URL(basePath, origin).toString(),
      }
    : {
        "id-ID": canonicalUrl,
        "x-default": canonicalUrl,
      };

  const ogImage = {
    url: imageUrl,
    width: OG_IMAGE_WIDTH,
    height: OG_IMAGE_HEIGHT,
    alt: resolvedAlt,
    type: "image/png",
  };

  return {
    title: safeTitle,
    description: safeDescription,
    authors: [{ name: SITE_NAME, url: origin }],
    creator: SITE_NAME,
    publisher: SITE_NAME,
    category: "Science & Technology",
    ...(keywords && keywords.length > 0 ? { keywords } : {}),
    alternates: {
      canonical: canonicalUrl,
      languages,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-snippet": -1,
        "max-image-preview": "large",
        "max-video-preview": -1,
      },
    },
    openGraph: {
      title: safeTitle,
      description: safeDescription,
      url: canonicalUrl,
      siteName: SITE_NAME,
      locale: locale === "en" ? "en_US" : "id_ID",
      alternateLocale: locale === "en" ? ["id_ID"] : ["en_US"],
      type: ogType,
      images: [ogImage],
      ...(ogType === "article" && publishedTime ? { publishedTime } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: safeTitle,
      description: safeDescription,
      images: [
        {
          url: imageUrl,
          alt: resolvedAlt,
        },
      ],
    },
  };
}
