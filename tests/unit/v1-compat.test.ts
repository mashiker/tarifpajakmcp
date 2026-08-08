import { describe, expect, it } from 'vitest';
import { projectRuleToV1, projectRulesToV1, v1EntryId, v1EffectiveToInclusive } from '../../src/compat/v1.ts';
import type { TaxRule, V2Data } from '../../src/core/types.ts';

function rule(partial: Partial<TaxRule> & Pick<TaxRule, 'id' | 'conceptId' | 'validFrom'>): TaxRule {
  return { validToExclusive: null, ...partial } as TaxRule;
}

describe('v1 compatibility projection', () => {
  it('converts validToExclusive (half-open) to inclusive legacy effectiveTo', () => {
    expect(v1EffectiveToInclusive('2025-01-01')).toBe('2024-12-31');
    expect(v1EffectiveToInclusive(null)).toBeNull();
  });

  it('projects a v2 rule into a v1 entry preserving the v1 ID and inclusive end', () => {
    const r = rule({
      id: 'rule-illustrative-flat-new',
      conceptId: 'c1',
      categoryId: 'cat-1',
      validFrom: '2024-06-01',
      validToExclusive: '2025-01-01',
      rate: { type: 'percentage', value: '0.11' },
      conditions: { op: 'equals', fact: 'kind', value: 'goods' },
      verification: { status: 'verified_primary', sourceIds: ['src-1'] },
    });
    const entry = projectRuleToV1(r, {
      concepts: [{ id: 'c1', categoryId: 'cat-1', name: 'Concept' }],
      categories: [{ id: 'cat-1', name: 'Category', slug: 'category' }],
      sources: [{ id: 'src-1', name: 'Src', official: true, regulationId: 'R/1', locator: 'a' }],
    });
    expect(entry.id).toBe('rule-illustrative-flat-new');
    expect(entry.effectiveFrom).toBe('2024-06-01');
    expect(entry.effectiveTo).toBe('2024-12-31');
    expect(entry.category).toBe('Category');
    expect(entry.rate.type).toBe('percentage');
    expect((entry.rate as { value: number }).value).toBe(11);
    // A rule with an inclusive end (i.e. it has ended) projects as `diubah`,
    // matching the pre-redesign v1 convention for superseded entries.
    expect(entry.status).toBe('diubah');
  });

  it('maps a null end to effectiveTo null and status berlaku', () => {
    const r = rule({
      id: 'rule-open',
      conceptId: 'c1',
      validFrom: '2024-01-01',
      validToExclusive: null,
      rate: { type: 'percentage', value: '0.10' },
      verification: { status: 'verified_primary', sourceIds: ['src-1'] },
    });
    const entry = projectRuleToV1(r, {
      concepts: [{ id: 'c1', categoryId: 'cat-1', name: 'Concept' }],
      categories: [{ id: 'cat-1', name: 'Category', slug: 'category' }],
      sources: [{ id: 'src-1', name: 'Src', official: true, regulationId: 'R/1', locator: 'a' }],
    });
    expect(entry.effectiveTo).toBeNull();
    expect(entry.status).toBe('berlaku');
  });

  it('maps non-active verification status to a non-berlaku v1 status', () => {
    const r = rule({
      id: 'rule-old',
      conceptId: 'c1',
      validFrom: '2020-01-01',
      validToExclusive: '2024-01-01',
      rate: { type: 'percentage', value: '0.10' },
      verification: { status: 'verified_secondary', sourceIds: ['src-1'] },
    });
    const entry = projectRuleToV1(r, {
      concepts: [{ id: 'c1', categoryId: 'cat-1', name: 'Concept' }],
      categories: [{ id: 'cat-1', name: 'Category', slug: 'category' }],
      sources: [{ id: 'src-1', name: 'Src', official: true, regulationId: 'R/1', locator: 'a' }],
    });
    expect(entry.status).toBe('diubah');
  });

  it('projects a ruleset deterministically and preserves v1 IDs', () => {
    const rules = [
      rule({ id: 'a', conceptId: 'c1', validFrom: '2024-01-01', validToExclusive: null, rate: { type: 'percentage', value: '0.10' }, verification: { status: 'verified_primary', sourceIds: ['src-1'] } }),
      rule({ id: 'b', conceptId: 'c1', validFrom: '2023-01-01', validToExclusive: '2024-01-01', rate: { type: 'percentage', value: '0.08' }, verification: { status: 'verified_primary', sourceIds: ['src-1'] } }),
    ];
    const v2: V2Data = {
      sources: [{ id: 'src-1', name: 'Src', official: true, regulationId: 'R/1', locator: 'a' }],
      categories: [{ id: 'cat-1', name: 'Category', slug: 'category' }],
      concepts: [{ id: 'c1', categoryId: 'cat-1', name: 'Concept' }],
      rules,
      conflicts: [],
      bppu: [],
    };
    const projected = projectRulesToV1(v2);
    expect(projected.entries.map((e) => e.id)).toEqual(['a', 'b']);
    expect(projected.entries[1].effectiveTo).toBe('2023-12-31');
  });

  it('v1EntryId returns the rule id unchanged (v1 ID equals v2 rule id by contract)', () => {
    expect(v1EntryId('rule-illustrative-flat-new')).toBe('rule-illustrative-flat-new');
  });
});
