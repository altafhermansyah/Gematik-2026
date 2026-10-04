```markdown
# 🌍 KarsaLoka

> **"Menghubungkan Niat Baik dengan Aksi Cerdas Dunia"**  
> Platform interaktif navigasi krisis global (SDGs) dan pemetaan jalur keahlian berbasis AI (*Empowering Global Innovators for an Intelligent Future*).

---

## 📖 Tentang Aplikasi

**KarsaLoka** adalah platform web interaktif yang mentransformasi kepedulian terhadap krisis dunia menjadi langkah aksi nyata. Banyak pemuda tergerak untuk menyelesaikan masalah global, namun sering kali bingung harus mulai dari mana dan keterampilan apa yang relevan dipelajari di era kecerdasan artifisial. 

KarsaLoka menjembatani kesenjangan tersebut melalui ekosistem yang terintegrasi:

### Fitur Utama & Pengalaman Pengguna:
1. **3D Globe Explorer:**
   Kanvas bola bumi 3D interaktif yang memetakan titik krisis global dan inovasi pemecahannya di berbagai belahan dunia. Dilengkapi fitur filter kategori SDGs (iklim, pangan, kesehatan, bencana, inklusi), filter wilayah, serta pencarian instan.
2. **Katalog Studi Kasus Berbasis AI:**
   Eksplorasi mendalam untuk setiap studi kasus inovasi nyata (mencakup kasus internasional dan lokal Indonesia). Memuat narasi masalah, peran kecerdasan artifisial dalam solusi, dampak terukur, dan tautan rujukan data yang kredibel.
3. **Kuis Diagnosa Personalisasi:**
   Kuis terarah (5–7 pertanyaan) yang dirancang menggunakan kalkulasi *rule-based* (stabil, cepat, dan mandiri tanpa ketergantungan API pihak ketiga) untuk membaca minat, latar belakang kemampuan, dan bidang kontribusi yang paling cocok bagi pengguna.
4. **Interactive Skill Roadmap (Peta Keahlian):**
   Visualisasi graf interaktif (pohon keterampilan/alur belajar) hasil dari kuis diagnosa. Setiap *node* pada graf menyediakan materi dasar, rekomendasi sumber belajar terbuka, hingga ide proyek latihan mandiri.
5. **Dashboard & Tracking Progress:**
   Area personal bagi pengguna untuk memantau progres belajar node yang telah diselesaikan serta menyimpan (*bookmark*) studi kasus penting.

---

## 🚀 Panduan Setup Setelah Clone

Ikuti langkah-langkah berikut secara berurutan setelah meng-clone repositori ini:

### 1. Masuk ke Direktori & Install Dependensi
Buka terminal di root project lalu jalankan:
```bash
npm install

```

### 2. Konfigurasi Environment (`.env`)

Buat file bernama `.env` di root project, lalu isi dengan URL koneksi PostgreSQL kamu:

```env
DATABASE_URL="postgresql://karsa:karsapassword@localhost:5432/karsaloka?schema=public"

```

*(Sesuaikan username, password, port, atau nama database jika kamu memakai konfigurasi lokal/cloud sendiri).*

### 3. Sinkronisasi Skema Database

Generate dan sinkronkan tabel Prisma langsung ke database PostgreSQL:

```bash
npx prisma db push

```

### 4. Jalankan Aplikasi

Nyalakan local development server:

```bash
npm run dev

```

Buka browser dan akses: `http://localhost:3000`

> **Tips:** Untuk melihat atau memanipulasi isi database via antarmuka grafis di browser, buka terminal baru dan ketik `npx prisma studio`.

```

```