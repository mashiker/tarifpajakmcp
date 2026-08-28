// Pure URL state + filtering helpers for the root database experience.
//
// Design contract (Task 8 / Jevi's core ask):
//   - The URL is the single source of truth. The page parses the query string
//     on load, calls `history.replaceState` while typing, `pushState` on
//     committed changes, and handles `popstate`.
//   - No implicit "current law": when the user has not selected a date, the
//     state's `date` is empty and the UI must surface an explicit default date.
//   - Defaults are omitted from the serialized URL so it stays clean.
//   - Date mode is either `YYYY-MM-DD` (exact date) or `YYYY` (year span).
//   - `filterDatabaseRows` is pure: same rows + same state -> same output, with
//     no mutation of inputs. Sorting is deterministic.
//
// This module is environment-agnostic: it does not read `window.location` or
// `history`. The page wires those side-effects using these pure helpers.

/** Status values surfaced in the toolbar and URL. */
export const STATUS_OPTIONS = ['all', 'berlaku', 'diubah', 'belum_berlaku', 'dicabut'] as const;
export type StatusFilter = (typeof STATUS_OPTIONS)[number];

/**
 * Per-row derived historical status (Task 9 Mn2 fix). Distinct from
 * `StatusFilter` because it never includes the synthetic `all` value — every
 * row resolves to exactly one of the four real statuses.
 *
 * Derivation (per Task 9 brief):
 *   - `belum_berlaku` — `validFrom` is strictly after `today`
 *   - `diubah` — superseded by another visible rule (regardless of the calendar)
 *   - `dicabut` — non-superseded rule whose exclusive end date is on/before `today`
 *   - `berlaku` — open-ended (`validToExclusive === null`) AND already in effect
 *
 * `today` is the v2 release's `generatedAt` (deterministic per release), NOT
 * `new Date()`: the dataset is a fixed snapshot and the status filter must
 * produce the same counts across two builds at the same release.
 */
export type RowStatus = Exclude<StatusFilter, 'all'>;

/**
 * Verification filters. `conflict` is a synthetic bucket that maps to the
 * `conflict: true` row flag (declared source conflicts), so the UI can expose
 * them without forcing users to know the underlying verification taxonomy.
 */
export const VERIFICATION_OPTIONS = [
  'all',
  'verified_primary',
  'verified_secondary',
  'needs_review',
  'source_conflict',
  'summary_only',
  'conflict',
] as const;
export type VerificationFilter = (typeof VERIFICATION_OPTIONS)[number];

/** Sort options surfaced in the toolbar. */
export const SORT_OPTIONS = ['category', 'rate', 'newest', 'oldest'] as const;
export type SortKey = (typeof SORT_OPTIONS)[number];

/** URL state. All fields are serializable; defaults live in DEFAULT_DATABASE_STATE. */
export interface DatabaseState {
  /** Free-text search query, lowercased + trimmed. */
  q: string;
  /** `YYYY-MM-DD` exact date, `YYYY` year span, or '' when unset. */
  date: string;
  /** Category slug, or 'all'. */
  category: string;
  /** Status filter value. */
  status: StatusFilter;
  /** Verification filter value. */
  verification: VerificationFilter;
  /** Sort key. */
  sort: SortKey;
}

/** Explicit defaults. UI must NOT silently fill `date` with today's date. */
export const DEFAULT_DATABASE_STATE: DatabaseState = {
  q: '',
  date: '',
  category: 'all',
  status: 'all',
  verification: 'all',
  sort: 'category',
};

/**
 * A row in the database table. Mirrors the shape emitted by the dataset
 * builder that joins the v2 rules corpus with concept/category names and BPPU.
 */
