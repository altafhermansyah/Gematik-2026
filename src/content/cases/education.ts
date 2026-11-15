/**
 * Kasus bidang pendidikan.
 *
 * Setiap angka di `metrics` wajib menyertakan kutipan verbatim dari sumber yang
 * tercantum di `sources`; `assertContentIntegrity()` menolak angka tanpa jejak
 * audit. Tanggal akses seluruh sumber: 2026-10-25.
 */

import type { CaseStudy } from "@/modules/content/types";

const ACCESSED_AT = "2026-10-25";

export const educationCases = [
  {
    slug: "mindspark-adaptive-learning-india",
    domainSlug: "education",
    status: "PUBLISHED",
    featured: true,
    title: {
      id: "Mindspark: Pembelajaran Adaptif Berbantuan Komputer untuk Siswa Sekolah Negeri di India",
      en: "Mindspark: Computer-Assisted Adaptive Learning for Public School Students in India",
    },
    summary: {
      id: "Perangkat lunak pembelajaran adaptif yang mempersonalisasi latihan matematika dan bahasa Hindi sesuai tingkat penguasaan nyata tiap siswa, bukan sekadar mengikuti kurikulum kelas.",
      en: "Adaptive learning software that personalizes mathematics and Hindi exercises to each student's actual mastery level rather than rigid grade-level curricula.",
    },
    problem: {
      id: "Di banyak sekolah negeri di negara berkembang, kesenjangan kemampuan siswa dalam satu kelas sangat lebar: sebagian besar siswa tertinggal beberapa tingkat di bawah kurikulum resmi, sementara guru harus menuntaskan silabus standar sehingga siswa yang tertinggal semakin tidak mampu mengikuti pelajaran.",
      en: "In many developing-country public schools, learning levels within a single classroom vary across several grade equivalents; teachers face pressure to complete the standard syllabus, leaving behind students with foundational gaps.",
    },
    solution: {
      id: "Dikembangkan oleh Educational Initiatives di India, Mindspark mendiagnosis miskonsepsi spesifik tiap siswa melalui penilaian awal lalu menyajikan soal interaktif dan penjelasan bertahap yang menyesuaikan tingkat kesulitannya secara dinamis dari jawaban ke jawaban.",
      en: "Developed by Educational Initiatives in India, Mindspark diagnoses each student's specific misconceptions through baseline assessments and dynamically adapts question difficulty and remedial explanations item by item.",
    },
    aiRole: {
      id: "Sistem aturan diagnostik dan pemodelan penguasaan item (knowledge tracing berbasis jutaan respons historis siswa) memilih butir soal berikutnya secara dinamis untuk memperbaiki kesenjangan konsep dasar sebelum melangkah ke materi tingkat kelas.",
      en: "Diagnostic rule engines and item-mastery modeling (built on millions of historical student responses) dynamically select the next learning activity to remediate foundational gaps before advancing to grade-level material.",
    },
    impact: {
      id: "Dalam uji acak terkontrol (RCT) di New Delhi yang diterbitkan di American Economic Review (2019), siswa yang mengikuti program Mindspark selama 4,5 bulan mengalami peningkatan nilai matematika sebesar 0,37 simpangan baku dan bahasa Hindi sebesar 0,23 simpangan baku.",
      en: "In a randomized controlled trial in New Delhi published in the American Economic Review (2019), students assigned to Mindspark over 4.5 months gained 0.37 standard deviations in math and 0.23 standard deviations in Hindi.",
    },
    metrics: [
      {
        label: {
          id: "Peningkatan skor matematika dalam 4,5 bulan (simpangan baku)",
          en: "Math score gain over 4.5 months (standard deviations)",
        },
        value: 0.37,
        unit: { id: "simpangan baku", en: "SD" },
        quote:
          "We find that over a 4.5-month period, lottery winners scored 0.37σ higher in math and 0.23σ higher in Hindi than lottery losers.",
        sourceUrl: "https://www.aeaweb.org/articles?id=10.1257/aer.20171112",
      },
      {
        label: {
          id: "Peningkatan skor bahasa Hindi dalam 4,5 bulan (simpangan baku)",
          en: "Hindi score gain over 4.5 months (standard deviations)",
        },
        value: 0.23,
        unit: { id: "simpangan baku", en: "SD" },
        quote:
          "We find that over a 4.5-month period, lottery winners scored 0.37σ higher in math and 0.23σ higher in Hindi than lottery losers.",
        sourceUrl: "https://www.aeaweb.org/articles?id=10.1257/aer.20171112",
      },
      {
        label: {
          id: "Durasi intervensi dalam studi evaluasi acak",
          en: "Intervention duration in the randomized evaluation",
        },
        value: 4.5,
        unit: { id: "bulan", en: "months" },
        quote:
          "We find that over a 4.5-month period, lottery winners scored 0.37σ higher in math and 0.23σ higher in Hindi than lottery losers.",
        sourceUrl: "https://www.aeaweb.org/articles?id=10.1257/aer.20171112",
      },
    ],
    countryCode: "IN",
    region: "New Delhi",
    lat: 28.6139,
    lng: 77.209,
    year: 2019,
    sdgs: [4, 10],
    technologies: ["adaptive-learning", "knowledge-tracing", "edtech"],
    sources: [
      {
        title:
          "Disrupting Education? Experimental Evidence on Technology-Aided Instruction in India",
        publisher: "American Economic Review (Muralidharan, Singh, & Ganimian)",
        url: "https://www.aeaweb.org/articles?id=10.1257/aer.20171112",
        accessedAt: ACCESSED_AT,
      },
      {
        title:
          "Mindspark computer-assisted learning program in India: Evaluation Summary",
        publisher: "Abdul Latif Jameel Poverty Action Lab (J-PAL)",
        url: "https://www.povertyactionlab.org/evaluation/disrupting-education-experimental-evidence-technology-aided-instruction-india",
        accessedAt: ACCESSED_AT,
      },
    ],
    paths: [
      {
        pathSlug: "ai-for-impact-foundations",
        relevance: 3,
        note: {
          id: "Menunjukkan bagaimana personalisasi berbasis data yang menyasar level aktual siswa memberikan dampak terukur dalam uji acak terkontrol.",
          en: "Demonstrates how data-driven personalization targeting actual student mastery yields measurable impact in randomized trials.",
        },
      },
    ],
  },
  {
    slug: "onebillion-tablet-math-intervention",
    domainSlug: "education",
    status: "PUBLISHED",
    featured: false,
    title: {
      id: "onebillion: Aplikasi Tablet Mandiri untuk Literasi dan Numerasi Dasar Anak",
      en: "onebillion: Self-Paced Tablet Apps for Early Childhood Numeracy and Literacy",
    },
    summary: {
      id: "Perangkat lunak pembelajaran numerasi dan literasi mandiri buatan organisasi nirlaba onebillion yang digunakan di Malawi dan Inggris untuk mendukung anak-anak dengan ritme belajar beragam.",
      en: "Self-paced numeracy and literacy software by nonprofit onebillion deployed in Malawi and the UK to support children learning at their own pace.",
    },
    problem: {
      id: "Di sekolah dasar dengan rasio murid per guru yang sangat tinggi (sering kali melebihi 60 hingga 100 siswa per kelas di Malawi), anak-anak yang tertinggal pada keterampilan berhitung awal jarang mendapatkan umpan balik individual.",
      en: "In primary schools with very high pupil-to-teacher ratios (often exceeding 60 to 100 children per classroom in Malawi), children who struggle with early numeracy rarely receive individualized feedback.",
    },
    solution: {
      id: "Organisasi nirlaba onebillion merancang aplikasi tablet berbasis permainan terstruktur dalam bahasa lokal (seperti Chichewa) dengan instruksi suara dan umpan balik langsung per langkah, sehingga setiap anak melangkah ke modul berikutnya hanya setelah lulus kuis penguasaan.",
      en: "Nonprofit onebillion designed structured tablet learning apps in local languages (such as Chichewa) with spoken audio instructions and immediate step-by-step feedback, advancing children only after passing mastery quizzes.",
    },
    aiRole: {
      id: "Alih-alih model bahasa generatif, aplikasi ini mengandalkan logika adaptif berbasis penguasaan (mastery-based adaptive progression) dan pemantauan telemetri capaian siswa secara luring.",
      en: "Rather than generative language models, the software relies on mastery-based adaptive progression logic and offline telemetry of pupil progress.",
    },
    impact: {
      id: "Evaluasi uji acak terkontrol tingkat siswa (pupil-level RCT) yang melibatkan 389 anak usia 4–5 tahun menunjukkan bahwa intervensi aplikasi matematika onebillion meningkatkan pencapaian numerasi dasar secara signifikan dan mencegah pelebaran kesenjangan bagi anak dengan kemampuan memori kerja rendah.",
      en: "A pupil-level randomized controlled trial involving 389 children aged 4–5 years showed that the onebillion maths app intervention significantly boosted early mathematical achievement and prevented widening gaps for children with lower working-memory skills.",
    },
    metrics: [
      {
        label: {
          id: "Anak usia 4–5 tahun dalam uji acak terkontrol",
          en: "Children aged 4–5 years in the randomized controlled trial",
        },
        value: 389,
        unit: { id: "anak", en: "children" },
        quote:
          "A pupil-level randomized controlled trial with 389 children aged 4–5 years compared the efficacy of a tablet-based maths intervention (onebillion) with normal classroom practice.",
        sourceUrl: "https://pmc.ncbi.nlm.nih.gov/articles/PMC6366442/",
      },
    ],
    countryCode: "MW",
    region: "Lilongwe",
    lat: -13.9626,
    lng: 33.7741,
    year: 2019,
    sdgs: [4, 10],
    technologies: ["adaptive-learning", "offline-first", "early-numeracy"],
    sources: [
      {
        title:
          "Learning maths with technology: A randomized controlled trial of a tablet intervention in early years",
        publisher: "British Journal of Educational Technology (PubMed Central)",
        url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC6366442/",
        accessedAt: ACCESSED_AT,
      },
      {
        title: "onebillion: onecourse adaptive literacy and numeracy",
        publisher: "onebillion",
        url: "https://onebillion.org",
        accessedAt: ACCESSED_AT,
      },
    ],
    paths: [],
  },
] as const satisfies readonly CaseStudy[];
