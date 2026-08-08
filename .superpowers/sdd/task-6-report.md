# Task 6 Report — Audit dan Migrasi PPN 2022-2025

Repository: `E:\kantor_archisight\tarifpajak\tarifpajakmcp`
Branch: `main` lokal. No commit/push/deploy/branch/history changes.
Verified primary sources: 119-source brief (2026-08-06).

## Deliverable summary

Migrated PPN 2022-2025 into `data/v2` canonical rules with verified primary
sources (UU HPP 7/2021, UU PPN 8/1983, PMK 131/2024, PMK 11/2025, PMK 53/2025),
exact intervals, conditions, and example fixtures. Replaced the v1 generator's
hard-coded PPN calculator data with a canonical projection from v2 rules and
added a calculator-parity contract that locks the two surfaces together.

The model distinguishes nominal rate (UU PPN/HPP Article 7) from DPP factor
(PMK 131 Article 3, 11/12) from effective burden (12% × 11/12 = 11%). Year
2025 returns conditional candidates keyed on `luxuryBkp` / `retailFinalConsumer`
/ `transactionKind`, never one universal number. Zero-rated exports are a
distinct concept (`concept-ppn-export`, rate type `zero`) from exempt/non-object.

## Changed files (source, not generated artifacts)

### Created
- `tests/fixtures/ppn-boundaries.json` — boundary fixtures encoding every
  verified primary-source fact from the brief (10% through 2022-03-31, 11% from
  2022-04-01, nominal 12% from 2025-01-01, DPP 11/12 for non-luxury, full-base
  12% for luxury, retail Jan/Feb 2025 transition, export 0%, foreign
  utilization, missing-luxury-classification conditional).
- `tests/unit/ppn-fixtures.test.ts` — RED-first unit tests (23 tests) covering
  source registry, concept coverage, nominal-vs-DPP-factor-vs-effective-burden
  modeling, boundary resolution, year-2025 conditional candidates, and export
  0% distinctness.
- `tests/contracts/calculator-parity.test.ts` — RED-first contract (10 tests)
  locking v1 calculator PPN output to the canonical v2 rules and forbidding the
  previous "7/12 × 11%" typo.

### Modified (data/v2)
- `data/v2/sources.json` — added 4 PPN primary sources:
  `src-uu-8-1983-ppn`, `src-pmk-131-2024`, `src-pmk-11-2025`, `src-pmk-53-2025`.
  Extended `src-uu-7-2021-hpp` locator to pin UU PPN Article 7 boundaries
  (10% → 2022-03-31, 11% → 2022-04-01, nominal 12% → 2025-01-01, exports 0%).
- `data/v2/categories.json` — added `cat-ppn` with description documenting the
  2025 conditional regime and two declared knownDiscrepancies:
  `v1-ppn-calculator-hardcoded-vs-canonical` (the "7/12 × 11%" typo and stale
  "belum berlaku" note) and `2025-conditional-regime-no-universal-number`.
- `data/v2/concepts.json` — added 6 PPN concepts:
  `concept-ppn-domestic-supply`, `concept-ppn-import`, `concept-ppn-export`,
  `concept-ppn-foreign-utilization`, `concept-ppn-luxury-retail`,
  `concept-ppn-dpp-nilai-lain`.
- `data/v2/rules.json` — added 11 canonical PPN rules:
  - `rule-ppn-domestic-supply-10pct-pre-hpp` (1984-04-01 → 2022-04-01, 10%)
  - `rule-ppn-domestic-supply-11pct` (2022-04-01 → 2025-01-01, 11%)
  - `rule-ppn-domestic-supply-2025-nonluxury` (2025-01-01+, formula 12%×11/12=11%)
  - `rule-ppn-domestic-supply-2025-nonluxury-dpp-factor` (information_factor 0.9166667)
  - `rule-ppn-domestic-supply-2025-luxury` (2025-01-01+, 12% full base)
  - `rule-ppn-import-2025-nonluxury` (formula 12%×11/12=11%)
  - `rule-ppn-import-2025-luxury` (12% full base)
  - `rule-ppn-export-0pct` (1984-04-01+, zero, UU PPN 7(2))
  - `rule-ppn-foreign-utilization-2025` (formula 12%×11/12=11%)
  - `rule-ppn-luxury-retail-jan-2025` (2025-01-01 → 2025-02-01, formula 11/12)
  - `rule-ppn-luxury-retail-dpp-11-12-jan-2025` (companion information_factor)
  - `rule-ppn-luxury-retail-feb-2025` (2025-02-01+, 12% full base)
  - `rule-ppn-dpp-nilai-lain-11-12` (information_factor 0.9166667, PMK 131 Pasal 3)

