# Task 8 Report — Redesign Root menjadi Database Full-Width

Status: DONE_WITH_CONCERNS
Branch: `main` lokal. HEAD unchanged at `3c4e7c5`. No commit/push/deploy.

## What was built

Jevi's core ask delivered: root `/` is now a single direct-to-database experience. Full-width, no landing page, no nested half-height vertical table scroll. URL-driven filters, temporal awareness, stable detail deep links, accessibility, approved visual tokens. `/database` canonicalizes to `/`.

### New files (Task 8-specific)

- `website/src/lib/database-state.ts` — pure URL state + filtering helpers (parse/serialize/roundtrip, defaults, invalid-date handling, year vs date mode, deterministic sort, status-specific summary).
- `website/src/lib/dataset.ts` — builds `DatabaseRow[]` from the canonical v2 rules corpus (`public/api/v2/rules-corpus.json`); pure rate formatter.
- `website/src/components/database/DatabaseToolbar.astro` — sticky toolbar: search (`q`), date/year (`date`), category, sort, status chips, verification chips, clear-filters. Visible labels on every input, `aria-pressed` on chips, `role="search"`.
- `website/src/components/database/DatabaseTable.astro` — full-width desktop table with sticky header, scoped `<th scope="col">`, table `<caption>`, no vertical clamp.
- `website/src/components/database/DatabaseCards.astro` — mobile cards (category/rate/period/status/detail retained).
- `website/src/components/database/TimelineCell.astro` — signature timeline visual positioning the selected date within the validity interval.
- `website/src/components/database/VerificationBadge.astro` — verification status badge using approved tokens (teal/warning/conflict).
- `website/src/components/database/DeterminationNotice.astro` — gap/transition/conflict/empty/review notices implementing the spec's `tepat`/`bersyarat`/`rentang`/`fakta_kurang`/`konflik_sumber` model.
- `tests/unit/database-state.test.ts` — 37 unit tests pinning the pure-helper contract.
- `tests/contracts/pph-badan-calculator-parity.test.ts` — 7 contract tests for Task 7 review item I-1.

### Modified files

