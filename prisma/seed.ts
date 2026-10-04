// prisma/seed.ts
// Jalankan: npx prisma db seed   (seed sudah didaftarkan di prisma.config.ts)
// npm i @prisma/client@7 @prisma/adapter-pg pg bcryptjs dotenv
// npm i -D prisma@7 tsx typescript @types/bcryptjs @types/node @types/pg

import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";
import {
  PrismaClient,
  Level,
  NodeType,
  PublishStatus,
  QuestionKind,
  ResourceType,
  Role,
} from "../src/generated/prisma/client";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });
const t = (id: string, en: string) => ({ id, en });

async function wipeContent() {
  await prisma.quizQuestion.deleteMany();
  await prisma.case.deleteMany();
  await prisma.path.deleteMany();
  await prisma.skill.deleteMany();
  await prisma.domain.deleteMany();
}

async function seedDomains() {
  const data = [
    { slug: "climate", name: t("Iklim & Lingkungan", "Climate & Environment"), color: "#34d399" },
    { slug: "food", name: t("Pangan & Pertanian", "Food & Agriculture"), color: "#fbbf24" },
    { slug: "health", name: t("Kesehatan & Sains", "Health & Science"), color: "#f472b6" },
    { slug: "education", name: t("Pendidikan", "Education"), color: "#60a5fa" },
    { slug: "disaster", name: t("Kebencanaan", "Disaster Resilience"), color: "#fb923c" },
    { slug: "inclusion", name: t("Inklusi Sosial", "Social Inclusion"), color: "#a78bfa" },
  ];
  const map: Record<string, string> = {};
  for (const [i, d] of data.entries()) {
    const row = await prisma.domain.create({ data: { ...d, order: i } });
    map[d.slug] = row.id;
  }
  return map;
}

async function seedSkills() {
  const data = [
    {
      slug: "python-basics",
      name: t("Dasar Python", "Python Basics"),
      category: "programming",
      resources: [
        { type: ResourceType.DOCS, title: "The Python Tutorial", url: "https://docs.python.org/3/tutorial/", provider: "python.org" },
      ],
    },
    {
      slug: "data-wrangling",
      name: t("Mengolah Data", "Data Wrangling"),
      category: "data",
      resources: [
        { type: ResourceType.DOCS, title: "pandas: Getting started tutorials", url: "https://pandas.pydata.org/docs/getting_started/intro_tutorials/", provider: "pandas" },
      ],
    },
    {
      slug: "ml-fundamentals",
      name: t("Dasar Machine Learning", "Machine Learning Fundamentals"),
      category: "ml",
      resources: [
        { type: ResourceType.COURSE, title: "Machine Learning Crash Course", url: "https://developers.google.com/machine-learning/crash-course", provider: "Google" },
        { type: ResourceType.DOCS, title: "scikit-learn User Guide", url: "https://scikit-learn.org/stable/user_guide.html", provider: "scikit-learn" },
      ],
    },
    {
      slug: "model-evaluation",
      name: t("Evaluasi Model", "Model Evaluation"),
      category: "ml",
      resources: [
        { type: ResourceType.DOCS, title: "Metrics and scoring", url: "https://scikit-learn.org/stable/modules/model_evaluation.html", provider: "scikit-learn" },
      ],
    },
    {
      slug: "responsible-ai",
      name: t("AI yang Bertanggung Jawab", "Responsible AI"),
      category: "ethics",
      resources: [
        { type: ResourceType.ARTICLE, title: "People + AI Guidebook", url: "https://pair.withgoogle.com/guidebook/", provider: "Google PAIR" },
      ],
    },
    {
      slug: "applied-project",
      name: t("Proyek Terapan", "Applied Project"),
      category: "project",
      resources: [
        { type: ResourceType.COURSE, title: "Kaggle Learn", url: "https://www.kaggle.com/learn", provider: "Kaggle" },
      ],
    },
  ];
  const map: Record<string, string> = {};
  for (const s of data) {
    const { resources, ...rest } = s;
    const row = await prisma.skill.create({
      data: { ...rest, resources: { create: resources.map((r, order) => ({ ...r, order })) } },
    });
    map[s.slug] = row.id;
  }
  return map;
}

