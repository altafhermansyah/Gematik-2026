# KarsaLoka

KarsaLoka adalah platform web interaktif yang memetakan tantangan nyata di Indonesia dan dunia beserta inovasi teknologi dan kecerdasan artifisial (AI) yang telah teruji secara ilmiah di lapangan, lengkap dengan kutipan metrik verbatim dari sumber primer. Proyek ini dikembangkan untuk kompetisi **GEMATIK VI 2026** dengan tema *"Empowering Global Innovators for an Intelligent Future"*.

## Latar Belakang & Alur Produk

Banyak pelajar, mahasiswa, dan pengembang muda peduli terhadap isu global seperti perubahan iklim, ketahanan pangan, kesehatan, pendidikan, kebencanaan, dan inklusi sosial, namun kesulitan menemukan bukti ilmiah yang terpusat dan terverifikasi mengenai bagaimana teknologi/AI bekerja langsung di lapangan.

KarsaLoka menyatukan eksplorasi spasial 3D, audit sumber primer, dan asisten tanya-jawab berbasis bukti dalam alur berikut:

```text
Masalah Global & 6 Bidang -> Eksplorasi Beranda Cosmos & Atlas Globe 3D -> Dossier Studi Kasus Terverifikasi -> Asisten KarsaLoka (Berbasis Kutipan)
```

## Arsitektur 100% Full-Local (Tanpa Basis Data & Tanpa Login)

KarsaLoka berjalan **100% lokal tanpa PostgreSQL, tanpa Prisma, tanpa login pengguna, dan tanpa panel admin**:

- **Konten Kurasi sebagai Kode (`src/content/`):** Seluruh **6 bidang masalah** (`domains.ts`) dan **16 studi kasus terverifikasi** (`src/content/cases/*.ts`) disimpan sebagai modul TypeScript bertipe ketat (`as const satisfies ...`) beserta file skema/referensi internal (`paths.ts`, `skills.ts`, `resources.ts`).
- **Validasi Integritas saat Build (`src/modules/content/validate.ts`):** Fungsi `assertContentIntegrity()` memvalidasi seluruh invarian lintas entitas secara otomatis saat konten dibaca atau saat `next build`: keunikan slug, kelengkapan dwibahasa (`id` dan `en`), keabsahan koordinat geografis (`lat`, `lng`), serta memastikan **setiap dari 41 metrik memiliki kutipan verbatim (`quote`) dan `sourceUrl`** yang tercatat pada `sources` kasus terkait.
- **Tersedia secara Statis & Tangguh (*Offline-Resilient*):** Seluruh 16 dossier kasus dan banner Open Graph-nya dirender statis (SSG) pada waktu build, sementara Asisten KarsaLoka memiliki *fallback* lokal deterministik bila tidak ada kunci API Gemini.

## Fitur yang Sudah Terimplementasi

1. **Halaman Beranda Cosmos (`/`)**:
   - Panggung *deep-space* (`#040914` dengan aksen `#5df0a8`) di atas Bumi WebGL 3D (`PlanetCanvas.tsx` + `CosmosViewport.tsx` berbasis `three@0.143.0`, `lenis`, dan aset GLB/DRACO mandiri di `public/`).
   - 6 kartu bidang masalah terhubung dengan UN SDGs, *showcase* interaktif **Telemetri Koleksi** (`InteractiveTelemetryShowcase.tsx` dengan 3 tab: Per Domain, Target SDGs, dan 3 Kasus Indonesia), serta ringkasan 4 metrik agregat (`16` studi kasus, `11` negara, `41` metrik, `12` UN SDGs).
2. **Halaman Atlas Inovasi Global (`/atlas`)**:
   - **Globe 3D Interaktif (`AtlasGlobe.tsx` berbasis `three@0.143.0` + `GLTFLoader` + `DRACOLoader` + `earth-builder.ts`):**
     - Menampilkan **16 titik kasus nyata** di **11 negara** dengan warna sesuai 6 bidang masalah.
     - **Transisi Kamera Mulus (*Fly-To*):** memilih kasus dari daftar, rel, atau parameter URL memutar globe menuju koordinat `(lat, lng)` kasus tersebut.
     - **Kontrol HUD & Aksesibilitas Keyboard:** tombol *Fokus Indonesia*, *Reset sudut pandang*, *Jeda/Putar otomatis*, legenda warna, rotasi tombol panah pada `<canvas>`, daftar marker `sr-only`, pemulihan `webglcontextlost`, dan penyesuaian `prefers-reduced-motion`.
   - **Filter, Pencarian, & Navigasi Tersinkronisasi URL (`AtlasExplorer.tsx`, `AtlasCaseRail.tsx`, `AtlasCaseSheet.tsx`):**
     - Filter per bidang masalah (`?domain=climate`, dll.), filter cepat **Indonesia (`?country=ID`)**, dan filter **Unggulan (`featured`)**.
     - Pencarian instan (`?q=...`, pintasan `/`) berdasarkan judul, ringkasan, lokasi, teknologi, atau nomor SDG.
     - Pergantian bahasa antarmuka dan konten secara instan (`?lang=id|en`) sambil mempertahankan filter serta kasus aktif.
     - Rel *filmstrip* kertas (`AtlasCaseRail`) dan laci ringkasan geser (`AtlasCaseSheet`) untuk membaca metrik kunci dan menavigasi langsung ke halaman detail kasus.
