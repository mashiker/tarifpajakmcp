// Mobile / responsive spec (Task 11).
//
// Asserts across the widths 320 / 375 / 768 / desktop that:
//   - The page never produces horizontal overflow (no content exceeds the
//     viewport, the most common mobile regression).
//   - On narrow widths, the mobile-cards layout is the visible surface and
//     each card retains category / rate / period / status / detail-link.
//   - On desktop widths, the desktop table is the visible surface.
//   - prefers-reduced-motion: reduce is honoured (the config pins this on the
//     desktop project; here we additionally assert the CSS effect on the
//     detail page where the rule is explicit).
//
// This spec is matched by the dedicated `chromium-mobile-375` project in
// playwright.config.ts, but every test also runs under the desktop project
// because it sets its own viewport per-test. The desktop project runs them
// with the desktop viewport, which is the desired cross-check.

import { expect, test } from '@playwright/test';

const WIDTHS = [
  { label: 'small-320', width: 320, height: 568 },
  { label: 'mobile-375', width: 375, height: 812 },
  { label: 'tablet-768', width: 768, height: 1024 },
  { label: 'desktop-1280', width: 1280, height: 800 },
];

test.describe('responsive — no horizontal page overflow at any width', () => {
  for (const { label, width, height } of WIDTHS) {
    test(`${label}: root page has no horizontal overflow`, async ({ page }) => {
      await page.setViewportSize({ width, height });
      await page.goto('/');
      await page.waitForLoadState('domcontentloaded');
      // The document scroll width must not exceed the viewport width by more
      // than a tiny tolerance (sub-pixel rounding on some fonts).
      const overflow = await page.evaluate(
        (w) => document.documentElement.scrollWidth - w,
        width,
      );
      expect(overflow, `${label}: page must not overflow horizontally`).toBeLessThanOrEqual(1);
    });

    test(`${label}: detail page has no horizontal overflow`, async ({ page }) => {
      await page.setViewportSize({ width, height });
      await page.goto('/tarif/concept-illustrative-flat');
      await page.waitForLoadState('domcontentloaded');
      const overflow = await page.evaluate(
        (w) => document.documentElement.scrollWidth - w,
        width,
      );
      expect(overflow, `${label}: detail page must not overflow horizontally`).toBeLessThanOrEqual(1);
    });
  }
});

test.describe('mobile cards layout — content parity at narrow widths', () => {
  test('at 375px the mobile card layout is the visible surface and retains all fields', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');
    // The mobile cards container is visible; the desktop table is hidden via CSS.
    const mobileList = page.locator('#db-mobile-list');
    await expect(mobileList).toBeVisible();
    // At least one card is rendered.
    const cards = page.locator('#db-mobile-list .db-card');
    const cardCount = await cards.count();
    expect(cardCount, 'mobile cards must render at least one row').toBeGreaterThan(0);
    // The desktop table shell is not the visible surface on mobile widths.
    const desktopShellVisible = await page.locator('.db-desktop-table').evaluate((el) => {
      const cs = window.getComputedStyle(el);
      return cs.display !== 'none' && cs.visibility !== 'hidden';
    });
    expect(desktopShellVisible, 'desktop table must be hidden at 375px').toBe(false);

    // Pick the first visible card and assert it carries the critical fields.
    const firstCard = cards.first();
    // Category is exposed via data-category on the card node.
    const category = await firstCard.evaluate((el) => (el as HTMLElement).dataset.category);
    expect(category, 'card must carry data-category').toBeTruthy();
    // Rate is exposed via data-rate.
    const rate = await firstCard.evaluate((el) => (el as HTMLElement).dataset.rate);
    expect(rate, 'card must carry data-rate').toBeTruthy();
    // Period: data-valid-from must be present.
    const validFrom = await firstCard.evaluate((el) => (el as HTMLElement).dataset.validFrom);
    expect(validFrom, 'card must carry data-valid-from').toBeTruthy();
    // Status: the card surfaces a verification badge.
    await expect(firstCard.locator('[class*="verification-badge"]').first()).toBeVisible();
    // Detail link: the card itself IS the anchor (<a class="db-card">) — see
    // renderDatabaseCard in database-markup.ts. Assert the card carries an
    // href pointing at the detail route.
    const cardHref = await firstCard.evaluate((el) => el.getAttribute('href'));
    expect(cardHref, 'card anchor must point at /tarif/<id>').toMatch(/^\/tarif\//);
    // The card also surfaces an explicit "Lihat detail" affordance text.
    await expect(firstCard.locator('.db-card-detail').first()).toBeVisible();
  });

  test('at 1280px the desktop table is the visible surface', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/');
    const desktopShellVisible = await page.locator('.db-desktop-table').evaluate((el) => {
      const cs = window.getComputedStyle(el);
      return cs.display !== 'none' && cs.visibility !== 'hidden';
    });
    expect(desktopShellVisible, 'desktop table must be visible at 1280px').toBe(true);
    // And the mobile cards container is hidden.
    const mobileVisible = await page.locator('.db-mobile-cards').evaluate((el) => {
      const cs = window.getComputedStyle(el);
      return cs.display !== 'none' && cs.visibility !== 'hidden';
    });
    expect(mobileVisible, 'mobile cards must be hidden at 1280px').toBe(false);
  });

  test('a date filter hides the non-matching card of a multi-rule concept, keeping the matching one (per-rule visibility, Task 11 F2 mobile)', async ({ page }) => {
    // concept-illustrative-flat has two rules with disjoint intervals:
    //   rule-illustrative-flat-old: 2024-01-01 -> 2025-01-01
    //   rule-illustrative-flat-new: 2025-01-01 -> null (open-ended)
    // At date=2024-06-01 only the -old rule's interval contains the date; the
    // -new rule starts in 2025 and must be filtered out. The bug (F2 mobile)
    // paired table rows to cards by concept id, so when any rule of a concept
    // matched, EVERY card for that concept stayed visible — leaking the
    // non-matching rule's card on mobile. This test asserts the per-rule
    // pairing: the -old card is visible, the -new card is hidden.
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/?date=2024-06-01');
    // Wait for the live region to settle so hydration has applied the filter.
    await expect(page.locator('#db-visible-count')).toContainText(/\d/);

    const oldCard = page.locator('#db-mobile-list .db-card[data-rule="rule-illustrative-flat-old"]');
    const newCard = page.locator('#db-mobile-list .db-card[data-rule="rule-illustrative-flat-new"]');
    await expect(oldCard).toHaveCount(1);
    await expect(newCard).toHaveCount(1);

    // The -old card's wrapping <li> must be visible (interval contains 2024-06-01).
    const oldLi = oldCard.locator('xpath=ancestor::li[1]');
    await expect(oldLi).toBeVisible();
    // The -new card's wrapping <li> must be HIDDEN (interval starts 2025-01-01).
    const newLi = newCard.locator('xpath=ancestor::li[1]');
    await expect(newLi).toBeHidden();

    // Cross-check: the desktop table makes the same per-rule decision. This
    // pins the mobile behaviour to the table's so the two surfaces cannot
    // diverge again.
    const oldRowVisible = await page
      .locator('#db-table tbody tr.db-row[data-rule="rule-illustrative-flat-old"]')
      .evaluate((el) => !el.hasAttribute('hidden'));
    const newRowHidden = await page
      .locator('#db-table tbody tr.db-row[data-rule="rule-illustrative-flat-new"]')
      .evaluate((el) => el.hasAttribute('hidden'));
    expect(oldRowVisible, 'table: -old row must be visible at 2024-06-01').toBe(true);
    expect(newRowHidden, 'table: -new row must be hidden at 2024-06-01').toBe(true);
  });
});

