import { describe, expect, it } from 'vitest';
import { validateV2 } from '../../src/validation/semantic.ts';
import type { V2Data } from '../../src/core/types.ts';

const empty: V2Data = { sources: [], concepts: [], categories: [], rules: [], conflicts: [], bppu: [] };

function fixture(): V2Data {
  return {
    categories: [{ id: 'cat-1', name: 'Illustrative', slug: 'illustrative' }],
    concepts: [{ id: 'concept-1', categoryId: 'cat-1', name: 'Illustrative concept' }],
    sources: [
      { id: 'src-official', name: 'Official illustrative gazette', official: true, regulationId: 'REG/2024', locator: 'Article 1', url: 'https://example.invalid/reg-2024' },
      { id: 'src-secondary', name: 'Secondary illustrative note', official: false, regulationId: 'REG/2024', locator: 'p.2' },
    ],
    bppu: [{ id: 'bppu-1', code: '22-100-01' }],
    rules: [],
    conflicts: [],
  };
}

describe('semantic validation - critical', () => {
  it('reports duplicate IDs and missing concept/category foreign keys deterministically', () => {
    const report = validateV2({
      ...empty,
      concepts: [{ id: 'c1', categoryId: 'missing' }, { id: 'c1', categoryId: 'missing' }],
    });
    expect(report.valid).toBe(false);
    expect(report.issues.map((issue) => issue.code)).toEqual(['duplicate_id', 'missing_foreign_key', 'missing_foreign_key']);
  });

  it('verified_primary requires official source, regulation ID, locator, and rate/interval/condition evidence', () => {
    const base = fixture();
    // Missing everything.
    const none = validateV2({
      ...base,
      rules: [{
        id: 'r1', conceptId: 'concept-1', validFrom: '2024-01-01', validToExclusive: null,
        rate: { type: 'percentage', value: '0.1' },
        verification: { status: 'verified_primary', sourceIds: [] },
      }],
    });
    expect(none.valid).toBe(false);
    expect(none.issues.some((i) => i.code === 'primary_evidence_required')).toBe(true);

    // Evidence resolves to unknown source.
    const unknownSource = validateV2({
      ...base,
      rules: [{
        id: 'r1', conceptId: 'concept-1', validFrom: '2024-01-01', validToExclusive: null,
        rate: { type: 'percentage', value: '0.1' },
        verification: {
          status: 'verified_primary', sourceIds: ['src-unknown'],
          evidence: [
            { claim: 'rate', sourceId: 'src-unknown', locator: 'a' },
            { claim: 'interval', sourceId: 'src-unknown', locator: 'a' },
            { claim: 'condition', sourceId: 'src-unknown', locator: 'a' },
          ],
        },
      }],
    });
    expect(unknownSource.valid).toBe(false);
    expect(unknownSource.issues.some((i) => i.code === 'evidence_source_unknown')).toBe(true);

    // Only secondary source: not enough for verified_primary.
    const secondaryOnly = validateV2({
      ...base,
      rules: [{
        id: 'r1', conceptId: 'concept-1', validFrom: '2024-01-01', validToExclusive: null,
        rate: { type: 'percentage', value: '0.1' },
        verification: {
          status: 'verified_primary', sourceIds: ['src-secondary'],
          evidence: [
            { claim: 'rate', sourceId: 'src-secondary', locator: 'a' },
            { claim: 'interval', sourceId: 'src-secondary', locator: 'a' },
            { claim: 'condition', sourceId: 'src-secondary', locator: 'a' },
          ],
        },
      }],
    });
    expect(secondaryOnly.valid).toBe(false);
    expect(secondaryOnly.issues.some((i) => i.code === 'primary_official_source_required')).toBe(true);

    // Complete and correct: passes.
    const ok = validateV2({
      ...base,
      rules: [{
        id: 'r1', conceptId: 'concept-1', validFrom: '2024-01-01', validToExclusive: null,
        rate: { type: 'percentage', value: '0.1' },
        conditions: { op: 'equals', fact: 'kind', value: 'goods' },
        verification: {
          status: 'verified_primary', sourceIds: ['src-official'],
          evidence: [
            { claim: 'rate', sourceId: 'src-official', locator: 'Article 1(1)' },
            { claim: 'interval', sourceId: 'src-official', locator: 'Article 1' },
            { claim: 'condition', sourceId: 'src-official', locator: 'Article 1(2)' },
          ],
        },
      }],
    });
    expect(ok.valid).toBe(true);
  });

  it('declared source_conflict is publishable but undeclared contradiction is an error', () => {
    const base = fixture();
    // Two rules with same exclusive group, same interval, same concept => potential contradiction.
    const rules = [
      {
        id: 'r-a', conceptId: 'concept-1', validFrom: '2024-01-01', validToExclusive: '2025-01-01',
        rate: { type: 'percentage', value: '0.1' }, exclusiveGroup: 'g1',
      },
      {
        id: 'r-b', conceptId: 'concept-1', validFrom: '2024-01-01', validToExclusive: '2025-01-01',
        rate: { type: 'percentage', value: '0.2' }, exclusiveGroup: 'g1',
      },
    ];
    // Undeclared => unexplained overlap is an error.
    const undeclared = validateV2({ ...base, rules });
    expect(undeclared.valid).toBe(false);
    expect(undeclared.issues.some((i) => i.code === 'exclusive_overlap')).toBe(true);

    // Declared conflict: publishable. No exclusive_overlap error and a declared_conflict is recorded.
    const declared = validateV2({
      ...base,
      rules,
      conflicts: [{ id: 'conf-1', kind: 'rate', ruleIds: ['r-a', 'r-b'], description: 'Illustrative declared conflict' }],
    });
    expect(declared.issues.some((i) => i.code === 'exclusive_overlap')).toBe(false);
    // Even declared conflict rules cannot be verified_primary exact.
    const declaredExact = validateV2({
      ...base,
      rules: rules.map((r) => ({ ...r, verification: { status: 'verified_primary' as const, sourceIds: ['src-official'], evidence: [
        { claim: 'rate' as const, sourceId: 'src-official', locator: 'a' },
        { claim: 'interval' as const, sourceId: 'src-official', locator: 'a' },
        { claim: 'condition' as const, sourceId: 'src-official', locator: 'a' },
      ] } })),
      conflicts: [{ id: 'conf-1', kind: 'rate' as const, ruleIds: ['r-a', 'r-b'], description: 'Illustrative declared conflict' }],
    });
    expect(declaredExact.valid).toBe(false);
    expect(declaredExact.issues.some((i) => i.code === 'conflict_cannot_be_exact')).toBe(true);
  });

  it('detects supersession cycles', () => {
    const base = fixture();
    const cyclic = validateV2({
      ...base,
      rules: [
        { id: 'r1', conceptId: 'concept-1', validFrom: '2024-01-01', validToExclusive: null, supersedes: ['r2'] },
        { id: 'r2', conceptId: 'concept-1', validFrom: '2023-01-01', validToExclusive: '2024-01-01', supersedes: ['r1'] },
      ],
    });
    expect(cyclic.valid).toBe(false);
    expect(cyclic.issues.some((i) => i.code === 'supersession_cycle')).toBe(true);
    expect(cyclic.issues.some((i) => i.code === 'missing_foreign_key')).toBe(false);
  });

  it('reports invalid BPPU foreign keys', () => {
    const base = fixture();
    const bad = validateV2({
      ...base,
      rules: [{ id: 'r1', conceptId: 'concept-1', validFrom: '2024-01-01', validToExclusive: null, bppuId: 'bppu-missing' }],
    });
    expect(bad.valid).toBe(false);
    expect(bad.issues.some((i) => i.code === 'bppu_foreign_key')).toBe(true);
  });

  it('reports invalid half-open intervals as issues rather than throwing', () => {
    const base = fixture();
    const bad = validateV2({
      ...base,
      rules: [{ id: 'r1', conceptId: 'concept-1', validFrom: '2024-02-02', validToExclusive: '2024-02-01' }],
    });
    expect(bad.valid).toBe(false);
    expect(bad.issues.some((i) => i.code === 'invalid_interval')).toBe(true);
  });

  it('reports malformed progressive brackets (overlap, out-of-order, open-not-last)', () => {
    const base = fixture();
    const overlap = validateV2({
      ...base,
      rules: [{
        id: 'r1', conceptId: 'concept-1', validFrom: '2024-01-01', validToExclusive: null,
        rate: { type: 'progressive', brackets: [
          { upTo: '100', rate: '0.1' },
          { upTo: '50', rate: '0.2' },
        ] },
      }],
    });
    expect(overlap.valid).toBe(false);
    expect(overlap.issues.some((i) => i.code === 'progressive_bracket_order')).toBe(true);

    const openNotLast = validateV2({
      ...base,
      rules: [{
        id: 'r2', conceptId: 'concept-1', validFrom: '2024-01-01', validToExclusive: null,
        rate: { type: 'progressive', brackets: [
          { upTo: null, rate: '0.2' },
          { upTo: '100', rate: '0.1' },
        ] },
      }],
    });
    expect(openNotLast.valid).toBe(false);
    expect(openNotLast.issues.some((i) => i.code === 'progressive_bracket_order')).toBe(true);
  });

  it('reports invalid examples (unknown rule reference is not required, but missing required fields are)', () => {
    const base = fixture();
    const bad = validateV2({
      ...base,
      rules: [{
        id: 'r1', conceptId: 'concept-1', validFrom: '2024-01-01', validToExclusive: null,
        examples: [{ id: 'ex-1', illustrative: undefined as unknown as boolean, input: {} }],
      }],
    });
    expect(bad.valid).toBe(false);
    expect(bad.issues.some((i) => i.code === 'invalid_example')).toBe(true);

    // A valid illustrative example passes.
    const ok = validateV2({
      ...base,
      rules: [{
        id: 'r1', conceptId: 'concept-1', validFrom: '2024-01-01', validToExclusive: null,
        examples: [{ id: 'ex-1', illustrative: true, input: { base: '100' }, expectedAmount: '15.00', label: 'Illustrative' }],
      }],
    });
    expect(ok.valid).toBe(true);
  });

  it('declared conflicts referencing unknown rules fail; conflicts without rules are ignored', () => {
    const base = fixture();
    const unknownRule = validateV2({
      ...base,
      conflicts: [{ id: 'conf-1', kind: 'rate', ruleIds: ['missing-1', 'missing-2'], description: 'Illustrative' }],
    });
    expect(unknownRule.valid).toBe(false);
    expect(unknownRule.issues.some((i) => i.code === 'conflict_rule_unknown')).toBe(true);
  });
});
