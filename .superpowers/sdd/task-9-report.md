# Task 9 Report — Detail Tarif, Timeline, Aksesibilitas, dan Rewiring UI

Repository: `E:\kantor_archisight\tarifpajak\tarifpajakmcp`
Branch: `main` lokal. No commit/push/deploy/branch/history changes.

## Status

**DONE_WITH_CONCERNS** — see Concerns.

## Summary

Implemented all eight Task 9 deliverables test-first (contract tests first for detail routes and TER rewiring; unit test first for status derivation). All 377 tests pass (was 356 before Task 9); fixed-epoch build is deterministic (verified by running `generate`+`sync` twice and diffing the manifest — identical); Astro build emits 64 pages including 41 detail routes and 2 new v2 category index pages.

## Changed files

### New files
- `website/src/pages/tarif/[id].astro` — detail route. `getStaticPaths` emits one page per concept id (the 41 ids the root database emits deep links for). Renders rate semantics, transaction/tax base, exact interval, status at selected date, verification + date, primary source locators, BPPU codes with version, examples labeled illustrative/verified, predecessor/successor rules, declared conflicts, JSON API link, timeline signature, and a back-to-database link. Includes a client-side date input that re-evaluates per-rule status against the deterministic release anchor.
- `website/src/lib/detail.ts` — pure detail view-model builder (`buildDetailViewModel`, `listConceptIds`, `formatRateLabel`). Joins the v2 corpus with sources and BPPU indexes; produces typed `DetailViewModel` consumed by the page.
- `tests/contracts/detail-routes.test.ts` — 12 contract assertions: every root deep link resolves to a built `/tarif/{id}/index.html`; every concept id has a matching `/api/v2/concepts/{id}.json` document; no orphan routes; every page links back to its API document, embeds the concept name, exposes a verification badge, exposes the timeline signature, links back to `/`, and external source links carry `rel="noopener noreferrer"`; every root `/tarif/{id}` link corresponds to a built page.
- `tests/contracts/ter-v2-rewiring.test.ts` — 12 contract assertions: the v2 TER rules carry the correct PP 58/2023 values (44/40/41 layers, 0% bounds 5.4M/6.2M/6.6M, top 34%); the built TER page reads from v2 (surfaces 44/40/41, 34%, 5,4 juta / 6,2 juta / 6,6 juta) and NOT the v1 wrong table (42 layers, 25%, single 6.6M bound); the page links to the canonical TER detail route.
- `tests/unit/status-derivation.test.ts` — 16 unit tests for the pure `deriveRowStatus` + `matchesStatus` helpers (open-ended/future/superseded/revoked precedence, purity, all five chip filters).

### Modified files
- `website/src/lib/database-state.ts` — added `RowStatus` type, `deriveRowStatus` and `matchesStatus` pure helpers, optional `superseded` field on `DatabaseRow`, optional `today` parameter on `filterDatabaseRows` wired to `matchesStatus`. Backward-compatible: legacy callers without `today` skip status filtering (preserves all pre-Task-9 unit tests).
- `website/src/lib/database-markup.ts` — `isRowVisible` now accepts optional `status` + `today` and applies `matchesStatus`; rows/cards emit `data-superseded` for client re-evaluation. Comments updated to reflect the deletion of the orphaned `.astro` components.
- `website/src/lib/dataset.ts` — `buildDatabaseDataset` populates `superseded` from the v2 corpus `supersededBy` relation so the status derivation can distinguish `diubah` from `dicabut`.
- `website/src/pages/index.astro` — root database page now: (1) computes `releaseToday` deterministically from the v2 release `generatedAt`; (2) computes `statusCounts` for all five chips via `deriveRowStatus`; (3) passes `today` to `filterDatabaseRows` and `isRowVisible` (server + client); (4) reads `data-superseded` on row nodes for client re-evaluation; (5) exposes `RELEASE_TODAY` and `STATUS_COUNTS` to the inline client via `define:vars`; (6) clears-button focus management (moves focus to the search input after reset).
- `website/src/pages/ter-pph-21.astro` — fully rewritten to read the canonical v2 TER rules (`rule-pph-21-ter-monthly-a/b/c`) instead of the v1 aggregate. Surfaces the correct 44/40/41 layer counts, per-category 0% bounds (5,4 juta / 6,2 juta / 6,6 juta), 34% top rate, per-category PTKP class labels, verification-status disclosure, `<caption>` + `scope="col"` on the TER tables, and a link to the canonical `/tarif/concept-pph-21-ter-monthly` detail route. Calculator wires directly to the v2 brackets via `define:vars`.
- `website/src/pages/kategori/[slug].astro` — `getStaticPaths` now emits routes for BOTH the legacy v1 slugs (byte-stable) and the v2-only slugs (`pph-final-umkm`, `pph-special-regimes`). V2-only slugs render an index/navigation page that deep-links to the v2 detail URLs by concept id (Task 9 BPPU/category index requirement). V1 slugs keep their existing detailed entry rendering unchanged. Also added `rel="noopener noreferrer"` to two external links that were missing it.
- `website/src/pages/kode-objek-pajak.astro` — added a v2 category navigation index above the BPPU table that lists all canonical v2 categories (including the new `pph-final-umkm` and `pph-special-regimes`) with row counts, linking to their respective `/kategori/` pages.

