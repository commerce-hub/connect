import assert from 'node:assert/strict';
import test from 'node:test';

test('checks mandatory presence independently from full validity', async () => {
  const cardModule = await import('../internal/forms/card-form-state.js');
  const bankModule = await import(
    '../internal/forms/bank-account-form-state.js'
  );
  const transferModule = await import(
    '../internal/forms/transfer-form-state.js'
  );
  const schemaModule = await import('../internal/forms/instrument-schema.js');
  const requiredInfoModule = await import(
    '../internal/forms/required-info-form-state.js'
  );

  assert.equal(typeof cardModule.hasRequiredCardDraftValues, 'function');
  assert.equal(typeof bankModule.hasRequiredBankAccountDraftValues, 'function');
  assert.equal(
    typeof transferModule.hasRequiredTransferDraftValues,
    'function'
  );
  assert.equal(typeof schemaModule.hasRequiredJsonSchemaValues, 'function');
  assert.equal(typeof requiredInfoModule.validateRequiredInfoSsn, 'function');
  assert.equal(
    requiredInfoModule.validateRequiredInfoSsn('12345'),
    'Enter a 9-digit Social Security number.'
  );
  assert.equal(
    requiredInfoModule.validateRequiredInfoSsn('123456789'),
    undefined
  );

  const cardDraft = {
    ...cardModule.createCardDraft(),
    name: 'Card',
    fullName: 'A',
    cardNumber: '1',
    expirationDate: '1',
    cvv: '1',
    country: 'US',
    addressLine1: '1 Main',
    city: 'Brookfield',
    state: 'WI',
    zip: 'x',
  };
  assert.equal(cardModule.hasRequiredCardDraftValues(cardDraft), true);
  assert.notDeepEqual(cardModule.validateCardDraft(cardDraft), {});
  assert.equal(
    cardModule.hasRequiredCardDraftValues({...cardDraft, fullName: '   '}),
    false
  );

  const bankSchema = bankModule.legacyBankAccountFormSchema;
  const bankDraft = {
    accountNickname: 'Account',
    routingNumber: '1',
    accountNumber: '2',
    confirmAccountNumber: '3',
  };
  assert.equal(
    bankModule.hasRequiredBankAccountDraftValues(bankDraft, bankSchema),
    true
  );
  assert.notDeepEqual(
    bankModule.validateBankAccountDraft(bankDraft, bankSchema),
    {}
  );
  assert.equal(
    bankModule.hasRequiredBankAccountDraftValues(
      {...bankDraft, accountNumber: ''},
      bankSchema
    ),
    false
  );

  const transferDraft = {
    fromSourceId: 'same',
    toSourceId: 'same',
    amount: '-1',
  };
  assert.equal(
    transferModule.hasRequiredTransferDraftValues(transferDraft),
    true
  );
  assert.notDeepEqual(
    transferModule.validateTransferDraft(transferDraft, [{id: 'same'}]),
    {}
  );
  assert.equal(
    transferModule.hasRequiredTransferDraftValues({
      ...transferDraft,
      amount: '',
    }),
    false
  );

  const jsonSchema = {
    type: 'object',
    properties: {
      accountNumber: {type: 'string', minLength: 4},
      address: {
        type: 'object',
        properties: {city: {type: 'string'}},
        required: ['city'],
      },
    },
    required: ['accountNumber', 'address'],
  };
  assert.equal(
    schemaModule.hasRequiredJsonSchemaValues(jsonSchema, {
      accountNumber: '1',
      address: {city: 'X'},
    }),
    true
  );
  assert.equal(
    schemaModule.hasRequiredJsonSchemaValues(jsonSchema, {
      accountNumber: '1',
      address: {city: '   '},
    }),
    false
  );
});