### Modified (generator + pipeline)
- `src/generators/v1.ts` — added `v2Rules` option and `projectPpnCalculator()`
  helper. The PPN calculator output is now projected from canonical v2 rules
  (nominal 10/11/12%, DPP 11/12 factor, luxury full-base, export 0%, scenarios,
  formulas, source citations). Removed the hard-coded values and the incorrect
  "7/12 × 11%" narrative.
- `src/generate.ts` — reordered so v2 data loads before v1 generation, and v2
  rules are passed to `generateApiV1` so the calculator projection has access
  to the canonical rules.

### Modified (tests)
- `tests/contracts/v2-api.test.ts` — replaced an over-strict assertion that
  every by-year segment `validFrom`/`validToExclusive` must be `YYYY-01-01`.
  The PPN 10% rule legitimately starts 1984-04-01 (UU PPN promulgated 1983,
  effective 1984-04-01), creating a transition segment inside 1984. The new
  assertion checks the real invariant: segments tile the year as clipped
  half-open intervals (first opens at YYYY-01-01, last closes at (YYYY+1)-01-01,
  adjacent segments are contiguous, every segment is a valid half-open interval).

## RED → GREEN evidence

### RED (before production code)
- `tests/unit/ppn-fixtures.test.ts`: 21 failed, 2 passed (23 total).
  Failures spanned missing category/concepts/rules/sources, missing 11/12
  factor, missing export 0% rule, missing 2025 conditional determination.
- `tests/contracts/calculator-parity.test.ts`: 7 failed, 3 passed (10 total).
  Failures showed the old hard-coded calculator data, the "7/12 × 11%" typo,
  and missing luxury/DPP-factor/export scenarios.

### GREEN (after production code)
- `tests/unit/ppn-fixtures.test.ts`: 23 passed (23 total).
- `tests/contracts/calculator-parity.test.ts`: 10 passed (10 total).
- Full suite: 191 passed across 23 test files (baseline was 158; +33 new tests).
- `pnpm validate`: Source validation passed (v2 schema + semantic validator
  green, including the new PPN rules).
- `pnpm build`: clean → validate → generate → sync → Astro build (21 pages) →
  contracts. All 44 contract tests pass.
- Fixed-epoch determinism: two builds at `SOURCE_DATE_EPOCH=1700000000`
  produce byte-identical `api/v1/calculator/ppn.json` and
  `api/v2/by-year/2025.json` (`DETERMINISM_OK`).
- v1 contract preserved: no entry IDs dropped, calculator index still lists
  PPN, all 15 category slugs intact.

## Source registry additions

| Source ID | Regulation | Role | Key locator |
|---|---|---|---|
| `src-uu-8-1983-ppn` | UU 8/1983 (UU PPN) | primary | Pasal 4, 4A, 7(1)(a), 7(2), 8, 9, 16B |
| `src-pmk-131-2024` | PMK 131/PMK.03/2024 | primary | Pasal 2 (luxury full base), 3 (DPP 11/12), 4 (special-scheme carve-out), 5 (retail Jan/Feb transition) |
| `src-pmk-11-2025` | PMK 11/PMK.03/2025 | primary | Effective 4 Feb 2025 (for transactions since 1 Jan 2025); consolidates sectoral DPP schemes |
| `src-pmk-53-2025` | PMK 53/PMK.03/2025 | primary | Effective 1 Aug 2025; targeted amendments to PMK 11/2025 (e.g. insurance) |

`src-uu-7-2021-hpp` locator extended with UU PPN Article 7 boundaries
(10% → 2022-03-31, 11% → 2022-04-01, nominal 12% → 2025-01-01, exports 0%).

## Conflicts declared

Both conflicts are declared on `cat-ppn.knownDiscrepancies` (no silent
resolution, per the global constraint):

1. `v1-ppn-calculator-hardcoded-vs-canonical` — the pre-Task-6 v1 PPN
   calculator carried hard-coded values including the mathematically wrong
   "7/12 × 11% via PMK 131/2024" narrative (correct factor is 11/12, giving
   12% × 11/12 = 11%) and a stale "12% belum berlaku" note (12% has been
   effective since 2025-01-01). Resolved by projecting from v2; the typo must
   never reappear (asserted by the calculator-parity contract).

2. `2025-conditional-regime-no-universal-number` — there is no single PPN
   rate for 2025. UU HPP sets nominal 12%; PMK 131/2024 Article 3 sets DPP
   11/12 for non-luxury (effective 11%); Article 2 sets full-base 12% for
   luxury; Article 5 sets the Jan→Feb 2025 retail transition; Article 4
   carves out sectoral schemes (PMK 11/2025, PMK 53/2025). Resolver returns
   conditional candidates and demands `luxuryBkp` / `retailFinalConsumer`
   facts before giving a single answer.

