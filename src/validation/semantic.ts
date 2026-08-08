import type { Conflict, Source, TaxRule, V2Data } from '../core/types.ts';
import type { ConditionExpression, Example, ProgressiveBracket, Rate } from '../core/types.ts';
import { isValidDate, isValidInterval, overlaps } from '../core/date.ts';
import { calculateProgressive } from '../core/rate.ts';
import { createValidationReport, type ValidationIssue, type ValidationReport } from './report.ts';

const REQUIRED_CLAIMS = ['rate', 'interval', 'condition'] as const;

function isProgressiveValid(rate: Rate): boolean {
  if (rate.type !== 'progressive') return true;
  const brackets: ProgressiveBracket[] = rate.brackets;
  if (brackets.length === 0) return false;
  let previous: bigint | null = null;
  let sawOpen = false;
  for (const bracket of brackets) {
    if (sawOpen) return false;
    if (bracket.upTo === null) {
      sawOpen = true;
      continue;
    }
    if (!/^\d+(\.\d+)?$/.test(bracket.upTo) || !/^\d+(\.\d+)?$/.test(bracket.rate)) return false;
    const scaled = scaledDecimal(bracket.upTo);
    if (previous !== null && scaled <= previous) return false;
    previous = scaled;
  }
  return true;
}

function scaledDecimal(value: string): bigint {
  const [int = '', frac = ''] = value.split('.');
  return BigInt(int + frac.padEnd(2, '0'));
}

function isExampleValid(example: Example): boolean {
  return (
    typeof example.id === 'string' &&
    example.id.length > 0 &&
    typeof example.illustrative === 'boolean' &&
    example.input !== null &&
    typeof example.input === 'object'
  );
}

/** Detects rules that participate in a `supersedes` cycle (depth-first). */
function detectCycle(rules: TaxRule[]): string[] {
  const byId = new Map(rules.map((r) => [r.id, r]));
  const cyclic = new Set<string>();
  for (const start of rules) {
    const stack: string[] = [start.id];
    const onStack = new Set<string>([start.id]);
    let head = start.id;
    while (head) {
      const next = byId.get(head)?.supersedes?.[0];
      if (next === undefined) break;
      if (!byId.has(next)) break; // Unknown FK is reported elsewhere.
      if (onStack.has(next)) {
        cyclic.add(start.id);
        break;
      }
      stack.push(next);
      onStack.add(next);
      head = next;
    }
  }
  return [...cyclic].sort();
}

/**
 * Pure semantic validator. Never throws on malformed data; reports every
 * detectable problem as a stable {@link ValidationIssue} and returns a
 * deterministic report sorted by path/code/message via {@link createValidationReport}.
 */
