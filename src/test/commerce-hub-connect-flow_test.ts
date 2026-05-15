import {fixture, assert, html as testingHtml} from '@open-wc/testing';

import '../commerce-hub-connect.js';
import {
  DEFAULT_COMMERCE_HUB_BASE_URL,
  type InteractionResponse,
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

const recordOutputEvents = (el: Element) => {
  const successEvents: CustomEvent<InteractionResponse>[] = [];
  const errorEvents: CustomEvent<unknown>[] = [];

  el.addEventListener('onSuccess', (event) => {
    successEvents.push(event as CustomEvent<InteractionResponse>);
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

  test('renders OTP pending as six inputs with resend copy and Verify code CTA', async () => {
    const el = await renderConnect({
      interactionId: 'interaction-otp',
      status: 'OTP_VALIDATION_PENDING',
      email: 'wallet@example.com',
    });

    assert.equal(
      el.shadowRoot!.querySelector('.widget-title')?.textContent?.trim(),
      'Verify your email'
    );
    assert.include(
      el.shadowRoot!.querySelector('.widget-subtitle')?.textContent?.trim(),
      'wallet@example.com'
    );
    assert.lengthOf(el.shadowRoot!.querySelectorAll('.otp-input'), 6);
    assert.equal(
      el
        .shadowRoot!.querySelector('[data-action="resend-otp"]')
        ?.textContent?.trim(),
      'Resend code in 30s'
    );
    assert.equal(
      el
        .shadowRoot!.querySelector('[data-action="verify-otp"]')
        ?.textContent?.trim(),
      'Verify code'
    );
  });

  test('renders OTP copy from partial designConfig overrides', async () => {
    const el = await renderConnect(
      {
        interactionId: 'interaction-otp',
        status: 'OTP_VALIDATION_PENDING',
        email: 'wallet@example.com',
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
      email: 'wallet@example.com',
    });

    await setOtpValue(el, '987654');
    el.interactionResponse = {
      interactionId: 'interaction-otp',
      status: 'OTP_VALIDATION_FAILED',
      email: 'wallet@example.com',
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

  test('renders payment methods with selectable rows, source actions, and Continue CTA', async () => {
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
    assert.equal(rows[0].getAttribute('aria-checked'), 'true');

    rows[1].click();
    await flushElement(el);

    assert.equal(rows[0].getAttribute('aria-checked'), 'false');
    assert.equal(rows[1].getAttribute('aria-checked'), 'true');
    assert.exists(
      el.shadowRoot!.querySelector('[data-action="add-bank-account"]')
    );
    assert.exists(el.shadowRoot!.querySelector('[data-action="add-card"]'));
    assert.equal(
      el
        .shadowRoot!.querySelector('[data-action="attach-payment-source"]')
        ?.textContent?.trim(),
      'Continue'
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
      [...el.shadowRoot!.querySelectorAll('.source-action-title')].map((item) =>
        item.textContent?.trim()
      ),
      ['Use bank account', 'Use card']
    );
    assert.deepEqual(
      [...el.shadowRoot!.querySelectorAll('.source-action-subtitle')].map(
        (item) => item.textContent?.trim()
      ),
      ['Connect checking or savings', 'Add debit or credit card']
    );
    assert.equal(
      el
        .shadowRoot!.querySelector('[data-action="attach-payment-source"]')
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
      el.shadowRoot!.querySelector('.empty-state-title')?.textContent?.trim(),
      'No saved payment methods'
    );
    assert.exists(
      el.shadowRoot!.querySelector('[data-action="add-bank-account"]')
    );
    assert.exists(el.shadowRoot!.querySelector('[data-action="add-card"]'));
    assert.notExists(
      el.shadowRoot!.querySelector('[data-action="attach-payment-source"]')
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
            addCardTitle: 'Add card',
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
      [...el.shadowRoot!.querySelectorAll('.source-action-title')].map((item) =>
        item.textContent?.trim()
      ),
      ['Connect bank', 'Add card']
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
      email: 'wallet@example.com',
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
      email: 'wallet@example.com',
      channel: 'EMAIL',
    });
    assert.deepEqual(el.interactionResponse, apiResponse);
    assert.equal(
      el.shadowRoot!.querySelector('.empty-state-title')?.textContent?.trim(),
      'No saved payment methods'
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
          email: 'wallet@example.com',
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
      email: 'wallet@example.com',
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

  test('continue with selected method attaches source without emitting onSuccess', async () => {
    const requests: CapturedRequest[] = [];
    const apiResponse: InteractionResponse = {
      interactionId: 'interaction-payment',
      status: 'PAYMENT_SOURCE_ATTACHED',
      selectedSource: {
        tenderType: 'Card',
        id: 'card-1',
        name: 'Corporate card',
      },
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
    });
    const {successEvents, errorEvents} = recordOutputEvents(el);

    await clickAction(el, 'attach-payment-source');

    assert.lengthOf(requests, 1);
    assert.equal(
      requests[0].url,
      `${DEFAULT_COMMERCE_HUB_BASE_URL}/interaction/payment-source/card-1/attach`
    );
    assert.equal(requests[0].method, 'POST');
    assert.equal(
      requests[0].headers.get('x-interaction-id'),
      'interaction-payment'
    );
    assert.deepEqual(el.interactionResponse, apiResponse);
    assert.lengthOf(successEvents, 0);
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
      email: 'wallet@example.com',
    });
    const {successEvents, errorEvents} = recordOutputEvents(el);

    await setOtpValue(el, '123456');
    await clickAction(el, 'verify-otp');

    assert.equal(calls, 0);
    assert.lengthOf(successEvents, 0);
    assert.lengthOf(errorEvents, 0);
    assert.equal(
      el.shadowRoot!.querySelector('.widget-title')?.textContent?.trim(),
      'Verify your email'
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
      email: 'wallet@example.com',
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
    assert.exists(el.shadowRoot!.querySelector('#commerce-hub-pbb-provider'));
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
      'Payment methods'
    );
  });
});
