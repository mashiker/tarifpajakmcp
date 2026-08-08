// Build the per-concept detail view model from the canonical v2 rules corpus.
//
// The /tarif/[id].astro page imports this at build time and renders one
// static detail page per concept id. The view model joins:
//   - the concept metadata (name, description, category)
//   - every rule under the concept (the chronology / exclusive group)
//   - the sources referenced by each rule's verification evidence
//   - the BPPU codes attached to each rule (with version metadata)
//   - declared conflicts touching any of the concept's rules
//   - predecessor/successor rules via the v2 supersedes/supersededBy relation
//
// The dataset is the same canonical v2 corpus the root database uses, so the
// detail page never drifts from the table it links from. Pure: same input ->
// same output, no I/O.

import type { DatabaseRow } from './database-state.ts';

export interface DetailSource {
  id: string;
  name: string;
  official: boolean;
  role: string;
  regulationId?: string;
  url?: string;
}

export interface DetailEvidence {
  claim: string;
  sourceId: string;
  locator: string;
}

export interface DetailBppuCode {
  id: string;
  code: string;
  label: string;
  validFrom: string;
  validToExclusive: string | null;
}

export interface DetailExample {
  id: string;
  label: string;
  illustrative: boolean;
  input: Record<string, unknown>;
  expectedAmount?: string;
  notes?: string;
}

export interface DetailConflict {
  id: string;
  kind: string;
  description?: string;
  ruleIds: string[];
}

export interface DetailRule {
  id: string;
  validFrom: string;
  validToExclusive: string | null;
  rate: import('./dataset.ts').CorpusRule['rate'];
  rateLabel: string;
  conditions?: unknown;
  /** Human-readable Indonesian rendering of `conditions` (Task 9 review C1). */
  conditionsLabel: string;
  verificationStatus: string;
  evidence: DetailEvidence[];
  sourceIds: string[];
  verifiedAt?: string;
  bppuCodes: DetailBppuCode[];
  examples: DetailExample[];
  notes?: string;
  supersedes: string[];
  supersededBy: string[];
  conflictIds: string[];
}

export interface DetailViewModel {
  id: string;
  name: string;
  description?: string;
  categoryId: string;
  categoryName: string;
  categorySlug: string;
  rules: DetailRule[];
  sourcesById: Map<string, DetailSource>;
  conflictsById: Map<string, DetailConflict>;
  /**
   * Maps every rule id in the corpus to the concept id that documents it.
   * Used to resolve cross-concept predecessor/successor links so the relation
   * href points at the page that actually carries the target article
   * (Task 9 review I3).
   */
  ruleIdToConceptId: Map<string, string>;
  /** Stable row representations for the timeline / status derivation. */
  rows: DatabaseRow[];
  /** Earliest validFrom across the concept's rules (chronology start). */
  earliestValidFrom: string;
  /** Latest validToExclusive across open-ended rules (null = open-ended). */
  latestValidToExclusive: string | null;
  /** JSON API document URL for the concept. */
  apiUrl: string;
  /** Stable category index URL. */
  categoryUrl: string;
}

/**
 * Resolve a relation href for a target rule id. Cross-concept references point
 * at the concept page that documents the target rule; same-concept references
 * use a fragment so the browser scrolls to the article. Falls back to a
 * same-page fragment when the target rule is unknown (defensive — should not
 * happen for healthy data, but never emit a dead external link).
 */
export function relationHref(vm: Pick<DetailViewModel, 'id' | 'ruleIdToConceptId'>, targetRuleId: string): string {
  const targetConcept = vm.ruleIdToConceptId.get(targetRuleId);
  if (!targetConcept || targetConcept === vm.id) {
    return `/tarif/${encodeURIComponent(vm.id)}#rule-${encodeURIComponent(targetRuleId)}`;
  }
  return `/tarif/${encodeURIComponent(targetConcept)}#rule-${encodeURIComponent(targetRuleId)}`;
}

