import {defaultTranslator, type JsonSchema} from '@jsonforms/core';
import {assert} from '@open-wc/testing';
import Ajv from 'ajv';

import {
  createBankBillingAddressUiSchema,
  createInstrumentSchemaErrorTranslator,
  createInstrumentSchemaInitialData,
  createInstrumentSchemaUiSchema,
  instrumentSchemaWithoutAddress,
  normalizeInstrumentSchema,
  usableInstrumentSchemas,
  type ConfigInstrumentSchema,
} from '../internal/forms/instrument-schema.js';

const canadianSchema = (): ConfigInstrumentSchema => ({
  bavSupportedCode: 'CAD-Canadian-B',
  productId: 'POLOCALBANK',
  countryCode: 'CA',
  currencyCode: 'CAD',
  currencyName: 'Canadian Dollar',
  type: 'object',
  properties: {
    accountHolderName: {
      type: 'string',
      title: 'Full name of the account holder',
      minLength: 3,
      pattern: '$re$^[A-Za-z ]+$re$',
      'x-errorMessages': {
        required: 'Full name is required',
        minLength: 'Full name is too short',
        pattern: 'Enter a valid full name',
      },
    },
    accountNumber: {
      type: 'string',
      title: 'Account number',
      minLength: 7,
      maxLength: 12,
      pattern: '$re$\\d{7,12}$re$',
      'x-errorMessages': {
        required: 'Account number is required',
        minLength: 'Account number is too short',
        maxLength: 'Account number is too long',
        pattern: 'Enter a valid account number',
      },
    },
    'address.city': {
      type: 'string',
      title: 'City',
      pattern: '$re$^.{1,255}$re$',
      'x-errorMessages': {
        required: 'City is required',
        pattern: 'Enter a valid city',
      },
    },
    'address.country': {
      type: 'string',
      title: 'Country',
      pattern: '^CA$re$',
      'x-errorMessages': {
        required: 'Country is required',
      },
    },
  },
  required: [
    'accountHolderName',
    'accountNumber',
    'address.city',
    'address.country',
  ],
});

const schemaProperties = (schema: JsonSchema): Record<string, JsonSchema> =>
  schema.properties ?? {};

