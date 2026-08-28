// Unit tests for the pure URL state + filtering helpers used by the root
// database experience. These pin the contract required by Task 8:
//   - parse/serialize roundtrip
//   - defaults are explicit (no silent "current law")
//   - invalid dates fall back to the explicit default date mode
//   - multiple filters coexist
//   - year mode (YYYY) and date mode (YYYY-MM-DD) are distinguishable
//   - sort is deterministic
//   - filterDatabaseRows is pure
//
// The website lib uses .ts extension imports so this test mirrors that style.

import { describe, expect, it } from 'vitest';
import {
  DEFAULT_DATABASE_STATE,
  VERIFICATION_OPTIONS,
  STATUS_OPTIONS,
  SORT_OPTIONS,
  parseDatabaseState,
  serializeDatabaseState,
  filterDatabaseRows,
  databaseStateEquals,
  summarizeDatabaseRows,
  type DatabaseRow,
  type DatabaseState,
} from '../../website/src/lib/database-state.ts';

describe('parseDatabaseState — defaults', () => {
  it('returns explicit defaults for an empty query string', () => {
    const state = parseDatabaseState('');
    expect(state.q).toBe('');
    expect(state.date).toBe('');
    // No implicit "current law" — UI must surface an explicit default date.
    expect(state.category).toBe('all');
    expect(state.status).toBe('all');
    expect(state.verification).toBe('all');
    expect(state.sort).toBe('category');
  });

  it('exposes a DEFAULT_DATABASE_STATE constant with the same shape', () => {
    expect(DEFAULT_DATABASE_STATE).toEqual(parseDatabaseState(''));
  });

  it('does not silently inject today\'s date', () => {
    // The URL is the single source of truth: an unset date stays empty.
    expect(parseDatabaseState('').date).toBe('');
    expect(parseDatabaseState('?q=ppn').date).toBe('');
  });
});

describe('parseDatabaseState — fields', () => {
  it('parses a populated query string', () => {
    const state = parseDatabaseState('?q=ppn&date=2024-06-15&category=ppn&status=berlaku&verification=verified_primary&sort=rate');
    expect(state).toEqual({
      q: 'ppn',
      date: '2024-06-15',
      category: 'ppn',
      status: 'berlaku',
      verification: 'verified_primary',
      sort: 'rate',
    });
  });

  it('trims and lowercases the free-text query', () => {
    expect(parseDatabaseState('?q=  PPN  ').q).toBe('ppn');
  });

  it('parses a hash-bearing URL preserving query', () => {
    const state = parseDatabaseState('?q=sewa#row-3');
    expect(state.q).toBe('sewa');
  });
});

describe('parseDatabaseState — invalid input handling', () => {
  it('rejects a malformed date and falls back to default (empty)', () => {
    expect(parseDatabaseState('?date=2024-13-40').date).toBe('');
    expect(parseDatabaseState('?date=not-a-date').date).toBe('');
    expect(parseDatabaseState('?date=2024/06/15').date).toBe('');
  });

  it('rejects February 30 rollover', () => {
    expect(parseDatabaseState('?date=2024-02-30').date).toBe('');
  });

  it('ignores unknown enum values and falls back to defaults', () => {
    const state = parseDatabaseState('?status=garbage&verification=foo&sort=bar&category=');
    expect(state.status).toBe('all');
    expect(state.verification).toBe('all');
    expect(state.sort).toBe('category');
    expect(state.category).toBe('all');
  });

  it('accepts year-only input as date mode YYYY', () => {
    // Year mode is a valid temporal query: resolver treats it as a year query.
    expect(parseDatabaseState('?date=2024').date).toBe('2024');
  });
});

describe('serializeDatabaseState — roundtrip', () => {
  it('serializes defaults to an empty string', () => {
    expect(serializeDatabaseState(DEFAULT_DATABASE_STATE)).toBe('');
  });

  it('roundtrips a fully-populated state', () => {
    const state: DatabaseState = {
      q: 'ppn',
      date: '2024-06-15',
      category: 'ppn',
      status: 'berlaku',
      verification: 'verified_primary',
      sort: 'rate',
    };
    const query = serializeDatabaseState(state);
    expect(parseDatabaseState(query)).toEqual(state);
  });

  it('omits defaults (q empty, category all, etc.) so the URL stays clean', () => {
    const query = serializeDatabaseState({ ...DEFAULT_DATABASE_STATE, q: 'ppn' });
    expect(query).toBe('?q=ppn');
  });

  it('roundtrips every documented sort option', () => {
    for (const sort of SORT_OPTIONS) {
      const state: DatabaseState = { ...DEFAULT_DATABASE_STATE, sort };
      expect(parseDatabaseState(serializeDatabaseState(state)).sort).toBe(sort);
    }
  });

  it('roundtrips every documented status option', () => {
    for (const status of STATUS_OPTIONS) {
      const state: DatabaseState = { ...DEFAULT_DATABASE_STATE, status };
      expect(parseDatabaseState(serializeDatabaseState(state)).status).toBe(status);
    }
  });

  it('roundtrips every documented verification option', () => {
    for (const verification of VERIFICATION_OPTIONS) {
      const state: DatabaseState = { ...DEFAULT_DATABASE_STATE, verification };
      expect(parseDatabaseState(serializeDatabaseState(state)).verification).toBe(verification);
    }
  });

  it('encodes reserved characters in the query', () => {
    const state: DatabaseState = { ...DEFAULT_DATABASE_STATE, q: 'jasa & sewa?' };
    expect(serializeDatabaseState(state)).toBe('?q=jasa+%26+sewa%3F');
    expect(parseDatabaseState(serializeDatabaseState(state)).q).toBe('jasa & sewa?');
  });
});

