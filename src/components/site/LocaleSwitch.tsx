"use client";

import { useSyncExternalStore } from "react";
import type { Locale } from "@/lib/i18n/localized";
import {
  readLocaleFromUrl,
  subscribeLocaleChange,
} from "@/lib/i18n/locale-events";

type LocaleSwitchProps = {
  label: string;
  initialLocale?: Locale;
  variant?: "default" | "cosmos";
};

const LOCALES: Locale[] = ["id", "en"];

/**
 * A full navigation is intentional: the server renders the chosen language,
 * so links and metadata change together. Existing query state (atlas filters)
 * travels with the URL.
 */
export default function LocaleSwitch({
  label,
  initialLocale = "id",
  variant = "default",
}: LocaleSwitchProps) {
  const locale = useSyncExternalStore(
    subscribeLocaleChange,
    readLocaleFromUrl,
    () => initialLocale
  );

  const switchTo = (next: Locale) => {
    if (next === locale) return;
    const url = new URL(window.location.href);
    if (next === "en") {
      url.searchParams.set("lang", "en");
    } else {
      url.searchParams.delete("lang");
    }
    window.location.assign(url.toString());
  };

  return (
    <span
      role="group"
      aria-label={label}
      className={
        variant === "cosmos"
          ? "cosmos-locale-group inline-flex items-center"
          : "inline-flex items-center gap-0.5 text-[0.8125rem] leading-none"
      }
    >
      {LOCALES.map((value, index) => (
        <span key={value} className="inline-flex items-center gap-0.5">
          {variant === "default" && index > 0 && (
            <span aria-hidden="true" className="t-faint">
              /
            </span>
          )}
          <button
            type="button"
            onClick={() => switchTo(value)}
            aria-pressed={locale === value}
            className={variant === "cosmos" ? "cosmos-locale-btn" : "locale-btn"}
            lang={value}
          >
            {value.toUpperCase()}
          </button>
        </span>
      ))}
    </span>
  );
}
