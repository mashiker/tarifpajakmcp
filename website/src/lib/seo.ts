// SEO helpers for the Astro pages (Task 10).
//
// Two responsibilities:
//   1. escapeJsonLd — safely inline a JSON-LD object into HTML. The JSON spec
//      would already escape most characters, but `<`, `>`, and `&` MUST be
//      emitted as their \u003c / \u003e / \u0026 escape sequences so the JSON-LD
//      payload cannot prematurely close the surrounding <script> tag or break
//      HTML parsers (Google's structured data guidelines require this).
//   2. entry-level metadata helpers — given a concept id, its name, its
//      category, and its temporal coverage, build a canonical URL, og:url, and
//      a JSON-LD object for the detail page.
//
// The canonical origin is exported from here so every Astro page imports ONE
// constant instead of repeating the literal string. The mirror lives in
// `src/config.ts` (for the generator pipeline) and `astro.config.mjs` (for
// Astro's `site` field); this is the website-side import target.

export const CANONICAL_ORIGIN = 'https://tarif-pajak-id.pages.dev';

interface EntryMetadataInput {
  conceptId: string;
  conceptName: string;
  categoryId?: string;
  categorySlug?: string;
  categoryName?: string;
  validFrom?: string;
  validToExclusive?: string | null;
  apiUrl: string;
  origin: string;
  description?: string;
}

/**
 * Escape a string for safe inline JSON-LD inside a <script type="application/ld+json">
 * block. Replaces `<`, `>`, and `&` with their \u escape sequences so the
 * payload cannot close the script tag or break HTML parsing. This is applied to
 * the whole JSON string after JSON.stringify.
 */
export function escapeJsonLd(value: string): string {
  return value
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026');
}

/**
 * Serialize a JSON-LD object with HTML-safe escaping. The result is safe to
 * inline inside a <script type="application/ld+json">…</script> block.
 */
export function serializeJsonLd(value: unknown): string {
  return escapeJsonLd(JSON.stringify(value));
}

/**
 * Build the canonical detail URL for a concept id on the canonical origin.
 */
export function detailCanonicalUrl(origin: string, conceptId: string): string {
  return `${origin}/tarif/${conceptId}`;
}

/**
 * Build entry-level metadata for a detail page: canonical URL, og:url, and a
 * JSON-LD object describing the entry. The JSON-LD is typed as Dataset (we are
 * describing a slice of the dataset), with a `subjectOf` pointer to the page
 * and an `isBasedOn` link to the API document so a machine reader can fetch the
 * canonical data.
 */
export function buildEntryMetadata(input: EntryMetadataInput): {
  canonicalUrl: string;
  ogUrl: string;
  jsonLd: Record<string, unknown>;
  jsonLdHtml: string;
} {
  const canonicalUrl = detailCanonicalUrl(input.origin, input.conceptId);
  const ogUrl = canonicalUrl;

  const intervalLabel = formatInterval(input.validFrom, input.validToExclusive);

  const jsonLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    name: input.conceptName,
    description:
      input.description ??
      `Detail tarif ${input.conceptName}: dasar hukum, interval berlaku, status historis, sumber primer, dan BPPU.`,
    url: canonicalUrl,
    isPartOf: {
      '@type': 'Dataset',
      name: 'Tarif Pajak ID — Database Tarif Pajak Indonesia',
      url: `${input.origin}/`,
    },
    subjectOf: {
      '@type': 'WebPage',
      url: canonicalUrl,
    },
    isBasedOn: {
      '@type': 'DataDownload',
      encodingFormat: 'application/json',
      contentUrl: input.apiUrl,
    },
    identifier: input.conceptId,
    temporalCoverage: intervalLabel ?? undefined,
    inLanguage: 'id-ID',
  };
  if (input.categorySlug) {
    jsonLd.about = {
      '@type': 'Thing',
      name: input.categoryName ?? input.categorySlug,
      url: `${input.origin}/kategori/${input.categorySlug}`,
    };
  }

  return {
    canonicalUrl,
    ogUrl,
    jsonLd,
    jsonLdHtml: serializeJsonLd(jsonLd),
  };
}

function formatInterval(validFrom?: string, validToExclusive?: string | null): string | null {
  if (!validFrom) return null;
  const to = validToExclusive ?? null;
  if (!to) return `${validFrom}/..`;
  return `${validFrom}/${to}`;
}
