import type {PaymentSource} from './types.js';

type BankPaymentSource = Extract<PaymentSource, {tenderType: 'BankAccount'}>;

const isBankPaymentSource = (
  source: PaymentSource
): source is BankPaymentSource =>
  source.tenderType === 'BankAccount' ||
  (source.tenderType as string) === 'BANK_ACCOUNT';

const normalizedRecipientStatus = (
  source: BankPaymentSource
): string | undefined => {
  const status = source.recipient?.status?.trim();

  return status ? status.toUpperCase() : undefined;
};

export const isPaymentSourceSelectionEligible = (
  source: PaymentSource
): boolean => {
  if (source.verificationInfo?.status !== 'VERIFIED') {
    return false;
  }

  if (!isBankPaymentSource(source) || !source.recipient) {
    return true;
  }

  return normalizedRecipientStatus(source) === 'PROVISIONED';
};

export const paymentSourceVerificationLabel = (
  source: PaymentSource
): string | undefined => {
  if (
    source.verificationInfo?.status !== 'VERIFIED' ||
    !isBankPaymentSource(source) ||
    !source.recipient
  ) {
    return undefined;
  }

  return normalizedRecipientStatus(source) === 'PROVISIONED'
    ? 'Verified & Ready'
    : 'Verified';
};
