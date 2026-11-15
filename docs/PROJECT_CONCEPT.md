# KarsaLoka: Konsep Proyek

> **Status:** Sumber kebenaran untuk konsep produk, ruang lingkup aktual, peta halaman, dan arsitektur konten lokal.
> **Terakhir diperbarui:** 2026-11-15
> Dokumen ini selaras sepenuhnya dengan kondisi codebase aktual dan menjadi rujukan laporan karya GEMATIK VI 2026.

---

## 1. Ringkasan

**KarsaLoka** adalah platform web edukatif dan arsip bukti terbuka yang menjembatani rasa ingin tahu masyarakat terhadap krisis global menuju pemahaman berbasis bukti ilmiah mengenai inovasi teknologi & AI yang benar-benar sudah bekerja di lapangan.

Alur inti pengalaman pengguna:

> **Eksplorasi Masalah Dunia &rarr; Atlas 3D Interaktif &rarr; Dossier Studi Kasus Terverifikasi &rarr; Asisten Tanya-Jawab Berbasis Kutipan**

Pengunjung menjelajahi masalah global melalui panggung Cosmos dan globe 3D interaktif, membaca bagaimana inovator memecahkannya dengan teknologi dan AI (lengkap dengan **41 metrik dampak berkutipan verbatim** serta tautan sumber primer), lalu dapat bertanya langsung ke **Asisten KarsaLoka** untuk membandingkan kasus, mencari inovasi di Indonesia, atau memeriksa angka dari jurnal ilmiah tanpa keluar dari koridor fakta yang terverifikasi.

Seluruh konten berjalan **100% full-local tanpa login, tanpa basis data eksternal, dan tanpa panel admin**.

> *Karsa* berarti kehendak atau prakarsa; *loka* berarti dunia.

## 2. Latar Belakang & Masalah

Banyak pelajar, mahasiswa, dan pengembang teknologi mengetahui krisis besar di dunia (iklim, pangan, kesehatan, pendidikan, kebencanaan, dan inklusi sosial), namun menghadapi tiga hambatan informasi:

1. **Sulit menemukan bukti lapangan yang terkurasi:** informasi tersebar antara berita populer, laporan lembaga internasional, dan makalah ilmiah *peer-reviewed*.
2. **Klaim dampak sering lepas dari sumber aslinya:** angka dampak kerap dikutip ulang tanpa kutipan kalimat asli atau tautan referensi primer.
3. **Kurangnya eksplorasi spasial & kontekstual dwibahasa:** belum banyak arsip terbuka yang memadukan konteks geografis 3D, ringkasan peran teknis AI, dan akses dwibahasa (Indonesia & Inggris) secara instan.

KarsaLoka menyatukan ketiganya dalam satu platform web yang cepat, dapat diaudit di tingkat kode, dan siap pakai tanpa login.

## 3. Tujuan

1. **Menginspirasi:** menampilkan **16 studi kasus nyata** di **11 negara** (termasuk **3 studi kasus dari Indonesia**), bukan konsep hipotetis.
2. **Mengedukasi:** setiap kasus merangkum masalah, solusi, peran AI/teknologi, dampak lapangan, teknologi kunci, target UN SDGs, serta metrik kuantitatif beserta kutipan verbatim sumber primer.
3. **Mempercepat Pencarian Fakta:** menghadirkan eksplorasi 3D terintegrasi URL (`/atlas`), asisten tanya-jawab berbasis bukti (`AssistantDrawer`), serta indeks terstruktur untuk mesin pencari konvensional dan AI generatif (`JSON-LD` & `/llms.txt`).

## 4. Pengguna Sasaran

Pelajar, mahasiswa, peneliti muda, juri kompetisi, dan praktisi teknologi yang ingin mempelajari penerapan AI/teknologi untuk dampak sosial. Pengunjung datang **tanpa akun** dan langsung mengakses seluruh konten serta asisten.

## 5. Konsep Inti & Kaitannya dengan Tema Lomba

