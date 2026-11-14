# Laporan Migrasi Arsitektur Full-Local & Penyelesaian Halaman Globe (`/atlas`)

**Tanggal:** 25 Oktober 2026  
**Proyek:** KarsaLoka — GEMATIK VI 2026 (*"Empowering Global Innovators for an Intelligent Future"*)

---

## 1. Ringkasan Eksekutif

Proyek **KarsaLoka** telah berhasil dimigrasikan sepenuhnya dari arsitektur berbasis basis data eksternal (PostgreSQL + Prisma 7 + rencana panel admin) menjadi **arsitektur 100% Full-Local**:

1. **Penghapusan Penuh Ketergantungan Basis Data & Admin Panel:**
   - Seluruh skema, migrasi, konfigurasi, dan klien Prisma (`prisma/schema.prisma`, `prisma/migrations/`, `prisma/seed.ts`, `prisma.config.ts`, `src/lib/prisma.ts`) serta dependensi `@prisma/client`, `@prisma/adapter-pg`, `prisma`, dan `bcryptjs` telah dihapus.
   - Tidak ada tabel atau rute `/admin/*`. Seluruh kurasi konten dilakukan melalui modul TypeScript bertipe ketat (`as const satisfies readonly CaseStudy[]`) di dalam `src/content/`.
2. **Validasi Integritas Otomatis pada Waktu Build (`src/modules/content/validate.ts`):**
   - `assertContentIntegrity()` dijalankan secara otomatis saat pembacaan konten di `src/modules/content/store.ts` (termasuk saat `generateStaticParams()` pada `next build`).
   - Setiap kasus berstatus `PUBLISHED` wajib memiliki teks dwibahasa (`id` dan `en`) lengkap, koordinat geografis valid (`lat`, `lng`, `countryCode`), minimal satu sumber primer (`sources`), dan setiap angka pada `metrics` wajib menyertakan kutipan verbatim (`quote`) serta `sourceUrl` yang cocok dengan daftar `sources` kasus tersebut.
3. **Kurasi 16 Studi Kasus Nyata Lintas 6 Bidang Masalah di 11 Negara:**
   - Seluruh 6 bidang masalah (`climate`, `food`, `health`, `education`, `disaster`, `inclusion`) kini terisi penuh dengan **16 studi kasus nyata** (termasuk **3 studi kasus dari Indonesia**: Sumatra Barat, DI Yogyakarta, dan DKI Jakarta) beserta **41 metrik dampak terverifikasi** dengan kutipan verbatim dari jurnal *Nature*, *New England Journal of Medicine*, *American Economic Review*, *Frontiers in Plant Science*, *Scientific Reports*, *British Journal of Educational Technology*, *Findings of EMNLP*, WHO, FAO, dan OECD OPSI.
4. **Penyempurnaan Halaman Globe (`/atlas`) & Detail Kasus (`/cases/[slug]`) ke Tingkat Siap Produksi (*Ready-Prod*):**
   - Perbaikan bug kritis unmounting `<canvas>` saat hasil filter kosong dan saat pemulihan `runtimeError`.
   - Eliminasi mutasi DOM/CSS `:root` 60fps dari `cobe` v2 dengan menghapus properti `id` yang tidak digunakan pada daftar marker WebGL, serta penyimpanan dimensi `ResizeObserver` tanpa pembacaan `offsetWidth`/`offsetHeight` pada setiap frame.
   - Penambahan animasi rotasi kamera mulus (*smooth camera fly-to*) menggunakan perhitungan jarak sudut terpendek (`getCameraAnglesForLocation` & `getShortestAngleDelta`) ketika pengguna memilih kasus atau menekan tombol **Fokus Indonesia**, serta pemisahan `pointercancel` dari `pointerup` dan pembatasan posisi *tooltip* agar tidak terpotong di layar ponsel sempit.
   - Penambahan filter bidang masalah, filter cepat **Indonesia (`ID`)**, filter **Unggulan**, kolom pencarian instan (`/`), pengalih bahasa **`ID` / `EN`** (yang menjaga state filter/pilihan aktif di `/atlas` dan mendukung peralihan bahasa instan pada halaman SSG `/cases/[slug]`), bar statistik ringkasan, dan pratinjau metrik serta SDG di panel kasus.

