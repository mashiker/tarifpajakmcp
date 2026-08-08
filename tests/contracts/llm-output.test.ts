// Contract test for Task 10 LLM-friendly output.
//
// Task 10 regenerates `llms.txt` (concise) and `llms-full.txt` (verbose) from
// the canonical v2 rules — NOT from the legacy v1 aggregate. The output must:
//
//   - cite v2 rule counts that agree with the v2 data (no stale v1 numbers)
//   - surface the determination semantics (`tepat`, `bersyarat`, `rentang`,
//     `fakta_kurang`, `konflik_sumber`)
//   - explicitly call out the publishable statuses and forbid definite advice
//     for `source_conflict` / `summary_only` / missing-facts cases
//   - NEVER list `needs_review` numbers under "currently applicable verified
//     rates"
//   - link to the canonical origin, not vercel.app
//   - mention llms-full.txt and the API endpoints so an LLM can self-route
//
// RED-first: every assertion below is written before the implementation.

import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { beforeAll, describe, expect, it } from 'vitest';
import { getProjectPaths } from '../../src/paths.ts';

const paths = getProjectPaths();
const CANONICAL_ORIGIN = 'https://tarif-pajak-id.pages.dev';

interface V2Rules {
  data?: never;
}
interface CorpusShape {
  data: { rules: { id: string; conceptId: string; validToExclusive: string | null; verification?: { status: string } }[] };
  release?: { generatedAt?: string };
}

let llmsTxt: string;
let llmsFullTxt: string;
let corpus: CorpusShape;

beforeAll(async () => {
  try {
    llmsTxt = await readFile(join(paths.stagingPublic, 'llms.txt'), 'utf8');
  } catch {
    llmsTxt = '';
  }
  try {
    llmsFullTxt = await readFile(join(paths.stagingPublic, 'llms-full.txt'), 'utf8');
  } catch {
    llmsFullTxt = '';
  }
  corpus = JSON.parse(await readFile(join(paths.stagingPublic, 'api/v2/rules-corpus.json'), 'utf8'));
});

describe('llms output — generated and canonical', () => {
  it('both llms.txt and llms-full.txt are generated and non-empty', () => {
    expect(llmsTxt.length).toBeGreaterThan(0);
    expect(llmsFullTxt.length).toBeGreaterThan(0);
  });

  it('llms-full.txt is strictly larger than llms.txt', () => {
    expect(llmsFullTxt.length).toBeGreaterThan(llmsTxt.length);
  });

  it('both reference the canonical origin, not vercel.app', () => {
    expect(llmsTxt).toContain(CANONICAL_ORIGIN);
    expect(llmsFullTxt).toContain(CANONICAL_ORIGIN);
    expect(llmsTxt).not.toContain('vercel.app');
    expect(llmsFullTxt).not.toContain('vercel.app');
  });

  it('both link to llms-full.txt and the v2 API', () => {
    expect(llmsTxt).toContain('llms-full.txt');
    expect(llmsTxt).toContain('/api/v2/');
    expect(llmsFullTxt).toContain('/api/v2/');
  });
});

describe('llms output — counts agree with v2 data', () => {
  it('the rule count cited matches the v2 rules corpus length', () => {
    const v2RuleCount = corpus.data.rules.length;
    expect(v2RuleCount).toBeGreaterThan(0);
    // The text must mention the exact rule count somewhere.
    expect(llmsTxt).toContain(String(v2RuleCount));
    expect(llmsFullTxt).toContain(String(v2RuleCount));
  });

  it('the concept count cited matches the v2 concepts', async () => {
    const concepts = JSON.parse(await readFile(join(paths.stagingPublic, 'api/v2/concepts/index.json'), 'utf8'));
    const conceptCount = concepts.data.concepts.length;
    expect(conceptCount).toBeGreaterThan(0);
    expect(llmsFullTxt).toContain(String(conceptCount));
  });

  it('the open-ended ("currently applicable") rule count cited matches the v2 open-ended rules', () => {
    const openEnded = corpus.data.rules.filter((r) => !r.validToExclusive).length;
    expect(openEnded).toBeGreaterThan(0);
    expect(llmsTxt).toContain(String(openEnded));
    expect(llmsFullTxt).toContain(String(openEnded));
  });
});