test.describe('reduced motion honoured', () => {
  test('detail page CSS respects prefers-reduced-motion (transitions disabled)', async ({ page }) => {
    // The playwright config sets reducedMotion: 'reduce' on the desktop
    // project, which maps to prefers-reduced-motion. Assert the detail page's
    // explicit reduced-motion rule is present and effective: the source-link
    // transition is collapsed under reduced motion.
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/tarif/concept-illustrative-flat');
    // Emulate reduced motion explicitly so the assertion is self-contained
    // (the config also sets it, but this makes the intent explicit).
    await page.emulateMedia({ reducedMotion: 'reduce' });
    const sourceLink = page.locator('.detail-source-link').first();
    await expect(sourceLink).toBeVisible();
    const transition = await sourceLink.evaluate((el) => window.getComputedStyle(el).transition);
    // Under reduced motion, the page CSS sets `transition: none` on the
    // detail-source-link / detail-api-link / detail-back-link / detail-date-input.
    // Chromium may serialize this as `none`, `none 1e-05s`, or similar; any of
    // these means no perceptible animation. Accept "none" plus any sub-1ms
    // duration as the reduced-motion invariant.
    const isEffectivelyNone =
      transition === 'none' ||
      transition === '' ||
      /^none\b/.test(transition) ||
      /\b(0s|0\.0*s|1e-05s|0\.00001s)\b/.test(transition);
    expect(
      isEffectivelyNone,
      `detail-source-link transition must collapse under reduced motion (got "${transition}")`,
    ).toBe(true);
  });

  test('root page does not animate layout under reduced motion', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/');
    // The toolbar input has a transition in its base CSS; under reduced motion
    // it is effectively a no-op. Assert the resolved transition collapses to
    // a non-animating value. Chromium may serialize `transition: none` as
    // `none`, `none 1e-05s`, etc.
    const input = page.locator('#db-input-q');
    await expect(input).toBeVisible();
    const transition = await input.evaluate((el) => window.getComputedStyle(el).transition);
    const isEffectivelyNone =
      transition === 'none' ||
      transition === '' ||
      /^none\b/.test(transition) ||
      /\b(0s|0\.0*s|1e-05s|0\.00001s)\b/.test(transition);
    expect(
      isEffectivelyNone,
      `root input transition must collapse under reduced motion (got "${transition}")`,
    ).toBe(true);
  });
});
