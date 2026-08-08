// Task 8 carry-over (I-1 from Task 7 review): the v1 PPh Badan calculator was
// hard-coded with `goPublic: 20, ikn: 0, umkm: 11`. Canonical v2 holds:
//   - listed (goPublic) reduction is 3 percentage points off the 22% base,
//     i.e. 19% (not 20%) for TP 2020+, per UU 2/2020 + UU HPP.
//   - IKN is a conditional facility with verification needs_review, NEVER a
//     flat 0%. The calculator must surface it as conditional/null, not 0.
//   - "umkm: 11" misrepresents Article 31E. Article 31E(1) is a proportional
//     50% tariff reduction on the PKP portion tied to gross turnover up to
//     Rp4.8bn — not a flat 11%.
//
// This contract forces the v1 generator to PROJECT the badan calculator from
// canonical v2 rules so the two never drift.

import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { beforeAll, describe, expect, it } from 'vitest';
import { getProjectPaths } from '../../src/paths.ts';
import { loadJsonFile } from '../../src/validation/load.ts';
import type { V2Data } from '../../src/core/types.ts';

const paths = getProjectPaths();
const v2Dir = join(paths.data, 'v2');

async function loadV2FromDisk(): Promise<V2Data> {
  const [categories, concepts, sources, rules, conflicts, bppu] = await Promise.all([
    loadJsonFile<any[]>(join(v2Dir, 'categories.json')),
    loadJsonFile<any[]>(join(v2Dir, 'concepts.json')),
    loadJsonFile<any[]>(join(v2Dir, 'sources.json')),
    loadJsonFile<any[]>(join(v2Dir, 'rules.json')),
    loadJsonFile<any[]>(join(v2Dir, 'conflicts.json')),
    loadJsonFile<any[]>(join(v2Dir, 'bppu.json')),
  ]);
  return { sources, categories, concepts, rules, conflicts, bppu };
}

async function readJson(rel: string): Promise<any> {
  return JSON.parse(await readFile(join(paths.rootPublic, rel), 'utf8'));
}

describe('calculator parity contract (Task 8 I-1) - PPh Badan calculator is projected from v2 canonical rules', () => {
  let v2: V2Data;
  let calcBadan: any;

  beforeAll(async () => {
    v2 = await loadV2FromDisk();
    calcBadan = await readJson('api/v1/calculator/pph-badan.json');
  });

  it('the v1 PPh Badan calculator document exists and is wrapped in the v1 envelope', () => {
    expect(calcBadan).toBeTruthy();
    expect(calcBadan.api).toBe('tarif-pajak-id');
    expect(calcBadan.version).toBe('v1');
    expect(calcBadan.data).toBeDefined();
  });

  it('surfaces the canonical 22% base rate for TP 2022+ (UU HPP Art 17(1)(b))', () => {
    const baseRule = v2.rules.find(
      (r) => r.id === 'rule-pph-badan-base-22pct-hpp' && r.rate?.type === 'percentage' && (r.rate as any).value === '0.22',
    );
    expect(baseRule, 'v2 must carry rule-pph-badan-base-22pct-hpp').toBeDefined();
    const serialized = JSON.stringify(calcBadan.data);
    expect(serialized).toContain('22');
  });

  it('surfaces the canonical 19% listed (goPublic) rate, NOT 20%, for TP 2020+ (UU 2/2020 + UU HPP)', () => {
    // I-1 fix: goPublic was 20 in v1, must be 19 because the listed-company
    // reduction is 3 percentage points off the 22% base per UU 2/2020 + HPP.
    const listedRule = v2.rules.find(
      (r) => r.id === 'rule-pph-badan-listed-19pct-hpp' && (r.rate as any).value === '0.19',
    );
    expect(listedRule, 'v2 must carry rule-pph-badan-listed-19pct-hpp at 0.19').toBeDefined();
    const rates = calcBadan.data.rates ?? {};
    // The calculator must NOT carry the old flat 20% goPublic figure.
    expect(rates.goPublic).not.toBe(20);
    // It must surface 19% explicitly.
    const serialized = JSON.stringify(calcBadan.data);
    expect(serialized).toContain('19');
    // And the listed-reduction narrative must explain the 3pp mechanics.
    expect(serialized.toLowerCase()).toMatch(/3\s*(persen|pp|percentage|poin)/);
  });

  it('documents the listed-company free-float conditions (not an unconditional rate)', () => {
    const listedRule = v2.rules.find((r) => r.id === 'rule-pph-badan-listed-19pct-hpp');
    expect(listedRule?.conditions, 'listed rule must carry free-float conditions').toBeDefined();
    const serialized = JSON.stringify(calcBadan.data).toLowerCase();
    // The calculator must surface the qualifying conditions, not present 19% as
    // a flat rate anyone can claim.
    expect(serialized).toMatch(/syarat|kondisi|free.?float|400|300|183/);
  });

  it('does NOT present Article 31E as a flat 11% rate (umkm)', () => {
    // I-1 fix: the old v1 wrote `umkm: 11`. Article 31E is a proportional
    // 50% reduction on the PKP portion tied to turnover up to Rp4.8bn, not a
    // flat 11%. The calculator must reference the formula, not a bare number.
    const rates = calcBadan.data.rates ?? {};
    expect(rates.umkm).not.toBe(11);
    const article31eRule = v2.rules.find((r) => r.id === 'rule-pph-badan-article31e');
    expect(article31eRule, 'v2 must carry rule-pph-badan-article31e').toBeDefined();
    expect(article31eRule!.rate?.type).toBe('formula');

    const serialized = JSON.stringify(calcBadan.data).toLowerCase();
    // The calculator must surface Article 31E by name or by Rp4.8bn / Rp50bn
    // thresholds, and the proportional reduction narrative.
    expect(serialized).toMatch(/31e|pasal 31e|4\.800\.000\.000|rp4,?8|proporsion/);
  });

  it('does NOT present IKN as a flat 0% rate', () => {
    // I-1 fix: the old v1 wrote `ikn: 0`. IKN is a conditional facility with
    // verification needs_review, never a universal 0%. The calculator must
    // surface it as conditional and flag the needs_review state.
    const rates = calcBadan.data.rates ?? {};
    expect(rates.ikn).not.toBe(0);
    const iknRule = v2.rules.find((r) => r.id === 'rule-pph-badan-ikn');
    expect(iknRule, 'v2 must carry rule-pph-badan-ikn').toBeDefined();
    expect(iknRule!.verification?.status).toBe('needs_review');

    const serialized = JSON.stringify(calcBadan.data).toLowerCase();
    // The calculator must surface IKN's conditional nature, not a flat number.
    expect(serialized).toMatch(/ikn|needs_review|bersyarat|kondisional|pmk 28/);
  });

  it('projects the calculator from canonical v2 rule ids (no hard-coded ad-hoc numbers)', () => {
    const projection = calcBadan.data.$projection ?? {};
    const projectedRuleIds = new Set(projection.v2RuleIds ?? []);
    expect(projectedRuleIds.has('rule-pph-badan-base-22pct-hpp'), 'projection must list base-22pct-hpp').toBe(true);
    expect(projectedRuleIds.has('rule-pph-badan-listed-19pct-hpp'), 'projection must list listed-19pct-hpp').toBe(true);
    expect(projectedRuleIds.has('rule-pph-badan-article31e'), 'projection must list article31e').toBe(true);
    expect(projectedRuleIds.has('rule-pph-badan-ikn'), 'projection must list ikn').toBe(true);
  });
});
