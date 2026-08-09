import {assert} from '@open-wc/testing';

import {resolveAddPaymentTenders} from '../internal/add-payment-tenders.js';

const copy = {
  addCardTitle: 'Credit or debit card',
  addCardSubtitle: 'Add your card details',
  addBankAccountTitle: 'Bank account',
  addBankAccountSubtitle: 'Connect or enter an account',
};

suite('add payment tenders', () => {
  test('splits an allowed USA bank account into PBB and manual tenders', () => {
    assert.deepEqual(
      resolveAddPaymentTenders({
        isUsa: true,
        allowedTenderOptions: {
          card: true,
          bankAccount: true,
          nativeAccount: false,
        },
        copy,
      }).map(({action, title, subtitle, icon, brandImage}) => ({
        action,
        title,
        subtitle,
        icon,
        branded: brandImage?.startsWith('data:image/jpeg;base64,') === true,
      })),
      [
        {
          action: 'add-card',
          title: 'Credit or debit card',
          subtitle: 'Add your card details',
          icon: 'card',
          branded: true,
        },
        {
          action: 'add-pay-by-bank',
          title: 'Pay by Bank',
          subtitle: 'Directly connect with your bank account',
          icon: 'bank',
          branded: true,
        },
        {
          action: 'add-ach-manually',
          title: 'Manual bank details',
          subtitle: 'Add your account details manually',
          icon: 'bank',
          branded: true,
        },
      ]
    );
  });

  test('preserves one configured bank tender outside USA', () => {
    assert.deepEqual(
      resolveAddPaymentTenders({
        isUsa: false,
        allowedTenderOptions: {
          card: false,
          bankAccount: true,
          nativeAccount: false,
        },
        copy: {
          ...copy,
          addBankAccountTitle: 'Connect bank',
          addBankAccountSubtitle: 'Connect checking or savings',
        },
      }).map(({action, title, subtitle, icon, brandImage}) => ({
        action,
        title,
        subtitle,
        icon,
        brandImage,
      })),
      [
        {
          action: 'add-bank-account',
          title: 'Connect bank',
          subtitle: 'Connect checking or savings',
          icon: 'bank',
          brandImage: undefined,
        },
      ]
    );
  });

  test('filters card and both USA bank choices by allowed tender types', () => {
    const cardOnly = resolveAddPaymentTenders({
      isUsa: true,
      allowedTenderOptions: {
        card: true,
        bankAccount: false,
        nativeAccount: false,
      },
      copy,
    });
    const bankOnly = resolveAddPaymentTenders({
      isUsa: true,
      allowedTenderOptions: {
        card: false,
        bankAccount: true,
        nativeAccount: false,
      },
      copy,
    });

    assert.deepEqual(cardOnly.map(({action}) => action), ['add-card']);
    assert.deepEqual(bankOnly.map(({action}) => action), [
      'add-pay-by-bank',
      'add-ach-manually',
    ]);
  });
});
