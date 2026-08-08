# Task 1 Report — Fondasi Test dan Pipeline Deterministik

## Status

DONE_WITH_CONCERNS

## Files changed

Task 1 source/config/tests:
- `.gitignore`
- `package.json`
- `pnpm-lock.yaml`
- `tsconfig.json`
- `vitest.config.ts`
- `src/paths.ts`
- `src/core/release.ts`
- `src/validation/ajv.ts`
- `src/validation/load.ts`
- `src/validation/report.ts`
- `src/pipeline.ts`
- `src/validate.ts`
- `src/generate.ts`
- `src/sync-website.ts`
- `src/build.ts`
- `src/build-api.ts`
- `tests/unit/release.test.ts`
- `tests/unit/temporal-bounds.test.ts`
- `tests/unit/ajv-formats.test.ts`
- `tests/unit/load-order.test.ts`
- `tests/contracts/artifact-sync.test.ts`
- `tests/contracts/release-metadata.test.ts`
- `website/pnpm-workspace.yaml`
- `pnpm-workspace.yaml`

Generated artifacts were regenerated and synchronized under `public/` and `website/public/`, including `generated-manifest.json`, `release.json`, aggregate v1 files, and API v1 files.

## RED

Command:

`./node_modules/.bin/vitest run tests/unit/release.test.ts tests/contracts/artifact-sync.test.ts`

Result: expected failure. Both suites failed with module-not-found errors for `src/core/release.js` and `src/sync-website.js`; no tests executed because production modules did not exist.

The initially requested `pnpm vitest ...` route was blocked by pnpm's ignored-build policy for esbuild before Vitest execution. Running the installed Vitest binary directly captured the intended feature-missing RED.

## GREEN

Focused command:

`pnpm --dir E:/kantor_archisight/tarifpajak/tarifpajakmcp exec vitest run tests/unit/release.test.ts tests/contracts/artifact-sync.test.ts`

Result: 2 files passed, 2 tests passed.

Release metadata contract:

`pnpm --dir E:/kantor_archisight/tarifpajak/tarifpajakmcp exec vitest run tests/contracts/release-metadata.test.ts`

Result: 1 file passed, 1 test passed.

Full fixed-epoch pipeline:

`SOURCE_DATE_EPOCH=1704067200 pnpm --dir E:/kantor_archisight/tarifpajak/tarifpajakmcp run build`

Result: source validation passed; deterministic v1 aggregates and 440 API v1 files generated; root/website sync completed; Astro built 21 pages; contract tests passed (2/2).

Repeatability check:

Ran the same fixed-epoch build twice and compared `public/generated-manifest.json` with `cmp`; result `manifest-identical`.

Final full test command:

`pnpm --dir E:/kantor_archisight/tarifpajak/tarifpajakmcp exec vitest run`

Result: 3 files passed, 3 tests passed.

Final whitespace check:

`git -C E:/kantor_archisight/tarifpajak/tarifpajakmcp diff --check`

Result: exit 0 after trimming trailing whitespace in generated `llms.txt` copies.

## Decisions

- Windows-safe project paths use `fileURLToPath(new URL(..., import.meta.url))` and absolute joined paths.
- Release metadata uses one `ReleaseContext`; fixed `SOURCE_DATE_EPOCH` controls the timestamp, and SHA-256 hashes sorted relative source paths plus bytes.
- Generation writes only to `.staging/public`; manifest-based sync copies generated files byte-for-byte to both public roots and removes only files listed in the prior generated manifest, preserving manual website assets such as `favicon.svg`.
- Existing aggregate and API v1 logic was consolidated into `src/generate.ts`; `src/build.ts` and `src/build-api.ts` are thin wrappers, avoiding divergent generators.
- OpenAPI calculator/consolidated path nesting was repaired. Year generation, temporal statistics, and OpenAPI year bounds are derived from source entries rather than hard-coded 1984–2026.
- pnpm native scripts are explicitly allowlisted only for `esbuild` and `sharp`. With installed pnpm 11, `website/pnpm-workspace.yaml` `allowBuilds` successfully ran only those required packages.

## Concerns

- AJV date/URI format warning was resolved in the review-fix section below.
- Root pnpm invocation behavior in this environment can be affected by the parent directory/workspace wrapper; verification used explicit `pnpm --dir E:/.../tarifpajakmcp` commands. The root scripts themselves execute successfully in the target project.
- Generated artifacts create a large working-tree diff, expected from replacing nondeterministic timestamps and syncing the complete manifest-managed API set.
- No commit, push, deploy, branch creation, or git-history operation was performed.

---

## Review Fix Report — Critical/Important Findings

### Exact status

DONE_WITH_CONCERNS

### Additional files changed

- `pnpm-workspace.yaml` (repository boundary and pnpm 11 `allowBuilds` restricted to `esbuild` and `sharp`)
- `pnpm-lock.yaml` (now includes `vitest`, `ajv-formats`, and their complete dependency graph)
- `package.json` (adds `ajv-formats`; moves pnpm 11 settings to workspace config)
- `src/core/release.ts` (tested temporal horizon derivation)
- `src/validation/ajv.ts` (shared AJV factory with registered formats)
- `src/validate.ts` and `src/generate.ts` (shared AJV factory)
- `src/generate.ts` (sorted filesystem and derived collections; corrected year horizon)
- `tests/unit/temporal-bounds.test.ts`
- `tests/unit/ajv-formats.test.ts`
- `tests/unit/load-order.test.ts`
- regenerated manifest-managed artifacts in `public/` and `website/public/`

