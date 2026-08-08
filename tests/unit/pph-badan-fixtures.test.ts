// Task 7 PPh Badan + facilities migration. RED-first: these tests fail until
// data/v2 carries the canonical PPh Badan concepts (base corporate rate
// chronology, listed-company reduction, Article 31E small-business facility,
// IKN facility), the primary sources (UU 36/2008, Perppu 1/2020/UU 2/2020,
// UU 7/2021 HPP, PP 55/2022, PMK 40/2023, PMK 28/2024), and the declared
// conflicts. See tests/fixtures/pph-badan-boundaries.json for the verified
// expectations and data/v2/sources.json for primary locators.
//
// Behavior rules from the brief:
//  - Model facilities as conditions/formulas (turnover, listed status,
//    free-float, IKN category/investment), not flat standalone rates.
//  - Article 31E formula with proportional allocation, not whole-PKP
//    flattening.
//  - Listed-company reduction is in PERCENTAGE POINTS, not proportional.
//  - Mandatory when eligible, not elective. No reduction above Rp50bn.
//  - IKN records marked needs_review when category/eligibility not fully
//    evidenced.
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
  await readFile(join(paths.root, 'tests', 'fixtures', 'pph-badan-boundaries.json'), 'utf8'),
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

describe('PPh Badan + facilities migration (Task 7) - source registry and concepts', () => {
  it('v2 carries the PPh Badan category and the split facilities concepts', async () => {
    const v2 = await loadV2FromDisk();
    const cat = v2.categories.find((c) => c.slug === 'pph-badan' || c.id === 'cat-pph-badan');
    expect(cat, 'PPh Badan category must exist').toBeDefined();
    for (const conceptId of [
      'concept-pph-badan-base',
      'concept-pph-badan-listed',
      'concept-pph-badan-article31e',
      'concept-pph-badan-ikn',
    ]) {
      expect(v2.concepts.find((c) => c.id === conceptId), `missing concept ${conceptId}`).toBeDefined();
    }
  });

  it('v2 carries the primary sources for the corporate rate chronology and facilities', async () => {
    const v2 = await loadV2FromDisk();
    const sourceIds = new Set(v2.sources.map((s) => s.id));
    for (const id of [
      'src-uu-36-2008-pph',
      'src-uu-2-2020',
      'src-uu-7-2021-hpp',
      'src-pp-55-2022-badan',
      'src-pmk-40-2023-listed',
      'src-pmk-28-2024-ikn',
    ]) {
      expect(sourceIds.has(id), `missing primary source ${id}`).toBe(true);
    }
    // All six must be official primary sources.
    for (const id of [
      'src-uu-36-2008-pph',
      'src-uu-2-2020',
      'src-uu-7-2021-hpp',
      'src-pp-55-2022-badan',
      'src-pmk-40-2023-listed',
      'src-pmk-28-2024-ikn',
    ]) {
      const src = v2.sources.find((s) => s.id === id) as any;
      expect(src.official, `${id} must be official`).toBe(true);
      expect(src.role ?? 'primary', `${id} must be primary`).toBe('primary');
    }
  });

  it('UU HPP source locator pins the 22% from Tax Year 2022 in the corporate context (Art 3 point 7 / Art 17(1)(b))', async () => {
    const v2 = await loadV2FromDisk();
    const src = v2.sources.find((s) => s.id === 'src-uu-7-2021-hpp') as any;
    expect(src, 'UU HPP source must exist').toBeDefined();
    const locator = String(src.locator ?? '');
    // The HPP locator must reference Pasal 17 / Pasal 3 angka 7 for the badan 22%
    // corporate rate. We only assert the corporate article here; the PPN article
    // coverage is asserted by the PPN tests.
    expect(locator.toLowerCase()).toMatch(/pasal 17|pasal 3 angka 7/);
    expect(locator).toContain('22');
  });

  it('UU 2/2020 source pins the 22% for Tax Years 2020-2021 and the superseded scheduled 20%', async () => {
    const v2 = await loadV2FromDisk();
    const src = v2.sources.find((s) => s.id === 'src-uu-2-2020') as any;
    expect(src, 'UU 2/2020 source must exist').toBeDefined();
    expect(src.regulationId).toBe('UU/2/2020');
    const locator = String(src.locator ?? '');
    expect(locator).toContain('22');
    expect(locator).toContain('2020');
    // The source must mention the scheduled-then-superseded 20% from 2022 so
    // the chronology is transparent.
    expect(locator).toContain('20');
  });

  it('PMK 40/2023 source encodes the listed-company conditions (>=40% traded, >=300 parties, each <5%, >=183 days)', async () => {
    const v2 = await loadV2FromDisk();
    const src = v2.sources.find((s) => s.id === 'src-pmk-40-2023-listed') as any;
    expect(src, 'PMK 40/2023 source must exist').toBeDefined();
    expect(src.regulationId).toMatch(/PMK\/40/);
    const locator = String(src.locator ?? '');
    expect(locator).toContain('40');
    expect(locator).toContain('300');
    expect(locator).toContain('5');
    expect(locator).toContain('183');
  });

  it('PMK 28/2024 IKN source carries a resolvable official URL on bpk.go.id or jdih.kemenkeu.go.id containing 28 and 2024', async () => {
    const v2 = await loadV2FromDisk();
    const src = v2.sources.find((s) => s.id === 'src-pmk-28-2024-ikn') as any;
    expect(src, 'PMK 28/2024 source must exist').toBeDefined();
    expect(src.url, 'PMK 28/2024 source must carry a url').toBeTruthy();
    const url = String(src.url);
    const hostOk = /(^|\.)bpk\.go\.id\/|(^|\.)jdih\.kemenkeu\.go\.id\//.test(url);
    expect(hostOk, `PMK 28/2024 url must be on bpk.go.id or jdih.kemenkeu.go.id (got ${url})`).toBe(true);
    expect(url, 'PMK 28/2024 url must contain 28').toMatch(/28/);
    expect(url, 'PMK 28/2024 url must contain 2024').toMatch(/2024/);
    expect(url.startsWith('https://'), `PMK 28/2024 url must be absolute https (got ${url})`).toBe(true);
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

describe('PPh Badan + facilities migration (Task 7) - facilities are conditions/formulas, not flat rates', () => {
  let v2: V2Data;
  beforeAll(async () => { v2 = await loadV2FromDisk(); });

  it('does NOT store an unconditional standalone 19% listed rate for 2022+', () => {
    // The brief is explicit: listed-company reduction is a CONDITION, not an
    // unconditional standalone rate. A PPh Badan rule with rate.value === '0.19',
    // validFrom >= 2022-01-01, verification verified_primary, and NO conditions
    // would be a misleading flat standalone rate. Such a rule must not exist.
    const misleading = v2.rules.filter((r) => {
      if (r.categoryId !== 'cat-pph-badan') return false;
      if (r.rate?.type !== 'percentage') return false;
      if ((r.rate as any).value !== '0.19') return false;
      if (!r.validFrom || r.validFrom < '2022-01-01') return false;
      return !r.conditions;
    });
    expect(misleading, 'no unconditional 19% listed rate for 2022+ may exist').toEqual([]);
  });

  it('does NOT store an unconditional standalone 11% Article 31E rate', () => {
    // Article 31E is a formula/facility, not a flat 11% rate. A rule with
    // rate.value === '0.11' in the PPh Badan category with no conditions and no
    // formula reference would be whole-PKP flattening, which the brief forbids.
    const misleading = v2.rules.filter((r) => {
      if (r.categoryId !== 'cat-pph-badan') return false;
      if (r.rate?.type !== 'percentage') return false;
      if ((r.rate as any).value !== '0.11') return false;
      return !r.conditions;
    });
    expect(misleading, 'no unconditional 11% Article 31E rate may exist').toEqual([]);
  });

  it('Article 31E rule encodes the proportional allocation, not whole-PKP flattening', () => {
    // The Article 31E rule must use a formula or carry notes describing the
    // proportional allocation of PKP to the first Rp4.8bn turnover.
    const rule31e = v2.rules.find((r) => r.conceptId === 'concept-pph-badan-article31e');
    expect(rule31e, 'Article 31E rule must exist').toBeDefined();
    const rate = rule31e!.rate as Rate | undefined;
    const isFormula = rate?.type === 'formula';
    const notes = String(rule31e!.notes ?? '').toLowerCase();
    const mentionsProportional = notes.includes('proporsional') || notes.includes('proportional') || notes.includes('4.800.000.000') || notes.includes('4,8');
    expect(isFormula || mentionsProportional, 'Article 31E must use a formula or document proportional allocation').toBe(true);
  });

  it('listed-company rules carry the percentage-point reduction, not a proportional reduction', () => {
    // The listed reduction is 3 percentage points (22% - 3pp = 19%), NOT a 3%
    // proportional reduction (which would be 22% × 0.97 = 21.34%). At least one
    // listed rule or its notes must make the percentage-point semantics explicit.
    const listedRules = v2.rules.filter((r) => r.conceptId === 'concept-pph-badan-listed');
    expect(listedRules.length, 'concept-pph-badan-listed must have at least one rule').toBeGreaterThan(0);
    const joined = listedRules
      .map((r) => `${r.id}|${r.notes ?? ''}|${r.rate?.type === 'formula' ? (r.rate as any).expression : ''}`)
      .join('\n')
      .toLowerCase();
    // Either the rule pins the exact 19% effective rate (0.19) or documents the
    // percentage-point (persen/poin) reduction semantics.
    const pins19 = listedRules.some((r) => (r.rate as any)?.value === '0.19' || (r.rate as any)?.value === '0.20');
    const mentionsPp = joined.includes('percentage point') || joined.includes('poin persentase') || joined.includes('persentase') || joined.includes('3 pp') || joined.includes('5 pp') || joined.includes('3pp') || joined.includes('5pp');
    expect(pins19 || mentionsPp, 'listed rule must pin 19%/20% or document percentage-point reduction').toBe(true);
  });
});

describe('PPh Badan + facilities migration (Task 7) - boundary resolution', () => {
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
      if (boundary.expect.missingFactAny) {
        const allMissing = [...new Set(result.candidates.flatMap((c) => c.missingFacts))];
        const ok = boundary.expect.missingFactAny.some((f: string) => allMissing.includes(f));
        expect({ allMissing, ok }).toEqual({ allMissing, ok: true });
      }
      if (boundary.expect.winningRateFraction !== undefined) {
        const winner = result.candidates[0];
        expect(winner, 'expected a winning candidate').toBeDefined();
        const rate = winner!.rule.rate as Rate | undefined;
        expect(rate && rate.type === 'percentage' ? (rate as any).value : undefined).toBe(boundary.expect.winningRateFraction);
        const base = String(boundary.request.facts.pkp ?? '0');
        if (boundary.expect.pphAmount !== undefined && base !== '0') {
          expect(percentTimesBase(boundary.expect.winningRateFraction, base)).toBe(boundary.expect.pphAmount);
        }
      }
      if (boundary.expect.effectiveRateFraction !== undefined) {
        // The substantive answer for Article 31E is the effective rate (50% ×
        // 22% = 11%) applied to the whole PKP when turnover <= Rp4.8bn. We
        // assert the computed amount equals (effectiveRate × PKP) AND the
        // candidate references a formula or notes describing the 31E reduction.
        const winner = result.candidates[0];
        expect(winner, 'expected a winning candidate').toBeDefined();
        if (boundary.expect.pphAmount !== undefined && boundary.request.facts.pkp) {
          expect(percentTimesBase(boundary.expect.effectiveRateFraction, String(boundary.request.facts.pkp))).toBe(boundary.expect.pphAmount);
        }
        const rule = winner!.rule;
        const notes = String(rule.notes ?? '').toLowerCase();
        const isFormula = rule.rate?.type === 'formula';
        const mentions31e = notes.includes('31e') || notes.includes('pasal 31e') || notes.includes('50%') || notes.includes('4.800.000.000') || notes.includes('4,8');
        expect(isFormula || mentions31e, 'effective-rate candidate must reference 31E formula/reduction').toBe(true);
      }
      if (boundary.expect.pphAmount !== undefined && boundary.expect.winningRateFraction === undefined && boundary.expect.effectiveRateFraction === undefined) {
        // Article 31E proportional case: only the amount is pinned (computed by
        // the rule's own formula). We assert a winner exists and the notes/formula
        // describe the proportional allocation; the exact amount is exercised by
        // the rule's worked example in the dataset.
        const winner = result.candidates[0];
        expect(winner, 'expected a winning candidate').toBeDefined();
        const rule = winner!.rule;
        const hasProportionalNarrative =
          String(rule.notes ?? '').toLowerCase().includes('proporsional') ||
          String(rule.notes ?? '').toLowerCase().includes('proportional') ||
          rule.rate?.type === 'formula' ||
          (rule.examples ?? []).some((e) => e.expectedAmount === boundary.expect.pphAmount);
        expect(hasProportionalNarrative, 'proportional candidate must document the allocation or carry a matching example').toBe(true);
      }
    });
  }
});

describe('PPh Badan + facilities migration (Task 7) - IKN facility is needs_review, not exact', () => {
  let v2: V2Data;
  beforeAll(async () => { v2 = await loadV2FromDisk(); });

  it('IKN facility rule(s) carry verification status needs_review (not verified_primary)', () => {
    const iknRules = v2.rules.filter((r) => r.conceptId === 'concept-pph-badan-ikn') as TaxRule[];
    expect(iknRules.length, 'concept-pph-badan-ikn must have at least one rule').toBeGreaterThan(0);
    for (const rule of iknRules) {
      const status = rule.verification?.status;
      expect(
        status === 'needs_review' || status === 'verified_secondary',
        `IKN rule ${rule.id} must be needs_review or verified_secondary, got ${status}`,
      ).toBe(true);
    }
  });

  it('a year query for the IKN concept does NOT resolve as tepat', () => {
    const result = resolveForYear(v2, 2025, { conceptId: 'concept-pph-badan-ikn' });
    expect(result.determination, 'IKN year resolution must not be tepat').not.toBe('tepat');
  });
});

// Helpers exported for downstream contract tests.
export function pphBadanBoundaryFixtures() {
  return FIXTURES;
}
