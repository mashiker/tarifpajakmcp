// Pure temporal resolver for the v2 model. No I/O, no implicit current date,
// never returns synthetic 0%. Determination semantics follow the design spec:
//   tepat          - one verified rule answers exactly
//   bersyarat      - rule answers under stated conditions
//   rentang        - the year spans multiple intervals
//   fakta_kurang   - a required fact is missing, or no rule covers the date
//   konflik_sumber - an open conflict prevents an exact answer

import type { ConditionExpression, Conflict, DateInterval, TaxRule, V2Data, VerificationStatus } from './types.ts';
import { containsDate, isValidInterval, overlaps, yearSegments } from './date.ts';
import { evaluateCondition, type ConditionState } from './conditions.ts';

export type Determination = 'tepat' | 'bersyarat' | 'rentang' | 'fakta_kurang' | 'konflik_sumber';

/** A rule that survived interval and filter checks, with its condition result. */
export interface ResolvedCandidate {
  rule: TaxRule;
  /** Resolved condition state against the request facts ('true' when unconditional). */
  conditionState: ConditionState;
  /** Facts that would still need to be supplied to settle the rule's condition. */
  missingFacts: string[];
  /** Reason the candidate matched the request (interval/facts/priority/supersession). */
  reasons: string[];
  /** Rule ids this candidate defeated during precedence resolution. */
  defeats: string[];
}

export interface ResolveRequest {
  /** Inclusive calendar date; resolver never reads the system clock. */
  date: string;
  facts?: Record<string, unknown>;
  /** Optional filters; when set, only rules whose fields match are considered. */
  conceptId?: string;
  categoryId?: string;
  bppuId?: string;
  exclusiveGroup?: string;
}

export interface ResolveResult {
  date: string;
  determination: Determination;
  candidates: ResolvedCandidate[];
  /** Every rule that intersected the date after filtering (before precedence). */
  considered: ResolvedCandidate[];
  conflicts: string[];
  warnings: string[];
  gap: boolean;
}

export interface ResolveOptions {
  /**
   * Conflicts known to the caller. Defaults to `data.conflicts`. Each conflict
   * id is surfaced in {@link ResolveResult.conflicts} when any of its rules is
   * among the winning candidates, and forces `konflik_sumber`.
   */
  conflicts?: Conflict[];
}

const BLOCKING_STATUSES: ReadonlySet<VerificationStatus> = new Set([
  'source_conflict',
  'needs_review',
  'summary_only',
]);

/**
 * Resolve the applicable rule(s) at an exact date. Pure: the caller supplies
 * the date, facts, and conflict list. The resolver never invents a 0% answer.
 */
export function resolveAtDate(data: V2Data, request: ResolveRequest, options: ResolveOptions = {}): ResolveResult {
  const rules = data.rules ?? [];
  const conflicts = options.conflicts ?? data.conflicts ?? [];
  const facts = request.facts ?? {};

  const warnings: string[] = [];
  const considered: ResolvedCandidate[] = [];

  // 1. Interval + structural filter. Skip rules whose interval does not cover
  //    the date or whose declared filter fields do not match the request.
  for (const rule of rules) {
    if (!isValidInterval(rule) || !containsDate(rule, request.date)) continue;
    if (request.conceptId && rule.conceptId !== request.conceptId) continue;
    if (request.categoryId && rule.categoryId !== request.categoryId) continue;
    if (request.bppuId && rule.bppuId !== request.bppuId) continue;
    if (request.exclusiveGroup && rule.exclusiveGroup !== request.exclusiveGroup) continue;

    const conditionResult = evaluate(rule.conditions, facts);
    considered.push({
      rule,
      conditionState: conditionResult.state,
      missingFacts: conditionResult.missingFacts,
      reasons: ['interval'],
      defeats: [],
    });
  }

  if (considered.length === 0) {
    warnings.push(`No rule covers ${request.date} for the given filters`);
    return { date: request.date, determination: 'fakta_kurang', candidates: [], considered, conflicts: [], warnings, gap: true };
  }

  // 2. Condition filter: drop candidates whose condition resolved false. They
  //    cannot apply regardless of precedence.
  const conditionallyApplicable = considered.filter((candidate) => candidate.conditionState !== 'false');

  // 3. Precedence. Within an exclusive group, a conditional (special) rule that
  //    still applies defeats an unconditional (general) rule. A rule that
  //    declares `supersedes` over another defeats it. We keep the winners.
  const winners = applyPrecedence(conditionallyApplicable, rules);

  if (winners.length === 0) {
    // All matching candidates were removed by condition/precedence: treat as a
    // factual gap (no applicable rule), never synthetic 0%.
    warnings.push(`No applicable rule covers ${request.date} after applying conditions`);
    return { date: request.date, determination: 'fakta_kurang', candidates: [], considered, conflicts: [], warnings, gap: true };
  }

  // 4. Conflict detection. Any conflict touching a winning candidate forces
  //    konflik_sumber and prevents an exact resolution.
  const winnerIds = new Set(winners.map((w) => w.rule.id));
  const touchingConflicts = conflicts
    .filter((conflict) => conflict.ruleIds.some((id) => winnerIds.has(id)))
    .map((conflict) => conflict.id);

  // 5. Determination.
  //    A self-declared source_conflict rule forces konflik_sumber even when no
  //    Conflict entity spans it. needs_review/summary_only remain orienting
  //    (bersyarat) and never resolve as exact.
  const selfDeclaredConflict = winners.some((w) => w.rule.verification?.status === 'source_conflict');
  let determination: Determination;
  if (touchingConflicts.length > 0 || selfDeclaredConflict) {
    determination = 'konflik_sumber';
  } else if (winners.some((w) => w.rule.verification?.status && BLOCKING_STATUSES.has(w.rule.verification.status))) {
    // needs_review / summary_only never resolve as tepat. They remain visible
    // as orienting (bersyarat) candidates.
    determination = 'bersyarat';
  } else if (winners.some((w) => w.missingFacts.length > 0)) {
    determination = 'fakta_kurang';
  } else if (winners.some((w) => w.rule.conditions)) {
    determination = 'bersyarat';
  } else {
    determination = 'tepat';
  }

  if (determination === 'konflik_sumber') {
    warnings.push('Open source conflict prevents an exact resolution');
  }

  return {
    date: request.date,
    determination,
    candidates: winners,
    considered,
    conflicts: touchingConflicts,
    warnings,
    gap: false,
  };
}

