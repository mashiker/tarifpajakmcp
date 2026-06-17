import { readFileSync, writeFileSync, readdirSync, existsSync } from 'fs';
import { join, basename } from 'path';
import Ajv from 'ajv';

const ROOT = new URL('..', import.meta.url).pathname;

// ── Load schemas ──────────────────────────────────────────────
const ajv = new Ajv({ allErrors: true, strict: false });

const taxRateSchema = JSON.parse(readFileSync(join(ROOT, 'data/schema/tax-rate-entry.json'), 'utf-8'));
const regulationSchema = JSON.parse(readFileSync(join(ROOT, 'data/schema/regulation.json'), 'utf-8'));
const consolidatedLawSchema = JSON.parse(readFileSync(join(ROOT, 'data/schema/consolidated-law.json'), 'utf-8'));

const validateTaxRate = ajv.compile(taxRateSchema);
const validateRegulation = ajv.compile(regulationSchema);
const validateConsolidatedLaw = ajv.compile(consolidatedLawSchema);

// ── Load regulations ──────────────────────────────────────────
const regDir = join(ROOT, 'data/regulations');
const regulations: any[] = [];

for (const file of readdirSync(regDir).filter(f => f.endsWith('.json'))) {
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

for (const file of readdirSync(catDir).filter(f => f.endsWith('.json'))) {
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
  for (const file of readdirSync(consDir).filter(f => f.endsWith('.json'))) {
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
// Write to BOTH root public/ (for API consumers) and website/public/
// (for the website itself to read at build/dev time).
const publicDir = join(ROOT, 'public');
const websitePublicDir = join(ROOT, 'website', 'public');

/** Write a file to both public dirs so the website and root API stay in sync. */
function writePublic(name: string, content: string) {
  writeFileSync(join(publicDir, name), content);
  writeFileSync(join(websitePublicDir, name), content);
}

// api.json - full database (with consolidated laws)
const apiData = {
  meta: {
    name: 'tarif-pajak-id',
    version: '0.2.0',
    description: 'Open database tarif pajak Indonesia + UU Konsolidasi',
    lastUpdated: new Date().toISOString().split('T')[0],
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

writePublic('api.json', JSON.stringify(apiData, null, 2));
console.log('📝 Generated public/api.json (+ website/public/api.json)');

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

writePublic('rates.json', JSON.stringify(ratesData, null, 2));
console.log('📝 Generated public/rates.json');

// regulations.json
writePublic('regulations.json', JSON.stringify(regulations, null, 2));
console.log('📝 Generated public/regulations.json');

// consolidated.json - standalone consolidated laws file
writePublic('consolidated.json', JSON.stringify(consolidatedLaws, null, 2));
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

const llms = `# Tarif Pajak Indonesia Open Database (tarif-pajak-id)

> Database tarif pajak Indonesia yang bersumber dari regulasi resmi.
> Versi: 0.2.0 | Terverifikasi: ${new Date().toISOString().split('T')[0]}
> Lisensi: MIT (kode) + CC-BY-SA (data)

## Statistik
- ${regulations.length} regulasi tercatat
- ${allEntries.length} entry tarif pajak (${berlakuEntries.length} berlaku saat ini)
- ${categories.length} kategori pajak
- ${consolidatedLaws.length} UU konsolidasi

## Kategori Pajak
${categories.map(c => `- **${c.taxType}** (${c.category}): ${c.entries.length} tarif - ${c.description}`).join('\n')}

## Tarif yang Sedang Berlaku
${berlakuEntries.map(e => `### ${e.taxType} - ${e.transactionType}
- ID: ${e.id}
- Tarif: ${e.rate.type === 'percentage' ? e.rate.value + '%' : e.rate.type === 'range' ? e.rate.value[0] + '% - ' + e.rate.value[1] + '%' : e.rate.type === 'progressive' ? 'Progresif ' + e.rate.brackets?.length + ' lapis' : String(e.rate.value)}
- Status: ${e.status}
- Berlaku sejak: ${e.effectiveFrom}
- Dasar hukum: ${e.legalBasis.map(l => l.regulation).join(', ')}
${e.notes ? '- Catatan: ' + e.notes.substring(0, 200) : ''}`).join('\n\n')}
${consolidatedSection}
## Disclaimer
Database ini adalah referensi bersumber dari regulasi resmi, BUKAN nasihat hukum atau pajak.
Selalu verifikasi dengan peraturan resmi terbaru.

## Links
- API: https://tarif-pajak-id.pages.dev/api.json
- Consolidated: https://tarif-pajak-id.pages.dev/consolidated.json
- Website: https://tarif-pajak-id.pages.dev
- GitHub: https://github.com/mashiker/tarifpajakmcp
- Sumber regulasi: pasal.id, peraturan.bpk.go.id, peraturan.go.id
`;

writePublic('llms.txt', llms);
console.log('📝 Generated public/llms.txt');

console.log('\n✅ Build complete!');
console.log(`   Regulations: ${regulations.length}`);
console.log(`   Tax entries: ${allEntries.length}`);
console.log(`   Active: ${berlakuEntries.length}`);
console.log(`   Categories: ${categories.length}`);
console.log(`   Consolidated Laws: ${consolidatedLaws.length}`);
console.log(`   Total consolidated pasals: ${consolidatedLaws.reduce((sum, l) => sum + l.pasals.length, 0)}`);
