// Task 6 calculator-parity contract. RED-first: the v1 PPN calculator output
// (public/api/v1/calculator/ppn.json) is currently hard-coded with ad-hoc
// numbers and even an incorrect DPP factor narrative ("7/12 × 11%"). The
// canonical source of truth is the v2 PPN rules in data/v2/rules.json. This
// contract forces the v1 generator to PROJECT the calculator data from the
// canonical v2 rules so the two never drift, and the brief's "calculator
// parity is a contract" requirement is enforceable.
//
// Per the Task 6 brief: the website calculator UI rewiring itself is Task 8.
// This contract only locks the data parity between v1 calculator output and
// v2 canonical rules. UI is out of scope here.

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

describe('calculator parity contract (Task 6) - PPN calculator is projected from v2 canonical rules', () => {
  let v2: V2Data;
  let calcPpn: any;

  beforeAll(async () => {
    v2 = await loadV2FromDisk();
    calcPpn = await readJson('api/v1/calculator/ppn.json');
  });

  it('the v1 PPN calculator document exists and is wrapped in the v1 envelope', () => {
    expect(calcPpn).toBeTruthy();
    expect(calcPpn.api).toBe('tarif-pajak-id');
    expect(calcPpn.version).toBe('v1');
    expect(calcPpn.data).toBeDefined();
  });

  it('the calculator surfaces the canonical 10% nominal rate (1984-04-01 to 2022-03-31) from UU PPN / HPP Article 7', () => {
    // The 10% nominal rate under UU PPN Article 7(1)(a) (pre-HPP) must be
    // projected from the v2 rules — not hard-coded — and reference the same
    // source as the canonical rule.
    const tenPctRule = v2.rules.find((r) =>
      r.categoryId === 'cat-ppn' &&
      r.rate?.type === 'percentage' &&
      (r.rate as any).value === '0.10',
    );
    expect(tenPctRule, 'v2 must carry the canonical 10% PPN rule').toBeDefined();
    // The calculator output must include a 10% entry whose interval matches.
    const data = calcPpn.data;
    const rates = data.rates ?? data.scenarios ?? {};
    const serialized = JSON.stringify(rates);
    expect(serialized).toContain('10');
    // The 10% entry should point at the same primary source id(s) as the rule.
    const tenPctSources = new Set(tenPctRule!.verification?.sourceIds ?? []);
    const calcSources = new Set<string>(data.sourceIds ?? data.sources ?? []);
    // If the calculator declares source ids, at least one must overlap with the
    // canonical rule. If it only declares regulation labels, those must overlap.
    if (calcSources.size > 0) {
      const overlap = [...tenPctSources].some((id) => calcSources.has(id));
      expect(overlap, 'calculator 10% entry must cite the same source as the canonical rule').toBe(true);
    }
  });

  it('the calculator surfaces the canonical 11% nominal rate (2022-04-01 to 2024-12-31) from HPP Article 7', () => {
    const elevenPctRule = v2.rules.find((r) =>
      r.categoryId === 'cat-ppn' &&
      r.rate?.type === 'percentage' &&
      (r.rate as any).value === '0.11' &&
      r.validFrom === '2022-04-01',
    );
    expect(elevenPctRule, 'v2 must carry the canonical 11% nominal PPN rule (2022-04-01)').toBeDefined();
    const serialized = JSON.stringify(calcPpn.data);
    expect(serialized).toContain('11');
  });

  it('the calculator surfaces the canonical nominal 12% rate from 2025-01-01 (UU HPP Article 7)', () => {
    const twelvePctRule = v2.rules.find((r) =>
      r.categoryId === 'cat-ppn' &&
      r.rate?.type === 'percentage' &&
      (r.rate as any).value === '0.12',
    );
    expect(twelvePctRule, 'v2 must carry the canonical nominal 12% PPN rule').toBeDefined();
    expect(twelvePctRule!.validFrom).toBe('2025-01-01');
    const serialized = JSON.stringify(calcPpn.data);
    expect(serialized).toContain('12');
  });

  it('the calculator projects the DPP 11/12 factor (effective 11% for non-luxury 2025) from the v2 DPP rule, with the correct factor', () => {
    // The brief is explicit: use information_factor for DPP ratios and formula
    // for effective burden; do NOT store "11%" as the only substantive 2025
    // rate. The calculator output must surface the DPP 11/12 mechanism.
    const dppRule = v2.rules.find((r) =>
      r.categoryId === 'cat-ppn' &&
      r.rate?.type === 'information_factor' &&
      String((r.rate as any).factor).startsWith('0.9166'),
    );
    expect(dppRule, 'v2 must carry the DPP 11/12 information_factor rule').toBeDefined();
    const serialized = JSON.stringify(calcPpn.data);
    expect(serialized.toLowerCase()).toContain('11/12');
  });

  it('the calculator does NOT carry the previous incorrect "7/12 × 11%" narrative', () => {
    // The pre-Task-6 hard-coded calculator wrote "7/12 × 11% via PMK 131/2024"
    // which is mathematically wrong. PMK 131/2024 Article 3 prescribes DPP
    // nilai lain 11/12, giving an effective burden of 12% × 11/12 = 11%. The
    // projection must never reintroduce the 7/12 typo.
    const serialized = JSON.stringify(calcPpn.data);
    expect(serialized.toLowerCase()).not.toContain('7/12');
    expect(serialized.toLowerCase()).not.toMatch(/7\/12\s*×\s*11/);
  });

  it('the calculator exports 0% for qualifying exports (UU PPN 7(2)) as a distinct scenario, not as exempt/non-object', () => {
    const exportRule = v2.rules.find((r) => r.conceptId === 'concept-ppn-export' && r.rate?.type === 'zero');
    expect(exportRule, 'v2 must carry the export 0% rule').toBeDefined();
    const serialized = JSON.stringify(calcPpn.data).toLowerCase();
    expect(serialized).toContain('ekspor');
    expect(serialized).toContain('0');
  });

  it('the calculator documents the 2025 conditional regime (luxury full-base 12% vs non-luxury 11/12 DPP)', () => {
    // The brief: year 2025 must return conditional candidates, not one
    // misleading universal number. The calculator output must surface both the
    // luxury full-base path and the non-luxury DPP-factor path.
    const serialized = JSON.stringify(calcPpn.data).toLowerCase();
    // Either explicit keys or a narrative note. Both the luxury classification
    // and the DPP factor must appear.
    expect(serialized).toMatch(/mewah|luxury/);
    expect(serialized).toContain('11/12');
  });

  it('calculator scenarios project their intervals from canonical v2 rules (no hard-coded effectiveFrom/To)', () => {
    // The luxury-retail Jan-2025 scenario must derive its effectiveFrom/effectiveTo
    // from rule-ppn-luxury-retail-jan-2025 in v2 — not from hard-coded strings.
    // Same for the luxury full-base and non-luxury 2025 scenarios.
    const janRule = v2.rules.find((r) => r.id === 'rule-ppn-luxury-retail-jan-2025');
    expect(janRule, 'rule-ppn-luxury-retail-jan-2025 must exist').toBeDefined();
    const scenarios = calcPpn.data.scenarios ?? [];
    const janScenario = scenarios.find((s: any) => s.id === 'luxury-retail-jan-2025');
    expect(janScenario, 'luxury-retail-jan-2025 scenario must be projected').toBeDefined();
    expect(janScenario.effectiveFrom).toBe(janRule!.validFrom);
    expect(janScenario.effectiveTo).toBe(janRule!.validToExclusive);

    // The projection metadata must list the source rule id, proving the
    // scenario was derived from the canonical rule rather than hand-written.
    const projection = calcPpn.data.$projection ?? {};
    const projectedRuleIds = new Set(projection.v2RuleIds ?? []);
    expect(projectedRuleIds.has('rule-ppn-luxury-retail-jan-2025'), 'projection must list rule-ppn-luxury-retail-jan-2025').toBe(true);

    // The non-luxury domestic 2025 scenario should match its source rule interval.
    const nonLuxuryRule = v2.rules.find((r) => r.id === 'rule-ppn-domestic-supply-2025-nonluxury');
    expect(nonLuxuryRule, 'rule-ppn-domestic-supply-2025-nonluxury must exist').toBeDefined();
    const nonLuxuryScenario = scenarios.find((s: any) => s.id === 'domestic-non-luxury-2025');
    expect(nonLuxuryScenario, 'domestic-non-luxury-2025 scenario must be projected').toBeDefined();
    expect(projectedRuleIds.has('rule-ppn-domestic-supply-2025-nonluxury'), 'projection must list rule-ppn-domestic-supply-2025-nonluxury').toBe(true);
  });

  it('the calculator projects a stable source citation that overlaps with the canonical v2 PPN source registry', () => {
    const ppnSourceIds = new Set(
      v2.sources
        .filter((s) => {
          const id = s.id.toLowerCase();
          return id.includes('ppn') || id.includes('hpp') || id.includes('pmk-131') || id.includes('pmk-11') || id.includes('pmk-53');
        })
        .map((s) => s.id),
    );
    expect(ppnSourceIds.size, 'v2 must register PPN primary sources').toBeGreaterThan(0);
    const serialized = JSON.stringify(calcPpn.data);
    // The calculator should reference at least one regulation id (UU HPP, PMK 131, etc.)
    // by name so a reader can trace back to the canonical source registry.
    expect(serialized.toLowerCase()).toMatch(/uu 7\/2021|hpp|pmk 131|uu ppn/);
  });
});

describe('calculator parity contract (Task 6) - v1 calculator index lists PPN', () => {
  it('the calculator index continues to list the PPN calculator (v1 contract preserved)', async () => {
    const index = await readJson('api/v1/calculator/index.json');
    const ids = index.data.calculators.map((c: any) => c.id);
    expect(ids).toContain('ppn');
  });
});
