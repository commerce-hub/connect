import {assert} from '@open-wc/testing';

import {
  createBankAccountDraft,
  createBankAccountEncryptionState,
  formatBankAccountDraftFieldValue,
  isBankAccountDraftReady,
  maskSensitiveDisplayValue,
  normalizeBankAccountDraftForValidation,
  resolveBankAccountPayloadFieldValue,
  updateBankAccountDraftFieldState,
  validateBankAccountDraft,
} from '../internal/forms/bank-account-form-state.js';
import {
  NEW_BILLING_ADDRESS_VALUE,
  createCardDraft,
  createCardEncryptionState,
  detectCardNetwork,
  formatCardDraftFieldValue,
  isCardDraftReady,
  normalizeCardDraft,
  parseExpirationDate,
  resolveEncryptedCardFieldValue,
  validateCardDraft,
  validateCardEncryptionReadiness,
} from '../internal/forms/card-form-state.js';
import {
  OTP_LENGTH,
  normalizeOtpValue,
  sanitizeOtpValue,
  writeOtpDigits,
} from '../internal/forms/otp-form-state.js';
import {
  hasRequiredInfoFile,
  hasRequiredInfoTextValue,
  normalizeRequiredInfoSsn,
  requiredInfoSsnSegmentMaxLength,
  requiredInfoSsnSegments,
  storeRequiredInfoFile,
  storeRequiredInfoValue,
} from '../internal/forms/required-info-form-state.js';
import {
  createTransferDraft,
  formatTransferAmountForReview,
  isTransferDraftReady,
  normalizeTransferDraft,
  validateTransferDraft,
} from '../internal/forms/transfer-form-state.js';

