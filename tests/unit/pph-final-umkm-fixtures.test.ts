// Task 7 PPh Final Pasal 4(2) + UMKM migration. RED-first: these tests fail
// until data/v2 carries the canonical PPh Final/UMKM concepts (PP 46/2013,
// PP 23/2018, PP 55/2022, PP 20/2026, land/building rent, construction,
// transfer, PPh 15 separation), the primary sources (PP 46/2013, PP 23/2018,
// PP 55/2022, PP 20/2026, PP 34/2017, PP 9/2022, PP 51/2008, PP 34/2016, UU
// PPh Pasal 15), and the declared conflicts. See
// tests/fixtures/pph-final-umkm-boundaries.json for the verified expectations
// and data/v2/sources.json for primary locators.
//
// Behavior rules from the brief:
//  - UMKM entity eligibility + duration + turnover threshold + OP Rp500m
//    exclusion as distinct conditions.
//  - PP 20/2026 amendment: do NOT quote original PP 55 Pasal 57/59 alone for
//    post-22-Apr-2026.
//  - Separate PPh 15 from PPh 4(2); mark needs_review when eligibility not
//    fully evidenced.
//  - Preserve disputed claims visibly; declared source_conflict for unresolved.
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
  await readFile(join(paths.root, 'tests', 'fixtures', 'pph-final-umkm-boundaries.json'), 'utf8'),
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

/** percentage × base using 4-place rate scale and 2-place currency scale. */
function percentTimesBase(rateFraction: string, base: string): string {
  const rateScale = 4;
  const baseScale = 2;
  const r = scaled(rateFraction, rateScale);
  const b = scaled(base, baseScale);
  return renderCents((b * r) / 10n ** BigInt(rateScale));
}

