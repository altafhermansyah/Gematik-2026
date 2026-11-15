import { resolveLocalized } from "@/lib/i18n/localized";
import { getCaseBySlug } from "@/modules/cases/queries";
import { getDomains, getPublishedCases } from "@/modules/content/store";
import { getSiteOrigin } from "./metadata";

export function generateLlmsTxt(origin = getSiteOrigin()): string {
  const cases = getPublishedCases();
  const domains = getDomains();
  const countryCount = new Set(cases.map((item) => item.countryCode)).size;
  const metricCount = cases.reduce((sum, item) => sum + item.metrics.length, 0);
  const sdgSet = Array.from(new Set(cases.flatMap((item) => item.sdgs))).sort(
    (a, b) => a - b
  );

  const domainCounts = new Map<string, number>();
  for (const item of cases) {
    domainCounts.set(item.domainSlug, (domainCounts.get(item.domainSlug) ?? 0) + 1);
  }

  const lines: string[] = [
    "# KarsaLoka",
    "",
    `> KarsaLoka adalah atlas kurasi inovasi AI dan teknologi lapangan yang mendokumentasikan ${cases.length} studi kasus nyata di ${countryCount} negara lintas ${domains.length} bidang masalah dan ${sdgSet.length} target UN SDGs, dengan ${metricCount} metrik dampak kuantitatif yang dikutip langsung dari sumber primer peer-reviewed maupun laporan resmi.`,
    "",
    `- Bahasa utama: Bahasa Indonesia (default \`/\`), tersedia versi Inggris (\`?lang=en\` pada \`/\` dan \`/atlas\`, serta pengalih bahasa pada setiap dossier \`/cases/[slug]\`).`,
    `- Prinsip editorial & atribusi: Setiap angka dampak menyertakan kutipan verbatim dan URL sumber primer.`,
    `- Domain kanonik: ${origin}`,
    "",
    "## Navigasi & Dokumen Inti",
    "",
    `- [Beranda Observatory (Indonesia)](${origin}/): Globe 3D interaktif, overview misi, dan indeks bidang.`,
    `- [Observatory Home (English)](${origin}/?lang=en): Interactive 3D globe and verified field innovation overview.`,
    `- [Atlas 3D & Daftar Studi Kasus](${origin}/atlas): Eksplorasi 3D penuh dengan filter 6 bidang masalah.`,
    `- [Dossier Lengkap untuk Model AI](${origin}/llms-full.txt): Seluruh ${cases.length} studi kasus, ${metricCount} metrik, kutipan verbatim, dan referensi sumber primer dalam satu dokumen Markdown.`,
    `- [Peta Situs XML](${origin}/sitemap.xml): Indeks URL terstruktur untuk seluruh halaman KarsaLoka.`,
    "",
    `## ${domains.length} Bidang Masalah`,
    "",
    ...domains.map((domain) => {
      const idName = resolveLocalized(domain.name, `${domain.slug}.name`, "id");
      const enName = resolveLocalized(domain.name, `${domain.slug}.name`, "en");
      const count = domainCounts.get(domain.slug) ?? 0;
      return `- **${idName} / ${enName}** (\`${domain.slug}\`): ${count} studi kasus.`;
    }),
    "",
    `## Indeks Studi Kasus (${cases.length} Kasus Terbit)`,
    "",
    ...cases.map((item) => {
      const title = resolveLocalized(item.title, `${item.slug}.title`, "id");
      const summary = resolveLocalized(item.summary, `${item.slug}.summary`, "id");
      const lead = item.metrics[0];
      const leadLabel = lead
        ? resolveLocalized(lead.label, `${item.slug}.metrics[0].label`, "id")
        : "";
      const leadUnit = lead
        ? resolveLocalized(lead.unit, `${item.slug}.metrics[0].unit`, "id")
        : "";
      const metricSnippet = lead
        ? `${leadLabel}: ${lead.value} ${leadUnit}`.trim()
        : `${item.metrics.length} metrik`;
      const locationLabel = [item.region, item.countryCode]
        .filter(Boolean)
        .join(", ");
      const yearLabel = item.year ? `, ${item.year}` : "";
      return `- [${title}](${origin}/cases/${item.slug}): ${locationLabel}${yearLabel}. ${metricSnippet}. ${summary}`;
    }),
    "",
  ];

  return lines.join("\n");
}

export function generateLlmsFullTxt(origin = getSiteOrigin()): string {
  const cases = getPublishedCases();
  const countryCount = new Set(cases.map((item) => item.countryCode)).size;
  const metricCount = cases.reduce((sum, item) => sum + item.metrics.length, 0);

  const lines: string[] = [
    "# KarsaLoka: Dossier Ilmiah Lengkap",
    "",
    `> Dokumentasi lengkap ${cases.length} studi kasus inovasi AI & teknologi lapangan di ${countryCount} negara (${metricCount} metrik kuantitatif terverifikasi sumber primer). Saat mengutip angka, selalu sertakan nama studi kasus, nilai metrik, serta sumber primernya.`,
    "",
    `- URL Dasar: ${origin}`,
    `- Indeks Ringkas: ${origin}/llms.txt`,
    "",
  ];

  cases.forEach((item, idx) => {
    const idDetail = getCaseBySlug(item.slug, "id");
    const enDetail = getCaseBySlug(item.slug, "en");
    if (!idDetail || !enDetail) return;

    const locationLabel = [idDetail.region, idDetail.countryCode]
      .filter(Boolean)
      .join(", ");

    lines.push(
      "---",
      "",
      `## ${idx + 1}. ${idDetail.title} (${enDetail.title})`,
      "",
      `- **URL Kanonik:** ${origin}/cases/${idDetail.slug}`,
      `- **Bidang:** ${idDetail.domain.name} (${enDetail.domain.name})`,
      `- **Lokasi & Koordinat:** ${locationLabel} (${idDetail.lat}, ${idDetail.lng})`,
      `- **Tahun Implementasi / Publikasi:** ${idDetail.year ?? "Terverifikasi"}`,
      `- **UN SDGs:** ${idDetail.sdgs.map((sdg) => `SDG ${sdg}`).join(", ")}`,
      `- **Teknologi:** ${idDetail.technologies.join(", ")}`,
      "",
      "### Ringkasan & Konteks Lapangan",
      "",
      `- **Ringkasan:** ${idDetail.summary}`,
      `- **Masalah:** ${idDetail.problem}`,
      `- **Solusi:** ${idDetail.solution}`,
      `- **Peran AI / Teknologi Inti:** ${idDetail.aiRole}`,
      `- **Dampak di Lapangan:** ${idDetail.impact}`,
      "",
      "### Metrik Dampak Terverifikasi",
      ""
    );

    for (const metric of idDetail.metrics) {
      lines.push(
        `- **${metric.label}:** ${metric.value} ${metric.unit}`.trim(),
        `  - Kutipan verbatim: "${metric.quote}"`,
        `  - Sumber: ${metric.sourceUrl}`
      );
    }

    lines.push("", "### Sumber Primer", "");
    for (const source of idDetail.sources) {
      const accessNote = source.accessedAt
        ? `, diakses ${source.accessedAt}`
        : "";
      lines.push(
        `- ${source.title} (${source.publisher}, ${source.url}${accessNote})`
      );
    }
    lines.push("");
  });

  return lines.join("\n");
}
