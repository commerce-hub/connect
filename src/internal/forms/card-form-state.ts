import type {UISchemaElement} from '@jsonforms/core';
import type {components} from '../../generated/openapi.js';
import type {
  CardDraft,
  CardDraftErrors,
  CardEncryptionState,
  CardFieldEncryptionState,
  SensitiveCardField,
} from '../types.js';

type Address = components['schemas']['Address'];
type CardNetwork = components['schemas']['CardDetail']['network'];

export const NEW_BILLING_ADDRESS_VALUE = '__new__';

export type CardFormField = keyof CardDraft;

export type CardFormFieldSchema = {
  type: 'string';
  title?: string;
  description?: string;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  enum?: string[];
};

export type CardFormSchema = {
  type: 'object';
  properties: Partial<Record<CardFormField, CardFormFieldSchema>>;
  required?: CardFormField[];
};

const cardFormFields: readonly CardFormField[] = [
  'name',
  'cardNumber',
  'expirationDate',
  'cvv',
  'fullName',
  'billingAddressValue',
  'country',
  'addressLine1',
  'addressLine2',
  'city',
  'state',
  'zip',
];

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const isCardFormFieldSchema = (value: unknown): value is CardFormFieldSchema =>
  isRecord(value) && value.type === 'string';

export const isCardFormSchema = (value: unknown): value is CardFormSchema => {
  if (!isRecord(value) || value.type !== 'object') {
    return false;
  }

  const properties = value.properties;

  if (!isRecord(properties)) {
    return false;
  }

  return cardFormFields.every((field) =>
    isCardFormFieldSchema(properties[field])
  );
};

export const isCardFormUiSchema = (value: unknown): value is UISchemaElement =>
  isRecord(value) &&
  value.type === 'VerticalLayout' &&
  Array.isArray(value.elements);

export const createCardDraft = (): CardDraft => ({
  name: '',
  fullName: '',
  cardNumber: '',
  expirationDate: '',
  cvv: '',
  billingAddressValue: NEW_BILLING_ADDRESS_VALUE,
  country: '',
  addressLine1: '',
  addressLine2: '',
  city: '',
  state: '',
  zip: '',
});

export const createCardEncryptionFieldState = (): CardFieldEncryptionState => ({
  status: 'idle',
  normalizedValue: '',
});

export const createCardEncryptionState = (): CardEncryptionState => ({
  cardNumber: createCardEncryptionFieldState(),
  cvv: createCardEncryptionFieldState(),
});

export const isSensitiveCardField = (
  field?: string
): field is SensitiveCardField => field === 'cardNumber' || field === 'cvv';

export const normalizeCardNumber = (value: string): string =>
  value.replace(/\D/g, '');

export const normalizeCvv = (value: string): string => value.replace(/\D/g, '');

export const normalizeSensitiveCardFieldValue = (
  field: SensitiveCardField,
  value: string
): string =>
  field === 'cardNumber' ? normalizeCardNumber(value) : normalizeCvv(value);

export const formatCardDraftFieldValue = (
  field: keyof CardDraft,
  value: string
): string => {
  if (field === 'cardNumber') {
    return formatCardNumberForDisplay(value);
  }

  if (field === 'expirationDate') {
    return formatExpirationDateForDisplay(value);
  }

  if (field === 'cvv') {
    return normalizeCvv(value).slice(0, 4);
  }

  return value;
};

export const formatCardNumberForDisplay = (value: string): string => {
  const digits = normalizeCardNumber(value).slice(0, 19);

  return formatDigitsByGroups(digits, resolveCardNumberGroupPattern(digits));
};

export const resolveCardNumberGroupPattern = (digits: string): number[] => {
  if (/^3[47]/.test(digits)) {
    return [4, 6, 5];
  }

  if (/^3(?:0[0-5]|[68])/.test(digits)) {
    return [4, 6, 4];
  }

  return [4, 4, 4, 4, 3];
};

export const formatDigitsByGroups = (
  digits: string,
  groups: number[]
): string => {
  const parts: string[] = [];
  let offset = 0;

  for (const size of groups) {
    if (offset >= digits.length) {
      break;
    }

    parts.push(digits.slice(offset, offset + size));
    offset += size;
  }

  if (offset < digits.length) {
    parts.push(digits.slice(offset));
  }

  return parts.join(' ');
};

