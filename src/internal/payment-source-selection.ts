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
  const status =
    source.recipient?.status?.trim() ||
    source.recipient?.provisionStatus?.trim();

  return status ? status.toUpperCase() : undefined;
};

// A verified bank is selectable only once its recipient is PROVISIONED; a bank
// with any other or absent recipient status is not yet selectable. Non-bank
// sources have no recipient and remain selectable when verified.
export const isPaymentSourceSelectionEligible = (
  source: PaymentSource
): boolean => {
  if (source.verificationInfo?.status !== 'VERIFIED') {
    return false;
  }

  if (!isBankPaymentSource(source)) {
    return true;
  }

  return normalizedRecipientStatus(source) === 'PROVISIONED';
};

export const isPaymentSourceMarkAsDefaultEligible = (
  source: PaymentSource
): boolean => source.verificationInfo?.status === 'VERIFIED';

export const paymentSourceVerificationLabel = (
  source: PaymentSource
): string | undefined => {
  if (source.verificationInfo?.status !== 'VERIFIED') {
    return undefined;
  }

  if (!isBankPaymentSource(source)) {
    return 'Verified';
  }

  const recipientStatus = normalizedRecipientStatus(source);

  if (!recipientStatus) {
    return 'Verified';
  }

  if (recipientStatus === 'PROVISIONED') {
    return 'Verified, Provisioned';
  }

  return 'Verified, Pending';
};
