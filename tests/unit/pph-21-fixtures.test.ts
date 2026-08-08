// Task 4 PPh 21 / TER boundary fixtures. RED-first: these tests fail until
// data/v2 carries the canonical PPh 21/TER rules, concepts, categories, and
// sources built from primary evidence (PP 58/2023, PMK 168/2023, UU 7/2021 HPP,
// PTKP PMK chronology). See tests/fixtures/pph-21-boundaries.json for the
// verified expectations and data/v2/sources.json for the primary locators.
//
// The resolver is pure; we load the on-disk v2 corpus so these tests also prove
// the migration produces a coherent dataset (not just in-memory fixtures).

import { beforeAll, describe, expect, it } from 'vitest';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { getProjectPaths } from '../../src/paths.ts';
import { loadJsonFile } from '../../src/validation/load.ts';
import { resolveAtDate } from '../../src/core/resolver.ts';
import { calculateProgressive, formatRate } from '../../src/core/rate.ts';
import { validateV2 } from '../../src/validation/semantic.ts';
import type { V2Data, TaxRule, ProgressiveBracket } from '../../src/core/types.ts';

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
  await readFile(join(paths.root, 'tests', 'fixtures', 'pph-21-boundaries.json'), 'utf8'),
) as any;

const CATEGORY_BY_PTKP: Record<string, string> = {
  'TK/0': 'TER A',
  'TK/1': 'TER A',
  'K/0': 'TER A',
  'TK/2': 'TER B',
  'K/1': 'TER B',
  'TK/3': 'TER B',
  'K/2': 'TER B',
  'K/3': 'TER C',
};

function findRule(rules: TaxRule[], conceptId: string, date: string): TaxRule | undefined {
  return rules.find((r) => r.conceptId === conceptId && r.validFrom <= date && (r.validToExclusive === null || date < r.validToExclusive));
}

function terCategoryForRule(rule: TaxRule): string | undefined {
  // Each TER rule conditions on a ptkpClass list. Infer the category from the
  // condition value (A: TK/0/TK/1/K/0; B: TK/2/K/1/TK/3/K/2; C: K/3).
  const c = rule.conditions;
  if (!c) return undefined;
  if (c.op === 'in' && Array.isArray(c.value)) {
    return CATEGORY_BY_PTKP[String(c.value[0])];
  }
  if (c.op === 'equals') {
    return CATEGORY_BY_PTKP[String(c.value)];
  }
  return undefined;
}

/** Look up the monthly TER rate fraction (decimal string) for a category + gross amount. */
function terRateForAmount(brackets: ProgressiveBracket[], gross: string): { rate: string } {
  const scale = 2;
  const amount = scaled(gross, scale);
  for (const bracket of brackets) {
    const upper = bracket.upTo === null ? null : scaled(bracket.upTo, scale);
    // Half-open: lower exclusive, upper inclusive.
    if (upper === null || amount <= upper) return { rate: bracket.rate };
  }
  throw new Error('TER bracket table missing open-ended band');
}

function scaled(value: string, scale: number): bigint {
  const [int = '', frac = ''] = value.split('.');
  return BigInt(`${int}${frac.padEnd(scale, '0').slice(0, scale)}`.replace(/^0+(?=\d)/, '') || '0');
}

