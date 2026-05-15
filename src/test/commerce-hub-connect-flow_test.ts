import {fixture, assert, html as testingHtml} from '@open-wc/testing';

import '../commerce-hub-connect.js';
import {
  DEFAULT_COMMERCE_HUB_BASE_URL,
  type InteractionResponse,
  type PaymentSource,
} from '../commerce-hub-connect.js';
import type {CommerceHubConnect} from '../commerce-hub-connect.js';

interface CapturedRequest {
  url: string;
  method: string;
  headers: Headers;
  bodyText: string;
  credentials: RequestCredentials;
}

const nextFrame = () =>
  new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));

const waitFor = async (
  predicate: () => boolean,
  message = 'condition was not met'
) => {
  for (let attempt = 0; attempt < 20; attempt += 1) {
    await nextFrame();

    if (predicate()) {
      return;
    }
  }

  throw new Error(message);
};

const flushElement = async (el: CommerceHubConnect) => {
  await el.updateComplete;
  await nextFrame();
  await el.updateComplete;
};

const renderConnect = async (
  interactionResponse: InteractionResponse,
  designConfig?: unknown
) => {
  const el = (await fixture(
    testingHtml`<commerce-hub-connect
      .interactionResponse=${interactionResponse}
      .designConfig=${designConfig}
    ></commerce-hub-connect>`
  )) as CommerceHubConnect;

  await flushElement(el);

  return el;
};

const setOtpValue = async (el: CommerceHubConnect, value: string) => {
  const inputs = [
    ...el.shadowRoot!.querySelectorAll<HTMLInputElement>('.otp-input'),
  ];

  inputs.forEach((input, index) => {
    input.value = value[index] ?? '';
    input.dispatchEvent(new InputEvent('input', {bubbles: true}));
  });

  await flushElement(el);
};

const clickAction = async (el: CommerceHubConnect, action: string) => {
  el.shadowRoot!.querySelector<HTMLButtonElement>(
    `[data-action="${action}"]`
  )!.click();
  await flushElement(el);
};

const setFieldValue = async (
  el: CommerceHubConnect,
  id: string,
  value: string
) => {
  const input = el.shadowRoot!.querySelector<HTMLInputElement>(`#${id}`)!;

  input.value = value;
  input.dispatchEvent(new InputEvent('input', {bubbles: true}));
  await flushElement(el);
};

const setSelectValue = async (
  el: CommerceHubConnect,
  id: string,
  value: string
) => {
  const select = el.shadowRoot!.querySelector<HTMLSelectElement>(`#${id}`)!;

  select.value = value;
  select.dispatchEvent(new Event('change', {bubbles: true}));
  await flushElement(el);
};

const blurField = async (el: CommerceHubConnect, id: string) => {
  const input = el.shadowRoot!.querySelector<HTMLInputElement>(`#${id}`)!;

  input.dispatchEvent(new FocusEvent('blur', {bubbles: true}));
  await flushElement(el);
};

const waitForRequest = async (
  requests: CapturedRequest[],
  path: string,
  method = 'POST'
) => {
  await waitFor(
    () =>
      requests.some(
        (request) =>
          request.method === method && new URL(request.url).pathname === path
      ),
    `${method} ${path} was not requested`
  );
};

const recordOutputEvents = (el: Element) => {
  const successEvents: CustomEvent<PaymentSource>[] = [];
  const errorEvents: CustomEvent<unknown>[] = [];

  el.addEventListener('onSuccess', (event) => {
    successEvents.push(event as CustomEvent<PaymentSource>);
  });
  el.addEventListener('onError', (event) => {
    errorEvents.push(event as CustomEvent<unknown>);
  });

  return {successEvents, errorEvents};
};

interface TestPaymentSdkEvent {
  type?: string;
  payload?: unknown;
  [key: string]: unknown;
}

interface TestPaymentSdkInitConfiguration {
  apiKey: string;
  accessToken: string;
  configId: string;
  containerId: string;
  environment?: string;
  locale?: string;
  aggregatorSessionId?: string;
  publicKey?: string;
  pToken?: string;
  onEvent: (event: TestPaymentSdkEvent) => void | Promise<void>;
}

const paymentSdkWindow = window as Window & {
  PaymentSDK?: {
    init: (configuration: TestPaymentSdkInitConfiguration) => void;
    destroy?: () => void;
  };
};