export interface DatabaseRow {
  /** Stable detail-route id (conceptId or ruleId). */
  id: string;
  /** Underlying rule id, when distinguishable from `id`. */
  ruleId?: string;
  /** Category slug, e.g. `ppn`, `pph-23`. */
  category: string;
  /** Human-readable transaction/concept name. */
  name: string;
  /** Formatted rate string, e.g. `11%`, `2%–4%`, `Progresif`. */
  rate: string;
  /** Inclusive valid-from date. */
  validFrom: string;
  /** Exclusive valid-to date, or null when open-ended. */
  validToExclusive: string | null;
  /** Verification status from the v2 corpus. */
  verification: string;
  /** True when the row participates in a declared source conflict. */
  conflict: boolean;
  /**
   * True when another visible rule supersedes this one (Task 9 Mn2 fix).
   * Drives the `diubah` status derivation. Defaults to false when the dataset
   * builder does not set it (e.g. legacy callers), so existing rows that
   * predate the field still resolve to berlaku/dicabut correctly.
   */
  superseded?: boolean;
}

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const YEAR_PATTERN = /^\d{4}$/;

/** True when value is a syntactically valid ISO calendar date (no rollover). */
export function isValidDate(value: string): boolean {
  if (!DATE_PATTERN.test(value)) return false;
  const parsed = Date.parse(`${value}T00:00:00Z`);
  if (!Number.isFinite(parsed)) return false;
  return new Date(parsed).toISOString().slice(0, 10) === value;
}

/** True when value is a 4-digit year string. */
export function isValidYear(value: string): boolean {
  return YEAR_PATTERN.test(value);
}

/**
 * Validate the temporal `date` field. Accepts `YYYY-MM-DD` (exact date mode) or
 * `YYYY` (year span mode). Anything else (including rollover like 2024-02-30)
 * collapses to '' so the UI surfaces its explicit default.
 */
function normalizeDate(raw: string): string {
  const value = raw.trim();
  if (!value) return '';
  if (isValidYear(value)) return value;
  if (isValidDate(value)) return value;
  return '';
}

function oneOf<T extends string>(value: string, options: readonly T[], fallback: T): T {
  return (options as readonly string[]).includes(value) ? (value as T) : fallback;
}

/**
 * Parse a query string (with or without the leading `?`, and optionally
 * followed by `#hash`) into a DatabaseState. Unknown enum values and malformed
 * dates fall back to the explicit defaults — the URL is the source of truth,
 * but never trust unchecked user input.
 */
export function parseDatabaseState(query: string): DatabaseState {
  // Strip everything from the first `#` so a hash does not corrupt parsing.
  const hashIndex = query.indexOf('#');
  const queryOnly = hashIndex >= 0 ? query.slice(0, hashIndex) : query;
  const trimmed = queryOnly.replace(/^\?/, '').trim();
  if (!trimmed) return { ...DEFAULT_DATABASE_STATE };

  const params = new URLSearchParams(trimmed);

  const q = (params.get('q') ?? '').trim().toLowerCase();
  const date = normalizeDate(params.get('date') ?? '');
  const categoryRaw = (params.get('category') ?? '').trim().toLowerCase();
  const category = categoryRaw === '' ? 'all' : categoryRaw;

  return {
    q,
    date,
    category,
    status: oneOf((params.get('status') ?? '').toLowerCase(), STATUS_OPTIONS, 'all'),
    verification: oneOf((params.get('verification') ?? '').toLowerCase(), VERIFICATION_OPTIONS, 'all'),
    sort: oneOf((params.get('sort') ?? '').toLowerCase(), SORT_OPTIONS, 'category'),
  };
}

/**
 * Serialize a DatabaseState back into a query string. Defaults are omitted so
 * the URL stays clean. Always starts with `?` when non-empty, or returns `''`.
 */
export function serializeDatabaseState(state: DatabaseState): string {
  const params = new URLSearchParams();
  if (state.q && state.q !== DEFAULT_DATABASE_STATE.q) params.set('q', state.q);
  if (state.date && state.date !== DEFAULT_DATABASE_STATE.date) params.set('date', state.date);
  if (state.category && state.category !== DEFAULT_DATABASE_STATE.category) params.set('category', state.category);
  if (state.status && state.status !== DEFAULT_DATABASE_STATE.status) params.set('status', state.status);
  if (state.verification && state.verification !== DEFAULT_DATABASE_STATE.verification) params.set('verification', state.verification);
  if (state.sort && state.sort !== DEFAULT_DATABASE_STATE.sort) params.set('sort', state.sort);

  const encoded = params.toString();
  return encoded ? `?${encoded}` : '';
}

