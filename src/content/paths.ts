/**
 * Jalur belajar beserta graf prasyaratnya.
 *
 * Dimigrasikan dari seed PostgreSQL sebelumnya. Pada model lokal, prasyarat
 * dinyatakan sebagai pasangan slug skill (`edges`) alih-alih ID baris, sehingga
 * lebih mudah dibaca dan diperiksa manusia. `assertContentIntegrity()` memastikan
 * kedua ujung setiap edge berada di jalur yang sama dan grafnya bebas siklus.
 */

import type { LearningPath } from "@/modules/content/types";

export const paths = [
  {
    slug: "ai-for-impact-foundations",
    domainSlug: null,
    status: "PUBLISHED",
    level: "BEGINNER",
    title: {
      id: "Dasar AI untuk Dampak Nyata",
      en: "AI Foundations for Real-World Impact",
    },
    description: {
      id: "Dari nol sampai bisa membangun dan mengevaluasi model AI sederhana untuk masalah nyata.",
      en: "From zero to building and evaluating a simple AI model for a real-world problem.",
    },
    estimatedHours: 46,
    nodes: [
      {
        skillSlug: "python-basics",
        type: "CONCEPT",
        order: 0,
        posX: 0,
        posY: 0,
        estimatedHours: 8,
        task: null,
      },
      {
        skillSlug: "data-wrangling",
        type: "CONCEPT",
        order: 1,
        posX: 0,
        posY: 150,
        estimatedHours: 6,
        task: null,
      },
      {
        skillSlug: "ml-fundamentals",
        type: "CONCEPT",
        order: 2,
        posX: 0,
        posY: 300,
        estimatedHours: 10,
        task: null,
      },
      {
        skillSlug: "model-evaluation",
        type: "PRACTICE",
        order: 3,
        posX: -140,
        posY: 450,
        estimatedHours: 6,
        task: null,
      },
      {
        skillSlug: "responsible-ai",
        type: "CONCEPT",
        order: 4,
        posX: 140,
        posY: 450,
        estimatedHours: 4,
        task: null,
      },
      {
        skillSlug: "applied-project",
        type: "PROJECT",
        order: 5,
        posX: 0,
        posY: 600,
        estimatedHours: 12,
        task: {
          id: "Pilih satu kasus di Atlas, cari dataset terbuka yang relevan, latih model sederhana, lalu jelaskan hasil dan batasannya.",
          en: "Pick one Atlas case, find a relevant open dataset, train a simple model, then explain its results and limits.",
        },
      },
    ],
    edges: [
      ["python-basics", "data-wrangling"],
      ["data-wrangling", "ml-fundamentals"],
      ["ml-fundamentals", "model-evaluation"],
      ["ml-fundamentals", "responsible-ai"],
      ["model-evaluation", "applied-project"],
      ["responsible-ai", "applied-project"],
    ],
  },
] as const satisfies readonly LearningPath[];
