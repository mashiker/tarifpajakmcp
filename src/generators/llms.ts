// LLM-friendly output generator (Task 10).
//
// Regenerates `llms.txt` (concise orientation) and `llms-full.txt` (verbose
// reference) from the canonical v2 rules corpus. Both files are derived from
// the same in-memory dataset the API serves, so the counts cited always agree
// with `/api/v2/rules-corpus.json`.
//
// Both files declare:
//   - the canonical origin (no vercel.app / placeholder GitHub refs)
//   - the determination semantics the resolver uses (tepat, bersyarat, rentang,
//     fakta_kurang, konflik_sumber)
//   - explicit restrictions: source_conflict must NEVER produce definite
//     advice; summary_only is orientation only; missing facts must NOT become
//     a definite answer.
//   - the count of currently-applicable VERIFIED_PRIMARY rules (open-ended
//     interval + verified_primary), NOT the count of needs_review rules
//   - the count of needs_review and source_conflict rules as explicit caveats
//   - a non-government disclaimer and a pointer to primary sources
//
// The generator is pure: same input -> same output (no Date.now(), no random).
// The contract test in tests/contracts/llm-output.test.ts locks determinism.

import type { ReleaseContext } from '../core/release.ts';
import { CANONICAL_ORIGIN } from '../config.ts';