suite('instrument schema adapter', () => {
  test('filters unknown values to usable generated-schema shapes in response order', () => {
    const first = canadianSchema();
    const second = {
      ...canadianSchema(),
      bavSupportedCode: 'CAD-Canadian-P',
    };
    const malformed = [
      undefined,
      {...canadianSchema(), bavSupportedCode: '  '},
      {...canadianSchema(), type: 'array'},
      {...canadianSchema(), properties: {}},
      {
        ...canadianSchema(),
        properties: {
          address: canadianSchema().properties.accountHolderName,
          'address.city': canadianSchema().properties['address.city'],
        },
        required: ['address.city'],
      },
      {...canadianSchema(), required: ['unknown']},
      {
        ...canadianSchema(),
        properties: {
          ...canadianSchema().properties,
          accountNumber: {
            ...canadianSchema().properties.accountNumber,
            minLength: 12,
            maxLength: 7,
          },
        },
      },
      {
        ...canadianSchema(),
        properties: {
          '__proto__.polluted': canadianSchema().properties.accountHolderName,
        },
        required: ['__proto__.polluted'],
      },
      {
        ...canadianSchema(),
        properties: {
          'toString.child': canadianSchema().properties.accountHolderName,
        },
        required: ['toString.child'],
      },
    ];

    assert.deepEqual(
      usableInstrumentSchemas({instrumentSchemas: 'invalid'}),
      []
    );
    assert.deepEqual(usableInstrumentSchemas([...malformed, first, second]), [
      first,
      second,
    ]);
    assert.deepEqual(
      usableInstrumentSchemas({instrumentSchemas: [first, second]}),
      [first, second]
    );
  });

  test('nests dotted properties and required paths without mutating the wire schema', () => {
    const raw = canadianSchema();
    raw.properties.reference = {
      type: 'string',
      title: 'Reference',
      pattern: '$re$',
      'x-errorMessages': {required: 'Reference is required'},
    };
    raw.properties.emptyPattern = {
      type: 'string',
      title: 'Empty pattern',
      pattern: '$re$$re$',
      'x-errorMessages': {required: 'Empty pattern is required'},
    };
    const original = structuredClone(raw);
    const normalized = normalizeInstrumentSchema(raw);
    const rootProperties = schemaProperties(normalized);
    const address = rootProperties.address;
    const addressProperties = schemaProperties(address);
    const accountNumber = rootProperties.accountNumber as Record<
      string,
      unknown
    >;
    const country = addressProperties.country as Record<string, unknown>;
    const reference = rootProperties.reference as Record<string, unknown>;
    const emptyPattern = rootProperties.emptyPattern as Record<string, unknown>;

    assert.deepEqual(raw, original);
    assert.deepEqual(normalized.required, [
      'accountHolderName',
      'accountNumber',
      'address',
    ]);
    assert.equal(address.type, 'object');
    assert.deepEqual(address.required, ['city', 'country']);
    assert.sameMembers(Object.keys(addressProperties), ['city', 'country']);
    assert.equal(accountNumber.type, 'string');
    assert.equal(accountNumber.pattern, '^(?:\\d{7,12})$');
    assert.notProperty(accountNumber, 'format');
    assert.deepEqual(accountNumber['x-errorMessages'], {
      required: 'Account number is required',
      minLength: 'Account number is too short',
      maxLength: 'Account number is too long',
      pattern: 'Enter a valid account number',
    });
    assert.equal(
      (addressProperties.city as Record<string, unknown>).pattern,
      '^(?:^.{1,255})$'
    );
    assert.equal(country.pattern, '^CA$re$');
    assert.equal(reference.pattern, '$re$');
    assert.equal(emptyPattern.pattern, '^(?:)$');
  });

  test('creates leaf controls for dotted properties', () => {
    assert.deepEqual(createInstrumentSchemaUiSchema(canadianSchema()), {
      type: 'VerticalLayout',
      elements: [
        {type: 'Control', scope: '#/properties/accountHolderName'},
        {type: 'Control', scope: '#/properties/accountNumber'},
        {type: 'Control', scope: '#/properties/address/properties/city'},
        {type: 'Control', scope: '#/properties/address/properties/country'},
      ],
    });
  });

  test('orders bank details before address fields in postal order', () => {
    const raw = canadianSchema();
    const genericProperty = raw.properties.accountHolderName;

    raw.properties = {
      'address.city': raw.properties['address.city'],
      transitNumber: genericProperty,
      'address.country': raw.properties['address.country'],
      accountHolderName: genericProperty,
      'address.firstLine': genericProperty,
      accountNumber: raw.properties.accountNumber,
      'address.postCode': genericProperty,
      institutionNumber: genericProperty,
      'address.state': genericProperty,
    };

    assert.deepEqual(createInstrumentSchemaUiSchema(raw), {
      type: 'VerticalLayout',
      elements: [
        {type: 'Control', scope: '#/properties/accountHolderName'},
        {type: 'Control', scope: '#/properties/accountNumber'},
        {type: 'Control', scope: '#/properties/institutionNumber'},
        {type: 'Control', scope: '#/properties/transitNumber'},
        {type: 'Control', scope: '#/properties/address/properties/firstLine'},
        {type: 'Control', scope: '#/properties/address/properties/city'},
        {type: 'Control', scope: '#/properties/address/properties/state'},
        {type: 'Control', scope: '#/properties/address/properties/postCode'},
        {type: 'Control', scope: '#/properties/address/properties/country'},
      ],
    });
  });

  test('places bank billing address after bank details', () => {
    const billingAddressScope = '#/properties/__bankBillingAddress';
    const raw = canadianSchema();
    raw.properties.institutionNumber = raw.properties.accountHolderName;
    raw.properties.transitNumber = raw.properties.accountHolderName;

    assert.deepEqual(
      createBankBillingAddressUiSchema(
        createInstrumentSchemaUiSchema(raw),
        billingAddressScope
      ),
      {
        type: 'VerticalLayout',
        elements: [
          {type: 'Control', scope: '#/properties/accountHolderName'},
          {type: 'Control', scope: '#/properties/accountNumber'},
          {type: 'Control', scope: '#/properties/institutionNumber'},
          {type: 'Control', scope: '#/properties/transitNumber'},
          {type: 'Control', scope: billingAddressScope},
          {type: 'Control', scope: '#/properties/address/properties/city'},
          {type: 'Control', scope: '#/properties/address/properties/country'},
        ],
      }
    );
  });

  test('removes only address validation without mutating the normalized schema', () => {
    const raw = canadianSchema();
    raw.properties.institutionNumber = {
      type: 'string',
      title: 'Institution number',
      'x-errorMessages': {required: 'Institution number is required'},
    };
    raw.properties.transitNumber = {
      type: 'string',
      title: 'Transit number',
      'x-errorMessages': {required: 'Transit number is required'},
    };
    raw.required.push('institutionNumber', 'transitNumber');
    const original = structuredClone(raw);

    const withoutAddress = instrumentSchemaWithoutAddress(raw);

    assert.deepEqual(raw, original);
    assert.isFalse(
      Object.keys(withoutAddress.properties).some(
        (path) => path === 'address' || path.startsWith('address.')
      )
    );
    assert.sameMembers(withoutAddress.required ?? [], [
      'accountHolderName',
      'accountNumber',
      'institutionNumber',
      'transitNumber',
    ]);
    assert.containsAllKeys(withoutAddress.properties, [
      'institutionNumber',
      'transitNumber',
    ]);
  });

  test('initializes dotted-path parents and only prefills address.country from the interaction', () => {
    assert.deepEqual(
      createInstrumentSchemaInitialData(canadianSchema(), ' USA '),
      {
        address: {country: 'USA'},
      }
    );
    assert.deepEqual(
      createInstrumentSchemaInitialData(
        {
          ...canadianSchema(),
          properties: {
            ...canadianSchema().properties,
            country: canadianSchema().properties['address.country'],
          },
        },
        'USA'
      ),
      {
        address: {country: 'USA'},
      }
    );
    assert.deepEqual(createInstrumentSchemaInitialData(canadianSchema()), {
      address: {},
    });
    assert.deepEqual(createInstrumentSchemaInitialData(canadianSchema(), ' '), {
      address: {},
    });
  });

  test('makes only interaction-prefilled address.country read-only', () => {
    const prefilled = normalizeInstrumentSchema(canadianSchema(), 'USA');
    const prefilledCountry = schemaProperties(
      schemaProperties(prefilled).address
    ).country;
    const editable = normalizeInstrumentSchema(canadianSchema());
    const editableCountry = schemaProperties(
      schemaProperties(editable).address
    ).country;

    assert.equal((prefilledCountry as Record<string, unknown>).readOnly, true);
    assert.notProperty(editableCountry as Record<string, unknown>, 'readOnly');
  });

  test('rejects prototype-polluting property paths', () => {
    for (const path of ['address.constructor.polluted', 'toString.child']) {
      const unsafeSchema: ConfigInstrumentSchema = {
        ...canadianSchema(),
        properties: {
          [path]: canadianSchema().properties.accountHolderName,
        },
        required: [path],
      };

      assert.deepEqual(usableInstrumentSchemas([unsafeSchema]), []);
      assert.throws(
        () => normalizeInstrumentSchema(unsafeSchema),
        'Instrument schema contains an unsafe property path.'
      );
      assert.throws(
        () => createInstrumentSchemaInitialData(unsafeSchema),
        'Instrument schema contains an unsafe property path.'
      );
    }

    assert.notProperty(Object.prototype, 'polluted');
  });

  test('translates top-level, nested, and constraint errors with fallbacks', () => {
    const raw = canadianSchema();
    raw.properties['address.country'].pattern = '^CA$';
    const schema = normalizeInstrumentSchema(raw);
    const translateError = createInstrumentSchemaErrorTranslator(raw);
    const ajv = new Ajv({allErrors: true, strict: false});
    const validate = ajv.compile(schema);

    assert.isFalse(
      validate({
        accountNumber: '12',
        address: {country: 'CA'},
      })
    );

    const translated = (validate.errors ?? []).map((error) =>
      translateError(error, defaultTranslator)
    );

    assert.includeMembers(translated, [
      'Full name is required',
      'Account number is too short',
      'Enter a valid account number',
      'City is required',
    ]);

    assert.isFalse(
      validate({
        accountHolderName: 'Ada Lovelace',
        accountNumber: '1234567890123',
        address: {city: 'Toronto', country: 'CA'},
      })
    );
    assert.include(
      (validate.errors ?? []).map((error) =>
        translateError(error, defaultTranslator)
      ),
      'Account number is too long'
    );

    assert.isFalse(
      validate({
        accountHolderName: 'Ada Lovelace',
        accountNumber: 'abc1234567',
        address: {city: 'Toronto', country: 'CA'},
      })
    );
    assert.include(
      (validate.errors ?? []).map((error) =>
        translateError(error, defaultTranslator)
      ),
      'Enter a valid account number'
    );
  });
});
