Task 1-9 complete (all Spec PASS, Quality APPROVED). 403 tests pass (320 unit + 83 contract); fixed-epoch build deterministic; 64 Astro pages (root, /database canonical, /tarif/[id] detail for all concepts, category index, TER/BPPU/PPN tools).

Task 10 complete (Spec PASS, Quality APPROVED). 455 tests pass (282 unit + 173 contract); SEO/LLM outputs from v2, canonical domain unified, sitemap/robots/JSON-LD/OG/Twitter, llms count consistency fixed (47 total vs 34 open-ended), API docs rewritten, README updated.

Task 1-7 data audit complete. Task 8 root database redesign complete. Task 9 detail pages + status filter + TER/BPPU/PPN UI rewiring complete.

Task 8 (root database redesign) implemented: root `/` is the single direct-to-database experience (full-width, no nested vertical scroll, URL-driven filters, sticky toolbar+table-header, timeline signature, verification badges, `/database` canonicalizes to `/`). v1 PPh Badan calculator projected from v2 (Task 7 review I-1: goPublic 19pp / Article 31E formula / IKN conditional). Review returned Spec PASS / Quality CHANGES_REQUIRED; C1 (client re-render destroyed timeline+badges), I1 (sticky offset too small), I2 (TER re-baseline framing) fixed test-first and locked by contracts. 304 unit + 52 contract tests pass.

Re-baseline of Task 8 carry-over items (per Task 8 review I2):
- TER page (ter-pph-21.astro) rewiring to canonical v2 TER rules: RE-BASELINED to Task 9 (detail page work) and Task 10 (SEO/LLM output). The brief listed TER-page v2 rewiring under Task 8, but the canonical TER detail/timeline experience belongs with the detail-page work in Task 9 and the machine-readable output in Task 10. The root database already reads v2 TER rules directly, so the primary UX is no longer blocked by the legacy TER page. The v1 TER table stays byte-stable per the v1 contract.
- BPPU page category index for new categories (cat-pph-final-umkm, cat-pph-special-regimes): RE-BASELINED to Task 9 (category navigation refresh alongside detail pages).
- PPN calculator UI: parity already locked at the data layer (Task 6 contract). UI rewiring RE-BASELINED to Task 9/10.

Data audit summary (v2 canonical, primary-source verified):
- PPh 21/TER (Task 4): TER A/B/C migrated; middle layers verified_secondary pending PDF transcription; v1 left byte-unchanged, discrepancy declared.
- PPh 23 + BPPU (Task 5): goal scenario "jasa konsultan 2020" resolves 2%/4% with UU PPh 23(1)(c)(2) + BPPU 24-104-03; PMK 141 effective 26 Agu 2015; movable-rent CSV discrepancy declared; PMK-141 umbrella BPPU tag fixed.
- PPN 2022-2025 (Task 6): nominal/DPP-factor/effective-burden separation; PMK 131 URL corrected; calculator parity contract; v1 timeline ref deferred to Task 8.
- PPh Badan + Final/UMKM (Task 7): corporate chronology 25/22/22; listed reduction in percentage points; Article 31E proportional; IKN needs_review; UMKM PP46→PP23→PP55→PP20/2026; OP Rp500m base exclusion; PPh 15 separated; PPh 15 fixture assertion fixed.

Carry-over for Task 9/10 and final review:
- Task 1-2 minors: wire category/conflict/bppu schemas into compileV2Schemas; full-DFS supersession cycle traversal.
- Task 9: detail page `/tarif/[id]` (root already emits 134 stable deep links); TER page canonical v2 rewiring; BPPU page new-category index; PPN calculator UI rewiring.
- Task 10: SEO/LLM outputs (llms.txt, sitemap, JSON-LD).
- citation-precision: movable-rent "angka 4" locator.
No commit/push/deploy at any task.
