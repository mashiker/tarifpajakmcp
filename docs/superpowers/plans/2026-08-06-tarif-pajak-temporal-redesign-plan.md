# Tarif Pajak Temporal Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Membangun database tarif pajak Indonesia satu halaman yang full-width, temporal-aware, transparan terhadap konflik, dan bersumber hukum primer untuk manusia serta AI/LLM.

**Architecture:** Source data lama tetap tersedia sebagai API v1, sementara domain temporal v2 dibangun berdampingan dengan resolver murni, provenance, dan status verifikasi. Satu pipeline deterministik memvalidasi, menghasilkan v1/v2, menyinkronkan artifact website, membangun Astro, dan menjalankan contract test. Root `/` menjadi satu-satunya implementasi database dan seluruh filter disimpan di URL.

**Tech Stack:** TypeScript ESM, AJV, Vitest, Astro 5, Tailwind CSS 3, vanilla client state, Playwright, axe-core.

## Global Constraints

- Kerjakan langsung pada branch `main` lokal sesuai instruksi Jevi.
- Jangan commit, push, deploy, mengubah DNS, atau melakukan aksi outward-facing tanpa izin eksplisit.
- Root `/` langsung membuka database tanpa landing page pemasaran.
- Tabel tidak boleh memakai scroll vertikal internal atau tinggi `calc(100vh - ...)`; halaman harus menggulir normal.
- Data konflik tidak boleh ditebak dan tidak boleh menghasilkan jawaban pasti.
- `verified_primary` wajib didukung sumber primer resmi beserta locator klaim.
- API v1 dan ID lama tetap kompatibel.
- Query tanggal menggunakan interval half-open `validFrom <= date < validToExclusive`.
- Semua output root dan website berasal dari satu release context dan harus sinkron byte-for-byte.
- Sumber sekunder hanya membantu penelusuran; angka final harus mengacu ke sumber primer.
- Canonical domain sementara adalah `https://tarif-pajak-id.pages.dev` sampai ada domain kustom.

---

### Task 1: Fondasi Test dan Pipeline Deterministik

**Files:**
- Create: `vitest.config.ts`
- Create: `src/paths.ts`
- Create: `src/core/release.ts`
- Create: `src/validation/load.ts`
- Create: `src/validation/report.ts`
- Create: `src/pipeline.ts`
- Create: `src/validate.ts`
- Create: `src/generate.ts`
- Create: `src/sync-website.ts`
- Create: `tests/unit/release.test.ts`
- Create: `tests/contracts/artifact-sync.test.ts`
- Create: `tests/contracts/release-metadata.test.ts`
- Modify: `package.json`
- Modify: `tsconfig.json`
- Modify: `.gitignore`
- Modify: `src/build.ts`
- Modify: `src/build-api.ts`

**Interfaces:**
- Produces `ReleaseContext { generatedAt, sourceDateEpoch, sourceHash, gitCommit, version }`.
- Produces `getProjectPaths()` with absolute `root`, `data`, `rootPublic`, `websitePublic`, `websiteDist`, and staging paths.
- Produces one command `pnpm build` for clean → validate → generate → sync → Astro → contracts.

- [ ] Write failing tests proving a fixed `SOURCE_DATE_EPOCH` yields one stable timestamp/hash and proving synchronized root/website artifacts are byte-identical.
- [ ] Run `pnpm vitest run tests/unit/release.test.ts tests/contracts/artifact-sync.test.ts`; expect failure because release and pipeline modules do not exist.
- [ ] Implement platform-safe paths using `fileURLToPath(import.meta.url)`, a single release context, sorted input hashing, staging output, generated-file manifest, and explicit sync.
- [ ] Replace missing/broken scripts with `clean`, `validate`, `test`, `test:contracts`, `generate`, `sync`, `build:site`, `build`, and `check`.
- [ ] Convert `build.ts` and `build-api.ts` into thin wrappers over the shared generator so there are not two build implementations.
- [ ] Fix OpenAPI path placement and derive years/statistics instead of hard-coding 1984–2026.
- [ ] Run fixed-epoch build twice and compare manifest hashes; expect identical output maps.
- [ ] Run `pnpm test && pnpm build`; expect all pipeline and existing Astro build checks to pass.

### Task 2: Model Temporal, Provenance, dan Semantic Validator

**Files:**
- Create: `src/core/types.ts`
- Create: `src/core/date.ts`
- Create: `src/core/conditions.ts`
- Create: `src/core/rate.ts`
- Create: `src/validation/schema.ts`
- Create: `src/validation/semantic.ts`
- Create: `data/schema/v2/source.schema.json`
- Create: `data/schema/v2/rule.schema.json`
- Create: `data/schema/v2/concept.schema.json`
- Create: `data/v2/categories.json`
- Create: `data/v2/concepts.json`
- Create: `data/v2/sources.json`
- Create: `data/v2/conflicts.json`
- Create: `tests/unit/date.test.ts`
- Create: `tests/unit/conditions.test.ts`
- Create: `tests/unit/rate.test.ts`
- Create: `tests/unit/semantic-validation.test.ts`

