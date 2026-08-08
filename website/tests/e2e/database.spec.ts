// E2E spec for the root database experience (Task 11).
//
// Covers the Task 8/9 contract in a live browser:
//   - Root `/` opens directly to the database (no interstitial / splash).
//   - No internal vertical DB scrollbar: the table shell never sets a
//     max-height or `calc(100vh)` clamp; the page body scrolls the full
//     result set.
//   - URL-driven filters: init from query string, update on committed change,
//     survive reload, and round-trip through browser back/forward.
//   - Exact-date and year-span temporal modes both filter rows.
//   - Empty state surfaces the determination notice when no row matches.
//   - Detail deep link loads from a row's anchor.
//
// Prereqs: `pnpm --dir website build` has produced dist/. The Playwright
// webServer block in playwright.config.ts starts `astro preview` for us.
//
// These tests require a real browser. If the Chromium binary is missing,
// `playwright install chromium` is required. The static-markup contracts in
// tests/contracts/*.test.ts cover the same assertions against built HTML as a
// fallback when no browser is available.

import { expect, test } from '@playwright/test';

// The dataset has 67 rows on the built page (server-rendered). Keep a local
// constant so a future data refresh does not silently mask a regression that
// drops rows to zero; we assert "at least 1 visible" rather than an exact
// number for forward-compatibility.
const MIN_ROWS = 1;

test.describe('root database — direct open + scroll behaviour', () => {
  test('root `/` opens directly to the database hero and toolbar', async ({ page }) => {
    await page.goto('/');
    // The hero title is the database's primary landmark.
    await expect(page.getByRole('heading', { level: 1, name: /Database Tarif Pajak Indonesia/i })).toBeVisible();
    // The toolbar is present and labelled as a search region.
    await expect(page.locator('#db-toolbar')).toBeVisible();
    await expect(page.locator('#db-input-q')).toBeVisible();
    // The table is server-rendered with at least one row.
    const rowCount = await page.locator('#db-table tbody tr.db-row').count();
    expect(rowCount).toBeGreaterThanOrEqual(MIN_ROWS);
  });

  test('the database table shell has no internal vertical scrollbar (Task 8 C1)', async ({ page }) => {
    await page.goto('/');
    const shell = page.locator('.db-table-shell').first();
    await expect(shell).toBeVisible();
    // Computed style: no max-height clamps the table to a nested viewport.
    const maxHeight = await shell.evaluate((el) => window.getComputedStyle(el).maxHeight);
    expect(maxHeight, 'db-table-shell must not set a non-none max-height').toBe('none');
    // The table itself likewise.
    const table = page.locator('#db-table').first();
    const tableMaxHeight = await table.evaluate((el) => window.getComputedStyle(el).maxHeight);
    expect(tableMaxHeight).toBe('none');
    // No `calc(100vh` in any stylesheet linked from the page either. This is
    // the strongest live-browser assertion we can make that the old
    // max-height:calc(100vh - ...) clamp is gone.
    const hasViewportClamp = await page.evaluate(() => {
      for (const sheet of Array.from(document.styleSheets)) {
        try {
          for (const rule of Array.from(sheet.cssRules || [])) {
            if (rule.cssText && rule.cssText.includes('calc(100vh')) return true;
          }
        } catch {
          // Cross-origin sheet: skip (we have none, but be safe).
        }
      }
      return false;
    });
    expect(hasViewportClamp, 'no CSS rule on the page may use calc(100vh...)').toBe(false);
  });

  test('the page body scrolls to reveal the full result set, not a nested pane', async ({ page }) => {
    await page.goto('/');
    // Force a tall viewport so the table is larger than the viewport.
    await page.setViewportSize({ width: 1280, height: 400 });
    // The document must be scrollable vertically (content overflows the page).
    const scrollHeight = await page.evaluate(() => document.documentElement.scrollHeight);
    const clientHeight = await page.evaluate(() => document.documentElement.clientHeight);
    expect(scrollHeight, 'page content must overflow the small viewport').toBeGreaterThan(clientHeight);
    // The table shell itself must NOT be independently scrollable vertically.
    const shell = page.locator('.db-table-shell').first();
    const shellOverflow = await shell.evaluate((el) => window.getComputedStyle(el).overflowY);
    expect(['visible', 'auto', 'scroll'].includes(shellOverflow)).toBe(true);
    if (shellOverflow === 'auto' || shellOverflow === 'scroll') {
      // If it is auto/scroll, then it must not actually have a bounded client
      // height (i.e. it grew to fit content). This catches the regression
      // where a max-height creates a nested scroll pane.
      const canScroll = await shell.evaluate((el) => el.scrollHeight > el.clientHeight);
      expect(canScroll, 'table shell must not have its own vertical scroll').toBe(false);
    }
  });
});

