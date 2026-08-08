# Task 5 Report — Audit dan Migrasi PPh 23 serta BPPU

Repository: `E:\kantor_archisight\tarifpajak\tarifpajakmcp` (branch `main` lokal)
Status: DONE
No commit / push / deploy / branch / history changes.

## Deliverable

Migrated PPh 23 services + versioned BPPU codes into `data/v2` canonical rules
with verified primary sources, exact intervals, conditions, and example fixtures.
BPPU is first-class versioned reporting metadata (own validity interval + source),
never substantive rate authority.

Jevi's goal scenario verified end-to-end: `resolveAtDate(v2, {date:'2020-06-15',
conceptId:'concept-pph-23-jasa-konsultan', facts:{serviceClass:'konsultan',
recipientHasNpwp:true, gross:'100000000'}})` →
determination `bersyarat`, candidate `rule-pph-23-jasa-konsultan-with-npwp`,
rate `{type:'percentage', value:'0.02'}`, sources `src-uu-36-2008-pph` +
`src-pmk-141-2015`, bppu `bppu-24-104-03`, note prompting to test PPh 21 for
individual consultants.

## Changed files

### New
- `tests/fixtures/pph-23-boundaries.json` — boundary fixtures, sources, BPPU form chronology.
- `tests/fixtures/bppu-boundaries.json` — versioned BPPU expectations and non-authority statement.
- `tests/unit/pph-23-fixtures.test.ts` — 25 tests (RED-first).
- `tests/unit/bppu-fixtures.test.ts` — 6 tests (RED-first).

### Modified
- `data/v2/sources.json` — added 11 primary-source registry entries.
- `data/v2/categories.json` — added `cat-pph-23` with 2 declared discrepancies.
- `data/v2/concepts.json` — added 6 PPh 23 concepts (split service classes + scope marker).
- `data/v2/rules.json` — added 11 PPh 23 rules (5 services × {with,without NPWP} + scope marker).
- `data/v2/bppu.json` — added 5 versioned PPh 23-relevant BPPU codes (24-104-01/02/03, 24-100-02, 28-403-02).

## Source registry additions (`data/v2/sources.json`)

- `src-uu-36-2008-pph` — UU 36/2008 (PPh konsolidasi), Pasal 23 ayat (1) huruf c angka 2 (2%) + ayat (1a) (pengali 100% tanpa NPWP).
- `src-pmk-141-2015` — PMK 141/PMK.03/2015, Lampiran jasa lain; **Pasal 4 efektif 26 Agustus 2015** (30 hari setelah pengundangan 27 Juli 2015). Locator explicitly encodes the 26 Agu 2015 boundary; the test asserts it does NOT mention "24 Juli" or "27 Agustus".
- `src-pp-34-2017` — PP 34/2017, PPh final 4(2) 10% persewaan tanah/bangunan, efektif **2 Januari 2018**.
- `src-pmk-112-2022-nik` — PMK 112/PMK.03/2022 (NIK sebagai NPWP, 14 Juli 2022).
- `src-pmk-136-2023-nik` — PMK 136/PMK.03/2023 (penggunaan penuh NIK, berlaku 1 Juli 2024).
- `src-peng-6-pj-09-2024-nik` — SE PENG-06/PJ.09/2024 (Masa Pajak Januari 2024 NIK + Dukcapil integration menghindari pengali 1a; bare NIK tidak menghapus pengali selama transisi).
- `src-per-04-pj-2017`, `src-per-23-pj-2020`, `src-kep-143-pj-2022`, `src-per-24-pj-2021`, `src-per-11-pj-2025` — form chronology (e-Bupot Masa → unifikasi → Coretax/BPPU).

## BPPU versions added (`data/v2/bppu.json`)

| ID | Code | Label | validFrom | sourceId | formSourceId |
|---|---|---|---|---|---|
| bppu-24-104-01 | 24-104-01 | Jasa Teknik (PPh 23) | 2022-02-21 | src-kep-143-pj-2022 | src-per-24-pj-2021 |
| bppu-24-104-02 | 24-104-02 | Jasa Manajemen (PPh 23) | 2022-02-21 | src-kep-143-pj-2022 | src-per-24-pj-2021 |
| bppu-24-104-03 | 24-104-03 | Jasa Konsultan (PPh 23) | 2022-02-21 | src-kep-143-pj-2022 | src-per-24-pj-2021 |
| bppu-24-100-02 | 24-100-02 | Sewa/perolehan harta selain tanah/bangunan (PPh 23) | 2022-02-21 | src-kep-143-pj-2022 | src-per-24-pj-2021 |
| bppu-28-403-02 | 28-403-02 | Persewaan Tanah/Bangunan (FINAL PPh 4(2)) | 2022-02-21 | src-kep-143-pj-2022 | src-per-24-pj-2021 |

All BPPU codes carry their own validity interval and source registry entries,
independent of the rate rules. The `formChronology` block in the boundary
fixture records PER-04/PJ/2017 → PER-23/PJ/2020 → KEP-143/PJ/2022+PER-24/PJ/2021
→ PER-11/PJ/2025 (Coretax/BPPU).

## Rules added (`data/v2/rules.json`)

5 service concepts × 2 branches (with/without NPWP) + 1 scope marker = 11 rules:

- `rule-pph-23-jasa-teknik-{with,without}-npwp` (2% / 4%)
- `rule-pph-23-jasa-manajemen-{with,without}-npwp` (2% / 4%)
- `rule-pph-23-jasa-konsultan-{with,without}-npwp` (2% / 4% — goal scenario lives on `-with-npwp`)
- `rule-pph-23-jasa-pmk141-lain-{with,without}-npwp` (2% / 4%, validFrom **2015-08-26**)
- `rule-pph-23-rent-movable-{with,without}-npwp` (2% / 4%; NOT PPh 4(2))
- `rule-pph-23-scope-rent-land-building` (rate `not_applicable`; condition serviceClass='rent-land-building')

Each rate rule conditions on `serviceClass` AND `recipientHasNpwp`. The
with/without branches live in **distinct** exclusive groups
(`pph-23-<service>-recipient` vs `pph-23-<service>-multiplier-1a`) so the
validator does not flag an overlap; the resolver picks the matching branch by
condition, and returns `fakta_kurang` when `recipientHasNpwp` is missing
(never a synthetic 2%). All rate claims are `verified_primary` with
rate/interval/condition evidence; the 4% branch evidence explicitly cites
Pasal 23 ayat (1a).

## Conflicts declared (not silently resolved)

Both surfaced as `knownDiscrepancies` on `cat-pph-23` (no `source_conflict`
verification status was needed because the rates themselves are unambiguous;
the discrepancies are about source attribution, not rate values):

1. `land-building-rent-attribution-csv-vs-primary` — KOP CSV attributes
   28-403-02 to "PP 8/2024" (Coretax), but the primary authority for the
   post-2018 10% final rate is **PP 34/2017** (effective 2 Januari 2018).
   v2 holds PP 34/2017 for 2018-2025; PP 8/2024 is noted as the Coretax-era
   reference. Resolver must never return 2% PPh 23 for land/building rent.
2. `bppu-kop-predates-canonical-rate` — the KOP/BPPU "Berlaku 2022-02-21"
   attribution **predates** the canonical PPh 23 service rates, which have been
   2% under UU 36/2008 (1 Januari 2009) and PMK 141/2015 (26 Agustus 2015).
   BPPU/KOP codes are reporting metadata, not rate authority; the rule intervals
   are not shortened by the code validity date.

## RED → GREEN evidence

- **RED (recorded before production data):** `pnpm vitest run tests/unit/pph-23-fixtures.test.ts tests/unit/bppu-fixtures.test.ts` → **26 failed | 5 passed (31)**. Failure modes: missing category, missing concepts, missing primary sources, missing BPPU codes, missing rules, undefined category knownDiscrepancies.
- **GREEN (after production data):** same focused command → **31 passed (31)**.

## Verification gates

- `pnpm test` — **154 passed (154)** across 21 test files (baseline was 123; +31 new PPh 23/BPPU tests).
- `pnpm validate` — `Source validation passed`.
- Fixed-epoch build (`SOURCE_DATE_EPOCH=1720000000 pnpm build`) — clean: validate → generate → sync → Astro (21 pages) → contracts (34 passed). Run twice and compared SHA-256 of every output file → **byte-identical (deterministic)**.
- Goal scenario exercised directly against the resolver → returns the candidate rule with 2% rate, UU PPh 36/2008 source, BPPU 24-104-03, and the PPh 21 note.

## Concerns

1. **PP 34/2017 vs PP 8/2024 attribution** is declared but not fully resolved
   at the regulation level. PP 8/2024 may itself modify implementing language
   for PPh 4(2) final; this task deliberately stayed out of migrating PPh 4(2)
   (per the brief's "do not migrate other tax families" constraint), so the
   PPh 4(2) final 10% rate for land/building rent is referenced only as a
   scope-exclusion marker, not encoded as a substantive rule. A future PPh 4(2)
   migration should pin down the PP 8/2024 interplay.
2. **NIK-as-NPWP chronology** is encoded at the source registry and in the
   rule notes, not as separate conditional branches keyed on a `nikIntegrated`
   fact. The fixtures cover the with-NIK (Jan 2024, no multiplier) and
   bare-NIK-not-activated (2023, multiplier applies) cases by supplying
   `recipientHasNpwp:true`/`false` directly. If a future consumer needs to ask
   "does bare NIK remove the multiplier?" the resolver will need an explicit
   `nikIntegrated` condition branch — deferred to avoid scope creep.
3. The 5 PPh 23 service rules each carry `supersedes: []` because no prior v2
   rule existed for them. The pre-2009 (pre-UU 36/2008) PPh 23 regime is
   intentionally left as a gap (the `pre-uu36-2008-no-rule` fixture asserts
   `fakta_kurang` for 2008-12-31). Reconstructing the pre-2009 service-rate
   history would require primary sources from UU 7/1991 and earlier amendments,
   which is out of scope for this task.

## Carry-over for final review

- Schema wiring for BPPU `sourceId`/`formSourceId`/`$comment` fields is
  optional (`additionalProperties: true` on the BPPU schema); the semantic
  validator does not yet enforce BPPU-source foreign keys. The bppu-fixtures
  test asserts the values are present and well-formed at the data level. A
  future tightening could add a `bppu_source_foreign_key` check to
  `src/validation/semantic.ts` (Task 1-2 minor roll-forward).

---

# Task 5 Review Fix (CHANGES_REQUIRED → DONE)

Review returned Spec PASS / Quality CHANGES_REQUIRED with one Critical and one
Important finding. Both fixed test-first in the same working tree. No other tax
families migrated, no UI redesign.

## Findings addressed

### Critical: movable-rent rate discrepancy declared, not silently picked
KOP CSV 24-100-02 lists sewa/perolehan harta selain tanah/bangunan at **15%**
(the pre-2001 "imbalan jasa" umum rate that the CSV never updated for this
object), while v2 canonical is **2%** under UU PPh Pasal 23(1)(c) angka 4
(corroborated by the v1 embedded pph-23 jasa-lain 2%/4% entries).

- **Test-first (RED):** added `PPh 23 review fix - Critical: movable-rent
  CSV-vs-primary rate discrepancy` describe block in
  `tests/unit/pph-23-fixtures.test.ts` with two assertions:
  - `cat-pph-23.knownDiscrepancies` contains an entry referencing `24-100-02`,
    `15%`, and `2%`.
  - `rule-pph-23-rent-movable-with-npwp` keeps `value:'0.02'` (does not inherit
    the CSV 15%).
- **Implementation:** added a third `knownDiscrepancy`
  `movable-rent-rate-csv-vs-primary` on `cat-pph-23`
  (`data/v2/categories.json`), mirroring how Task 4 declared
  `legacy-ter-vs-canonical`. The `summary` explicitly states CSV shows 15%,
  canonical is 2%, and explains the CSV value is pre-PMK-141 era data; the
  `resolution` states v2 holds verified_primary 2%/4% and the CSV value is not
  used by the resolver.

### Important: PMK-141 umbrella rule no longer tagged with konsultan BPPU
The PMK-141 "jasa lain" umbrella (`rule-pph-23-jasa-pmk141-lain-with-npwp` and
`-without-npwp`) spans many KOP codes (Aktuaris 24-104-05, Hukum 24-104-07,
Arsitektur 24-104-08, Outsourcing 24-104-17, Software 24-104-24, etc.). It was
incorrectly tagged with the konsultan-specific `bppu-24-104-03`.

- **Test-first (RED):** added `PPh 23 review fix - Important: PMK-141 umbrella
  rule is not konsultan-specific` describe block with two assertions — one per
  branch — that `rule.bppuId` is falsy.
- **Implementation:** removed the `bppuId: "bppu-24-104-03"` field from both
  `rule-pph-23-jasa-pmk141-lain-with-npwp` and `-without-npwp`
  (`data/v2/rules.json`). The fixture `pph-23-boundaries.json` already expects
  `null` for the pmk141-lain service concept.

## Files changed in this fix

- `tests/unit/pph-23-fixtures.test.ts` — added 2 describe blocks, +4 tests
  (2 for Critical, 2 for Important).
- `data/v2/categories.json` — added `movable-rent-rate-csv-vs-primary`
  knownDiscrepancy on `cat-pph-23`.
- `data/v2/rules.json` — removed `bppuId` from both
  `rule-pph-23-jasa-pmk141-lain-*` rules.

## RED → GREEN evidence

- **RED (before fix):** `pnpm vitest run tests/unit/pph-23-fixtures.test.ts` →
  **3 failed | 26 passed (29)**. Failures: discrepancy entry missing; both
  pmk141-lain rules still carried `bppuId: "bppu-24-104-03"`.
- **GREEN (after fix):** `pnpm vitest run tests/unit/pph-23-fixtures.test.ts
  tests/unit/bppu-fixtures.test.ts` → **35 passed (35)**.

## Verification gates (re-run after fix)

- `pnpm test` — **158 passed (158)** across 21 files (was 154; +4 new tests).
- `pnpm validate` — `Source validation passed`.
- Fixed-epoch build (`SOURCE_DATE_EPOCH=1720000000 pnpm build`) — clean:
  validate → generate → sync → Astro (21 pages) → contracts (**34 passed**).
  Two consecutive builds compared by SHA-256 → **byte-identical (deterministic)**.
- `git diff --check` on `data tests .superpowers` → exit 0, no whitespace
  errors (only cosmetic CRLF/LF normalization warnings on pre-existing
  generated artifacts that were not touched by this fix).
- Goal scenario re-verified via direct resolver call: 2020 jasa konsultan with
  NPWP → determination `bersyarat`, rate `0.02`, bppu `bppu-24-104-03`.
- PMK-141 umbrella rules re-verified: both branches now carry no `bppuId`.
- `cat-pph-23.knownDiscrepancies` now lists all three:
  `land-building-rent-attribution-csv-vs-primary`,
  `bppu-kop-predates-canonical-rate`, `movable-rent-rate-csv-vs-primary`.

## BPPU table correction

The Task 5 BPPU table in the original report (above) is unchanged for the
versioned BPPU codes themselves — they still exist as reporting metadata. The
correction is at the rule-tagging level: `rule-pph-23-jasa-pmk141-lain-*` rules
no longer reference any single BPPU code (umbrella spans many). All other PPh
23 service rules (teknik/manajemen/konsultan/rent-movable) retain their
single-code `bppuId` because each maps to exactly one KOP/BPPU code.

## Concerns (post-fix)

The original three concerns remain valid and unchanged. No new concerns
introduced by this fix. The movable-rent CSV-vs-primary discrepancy is now
declared (not resolved at the data-cleaning level); a future CSV refresh would
still need to update the `data/kop-pajak-unifikasi.csv` 24-100-02 rate from
15% to 2%, which is out of scope here.
