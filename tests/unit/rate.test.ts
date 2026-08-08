import { describe, expect, it } from 'vitest';
import { calculateProgressive, formatPercent, formatRate } from '../../src/core/rate.ts';

describe('typed rates', () => {
  it('formats every rate variant using decimal-safe rendering', () => {
    expect(formatPercent('0.07')).toBe('7%');
    expect(formatPercent('0.11')).toBe('11%');
    expect(formatPercent('0.125')).toBe('12.5%');
    expect(formatRate({ type: 'percentage', value: '0.11' })).toBe('11%');
    expect(formatRate({ type: 'percentage', value: '0.07' })).toBe('7%');
    expect(formatRate({ type: 'fixed', amount: '1000', currency: 'IDR' })).toBe('1,000 IDR');
    expect(formatRate({ type: 'range', min: '0.1', max: '0.2' })).toBe('10%–20%');
    expect(formatRate({ type: 'zero' })).toBe('0%');
    expect(formatRate({ type: 'not_applicable' })).toBe('Tidak berlaku');
  });

  it('calculates progressive brackets at edges using integer scaled arithmetic', () => {
    expect(calculateProgressive('100', [
      { upTo: '50', rate: '0.1' },
      { upTo: null, rate: '0.2' },
    ])).toBe('15.00');
    // Edge: exactly at the first bracket boundary pays only the lower rate.
    expect(calculateProgressive('50', [
      { upTo: '50', rate: '0.1' },
      { upTo: null, rate: '0.2' },
    ])).toBe('5.00');
    // Three ordered brackets.
    expect(calculateProgressive('150', [
      { upTo: '50', rate: '0.05' },
      { upTo: '100', rate: '0.1' },
      { upTo: null, rate: '0.2' },
    ])).toBe('17.50');
  });

  it('rejects out-of-order and zero-width progressive brackets', () => {
    expect(() => calculateProgressive('100', [
      { upTo: '100', rate: '0.1' },
      { upTo: '50', rate: '0.2' },
    ])).toThrow();
    expect(() => calculateProgressive('100', [
      { upTo: '50', rate: '0.1' },
      { upTo: null, rate: '0.2' },
      { upTo: null, rate: '0.3' },
    ])).toThrow();
  });
});
