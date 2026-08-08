# Task 11 Report — Browser QA, Accessibility, and Final Release Gate

> **Tanggal**: 2026-08-08
> **Status**: ✅ DONE_WITH_CONCERNS (see Concerns — all gate-blocking issues found by the gate have been fixed in-scope)
> **Branch**: `main` lokal. **No commit / push / deploy / branch / history changes.**

## Deliverables

1. **Playwright config** — `website/playwright.config.ts`
   - Two Chromium-only projects: `chromium-desktop` (canonical E2E + a11y + detail) and `chromium-mobile-375` (mobile.spec.ts, emulated viewport/touch/UA — *not* the WebKit iPhone preset, which would force a second browser binary).
   - `webServer` block auto-starts `astro preview --port 4321 --host 127.0.0.1`, `reuseExistingServer` off in CI, 120s timeout.
   - `reducedMotion: 'reduce'` + `colorScheme: 'light'` for deterministic a11y/mobile assertions.
   - `test:e2e` script added to `website/package.json`.

2. **E2E test files** — `website/tests/e2e/`
   - `database.spec.ts` (15 tests): root direct-open, no internal vertical DB scrollbar (max-height none + no `calc(100vh)` in any stylesheet + body scrolls the full result set), URL filter init/update/reload/back-forward, clear button, exact-date + year-span modes, year transition narrows results, invalid date collapses to empty, empty-state determination notice, detail deep-link.
   - `detail.spec.ts` (7 tests): h1/breadcrumb/kronologi, per-rule timeline + verification badge + status label, sources, status-at-date re-evaluation (input + clear), predecessor/successor same-page anchor scroll, unknown-id 404.
   - `accessibility.spec.ts` (7 tests): axe-core gate (no serious/critical) on `/`, `/tarif/concept-illustrative-flat`, `/ter-pph-21`, `/kode-objek-pajak`, `/api-docs`, plus keyboard-reachable toolbar chips and labelled detail date input.
   - `mobile.spec.ts` (12 tests): no horizontal overflow at 320/375/768/1280 for both root and detail; mobile-card layout visible at 375 with category/rate/period/verification/detail-link parity; desktop table visible at 1280; reduced-motion honoured on detail + root.

3. **Dependencies added** — `website/package.json`
   - `playwright@1.61.0` (devDep)
   - `@playwright/test@1.61.0` (devDep) — needed; `defineConfig`/`devices`/`test`/`expect` come from the runner package, not the `playwright` browser-driver package.
   - `@axe-core/playwright@^4.12.1` (devDep)

4. **Chromium browser binary** — installed successfully via `pnpm --dir website exec playwright install chromium`. Browser is at `%LOCALAPPDATA%/ms-playwright/chromium-1228` (Chrome for Testing 149.0.7827.55). No sandbox/network limitation hit.

## E2E Results

```
$ pnpm --dir website exec playwright test
  41 passed (14.5s)
```

Breakdown: 29 `chromium-desktop` (database 15, detail 7, accessibility 7) + 12 `chromium-mobile-375` (mobile 12).

## Critical findings surfaced by the gate (and fixed in-scope)

The Task 11 gate's job was to find production bugs that the 455 unit/contract tests (which validate static markup, not live hydration) could not catch. It surfaced four real production defects, all fixed so the gate passes:

