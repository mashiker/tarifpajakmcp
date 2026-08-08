// Accessibility spec using @axe-core/playwright (Task 11).
//
// Asserts that the critical user-facing pages have no serious or critical
// axe-core violations:
//   - `/`                  root database
//   - `/tarif/<concept>`   detail page (with relations + sources)
//   - `/ter-pph-21`        TER tool page
//   - `/kode-objek-pajak`  BPPU page
//   - `/api-docs`          API documentation page
//
// "Moderate" and "minor" violations are surfaced in the test output but do
// not fail the gate, matching the brief's "no serious/critical" bar. This
// keeps the gate stable against cosmetic axe noise while still blocking the
// classes of issues that block real users (contrast, name, role, landmarks).
//
// Requires a real browser. The static-markup contracts cover landmark/aria
// presence as a fallback.

import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

// A concept with a rich detail page (timeline + sources + relations).
const DETAIL_CONCEPT = 'concept-illustrative-flat';

// Pages that must clear the axe serious/critical bar.
const PAGES: Array<{ name: string; path: string }> = [
  { name: 'root database', path: '/' },
  { name: 'detail page', path: `/tarif/${DETAIL_CONCEPT}` },
  { name: 'TER PPh 21 page', path: '/ter-pph-21' },
  { name: 'BPPU / kode objek pajak page', path: '/kode-objek-pajak' },
  { name: 'API docs page', path: '/api-docs' },
];

// The set of impact levels that fail the gate. Serious + critical. Moderate
// and minor are reported but tolerated so the gate stays focused on
// user-blocking issues.
const BLOCKING_IMPACT = new Set(['serious', 'critical']);

test.describe('axe-core accessibility gate', () => {
  for (const { name, path } of PAGES) {
    test(`${name} (${path}) has no serious/critical axe violations`, async ({ page }) => {
      await page.goto(path);
      // Wait for the main landmark + content to settle so axe analyses the
      // hydrated DOM, not a half-painted shell.
      await page.waitForLoadState('domcontentloaded');
      // The root has an h1; detail pages have one too. Either way, wait for
      // any h1 so the page is past its initial paint.
      await expect(page.getByRole('heading', { level: 1 }).first()).toBeVisible();

      const results = await new AxeBuilder({ page })
        // Restrict to WCAG 2.1 AA + best-practice. Tag-based scoping keeps
        // the gate aligned with the design spec's WCAG AA target.
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze();

      const blocking = results.violations.filter((v) => BLOCKING_IMPACT.has(v.impact ?? ''));
      if (blocking.length > 0) {
        // Format a readable summary so the failure message names the rules.
        const summary = blocking
          .map((v) => `${v.id} (${v.impact}): ${v.help} — ${v.description}`)
          .join('\n  - ');
        throw new Error(
          `${name} (${path}) has ${blocking.length} serious/critical axe violation(s):\n  - ${summary}`,
        );
      }
      // Soft-assert: moderate + minor violations do not fail, but are logged
      // for visibility. This keeps the gate meaningful without churning on
      // cosmetic axe noise.
      const soft = results.violations.filter((v) => !BLOCKING_IMPACT.has(v.impact ?? ''));
      if (soft.length > 0) {
        test.info().annotations.push({
          type: 'axe-soft-violations',
          description: `${soft.length} moderate/minor violation(s) on ${path}: ${soft.map((v) => v.id).join(', ')}`,
        });
      }
      // Explicit pass so the test name is recorded even when there are zero
      // violations of any kind.
      expect(blocking.length, `${name} must have no serious/critical violations`).toBe(0);
    });
  }

  test('root database chips and toolbar are keyboard reachable and labelled', async ({ page }) => {
    // A targeted a11y check beyond axe: the filter chips are real buttons with
    // aria-pressed, and the toolbar form has role=search.
    await page.goto('/');
    const form = page.locator('#db-toolbar');
    await expect(form).toHaveAttribute('role', 'search');
    // Status chips expose aria-pressed reflecting active state.
    const statusChips = page.locator('[data-status]');
    expect(await statusChips.count()).toBeGreaterThan(0);
    for (let i = 0; i < (await statusChips.count()); i++) {
      await expect(statusChips.nth(i)).toHaveAttribute('aria-pressed', /(true|false)/);
    }
    // The search input is labelled (via <label for>).
    await expect(page.locator('label[for="db-input-q"]')).toBeVisible();
    await expect(page.locator('#db-input-q')).toHaveAttribute('id', 'db-input-q');
  });

  test('detail page date input is labelled and the status live region is polite', async ({ page }) => {
    await page.goto(`/tarif/${DETAIL_CONCEPT}`);
    await expect(page.locator('label[for="detail-date-input"]')).toBeVisible();
    const hint = page.locator('#detail-date-hint');
    await expect(hint).toHaveAttribute('aria-live', 'polite');
    await expect(hint).toHaveAttribute('aria-atomic', 'true');
  });
});