suite('commerce-hub-connect flow', () => {
  const originalFetch = window.fetch;
  const originalPaymentSdk = paymentSdkWindow.PaymentSDK;

  teardown(() => {
    window.fetch = originalFetch;
    paymentSdkWindow.PaymentSDK = originalPaymentSdk;
    document
      .querySelectorAll('script[data-commerce-hub-pay-by-bank-sdk="true"]')
      .forEach((script) => script.remove());
  });

  test('renders OTP pending with no close, inline resend copy, and a Verify CTA icon', async () => {
    const el = await renderConnect({
      interactionId: 'interaction-otp',
      status: 'OTP_VALIDATION_PENDING',
      email: 'gregory.jablonski@fiserv.com',
    });

    assert.equal(
      el.shadowRoot!.querySelector('.widget-title')?.textContent?.trim(),
      'Enter the code'
    );
    assert.include(
      el.shadowRoot!.querySelector('.widget-subtitle')?.textContent?.trim(),
      'We send a one-time code to gregory.jablonski@fiserv.com.'
    );
    assert.notExists(el.shadowRoot!.querySelector('.widget-close'));
    assert.notExists(el.shadowRoot!.querySelector('.widget-divider'));
    assert.equal(
      el.shadowRoot!.querySelector('.otp-support-copy')?.textContent?.trim(),
      "Didn't receive the code?"
    );
    assert.equal(
      getComputedStyle(
        el.shadowRoot!.querySelector<HTMLElement>('.otp-support')!
      ).display,
      'flex'
    );
    assert.lengthOf(el.shadowRoot!.querySelectorAll('.otp-input'), 6);
    assert.equal(
      el
        .shadowRoot!.querySelector('[data-action="resend-otp"]')
        ?.textContent?.trim(),
      'Resend code'
    );
    assert.equal(
      el
        .shadowRoot!.querySelector('[data-action="verify-otp"]')
        ?.textContent?.trim(),
      'Verify'
    );
    assert.exists(
      el.shadowRoot!.querySelector(
        '[data-action="verify-otp"] .button-icon-check'
      )
    );
  });

  test('renders OTP copy from partial designConfig overrides', async () => {
    const el = await renderConnect(
      {
        interactionId: 'interaction-otp',
        status: 'OTP_VALIDATION_PENDING',
        email: 'gregory.jablonski@fiserv.com',
      },
      {
        copy: {
          otp: {
            title: 'Confirm account access',
            subtitle: 'Use the code sent by Commerce Hub.',
            resendPrefix: 'Need another code?',
            resendButton: 'Send a new code',
            verifyButton: 'Confirm code',
          },
        },
      }
    );

    assert.equal(
      el.shadowRoot!.querySelector('.widget-title')?.textContent?.trim(),
      'Confirm account access'
    );
    assert.equal(
      el.shadowRoot!.querySelector('.widget-subtitle')?.textContent?.trim(),
      'Use the code sent by Commerce Hub.'
    );
    assert.equal(
      el.shadowRoot!.querySelector('.otp-resend-prefix')?.textContent?.trim(),
      'Need another code?'
    );
    assert.equal(
      el
        .shadowRoot!.querySelector('[data-action="resend-otp"]')
        ?.textContent?.trim(),
      'Send a new code'
    );
    assert.equal(
      el
        .shadowRoot!.querySelector('[data-action="verify-otp"]')
        ?.textContent?.trim(),
      'Confirm code'
    );
  });

  test('renders OTP failed with entered digits, danger alert, red inputs, and Try again CTA', async () => {
    const el = await renderConnect({
      interactionId: 'interaction-otp',
      status: 'OTP_VALIDATION_PENDING',
      email: 'gregory.jablonski@fiserv.com',
    });

    await setOtpValue(el, '987654');
    el.interactionResponse = {
      interactionId: 'interaction-otp',
      status: 'OTP_VALIDATION_FAILED',
      email: 'gregory.jablonski@fiserv.com',
    };
    await flushElement(el);

    assert.deepEqual(
      [...el.shadowRoot!.querySelectorAll<HTMLInputElement>('.otp-input')].map(
        (input) => input.value
      ),
      ['9', '8', '7', '6', '5', '4']
    );
    assert.include(
      el.shadowRoot!.querySelector('[role="alert"]')?.textContent?.trim(),
      'code does not match'
    );
    assert.equal(
      el
        .shadowRoot!.querySelector('.otp-group')
        ?.classList.contains('otp-group-error'),
      true
    );
    assert.equal(
      el
        .shadowRoot!.querySelector('[data-action="verify-otp"]')
        ?.textContent?.trim(),
      'Try again'
    );
  });

  test('renders payment methods with compact rows, link actions, and a Confirm CTA', async () => {
    const el = await renderConnect({
      interactionId: 'interaction-payment',
      status: 'PAYMENT_SOURCE_REQUESTED',
      selectedSource: {
        tenderType: 'Card',
        id: 'card-1',
        name: 'Corporate card',
      },
      paymentSources: [
        {
          tenderType: 'Card',
          id: 'card-1',
          name: 'Corporate card',
          verificationInfo: {status: 'VERIFIED'},
          card: {
            network: 'Visa',
            cardNumber: '4111111111114242',
          },
        },
        {
          tenderType: 'BankAccount',
          id: 'bank-1',
          name: 'Operating account',
          verificationInfo: {status: 'UNDER_REVIEW'},
          bankAccount: {
            bankName: 'Commerce National Bank',
            accountNumber: '9876543210',
          },
        },
      ],
    });

    const rows = [
      ...el.shadowRoot!.querySelectorAll<HTMLButtonElement>(
        '.payment-method-row'
      ),
    ];

    assert.deepEqual(
      rows.map((row) => row.dataset.paymentMethodId),
      ['card-1', 'bank-1']
    );
    assert.equal(
      el.shadowRoot!.querySelector('.widget-title')?.textContent?.trim(),
      'Pay with'
    );
    assert.notExists(el.shadowRoot!.querySelector('.widget-subtitle'));
    assert.notExists(el.shadowRoot!.querySelector('.widget-divider'));
    assert.equal(rows[0].getAttribute('aria-checked'), 'true');
    assert.equal(
      rows[0].querySelector('.payment-method-title')?.textContent?.trim(),
      'Corporate card'
    );
    assert.equal(
      rows[0].querySelector('.payment-method-meta')?.textContent?.trim(),
      '•••• 4242'
    );
    assert.exists(rows[0].querySelector('[data-payment-method-icon="visa"]'));

    rows[1].click();
    await flushElement(el);

    assert.equal(rows[0].getAttribute('aria-checked'), 'false');
    assert.equal(rows[1].getAttribute('aria-checked'), 'true');
    assert.notExists(el.shadowRoot!.querySelector('.source-action'));
    assert.deepEqual(
      [...el.shadowRoot!.querySelectorAll('.source-action-link-title')].map(
        (item) => item.textContent?.trim()
      ),
      ['Add a credit or debit card', 'Add bank account']
    );
    const addCardLink = el.shadowRoot!.querySelector<HTMLElement>(
      '[data-action="add-card"]'
    )!;
    const addCardIcon =
      addCardLink.querySelector<HTMLElement>('.source-action-icon')!;

    assert.notExists(el.shadowRoot!.querySelector('.source-action-link-icon'));
    assert.exists(
      el.shadowRoot!.querySelector('[data-action="add-card"] .source-action-icon')
    );
    assert.exists(
      el.shadowRoot!.querySelector(
        '[data-action="add-bank-account"] .source-action-icon'
      )
    );
    assert.equal(getComputedStyle(addCardLink).alignItems, 'center');
    assert.equal(getComputedStyle(addCardIcon).fontSize, '28px');
    assert.equal(getComputedStyle(addCardIcon).fontWeight, '300');
    assert.equal(getComputedStyle(addCardIcon).borderTopStyle, 'solid');
    assert.equal(
      getComputedStyle(addCardIcon).borderTopColor,
      getComputedStyle(addCardIcon).backgroundColor
    );
    assert.equal(
      el
        .shadowRoot!.querySelector('[data-action="confirm-payment-source"]')
        ?.textContent?.trim(),
      'Confirm'
    );
    assert.exists(
      el.shadowRoot!.querySelector(
        '[data-action="confirm-payment-source"] .button-icon-arrow-right'
      )
    );
  });

  test('renders payment methods copy from partial designConfig overrides', async () => {
    const el = await renderConnect(
      {
        interactionId: 'interaction-payment',
        status: 'PAYMENT_SOURCE_REQUESTED',
        selectedSource: {
          tenderType: 'Card',
          id: 'card-1',
          name: 'Corporate card',
        },
        paymentSources: [
          {
            tenderType: 'Card',
            id: 'card-1',
            name: 'Corporate card',
          },
        ],
      },
      {
        copy: {
          paymentMethods: {
            title: 'Choose payment',
            subtitle: 'Select a saved method for this order.',
            addBankAccountTitle: 'Use bank account',
            addBankAccountSubtitle: 'Connect checking or savings',
            addCardTitle: 'Use card',
            addCardSubtitle: 'Add debit or credit card',
            continueButton: 'Pay with selected method',
          },
        },
      }
    );

    assert.equal(
      el.shadowRoot!.querySelector('.widget-title')?.textContent?.trim(),
      'Choose payment'
    );
    assert.equal(
      el.shadowRoot!.querySelector('.widget-subtitle')?.textContent?.trim(),
      'Select a saved method for this order.'
    );
    assert.deepEqual(
      [...el.shadowRoot!.querySelectorAll('.source-action-link-title')].map(
        (item) => item.textContent?.trim()
      ),
      ['Use card', 'Use bank account']
    );
    assert.deepEqual(
      [...el.shadowRoot!.querySelectorAll('.source-action-link-subtitle')].map(
        (item) => item.textContent?.trim()
      ),
      ['Add debit or credit card', 'Connect checking or savings']
    );
    assert.equal(
      el
        .shadowRoot!.querySelector('[data-action="confirm-payment-source"]')
        ?.textContent?.trim(),
      'Pay with selected method'
    );
  });

  test('renders no saved payment methods without a Continue CTA', async () => {
    const el = await renderConnect({
      interactionId: 'interaction-payment',
      status: 'PAYMENT_SOURCE_REQUESTED',
      paymentSources: [],
    });

    assert.equal(
      el.shadowRoot!.querySelector('.widget-title')?.textContent?.trim(),
      'Add payment method'
    );
    assert.notExists(el.shadowRoot!.querySelector('.widget-subtitle'));
    assert.notExists(el.shadowRoot!.querySelector('.widget-divider'));
    assert.notExists(el.shadowRoot!.querySelector('.empty-state'));
    assert.notExists(el.shadowRoot!.querySelector('.source-action'));
    assert.deepEqual(
      [...el.shadowRoot!.querySelectorAll('.source-action-link-title')].map(
        (item) => item.textContent?.trim()
      ),
      ['Add a credit or debit card', 'Add bank account']
    );
    assert.notExists(
      el.shadowRoot!.querySelector('[data-action="confirm-payment-source"]')
    );
  });

  test('renders no-saved-methods copy from partial designConfig overrides', async () => {
    const el = await renderConnect(
      {
        interactionId: 'interaction-payment',
        status: 'PAYMENT_SOURCE_REQUESTED',
        paymentSources: [],
      },
      {
        copy: {
          noSavedPaymentMethods: {
            title: 'Add payment',
            subtitle: 'Start with a new payment method.',
            emptyTitle: 'Nothing saved yet',
            emptyMessage: 'Add a payment method to keep going.',
            addBankAccountTitle: 'Connect bank',
            addBankAccountSubtitle: 'Connect checking or savings',
            addCardTitle: 'Add card',
            addCardSubtitle: 'Use card number and CVV',
          },
        },
      }
    );

    assert.equal(
      el.shadowRoot!.querySelector('.widget-title')?.textContent?.trim(),
      'Add payment'
    );
    assert.equal(
      el.shadowRoot!.querySelector('.widget-subtitle')?.textContent?.trim(),
      'Start with a new payment method.'
    );
    assert.equal(
      el.shadowRoot!.querySelector('.empty-state-title')?.textContent?.trim(),
      'Nothing saved yet'
    );
    assert.equal(
      el.shadowRoot!.querySelector('.empty-state-message')?.textContent?.trim(),
      'Add a payment method to keep going.'
    );
    assert.deepEqual(
      [...el.shadowRoot!.querySelectorAll('.source-action-link-title')].map(
        (item) => item.textContent?.trim()
      ),
      ['Add card', 'Connect bank']
    );
    assert.deepEqual(
      [...el.shadowRoot!.querySelectorAll('.source-action-link-subtitle')].map(
        (item) => item.textContent?.trim()
      ),
      ['Use card number and CVV', 'Connect checking or savings']
    );
  });

  test('opens the add credit card screen from saved payment methods', async () => {
    window.fetch = async () =>
      new Response(JSON.stringify({billingAddress: []}), {
        status: 200,
        headers: {'Content-Type': 'application/json'},
      });

    const el = await renderConnect({
      interactionId: 'interaction-payment',
      status: 'PAYMENT_SOURCE_REQUESTED',
      paymentSources: [
        {
          tenderType: 'Card',
          id: 'card-1',
          name: 'Corporate card',
        },
      ],
    });

    await clickAction(el, 'add-card');

    assert.equal(
      el.shadowRoot!.querySelector('.widget-title')?.textContent?.trim(),
      'Add credit card'
    );
    assert.deepEqual(
      [
        ...el.shadowRoot!.querySelectorAll<HTMLLabelElement>('.field-label'),
      ].map((label) => label.textContent?.trim()),
      [
        'Card label',
        'Name on card',
        'Card number',
        'Expiration date',
        'CVV',
        'Country',
        'Address line 1',
        'Address line 2',
        'City',
        'State',
        'ZIP',
      ]
    );
    assert.notExists(el.shadowRoot!.querySelector('#billing-address'));
    assert.equal(
      el
        .shadowRoot!.querySelector('[data-action="save-card"]')
        ?.textContent?.trim(),
      'Save credit card'
    );
    assert.equal(
      el
        .shadowRoot!.querySelector('[data-action="use-bank-account-instead"]')
        ?.textContent?.trim(),
      'Use bank account instead'
    );
  });

  test('creates a new billing address, creates a customer card, and attaches it', async () => {
    const requests: CapturedRequest[] = [];
    const apiResponse: InteractionResponse = {
      interactionId: 'interaction-payment',
      status: 'PAYMENT_SOURCE_REQUESTED',
      paymentSources: [],
    };

    window.fetch = async (input: RequestInfo | URL) => {
      const request = input instanceof Request ? input : new Request(input);
      requests.push({
        url: request.url,
        method: request.method,
        headers: new Headers(request.headers),
        bodyText: await request.clone().text(),
        credentials: request.credentials,
      });

      if (request.url.endsWith('/customer')) {
        return new Response(JSON.stringify({billingAddress: []}), {
          status: 200,
          headers: {'Content-Type': 'application/json'},
        });
      }

      if (request.url.endsWith('/customer/mask/card')) {
        return new Response(JSON.stringify({value: 'enc-card-1'}), {
          status: 200,
          headers: {'Content-Type': 'application/json'},
        });
      }

      if (request.url.endsWith('/customer/mask/cvv')) {
        return new Response(JSON.stringify({value: 'enc-cvv-1'}), {
          status: 200,
          headers: {'Content-Type': 'application/json'},
        });
      }

      if (request.url.endsWith('/customer/billing-address')) {
        return new Response(null, {status: 204});
      }

      if (request.url.endsWith('/customer/source')) {
        return new Response(JSON.stringify({id: 'card-created-1'}), {
          status: 200,
          headers: {'Content-Type': 'application/json'},
        });
      }

      if (
        request.url.endsWith(
          '/interaction/payment-source/card-created-1/attach'
        )
      ) {
        return new Response(JSON.stringify(apiResponse), {
          status: 200,
          headers: {'Content-Type': 'application/json'},
        });
      }

      return new Response('{}', {
        status: 200,
        headers: {'Content-Type': 'application/json'},
      });
    };

    const el = await renderConnect({
      interactionId: 'interaction-payment',
      status: 'PAYMENT_SOURCE_REQUESTED',
      paymentSources: [],
    });

    await clickAction(el, 'add-card');
    await waitForRequest(requests, '/customer', 'GET');
    await setFieldValue(el, 'card-label', 'Ada corporate card');
    await setFieldValue(el, 'name-on-card', 'Ada Lovelace');
    await setFieldValue(el, 'card-number', '4111 1111 1111 1111');
    await setFieldValue(el, 'expiration-date', '04/30');
    await setFieldValue(el, 'card-cvv', '123');
    await setFieldValue(el, 'billing-country', 'US');
    await setFieldValue(el, 'billing-address-line-1', '1 Main St');
    await setFieldValue(el, 'billing-address-line-2', 'Suite 100');
    await setFieldValue(el, 'billing-city', 'New York');
    await setFieldValue(el, 'billing-state', 'NY');
    await setFieldValue(el, 'billing-zip', '10001');

    await blurField(el, 'card-number');
    await waitForRequest(requests, '/customer/mask/card');
    await blurField(el, 'card-cvv');
    await waitForRequest(requests, '/customer/mask/cvv');
    await clickAction(el, 'save-card');
    await waitFor(
      () =>
        el.interactionResponse?.selectedSource?.id === 'card-created-1' &&
        Boolean(el.shadowRoot!.querySelector('.payment-method-title')),
      'new card was not attached and displayed'
    );

    assert.deepEqual(
      requests.map(
        (request) => `${request.method} ${new URL(request.url).pathname}`
      ),
      [
        'GET /customer',
        'POST /customer/mask/card',
        'POST /customer/mask/cvv',
        'POST /customer/billing-address',
        'POST /customer/source',
        'POST /interaction/payment-source/card-created-1/attach',
        'GET /customer',
      ]
    );
    assert.equal(
      requests[0].headers.get('x-interaction-id'),
      'interaction-payment'
    );
    assert.deepEqual(JSON.parse(requests[1].bodyText), {
      value: '4111111111111111',
    });
    assert.deepEqual(JSON.parse(requests[2].bodyText), {value: '123'});

    const addressBody = JSON.parse(requests[3].bodyText);
    assert.match(addressBody.id, /^billing-address-/);
    assert.deepEqual(addressBody, {
      id: addressBody.id,
      recipientNameOrAddress: 'Ada Lovelace',
      country: 'US',
      street: '1 Main St',
      houseNumberOrName: 'Suite 100',
      city: 'New York',
      stateOrProvince: 'NY',
      postalCode: '10001',
    });

    const sourceBody = JSON.parse(requests[4].bodyText);
    assert.equal(sourceBody.id, '');
    assert.equal(sourceBody.tenderType, 'CARD');
    assert.equal(sourceBody.name, 'Ada corporate card');
    assert.equal(sourceBody.billingAddressId, addressBody.id);
    assert.deepInclude(sourceBody.card, {
      nameOnCard: 'Ada Lovelace',
      cardNumber: 'enc-card-1',
      cardNumberEncrypted: 'enc-card-1',
      cvv: 'enc-cvv-1',
      cvvEncrypted: 'enc-cvv-1',
      expirationMonth: '04',
      expirationYear: '2030',
      network: 'Visa',
    });
    assert.equal(el.interactionResponse?.selectedSource?.id, 'card-created-1');
    assert.equal(
      el
        .shadowRoot!.querySelector('.payment-method-title')
        ?.textContent?.trim(),
      'Visa •••• 1111'
    );
  });

  test('uses an existing billing address when one is selected', async () => {
    const requests: CapturedRequest[] = [];
    const apiResponse: InteractionResponse = {
      interactionId: 'interaction-payment',
      status: 'PAYMENT_SOURCE_REQUESTED',
      paymentSources: [],
    };

    window.fetch = async (input: RequestInfo | URL) => {
      const request = input instanceof Request ? input : new Request(input);
      requests.push({
        url: request.url,
        method: request.method,
        headers: new Headers(request.headers),
        bodyText: await request.clone().text(),
        credentials: request.credentials,
      });

      if (request.url.endsWith('/customer')) {
        return new Response(
          JSON.stringify({
            billingAddress: [
              {
                id: 'billing-1',
                recipientNameOrAddress: 'Ada Lovelace',
                street: '1 Main St',
                city: 'New York',
                stateOrProvince: 'NY',
                postalCode: '10001',
                country: 'US',
              },
            ],
          }),
          {
            status: 200,
            headers: {'Content-Type': 'application/json'},
          }
        );
      }

      if (request.url.endsWith('/customer/mask/card')) {
        return new Response(JSON.stringify({value: 'enc-card-1'}), {
          status: 200,
          headers: {'Content-Type': 'application/json'},
        });
      }

      if (request.url.endsWith('/customer/mask/cvv')) {
        return new Response(JSON.stringify({value: 'enc-cvv-1'}), {
          status: 200,
          headers: {'Content-Type': 'application/json'},
        });
      }

      if (request.url.endsWith('/customer/source')) {
        return new Response(JSON.stringify({paymentSourceId: 'card-created-1'}), {
          status: 200,
          headers: {'Content-Type': 'application/json'},
        });
      }

      if (
        request.url.endsWith(
          '/interaction/payment-source/card-created-1/attach'
        )
      ) {
        return new Response(JSON.stringify(apiResponse), {
          status: 200,
          headers: {'Content-Type': 'application/json'},
        });
      }

      return new Response('{}', {
        status: 200,
        headers: {'Content-Type': 'application/json'},
      });
    };

    const el = await renderConnect({
      interactionId: 'interaction-payment',
      status: 'PAYMENT_SOURCE_REQUESTED',
      paymentSources: [],
    });

    await clickAction(el, 'add-card');
    await waitFor(() =>
      Boolean(el.shadowRoot!.querySelector('#billing-address'))
    );

    assert.deepEqual(
      [
        ...el.shadowRoot!.querySelectorAll<HTMLOptionElement>(
          '#billing-address option'
        ),
      ].map((option) => option.textContent?.trim()),
      ['1 Main St, New York, NY 10001', 'Add new billing address']
    );

    await setFieldValue(el, 'card-label', 'Ada corporate card');
    await setFieldValue(el, 'name-on-card', 'Ada Lovelace');
    await setFieldValue(el, 'card-number', '4111 1111 1111 1111');
    await setFieldValue(el, 'expiration-date', '04/30');
    await setFieldValue(el, 'card-cvv', '123');
    await setSelectValue(el, 'billing-address', 'billing-1');
    await blurField(el, 'card-number');
    await waitForRequest(requests, '/customer/mask/card');
    await blurField(el, 'card-cvv');
    await waitForRequest(requests, '/customer/mask/cvv');
    await clickAction(el, 'save-card');
    await waitFor(
      () => el.interactionResponse?.selectedSource?.id === 'card-created-1',
      'existing-address card was not attached'
    );

    assert.notInclude(
      requests.map((request) => new URL(request.url).pathname),
      '/customer/billing-address'
    );

    const sourceRequest = requests.find(
      (request) => new URL(request.url).pathname === '/customer/source'
    )!;
    const sourceBody = JSON.parse(sourceRequest.bodyText);

    assert.equal(sourceBody.billingAddressId, 'billing-1');
  });

  test('blocks card save until blur encryption succeeds', async () => {
    const requests: CapturedRequest[] = [];

    window.fetch = async (input: RequestInfo | URL) => {
      const request = input instanceof Request ? input : new Request(input);
      requests.push({
        url: request.url,
        method: request.method,
        headers: new Headers(request.headers),
        bodyText: await request.clone().text(),
        credentials: request.credentials,
      });

      if (request.url.endsWith('/customer')) {
        return new Response(JSON.stringify({billingAddress: []}), {
          status: 200,
          headers: {'Content-Type': 'application/json'},
        });
      }

      if (request.url.endsWith('/customer/mask/card')) {
        return new Response(JSON.stringify({message: 'Mask failed'}), {
          status: 500,
          headers: {'Content-Type': 'application/json'},
        });
      }

      return new Response(JSON.stringify({value: 'enc-cvv-1'}), {
        status: 200,
        headers: {'Content-Type': 'application/json'},
      });
    };

    const el = await renderConnect({
      interactionId: 'interaction-payment',
      status: 'PAYMENT_SOURCE_REQUESTED',
      paymentSources: [],
    });

    await clickAction(el, 'add-card');
    await waitForRequest(requests, '/customer', 'GET');
    await setFieldValue(el, 'card-label', 'Ada corporate card');
    await setFieldValue(el, 'name-on-card', 'Ada Lovelace');
    await setFieldValue(el, 'card-number', '4111 1111 1111 1111');
    await setFieldValue(el, 'expiration-date', '04/30');
    await setFieldValue(el, 'card-cvv', '123');
    await setFieldValue(el, 'billing-country', 'US');
    await setFieldValue(el, 'billing-address-line-1', '1 Main St');
    await setFieldValue(el, 'billing-city', 'New York');
    await setFieldValue(el, 'billing-state', 'NY');
    await setFieldValue(el, 'billing-zip', '10001');
    await blurField(el, 'card-number');
    await blurField(el, 'card-cvv');
    await clickAction(el, 'save-card');

    assert.include(
      el.shadowRoot!.textContent,
      'Unable to encrypt the card number. Try again.'
    );
    assert.deepEqual(
      requests.map(
        (request) => `${request.method} ${new URL(request.url).pathname}`
      ),
      ['GET /customer', 'POST /customer/mask/card', 'POST /customer/mask/cvv']
    );
  });

  test('verify code posts OTP, email, channel, and x-interaction-id to the default API', async () => {
    const requests: CapturedRequest[] = [];
    const apiResponse: InteractionResponse = {
      interactionId: 'interaction-otp',
      status: 'PAYMENT_SOURCE_REQUESTED',
      paymentSources: [],
    };

    window.fetch = async (input: RequestInfo | URL) => {
      const request = input instanceof Request ? input : new Request(input);
      requests.push({
        url: request.url,
        method: request.method,
        headers: new Headers(request.headers),
        bodyText: await request.clone().text(),
        credentials: request.credentials,
      });

      return new Response(JSON.stringify(apiResponse), {
        status: 200,
        headers: {'Content-Type': 'application/json'},
      });
    };

    const el = await renderConnect({
      interactionId: 'interaction-otp',
      status: 'OTP_VALIDATION_PENDING',
      email: 'gregory.jablonski@fiserv.com',
    });

    await setOtpValue(el, '123456');
    await clickAction(el, 'verify-otp');

    assert.lengthOf(requests, 1);
    assert.equal(
      requests[0].url,
      `${DEFAULT_COMMERCE_HUB_BASE_URL}/interaction/otp/validate`
    );
    assert.equal(requests[0].method, 'POST');
    assert.equal(
      requests[0].headers.get('x-interaction-id'),
      'interaction-otp'
    );
    assert.deepEqual(JSON.parse(requests[0].bodyText), {
      otp: '123456',
      email: 'gregory.jablonski@fiserv.com',
      channel: 'EMAIL',
    });
    assert.deepEqual(el.interactionResponse, apiResponse);
    assert.equal(
      el.shadowRoot!.querySelector('.widget-title')?.textContent?.trim(),
      'Add payment method'
    );
  });

  test('resend code posts to email OTP endpoint with x-interaction-id', async () => {
    const requests: CapturedRequest[] = [];

    window.fetch = async (input: RequestInfo | URL) => {
      const request = input instanceof Request ? input : new Request(input);
      requests.push({
        url: request.url,
        method: request.method,
        headers: new Headers(request.headers),
        bodyText: await request.clone().text(),
        credentials: request.credentials,
      });

      return new Response(
        JSON.stringify({
          interactionId: 'interaction-otp',
          status: 'OTP_VALIDATION_PENDING',
          email: 'gregory.jablonski@fiserv.com',
        }),
        {
          status: 200,
          headers: {'Content-Type': 'application/json'},
        }
      );
    };

    const el = await renderConnect({
      interactionId: 'interaction-otp',
      status: 'OTP_VALIDATION_PENDING',
      email: 'gregory.jablonski@fiserv.com',
    });

    await clickAction(el, 'resend-otp');

    assert.lengthOf(requests, 1);
    assert.equal(
      requests[0].url,
      `${DEFAULT_COMMERCE_HUB_BASE_URL}/interaction/otp/send/email`
    );
    assert.equal(requests[0].method, 'POST');
    assert.equal(
      requests[0].headers.get('x-interaction-id'),
      'interaction-otp'
    );
    assert.equal(requests[0].bodyText, '');
  });

  test('continue with selected method emits onSuccess with selected source without calling attach', async () => {
    const requests: CapturedRequest[] = [];
    const selectedSource: PaymentSource = {
      tenderType: 'Card',
      id: 'card-1',
      name: 'Corporate card',
    };

    window.fetch = async (input: RequestInfo | URL) => {
      const request = input instanceof Request ? input : new Request(input);
      requests.push({
        url: request.url,
        method: request.method,
        headers: new Headers(request.headers),
        bodyText: await request.clone().text(),
        credentials: request.credentials,
      });

      return new Response(JSON.stringify({}), {
        status: 200,
        headers: {'Content-Type': 'application/json'},
      });
    };

    const el = await renderConnect({
      interactionId: 'interaction-payment',
      status: 'PAYMENT_SOURCE_REQUESTED',
      selectedSource,
      paymentSources: [selectedSource],
    });
    const {successEvents, errorEvents} = recordOutputEvents(el);

    await clickAction(el, 'confirm-payment-source');

    assert.lengthOf(requests, 0);
    assert.lengthOf(successEvents, 1);
    assert.deepEqual(successEvents[0].detail, selectedSource);
    assert.lengthOf(errorEvents, 0);
  });

  test('missing interactionId does not emit onError and keeps the current screen stable', async () => {
    let calls = 0;

    window.fetch = async () => {
      calls += 1;
      return new Response('{}', {status: 200});
    };

    const el = await renderConnect({
      status: 'OTP_VALIDATION_PENDING',
      email: 'gregory.jablonski@fiserv.com',
    });
    const {successEvents, errorEvents} = recordOutputEvents(el);

    await setOtpValue(el, '123456');
    await clickAction(el, 'verify-otp');

    assert.equal(calls, 0);
    assert.lengthOf(successEvents, 0);
    assert.lengthOf(errorEvents, 0);
    assert.equal(
      el.shadowRoot!.querySelector('.widget-title')?.textContent?.trim(),
      'Enter the code'
    );
  });

  test('OTP API error transitions to the visible OTP error state', async () => {
    window.fetch = async () =>
      new Response(JSON.stringify({message: 'Invalid code'}), {
        status: 400,
        headers: {'Content-Type': 'application/json'},
      });

    const el = await renderConnect({
      interactionId: 'interaction-otp',
      status: 'OTP_VALIDATION_PENDING',
      email: 'gregory.jablonski@fiserv.com',
    });
    const {successEvents, errorEvents} = recordOutputEvents(el);

    await setOtpValue(el, '123456');
    await clickAction(el, 'verify-otp');

    assert.equal(el.interactionResponse?.status, 'OTP_VALIDATION_FAILED');
    assert.lengthOf(successEvents, 0);
    assert.lengthOf(errorEvents, 0);
    assert.exists(el.shadowRoot!.querySelector('[role="alert"]'));
    assert.equal(
      el
        .shadowRoot!.querySelector('[data-action="verify-otp"]')
        ?.textContent?.trim(),
      'Try again'
    );
  });

  test('add bank account initializes PaymentSDK with mapped Pay by Bank session fields', async () => {
    const requests: CapturedRequest[] = [];
    let initConfig: TestPaymentSdkInitConfiguration | undefined;
    let providerContainer: HTMLElement | null = null;

    paymentSdkWindow.PaymentSDK = {
      init: (configuration) => {
        initConfig = configuration;
        providerContainer = document.getElementById(configuration.containerId);

        if (!providerContainer) {
          throw new Error(
            `PaymentSDK: Container element not found: ${configuration.containerId}`
          );
        }
      },
      destroy: () => undefined,
    };

    window.fetch = async (input: RequestInfo | URL) => {
      const request = input instanceof Request ? input : new Request(input);
      requests.push({
        url: request.url,
        method: request.method,
        headers: new Headers(request.headers),
        bodyText: await request.clone().text(),
        credentials: request.credentials,
      });

      if (request.url.endsWith('/customer')) {
        return new Response(
          JSON.stringify({
            sources: [
              {
                tenderType: 'BankAccount',
                id: 'bank-existing',
              },
            ],
          }),
          {status: 200, headers: {'Content-Type': 'application/json'}}
        );
      }

      return new Response(
        JSON.stringify({
          aggregatorSessionId: 'agg-session-1',
          tokenID: 'access-token-1',
          pToken: 'p-token-1',
          publicKey: 'public-key-1',
        }),
        {status: 200, headers: {'Content-Type': 'application/json'}}
      );
    };

    const el = await renderConnect(
      {
        interactionId: 'interaction-payment',
        status: 'PAYMENT_SOURCE_REQUESTED',
        paymentSources: [],
      },
      {
        payByBank: {
          apiKey: 'override-api-key',
          configId: 'override-config-id',
          environment: 'sandbox',
          locale: 'en-CA',
        },
      }
    );

    await clickAction(el, 'add-bank-account');
    await waitFor(() => Boolean(initConfig), 'PaymentSDK.init was not called');

    assert.equal(
      el.shadowRoot!.querySelector('.widget-title')?.textContent?.trim(),
      'Add bank account'
    );
    assert.notExists(el.shadowRoot!.querySelector('.widget-subtitle'));
    assert.notExists(el.shadowRoot!.querySelector('.provider-frame-header'));
    assert.exists(el.shadowRoot!.querySelector('#commerce-hub-pbb-provider'));
    assert.exists(
      el.shadowRoot!.querySelector('[data-action="back-to-payment-methods"]')
    );
    assert.equal(initConfig?.apiKey, 'override-api-key');
    assert.equal(initConfig?.configId, 'override-config-id');
    assert.equal(initConfig?.accessToken, 'access-token-1');
    assert.equal(initConfig?.aggregatorSessionId, 'agg-session-1');
    assert.equal(initConfig?.pToken, 'p-token-1');
    assert.equal(initConfig?.publicKey, 'public-key-1');
    assert.equal(initConfig?.environment, 'sandbox');
    assert.equal(initConfig?.locale, 'en-CA');
    assert.equal(initConfig?.containerId, 'commerce-hub-pbb-provider');
    assert.exists(providerContainer);
    assert.deepEqual(
      requests.map(
        (request) => `${request.method} ${new URL(request.url).pathname}`
      ),
      ['GET /customer', 'GET /pbb/session']
    );
    assert.equal(
      requests[1].headers.get('x-interaction-id'),
      'interaction-payment'
    );
    assert.equal(requests[1].credentials, 'include');
  });

  test('Pay by Bank success finalizes without attaching the new bank source and renders verified outcome without events', async () => {
    const requests: CapturedRequest[] = [];
    let initConfig: TestPaymentSdkInitConfiguration | undefined;

    paymentSdkWindow.PaymentSDK = {
      init: (configuration) => {
        initConfig = configuration;
      },
      destroy: () => undefined,
    };

    window.fetch = async (input: RequestInfo | URL) => {
      const request = input instanceof Request ? input : new Request(input);
      requests.push({
        url: request.url,
        method: request.method,
        headers: new Headers(request.headers),
        bodyText: await request.clone().text(),
        credentials: request.credentials,
      });

      const pathname = new URL(request.url).pathname;

      if (
        pathname === '/customer' &&
        requests.filter((item) => new URL(item.url).pathname === '/customer')
          .length === 1
      ) {
        return new Response(
          JSON.stringify({
            sources: [{tenderType: 'BankAccount', id: 'bank-existing'}],
          }),
          {status: 200, headers: {'Content-Type': 'application/json'}}
        );
      }

      if (pathname === '/pbb/session') {
        return new Response(
          JSON.stringify({
            aggregatorSessionId: 'agg-session-1',
            tokenID: 'access-token-1',
            pToken: 'p-token-1',
            publicKey: 'public-key-1',
          }),
          {status: 200, headers: {'Content-Type': 'application/json'}}
        );
      }

      if (pathname === '/pbb/session/agg-session-1/p-token-1') {
        return new Response('{}', {
          status: 200,
          headers: {'Content-Type': 'application/json'},
        });
      }

      if (pathname === '/customer') {
        return new Response(
          JSON.stringify({
            sources: [
              {tenderType: 'BankAccount', id: 'bank-existing'},
              {
                tenderType: 'BankAccount',
                id: 'bank-new',
                name: 'Operating account',
                verificationInfo: {status: 'VERIFIED'},
                bankAccount: {
                  bankName: 'Commerce National Bank',
                  accountNumber: '9876543210',
                },
              },
            ],
          }),
          {status: 200, headers: {'Content-Type': 'application/json'}}
        );
      }

      return new Response(
        JSON.stringify({
          interactionId: 'interaction-payment',
          status: 'PAYMENT_SOURCE_ATTACHED',
          selectedSource: {
            tenderType: 'BankAccount',
            id: 'bank-new',
            name: 'Operating account',
          },
          paymentSources: [],
        }),
        {status: 200, headers: {'Content-Type': 'application/json'}}
      );
    };

    const el = await renderConnect({
      interactionId: 'interaction-payment',
      status: 'PAYMENT_SOURCE_REQUESTED',
      paymentSources: [],
    });
    const {successEvents, errorEvents} = recordOutputEvents(el);

    await clickAction(el, 'add-bank-account');
    await waitFor(() => Boolean(initConfig), 'PaymentSDK.init was not called');
    await initConfig!.onEvent({type: 'success'});
    await flushElement(el);

    assert.deepEqual(
      requests.map(
        (request) => `${request.method} ${new URL(request.url).pathname}`
      ),
      [
        'GET /customer',
        'GET /pbb/session',
        'PUT /pbb/session/agg-session-1/p-token-1',
        'GET /customer',
      ]
    );
    assert.equal(
      el.shadowRoot!.querySelector('.widget-title')?.textContent?.trim(),
      'Bank account verified'
    );
    assert.equal(
      el
        .shadowRoot!.querySelector('.verification-detail-value')
        ?.textContent?.trim(),
      'Commerce National Bank'
    );
    assert.equal(el.interactionResponse?.paymentSources?.[0]?.id, 'bank-new');
    assert.equal(el.interactionResponse?.selectedSource?.id, 'bank-new');
    assert.equal(el.interactionResponse?.status, 'PAYMENT_SOURCE_REQUESTED');
    assert.lengthOf(successEvents, 0);
    assert.lengthOf(errorEvents, 0);
  });

  test('Pay by Bank terminal failure events render the provider unavailable screen', async () => {
    for (const terminalType of ['failure', 'cancel', 'error']) {
      let initConfig: TestPaymentSdkInitConfiguration | undefined;

      paymentSdkWindow.PaymentSDK = {
        init: (configuration) => {
          initConfig = configuration;
        },
        destroy: () => undefined,
      };

      window.fetch = async (input: RequestInfo | URL) => {
        const request = input instanceof Request ? input : new Request(input);

        if (request.url.endsWith('/customer')) {
          return new Response(JSON.stringify({sources: []}), {
            status: 200,
            headers: {'Content-Type': 'application/json'},
          });
        }

        return new Response(
          JSON.stringify({
            aggregatorSessionId: 'agg-session-1',
            tokenID: 'access-token-1',
            pToken: 'p-token-1',
            publicKey: 'public-key-1',
          }),
          {status: 200, headers: {'Content-Type': 'application/json'}}
        );
      };

      const el = await renderConnect({
        interactionId: `interaction-${terminalType}`,
        status: 'PAYMENT_SOURCE_REQUESTED',
        paymentSources: [],
      });

      await clickAction(el, 'add-bank-account');
      await waitFor(
        () => Boolean(initConfig),
        'PaymentSDK.init was not called'
      );
      await initConfig!.onEvent({type: terminalType});
      await flushElement(el);

      assert.equal(
        el.shadowRoot!.querySelector('.widget-title')?.textContent?.trim(),
        'Bank connection unavailable',
        terminalType
      );
      assert.exists(
        el.shadowRoot!.querySelector('[data-action="retry-bank-provider"]')
      );
      assert.exists(
        el.shadowRoot!.querySelector('[data-action="back-to-payment-methods"]')
      );
    }
  });

  test('Pay by Bank script load failure and incomplete session render provider unavailable', async () => {
    paymentSdkWindow.PaymentSDK = undefined;
    window.fetch = async () =>
      new Response(
        JSON.stringify({
          aggregatorSessionId: 'agg-session-1',
          tokenID: 'access-token-1',
          pToken: 'p-token-1',
          publicKey: 'public-key-1',
        }),
        {status: 200, headers: {'Content-Type': 'application/json'}}
      );

    const scriptFailureEl = await renderConnect(
      {
        interactionId: 'interaction-payment',
        status: 'PAYMENT_SOURCE_REQUESTED',
        paymentSources: [],
      },
      {payByBank: {paymentSdkUrl: 'https://example.test/PaymentSDK.js'}}
    );

    await clickAction(scriptFailureEl, 'add-bank-account');
    const script = document.querySelector<HTMLScriptElement>(
      'script[data-commerce-hub-pay-by-bank-sdk="true"]'
    );
    assert.exists(script);
    script!.dispatchEvent(new Event('error'));
    await flushElement(scriptFailureEl);

    assert.equal(
      scriptFailureEl
        .shadowRoot!.querySelector('.widget-title')
        ?.textContent?.trim(),
      'Bank connection unavailable'
    );

    paymentSdkWindow.PaymentSDK = {
      init: () => undefined,
      destroy: () => undefined,
    };
    window.fetch = async () =>
      new Response(JSON.stringify({aggregatorSessionId: 'agg-session-1'}), {
        status: 200,
        headers: {'Content-Type': 'application/json'},
      });

    const incompleteSessionEl = await renderConnect({
      interactionId: 'interaction-payment',
      status: 'PAYMENT_SOURCE_REQUESTED',
      paymentSources: [],
    });

    await clickAction(incompleteSessionEl, 'add-bank-account');
    await flushElement(incompleteSessionEl);

    assert.equal(
      incompleteSessionEl
        .shadowRoot!.querySelector('.widget-title')
        ?.textContent?.trim(),
      'Bank connection unavailable'
    );
  });

  test('Pay by Bank retry reinitializes the provider and Back returns to payment methods', async () => {
    let initConfig: TestPaymentSdkInitConfiguration | undefined;
    let initCount = 0;
    let destroyCount = 0;

    paymentSdkWindow.PaymentSDK = {
      init: (configuration) => {
        initConfig = configuration;
        initCount += 1;
      },
      destroy: () => {
        destroyCount += 1;
      },
    };

    window.fetch = async (input: RequestInfo | URL) => {
      const request = input instanceof Request ? input : new Request(input);

      if (request.url.endsWith('/customer')) {
        return new Response(JSON.stringify({sources: []}), {
          status: 200,
          headers: {'Content-Type': 'application/json'},
        });
      }

      return new Response(
        JSON.stringify({
          aggregatorSessionId: 'agg-session-1',
          tokenID: 'access-token-1',
          pToken: 'p-token-1',
          publicKey: 'public-key-1',
        }),
        {status: 200, headers: {'Content-Type': 'application/json'}}
      );
    };

    const el = await renderConnect({
      interactionId: 'interaction-payment',
      status: 'PAYMENT_SOURCE_REQUESTED',
      paymentSources: [],
    });

    await clickAction(el, 'add-bank-account');
    await waitFor(() => initCount === 1, 'PaymentSDK.init was not called');
    await initConfig!.onEvent({type: 'failure'});
    await flushElement(el);

    await clickAction(el, 'retry-bank-provider');
    await waitFor(
      () => initCount === 2,
      'PaymentSDK.init was not called again'
    );

    assert.isAtLeast(destroyCount, 2);

    await initConfig!.onEvent({type: 'cancel'});
    await flushElement(el);
    await clickAction(el, 'back-to-payment-methods');

    assert.equal(
      el.shadowRoot!.querySelector('.widget-title')?.textContent?.trim(),
      'Add payment method'
    );
  });
});
