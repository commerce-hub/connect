import {fixture, assert, html as testingHtml} from '@open-wc/testing';

import '../commerce-hub-connect.js';
import type {
  CommerceHubConnect,
  CommerceHubBaseURLInput,
  InteractionResponse,
  PaymentSource,
} from '../commerce-hub-connect.js';

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

const createDeferred = <T>() => {
  let resolve!: (value: T) => void;
  let reject!: (reason?: unknown) => void;
  const promise = new Promise<T>((resolvePromise, rejectPromise) => {
    resolve = resolvePromise;
    reject = rejectPromise;
  });

  return {promise, resolve, reject};
};

const captureDeleteConfirmationTimer = () => {
  const originalSetTimeout = window.setTimeout;
  const originalClearTimeout = window.clearTimeout;
  let capturedDelay: number | undefined;
  let capturedHandler: (() => void) | undefined;

  window.setTimeout = ((handler: TimerHandler, timeout?: number) => {
    capturedDelay = Number(timeout);
    capturedHandler = () => {
      if (typeof handler === 'function') {
        handler();
      }
    };

    return 1;
  }) as typeof window.setTimeout;
  window.clearTimeout = (() => undefined) as typeof window.clearTimeout;

  return {
    get delay() {
      return capturedDelay;
    },
    release() {
      capturedHandler?.();
    },
    restore() {
      window.setTimeout = originalSetTimeout;
      window.clearTimeout = originalClearTimeout;
    },
  };
};

const flushElement = async (el: CommerceHubConnect) => {
  await el.updateComplete;
  await nextFrame();
  await el.updateComplete;
};

const TEST_COMMERCE_HUB_BASE_URL = 'http://commercehub.test';

const renderConnect = async (
  interactionResponse: InteractionResponse,
  baseURL: CommerceHubBaseURLInput = TEST_COMMERCE_HUB_BASE_URL
) => {
  const el = (await fixture(
    testingHtml`<commerce-hub-connect
      .interactionResponse=${interactionResponse}
      .baseURL=${baseURL}
    ></commerce-hub-connect>`
  )) as CommerceHubConnect;

  await flushElement(el);

  return el;
};

