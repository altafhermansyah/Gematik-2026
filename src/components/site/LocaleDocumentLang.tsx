"use client";

import { useEffect } from "react";
import {
  readLocaleFromUrl,
  subscribeLocaleChange,
} from "@/lib/i18n/locale-events";

/**
 * Keeps `<html lang>` honest when the language is chosen by URL rather than by
 * route, without forcing every page into dynamic rendering.
 */
export default function LocaleDocumentLang() {
  useEffect(() => {
    const apply = () => {
      document.documentElement.lang = readLocaleFromUrl();
    };
    apply();
    return subscribeLocaleChange(apply);
  }, []);

  return null;
}
