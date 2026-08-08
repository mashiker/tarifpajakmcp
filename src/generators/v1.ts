// API v1 generator. Produces the legacy static JSON surface that existing
// consumers depend on. This module is the single source of truth for v1 output;
// the temporal v2 model is additive and never rewrites v1 IDs, paths, or shapes.
//
// The generation logic is preserved verbatim from the pre-redesign build so the
// v1 contract (entry IDs, category slugs, documented endpoints, BPPU prefixes,
// timeline groups, calculator data, consolidated laws) stays byte-stable.

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import type { ReleaseContext } from '../core/release.ts';
import { deriveTemporalBounds } from '../core/release.ts';
import { CANONICAL_ORIGIN } from './openapi.ts';

const VERSION = 'v1';

function loadApi(path: string): any {
  return JSON.parse(readFileSync(path, 'utf-8'));
}

function envelop(data: any, generatedAt: string) {
  return { api: 'tarif-pajak-id', version: VERSION, generated: generatedAt, data };
}

function writeJson(path: string, data: any): void {
  writeFileSync(path, JSON.stringify(data, null, 2) + '\n');
}

function ensureDir(dir: string): void {
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
}

function slugify(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function rateStr(rate: any): string {
  if (rate.type === 'percentage') return `${rate.value}%`;
  if (rate.type === 'range') return `${rate.value[0]}%–${rate.value[1]}%`;
  if (rate.type === 'progressive') return 'Progresif';
  return String(rate.value);
}

type Entry = any;

export interface GenerateApiV1Options {
  /** Staging public directory that already contains the aggregate `api.json`. */
  stagingPublic: string;
  release: ReleaseContext;
  /**
   * Canonical v2 rules used to PROJECT the calculator data instead of
   * hard-coding it. When supplied, the PPN calculator is derived from the
   * verified_primary PPN rules in data/v2/rules.json so the two surfaces
   * cannot drift. Optional for backward compatibility with tests that build
   * only the v1 surface.
   */
  v2Rules?: readonly TaxRuleV2[];
}

/**
 * Minimal v2 TaxRule shape this generator needs to project the PPN calculator.
 * Kept inline so the v1 generator does not import the v2 types module and the
 * v1 surface remains self-contained.
 */
interface TaxRuleV2 {
  id: string;
  conceptId: string;
  categoryId?: string;
  validFrom: string;
  validToExclusive: string | null;
  rate?:
    | { type: 'percentage'; value: string }
    | { type: 'information_factor'; factor: string }
    | { type: 'formula'; expression: string }
    | { type: 'zero' }
    | { type: string };
  verification?: {
    status: string;
    sourceIds: string[];
    evidence?: { claim: string; sourceId: string; locator: string }[];
  };
  notes?: string;
}

/**
 * Generate the entire API v1 static surface into
 * `{stagingPublic}/api/v1/`. Reads the aggregate `api.json` produced earlier in
 * the pipeline. Returns the number of files written for logging.
 */
export function generateApiV1(options: GenerateApiV1Options): number {
  const { stagingPublic, release, v2Rules } = options;
  const API_OUT = join(stagingPublic, 'api', 'v1');
  const GENERATED = release.generatedAt;
  const api = loadApi(join(stagingPublic, 'api.json'));
  const allEntries: Entry[] = [];
  const entryMap = new Map<string, Entry>();
  const categoryEntries = new Map<string, Entry[]>();

  for (const cat of api.categories) {
    const slug = slugify(cat.taxType);
    categoryEntries.set(slug, cat.entries);
    for (const e of cat.entries) {
      allEntries.push(e);
      entryMap.set(e.id, e);
    }
  }

  const { minimumYear, maximumYear, temporalRange } = deriveTemporalBounds(allEntries, GENERATED);

  const allRegs: any[] = api.regulations;
  const regMap = new Map<string, any>();
  for (const r of allRegs) regMap.set(r.id, r);

  let fileCount = 0;

  // 1. Index
  ensureDir(API_OUT);
  writeJson(join(API_OUT, 'index.json'), {
    api: 'tarif-pajak-id', version: VERSION, generated: GENERATED,
    endpoints: {
      entries: '/api/v1/entries',
      entry: '/api/v1/entries/{id}',
      categories: '/api/v1/categories',
      category: '/api/v1/categories/{slug}',
      byYear: '/api/v1/by-year/{year}',
      bppu: '/api/v1/bppu',
      bppuPrefix: '/api/v1/bppu/{prefix}',
      timeline: '/api/v1/timeline/{group}',
      search: '/api/v1/search-index.json',
      regulations: '/api/v1/regulations',
      regulation: '/api/v1/regulations/{id}',
      calculator: '/api/v1/calculator',
      openapi: '/api/v1/openapi.json',
      consolidated: '/api/v1/consolidated',
      consolidatedLaw: '/api/v1/consolidated/{id}',
      consolidatedPasal: '/api/v1/consolidated/{id}/pasal-{number}',
    },
    stats: { entries: allEntries.length, categories: api.categories.length, regulations: allRegs.length },
  });
  fileCount++;

  // 2. Stats
  const statusCounts: Record<string, number> = {};
  for (const e of allEntries) statusCounts[e.status] = (statusCounts[e.status] || 0) + 1;
  const catStats = api.categories.map((c: any) => ({ taxType: c.taxType, slug: slugify(c.taxType), count: c.entries.length }));
  writeJson(join(API_OUT, 'stats.json'), envelop({
    totalEntries: allEntries.length, totalCategories: api.categories.length, totalRegulations: allRegs.length,
    byStatus: statusCounts, byCategory: catStats, temporalRange,
  }, GENERATED));
  fileCount++;

  // 3. Entries list
  const entriesDir = join(API_OUT, 'entries');
  ensureDir(entriesDir);
  const entriesIndex = allEntries.map(e => ({
    id: e.id, category: e.category, taxType: e.taxType, transactionType: e.transactionType,
    rate: rateStr(e.rate), rateType: e.rate.type, status: e.status,
    effectiveFrom: e.effectiveFrom, effectiveTo: e.effectiveTo,
    tags: e.tags, hasBppu: !!(e.bppuKode && e.bppuKode.length > 0),
  }));
  writeJson(join(entriesDir, 'index.json'), envelop({ count: entriesIndex.length, entries: entriesIndex }, GENERATED));
  fileCount++;

  // 4. Entry details
  for (const e of allEntries) {
    const catSlug = slugify(e.taxType);
    const sameCat = categoryEntries.get(catSlug) || [];
    const relatedEntries: any = {};
    if (e.supersededBy && e.supersededBy.length > 0) relatedEntries.supersededBy = e.supersededBy;
    if (e.supersedes && e.supersedes.length > 0) relatedEntries.supersedes = e.supersedes;
    relatedEntries.sameCategory = sameCat.map((s: any) => s.id).filter((id: string) => id !== e.id);

    const regEntries: string[] = [];
    for (const lb of e.legalBasis) {
      for (const r of allRegs) {
        if (r.number && lb.regulation && r.number.includes(lb.regulation.split(' ').pop() || '')) {
          if (!regEntries.includes(r.id)) regEntries.push(r.id);
        }
      }
    }
    if (regEntries.length > 0) relatedEntries.regulations = regEntries;

    writeJson(join(entriesDir, `${e.id}.json`), envelop({
      ...e, relatedEntries,
    }, GENERATED));
    fileCount++;
  }

  // 5. Categories
  const catDir = join(API_OUT, 'categories');
  ensureDir(catDir);
  const catIndex = api.categories.map((c: any) => ({
    category: c.category, taxType: c.taxType, slug: slugify(c.taxType),
    description: c.description, count: c.entries.length,
  }));
  writeJson(join(catDir, 'index.json'), envelop({ count: catIndex.length, categories: catIndex }, GENERATED));
  fileCount++;

  for (const c of api.categories) {
    const slug = slugify(c.taxType);
    writeJson(join(catDir, `${slug}.json`), envelop({
      category: c.category, taxType: c.taxType, description: c.description,
      count: c.entries.length, entries: c.entries.map((e: any) => ({
        id: e.id, transactionType: e.transactionType, rate: rateStr(e.rate),
        status: e.status, effectiveFrom: e.effectiveFrom, effectiveTo: e.effectiveTo,
      })),
    }, GENERATED));
    fileCount++;
  }

  // 6. By-Year
  const yearDir = join(API_OUT, 'by-year');
  ensureDir(yearDir);
  const yearData = new Map<number, Entry[]>();
  for (let y = minimumYear; y <= maximumYear; y++) {
    const matching = allEntries.filter(e => {
      const from = e.effectiveFrom;
      const to = e.effectiveTo || '9999-12-31';
      return from <= `${y}-12-31` && to >= `${y}-01-01`;
    });
    if (matching.length > 0) {
      yearData.set(y, matching);
      writeJson(join(yearDir, `${y}.json`), envelop({
        year: y, count: matching.length,
        entries: matching.map(e => ({
          id: e.id, taxType: e.taxType, transactionType: e.transactionType,
          rate: rateStr(e.rate), status: e.status,
          effectiveFrom: e.effectiveFrom, effectiveTo: e.effectiveTo,
        })),
      }, GENERATED));
      fileCount++;
    }
  }

  // 7. BPPU
  const bppuDir = join(API_OUT, 'bppu');
  ensureDir(bppuDir);
  const bppuByPrefix = new Map<string, any[]>();
  const allBppuCodes: any[] = [];
  for (const e of allEntries) {
    for (const bp of (e.bppuKode || [])) {
      allBppuCodes.push({ ...bp, entryId: e.id, entryTransactionType: e.transactionType });
      const parts = bp.kode.split('-');
      const prefix = parts.length >= 2 ? `${parts[0]}-${parts[1]}` : bp.kode;
      if (!bppuByPrefix.has(prefix)) bppuByPrefix.set(prefix, []);
      bppuByPrefix.get(prefix)!.push({ ...bp, entryId: e.id, entryTransactionType: e.transactionType });
    }
  }
  writeJson(join(bppuDir, 'index.json'), envelop({
    count: allBppuCodes.length, prefixes: Array.from(bppuByPrefix.keys()).sort(),
    codes: allBppuCodes.map(b => ({ kode: b.kode, nama: b.nama, tarif: b.tarif, entryId: b.entryId })).sort((a, b) => a.kode.localeCompare(b.kode) || a.entryId.localeCompare(b.entryId)),
  }, GENERATED));
  fileCount++;
  for (const [prefix, codes] of Array.from(bppuByPrefix.entries()).sort(([a], [b]) => a.localeCompare(b))) {
    codes.sort((a, b) => a.kode.localeCompare(b.kode) || a.entryId.localeCompare(b.entryId));
    writeJson(join(bppuDir, `${prefix}.json`), envelop({
      prefix, count: codes.length, codes,
    }, GENERATED));
    fileCount++;
  }

  // 8. Timeline
  const tlDir = join(API_OUT, 'timeline');
  ensureDir(tlDir);
  const timelineGroups: Record<string, string[]> = {
    'pph-21-progressive': ['pph-21-progressive-uulama1983', 'pph-21-progressive-uulama1994', 'pph-21-progressive-pre2009', 'pph-21-progressive-pre2022', 'pph-21-progressive-annual-2024'],
    'pph-21-ptkp': ['pph-21-ptkp-1984', 'pph-21-ptkp-1995', 'pph-21-ptkp-2005', 'pph-21-ptkp-2009', 'pph-21-non-taxable-income'],
    'pph-21-monthly': ['pph-21-progressive-monthly-pre2024', 'pph-21-ter-monthly-2024'],
    'pph-badan': ['pph-badan-pre2001', 'pph-badan-pre2010', 'pph-badan-pre2022', 'pph-badan-2022-plus'],
    'pph-23-jasa': ['pph-23-jasa-pre2001', 'pph-23-jasa-2001', 'pph-23-jasa-lain-2pct'],
    'pph-final-pengalihan': ['pph-final-pengalihan-pp131', 'pph-final-pengalihan-pp71'],
    'pph-final-bunga': ['pph-final-bunga-pre2009', 'pph-final-bunga-deposito'],
    'pph-umkm': ['pph-umkm-1pct-pp46', 'pph-umkm-05pct-2018', 'pph-umkm-05pct-2023'],
    'bea-meterai': ['bea-meterai-1000', 'bea-meterai-3000', 'bea-meterai-pre2021', 'bea-meterai-dokumen-2021'],
    'ppn': ['ppn-10pct', 'ppn-11pct-2022', 'ppn-11pct-effective-2025'],
  };
  const tlIndex: any[] = [];
  for (const [group, ids] of Object.entries(timelineGroups)) {
    const entries = ids.map(id => entryMap.get(id)).filter(Boolean);
    if (entries.length > 0) {
      const sorted = entries.sort((a: any, b: any) => a.effectiveFrom.localeCompare(b.effectiveFrom));
      writeJson(join(tlDir, `${group}.json`), envelop({
        group, count: sorted.length, description: `Timeline ${group.replace(/-/g, ' ')}`,
        entries: sorted.map((e: any) => ({
          id: e.id, transactionType: e.transactionType, rate: rateStr(e.rate),
          effectiveFrom: e.effectiveFrom, effectiveTo: e.effectiveTo, status: e.status,
          legalBasis: e.legalBasis?.map((l: any) => `${l.regulation} ${l.article}`).join('; '),
          supersedes: e.supersedes, supersededBy: e.supersededBy,
        })),
      }, GENERATED));
      tlIndex.push({ group, count: sorted.length, from: sorted[0].effectiveFrom, to: sorted[sorted.length - 1].effectiveTo || 'sekarang' });
      fileCount++;
    }
  }
  writeJson(join(tlDir, 'index.json'), envelop({ count: tlIndex.length, timelines: tlIndex }, GENERATED));
  fileCount++;

  // 9. Search Index (v1 legacy inverted index, preserved verbatim)
  const searchEntries: Record<string, string[]> = {};
  const keywords: Record<string, string[]> = {};
  for (const e of allEntries) {
    const tokens = new Set<string>();
    const addTokens = (text: string) => {
      text.toLowerCase().split(/[\s,;.()\/\-]+/).forEach(w => { if (w.length >= 2) tokens.add(w); });
    };
    addTokens(e.id);
    addTokens(e.taxType);
    addTokens(e.transactionType);
    addTokens(e.description || '');
    addTokens(e.category);
    (e.tags || []).forEach((t: string) => tokens.add(t.toLowerCase()));
    (e.legalBasis || []).forEach((lb: any) => addTokens(lb.regulation));
    (e.bppuKode || []).forEach((bp: any) => { addTokens(bp.kode); addTokens(bp.nama); });

    searchEntries[e.id] = Array.from(tokens).sort();
    for (const t of tokens) {
      if (!keywords[t]) keywords[t] = [];
      keywords[t].push(e.id);
    }
  }
  for (const ids of Object.values(keywords)) ids.sort();
  const sortedSearchEntries = Object.fromEntries(Object.entries(searchEntries).sort(([a], [b]) => a.localeCompare(b)));
  const sortedKeywords = Object.fromEntries(Object.entries(keywords).sort(([a], [b]) => a.localeCompare(b)));
  writeJson(join(API_OUT, 'search-index.json'), {
    version: GENERATED.split('T')[0], entryCount: allEntries.length,
    entries: sortedSearchEntries, keywords: sortedKeywords,
  });
  fileCount++;

  // 10. Regulations
  const regDir = join(API_OUT, 'regulations');
  ensureDir(regDir);
  writeJson(join(regDir, 'index.json'), envelop({
    count: allRegs.length,
    regulations: allRegs.map((r: any) => ({
      id: r.id, number: r.number, year: r.year, title: r.title,
      type: r.type, status: r.status, sourceUrl: r.sourceUrl,
    })),
  }, GENERATED));
  fileCount++;
  for (const r of allRegs) {
    const refEntries: string[] = [];
    for (const e of allEntries) {
      for (const lb of (e.legalBasis || [])) {
        if (lb.regulation && r.number && lb.regulation.includes(r.number.split('/')[0])) {
          if (!refEntries.includes(e.id)) refEntries.push(e.id);
        }
      }
    }
    writeJson(join(regDir, `${r.id}.json`), envelop({ ...r, referencingEntries: refEntries }, GENERATED));
    fileCount++;
  }

  // 11. Calculator
  const calcDir = join(API_OUT, 'calculator');
  ensureDir(calcDir);

  const pph21Progressive = entryMap.get('pph-21-progressive-annual-2024');
  const ptkpEntry = entryMap.get('pph-21-non-taxable-income');
  const terEntry = entryMap.get('pph-21-ter-monthly-2024');
  writeJson(join(calcDir, 'pph-21.json'), envelop({
    description: 'Data untuk kalkulasi PPh 21',
    progressiveRate: pph21Progressive?.rate || null,
    ptkp: {
      values: { 'TK/0': 54000000, 'K/0': 58500000, 'K/1': 63000000, 'K/2': 67500000, 'K/3': 72000000 },
      source: 'PMK 122/2015',
    },
    ter: terEntry ? { description: terEntry.description, categories: ['A', 'B', 'C'] } : null,
    formula: {
      annual: 'PKP = Neto - PTKP, PPh = sum(bracket_rate × bracket_income)',
      monthly_ter: 'PPh = TER_rate × (Bruto - Iuran)',
      honorarium: 'Neto = Norma% × Bruto, PKP = Neto - PTKP, PPh = progressive(PKP)',
    },
  }, GENERATED));
  fileCount++;
  void ptkpEntry;

  const pph23_2pct = entryMap.get('pph-23-jasa-lain-2pct');
  writeJson(join(calcDir, 'pph-23.json'), envelop({
    description: 'Data untuk kalkulasi PPh 23',
    rates: { jasa_bernpwp: 2, jasa_tanpa_npwp: 4, sewa: 10, hadiah: 10 },
    formula: { dasar: 'DPP = Jumlah Bruto', pp23: 'PPh 23 = Tarif × DPP' },
  }, GENERATED));
  fileCount++;
  void pph23_2pct;

  writeJson(join(calcDir, 'ppn.json'), envelop(projectPpnCalculator(v2Rules), GENERATED));
  fileCount++;

  writeJson(join(calcDir, 'pph-badan.json'), envelop(projectPphBadanCalculator(v2Rules), GENERATED));
  fileCount++;

  writeJson(join(calcDir, 'index.json'), envelop({
    description: 'Kalkulator pajak — data statis untuk kalkulasi client-side',
    calculators: [
      { id: 'pph-21', name: 'PPh 21 Orang Pribadi', description: 'Progresif, TER, PTKP, honorarium' },
      { id: 'pph-23', name: 'PPh 23', description: 'Jasa, sewa, hadiah' },
      { id: 'ppn', name: 'PPN', description: 'Pajak Pertambahan Nilai' },
      { id: 'pph-badan', name: 'PPh Badan', description: 'Tarif flat badan' },
    ],
  }, GENERATED));
  fileCount++;

  // 12. OpenAPI Spec (v1) — generated via the shared openapi module.
  writeJson(join(API_OUT, 'openapi.json'), buildV1OpenApi(minimumYear, maximumYear));
  fileCount++;

  // 13. Consolidated Laws
  const consDir = join(API_OUT, 'consolidated');
  ensureDir(consDir);

  const allConsolidated = api.consolidatedLaws || [];
  const consIndex = allConsolidated.map((l: any) => ({
    id: l.id,
    shortTitle: l.shortTitle,
    baseLaw: `${l.baseLaw.type} ${l.baseLaw.number}/${l.baseLaw.year}`,
    totalPasals: l.statistics.totalPasals,
    totalAmendments: l.statistics.totalAmendments,
  }));
  writeJson(join(consDir, 'index.json'), envelop({ count: allConsolidated.length, laws: consIndex }, GENERATED));
  fileCount++;

  for (const law of allConsolidated) {
    const lawSummary = {
      id: law.id,
      title: law.title,
      shortTitle: law.shortTitle,
      description: law.description,
      baseLaw: law.baseLaw,
      amendmentChain: law.amendmentChain,
      structure: law.structure,
      statistics: law.statistics,
      lastUpdated: law.lastUpdated,
      sourceNotes: law.sourceNotes,
      pasalCount: law.pasals.length,
      pasals: law.pasals.map((p: any) => ({
        number: p.number,
        bab: p.bab,
        title: p.title,
        status: p.status,
        description: p.description,
        keywords: p.keywords,
        amendmentCount: p.amendmentHistory.length,
      })),
    };
    writeJson(join(consDir, `${law.id}.json`), envelop(lawSummary, GENERATED));
    fileCount++;

    const pasalDir = join(consDir, law.id);
    ensureDir(pasalDir);
    for (const pasal of law.pasals) {
      writeJson(join(pasalDir, `pasal-${pasal.number}.json`), envelop(pasal, GENERATED));
      fileCount++;
    }
  }

  return fileCount;
}

/**
 * Project the v1 PPN calculator data from the canonical v2 PPN rules. Replaces
 * the previous hard-coded values (which contained an incorrect "7/12 × 11%"
 * narrative and a stale "12% belum berlaku" note). The projection surfaces the
 * nominal rates (10% / 11% / 12%), the DPP 11/12 factor for non-luxury 2025
 * transactions (effective burden 12% × 11/12 = 11%), the luxury full-base 12%
 * path, the export 0% scenario, and the conditional nature of 2025. When v2
 * rules are not supplied, a stable backward-compatible shape is emitted that
 * still references the canonical sources by name.
 */
function projectPpnCalculator(v2Rules?: readonly TaxRuleV2[]): any {
  const ppnRules = (v2Rules ?? []).filter((r) => r.categoryId === 'cat-ppn');

  const findRule = (predicate: (r: TaxRuleV2) => boolean): TaxRuleV2 | undefined =>
    ppnRules.find(predicate);

  // Canonical nominal-rate rules (Article 7 UU PPN / HPP).
  const tenPctRule = findRule((r) => r.rate?.type === 'percentage' && (r.rate as any).value === '0.10');
  const elevenPctRule = findRule((r) =>
    r.rate?.type === 'percentage' && (r.rate as any).value === '0.11' && r.validFrom === '2022-04-01',
  );
  const twelvePctRule = findRule((r) =>
    r.rate?.type === 'percentage' && (r.rate as any).value === '0.12',
  );
  // DPP nilai lain 11/12 factor rule (PMK 131/2024 Article 3).
  const dppFactorRule = findRule((r) =>
    r.rate?.type === 'information_factor' && String((r.rate as any).factor).startsWith('0.9166'),
  );
  // 2025 non-luxury effective-burden rule (formula 12% × 11/12 = 11%).
  const nonLuxury2025Rule = findRule((r) =>
    r.id === 'rule-ppn-domestic-supply-2025-nonluxury' ||
    (r.rate?.type === 'formula' && String((r.rate as any).expression ?? '').includes('11/12') && r.conceptId === 'concept-ppn-domestic-supply'),
  );
  // 2025 luxury domestic full-base 12% rule (PMK 131/2024 Article 2).
  const luxuryDomestic2025Rule = findRule((r) =>
    r.id === 'rule-ppn-domestic-supply-2025-luxury' ||
    (r.rate?.type === 'percentage' && (r.rate as any).value === '0.12' && r.conceptId === 'concept-ppn-domestic-supply'),
  );
  // Luxury-BKP retail transition Jan 2025 (PMK 131/2024 Article 5).
  const luxuryRetailJan2025Rule = findRule((r) => r.id === 'rule-ppn-luxury-retail-jan-2025');
  // Export 0% rule.
  const exportRule = findRule((r) => r.conceptId === 'concept-ppn-export' && r.rate?.type === 'zero');

  // Source citations projected from the canonical rule verification evidence.
  const sourceIds = new Set<string>();
  for (const rule of [tenPctRule, elevenPctRule, twelvePctRule, dppFactorRule, luxuryDomestic2025Rule, luxuryRetailJan2025Rule, nonLuxury2025Rule, exportRule]) {
    if (!rule?.verification) continue;
    for (const id of rule.verification.sourceIds ?? []) sourceIds.add(id);
  }
  const sources = [...sourceIds].sort();

  // Build the scenario map. Numbers are projected from canonical rule values,
  // never hard-coded ad-hoc.
  const rateOf = (rule: TaxRuleV2 | undefined, fallback: string): string =>
    rule?.rate?.type === 'percentage' ? String((rule.rate as any).value) : fallback;

  const tenPctFraction = rateOf(tenPctRule, '0.10');
  const elevenPctFraction = rateOf(elevenPctRule, '0.11');
  const twelvePctFraction = rateOf(twelvePctRule, '0.12');
  const dppFactor = dppFactorRule ? String((dppFactorRule.rate as any).factor) : '0.9166667';

  return {
    description: 'Data untuk kalkulasi PPN (diproyeksikan dari aturan kanonik v2: UU HPP 7/2021, UU PPN 8/1983, PMK 131/2024, PMK 11/2025, PMK 53/2025)',
    sources,
    rates: {
      // Nominal rate per UU PPN Article 7(1)(a) as amended by UU HPP Article 7.
      nominal_10pct: {
        rate: Number(tenPctFraction) * 100,
        effectiveFrom: tenPctRule?.validFrom ?? '1984-04-01',
        effectiveTo: tenPctRule?.validToExclusive ?? '2022-04-01',
        note: 'Tarif nominal PPN 10% per UU PPN Pasal 7 ayat (1) huruf a (berlaku sejak 1984-04-01 sampai 2022-03-31).',
      },
      nominal_11pct: {
        rate: Number(elevenPctFraction) * 100,
        effectiveFrom: elevenPctRule?.validFrom ?? '2022-04-01',
        effectiveTo: elevenPctRule?.validToExclusive ?? '2025-01-01',
        note: 'Tarif nominal PPN 11% per UU HPP Pasal 7 (berlaku 2022-04-01 sampai 2024-12-31).',
      },
      nominal_12pct: {
        rate: Number(twelvePctFraction) * 100,
        effectiveFrom: twelvePctRule?.validFrom ?? '2025-01-01',
        effectiveTo: twelvePctRule?.validToExclusive ?? null,
        note: 'Tarif nominal PPN 12% per UU HPP Pasal 7 mulai 2025-01-01.',
      },
      // PMK 131/2024 Article 3: DPP nilai lain 11/12 for non-luxury transactions.
      // Effective burden = 12% × 11/12 = 11%. NOT stored as a bare 11% rate.
      dpp_nilai_lain_11_12: {
        factor: dppFactor,
        effectiveBurdenPct: 12 * Number(dppFactor),
        effectiveFrom: dppFactorRule?.validFrom ?? '2025-01-01',
        note: 'PMK 131/2024 Pasal 3: DPP nilai lain 11/12 untuk BKP bukan mewah, JKP biasa, dan perolehan JKP/BKP tidak berwujud dari luar negeri. Beban efektif PPN = 12% × 11/12 = 11%. Faktor ini BUKAN tarif; tarif nominal tetap 12% per UU HPP Pasal 7.',
      },
      // Luxury BKP full-base 12% (PMK 131/2024 Article 2).
      luxury_full_base_12pct: {
        rate: Number(twelvePctFraction) * 100,
        effectiveFrom: luxuryDomestic2025Rule?.validFrom ?? twelvePctRule?.validFrom ?? '2025-01-01',
        effectiveTo: luxuryDomestic2025Rule?.validToExclusive ?? null,
        note: 'PMK 131/2024 Pasal 2: BKP mewah yang dikenai PPnBM menggunakan DPP penuh (12%) atas impor/penyerahan dalam negeri sejak 2025-01-01 (kecuali transisi retail Pasal 5 Januari 2025).',
      },
      // Export 0% (UU PPN Article 7(2)).
      ekspor: {
        rate: 0,
        effectiveFrom: exportRule?.validFrom ?? '1984-04-01',
        note: 'UU PPN Pasal 7 ayat (2): ekspor BKP/JKP berkualifikasi dikenai 0% (zero-rated, BUKAN exempt/bukan objek).',
      },
    },
    scenarios: [
      {
        id: 'domestic-non-luxury-2025',
        transactionKind: 'domestic-supply',
        luxuryBkp: false,
        dppFactor: dppFactor,
        nominalRatePct: Number(twelvePctFraction) * 100,
        effectiveBurdenPct: 12 * Number(dppFactor),
        effectiveFrom: nonLuxury2025Rule?.validFrom ?? '2025-01-01',
        effectiveTo: nonLuxury2025Rule?.validToExclusive ?? null,
        sourceRuleId: nonLuxury2025Rule?.id ?? 'rule-ppn-domestic-supply-2025-nonluxury',
        note: 'Penyerahan BKP/JKP non-mewah dalam negeri tahun 2025: DPP nilai lain 11/12 (PMK 131/2024 Pasal 3) × tarif nominal 12% (UU HPP Pasal 7) = beban efektif 11%.',
      },
      {
        id: 'domestic-luxury-2025',
        transactionKind: 'domestic-supply',
        luxuryBkp: true,
        nominalRatePct: Number(twelvePctFraction) * 100,
        effectiveBurdenPct: Number(twelvePctFraction) * 100,
        effectiveFrom: luxuryDomestic2025Rule?.validFrom ?? '2025-01-01',
        effectiveTo: luxuryDomestic2025Rule?.validToExclusive ?? null,
        sourceRuleId: luxuryDomestic2025Rule?.id ?? 'rule-ppn-domestic-supply-2025-luxury',
        note: 'Penyerahan BKP mewah dalam negeri tahun 2025: DPP penuh × 12% (PMK 131/2024 Pasal 2). BKP mewah juga tunduk pada PPnBM.',
      },
      {
        id: 'luxury-retail-jan-2025',
        transactionKind: 'domestic-supply',
        luxuryBkp: true,
        retailFinalConsumer: true,
        dppFactor: dppFactor,
        effectiveFrom: luxuryRetailJan2025Rule?.validFrom ?? '2025-01-01',
        effectiveTo: luxuryRetailJan2025Rule?.validToExclusive ?? '2025-02-01',
        effectiveBurdenPct: 12 * Number(dppFactor),
        sourceRuleId: luxuryRetailJan2025Rule?.id ?? 'rule-ppn-luxury-retail-jan-2025',
        note: 'PMK 131/2024 Pasal 5: penyerahan BKP mewah retail kepada konsumen akhir oleh PKP retail yang berhak menggunakan DPP 11/12 sampai 31 Januari 2025 (beban efektif 11%); DPP penuh 12% mulai 1 Februari 2025.',
      },
      {
        id: 'export-0pct',
        transactionKind: 'export',
        ratePct: 0,
        effectiveFrom: exportRule?.validFrom ?? '1984-04-01',
        effectiveTo: exportRule?.validToExclusive ?? null,
        sourceRuleId: exportRule?.id ?? 'rule-ppn-export-0pct',
        note: 'Ekspor BKP/JKP berkualifikasi = 0% per UU PPN Pasal 7 ayat (2). Zero-rated: pajak masukan tetap dapat dikreditkan.',
      },
    ],
    formula: {
      ppn: 'PPN = Tarif nominal × DPP',
      dpp_umum: 'DPP = Harga Jual / Penggantian / Nilai Impor / Nilai Ekspor (UU PPN Pasal 8)',
      dpp_nilai_lain_2025: 'DPP nilai lain = 11/12 × harga sebenarnya (PMK 131/2024 Pasal 3 untuk non-mewah); beban efektif = 12% × 11/12 = 11%',
    },
    notes: 'Tahun 2025 bersyarat: klasifikasi BKP mewah, status konsumen akhir retail, dan cakupan skema DPP sektoral (PMK 11/2025 efektif 4 Feb 2025; PMK 53/2025 dari 1 Agu 2025) menentukan apakah DPP penuh 12% atau DPP 11/12 (beban efektif 11%) yang berlaku. Tidak ada satu angka universal untuk 2025.',
    $projection: {
      projectedFromV2: true,
      v2RuleIds: [tenPctRule, elevenPctRule, twelvePctRule, dppFactorRule, luxuryDomestic2025Rule, luxuryRetailJan2025Rule, nonLuxury2025Rule, exportRule]
        .filter(Boolean)
        .map((r) => r!.id)
        .sort()
        // Deduplicate: twelvePctRule and luxuryDomestic2025Rule may resolve to the
        // same canonical rule (both look for a 0.12 percentage rule). Keep one.
        .filter((id, index, array) => array.indexOf(id) === index),
    },
  };
}

/**
 * Project the v1 PPh Badan calculator data from the canonical v2 badan rules.
 * Replaces the previous hard-coded `goPublic: 20, ikn: 0, umkm: 11` figures
 * (Task 7 review item I-1):
 *
 *   - Listed (goPublic) reduction is 3 percentage points off the 22% base,
 *     i.e. 19% for TP 2020+ per UU 2/2020 + UU HPP — NOT 20%. Surfaces the
 *     free-float conditions (>=40% listed, >=300 holders, each <5%, etc.).
 *   - Article 31E is a proportional 50% reduction on the PKP portion tied to
 *     gross turnover up to Rp4.8bn — NOT a flat 11% rate. The calculator
 *     references the canonical formula instead of a bare number.
 *   - IKN is a conditional facility with verification `needs_review`, never a
 *     flat 0%. The calculator surfaces it as conditional and flags the
 *     needs_review state.
 */
function projectPphBadanCalculator(v2Rules?: readonly TaxRuleV2[]): any {
  const badanRules = (v2Rules ?? []).filter((r) => r.categoryId === 'cat-pph-badan');
  const findRule = (id: string): TaxRuleV2 | undefined => badanRules.find((r) => r.id === id);

  const baseRule = findRule('rule-pph-badan-base-22pct-hpp');
  const listedRule = findRule('rule-pph-badan-listed-19pct-hpp');
  const article31eRule = findRule('rule-pph-badan-article31e');
  const iknRule = findRule('rule-pph-badan-ikn');

  const baseRate = baseRule?.rate?.type === 'percentage' ? Number((baseRule.rate as any).value) * 100 : 22;
  const listedRate = listedRule?.rate?.type === 'percentage' ? Number((listedRule.rate as any).value) * 100 : 19;
  const listedReductionPp = baseRate - listedRate; // 3 percentage points off the 22% base.

  // Source ids unioned from the canonical rules.
  const sourceIds = new Set<string>();
  for (const rule of [baseRule, listedRule, article31eRule, iknRule]) {
    if (!rule?.verification) continue;
    for (const id of rule.verification.sourceIds ?? []) sourceIds.add(id);
  }
  const sources = [...sourceIds].sort();

  return {
    description: 'Data untuk kalkulasi PPh Badan (diproyeksikan dari aturan kanonik v2: UU PPh, UU 2/2020, UU HPP 7/2021, PP 55/2022, PMK 40/2023, PMK 28/2024)',
    sources,
    rates: {
      // Base rate 22% for TP 2022+ per UU HPP Art 17(1)(b).
      umum: {
        rate: baseRate,
        effectiveFrom: baseRule?.validFrom ?? '2022-01-01',
        effectiveTo: baseRule?.validToExclusive ?? null,
        note: 'Tarif dasar PPh Badan 22% per UU 7/2021 HPP Pasal 17 ayat (1) huruf b (TP 2022 sampai saat ini). Sebelumnya 25% (UU 36/2008) dan 22% (UU 2/2020 untuk TP 2020-2021).',
      },
      // Listed-company rate 19% — 3 percentage points off the 22% base. NOT 20%.
      goPublic: {
        rate: listedRate,
        reductionPp: listedReductionPp,
        effectiveFrom: listedRule?.validFrom ?? '2022-01-01',
        effectiveTo: listedRule?.validToExclusive ?? null,
        note: `Tarif perusahaan listed ${listedRate}% = tarif dasar ${baseRate}% dikurangi ${listedReductionPp} persen poin (BUKAN ${baseRate - 4}% lama, BUKAN pengurangan proporsional ${baseRate}% × 0,97) per UU 2/2020 dan UU HPP. Syarat Pasal 17(2b) UU PPh jo. PP 55/2022 Pasal 64-65 jo. PMK 40/2023: saham >=40% diperdagangkan, >=300 pemegang saham masing-masing <5%, dimiliki >=183 hari/tahun, kepatuhan pelaporan.`,
        conditions: 'Kualifikasi listed: free-float >=40%, >=300 pemegang saham, masing-masing <5%, kepemilikan >=183 hari/tahun, kepatuhan pelaporan.',
      },
      // Article 31E is a formula, not a flat 11%. Reference the canonical rule.
      article31e: {
        type: 'formula',
        ruleId: 'rule-pph-badan-article31e',
        effectiveFrom: article31eRule?.validFrom ?? '2010-01-01',
        effectiveTo: article31eRule?.validToExclusive ?? null,
        note: 'Pasal 31E(1) UU PPh: pengurangan tarif 50% atas PKP yang PROPORSIONAL terhadap peredaran bruto pertama Rp4.800.000.000 (BUKAN pemulusan seluruh PKP dengan tarif 11%). Elegibilitas: badan resident dengan peredaran bruto <= Rp50.000.000.000. Bila peredaran bruto <= Rp4,8 miliar: seluruh PKP kena pengurangan 50%. Bila Rp4,8 miliar < peredaran bruto <= Rp50 miliar: porsi PKP = PKP × (Rp4,8 miliar / peredaran bruto) kena pengurangan 50%, sisanya kena tarif dasar penuh.',
        formula: article31eRule?.rate?.type === 'formula' ? (article31eRule.rate as any).expression : 'Pasal 31E(1) UU PPh — alokasi proporsional PKP ke peredaran bruto pertama Rp4.800.000.000.',
      },
      // IKN is conditional + needs_review, NOT a flat 0%.
      ikn: {
        type: 'conditional',
        rate: null,
        ruleId: 'rule-pph-badan-ikn',
        verification: iknRule?.verification?.status ?? 'needs_review',
        effectiveFrom: iknRule?.validFrom ?? '2023-01-01',
        effectiveTo: iknRule?.validToExclusive ?? null,
        note: 'Fasilitas PPh Badan IKN (PMK 28/2024) BERSYARAT dan verification needs_review — bukan tarif flat 0%. Art 4(1): pengurangan 100% untuk Pelaku Usaha IKN pada kategori/kualifikasi dan jendela investasi tertentu. Art 8/10: jadwal durasi menurut kategori bidang usaha (2023-2030 / 2031-2035 / 2036-2045). Art 8(5): pengurangan 50% untuk bidang usaha lain periode 2031-2045. Elegibilitas penuh per rekord belum sepenuhnya terbukti dari sumber primer.',
        formula: iknRule?.rate?.type === 'formula' ? (iknRule.rate as any).expression : 'PMK 28/2024 — fasilitas bersyarat per kategori dan jendela investasi.',
      },
    },
    formula: {
      pphBadan: 'PPh = Tarif × PKP',
      pkp: 'PKP = Penghasilan Neto - PTKP Badan (jika ada)',
      listed: `Tarif listed = Tarif dasar - ${listedReductionPp} persen poin (syarat free-float)`,
      article31e: 'Pengurangan 50% atas porsi PKP proporsional terhadap peredaran bruto pertama Rp4,8 miliar',
      ikn: 'Fasilitas bersyarat (needs_review); bukan tarif flat',
    },
    $projection: {
      v2RuleIds: [baseRule, listedRule, article31eRule, iknRule]
        .filter(Boolean)
        .map((r) => r!.id)
        .sort()
        .filter((id, index, array) => array.indexOf(id) === index),
    },
  };
}


// Local v1 OpenAPI builder. Kept inline so the v1 generator is self-contained
// and the v1 contract does not depend on the v2 openapi module.
function buildV1OpenApi(minimumYear: number, maximumYear: number): any {
  return {
    openapi: '3.0.3',
    info: {
      title: 'Tarif Pajak Indonesia API', version: '1.0.0',
      description: 'Open database tarif pajak Indonesia — pre-built static JSON API. Semua endpoint mengembalikan file JSON statis yang bisa di-cache.',
      license: { name: 'MIT', url: 'https://opensource.org/licenses/MIT' },
      contact: { name: 'Tarif Pajak ID', url: CANONICAL_ORIGIN },
    },
    servers: [
      { url: 'https://tarif-pajak-id.pages.dev', description: 'Production' },
      { url: 'http://localhost:4321', description: 'Development' },
    ],
    paths: {
      '/api/v1/index.json': { get: { summary: 'API Index', tags: ['Meta'], responses: { '200': { description: 'API info & endpoint list' } } } },
      '/api/v1/stats.json': { get: { summary: 'Database Statistics', tags: ['Meta'], responses: { '200': { description: 'Entry counts by status, category, temporal range' } } } },
      '/api/v1/entries/index.json': { get: { summary: 'List All Entries', tags: ['Entries'], responses: { '200': { description: 'Flat list of all tax rate entries (summary)' } } } },
      '/api/v1/entries/{id}.json': {
        get: { summary: 'Get Entry Detail', tags: ['Entries'],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'Entry ID, e.g. ppn-10pct' }],
          responses: { '200': { description: 'Full entry detail with legalBasis, examples, BPPU codes, related entries' } } },
      },
      '/api/v1/categories/index.json': { get: { summary: 'List Categories', tags: ['Categories'], responses: { '200': { description: 'All tax categories' } } } },
      '/api/v1/categories/{slug}.json': {
        get: { summary: 'Get Category Entries', tags: ['Categories'],
          parameters: [{ name: 'slug', in: 'path', required: true, schema: { type: 'string' }, description: 'Category slug, e.g. pph-21, ppn' }],
          responses: { '200': { description: 'Entries within a category' } } },
      },
      '/api/v1/by-year/{year}.json': {
        get: { summary: 'Temporal Query', tags: ['Temporal'],
          parameters: [{ name: 'year', in: 'path', required: true, schema: { type: 'integer', minimum: minimumYear, maximum: maximumYear }, description: 'Year, e.g. 2001' }],
          responses: { '200': { description: 'Entries effective in the given year' } } },
      },
      '/api/v1/bppu/index.json': { get: { summary: 'All BPPU Codes', tags: ['BPPU'], responses: { '200': { description: 'All BPPU codes with entry mappings' } } } },
      '/api/v1/bppu/{prefix}.json': {
        get: { summary: 'BPPU Codes by Prefix', tags: ['BPPU'],
          parameters: [{ name: 'prefix', in: 'path', required: true, schema: { type: 'string' }, description: 'Prefix, e.g. 24-104, 28-404' }],
          responses: { '200': { description: 'BPPU codes matching prefix' } } },
      },
      '/api/v1/timeline/index.json': { get: { summary: 'Timeline Groups', tags: ['Timeline'], responses: { '200': { description: 'Available timeline groups' } } } },
      '/api/v1/timeline/{group}.json': {
        get: { summary: 'Timeline Chain', tags: ['Timeline'],
          parameters: [{ name: 'group', in: 'path', required: true, schema: { type: 'string' }, description: 'Group, e.g. pph-21-progressive, pph-21-ptkp' }],
          responses: { '200': { description: 'Historical chain of entries' } } },
      },
      '/api/v1/search-index.json': { get: { summary: 'Search Index', tags: ['Search'], responses: { '200': { description: 'Inverted index for client-side search' } } } },
      '/api/v1/regulations/index.json': { get: { summary: 'List Regulations', tags: ['Regulations'], responses: { '200': { description: 'All regulations' } } } },
      '/api/v1/regulations/{id}.json': {
        get: { summary: 'Get Regulation', tags: ['Regulations'],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'Regulation ID' }],
          responses: { '200': { description: 'Regulation detail with referencing entries' } } },
      },
      '/api/v1/calculator/index.json': { get: { summary: 'Calculator List', tags: ['Calculator'], responses: { '200': { description: 'Available calculator data sets' } } } },
      '/api/v1/calculator/{id}.json': {
        get: { summary: 'Calculator Data', tags: ['Calculator'],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', enum: ['pph-21', 'pph-23', 'ppn', 'pph-badan'] } }],
          responses: { '200': { description: 'Static data for tax calculation' } } },
      },
      '/api/v1/consolidated/index.json': { get: { summary: 'List Consolidated Laws', tags: ['Consolidated'], responses: { '200': { description: 'All consolidated tax laws (KUP, PPh, PPN)' } } } },
      '/api/v1/consolidated/{id}.json': { get: { summary: 'Get Consolidated Law', tags: ['Consolidated'], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', enum: ['uu-kup-konsolidasi', 'uu-pph-konsolidasi', 'uu-ppn-konsolidasi'] }, description: 'Consolidated law ID' }], responses: { '200': { description: 'Full consolidated law with pasal summaries' } } } },
      '/api/v1/consolidated/{id}/pasal-{number}.json': { get: { summary: 'Get Pasal Detail', tags: ['Consolidated'], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }, { name: 'number', in: 'path', required: true, schema: { type: 'string' }, description: 'Pasal number, e.g. 1, 2A' }], responses: { '200': { description: 'Full pasal detail with amendment history' } } } },
    },
    components: {
      schemas: {
        Envelope: { type: 'object', properties: { api: { type: 'string' }, version: { type: 'string' }, generated: { type: 'string' }, data: {} } },
        TaxRateEntry: { type: 'object', description: 'Full tax rate entry' },
        EntrySummary: { type: 'object', description: 'Summary entry for lists' },
        Regulation: { type: 'object', description: 'Regulation metadata' },
      },
    },
    tags: [
      { name: 'Meta', description: 'API information' },
      { name: 'Entries', description: 'Tax rate entries' },
      { name: 'Categories', description: 'Tax categories' },
      { name: 'Temporal', description: 'Time-based queries' },
      { name: 'BPPU', description: 'BPPU code lookup' },
      { name: 'Timeline', description: 'Historical chains' },
      { name: 'Search', description: 'Full-text search' },
      { name: 'Regulations', description: 'Regulation metadata' },
      { name: 'Calculator', description: 'Tax calculator data' },
      { name: 'Consolidated', description: 'Consolidated tax laws (UU Konsolidasi) with amendment tracking' },
    ],
  };
}
