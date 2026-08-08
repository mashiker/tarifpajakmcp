# Task 9 Brief — Detail Tarif, Timeline, Aksesibilitas, dan Rewiring UI

Repository: `E:\kantor_archisight\tarifpajak\tarifpajakmcp`
Branch: `main` lokal. No commit/push/deploy.

Read first:
- `docs/superpowers/specs/2026-08-06-tarif-pajak-temporal-redesign-design.md` (Detail Tarif, Aksesibilitas)
- `docs/superpowers/plans/2026-08-06-tarif-pajak-temporal-redesign-plan.md`, Task 9
- `.superpowers/sdd/progress.md`

Tasks 1–8 approved. Root database + 134 deep links emitted.

## Deliverable

1. Create `/tarif/[id].astro` resolving the 134 deep links the root emits. Show rate semantics, transaction/tax base, exact interval, status at selected date, verification + date, primary source locators, predecessor/successor rules, BPPU codes with version, examples labeled illustrative/verified, missing facts, open conflicts, JSON API link.
2. Fix non-functional status filter chips (Mn2): derive status from `validToExclusive`/`verification` (berlaku=open-ended, dicabut=past end date, diubah=superseded-but-visible, belum_berlaku=future validFrom) and apply in BOTH `filterDatabaseRows` and `isRowVisible`. Wire statusCounts for all five chips. Spec requires "status historis" filter.
3. Rewire TER page to canonical v2 TER rules (re-baselined from Task 8). Render correct 44/40/41 layers, 0% bounds 5.4M/6.2M/6.6M, top 34%.
4. BPPU page: include new categories (cat-pph-final-umkm, cat-pph-special-regimes) in category index/navigation.
5. PPN calculator UI: use canonical projection (parity locked).
6. Reuse or delete orphaned TimelineCell.astro/VerificationBadge.astro (Mn1) — delete if not reused, or mark retained-for-detail.
7. Category pages become index/navigation → deep-link to detail URLs; keep anchor behavior.
8. Accessibility polish: table caption + scoped headers on detail tables; `rel="noopener noreferrer"` on externals; `prefers-reduced-motion`; mobile menu state; theme button exposes state; focus management on filter changes.

## TDD

1. Contract test first: every root deep link has a matching generated detail route and API document (tests/contracts/detail-routes.test.ts). RED then implement.
2. Unit test for status derivation (pure helper) before wiring.
3. TER fixture: detail/TER page reads v2 values, not v1 wrong table.
4. Full tests, validate, fixed-epoch build, Astro build, contract tests, diff check.
5. Do not add Playwright QA (Task 11) or SEO/LLM outputs (Task 10).

## Report

Write `.superpowers/sdd/task-9-report.md` with changed files, RED/GREEN evidence, decisions, concerns. Return only status/tests/concerns.
