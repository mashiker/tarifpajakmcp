// API v2 generator. Emits the temporal model as static JSON documents the
// website can serve and resolve client-side. Outputs are deterministic: every
// list and map is sorted so two fixed-epoch builds produce byte-identical JSON.
//
// Generated documents:
//   api/v2/index.json            - release metadata + typed endpoint map
//   api/v2/rules/index.json      - rule summaries
//   api/v2/rules/{id}.json       - rule detail
//   api/v2/concepts/index.json   - concept summaries
//   api/v2/concepts/{id}.json    - concept detail
//   api/v2/categories/index.json - category summaries
//   api/v2/sources/index.json    - source summaries
//   api/v2/bppu/index.json       - versioned BPPU codes
//   api/v2/by-year/index.json    - year index
//   api/v2/by-year/{year}.json   - year segments (clipped half-open intervals)
//   api/v2/at-date/index.json    - selected exact-date fixture index
//   api/v2/at-date/{date}.json   - selected exact-date resolution fixture
//   api/v2/rules-corpus.json     - serialized rules corpus for client resolver
//   api/v2/search-index.json     - deterministic inverted index
//   api/v2/openapi.json          - valid OpenAPI 3.0.3

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import type { ReleaseContext } from '../core/release.ts';
import type { BppuCode, Category, Concept, Conflict, Source, TaxRule, V2Data } from '../core/types.ts';
import { containsDate, isValidInterval, overlaps, yearSegments } from '../core/date.ts';
import { resolveAtDate, resolveForYear } from '../core/resolver.ts';
import { buildSearchIndex } from '../core/search.ts';
import { buildV2OpenApi } from './openapi.ts';

const VERSION = 'v2';

interface GenerateV2Options {
  stagingPublic: string;
  /** Directory containing the v2 source data (data/v2). */
  v2DataDirectory: string;
  release: ReleaseContext;
}

function writeJsonSorted(path: string, value: unknown): void {
  // Deterministic serialization: 2-space indent, sorted top-level keys are the
  // responsibility of the caller; JSON.stringify preserves insertion order.
  writeFileSync(path, JSON.stringify(value, null, 2) + '\n');
}

function ensureDir(dir: string): void {
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
}

function readJsonArray<T>(file: string): T[] {
  try {
    const content = readFileSync(file, 'utf-8');
    const parsed = JSON.parse(content);
    return Array.isArray(parsed) ? (parsed as T[]) : [];
  } catch {
    return [];
  }
}

function envelope<T>(data: T, release: ReleaseContext) {
  return {
    api: 'tarif-pajak-id',
    version: VERSION,
    release: {
      generatedAt: release.generatedAt,
      sourceDateEpoch: release.sourceDateEpoch,
      sourceHash: release.sourceHash,
      gitCommit: release.gitCommit,
      version: release.version,
    },
    data,
  };
}

/**
 * Generate the v2 temporal API surface. Returns the count of files written.
 * Pure with respect to inputs: same source data + same release -> same bytes.
 */
