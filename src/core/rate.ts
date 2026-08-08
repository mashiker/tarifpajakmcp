import type { ProgressiveBracket, Rate } from './types.ts';
import type { DecimalString } from './types.ts';

/**
 * Minimal decimal helpers. All legal rate arithmetic uses string-shift over
 * integer cents to avoid binary-float rounding. Percentages are stored as
 * decimal fractions (e.g. "0.11") and rendered as whole-percent strings.
 */

function normalizeDecimal(value: DecimalString): { sign: string; int: string; frac: string } {
  if (typeof value !== 'string' || value.length === 0) {
    throw new Error(`Invalid decimal: ${String(value)}`);
  }
  let sign = '';
  let rest = value;
  if (rest.startsWith('-')) {
    sign = '-';
    rest = rest.slice(1);
  } else if (rest.startsWith('+')) {
    rest = rest.slice(1);
  }
  if (!/^\d*(\.\d*)?$/.test(rest) || rest === '.' || rest === '') {
    throw new Error(`Invalid decimal: ${value}`);
  }
  const [intPart = '', fracPart = ''] = rest.split('.');
  const int = intPart === '' ? '0' : intPart.replace(/^0+(?=\d)/, '');
  return { sign, int, frac: fracPart };
}

/** Shift a decimal string to an integer scaled by `scale` decimal places. */
function toScaledInt(value: DecimalString, scale: number): bigint {
  const { sign, int, frac } = normalizeDecimal(value);
  const digits = `${int}${frac.padEnd(scale, '0').slice(0, scale)}`.replace(/^0+(?=\d)/, '');
  const magnitude = BigInt(digits === '' ? '0' : digits);
  return sign === '-' ? -magnitude : magnitude;
}

function fromScaledInt(scaled: bigint, scale: number): string {
  const sign = scaled < 0n ? '-' : '';
  const abs = scaled < 0n ? -scaled : scaled;
  const digits = abs.toString().padStart(scale + 1, '0');
  const intPart = digits.slice(0, digits.length - scale);
  let fracPart = digits.slice(digits.length - scale);
  fracPart = fracPart.replace(/0+$/, '');
  return fracPart === '' ? `${sign}${intPart}` : `${sign}${intPart}.${fracPart}`;
}

/**
 * Render a decimal fraction (e.g. "0.11") as a percentage string ("11%") with
 * no binary float conversion. Trims trailing zeros in the percent portion.
 */
export function formatPercent(fraction: DecimalString): string {
  // Keep 4 places of fraction precision; multiplying by 100 shifts 2 places
  // into the integer percent portion.
  const scale = 4;
  const scaled = toScaledInt(fraction, scale);
  const percentScaled = scaled * 100n;
  const trimmed = fromScaledInt(percentScaled, scale);
  return `${trimmed}%`;
}

function renderCents(scaled: bigint): string {
  const sign = scaled < 0n ? '-' : '';
  const abs = scaled < 0n ? -scaled : scaled;
  const digits = abs.toString().padStart(3, '0');
  const intPart = digits.slice(0, digits.length - 2);
  const fracPart = digits.slice(digits.length - 2);
  return `${sign}${intPart}.${fracPart}`;
}

/** Format an integer currency amount with thousands separators. */
function formatGrouped(amount: DecimalString): string {
  const { sign, int, frac } = normalizeDecimal(amount);
  const grouped = int.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return frac === '' ? `${sign}${grouped}` : `${sign}${grouped}.${frac}`;
}

export function formatRate(rate: Rate): string {
  switch (rate.type) {
    case 'percentage':
      return formatPercent(rate.value);
    case 'fixed':
      return `${formatGrouped(rate.amount)} ${rate.currency}`;
    case 'specific': {
      const currency = rate.currency ? `${rate.currency} ` : '';
      return `${currency}${rate.amount}/${rate.unit}`;
    }
    case 'range':
      return `${formatPercent(rate.min)}–${formatPercent(rate.max)}`;
    case 'zero':
      return '0%';
    case 'not_applicable':
      return 'Tidak berlaku';
    case 'free_text':
      return rate.text;
    case 'formula':
      return rate.expression;
    case 'information_factor':
      return `Faktor informasi ${rate.factor}`;
    case 'progressive':
      return 'Progresif';
  }
}

/**
 * Progressive tax calculation using integer scaled arithmetic.
 * `brackets` must be ordered by ascending `upTo` with the open-ended bracket
 * (upTo === null) last. `base` and `rate` are decimal strings. Result is
 * always rendered as a fixed 2-decimal currency string.
 */
export function calculateProgressive(base: DecimalString, brackets: ProgressiveBracket[]): string {
  if (brackets.length === 0) throw new Error('Progressive requires at least one bracket');
  const scale = 2; // currency cents
  const rateScale = 4; // rate fraction precision (e.g. 0.05 = 500)
  // Validate bracket structure independently of the income value so malformed
  // brackets are always rejected even when an early-break would hide them.
  let prev: bigint | null = null;
  let sawOpen = false;
  for (const bracket of brackets) {
    if (sawOpen) throw new Error('Open-ended bracket must be last');
    if (bracket.upTo === null) {
      sawOpen = true;
      continue;
    }
    const limit = toScaledInt(bracket.upTo, scale);
    if (prev !== null && limit <= prev) throw new Error('Progressive brackets out of order or overlapping');
    prev = limit;
  }

  const income = toScaledInt(base, scale);
  let previous = 0n;
  let total = 0n;
  for (const bracket of brackets) {
    const limit = bracket.upTo === null ? income : toScaledInt(bracket.upTo, scale);
    const taxable = income < limit ? income - previous : limit - previous;
    if (taxable > 0n) {
      total += (taxable * toScaledInt(bracket.rate, rateScale)) / 10n ** BigInt(rateScale);
    }
    previous = limit;
    if (income <= limit && bracket.upTo !== null) break;
  }
  return renderCents(total);
}