suite('form state models', () => {
  test('formats and validates card draft fields without mounting the widget', () => {
    const draft = {
      ...createCardDraft(),
      name: '  Ada card  ',
      fullName: ' Ada Lovelace ',
      cardNumber: formatCardDraftFieldValue('cardNumber', '4111111111111111'),
      expirationDate: formatCardDraftFieldValue('expirationDate', '0430'),
      cvv: formatCardDraftFieldValue('cvv', '12345'),
      billingAddressValue: NEW_BILLING_ADDRESS_VALUE,
      country: 'US',
      addressLine1: '1 Main St',
      city: 'Brookfield',
      state: 'WI',
      zip: '53045',
    };
    const normalizedDraft = normalizeCardDraft(draft);
    const encryption = createCardEncryptionState();

    encryption.cardNumber = {
      status: 'encrypted',
      normalizedValue: '4111111111111111',
      encryptedValue: 'enc-card',
    };
    encryption.cvv = {
      status: 'encrypted',
      normalizedValue: '1234',
      encryptedValue: 'enc-cvv',
    };

    assert.equal(draft.cardNumber, '4111 1111 1111 1111');
    assert.equal(draft.expirationDate, '04 / 30');
    assert.equal(draft.cvv, '1234');
    assert.deepEqual(parseExpirationDate(draft.expirationDate), {
      month: '04',
      year: '2030',
    });
    assert.equal(detectCardNetwork(draft.cardNumber), 'Visa');
    assert.deepEqual(validateCardDraft(normalizedDraft), {});
    assert.deepEqual(
      validateCardEncryptionReadiness(normalizedDraft, encryption),
      {}
    );
    assert.isTrue(isCardDraftReady(normalizedDraft, encryption));
    assert.equal(
      resolveEncryptedCardFieldValue(
        'cardNumber',
        draft.cardNumber,
        encryption
      ),
      'enc-card'
    );
  });

  test('keeps card encryption readiness strict for sensitive fields', () => {
    const draft = {
      ...createCardDraft(),
      name: 'Ada card',
      fullName: 'Ada Lovelace',
      cardNumber: '4111 1111 1111 1111',
      expirationDate: '04 / 30',
      cvv: '123',
      country: 'US',
      addressLine1: '1 Main St',
      city: 'Brookfield',
      state: 'WI',
      zip: '53045',
    };

    assert.deepEqual(
      validateCardEncryptionReadiness(draft, createCardEncryptionState()),
      {
        cardNumber: 'Encrypt the card number before saving.',
        cvv: 'Encrypt the CVC before saving.',
      }
    );
  });

  test('formats, validates, masks, and resolves manual ACH fields', () => {
    const draft = {
      ...createBankAccountDraft(),
      name: ' Household checking ',
      routingNumber: formatBankAccountDraftFieldValue(
        'routingNumber',
        '021000021xxx'
      ),
      accountNumber: formatBankAccountDraftFieldValue(
        'accountNumber',
        '987654321012345678'
      ),
      accountNumberReEntered: formatBankAccountDraftFieldValue(
        'accountNumberReEntered',
        '987654321012345678'
      ),
    };
    const encryption = createBankAccountEncryptionState();
    const normalizedDraft = normalizeBankAccountDraftForValidation(
      draft,
      encryption
    );

    encryption.routingNumber = {
      status: 'encrypted',
      normalizedValue: normalizedDraft.routingNumber,
      encryptedValue: 'enc-routing',
    };
    encryption.accountNumber = {
      status: 'encrypted',
      normalizedValue: normalizedDraft.accountNumber,
      encryptedValue: 'enc-account',
    };
    encryption.accountNumberReEntered = {
      status: 'encrypted',
      normalizedValue: normalizedDraft.accountNumberReEntered,
      encryptedValue: 'enc-account-confirm',
    };

    assert.equal(draft.routingNumber, '021000021');
    assert.equal(draft.accountNumber.length, 17);
    assert.deepEqual(validateBankAccountDraft(normalizedDraft), {});
    assert.isTrue(isBankAccountDraftReady(draft, encryption));
    assert.equal(
      maskSensitiveDisplayValue(draft.accountNumber),
      '•••••••••••••4567'
    );
    assert.equal(
      resolveBankAccountPayloadFieldValue(
        'accountNumber',
        {
          ...draft,
          accountNumber: maskSensitiveDisplayValue(draft.accountNumber),
        },
        encryption
      ),
      'enc-account'
    );
  });

  test('updates ACH state immutably and marks changed sensitive fields dirty', () => {
    const draft = createBankAccountDraft();
    const encryption = createBankAccountEncryptionState();
    const nextState = updateBankAccountDraftFieldState({
      draft,
      errors: {},
      encryption,
      field: 'routingNumber',
      value: '021000021',
    });

    assert.notStrictEqual(nextState.draft, draft);
    assert.notStrictEqual(nextState.encryption, encryption);
    assert.equal(nextState.draft.routingNumber, '021000021');
    assert.equal(nextState.encryption.routingNumber.status, 'dirty');
  });

  test('normalizes and validates transfer drafts', () => {
    const sources = [{id: 'from-source'}, {id: 'to-source'}];
    const draft = normalizeTransferDraft({
      ...createTransferDraft(),
      fromSourceId: ' from-source ',
      toSourceId: ' to-source ',
      amount: ' 10.5 ',
    });

    assert.deepEqual(validateTransferDraft(draft, sources), {});
    assert.isTrue(isTransferDraftReady(draft, sources));
    assert.equal(formatTransferAmountForReview(draft), '10.50 USD');
    assert.deepEqual(validateTransferDraft({...draft, amount: '0'}, sources), {
      amount: 'Enter an amount greater than zero.',
    });
  });

  test('normalizes OTP input and distributes pasted digits', () => {
    const result = writeOtpDigits({
      values: ['', '', '', '', '', ''],
      startIndex: 2,
      value: '12-34',
    });

    assert.equal(OTP_LENGTH, 6);
    assert.equal(sanitizeOtpValue('a1 b2 c3'), '123');
    assert.deepEqual(result.values, ['', '', '1', '2', '3', '4']);
    assert.equal(result.lastWrittenIndex, 5);
    assert.equal(normalizeOtpValue(result.values), '1234');
  });

  test('stores required-info values, files, and SSN segments immutably', () => {
    const values = storeRequiredInfoValue(
      {},
      'SOCIAL_SECURITY_NUMBER-0',
      '123'
    );
    const file = new File(['synthetic'], 'synthetic-document.txt', {
      type: 'text/plain',
    });
    const fileState = storeRequiredInfoFile({
      files: {},
      fileNames: {},
      key: 'DOCUMENT-0',
      file,
    });

    assert.equal(normalizeRequiredInfoSsn('123-45-67890'), '123456789');
    assert.deepEqual(requiredInfoSsnSegments('123456789'), [
      '123',
      '45',
      '6789',
    ]);
    assert.equal(requiredInfoSsnSegmentMaxLength(2), 4);
    assert.isTrue(hasRequiredInfoTextValue(values, 'SOCIAL_SECURITY_NUMBER-0'));
    assert.isTrue(hasRequiredInfoFile(fileState.files, 'DOCUMENT-0'));
    assert.equal(fileState.fileNames['DOCUMENT-0'], 'synthetic-document.txt');
  });
});
