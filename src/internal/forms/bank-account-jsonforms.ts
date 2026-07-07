import type {ErrorObject} from 'ajv';

import type {BankAccountDraftErrors} from '../types.js';

export const bankAccountDraftErrorsToJsonFormsErrors = (
  errors: BankAccountDraftErrors
): ErrorObject[] =>
  Object.entries(errors).map(([field, message]) => ({
    keyword: 'bankAccountDraft',
    instancePath: `/${field}`,
    schemaPath: `#/properties/${field}`,
    params: {},
    message,
  }));
