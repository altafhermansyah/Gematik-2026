"use client";

import { useSyncExternalStore } from "react";
import type { Locale } from "@/lib/i18n/localized";
import {
  readLocaleFromUrl,
  subscribeLocaleChange,
} from "@/lib/i18n/locale-events";
import { getMessages } from "@/lib/i18n/messages";

export default function AtlasLoading() {
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
      aria-label={t.atlas.loading.ariaLabel}
      className="night-stage night"
    >
      <div className="wrap py-16">
        <div className="grid animate-pulse gap-10 lg:grid-cols-[17.5rem_minmax(0,1fr)]">
          <div className="space-y-4">
            <div className="h-9 w-40 rounded-lg bg-[rgb(150_175_230_/_0.14)]" />
            <div className="h-4 w-full rounded bg-[rgb(150_175_230_/_0.09)]" />
            <div className="h-4 w-4/5 rounded bg-[rgb(150_175_230_/_0.09)]" />
            <div className="mt-8 h-9 w-full border-b border-[rgb(150_175_230_/_0.2)]" />
            <div className="space-y-2 pt-3">
              {[1, 2, 3, 4, 5, 6].map((row) => (
                <div
                  key={row}
                  className="h-7 w-full border-b border-[rgb(150_175_230_/_0.12)]"
                />
              ))}
            </div>
          </div>
          <div className="flex items-center justify-center">
            <div className="aspect-square w-full max-w-[38rem] rounded-full border border-[rgb(93_240_168_/_0.22)] bg-[radial-gradient(circle_at_50%_40%,rgba(26,56,120,0.22),transparent_65%)]" />
          </div>
        </div>
        <span className="sr-only">{t.atlas.loading.srText}</span>
      </div>
    </main>
  );
}