describe('PPh 21 / TER migration (Task 4) - primary-source integrity', () => {
  it('fixture file encodes the verified effective dates and category mapping', () => {
    expect(FIXTURES.effectiveDate.terStart).toBe('2024-01-01');
    expect(FIXTURES.effectiveDate.terDayBeforeStart).toBe('2023-12-31');
    expect(FIXTURES.categoryMapping['TER A'].ptkpClasses).toEqual(['TK/0', 'TK/1', 'K/0']);
    expect(FIXTURES.categoryMapping['TER B'].ptkpClasses).toEqual(['TK/2', 'K/1', 'TK/3', 'K/2']);
    expect(FIXTURES.categoryMapping['TER C'].ptkpClasses).toEqual(['K/3']);
  });

  it('v2 carries the PPh 21 category, TER concepts, and primary sources', async () => {
    const v2 = await loadV2FromDisk();
    const cat = v2.categories.find((c) => c.slug === 'pph-21' || c.id === 'cat-pph-21');
    expect(cat, 'PPh 21 category must exist').toBeDefined();
    for (const conceptId of [
      'concept-pph-21-ter-monthly',
      'concept-pph-21-ter-daily',
      'concept-pph-21-article17-annual',
      'concept-pph-21-final-period',
      'concept-pph-21-ptkp',
      'concept-pph-21-recipient-nonresident',
      'concept-pph-21-recipient-nonemployee',
      'concept-pph-21-recipient-activity-participant',
      'concept-pph-21-recipient-pension-participant',
      'concept-pph-21-recipient-former-employee',
      'concept-pph-21-recipient-commissioner',
    ]) {
      expect(v2.concepts.find((c) => c.id === conceptId), `missing concept ${conceptId}`).toBeDefined();
    }
    // Primary-source registry additions for PP 58/2023, PMK 168/2023, UU HPP, PTKP PMKs.
    const sourceIds = new Set(v2.sources.map((s) => s.id));
    for (const id of ['src-pp-58-2023', 'src-pmk-168-2023', 'src-uu-7-2021-hpp', 'src-pmk-101-2016-ptkp', 'src-pmk-122-2015-ptkp', 'src-pmk-162-2012-ptkp']) {
      expect(sourceIds.has(id), `missing primary source ${id}`).toBe(true);
    }
  });

  it('the v2 dataset validates cleanly after migration', async () => {
    const v2 = await loadV2FromDisk();
    const report = validateV2(v2);
    if (!report.valid) {
      // Surface the first few issues so the failure is debuggable.
      throw new Error('v2 semantic validation failed:\n' + JSON.stringify(report.issues.slice(0, 10), null, 2));
    }
    expect(report.valid).toBe(true);
  });
});

describe('PPh 21 / TER migration (Task 4) - boundary resolution', () => {
  // Pre-resolve once; all boundary assertions reuse this corpus.
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
      if (boundary.expect.terCandidates !== undefined) {
        const terCandidates = result.candidates.filter((c) => c.rule.conceptId === 'concept-pph-21-ter-monthly');
        expect(terCandidates.length).toBe(boundary.expect.terCandidates);
      }
      if (boundary.expect.gap !== undefined) {
        expect(result.gap).toBe(boundary.expect.gap);
      }
      if (boundary.expect.missingFact) {
        expect([...new Set(result.candidates.flatMap((c) => c.missingFacts))]).toContain(boundary.expect.missingFact);
      }
      if (boundary.expect.winningCategory) {
        const winner = result.candidates.find((c) => c.rule.conceptId === 'concept-pph-21-ter-monthly');
        expect(winner, 'expected a TER monthly winner').toBeDefined();
        expect(terCategoryForRule(winner!.rule)).toBe(boundary.expect.winningCategory);
        if (boundary.expect.rateFraction !== undefined && winner!.rule.rate && winner!.rule.rate.type === 'progressive') {
          const { rate } = terRateForAmount(winner!.rule.rate.brackets, String(boundary.request.facts.monthlyGross));
          expect(rate).toBe(boundary.expect.rateFraction);
          if (boundary.expect.pphAmount !== undefined) {
            const gross = String(boundary.request.facts.monthlyGross);
            const computed = terTimesGross(rate, gross);
            expect(computed).toBe(boundary.expect.pphAmount);
          }
        }
      }
      if (boundary.expect.winningRateFraction !== undefined) {
        const winner = result.candidates[0];
        expect(winner, 'expected a winning candidate').toBeDefined();
        expect(winner!.rule.rate && winner!.rule.rate.type === 'percentage' ? (winner!.rule.rate as any).value : undefined).toBe(boundary.expect.winningRateFraction);
      }
      if (boundary.expect.winningRuleId !== undefined) {
        const winnerIds = result.candidates.map((c) => c.rule.id);
        expect(winnerIds, `expected a winner ${boundary.expect.winningRuleId} among ${JSON.stringify(winnerIds)}`).toContain(boundary.expect.winningRuleId);
      }
      if (boundary.expect.pphAmount !== undefined && boundary.request.conceptId === 'concept-pph-21-article17-annual') {
        const rule = findRule(v2.rules, 'concept-pph-21-article17-annual', boundary.date);
        expect(rule && rule.rate && rule.rate.type === 'progressive', 'Article 17 rule must be progressive').toBe(true);
        const computed = calculateProgressive(String(boundary.request.facts.pkpAnnual), (rule!.rate as any).brackets);
        expect(computed).toBe(boundary.expect.pphAmount);
      }
      if (boundary.expect.pphAmount !== undefined && boundary.request.conceptId === 'concept-pph-21-final-period') {
        // Final period: Article 17 annual minus prior withheld. 300M annual PKP -> 44M annual tax; minus 30M prior = 14M.
        const rule = findRule(v2.rules, 'concept-pph-21-final-period', boundary.date);
        expect(rule, 'final period concept must resolve').toBeDefined();
        // The fixture encodes the expected true-up; we re-derive it here for clarity.
        const annual = calculateProgressive('300000000', (v2.rules.find((r) => r.conceptId === 'concept-pph-21-article17-annual' && r.rate!.type === 'progressive')!.rate as any).brackets);
        const prior = String(boundary.request.facts.priorWithheld);
        const topUp = subtractDecimal(annual, prior);
        expect(topUp).toBe(boundary.expect.pphAmount);
      }
      if (boundary.expect.ptkp) {
        const rule = findRule(v2.rules, 'concept-pph-21-ptkp', boundary.date);
        expect(rule, 'PTKP concept must resolve for the date').toBeDefined();
        expect((rule as any).ptkpTable).toMatchObject(boundary.expect.ptkp);
        if (boundary.expect.validFromTaxYear !== undefined) expect((rule as any).validFromTaxYear).toBe(boundary.expect.validFromTaxYear);
        if (boundary.expect.validToTaxYearInclusive !== undefined) expect((rule as any).validToTaxYearInclusive).toBe(boundary.expect.validToTaxYearInclusive);
      }
    });
  }
});

