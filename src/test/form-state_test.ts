import {assert} from '@open-wc/testing';

import {
  createBankAccountDraft,
  createBankAccountEncryptionState,
  createLegacyBankAccountFormSchema,
  formatBankAccountDraftFieldValue,
  hasRequiredBankAccountDraftValues,
  isBankAccountDraftReady,
  legacyBankAccountFormSchema,
  maskSensitiveDisplayValue,
  normalizeBankAccountDraftForValidation,
  resolveBankAccountPayloadFieldValue,
  updateBankAccountDraftFieldState,
  validateBankAccountDraft,
  type BankAccountFormSchema,
} from '../internal/forms/bank-account-form-state.js';
import {
  NEW_BILLING_ADDRESS_VALUE,
  createCardDraft,
  createCardEncryptionState,
  detectCardNetwork,
  formatCardDraftFieldValue,
  hasRequiredCardDraftValues,
  isCardDraftReady,
  isValidCardNumber,
  isValidCvv,
  normalizeCardDraft,
  parseExpirationDate,
  buildCardEncryptionErrorMessage,
  resolveEncryptedCardFieldValue,
  validateCardDraft,
  validateCardEncryptionReadiness,
  validateSensitiveCardField,
} from '../internal/forms/card-form-state.js';
import {hasRequiredJsonSchemaValues} from '../internal/forms/instrument-schema.js';
import {maskRevealText} from '../internal/forms/mask-reveal.js';
import {createTranslator} from '../internal/localization/localization.js';
import {
  OTP_LENGTH,
  normalizeOtpValue,
  sanitizeOtpValue,
  writeOtpDigits,
} from '../internal/forms/otp-form-state.js';
import {
  hasRequiredInfoFile,
  hasRequiredInfoTextValue,
  hasValidRequiredInfoDocumentSignature,
  isAllowedRequiredInfoDocumentFile,
  normalizeRequiredInfoSsn,
  requiredInfoSsnSegmentMaxLength,
  requiredInfoSsnSegments,
  storeRequiredInfoFile,
  storeRequiredInfoValue,
  validateRequiredInfoDocumentFile,
  validateRequiredInfoDocumentFileContent,
  validateRequiredInfoSsn,
} from '../internal/forms/required-info-form-state.js';
import {
  createTransferDraft,
  formatTransferAmountForReview,
  hasRequiredTransferDraftValues,
  isTransferDraftReady,
  normalizeTransferDraft,
  validateTransferDraft,
} from '../internal/forms/transfer-form-state.js';

const bankAccountFormSchema: BankAccountFormSchema = {
  type: 'object',
  properties: {
    accountNickname: {
      type: 'string',
      minLength: 3,
      'x-errorMessages': {
        required: 'Enter an account nickname of at least 3 characters.',
        minLength: 'Enter an account nickname of at least 3 characters.',
      },
    },
    routingNumber: {
      type: 'string',
      minLength: 9,
      maxLength: 9,
      pattern: '^[0-9]{9}$',
      'x-errorMessages': {
        required: 'Enter a routing number.',
        minLength: 'Enter a 9-digit routing number.',
        maxLength: 'Enter a 9-digit routing number.',
        pattern: 'Enter a 9-digit routing number.',
      },
    },
    accountNumber: {
      type: 'string',
      minLength: 9,
      maxLength: 9,
      pattern: '^[0-9]{9}$',
      'x-errorMessages': {
        required: 'Enter an account number.',
        minLength: 'Enter a 9-digit account number.',
        maxLength: 'Enter a 9-digit account number.',
        pattern: 'Enter a 9-digit account number.',
      },
    },
    confirmAccountNumber: {
      type: 'string',
      minLength: 9,
      maxLength: 9,
      pattern: '^[0-9]{9}$',
      'x-equalsField': 'accountNumber',
      'x-errorMessages': {
        required: 'Confirm the account number.',
        minLength: 'Enter a 9-digit account number.',
        maxLength: 'Enter a 9-digit account number.',
        pattern: 'Enter a 9-digit account number.',
        equals: 'Account numbers must match.',
      },
    },
  },
  required: [
    'accountNickname',
    'routingNumber',
    'accountNumber',
    'confirmAccountNumber',
  ],
};

