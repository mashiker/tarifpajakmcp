import { mkdtemp, mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { syncGeneratedArtifacts } from '../../src/sync-website.js';

const temporaryDirectories: string[] = [];

afterEach(async () => {
  await Promise.all(temporaryDirectories.splice(0).map((directory) => rm(directory, { recursive: true, force: true })));
});

describe('generated artifact synchronization', () => {
  it('copies manifest artifacts byte-identically and preserves manual website assets', async () => {
    const root = await mkdtemp(join(tmpdir(), 'tarif-sync-'));
    temporaryDirectories.push(root);
    const staging = join(root, 'staging');
    const rootPublic = join(root, 'public');
    const websitePublic = join(root, 'website-public');

    await mkdir(join(staging, 'api', 'v1'), { recursive: true });
    await mkdir(join(websitePublic, 'images'), { recursive: true });
    await writeFile(join(staging, 'api.json'), Buffer.from([0, 1, 2, 255]));
    await writeFile(join(staging, 'api', 'v1', 'index.json'), '{"ok":true}\n');
    await writeFile(join(websitePublic, 'favicon.svg'), '<svg>manual</svg>');
    await writeFile(join(websitePublic, 'images', 'manual.txt'), 'keep');

    const manifest = await syncGeneratedArtifacts({ staging, rootPublic, websitePublic });

    expect(manifest.files.map((file) => file.path)).toEqual(['api.json', 'api/v1/index.json']);
    for (const file of manifest.files) {
      expect(await readFile(join(rootPublic, file.path))).toEqual(await readFile(join(websitePublic, file.path)));
    }
    expect(await readFile(join(websitePublic, 'favicon.svg'), 'utf8')).toBe('<svg>manual</svg>');
    expect(await readFile(join(websitePublic, 'images', 'manual.txt'), 'utf8')).toBe('keep');
    expect((await readdir(rootPublic)).sort()).toContain('generated-manifest.json');
    expect(await readFile(join(rootPublic, 'generated-manifest.json'))).toEqual(
      await readFile(join(websitePublic, 'generated-manifest.json')),
    );
  });

  it.each(['../manual.txt', '../../package.json', '/tmp/outside.txt', 'C:\\outside.txt'])('rejects unsafe manifest path %s without touching outside sentinels', async (unsafePath) => {
    const root = await mkdtemp(join(tmpdir(), 'tarif-sync-unsafe-'));
    temporaryDirectories.push(root);
    const staging = join(root, 'staging');
    const rootPublic = join(root, 'public');
    const websitePublic = join(root, 'website-public');
    const outsideManual = join(root, 'manual.txt');
    const outsidePackage = join(root, 'package.json');

    await mkdir(staging, { recursive: true });
    await mkdir(rootPublic, { recursive: true });
    await mkdir(websitePublic, { recursive: true });
    await writeFile(join(staging, 'safe.json'), '{}\n');
    await writeFile(outsideManual, 'manual sentinel');
    await writeFile(outsidePackage, 'package sentinel');
    await writeFile(join(rootPublic, 'generated-manifest.json'), JSON.stringify({
      files: [{ path: unsafePath, sha256: '0'.repeat(64), bytes: 1 }],
    }));

    await expect(syncGeneratedArtifacts({ staging, rootPublic, websitePublic })).rejects.toThrow(/manifest/i);
    expect(await readFile(outsideManual, 'utf8')).toBe('manual sentinel');
    expect(await readFile(outsidePackage, 'utf8')).toBe('package sentinel');
  });

  it('rejects malformed manifest structures before removing generated files', async () => {
    const root = await mkdtemp(join(tmpdir(), 'tarif-sync-malformed-'));
    temporaryDirectories.push(root);
    const staging = join(root, 'staging');
    const rootPublic = join(root, 'public');
    const websitePublic = join(root, 'website-public');
    await mkdir(staging, { recursive: true });
    await mkdir(rootPublic, { recursive: true });
    await mkdir(websitePublic, { recursive: true });
    await writeFile(join(rootPublic, 'keep.json'), 'sentinel');
    await writeFile(join(rootPublic, 'generated-manifest.json'), JSON.stringify({ files: [{ path: 'keep.json' }] }));

    await expect(syncGeneratedArtifacts({ staging, rootPublic, websitePublic })).rejects.toThrow(/manifest/i);
    expect(await readFile(join(rootPublic, 'keep.json'), 'utf8')).toBe('sentinel');
  });
});