/** Structural equality between two states. Used to skip redundant pushState. */
export function databaseStateEquals(a: DatabaseState, b: DatabaseState): boolean {
  return (
    a.q === b.q &&
    a.date === b.date &&
    a.category === b.category &&
    a.status === b.status &&
    a.verification === b.verification &&
    a.sort === b.sort
  );
}

function toEpochMs(value: string): number {
  // Year-only dates are normalized to Jan 1 of that year for epoch math.
  if (isValidYear(value)) return Date.parse(`${value}-01-01T00:00:00Z`);
  return Date.parse(`${value}T00:00:00Z`);
}

/**
 * True when a half-open `[validFrom, validToExclusive)` interval covers the
 * exact date, with `null` validToExclusive treated as open-ended present.
 */
function intervalContainsDate(row: DatabaseRow, date: string): boolean {
  if (!isValidDate(date)) return false;
  const value = toEpochMs(date);
  const from = toEpochMs(row.validFrom);
  const finish = row.validToExclusive === null ? Infinity : toEpochMs(row.validToExclusive);
  return from <= value && value < finish;
}

/**
 * True when a half-open interval intersects the calendar year `[YYYY-01-01,
 * (YYYY+1)-01-01)`. Used by year-mode filtering.
 */
function intervalIntersectsYear(row: DatabaseRow, year: number): boolean {
  const yearStart = toEpochMs(`${year}-01-01`);
  const yearEnd = toEpochMs(`${year + 1}-01-01`);
  const from = toEpochMs(row.validFrom);
  const finish = row.validToExclusive === null ? Infinity : toEpochMs(row.validToExclusive);
  return from < yearEnd && yearStart < finish;
}

function matchesTemporal(row: DatabaseRow, date: string): boolean {
  if (!date) return true;
  if (isValidYear(date)) return intervalIntersectsYear(row, Number(date));
  if (isValidDate(date)) return intervalContainsDate(row, date);
  return true;
}

// ---------------------------------------------------------------------------
// Text search — tokenized, alias-aware, field-weighted, ranked.
//
// Sebelumnya ini substring eksak (`haystack.includes(q)`): mengetik "pph 23"
// TIDAK menemukan "PPh Pasal 23 atas jasa teknik" karena tidak ada substring
// "pph 23" di haystack. Sekarang:
//   1. Query & haystack ditokenisasi (split non-alphanumeric).
//   2. Query compact ala "pph23"/"pmk131" dipecah jadi ["pph","23"] dsb.
//   3. SEMUA token query harus match (AND), tiap token dinilai kualitas
//      match-nya: exact > prefix > substring > fuzzy (edit distance ≤1).
//   4. Skor = jumlah (kualitas × bobot field): name > category > id > rate,
//      bonus frasa utuh. Hasil diurutkan by skor saat query aktif.
// Deterministik & pure: input sama -> output sama (dipakai server & client).
// ---------------------------------------------------------------------------

interface RowSearchIndex {
  /** Field terpisah, sudah lowercase: [teks, bobot]. */
  fields: Array<{ text: string; weight: number; tokens: string[]; compact: string }>;
  /** Gabungan semua field untuk frasa-bonus & substring fallback. */
  rawAll: string;
  compactAll: string;
}

const FIELD_WEIGHTS: Array<[keyof DatabaseRow, number]> = [
  ['name', 6],
  ['category', 4],
  ['id', 2],
  ['ruleId', 2],
  ['rate', 1],
];

const searchIndexCache = new WeakMap<DatabaseRow, RowSearchIndex>();

function tokenize(text: string): string[] {
  return text.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);
}

