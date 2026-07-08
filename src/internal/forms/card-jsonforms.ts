import type {ErrorObject} from 'ajv';

import type {CardDraftErrors} from '../types.js';

export const cardDraftErrorsToJsonFormsErrors = (
  errors: CardDraftErrors
): ErrorObject[] =>
  Object.entries(errors).map(([field, message]) => ({
    keyword: 'cardDraft',
    instancePath: `/${field}`,
    schemaPath: `#/properties/${field}`,
    params: {},
    message,
  }));
