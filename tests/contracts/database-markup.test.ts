// Contract test for the shared database markup module (Task 8 review C1).
//
// The Astro components and the inline client script must emit byte-identical
// markup for a given row + state. Originally the client rebuilt rows with
// empty `.col-timeline` cells and bare-text verification, destroying the
// server-rendered timeline signature and verification badges on hydration.
//
// This contract locks the shape:
//   - every rendered row contains `.timeline-track` and a verification badge
//     element (`verification-badge` class)
//   - when a selected date falls inside the plot window, the marker is present
//   - the row/card HTML is a stable deterministic string (same input -> same
//     output across two calls)
//   - isRowVisible mirrors filterDatabaseRows for a single row

import { describe, expect, it } from 'vitest';
import {
  renderDatabaseRow,
  renderDatabaseCard,
  renderTimelineCell,
  renderVerificationBadge,
  isRowVisible,
} from '../../website/src/lib/database-markup.ts';
import type { DatabaseRow } from '../../website/src/lib/database-state.ts';

function row(partial: Partial<DatabaseRow> & Pick<DatabaseRow, 'id' | 'category' | 'name' | 'rate'>): DatabaseRow {
  return {
    ruleId: partial.id,
    validFrom: '2024-01-01',
    validToExclusive: null,
    verification: 'verified_primary',
    conflict: false,
    ...partial,
  } as DatabaseRow;
}

const SAMPLE: DatabaseRow = row({
  id: 'concept-ppn-domestic-supply',
  ruleId: 'rule-ppn-domestic-supply-11pct',
  category: 'ppn',
  name: 'PPN 11%',
  rate: '11%',
  validFrom: '2022-04-01',
  validToExclusive: '2025-01-01',
  verification: 'verified_primary',
});

describe('database markup — desktop row contains rich cells', () => {
  it('contains .timeline-track inside the rendered row', () => {
    const html = renderDatabaseRow({ row: SAMPLE });
    expect(html).toContain('timeline-track');
  });

  it('contains a verification badge element', () => {
    const html = renderDatabaseRow({ row: SAMPLE });
    expect(html).toContain('verification-badge');
    expect(html).toContain('verification-dot');
  });

  it('contains the rate, category pill, detail link, and rule id', () => {
    const html = renderDatabaseRow({ row: SAMPLE, categoryName: 'PPN', categoryColor: '#16A34A' });
    expect(html).toContain('db-category-pill');
    expect(html).toContain('--cat-color:#16A34A');
    expect(html).toContain('href="/tarif/concept-ppn-domestic-supply"');
    expect(html).toContain('rule-ppn-domestic-supply-11pct');
    expect(html).toContain('11%');
  });

  it('emits a marker when the selected date falls inside the plot window', () => {
    const html = renderDatabaseRow({ row: SAMPLE, selectedDate: '2023-06-15' });
    expect(html).toContain('timeline-marker');
  });

  it('omits the marker when the selected date is unset', () => {
    const html = renderDatabaseRow({ row: SAMPLE });
    expect(html).not.toContain('timeline-marker');
  });
});

describe('database markup — mobile card contains rich cells', () => {
  it('contains .timeline-track inside the rendered card', () => {
    const html = renderDatabaseCard({ row: SAMPLE });
    expect(html).toContain('timeline-track');
  });

  it('contains a verification badge element', () => {
    const html = renderDatabaseCard({ row: SAMPLE });
    expect(html).toContain('verification-badge');
  });

  it('uses the stable detail link', () => {
    const html = renderDatabaseCard({ row: SAMPLE, selectedDate: '2024-01-01' });
    expect(html).toContain('href="/tarif/concept-ppn-domestic-supply?date=2024-01-01"');
  });
});

describe('database markup — conflict and verification states', () => {
  it('emits the conflict flag and marker for a conflict row', () => {
    const conflict = { ...SAMPLE, verification: 'source_conflict', conflict: true };
    const html = renderDatabaseRow({ row: conflict });
    expect(html).toContain('verification-conflict-flag');
    expect(html).toContain('verification-conflict-marker');
    expect(html).toContain('⚠');
  });

  it('maps every documented verification status to a labeled badge', () => {
    const statuses = ['verified_primary', 'verified_secondary', 'needs_review', 'source_conflict', 'summary_only'];
    for (const status of statuses) {
      const html = renderVerificationBadge(status);
      expect(html).toContain('verification-badge');
      expect(html).toContain('verification-dot');
    }
  });
});

