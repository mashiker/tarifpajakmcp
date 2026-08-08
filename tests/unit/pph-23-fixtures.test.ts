// Task 5 PPh 23 + versioned BPPU migration. RED-first: these tests fail until
// data/v2 carries the canonical PPh 23 service concepts, versioned BPPU codes,
// primary sources (UU PPh 36/2008, PMK 141/2015, PP 34/2017, NIK chronology,
// form PERs), and declared conflicts. See tests/fixtures/pph-23-boundaries.json
// for the verified expectations and data/v2/sources.json for primary locators.
//
// The resolver is pure; we load the on-disk v2 corpus so these tests also prove
// the migration produces a coherent dataset (not just in-memory fixtures).
// Jevi's explicit goal scenario: "berapa tarif PPh 23 jasa konsultan tahun 2020?"
// must resolve to a candidate rule with interval covering 2020, 2% rate, source
// UU PPh Pasal 23(1)(c)(2), condition NPWP status (4% branch if missing), BPPU
// 24-104-03 reporting reference, and a note to test PPh 21 for individual consultants.

import { beforeAll, describe, expect, it } from 'vitest';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { getProjectPaths } from '../../src/paths.ts';
import { loadJsonFile } from '../../src/validation/load.ts';
import { resolveAtDate } from '../../src/core/resolver.ts';
import { validateV2 } from '../../src/validation/semantic.ts';
import type { V2Data, TaxRule } from '../../src/core/types.ts';

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
  await readFile(join(paths.root, 'tests', 'fixtures', 'pph-23-boundaries.json'), 'utf8'),
) as any;

function percentTimesGross(rateFraction: string, gross: string): string {
  const rateScale = 4;
  const grossScale = 2;
  const r = scaled(rateFraction, rateScale);
  const g = scaled(gross, grossScale);
  const product = (g * r) / 10n ** BigInt(rateScale);
  return renderCents(product);
}

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

