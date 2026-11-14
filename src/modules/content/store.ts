/**
 * Titik akses tunggal ke konten kurasi.
 *
 * Semua pembacaan konten melewati modul ini supaya validasi integritas hanya
 * dijalankan sekali per proses. Validasi dijalankan malas (lazy) dan sengaja
 * melempar error: lebih baik build gagal daripada konten cacat tayang.
 *
 * Saat `/cases/[slug]` dirender lewat `generateStaticParams`, modul ini
 * dieksekusi pada waktu build. Artinya konten yang merusak invarian akan
 * menggagalkan `next build`, bukan menunggu ketahuan di produksi.
 */

import { cases } from "@/content/cases";
import { domains } from "@/content/domains";
import { paths } from "@/content/paths";
import { resources } from "@/content/resources";
import { skills } from "@/content/skills";
import type { CaseStudy, Domain, LearningPath, Resource, Skill } from "./types";
import { assertContentIntegrity, type ContentBundle } from "./validate";

const bundle: ContentBundle = { domains, cases, skills, resources, paths };

let integrityChecked = false;

function ensureIntegrity(): void {
  if (integrityChecked) return;
  assertContentIntegrity(bundle);
  integrityChecked = true;
}

/** Bidang terurut sesuai `order`, dipakai chip filter dan warna globe. */
export function getDomains(): Domain[] {
  ensureIntegrity();
  return [...bundle.domains].sort((a, b) => a.order - b.order);
}

export function getDomainBySlug(slug: string): Domain | null {
  ensureIntegrity();
  return bundle.domains.find((domain) => domain.slug === slug) ?? null;
}

export function getAllCases(): readonly CaseStudy[] {
  ensureIntegrity();
  return bundle.cases;
}

/**
 * Kasus yang boleh tayang publik, diurutkan `featured` lebih dulu lalu slug.
 * Urutan ini sama dengan `orderBy` Prisma yang digantikan (featured desc, slug asc)
 * agar urutan daftar di Atlas tidak berubah tanpa alasan.
 */
export function getPublishedCases(): CaseStudy[] {
  ensureIntegrity();
  return bundle.cases
    .filter((caseStudy) => caseStudy.status === "PUBLISHED")
    .sort((a, b) => {
      if (a.featured !== b.featured) return a.featured ? -1 : 1;
      return a.slug.localeCompare(b.slug);
    });
}

/** Hanya kasus PUBLISHED yang bisa diakses lewat URL. */
export function getPublishedCaseBySlug(slug: string): CaseStudy | null {
  ensureIntegrity();
  return (
    bundle.cases.find(
      (caseStudy) => caseStudy.slug === slug && caseStudy.status === "PUBLISHED"
    ) ?? null
  );
}

export function getPaths(): LearningPath[] {
  ensureIntegrity();
  return bundle.paths.filter((path) => path.status === "PUBLISHED");
}

export function getPathBySlug(slug: string): LearningPath | null {
  ensureIntegrity();
  return (
    bundle.paths.find((path) => path.slug === slug && path.status === "PUBLISHED") ??
    null
  );
}

export function getSkills(): readonly Skill[] {
  ensureIntegrity();
  return bundle.skills;
}

export function getSkillBySlug(slug: string): Skill | null {
  ensureIntegrity();
  return bundle.skills.find((skill) => skill.slug === slug) ?? null;
}

export function getResourcesBySkill(slug: string): Resource[] {
  ensureIntegrity();
  return bundle.resources
    .filter((resource) => resource.skillSlug === slug)
    .sort((a, b) => a.order - b.order);
}