export function validateV2(data: V2Data): ValidationReport {
  const issues: ValidationIssue[] = [];
  const add = (code: string, path: string, message: string) =>
    issues.push({ code, path, message, severity: 'error' });

  const sources: Source[] = data.sources ?? [];
  const rules: TaxRule[] = data.rules ?? [];
  const conflicts: Conflict[] = data.conflicts ?? [];
  const bppuIds = new Set((data.bppu ?? []).map((b) => b.id));
  const sourceIds = new Set(sources.map((s) => s.id));
  const sourceById = new Map(sources.map((s) => [s.id, s]));
  const categoryIds = new Set((data.categories ?? []).map((c) => c.id));
  const conceptIds = new Set((data.concepts ?? []).map((c) => c.id));

  // Duplicate IDs across all named entities.
  const seen = new Set<string>();
  for (const item of [...sources, ...(data.categories ?? []), ...(data.concepts ?? []), ...rules, ...conflicts]) {
    if (typeof item?.id !== 'string') continue;
    if (seen.has(item.id)) add('duplicate_id', item.id, `Duplicate ID ${item.id}`);
    seen.add(item.id);
  }

  // Concept -> Category foreign keys.
  for (const concept of data.concepts ?? []) {
    if (concept.categoryId && !categoryIds.has(concept.categoryId)) {
      add('missing_foreign_key', concept.id, `Concept references unknown category ${concept.categoryId}`);
    }
  }

  // Conflict -> Rule foreign keys.
  for (const conflict of conflicts) {
    for (const ruleId of conflict.ruleIds) {
      if (!rules.some((r) => r.id === ruleId)) {
        add('conflict_rule_unknown', conflict.id, `Conflict references unknown rule ${ruleId}`);
      }
    }
  }
  const declaredConflictPairs = new Set<string>();
  for (const conflict of conflicts) {
    const ids = [...conflict.ruleIds].sort();
    for (let i = 0; i < ids.length; i++) {
      for (let j = i + 1; j < ids.length; j++) {
        declaredConflictPairs.add(`${ids[i]}|${ids[j]}`);
      }
    }
  }
  const rulesInDeclaredConflict = new Set<string>();
  for (const pair of declaredConflictPairs) {
    const [a, b] = pair.split('|');
    rulesInDeclaredConflict.add(a);
    rulesInDeclaredConflict.add(b);
  }

  // Supersession cycles and foreign keys.
  const ruleIds = new Set(rules.map((r) => r.id));
  for (const rule of rules) {
    for (const ref of rule.supersedes ?? []) {
      if (!ruleIds.has(ref)) {
        add('missing_foreign_key', rule.id, `Rule supersedes unknown rule ${ref}`);
      }
    }
  }
  for (const cyclicId of detectCycle(rules)) {
    add('supersession_cycle', cyclicId, `Supersession cycle involving ${cyclicId}`);
  }

  // Per-rule checks.
  for (const rule of rules) {
    if (!conceptIds.has(rule.conceptId)) {
      add('missing_foreign_key', rule.id, `Rule references unknown concept ${rule.conceptId}`);
    }
    if (rule.categoryId && !categoryIds.has(rule.categoryId)) {
      add('missing_foreign_key', rule.id, `Rule references unknown category ${rule.categoryId}`);
    }
    if (rule.bppuId && !bppuIds.has(rule.bppuId)) {
      add('bppu_foreign_key', rule.id, `Rule references unknown BPPU ${rule.bppuId}`);
    }

    if (!isValidDate(rule.validFrom) || (rule.validToExclusive !== null && !isValidDate(rule.validToExclusive)) || !isValidInterval(rule)) {
      add('invalid_interval', rule.id, `Rule has invalid half-open interval`);
      continue; // Skip overlap checks when the interval itself is malformed.
    }

    if (rule.rate && !isProgressiveValid(rule.rate)) {
      add('progressive_bracket_order', rule.id, `Progressive brackets are out of order, overlapping, or have an open-ended bracket that is not last`);
    }

    for (const example of rule.examples ?? []) {
      if (!isExampleValid(example)) {
        add('invalid_example', rule.id, `Example ${example?.id ?? '(unnamed)'} is missing required fields`);
      }
    }

    if (rule.verification?.status === 'verified_primary') {
      const evidence = rule.verification.evidence ?? [];
      const referencedSources = rule.verification.sourceIds.filter((id) => sourceIds.has(id));
      const evidenceSourceUnknown = evidence.some((e) => !sourceIds.has(e.sourceId));
      if (evidenceSourceUnknown) {
        add('evidence_source_unknown', rule.id, `verified_primary evidence references unknown source`);
      }
      const hasOfficial = referencedSources.some((id) => sourceById.get(id)?.official);
      const hasRegulationLocator = referencedSources.some((id) => {
        const s = sourceById.get(id);
        return !!s && typeof s.regulationId === 'string' && s.regulationId.length > 0 && typeof s.locator === 'string' && s.locator.length > 0;
      });
      if (referencedSources.length === 0) {
        add('primary_evidence_required', rule.id, `verified_primary requires at least one referenced source`);
      }
      if (referencedSources.length > 0 && !hasOfficial) {
        add('primary_official_source_required', rule.id, `verified_primary requires at least one official source`);
      }
      if (referencedSources.length > 0 && !hasRegulationLocator) {
        add('primary_regulation_locator_required', rule.id, `verified_primary requires a stable regulation ID and usable locator`);
      }
      const coveredClaims = new Set(evidence.filter((e) => sourceIds.has(e.sourceId)).map((e) => e.claim));
      for (const claim of REQUIRED_CLAIMS) {
        if (!coveredClaims.has(claim)) {
          add('primary_evidence_required', rule.id, `verified_primary missing evidence for claim ${claim}`);
        }
      }
      // Declared conflict rules cannot resolve as exact.
      if (rulesInDeclaredConflict.has(rule.id)) {
        add('conflict_cannot_be_exact', rule.id, `verified_primary cannot be exact for a rule in a declared conflict`);
      }
    }
  }

  // Exclusive-group overlaps. Pairs declared as conflicts are publishable.
  for (let i = 0; i < rules.length; i++) {
    for (let j = i + 1; j < rules.length; j++) {
      const a = rules[i];
      const b = rules[j];
      if (!a.exclusiveGroup || a.exclusiveGroup !== b.exclusiveGroup) continue;
      if (!isValidInterval(a) || !isValidInterval(b)) continue;
      if (!overlaps(a, b)) continue;
      const key = [a.id, b.id].sort().join('|');
      if (declaredConflictPairs.has(key)) continue;
      add('exclusive_overlap', `${a.id}|${b.id}`, `Exclusive group ${a.exclusiveGroup} overlap is not explained by a declared conflict`);
    }
  }

  return createValidationReport(issues);
}

/**
 * Wraps {@link validateV2} so the pipeline can validate already-loaded data.
 * Exposed separately so contract tests can prove the pipeline runs v2 checks.
 */
export function validateV2Loaded(data: V2Data): ValidationReport {
  return validateV2(data);
}

// Rate/condition re-exports kept for callers that previously imported them here.
export type { ConditionExpression, Rate };
export { calculateProgressive };