describe('PPh 21 / TER migration (Task 4) - reclassification & conflict surfacing', () => {
  it('natura/SHU/pre-2024 entries are not standalone verified rates', async () => {
    const v2 = await loadV2FromDisk();
    const reclass = FIXTURES.reclassification as any;
    const flagged = new Set([...(reclass.informationFactor ?? []), ...(reclass.summaryOnly ?? [])] as string[]);
    for (const rule of v2.rules) {
      // A rule whose notes indicate it represents a natura/SHU/pre-2024-permanent entry must not be verified_primary.
      if (Array.isArray((rule as any).reclassifiedFrom) && (rule as any).reclassifiedFrom.some((id: string) => flagged.has(id))) {
        expect(['information_factor', 'summary_only', 'needs_review', 'source_conflict']).toContain(rule.verification?.status);
      }
    }
  });

  it('declares the legacy TER table discrepancy visibly (not silently overwritten in v1)', async () => {
    const v2 = await loadV2FromDisk();
    const cat = v2.categories.find((c) => c.id === 'cat-pph-21') as any;
    expect(cat, 'PPh 21 category must exist').toBeDefined();
    const discrepancies = (cat.knownDiscrepancies ?? []) as any[];
    const declared = discrepancies.find((d) => typeof d.summary === 'string' && d.summary.toLowerCase().includes('legacy ter'));
    expect(declared, 'legacy-vs-canonical TER discrepancy must be surfaced on the PPh 21 category').toBeDefined();
  });
});

