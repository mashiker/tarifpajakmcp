# Tarif Pajak ID

> Database tarif pajak Indonesia yang terbuka, temporal-aware, dan bersumber dari regulasi resmi.

**[tarif-pajak-id.pages.dev](https://tarif-pajak-id.pages.dev)** — Terinspirasi dari [models.dev](https://models.dev).

Database terbuka berisi tarif pajak Indonesia sejak 1983, lengkap dengan interval berlaku (half-open), dasar hukum primer, riwayat perubahan, kode BPPU, dan status verifikasi per klaim. Root `/` langsung membuka database; tidak ada landing page pemasaran.

---

## Yang baru (Redesign Temporal)

Database kini memodelkan tarif sebagai aturan temporal:

- **Interval half-open** `validFrom <= date < validToExclusive`
- **Union rate bertipe** (percentage, fixed, specific, progressive, formula, range, free_text, zero, not_applicable, information_factor)
- **Kondisi penerapan terstruktur** (fact + op + value)
- **Provenance per klaim** dengan status verifikasi: `verified_primary`, `verified_secondary`, `needs_review`, `source_conflict`, `summary_only`
- **Determination resolver**: `tepat`, `bersyarat`, `rentang`, `fakta_kurang`, `konflik_sumber`
- **Konflik sumber dideklarasikan**, bukan dipilih diam-diam. Resolver tidak mengembalikan `tepat` dari aturan konflik.

API v1 (legacy) tetap kompatibel; v2 adalah model temporal kanonik.

---

## Status Data (v2 kanonik, terverifikasi sumber primer)

| | |
|---|---|
| PPh 21 + TER (PP 58/2023) | TER A/B/C migrated; verified_primary |
| PPh 23 + BPPU (PMK 141/2015) | Goal scenario "jasa konsultan 2020" terverifikasi (UU PPh 23(1)(c)(2) + BPPU 24-104-03) |
| PPN 2022–2025 (UU HPP, PMK 131/2024) | nominal/DPP-factor/effective-burden separation; 2025 bersyarat |
| PPh Badan + Final/UMKM | 25/22/22 kronologi; Article 31E proporsional; UMKM PP46→PP23→PP55→PP20/2026 |

Konflik sumber yang diketahui dideklarasikan di setiap kategori (`knownDiscrepancies`), bukan dipilih diam-diam.

---

## Website

| Halaman | URL | Deskripsi |
|---------|-----|-----------|
| Database | `/` | Tabel data lengkap dengan search, filter, dan timeline per aturan |
| Detail tarif | `/tarif/{id}` | Detail per konsep: kronologi aturan, dasar hukum, BPPU, sumber primer |
| Kategori | `/kategori/{slug}` | Detail per kategori pajak |
| TER PPh 21 | `/ter-pph-21` | Tabel TER kanonik (PP 58/2023 Lampiran A/B/C) |
| Kode BPPU | `/kode-objek-pajak` | Kode objek pajak dengan search |
| API Docs | `/api-docs` | Dokumentasi API v1 + v2 |

**Tech stack:** Astro 5 · Svelte 5 · Tailwind CSS 3 · TypeScript ESM · AJV · Vitest

---

## Build & Commands

Pipeline deterministik: validate → generate → sync → Astro build → contract tests. Satu perintah `pnpm build` melakukan semuanya.

```bash
# Install
pnpm install
cd website && pnpm install && cd ..

# Validate data v1 + v2
pnpm validate

# Generate semua artifact (api.json, api/v1, api/v2, llms.txt, llms-full.txt, robots.txt, sitemap.xml, dataset-jsonld.json)
pnpm generate

# Sync artifact ke root public + website public (byte-identical via manifest)
pnpm sync

# Build website (Astro static)
pnpm build:site

# Full pipeline: clean → validate → generate → sync → Astro → contracts
pnpm build

# Tests
pnpm test              # semua test (unit + contract)
pnpm test:contracts    # contract test saja
```

Fixed-epoch reproducibility: `SOURCE_DATE_EPOCH=1789094400 pnpm build` menghasilkan output byte-identical lintas run (diverifikasi oleh contract test `release-metadata` dan `artifact-sync`).

---

## Arsitektur

```
tarifpajakmcp/
├── data/
│   ├── categories/        # Source data v1 (legacy entries)
│   ├── consolidated/      # UU Konsolidasi (KUP, PPh, PPN)
│   ├── regulations/       # Metadata regulasi (UU, PP, PMK, dll)
│   ├── schema/            # JSON Schema validasi (v1 + v2)
│   └── v2/                # Source data v2 (temporal, kanonik)
│       ├── rules.json     # 67 aturan temporal
│       ├── concepts.json  # 41 konsep transaksi
│       ├── categories.json
│       ├── sources.json   # 36 sumber primer/pendukung
│       ├── conflicts.json # konflik sumber dideklarasikan
│       └── bppu.json
├── src/
│   ├── config.ts          # CANONICAL_ORIGIN (satu constant)
│   ├── core/              # release, resolver, rate, date, conditions, search, types
│   ├── validation/        # AJV schemas + semantic validator
│   ├── compat/v1.ts       # v1 → v2 compatibility projection
│   ├── generators/
│   │   ├── v1.ts          # API v1 (legacy, byte-stable)
│   │   ├── v2.ts          # API v2 (temporal, kanonik)
│   │   ├── openapi.ts     # OpenAPI 3.0.3 v1 + v2
│   │   ├── llms.ts        # llms.txt + llms-full.txt (dari v2)
│   │   ├── metadata.ts    # robots.txt, sitemap.xml, dataset JSON-LD
│   │   └── search.ts
│   ├── pipeline.ts        # clean → validate → generate → sync → Astro → contracts
│   ├── generate.ts        # aggregate api.json + release context + llms + metadata
│   ├── sync-website.ts    # byte-identical manifest sync (root public ↔ website public)
│   └── validate.ts
├── public/                # Generated artifact (root public mirror)
├── tests/
│   ├── contracts/         # 15 contract test (v1, v2, openapi, detail, SEO, LLM, dll)
│   ├── fixtures/          # Boundary fixtures per kategori
│   └── unit/              # 21 unit test
└── website/               # Astro + Svelte + Tailwind frontend
    ├── src/
    │   ├── layouts/Base.astro     # Canonical/OG/Twitter/JSON-LD metadata
    │   ├── lib/
    │   │   ├── dataset.ts         # buildDatabaseDataset dari v2 corpus
    │   │   ├── database-state.ts  # filter/sort pure functions
    │   │   ├── database-markup.ts # row/card template + timeline + verification
    │   │   ├── detail.ts          # per-concept view model
    │   │   └── seo.ts             # escapeJsonLd + entry-level metadata
    │   ├── components/database/   # DatabaseToolbar, DatabaseTable, DatabaseCards, dst
    │   └── pages/
    │       ├── index.astro        # Root database (Dataset JSON-LD)
    │       ├── tarif/[id].astro   # Detail per konsep (entry-level JSON-LD)
    │       ├── kategori/[slug].astro
    │       ├── ter-pph-21.astro
    │       ├── kode-objek-pajak.astro
    │       ├── api-docs.astro     # v1 + v2 docs + static-host + provenance
    │       └── 404.astro          # noindex
    └── public/                    # Generated artifact (website public mirror)
```

### Canonical origin

Satu constant di `src/config.ts`: `https://tarif-pajak-id.pages.dev`. Astro `site`, OpenAPI servers, robots.txt, sitemap.xml, JSON-LD, dan llms.txt semuanya memetakan dari constant ini. Untuk pindah ke domain kustom, ubah satu tempat.

---

## API

Akses JSON statis tanpa backend, tanpa auth. Base URL: `https://tarif-pajak-id.pages.dev/api/`

### v2 (temporal, kanonik)

```bash
# Index + release metadata
curl https://tarif-pajak-id.pages.dev/api/v2/index.json

# Corpus aturan (untuk resolve client-side)
curl https://tarif-pajak-id.pages.dev/api/v2/rules-corpus.json

# Resolusi per tanggal
curl https://tarif-pajak-id.pages.dev/api/v2/at-date/2024-06-15.json

# Resolusi per tahun
curl https://tarif-pajak-id.pages.dev/api/v2/by-year/2025.json

# Sumber/provenance
curl https://tarif-pajak-id.pages.dev/api/v2/sources/index.json

# OpenAPI v2
curl https://tarif-pajak-id.pages.dev/api/v2/openapi.json
```

### v1 (kompatibilitas legacy)

```bash
curl https://tarif-pajak-id.pages.dev/api/v1/index.json
curl https://tarif-pajak-id.pages.dev/api/v1/entries/ppn-11pct-effective-2025.json
curl https://tarif-pajak-id.pages.dev/api/v1/calculator/ppn.json   # diproyeksikan dari v2
```

### Output AI/LLM

```bash
# Orientasi ringkas (determination, batasan, statistik)
curl https://tarif-pajak-id.pages.dev/llms.txt

# Referensi lengkap (tarif berlaku terverifikasi + caveats needs_review/conflict)
curl https://tarif-pajak-id.pages.dev/llms-full.txt
```

---

## SEO

- **Canonical origin**: satu constant, di-mirror ke Astro `site`.
- **sitemap.xml**: index HTML routes (root, `/tarif/*`, `/kategori/*`, tools, `/api-docs`). Endpoint JSON dan 404 di-exclude.
- **robots.txt**: allow all, point at sitemap.
- **Metadata**: canonical URL, OG/Twitter, JSON-LD (Dataset di root, entry-level di detail).
- **404 noindex**.
- JSON-LD di-escape (`<`, `>`, `&` → `\u003c`, `\u003e`, `\u0026`).

---

## Sumber Data Primer

- **[JDIH BPK](https://peraturan.bpk.go.id)** — Database peraturan resmi
- **[DJP/Kemenkeu](https://www.pajak.go.id)** — Penjelasan tarif dan panduan
- **[peraturan.go.id](https://peraturan.go.id)** — Portal peraturan Kemenkeu
- **[Pasal.id](https://pasal.id)** — Peraturan Indonesia

Sumber sekunder hanya membantu penelusuran; angka final selalu mengacu ke sumber primer.

---

## Disclaimer

Database ini adalah **referensi bersumber dari regulasi resmi Republik Indonesia**, BUKAN nasihat pajak resmi dan BUKAN panduan pemerintah. Konteks fakta transaksi menentukan penerapan tarif. Selalu verifikasi dengan peraturan resmi terbaru sebelum mengambil keputusan perpajakan.

## Lisensi

- **Kode**: [MIT](LICENSE)
- **Data**: [CC-BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/)
