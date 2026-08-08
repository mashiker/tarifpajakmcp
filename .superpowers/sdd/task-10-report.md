# Task 10 Report — SEO, API Docs, dan Output AI/LLM

> **Tanggal**: 2026-08-08
> **Status**: ✅ DONE
> **Repository**: `E:\kantor_archisight\tarifpajak\tarifpajakmcp`
> **Branch**: `main` lokal. No commit/push/deploy.

## Tujuan

Task 10 menyatukan canonical domain, menambahkan sitemap + robots.txt + base metadata (canonical/OG/Twitter/JSON-LD), Dataset JSON-LD di root, entry-level metadata di detail pages, regenerasi `llms.txt` dan `llms-full.txt` dari v2 rules, penulisan ulang API docs untuk v1+v2 + static-host + provenance, dan update README. No Playwright QA (Task 11).

## TDD (RED → GREEN)

Dua file contract test ditulis terlebih dahulu, divalidasi RED (41 failed / 5 vacuous-pass pada saat ditulis), lalu implementasi dijalankan hingga GREEN.

### File test baru

- `tests/contracts/seo-output.test.ts` — 29 tests:
  - canonical origin single constant, mirrors into Astro `site`
  - generated llms.txt / llms-full.txt tidak menyebut vercel.app atau placeholder GitHub user
  - robots.txt allow-all + sitemap URL pada canonical origin + tidak mem-block HTML surface
  - sitemap.xml well-formed XML, mencakup root + tarif detail + kategori + tools + api-docs, exclude raw JSON dan 404
  - root metadata: canonical, og:title/description/url/type/image, twitter card, Dataset JSON-LD dengan name/description/license/temporalCoverage/dateModified/distribution/creator/publisher/variableMeasured/provenance
  - Dataset JSON-LD distribution link v1, v2, llms.txt; tidak mengaku guidance pemerintah resmi
  - JSON-LD escape helper `<`, `>`, `&` → `\u003c`, `\u003e`, `\u0026`; built JSON-LD tidak mengandung literal `<`
  - detail pages: canonical, og:url, JSON-LD entry-level dengan API alternate link dan concept id/category
  - 404 noindex, tanpa canonical
  - API docs page menyebut v1, v2, dan "statis"
- `tests/contracts/llm-output.test.ts` — 17 tests:
  - llms.txt + llms-full.txt generated non-empty; llms-full lebih besar
  - keduanya reference canonical origin, bukan vercel.app
  - keduanya link llms-full.txt dan v2 API
  - rule count, concept count, open-ended count sesuai v2 corpus
  - determination values `tepat`/`bersyarat`/`rentang`/`fakta_kurang`/`konflik_sumber` dijelaskan
  - `source_conflict` tidak boleh jadi jawaban pasti; `summary_only` orientasi saja; `fakta_kurang` tidak boleh jadi advice pasti
  - needs_review count tidak pernah muncul sebagai verified count (whole-word match, substring "4" di "34" tidak boleh false-positive)
  - "currently applicable verified rates" count = verified_primary open-ended rules (34)
  - needs_review (4) + source_conflict (2) count disebut sebagai caveats
  - disclaimer non-pemerintah + arahan ke sumber primer
  - determinism: pure function, same input → same output

## Investigasi

- `src/generate.ts` punya blok lama `llms.txt` yang membaca statistik v1 dan mengandung `https://tarif-pajak-id.vercel.app/api.json` serta `https://github.com/user/tarif-pajak-id` (placeholder). Blok ini dihapus.
- `website/astro.config.mjs` memakai `site: 'https://tarif-pajak-id.vercel.app'` (stale).
- `src/generators/openapi.ts` mendefinisikan `CANONICAL_ORIGIN` lokal — di-relocate ke `src/config.ts` dan di-re-export.
- `Base.astro` hanya emit og:title/description/type + twitter:card, tanpa canonical URL, og:url, og:image, twitter:title/description, atau JSON-LD. Tidak ada dukungan noindex.
- `404.astro` memakai canonical (`<link rel="canonical" href="/" />`) dan link `/database` (stale — `/database` di-kanonisasi-redirect ke `/`).
- Halaman detail `/tarif/[id].astro` tidak emit metadata entry-level.
- `api-docs.astro` hanya mendokumentasikan v1, tanpa v2, tanpa static-host limitations, tanpa provenance, tanpa AI/LLM output.