interface CorpusRate {
  type: 'percentage';
  value: string;
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
  verification?: { status: string; sourceIds: string[] };
  exclusiveGroup?: string;
  notes?: string;
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

interface CorpusConflict {
  id: string;
  ruleIds: string[];
  description?: string;
}

interface RulesCorpus {
  data: {
    rules: CorpusRule[];
    concepts: CorpusConcept[];
    categories: CorpusCategory[];
    conflicts: CorpusConflict[];
  };
  release?: { generatedAt?: string };
}

interface LlmsRule {
  id: string;
  validFrom: string;
  validToExclusive: string | null;
  verification: string;
  conceptId: string;
  conceptName: string;
  categoryId?: string;
  categoryName?: string;
  categorySlug?: string;
  rateLabel: string;
  notes?: string;
}

interface GenerateLlmsOptions {
  data: RulesCorpus;
  release: ReleaseContext;
  origin?: string;
}

interface LlmsOutput {
  llmsTxt: string;
  llmsFullTxt: string;
}

const VERIFICATION_LABEL: Record<string, string> = {
  verified_primary: 'verified_primary',
  verified_secondary: 'verified_secondary',
  needs_review: 'needs_review',
  source_conflict: 'source_conflict',
  summary_only: 'summary_only',
};

function rateLabel(rate: CorpusRule['rate']): string {
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
      if (rates.length > 8) return `${Math.min(...rates)}%–${Math.max(...rates)}%`;
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

function buildLlmsRules(corpus: RulesCorpus): LlmsRule[] {
  const conceptById = new Map(corpus.data.concepts.map((c) => [c.id, c]));
  const categoryById = new Map(corpus.data.categories.map((c) => [c.id, c]));
  return corpus.data.rules
    .map((rule) => {
      const concept = conceptById.get(rule.conceptId);
      const category = rule.categoryId ? categoryById.get(rule.categoryId) : undefined;
      const slug = category?.slug ?? concept?.slug ?? rule.conceptId;
      return {
        id: rule.id,
        validFrom: rule.validFrom,
        validToExclusive: rule.validToExclusive ?? null,
        verification: rule.verification?.status ?? 'summary_only',
        conceptId: rule.conceptId,
        conceptName: concept?.name ?? rule.conceptId,
        categoryId: rule.categoryId,
        categoryName: category?.name,
        categorySlug: slug,
        rateLabel: rateLabel(rule.rate),
        notes: rule.notes,
      };
    })
    .sort((a, b) => a.id.localeCompare(b.id) || a.validFrom.localeCompare(b.validFrom));
}

interface DatasetSummary {
  ruleCount: number;
  conceptCount: number;
  categoryCount: number;
  conflictCount: number;
  openEndedCount: number;
  verifiedPrimaryTotalCount: number;
  verifiedPrimaryOpenCount: number;
  verifiedPrimaryClosedCount: number;
  verifiedSecondaryOpenCount: number;
  needsReviewCount: number;
  needsReviewOpenCount: number;
  sourceConflictCount: number;
  summaryOnlyCount: number;
}

function summarizeDataset(corpus: RulesCorpus): DatasetSummary {
  const rules = corpus.data.rules;
  const openEnded = rules.filter((r) => !r.validToExclusive);
  const verifiedPrimaryOpenCount = openEnded.filter((r) => r.verification?.status === 'verified_primary').length;
  const verifiedPrimaryTotalCount = rules.filter((r) => r.verification?.status === 'verified_primary').length;
  return {
    ruleCount: rules.length,
    conceptCount: corpus.data.concepts.length,
    categoryCount: corpus.data.categories.length,
    conflictCount: corpus.data.conflicts.length,
    openEndedCount: openEnded.length,
    verifiedPrimaryTotalCount,
    verifiedPrimaryOpenCount,
    verifiedPrimaryClosedCount: verifiedPrimaryTotalCount - verifiedPrimaryOpenCount,
    verifiedSecondaryOpenCount: openEnded.filter((r) => r.verification?.status === 'verified_secondary').length,
    needsReviewCount: rules.filter((r) => r.verification?.status === 'needs_review').length,
    needsReviewOpenCount: openEnded.filter((r) => r.verification?.status === 'needs_review').length,
    sourceConflictCount: rules.filter((r) => r.verification?.status === 'source_conflict').length,
    summaryOnlyCount: rules.filter((r) => r.verification?.status === 'summary_only').length,
  };
}

function categorySummary(corpus: RulesCorpus): { slug: string; name: string; ruleCount: number }[] {
  const counts = new Map<string, number>();
  const conceptById = new Map(corpus.data.concepts.map((c) => [c.id, c]));
  const categoryById = new Map(corpus.data.categories.map((c) => [c.id, c]));
  for (const rule of corpus.data.rules) {
    const concept = conceptById.get(rule.conceptId);
    const category = rule.categoryId ? categoryById.get(rule.categoryId) : undefined;
    const slug = category?.slug ?? concept?.slug ?? rule.conceptId;
    counts.set(slug, (counts.get(slug) ?? 0) + 1);
  }
  return corpus.data.categories
    .map((c) => ({ slug: c.slug, name: c.name, ruleCount: counts.get(c.slug) ?? 0 }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

function releaseDate(release: ReleaseContext): string {
  return release.generatedAt.split('T')[0];
}

/**
 * Build both the concise `llms.txt` and the verbose `llms-full.txt` from the
 * canonical v2 rules corpus. Pure: same input -> same output across two calls.
 */
export function generateLlmsOutput(options: GenerateLlmsOptions): LlmsOutput {
  const { data, release, origin = CANONICAL_ORIGIN } = options;
  const summary = summarizeDataset(data);
  const rules = buildLlmsRules(data);
  const cats = categorySummary(data);
  const date = releaseDate(release);

  // The concise orientation: high-level shape, current verified counts,
  // determination semantics, restrictions, and links. Aim for ~2–4k tokens.
  const llmsTxt = renderLlmsTxt({ origin, date, summary, cats, release });

  // The verbose reference: every currently-applicable verified_primary rule
  // with its rate, source citations, interval, and concept link; plus explicit
  // caveats for needs_review / source_conflict / summary_only rules.
  const llmsFullTxt = renderLlmsFullTxt({ origin, date, summary, cats, rules, release });

  return { llmsTxt, llmsFullTxt };
}

interface RenderOptions {
  origin: string;
  date: string;
  summary: DatasetSummary;
  cats: { slug: string; name: string; ruleCount: number }[];
  release: ReleaseContext;
}

function renderLlmsTxt(opts: RenderOptions): string {
  const { origin, date, summary, cats, release } = opts;
  const lines: string[] = [];
  lines.push(`# Tarif Pajak ID — LLM orientation (llms.txt)`);
  lines.push('');
  lines.push(`> Open database tarif pajak Indonesia, bersumber dari regulasi resmi Republik Indonesia.`);
  lines.push(`> Kanonik: ${origin}`);
  lines.push(`> Rilis: ${date} · versi ${release.version} · sourceHash ${release.sourceHash.slice(0, 12)}`);
  lines.push(`> Lisensi: MIT (kode) + CC-BY-SA 4.0 (data)`);
  lines.push('');
  lines.push(`## Apa ini`);
  lines.push(`Database referensi tarif pajak Indonesia (PPh, PPN, PPh Final/UMKM, dst.) yang`);
  lines.push(`bersifat machine-readable. Setiap aturan punya interval berlaku (half-open),`);
  lines.push(`kondisi penerapan, dasar hukum primer, dan status verifikasi.`);
  lines.push('');
  lines.push(`## Statistik (kanonik, dari data v2)`);
  lines.push(`- ${summary.ruleCount} aturan · ${summary.conceptCount} konsep · ${summary.categoryCount} kategori`);
  lines.push(`- ${summary.openEndedCount} aturan open-ended (masih berlaku sampai sekarang)`);
  lines.push(`- ${summary.verifiedPrimaryTotalCount} aturan berstatus verified_primary (total; ${summary.verifiedPrimaryClosedCount} historis sudah tutup interval, ${summary.verifiedPrimaryOpenCount} open-ended)`);
  lines.push(`- ${summary.verifiedPrimaryOpenCount} aturan berlaku saat ini (open-ended) DAN berstatus verified_primary`);
  lines.push(`- ${summary.needsReviewCount} aturan needs_review · ${summary.sourceConflictCount} aturan source_conflict · ${summary.summaryOnlyCount} aturan summary_only`);
  lines.push(`- ${summary.conflictCount} konflik sumber terbuka`);
  lines.push('');
  lines.push(`## Penentuan tarif (determination)`);
  lines.push(`Resolver mengembalikan satu dari lima nilai determination. JANGAN memberikan jawaban pasti bila bukan \`tepat\`.`);
  lines.push('- `tepat` — tarif tunggal cocok, semua fakta terpenuhi, didukung sumber primer.');
  lines.push('- `bersyarat` — tarif cocok tetapi butuh fakta tambahan (mis. NPWP penerima, klasifikasi BKP mewah).');
  lines.push('- `rentang` — lebih dari satu tarif sah berlaku pada tanggal itu, perlu fakta untuk memilih.');
  lines.push('- `fakta_kurang` — fakta transaksi kurang; JANGAN menebak satu angka.');
  lines.push('- `konflik_sumber` — ada konflik sumber yang belum diputuskan; JANGAN memberikan jawaban pasti.');
  lines.push('');
  lines.push(`## Status verifikasi`);
  lines.push(`- verified_primary — angka/periode/kondisi didukung sumber primer resmi.`);
  lines.push(`- verified_secondary — sudah ditinjau tetapi sumber primer belum lengkap.`);
  lines.push(`- needs_review — belum cukup untuk klaim pasti; JANGAN ditulis sebagai tarif berlaku.`);
  lines.push(`- source_conflict — konflik sumber yang belum diputuskan; tidak boleh jadi jawaban pasti.`);
  lines.push(`- summary_only — berguna untuk orientasi saja, BUKAN kalkulator.`);
  lines.push('');
  lines.push(`## Batasan penting`);
  lines.push(`- Total ${summary.verifiedPrimaryTotalCount} aturan berstatus verified_primary (di seluruh dataset, termasuk yang historis). Dari jumlah itu, ${summary.verifiedPrimaryOpenCount} berlaku saat ini (open-ended) — itulah angka yang boleh dirujuk sebagai "tarif berlaku terverifikasi".`);
  lines.push(`- needs_review (${summary.needsReviewCount} aturan) dan source_conflict (${summary.sourceConflictCount} aturan) TIDAK boleh muncul sebagai tarif berlaku.`);
  lines.push(`- summary_only (${summary.summaryOnlyCount} aturan) hanya orientasi, bukan kalkulator.`);
  lines.push(`- Database ini BUKAN nasihat pajak resmi dan BUKAN panduan pemerintah. Konteks fakta transaksi menentukan penerapan tarif. Selalu verifikasi ke sumber primer.`);
  lines.push('');
  lines.push(`## Kategori (dengan jumlah aturan)`);
  for (const c of cats) {
    lines.push(`- ${c.name} (\`/kategori/${c.slug}\`): ${c.ruleCount} aturan`);
  }
  lines.push('');
  lines.push(`## Endpoint AI-friendly`);
  lines.push(`- Ringkasan lengkap: ${origin}/llms-full.txt`);
  lines.push(`- Index v2: ${origin}/api/v2/index.json`);
  lines.push(`- Corpus aturan (untuk resolve client-side): ${origin}/api/v2/rules-corpus.json`);
  lines.push(`- Tahun: ${origin}/api/v2/by-year/index.json`);
  lines.push(`- Tanggal: ${origin}/api/v2/at-date/index.json`);
  lines.push(`- OpenAPI: ${origin}/api/v2/openapi.json`);
  lines.push(`- Search index: ${origin}/api/v2/search-index.json`);
  lines.push('');
  lines.push(`## Sumber primer`);
  lines.push(`- JDIH BPK: https://peraturan.bpk.go.id`);
  lines.push(`- DJP/Kemenkeu: https://www.pajak.go.id`);
  lines.push(`- Portal peraturan: https://peraturan.go.id`);
  lines.push('');
  lines.push(`## Disclaimer`);
  lines.push(`Database ini adalah referensi bersumber dari regulasi resmi Republik Indonesia,`);
  lines.push(`BUKAN nasihat pajak resmi dan BUKAN panduan pemerintah. Selalu verifikasi`);
  lines.push(`dengan peraturan resmi terbaru sebelum mengambil keputusan perpajakan.`);
  return lines.join('\n') + '\n';
}

interface RenderFullOptions extends RenderOptions {
  rules: LlmsRule[];
}

function renderLlmsFullTxt(opts: RenderFullOptions): string {
  const { origin, date, summary, cats, rules, release } = opts;

  // Currently applicable verified rules — verified_primary AND open-ended.
  const verifiedOpen = rules.filter(
    (r) => !r.validToExclusive && r.verification === 'verified_primary',
  );
  // Caveats: needs_review / source_conflict / summary_only (any interval).
  const needsReview = rules.filter((r) => r.verification === 'needs_review');
  const conflicts = rules.filter((r) => r.verification === 'source_conflict');
  const summaryOnly = rules.filter((r) => r.verification === 'summary_only');

  const lines: string[] = [];
  lines.push(`# Tarif Pajak ID — LLM reference (llms-full.txt)`);
  lines.push('');
  lines.push(`> Database tarif pajak Indonesia, kanonik: ${origin}`);
  lines.push(`> Rilis: ${date} · versi ${release.version} · sourceHash ${release.sourceHash.slice(0, 12)}`);
  lines.push(`> Lisensi: MIT (kode) + CC-BY-SA 4.0 (data)`);
  lines.push('');
  lines.push(`## Apa ini`);
  lines.push(`Database referensi tarif pajak Indonesia yang machine-readable. Aturan memiliki:`);
  lines.push(`- ID aturan stabil + ID konsep stabil`);
  lines.push(`- interval berlaku half-open: \`validFrom <= date < validToExclusive\``);
  lines.push(`- pemisahan valid time vs waktu pencatatan dataset`);
  lines.push(`- kondisi penerapan terstruktur (fact + op + value)`);
  lines.push(`- rate union bertipe (percentage, fixed, specific, progressive, formula, range, free_text, zero, not_applicable, information_factor)`);
  lines.push(`- provenance dan status verifikasi per klaim`);
  lines.push('');
  lines.push(`## Statistik kanonik (data v2)`);
  lines.push(`- ${summary.ruleCount} aturan`);
  lines.push(`- ${summary.conceptCount} konsep`);
  lines.push(`- ${summary.categoryCount} kategori`);
  lines.push(`- ${summary.openEndedCount} aturan open-ended (tidak punya validToExclusive)`);
  lines.push(`- ${summary.verifiedPrimaryTotalCount} aturan berstatus verified_primary (total di seluruh dataset)`);
  lines.push(`- ${summary.verifiedPrimaryOpenCount} aturan berlaku saat ini (open-ended) DAN berstatus verified_primary`);
  lines.push(`- ${summary.verifiedPrimaryClosedCount} aturan verified_primary historis (sudah tutup interval)`);
  lines.push(`- ${summary.verifiedSecondaryOpenCount} aturan saat ini verified_secondary`);
  lines.push(`- ${summary.needsReviewCount} aturan needs_review (${summary.needsReviewOpenCount} open-ended)`);
  lines.push(`- ${summary.sourceConflictCount} aturan source_conflict`);
  lines.push(`- ${summary.summaryOnlyCount} aturan summary_only`);
  lines.push(`- ${summary.conflictCount} konflik sumber terbuka`);
  lines.push('');
  lines.push(`## Penentuan tarif (determination)`);
  lines.push(`Resolver mengembalikan satu dari lima nilai. Aturan main: JANGAN berikan jawaban pasti bila bukan \`tepat\`.`);
  lines.push('- `tepat` — satu tarif cocok, semua fakta terpenuhi, didukung sumber primer. Hanya inilah yang boleh dilaporkan sebagai "tarif berlaku".');
  lines.push('- `bersyarat` — tarif cocok tetapi memerlukan fakta tambahan yang belum dipenuhi (mis. status NPWP penerima, klasifikasi BKP mewah, status konsumen akhir retail). Laporkan sebagai kondisional.');
  lines.push('- `rentang` — lebih dari satu tarif sah berlaku pada tanggal tersebut; fakta harus memilih. Laporkan rentang dan kondisi, bukan satu angka.');
  lines.push('- `fakta_kurang` — fakta transaksi kurang. JANGAN menebak satu angka. Minta fakta tambahan dan tampilkan kandidat.');
  lines.push('- `konflik_sumber` — ada konflik sumber yang belum diputuskan. JANGAN pernah memberikan jawaban pasti; tampilkan konflik.');
  lines.push('');
  lines.push(`## Status verifikasi`);
  lines.push(`Setiap aturan punya status verifikasi. Hanya \`verified_primary\` yang boleh dirujuk sebagai tarif berlaku:`);
  lines.push(`- verified_primary — angka, periode, dan kondisi didukung sumber primer resmi beserta locator.`);
  lines.push(`- verified_secondary — sudah ditinjau tetapi sumber primer belum lengkap.`);
  lines.push(`- needs_review — belum cukup untuk klaim pasti. JANGAN ditulis sebagai tarif berlaku, bahkan bila intervalnya open-ended.`);
  lines.push(`- source_conflict — ada konflik sumber yang belum diputuskan; resolver tidak boleh mengembalikan \`tepat\` dari aturan ini.`);
  lines.push(`- summary_only — berguna sebagai orientasi, BUKAN kalkulator. Jangan dijadikan dasar angka final tanpa sumber primer.`);
  lines.push('');
  lines.push(`## Kategori (dengan jumlah aturan)`);
  for (const c of cats) {
    lines.push(`- ${c.name} — ${c.ruleCount} aturan — ${origin}/kategori/${c.slug}`);
  }
  lines.push('');
  lines.push(`## Tarif berlaku saat ini yang terverifikasi (verified_primary, open-ended)`);
  lines.push(`Total ${summary.verifiedPrimaryTotalCount} aturan di seluruh dataset berstatus verified_primary, tetapi hanya ${verifiedOpen.length} di antaranya yang berlaku saat ini (open-ended). Sisanya (${summary.verifiedPrimaryClosedCount}) verified_primary historis sudah tutup interval dan tidak berlaku lagi.`);
  lines.push(`Daftar di bawah ini hanya berisi ${verifiedOpen.length} aturan yang open-ended DAN verified_primary. Inilah "tarif berlaku terverifikasi".`);
  lines.push(`(Catatan: ${summary.needsReviewOpenCount} aturan needs_review open-ended TIDAK termasuk di daftar ini.)`);
  lines.push('');
  // Group verified-open rules by category for readability.
  const byCategory = new Map<string, LlmsRule[]>();
  for (const r of verifiedOpen) {
    const key = r.categorySlug ?? r.conceptId;
    if (!byCategory.has(key)) byCategory.set(key, []);
    byCategory.get(key)!.push(r);
  }
  const sortedKeys = [...byCategory.keys()].sort();
  for (const key of sortedKeys) {
    const groupRules = byCategory.get(key)!.sort((a, b) => a.conceptName.localeCompare(b.conceptName));
    const categoryName = groupRules[0]?.categoryName ?? key;
    lines.push(`### ${categoryName}`);
    for (const r of groupRules) {
      const interval = `${r.validFrom} → sekarang`;
      lines.push(`- ${r.conceptName} — ${r.rateLabel} — ${interval} — ${r.id} — ${origin}/tarif/${r.conceptId}`);
    }
    lines.push('');
  }
  lines.push(`## Aturan dengan caveats (JANGAN dirujuk sebagai tarif berlaku)`);
  lines.push('');
  if (needsReview.length > 0) {
    lines.push(`### needs_review (${needsReview.length} aturan)`);
    lines.push(`Aturan ini belum cukup untuk klaim pasti. TIDAK boleh muncul sebagai tarif berlaku terverifikasi.`);
    for (const r of needsReview) {
      const interval = r.validToExclusive ? `${r.validFrom} → ${r.validToExclusive}` : `${r.validFrom} → sekarang`;
      lines.push(`- ${r.conceptName} — ${r.rateLabel} — ${interval} — ${r.id}`);
    }
    lines.push('');
  }
  if (conflicts.length > 0) {
    lines.push(`### source_conflict (${conflicts.length} aturan)`);
    lines.push(`Aturan ini berada dalam konflik sumber yang belum diputuskan. Resolver tidak boleh mengembalikan \`tepat\` dari sini. JANGAN pernah memberikan jawaban pasti.`);
    for (const r of conflicts) {
      const interval = r.validToExclusive ? `${r.validFrom} → ${r.validToExclusive}` : `${r.validFrom} → sekarang`;
      lines.push(`- ${r.conceptName} — ${r.rateLabel} — ${interval} — ${r.id}`);
    }
    lines.push('');
  }
  if (summaryOnly.length > 0) {
    lines.push(`### summary_only (${summaryOnly.length} aturan)`);
    lines.push(`Aturan ini berguna untuk orientasi, BUKAN kalkulator. Jangan dijadikan dasar angka final tanpa sumber primer.`);
    for (const r of summaryOnly) {
      const interval = r.validToExclusive ? `${r.validFrom} → ${r.validToExclusive}` : `${r.validFrom} → sekarang`;
      lines.push(`- ${r.conceptName} — ${r.rateLabel} — ${interval} — ${r.id}`);
    }
    lines.push('');
  }
  lines.push(`## Endpoint AI-friendly`);
  lines.push(`- Index v2: ${origin}/api/v2/index.json`);
  lines.push(`- Aturan: ${origin}/api/v2/rules/index.json`);
  lines.push(`- Konsep: ${origin}/api/v2/concepts/index.json`);
  lines.push(`- Corpus aturan (untuk resolve client-side): ${origin}/api/v2/rules-corpus.json`);
  lines.push(`- Per tahun: ${origin}/api/v2/by-year/index.json`);
  lines.push(`- Per tanggal: ${origin}/api/v2/at-date/index.json`);
  lines.push(`- Sumber/provenance: ${origin}/api/v2/sources/index.json`);
  lines.push(`- OpenAPI v1+v2: ${origin}/api/v1/openapi.json · ${origin}/api/v2/openapi.json`);
  lines.push(`- Search index: ${origin}/api/v2/search-index.json`);
  lines.push(`- Ringkasan: ${origin}/llms.txt`);
  lines.push('');
  lines.push(`## Sumber primer`);
  lines.push(`- JDIH BPK: https://peraturan.bpk.go.id`);
  lines.push(`- DJP/Kemenkeu: https://www.pajak.go.id`);
  lines.push(`- Portal peraturan Kemenkeu: https://peraturan.go.id`);
  lines.push(`- Pasal.id (permen/.pdf): https://pasal.id`);
  lines.push('');
  lines.push(`## Disclaimer`);
  lines.push(`Database ini adalah referensi bersumber dari regulasi resmi Republik Indonesia,`);
  lines.push(`BUKAN nasihat pajak resmi dan BUKAN panduan pemerintah. Konteks fakta transaksi`);
  lines.push(`menentukan penerapan tarif. Selalu verifikasi ke sumber primer resmi terbaru`);
  lines.push(`sebelum mengambil keputusan perpajakan.`);
  return lines.join('\n') + '\n';
}
