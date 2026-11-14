/**
 * Validasi integritas konten lokal.
 *
 * Menggantikan `assertIntegrity()` yang dulu ada di `prisma/seed.ts`. Dulu
 * database bisa menyimpan konten tidak sehat (kasus PUBLISHED tanpa sumber,
 * koordinat mustahil, slug domain yatim) karena tidak ada yang memeriksanya.
 * Di model lokal ini, konten adalah kode: kesalahan harus menggagalkan build,
 * bukan diam-diam tayang.
 *
 * Fungsi ini sengaja tidak memakai Zod. Bentuk data sudah dijamin TypeScript
 * lewat `satisfies`; yang diperiksa di sini adalah invarian lintas-record yang
 * tidak bisa ditangkap sistem tipe (keunikan, rujukan, aturan editorial).
 */

import type { LocalizedText } from "@/lib/i18n/localized";
import type {
  CaseStudy,
  Domain,
  LearningPath,
  Resource,
  Skill,
} from "./types";

export type ContentBundle = {
  domains: readonly Domain[];
  cases: readonly CaseStudy[];
  skills: readonly Skill[];
  resources: readonly Resource[];
  paths: readonly LearningPath[];
};

const SDG_MIN = 1;
const SDG_MAX = 17;
const COUNTRY_CODE_PATTERN = /^[A-Z]{2}$/;
const HEX_COLOR_PATTERN = /^#[0-9a-fA-F]{6}$/;
const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

function describeSlugList(slugs: string[]): string {
  return slugs.length > 0 ? slugs.join(", ") : "tidak ada";
}

function assertUniqueSlugs(
  label: string,
  records: readonly { slug: string }[],
  errors: string[]
): void {
  const seen = new Set<string>();
  const duplicates = new Set<string>();
  for (const record of records) {
    if (seen.has(record.slug)) duplicates.add(record.slug);
    seen.add(record.slug);
  }
  if (duplicates.size > 0) {
    errors.push(
      `${label} memiliki slug duplikat: ${describeSlugList([...duplicates])}`
    );
  }
}

/** Aturan §7.9 sebelumnya: konten PUBLISHED wajib terisi di kedua bahasa. */
function assertLocalizedComplete(
  caseSlug: string,
  fieldName: string,
  value: LocalizedText,
  errors: string[]
): void {
  if (value.id.trim().length === 0) {
    errors.push(`kasus "${caseSlug}": field "${fieldName}.id" kosong`);
  }
  if (value.en.trim().length === 0) {
    errors.push(`kasus "${caseSlug}": field "${fieldName}.en" kosong`);
  }
}

function assertUrl(
  ownerLabel: string,
  label: string,
  url: string,
  errors: string[]
): void {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    errors.push(`${ownerLabel}: ${label} bukan URL absolut yang sah (${url})`);
    return;
  }
  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    errors.push(`${ownerLabel}: ${label} harus http(s), bukan ${parsed.protocol}`);
  }
}

