import type {
  BankAccountDraft,
  BankAccountDraftErrors,
  BankAccountEncryptionState,
  CardFieldEncryptionState,
  SensitiveBankAccountField,
} from '../types.js';
import {
  createCardEncryptionFieldState,
  resolveDirtyCardEncryptionState,
} from './card-form-state.js';
import {
  bankAccountFormSchema,
  getBankAccountEqualsField,
  getBankAccountFieldErrorMessage,
  getBankAccountFieldSchema,
  type BankAccountFormField,
} from './form.js';

export const createBankAccountDraft = (): BankAccountDraft => ({
  accountNickname: '',
  routingNumber: '',
  accountNumber: '',
  confirmAccountNumber: '',
});

export const createBankAccountEncryptionState =
  (): BankAccountEncryptionState => ({
    routingNumber: createCardEncryptionFieldState(),
    accountNumber: createCardEncryptionFieldState(),
    confirmAccountNumber: createCardEncryptionFieldState(),
  });

export const isSensitiveBankAccountField = (
  field?: string
): field is SensitiveBankAccountField =>
  field === 'routingNumber' ||
  field === 'accountNumber' ||
  field === 'confirmAccountNumber';

export const normalizeBankAccountNumber = (value: string): string =>
  value.replace(/\D/g, '');

export const isEncryptedBankAccountDisplayValue = (
  value: string,
  encryptedField: CardFieldEncryptionState
): boolean =>
  encryptedField.status === 'encrypted' &&
  Boolean(encryptedField.normalizedValue) &&
  value === maskSensitiveDisplayValue(encryptedField.normalizedValue);

export const maskSensitiveDisplayValue = (value: string): string => {
  if (value.length <= 4) {
    return value;
  }

  return `${'•'.repeat(value.length - 4)}${lastFour(value)}`;
};

export const bankAccountInputType = (
  field: SensitiveBankAccountField,
  draft: BankAccountDraft,
  encryption: BankAccountEncryptionState
): 'password' | 'text' => {
  if (field === 'routingNumber') {
    return 'text';
  }

  return isEncryptedBankAccountDisplayValue(draft[field], encryption[field])
    ? 'text'
    : 'password';
};

export const formatBankAccountDraftFieldValue = (
  field: keyof BankAccountDraft,
  value: string
): string => {
  if (field === 'routingNumber') {
    return normalizeBankAccountNumber(value).slice(0, 9);
  }

  if (field === 'accountNumber' || field === 'confirmAccountNumber') {
    return normalizeBankAccountNumber(value).slice(0, 9);
  }

  return value;
};

export const normalizeBankAccountDraftForValidation = (
  draft: BankAccountDraft,
  encryption: BankAccountEncryptionState
): BankAccountDraft => ({
  accountNickname: draft.accountNickname.trim(),
  routingNumber: normalizeBankAccountDraftFieldForValidation(
    'routingNumber',
    draft,
    encryption
  ),
  accountNumber: normalizeBankAccountDraftFieldForValidation(
    'accountNumber',
    draft,
    encryption
  ),
  confirmAccountNumber: normalizeBankAccountDraftFieldForValidation(
    'confirmAccountNumber',
    draft,
    encryption
  ),
});

export const normalizeBankAccountDraftFieldForValidation = (
  field: SensitiveBankAccountField,
  draft: BankAccountDraft,
  encryption: BankAccountEncryptionState
): string => {
  const value = draft[field];
  const encryptedField = encryption[field];

  if (isEncryptedBankAccountDisplayValue(value, encryptedField)) {
    return encryptedField.normalizedValue;
  }

  return normalizeBankAccountNumber(value);
};

export const normalizeBankAccountDraftForDisplay = (
  draft: BankAccountDraft,
  encryption: BankAccountEncryptionState
): BankAccountDraft => ({
  accountNickname: draft.accountNickname,
  routingNumber: normalizeBankAccountDraftFieldForDisplay(
    'routingNumber',
    draft,
    encryption
  ),
  accountNumber: normalizeBankAccountDraftFieldForDisplay(
    'accountNumber',
    draft,
    encryption
  ),
  confirmAccountNumber: normalizeBankAccountDraftFieldForDisplay(
    'confirmAccountNumber',
    draft,
    encryption
  ),
});

export const normalizeBankAccountDraftFieldForDisplay = (
  field: SensitiveBankAccountField,
  draft: BankAccountDraft,
  encryption: BankAccountEncryptionState
): string => {
  const value = draft[field];

  return isEncryptedBankAccountDisplayValue(value, encryption[field])
    ? value
    : normalizeBankAccountNumber(value);
};

export const validateBankAccountDraft = (
  draft: BankAccountDraft
): BankAccountDraftErrors => {
  const errors: BankAccountDraftErrors = {};

  for (const field of bankAccountFormSchema.required) {
    const value = normalizeBankAccountDraftValueForSchema(field, draft[field]);

    if (!value) {
      errors[field] = getBankAccountFieldErrorMessage(
        field,
        'required',
        'Enter a value.'
      );
      continue;
    }

    const fieldError = validateBankAccountDraftFieldSchema(field, value);

    if (fieldError) {
      errors[field] = fieldError;
    }
  }

  for (const field of bankAccountFormSchema.required) {
    if (errors[field]) {
      continue;
    }

    const equalsField = getBankAccountEqualsField(field);

    if (equalsField === undefined) {
      continue;
    }

    const value = normalizeBankAccountDraftValueForSchema(field, draft[field]);
    const targetValue = normalizeBankAccountDraftValueForSchema(
      equalsField,
      draft[equalsField]
    );

    if (targetValue && value !== targetValue) {
      errors[field] = getBankAccountFieldErrorMessage(
        field,
        'equals',
        'Values must match.'
      );
    }
  }

  return errors;
};