const clickAction = async (el: CommerceHubConnect, action: string) => {
  el.shadowRoot!.querySelector<HTMLButtonElement>(
    `[data-action="${action}"]`
  )!.click();
  await flushElement(el);
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

suite('commerce-hub-connect payment selection', () => {
  const originalFetch = window.fetch;
  const originalConfirm = window.confirm;

  teardown(() => {
    window.fetch = originalFetch;
    window.confirm = originalConfirm;
  });

  test('saved payment methods render without confirm button or radio controls', async () => {
    const el = await renderConnect({
      interactionId: 'interaction-payment',
      status: 'OTP_VALIDATION_SUCCESS',
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
      ...el.shadowRoot!.querySelectorAll<HTMLElement>('.payment-method-row'),
    ];

    assert.lengthOf(rows, 2);
    assert.notExists(
      el.shadowRoot!.querySelector('[data-action="confirm-payment-source"]')
    );
    assert.notExists(el.shadowRoot!.querySelector('.selected-payment-method'));
    assert.notExists(rows[0].querySelector('.payment-method-radio'));
    assert.notExists(rows[1].querySelector('.payment-method-radio'));
    assert.notEqual(rows[0].dataset.action, 'verify-payment-source');
    assert.equal(rows[1].dataset.action, undefined);
  });

  test('renders all saved payment methods while filtering add actions by allowed tender types', async () => {
    window.fetch = async () =>
      new Response(JSON.stringify({}), {
        status: 200,
        headers: {'Content-Type': 'application/json'},
      });

    const el = await renderConnect({
      interactionId: 'interaction-payment',
      status: 'PAYMENT_SOURCE_REQUESTED',
      allowedTenderTypes: [
        'BANK_ACCOUNT',
        'DYNAMIC_SESSION_CARD',
        'NATIVE_ACCOUNT',
      ],
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
        {
          tenderType: 'DSCDisplayCard',
          id: 'dynamic-card-1',
          name: 'Dynamic credit card',
          verificationInfo: {status: 'VERIFIED'},
        },
        {
          tenderType: 'NativeAccount',
          id: 'native-account-1',
          name: 'Digital wallet',
          verificationInfo: {status: 'VERIFIED'},
          account: {
            positionId: 'wallet-position-7890',
            nickName: 'Commerce wallet',
            productType: 'Wallet',
            token: 'native-token-1',
          },
        },
      ],
    });

    const rows = [
      ...el.shadowRoot!.querySelectorAll<HTMLElement>('.payment-method-row'),
    ];

    assert.deepEqual(
      rows.map((row) => row.dataset.paymentMethodId),
      ['card-1', 'bank-1', 'dynamic-card-1', 'native-account-1']
    );
    assert.equal(
      rows[1].querySelector('.payment-method-title')?.textContent?.trim(),
      'Operating account'
    );
    assert.equal(
      rows[3].querySelector('.payment-method-title')?.textContent?.trim(),
      'Commerce wallet'
    );
    assert.equal(
      rows[3].querySelector('.payment-method-meta')?.textContent?.trim(),
      'Wallet •••• 7890'
    );
    assert.exists(rows[3].querySelector('[data-payment-method-icon="native"]'));
    assert.notExists(el.shadowRoot!.querySelector('[data-action="add-card"]'));
    assert.exists(
      el.shadowRoot!.querySelector('[data-action="add-bank-account"]')
    );
    assert.notExists(
      el.shadowRoot!.querySelector('[data-action="add-ach-manually"]')
    );
  });

  test('fetches native account balances and renders them right aligned after row loading state', async () => {
    const requests: CapturedRequest[] = [];
    const balanceResponse = createDeferred<Response>();

    window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
      const request =
        input instanceof Request ? input : new Request(input, init);

      requests.push({
        url: request.url,
        method: request.method,
        headers: request.headers,
        bodyText: await request.clone().text(),
        credentials: request.credentials,
      });

      return balanceResponse.promise;
    };

    const el = await renderConnect({
      interactionId: 'interaction-payment',
      status: 'OTP_VALIDATION_SUCCESS',
      allowedTenderTypes: ['NATIVE_ACCOUNT'],
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
          tenderType: 'NativeAccount',
          id: 'native-account-1',
          verificationInfo: {status: 'VERIFIED'},
          account: {
            positionId: 'wallet-position-7890',
            nickName: 'Commerce wallet',
            productType: 'Wallet',
            token: 'native-token-1',
          },
        },
        {
          tenderType: 'NativeAccount',
          id: 'native-account-2',
          verificationInfo: {status: 'VERIFIED'},
          account: {
            positionId: 'wallet-position-4321',
            nickName: 'Rewards wallet',
            productType: 'Rewards',
            token: 'native-token-2',
          },
        },
      ],
    });

    await waitFor(
      () => requests.length === 1,
      'expected native balance request'
    );

    assert.include(requests[0].url, '/interaction/source/native/balances');
    assert.equal(requests[0].method, 'GET');
    assert.equal(
      requests[0].headers.get('x-interaction-id'),
      'interaction-payment'
    );

    assert.notExists(
      el
        .shadowRoot!.querySelector('[data-payment-method-id="card-1"]')
        ?.querySelector('.payment-method-balance-loading')
    );
    assert.exists(
      el
        .shadowRoot!.querySelector(
          '[data-payment-method-id="native-account-1"]'
        )
        ?.querySelector('.payment-method-balance-loading')
    );
    assert.exists(
      el
        .shadowRoot!.querySelector(
          '[data-payment-method-id="native-account-2"]'
        )
        ?.querySelector('.payment-method-balance-loading')
    );

    balanceResponse.resolve(
      new Response(
        JSON.stringify({
          'native-account-1': {
            balance: 125.5,
          },
          'wallet-position-4321': {
            balance: 9,
          },
        }),
        {
          status: 200,
          headers: {'Content-Type': 'application/json'},
        }
      )
    );

    await waitFor(
      () =>
        el
          .shadowRoot!.querySelector(
            '[data-payment-method-id="native-account-1"]'
          )
          ?.querySelector('.payment-method-balance')
          ?.textContent?.trim() === '$125.50',
      'expected native account balance to render'
    );

    assert.equal(
      el
        .shadowRoot!.querySelector(
          '[data-payment-method-id="native-account-2"]'
        )
        ?.querySelector('.payment-method-balance')
        ?.textContent?.trim(),
      '$9.00'
    );
    assert.equal(
      getComputedStyle(
        el
          .shadowRoot!.querySelector(
            '[data-payment-method-id="native-account-1"]'
          )!
          .querySelector<HTMLElement>('.payment-method-balance')!
      ).textAlign,
      'right'
    );
  });

  test('shows native account balance when selected payment method is displayed', async () => {
    const requests: CapturedRequest[] = [];
    const balanceResponse = createDeferred<Response>();
    const nativeSource: PaymentSource = {
      tenderType: 'NativeAccount',
      id: 'native-account-1',
      verificationInfo: {status: 'VERIFIED'},
      account: {
        positionId: 'wallet-position-7890',
        nickName: 'Commerce wallet',
        productType: 'Wallet',
        token: 'native-token-1',
      },
    };

    window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
      const request =
        input instanceof Request ? input : new Request(input, init);
      const pathname = new URL(request.url).pathname;

      requests.push({
        url: request.url,
        method: request.method,
        headers: request.headers,
        bodyText: await request.clone().text(),
        credentials: request.credentials,
      });

      if (pathname === '/interaction/source/native/balances') {
        return balanceResponse.promise;
      }

      if (pathname === '/interaction/source/native-account-1/attach') {
        return new Response(
          JSON.stringify({
            interactionId: 'interaction-payment',
            status: 'PAYMENT_SOURCE_ATTACHED',
            selectedSource: nativeSource,
            paymentSources: [nativeSource],
          }),
          {
            status: 200,
            headers: {'Content-Type': 'application/json'},
          }
        );
      }

      return new Response(JSON.stringify({}), {
        status: 200,
        headers: {'Content-Type': 'application/json'},
      });
    };

    const el = await renderConnect({
      interactionId: 'interaction-payment',
      status: 'OTP_VALIDATION_SUCCESS',
      allowedTenderTypes: ['NATIVE_ACCOUNT'],
      paymentSources: [nativeSource],
    });

    await waitFor(
      () =>
        requests.some(
          (request) =>
            request.method === 'GET' &&
            new URL(request.url).pathname ===
              '/interaction/source/native/balances'
        ),
      'expected native balance request'
    );

    el.shadowRoot!.querySelector<HTMLButtonElement>(
      '[data-payment-method-id="native-account-1"]'
    )!.click();
    await flushElement(el);

    assert.exists(el.shadowRoot!.querySelector('.selected-payment-method'));
    assert.exists(
      el.shadowRoot!.querySelector(
        '.selected-payment-method .payment-method-balance-loading'
      )
    );

    balanceResponse.resolve(
      new Response(
        JSON.stringify({
          'wallet-position-7890': {
            balance: 42.25,
          },
        }),
        {
          status: 200,
          headers: {'Content-Type': 'application/json'},
        }
      )
    );

    await waitFor(
      () =>
        el
          .shadowRoot!.querySelector(
            '.selected-payment-method .payment-method-balance'
          )
          ?.textContent?.trim() === '$42.25',
      'expected selected native account balance to render'
    );

    assert.lengthOf(
      requests.filter(
        (request) =>
          request.method === 'GET' &&
          new URL(request.url).pathname ===
            '/interaction/source/native/balances'
      ),
      1
    );
  });

  test('waits to fetch native account balances until payment source list is shown', async () => {
    const requests: CapturedRequest[] = [];

    window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
      const request =
        input instanceof Request ? input : new Request(input, init);

      requests.push({
        url: request.url,
        method: request.method,
        headers: request.headers,
        bodyText: await request.clone().text(),
        credentials: request.credentials,
      });

      return new Response(JSON.stringify({}), {
        status: 200,
        headers: {'Content-Type': 'application/json'},
      });
    };

    const nativeSource: PaymentSource = {
      tenderType: 'NativeAccount',
      id: 'native-account-1',
      verificationInfo: {status: 'VERIFIED'},
      account: {
        positionId: 'wallet-position-7890',
        nickName: 'Commerce wallet',
        productType: 'Wallet',
        token: 'native-token-1',
      },
    };

    const el = await renderConnect({
      interactionId: 'interaction-payment',
      status: 'PAYMENT_SOURCE_ATTACHED',
      selectedSource: nativeSource,
      paymentSources: [nativeSource],
    });

    await flushElement(el);

    assert.exists(el.shadowRoot!.querySelector('.selected-payment-method'));
    assert.lengthOf(requests, 0);

    el.interactionResponse = {
      interactionId: 'interaction-payment',
      status: 'PAYMENT_SOURCE_REQUESTED',
      allowedTenderTypes: ['NATIVE_ACCOUNT'],
      paymentSources: [nativeSource],
    };
    await flushElement(el);

    await waitFor(
      () => requests.length === 1,
      'expected native balance request after list was shown'
    );

    assert.include(requests[0].url, '/interaction/source/native/balances');
    assert.equal(requests[0].method, 'GET');
    assert.equal(
      requests[0].headers.get('x-interaction-id'),
      'interaction-payment'
    );
  });

  test('filters empty-state add actions by allowed tender types', async () => {
    const el = await renderConnect({
      interactionId: 'interaction-payment',
      status: 'PAYMENT_SOURCE_REQUESTED',
      allowedTenderTypes: ['CARD'],
      paymentSources: [],
    });

    assert.equal(
      el.shadowRoot!.querySelector('.widget-title')?.textContent?.trim(),
      'Add payment method'
    );
    assert.exists(el.shadowRoot!.querySelector('[data-action="add-card"]'));
    assert.notExists(
      el.shadowRoot!.querySelector('[data-action="add-bank-account"]')
    );
    assert.notExists(
      el.shadowRoot!.querySelector('[data-action="add-ach-manually"]')
    );
  });

  test('Edit toggles payment source edit mode and hides add actions', async () => {
    const el = await renderConnect({
      interactionId: 'interaction-payment',
      status: 'PAYMENT_SOURCE_REQUESTED',
      paymentSources: [
        {
          tenderType: 'Card',
          id: 'card-1',
          name: 'Corporate card',
          verificationInfo: {status: 'VERIFIED'},
          card: {
            network: 'Visa',
            cardNumber: '4111111111111111',
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

    const editButton = () =>
      el.shadowRoot!.querySelector<HTMLButtonElement>(
        '[data-action="toggle-payment-source-edit-mode"]'
      );

    assert.equal(editButton()?.textContent?.trim(), 'Edit');
    assert.exists(el.shadowRoot!.querySelector('[data-action="add-card"]'));
    assert.exists(
      el.shadowRoot!.querySelector('[data-action="add-bank-account"]')
    );

    await clickAction(el, 'toggle-payment-source-edit-mode');

    assert.equal(editButton()?.textContent?.trim(), 'Done');
    assert.notExists(el.shadowRoot!.querySelector('[data-action="add-card"]'));
    assert.notExists(
      el.shadowRoot!.querySelector('[data-action="add-bank-account"]')
    );
    assert.notExists(
      el.shadowRoot!.querySelector('[data-action="attach-payment-source"]')
    );
    assert.notExists(
      el.shadowRoot!.querySelector('[data-action="verify-payment-source"]')
    );
    assert.lengthOf(
      el.shadowRoot!.querySelectorAll('[data-action="delete-payment-source"]'),
      2
    );

    await clickAction(el, 'toggle-payment-source-edit-mode');

    assert.equal(editButton()?.textContent?.trim(), 'Edit');
    assert.exists(el.shadowRoot!.querySelector('[data-action="add-card"]'));
    assert.exists(
      el.shadowRoot!.querySelector('[data-action="add-bank-account"]')
    );
    assert.lengthOf(
      el.shadowRoot!.querySelectorAll('[data-action="delete-payment-source"]'),
      0
    );
  });

  test('source deletion requires inline confirmation and removes the source', async () => {
    const requests: CapturedRequest[] = [];

    window.confirm = () => {
      throw new Error('window.confirm should not be called');
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

      return new Response('', {status: 200});
    };

    const el = await renderConnect({
      interactionId: 'interaction-payment',
      status: 'PAYMENT_SOURCE_REQUESTED',
      paymentSources: [
        {
          tenderType: 'Card',
          id: 'card-1',
          name: 'Corporate card',
          verificationInfo: {status: 'VERIFIED'},
          card: {
            network: 'Visa',
            cardNumber: '4111111111111111',
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

    await clickAction(el, 'toggle-payment-source-edit-mode');

    const deleteButton = () =>
      el.shadowRoot!.querySelector<HTMLButtonElement>(
        '[data-action="delete-payment-source"][data-payment-method-id="card-1"]'
      )!;

    deleteButton().click();
    await flushElement(el);

    assert.lengthOf(requests, 0);
    assert.equal(
      el
        .shadowRoot!.querySelector('.payment-method-delete-confirmation')
        ?.textContent?.trim(),
      'Remove this payment method?'
    );
    assert.exists(
      el.shadowRoot!.querySelector(
        '[data-action="cancel-delete-payment-source"][data-payment-method-id="card-1"]'
      )
    );
    assert.equal(deleteButton().textContent?.trim(), 'Delete');

    deleteButton().click();
    await flushElement(el);

    assert.deepEqual(
      requests.map(
        (request) => `${request.method} ${new URL(request.url).pathname}`
      ),
      ['DELETE /interaction/source/card-1']
    );
    assert.equal(
      requests[0].headers.get('x-interaction-id'),
      'interaction-payment'
    );
    assert.equal(requests[0].credentials, 'include');
    assert.deepEqual(
      el.interactionResponse?.paymentSources?.map((source) => source.id),
      ['bank-1']
    );
    assert.equal(
      el
        .shadowRoot!.querySelector('.widget-header-action button')
        ?.textContent?.trim(),
      'Done'
    );
    assert.notExists(el.shadowRoot!.querySelector('[data-action="add-card"]'));
    assert.lengthOf(
      el.shadowRoot!.querySelectorAll('[data-action="delete-payment-source"]'),
      1
    );
  });

  test('canceling source deletion clears confirmation without a request', async () => {
    const requests: CapturedRequest[] = [];

    window.confirm = () => {
      throw new Error('window.confirm should not be called');
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

      return new Response('', {status: 200});
    };

    const el = await renderConnect({
      interactionId: 'interaction-payment',
      status: 'PAYMENT_SOURCE_REQUESTED',
      paymentSources: [
        {
          tenderType: 'Card',
          id: 'card-1',
          name: 'Corporate card',
          verificationInfo: {status: 'VERIFIED'},
          card: {
            network: 'Visa',
            cardNumber: '4111111111111111',
          },
        },
      ],
    });

    await clickAction(el, 'toggle-payment-source-edit-mode');

    el.shadowRoot!.querySelector<HTMLButtonElement>(
      '[data-action="delete-payment-source"][data-payment-method-id="card-1"]'
    )?.click();
    await flushElement(el);

    assert.equal(
      el
        .shadowRoot!.querySelector('.payment-method-delete-confirmation')
        ?.textContent?.trim(),
      'Remove this payment method?'
    );

    el.shadowRoot!.querySelector<HTMLButtonElement>(
      '[data-action="cancel-delete-payment-source"][data-payment-method-id="card-1"]'
    )?.click();
    await flushElement(el);

    assert.notExists(
      el.shadowRoot!.querySelector('.payment-method-delete-confirmation')
    );
    assert.notExists(
      el.shadowRoot!.querySelector(
        '[data-action="cancel-delete-payment-source"]'
      )
    );
    assert.lengthOf(requests, 0);
    assert.deepEqual(
      el.interactionResponse?.paymentSources?.map((source) => source.id),
      ['card-1']
    );
  });

  test('delete confirmation moves between payment source rows', async () => {
    const requests: CapturedRequest[] = [];

    window.confirm = () => {
      throw new Error('window.confirm should not be called');
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

      return new Response('', {status: 200});
    };

    const el = await renderConnect({
      interactionId: 'interaction-payment',
      status: 'PAYMENT_SOURCE_REQUESTED',
      paymentSources: [
        {
          tenderType: 'Card',
          id: 'card-1',
          name: 'Corporate card',
          verificationInfo: {status: 'VERIFIED'},
          card: {
            network: 'Visa',
            cardNumber: '4111111111111111',
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

    await clickAction(el, 'toggle-payment-source-edit-mode');

    el.shadowRoot!.querySelector<HTMLButtonElement>(
      '[data-action="delete-payment-source"][data-payment-method-id="card-1"]'
    )?.click();
    await flushElement(el);

    const cardRow = el.shadowRoot!.querySelector<HTMLElement>(
      '.payment-method-row[data-payment-method-id="card-1"]'
    );
    const bankRow = el.shadowRoot!.querySelector<HTMLElement>(
      '.payment-method-row[data-payment-method-id="bank-1"]'
    );

    assert.equal(
      cardRow
        ?.querySelector('.payment-method-delete-confirmation')
        ?.textContent?.trim(),
      'Remove this payment method?'
    );
    assert.notExists(
      bankRow?.querySelector('.payment-method-delete-confirmation')
    );

    el.shadowRoot!.querySelector<HTMLButtonElement>(
      '[data-action="delete-payment-source"][data-payment-method-id="bank-1"]'
    )?.click();
    await flushElement(el);

    assert.notExists(
      el
        .shadowRoot!.querySelector<HTMLElement>(
          '.payment-method-row[data-payment-method-id="card-1"]'
        )
        ?.querySelector('.payment-method-delete-confirmation')
    );
    assert.equal(
      el
        .shadowRoot!.querySelector<HTMLElement>(
          '.payment-method-row[data-payment-method-id="bank-1"]'
        )
        ?.querySelector('.payment-method-delete-confirmation')
        ?.textContent?.trim(),
      'Remove this payment method?'
    );
    assert.lengthOf(requests, 0);
  });

  test('delete confirmation clears after the timeout', async () => {
    const requests: CapturedRequest[] = [];

    window.confirm = () => {
      throw new Error('window.confirm should not be called');
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

      return new Response('', {status: 200});
    };

    const el = await renderConnect({
      interactionId: 'interaction-payment',
      status: 'PAYMENT_SOURCE_REQUESTED',
      paymentSources: [
        {
          tenderType: 'Card',
          id: 'card-1',
          name: 'Corporate card',
          verificationInfo: {status: 'VERIFIED'},
          card: {
            network: 'Visa',
            cardNumber: '4111111111111111',
          },
        },
      ],
    });

    await clickAction(el, 'toggle-payment-source-edit-mode');

    const confirmationTimer = captureDeleteConfirmationTimer();

    try {
      el.shadowRoot!.querySelector<HTMLButtonElement>(
        '[data-action="delete-payment-source"][data-payment-method-id="card-1"]'
      )?.click();
      await flushElement(el);

      assert.equal(confirmationTimer.delay, 5000);
      assert.equal(
        el
          .shadowRoot!.querySelector('.payment-method-delete-confirmation')
          ?.textContent?.trim(),
        'Remove this payment method?'
      );

      confirmationTimer.release();
      await flushElement(el);

      assert.notExists(
        el.shadowRoot!.querySelector('.payment-method-delete-confirmation')
      );
      assert.lengthOf(requests, 0);
      assert.deepEqual(
        el.interactionResponse?.paymentSources?.map((source) => source.id),
        ['card-1']
      );
    } finally {
      confirmationTimer.restore();
    }
  });

  test('loads saved payment sources and billing addresses from the interaction', async () => {
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
          interactionId: 'interaction-payment',
          status: 'PAYMENT_SOURCE_REQUESTED',
          paymentSources: [
            {
              tenderType: 'Card',
              id: 'card-1',
              name: 'Corporate Visa',
              verificationInfo: {status: 'VERIFIED'},
              card: {
                network: 'Visa',
                cardNumber: '4111111111111111',
              },
            },
          ],
          billerAddress: [
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
        {status: 200, headers: {'Content-Type': 'application/json'}}
      );
    };

    const el = await renderConnect({
      interactionId: 'interaction-payment',
      status: 'PAYMENT_SOURCE_REQUESTED',
    });

    await waitFor(
      () => Boolean(el.shadowRoot!.querySelector('.payment-method-row')),
      'interaction payment sources did not render'
    );

    assert.deepEqual(
      requests.map(
        (request) => `${request.method} ${new URL(request.url).pathname}`
      ),
      ['GET /interaction']
    );
    assert.equal(
      requests[0].headers.get('x-interaction-id'),
      'interaction-payment'
    );
    assert.equal(
      el
        .shadowRoot!.querySelector('.payment-method-title')
        ?.textContent?.trim(),
      'Corporate Visa'
    );
    assert.equal(
      el.shadowRoot!.querySelector('.payment-method-meta')?.textContent?.trim(),
      '•••• 1111'
    );

    await clickAction(el, 'add-card');
    await waitFor(() =>
      Boolean(el.shadowRoot!.querySelector('.billing-address-summary'))
    );
    assert.equal(
      el
        .shadowRoot!.querySelector('.billing-address-summary-value')
        ?.textContent?.trim(),
      '1 Main St, New York, NY 10001'
    );
    await clickAction(el, 'change-billing-address');

    assert.exists(el.shadowRoot!.querySelector('#billing-address'));

    assert.deepEqual(
      [
        ...el.shadowRoot!.querySelectorAll<HTMLOptionElement>(
          '#billing-address option'
        ),
      ].map((option) => option.textContent?.trim()),
      ['1 Main St, New York, NY 10001', 'Add new billing address']
    );
  });

  test('interaction refresh failures keep the payment screen stable without emitting onError', async () => {
    window.fetch = async () => {
      throw new Error('network unavailable');
    };

    const el = await renderConnect({
      interactionId: 'interaction-payment',
      status: 'PAYMENT_SOURCE_REQUESTED',
    });
    const {errorEvents} = recordOutputEvents(el);

    await nextFrame();
    await nextFrame();

    assert.equal(
      el.shadowRoot!.querySelector('.widget-title')?.textContent?.trim(),
      'Add payment method'
    );
    assert.lengthOf(errorEvents, 0);
  });

  test('clicking a verified saved method shows the selected payment screen before attaching and emits onSuccess', async () => {
    const requests: CapturedRequest[] = [];
    const selectedSource: PaymentSource = {
      tenderType: 'Card',
      id: 'card-1',
      name: 'Corporate card',
      verificationInfo: {status: 'VERIFIED'},
      card: {
        network: 'Visa',
        nameOnCard: 'Ada Lovelace',
        cardNumber: '4111111111111111',
      },
    };
    const refreshedSource: PaymentSource = {
      tenderType: 'Card',
      id: 'card-1',
      name: 'Corporate Visa',
      verificationInfo: {status: 'VERIFIED'},
      card: {
        network: 'Visa',
        nameOnCard: 'Ada Lovelace',
        cardNumber: '4111111111111111',
      },
    };
    let resolveAttachResponse:
      | ((response: Response | PromiseLike<Response>) => void)
      | undefined;

    window.fetch = async (input: RequestInfo | URL) => {
      const request = input instanceof Request ? input : new Request(input);
      const pathname = new URL(request.url).pathname;

      requests.push({
        url: request.url,
        method: request.method,
        headers: new Headers(request.headers),
        bodyText: await request.clone().text(),
        credentials: request.credentials,
      });

      if (pathname === '/interaction/source/card-1/attach') {
        return new Promise((resolve) => {
          resolveAttachResponse = resolve;
        });
      }

      return new Response(JSON.stringify({}), {
        status: 200,
        headers: {'Content-Type': 'application/json'},
      });
    };

    const el = await renderConnect({
      interactionId: 'interaction-payment',
      status: 'PAYMENT_SOURCE_REQUESTED',
      paymentSources: [selectedSource],
    });
    const {successEvents, errorEvents} = recordOutputEvents(el);

    el.shadowRoot!.querySelector<HTMLButtonElement>(
      '.payment-method-row'
    )?.click();
    await flushElement(el);

    assert.exists(el.shadowRoot!.querySelector('.selected-payment-method'));
    assert.exists(
      el.shadowRoot!.querySelector('[data-action="change-payment-source"]')
    );
    assert.equal(successEvents.length, 0);
    assert.equal(
      el
        .shadowRoot!.querySelector(
          '.selected-payment-method .payment-method-title'
        )
        ?.textContent?.trim(),
      'Corporate card'
    );
    assert.equal(
      el
        .shadowRoot!.querySelector(
          '.selected-payment-method .payment-method-meta'
        )
        ?.textContent?.trim(),
      '•••• 1111'
    );

    resolveAttachResponse?.(
      new Response(
        JSON.stringify({
          interactionId: 'interaction-payment',
          status: 'PAYMENT_SOURCE_ATTACHED',
          selectedSource: refreshedSource,
          paymentSources: [refreshedSource],
          billerAddress: [],
        }),
        {status: 200, headers: {'Content-Type': 'application/json'}}
      )
    );

    await waitFor(() => successEvents.length === 1, 'attach did not complete');
    await flushElement(el);

    assert.deepEqual(
      requests.map(
        (request) => `${request.method} ${new URL(request.url).pathname}`
      ),
      ['POST /interaction/source/card-1/attach']
    );
    assert.equal(
      requests[0].headers.get('x-interaction-id'),
      'interaction-payment'
    );
    assert.equal(requests[0].credentials, 'include');
    assert.lengthOf(successEvents, 1);
    assert.deepEqual(successEvents[0].detail, refreshedSource);
    assert.lengthOf(errorEvents, 0);
    assert.equal(el.interactionResponse?.selectedSource?.id, 'card-1');
    assert.equal(el.interactionResponse?.status, 'PAYMENT_SOURCE_ATTACHED');
    assert.equal(
      el.shadowRoot!.querySelector('.widget-title')?.textContent?.trim(),
      'Payment method saved'
    );
    assert.notExists(
      el.shadowRoot!.querySelector('[data-action="confirm-payment-source"]')
    );
    assert.exists(
      el.shadowRoot!.querySelector('[data-action="change-payment-source"]')
    );
    assert.equal(
      el
        .shadowRoot!.querySelector(
          '.selected-payment-method .payment-method-title'
        )
        ?.textContent?.trim(),
      'Corporate Visa'
    );
    assert.equal(
      el
        .shadowRoot!.querySelector(
          '.selected-payment-method .payment-method-meta'
        )
        ?.textContent?.trim(),
      '•••• 1111'
    );
    assert.exists(el.shadowRoot!.querySelector('.selected-payment-method'));
  });

  test('payment source attached renders the payment-method-saved summary with a change link', async () => {
    const el = await renderConnect({
      interactionId: 'interaction-payment',
      status: 'PAYMENT_SOURCE_ATTACHED',
      selectedSource: {
        tenderType: 'Card',
        id: 'card-1',
        name: 'Corporate Visa',
        verificationInfo: {status: 'VERIFIED'},
        card: {
          network: 'Visa',
          cardNumber: '4111111111111111',
        },
      },
      paymentSources: [],
    });

    assert.equal(
      el.shadowRoot!.querySelector('.widget-title')?.textContent?.trim(),
      'Payment method saved'
    );
    assert.exists(el.shadowRoot!.querySelector('.selected-payment-method'));
    assert.notExists(
      el.shadowRoot!.querySelector('[data-action="confirm-payment-source"]')
    );
    assert.equal(
      el
        .shadowRoot!.querySelector(
          '.widget-header-action [data-action="change-payment-source"]'
        )
        ?.textContent?.trim(),
      'Change'
    );
    assert.notExists(
      el.shadowRoot!.querySelector(
        '.primitive-footer [data-action="change-payment-source"]'
      )
    );
    assert.notExists(el.shadowRoot!.querySelector('.alert-success'));
    assert.exists(el.shadowRoot!.querySelector('.selected-payment-method'));
  });

  test('payment source attached change link returns to payment methods', async () => {
    const requests: CapturedRequest[] = [];

    window.fetch = async (input: RequestInfo | URL) => {
      const request = input instanceof Request ? input : new Request(input);
      const pathname = new URL(request.url).pathname;

      requests.push({
        url: request.url,
        method: request.method,
        headers: new Headers(request.headers),
        bodyText: await request.clone().text(),
        credentials: request.credentials,
      });

      if (pathname === '/interaction') {
        return new Response(
          JSON.stringify({
            interactionId: 'interaction-payment',
            status: 'PAYMENT_SOURCE_REQUESTED',
            paymentSources: [
              {
                tenderType: 'Card',
                id: 'card-1',
                name: 'Refreshed Visa',
                verificationInfo: {status: 'VERIFIED'},
                card: {
                  network: 'Visa',
                  cardNumber: '4111111111114242',
                },
              },
            ],
          }),
          {status: 200, headers: {'Content-Type': 'application/json'}}
        );
      }

      return new Response(JSON.stringify({}), {
        status: 200,
        headers: {'Content-Type': 'application/json'},
      });
    };

    const el = await renderConnect({
      interactionId: 'interaction-payment',
      status: 'PAYMENT_SOURCE_ATTACHED',
      selectedSource: {
        tenderType: 'Card',
        id: 'card-1',
        name: 'Corporate Visa',
        verificationInfo: {status: 'VERIFIED'},
        card: {
          network: 'Visa',
          cardNumber: '4111111111111111',
        },
      },
      paymentSources: [
        {
          tenderType: 'Card',
          id: 'card-1',
          name: 'Corporate Visa',
          verificationInfo: {status: 'VERIFIED'},
          card: {
            network: 'Visa',
            cardNumber: '4111111111111111',
          },
        },
      ],
    });

    await clickAction(el, 'change-payment-source');
    await waitFor(
      () =>
        requests.some(
          (request) =>
            request.method === 'GET' &&
            new URL(request.url).pathname === '/interaction'
        ),
      'interaction was not refreshed'
    );
    await waitFor(
      () =>
        el
          .shadowRoot!.querySelector('.payment-method-title')
          ?.textContent?.trim() === 'Refreshed Visa',
      'refreshed payment method was not shown'
    );

    assert.equal(
      el.shadowRoot!.querySelector('.widget-title')?.textContent?.trim(),
      'Pay with'
    );
    assert.exists(el.shadowRoot!.querySelector('.payment-method-row'));
    assert.notExists(el.shadowRoot!.querySelector('.selected-payment-method'));
    assert.deepEqual(
      requests.map(
        (request) => `${request.method} ${new URL(request.url).pathname}`
      ),
      ['GET /interaction']
    );
  });

  test('payment source attached renders the selected payment method details', async () => {
    const el = await renderConnect({
      interactionId: 'interaction-payment',
      status: 'PAYMENT_SOURCE_ATTACHED',
      selectedSource: {
        tenderType: 'Card',
        id: 'card-1',
        name: 'Corporate Visa',
        verificationInfo: {status: 'VERIFIED'},
        card: {
          network: 'Visa',
          cardNumber: '4111111111111111',
        },
      },
      paymentSources: [],
    });

    assert.equal(
      el.shadowRoot!.querySelector('.widget-title')?.textContent?.trim(),
      'Payment method saved'
    );
    assert.equal(
      el
        .shadowRoot!.querySelector(
          '.selected-payment-method .payment-method-title'
        )
        ?.textContent?.trim(),
      'Corporate Visa'
    );
    assert.equal(
      el
        .shadowRoot!.querySelector(
          '.selected-payment-method .payment-method-meta'
        )
        ?.textContent?.trim(),
      '•••• 1111'
    );
  });

  test('clicking a NOT_VERIFIED saved source starts verification from the action-required row', async () => {
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

      const pathname = new URL(request.url).pathname;

      if (pathname === '/interaction/verify/step1') {
        return new Response(
          JSON.stringify({
            status: 'REQUIRE_INFO',
            docs: [{docType: 'BANK_STATEMENT', mandatory: true}],
          }),
          {
            status: 200,
            headers: {'Content-Type': 'application/json'},
          }
        );
      }

      return new Response(JSON.stringify({}), {
        status: 200,
        headers: {'Content-Type': 'application/json'},
      });
    };

    const el = await renderConnect({
      interactionId: 'interaction-payment',
      status: 'PAYMENT_SOURCE_REQUESTED',
      paymentSources: [
        {
          tenderType: 'BankAccount',
          id: 'bank-1',
          name: 'Operating account',
          verificationInfo: {status: 'NOT_VERIFIED'},
          bankAccount: {
            bankName: 'Commerce National Bank',
            accountNumber: '9876543210',
          },
        },
      ],
    });

    const {successEvents, errorEvents} = recordOutputEvents(el);
    const row = el.shadowRoot!.querySelector<HTMLElement>(
      '.payment-method-row'
    )!;

    row.click();
    await flushElement(el);

    assert.equal(row.tagName, 'BUTTON');
    assert.equal(row.dataset.action, 'verify-payment-source');
    assert.equal(
      row.querySelector('.verification-status-badge')?.textContent?.trim(),
      'Action Required'
    );
    assert.exists(row.querySelector('.payment-method-chevron'));
    assert.deepEqual(
      requests.map(
        (request) => `${request.method} ${new URL(request.url).pathname}`
      ),
      ['POST /interaction/verify/step1']
    );
    assert.equal(requests[0].bodyText, JSON.stringify({value: 'bank-1'}));
    await waitFor(
      () =>
        el.shadowRoot!.querySelector('.widget-title')?.textContent?.trim() ===
        'Complete account verification',
      'required-info screen did not render'
    );
    assert.equal(
      el.shadowRoot!.querySelector('.widget-title')?.textContent?.trim(),
      'Complete account verification'
    );
    assert.equal(
      el
        .shadowRoot!.querySelector('.upload-row-requirements')
        ?.textContent?.trim(),
      'Bank statement'
    );
    assert.lengthOf(successEvents, 0);
    assert.lengthOf(errorEvents, 0);
  });

  test('renders UNDER_REVIEW saved source rows as non-clickable status rows', async () => {
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

      return new Response(JSON.stringify({}), {
        status: 200,
        headers: {'Content-Type': 'application/json'},
      });
    };

    const el = await renderConnect({
      interactionId: 'interaction-payment',
      status: 'PAYMENT_SOURCE_REQUESTED',
      paymentSources: [
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
    const {successEvents, errorEvents} = recordOutputEvents(el);
    const row = el.shadowRoot!.querySelector<HTMLElement>(
      '.payment-method-row'
    )!;

    row.click();
    await flushElement(el);

    assert.equal(row.tagName, 'DIV');
    assert.equal(row.dataset.action, undefined);
    assert.equal(
      row.querySelector('.verification-status-badge')?.textContent?.trim(),
      'Under review'
    );
    assert.equal(
      el.interactionResponse?.paymentSources?.[0]?.verificationInfo?.status,
      'UNDER_REVIEW'
    );
    assert.equal(
      el.shadowRoot!.querySelector('.widget-title')?.textContent?.trim(),
      'Pay with'
    );
    assert.lengthOf(requests, 0);
    assert.lengthOf(successEvents, 0);
    assert.lengthOf(errorEvents, 0);
  });

  test('renders declined saved source rows as non-clickable cannot-use rows', async () => {
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
      return new Response(JSON.stringify({}), {
        status: 200,
        headers: {'Content-Type': 'application/json'},
      });
    };

    const el = await renderConnect({
      interactionId: 'interaction-payment',
      status: 'PAYMENT_SOURCE_REQUESTED',
      paymentSources: [
        {
          tenderType: 'Card',
          id: 'card-1',
          name: 'Corporate card',
          verificationInfo: {status: 'DECLINED'},
          card: {
            network: 'Visa',
            cardNumber: '4111111111114242',
          },
        },
      ],
    });
    const row = el.shadowRoot!.querySelector<HTMLElement>(
      '.payment-method-row'
    )!;

    row.click();
    await flushElement(el);

    assert.equal(row.tagName, 'DIV');
    assert.equal(row.dataset.action, undefined);
    assert.equal(
      row.querySelector('.verification-status-badge')?.textContent?.trim(),
      "Can't Use"
    );
    assert.equal(
      el.shadowRoot!.querySelector('.widget-title')?.textContent?.trim(),
      'Pay with'
    );
    assert.lengthOf(requests, 0);
  });

  test('clicking a REQUIRE_INFO saved source opens required-info screen without verification request', async () => {
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
          status: 'UNDER_REVIEW',
          docs: [{docType: 'BANK_STATEMENT', mandatory: true}],
        }),
        {status: 200, headers: {'Content-Type': 'application/json'}}
      );
    };

    const el = await renderConnect({
      interactionId: 'interaction-payment',
      status: 'PAYMENT_SOURCE_REQUESTED',
      paymentSources: [
        {
          tenderType: 'BankAccount',
          id: 'bank-1',
          name: 'Operating account',
          verificationInfo: {
            status: 'REQUIRE_INFO',
            docs: [
              {docType: 'BANK_STATEMENT', mandatory: true},
              {docType: 'DRIVER_LICENSE_PHOTO', mandatory: true},
            ],
          },
          bankAccount: {
            bankName: 'Commerce National Bank',
            accountNumber: '9876543210',
          },
        },
      ],
    });

    el.shadowRoot!.querySelector<HTMLButtonElement>(
      '.payment-method-row'
    )?.click();
    await flushElement(el);

    assert.lengthOf(requests, 0);
    assert.equal(
      el.shadowRoot!.querySelector('.widget-title')?.textContent?.trim(),
      'Complete account verification'
    );
    assert.equal(
      el
        .shadowRoot!.querySelector(
          '.widget-header-action [data-action="back-to-payment-methods"]'
        )
        ?.textContent?.trim(),
      'Back'
    );
    assert.notExists(
      el
        .shadowRoot!.querySelector(
          '.widget-header-action [data-action="back-to-payment-methods"]'
        )
        ?.closest('.card-form-back-header, .bank-provider-back-header')
    );
    assert.deepEqual(
      [...el.shadowRoot!.querySelectorAll('.required-info-card-field')].map(
        (node) => [
          node.getAttribute('data-required-info-card-field'),
          node.textContent?.trim(),
        ]
      ),
      [
        ['name', 'Operating account'],
        ['number', '•••• 3210'],
      ]
    );
    assert.equal(
      el
        .shadowRoot!.querySelector('.required-info-card-status')
        ?.textContent?.trim(),
      'Need More Information'
    );
    assert.exists(
      el.shadowRoot!.querySelector('[data-required-info-card-icon="bank"]')
    );
    assert.deepEqual(
      [...el.shadowRoot!.querySelectorAll('.upload-row-requirements')].map(
        (node) => node.textContent?.trim()
      ),
      ['Bank statement', 'Driver license photo']
    );
    assert.notExists(el.shadowRoot!.querySelector('.required-document-row'));
    assert.lengthOf(
      el.shadowRoot!.querySelectorAll(
        '.required-info-document.required-document-text-row'
      ),
      2
    );
  });

  test('bank saved-source REQUIRE_INFO verification shows required-info screen with bank retry action', async () => {
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

      return new Response(JSON.stringify({}), {
        status: 200,
        headers: {'Content-Type': 'application/json'},
      });
    };

    const el = await renderConnect({
      interactionId: 'interaction-payment',
      status: 'PAYMENT_SOURCE_REQUESTED',
      paymentSources: [
        {
          tenderType: 'BankAccount',
          id: 'bank-1',
          name: 'Operating account',
          verificationInfo: {
            status: 'REQUIRE_INFO',
            docs: [
              {docType: 'BANK_STATEMENT', mandatory: true},
              {docType: 'DRIVER_LICENSE_NUMBER', mandatory: true},
              {docType: 'SOCIAL_SECURITY_NUMBER', mandatory: true},
            ],
          },
          bankAccount: {
            bankName: 'Commerce National Bank',
            accountNumber: '9876543210',
          },
        },
      ],
    });
    const {successEvents, errorEvents} = recordOutputEvents(el);

    await clickAction(el, 'verify-payment-source');

    assert.lengthOf(requests, 0);
    assert.equal(
      el.shadowRoot!.querySelector('.widget-title')?.textContent?.trim(),
      'Complete account verification'
    );
    assert.deepEqual(
      [...el.shadowRoot!.querySelectorAll('.upload-row-requirements')].map(
        (node) => node.textContent?.trim()
      ),
      ['Bank statement']
    );
    assert.deepEqual(
      [
        ...el.shadowRoot!.querySelectorAll<HTMLInputElement>(
          '.required-info-text-input'
        ),
      ].map((input) => ({
        label: el
          .shadowRoot!.querySelector(`label[for="${input.id}"]`)
          ?.textContent?.trim(),
        type: input.type,
        inputmode: input.getAttribute('inputmode'),
      })),
      [
        {
          label: 'Driver license number',
          type: 'text',
          inputmode: 'text',
        },
      ]
    );
    assert.equal(
      el
        .shadowRoot!.querySelector('.required-info-ssn-document .field-label')
        ?.textContent?.trim(),
      'Social Security number'
    );
    assert.lengthOf(
      el.shadowRoot!.querySelectorAll(
        '.required-info-document.required-document-text-row'
      ),
      3
    );
    assert.deepEqual(
      [
        ...el.shadowRoot!.querySelectorAll<HTMLInputElement>(
          '.required-info-ssn-input'
        ),
      ].map((input) => ({
        type: input.type,
        inputmode: input.getAttribute('inputmode'),
        maxlength: input.getAttribute('maxlength'),
      })),
      [
        {
          type: 'password',
          inputmode: 'numeric',
          maxlength: '3',
        },
        {
          type: 'password',
          inputmode: 'numeric',
          maxlength: '2',
        },
        {
          type: 'password',
          inputmode: 'numeric',
          maxlength: '4',
        },
      ]
    );
    assert.notExists(
      el.shadowRoot!.querySelector('[data-action="use-different-bank-account"]')
    );
    assert.lengthOf(successEvents, 0);
    assert.lengthOf(errorEvents, 0);
  });

  test('card saved-source REQUIRE_INFO verification shows required-info screen with different-method action', async () => {
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

      return new Response(JSON.stringify({}), {
        status: 200,
        headers: {'Content-Type': 'application/json'},
      });
    };

    const el = await renderConnect({
      interactionId: 'interaction-payment',
      status: 'PAYMENT_SOURCE_REQUESTED',
      paymentSources: [
        {
          tenderType: 'Card',
          id: 'card-1',
          name: 'Corporate card',
          verificationInfo: {
            status: 'REQUIRE_INFO',
            docs: [{docType: 'DRIVER_LICENSE_PHOTO', mandatory: true}],
          },
          card: {
            network: 'Visa',
            nameOnCard: 'Ada Lovelace',
            cardNumber: '4111111111114242',
            expirationMonth: '03',
            expirationYear: '2030',
          },
        },
      ],
    });

    await clickAction(el, 'verify-payment-source');

    assert.equal(
      el.shadowRoot!.querySelector('.widget-title')?.textContent?.trim(),
      'Complete account verification'
    );
    assert.equal(
      el
        .shadowRoot!.querySelector(
          '.widget-header-action [data-action="back-to-payment-methods"]'
        )
        ?.textContent?.trim(),
      'Back'
    );
    assert.notExists(
      el
        .shadowRoot!.querySelector(
          '.widget-header-action [data-action="back-to-payment-methods"]'
        )
        ?.closest('.card-form-back-header, .bank-provider-back-header')
    );
    assert.deepEqual(
      [...el.shadowRoot!.querySelectorAll('.required-info-card-field')].map(
        (node) => [
          node.getAttribute('data-required-info-card-field'),
          node.textContent?.trim(),
        ]
      ),
      [
        ['name', 'Ada Lovelace'],
        ['number', '•••• •••• •••• 4242'],
        ['expiry', '03/30'],
      ]
    );
    assert.equal(
      el
        .shadowRoot!.querySelector('.required-info-card-status')
        ?.textContent?.trim(),
      'Need More Information'
    );
    assert.exists(
      el.shadowRoot!.querySelector('[data-required-info-card-icon="visa"]')
    );
    assert.equal(
      el
        .shadowRoot!.querySelector('.upload-row-requirements')
        ?.textContent?.trim(),
      'Driver license photo'
    );
    assert.notExists(
      el.shadowRoot!.querySelector('[data-action="use-different-method"]')
    );
    assert.lengthOf(requests, 0);
  });

  test('renders a transfer screen for verified bank and native accounts', async () => {
    const el = await renderConnect({
      interactionId: 'interaction-transfer',
      status: 'OTP_VALIDATION_SUCCESS',
      features: ['TRANSFER'],
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
          verificationInfo: {status: 'VERIFIED'},
          bankAccount: {
            bankName: 'Commerce National Bank',
            accountNumber: '9876543210',
          },
        },
        {
          tenderType: 'BankAccount',
          id: 'bank-under-review',
          name: 'Pending account',
          verificationInfo: {status: 'UNDER_REVIEW'},
          bankAccount: {
            bankName: 'Harbor Trust',
            accountNumber: '0000001234',
          },
        },
        {
          tenderType: 'DSCDisplayCard',
          id: 'dynamic-card-1',
          name: 'Dynamic credit card',
          verificationInfo: {status: 'VERIFIED'},
        },
        {
          tenderType: 'NativeAccount',
          id: 'native-account-1',
          name: 'Digital wallet',
          verificationInfo: {status: 'VERIFIED'},
          account: {
            positionId: 'wallet-position-7890',
            nickName: 'Commerce wallet',
            productType: 'Wallet',
            token: 'native-token-1',
          },
        },
      ],
    } as InteractionResponse);

    const fromSelect = el.shadowRoot!.querySelector<HTMLSelectElement>(
      '#transfer-from-source'
    );
    const toSelect = el.shadowRoot!.querySelector<HTMLSelectElement>(
      '#transfer-to-source'
    );
    const amountInput =
      el.shadowRoot!.querySelector<HTMLInputElement>('#transfer-amount');
    const currencySelect =
      el.shadowRoot!.querySelector<HTMLSelectElement>('#transfer-currency');
    const transferButton = el.shadowRoot!.querySelector<HTMLButtonElement>(
      '[data-action="transfer"]'
    );

    assert.equal(
      el.shadowRoot!.querySelector('.widget-title')?.textContent?.trim(),
      'Transfer funds'
    );
    assert.isOk(fromSelect, 'expected From account dropdown');
    assert.isOk(toSelect, 'expected To account dropdown');
    assert.isOk(amountInput, 'expected amount input');
    assert.isOk(currencySelect, 'expected currency dropdown');
    assert.deepEqual(
      [...fromSelect!.options].map((option) => [option.value, option.text]),
      [
        ['', 'Select account'],
        ['bank-1', 'Operating account'],
        ['native-account-1', 'Commerce wallet'],
      ]
    );
    assert.deepEqual(
      [...toSelect!.options].map((option) => [option.value, option.text]),
      [
        ['', 'Select account'],
        ['bank-1', 'Operating account'],
        ['native-account-1', 'Commerce wallet'],
      ]
    );
    assert.deepEqual(
      [...currencySelect!.options].map((option) => [option.value, option.text]),
      [
        ['USD', 'USD'],
        ['CAD', 'CAD'],
      ]
    );
    assert.isTrue(transferButton!.disabled);

    fromSelect!.value = 'bank-1';
    fromSelect!.dispatchEvent(new Event('change', {bubbles: true}));
    toSelect!.value = 'native-account-1';
    toSelect!.dispatchEvent(new Event('change', {bubbles: true}));
    amountInput!.value = '25.75';
    amountInput!.dispatchEvent(new Event('input', {bubbles: true}));
    await flushElement(el);

    assert.isFalse(
      el.shadowRoot!.querySelector<HTMLButtonElement>(
        '[data-action="transfer"]'
      )!.disabled
    );
  });

  test('posts a transfer request with selected accounts amount currency and auth headers', async () => {
    const requests: CapturedRequest[] = [];

    window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
      const request =
        input instanceof Request ? input : new Request(input, init);

      requests.push({
        url: request.url,
        method: request.method,
        headers: request.headers,
        bodyText: await request.clone().text(),
        credentials: request.credentials,
      });

      return new Response(
        JSON.stringify({
          id: 'transfer-transaction-1',
          amount: 25.75,
          asset: {type: 'CURRENCY', id: 'CAD'},
          credit: false,
          timestamp: 1710000000000,
        }),
        {
          status: 200,
          headers: {'Content-Type': 'application/json'},
        }
      );
    };

    const el = await renderConnect({
      interactionId: 'interaction-transfer',
      status: 'OTP_VALIDATION_SUCCESS',
      oauth: {access_token: 'transfer-access-token'},
      features: ['TRANSFER'],
      paymentSources: [
        {
          tenderType: 'BankAccount',
          id: 'bank-1',
          name: 'Operating account',
          verificationInfo: {status: 'VERIFIED'},
          bankAccount: {
            bankName: 'Commerce National Bank',
            accountNumber: '9876543210',
          },
        },
        {
          tenderType: 'NativeAccount',
          id: 'native-account-1',
          verificationInfo: {status: 'VERIFIED'},
          account: {
            positionId: 'wallet-position-7890',
            nickName: 'Commerce wallet',
            productType: 'Wallet',
            token: 'native-token-1',
          },
        },
      ],
    } as InteractionResponse);

    const fromSelect = el.shadowRoot!.querySelector<HTMLSelectElement>(
      '#transfer-from-source'
    )!;
    const toSelect = el.shadowRoot!.querySelector<HTMLSelectElement>(
      '#transfer-to-source'
    )!;
    const amountInput =
      el.shadowRoot!.querySelector<HTMLInputElement>('#transfer-amount')!;
    const currencySelect =
      el.shadowRoot!.querySelector<HTMLSelectElement>('#transfer-currency')!;

    fromSelect.value = 'bank-1';
    fromSelect.dispatchEvent(new Event('change', {bubbles: true}));
    toSelect.value = 'native-account-1';
    toSelect.dispatchEvent(new Event('change', {bubbles: true}));
    amountInput.value = '25.75';
    amountInput.dispatchEvent(new Event('input', {bubbles: true}));
    currencySelect.value = 'CAD';
    currencySelect.dispatchEvent(new Event('change', {bubbles: true}));
    await flushElement(el);

    el.shadowRoot!.querySelector<HTMLButtonElement>(
      '[data-action="transfer"]'
    )!.click();

    await waitFor(() => requests.length === 1, 'expected transfer request');

    assert.include(requests[0].url, '/interaction/source/native/transfer');
    assert.equal(requests[0].method, 'POST');
    assert.equal(
      requests[0].headers.get('x-interaction-id'),
      'interaction-transfer'
    );
    assert.equal(
      requests[0].headers.get('authorization'),
      'Bearer transfer-access-token'
    );
    assert.deepEqual(JSON.parse(requests[0].bodyText), {
      fromSourceId: 'bank-1',
      toSourceId: 'native-account-1',
      amount: 25.75,
      asset: {type: 'CURRENCY', id: 'CAD'},
    });
    assert.equal(
      el.shadowRoot!.querySelector('.alert-success')?.textContent?.trim(),
      'Transfer initiated.'
    );
  });
});
