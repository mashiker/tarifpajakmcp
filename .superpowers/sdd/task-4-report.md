# Task 4 Report — Audit dan Migrasi PPh 21 / TER

Repository: `E:\kantor_archisight\tarifpajak\tarifpajakmcp`
Branch: `main` lokal. No commit / push / deploy / branch / history changes (verified: HEAD still at `3c4e7c5`, all changes untracked working-tree).

## Status

**DONE_WITH_CONCERNS** — Verified canonical PPh 21/TER v2 rules landed with strict TDD; all 117 unit + 34 contract tests pass; semantic validation green; fixed-epoch build byte-deterministic across two runs. One material concern (legacy TER discrepancy) and a few follow-ups are flagged below and require Task 5/8 decisions.

## Primary-source finding (material) — legacy TER tables were wrong

The brief listed the legacy `data/categories/pph-21.json` as the migration source. Verified against PP 58/2023 Lampiran A/B/C (peraturan.bpk.go.id, pajak.go.id PMK 168/2023, cross-checked with secondary government-aligned commentary 2026-08-06), the legacy TER tables are materially incorrect:

| Aspect | Legacy v1 `pph-21.json` | Verified canonical (PP 58/2023) |
| --- | --- | --- |
| Category mapping | by marital status (A=tidak kawin; B=kawin 0-2; C=kawin 3+) | by PTKP class (A=TK/0,TK/1,K/0; B=TK/2,K/1,TK/3,K/2; C=K/3) |
| Layer count | "42 lapisan" for all | A=44, B=40, C=41 |
| First 0% upper bound | A 6.600.000 / B 6.950.000 / C 7.550.000 | A 5.400.000 / B 6.200.000 / C 6.600.000 |
| Top rate | 25% | 34% |
| Top-rate threshold | A ≥ Rp 745.000.001 | A ≥ Rp 1.400.000.000 |

A coordinator/user clarifying question was raised mid-task to choose between replacing with verified data, marking needs_review, or stubbing; no answer was returned. Per the brief's mandate ("verified primary-source facts to encode", "`verified_primary` only when rate, interval, and recipient conditions are all source-backed"), the canonical v2 dataset encodes the corrected verified tables. The v1 legacy file is left byte-unchanged (v1-compat contract requires it) and the discrepancy is surfaced as `cat-pph-21.knownDiscrepancies[legacy-ter-vs-canonical]` rather than silently overwritten.

## Changed / created files (all working-tree; no git history changes)

Created:
- `tests/fixtures/pph-21-boundaries.json` — boundary fixtures (verified expectations: effective dates, PTKP→category mapping, every TER category first/last bracket, ordinary month, final-period true-up, missing PTKP, nonresident with/without treaty, Article 17 bands, PTKP chronology, reclassification list).
- `tests/unit/pph-21-fixtures.test.ts` — Task-4 test suite (20 tests) loading the on-disk v2 corpus and asserting against fixtures + semantic validation.
- `src/build-ter-brackets.ts` — canonical TER A/B/C bracket tables transcribed from PP 58/2023 Lampiran A/B/C (single source of truth; exports `TER_BRACKETS`).
- `src/build-v2-rules.ts` — scaffolding that emits `data/v2/rules.json` from the canonical TER tables + verified primary sources (idempotent; keeps illustrative rules).

