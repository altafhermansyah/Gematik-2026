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

type AtlasErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function AtlasError({ error, reset }: AtlasErrorProps) {
  const locale = useSyncExternalStore(
    subscribeLocaleChange,
    readLocaleFromUrl,
    () => "id" as Locale
  );
  const t = getMessages(locale);

  useEffect(() => {
    // Contextual diagnostic for developers; no user data is included.
    console.error("[app/atlas/error] Atlas route error:", error);
  }, [error]);

  return (
    <main
      id="main"
      className="night-stage night flex min-h-svh flex-col justify-center px-[var(--gutter)] py-20"
    >
      <div className="mx-auto w-full max-w-[34rem]">
        <p className="micro t-faint">KarsaLoka</p>
        <h1 className="title mt-4">{t.atlas.error.title}</h1>
        <p className="small t-soft mt-4 max-w-[42ch]">
          {t.atlas.error.description}
        </p>
        <div className="mt-8 flex flex-wrap gap-2">
          <button type="button" onClick={() => reset()} className="stage-control">
            {t.common.tryAgain}
          </button>
          <Link href={localeHref("/", locale)} className="stage-control">
            {t.common.home}
          </Link>
        </div>
      </div>
    </main>
  );
}