export const formatExpirationDateForDisplay = (value: string): string => {
  const digits = value.replace(/\D/g, '').slice(0, 6);

  if (digits.length <= 2) {
    return digits.length === 2 ? `${digits} / ` : digits;
  }

  return `${digits.slice(0, 2)} / ${digits.slice(2)}`;
};

export const normalizeCardDraft = (draft: CardDraft): CardDraft => ({
  name: draft.name.trim(),
  fullName: draft.fullName.trim(),
  cardNumber: draft.cardNumber.trim(),
  expirationDate: draft.expirationDate.trim(),
  cvv: draft.cvv.trim(),
  billingAddressValue:
    draft.billingAddressValue.trim() || NEW_BILLING_ADDRESS_VALUE,
  country: draft.country.trim(),
  addressLine1: draft.addressLine1.trim(),
  addressLine2: draft.addressLine2.trim(),
  city: draft.city.trim(),
  state: draft.state.trim(),
  zip: draft.zip.trim(),
});

export const validateCardDraft = (draft: CardDraft): CardDraftErrors => {
  const errors: CardDraftErrors = {};

  if (!draft.name) {
    errors.name = 'Enter a card name.';
  }

  if (!draft.fullName) {
    errors.fullName = 'Enter the full name.';
  }

  if (!isValidCardNumber(draft.cardNumber)) {
    errors.cardNumber = 'Enter a valid card number.';
  }

  if (!parseExpirationDate(draft.expirationDate)) {
    errors.expirationDate = 'Enter a valid expiration date.';
  }

  if (!isValidCvv(draft.cvv)) {
    errors.cvv = 'Enter a valid CVC.';
  }

  if (!draft.billingAddressValue) {
    errors.billingAddressValue = 'Select a billing address.';
  }

  if (draft.billingAddressValue === NEW_BILLING_ADDRESS_VALUE) {
    if (!draft.country) {
      errors.country = 'Select a country or region.';
    }

    if (!draft.addressLine1) {
      errors.addressLine1 = 'Enter an address.';
    }

    if (!draft.city) {
      errors.city = 'Enter a city.';
    }

    if (!draft.state) {
      errors.state = 'Select a state.';
    }

    if (!/^\d{5}(?:-\d{4})?$/.test(draft.zip)) {
      errors.zip = 'Enter a valid ZIP code.';
    }
  }

  return errors;
};

export const isCardDraftReady = (
  draft: CardDraft,
  encryption: CardEncryptionState
): boolean =>
  Object.keys(validateCardDraft(normalizeCardDraft(draft))).length === 0 &&
  Object.keys(validateCardEncryptionReadiness(draft, encryption)).length === 0;

export const validateSensitiveCardField = (
  field: SensitiveCardField,
  value: string
): string | undefined => {
  if (field === 'cardNumber') {
    return isValidCardNumber(value) ? undefined : 'Enter a valid card number.';
  }

  return isValidCvv(value) ? undefined : 'Enter a valid CVC.';
};

export const buildCardEncryptionErrorMessage = (
  field: SensitiveCardField
): string =>
  field === 'cardNumber'
    ? 'Unable to encrypt the card number. Try again.'
    : 'Unable to encrypt the CVC. Try again.';

export const resolveDirtyCardEncryptionState = (
  previous: CardFieldEncryptionState,
  normalizedValue: string
): CardFieldEncryptionState => {
  if (!normalizedValue) {
    return createCardEncryptionFieldState();
  }

  if (
    previous.normalizedValue === normalizedValue &&
    (previous.status === 'encrypting' || previous.status === 'encrypted')
  ) {
    return previous;
  }

  return {
    status: 'dirty',
    normalizedValue,
  };
};

export const omitCardDraftError = (
  errors: CardDraftErrors,
  field: keyof CardDraft
): CardDraftErrors => {
  const nextErrors = {...errors};

  delete nextErrors[field];

  return nextErrors;
};

export const validateCardEncryptionReadiness = (
  draft: CardDraft,
  encryption: CardEncryptionState
): CardDraftErrors => {
  const errors: CardDraftErrors = {};

  for (const field of ['cardNumber', 'cvv'] as const) {
    const normalizedValue = normalizeSensitiveCardFieldValue(
      field,
      draft[field]
    );
    const encryptedField = encryption[field];

    if (!normalizedValue) {
      continue;
    }

    const isEncrypted =
      encryptedField.status === 'encrypted' &&
      encryptedField.normalizedValue === normalizedValue &&
      Boolean(encryptedField.encryptedValue);

    if (!isEncrypted) {
      errors[field] =
        encryptedField.status === 'failed'
          ? buildCardEncryptionErrorMessage(field)
          : field === 'cardNumber'
          ? 'Encrypt the card number before saving.'
          : 'Encrypt the CVC before saving.';
    }
  }

  return errors;
};

