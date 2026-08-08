// Contract test locking the detail page's inline `deriveStatus` mirror against
// the canonical `deriveRowStatus` helper (Task 9 review — optional minor).
//
// The detail page (`/tarif/[id].astro`) ships an inline `<script is:inline>`
// that re-evaluates per-rule status when the user picks a date. The mirror is
// hand-written JS because the inline script cannot import the TS helper without
// bundling. This contract extracts the mirror from the built HTML, evaluates it
// in a sandbox, and asserts it produces the same status as `deriveRowStatus`
// for every representative (validFrom, validToExclusive, superseded, today)
// tuple. If `deriveRowStatus` evolves, this test forces the mirror to follow.

import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { beforeAll, describe, expect, it } from 'vitest';
import { getProjectPaths } from '../../src/paths.ts';
import { deriveRowStatus, type DatabaseRow } from '../../website/src/lib/database-state.ts';

const paths = getProjectPaths();

let mirrorSource: string | null = null;

beforeAll(async () => {
  // Read any built detail page; extract the inline `toEpochMs` + `deriveStatus`
  // function bodies. The mirror calls `toEpochMs`, so both must be captured.
  const html = await readFile(join(paths.websiteDist, 'tarif', 'concept-illustrative-flat', 'index.html'), 'utf8').catch(() => '');
  if (!html) return;
  // Capture the two function definitions plus everything between them so the
  // eval context has both in scope.
  const m = html.match(/function\s+toEpochMs[\s\S]*?function\s+deriveStatus[\s\S]*?\n\s*\}/);
  mirrorSource = m ? m[0] : null;
});

describe('detail page deriveStatus mirror — matches canonical deriveRowStatus', () => {
  it('the built detail page contains the deriveStatus mirror function', () => {
    expect(mirrorSource, 'deriveStatus mirror must exist in the built detail page').not.toBeNull();
  });

  it('produces the same status as deriveRowStatus for representative tuples', () => {
    if (!mirrorSource) return; // skip if the previous assertion already failed
    // Evaluate the mirror by appending a return statement and running it as a
    // function body. The mirror uses only `Date` and `Number`, both available
    // globally in the Node VM context.
    const wrapped = `(function() { ${mirrorSource}; return deriveStatus; })()`;
    const fn = eval(wrapped) as (validFrom: string, validToExclusive: string | null, superseded: boolean, today: string) => string;
    expect(typeof fn).toBe('function');

    // Representative tuples covering all four statuses and edge cases.
    const tuples: Array<[string, string | null, boolean, string]> = [
      // berlaku: open-ended, in effect
      ['2024-01-01', null, false, '2026-08-06'],
      ['2026-08-06', null, false, '2026-08-06'], // starts exactly today
      // belum_berlaku: future validFrom
      ['2027-01-01', null, false, '2026-08-06'],
      ['2027-01-01', '2028-01-01', false, '2026-08-06'],
      // diubah: superseded (regardless of calendar)
      ['2020-01-01', '2022-01-01', true, '2026-08-06'],
      ['2024-01-01', '2027-01-01', true, '2026-08-06'], // superseded with future end
      // dicabut: non-superseded, past/today end
      ['2024-01-01', '2025-01-01', false, '2026-08-06'],
      ['2024-01-01', '2026-08-06', false, '2026-08-06'], // ends exactly today
      // year-only today anchor
      ['2024-01-01', null, false, '2026'],
    ];
    for (const [validFrom, validToExclusive, superseded, today] of tuples) {
      const row: DatabaseRow = {
        id: 't', ruleId: 't', category: 'x', name: 'x', rate: '0%',
        validFrom, validToExclusive, verification: 'verified_primary', conflict: false, superseded,
      };
      const expected = deriveRowStatus(row, today);
      const actual = fn(validFrom, validToExclusive, superseded, today);
      expect(actual, `mirror mismatch for (${validFrom}, ${validToExclusive}, superseded=${superseded}, today=${today})`).toBe(expected);
    }
  });
});