### F1. Client hydration completely broken in production (Task 8 carry-over)
`website/src/pages/index.astro` shipped the database hydration as an `is:inline` `<script>` that used `import('/src/lib/database-state.ts')` / `import('/src/lib/database-markup.ts')`. Those dynamic imports are dev-server paths; under static hosting (and `astro preview`) they 404, so the entire client-side behaviour — URL filters, status chips, sort, deep links, sticky-offset JS — silently never ran. Every E2E database test failed initially because of this.
**Fix**: converted the hydration `<script is:inline>` to a processed (Vite-bundled) `<script>` with static ES imports of the two lib modules. Vite now emits it to `/_astro/index.astro_astro_type_script_index_0_lang.*.js`. The small data-exposing block (`window.__DB_RELEASE_TODAY__` / `__DB_STATUS_COUNTS__`) stays `is:inline define:vars` so the bundled module can read the deterministic anchor without re-bundling the corpus.
**Contract update**: `tests/contracts/database-root-markup.test.ts` updated — the sticky-offset invariant (`getBoundingClientRect`, `--db-th-top`) is now asserted against the bundled JS (new `readJs()` helper) instead of the inline HTML. The minified local function name `syncStickyOffset` is no longer asserted (it does not survive minification); the two meaningful tokens (browser API call + CSS custom property) are.

### F2. Per-concept-id visibility leaked non-matching rules of multi-rule concepts (Task 8 carry-over)
`applyState` keyed row visibility by concept `id` in a `Map`, but a concept with multiple rules emits multiple `<tr>`/`<li>` nodes sharing one `data-id`. The Map collapsed them to one node, so filtering by category/temporal/status left "ghost" rules of a partially-matching concept visible. Surfaced by the exact-date test (a 2022-onward rule stayed visible at `date=2010-01-01`).
**Fix**: rewrote the visibility computation to be per-node (a `Set` of DOM node references that pass `isRowVisible`), and the toggle/sort loops now iterate the node arrays directly. `tableRowsById`/`cardItemsById` Maps replaced with `tableRowNodes`/`cardItemNodes` arrays. Card visibility mirrors the table's per-rule decision via id lookup.

### F3. axe-core color-contrast (serious) across all pages (Task 10 carry-over)
Three flavours of the same root cause: the `--text-tertiary`/`--highlight` palette did not meet WCAG AA on its light backgrounds at small text sizes.
- Header search placeholder + ⌘K kbd: `--text-tertiary` `#6E7B82` on `--surface`/`--surface-alt` ≈ 3.3:1.
- "Bukan nasihat pajak" badge + detail source-role/example tags + TER verification-status/guide-warning: `#B7791F` on cream ≈ 2.7–3.3:1.
**Fix**:
  - `--text-tertiary` light value darkened `#6E7B82` → `#5A6670` (5.2:1 on paper, 5.9:1 on surface). Same change mirrored to `--ink-tertiary` alias and `--status-pending`.
  - Warning text `#B7791F` → `#7A4F10` on the specific text surfaces: header "Bukan nasihat pajak" badge (`Base.astro`), `.detail-example-illustrative`, `.detail-source-role-secondary` (`tarif/[id].astro`), `.ter-verification-status`, `.ter-guide-warning` (`ter-pph-21.astro`). Icon/border uses of `#B7791F` left unchanged (decorative).
- Dark-mode palette untouched (gate runs in `colorScheme: 'light'`; dark tokens are independently AA-tested per existing comment).

### F4. Mobile horizontal overflow on detail page (Task 9 carry-over)
`.detail-api-link` had `flex-shrink: 0` and the long API URL inside `.detail-api-url` did not wrap, forcing a 79px horizontal overflow at 320px width (383px-wide element).
**Fix**: added `max-width: 100%; overflow-wrap: anywhere;` to `.detail-api-link` and `overflow-wrap: anywhere; min-width: 0;` to `.detail-api-url` in `website/src/pages/tarif/[id].astro`.

### F5. axe-core select-name (critical) on API docs (Task 10)
`#api-endpoint` `<select>` had no accessible name.
**Fix**: added `aria-label="Pilih endpoint API untuk dicoba"` in `website/src/pages/api-docs.astro`.

### F6. axe-core link-in-text-block (serious) on TER page (Task 9)
The inline link inside `.ter-subtitle` was distinguished by colour alone.
**Fix**: added `text-decoration: underline; text-underline-offset: 2px;` to `.ter-subtitle a` in `website/src/pages/ter-pph-21.astro`.

## Changed files (Task 11 scope)

