// Task 6 PPN 2022-2025 migration. RED-first: these tests fail until data/v2
// carries the canonical PPN concepts (nominal rate, DPP factor, effective
// burden, conditional 2025 candidates, 0% export, foreign utilization, luxury
// retail transition), the primary sources (UU HPP 7/2021, UU PPN 8/1983 jo.
// amendments, PMK 131/2024, PMK 11/2025, PMK 53/2025), and the declared
// conflicts. See tests/fixtures/ppn-boundaries.json for the verified
// expectations and data/v2/sources.json for primary locators.
//
// Behavior rules from the brief:
//  - Distinguish nominal rate (Article 7) from DPP factor (PMK 131/11) from
//    effective burden. Do NOT store '11%' as the only substantive 2025 rate.
//  - Model transaction conditions: domestic supply, import, export (0%),
//    foreign utilization, luxury-BKP classification, retail final-consumer
//    status, dedicated special-scheme coverage.
//  - Year 2025 must return conditional candidates, not one universal number.
//  - Zero-rated exports distinct from exempt/non-object.
//  - Remove generic 11% informational values from rate records.
//  - verified_primary only when rate+interval+condition all source-backed.

import { beforeAll, describe, expect, it } from 'vitest';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { getProjectPaths } from '../../src/paths.ts';
import { loadJsonFile } from '../../src/validation/load.ts';
import { resolveAtDate, resolveForYear } from '../../src/core/resolver.ts';
import { validateV2 } from '../../src/validation/semantic.ts';
import type { Rate, TaxRule, V2Data } from '../../src/core/types.ts';

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

const FIXTURES = JSON.parse(
  await readFile(join(paths.root, 'tests', 'fixtures', 'ppn-boundaries.json'), 'utf8'),
) as any;

function scaled(value: string, scale: number): bigint {
  const [int = '', frac = ''] = value.split('.');
  return BigInt(`${int}${frac.padEnd(scale, '0').slice(0, scale)}`.replace(/^0+(?=\d)/, '') || '0');
}

function renderCents(scaledValue: bigint): string {
  const sign = scaledValue < 0n ? '-' : '';
  const abs = scaledValue < 0n ? -scaledValue : scaledValue;
  const digits = abs.toString().padStart(3, '0');
  const intPart = digits.slice(0, digits.length - 2);
  const fracPart = digits.slice(digits.length - 2);
  return `${sign}${intPart}.${fracPart}`;
}

/** percentage × dpp using 4-place rate scale and 2-place currency scale. */
function percentTimesBase(rateFraction: string, base: string): string {
  const rateScale = 4;
  const baseScale = 2;
  const r = scaled(rateFraction, rateScale);
  const b = scaled(base, baseScale);
  return renderCents((b * r) / 10n ** BigInt(rateScale));
}