## Solusi

### 1. Canonical origin (satu constant)

- `src/config.ts` baru: `export const CANONICAL_ORIGIN = 'https://tarif-pajak-id.pages.dev'` + helper `canonicalUrl(path)`.
- `src/generators/openapi.ts` mengimpor dari `src/config.ts` dan re-export.
- `website/astro.config.mjs` memakai literal string yang sama (`site: 'https://tarif-pajak-id.pages.dev'`) — contract test memverifikasi keduanya cocok dan tidak ada `vercel.app`.

### 2. Generator LLM (`src/generators/llms.ts` baru)

- `generateLlmsOutput({ data, release, origin })` pure function.
- Membangun `llms.txt` (orientasi ringkas) dan `llms-full.txt` (referensi lengkap) dari corpus v2 yang sama dengan API.
- Statistik kanonik di-derive dari corpus: rule/concept/category/conflict count, open-ended count, verified_primary open-ended count (34), needs_review count (4), source_conflict count (2), summary_only count (9).
- Menjelaskan lima determination values + lima verification status + batasan eksplisit (`source_conflict` tidak boleh jawaban pasti; `summary_only` orientasi saja; `fakta_kurang` tidak boleh advice pasti).
- "Tarif berlaku terverifikasi" hanya berisi verified_primary open-ended rules (34), secara eksplisit menyebut bahwa needs_review open-ended (2) TIDAK termasuk.
- Daftar caveats terpisah: needs_review, source_conflict, summary_only.
- Endpoint AI-friendly, sumber primer, disclaimer non-pemerintah.
- Tidak ada `vercel.app` atau placeholder GitHub user.

### 3. Generator metadata (`src/generators/metadata.ts` baru)

- `generateMetadataArtifacts({ data, release, origin, staticRoutes })` pure function.
- `renderRobotsTxt(origin)` — allow all, sitemap URL pada canonical origin.
- `renderSitemapXml(paths, origin)` — well-formed XML, exclude `/api/v1/`, `/api/v2/`, `*.json`, dan `/404`.
- `composeSitemapPaths(data, staticRoutes)` — derive concept paths dari corpus (`/tarif/{conceptId}`) + category paths (`/kategori/{slug}`) + static routes; sorted; excludes 404.
- `renderDatasetJsonLd(data, release, origin)` — Dataset JSON-LD dengan `@context`, name, description (menyebut "Bukan nasihat pajak resmi; bukan panduan pemerintah"), url, license, temporalCoverage, dateModified, datePublished, distribution (v1+v2+llms.txt+llms-full.txt+OpenAPI dengan `contentUrl` dan `url`), variableMeasured (per-category rule counts + verification coverage), creator, publisher, provenance summary.
- `DEFAULT_STATIC_HTML_ROUTES` = `['/', '/api-docs', '/ter-pph-21', '/kode-objek-pajak']`.

### 4. SEO helpers website (`website/src/lib/seo.ts` baru)

- `escapeJsonLd(value)` — `<` → `\u003c`, `>` → `\u003e`, `&` → `\u0026` (HTML-safe JSON-LD inline).
- `serializeJsonLd(value)` — `escapeJsonLd(JSON.stringify(value))`.
- `detailCanonicalUrl(origin, conceptId)`.
- `buildEntryMetadata({ conceptId, conceptName, ..., apiUrl, origin, description })` → `{ canonicalUrl, ogUrl, jsonLd, jsonLdHtml }` — Dataset JSON-LD per-entry dengan `subjectOf`, `isBasedOn` ke API document, `temporalCoverage`, dan `about` link ke kategori.

### 5. Wire ke pipeline (`src/generate.ts`)

- Blok lama `llms.txt` (yang membaca v1 stats + vercel.app + placeholder GitHub) dihapus.
- Setelah `generateApiV2`, corpus v2 dibaca ulang dan `generateLlmsOutput` menulis `llms.txt` + `llms-full.txt`.
- `generateMetadataArtifacts` menulis `robots.txt`, `sitemap.xml`, `dataset-jsonld.json`.
- `release.json` tetap ditulis pada posisi yang sama.

