# KarsaLoka

KarsaLoka adalah platform web edukatif yang menghubungkan isu global dengan inovasi nyata, lalu menerjemahkan minat pengguna menjadi jalur pengembangan keahlian yang personal. Proyek ini dikembangkan untuk kompetisi GEMATIK VI 2026 dengan tema "Empowering Global Innovators for an Intelligent Future".

## Latar Belakang

Banyak pelajar dan mahasiswa peduli terhadap krisis global seperti perubahan iklim, ketahanan pangan, kesehatan, pendidikan, dan kebencanaan, tetapi menghadapi dua kendala:

1. Sulit memetakan masalah mana yang mendesak dan bagaimana teknologi telah diterapkan secara nyata untuk mengatasinya.
2. Tidak mengetahui keahlian spesifik yang perlu dipelajari agar dapat berkontribusi di era kecerdasan artifisial.

KarsaLoka menjembatani kepedulian pada skala global menuju langkah belajar yang konkret pada skala individu, melalui alur berikut:

```text
Isu global -> Eksplorasi atlas -> Studi kasus inovasi -> Kuis diagnosis -> Jalur keahlian -> Pelacakan progres
```

## Status Pengembangan

Proyek berada pada tahap awal pengembangan (versi `0.1.0`). Skema basis data 10 tabel sudah dirancang dan dimigrasikan. Bagian berikut membedakan fitur yang sudah ada di repositori dan fitur yang masih direncanakan.

### Sudah diimplementasikan

- **Skema basis data 10 tabel** di [`prisma/schema.prisma`](prisma/schema.prisma) untuk domain atlas (`Domain`, `Case`, `CaseSource`), jalur keahlian (`Path`, `PathNode`, `PathEdge`, `Skill`, `Resource`), jembatan (`CasePath`), dan akun admin (`AdminUser`). Progres belajar, bookmark, dan hasil kuis disimpan di sisi klien (`localStorage` lewat Zustand `persist`). Kuis berada di kode (`modules/quiz`). Konten teks yang dilokalkan disimpan sebagai JSON `{ "id": "...", "en": "..." }` dan divalidasi dengan Zod.
- **Data awal (seed)** di [`prisma/seed.ts`](prisma/seed.ts) berisi data studi kasus terverifikasi, domain, jalur belajar, node graph, skill, resource, dan akun admin awal.
- **Halaman atlas (`/atlas`)** berupa Server Component yang mengambil studi kasus berstatus `PUBLISHED` dari basis data dan meneruskannya ke komponen globe dan daftar.
- **Komponen globe interaktif** ([`AtlasGlobe.tsx`](src/components/atlas/AtlasGlobe.tsx)) berbasis `cobe` dengan rotasi otomatis, rotasi melalui drag (pointer dan sentuh), marker berwarna sesuai bidang, panel studi kasus, dan daftar alternatif yang dapat diakses keyboard.

### Sebagian atau belum berfungsi

- Label marker mengarah ke `/cases/[slug]`, tetapi rute detail tersebut **sedang disiapkan**.
- Halaman beranda (`/`) dan metadata di [`layout.tsx`](src/app/layout.tsx) masih berupa template awal.

### Direncanakan

- Filter dan pencarian studi kasus pada atlas via parameter URL.
- Halaman detail studi kasus (masalah, inovasi, peran AI/teknologi, dampak, dan sumber).
- Kuis diagnosis dengan skoring deterministik berbasis aturan (`modules/quiz`).
- Visualisasi jalur keahlian dengan `@xyflow/react` dan pelacakan progres lokal di browser.
- Antarmuka admin untuk mengelola studi kasus dan jalur keahlian.
- Autentikasi sesi admin (pengunjung tidak memerlukan login).

## Teknologi

Tabel berikut hanya mencantumkan dependensi langsung yang terdaftar di [`package.json`](package.json).