### Review-fix RED evidence

Command:

`pnpm --dir E:/kantor_archisight/tarifpajak/tarifpajakmcp exec vitest run tests/unit/temporal-bounds.test.ts tests/unit/ajv-formats.test.ts tests/unit/load-order.test.ts`

Result: expected RED. Temporal test failed because `deriveTemporalBounds` did not exist; AJV suite failed because `src/validation/ajv.ts` did not exist. The pre-existing sorted async loader test passed, confirming that path was already deterministic while generation still required explicit sorting.

### Review-fix GREEN evidence

Focused tests:

`pnpm exec vitest run tests/unit/temporal-bounds.test.ts tests/unit/ajv-formats.test.ts tests/unit/load-order.test.ts`

Result: 3 files passed, 4 tests passed. Tests prove open-ended 2025 entries and the 2026 release horizon, impossible/malformed date rejection, malformed URI rejection, and stable lexical loading across different file creation orders.

Clean frozen install:

`rm -rf node_modules && pnpm install --frozen-lockfile`

Result: exit 0 from a genuinely absent root `node_modules`; installed `ajv 8.20.0`, `ajv-formats 3.0.1`, `typescript 5.9.3`, and `vitest 3.2.7`. Native build policy remains repository-scoped to only `esbuild` and `sharp` in `pnpm-workspace.yaml` (and the same explicit website policy remains in `website/pnpm-workspace.yaml`).

Full tests and validation:

`pnpm test && pnpm validate`

Result: 6 files passed, 7 tests passed; source validation passed with no ignored-format warnings.

Deterministic pipeline:

`SOURCE_DATE_EPOCH=1785974400 pnpm build` run twice, copying and comparing `public/generated-manifest.json` with `cmp`.

Result: both builds passed validation, generation, sync, Astro (21 pages), and 2 contract tests; manifests were byte-identical. `public/api/v1/by-year/2025.json` exists. OpenAPI maximum is 2026 for the selected release epoch and stats report `{ from: "1984-01-01", to: null }` because the dataset contains open-ended entries.

Independent Astro verification:

`pnpm build:site`

Result: exit 0; 21 pages built.

Whitespace verification:

`git diff --check`

Result: exit 0 after making `llms.txt` generation trim line-end whitespace deterministically.

### Decisions and remaining concerns

- All synchronous and asynchronous JSON directory reads are lexically sorted. BPPU prefixes/codes, search tokens, keyword keys, and keyword ID lists are explicitly sorted before serialization.
- The maximum output year is the maximum of source start years, finite end years, and release year when any entry is open-ended. This includes rules beginning in 2025 and gives a bounded deterministic release horizon instead of attempting unbounded year generation.
- `ajv-formats` is registered through one shared factory used by both validation and generation.
- The repository-level `pnpm-workspace.yaml` prevents accidental adoption of the unrelated parent package and gives pnpm 11 a supported repository-scoped allowlist.
- Generated artifact changes remain large by design because both public roots are synchronized from the manifest-managed staging tree.
- No commit, push, deploy, branch creation, or git-history operation was performed.


---

## Manifest Path Security Fix Report

### Status

DONE_WITH_CONCERNS

### Files changed

- `src/sync-website.ts`: added shared safe manifest path resolver and strict manifest structure/metadata validation before generated-file removal.
- `tests/contracts/artifact-sync.test.ts`: added traversal, POSIX absolute, Windows absolute, malformed manifest, and outside-sentinel regression tests.
- `src/generate.ts`: ensured generated `llms.txt` trims trailing whitespace.
- regenerated `public/` and `website/public/` manifest-managed artifacts.

### TDD evidence

RED command: `pnpm exec vitest run tests/contracts/artifact-sync.test.ts`

Result: 5 of 6 tests failed as expected. Unsafe paths and malformed manifests were accepted by the old implementation.

GREEN command: `pnpm exec vitest run tests/contracts/artifact-sync.test.ts`

Result: 6 tests passed; outside sentinel files remained unchanged for every unsafe path.

### Implementation decisions

Manifest paths must be non-empty strings, normalized relative slash-separated segments, contain no empty/dot/dot-dot segments, and reject POSIX or Windows absolute paths. Destinations are resolved and checked with `relative` against the intended public root. Manifest entries require safe paths, 64-character lowercase SHA-256, and non-negative integer byte counts. Validation occurs before removal/copy operations.

### Verification

- Full `pnpm test`: 6 files, 12 tests passed.
- Fixed-epoch `SOURCE_DATE_EPOCH=1785974400 pnpm build`: source validation, generation, sync, Astro 21-page build, and 2 contract tests passed.
- Independent `pnpm build:site`: Astro built 21 pages.
- `git diff --check`: passed after deterministic whitespace trimming.
- No commit, push, deploy, branch creation, or git-history operation was performed.
