import type Ajv from 'ajv';
import { join } from 'node:path';
import { createAjv } from './ajv.ts';
import { loadJsonFile } from './load.ts';
import { getProjectPaths } from '../paths.ts';

/**
 * Compiles the v2 JSON schemas once and returns a stable set of validators.
 * The schemas live under `data/schema/v2/*.json` and define source/rule/concept
 * document shapes for the temporal model.
 */
export type V2SchemaValidators = {
  source: (data: unknown) => boolean;
  rule: (data: unknown) => boolean;
  concept: (data: unknown) => boolean;
};

export async function compileV2Schemas(ajv?: Ajv): Promise<V2SchemaValidators> {
  const instance = ajv ?? createAjv();
  const { data } = getProjectPaths();
  const [sourceSchema, ruleSchema, conceptSchema] = await Promise.all([
    loadJsonFile(join(data, 'schema', 'v2', 'source.schema.json')),
    loadJsonFile(join(data, 'schema', 'v2', 'rule.schema.json')),
    loadJsonFile(join(data, 'schema', 'v2', 'concept.schema.json')),
  ]);
  return {
    source: instance.compile(sourceSchema),
    rule: instance.compile(ruleSchema),
    concept: instance.compile(conceptSchema),
  };
}
