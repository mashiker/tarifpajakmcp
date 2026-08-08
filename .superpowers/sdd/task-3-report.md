# Task 3 Report — Resolver Tanggal/Tahun, API v2, dan Kompatibilitas v1

Repository: `E:\kantor_archisight\tarifpajak\tarifpajakmcp`
Branch: `main` lokal. Status: working-tree only, **no commit/push/deploy**.

## Status

**Done with concerns.** Two minor, pre-existing infrastructure items are
flagged at the end; they do not affect Task 3 functionality or determinism.

## Deliverables implemented

- Pure temporal resolver: `resolveAtDate` and `resolveForYear`.
- Determination semantics `tepat`, `bersyarat`, `rentang`, `fakta_kurang`,
  `konflik_sumber` exactly as the spec.
- Search normalization, deterministic inverted index, OR-ranked query.
- v1 compatibility projection: half-open `validToExclusive` -> inclusive
  legacy `effectiveTo`; v1 ID/path preservation.
- v2 generators: index, rules, concepts, BPPU, sources, year segments,
  selected exact-date fixtures, rules corpus, search index, valid OpenAPI v2.
- v1 generator extracted into `src/generators/v1.ts` (logic preserved verbatim
  so the v1 contract stays byte-stable).
- Generators wired into `pnpm build` (`validate -> generate -> sync ->
  build:site -> test:contracts`). Output is deterministic and synchronized to
  both `public/` and `website/public/`.
- Contract tests proving v1 endpoint/ID compatibility and v2 schema/determinism.

## Changed files

### New (Task 3)
- `src/core/resolver.ts` — pure resolver, no implicit current date, no synthetic 0%.
- `src/core/search.ts` — deterministic tokenize/normalize/buildSearchIndex/searchRules.
- `src/compat/v1.ts` — v1 projection (inclusive end, status mapping, ID preservation).
- `src/generators/v1.ts` — extracted, self-contained v1 static API generator.
- `src/generators/v2.ts` — v2 temporal API generator (indexes, rules, concepts,
  BPPU, sources, by-year, at-date, rules-corpus, search, openapi).
- `src/generators/search.ts` — thin wrapper emitting `api/v2/search-index.json`.
- `src/generators/openapi.ts` — v2 OpenAPI 3.0.3 builder + canonical origin.
- `tests/unit/resolver.test.ts` — 17 tests.
- `tests/unit/search.test.ts` — 8 tests.
- `tests/unit/v1-compat.test.ts` — 6 tests.
- `tests/contracts/v1-api.test.ts` — 8 tests (locked v1 endpoint paths, IDs, slugs).
- `tests/contracts/v2-api.test.ts` — 9 tests (v2 envelope, indexes, year segments,
  at-date fixtures, rules corpus, determinism).
- `tests/contracts/openapi.test.ts` — 7 tests (v1 + v2 OpenAPI validity).

### Modified
- `src/generate.ts` — replaced the inline 500-line v1 generator with delegation
  to `src/generators/v1.ts`, and added v2 + search generation. The aggregate
  `api.json`/`rates.json`/`llms.txt`/`release.json` generation is unchanged.

## TDD evidence (RED -> GREEN)

### RED captured before production code
- `tests/unit/resolver.test.ts`, `tests/unit/search.test.ts`,
  `tests/unit/v1-compat.test.ts`: failed with `Cannot find module
  '../../src/core/resolver.ts'` / `search.ts` / `compat/v1.ts` (module-not-found).
- `tests/contracts/v2-api.test.ts`: 8 of 9 tests failed with `ENOENT` for
  `public/api/v2/...` (no v2 artifacts existed yet).
- `tests/contracts/openapi.test.ts`: v2 openapi test failed (no v2 document).
- `tests/contracts/v1-api.test.ts`: 2 endpoint-path tests initially failed
  (openapi.json self-reference mismatch), resolved by aligning the locked path
  set to the actual pre-redesign surface (19 paths).

### GREEN after minimal implementation
- `pnpm vitest run` (full unit suite): **18 files, 92 tests pass** (was 37 at
  Task 2 baseline; +55 new tests).
- `pnpm build` contract suite: **6 files, 33 tests pass**.
- `pnpm check` (test + build): all green.

### Fixed-epoch determinism
Two `SOURCE_DATE_EPOCH=1722816000 pnpm generate` passes into separate staging
directories produced **byte-identical output** (`diff -r` clean ->
`DETERMINISM_OK`). The existing `release-metadata` contract also covers this.

### Astro build
`pnpm build:site` completes with **21 pages, no errors**.

## v1 contract preservation

