import assert from 'node:assert/strict';
import test from 'node:test';

const property = {
  type: 'string',
  title: 'Field',
  'x-errorMessages': {required: 'Required'},
};

const schema = (
  bavSupportedCode,
  currencyCode = bavSupportedCode.split('-')[0],
  currencyName = currencyCode
) => ({
  bavSupportedCode,
  productId: bavSupportedCode.includes('Interac') ? 'POINTERAC' : 'POLOCALBANK',
  countryCode: currencyCode === 'CAD' ? 'CA' : 'US',
  currencyCode,
  currencyName,
  type: 'object',
  properties: {accountHolderName: property},
  required: ['accountHolderName'],
});

const loadSelectionHelper = async () => {
  try {
    return await import('../internal/forms/instrument-schema-selection.js');
  } catch (cause) {
    assert.fail(
      `Instrument schema selection helper is not implemented: ${cause}`
    );
  }
};

test('parses valid selections and rejects malformed or inconsistent codes', async () => {
  const {selectableInstrumentSchemas} = await loadSelectionHelper();
  const selections = selectableInstrumentSchemas([
    schema('CAD-Canadian-B', 'CAD', 'Canadian Dollar'),
    schema('CAD-Canadian-P', 'CAD', 'Canadian Dollar'),
    schema('CAD-Interac-B', 'CAD', 'Canadian Dollar'),
    schema('USD-Open-Banking-P', 'USD', 'US Dollar'),
    schema('CAD--B', 'CAD', 'Canadian Dollar'),
    schema('CAD-Canadian-X', 'CAD', 'Canadian Dollar'),
    schema('USD-Canadian-B', 'CAD', 'Canadian Dollar'),
  ]);

  assert.deepEqual(
    selections.map(({currencyCode, accountType, paymentType}) => ({
      currencyCode,
      accountType,
      paymentType,
    })),
    [
      {
        currencyCode: 'CAD',
        accountType: 'BUSINESS',
        paymentType: 'Canadian',
      },
      {
        currencyCode: 'CAD',
        accountType: 'PERSONAL',
        paymentType: 'Canadian',
      },
      {
        currencyCode: 'CAD',
        accountType: 'BUSINESS',
        paymentType: 'Interac',
      },
      {
        currencyCode: 'USD',
        accountType: 'PERSONAL',
        paymentType: 'Open-Banking',
      },
    ]
  );
});

test('builds stable dependent options and resolves only exact unique schemas', async () => {
  const {
    instrumentSchemaAccountTypeOptions,
    instrumentSchemaCurrencyOptions,
    instrumentSchemaPaymentTypeOptions,
    resolveInstrumentSchema,
    selectableInstrumentSchemas,
  } = await loadSelectionHelper();
  const canadianBusiness = schema('CAD-Canadian-B', 'CAD', 'Canadian Dollar');
  const selections = selectableInstrumentSchemas([
    canadianBusiness,
    schema('CAD-Canadian-P', 'CAD', 'Canadian Dollar'),
    schema('CAD-Interac-B', 'CAD', 'Canadian Dollar'),
    schema('USD-Open-Banking-P', 'USD', 'US Dollar'),
    schema('EUR-SEPA-B', 'EUR', 'Canadian Dollar'),
  ]);

  assert.deepEqual(instrumentSchemaCurrencyOptions(selections), [
    {value: 'CAD', label: 'Canadian Dollar'},
    {value: 'USD', label: 'US Dollar'},
  ]);
  assert.deepEqual(instrumentSchemaAccountTypeOptions(selections, 'CAD'), [
    {value: 'BUSINESS', label: 'Business'},
    {value: 'PERSONAL', label: 'Personal'},
  ]);
  assert.deepEqual(
    instrumentSchemaPaymentTypeOptions(selections, 'CAD', 'BUSINESS'),
    [
      {value: 'Canadian', label: 'Canadian'},
      {value: 'Interac', label: 'Interac'},
    ]
  );
  assert.equal(
    resolveInstrumentSchema(selections, 'CAD', 'BUSINESS', 'Canadian'),
    canadianBusiness
  );
  assert.equal(
    resolveInstrumentSchema(selections, 'CAD', '', 'Canadian'),
    undefined
  );

  const ambiguous = selectableInstrumentSchemas([
    canadianBusiness,
    {...canadianBusiness, productId: 'DUPLICATE'},
  ]);
  assert.deepEqual(ambiguous, []);
  assert.equal(
    resolveInstrumentSchema(ambiguous, 'CAD', 'BUSINESS', 'Canadian'),
    undefined
  );
});