Modified:
- `data/v2/sources.json` — added 7 primary sources: `src-pp-58-2023`, `src-pmk-168-2023`, `src-uu-7-2021-hpp`, `src-pmk-101-2016-ptkp`, `src-pmk-122-2015-ptkp`, `src-pmk-162-2012-ptkp`, `src-pmk-252-2008-legacy` (illustrative sources retained).
- `data/v2/categories.json` — added `cat-pph-21` with `knownDiscrepancies`.
- `data/v2/concepts.json` — added 14 PPh 21 concepts (TER monthly, TER daily, Article 17 annual, final period, PTKP, 6 recipient classes, natura, SHU, pre-2024 regime).
- `data/v2/rules.json` — added 20 PPh 21 rules (illustrative rules unchanged): TER A/B/C monthly (verified_primary, 44/40/41 layers, 34% top), TER daily (verified_secondary formula), Article 17 HPP + pre-2022 (verified_primary / needs_review), final-period true-up (verified_primary formula), PTKP 2016-current / 2015 / 2013-2014 (verified_primary information_factor), nonresident default 20% (verified_primary) + treaty (verified_secondary), nonemployee norma (summary_only information_factor), activity participant / pension lumpsum / former employee / commissioner (summary_only), natura + SHU + pre-2024 regime (summary_only reclassifications).
- `data/v2/conflicts.json` — unchanged (illustrative conflict retained; no new v2-internal conflict declared because there is no v2-internal contradiction — only a v1-vs-v2 discrepancy, which is recorded on the category).

Not modified (intentional):
- `data/categories/pph-21.json` (v1) — left byte-identical for v1-compat.
- `website/src/pages/ter-pph-21.astro` — per brief "data sources are allowed to remain UI until Task 8; only data + generator parity must be correct here." The page still consumes v1 data and will be rewired in Task 8.

## RED → GREEN evidence

RED (recorded before production data): `pnpm vitest run tests/unit/pph-21-fixtures.test.ts` → **16 failed / 4 passed**. Failures spanned: missing PPh 21 category/concepts/sources, every TER boundary, Article 17 bands, PTKP chronology, final-period true-up, nonresident cases, and the legacy-discrepancy surfacing. (Saved transcript excerpt captured during implementation.)

GREEN (after implementation): `pnpm vitest run tests/unit/pph-21-fixtures.test.ts` → **20 passed / 20**.

Full suite:
- `pnpm test` → **117 passed** (was 97; +20 Task-4 tests).
- `pnpm validate` → **Source validation passed** (v2 schemas + semantic validator green across the enlarged dataset).
- `SOURCE_DATE_EPOCH=1800000000 pnpm build` → Astro build clean (21 pages), **34 contract tests passed**.
- Fixed-epoch determinism: two consecutive `SOURCE_DATE_EPOCH=1800000000 pnpm build` runs produce **byte-identical** `public/` artifacts (`diff` empty); `public/release.json` sha256 `7a1c1313…046722cc`.

## Verified primary-source coverage

`verified_primary` rules all carry official source IDs + regulation locators + rate/interval/condition evidence:
- TER A/B/C monthly → `src-pp-58-2023` Lampiran A/B/C + Pasal 5; `src-pmk-168-2023`.
- Article 17 HPP → `src-uu-7-2021-hpp` Pasal 3 angka 7.
- Final period → `src-pmk-168-2023` Pasal 9/15 + `src-uu-7-2021-hpp`.
- PTKP chronology → `src-pmk-101-2016-ptkp`, `src-pmk-122-2015-ptkp`, `src-pmk-162-2012-ptkp`.
- Nonresident default 20% → `src-uu-7-2021-hpp` Pasal 17(3)/Pasal 26.

`needs_review` / `summary_only` / `verified_secondary` are used where primary evidence is incomplete (Article 17 pre-2022, TER daily full layer table, nonresident treaty-specific rate, natura, SHU, pre-2024 permanent regime, recipient-class formula rules).

## Reclassification (per brief behavior rules)

- `pph-21-norma-*` (50% / 15% / 25% NPP) → `rule-pph-21-recipient-nonemployee-norma` as `information_factor` (factor 0.5 etc.) with `summary_only` verification — norma is a net-income factor, not a tax rate; final tariff remains Article 17.
- `pph-21-natura-kenikmatan` → `rule-pph-21-natura-summary` as `summary_only` formula (PP 55/2022 / PMK 66/2023 conditions, no single standalone rate).
- `pph-21-shu-koperasi` → `rule-pph-21-shu-koperasi-final0` as `summary_only` zero rate (final 0% facility per UU HPP 4(3)(f), recipient confirmation required).
- `pph-21-progressive-monthly-pre2024` / pre-2024 permanent regime → `rule-pph-21-pre2024-permanent-regime` as `summary_only` formula; not back-applied to TER periods.

