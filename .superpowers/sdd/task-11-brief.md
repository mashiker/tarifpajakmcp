# Task 11 Brief — Browser QA, Accessibility, dan Final Release Gate

Repository: `E:\kantor_archisight\tarifpajak\tarifpajakmcp`
Branch: `main` lokal. No commit/push/deploy.

Read first:
- `docs/superpowers/specs/2026-08-06-tarif-pajak-temporal-redesign-design.md`
- `docs/superpowers/plans/2026-08-06-tarif-pajak-temporal-redesign-plan.md`, Task 11
- `.superpowers/sdd/progress.md`

Tasks 1–10 approved. 455 tests pass, 64 Astro pages, SEO/LLM outputs ready.

## Deliverable

1. Add Playwright config (`website/playwright.config.ts`) + E2E tests:
   - `website/tests/e2e/database.spec.ts` — root opens directly to database; no internal vertical DB scrollbar; body scrolls full results; URL filters init/update/reload/back-forward; exact date + year transition; empty state; detail deep link loads.
   - `website/tests/e2e/detail.spec.ts` — detail page loads; timeline + sources + conditions + relations render; status at date; predecessor/successor anchors scroll.
   - `website/tests/e2e/accessibility.spec.ts` — axe-core checks (no serious/critical) on root, detail, TER, BPPU, API docs.
   - `website/tests/e2e/mobile.spec.ts` — widths 320/375/768/desktop; no horizontal page overflow; mobile cards retain category/rate/period/status/detail; reduced motion honored.
2. Run E2E against local preview only (`pnpm --dir website preview`).
3. If Chromium browser binary cannot be installed (sandbox/network), document the limitation clearly and ensure the existing 173 contract tests + static markup checks cover the critical assertions as a fallback. Do NOT skip the E2E test files — write them so they run when a browser IS available.
4. Add `@axe-core/playwright` dependency.
5. Run full verification: `pnpm install --frozen-lockfile` (both roots), `SOURCE_DATE_EPOCH=1789094400 pnpm check`, Playwright Chromium (or documented fallback), `git status --short`, `git diff --check`.
6. Confirm no `verified_primary` claim lacks primary evidence; no open conflict produces `tepat`; no commit/push/deploy.

## Report

Write `.superpowers/sdd/task-11-report.md` with changed files, E2E results (or fallback documentation), and concerns. Return only status/tests/concerns.
