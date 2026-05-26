import { readFileSync, writeFileSync, readdirSync, existsSync } from 'fs';
import { join, basename } from 'path';
import Ajv from 'ajv';

const ROOT = new URL('..', import.meta.url).pathname;

// ── Load schemas ──────────────────────────────────────────────
const ajv = new Ajv({ allErrors: true, strict: false });

const taxRateSchema = JSON.parse(readFileSync(join(ROOT, 'data/schema/tax-rate-entry.json'), 'utf-8'));
const regulationSchema = JSON.parse(readFileSync(join(ROOT, 'data/schema/regulation.json'), 'utf-8'));

const validateTaxRate = ajv.compile(taxRateSchema);
const validateRegulation = ajv.compile(regulationSchema);

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

// ── Generate public artifacts ─────────────────────────────────
const publicDir = join(ROOT, 'public');

// api.json - full database
const apiData = {
  meta: {
    name: 'tarif-pajak-id',
    version: '0.1.0',
    description: 'Open database tarif pajak Indonesia',
    lastUpdated: new Date().toISOString().split('T')[0],
    stats: {
      regulations: regulations.length,
      entries: allEntries.length,
      categories: categories.map(c => ({ taxType: c.taxType, count: c.entries.length }))
    }
  },
  regulations,
  categories: categories.map(c => ({
    category: c.category,
    taxType: c.taxType,
    description: c.description,
    serviceTypes: c.serviceTypes || null,
    entries: c.entries
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

// llms.txt - chatbot-friendly guide
const berlakuEntries = allEntries.filter(e => e.status === 'berlaku');
const llms = `# Tarif Pajak Indonesia Open Database (tarif-pajak-id)

> Database tarif pajak Indonesia yang bersumber dari regulasi resmi.
> Versi: 0.1.0 | Terverifikasi: ${new Date().toISOString().split('T')[0]}
> Lisensi: MIT (kode) + CC-BY-SA (data)

## Statistik
- ${regulations.length} regulasi tercatat
- ${allEntries.length} entry tarif pajak (${berlakuEntries.length} berlaku saat ini)
- ${categories.length} kategori pajak

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

## Disclaimer
Database ini adalah referensi bersumber dari regulasi resmi, BUKAN nasihat hukum atau pajak.
Selalu verifikasi dengan peraturan resmi terbaru.

## Links
- API: https://tarif-pajak-id.vercel.app/api.json
- GitHub: https://github.com/user/tarif-pajak-id
- Sumber regulasi: pasal.id, peraturan.bpk.go.id, peraturan.go.id
`;

writeFileSync(join(publicDir, 'llms.txt'), llms);
console.log('📝 Generated public/llms.txt');

console.log('\n✅ Build complete!');
console.log(`   Regulations: ${regulations.length}`);
console.log(`   Tax entries: ${allEntries.length}`);
console.log(`   Active: ${berlakuEntries.length}`);
console.log(`   Categories: ${categories.length}`);
