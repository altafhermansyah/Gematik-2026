"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import type { Locale } from "@/lib/i18n/localized";
import { getMessages, type Messages } from "@/lib/i18n/messages";
import {
  readLocaleFromUrl,
  subscribeLocaleChange,
} from "@/lib/i18n/locale-events";
import { localeHref } from "@/lib/i18n/urls";

type SiteFooterProps = {
  locale: Locale;
  labels: Messages["footer"];
  caseCount: number;
  metricCount: number;
  variant?: "default" | "cosmos";
};

export default function SiteFooter({
  locale,
  labels,
  caseCount,
  metricCount,
  variant = "default",
}: SiteFooterProps) {
  const activeLocale = useSyncExternalStore(
    subscribeLocaleChange,
    readLocaleFromUrl,
    () => locale
  );

  const t = activeLocale === locale ? labels : getMessages(activeLocale).footer;

  if (variant === "cosmos") {
    return (
      <footer className="cosmos-footer">
        <div className="cosmos-foot-grid">
          <div className="cosmos-foot-brand">
            <Link
              href={localeHref("/", activeLocale)}
              className="cosmos-brand"
              aria-label="KarsaLoka"
            >
              <svg
                width="22"
                height="22"
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
            <p className="cosmos-foot-tag">{t.tagline}</p>
            <p className="cosmos-foot-meta tnum">
              {caseCount} {t.casesLabel.toLowerCase()} · {metricCount}{" "}
              {t.metricsLabel.toLowerCase()}
            </p>
          </div>

          <div className="cosmos-foot-cols">
            <div>
              <h2>{t.columns.explore}</h2>
              <ul>
                <li>
                  <Link href={localeHref("/atlas", activeLocale)}>
                    {t.links.atlas3d}
                  </Link>
                </li>
                <li>
                  <Link href={localeHref("/atlas?country=ID", activeLocale)}>
                    {t.links.indonesiaFocus}
                  </Link>
                </li>
                <li>
                  <Link href={localeHref("/atlas?featured=1", activeLocale)}>
                    {t.links.featuredCases}
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h2>{t.columns.domains}</h2>
              <ul>
                <li>
                  <Link href={localeHref("/atlas?domain=climate", activeLocale)}>
                    {t.links.climate}
                  </Link>
                </li>
                <li>
                  <Link href={localeHref("/atlas?domain=health", activeLocale)}>
                    {t.links.health}
                  </Link>
                </li>
                <li>
                  <Link href={localeHref("/atlas?domain=disaster", activeLocale)}>
                    {t.links.disaster}
                  </Link>
                </li>
                <li>
                  <Link href={localeHref("/atlas?domain=inclusion", activeLocale)}>
                    {t.links.inclusion}
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h2>{t.columns.competition}</h2>
              <ul>
                <li>
                  <span>{t.badges.event}</span>
                </li>
                <li>
                  <span>{t.badges.architecture}</span>
                </li>
                <li>
                  <span>{t.badges.integrity}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="mt-20 border-t hairline">
      <div className="wrap grid gap-10 py-10 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr]">
        <div>
          <Link
            href={localeHref("/", activeLocale)}
            className="site-brand-link display inline-flex min-h-[32px] items-center gap-2.5 text-[1.5rem] leading-none"
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
          <p className="small t-soft mt-3 max-w-[32ch]">{t.tagline}</p>
        </div>

        <div>
          <h2 className="micro t-faint">{t.collection}</h2>
          <dl className="mt-3 space-y-1.5">
            <div className="flex items-baseline justify-between gap-4 sm:justify-start sm:gap-3">
              <dt className="small t-soft">{t.casesLabel}</dt>
              <dd className="num text-lg tnum">{caseCount}</dd>
            </div>
            <div className="flex items-baseline justify-between gap-4 sm:justify-start sm:gap-3">
              <dt className="small t-soft">{t.metricsLabel}</dt>
              <dd className="num text-lg tnum">{metricCount}</dd>
            </div>
          </dl>
        </div>

        <div>
          <p className="small font-medium">{t.competition}</p>
          <p className="micro t-soft mt-2 max-w-[30ch] leading-relaxed">
            {t.note}
          </p>
        </div>
      </div>
      <div className="wrap">
        <div className="measure-rule" />
      </div>
    </footer>
  );
}
