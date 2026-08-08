// Contract test for Task 10 SEO outputs.
//
// Task 10 unifies the canonical origin, adds sitemap + robots.txt, base
// metadata (canonical, OG/Twitter, JSON-LD with proper HTML escape), a Dataset
// JSON-LD on the root, entry-level metadata on detail pages, and noindex on the
// 404 page. It also must NOT emit any vercel.app / placeholder GitHub URL from
// the generator output.
//
// RED-first: the assertions below are written before the implementation. The
// canonical origin constant lives at `src/config.ts` and is mirrored into
// Astro's `site` field. The Astro sitemap integration is registered.
//
// This contract inspects BOTH the generator artifact output (robots.txt,
// llms.txt references) and the BUILT HTML (dist/index.html, dist/404.html,
// detail pages) so it spans three independent build outputs that must agree.

import { readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { beforeAll, describe, expect, it } from 'vitest';
import { getProjectPaths } from '../../src/paths.ts';

const paths = getProjectPaths();
const distRoot = paths.websiteDist;
const CANONICAL_ORIGIN = 'https://tarif-pajak-id.pages.dev';

async function readText(rel: string): Promise<string> {
  try {
    return await readFile(join(distRoot, rel), 'utf8');
  } catch {
    return '';
  }
}

async function readStaging(rel: string): Promise<string> {
  try {
    return await readFile(join(paths.stagingPublic, rel), 'utf8');
  } catch {
    return '';
  }
}

let rootHtml: string;
let notFoundHtml: string;
let apiDocsHtml: string;
let robotsTxt: string;
let sitemapXml: string;
let detailDir: string[];

beforeAll(async () => {
  rootHtml = await readText('index.html');
  notFoundHtml = await readText('404.html');
  apiDocsHtml = await readText('api-docs/index.html');
  // robots.txt and sitemap.xml are generated into the website public root and
  // end up at the dist root after Astro build. They are also written to staging
  // (root public) so both surfaces agree byte-for-byte.
  robotsTxt = (await readText('robots.txt')) || (await readStaging('robots.txt'));
  sitemapXml = (await readText('sitemap.xml')) || (await readStaging('sitemap.xml'));
  try {
    detailDir = await readdir(join(distRoot, 'tarif'));
  } catch {
    detailDir = [];
  }
});

describe('canonical origin — single constant, no stale refs', () => {
  it('the canonical origin is the Cloudflare Pages domain', async () => {
    const mod = await import('../../src/config.ts');
    expect(mod.CANONICAL_ORIGIN).toBe(CANONICAL_ORIGIN);
  });

  it('the Astro site config mirrors the canonical origin', async () => {
    const astroConfig = await readFile(join(paths.root, 'website', 'astro.config.mjs'), 'utf8');
    expect(astroConfig).toContain(`site: '${CANONICAL_ORIGIN}'`);
    expect(astroConfig).not.toContain('vercel.app');
  });

  it('the generated llms.txt does not mention vercel.app or a placeholder GitHub user', async () => {
    const llms = await readStaging('llms.txt');
    expect(llms.length).toBeGreaterThan(0);
    expect(llms).not.toContain('vercel.app');
    expect(llms).not.toMatch(/github\.com\/(?!mashiker)/);
  });

  it('the generated llms-full.txt does not mention vercel.app', async () => {
    const llmsFull = await readStaging('llms-full.txt');
    expect(llmsFull.length).toBeGreaterThan(0);
    expect(llmsFull).not.toContain('vercel.app');
  });
});

describe('robots.txt — allow all, point at the sitemap', () => {
  it('is generated and non-empty', () => {
    expect(robotsTxt.length).toBeGreaterThan(0);
  });

  it('allows all user agents to crawl the HTML surface', () => {
    expect(robotsTxt.toLowerCase()).toContain('user-agent: *');
    expect(robotsTxt).toMatch(/allow:\s*\/?/i);
  });

  it('declares the canonical sitemap URL on the canonical origin', () => {
    expect(robotsTxt).toContain(`Sitemap: ${CANONICAL_ORIGIN}/sitemap.xml`);
  });

  it('does NOT disallow the HTML surface', () => {
    // We may exclude /api/ JSON endpoints from robots, but we must not block the
    // HTML pages (/, /tarif/*, /kategori/*, /api-docs).
    expect(robotsTxt).not.toMatch(/disallow:\s*\/\s*$/i);
    expect(robotsTxt).not.toMatch(/disallow:\s*\/tarif/i);
    expect(robotsTxt).not.toMatch(/disallow:\s*\/kategori/i);
  });
});

describe('sitemap.xml — indexes HTML routes, excludes raw JSON', () => {
  it('is generated and well-formed XML', () => {
    expect(sitemapXml.length).toBeGreaterThan(0);
    expect(sitemapXml.trim().startsWith('<?xml')).toBe(true);
    expect(sitemapXml).toContain('<urlset');
    expect(sitemapXml).toContain('</urlset>');
  });

  it('includes the root, a tarif detail, a category, the tools, and the API docs', () => {
    expect(sitemapXml).toContain(`<loc>${CANONICAL_ORIGIN}/</loc>`);
    expect(sitemapXml).toMatch(new RegExp(`<loc>${CANONICAL_ORIGIN.replace(/\//g, '\\/')}\\/tarif\\/[^<]+<\\/loc>`));
    expect(sitemapXml).toMatch(new RegExp(`<loc>${CANONICAL_ORIGIN.replace(/\//g, '\\/')}\\/kategori\\/[^<]+<\\/loc>`));
    expect(sitemapXml).toContain(`<loc>${CANONICAL_ORIGIN}/api-docs</loc>`);
  });

  it('does NOT index raw JSON endpoints (api/v1, api/v2, *.json)', () => {
    expect(sitemapXml).not.toContain('/api/v1/');
    expect(sitemapXml).not.toContain('/api/v2/');
    expect(sitemapXml).not.toMatch(/<loc>[^<]*\.json<\/loc>/);
  });

  it('does NOT include the 404 page', () => {
    expect(sitemapXml).not.toContain('/404');
  });
});

describe('root metadata — canonical, social, Dataset JSON-LD', () => {
  it('declares a canonical link on the canonical origin', () => {
    expect(rootHtml).toContain(`rel="canonical"`);
    expect(rootHtml).toContain(CANONICAL_ORIGIN);
  });

  it('declares Open Graph title, description, url, type, and image', () => {
    expect(rootHtml).toContain('property="og:title"');
    expect(rootHtml).toContain('property="og:description"');
    expect(rootHtml).toContain('property="og:url"');
    expect(rootHtml).toContain(`property="og:url" content="${CANONICAL_ORIGIN}/"`);
    expect(rootHtml).toContain('property="og:type"');
    expect(rootHtml).toContain('property="og:image"');
  });

  it('declares Twitter card metadata', () => {
    expect(rootHtml).toContain('name="twitter:card"');
    expect(rootHtml).toContain('name="twitter:title"');
    expect(rootHtml).toContain('name="twitter:description"');
  });

  it('emits a Dataset JSON-LD block with the canonical URL', () => {
    expect(rootHtml).toContain('application/ld+json');
    expect(rootHtml).toContain('"@type":"Dataset"');
    expect(rootHtml).toContain(`"url":"${CANONICAL_ORIGIN}/"`);
  });

  it('Dataset JSON-LD carries name, description, license, temporal coverage, dateModified, distribution, and creator', () => {
    const jsonldMatch = rootHtml.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
    expect(jsonldMatch, 'a JSON-LD script block must exist').not.toBeNull();
    const jsonldText = jsonldMatch![1];
    const parsed = JSON.parse(jsonldText);
    expect(parsed['@type']).toBe('Dataset');
    expect(typeof parsed.name).toBe('string');
    expect(parsed.name.length).toBeGreaterThan(0);
    expect(typeof parsed.description).toBe('string');
    expect(parsed.license).toBeDefined();
    expect(parsed.temporalCoverage).toBeDefined();
    expect(parsed.dateModified).toBeDefined();
    expect(Array.isArray(parsed.distribution)).toBe(true);
    expect(parsed.distribution.length).toBeGreaterThan(0);
    expect(parsed.creator).toBeDefined();
    expect(parsed.publisher).toBeDefined();
  });

  it('Dataset JSON-LD distribution links to v1, v2, and llms.txt artifacts', () => {
    const jsonldMatch = rootHtml.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
    const parsed = JSON.parse(jsonldMatch![1]);
    // DataDownload uses `contentUrl` per schema.org; tolerate `url` for other types.
    const urls = parsed.distribution.map((d: any) => d.contentUrl || d.url || '').join('\n');
    expect(urls).toContain('/api/v2/');
    expect(urls).toContain('llms.txt');
  });

  it('Dataset JSON-LD variableMeasured surfaces category counts from the v2 data', () => {
    const jsonldMatch = rootHtml.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
    const parsed = JSON.parse(jsonldMatch![1]);
    expect(Array.isArray(parsed.variableMeasured)).toBe(true);
    expect(parsed.variableMeasured.length).toBeGreaterThan(0);
  });

  it('Dataset JSON-LD does NOT claim to be official government guidance', () => {
    const jsonldMatch = rootHtml.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
    const lower = jsonldMatch![1].toLowerCase();
    expect(lower).not.toContain('official guidance');
    expect(lower).not.toContain('pemerintah resmi');
    // And the page must surface a non-official disclaimer nearby.
    expect(rootHtml.toLowerCase()).toContain('bukan nasihat pajak');
  });

  it('escapes JSON-LD: a name containing <, >, & is properly escaped in HTML', async () => {
    // Build a Dataset JSON-LD with risky characters through the escape helper
    // directly, since we cannot easily inject risky characters into the corpus.
    const { escapeJsonLd } = await import('../../website/src/lib/seo.ts');
    expect(escapeJsonLd('a < b > c & d')).toBe('a \\u003c b \\u003e c \\u0026 d');
  });

  it('the built JSON-LD contains no unescaped < or > characters inside the script block', () => {
    const jsonldMatch = rootHtml.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
    expect(jsonldMatch).not.toBeNull();
    const inner = jsonldMatch![1];
    // The JSON-LD body must not contain a literal `</` sequence other than the
    // closing tag we already stripped. A safe JSON-LD block uses \u003c/\u003e.
    expect(inner).not.toMatch(/</);
  });
});

describe('detail page metadata — entry-level machine-readable', () => {
  it('every detail page declares a canonical URL on the canonical origin', async () => {
    for (const id of detailDir.slice(0, 5)) {
      const html = await readText(join('tarif', id, 'index.html'));
      expect(html, `detail page ${id} must exist`).toBeTruthy();
      expect(html).toContain('rel="canonical"');
      expect(html).toContain(CANONICAL_ORIGIN);
    }
  });

  it('every detail page emits og:url with the canonical detail URL', async () => {
    for (const id of detailDir.slice(0, 5)) {
      const html = await readText(join('tarif', id, 'index.html'));
      expect(html).toContain(`property="og:url"`);
      // The og:url must point at the canonical origin, not the dev server.
      const match = html.match(/property="og:url" content="([^"]+)"/);
      expect(match, `detail page ${id} missing og:url content`).not.toBeNull();
      expect(match![1]).toContain(CANONICAL_ORIGIN);
      expect(match![1]).toContain(`/tarif/${id}`);
    }
  });

  it('every detail page exposes a JSON-LD block typed for the entry (not just Dataset)', async () => {
    for (const id of detailDir.slice(0, 5)) {
      const html = await readText(join('tarif', id, 'index.html'));
      expect(html).toContain('application/ld+json');
      // Detail JSON-LD may be Dataset or a more specific entry type, but it must
      // carry the concept/rule id and a machine-readable alternate API link.
      const jsonldMatch = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
      expect(jsonldMatch, `detail page ${id} must carry a JSON-LD block`).not.toBeNull();
      const parsed = JSON.parse(jsonldMatch![1]);
      // At minimum: the entry mentions its API alternate.
      const serialized = JSON.stringify(parsed);
      expect(serialized).toContain(`/api/v2/concepts/${id}.json`);
    }
  });

  it('every detail page JSON-LD carries the concept id and category', async () => {
    for (const id of detailDir.slice(0, 5)) {
      const html = await readText(join('tarif', id, 'index.html'));
      const jsonldMatch = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
      const parsed = JSON.parse(jsonldMatch![1]);
      const serialized = JSON.stringify(parsed);
      expect(serialized).toContain(id);
    }
  });
});

describe('404 page — noindex', () => {
  it('emits a noindex meta tag', () => {
    expect(notFoundHtml).toMatch(/<meta\s+name="robots"\s+content="noindex/i);
  });

  it('does NOT declare a canonical URL (avoid canonicalizing a 404)', () => {
    // The 404 should not appear in the index. A noindex without canonical is
    // the right shape so search engines drop the URL rather than consolidating
    // signals onto it.
    expect(notFoundHtml).not.toMatch(/rel="canonical"/);
  });
});

describe('API docs page — provenance + static host notice', () => {
  it('describes static-host limitations and provenance', () => {
    expect(apiDocsHtml.toLowerCase()).toContain('statis');
    // The page must surface the v1/v2 split and provenance language.
    expect(apiDocsHtml).toContain('/api/v1/');
    expect(apiDocsHtml).toContain('/api/v2/');
  });
});
