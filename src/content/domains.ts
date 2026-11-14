/**
 * Enam bidang masalah. Hampir statis: warnanya dipakai untuk titik globe,
 * chip daftar, dan penanda pilihan.
 *
 * `color` harus hex 6 digit — divalidasi oleh `assertContentIntegrity()` dan
 * dipakai untuk pewarnaan pin 3D serta chip daftar kasus.
 */

import type { Domain } from "@/modules/content/types";

export const domains = [
  {
    slug: "climate",
    name: { id: "Iklim & Lingkungan", en: "Climate & Environment" },
    color: "#34d399",
    icon: null,
    order: 0,
  },
  {
    slug: "food",
    name: { id: "Pangan & Pertanian", en: "Food & Agriculture" },
    color: "#fbbf24",
    icon: null,
    order: 1,
  },
  {
    slug: "health",
    name: { id: "Kesehatan & Sains", en: "Health & Science" },
    color: "#f472b6",
    icon: null,
    order: 2,
  },
  {
    slug: "education",
    name: { id: "Pendidikan", en: "Education" },
    color: "#60a5fa",
    icon: null,
    order: 3,
  },
  {
    slug: "disaster",
    name: { id: "Kebencanaan", en: "Disaster Resilience" },
    color: "#fb923c",
    icon: null,
    order: 4,
  },
  {
    slug: "inclusion",
    name: { id: "Inklusi Sosial", en: "Social Inclusion" },
    color: "#a78bfa",
    icon: null,
    order: 5,
  },
] as const satisfies readonly Domain[];
