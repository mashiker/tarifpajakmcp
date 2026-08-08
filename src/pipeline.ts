import { rm } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import { getProjectPaths } from './paths.ts';

function run(command: string, args: string[], cwd: string, env = process.env): Promise<void> {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { cwd, env, stdio: 'inherit', shell: process.platform === 'win32' });
    child.on('exit', (code) => code === 0 ? resolve() : reject(new Error(`${command} exited with ${code}`)));
    child.on('error', reject);
  });
}

export async function cleanGenerated(): Promise<void> {
  const paths = getProjectPaths();
  await rm(paths.staging, { recursive: true, force: true });
  await rm(paths.websiteDist, { recursive: true, force: true });
}

export async function runPipeline(): Promise<void> {
  const paths = getProjectPaths();
  await cleanGenerated();
  await run('pnpm', ['validate'], paths.root);
  await run('pnpm', ['generate'], paths.root);
  await run('pnpm', ['sync'], paths.root);
  await run('pnpm', ['build:site'], paths.root);
  await run('pnpm', ['test:contracts'], paths.root);
}

if (process.argv[1]?.endsWith('pipeline.ts')) await runPipeline();
