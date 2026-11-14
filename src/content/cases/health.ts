/**
 * Kasus bidang kesehatan.
 *
 * Setiap angka di `metrics` wajib menyertakan kutipan verbatim dari sumber yang
 * tercantum di `sources`; `assertContentIntegrity()` menolak angka tanpa jejak
 * audit. Tanggal akses seluruh sumber: 2026-10-25.
 */

import type { CaseStudy } from "@/modules/content/types";

const ACCESSED_AT = "2026-10-25";

export const healthCases = [
  {
    slug: "alphafold-protein-structure-prediction",
    domainSlug: "health",
    status: "PUBLISHED",
    featured: true,
    title: {
      id: "AlphaFold: Prediksi Struktur Protein dengan AI untuk Riset Kesehatan",
      en: "AlphaFold: AI Protein Structure Prediction for Health Research",
    },
    summary: {
      id: "Sistem AI dari Google DeepMind dan EMBL-EBI yang memprediksi bentuk tiga dimensi protein dari urutan asam aminonya, lalu membuka hasilnya gratis untuk peneliti dunia.",
      en: "An AI system from Google DeepMind and EMBL-EBI that predicts a protein's three-dimensional shape from its amino-acid sequence, then releases the results free to researchers worldwide.",
    },
    problem: {
      id: "Bentuk tiga dimensi protein menentukan cara kerjanya, sehingga mengetahuinya penting untuk memahami penyakit dan merancang obat. Namun metode eksperimen membutuhkan waktu berbulan-bulan hingga bertahun-tahun untuk satu protein, sehingga hanya sebagian kecil protein yang strukturnya diketahui.",
      en: "A protein's three-dimensional shape determines how it works, so knowing it matters for understanding disease and designing drugs. But experimental methods take months to years per protein, so only a small fraction of known proteins have had their structures solved.",
    },
    solution: {
      id: "AlphaFold memakai jaringan saraf untuk memprediksi koordinat atom protein berdasarkan urutan asam amino dan pola evolusi dari protein terkait. Google DeepMind dan EMBL-EBI merilis hasilnya secara terbuka melalui AlphaFold Protein Structure Database, yang bisa dicari dan diunduh gratis.",
      en: "AlphaFold uses neural networks to predict a protein's atomic coordinates from its amino acid sequence and evolutionary patterns in related proteins. Google DeepMind and EMBL-EBI release the results openly through the AlphaFold Protein Structure Database, which can be searched and downloaded for free.",
    },
    aiRole: {
      id: "AI berperan sebagai mesin prediksi: model pembelajaran mendalam menghasilkan struktur beserta skor keyakinan per residu, sehingga peneliti tahu bagian mana yang dapat dipercaya. Prediksi ini melengkapi, bukan menggantikan, penentuan struktur lewat eksperimen.",
      en: "AI is the prediction engine: a deep learning model outputs a structure together with per-residue confidence scores, so researchers know which parts to trust. These predictions complement, rather than replace, experimental structure determination.",
    },
    impact: {
      id: "Basis data AlphaFold telah dipakai lebih dari tiga juta orang di lebih dari 190 negara. Pada uji CASP14, akurasi tulang punggung median AlphaFold mencapai 0,96 Å, jauh lebih baik daripada metode terbaik berikutnya.",
      en: "The AlphaFold Database has been used by more than three million people in over 190 countries. In the CASP14 assessment, AlphaFold's median backbone accuracy reached 0.96 Å, far better than the next best method.",
    },
    metrics: [
      {
        label: {
          id: "Prediksi struktur protein dalam basis data",
          en: "Protein structure predictions in the database",
        },
        value: 200000000,
        unit: { id: "struktur", en: "structures" },
        quote:
          "we’ve released over 200 million protein structure predictions by AlphaFold that are freely and openly available to the global scientific community",
        sourceUrl: "https://alphafold.ebi.ac.uk/about",
      },
      {
        label: {
          id: "Negara yang memakai basis data",
          en: "Countries using the database",
        },
        value: 190,
        unit: { id: "negara", en: "countries" },
        quote:
          "has been used by over three million people in over 190 countries",
        sourceUrl:
          "https://www.embl.org/news/science-technology/google-deepmind-partnership-renewal/",
      },
      {
        label: {
          id: "Akurasi tulang punggung median (CASP14)",
          en: "Median backbone accuracy (CASP14)",
        },
        value: 0.96,
        unit: { id: "Å", en: "Å" },
        quote:
          "AlphaFold structures had a median backbone accuracy of 0.96 Å r.m.s.d.95",
        sourceUrl: "https://pmc.ncbi.nlm.nih.gov/articles/PMC8371605/",
      },
    ],
    countryCode: "GB",
    region: "Hinxton, Cambridgeshire",
    lat: 52.0800838,
    lng: 0.186415,
    year: 2021,
    sdgs: [3, 9],
    technologies: ["deep-learning", "protein-structure-prediction", "open-data"],
    sources: [
      {
        title: "AlphaFold Protein Structure Database — About",
        publisher: "EMBL-EBI and Google DeepMind",
        url: "https://alphafold.ebi.ac.uk/about",
        accessedAt: ACCESSED_AT,
      },
      {
        title:
          "EMBL-EBI and Google DeepMind renew partnership and release update to AlphaFold Database",
        publisher: "EMBL",
        url: "https://www.embl.org/news/science-technology/google-deepmind-partnership-renewal/",
        accessedAt: ACCESSED_AT,
      },
      {
        title: "Highly accurate protein structure prediction with AlphaFold",
        publisher: "Nature (PubMed Central)",
        url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC8371605/",
        accessedAt: ACCESSED_AT,
      },
    ],
    paths: [
      {
        pathSlug: "ai-for-impact-foundations",
        relevance: 2,
        note: {
          id: "Kuasai dasar machine learning untuk memahami bagaimana model seperti ini dibangun dan dievaluasi.",
          en: "Learn machine learning fundamentals to understand how models like this are built and evaluated.",
        },
      },
    ],
  },
  {
    slug: "zipline-medical-drone-delivery",
    domainSlug: "health",
    status: "PUBLISHED",
    featured: true,
    title: {
      id: "Zipline: Drone Otonom Pengantar Darah dan Obat di Rwanda",
      en: "Zipline: Autonomous Drones for Blood and Medicine Delivery in Rwanda",
    },
    summary: {
      id: "Drone otonom yang mengantar darah, vaksin, dan obat dari pusat distribusi ke fasilitas kesehatan di Rwanda sejak 2016, kini bagian dari sistem kesehatan nasional.",
      en: "Autonomous drones that deliver blood, vaccines and medicines from distribution centres to health facilities in Rwanda since 2016, now part of the national health system.",
    },
    problem: {
      id: "Di daerah pedesaan, jalan rusak dan medan pegunungan membuat pengiriman darah dan obat memakan waktu berjam-jam, sehingga pasien terlambat ditangani. Ketidakpastian pasokan juga mendorong fasilitas kesehatan menumpuk obat mahal yang akhirnya terbuang.",
      en: "In rural areas, poor roads and mountainous terrain make blood and medicine deliveries take hours, delaying treatment. Uncertain supply also pushes health facilities to stockpile expensive medicines that end up being wasted.",
    },
    solution: {
      id: "Drone Zipline terbang otonom dari pusat distribusi dan menjatuhkan paket dengan parasut di titik temu dekat fasilitas kesehatan. Petugas kesehatan mengirim pesanan, lalu darah atau obat tiba dalam hitungan menit, bukan jam.",
      en: "Zipline's drones fly autonomously from a distribution centre and drop packages by parachute at meeting points near health facilities. Health workers place orders, and blood or medicines arrive in minutes rather than hours.",
    },
    aiRole: {
      id: "Ini bukan produk AI generatif: nilai utamanya ada pada perangkat keras drone, perangkat lunak penerbangan otonom, dan sistem logistik untuk menerima pesanan serta melacak pengiriman. Otomasi penerbangan dan perencanaan rute adalah inti teknologinya.",
      en: "This is not a generative-AI product: its value lies in the drone hardware, autonomous flight software, and a logistics system for taking orders and tracking deliveries. Flight automation and route planning are the core technology.",
    },
    impact: {
      id: "Menurut WHO, drone Zipline memangkas waktu pengiriman darah dari empat jam menjadi sekitar 15 menit dalam beberapa kasus. Pada 2023, Zipline mengirim 28.754 unit darah di Rwanda dengan rata-rata waktu pengiriman 25 menit.",
      en: "According to WHO, Zipline's drones cut blood delivery times from four hours to about 15 minutes in some cases. In 2023, Zipline delivered 28,754 units of blood in Rwanda with an average delivery time of 25 minutes.",
    },
    metrics: [
      {
        label: {
          id: "Waktu pengiriman darah pada kasus tercepat",
          en: "Blood delivery time in fastest cases",
        },
        value: 15,
        unit: { id: "menit", en: "minutes" },
        quote:
          "cuts blood delivery times down from four hours to just 15 minutes in some cases",
        sourceUrl:
          "https://www.who.int/news-room/feature-stories/detail/drones-take-rwandas-national-blood-service-to-new-heights",
      },
      {
        label: {
          id: "Fasilitas kesehatan dalam pilot malaria",
          en: "Health facilities in the malaria pilot",
        },
        value: 70,
        unit: { id: "fasilitas kesehatan", en: "health facilities" },
        quote:
          "autonomous drones now deliver essential malaria treatments like Artesunate on demand to 70 health facilities",
        sourceUrl:
          "https://www.zipline.com/newsroom/taking-flight-against-malaria-how-rwanda-and-zipline-are-changing-the-story",
      },
      {
        label: {
          id: "Unit darah terkirim di Rwanda (2023)",
          en: "Blood units delivered in Rwanda (2023)",
        },
        value: 28754,
        unit: { id: "unit darah", en: "blood units" },
        quote:
          "In 2023 alone, Zipline delivered 28,754 units of blood in Rwanda, with an average delivery time of 25 minutes.",
        sourceUrl:
          "https://www.newtimes.co.rw/article/38624/opinions/how-rwanda-turned-drones-into-a-development-tool/amp",
      },
    ],
    countryCode: "RW",
    region: "Muhanga, Southern Province",
    lat: -2.0845106,
    lng: 29.7528767,
    year: 2016,
    sdgs: [3, 9],
    technologies: ["autonomous-drones", "medical-logistics", "cold-chain"],
    sources: [
      {
        title:
          "Drones take Rwanda’s national blood service to new heights",
        publisher: "World Health Organization",
        url: "https://www.who.int/news-room/feature-stories/detail/drones-take-rwandas-national-blood-service-to-new-heights",
        accessedAt: ACCESSED_AT,
      },
      {
        title:
          "Taking flight against malaria: How Rwanda and Zipline are changing the story",
        publisher: "Zipline",
        url: "https://www.zipline.com/newsroom/taking-flight-against-malaria-how-rwanda-and-zipline-are-changing-the-story",
        accessedAt: ACCESSED_AT,
      },
      {
        title: "How Rwanda turned drones into a development tool",
        publisher: "The New Times (Rwanda)",
        url: "https://www.newtimes.co.rw/article/38624/opinions/how-rwanda-turned-drones-into-a-development-tool/amp",
        accessedAt: ACCESSED_AT,
      },
    ],
    paths: [],
  },
  {
    slug: "qure-ai-tuberculosis-screening",
    domainSlug: "health",
    status: "PUBLISHED",
    featured: false,
    title: {
      id: "Qure.ai: AI Pembaca Rontgen Dada untuk Skrining Tuberkulosis",
      en: "Qure.ai: AI That Reads Chest X-rays for Tuberculosis Screening",
    },
    summary: {
      id: "qXR menganalisis foto rontgen dada secara otomatis dan memberi skor kemungkinan tuberkulosis, dipakai di layanan dengan jumlah dokter radiologi terbatas.",
      en: "qXR analyses chest X-rays automatically and scores the likelihood of tuberculosis, used in services with few radiologists.",
    },
    problem: {
      id: "Tuberkulosis adalah salah satu penyakit menular paling mematikan di dunia, dan banyak kasus tidak terdiagnosis karena akses ke pemeriksaan yang memadai terbatas. India menanggung beban TB terbesar di dunia dan menyumbang lebih dari seperempat 3,8 juta kasus yang tidak terdiagnosis setiap tahun.",
      en: "Tuberculosis is one of the deadliest infectious diseases in the world, and many cases go undiagnosed because access to adequate testing is limited. India carries the world's largest TB burden and accounts for over one quarter of the 3.8 million cases that go undiagnosed each year.",
    },
    solution: {
      id: "qXR menganalisis citra rontgen dada, menandai kelainan seperti kavitas, efusi pleura, atau opasitas, lalu memberi skor TB untuk membantu petugas menyortir pasien. Perangkat lunak ini memperoleh sertifikasi CE pada 2018 dan digunakan sebagai alat bantu triase.",
      en: "qXR analyses chest X-ray images, flags abnormalities such as cavities, pleural effusion or opacities, and gives a TB score to help staff triage patients. The software received CE certification in 2018 and is used as a triage aid.",
    },
    aiRole: {
      id: "AI berperan sebagai penyaring awal: model penglihatan komputer menilai foto rontgen dan memberi skor kemungkinan TB, sementara diagnosis tetap bergantung pada uji mikrobiologi dan penilaian tenaga medis. Studi independen menilai akurasinya moderat, sehingga alat ini bukan pengganti dokter.",
      en: "AI acts as an initial filter: a computer-vision model reads the X-ray and scores the likelihood of TB, while diagnosis still depends on microbiological testing and clinical judgement. An independent study found moderate accuracy, so the tool is not a replacement for doctors.",
    },
    impact: {
      id: "Dalam studi independen di rumah sakit tersier India, qXR mencapai AUC 0,81 dan sensitivitas 71%, lebih tinggi daripada radiolog (56%) pada spesifisitas 80%. Namun kombinasi itu belum memenuhi target profil produk uji triase, sehingga qXR paling berguna sebagai penyaring awal.",
      en: "In an independent study at an Indian tertiary hospital, qXR reached an AUC of 0.81 and 71% sensitivity, higher than radiologists (56%) at 80% specificity. That combination does not yet meet the target product profile for a triage test, so qXR is most useful as an initial screen.",
    },
    metrics: [
      {
        label: {
          id: "AUC untuk TB yang dikonfirmasi mikrobiologi",
          en: "AUC for microbiologically confirmed TB",
        },
        value: 0.81,
        unit: { id: "AUC", en: "AUC" },
        quote:
          "The AUC for qXR for the detection of microbiologically-confirmed PTB was 0.81 (95% CI: 0.78, 0.84).",
        sourceUrl: "https://pmc.ncbi.nlm.nih.gov/articles/PMC6959311/",
      },
      {
        label: {
          id: "Sensitivitas qXR pada ambang optimal",
          en: "qXR sensitivity at the optimal threshold",
        },
        value: 71,
        unit: { id: "%", en: "%" },
        quote:
          "the software achieved a sensitivity and specificity of 71% (95% CI: 66%, 76%) and 80% (95% CI: 77%, 83%), respectively",
        sourceUrl: "https://pmc.ncbi.nlm.nih.gov/articles/PMC6959311/",
      },
      {
        label: {
          id: "Sensitivitas radiolog pembanding",
          en: "Sensitivity of the comparison radiologists",
        },
        value: 56,
        unit: { id: "%", en: "%" },
        quote:
          "The sensitivity and specificity of radiologists for the detection of microbiologically-confirmed PTB was 56% (95% CI: 50%, 62%)",
        sourceUrl: "https://pmc.ncbi.nlm.nih.gov/articles/PMC6959311/",
      },
    ],
    countryCode: "IN",
    region: "Mumbai, Maharashtra",
    lat: 19.1078778,
    lng: 72.8836459,
    year: 2018,
    sdgs: [3, 9],
    technologies: ["computer-vision", "medical-imaging", "tuberculosis-screening"],
    sources: [
      {
        title:
          "Deep learning, computer-aided radiography reading for tuberculosis: a diagnostic accuracy study from a tertiary hospital in India",
        publisher: "Scientific Reports (PubMed Central)",
        url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC6959311/",
        accessedAt: ACCESSED_AT,
      },
      {
        title: "qXR — AI-enabled chest X-ray reporting",
        publisher: "Qure.ai",
        url: "https://www.qure.ai/product/qxr",
        accessedAt: ACCESSED_AT,
      },
      {
        title: "Contact us — registered office, Mumbai",
        publisher: "Qure.ai",
        url: "https://www.qure.ai/contact-us",
        accessedAt: ACCESSED_AT,
      },
    ],
    paths: [
      {
        pathSlug: "ai-for-impact-foundations",
        relevance: 3,
        note: {
          id: "Evaluasi model adalah inti cerita kasus ini: sensitivitas dan spesifisitas menentukan apakah alat ini layak dipakai sebagai penyaring.",
          en: "Model evaluation is the heart of this case: sensitivity and specificity decide whether the tool is fit to be used as a screen.",
        },
      },
    ],
  },
  {
    slug: "mpedigree-medicine-authentication",
    domainSlug: "health",
    status: "PUBLISHED",
    featured: false,
    title: {
      id: "mPedigree: Verifikasi Keaslian Obat lewat SMS untuk Melawan Obat Palsu",
      en: "mPedigree: Verifying Medicine Authenticity by SMS to Fight Counterfeit Drugs",
    },
    summary: {
      id: "Kode unik di balik lapisan gosok pada kemasan obat memungkinkan pembeli memeriksa keaslian lewat SMS biasa, dimulai di Ghana pada 2007.",
      en: "A unique code under a scratch-off panel on medicine packaging lets buyers check authenticity by ordinary SMS, started in Ghana in 2007.",
    },
    problem: {
      id: "Obat palsu dan substandar membahayakan pasien, terutama di negara berpendapatan rendah dan menengah dengan pengawasan rantai pasok yang lemah. Konsumen sering tidak punya cara sederhana untuk memastikan obat yang mereka beli asli.",
      en: "Counterfeit and substandard medicines harm patients, especially in low- and middle-income countries with weak supply-chain oversight. Consumers often have no simple way to check that the medicine they bought is genuine.",
    },
    solution: {
      id: "Setiap kemasan memiliki kode unik di bawah lapisan gosok; pembeli mengirim kode itu lewat SMS gratis dan menerima balasan apakah kode tersebut terdaftar dan sah. Data verifikasi juga membantu produsen dan regulator melihat pola pemalsuan di pasar.",
      en: "Each pack has a unique code under a scratch-off panel; buyers send the code by free SMS and get a reply saying whether it is registered and genuine. The verification data also helps manufacturers and regulators spot counterfeiting patterns in the market.",
    },
    aiRole: {
      id: "Teknologi intinya adalah serialisasi kemasan, basis data kode, dan SMS, bukan AI. Perusahaan menyebut adanya lapisan sensor dan machine learning untuk analitik prediktif, tetapi fungsi utamanya tetap verifikasi kode murah yang bisa dipakai di ponsel biasa.",
      en: "The core technology is pack serialisation, a code database and SMS, not AI. The company describes sensor and machine-learning layers for predictive analytics, but the main function remains low-cost code verification that works on basic phones.",
    },
    impact: {
      id: "Skoll Foundation mencatat bahwa Nigeria kini mewajibkan pelabelan pada semua obat antimalaria dan antibiotik, dan produsen Nigeria May & Baker memakai sistem mPedigree pada tiga lini obatnya. Perusahaan melaporkan sistemnya telah menjangkau lebih dari 100 juta orang.",
      en: "The Skoll Foundation notes that Nigeria now requires labelling on all anti-malarial and antibiotic medicines, and Nigerian manufacturer May & Baker has used mPedigree's system on three of its medicine lines. The company reports reaching more than 100 million people.",
    },
    metrics: [
      {
        label: {
          id: "Orang yang terjangkau (dilaporkan perusahaan)",
          en: "People reached (company-reported)",
        },
        value: 100000000,
        unit: { id: "orang", en: "people" },
        quote:
          "Across all categories, we have impacted the lives of over 100 million people globally.",
        sourceUrl: "https://www.mpedigree.com/whatwedo/",
      },
      {
        label: {
          id: "Panjang kode verifikasi per kemasan",
          en: "Verification code length per pack",
        },
        value: 10,
        unit: { id: "digit", en: "digits" },
        quote:
          "people purchasing drugs will be able to scratch off a panel on the medication's packaging to see a 10-digit verification code",
        sourceUrl:
          "https://www.safemedicines.org/2010/11/ghanaian-company-wins-security-prize-for-anti-counterfeiting-system-48.html",
      },
    ],
    countryCode: "GH",
    region: "Accra",
    lat: 5.6123073,
    lng: -0.203837,
    year: 2007,
    sdgs: [3, 9, 16],
    technologies: ["sms-verification", "serialisation", "supply-chain-traceability"],
    sources: [
      {
        title: "What we do",
        publisher: "mPedigree",
        url: "https://www.mpedigree.com/whatwedo/",
        accessedAt: ACCESSED_AT,
      },
      {
        title: "Who we are",
        publisher: "mPedigree",
        url: "https://www.mpedigree.com/who-we-are/",
        accessedAt: ACCESSED_AT,
      },
      {
        title:
          "Ghanaian Company Wins Security Prize for Anti-Counterfeiting System",
        publisher: "Partnership for Safe Medicines",
        url: "https://www.safemedicines.org/2010/11/ghanaian-company-wins-security-prize-for-anti-counterfeiting-system-48.html",
        accessedAt: ACCESSED_AT,
      },
      {
        title: "Nigerian Drug Maker Uses Authentication Texting",
        publisher: "Partnership for Safe Medicines",
        url: "https://www.safemedicines.org/2011/02/nigerian-drug-maker-uses-authentication-texting-149.html",
        accessedAt: ACCESSED_AT,
      },
      {
        title: "mPedigree — Skoll Awardee profile",
        publisher: "Skoll Foundation",
        url: "https://skoll.org/organization/mpedigree/",
        accessedAt: ACCESSED_AT,
      },
    ],
    paths: [],
  },
  {
    slug: "wmp-wolbachia-dengue-yogyakarta",
    domainSlug: "health",
    status: "PUBLISHED",
    featured: true,
    title: {
      id: "World Mosquito Program: Nyamuk Ber-Wolbachia Penekan Demam Berdarah di Yogyakarta",
      en: "World Mosquito Program: Wolbachia Mosquitoes Suppressing Dengue in Yogyakarta",
    },
    summary: {
      id: "Pelepasan nyamuk Aedes aegypti pembawa bakteri alami Wolbachia yang dipandu pemetaan klaster spasial di Kota Yogyakarta untuk menekan penularan virus dengue.",
      en: "Spatially mapped cluster releases of Aedes aegypti mosquitoes carrying natural Wolbachia bacteria in Yogyakarta City to block dengue virus transmission.",
    },
    problem: {
      id: "Demam berdarah dengue (DBD) terus menjadi beban kesehatan masyarakat yang berat di kota-kota tropis Indonesia. Pengendalian vektor konvensional seperti pengasapan (fogging) hanya membunuh nyamuk dewasa sementara waktu dan tidak menghentikan siklus penularan.",
      en: "Dengue fever remains a severe public health burden across tropical Indonesian cities. Conventional vector control such as insecticide fogging only temporarily kills adult mosquitoes and fails to break the transmission cycle.",
    },
    solution: {
      id: "World Mosquito Program bersama Universitas Gadjah Mada dan Yayasan Tahija membagi wilayah Kota Yogyakarta seluas 26 km² menjadi 24 klaster geografis, lalu melepas nyamuk Aedes aegypti ber-Wolbachia (galur wMel) secara terukur di 12 klaster intervensi.",
      en: "The World Mosquito Program, Universitas Gadjah Mada, and the Tahija Foundation partitioned a 26 km² area of Yogyakarta City into 24 geographic clusters and released wMel Wolbachia-infected Aedes aegypti mosquitoes across 12 intervention clusters.",
    },
    aiRole: {
      id: "Intervensi intinya adalah bioteknologi vektor (bakteri endosimbion Wolbachia), bukan AI generatif. Namun desain uji acak berklaster, pemodelan geospasial kepadatan nyamuk, dan inferensi biostatistik menjadi fondasi analitik untuk mengukur efikasi perlindungan di lapangan.",
      en: "The core intervention is vector biotechnology (Wolbachia endosymbiont bacteria), not generative AI. However, cluster-randomized spatial design, mosquito frequency monitoring, and biostatistical inference form the analytical backbone for measuring field efficacy.",
    },
    impact: {
      id: "Dalam uji klinis acak berklaster AWED yang dipublikasikan di New England Journal of Medicine (2021), pelepasan nyamuk ber-Wolbachia memberikan efikasi perlindungan 77,1% terhadap demam berdarah terkonfirmasi virologis dan menurunkan rawat inap sebesar 86,2%.",
      en: "In the AWED cluster-randomized trial published in the New England Journal of Medicine (2021), Wolbachia deployments achieved 77.1% protective efficacy against virologically confirmed dengue and reduced dengue hospitalizations by 86.2%.",
    },
    metrics: [
      {
        label: {
          id: "Efikasi perlindungan terhadap kasus dengue",
          en: "Protective efficacy against dengue cases",
        },
        value: 77.1,
        unit: { id: "%", en: "%" },
        quote:
          "In the ITT analysis virologically-confirmed dengue occurred in 67 of 2905 (2.3%) participants in the wMel-treated and 318 of 3401 (9.4%) in the untreated arm (OR 0.23, 95% CI, 0.15 to 0.35; P=0.004): protective efficacy of 77.1% (95% CI, 65.3 to 84.9).",
        sourceUrl: "https://pmc.ncbi.nlm.nih.gov/articles/PMC8103655/",
      },
      {
        label: {
          id: "Efikasi perlindungan terhadap rawat inap dengue",
          en: "Protective efficacy against dengue hospitalization",
        },
        value: 86.2,
        unit: { id: "%", en: "%" },
        quote:
          "Hospitalisation for virologically-confirmed dengue was less frequent for participants resident in the wMel-treated (13/2905, 2.8%) compared to the untreated arm (102/3401, 6.3%): protective efficacy 86.2% (95% CI, 66.2 to 94.3)",
        sourceUrl: "https://pmc.ncbi.nlm.nih.gov/articles/PMC8103655/",
      },
      {
        label: {
          id: "Klaster geografis dalam uji klinis Yogyakarta",
          en: "Geographic clusters in the Yogyakarta trial",
        },
        value: 24,
        unit: { id: "klaster", en: "clusters" },
        quote:
          "Twenty-four geographic clusters were randomly allocated to receive wMel deployments as an adjunct to local mosquito control measures; or to continue with local mosquito control measures only.",
        sourceUrl: "https://pmc.ncbi.nlm.nih.gov/articles/PMC8103655/",
      },
    ],
    countryCode: "ID",
    region: "Kota Yogyakarta, DI Yogyakarta",
    lat: -7.7956,
    lng: 110.3695,
    year: 2021,
    sdgs: [3, 11],
    technologies: ["spatial-epidemiology", "biostatistics", "vector-biotechnology"],
    sources: [
      {
        title:
          "Efficacy of Wolbachia-Infected Mosquito Deployments for the Control of Dengue",
        publisher: "New England Journal of Medicine (PubMed Central)",
        url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC8103655/",
        accessedAt: ACCESSED_AT,
      },
      {
        title: "World Mosquito Program — Yogyakarta, Indonesia",
        publisher: "World Mosquito Program",
        url: "https://www.worldmosquitoprogram.org/en/global-progress/asia/indonesia",
        accessedAt: ACCESSED_AT,
      },
    ],
    paths: [
      {
        pathSlug: "ai-for-impact-foundations",
        relevance: 2,
        note: {
          id: "Menunjukkan pentingnya pengolahan data lapangan dan evaluasi kausal yang ketat dalam mengukur dampak kesehatan masyarakat.",
          en: "Demonstrates how rigorous field data wrangling and causal evaluation measure real public-health impact.",
        },
      },
    ],
  },
] as const satisfies readonly CaseStudy[];
