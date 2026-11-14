"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import type { Locale } from "@/lib/i18n/localized";
import {
  readLocaleFromUrl,
  subscribeLocaleChange,
} from "@/lib/i18n/locale-events";
import { localeHref } from "@/lib/i18n/urls";
import { getMessages } from "@/lib/i18n/messages";

export default function CaseNotFound() {
  const locale = useSyncExternalStore(
    subscribeLocaleChange,
    readLocaleFromUrl,
    () => "id" as Locale
  );
  const t = getMessages(locale);

  return (
    <main
      id="main"
      className="wrap flex min-h-[70svh] flex-col justify-center py-20"
    >
      <div className="max-w-[38rem]">
        <p className="num text-[0.875rem] t-faint tnum">404</p>
        <h1 className="title mt-3">{t.cases.notFound.title}</h1>
        <p className="small t-soft mt-4 max-w-[46ch]">
          {t.cases.notFound.description}
        </p>
        <div className="mt-8 flex flex-wrap gap-2">
          <Link href={localeHref("/atlas", locale)} className="btn btn-ink">
            {t.common.backToAtlas}
          </Link>
          <Link href={localeHref("/", locale)} className="btn btn-ghost">
            {t.common.home}
          </Link>
        </div>
      </div>
    </main>
  );
}
