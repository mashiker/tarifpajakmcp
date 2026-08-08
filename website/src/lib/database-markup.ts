// Shared, pure HTML template helpers for the database experience.
//
// Why this module exists (Task 8 review C1):
//   The Astro components and the inline client script must render IDENTICAL
//   markup for a given row + state. The original Task 8 implementation had the
//   Astro components emit rich cells (timeline signature, verification badge)
//   while the client script rebuilt rows from scratch with empty `.col-timeline`
//   and bare-text verification. On hydration, `applyState` ran and overwrote the
//   rich server-rendered DOM with the degraded client DOM.
//
//   Fix: both consumers now call the same pure functions exported here. The
//   output is a deterministic HTML string for each row/card, so the server
//  -rendered HTML and the client-rendered HTML are byte-identical for the same
//   inputs. A contract test (tests/contracts/database-markup.test.ts) pins the
//   shape: every row/card must contain `.timeline-track`, optionally
//   `.timeline-marker`, and a `.verification-badge` element.

import type { DatabaseRow, VerificationFilter, StatusFilter } from './database-state.ts';
import { matchesStatus } from './database-state.ts';

const VERIFICATION_TOKENS: Record<string, { label: string; cls: string; title: string }> = {
  verified_primary: {
    label: 'Primer',
    cls: 'verification-primary',
    title: 'verified_primary — didukung sumber primer resmi dengan locator',
  },
  verified_secondary: {
    label: 'Sekunder',
    cls: 'verification-secondary',
    title: 'verified_secondary — sudah ditinjau, sumber primer belum lengkap',
  },
  needs_review: {
    label: 'Tinjauan',
    cls: 'verification-review',
    title: 'needs_review — belum cukup untuk klaim pasti',
  },
  source_conflict: {
    label: 'Konflik',
    cls: 'verification-conflict',
    title: 'source_conflict — ada konflik sumber yang belum diputuskan',
  },
  summary_only: {
    label: 'Orientasi',
    cls: 'verification-summary',
    title: 'summary_only — orientasi saja, bukan kalkulator',
  },
};

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function escapeAttr(value: string): string {
  return escapeHtml(value).replace(/`/g, '&#96;');
}

/**
 * Render the verification badge HTML. Pure: same input -> same string.
 * (The VerificationBadge.astro component was deleted in Task 9 — Mn1 —
 * because this shared module is the single source of truth for the badge
 * markup, used by both the Astro components and the client script.)
 */
export function renderVerificationBadge(status: string, conflict = false): string {
  const token = VERIFICATION_TOKENS[status] ?? VERIFICATION_TOKENS.summary_only;
  const dot = `<span class="verification-dot" aria-hidden="true"></span>`;
  if (conflict) {
    const label = `Verifikasi: ${token.label}, konflik sumber`;
    return (
      `<span class="verification-badge ${token.cls} verification-conflict-flag" title="${escapeAttr(token.title)}" aria-label="${escapeAttr(label)}">` +
      `${dot}${escapeHtml(token.label)}<span class="verification-conflict-marker" aria-hidden="true">⚠</span>` +
      `</span>`
    );
  }
  const label = `Verifikasi: ${token.label}`;
  return (
    `<span class="verification-badge ${token.cls}" title="${escapeAttr(token.title)}" aria-label="${escapeAttr(label)}">` +
    `${dot}${escapeHtml(token.label)}` +
    `</span>`
  );
}

const NOW_YEAR = new Date().getUTCFullYear();

function toYear(value: string, fallbackYear: number): number {
  if (!value) return fallbackYear;
  const m = value.match(/^(\d{4})/);
  return m ? Number(m[1]) : fallbackYear;
}

function isValidDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const parsed = Date.parse(`${value}T00:00:00Z`);
  if (!Number.isFinite(parsed)) return false;
  return new Date(parsed).toISOString().slice(0, 10) === value;
}

function toEpochMs(value: string): number {
  if (/^\d{4}$/.test(value)) return Date.parse(`${value}-01-01T00:00:00Z`);
  return Date.parse(`${value}T00:00:00Z`);
}

/**
 * Render the timeline cell HTML. Pure: same input -> same string.
 * (The TimelineCell.astro component was deleted in Task 9 — Mn1 — because
 * this shared module is the single source of truth for the timeline markup,
 * used by both the Astro components and the client script.)
 *
 * The marker is emitted only when a `selectedDate` falls inside the plot
 * window; otherwise the marker span is omitted (its absence is a valid,
 * deterministic state).
 */
export function renderTimelineCell(
  validFrom: string,
  validToExclusive: string | null,
  selectedDate = '',
  compact = false,
): string {
  const fromYear = toYear(validFrom, NOW_YEAR - 5);
  const endYear = toYear(validToExclusive ?? '', NOW_YEAR + 2);

  const windowStart = fromYear - 2;
  const windowEnd = Math.max(endYear + 2, fromYear + 6);
  const span = Math.max(windowEnd - windowStart, 1);

  const startPct = ((fromYear - windowStart) / span) * 100;
  const endPct = Math.min(((Math.max(endYear, fromYear + 1) - windowStart) / span) * 100, 100);
  const widthPct = Math.max(endPct - startPct, 6);

  let markerHtml = '';
  let markerYear: string | null = null;
  if (selectedDate) {
    const sy = toYear(selectedDate, NOW_YEAR);
    if (sy >= windowStart && sy <= windowEnd) {
      const markerPct = ((sy - windowStart) / span) * 100;
      markerHtml = `<div class="timeline-marker" style="left:${markerPct}%" title="${escapeAttr(String(sy))}"></div>`;
      markerYear = String(sy);
    }
  }

  const endLabel = validToExclusive ? validToExclusive.slice(0, 10) : 'kini';
  const ariaLabel =
    `Berlaku ${validFrom.slice(0, 10)} sampai ` +
    `${validToExclusive ? `${validToExclusive.slice(0, 10)} (eksklusif)` : 'sekarang'}` +
    `${markerYear ? `, tanggal terpilih ${selectedDate}` : ''}`;

  const compactCls = compact ? ' timeline-compact' : '';

  return (
    `<div class="timeline-cell${compactCls}" role="img" aria-label="${escapeAttr(ariaLabel)}">` +
    `<div class="timeline-track" aria-hidden="true">` +
    `<div class="timeline-span" style="left:${startPct}%; width:${widthPct}%" data-from="${escapeAttr(validFrom)}" data-to="${escapeAttr(validToExclusive ?? '')}"></div>` +
    markerHtml +
    `</div>` +
    `<div class="timeline-labels" aria-hidden="true">` +
    `<span class="timeline-from">${escapeHtml(validFrom.slice(0, 10))}</span>` +
    `<span class="timeline-to">${escapeHtml(endLabel)}</span>` +
    `</div>` +
    `</div>`
  );
}

export interface RowRenderInput {
  row: DatabaseRow;
  selectedDate?: string;
  categoryName?: string;
  categoryColor?: string;
}

function detailHref(id: string, selectedDate: string): string {
  const base = `/tarif/${encodeURIComponent(id)}`;
  return selectedDate ? `${base}?date=${encodeURIComponent(selectedDate)}` : base;
}

/**
 * Render a desktop table row `<tr>` for the given row + state. Pure.
 * Used by BOTH the DatabaseTable.astro component and the client script.
 *
 * The row carries `data-*` attributes for every field the client needs to
 * re-evaluate filters without re-embedding the corpus: `data-name`,
 * `data-rate`, `data-valid-from`, `data-valid-to-exclusive`,
 * `data-verification`, plus the existing `data-id`/`data-rule`/`data-category`/
 * `data-conflict`. This keeps the client's `isRowVisible` re-evaluation
 * self-contained.
 */
export function renderDatabaseRow({ row, selectedDate = '', categoryName, categoryColor }: RowRenderInput): string {
  const name = categoryName ?? row.category;
  const pillStyle = categoryColor ? ` style="--cat-color:${escapeAttr(categoryColor)}"` : '';
  const href = detailHref(row.id, selectedDate);
  const catHref = `/kategori/${encodeURIComponent(row.category)}`;
  const verification = renderVerificationBadge(row.verification, row.conflict);
  const timeline = renderTimelineCell(row.validFrom, row.validToExclusive, selectedDate, true);
  return (
    `<tr class="db-row"` +
    ` data-id="${escapeAttr(row.id)}"` +
    ` data-rule="${escapeAttr(row.ruleId ?? '')}"` +
    ` data-category="${escapeAttr(row.category)}"` +
    ` data-conflict="${row.conflict ? 'true' : 'false'}"` +
    ` data-name="${escapeAttr(row.name)}"` +
    ` data-rate="${escapeAttr(row.rate)}"` +
    ` data-valid-from="${escapeAttr(row.validFrom)}"` +
    ` data-valid-to-exclusive="${escapeAttr(row.validToExclusive ?? '')}"` +
    ` data-verification="${escapeAttr(row.verification)}"` +
    ` data-superseded="${row.superseded ? 'true' : 'false'}"` +
    `>` +
    `<td class="col-category">` +
    `<a href="${catHref}" class="db-category-pill"${pillStyle} aria-label="${escapeAttr(`Kategori ${name}`)}">` +
    `<span class="db-category-dot" aria-hidden="true"></span>${escapeHtml(name)}` +
    `</a>` +
    `</td>` +
    `<td class="col-name">` +
    `<a href="${href}" class="db-detail-link">` +
    `<span class="db-name">${escapeHtml(row.name)}</span>` +
    `<span class="db-ruleid">${escapeHtml(row.ruleId ?? '')}</span>` +
    `</a>` +
    `</td>` +
    `<td class="col-rate text-right"><span class="rate-value db-rate">${escapeHtml(row.rate)}</span></td>` +
    `<td class="col-verification">${verification}</td>` +
    `<td class="col-timeline">${timeline}</td>` +
    `</tr>`
  );
}

/**
 * Render a mobile card `<li>` for the given row + state. Pure.
 * Used by BOTH the DatabaseCards.astro component and the client script.
 *
 * The `<a class="db-card">` carries the same `data-*` attributes as the table
 * row so the client can re-evaluate filters on either surface.
 */
export function renderDatabaseCard({ row, selectedDate = '', categoryName, categoryColor }: RowRenderInput): string {
  const name = categoryName ?? row.category;
  const catStyle = categoryColor ? ` style="--cat-color:${escapeAttr(categoryColor)}"` : '';
  const href = detailHref(row.id, selectedDate);
  const verification = renderVerificationBadge(row.verification, row.conflict);
  const timeline = renderTimelineCell(row.validFrom, row.validToExclusive, selectedDate, true);
  const ariaLabel = `${row.name}, ${row.rate}, ${name}`;
  return (
    `<li>` +
    `<a href="${href}" class="db-card"` +
    ` data-id="${escapeAttr(row.id)}"` +
    ` data-rule="${escapeAttr(row.ruleId ?? '')}"` +
    ` data-category="${escapeAttr(row.category)}"` +
    ` data-conflict="${row.conflict ? 'true' : 'false'}"` +
    ` data-name="${escapeAttr(row.name)}"` +
    ` data-rate="${escapeAttr(row.rate)}"` +
    ` data-valid-from="${escapeAttr(row.validFrom)}"` +
    ` data-valid-to-exclusive="${escapeAttr(row.validToExclusive ?? '')}"` +
    ` data-verification="${escapeAttr(row.verification)}"` +
    ` data-superseded="${row.superseded ? 'true' : 'false'}"` +
    ` aria-label="${escapeAttr(ariaLabel)}">` +
    `<div class="db-card-top">` +
    `<span class="db-card-category"${catStyle}>` +
    `<span class="db-category-dot" aria-hidden="true"></span>${escapeHtml(name)}` +
    `</span>` +
    verification +
    `</div>` +
    `<div class="db-card-name">${escapeHtml(row.name)}</div>` +
    `<div class="db-card-bottom">` +
    `<span class="rate-value db-card-rate">${escapeHtml(row.rate)}</span>` +
    `<span class="db-card-ruleid">${escapeHtml(row.ruleId ?? '')}</span>` +
    `</div>` +
    timeline +
    `<span class="db-card-detail">Lihat detail →</span>` +
    `</a>` +
    `</li>`
  );
}

/**
 * Determine whether a row should be visible under the given state. Pure.
 * Mirrors `filterDatabaseRows`'s per-row test so the client can toggle
 * `hidden` on existing DOM nodes without rebuilding them.
 *
 * NOTE: this matches `filterDatabaseRows` exactly. The unit tests in
 * tests/unit/database-state.test.ts already lock the filter contract for the
 * full array; this helper exists only so the client script does not duplicate
 * the per-row logic.
 */
export function isRowVisible(row: DatabaseRow, state: {
  q: string;
  date: string;
  category: string;
  verification: VerificationFilter;
  status?: StatusFilter;
  today?: string;
}): boolean {
  const q = (state.q || '').toLowerCase();
  if (q) {
    const haystack = `${row.id} ${row.ruleId ?? ''} ${row.category} ${row.name} ${row.rate}`.toLowerCase();
    if (!haystack.includes(q)) return false;
  }
  if (state.category !== 'all' && row.category !== state.category) return false;
  if (state.verification !== 'all') {
    if (state.verification === 'conflict') {
      if (!row.conflict) return false;
    } else if (row.verification !== state.verification) {
      return false;
    }
  }
  // Status filter (Task 9 Mn2 fix). Only applied when both `status` (chip
  // selection) and `today` (deterministic release anchor) are supplied, so the
  // legacy callers that never set them keep their pre-Task-9 behavior.
  if (state.status && state.today && !matchesStatus(row, state.status, state.today)) return false;
  if (state.date) {
    if (/^\d{4}$/.test(state.date)) {
      const year = Number(state.date);
      const yearStart = toEpochMs(`${year}-01-01`);
      const yearEnd = toEpochMs(`${year + 1}-01-01`);
      const from = toEpochMs(row.validFrom);
      const finish = row.validToExclusive === null ? Infinity : toEpochMs(row.validToExclusive);
      if (!(from < yearEnd && yearStart < finish)) return false;
    } else if (isValidDate(state.date)) {
      const value = toEpochMs(state.date);
      const from = toEpochMs(row.validFrom);
      const finish = row.validToExclusive === null ? Infinity : toEpochMs(row.validToExclusive);
      if (!(from <= value && value < finish)) return false;
    }
  }
  return true;
}
