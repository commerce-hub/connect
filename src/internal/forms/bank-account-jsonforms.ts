import {
  generateDefaultUISchema,
  type JsonSchema,
  type UISchemaElement,
} from '@jsonforms/core';
import type {ErrorObject} from 'ajv';

import type {BankAccountDraftErrors} from '../types.js';
import {bankAccountFormSchema} from './form.js';

export const bankAccountJsonFormsSchema: JsonSchema =
  bankAccountFormSchema as JsonSchema;

export const bankAccountJsonFormsUiSchema: UISchemaElement =
  generateDefaultUISchema(bankAccountJsonFormsSchema, 'VerticalLayout');

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
