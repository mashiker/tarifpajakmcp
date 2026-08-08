import { mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { loadJsonDirectory } from '../../src/validation/load.ts';

const directories: string[] = [];
afterEach(async () => Promise.all(directories.splice(0).map((directory) => rm(directory, { recursive: true, force: true }))));

describe('deterministic source loading', () => {
  it('returns the same lexical order regardless of file creation order', async () => {
    const first = await mkdtemp(join(tmpdir(), 'load-order-a-'));
    const second = await mkdtemp(join(tmpdir(), 'load-order-b-'));
    directories.push(first, second);
    await writeFile(join(first, 'z.json'), '{"id":"z"}');
    await writeFile(join(first, 'a.json'), '{"id":"a"}');
    await writeFile(join(second, 'a.json'), '{"id":"a"}');
    await writeFile(join(second, 'z.json'), '{"id":"z"}');

    expect(await loadJsonDirectory<{ id: string }>(first)).toEqual([{ id: 'a' }, { id: 'z' }]);
    expect(await loadJsonDirectory<{ id: string }>(second)).toEqual([{ id: 'a' }, { id: 'z' }]);
  });
});
