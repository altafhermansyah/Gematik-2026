import { getPublishedCases, getPaths, getSkills } from "@/modules/content/store";
import type { Locale } from "@/lib/i18n/localized";
import { resolveLocalized } from "@/lib/i18n/localized";
import type { AssistantChatResponse } from "./types";

const IN_DOMAIN_KEYWORDS = [
  "karsaloka", "karsa", "loka", "atlas", "globe", "kasus", "case", "inovasi", "innovation",
  "ai", "kecerdasan", "buatan", "teknologi", "technology", "metrik", "metric", "dampak", "impact",
  "sdg", "jalur", "path", "roadmap", "belajar", "skill", "keahlian",
  // 6 Domains
  "iklim", "climate", "lingkungan", "environment",
  "pangan", "food", "pertanian", "agriculture", "hama", "tanaman",
  "kesehatan", "health", "medis", "sains", "science", "penyakit", "obat",
  "pendidikan", "education", "belajar", "sekolah", "matematika",
  "bencana", "disaster", "banjir", "flood", "peringatan",
  "inklusi", "inclusion", "tunanetra", "disabilitas", "bahasa",
  // Specific Cases & Entities
  "indonesia", "yogyakarta", "jogja", "solok", "sumatra", "jakarta", "warsi",
  "wolbachia", "nyamuk", "mosquito", "dengue", "dbd",
  "petabencana", "peta bencana", "bnpb",
  "rainforest", "rfcx", "guardian", "hutan", "bioakustik", "suara",
  "alphafold", "protein", "deepmind",
  "zipline", "drone", "darah", "blood", "rwanda",
  "qure", "tbc", "tuberkulosis", "tuberculosis", "rontgen", "x-ray",
  "mpedigree", "palsu", "counterfeit", "ghana",
  "mindspark", "adaptif", "adaptive",
  "onebillion", "tablet", "malawi",
  "plantvillage", "nuru", "singkong", "cassava", "kenya",
  "plantix", "petani", "smallholder", "india",
  "togo", "novissi", "bantuan", "kemiskinan",
  "be my eyes", "bemyeyes", "penglihatan", "relawan",
  "masakhane", "nlp", "afrika", "terjemahan",
  "flood hub", "sungai", "river", "bangladesh",
  "global fishing watch", "fishing", "kapal", "vessel", "laut",
];

// Explicit out-of-domain patterns that should be immediately rejected
const OUT_OF_DOMAIN_PATTERNS = [
  /\b(resep|masak|goreng|panggang|makanan|minuman|nasi|kue|roti|pancake|baking)\b/i,
  /\b(lagu|lirik|musik|film|sinema|aktor|aktris|selebriti|gossip|zodiak|horoskop)\b/i,
  /\b(pacar|cinta|jodoh|kencan|puisi\s+cinta)\b/i,
  /\b(politik|partai|pilpres|pemilu|kampanye|presiden\s+pertama)\b/i,
  /\b(sepakbola|bola|futsal|liga\s+inggris|champion|ronaldo|messi)\b/i,
  /\b(game|gaming|mobile\s+legends|free\s+fire|pubg|valorant|steam)\b/i,
  /\b(joke|jokes|lelucon|tebak-tebakan|lawak)\b/i,
];

export function isQueryInDomain(query: string): boolean {
  const normalized = query.toLowerCase().trim();
  if (normalized.length < 2) return true;

  // Immediate check for explicit out-of-domain topics
  if (OUT_OF_DOMAIN_PATTERNS.some((pattern) => pattern.test(normalized))) {
    return false;
  }

  // Check matching in-domain keywords
  const hasInDomainMatch = IN_DOMAIN_KEYWORDS.some((kw) => {
    if (kw.length <= 4) {
      // Use word boundary for short tokens to avoid false positives (e.g. 'ai' in 'bagaimana', 'dbd' etc.)
      const regex = new RegExp(`\\b${kw}\\b`, "i");
      return regex.test(normalized);
    }
    return normalized.includes(kw);
  });

  return hasInDomainMatch;
}

