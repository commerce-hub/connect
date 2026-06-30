import type {JsonSchema, UISchemaElement} from '@jsonforms/core';
import type {ErrorObject} from 'ajv';

import type {BankAccountDraftErrors} from '../types.js';

export const bankAccountJsonFormsSchema: JsonSchema = {
  type: 'object',
  properties: {
    accountNickname: {
      type: 'string',
      minLength: 3,
      description: 'Please enter the account nickname',
      title: 'Account Nickname',
    },
    routingNumber: {
      type: 'string',
      description: 'Please enter the routing number',
      minLength: 9,
      maxLength: 9,
      pattern: '^[0-9]{9}$',
    },
    accountNumber: {
      type: 'string',
      description: 'Please enter the account number',
      minLength: 9,
      maxLength: 9,
      pattern: '^[0-9]{9}$',
    },
    confirmAccountNumber: {
      type: 'string',
      description: 'Confirm the account number',
      minLength: 9,
      maxLength: 9,
      pattern: '^[0-9]{9}$',
    },
  },
  required: [
    'accountNickname',
    'routingNumber',
    'accountNumber',
    'confirmAccountNumber',
  ],
};

export const bankAccountJsonFormsUiSchema: UISchemaElement = {
  type: 'VerticalLayout',
  elements: [
    {
      type: 'Control',
      scope: '#/properties/accountNickname',
      label: 'Account Nickname',
    },
    {
      type: 'Control',
      scope: '#/properties/routingNumber',
      label: 'Routing number',
    },
    {
      type: 'Control',
      scope: '#/properties/accountNumber',
      label: 'Account number',
    },
    {
      type: 'Control',
      scope: '#/properties/confirmAccountNumber',
      label: 'Confirm account number',
    },
  ],
};

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