function compact(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]/g, '');
}

/** Prefix alphanumeric yang boleh "menempel" dengan angka: pph23 → pph+23. */
const GLUED_PREFIX = new Set(['pph', 'ppn', 'pbb', 'pp', 'pmk', 'uu', 'bpe']);

function expandGluedQuery(rawQuery: string): string[] {
  const tokens: string[] = [];
  for (const t of tokenize(rawQuery)) {
    const glued = t.match(/^([a-z]{2,4})(\d{1,4}[a-z]?)$/);
    if (glued && GLUED_PREFIX.has(glued[1])) {
      tokens.push(glued[1], glued[2]);
    } else {
      tokens.push(t);
    }
  }
  return tokens;
}

function buildSearchIndex(row: DatabaseRow): RowSearchIndex {
  const fields = FIELD_WEIGHTS.map(([key, weight]) => {
    const text = String(row[key] ?? '').toLowerCase();
    return { text, weight, tokens: tokenize(text), compact: compact(text) };
  });
  const rawAll = fields.map((f) => f.text).join(' ');
  return { fields, rawAll, compactAll: compact(rawAll) };
}

/** Levenshtein edit distance, dibatasi max untuk early-exit. */
function editDistanceWithin(a: string, b: string, max: number): boolean {
  if (Math.abs(a.length - b.length) > max) return false;
  let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const cur = [i];
    let rowMin = i;
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + cost);
      rowMin = Math.min(rowMin, cur[j]);
    }
    if (rowMin > max) return false;
    prev = cur;
  }
  return prev[b.length] <= max;
}

/**
 * Kualitas match terbaik sebuah token query terhadap satu field.
 * Return 0 jika tidak match. Nilai 0..1 dikali bobot field.
 */
function tokenFieldScore(qTok: string, field: RowSearchIndex['fields'][number]): number {
  const qLen = qTok.length;
  // Substring mentah (menangkap fragmen id seperti "pph23-2" di "r-pph23-2").
  if (qLen >= 3 && field.text.includes(qTok)) return 0.6;
  for (const hTok of field.tokens) {
    if (hTok === qTok) return 1;
  }
  if (qLen >= 2) {
    for (const hTok of field.tokens) {
      if (hTok.startsWith(qTok)) return 0.8;
    }
  }
  if (qLen >= 3) {
    const qCompact = compact(qTok);
    for (const hTok of field.tokens) {
      if (hTok.length >= qCompact.length && hTok.startsWith(qCompact)) return 0.7;
      const hCompact = compact(hTok);
      if (qCompact.length >= 3 && hCompact.startsWith(qCompact)) return 0.7;
    }
  }
  // Fuzzy typo: 1 edit untuk token pendek-sedang, 2 untuk panjang.
  if (qLen >= 4) {
    const maxEdits = qLen >= 8 ? 2 : 1;
    for (const hTok of field.tokens) {
      if (Math.abs(hTok.length - qLen) > maxEdits) continue;
      if (editDistanceWithin(qTok, hTok, maxEdits)) return 0.5;
    }
  }
  return 0;
}

/** Skor relevansi row terhadap query; 0 berarti tidak match. */
export function searchScore(row: DatabaseRow, q: string): number {
  if (!q) return 0;
  const index = searchIndexCache.get(row) ?? buildSearchIndex(row);
  searchIndexCache.set(row, index);
  const qTokens = expandGluedQuery(q);
  if (qTokens.length === 0) return 0;

  let total = 0;
  for (const qTok of qTokens) {
    let best = 0;
    for (const field of index.fields) {
      const s = tokenFieldScore(qTok, field);
      if (s > best) best = s;
    }
    if (best === 0) return 0; // AND: satu token saja gagal -> row tidak match
    total += best;
  }
  // Bonus frasa utuh ("pph 23" muncul berurutan setelah compact).
  const compactQuery = compact(qTokens.join(' '));
  if (compactQuery.length >= 4 && index.compactAll.includes(compactQuery)) {
    total *= 1.35;
  }
  return total;
}

