import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#030712",
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "KarsaLoka — Dari Melihat Masalah Dunia, Menjadi Bagian Solusinya",
  description:
    "Platform eksplorasi tantangan global, studi kasus inovasi AI terverifikasi, dan peta jalan kompetensi personal untuk masa depan cerdas berkelanjutan. Karya untuk GEMATIK VI 2026.",
  keywords: [
    "KarsaLoka",
    "Global Innovators",
    "Intelligent Future",
    "Gematik 2026",
    "AI for Good",
    "Atlas Inovasi",
    "Skill Roadmap",
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}