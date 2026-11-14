/**
 * Katalog skill. Dipakai ulang lintas jalur belajar.
 *
 * Dimigrasikan apa adanya dari seed PostgreSQL sebelumnya (6 skill) agar tidak
 * ada konten yang hilang saat perpindahan ke model lokal.
 */

import type { Skill } from "@/modules/content/types";

export const skills = [
  {
    slug: "python-basics",
    name: { id: "Dasar Python", en: "Python Basics" },
    description: null,
    category: "programming",
  },
  {
    slug: "data-wrangling",
    name: { id: "Mengolah Data", en: "Data Wrangling" },
    description: null,
    category: "data",
  },
  {
    slug: "ml-fundamentals",
    name: { id: "Dasar Machine Learning", en: "Machine Learning Fundamentals" },
    description: null,
    category: "ml",
  },
  {
    slug: "model-evaluation",
    name: { id: "Evaluasi Model", en: "Model Evaluation" },
    description: null,
    category: "ml",
  },
  {
    slug: "responsible-ai",
    name: { id: "AI yang Bertanggung Jawab", en: "Responsible AI" },
    description: null,
    category: "ethics",
  },
  {
    slug: "applied-project",
    name: { id: "Proyek Terapan", en: "Applied Project" },
    description: null,
    category: "project",
  },
] as const satisfies readonly Skill[];
