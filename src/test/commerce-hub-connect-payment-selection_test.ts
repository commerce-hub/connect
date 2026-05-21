import {fixture, assert, html as testingHtml} from '@open-wc/testing';

import '../commerce-hub-connect.js';
import type {
  CommerceHubConnect,
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

const flushElement = async (el: CommerceHubConnect) => {
  await el.updateComplete;
  await nextFrame();
  await el.updateComplete;
};

const renderConnect = async (interactionResponse: InteractionResponse) => {
  const el = (await fixture(
    testingHtml`<commerce-hub-connect
      .interactionResponse=${interactionResponse}
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
      status: 'PAYMENT_SOURCE_REQUESTED',
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
    const el = await renderConnect({
      interactionId: 'interaction-payment',
      status: 'PAYMENT_SOURCE_REQUESTED',
      allowedTenderTypes: ['BANK_ACCOUNT', 'DYNAMIC_SESSION_CARD'],
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
      ],
    });

    const rows = [
      ...el.shadowRoot!.querySelectorAll<HTMLElement>('.payment-method-row'),
    ];

    assert.deepEqual(
      rows.map((row) => row.dataset.paymentMethodId),
      ['card-1', 'bank-1', 'dynamic-card-1']
    );
    assert.equal(
      rows[1].querySelector('.payment-method-title')?.textContent?.trim(),
      'Operating account'
    );
    assert.notExists(el.shadowRoot!.querySelector('[data-action="add-card"]'));
    assert.exists(
      el.shadowRoot!.querySelector('[data-action="add-bank-account"]')
    );
    assert.notExists(
      el.shadowRoot!.querySelector('[data-action="add-ach-manually"]')
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

  test('confirmed source deletion calls the delete endpoint and removes the source', async () => {
    const requests: CapturedRequest[] = [];
    const confirmMessages: string[] = [];

    window.confirm = (message?: string) => {
      confirmMessages.push(message ?? '');
      return true;
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

    assert.deepEqual(confirmMessages, ['Delete Corporate card?']);
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

  test('canceling source deletion does not call the delete endpoint', async () => {
    const requests: CapturedRequest[] = [];
    const confirmMessages: string[] = [];

    window.confirm = (message?: string) => {
      confirmMessages.push(message ?? '');
      return false;
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

    assert.deepEqual(confirmMessages, ['Delete Corporate card?']);
    assert.lengthOf(requests, 0);
    assert.deepEqual(
      el.interactionResponse?.paymentSources?.map((source) => source.id),
      ['card-1']
    );
    assert.notExists(el.shadowRoot!.querySelector('[data-action="add-card"]'));
    assert.lengthOf(
      el.shadowRoot!.querySelectorAll('[data-action="delete-payment-source"]'),
      1
    );
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
});
