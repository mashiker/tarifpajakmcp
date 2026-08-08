# Task 10 Brief — SEO, API Docs, dan Output AI/LLM

Repository: `E:\kantor_archisight\tarifpajak\tarifpajakmcp`
Branch: `main` lokal. No commit/push/deploy.

Read first:
- `docs/superpowers/specs/2026-08-06-tarif-pajak-temporal-redesign-design.md` (SEO dan Konsumsi AI)
- `docs/superpowers/plans/2026-08-06-tarif-pajak-temporal-redesign-plan.md`, Task 10
- `.superpowers/sdd/progress.md`

Tasks 1–9 approved. Root database + detail pages + TER/BPPU/PPN UI ready.

## Deliverable

1. Unify canonical domain to `https://tarif-pajak-id.pages.dev` (one constant in `src/config.ts`, mirrored into Astro). Remove mixed Vercel/Pages/placeholder GitHub refs from generators and README.
2. Astro sitemap + robots.txt. Index `/`, `/tarif/*`, `/kategori/*`, tools, API docs. Exclude raw JSON endpoints from HTML sitemap. `noindex` on 404.
3. Base metadata: canonical URL, OG/Twitter title/description/image, `og:url`, JSON-LD. Escape JSON-LD (`<`, `>`, `&`).
4. Root emits Dataset JSON-LD (name, description, canonical URL, license, temporal coverage from rules, dateModified from release context, distribution links for v1/v2/llms.txt, variableMeasured/category stats, creator/publisher, provenance summary). Do NOT represent site as official government guidance.
5. Detail pages emit entry-level metadata (concept/rule ID, category, temporal coverage, official citations, machine-readable alternate API link).
6. Regenerate `llms.txt` and `llms-full.txt` from v2 rules. Include determination semantics and explicit restrictions: `source_conflict`, `summary_only`, missing facts must NOT become definite advice. Never list `needs_review` numbers under "currently applicable verified rates." Counts must agree with v2 data.
7. Rewrite API docs page for v1 compatibility + v2 temporal endpoints + static-host limitations + provenance + examples.
8. Update README commands, architecture, data status, disclaimer.

## TDD

1. Contract tests first (SEO/LLM): canonical URL, sitemap entries, robots, JSON-LD presence + escape, social metadata, llms counts agree with v2, conflict-safe wording, no vercel.app in generators, noindex on 404.
2. RED then implement.
3. Full tests, validate, fixed-epoch build, Astro build, contract tests, diff check.
4. Do not add Playwright QA (Task 11).

## Report

Write `.superpowers/sdd/task-10-report.md`. Return only status/tests/concerns.
