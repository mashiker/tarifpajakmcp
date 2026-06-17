import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';

const ROOT = new URL('..', import.meta.url).pathname;
const API_SRC = join(ROOT, 'public', 'api.json');
const API_OUT = join(ROOT, 'website', 'public', 'api', 'v1');
const VERSION = 'v1';
const GENERATED = new Date().toISOString();

// ── Helpers ──────────────────────────────────────────────────
function loadApi() {
  return JSON.parse(readFileSync(API_SRC, 'utf-8'));
}

function envelop(data: any) {
  return { api: 'tarif-pajak-id', version: VERSION, generated: GENERATED, data };
}

function writeJson(path: string, data: any) {
  writeFileSync(path, JSON.stringify(data, null, 2) + '\n');
}

function ensureDir(dir: string) {
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
type Category = any;

// ── Main ─────────────────────────────────────────────────────
function main() {
  const api = loadApi();
  const allEntries: Entry[] = [];
  const entryMap = new Map<string, Entry>();
  const categoryEntries = new Map<string, Entry[]>();

  // Flatten entries
  for (const cat of api.categories) {
    const slug = slugify(cat.taxType);
    categoryEntries.set(slug, cat.entries);
    for (const e of cat.entries) {
      allEntries.push(e);
      entryMap.set(e.id, e);
    }
  }

  const allRegs: any[] = api.regulations;
  const regMap = new Map<string, any>();
  for (const r of allRegs) regMap.set(r.id, r);

  let fileCount = 0;

  // ── 1. Index ───────────────────────────────────────────────
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

  // ── 2. Stats ───────────────────────────────────────────────
  const statusCounts: Record<string, number> = {};
  for (const e of allEntries) statusCounts[e.status] = (statusCounts[e.status] || 0) + 1;
  const catStats = api.categories.map((c: any) => ({ taxType: c.taxType, slug: slugify(c.taxType), count: c.entries.length }));
  writeJson(join(API_OUT, 'stats.json'), envelop({
    totalEntries: allEntries.length, totalCategories: api.categories.length, totalRegulations: allRegs.length,
    byStatus: statusCounts, byCategory: catStats, temporalRange: { from: '1984-01-01', to: '2026-12-31' },
  }));
  fileCount++;

  // ── 3. Entries list ────────────────────────────────────────
  const entriesDir = join(API_OUT, 'entries');
  ensureDir(entriesDir);
  const entriesIndex = allEntries.map(e => ({
    id: e.id, category: e.category, taxType: e.taxType, transactionType: e.transactionType,
    rate: rateStr(e.rate), rateType: e.rate.type, status: e.status,
    effectiveFrom: e.effectiveFrom, effectiveTo: e.effectiveTo,
    tags: e.tags, hasBppu: !!(e.bppuKode && e.bppuKode.length > 0),
  }));
  writeJson(join(entriesDir, 'index.json'), envelop({ count: entriesIndex.length, entries: entriesIndex }));
  fileCount++;

  // ── 4. Entry details ───────────────────────────────────────
  for (const e of allEntries) {
    const catSlug = slugify(e.taxType);
    const sameCat = categoryEntries.get(catSlug) || [];
    const relatedEntries: any = {};
    if (e.supersededBy && e.supersededBy.length > 0) relatedEntries.supersededBy = e.supersededBy;
    if (e.supersedes && e.supersedes.length > 0) relatedEntries.supersedes = e.supersedes;
    relatedEntries.sameCategory = sameCat.map((s: any) => s.id).filter((id: string) => id !== e.id);

    // Find regulation entries
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
    }));
    fileCount++;
  }

  // ── 5. Categories ──────────────────────────────────────────
  const catDir = join(API_OUT, 'categories');
  ensureDir(catDir);
  const catIndex = api.categories.map((c: any) => ({
    category: c.category, taxType: c.taxType, slug: slugify(c.taxType),
    description: c.description, count: c.entries.length,
  }));
  writeJson(join(catDir, 'index.json'), envelop({ count: catIndex.length, categories: catIndex }));
  fileCount++;

  for (const c of api.categories) {
    const slug = slugify(c.taxType);
    writeJson(join(catDir, `${slug}.json`), envelop({
      category: c.category, taxType: c.taxType, description: c.description,
      count: c.entries.length, entries: c.entries.map((e: any) => ({
        id: e.id, transactionType: e.transactionType, rate: rateStr(e.rate),
        status: e.status, effectiveFrom: e.effectiveFrom, effectiveTo: e.effectiveTo,
      })),
    }));
    fileCount++;
  }

  // ── 6. By-Year ─────────────────────────────────────────────
  const yearDir = join(API_OUT, 'by-year');
  ensureDir(yearDir);
  const yearData = new Map<number, Entry[]>();
  for (let y = 1984; y <= 2026; y++) {
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
      }));
      fileCount++;
    }
  }

  // ── 7. BPPU ────────────────────────────────────────────────
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
    count: allBppuCodes.length, prefixes: Array.from(bppuByPrefix.keys()),
    codes: allBppuCodes.map(b => ({ kode: b.kode, nama: b.nama, tarif: b.tarif, entryId: b.entryId })),
  }));
  fileCount++;
  for (const [prefix, codes] of bppuByPrefix) {
    writeJson(join(bppuDir, `${prefix}.json`), envelop({
      prefix, count: codes.length, codes,
    }));
    fileCount++;
  }

  // ── 8. Timeline ────────────────────────────────────────────
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
      }));
      tlIndex.push({ group, count: sorted.length, from: sorted[0].effectiveFrom, to: sorted[sorted.length - 1].effectiveTo || 'sekarang' });
      fileCount++;
    }
  }
  writeJson(join(tlDir, 'index.json'), envelop({ count: tlIndex.length, timelines: tlIndex }));
  fileCount++;

  // ── 9. Search Index ────────────────────────────────────────
  const searchEntries: Record<string, string[]> = {};
  const keywords: Record<string, string[]> = {};
  for (const e of allEntries) {
    const tokens = new Set<string>();
    // Add tokens
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

    searchEntries[e.id] = Array.from(tokens);
    for (const t of tokens) {
      if (!keywords[t]) keywords[t] = [];
      keywords[t].push(e.id);
    }
  }
  writeJson(join(API_OUT, 'search-index.json'), {
    version: GENERATED.split('T')[0], entryCount: allEntries.length,
    entries: searchEntries, keywords,
  });
  fileCount++;

  // ── 10. Regulations ────────────────────────────────────────
  const regDir = join(API_OUT, 'regulations');
  ensureDir(regDir);
  writeJson(join(regDir, 'index.json'), envelop({
    count: allRegs.length,
    regulations: allRegs.map((r: any) => ({
      id: r.id, number: r.number, year: r.year, title: r.title,
      type: r.type, status: r.status, sourceUrl: r.sourceUrl,
    })),
  }));
  fileCount++;
  for (const r of allRegs) {
    // Find entries that reference this regulation
    const refEntries: string[] = [];
    for (const e of allEntries) {
      for (const lb of (e.legalBasis || [])) {
        if (lb.regulation && r.number && lb.regulation.includes(r.number.split('/')[0])) {
          if (!refEntries.includes(e.id)) refEntries.push(e.id);
        }
      }
    }
    writeJson(join(regDir, `${r.id}.json`), envelop({ ...r, referencingEntries: refEntries }));
    fileCount++;
  }

  // ── 11. Calculator ─────────────────────────────────────────
  const calcDir = join(API_OUT, 'calculator');
  ensureDir(calcDir);

  // PPh 21 calculator data
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
  }));
  fileCount++;

  // PPh 23 calculator data
  const pph23_2pct = entryMap.get('pph-23-jasa-lain-2pct');
  writeJson(join(calcDir, 'pph-23.json'), envelop({
    description: 'Data untuk kalkulasi PPh 23',
    rates: { jasa_bernpwp: 2, jasa_tanpa_npwp: 4, sewa: 10, hadiah: 10 },
    formula: { dasar: 'DPP = Jumlah Bruto', pp23: 'PPh 23 = Tarif × DPP' },
  }));
  fileCount++;

  // PPN calculator data
  writeJson(join(calcDir, 'ppn.json'), envelop({
    description: 'Data untuk kalkulasi PPN',
    rates: {
      umum_2022: { rate: 11, effectiveFrom: '2022-04-01', note: '11% (7/12 × 11% via PMK 131/2024 untuk Apr-Des 2022)' },
      umum_2025: { rate: 12, effectiveFrom: '2025-01-01', note: '12% per UU HPP, belum berlaku' },
      ekspor: 0,
    },
    formula: { ppn: 'PPN = Tarif × DPP', dpp: 'DPP = Harga Jual / Penggantian / Nilai Impor' },
  }));
  fileCount++;

  // PPh Badan calculator data
  writeJson(join(calcDir, 'pph-badan.json'), envelop({
    description: 'Data untuk kalkulasi PPh Badan',
    rates: { umum: 22, goPublic: 20, umkm: 11, ikn: 0 },
    formula: { pphBadan: 'PPh = Tarif × PKP', pkp: 'PKP = Penghasilan Neto - PTKP Badan' },
  }));
  fileCount++;

  // Calculator index
  writeJson(join(calcDir, 'index.json'), envelop({
    description: 'Kalkulator pajak — data statis untuk kalkulasi client-side',
    calculators: [
      { id: 'pph-21', name: 'PPh 21 Orang Pribadi', description: 'Progresif, TER, PTKP, honorarium' },
      { id: 'pph-23', name: 'PPh 23', description: 'Jasa, sewa, hadiah' },
      { id: 'ppn', name: 'PPN', description: 'Pajak Pertambahan Nilai' },
      { id: 'pph-badan', name: 'PPh Badan', description: 'Tarif flat badan' },
    ],
  }));
  fileCount++;

  // ── 12. OpenAPI Spec ───────────────────────────────────────
  const openapi = {
    openapi: '3.0.3',
    info: {
      title: 'Tarif Pajak Indonesia API', version: '1.0.0',
      description: 'Open database tarif pajak Indonesia — pre-built static JSON API. Semua endpoint mengembalikan file JSON statis yang bisa di-cache.',
      license: { name: 'MIT', url: 'https://opensource.org/licenses/MIT' },
      contact: { name: 'Tarif Pajak ID', url: 'https://tarif-pajak-id.pages.dev' },
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
          parameters: [{ name: 'year', in: 'path', required: true, schema: { type: 'integer', minimum: 1984, maximum: 2026 }, description: 'Year, e.g. 2001' }],
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
  writeJson(join(API_OUT, 'openapi.json'), openapi);
  fileCount++;


  // ── 13. Consolidated Laws ──────────────────────────────────
  const consDir = join(API_OUT, 'consolidated');
  ensureDir(consDir);

  const allConsolidated = api.consolidatedLaws || [];
  const consIndex = allConsolidated.map(l => ({
    id: l.id,
    shortTitle: l.shortTitle,
    baseLaw: `${l.baseLaw.type} ${l.baseLaw.number}/${l.baseLaw.year}`,
    totalPasals: l.statistics.totalPasals,
    totalAmendments: l.statistics.totalAmendments,
  }));
  writeJson(join(consDir, 'index.json'), envelop({ count: allConsolidated.length, laws: consIndex }));
  fileCount++;

  for (const law of allConsolidated) {
    // Summary version for the main endpoint
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
      // Include pasal list with brief info
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
    writeJson(join(consDir, `${law.id}.json`), envelop(lawSummary));
    fileCount++;

    // Full detail per pasal
    const pasalDir = join(consDir, law.id);
    ensureDir(pasalDir);
    for (const pasal of law.pasals) {
      writeJson(join(pasalDir, `pasal-${pasal.number}.json`), envelop(pasal));
      fileCount++;
    }
  }

  // ── Summary ────────────────────────────────────────────────
  console.log(`\n✅ API v1 build complete!`);
  console.log(`   Files generated: ${fileCount}`);
  console.log(`   Entries: ${allEntries.length}`);
  console.log(`   Categories: ${api.categories.length}`);
  console.log(`   Regulations: ${allRegs.length}`);
  console.log(`   BPPU prefixes: ${bppuByPrefix.size}`);
  console.log(`   Years: ${yearData.size}`);
  console.log(`   Timelines: ${tlIndex.length}`);
  console.log(`   Consolidated laws: ${allConsolidated.length}`);
}

main();
