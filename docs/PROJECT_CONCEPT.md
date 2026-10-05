# KarsaLoka — Konsep Proyek

> **Status:** sumber kebenaran untuk konsep produk, ruang lingkup, dan tanggung jawab tiap tabel database.
> **Terakhir diperbarui:** 2026-10-04
> Jika dokumen ini bertentangan dengan `KARSALOKA_PROJECT_RULES.md`, **berhenti dan tanyakan**; jangan memilih sendiri.
> Dokumen ini juga menjadi bahan dasar Laporan Karya.

---

## 1. Ringkasan

**KarsaLoka** adalah platform web yang membantu orang berpindah dari **"melihat masalah dunia"** ke **"tahu cara ikut menyelesaikannya"**.

Rantai ide intinya:

> **Masalah → Inovasi → Jalur**

Pengunjung menjelajahi masalah global di sebuah globe interaktif, membaca bagaimana inovator memecahkannya dengan teknologi dan AI (lengkap dengan sumber yang bisa diperiksa), lalu mendapat roadmap belajar yang disesuaikan dengan kemampuannya agar bisa ikut menjadi bagian dari solusi.

Seluruh konten bisa dinikmati **tanpa login**. Hanya admin yang login, untuk mengelola konten.

> *Karsa* berarti kehendak atau prakarsa, *loka* berarti dunia. (Sesuaikan penjelasan ini di laporan bila makna yang dimaksud tim berbeda.)

## 2. Latar belakang dan masalah

Banyak orang tahu bahwa ada masalah besar di dunia (iklim, pangan, kesehatan, pendidikan), tetapi:

1. **Tidak tahu inovasi nyata** yang sudah menjawabnya dan bagaimana teknologi berperan.
2. **Tidak tahu langkah belajar** yang konkret untuk ikut berkontribusi.
3. Informasinya **tersebar**: berita di satu tempat, makalah di tempat lain, kursus di tempat ketiga.

KarsaLoka menyatukan ketiganya dalam satu pengalaman yang berurutan dan mudah dipahami.

## 3. Tujuan

1. **Menginspirasi:** menampilkan kasus inovasi nyata, bukan teori.
2. **Mengedukasi:** tiap kasus menjelaskan masalah, solusi, peran AI, dan dampak, dengan sumber yang bisa diverifikasi.
3. **Memberdayakan:** kuis singkat menghasilkan jalur belajar personal; skill yang sudah dikuasai dilewati.

## 4. Pengguna sasaran

Pelajar, mahasiswa, dan pemula yang tertarik berkontribusi lewat teknologi tetapi belum tahu mulai dari mana. Mereka datang **tanpa akun** dan langsung memakai.

## 5. Konsep inti dan kaitannya dengan tema

Tema lomba: **"Empowering Global Innovators for an Intelligent Future"**

| Kata kunci tema | Diwujudkan oleh |
|---|---|
| *Global* | Globe dengan kasus dari berbagai negara |
| *Innovators* | Studi kasus inovator nyata beserta sumbernya |
| *Empowering* | Roadmap personal: dari inspirasi menjadi tindakan |
| *Intelligent Future* | Peran AI di tiap kasus dan jalur belajar AI yang bertanggung jawab |

## 6. Alur pengguna

**Pengunjung (tanpa login)**

1. **Temukan:** globe, daftar kasus, filter (bidang, SDG, teknologi), pencarian.
2. **Pahami:** halaman detail kasus: masalah, solusi, peran AI, dampak, sumber.
3. **Bertindak:** tombol "Jadi bagian solusinya" → kuis diagnosa → jalur personal dengan skill graph → centang progres (tersimpan di browser).

**Admin (login)**

Masuk → kelola kasus, sumber, jalur, node, skill, dan materi → ubah status `DRAFT` menjadi `PUBLISHED`.

## 7. Ruang lingkup

**Termasuk:**

- Atlas globe + daftar kasus + panel + halaman detail kasus
- Filter dan pencarian (parameter URL, bisa dibagikan)
- Kuis diagnosa → rekomendasi jalur (rule-based, tanpa LLM)
- Halaman jalur dengan skill graph interaktif dan progres lokal
- Panel admin untuk konten
- Dua bahasa (Indonesia dan Inggris)

**Sengaja tidak dibuat:**

- Akun pengguna, login publik, atau profil
- Progres lintas perangkat
- Konten buatan pengguna, komentar, komunitas
- Ketergantungan pada API LLM saat dinilai
- Pembayaran

## 8. Peta halaman

