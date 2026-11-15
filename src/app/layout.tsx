import type { Metadata } from "next";
import "@fontsource-variable/bricolage-grotesque";
import "@fontsource-variable/familjen-grotesk";
import "@fontsource-variable/familjen-grotesk/wght-italic.css";
import "./globals.css";
import LocaleDocumentLang from "@/components/site/LocaleDocumentLang";
import SmoothScrollProvider from "@/components/site/SmoothScrollProvider";
import AssistantDrawer from "@/components/assistant/AssistantDrawer";
import { idMessages } from "@/lib/i18n/messages";

export const metadata: Metadata = {
  title: "KarsaLoka — Atlas inovasi yang sudah bekerja di lapangan",
  description:
    "Enam belas studi kasus AI dan teknologi di sebelas negara, dengan setiap metrik dampak dikutip langsung dari sumber primernya.",
  applicationName: "KarsaLoka",
  openGraph: {
    title: "KarsaLoka — Atlas inovasi untuk dampak nyata",
    description:
      "Enam belas inovasi AI dan teknologi di sebelas negara, terverifikasi dengan kutipan dan sumber primer.",
    siteName: "KarsaLoka",
    locale: "id_ID",
    type: "website",
  },
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