describe('database markup — determinism', () => {
  it('renders the same HTML across two calls for the same input', () => {
    const a = renderDatabaseRow({ row: SAMPLE, selectedDate: '2023-06-15' });
    const b = renderDatabaseRow({ row: SAMPLE, selectedDate: '2023-06-15' });
    expect(a).toBe(b);
  });

  it('renders the same HTML across two calls for the same card input', () => {
    const a = renderDatabaseCard({ row: SAMPLE });
    const b = renderDatabaseCard({ row: SAMPLE });
    expect(a).toBe(b);
  });

  it('escapes reserved HTML in the row name', () => {
    const risky: DatabaseRow = { ...SAMPLE, name: '<script>alert("x")</script>' };
    const html = renderDatabaseRow({ row: risky });
    expect(html).not.toContain('<script>');
    expect(html).toContain('&lt;script&gt;');
  });
});

describe('database markup — data attributes for client re-evaluation', () => {
  // The client script reads these from dataset.* to re-run isRowVisible
  // without re-embedding the corpus. They must be present and round-trip the
  // raw values.
  it('row carries data-name, data-rate, data-valid-from, data-valid-to-exclusive, data-verification', () => {
    const html = renderDatabaseRow({ row: SAMPLE });
    expect(html).toContain('data-name="PPN 11%"');
    expect(html).toContain('data-rate="11%"');
    expect(html).toContain('data-valid-from="2022-04-01"');
    expect(html).toContain('data-valid-to-exclusive="2025-01-01"');
    expect(html).toContain('data-verification="verified_primary"');
  });

  it('card carries the same data attributes for client re-evaluation', () => {
    const html = renderDatabaseCard({ row: SAMPLE });
    expect(html).toContain('data-name="PPN 11%"');
    expect(html).toContain('data-rate="11%"');
    expect(html).toContain('data-valid-from="2022-04-01"');
    expect(html).toContain('data-verification="verified_primary"');
  });

  it('omits data-valid-to-exclusive value (but keeps the attribute) when null', () => {
    const open: DatabaseRow = { ...SAMPLE, validToExclusive: null };
    const html = renderDatabaseRow({ row: open });
    expect(html).toContain('data-valid-to-exclusive=""');
  });
});

describe('database markup — isRowVisible mirrors filterDatabaseRows', () => {
  it('returns true for an empty state (everything visible by default)', () => {
    expect(isRowVisible(SAMPLE, { q: '', date: '', category: 'all', verification: 'all' })).toBe(true);
  });

  it('matches by category', () => {
    expect(isRowVisible(SAMPLE, { q: '', date: '', category: 'ppn', verification: 'all' })).toBe(true);
    expect(isRowVisible(SAMPLE, { q: '', date: '', category: 'pph-23', verification: 'all' })).toBe(false);
  });

  it('matches by verification status', () => {
    expect(isRowVisible(SAMPLE, { q: '', date: '', category: 'all', verification: 'verified_primary' })).toBe(true);
    expect(isRowVisible(SAMPLE, { q: '', date: '', category: 'all', verification: 'needs_review' })).toBe(false);
  });

  it('matches the conflict bucket', () => {
    const conflict = { ...SAMPLE, conflict: true };
    expect(isRowVisible(conflict, { q: '', date: '', category: 'all', verification: 'conflict' })).toBe(true);
    expect(isRowVisible(SAMPLE, { q: '', date: '', category: 'all', verification: 'conflict' })).toBe(false);
  });

  it('matches by text in name, id, ruleId, category, or rate', () => {
    expect(isRowVisible(SAMPLE, { q: 'ppn', date: '', category: 'all', verification: 'all' })).toBe(true);
    expect(isRowVisible(SAMPLE, { q: 'rule-ppn-domestic-supply-11pct', date: '', category: 'all', verification: 'all' })).toBe(true);
    expect(isRowVisible(SAMPLE, { q: 'cukai', date: '', category: 'all', verification: 'all' })).toBe(false);
  });

  it('matches by exact date inside the half-open interval', () => {
    expect(isRowVisible(SAMPLE, { q: '', date: '2024-06-15', category: 'all', verification: 'all' })).toBe(true);
    expect(isRowVisible(SAMPLE, { q: '', date: '2025-06-15', category: 'all', verification: 'all' })).toBe(false);
  });

  it('matches by year intersecting the half-open interval', () => {
    expect(isRowVisible(SAMPLE, { q: '', date: '2024', category: 'all', verification: 'all' })).toBe(true);
    expect(isRowVisible(SAMPLE, { q: '', date: '2025', category: 'all', verification: 'all' })).toBe(false);
  });
});

describe('database markup — renderTimelineCell', () => {
  it('contains .timeline-track and a .timeline-span', () => {
    const html = renderTimelineCell('2022-04-01', '2025-01-01');
    expect(html).toContain('timeline-track');
    expect(html).toContain('timeline-span');
  });

  it('emits kini when validToExclusive is null', () => {
    const html = renderTimelineCell('2022-04-01', null);
    expect(html).toContain('kini');
  });
});