describe('databaseStateEquals', () => {
  it('treats default and default-shaped states as equal', () => {
    expect(databaseStateEquals(DEFAULT_DATABASE_STATE, parseDatabaseState(''))).toBe(true);
  });

  it('distinguishes states that differ only by sort', () => {
    const a: DatabaseState = { ...DEFAULT_DATABASE_STATE, sort: 'category' };
    const b: DatabaseState = { ...DEFAULT_DATABASE_STATE, sort: 'rate' };
    expect(databaseStateEquals(a, b)).toBe(false);
  });
});

// Sample rows for filtering tests. Mirrors the shape emitted by the database
// dataset builder: stable id, category slug, transaction label, formatted rate,
// validFrom, validToExclusive (null = open-ended), verification, conflict flag.
function row(partial: Partial<DatabaseRow> & Pick<DatabaseRow, 'id' | 'category' | 'name' | 'rate'>): DatabaseRow {
  return {
    ruleId: partial.id,
    validFrom: '2024-01-01',
    validToExclusive: null,
    verification: 'verified_primary',
    conflict: false,
    ...partial,
  } as DatabaseRow;
}

const SAMPLE_ROWS: DatabaseRow[] = [
  row({ id: 'r-ppn-11', category: 'ppn', name: 'PPN 11%', rate: '11%', validFrom: '2022-04-01', validToExclusive: '2025-01-01', verification: 'verified_primary' }),
  row({ id: 'r-ppn-12', category: 'ppn', name: 'PPN 12%', rate: '12%', validFrom: '2025-01-01', validToExclusive: null, verification: 'verified_primary' }),
  row({ id: 'r-pph23-2', category: 'pph-23', name: 'PPh 23 jasa lain', rate: '2%', validFrom: '2015-08-26', validToExclusive: null, verification: 'verified_primary' }),
  row({ id: 'r-conflict', category: 'pph-23', name: 'Disputed rate', rate: '15%', validFrom: '2024-01-01', validToExclusive: '2025-01-01', verification: 'source_conflict', conflict: true }),
  row({ id: 'r-review', category: 'pph-badan', name: 'IKN facility', rate: '0%', validFrom: '2024-01-01', validToExclusive: null, verification: 'needs_review' }),
];

describe('filterDatabaseRows — purity', () => {
  it('returns the same result for the same inputs', () => {
    const state: DatabaseState = { ...DEFAULT_DATABASE_STATE, q: 'ppn' };
    expect(filterDatabaseRows(SAMPLE_ROWS, state)).toEqual(filterDatabaseRows(SAMPLE_ROWS, state));
  });

  it('does not mutate the input rows', () => {
    const snapshot = JSON.parse(JSON.stringify(SAMPLE_ROWS));
    filterDatabaseRows(SAMPLE_ROWS, { ...DEFAULT_DATABASE_STATE, q: 'ppn' });
    expect(SAMPLE_ROWS).toEqual(snapshot);
  });
});

