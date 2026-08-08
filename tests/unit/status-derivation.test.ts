// Unit tests for the pure status-derivation helper (Task 9, Mn2 fix).
//
// The Task 8 root database shipped five status chips in the toolbar
// (all/berlaku/diubah/belum_berlaku/dicabut) but the underlying
// `filterDatabaseRows`/`isRowVisible` helpers never applied a status filter,
// so the chips were non-functional. The fix introduces a pure
// `deriveRowStatus` helper plus `matchesStatus` and wires both helpers into
// `filterDatabaseRows` and `isRowVisible`, with `statusCounts` populated for
// all five chips on the root page.
//
// Derivation contract (per Task 9 brief):
//   - berlaku       = open-ended (validToExclusive == null) AND already in effect
//   - belum_berlaku = future validFrom (validFrom > today)
//   - dicabut       = past end date AND NOT superseded by another visible rule
//   - diubah        = superseded but still visible (supersededBy non-empty)
//   - 'today' is the v2 release's generatedAt date (deterministic), NOT
//     `new Date()` — the dataset is a fixed snapshot and the status filter
//     must produce the same counts across two builds at the same release.
//
// RED-first: these tests are written before the helper exists.

import { describe, expect, it } from 'vitest';
import {
  deriveRowStatus,
  matchesStatus,
  type DatabaseRow,
} from '../../website/src/lib/database-state.ts';

function row(partial: Partial<DatabaseRow> & Pick<DatabaseRow, 'id' | 'category' | 'name' | 'rate'>): DatabaseRow {
  return {
    ruleId: partial.id,
    validFrom: '2024-01-01',
    validToExclusive: null,
    verification: 'verified_primary',
    conflict: false,
    superseded: false,
    ...partial,
  } as DatabaseRow;
}

const TODAY = '2026-08-06'; // mirrors the v2 release generatedAt date used by the helper.

describe('deriveRowStatus — open-ended rules', () => {
  it('returns "berlaku" for an open-ended rule already in effect', () => {
    const r = row({ id: 'a', validFrom: '2024-01-01', validToExclusive: null });
    expect(deriveRowStatus(r, TODAY)).toBe('berlaku');
  });

  it('returns "berlaku" for a rule that started exactly today', () => {
    const r = row({ id: 'a', validFrom: TODAY, validToExclusive: null });
    expect(deriveRowStatus(r, TODAY)).toBe('berlaku');
  });
});

describe('deriveRowStatus — future rules', () => {
  it('returns "belum_berlaku" when validFrom is in the future', () => {
    const r = row({ id: 'a', validFrom: '2027-01-01', validToExclusive: null });
    expect(deriveRowStatus(r, TODAY)).toBe('belum_berlaku');
  });

  it('prefers "belum_berlaku" over "berlaku" even with no end date', () => {
    // A rule with validFrom in the future is belum berlaku, not berlaku,
    // regardless of whether it is open-ended.
    const r = row({ id: 'a', validFrom: '2027-01-01', validToExclusive: null });
    expect(deriveRowStatus(r, TODAY)).toBe('belum_berlaku');
  });
});

describe('deriveRowStatus — superseded rules', () => {
  it('returns "diubah" for a superseded rule whose end date is in the past', () => {
    const r = row({
      id: 'a',
      validFrom: '2010-01-01',
      validToExclusive: '2022-01-01',
      superseded: true,
    });
    expect(deriveRowStatus(r, TODAY)).toBe('diubah');
  });

  it('returns "diubah" for a superseded rule even with a future end date', () => {
    // Supersession takes precedence over the open-ended/past test: if a rule
    // has been replaced, it is "diubah" (changed) regardless of the calendar.
    const r = row({
      id: 'a',
      validFrom: '2024-01-01',
      validToExclusive: '2027-01-01',
      superseded: true,
    });
    expect(deriveRowStatus(r, TODAY)).toBe('diubah');
  });
});

