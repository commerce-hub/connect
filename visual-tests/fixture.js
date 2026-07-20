import '../dist/commerce-hub-connect.min.js';

const verified = {status: 'VERIFIED'};

const corporateCard = {
  tenderType: 'Card',
  id: 'card-corporate',
  name: 'Corporate Visa',
  verificationInfo: verified,
  card: {
    network: 'Visa',
    cardNumber: '4111111111114242',
    expirationMonth: 12,
    expirationYear: 2030,
  },
};

const operatingBank = {
  tenderType: 'BankAccount',
  id: 'bank-operating',
  name: 'Operating account',
  verificationInfo: verified,
  bankAccount: {
    bankName: 'Commerce National Bank',
    accountNumber: '9876543210',
  },
};

const reserveBank = {
  tenderType: 'BankAccount',
  id: 'bank-reserve',
  name: 'Reserve account',
  verificationInfo: verified,
  bankAccount: {
    bankName: 'Harbor Trust',
    accountNumber: '2468013579',
  },
};

const pendingBank = {
  tenderType: 'BankAccount',
  id: 'bank-pending',
  name: 'Payroll account',
  verificationInfo: {status: 'UNDER_REVIEW'},
  bankAccount: {
    bankName: 'Community Bank',
    accountNumber: '0000006789',
  },
};

const declinedCard = {
  tenderType: 'Card',
  id: 'card-travel',
  name: 'Travel Mastercard',
  verificationInfo: {status: 'DECLINED'},
  card: {
    network: 'Mastercard',
    cardNumber: '5555555555554444',
  },
};

const requiredInfoBank = {
  ...operatingBank,
  verificationInfo: {
    status: 'REQUIRE_INFO',
    docs: [
      {docType: 'BANK_STATEMENT', mandatory: true},
      {docType: 'DRIVER_LICENSE_NUMBER', mandatory: true},
      {docType: 'SOCIAL_SECURITY_NUMBER', mandatory: true},
    ],
  },
};

const paymentSources = [
  corporateCard,
  operatingBank,
  reserveBank,
  pendingBank,
  declinedCard,
];

const paymentResponse = () => ({
  status: 'OTP_VALIDATION_SUCCESS',
  features: ['ADD_ACCOUNT', 'SELECT', 'TRANSFER'],
  allowedTenderTypes: ['CARD', 'BANK_ACCOUNT'],
  selectedSource: corporateCard,
  paymentSources,
});

const scenario = new URLSearchParams(window.location.search).get('scenario');

const fixtureConfigurations = {
  loading: {
    response: {
      interactionId: 'visual-loading',
      status: 'OTP_VALIDATION_SUCCESS',
      features: ['ADD_ACCOUNT', 'SELECT'],
      allowedTenderTypes: ['CARD', 'BANK_ACCOUNT'],
      paymentSources: [],
    },
    configureFetch() {
      window.fetch = () => new Promise(() => undefined);
    },
    ready: '.payment-method-skeletons',
  },
  list: {response: paymentResponse()},
  edit: {
    response: paymentResponse(),
    configure(element) {
      element.paymentSourceEditMode = true;
    },
  },
  confirmed: {
    response: {
      status: 'PAYMENT_SOURCE_ATTACHED',
      features: ['ADD_ACCOUNT', 'SELECT'],
      allowedTenderTypes: ['CARD', 'BANK_ACCOUNT'],
      selectedSource: corporateCard,
      paymentSources: [corporateCard, operatingBank],
    },
  },
  'add-launcher': {
    response: paymentResponse(),
    configure(element) {
      element.addLauncherActive = true;
    },
  },
  'add-card': {
    response: paymentResponse(),
    configure(element) {
      element.cardFlowScreen = 'form';
    },
    ready: '#card-number',
  },
  'add-bank-provider': {
    response: paymentResponse(),
    configure(element) {
      element.bankFlowScreen = 'provider';
      element.bankLinkLoading = false;
    },
    ready: '.provider-frame',
  },
  'add-bank-manual': {
    response: paymentResponse(),
    configure(element) {
      element.bankFlowScreen = 'manual';
      element.manualBankAccountFormMode = 'legacy';
    },
    ready: 'commerce-hub-bank-account-jsonforms',
  },
  transfer: {
    response: paymentResponse(),
    configure(element) {
      element.transferFlowActive = true;
      element.transferFlowScreen = 'confirm';
      element.transferDraft = {
        fromSourceId: 'bank-operating',
        toSourceId: 'bank-reserve',
        amount: '125.50',
      };
    },
    ready: '[data-action="confirm-transfer"]',
  },
  otp: {
    response: {
      status: 'OTP_VALIDATION_PENDING',
      email: 'shopper@example.com',
    },
    ready: '.otp-group',
  },
  'required-info': {
    response: paymentResponse(),
    configure(element) {
      element.requiredInfoSource = requiredInfoBank;
    },
    ready: '.required-info-documents',
  },
  outcome: {
    response: paymentResponse(),
    configure(element) {
      element.bankFlowScreen = 'outcome';
      element.bankOutcomeSource = pendingBank;
    },
    ready: '.verification-outcome-flow',
  },
  error: {
    response: paymentResponse(),
    configure(element) {
      element.cardFlowScreen = 'error';
      element.cardSubmitError =
        'The card could not be verified. Review the details and try again.';
    },
    ready: '.outcome-shell',
  },
};

const waitForShadowSelector = async (element, selector) => {
  for (let attempt = 0; attempt < 60; attempt += 1) {
    if (element.shadowRoot?.querySelector(selector)) {
      return;
    }

    await new Promise((resolve) => requestAnimationFrame(resolve));
  }

  throw new Error(`Visual fixture did not render ${selector}`);
};

const settle = async (element) => {
  await element.updateComplete;
  await document.fonts.ready;
  await new Promise((resolve) => requestAnimationFrame(resolve));
  await element.updateComplete;
  await new Promise((resolve) => requestAnimationFrame(resolve));
};

const configuration = fixtureConfigurations[scenario];

if (!configuration) {
  throw new Error(`Unknown visual fixture scenario: ${scenario}`);
}

configuration.configureFetch?.();

const element = document.createElement('commerce-hub-connect');
element.interactionResponse = configuration.response;
configuration.configure?.(element);
document.body.append(element);

await settle(element);

if (configuration.ready) {
  await waitForShadowSelector(element, configuration.ready);
  await settle(element);
}

document.documentElement.dataset.visualFixtureReady = 'true';