describe('PPh 23 + versioned BPPU migration (Task 5) - primary-source integrity', () => {
  it('fixture file encodes the verified PMK 141 effective date as 26 Agustus 2015 (NOT 24 Juli or 27 Agu)', () => {
    expect(FIXTURES.effectiveDate.pmk141EffectiveStart).toBe('2015-08-26');
    expect(FIXTURES.effectiveDate.pmk141DayBeforeEffective).toBe('2015-08-25');
    expect(FIXTURES.effectiveDate.pmk141Promulgated).toBe('2015-07-27');
  });

  it('v2 carries the PPh 23 category, the split service concepts, and primary sources', async () => {
    const v2 = await loadV2FromDisk();
    const cat = v2.categories.find((c) => c.slug === 'pph-23' || c.id === 'cat-pph-23');
    expect(cat, 'PPh 23 category must exist').toBeDefined();
    for (const conceptId of [
      'concept-pph-23-jasa-teknik',
      'concept-pph-23-jasa-manajemen',
      'concept-pph-23-jasa-konsultan',
      'concept-pph-23-jasa-pmk141-lain',
      'concept-pph-23-rent-movable',
      'concept-pph-23-scope-rent-land-building',
    ]) {
      expect(v2.concepts.find((c) => c.id === conceptId), `missing concept ${conceptId}`).toBeDefined();
    }
    // Primary-source registry additions for UU 36/2008 PPh, PMK 141/2015, PP 34/2017,
    // the NIK-as-NPWP chronology, and the BPPU/KOP form PERs.
    const sourceIds = new Set(v2.sources.map((s) => s.id));
    for (const id of [
      'src-uu-36-2008-pph',
      'src-pmk-141-2015',
      'src-pp-34-2017',
      'src-pmk-112-2022-nik',
      'src-pmk-136-2023-nik',
      'src-peng-6-pj-09-2024-nik',
      'src-per-04-pj-2017',
      'src-per-23-pj-2020',
      'src-kep-143-pj-2022',
      'src-per-24-pj-2021',
      'src-per-11-pj-2025',
    ]) {
      expect(sourceIds.has(id), `missing primary source ${id}`).toBe(true);
    }
  });

  it('PMK 141 source encodes the exact effective date 26 Agustus 2015 (30-day lag from 27 Juli 2015)', async () => {
    const v2 = await loadV2FromDisk();
    const src = v2.sources.find((s) => s.id === 'src-pmk-141-2015') as any;
    expect(src, 'PMK 141/2015 source must exist').toBeDefined();
    expect(src.regulationId).toBe('PMK/141/PMK.03/2015');
    expect(src.locator).toContain('26 Agustus 2015');
    expect(String(src.locator)).not.toContain('27 Agustus 2015');
    expect(String(src.locator)).not.toContain('24 Juli');
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

describe('PPh 23 + versioned BPPU migration (Task 5) - boundary resolution', () => {
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
      if (boundary.expect.winningRateFraction !== undefined) {
        const winner = result.candidates[0];
        expect(winner, 'expected a winning candidate').toBeDefined();
        const rate = winner!.rule.rate;
        expect(rate && rate.type === 'percentage' ? (rate as any).value : undefined).toBe(boundary.expect.winningRateFraction);
        if (boundary.expect.pphAmount !== undefined) {
          const gross = String(boundary.request.facts.gross);
          expect(percentTimesGross(boundary.expect.winningRateFraction, gross)).toBe(boundary.expect.pphAmount);
        }
      }
      if (boundary.expect.winningRateType !== undefined) {
        const winner = result.candidates[0];
        expect(winner, 'expected a winning candidate').toBeDefined();
        expect(winner!.rule.rate?.type).toBe(boundary.expect.winningRateType);
      }
      if (boundary.expect.winnerBppu !== undefined) {
        const winner = result.candidates[0];
        expect(winner, 'expected a winning candidate').toBeDefined();
        expect(winner!.rule.bppuId).toBe(boundary.expect.winnerBppu);
      }
      if (boundary.expect.winnerSourceIncludes) {
        const winner = result.candidates[0];
        expect(winner, 'expected a winning candidate').toBeDefined();
        const referenced = new Set([
          ...(winner!.rule.verification?.sourceIds ?? []),
          ...(winner!.rule.verification?.evidence?.map((e) => e.sourceId) ?? []),
        ]);
        for (const id of boundary.expect.winnerSourceIncludes) {
          expect(referenced.has(id), `winner must reference source ${id}`).toBe(true);
        }
      }
      if (boundary.expect.noteMustMentionPph21) {
        const winner = result.candidates[0];
        expect(winner, 'expected a winning candidate').toBeDefined();
        const notes = (winner!.rule.notes ?? '').toLowerCase();
        const desc = String(getConceptDescription(v2, winner!.rule.conceptId)).toLowerCase();
        expect(notes.includes('pph 21') || desc.includes('pph 21'), 'winner note/description must mention PPh 21 for individual consultants').toBe(true);
      }
      if (boundary.expect.noteMustMentionPph4_2) {
        const winner = result.candidates[0];
        expect(winner, 'expected a winning candidate').toBeDefined();
        const haystack = `${winner!.rule.notes ?? ''} ${getConceptDescription(v2, winner!.rule.conceptId) ?? ''}`.toLowerCase();
        expect(haystack).toContain('4(2)');
      }
    });
  }
});

describe('PPh 23 + versioned BPPU migration (Task 5) - NPWP multiplier & NIK chronology', () => {
  let v2: V2Data;
  beforeAll(async () => { v2 = await loadV2FromDisk(); });

  it('jasa konsultan encodes BOTH the 2% (with NPWP) and 4% (without NPWP) branches under Pasal 23(1a)', () => {
    const konsultanRules = v2.rules.filter((r) => r.conceptId === 'concept-pph-23-jasa-konsultan') as TaxRule[];
    expect(konsultanRules.length).toBeGreaterThanOrEqual(2);
    const rates = konsultanRules
      .filter((r) => r.rate?.type === 'percentage')
      .map((r) => (r.rate as any).value)
      .sort();
    expect(rates).toContain('0.02');
    expect(rates).toContain('0.04');
    // Each branch must condition on recipientHasNpwp so the resolver never
    // silently picks one when the fact is missing.
    for (const rule of konsultanRules) {
      const cond = JSON.stringify(rule.conditions ?? {});
      expect(cond).toContain('recipientHasNpwp');
    }
  });

  it('the 4% multiplier branch cites Pasal 23 ayat (1a) in its source evidence', () => {
    const withoutNpwp = v2.rules.find(
      (r) => r.conceptId === 'concept-pph-23-jasa-konsultan' && r.rate?.type === 'percentage' && (r.rate as any).value === '0.04',
    ) as TaxRule | undefined;
    expect(withoutNpwp, '4% multiplier branch must exist').toBeDefined();
    const evidence = withoutNpwp!.verification?.evidence ?? [];
    const joined = evidence.map((e) => `${e.claim}|${e.locator}`).join('\n');
    expect(joined.toLowerCase()).toContain('1a');
  });

  it('NIK chronology sources encode PMK 112/2022, PENG-6/PJ.09/2024, and PMK 136/2023 with the verified dates', () => {
    const ids = ['src-pmk-112-2022-nik', 'src-peng-6-pj-09-2024-nik', 'src-pmk-136-2023-nik'];
    for (const id of ids) {
      const src = v2.sources.find((s) => s.id === id) as any;
      expect(src, `missing NIK chronology source ${id}`).toBeDefined();
      expect(src.official).toBe(true);
    }
    // PENG-6/PJ.09/2024 covers Masa Pajak Januari 2024 with Dukcapil integration.
    const peng = v2.sources.find((s) => s.id === 'src-peng-6-pj-09-2024-nik') as any;
    expect(String(peng.locator)).toMatch(/januari.*2024|2024.*januari/i);
  });
});

describe('PPh 23 + versioned BPPU migration (Task 5) - BPPU is reporting metadata, not rate authority', () => {
  let v2: V2Data;
  beforeAll(async () => { v2 = await loadV2FromDisk(); });

  it('BPPU codes carry their own validity interval and source registry entries', () => {
    const bppuById = new Map((v2.bppu ?? []).map((b) => [b.id, b]));
    for (const codeId of ['bppu-24-104-01', 'bppu-24-104-02', 'bppu-24-104-03', 'bppu-24-100-02', 'bppu-28-403-02']) {
      const entry = bppuById.get(codeId) as any;
      expect(entry, `BPPU ${codeId} must exist`).toBeDefined();
      expect(typeof entry.code).toBe('string');
      // The current PPh 23 service codes start 21 Februari 2022 (KEP-143/PJ/2022 + PER-24/PJ/2021).
      if (codeId.startsWith('bppu-24-104') || codeId === 'bppu-24-100-02') {
        expect(entry.validFrom).toBe('2022-02-21');
      }
    }
  });

  it('PPh 23 service rules reference BPPU codes only as reporting metadata; the rate comes from UU PPh / PMK 141', () => {
    const konsultan = v2.rules.find((r) => r.id === 'rule-pph-23-jasa-konsultan-with-npwp') as TaxRule | undefined;
    expect(konsultan, 'jasa konsultan with-npwp rule must exist').toBeDefined();
    expect(konsultan!.bppuId).toBe('bppu-24-104-03');
    // The rate source must be UU PPh / PMK 141, not a BPPU-only source.
    const sourceIds = new Set(konsultan!.verification?.sourceIds ?? []);
    expect(sourceIds.has('src-uu-36-2008-pph') || sourceIds.has('src-pmk-141-2015')).toBe(true);
  });

  it('BPPU 28-403-02 (land/building rent) is referenced by the scope-exclusion marker, NOT by a 2% PPh 23 rule', () => {
    const referencing = v2.rules.filter((r) => r.bppuId === 'bppu-28-403-02');
    expect(referencing.length).toBeGreaterThanOrEqual(1);
    for (const rule of referencing) {
      // Any rule tagging 28-403-02 must NOT carry a 2% PPh 23 rate. The land/building
      // rent is final PPh 4(2) 10%, not PPh 23.
      const isTwoPct = rule.rate?.type === 'percentage' && (rule.rate as any).value === '0.02';
      expect(isTwoPct, 'land/building rent BPPU must not be tagged by a 2% PPh 23 rule').toBe(false);
    }
  });
});

describe('PPh 23 + versioned BPPU migration (Task 5) - conflicts surfaced, not silently resolved', () => {
  let v2: V2Data;
  beforeAll(async () => { v2 = await loadV2FromDisk(); });

  it('declares the CSV-vs-primary land/building rent attribution discrepancy (PP 8/2024 in KOP CSV vs PP 34/2017 primary)', () => {
    const cat = v2.categories.find((c) => c.id === 'cat-pph-23') as any;
    expect(cat, 'PPh 23 category must exist').toBeDefined();
    const discrepancies = (cat.knownDiscrepancies ?? []) as any[];
    const declared = discrepancies.find(
      (d) => typeof d.summary === 'string' &&
        (d.summary.toLowerCase().includes('pp 34/2017') || d.summary.toLowerCase().includes('land/building') || d.summary.toLowerCase().includes('sewa tanah/bangunan')),
    );
    expect(declared, 'land/building rent attribution discrepancy must be surfaced on the PPh 23 category').toBeDefined();
  });

  it('declares the pre-2022 BPPU/KOP-vs-canonical-rate attribution (rates predate the codes)', () => {
    const cat = v2.categories.find((c) => c.id === 'cat-pph-23') as any;
    const discrepancies = (cat.knownDiscrepancies ?? []) as any[];
    // Either explicitly declared, or the category description / a discrepancy notes
    // that the 2% PPh 23 service rates predate the KOP/BPPU codes (which carry a
    // 2022-02-21 Berlaku date in the KOP CSV).
    const joined = JSON.stringify(discrepancies).toLowerCase();
    const mentionsPrecedence = joined.includes('predates') || joined.includes('sebelum') || joined.includes('2022');
    expect(mentionsPrecedence, 'BPPU/KOP precedence over canonical rate must be surfaced as a non-authority note or discrepancy').toBe(true);
  });
});

// ── Review fix (Task 5 CHANGES_REQUIRED) ─────────────────────────────────
// Critical: KOP CSV 24-100-02 lists sewa/perolehan harta selain tanah/bangunan
// at 15%, while the v2 canonical rate is 2% under UU PPh Pasal 23(1)(c) angka
// 4 (corroborated by the v1 embedded pph-23 jasa-lain 2%/4% entries). The CSV
// value must be declared as a knownDiscrepancy, NOT silently picked.
describe('PPh 23 review fix - Critical: movable-rent CSV-vs-primary rate discrepancy', () => {
  let v2: V2Data;
  beforeAll(async () => { v2 = await loadV2FromDisk(); });

  it('declares the movable-rent rate discrepancy on cat-pph-23 (CSV 15% vs canonical 2%)', () => {
    const cat = v2.categories.find((c) => c.id === 'cat-pph-23') as any;
    expect(cat, 'PPh 23 category must exist').toBeDefined();
    const discrepancies = (cat.knownDiscrepancies ?? []) as any[];
    const declared = discrepancies.find((d) => {
      const s = String(d?.summary ?? '').toLowerCase();
      // Must reference the 24-100-02 code, both rates, and signal a discrepancy.
      return s.includes('24-100-02') && s.includes('15%') && s.includes('2%');
    });
    expect(declared, 'movable-rent CSV-vs-primary discrepancy must be surfaced on the PPh 23 category and reference 24-100-02 + 15% + 2%').toBeDefined();
  });

  it('the canonical movable-rent rule keeps 2% (does NOT inherit the CSV 15%)', () => {
    const rule = v2.rules.find((r) => r.id === 'rule-pph-23-rent-movable-with-npwp') as TaxRule | undefined;
    expect(rule, 'movable-rent with-npwp rule must exist').toBeDefined();
    expect(rule!.rate?.type).toBe('percentage');
    expect((rule!.rate as any).value).toBe('0.02');
  });
});

// Important: PMK-141 "jasa lain" umbrella spans many KOP codes (24-104-04 Aktuaris,
// 24-104-07 Hukum, 24-104-08 Arsitektur, 24-104-17 Outsourcing, 24-104-24 Software,
// etc.). Tagging the umbrella rule with a single konsultan code (24-104-03) is wrong.
// The umbrella rule should carry no bppuId.
describe('PPh 23 review fix - Important: PMK-141 umbrella rule is not konsultan-specific', () => {
  let v2: V2Data;
  beforeAll(async () => { v2 = await loadV2FromDisk(); });

  it('rule-pph-23-jasa-pmk141-lain-with-npwp has no bppuId (umbrella spans many codes)', () => {
    const rule = v2.rules.find((r) => r.id === 'rule-pph-23-jasa-pmk141-lain-with-npwp') as TaxRule | undefined;
    expect(rule, 'pmk141-lain with-npwp rule must exist').toBeDefined();
    expect(rule!.bppuId, 'pmk141-lain umbrella rule must NOT carry a single konsultan bppuId').toBeFalsy();
  });

  it('rule-pph-23-jasa-pmk141-lain-without-npwp has no bppuId', () => {
    const rule = v2.rules.find((r) => r.id === 'rule-pph-23-jasa-pmk141-lain-without-npwp') as TaxRule | undefined;
    expect(rule, 'pmk141-lain without-npwp rule must exist').toBeDefined();
    expect(rule!.bppuId, 'pmk141-lain umbrella rule must NOT carry a single konsultan bppuId').toBeFalsy();
  });
});

// Look up a concept description for note-content checks.
function getConceptDescription(data: V2Data, conceptId: string): string | undefined {
  return data.concepts.find((c) => c.id === conceptId)?.description;
}
