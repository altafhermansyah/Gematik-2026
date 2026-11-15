import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "KarsaLoka: Atlas Inovasi Lapangan",
    short_name: "KarsaLoka",
    description:
      "Atlas interaktif studi kasus AI dan teknologi lapangan dengan setiap metrik dikutip langsung dari sumber primer.",
    start_url: "/",
    display: "standalone",
    theme_color: "#040914",
    background_color: "#eceee2",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