describe('llms output — determination semantics + status restrictions', () => {
  it('explains the determination values used by the resolver', () => {
    for (const term of ['tepat', 'bersyarat', 'rentang', 'fakta_kurang', 'konflik_sumber']) {
      expect(llmsTxt.toLowerCase()).toContain(term);
    }
    // llms-full must define each term.
    for (const term of ['tepat', 'bersyarat', 'rentang', 'fakta_kurang', 'konflik_sumber']) {
      expect(llmsFullTxt.toLowerCase()).toContain(term);
    }
  });

  it('explains that source_conflict must NOT produce definite advice', () => {
    expect(llmsTxt.toLowerCase()).toContain('source_conflict');
    expect(llmsFullTxt.toLowerCase()).toContain('source_conflict');
    // Both files must explicitly forbid definite answers under conflict.
    expect(llmsFullTxt.toLowerCase()).toMatch(/(tidak|jangan|never|must not).*(jawaban pasti|definite)/);
  });

  it('explains that summary_only is orientation only, not a calculator', () => {
    expect(llmsFullTxt.toLowerCase()).toContain('summary_only');
    expect(llmsFullTxt.toLowerCase()).toMatch(/orient/);
  });

  it('explains that missing facts must NOT become definite advice', () => {
    // fakta_kurang determination -> resolver must not return a single tepat.
    expect(llmsFullTxt.toLowerCase()).toContain('fakta_kurang');
    expect(llmsFullTxt.toLowerCase()).toMatch(/(fakta|fact).*(kurang|lengkap|missing)/);
  });
});

describe('llms output — never lists needs_review numbers as verified', () => {
  it('does not introduce needs_review rule counts under a "currently applicable verified rates" section', () => {
    // We cannot assert on every phrasing, but the file must NOT contain a
    // pattern like "X aturan verified_primary saat ini" where X is the count
    // of needs_review rules. Concretely: the needs_review count must never be
    // listed adjacent to the words "verified" or "berlaku" as if it were the
    // verified count.
    //
    // We match the count as a whole word/number (anchored by non-digit
    // boundaries) so the needs_review count "4" does not match a substring of
    // "34" (the verified_primary count) or "14".
    const needsReviewRules = corpus.data.rules.filter((r) => r.verification?.status === 'needs_review');
    if (needsReviewRules.length === 0) return; // vacuously true if no such rules
    const needsReviewCount = String(needsReviewRules.length);
    const countRe = new RegExp(`(^|\\D)${needsReviewCount}(\\D|$)`);

    // Find any line that mentions the needs_review count AND "verified" in a
    // way that suggests the count is the verified count. We additionally
    // require the line to NOT also mention "needs_review" (a caveat line that
    // honestly labels the count is fine).
    const riskyLines = llmsTxt
      .split('\n')
      .filter((line) => countRe.test(line) && /verified|terverifikasi/i.test(line) && !/needs_review/i.test(line));
    expect(
      riskyLines,
      `llms.txt must not list the needs_review count (${needsReviewCount}) next to "verified" without labelling it needs_review`,
    ).toEqual([]);
  });

  it('the "currently applicable verified rates" count equals the verified_primary open-ended rules', () => {
    const verifiedPrimaryOpen = corpus.data.rules.filter(
      (r) => !r.validToExclusive && r.verification?.status === 'verified_primary',
    ).length;
    expect(verifiedPrimaryOpen).toBeGreaterThan(0);
    // The concise llms.txt must cite this exact count for the verified-current
    // surface so an LLM does not over-state applicability.
    expect(llmsTxt).toContain(String(verifiedPrimaryOpen));
  });

  it('explicitly surfaces the count of needs_review and source_conflict rules as caveats', () => {
    const needsReviewCount = corpus.data.rules.filter((r) => r.verification?.status === 'needs_review').length;
    const conflictCount = corpus.data.rules.filter((r) => r.verification?.status === 'source_conflict').length;
    // llms-full must name these as caveats (even if zero, it must declare them).
    if (needsReviewCount > 0) {
      expect(llmsFullTxt).toContain(String(needsReviewCount));
      expect(llmsFullTxt.toLowerCase()).toContain('needs_review');
    }
    if (conflictCount > 0) {
      expect(llmsFullTxt).toContain(String(conflictCount));
      expect(llmsFullTxt.toLowerCase()).toContain('source_conflict');
    }
  });
});