---

## 2. Daftar Lengkap 16 Studi Kasus & Jejak Audit Kutipan (`src/content/cases/*.ts`)

| # | Bidang | Slug | Lokasi & Koordinat | Tahun | Metrik Terverifikasi | Sumber Primer |
|---:|---|---|---|---|---|---|
| 1 | `climate` | `rainforest-connection-forest-listening` | Solok Selatan, Sumatra Barat, `ID` (`-1.4833, 101.25`) | 2019 | 12 perangkat Guardian; ketinggian 30 meter; 5 kawasan hutan | RFCx, ANTARA News, IUCN NL |
| 2 | `climate` | `global-fishing-watch-dark-vessels` | Washington, D.C., `US` (`38.9059, -77.0431`) | 2024 | 76% kapal ikan industri tak terlacak; 30% kapal energi/transpor tak terlacak; 28.000 struktur lepas pantai | *Nature* 2024 (`PMC10764273`) |
| 3 | `food` | `plantvillage-nuru-crop-disease` | Busia County, `KE` (`0.4608, 34.1115`) | 2020 | 65% akurasi 1 daun; 88% akurasi 6 daun; 6 daun per tanaman | *Frontiers in Plant Science* 2020 (`PMC7775399`) |
| 4 | `food` | `plantix-crop-diagnosis-smallholders` | Hyderabad, Telangana, `IN` (`17.5111, 78.2752`) | 2020 | 30 jenis tanaman; 400+ jenis kerusakan tanaman | FAO e-Agriculture, Plantix / ICRISAT |
| 5 | `health` | `alphafold-protein-structure-prediction` | Hinxton, Cambridgeshire, `GB` (`52.0801, 0.1864`) | 2021 | 200.000.000 struktur protein; 190 negara; 0,96 Å akurasi CASP14 | *Nature* 2021 (`PMC8371605`), EMBL-EBI |
| 6 | `health` | `zipline-medical-drone-delivery` | Muhanga, `RW` (`-2.0845, 29.7529`) | 2016 | 15 menit pengiriman darah tercepat; 70 fasilitas kesehatan; 28.754 unit darah (2023) | WHO, Zipline, The New Times |
| 7 | `health` | `qure-ai-tuberculosis-screening` | Mumbai, Maharashtra, `IN` (`19.1079, 72.8836`) | 2018 | 0,81 AUC; 71% sensitivitas qXR; 56% sensitivitas radiolog pembanding | *Scientific Reports* 2020 (`PMC6959311`) |
| 8 | `health` | `mpedigree-medicine-authentication` | Accra, `GH` (`5.6123, -0.2038`) | 2007 | 100.000.000 orang terjangkau; 10 digit kode verifikasi SMS | mPedigree, Partnership for Safe Medicines, Skoll |
| 9 | `health` | `wmp-wolbachia-dengue-yogyakarta` | Kota Yogyakarta, DI Yogyakarta, `ID` (`-7.7956, 110.3695`) | 2021 | 77,1% efikasi penurunan kasus dengue; 86,2% penurunan rawat inap; 24 klaster geografis | *New England Journal of Medicine* 2021 (`PMC8103655`) |
| 10 | `education` | `mindspark-adaptive-learning-india` | New Delhi, `IN` (`28.6139, 77.2090`) | 2019 | 0,37 SD peningkatan matematika; 0,23 SD peningkatan bahasa Hindi; 4,5 bulan intervensi | *American Economic Review* 2019 (Muralidharan et al.), J-PAL |
| 11 | `education` | `onebillion-tablet-math-intervention` | Lilongwe, `MW` (`-13.9626, 33.7741`) | 2019 | 389 anak usia 4–5 tahun dalam uji acak terkontrol | *British Journal of Educational Technology* 2019 (`PMC6366442`) |
| 12 | `disaster` | `petabencana-flood-crowdsourcing` | DKI Jakarta, `ID` (`-6.2088, 106.8456`) | 2020 | 24.000% lonjakan aktivitas; 259.000 tayangan peta darurat saat banjir Jan 2020 | Yayasan Peta Bencana, OECD OPSI |
| 13 | `disaster` | `google-flood-hub-riverine-forecasting` | Dhaka, `BD` (`23.8103, 90.4125`) | 2024 | 5 hari waktu tunggu peringatan dini; 80+ negara; 5.680 stasiun ukur sungai | *Nature* 2024 (`PMC10957424`) |
| 14 | `inclusion` | `togo-novissi-satellite-aid-targeting` | Lomé, `TG` (`6.1375, 1.2123`) | 2022 | 21% penurunan batas atas kesalahan eksklusi; 10 USD bantuan dua mingguan | *Nature* 2022 (`PMC8967719`) |
| 15 | `inclusion` | `be-my-eyes-visual-assistance` | Aarhus, `DK` (`56.1629, 10.2039`) | 2015 | 340.000.000 populasi sasaran; 180+ bahasa; 10.000 sukarelawan dalam 24 jam pertama | Be My Eyes Official Story |
| 16 | `inclusion` | `masakhane-african-languages-nlp` | Nairobi, `KE` (`-1.2921, 36.8219`) | 2020 | 30+ bahasa Afrika dengan tolok ukur MT; 30+ negara kontributor | *Findings of EMNLP* 2020 (`2020.findings-emnlp.195`) |

