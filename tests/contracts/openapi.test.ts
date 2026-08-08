import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { beforeAll, describe, expect, it } from 'vitest';
import { createAjv } from '../../src/validation/ajv.ts';
import { getProjectPaths } from '../../src/paths.ts';

/**
 * Contract: every published OpenAPI document must be a syntactically and
 * structurally valid OpenAPI 3.0.x document. The build fails if either v1 or
 * v2 OpenAPI is malformed.
 */

const paths = getProjectPaths();

async function readJson(rel: string): Promise<any> {
  return JSON.parse(await readFile(join(paths.rootPublic, rel), 'utf8'));
}

describe('OpenAPI documents are valid', () => {
  const ajv = createAjv();

  describe('v1 openapi.json', () => {
    let openapi: any;
    beforeAll(async () => {
      openapi = await readJson('api/v1/openapi.json');
    });

    it('declares openapi 3.0.x, info, and at least one server', () => {
      expect(openapi.openapi).toMatch(/^3\.0\.\d+$/);
      expect(openapi.info).toBeDefined();
      expect(openapi.info.title).toBeTruthy();
      expect(openapi.info.version).toBeTruthy();
      expect(Array.isArray(openapi.servers)).toBe(true);
      expect(openapi.servers.length).toBeGreaterThan(0);
    });

    it('every path has a GET operation with a 200 response', () => {
      for (const [path, item] of Object.entries(openapi.paths)) {
        const op = (item as any).get;
        expect(op, `${path} missing GET`).toBeDefined();
        expect(op.responses?.['200'], `${path} missing 200 response`).toBeDefined();
      }
    });

    it('every parameter has name, in, required, and schema', () => {
      for (const [path, item] of Object.entries(openapi.paths)) {
        const params = (item as any).get?.parameters ?? [];
        for (const param of params) {
          expect(param.name, `${path} param missing name`).toBeTruthy();
          expect(param.in, `${path} param missing in`).toBeTruthy();
          expect(typeof param.required, `${path} param required must be boolean`).toBe('boolean');
          expect(param.schema, `${path} param missing schema`).toBeDefined();
        }
      }
    });

    it('passes the local AJV structural sanity check (no schema reference errors)', () => {
      // Compile a tiny schema that asserts the top-level structure so a
      // regression in shape is caught by the same AJV instance the build uses.
      const schema = {
        type: 'object',
        required: ['openapi', 'info', 'paths', 'servers'],
        properties: {
          openapi: { type: 'string', pattern: '^3\\.0\\.\\d+$' },
          info: { type: 'object', required: ['title', 'version'] },
          paths: { type: 'object', minProperties: 1 },
          servers: { type: 'array', minItems: 1 },
        },
      };
      const validate = ajv.compile(schema);
      expect(validate(openapi)).toBe(true);
    });
  });

  describe('v2 openapi.json', () => {
    let openapi: any;
    beforeAll(async () => {
      openapi = await readJson('api/v2/openapi.json');
    });

    it('declares openapi 3.0.x, info, and at least one server', () => {
      expect(openapi.openapi).toMatch(/^3\.0\.\d+$/);
      expect(openapi.info).toBeDefined();
      expect(openapi.info.title).toBeTruthy();
      expect(openapi.info.version).toBeTruthy();
      expect(Array.isArray(openapi.servers)).toBe(true);
      expect(openapi.servers.length).toBeGreaterThan(0);
    });

    it('declares temporal endpoints (at-date and by-year) and rule detail', () => {
      const declared = Object.keys(openapi.paths);
      expect(declared.some((p) => p.includes('at-date'))).toBe(true);
      expect(declared.some((p) => p.includes('by-year'))).toBe(true);
      expect(declared.some((p) => p.includes('/rules'))).toBe(true);
    });

    it('every path has a GET operation with a 200 response', () => {
      for (const [path, item] of Object.entries(openapi.paths)) {
        const op = (item as any).get;
        expect(op, `${path} missing GET`).toBeDefined();
        expect(op.responses?.['200'], `${path} missing 200 response`).toBeDefined();
      }
    });
  });
});