interface CorpusConcept {
  id: string;
  categoryId: string;
  name: string;
  slug?: string;
  description?: string;
}

interface CorpusCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

interface CorpusRule {
  id: string;
  conceptId: string;
  categoryId?: string;
  validFrom: string;
  validToExclusive: string | null;
  rate?:
    | { type: 'percentage'; value: string }
    | { type: 'fixed'; amount: string; currency: string }
    | { type: 'specific'; amount: string; unit: string; currency?: string }
    | { type: 'progressive'; brackets: { upTo: string | null; rate: string }[] }
    | { type: 'formula'; expression: string }
    | { type: 'range'; min: string; max: string }
    | { type: 'free_text'; text: string }
    | { type: 'zero' }
    | { type: 'not_applicable' }
    | { type: 'information_factor'; factor: string };
  conditions?: unknown;
  verification?: { status: string; sourceIds: string[]; evidence?: { claim: string; sourceId: string; locator: string }[]; verifiedAt?: string };
  exclusiveGroup?: string;
  supersedes?: string[];
  supersededBy?: string[];
  bppuId?: string;
  examples?: { id: string; label: string; illustrative?: boolean; input: Record<string, unknown>; expectedAmount?: string; notes?: string }[];
  notes?: string;
}

interface CorpusConflict {
  id: string;
  kind: string;
  ruleIds: string[];
  description?: string;
}

interface CorpusBppu {
  id: string;
  code: string;
  label: string;
  validFrom: string;
  validToExclusive: string | null;
  ruleIds?: string[];
}

interface CorpusSource {
  id: string;
  name: string;
  official: boolean;
  role: string;
  regulationId?: string;
  url?: string;
}

export interface DetailCorpus {
  data: {
    rules: CorpusRule[];
    concepts: CorpusConcept[];
    categories: CorpusCategory[];
    conflicts: CorpusConflict[];
    sources?: CorpusSource[];
    bppu?: CorpusBppu[];
  };
}

/**
 * Recursive shape of a v2 ConditionExpression. Kept loose (value: unknown) so
 * the formatter is total over the union without re-declaring every variant.
 */
interface ConditionNode {
  op: 'equals' | 'in' | 'exists' | 'not' | 'and' | 'or' | string;
  fact?: string;
  value?: unknown;
  condition?: ConditionNode;
  conditions?: ConditionNode[];
}

/**
 * Indonesian fact labels for every fact name the v2 corpus uses. Drives the
 * human-readable conditions subsection on the detail page (Task 9 review C1).
 * The fallback is the raw slug so the formatter is total; a unit test locks
 * coverage for every fact name in the canonical dataset.
 */
const FACT_LABEL_ID: Record<string, string> = {
  annualPkp: 'PKP tahunan',
  article31eEligible: 'fasilitas Pasal 31E',
  contractorQualification: 'kualifikasi kontraktor',
  dailyGross: 'penghasilan harian',
  entityType: 'jenis badan',
  floatTradedPct: 'persentase saham diperdagangkan',
  grossRent: 'sewa bruto',
  grossTurnover: 'peredaran bruto',
  heldDays: 'lama kepemilikan',
  iknBusiness: 'bidang usaha IKN',
  iknBusinessCategory: 'kategori usaha IKN',
  iknInvestmentWindow: 'jendela investasi IKN',
  industry: 'industri',
  kind: 'jenis',
  listed: 'tercatat di bursa',
  listedConditionsMet: 'syarat perusahaan tercatat terpenuhi',
  luxuryBkp: 'BKP mewah',
  maxStakePct: 'pemegang saham maksimal',
  minShareholders: 'jumlah pemegang saham minimal',
  pp23DurationNotExceeded: 'batas durasi PP 23/2018 belum terlampaui',
  pp23YearsElapsed: 'tahun PP 23/2018 yang telah berlalu',
  priorWithheld: 'telah dipotong sebelumnya',
  ptkpClass: 'PTKP',
  recipient: 'penerima',
  recipientClass: 'kelas penerima',
  recipientHasNpwp: 'penerima bersangkutan punya NPWP',
  resident: 'residen',
  retailFinalConsumer: 'konsumen akhir eceran',
  serviceClass: 'kelas jasa',
  taxpayerType: 'jenis wajib pajak',
  transactionKind: 'jenis transaksi',
  transferCategory: 'kategori transfer',
  treaty: 'perjanjian pajak',
  umkmTurnoverEligible: 'peredaran bruto UMKM eligible',
  withdrawalMode: 'cara penarikan',
};