export function generateApiV2(options: GenerateV2Options): number {
  const { stagingPublic, v2DataDirectory, release } = options;
  const out = join(stagingPublic, 'api', 'v2');
  ensureDir(out);

  const categories = readJsonArray<Category>(join(v2DataDirectory, 'categories.json'));
  const concepts = readJsonArray<Concept>(join(v2DataDirectory, 'concepts.json'));
  const sources = readJsonArray<Source>(join(v2DataDirectory, 'sources.json'));
  const rules = readJsonArray<TaxRule>(join(v2DataDirectory, 'rules.json'));
  const conflicts = readJsonArray<Conflict>(join(v2DataDirectory, 'conflicts.json'));
  const bppu = readJsonArray<BppuCode>(join(v2DataDirectory, 'bppu.json'));
  const data: V2Data = { sources, categories, concepts, rules, conflicts, bppu };

  let fileCount = 0;

  // index.json — release metadata + typed endpoint map. Top-level keys sorted.
  const indexDoc = sortKeys({
    api: 'tarif-pajak-id',
    version: VERSION,
    release: {
      generatedAt: release.generatedAt,
      sourceDateEpoch: release.sourceDateEpoch,
      sourceHash: release.sourceHash,
      gitCommit: release.gitCommit,
      version: release.version,
    },
    stats: {
      rules: rules.length,
      concepts: concepts.length,
      categories: categories.length,
      sources: sources.length,
      conflicts: conflicts.length,
      bppu: bppu.length,
    },
    endpoints: {
      rules: '/api/v2/rules',
      concepts: '/api/v2/concepts',
      categories: '/api/v2/categories',
      sources: '/api/v2/sources',
      bppu: '/api/v2/bppu',
      byYear: '/api/v2/by-year',
      atDate: '/api/v2/at-date',
      rulesCorpus: '/api/v2/rules-corpus.json',
      search: '/api/v2/search-index.json',
      openapi: '/api/v2/openapi.json',
    },
  });
  writeJsonSorted(join(out, 'index.json'), indexDoc);
  fileCount++;

  // rules index + details
  const rulesDir = join(out, 'rules');
  ensureDir(rulesDir);
  const ruleSummaries = rules
    .slice()
    .sort((a, b) => a.id.localeCompare(b.id))
    .map((rule) => ({
      id: rule.id,
      conceptId: rule.conceptId,
      categoryId: rule.categoryId,
      validFrom: rule.validFrom,
      validToExclusive: rule.validToExclusive,
      verification: rule.verification?.status,
      bppuId: rule.bppuId,
      exclusiveGroup: rule.exclusiveGroup,
    }));
  writeJsonSorted(join(rulesDir, 'index.json'), envelope({ count: ruleSummaries.length, rules: ruleSummaries }, release));
  fileCount++;
  for (const rule of rules) {
    const concept = concepts.find((c) => c.id === rule.conceptId);
    const category = rule.categoryId ? categories.find((c) => c.id === rule.categoryId) : undefined;
    const ruleConflicts = conflicts.filter((c) => c.ruleIds.includes(rule.id));
    const detail = envelope({
      id: rule.id,
      conceptId: rule.conceptId,
      conceptName: concept?.name,
      categoryId: rule.categoryId,
      categoryName: category?.name,
      validFrom: rule.validFrom,
      validToExclusive: rule.validToExclusive,
      rate: rule.rate,
      conditions: rule.conditions,
      verification: rule.verification,
      exclusiveGroup: rule.exclusiveGroup,
      supersedes: (rule.supersedes ?? []).slice().sort(),
      supersededBy: (rule.supersededBy ?? []).slice().sort(),
      bppuId: rule.bppuId,
      examples: rule.examples,
      notes: rule.notes,
      conflicts: ruleConflicts.map((c) => c.id).sort(),
    }, release);
    writeJsonSorted(join(rulesDir, `${rule.id}.json`), detail);
    fileCount++;
  }

  // concepts index + details
  const conceptsDir = join(out, 'concepts');
  ensureDir(conceptsDir);
  const conceptSummaries = concepts
    .slice()
    .sort((a, b) => a.id.localeCompare(b.id))
    .map((concept) => ({
      id: concept.id,
      categoryId: concept.categoryId,
      name: concept.name,
      slug: concept.slug,
      ruleCount: rules.filter((r) => r.conceptId === concept.id).length,
    }));
  writeJsonSorted(join(conceptsDir, 'index.json'), envelope({ count: conceptSummaries.length, concepts: conceptSummaries }, release));
  fileCount++;
  for (const concept of concepts) {
    const detail = envelope({
      id: concept.id,
      categoryId: concept.categoryId,
      name: concept.name,
      slug: concept.slug,
      description: concept.description,
      ruleIds: rules.filter((r) => r.conceptId === concept.id).map((r) => r.id).sort(),
    }, release);
    writeJsonSorted(join(conceptsDir, `${concept.id}.json`), detail);
    fileCount++;
  }

  // categories index
  const categoriesDir = join(out, 'categories');
  ensureDir(categoriesDir);
  const categorySummaries = categories
    .slice()
    .sort((a, b) => a.id.localeCompare(b.id))
    .map((category) => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description,
      conceptCount: concepts.filter((c) => c.categoryId === category.id).length,
    }));
  writeJsonSorted(join(categoriesDir, 'index.json'), envelope({ count: categorySummaries.length, categories: categorySummaries }, release));
  fileCount++;

  // sources index
  const sourcesDir = join(out, 'sources');
  ensureDir(sourcesDir);
  const sourceSummaries = sources
    .slice()
    .sort((a, b) => a.id.localeCompare(b.id))
    .map((source) => ({
      id: source.id,
      name: source.name,
      official: source.official,
      role: source.role,
      regulationId: source.regulationId,
      url: source.url,
    }));
  writeJsonSorted(join(sourcesDir, 'index.json'), envelope({ count: sourceSummaries.length, sources: sourceSummaries }, release));
  fileCount++;

  // bppu index — versioned codes
  const bppuDir = join(out, 'bppu');
  ensureDir(bppuDir);
  const bppuCodes = bppu
    .slice()
    .sort((a, b) => a.code.localeCompare(b.code))
    .map((code) => ({
      id: code.id,
      code: code.code,
      label: code.label,
      validFrom: code.validFrom,
      validToExclusive: code.validToExclusive,
      ruleIds: rules.filter((r) => r.bppuId === code.id).map((r) => r.id).sort(),
    }));
  writeJsonSorted(join(bppuDir, 'index.json'), envelope({ count: bppuCodes.length, codes: bppuCodes }, release));
  fileCount++;

  // by-year index + year documents
  const byYearDir = join(out, 'by-year');
  ensureDir(byYearDir);
  const years = computeYears(rules);
  const yearIndex = years.map((year) => {
    const result = resolveForYear(data, year);
    return {
      year,
      determination: result.determination,
      segmentCount: result.segments.length,
      ruleCount: result.ruleIds.length,
      conflicts: result.conflicts,
    };
  });
  writeJsonSorted(join(byYearDir, 'index.json'), envelope({ count: yearIndex.length, years: yearIndex }, release));
  fileCount++;
  for (const year of years) {
    const result = resolveForYear(data, year);
    const segments = result.segments.map((segment) => ({
      interval: segment.interval,
      ruleIds: segment.ruleIds,
      transition: segment.transition,
    }));
    writeJsonSorted(join(byYearDir, `${year}.json`), envelope({
      year,
      determination: result.determination,
      segments,
      ruleIds: result.ruleIds,
      conflicts: result.conflicts,
      gap: result.gap,
    }, release));
    fileCount++;
  }

  // at-date index + selected exact-date fixtures
  const atDateDir = join(out, 'at-date');
  ensureDir(atDateDir);
  const selectedDates = selectExactDateFixtures(rules);
  writeJsonSorted(join(atDateDir, 'index.json'), envelope({
    count: selectedDates.length,
    dates: selectedDates.map((date) => ({ date })),
  }, release));
  fileCount++;
  for (const date of selectedDates) {
    const result = resolveAtDate(data, { date });
    writeJsonSorted(join(atDateDir, `${date}.json`), envelope({
      date,
      determination: result.determination,
      candidates: result.candidates.map((c) => ({
        ruleId: c.rule.id,
        conditionState: c.conditionState,
        missingFacts: c.missingFacts,
        defeats: c.defeats,
      })),
      considered: result.considered.map((c) => ({ ruleId: c.rule.id, conditionState: c.conditionState })),
      conflicts: result.conflicts,
      warnings: result.warnings,
      gap: result.gap,
    }, release));
    fileCount++;
  }

  // rules corpus for client-side resolver
  const corpus = envelope({
    rules: rules.slice().sort((a, b) => a.id.localeCompare(b.id)),
    concepts: concepts.slice().sort((a, b) => a.id.localeCompare(b.id)),
    categories: categories.slice().sort((a, b) => a.id.localeCompare(b.id)),
    conflicts: conflicts.slice().sort((a, b) => a.id.localeCompare(b.id)),
  }, release);
  writeJsonSorted(join(out, 'rules-corpus.json'), corpus);
  fileCount++;

  // search index (v2)
  const searchIndex = buildSearchIndex(data);
  writeJsonSorted(join(out, 'search-index.json'), sortKeys({
    api: 'tarif-pajak-id',
    version: VERSION,
    generated: release.generatedAt,
    entryCount: searchIndex.entryCount,
    entries: sortRecord(searchIndex.entries),
    keywords: searchIndex.keywords,
  }));
  fileCount++;

  // openapi (v2)
  writeJsonSorted(join(out, 'openapi.json'), buildV2OpenApi());
  fileCount++;

  return fileCount;
}

