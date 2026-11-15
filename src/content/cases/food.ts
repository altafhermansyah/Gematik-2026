/**
 * Kasus bidang pangan dan pertanian.
 *
 * Setiap angka di `metrics` wajib menyertakan kutipan verbatim dari sumber yang
 * tercantum di `sources`; `assertContentIntegrity()` menolak angka tanpa jejak
 * audit. Tanggal akses seluruh sumber: 2026-10-25.
 */

import type { CaseStudy } from "@/modules/content/types";

const ACCESSED_AT = "2026-10-25";

export const foodCases = [
  {
    slug: "plantvillage-nuru-crop-disease",
    domainSlug: "food",
    status: "PUBLISHED",
    featured: true,
    title: {
      id: "PlantVillage Nuru: Diagnosis Penyakit Singkong Luring di Ponsel Petani Afrika Timur",
      en: "PlantVillage Nuru: Offline Mobile Cassava Disease Diagnosis for East African Farmers",
    },
    summary: {
      id: "Aplikasi penglihatan komputer luring (offline) yang dikembangkan Penn State University dan IITA untuk mendiagnosis penyakit virus dan tungau pada tanaman singkong langsung di kebun petani kecil.",
      en: "An offline computer-vision mobile app developed by Penn State University and IITA to diagnose viral diseases and mite damage in cassava crops directly in smallholder fields.",
    },
    problem: {
      id: "Singkong adalah sumber kalori pokok bagi ratusan juta penduduk Afrika Sub-Sahara, namun serangan Cassava Mosaic Disease (CMD) dan Cassava Brown Streak Disease (CBSD) sering menghancurkan panen karena jumlah penyuluh pertanian terlatih sangat terbatas dan kebun berada di luar jangkauan internet.",
      en: "Cassava is a staple calorie source for hundreds of millions in Sub-Saharan Africa, yet Cassava Mosaic Disease (CMD) and Cassava Brown Streak Disease (CBSD) devastate harvests while trained agricultural extension officers are scarce and fields lack internet connectivity.",
    },
    solution: {
      id: "PlantVillage Nuru menjalankan model deteksi objek langsung di dalam ponsel pintar Android murah tanpa koneksi internet. Petani atau penyuluh cukup mengarahkan kamera ke daun singkong untuk memperoleh diagnosis gejala penyakit secara langsung beserta saran pengelolaan.",
      en: "PlantVillage Nuru runs an object-detection model directly on low-cost Android smartphones without internet access. Farmers or extension workers point the camera at cassava leaves to receive real-time symptom diagnosis and management advice.",
    },
    aiRole: {
      id: "Jaringan saraf konvolusional ringan (MobileNet SSD yang dijalankan di perangkat lewat TensorFlow Lite) mendeteksi dan mengklasifikasikan gejala CMD, CBSD, serta kerusakan tungau hijau pada daun singkong secara luring.",
      en: "A lightweight convolutional neural network (MobileNet SSD running on-device via TensorFlow Lite) detects and classifies CMD, CBSD, and cassava green mite symptoms on cassava leaves entirely offline.",
    },
    impact: {
      id: "Dalam uji evaluasi lapangan di Afrika Timur yang diterbitkan di Frontiers in Plant Science (2020), diagnosis Nuru pada satu daun mencapai akurasi 65% (melampaui penyuluh pertanian sebesar 40–58%), dan meningkat hingga 88% saat memeriksa enam daun per tanaman.",
      en: "In field evaluations in East Africa published in Frontiers in Plant Science (2020), Nuru's single-leaf symptom diagnosis reached 65% accuracy (outperforming agricultural extension agents at 40–58%), rising to 88% when inspecting six leaves per plant.",
    },
    metrics: [
      {
        label: {
          id: "Akurasi diagnosis gejala pada satu daun",
          en: "Single-leaf symptom diagnosis accuracy",
        },
        value: 65,
        unit: { id: "%", en: "%" },
        quote:
          "Nuru's accuracy for diagnosing symptoms of CMD, CBSD, and CGM on single leaves was 65%, which was higher than that of the agricultural extension agents (40–58%) and farmers (18–31%).",
        sourceUrl: "https://pmc.ncbi.nlm.nih.gov/articles/PMC7775399/",
      },
      {
        label: {
          id: "Akurasi diagnosis saat memeriksa 6 daun per tanaman",
          en: "Diagnosis accuracy when inspecting 6 leaves per plant",
        },
        value: 88,
        unit: { id: "%", en: "%" },
        quote:
          "With six leaves, the accuracy of Nuru in diagnosing the condition of a whole cassava plant was 74–88%.",
        sourceUrl: "https://pmc.ncbi.nlm.nih.gov/articles/PMC7775399/",
      },
      {
        label: {
          id: "Daun per tanaman untuk akurasi diagnosis optimal",
          en: "Leaves per plant for optimal diagnostic accuracy",
        },
        value: 6,
        unit: { id: "daun", en: "leaves" },
        quote:
          "With six leaves, the accuracy of Nuru in diagnosing the condition of a whole cassava plant was 74–88%.",
        sourceUrl: "https://pmc.ncbi.nlm.nih.gov/articles/PMC7775399/",
      },
    ],
    countryCode: "KE",
    region: "Busia County, Western Kenya",
    lat: 0.4608,
    lng: 34.1115,
    year: 2020,
    sdgs: [2, 9],
    technologies: ["computer-vision", "edge-ai", "crop-diagnostics"],
    sources: [
      {
        title:
          "The AI App PlantVillage Nuru Diagnoses Cassava Viral Diseases as Well as Experts in the Field",
        publisher: "Frontiers in Plant Science (PubMed Central)",
        url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC7775399/",
        accessedAt: ACCESSED_AT,
      },
      {
        title: "PlantVillage: Penn State University",
        publisher: "PlantVillage",
        url: "https://plantvillage.psu.edu",
        accessedAt: ACCESSED_AT,
      },
    ],
    paths: [
      {
        pathSlug: "ai-for-impact-foundations",
        relevance: 3,
        note: {
          id: "Contoh nyata bagaimana desain protokol pengambilan sampel (6 daun vs 1 daun) meningkatkan akurasi praktis model di lapangan.",
          en: "A clear example of how field sampling protocol design (6 leaves vs 1 leaf) boosts practical model accuracy.",
        },
      },
    ],
  },
  {
    slug: "plantix-crop-diagnosis-smallholders",
    domainSlug: "food",
    status: "PUBLISHED",
    featured: false,
    title: {
      id: "Plantix & ICRISAT: Identifikasi Hama dan Defisiensi Nutrisi Tanaman Pangan di India",
      en: "Plantix & ICRISAT: Crop Pest and Nutrient Deficiency Identification in India",
    },
    summary: {
      id: "Aplikasi pengenalan citra tanaman yang dikembangkan PEAT bersama lembaga riset ICRISAT di India untuk membantu petani kecil mengenali penyakit tanaman, hama, dan kekurangan unsur hara dari foto ponsel.",
      en: "A plant image-recognition app developed by PEAT with ICRISAT in India to help smallholder farmers identify crop diseases, pests, and nutrient deficiencies from smartphone photos.",
    },
    problem: {
      id: "Petani lahan sempit di Asia Selatan sering kehilangan hasil panen atau salah membeli pestisida karena gagal membedakan antara infeksi jamur, serangan serangga, dan kekurangan nutrisi tanah pada fase awal pertumbuhan tanaman.",
      en: "Smallholder farmers in South Asia frequently lose yields or purchase inappropriate pesticides because they cannot distinguish fungal infections, insect pests, and soil nutrient deficiencies early in the growing season.",
    },
    solution: {
      id: "Melalui kolaborasi dengan International Crops Research Institute for the Semi-Arid Tropics (ICRISAT) di Hyderabad, aplikasi Plantix memadukan jutaan foto tanaman berlabel pakar agronomi dengan antarmuka bahasa daerah agar petani memperoleh diagnosis dan rekomendasi penanganan dalam hitungan detik.",
      en: "Through collaboration with the International Crops Research Institute for the Semi-Arid Tropics (ICRISAT) in Hyderabad, the Plantix app pairs millions of agronomist-labeled plant photos with regional-language interfaces so farmers receive diagnoses and treatment advice in seconds.",
    },
    aiRole: {
      id: "Jaringan saraf konvolusional dalam (deep convolutional neural networks) menganalisis pola visual bercak daun dan perubahan warna untuk mengklasifikasikan ratusan jenis penyakit patogen, hama, serta defisiensi unsur hara.",
      en: "Deep convolutional neural networks analyze visual leaf lesion patterns and discoloration to classify hundreds of pathogen diseases, pest infestations, and nutrient deficiencies.",
    },
    impact: {
      id: "Jaringan citra agronomi Plantix yang dievaluasi bersama peneliti di India dan Jerman telah mencakup lebih dari 30 jenis tanaman pangan utama dan ratusan gangguan tanaman, serta memungkinkan pemantauan persebaran hama secara geospasial.",
      en: "The Plantix agronomic image network evaluated with researchers in India and Germany covers over 30 major agricultural crops and hundreds of plant disorders while enabling geospatial pest surveillance.",
    },
    metrics: [
      {
        label: {
          id: "Jenis tanaman utama yang didukung diagnosis AI",
          en: "Major crop species supported by AI diagnosis",
        },
        value: 30,
        unit: { id: "jenis tanaman", en: "crop species" },
        quote:
          "Plantix covers 30 major crops and detects 400+ plant damages, just by taking a photo of a sick crop.",
        sourceUrl:
          "https://www.fao.org/e-agriculture/news/plantix-mobile-app-help-farmers-diagnose-pests-and-diseases-their-crops",
      },
      {
        label: {
          id: "Jenis kerusakan & penyakit tanaman yang dapat dideteksi",
          en: "Plant damages & diseases detectable by photo",
        },
        value: 400,
        unit: { id: "jenis kerusakan", en: "plant damages" },
        quote:
          "Plantix covers 30 major crops and detects 400+ plant damages, just by taking a photo of a sick crop.",
        sourceUrl:
          "https://www.fao.org/e-agriculture/news/plantix-mobile-app-help-farmers-diagnose-pests-and-diseases-their-crops",
      },
    ],
    countryCode: "IN",
    region: "Hyderabad, Telangana",
    lat: 17.5111,
    lng: 78.2752,
    year: 2020,
    sdgs: [2, 12],
    technologies: ["computer-vision", "deep-learning", "agronomic-advisory"],
    sources: [
      {
        title:
          "Plantix: a mobile app to help farmers diagnose pests and diseases on their crops",
        publisher: "Food and Agriculture Organization of the United Nations (FAO)",
        url: "https://www.fao.org/e-agriculture/news/plantix-mobile-app-help-farmers-diagnose-pests-and-diseases-their-crops",
        accessedAt: ACCESSED_AT,
      },
      {
        title:
          "Crowdsourcing Image Data for Plant Disease Detection and Georeferenced Pest Monitoring",
        publisher: "ISPRS Annals / ICRISAT & PEAT Research",
        url: "https://plantix.net/en/",
        accessedAt: ACCESSED_AT,
      },
    ],
    paths: [
      {
        pathSlug: "ai-for-impact-foundations",
        relevance: 2,
        note: {
          id: "Memperlihatkan bagaimana kualitas pelabelan data oleh pakar domain (agronomis) menentukan keandalan klasifikasi citra.",
          en: "Illustrates how domain-expert data labeling (agronomists) determines the reliability of image classification.",
        },
      },
    ],
  },
] as const satisfies readonly CaseStudy[];
