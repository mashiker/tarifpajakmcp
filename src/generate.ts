import { readFileSync, writeFileSync, readdirSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { getProjectPaths } from './paths.ts';
import { createReleaseContext, deriveTemporalBounds } from './core/release.ts';
import { createAjv } from './validation/ajv.ts';

const paths = getProjectPaths();
const ROOT = paths.root;
const packageJson = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8'));
export const release = await createReleaseContext({ dataDirectory: paths.data, repositoryRoot: ROOT, version: packageJson.version });
export { paths };
const releaseDate = release.generatedAt.split('T')[0];

// ── Load schemas ──────────────────────────────────────────────
const ajv = createAjv();

const taxRateSchema = JSON.parse(readFileSync(join(ROOT, 'data/schema/tax-rate-entry.json'), 'utf-8'));
const regulationSchema = JSON.parse(readFileSync(join(ROOT, 'data/schema/regulation.json'), 'utf-8'));
const consolidatedLawSchema = JSON.parse(readFileSync(join(ROOT, 'data/schema/consolidated-law.json'), 'utf-8'));

const validateTaxRate = ajv.compile(taxRateSchema);
const validateRegulation = ajv.compile(regulationSchema);
const validateConsolidatedLaw = ajv.compile(consolidatedLawSchema);

// ── Load regulations ──────────────────────────────────────────
const regDir = join(ROOT, 'data/regulations');
const regulations: any[] = [];

for (const file of readdirSync(regDir).filter(f => f.endsWith('.json')).sort()) {
  const items = JSON.parse(readFileSync(join(regDir, file), 'utf-8'));
  for (const reg of Array.isArray(items) ? items : [items]) {
    if (!validateRegulation(reg)) {
      console.error(`❌ Invalid regulation ${reg.id}: ${JSON.stringify(validateRegulation.errors?.slice(0, 3))}`);
      process.exit(1);
    }
    regulations.push(reg);
  }
}
console.log(`✅ Loaded ${regulations.length} regulations`);

// ── Load tax rate entries ─────────────────────────────────────
const catDir = join(ROOT, 'data/categories');
const categories: any[] = [];
const allEntries: any[] = [];
let errorCount = 0;

for (const file of readdirSync(catDir).filter(f => f.endsWith('.json')).sort()) {
  const catData = JSON.parse(readFileSync(join(catDir, file), 'utf-8'));
  categories.push(catData);

  for (const entry of catData.entries) {
    if (!validateTaxRate(entry)) {
      console.error(`❌ Invalid entry ${entry.id}: ${JSON.stringify(validateTaxRate.errors?.slice(0, 3))}`);
      errorCount++;
    }
    allEntries.push(entry);
  }
}

if (errorCount > 0) {
  console.error(`\n❌ ${errorCount} validation errors found. Fix before proceeding.`);
  process.exit(1);
}

console.log(`✅ Loaded ${allEntries.length} tax rate entries across ${categories.length} categories`);

// ── Load consolidated laws ────────────────────────────────────
const consDir = join(ROOT, 'data/consolidated');
const consolidatedLaws: any[] = [];

if (existsSync(consDir)) {
  for (const file of readdirSync(consDir).filter(f => f.endsWith('.json')).sort()) {
    const law = JSON.parse(readFileSync(join(consDir, file), 'utf-8'));
    if (!validateConsolidatedLaw(law)) {
      console.error(`❌ Invalid consolidated law ${law.id}: ${JSON.stringify(validateConsolidatedLaw.errors?.slice(0, 3))}`);
      process.exit(1);
    }
    consolidatedLaws.push(law);
    console.log(`  📜 ${law.shortTitle}: ${law.pasals.length} pasals, ${law.amendmentChain.length} amendments`);
  }

// ── Recompute statistics from actual data ─────────────────────
for (const law of consolidatedLaws) {
  const counts: Record<string, number> = { berlaku: 0, diubah: 0, dicabut: 0, ditambah: 0 };
  for (const p of law.pasals) {
    const s = p.status || 'berlaku';
    if (s in counts) counts[s]++;
  }
  law.statistics = {
    totalPasals: law.pasals.length,
    berlakuPasals: counts.berlaku,
    diubahPasals: counts.diubah,
    dicabutPasals: counts.dicabut,
    ditambahPasals: counts.ditambah,
    totalAmendments: law.amendmentChain.length,
  };
}

}
console.log(`✅ Loaded ${consolidatedLaws.length} consolidated laws`);

// ── Generate public artifacts ─────────────────────────────────
const publicDir = paths.stagingPublic;
mkdirSync(publicDir, { recursive: true });

// api.json - full database (with consolidated laws)
const apiData = {
  meta: {
    name: 'tarif-pajak-id',
    version: '0.2.0',
    description: 'Open database tarif pajak Indonesia + UU Konsolidasi',
    lastUpdated: releaseDate,
    stats: {
      regulations: regulations.length,
      entries: allEntries.length,
      categories: categories.map(c => ({ taxType: c.taxType, count: c.entries.length })),
      consolidatedLaws: consolidatedLaws.map(l => ({
        id: l.id,
        shortTitle: l.shortTitle,
        totalPasals: l.statistics.totalPasals,
        totalAmendments: l.statistics.totalAmendments
      }))
    }
  },
  regulations,
  categories: categories.map(c => ({
    category: c.category,
    taxType: c.taxType,
    description: c.description,
    serviceTypes: c.serviceTypes || null,
    entries: c.entries
  })),
  consolidatedLaws: consolidatedLaws.map(l => ({
    id: l.id,
    title: l.title,
    shortTitle: l.shortTitle,
    description: l.description,
    baseLaw: l.baseLaw,
    amendmentChain: l.amendmentChain.map(a => ({
      regulation: a.regulation,
      order: a.order,
      description: a.description,
      effectiveDate: a.effectiveDate,
      keyChanges: a.keyChanges || []
    })),
    structure: l.structure,
    pasals: l.pasals,
    statistics: l.statistics,
    lastUpdated: l.lastUpdated,
    sourceNotes: l.sourceNotes
  }))
};

writeFileSync(join(publicDir, 'api.json'), JSON.stringify(apiData, null, 2));
console.log('📝 Generated public/api.json');

// rates.json - normalized flat entries
const ratesData = allEntries.map(e => ({
  id: e.id,
  category: e.category,
  taxType: e.taxType,
  transactionType: e.transactionType,
  rate: e.rate,
  effectiveFrom: e.effectiveFrom,
  effectiveTo: e.effectiveTo,
  status: e.status,
  tags: e.tags
}));

writeFileSync(join(publicDir, 'rates.json'), JSON.stringify(ratesData, null, 2));
console.log('📝 Generated public/rates.json');

// regulations.json
writeFileSync(join(publicDir, 'regulations.json'), JSON.stringify(regulations, null, 2));
console.log('📝 Generated public/regulations.json');

// consolidated.json - standalone consolidated laws file
writeFileSync(join(publicDir, 'consolidated.json'), JSON.stringify(consolidatedLaws, null, 2));
console.log('📝 Generated public/consolidated.json');

// llms.txt - chatbot-friendly guide
const berlakuEntries = allEntries.filter(e => e.status === 'berlaku');

let consolidatedSection = '';
if (consolidatedLaws.length > 0) {
  consolidatedSection = `
## 📜 UU Konsolidasi
Database ini juga memuat naskah konsolidasi UU pajak Indonesia yang menunjukkan teks terkini beserta riwayat perubahan setiap pasal.

${consolidatedLaws.map(l => {
  const chain = l.amendmentChain.map((a: any) => `    - ${a.regulation.type} ${a.regulation.number}/${a.regulation.year} (${a.description})`).join('\n');
  const changedPasals = l.pasals.filter((p: any) => p.status === 'diubah').length;
  const addedPasals = l.pasals.filter((p: any) => p.status === 'ditambah').length;
  return `### ${l.shortTitle}
- ${l.statistics.totalPasals} pasal total, ${l.statistics.totalAmendments} kali perubahan
- ${changedPasals} pasal diubah, ${addedPasals} pasal ditambah, ${l.statistics.berlakuPasals} pasal berlaku sejak awal
- Dasar: ${l.baseLaw.type} ${l.baseLaw.number}/${l.baseLaw.year}
- Rantai perubahan:
${chain}`;
}).join('\n\n')}

### Cara Membaca UU Konsolidasi
- Setiap pasal memiliki \`amendmentHistory\` yang menunjukkan riwayat perubahan dari awal hingga sekarang
- \`changeType\`: original (pasal asli), amended (diubah), added (ditambah baru), repealed (dicabut), partially_amended (diubah sebagian)
- \`changedAyats\`: menunjukkan ayat mana yang berubah pada setiap perubahan
- Akses via: \`/consolidated.json\` atau \`/api.json\` field \`consolidatedLaws\`
`;
}

// llms.txt and llms-full.txt are regenerated from the canonical v2 rules by
// src/generators/llms.ts (Task 10). The legacy block (which read v1 stats and
// cited vercel.app / a placeholder GitHub user) is removed. The new generator
// lives below where the v2 corpus is loaded, so it sees the same data the API
// serves.

writeFileSync(join(publicDir, 'release.json'), JSON.stringify(release, null, 2) + '\n');
console.log('📝 Generated release.json and API v1');

console.log('\n✅ Build complete!');
console.log(`   Regulations: ${regulations.length}`);
console.log(`   Tax entries: ${allEntries.length}`);
console.log(`   Active: ${berlakuEntries.length}`);
console.log(`   Categories: ${categories.length}`);
console.log(`   Consolidated Laws: ${consolidatedLaws.length}`);
console.log(`   Total consolidated pasals: ${consolidatedLaws.reduce((sum, l) => sum + l.pasals.length, 0)}`);

// ── API surface generation (v1 + v2) ──────────────────────────
// The legacy v1 static API and the temporal v2 API are emitted by dedicated,
// contract-tested generator modules. generate.ts owns the aggregate `api.json`
// and release context; the generators own the per-endpoint JSON documents.
import { generateApiV1 } from './generators/v1.ts';
import { generateApiV2 } from './generators/v2.ts';
import type { V2Data } from './core/types.ts';
import { loadJsonFile } from './validation/load.ts';

// Load the v2 source data once and feed BOTH generators so they share a single
// in-memory dataset. The v1 generator projects the PPN calculator (and any
// future calculator surface) from the canonical v2 rules so the two cannot
// drift — this is the calculator-parity contract.
const v2DataDirectory = join(paths.data, 'v2');
const [v2Categories, v2Concepts, v2Sources, v2Rules, v2Conflicts, v2Bppu] = await Promise.all([
  loadJsonFile<any[]>(join(v2DataDirectory, 'categories.json')).catch(() => [] as any[]),
  loadJsonFile<any[]>(join(v2DataDirectory, 'concepts.json')).catch(() => [] as any[]),
  loadJsonFile<any[]>(join(v2DataDirectory, 'sources.json')).catch(() => [] as any[]),
  loadJsonFile<any[]>(join(v2DataDirectory, 'rules.json')).catch(() => [] as any[]),
  loadJsonFile<any[]>(join(v2DataDirectory, 'conflicts.json')).catch(() => [] as any[]),
  loadJsonFile<any[]>(join(v2DataDirectory, 'bppu.json')).catch(() => [] as any[]),
]);
const v2Data: V2Data = {
  sources: v2Sources,
  categories: v2Categories,
  concepts: v2Concepts,
  rules: v2Rules,
  conflicts: v2Conflicts,
  bppu: v2Bppu,
};

const v1FileCount = generateApiV1({ stagingPublic: publicDir, release, v2Rules: v2Rules as any });
console.log(`📝 Generated API v1 (${v1FileCount} files)`);

const v2FileCount = generateApiV2({ stagingPublic: publicDir, v2DataDirectory, release });
console.log(`📝 Generated API v2 (${v2FileCount} files)`);

// ── LLM-friendly output + SEO metadata (Task 10) ─────────────
// llms.txt and llms-full.txt are derived from the canonical v2 rules so the
// counts cited agree with /api/v2/rules-corpus.json. The SEO metadata
// (robots.txt, sitemap.xml, dataset JSON-LD) is derived from the same corpus +
// the static HTML route list so the sitemap never indexes a missing route.
import { generateLlmsOutput } from './generators/llms.ts';
import {
  generateMetadataArtifacts,
  DEFAULT_STATIC_HTML_ROUTES,
} from './generators/metadata.ts';
import { CANONICAL_ORIGIN } from './config.ts';

// Load the published rules corpus the same way the website does (post-v2-build)
// so the LLM generator sees exactly what the public API serves.
const corpus = JSON.parse(readFileSync(join(publicDir, 'api/v2/rules-corpus.json'), 'utf-8'));
const llmsOutput = generateLlmsOutput({ data: corpus, release, origin: CANONICAL_ORIGIN });
writeFileSync(join(publicDir, 'llms.txt'), llmsOutput.llmsTxt);
writeFileSync(join(publicDir, 'llms-full.txt'), llmsOutput.llmsFullTxt);
console.log('📝 Generated public/llms.txt and public/llms-full.txt (from v2 rules)');

const seoMetadata = generateMetadataArtifacts({
  data: corpus,
  release,
  origin: CANONICAL_ORIGIN,
  staticRoutes: DEFAULT_STATIC_HTML_ROUTES,
});
writeFileSync(join(publicDir, 'robots.txt'), seoMetadata.robotsTxt);
writeFileSync(join(publicDir, 'sitemap.xml'), seoMetadata.sitemapXml);
writeFileSync(join(publicDir, 'dataset-jsonld.json'), seoMetadata.datasetJsonLd);
console.log('📝 Generated public/robots.txt, public/sitemap.xml, public/dataset-jsonld.json');

// Note: the v2 search index (api/v2/search-index.json) is emitted inside
// generateApiV2 above. The standalone generateSearchIndex module remains the
// canonical builder used by generateApiV2, so there is no second write here;
// re-running generateSearchIndex would produce byte-identical output and is
// invoked only by its own unit/contract tests.
