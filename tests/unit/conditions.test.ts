import { describe, expect, it } from 'vitest';
import { evaluateCondition } from '../../src/core/conditions.ts';

describe('tri-state conditions', () => {
  it('returns true, false, and missing facts for leaf operators', () => {
    expect(evaluateCondition({ op: 'equals', fact: 'kind', value: 'company' }, { kind: 'company' })).toEqual({ state: 'true', missingFacts: [] });
    expect(evaluateCondition({ op: 'equals', fact: 'kind', value: 'company' }, { kind: 'person' })).toEqual({ state: 'false', missingFacts: [] });
    expect(evaluateCondition({ op: 'equals', fact: 'kind', value: 'company' }, {})).toEqual({ state: 'unknown', missingFacts: ['kind'] });
  });

  it('and short-circuits false but propagates unknown otherwise and aggregates facts', () => {
    expect(
      evaluateCondition(
        { op: 'and', conditions: [
          { op: 'equals', fact: 'a', value: 1 },
          { op: 'equals', fact: 'b', value: 2 },
        ] },
        { a: 1, b: 2 },
      ),
    ).toEqual({ state: 'true', missingFacts: [] });
    // One false short-circuits to false even when another fact is missing; the
    // missing fact can no longer change the outcome so it is not reported.
    expect(
      evaluateCondition(
        { op: 'and', conditions: [
          { op: 'equals', fact: 'a', value: 9 },
          { op: 'equals', fact: 'b', value: 2 },
        ] },
        { a: 1 },
      ),
    ).toEqual({ state: 'false', missingFacts: [] });
    // Unknown propagates and aggregates missing facts in sorted order.
    expect(
      evaluateCondition(
        { op: 'and', conditions: [
          { op: 'equals', fact: 'zeta', value: 1 },
          { op: 'equals', fact: 'alpha', value: 2 },
        ] },
        {},
      ),
    ).toEqual({ state: 'unknown', missingFacts: ['alpha', 'zeta'] });
  });

  it('or short-circuits true but propagates unknown otherwise and aggregates facts', () => {
    expect(
      evaluateCondition(
        { op: 'or', conditions: [
          { op: 'equals', fact: 'a', value: 1 },
          { op: 'equals', fact: 'b', value: 2 },
        ] },
        { a: 1 },
      ),
    ).toEqual({ state: 'true', missingFacts: [] });
    expect(
      evaluateCondition(
        { op: 'or', conditions: [
          { op: 'equals', fact: 'a', value: 9 },
          { op: 'equals', fact: 'b', value: 2 },
        ] },
        { a: 0, b: 2 },
      ),
    ).toEqual({ state: 'true', missingFacts: [] });
    expect(
      evaluateCondition(
        { op: 'or', conditions: [
          { op: 'equals', fact: 'a', value: 9 },
          { op: 'equals', fact: 'beta', value: 2 },
        ] },
        { a: 0 },
      ),
    ).toEqual({ state: 'unknown', missingFacts: ['beta'] });
    expect(
      evaluateCondition(
        { op: 'or', conditions: [
          { op: 'equals', fact: 'a', value: 9 },
          { op: 'equals', fact: 'b', value: 9 },
        ] },
        { a: 0, b: 1 },
      ),
    ).toEqual({ state: 'false', missingFacts: [] });
  });

  it('not preserves unknown and aggregates no facts from the inner branch', () => {
    expect(evaluateCondition({ op: 'not', condition: { op: 'equals', fact: 'a', value: 1 } }, { a: 1 })).toEqual({ state: 'false', missingFacts: [] });
    expect(evaluateCondition({ op: 'not', condition: { op: 'equals', fact: 'a', value: 1 } }, { a: 0 })).toEqual({ state: 'true', missingFacts: [] });
    expect(evaluateCondition({ op: 'not', condition: { op: 'equals', fact: 'a', value: 1 } }, {})).toEqual({ state: 'unknown', missingFacts: ['a'] });
  });
});