**Interfaces:**
- Produces `TaxRule`, `Rate`, `ConditionExpression`, `VerificationStatus`, `EvidenceRef`, and `ValidationReport` exactly as defined in the design spec.
- Produces `containsDate`, `overlaps`, `yearSegments`, `evaluateCondition`, `formatRate`, and `calculateProgressive`.

- [ ] Write failing boundary tests for half-open dates, condition tri-state evaluation, all rate variants, progressive bracket edges, duplicate IDs, missing foreign keys, cycles, overlaps, and invalid primary verification.
- [ ] Run focused Vitest files; expect module-not-found failures.
- [ ] Implement discriminated rate union, condition AST, provenance types, JSON schemas, and deterministic semantic issue sorting.
- [ ] Ensure `verified_primary` fails validation without official source, regulation ID, locator, and evidence coverage for rate/interval/condition.
- [ ] Ensure declared `source_conflict` is publishable but undeclared conflicting claims block build.
- [ ] Run focused tests and `pnpm validate`; expect green.

### Task 3: Resolver Tanggal/Tahun dan API v2

**Files:**
- Create: `src/core/resolver.ts`
- Create: `src/core/search.ts`
- Create: `src/compat/v1.ts`
- Create: `src/generators/v1.ts`
- Create: `src/generators/v2.ts`
- Create: `src/generators/search.ts`
- Create: `src/generators/openapi.ts`
- Create: `tests/unit/resolver.test.ts`
- Create: `tests/unit/search.test.ts`
- Create: `tests/unit/v1-compat.test.ts`
- Create: `tests/contracts/v1-api.test.ts`
- Create: `tests/contracts/v2-api.test.ts`
- Create: `tests/contracts/openapi.test.ts`

**Interfaces:**
- `resolveAtDate(rules, request): ResolveResult`.
- `resolveForYear(rules, year, filters): YearResolveResult`.
- Determination values: `tepat`, `bersyarat`, `rentang`, `fakta_kurang`, `konflik_sumber`.
- API v2 envelope contains release metadata and typed data.

- [ ] Write failing resolver tests for exact match, missing facts, special-over-general precedence, transition year, gap, range, unverified rule, and source conflict.
- [ ] Write failing v1 contract fixtures capturing all current entry IDs and documented paths.
- [ ] Implement pure resolver without implicit current date; filter by interval, facts, priority, and typed relations.
- [ ] Ensure gap returns warning rather than synthetic 0%, and conflict/unverified data never resolves as `tepat`.
- [ ] Generate v2 indexes, rules, concepts, BPPU, year segments, selected exact-date fixtures, search index, and valid OpenAPI.
- [ ] Implement v1 compatibility projection, including conversion from exclusive end date to inclusive legacy `effectiveTo`.
- [ ] Run unit and contract suites; expect all v1 path/ID snapshots preserved and v2 documents valid.

### Task 4: Audit dan Migrasi PPh 21/TER

**Files:**
- Create: `data/v2/rules/pph-21.json`
- Create: `tests/fixtures/pph-21-boundaries.json`
- Modify: `data/v2/sources.json`
- Modify: `data/v2/conflicts.json`
- Modify: `website/src/pages/ter-pph-21.astro`
- Test: `tests/unit/pph-21-fixtures.test.ts`

**Interfaces:**
- TER calculator consumes canonical `Rate` and fixture-tested calculation utilities.

- [ ] Gather PP 58/2023 and official attachments/guidance from primary government sources; record URLs and exact appendix/article locators.
- [ ] Write failing fixtures for `2023-12-31`, `2024-01-01`, every TER bracket edge, regular month, final tax period, and missing PTKP category.
- [ ] Model TER A/B/C, annual reconciliation, and PTKP chronology with exact conditions and intervals.
- [ ] Reclassify norms as `information_factor`; downgrade or conflict-mark unsupported natura/SHU/fixed-rate claims.
- [ ] Replace TER page hard-coded arithmetic with canonical calculation functions.
- [ ] Run fixtures, semantic validation, calculator parity, and full build.

### Task 5: Audit dan Migrasi PPh 23 serta BPPU

**Files:**
- Create: `data/v2/rules/pph-23.json`
- Create: `data/v2/bppu/versions.json`
- Create: `data/v2/bppu/codes.json`
- Create: `tests/fixtures/pph-23-boundaries.json`
- Create: `tests/fixtures/bppu-boundaries.json`
- Modify: `data/v2/sources.json`
- Modify: `data/v2/conflicts.json`
- Test: `tests/unit/pph-23-fixtures.test.ts`
- Test: `tests/unit/bppu-fixtures.test.ts`

