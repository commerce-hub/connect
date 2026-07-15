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

export type BankAccountFormField = keyof BankAccountDraft;

export type BankAccountFormErrorKeyword =
  | 'required'
  | 'minLength'
  | 'maxLength'
  | 'pattern'
  | 'equals';

export type BankAccountFormFieldSchema = {
  type: 'string';
  title?: string;
  description?: string;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  'x-equalsField'?: BankAccountFormField;
  'x-errorMessages'?: Partial<Record<BankAccountFormErrorKeyword, string>>;
};

export type BankAccountFormSchema = {
  type: 'object';
  properties: Partial<Record<BankAccountFormField, BankAccountFormFieldSchema>>;
  required?: BankAccountFormField[];
};

export const legacyBankAccountFormSchema: BankAccountFormSchema = {
  type: 'object',
  properties: {
    accountNickname: {
      type: 'string',
      minLength: 3,
      description: 'Please enter the account nickname',
      title: 'Account Nickname',
      'x-errorMessages': {
        required: 'Enter an account nickname of at least 3 characters.',
        minLength: 'Enter an account nickname of at least 3 characters.',
      },
    },
    routingNumber: {
      type: 'string',
      description: 'Please enter the routing number',
      title: 'Routing number',
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
      description: 'Please enter the account number',
      title: 'Account number',
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
      description: 'Confirm the account number',
      title: 'Confirm account number',
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

const bankAccountFormFields: readonly BankAccountFormField[] = [
  'accountNickname',
  'routingNumber',
  'accountNumber',
  'confirmAccountNumber',
];

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const isBankAccountFormField = (
  field: unknown
): field is BankAccountFormField =>
  typeof field === 'string' &&
  (bankAccountFormFields as readonly string[]).includes(field);

const isBankAccountFormFieldSchema = (
  value: unknown
): value is BankAccountFormFieldSchema =>
  isRecord(value) && value.type === 'string';

export const isBankAccountFormSchema = (
  value: unknown
): value is BankAccountFormSchema => {
  if (!isRecord(value) || value.type !== 'object') {
    return false;
  }

  const properties = value.properties;

  if (!isRecord(properties)) {
    return false;
  }

  return bankAccountFormFields.every((field) =>
    isBankAccountFormFieldSchema(properties[field])
  );
};

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
  draft: BankAccountDraft,
  schema: BankAccountFormSchema
): BankAccountDraftErrors => {
  const errors: BankAccountDraftErrors = {};

  for (const field of schema.required ?? []) {
    if (!isBankAccountFormField(field)) {
      continue;
    }

    const value = normalizeBankAccountDraftValueForSchema(field, draft[field]);

    if (!value) {
      errors[field] = getBankAccountFieldErrorMessage(
        schema,
        field,
        'required',
        'Enter a value.'
      );
      continue;
    }

    const fieldError = validateBankAccountDraftFieldSchema(
      field,
      value,
      schema
    );

    if (fieldError) {
      errors[field] = fieldError;
    }
  }

  for (const field of schema.required ?? []) {
    if (!isBankAccountFormField(field)) {
      continue;
    }

    if (errors[field]) {
      continue;
    }

    const equalsField = getBankAccountEqualsField(schema, field);

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
        schema,
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
  value: string,
  schema: BankAccountFormSchema
): string | undefined => {
  const fieldSchema = getBankAccountFieldSchema(schema, field);

  if (
    fieldSchema.minLength !== undefined &&
    value.length < fieldSchema.minLength
  ) {
    return getBankAccountFieldErrorMessage(
      schema,
      field,
      'minLength',
      buildBankAccountFieldLengthMessage(field)
    );
  }

  if (
    fieldSchema.maxLength !== undefined &&
    value.length > fieldSchema.maxLength
  ) {
    return getBankAccountFieldErrorMessage(
      schema,
      field,
      'maxLength',
      buildBankAccountFieldLengthMessage(field)
    );
  }

  if (
    fieldSchema.pattern !== undefined &&
    !new RegExp(fieldSchema.pattern).test(value)
  ) {
    return getBankAccountFieldErrorMessage(
      schema,
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
  encryption: BankAccountEncryptionState,
  schema?: BankAccountFormSchema
): boolean => {
  if (schema === undefined) {
    return false;
  }

  const normalizedDraft = normalizeBankAccountDraftForValidation(
    draft,
    encryption
  );

  return (
    Object.keys(validateBankAccountDraft(normalizedDraft, schema)).length ===
      0 &&
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
  schema,
  field,
  value,
}: {
  draft: BankAccountDraft;
  errors: BankAccountDraftErrors;
  encryption: BankAccountEncryptionState;
  schema: BankAccountFormSchema;
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
        normalizeBankAccountDraftForValidation(nextDraft, encryption),
        schema
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
      normalizeBankAccountDraftForValidation(nextDraft, nextEncryption),
      schema
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

const getBankAccountFieldSchema = (
  schema: BankAccountFormSchema,
  field: BankAccountFormField
): BankAccountFormFieldSchema => schema.properties[field] ?? {type: 'string'};

const getBankAccountFieldErrorMessage = (
  schema: BankAccountFormSchema,
  field: BankAccountFormField,
  keyword: BankAccountFormErrorKeyword,
  fallback: string
): string =>
  getBankAccountFieldSchema(schema, field)['x-errorMessages']?.[keyword] ??
  fallback;

const getBankAccountEqualsField = (
  schema: BankAccountFormSchema,
  field: BankAccountFormField
): BankAccountFormField | undefined => {
  const equalsField = getBankAccountFieldSchema(schema, field)['x-equalsField'];

  return isBankAccountFormField(equalsField) ? equalsField : undefined;
};
