# Task 8 Brief — Redesign Root menjadi Database Full-Width

Repository: `E:\kantor_archisight\tarifpajak\tarifpajakmcp`
Branch: `main` lokal. No commit/push/deploy.

Read first:
- `docs/superpowers/specs/2026-08-06-tarif-pajak-temporal-redesign-design.md` (Pengalaman Pengguna, Arah Visual)
- `docs/superpowers/plans/2026-08-06-tarif-pajak-temporal-redesign-plan.md`, Global Constraints and Tasks 8–9
- `.superpowers/sdd/progress.md`

Tasks 1–7 approved. v2 data + resolver + generators ready.

## Deliverable (Jevi's core ask)

Redesign root `/` into a single direct-to-database experience: full-width, no landing page, no nested half-height vertical table scroll. URL-driven filters, temporal awareness, stable detail deep links, accessibility, approved visual tokens. Move `/database` to canonicalize/redirect to `/`. Rewire v1-driven UI surfaces (TER, BPPU, PPN calculator, category index) to canonical v2 where needed.

## Required behavior

- Root `/` is the only database implementation; `/database` canonicalizes (canonical link + JS `location.replace` preserving query/hash + fallback link).
- Remove every `max-height: calc(100vh - ...)` / vertical `overflow-auto` on result tables. Page scrolls normally; table header sticky to page beneath sticky header+toolbar.
- Full-width container on database (raise/remove 1400px cap on this page).
- Toolbar sticky: search (`q`), date/year (`date`), category, status, verification, sort, clear filters. Default date explicit in UI (no silent "current law").
- URL is single source of truth: parse on load, `history.replaceState` while typing, `pushState` on committed changes, `popstate` handled, defaults omitted.
- Result count `role="status" aria-live="polite" aria-atomic="true"`; status-specific wording (no universal "aktif" suffix).
- Empty state suggests relaxing filters; gap/transition/conFLICT notices use `DeterminationNotice`.
- Each row/card → stable `/tarif/{conceptId-or-ruleId}?date=...`. Mobile cards keep category/rate/period/status/detail.
- Timeline cell positions selected date within validity interval (signature visual).
- Verification badges; conflict markers.
- Approved tokens: ink #132A2A, deep teal #0E5E58, paper #F7F8F4, surface #FFFFFF, rule #D9E0DC, warning #B7791F, conflict #B64545. Inter + IBM Plex Mono. WCAG AA on paper/surface.
- Accessibility: visible labels on every search/select, `aria-pressed` on chips, tablist semantics on any tabs, `aria-expanded`/`aria-controls` on mobile menu, theme button exposes state, table caption + scoped headers, external links `rel="noopener noreferrer"`, `prefers-reduced-motion` honored.

## Rewire items (carry-over from data tasks)

- TER page: read canonical v2 TER rules (do not silently keep wrong v1 table).
- BPPU page: include new categories (`cat-pph-final-umkm`, `cat-pph-special-regimes`) in any category index/navigation.
- PPN calculator UI: use canonical projection (parity already locked).
- PPh Badan v1 calculator: fix `goPublic 20→19`, `ikn flat 0→conditional/null`, `umkm 11→formula reference`; add badan calculator parity contract (I-1 from Task 7 review).
- v1 timeline group `ppn`: revisit stale `ppn-11pct-effective-2025` reference for website display.

## TDD

1. `tests/unit/database-state.test.ts` first: parse/serialize roundtrip, defaults, invalid dates, multi-filter, year vs date mode, deterministic sort. RED then implement `website/src/lib/database-state.ts`.
2. Component build + visual token application.
3. Astro build; static markup checks for no nested vertical DB scroll, sticky header/toolbar/table-header, URL fields, live region, labels, aria.
4. Full tests, validate, fixed-epoch build, contract tests, diff check.
5. Do not add Playwright browser QA yet (Task 11); do not change SEO/LLM outputs beyond what UI needs (Task 10).

## Report

Write `.superpowers/sdd/task-8-report.md` with changed files, RED/GREEN evidence, decisions, and concerns. Return only status/tests/concerns.