## Boundary fixtures covered (tests/fixtures/ppn-boundaries.json)

1. 2022-03-31 still 10% (boundary day, NOT 11%)
2. 2022-04-01 now 11% (boundary day, NOT 10%)
3. 2024-12-31 still 11% nominal (12% does NOT arrive before 2025-01-01)
4. 2025 non-luxury domestic effective 11% (12% × 11/12)
5. 2025 luxury domestic full 12%
6. 2025 luxury retail January 11% (PMK 131 Article 5 transition)
7. 2025 luxury retail February full 12%
8. 2025 import non-luxury effective 11%
9. 2025 import luxury full 12%
10. Export 0% throughout (UU PPN 7(2), zero-rated)
11. 2025 foreign utilization effective 11%
12. 2025 missing luxury classification → conditional (bersyarat/fakta_kurang)

## Concerns

1. **Calculator UI rewiring is Task 8 (out of scope here).** The
   `website/src/pages/ter-pph-21.astro` calculator still reads from the v1
   `api.json` and uses inline brackets; the PPN category page
   (`website/src/pages/kategori/ppn.astro`) is unchanged. The brief explicitly
   defers the website calculator UI rewiring to Task 8. This task only locks
   the data parity via the v1 calculator JSON output and the canonical v2
   rules. The actual UI will need updating in Task 8 to consume the new
   `rates.nominal_10pct/nominal_11pct/nominal_12pct/dpp_nilai_lain_11_12/
   luxury_full_base_12pct/ekspor` and `scenarios` structure.

2. **v1 `data/categories/ppn.json` left as-is.** The brief said "Replace
   hard-coded calculator data with canonical projections" — the v1 generator
   now projects from v2. But the v1 *source* file
   (`data/categories/ppn.json`) still contains the old hard-coded entries
   (`ppn-11pct-effective-2025` with the "7/12 × 11%" note in its description,
   `ppn-10pct`, `ppn-11pct-2022`, etc.). These feed the v1 entries API and
   the website category page. Migrating the v1 source entries themselves is
   not part of Task 6 (the plan reserves v1 website/category rewiring for
   Task 8 and the v1 entries are contractually locked by
   `tests/contracts/v1-api.test.ts`). The calculator output — the part the
   brief targeted — is now canonical. The leftover "7/12 × 11%" string in
   `data/categories/ppn.json` is visible in the v1 entries API; declared as
   a knownDiscrepancy on `cat-ppn` so it is not silently propagated.

