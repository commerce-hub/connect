import type { CardNetwork } from '../contracts/api-models';

export function normalizeCardNumber(value: string): string {
  return value.replace(/\D/g, '');
}

export function normalizeCvv(value: string): string {
  return value.replace(/\D/g, '');
}

export function detectCardNetwork(cardNumber: string): CardNetwork | undefined {
  const digits = normalizeCardNumber(cardNumber);

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
}

export function isValidCardNumber(cardNumber: string): boolean {
  const digits = normalizeCardNumber(cardNumber);

  if (digits.length < 12 || digits.length > 19) {
    return false;
  }

  let sum = 0;
  let doubleNext = false;

  for (let index = digits.length - 1; index >= 0; index -= 1) {
    let digit = Number.parseInt(digits[index] ?? '', 10);
    if (Number.isNaN(digit)) {
      return false;
    }

    if (doubleNext) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    doubleNext = !doubleNext;
  }

  return sum % 10 === 0;
}

export function parseExpiration(value: string): { month?: string; year?: string } {
  const digits = value.replace(/\D/g, '');
  if (digits.length < 4) {
    return {};
  }

  const month = digits.slice(0, 2);
  const year = digits.slice(2, 4);
  const monthNumber = Number.parseInt(month, 10);

  if (monthNumber < 1 || monthNumber > 12) {
    return {};
  }

  return {
    month,
    year,
  };
}

export function isValidCvv(value: string): boolean {
  return /^\d{3,4}$/.test(normalizeCvv(value));
}

export function formatCardNumberForDisplay(cardNumber: string): string {
  return normalizeCardNumber(cardNumber).replace(/(.{4})/g, '$1 ').trim();
}

export function maskCardNumberForDisplay(cardNumber: string): string {
  const digits = normalizeCardNumber(cardNumber);
  const visibleDigits = 4;
  const maskedDigits =
    '*'.repeat(Math.max(0, digits.length - visibleDigits)) + digits.slice(-visibleDigits);

  return maskedDigits.replace(/(.{4})/g, '$1 ').trim();
}

export function maskCvvForDisplay(cvv: string): string {
  return '*'.repeat(normalizeCvv(cvv).length);
}
