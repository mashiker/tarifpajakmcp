import { createHash } from 'node:crypto';
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { createReleaseContext, hashCanonicalInputs } from '../../src/core/release.js';

const temporaryDirectories: string[] = [];

afterEach(async () => {
  await Promise.all(temporaryDirectories.splice(0).map((directory) => rm(directory, { recursive: true, force: true })));
});

describe('release context', () => {
  it('uses SOURCE_DATE_EPOCH for one stable timestamp and canonical sorted input hash', async () => {
    const firstRoot = await mkdtemp(join(tmpdir(), 'tarif-release-a-'));
    const secondRoot = await mkdtemp(join(tmpdir(), 'tarif-release-b-'));
    temporaryDirectories.push(firstRoot, secondRoot);

    await mkdir(join(firstRoot, 'nested'));
    await writeFile(join(firstRoot, 'z.json'), '{"z":1}\n');
    await writeFile(join(firstRoot, 'nested', 'a.json'), '{"a":1}\n');

    await mkdir(join(secondRoot, 'nested'));
    await writeFile(join(secondRoot, 'nested', 'a.json'), '{"a":1}\n');
    await writeFile(join(secondRoot, 'z.json'), '{"z":1}\n');

    const expectedHash = createHash('sha256')
      .update('nested/a.json\0')
      .update(await readFile(join(firstRoot, 'nested', 'a.json')))
      .update('\0z.json\0')
      .update(await readFile(join(firstRoot, 'z.json')))
      .update('\0')
      .digest('hex');

    expect(await hashCanonicalInputs(firstRoot)).toBe(expectedHash);
    expect(await hashCanonicalInputs(secondRoot)).toBe(expectedHash);

    const first = await createReleaseContext({
      dataDirectory: firstRoot,
      sourceDateEpoch: '1704067200',
      gitCommit: 'abc123',
      version: '0.1.0',
    });
    const second = await createReleaseContext({
      dataDirectory: secondRoot,
      sourceDateEpoch: '1704067200',
      gitCommit: 'abc123',
      version: '0.1.0',
    });

    expect(first).toEqual(second);
    expect(first).toEqual({
      generatedAt: '2024-01-01T00:00:00.000Z',
      sourceDateEpoch: 1704067200,
      sourceHash: expectedHash,
      gitCommit: 'abc123',
      version: '0.1.0',
    });
  });
});
