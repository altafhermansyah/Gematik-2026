/**
 * Kasus bidang inklusi sosial.
 *
 * Setiap angka di `metrics` wajib menyertakan kutipan verbatim dari sumber yang
 * tercantum di `sources`; `assertContentIntegrity()` menolak angka tanpa jejak
 * audit. Tanggal akses seluruh sumber: 2026-10-25.
 */

import type { CaseStudy } from "@/modules/content/types";

const ACCESSED_AT = "2026-10-25";

export const inclusionCases = [
  {
    slug: "togo-novissi-satellite-aid-targeting",
    domainSlug: "inclusion",
    status: "PUBLISHED",
    featured: true,
    title: {
      id: "Novissi Togo: Penyaluran Bantuan Tunai Darurat dengan Citra Satelit & Machine Learning",
      en: "Togo Novissi: Targeting Emergency Cash Transfers with Satellite Imagery & Machine Learning",
    },
    summary: {
      id: "Pemerintah Togo bersama peneliti UC Berkeley dan GiveDirectly memadukan citra satelit resolusi tinggi dan metadata jaringan seluler untuk memprioritaskan bantuan tunai nirsentuh bagi warga termiskin saat pandemi COVID-19.",
      en: "The Government of Togo, UC Berkeley researchers, and GiveDirectly combined high-resolution satellite imagery and mobile phone metadata to prioritize contactless cash transfers for the poorest citizens during COVID-19.",
    },
    problem: {
      id: "Ketika pembatasan sosial pandemi diberlakukan pada 2020, jutaan pekerja sektor informal di Togo kehilangan penghasilan harian. Namun pemerintah tidak memiliki basis data sosial-ekonomi rumah tangga yang mutakhir untuk mengidentifikasi kantong kemiskinan ekstrem dan pemilik ponsel berpenghasilan terendah.",
      en: "When pandemic lockdowns hit in 2020, millions of informal workers in Togo lost their daily income. Yet the government lacked an up-to-date household socioeconomic registry to identify the poorest villages and lowest-income mobile subscribers.",
    },
    solution: {
      id: "Melalui program Novissi, pemerintah menyalurkan bantuan tunai uang seluler dua mingguan lewat menu USSD tanpa internet. Untuk memperluas cakupan ke pedesaan, tim memetakan tingkat kemiskinan mikro dari citra satelit untuk memilih 100 kanton termiskin, lalu memperkirakan konsumsi individu dari pola panggilan/data seluler.",
      en: "Through the Novissi platform, the government delivered bi-weekly mobile money transfers via internet-free USSD menus. To expand to rural areas, the team mapped micro-region poverty from satellite imagery to select the 100 poorest cantons, then estimated individual consumption from mobile phone metadata.",
    },
    aiRole: {
      id: "Jaringan saraf konvolusional mengekstrak fitur infrastruktur (atap bangunan, jalan, lahan pertanian) dari citra satelit untuk memprediksi kemiskinan wilayah, sementara model gradient boosting memprediksi tingkat konsumsi rumah tangga dari metadata penggunaan telepon seluler yang dianonimkan.",
      en: "Convolutional neural networks extract infrastructure features (roofing, roads, farmland) from satellite imagery to predict regional poverty, while gradient-boosted trees estimate household consumption from anonymized mobile network metadata.",
    },
    impact: {
      id: "Evaluasi di jurnal Nature (2022) menunjukkan bahwa pendekatan penargetan berbasis citra satelit dan data ponsel menekan kesalahan eksklusi (warga miskin yang terlewat) sebesar 4–21% dibandingkan metode penargetan geografis atau pekerjaan yang tersedia saat itu.",
      en: "An evaluation in Nature (2022) showed that the satellite and phone-data targeting approach reduced errors of exclusion (true poor missed by the program) by 4–21% relative to feasible geographic or occupation-based targeting alternatives.",
    },
    metrics: [
      {
        label: {
          id: "Penurunan kesalahan eksklusi warga miskin (batas atas)",
          en: "Reduction in exclusion errors of poor citizens (upper bound)",
        },
        value: 21,
        unit: { id: "%", en: "%" },
        quote:
          "Relative to the other feasible targeting approaches considered by the government, this method reduces errors of exclusion by 4–21%.",
        sourceUrl: "https://pmc.ncbi.nlm.nih.gov/articles/PMC8967719/",
      },
      {
        label: {
          id: "Nilai bantuan tunai dua mingguan untuk penerima perempuan",
          en: "Bi-weekly cash transfer amount for female beneficiaries",
        },
        value: 10,
        unit: { id: "USD", en: "USD" },
        quote:
          "Eligible beneficiaries received bi-weekly payments of roughly US$10 for women and US$8.50 for men.",
        sourceUrl: "https://pmc.ncbi.nlm.nih.gov/articles/PMC8967719/",
      },
    ],
    countryCode: "TG",
    region: "Lomé & Rural Cantons",
    lat: 6.1375,
    lng: 1.2123,
    year: 2022,
    sdgs: [1, 10],
    technologies: ["satellite-imagery", "machine-learning", "mobile-money-ussd"],
    sources: [
      {
        title:
          "Machine learning and phone data can improve targeting of humanitarian aid",
        publisher: "Nature (PubMed Central)",
        url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC8967719/",
        accessedAt: ACCESSED_AT,
      },
      {
        title: "Novissi — Togo's 100% digital cash transfer program",
        publisher: "République Togolaise",
        url: "https://novissi.gouv.tg/en/home-new-en/",
        accessedAt: ACCESSED_AT,
      },
    ],
    paths: [
      {
        pathSlug: "ai-for-impact-foundations",
        relevance: 3,
        note: {
          id: "Kasus penting untuk mempelajari etika AI, bias penargetan, dan keterbatasan model prediktif dalam kebijakan sosial.",
          en: "A vital case for studying AI ethics, targeting bias, and the limits of predictive models in social policy.",
        },
      },
    ],
  },
  {
    slug: "be-my-eyes-visual-assistance",
    domainSlug: "inclusion",
    status: "PUBLISHED",
    featured: true,
    title: {
      id: "Be My Eyes: Asistensi Visual Sukarelawan & AI Multimodal untuk Penyandang Tunanetra",
      en: "Be My Eyes: Volunteer & Multimodal AI Visual Assistance for Blind and Low-Vision People",
    },
    summary: {
      id: "Platform seluler asal Denmark yang menghubungkan penyandang tunanetra dan kurang awas dengan jutaan sukarelawan melalui panggilan video langsung serta asisten AI multimodal Be My AI.",
      en: "A Danish mobile platform connecting blind and low-vision users with millions of sighted volunteers via live video calls alongside the multimodal Be My AI assistant.",
    },
    problem: {
      id: "Lebih dari 340 juta penyandang tunanetra dan kurang awas (low vision) di seluruh dunia kerap menghadapi hambatan aksesibilitas dalam tugas sehari-hari yang membutuhkan informasi visual cepat—seperti membaca tanggal kedaluwarsa obat, papan petunjuk, atau layar alat rumah tangga.",
      en: "Over 340 million blind and low-vision people worldwide routinely face accessibility barriers in everyday tasks requiring quick visual confirmation—such as reading medicine expiry dates, street signs, or appliance displays.",
    },
    solution: {
      id: "Diluncurkan dari Aarhus, Denmark pada 2015 oleh Hans Jørgen Wiberg, Be My Eyes memasangkan pengguna tunanetra dengan sukarelawan awas berdasarkan bahasa dan zona waktu dalam lebih dari 180 bahasa, serta mengintegrasikan Be My AI untuk mendeskripsikan foto secara instan dan memungkinkan pengguna mengajukan pertanyaan lanjutan.",
      en: "Launched out of Aarhus, Denmark in 2015 by Hans Jørgen Wiberg, Be My Eyes pairs blind users with sighted volunteers by language and time zone across more than 180 languages, and integrates Be My AI to instantly describe images and answer follow-up questions.",
    },
    aiRole: {
      id: "Model visi-bahasa multimodal (vision-language model pada fitur Be My AI) menghasilkan deskripsi visual terperinci dan percakapan tanya-jawab kontekstual dari foto kamera, sementara pengguna tetap dapat meneruskan panggilan ke sukarelawan manusia kapan saja jika membutuhkan verifikasi.",
      en: "A multimodal vision-language model (powering Be My AI) generates detailed visual descriptions and interactive Q&A from camera snapshots, while users can escalate to a human volunteer at any time for safety verification.",
    },
    impact: {
      id: "Dalam 24 jam pertama peluncurannya pada Januari 2015, Be My Eyes telah menjaring lebih dari 10.000 sukarelawan, dan kini melayani komunitas global dalam lebih dari 180 bahasa untuk meningkatkan kemandirian sehari-hari.",
      en: "Within the first 24 hours of its January 2015 launch, Be My Eyes attracted over 10,000 volunteers, and today operates across more than 180 languages to support everyday independence.",
    },
    metrics: [
      {
        label: {
          id: "Populasi penyandang tunanetra & low vision yang disasar global",
          en: "Global blind and low-vision population addressed",
        },
        value: 340000000,
        unit: { id: "orang", en: "people" },
        quote:
          "Our mission is to make the world more accessible for the 340 million people who are blind or have low vision.",
        sourceUrl: "https://www.bemyeyes.com/about",
      },
      {
        label: {
          id: "Bahasa yang didukung oleh jaringan sukarelawan & aplikasi",
          en: "Languages supported across the volunteer network & app",
        },
        value: 180,
        unit: { id: "bahasa", en: "languages" },
        quote:
          "Available in over 180 languages, our app is the largest online community for people who are blind or have low vision.",
        sourceUrl: "https://www.bemyeyes.com/about",
      },
      {
        label: {
          id: "Sukarelawan yang bergabung dalam 24 jam pertama peluncuran",
          en: "Volunteers signed up within 24 hours of launch",
        },
        value: 10000,
        unit: { id: "sukarelawan", en: "volunteers" },
        quote:
          "Within 24 hours of launching in January 2015, Be My Eyes had more than 10,000 users.",
        sourceUrl: "https://www.bemyeyes.com/about",
      },
    ],
    countryCode: "DK",
    region: "Aarhus",
    lat: 56.1629,
    lng: 10.2039,
    year: 2015,
    sdgs: [10, 3],
    technologies: ["vision-language-models", "assistive-technology", "crowdsourcing"],
    sources: [
      {
        title: "About Be My Eyes — Our Story and Mission",
        publisher: "Be My Eyes",
        url: "https://www.bemyeyes.com/about",
        accessedAt: ACCESSED_AT,
      },
    ],
    paths: [
      {
        pathSlug: "ai-for-impact-foundations",
        relevance: 2,
        note: {
          id: "Contoh desain Responsible AI: menyediakan jalur eskalasi langsung ke sukarelawan manusia ketika AI menghadapi tugas berisiko.",
          en: "A model of Responsible AI design: providing a seamless escalation path to human volunteers when AI faces high-stakes visual tasks.",
        },
      },
    ],
  },
  {
    slug: "masakhane-african-languages-nlp",
    domainSlug: "inclusion",
    status: "PUBLISHED",
    featured: false,
    title: {
      id: "Masakhane: Riset Partisipatif Penerjemahan Mesin untuk Bahasa-Bahasa Afrika",
      en: "Masakhane: Participatory Machine Translation Research for African Languages",
    },
    summary: {
      id: "Komunitas riset akar rumput lintas Afrika yang membangun dataset, tolok ukur, dan model penerjemahan mesin saraf sumber terbuka untuk puluhan bahasa Afrika yang kurang terwakili.",
      en: "A pan-African grassroots research community building open-source datasets, benchmarks, and neural machine translation models for dozens of underrepresented African languages.",
    },
    problem: {
      id: "Meskipun benua Afrika memiliki lebih dari 2.000 bahasa yang digunakan ratusan juta orang dalam layanan kesehatan, pendidikan, dan informasi publik, sebagian besar bahasa tersebut hampir tidak memiliki korpus digital berlabel sehingga terpinggirkan dari kemajuan teknologi bahasa modern.",
      en: "Although Africa is home to over 2,000 languages spoken by hundreds of millions in healthcare, education, and civic life, most have little labeled digital text and are left out of modern language technology.",
    },
    solution: {
      id: "Masakhane menggabungkan peneliti lokal, penutur jati, kurator data, dan mahasiswa dari lebih dari 30 negara untuk melatih serta mengevaluasi model penerjemahan mesin saraf (Neural Machine Translation) secara kolaboratif menggunakan buku catatan terbuka dan evaluasi penutur asli.",
      en: "Masakhane brings together local researchers, native speakers, data curators, and students across more than 30 countries to collaboratively train and evaluate Neural Machine Translation models using open notebooks and native-speaker human evaluation.",
    },
    aiRole: {
      id: "Model penerjemahan mesin berbasis arsitektur Transformer dilatih pada korpus paralel sumber daya rendah (low-resource NLP), dipadukan dengan kurasi data partisipatif dan evaluasi kualitas terjemahan oleh penutur jati.",
      en: "Transformer-based neural machine translation models are trained on low-resource parallel corpora, paired with participatory data curation and native-speaker translation quality evaluation.",
    },
    impact: {
      id: "Karya fondasional Masakhane yang memenangkan Wikimedia Foundation Research Award dan diterbitkan di Findings of EMNLP (2020) berhasil menerbitkan tolok ukur penerjemahan mesin terbuka untuk lebih dari 30 bahasa Afrika oleh kontributor dari lebih dari 30 negara.",
      en: "Masakhane's foundational work—winner of the Wikimedia Foundation Research Award and published in Findings of EMNLP (2020)—produced open machine translation benchmarks for over 30 African languages built by contributors from over 30 countries.",
    },
    metrics: [
      {
        label: {
          id: "Bahasa Afrika dengan tolok ukur penerjemahan mesin terbuka",
          en: "African languages with open machine translation benchmarks",
        },
        value: 30,
        unit: { id: "bahasa", en: "languages" },
        quote:
          "Over the course of a year, the community has grown to include participants from over 30 countries across the globe, contributing to the creation of machine translation benchmarks for over 30 African languages.",
        sourceUrl: "https://aclanthology.org/2020.findings-emnlp.195/",
      },
      {
        label: {
          id: "Negara asal kontributor riset partisipatif",
          en: "Countries represented by participatory research contributors",
        },
        value: 30,
        unit: { id: "negara", en: "countries" },
        quote:
          "Over the course of a year, the community has grown to include participants from over 30 countries across the globe, contributing to the creation of machine translation benchmarks for over 30 African languages.",
        sourceUrl: "https://aclanthology.org/2020.findings-emnlp.195/",
      },
    ],
    countryCode: "KE",
    region: "Nairobi (Pan-African Network)",
    lat: -1.2921,
    lng: 36.8219,
    year: 2020,
    sdgs: [10, 4],
    technologies: ["natural-language-processing", "machine-translation", "open-data"],
    sources: [
      {
        title: "Participatory Research for Low-resourced Machine Translation: A Case Study in African Languages",
        publisher: "Findings of the Association for Computational Linguistics: EMNLP 2020",
        url: "https://aclanthology.org/2020.findings-emnlp.195/",
        accessedAt: ACCESSED_AT,
      },
      {
        title: "Masakhane — Strengthening NLP for African Languages",
        publisher: "Masakhane NLP Community",
        url: "https://www.masakhane.io",
        accessedAt: ACCESSED_AT,
      },
    ],
    paths: [
      {
        pathSlug: "ai-for-impact-foundations",
        relevance: 2,
        note: {
          id: "Menunjukkan bagaimana keterlibatan komunitas penutur jati mengatasi bias data dan kelangkaan korpus pada NLP bahasa daerah.",
          en: "Shows how native-speaker community participation overcomes dataset bias and corpus scarcity in regional-language NLP.",
        },
      },
    ],
  },
] as const satisfies readonly CaseStudy[];
