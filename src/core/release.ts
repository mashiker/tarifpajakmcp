import { createHash } from 'node:crypto';
import { readdir, readFile } from 'node:fs/promises';
import { relative, resolve, sep } from 'node:path';
import { execFileSync } from 'node:child_process';

export interface ReleaseContext {
  generatedAt: string;
  sourceDateEpoch: number;
  sourceHash: string;
  gitCommit: string;
  version: string;
}

interface TemporalEntry {
  effectiveFrom: string;
  effectiveTo?: string | null;
}

export function deriveTemporalBounds(entries: TemporalEntry[], generatedAt: string) {
  if (entries.length === 0) throw new Error('Cannot derive temporal bounds from an empty entry list');
  const starts = entries.map((entry) => entry.effectiveFrom).sort();
  const finiteEnds = entries.flatMap((entry) => entry.effectiveTo ? [entry.effectiveTo] : []).sort();
  const hasOpenEndedEntry = entries.some((entry) => !entry.effectiveTo);
  const startMaximumYear = Math.max(...starts.map((date) => Number(date.slice(0, 4))));
  const finiteMaximumYear = finiteEnds.length > 0 ? Number(finiteEnds.at(-1)!.slice(0, 4)) : startMaximumYear;
  const releaseYear = new Date(generatedAt).getUTCFullYear();
  return {
    minimumYear: Number(starts[0].slice(0, 4)),
    maximumYear: Math.max(startMaximumYear, finiteMaximumYear, hasOpenEndedEntry ? releaseYear : 0),
    temporalRange: { from: starts[0], to: hasOpenEndedEntry ? null : finiteEnds.at(-1) ?? starts.at(-1)! },
  };
}

interface ReleaseContextOptions {
  dataDirectory: string;
  sourceDateEpoch?: string;
  gitCommit?: string;
  version: string;
  repositoryRoot?: string;
}

async function listFiles(directory: string): Promise<string[]> {
  const files: string[] = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = resolve(directory, entry.name);
    if (entry.isDirectory()) files.push(...await listFiles(path));
    else if (entry.isFile()) files.push(path);
  }
  return files;
}

export async function hashCanonicalInputs(directory: string): Promise<string> {
  const files = (await listFiles(directory)).sort((a, b) =>
    relative(directory, a).replaceAll(sep, '/').localeCompare(relative(directory, b).replaceAll(sep, '/')),
  );
  const hash = createHash('sha256');
  for (const file of files) {
    hash.update(relative(directory, file).replaceAll(sep, '/'));
    hash.update('\0');
    hash.update(await readFile(file));
    hash.update('\0');
  }
  return hash.digest('hex');
}

function parseSourceDateEpoch(value: string | undefined): number {
  if (value === undefined) return Math.floor(Date.now() / 1000);
  if (!/^\d+$/.test(value)) throw new Error('SOURCE_DATE_EPOCH must be a non-negative integer');
  const epoch = Number(value);
  if (!Number.isSafeInteger(epoch)) throw new Error('SOURCE_DATE_EPOCH is outside the supported range');
  return epoch;
}

function detectGitCommit(repositoryRoot?: string): string {
  if (!repositoryRoot) return 'unknown';
  try {
    return execFileSync('git', ['rev-parse', 'HEAD'], { cwd: repositoryRoot, encoding: 'utf8' }).trim();
  } catch {
    return 'unknown';
  }
}

export async function createReleaseContext(options: ReleaseContextOptions): Promise<ReleaseContext> {
  const sourceDateEpoch = parseSourceDateEpoch(options.sourceDateEpoch ?? process.env.SOURCE_DATE_EPOCH);
  return {
    generatedAt: new Date(sourceDateEpoch * 1000).toISOString(),
    sourceDateEpoch,
    sourceHash: await hashCanonicalInputs(options.dataDirectory),
    gitCommit: options.gitCommit ?? detectGitCommit(options.repositoryRoot),
    version: options.version,
  };
}
