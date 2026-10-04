import { z } from "zod";

export type Locale = "id" | "en";
export const DEFAULT_LOCALE: Locale = "id";

export const LocalizedTextSchema = z
  .object({
    id: z.string(),
    en: z.string(),
  })
  .refine(
    (val) => val.id.trim().length > 0 || val.en.trim().length > 0,
    { message: "At least one locale ('id' or 'en') must be non-empty." }
  );

export type LocalizedText = z.infer<typeof LocalizedTextSchema>;

export type LocalizedResult =
  | { ok: true; value: string }
  | { ok: false; error: string };

/**
 * Validates a value against LocalizedTextSchema and resolves to a plain string.
 * Returns the requested locale, falling back to the other locale if the requested one is empty.
 * Returns a typed failure if validation fails.
 */
export function pickLocalized(
  value: unknown,
  locale: Locale = DEFAULT_LOCALE
): LocalizedResult {
  const result = LocalizedTextSchema.safeParse(value);
  if (!result.success) {
    return {
      ok: false,
      error: result.error.issues.map((issue) => issue.message).join("; "),
    };
  }

  const data = result.data;
  const requested = data[locale].trim();
  if (requested.length > 0) {
    return { ok: true, value: requested };
  }

  const fallbackLocale: Locale = locale === "id" ? "en" : "id";
  const fallback = data[fallbackLocale].trim();
  if (fallback.length > 0) {
    return { ok: true, value: fallback };
  }

  return {
    ok: false,
    error: `Both '${locale}' and fallback '${fallbackLocale}' text values are empty.`,
  };
}
