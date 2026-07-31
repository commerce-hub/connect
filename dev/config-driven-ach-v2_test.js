import assert from 'node:assert/strict';
import test from 'node:test';

import {
  createConfigDrivenBankAccountRequest,
  encryptConfigDrivenBankAccountRequest,
} from '../internal/forms/manual-bank-account-request.js';
import {
  createInstrumentSchemaInitialData,
  normalizeInstrumentSchema,
} from '../internal/forms/instrument-schema.js';
import {parseCommerceHubResponseBody} from '../internal/commerce-hub-response.js';

const schema = {
  bavSupportedCode: 'USD-ACH-P',
  productId: 'ACH',
  countryCode: 'US',
  currencyCode: 'USD',
  currencyName: 'US Dollar',
  type: 'object',
  properties: {},
  required: [],
};

test('builds and encrypts a config-driven ACH v2 request', async () => {
  const data = {
    accountHolderName: 'Ada Lovelace',
    accountNumber: '12345678',
    routingCode: '021000021',
    interacAccount: 'ada@example.com',
    bankAccountType: 'SAVINGS',
    sortCode: '12-34-56',
    address: {city: 'Old city'},
    __bankBillingAddress: 'address-1',
  };
  const original = structuredClone(data);
  const request = createConfigDrivenBankAccountRequest({
    data,
    schema,
    addressSelection: {kind: 'existing', id: 'address-1'},
    id: 'source-1',
  });
  const encrypted = await encryptConfigDrivenBankAccountRequest(
    request,
    async (value) => `encrypted:${value}`
  );

  assert.deepEqual(data, original);
  assert.deepEqual(request.address, {id: 'address-1'});
  assert.equal('accountType' in request, false);
  assert.equal(request.bavSupportedCode, 'USD-ACH-P');
  assert.equal(request.productId, 'ACH');
  assert.equal(request.countryCode, 'US');
  assert.equal(request.currencyCode, 'USD');
  assert.equal(request.bankAccountType, 'SAVINGS');
  assert.equal(encrypted.accountNumber, 'encrypted:12345678');
  assert.equal(encrypted.routingCode, 'encrypted:021000021');
  assert.equal(encrypted.interacAccount, 'encrypted:ada@example.com');
  assert.equal(encrypted.accountNumberReEntered, encrypted.accountNumber);
  assert.equal(encrypted.sortCode, '12-34-56');
  assert.notEqual(encrypted, request);
  assert.notEqual(encrypted.address, data.address);
  assert.equal('__bankBillingAddress' in encrypted, false);
  assert.equal('bankAccount' in encrypted, false);
});

test('encrypts bsbCode without adding a routingCode alias', async () => {
  const request = createConfigDrivenBankAccountRequest({
    data: {
      accountHolderName: 'Ada Lovelace',
      accountNumber: '12345678',
      bsbCode: '112312111',
      accountType: 'CHECKING',
    },
    schema: {...schema, bavSupportedCode: 'USD-American-B'},
    addressSelection: {kind: 'new'},
    id: 'source-1',
  });
  const encrypted = await encryptConfigDrivenBankAccountRequest(
    request,
    async (value) => `encrypted:${value}`
  );

  assert.equal(request.bavSupportedCode, 'USD-American-B');
  assert.equal(request.accountType, 'CHECKING');
  assert.equal(request.bsbCode, '112312111');
  assert.equal(encrypted.bsbCode, 'encrypted:112312111');
  assert.equal('routingCode' in encrypted, false);
});

test('prefills and locks only configured address.country from interaction country', () => {
  const initialData = createInstrumentSchemaInitialData(
    {
      ...schema,
      properties: {
        'address.country': {type: 'string'},
        country: {type: 'string'},
      },
    },
    ' USA '
  );
  const normalized = normalizeInstrumentSchema(
    {
      ...schema,
      properties: {
        'address.country': {type: 'string'},
        country: {type: 'string'},
      },
    },
    'USA'
  );

  assert.deepEqual(initialData, {address: {country: 'USA'}});
  assert.equal('country' in initialData, false);
  assert.equal(normalized.properties.address.properties.country.readOnly, true);
  assert.equal('readOnly' in normalized.properties.country, false);
});

test('leaves address.country empty and editable without interaction country', () => {
  const countrySchema = {
    ...schema,
    properties: {'address.country': {type: 'string'}},
  };

  assert.deepEqual(createInstrumentSchemaInitialData(countrySchema), {
    address: {},
  });
  assert.equal(
    'readOnly' in
      normalizeInstrumentSchema(countrySchema).properties.address.properties
        .country,
    false
  );
});

test('does not add accountNumberReEntered without an accountNumber', async () => {
  const request = createConfigDrivenBankAccountRequest({
    data: {
      interacAccount: 'ada@example.com',
      accountNumberReEntered: 'plaintext-alias',
    },
    schema: {...schema, bavSupportedCode: 'CAD-Interac-B'},
    addressSelection: {kind: 'new'},
    id: 'source-1',
  });
  const encrypted = await encryptConfigDrivenBankAccountRequest(
    request,
    async (value) => `encrypted:${value}`
  );

  assert.equal(encrypted.interacAccount, 'encrypted:ada@example.com');
  assert.equal('accountNumberReEntered' in encrypted, false);
});

test('treats an empty JSON response body as absent', async () => {
  const response = new Response(undefined, {
    status: 201,
    headers: {'Content-Type': 'application/json'},
  });

  assert.equal(await parseCommerceHubResponseBody(response), undefined);
});

test('parses non-empty JSON response bodies', async () => {
  const response = new Response(JSON.stringify({sourceId: 'source-1'}), {
    status: 201,
    headers: {'Content-Type': 'application/json'},
  });

  assert.deepEqual(await parseCommerceHubResponseBody(response), {
    sourceId: 'source-1',
  });
});

test('preserves non-JSON response bodies as text', async () => {
  const response = new Response('upstream failure', {
    status: 502,
    headers: {'Content-Type': 'text/plain'},
  });

  assert.equal(
    await parseCommerceHubResponseBody(response),
    'upstream failure'
  );
});