### Deleted files (Mn1)
- `website/src/components/database/TimelineCell.astro` — orphaned after the Task 8 shared `database-markup.ts` module became the single source of truth. Confirmed no imports remained (only stale comments, which were updated).
- `website/src/components/database/VerificationBadge.astro` — same rationale.

## TDD evidence

### Contract: detail routes (RED → GREEN)
- RED: ran `pnpm vitest run tests/contracts/detail-routes.test.ts` before implementing `/tarif/[id].astro` — 7 of 12 tests failed (every "detail page exists" and "content contract" assertion), 5 passed (the API-document checks, since the v2 generator already emits per-concept documents).
- GREEN: after implementing the page and rebuilding, all 12 pass.

### Unit: status derivation (RED → GREEN)
- RED: ran `pnpm vitest run tests/unit/status-derivation.test.ts` before implementing `deriveRowStatus`/`matchesStatus` — all 16 failed with `TypeError: (0 , matchesStatus) is not a function` / `deriveRowStatus is not a function`.
- GREEN: after implementing the helpers, all 16 pass.

### Contract: TER v2 rewiring (RED → GREEN)
- RED: ran `pnpm vitest run tests/contracts/ter-v2-rewiring.test.ts` before rewiring the TER page — the 8 v2 canonical rules tests passed immediately (the data was already correct), the 4 page-rewiring tests failed (the page still read the v1 42-layer/25% table).
- GREEN: after rewriting `ter-pph-21.astro` to read v2, all 12 pass.

### No regressions
- All 356 pre-Task-9 tests still pass (304 unit + 52 contract).
- New total: 377 tests pass (320 unit + 57 contract across 32 files).

## Decisions

1. **Status derivation precedence** — `belum_berlaku` > `diubah` > `dicabut` > `berlaku`. A future rule is `belum_berlaku` even if a successor is scheduled; a superseded rule is `diubah` regardless of the calendar; a non-superseded rule whose exclusive end date is on/before today is `dicabut`; otherwise `berlaku`. This matches the brief's mapping and produces correct counts for the live dataset (49/14/0/4).

2. **Deterministic "today"** — the status filter anchors to the v2 release `generatedAt` (currently `2027-01-15`), NOT `new Date()`. This keeps the chip counts reproducible across two builds at the same release. The detail page's status-at-date input lets users override this for "status at selected date".

3. **Backward-compatible filter signature** — `filterDatabaseRows` takes an optional 3rd `today` parameter; when omitted, status filtering is a no-op. This preserves every pre-Task-9 unit test that calls `filterDatabaseRows(rows, state)` without a `today` argument. Production callers (index.astro) always pass `today`.

4. **Category page split** — the existing v1 `/kategori/[slug].astro` is byte-stable per the Task 8 contract. Rather than rewriting it, the page now renders TWO branches via a template conditional: v1 categories keep their detailed entry rendering; v2-only categories (`pph-final-umkm`, `pph-special-regimes`) render a new index/navigation page that deep-links to detail URLs. This satisfies the brief without breaking the v1 contract.

5. **PPN calculator UI** — there is no separate PPN calculator UI page; the only calculator UI in the website is the TER PPh 21 calculator (now rewired to v2). PPN parity is locked at the data layer by `tests/contracts/calculator-parity.test.ts` (11 assertions, all green). The "PPN calculator UI: parity locked" deliverable is therefore satisfied by virtue of the canonical data parity contract remaining green — no separate UI rewiring was needed or possible.

