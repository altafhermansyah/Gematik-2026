# KarsaLoka — Konsep Proyek

> **Status:** sumber kebenaran untuk konsep produk, ruang lingkup, dan arsitektur konten lokal.
> **Terakhir diperbarui:** 2026-10-25
> Jika dokumen ini bertentangan dengan `KARSALOKA_PROJECT_RULES.md`, **berhenti dan tanyakan**; jangan memilih sendiri.
> Dokumen ini juga menjadi bahan dasar Laporan Karya.

---

## 1. Ringkasan

**KarsaLoka** adalah platform web yang membantu orang berpindah dari **"melihat masalah dunia"** ke **"tahu cara ikut menyelesaikannya"**.

Rantai ide intinya:

> **Masalah → Inovasi → Jalur**

Pengunjung menjelajahi masalah global di sebuah globe interaktif, membaca bagaimana inovator memecahkannya dengan teknologi dan AI (lengkap dengan sumber primer dan kutipan metrik verbatim yang bisa diperiksa), lalu mendapat roadmap belajar yang disesuaikan dengan kemampuannya agar bisa ikut menjadi bagian dari solusi.

Seluruh konten dan fitur berjalan **100% full-local tanpa login, tanpa basis data eksternal, dan tanpa panel admin**. Konten kurasi disimpan sebagai modul TypeScript bertipe di `src/content/`, sedangkan progres pengguna disimpan di browser (`localStorage`).

> *Karsa* berarti kehendak atau prakarsa, *loka* berarti dunia.

## 2. Latar belakang dan masalah

Banyak orang tahu bahwa ada masalah besar di dunia (iklim, pangan, kesehatan, pendidikan, kebencanaan, inklusi sosial), tetapi:

1. **Tidak tahu inovasi nyata** yang sudah menjawabnya dan bagaimana teknologi berperan.
2. **Tidak tahu langkah belajar** yang konkret untuk ikut berkontribusi.
3. Informasinya **tersebar**: berita di satu tempat, makalah ilmiah di tempat lain, kursus di tempat ketiga.

KarsaLoka menyatukan ketiganya dalam satu pengalaman yang berurutan dan mudah dipahami.

## 3. Tujuan

1. **Menginspirasi:** menampilkan kasus inovasi nyata dari Indonesia dan dunia, bukan sekadar teori.
2. **Mengedukasi:** tiap kasus menjelaskan masalah, solusi, peran AI/teknologi, dampak, dan metrik terukur dengan kutipan verbatim dari sumber ilmiah/primer.
3. **Memberdayakan:** kuis singkat menghasilkan jalur belajar personal; skill yang sudah dikuasai dilewati.

## 4. Pengguna sasaran

Pelajar, mahasiswa, dan pemula yang tertarik berkontribusi lewat teknologi tetapi belum tahu mulai dari mana. Mereka datang **tanpa akun** dan langsung memakai.

## 5. Konsep inti dan kaitannya dengan tema

Tema lomba: **"Empowering Global Innovators for an Intelligent Future"**

| Kata kunci tema | Diwujudkan oleh |
|---|---|
| *Global* | Globe 3D interaktif dengan studi kasus terverifikasi dari berbagai benua dan Indonesia |
| *Innovators* | Studi kasus inovator nyata beserta sumber primer dan jejak audit metrik |
| *Empowering* | Roadmap personal: dari inspirasi menjadi tindakan nyata |
| *Intelligent Future* | Peran AI di tiap kasus dan jalur belajar AI yang bertanggung jawab |

## 6. Alur pengguna

**Pengunjung (tanpa login)**

1. **Temukan:** globe 3D interaktif (`/atlas`), daftar kasus, filter per bidang masalah dan negara (Indonesia), pencarian instan, dan peralihan bahasa (`ID`/`EN`).
2. **Pahami:** halaman detail kasus (`/cases/[slug]`): masalah, solusi, peran AI, dampak, metrik beserta kutipan sumber verbatim, dan daftar referensi.
3. **Bertindak:** tombol menuju kuis diagnosa → jalur personal dengan skill graph → centang progres (tersimpan di `localStorage` browser).

