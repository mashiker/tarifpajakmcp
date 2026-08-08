// v1 compatibility projection. Maps the temporal v2 model back onto the
// legacy v1 entry shape so existing API v1 consumers keep working.
//
// Two conversions are load-bearing:
//   1. Half-open `validToExclusive` -> inclusive legacy `effectiveTo` (the day
//      before the exclusive end).
//   2. Verification status -> legacy `status` (berlaku/diubah/dicabut/etc.).
// The v1 entry ID equals the v2 rule ID by contract: the redesign never renames
// or reissues IDs.

import type { Category, Concept, Rate, Source, TaxRule, V2Data, VerificationStatus } from '../core/types.ts';

/** Half-open exclusive end (e.g. `2025-01-01`) -> inclusive legacy end (`2024-12-31`). */
export function v1EffectiveToInclusive(validToExclusive: string | null): string | null {
  if (validToExclusive === null) return null;
  const end = new Date(`${validToExclusive}T00:00:00Z`);
  end.setUTCDate(end.getUTCDate() - 1);
  return end.toISOString().slice(0, 10);
}

/** v1 entry ID equals the v2 rule ID by contract. */
export function v1EntryId(ruleId: string): string {
  return ruleId;
}

/** Maps a v2 verification status onto a legacy v1 `status` field. */
export function v1StatusFromVerification(verification: TaxRule['verification'], effectiveTo: string | null): string {
  // Open-ended or currently-active verified rules read as `berlaku`. Rules that
  // have ended read as `diubah` (superseded) — the redesign does not infer the
  // stronger `dicabut` without a primary source, so `diubah` is the safe default.
  if (effectiveTo !== null) return 'diubah';
  const status: VerificationStatus | undefined = verification?.status;
  if (status === 'source_conflict') return 'diubah';
  return 'berlaku';
}

/** Convert a v2 percentage fraction (e.g. "0.11") to a legacy whole-percent number. */
function percentageValue(rate: Extract<Rate, { type: 'percentage' }>): number {
  // Keep one pass of rounding at 4 decimal places of the fraction to avoid
  // binary float noise (e.g. 0.07 * 100 = 7.000000000000001).
  const fraction = Number(rate.value);
  return Math.round(fraction * 10000) / 100;
}

/** Project a single v2 rule onto the legacy v1 entry summary shape. */
export function projectRuleToV1(
  rule: TaxRule,
  context: { concepts: Concept[]; categories: Category[]; sources: Source[] },
): V1EntryProjection {
  const concept = context.concepts.find((c) => c.id === rule.conceptId);
  const category = rule.categoryId ? context.categories.find((c) => c.id === rule.categoryId) : undefined;
  const effectiveTo = v1EffectiveToInclusive(rule.validToExclusive);
  const rate = projectRateToV1(rule.rate);
  return {
    id: v1EntryId(rule.id),
    category: category?.name ?? concept?.name ?? rule.categoryId ?? rule.conceptId,
    taxType: category?.name ?? concept?.name ?? rule.conceptId,
    transactionType: concept?.name ?? rule.conceptId,
    rate,
    effectiveFrom: rule.validFrom,
    effectiveTo,
    status: v1StatusFromVerification(rule.verification, effectiveTo),
  };
}

export interface V1EntryProjection {
  id: string;
  category: string;
  taxType: string;
  transactionType: string;
  rate: { type: string; value?: number; min?: number; max?: number };
  effectiveFrom: string;
  effectiveTo: string | null;
  status: string;
}

function projectRateToV1(rate: Rate | undefined): V1EntryProjection['rate'] {
  if (!rate) return { type: 'free_text' };
  switch (rate.type) {
    case 'percentage':
      return { type: 'percentage', value: percentageValue(rate) };
    case 'range':
      return { type: 'range', min: Math.round(Number(rate.min) * 10000) / 100, max: Math.round(Number(rate.max) * 10000) / 100 };
    case 'progressive':
      return { type: 'progressive' };
    case 'fixed':
      return { type: 'fixed' };
    case 'specific':
      return { type: 'specific' };
    case 'formula':
      return { type: 'formula' };
    case 'free_text':
      return { type: 'free_text' };
    case 'zero':
      return { type: 'percentage', value: 0 };
    case 'not_applicable':
      return { type: 'not_applicable' };
    case 'information_factor':
      return { type: 'information_factor' };
  }
}

/** Project an entire v2 dataset onto a deterministic v1 aggregate. */
export function projectRulesToV1(data: V2Data): { entries: V1EntryProjection[] } {
  const rules = (data.rules ?? []).slice().sort((a, b) => a.id.localeCompare(b.id));
  const entries = rules.map((rule) =>
    projectRuleToV1(rule, {
      concepts: data.concepts ?? [],
      categories: data.categories ?? [],
      sources: data.sources ?? [],
    }),
  );
  return { entries };
}