describe('deriveRowStatus — revoked rules', () => {
  it('returns "dicabut" for a non-superseded rule whose end date is in the past', () => {
    const r = row({
      id: 'a',
      validFrom: '2024-01-01',
      validToExclusive: '2025-01-01',
      superseded: false,
    });
    expect(deriveRowStatus(r, TODAY)).toBe('dicabut');
  });

  it('returns "dicabut" for a non-superseded rule ending exactly today (half-open: today is exclusive of the next interval)', () => {
    const r = row({
      id: 'a',
      validFrom: '2024-01-01',
      validToExclusive: TODAY,
      superseded: false,
    });
    // Today is the exclusive end date, so the rule no longer applies today.
    expect(deriveRowStatus(r, TODAY)).toBe('dicabut');
  });
});

describe('deriveRowStatus — purity and precedence', () => {
  it('does not mutate the input row', () => {
    const r = row({ id: 'a', validFrom: '2024-01-01', validToExclusive: '2025-01-01', superseded: false });
    const snapshot = JSON.parse(JSON.stringify(r));
    deriveRowStatus(r, TODAY);
    expect(r).toEqual(snapshot);
  });

  it('returns the same value across two calls (deterministic)', () => {
    const r = row({ id: 'a', validFrom: '2024-01-01', validToExclusive: null, superseded: false });
    expect(deriveRowStatus(r, TODAY)).toBe(deriveRowStatus(r, TODAY));
  });

  it('returns "berlaku" only when both open-ended AND already in effect (not future)', () => {
    const future = row({ id: 'a', validFrom: '2027-01-01', validToExclusive: null });
    const active = row({ id: 'b', validFrom: '2024-01-01', validToExclusive: null });
    expect(deriveRowStatus(future, TODAY)).not.toBe('berlaku');
    expect(deriveRowStatus(active, TODAY)).toBe('berlaku');
  });
});

describe('matchesStatus — chip filter logic', () => {
  it('"all" matches any row', () => {
    const r = row({ id: 'a', validFrom: '2024-01-01', validToExclusive: null });
    expect(matchesStatus(r, 'all', TODAY)).toBe(true);
  });

  it('"berlaku" matches only open-ended in-effect rules', () => {
    const active = row({ id: 'a', validFrom: '2024-01-01', validToExclusive: null });
    const future = row({ id: 'b', validFrom: '2027-01-01', validToExclusive: null });
    const past = row({ id: 'c', validFrom: '2024-01-01', validToExclusive: '2025-01-01', superseded: false });
    expect(matchesStatus(active, 'berlaku', TODAY)).toBe(true);
    expect(matchesStatus(future, 'berlaku', TODAY)).toBe(false);
    expect(matchesStatus(past, 'berlaku', TODAY)).toBe(false);
  });

  it('"belum_berlaku" matches only future-start rules', () => {
    const future = row({ id: 'a', validFrom: '2027-01-01', validToExclusive: null });
    const active = row({ id: 'b', validFrom: '2024-01-01', validToExclusive: null });
    expect(matchesStatus(future, 'belum_berlaku', TODAY)).toBe(true);
    expect(matchesStatus(active, 'belum_berlaku', TODAY)).toBe(false);
  });

  it('"diubah" matches only superseded rules', () => {
    const superseded = row({ id: 'a', validFrom: '2020-01-01', validToExclusive: '2022-01-01', superseded: true });
    const revoked = row({ id: 'b', validFrom: '2020-01-01', validToExclusive: '2022-01-01', superseded: false });
    expect(matchesStatus(superseded, 'diubah', TODAY)).toBe(true);
    expect(matchesStatus(revoked, 'diubah', TODAY)).toBe(false);
  });

  it('"dicabut" matches only non-superseded past-end rules', () => {
    const revoked = row({ id: 'a', validFrom: '2020-01-01', validToExclusive: '2022-01-01', superseded: false });
    const superseded = row({ id: 'b', validFrom: '2020-01-01', validToExclusive: '2022-01-01', superseded: true });
    expect(matchesStatus(revoked, 'dicabut', TODAY)).toBe(true);
    expect(matchesStatus(superseded, 'dicabut', TODAY)).toBe(false);
  });
});
