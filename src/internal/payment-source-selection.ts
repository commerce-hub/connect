import type {PaymentSource} from './types.js';

const requiresRecipientProvisioning = (source: PaymentSource): boolean =>
  ['BankAccount', 'BANK_ACCOUNT', 'Card', 'CARD'].includes(
    source.tenderType as string
  );

const normalizedRecipientStatus = (
  source: PaymentSource
): string | undefined => {
  const status =
    source.recipient?.status?.trim() ||
    source.recipient?.provisionStatus?.trim();

  return status ? status.toUpperCase() : undefined;
};

// Verified cards and banks are selectable only once their recipient is
// PROVISIONED. Other source types remain selectable when verified.
export const isPaymentSourceSelectionEligible = (
  source: PaymentSource
): boolean => {
  if (source.verificationInfo?.status !== 'VERIFIED') {
    return false;
  }

  if (!requiresRecipientProvisioning(source)) {
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

  if (!requiresRecipientProvisioning(source)) {
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
