import { describe, expect, it } from 'vitest';
import { containsDate, isValidDate, isValidInterval, overlaps, yearSegments } from '../../src/core/date.ts';

describe('half-open date intervals', () => {
  it('includes start and excludes exclusive end', () => {
    expect(containsDate({ validFrom: '2024-01-01', validToExclusive: '2024-02-01' }, '2024-01-01')).toBe(true);
    expect(containsDate({ validFrom: '2024-01-01', validToExclusive: '2024-02-01' }, '2024-01-31')).toBe(true);
    expect(containsDate({ validFrom: '2024-01-01', validToExclusive: '2024-02-01' }, '2024-02-01')).toBe(false);
  });

  it('rejects malformed dates and invalid intervals via guards', () => {
    expect(isValidDate('2024-02-30')).toBe(false);
    expect(isValidDate('2024-13-01')).toBe(false);
    expect(isValidDate('not-a-date')).toBe(false);
    expect(isValidDate('2024-01-01')).toBe(true);
    expect(isValidInterval({ validFrom: '2024-02-02', validToExclusive: '2024-02-01' })).toBe(false);
    expect(isValidInterval({ validFrom: '2024-01-01', validToExclusive: '2024-02-01' })).toBe(true);
    expect(isValidInterval({ validFrom: '2024-01-01', validToExclusive: null })).toBe(true);
    expect(() => containsDate({ validFrom: '2024-02-02', validToExclusive: '2024-02-01' }, '2024-02-01')).toThrow();
  });

  it('overlaps handles adjacent, non-overlapping, open-ended, and equal intervals', () => {
    const a = { validFrom: '2024-01-01', validToExclusive: '2024-03-01' };
    expect(overlaps(a, { validFrom: '2024-02-01', validToExclusive: '2024-04-01' })).toBe(true);
    // Adjacent intervals do NOT overlap under half-open semantics.
    expect(overlaps(a, { validFrom: '2024-03-01', validToExclusive: '2024-04-01' })).toBe(false);
    // Two open-ended intervals starting at the same point overlap.
    expect(overlaps(
      { validFrom: '2024-01-01', validToExclusive: null },
      { validFrom: '2024-01-01', validToExclusive: null },
    )).toBe(true);
    // Identical bounded intervals overlap.
    expect(overlaps(a, { ...a })).toBe(true);
  });

  it('yearSegments clips to year boundaries and rejects non-intersecting years', () => {
    expect(yearSegments({ validFrom: '2024-06-01', validToExclusive: '2025-02-01' }, 2024)).toEqual({ validFrom: '2024-06-01', validToExclusive: '2025-01-01' });
    // Null-end interval spanning multiple years is clipped to the requested year.
    expect(yearSegments({ validFrom: '2024-06-01', validToExclusive: null }, 2025)).toEqual({ validFrom: '2025-01-01', validToExclusive: '2026-01-01' });
    // Non-intersecting year throws.
    expect(() => yearSegments({ validFrom: '2024-01-01', validToExclusive: '2024-02-01' }, 2025)).toThrow();
  });
});
