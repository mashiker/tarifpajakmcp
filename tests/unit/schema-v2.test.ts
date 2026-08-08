import { describe, expect, it } from 'vitest';
import { compileV2Schemas, type V2SchemaValidators } from '../../src/validation/schema.ts';

describe('v2 schema validators', () => {
  let validators: V2SchemaValidators;
  it('compiles without throwing', async () => {
    validators = await compileV2Schemas();
    expect(validators.source).toBeTypeOf('function');
    expect(validators.rule).toBeTypeOf('function');
    expect(validators.concept).toBeTypeOf('function');
  });

  it('accepts a complete source and rejects a non-official source missing regulationId', async () => {
    const v = validators ?? (await compileV2Schemas());
    expect(v.source({
      id: 's1', name: 'Source', official: true, regulationId: 'REG/2024', locator: 'Article 1', url: 'https://example.invalid/x',
    })).toBe(true);
    expect(v.source({
      id: 's2', name: 'Source', official: false, regulationId: '', locator: 'x',
    })).toBe(false);
  });

  it('accepts a complete rule and rejects a rule missing conceptId', async () => {
    const v = validators ?? (await compileV2Schemas());
    expect(v.rule({
      id: 'r1', conceptId: 'c1', validFrom: '2024-01-01', validToExclusive: null,
      rate: { type: 'percentage', value: '0.1' },
    })).toBe(true);
    expect(v.rule({ id: 'r2', validFrom: '2024-01-01', validToExclusive: null })).toBe(false);
  });
});