3. **Halaman Detail Studi Kasus (`/cases/[slug]`)**:
   - Dirender secara **statis (SSG)** untuk seluruh 16 kasus melalui `generateStaticParams()`.
   - Menyajikan narasi masalah, solusi, peran AI/teknologi, dampak lapangan, kartu metrik lengkap dengan **kutipan verbatim sumber primer**, daftar referensi terverifikasi, serta peralihan bahasa `ID`/`EN`.
4. **Asisten KarsaLoka (`AssistantDrawer.tsx` & `/api/assistant`)**:
   - Laci tanya-jawab *evidence-grounded* yang tersedia di seluruh halaman, membatasi jawaban hanya pada cakupan 16 studi kasus, 6 bidang, UN SDGs, teknologi, dan metrik terverifikasi (`isQueryInDomain()`).
   - Mendukung integrasi **Google Gemini API** secara opsional di sisi server (`GEMINI_API_KEY` / `GOOGLE_GENERATIVE_AI_API_KEY`) dan secara otomatis jatuh ke **mesin lokal deterministik** (`src/modules/assistant/local-engine.ts`) saat berjalan tanpa kunci API maupun dalam kondisi offline.
5. **Optimalisasi SEO, Social Share Banner (`OG`), & GEO (`src/lib/seo/`)**:
   - **Open Graph & Twitter Card (`1200×630` PNG):** Banner platform (`/opengraph-image`) dan **16 banner dinamis per studi kasus yang di-prerender SSG** (`/cases/[slug]/opengraph-image`) dengan tema Dark Cosmos Observatory melalui `next/og`.
   - **Metadata Kanonikal & Bilingual:** `metadataBase`, `canonical`, `alternates.languages` (`id-ID`, `en-US`, `x-default`), `openGraph`, serta `twitter:card = "summary_large_image"`.
   - **Structured Data (`JSON-LD`):** `@graph` (`WebSite`, `EducationalOrganization`, `ItemList`) pada `/` dan `TechArticle` (beserta `GeoCoordinates` & `citation` sumber primer) pada `/cases/[slug]` dengan sanitasi `\u003c`.
   - **Crawling & GEO Endpoints:** `/sitemap.xml`, `/robots.txt` (ramah bot AI `OAI-SearchBot`, `GPTBot`, `ClaudeBot`, `PerplexityBot`, `Google-Extended` dan memblokir `/api/`), `/manifest.webmanifest`, serta dokumen Markdown terstruktur `/llms.txt` dan `/llms-full.txt`.

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

*(Total: **16 studi kasus `PUBLISHED`** lintas 6 bidang masalah di 11 negara, termasuk 3 studi kasus di Indonesia, dengan **41 metrik dampak** terverifikasi).*

## Teknologi

| Kategori | Teknologi | Status Penggunaan |
|---|---|---|
| Framework | Next.js `16.3.8` (App Router), React `19.2.8` | Digunakan |
| Bahasa | TypeScript 5 (mode `strict`) | Digunakan |
| Styling | Tailwind CSS 4 melalui `@tailwindcss/postcss` | Digunakan |
| Tipografi Mandiri | `@fontsource-variable/bricolage-grotesque` & `@fontsource-variable/familjen-grotesk` | Digunakan |
| Lapisan Konten | Modul TypeScript lokal (`src/content/`) + validator `assertContentIntegrity()` | Digunakan |
| Globe 3D (`/` & `/atlas`) | `three@0.143.0` + `GLTFLoader`/`DRACOLoader` + aset lokal `public/globe/` & `public/draco/` | Digunakan |
| Smooth Scroll | `lenis@^1.3.27` (`SmoothScrollProvider.tsx` & `CosmosViewport.tsx`) | Digunakan |
| Validasi | `zod@^4.6.5` (skema teks dwibahasa `LocalizedText`) | Digunakan |
| Asisten AI | `/api/assistant` (Gemini API opsional + `local-engine.ts` fallback) | Digunakan |
| SEO & GEO | `next/og` (`ImageResponse`), JSON-LD, `/llms.txt`, `/llms-full.txt`, `sitemap.xml`, `robots.txt` | Digunakan |
| Pengujian & Lint | `node:test` (`npm test`), ESLint 9 (`eslint-config-next`) | Digunakan |

## Struktur Direktori

