import { describe, expect, it } from 'vitest';
import { resolveAtDate, resolveForYear } from '../../src/core/resolver.ts';
import type { TaxRule, V2Data } from '../../src/core/types.ts';

function rule(partial: Partial<TaxRule> & Pick<TaxRule, 'id' | 'conceptId' | 'validFrom'>): TaxRule {
  return {
    validToExclusive: null,
    ...partial,
  } as TaxRule;
}

function data(rules: TaxRule[], extra: Partial<V2Data> = {}): V2Data {
  return {
    sources: [],
    categories: [],
    concepts: [],
    rules,
    conflicts: [],
    bppu: [],
    ...extra,
  };
}

const verifiedOfficial = {
  status: 'verified_primary' as const,
  sourceIds: ['src-official'],
  evidence: [
    { claim: 'rate' as const, sourceId: 'src-official', locator: 'Art 1' },
    { claim: 'interval' as const, sourceId: 'src-official', locator: 'Art 1' },
    { claim: 'condition' as const, sourceId: 'src-official', locator: 'Art 1' },
  ],
};

describe('resolveAtDate - determination semantics', () => {
  it('returns tepat for a single verified unconditional rule covering the date', () => {
    const rules = [
      rule({
        id: 'r1',
        conceptId: 'c1',
        validFrom: '2024-01-01',
        validToExclusive: '2025-01-01',
        rate: { type: 'percentage', value: '0.10' },
        verification: verifiedOfficial,
      }),
    ];
    const result = resolveAtDate(data(rules), { date: '2024-06-15' });
    expect(result.determination).toBe('tepat');
    expect(result.candidates.map((c) => c.rule.id)).toEqual(['r1']);
    expect(result.warnings).toEqual([]);
    expect(result.gap).toBe(false);
  });

  it('returns a gap warning (never synthetic 0%) when no rule covers the date', () => {
    const rules = [
      rule({
        id: 'r1',
        conceptId: 'c1',
        validFrom: '2024-01-01',
        validToExclusive: '2025-01-01',
        rate: { type: 'percentage', value: '0.10' },
        verification: verifiedOfficial,
      }),
    ];
    const result = resolveAtDate(data(rules), { date: '2025-06-15' });
    expect(result.gap).toBe(true);
    expect(result.candidates).toEqual([]);
    expect(result.determination).toBe('fakta_kurang');
    expect(result.warnings.some((w) => /no rule/i.test(w))).toBe(true);
    expect(JSON.stringify(result)).not.toContain('0%');
  });

  it('returns fakta_kurang when a candidate condition cannot be evaluated', () => {
    const rules = [
      rule({
        id: 'r1',
        conceptId: 'c1',
        validFrom: '2024-01-01',
        validToExclusive: '2025-01-01',
        rate: { type: 'percentage', value: '0.10' },
        conditions: { op: 'equals', fact: 'kind', value: 'goods' },
        verification: verifiedOfficial,
      }),
    ];
    const result = resolveAtDate(data(rules), { date: '2024-06-15' });
    expect(result.determination).toBe('fakta_kurang');
    expect(result.candidates[0].missingFacts).toEqual(['kind']);
  });

  it('returns bersyarat when a condition resolves true against supplied facts', () => {
    const rules = [
      rule({
        id: 'r1',
        conceptId: 'c1',
        validFrom: '2024-01-01',
        validToExclusive: '2025-01-01',
        rate: { type: 'percentage', value: '0.10' },
        conditions: { op: 'equals', fact: 'kind', value: 'goods' },
        verification: verifiedOfficial,
      }),
    ];
    const result = resolveAtDate(data(rules), { date: '2024-06-15', facts: { kind: 'goods' } });
    expect(result.determination).toBe('bersyarat');
    expect(result.candidates[0].conditionState).toBe('true');
  });

  it('drops candidates whose condition resolves false and falls through to gap when none remain', () => {
    const rules = [
      rule({
        id: 'r1',
        conceptId: 'c1',
        validFrom: '2024-01-01',
        validToExclusive: '2025-01-01',
        rate: { type: 'percentage', value: '0.10' },
        conditions: { op: 'equals', fact: 'kind', value: 'goods' },
        verification: verifiedOfficial,
      }),
    ];
    const result = resolveAtDate(data(rules), { date: '2024-06-15', facts: { kind: 'services' } });
    expect(result.candidates.map((c) => c.rule.id)).toEqual([]);
    expect(result.considered.map((c) => c.rule.id)).toEqual(['r1']);
    expect(result.considered[0].conditionState).toBe('false');
    expect(result.gap).toBe(true);
  });

  it('honors special-over-general precedence: conditional rule beats general rule in the same exclusive group', () => {
    const rules = [
      rule({
        id: 'general',
        conceptId: 'c1',
        validFrom: '2024-01-01',
        validToExclusive: '2025-01-01',
        exclusiveGroup: 'g1',
        rate: { type: 'percentage', value: '0.10' },
        verification: verifiedOfficial,
      }),
      rule({
        id: 'special',
        conceptId: 'c1',
        validFrom: '2024-01-01',
        validToExclusive: '2025-01-01',
        exclusiveGroup: 'g1',
        rate: { type: 'percentage', value: '0.05' },
        conditions: { op: 'equals', fact: 'kind', value: 'essential' },
        verification: verifiedOfficial,
      }),
    ];
    const result = resolveAtDate(data(rules), { date: '2024-06-15', facts: { kind: 'essential' } });
    expect(result.determination).toBe('bersyarat');
    expect(result.candidates.map((c) => c.rule.id)).toEqual(['special']);
    expect(result.considered.map((c) => c.rule.id).sort()).toEqual(['general', 'special']);
    expect(result.candidates[0].defeats).toEqual(['general']);
  });

  it('honors typed supersession: a rule that supersedes another defeats it', () => {
    const rules = [
      rule({
        id: 'old',
        conceptId: 'c1',
        validFrom: '2024-01-01',
        validToExclusive: '2025-01-01',
        rate: { type: 'percentage', value: '0.10' },
        supersedes: [],
        supersededBy: ['new'],
        verification: verifiedOfficial,
      }),
      rule({
        id: 'new',
        conceptId: 'c1',
        validFrom: '2024-01-01',
        validToExclusive: '2025-01-01',
        rate: { type: 'percentage', value: '0.12' },
        supersedes: ['old'],
        verification: verifiedOfficial,
      }),
    ];
    const result = resolveAtDate(data(rules), { date: '2024-06-15' });
    expect(result.candidates.map((c) => c.rule.id)).toEqual(['new']);
    expect(result.determination).toBe('tepat');
  });

  it('blocks exact resolution for a source_conflict rule and reports konflik_sumber', () => {
    const rules = [
      rule({
        id: 'r-conflict',
        conceptId: 'c1',
        validFrom: '2024-01-01',
        validToExclusive: '2025-01-01',
        rate: { type: 'percentage', value: '0.15' },
        verification: { status: 'source_conflict', sourceIds: [] },
      }),
    ];
    const result = resolveAtDate(data(rules), { date: '2024-06-15' });
    expect(result.determination).toBe('konflik_sumber');
  });

  it('blocks exact resolution when a declared conflict spans the matching rules', () => {
    const rules = [
      rule({
        id: 'a',
        conceptId: 'c1',
        validFrom: '2024-01-01',
        validToExclusive: '2025-01-01',
        exclusiveGroup: 'g',
        rate: { type: 'percentage', value: '0.10' },
        verification: verifiedOfficial,
      }),
      rule({
        id: 'b',
        conceptId: 'c1',
        validFrom: '2024-01-01',
        validToExclusive: '2025-01-01',
        exclusiveGroup: 'g',
        rate: { type: 'percentage', value: '0.12' },
        verification: verifiedOfficial,
      }),
    ];
    const conflicts = [{ id: 'conf1', kind: 'rate' as const, ruleIds: ['a', 'b'], description: 'illustrative' }];
    const result = resolveAtDate(data(rules), { date: '2024-06-15' }, { conflicts });
    expect(result.determination).toBe('konflik_sumber');
    expect(result.conflicts).toEqual(['conf1']);
  });

  it('blocks exact resolution for needs_review and summary_only rules (orienting only, never tepat)', () => {
    const needs = rule({
      id: 'r-needs',
      conceptId: 'c1',
      validFrom: '2024-01-01',
      validToExclusive: '2025-01-01',
      rate: { type: 'percentage', value: '0.10' },
      verification: { status: 'needs_review', sourceIds: [] },
    });
    expect(resolveAtDate(data([needs]), { date: '2024-06-15' }).determination).toBe('bersyarat');

    const summary = rule({
      id: 'r-summary',
      conceptId: 'c1',
      validFrom: '2024-01-01',
      validToExclusive: '2025-01-01',
      rate: { type: 'percentage', value: '0.10' },
      verification: { status: 'summary_only', sourceIds: [] },
    });
    expect(resolveAtDate(data([summary]), { date: '2024-06-15' }).determination).toBe('bersyarat');
  });

  it('filters by conceptId, categoryId, and bppuId', () => {
    const rules = [
      rule({ id: 'r1', conceptId: 'c1', categoryId: 'cat-a', validFrom: '2024-01-01', validToExclusive: '2025-01-01', rate: { type: 'percentage', value: '0.10' }, verification: verifiedOfficial }),
      rule({ id: 'r2', conceptId: 'c2', categoryId: 'cat-b', validFrom: '2024-01-01', validToExclusive: '2025-01-01', rate: { type: 'percentage', value: '0.20' }, verification: verifiedOfficial, bppuId: 'bppu-1' }),
    ];
    expect(resolveAtDate(data(rules), { date: '2024-06-15', conceptId: 'c2' }).candidates.map((c) => c.rule.id)).toEqual(['r2']);
    expect(resolveAtDate(data(rules), { date: '2024-06-15', categoryId: 'cat-a' }).candidates.map((c) => c.rule.id)).toEqual(['r1']);
    expect(resolveAtDate(data(rules), { date: '2024-06-15', bppuId: 'bppu-1' }).candidates.map((c) => c.rule.id)).toEqual(['r2']);
  });

  it('never uses the current date implicitly (no Date.now influence): a far-future date with no rule is still a gap', () => {
    const rules = [
      rule({ id: 'r1', conceptId: 'c1', validFrom: '2024-01-01', validToExclusive: '2025-01-01', rate: { type: 'percentage', value: '0.10' }, verification: verifiedOfficial }),
    ];
    const result = resolveAtDate(data(rules), { date: '2099-06-15' });
    expect(result.gap).toBe(true);
    expect(result.candidates).toEqual([]);
  });
});