Tema kompetisi **GEMATIK VI 2026**: **"Empowering Global Innovators for an Intelligent Future"**

| Kata Kunci Tema | Diwujudkan Oleh |
|---|---|
| *Global* | Globe Bumi 3D interaktif (`Three.js`) dengan 16 titik studi kasus terverifikasi lintas 11 negara dan 6 bidang masalah |
| *Innovators* | Dossier mendalam berisi cara kerja inovator nyata beserta daftar referensi primer dan jejak audit metrik |
| *Empowering* | Akses pengetahuan dwibahasa terbuka tanpa registrasi, dilengkapi Asisten KarsaLoka yang membantu memetakan studi kasus sesuai minat |
| *Intelligent Future* | Penjelasan teknis peran AI di setiap studi kasus (bioakustik hutan, diagnostik citra medis/tanaman, peramalan banjir, *satellite aid targeting*, NLP) beserta *metadata GEO* untuk ekosistem AI modern |

## 6. Alur Pengguna Aktual

**Pengunjung (tanpa login, dwibahasa `ID` / `EN`)**

1. **Jelajahi Beranda (`/`)**: Memahami misi platform di atas panggung Cosmos Earth 3D, meninjau 6 bidang masalah & target UN SDGs, serta mengeksplorasi telemetri langsung (Per Domain, Target SDGs, 3 Kasus Indonesia).
2. **Eksplorasi Atlas 3D (`/atlas`)**: Memutar globe 3D, memfilter bidang masalah / kasus Indonesia / unggulan, mencari kata kunci atau nomor SDG (`/`), lalu membuka pratinjau cepat melalui filmstrip rel kertas (`AtlasCaseRail`) dan laci ringkasan (`AtlasCaseSheet`).
3. **Audit Dossier Kasus (`/cases/[slug]`)**: Membaca penjabaran lengkap masalah, solusi, peran AI, dampak, kutipan verbatim pada setiap angka metrik, dan tautan sumber primer resmi.
4. **Diskusi dengan Asisten KarsaLoka (`AssistantDrawer`)**: Mengajukan pertanyaan terfokus (tersedia di setiap halaman) dengan respons yang menautkan langsung ke studi kasus dan angka terverifikasi, baik melalui Gemini API maupun *fallback* lokal offline.

## 7. Ruang Lingkup Produk

**Tersedia & Terimplementasi Penuh:**

- Beranda Cosmos (`/`) dengan Bumi 3D `Three.js`, `Lenis` smooth scroll, dan `InteractiveTelemetryShowcase`
- Atlas 3D interaktif (`/atlas`) dengan filter URL-synced, pencarian instan (`/`), filmstrip `AtlasCaseRail`, laci `AtlasCaseSheet`, dan fallback aksesibilitas (`sr-only` + keyboard)
- 16 halaman detail studi kasus SSG (`/cases/[slug]`) dengan kutipan metrik verbatim dan pengalih bahasa `ID`/`EN`
- Asisten KarsaLoka (`AssistantDrawer` + `POST /api/assistant`) berbasis data lokal dengan *guardrail* domain, dukungan opsional Gemini API, dan mesin lokal deterministik
- Fondasi **SEO, Social Share Banner (`next/og`), & GEO**: `1200×630` PNG `/opengraph-image` + 16 `/cases/[slug]/opengraph-image`, JSON-LD (`WebSite`, `EducationalOrganization`, `ItemList`, `TechArticle`), `sitemap.xml`, `robots.txt`, `manifest.webmanifest`, `/llms.txt`, dan `/llms-full.txt`

**Sengaja Tidak Dibuat (Di Luar Ruang Lingkup Rilis Ini):**

- Basis data eksternal (PostgreSQL/Prisma telah dihapus sepenuhnya)
- Panel admin (`/admin/*`), autentikasi pengguna, akun profil, atau penyimpanan riwayat lintas perangkat
- Rute `/quiz`, `/paths`, `/paths/[slug]`, kuis diagnosa, ataupun graf keahlian interaktif di antarmuka pengguna *(file data `paths.ts`, `skills.ts`, dan `resources.ts` dipertahankan sebagai bagian modul validasi konten internal saja)*