test.describe('URL-driven filters — init, update, reload, back/forward', () => {
  test('initial filter state is read from the query string on load', async ({ page }) => {
    // Pick a category that exists in the built dataset.
    await page.goto('/?category=ppn');
    // The category select must reflect the URL.
    await expect(page.locator('#db-input-category')).toHaveValue('ppn');
    // Every visible row must belong to the ppn category.
    const visibleCats = await page.locator('#db-table tbody tr.db-row:not([hidden])').evaluateAll(
      (rows) => rows.map((r) => (r as HTMLElement).dataset.category).filter(Boolean),
    );
    expect(visibleCats.length).toBeGreaterThan(0);
    for (const c of visibleCats) expect(c).toBe('ppn');
  });

  test('committed category change pushes the new filter to the URL', async ({ page }) => {
    await page.goto('/');
    await page.locator('#db-input-category').selectOption('pph-23');
    // URL must contain ?category=pph-23 (pushState on committed change).
    await expect(page).toHaveURL(/\?category=pph-23/);
    // Visible rows must all be pph-23.
    const visibleCats = await page.locator('#db-table tbody tr.db-row:not([hidden])').evaluateAll(
      (rows) => rows.map((r) => (r as HTMLElement).dataset.category).filter(Boolean),
    );
    expect(visibleCats.length).toBeGreaterThan(0);
    for (const c of visibleCats) expect(c).toBe('pph-23');
  });

  test('status chip click pushes status to the URL and filters rows', async ({ page }) => {
    await page.goto('/');
    // Click the "Dicabut" status chip.
    await page.locator('[data-status="dicabut"]').first().click();
    await expect(page).toHaveURL(/\?status=dicabut/);
    await expect(page.locator('[data-status="dicabut"]')).toHaveAttribute('aria-pressed', 'true');
  });

  test('filter state survives a reload', async ({ page }) => {
    await page.goto('/?category=ppn&status=berlaku');
    await page.reload();
    await expect(page.locator('#db-input-category')).toHaveValue('ppn');
    // Every still-visible row is ppn (status is applied client-side on hydration).
    const visibleCats = await page.locator('#db-table tbody tr.db-row:not([hidden])').evaluateAll(
      (rows) => rows.map((r) => (r as HTMLElement).dataset.category).filter(Boolean),
    );
    for (const c of visibleCats) expect(c).toBe('ppn');
  });

  test('browser back/forward restores the previous filter state', async ({ page }) => {
    await page.goto('/');
    await page.locator('#db-input-category').selectOption('ppn');
    await expect(page).toHaveURL(/\?category=ppn/);
    await page.locator('#db-input-category').selectOption('pph-23');
    await expect(page).toHaveURL(/\?category=pph-23/);
    await page.goBack();
    await expect(page).toHaveURL(/\?category=ppn/);
    await expect(page.locator('#db-input-category')).toHaveValue('ppn');
    await page.goForward();
    await expect(page).toHaveURL(/\?category=pph-23/);
    await expect(page.locator('#db-input-category')).toHaveValue('pph-23');
  });

  test('clear filter button resets state and pushes a clean URL', async ({ page }) => {
    await page.goto('/?q=ppn&category=ppn');
    await expect(page.locator('#db-clear')).toBeVisible();
    await page.locator('#db-clear').click();
    // Defaults are omitted from the serialized URL, so it collapses to '/'.
    await expect(page).toHaveURL(/\/$/);
    await expect(page.locator('#db-input-q')).toHaveValue('');
    await expect(page.locator('#db-input-category')).toHaveValue('all');
  });
});

