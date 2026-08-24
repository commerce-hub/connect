import type {components} from '../../generated/openapi.js';
import {
  createTranslator,
  type Translator,
} from '../localization/localization.js';
import type {
  CardDraft,
  CardDraftErrors,
  CardDraftTextField,
  CardEncryptionState,
  CardFieldEncryptionState,
  SensitiveCardField,
} from '../types.js';

type Address = components['schemas']['Address'];
type CardNetwork = components['schemas']['CardDetail']['network'];

export const NEW_BILLING_ADDRESS_VALUE = '__new__';
export const CARD_NUMBER_MAX_DIGITS = 19;
export const CARD_NUMBER_MAX_DISPLAY_LENGTH = 23;
export const EXPIRATION_DATE_MAX_DISPLAY_LENGTH = 7;

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
  field: CardDraftTextField,
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
  const digits = normalizeCardNumber(value).slice(0, CARD_NUMBER_MAX_DIGITS);

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
  const digits = value.replace(/\D/g, '').slice(0, 4);

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

export const validateCardDraft = (
  draft: CardDraft,
  translator: Translator = createTranslator()
): CardDraftErrors => {
  const errors: CardDraftErrors = {};

  if (!draft.name) {
    errors.name = translator.message('card.error.nameRequired');
  } else if (!/^[A-Za-z0-9 ]+$/.test(draft.name)) {
    errors.name = translator.message('card.error.namePattern');
  }

  if (!draft.fullName) {
    errors.fullName = translator.message('card.error.fullNameRequired');
  }

  if (!isValidCardNumber(draft.cardNumber)) {
    errors.cardNumber = translator.message('card.error.numberInvalid');
  }

  if (!parseExpirationDate(draft.expirationDate)) {
    errors.expirationDate = translator.message('card.error.expirationInvalid');
  }

  if (!isValidCvv(draft.cvv)) {
    errors.cvv = translator.message('card.error.cvvInvalid');
  }

  if (!draft.billingAddressValue) {
    errors.billingAddressValue = translator.message(
      'card.error.billingAddressRequired'
    );
  }

  if (draft.billingAddressValue === NEW_BILLING_ADDRESS_VALUE) {
    if (!draft.country) {
      errors.country = translator.message('card.error.countryRequired');
    }

    if (!draft.addressLine1) {
      errors.addressLine1 = translator.message('card.error.addressRequired');
    }

    if (!draft.city) {
      errors.city = translator.message('card.error.cityRequired');
    }

    if (!draft.state) {
      errors.state = translator.message('card.error.stateRequired');
    }

    if (!/^\d{5}(?:-\d{4})?$/.test(draft.zip)) {
      errors.zip = translator.message('card.error.zipInvalid');
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

export const hasRequiredCardDraftValues = (draft: CardDraft): boolean => {
  const requiredValues = [
    draft.name,
    draft.fullName,
    draft.cardNumber,
    draft.expirationDate,
    draft.cvv,
    draft.billingAddressValue,
  ];

  if (draft.billingAddressValue === NEW_BILLING_ADDRESS_VALUE) {
    requiredValues.push(
      draft.country,
      draft.addressLine1,
      draft.city,
      draft.state,
      draft.zip
    );
  }

  return requiredValues.every((value) => Boolean(value.trim()));
};

export const validateSensitiveCardField = (
  field: SensitiveCardField,
  value: string,
  translator: Translator = createTranslator()
): string | undefined => {
  if (field === 'cardNumber') {
    return isValidCardNumber(value)
      ? undefined
      : translator.message('card.error.numberInvalid');
  }

  return isValidCvv(value)
    ? undefined
    : translator.message('card.error.cvvInvalid');
};

export const buildCardEncryptionErrorMessage = (
  field: SensitiveCardField,
  translator: Translator = createTranslator()
): string =>
  field === 'cardNumber'
    ? translator.message('card.error.numberEncryption')
    : translator.message('card.error.cvvEncryption');

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
  encryption: CardEncryptionState,
  translator: Translator = createTranslator()
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
          ? buildCardEncryptionErrorMessage(field, translator)
          : field === 'cardNumber'
          ? translator.message('card.error.numberNotEncrypted')
          : translator.message('card.error.cvvNotEncrypted');
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
  if (!/^\d(?: ?\d)*$/.test(value)) {
    return false;
  }

  const digits = normalizeCardNumber(value);

  if (digits.length < 12 || digits.length > CARD_NUMBER_MAX_DIGITS) {
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

export const isValidCvv = (value: string): boolean => /^\d{3,4}$/.test(value);

export const parseExpirationDate = (
  value: string,
  currentDate = new Date()
): {month: string; year: string} | undefined => {
  const match = /^(\d{2}) \/ (\d{2})$/.exec(value);

  if (!match) {
    return undefined;
  }

  const [, month, yearDigits] = match;
  const monthNumber = Number(month);

  if (monthNumber < 1 || monthNumber > 12) {
    return undefined;
  }

  const year = `20${yearDigits}`;
  const yearNumber = Number(year);
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;

  if (
    yearNumber < currentYear ||
    (yearNumber === currentYear && monthNumber < currentMonth)
  ) {
    return undefined;
  }

  return {month, year};
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