/**
 * Format a value for display. Booleans become "ya"/"tidak", strings are
 * translated through a small value-label map for the canonical enumerations
 * (e.g. "goods" -> "barang"), numbers and other primitives are stringified.
 */
const VALUE_LABEL_ID: Record<string, string> = {
  // kind
  goods: 'barang',
  services: 'jasa',
  // treaty
  none: 'tidak ada',
  // recipientClass / recipient
  employee: 'karyawan',
  nonEmployee: 'bukan karyawan',
  commissioner: 'komisaris',
  formerEmployee: 'mantan karyawan',
  pensionParticipant: 'peserta pensiun',
  activityParticipant: 'peserta kegiatan',
  nonResident: 'non-residen',
  // serviceClass
  konsultan: 'konsultan',
  manajemen: 'manajemen',
  teknik: 'teknik',
  pmk141Lain: 'jasa lain PMK 141',
  // contractorQualification
  kecil: 'kecil',
  besar: 'besar',
  // transferCategory
  permukiman: 'permukiman',
  sederhana: 'sederhana',
  // entityType / taxpayerType
  op: 'orang pribadi',
  pt: 'PT',
  cv: 'CV',
  firma: 'firma',
  koperasi: 'koperasi',
  bumdes: 'BUM Desa',
  perseroanPerorangan: 'perseroan perorangan',
  // withdrawalMode
  tunai: 'tunai',
  // iknBusinessCategory
  bidangUsahaLain: 'bidang usaha lain',
};

function formatValueLabel(value: unknown): string {
  if (value === true) return 'ya';
  if (value === false) return 'tidak';
  if (value === null || value === undefined) return 'kosong';
  if (typeof value === 'string') return VALUE_LABEL_ID[value] ?? value;
  if (typeof value === 'number') return String(value);
  // Fall back to a stable serialization for objects/arrays (should not normally
  // appear in a leaf equals/in condition).
  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
}

function formatFactLabel(fact: string | undefined): string {
  if (!fact) return 'kondisi';
  return FACT_LABEL_ID[fact] ?? fact;
}

/**
 * Format a v2 ConditionExpression into a human-readable Indonesian string
 * (Task 9 review C1). Pure and total: never throws, never mutates.
 *
 * Output contract:
 *   - equals  -> "{fact} = {value}"      e.g. "jenis = barang"
 *   - in      -> "{fact}: {v1, v2, v3}"  e.g. "PTKP: TK/0, TK/1, K/0"
 *   - exists  -> "{fact} ada"             e.g. "industri ada"
 *   - not     -> "BUKAN {inner}"
 *   - and/all -> "{child1}; {child2}"
 *   - or/any  -> "{child1} ATAU {child2}"
 *
 * `all` and `any` are accepted as aliases of `and` and `or` per the brief.
 */
