import type { Locale } from "./localized";

/**
 * Adds the locale to a path without losing its existing query parameters.
 * Indonesian is the canonical, unparameterised locale.
 */
export function localeHref(href: string, locale: Locale): string {
  if (locale === "id") return href;

  const hashIndex = href.indexOf("#");
  const hash = hashIndex >= 0 ? href.slice(hashIndex) : "";
  const withoutHash = hashIndex >= 0 ? href.slice(0, hashIndex) : href;
  const queryIndex = withoutHash.indexOf("?");
  const path = queryIndex >= 0 ? withoutHash.slice(0, queryIndex) : withoutHash;
  const search = queryIndex >= 0 ? withoutHash.slice(queryIndex + 1) : "";

  const params = new URLSearchParams(search);
  params.set("lang", "en");
  return `${path}?${params.toString()}${hash}`;
}
