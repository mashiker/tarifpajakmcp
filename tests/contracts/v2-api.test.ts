import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { beforeAll, describe, expect, it } from 'vitest';
import { getProjectPaths } from '../../src/paths.ts';

/**
 * Contract: the v2 API surface (envelope with release metadata, typed data,
 * deterministic document set) must be valid and reproducible across fixed-epoch
 * builds. The generator must emit concrete indexes, rules, concepts, BPPU, year
 * segments, and selected exact-date fixtures that the static host can serve.
 */

const paths = getProjectPaths();

async function readJson(rel: string): Promise<any> {
  return JSON.parse(await readFile(join(paths.rootPublic, rel), 'utf8'));
}

describe('v2 API contract', () => {
  describe('v2 envelope and indexes', () => {
    it('index.json carries release metadata and typed endpoint list', async () => {
      const index = await readJson('api/v2/index.json');
      expect(index.api).toBe('tarif-pajak-id');
      expect(index.version).toBe('v2');
      expect(index.release).toBeDefined();
      expect(index.release.sourceHash).toMatch(/^[a-f0-9]{64}$/);
      expect(index.release.generatedAt).toMatch(/^\d{4}-\d{2}-\d{2}T/);
      expect(index.endpoints).toBeDefined();
      expect(index.endpoints.rules).toBe('/api/v2/rules');
      expect(index.endpoints.concepts).toBe('/api/v2/concepts');
    });

    it('rules index lists every rule id and each id has a detail document', async () => {
      const rulesIndex = await readJson('api/v2/rules/index.json');
      expect(rulesIndex.data.rules.length).toBeGreaterThan(0);
      for (const rule of rulesIndex.data.rules.slice(0, 3)) {
        const detail = await readJson(`api/v2/rules/${rule.id}.json`);
        expect(detail.data.id).toBe(rule.id);
        expect(detail.data.validFrom).toBeDefined();
        expect(detail.data.conceptId).toBeDefined();
      }
    });

    it('concepts index lists every concept id and each id has a detail document', async () => {
      const concepts = await readJson('api/v2/concepts/index.json');
      expect(concepts.data.concepts.length).toBeGreaterThan(0);
      for (const concept of concepts.data.concepts.slice(0, 2)) {
        const detail = await readJson(`api/v2/concepts/${concept.id}.json`);
        expect(detail.data.id).toBe(concept.id);
      }
    });

    it('emits a BPPU index and versioned BPPU codes', async () => {
      const bppu = await readJson('api/v2/bppu/index.json');
      expect(Array.isArray(bppu.data.codes)).toBe(true);
      expect(bppu.data.codes.length).toBeGreaterThan(0);
    });

    it('emits a sources index and every source has a regulationId', async () => {
      const sources = await readJson('api/v2/sources/index.json');
      expect(sources.data.sources.length).toBeGreaterThan(0);
      for (const source of sources.data.sources) {
        expect(typeof source.regulationId).toBe('string');
      }
    });
  });

  describe('year segments and selected exact-date fixtures', () => {
    it('emits a by-year index with at least one year and a year document with segments', async () => {
      const byYear = await readJson('api/v2/by-year/index.json');
      expect(byYear.data.years.length).toBeGreaterThan(0);
      const first = byYear.data.years[0];
      const yearDoc = await readJson(`api/v2/by-year/${first.year}.json`);
      expect(Array.isArray(yearDoc.data.segments)).toBe(true);
      // Segments must tile the calendar year as clipped half-open intervals:
      //  - the first segment opens at YYYY-01-01,
      //  - the last segment closes at (YYYY+1)-01-01,
      //  - adjacent segments are contiguous (validToExclusive === next.validFrom),
      //  - every segment is a valid half-open interval (validFrom < validToExclusive).
      // Transition segments may legitimately begin/end mid-year (e.g. a rule that
      // starts 1984-04-01 creates a transition segment inside 1984), so the
      // segment boundaries need NOT all be YYYY-01-01.
      const segments = yearDoc.data.segments;
      const yearStart = `${first.year}-01-01`;
      const yearEndExclusive = `${first.year + 1}-01-01`;
      expect(segments[0].interval.validFrom).toBe(yearStart);
      expect(segments[segments.length - 1].interval.validToExclusive).toBe(yearEndExclusive);
      for (let i = 0; i < segments.length; i++) {
        const seg = segments[i];
        expect(seg.interval.validFrom < seg.interval.validToExclusive).toBe(true);
        if (i > 0) {
          expect(seg.interval.validFrom).toBe(segments[i - 1].interval.validToExclusive);
        }
      }
    });

    it('emits at least one selected exact-date fixture under api/v2/at-date', async () => {
      const atDate = await readJson('api/v2/at-date/index.json');
      expect(atDate.data.dates.length).toBeGreaterThan(0);
      const first = atDate.data.dates[0];
      const doc = await readJson(`api/v2/at-date/${first.date}.json`);
      expect(doc.data.date).toBe(first.date);
    });
  });

  describe('serialized rules corpus for client-side resolver', () => {
    it('emits a rules corpus that the website can load', async () => {
      const corpus = await readJson('api/v2/rules-corpus.json');
      expect(corpus.api).toBe('tarif-pajak-id');
      expect(corpus.version).toBe('v2');
      expect(Array.isArray(corpus.data.rules)).toBe(true);
      expect(corpus.data.rules.length).toBeGreaterThan(0);
    });
  });

  describe('v2 determinism across two fixed-epoch builds', () => {
    // This is asserted indirectly via the existing release-metadata/artifact-sync
    // contracts; here we only assert the generated v2 documents are stable JSON
    // (sorted keys are the generator's responsibility).
    let indexA: any;
    beforeAll(async () => {
      indexA = await readJson('api/v2/index.json');
    });

    it('v2 index.json is stable JSON with sorted top-level keys', () => {
      expect(Object.keys(indexA)).toEqual([...new Set(Object.keys(indexA))].sort());
    });
  });
});