function validateCase(
  caseStudy: CaseStudy,
  domainSlugs: Set<string>,
  pathSlugs: Set<string>,
  errors: string[]
): void {
  const label = `kasus "${caseStudy.slug}"`;
  const caseSourceUrls = new Set(caseStudy.sources.map((source) => source.url));

  if (!domainSlugs.has(caseStudy.domainSlug)) {
    errors.push(`${label}: domainSlug "${caseStudy.domainSlug}" tidak ditemukan`);
  }

  if (caseStudy.status === "PUBLISHED") {
    assertLocalizedComplete(caseStudy.slug, "title", caseStudy.title, errors);
    assertLocalizedComplete(caseStudy.slug, "summary", caseStudy.summary, errors);
    assertLocalizedComplete(caseStudy.slug, "problem", caseStudy.problem, errors);
    assertLocalizedComplete(caseStudy.slug, "solution", caseStudy.solution, errors);
    assertLocalizedComplete(caseStudy.slug, "aiRole", caseStudy.aiRole, errors);
    assertLocalizedComplete(caseStudy.slug, "impact", caseStudy.impact, errors);

    if (caseStudy.sources.length === 0) {
      errors.push(`${label}: berstatus PUBLISHED tetapi tidak punya satu pun sumber`);
    }
  }

  if (!COUNTRY_CODE_PATTERN.test(caseStudy.countryCode)) {
    errors.push(
      `${label}: countryCode harus ISO-2 huruf besar, diterima "${caseStudy.countryCode}"`
    );
  }

  if (!Number.isFinite(caseStudy.lat) || caseStudy.lat < -90 || caseStudy.lat > 90) {
    errors.push(`${label}: lat di luar rentang -90..90 (${caseStudy.lat})`);
  }
  if (!Number.isFinite(caseStudy.lng) || caseStudy.lng < -180 || caseStudy.lng > 180) {
    errors.push(`${label}: lng di luar rentang -180..180 (${caseStudy.lng})`);
  }
  // Titik (0, 0) ada di Teluk Guinea dan hampir selalu berarti koordinat belum diisi.
  if (caseStudy.lat === 0 && caseStudy.lng === 0) {
    errors.push(`${label}: koordinat (0, 0) hampir pasti placeholder, isi lokasi nyata`);
  }

  if (caseStudy.year !== null && (caseStudy.year < 1900 || caseStudy.year > 2100)) {
    errors.push(`${label}: year tidak masuk akal (${caseStudy.year})`);
  }

  if (caseStudy.sdgs.length === 0) {
    errors.push(`${label}: sdgs kosong, minimal satu target`);
  }
  const sdgDuplicates = caseStudy.sdgs.filter(
    (sdg, index) => caseStudy.sdgs.indexOf(sdg) !== index
  );
  if (sdgDuplicates.length > 0) {
    errors.push(`${label}: sdgs duplikat (${sdgDuplicates.join(", ")})`);
  }
  for (const sdg of caseStudy.sdgs) {
    if (!Number.isInteger(sdg) || sdg < SDG_MIN || sdg > SDG_MAX) {
      errors.push(`${label}: sdg di luar ${SDG_MIN}..${SDG_MAX} (${sdg})`);
    }
  }

  if (caseStudy.technologies.length === 0) {
    errors.push(`${label}: technologies kosong, minimal satu tag`);
  }
  for (const technology of caseStudy.technologies) {
    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(technology)) {
      errors.push(`${label}: tag teknologi harus kebab-case ("${technology}")`);
    }
  }

  for (const [index, metric] of caseStudy.metrics.entries()) {
    if (!Number.isFinite(metric.value)) {
      errors.push(`${label}: metrics[${index}].value bukan angka berhingga`);
    }
    if (caseStudy.status === "PUBLISHED") {
      assertLocalizedComplete(
        caseStudy.slug,
        `metrics[${index}].unit`,
        metric.unit,
        errors
      );
      assertLocalizedComplete(
        caseStudy.slug,
        `metrics[${index}].label`,
        metric.label,
        errors
      );
    } else {
      if (metric.unit.id.trim().length === 0 && metric.unit.en.trim().length === 0) {
        errors.push(`${label}: metrics[${index}].unit kosong di kedua bahasa`);
      }
      if (metric.label.id.trim().length === 0 && metric.label.en.trim().length === 0) {
        errors.push(`${label}: metrics[${index}].label kosong di kedua bahasa`);
      }
    }
    // Jejak audit: angka tanpa kutipan sumber tidak boleh tayang.
    if (metric.quote.trim().length === 0) {
      errors.push(
        `${label}: metrics[${index}] tidak punya kutipan sumber ("quote")`
      );
    }
    assertUrl(label, `metrics[${index}].sourceUrl`, metric.sourceUrl, errors);
    if (!caseSourceUrls.has(metric.sourceUrl)) {
      errors.push(
        `${label}: metrics[${index}].sourceUrl tidak tercantum di sources kasus ini`
      );
    }
  }

  for (const [index, source] of caseStudy.sources.entries()) {
    if (source.title.trim().length === 0) {
      errors.push(`${label}: sources[${index}].title kosong`);
    }
    assertUrl(label, `sources[${index}].url`, source.url, errors);
    if (source.accessedAt !== null && !ISO_DATE_PATTERN.test(source.accessedAt)) {
      errors.push(
        `${label}: sources[${index}].accessedAt harus YYYY-MM-DD ("${source.accessedAt}")`
      );
    }
  }

  const pathLinkSlugs = caseStudy.paths.map((link) => link.pathSlug);
  const pathLinkDuplicates = pathLinkSlugs.filter(
    (slug, index) => pathLinkSlugs.indexOf(slug) !== index
  );
  if (pathLinkDuplicates.length > 0) {
    errors.push(`${label}: paths duplikat (${pathLinkDuplicates.join(", ")})`);
  }
  for (const link of caseStudy.paths) {
    if (!pathSlugs.has(link.pathSlug)) {
      errors.push(`${label}: merujuk pathSlug "${link.pathSlug}" yang tidak ada`);
    }
  }
}

