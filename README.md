# KarsaLoka

KarsaLoka adalah platform web edukatif yang menghubungkan tantangan nyata di Indonesia dan dunia dengan inovasi teknologi & kecerdasan artifisial (AI) yang teruji ilmiah, lalu menerjemahkan minat pengguna menjadi jalur pengembangan keahlian yang personal. Proyek ini dikembangkan untuk kompetisi **GEMATIK VI 2026** dengan tema *"Empowering Global Innovators for an Intelligent Future"*.

## Latar Belakang

Banyak pelajar dan mahasiswa peduli terhadap krisis global seperti perubahan iklim, ketahanan pangan, kesehatan, pendidikan, kebencanaan, dan inklusi sosial, tetapi menghadapi dua kendala utama:

1. Sulit memetakan masalah nyata dan bagaimana teknologi/AI telah diterapkan serta diuji secara ilmiah di lapangan.
2. Tidak mengetahui keahlian spesifik yang perlu dipelajari agar dapat berkontribusi secara bertanggung jawab.

KarsaLoka menjembatani kepedulian pada skala global menuju langkah belajar yang konkret pada skala individu melalui alur berikut:

```text
Masalah Nyata -> Eksplorasi Globe Atlas 3D -> Studi Kasus Terverifikasi -> Kuis Diagnosis -> Jalur Keahlian -> Pelacakan Progres
```

## Arsitektur 100% Full-Local (Tanpa Basis Data & Tanpa Panel Admin)

Sejak pembaruan arsitektur **2026-10-25**, KarsaLoka berjalan **100% lokal tanpa PostgreSQL, tanpa Prisma, dan tanpa panel admin (`/admin/*`)**:

- **Konten Kurasi sebagai Kode (`src/content/`):** Seluruh 6 bidang masalah (`domains.ts`), **16 studi kasus terverifikasi** (`src/content/cases/*.ts`), jalur belajar (`paths.ts`), keahlian (`skills.ts`), dan sumber belajar (`resources.ts`) disimpan sebagai modul TypeScript bertipe ketat (`as const satisfies ...`).
- **Validasi Integritas & Jejak Audit saat Build (`src/modules/content/validate.ts`):** Fungsi `assertContentIntegrity()` memvalidasi seluruh invarian lintas-record saat build: keunikan slug, kelengkapan dwibahasa (`id` dan `en`), keabsahan koordinat (`lat`, `lng`), serta memastikan **setiap angka di `metrics` (total 41 metrik) memiliki kutipan verbatim (`quote`) dan `sourceUrl`** yang terdaftar pada sumber kasus tersebut.
- **Penyimpanan Progres di Sisi Klien:** Progres belajar, bookmark, dan hasil kuis disimpan di browser pengguna (`localStorage` melalui Zustand `persist`) tanpa memerlukan registrasi atau login.

## Fitur yang Sudah Tersedia (Ready-Prod)

1. **Halaman Beranda (`/`)**: Panggung *deep-space* (`#04060f`, aksen solid `#5df0a8`) di atas Bumi WebGL 3D lokal (`three@0.143.0` + `lenis` + aset GLB/DRACO mandiri di `public/`), 6 kartu bidang × UN SDGs, *showcase* **Telemetri Koleksi · Langsung** interaktif (Per Domain, Target SDGs, 3 Kasus Indonesia), serta 4 metrik agregat teraudit.
2. **Halaman Atlas Inovasi Global (`/atlas`)**:
   - **Globe 3D Interaktif (`AtlasGlobe.tsx` berbasis `Three.js` + GLB/DRACO)**:
     - Menampilkan **16 titik kasus nyata** di **11 negara** yang diberi warna sesuai 6 bidang masalah.
     - **Transisi Kamera Mulus (Fly-To)**: memilih kasus dari daftar atau URL otomatis memutar bola dunia ke koordinat `(lat, lng)` kasus tersebut melalui jalur sudut terpendek.
     - **Kontrol HUD & Keyboard**: tombol *Fokus Indonesia*, *Reset sudut pandang*, *Jeda/Putar otomatis*, legenda warna bidang masalah, navigasi tombol panah keyboard pada `<canvas>`, serta daftar marker alternatif untuk pembaca layar (`sr-only`).
     - **Ketahanan WebGL & Filter Kosong**: kanvas tetap hidup saat filter menghasilkan 0 kasus (menampilkan overlay reset filter tanpa menghancurkan konteks WebGL) dan mendukung pemulihan `webglcontextlost`.
   - **Filter & Pencarian Instan Tersinkronisasi URL (`AtlasExplorer.tsx`)**:
     - Filter per bidang masalah (`?domain=climate`, dll.), filter cepat **Indonesia (`?country=ID`)**, dan filter **Unggulan (`featured`)**.
     - Pencarian langsung (`?q=...`, pintasan tombol `/`) berdasarkan judul, ringkasan, lokasi, teknologi, atau nomor SDG.
     - Peralihan bahasa antarmuka dan konten secara instan (**Bahasa Indonesia `ID` / Bahasa Inggris `EN`** melalui `?lang=id|en`) dengan mempertahankan filter serta pilihan kasus aktif.
   - **Panel Ringkasan Kaya (`AtlasCasePanel.tsx`) & Daftar Kasus (`AtlasCaseList.tsx`)**:
     - Menampilkan pratinjau metrik dampak terverifikasi, badge SDG, tag teknologi, tahun, lokasi, dan tautan ke halaman detail statis.