## 8. Peta Halaman & Endpoint Aktual

| Rute / Endpoint | Tujuan | Status |
|---|---|---|
| `/` | Beranda Cosmos, globe Bumi 3D, 6 pilar bidang, telemetri interaktif & JSON-LD | **Selesai (Produksi)** |
| `/atlas` | Atlas 3D interaktif, filter bidang/Indonesia/unggulan, pencarian, rel & sheet | **Selesai (Produksi)** |
| `/cases/[slug]` | Dossier statis SSG (16 kasus), metrik verbatim, sumber primer & JSON-LD `TechArticle` | **Selesai (Produksi)** |
| `/api/assistant` | API POST Asisten KarsaLoka (Gemini API opsional + fallback lokal deterministik) | **Selesai (Produksi)** |
| `/opengraph-image` | Banner sosial PNG `1200×630` utama untuk `/` & `/atlas` | **Selesai (Statis)** |
| `/cases/[slug]/opengraph-image` | 16 banner sosial PNG `1200×630` spesifik per studi kasus | **Selesai (SSG)** |
| `/llms.txt` & `/llms-full.txt` | Indeks dan dossier Markdown lengkap untuk mesin pencari AI (GEO) | **Selesai (Statis)** |
| `/sitemap.xml`, `/robots.txt`, `/manifest.webmanifest` | Peta situs, aturan crawler ramah AI, & Web App Manifest | **Selesai (Statis)** |

## 9. Arsitektur Konten Lokal (`src/content/` & `src/modules/content/`)

Seluruh konten kurasi berada di repositori kode (`src/content/`) sebagai modul TypeScript bertipe ketat (`as const satisfies ...`):

- `src/content/domains.ts`: 6 bidang masalah (`climate`, `food`, `health`, `education`, `disaster`, `inclusion`) dengan nama dwibahasa, warna hex 6 digit, dan urutan.
- `src/content/cases/*.ts`: 16 studi kasus `PUBLISHED` lengkap dengan teks dwibahasa (`id`/`en`), koordinat geografis (`lat`, `lng`, `countryCode`, `region`), tahun, daftar UN SDGs, tag teknologi, `metrics` (berkutipan verbatim + `sourceUrl`), serta `sources`.
- `src/modules/content/store.ts` & `src/modules/content/validate.ts`: Titik akses tunggal yang memanggil `assertContentIntegrity()` untuk memverifikasi kelengkapan dwibahasa, keunikan slug, keabsahan koordinat, serta kesesuaian `sourceUrl` setiap metrik terhadap daftar sumber kasus.

## 10. Stack Teknis & Catatan Keputusan

| Tanggal | Keputusan | Alasan |
|---|---|---|
| 2026-10-04 | Tanpa login pengguna | Pengunjung dan juri langsung memakai platform tanpa hambatan registrasi |
| 2026-10-25 | Migrasi ke arsitektur 100% lokal (tanpa DB & tanpa `/admin/*`) | Menghapus ketergantungan PostgreSQL/Prisma; seluruh studi kasus dirender statis SSG dengan validasi integritas kutipan saat build |
| 2026-11-13 | Penyatuan visual 3D pada `three@0.143.0` + GLB/DRACO mandiri & Beranda Cosmos (`Lenis`) | Menghapus `cobe` serta aset CDN eksternal; baik `/` maupun `/atlas` menggunakan model Bumi 3D mandiri dari `public/globe/` dan `public/draco/` |
| 2026-11-15 | Penyederhanaan cakupan pada Atlas + Asisten + SEO/GEO & OG Banner | Menghapus sisa ketergantungan Prisma, memfokuskan produk pada eksplorasi 16 studi kasus + Asisten KarsaLoka (tanpa `/quiz` & `/paths`), serta melengkapi JSON-LD, `/llms.txt`, `/llms-full.txt`, dan 17 banner OG `1200×630` PNG |
