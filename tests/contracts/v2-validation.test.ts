import { describe, expect, it } from 'vitest';
import { validateSources } from '../../src/validate.ts';
import { validateV2Loaded } from '../../src/validate.ts';

describe('v2 pipeline integration', () => {
  it('validateSources runs v2 semantic validation as part of the pipeline', async () => {
    // The committed v2 bootstrap must be valid.
    const report = await validateSources();
    expect(report.valid, JSON.stringify(report.issues, null, 2)).toBe(true);
  });

  it('validateV2Loaded surfaces v2 semantic issues for malformed data', async () => {
    const report = await validateV2Loaded({
      sources: [],
      categories: [],
      concepts: [{ id: 'dup', categoryId: 'missing' }, { id: 'dup', categoryId: 'missing' }],
      rules: [],
      conflicts: [],
      bppu: [],
    });
    expect(report.issues.length).toBeGreaterThan(0);
    expect(report.issues.some((i) => i.code === 'duplicate_id' || i.code === 'missing_foreign_key')).toBe(true);
  });
});