**Interfaces:**
- Rules reference stable BPPU IDs; BPPU has its own validity interval and provenance.

- [ ] Gather UU PPh/UU HPP consolidated primary text, PMK 141/2015, and official BPPU/KOP attachments.
- [ ] Write failing fixtures for jasa konsultan in 2020, jasa manajemen, technical service, taxpayer-ID condition, movable asset rental, land/building rental, and selected BPPU codes.
- [ ] Split service concepts and model recipient/identifier/service-class facts.
- [ ] Remove substantive reliance on BPPU as rate authority; model it as versioned reporting metadata.
- [ ] Resolve only evidence-supported conflicts; retain unresolved CSV/embedded discrepancies as `source_conflict`.
- [ ] Verify the key goal scenario: query “jasa konsultan, 2020” returns the applicable candidate, interval, legal source, and any required taxpayer facts.
- [ ] Run fixtures, validator, resolver, and full build.

### Task 6: Audit dan Migrasi PPN 2022–2025

**Files:**
- Create: `data/v2/rules/ppn.json`
- Create: `tests/fixtures/ppn-boundaries.json`
- Modify: `data/v2/sources.json`
- Modify: `data/v2/conflicts.json`
- Modify: `src/generators/v2.ts`
- Test: `tests/unit/ppn-fixtures.test.ts`
- Test: `tests/contracts/calculator-parity.test.ts`

**Interfaces:**
- PPN formula distinguishes nominal percentage from DPP factor/effective burden.

- [ ] Gather UU HPP, PMK 131/2024, and applicable official transitional instruments/guidance.
- [ ] Write failing fixtures at `2022-03-31`, `2022-04-01`, `2024-12-31`, `2025-01-01`, plus non-luxury, luxury, import, export, and missing-classification cases.
- [ ] Model 10%, 11%, nominal 12%, DPP nilai lain factor, effective burden, and exclusions as separate typed concepts/conditions.
- [ ] Remove hard-coded calculator facts and project calculator data from canonical rules.
- [ ] Ensure year 2025 can return conditional candidates rather than one misleading universal number.
- [ ] Run fixtures, calculator parity, validator, and build.

### Task 7: Audit PPh Badan, PPh Final, dan UMKM

**Files:**
- Create: `data/v2/rules/pph-badan.json`
- Create: `data/v2/rules/pph-final-umkm.json`
- Create: `tests/fixtures/pph-badan-boundaries.json`
- Create: `tests/fixtures/pph-final-umkm-boundaries.json`
- Modify: `data/v2/sources.json`
- Modify: `data/v2/conflicts.json`
- Test: `tests/unit/pph-badan-fixtures.test.ts`
- Test: `tests/unit/pph-final-umkm-fixtures.test.ts`

**Interfaces:**
- Facilities are conditions/formulas, not unconditional standalone rates.

- [ ] Gather primary instruments for corporate rate chronology, Pasal 31E, listed-company relief, PP 46/2013, PP 23/2018, PP 55/2022, and priority final-tax objects.
- [ ] Write failing fixtures for every corporate transition, turnover thresholds, Article 31E allocation, listed-company qualification, UMKM entity/time limits, OP turnover threshold, and final-tax transitions.
- [ ] Model conditional facilities and formulas without flattening them into universal rates.
- [ ] Separate PPh 15 concepts from PPh 4(2), and downgrade IKN or sector records lacking full evidence.
- [ ] Preserve disputed claims visibly with verification/conflict state.
- [ ] Run fixtures, validator, resolver, and build.

### Task 8: Redesign Root menjadi Database Full-Width

**Files:**
- Create: `website/src/components/database/DatabaseToolbar.astro`
- Create: `website/src/components/database/DatabaseTable.astro`
- Create: `website/src/components/database/DatabaseCards.astro`
- Create: `website/src/components/database/TimelineCell.astro`
- Create: `website/src/components/database/VerificationBadge.astro`
- Create: `website/src/components/database/DeterminationNotice.astro`
- Create: `website/src/lib/database-state.ts`
- Create: `website/src/lib/dataset.ts`
- Modify: `website/src/pages/index.astro`
- Replace: `website/src/pages/database.astro`
- Modify: `website/src/layouts/Base.astro`
- Modify: `website/src/styles/global.css`
- Modify: `website/tailwind.config.mjs`
- Test: `tests/unit/database-state.test.ts`

**Interfaces:**
- URL state fields: `q`, `date`, `category`, `status`, `verification`, `sort`.
- `parseDatabaseState`, `serializeDatabaseState`, and `filterDatabaseRows` are pure functions.