async function seedPath(skills: Record<string, string>) {
  const path = await prisma.path.create({
    data: {
      slug: "ai-for-impact-foundations",
      status: PublishStatus.PUBLISHED,
      level: Level.BEGINNER,
      title: t("Dasar AI untuk Dampak Nyata", "AI Foundations for Real-World Impact"),
      description: t(
        "Dari nol sampai bisa membangun dan mengevaluasi model AI sederhana untuk masalah nyata.",
        "From zero to building and evaluating a simple AI model for a real-world problem."
      ),
      estimatedHours: 46,
    },
  });

  const nodes = [
    { skill: "python-basics", type: NodeType.CONCEPT, hours: 8, x: 0, y: 0 },
    { skill: "data-wrangling", type: NodeType.CONCEPT, hours: 6, x: 0, y: 150 },
    { skill: "ml-fundamentals", type: NodeType.CONCEPT, hours: 10, x: 0, y: 300 },
    { skill: "model-evaluation", type: NodeType.PRACTICE, hours: 6, x: -140, y: 450 },
    { skill: "responsible-ai", type: NodeType.CONCEPT, hours: 4, x: 140, y: 450 },
    {
      skill: "applied-project",
      type: NodeType.PROJECT,
      hours: 12,
      x: 0,
      y: 600,
      task: t(
        "Pilih satu kasus di Atlas, cari dataset terbuka yang relevan, latih model sederhana, lalu jelaskan hasil dan batasannya.",
        "Pick one Atlas case, find a relevant open dataset, train a simple model, then explain its results and limits."
      ),
    },
  ];

  const nodeId: Record<string, string> = {};
  for (const [order, n] of nodes.entries()) {
    const row = await prisma.pathNode.create({
      data: {
        pathId: path.id,
        skillId: skills[n.skill],
        type: n.type,
        order,
        posX: n.x,
        posY: n.y,
        estimatedHours: n.hours,
        task: n.task,
      },
    });
    nodeId[n.skill] = row.id;
  }

  const edges: [string, string][] = [
    ["python-basics", "data-wrangling"],
    ["data-wrangling", "ml-fundamentals"],
    ["ml-fundamentals", "model-evaluation"],
    ["ml-fundamentals", "responsible-ai"],
    ["model-evaluation", "applied-project"],
    ["responsible-ai", "applied-project"],
  ];
  await prisma.pathEdge.createMany({
    data: edges.map(([from, to]) => ({ fromId: nodeId[from], toId: nodeId[to] })),
  });

  return path;
}