// ── Review fix: provenance honesty ────────────────────────────────────────
// The middle TER A/B/C layers were reconstructed from secondary extractions,
// not the BPK Lampiran PDF. Therefore the monthly TER rate claim cannot be
// verified_primary as a whole; it must be verified_secondary while the
// interval/condition evidence remains primary-backed. Boundary arithmetic
// still has to hold (the numbers are correct), so this block re-asserts the
// key edges while pinning the verification status.
describe('PPh 21 / TER migration (Task 4 review) - provenance honesty', () => {
  let v2: V2Data;
  beforeAll(async () => { v2 = await loadV2FromDisk(); });

  it('monthly TER A/B/C rules are verified_secondary (rate reconstructed from secondary extractions), not verified_primary', () => {
    const terRules = v2.rules.filter((r) => r.id === 'rule-pph-21-ter-monthly-a' || r.id === 'rule-pph-21-ter-monthly-b' || r.id === 'rule-pph-21-ter-monthly-c');
    expect(terRules.length).toBe(3);
    for (const rule of terRules) {
      expect(rule.verification?.status).toBe('verified_secondary');
    }
  });

  it('monthly TER A/B/C still carry primary-backed interval and condition evidence (the half-open interval + PTKP-class condition are primary-verified)', () => {
    const rule = v2.rules.find((r) => r.id === 'rule-pph-21-ter-monthly-a')!;
    const evidence = rule.verification?.evidence ?? [];
    const claims = new Set(evidence.map((e) => e.claim));
    expect(claims.has('interval')).toBe(true);
    expect(claims.has('condition')).toBe(true);
    const intervalEvidence = evidence.filter((e) => e.claim === 'interval');
    expect(intervalEvidence.every((e) => e.sourceId === 'src-pp-58-2023')).toBe(true);
    const conditionEvidence = evidence.filter((e) => e.claim === 'condition');
    expect(conditionEvidence.every((e) => e.sourceId === 'src-pp-58-2023')).toBe(true);
  });

  it('monthly TER A/B/C boundary arithmetic still holds despite the downgrade (no overclaim, same numbers)', () => {
    const checks: { rule: string; gross: string; expected: string }[] = [
      { rule: 'rule-pph-21-ter-monthly-a', gross: '5400000', expected: '0.00' },
      { rule: 'rule-pph-21-ter-monthly-a', gross: '5400001', expected: '13500.00' },
      { rule: 'rule-pph-21-ter-monthly-a', gross: '1400000001', expected: '476000000.34' },
      { rule: 'rule-pph-21-ter-monthly-b', gross: '6200000', expected: '0.00' },
      { rule: 'rule-pph-21-ter-monthly-c', gross: '6600000', expected: '0.00' },
    ];
    for (const check of checks) {
      const rule = v2.rules.find((r) => r.id === check.rule)!;
      expect(rule.rate!.type).toBe('progressive');
      const { rate } = terRateForAmount((rule.rate as any).brackets, check.gross);
      expect(terTimesGross(rate, check.gross)).toBe(check.expected);
    }
  });

  it('PMK 252/PMK.03/2008 source locator points to the declared regulation (not PMK 162/2009)', () => {
    const src = v2.sources.find((s) => s.id === 'src-pmk-252-2008-legacy') as any;
    expect(src, 'PMK 252/2008 source must exist').toBeDefined();
    expect(src.regulationId).toBe('PMK/252/PMK.03/2008');
    const url = src.url as string;
    // Official MoF legal-document portal. Must reference 252-pmk-03-2008, not 162/2009.
    expect(url).toMatch(/jdih\.kemenkeu\.go\.id\//);
    expect(url.toLowerCase()).toContain('252-pmk-03-2008');
    expect(url.toLowerCase()).not.toContain('162');
  });

  it('pension-lumpsum rule does not claim a pre-2024 interval without a primary source from that era', () => {
    const rule = v2.rules.find((r) => r.id === 'rule-pph-21-recipient-pension-lumpsum') as any;
    expect(rule, 'pension lumpsum rule must exist').toBeDefined();
    const starts2024 = rule.validFrom === '2024-01-01';
    if (starts2024) return; // 2024 start only needs PP 58/2023 / PMK 168/2023.
    // Otherwise the rule claims a pre-2024 start: it must cite at least one
    // official source whose regulation year is at most the rule's start year,
    // so the interval claim is actually primary-backed for that era.
    const startYear = Number(String(rule.validFrom).slice(0, 4));
    const hasContemporaryPrimary = (rule.verification?.sourceIds ?? []).some((id: string) => {
      const s = v2.sources.find((x) => x.id === id) as any;
      if (!s || !s.official) return false;
      const m = String(s.regulationId).match(/(\d{4})$/);
      return m && Number(m[1]) <= startYear;
    });
    expect(hasContemporaryPrimary, `pension-lumpsum validFrom ${rule.validFrom} lacks a contemporaneous official source`).toBe(true);
  });

  it('illustrative treaty rule is explicitly marked illustrative and carries no authoritative example fixture', () => {
    const rule = v2.rules.find((r) => r.id === 'rule-pph-21-nonresident-treaty') as any;
    expect(rule, 'treaty rule must exist').toBeDefined();
    expect(typeof rule.notes).toBe('string');
    expect((rule.notes as string).toLowerCase()).toContain('illustrative');
    // Any examples on the illustrative treaty rule must themselves be flagged illustrative.
    for (const ex of rule.examples ?? []) {
      expect(ex.illustrative).toBe(true);
    }
  });
});

// Decimal helpers kept local so the boundary assertions use integer scaled arithmetic.
function terTimesGross(rateFraction: string, gross: string): string {
  const rateScale = 4;
  const grossScale = 2;
  const r = scaled(rateFraction, rateScale);
  const g = scaled(gross, grossScale);
  const product = (g * r) / 10n ** BigInt(rateScale);
  return renderCents(product);
}

function subtractDecimal(a: string, b: string): string {
  const scale = 2;
  const diff = scaled(a, scale) - scaled(b, scale);
  return renderCents(diff);
}

function renderCents(scaledValue: bigint): string {
  const sign = scaledValue < 0n ? '-' : '';
  const abs = scaledValue < 0n ? -scaledValue : scaledValue;
  const digits = abs.toString().padStart(3, '0');
  const intPart = digits.slice(0, digits.length - 2);
  const fracPart = digits.slice(digits.length - 2);
  return `${sign}${intPart}.${fracPart}`;
}

// formatRate is imported to keep the parity surface exercised; future parity tests can extend this.
void formatRate;