export function generateLocalFallback(
  query: string,
  locale: Locale = "id"
): AssistantChatResponse {
  const normalized = query.toLowerCase().trim();
  const cases = getPublishedCases();
  const paths = getPaths();
  const skills = getSkills();

  // 1. Check out of context
  if (!isQueryInDomain(normalized)) {
    if (locale === "en") {
      return {
        reply: `**Out of Scope Notice**\n\nI am the **KarsaLoka Field Assistant**, dedicated exclusively to assisting you with our 16 verified technological innovations, global challenges, SDGs, impact metrics, and learning pathways.\n\nI cannot answer general queries outside of this platform's domain (such as general knowledge, cooking, general coding, or unrelated topics).\n\n**Here are topics you can explore with me:**\n* *"What innovations are taking place in Indonesia?"*\n* *"How did Wolbachia mosquitoes reduce dengue cases by 77.1% in Yogyakarta?"*\n* *"How does Zipline use autonomous drones for medical deliveries in Rwanda?"*\n* *"How does bioacoustics protect rainforests in Sumatra?"*`,
        isInContext: false,
        isFallback: true,
      };
    }

    return {
      reply: `**Pemberitahuan Batasan Topik**\n\nMaaf, sebagai **Asisten Lapangan KarsaLoka**, saya hanya dapat menjawab pertanyaan seputar 16 studi kasus inovasi teknologi global & Indonesia, 6 bidang masalah, metrik ilmiah terverifikasi, dan jalur belajar KarsaLoka.\n\nSaya tidak dapat melayani pertanyaan di luar konteks ini (seperti resep masakan, obrolan umum, politik, atau pertanyaan di luar lingkup KarsaLoka).\n\n**Topik terverifikasi yang bisa Anda tanyakan:**\n* *"Inovasi apa saja yang ada di Indonesia?"*\n* *"Bagaimana nyamuk ber-Wolbachia menekan 77,1% kasus DBD di Yogyakarta?"*\n* *"Bagaimana satelit dan AI mendeteksi kapal penangkap ikan tak berizin?"*\n* *"Bagaimana drone Zipline mengirimkan darah di Rwanda dalam 15 menit?"*`,
      isInContext: false,
      isFallback: true,
    };
  }

  // 2. Specific Query: Indonesian cases
  if (
    normalized.includes("indonesia") ||
    normalized.includes("lokal") ||
    normalized.includes("tanah air")
  ) {
    const idCases = cases.filter((c) => c.countryCode === "ID");
    const caseSlugs = idCases.map((c) => c.slug);

    if (locale === "en") {
      const listText = idCases
        .map(
          (c) =>
            `* **[${resolveLocalized(c.title, "en")}](/cases/${c.slug})** (${c.region}, ${c.year})\n  ${resolveLocalized(c.summary, "en")}\n  *Key Metric:* ${c.metrics[0]?.value.toLocaleString()} ${resolveLocalized(c.metrics[0]?.unit, "en")} ("${c.metrics[0]?.quote}")`
        )
        .join("\n\n");

      return {
        reply: `### Verified Field Deployments in Indonesia 🇮🇩\n\nKarsaLoka documents **3 published, peer-reviewed innovation deployments in Indonesia** across health, climate, and disaster resilience:\n\n${listText}\n\n*Click on any title above to open the full dossier with primary scientific citations.*`,
        caseSlugs,
        isInContext: true,
        isFallback: true,
      };
    }

    const listText = idCases
      .map(
        (c) =>
          `* **[${resolveLocalized(c.title, "id")}](/cases/${c.slug})** (${c.region}, ${c.year})\n  ${resolveLocalized(c.summary, "id")}\n  *Metrik Kunci:* ${c.metrics[0]?.value.toLocaleString()} ${resolveLocalized(c.metrics[0]?.unit, "id")} (*Kutipan:* "${c.metrics[0]?.quote}")`
      )
      .join("\n\n");

    return {
      reply: `### Studi Kasus Lapangan di Indonesia 🇮🇩\n\nKarsaLoka mencatat **3 inovasi teknologi nyata di Indonesia** yang telah diuji di lapangan dan diverifikasi secara ilmiah:\n\n${listText}\n\n*Klik judul studi kasus di atas untuk membaca dossier lengkap beserta jejak audit jurnal primernya.*`,
      caseSlugs,
      isInContext: true,
      isFallback: true,
    };
  }

  // 3. Search matching specific cases by relevance score
  const scoredCases = cases.map((c) => {
    const title = resolveLocalized(c.title, locale).toLowerCase();
    const summary = resolveLocalized(c.summary, locale).toLowerCase();
    const problem = resolveLocalized(c.problem, locale).toLowerCase();
    const solution = resolveLocalized(c.solution, locale).toLowerCase();
    const aiRole = resolveLocalized(c.aiRole, locale).toLowerCase();
    const tech = c.technologies.join(" ").toLowerCase();
    const slug = c.slug.toLowerCase();

    let score = 0;

    // Direct entity checks
    if (slug.includes("wolbachia") && (normalized.includes("wolbachia") || normalized.includes("dengue") || normalized.includes("dbd") || normalized.includes("nyamuk"))) score += 10;
    if (slug.includes("zipline") && (normalized.includes("zipline") || normalized.includes("drone") || normalized.includes("rwanda") || normalized.includes("darah"))) score += 10;
    if (slug.includes("alphafold") && (normalized.includes("alphafold") || normalized.includes("protein") || normalized.includes("deepmind"))) score += 10;
    if (slug.includes("petabencana") && (normalized.includes("petabencana") || (normalized.includes("banjir") && normalized.includes("jakarta")))) score += 10;
    if (slug.includes("plantvillage") && (normalized.includes("plantvillage") || normalized.includes("nuru") || normalized.includes("singkong") || normalized.includes("daun") || normalized.includes("kenya"))) score += 10;
    if (slug.includes("plantix") && (normalized.includes("plantix") || (normalized.includes("petani") && normalized.includes("hama")))) score += 10;
    if (slug.includes("rainforest") && (normalized.includes("rainforest") || normalized.includes("rfcx") || normalized.includes("hutan") || normalized.includes("solok") || normalized.includes("bioakustik"))) score += 10;
    if (slug.includes("fishing") && (normalized.includes("fishing") || normalized.includes("kapal") || normalized.includes("ikan") || normalized.includes("laut"))) score += 10;
    if (slug.includes("be-my-eyes") && (normalized.includes("be my eyes") || normalized.includes("bemyeyes") || normalized.includes("tunanetra") || normalized.includes("penglihatan") || normalized.includes("mata"))) score += 10;
    if (slug.includes("masakhane") && (normalized.includes("masakhane") || normalized.includes("bahasa") || normalized.includes("nlp") || normalized.includes("afrika"))) score += 10;
    if (slug.includes("flood-hub") && (normalized.includes("flood hub") || (normalized.includes("banjir") && normalized.includes("bangladesh")) || normalized.includes("sungai"))) score += 10;
    if (slug.includes("togo") && (normalized.includes("togo") || normalized.includes("novissi") || (normalized.includes("satelit") && normalized.includes("bantuan")))) score += 10;
    if (slug.includes("qure") && (normalized.includes("qure") || normalized.includes("tbc") || normalized.includes("tuberkulosis") || normalized.includes("rontgen") || normalized.includes("xray"))) score += 10;
    if (slug.includes("mpedigree") && (normalized.includes("mpedigree") || normalized.includes("obat") || normalized.includes("ghana"))) score += 10;
    if (slug.includes("mindspark") && (normalized.includes("mindspark") || (normalized.includes("matematika") && normalized.includes("india")))) score += 10;
    if (slug.includes("onebillion") && (normalized.includes("onebillion") || normalized.includes("malawi") || normalized.includes("tablet"))) score += 10;

    // Check keywords in prompt
    const words = normalized.split(/\s+/).filter((w) => w.length >= 4);
    for (const w of words) {
      if (title.includes(w)) score += 3;
      if (summary.includes(w)) score += 2;
      if (tech.includes(w)) score += 2;
      if (problem.includes(w) || solution.includes(w) || aiRole.includes(w)) score += 1;
    }

    return { caseItem: c, score };
  });

  const matched = scoredCases
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((item) => item.caseItem);

  if (matched.length > 0) {
    const primary = matched[0];
    const title = resolveLocalized(primary.title, locale);
    const summary = resolveLocalized(primary.summary, locale);
    const problem = resolveLocalized(primary.problem, locale);
    const solution = resolveLocalized(primary.solution, locale);
    const aiRole = resolveLocalized(primary.aiRole, locale);
    const impact = resolveLocalized(primary.impact, locale);

    const metricsText = primary.metrics
      .map(
        (m) =>
          `* **${m.value.toLocaleString()} ${resolveLocalized(m.unit, locale)}** (${resolveLocalized(m.label, locale)}): *"${m.quote}"*`
      )
      .join("\n");

    const sourcesText = primary.sources
      .map((s) => `* [${s.title}](${s.url}) (${s.publisher ?? "Sumber Primer"})`)
      .join("\n");

    if (locale === "en") {
      return {
        reply: `### [${title}](/cases/${primary.slug})\n*Location: ${primary.region ?? primary.countryCode} (${primary.year ?? "-"}) | Domain: ${primary.domainSlug} | SDGs: ${primary.sdgs.join(", ")}*\n\n${summary}\n\n**The Problem:**\n${problem}\n\n**The Solution & AI Role:**\n${solution}\n\n*AI Role Detail:* ${aiRole}\n\n**Impact in the Field:**\n${impact}\n\n**Verified Metrics:**\n${metricsText}\n\n**Primary Scientific References:**\n${sourcesText}\n\n👉 [Explore Full Dossier for this Case](/cases/${primary.slug})`,
        caseSlugs: [primary.slug],
        isInContext: true,
        isFallback: true,
      };
    }

    return {
      reply: `### [${title}](/cases/${primary.slug})\n*Lokasi: ${primary.region ?? primary.countryCode} (${primary.year ?? "-"}) | Bidang: ${primary.domainSlug} | Target SDG: ${primary.sdgs.join(", ")}*\n\n${summary}\n\n**Masalah yang Dihadapi:**\n${problem}\n\n**Solusi & Peran Teknologi/AI:**\n${solution}\n\n*Detail Peran AI:* ${aiRole}\n\n**Dampak Nyata di Lapangan:**\n${impact}\n\n**Metrik Dampak Terverifikasi:**\n${metricsText}\n\n**Sumber Ilmiah Primer:**\n${sourcesText}\n\n👉 [Buka Halaman Dossier Lengkap](/cases/${primary.slug})`,
      caseSlugs: [primary.slug],
      isInContext: true,
      isFallback: true,
    };
  }

  // 4. Learning path query
  if (
    normalized.includes("jalur") ||
    normalized.includes("path") ||
    normalized.includes("belajar") ||
    normalized.includes("skill") ||
    normalized.includes("kurikulum")
  ) {
    const p = paths[0];
    const pathTitle = resolveLocalized(p.title, locale);
    const pathDesc = resolveLocalized(p.description, locale);
    const skillList = skills
      .map((s) => `* **${resolveLocalized(s.name, locale)}** (\`${s.slug}\`)`)
      .join("\n");

    if (locale === "en") {
      return {
        reply: `### Learning Pathway: ${pathTitle}\n*Level: ${p.level} | Estimated: ${p.estimatedHours} hours*\n\n${pathDesc}\n\n**Curriculum Skills:**\n${skillList}\n\nEvery node in this path directly bridges user curiosity into real technical empowerment, connecting foundational Python skills to deploying responsible AI for real-world impact.`,
        isInContext: true,
        isFallback: true,
      };
    }

    return {
      reply: `### Jalur Belajar: ${pathTitle}\n*Tingkat: ${p.level} | Estimasi: ${p.estimatedHours} jam belajar*\n\n${pathDesc}\n\n**Keahlian yang Dipelajari:**\n${skillList}\n\nJalur ini dirancang agar siapapun dapat berpindah dari sekadar melihat krisis di Atlas menjadi inovator yang mampu membangun solusi kecerdasan buatan terapan yang bertanggung jawab.`,
      isInContext: true,
      isFallback: true,
    };
  }

  // 5. General summary of KarsaLoka
  if (locale === "en") {
    return {
      reply: `### Welcome to KarsaLoka Field Assistant\n\nKarsaLoka is an interactive educational platform connecting global problems with **16 verified field innovations** across 11 countries and 6 problem domains:\n\n* **Climate & Environment:** Rainforest bioacoustics (Indonesia), Dark fishing vessels tracking (US)\n* **Food & Agriculture:** PlantVillage Nuru (Kenya), Plantix crop diagnostics (India)\n* **Health & Science:** Wolbachia dengue suppression (Indonesia), AlphaFold protein folding (UK), Zipline medical drones (Rwanda), Qure.ai TB screening (India), mPedigree drug authentication (Ghana)\n* **Education:** Mindspark adaptive learning (India), onebillion tablet math (Malawi)\n* **Disaster Resilience:** PetaBencana flood crowdsourcing (Indonesia), Google Flood Hub (Bangladesh)\n* **Social Inclusion:** Togo Novissi satellite targeting (Togo), Be My Eyes visual assistance (Denmark), Masakhane African NLP (Kenya)\n\nWhat would you like to explore? Feel free to ask about any specific case or technology!`,
      caseSlugs: cases.slice(0, 3).map((c) => c.slug),
      isInContext: true,
      isFallback: true,
    };
  }

  return {
    reply: `### Selamat Datang di Asisten Lapangan KarsaLoka\n\nKarsaLoka menyajikan **16 studi kasus inovasi teknologi dan AI** yang telah teruji secara ilmiah di 11 negara melintasi 6 bidang masalah:\n\n* **Iklim & Lingkungan:** Bioakustik hutan adat (Sumatra Barat, Indonesia) & Pelacakan kapal industri (AS)\n* **Pangan & Pertanian:** Deteksi penyakit singkong PlantVillage (Kenya) & Diagnosa hama Plantix (India)\n* **Kesehatan & Sains:** Nyamuk ber-Wolbachia (Yogyakarta, Indonesia), AlphaFold struktur protein (Inggris), Drone medis Zipline (Rwanda), Skrining TBC Qure.ai (India), Verifikasi obat mPedigree (Ghana)\n* **Pendidikan:** Pembelajaran adaptif Mindspark (India) & Tablet matematika onebillion (Malawi)\n* **Kebencanaan:** Pemetaan banjir PetaBencana (DKI Jakarta, Indonesia) & Peramalan banjir Google Flood Hub (Bangladesh)\n* **Inklusi Sosial:** Bantuan satelit Novissi (Togo), Bantuan visual Be My Eyes (Denmark), Pemodelan bahasa Masakhane (Kenya)\n\nSilakan tanyakan studi kasus, dampak metrik, atau peran AI spesifik yang ingin Anda pelajari!`,
    caseSlugs: cases.slice(0, 3).map((c) => c.slug),
    isInContext: true,
    isFallback: true,
  };
}
