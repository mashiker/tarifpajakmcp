// SEO metadata generator (Task 10).
//
// Emits the site-wide SEO artifacts that must agree with the canonical origin:
//   - robots.txt — allow HTML surface, point at the sitemap.
//   - sitemap.xml — index HTML routes (root, tarif detail, kategori, tools,
//     api-docs), exclude raw JSON endpoints and the 404 page.
//   - dataset-jsonld.json — the Dataset JSON-LD document embedded on the root
//     page (also embeddable inline; this artifact lets the contract test assert
//     on the canonical shape and lets the page import it directly).
//
// All output is derived from the v2 corpus + Astro's static route list, so the
// sitemap never indexes a route that does not exist and never omits one that
// does. Pure: same input -> same output (no Date.now(), no random).

import type { ReleaseContext } from '../core/release.ts';
import { CANONICAL_ORIGIN } from '../config.ts';

interface CorpusConcept {
  id: string;
  slug?: string;
}
interface CorpusCategory {
  id: string;
  slug: string;
  name: string;
  description?: string;
}
interface CorpusRule {
  id: string;
  conceptId: string;
  validFrom: string;
  validToExclusive: string | null;
  categoryId?: string;
  verification?: { status: string };
}
interface RulesCorpus {
  data: {
    rules: CorpusRule[];
    concepts: CorpusConcept[];
    categories: CorpusCategory[];
  };
  release?: { generatedAt?: string };
}

interface GenerateMetadataOptions {
  data: RulesCorpus;
  release: ReleaseContext;
  origin?: string;
  /** Static HTML routes the Astro build emits (excluding dynamic ones). */
  staticRoutes?: string[];
}

export interface MetadataArtifacts {
  robotsTxt: string;
  sitemapXml: string;
  datasetJsonLd: string;
  /** All sitemap URL paths (without origin) for inspection. */
  sitemapPaths: string[];
}

/** Default static HTML routes (no dynamic params). */
export const DEFAULT_STATIC_HTML_ROUTES = [
  '/',
  '/api-docs',
  '/ter-pph-21',
  '/kode-objek-pajak',
];

/** Routes that must NOT appear in the sitemap even if they are HTML. */
const EXCLUDED_FROM_SITEMAP = new Set<string>(['/404']);