3. **Halaman Detail Studi Kasus (`/cases/[slug]`)**:
   - Dirender secara **100% statis (SSG)** pada waktu build melalui `generateStaticParams()` dengan dukungan dwibahasa instan (`ID` / `EN`).
   - Menyajikan masalah, solusi, peran AI/teknologi, dampak nyata, kartu metrik lengkap dengan **kutipan verbatim sumber primer** beserta tautan sumbernya, serta daftar referensi yang dapat diverifikasi.

## Daftar 16 Studi Kasus Terverifikasi (6 Bidang Masalah)

| Bidang | Slug | Lokasi (`lat`, `lng`) | Negara | Sumber Utama |
|---|---|---|---|---|
| **Iklim & Lingkungan** (`climate`) | `rainforest-connection-forest-listening` | Solok Selatan, Sumatra Barat (`-1.4833, 101.25`) | `ID` | RFCx, ANTARA News, IUCN NL |
| **Iklim & Lingkungan** (`climate`) | `global-fishing-watch-dark-vessels` | Washington, D.C. / Perairan Global (`38.9059, -77.0431`) | `US` | *Nature* 2024 ([PMC10764273](https://pmc.ncbi.nlm.nih.gov/articles/PMC10764273/)) |
| **Pangan & Pertanian** (`food`) | `plantvillage-nuru-crop-disease` | Busia County, Western Kenya (`0.4608, 34.1115`) | `KE` | *Frontiers in Plant Science* 2020 ([PMC7775399](https://pmc.ncbi.nlm.nih.gov/articles/PMC7775399/)) |
| **Pangan & Pertanian** (`food`) | `plantix-crop-diagnosis-smallholders` | Hyderabad, Telangana (`17.5111, 78.2752`) | `IN` | FAO e-Agriculture, ICRISAT / PEAT |
| **Kesehatan & Sains** (`health`) | `alphafold-protein-structure-prediction` | Hinxton, Cambridgeshire (`52.0801, 0.1864`) | `GB` | *Nature* 2021 ([PMC8371605](https://pmc.ncbi.nlm.nih.gov/articles/PMC8371605/)), EMBL-EBI |
| **Kesehatan & Sains** (`health`) | `zipline-medical-drone-delivery` | Muhanga, Southern Province (`-2.0845, 29.7529`) | `RW` | WHO, Zipline, The New Times |
| **Kesehatan & Sains** (`health`) | `qure-ai-tuberculosis-screening` | Mumbai, Maharashtra (`19.1079, 72.8836`) | `IN` | *Scientific Reports* 2020 ([PMC6959311](https://pmc.ncbi.nlm.nih.gov/articles/PMC6959311/)) |
| **Kesehatan & Sains** (`health`) | `mpedigree-medicine-authentication` | Accra (`5.6123, -0.2038`) | `GH` | mPedigree, Skoll Foundation, Partnership for Safe Medicines |
| **Kesehatan & Sains** (`health`) | `wmp-wolbachia-dengue-yogyakarta` | Kota Yogyakarta, DI Yogyakarta (`-7.7956, 110.3695`) | `ID` | *New England Journal of Medicine* 2021 ([PMC8103655](https://pmc.ncbi.nlm.nih.gov/articles/PMC8103655/)) |
| **Pendidikan** (`education`) | `mindspark-adaptive-learning-india` | New Delhi (`28.6139, 77.2090`) | `IN` | *American Economic Review* 2019, J-PAL |
| **Pendidikan** (`education`) | `onebillion-tablet-math-intervention` | Lilongwe (`-13.9626, 33.7741`) | `MW` | *British Journal of Educational Technology* 2019 ([PMC6366442](https://pmc.ncbi.nlm.nih.gov/articles/PMC6366442/)) |
| **Kebencanaan** (`disaster`) | `petabencana-flood-crowdsourcing` | DKI Jakarta (`-6.2088, 106.8456`) | `ID` | Yayasan Peta Bencana, OECD OPSI |
| **Kebencanaan** (`disaster`) | `google-flood-hub-riverine-forecasting` | Dhaka, Brahmaputra-Ganges Basin (`23.8103, 90.4125`) | `BD` | *Nature* 2024 ([PMC10957424](https://pmc.ncbi.nlm.nih.gov/articles/PMC10957424/)) |
| **Inklusi Sosial** (`inclusion`) | `togo-novissi-satellite-aid-targeting` | Lomé & Rural Cantons (`6.1375, 1.2123`) | `TG` | *Nature* 2022 ([PMC8967719](https://pmc.ncbi.nlm.nih.gov/articles/PMC8967719/)) |
| **Inklusi Sosial** (`inclusion`) | `be-my-eyes-visual-assistance` | Aarhus (`56.1629, 10.2039`) | `DK` | Be My Eyes Official Story |
| **Inklusi Sosial** (`inclusion`) | `masakhane-african-languages-nlp` | Nairobi (`-1.2921, 36.8219`) | `KE` | *Findings of EMNLP* 2020 ([ACL Anthology](https://aclanthology.org/2020.findings-emnlp.195/)) |

*(Total: 16 studi kasus `PUBLISHED` lintas 6 bidang masalah di 11 negara, termasuk 3 studi kasus di Indonesia, dengan 41 metrik dampak terverifikasi).*

## Teknologi

| Kategori | Teknologi | Status Penggunaan |
|---|---|---|
| Framework | Next.js 16 (App Router), React 19 | Digunakan |
| Bahasa | TypeScript 5 (mode `strict`) | Digunakan |
| Styling | Tailwind CSS 4 melalui `@tailwindcss/postcss` | Digunakan |
| Lapisan Konten | Modul TypeScript lokal (`src/content/`) + validator `assertContentIntegrity()` | Digunakan |
| Globe 3D Atlas (`/atlas`) | `three` 0.143.0 + GLB/DRACO lokal | Digunakan |
| Bumi WebGL Beranda (`/`) | `three` 0.143.0 + `lenis` + GLB/DRACO lokal | Digunakan |
| Validasi | `zod` (skema teks dwibahasa `LocalizedText`) | Digunakan |
| Graf jalur keahlian | `@xyflow/react` | Terpasang |
| State klien | `zustand` (`persist` di `localStorage`) | Terpasang |
| Linting | ESLint 9 dengan `eslint-config-next` | Digunakan |

## Struktur Direktori

```text
.
├── .ai/
│   └── KARSALOKA_PROJECT_RULES.md     Standar rekayasa dan desain proyek
├── docs/
│   ├── PROJECT_CONCEPT.md             Konsep produk dan arsitektur konten lokal
│   └── LAPORAN_MIGRASI_LOCAL_ATLAS.md Laporan migrasi arsitektur lokal & verifikasi data
├── public/                            Aset statis
├── src/
│   ├── app/
│   │   ├── atlas/                     Halaman Globe Atlas 3D (/atlas) beserta loading & error boundary
│   │   ├── cases/[slug]/              Halaman detail studi kasus statis (/cases/[slug])
│   │   ├── globals.css                Entri Tailwind CSS
│   │   ├── layout.tsx                 Root layout
│   │   └── page.tsx                   Halaman beranda KarsaLoka
│   ├── components/
│   │   ├── atlas/                     AtlasExplorer, AtlasGlobe, AtlasCasePanel, AtlasCaseList
│   │   └── cases/                     CaseHeader, CaseSection, CaseMetrics, CaseSources
│   ├── content/
│   │   ├── cases/                     Data studi kasus per bidang (climate, disaster, education, food, health, inclusion)
│   │   ├── domains.ts                 6 bidang masalah
│   │   ├── paths.ts                   Jalur keahlian & graf prasyarat
│   │   ├── resources.ts               Materi belajar terkurasi
│   │   └── skills.ts                  Katalog keahlian
│   ├── lib/
│   │   └── i18n/                      Utilitas teks dwibahasa (localized.ts) & kamus UI (messages.ts)
│   └── modules/
│       ├── atlas/                     Query, tipe, dan konstanta matematika globe
│       ├── cases/                     Query dan tipe halaman detail kasus
│       └── content/                   Store tunggal (store.ts), validator integritas (validate.ts), & tipe (types.ts)
├── AGENTS.md                          Instruksi untuk agen AI terkait versi Next.js
├── next.config.ts
├── eslint.config.mjs
├── postcss.config.mjs
└── tsconfig.json
```

## Instalasi dan Pengembangan Lokal (Tanpa Setup Database)

Karena seluruh konten disimpan secara lokal di `src/content/`, Anda **tidak memerlukan PostgreSQL ataupun file `.env`** untuk menjalankan aplikasi:

1. Instal dependensi:

   ```bash
   npm install
   ```

2. Jalankan server pengembangan:

   ```bash
   npm run dev
   ```

3. Buka `http://localhost:3000` atau langsung ke `http://localhost:3000/atlas`.

## Perintah Pengembangan & Verifikasi

| Perintah | Fungsi |
|---|---|
| `npm run dev` | Menjalankan server pengembangan Next.js |
| `npm run typecheck` | Menjalankan pemeriksaan tipe TypeScript (`tsc --noEmit`) |
| `npm run lint` | Menjalankan pemeriksaan ESLint |
| `npm run build` | Memvalidasi integritas seluruh konten lokal (`assertContentIntegrity`) dan membangun produksi statis (`next build`) |
| `npm run start` | Menjalankan server hasil build produksi |