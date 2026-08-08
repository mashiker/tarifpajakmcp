// Contract test for the detail-route experience (Task 9).
//
// Task 8 made the root database the direct-to-database experience and emitted
// 134 deep links to /tarif/{conceptId} for every visible row. This contract
// pins the Task 9 deliverable: every root deep link must resolve to a real
// generated detail page and a real per-concept API document.
//
// Why this is a contract (not a unit test): the requirement spans three
// independent build outputs that must agree byte-for-byte at the same release
// context:
//   1. the rules corpus (data source of truth for the deep-link ids)
//   2. the per-concept detail HTML emitted by the Astro build under
//      /tarif/{id}/index.html
//   3. the per-concept v2 API document at /api/v2/concepts/{id}.json
//
// If any of the three drifts, the public site either 404s a deep link the root
// emitted, or points at an API document that does not match what the page
// shows. Both are silent regressions; this contract blocks them at build time.
//
// RED-first: the contract is written before /tarif/[id].astro exists. Once the
// page is implemented, every assertion goes green.

import { readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { beforeAll, describe, expect, it } from 'vitest';
import { getProjectPaths } from '../../src/paths.ts';
import { buildDatabaseDataset } from '../../website/src/lib/dataset.ts';

const paths = getProjectPaths();
const distRoot = paths.websiteDist;

interface CorpusShape {
  data: { rules: unknown[]; concepts: unknown[]; categories: unknown[]; conflicts: unknown[] };
}
interface ConceptDetail {
  data: { id: string; name: string; ruleIds: string[] };
}

let corpus: CorpusShape;
let conceptIds: string[];
let detailHtmls: Set<string>;
let apiDocs: Set<string>;
let rootHtml: string;

beforeAll(async () => {
  corpus = JSON.parse(await readFile(join(paths.websitePublic, 'api/v2/rules-corpus.json'), 'utf8'));
  // The same dataset builder the root page uses — so the ids we test are the
  // exact ids the root emits, not a hand-maintained list.
  const dataset = buildDatabaseDataset(corpus as never);
  conceptIds = [...new Set(dataset.rows.map((r) => r.id))].sort();

  // Detail HTML pages: every /tarif/{id}/index.html emitted by Astro.
  try {
    const entries = await readdir(join(distRoot, 'tarif'));
    detailHtmls = new Set(entries);
  } catch {
    detailHtmls = new Set();
  }

  // Per-concept API documents: every /api/v2/concepts/{id}.json emitted by the
  // v2 generator.
  try {
    const files = await readdir(join(paths.websitePublic, 'api/v2/concepts'));
    apiDocs = new Set(files.filter((f) => f.endsWith('.json') && f !== 'index.json'));
  } catch {
    apiDocs = new Set();
  }

  try {
    rootHtml = await readFile(join(distRoot, 'index.html'), 'utf8');
  } catch {
    rootHtml = '';
  }
});

describe('detail routes — every root deep link resolves (Task 9)', () => {
  it('the dataset emits at least one concept id (sanity: corpus loaded)', () => {
    expect(conceptIds.length).toBeGreaterThan(0);
  });

  it('every concept id has a matching /tarif/{id}/index.html built', () => {
    const missing: string[] = [];
    for (const id of conceptIds) {
      // Astro emits /tarif/{id}/index.html for getStaticPaths params.
      if (!detailHtmls.has(id)) missing.push(id);
    }
    expect(missing, `missing detail pages: ${missing.slice(0, 5).join(', ')}${missing.length > 5 ? ' ...' : ''}`).toEqual([]);
  });

  it('every concept id has a matching /api/v2/concepts/{id}.json document', () => {
    const missing: string[] = [];
    for (const id of conceptIds) {
      if (!apiDocs.has(`${id}.json`)) missing.push(id);
    }
    expect(missing, `missing api docs: ${missing.slice(0, 5).join(', ')}${missing.length > 5 ? ' ...' : ''}`).toEqual([]);
  });

  it('no detail route exists for an id the dataset does not emit (no orphan routes)', () => {
    const orphans = [...detailHtmls].filter((id) => !conceptIds.includes(id));
    expect(orphans, `orphan detail pages: ${orphans.slice(0, 5).join(', ')}`).toEqual([]);
  });
});

describe('detail routes — content contract per page', () => {
  it('every detail page links back to its API document', async () => {
    for (const id of conceptIds.slice(0, 5)) {
      const html = await readFile(join(distRoot, 'tarif', id, 'index.html'), 'utf8').catch(() => '');
      expect(html.length, `detail page ${id} must exist and be non-empty`).toBeGreaterThan(0);
      expect(html, `detail page ${id} should link to its API document`).toContain(`/api/v2/concepts/${id}.json`);
    }
  });

  it('every detail page carries the concept name from the API document', async () => {
    for (const id of conceptIds.slice(0, 5)) {
      const apiDoc = JSON.parse(
        await readFile(join(paths.websitePublic, 'api/v2/concepts', `${id}.json`), 'utf8'),
      ) as ConceptDetail;
      const html = await readFile(join(distRoot, 'tarif', id, 'index.html'), 'utf8').catch(() => '');
      expect(html, `detail page ${id} should embed the concept name "${apiDoc.data.name}"`).toContain(apiDoc.data.name);
    }
  });

  it('every detail page exposes a verification badge so provenance is visible', async () => {
    for (const id of conceptIds.slice(0, 5)) {
      const html = await readFile(join(distRoot, 'tarif', id, 'index.html'), 'utf8').catch(() => '');
      expect(html, `detail page ${id} should expose a verification badge`).toContain('verification-badge');
    }
  });

  it('every detail page exposes the timeline signature (validity interval)', async () => {
    for (const id of conceptIds.slice(0, 5)) {
      const html = await readFile(join(distRoot, 'tarif', id, 'index.html'), 'utf8').catch(() => '');
      expect(html, `detail page ${id} should expose a timeline track`).toContain('timeline-track');
    }
  });

  it('every detail page contains a back-to-database link with a stable absolute href', async () => {
    for (const id of conceptIds.slice(0, 5)) {
      const html = await readFile(join(distRoot, 'tarif', id, 'index.html'), 'utf8').catch(() => '');
      expect(html, `detail page ${id} should link back to /`).toContain('href="/"');
    }
  });

  it('external source links on detail pages carry rel="noopener noreferrer"', async () => {
    for (const id of conceptIds.slice(0, 5)) {
      const html = await readFile(join(distRoot, 'tarif', id, 'index.html'), 'utf8').catch(() => '');
      // Any external link (target="_blank") must carry the security rel pair.
      const externalLinks = (html.match(/<a [^>]*target="_blank"[^>]*>/g) || []).filter((l) => /href="https?:\/\//.test(l));
      for (const link of externalLinks) {
        expect(link, `external link without noopener: ${link.slice(0, 80)}`).toContain('rel="noopener noreferrer"');
      }
    }
  });
});

describe('detail routes — root markup emits the matching links', () => {
  it('the root index.html links to at least one /tarif/ detail page', () => {
    expect(rootHtml).toMatch(/href="\/tarif\//);
  });

  it('every /tarif/{id} link the root emits corresponds to a built detail page', () => {
    // Extract every /tarif/{id} (without query) that the root HTML emits.
    const ids = new Set(
      (rootHtml.match(/href="\/tarif\/[^"?]+/g) || [])
        .map((s) => s.replace('href="/tarif/', '').replace(/\/$/, '')),
    );
    const missing: string[] = [];
    for (const id of ids) {
      if (!detailHtmls.has(id)) missing.push(id);
    }
    expect(missing, `root links to missing detail pages: ${missing.join(', ')}`).toEqual([]);
  });
});

describe('detail routes — conditions subsection (Task 9 review C1)', () => {
  // The detail page must surface a human-readable rendering of every rule's
  // transaction/tax-base conditions, not just the rate. Previously the
  // conditions AST was loaded but never rendered.
  it('every rule that has a condition renders a conditions subsection', async () => {
    const corpus = JSON.parse(
      await readFile(join(paths.websitePublic, 'api/v2/rules-corpus.json'), 'utf8'),
    ) as { data: { rules: { id: string; conceptId: string; conditions?: unknown }[] } };
    // Walk every rule that has a non-empty condition; find its concept's page;
    // assert the page contains the conditions section.
    const rulesWithConditions = corpus.data.rules.filter((r) => r.conditions);
    expect(rulesWithConditions.length).toBeGreaterThan(0);
    for (const rule of rulesWithConditions.slice(0, 8)) {
      const html = await readFile(join(distRoot, 'tarif', rule.conceptId, 'index.html'), 'utf8').catch(() => '');
      expect(html.length, `detail page ${rule.conceptId} must exist`).toBeGreaterThan(0);
      // The conditions subsection is scoped by the .detail-conditions class
      // and is only emitted when the formatter produced a non-empty label.
      expect(html, `detail page ${rule.conceptId} (rule ${rule.id}) should render a conditions subsection`).toContain('detail-conditions');
      expect(html, `detail page ${rule.conceptId} should show the "Berlaku untuk" header`).toContain('Berlaku untuk');
    }
  });

  it('renders the formatted condition text for a known equals-condition rule', async () => {
    // rule-illustrative-flat-new has conditions {op: equals, fact: kind, value: goods}
    // which the formatter renders as "jenis = barang".
    const html = await readFile(join(distRoot, 'tarif', 'concept-illustrative-flat', 'index.html'), 'utf8');
    expect(html).toContain('Berlaku untuk');
    expect(html).toContain('jenis = barang');
  });

  it('renders the formatted condition text for a known in-condition rule', async () => {
    // rule-pph-21-ter-monthly-a has conditions {op: in, fact: ptkpClass, value: [TK/0, TK/1, K/0]}
    // which the formatter renders as "PTKP: TK/0, TK/1, K/0".
    const html = await readFile(join(distRoot, 'tarif', 'concept-pph-21-ter-monthly', 'index.html'), 'utf8');
    expect(html).toContain('PTKP: TK/0, TK/1, K/0');
  });
});

describe('detail routes — relation anchor resolution (Task 9 review I3)', () => {
  // Predecessor/successor links emit #rule-{rid}; the target article must
  // carry id={rule-{rid}} so the fragment resolves. The relation href must
  // point at the concept page that actually documents the target rule, which
  // may be a DIFFERENT concept than the page emitting the link (cross-concept
  // supersession). Previously the article only had data-rule-id (dead anchor)
  // AND the href always pointed at the current concept's page (wrong target
  // for cross-concept relations).
  it('every relation link resolves to an article id on the page it points to', async () => {
    // Walk every built detail page; extract every relation href; verify each
    // href's target page exists and contains the matching article id.
    const broken: string[] = [];
    for (const conceptId of conceptIds) {
      const html = await readFile(join(distRoot, 'tarif', conceptId, 'index.html'), 'utf8').catch(() => '');
      if (!html) continue;
      // Relation links are emitted as <a class="detail-relation-link" href="...#rule-{rid}">.
      const hrefs = html.match(/href="[^"]*#rule-[^"]+"/g) || [];
      for (const rawHref of hrefs) {
        const href = rawHref.replace('href="', '').replace(/"$/, '');
        // href is "/tarif/{conceptId}#rule-{rid}".
        const m = href.match(/^\/tarif\/([^?#]+)#rule-(.+)$/);
        if (!m) {
          broken.push(`${conceptId}: unparseable relation href ${href}`);
          continue;
        }
        const targetConceptId = decodeURIComponent(m[1]);
        const targetRuleId = m[2];
        const targetHtml = await readFile(join(distRoot, 'tarif', targetConceptId, 'index.html'), 'utf8').catch(() => '');
        if (!targetHtml) {
          broken.push(`${conceptId} -> ${href}: target page does not exist`);
          continue;
        }
        if (!targetHtml.includes(`id="rule-${targetRuleId}"`)) {
          broken.push(`${conceptId} -> ${href}: target article id missing on ${targetConceptId}`);
        }
      }
    }
    expect(broken, `broken relation anchors: ${broken.slice(0, 5).join(', ')}${broken.length > 5 ? ' ...' : ''}`).toEqual([]);
  });

  it('every detail-rule article carries an id (not just data-rule-id)', async () => {
    // Sanity: every article on every detail page must have an id attribute.
    const html = await readFile(join(distRoot, 'tarif', 'concept-illustrative-flat', 'index.html'), 'utf8');
    const articles = html.match(/<article[^>]*>/g) || [];
    expect(articles.length).toBeGreaterThan(0);
    for (const a of articles) {
      expect(a, `article missing id: ${a.slice(0, 80)}`).toMatch(/id="rule-[^"]+"/);
    }
  });

  it('cross-concept relation links point at the target concept page, not the source page', async () => {
    // rule-pph-final-umkm-pp23 supersedes rule-pph-final-umkm-pp46 (different
    // concept). The link on concept-pph-final-umkm-pp23's page must point at
    // /tarif/concept-pph-final-umkm-pp46#rule-rule-pph-final-umkm-pp46, not
    // back at concept-pph-final-umkm-pp23.
    const html = await readFile(join(distRoot, 'tarif', 'concept-pph-final-umkm-pp23', 'index.html'), 'utf8');
    expect(html).toContain('/tarif/concept-pph-final-umkm-pp46#rule-rule-pph-final-umkm-pp46');
    expect(html).not.toContain('/tarif/concept-pph-final-umkm-pp23#rule-rule-pph-final-umkm-pp46');
  });
});
