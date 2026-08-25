import {assert} from '@open-wc/testing';

import type {ConfigInstrumentSchema} from '../internal/forms/instrument-schema.js';
import {
  createConfigDrivenBankAccountRequest,
  createManualBankAccountRequest,
  createManualBankBillingAddress,
  encryptConfigDrivenBankAccountRequest,
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

  test('creates a config-driven v2 request with configured new-address values', () => {
    assert.deepEqual(
      createConfigDrivenBankAccountRequest({
        data: {
          accountHolderName: 'Bob Bobson',
          accountNumber: '0000026',
          institutionNumber: '002',
          transitNumber: '12345',
          address: {city: 'Toronto', country: 'CA'},
          __bankBillingAddress: '__new__',
        },
        schema: schema({
          bavSupportedCode: 'CAD-Canadian-B',
          productId: 'POLOCALBANK',
          countryCode: 'CA',
          currencyCode: 'CAD',
        }),
        addressSelection: {kind: 'new'},
        id: 'source-id',
      }) as Record<string, unknown>,
      {
        accountHolderName: 'Bob Bobson',
        accountNumber: '0000026',
        institutionNumber: '002',
        transitNumber: '12345',
        address: {city: 'Toronto', country: 'CA'},
        id: 'source-id',
        name: 'Bob Bobson',
        tenderType: 'BANK_ACCOUNT',
        bavSupportedCode: 'CAD-Canadian-B',
        productId: 'POLOCALBANK',
        countryCode: 'CA',
        currencyCode: 'CAD',
      }
    );
  });

  test('replaces stale address data with an existing address id without mutating form data', () => {
    const data = {
      accountHolderName: 'Ada Lovelace',
      accountNumber: '12345678',
      bankAccountType: 'SAVINGS',
      address: {city: 'Old city', country: 'US'},
      __bankBillingAddress: 'address-existing',
    };
    const original = structuredClone(data);

    const request = createConfigDrivenBankAccountRequest({
      data,
      schema: schema({bavSupportedCode: 'USD-ACH-P'}),
      addressSelection: {kind: 'existing', id: 'address-existing'},
      id: 'source-id',
    });

    assert.deepEqual(request.address, {id: 'address-existing'});
    assert.notProperty(request, 'accountType');
    assert.equal(request.bankAccountType, 'SAVINGS');
    assert.notProperty(request, '__bankBillingAddress');
    assert.deepEqual(data, original);
  });

  test('encrypts a configured bsbCode without adding a routingCode alias', async () => {
    const request = createConfigDrivenBankAccountRequest({
      data: {
        accountHolderName: 'Ada Lovelace',
        accountNumber: '12345678',
        bsbCode: '112312111',
        accountType: 'CHECKING',
      },
      schema: schema({bavSupportedCode: 'USD-American-B'}),
      addressSelection: {kind: 'new'},
      id: 'source-id',
    });
    const encrypted = await encryptConfigDrivenBankAccountRequest(
      request,
      encryptValue
    );

    assert.equal(request.bavSupportedCode, 'USD-American-B');
    assert.equal(request.accountType, 'CHECKING');
    assert.equal(request.bsbCode, '112312111');
    assert.equal(encrypted.bsbCode, 'encrypted:112312111');
    assert.notProperty(encrypted, 'routingCode');
  });

  test('encrypts only the sensitive config-driven v2 fields without legacy aliases', async () => {
    const request = createConfigDrivenBankAccountRequest({
      data: {
        accountHolderName: 'Ada Lovelace',
        accountNumber: '12345678',
        routingCode: '021000021',
        interacAccount: 'ada@example.com',
        sortCode: '12-34-56',
        address: {city: 'New York'},
        __bankBillingAddress: '__new__',
      },
      schema: schema({bavSupportedCode: 'USD-ACH-P'}),
      addressSelection: {kind: 'new'},
      id: 'source-id',
    });
    const original = structuredClone(request);

    const encrypted = await encryptConfigDrivenBankAccountRequest(
      request,
      encryptValue
    );

    assert.equal(encrypted.accountNumber, 'encrypted:12345678');
    assert.equal(encrypted.accountNumberReEntered, encrypted.accountNumber);
    assert.equal(encrypted.routingCode, 'encrypted:021000021');
    assert.equal(encrypted.interacAccount, 'encrypted:ada@example.com');
    assert.equal(encrypted.sortCode, '12-34-56');
    assert.deepEqual(encrypted.address, {city: 'New York'});
    assert.notProperty(encrypted, 'accountNumberEncrypted');
    assert.notProperty(encrypted, 'routingNumberEncrypted');
    assert.notProperty(encrypted, 'bankAccount');
    assert.deepEqual(request, original);
  });

  test('converts a top-level iban into an encrypted ACH-style account number, leaving a nested iban encrypted in place', async () => {
    const request = {
      ...createConfigDrivenBankAccountRequest({
        data: {
          accountHolderName: 'Ada Lovelace',
          iban: 'FR43435435435345',
        },
        schema: schema({bavSupportedCode: 'EUR-ACH-P'}),
        addressSelection: {kind: 'new'},
        id: 'source-id',
      }),
      bankAccount: {iban: 'FR43435435435345'},
    };

    const encrypted = await encryptConfigDrivenBankAccountRequest(
      request,
      encryptValue
    );

    assert.notProperty(encrypted, 'iban');
    assert.equal(encrypted.accountType, 'IBAN');
    assert.equal(encrypted.accountIdentificationNumberType, 'IBAN');
    assert.equal(encrypted.accountNumber, 'encrypted:FR43435435435345');
    assert.equal(
      encrypted.accountNumberReEntered,
      'encrypted:FR43435435435345'
    );
    assert.deepEqual(
      (encrypted.bankAccount as Record<string, unknown>).iban,
      'encrypted:FR43435435435345'
    );
  });

  test('converts an uppercase IBAN field into an encrypted ACH-style account number', async () => {
    const request = createConfigDrivenBankAccountRequest({
      data: {
        accountHolderName: 'test Name',
        IBAN: 'FR7617515900001234567890135',
        address: {id: 'KN9AUFWA'},
      },
      schema: schema({
        bavSupportedCode: 'EUR-IBAN-B',
        productId: 'POIBAN',
        countryCode: 'DE',
        currencyCode: 'EUR',
      }),
      addressSelection: {kind: 'existing', id: 'KN9AUFWA'},
      id: 'source-id',
    });

    const encrypted = await encryptConfigDrivenBankAccountRequest(
      request,
      encryptValue
    );

    assert.notProperty(encrypted, 'IBAN');
    assert.notProperty(encrypted, 'iban');
    assert.equal(encrypted.accountType, 'IBAN');
    assert.equal(encrypted.accountIdentificationNumberType, 'IBAN');
    assert.equal(
      encrypted.accountNumber,
      'encrypted:FR7617515900001234567890135'
    );
    assert.equal(
      encrypted.accountNumberReEntered,
      'encrypted:FR7617515900001234567890135'
    );
  });

  test('adds the encrypted Interac value as the account confirmation required by v2 ACH', async () => {
    const request = createConfigDrivenBankAccountRequest({
      data: {
        accountHolderName: 'Example Business',
        interacAccount: 'recipient@test.com',
      },
      schema: schema({
        bavSupportedCode: 'CAD-Interac-B',
        productId: 'POINTERAC',
        countryCode: 'CA',
        currencyCode: 'CAD',
      }),
      addressSelection: {kind: 'existing', id: 'address-id'},
      id: 'source-id',
    });

    const encrypted = await encryptConfigDrivenBankAccountRequest(
      request,
      encryptValue
    );

    assert.equal(encrypted.interacAccount, 'encrypted:recipient@test.com');
    assert.equal(
      encrypted.accountNumberReEntered,
      'encrypted:recipient@test.com'
    );
    assert.notProperty(encrypted, 'accountNumber');
  });

  test('encrypts CLABE and adds the account confirmation required by v2 ACH', async () => {
    const request = createConfigDrivenBankAccountRequest({
      data: {
        accountHolderName: 'Example Business',
        clabe: '012345678901234567',
      },
      schema: schema({
        bavSupportedCode: 'MXN-CLABE-B',
        productId: 'POCLABE',
        countryCode: 'MX',
        currencyCode: 'MXN',
      }),
      addressSelection: {kind: 'new'},
      id: 'source-id',
    });

    const encrypted = await encryptConfigDrivenBankAccountRequest(
      request,
      encryptValue
    );

    assert.equal(encrypted.clabe, 'encrypted:012345678901234567');
    assert.equal(
      encrypted.accountNumberReEntered,
      'encrypted:012345678901234567'
    );
    assert.notProperty(encrypted, 'accountNumber');
  });

  test('maps configured address fields to a billing address', () => {
    assert.deepEqual(
      createManualBankBillingAddress(
        {
          accountHolderName: 'Bob Bobson',
          address: {
            firstLine: '1 Main Street',
            city: 'Toronto',
            state: 'ON',
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
        state: 'ON',
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
