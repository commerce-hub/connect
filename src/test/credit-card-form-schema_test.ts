import {assert} from '@open-wc/testing';
import {type UISchemaElement} from '@jsonforms/core';
import Ajv, {type ValidateFunction} from 'ajv';

const cardFieldScopes = [
  '#/properties/name',
  '#/properties/cardNumber',
  '#/properties/expirationDate',
  '#/properties/cvv',
  '#/properties/fullName',
  '#/properties/billingAddressValue',
  '#/properties/country',
  '#/properties/addressLine1',
  '#/properties/addressLine2',
  '#/properties/city',
  '#/properties/state',
  '#/properties/zip',
];

const savedBillingAddressDraft = {
  name: 'Corporate card',
  cardNumber: '4111 1111 1111 1111',
  expirationDate: '04 / 30',
  cvv: '123',
  fullName: 'Ada Lovelace',
  billingAddressValue: 'billing-address-1',
  country: '',
  addressLine1: '',
  addressLine2: '',
  city: '',
  state: '',
  zip: '',
};

const newBillingAddressDraft = {
  ...savedBillingAddressDraft,
  billingAddressValue: '__new__',
  country: 'US',
  addressLine1: '1 Main St',
  addressLine2: 'Suite 100',
  city: 'Brookfield',
  state: 'WI',
  zip: '53045',
};

const collectControlScopes = (uischema: UISchemaElement): string[] => {
  const layout = uischema as {elements?: Array<{scope?: string}>};

  return layout.elements?.map((element) => element.scope ?? '') ?? [];
};

const loadCreditCardSchemaJson = async (): Promise<Record<string, unknown>> => {
  const response = await fetch('/credit-card-form.json');

  assert.isTrue(
    response.ok,
    'credit-card-form.json should be served from the repository root'
  );

  return response.json() as Promise<Record<string, unknown>>;
};

const loadCreditCardUiSchemaJson = async (): Promise<UISchemaElement> => {
  const response = await fetch('/credit-card-form-ui-schema.json');

  assert.isTrue(
    response.ok,
    'credit-card-form-ui-schema.json should be served from the repository root'
  );

  return response.json() as Promise<UISchemaElement>;
};

const loadCreditCardSchema = async (): Promise<ValidateFunction> => {
  const schema = await loadCreditCardSchemaJson();
  const ajv = new Ajv({allErrors: true});

  return ajv.compile(schema);
};

suite('credit card JSONForms data schema', () => {
  test('serves the JSON schema itself without form wrappers', async () => {
    const schema = await loadCreditCardSchemaJson();

    assert.equal(schema.type, 'object');
    assert.notProperty(schema, 'schema');
    assert.notProperty(schema, 'uischema');
    assert.notProperty(schema, 'validations');
  });

  test('serves the JSONForms vertical UI schema separately from the data schema', async () => {
    const uischema = await loadCreditCardUiSchemaJson();

    assert.equal(uischema.type, 'VerticalLayout');
    assert.sameOrderedMembers(collectControlScopes(uischema), cardFieldScopes);
  });

  test('accepts a valid card draft with a saved billing address', async () => {
    const validate = await loadCreditCardSchema();

    assert.isTrue(validate(savedBillingAddressDraft));
  });

  test('requires new billing address fields when the sentinel is selected', async () => {
    const validate = await loadCreditCardSchema();
    const invalidDraft = {
      ...savedBillingAddressDraft,
      billingAddressValue: '__new__',
    };

    assert.isFalse(validate(invalidDraft));
    assert.includeMembers(
      (validate.errors ?? []).map((error) => error.instancePath),
      ['/country', '/addressLine1', '/city', '/state', '/zip']
    );
    assert.isTrue(validate(newBillingAddressDraft));
  });

  test('rejects invalid card field formats', async () => {
    const validate = await loadCreditCardSchema();

    assert.isFalse(validate({...savedBillingAddressDraft, name: ''}));
    assert.isFalse(validate({...savedBillingAddressDraft, fullName: ''}));
    assert.isFalse(validate({...savedBillingAddressDraft, cvv: '12'}));
    assert.isFalse(
      validate({...savedBillingAddressDraft, expirationDate: '13 / 30'})
    );
  });

  test('rejects invalid new billing address values', async () => {
    const validate = await loadCreditCardSchema();

    assert.isFalse(validate({...newBillingAddressDraft, country: 'CA'}));
    assert.isFalse(validate({...newBillingAddressDraft, state: 'ZZ'}));
    assert.isFalse(validate({...newBillingAddressDraft, zip: '5304'}));
  });
});
