# Task 4 Brief — Audit dan Migrasi PPh 21 / TER

Repository: `E:\kantor_archisight\tarifpajak\tarifpajakmcp`
Branch: `main` lokal. No commit/push/deploy.

Read first:
- `docs/superpowers/specs/2026-08-06-tarif-pajak-temporal-redesign-design.md`
- `docs/superpowers/plans/2026-08-06-tarif-pajak-temporal-redesign-plan.md`, Global Constraints and Task 4
- `.superpowers/sdd/progress.md`
- Primary-source research brief below (verified 2026-08-06).

Tasks 1–3 approved. v2 model, resolver, validator, and generators are ready.

## Deliverable

Migrate PPh 21/TER into `data/v2` canonical rules with verified primary sources, exact intervals, conditions, and example fixtures. Replace hard-coded website TER calculator data sources are allowed to remain UI until Task 8; only data + generator parity must be correct here.

## Primary-source facts to encode (verified)

- PP 58/2023 Pasal 5 + Lampiran A–D: TER A/B/C and daily TER effective **2024-01-01**. Store half-open `validFrom=2024-01-01`, `validToExclusive=null` unless amended.
- PMK 168/2023 Pasal 1, 9, 15, 18, 19, 21, 25: tax-point rules, Masa Pajak, Masa Pajak Terakhir, ordinary vs final-period reconciliation, PTKP at year start, effective **2024-01-01**.
- UU 7/2021 HPP Pasal 3 angka 7: Article 17 annual bands (5/15/25/30/35) effective Tax Year 2022. Encode as progressive brackets with half-open numeric intervals.
- PTKP chronology: PMK 101/PMK.010/2016 (Rp54m/4.5m) effective Tax Year 2016–current; PMK 122/PMK.010/2015 (Rp36m/3m) Tax Year 2015 only; PMK 162/PMK.011/2012 (Rp24.3m/2.025m) Tax Years 2013–2014. Distinguish `valid_from_tax_year` from promulgation.
- Pre-2024 permanent-employee withholding: legacy PMK 252/2008 regime; mark as `needs_review`/`summary_only` unless fully sourced. Do not back-apply TER.

## Behavior rules

- Ordinary period: `PPh21 = TER(category, monthly_gross) × monthly_gross`.
- Final period: annual/part-year Article 17 minus prior-period PPh 21; never another TER month.
- Recipient classes (commissioner, non-employee 50%, activity participant 100%, pension participant, former employee, nonresident 20%/treaty) must be modeled as distinct conditions.
- Natura/SHU/norma entries currently in legacy `pph-21.json` should be reclassified as `information_factor` or `summary_only` unless primary evidence supports a standalone rate.
- `verified_primary` only when rate, interval, and recipient conditions are all source-backed.
- Half-open numeric bracket convention: lower exclusive, upper inclusive (store both fields explicitly), last band open.

## TDD

1. Boundary fixtures first (`tests/fixtures/pph-21-boundaries.json`): 2023-12-31, 2024-01-01, every TER category first/last bracket, ordinary month, final-period true-up, missing PTKP, nonresident with/without treaty.
2. RED, then implement v2 rules + migration + example fixtures.
3. Focused tests, full tests, validate, fixed-epoch build, Astro build, calculator-parity contract, diff check.
4. Do not redesign UI (Task 8) or migrate other tax families.

## Report

Write `.superpowers/sdd/task-4-report.md` with changed files, RED/GREEN evidence, source registry additions, conflicts declared, and concerns. Return only status/tests/concerns.
