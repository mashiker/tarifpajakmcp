import { describe, expect, it } from 'vitest';
import { buildSearchIndex, searchRules, normalizeSearchText, tokenize } from '../../src/core/search.ts';
import type { TaxRule, V2Data } from '../../src/core/types.ts';

function rule(partial: Partial<TaxRule> & Pick<TaxRule, 'id' | 'conceptId' | 'validFrom'>): TaxRule {
  return { validToExclusive: null, ...partial } as TaxRule;
}

describe('search normalization', () => {
  it('lowercases, strips diacritics, and splits on non-alphanumeric boundaries', () => {
    // tokenize preserves source order; the index layer sorts. Single chars drop.
    expect(tokenize('PPh 21 — Jasa Konsultan! (2024)').sort()).toEqual(['2024', '21', 'jasa', 'konsultan', 'pph']);
  });

  it('normalizes Indonesian diacritics, case, and punctuation via normalizeSearchText', () => {
    expect(normalizeSearchText('TARIF PPh Pajak-Pertambahan')).toBe('tarif pph pajak pertambahan');
  });

  it('drops single-character tokens and pure punctuation', () => {
    expect(tokenize('a - b  cc')).toEqual(['cc']);
  });
});

describe('search index build + query', () => {
  const rules: TaxRule[] = [
    rule({ id: 'pph-21-ter', conceptId: 'c1', validFrom: '2024-01-01', rate: { type: 'percentage', value: '0.05' } }),
    rule({ id: 'ppn-11', conceptId: 'c2', validFrom: '2022-04-01', rate: { type: 'percentage', value: '0.11' } }),
  ];
  const concepts = [
    { id: 'c1', categoryId: 'cat-pph', name: 'PPh 21 TER' },
    { id: 'c2', categoryId: 'cat-ppn', name: 'PPN umum' },
  ];
  const categories = [
    { id: 'cat-pph', name: 'Pajak Penghasilan', slug: 'pph-21' },
    { id: 'cat-ppn', name: 'Pajak Pertambahan Nilai', slug: 'ppn' },
  ];
  const v2: V2Data = { sources: [], concepts, categories, rules, conflicts: [], bppu: [] };

  it('builds a deterministic inverted index keyed by token', () => {
    const index = buildSearchIndex(v2);
    expect(index.entryCount).toBe(2);
    expect(Object.keys(index.entries).sort()).toEqual(['pph-21-ter', 'ppn-11']);
    expect(index.entries['pph-21-ter'].sort()).toEqual(['21', 'pph', 'ter']);
    expect(index.keywords['ppn']).toContain('ppn-11');
  });

  it('returns deterministic sorted matches for a multi-token query', () => {
    const index = buildSearchIndex(v2);
    const hits = searchRules(index, 'pph 21');
    expect(hits.map((h) => h.id)).toEqual(['pph-21-ter']);
  });

  it('returns no synthetic hits and an empty list for an unmatched query', () => {
    const index = buildSearchIndex(v2);
    expect(searchRules(index, 'cukai')).toEqual([]);
  });

  it('ranks rules that match more query tokens ahead of single-token matches', () => {
    const localRules: TaxRule[] = [
      rule({ id: 'a', conceptId: 'c1', validFrom: '2024-01-01', rate: { type: 'percentage', value: '0.1' } }),
      rule({ id: 'b', conceptId: 'c2', validFrom: '2024-01-01', rate: { type: 'percentage', value: '0.1' } }),
    ];
    const local: V2Data = {
      sources: [],
      categories: [
        { id: 'cat-x', name: 'Pajak Pertambahan Nilai', slug: 'ppn' },
        { id: 'cat-y', name: 'Lain', slug: 'lain' },
      ],
      concepts: [
        { id: 'c1', categoryId: 'cat-x', name: 'PPN umum barang mewah' },
        { id: 'c2', categoryId: 'cat-y', name: 'PPN' },
      ],
      rules: localRules,
      conflicts: [],
      bppu: [],
    };
    const index = buildSearchIndex(local);
    const hits = searchRules(index, 'ppn barang mewah');
    expect(hits.map((h) => h.id)).toEqual(['a', 'b']);
    expect(hits[0].score).toBeGreaterThan(hits[1].score);
  });

  it('empty query returns every rule in deterministic id order with zero score', () => {
    const index = buildSearchIndex(v2);
    const hits = searchRules(index, '');
    expect(hits.map((h) => h.id)).toEqual(['pph-21-ter', 'ppn-11']);
    expect(hits.every((h) => h.score === 0)).toBe(true);
  });
});
