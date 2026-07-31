import assert from 'node:assert/strict';
import test from 'node:test';

import {
  isPaymentSourceSelectionEligible,
  paymentSourceVerificationLabel,
} from '../internal/payment-source-selection.js';

const bankSource = (verificationStatus, recipient) => ({
  tenderType: 'BankAccount',
  id: 'bank-1',
  verificationInfo: {status: verificationStatus},
  ...(recipient === undefined ? {} : {recipient}),
});

test('verified recipient matrix controls bank selection and labels', () => {
  const cases = [
    {
      source: bankSource('VERIFIED'),
      eligible: true,
      label: undefined,
    },
    {
      source: bankSource('VERIFIED', {
        id: 'recipient-1',
        status: 'PROVISIONED',
      }),
      eligible: true,
      label: 'Verified & Ready',
    },
    {
      source: bankSource('VERIFIED', {
        id: 'recipient-2',
        status: 'PENDING',
      }),
      eligible: false,
      label: 'Verified',
    },
    {
      source: bankSource('VERIFIED', {id: 'recipient-3', status: ' '}),
      eligible: false,
      label: 'Verified',
    },
  ];

  for (const {source, eligible, label} of cases) {
    assert.equal(isPaymentSourceSelectionEligible(source), eligible);
    assert.equal(paymentSourceVerificationLabel(source), label);
  }
});

test('non-verified sources retain their existing status presentation path', () => {
  for (const status of [
    'NOT_VERIFIED',
    'REQUIRE_INFO',
    'UNDER_REVIEW',
    'DECLINED',
  ]) {
    const source = bankSource(status, {
      id: 'recipient-1',
      status: 'PROVISIONED',
    });

    assert.equal(isPaymentSourceSelectionEligible(source), false);
    assert.equal(paymentSourceVerificationLabel(source), undefined);
  }
});

test('verified non-bank sources remain selectable', () => {
  const source = {
    tenderType: 'Card',
    id: 'card-1',
    verificationInfo: {status: 'VERIFIED'},
  };

  assert.equal(isPaymentSourceSelectionEligible(source), true);
  assert.equal(paymentSourceVerificationLabel(source), undefined);
});
