import {defaultTranslator, type JsonSchema} from '@jsonforms/core';
import {assert} from '@open-wc/testing';
import Ajv from 'ajv';

import {
  createInstrumentSchemaErrorTranslator,
  createInstrumentSchemaInitialData,
  createInstrumentSchemaUiSchema,
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

  test('creates leaf controls for dotted properties in response order', () => {
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

  test('initializes dotted-path parents without populating form fields', () => {
    assert.deepEqual(createInstrumentSchemaInitialData(canadianSchema()), {
      address: {},
    });
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
