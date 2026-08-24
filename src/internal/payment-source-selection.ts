import type {PaymentSource} from './types.js';
import {
  createTranslator,
  type Translator,
} from './localization/localization.js';

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
  source: PaymentSource,
  translator: Translator = createTranslator()
): string | undefined => {
  const status = source.verificationInfo?.status;

  if (status === 'UNDER_REVIEW') {
    return translator.message('status.needsReview');
  }

  if (status === 'REQUIRE_INFO') {
    return translator.message('status.needsInfo');
  }

  if (status === 'DECLINED') {
    return translator.message('status.cannotUse');
  }

  if (status !== 'VERIFIED') {
    return translator.message('status.needsInfo');
  }

  if (!requiresRecipientProvisioning(source)) {
    return translator.message('status.verified');
  }

  const recipientStatus = normalizedRecipientStatus(source);

  if (recipientStatus === 'PROVISIONED') {
    return translator.message('status.verifiedProvisioned');
  }

  return translator.message('status.verifiedPending');
};
