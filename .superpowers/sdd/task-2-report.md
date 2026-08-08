# Task 2 Report — Temporal Model, Rate Types, Conditions, Semantic Validation

## Status
DONE_WITH_CONCERNS

## Changed files
- `src/core/types.ts`
- `src/core/date.ts`
- `src/core/conditions.ts`
- `src/core/rate.ts`
- `src/validation/semantic.ts`
- `data/schema/v2/source.schema.json`
- `data/schema/v2/rule.schema.json`
- `data/schema/v2/concept.schema.json`
- `data/v2/categories.json`
- `data/v2/concepts.json`
- `data/v2/sources.json`
- `data/v2/conflicts.json`
- `tests/unit/date.test.ts`
- `tests/unit/conditions.test.ts`
- `tests/unit/rate.test.ts`
- `tests/unit/semantic-validation.test.ts`

## RED/GREEN evidence
- RED: `./node_modules/.bin/vitest run tests/unit/date.test.ts tests/unit/conditions.test.ts tests/unit/rate.test.ts tests/unit/semantic-validation.test.ts` failed with expected module-not-found errors for the new production modules.
- GREEN: focused suite passed: 4 files, 7 tests.
- Full suite passed: 10 files, 19 tests.
- `node --experimental-strip-types src/validate.ts` passed (`Source validation passed`).
- `pnpm build` passed: deterministic pipeline, Astro 21-page build, and contract tests (2 files, 7 tests).
- `git diff --check` passed (Git emitted only expected line-ending warnings).

## Design decisions
- Dates use strict ISO calendar validation and half-open intervals; percentages/rates use decimal strings and progressive calculations use integer scaled arithmetic.
- Conditions return true/false/unknown and collect sorted missing facts.
- Semantic reports reuse the existing stable report sorter and include duplicate IDs, missing foreign keys, primary-evidence requirements, and exclusive overlap checks.
- V2 bootstrap data is intentionally empty to avoid tax-law migration in Task 2.

## Concerns
- This is a minimal Task 2 model and does not yet include the full resolver/API v2, tax-law data corrections, or every validator rule listed in the broader design; those belong to later tasks.
- Source schema currently requires primary metadata fields but semantic validation accepts the minimal bootstrap arrays; source official-source semantics should be expanded with populated Task 4–7 datasets.
- Generated pipeline artifacts changed as a consequence of the approved Task 1 build; no commit, push, deploy, branch, or history operation was performed.

---

# Task 2 Review Fix Report

## Status
DONE

## Review findings addressed
Spec FAIL / Quality CHANGES_REQUIRED with five Critical and three Important findings, all fixed test-first in the same working tree. No resolver/API v2 (Task 3) or tax-data migration (Tasks 4–7) was implemented.

## Files changed (this fix pass)
Production code:
- `src/core/types.ts` — expanded to `Source` (official/role/regulationId/locator), `Verification`, `EvidenceRef`, `Conflict`, `ConflictKind`, `Example`, `BppuCode`, and the `V2Data` envelope including optional `conflicts` and `bppu`.
- `src/core/date.ts` — added `isValidDate` and `isValidInterval` guards; kept pure helpers throwing only when used directly on trusted inputs.
- `src/core/conditions.ts` — reimplemented `and`/`or`/`not` with correct short-circuit semantics and missing-fact aggregation that only reports facts that could change the outcome.
- `src/core/rate.ts` — replaced all binary-float arithmetic with string-shift integer scaled helpers (`toScaledInt`/`fromScaledInt`/`renderCents`/`formatPercent`/`formatGrouped`); `calculateProgressive` now validates bracket structure independently of the income value and renders fixed 2-decimal currency.
- `src/validation/semantic.ts` — full rewrite: duplicate IDs, concept/category/rule/BPPU foreign keys, supersession cycle detection (DFS), invalid half-open intervals reported as issues (never thrown), exclusive-group overlap with declared-conflict suppression, malformed progressive brackets, invalid examples, `verified_primary` evidence requirements (official source, regulation ID + locator, rate/interval/condition coverage, evidence `sourceId` resolution, conflict-cannot-be-exact), conflict rule FK checks.
- `src/validation/schema.ts` — new module compiling v2 source/rule/concept schemas via the shared AJV factory.
- `src/validate.ts` — pipeline now loads `data/v2/*.json`, runs v2 schema validation and `validateV2Loaded` semantic validation, and merges every issue into the single stable report. Exports `validateV2FromDisk` and re-exports `validateV2Loaded` for tests.
- `src/generate.ts` — fixed `llms.txt` line-trimming split (`'\n'` instead of the previous `'\\n'` literal) so `git diff --check` is clean after regeneration.

Schemas:
- `data/schema/v2/source.schema.json`, `rule.schema.json`, `concept.schema.json` — tightened with required fields and the full discriminated `rate`/`condition` `$defs`.
- `data/schema/v2/category.schema.json`, `conflict.schema.json`, `bppu.schema.json` — new.

Bootstrap fixtures (synthetic, illustrative, non-primary):
- `data/v2/categories.json`, `concepts.json`, `sources.json`, `bppu.json`, `rules.json`, `conflicts.json` — populated with realistic fixtures exercising sequential supersession, progressive brackets with a worked example, a `verified_primary` rule with complete evidence, two `source_conflict` rules with a declared conflict, and BPPU references. All marked "Illustrative only. Not a real Indonesian tax rate."

