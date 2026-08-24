import {
  CARD_SOURCE_ACTION_BRAND_IMAGE,
  MANUAL_BANK_SOURCE_ACTION_BRAND_IMAGE,
  PAY_BY_BANK_SOURCE_ACTION_BRAND_IMAGE,
} from './source-action-brand-images.js';
import type {
  AddPaymentTenderOption,
  AllowedTenderOptions,
  NoSavedPaymentMethodsScreenCopy,
} from './types.js';

export const resolveAddPaymentTenders = ({
  isUsa,
  allowedTenderOptions,
  copy,
}: {
  isUsa: boolean;
  allowedTenderOptions: AllowedTenderOptions;
  copy: Pick<
    NoSavedPaymentMethodsScreenCopy,
    | 'addCardTitle'
    | 'addCardSubtitle'
    | 'addBankAccountTitle'
    | 'addBankAccountSubtitle'
    | 'payByBankTitle'
    | 'payByBankSubtitle'
    | 'manualBankTitle'
    | 'manualBankSubtitle'
  >;
}): AddPaymentTenderOption[] => {
  const tenders: AddPaymentTenderOption[] = [];

  if (allowedTenderOptions.card) {
    tenders.push({
      action: 'add-card',
      title: copy.addCardTitle,
      subtitle: copy.addCardSubtitle,
      icon: 'card',
      brandImage: CARD_SOURCE_ACTION_BRAND_IMAGE,
    });
  }

  if (!allowedTenderOptions.bankAccount) {
    return tenders;
  }

  if (!isUsa) {
    tenders.push({
      action: 'add-bank-account',
      title: copy.addBankAccountTitle,
      subtitle: copy.addBankAccountSubtitle,
      icon: 'bank',
      brandImage: MANUAL_BANK_SOURCE_ACTION_BRAND_IMAGE,
    });
    return tenders;
  }

  tenders.push(
    {
      action: 'add-pay-by-bank',
      title: copy.payByBankTitle ?? 'Pay by Bank',
      subtitle:
        copy.payByBankSubtitle ?? 'Directly connect with your bank account',
      icon: 'bank',
      brandImage: PAY_BY_BANK_SOURCE_ACTION_BRAND_IMAGE,
    },
    {
      action: 'add-ach-manually',
      title: copy.manualBankTitle ?? 'Manual bank details',
      subtitle: copy.manualBankSubtitle ?? 'Add your account details manually',
      icon: 'bank',
      brandImage: MANUAL_BANK_SOURCE_ACTION_BRAND_IMAGE,
    }
  );

  return tenders;
};
