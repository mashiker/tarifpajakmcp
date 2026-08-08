# Task 3 Brief — Resolver Tanggal/Tahun, API v2, dan Kompatibilitas v1

Repository: `E:\kantor_archisight\tarifpajak\tarifpajakmcp`
Branch: `main` lokal. No commit/push/deploy.

Read first:
- `docs/superpowers/specs/2026-08-06-tarif-pajak-temporal-redesign-design.md`
- `docs/superpowers/plans/2026-08-06-tarif-pajak-temporal-redesign-plan.md`, Global Constraints and Task 3
- `.superpowers/sdd/progress.md`

Tasks 1–2 approved. Build on their interfaces (`core/types`, `core/date`, `core/conditions`, `core/rate`, `validation/*`, v2 bootstrap data). Do not migrate real tax law here.

## Deliverable

Implement Task 3 exactly, test-first:
- Pure temporal resolver: `resolveAtDate` and `resolveForYear`.
- Determination semantics exactly as the spec (`tepat`, `bersyarat`, `rentang`, `fakta_kurang`, `konflik_sumber`).
- Search normalization, filtering, deterministic sort.
- v1 compatibility projection with half-open to inclusive end conversion and v1 ID/path preservation.
- v2 generators: index, rules, concepts, BPPU, year segments, selected exact-date fixtures, search index, valid OpenAPI v2.
- Wire generators into the pipeline so `pnpm build` emits v2 artifacts deterministically and synchronizes website.
- Contract tests proving v1 endpoint/ID compatibility and v2 schema/determinism.

## Required behavior

- Resolver never uses current date implicitly and never returns synthetic 0%.
- Exact match blocked when any winning candidate is `source_conflict`, `needs_review`, or `summary_only`.
- Special-over-general precedence and typed relations honored; facts report drives missing-fact and conditional determinations.
- Year resolution splits `[YYYY-01-01, (YYYY+1)-01-01)` at rule boundaries and labels transitions.
- v1 compatibility must preserve all documented v1 endpoints and IDs; convert `validToExclusive` to inclusive legacy `effectiveTo`.
- Static host constraint: generate concrete date/year documents plus a serialized rules corpus that the website can resolve client-side using shared resolver logic.

## TDD

1. Tests first and capture RED.
2. Minimal implementation.
3. Focused tests, full tests, validate, fixed-epoch build, Astro build, contract tests, diff check.
4. Do not implement tax data corrections (Tasks 4–7) or redesign the website yet (Task 8+).

## Report

Write `.superpowers/sdd/task-3-report.md` with changed files, RED/GREEN evidence, design decisions, and concerns. Return only status/tests/concerns.
