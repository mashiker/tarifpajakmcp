import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

export interface ProjectPaths {
  root: string;
  data: string;
  rootPublic: string;
  websitePublic: string;
  websiteDist: string;
  staging: string;
  stagingPublic: string;
}

export function getProjectPaths(): ProjectPaths {
  const root = fileURLToPath(new URL('..', import.meta.url));
  const staging = join(root, '.staging');
  return {
    root,
    data: join(root, 'data'),
    rootPublic: join(root, 'public'),
    websitePublic: join(root, 'website', 'public'),
    websiteDist: join(root, 'website', 'dist'),
    staging,
    stagingPublic: join(staging, 'public'),
  };
}