### 6. Base.astro (`website/src/layouts/Base.astro`)

- Props baru: `canonicalPath`, `image`, `jsonLd`, `noindex`.
- Emit `<link rel="canonical">` (kecuali noindex) atau `<meta name="robots" content="noindex, nofollow">` (untuk 404).
- Emit `og:title`, `og:description`, `og:type`, `og:url`, `og:image`, `og:site_name`, `og:locale`.
- Emit `twitter:card`, `twitter:title`, `twitter:description`, `twitter:image`.
- Embed satu atau lebih `<script type="application/ld+json" set:html={serializeJsonLd(block)} />` block.

### 7. Halaman

- `index.astro` — load `dataset-jsonld.json`, teruskan sebagai `jsonLd` prop + `canonicalPath="/"`. Menghapus `<link rel="canonical" href="/" />` manual (sekarang di-handle BaseLayout).
- `tarif/[id].astro` — panggil `buildEntryMetadata` di frontmatter, teruskan `canonicalPath`, `jsonLd`, dan description ke BaseLayout. Menghapus `<link rel="canonical">` manual.
- `404.astro` — `noindex={true}`, ganti `/database` link jadi `/` (database sekarang di root).
- `ter-pph-21.astro` — `canonicalPath="/ter-pph-21"`.
- `kode-objek-pajak.astro` — `canonicalPath="/kode-objek-pajak"`.
- `kategori/[slug].astro` — `canonicalPath={\`/kategori/${slug}\`}` untuk kedua cabang (v2-only dan v1).
- `api-docs.astro` — ditulis ulang sepenuhnya:
  - Frontmatter load corpus v2 untuk snapshot statistik live (rules, concepts, categories, conflicts) dan releaseLabel.
  - `canonicalPath="/api-docs"`.
  - Banner "Hosting statis, provenance, dan batasan": statis (bukan server), v1 kompatibel + v2 temporal kanonik, determination bukan jawaban tunggal, provenance per klaim, BUKAN nasihat pajak resmi.
  - Snapshot data v2 dengan live counts.
  - Endpoint v2 (META, RULES, CONCEPTS, TEMPORAL by-year/at-date, PROVENANCE sources/bppu/categories, RESOLVER corpus/search).
  - Endpoint v1 (kompatibilitas legacy: META, ENTRIES, CATEGORIES, TEMPORAL, BPPU, TIMELINE, CALCULATOR, CONSOLIDATED, SPEC).
  - Section "Output AI/LLM" dengan link `/llms.txt` dan `/llms-full.txt`.
  - Try It dengan optgroup v1/v2.
  - Use case v2 (at-date, by-year, corpus, sources).

### 8. README

Ditulis ulang total: Yang Baru (Redesign Temporal), Status Data v2, Website table, Build & Commands (pipeline deterministik + fixed-epoch reproducibility), Arsitektur (struktur folder lengkap dengan generators/llms.ts + metadata.ts + lib/seo.ts), Canonical origin section, API (v2 kanonik + v1 legacy + AI/LLM output), SEO section, Sumber Data Primer, Disclaimer (bukan nasihat pajak resmi, bukan panduan pemerintah).

## Hasil

### Test
- **449 / 449 pass** (36 file): 282 unit + 167 contract (sebelumnya 403 tests di Task 1–9).
- Dua file test baru: `seo-output.test.ts` (29) + `llm-output.test.ts` (17) = 46 tests baru.
- Fixed-epoch determinism: `llms.txt`, `llms-full.txt`, `sitemap.xml`, `robots.txt`, `dataset-jsonld.json`, `rules-corpus.json` byte-identical across dua run `SOURCE_DATE_EPOCH=1789094400 pnpm generate`.

### Build
- `pnpm generate` → 442 file API v1 + 148 file API v2 + llms.txt + llms-full.txt + robots.txt + sitemap.xml + dataset-jsonld.json.
- `pnpm build:site` → 64 pages built.
- `git diff --check` exit 0 (hanya CRLF/LF warnings, environmental di Windows).