describe('llms output — verified_primary total vs open-ended subset (review I1)', () => {
  // The reviewer found a wording bug: the open-ended+verified_primary count
  // (34) was labelled "aturan saat ini berstatus verified_primary", which an
  // LLM would read as the TOTAL count of rules with that status. The true
  // total is 47 (13 rules with verified_primary have a closed validToExclusive
  // — i.e. historical rates that were verified but no longer apply).
  //
  // The fix surfaces BOTH numbers explicitly: one labelled as the status total
  // (47) and another labelled as the open-ended/current subset (34). The
  // labels must not be confusable.

  function counts() {
    const totalVerifiedPrimary = corpus.data.rules.filter(
      (r) => r.verification?.status === 'verified_primary',
    ).length;
    const openEndedVerifiedPrimary = corpus.data.rules.filter(
      (r) => !r.validToExclusive && r.verification?.status === 'verified_primary',
    ).length;
    const closedVerifiedPrimary = totalVerifiedPrimary - openEndedVerifiedPrimary;
    return { totalVerifiedPrimary, openEndedVerifiedPrimary, closedVerifiedPrimary };
  }

  it('sanity: the data has a non-trivial gap between total and open-ended verified_primary', () => {
    // If closedVerifiedPrimary were 0 the wording bug would be invisible; the
    // contract only protects the meaning when the two numbers diverge.
    const { totalVerifiedPrimary, openEndedVerifiedPrimary, closedVerifiedPrimary } = counts();
    expect(totalVerifiedPrimary).toBeGreaterThan(openEndedVerifiedPrimary);
    expect(closedVerifiedPrimary).toBeGreaterThan(0);
  });

  it('llms.txt cites the TRUE TOTAL verified_primary count (not just the open-ended subset)', () => {
    const { totalVerifiedPrimary } = counts();
    expect(totalVerifiedPrimary).toBeGreaterThan(0);
    expect(llmsTxt).toContain(String(totalVerifiedPrimary));
  });

  it('llms.txt labels the open-ended verified_primary count distinctly from the total', () => {
    // The open-ended subset count must appear AND must be qualified by wording
    // that ties it to "berlaku saat ini" / "open-ended" / "currently
    // applicable" — NOT to the bare status.
    const { openEndedVerifiedPrimary } = counts();
    expect(openEndedVerifiedPrimary).toBeGreaterThan(0);
    expect(llmsTxt).toContain(String(openEndedVerifiedPrimary));
    // Find every line that mentions the open-ended count and confirm at least
    // one of them is qualified as the open-ended/current subset (not the
    // status total).
    const linesWithSubsetCount = llmsTxt
      .split('\n')
      .filter((line) => new RegExp(`(^|\\D)${openEndedVerifiedPrimary}(\\D|$)`).test(line));
    expect(linesWithSubsetCount.length, 'the open-ended verified_primary count must appear at least once').toBeGreaterThan(0);
    const hasQualifiedLine = linesWithSubsetCount.some((line) =>
      /open-ended|berlaku saat ini|saat ini berlaku|currently applicable|masih berlaku/i.test(line),
    );
    expect(
      hasQualifiedLine,
      `the open-ended verified_primary count (${openEndedVerifiedPrimary}) must be qualified as open-ended/current, not as the bare verified_primary total`,
    ).toBe(true);
  });

  it('llms.txt does NOT label the open-ended verified_primary count as the status total', () => {
    // The open-ended count must never appear in a line that says "aturan
    // berstatus verified_primary" / "rules with status verified_primary"
    // WITHOUT an open-ended/current qualifier — that would read as the total.
    const { openEndedVerifiedPrimary, totalVerifiedPrimary } = counts();
    const subsetCount = String(openEndedVerifiedPrimary);
    const countRe = new RegExp(`(^|\\D)${subsetCount}(\\D|$)`);
    const misleadingLines = llmsTxt
      .split('\n')
      .filter((line) => countRe.test(line))
      .filter((line) => /verified_primary/i.test(line))
      .filter((line) => !/open-ended|berlaku saat ini|saat ini berlaku|currently applicable|masih berlaku/i.test(line));
    expect(
      misleadingLines,
      `the open-ended verified_primary count (${subsetCount}) must not appear in a verified_primary line without an open-ended/current qualifier (would read as the total ${totalVerifiedPrimary})`,
    ).toEqual([]);
  });

  it('llms-full.txt cites the TRUE TOTAL verified_primary count labelled as the status total', () => {
    const { totalVerifiedPrimary } = counts();
    expect(totalVerifiedPrimary).toBeGreaterThan(0);
    expect(llmsFullTxt).toContain(String(totalVerifiedPrimary));
    // Find at least one line citing the total and qualifying it as the status
    // total (not as open-ended/current).
    const linesWithTotal = llmsFullTxt
      .split('\n')
      .filter((line) => new RegExp(`(^|\\D)${totalVerifiedPrimary}(\\D|$)`).test(line));
    expect(linesWithTotal.length).toBeGreaterThan(0);
    const hasStatusTotalLine = linesWithTotal.some((line) =>
      /total|status|verified_primary/i.test(line) && !/open-ended|berlaku saat ini|saat ini berlaku/i.test(line),
    );
    expect(
      hasStatusTotalLine,
      `the true total verified_primary count (${totalVerifiedPrimary}) must appear in a line labelled as the status total`,
    ).toBe(true);
  });

  it('llms-full.txt labels the open-ended verified_primary count as the current subset', () => {
    const { openEndedVerifiedPrimary } = counts();
    expect(openEndedVerifiedPrimary).toBeGreaterThan(0);
    expect(llmsFullTxt).toContain(String(openEndedVerifiedPrimary));
    const linesWithSubset = llmsFullTxt
      .split('\n')
      .filter((line) => new RegExp(`(^|\\D)${openEndedVerifiedPrimary}(\\D|$)`).test(line));
    expect(linesWithSubset.length).toBeGreaterThan(0);
    const hasQualifiedLine = linesWithSubset.some((line) =>
      /open-ended|berlaku saat ini|saat ini berlaku|currently applicable|masih berlaku/i.test(line),
    );
    expect(
      hasQualifiedLine,
      `the open-ended verified_primary count (${openEndedVerifiedPrimary}) must be qualified as open-ended/current in llms-full.txt`,
    ).toBe(true);
  });
});