export interface YearSegment {
  /** Half-open sub-interval clipped to the calendar year. */
  interval: DateInterval;
  ruleIds: string[];
  /** True when this segment begins at a rule boundary inside the year. */
  transition: boolean;
}

export interface YearResolveResult {
  year: number;
  determination: Determination;
  segments: YearSegment[];
  /** Distinct rule ids across all segments. */
  ruleIds: string[];
  conflicts: string[];
  warnings: string[];
  gap: boolean;
}

export interface YearResolveFilters {
  conceptId?: string;
  categoryId?: string;
  bppuId?: string;
  exclusiveGroup?: string;
  facts?: Record<string, unknown>;
  conflicts?: Conflict[];
}

/**
 * Resolve the rule timeline across a calendar year. Splits
 * `[YYYY-01-01, (YYYY+1)-01-01)` at every rule boundary and labels transitions.
 * A year with one segment resolves as the at-date determination for that date;
 * a year with multiple segments resolves as `rentang`.
 */
export function resolveForYear(data: V2Data, year: number, filters: YearResolveFilters = {}): YearResolveResult {
  const rules = data.rules ?? [];
  const conflicts = filters.conflicts ?? data.conflicts ?? [];
  const yearStart = `${year}-01-01`;
  const yearEndExclusive = `${year + 1}-01-01`;
  const yearInterval: DateInterval = { validFrom: yearStart, validToExclusive: yearEndExclusive };

  // Rules whose interval intersects the year, after applying filters.
  const intersecting = rules.filter((rule) => {
    if (!isValidInterval(rule) || !overlaps(rule, yearInterval)) return false;
    if (filters.conceptId && rule.conceptId !== filters.conceptId) return false;
    if (filters.categoryId && rule.categoryId !== filters.categoryId) return false;
    if (filters.bppuId && rule.bppuId !== filters.bppuId) return false;
    if (filters.exclusiveGroup && rule.exclusiveGroup !== filters.exclusiveGroup) return false;
    return true;
  });

  if (intersecting.length === 0) {
    return {
      year,
      determination: 'fakta_kurang',
      segments: [],
      ruleIds: [],
      conflicts: [],
      warnings: [`No rule covers ${year} for the given filters`],
      gap: true,
    };
  }

  // Collect every boundary day that falls inside the year, then build segments
  // between consecutive boundaries. Each segment lists the rules whose
  // (clipped) interval covers the segment midpoint.
  const boundaries = new Set<string>([yearStart, yearEndExclusive]);
  for (const rule of intersecting) {
    if (rule.validFrom > yearStart && rule.validFrom < yearEndExclusive) boundaries.add(rule.validFrom);
    if (rule.validToExclusive && rule.validToExclusive > yearStart && rule.validToExclusive < yearEndExclusive) {
      boundaries.add(rule.validToExclusive);
    }
  }
  const sortedBoundaries = [...boundaries].sort();

  const segments: YearSegment[] = [];
  for (let i = 0; i < sortedBoundaries.length - 1; i++) {
    const from = sortedBoundaries[i];
    const to = sortedBoundaries[i + 1];
    const ruleIds = intersecting
      .filter((rule) => containsDate(rule, from))
      .map((rule) => rule.id)
      .sort();
    if (ruleIds.length === 0) continue;
    segments.push({
      interval: { validFrom: from, validToExclusive: to },
      ruleIds,
      transition: from !== yearStart,
    });
  }

  // Merge adjacent segments with identical rule sets so a long-running rule is
  // not artificially split by a boundary that does not change the answer.
  const merged: YearSegment[] = [];
  for (const segment of segments) {
    const last = merged[merged.length - 1];
    if (last && arrayEqual(last.ruleIds, segment.ruleIds)) {
      last.interval = { validFrom: last.interval.validFrom, validToExclusive: segment.interval.validToExclusive };
    } else {
      merged.push({ ...segment, interval: { ...segment.interval } });
    }
  }
  // Re-evaluate transition flags after merging: a segment is a transition only
  // when it does not start at the year boundary.
  for (const segment of merged) segment.transition = segment.interval.validFrom !== yearStart;

  const allRuleIds = [...new Set(merged.flatMap((s) => s.ruleIds))].sort();
  const touchingConflicts = conflicts
    .filter((conflict) => conflict.ruleIds.some((id) => allRuleIds.includes(id)))
    .map((conflict) => conflict.id)
    .sort();

  let determination: Determination;
  let gap = false;
  const warnings: string[] = [];
  if (touchingConflicts.length > 0) {
    determination = 'konflik_sumber';
  } else if (merged.length > 1) {
    determination = 'rentang';
  } else {
    // Single segment: mirror the at-date determination by sampling the start.
    // A genuine gap (no applicable winner at the sample date, e.g. all
    // conditions resolved false) must propagate as fakta_kurang with gap:true,
    // never be inverted to tepat.
    const atDate = resolveAtDate(data, {
      date: merged[0].interval.validFrom,
      conceptId: filters.conceptId,
      categoryId: filters.categoryId,
      bppuId: filters.bppuId,
      exclusiveGroup: filters.exclusiveGroup,
      facts: filters.facts,
    }, { conflicts });
    determination = atDate.determination;
    gap = atDate.gap;
    warnings.push(...atDate.warnings);
  }

  return {
    year,
    determination,
    segments: merged,
    ruleIds: allRuleIds,
    conflicts: touchingConflicts,
    warnings,
    gap,
  };
}