describe('PPN 2022-2025 migration (Task 6) - source registry and concepts', () => {
  it('v2 carries the PPN category and the split PPN concepts', async () => {
    const v2 = await loadV2FromDisk();
    const cat = v2.categories.find((c) => c.slug === 'ppn' || c.id === 'cat-ppn');
    expect(cat, 'PPN category must exist').toBeDefined();
    for (const conceptId of [
      'concept-ppn-domestic-supply',
      'concept-ppn-import',
      'concept-ppn-export',
      'concept-ppn-foreign-utilization',
      'concept-ppn-luxury-retail',
      'concept-ppn-dpp-nilai-lain',
    ]) {
      expect(v2.concepts.find((c) => c.id === conceptId), `missing concept ${conceptId}`).toBeDefined();
    }
  });

  it('v2 carries the primary sources for UU HPP, UU PPN, PMK 131/2024, PMK 11/2025, PMK 53/2025', async () => {
    const v2 = await loadV2FromDisk();
    const sourceIds = new Set(v2.sources.map((s) => s.id));
    for (const id of [
      'src-uu-7-2021-hpp',
      'src-uu-8-1983-ppn',
      'src-pmk-131-2024',
      'src-pmk-11-2025',
      'src-pmk-53-2025',
    ]) {
      expect(sourceIds.has(id), `missing primary source ${id}`).toBe(true);
    }
    // All five must be official primary sources.
    for (const id of ['src-uu-7-2021-hpp', 'src-uu-8-1983-ppn', 'src-pmk-131-2024', 'src-pmk-11-2025', 'src-pmk-53-2025']) {
      const src = v2.sources.find((s) => s.id === id) as any;
      expect(src.official, `${id} must be official`).toBe(true);
      expect(src.role ?? 'primary', `${id} must be primary`).toBe('primary');
    }
  });

  it('UU HPP source locator pins the 11% from 2022-04-01 and the 12% from 2025-01-01 (Article 7 HPP)', async () => {
    const v2 = await loadV2FromDisk();
    const src = v2.sources.find((s) => s.id === 'src-uu-7-2021-hpp') as any;
    expect(src, 'UU HPP source must exist').toBeDefined();
    const locator = String(src.locator ?? '');
    // The HPP source locator must reference Pasal 7 / Article 7 and the 2022-04-01 boundary.
    expect(locator.toLowerCase()).toContain('pasal 7');
    expect(locator).toContain('2022-04-01');
    expect(locator).toContain('2025-01-01');
  });

  it('PMK 131/2024 source encodes Articles 2/3/4/5 with the DPP 11/12 factor and the luxury transition dates', async () => {
    const v2 = await loadV2FromDisk();
    const src = v2.sources.find((s) => s.id === 'src-pmk-131-2024') as any;
    expect(src, 'PMK 131/2024 source must exist').toBeDefined();
    const locator = String(src.locator ?? '');
    expect(locator).toContain('Pasal 2');
    expect(locator).toContain('Pasal 3');
    expect(locator).toContain('Pasal 5');
    expect(locator.toLowerCase()).toContain('11/12');
    expect(locator).toContain('2025-02-01');
  });

  it('PMK 131/2024 source carries a resolvable official URL on bpk.go.id or jdih.kemenkeu.go.id containing 131 and 2024 (not a placeholder)', async () => {
    // verified_primary requires a usable, resolvable official URL — a placeholder
    // path like /Details/2024/131/PMK.03 is not acceptable. The v1 data already
    // carries the resolvable BPK URL
    // https://peraturan.bpk.go.id/Details/204066/pmk-no-131-tahun-2024.
    const v2 = await loadV2FromDisk();
    const src = v2.sources.find((s) => s.id === 'src-pmk-131-2024') as any;
    expect(src, 'PMK 131/2024 source must exist').toBeDefined();
    expect(src.url, 'PMK 131/2024 source must carry a url').toBeTruthy();
    const url = String(src.url);
    const hostOk = /(^|\.)bpk\.go\.id\/|(^|\.)jdih\.kemenkeu\.go\.id\//.test(url);
    expect(hostOk, `PMK 131/2024 url must be on bpk.go.id or jdih.kemenkeu.go.id (got ${url})`).toBe(true);
    expect(url, 'PMK 131/2024 url must contain 131').toMatch(/131/);
    expect(url, 'PMK 131/2024 url must contain 2024').toMatch(/2024/);
    // A path-style placeholder slug like /Details/2024/131/PMK.03 (no host) is forbidden.
    expect(url.startsWith('https://'), `PMK 131/2024 url must be absolute https (got ${url})`).toBe(true);
    // The placeholder slug used pre-fix must not reappear.
    expect(url).not.toMatch(/\/Details\/2024\/131\/PMK\.03\/?$/);
  });

  it('the v2 dataset validates cleanly after migration', async () => {
    const v2 = await loadV2FromDisk();
    const report = validateV2(v2);
    if (!report.valid) {
      throw new Error('v2 semantic validation failed:\n' + JSON.stringify(report.issues.slice(0, 10), null, 2));
    }
    expect(report.valid).toBe(true);
  });
});

