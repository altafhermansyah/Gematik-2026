import type { Locale } from "@/lib/i18n/localized";

/** Acronyms that should not be sentence-cased when humanising tech slugs. */
const ACRONYMS: Record<string, string> = {
  ai: "AI",
  iot: "IoT",
  ml: "ML",
  nlp: "NLP",
  llm: "LLM",
  ussd: "USSD",
  gis: "GIS",
  sms: "SMS",
  api: "API",
  dna: "DNA",
};

export function formatTechnologyTag(tag: string): string {
  const lower = tag.toLowerCase();
  if (ACRONYMS[lower]) return ACRONYMS[lower];
  const spaced = tag.replace(/-/g, " ");
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}

/**
 * Compact notation for large impact figures, grouped with the reader's locale.
 * Small values stay exact; only values that would not fit a headline are shortened.
 */
export function formatMetricValue(value: number, locale: Locale): string {
  if (!Number.isFinite(value)) return String(value);
  const useCompact = Math.abs(value) >= 100_000;
  return new Intl.NumberFormat(locale, {
    notation: useCompact ? "compact" : "standard",
    maximumFractionDigits: useCompact ? 1 : 0,
  }).format(value);
}
