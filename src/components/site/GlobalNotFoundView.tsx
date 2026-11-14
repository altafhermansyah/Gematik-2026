"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import SiteHeader from "@/components/site/SiteHeader";
import SiteFooter from "@/components/site/SiteFooter";
import type { Locale } from "@/lib/i18n/localized";
import {
  readLocaleFromUrl,
  subscribeLocaleChange,
} from "@/lib/i18n/locale-events";
import { getMessages } from "@/lib/i18n/messages";
import { localeHref } from "@/lib/i18n/urls";

type GlobalNotFoundViewProps = {
  caseCount: number;
  metricCount: number;
};

export default function GlobalNotFoundView({
  caseCount,
  metricCount,
}: GlobalNotFoundViewProps) {
  const activeLocale = useSyncExternalStore(
    subscribeLocaleChange,
    readLocaleFromUrl,
    () => "id" as Locale
  );
  const t = getMessages(activeLocale);

  return (
    <div className="cosmos-page night flex min-h-svh flex-col">
      <div className="cosmos-fallback-backdrop" aria-hidden="true" />
      <SiteHeader locale={activeLocale} labels={t.nav} />

      <main
        id="main"
        className="relative z-10 mx-auto flex w-full max-w-[1160px] flex-1 flex-col items-center justify-center px-[var(--gutter)] py-24 text-center"
      >
        <p className="cosmos-eyebrow">{t.globalNotFound.eyebrow}</p>
        <p
          aria-hidden="true"
          className="tnum mt-4 font-[family-name:var(--font-display)] text-[clamp(4.5rem,14vw,8.5rem)] font-bold leading-none tracking-[-0.04em] text-[#5df0a8]"
        >
          404
        </p>
        <h1 className="mt-4 max-w-[18ch] font-[family-name:var(--font-display)] text-[clamp(1.75rem,3.6vw,2.75rem)] font-semibold leading-[1.12] tracking-[-0.025em] text-[#f4f7ff]">
          {t.globalNotFound.title}
        </h1>
        <p className="mt-4 max-w-[46ch] text-[1rem] leading-relaxed text-[#a8b6d9]">
          {t.globalNotFound.description}
        </p>
        <div className="mt-9 flex flex-wrap items-center justify-center gap-3.5">
          <Link
            href={localeHref("/atlas", activeLocale)}
            className="cosmos-btn-primary"
          >
            <span>{t.globalNotFound.exploreAtlas}</span>
            <span aria-hidden="true">→</span>
          </Link>
          <Link
            href={localeHref("/", activeLocale)}
            className="cosmos-btn-outline"
          >
            <span>{t.globalNotFound.backHome}</span>
          </Link>
        </div>
      </main>

      <SiteFooter
        locale={activeLocale}
        labels={t.footer}
        caseCount={caseCount}
        metricCount={metricCount}
        variant="cosmos"
      />
    </div>
  );
}