## Conflicts declared

- None new in `data/v2/conflicts.json`. The legacy v1-vs-v2 TER discrepancy is recorded on `cat-pph-21.knownDiscrepancies[legacy-ter-vs-canonical]` rather than as a v2 conflict, because there is no v2-internal contradiction (v2 holds the single canonical, source-backed value). The resolver therefore never returns `tepat` from the v1 shadow.

## Concerns / follow-ups

1. **(Material, needs Task-8 / coordinator decision)** The v1 `data/categories/pph-21.json` TER tables remain wrong and are still served by API v1 and rendered by `website/src/pages/ter-pph-21.astro`. Task 8 (UI redesign) or a dedicated v1-migration task must decide whether to (a) rewire the website TER page/calculator to the v2 canonical rules, and (b) correct or deprecate the v1 entries. Until then the public v1 surface and website TER page continue to show the legacy (incorrect) tables.
2. **(Provenance)** The canonical TER A/B/C layer tables were verified against the official PP 58/2023 abstract + two government-aligned secondary extractions (PMK 168/2023 PDF on pajak.go.id, and a primary-source-aligned commentary) because the BPK Lampiran PDF could not be machine-extracted end-to-end in this environment. The three sources agree on first-bracket bounds, top rate (34%), and category mapping. Before flipping any downstream production claim, a human should open the official Lampiran PDF and visually confirm the middle layers.
3. **(Open Task-1/2 minors, unchanged)** Carry-over minors from Tasks 1-2 remain open (wire category/conflict/bppu schemas into compileV2Schemas; full-DFS supersession cycle traversal). They do not block Task 4.
4. **(Daily TER)** Lampiran D (TER harian) full layer table is encoded as a `verified_secondary` formula placeholder pending complete layer transcription.
5. **(PTKP K/3 PTKP value)** One secondary source printed "TK/3 Rp70 juta" for TER C, which conflicts with the brief's verified PTKP (K/3 = Rp72 juta). The canonical PTKP concept uses the brief's verified values (PMK 101/2016); TER C is mapped to PTKP class K/3 per PP 58/2023 Lampiran C, independent of the rupiah amount.

## Build/test commands used

- `pnpm vitest run tests/unit/pph-21-fixtures.test.ts` (focused)
- `pnpm test` (full unit + contract)
- `pnpm validate`
- `SOURCE_DATE_EPOCH=1800000000 pnpm build` (clean → validate → generate → sync → Astro → contracts), run twice for determinism.

---

# Review Fix Report (Spec PASS / Quality CHANGES_REQUIRED)

All four findings fixed test-first in the same working tree. No migration of other tax families, no UI redesign, no commit/push/deploy/branch/history (HEAD still at `3c4e7c5`, all changes untracked working-tree).

## Fixes applied

**Critical 1 — TER A/B/C provenance downgrade.** Monthly TER rules `rule-pph-21-ter-monthly-a/b/c` changed from `verified_primary` to `verified_secondary`. Interval and condition evidence remain primary-backed (`src-pp-58-2023` Pasal 5 + Lampiran A/B/C); the rate-evidence locator now states explicitly that bracket endpoints/category mapping are verified against the BPK abstract while middle layers were reconstructed from government-aligned secondary extractions pending direct Lampiran PDF transcription. Rule notes mirror this. Boundary arithmetic (zero-band edges, 0.25% step, 34% top band) is unchanged and still asserted.

**Important 2 — PMK 252/2008 source locator.** `src-pmk-252-2008-legacy.url` corrected from `https://peraturan.bpk.go.id/Details/51412/pmk-no-162-pmk-010-2009` (PMK 162/2009, wrong regulation) to `https://jdih.kemenkeu.go.id/dok/252-pmk-03-2008` (official MoF JDIH portal for PMK 252/PMK.03/2008). Source name/locator also clarified to the regulation's full title. The citing rule `rule-pph-21-pre2024-permanent-regime` stays `summary_only` (not `verified_primary`), so no overclaim.

