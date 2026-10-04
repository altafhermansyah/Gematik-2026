# 🌍 KarsaLoka

> **"Menghubungkan Niat Baik dengan Aksi Cerdas Dunia"**  
> Platform navigasi isu global (SDGs) dan pemetaan jalur keahlian berbasis AI untuk kompetisi **GEMATIK VI 2026** — *"Empowering Global Innovators for an Intelligent Future"*.

---

# 📖 DESKRIPSI APLIKASI

## Latar Belakang & Visi
Banyak generasi muda memiliki kepedulian tinggi terhadap krisis global (seperti perubahan iklim, ketahanan pangan, kesenjangan kesehatan, pendidikan, dan mitigasi bencana), namun terbentur pada dua masalah utama:
1. **Kebingungan Memulai:** Sulit memetakan di mana titik krisis dunia yang mendesak dan bagaimana inovasi teknologi telah diterapkan secara riil untuk mengatasinya.
2. **Kesenjangan Keterampilan:** Tidak mengetahui keahlian spesifik apa yang harus dipelajari agar relevan dan berdaya guna di era kecerdasan artifisial (*Intelligent Future*).

**KarsaLoka** hadir sebagai platform terintegrasi yang menjembatani kepedulian skala makro (dunia) menuju aksi nyata skala mikro (pengembangan keahlian individu). Pengguna tidak hanya disuguhkan data statistik pasif, melainkan dipandu menemukan jalur kontribusi nyata sesuai minat dan potensi diri.

---

## Fitur Utama & Modul Sistem

### 1. 3D Globe Explorer (Eksplorasi Makro)
* Visualisasi bola dunia 3D interaktif berbasis WebGL canvas berkinerja tinggi (menggunakan engine COBE).
* Memetakan titik-titik studi kasus inovasi pemecahan masalah di berbagai belahan dunia.
* Filter dinamis berdasarkan pilar SDGs (Iklim, Kesehatan, Pangan, Pendidikan, Bencana, Inklusi), wilayah regional, dan kategori teknologi cerdas.
* Sistem fallback otomatis ke mode kanvas 2D jika peramban atau perangkat tidak mendukung WebGL.

### 2. Deep-Dive Studi Kasus Terverifikasi
* Ulasan mendalam dari setiap studi kasus inovasi nyata, memuat kasus skala global dan lokal Indonesia.
* Memuat struktur informasi: latar belakang krisis, peran konkret kecerdasan artifisial (AI), dampak terukur, dan rujukan tautan data primer yang dapat diuji validitasnya.

### 3. Kuis Diagnosa Personalisasi (Rule-Based Engine)
* Kuis terarah (5–7 pertanyaan) untuk mengidentifikasi minat isu, latar belakang kemampuan, dan gaya kontribusi pengguna.
* Menggunakan algoritma kalkulasi skor deterministik (*rule-based*), menjamin sistem bekerja instan, stabil, dan mandiri tanpa ketergantungan API key pihak ketiga yang rentan limit kuota.

### 4. Interactive Skill Roadmap (Peta Keahlian Berbasis Graf)
* Hasil kuis langsung dikonversi menjadi alur belajar keahlian personal dalam bentuk graf interaktif (menggunakan React Flow / @xyflow/react).
* Struktur pembelajaran bertingkat: *Fundamental Knowledge* $\rightarrow$ *Applied Tech / AI Tools* $\rightarrow$ *Real-world Project*.
* Setiap node graf memuat rangkuman materi, kurikulum terbuka, dan rekomendasi sumber belajar mandiri.

### 5. Dasbor Pelacakan & Simpan Kasus
* Fitur penanda (*bookmark*) untuk menyimpan studi kasus penting ke daftar bacaan lokal.
* Pelacak kemajuan belajar (*progress tracking*) untuk menandai setiap node keterampilan yang telah selesai dipelajari.

---

## Teknologi yang Digunakan
* **Framework:** Next.js (App Router, TypeScript)
* **Styling & UI:** Tailwind CSS, Lucide React
* **3D Visual & Graph:** COBE WebGL, @xyflow/react
* **Animasi:** Framer Motion
* **Database & ORM:** PostgreSQL, Prisma ORM
* **State Management:** Zustand

---

# 🛠️ PANDUAN INSTALASI & SETUP (SETELAH CLONE)

Ikuti langkah-langkah berikut secara berurutan setelah meng-clone repositori ini:

### 1. Masuk ke Direktori Proyek & Install Dependensi
Buka terminal dan jalankan:
```bash
npm install
```

### 2. Konfigurasi Environment (`.env`)
Buat berkas bernama `.env` pada root direktori proyek, lalu masukkan URL koneksi PostgreSQL:
```env
DATABASE_URL="postgresql://karsa:karsapassword@localhost:5432/karsaloka?schema=public"
```
*(Sesuaikan username, password, port, dan nama database jika menggunakan database lokal atau layanan cloud seperti Supabase/Neon).*

### 3. Sinkronisasi Database
Kirim skema Prisma ke database PostgreSQL:
```bash
npx prisma db push
```

### 4. Jalankan Aplikasi
Nyalakan server development lokal:
```bash
npm run dev
```
Buka peramban dan akses alamat: `http://localhost:3000`

---

> **Akses Database Visual (Opsional):** Jalankan perintah `npx prisma studio` di terminal terpisah untuk melihat atau mengelola isi tabel database secara visual di browser melalui `http://localhost:5555`.