| Kategori | Teknologi | Status penggunaan |
|---|---|---|
| Framework | Next.js 16 (App Router), React 19 | Digunakan |
| Bahasa | TypeScript 5 (mode `strict`) | Digunakan |
| Styling | Tailwind CSS 4 melalui `@tailwindcss/postcss` | Digunakan |
| Basis data | PostgreSQL | Digunakan |
| ORM | Prisma 7, generator `prisma-client`, driver adapter `@prisma/adapter-pg` | Digunakan |
| Globe | `cobe` 2 | Digunakan |
| Graf jalur keahlian | `@xyflow/react` | Terpasang |
| Animasi | `framer-motion` | Terpasang |
| State klien | `zustand` (`persist` untuk progres lokal) | Terpasang |
| Validasi | `zod` | Digunakan |
| Hashing kata sandi | `bcryptjs` | Digunakan (AdminUser seed) |
| Utilitas | `clsx`, `tailwind-merge`, `lucide-react` | Digunakan |
| Linting | ESLint 9 dengan `eslint-config-next` | Digunakan |

## Arsitektur

KarsaLoka dirancang sebagai **modular monolith**: satu aplikasi Next.js dan satu basis data PostgreSQL, dengan pemisahan tanggung jawab per domain (atlas, studi kasus, jalur keahlian, kuis, progres, admin). Pada tahap saat ini, pemisahan modul tersebut baru tercermin pada skema basis data; struktur kode aplikasi masih minimal.

Prinsip yang sudah diterapkan pada kode yang ada:

- Pengambilan data dilakukan di Server Component (`src/app/atlas/page.tsx`), lalu hanya data yang diperlukan diteruskan ke komponen klien.
- Komponen yang membutuhkan WebGL dan event browser (`AtlasGlobe`) ditandai `"use client"` dan dibatasi sekecil mungkin.
- Prisma Client dibuat sekali di [`src/lib/prisma.ts`](src/lib/prisma.ts) dan disimpan di `globalThis` selama pengembangan untuk mencegah koneksi ganda saat hot reload.
- Query menggunakan `select` agar hanya kolom yang dibutuhkan yang diambil.

### Struktur Direktori

