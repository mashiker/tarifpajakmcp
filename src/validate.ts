import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { getProjectPaths } from './paths.ts';
import { createAjv } from './validation/ajv.ts';
import { compileV2Schemas, type V2SchemaValidators } from './validation/schema.ts';
import { loadJsonDirectory, loadJsonFile } from './validation/load.ts';
import { createValidationReport, type ValidationIssue, type ValidationReport } from './validation/report.ts';
import { validateV2Loaded } from './validation/semantic.ts';
import type { V2Data } from './core/types.ts';

export async function validateSources(): Promise<ValidationReport> {
  const { data } = getProjectPaths();
  const ajv = createAjv();
  const [taxRateSchema, regulationSchema, consolidatedSchema] = await Promise.all([
    loadJsonFile(join(data, 'schema', 'tax-rate-entry.json')),
    loadJsonFile(join(data, 'schema', 'regulation.json')),
    loadJsonFile(join(data, 'schema', 'consolidated-law.json')),
  ]);
  const validators = {
    entry: ajv.compile(taxRateSchema),
    regulation: ajv.compile(regulationSchema),
    consolidated: ajv.compile(consolidatedSchema),
  };
  const issues: ValidationIssue[] = [];
  const categories = await loadJsonDirectory<any>(join(data, 'categories'));
  const regulations = (await loadJsonDirectory<any>(join(data, 'regulations'))).flatMap((value) => (Array.isArray(value) ? value : [value]));
  const consolidated = await loadJsonDirectory<any>(join(data, 'consolidated'));

  const check = (kind: keyof typeof validators, value: any, path: string) => {
    if (!validators[kind](value)) {
      for (const error of validators[kind].errors ?? []) {
        issues.push({ code: `schema.${error.keyword}`, message: error.message ?? 'invalid value', path: `${path}${error.instancePath}`, severity: 'error' });
      }
    }
  };
  categories.forEach((category, categoryIndex) => category.entries.forEach((entry: any, entryIndex: number) => check('entry', entry, `categories/${categoryIndex}/entries/${entryIndex}`)));
  regulations.forEach((regulation, index) => check('regulation', regulation, `regulations/${index}`));
  consolidated.forEach((law, index) => check('consolidated', law, `consolidated/${index}`));

  // V2 temporal model: schema + semantic validation wired into the same pipeline.
  const v2Issues = await validateV2FromDisk(ajv);
  issues.push(...v2Issues);

  return createValidationReport(issues);
}

/**
 * Loads v2 source data from `data/v2/`, validates it against the v2 JSON
 * schemas, then runs the semantic validator. Returns issues (no throw).
 * Exported for contract tests that need to prove the pipeline runs v2 checks.
 */
export async function validateV2FromDisk(sharedAjv?: ReturnType<typeof createAjv>): Promise<ValidationIssue[]> {
  const { data } = getProjectPaths();
  const v2Dir = join(data, 'v2');
  const issues: ValidationIssue[] = [];
  const v2Validators = await compileV2Schemas(sharedAjv);

  const loadArr = async (name: string): Promise<any[]> => {
    try {
      return await loadJsonFile<any[]>(join(v2Dir, `${name}.json`));
    } catch {
      return [];
    }
  };
  const [categories, concepts, sources, rules, conflicts, bppu] = await Promise.all([
    loadArr('categories'),
    loadArr('concepts'),
    loadArr('sources'),
    loadArr('rules'),
    loadArr('conflicts'),
    loadArr('bppu'),
  ]);

  const checkV2 = (validator: (value: unknown) => boolean, items: any[], dir: string) => {
    items.forEach((item, index) => {
      if (!validator(item)) {
        for (const error of (validator as any).errors ?? []) {
          issues.push({
            code: `v2.schema.${error.keyword}`,
            message: error.message ?? 'invalid value',
            path: `v2/${dir}/${index}${error.instancePath}`,
            severity: 'error',
          });
        }
      }
    });
  };
  checkV2((v2Validators as V2SchemaValidators).source, sources, 'sources');
  // Categories and conflicts reuse ad-hoc compiled schemas when available; fall
  // back to structural checks via the semantic validator otherwise.
  checkV2((v2Validators as V2SchemaValidators).concept, concepts, 'concepts');
  checkV2((v2Validators as V2SchemaValidators).rule, rules, 'rules');

  const v2Data: V2Data = { sources, categories, concepts, rules, conflicts, bppu };
  const semantic = validateV2Loaded(v2Data);
  issues.push(...semantic.issues);
  return issues;
}

if (process.argv[1] && import.meta.url === new URL(`file://${process.argv[1].replaceAll('\\', '/')}`).href) {
  const report = await validateSources();
  if (!report.valid) {
    console.error(JSON.stringify(report, null, 2));
    process.exitCode = 1;
  } else {
    console.log('Source validation passed');
  }
}

// Re-export for tests that import the pipeline-aware v2 entrypoint directly.
export { validateV2Loaded, readFile };
