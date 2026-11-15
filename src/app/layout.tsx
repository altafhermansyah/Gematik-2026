import type { Metadata } from "next";
import "@fontsource-variable/bricolage-grotesque";
import "@fontsource-variable/familjen-grotesk";
import "@fontsource-variable/familjen-grotesk/wght-italic.css";
import "./globals.css";
import LocaleDocumentLang from "@/components/site/LocaleDocumentLang";
import SmoothScrollProvider from "@/components/site/SmoothScrollProvider";
import AssistantDrawer from "@/components/assistant/AssistantDrawer";
import { DEFAULT_LOCALE } from "@/lib/i18n/localized";
import { idMessages } from "@/lib/i18n/messages";
import { buildPageMetadata, getSiteOrigin } from "@/lib/seo/metadata";

const rootDefaults = buildPageMetadata({
  title: "KarsaLoka | Atlas inovasi yang sudah bekerja di lapangan",
  description:
    "Enam belas studi kasus AI dan teknologi di sebelas negara, dengan setiap metrik dampak dikutip langsung dari sumber primernya.",
  pathname: "/",
  locale: DEFAULT_LOCALE,
  imagePath: "/opengraph-image",
  hasLocaleQueryAlternates: true,
});

export const metadata: Metadata = {
  metadataBase: new URL(getSiteOrigin()),
  applicationName: "KarsaLoka",
  ...rootDefaults,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="id" className="antialiased">
      <body>
        <a className="skip-link" href="#main">
          {idMessages.common.skipToContent}
        </a>
        <LocaleDocumentLang />
        <SmoothScrollProvider>
          {children}
        </SmoothScrollProvider>
        <AssistantDrawer />
      </body>
    </html>
  );
}