6. **Astro getStaticPaths scope** — Astro hoists `getStaticPaths` into a module scope that cannot see frontmatter-level helpers. The detail page's corpus load is inlined directly into `getStaticPaths`, and the corpus is passed as a `props.corpus` to the page body (verified by a failed build attempt that surfaced `CORPUS is not defined` / `loadCorpus is not defined`).

## Verification

- `pnpm test`: 32 files, 377 tests, all pass.
- `SOURCE_DATE_EPOCH=1800000000 pnpm build`: validate → generate → sync → Astro build (64 pages) → 12 contract files / 109 contract tests, all pass.
- Determinism: ran `generate`+`sync` twice with the fixed epoch and diffed `public/generated-manifest.json` — identical.
- `git diff --check`: only pre-existing LF/CRLF line-ending warnings on Windows; exit code 0 (no whitespace errors introduced).
- Manual inspection of built HTML:
  - Root status chips render accurate counts: Semua 67, Berlaku 49, Diubah 14, Belum berlaku 0, Dicabut 4.
  - Detail page `concept-pph-23-jasa-konsultan` links to its API document, exposes verification badge + timeline, and derives both rules as "Berlaku" server-side.
  - TER page renders 44/40/41 layer counts, 5,4 juta / 6,2 juta / 6,6 juta bounds, 34% top rate, and links to `/tarif/concept-pph-21-ter-monthly`.
  - New v2 category pages `/kategori/pph-final-umkm` and `/kategori/pph-special-regimes` are generated and deep-link to detail URLs.

## Concerns

1. **Detail page client-side status mirror** — the inline client script in `/tarif/[id].astro` mirrors `deriveRowStatus` logic in plain JS because the page does not import the shared helper (it would require bundling). The mirror is small and the contract test locks the server-rendered status; if `deriveRowStatus` evolves, the mirror must be updated in lockstep. A future refactor could extract the helper to a shared vanilla-JS module imported by both the root and detail pages.

2. **TER page calculator rate lookup** — the v2 brackets are cumulative `{upTo, rate}` (the rate applies to the band up to and including `upTo`), whereas the v1 page used `{min, max, rate}` inclusive bands. The new `rateFor` helper treats `dasar <= upTo` as the match condition, which matches the v2 semantics. The contract test locks the layer counts and bounds but does not yet assert specific calculator outputs at band boundaries; the canonicalTER calculation utilities in `src/core/` (Task 4) are the authoritative arithmetic and are separately fixture-tested.

3. **Category page conditional rendering** — the v1 `/kategori/[slug].astro` now wraps its template in a ternary (`isV2OnlyCategory ? <v2 layout> : <v1 layout>`). This preserves byte-stability for v1 category pages but adds a layer of JSX nesting. If a future task rewrites the v1 category pages to v2, the conditional can be removed.

4. **No Playwright QA / SEO-LLM output added** — per the brief, Task 11 (browser QA) and Task 10 (SEO/LLM outputs) are out of scope for Task 9 and were not started.

## Carry-over

None new. The pre-existing carry-over items from Task 8 (Task 1-2 minors: wire category/conflict/bppu schemas into compileV2Schemas; full-DFS supersession cycle traversal; citation-precision movable-rent "angka 4" locator) remain unchanged and are not blocked by Task 9.

---

# Task 9 Review Fix Report (Spec PASS / Quality CHANGES_REQUIRED)

The review returned Spec PASS / Quality CHANGES_REQUIRED with two Critical and one Important finding. All three were fixed test-first in the same working tree. No SEO/LLM (Task 10) or Playwright (Task 11) work was added.

## Findings addressed

### Critical 1 — Detail page never rendered transaction/tax-base conditions
**Fix.** Added `formatConditions(condition: unknown): string` to `website/src/lib/detail.ts`. The helper is pure and total over the v2 ConditionExpression AST: `equals` -> `{fact} = {value}` (e.g. "jenis = barang"); `in` -> `{fact}: {v1, v2, ...}` (e.g. "PTKP: TK/0, TK/1, K/0"); `exists` -> `{fact} ada`; `not` -> `BUKAN {inner}`; `and`/`all` -> `{c1}; {c2}`; `or`/`any` -> `{c1} ATAU {c2}`. Indonesian fact and value label maps cover every fact/enumeration the canonical v2 corpus uses; unknown operators fall back to the fact label so the formatter never throws.