### Verification
- Canonical origin: `https://tarif-pajak-id.pages.dev` di-mirror ke Astro `site`, OpenAPI servers, robots.txt, sitemap.xml, JSON-LD, llms.txt, llms-full.txt. No vercel.app di generated output.
- Dataset JSON-LD di root `index.html` berisi `@type: Dataset`, distribution link v1+v2+llms.txt, variableMeasured per-category + verification coverage, temporalCoverage `1984-01-01/..`, provenance summary, disclaimer "Bukan nasihat pajak resmi; bukan panduan pemerintah".
- Detail pages (e.g. `/tarif/concept-pph-23-jasa-konsultan/index.html`) emit canonical, og:url, dan JSON-LD entry-level dengan API alternate link.
- 404 emit `<meta name="robots" content="noindex, nofollow">` tanpa canonical.
- llms.txt: 34 verified_primary open-ended rules sebagai "tarif berlaku terverifikasi"; 4 needs_review + 2 source_conflict + 9 summary_only sebagai caveats terpisah.
- No commit/push/deploy. Hanya perubahan lokal di main.

## File yang Diubah / Dibuat

**Dibuat**:
- `src/config.ts`
- `src/generators/llms.ts`
- `src/generators/metadata.ts`
- `website/src/lib/seo.ts`
- `tests/contracts/seo-output.test.ts`
- `tests/contracts/llm-output.test.ts`
- `.superpowers/sdd/task-10-report.md` (file ini)

**Dimodifikasi**:
- `src/generate.ts` (hapus blok llms.txt lama, wire generator baru)
- `src/generators/openapi.ts` (re-export CANONICAL_ORIGIN dari config.ts)
- `website/astro.config.mjs` (site ke canonical domain)
- `website/src/layouts/Base.astro` (canonical/OG/Twitter/JSON-LD + noindex support)
- `website/src/pages/index.astro` (Dataset JSON-LD + canonicalPath)
- `website/src/pages/tarif/[id].astro` (entry-level metadata)
- `website/src/pages/404.astro` (noindex, fix /database link)
- `website/src/pages/ter-pph-21.astro` (canonicalPath)
- `website/src/pages/kode-objek-pajak.astro` (canonicalPath)
- `website/src/pages/kategori/[slug].astro` (canonicalPath kedua cabang)
- `website/src/pages/api-docs.astro` (rewrite untuk v1+v2 + static-host + provenance)
- `README.md` (rewrite total)

**Generated (di-regenerate, bukan manual)**:
- `public/llms.txt`, `public/llms-full.txt`, `public/robots.txt`, `public/sitemap.xml`, `public/dataset-jsonld.json`
- `website/public/` mirror (via `pnpm sync` byte-identical manifest)

## Pelajaran

1. **Satu constant untuk canonical origin** — sebelumnya `vercel.app` tersebar di generate.ts, astro.config.mjs, dan README. Memusatkan ke `src/config.ts` + re-export dari openapi.ts + mirror literal di astro.config.mjs membuat migrasi domain kustom nanti menjadi satu tempat.
2. **JSON-LD escape itu wajib, bukan opsional** — `<`/`>`/`&` literal di dalam `<script type="application/ld+json">` bisa keluar dari tag atau break HTML parser. Helper `escapeJsonLd` + contract test ("built JSON-LD tidak mengandung literal `<`") mengunci ini.
3. **Schema.org DataDownload pakai `contentUrl`, bukan `url`** — contract test awalnya mengasumsikan `d.url`, padahal schema.org memakai `contentUrl`. Generator sekarang emit keduanya (untuk kompatibilitas), test di-update untuk tolerate keduanya.
4. **Substring false-positive pada count assertions** — "4" sebagai needs_review count adalah substring dari "34" (verified_primary count). Test harus match whole-word (`(^|\D)4(\D|$)`) dan exclude baris yang jujur melabeli count dengan "needs_review".
5. **llms.txt dari v2, bukan v1** — blok lama menghitung dari v1 aggregate (136 entries, 15 kategori) yang tidak sinkron dengan v2 corpus (67 rules, 7 kategori). Membangun ulang dari v2 corpus memastikan angka yang dirujuk LLM sama dengan API.
6. **"Tarif berlaku terverifikasi" harus selektif** — hanya verified_primary + open-ended (34). needs_review open-ended (2: rule-illustrative-progressive + rule-pph-badan-ikn) TIDAK boleh muncul sebagai tarif berlaku, meskipun intervalnya open-ended. Pemisahan eksplisit di llms-full.txt memblokir penyalahgunaan.