*(Total: **16 studi kasus `PUBLISHED`** lintas 6 bidang masalah di 11 negara — 2 Iklim + 2 Pangan + 5 Kesehatan + 2 Pendidikan + 2 Kebencanaan + 3 Inklusi Sosial — dengan **41 metrik dampak terverifikasi**).*

---

## 3. Rekayasa Performa & Aksesibilitas pada Globe (`/atlas`)

1. **Penghapusan Overhead Gaya `:root` 60fps pada `cobe` v2:**
   - Pada `cobe@2.0.1`, setiap marker yang memiliki properti `id` memicu pembuatan elemen `<div>` jangkar dan penulisan ulang elemen `<style>` di `document.head` (`:root { --cobe-visible-... }`) pada setiap pemanggilan `globe.update()` (60 kali per detik).
   - Karena `AtlasGlobe.tsx` menghitung proyeksi bola-ke-layar secara langsung melalui fungsi murni `projectMarker()` dan memosisikan tooltip dengan `transform: translate3d(...)`, penghapusan properti `id` dari objek marker `cobe` menghilangkan *style recalculation* global sepenuhnya.
2. **Siklus Hidup Kanvas WebGL yang Tahan Uji:**
   - Kanvas WebGL tidak lagi di-*unmount* ketika hasil filter/pencarian bernilai kosong (`cases.length === 0`). Sebagai gantinya, `globe.update({ markers: [] })` dipanggil dan lapisan overlay dengan tombol *Reset semua filter* ditampilkan di atas globe.
   - `runtimeError` dimasukkan ke daftar dependensi `useEffect` utama sehingga tombol *Coba lagi* benar-benar menginisialisasi ulang konteks WebGL setelah gangguan.
3. **Aksesibilitas Setara (WCAG & Modern Web Guidance):**
   - Kanvas memiliki `tabIndex={0}` dan mendukung rotasi menggunakan tombol panah keyboard (`ArrowLeft`, `ArrowRight`, `ArrowUp`, `ArrowDown`) serta tombol `Home` untuk mereset sudut pandang.
   - Daftar tersembunyi (`<ul className="sr-only">`) di dalam kontainer globe memastikan pembaca layar dan fitur pencarian halaman peramban (*find-in-page*) tetap mengenali seluruh marker yang digambar di atas `<canvas>`.
   - Preferensi `prefers-reduced-motion: reduce` dihormati baik untuk menghentikan rotasi otomatis maupun mengubah animasi *fly-to* kamera menjadi perpindahan instan.