describe('filterDatabaseRows — text search', () => {
  it('matches name, id, and category tokens case-insensitively', () => {
    const ids = filterDatabaseRows(SAMPLE_ROWS, { ...DEFAULT_DATABASE_STATE, q: 'PPN' }).map((r) => r.id);
    expect(ids.sort()).toEqual(['r-ppn-11', 'r-ppn-12']);

    const idsById = filterDatabaseRows(SAMPLE_ROWS, { ...DEFAULT_DATABASE_STATE, q: 'r-pph23-2' }).map((r) => r.id);
    expect(idsById).toEqual(['r-pph23-2']);
  });

  it('returns nothing when no row matches', () => {
    expect(filterDatabaseRows(SAMPLE_ROWS, { ...DEFAULT_DATABASE_STATE, q: 'cukai' })).toEqual([]);
  });

  it('finds "PPh Pasal 23" rows for the query "pph 23" (tokenized, not exact substring)', () => {
    const rows = [
      row({ id: 'r-pasal23', category: 'pph-23', name: 'PPh Pasal 23 atas jasa teknik', rate: '2%' }),
      row({ id: 'r-ppn', category: 'ppn', name: 'PPN 12%', rate: '12%' }),
    ];
    const ids = filterDatabaseRows(rows, { ...DEFAULT_DATABASE_STATE, q: 'pph 23' }).map((r) => r.id);
    expect(ids).toEqual(['r-pasal23']);
  });

  it('splits glued queries: "pph23" behaves like "pph 23"', () => {
    const rows = [
      row({ id: 'r-pasal23', category: 'pph-23', name: 'PPh Pasal 23 atas jasa teknik', rate: '2%' }),
    ];
    expect(filterDatabaseRows(rows, { ...DEFAULT_DATABASE_STATE, q: 'pph23' }).map((r) => r.id)).toEqual(['r-pasal23']);
    // Kode regulasi menempel juga: pmk131, pp55, uu7.
    expect(filterDatabaseRows(rows, { ...DEFAULT_DATABASE_STATE, q: 'pph23' })).length(1);
  });

  it('requires every query token to match (AND)', () => {
    const rows = [
      row({ id: 'r-jasa', category: 'pph-23', name: 'PPh 23 jasa lain', rate: '2%' }),
      row({ id: 'r-sewa', category: 'pph-23', name: 'Sewa harta bergerak', rate: '2%' }),
    ];
    // "jasa sewa" tidak boleh mengambil kedua row — tiap token harus ada.
    const ids = filterDatabaseRows(rows, { ...DEFAULT_DATABASE_STATE, q: 'jasa sewa' }).map((r) => r.id);
    expect(ids).toEqual([]);
  });

  it('tolerates one-character typos on longer tokens (fuzzy)', () => {
    const rows = [
      row({ id: 'r-konstruksi', category: 'pph-4-2-final', name: 'Jasa konstruksi final', rate: '2,65%' }),
    ];
    expect(filterDatabaseRows(rows, { ...DEFAULT_DATABASE_STATE, q: 'konstruksu' }).map((r) => r.id)).toEqual(['r-konstruksi']);
  });

  it('does not fuzzy-match nonsense queries into results', () => {
    expect(filterDatabaseRows(SAMPLE_ROWS, { ...DEFAULT_DATABASE_STATE, q: 'zzzzz-no-such-rate-xyz123' })).toEqual([]);
  });

  it('ranks results by relevance when a query is active (default sort)', () => {
    const rows = [
      row({ id: 'r-weak', category: 'pph-21', name: 'PPh 21 PTKP 2016 (kebetulan menyebut 23)', rate: 'Faktor 1' }),
      row({ id: 'r-strong', category: 'pph-23', name: 'PPh Pasal 23 atas jasa', rate: '2%' }),
    ];
    const ids = filterDatabaseRows(rows, { ...DEFAULT_DATABASE_STATE, q: 'pph 23' }).map((r) => r.id);
    // Nama yang memuat frasa "PPh 23/Pasal 23" harus di atas row yang hanya
    // kebetulan mengandung token-nya.
    expect(ids[0]).toBe('r-strong');
  });
});

describe('filterDatabaseRows — category, status, verification, conflict', () => {
  it('filters by category slug', () => {
    const ids = filterDatabaseRows(SAMPLE_ROWS, { ...DEFAULT_DATABASE_STATE, category: 'pph-23' }).map((r) => r.id);
    expect(ids.sort()).toEqual(['r-conflict', 'r-pph23-2']);
  });

  it('filters by verification status', () => {
    const ids = filterDatabaseRows(SAMPLE_ROWS, { ...DEFAULT_DATABASE_STATE, verification: 'source_conflict' }).map((r) => r.id);
    expect(ids).toEqual(['r-conflict']);
  });

  it('surfaces conflict rows under the special verification=conflict bucket', () => {
    const ids = filterDatabaseRows(SAMPLE_ROWS, { ...DEFAULT_DATABASE_STATE, verification: 'conflict' }).map((r) => r.id);
    expect(ids).toEqual(['r-conflict']);
  });
});