```text
.
├── .ai/
│   └── KARSALOKA_PROJECT_RULES.md   Standar rekayasa dan desain proyek
├── docs/
│   └── PROJECT_CONCEPT.md           Konsep produk, peta halaman, dan tanggung jawab tabel
├── prisma/
│   ├── migrations/                  Riwayat migrasi Prisma
│   ├── schema.prisma                Skema basis data PostgreSQL (10 tabel)
│   └── seed.ts                      Skrip pengisian data awal terverifikasi
├── public/                          Aset statis
├── src/
│   ├── app/
│   │   ├── atlas/page.tsx           Halaman atlas (Server Component)
│   │   ├── globals.css              Entri Tailwind CSS dan token warna dasar
│   │   ├── layout.tsx               Root layout
│   │   └── page.tsx                 Halaman beranda
│   ├── components/
│   │   └── atlas/AtlasGlobe.tsx     Globe interaktif berbasis cobe
│   ├── generated/prisma/            Prisma Client hasil generate (diabaikan Git)
│   └── lib/
│       └── prisma.ts                Instans tunggal Prisma Client
├── prisma.config.ts                 Konfigurasi Prisma CLI (schema, migrasi, seed, URL)
├── AGENTS.md                        Instruksi untuk agen AI terkait versi Next.js
├── next.config.ts
├── eslint.config.mjs
├── postcss.config.mjs
└── tsconfig.json                    Alias impor `@/*` mengarah ke `src/*`
```

## Prasyarat

- **Node.js** versi `^20.19`, `^22.12`, atau `>=24.0`. Rentang ini adalah irisan kebutuhan Next.js 16 (`>=20.9.0`) dan Prisma 7.
- **npm**, sesuai lockfile `package-lock.json` yang tersedia.
- **PostgreSQL** yang dapat diakses dari mesin lokal, baik instalasi lokal, kontainer, maupun layanan terkelola.

## Instalasi dan Pengembangan Lokal

1. Clone repositori dan masuk ke direktorinya:

   ```bash
   git clone https://github.com/altafhermansyah/Gematik-2026
   cd Gematik-2026
   ```

2. Instal dependensi:

   ```bash
   npm install
   ```

3. Siapkan berkas `.env` dari `.env.example`:

   ```bash
   cp .env.example .env
   ```

   Isi variabel di `.env`:

   ```env
   DATABASE_URL="postgresql://<user>:<password>@localhost:5432/<nama_database>?schema=public"
   SEED_ADMIN_EMAIL="admin@karsaloka.id"
   SEED_ADMIN_PASSWORD="supersecretpassword123"
   ```

4. Jalankan migrasi basis data dan generate client:

   ```bash
   npx prisma migrate dev
   npx prisma generate
   ```

5. Isi data awal (seed) studi kasus, domain, jalur, skill, materi, dan akun admin:

   ```bash
   npx prisma db seed
   ```

6. Jalankan server pengembangan:

   ```bash
   npm run dev
   ```

7. Buka `http://localhost:3000/atlas` di browser.

## Variabel Lingkungan

Contoh konfigurasi tersedia di [`.env.example`](.env.example).

| Variabel | Wajib | Digunakan oleh | Keterangan |
|---|---|---|---|
| `DATABASE_URL` | Ya | `prisma.config.ts`, `src/lib/prisma.ts` | String koneksi PostgreSQL untuk Prisma CLI dan Prisma Client (`@prisma/adapter-pg`). |
| `SEED_ADMIN_EMAIL` | Ya (saat seed) | `prisma/seed.ts` | Email untuk akun awal administrator. |
| `SEED_ADMIN_PASSWORD` | Ya (saat seed) | `prisma/seed.ts` | Kata sandi untuk akun administrator (minimal 12 karakter, di-hash bcrypt). |

Catatan:

- Semua berkas `.env*` (kecuali `.env.example`) diabaikan oleh Git melalui `.gitignore`. Jangan pernah meng-commit kredensial.
- `NODE_ENV` diatur otomatis oleh Next.js.

## Alur Kerja Basis Data

Konfigurasi Prisma CLI berada di [`prisma.config.ts`](prisma.config.ts). Berkas ini memuat `.env` melalui `dotenv`, menunjuk skema `prisma/schema.prisma`, direktori migrasi `prisma/migrations`, konfigurasi seed `tsx prisma/seed.ts`, dan mengambil URL dari `DATABASE_URL`.

| Tujuan | Perintah |
|---|---|
| Generate Prisma Client | `npx prisma generate` (juga otomatis via `postinstall` dan `build`) |
| Validasi skema | `npx prisma validate` |
| Membuat dan menerapkan migrasi saat pengembangan | `npm run db:migrate` (`prisma migrate dev && prisma generate`) |
| Mengisi data awal | `npm run db:seed` (`prisma db seed`) |
| Melihat status migrasi | `npx prisma migrate status` |
| Menerapkan migrasi di lingkungan produksi | `npx prisma migrate deploy` |
| Membuka Prisma Studio | `npm run db:studio` |

Hal yang perlu diperhatikan:

- **Jangan gunakan `prisma db push`** pada basis data bersama. Seluruh perubahan skema wajib melalui `prisma migrate dev`.
- **Integritas seed:** seed menghapus tabel konten namun **tidak pernah menghapus `AdminUser`**. Seed menolak dijalankan di produksi kecuali `SEED_ALLOW_WIPE=1`.
- **Prisma 7:** `migrate dev` tidak meregenerate client secara otomatis; skrip `npm run db:migrate` menjalankan `prisma migrate dev && prisma generate`.
- Jangan mengubah migrasi yang sudah diterapkan. Buat migrasi baru untuk setiap perubahan skema.

## Perintah Pengembangan

| Perintah | Fungsi |
|---|---|
| `npm run dev` | Menjalankan server pengembangan Next.js |
| `npm run build` | Menjalankan `prisma generate` lalu `next build` |
| `npm run start` | Menjalankan hasil build produksi |
| `npm run lint` | Menjalankan ESLint |
| `npm run typecheck` | Menjalankan pemeriksaan tipe TypeScript (`tsc --noEmit`) |
| `npm run db:migrate` | `prisma migrate dev && prisma generate` |
| `npm run db:seed` | Mengisi data awal (`prisma db seed`) |
| `npm run db:studio` | Membuka Prisma Studio |

## Konvensi Pengembangan

Standar lengkap tercantum di [`.ai/KARSALOKA_PROJECT_RULES.md`](.ai/KARSALOKA_PROJECT_RULES.md) dan [`docs/PROJECT_CONCEPT.md`](docs/PROJECT_CONCEPT.md), wajib dibaca sebelum berkontribusi. Ringkasannya:

- **Server Component sebagai bawaan.** Gunakan `"use client"` hanya untuk bagian yang membutuhkan API browser, state interaktif, atau WebGL.
- **Akses data** melalui instans `prisma` di `src/lib/prisma.ts`. Jangan membuat `PrismaClient` baru per request atau per komponen.
- **TypeScript ketat.** Hindari `any`, `@ts-ignore`, dan `@ts-expect-error` tanpa alasan terdokumentasi.
- **Validasi runtime** dengan Zod untuk setiap input dari pengguna, form admin, atau Json database.
- **Tanpa login pengguna.** Pengunjung menikmati seluruh konten tanpa login. Progres, bookmark, dan kuis disimpan di `localStorage` via Zustand `persist`.
- **Kuis berbasis kode.** Kuis dan scoring berada di `modules/quiz`, bukan tabel database.
- **Styling** dengan Tailwind CSS 4.
- **Konten studi kasus** harus memiliki sumber yang dapat diverifikasi (`CaseSource`). Statistik dan klaim dampak tidak boleh dikarang.
- **Aksesibilitas.** Globe dan graf adalah visualisasi, bukan satu-satunya jalur navigasi; sediakan alternatif berbasis daftar yang dapat diakses keyboard.
- **Next.js 16** memiliki perubahan API dibanding versi sebelumnya. Rujuk dokumentasi di `node_modules/next/dist/docs/` sebelum menulis kode, sebagaimana diinstruksikan di [`AGENTS.md`](AGENTS.md).

## Pengujian dan Penjaminan Mutu

Verifikasi yang tersedia saat ini:

```bash
npm run lint
npm run typecheck
npx prisma validate
npm run build
```

Pemeriksaan manual yang disarankan untuk halaman atlas:

- Uji di Chrome, Firefox, dan Safari versi terbaru.
- Uji interaksi drag dan sentuh pada globe `cobe`.
- Pastikan daftar dan panel studi kasus tetap berfungsi saat WebGL atau anchor positioning tidak aktif.

## Deployment

Kebutuhan minimum berdasarkan konfigurasi saat ini:

- Runtime Node.js yang memenuhi rentang versi pada bagian Prasyarat.
- Basis data PostgreSQL dan variabel `DATABASE_URL` pada lingkungan produksi.
- Menjalankan `npx prisma migrate deploy` sebelum atau saat rilis untuk menerapkan migrasi. Jangan gunakan `migrate dev` atau `migrate reset` di produksi.
- Menjalankan `npm run build`, lalu `npm run start`.

## Keterbatasan Saat Ini

- Rute `/cases/[slug]`, kuis, jalur keahlian, dan panel admin sedang disiapkan sesuai roadmap di `docs/PROJECT_CONCEPT.md`.
- Beranda (`/`) masih berupa template awal.

## Kontribusi

Anggota tim dan agen AI wajib mengikuti [`.ai/KARSALOKA_PROJECT_RULES.md`](.ai/KARSALOKA_PROJECT_RULES.md). Pokok alur kerjanya:

- Periksa kode, konfigurasi, dan skema Prisma yang ada sebelum melakukan perubahan.
- Buat perubahan yang terfokus dan minimal; jangan menulis ulang berkas yang tidak terkait.
- Perubahan skema basis data, autentikasi, routing, atau dependensi utama perlu disetujui tim terlebih dahulu.
- Gunakan branch terfokus, misalnya `feature/atlas-filter` atau `fix/globe-marker`, dan pesan commit bergaya `feat(atlas): add case filtering`.
- Jalankan lint, pemeriksaan tipe, dan build sebelum menggabungkan perubahan.

## Lisensi

Repositori ini belum mencantumkan berkas lisensi. Tanpa lisensi eksplisit, seluruh hak atas kode tetap dimiliki oleh pemegang hak cipta.