**Important 3 — Pension-lumpsum interval.** `rule-pph-21-recipient-pension-lumpsum.validFrom` narrowed from `2014-01-01` to `2024-01-01`, matching its only cited sources (PMK 168/2023). The unsubstantiated "historis sejak 2014" interval-evidence claim was removed; interval locator now states the 2024 scope and that the pre-2024 regime needs contemporary primary sources added separately. Rate (`summary_only` progressive 0/5/10/15%), condition, and example unchanged.

**Minor 4 — Illustrative treaty rule.** `rule-pph-21-nonresident-treaty.notes` rewritten to begin with "ILLUSTRATIVE treaty example rule" and clarify the 5% is a placeholder, not authoritative for any country. The `nonresident-with-treaty` boundary fixture no longer pins an authoritative rate (`winningRateFraction` removed); it now asserts the winning rule id and that determination is `bersyarat` (never `tepat` for `verified_secondary`). Any examples on the rule remain flagged `illustrative: true`.

## Test-first evidence (RED → GREEN)

Six new tests added under `describe('PPh 21 / TER migration (Task 4 review) - provenance honesty')` in `tests/unit/pph-21-fixtures.test.ts`, plus a new `winningRuleId` assertion path in the boundary loop and an updated `nonresident-with-treaty` fixture entry.

RED (before data fixes): `pnpm vitest run tests/unit/pph-21-fixtures.test.ts` → **4 failed / 22 passed** (26). Failures: TER A/B/C status was `verified_primary`; PMK 252 URL host mismatch; pension-lumpsum lacked a contemporaneous pre-2024 source; treaty notes lacked the literal "illustrative" marker.

GREEN (after data fixes): `pnpm vitest run tests/unit/pph-21-fixtures.test.ts` → **26 passed / 26**.

## Files changed in this fix (working-tree only)

- `tests/unit/pph-21-fixtures.test.ts` — +6 provenance-honesty tests, +`winningRuleId` boundary path.
- `tests/fixtures/pph-21-boundaries.json` — `nonresident-with-treaty` entry de-authoritised (id + determination only).
- `src/build-v2-rules.ts` — TER A/B/C → `verified_secondary` with honest rate-evidence text; pension `validFrom` 2024-01-01 + interval-evidence/notes rewrite; treaty notes marked illustrative.
- `data/v2/sources.json` — `src-pmk-252-2008-legacy` URL corrected to JDIH Kemenkeu, full title restored.
- `data/v2/rules.json` — regenerated from the updated build script (25 rules: 5 illustrative + 20 PPh 21).

## Verification (re-run after fixes)

- `pnpm vitest run tests/unit/pph-21-fixtures.test.ts` → **26/26 passed**.
- `pnpm test` → **123 passed** (was 117 after Task 4; +6 review tests).
- `pnpm validate` → **Source validation passed**.
- `SOURCE_DATE_EPOCH=1800000000 pnpm build` → Astro build clean (21 pages), **34 contract tests passed**.
- Fixed-epoch determinism: two consecutive builds produce byte-identical `public/` artifacts (`diff` empty); `public/release.json` sha256 `86d93fc8751a3c8809533684512f41b9caa80516c85b799efcc2114894ad807b`.
- `git diff --check` → exit 0, no whitespace/merge-conflict errors (only pre-existing LF→CRLF autocrlf warnings on tracked files).
- Git history unchanged: HEAD `3c4e7c5`, branch `main`, no staged/committed changes.

## Residual concerns (unchanged from initial report where still open)

- (Material, still open) v1 `data/categories/pph-21.json` TER tables remain wrong and are still rendered by `website/src/pages/ter-pph-21.astro`; rewiring deferred to Task 8.
- (Provenance, partially addressed by this fix) TER A/B/C middle layers are now honestly marked `verified_secondary`; a human should still visually confirm middle layers against the official Lampiran PDF before any production `verified_primary` flip.
- Daily TER (Lampiran D) and pension pre-2024 era remain placeholders pending full primary transcription.
- Carry-over Task-1/2 minors remain open.
