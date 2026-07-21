import {assert} from '@open-wc/testing';

import type {ConfigInstrumentSchema} from '../internal/forms/instrument-schema.js';
import {
  createManualBankAccountRequest,
  createManualBankBillingAddress,
  encryptManualBankAccountRequest,
} from '../internal/forms/manual-bank-account-request.js';

const schema = (
  overrides: Partial<ConfigInstrumentSchema> = {}
): ConfigInstrumentSchema => ({
  bavSupportedCode: 'USD-ACH-P',
  productId: 'ACH',
  countryCode: 'US',
  currencyCode: 'USD',
  currencyName: 'US Dollar',
  type: 'object',
  properties: {},
  required: [],
  ...overrides,
});

suite('manual bank account request', () => {
  const encryptValue = async (value: string): Promise<string> =>
    `encrypted:${value}`;

  test('maps configured address fields to a billing address', () => {
    assert.deepEqual(
      createManualBankBillingAddress(
        {
          accountHolderName: 'Bob Bobson',
          address: {
            firstLine: '1 Main Street',
            city: 'Toronto',
            postCode: 'M5V 2T6',
            country: 'CA',
          },
        },
        'address-id'
      ),
      {
        id: 'address-id',
        recipientNameOrAddress: 'Bob Bobson',
        street: '1 Main Street',
        city: 'Toronto',
        postalCode: 'M5V 2T6',
        country: 'CA',
      }
    );
  });

  test('creates a USA bank-account request', () => {
    assert.deepEqual(
      createManualBankAccountRequest(
        {
          accountNickname: 'Williams Enterprises LLC',
          bankName: 'Chase',
          routingNumber: '051034492',
          accountNumber: '4924304850',
          confirmAccountNumber: '4924304850',
          accountType: 'SAVINGS',
        },
        schema(),
        'billing-id',
        'source-id'
      ),
      {
        id: 'source-id',
        name: 'Williams Enterprises LLC',
        billingAddressId: 'billing-id',
        productCode: 'ACH',
        tenderType: 'BANK_ACCOUNT',
        bankAccount: {
          bankName: 'Chase',
          routingNumber: '051034492',
          accountNumber: '4924304850',
          accountNumberReEntered: '4924304850',
          accountType: 'SAVINGS',
          country: 'USA',
          asset: {type: 'CURRENCY', id: 'USD'},
        },
      }
    );
  });

  test('creates a Canadian request with institution and transit numbers', () => {
    assert.deepEqual(
      createManualBankAccountRequest(
        {
          accountHolderName: 'Bob Bobson',
          accountNumber: '00026',
          institutionNumber: '002',
          transitNumber: '12345',
        },
        schema({
          bavSupportedCode: 'CAD-Canadian-P',
          productId: 'POLOCALBANK',
          countryCode: 'CA',
          currencyCode: 'CAD',
        }),
        'billing-id',
        'source-id'
      ),
      {
        id: 'source-id',
        name: 'Bob Bobson',
        billingAddressId: 'billing-id',
        productCode: 'POLOCALBANK',
        tenderType: 'BANK_ACCOUNT',
        accountHolderType: 'PERSONAL',
        bankAccount: {
          accountType: 'CHECKING',
          routingNumber: '1223',
          institutionNumber: '002',
          transitNumber: '12345',
          accountNumber: '00026',
          accountNumberReEntered: '00026',
          accountIdentificationNumberType: 'CANADIAN',
          asset: {type: 'CURRENCY', id: 'CAD'},
        },
      }
    );
  });

  test('creates an Interac business request', () => {
    assert.deepEqual(
      createManualBankAccountRequest(
        {
          accountHolderName: 'Example Business',
          interacAccount: 'recipient@test.com',
        },
        schema({
          bavSupportedCode: 'CAD-Interac-B',
          productId: 'POINTERAC',
          countryCode: 'CA',
          currencyCode: 'CAD',
        }),
        'billing-id',
        'source-id'
      ),
      {
        id: 'source-id',
        name: 'Example Business',
        billingAddressId: 'billing-id',
        productCode: 'POINTERAC',
        tenderType: 'BANK_ACCOUNT',
        accountHolderType: 'BUSINESS',
        bankAccount: {
          accountType: 'CHECKING',
          accountNumber: 'recipient@test.com',
          accountNumberReEntered: 'recipient@test.com',
          accountIdentificationNumberType: 'INTERAC',
          asset: {type: 'CURRENCY', id: 'CAD'},
        },
      }
    );
  });

  test('encrypts USA routing and account fields with the prior aliases', async () => {
    const request = createManualBankAccountRequest(
      {
        accountNickname: 'Williams Enterprises LLC',
        routingNumber: '051034492',
        accountNumber: '4924304850',
        confirmAccountNumber: '4924304850',
      },
      schema(),
      'billing-id',
      'source-id'
    );

    assert.deepEqual(
      await encryptManualBankAccountRequest(request, encryptValue),
      {
        ...request,
        bankAccount: {
          ...request.bankAccount,
          routingNumber: 'encrypted:051034492',
          routingNumberEncrypted: 'encrypted:051034492',
          accountNumber: 'encrypted:4924304850',
          accountNumberEncrypted: 'encrypted:4924304850',
          accountNumberReEntered: 'encrypted:4924304850',
        },
      }
    );
  });

  test('encrypts Canadian account fields without changing institution details', async () => {
    const request = createManualBankAccountRequest(
      {
        accountHolderName: 'Bob Bobson',
        accountNumber: '00026',
        institutionNumber: '002',
        transitNumber: '12345',
      },
      schema({
        bavSupportedCode: 'CAD-Canadian-P',
        productId: 'POLOCALBANK',
        countryCode: 'CA',
        currencyCode: 'CAD',
      }),
      'billing-id',
      'source-id'
    );

    const encryptedRequest = await encryptManualBankAccountRequest(
      request,
      encryptValue
    );

    assert.deepEqual(encryptedRequest.bankAccount, {
      ...request.bankAccount,
      routingNumber: 'encrypted:1223',
      routingNumberEncrypted: 'encrypted:1223',
      accountNumber: 'encrypted:00026',
      accountNumberEncrypted: 'encrypted:00026',
      accountNumberReEntered: 'encrypted:00026',
    });
  });

  test('encrypts Interac email-valued account fields', async () => {
    const request = createManualBankAccountRequest(
      {
        accountHolderName: 'Example Business',
        interacAccount: 'recipient@test.com',
      },
      schema({
        bavSupportedCode: 'CAD-Interac-B',
        productId: 'POINTERAC',
        countryCode: 'CA',
        currencyCode: 'CAD',
      }),
      'billing-id',
      'source-id'
    );

    const encryptedRequest = await encryptManualBankAccountRequest(
      request,
      encryptValue
    );

    assert.deepEqual(encryptedRequest.bankAccount, {
      ...request.bankAccount,
      accountNumber: 'encrypted:recipient@test.com',
      accountNumberEncrypted: 'encrypted:recipient@test.com',
      accountNumberReEntered: 'encrypted:recipient@test.com',
    });
  });
});