describe('llms output — non-government disclaimer', () => {
  it('states that the database is not official government guidance', () => {
    expect(llmsTxt.toLowerCase()).toMatch(/(bukan|not).*(nasihat|advice|official|resmi)/);
    expect(llmsFullTxt.toLowerCase()).toMatch(/(bukan|not).*(nasihat|advice|official|resmi)/);
  });

  it('directs the reader to verify against primary sources', () => {
    expect(llmsFullTxt.toLowerCase()).toMatch(/(sumber primer|primary source|peraturan resmi)/);
  });
});

describe('llms output — determinism', () => {
  it('the generator is a pure function: same input -> same output', async () => {
    const { generateLlmsOutput } = await import('../../src/generators/llms.ts');
    const data = JSON.parse(await readFile(join(paths.stagingPublic, 'api/v2/rules-corpus.json'), 'utf8'));
    // Use a fixed deterministic release context mirroring the pipeline.
    const release = {
      generatedAt: '2026-08-06T00:00:00.000Z',
      sourceDateEpoch: 1789094400,
      sourceHash: '0'.repeat(64),
      gitCommit: 'unknown',
      version: '0.1.0',
    };
    const a = generateLlmsOutput({ data, release, origin: CANONICAL_ORIGIN });
    const b = generateLlmsOutput({ data, release, origin: CANONICAL_ORIGIN });
    expect(a.llmsTxt).toBe(b.llmsTxt);
    expect(a.llmsFullTxt).toBe(b.llmsFullTxt);
  });
});