## 7. Ruang lingkup

**Termasuk:**

- Beranda (`/`) + Atlas globe 3D (`/atlas`) + daftar kasus + panel ringkasan + halaman detail kasus (`/cases/[slug]`)
- Filter bidang masalah, filter khusus Indonesia (`ID`), dan pencarian kata kunci/SDG/teknologi (tersinkronisasi dengan parameter URL dan dapat dibagikan)
- Kuis diagnosa → rekomendasi jalur (rule-based di kode, tanpa LLM)
- Halaman jalur dengan skill graph interaktif dan progres lokal (`localStorage`)
- Dua bahasa (Indonesia dan Inggris)

**Sengaja tidak dibuat:**

- Basis data eksternal (PostgreSQL/Prisma telah dihapus sepenuhnya demi keandalan, kecepatan statis, dan kemudahan audit kode)
- Panel admin (`/admin/*`), autentikasi sesi, atau akun pengguna
- Progres lintas perangkat
- Konten buatan pengguna, komentar, komunitas
- Ketergantungan pada API LLM eksternal saat dinilai

## 8. Peta halaman

| Rute | Tujuan | Status |
|---|---|---|
| `/` | Landing: narasi singkat, ringkasan 6 bidang masalah, dan pintu masuk ke Atlas | **Selesai** |
| `/atlas` | Globe 3D interaktif + filter bidang/Indonesia + pencarian + panel + daftar kasus | **Selesai (Ready-Prod)** |
| `/cases/[slug]` | Detail kasus statis (SSG) + metrik berkutipan verbatim + sumber | **Selesai (Ready-Prod)** |
| `/quiz` | Kuis diagnosa → rekomendasi jalur | Direncanakan |
| `/paths` | Daftar jalur belajar | Direncanakan |
| `/paths/[slug]` | Skill graph + materi + progres lokal | Direncanakan |

## 9. Arsitektur Konten Lokal (`src/content/` & `src/modules/content/`)

Sejak keputusan arsitektur 2026-10-25, seluruh konten kurasi yang sebelumnya berada di PostgreSQL/Prisma dipindahkan menjadi modul TypeScript bertipe ketat (`as const satisfies ...`) di dalam `src/content/`:

```text
Domain (6 bidang) 1──∞ CaseStudy (16 kasus terbit)
CaseStudy ∞──∞ LearningPath             (lewat CaseStudy.paths: CasePathLink[])
LearningPath 1──∞ PathNode ∞──1 Skill 1──∞ Resource
PathNode ∞──∞ PathNode                  (lewat LearningPath.edges: [fromSlug, toSlug][])
```

### 9.1 Entitas Konten (`src/modules/content/types.ts`)

| Tipe | Berkas Sumber | Tanggung Jawab |
|---|---|---|
| `Domain` | `src/content/domains.ts` | 6 kategori bidang masalah (`climate`, `food`, `health`, `education`, `disaster`, `inclusion`), nama bilingual (`id`/`en`), warna hex 6-digit, dan urutan. |
| `CaseStudy` | `src/content/cases/*.ts` | Studi kasus inovasi: teks bilingual (`title`, `summary`, `problem`, `solution`, `aiRole`, `impact`), koordinat nyata (`lat`, `lng`, `countryCode`, `region`), `year`, `sdgs`, `technologies`, `metrics` (`CaseMetricData[]` dengan `quote` verbatim + `sourceUrl`), `sources` (`CaseSourceData[]`), dan `paths` (`CasePathLink[]`). |
| `Skill` | `src/content/skills.ts` | Katalog keahlian lintas jalur belajar. |
| `Resource` | `src/content/resources.ts` | Materi belajar terkurasi per `skillSlug`. |
| `LearningPath` | `src/content/paths.ts` | Jalur belajar beserta `nodes` (`PathNode[]`) dan graf prasyarat `edges` (`[fromSkillSlug, toSkillSlug][]`). |

