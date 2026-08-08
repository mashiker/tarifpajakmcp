---
title: Redesign dan Database Temporal Tarif Pajak Indonesia
date: 2026-08-06
status: approved-by-direct-execution-request
---

# Redesign dan Database Temporal Tarif Pajak Indonesia

## Tujuan

Mengubah Tarif Pajak ID menjadi database rujukan publik dan machine-readable yang langsung membuka daftar tarif pajak, mudah dipakai manusia maupun AI/LLM, serta mampu menjelaskan tarif yang berlaku pada tanggal tertentu berdasarkan sumber hukum primer.

## Prinsip Produk

1. Root `/` langsung menampilkan database, tanpa landing page pemasaran.
2. Tabel memakai lebar konten penuh dan mengikuti panjang halaman; tidak dibatasi kotak setengah viewport dengan scroll vertikal internal.
3. Pencarian dan filter dapat dibagikan melalui URL.
4. Tarif tidak ditampilkan sebagai angka tanpa konteks: setiap hasil membawa jenis transaksi, objek pajak, periode berlaku, status historis, dasar hukum, dan tingkat verifikasi.
5. Sistem tidak menebak bila fakta transaksi kurang atau sumber bertentangan. Hasil harus mengungkapkan `tepat`, `bersyarat`, `rentang`, `fakta_kurang`, atau `konflik_sumber`.
6. Sumber primer pemerintah diutamakan; sumber sekunder hanya membantu penelusuran dan tidak menjadi satu-satunya dasar angka.
7. Perubahan dikerjakan di branch `main` lokal sesuai instruksi Jevi, tanpa commit, push, atau deploy sebelum izin eksplisit.

## Pengalaman Pengguna

### Halaman utama

- Header ringkas berisi identitas produk, navigasi alat pendukung, tema, dan tautan API.
- Bagian paling atas langsung berupa judul database, tanggal pembaruan, statistik, dan disclaimer singkat.
- Toolbar sticky berisi:
  - pencarian bebas;
  - tanggal atau tahun transaksi;
  - kategori pajak;
  - status historis;
  - tingkat verifikasi;
  - urutan hasil;
  - tombol hapus filter.
- Hasil berupa tabel full-width tanpa batas tinggi internal.
- Header tabel sticky terhadap halaman.
- Baris menampilkan kategori, transaksi, tarif, dasar pengenaan, periode, status, verifikasi, dan sumber.
- Klik baris membuka detail yang dapat ditautkan secara stabil.
- Mobile memakai kartu ringkas yang tetap mempertahankan identitas entri, tarif, periode, status, serta tautan detail.

### Detail tarif

Detail harus menunjukkan:

- tarif dan cara penghitungannya;
- konteks transaksi yang cocok;
- tanggal mulai dan berakhir;
- status pada tanggal yang dipilih, bukan sekadar status editorial saat ini;
- dasar hukum per peraturan/pasal;
- sumber resmi;
- aturan sebelum dan sesudahnya;
- kode BPPU terkait;
- contoh yang diberi label ilustratif;
- status dan tanggal verifikasi;
- konflik atau data yang masih perlu ditinjau.

### URL dan deep link

Filter utama disimpan pada query string (`q`, `date`, `category`, `status`, `verification`, `sort`). Entri memiliki URL/fragmen stabil. `/database` dialihkan atau dikanonisasi ke `/` agar tidak ada dua implementasi database.

## Arah Visual

### Karakter

"Lembar referensi hukum digital": presisi data perpajakan, bukan landing SaaS generik. Visual tenang, profesional, padat tetapi mudah dipindai.

### Token awal

- Ink: `#132A2A`
- Deep teal: `#0E5E58`
- Paper: `#F7F8F4`
- Surface: `#FFFFFF`
- Rule: `#D9E0DC`
- Amber warning: `#B7791F`
- Red conflict: `#B64545`

Tipografi: sans yang sangat terbaca untuk UI dan monospace/tabular numerals untuk tarif, tanggal, kode, serta ID. Signature visual adalah garis waktu berlaku yang menyatu dengan setiap hasil, sehingga pengguna langsung memahami posisi aturan dalam sejarah.

## Arsitektur Data Temporal

### Evolusi kompatibel

Model lama dipertahankan sebagai API v1. Model temporal v2 memperkenalkan:

- ID aturan dan konsep stabil;
- interval half-open `validFrom <= date < validToExclusive`;
- pemisahan valid time dan waktu pencatatan dataset;
- kondisi penerapan terstruktur;
- rate union bertipe (persentase, nilai tetap, spesifik per unit, progresif, formula, rentang, bebas, nol, tidak berlaku, faktor informasi);
- foreign key peraturan yang stabil;
- relasi pengganti/perubahan bertipe;
- kode administratif sebagai dataset versioned;
- provenance dan status verifikasi per klaim.

