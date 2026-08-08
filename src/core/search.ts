// Pure search normalization and inverted-index builder for the v2 model.
// Deterministic: tokenization, sort order, and scoring are all functions of
// the input data alone. No I/O, no system clock.

import type { Category, Concept, Source, TaxRule, V2Data } from './types.ts';

const TOKEN_SPLIT = /[^a-z0-9]+/;

/** Lowercase, strip diacritics, collapse non-alphanumeric runs to spaces, trim. */
export function normalizeSearchText(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

/**
 * Tokenize a string into deterministic, lowercase, alphanumeric tokens. Single
 * characters and pure punctuation are dropped. Diacritics are stripped.
 */
export function tokenize(value: string): string[] {
  const normalized = normalizeSearchText(value);
  if (normalized === '') return [];
  return normalized
    .split(TOKEN_SPLIT)
    .filter((token) => token.length >= 2);
}

export interface SearchEntry {
  id: string;
  score: number;
  tokens: string[];
}

export interface SearchIndex {
  /** Number of indexed rules. */
  entryCount: number;
  /** Stable id -> sorted unique tokens derived from the rule + concept/category. */
  entries: Record<string, string[]>;
  /** Stable token -> sorted list of rule ids that contain it. */
  keywords: Record<string, string[]>;
}

function uniqueSorted(values: string[]): string[] {
  return [...new Set(values)].sort();
}

/**
 * Build a deterministic inverted index over the v2 ruleset. A rule's tokens
 * come from its id, concept name, category name/slug, and any notes. The index
 * is sorted at every level so two fixed-epoch builds produce byte-identical JSON.
 */
export function buildSearchIndex(data: V2Data): SearchIndex {
  const rules: TaxRule[] = data.rules ?? [];
  const concepts = indexBy((data.concepts ?? []) as Concept[], (c) => c.id);
  const categories = indexBy((data.categories ?? []) as Category[], (c) => c.id);
  const sources = indexBy((data.sources ?? []) as Source[], (s) => s.id);
  void sources;

  const entries: Record<string, string[]> = {};
  const keywords: Record<string, string[]> = {};

  for (const rule of rules) {
    const tokens = new Set<string>();
    const addText = (text: string) => tokenize(text).forEach((token) => tokens.add(token));

    addText(rule.id);
    if (rule.notes) addText(rule.notes);
    const concept = concepts.get(rule.conceptId);
    if (concept) {
      addText(concept.name);
      if (concept.slug) addText(concept.slug);
      if (concept.description) addText(concept.description);
    }
    if (rule.categoryId) {
      const category = categories.get(rule.categoryId);
      if (category) {
        addText(category.name);
        addText(category.slug);
        if (category.description) addText(category.description);
      }
    }
    for (const example of rule.examples ?? []) {
      if (example.label) addText(example.label);
    }

    const sortedTokens = [...tokens].sort();
    entries[rule.id] = sortedTokens;
    for (const token of sortedTokens) {
      if (!keywords[token]) keywords[token] = [];
      keywords[token].push(rule.id);
    }
  }

  // Sort keyword posting lists and the keyword map itself.
  const sortedKeywords: Record<string, string[]> = {};
  for (const token of Object.keys(keywords).sort()) {
    sortedKeywords[token] = uniqueSorted(keywords[token]);
  }

  return {
    entryCount: rules.length,
    entries,
    keywords: sortedKeywords,
  };
}

export interface SearchHit {
  id: string;
  score: number;
}

/**
 * Query the index. Tokens are OR-ed: any rule that contains at least one query
 * token is a candidate. Score is the number of distinct query tokens the rule
 * contains, so rules matching more of the query rank first. Ties break by id.
 * An empty query returns every rule with score 0 in id order. No rule appears
 * twice.
 */
export function searchRules(index: SearchIndex, query: string): SearchHit[] {
  const tokens = tokenize(query);
  if (tokens.length === 0) {
    return Object.keys(index.entries)
      .sort()
      .map((id) => ({ id, score: 0 }));
  }

  // Union posting lists across query tokens. Each candidate is scored by how
  // many of the query tokens it actually contains.
  const candidateSet = new Set<string>();
  for (const token of tokens) {
    for (const id of index.keywords[token] ?? []) candidateSet.add(id);
  }

  return [...candidateSet]
    .map((id) => {
      const ruleTokens = new Set(index.entries[id]);
      const score = tokens.reduce((sum, token) => sum + (ruleTokens.has(token) ? 1 : 0), 0);
      return { id, score };
    })
    .sort((a, b) => b.score - a.score || a.id.localeCompare(b.id));
}

function indexBy<T>(items: T[], keyOf: (item: T) => string): Map<string, T> {
  const map = new Map<string, T>();
  for (const item of items) map.set(keyOf(item), item);
  return map;
}