### 9.2 Validasi Integritas waktu Build (`src/modules/content/validate.ts`)

Fungsi `assertContentIntegrity()` dipanggil otomatis oleh `src/modules/content/store.ts` saat pembacaan pertama (termasuk saat `generateStaticParams` pada `next build`) dan memverifikasi:
1. Keunikan seluruh `slug` (`domains`, `cases`, `skills`, `paths`).
2. Kelengkapan teks bilingual (`id` dan `en`) pada setiap kasus `PUBLISHED`.
3. Keabsahan koordinat (`lat` dalam `-90..90`, `lng` dalam `-180..180`, dan bukan placeholder `(0, 0)`), kode negara ISO-2, target SDG (`1..17`), serta tag teknologi (`kebab-case`).
4. **Jejak audit metrik**: setiap entri di `metrics` wajib memiliki angka berhingga, satuan, `quote` verbatim tidak kosong, dan `sourceUrl` yang benar-benar tercantum di `sources` kasus tersebut.
5. Keabsahan rujukan lintas-entitas (`domainSlug`, `pathSlug`, `skillSlug`) dan ketiadaan siklus (DAG) pada `LearningPath.edges`.

### 9.3 Penyimpanan Sisi Klien

| Fungsi | Lokasi |
|---|---|
| Pertanyaan kuis dan bobotnya | Kode: `src/modules/quiz/` |
| Progres node, bookmark, hasil kuis | `localStorage` di browser pengguna lewat Zustand `persist` |
| Teks antarmuka dua bahasa | `src/lib/i18n/messages.ts` |

## 10. Aturan konten

- Terdapat **16 kasus terbit (`PUBLISHED`)** di **11 negara** yang tersebar di seluruh **6 bidang masalah** (`climate`, `food`, `health`, `education`, `disaster`, `inclusion`).
- Termasuk **3 kasus nyata dari Indonesia**:
  1. *Rainforest Connection & KKI Warsi* — Pemantauan bioakustik hutan adat di Solok Selatan, Sumatra Barat (`climate`).
  2. *World Mosquito Program & UGM* — Uji klinis acak berklaster nyamuk ber-Wolbachia penekan demam berdarah di Kota Yogyakarta (`health`).
  3. *PetaBencana.id & BNPB* — Pemetaan banjir waktu nyata berbasis bot AI & crowdsourcing warga di DKI Jakarta (`disaster`).
- Setiap angka di `metrics` wajib menyertakan kutipan verbatim (`quote`) dan `sourceUrl` dari makalah peer-reviewed atau sumber primer resmi.

## 11. Stack dan keputusan teknis

| Lapisan | Pilihan |
|---|---|
| Framework | Next.js 16 (App Router), React 19, TypeScript 5 (`strict`) |
| Styling | Tailwind CSS 4 |
| Data & Konten | Modul TypeScript lokal (`src/content/`) + validator integritas (`src/modules/content/validate.ts`) |
| Globe 3D | `cobe` v2 (`requestAnimationFrame` + `globe.update()`, proyeksi matematis 2D, transisi kamera mulus) |
| Skill graph | `@xyflow/react` |
| Animasi | `framer-motion` |
| State klien | Zustand (`persist` di `localStorage`) |

## 12. Catatan keputusan

| Tanggal | Keputusan | Alasan |
|---|---|---|
| 2026-10-04 | Globe memakai `cobe` v2, bukan `react-globe.gl` | Ringan, tanpa beban Three.js penuh, mendukung proyeksi kustom |
| 2026-10-04 | **Tanpa login pengguna**; progres di `localStorage` | Juri dan pelajar dapat langsung memakai tanpa hambatan registrasi |
| 2026-10-25 | **Migrasi penuh ke arsitektur lokal (tanpa database & tanpa admin panel)** | Menghilangkan ketergantungan PostgreSQL/Prisma; seluruh halaman kasus dirender statis (SSG); setiap angka metrik wajib memiliki kutipan verbatim yang diperiksa saat build |