Tests:
- `tests/unit/date.test.ts` — boundary tests for `overlaps` (adjacent, non-overlapping, two open-ended, identical) and `yearSegments` (non-intersecting throw, null-end spanning), plus `isValidDate`/`isValidInterval`.
- `tests/unit/conditions.test.ts` — tri-state `and`/`or`/`not` including short-circuit and unknown propagation with missing-fact aggregation.
- `tests/unit/rate.test.ts` — decimal-safe `formatPercent('0.07')`/`formatPercent('0.11')`, every rate variant, progressive edge/ordering/zero-width/open-not-last rejection.
- `tests/unit/semantic-validation.test.ts` — full coverage of all five Critical validators (verified_primary evidence, declared vs undeclared conflict, supersession cycles, BPPU FK, invalid intervals, progressive brackets, invalid examples, conflict rule FKs).
- `tests/unit/schema-v2.test.ts` — new; proves `compileV2Schemas` compiles and accepts/rejects source/rule documents.
- `tests/contracts/v2-validation.test.ts` — new; proves `validateSources()` runs v2 validation end-to-end and that `validateV2Loaded` surfaces v2 issues for malformed data.

## RED evidence
Command:
`./node_modules/.bin/vitest run tests/unit/date.test.ts tests/unit/conditions.test.ts tests/unit/rate.test.ts tests/unit/semantic-validation.test.ts tests/unit/schema-v2.test.ts tests/contracts/v2-validation.test.ts`

Result: expected RED. 5 files failed, 12 tests failed with `Object.is` assertion failures (semantic validators not yet implemented, schema module not yet present, pipeline `validateV2Loaded` not exported) while 10 already-passing assertions confirmed the test harness was wired correctly.

## GREEN evidence
Focused suite:
`./node_modules/.bin/vitest run tests/unit/date.test.ts tests/unit/conditions.test.ts tests/unit/rate.test.ts tests/unit/semantic-validation.test.ts tests/unit/schema-v2.test.ts tests/contracts/v2-validation.test.ts`
Result: 6 files passed, 25 tests passed.

Full suite:
`./node_modules/.bin/vitest run`
Result: 12 files passed, 37 tests passed.

`pnpm validate` (i.e. `node --experimental-strip-types src/validate.ts`):
Result: `Source validation passed` — the pipeline now runs v2 schema + semantic validation against the committed fixtures.

Fixed-epoch build:
`SOURCE_DATE_EPOCH=1785974400 pnpm build`
Result: source validation passed; v1 aggregates and 442 API v1 files generated; root/website sync completed; Astro built 21 pages; contract tests passed (3 files, 9 tests including `tests/contracts/v2-validation.test.ts`).

Independent Astro build:
`pnpm build:site`
Result: exit 0; 21 pages built.

Whitespace verification:
`git diff --check`
Result: exit 0 (clean) after fixing the `llms.txt` generator split so per-line `trimEnd` actually applies.

## Design decisions
- `verified_primary` is gated on: at least one referenced source that resolves and is `official === true`; that (or another referenced) source carries a non-empty `regulationId` and `locator`; and evidence covers `rate`, `interval`, and `condition` claims with each evidence `sourceId` resolving to a known source. Each missing piece is its own issue code so failures are diagnosable.
- Declared `source_conflict` rules remain publishable but never resolve as exact: a `verified_primary` rule that participates in a declared conflict emits `conflict_cannot_be_exact`. Undeclared contradictions within the same `exclusiveGroup` whose pair is not listed in `conflicts.json` emit `exclusive_overlap`.
- Supersession cycles are detected via depth-first traversal of `supersedes` and reported per participating rule; unknown supersession references emit `missing_foreign_key` separately.
- All malformed inputs (bad dates, inverted intervals, bad progressive brackets, missing example fields) are reported as stable issues rather than thrown, so one bad record cannot abort the whole build.
- Rate math uses integer scaled arithmetic exclusively: currency at 2 decimal places, rate fractions at 4, with a dedicated fixed-precision currency renderer for progressive output.
- Condition missing-fact aggregation only reports facts that could still change the outcome: a definitive `false` in an `and` (or `true` in an `or`) yields an empty `missingFacts` list because no further fact can overturn it.
- v2 bootstrap fixtures are explicitly synthetic and labelled illustrative/non-primary so the model is exercisable without performing tax-law migration reserved for Tasks 4–7.

## Concerns
- The v2 fixture data is synthetic and intentionally not tax law; real source/rule/concept/BPPU/conflict migration belongs to Tasks 4–7 and will expand coverage of the validator rules added here.
- The `src/generate.ts` split fix touches a Task 1 generator line; it is a one-character correctness fix (`'\\n'` -> `'\n'`) that makes Task 1's already-claimed per-line trimming actually take effect, and it is required for a clean `git diff --check` after regeneration. No other Task 1 behavior was changed.
- Resolver/API v2 generation, search index, and OpenAPI for v2 remain out of scope (Task 3).
- No commit, push, deploy, branch creation, or git-history operation was performed.
