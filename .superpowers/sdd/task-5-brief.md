# Task 5 Brief — Audit dan Migrasi PPh 23 serta BPPU

Repository: `E:\kantor_archisight\tarifpajak\tarifpajakmcp`
Branch: `main` lokal. No commit/push/deploy.

Read first:
- `docs/superpowers/specs/2026-08-06-tarif-pajak-temporal-redesign-design.md`
- `docs/superpowers/plans/2026-08-06-tarif-pajak-temporal-redesign-plan.md`, Global Constraints and Task 5
- `.superpowers/sdd/progress.md`
- Primary-source research brief below (verified 2026-08-06, 294 sources).

Tasks 1–4 approved.

## Deliverable

Migrate PPh 23 services + versioned BPPU codes into `data/v2` canonical rules with verified primary sources, exact intervals, conditions, and example fixtures. BPPU must be first-class versioned reporting metadata, not substantive rate authority.

## Primary-source facts to encode (verified)

- UU PPh (UU 36/2008 amendment) Pasal 23 ayat (1) huruf c angka 2 and ayat (1a): jasa teknik, jasa manajemen, jasa konstruksi, jasa konsultan, and PMK 141 "jasa lain" at **2% of jumlah bruto**, **1 Januari 2009–sekarang**. No-NPWP multiplier "lebih tinggi 100%" → 2%→4%, 15%→30%.
- PMK 141/PMK.03/2015 (jasa lain list + jumlah bruto mechanics): promulgated 27 Juli 2015, **effective 26 Agustus 2015** per Pasal 4 (30 days). Encode this exact effective date; do NOT use 24 Juli or 27 Agustus.
- Jasa konsultan 2020: 2% (or 4% without NPWP) of gross excluding VAT; test PPh 21 exclusion for individual consultants.
- Land/building rent is NOT PPh 23 — it is final PPh 4(2) 10% under PP 34/2017 (effective 2 Januari 2018). Movable/non-land-building asset rent remains PPh 23 2%.
- NIK-as-NPWP chronology: PMK 112/2022 (14 Juli 2022), PENG-6/PJ.09/2024 (Masa Pajak Jan 2024 NIK with Dukcapil integration avoids 1a multiplier), PMK 136/2023 (1 Juli 2024 full NIK use). Bare NIK without activation does NOT remove the multiplier during transition.
- Official codes: 24-104-01 Jasa Teknik, 24-104-02 Jasa Manajemen, 24-104-03 Jasa Konsultan, 24-100-02 rent of non-land-building assets. 28-403-02 final land/building rent.
- Form chronology: PER-04/PJ/2017 → PER-23/PJ/2020 (28 Des 2020, NOT retroactive for earlier 2020) → PER-24/PJ/2021 → PER-11/PJ/2025 (Coretax/BPPU).

## Behavior rules

- BPPU = reporting metadata with its own validity interval and source, never rate authority.
- Service concepts split: teknik/manajemen/konsultan/PMK-141-lain/rent-movable, each distinct concept with conditions (recipient domestic taxpayer/BUT, not already PPh 21, no controlling final regime).
- Recipient identifier condition: NPWP present; OR valid integrated NIK for resident individuals per the NIK chronology; else 1a multiplier applies.
- Declare source_conflict for any CSV-vs-embedded or code-vs-rate discrepancies that remain unresolved; do NOT silently pick one value.
- verified_primary only when rate, interval, condition all source-backed by primary text.

## TDD

1. Boundary fixtures first (`tests/fixtures/pph-23-boundaries.json`, `tests/fixtures/bppu-boundaries.json`): jasa konsultan 2020 with/without NPWP, jasa manajemen 2020, jasa teknik, PMK 141 effective 26 Agu 2015 boundary, movable rent vs land/building rent (pre/post PP 34/2017), NIK transition 2024, selected BPPU codes 24-104-02/03.
2. RED, then implement v2 rules + sources + versioned BPPU + conflicts + examples.
3. Focused tests, full tests, validate, fixed-epoch build, Astro build, contract tests, diff check.
4. Do not redesign UI or migrate other tax families.

## Goal scenario (Jevi's explicit ask)

Resolver must answer: "berapa tarif PPh 23 jasa konsultan tahun 2020?" → candidate rule(s) with interval covering 2020, 2% rate, source UU PPh Pasal 23(1)(c)(2), condition NPWP status (with 1a 4% branch if missing), BPPU 24-104-03 reporting reference, and a note to test PPh 21 for individual consultants.

## Report

Write `.superpowers/sdd/task-5-report.md` with changed files, RED/GREEN evidence, source registry additions, BPPU versions, conflicts declared, and concerns. Return only status/tests/concerns.