describe('resolveForYear - transition and range semantics', () => {
  it('returns rentang with labeled transition segments when a year spans two rules', () => {
    const rules = [
      rule({ id: 'old', conceptId: 'c1', validFrom: '2024-01-01', validToExclusive: '2024-07-01', rate: { type: 'percentage', value: '0.10' }, verification: verifiedOfficial }),
      rule({ id: 'new', conceptId: 'c1', validFrom: '2024-07-01', validToExclusive: null, rate: { type: 'percentage', value: '0.12' }, verification: verifiedOfficial, supersedes: ['old'] }),
    ];
    const result = resolveForYear(data(rules), 2024);
    expect(result.determination).toBe('rentang');
    expect(result.segments).toHaveLength(2);
    expect(result.segments[0].interval).toEqual({ validFrom: '2024-01-01', validToExclusive: '2024-07-01' });
    expect(result.segments[1].interval).toEqual({ validFrom: '2024-07-01', validToExclusive: '2025-01-01' });
    expect(result.segments[1].transition).toBe(true);
    expect(result.segments.map((s) => s.ruleIds)).toEqual([['old'], ['new']]);
  });

  it('returns a single segment with the at-date determination when one rule covers the whole year', () => {
    const rules = [
      rule({ id: 'r1', conceptId: 'c1', validFrom: '2024-01-01', validToExclusive: null, rate: { type: 'percentage', value: '0.10' }, verification: verifiedOfficial }),
    ];
    const result = resolveForYear(data(rules), 2024);
    expect(result.determination).toBe('tepat');
    expect(result.segments).toHaveLength(1);
    expect(result.segments[0].ruleIds).toEqual(['r1']);
  });

  it('clips open-ended and multi-year intervals to the calendar year boundaries', () => {
    const rules = [
      rule({ id: 'r1', conceptId: 'c1', validFrom: '2023-01-01', validToExclusive: '2026-01-01', rate: { type: 'percentage', value: '0.10' }, verification: verifiedOfficial }),
    ];
    const result = resolveForYear(data(rules), 2024);
    expect(result.segments[0].interval).toEqual({ validFrom: '2024-01-01', validToExclusive: '2025-01-01' });
  });

  it('returns a gap year result when no rule intersects the year', () => {
    const rules = [
      rule({ id: 'r1', conceptId: 'c1', validFrom: '2024-01-01', validToExclusive: '2025-01-01', rate: { type: 'percentage', value: '0.10' }, verification: verifiedOfficial }),
    ];
    const result = resolveForYear(data(rules), 2030);
    expect(result.segments).toEqual([]);
    expect(result.ruleIds).toEqual([]);
    expect(result.warnings.some((w) => /no rule/i.test(w))).toBe(true);
  });

  it('includes both candidates in segments when a declared conflict spans the whole year', () => {
    const rules = [
      rule({ id: 'a', conceptId: 'c1', validFrom: '2024-01-01', validToExclusive: null, exclusiveGroup: 'g', rate: { type: 'percentage', value: '0.10' }, verification: verifiedOfficial }),
      rule({ id: 'b', conceptId: 'c1', validFrom: '2024-01-01', validToExclusive: null, exclusiveGroup: 'g', rate: { type: 'percentage', value: '0.12' }, verification: verifiedOfficial }),
    ];
    const conflicts = [{ id: 'conf1', kind: 'rate' as const, ruleIds: ['a', 'b'], description: 'illustrative' }];
    const result = resolveForYear(data(rules), 2024, { conflicts });
    expect(result.determination).toBe('konflik_sumber');
    expect(result.segments[0].ruleIds.sort()).toEqual(['a', 'b']);
  });
});

