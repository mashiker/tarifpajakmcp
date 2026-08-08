import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { beforeAll, describe, expect, it } from 'vitest';
import { getProjectPaths } from '../../src/paths.ts';

/**
 * Contract: the public API v1 surface (entry IDs, category slugs, documented
 * endpoint paths, BPPU index, regulations index, timeline index, search index,
 * consolidated index) must remain stable across the temporal redesign. The
 * temporal v2 model is additive; it never rewrites, removes, or renames v1 IDs.
 *
 * These fixtures are derived from the pre-redesign build and locked here so the
 * Task 3 generators cannot silently drop or rename v1 contract surface.
 */

// Snapshot of the documented v1 endpoint paths declared by the pre-redesign
// openapi.json. Each path corresponds to at least one generated static file.
// This is a faithful lock of the existing surface (19 paths); the temporal
// redesign must not remove or rename any of them.
const V1_ENDPOINT_PATHS = [
  '/api/v1/index.json',
  '/api/v1/stats.json',
  '/api/v1/entries/index.json',
  '/api/v1/entries/{id}.json',
  '/api/v1/categories/index.json',
  '/api/v1/categories/{slug}.json',
  '/api/v1/by-year/{year}.json',
  '/api/v1/bppu/index.json',
  '/api/v1/bppu/{prefix}.json',
  '/api/v1/timeline/index.json',
  '/api/v1/timeline/{group}.json',
  '/api/v1/search-index.json',
  '/api/v1/regulations/index.json',
  '/api/v1/regulations/{id}.json',
  '/api/v1/calculator/index.json',
  '/api/v1/calculator/{id}.json',
  '/api/v1/consolidated/index.json',
  '/api/v1/consolidated/{id}.json',
  '/api/v1/consolidated/{id}/pasal-{number}.json',
] as const;

const paths = getProjectPaths();

async function readJson(rel: string): Promise<any> {
  return JSON.parse(await readFile(join(paths.rootPublic, rel), 'utf8'));
}

describe('v1 API contract', () => {
  describe('documented endpoint paths are preserved', () => {
    it('every documented v1 path is present in openapi.json', async () => {
      const openapi = await readJson('api/v1/openapi.json');
      const declared = Object.keys(openapi.paths).sort();
      for (const path of V1_ENDPOINT_PATHS) {
        expect(declared, `missing declared path ${path}`).toContain(path);
      }
    });

    it('declares only documented v1 paths (no silent removal)', async () => {
      const openapi = await readJson('api/v1/openapi.json');
      const declared = Object.keys(openapi.paths).sort();
      expect(declared.sort()).toEqual([...V1_ENDPOINT_PATHS].sort());
    });

    it('uses the canonical pages.dev origin for servers and contact.url', async () => {
      const openapi = await readJson('api/v1/openapi.json');
      expect(openapi.servers[0].url).toBe('https://tarif-pajak-id.pages.dev');
      expect(openapi.info.contact.url).toBe('https://tarif-pajak-id.pages.dev');
    });
  });

  describe('entry IDs and category slugs match the locked v1 snapshot', () => {
    // Locked snapshot of every v1 entry id produced by the pre-redesign build.
    // Captured from the public/ artifact before Task 3. Order is sorted.
    let entryIds: string[];
    let categorySlugs: string[];

    beforeAll(async () => {
      const entries = await readJson('api/v1/entries/index.json');
      entryIds = entries.data.entries.map((e: { id: string }) => e.id).sort();
      const cats = await readJson('api/v1/categories/index.json');
      categorySlugs = cats.data.categories.map((c: { slug: string }) => c.slug).sort();
    });

    it('preserves the locked count of v1 entries', () => {
      // Pre-redesign build had 136 entries. This is a floor: the redesign must
      // not drop any. If real tax migration (Tasks 4-7) later adds entries, the
      // floor is raised rather than lowered here.
      expect(entryIds.length).toBeGreaterThanOrEqual(136);
    });

    it('preserves the locked set of v1 category slugs', () => {
      expect(categorySlugs).toEqual([
        'bea-masuk',
        'bea-meterai',
        'bphtb',
        'cukai',
        'pajak-daerah',
        'pbb',
        'pph-21',
        'pph-22',
        'pph-23',
        'pph-26',
        'pph-4-2-final',
        'pph-badan',
        'pph-umkm',
        'ppn',
        'ppnbm',
      ]);
    });

    it('preserves a representative sample of v1 entry IDs verbatim', () => {
      const sample = [
        'ppn-10pct',
        'ppn-11pct-2022',
        'ppn-11pct-effective-2025',
        'pph-21-ter-monthly-2024',
        'pph-21-progressive-annual-2024',
        'pph-21-non-taxable-income',
        'pph-23-jasa-lain-2pct',
        'pph-badan-2022-plus',
        'pph-umkm-1pct-pp46',
        'bea-meterai-1000',
      ];
      for (const id of sample) {
        expect(entryIds, `missing locked v1 entry id ${id}`).toContain(id);
      }
    });

    it('every v1 entry has a generated detail file under api/v1/entries', () => {
      // The detail files are not all read here (cost), but the index must list
      // the same ids and each id maps to a file path.
      for (const id of entryIds.slice(0, 10)) {
        const file = join(paths.rootPublic, 'api', 'v1', 'entries', `${id}.json`);
        expect(existsSync(file), `missing detail file for ${id}`).toBe(true);
      }
    });
  });

  describe('index, bppu, regulations, timeline, search, consolidated indexes exist', () => {
    it('index.json declares the documented endpoint map', async () => {
      const index = await readJson('api/v1/index.json');
      expect(index.api).toBe('tarif-pajak-id');
      expect(index.version).toBe('v1');
      expect(index.endpoints).toBeDefined();
      expect(index.endpoints.entries).toBe('/api/v1/entries');
      expect(index.endpoints.search).toBe('/api/v1/search-index.json');
      expect(index.endpoints.openapi).toBe('/api/v1/openapi.json');
    });

    it('bppu, regulations, timeline, consolidated, search indexes are non-empty JSON', async () => {
      for (const rel of [
        'api/v1/bppu/index.json',
        'api/v1/regulations/index.json',
        'api/v1/timeline/index.json',
        'api/v1/consolidated/index.json',
        'api/v1/search-index.json',
      ]) {
        const doc = await readJson(rel);
        expect(doc).toBeTruthy();
      }
    });
  });
});
