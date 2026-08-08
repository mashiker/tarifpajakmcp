# Task 7 Report — Audit PPh Badan, PPh Final, dan UMKM

Branch: `main` lokal. No commit/push/deploy/branch/history changes.

## Status

DONE_WITH_CONCERNS

## Changed files

### New (data + fixtures + tests)
- `tests/fixtures/pph-badan-boundaries.json` — 18 boundary fixtures (corporate chronology, listed PP reduction, Article 31E proportional allocation, IKN needs_review).
- `tests/fixtures/pph-final-umkm-boundaries.json` — 22 boundary fixtures (PP46→PP23→PP55→PP20/2026, rent, construction, transfer, PPh 15 separation).
- `tests/unit/pph-badan-fixtures.test.ts` — 31 tests.
- `tests/unit/pph-final-umkm-fixtures.test.ts` — 36 tests.

### Modified (data registry)
- `data/v2/categories.json` — added `cat-pph-badan`, `cat-pph-final-umkm`, `cat-pph-special-regimes` (with `knownDiscrepancies` documenting the UU 2/2020→HPP supersession, the percentage-point vs proportional listed reduction, the Article 31E proportional-vs-whole-PKP dispute, IKN partial evidence, PP 20/2026 Pasal 59 deletion, the PP 55 OP Rp500m base-exclusion interpretation, PPh 15 separation, and the construction legacy-contract split). Categories: 4 → 7.
- `data/v2/concepts.json` — added 13 concepts: `concept-pph-badan-base`, `concept-pph-badan-listed`, `concept-pph-badan-article31e`, `concept-pph-badan-ikn`, `concept-pph-final-umkm-pp46`, `concept-pph-final-umkm-pp23`, `concept-pph-final-umkm-pp55`, `concept-pph-final-umkm-pp20-2026`, `concept-pph-final-rent-land-building`, `concept-pph-final-construction`, `concept-pph-final-transfer`, `concept-pph-15-special`. Concepts: 28 → 41.
- `data/v2/sources.json` — added 14 primary sources: `src-uu-2-2020`, `src-pp-55-2022-badan`, `src-pmk-40-2023-listed`, `src-pmk-28-2024-ikn`, `src-pp-46-2013`, `src-pp-23-2018`, `src-pp-55-2022-umkm`, `src-pp-20-2026`, `src-pp-9-2022`, `src-pp-51-2008`, `src-pp-34-2016`, `src-uu-15-pph`. Reuses existing `src-uu-36-2008-pph`, `src-uu-7-2021-hpp`, `src-pp-34-2017`. Sources: 22 → 36.
- `data/v2/rules.json` — added 15 rules: 3 base-rate chronology (25%→22% UU 2/2020→22% HPP), 3 listed reduction (20%→19% UU 2/2020→19% HPP), 1 Article 31E formula, 1 IKN needs_review, 4 UMKM (PP46/PP23/PP55/PP20-2026), 1 rent, 2 construction (besar/kecil), 2 transfer (permukiman/sederhana), 1 PPh 15 summary_only. Rules: 52 → 67.

No files outside the Task 7 scope were touched. No v1 data, no website components, no generator/resolver code changed (Task 7 is data-only migration, consistent with the brief).

## RED → GREEN evidence

**RED recorded before production code.** Initial focused run of the two new test files against Tasks 1–6 data: `2 failed | 53 failed, 14 passed (67)` — failing on missing concepts, sources, rules, and resolver behavior. Tests written first; production data added after.

**GREEN after implementation:**
- `pnpm vitest run tests/unit/pph-badan-fixtures.test.ts` → 31 passed.
- `pnpm vitest run tests/unit/pph-final-umkm-fixtures.test.ts` → 36 passed.
- `pnpm test` → 260 passed (25 files). Baseline was 193; +67 new Task 7 tests, no regressions.
- `pnpm validate` → "Source validation passed" (semantic validator green, including all `verified_primary` evidence-coverage, foreign-key, and exclusive-group checks).
- `pnpm build` → clean → validate → generate → sync → Astro (21 pages) → contracts (45 passed).
- `pnpm check` → full test + build green.
- **Fixed-epoch determinism:** two `SOURCE_DATE_EPOCH=1800000000 pnpm build` runs produce byte-identical `website/dist` and `public` (diff exit 0, no output).
- JSON integrity: all 6 touched/created JSON files parse cleanly.

## Source registry additions (verified primary, with locators)

PPh Badan: `src-uu-36-2008-pph` (Pasal 17(1)(b), 17(2b), 31A, 31E(1)), `src-uu-2-2020` (Pasal 5(1)(a); scheduled 20% noted as SUPERSEDED by HPP), `src-uu-7-2021-hpp` (Pasal 3 angka 7 → Pasal 17(1)(b) 22%), `src-pp-55-2022-badan` (Pasal 64–65 listed conditions), `src-pmk-40-2023-listed` (Pasal 2–4: ≥40% traded, ≥300 shareholders, each <5%, ≥183 days), `src-pmk-28-2024-ikn` (Art 4(1) 100%, Art 8/10 duration, Art 8(5) 50%).

