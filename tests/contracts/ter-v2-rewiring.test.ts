// Contract test for the TER PPh 21 page rewiring (Task 9).
//
// The legacy TER page read from the v1 aggregate (public/api.json), which
// carries the WRONG pre-HPP TER table (42 layers, top 25%, 0% bound 6.6M for
// all categories). The canonical TER rules live in the v2 corpus
// (data/v2/rules/pph-21.json -> rule-pph-21-ter-monthly-a/b/c) with the
// correct PP 58/2023 Lampiran A/B/C values: 44/40/41 layers, 0% bounds
// 5.4M/6.2M/6.6M, top band 34%.
//
// This contract locks two things:
//   1. The v2 canonical TER rules carry the expected layer counts, 0% bounds,
//      and top rate (so a future data regression is caught).
//   2. The BUILT TER page (dist/ter-pph-21/index.html) reads from v2 — it
//      surfaces the v2 layer counts and the 34% top rate, NOT the v1 42/25%
//      values. This is the rewiring contract: the page can no longer drift
//      back to the v1 table.

import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { beforeAll, describe, expect, it } from 'vitest';
import { getProjectPaths } from '../../src/paths.ts';

const paths = getProjectPaths();

interface Bracket { upTo: string | null; rate: string; }
interface V2Rule { data: { id: string; rate: { type: string; brackets: Bracket[] }; conditions: { value: string | string[] } }; }

let terA: V2Rule | undefined;
let terB: V2Rule | undefined;
let terC: V2Rule | undefined;
let terHtml: string;

beforeAll(async () => {
  const readRule = async (id: string) =>
    JSON.parse(await readFile(join(paths.websitePublic, 'api/v2/rules', `${id}.json`), 'utf8')) as V2Rule;
  [terA, terB, terC] = await Promise.all([
    readRule('rule-pph-21-ter-monthly-a'),
    readRule('rule-pph-21-ter-monthly-b'),
    readRule('rule-pph-21-ter-monthly-c'),
  ]);
  terHtml = await readFile(join(paths.websiteDist, 'ter-pph-21', 'index.html'), 'utf8').catch(() => '');
});

describe('TER v2 canonical rules — correct PP 58/2023 values', () => {
  it('TER A has 44 layers (not the v1 42)', () => {
    expect(terA!.data.rate.brackets.length).toBe(44);
  });

  it('TER B has 40 layers', () => {
    expect(terB!.data.rate.brackets.length).toBe(40);
  });

  it('TER C has 41 layers', () => {
    expect(terC!.data.rate.brackets.length).toBe(41);
  });

  it('TER A 0% bound is Rp5.400.000 (first bracket upTo)', () => {
    expect(terA!.data.rate.brackets[0].rate).toBe('0');
    expect(terA!.data.rate.brackets[0].upTo).toBe('5400000');
  });

  it('TER B 0% bound is Rp6.200.000', () => {
    expect(terB!.data.rate.brackets[0].rate).toBe('0');
    expect(terB!.data.rate.brackets[0].upTo).toBe('6200000');
  });

  it('TER C 0% bound is Rp6.600.000', () => {
    expect(terC!.data.rate.brackets[0].rate).toBe('0');
    expect(terC!.data.rate.brackets[0].upTo).toBe('6600000');
  });

  it('TER A/B/C top rate is 34% (last bracket)', () => {
    const topA = terA!.data.rate.brackets[terA!.data.rate.brackets.length - 1];
    const topB = terB!.data.rate.brackets[terB!.data.rate.brackets.length - 1];
    const topC = terC!.data.rate.brackets[terC!.data.rate.brackets.length - 1];
    expect(topA.rate).toBe('0.34');
    expect(topB.rate).toBe('0.34');
    expect(topC.rate).toBe('0.34');
    expect(topA.upTo).toBeNull();
    expect(topB.upTo).toBeNull();
    expect(topC.upTo).toBeNull();
  });
});

describe('TER PPh 21 page — reads v2 values, not the v1 wrong table', () => {
  it('the built page exists', () => {
    expect(terHtml.length).toBeGreaterThan(0);
  });

  it('the page surfaces the v2 layer counts (44/40/41), not the v1 single 42', () => {
    // The rewired page must show the per-category layer counts from v2.
    expect(terHtml).toContain('44');
    expect(terHtml).toContain('40');
    expect(terHtml).toContain('41');
    // The old page hard-coded "42 per kategori" as a single stat card.
    expect(terHtml).not.toContain('42 per kategori');
  });

  it('the page surfaces the 34% top rate (v2), not the v1 25%', () => {
    // The page must surface the canonical 34% top band somewhere visible.
    expect(terHtml).toContain('34%');
  });

  it('the page surfaces the canonical 0% bounds (5.4M / 6.2M / 6.6M)', () => {
    // The v2 first-bracket bounds; the v1 table started all categories at 6.6M.
    // The page formats these as Indonesian "Rp 5,4 juta" / "Rp 6,2 juta" /
    // "Rp 6,6 juta" via the shared fmtRp helper.
    expect(terHtml).toContain('5,4 juta');
    expect(terHtml).toContain('6,2 juta');
    expect(terHtml).toContain('6,6 juta');
  });

  it('the page links to the canonical TER detail route under /tarif/', () => {
    // The category concept id for monthly TER is concept-pph-21-ter-monthly.
    expect(terHtml).toContain('/tarif/concept-pph-21-ter-monthly');
  });
});

describe('TER PPh 21 page — PTKP labels driven from v2 conditions (Task 9 review C2)', () => {
  // The page previously hardcoded TER B as "TK/1" instead of the canonical
  // "K/1". The fix derives every PTKP label from the v2 rule's conditions.value
  // (normalized scalar/array -> comma-joined string), so the page can never
  // drift from the rule data.
  it('TER A PTKP label matches the v2 rule conditions value', () => {
    const v = terA!.data.conditions.value as string[];
    const expected = v.join(', ');
    expect(terHtml).toContain(expected);
  });

  it('TER B PTKP label matches the v2 rule conditions value (not the hardcoded TK/1)', () => {
    const v = terB!.data.conditions.value as string[];
    const expected = v.join(', ');
    expect(terHtml).toContain(expected);
    // Explicitly assert the canonical K/1 appears (the bug was TK/1 instead).
    expect(terHtml).toContain('K/1');
  });

  it('TER C PTKP label matches the v2 rule conditions value (scalar normalized)', () => {
    // TER C source data is a scalar "K/3"; the page normalizes it to a
    // single-element list before joining, so the label is "K/3".
    const v = terC!.data.conditions.value;
    const expected = Array.isArray(v) ? v.join(', ') : String(v);
    expect(terHtml).toContain(expected);
  });

  it('the page does NOT carry the wrong hardcoded TER B label (TK/2, TK/1, TK/3, K/2)', () => {
    // The bug was a hardcoded "TK/1" in the TER B label. The canonical value
    // is "K/1", so the wrong substring must NOT appear as a contiguous label.
    expect(terHtml).not.toContain('TK/2, TK/1, TK/3, K/2');
  });
});
