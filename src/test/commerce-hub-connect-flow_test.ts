import {fixture, assert, html as testingHtml} from '@open-wc/testing';

import '../commerce-hub-connect.js';
import {
  type InteractionError,
  type InteractionResponse,
} from '../commerce-hub-connect.js';
import type {CommerceHubConnect} from '../commerce-hub-connect.js';

interface CapturedRequest {
  url: string;
  method: string;
  headers: Headers;
  bodyText: string;
}

const nextFrame = () =>
  new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));

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

const eventOnce = <Detail>(
  el: Element,
  name: string
): Promise<CustomEvent<Detail>> =>
  new Promise((resolve) => {
    el.addEventListener(
      name,
      (event) => resolve(event as CustomEvent<Detail>),
      {once: true}
    );
  });

suite('commerce-hub-connect flow', () => {
  const originalFetch = window.fetch;

  teardown(() => {
    window.fetch = originalFetch;
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
      'https://dev.openfx-nonprod.aws.fisv.cloud/interaction/otp/validate'
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
      'https://dev.openfx-nonprod.aws.fisv.cloud/interaction/otp/send/email'
    );
    assert.equal(requests[0].method, 'POST');
    assert.equal(
      requests[0].headers.get('x-interaction-id'),
      'interaction-otp'
    );
    assert.equal(requests[0].bodyText, '');
  });

  test('continue with selected method attaches source and emits onSuccess', async () => {
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
    const success = eventOnce<InteractionResponse>(el, 'onSuccess');

    await clickAction(el, 'attach-payment-source');
    const successEvent = await success;

    assert.lengthOf(requests, 1);
    assert.equal(
      requests[0].url,
      'https://dev.openfx-nonprod.aws.fisv.cloud/interaction/payment-source/card-1/attach'
    );
    assert.equal(requests[0].method, 'POST');
    assert.equal(
      requests[0].headers.get('x-interaction-id'),
      'interaction-payment'
    );
    assert.deepEqual(el.interactionResponse, apiResponse);
    assert.deepEqual(successEvent.detail, apiResponse);
  });

  test('missing interactionId emits onError and keeps the current screen stable', async () => {
    let calls = 0;

    window.fetch = async () => {
      calls += 1;
      return new Response('{}', {status: 200});
    };

    const el = await renderConnect({
      status: 'OTP_VALIDATION_PENDING',
      email: 'wallet@example.com',
    });
    const error = eventOnce<InteractionError>(el, 'onError');

    await setOtpValue(el, '123456');
    await clickAction(el, 'verify-otp');
    const errorEvent = await error;

    assert.equal(calls, 0);
    assert.equal(errorEvent.detail.code, 'MISSING_INTERACTION_ID');
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

    await setOtpValue(el, '123456');
    await clickAction(el, 'verify-otp');

    assert.equal(el.interactionResponse?.status, 'OTP_VALIDATION_FAILED');
    assert.exists(el.shadowRoot!.querySelector('[role="alert"]'));
    assert.equal(
      el
        .shadowRoot!.querySelector('[data-action="verify-otp"]')
        ?.textContent?.trim(),
      'Try again'
    );
  });
});
