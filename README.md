# Tarif Pajak ID 🇮🇩

> Database tarif pajak Indonesia yang terbuka dan bersumber dari regulasi resmi.

Database terbuka berisi **tarif pajak Indonesia** dari 1983 hingga saat ini, lengkap dengan status berlaku/dicabut, dasar hukum, dan riwayat perubahan. Terinspirasi dari [models.dev](https://models.dev/).

## 📊 Statistik

- **26** entry tarif pajak
- **16** regulasi tercatat
- **10** kategori pajak
- **21** tarif sedang berlaku

## 🏗️ Kategori

| Kategori | Jenis Pajak | Entry |
|----------|-------------|-------|
| PPh | PPh 21 (TER + Progresif) | 4 |
| PPh | PPh 22 (Impor/Pembelian) | 3 |
| PPh | PPh 23 (Jasa/Sewa) | 4 |
| PPh | PPh 26 (WP Luar Negeri) | 1 |
| PPh | PPh Badan | 2 |
| PPh | PPh UMKM | 2 |
| PPh | PPh 4(2) Final | 4 |
| PPN | PPN | 4 |
| PPnBM | PPnBM | 1 |
| Bea Meterai | Bea Meterai | 1 |

## 🔌 API

Akses gratis dalam format JSON:

```bash
# Database lengkap
curl https://tarif-pajak-id.vercel.app/api.json

# Tarif ternormalisasi
curl https://tarif-pajak-id.vercel.app/rates.json

# Metadata regulasi
curl https://tarif-pajak-id.vercel.app/regulations.json

# Chatbot-friendly
curl https://tarif-pajak-id.vercel.app/llms.txt
```

## 📁 Struktur

```
tarif-pajak-id/
├── data/
│   ├── regulations/     # Metadata regulasi (UU, PP, PMK, dll)
│   ├── categories/      # Entry tarif per kategori pajak
│   └── schema/          # JSON Schema validasi
├── src/
│   └── build.ts         # Build: validasi → generate API
├── public/              # Generated JSON API + llms.txt
├── website/             # Astro + Svelte website
│   ├── src/pages/       # Homepage + kategori detail pages
│   └── dist/            # Static build output
└── .secrets/            # API keys (gitignored)
```

## 🚀 Quick Start

```bash
# Install dependencies
pnpm install

# Build data (validate + generate JSON)
pnpm build

# Build website
cd website && pnpm install && pnpm build

# Preview
cd website && pnpm preview
```

## 📚 Sumber Data

- **[Pasal.id](https://pasal.id)** — 40,000+ peraturan Indonesia via MCP API
- **[JDIH BPK](https://peraturan.bpk.go.id)** — Database peraturan resmi
- **[peraturan.go.id](https://peraturan.go.id)** — Portal peraturan Kemenkeu
- **[DJP/Kemenkeu](https://pajak.go.id)** — Penjelasan tarif dan panduan

## ⚖️ Dasar Hukum Utama

| Regulasi | Tentang | Status |
|----------|---------|--------|
| UU 7/2021 (HPP) | Harmonisasi Peraturan Perpajakan | Berlaku |
| PP 58/2023 | TER PPh 21 | Berlaku |
| PMK 168/2023 | Petunjuk Pemotongan PPh 21 | Berlaku |
| PP 60/2023 | Tarif PPh 22/23/26 | Berlaku |
| PP 55/2022 | PPh UMKM 0,5% | Berlaku |
| PMK 131/2024 | Tarif PPN Efektif | Berlaku |
| PP 131/2000 | PPh Final | Diubah sebagian |

## ⚠️ Disclaimer

Database ini adalah **referensi bersumber dari regulasi resmi**, BUKAN nasihat hukum atau pajak. Selalu verifikasi dengan peraturan resmi terbaru.

## 📝 Lisensi

- **Kode**: MIT License
- **Data**: CC-BY-SA 4.0
