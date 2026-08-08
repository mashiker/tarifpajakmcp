# Task 1 Brief — Fondasi Test dan Pipeline Deterministik

Repository: `E:\kantor_archisight\tarifpajak\tarifpajakmcp`
Branch: `main` lokal. User explicitly requires working in place on main.

Read first:
- `docs/superpowers/specs/2026-08-06-tarif-pajak-temporal-redesign-design.md`
- `docs/superpowers/plans/2026-08-06-tarif-pajak-temporal-redesign-plan.md`, Task 1 and Global Constraints.

## Deliverable

Implement Task 1 only, test-first:

- Add Vitest foundation.
- Add Windows-safe paths using `fileURLToPath`.
- Add one deterministic release context and canonical sorted input hashing.
- Add deterministic source loading/report foundations.
- Repair root scripts (`validate`, `generate`, full pipeline) without maintaining two divergent generators.
- Add staging/manifest based generated artifact sync between root `public` and `website/public`.
- Fix malformed OpenAPI path construction and remove hard-coded year range/statistics where Task 1 requires it.
- Preserve manually maintained website assets.
- Make baseline data build work on Windows.
- Address pnpm ignored native build scripts through a repository-scoped, explicit allowlist only for required transitive packages (`esbuild`, `sharp`), if supported by the installed pnpm; do not globally weaken supply-chain policy.

## Files

Create or modify exactly the Task 1 files in the plan. Lockfiles may change for Vitest.

## TDD contract

1. Write failing tests first.
2. Run them and record expected RED output.
3. Implement minimal behavior.
4. Run focused tests and build.
5. Do not commit, push, deploy, create a branch, or modify Git history.

## Known baseline failures

- Root `pnpm build` fails with `ENOENT ... E:\\E:\\...` from `new URL(...).pathname`.
- Website install/build fails `ERR_PNPM_IGNORED_BUILDS` for `esbuild@0.25.12`, `esbuild@0.27.7`, `sharp@0.34.5`.

## Report

Write full report to `.superpowers/sdd/task-1-report.md` containing:
- files changed;
- RED commands/results;
- GREEN commands/results;
- decisions and concerns;
- exact final status.

Return only: status (`DONE`, `DONE_WITH_CONCERNS`, `NEEDS_CONTEXT`, `BLOCKED`), one-line test summary, and concerns.