export function formatConditions(condition: unknown): string {
  if (!condition || typeof condition !== 'object') return '';
  const node = condition as ConditionNode;
  switch (node.op) {
    case 'equals':
      return `${formatFactLabel(node.fact)} = ${formatValueLabel(node.value)}`;
    case 'in': {
      const raw = Array.isArray(node.value) ? node.value : [];
      const labels = raw.map((v) => formatValueLabel(v));
      // Preserve canonical ordering of the source array (do not re-sort, so
      // PTKP class lists match the Lampiran ordering).
      return `${formatFactLabel(node.fact)}: ${labels.join(', ')}`;
    }
    case 'exists':
      return `${formatFactLabel(node.fact)} ada`;
    case 'not': {
      const inner = formatConditions(node.condition);
      return inner ? `BUKAN ${inner}` : 'BUKAN';
    }
    case 'and':
    case 'all': {
      const parts = (node.conditions ?? []).map((c) => formatConditions(c)).filter((s) => s.length > 0);
      return parts.join('; ');
    }
    case 'or':
    case 'any': {
      const parts = (node.conditions ?? []).map((c) => formatConditions(c)).filter((s) => s.length > 0);
      return parts.join(' ATAU ');
    }
    default: {
      // Unknown operator: surface the fact (if any) so the page is never
      // empty rather than throwing.
      return formatFactLabel(node.fact);
    }
  }
}

/** Format a v2 Rate into the compact label shown in the detail header. */
export function formatRateLabel(rate: CorpusRule['rate']): string {
  if (!rate) return '—';
  switch (rate.type) {
    case 'percentage': {
      const n = Number(rate.value);
      return Number.isFinite(n) ? `${(n * 100).toLocaleString('id-ID', { maximumFractionDigits: 2 })}%` : `${rate.value}`;
    }
    case 'zero':
      return '0%';
    case 'fixed':
      return `${rate.currency} ${rate.amount}`;
    case 'specific':
      return `${rate.currency ?? ''}${rate.amount}/${rate.unit}`.trim();
    case 'range': {
      const a = Number(rate.min) * 100;
      const b = Number(rate.max) * 100;
      return `${a}%–${b}%`;
    }
    case 'progressive': {
      const rates = rate.brackets.map((b) => Number(b.rate) * 100);
      if (rates.length === 0) return 'Progresif';
      if (rates.length > 8) return `${Math.min(...rates)}%–${Math.max(...rates)}% (${rate.brackets.length} lapisan)`;
      return rates.map((r) => `${r}%`).join('/');
    }
    case 'formula':
      return 'Formula';
    case 'information_factor':
      return `Faktor ${rate.factor}`;
    case 'free_text':
      return rate.text;
    case 'not_applicable':
      return 'N/A';
    default:
      return '—';
  }
}

/**
 * Build the detail view model for a single concept id. Pure.
 *
 * Returns `null` when the concept id is unknown so the page can render a
 * build-time 404 instead of emitting a half-empty page.
 */
