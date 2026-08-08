# Task 7 Brief — Audit PPh Badan, PPh Final, dan UMKM

Repository: `E:\kantor_archisight\tarifpajak\tarifpajakmcp`
Branch: `main` lokal. No commit/push/deploy.

Read first:
- `docs/superpowers/specs/2026-08-06-tarif-pajak-temporal-redesign-design.md`
- `docs/superpowers/plans/2026-08-06-tarif-pajak-temporal-redesign-plan.md`, Global Constraints and Task 7
- `.superpowers/sdd/progress.md`
- Primary-source research brief below (verified 2026-08-06, 77+131 sources).

Tasks 1–6 approved.

## Deliverable

Migrate PPh Badan chronology + facilities and PPh Final Pasal 4(2)/UMKM into `data/v2` canonical rules with verified primary sources, exact intervals, conditions, and example fixtures. Facilities are conditions/formulas, not unconditional standalone rates.

## Primary-source facts to encode (verified)

### PPh Badan
- UU 36/2008 Art 17(1)(b): 25% from Tax Year 2010; 2019 still 25%; listed-company reduction 5pp → 20%.
- Perppu 1/2020 → UU 2/2020 Art 5(1)(a): 22% for Tax Years 2020–2021; listed → 19%. Scheduled 20% from 2022 superseded by UU HPP.
- UU 7/2021 HPP Art 3 point 7 amending UU PPh Art 17(1)(b): 22% from Tax Year 2022–current; listed reduction now 3pp → 19%.
- UU PPh Art 17(2b) + PP 55/2022 Art 64–65 + PMK 40/2023: listed-company conditions (≥40% traded, ≥300 parties, each <5%, ≥183 days/year, reporting). Reduction is 3 percentage points, not 3% proportional.
- UU PPh Pasal 31E(1): resident badan with gross turnover ≤ Rp50bn gets 50% rate reduction on PKP attributable to first Rp4.8bn turnover. Formula when turnover ≤ Rp4.8bn: 50%×22%×PKP. Formula when Rp4.8bn<turnover≤Rp50bn: proportional allocation. Mandatory when eligible, not elective. No reduction above Rp50bn.
- IKN facilities PMK 28/2024 Art 4(1) 100% reduction; Art 8/10 duration schedules by business category and investment window (2023–2030/2031–2035/2036–2045); Art 8(5) 50% reduction for "other business" 2031–2045. Mark needs_review if category/eligibility not fully evidenced.

### PPh Final / UMKM
- UU PPh Pasal 4(2) authorizes final taxation for enumerated income (interest, prizes, securities, land/building transfer, construction, real-estate business, land/building rental, etc.).
- PP 46/2013: 1% final on business turnover, eligible WP OP/badan (not BUT), turnover ≤ Rp4.8bn, excludes professional services and income under another final regime. Effective 1 Juli 2013 – 30 Juni 2018. No duration limit.
- PP 23/2018: 0.5%, eligible OP/cooperative/CV/firma/PT, turnover ≤ Rp4.8bn, duration limits (OP 7yr, cooperative/CV/firma 4yr, PT 3yr; partial year counts as full). Effective 1 Juli 2018 – 19 Des 2022. Transition rule Pasal 10 for PP46-eligible-but-PP23-ineligible.
- PP 55/2022 original: 0.5%, effective 20 Des 2022, adds BUM Desa and one-person company; Pasal 69 preserves PP23 duration clocks; OP Rp500m exclusion is base exclusion (cumulative from first tax period, refreshes each tax year) NOT a second eligibility ceiling; Pasal 61 ceiling breach continues 0.5% through year-end.
- PP 20/2026 amends PP 55 effective 22 April 2026: narrows principal eligible types to OP, one-person company (single individual founder), cooperative; CV/firma/PT/BUM Desa legacy continuation under transitional; Pasal 59 deleted; tightened aggregation and professional-service rules.
- Land/building rent PP 34/2017: final 10% from 2 Jan 2018 (separate from UMKM 0.5%).
- Construction PP 9/2022 (amending PP 51/2008): final rates 1.75%/2.65%/4%/3.5%/6% by qualification from 21 Feb 2022; legacy contracts split by payment date.
- Transfer PP 34/2016: final 2.5%/1%/0% by category; effective ~8 Sep 2016.
- PPh 15 is a special net-income computation delegation (UU PPh Pasal 15), distinct from Pasal 4(2); some Pasal 15 taxes are final, some are creditable. Move PPh 15 records out of PPh 4(2) category.

## Behavior rules

- Model facilities as conditions/formulas (turnover, listed status, free-float, IKN category/investment), not flat standalone rates.
- Article 31E formula with proportional allocation, not whole-PKP flattening.
- UMKM entity eligibility + duration + turnover threshold + OP Rp500m exclusion as distinct conditions.
- PP 20/2026 amendment: do NOT quote original PP 55 Pasal 57/59 alone for post-22-Apr-2026.
- Separate PPh 15 from PPh 4(2); mark IKN/sector records needs_review when eligibility not fully evidenced.
- Preserve disputed claims visibly; declared source_conflict for unresolved.
- verified_primary only when rate+interval+condition all source-backed.

## TDD

1. Boundary fixtures (`tests/fixtures/pph-badan-boundaries.json`, `tests/fixtures/pph-final-umkm-boundaries.json`): every corporate transition 2019→2020→2021→2022; turnover under/crossing/above Rp4.8bn and Rp50bn; listed qualifying/non-qualifying; Article 31E allocation; IKN facts missing vs satisfied; PP46→PP23 transition; PP23→PP55 transition; PP55→PP20/2026; OP turnover below/above Rp500m; entity types + duration; construction qualification; transfer types; PPh 15 separation.
2. RED, then implement v2 rules + sources + conflicts + examples.
3. Focused tests, full tests, validate, fixed-epoch build, Astro build, contract tests, diff check.
4. Do not redesign UI.

## Report

Write `.superpowers/sdd/task-7-report.md` with changed files, RED/GREEN evidence, source registry additions, conflicts declared, and concerns. Return only status/tests/concerns.