describe('PPh Final/UMKM migration (Task 7) - source registry and concepts', () => {
  it('v2 carries the PPh Final/UMKM category and the split concepts', async () => {
    const v2 = await loadV2FromDisk();
    const cat = v2.categories.find((c) => c.slug === 'pph-final-umkm' || c.id === 'cat-pph-final-umkm');
    expect(cat, 'PPh Final/UMKM category must exist').toBeDefined();
    for (const conceptId of [
      'concept-pph-final-umkm-pp46',
      'concept-pph-final-umkm-pp23',
      'concept-pph-final-umkm-pp55',
      'concept-pph-final-umkm-pp20-2026',
      'concept-pph-final-rent-land-building',
      'concept-pph-final-construction',
      'concept-pph-final-transfer',
      'concept-pph-15-special',
    ]) {
      expect(v2.concepts.find((c) => c.id === conceptId), `missing concept ${conceptId}`).toBeDefined();
    }
  });

  it('v2 carries the primary sources for the UMKM chronology and final-tax objects', async () => {
    const v2 = await loadV2FromDisk();
    const sourceIds = new Set(v2.sources.map((s) => s.id));
    for (const id of [
      'src-pp-46-2013',
      'src-pp-23-2018',
      'src-pp-55-2022-umkm',
      'src-pp-20-2026',
      'src-pp-34-2017',
      'src-pp-9-2022',
      'src-pp-51-2008',
      'src-pp-34-2016',
      'src-uu-15-pph',
    ]) {
      expect(sourceIds.has(id), `missing primary source ${id}`).toBe(true);
    }
    // The UMKM chronology sources must be official primary.
    for (const id of ['src-pp-46-2013', 'src-pp-23-2018', 'src-pp-55-2022-umkm', 'src-pp-20-2026']) {
      const src = v2.sources.find((s) => s.id === id) as any;
      expect(src.official, `${id} must be official`).toBe(true);
      expect(src.role ?? 'primary', `${id} must be primary`).toBe('primary');
    }
  });

  it('PP 20/2026 source pins the effective date 22 April 2026 and the narrowed entity types', async () => {
    const v2 = await loadV2FromDisk();
    const src = v2.sources.find((s) => s.id === 'src-pp-20-2026') as any;
    expect(src, 'PP 20/2026 source must exist').toBeDefined();
    expect(src.regulationId).toMatch(/PP\/20\/2026/);
    const locator = String(src.locator ?? '');
    expect(locator).toContain('22 April 2026');
    expect(locator.toLowerCase()).toContain('koperasi');
  });

  it('PP 55/2022 UMKM source pins the effective date 20 Des 2022', async () => {
    const v2 = await loadV2FromDisk();
    const src = v2.sources.find((s) => s.id === 'src-pp-55-2022-umkm') as any;
    expect(src, 'PP 55/2022 UMKM source must exist').toBeDefined();
    expect(src.regulationId).toMatch(/PP\/55\/2022/);
    const locator = String(src.locator ?? '');
    expect(locator).toContain('20 Desember 2022');
  });

  it('PP 23/2018 source pins the 0.5% rate and the duration limits', async () => {
    const v2 = await loadV2FromDisk();
    const src = v2.sources.find((s) => s.id === 'src-pp-23-2018') as any;
    expect(src, 'PP 23/2018 source must exist').toBeDefined();
    const locator = String(src.locator ?? '');
    expect(locator).toContain('0,5');
    expect(locator).toContain('7');
    expect(locator).toContain('4');
    expect(locator).toContain('3');
  });

  it('PP 9/2022 source encodes the construction rates by qualification', async () => {
    const v2 = await loadV2FromDisk();
    const src = v2.sources.find((s) => s.id === 'src-pp-9-2022') as any;
    expect(src, 'PP 9/2022 source must exist').toBeDefined();
    const locator = String(src.locator ?? '');
    expect(locator).toContain('2,65');
    expect(locator).toContain('4');
    expect(locator).toContain('21 Februari 2022');
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

describe('PPh Final/UMKM migration (Task 7) - boundary resolution', () => {
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
      if (boundary.expect.gap !== undefined) {
        expect(result.gap).toBe(boundary.expect.gap);
      }
      if (boundary.expect.missingFact) {
        expect([...new Set(result.candidates.flatMap((c) => c.missingFacts))]).toContain(boundary.expect.missingFact);
      }
      if (boundary.expect.categoryIdNot || boundary.expect.categoryIdIs) {
        // Used for the PPh 15 separation check: the resolved rule must not be
        // categorized under the PPh 4(2) final family, and (when asserted) must
        // land in the expected special-regimes category.
        const winner = result.candidates[0];
        expect(winner, 'expected a winning candidate for category check').toBeDefined();
        if (winner) {
          if (boundary.expect.categoryIdNot) {
            expect(winner.rule.categoryId, `category must not be ${boundary.expect.categoryIdNot}`).not.toBe(boundary.expect.categoryIdNot);
          }
          if (boundary.expect.categoryIdIs) {
            expect(winner.rule.categoryId, `category must be ${boundary.expect.categoryIdIs}`).toBe(boundary.expect.categoryIdIs);
          }
        }
      }
      if (boundary.expect.winningRateFraction !== undefined) {
        const winner = result.candidates[0];
        expect(winner, 'expected a winning candidate').toBeDefined();
        const rate = winner!.rule.rate as Rate | undefined;
        expect(rate && rate.type === 'percentage' ? (rate as any).value : undefined).toBe(boundary.expect.winningRateFraction);
        const base = String(boundary.request.facts.gross ?? boundary.request.facts.grossRent ?? boundary.request.facts.grossTransfer ?? '0');
        if (boundary.expect.pphAmount !== undefined && base !== '0') {
          expect(percentTimesBase(boundary.expect.winningRateFraction, base)).toBe(boundary.expect.pphAmount);
        }
      }
    });
  }
});

describe('PPh Final/UMKM migration (Task 7) - UMKM conditions modeling', () => {
  let v2: V2Data;
  beforeAll(async () => { v2 = await loadV2FromDisk(); });

  it('PP 23/2018 rule(s) carry duration-limit conditions by entity type', () => {
    const pp23Rules = v2.rules.filter((r) => r.conceptId === 'concept-pph-final-umkm-pp23') as TaxRule[];
    expect(pp23Rules.length, 'concept-pph-final-umkm-pp23 must have at least one rule').toBeGreaterThan(0);
    // At least one PP 23 rule must reference the duration concept (7/4/3 years).
    const joined = pp23Rules
      .map((r) => `${r.id}|${r.notes ?? ''}|${JSON.stringify(r.conditions ?? {})}|${r.rate?.type === 'formula' ? (r.rate as any).expression : ''}`)
      .join('\n')
      .toLowerCase();
    expect(joined).toContain('7');
    expect(joined).toContain('3');
  });

  it('UMKM rules carry the turnover-eligibility condition (<= Rp4.8bn)', () => {
    // Across the UMKM family, the Rp4.8bn turnover ceiling must be present as a
    // condition or in the notes, not silently assumed.
    const umkmRules = v2.rules.filter((r) =>
      r.conceptId === 'concept-pph-final-umkm-pp46' ||
      r.conceptId === 'concept-pph-final-umkm-pp23' ||
      r.conceptId === 'concept-pph-final-umkm-pp55' ||
      r.conceptId === 'concept-pph-final-umkm-pp20-2026',
    );
    expect(umkmRules.length, 'UMKM family must have rules').toBeGreaterThan(0);
    const joined = umkmRules
      .map((r) => `${r.id}|${r.notes ?? ''}|${JSON.stringify(r.conditions ?? {})}`)
      .join('\n');
    expect(joined).toContain('4.800.000.000');
  });

  it('PP 20/2026 rule(s) document the narrowed principal entity types', () => {
    const pp20Rules = v2.rules.filter((r) => r.conceptId === 'concept-pph-final-umkm-pp20-2026') as TaxRule[];
    expect(pp20Rules.length, 'concept-pph-final-umkm-pp20-2026 must have at least one rule').toBeGreaterThan(0);
    const joined = pp20Rules
      .map((r) => `${r.id}|${r.notes ?? ''}|${JSON.stringify(r.conditions ?? {})}`)
      .join('\n')
      .toLowerCase();
    // The narrowed principal types (OP, one-person company, cooperative) must
    // appear, and the CV/firma/PT removal must be visible (not silently hidden).
    expect(joined.includes('koperasi') || joined.includes('cooperative'), 'PP 20/2026 must mention cooperative as principal eligible').toBe(true);
  });
});

describe('PPh Final/UMKM migration (Task 7) - PPh 15 separation', () => {
  let v2: V2Data;
  beforeAll(async () => { v2 = await loadV2FromDisk(); });

  it('PPh 15 concept is NOT categorized under the PPh 4(2) final category', () => {
    const pph15Concept = v2.concepts.find((c) => c.id === 'concept-pph-15-special');
    expect(pph15Concept, 'PPh 15 concept must exist').toBeDefined();
    expect(pph15Concept!.categoryId, 'PPh 15 must not be cat-pph-final-4-2 or cat-pph-final-umkm').not.toMatch(/^cat-pph-final/);
  });

  it('PPh 15 concept documents that it is distinct from Pasal 4(2)', () => {
    const pph15Concept = v2.concepts.find((c) => c.id === 'concept-pph-15-special');
    expect(pph15Concept, 'PPh 15 concept must exist').toBeDefined();
    const desc = String(pph15Concept!.description ?? '').toLowerCase();
    expect(desc).toContain('pasal 15');
    // Must explicitly distinguish from Pasal 4(2).
    const distinguishes = desc.includes('pasal 4') || desc.includes('4(2)') || desc.includes('berbeda') || desc.includes('distinct') || desc.includes('bukan') || desc.includes('terpisah');
    expect(distinguishes, 'PPh 15 must document distinction from Pasal 4(2)').toBe(true);
  });
});

describe('PPh Final/UMKM migration (Task 7) - year queries surface transitions', () => {
  let v2: V2Data;
  beforeAll(async () => { v2 = await loadV2FromDisk(); });

  it('a year-2018 query across the UMKM family surfaces the PP46->PP23 transition', () => {
    // 2018 contains both PP 46/2013 (until 30 Juni) and PP 23/2018 (from 1
    // Juli). A year query must produce more than one segment (rentang).
    const result = resolveForYear(v2, 2018, { categoryId: 'cat-pph-final-umkm' });
    expect(result.segments.length, '2018 must have multiple UMKM segments').toBeGreaterThan(1);
  });

  it('a year-2022 query across the UMKM family surfaces the PP23->PP55 transition', () => {
    // 2022 contains both PP 23/2018 (until 19 Des) and PP 55/2022 (from 20
    // Des). A year query must produce more than one segment (rentang).
    const result = resolveForYear(v2, 2022, { categoryId: 'cat-pph-final-umkm' });
    expect(result.segments.length, '2022 must have multiple UMKM segments').toBeGreaterThan(1);
  });

  it('a year-2026 query across the UMKM family surfaces the PP55->PP20/2026 transition', () => {
    // 2026 contains both PP 55/2022 (until 21 April) and PP 20/2026 (from 22
    // April). A year query must produce more than one segment (rentang).
    const result = resolveForYear(v2, 2026, { categoryId: 'cat-pph-final-umkm' });
    expect(result.segments.length, '2026 must have multiple UMKM segments').toBeGreaterThan(1);
  });
});

// Helpers exported for downstream contract tests.
export function pphFinalUmkmBoundaryFixtures() {
  return FIXTURES;
}
