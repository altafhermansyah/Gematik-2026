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

Proyek berada pada tahap awal pengembangan (versi `0.1.0`). Skema basis data untuk seluruh domain sudah dirancang, tetapi sebagian besar fitur antarmuka belum diimplementasikan. Bagian berikut membedakan fitur yang sudah ada di repositori dan fitur yang masih direncanakan.

### Sudah diimplementasikan

- **Skema basis data lengkap** di [`prisma/schema.prisma`](prisma/schema.prisma) untuk domain atlas (bidang, studi kasus, sumber, SDG, tag teknologi), jalur keahlian (skill, node, prasyarat, sumber belajar), kuis diagnosis berbasis aturan (pertanyaan, opsi, bobot jalur, sinyal skill), progres pengguna, bookmark, serta model autentikasi bergaya Auth.js. Konten teks yang dilokalkan disimpan sebagai JSON `{ "id": "...", "en": "..." }`.
- **Halaman atlas (`/atlas`)** berupa Server Component yang mengambil studi kasus berstatus `PUBLISHED` dari basis data dan meneruskannya ke komponen globe.
- **Komponen globe interaktif** ([`AtlasGlobe.tsx`](src/components/atlas/AtlasGlobe.tsx)) berbasis `cobe` dengan rotasi otomatis, rotasi melalui drag (pointer dan sentuh), marker berwarna sesuai bidang, serta label marker yang diposisikan dengan CSS Anchor Positioning dan disembunyikan ketika marker berada di sisi belakang globe.

### Sebagian atau belum berfungsi

- Label marker mengarah ke `/cases/[slug]`, tetapi rute tersebut **belum ada**, sehingga saat ini menghasilkan halaman 404.
- Halaman beranda (`/`) dan metadata di [`layout.tsx`](src/app/layout.tsx) masih berupa template bawaan `create-next-app`.
- Belum tersedia data awal (seed), sehingga globe tidak menampilkan marker sampai data studi kasus dimasukkan secara manual.

### Direncanakan

- Filter dan pencarian studi kasus pada atlas, beserta tampilan daftar sebagai alternatif globe yang dapat diakses dengan keyboard.
- Halaman detail studi kasus (masalah, inovasi, peran AI/teknologi, dampak, dan sumber).
- Kuis diagnosis dengan skoring deterministik berbasis aturan.
- Visualisasi jalur keahlian dengan `@xyflow/react` dan pelacakan progres.
- Antarmuka admin untuk mengelola studi kasus dan jalur keahlian.
- Autentikasi pengguna dan admin.

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
| Graf jalur keahlian | `@xyflow/react` | Terpasang, belum digunakan |
| Animasi | `framer-motion` | Terpasang, belum digunakan |
| State klien | `zustand` | Terpasang, belum digunakan |
| Validasi | `zod` | Terpasang, belum digunakan |
| Hashing kata sandi | `bcryptjs` | Terpasang, belum digunakan |
| Utilitas | `clsx`, `tailwind-merge`, `lucide-react` | Terpasang, belum digunakan |
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
├── prisma/
│   └── schema.prisma                Skema basis data PostgreSQL
├── public/                          Aset statis
├── src/
│   ├── app/
│   │   ├── atlas/page.tsx           Halaman atlas (Server Component)
│   │   ├── globals.css              Entri Tailwind CSS dan token warna dasar
│   │   ├── layout.tsx               Root layout
│   │   └── page.tsx                 Halaman beranda (masih template)
│   ├── components/
│   │   └── atlas/AtlasGlobe.tsx     Globe interaktif berbasis cobe
│   ├── generated/prisma/            Prisma Client hasil generate (diabaikan Git)
│   └── lib/
│       └── prisma.ts                Instans tunggal Prisma Client
├── prisma7.config.ts                Konfigurasi Prisma CLI (schema, migrasi, URL basis data)
├── AGENTS.md                        Instruksi untuk agen AI terkait versi Next.js
├── next.config.ts
├── eslint.config.mjs
├── postcss.config.mjs
└── tsconfig.json                    Alias impor `@/*` mengarah ke `src/*`
```

Direktori `prisma/migrations/` dan berkas seed belum ada di repositori.

## Prasyarat

- **Node.js** versi `^20.19`, `^22.12`, atau `>=24.0`. Rentang ini adalah irisan kebutuhan Next.js 16 (`>=20.9.0`) dan Prisma 7. Proyek belum menetapkan versi Node.js melalui `engines` atau `.nvmrc`.
- **npm**, sesuai lockfile `package-lock.json` yang tersedia.
- **PostgreSQL** yang dapat diakses dari mesin lokal, baik instalasi lokal, kontainer, maupun layanan terkelola.

## Instalasi dan Pengembangan Lokal

1. Clone repositori dan masuk ke direktorinya.

   ```bash
   git clone https://github.com/altafhermansyah/Gematik-2026
   cd Gematik-2026
   ```

2. Buat berkas `.env` di root proyek. Lakukan ini sebelum instalasi karena skrip `postinstall` menjalankan `prisma generate` yang membaca konfigurasi Prisma.

   ```env
   DATABASE_URL="postgresql://<user>:<password>@localhost:5432/<nama_database>?schema=public"
   ```

3. Buat basis data kosong di PostgreSQL sesuai nama yang dipakai pada `DATABASE_URL`.

4. Instal dependensi. Prisma Client akan otomatis digenerate ke `src/generated/prisma`.

   ```bash
   npm install
   ```

5. Terapkan skema ke basis data. Karena repositori belum memiliki migrasi, perintah ini akan membuat migrasi awal di `prisma/migrations/`.

   ```bash
   npm run db:migrate -- --name init
   ```

   Migrasi awal sebaiknya dibuat oleh satu anggota tim lalu di-commit, sehingga anggota lain cukup menjalankan `npm run db:migrate` untuk menerapkannya. Lihat bagian [Alur Kerja Basis Data](#alur-kerja-basis-data) bila basis data lokal sebelumnya disiapkan dengan `prisma db push`.

6. Jalankan server pengembangan.

   ```bash
   npm run dev
   ```

7. Buka `http://localhost:3000/atlas` di browser. Rute `/` masih menampilkan halaman template.