| Rute | Tujuan | Status |
|---|---|---|
| `/` | Landing: narasi singkat dan pintu masuk ke Atlas | Direncanakan |
| `/atlas` | Globe + daftar + panel kasus | **Selesai** |
| `/cases/[slug]` | Detail kasus + sumber + tombol ke jalur | Berikutnya |
| `/quiz` | Kuis diagnosa → rekomendasi jalur | Direncanakan |
| `/paths` | Daftar jalur belajar | Direncanakan |
| `/paths/[slug]` | Skill graph + materi + progres lokal | Direncanakan |
| `/admin/*` | Login admin dan pengelolaan konten | Direncanakan |

## 9. Arsitektur data (10 tabel)

```text
Domain 1──∞ Case 1──∞ CaseSource
Case ∞──∞ Path                        (lewat CasePath)
Domain 1──∞ Path 1──∞ PathNode ∞──1 Skill 1──∞ Resource
PathNode ∞──∞ PathNode                (lewat PathEdge = prasyarat)
AdminUser                             (berdiri sendiri)
```

### 9.1 Atlas: jelajah masalah

| Tabel | Tanggung jawab | Dipakai di |
|---|---|---|
| `Domain` | Kategori bidang: slug, nama (id/en), warna, urutan. Hampir statis (6 baris). | Warna titik globe, chip, filter bidang |
| `Case` | Studi kasus: teks bilingual (judul, ringkasan, masalah, solusi, peran AI, dampak), lokasi (`lat`, `lng`, negara, region), `sdgs Int[]`, `technologies String[]`, `status`, `featured`, `metrics`. | Titik globe, daftar, panel, `/cases/[slug]`, filter, pencarian |
| `CaseSource` | Sumber rujukan per kasus: judul, penerbit, URL, tanggal akses. | Bagian "Sumber" di detail kasus |

Aturan: hanya `Case` berstatus `PUBLISHED` yang tampil publik, dan kasus tidak boleh dipublikasikan tanpa minimal satu `CaseSource`.

### 9.2 Roadmap: belajar

| Tabel | Tanggung jawab | Dipakai di |
|---|---|---|
| `Path` | Satu jalur belajar: judul, deskripsi, level, estimasi jam, `status`. `domainId` opsional karena jalur dasar berlaku lintas bidang. | `/paths`, hasil kuis |
| `PathNode` | Satu langkah dalam jalur: skill yang dipelajari, tipe (`CONCEPT`/`PRACTICE`/`PROJECT`), urutan, posisi di kanvas (`posX`/`posY`), tugas. | Kotak pada skill graph, kunci progres di `localStorage` |
| `PathEdge` | Prasyarat antar node (`from → to`). Kedua node harus satu jalur. | Garis panah graph, logika "terbuka setelah node sebelumnya selesai" |
| `Skill` | Katalog skill yang dipakai ulang di banyak jalur. | Nama node, penghubung ke materi, target kuis |
| `Resource` | Materi belajar per skill: tipe, judul, URL, penyedia, bahasa, gratis atau tidak. | Daftar materi saat node dibuka |

### 9.3 Jembatan Atlas dan Roadmap

| Tabel | Tanggung jawab | Dipakai di |
|---|---|---|
| `CasePath` | Menghubungkan kasus dan jalur, dengan `relevance` (1–3) dan catatan alasan. | Tombol "Jadi bagian solusinya", urutan rekomendasi |

### 9.4 Admin

| Tabel | Tanggung jawab | Dipakai di |
|---|---|---|
| `AdminUser` | Akun admin: email dan `passwordHash` (bcrypt). Tidak ada pendaftaran publik; dibuat lewat seed dari `.env`. | `/admin/*` dan semua aksi tulis |

### 9.5 Yang sengaja **bukan** tabel

| Fungsi | Lokasi |
|---|---|
| Pertanyaan kuis dan bobotnya | Kode: `modules/quiz/questions.ts` |
| Skoring rekomendasi | Fungsi murni `recommendPath()` |
| Progres node, bookmark, hasil kuis | `localStorage` lewat Zustand `persist` |
| Sesi admin | Cookie bertanda tangan (`httpOnly`, `secure`, `SameSite=Lax`) |
| Teks antarmuka dua bahasa | File pesan, bukan database |

Konsekuensi: kuis merujuk slug jalur dan skill tanpa foreign key. Wajib ada validasi (tes atau skrip) yang memastikan setiap slug yang dirujuk kuis ada di database.

## 10. Aturan konten

