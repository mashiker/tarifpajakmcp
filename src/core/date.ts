import type { DateInterval } from './types.ts';

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

/** Returns true when the value is a syntactically valid ISO calendar date. */
export function isValidDate(value: unknown): value is string {
  if (typeof value !== 'string' || !DATE_PATTERN.test(value)) return false;
  const parsed = Date.parse(`${value}T00:00:00Z`);
  if (!Number.isFinite(parsed)) return false;
  // Reject rollover/normalization (e.g. 2024-02-30 -> 2024-03-01).
  return new Date(parsed).toISOString().slice(0, 10) === value;
}

/** Throws on malformed dates; used by pure helpers where inputs are already trusted. */
function day(value: string): number {
  if (!isValidDate(value)) throw new Error(`Invalid date: ${value}`);
  return Date.parse(`${value}T00:00:00Z`);
}

/** True when `interval.validToExclusive` is null or strictly after `validFrom`. Never throws on valid dates. */
export function isValidInterval(interval: DateInterval): boolean {
  if (!isValidDate(interval.validFrom)) return false;
  if (interval.validToExclusive === null) return true;
  if (!isValidDate(interval.validToExclusive)) return false;
  return day(interval.validToExclusive) > day(interval.validFrom);
}

export function containsDate(interval: DateInterval, date: string): boolean {
  const value = day(date);
  const from = day(interval.validFrom);
  const finish = interval.validToExclusive === null ? Infinity : day(interval.validToExclusive);
  if (finish <= from) throw new Error('Invalid half-open interval');
  return from <= value && value < finish;
}

export function overlaps(a: DateInterval, b: DateInterval): boolean {
  const aFrom = day(a.validFrom);
  const aTo = a.validToExclusive === null ? Infinity : day(a.validToExclusive);
  const bFrom = day(b.validFrom);
  const bTo = b.validToExclusive === null ? Infinity : day(b.validToExclusive);
  return aFrom < bTo && bFrom < aTo;
}

/**
 * Returns the half-open sub-interval of `interval` that intersects the calendar
 * `year`. Throws when the interval does not intersect the year at all.
 */
export function yearSegments(interval: DateInterval, year: number): DateInterval {
  const from = `${year}-01-01`;
  const to = `${year + 1}-01-01`;
  const start = day(interval.validFrom) > day(from) ? interval.validFrom : from;
  const finish =
    interval.validToExclusive === null || day(interval.validToExclusive) > day(to)
      ? to
      : interval.validToExclusive;
  if (day(start) >= day(finish)) throw new Error('Interval does not intersect year');
  return { validFrom: start, validToExclusive: finish };
}
