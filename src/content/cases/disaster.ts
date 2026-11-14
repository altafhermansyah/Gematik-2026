/**
 * Kasus bidang kebencanaan.
 *
 * Setiap angka di `metrics` wajib menyertakan kutipan verbatim dari sumber yang
 * tercantum di `sources`; `assertContentIntegrity()` menolak angka tanpa jejak
 * audit. Tanggal akses seluruh sumber: 2026-10-25.
 */

import type { CaseStudy } from "@/modules/content/types";

const ACCESSED_AT = "2026-10-25";

export const disasterCases = [
  {
    slug: "petabencana-flood-crowdsourcing",
    domainSlug: "disaster",
    status: "PUBLISHED",
    featured: true,
    title: {
      id: "PetaBencana.id: Pemetaan Banjir Berbasis Bot AI & Crowdsourcing di Indonesia",
      en: "PetaBencana.id: AI-Assisted Crowdsourced Flood Mapping in Indonesia",
    },
    summary: {
      id: "Platform sumber terbuka milik Yayasan Peta Bencana yang memanfaatkan bot percakapan multi-kanal untuk mengumpulkan laporan banjir warga dan menampilkannya pada peta waktu nyata bersama BNPB.",
      en: "An open-source platform by Yayasan Peta Bencana that uses multi-channel conversational bots to gather citizen flood reports and map them in real time alongside BNPB.",
    },
    problem: {
      id: "Saat banjir besar melanda kawasan padat seperti Jabodetabek, tinggi genangan dan akses jalan berubah dari menit ke menit. Sensor fisik terbatas jumlahnya, sementara ribuan laporan warga di media sosial dan aplikasi pesan tidak terstruktur sehingga sulit diverifikasi cepat oleh petugas darurat.",
      en: "When major floods hit densely populated areas like Greater Jakarta, water depth and road access change minute by minute. Physical gauges are sparse, while thousands of citizen posts on social media and messaging apps are unstructured and hard for emergency responders to verify quickly.",
    },
    solution: {
      id: "Perangkat lunak CogniCity pada PetaBencana.id mendengarkan kata kunci bencana di media sosial dan aplikasi pesan (X/Twitter, Telegram, WhatsApp), lalu mengarahkan bot BencanaBot untuk membalas warga secara otomatis dengan tautan formulir pelaporan geospasial dan foto tinggi banjir.",
      en: "CogniCity software behind PetaBencana.id listens for hazard keywords across social media and messaging channels (X/Twitter, Telegram, WhatsApp) and dispatches BencanaBot to automatically reply with a geotagged reporting card for water depth and photos.",
    },
    aiRole: {
      id: "Pemrosesan bahasa alami (NLP) menyaring unggahan publik terkait banjir dan mengekstrak sinyal lokasi awal, lalu alur percakapan terotomatisasi (human-in-the-loop crowdsourcing) meminta konfirmasi titik koordinat serta tinggi air dari warga di lapangan.",
      en: "Natural language processing filters public flood-related posts and extracts initial location signals, then an automated conversational workflow (human-in-the-loop crowdsourcing) prompts residents on the ground to confirm coordinates and water height.",
    },
    impact: {
      id: "Saat banjir besar Jabodetabek pada Januari 2020, aktivitas pelaporan di PetaBencana.id melonjak 24.000% dalam kurang dari 24 jam, dan peta publiknya dilihat lebih dari 259.000 kali oleh warga serta instansi penanggulangan bencana untuk koordinasi evakuasi.",
      en: "During the severe January 2020 Greater Jakarta floods, reporting activity on PetaBencana.id surged by 24,000% in under 24 hours, and its live public map was viewed over 259,000 times by residents and disaster agencies coordinating evacuations.",
    },
    metrics: [
      {
        label: {
          id: "Lonjakan aktivitas platform saat banjir Jakarta Jan 2020",
          en: "Platform activity surge during Jan 2020 Jakarta floods",
        },
        value: 24000,
        unit: { id: "%", en: "%" },
        quote:
          "During the January 2020 floods in Greater Jakarta, PetaBencana.id saw a 24,000% increase in platform activity in less than 24 hours, with more than 259,000 map views by residents and emergency agencies.",
        sourceUrl:
          "https://oecd-opsi.org/innovations/petabencana-id/",
      },
      {
        label: {
          id: "Tayangan peta darurat saat banjir Jakarta Jan 2020",
          en: "Emergency map views during Jan 2020 Jakarta floods",
        },
        value: 259000,
        unit: { id: "tayangan", en: "views" },
        quote:
          "During the January 2020 floods in Greater Jakarta, PetaBencana.id saw a 24,000% increase in platform activity in less than 24 hours, with more than 259,000 map views by residents and emergency agencies.",
        sourceUrl:
          "https://oecd-opsi.org/innovations/petabencana-id/",
      },
    ],
    countryCode: "ID",
    region: "DKI Jakarta",
    lat: -6.2088,
    lng: 106.8456,
    year: 2020,
    sdgs: [11, 13],
    technologies: ["natural-language-processing", "crowdsourcing", "geospatial-mapping"],
    sources: [
      {
        title: "PetaBencana.id — Real-time disaster mapping for Indonesia",
        publisher: "Yayasan Peta Bencana",
        url: "https://petabencana.id",
        accessedAt: ACCESSED_AT,
      },
      {
        title:
          "PetaBencana.id — Harnessing social media for disaster management",
        publisher: "OECD Observatory of Public Sector Innovation (OPSI)",
        url: "https://oecd-opsi.org/innovations/petabencana-id/",
        accessedAt: ACCESSED_AT,
      },
    ],
    paths: [
      {
        pathSlug: "ai-for-impact-foundations",
        relevance: 3,
        note: {
          id: "Menunjukkan bagaimana AI yang sederhana namun dirancang bersama alur pelaporan warga jauh lebih efektif daripada model rumit tanpa verifikasi lapangan.",
          en: "Shows how lightweight AI paired with human-in-the-loop citizen verification outperforms complex models disconnected from ground truth.",
        },
      },
    ],
  },
  {
    slug: "google-flood-hub-riverine-forecasting",
    domainSlug: "disaster",
    status: "PUBLISHED",
    featured: true,
    title: {
      id: "Google Flood Hub: Prediksi Banjir Sungai Global dengan LSTM untuk Daerah Minim Alat Ukur",
      en: "Google Flood Hub: Global Riverine Flood Forecasting with LSTMs for Ungauged Basins",
    },
    summary: {
      id: "Model hidrologi berbasis jaringan saraf Long Short-Term Memory (LSTM) yang memprediksi debit sungai ekstrem hingga 5–7 hari sebelumnya di lebih dari 80 negara, termasuk daerah aliran sungai tanpa alat ukur.",
      en: "Long Short-Term Memory (LSTM) neural hydrological models that predict extreme river discharge up to 5–7 days in advance across more than 80 countries, including ungauged river basins.",
    },
    problem: {
      id: "Sebagian besar korban jiwa akibat banjir sungai terjadi di negara berkembang yang tidak memiliki jaringan alat pengukur debit air (streamflow gauges) yang memadai, sehingga sistem peringatan dini hidrologi klasik gagal memberikan prakiraan yang andal.",
      en: "Most riverine flood fatalities occur in developing nations that lack dense streamflow gauge networks, causing classical hydrological early warning systems to fail where they are needed most.",
    },
    solution: {
      id: "Tim riset banjir Google melatih model hidrologi berbasis AI menggunakan 5.680 stasiun pengukur historis serta data prakiraan cuaca dan karakteristik fisik daerah aliran sungai, lalu menyiarkan peringatan dini publik gratis melalui platform Google Flood Hub di lebih dari 80 negara.",
      en: "Google's flood forecasting research team trained AI hydrological models on 5,680 historical stream gauges alongside meteorological forecasts and basin attributes, broadcasting free public early warnings via Google Flood Hub across more than 80 countries.",
    },
    aiRole: {
      id: "Arsitektur encoder-decoder Long Short-Term Memory (LSTM) mempelajari hubungan non-linier antara curah hujan historis, prakiraan cuaca, dan karakteristik geologi DAS untuk memprediksi probabilitas debit banjir ekstrem di lokasi tanpa sensor fisik.",
      en: "An encoder-decoder Long Short-Term Memory (LSTM) architecture learns nonlinear mappings from historical precipitation, weather forecasts, and basin geology to predict extreme flood return-period probabilities in ungauged locations.",
    },
    impact: {
      id: "Studi di jurnal Nature (2024) membuktikan bahwa prediksi AI di daerah aliran sungai tanpa alat ukur dengan waktu tunggu 5 hari mencapai keandalan yang setara atau lebih baik dibandingkan prediksi hari-H (lead time 0 hari) dari sistem global terbaik sebelumnya (GloFAS).",
      en: "A 2024 Nature study demonstrated that the AI model's 5-day lead-time flood predictions in ungauged basins matched or exceeded the 0-day nowcast skill of the previous leading global operational system (GloFAS).",
    },
    metrics: [
      {
        label: {
          id: "Waktu tunggu peringatan dini yang menyamai nowcast sistem lama",
          en: "Early warning lead time matching prior system nowcasts",
        },
        value: 5,
        unit: { id: "hari", en: "days" },
        quote:
          "Flood predictions from the AI model at a 5-day lead time were as reliable as or better than 0-day predictions from a current state-of-the-art global modelling system",
        sourceUrl: "https://pmc.ncbi.nlm.nih.gov/articles/PMC10957424/",
      },
      {
        label: {
          id: "Negara yang terjangkau peringatan dini publik Flood Hub",
          en: "Countries covered by public Flood Hub early warnings",
        },
        value: 80,
        unit: { id: "negara", en: "countries" },
        quote:
          "The model shown here has been incorporated into an operational early warning system that produces publicly available (free and open) forecasts in real time in over 80 countries.",
        sourceUrl: "https://pmc.ncbi.nlm.nih.gov/articles/PMC10957424/",
      },
      {
        label: {
          id: "Stasiun ukur sungai dalam pengujian lintas-validasi",
          en: "Streamflow gauges in cross-validation testing",
        },
        value: 5680,
        unit: { id: "stasiun", en: "gauges" },
        quote:
          "We tested our AI model using out-of-sample cross-validation on a comprehensive global dataset of 5,680 stream gauges.",
        sourceUrl: "https://pmc.ncbi.nlm.nih.gov/articles/PMC10957424/",
      },
    ],
    countryCode: "BD",
    region: "Dhaka, Brahmaputra-Ganges Basin",
    lat: 23.8103,
    lng: 90.4125,
    year: 2024,
    sdgs: [11, 13],
    technologies: ["deep-learning", "time-series-forecasting", "hydrology"],
    sources: [
      {
        title: "Global prediction of extreme floods in ungauged watersheds",
        publisher: "Nature (PubMed Central)",
        url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC10957424/",
        accessedAt: ACCESSED_AT,
      },
      {
        title: "Google Flood Hub — Early flood forecasting platform",
        publisher: "Google Research",
        url: "https://sites.research.google/floods/",
        accessedAt: ACCESSED_AT,
      },
    ],
    paths: [
      {
        pathSlug: "ai-for-impact-foundations",
        relevance: 3,
        note: {
          id: "Studi kasus penting tentang validasi silang luar-sampel (out-of-sample cross-validation) agar model tidak sekadar menghafal lokasi pelatihan.",
          en: "A landmark case study on out-of-sample spatial cross-validation so models generalize to unseen locations.",
        },
      },
    ],
  },
] as const satisfies readonly CaseStudy[];