### Resolver

Resolver tanggal mengembalikan kandidat yang intervalnya cocok dan menyertakan:

- alasan cocok;
- kondisi yang terpenuhi;
- fakta yang masih dibutuhkan;
- aturan khusus yang mengalahkan aturan umum;
- tingkat determinasi;
- sumber pendukung.

Query tahun tetap tersedia, tetapi hasil tahun transisi harus menampilkan semua interval dalam tahun tersebut dan meminta tanggal tepat jika ada lebih dari satu aturan.

## Validasi dan Audit Hukum

### Prioritas tahap pertama

1. PPh 21 dan TER.
2. PPh 23, termasuk jasa konsultan/manajemen dan BPPU.
3. PPN 2022–2025 dan DPP nilai lain.
4. PPh Badan dan fasilitasnya.
5. PPh Final Pasal 4(2) serta UMKM.
6. Rekonsiliasi BPPU/KOP.

### Aturan publikasi

- `verified_primary`: angka, periode, dan kondisi didukung sumber primer.
- `verified_secondary`: sudah ditinjau tetapi sumber primer belum lengkap.
- `needs_review`: belum cukup untuk klaim pasti.
- `source_conflict`: ada konflik yang belum diputuskan.
- `summary_only`: berguna sebagai orientasi, bukan kalkulator.

Data berisiko tidak dihapus diam-diam. Data tersebut tetap terlihat dengan peringatan jelas dan tidak boleh dipakai resolver sebagai jawaban pasti.

### Validasi otomatis

Build gagal bila ada:

- ID duplikat;
- foreign key hilang;
- siklus supersession;
- interval tidak valid;
- overlap tanpa alasan dalam kelompok eksklusif;
- progressive bracket tumpang tindih/tidak urut;
- source primer wajib yang hilang pada data terverifikasi;
- konflik BPPU yang tidak ditandai;
- calculator output berbeda dari aturan kanonik;
- output root dan website tidak sinkron;
- OpenAPI tidak valid.

## Pipeline Build

Satu perintah bersih harus:

1. memvalidasi source data;
2. membersihkan artifact lama;
3. membangun aggregate v1;
4. membangun API temporal v2;
5. menghasilkan search index dan `llms.txt` dari data kanonik;
6. menyinkronkan artifact website;
7. membangun Astro;
8. menjalankan contract tests.

Metadata rilis memuat commit/source hash, generated-at tunggal, coverage, konflik terbuka, dan statistik yang semuanya diturunkan dari data.

## SEO dan Konsumsi AI

- Canonical domain disatukan.
- Sitemap, robots, metadata sosial, dan Dataset JSON-LD ditambahkan.
- Setiap entri mempunyai deep link dan metadata unik.
- `llms.txt` serta endpoint AI-friendly selalu dihasilkan dari dataset yang sama.
- API menyediakan query tanggal, kategori, kode BPPU, dan detail per entri dengan provenance.
- Disclaimer menjelaskan bahwa database adalah referensi dan konteks fakta tetap menentukan penerapan pajak.

## Penanganan Kesalahan

- Filter tanpa hasil menampilkan cara memperluas pencarian.
- Tanggal tanpa aturan menghasilkan gap warning, bukan `0%`.
- Tahun transisi menghasilkan beberapa periode yang diberi label.
- Sumber mati ditandai oleh audit link dan tidak otomatis mengubah isi hukum.
- Konflik data memblokir jawaban pasti tetapi tidak memblokir seluruh website.

## Pengujian dan Kriteria Selesai

- Unit test untuk resolver, interval, rate formatter, search/filter, dan validator.
- Contract test untuk seluruh endpoint dan sinkronisasi artifact.
- Fixture batas tanggal untuk setiap perubahan tarif prioritas.
- Example arithmetic test untuk contoh yang diklaim terverifikasi.
- Build Astro tanpa error.
- Browser QA desktop dan mobile: pencarian, filter URL, detail, navigasi keyboard, tema, tanpa overflow.
- Accessibility: label, focus, `aria-pressed`, live result count, table semantics, reduced motion.
- Tidak ada tabel vertikal yang dipotong menjadi setengah layar.
- Tidak ada klaim `verified_primary` tanpa sumber primer dan locator yang memadai.

## Di Luar Tahap Pertama

Audit lengkap tarif daerah per pemda, tarif bea masuk per HS/origin, tarif cukai per tahun, seluruh treaty PPh 26, serta rekonstruksi verbatim setiap versi pasal membutuhkan fase data tersendiri. Tahap pertama menyediakan model dan status transparan agar perluasan tersebut aman.
