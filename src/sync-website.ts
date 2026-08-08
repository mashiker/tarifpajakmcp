import { copyFile, mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { dirname, isAbsolute, join, relative, sep, win32 } from 'node:path';
import { getProjectPaths } from './paths.ts';

export interface GeneratedManifestFile {
  path: string;
  sha256: string;
  bytes: number;
}

export interface GeneratedManifest {
  files: GeneratedManifestFile[];
}

interface SyncOptions {
  staging: string;
  rootPublic: string;
  websitePublic: string;
}

export function resolveSafeManifestPath(root: string, manifestPath: unknown): string {
  if (typeof manifestPath !== 'string' || manifestPath.length === 0) {
    throw new Error('Invalid generated manifest path');
  }
  const normalized = manifestPath.replaceAll('\\\\', '/');
  if (normalized.startsWith('/') || win32.isAbsolute(normalized)) {
    throw new Error(`Unsafe generated manifest path: ${manifestPath}`);
  }
  const segments = normalized.split('/');
  if (segments.some((segment) => segment === '..') || segments.some((segment) => segment.length === 0 || segment === '.')) {
    throw new Error(`Unsafe generated manifest path: ${manifestPath}`);
  }
  const destination = join(root, ...segments);
  const rootResolved = join(root);
  const escaped = relative(rootResolved, destination);
  if (escaped === '..' || escaped.startsWith(`..${sep}`) || isAbsolute(escaped)) {
    throw new Error(`Unsafe generated manifest path: ${manifestPath}`);
  }
  return destination;
}

function validateManifest(value: unknown): GeneratedManifest {
  if (!value || typeof value !== 'object' || !Array.isArray((value as { files?: unknown }).files)) {
    throw new Error('Invalid generated manifest structure');
  }
  const files = (value as { files: unknown[] }).files.map((file) => {
    if (!file || typeof file !== 'object') throw new Error('Invalid generated manifest file');
    const entry = file as Partial<GeneratedManifestFile>;
    resolveSafeManifestPath('.', entry.path);
    if (typeof entry.sha256 !== 'string' || !/^[a-f0-9]{64}$/.test(entry.sha256) || typeof entry.bytes !== 'number' || !Number.isInteger(entry.bytes) || entry.bytes < 0) {
      throw new Error('Invalid generated manifest file metadata');
    }
    return { path: entry.path!, sha256: entry.sha256, bytes: entry.bytes };
  });
  return { files };
}

async function listFiles(directory: string): Promise<string[]> {
  const files: string[] = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await listFiles(path));
    else if (entry.isFile()) files.push(path);
  }
  return files;
}

async function readPreviousManifest(directory: string): Promise<GeneratedManifest> {
  try {
    return validateManifest(JSON.parse(await readFile(join(directory, 'generated-manifest.json'), 'utf8')));
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return { files: [] };
    throw error;
  }
}

async function removePreviousGenerated(directory: string, manifest: GeneratedManifest): Promise<void> {
  await Promise.all(manifest.files.map((file) => rm(resolveSafeManifestPath(directory, file.path), { force: true })));
  await rm(join(directory, 'generated-manifest.json'), { force: true });
}

export async function syncGeneratedArtifacts(options: SyncOptions): Promise<GeneratedManifest> {
  await mkdir(options.rootPublic, { recursive: true });
  await mkdir(options.websitePublic, { recursive: true });
  await Promise.all([
    removePreviousGenerated(options.rootPublic, await readPreviousManifest(options.rootPublic)),
    removePreviousGenerated(options.websitePublic, await readPreviousManifest(options.websitePublic)),
  ]);

  const sourceFiles = (await listFiles(options.staging)).sort((a, b) =>
    relative(options.staging, a).replaceAll(sep, '/').localeCompare(relative(options.staging, b).replaceAll(sep, '/')),
  );
  const files: GeneratedManifestFile[] = [];
  for (const source of sourceFiles) {
    const path = relative(options.staging, source).replaceAll(sep, '/');
    const content = await readFile(source);
    for (const destinationRoot of [options.rootPublic, options.websitePublic]) {
      const destination = join(destinationRoot, path);
      await mkdir(dirname(destination), { recursive: true });
      await copyFile(source, destination);
    }
    files.push({ path, sha256: createHash('sha256').update(content).digest('hex'), bytes: content.byteLength });
  }

  const manifest = { files };
  const serialized = `${JSON.stringify(manifest, null, 2)}\n`;
  await Promise.all([
    writeFile(join(options.rootPublic, 'generated-manifest.json'), serialized),
    writeFile(join(options.websitePublic, 'generated-manifest.json'), serialized),
  ]);
  return manifest;
}

if (process.argv[1]?.endsWith('sync-website.ts')) {
  const paths = getProjectPaths();
  await syncGeneratedArtifacts({ staging: paths.stagingPublic, rootPublic: paths.rootPublic, websitePublic: paths.websitePublic });
}