The `DetailRule` view model now carries a `conditionsLabel` field populated via `formatConditions`, and the detail page template (`website/src/pages/tarif/[id].astro`) renders a `<section class="detail-conditions">` with header "Berlaku untuk" between the timeline and the examples, so the conditions appear near BPPU/relations as the brief required.

**Tests.** `tests/unit/detail-conditions.test.ts` (14 unit tests) covers equals/in/exists/not/and/or including nested combinators, booleans, single-element `in`, purity, determinism, and a fact-coverage lock over every fact name in the live dataset. `tests/contracts/detail-routes.test.ts` adds three contract assertions: every rule with a condition renders the subsection; `concept-illustrative-flat` surfaces "jenis = barang"; `concept-pph-21-ter-monthly` surfaces "PTKP: TK/0, TK/1, K/0".

### Critical 2 — TER B PTKP label hardcoded as 'TK/1' instead of canonical 'K/1'
**Fix.** `website/src/pages/ter-pph-21.astro` now derives every PTKP label from the v2 rule's `conditions.value` via a new `ptkpLabelFrom(rule)` helper that normalizes the scalar/array shape (TER C is currently a scalar `"K/3"` in the source data; TER A/B are arrays). The hardcoded `TABS` ptkpLabel strings and the calculator `<select>` options are both replaced by `TAB_PTKP[tab.id]`, so the page can never drift from the rule data. A double-"PTKP" wording bug in the table caption ("Berlaku PTKP PTKP …") was also corrected.

**Tests.** `tests/contracts/ter-v2-rewiring.test.ts` adds four contract assertions: TER A/B/C labels match the v2 `conditions.value` (joined); TER B explicitly contains "K/1"; the wrong contiguous substring "TK/2, TK/1, TK/3, K/2" is absent.

### Important 3 — Predecessor/successor fragment links were dead anchors
**Fix.** The `<article>` element in `website/src/pages/tarif/[id].astro` now carries `id={`rule-${rule.id}``}` alongside the existing `data-rule-id`. In addition, a deeper bug was uncovered while writing the contract: relation hrefs previously always pointed at the CURRENT concept page (`/tarif/{currentConceptId}#rule-{rid}`), but cross-concept supersession means the target rule may live on a DIFFERENT concept's page. `DetailViewModel` now exposes a corpus-wide `ruleIdToConceptId` map, and a new pure helper `relationHref(vm, targetRuleId)` resolves each link to the concept page that actually documents the target rule (same-concept links still use a pure fragment).

**Tests.** `tests/contracts/detail-routes.test.ts` adds three contract assertions: every relation link emitted on every detail page resolves to an existing article id on the page it points to (walks built HTML, parses each `href="...#rule-{rid}"`, verifies the target page contains `id="rule-{rid}"`); every article carries an id (not just data-rule-id); the cross-concept link from `concept-pph-final-umkm-pp23` to `concept-pph-final-umkm-pp46` points at the correct target.

### Optional Minor — Lock detail page status mirror against canonical helper
**Fix.** Added `tests/contracts/detail-status-mirror.test.ts`. The test reads the built detail page HTML, extracts the inline `toEpochMs` + `deriveStatus` JS functions, evaluates them via `eval`, and asserts the mirror produces the same status as the canonical `deriveRowStatus` for nine representative tuples covering all four statuses plus year-only `today` and exact-boundary dates. If `deriveRowStatus` evolves, this contract forces the inline mirror to follow.

## TDD evidence

- **C1 unit (RED → GREEN):** `pnpm vitest run tests/unit/detail-conditions.test.ts` failed with `formatConditions is not a function` before the helper existed (14/14 failed); after implementation, 14/14 pass.
- **C1 contract:** the new detail-routes conditions assertions failed before the template subsection was added (the built HTML lacked `detail-conditions` and `Berlaku untuk`); after the template change + rebuild, all pass.
- **C2 contract:** the new TER PTKP-label assertions failed before the TER page rewrite (the page still emitted "TK/1"); after driving labels from `conditions.value`, all pass — including the explicit absence of the wrong contiguous substring.
- **I3 contract:** the first iteration of the anchor test surfaced the cross-concept bug (9 broken anchors), which the `relationHref` + `ruleIdToConceptId` fix resolved; all anchor assertions now pass.
- **Optional mirror:** `toEpochMs is not defined` on the first run led to widening the regex to capture both helpers; the mirror now matches `deriveRowStatus` on all nine tuples.