function matchesText(row: DatabaseRow, q: string): boolean {
  if (!q) return true;
  return searchScore(row, q) > 0;
}

function matchesCategory(row: DatabaseRow, category: string): boolean {
  if (category === 'all') return true;
  return row.category === category;
}

function matchesVerification(row: DatabaseRow, verification: VerificationFilter): boolean {
  if (verification === 'all') return true;
  if (verification === 'conflict') return row.conflict;
  return row.verification === verification;
}

/**
 * Derive the historical status of a row as of a deterministic `today` (Task 9
 * Mn2 fix). Pure: same row + same today -> same status, no mutation.
 *
 * Precedence (matters at edge cases):
 *   1. `belum_berlaku` — validFrom strictly after today, regardless of
 *      supersession or end date. A rule that has not started yet is not yet
 *      "diubah" even if a successor is already scheduled.
 *   2. `diubah` — superseded by another visible rule. The dataset marks this
 *      via the `superseded` flag, populated by the dataset builder from the
 *      v2 corpus `supersededBy` relation. A superseded rule stays visible
 *      (it is history) but is no longer the operative answer.
 *   3. `dicabut` — non-superseded rule whose exclusive end date is on/before
 *      today (i.e. it stopped applying with no declared successor).
 *   4. `berlaku` — open-ended AND already in effect.
 */
export function deriveRowStatus(row: DatabaseRow, today: string): RowStatus {
  const todayMs = toEpochMs(today);
  const fromMs = toEpochMs(row.validFrom);
  // 1. Future rules are belum_berlaku first.
  if (fromMs > todayMs) return 'belum_berlaku';
  // 2. Superseded-but-visible is diubah regardless of the calendar.
  if (row.superseded) return 'diubah';
  // 3. Non-superseded rule with a past-or-today exclusive end date is dicabut.
  if (row.validToExclusive !== null) {
    const endMs = toEpochMs(row.validToExclusive);
    if (endMs <= todayMs) return 'dicabut';
  }
  // 4. Otherwise it is in effect and open-ended (or end date in the future).
  return 'berlaku';
}

/**
 * Pure per-row test for the status chip filter. `today` is the deterministic
 * release anchor. Mirrors `deriveRowStatus` so the client can toggle
 * `hidden` on existing DOM nodes (see database-markup.ts `isRowVisible`).
 */
export function matchesStatus(row: DatabaseRow, status: StatusFilter, today: string): boolean {
  if (status === 'all') return true;
  return deriveRowStatus(row, today) === status;
}

const STATUS_PRECEDENCE: Record<string, number> = {
  berlaku: 0,
  diubah: 1,
  belum_berlaku: 2,
  dicabut: 3,
};

/**
 * Pure filter + sort. Returns a new array; never mutates the input rows.
 * Deterministic: equal inputs produce equal outputs, and ties are broken by
 * ascending `id` so two builds never disagree on row order.
 *
 * `today` is the deterministic release anchor used by the status filter
 * (Task 9 Mn2 fix). When omitted, status filtering is skipped — this preserves
 * the legacy behavior relied on by tests that predate the status chip wiring.
 * Production callers (index.astro) pass the v2 release `generatedAt` so the
 * status filter produces the same counts across two builds at the same release.
 */