// PENTING: ganti metrics/koordinat/klaim dampak dengan data yang sudah kalian verifikasi dari sumbernya.
async function seedCases(domains: Record<string, string>, pathId: string) {
  const alphafold = await prisma.case.create({
    data: {
      slug: "alphafold-protein-structures",
      domainId: domains.health,
      status: PublishStatus.PUBLISHED,
      featured: true,
      title: t("AlphaFold: Memprediksi Struktur Protein", "AlphaFold: Predicting Protein Structures"),
      summary: t(
        "AI yang memprediksi bentuk 3D protein dari urutan asam aminonya.",
        "AI that predicts a protein's 3D shape from its amino-acid sequence."
      ),
      problem: t(
        "Menentukan struktur 3D protein lewat eksperimen laboratorium lambat dan mahal, sehingga menghambat riset penyakit dan penemuan obat.",
        "Determining protein structures experimentally is slow and expensive, which holds back disease research and drug discovery."
      ),
      solution: t(
        "Model deep learning memprediksi struktur protein dari urutannya, dan hasilnya dibuka lewat database publik yang bisa diakses peneliti.",
        "A deep learning model predicts protein structures from sequence, with results released through a public database for researchers."
      ),
      aiRole: t(
        "Jaringan saraf dalam yang dilatih pada struktur protein yang sudah diketahui.",
        "A deep neural network trained on experimentally known protein structures."
      ),
      impact: t(
        "Peneliti di berbagai negara bisa memakai prediksi struktur secara gratis untuk mempercepat riset biologi.",
        "Researchers worldwide can use predicted structures for free to speed up biology research."
      ),
      countryCode: "GB",
      region: "Hinxton / London",
      lat: 52.08,
      lng: 0.19,
      year: 2021,
      sdgs: { create: [3, 9].map((sdg) => ({ sdg })) },
      technologies: { create: ["deep-learning", "bioinformatics"].map((tech) => ({ tech })) },
      sources: {
        create: [
          {
            title: "Highly accurate protein structure prediction with AlphaFold",
            publisher: "Nature",
            url: "https://www.nature.com/articles/s41586-021-03819-2",
          },
          {
            title: "AlphaFold Protein Structure Database",
            publisher: "EMBL-EBI",
            url: "https://alphafold.ebi.ac.uk",
          },
        ],
      },
    },
  });

  const rfcx = await prisma.case.create({
    data: {
      slug: "rainforest-connection-forest-listening",
      domainId: domains.climate,
      status: PublishStatus.PUBLISHED,
      title: t("Rainforest Connection: Mendengarkan Hutan", "Rainforest Connection: Listening to the Forest"),
      summary: t(
        "Ponsel bekas bertenaga surya yang mendeteksi suara penebangan liar di hutan.",
        "Solar-powered recycled phones that detect the sound of illegal logging."
      ),
      problem: t(
        "Penebangan liar sulit dideteksi di hutan yang luas dan terpencil, dan patroli manual sering datang terlambat.",
        "Illegal logging is hard to detect across vast, remote forests, and manual patrols often arrive too late."
      ),
      solution: t(
        "Perangkat bekas dipasang di kanopi untuk merekam suara hutan, lalu model AI mengenali suara seperti gergaji mesin dan mengirim peringatan ke penjaga hutan.",
        "Recycled devices in the canopy record forest sound, and an AI model recognizes sounds like chainsaws and alerts rangers."
      ),
      aiRole: t(
        "Klasifikasi audio (bioakustik) dengan machine learning.",
        "Audio classification (bioacoustics) using machine learning."
      ),
      impact: t(
        "Penjaga hutan bisa merespons lebih cepat, dan rekaman yang sama bisa dipakai memantau satwa liar.",
        "Rangers can respond faster, and the same recordings can be used to monitor wildlife."
      ),
      countryCode: "ID",
      region: "Sumatra", // TODO: ganti dengan lokasi deployment yang terverifikasi
      lat: -1.6,
      lng: 103.6,
      sdgs: { create: [13, 15].map((sdg) => ({ sdg })) },
      technologies: { create: ["audio-classification", "iot"].map((tech) => ({ tech })) },
      sources: {
        create: [
          {
            title: "Rainforest Connection — official site",
            publisher: "Rainforest Connection (RFCx)",
            url: "https://rfcx.org",
          },
        ],
      },
    },
  });

  await prisma.casePath.createMany({
    data: [
      {
        caseId: alphafold.id,
        pathId,
        relevance: 2,
        note: t(
          "Kuasai dasar ML untuk memahami cara model seperti ini dibangun.",
          "Learn ML fundamentals to understand how models like this are built."
        ),
      },
      {
        caseId: rfcx.id,
        pathId,
        relevance: 3,
        note: t(
          "Klasifikasi dan evaluasi model adalah inti dari sistem deteksi ini.",
          "Classification and model evaluation are at the core of this detection system."
        ),
      },
    ],
  });
}

