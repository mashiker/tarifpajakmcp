# Task 2 Brief — Model Temporal, Provenance, dan Semantic Validator

Repository: `E:\kantor_archisight\tarifpajak\tarifpajakmcp`
Branch: `main` lokal. No commit/push/deploy.

Read first:
- `docs/superpowers/specs/2026-08-06-tarif-pajak-temporal-redesign-design.md`
- `docs/superpowers/plans/2026-08-06-tarif-pajak-temporal-redesign-plan.md`, Global Constraints and Task 2
- `.superpowers/sdd/progress.md`

Task 1 is approved. Build on its interfaces; do not rewrite the pipeline.

## Deliverable

Implement Task 2 exactly, test-first:
- Temporal/domain types and discriminated rate union.
- Strict half-open date helpers.
- Tri-state condition evaluation with missing-fact collection.
- Rate formatting and progressive calculation.
- V2 source/rule/concept schemas and minimal bootstrap category/concept/source/conflict datasets sufficient to validate the model, not tax-law migration.
- Semantic validation and stable validation report.

## Required behavior

- `verified_primary` requires official/primary source, stable regulation ID, usable locator, and evidence coverage for rate, interval, and applicable condition claims.
- Declared `source_conflict` may publish but cannot later resolve as exact; undeclared contradiction is an error.
- Detect duplicates, missing foreign keys, cycles, invalid half-open intervals, unexplained exclusive-group overlap, malformed progressive brackets, invalid BPPU references, and invalid examples.
- Percentages use decimal-safe representation (prefer decimal strings) or justify number use with strict finite/bounds checks; do not introduce binary-float arithmetic for legal output.
- Avoid overbuilding a full expression engine; only implement operators required by the spec.

## TDD

1. Tests first and capture RED.
2. Minimal implementation.
3. Focused tests, all tests, validate, fixed-epoch build, Astro build, diff check.
4. Do not implement resolver/API v2 (Task 3) or tax data corrections (Tasks 4–7).

## Report

Write `.superpowers/sdd/task-2-report.md` with changed files, RED/GREEN evidence, design decisions, and concerns. Return only status/tests/concerns.