const normalizeBankAccountDraftValueForSchema = (
  field: BankAccountFormField,
  value: string
): string =>
  field === 'accountNickname'
    ? value.trim()
    : normalizeBankAccountNumber(value);

const validateBankAccountDraftFieldSchema = (
  field: BankAccountFormField,
  value: string
): string | undefined => {
  const schema = getBankAccountFieldSchema(field);

  if (schema.minLength !== undefined && value.length < schema.minLength) {
    return getBankAccountFieldErrorMessage(
      field,
      'minLength',
      buildBankAccountFieldLengthMessage(field)
    );
  }

  if (schema.maxLength !== undefined && value.length > schema.maxLength) {
    return getBankAccountFieldErrorMessage(
      field,
      'maxLength',
      buildBankAccountFieldLengthMessage(field)
    );
  }

  if (schema.pattern !== undefined && !new RegExp(schema.pattern).test(value)) {
    return getBankAccountFieldErrorMessage(
      field,
      'pattern',
      buildBankAccountFieldLengthMessage(field)
    );
  }

  return undefined;
};

const buildBankAccountFieldLengthMessage = (
  field: BankAccountFormField
): string =>
  field === 'routingNumber'
    ? 'Enter a 9-digit routing number.'
    : 'Enter a 9-digit account number.';

export const isBankAccountDraftReady = (
  draft: BankAccountDraft,
  encryption: BankAccountEncryptionState
): boolean => {
  const normalizedDraft = normalizeBankAccountDraftForValidation(
    draft,
    encryption
  );

  return (
    Object.keys(validateBankAccountDraft(normalizedDraft)).length === 0 &&
    (['routingNumber', 'accountNumber', 'confirmAccountNumber'] as const).every(
      (field) => {
        const encryptedField = encryption[field];
        const normalizedValue = normalizedDraft[field];

        return (
          encryptedField.status === 'encrypted' &&
          encryptedField.normalizedValue === normalizedValue &&
          Boolean(encryptedField.encryptedValue)
        );
      }
    )
  );
};

export const buildBankAccountEncryptionErrorMessage = (
  field: SensitiveBankAccountField
): string =>
  field === 'routingNumber'
    ? 'Unable to encrypt the routing number. Try again.'
    : 'Unable to encrypt the account number. Try again.';

export const omitBankAccountDraftError = (
  errors: BankAccountDraftErrors,
  field: keyof BankAccountDraft
): BankAccountDraftErrors => {
  const nextErrors = {...errors};

  delete nextErrors[field];

  return nextErrors;
};

export const updateBankAccountDraftFieldState = ({
  draft,
  errors,
  encryption,
  field,
  value,
}: {
  draft: BankAccountDraft;
  errors: BankAccountDraftErrors;
  encryption: BankAccountEncryptionState;
  field: keyof BankAccountDraft;
  value: string;
}): {
  draft: BankAccountDraft;
  errors: BankAccountDraftErrors;
  encryption: BankAccountEncryptionState;
} => {
  if (
    isSensitiveBankAccountField(field) &&
    isEncryptedBankAccountDisplayValue(value, encryption[field])
  ) {
    const nextDraft = {
      ...draft,
      [field]: value,
    };

    return {
      draft: nextDraft,
      errors: validateBankAccountDraft(
        normalizeBankAccountDraftForValidation(nextDraft, encryption)
      ),
      encryption,
    };
  }

  const formattedValue = formatBankAccountDraftFieldValue(field, value);
  const nextDraft = {
    ...draft,
    [field]: formattedValue,
  };
  let nextEncryption = encryption;

  if (isSensitiveBankAccountField(field)) {
    if (isEncryptedBankAccountDisplayValue(formattedValue, encryption[field])) {
      return {draft, errors, encryption};
    }

    nextEncryption = {
      ...encryption,
      [field]: resolveDirtyCardEncryptionState(
        encryption[field],
        normalizeBankAccountNumber(formattedValue)
      ),
    };
  }

  return {
    draft: nextDraft,
    encryption: nextEncryption,
    errors: validateBankAccountDraft(
      normalizeBankAccountDraftForValidation(nextDraft, nextEncryption)
    ),
  };
};

export const resolveBankAccountPayloadFieldValue = (
  field: SensitiveBankAccountField,
  draft: BankAccountDraft,
  encryption: BankAccountEncryptionState
): string => {
  const value = draft[field];
  const normalizedValue = normalizeBankAccountNumber(value);
  const encryptedField = encryption[field];
  const matchesEncryptedValue =
    isEncryptedBankAccountDisplayValue(value, encryptedField) ||
    normalizedValue === encryptedField.normalizedValue;

  if (
    encryptedField.status === 'encrypted' &&
    encryptedField.encryptedValue &&
    matchesEncryptedValue
  ) {
    return encryptedField.encryptedValue;
  }

  if (!normalizedValue) {
    return '';
  }

  throw new Error('ACH detail encryption must complete before saving.');
};

export const bankAccountFieldLastFour = (
  field: SensitiveBankAccountField,
  encryption: BankAccountEncryptionState,
  draft: BankAccountDraft
): string => lastFour(encryption[field].normalizedValue || draft[field]);

export const resolveBankAccountSourceName = (
  name: string,
  displayAccountNumber: string
): string => name.trim() || `Bank Account xxxxxx${displayAccountNumber}`;

const lastFour = (value?: string): string =>
  value?.replace(/\D/g, '').slice(-4) ?? '';
