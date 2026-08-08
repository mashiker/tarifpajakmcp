import { describe, expect, it } from 'vitest';
import { deriveTemporalBounds } from '../../src/core/release.ts';

describe('temporal output bounds', () => {
  it('includes open-ended entry start years and the release year', () => {
    const bounds = deriveTemporalBounds([
      { effectiveFrom: '1984-01-01', effectiveTo: '2024-12-31' },
      { effectiveFrom: '2025-01-01', effectiveTo: null },
    ], '2026-08-06T00:00:00.000Z');

    expect(bounds).toEqual({
      minimumYear: 1984,
      maximumYear: 2026,
      temporalRange: { from: '1984-01-01', to: null },
    });
  });
});