function validatePath(
  path: LearningPath,
  skillSlugs: Set<string>,
  domainSlugs: Set<string>,
  errors: string[]
): void {
  const label = `jalur "${path.slug}"`;

  if (path.domainSlug !== null && !domainSlugs.has(path.domainSlug)) {
    errors.push(`${label}: domainSlug "${path.domainSlug}" tidak ditemukan`);
  }

  const nodeSkillSlugs = path.nodes.map((node) => node.skillSlug);
  const duplicateNodes = nodeSkillSlugs.filter(
    (slug, index) => nodeSkillSlugs.indexOf(slug) !== index
  );
  if (duplicateNodes.length > 0) {
    errors.push(`${label}: node duplikat untuk skill (${duplicateNodes.join(", ")})`);
  }
  for (const node of path.nodes) {
    if (!skillSlugs.has(node.skillSlug)) {
      errors.push(`${label}: node merujuk skill "${node.skillSlug}" yang tidak ada`);
    }
  }
  for (const node of path.nodes) {
    if (node.posX !== null && !Number.isFinite(node.posX)) {
      errors.push(`${label}: posX bukan angka berhingga untuk "${node.skillSlug}"`);
    }
    if (node.posY !== null && !Number.isFinite(node.posY)) {
      errors.push(`${label}: posY bukan angka berhingga untuk "${node.skillSlug}"`);
    }
  }

  const members = new Set(nodeSkillSlugs);
  const seenEdges = new Set<string>();
  for (const [from, to] of path.edges) {
    if (!members.has(from) || !members.has(to)) {
      errors.push(`${label}: edge ${from} -> ${to} menghubungkan node di luar jalur ini`);
    }
    if (from === to) {
      errors.push(`${label}: edge ${from} -> ${to} menghubungkan node ke dirinya sendiri`);
    }
    const key = `${from}->${to}`;
    if (seenEdges.has(key)) {
      errors.push(`${label}: edge ${key} duplikat`);
    }
    seenEdges.add(key);
  }

  // Siklus prasyarat akan membuat graf mustahil diselesaikan.
  const adjacency = new Map<string, string[]>();
  for (const [from, to] of path.edges) {
    const next = adjacency.get(from) ?? [];
    next.push(to);
    adjacency.set(from, next);
  }
  const state = new Map<string, "visiting" | "done">();
  const findCycle = (node: string): boolean => {
    const current = state.get(node);
    if (current === "visiting") return true;
    if (current === "done") return false;
    state.set(node, "visiting");
    for (const next of adjacency.get(node) ?? []) {
      if (findCycle(next)) return true;
    }
    state.set(node, "done");
    return false;
  };
  for (const node of members) {
    if (findCycle(node)) {
      errors.push(`${label}: graf prasyarat mengandung siklus`);
      break;
    }
  }
}

/**
 * Melempar `Error` berisi seluruh pelanggaran sekaligus, bukan satu per satu,
 * supaya penulis konten bisa memperbaiki semuanya dalam satu putaran.
 */
export function assertContentIntegrity(bundle: ContentBundle): void {
  const errors: string[] = [];

  assertUniqueSlugs("domains", bundle.domains, errors);
  assertUniqueSlugs("cases", bundle.cases, errors);
  assertUniqueSlugs("skills", bundle.skills, errors);
  assertUniqueSlugs("paths", bundle.paths, errors);

  const domainSlugs = new Set(bundle.domains.map((domain) => domain.slug));
  const skillSlugs = new Set(bundle.skills.map((skill) => skill.slug));
  const pathSlugs = new Set(bundle.paths.map((path) => path.slug));

  for (const domain of bundle.domains) {
    if (!HEX_COLOR_PATTERN.test(domain.color)) {
      errors.push(`domain "${domain.slug}": color harus hex 6 digit ("${domain.color}")`);
    }
    if (domain.name.id.trim().length === 0 || domain.name.en.trim().length === 0) {
      errors.push(`domain "${domain.slug}": name wajib terisi di kedua bahasa`);
    }
  }

  for (const caseStudy of bundle.cases) {
    validateCase(caseStudy, domainSlugs, pathSlugs, errors);
  }

  for (const path of bundle.paths) {
    validatePath(path, skillSlugs, domainSlugs, errors);
  }

  for (const [index, resource] of bundle.resources.entries()) {
    if (!skillSlugs.has(resource.skillSlug)) {
      errors.push(
        `resources[${index}]: merujuk skill "${resource.skillSlug}" yang tidak ada`
      );
    }
    assertUrl(`resources[${index}]`, "url", resource.url, errors);
  }

  if (errors.length > 0) {
    throw new Error(
      `Konten lokal gagal validasi (${errors.length} masalah):\n- ${errors.join("\n- ")}`
    );
  }
}
