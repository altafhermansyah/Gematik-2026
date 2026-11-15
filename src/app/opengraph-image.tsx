import {
  OG_CONTENT_TYPE,
  OG_SIZE,
  renderPlatformOgCard,
} from "@/lib/seo/og-card";

export const alt =
  "KarsaLoka: Atlas inovasi AI dan teknologi yang sudah bekerja di lapangan";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderPlatformOgCard();
}