describe('PPN 2022-2025 migration (Task 6) - nominal vs DPP-factor vs effective-burden modeling', () => {
  let v2: V2Data;
  beforeAll(async () => { v2 = await loadV2FromDisk(); });

  it('does NOT store a generic 11% informational rate record for 2025', () => {
    // The brief is explicit: do NOT store '11%' as the only substantive 2025
    // rate. PPN rules with rate.type === 'percentage' and value === '0.11' that
    // carry verification 'verified_primary' with an open-ended 2025+ interval
    // and no DPP-factor / luxury / export / special-scheme condition would be a
    // misleading single number. Such a rule must not exist.
    const misleading = v2.rules.filter((r) => {
      if (r.categoryId !== 'cat-ppn') return false;
      if (r.rate?.type !== 'percentage') return false;
      if ((r.rate as any).value !== '0.11') return false;
      if (!r.validFrom || r.validFrom < '2025-01-01') return false;
      // Allowed only when paired with a real condition or DPP factor.
      const hasCondition = !!r.conditions;
      const notes = String(r.notes ?? '').toLowerCase();
      const hasDppNarrative = notes.includes('11/12') || notes.includes('dpp nilai lain');
      return !hasCondition && !hasDppNarrative;
    });
    expect(misleading, 'no unconditional 11% PPN rule for 2025+ may exist').toEqual([]);
  });

  it('2025 PPN non-luxury rules use information_factor 11/12 (DPP nilai lain) rather than a bare 11% rate', () => {
    const dppRules = v2.rules.filter((r) => {
      if (r.categoryId !== 'cat-ppn') return false;
      if (r.rate?.type !== 'information_factor') return false;
      return (r.rate as any).factor === '0.9166667' || (r.rate as any).factor === '0.91666667' || String((r.rate as any).factor).startsWith('0.9166');
    });
    expect(dppRules.length, 'at least one PPN DPP 11/12 information_factor rule must exist').toBeGreaterThan(0);
  });

  it('encodes the effective burden 12% × 11/12 = 11% as a computable note/formula, not as the only 2025 substantive rate', () => {
    // Look across 2025 PPN rules: at least one must reference the effective
    // burden so consumers can compute 11% from 12% × 11/12 without the dataset
    // silently claiming the 2025 substantive rate is unconditionally 11%.
    const joined = v2.rules
      .filter((r) => r.categoryId === 'cat-ppn')
      .map((r) => `${r.id}|${r.notes ?? ''}|${r.rate?.type === 'formula' ? (r.rate as any).expression : ''}`)
      .join('\n')
      .toLowerCase();
    expect(joined).toContain('11/12');
    expect(joined).toContain('efektif');
  });
});

describe('PPN 2022-2025 migration (Task 6) - boundary resolution', () => {
  let v2: V2Data;
  beforeAll(async () => {
    v2 = await loadV2FromDisk();
  });

  for (const boundary of FIXTURES.boundaries as any[]) {
    it(`boundary: ${boundary.id} — ${boundary.description}`, () => {
      const result = resolveAtDate(v2, {
        date: boundary.date,
        conceptId: boundary.request.conceptId,
        facts: boundary.request.facts,
      });

      const expectAny = (values: string[], actual: string) =>
        expect({ actual, ok: values.includes(actual) }).toEqual({ actual, ok: true });

      if (boundary.expect.determinationIn) {
        expectAny(boundary.expect.determinationIn, result.determination);
      }
      if (boundary.expect.missingFact) {
        expect([...new Set(result.candidates.flatMap((c) => c.missingFacts))]).toContain(boundary.expect.missingFact);
      }
      if (boundary.expect.winningRateFraction !== undefined) {
        const winner = result.candidates[0];
        expect(winner, 'expected a winning candidate').toBeDefined();
        const rate = winner!.rule.rate as Rate | undefined;
        expect(rate && rate.type === 'percentage' ? (rate as any).value : undefined).toBe(boundary.expect.winningRateFraction);
        if (boundary.expect.pphAmount !== undefined && boundary.request.facts.dpp) {
          expect(percentTimesBase(boundary.expect.winningRateFraction, String(boundary.request.facts.dpp))).toBe(boundary.expect.pphAmount);
        }
      }
      if (boundary.expect.winningRateType !== undefined) {
        const winner = result.candidates[0];
        expect(winner, 'expected a winning candidate').toBeDefined();
        expect(winner!.rule.rate?.type).toBe(boundary.expect.winningRateType);
      }
      if (boundary.expect.effectiveBurdenFraction !== undefined) {
        // The substantive answer for the non-luxury 2025 case is the effective
        // burden, not the nominal 12%. We assert the computed amount equals
        // (effectiveBurden × dpp) AND the candidate references an information_factor
        // or formula that encodes the DPP 11/12 reduction.
        const winner = result.candidates[0];
        expect(winner, 'expected a winning candidate').toBeDefined();
        if (boundary.expect.pphAmount !== undefined && boundary.request.facts.dpp) {
          expect(percentTimesBase(boundary.expect.effectiveBurdenFraction, String(boundary.request.facts.dpp))).toBe(boundary.expect.pphAmount);
        }
        const rule = winner!.rule;
        const hasFactorOrFormula =
          rule.rate?.type === 'information_factor' ||
          rule.rate?.type === 'formula' ||
          (rule.examples ?? []).some((e) => String(e.notes ?? '').toLowerCase().includes('11/12')) ||
          String(rule.notes ?? '').toLowerCase().includes('11/12');
        expect(hasFactorOrFormula, 'effective-burden candidate must reference 11/12 factor or DPP formula').toBe(true);
      }
      if (boundary.expect.informationFactor !== undefined) {
        // The DPP nilai lain factor (11/12) must be discoverable on the candidate
        // or a sibling rule within the same concept.
        const winner = result.candidates[0];
        expect(winner, 'expected a winning candidate').toBeDefined();
        const conceptId = winner!.rule.conceptId;
        const siblingHasFactor = v2.rules.some((r) => {
          if (r.conceptId !== conceptId) return false;
          if (r.rate?.type !== 'information_factor') return false;
          return String((r.rate as any).factor).startsWith('0.9166');
        });
        expect(siblingHasFactor, 'concept must carry an 11/12 information_factor rule').toBe(true);
      }
    });
  }
});

