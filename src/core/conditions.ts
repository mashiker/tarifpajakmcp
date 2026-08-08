import type { ConditionExpression } from './types.ts';

export type ConditionState = 'true' | 'false' | 'unknown';
export type ConditionResult = { state: ConditionState; missingFacts: string[] };

function aggregate(missing: string[]): string[] {
  return [...new Set(missing)].sort();
}

export function evaluateCondition(
  condition: ConditionExpression,
  facts: Record<string, unknown>,
): ConditionResult {
  switch (condition.op) {
    case 'equals':
    case 'in':
    case 'exists': {
      const key = condition.fact;
      if (!(key in facts)) return { state: 'unknown', missingFacts: [key] };
      const value = facts[key];
      const ok =
        condition.op === 'equals'
          ? value === condition.value
          : condition.op === 'in'
            ? Array.isArray(condition.value) && condition.value.includes(value)
            : value !== null && value !== undefined;
      return { state: ok ? 'true' : 'false', missingFacts: [] };
    }
    case 'not': {
      const inner = evaluateCondition(condition.condition, facts);
      return {
        state: inner.state === 'unknown' ? 'unknown' : inner.state === 'true' ? 'false' : 'true',
        missingFacts: inner.missingFacts,
      };
    }
    case 'and': {
      const results = condition.conditions.map((child) => evaluateCondition(child, facts));
      // Any false makes the conjunction false and no further fact can rescue it.
      if (results.some((r) => r.state === 'false')) {
        return { state: 'false', missingFacts: [] };
      }
      // Otherwise unknown facts are what we still need to determine the result.
      const missingFacts = aggregate(results.filter((r) => r.state === 'unknown').flatMap((r) => r.missingFacts));
      if (results.some((r) => r.state === 'unknown')) {
        return { state: 'unknown', missingFacts };
      }
      return { state: 'true', missingFacts };
    }
    case 'or': {
      const results = condition.conditions.map((child) => evaluateCondition(child, facts));
      // Any true makes the disjunction true and no further fact can overturn it.
      if (results.some((r) => r.state === 'true')) {
        return { state: 'true', missingFacts: [] };
      }
      const missingFacts = aggregate(results.filter((r) => r.state === 'unknown').flatMap((r) => r.missingFacts));
      if (results.some((r) => r.state === 'unknown')) {
        return { state: 'unknown', missingFacts };
      }
      return { state: 'false', missingFacts };
    }
  }
}