export function filterDatabaseRows(
  rows: readonly DatabaseRow[],
  state: DatabaseState,
  today?: string,
): DatabaseRow[] {
  const filtered = rows.filter((row) => {
    return (
      matchesText(row, state.q) &&
      matchesCategory(row, state.category) &&
      matchesVerification(row, state.verification) &&
      matchesTemporal(row, state.date) &&
      // Status filter is only applied when a deterministic `today` is supplied.
      // Without it, the chip filter is a no-op (legacy behavior, so existing
      // callers that never set `today` are unaffected).
      (!today || matchesStatus(row, state.status, today))
    );
  });

  const byId = (a: DatabaseRow, b: DatabaseRow) => a.id.localeCompare(b.id);

  switch (state.sort) {
    case 'rate':
      filtered.sort((a, b) => numericRate(a.rate) - numericRate(b.rate) || byId(a, b));
      break;
    case 'newest':
      filtered.sort((a, b) => toEpochMs(b.validFrom) - toEpochMs(a.validFrom) || byId(a, b));
      break;
    case 'oldest':
      filtered.sort((a, b) => toEpochMs(a.validFrom) - toEpochMs(b.validFrom) || byId(a, b));
      break;
    case 'category':
    default:
      if (state.q) {
        // Relevance ranking: hasil pencarian diurutkan by skor (desc),
        // lalu kategori & id sebagai tie-break deterministik. Sort lain
        // (rate/tanggal) tetap menimpa urutan relevansi.
        filtered.sort(
          (a, b) =>
            searchScore(b, state.q) - searchScore(a, state.q) ||
            a.category.localeCompare(b.category) ||
            // Precedence berdasarkan STATUS turunan baris (berlaku → dicabut).
            // STATUS_PRECEDENCE berkunci status; sebelumnya dipakai dengan kunci
            // verification token sehingga tiebreaker ini selalu mati (9-9).
            (STATUS_PRECEDENCE[deriveRowStatus(a, today ?? '')] ?? 9) -
              (STATUS_PRECEDENCE[deriveRowStatus(b, today ?? '')] ?? 9) ||
            byId(a, b),
        );
      } else {
        filtered.sort(
          (a, b) =>
            a.category.localeCompare(b.category) ||
            // Precedence berdasarkan STATUS turunan baris (berlaku → dicabut).
            // STATUS_PRECEDENCE berkunci status; sebelumnya dipakai dengan kunci
            // verification token sehingga tiebreaker ini selalu mati (9-9).
            (STATUS_PRECEDENCE[deriveRowStatus(a, today ?? '')] ?? 9) -
              (STATUS_PRECEDENCE[deriveRowStatus(b, today ?? '')] ?? 9) ||
            byId(a, b),
        );
      }
      break;
  }

  return filtered;
}

/** Extract the first numeric token from a formatted rate string (e.g. `11%` -> 11). */
function numericRate(rate: string): number {
  const match = rate.match(/-?\d+(\.\d+)?/);
  return match ? Number(match[0]) : Number.POSITIVE_INFINITY;
}

export interface DatabaseSummary {
  /** Total rows in the dataset (before filtering). */
  total: number;
  /** Rows visible after applying the current state. */
  visible: number;
  /** Rows whose interval is open-ended (no validToExclusive). */
  active: number;
  /** Rows flagged as participating in a declared source conflict. */
  conflict: number;
  /** Distinct category count across the visible set. */
  categories: number;
  /** Status-specific label for the live region. */
  visibleLabel: string;
}

/**
 * Build a status-specific summary for the result-count live region. Wording
 * reflects what is actually visible, never a universal "aktif" suffix.
 */
export function summarizeDatabaseRows(allRows: readonly DatabaseRow[], visible: readonly DatabaseRow[]): DatabaseSummary {
  const categories = new Set(visible.map((r) => r.category));
  const conflict = visible.filter((r) => r.conflict).length;
  const active = visible.filter((r) => r.validToExclusive === null).length;

  let visibleLabel: string;
  if (visible.length === 0) {
    visibleLabel = 'Tidak ada tarif yang cocok. Ubah filter untuk memperluas pencarian.';
  } else if (conflict > 0) {
    visibleLabel = `${visible.length} tarif (${conflict} dengan konflik sumber) dari ${allRows.length} total`;
  } else if (active === visible.length) {
    visibleLabel = `${visible.length} tarif aktif dari ${allRows.length} total`;
  } else {
    visibleLabel = `${visible.length} tarif dari ${allRows.length} total`;
  }

  return {
    total: allRows.length,
    visible: visible.length,
    active,
    conflict,
    categories: categories.size,
    visibleLabel,
  };
}