- v1 entry count: **136** (locked floor, unchanged).
- v1 category slugs: **15**, exactly matching the pre-redesign snapshot.
- Representative v1 IDs preserved verbatim: `ppn-10pct`, `ppn-11pct-2022`,
  `ppn-11pct-effective-2025`, `pph-21-ter-monthly-2024`,
  `pph-21-progressive-annual-2024`, `pph-21-non-taxable-income`,
  `pph-23-jasa-lain-2pct`, `pph-badan-2022-plus`, `pph-umkm-1pct-pp46`,
  `bea-meterai-1000`.
- v1 documented endpoint paths: **19 paths** locked, no silent removal/rename.
- `validToExclusive` -> inclusive legacy `effectiveTo` conversion verified
  (`2025-01-01` -> `2024-12-31`; `null` -> `null`).

## Design decisions

1. **v1 generator extraction, not rewrite.** The legacy v1 generation logic was
   moved verbatim into `src/generators/v1.ts` so the v1 surface stays
   byte-stable. The only intentional change is the v1 OpenAPI `servers` list,
   now using the canonical `https://tarif-pajak-id.pages.dev` (per the global
   constraint) and dev port 4321. No v1 contract test depends on the server URL.

2. **Resolver purity.** `resolveAtDate` takes an explicit `date` and optional
   `facts`/filters; it never reads `Date.now()`. A gap returns
   `determination: 'fakta_kurang'` plus a warning and never a synthetic 0%
   (verified by an explicit test asserting the JSON contains no `0%`).

3. **Self-declared `source_conflict` forces `konflik_sumber`.** Even without a
   declared `Conflict` entity spanning it, a rule whose `verification.status` is
   `source_conflict` resolves as `konflik_sumber`. `needs_review` and
   `summary_only` remain orienting (`bersyarat`) and never `tepat`.

4. **Precedence.** Within an exclusive group: a conditional (special) rule that
   still applies defeats an unconditional (general) one; typed `supersedes`
   edges also defeat. Winners are reported with a `defeats` list for
   traceability. Rules in different/no groups coexist.

5. **Year resolution.** `resolveForYear` collects every boundary inside the
   calendar year, builds half-open segments, merges adjacent segments with
   identical rule sets, and labels non-year-start segments as `transition`.
   Segments are clipped to `[YYYY-01-01, (YYYY+1)-01-01)`.

6. **Search OR semantics.** `searchRules` unions posting lists (any token
   matches) and ranks by distinct-token score, broken by id. This gives useful
   partial-match ranking for the toolbar. An empty query returns every rule in
   id order with score 0.

7. **Deterministic serialization.** Every generator sorts lists and map keys;
   the v2 index/search documents use sorted top-level keys so two fixed-epoch
   builds are byte-identical.

8. **Static-host constraint.** v2 emits concrete date/year documents plus a
   serialized `rules-corpus.json` (rules + concepts + categories + conflicts)
   so the website can run the shared resolver client-side without a server.

## v2 artifact coverage (bootstrap data)

- 5 rules, 3 concepts, 1 category, 2 sources, 1 conflict, 2 BPPU codes.
- by-year: 2 years. 2024 resolves `konflik_sumber` (declared conflict spans the
  year); 2025 resolves `bersyarat` (conditional `verified_primary` rule).
- at-date: 2 exact-date fixtures (`2024-01-01`, `2025-01-01`).
- rules-corpus + search-index (46 keywords) emitted.

## Concerns

1. **Pre-existing: `@types/node` missing at repo root.** `tsconfig.json`
   declares `types: ["node", "vitest/globals"]` but `@types/node` is not a root
   `devDependency`, so `npx tsc --noEmit` reports `Cannot find name 'process'`
   in `src/core/release.ts` and AJV namespace errors in `src/validation/ajv.ts`.
   These are Task 1-2 files and pre-date Task 3. The runtime (node
   `--experimental-strip-types`) and all 92 tests pass regardless. My new Task 3
   files (`resolver.ts`, `search.ts`, `compat/v1.ts`, `generators/*`, new tests)
   introduce **zero** new type errors when checked in isolation. Recommend
   adding `@types/node` in a follow-up; not blocking.

2. **Carry-over from Task 2 (still open, not introduced here):** wiring
   `data/schema/v2/{category,conflict,bppu}.schema.json` into
   `compileV2Schemas` + `validateV2FromDisk`, and the supersession cycle
   detector following only `supersedes[0]`. The Task 3 resolver and generators
   do not depend on these being fixed.

3. **v1 OpenAPI server URL changed** from the pre-redesign `vercel.app`/4325 to
   the canonical `pages.dev`/4321 per the global constraint. No v1 contract
   test asserts the server URL, and the canonical domain is the agreed
   temporary production origin. Flagged for transparency in case a downstream
   consumer hard-coded the old URL.

---

