import {
  OG_CONTENT_TYPE,
  OG_SIZE,
  renderCaseOgCard,
} from "@/lib/seo/og-card";
import { getPublishedCases } from "@/modules/content/store";

export const dynamicParams = false;

export function generateStaticParams() {
  return getPublishedCases().map((item) => ({ slug: item.slug }));
}

export const alt =
  "KarsaLoka: Dossier studi kasus inovasi lapangan terverifikasi sumber primer";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return renderCaseOgCard(slug);
}
