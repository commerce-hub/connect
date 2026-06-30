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
  const accountNickname = draft.accountNickname.trim();
  const routingNumber = normalizeBankAccountNumber(draft.routingNumber);
  const accountNumber = normalizeBankAccountNumber(draft.accountNumber);
  const confirmAccountNumber = normalizeBankAccountNumber(
    draft.confirmAccountNumber
  );

  if (accountNickname.length < 3) {
    errors.accountNickname =
      'Enter an account nickname of at least 3 characters.';
  }

  if (!routingNumber) {
    errors.routingNumber = 'Enter a routing number.';
  } else if (routingNumber.length !== 9) {
    errors.routingNumber = 'Enter a 9-digit routing number.';
  }

  if (!accountNumber) {
    errors.accountNumber = 'Enter an account number.';
  } else if (accountNumber.length !== 9) {
    errors.accountNumber = 'Enter a 9-digit account number.';
  }

  if (!confirmAccountNumber) {
    errors.confirmAccountNumber = 'Confirm the account number.';
  } else if (confirmAccountNumber.length !== 9) {
    errors.confirmAccountNumber = 'Enter a 9-digit account number.';
  } else if (accountNumber && confirmAccountNumber !== accountNumber) {
    errors.confirmAccountNumber = 'Account numbers must match.';
  }

  return errors;
};

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
    (
      ['routingNumber', 'accountNumber', 'confirmAccountNumber'] as const
    ).every((field) => {
      const encryptedField = encryption[field];
      const normalizedValue = normalizedDraft[field];

      return (
        encryptedField.status === 'encrypted' &&
        encryptedField.normalizedValue === normalizedValue &&
        Boolean(encryptedField.encryptedValue)
      );
    })
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