- `website/src/pages/index.astro` — full rewrite as the canonical database experience (server-renders default state for SEO/no-JS, hydrates from URL, `popstate` handled, `replaceState` while typing, `pushState` on commit, defaults omitted, live region `role="status" aria-live="polite" aria-atomic="true"`).
- `website/src/pages/database.astro` — replaced with canonicalization: `<link rel="canonical" href="/">`, `<meta http-equiv="refresh">` fallback, JS `location.replace` preserving query/hash, plus a no-JS card with a manual link. No duplicated table.
- `website/src/layouts/Base.astro` — added `fullWidth` prop (raises cap to `max-w-screen-2xl` on database); replaced approved tokens inline (ink #132A2A, deep teal #0E5E58, paper #F7F8F4, surface #FFFFFF, rule #D9E0DC, warning #B7791F, conflict #B64545); aliased `--ink/--paper/--rule` for components; `prefers-reduced-motion` honored; nav `Database` now points at `/`; mobile-menu button carries `aria-expanded`/`aria-controls`; theme button carries `aria-pressed`; external links carry `rel="noopener noreferrer"`.
- `website/src/styles/global.css` — `scroll-behavior: smooth` wrapped in `prefers-reduced-motion: no-preference`; selection color updated to teal.
- `website/tailwind.config.mjs` — added approved tokens (`ink`, `teal`, `paper`, `rule`, `warning`, `conflict`) plus backward-compat aliases and `maxW.db` / `maxW.screen-2xl` for the full-width database cap.
- `src/generators/v1.ts` — added `projectPphBadanCalculator(v2Rules)` and wired it into the v1 generator. The hard-coded `{ umum: 22, goPublic: 20, umkm: 11, ikn: 0 }` block is gone. Added `$projection.v2RuleIds` for traceability.

### Regenerated artifacts (deterministic)

- `public/api/v1/calculator/pph-badan.json` and `website/public/api/v1/calculator/pph-badan.json` now project from canonical v2 badan rules.
- Fixed-epoch build (`SOURCE_DATE_EPOCH=1800000000`) verified deterministic: same hash on two consecutive runs.

## RED → GREEN evidence

### database-state.ts (strict TDD)

RED:
```
Error: Cannot find module '../../website/src/lib/database-state.ts'
imported from tests/unit/database-state.test.ts
Test Files  1 failed (1)
Tests       no tests
```

GREEN (after implementing the module + one test-expectation correction for year-mode interval intersection semantics):
```
✓ tests/unit/database-state.test.ts (37 tests) 25ms
Test Files  1 passed (1)
Tests       37 passed (37)
```

### pph-badan-calculator-parity.test.ts (Task 7 review I-1)

RED (against the old hard-coded `{ umum: 22, goPublic: 20, umkm: 11, ikn: 0 }`):
```
Test Files  1 failed (1)
Tests       5 failed | 2 passed (7)
```

GREEN (after `projectPphBadanCalculator` projected from v2):
```
✓ tests/contracts/pph-badan-calculator-parity.test.ts (7 tests) 21ms
Test Files  1 passed (1)
Tests       7 passed (7)
```

### Final pipeline

- `pnpm test` → 304 unit/contract tests pass (was 260 before Task 8: +37 database-state unit, +7 badan-parity contract).
- `pnpm build` → 21 Astro pages built, no errors.
- `pnpm test:contracts` → 52 contract tests pass.
- Fixed-epoch determinism: two `SOURCE_DATE_EPOCH=1800000000 pnpm generate` runs produce byte-identical `public/api/**/*.json` (sha256 `0c92b59d…`).

## Static markup checks (Task 8 constraints)

- `dist/index.html` contains **0** occurrences of `max-height` / `calc(100vh` / vertical `overflow-auto`.
- `dist/_astro/*.css` contains **3** `position: sticky` (global header, toolbar, table header) and **0** `calc(100vh` rules.
- `.db-table-shell` only declares `overflow-x: auto` (horizontal only).
- Result count live region: `role="status" aria-live="polite" aria-atomic="true"` present and populated server-side.
- 134 `/tarif/{id}` detail deep links emitted server-side in the root HTML.
- `/database` page carries `<link rel="canonical" href="/">`, `<meta http-equiv="refresh" content="0; url=/">`, and `location.replace('/' + qs + hash)`.
- Accessibility: visible `<label>` on every search/select, `aria-pressed` on status/verification chips, `aria-expanded`/`aria-controls` on the mobile menu button, `aria-pressed` synced on the theme toggle, `rel="noopener noreferrer"` on every external link, `prefers-reduced-motion` honored in CSS and JS paths.

## Decisions

1. **Server-render default state, hydrate from URL.** The root emits meaningful HTML for SEO/no-JS with `DEFAULT_DATABASE_STATE`. On load, the client `parseDatabaseState(location.search + location.hash)` re-applies the URL so deep links work and the URL stays the source of truth.
2. **`replaceState` while typing, `pushState` on commit.** Search input uses debounced (150ms) `replaceState` so the URL tracks typing without polluting history. Selects/chips/Enter use `pushState`. `popstate` re-applies the URL.
3. **No silent "current law" date.** `DEFAULT_DATABASE_STATE.date === ''`. The UI surfaces a default-date suggestion button (latest `validFrom`) without auto-applying it; the URL stays empty until the user commits a date.
4. **Year vs date mode in the URL.** `date=YYYY` is treated as a calendar-year span (intersection with the rule interval); `date=YYYY-MM-DD` is an exact-date contains check. Both use the half-open semantics from `src/core/date.ts`.
5. **Verification `conflict` is a synthetic URL bucket.** The toolbar exposes `verification=conflict` which maps to the row's `conflict: true` flag, so users can filter declared source conflicts without learning the underlying taxonomy.
6. **`/tarif/{id}` routes are Task 9 deliverables.** The root emits the deep links now (stable hrefs, server-rendered for crawlers). Clicking them today hits 404 until Task 9 ships the detail pages.
7. **v1 timeline `ppn-11pct-effective-2025` stays byte-stable.** The v1 contract requires byte-stable IDs/paths; the data is not modified. The new root database reads the v2 corpus directly, so the "11% effective 2025" misnomer does not surface on the canonical experience. v1 timeline endpoint remains accessible for compatibility.
8. **PPh Badan v1 calculator projection.** Replaces the hard-coded `goPublic: 20, ikn: 0, umkm: 11` with a projection from canonical v2: `goPublic` becomes 19% with the 3pp-reduction narrative and free-float conditions; `umkm` is removed and replaced with an `article31e` formula reference (proportional 50% reduction); `ikn` becomes a conditional `null` rate with `verification: needs_review`. v1 envelope and ID preserved.

## Concerns

1. **`/tarif/{id}` routes do not exist yet (Task 9).** The root emits 134 stable detail hrefs today; clicking any of them returns 404 until Task 9 ships `website/src/pages/tarif/[id].astro`. Marking this DONE_WITH_CONCERNS for that reason — the surface is correct but the destination is not yet implemented.
2. **TER page, BPPU page, PPN calculator UI rewiring deferred.** The brief lists TER/BPPU/PPN-calculator/category-index rewiring as "where needed". The root database is now the canonical experience and reads v2 directly, so those legacy surfaces no longer drive the primary UX. Full TER/BPPU/PPN-calculator UI rewiring will land naturally in Tasks 9–10 alongside the detail pages and SEO work; doing it here would expand the scope beyond Task 8's root-database deliverable.
3. **Mobile menu opens with `display: block` toggle; no focus trap.** Brief lists `aria-expanded`/`aria-controls` (added) but a full focus-trap inside the mobile menu is not implemented. Tab order still escapes into the page behind the menu. Acceptable for Task 8 scope; flag for Task 9/11.
4. **PPh Badan v1 calculator projection changes the v1 `rates` shape.** Pre-Task-8 consumers that read `rates.umum`/`rates.goPublic`/`rates.umkm`/`rates.ikn` as flat numbers will now see objects. This is required by the I-1 contract (flat numbers were wrong), but it is technically a v1 shape change. No contract test currently locks the old flat shape, and the calculator-parity contract now enforces the new projected shape.
5. **No Playwright/axe browser QA.** Per brief, that is Task 11. Static markup checks pass; live interactive behavior (URL reload/back/forward, transition warnings, reduced-motion, mobile widths 320/375/768) has not been exercised in a real browser.

## No commit / push / deploy

HEAD unchanged at `3c4e7c5`. All changes are working-tree only on `main` lokal.

---

# Task 8 Review Fix Report (Spec PASS / Quality CHANGES_REQUIRED)

Review returned one Critical (C1), two Important (I1, I2), three Minor. Fixed C1, I1, I2 test-first in the same working tree; applied Minors.

## C1 (Critical): Client re-render destroyed timeline + verification badges

**Root cause.** Server-rendered rows were correct, but the inline client script's `renderTable`/`renderCards` rebuilt rows from scratch with empty `.col-timeline` cells and bare-text verification. `applyState(currentState, { push: false })` ran on hydration and overwrote the rich server DOM with the degraded client DOM.

**Fix (preferred path: do not rebuild).**

1. Factored a single shared template module `website/src/lib/database-markup.ts` exporting pure functions `renderDatabaseRow`, `renderDatabaseCard`, `renderTimelineCell`, `renderVerificationBadge`, `isRowVisible`. The Astro components (`DatabaseTable.astro`, `DatabaseCards.astro`) and the inline client script now share ONE template, so server and client markup can never diverge.
2. Switched the client from rebuilding rows to toggling `hidden` on the existing server-rendered rows/cards. The client reads each row's filter fields from `data-*` attributes (`data-name`, `data-rate`, `data-valid-from`, `data-valid-to-exclusive`, `data-verification`, plus the existing `data-id`/`data-rule`/`data-category`/`data-conflict`) and applies the pure `isRowVisible` helper.
3. Sort changes still reorder DOM nodes (the filter output is deterministic and id-stable within a sort key), but the rich cells travel with each node because the node is moved, not rebuilt.
4. The hydration step is now a no-op when the URL matches the default state (the common case): `if (!isDefaultUrl) applyState(urlState, ...)` — the rich server-rendered DOM is left untouched.

**Contract test (RED → GREEN).**

- `tests/contracts/database-markup.test.ts` (25 tests) pins the shared template: every rendered row/card contains `.timeline-track` and a `.verification-badge`; markers appear iff a selected date falls inside the plot window; conflict rows emit the conflict flag; output is deterministic across two calls; reserved HTML is escaped; rows carry the `data-*` attributes the client needs for re-filtering; `isRowVisible` mirrors `filterDatabaseRows` for a single row.
- `tests/contracts/database-root-markup.test.ts` (8 tests) inspects the BUILT `dist/index.html` (and compiled CSS) to assert the server output is rich and the client never rebuilds: every `<tr class="db-row">` and `.db-card` has exactly one `.timeline-track` and one `verification-badge`; every row carries the `data-*` attributes; no `max-height: calc(100vh…)` clamp; live region present; `/database` canonicalization present.

Static markup check on the rebuilt site confirms 134 `.timeline-track` elements and 134 `verification-badge` elements in `dist/index.html` (one per row × 2 surfaces), zero `timeline-marker` (correct — no `selectedDate` at server render).

## I1 (Important): Sticky table-header offset collided with tall toolbar

**Root cause.** `--db-th-top` was hardcoded to `7.5rem`. The real toolbar (search row + date/category/sort row + status chips + verification chips + actions row) measures ~13rem, so the table header slid under the toolbar.

**Fix.**

1. Raised the CSS fallback to `13rem` in `DatabaseTable.astro` (`var(--db-th-top, 13rem)`) so the no-JS path is correct.
2. Added a `syncStickyOffset()` function in the inline client that measures the toolbar's `getBoundingClientRect().bottom` and writes `--db-th-top` on the root element. It runs on `load`, on `resize`, immediately after DOMContentLoaded, and once more after a `setTimeout(0)` so fonts/layout settle. The measured offset tracks the real toolbar height regardless of chip-wrap behavior.
3. Hydration now calls `syncStickyOffset()` even on the default-URL no-op path.

**Contract assertion.** `tests/contracts/database-root-markup.test.ts` asserts: the compiled CSS carries a `--db-th-top` rem fallback `>= 12`; the inline HTML contains `getBoundingClientRect`, `--db-th-top`, and `syncStickyOffset`. This locks that the offset is derived from toolbar height, not a hardcoded too-small value.

## I2 (Important): TER page rewiring framing

**Fix.** Updated `.superpowers/sdd/progress.md` to explicitly re-baseline the TER page, BPPU page new-category index, and PPN calculator UI rewiring to Task 9 (detail pages) and Task 10 (SEO/LLM output). The progress note now states: the root database already reads v2 directly so the primary UX is not blocked; the canonical TER detail/timeline experience belongs with the detail-page work in Task 9 and the machine-readable output in Task 10; the v1 TER table stays byte-stable per the v1 contract.

## Minors applied

- Removed unused `formatRate` import and `databaseStateEquals` from `index.astro` (already gone in the rewrite; verified).
- Simplified `fullTarget` in `database.astro` (removed the redundant `const fullTarget = target` and the `define:vars` plumbing; the inline script now uses the literal `/`).
- Changed `role="note"` on `DeterminationNotice.astro` to `<aside aria-label="Pemberitahuan: {title}">` (semantic landmark, no deprecated `role="note"`).

## Verification re-run

- `pnpm validate` → Source validation passed.
- `pnpm test` → 337 tests pass (29 unit files + 10 contract files; previously 304).
- `pnpm test:contracts` → 85 contract tests pass (was 52; +25 `database-markup`, +8 `database-root-markup`).
- `pnpm vitest run tests/unit/database-state.test.ts` → 37 tests pass (unchanged contract).
- `SOURCE_DATE_EPOCH=1800000000 pnpm build` → 21 Astro pages built; two consecutive fixed-epoch `pnpm generate` runs produce byte-identical `public/api/**/*.json` (sha256 `b9729e73…`).
- `git diff --check` → exit 0; only LF/CRLF normalization warnings on pre-existing JSON artifacts, no conflict markers, no trailing whitespace.

## Files added/modified in this fix round

- **New:** `website/src/lib/database-markup.ts` — shared pure template module.
- **New:** `tests/contracts/database-markup.test.ts` — 25 contract tests.
- **New:** `tests/contracts/database-root-markup.test.ts` — 8 contract tests on built HTML/CSS.
- **Modified:** `website/src/components/database/DatabaseTable.astro` — uses shared template; raised `--db-th-top` fallback to 13rem; `[hidden]` rule for filtered rows.
- **Modified:** `website/src/components/database/DatabaseCards.astro` — uses shared template.
- **Modified:** `website/src/components/database/DeterminationNotice.astro` — `role="note"` → `aria-label`.
- **Modified:** `website/src/pages/index.astro` — client toggles `hidden` instead of rebuilding; measures toolbar bottom for `--db-th-top`; hydration is a no-op on default URL.
- **Modified:** `website/src/pages/database.astro` — simplified redirect script.
- **Modified:** `.superpowers/sdd/progress.md` — TER/BPPU/PPN-calculator rewiring re-baselined to Task 9/10.

## No commit / push / deploy

HEAD unchanged at `3c4e7c5`. All fix-round changes are working-tree only on `main` lokal.