describe('PPN 2022-2025 migration (Task 6) - year 2025 returns conditional candidates', () => {
  let v2: V2Data;
  beforeAll(async () => { v2 = await loadV2FromDisk(); });

  it('a year-2025 query for the PPN category yields multiple segments (rentang) or surfaces conditional determination', () => {
    const result = resolveForYear(v2, 2025, { categoryId: 'cat-ppn' });
    // 2025 has both 11/12 DPP rules (effective 11%) and full-base 12% rules —
    // a single universal number is forbidden.
    expect(result.segments.length).toBeGreaterThanOrEqual(1);
    const allRuleIds = new Set(result.ruleIds);
    expect(allRuleIds.size, '2025 must reference more than one PPN rule').toBeGreaterThan(1);
    // Either multiple segments (rentang), or a conditional/factual determination
    // when only one segment is returned.
    const allowed = ['rentang', 'bersyarat', 'fakta_kurang', 'konflik_sumber'];
    expect(allowed.includes(result.determination)).toBe(true);
  });

  it('the PPN category description documents the 2025 conditional nature', async () => {
    const v2 = await loadV2FromDisk();
    const cat = v2.categories.find((c) => c.id === 'cat-ppn') as any;
    expect(cat, 'PPN category must exist').toBeDefined();
    const desc = String(cat.description ?? '').toLowerCase();
    expect(desc).toContain('2025');
    // Either the description mentions luxury / DPP / 11/12 explicitly, or the
    // category carries knownDiscrepancies that surface the conditional regime.
    const mentionsConditional =
      desc.includes('mewah') ||
      desc.includes('luxury') ||
      desc.includes('11/12') ||
      desc.includes('dpp') ||
      desc.includes('bersyarat') ||
      desc.includes('conditional') ||
      Array.isArray(cat.knownDiscrepancies);
    expect(mentionsConditional, 'PPN category must document the 2025 conditional regime').toBe(true);
  });
});

describe('PPN 2022-2025 migration (Task 6) - export 0% is distinct from exempt/non-object', () => {
  let v2: V2Data;
  beforeAll(async () => { v2 = await loadV2FromDisk(); });

  it('export carries rate type zero with UU PPN 7(2) evidence, not not_applicable', () => {
    const exportRules = v2.rules.filter((r) => r.conceptId === 'concept-ppn-export') as TaxRule[];
    expect(exportRules.length, 'concept-ppn-export must have at least one rule').toBeGreaterThan(0);
    const zeroRule = exportRules.find((r) => r.rate?.type === 'zero');
    expect(zeroRule, 'export must carry a zero rate').toBeDefined();
    const evidenceJoined = (zeroRule!.verification?.evidence ?? []).map((e) => e.locator).join('\n').toLowerCase();
    expect(evidenceJoined).toContain('pasal 7');
    expect(evidenceJoined).toMatch(/7.*\(.*2.*\)|ayat.*2|ekspor/);
  });
});

// Helpers exported for the calculator-parity contract.
export function ppnBoundaryFixtures() {
  return FIXTURES;
}