// Catatan: dengan 1 jalur, bobot tidak membedakan hasil. Tambahkan jalur lain agar skoring terasa.
async function seedQuiz(skills: Record<string, string>, pathId: string) {
  await prisma.quizQuestion.create({
    data: {
      order: 1,
      kind: QuestionKind.SINGLE,
      prompt: t("Seberapa nyaman kamu dengan pemrograman?", "How comfortable are you with programming?"),
      options: {
        create: [
          { order: 1, label: t("Belum pernah coding", "Never coded"), skillSignals: { create: [{ skillId: skills["python-basics"], level: 0 }] } },
          { order: 2, label: t("Pernah mencoba dasar-dasarnya", "Tried the basics"), skillSignals: { create: [{ skillId: skills["python-basics"], level: 1 }] } },
          { order: 3, label: t("Cukup nyaman membuat program kecil", "Comfortable building small programs"), skillSignals: { create: [{ skillId: skills["python-basics"], level: 2 }] } },
          { order: 4, label: t("Coding hampir setiap hari", "I code almost daily"), skillSignals: { create: [{ skillId: skills["python-basics"], level: 3 }] } },
        ],
      },
    },
  });

  await prisma.quizQuestion.create({
    data: {
      order: 2,
      kind: QuestionKind.SINGLE,
      prompt: t("Bagaimana pengalamanmu dengan data dan machine learning?", "What is your experience with data and machine learning?"),
      options: {
        create: [
          { order: 1, label: t("Belum ada", "None yet"), skillSignals: { create: [
            { skillId: skills["data-wrangling"], level: 0 },
            { skillId: skills["ml-fundamentals"], level: 0 },
          ] } },
          { order: 2, label: t("Pernah mengolah data (Excel/pandas)", "Have worked with data (Excel/pandas)"), skillSignals: { create: [
            { skillId: skills["data-wrangling"], level: 2 },
            { skillId: skills["ml-fundamentals"], level: 0 },
          ] } },
          { order: 3, label: t("Pernah melatih model sederhana", "Have trained a simple model"), skillSignals: { create: [
            { skillId: skills["data-wrangling"], level: 2 },
            { skillId: skills["ml-fundamentals"], level: 2 },
            { skillId: skills["model-evaluation"], level: 1 },
          ] } },
          { order: 4, label: t("Pernah membangun dan mengevaluasi model end-to-end", "Have built and evaluated a model end-to-end"), skillSignals: { create: [
            { skillId: skills["data-wrangling"], level: 3 },
            { skillId: skills["ml-fundamentals"], level: 3 },
            { skillId: skills["model-evaluation"], level: 2 },
          ] } },
        ],
      },
    },
  });

  const interests = [
    t("Iklim & lingkungan", "Climate & environment"),
    t("Kesehatan & sains", "Health & science"),
    t("Pangan & pertanian", "Food & agriculture"),
    t("Pendidikan", "Education"),
  ];
  await prisma.quizQuestion.create({
    data: {
      order: 3,
      kind: QuestionKind.MULTI,
      prompt: t("Masalah apa yang paling ingin kamu bantu selesaikan?", "Which problems do you most want to help solve?"),
      helper: t("Boleh pilih lebih dari satu.", "You can pick more than one."),
      options: {
        create: interests.map((label, i) => ({
          order: i + 1,
          label,
          pathWeights: { create: [{ pathId, weight: 1 }] },
        })),
      },
    },
  });
}

async function seedAdmin() {
  const email = process.env.SEED_ADMIN_EMAIL;
  const password = process.env.SEED_ADMIN_PASSWORD;
  if (!email || !password) return;
  const passwordHash = await bcrypt.hash(password, 10);
  await prisma.user.upsert({
    where: { email },
    update: { role: Role.ADMIN, passwordHash },
    create: { email, name: "Admin", role: Role.ADMIN, passwordHash },
  });
}

async function main() {
  // Seed menghapus semua data konten (bukan user) sebelum mengisi ulang
  if (process.env.NODE_ENV === "production" && !process.env.SEED_ALLOW_WIPE) {
    throw new Error("Seed menghapus data konten. Set SEED_ALLOW_WIPE=1 jika memang disengaja.");
  }
  await wipeContent();
  const domains = await seedDomains();
  const skills = await seedSkills();
  const path = await seedPath(skills);
  await seedCases(domains, path.id);
  await seedQuiz(skills, path.id);
  await seedAdmin();
  console.log("Seed selesai.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