function xmlEscape(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function siteUrl(origin: string, path: string): string {
  if (!path) return origin;
  const trimmed = path.startsWith('/') ? path : `/${path}`;
  return `${origin}${trimmed}`;
}

/**
 * Compose the full set of sitemap URL paths from the corpus + static routes.
 * Deterministic: paths are sorted. Dynamic routes (/tarif/{id}, /kategori/{slug})
 * are derived from the corpus so a stale concept/category cannot survive in the
 * sitemap after a data change.
 */
export function composeSitemapPaths(data: RulesCorpus, staticRoutes: string[]): string[] {
  const conceptIds = new Set<string>();
  for (const rule of data.data.rules) conceptIds.add(rule.conceptId);
  const conceptPaths = [...conceptIds]
    .sort()
    .map((id) => `/tarif/${id}`);

  const categorySlugs = data.data.categories.map((c) => c.slug).sort();
  const categoryPaths = categorySlugs.map((slug) => `/kategori/${slug}`);

  const all = [...new Set([...staticRoutes, ...conceptPaths, ...categoryPaths])]
    .filter((p) => !EXCLUDED_FROM_SITEMAP.has(p))
    .sort();
  return all;
}

/**
 * Build the robots.txt content. Allow all user agents to crawl the HTML surface,
 * point at the canonical sitemap. We do NOT disallow /api/ JSON endpoints from
 * robots (they are open data), but we DO exclude them from the sitemap so search
 * engines index the HTML experience, not raw JSON.
 */
export function renderRobotsTxt(origin: string = CANONICAL_ORIGIN): string {
  return [
    '# Tarif Pajak ID — robots.txt',
    '# Allow all user agents to crawl the HTML surface.',
    'User-agent: *',
    'Allow: /',
    '',
    `Sitemap: ${origin}/sitemap.xml`,
  ].join('\n') + '\n';
}

/**
 * Build the sitemap.xml content from the corpus + static routes. Excludes raw
 * JSON endpoints (no /api/v1/, /api/v2/, or *.json paths) and the 404 page.
 */
export function renderSitemapXml(paths: string[], origin: string = CANONICAL_ORIGIN): string {
  const urls = paths
    .filter((p) => !p.includes('/api/v1/') && !p.includes('/api/v2/'))
    .filter((p) => !p.endsWith('.json'))
    .filter((p) => !EXCLUDED_FROM_SITEMAP.has(p))
    .map((p) => `  <url><loc>${xmlEscape(siteUrl(origin, p))}</loc></url>`)
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

interface DatasetSummary {
  ruleCount: number;
  conceptCount: number;
  categoryCount: number;
  verifiedPrimaryCount: number;
  verifiedSecondaryCount: number;
  needsReviewCount: number;
  sourceConflictCount: number;
  summaryOnlyCount: number;
  conflictCount: number;
  temporalCoverage: string | null;
}

function summarizeForDataset(data: RulesCorpus): DatasetSummary {
  const rules = data.data.rules;
  const starts = rules.map((r) => r.validFrom).sort();
  const finiteEnds = rules
    .flatMap((r) => (r.validToExclusive ? [r.validToExclusive] : []))
    .sort();
  const hasOpen = rules.some((r) => !r.validToExclusive);
  let temporalCoverage: string | null = null;
  if (starts.length > 0) {
    const from = starts[0];
    const to = hasOpen ? '..' : (finiteEnds.at(-1) ?? starts.at(-1)!);
    temporalCoverage = `${from}/${to}`;
  }
  return {
    ruleCount: rules.length,
    conceptCount: data.data.concepts.length,
    categoryCount: data.data.categories.length,
    verifiedPrimaryCount: rules.filter((r) => r.verification?.status === 'verified_primary').length,
    verifiedSecondaryCount: rules.filter((r) => r.verification?.status === 'verified_secondary').length,
    needsReviewCount: rules.filter((r) => r.verification?.status === 'needs_review').length,
    sourceConflictCount: rules.filter((r) => r.verification?.status === 'source_conflict').length,
    summaryOnlyCount: rules.filter((r) => r.verification?.status === 'summary_only').length,
    conflictCount: 0, // not in corpus.data for this minimal view; computed by caller if needed
    temporalCoverage,
  };
}

/**
 * Build the Dataset JSON-LD document for the root page. Serializes to a
 * canonical JSON string with sorted keys so two fixed-epoch builds agree.
 */
export function renderDatasetJsonLd(
  data: RulesCorpus,
  release: ReleaseContext,
  origin: string = CANONICAL_ORIGIN,
): string {
  const summary = summarizeForDataset(data);
  const dateModified = release.generatedAt.split('T')[0];

  // variableMeasured: per-category rule counts (a useful "what's in this
  // dataset" summary) plus per-verification-status counts.
  const categoryCounts: Record<string, number> = {};
  const conceptById = new Map(data.data.concepts.map((c) => [c.id, c]));
  const categoryById = new Map(data.data.categories.map((c) => [c.id, c]));
  for (const rule of data.data.rules) {
    const concept = conceptById.get(rule.conceptId);
    const category = rule.categoryId ? categoryById.get(rule.categoryId) : undefined;
    const slug = category?.slug ?? concept?.slug ?? rule.conceptId;
    categoryCounts[slug] = (categoryCounts[slug] ?? 0) + 1;
  }
  const variableMeasured = [
    {
      name: 'rules per category',
      value: Object.entries(categoryCounts)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([slug, count]) => ({ category: slug, ruleCount: count })),
    },
    {
      name: 'verification coverage',
      value: {
        verified_primary: summary.verifiedPrimaryCount,
        verified_secondary: summary.verifiedSecondaryCount,
        needs_review: summary.needsReviewCount,
        source_conflict: summary.sourceConflictCount,
        summary_only: summary.summaryOnlyCount,
      },
    },
  ];

  // Distribution: link the machine-readable artifacts. Includes v1, v2, and
  // llms.txt so an LLM/crawler can self-route.
  const distribution = [
    {
      '@type': 'DataDownload',
      name: 'v2 rules corpus',
      encodingFormat: 'application/json',
      contentUrl: `${origin}/api/v2/rules-corpus.json`,
      url: `${origin}/api/v2/rules-corpus.json`,
    },
    {
      '@type': 'DataDownload',
      name: 'v2 API index',
      encodingFormat: 'application/json',
      contentUrl: `${origin}/api/v2/index.json`,
      url: `${origin}/api/v2/index.json`,
    },
    {
      '@type': 'DataDownload',
      name: 'v1 aggregate API',
      encodingFormat: 'application/json',
      contentUrl: `${origin}/api/v1/index.json`,
      url: `${origin}/api/v1/index.json`,
    },
    {
      '@type': 'DataDownload',
      name: 'LLM orientation (llms.txt)',
      encodingFormat: 'text/plain',
      contentUrl: `${origin}/llms.txt`,
      url: `${origin}/llms.txt`,
    },
    {
      '@type': 'DataDownload',
      name: 'LLM reference (llms-full.txt)',
      encodingFormat: 'text/plain',
      contentUrl: `${origin}/llms-full.txt`,
      url: `${origin}/llms-full.txt`,
    },
    {
      '@type': 'DataDownload',
      name: 'OpenAPI v2',
      encodingFormat: 'application/json',
      contentUrl: `${origin}/api/v2/openapi.json`,
      url: `${origin}/api/v2/openapi.json`,
    },
  ];

  const dataset = {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    name: 'Tarif Pajak ID — Database Tarif Pajak Indonesia',
    description:
      'Database referensi tarif pajak Indonesia (PPh, PPN, PPh Final/UMKM, dan sebagainya) yang bersumber dari regulasi resmi Republik Indonesia. Setiap aturan memiliki interval berlaku, kondisi penerapan, dasar hukum primer, dan status verifikasi. Bukan nasihat pajak resmi; bukan panduan pemerintah.',
    url: `${origin}/`,
    license: 'https://creativecommons.org/licenses/by-sa/4.0/',
    isAccessibleForFree: true,
    keywords: ['pajak', 'tax', 'Indonesia', 'PPh', 'PPN', 'tarif', 'BPPU', 'perpajakan'],
    creator: {
      '@type': 'Organization',
      name: 'Tarif Pajak ID',
      url: origin,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Tarif Pajak ID',
      url: origin,
    },
    dateModified,
    datePublished: '2024-01-01',
    temporalCoverage: summary.temporalCoverage ?? undefined,
    inLanguage: 'id-ID',
    distribution,
    variableMeasured,
    provenance: {
      '@type': 'CreativeWork',
      name: 'Provenance summary',
      description:
        'Data bersumber dari regulasi resmi Republik Indonesia (UU, PP, PMK, Perpres, Kep) yang dikumpulkan dari JDIH BPK, DJP/Kemenkeu, dan peraturan.go.id. Setiap aturan mencatat sumber primer, locator klaim, dan status verifikasi. Konflik sumber dideklarasikan, bukan dipilih diam-diam.',
    },
  };

  // Serialize with sorted keys for byte-stable output.
  return `${JSON.stringify(sortKeys(dataset), null, 2)}\n`;
}

/**
 * Generate the SEO metadata artifacts (robots.txt, sitemap.xml, dataset JSON-LD).
 * Pure with respect to inputs: same corpus + release -> same bytes.
 */
export function generateMetadataArtifacts(options: GenerateMetadataOptions): MetadataArtifacts {
  const { data, release, origin = CANONICAL_ORIGIN, staticRoutes = DEFAULT_STATIC_HTML_ROUTES } = options;
  const sitemapPaths = composeSitemapPaths(data, staticRoutes);
  return {
    robotsTxt: renderRobotsTxt(origin),
    sitemapXml: renderSitemapXml(sitemapPaths, origin),
    datasetJsonLd: renderDatasetJsonLd(data, release, origin),
    sitemapPaths,
  };
}

function sortKeys<T extends Record<string, unknown>>(value: T): T {
  const entries = Object.entries(value).sort(([a], [b]) => a.localeCompare(b));
  const result: Record<string, unknown> = {};
  for (const [key, val] of entries) {
    if (val && typeof val === 'object' && !Array.isArray(val)) {
      result[key] = sortKeys(val as Record<string, unknown>);
    } else if (Array.isArray(val)) {
      result[key] = val.map((item) =>
        item && typeof item === 'object' && !Array.isArray(item)
          ? sortKeys(item as Record<string, unknown>)
          : item,
      );
    } else {
      result[key] = val;
    }
  }
  return result as T;
}