---

## Review Fix Log — Spec PASS / Quality CHANGES_REQUIRED (2026-08-08)

Reviewer menemukan satu **Important** finding (I1) dan satu **Optional Minor** (M2). Fix dilakukan test-first di working tree yang sama, tanpa Playwright.

### Important I1 — verified_primary count (34) salah dilabel sebagai total (true total 47)

**Masalah:** `src/generators/llms.ts` di line 278 (`llms.txt`) dan line 366 (`llms-full.txt`) melabeli `verifiedPrimaryOpenCount` (34) sebagai "aturan saat ini berstatus verified_primary". Frasa "berstatus verified_primary" terbaca sebagai total count untuk status itu — padahal true total adalah 47 (13 rules verified_primary sudah tutup interval / historis). Inkonsistensi cross-artifact: `rules.json`, `rules-corpus.json`, dan `dataset-jsonld.json` sama-sama menunjukkan 47 sebagai total verified_primary. Akibatnya LLM akan understate verification coverage ~30%.

**TDD (RED):** Tambah 6 contract test baru di `tests/contracts/llm-output.test.ts` (describe block "verified_primary total vs open-ended subset (review I1)"):
1. Sanity: data punya gap non-trivial antara total (47) dan open-ended (34) — 13 historis.
2. `llms.txt` menyebut TRUE TOTAL verified_primary count (47).
3. `llms.txt` melabeli open-ended (34) distinctly dari total — qualified dengan "open-ended" / "berlaku saat ini".
4. `llms.txt` TIDAK melabeli open-ended count (34) sebagai status total (line yang menyebut verified_primary tanpa qualifier open-ended/current → fail).
5. `llms-full.txt` menyebut TRUE TOTAL (47) dilabeli sebagai status total.
6. `llms-full.txt` melabeli open-ended (34) sebagai current subset.

RED terkonfirmasi sebelum fix: 4 test gagal (true total 47 absent, open-ended 34 mislabelled).

**Implementasi (GREEN):**
- `DatasetSummary` (interface di `src/generators/llms.ts`) ditambah field `verifiedPrimaryTotalCount`, `verifiedPrimaryClosedCount` (turunan), sudah ada `verifiedPrimaryOpenCount`. `summarizeDataset` sekarang menghitung ketiganya dari corpus.
- `llms.txt` "Statistik" sekarang dua baris eksplisit:
  - `- 47 aturan berstatus verified_primary (total; 13 historis sudah tutup interval, 34 open-ended)`
  - `- 34 aturan berlaku saat ini (open-ended) DAN berstatus verified_primary`
- `llms.txt` "Batasan penting" awal di-reword: `- Total 47 aturan berstatus verified_primary (di seluruh dataset, termasuk yang historis). Dari jumlah itu, 34 berlaku saat ini (open-ended) — itulah angka yang boleh dirujuk sebagai "tarif berlaku terverifikasi".`
- `llms-full.txt` "Statistik kanonik" sekarang tiga baris eksplisit (total 47, open-ended 34, closed 13).
- `llms-full.txt` "Tarif berlaku saat ini yang terverifikasi" section intro di-reword untuk menyebut eksplisit: total 47 verified_primary, hanya 34 yang open-ended, 13 historis sudah tutup.
- 23/23 `llm-output.test.ts` GREEN setelah fix.

**Wording akhir `llms.txt`:**
```
- 47 aturan berstatus verified_primary (total; 13 historis sudah tutup interval, 34 open-ended)
- 34 aturan berlaku saat ini (open-ended) DAN berstatus verified_primary
```

**Wording akhir `llms-full.txt`:**
```
- 47 aturan berstatus verified_primary (total di seluruh dataset)
- 34 aturan berlaku saat ini (open-ended) DAN berstatus verified_primary
- 13 aturan verified_primary historis (sudah tutup interval)
```

### Optional Minor M2 — consolidate canonical-origin literals (done)