export const resolveEncryptedCardFieldValue = (
  field: SensitiveCardField,
  value: string,
  encryption: CardEncryptionState
): string => {
  const normalizedValue = normalizeSensitiveCardFieldValue(field, value);
  const encryptedField = encryption[field];

  if (
    encryptedField.status !== 'encrypted' ||
    encryptedField.normalizedValue !== normalizedValue ||
    !encryptedField.encryptedValue
  ) {
    throw new Error(
      field === 'cardNumber'
        ? 'Card number encryption must complete before saving.'
        : 'CVC encryption must complete before saving.'
    );
  }

  return encryptedField.encryptedValue;
};

export const isValidCardNumber = (value: string): boolean => {
  const digits = normalizeCardNumber(value);

  if (digits.length < 12 || digits.length > 19) {
    return false;
  }

  let sum = 0;
  let shouldDouble = false;

  for (let index = digits.length - 1; index >= 0; index -= 1) {
    let digit = Number(digits[index]);

    if (shouldDouble) {
      digit *= 2;

      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    shouldDouble = !shouldDouble;
  }

  return sum % 10 === 0;
};

export const isValidCvv = (value: string): boolean =>
  /^\d{3,4}$/.test(normalizeCvv(value));

export const parseExpirationDate = (
  value: string
): {month: string; year: string} | undefined => {
  const digits = value.replace(/\D/g, '');
  const month = digits.slice(0, 2);
  const yearDigits = digits.slice(2);
  const monthNumber = Number(month);

  if (month.length !== 2 || monthNumber < 1 || monthNumber > 12) {
    return undefined;
  }

  if (yearDigits.length === 2) {
    return {month, year: `20${yearDigits}`};
  }

  if (yearDigits.length === 4) {
    return {month, year: yearDigits};
  }

  return undefined;
};

export const detectCardNetwork = (value: string): CardNetwork | undefined => {
  const digits = normalizeCardNumber(value);

  if (/^4/.test(digits)) {
    return 'Visa';
  }

  if (/^(5[1-5]|2[2-7])/.test(digits)) {
    return 'Mastercard';
  }

  if (/^3[47]/.test(digits)) {
    return 'AmericanExpress';
  }

  if (/^(6011|65|64[4-9])/.test(digits)) {
    return 'Discover';
  }

  return undefined;
};

export const reconcileCardDraftBillingAddress = (
  draft: CardDraft,
  billingAddresses: Address[]
): CardDraft => {
  const savedAddressIds = billingAddresses
    .map((address) => address.id?.trim())
    .filter((addressId): addressId is string => Boolean(addressId));

  if (!savedAddressIds.length) {
    return {
      ...draft,
      billingAddressValue: NEW_BILLING_ADDRESS_VALUE,
    };
  }

  if (savedAddressIds.includes(draft.billingAddressValue)) {
    return draft;
  }

  const hasNewBillingAddressInput = [
    draft.country,
    draft.addressLine1,
    draft.addressLine2,
    draft.city,
    draft.state,
    draft.zip,
  ].some((value) => value.trim());

  if (
    draft.billingAddressValue === NEW_BILLING_ADDRESS_VALUE &&
    hasNewBillingAddressInput
  ) {
    return draft;
  }

  return {
    ...draft,
    billingAddressValue: savedAddressIds[0],
  };
};

export const billingAddressFromCardDraft = (draft: CardDraft): Address => ({
  id: createLocalBillingAddressId(),
  recipientNameOrAddress: draft.fullName,
  country: draft.country,
  street: draft.addressLine1,
  houseNumberOrName: draft.addressLine2 || undefined,
  city: draft.city,
  stateOrProvince: draft.state,
  postalCode: draft.zip,
});

let billingAddressIdCounter = 0;

const createLocalBillingAddressId = (): string => {
  billingAddressIdCounter += 1;

  return `billing-address-${Date.now().toString(
    36
  )}-${billingAddressIdCounter.toString(36)}`;
};
