# Task 6 Brief — Audit dan Migrasi PPN 2022–2025

Repository: `E:\kantor_archisight\tarifpajak\tarifpajakmcp`
Branch: `main` lokal. No commit/push/deploy.

Read first:
- `docs/superpowers/specs/2026-08-06-tarif-pajak-temporal-redesign-design.md`
- `docs/superpowers/plans/2026-08-06-tarif-pajak-temporal-redesign-plan.md`, Global Constraints and Task 6
- `.superpowers/sdd/progress.md`
- Primary-source research brief below (verified 2026-08-06, 119 sources).

Tasks 1–5 approved.

## Deliverable

Migrate PPN 2022–2025 into `data/v2` canonical rules with verified primary sources, exact intervals, conditions, and example fixtures. Replace hard-coded calculator data with canonical projections (calculator parity is a contract; the website calculator UI rewiring is Task 8).

## Primary-source facts to encode (verified)

- UU 7/2021 HPP Article 4 amending UU PPN Article 7(1)(a)/(b): 10% through 2022-03-31; **11% from 2022-04-01**; nominal **12% from 2025-01-01**.
- UU PPN Article 7(2): qualifying exports of tangible/intangible BKP and JKP are **0%** throughout.
- PMK 131/2024 Article 2: luxury BKP subject to PPnBM → full-base 12% on import/domestic supply (from 2025-01-01, except Article 5 retail final-consumer January transition).
- PMK 131/2024 Article 3: non-luxury BKP imports/supplies, ordinary JKP, and foreign intangible/JKP utilization → DPP nilai lain **11/12**, effective burden 11% (`12% × 11/12`).
- PMK 131/2024 Article 5: domestic luxury-BKP supply to final consumer by entitled retail PKP → 11/12 through 31 Jan 2025, full base from 1 Feb 2025. Luxury imports and other Article 2 supplies use full base from 1 Jan 2025.
- PMK 131/2024 Article 4: transactions already governed by a dedicated DPP nilai lain or "besaran tertentu" rule are NOT overridden by Article 3; PMK 11/2025 (effective 4 Feb 2025, calculations prescribed for supplies since 1 Jan 2025) consolidates those special schemes, frequently preserving effective 11% via additional sector factors. PMK 53/2025 amends PMK 11 from 1 Aug 2025 (targeted, e.g. insurance).

## Behavior rules

- Distinguish nominal rate (Article 7) from DPP factor (PMK 131/11) from effective burden. Use `information_factor` for DPP ratios and `formula` for effective burden; do NOT store "11%" as the only substantive 2025 rate.
- Model transaction conditions: domestic supply, import, export (0%), foreign utilization, luxury-BKP classification, retail final-consumer status, dedicated special-scheme coverage.
- Year 2025 must return conditional candidates, not one misleading universal number.
- Zero-rated exports distinct from exempt/non-object.
- Remove generic 11% informational values from rate records.
- verified_primary only when rate+interval+condition all source-backed by primary text.

## TDD

1. Boundary fixtures first (`tests/fixtures/ppn-boundaries.json`): 2022-03-31 (10%), 2022-04-01 (11%), 2024-12-31, 2025-01-01, non-luxury domestic sale (11% effective), luxury sale full 12%, luxury retail Jan 2025 (11%) vs Feb 2025 (12%), import non-luxury (11%), import luxury (12%), export (0%), foreign utilization (11%), missing luxury classification (conditional).
2. RED, then implement v2 rules + sources + examples + calculator parity contract.
3. Focused tests, full tests, validate, fixed-epoch build, Astro build, contract tests, calculator-parity contract, diff check.
4. Do not redesign UI or migrate other tax families.

## Report

Write `.superpowers/sdd/task-6-report.md` with changed files, RED/GREEN evidence, source registry additions, conflicts declared, and concerns. Return only status/tests/concerns.
