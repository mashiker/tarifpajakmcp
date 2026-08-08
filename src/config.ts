// Canonical site configuration. Task 10 unifies the canonical origin into a
// single constant so generators, the Astro site, the OpenAPI documents, and the
// LLM-friendly output all agree byte-for-byte on the published URL. Stale
// vercel.app and placeholder GitHub references are removed.
//
// The canonical origin is the Cloudflare Pages domain. When a custom domain is
// configured, change exactly this one constant and everything downstream
// (sitemap, robots, JSON-LD, llms.txt, OpenAPI servers) follows.

export const CANONICAL_ORIGIN = 'https://tarif-pajak-id.pages.dev';

/**
 * Resolve a site-relative path against the canonical origin. Trims a leading
 * slash from the input so `canonicalUrl('/tarif/x')` and `canonicalUrl('tarif/x')`
 * produce the same value. Empty input returns the bare origin.
 */
export function canonicalUrl(path: string): string {
  if (!path) return CANONICAL_ORIGIN;
  const trimmed = path.startsWith('/') ? path.slice(1) : path;
  return `${CANONICAL_ORIGIN}/${trimmed}`;
}
