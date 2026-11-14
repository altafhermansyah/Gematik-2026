/**
 * Tipe domain untuk lapisan konten lokal KarsaLoka.
 *
 * Sebelumnya data ini hidup di PostgreSQL dan diakses lewat Prisma. Sejak
 * keputusan arsitektur 2026-10-25, seluruh konten kurasi disimpan sebagai
 * modul TypeScript bertipe di `src/content`. Konsekuensinya: tipe di file ini
 * adalah sumber kebenaran tunggal untuk bentuk data konten, menggantikan
 * `prisma/schema.prisma`.
 *
 * Catatan penting:
 * - Progres, bookmark, dan hasil kuis TIDAK ada di sini. Itu tetap di
 *   `localStorage` lewat Zustand `persist` dan tidak pernah masuk repositori.
 * - Pertanyaan kuis tetap berada di kode (`modules/quiz`), bukan di data konten.
 */

import type { LocalizedText } from "@/lib/i18n/localized";

export type PublishStatus = "DRAFT" | "PUBLISHED";

export type PathLevel = "BEGINNER" | "INTERMEDIATE" | "ADVANCED";

export type PathNodeType = "CONCEPT" | "PRACTICE" | "PROJECT";

export type ResourceType =
  | "VIDEO"
  | "ARTICLE"
  | "COURSE"
  | "BOOK"
  | "DOCS"
  | "TOOL";

/** Bidang masalah: warna dipakai untuk titik globe dan chip filter. */
export type Domain = {
  slug: string;
  name: LocalizedText;
  /** Hex, contoh "#34d399". Dipakai untuk warna pin 3D di globe Atlas. */
  color: string;
  icon: string | null;
  order: number;
};

/**
 * Angka hanya boleh berasal dari sumber yang bisa diperiksa.
 * Diberi akhiran `Data` agar tidak tertukar dengan `CaseMetric` di
 * `modules/cases/types.ts`, yang bentuknya sudah diratakan (label jadi string)
 * untuk konsumsi komponen.
 */
export type CaseMetricData = {
  label: LocalizedText;
  value: number;
  unit: LocalizedText;
  /**
   * Kutipan verbatim dari sumber yang menyatakan angka ini. Wajib diisi agar
   * setiap angka di Atlas punya jejak audit; `assertContentIntegrity()`
   * memastikan `sourceUrl`-nya benar-benar ada di daftar `sources` kasus.
   */
  quote: string;
  /** URL sumber kutipan, harus salah satu URL di `sources`. */
  sourceUrl: string;
};

export type CaseSourceData = {
  title: string;
  publisher: string | null;
  /** URL absolut http(s). Wajib hidup saat konten ditambahkan. */
  url: string;
  /** Tanggal akses format ISO `YYYY-MM-DD`. */
  accessedAt: string | null;
};

/** Jembatan Atlas → Roadmap. */
export type CasePathLink = {
  pathSlug: string;
  /** 1..3, untuk urutan rekomendasi. */
  relevance: 1 | 2 | 3;
  note: LocalizedText | null;
};

export type CaseStudy = {
  slug: string;
  domainSlug: string;
  status: PublishStatus;
  featured: boolean;

  title: LocalizedText;
  summary: LocalizedText;
  problem: LocalizedText;
  solution: LocalizedText;
  aiRole: LocalizedText;
  impact: LocalizedText;

  metrics: CaseMetricData[];

  /** ISO-2, contoh "ID". */
  countryCode: string;
  region: string | null;
  lat: number;
  lng: number;
  year: number | null;

  /** Target Pembangunan Berkelanjutan 1..17. */
  sdgs: number[];
  /** Tag teknologi, kebab-case. */
  technologies: string[];

  sources: CaseSourceData[];
  paths: CasePathLink[];
};

export type Skill = {
  slug: string;
  name: LocalizedText;
  description: LocalizedText | null;
  category: string | null;
};

export type Resource = {
  skillSlug: string;
  type: ResourceType;
  title: string;
  url: string;
  provider: string | null;
  lang: string;
  free: boolean;
  order: number;
};

export type PathNode = {
  skillSlug: string;
  type: PathNodeType;
  /** Urutan linear untuk tampilan list/mobile. */
  order: number;
  posX: number | null;
  posY: number | null;
  estimatedHours: number | null;
  task: LocalizedText | null;
};

export type LearningPath = {
  slug: string;
  /** Opsional: jalur dasar berlaku lintas bidang. */
  domainSlug: string | null;
  status: PublishStatus;
  level: PathLevel;
  title: LocalizedText;
  description: LocalizedText;
  estimatedHours: number | null;
  nodes: PathNode[];
  /** Prasyarat `[dariSkillSlug, keSkillSlug]`. Kedua node harus di jalur ini. */
  edges: [string, string][];
};
