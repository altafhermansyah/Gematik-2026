/**
 * Materi belajar per skill.
 *
 * Dimigrasikan dari seed PostgreSQL sebelumnya. Semua tautan diutamakan gratis
 * dan diperiksa saat migrasi; bila tautan mati, penggantian dicatat di laporan
 * migrasi.
 */

import type { Resource } from "@/modules/content/types";

export const resources = [
  {
    skillSlug: "python-basics",
    type: "DOCS",
    title: "The Python Tutorial",
    url: "https://docs.python.org/3/tutorial/",
    provider: "python.org",
    lang: "en",
    free: true,
    order: 0,
  },
  {
    skillSlug: "data-wrangling",
    type: "DOCS",
    title: "pandas: Getting started tutorials",
    url: "https://pandas.pydata.org/docs/getting_started/intro_tutorials/",
    provider: "pandas",
    lang: "en",
    free: true,
    order: 0,
  },
  {
    skillSlug: "ml-fundamentals",
    type: "COURSE",
    title: "Machine Learning Crash Course",
    url: "https://developers.google.com/machine-learning/crash-course",
    provider: "Google",
    lang: "en",
    free: true,
    order: 0,
  },
  {
    skillSlug: "ml-fundamentals",
    type: "DOCS",
    title: "scikit-learn User Guide",
    url: "https://scikit-learn.org/stable/user_guide.html",
    provider: "scikit-learn",
    lang: "en",
    free: true,
    order: 1,
  },
  {
    skillSlug: "model-evaluation",
    type: "DOCS",
    title: "Metrics and scoring",
    url: "https://scikit-learn.org/stable/modules/model_evaluation.html",
    provider: "scikit-learn",
    lang: "en",
    free: true,
    order: 0,
  },
  {
    skillSlug: "responsible-ai",
    type: "ARTICLE",
    title: "People + AI Guidebook",
    url: "https://pair.withgoogle.com/guidebook/",
    provider: "Google PAIR",
    lang: "en",
    free: true,
    order: 0,
  },
  {
    skillSlug: "applied-project",
    type: "COURSE",
    title: "Kaggle Learn",
    url: "https://www.kaggle.com/learn",
    provider: "Kaggle",
    lang: "en",
    free: true,
    order: 0,
  },
] as const satisfies readonly Resource[];