PPh Final/UMKM: `src-pp-46-2013` (1%, 1 Jul 2013 – 30 Jun 2018, no duration), `src-pp-23-2018` (0.5%, 1 Jul 2018 – 19 Des 2022, duration 7/4/3yr), `src-pp-55-2022-umkm` (0.5%, 20 Des 2022 – 21 Apr 2026), `src-pp-20-2026` (0.5%, from 22 Apr 2026; Pasal 59 deleted), `src-pp-34-2017` (rent 10% from 2 Jan 2018), `src-pp-9-2022` (construction 2.65%/4% from 21 Feb 2022), `src-pp-51-2008` (pre-2022 construction), `src-pp-34-2016` (transfer 2.5%/1%/0% from ~8 Sep 2016), `src-uu-15-pph` (Pasal 15 special regimes, separated from 4(2)).

All 14 new sources are `official: true, role: "primary"` with resolvable BPK/JDIH URLs and article-level locators. Every `verified_primary` rule carries evidence covering rate + interval + condition claims.

## Conflicts / disputed claims declared

Declared as `knownDiscrepancies` on the new categories (the validator publishes these; the resolver never resolves them as `tepat`):
1. `uu2-2020-scheduled-20pct-superseded-by-hpp` — the UU 2/2020 scheduled 20% from 2022 is SUPERSEDED by UU HPP 22%; the 2022 boundary fixture asserts 22% not 20%.
2. `listed-reduction-percentage-points-not-proportional` — reduction is 3 percentage points (22%→19%), NOT 3% proportional (which would yield 21.34%).
3. `article31e-proportional-not-whole-pkp` — proportional allocation of PKP to the first Rp4.8bn, not whole-PKP flattening to 11%; the 24bn-turnover fixture asserts 198.000.000 (19.8% effective), not 110.000.000.
4. `ikn-facility-evidence-partial-needs-review` — IKN rule marked `needs_review`; resolver returns `bersyarat`/`fakta_kurang`, never `tepat` 0%.
5. `pp55-pasal-59-deleted-by-pp20-2026` — PP 55 Pasal 57/59 must not be quoted alone post-22-Apr-2026.
6. `pp55-op-rp500m-base-exclusion-not-second-ceiling` — the OP Rp500m exclusion is a base exclusion, not a second eligibility ceiling.
7. `pph-15-distinct-from-pasal-4-2` — PPh 15 moved to `cat-pph-special-regimes`.
8. `construction-legacy-contract-split-by-payment-date` — pre-2022 termin split by payment date.

## Modeling notes (decisions)

- **Facilities as conditions/formulas, not flat standalone rates.** Listed reduction and Article 31E use conditional `percentage`/`formula` rates gated by facts. The IKN rule uses a `formula` rate. No unconditional 19%/11% standalone rate exists (asserted by a test).
- **Article 31E** uses a `formula` rate encoding proportional allocation, with 3 worked examples (turnover ≤4.8bn, exactly 4.8bn, and 24bn proportional → 198.000.000).
- **Listed reduction** uses conditional `percentage` rates (0.20 / 0.19) with a `listedConditionsMet` gate boolean plus granular `exists` checks on floatTradedPct/minShareholders/maxStakePct/heldDays for missing-facts granularity. This mirrors the PPh 23 NPWP-multiplier pattern (Tasks 1–6). The condition AST has no numeric comparison operators, so numeric thresholds (≥40%, ≥300, ≤5%, ≥183 days; turnover ≤50bn; PP23 duration) are surfaced as derived gate booleans documented in rule notes, while raw numeric facts remain required so the resolver surfaces `fakta_kurang` rather than guessing.
- **UMKM duration** (PP 23/2018: OP 7yr, koperasi/CV/firma 4yr, PT 3yr) modeled via `pp23DurationNotExceeded` gate + `pp23YearsElapsed` fact; the exceeded case resolves `fakta_kurang`.
- **Exclusive groups**: same-interval conditional variants (construction besar/kecil; transfer permukiman/sederhana) use distinct exclusive groups per variant — they are mutually exclusive by condition at resolve time, not competing versions, so no declared conflict is needed.

## Concerns

1. **Numeric threshold conditions are not natively expressible.** The v2 condition AST (`equals`/`in`/`exists`/`and`/`or`/`not`) cannot express `>=`, `<=`, `<`, `>`. Numeric eligibility thresholds (listed free-float ≥40%, Article 31E turnover ≤Rp50bn, UMKM turnover ≤Rp4.8bn, PP23 duration caps) are represented as caller-derived gate booleans (`listedConditionsMet`, `article31eEligible`, `umkmTurnoverEligible`, `pp23DurationNotExceeded`) documented in rule notes. The raw numeric facts are kept alongside so the resolver still surfaces `fakta_kurang` when they are absent. This is faithful to the data model established in Tasks 1–6 (e.g., the PPh 23 `recipientHasNpwp` gate) but means the dataset cannot self-evaluate a numeric boundary without caller-side derivation. A future task could extend the condition AST with comparison operators; out of scope for Task 7.
2. **Website category index pages for `pph-final-umkm` and `pph-special-regimes` are not generated.** The website category-page generator is driven by the legacy v1 category mapping. The new v2 categories and all their rules/concepts ARE present in the root index, the v2 API, search index, and `kategori/pph-badan` (which mapped cleanly). Wiring the remaining new categories into the website category-index generator is UI-layer work explicitly deferred to Task 8 ("v1 website ... rewiring (Task 8)" per progress.md) and the brief's "Do not redesign UI" constraint. No data is lost; the canonical data and API are complete.
3. **Carry-over items remain unchanged.** The pre-existing carry-overs noted in progress.md (Task 1–2 schema wiring, v1 calculator rewiring, v1 timeline ppn stale ref, movable-rent angka 4) are unaffected by Task 7 and remain for Task 8 / final review.