## Variabel Lingkungan

| Variabel | Wajib | Digunakan oleh | Keterangan |
|---|---|---|---|
| `DATABASE_URL` | Ya | `prisma7.config.ts`, `src/lib/prisma.ts` | String koneksi PostgreSQL untuk Prisma CLI dan Prisma Client (melalui `@prisma/adapter-pg`). |

Catatan:

- Semua berkas `.env*` diabaikan oleh Git melalui `.gitignore`. Jangan pernah meng-commit kredensial.
- Repositori belum menyediakan `.env.example`; gunakan contoh di atas sebagai acuan.
- `NODE_ENV` diatur otomatis oleh Next.js dan tidak perlu didefinisikan manual.

## Alur Kerja Basis Data

Konfigurasi Prisma CLI berada di [`prisma7.config.ts`](prisma7.config.ts). Berkas ini memuat `.env` melalui `dotenv`, menunjuk skema `prisma/schema.prisma`, direktori migrasi `prisma/migrations`, dan mengambil URL dari `DATABASE_URL`. Sesuai konvensi Prisma 7, blok `datasource` di skema tidak memuat `url`.

| Tujuan | Perintah |
|---|---|
| Generate Prisma Client | `npx prisma generate` (juga dijalankan otomatis oleh `npm install` dan `npm run build`) |
| Validasi skema | `npx prisma validate` |
| Membuat dan menerapkan migrasi saat pengembangan | `npm run db:migrate` |
| Melihat status migrasi | `npx prisma migrate status` |
| Menerapkan migrasi di lingkungan produksi | `npx prisma migrate deploy` |
| Membuka Prisma Studio | `npm run db:studio` |

Hal yang perlu diperhatikan:

- **Generate, migrasi, dan seed adalah langkah terpisah.** Generate hanya memperbarui kode Prisma Client; migrasi mengubah struktur basis data; seed mengisi data.
- **Seed belum tersedia.** Skrip `npm run db:seed` terdaftar di `package.json`, tetapi `prisma7.config.ts` belum mendefinisikan `migrations.seed` dan belum ada berkas seed, sehingga perintah ini belum dapat digunakan. Untuk sementara, data dapat dimasukkan melalui Prisma Studio.
- **Basis data yang disiapkan dengan `prisma db push`** tidak dikelola oleh Prisma Migrate. Menjalankan `prisma migrate dev` pada basis data tersebut akan mendeteksi perbedaan riwayat dan dapat meminta reset yang **menghapus seluruh data**. Cadangkan data penting terlebih dahulu, atau gunakan basis data baru.
- **Jangan menjalankan `prisma migrate reset`** pada basis data bersama atau yang berisi data penting, karena perintah ini menghapus seluruh data.
- Jangan mengubah migrasi yang sudah diterapkan. Buat migrasi baru untuk setiap perubahan skema.

## Perintah Pengembangan

| Perintah | Fungsi |
|---|---|
| `npm run dev` | Menjalankan server pengembangan Next.js |
| `npm run build` | Menjalankan `prisma generate` lalu `next build` |
| `npm run start` | Menjalankan hasil build produksi |
| `npm run lint` | Menjalankan ESLint |
| `npx tsc --noEmit` | Pemeriksaan tipe TypeScript (belum ada skrip khusus) |
| `npm run db:migrate` | `prisma migrate dev` |
| `npm run db:seed` | `prisma db seed` (belum berfungsi, lihat catatan di atas) |
| `npm run db:studio` | `prisma studio` |

## Konvensi Pengembangan

Standar lengkap tercantum di [`.ai/KARSALOKA_PROJECT_RULES.md`](.ai/KARSALOKA_PROJECT_RULES.md) dan wajib dibaca sebelum berkontribusi. Ringkasannya:

- **Server Component sebagai bawaan.** Gunakan `"use client"` hanya untuk bagian yang membutuhkan API browser, state interaktif, atau WebGL.
- **Akses data** melalui instans `prisma` di `src/lib/prisma.ts`. Jangan membuat `PrismaClient` baru per request atau per komponen, dan jangan menaruh query di komponen presentasional yang dapat dipakai ulang.
- **TypeScript ketat.** Hindari `any`, `@ts-ignore`, dan `@ts-expect-error` tanpa alasan terdokumentasi.
- **Validasi runtime** dengan Zod untuk setiap input dari pengguna atau sumber eksternal.
- **Styling** dengan Tailwind CSS; gunakan `clsx` dan `tailwind-merge` untuk komposisi kelas kondisional. Token desain dipusatkan, bukan ditulis acak per komponen.
- **Konten studi kasus** harus memiliki sumber yang dapat diverifikasi. Statistik dan klaim dampak tidak boleh dikarang.
- **Aksesibilitas.** Globe dan graf adalah visualisasi, bukan satu-satunya jalur navigasi; sediakan alternatif berbasis daftar yang dapat diakses keyboard.
- **Next.js 16** memiliki perubahan API dibanding versi sebelumnya. Rujuk dokumentasi di `node_modules/next/dist/docs/` sebelum menulis kode, sebagaimana diinstruksikan di [`AGENTS.md`](AGENTS.md).

## Pengujian dan Penjaminan Mutu

Repositori belum memiliki pengujian otomatis maupun skrip `test`. Verifikasi yang tersedia saat ini:

```bash
npm run lint
npx tsc --noEmit
npx prisma validate
npm run build
```

Pemeriksaan manual yang disarankan untuk halaman atlas:

- Uji di Chrome, Firefox, dan Safari versi terbaru. Label marker bergantung pada CSS Anchor Positioning; pada browser yang belum mendukungnya, label tidak terposisi dengan benar. Fallback berupa daftar studi kasus belum diimplementasikan.
- Uji interaksi drag pada perangkat sentuh.
- Pastikan halaman tetap dapat dimuat ketika tabel studi kasus kosong.

Pengujian yang direncanakan meliputi unit test untuk mesin skoring kuis dan skema validasi, integration test untuk akses data, serta end-to-end test untuk alur atlas, studi kasus, kuis, dan jalur keahlian.

## Deployment

Proyek belum memiliki konfigurasi deployment dan belum pernah diuji di lingkungan produksi. Kebutuhan minimum berdasarkan konfigurasi saat ini:

- Runtime Node.js yang memenuhi rentang versi pada bagian Prasyarat.
- Basis data PostgreSQL dan variabel `DATABASE_URL` pada lingkungan produksi.
- Menjalankan `npx prisma migrate deploy` sebelum atau saat rilis untuk menerapkan migrasi. Jangan gunakan `migrate dev` atau `migrate reset` di produksi.
- Menjalankan `npm run build`, lalu `npm run start`.

Halaman `/atlas` mengambil data dari basis data saat request, sehingga koneksi basis data harus tersedia saat aplikasi berjalan.

## Keterbatasan Saat Ini

- Rute `/cases/[slug]`, kuis, jalur keahlian, progres, dan admin belum diimplementasikan.
- Belum ada migrasi, seed, maupun data contoh di repositori.
- Belum ada autentikasi. Model `User`, `Account`, `Session`, dan `VerificationToken` sudah ada di skema, tetapi pustaka autentikasi belum dipasang dan dikonfigurasi.
- Halaman atlas belum memiliki state loading, kosong, dan error yang eksplisit, serta belum memiliki fallback untuk browser tanpa WebGL atau tanpa dukungan CSS Anchor Positioning.
- Beranda dan metadata situs masih berasal dari template.
- Belum ada pengujian otomatis.

## Kontribusi

Anggota tim dan agen AI wajib mengikuti [`.ai/KARSALOKA_PROJECT_RULES.md`](.ai/KARSALOKA_PROJECT_RULES.md). Pokok alur kerjanya:

- Periksa kode, konfigurasi, dan skema Prisma yang ada sebelum melakukan perubahan.
- Buat perubahan yang terfokus dan minimal; jangan menulis ulang berkas yang tidak terkait.
- Perubahan skema basis data, autentikasi, routing, atau dependensi utama perlu disetujui tim terlebih dahulu.
- Gunakan branch terfokus, misalnya `feature/atlas-filter` atau `fix/globe-marker`, dan pesan commit bergaya `feat(atlas): add case filtering`.
- Jalankan lint, pemeriksaan tipe, dan build sebelum menggabungkan perubahan.

## Lisensi

Repositori ini belum mencantumkan berkas lisensi. Tanpa lisensi eksplisit, seluruh hak atas kode tetap dimiliki oleh pemegang hak cipta.