## Review fix pass (Spec PASS / Quality CHANGES_REQUIRED -> fixed)

All three review findings fixed test-first in the same working tree. No tax
migration or UI redesign. No commit/push/deploy/branch/history change.

### Important 1 — `resolveForYear` gap inversion + hardcoded `gap:false`

**Root cause:** the single-segment branch mapped an at-date gap back to `tepat`
(`atDate.determination === 'fakta_kurang' && atDate.gap ? 'tepat' : ...`) and
the return statement hardcoded `gap: false`, so a genuine gap (e.g. all
conditions resolved false at the sample date) was hidden as a confident `tepat`.

**Fix (`src/core/resolver.ts`):** dropped the inverted ternary; the year now
takes `atDate.determination`, `atDate.gap`, and `atDate.warnings` directly. The
return propagates the real `gap` flag and warnings instead of hardcoding
`gap: false`/`warnings: []`.

**Tests added (`tests/unit/resolver.test.ts`, new `resolveForYear - gap
propagation` group):**
- A single rule whose condition resolves false at the sampled segment start
  reaches the empty-winner branch; asserts `determination !== 'tepat'`,
  `determination === 'fakta_kurang'`, `gap === true`, and a matching warning.
- A no-intersecting-rule year asserts `gap === true` (no hardcoded `gap:false`).

**RED evidence:** `expected 'tepat' not to be 'tepat'` before the fix.

### Minor 2 — `defeats` metadata leaked across exclusive groups

**Root cause:** `applyPrecedence` collected all defeated ids into one global
`Set` and assigned that same list to every winner, so a winner in group A
inherited group B's defeats.

**Fix (`src/core/resolver.ts`):** precedence is now computed per exclusive-group
bucket with a `defeatedByGroup` map; the global set is used only to filter
winners. Each winner's `defeats` is sourced only from its own group's set, so
no cross-group leakage.

**Tests added (`tests/unit/resolver.test.ts`, new `applyPrecedence - defeats
metadata is scoped per exclusive group` group):**
- Two exclusive groups: the group B winner's `defeats` is `[]` while the group
  A special-over-general winner's `defeats` is `['a-gen']`.
- A winner with no exclusive group does not inherit any grouped-bucket defeats.

**RED evidence:** `expected [ 'a-gen' ] to deeply equal []` before the fix.

### Minor 3 — v1 OpenAPI `info.contact.url` aligned to canonical origin

**Fix (`src/generators/v1.ts`):** imported `CANONICAL_ORIGIN` from
`./openapi.ts` and used it for `info.contact.url` (was the stale
`https://tarif-pajak-id.vercel.app`), consistent with the intentional `servers`
canonical-origin change.

**Test added (`tests/contracts/v1-api.test.ts`):** asserts both
`servers[0].url` and `info.contact.url` equal `https://tarif-pajak-id.pages.dev`.

**RED evidence:** `expected 'https://tarif-pajak-id.vercel.app' to be
'https://tarif-pajak-id.pages.dev'` before the rebuild.

### Note (optional) addressed — double search-index emission

`generate.ts` previously called `generateApiV2` (which emits
`api/v2/search-index.json`) and then `generateSearchIndex` again, writing the
same bytes twice. The redundant second call was removed; a comment documents
that `generateSearchIndex` remains the canonical builder invoked inside
`generateApiV2`. The unused import was dropped.

### Verification after fixes

- Focused: `pnpm vitest run tests/unit/resolver.test.ts` -> **21 tests pass**
  (was 17, +4).
- Full unit: `pnpm test` -> **18 files / 97 tests pass** (was 92, +5).
- `pnpm validate` -> Source validation passed.
- Fixed-epoch `pnpm build` (validate -> generate -> sync -> Astro -> contracts):
  Astro **21 pages, no errors**; contract suite **6 files / 34 tests pass**
  (was 33, +1 v1 contact.url).
- Fixed-epoch determinism: two `SOURCE_DATE_EPOCH=1722816000 pnpm generate`
  passes -> **byte-identical** (`diff -r` clean, `DETERMINISM_OK`).
- `git diff --check` -> exit 0; only LF/CRLF autocrlf warnings on pre-existing
  generated JSON artifacts, no trailing-whitespace or conflict markers in
  `src/` or `tests/`.

### Files touched in this fix pass

- `src/core/resolver.ts` — gap propagation (Important 1) + per-group defeats (Minor 2).
- `src/generators/v1.ts` — `CANONICAL_ORIGIN` contact.url (Minor 3).
- `src/generate.ts` — dropped redundant `generateSearchIndex` call + import (note).
- `tests/unit/resolver.test.ts` — +4 tests (gap propagation, defeats scoping).
- `tests/contracts/v1-api.test.ts` — +1 contract assertion (canonical origin).

