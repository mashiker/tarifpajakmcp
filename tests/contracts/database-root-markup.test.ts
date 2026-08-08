// Static markup contract for the root database page (Task 8 review C1).
//
// The review found that the client re-render destroyed the server-rendered
// timeline signature and verification badges. The fix factors a shared
// template and switches the client to toggle `hidden` instead of rebuilding.
//
// This contract inspects the BUILT root HTML (dist/index.html) to assert that
// every server-rendered row still contains the rich cells. Since Vitest cannot
// run a browser, this is the closest reliable check: it proves the server
// output is rich, and the shared-template contract test
// (database-markup.test.ts) proves the client would render the same rich
// markup if it ever needed to rebuild.
//
// We additionally assert there is NO `max-height`/`calc(100vh` vertical clamp
// on the database table, and that the result-count live region is present.

import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { beforeAll, describe, expect, it } from 'vitest';
import { getProjectPaths } from '../../src/paths.ts';

const paths = getProjectPaths();
const distRoot = join(paths.websiteDist);

let html: string;
let cssText: string;

async function readBuilt(): Promise<string> {
  try {
    return await readFile(join(distRoot, 'index.html'), 'utf8');
  } catch {
    return '';
  }
}

async function readCss(): Promise<string> {
  // Concatenate all generated CSS so the contract can assert on compiled
  // rules that live in the linked stylesheet rather than inline HTML.
  try {
    const fs = await import('node:fs/promises');
    const dir = join(distRoot, '_astro');
    const files = await fs.readdir(dir);
    const cssFiles = files.filter((f) => f.endsWith('.css'));
    const chunks = await Promise.all(
      cssFiles.map((f) => readFile(join(dir, f), 'utf8').catch(() => '')),
    );
    return chunks.join('\n');
  } catch {
    return '';
  }
}

async function readJs(): Promise<string> {
  // Concatenate all bundled JS so the contract can assert on the processed
  // (Vite-bundled) module that the root page ships. Task 11 moved the
  // database hydration logic out of `is:inline` (which broke under static
  // hosting because of dev-only `/src/lib/*.ts` dynamic imports) into a
  // processed `<script>` that Vite emits to /_astro/*.js. The sticky-offset
  // logic now lives there, so the contract reads the bundled JS to assert
  // on it — same invariant, new (correct) location.
  try {
    const fs = await import('node:fs/promises');
    const dir = join(distRoot, '_astro');
    const files = await fs.readdir(dir);
    const jsFiles = files.filter((f) => f.endsWith('.js'));
    const chunks = await Promise.all(
      jsFiles.map((f) => readFile(join(dir, f), 'utf8').catch(() => '')),
    );
    return chunks.join('\n');
  } catch {
    return '';
  }
}

let jsText: string;