suite('form state models', () => {
  test('localizes the SDK-owned legacy bank account schema', () => {
    const schema = createLegacyBankAccountFormSchema(createTranslator('fr-CA'));

    assert.equal(schema.properties.accountNickname?.title, 'Nom du compte');
    assert.equal(
      schema.properties.routingNumber?.['x-errorMessages']?.required,
      'Entrez un numéro de routage.'
    );
  });

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
    assert.equal(formatCardDraftFieldValue('cvv', '1a2-3 4x5'), '1234');
    assert.notProperty(createCardDraft(), 'markAsDefault');
    assert.notProperty(normalizedDraft, 'markAsDefault');
    assert.deepEqual(parseExpirationDate(draft.expirationDate), {
      month: '04',
      year: '2030',
    });
    assert.equal(
      formatCardDraftFieldValue('expirationDate', '04301234'),
      '04 / 30'
    );
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
    assert.deepEqual(
      validateCardEncryptionReadiness(
        draft,
        createCardEncryptionState(),
        createTranslator('fr-CA')
      ),
      {
        cardNumber: 'Chiffrez le numéro de carte avant de l’enregistrer.',
        cvv: 'Chiffrez le CVC avant de l’enregistrer.',
      }
    );
  });

  test('accepts only three or four CVV digits', () => {
    assert.isTrue(isValidCvv('123'));
    assert.isTrue(isValidCvv('1234'));
    assert.isFalse(isValidCvv('12'));
    assert.isFalse(isValidCvv('12345'));
    assert.isFalse(isValidCvv('12a3'));
  });

  test('accepts only a non-expired MM / YY expiration date', () => {
    const currentDate = new Date(2026, 7, 1);

    assert.deepEqual(parseExpirationDate('08 / 26', currentDate), {
      month: '08',
      year: '2026',
    });
    assert.isUndefined(parseExpirationDate('07 / 26', currentDate));
    assert.isUndefined(parseExpirationDate('13 / 30', currentDate));
    assert.isUndefined(parseExpirationDate('04 / 2030', currentDate));
    assert.isUndefined(parseExpirationDate('04a/ 30', currentDate));
  });

  test('accepts only card numbers containing at most 19 digits', () => {
    assert.isTrue(isValidCardNumber('4111 1111 1111 1111'));
    assert.isFalse(isValidCardNumber('3214 1242 1424 2422'));
    assert.isFalse(isValidCardNumber('4111a1111b1111c1111'));
    assert.isFalse(isValidCardNumber('41111111111111111111'));
    assert.equal(
      formatCardDraftFieldValue('cardNumber', '4111a1111b1111c11112222'),
      '4111 1111 1111 1111 222'
    );
  });

  test('separates required card presence from card validity', () => {
    const draft = {
      ...createCardDraft(),
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

    assert.isTrue(hasRequiredCardDraftValues(draft));
    assert.isNotEmpty(validateCardDraft(draft));
    assert.isFalse(hasRequiredCardDraftValues({...draft, fullName: '   '}));
  });

  test('localizes SDK-owned card validation and encryption errors', () => {
    const translator = createTranslator('fr-CA');

    assert.equal(
      validateCardDraft(createCardDraft(), translator).name,
      'Entrez un nom de carte.'
    );
    assert.equal(
      validateSensitiveCardField('cardNumber', '123', translator),
      'Entrez un numéro de carte valide.'
    );
    assert.equal(
      buildCardEncryptionErrorMessage('cvv', translator),
      'Impossible de chiffrer le CVC. Réessayez.'
    );
  });

  test('rejects special characters in the card name', () => {
    const validDraft = {
      ...createCardDraft(),
      name: 'Corporate Card 2',
    };

    assert.notProperty(validateCardDraft(validDraft), 'name');
    assert.equal(
      validateCardDraft({...validDraft, name: 'Corporate@Card'}).name,
      'Card name can only contain letters and numbers.'
    );
  });

  test('formats, validates, masks, and resolves manual ACH fields', () => {
    const draft = {
      ...createBankAccountDraft(),
      accountNickname: ' Household checking ',
      routingNumber: formatBankAccountDraftFieldValue(
        'routingNumber',
        '021000021xxx'
      ),
      accountNumber: formatBankAccountDraftFieldValue(
        'accountNumber',
        '987654321xxx'
      ),
      confirmAccountNumber: formatBankAccountDraftFieldValue(
        'confirmAccountNumber',
        '987654321xxx'
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
    encryption.confirmAccountNumber = {
      status: 'encrypted',
      normalizedValue: normalizedDraft.confirmAccountNumber,
      encryptedValue: 'enc-account-confirm',
    };

    assert.equal(draft.routingNumber, '021000021');
    assert.equal(draft.accountNumber, '987654321');
    assert.deepEqual(
      validateBankAccountDraft(normalizedDraft, bankAccountFormSchema),
      {}
    );
    assert.isTrue(
      isBankAccountDraftReady(draft, encryption, bankAccountFormSchema)
    );
    assert.equal(maskSensitiveDisplayValue(draft.accountNumber), '•••••4321');
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

  test('maskRevealText masks all characters unless the last is revealed', () => {
    assert.equal(maskRevealText('', false), '');
    assert.equal(maskRevealText('', true), '');
    assert.equal(maskRevealText('123', false), '•••');
    assert.equal(maskRevealText('123', true), '••3');
    assert.equal(maskRevealText('1', true), '1');
    assert.equal(maskRevealText('1234', true), '•••4');
    assert.equal(maskRevealText('4111 1111', false), '•••• ••••');
    assert.equal(maskRevealText('4111 1111', true), '•••• •••1');
  });

  test('requires ACH nickname and exactly nine digits for account fields', () => {
    const draft = {
      ...createBankAccountDraft(),
      accountNickname: 'ab',
      routingNumber: '02100002',
      accountNumber: '12345678',
      confirmAccountNumber: '123456789',
    };

    assert.deepEqual(validateBankAccountDraft(draft, bankAccountFormSchema), {
      accountNickname: 'Enter an account nickname of at least 3 characters.',
      routingNumber: 'Enter a 9-digit routing number.',
      accountNumber: 'Enter a 9-digit account number.',
      confirmAccountNumber: 'Account numbers must match.',
    });
  });

  test('fallback ACH fields accept any non-empty digit length', () => {
    const draft = {
      ...createBankAccountDraft(),
      accountNickname: 'Household checking',
      routingNumber: formatBankAccountDraftFieldValue('routingNumber', '12-34'),
      accountNumber: formatBankAccountDraftFieldValue(
        'accountNumber',
        '1234 5678 9012'
      ),
      confirmAccountNumber: formatBankAccountDraftFieldValue(
        'confirmAccountNumber',
        '1234 5678 9012'
      ),
    };

    assert.equal(draft.routingNumber, '1234');
    assert.equal(draft.accountNumber, '123456789012');
    assert.deepEqual(
      validateBankAccountDraft(draft, legacyBankAccountFormSchema),
      {}
    );
    assert.deepEqual(
      validateBankAccountDraft(
        {...draft, routingNumber: '', confirmAccountNumber: '1'},
        legacyBankAccountFormSchema
      ),
      {
        routingNumber: 'Enter a routing number.',
        confirmAccountNumber: 'Account numbers must match.',
      }
    );
  });

  test('checks required legacy bank values without validating formats', () => {
    const draft = {
      accountNickname: 'Account',
      routingNumber: '1',
      accountNumber: '2',
      confirmAccountNumber: '3',
    };

    assert.isTrue(
      hasRequiredBankAccountDraftValues(draft, bankAccountFormSchema)
    );
    assert.isNotEmpty(validateBankAccountDraft(draft, bankAccountFormSchema));
    assert.isFalse(
      hasRequiredBankAccountDraftValues(
        {...draft, accountNumber: ''},
        bankAccountFormSchema
      )
    );
  });

  test('updates ACH state immutably and marks changed sensitive fields dirty', () => {
    const draft = createBankAccountDraft();
    const encryption = createBankAccountEncryptionState();
    const nextState = updateBankAccountDraftFieldState({
      draft,
      errors: {},
      encryption,
      schema: bankAccountFormSchema,
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
    assert.equal(
      formatTransferAmountForReview(draft, createTranslator('fr-CA')),
      '10,50 USD'
    );
    assert.deepEqual(validateTransferDraft({...draft, amount: '0'}, sources), {
      amount: 'Enter an amount greater than zero.',
    });
  });

  test('checks transfer presence independently from transfer validity', () => {
    const draft = {
      fromSourceId: 'same',
      toSourceId: 'same',
      amount: '-1',
    };

    assert.isTrue(hasRequiredTransferDraftValues(draft));
    assert.isNotEmpty(validateTransferDraft(draft, [{id: 'same'}]));
    assert.isFalse(hasRequiredTransferDraftValues({...draft, amount: ''}));
  });

  test('localizes SDK-owned transfer validation errors', () => {
    const errors = validateTransferDraft(
      createTransferDraft(),
      [],
      createTranslator('fr-CA')
    );

    assert.equal(errors.fromSourceId, 'Sélectionnez un compte source.');
    assert.equal(errors.amount, 'Entrez un montant.');
  });

  test('checks nested required JSON Schema values without format validation', () => {
    const schema = {
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

    assert.isTrue(
      hasRequiredJsonSchemaValues(schema, {
        accountNumber: '1',
        address: {city: 'X'},
      })
    );
    assert.isFalse(
      hasRequiredJsonSchemaValues(schema, {
        accountNumber: '1',
        address: {city: '   '},
      })
    );
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
    const file = new File(['synthetic'], 'synthetic-document.pdf', {
      type: 'application/pdf',
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
    assert.equal(
      validateRequiredInfoSsn('12345'),
      'Enter a 9-digit Social Security number.'
    );
    assert.equal(
      validateRequiredInfoSsn('12345', createTranslator('fr-CA')),
      'Entrez un numéro de sécurité sociale à 9 chiffres.'
    );
    assert.isUndefined(validateRequiredInfoSsn('123456789'));
    assert.isTrue(hasRequiredInfoTextValue(values, 'SOCIAL_SECURITY_NUMBER-0'));
    assert.isTrue(hasRequiredInfoFile(fileState.files, 'DOCUMENT-0'));
    assert.equal(fileState.fileNames['DOCUMENT-0'], 'synthetic-document.pdf');
  });

  test('accepts only PDF, JPEG, and PNG document uploads', () => {
    const pdf = new File(['%PDF'], 'statement.pdf', {
      type: 'application/pdf',
    });
    const jpeg = new File(['jpeg'], 'letter.jpeg', {type: 'image/jpeg'});
    const png = new File(['png'], 'check.png', {type: 'image/png'});
    const text = new File(['text'], 'statement.txt', {type: 'text/plain'});
    const noMimeType = new File(['jpg'], 'check.JPG', {type: ''});
    const noMimeTypeUnknownExtension = new File(['exe'], 'malware.exe', {
      type: '',
    });

    assert.isTrue(isAllowedRequiredInfoDocumentFile(pdf));
    assert.isTrue(isAllowedRequiredInfoDocumentFile(jpeg));
    assert.isTrue(isAllowedRequiredInfoDocumentFile(png));
    assert.isTrue(isAllowedRequiredInfoDocumentFile(noMimeType));
    assert.isFalse(isAllowedRequiredInfoDocumentFile(text));
    assert.isFalse(
      isAllowedRequiredInfoDocumentFile(noMimeTypeUnknownExtension)
    );

    assert.isUndefined(validateRequiredInfoDocumentFile(pdf));
    assert.equal(
      validateRequiredInfoDocumentFile(text),
      'Unsupported file type. Upload a JPG, PNG, or PDF file.'
    );
    assert.equal(
      validateRequiredInfoDocumentFile(text, createTranslator('fr-CA')),
      'Type de fichier non pris en charge. Téléversez un fichier JPG, PNG ou PDF.'
    );
  });

  test('rejects files whose content does not match their claimed type', async () => {
    const realPdf = new File(['%PDF-1.4 synthetic contents'], 'statement.pdf', {
      type: 'application/pdf',
    });
    const realPng = new File(
      [
        new Uint8Array([
          0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 1, 2, 3,
        ]),
      ],
      'check.png',
      {type: 'image/png'}
    );
    // A zip archive (starts with "PK\x03\x04") renamed to claim a .pdf/MIME type.
    const zipRenamedToPdf = new File(
      [new Uint8Array([0x50, 0x4b, 0x03, 0x04, 1, 2, 3])],
      'malware.pdf',
      {type: 'application/pdf'}
    );

    assert.isTrue(await hasValidRequiredInfoDocumentSignature(realPdf));
    assert.isTrue(await hasValidRequiredInfoDocumentSignature(realPng));
    assert.isFalse(
      await hasValidRequiredInfoDocumentSignature(zipRenamedToPdf)
    );

    assert.isUndefined(await validateRequiredInfoDocumentFileContent(realPdf));
    assert.equal(
      await validateRequiredInfoDocumentFileContent(zipRenamedToPdf),
      'Unsupported file type. Upload a JPG, PNG, or PDF file.'
    );
  });
});