- Target awal: **12–15 kasus**, 6 domain, **4–5 jalur**, sekitar 30 skill.
- Setiap kasus punya **minimal satu sumber** yang bisa dibuka dan diperiksa. Tanpa sumber, statusnya tetap `DRAFT`.
- `metrics` hanya berisi angka yang **terverifikasi** dari sumbernya. Tidak ada angka karangan.
- Koordinat kasus harus mewakili lokasi yang bisa dipertanggungjawabkan (lokasi implementasi atau pengembang), dan dicatat di `region`.
- Kasus berstatus `PUBLISHED` harus terisi dalam **kedua bahasa** (`id` dan `en`).
- Sertakan beberapa kasus lokal Indonesia yang kredibel.
- Materi belajar diutamakan yang gratis; setiap URL diperiksa masih hidup.

## 11. Stack dan keputusan teknis

| Lapisan | Pilihan |
|---|---|
| Framework | Next.js 16 (App Router), React 19, TypeScript |
| Styling | Tailwind CSS 4 |
| Database | PostgreSQL + Prisma 7 (`@prisma/adapter-pg`) |
| Validasi | Zod (termasuk Json bilingual dari database) |
| Globe | `cobe` (WebGL ringan) |
| Skill graph | `@xyflow/react` |
| Animasi | `framer-motion` |
| State klien | Zustand (`persist` untuk progres lokal) |

Catatan teknis: `cobe` v2 tidak punya `onRender`; rotasi digerakkan dengan `requestAnimationFrame` dan `globe.update()`. Opsi `width`/`height` dalam piksel CSS (cobe mengalikan dengan `devicePixelRatio` sendiri).

## 12. Pemetaan ke kriteria penilaian

| Kriteria (bobot) | Ditopang oleh |
|---|---|
| Kesesuaian dengan tema (20%) | Narasi Masalah → Inovasi → Jalur |
| Desain & kreativitas (20%) | Globe, skill graph, motion yang bercerita |
| Fungsionalitas & teknologi (25%) | Filter dan pencarian, kuis → rekomendasi, graph dengan progres, panel admin |
| Konten & informatif (15%) | Kasus bersumber, materi belajar terkurasi |
| Video demo & dokumentasi (10%) | Alur tiga babak yang mudah didemokan |
| Presentasi finalis (10%) | Satu cerita tunggal yang mudah disampaikan |

## 13. Risiko dan mitigasi

| Risiko | Mitigasi |
|---|---|
| Performa globe di perangkat lemah | Satu loop `requestAnimationFrame`, DPR dibatasi 2, jumlah marker kecil, fallback daftar kasus |
| CSS Anchor Positioning belum didukung semua browser | Overlay label dimatikan bila tidak didukung; daftar dan panel tetap berfungsi penuh |
| WebGL tidak tersedia | Pesan fallback; daftar dan panel tetap berfungsi |
| Konten tidak akurat | Aturan sumber wajib, `metrics` hanya terverifikasi, status `DRAFT` sampai diperiksa |
| Progres hanya per-browser | Disebutkan di laporan; tombol reset progres |
| Referensi kuis ke slug tanpa foreign key | Validasi slug saat seed/tes |
| Scope creep (dua orang, waktu terbatas) | Ikuti bagian 7; fitur di luar daftar harus disepakati dulu |

## 14. Urutan pengerjaan

1. ✅ Fondasi database, seed, dan `/atlas` (modul `atlas`)
2. Fondasi desain dan kerangka aplikasi (font, token, navbar/footer, komponen dasar)
3. `/cases/[slug]` (detail kasus + sumber)
4. Filter dan pencarian via parameter URL
5. Kuis → rekomendasi jalur (`modules/quiz`)
6. `/paths` dan `/paths/[slug]` (skill graph, progres lokal)
7. Panel admin
8. Dua bahasa, polish visual, deploy, video demo, laporan

## 15. Catatan keputusan

| Tanggal | Keputusan | Alasan |
|---|---|---|
| 2026-10-04 | Database: PostgreSQL + Prisma | Dipilih tim; array native untuk SDG dan teknologi |
| 2026-10-04 | Globe memakai `cobe`, bukan `react-globe.gl` | Lebih ringan, sudah dipasang di repo |
| 2026-10-04 | **Tanpa login pengguna**; progres di `localStorage` | Mengurangi cakupan; juri tidak perlu mendaftar |
| 2026-10-04 | Skema disederhanakan dari 24 menjadi **10 tabel** | Lebih sedikit kode, form admin, dan migrasi |
| 2026-10-04 | Kuis dipindah ke kode, tidak di database | Jarang berubah; aman di Git; nol query |
| 2026-10-04 | Login admin: tabel `AdminUser` + cookie bertanda tangan | Tanpa Auth.js; tanpa tabel sesi |