```text
.
├── .ai/
│   └── KARSALOKA_PROJECT_RULES.md     Konstitusi rekayasa dan desain proyek
├── docs/
│   ├── PROJECT_CONCEPT.md             Konsep produk, peta halaman, dan arsitektur konten lokal
│   └── LAPORAN_MIGRASI_LOCAL_ATLAS.md Laporan arsitektur lokal & verifikasi data
├── public/
│   ├── draco/                         Decoder WebAssembly DRACO mandiri
│   └── globe/                         Model planet.glb dan tekstur awan/cahaya lokal
├── scripts/
│   └── register-at-alias.mjs          Resolver alias `@/` untuk Node test runner
├── src/
│   ├── app/
│   │   ├── api/assistant/             Endpoint POST Asisten KarsaLoka
│   │   ├── atlas/                     Halaman Atlas 3D (/atlas) beserta loading & error boundary
│   │   ├── cases/[slug]/              Halaman detail studi kasus SSG + opengraph-image dinamis
│   │   ├── llms.txt/ & llms-full.txt/ Endpoint teks terstruktur untuk model AI (GEO)
│   │   ├── opengraph-image.tsx        Banner Open Graph utama (1200×630 PNG)
│   │   ├── manifest.ts                Web App Manifest (/manifest.webmanifest)
│   │   ├── robots.ts                  Konfigurasi crawler SEO & AI (/robots.txt)
│   │   ├── sitemap.ts                 Peta situs XML (/sitemap.xml)
│   │   ├── globals.css                Sistem desain, token warna & tipografi
│   │   ├── layout.tsx                 Root layout, metadataBase & AssistantDrawer global
│   │   └── page.tsx                   Beranda Cosmos (/), telemetri interaktif & JSON-LD
│   ├── components/
│   │   ├── assistant/                 AssistantDrawer
│   │   ├── atlas/                     AtlasExplorer, AtlasGlobe, AtlasCaseRail, AtlasCaseSheet
│   │   ├── cases/                     CaseDetailView, CaseHeader, CaseMetrics, CaseSection, CaseSources
│   │   ├── home/                      CosmosViewport, PlanetCanvas, InteractiveTelemetryShowcase
│   │   └── site/                      SiteHeader, SiteFooter, LocaleSwitch, LocaleDocumentLang, SmoothScrollProvider
│   ├── content/
│   │   ├── cases/                     16 studi kasus per bidang (climate, disaster, education, food, health, inclusion)
│   │   ├── domains.ts                 6 bidang masalah
│   │   ├── paths.ts, resources.ts, skills.ts   Entitas pendukung validasi konten lokal
│   │   └── ...
│   ├── lib/
│   │   ├── i18n/                      Utilitas dwibahasa (localized.ts), kamus UI (messages.ts), URL & event
│   │   ├── motion/                    Hook indikator berbagi (useSharedIndicator.ts)
│   │   └── seo/                       Metadata, JSON-LD, renderer kartu OG 1200×630, & generator llms.txt
│   └── modules/
│       ├── assistant/                 Knowledge prompt & mesin fallback lokal deterministik
│       ├── atlas/                     Query dan tipe halaman Atlas
│       ├── cases/                     Query dan tipe halaman detail kasus
│       ├── content/                   Store tunggal (store.ts), validator (validate.ts), & tipe (types.ts)
│       ├── home/                      Konversi koordinat lat/lng ke permukaan bola 3D
│       └── three/                     Loader & pembangun scene Bumi 3D lokal (earth-builder.ts)
├── AGENTS.md                          Instruksi agen Next.js 16 (dikelola oleh next dev)
├── DESIGN.md                          Pedoman desain visual, palet & tipografi aktual
├── next.config.ts
├── eslint.config.mjs
├── postcss.config.mjs
└── tsconfig.json
```

## Instalasi dan Pengembangan Lokal

Seluruh aplikasi berjalan lokal tanpa setup database:

1. Instal dependensi:

   ```bash
   npm install
   ```

2. *(Opsional)* Tambahkan file `.env` bila ingin mengaktifkan mode Gemini API pada Asisten KarsaLoka atau mengatur URL kanonikal produksi (aplikasi tetap berjalan penuh tanpa `.env`):

   ```env
   GEMINI_API_KEY=...
   NEXT_PUBLIC_SITE_URL=https://karsaloka.vercel.app
   ```

3. Jalankan server pengembangan:

   ```bash
   npm run dev
   ```

4. Buka `http://localhost:3000`, `http://localhost:3000/atlas`, atau langsung ke studi kasus seperti `http://localhost:3000/cases/wmp-wolbachia-dengue-yogyakarta`.

## Perintah Pengembangan & Verifikasi

| Perintah | Fungsi |
|---|---|
| `npm run dev` | Menjalankan server pengembangan Next.js |
| `npm run typecheck` | Menjalankan pemeriksaan tipe TypeScript (`tsc --noEmit`) |
| `npm test` | Menjalankan unit test Node (`src/**/*.test.ts`: i18n, SEO/GEO, asisten lokal, validasi konten, & koordinat 3D) |
| `npm run lint` | Menjalankan pemeriksaan ESLint |
| `npm run build` | Memvalidasi integritas seluruh konten lokal (`assertContentIntegrity`) dan membangun produksi statis & SSG (`next build`) |
| `npm run start` | Menjalankan server hasil build produksi |
