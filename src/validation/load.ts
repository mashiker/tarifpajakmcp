import { readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';

export async function loadJsonFile<T>(path: string): Promise<T> {
  return JSON.parse(await readFile(path, 'utf8')) as T;
}

export async function loadJsonDirectory<T>(directory: string): Promise<T[]> {
  const files = (await readdir(directory)).filter((file) => file.endsWith('.json')).sort();
  return Promise.all(files.map((file) => loadJsonFile<T>(join(directory, file))));
}