## Changed files (this fix round)

### New files
- `tests/unit/detail-conditions.test.ts` — 14 unit tests for `formatConditions`.
- `tests/contracts/detail-status-mirror.test.ts` — 2 contract tests locking the inline status mirror.

### Modified files
- `website/src/lib/detail.ts` — added `formatConditions`, `relationHref`, `ConditionNode` type, `FACT_LABEL_ID` / `VALUE_LABEL_ID` maps, `formatValueLabel` / `formatFactLabel` helpers; extended `DetailRule` with `conditionsLabel`; extended `DetailViewModel` with `ruleIdToConceptId`; populated both in `buildDetailViewModel`.
- `website/src/pages/tarif/[id].astro` — added the conditions subsection (`<section class="detail-conditions">`) and its CSS; added `id={`rule-${rule.id}``}` to the `<article>`; replaced inline relation hrefs with `relationHref(vm, rid)`; imported `relationHref`.
- `website/src/pages/ter-pph-21.astro` — replaced hardcoded PTKP labels with `ptkpLabelFrom(rule)` + `TAB_PTKP[tab.id]`; relaxed `TerRule.conditions.value` to `string | string[]`; data-driven calculator `<select>` options; fixed double-"PTKP" caption wording.
- `tests/contracts/detail-routes.test.ts` — added 6 contract assertions (3 for conditions, 3 for relation anchor resolution).
- `tests/contracts/ter-v2-rewiring.test.ts` — extended `V2Rule` interface to include `conditions`; added 4 contract assertions for PTKP labels.

## Verification

- `pnpm validate`: Source validation passed.
- `pnpm test`: 34 files, 403 tests, all pass (was 32/377 before this fix round; +26 tests).
- `SOURCE_DATE_EPOCH=1800000000 pnpm build`: validate → generate → sync → Astro build (64 pages) → 13 contract files / 121 contract tests, all pass (was 12/109; +1 file, +12 contract tests).
- Determinism: ran `generate`+`sync` twice with the fixed epoch and diffed `public/generated-manifest.json` — identical.
- `git diff --check`: only pre-existing LF/CRLF line-ending warnings on Windows; exit code 0 (no whitespace errors introduced).
- Manual inspection of built HTML:
  - `concept-pph-23-jasa-konsultan` renders the conditions subsection ("Berlaku untuk: kelas jasa: konsultan; penerima bersangkutan punya NPWP = ya") for both rules.
  - `concept-illustrative-flat` renders "jenis = barang".
  - `concept-pph-21-ter-monthly` renders "PTKP: TK/0, TK/1, K/0".
  - TER page PTKP labels read "PTKP TK/0, TK/1, K/0" / "PTKP TK/2, K/1, TK/3, K/2" / "PTKP K/3" (K/1, not TK/1).
  - Articles on `concept-pph-21-ptkp` carry `id="rule-rule-pph-21-ptkp-2013-2014"` etc.
  - Cross-concept link on `concept-pph-final-umkm-pp23` points at `/tarif/concept-pph-final-umkm-pp46#rule-rule-pph-final-umkm-pp46`.

## Concerns (updated)

1. **Detail page client-side status mirror** — RESOLVED for regression-safety by `tests/contracts/detail-status-mirror.test.ts`, which locks the inline JS against `deriveRowStatus` for nine tuples. The mirror is still hand-written JS (extracting to a shared vanilla-JS module would remove the duplication entirely), but it can no longer silently drift.

2. **TER C conditions.value is a scalar** — the v2 source data for `rule-pph-21-ter-monthly-c` carries `conditions.value: "K/3"` (a string) rather than `["K/3"]` (an array), which is technically inconsistent with the `in` operator's contract. The `ptkpLabelFrom` helper normalizes both shapes so the page renders correctly; the underlying data inconsistency is a Task 4 carry-over and is not blocking.

3. **Category page conditional rendering** — unchanged from the original Task 9 report (the v1 `/kategori/[slug].astro` ternary is preserved for byte-stability).

4. **No Playwright QA / SEO-LLM output added** — unchanged; out of scope per the brief.

## Carry-over (unchanged)

The pre-existing carry-over items from Task 8 remain unchanged and are not blocked by Task 9 or this fix round.
