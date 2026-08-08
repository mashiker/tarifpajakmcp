// Playwright config for the Tarif Pajak ID website (Task 11 — Browser QA,
// Accessibility, and Final Release Gate).
//
// Tests run against a local preview of the already-built static site. The
// Astro preview server (`astro preview`, exposed via `pnpm --dir website
// preview`) serves the `website/dist` output on port 4321.
//
// Run order:
//   1. `pnpm --dir website build`           — produces dist/
//   2. `pnpm --dir website exec playwright test` — runs E2E against preview
//
// Or, the single convenience entrypoint:
//   `pnpm --dir website test:e2e`            — webServer brings up preview
//
// The webServer block auto-starts `astro preview` and waits for the URL to
// respond, then tears it down when the suite finishes. This means the suite
// is self-contained: no manual preview required.
//
// Browser binaries: install once via `pnpm --dir website exec playwright
// install chromium`. The suite is Chromium-only to keep CI/local runs fast;
// Firefox/WebKit are out of scope for the brief.

import { defineConfig, devices } from '@playwright/test';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

// The website package.json is type: module, so __dirname is not defined. The
// webServer cwd must resolve to this directory regardless of where the CLI
// is invoked from (so `pnpm --dir website test:e2e` works from the repo root).
const HERE = dirname(fileURLToPath(import.meta.url));

const PREVIEW_PORT = 4321;
const BASE_URL = `http://127.0.0.1:${PREVIEW_PORT}`;

export default defineConfig({
  // Sensible defaults for local + CI. Fail fast on a stray alert dialog.
  timeout: 30_000,
  expect: { timeout: 5_000 },
  // Fail the whole run on the first browser-side console error of substance.
  // We do not abort on warnings because the analytics-free static site should
  // be quiet, but pinning to "any error" would couple the suite to fonts/CDN
  // flakes; instead, individual specs assert on critical page text.
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 1 : undefined,

  reporter: [
    ['list'],
    // The HTML report is opt-in; only emit when an env var asks for it so
    // local runs stay quiet.
    ...(process.env.PLAYWRIGHT_HTML ? [['html', { open: 'never' }]] : []),
  ],

  use: {
    baseURL: BASE_URL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    // Reduced-motion + light theme keeps accessibility/mobile assertions
    // deterministic and isolates the test from OS dark-mode preference.
    colorScheme: 'light',
  },

  projects: [
    // Desktop Chromium: the canonical E2E surface. Covers database, detail,
    // and accessibility specs. mobile.spec.ts is excluded here to avoid
    // duplication with the dedicated mobile project below.
    {
      name: 'chromium-desktop',
      testIgnore: /mobile\.spec\.ts/,
      use: {
        ...devices['Desktop Chrome'],
        reducedMotion: 'reduce',
      },
    },
    // Mobile Chromium emulation, used by mobile.spec.ts to assert widths
    // 320/375/768 and the mobile-cards layout.
    //
    // We emulate a mobile Chromium viewport directly rather than using
    // `devices['iPhone 13']` because that preset forces the WebKit browser
    // engine (extra ~150MB browser binary install). The brief scopes the
    // browser surface to Chromium only; viewport + touch + UA emulation gives
    // the same layout assertions without a second browser. The spec sets its
    // own viewport per-test (320/375/768/1280); this project's viewport is
    // just the default before the first setViewportSize call.
    {
      name: 'chromium-mobile-375',
      testMatch: /mobile\.spec\.ts/,
      use: {
        viewport: { width: 375, height: 812 },
        deviceScaleFactor: 3,
        isMobile: true,
        hasTouch: true,
        userAgent:
          'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
        reducedMotion: 'reduce',
      },
    },
  ],

  webServer: {
    // Astro preview serves the static dist/ output. The build must already
    // have run (the SDD `pnpm check` step runs `pnpm build` first). If dist/
    // is missing, the preview server will fail to start and the suite will
    // surface a clear error.
    command: 'astro preview --port 4321 --host 127.0.0.1',
    url: BASE_URL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    cwd: HERE,
  },
});
