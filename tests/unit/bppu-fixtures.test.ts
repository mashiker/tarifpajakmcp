// Task 5 versioned BPPU/KOP metadata. RED-first: these tests fail until
// data/v2/bppu.json carries the canonical versioned BPPU codes with their own
// validity intervals and source-registry references. See
// tests/fixtures/bppu-boundaries.json for the verified expectations.

import { beforeAll, describe, expect, it } from 'vitest';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { getProjectPaths } from '../../src/paths.ts';
import { loadJsonFile } from '../../src/validation/load.ts';
import type { V2Data, BppuCode } from '../../src/core/types.ts';

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
  await readFile(join(paths.root, 'tests', 'fixtures', 'bppu-boundaries.json'), 'utf8'),
) as any;

describe('Versioned BPPU/KOP metadata (Task 5)', () => {
  let v2: V2Data;
  beforeAll(async () => {
    v2 = await loadV2FromDisk();
  });

  it('fixture file declares BPPU is reporting metadata, not rate authority', () => {
    expect(FIXTURES.nonAuthority.length).toBeGreaterThan(0);
    expect(FIXTURES.nonAuthority.join(' ').toLowerCase()).toContain('reporting metadata');
  });

  for (const boundary of FIXTURES.versioningBoundaries as any[]) {
    it(`bppu: ${boundary.id} — ${boundary.description}`, () => {
      const bppu = (v2.bppu ?? []).find((b) => b.code === boundary.code) as BppuCode | undefined;
      expect(bppu, `BPPU code ${boundary.code} must exist`).toBeDefined();
      if (boundary.expect.validFrom) {
        expect(bppu!.validFrom).toBe(boundary.expect.validFrom);
      }
      if (boundary.expect.labelIncludes) {
        const label = String(bppu!.label ?? '').toLowerCase();
        expect(label).toContain(String(boundary.expect.labelIncludes).toLowerCase());
      }
      if (boundary.expect.referencedByRule) {
        const referencing = v2.rules.find((r) => r.id === boundary.expect.referencedByRule);
        expect(referencing, `rule ${boundary.expect.referencedByRule} must reference BPPU ${boundary.code}`).toBeDefined();
        expect(referencing!.bppuId).toBe(bppu!.id);
      }
      if (boundary.expect.sourceIncludes) {
        // BPPU codes may carry a `sourceId` field referencing the form-PER source registry entry.
        const sourceId = (bppu as any).sourceId;
        if (sourceId) {
          expect(sourceId).toBe(boundary.expect.sourceIncludes);
        } else {
          // Otherwise the referenced rule must cite the form source.
          const referencing = v2.rules.find((r) => r.bppuId === bppu!.id);
          if (referencing) {
            const all = new Set([
              ...(referencing.verification?.sourceIds ?? []),
              ...(referencing.verification?.evidence?.map((e) => e.sourceId) ?? []),
            ]);
            expect(all.has(boundary.expect.sourceIncludes), `BPPU ${boundary.code} rule must cite form source ${boundary.expect.sourceIncludes}`).toBe(true);
          }
        }
      }
    });
  }
});