function evaluate(condition: ConditionExpression | undefined, facts: Record<string, unknown>):
  { state: ConditionState; missingFacts: string[] } {
  if (!condition) return { state: 'true', missingFacts: [] };
  return evaluateCondition(condition, facts);
}

/**
 * Resolve precedence among conditionally-applicable candidates.
 * Rules within the same exclusive group: a conditional (special) rule that
 * still applies defeats an unconditional (general) one. Supersession edges
 * (`a.supersedes b`) also defeat. Rules in different exclusive groups (or no
 * group) coexist.
 */
function applyPrecedence(candidates: ResolvedCandidate[], allRules: TaxRule[]): ResolvedCandidate[] {
  const byId = new Map(allRules.map((r) => [r.id, r]));
  const candidateById = new Map(candidates.map((c) => [c.rule.id, c]));

  // Group candidates by exclusive group so precedence (and the resulting
  // `defeats` traceability metadata) is scoped per group. A winner in one group
  // never inherits defeats computed for another group.
  const groupBuckets = new Map<string | undefined, ResolvedCandidate[]>();
  for (const candidate of candidates) {
    const key = candidate.rule.exclusiveGroup;
    if (!groupBuckets.has(key)) groupBuckets.set(key, []);
    groupBuckets.get(key)!.push(candidate);
  }

  // Per-group defeated sets, plus a global set for the winner filter.
  const defeatedByGroup = new Map<string | undefined, Set<string>>();
  const defeatedGlobal = new Set<string>();

  for (const [groupKey, bucket] of groupBuckets) {
    const defeated = new Set<string>();
    // First pass: supersession. a defeats b when a.supersedes contains b.
    for (const candidate of bucket) {
      for (const supersededId of candidate.rule.supersedes ?? []) {
        if (candidateById.has(supersededId)) {
          defeated.add(supersededId);
        }
      }
    }
    // Second pass: special-over-general. A conditional rule defeats an
    // unconditional rule within the same exclusive group.
    const conditional = bucket.filter((c) => c.rule.conditions && c.conditionState !== 'false');
    const general = bucket.filter((c) => !c.rule.conditions);
    if (conditional.length > 0 && general.length > 0) {
      for (const g of general) defeated.add(g.rule.id);
    }
    defeatedByGroup.set(groupKey, defeated);
    for (const id of defeated) defeatedGlobal.add(id);
  }

  // Suppress unused-variable warning while keeping the byId map available for
  // future precedence rules (e.g. explicit `supersededBy` confirmation).
  void byId;

  const winners = candidates.filter((c) => !defeatedGlobal.has(c.rule.id));
  // Record only the defeats from the winner's own exclusive group, so the
  // traceability metadata never leaks across groups.
  for (const winner of winners) {
    const groupDefeats = defeatedByGroup.get(winner.rule.exclusiveGroup) ?? new Set<string>();
    winner.defeats = [...groupDefeats].sort();
  }
  return winners.sort((a, b) => a.rule.id.localeCompare(b.rule.id));
}

function arrayEqual(a: string[], b: string[]): boolean {
  if (a.length !== b.length) return false;
  return a.every((value, index) => value === b[index]);
}

// Re-export for generators that build per-year documents from segments.
export { yearSegments };