describe('resolveForYear - gap propagation (no false tepat)', () => {
  it('a year whose only segment samples to an empty-winner gap stays fakta_kurang and reports gap:true', () => {
    // A single rule covers the whole year, but its condition resolves false at
    // the sampled segment start, so resolveAtDate reaches the empty-winner
    // branch and reports a gap. The year must NOT be inverted to tepat and must
    // propagate the real gap flag instead of hardcoding gap:false.
    const rules = [
      rule({
        id: 'r1',
        conceptId: 'c1',
        validFrom: '2024-01-01',
        validToExclusive: null,
        rate: { type: 'percentage', value: '0.10' },
        conditions: { op: 'equals', fact: 'kind', value: 'goods' },
        verification: verifiedOfficial,
      }),
    ];
    const result = resolveForYear(data(rules), 2024, { facts: { kind: 'services' } });
    expect(result.determination).not.toBe('tepat');
    expect(result.determination).toBe('fakta_kurang');
    expect(result.gap).toBe(true);
    expect(result.warnings.some((w) => /no applicable rule/i.test(w))).toBe(true);
  });

  it('never hardcodes gap:false: a real gap year (no intersecting rule) reports gap:true', () => {
    const rules = [
      rule({ id: 'r1', conceptId: 'c1', validFrom: '2024-01-01', validToExclusive: '2025-01-01', rate: { type: 'percentage', value: '0.10' }, verification: verifiedOfficial }),
    ];
    const result = resolveForYear(data(rules), 2030);
    expect(result.gap).toBe(true);
    expect(result.determination).toBe('fakta_kurang');
  });
});

