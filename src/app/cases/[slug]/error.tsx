"use client";

import { useEffect, useSyncExternalStore } from "react";
import Link from "next/link";
import type { Locale } from "@/lib/i18n/localized";
import {
  readLocaleFromUrl,
  subscribeLocaleChange,
} from "@/lib/i18n/locale-events";
import { localeHref } from "@/lib/i18n/urls";
import { getMessages } from "@/lib/i18n/messages";

type CaseErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function CaseError({ error, reset }: CaseErrorProps) {
  const locale = useSyncExternalStore(
    subscribeLocaleChange,
    readLocaleFromUrl,
    () => "id" as Locale
  );
  const t = getMessages(locale);

  useEffect(() => {
    // Contextual diagnostic for developers; no user data is included.
    console.error("[app/cases/[slug]/error] Case route error:", error);
  }, [error]);

  return (
    <main
      id="main"
      className="wrap flex min-h-[60svh] flex-col justify-center py-20"
    >
      <div className="max-w-[38rem]">
        <p className="micro t-faint">KarsaLoka</p>
        <h1 className="title mt-3">{t.cases.error.title}</h1>
        <p className="small t-soft mt-4 max-w-[46ch]">
          {t.cases.error.description}
        </p>
        <div className="mt-8 flex flex-wrap gap-2">
          <button type="button" onClick={() => reset()} className="btn btn-ink">
            {t.common.tryAgain}
          </button>
          <Link href={localeHref("/atlas", locale)} className="btn btn-ghost">
            {t.common.backToAtlas}
          </Link>
        </div>
      </div>
    </main>
  );
}
