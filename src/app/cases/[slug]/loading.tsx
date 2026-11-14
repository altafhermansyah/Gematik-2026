"use client";

import { useSyncExternalStore } from "react";
import type { Locale } from "@/lib/i18n/localized";
import {
  readLocaleFromUrl,
  subscribeLocaleChange,
} from "@/lib/i18n/locale-events";
import { getMessages } from "@/lib/i18n/messages";

export default function CaseLoading() {
  const locale = useSyncExternalStore(
    subscribeLocaleChange,
    readLocaleFromUrl,
    () => "id" as Locale
  );
  const t = getMessages(locale);

  return (
    <main
      id="main"
      role="status"
      aria-label={t.cases.loading.ariaLabel}
      className="wrap py-10 sm:py-14"
    >
      <div className="max-w-[74rem] animate-pulse">
        <div className="h-3.5 w-36 bg-[var(--paper-sunk)]" />
        <div className="mt-10 h-3.5 w-56 bg-[var(--paper-sunk)]" />
        <div className="mt-5 space-y-3">
          <div className="h-10 w-4/5 bg-[var(--paper-sunk)]" />
          <div className="h-10 w-3/5 bg-[var(--paper-sunk)]" />
        </div>
        <div className="mt-7 space-y-2">
          <div className="h-4 w-full max-w-[52ch] bg-[var(--paper-sunk)]" />
          <div className="h-4 w-4/5 max-w-[46ch] bg-[var(--paper-sunk)]" />
        </div>

        <div className="mt-12 grid gap-10 lg:grid-cols-[minmax(0,1fr)_17rem]">
          <div className="space-y-10">
            {[1, 2, 3].map((section) => (
              <div key={section} className="border-t hairline pt-6">
                <div className="h-6 w-40 bg-[var(--paper-sunk)]" />
                <div className="mt-4 space-y-2">
                  <div className="h-4 w-full bg-[var(--paper-sunk)]" />
                  <div className="h-4 w-11/12 bg-[var(--paper-sunk)]" />
                  <div className="h-4 w-4/5 bg-[var(--paper-sunk)]" />
                </div>
              </div>
            ))}
          </div>
          <div className="border-t hairline-strong pt-4">
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((row) => (
                <div key={row} className="h-4 w-full bg-[var(--paper-sunk)]" />
              ))}
            </div>
          </div>
        </div>
      </div>
      <span className="sr-only">{t.cases.loading.srText}</span>
    </main>
  );
}