describe('database root static markup contract (Task 8 C1)', () => {
  beforeAll(async () => {
    html = await readBuilt();
    cssText = await readCss();
    jsText = await readJs();
  });

  it('the built root HTML exists (run `pnpm build` first)', () => {
    expect(html.length, 'dist/index.html must exist and be non-empty').toBeGreaterThan(0);
  });

  it('every result row contains a .timeline-track element (timeline signature preserved)', () => {
    const tableRows = (html.match(/<tr class="db-row"/g) || []).length;
    const cardRows = (html.match(/class="db-card"/g) || []).length;
    const tracks = (html.match(/timeline-track/g) || []).length;
    expect(tableRows).toBeGreaterThan(0);
    // Desktop table + mobile cards each render one timeline per row.
    expect(tracks).toBe(tableRows + cardRows);
  });

  it('every result row contains a verification badge element', () => {
    const tableRows = (html.match(/<tr class="db-row"/g) || []).length;
    const cardRows = (html.match(/class="db-card"/g) || []).length;
    const badges = (html.match(/class="verification-badge/g) || []).length;
    expect(badges).toBe(tableRows + cardRows);
  });

  it('every result row carries the data-* attributes the client needs for re-filtering', () => {
    // Count row-scoped attributes only: data-name appears on rows/cards, not
    // on toolbar chips. data-verification also appears on chip buttons, so we
    // scope by counting only those inside a row/card context.
    const rowCount = (html.match(/<tr class="db-row"/g) || []).length + (html.match(/class="db-card"/g) || []).length;
    const dataNames = (html.match(/data-name="/g) || []).length;
    const dataRates = (html.match(/data-rate="/g) || []).length;
    const dataValidFrom = (html.match(/data-valid-from="/g) || []).length;
    expect(dataNames).toBe(rowCount);
    expect(dataRates).toBe(rowCount);
    expect(dataValidFrom).toBe(rowCount);
    // data-verification is also on the toolbar chips; assert per-row presence
    // by checking the row-scoped pattern (data-verification immediately
    // following data-conflict, which only rows/cards carry).
    const rowScopedVerification = (html.match(/data-conflict="(?:true|false)"\s+data-name="[^"]*"\s+data-rate="[^"]*"\s+data-valid-from="[^"]*"\s+data-valid-to-exclusive="[^"]*"\s+data-verification="[^"]*"/g) || []).length;
    expect(rowScopedVerification).toBe(rowCount);
  });

  it('the database table has no vertical max-height or calc(100vh) clamp', () => {
    // The inline HTML must not carry the old max-height:calc(100vh - ...)
    // style attribute on the table shell. (Horizontal overflow-x is allowed.)
    expect(html).not.toMatch(/max-height:\s*calc\(100vh/);
    expect(html).not.toMatch(/style="[^"]*max-height[^"]*calc\(100vh/);
  });

  it('the result-count live region is present with correct aria semantics', () => {
    expect(html).toContain('role="status"');
    expect(html).toContain('aria-live="polite"');
    expect(html).toContain('aria-atomic="true"');
  });

  it('the /database canonicalization redirect is present', async () => {
    const dbHtml = await readFile(join(distRoot, 'database', 'index.html'), 'utf8').catch(() => '');
    expect(dbHtml.length).toBeGreaterThan(0);
    expect(dbHtml).toContain('rel="canonical"');
    expect(dbHtml).toContain('http-equiv="refresh"');
    expect(dbHtml).toContain('location.replace');
  });

  it('the sticky table-header offset is derived from the toolbar height, not a too-small hardcoded value (Task 8 I1)', () => {
    // The CSS fallback must be tall enough to clear the sticky toolbar at its
    // full multi-row height. The old fallback was 7.5rem; the real toolbar
    // (search row + date/category/sort row + status chips + verification chips
    // + actions row) is ~13rem. The fallback is the floor; the JS overrides
    // it on load via --db-th-top from getBoundingClientRect.
    //
    // The fallback lives in the compiled CSS (`var(--db-th-top, 13rem)`),
    // not the inline HTML.
    const haystack = cssText || html;
    expect(haystack).toContain('--db-th-top');
    const fallbackMatch = haystack.match(/--db-th-top[^,)]*,\s*([\d.]+)rem/);
    expect(fallbackMatch, 'a rem fallback for --db-th-top must exist in compiled CSS').not.toBeNull();
    const fallbackRem = Number(fallbackMatch![1]);
    expect(fallbackRem).toBeGreaterThanOrEqual(12);

    // The hydration JS must call getBoundingClientRect and set --db-th-top
    // dynamically so the offset tracks the real toolbar height on load/resize.
    // Task 11 moved this logic from an `is:inline` block (which broke under
    // static hosting) into the Vite-bundled module under /_astro/*.js. The
    // contract reads the bundled JS to assert the same invariant. We assert
    // on the two tokens that survive minification and carry the meaning: the
    // browser API call and the CSS custom property name. (The local function
    // name `syncStickyOffset` is minified and is an implementation detail.)
    expect(jsText.length, 'bundled JS under /_astro must exist and be non-empty').toBeGreaterThan(0);
    expect(jsText).toContain('getBoundingClientRect');
    expect(jsText).toContain('--db-th-top');
  });
});
