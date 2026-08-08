import { describe, expect, it } from 'vitest';
import { createAjv } from '../../src/validation/ajv.ts';

describe('schema formats', () => {
  const ajv = createAjv();
  const validate = ajv.compile({
    type: 'object',
    required: ['date', 'url'],
    properties: {
      date: { type: 'string', format: 'date' },
      url: { type: 'string', format: 'uri' },
    },
  });

  it('rejects malformed and impossible calendar dates', () => {
    expect(validate({ date: '2025-02-30', url: 'https://example.go.id' })).toBe(false);
    expect(validate({ date: 'not-a-date', url: 'https://example.go.id' })).toBe(false);
  });

  it('rejects malformed URIs', () => {
    expect(validate({ date: '2025-02-28', url: 'not a uri' })).toBe(false);
  });
});