export function buildDetailViewModel(corpus: DetailCorpus, conceptId: string): DetailViewModel | null {
  const { rules, concepts, categories, conflicts, sources = [], bppu = [] } = corpus.data;

  const concept = concepts.find((c) => c.id === conceptId);
  if (!concept) return null;

  const category = categories.find((c) => c.id === concept.categoryId);
  const categoryName = category?.name ?? concept.categoryId;
  const categorySlug = category?.slug ?? concept.slug ?? concept.categoryId;

  // Sources and conflicts indexed for O(1) lookup.
  const sourcesById = new Map<string, DetailSource>(
    sources.map((s) => [s.id, { id: s.id, name: s.name, official: s.official, role: s.role, regulationId: s.regulationId, url: s.url }]),
  );
  const conflictsById = new Map<string, DetailConflict>(
    conflicts.map((c) => [c.id, { id: c.id, kind: c.kind, description: c.description, ruleIds: c.ruleIds }]),
  );

  // Index BPPU codes by id for quick attachment to rules.
  const bppuById = new Map<string, CorpusBppu>(bppu.map((b) => [b.id, b]));
  const conflictIdByRuleId = new Map<string, string[]>();
  for (const c of conflicts) {
    for (const rid of c.ruleIds) {
      const arr = conflictIdByRuleId.get(rid) ?? [];
      arr.push(c.id);
      conflictIdByRuleId.set(rid, arr);
    }
  }

  // Restrict the chronology to this concept's rules, sorted by validFrom then id
  // so the timeline reads chronologically.
  const conceptRules = rules
    .filter((r) => r.conceptId === conceptId)
    .sort((a, b) => a.validFrom.localeCompare(b.validFrom) || a.id.localeCompare(b.id));

  const detailRules: DetailRule[] = conceptRules.map((rule) => {
    const v = rule.verification;
    const evidence = (v?.evidence ?? []).map((e) => ({ claim: e.claim, sourceId: e.sourceId, locator: e.locator }));
    const bppuCodes: DetailBppuCode[] = [];
    if (rule.bppuId) {
      const b = bppuById.get(rule.bppuId);
      if (b) {
        bppuCodes.push({ id: b.id, code: b.code, label: b.label, validFrom: b.validFrom, validToExclusive: b.validToExclusive });
      }
    }
    return {
      id: rule.id,
      validFrom: rule.validFrom,
      validToExclusive: rule.validToExclusive ?? null,
      rate: rule.rate,
      rateLabel: formatRateLabel(rule.rate),
      conditions: rule.conditions,
      conditionsLabel: formatConditions(rule.conditions),
      verificationStatus: v?.status ?? 'summary_only',
      evidence,
      sourceIds: v?.sourceIds ?? [],
      verifiedAt: v?.verifiedAt,
      bppuCodes,
      examples: (rule.examples ?? []).map((ex) => ({
        id: ex.id,
        label: ex.label,
        illustrative: ex.illustrative ?? true,
        input: ex.input,
        expectedAmount: ex.expectedAmount,
        notes: ex.notes,
      })),
      notes: rule.notes,
      supersedes: rule.supersedes ?? [],
      supersededBy: rule.supersededBy ?? [],
      conflictIds: conflictIdByRuleId.get(rule.id) ?? [],
    };
  });

  // Build minimal DatabaseRow[] for the shared status derivation + timeline
  // helpers. Each rule becomes one row.
  const rows: DatabaseRow[] = detailRules.map((r) => ({
    id: r.id,
    ruleId: r.id,
    category: categorySlug,
    name: concept.name,
    rate: r.rateLabel,
    validFrom: r.validFrom,
    validToExclusive: r.validToExclusive,
    verification: r.verificationStatus,
    conflict: r.conflictIds.length > 0,
    superseded: r.supersededBy.length > 0,
  }));

  const earliestValidFrom = conceptRules[0]?.validFrom ?? '';
  const hasOpenEnded = detailRules.some((r) => r.validToExclusive === null);
  const latestValidToExclusive = hasOpenEnded
    ? null
    : detailRules.reduce<string | null>((acc, r) => {
        if (acc === null) return r.validToExclusive;
        if (r.validToExclusive === null) return r.validToExclusive;
        return r.validToExclusive > acc ? r.validToExclusive : acc;
      }, null);

  // Build a ruleId -> conceptId map across the WHOLE corpus so cross-concept
  // relation links resolve to the page that actually documents the target rule
  // (Task 9 review I3).
  const ruleIdToConceptId = new Map<string, string>();
  for (const r of rules) ruleIdToConceptId.set(r.id, r.conceptId);

  return {
    id: concept.id,
    name: concept.name,
    description: concept.description,
    categoryId: concept.categoryId,
    categoryName,
    categorySlug,
    rules: detailRules,
    sourcesById,
    conflictsById,
    ruleIdToConceptId,
    rows,
    earliestValidFrom,
    latestValidToExclusive,
    apiUrl: `/api/v2/concepts/${encodeURIComponent(concept.id)}.json`,
    categoryUrl: `/kategori/${encodeURIComponent(categorySlug)}`,
  };
}

/**
 * List every concept id in the corpus. Used by /tarif/[id].astro's
 * `getStaticPaths` so every concept emits exactly one detail route, locked to
 * the same source of truth as the root database.
 */
export function listConceptIds(corpus: DetailCorpus): string[] {
  return corpus.data.concepts.map((c) => c.id).sort((a, b) => a.localeCompare(b));
}
