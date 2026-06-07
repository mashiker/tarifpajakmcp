# Tarif Pajak ID

> Database tarif pajak Indonesia yang terbuka dan bersumber dari regulasi resmi.

**[tarif-pajak-id.pages.dev](https://tarif-pajak-id.pages.dev)** — Terinspirasi dari [models.dev](https://models.dev).

Database terbuka berisi tarif pajak Indonesia dari 1983 hingga saat ini, lengkap dengan status berlaku/dicabut, dasar hukum, riwayat perubahan, kode BPPU, dan UU Konsolidasi dengan pelacakan amendemen per pasal.

---

## Statistik

| | |
|---|---|
| **136** entry tarif pajak | **111** tarif aktif (berlaku) |
| **15** kategori pajak | **170** kode BPPU |
| **39** regulasi tercatat | **3** UU Konsolidasi (147 pasal) |

---

## Website

Website data-first dengan tabel interaktif, pencarian, filter status/kategori, dan kalkulator TER PPh 21.

| Halaman | URL | Deskripsi |
|---------|-----|-----------|
| Beranda | `/` | Tabel data lengkap dengan search & filter |
| Database | `/database` | Database tarif dengan filter status dan kategori |
| TER PPh 21 | `/ter-pph-21` | Kalkulator tarif efektif + tabel A/B/C |
| Kode BPPU | `/kode-objek-pajak` | 170 kode objek pajak dengan search |
| API Docs | `/api-docs` | Dokumentasi API dengan try-it panel |
| Kategori | `/kategori/:slug` | Detail per kategori pajak (15 halaman) |

**Tech stack:** Astro 5 · Svelte 5 · Tailwind CSS 3 · TypeScript

---

## API

Akses gratis dalam format JSON statis, tanpa auth.

### Endpoint Utama

```bash
# Database lengkap
curl https://tarif-pajak-id.pages.dev/api.json

# Tarif ternormalisasi (flat)
curl https://tarif-pajak-id.pages.dev/rates.json

# Metadata regulasi
curl https://tarif-pajak-id.pages.dev/regulations.json

# UU Konsolidasi (semua)
curl https://tarif-pajak-id.pages.dev/consolidated.json

# Chatbot-friendly
curl https://tarif-pajak-id.pages.dev/llms.txt
```

### API v1

```bash
# Index
curl https://tarif-pajak-id.pages.dev/api/v1/index.json

# Per kategori
curl https://tarif-pajak-id.pages.dev/api/v1/categories/pph-21.json

# Per entry
curl https://tarif-pajak-id.pages.dev/api/v1/entries/ppn-11pct-effective-2025.json

# UU Konsolidasi per pasal
curl https://tarif-pajak-id.pages.dev/api/v1/consolidated/uu-pph-konsolidasi/pasal-10.json
```

---

## Kategori Pajak

| Kategori | Entry | | Kategori | Entry |
|----------|-------|-|----------|-------|
| PPh 21 (TER + Progresif) | 29 | | PPN | 14 |
| PPh 22 (Impor/Pembelian) | 11 | | PPnBM | 8 |
| PPh 23 (Jasa/Sewa) | 8 | | Bea Meterai | 8 |
| PPh 26 (WP Luar Negeri) | 7 | | PBB | 4 |
| PPh Badan | 8 | | BPHTB | 3 |
| PPh UMKM | 3 | | Bea Masuk | 4 |
| PPh 4(2) Final | 18 | | Cukai | 3 |
| | | | Pajak Daerah | 8 |

---

## UU Konsolidasi

Naskah konsolidasi UU pajak Indonesia — teks terkini setelah semua perubahan diterapkan, lengkap dengan riwayat per pasal.

| UU | Dasar | Perubahan | Pasal | Diubah | Ditambah | Berlaku |
|----|-------|-----------|-------|--------|----------|---------|
| **UU KUP** | UU 6/1983 | 6 (→ UU 7/2021 HPP) | 58 | 26 | 9 | 23 |
| **UU PPh** | UU 7/1983 | 5 (→ UU 7/2021 HPP) | 44 | 27 | 8 | 9 |
| **UU PPN** | UU 8/1983 | 3 (→ UU 7/2021 HPP) | 45 | 22 | 13 | 10 |

**Rantai perubahan:**
- UU KUP: UU 6/1983 → UU 9/1994 → UU 16/2000 → UU 28/2007 → Perppu 5/2008 → UU 7/2021
- UU PPh: UU 7/1983 → UU 10/1994 → UU 17/2000 → UU 36/2008 → UU 7/2021
- UU PPN: UU 8/1983 → UU 42/2009 → UU 7/2021

---

## Struktur Proyek

```
tarifpajakmcp/
├── data/
│   ├── categories/        # 15 JSON files — entry tarif per kategori
│   ├── consolidated/      # 3 JSON files — UU Konsolidasi (KUP, PPh, PPN)
│   ├── regulations/        # Metadata regulasi (UU, PP, PMK, dll)
│   └── schema/             # JSON Schema validasi
├── src/
│   ├── build.ts            # Validasi data + generate public/*.json
│   └── build-api.ts        # Generate API v1 static endpoints
├── public/                 # Generated JSON API + llms.txt
├── website/                # Astro + Svelte + Tailwind frontend
│   ├── src/
│   │   ├── layouts/        # Base layout (header, footer, dark mode)
│   │   ├── pages/          # 6 pages + 15 dynamic category pages
│   │   └── styles/         # Design system (CSS custom properties)
│   ├── public/             # Favicon + copied JSON
│   └── dist/               # Static build output
└── .secrets/               # API keys (gitignored)
```

---

## Quick Start

```bash
# Clone
git clone git@github.com:mashiker/tarifpajakmcp.git
cd tarifpajakmcp

# Install dependencies
pnpm install
cd website && pnpm install && cd ..

# Build data (validate + generate JSON)
pnpm build

# Build API v1 endpoints
pnpm build:api

# Build everything (data + API + website)
pnpm build:all

# Dev server
cd website && pnpm dev
```

---

## Dasar Hukum Utama

| Regulasi | Tentang | Status |
|----------|---------|--------|
| UU 7/2021 (HPP) | Harmonisasi Peraturan Perpajakan | Berlaku |
| PP 58/2023 | TER PPh 21 | Berlaku |
| PMK 168/2023 | Petunjuk Pemotongan PPh 21 | Berlaku |
| PP 60/2023 | Tarif PPh 22/23/26 | Berlaku |
| PP 55/2022 | PPh UMKM 0,5% | Berlaku |
| PMK 131/2024 | Tarif PPN Efektif | Berlaku |

---

## Sumber Data

- **[JDIH BPK](https://peraturan.bpk.go.id)** — Database peraturan resmi
- **[Pasal.id](https://pasal.id)** — 40.000+ peraturan Indonesia
- **[DJP/Kemenkeu](https://pajak.go.id)** — Penjelasan tarif dan panduan
- **[peraturan.go.id](https://peraturan.go.id)** — Portal peraturan Kemenkeu

---

## Disclaimer

Database ini adalah **referensi bersumber dari regulasi resmi**, BUKAN nasihat hukum atau pajak. Selalu verifikasi dengan peraturan resmi terbaru.

## Lisensi

- **Kode**: [MIT](LICENSE)
- **Data**: [CC-BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/)