**New files**:
- `website/playwright.config.ts`
- `website/tests/e2e/database.spec.ts`
- `website/tests/e2e/detail.spec.ts`
- `website/tests/e2e/accessibility.spec.ts`
- `website/tests/e2e/mobile.spec.ts`
- `.superpowers/sdd/task-11-report.md` (this file)

**Modified source files** (gate-driven fixes, all annotated with `Task 11` comments):
- `website/src/pages/index.astro` — F1 (processed `<script>`) + F2 (per-rule visibility)
- `website/src/pages/tarif/[id].astro` — F3 (AA text colour) + F4 (mobile overflow)
- `website/src/pages/ter-pph-21.astro` — F3 (AA text colour) + F6 (link underline)
- `website/src/pages/api-docs.astro` — F5 (select aria-label)
- `website/src/layouts/Base.astro` — F3 (tertiary/highlight AA palette)
- `website/package.json` — `test:e2e` script + 3 devDeps
- `website/pnpm-lock.yaml` — lockfile for the 3 new devDeps
- `tests/contracts/database-root-markup.test.ts` — assert sticky-offset invariant against bundled JS (F1 contract update)

## Verification

- `pnpm install --frozen-lockfile` — OK at both roots (already up to date).
- `SOURCE_DATE_EPOCH=1789094400 pnpm check` — **455 passed** (282 unit + 173 contract). No regressions from the source fixes.
- Playwright Chromium — browser binary installed; **41 E2E passed** (29 desktop + 12 mobile).
- `git status --short` — only working-tree modifications, all explained above. New Task-11 files untracked under `website/tests/e2e/`, `website/playwright.config.ts`, `.superpowers/sdd/`.
- `git diff --check` — exit 0 (only LF/CRLF warnings, no whitespace errors).
- Data integrity gates:
  - `verified_primary` rules without primary source evidence: **0 of 47**.
  - Open conflicts yielding `tepat`: **0 of 1**.

## Concerns

1. **Scope expansion.** Task 11's brief framed this task as writing E2E tests + a11y gate + final release check, with Tasks 1–10 "approved." The E2E gate (its actual job) surfaced six real production defects in already-approved Task 8/9/10 code (F1–F6). I fixed all six in-scope so the release gate could pass, since "no serious/critical axe violations" and "no horizontal page overflow" are explicit brief requirements. Each fix is minimal and annotated. The reviewer should decide whether these fixes warrant re-running the Task 8/9/10 quality reviews or whether the E2E gate now standing behind them is sufficient.

2. **F1 is the highest-impact finding.** The `is:inline` dynamic-import bug (F1) means that **every prior static-hosting deployment of this site shipped with completely broken client-side database filtering** — the 455 unit/contract tests never caught it because they assert on built HTML strings, not live hydration. This is worth flagging prominently to the human reviewer; it is now fixed and locked by both the updated contract test and the E2E database suite.

3. **Per-rule visibility change (F2) is a behaviour change.** Previously, filtering by category/status/date could show inconsistent rows for multi-rule concepts. Now every rule node is filtered independently. This is the correct contract (each rule has its own interval) but it does change what users see for multi-rule concepts like `concept-illustrative-conflict`. No contract test broke, but the reviewer should be aware.

4. **Mobile project uses Chromium emulation, not real WebKit.** `devices['iPhone 13']` forces the WebKit engine (~150MB extra binary). Per the brief's Chromium-only scope, I emulated the viewport/touch/UA on Chromium instead. Layout assertions hold; Safari-specific rendering quirks are not covered.

5. **Dark-mode contrast is not gated.** The Playwright config pins `colorScheme: 'light'`. Dark-mode tokens are independently AA-tested per the existing Base.astro comment, but the axe gate does not exercise dark mode. A future task could add a dark-mode axe project if desired.

6. **`website/tests/e2e/` and `website/playwright.config.ts` are currently untracked** (new). They will be staged/committed by whoever finalises the release; per the brief, I made no commit/push/deploy.