- [ ] Write failing URL-state tests for parse/serialize roundtrip, defaults, invalid dates, multiple filters, year/date mode, and deterministic sort.
- [ ] Build shared toolbar/table/mobile components and remove duplicated inline database code.
- [ ] Apply approved paper/ink/teal/warning/conflict tokens and preserve tabular mono typography.
- [ ] Remove all vertical table max-height/overflow rules; keep only page scrolling and necessary horizontal table overflow.
- [ ] Make global header, toolbar, and table header cooperate with sticky offsets.
- [ ] Add visible verification coverage, release date/hash, conflict count, and disclaimer.
- [ ] Implement URL initialization, debounce, history updates, `popstate`, clear filters, and live result count.
- [ ] Make `/database` a canonical fallback redirect preserving search/hash, without duplicating the table.
- [ ] Run state tests, Astro build, and static markup checks.

### Task 9: Detail Tarif, Timeline, dan Aksesibilitas

**Files:**
- Create: `website/src/components/entry/EntryDetail.astro`
- Create: `website/src/components/entry/SourceList.astro`
- Create: `website/src/components/entry/RuleTimeline.astro`
- Create: `website/src/pages/tarif/[id].astro`
- Modify: `website/src/pages/kategori/[slug].astro`
- Modify: `website/src/pages/kode-objek-pajak.astro`
- Modify: `website/src/layouts/Base.astro`
- Test: `tests/contracts/detail-routes.test.ts`

**Interfaces:**
- Every visible row/card maps to a stable `/tarif/{conceptId-or-ruleId}?date=...` URL.

- [ ] Write failing contract test proving every list row has a generated detail route and API document.
- [ ] Build detail pages showing rate semantics, facts, interval, status at date, sources/locators, timeline, BPPU, examples, missing facts, and conflicts.
- [ ] Replace category-only row links with precise detail links while keeping category navigation.
- [ ] Add visible labels, `aria-pressed`, live result status, table captions/scopes, mobile menu state, theme state, keyboard focus, external-link security, and reduced-motion styles.
- [ ] Run detail contracts and Astro build.

### Task 10: SEO, API Docs, dan Output AI/LLM

**Files:**
- Create: `src/config.ts`
- Create: `src/generators/llms.ts`
- Create: `src/generators/metadata.ts`
- Create: `website/src/lib/seo.ts`
- Create: `website/public/robots.txt`
- Modify: `website/astro.config.mjs`
- Modify: `website/package.json`
- Modify: `website/pnpm-lock.yaml`
- Modify: `website/src/layouts/Base.astro`
- Modify: `website/src/pages/api-docs.astro`
- Modify: `website/src/pages/404.astro`
- Modify: `README.md`
- Test: `tests/contracts/seo-output.test.ts`
- Test: `tests/contracts/llm-output.test.ts`

**Interfaces:**
- One canonical origin constant.
- Root emits Dataset JSON-LD; detail routes emit machine-readable entry metadata.

- [ ] Write failing contracts for canonical URL, sitemap, robots, JSON-LD, social metadata, LLM counts, and conflict-safe wording.
- [ ] Add Astro sitemap, canonical/OG/Twitter metadata, machine-readable alternates, Dataset JSON-LD, and `noindex` 404.
- [ ] Generate `llms.txt` and `llms-full.txt` from v2 rules, including determination semantics and explicit restrictions on unverified/conflicting data.
- [ ] Rewrite API docs for v1 compatibility, v2 temporal endpoints, static-host limitations, provenance, and examples.
- [ ] Update README commands, architecture, data status, and disclaimer.
- [ ] Run SEO/LLM contracts and full build.

### Task 11: Browser QA dan Release Gate Lokal

**Files:**
- Create: `website/playwright.config.ts`
- Create: `website/tests/e2e/database.spec.ts`
- Create: `website/tests/e2e/detail.spec.ts`
- Create: `website/tests/e2e/accessibility.spec.ts`
- Create: `website/tests/e2e/mobile.spec.ts`
- Modify: `website/package.json`
- Modify: `website/pnpm-lock.yaml`

**Interfaces:**
- E2E tests run against local preview only; no deployment is involved.

- [ ] Write browser tests for direct database root, full page scroll, no nested vertical scroller, URL filters, reload/back/forward, transition warning, empty state, details, keyboard, theme, mobile cards, widths 320/375/768/desktop, reduced motion, and `/database` preservation.
- [ ] Add axe-core checks and assert no serious/critical accessibility violations.
- [ ] Run `pnpm check`, Playwright Chromium, `git diff --check`, and source/conflict coverage reports.
- [ ] Manually inspect screenshots for desktop and mobile; fix any overflow, clipped content, weak contrast, or sticky collisions.
- [ ] Confirm no `verified_primary` claim lacks primary evidence and no open conflict produces `tepat`.
- [ ] Confirm no commit, push, deployment, or DNS action occurred.
