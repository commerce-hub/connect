import assert from 'node:assert/strict';
import test from 'node:test';

import {
  createBankBillingAddressUiSchema,
  createInstrumentSchemaUiSchema,
} from '../internal/forms/instrument-schema.js';

const controlScopes = (uiSchema) =>
  uiSchema.elements.map((element) => element.scope);

const property = {
  type: 'string',
  title: 'Field',
  'x-errorMessages': {required: 'Required'},
};

test('orders Canadian bank fields before the postal address block', () => {
  const schema = {
    properties: {
      'address.city': property,
      transitNumber: property,
      'address.country': property,
      accountHolderName: property,
      'address.firstLine': property,
      accountNumber: property,
      'address.postCode': property,
      institutionNumber: property,
      'address.state': property,
    },
  };

  assert.deepEqual(controlScopes(createInstrumentSchemaUiSchema(schema)), [
    '#/properties/accountHolderName',
    '#/properties/accountNumber',
    '#/properties/institutionNumber',
    '#/properties/transitNumber',
    '#/properties/address/properties/firstLine',
    '#/properties/address/properties/city',
    '#/properties/address/properties/state',
    '#/properties/address/properties/postCode',
    '#/properties/address/properties/country',
  ]);
});

test('puts the address selector after Interac account details', () => {
  const schema = {
    properties: {
      'address.city': property,
      accountHolderName: property,
      'address.firstLine': property,
      interacAccount: property,
      'address.postCode': property,
      'address.state': property,
      'address.country': property,
    },
  };
  const billingAddressScope = '#/properties/__bankBillingAddress';
  const uiSchema = createBankBillingAddressUiSchema(
    createInstrumentSchemaUiSchema(schema),
    billingAddressScope
  );

  assert.deepEqual(controlScopes(uiSchema), [
    '#/properties/accountHolderName',
    '#/properties/interacAccount',
    billingAddressScope,
    '#/properties/address/properties/firstLine',
    '#/properties/address/properties/city',
    '#/properties/address/properties/state',
    '#/properties/address/properties/postCode',
    '#/properties/address/properties/country',
  ]);
});