/** Compute the sorted set of years spanned by the rule intervals. */
function computeYears(rules: TaxRule[]): number[] {
  const years = new Set<number>();
  for (const rule of rules) {
    if (!isValidInterval(rule)) continue;
    const startYear = Number(rule.validFrom.slice(0, 4));
    years.add(startYear);
    if (rule.validToExclusive) {
      // Exclusive end means the last fully-covered year is endYear - 1.
      const endYear = Number(rule.validToExclusive.slice(0, 4)) - 1;
      if (endYear >= startYear) years.add(endYear);
    }
  }
  return [...years].sort((a, b) => a - b);
}

/**
 * Select a deterministic, small set of exact-date fixtures that exercise rule
 * starts, transitions, and the open-ended present. These power the static
 * at-date endpoint so the website can demo resolution without a server.
 */
function selectExactDateFixtures(rules: TaxRule[]): string[] {
  const dates = new Set<string>();
  for (const rule of rules.slice().sort((a, b) => a.id.localeCompare(b.id))) {
    if (!isValidInterval(rule)) continue;
    dates.add(rule.validFrom);
    if (rule.validToExclusive) dates.add(rule.validToExclusive);
  }
  return [...dates].sort().slice(0, 12);
}

function sortKeys<T extends Record<string, unknown>>(value: T): T {
  const entries = Object.entries(value).sort(([a], [b]) => a.localeCompare(b));
  const result: Record<string, unknown> = {};
  for (const [key, val] of entries) {
    result[key] = val && typeof val === 'object' && !Array.isArray(val) ? sortKeys(val as Record<string, unknown>) : val;
  }
  return result as T;
}

function sortRecord<T>(value: Record<string, T>): Record<string, T> {
  const result: Record<string, T> = {};
  for (const key of Object.keys(value).sort()) result[key] = value[key];
  return result;
}

// Re-exported for the year-segment contract test and any future caller.
export { yearSegments, overlaps, containsDate };
