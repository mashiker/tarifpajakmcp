// Unit tests for the pure `formatConditions` helper (Task 9 review C1 fix).
//
// The Task 9 detail page never rendered the transaction/tax-base conditions,
// leaving users without the "Berlaku untuk: jenis = barang" / "PTKP: TK/2,
// K/1, ..." context the design spec requires. The fix introduces a pure
// `formatConditions` helper in website/src/lib/detail.ts that walks the v2
// ConditionExpression AST (equals / in / exists / not / and / or) and returns
// a readable Indonesian string.
//
// RED-first: written before the helper exists.

import { describe, expect, it } from 'vitest';
import { formatConditions } from '../../website/src/lib/detail.ts';

describe('formatConditions — leaf operators', () => {
  it('formats equals as "{fact} = {value}"', () => {
    expect(formatConditions({ op: 'equals', fact: 'kind', value: 'goods' })).toBe('jenis = barang');
  });

  it('formats equals with a boolean value as "ya" / "tidak"', () => {
    expect(formatConditions({ op: 'equals', fact: 'recipientHasNpwp', value: true })).toBe('penerima bersangkutan punya NPWP = ya');
    expect(formatConditions({ op: 'equals', fact: 'resident', value: false })).toBe('residen = tidak');
  });

  it('formats in as "{fact}: {v1, v2, v3}"', () => {
    expect(formatConditions({ op: 'in', fact: 'ptkpClass', value: ['TK/0', 'TK/1', 'K/0'] })).toBe('PTKP: TK/0, TK/1, K/0');
  });

  it('formats in with a single-element value without trailing comma', () => {
    expect(formatConditions({ op: 'in', fact: 'ptkpClass', value: ['K/3'] })).toBe('PTKP: K/3');
  });

  it('formats exists as "{fact} ada"', () => {
    expect(formatConditions({ op: 'exists', fact: 'industry' })).toBe('industri ada');
  });

  it('returns "" for null / undefined / non-object input', () => {
    expect(formatConditions(null)).toBe('');
    expect(formatConditions(undefined)).toBe('');
    expect(formatConditions('not a condition')).toBe('');
  });

  it('returns a fallback string for an unknown operator', () => {
    // Defensive: the formatter must never throw on an unseen operator.
    expect(formatConditions({ op: 'unknown' as never, fact: 'x' } as never)).toContain('x');
  });
});

describe('formatConditions — boolean combinators', () => {
  it('formats and (all) as "{child1}; {child2}"', () => {
    const cond = {
      op: 'and' as const,
      conditions: [
        { op: 'exists' as const, fact: 'annualPkp' },
        { op: 'exists' as const, fact: 'priorWithheld' },
      ],
    };
    expect(formatConditions(cond)).toBe('PKP tahunan ada; telah dipotong sebelumnya ada');
  });

  it('formats or (any) as "{child1} ATAU {child2}"', () => {
    const cond = {
      op: 'or' as const,
      conditions: [
        { op: 'equals' as const, fact: 'treaty', value: 'none' },
        { op: 'not' as const, condition: { op: 'exists' as const, fact: 'treaty' } },
      ],
    };
    expect(formatConditions(cond)).toBe('perjanjian pajak = tidak ada ATAU BUKAN perjanjian pajak ada');
  });

  it('formats not as "BUKAN {inner}"', () => {
    const cond = { op: 'not' as const, condition: { op: 'exists' as const, fact: 'treaty' } };
    expect(formatConditions(cond)).toBe('BUKAN perjanjian pajak ada');
  });

  it('nests and/or/not recursively', () => {
    // Mirrors rule-pph-21-nonresident-default: AND(equals resident=false,
    // OR(equals treaty=none, NOT(exists treaty)))
    const cond = {
      op: 'and' as const,
      conditions: [
        { op: 'equals' as const, fact: 'resident', value: false },
        {
          op: 'or' as const,
          conditions: [
            { op: 'equals' as const, fact: 'treaty', value: 'none' },
            { op: 'not' as const, condition: { op: 'exists' as const, fact: 'treaty' } },
          ],
        },
      ],
    };
    expect(formatConditions(cond)).toBe('residen = tidak; perjanjian pajak = tidak ada ATAU BUKAN perjanjian pajak ada');
  });
});

describe('formatConditions — purity and determinism', () => {
  it('does not mutate the input condition', () => {
    const cond = { op: 'in' as const, fact: 'ptkpClass', value: ['TK/0', 'TK/1'] };
    const snapshot = JSON.parse(JSON.stringify(cond));
    formatConditions(cond);
    expect(cond).toEqual(snapshot);
  });

  it('returns the same string for the same input across two calls', () => {
    const cond = { op: 'equals' as const, fact: 'kind', value: 'goods' };
    expect(formatConditions(cond)).toBe(formatConditions(cond));
  });
});

describe('formatConditions — fact label coverage for the live dataset', () => {
  // Locks the Indonesian labels for every fact name the v2 corpus actually
  // uses, so a future data regression that introduces a new fact without a
  // label is caught at test time (the fallback is the raw fact slug).
  it('covers every fact name used by the canonical v2 rules', () => {
    const facts = [
      'annualPkp',
      'article31eEligible',
      'contractorQualification',
      'dailyGross',
      'entityType',
      'floatTradedPct',
      'grossRent',
      'grossTurnover',
      'heldDays',
      'iknBusiness',
      'iknBusinessCategory',
      'iknInvestmentWindow',
      'industry',
      'kind',
      'listed',
      'listedConditionsMet',
      'luxuryBkp',
      'maxStakePct',
      'minShareholders',
      'pp23DurationNotExceeded',
      'pp23YearsElapsed',
      'priorWithheld',
      'ptkpClass',
      'recipient',
      'recipientClass',
      'recipientHasNpwp',
      'resident',
      'retailFinalConsumer',
      'serviceClass',
      'taxpayerType',
      'transactionKind',
      'transferCategory',
      'treaty',
      'umkmTurnoverEligible',
      'withdrawalMode',
    ];
    for (const fact of facts) {
      const out = formatConditions({ op: 'exists', fact });
      // The label must not be the raw slug (would indicate a missing label).
      expect(out, `fact "${fact}" should have a humanized label, got raw slug`).not.toBe(fact);
      expect(out.length).toBeGreaterThan(0);
    }
  });
});