describe('applyPrecedence - defeats metadata is scoped per exclusive group', () => {
  it('a winner in group A does not inherit the defeats computed for group B', () => {
    // Group A: special-over-general -> the general rule 'a-gen' is defeated.
    // Group B: a simple winner 'b-win' with no internal defeat.
    // The group B winner must report an empty defeats list, not ['a-gen'].
    const rules = [
      rule({
        id: 'a-gen',
        conceptId: 'c1',
        validFrom: '2024-01-01',
        validToExclusive: '2025-01-01',
        exclusiveGroup: 'groupA',
        rate: { type: 'percentage', value: '0.10' },
        verification: verifiedOfficial,
      }),
      rule({
        id: 'a-spec',
        conceptId: 'c1',
        validFrom: '2024-01-01',
        validToExclusive: '2025-01-01',
        exclusiveGroup: 'groupA',
        rate: { type: 'percentage', value: '0.05' },
        conditions: { op: 'equals', fact: 'kind', value: 'essential' },
        verification: verifiedOfficial,
      }),
      rule({
        id: 'b-win',
        conceptId: 'c2',
        validFrom: '2024-01-01',
        validToExclusive: '2025-01-01',
        exclusiveGroup: 'groupB',
        rate: { type: 'percentage', value: '0.20' },
        verification: verifiedOfficial,
      }),
    ];
    const result = resolveAtDate(data(rules), { date: '2024-06-15', facts: { kind: 'essential' } });
    const byId = new Map(result.candidates.map((c) => [c.rule.id, c]));
    expect(byId.has('a-spec')).toBe(true);
    expect(byId.has('b-win')).toBe(true);
    expect(byId.has('a-gen')).toBe(false);
    // The group A winner defeated a-gen; the group B winner defeated nobody.
    expect(byId.get('a-spec')!.defeats).toEqual(['a-gen']);
    expect(byId.get('b-win')!.defeats).toEqual([]);
  });

  it('a winner with no exclusive group does not inherit defeats from any grouped bucket', () => {
    const rules = [
      rule({
        id: 'g-gen',
        conceptId: 'c1',
        validFrom: '2024-01-01',
        validToExclusive: '2025-01-01',
        exclusiveGroup: 'g',
        rate: { type: 'percentage', value: '0.10' },
        verification: verifiedOfficial,
      }),
      rule({
        id: 'g-spec',
        conceptId: 'c1',
        validFrom: '2024-01-01',
        validToExclusive: '2025-01-01',
        exclusiveGroup: 'g',
        rate: { type: 'percentage', value: '0.05' },
        conditions: { op: 'equals', fact: 'kind', value: 'essential' },
        verification: verifiedOfficial,
      }),
      rule({
        id: 'lonely',
        conceptId: 'c2',
        validFrom: '2024-01-01',
        validToExclusive: '2025-01-01',
        rate: { type: 'percentage', value: '0.30' },
        verification: verifiedOfficial,
      }),
    ];
    const result = resolveAtDate(data(rules), { date: '2024-06-15', facts: { kind: 'essential' } });
    const lonely = result.candidates.find((c) => c.rule.id === 'lonely');
    expect(lonely).toBeDefined();
    expect(lonely!.defeats).toEqual([]);
  });
});
