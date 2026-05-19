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

  teardown(() => {
    window.fetch = originalFetch;
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
      ...el.shadowRoot!.querySelectorAll<HTMLButtonElement>(
        '.payment-method-row'
      ),
    ];

    assert.lengthOf(rows, 2);
    assert.notExists(
      el.shadowRoot!.querySelector('[data-action="confirm-payment-source"]')
    );
    assert.notExists(el.shadowRoot!.querySelector('.selected-payment-method'));
    assert.notExists(rows[0].querySelector('.payment-method-radio'));
    assert.notExists(rows[1].querySelector('.payment-method-radio'));
    assert.notEqual(rows[0].dataset.action, 'verify-payment-source');
    assert.equal(rows[1].dataset.action, 'verify-payment-source');
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
      'Visa •••• 1111'
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
      'Pay with'
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
      'Visa •••• 1111'
    );
    assert.exists(el.shadowRoot!.querySelector('.selected-payment-method'));
  });

  test('payment source attached renders the selected payment summary with a change option', async () => {
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
      'Pay with'
    );
    assert.exists(el.shadowRoot!.querySelector('.selected-payment-method'));
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
      'Visa •••• 1111'
    );
  });

  test('clicking an unverified row starts verification instead of attaching', async () => {
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

      if (pathname === '/interaction/verify/step1') {
        return new Response(
          JSON.stringify({
            status: 'UNDER_REVIEW',
            docs: [{docType: 'BANK_STATEMENT', mandatory: true}],
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

    el.shadowRoot!
      .querySelector<HTMLButtonElement>('.payment-method-row')
      ?.click();
    await waitFor(
      () =>
        el.shadowRoot!.querySelector('.widget-title')?.textContent?.trim() ===
        'Verification pending review',
      'verification outcome did not render'
    );

    assert.deepEqual(
      requests.map(
        (request) => `${request.method} ${new URL(request.url).pathname}`
      ),
      ['POST /interaction/verify/step1']
    );
    assert.equal(requests[0].bodyText, JSON.stringify({value: 'bank-1'}));
    assert.equal(
      el.shadowRoot!.querySelector('.widget-title')?.textContent?.trim(),
      'Verification pending review'
    );
    assert.lengthOf(successEvents, 0);
    assert.lengthOf(errorEvents, 0);
  });

  test('clicking an unverified source verify action starts verification and shows the outcome screen', async () => {
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

      if (pathname === '/interaction/verify/step1') {
        return new Response(
          JSON.stringify({
            status: 'UNDER_REVIEW',
            docs: [{docType: 'BANK_STATEMENT', mandatory: true}],
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

    await clickAction(el, 'verify-payment-source');

    assert.deepEqual(
      requests.map(
        (request) => `${request.method} ${new URL(request.url).pathname}`
      ),
      ['POST /interaction/verify/step1']
    );
    assert.equal(requests[0].bodyText, JSON.stringify({value: 'bank-1'}));
    assert.equal(
      requests[0].headers.get('x-interaction-id'),
      'interaction-payment'
    );
    assert.equal(requests[0].credentials, 'include');
    assert.equal(
      el.shadowRoot!.querySelector('.widget-title')?.textContent?.trim(),
      'Verification pending review'
    );
    assert.deepEqual(
      [
        ...el.shadowRoot!.querySelectorAll('.verification-detail-value'),
      ].map((node) => node.textContent?.trim()),
      ['Commerce National Bank', '3210', 'Pending review']
    );
    assert.equal(
      el.interactionResponse?.paymentSources?.[0]?.verificationInfo?.status,
      'UNDER_REVIEW'
    );
    assert.lengthOf(successEvents, 0);
    assert.lengthOf(errorEvents, 0);
  });
});
