# Tarif Pajak ID 🇮🇩

> Database tarif pajak Indonesia yang terbuka dan bersumber dari regulasi resmi.

Database terbuka berisi **tarif pajak Indonesia** dari 1983 hingga saat ini, lengkap dengan status berlaku/dicabut, dasar hukum, dan riwayat perubahan. Juga memuat **UU Konsolidasi** (KUP, PPh, PPN) dengan pelacakan amendemen per pasal. Terinspirasi dari [models.dev](https://models.dev/).

## 📊 Statistik

- **135** entry tarif pajak
- **37** regulasi tercatat
- **15** kategori pajak
- **3** UU Konsolidasi (147 pasal total)

## 🏗️ Kategori

| Kategori | Jenis Pajak | Entry |
|----------|-------------|-------|
| PPh | PPh 21 (TER + Progresif) | 4+ |
| PPh | PPh 22 (Impor/Pembelian) | 3+ |
| PPh | PPh 23 (Jasa/Sewa) | 4+ |
| PPh | PPh 26 (WP Luar Negeri) | 1+ |
| PPh | PPh Badan | 2+ |
| PPh | PPh UMKM | 2+ |
| PPh | PPh 4(2) Final | 4+ |
| PPN | PPN | 4+ |
| PPnBM | PPnBM | 1+ |
| Bea Meterai | Bea Meterai | 1+ |
| PBB | PBB | 1+ |
| BPHTB | BPHTB | 1+ |
| Bea Masuk | Bea Masuk | 1+ |
| Cukai | Cukai | 1+ |
| Pajak Daerah | PDRD | 1+ |

## 📜 UU Konsolidasi

Naskah konsolidasi UU pajak Indonesia yang menunjukkan teks terkini setelah semua perubahan diterapkan, lengkap dengan riwayat perubahan per pasal.

| UU Konsolidasi | Dasar | Perubahan | Pasal | Diubah | Ditambah | Berlaku |
|---|---|---|---|---|---|---|
| **UU KUP** | UU 6/1983 | 6 (→ UU 7/2021 HPP) | 58 | 26 | 9 | 23 |
| **UU PPh** | UU 7/1983 | 5 (→ UU 7/2021 HPP) | 44 | 27 | 8 | 9 |
| **UU PPN** | UU 8/1983 | 3 (→ UU 7/2021 HPP) | 45 | 22 | 13 | 10 |

### Rantai Perubahan

**UU KUP (UU 6/1983):**
UU 6/1983 → UU 9/1994 → UU 16/2000 → UU 28/2007 → Perppu 5/2008 → UU 7/2021 HPP

**UU PPh (UU 7/1983):**
UU 7/1983 → UU 10/1994 → UU 17/2000 → UU 36/2008 → UU 7/2021 HPP

**UU PPN (UU 8/1983):**
UU 8/1983 → UU 42/2009 → UU 7/2021 HPP

### Contoh Data Per Pasal

```json
{
  "number": "10",
  "title": "Tarif PPh Orang Pribadi (Progresif)",
  "status": "diubah",
  "amendmentHistory": [
    { "source": "UU 7/1983", "changeType": "original", "summary": "Tarif progresif 10%-35% (4 lapis)" },
    { "source": "UU 17/2000", "changeType": "amended", "summary": "Tarif progresif 5%-35% (5 lapis)" },
    { "source": "UU 36/2008", "changeType": "amended", "summary": "Tarif progresif 5%-30% (7 lapis)" },
    { "source": "UU 7/2021", "changeType": "amended", "summary": "Tarif progresif 5%-35% (4 lapis) — PKP > Rp 5 miliar 35%" }
  ]
}
```

## 🔌 API

Akses gratis dalam format JSON:

```bash
# Database lengkap (tarif + konsolidasi)
curl https://tarif-pajak-id.vercel.app/api.json

# Tarif ternormalisasi
curl https://tarif-pajak-id.vercel.app/rates.json

# Metadata regulasi
curl https://tarif-pajak-id.vercel.app/regulations.json

# UU Konsolidasi (semua)
curl https://tarif-pajak-id.vercel.app/consolidated.json

# UU Konsolidasi spesifik
curl https://tarif-pajak-id.vercel.app/api/v1/consolidated/uu-pph-konsolidasi.json

# Detail pasal tertentu
curl https://tarif-pajak-id.vercel.app/api/v1/consolidated/uu-pph-konsolidasi/pasal-10.json

# Chatbot-friendly
curl https://tarif-pajak-id.vercel.app/llms.txt
```

## 📁 Struktur

```
tarif-pajak-id/
├── data/
│   ├── regulations/     # Metadata regulasi (UU, PP, PMK, dll)
│   ├── categories/      # Entry tarif per kategori pajak
│   ├── consolidated/    # UU Konsolidasi (KUP, PPh, PPN)
│   └── schema/          # JSON Schema validasi
├── src/
│   ├── build.ts         # Build: validasi → generate API
│   └── build-api.ts     # Build API v1 endpoints
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

# Build API v1 endpoints
pnpm build:api

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