**Masalah:** 4 literal `'https://tarif-pajak-id.pages.dev'` tersebar di website: `Base.astro` (line 23), `index.astro` (line 105 fallback), `api-docs.astro` (line 88 Base URL), `tarif/[id].astro` (line 100 origin arg).

**Fix:** `website/src/lib/seo.ts` sekarang export `CANONICAL_ORIGIN`. Semua 4 pemakaian di website mengimpor constant itu:
- `Base.astro` — `import { serializeJsonLd, CANONICAL_ORIGIN } from '../lib/seo.ts'` (hapus lokal const).
- `index.astro` — `import { CANONICAL_ORIGIN } from '../lib/seo.ts'`, fallback URL memakai template literal.
- `api-docs.astro` — `import { CANONICAL_ORIGIN }`, tambah `const apiBaseUrl = \`${CANONICAL_ORIGIN}/api/\``, Base URL card render `{apiBaseUrl}`.
- `tarif/[id].astro` — `import { buildEntryMetadata, CANONICAL_ORIGIN }`, `origin: CANONICAL_ORIGIN`.

Verifikasi: `grep -rn "tarif-pajak-id.pages.dev" website/src/` sekarang hanya 1 hit di `lib/seo.ts:18` (definisi). `astro.config.mjs` tetap literal karena Astro config schema mengharuskan literal string (mirror, bukan import).

### Hasil verifikasi

- **Focused tests:** `pnpm vitest run tests/contracts/llm-output.test.ts` → 23/23 pass (was 17, +6 baru untuk I1).
- **Full test:** `pnpm test` → 455/455 pass (36 file): 282 unit + 173 contract (sebelumnya 449; +6 baru).
- **`pnpm validate`:** "Source validation passed".
- **Fixed-epoch `pnpm build`:** `SOURCE_DATE_EPOCH=1789094400 pnpm build` → clean → validate → generate → sync → Astro build (64 pages) → 173 contract tests pass.
- **Determinism:** `llms.txt` + `llms-full.txt` byte-identical across dua fixed-epoch run.
- **`git diff --check`:** exit 0 (hanya CRLF/LF warnings, environmental di Windows).
- **Git state:** no commit/push. Hanya perubahan lokal di main. HEAD masih `3c4e7c5`.

### File yang diubah

**Dimodifikasi:**
- `src/generators/llms.ts` — `DatasetSummary` + `summarizeDataset` tambah `verifiedPrimaryTotalCount`/`verifiedPrimaryClosedCount`; reword `llms.txt` Statistik + Batasan penting; reword `llms-full.txt` Statistik kanonik + intro section "Tarif berlaku saat ini yang terverifikasi".
- `tests/contracts/llm-output.test.ts` — +6 test baru (describe "verified_primary total vs open-ended subset (review I1)").
- `website/src/lib/seo.ts` — export `CANONICAL_ORIGIN` (single source untuk website).
- `website/src/layouts/Base.astro` — import `CANONICAL_ORIGIN`, hapus lokal const.
- `website/src/pages/index.astro` — import `CANONICAL_ORIGIN`, fallback URL memakai const.
- `website/src/pages/api-docs.astro` — import `CANONICAL_ORIGIN`, `apiBaseUrl` const, render `{apiBaseUrl}`.
- `website/src/pages/tarif/[id].astro` — import `CANONICAL_ORIGIN`, `origin: CANONICAL_ORIGIN`.

**Generated (di-regenerate, bukan manual):**
- `public/llms.txt`, `public/llms-full.txt` (wording I1 fix).
- `website/public/` mirror (via `pnpm sync` byte-identical manifest).

### Pelajaran tambahan

7. **Subset vs total: label keduanya secara eksplisit** — "X aturan berstatus Y" ambigu antara "X dari total" vs "X dengan status Y (di seluruh dataset)". Untuk angka yang subset (open-ended), qualifier wajib ("open-ended" / "berlaku saat ini"). Untuk angka yang total, label "total". Contract test sekarang melock kedua label harus hadir dan tidak tertukar.
8. **Contract test perlu whole-word count matching + qualifier-presence check** — substring match "4" di "34" false-positive; regex `(^|\D)N(\D|$)` + filter "line menyebut verified_primary TANPA qualifier open-ended" menangkap wording bug yang awalnya lolos.