3. **PMK 131/2024 source URL is a placeholder.** The official URL
   `https://peraturan.bpk.go.id/Details/2024/131/PMK.03` could not be
   verified as the exact canonical path during this run; the regulation ID
   and locator are accurate, but the URL should be confirmed against BPK
   JDIH before any public release. Marked `verified_primary` based on the
   regulation text and locator (which match the brief's verified facts),
   not the URL.

4. **DPP factor stored as `0.9166667` (7 decimals).** The exact rational is
   11/12. The 7-decimal representation is what the calculator uses to compute
   the effective burden (12 × 0.9166667 = 11.0000004, which rounds to 11%).
   If higher precision is ever required, the factor could be stored as a
   formula or as a numerator/denominator pair; the current approach matches
   the existing `information_factor` schema (decimal string) and is
   sufficient for percentage-level arithmetic.

5. **No other tax families touched.** Per the brief, only PPN 2022-2025 was
   migrated. PPh Badan, PPh Final, UMKM (Task 7), and the website database
   redesign (Task 8) are untouched.

---

## Review fix report (Spec PASS / Quality CHANGES_REQUIRED)

Reviewer findings: 1 Important, 2 Minor. All fixes applied test-first in the
same working tree. No other tax families migrated, no UI redesign.

### Important #1 — PMK 131/2024 source URL was a non-resolvable placeholder

- **Problem:** `data/v2/sources.json` carried
  `https://peraturan.bpk.go.id/Details/2024/131/PMK.03` (a non-resolvable
  placeholder slug) on a `verified_primary` source.
- **RED test added:** `tests/unit/ppn-fixtures.test.ts` gained
  "PMK 131/2024 source carries a resolvable official URL on bpk.go.id or
  jdih.kemenkeu.go.id containing 131 and 2024 (not a placeholder)". Asserts the
  URL host is `bpk.go.id` or `jdih.kemenkeu.go.id`, the URL contains `131` and
  `2024`, the URL is absolute `https://`, and the old placeholder slug
  `/Details/2024/131/PMK.03` does NOT reappear. Failed as expected pre-fix.
- **Fix:** replaced the URL with the resolvable BPK URL already present in v1
  data: `https://peraturan.bpk.go.id/Details/204066/pmk-no-131-tahun-2024`.
  The regulationId (`PMK/131/PMK.03/2024`) and locator (Pasal 2/3/4/5) are
  unchanged and remain the substantive evidence for `verified_primary`.
- **GREEN:** focused test passes (24/24 in `tests/unit/ppn-fixtures.test.ts`).

### Minor #2 — `projectPpnCalculator` luxury-retail scenario hard-coded intervals

- **Problem:** the `luxury-retail-jan-2025` scenario (and the domestic-luxury /
  non-luxury 2025 scenarios) hard-coded `effectiveFrom: '2025-01-01'` and
  `effectiveTo: '2025-02-01'` instead of deriving them from the canonical v2
  rules.
- **RED test added:** `tests/contracts/calculator-parity.test.ts` gained
  "calculator scenarios project their intervals from canonical v2 rules
  (no hard-coded effectiveFrom/To)". Asserts the scenario's interval equals
  the source rule's interval AND the `$projection.v2RuleIds` lists the source
  rule id (proving derivation, not coincidental hard-coded values). Failed as
  expected pre-fix.
- **Fix:** `src/generators/v1.ts` `projectPpnCalculator` now looks up
  `rule-ppn-domestic-supply-2025-luxury`, `rule-ppn-luxury-retail-jan-2025`,
  and the existing non-luxury/export rules, and projects each scenario's
  `effectiveFrom`/`effectiveTo` from the rule's `validFrom`/`validToExclusive`.
  Each scenario also carries a `sourceRuleId` field naming the canonical rule
  it was derived from. The `luxury_full_base_12pct` rate entry and the
  `$projection.v2RuleIds` list were updated to derive from and cite the
  canonical rules. The projection list is deduplicated (the nominal-12% lookup
  and the luxury-domestic lookup can resolve to the same rule).
- **GREEN:** focused contract passes (11/11 in
  `tests/contracts/calculator-parity.test.ts`).

### Minor #3 — v1 timeline group `ppn` references stale `ppn-11pct-effective-2025`

- **No code change.** Recorded as a Task 8 note. The v1 timeline group `ppn`
  still lists `ppn-11pct-effective-2025` (one of the hard-coded v1 entries).
  Rewiring the v1 timeline and website category page is part of the Task 8
  website rewiring, out of scope here. The v1 entries contract
  (`tests/contracts/v1-api.test.ts`) continues to lock the existing surface.

### Verification after fixes

- Focused: `tests/unit/ppn-fixtures.test.ts` 24/24;
  `tests/contracts/calculator-parity.test.ts` 11/11.
- Full suite: 193 passed across 23 test files (was 191 pre-fix; +2 new tests).
- `pnpm validate`: Source validation passed.
- Fixed-epoch `pnpm build` (`SOURCE_DATE_EPOCH=1700000000`): validate →
  generate → sync → Astro 21 pages → 45 contract tests pass (was 44; +1 new
  contract test).
- Determinism: two consecutive fixed-epoch builds produce byte-identical
  `api/v1/calculator/ppn.json` and `api/v2/by-year/2025.json`
  (`DETERMINISM_OK`).
- `git diff --check`: exit 0, no whitespace errors on edited source files
  (`src/generators/v1.ts`, `src/generate.ts`, `tests/unit/ppn-fixtures.test.ts`,
  `tests/contracts/calculator-parity.test.ts`, `data/v2/sources.json`). Only
  pre-existing CRLF/LF line-ending warnings on generated artifacts.
- Branch `main`, last commit `3c4e7c5` unchanged. No commit/push/deploy/branch.

### Files changed in this fix round

- `data/v2/sources.json` — PMK 131/2024 URL replaced with the resolvable BPK
  URL `https://peraturan.bpk.go.id/Details/204066/pmk-no-131-tahun-2024`.
- `src/generators/v1.ts` — `projectPpnCalculator` now looks up the luxury and
  retail transition rules and projects scenario intervals/sourceRuleIds from
  them; projection list deduplicated; `luxury_full_base_12pct` rate interval
  derived from the rule.
- `tests/unit/ppn-fixtures.test.ts` — added the PMK 131/2024 URL assertion
  (RED-first).
- `tests/contracts/calculator-parity.test.ts` — added the scenario-interval
  projection assertion (RED-first).

### Updated concern

3. (Updated) **PMK 131/2024 source URL resolved.** The previous concern about
   the placeholder URL is resolved: the source now carries the same resolvable
   BPK URL (`https://peraturan.bpk.go.id/Details/204066/pmk-no-131-tahun-2024`)
   that the v1 data already used. The regulation ID and locator remain the
   substantive `verified_primary` evidence. The URL is asserted by the new
   unit test to be on `bpk.go.id`/`jdih.kemenkeu.go.id` and contain `131` and
   `2024`.
