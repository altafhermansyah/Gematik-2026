"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Locale } from "@/lib/i18n/localized";
import {
  readLocaleFromUrl,
  subscribeLocaleChange,
} from "@/lib/i18n/locale-events";
import { localeHref } from "@/lib/i18n/urls";
import { getMessages } from "@/lib/i18n/messages";
import LocaleSwitch from "./LocaleSwitch";

type SiteHeaderProps = {
  locale: Locale;
  variant?: "default" | "cosmos";
  labels: {
    atlas: string;
    atlas3d?: string;
    indonesia: string;
    domainsSdg?: string;
    telemetrySdg?: string;
    openAtlas?: string;
    language: string;
    navigation: string;
  };
};

export default function SiteHeader({
  locale,
  variant = "default",
  labels,
}: SiteHeaderProps) {
  const pathname = usePathname();
  const isAtlas = pathname === "/atlas";

  // Case pages are statically rendered for Indonesian but can display English
  // via `?lang=`. Read the URL on the client so header links keep the language.
  const activeLocale = useSyncExternalStore(
    subscribeLocaleChange,
    readLocaleFromUrl,
    () => locale
  );

  const navCopy = activeLocale === locale ? labels : getMessages(activeLocale).nav;

  if (variant === "cosmos") {
    const fallbackNav = getMessages(activeLocale).nav;
    return (
      <header className="cosmos-header">
        <div className="cosmos-nav-inner">
          <Link
            href={localeHref("/", activeLocale)}
            className="cosmos-brand"
            aria-label="KarsaLoka"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
              className="cosmos-brand-mark"
            >
              <circle
                cx="12"
                cy="12"
                r="9"
                stroke="#5df0a8"
                strokeWidth="1.5"
                opacity="0.45"
              />
              <ellipse
                cx="12"
                cy="12"
                rx="9.5"
                ry="4"
                transform="rotate(-24 12 12)"
                stroke="#5df0a8"
                strokeWidth="1.5"
              />
              <circle cx="12" cy="12" r="2.6" fill="#5df0a8" />
            </svg>
            <span className="cosmos-logo-word">KarsaLoka</span>
          </Link>

          <nav
            aria-label={navCopy.navigation}
            className="cosmos-nav-links"
          >
            <Link href={localeHref("/atlas", activeLocale)}>
              {navCopy.atlas3d ?? fallbackNav.atlas3d}
            </Link>
            <Link href={localeHref("/atlas?country=ID", activeLocale)}>
              {navCopy.indonesia}
            </Link>
            <a href="#domains">
              {navCopy.domainsSdg ?? fallbackNav.domainsSdg}
            </a>
            <a href="#sdg-showcase">
              {navCopy.telemetrySdg ?? fallbackNav.telemetrySdg}
            </a>
          </nav>

          <div className="cosmos-nav-actions">
            <LocaleSwitch
              label={navCopy.language}
              initialLocale={locale}
              variant="cosmos"
            />
            <Link
              href={localeHref("/atlas", activeLocale)}
              className="cosmos-btn-ghost"
            >
              <span>{navCopy.openAtlas ?? fallbackNav.openAtlas}</span>
              <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="relative z-30">
      <div className="wrap flex flex-wrap items-center justify-between gap-x-6 gap-y-3 py-4">
        <Link
          href={localeHref("/", activeLocale)}
          className="site-brand-link display inline-flex min-h-[32px] items-center gap-2.5 text-[1.375rem] leading-none t-strong"
          aria-label="KarsaLoka"
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
            className="site-brand-mark shrink-0"
          >
            <circle
              cx="12"
              cy="12"
              r="9"
              stroke="currentColor"
              strokeWidth="1.5"
              opacity="0.45"
            />
            <ellipse
              cx="12"
              cy="12"
              rx="9.5"
              ry="4"
              transform="rotate(-24 12 12)"
              stroke="var(--brand-accent, currentColor)"
              strokeWidth="1.5"
            />
            <circle
              cx="12"
              cy="12"
              r="2.6"
              fill="var(--brand-accent, currentColor)"
            />
          </svg>
          <span>KarsaLoka</span>
        </Link>

        <nav
          aria-label={navCopy.navigation}
          className="flex items-center gap-5 text-[0.875rem] sm:gap-8"
        >
          <Link
            href={localeHref("/atlas", activeLocale)}
            aria-current={isAtlas ? "page" : undefined}
            className="draw link-quiet inline-flex min-h-[32px] items-center"
          >
            {navCopy.atlas}
          </Link>
          <Link
            href={localeHref("/atlas?country=ID", activeLocale)}
            className="draw link-quiet inline-flex min-h-[32px] items-center"
          >
            {navCopy.indonesia}
          </Link>
          <LocaleSwitch label={navCopy.language} initialLocale={locale} />
        </nav>
      </div>
      <div className="wrap">
        <div className="border-t hairline" />
      </div>
    </header>
  );
}
