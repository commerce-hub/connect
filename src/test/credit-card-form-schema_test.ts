import {assert} from '@open-wc/testing';
import Ajv, {type ValidateFunction} from 'ajv';

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

const loadCreditCardSchema = async (): Promise<ValidateFunction> => {
  const response = await fetch('/credit-card-form.json');

  assert.isTrue(
    response.ok,
    'credit-card-form.json should be served from the repository root'
  );

  const schema = await response.json();
  const ajv = new Ajv({allErrors: true});

  return ajv.compile(schema);
};

suite('credit card JSONForms data schema', () => {
  test('serves the JSON schema itself without form wrappers', async () => {
    const response = await fetch('/credit-card-form.json');

    assert.isTrue(
      response.ok,
      'credit-card-form.json should be served from the repository root'
    );

    const schema = await response.json();

    assert.equal(schema.type, 'object');
    assert.notProperty(schema, 'schema');
    assert.notProperty(schema, 'uischema');
    assert.notProperty(schema, 'validations');
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
