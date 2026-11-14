/**
 * Kasus bidang iklim dan lingkungan.
 *
 * Setiap angka di `metrics` wajib menyertakan kutipan verbatim dari sumber yang
 * tercantum di `sources`; `assertContentIntegrity()` menolak angka tanpa jejak
 * audit. Tanggal akses seluruh sumber: 2026-10-25.
 */

import type { CaseStudy } from "@/modules/content/types";

const ACCESSED_AT = "2026-10-25";

export const climateCases = [
  {
    slug: "rainforest-connection-forest-listening",
    domainSlug: "climate",
    status: "PUBLISHED",
    featured: true,
    title: {
      id: "Rainforest Connection: Pemantauan Bioakustik Hutan Sumatra Barat",
      en: "Rainforest Connection: Bioacoustic Forest Monitoring in West Sumatra",
    },
    summary: {
      id: "Perangkat Guardian bertenaga surya yang dipasang di kanopi hutan Sumatra Barat untuk mendeteksi suara gergaji mesin dan aktivitas pembalakan liar secara waktu nyata.",
      en: "Solar-powered Guardian devices mounted in the forest canopy of West Sumatra to detect chainsaw sounds and illegal logging activity in real time.",
    },
    problem: {
      id: "Penebangan liar sulit dideteksi di hutan hujan tropis yang luas dan berbukit di Sumatra Barat. Patroli darat sering tiba setelah pohon ditebang, sedangkan citra satelit optik terhalang awan dan baru memperlihatkan pembukaan lahan setelah kanopi rusak.",
      en: "Illegal logging is difficult to detect across vast, rugged tropical rainforests in West Sumatra. Ground patrols often arrive after trees are felled, while optical satellite imagery is blocked by cloud cover and only reveals clearing after canopy loss.",
    },
    solution: {
      id: "Bersama KKI Warsi dan masyarakat adat pemegang hak Hutan Nagari di Kabupaten Solok dan Solok Selatan, Rainforest Connection memasang perangkat Guardian bertenaga surya di puncak pohon. Rekaman audio hutan dikirim lewat jaringan seluler ke cloud untuk dianalisis, lalu peringatan dikirim ke aplikasi ponsel penjaga hutan.",
      en: "Together with KKI Warsi and indigenous Hutan Nagari stewards in Solok and South Solok regencies, Rainforest Connection mounted solar-powered Guardian devices high in the canopy. Forest audio streams over cellular networks to the cloud for analysis, sending alerts to rangers' mobile phones.",
    },
    aiRole: {
      id: "Model klasifikasi audio berbasis pembelajaran mendalam (convolutional neural networks pada spektrogram audio) memisahkan deru gergaji mesin, tembakan, dan kendaraan dari suara alami hutan serta satwa liar.",
      en: "Deep learning audio classification models (convolutional neural networks over audio spectrograms) separate chainsaw noise, gunshots, and vehicles from natural forest ambiance and wildlife calls.",
    },
    impact: {
      id: "Pada peluncuran program di Sumatra Barat tahun 2019, 12 perangkat Guardian dipasang pada ketinggian sekitar 30 meter di atas permukaan tanah untuk membantu masyarakat lokal dan KKI Warsi menjaga lima kawasan hutan adat dari pembalakan liar.",
      en: "In the 2019 West Sumatra deployment, 12 Guardian devices were mounted roughly 30 meters above the ground to help local communities and KKI Warsi protect five customary forest areas from illegal logging.",
    },
    metrics: [
      {
        label: {
          id: "Perangkat pemantau Guardian di Sumatra Barat",
          en: "Guardian monitoring devices in West Sumatra",
        },
        value: 12,
        unit: { id: "perangkat", en: "devices" },
        quote:
          "Twelve tracking devices, called Guardians, have been installed on trees some 30 meters above the ground in five forests in Solok and South Solok districts.",
        sourceUrl:
          "https://en.antaranews.com/news/128725/google-supports-indonesian-ngos-effort-to-combat-illegal-logging",
      },
      {
        label: {
          id: "Ketinggian pemasangan di kanopi pohon",
          en: "Canopy mounting height on trees",
        },
        value: 30,
        unit: { id: "meter", en: "meters" },
        quote:
          "Twelve tracking devices, called Guardians, have been installed on trees some 30 meters above the ground in five forests in Solok and South Solok districts.",
        sourceUrl:
          "https://en.antaranews.com/news/128725/google-supports-indonesian-ngos-effort-to-combat-illegal-logging",
      },
      {
        label: {
          id: "Kawasan hutan yang dipantau di Solok & Solok Selatan",
          en: "Forest areas monitored in Solok & South Solok",
        },
        value: 5,
        unit: { id: "kawasan hutan", en: "forest areas" },
        quote:
          "Twelve tracking devices, called Guardians, have been installed on trees some 30 meters above the ground in five forests in Solok and South Solok districts.",
        sourceUrl:
          "https://en.antaranews.com/news/128725/google-supports-indonesian-ngos-effort-to-combat-illegal-logging",
      },
    ],
    countryCode: "ID",
    region: "Solok Selatan, Sumatra Barat",
    lat: -1.4833,
    lng: 101.25,
    year: 2019,
    sdgs: [13, 15],
    technologies: ["audio-classification", "bioacoustics", "iot"],
    sources: [
      {
        title: "Rainforest Connection — Acoustic monitoring for forest protection",
        publisher: "Rainforest Connection (RFCx)",
        url: "https://rfcx.org",
        accessedAt: ACCESSED_AT,
      },
      {
        title:
          "Google supports Indonesian NGO's effort to combat illegal logging",
        publisher: "ANTARA News",
        url: "https://en.antaranews.com/news/128725/google-supports-indonesian-ngos-effort-to-combat-illegal-logging",
        accessedAt: ACCESSED_AT,
      },
      {
        title:
          "Smartphones used to combat illegal logging in Indonesian rainforest",
        publisher: "IUCN National Committee of the Netherlands (IUCN NL)",
        url: "https://www.iucn.nl/en/news/smartphones-used-to-combat-illegal-logging-in-indonesian-rainforest/",
        accessedAt: ACCESSED_AT,
      },
    ],
    paths: [
      {
        pathSlug: "ai-for-impact-foundations",
        relevance: 3,
        note: {
          id: "Klasifikasi audio dan evaluasi false-positive di lapangan adalah inti dari sistem deteksi ini.",
          en: "Audio classification and evaluating field false-positives are at the core of this detection system.",
        },
      },
    ],
  },
  {
    slug: "global-fishing-watch-dark-vessels",
    domainSlug: "climate",
    status: "PUBLISHED",
    featured: true,
    title: {
      id: "Global Fishing Watch: Peta Satelit & AI untuk Melacak Kapal Gelap",
      en: "Global Fishing Watch: Satellite & AI Mapping of Dark Vessels at Sea",
    },
    summary: {
      id: "Penggabungan citra radar dan optik satelit Sentinel dengan jaringan saraf konvolusional untuk memetakan kapal penangkap ikan industri yang tidak menyiarkan posisi AIS.",
      en: "Combining Sentinel satellite radar and optical imagery with convolutional neural networks to map industrial fishing vessels that do not broadcast AIS positions.",
    },
    problem: {
      id: "Sebagian besar kapal penangkap ikan industri tidak diwajibkan atau sengaja mematikan sistem identifikasi otomatis (AIS), sehingga aktivitas penangkapan ikan berlebih dan pelanggaran kawasan konservasi laut luput dari pantauan publik.",
      en: "Many industrial fishing vessels are not required to carry or intentionally disable Automatic Identification System (AIS) transponders, leaving overfishing and marine reserve incursions hidden from public view.",
    },
    solution: {
      id: "Global Fishing Watch dan peneliti mitra memadukan data GPS dengan citra radar bukaan sintetis (SAR) serta citra optik dari konstelasi satelit Eropa Sentinel-1 dan Sentinel-2 (2017–2021) di perairan pesisir enam benua untuk mendeteksi kapal dan infrastruktur lepas pantai.",
      en: "Global Fishing Watch and partner researchers fused GPS data with synthetic aperture radar (SAR) and optical imagery from the European Sentinel-1 and Sentinel-2 constellations (2017–2021) across coastal waters on six continents to detect vessels and offshore structures.",
    },
    aiRole: {
      id: "Tiga model deep learning terpisah mengidentifikasi keberadaan kapal dari pantulan radar, memperkirakan panjang kapal, serta mengklasifikasikan kapal penangkap ikan versus kapal non-penangkap ikan dan struktur lepas pantai.",
      en: "Three deep learning models detect vessel presence from radar backscatter, estimate vessel length, and classify fishing vessels versus non-fishing vessels and fixed offshore infrastructure.",
    },
    impact: {
      id: "Studi di jurnal Nature (2024) mengungkapkan bahwa 72–76% kapal penangkap ikan industri dunia dan 21–30% kapal energi serta transportasi tidak terlacak oleh sistem pelacakan publik, sekaligus memetakan sekitar 28.000 struktur lepas pantai.",
      en: "The 2024 Nature study revealed that 72–76% of the world's industrial fishing vessels and 21–30% of transport and energy vessels are not publicly tracked, while mapping roughly 28,000 offshore structures.",
    },
    metrics: [
      {
        label: {
          id: "Kapal ikan industri yang tidak terlacak publik (batas atas)",
          en: "Industrial fishing vessels not publicly tracked (upper bound)",
        },
        value: 76,
        unit: { id: "%", en: "%" },
        quote:
          "We find that 72–76% of the world’s industrial fishing vessels are not publicly tracked, with much of that fishing taking place around South Asia, Southeast Asia and Africa.",
        sourceUrl: "https://pmc.ncbi.nlm.nih.gov/articles/PMC10764273/",
      },
      {
        label: {
          id: "Kapal transportasi & energi yang tidak terlacak publik (batas atas)",
          en: "Transport & energy vessels not publicly tracked (upper bound)",
        },
        value: 30,
        unit: { id: "%", en: "%" },
        quote:
          "We also find that 21–30% of transport and energy vessel activity is missing from public tracking systems.",
        sourceUrl: "https://pmc.ncbi.nlm.nih.gov/articles/PMC10764273/",
      },
      {
        label: {
          id: "Struktur lepas pantai yang terpetakan (2021)",
          en: "Offshore structures mapped (2021)",
        },
        value: 28000,
        unit: { id: "struktur", en: "structures" },
        quote:
          "Holdings of offshore infrastructure numbered roughly 28,000 structures by the end of 2021, with wind turbines outnumbering oil structures globally and growing faster.",
        sourceUrl: "https://pmc.ncbi.nlm.nih.gov/articles/PMC10764273/",
      },
    ],
    countryCode: "US",
    region: "Washington, D.C. (Global Coastal Waters)",
    lat: 38.9059,
    lng: -77.0431,
    year: 2024,
    sdgs: [13, 14],
    technologies: ["computer-vision", "satellite-imagery", "synthetic-aperture-radar"],
    sources: [
      {
        title:
          "Satellite mapping reveals extensive industrial activity at sea",
        publisher: "Nature (PubMed Central)",
        url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC10764273/",
        accessedAt: ACCESSED_AT,
      },
      {
        title: "Global Fishing Watch — Open Ocean Data Platform",
        publisher: "Global Fishing Watch",
        url: "https://globalfishingwatch.org",
        accessedAt: ACCESSED_AT,
      },
    ],
    paths: [
      {
        pathSlug: "ai-for-impact-foundations",
        relevance: 3,
        note: {
          id: "Contoh nyata penggabungan penginderaan jauh satelit dengan klasifikasi citra berskala global.",
          en: "A concrete example of combining satellite remote sensing with global-scale image classification.",
        },
      },
    ],
  },
] as const satisfies readonly CaseStudy[];