describe('filterDatabaseRows — temporal date and year modes', () => {
  it('date mode YYYY-MM-DD keeps rules whose half-open interval covers the date', () => {
    // 2024-06-15: PPN 11% covers it; PPN 12% starts 2025-01-01.
    const ids = filterDatabaseRows(SAMPLE_ROWS, { ...DEFAULT_DATABASE_STATE, date: '2024-06-15' }).map((r) => r.id).sort();
    expect(ids).toContain('r-ppn-11');
    expect(ids).not.toContain('r-ppn-12');
  });

  it('date mode treats null validToExclusive as open-ended present', () => {
    const ids = filterDatabaseRows(SAMPLE_ROWS, { ...DEFAULT_DATABASE_STATE, date: '2026-01-01' }).map((r) => r.id);
    expect(ids).toContain('r-ppn-12');
    expect(ids).not.toContain('r-ppn-11');
  });

  it('year mode YYYY keeps every rule whose half-open interval intersects the calendar year', () => {
    // Year 2025 interval is [2025-01-01, 2026-01-01). PPN 11% ends 2025-01-01
    // (exclusive), so its [2022-04-01, 2025-01-01) interval does NOT intersect
    // 2025. PPN 12% starts 2025-01-01 and is open-ended, so it intersects.
    // Open-ended PPh 23 (from 2015) and PPh Badan IKN (from 2024) also intersect.
    const ids = filterDatabaseRows(SAMPLE_ROWS, { ...DEFAULT_DATABASE_STATE, date: '2025' }).map((r) => r.id).sort();
    expect(ids).toContain('r-ppn-12');
    expect(ids).toContain('r-pph23-2');
    expect(ids).toContain('r-review');
    expect(ids).not.toContain('r-ppn-11');
  });

  it('year mode YYYY-1 captures rules ending in that year (inclusive start)', () => {
    // Year 2024 = [2024-01-01, 2025-01-01). PPN 11% [2022-04-01, 2025-01-01)
    // intersects because 2024-01-01 < 2025-01-01 and 2022-04-01 < 2025-01-01.
    const ids = filterDatabaseRows(SAMPLE_ROWS, { ...DEFAULT_DATABASE_STATE, date: '2024' }).map((r) => r.id).sort();
    expect(ids).toContain('r-ppn-11');
    expect(ids).not.toContain('r-ppn-12');
  });
});

describe('filterDatabaseRows — deterministic sort', () => {
  it('sort=category orders by category then id (stable)', () => {
    const ids = filterDatabaseRows(SAMPLE_ROWS, { ...DEFAULT_DATABASE_STATE, sort: 'category' }).map((r) => r.id);
    // pph-23 < pph-badan < ppn alphabetically, stable within category by id.
    expect(ids).toEqual(['r-conflict', 'r-pph23-2', 'r-review', 'r-ppn-11', 'r-ppn-12']);
  });

  it('sort=rate orders by numeric rate ascending, ties broken by id', () => {
    const ids = filterDatabaseRows(SAMPLE_ROWS, { ...DEFAULT_DATABASE_STATE, sort: 'rate' }).map((r) => r.id);
    expect(ids).toEqual(['r-review', 'r-pph23-2', 'r-ppn-11', 'r-ppn-12', 'r-conflict']);
  });

  it('sort=newest orders by validFrom desc, ties broken by id', () => {
    const ids = filterDatabaseRows(SAMPLE_ROWS, { ...DEFAULT_DATABASE_STATE, sort: 'newest' }).map((r) => r.id);
    // 2025-01-01 first (tie -> r-ppn-12), then 2024, then 2015.
    expect(ids[0]).toBe('r-ppn-12');
    expect(ids[ids.length - 1]).toBe('r-pph23-2');
  });

  it('sort=oldest orders by validFrom asc, ties broken by id', () => {
    const ids = filterDatabaseRows(SAMPLE_ROWS, { ...DEFAULT_DATABASE_STATE, sort: 'oldest' }).map((r) => r.id);
    expect(ids[0]).toBe('r-pph23-2');
  });
});

describe('summarizeDatabaseRows', () => {
  it('counts visible, active, conflict, and category totals', () => {
    const summary = summarizeDatabaseRows(SAMPLE_ROWS, filterDatabaseRows(SAMPLE_ROWS, DEFAULT_DATABASE_STATE));
    expect(summary.total).toBe(SAMPLE_ROWS.length);
    expect(summary.visible).toBe(SAMPLE_ROWS.length);
    expect(summary.active).toBe(SAMPLE_ROWS.filter((r) => r.validToExclusive === null).length);
    expect(summary.conflict).toBe(1);
    expect(summary.categories).toBeGreaterThan(0);
  });

  it('reflects the visible subset after filtering', () => {
    const visible = filterDatabaseRows(SAMPLE_ROWS, { ...DEFAULT_DATABASE_STATE, q: 'ppn' });
    const summary = summarizeDatabaseRows(SAMPLE_ROWS, visible);
    expect(summary.visible).toBe(2);
    expect(summary.total).toBe(SAMPLE_ROWS.length);
  });

  it('produces status-specific wording helpers (no universal "aktif" suffix)', () => {
    const summary = summarizeDatabaseRows(SAMPLE_ROWS, SAMPLE_ROWS);
    // The summary exposes a label helper that is status-specific.
    expect(typeof summary.visibleLabel).toBe('string');
    expect(summary.visibleLabel.toLowerCase()).not.toContain('semua aktif');
  });
});
