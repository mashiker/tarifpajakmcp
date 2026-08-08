import Ajv, { type Options } from 'ajv';
import addFormats from 'ajv-formats';

export function createAjv(options: Options = {}): Ajv {
  const ajv = new Ajv({ allErrors: true, strict: false, ...options });
  addFormats(ajv);
  return ajv;
}
