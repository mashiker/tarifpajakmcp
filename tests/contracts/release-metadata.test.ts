import { readFile } from 'node:fs/promises';
import { getProjectPaths } from '../../src/paths.js';
import { describe, expect, it } from 'vitest';

describe('release metadata', () => {
  it('is synchronized byte-for-byte and matches generated API timestamps', async () => {
    const paths = getProjectPaths();
    const [rootRelease, websiteRelease] = await Promise.all([
      readFile(`${paths.rootPublic}/release.json`),
      readFile(`${paths.websitePublic}/release.json`),
    ]);
    expect(rootRelease).toEqual(websiteRelease);
    const release = JSON.parse(rootRelease.toString());
    const apiIndex = JSON.parse(await readFile(`${paths.rootPublic}/api/v1/index.json`, 'utf8'));
    expect(apiIndex.generated).toBe(release.generatedAt);
  });
});