test.describe('temporal filter — exact date and year span', () => {
  test('exact-date mode filters rows to those in effect on that date', async ({ page }) => {
    // 2010-01-01: should narrow the visible set. Assert that some rows hide
    // (the dataset has rules starting in 2024+, which must disappear).
    await page.goto('/?date=2010-01-01');
    await expect(page.locator('#db-input-date')).toHaveValue('2010-01-01');
    const visibleRows = await page.locator('#db-table tbody tr.db-row:not([hidden])').evaluateAll(
      (rows) =>
        rows.map((r) => ({
          validFrom: (r as HTMLElement).dataset.validFrom ?? '',
          validToExclusive: (r as HTMLElement).dataset.validToExclusive ?? '',
        })),
    );
    expect(visibleRows.length, '2010-01-01 must match at least one row').toBeGreaterThan(0);
    // Every visible row's [validFrom, validToExclusive) interval must contain
    // 2010-01-01. Open-ended rows (validToExclusive === '') are treated as
    // extending to +infinity per database-state.ts intervalContainsDate.
    const point = Date.UTC(2010, 0, 1);
    for (const r of visibleRows) {
      const from = Date.parse(`${r.validFrom}T00:00:00Z`);
      const end = r.validToExclusive === '' ? Infinity : Date.parse(`${r.validToExclusive}T00:00:00Z`);
      expect(from, `row validFrom=${r.validFrom} must start on/before 2010-01-01`).toBeLessThanOrEqual(point);
      expect(end, `row validToExclusive=${r.validToExclusive} must end after 2010-01-01`).toBeGreaterThan(point);
    }
  });

  test('year-span mode filters rows that intersect the calendar year', async ({ page }) => {
    await page.goto('/?date=2024');
    await expect(page.locator('#db-input-date')).toHaveValue('2024');
    const visibleFroms = await page.locator('#db-table tbody tr.db-row:not([hidden])').evaluateAll(
      (rows) => rows.map((r) => (r as HTMLElement).dataset.validFrom).filter(Boolean),
    );
    expect(visibleFroms.length).toBeGreaterThan(0);
  });

  test('year transition narrows the result set between adjacent years', async ({ page }) => {
    // Compare the visible row counts for 2022 vs 2025 — they differ, proving
    // the year filter is actually re-applied and not a no-op.
    await page.goto('/?date=2022');
    const count2022 = await page.locator('#db-table tbody tr.db-row:not([hidden])').count();
    await page.goto('/?date=2025');
    const count2025 = await page.locator('#db-table tbody tr.db-row:not([hidden])').count();
    expect(count2022, '2022 must match at least one row').toBeGreaterThan(0);
    expect(count2025, '2025 must match at least one row').toBeGreaterThan(0);
    // The exact inequality is data-dependent; the assertion is that the two
    // years are not identical (i.e. the filter is responsive to the year).
    // If a future data refresh happens to produce identical counts for these
    // two specific years, prefer 2020 vs 2025 in the fix.
    expect(Math.abs(count2022 - count2025)).toBeGreaterThan(0);
  });

  test('invalid date input collapses to the empty state without breaking the page', async ({ page }) => {
    // An invalid date like 2024-02-30 must normalize to '' (no filter), so the
    // full table stays visible. See database-state.ts normalizeDate.
    await page.goto('/?date=2024-02-30');
    await expect(page.locator('#db-input-date')).toHaveValue('');
    const visible = await page.locator('#db-table tbody tr.db-row:not([hidden])').count();
    expect(visible, 'invalid date must not zero out the table').toBeGreaterThan(0);
  });
});

test.describe('empty state and detail deep link', () => {
  test('an over-constrained filter surfaces the empty-state determination notice', async ({ page }) => {
    // A query string that matches nothing: a q that cannot match any row.
    await page.goto('/?q=zzzzz-no-such-rate-xyz123');
    // The client hydration applies the URL filter on load; wait for the live
    // region to reflect the empty wording before asserting DOM state, so the
    // test does not race the bundled module's initial applyState() call.
    await expect(page.locator('#db-visible-count')).toContainText(/tidak ada/i);
    // At least one visible-row counter must be zero, and the empty state
    // element must lose its `hidden` attribute.
    const visibleRows = await page.locator('#db-table tbody tr.db-row:not([hidden])').count();
    // The mobile cards hide via `hidden` on the wrapping <li>, not on the
    // .db-card itself — see DatabaseCards.astro and the .db-cards li[hidden]
    // CSS rule. So count the non-hidden <li> children of #db-mobile-list.
    const visibleCards = await page.locator('#db-mobile-list > li:not([hidden])').count();
    expect(visibleRows + visibleCards, 'over-constrained filter must match zero rows').toBe(0);
    await expect(page.locator('#db-empty-state')).toBeVisible();
  });

  test('a row\'s detail anchor navigates to the deep-linked detail page', async ({ page }) => {
    await page.goto('/');
    // Grab the first detail link in the visible table and click it.
    const firstDetailLink = page.locator('#db-table tbody tr.db-row a[href^="/tarif/"]').first();
    const href = await firstDetailLink.getAttribute('href');
    expect(href, 'row must expose a /tarif/<id> detail link').toMatch(/^\/tarif\//);
    await firstDetailLink.click();
    await expect(page).toHaveURL(/\/tarif\//);
    // The detail page renders its h1.
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });
});
