// Search index generator. Wraps the pure {@link buildSearchIndex} so the
// pipeline can emit `api/v2/search-index.json` deterministically. The v1 legacy
// search index is preserved verbatim inside the v1 generator; this module owns
// the v2 index only.

import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import type { ReleaseContext } from '../core/release.ts';
import type { V2Data } from '../core/types.ts';
import { buildSearchIndex } from '../core/search.ts';

const VERSION = 'v2';

export interface GenerateSearchIndexOptions {
  /** Staging public root (the file is written under api/v2). */
  stagingPublic: string;
  data: V2Data;
  release: ReleaseContext;
}

function sortRecord<T>(value: Record<string, T>): Record<string, T> {
  const result: Record<string, T> = {};
  for (const key of Object.keys(value).sort()) result[key] = value[key];
  return result;
}

/** Emit api/v2/search-index.json. Returns the number of files written (1). */
export function generateSearchIndex(options: GenerateSearchIndexOptions): number {
  const index = buildSearchIndex(options.data);
  const document = {
    api: 'tarif-pajak-id',
    version: VERSION,
    generated: options.release.generatedAt,
    entryCount: index.entryCount,
    entries: sortRecord(index.entries),
    keywords: index.keywords,
  };
  writeFileSync(join(options.stagingPublic, 'api', 'v2', 'search-index.json'), `${JSON.stringify(document, null, 2)}\n`);
  return 1;
}
