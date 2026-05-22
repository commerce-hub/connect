import {fixture, assert, html as testingHtml} from '@open-wc/testing';

import '../commerce-hub-connect.js';
import {
  COMMERCE_HUB_BASE_URLS,
  DEFAULT_COMMERCE_HUB_BASE_URL,
  type InteractionResponse,
  type PaymentSource,
  type CommerceHubBaseURLInput,
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
  designConfig?: unknown,
  baseURL?: CommerceHubBaseURLInput
) => {
  const el = (await fixture(
    testingHtml`<commerce-hub-connect
      .interactionResponse=${interactionResponse}
      .designConfig=${designConfig}
      .baseURL=${baseURL}
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

const setOtpDigit = async (
  el: CommerceHubConnect,
  index: number,
  value: string
) => {
  const input =
    el.shadowRoot!.querySelectorAll<HTMLInputElement>('.otp-input')[index]!;

  input.value = value;
  input.dispatchEvent(new InputEvent('input', {bubbles: true, composed: true}));
  await flushElement(el);
};

const keyOtpInput = async (
  el: CommerceHubConnect,
  index: number,
  key: string
) => {
  const input =
    el.shadowRoot!.querySelectorAll<HTMLInputElement>('.otp-input')[index]!;

  input.focus();
  input.dispatchEvent(
    new KeyboardEvent('keydown', {key, bubbles: true, composed: true})
  );
  await flushElement(el);
};

const pasteOtpValue = async (
  el: CommerceHubConnect,
  index: number,
  value: string
) => {
  const input =
    el.shadowRoot!.querySelectorAll<HTMLInputElement>('.otp-input')[index]!;
  const event = new Event('paste', {
    bubbles: true,
    cancelable: true,
    composed: true,
  }) as Event & {
    clipboardData: {
      getData: (type: string) => string;
    };
  };

  input.focus();
  Object.defineProperty(event, 'clipboardData', {
    value: {
      getData: (type: string) => (type === 'text' ? value : ''),
    },
  });
  input.dispatchEvent(event);
  await flushElement(el);
};

const setRequiredInfoSsnSegments = async (
  el: CommerceHubConnect,
  values: [string, string, string]
) => {
  const inputs = [
    ...el.shadowRoot!.querySelectorAll<HTMLInputElement>(
      '.required-info-ssn-input'
    ),
  ];

  inputs.forEach((input, index) => {
    input.value = values[index] ?? '';
    input.dispatchEvent(
      new InputEvent('input', {bubbles: true, composed: true})
    );
  });

  await flushElement(el);
};

const pasteRequiredInfoSsnValue = async (
  el: CommerceHubConnect,
  value: string
) => {
  const input = el.shadowRoot!.querySelector<HTMLInputElement>(
    '.required-info-ssn-input'
  )!;
  const event = new Event('paste', {
    bubbles: true,
    cancelable: true,
    composed: true,
  }) as Event & {
    clipboardData: {
      getData: (type: string) => string;
    };
  };

  input.focus();
  Object.defineProperty(event, 'clipboardData', {
    value: {
      getData: (type: string) => (type === 'text' ? value : ''),
    },
  });
  input.dispatchEvent(event);
  await flushElement(el);
};

const clickAction = async (el: CommerceHubConnect, action: string) => {
  el.shadowRoot!.querySelector<HTMLButtonElement>(
    `[data-action="${action}"]`
  )!.click();
  await flushElement(el);
};

const selectRequiredInfoFile = async (
  el: CommerceHubConnect,
  fileName: string
) => {
  const input = el.shadowRoot!.querySelector<HTMLInputElement>(
    '.required-info-file-input'
  )!;
  const file = new File(['synthetic document'], fileName, {
    type: 'application/pdf',
  });

  Object.defineProperty(input, 'files', {
    configurable: true,
    value: [file],
  });
  input.dispatchEvent(new Event('change', {bubbles: true, composed: true}));
  await flushElement(el);
};

const setRequiredInfoValue = async (
  el: CommerceHubConnect,
  label: string,
  value: string
) => {
  const input = [
    ...el.shadowRoot!.querySelectorAll<HTMLInputElement>(
      '.required-info-text-input'
    ),
  ].find((candidate) => {
    const inputLabel = el
      .shadowRoot!.querySelector(`label[for="${candidate.id}"]`)
      ?.textContent?.trim();

    return inputLabel === label;
  })!;

  input.value = value;
  input.dispatchEvent(new InputEvent('input', {bubbles: true, composed: true}));
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

const deferredResponse = () => {
  let resolve!: (response: Response) => void;
  const promise = new Promise<Response>((innerResolve) => {
    resolve = innerResolve;
  });

  return {promise, resolve};
};

const captureMinimumOverlayTimer = () => {
  const originalSetTimeout = window.setTimeout;
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

  return {
    get delay() {
      return capturedDelay;
    },
    release() {
      capturedHandler?.();
    },
    restore() {
      window.setTimeout = originalSetTimeout;
    },
  };
};

const fillNewCardForm = async (el: CommerceHubConnect) => {
  await setFieldValue(el, 'card-label', 'Ada corporate card');
  await setFieldValue(el, 'name-on-card', 'Ada Lovelace');
  await setFieldValue(el, 'card-number', '4111 1111 1111 1111');
  await setFieldValue(el, 'expiration-date', '04/30');
  await setFieldValue(el, 'card-cvv', '123');
  await setSelectValue(el, 'billing-country', 'US');
  await setFieldValue(el, 'billing-address-line-1', '1 Main St');
  await setFieldValue(el, 'billing-address-line-2', 'Suite 100');
  await setFieldValue(el, 'billing-city', 'New York');
  await setSelectValue(el, 'billing-state', 'NY');
  await setFieldValue(el, 'billing-zip', '10001');
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

type VerificationStatus = NonNullable<
  PaymentSource['verificationInfo']
>['status'];

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
  appearance?: {
    branding?: {
      backgroundColor?: string;
      primaryColor?: string;
      primaryTextColor?: string;
      secondaryTextColor?: string;
      buttonColor?: string;
      buttonTextColor?: string;
      dangerColor?: string;
      successColor?: string;
      borderColor?: string;
      placeholderColor?: string;
      fontFamily?: string;
      borderRadius?: string;
    };
  };
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

const completePayByBankFlow = async ({
  finalizedStatus,
  verificationStatus,
  verificationSourceId,
  verificationDocs = [{docType: 'BANK_STATEMENT', mandatory: true}] as const,
  requiredInfoStep2Status,
  requiredInfoStep2SourceId,
  requiredInfoStep2Responses,
  requiredInfoFailurePath,
  requiredInfoUploadResponse,
}: {
  finalizedStatus: VerificationStatus;
  verificationStatus?: VerificationStatus;
  verificationSourceId?: string;
  verificationDocs?: NonNullable<
    NonNullable<PaymentSource['verificationInfo']>['docs']
  >;
  requiredInfoStep2Status?: VerificationStatus;
  requiredInfoStep2SourceId?: string;
  requiredInfoStep2Responses?: Array<{
    status: VerificationStatus;
    sourceId?: string;
    docs?: NonNullable<PaymentSource['verificationInfo']>['docs'];
  }>;
  requiredInfoFailurePath?: string;
  requiredInfoUploadResponse?: Promise<Response>;
}) => {
  const requests: CapturedRequest[] = [];
  let initConfig: TestPaymentSdkInitConfiguration | undefined;
  let requiredInfoStep2ResponseIndex = 0;
  const resolvedStatus = verificationStatus ?? finalizedStatus;
  const resolvedVerificationInfo = verificationStatus
    ? {
        status: resolvedStatus,
        docs: verificationDocs,
      }
    : finalizedStatus === 'REQUIRE_INFO'
    ? {
        status: resolvedStatus,
        docs: [
          {docType: 'BANK_STATEMENT', mandatory: true},
          {docType: 'DRIVER_LICENSE_PHOTO', mandatory: false},
        ] as const,
      }
    : {status: resolvedStatus};
  const finalizedVerificationInfo = verificationStatus
    ? resolvedVerificationInfo
    : finalizedStatus === 'REQUIRE_INFO'
    ? resolvedVerificationInfo
    : {status: finalizedStatus};
  const requiredInfoFinalVerificationInfo = requiredInfoStep2Status
    ? requiredInfoStep2Status === 'REQUIRE_INFO'
      ? {status: requiredInfoStep2Status, docs: verificationDocs}
      : {status: requiredInfoStep2Status}
    : resolvedVerificationInfo;

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

    if (pathname === '/interaction/source/pbb/session') {
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

    if (
      pathname === '/interaction/source/pbb/session/agg-session-1/p-token-1'
    ) {
      return new Response(
        JSON.stringify({
          sourceId: verificationSourceId ?? 'bank-new',
          ...finalizedVerificationInfo,
        }),
        {status: 200, headers: {'Content-Type': 'application/json'}}
      );
    }

    if (pathname === '/interaction/verify/step1' && verificationStatus) {
      return new Response(
        JSON.stringify({
          sourceId: verificationSourceId,
          status: verificationStatus,
          docs: verificationDocs,
        }),
        {status: 200, headers: {'Content-Type': 'application/json'}}
      );
    }

    if (
      pathname.startsWith('/interaction/doc/upload/') ||
      pathname === '/interaction/verify/uploadField'
    ) {
      if (requiredInfoUploadResponse) {
        return requiredInfoUploadResponse;
      }

      if (pathname === requiredInfoFailurePath) {
        return new Response(
          JSON.stringify({message: 'Document upload failed'}),
          {
            status: 400,
            headers: {'Content-Type': 'application/json'},
          }
        );
      }

      return new Response(undefined, {status: 200});
    }

    if (
      pathname === '/interaction/verify/step2' &&
      (requiredInfoStep2Status || requiredInfoStep2Responses)
    ) {
      const step2Response =
        requiredInfoStep2Responses?.[
          Math.min(
            requiredInfoStep2ResponseIndex,
            requiredInfoStep2Responses.length - 1
          )
        ] ?? requiredInfoFinalVerificationInfo;
      const responseSourceId =
        step2Response.status === 'VERIFIED'
          ? requiredInfoStep2SourceId
          : undefined;
      const step2ResponseSourceId =
        'sourceId' in step2Response ? step2Response.sourceId : undefined;

      requiredInfoStep2ResponseIndex += 1;

      return new Response(
        JSON.stringify({
          ...step2Response,
          sourceId: responseSourceId ?? step2ResponseSourceId,
        }),
        {
          status: 200,
          headers: {'Content-Type': 'application/json'},
        }
      );
    }

    const attachMatch = pathname.match(
      /^\/interaction\/source\/([^/]+)\/attach$/
    );

    if (attachMatch) {
      const attachedSourceId = decodeURIComponent(attachMatch[1]);

      return new Response(
        JSON.stringify({
          interactionId: 'interaction-payment',
          status: 'PAYMENT_SOURCE_ATTACHED',
          selectedSource: {
            id: attachedSourceId,
            tenderType: 'BankAccount',
            name: 'Operating account',
            verificationInfo: requiredInfoFinalVerificationInfo,
            bankAccount: {
              bankName: 'Commerce National Bank',
              accountNumber: '9876543210',
            },
          },
          paymentSources: [
            {
              id: attachedSourceId,
              tenderType: 'BankAccount',
              name: 'Operating account',
              verificationInfo: requiredInfoFinalVerificationInfo,
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

    if (pathname === '/interaction') {
      return new Response(
        JSON.stringify({
          interactionId: 'interaction-payment',
          status: 'PAYMENT_SOURCE_REQUESTED',
          paymentSources: [
            {
              id: 'bank-new',
              tenderType: 'BankAccount',
              name: 'Operating account',
              verificationInfo: finalizedVerificationInfo,
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

    return new Response(JSON.stringify({message: 'Unexpected request'}), {
      status: 500,
      headers: {'Content-Type': 'application/json'},
    });
  };

  const el = await renderConnect({
    interactionId: 'interaction-payment',
    status: 'PAYMENT_SOURCE_REQUESTED',
    paymentSources: [],
  });
  const events = recordOutputEvents(el);

  await clickAction(el, 'add-bank-account');
  await waitFor(() => Boolean(initConfig), 'PaymentSDK.init was not called');
  await initConfig!.onEvent({type: 'success'});
  await flushElement(el);

  return {el, requests, ...events};
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

  test('renders OTP pending with SDK v3 title, verify CTA before resend, and compact inputs', async () => {
    const el = await renderConnect({
      interactionId: 'interaction-otp',
      status: 'OTP_VALIDATION_PENDING',
      email: 'gregory.jablonski@fiserv.com',
    });

    assert.equal(
      el.shadowRoot!.querySelector('.widget-title')?.textContent?.trim(),
      'Enter verification code'
    );
    assert.include(
      el.shadowRoot!.querySelector('.widget-subtitle')?.textContent?.trim(),
      'We sent a one-time code to gregory.jablonski@fiserv.com.'
    );
    assert.notExists(el.shadowRoot!.querySelector('.widget-close'));
    assert.exists(el.shadowRoot!.querySelector('.widget-divider'));
    assert.equal(
      el.shadowRoot!.querySelector('.otp-support-copy')?.textContent?.trim(),
      "Didn't receive the code?"
    );
    assert.equal(
      getComputedStyle(
        el.shadowRoot!.querySelector<HTMLElement>('.otp-support')!
      ).display,
      'grid'
    );
    assert.lengthOf(el.shadowRoot!.querySelectorAll('.otp-input'), 6);
    assert.equal(
      getComputedStyle(el.shadowRoot!.querySelector<HTMLElement>('.otp-input')!)
        .minHeight,
      '40px'
    );
    assert.deepEqual(
      [
        ...el.shadowRoot!.querySelectorAll<HTMLElement>(
          '[data-action="verify-otp"], [data-action="resend-otp"]'
        ),
      ].map((node) => node.dataset.action),
      ['verify-otp', 'resend-otp']
    );
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

  test('OTP input supports arrow navigation, backspace retreat, and paste distribution', async () => {
    const el = await renderConnect({
      interactionId: 'interaction-otp',
      status: 'OTP_VALIDATION_PENDING',
      email: 'gregory.jablonski@fiserv.com',
    });
    const inputs = [
      ...el.shadowRoot!.querySelectorAll<HTMLInputElement>('.otp-input'),
    ];

    await setOtpDigit(el, 0, '1');
    assert.equal(el.shadowRoot!.activeElement, inputs[1]);

    await setOtpDigit(el, 1, '2');
    await setOtpDigit(el, 2, '3');

    await keyOtpInput(el, 1, 'ArrowRight');
    assert.equal(el.shadowRoot!.activeElement, inputs[2]);

    await keyOtpInput(el, 2, 'ArrowLeft');
    assert.equal(el.shadowRoot!.activeElement, inputs[1]);

    await keyOtpInput(el, 2, 'Backspace');
    assert.deepEqual(
      inputs.map((input) => input.value),
      ['1', '2', '', '', '', '']
    );
    assert.equal(el.shadowRoot!.activeElement, inputs[1]);

    await pasteOtpValue(el, 1, '23456');
    assert.deepEqual(
      inputs.map((input) => input.value),
      ['1', '2', '3', '4', '5', '6']
    );
    assert.equal(
      el
        .shadowRoot!.querySelector('[data-action="verify-otp"]')
        ?.getAttribute('disabled'),
      null
    );
  });

  test('renders payment methods with left icons, status badges, and utility add rows', async () => {
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
        {
          tenderType: 'Card',
          id: 'card-2',
          name: 'Travel card',
          verificationInfo: {status: 'DECLINED'},
          card: {
            network: 'Mastercard',
            cardNumber: '5555555555554444',
          },
        },
      ],
    });

    const rows = [
      ...el.shadowRoot!.querySelectorAll<HTMLElement>('.payment-method-row'),
    ];

    assert.deepEqual(
      rows.map((row) => row.dataset.paymentMethodId),
      ['card-1', 'bank-1', 'card-2']
    );
    assert.equal(
      el.shadowRoot!.querySelector('.widget-title')?.textContent?.trim(),
      'Pay with'
    );
    assert.notExists(el.shadowRoot!.querySelector('.widget-subtitle'));
    assert.exists(el.shadowRoot!.querySelector('.widget-divider'));
    assert.notExists(rows[0].querySelector('.payment-method-radio'));
    assert.notExists(rows[1].querySelector('.payment-method-radio'));
    assert.notExists(rows[2].querySelector('.payment-method-radio'));
    assert.equal(rows[0].dataset.action, 'attach-payment-source');
    assert.equal(rows[1].dataset.action, undefined);
    assert.equal(rows[2].dataset.action, undefined);
    assert.equal(
      rows[0].classList.contains('payment-method-row-selected'),
      true
    );
    assert.equal(
      rows[1].classList.contains('payment-method-row-selected'),
      false
    );
    assert.equal(
      rows[0].querySelector('.payment-method-title')?.textContent?.trim(),
      'Corporate card'
    );
    assert.equal(
      rows[0].querySelector('.payment-method-meta')?.textContent?.trim(),
      '•••• 4242'
    );
    assert.notExists(rows[0].querySelector('.payment-method-status'));
    assert.notExists(rows[0].querySelector('.verification-status-badge'));
    assert.exists(rows[0].querySelector('[data-payment-method-icon="visa"]'));
    assert.notExists(rows[0].querySelector('.payment-method-status-icon'));
    assert.exists(rows[0].querySelector('.payment-method-chevron'));
    assert.equal(
      rows[1].querySelector('.payment-method-title')?.textContent?.trim(),
      'Operating account'
    );
    assert.equal(
      rows[1].querySelector('.payment-method-meta')?.textContent?.trim(),
      '•••• 3210'
    );
    assert.exists(rows[1].querySelector('[data-payment-method-icon="bank"]'));
    assert.notExists(rows[1].querySelector('.payment-method-status'));
    assert.equal(
      rows[1].querySelector('.verification-status-badge')?.textContent?.trim(),
      'Under review'
    );
    assert.notExists(rows[1].querySelector('.payment-method-status-icon'));
    assert.notExists(rows[1].querySelector('.payment-method-chevron'));
    assert.equal(
      rows[2].querySelector('.payment-method-title')?.textContent?.trim(),
      'Travel card'
    );
    assert.equal(
      rows[2].querySelector('.payment-method-meta')?.textContent?.trim(),
      '•••• 4444'
    );
    assert.exists(
      rows[2].querySelector('[data-payment-method-icon="mastercard"]')
    );
    assert.notExists(rows[2].querySelector('.payment-method-status'));
    assert.equal(
      rows[2].querySelector('.verification-status-badge')?.textContent?.trim(),
      "Can't Use"
    );
    assert.notExists(rows[2].querySelector('.payment-method-status-icon'));
    assert.notExists(rows[2].querySelector('.payment-method-chevron'));
    assert.notEqual(
      getComputedStyle(rows[0]).backgroundColor,
      getComputedStyle(rows[1]).backgroundColor
    );
    assert.equal(
      getComputedStyle(rows[1]).backgroundColor,
      'rgb(255, 255, 255)'
    );
    assert.equal(getComputedStyle(rows[0]).paddingTop, '10px');
    assert.equal(getComputedStyle(rows[0]).columnGap, '10px');
    assert.equal(
      getComputedStyle(
        rows[0].querySelector<HTMLElement>('.payment-method-title')!
      ).fontWeight,
      '600'
    );
    assert.notExists(el.shadowRoot!.querySelector('.source-action'));
    assert.deepEqual(
      [...el.shadowRoot!.querySelectorAll('.source-action-link-title')].map(
        (item) => item.textContent?.trim()
      ),
      ['Add credit or debit card', 'Add bank account']
    );
    const addCardLink = el.shadowRoot!.querySelector<HTMLElement>(
      '[data-action="add-card"]'
    )!;
    const addCardIcon = addCardLink.querySelector<HTMLElement>(
      '.source-action-icon'
    )!;
    const unselectedRow = rows[1]!;

    assert.notExists(el.shadowRoot!.querySelector('.source-action-link-icon'));
    assert.exists(
      el.shadowRoot!.querySelector(
        '[data-action="add-card"] .source-action-icon'
      )
    );
    assert.exists(
      el.shadowRoot!.querySelector(
        '[data-action="add-bank-account"] .source-action-icon'
      )
    );
    assert.equal(
      getComputedStyle(addCardLink).backgroundColor,
      'rgb(255, 255, 255)'
    );
    assert.equal(getComputedStyle(addCardLink).borderTopStyle, 'dashed');
    assert.equal(getComputedStyle(addCardLink).paddingTop, '10px');
    assert.equal(getComputedStyle(addCardLink).columnGap, '10px');
    assert.equal(getComputedStyle(addCardLink).alignItems, 'center');
    assert.equal(getComputedStyle(addCardIcon).fontSize, '24px');
    assert.equal(getComputedStyle(addCardIcon).fontWeight, '400');
    assert.equal(getComputedStyle(addCardIcon).borderTopStyle, 'none');
    assert.equal(
      getComputedStyle(addCardIcon).backgroundColor,
      'rgba(0, 0, 0, 0)'
    );
    assert.equal(
      getComputedStyle(unselectedRow).backgroundColor,
      getComputedStyle(addCardLink).backgroundColor
    );
    assert.equal(
      getComputedStyle(unselectedRow).borderRadius,
      getComputedStyle(addCardLink).borderRadius
    );
    assert.equal(
      getComputedStyle(unselectedRow).paddingTop,
      getComputedStyle(addCardLink).paddingTop
    );
    assert.equal(
      getComputedStyle(unselectedRow).paddingLeft,
      getComputedStyle(addCardLink).paddingLeft
    );
    assert.equal(
      getComputedStyle(unselectedRow).columnGap,
      getComputedStyle(addCardLink).columnGap
    );
    assert.equal(getComputedStyle(unselectedRow).alignItems, 'center');
    assert.notExists(
      el.shadowRoot!.querySelector('.source-action-link-subtitle')
    );
    assert.exists(addCardLink.querySelector('.source-action-link-chevron'));
    assert.exists(
      el.shadowRoot!.querySelector(
        '[data-action="add-bank-account"] .source-action-link-chevron'
      )
    );
    assert.notExists(
      el.shadowRoot!.querySelector('[data-action="confirm-payment-source"]')
    );
  });

  test('clicking an under-review saved source row does not start verification', async () => {
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

    rows[1].click();
    await flushElement(el);

    assert.equal(rows[1].tagName, 'DIV');
    assert.equal(rows[1].dataset.action, undefined);
    assert.equal(
      el.shadowRoot!.querySelector('.widget-title')?.textContent?.trim(),
      'Pay with'
    );
    assert.lengthOf(requests, 0);
  });

  test('clicking a declined saved source row leaves it inert with a cannot-use badge', async () => {
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
          name: 'Travel card',
          verificationInfo: {status: 'DECLINED'},
          card: {
            network: 'Visa',
            cardNumber: '4111111111114242',
          },
        },
      ],
    });

    el.shadowRoot!.querySelector<HTMLButtonElement>(
      '.payment-method-row'
    )!.click();
    await flushElement(el);

    assert.equal(
      el.shadowRoot!.querySelector('.widget-title')?.textContent?.trim(),
      'Pay with'
    );
    assert.equal(
      el
        .shadowRoot!.querySelector('.verification-status-badge')
        ?.textContent?.trim(),
      "Can't Use"
    );
    assert.lengthOf(requests, 0);
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
          },
        },
      }
    );

    assert.equal(
      el.shadowRoot!.querySelector('.widget-title')?.textContent?.trim(),
      'Choose payment'
    );
    assert.notExists(el.shadowRoot!.querySelector('.widget-subtitle'));
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
      []
    );
    assert.notExists(
      el.shadowRoot!.querySelector('[data-action="confirm-payment-source"]')
    );
  });

  test('applies widget and payment selection background designConfig colors without shell border', async () => {
    const el = await renderConnect(
      {
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
        ],
      },
      {
        colors: {
          widgetBackground: '#f8fbff',
          border: '#91a7ff',
          paymentMethodBackground: '#fff7ed',
        },
      }
    );

    const shell = el.shadowRoot!.querySelector<HTMLElement>('.widget-shell')!;
    const paymentMethod = el.shadowRoot!.querySelector<HTMLElement>(
      '.payment-method-row'
    )!;
    const addCard = el.shadowRoot!.querySelector<HTMLElement>(
      '[data-action="add-card"]'
    )!;

    assert.equal(
      getComputedStyle(el).getPropertyValue('--chc-widget-background').trim(),
      '#f8fbff'
    );
    assert.equal(
      getComputedStyle(el)
        .getPropertyValue('--chc-payment-method-background')
        .trim(),
      '#fff7ed'
    );
    assert.equal(getComputedStyle(shell).backgroundColor, 'rgb(248, 251, 255)');
    assert.equal(getComputedStyle(shell).borderTopStyle, 'none');
    assert.equal(getComputedStyle(shell).borderRadius, '0px');
    assert.equal(
      getComputedStyle(paymentMethod).borderTopColor,
      'rgb(145, 167, 255)'
    );
    assert.equal(
      getComputedStyle(paymentMethod).backgroundColor,
      'rgb(255, 247, 237)'
    );
    assert.equal(
      getComputedStyle(addCard).backgroundColor,
      'rgb(255, 247, 237)'
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
    assert.exists(el.shadowRoot!.querySelector('.widget-divider'));
    assert.notExists(el.shadowRoot!.querySelector('.empty-state'));
    assert.notExists(el.shadowRoot!.querySelector('.source-action'));
    assert.deepEqual(
      [...el.shadowRoot!.querySelectorAll('.source-action-link-title')].map(
        (item) => item.textContent?.trim()
      ),
      ['Add credit or debit card', 'Add bank account']
    );
    assert.notExists(
      el.shadowRoot!.querySelector('[data-action="confirm-payment-source"]')
    );
  });

  test('shows payment method skeleton rows while refreshing interaction payment sources', async () => {
    const pendingInteraction = deferredResponse();

    window.fetch = async () => pendingInteraction.promise;

    const el = await renderConnect({
      interactionId: 'interaction-payment',
      status: 'PAYMENT_SOURCE_REQUESTED',
    });

    assert.equal(
      el.shadowRoot!.querySelector('.widget-title')?.textContent?.trim(),
      'Pay with'
    );
    assert.exists(el.shadowRoot!.querySelector('.payment-method-skeletons'));
    assert.lengthOf(
      el.shadowRoot!.querySelectorAll('.payment-method-skeleton-row'),
      3
    );
    assert.notExists(el.shadowRoot!.querySelector('.empty-state'));
    assert.notExists(el.shadowRoot!.querySelector('[data-action="add-card"]'));

    pendingInteraction.resolve(
      new Response(
        JSON.stringify({
          interactionId: 'interaction-payment',
          status: 'PAYMENT_SOURCE_REQUESTED',
          paymentSources: [],
        }),
        {status: 200, headers: {'Content-Type': 'application/json'}}
      )
    );
    await waitFor(
      () =>
        el.shadowRoot!.querySelector('.widget-title')?.textContent?.trim() ===
        'Add payment method',
      'empty payment-source state did not render after refresh'
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

  test('opens the add card screen with the SDK v3 compact card-entry layout and header back link', async () => {
    const requests: CapturedRequest[] = [];

    paymentSdkWindow.PaymentSDK = {
      init: (configuration) => {
        void configuration.onEvent({type: 'cancel'});
      },
      destroy: () => undefined,
    };

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

      if (pathname === '/interaction/source/pbb/session') {
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

      return new Response(JSON.stringify({billingAddress: []}), {
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
        },
      ],
    });

    await clickAction(el, 'add-card');

    assert.notInclude(
      requests.map((request) => new URL(request.url).pathname),
      '/customer'
    );
    assert.equal(
      el.shadowRoot!.querySelector('.widget-title')?.textContent?.trim(),
      'Add card'
    );
    assert.notExists(el.shadowRoot!.querySelector('.widget-subtitle'));
    assert.notExists(el.shadowRoot!.querySelector('.widget-close'));
    assert.exists(el.shadowRoot!.querySelector('.widget-divider'));
    assert.deepEqual(
      [
        ...el.shadowRoot!.querySelectorAll<HTMLLabelElement>('.field-label'),
      ].map((label) => label.textContent?.trim()),
      [
        'Card Name',
        'Card number',
        'Expiration',
        'CVC',
        'Full name',
        'Billing address',
        'Country or region',
        'Address',
        'Address line 2',
        'City',
        'State',
        'ZIP code',
      ]
    );
    assert.equal(
      getComputedStyle(
        el.shadowRoot!.querySelector<HTMLElement>('.field-label')!
      ).fontWeight,
      '500'
    );
    assert.exists(el.shadowRoot!.querySelector('#billing-address'));
    assert.deepEqual(
      [
        ...el.shadowRoot!.querySelectorAll<HTMLOptionElement>(
          '#billing-address option'
        ),
      ].map((option) => option.textContent?.trim()),
      ['Add new billing address']
    );
    assert.exists(
      el.shadowRoot!.querySelector<HTMLSelectElement>('#billing-country')
    );
    assert.exists(
      el.shadowRoot!.querySelector<HTMLSelectElement>('#billing-state')
    );
    assert.equal(
      el
        .shadowRoot!.querySelector('#card-label')
        ?.closest('.field')
        ?.classList.contains('field-full'),
      true
    );
    assert.equal(
      el
        .shadowRoot!.querySelector('#card-number')
        ?.closest('.field')
        ?.classList.contains('field-full'),
      true
    );
    assert.equal(
      el
        .shadowRoot!.querySelector('#name-on-card')
        ?.closest('.field')
        ?.classList.contains('field-full'),
      true
    );
    assert.equal(
      el
        .shadowRoot!.querySelector('#expiration-date')
        ?.closest('.field')
        ?.classList.contains('field-full'),
      false
    );
    assert.equal(
      el
        .shadowRoot!.querySelector('#card-cvv')
        ?.closest('.field')
        ?.classList.contains('field-full'),
      false
    );
    const backLink = el.shadowRoot!.querySelector<HTMLButtonElement>(
      '.widget-header-action [data-action="back-to-payment-methods"]'
    );
    assert.equal(backLink?.textContent?.trim(), 'Back');
    assert.equal(backLink?.classList.contains('text-link-button'), true);
    assert.notExists(
      backLink?.closest('.card-form-back-header, .bank-provider-back-header')
    );
    assert.notExists(
      el.shadowRoot!.querySelector('[data-action="use-bank-account-instead"]')
    );
    assert.equal(
      el
        .shadowRoot!.querySelector('[data-action="save-card"]')
        ?.textContent?.trim(),
      'Save card'
    );
  });

  test('card save shows an overlay, preserves typed values, and disables form controls while pending', async () => {
    const pendingBillingAddress = deferredResponse();

    window.fetch = async (input: RequestInfo | URL) => {
      const request = input instanceof Request ? input : new Request(input);

      if (request.url.endsWith('/interaction/source/mask/card')) {
        return new Response(JSON.stringify({value: 'enc-card-1'}), {
          status: 200,
          headers: {'Content-Type': 'application/json'},
        });
      }

      if (request.url.endsWith('/interaction/source/mask/cvv')) {
        return new Response(JSON.stringify({value: 'enc-cvv-1'}), {
          status: 200,
          headers: {'Content-Type': 'application/json'},
        });
      }

      if (request.url.endsWith('/interaction/billing-address')) {
        return pendingBillingAddress.promise;
      }

      if (request.url.endsWith('/interaction/source/card')) {
        return new Response(
          JSON.stringify({
            sourceId: 'card-created-1',
            status: 'VERIFIED',
          }),
          {status: 200, headers: {'Content-Type': 'application/json'}}
        );
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
    await fillNewCardForm(el);
    await blurField(el, 'card-number');
    await blurField(el, 'card-cvv');
    await clickAction(el, 'save-card');

    const saveButton = el.shadowRoot!.querySelector<HTMLButtonElement>(
      '[data-action="save-card"]'
    )!;
    const cardLabel =
      el.shadowRoot!.querySelector<HTMLInputElement>('#card-label')!;
    const cardNumber =
      el.shadowRoot!.querySelector<HTMLInputElement>('#card-number')!;

    assert.equal(
      el.shadowRoot!.querySelector('.widget-shell')?.getAttribute('aria-busy'),
      'true'
    );
    assert.equal(
      el
        .shadowRoot!.querySelector('.widget-loading-title')
        ?.textContent?.trim(),
      'Saving card'
    );
    assert.include(
      el.shadowRoot!.querySelector('.widget-loading-helper')?.textContent ?? '',
      'Securely saving'
    );
    assert.equal(saveButton.disabled, true);
    assert.exists(saveButton.querySelector('.button-spinner'));
    assert.equal(cardLabel.value, 'Ada corporate card');
    assert.equal(cardNumber.value, '4111 1111 1111 1111');
    assert.equal(cardLabel.disabled, true);
    assert.equal(cardNumber.disabled, true);

    pendingBillingAddress.resolve(
      new Response(JSON.stringify({value: 'billing-from-api-1'}), {
        status: 200,
        headers: {'Content-Type': 'application/json'},
      })
    );
    await waitFor(
      () =>
        el.shadowRoot!.querySelector('.widget-title')?.textContent?.trim() ===
        'Payment method saved',
      'card save did not complete'
    );
  });

  test('Connect your bank shows Connect another way under the provider and opens manual bank account entry', async () => {
    let initConfig: TestPaymentSdkInitConfiguration | undefined;

    paymentSdkWindow.PaymentSDK = {
      init: (configuration) => {
        initConfig = configuration;
      },
      destroy: () => undefined,
    };
    window.fetch = async (input: RequestInfo | URL) => {
      const request = input instanceof Request ? input : new Request(input);
      const pathname = new URL(request.url).pathname;

      if (pathname === '/interaction/source/pbb/session') {
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

      return new Response(JSON.stringify({}), {
        status: 200,
        headers: {'Content-Type': 'application/json'},
      });
    };

    const el = await renderConnect({
      interactionId: 'interaction-payment',
      status: 'PAYMENT_SOURCE_REQUESTED',
      allowedTenderTypes: ['BANK_ACCOUNT'],
      paymentSources: [],
    });

    assert.notExists(
      el.shadowRoot!.querySelector('[data-action="add-ach-manually"]')
    );

    await clickAction(el, 'add-bank-account');
    await waitFor(() => Boolean(initConfig), 'PaymentSDK.init was not called');
    await flushElement(el);

    assert.equal(
      el.shadowRoot!.querySelector('.widget-title')?.textContent?.trim(),
      'Connect your bank'
    );
    assert.exists(el.shadowRoot!.querySelector('#commerce-hub-pbb-provider'));
    assert.equal(
      el
        .shadowRoot!.querySelector('[data-action="add-ach-manually"]')
        ?.textContent?.trim(),
      'Connect another way'
    );

    await clickAction(el, 'add-ach-manually');

    assert.equal(
      el.shadowRoot!.querySelector('.widget-title')?.textContent?.trim(),
      'Enter bank details'
    );
    assert.exists(el.shadowRoot!.querySelector('#ach-routing-number'));
    assert.exists(el.shadowRoot!.querySelector('#ach-account-number'));
    assert.exists(el.shadowRoot!.querySelector('#ach-account-number-confirm'));
    assert.notExists(el.shadowRoot!.querySelector('#ach-label'));
    assert.notExists(el.shadowRoot!.querySelector('#ach-account-type'));
    assert.equal(
      el
        .shadowRoot!.querySelector('[data-action="save-ach-manual"]')
        ?.textContent?.trim(),
      'Save bank account'
    );
    assert.notExists(
      el.shadowRoot!.querySelector('#commerce-hub-pbb-provider')
    );
  });

  test('manual ACH save enables only after valid encrypted values, masks the screen values, and shows verification outcome', async () => {
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
      const pathname = new URL(request.url).pathname;
      const bodyText = await request.clone().text();

      requests.push({
        url: request.url,
        method: request.method,
        headers: new Headers(request.headers),
        bodyText,
        credentials: request.credentials,
      });

      if (pathname === '/interaction/source/pbb/session') {
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

      if (pathname === '/interaction/source/mask/rt') {
        return new Response(JSON.stringify({value: 'enc-routing-1'}), {
          status: 200,
          headers: {'Content-Type': 'application/json'},
        });
      }

      if (pathname === '/interaction/source/mask/bn') {
        return new Response(
          JSON.stringify({
            value:
              JSON.parse(bodyText).value === '123456789'
                ? 'enc-account-1'
                : 'enc-account-confirm-1',
          }),
          {status: 200, headers: {'Content-Type': 'application/json'}}
        );
      }

      return new Response(
        JSON.stringify({
          sourceId: 'bank-manual-1',
          status: 'UNDER_REVIEW',
        }),
        {status: 200, headers: {'Content-Type': 'application/json'}}
      );
    };

    const el = await renderConnect({
      interactionId: 'interaction-payment',
      status: 'PAYMENT_SOURCE_REQUESTED',
      allowedTenderTypes: ['BANK_ACCOUNT'],
      paymentSources: [],
    });

    await clickAction(el, 'add-bank-account');
    await waitFor(() => Boolean(initConfig), 'PaymentSDK.init was not called');
    await flushElement(el);
    await clickAction(el, 'add-ach-manually');
    assert.isTrue(
      el.shadowRoot!.querySelector<HTMLButtonElement>(
        '[data-action="save-ach-manual"]'
      )?.disabled
    );
    assert.equal(
      el.shadowRoot!.querySelector<HTMLInputElement>('#ach-account-number')
        ?.type,
      'password'
    );
    assert.equal(
      el.shadowRoot!.querySelector<HTMLInputElement>(
        '#ach-account-number-confirm'
      )?.type,
      'password'
    );

    await setFieldValue(el, 'ach-routing-number', '021000021');
    assert.isTrue(
      el.shadowRoot!.querySelector<HTMLButtonElement>(
        '[data-action="save-ach-manual"]'
      )?.disabled
    );

    await setFieldValue(el, 'ach-account-number', '123456789');
    await setFieldValue(el, 'ach-account-number-confirm', '123456789');
    assert.isTrue(
      el.shadowRoot!.querySelector<HTMLButtonElement>(
        '[data-action="save-ach-manual"]'
      )?.disabled
    );

    await blurField(el, 'ach-routing-number');
    await blurField(el, 'ach-account-number');
    await blurField(el, 'ach-account-number-confirm');
    await waitForRequest(requests, '/interaction/source/mask/rt');
    await waitFor(
      () =>
        requests.filter(
          (request) =>
            new URL(request.url).pathname === '/interaction/source/mask/bn'
        ).length === 2,
      'both bank account number mask requests were not sent'
    );

    assert.equal(
      el.shadowRoot!.querySelector<HTMLInputElement>('#ach-routing-number')
        ?.value,
      '•••••0021'
    );
    assert.equal(
      el.shadowRoot!.querySelector<HTMLInputElement>('#ach-account-number')
        ?.value,
      '•••••6789'
    );
    assert.equal(
      el.shadowRoot!.querySelector<HTMLInputElement>('#ach-account-number')
        ?.type,
      'text'
    );
    assert.equal(
      el.shadowRoot!.querySelector<HTMLInputElement>(
        '#ach-account-number-confirm'
      )?.value,
      '•••••6789'
    );
    assert.equal(
      el.shadowRoot!.querySelector<HTMLInputElement>(
        '#ach-account-number-confirm'
      )?.type,
      'text'
    );

    const requestsAfterMask = requests.length;
    el
      .shadowRoot!.querySelector<HTMLInputElement>('#ach-account-number')!
      .dispatchEvent(new FocusEvent('focus', {bubbles: true}));
    await blurField(el, 'ach-account-number');
    el
      .shadowRoot!.querySelector<HTMLInputElement>(
        '#ach-account-number-confirm'
      )!
      .dispatchEvent(new FocusEvent('focus', {bubbles: true}));
    await blurField(el, 'ach-account-number-confirm');

    assert.lengthOf(requests, requestsAfterMask);
    assert.equal(
      el.shadowRoot!.querySelector<HTMLInputElement>('#ach-account-number')
        ?.value,
      '•••••6789'
    );
    assert.equal(
      el.shadowRoot!.querySelector<HTMLInputElement>(
        '#ach-account-number-confirm'
      )?.value,
      '•••••6789'
    );
    assert.isFalse(
      el.shadowRoot!.querySelector<HTMLButtonElement>(
        '[data-action="save-ach-manual"]'
      )?.disabled
    );

    await clickAction(el, 'save-ach-manual');
    await waitFor(
      () =>
        el.shadowRoot!.querySelector('.widget-title')?.textContent?.trim() ===
        'Bank account pending review',
      'manual ACH outcome was not shown'
    );

    assert.deepEqual(
      requests.map(
        (request) => `${request.method} ${new URL(request.url).pathname}`
      ),
      [
        'GET /interaction/source/pbb/session',
        'POST /interaction/source/mask/rt',
        'POST /interaction/source/mask/bn',
        'POST /interaction/source/mask/bn',
        'POST /interaction/source/ach',
      ]
    );
    assert.equal(
      requests[4].headers.get('x-interaction-id'),
      'interaction-payment'
    );
    assert.equal(requests[4].credentials, 'include');
    assert.deepEqual(
      requests
        .filter((request) =>
          new URL(request.url).pathname.startsWith('/interaction/source/mask/')
        )
        .map((request) => JSON.parse(request.bodyText)),
      [{value: '021000021'}, {value: '123456789'}, {value: '123456789'}]
    );
    assert.deepEqual(JSON.parse(requests[4].bodyText), {
      id: '',
      tenderType: 'BANK_ACCOUNT',
      bankAccount: {
        routingNumber: 'enc-routing-1',
        accountNumber: 'enc-account-1',
        accountNumberReEntered: 'enc-account-1',
        routingNumberEncrypted: 'enc-routing-1',
        accountNumberEncrypted: 'enc-account-1',
      },
    });
    assert.equal(
      el.interactionResponse?.paymentSources?.[0]?.verificationInfo?.status,
      'UNDER_REVIEW'
    );
  });

  test('manual ACH shows an account mismatch error and does not save', async () => {
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
      const pathname = new URL(request.url).pathname;
      const bodyText = await request.clone().text();

      requests.push({
        url: request.url,
        method: request.method,
        headers: new Headers(request.headers),
        bodyText,
        credentials: request.credentials,
      });

      if (pathname === '/interaction/source/pbb/session') {
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

      if (pathname === '/interaction/source/mask/rt') {
        return new Response(JSON.stringify({value: 'enc-routing-1'}), {
          status: 200,
          headers: {'Content-Type': 'application/json'},
        });
      }

      if (pathname === '/interaction/source/mask/bn') {
        return new Response(JSON.stringify({value: 'enc-account-1'}), {
          status: 200,
          headers: {'Content-Type': 'application/json'},
        });
      }

      return new Response(
        JSON.stringify({
          sourceId: 'bank-manual-1',
          status: 'UNDER_REVIEW',
        }),
        {status: 200, headers: {'Content-Type': 'application/json'}}
      );
    };

    const el = await renderConnect({
      interactionId: 'interaction-payment',
      status: 'PAYMENT_SOURCE_REQUESTED',
      allowedTenderTypes: ['BANK_ACCOUNT'],
      paymentSources: [],
    });

    await clickAction(el, 'add-bank-account');
    await waitFor(() => Boolean(initConfig), 'PaymentSDK.init was not called');
    await flushElement(el);
    await clickAction(el, 'add-ach-manually');

    await setFieldValue(el, 'ach-routing-number', '021000021');
    await setFieldValue(el, 'ach-account-number', '123456789');
    await setFieldValue(el, 'ach-account-number-confirm', '987654321');

    assert.include(
      el.shadowRoot!.textContent,
      'Account numbers must match.'
    );
    assert.isTrue(
      el.shadowRoot!.querySelector<HTMLButtonElement>(
        '[data-action="save-ach-manual"]'
      )?.disabled
    );

    await blurField(el, 'ach-routing-number');
    await blurField(el, 'ach-account-number');
    await blurField(el, 'ach-account-number-confirm');
    await waitForRequest(requests, '/interaction/source/mask/rt');
    await waitFor(
      () =>
        requests.filter(
          (request) =>
            new URL(request.url).pathname === '/interaction/source/mask/bn'
        ).length === 2,
      'both bank account number mask requests were not sent'
    );
    await flushElement(el);

    assert.isTrue(
      el.shadowRoot!.querySelector<HTMLButtonElement>(
        '[data-action="save-ach-manual"]'
      )?.disabled
    );
    await clickAction(el, 'save-ach-manual');

    assert.notInclude(
      requests.map((request) => new URL(request.url).pathname),
      '/interaction/source/ach'
    );
  });

  test('manual ACH shows a routing number error until nine digits are entered', async () => {
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
      const pathname = new URL(request.url).pathname;
      const bodyText = await request.clone().text();

      requests.push({
        url: request.url,
        method: request.method,
        headers: new Headers(request.headers),
        bodyText,
        credentials: request.credentials,
      });

      if (pathname === '/interaction/source/pbb/session') {
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

      if (pathname === '/interaction/source/mask/bn') {
        return new Response(JSON.stringify({value: 'enc-account-1'}), {
          status: 200,
          headers: {'Content-Type': 'application/json'},
        });
      }

      return new Response(
        JSON.stringify({
          sourceId: 'bank-manual-1',
          status: 'UNDER_REVIEW',
        }),
        {status: 200, headers: {'Content-Type': 'application/json'}}
      );
    };

    const el = await renderConnect({
      interactionId: 'interaction-payment',
      status: 'PAYMENT_SOURCE_REQUESTED',
      allowedTenderTypes: ['BANK_ACCOUNT'],
      paymentSources: [],
    });

    await clickAction(el, 'add-bank-account');
    await waitFor(() => Boolean(initConfig), 'PaymentSDK.init was not called');
    await flushElement(el);
    await clickAction(el, 'add-ach-manually');

    await setFieldValue(el, 'ach-routing-number', '02100002');
    await setFieldValue(el, 'ach-account-number', '123456789');
    await setFieldValue(el, 'ach-account-number-confirm', '123456789');

    assert.include(
      el.shadowRoot!.textContent,
      'Enter a 9-digit routing number.'
    );
    assert.isTrue(
      el.shadowRoot!.querySelector<HTMLButtonElement>(
        '[data-action="save-ach-manual"]'
      )?.disabled
    );

    await clickAction(el, 'save-ach-manual');

    assert.notInclude(
      requests.map((request) => new URL(request.url).pathname),
      '/interaction/source/ach'
    );
  });

  test('card save opens required-info when the created card requires verification info', async () => {
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

      if (pathname === '/interaction/source/mask/card') {
        return new Response(JSON.stringify({value: 'enc-card-1'}), {
          status: 200,
          headers: {'Content-Type': 'application/json'},
        });
      }

      if (pathname === '/interaction/source/mask/cvv') {
        return new Response(JSON.stringify({value: 'enc-cvv-1'}), {
          status: 200,
          headers: {'Content-Type': 'application/json'},
        });
      }

      if (pathname === '/interaction/billing-address') {
        return new Response(JSON.stringify({value: 'billing-from-api-1'}), {
          status: 200,
          headers: {'Content-Type': 'application/json'},
        });
      }

      if (pathname === '/interaction/source/card') {
        return new Response(
          JSON.stringify({
            sourceId: 'card-created-1',
            status: 'REQUIRE_INFO',
            docs: [
              {docType: 'DRIVER_LICENSE_PHOTO', mandatory: true},
              {docType: 'DRIVER_LICENSE_NUMBER', mandatory: false},
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
      status: 'PAYMENT_SOURCE_REQUESTED',
      paymentSources: [],
    });

    await clickAction(el, 'add-card');
    await fillNewCardForm(el);
    await blurField(el, 'card-number');
    await blurField(el, 'card-cvv');
    await clickAction(el, 'save-card');
    await waitFor(
      () =>
        el.shadowRoot!.querySelector('.widget-title')?.textContent?.trim() ===
        'Complete account verification',
      'card required-info screen was not shown'
    );

    assert.deepEqual(
      requests.map(
        (request) => `${request.method} ${new URL(request.url).pathname}`
      ),
      [
        'POST /interaction/source/mask/card',
        'POST /interaction/source/mask/cvv',
        'POST /interaction/billing-address',
        'POST /interaction/source/card',
      ]
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
        ['number', '•••• •••• •••• 1111'],
        ['expiry', '04/30'],
      ]
    );
    assert.equal(
      el
        .shadowRoot!.querySelector('.required-info-card-status')
        ?.textContent?.trim(),
      'Need More Information'
    );
    assert.equal(
      el.interactionResponse?.paymentSources?.[0]?.verificationInfo?.status,
      'REQUIRE_INFO'
    );
    assert.isUndefined(el.interactionResponse?.selectedSource);
  });

  test('card save shows an under-review outcome when the created card is under review', async () => {
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

      if (pathname === '/interaction/source/mask/card') {
        return new Response(JSON.stringify({value: 'enc-card-1'}), {
          status: 200,
          headers: {'Content-Type': 'application/json'},
        });
      }

      if (pathname === '/interaction/source/mask/cvv') {
        return new Response(JSON.stringify({value: 'enc-cvv-1'}), {
          status: 200,
          headers: {'Content-Type': 'application/json'},
        });
      }

      if (pathname === '/interaction/billing-address') {
        return new Response(JSON.stringify({value: 'billing-from-api-1'}), {
          status: 200,
          headers: {'Content-Type': 'application/json'},
        });
      }

      if (pathname === '/interaction/source/card') {
        return new Response(
          JSON.stringify({
            sourceId: 'card-created-1',
            status: 'UNDER_REVIEW',
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
      paymentSources: [],
    });

    await clickAction(el, 'add-card');
    await fillNewCardForm(el);
    await blurField(el, 'card-number');
    await blurField(el, 'card-cvv');
    await clickAction(el, 'save-card');
    await waitFor(
      () =>
        el.shadowRoot!.querySelector('.widget-title')?.textContent?.trim() ===
        'Verification pending review',
      'card under-review outcome was not shown'
    );

    assert.include(
      el.shadowRoot!.querySelector('.alert-warning')?.textContent?.trim() ?? '',
      'review is complete'
    );
    assert.equal(
      el
        .shadowRoot!.querySelector(
          '.widget-header-action [data-action="done-payment-source-verification"]'
        )
        ?.textContent?.trim(),
      'Back'
    );
    assert.notExists(
      el.shadowRoot!.querySelector(
        '.primitive-footer [data-action="done-payment-source-verification"]'
      )
    );
    assert.equal(
      el.interactionResponse?.paymentSources?.[0]?.verificationInfo?.status,
      'UNDER_REVIEW'
    );
    assert.isUndefined(el.interactionResponse?.selectedSource);
  });

  test('card save shows declined outcome when card creation returns declined verificationStatus', async () => {
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

      if (pathname === '/interaction/source/mask/card') {
        return new Response(JSON.stringify({value: 'enc-card-1'}), {
          status: 200,
          headers: {'Content-Type': 'application/json'},
        });
      }

      if (pathname === '/interaction/source/mask/cvv') {
        return new Response(JSON.stringify({value: 'enc-cvv-1'}), {
          status: 200,
          headers: {'Content-Type': 'application/json'},
        });
      }

      if (pathname === '/interaction/billing-address') {
        return new Response(JSON.stringify({value: 'billing-from-api-1'}), {
          status: 200,
          headers: {'Content-Type': 'application/json'},
        });
      }

      if (pathname === '/interaction/source/card') {
        return new Response(
          JSON.stringify({
            sourceId: 'card-created-1',
            status: 'DECLINED',
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
      paymentSources: [],
    });

    await clickAction(el, 'add-card');
    await fillNewCardForm(el);
    await blurField(el, 'card-number');
    await blurField(el, 'card-cvv');
    await clickAction(el, 'save-card');
    await waitFor(
      () =>
        el.shadowRoot!.querySelector('.widget-title')?.textContent?.trim() ===
        'Payment method declined',
      'card declined outcome was not shown'
    );

    assert.include(
      el.shadowRoot!.querySelector('.alert-danger')?.textContent?.trim() ?? '',
      'could not be verified'
    );
    assert.equal(
      el.interactionResponse?.paymentSources?.[0]?.verificationInfo?.status,
      'DECLINED'
    );
    assert.notInclude(
      requests.map((request) => new URL(request.url).pathname),
      '/interaction/source/card-created-1/attach'
    );
  });

  test('formats card number and expiration inputs for different card standards', async () => {
    window.fetch = async () =>
      new Response(JSON.stringify({billingAddress: []}), {
        status: 200,
        headers: {'Content-Type': 'application/json'},
      });

    const el = await renderConnect({
      interactionId: 'interaction-payment',
      status: 'PAYMENT_SOURCE_REQUESTED',
      paymentSources: [],
    });

    await clickAction(el, 'add-card');
    await setFieldValue(el, 'card-number', '378282246310005');
    await setFieldValue(el, 'expiration-date', '0430');

    assert.equal(
      el.shadowRoot!.querySelector<HTMLInputElement>('#card-number')?.value,
      '3782 822463 10005'
    );
    assert.equal(
      el.shadowRoot!.querySelector<HTMLInputElement>('#expiration-date')?.value,
      '04 / 30'
    );

    await setFieldValue(el, 'card-number', '4000000000000000002');

    assert.equal(
      el.shadowRoot!.querySelector<HTMLInputElement>('#card-number')?.value,
      '4000 0000 0000 0000 002'
    );
  });

  test('renders the card error screen without a widget close button', async () => {
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

      if (request.url.endsWith('/interaction/source/mask/card')) {
        return new Response(JSON.stringify({value: 'enc-card-1'}), {
          status: 200,
          headers: {'Content-Type': 'application/json'},
        });
      }

      if (request.url.endsWith('/interaction/source/mask/cvv')) {
        return new Response(JSON.stringify({value: 'enc-cvv-1'}), {
          status: 200,
          headers: {'Content-Type': 'application/json'},
        });
      }

      if (request.url.endsWith('/interaction/billing-address')) {
        return new Response(JSON.stringify({value: 'billing-from-api-1'}), {
          status: 200,
          headers: {'Content-Type': 'application/json'},
        });
      }

      if (request.url.endsWith('/interaction/source/card')) {
        return new Response(JSON.stringify({message: 'Save failed'}), {
          status: 500,
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
    await setFieldValue(el, 'card-label', 'Ada corporate card');
    await setFieldValue(el, 'name-on-card', 'Ada Lovelace');
    await setFieldValue(el, 'card-number', '4111 1111 1111 1111');
    await setFieldValue(el, 'expiration-date', '04/30');
    await setFieldValue(el, 'card-cvv', '123');
    await setSelectValue(el, 'billing-country', 'US');
    await setFieldValue(el, 'billing-address-line-1', '1 Main St');
    await setFieldValue(el, 'billing-address-line-2', 'Suite 100');
    await setFieldValue(el, 'billing-city', 'New York');
    await setSelectValue(el, 'billing-state', 'NY');
    await setFieldValue(el, 'billing-zip', '10001');
    await blurField(el, 'card-number');
    await waitForRequest(requests, '/interaction/source/mask/card');
    await blurField(el, 'card-cvv');
    await waitForRequest(requests, '/interaction/source/mask/cvv');
    await clickAction(el, 'save-card');
    await waitFor(
      () =>
        el.shadowRoot!.querySelector('.widget-title')?.textContent?.trim() ===
        'Credit card not saved',
      'card error screen did not render'
    );

    assert.notExists(el.shadowRoot!.querySelector('.widget-close'));
    assert.exists(
      el.shadowRoot!.querySelector('[data-action="edit-card-details"]')
    );
    assert.exists(
      el.shadowRoot!.querySelector('[data-action="use-different-method"]')
    );

    await clickAction(el, 'use-different-method');
    await clickAction(el, 'add-bank-account');
    await waitFor(
      () =>
        el.shadowRoot!.querySelector('.widget-title')?.textContent?.trim() ===
        'Add payment method',
      'bank provider failure did not return to payment methods'
    );
    await clickAction(el, 'add-card');
    assert.notInclude(
      requests.map((request) => new URL(request.url).pathname),
      '/customer'
    );
  });

  test('creates a new billing address, creates a verified customer card, attaches it, and shows payment method saved', async () => {
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

      if (request.url.endsWith('/interaction/source/mask/card')) {
        return new Response(JSON.stringify({value: 'enc-card-1'}), {
          status: 200,
          headers: {'Content-Type': 'application/json'},
        });
      }

      if (request.url.endsWith('/interaction/source/mask/cvv')) {
        return new Response(JSON.stringify({value: 'enc-cvv-1'}), {
          status: 200,
          headers: {'Content-Type': 'application/json'},
        });
      }

      if (request.url.endsWith('/interaction/billing-address')) {
        return new Response(JSON.stringify({value: 'billing-from-api-1'}), {
          status: 200,
          headers: {'Content-Type': 'application/json'},
        });
      }

      if (request.url.endsWith('/interaction/source/card')) {
        return new Response(
          JSON.stringify({
            sourceId: 'card-created-1',
            status: 'VERIFIED',
          }),
          {
            status: 200,
            headers: {'Content-Type': 'application/json'},
          }
        );
      }

      if (request.url.endsWith('/interaction/source/card-created-1/attach')) {
        return new Response(
          JSON.stringify({
            interactionId: 'interaction-payment',
            status: 'PAYMENT_SOURCE_ATTACHED',
            selectedSource: {
              id: 'card-created-1',
              tenderType: 'Card',
              name: 'Attached card from source response',
              verificationInfo: {status: 'VERIFIED'},
              card: {
                network: 'Mastercard',
                cardNumber: '5555555555554444',
              },
            },
            paymentSources: [
              {
                id: 'card-created-1',
                tenderType: 'Card',
                name: 'Attached card from source response',
                verificationInfo: {status: 'VERIFIED'},
                card: {
                  network: 'Mastercard',
                  cardNumber: '5555555555554444',
                },
              },
            ],
            billerAddress: [],
          }),
          {
            status: 200,
            headers: {'Content-Type': 'application/json'},
          }
        );
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
    await fillNewCardForm(el);

    await blurField(el, 'card-number');
    await waitForRequest(requests, '/interaction/source/mask/card');
    await blurField(el, 'card-cvv');
    await waitForRequest(requests, '/interaction/source/mask/cvv');
    await clickAction(el, 'save-card');
    await waitFor(
      () =>
        el.interactionResponse?.selectedSource?.id === 'card-created-1' &&
        el.shadowRoot!.querySelector('.widget-title')?.textContent?.trim() ===
          'Payment method saved',
      'verified card did not return to the payment method list'
    );

    assert.deepEqual(
      requests.map(
        (request) => `${request.method} ${new URL(request.url).pathname}`
      ),
      [
        'POST /interaction/source/mask/card',
        'POST /interaction/source/mask/cvv',
        'POST /interaction/billing-address',
        'POST /interaction/source/card',
        'POST /interaction/source/card-created-1/attach',
      ]
    );
    assert.equal(
      requests[0].headers.get('x-interaction-id'),
      'interaction-payment'
    );
    assert.deepEqual(JSON.parse(requests[0].bodyText), {
      value: '4111111111111111',
    });
    assert.deepEqual(JSON.parse(requests[1].bodyText), {value: '123'});

    const addressBody = JSON.parse(requests[2].bodyText);
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

    const sourceBody = JSON.parse(requests[3].bodyText);
    assert.equal(sourceBody.id, '');
    assert.equal(sourceBody.tenderType, 'CARD');
    assert.equal(sourceBody.name, 'Ada corporate card');
    assert.equal(sourceBody.billingAddressId, 'billing-from-api-1');
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
    assert.equal(requests[4].bodyText, '');
    assert.equal(
      requests[4].headers.get('x-interaction-id'),
      'interaction-payment'
    );
    assert.equal(requests[4].credentials, 'include');
    assert.equal(el.interactionResponse?.selectedSource?.id, 'card-created-1');
    assert.equal(el.interactionResponse?.status, 'PAYMENT_SOURCE_ATTACHED');
    const rows = [
      ...el.shadowRoot!.querySelectorAll<HTMLButtonElement>(
        '.payment-method-row'
      ),
    ];

    assert.notExists(
      el.shadowRoot!.querySelector('[data-action="confirm-payment-source"]')
    );
    assert.exists(
      el.shadowRoot!.querySelector('[data-action="change-payment-source"]')
    );
    assert.exists(el.shadowRoot!.querySelector('.selected-payment-method'));
    assert.lengthOf(rows, 0);
    assert.equal(
      el
        .shadowRoot!.querySelector(
          '.selected-payment-method .payment-method-title'
        )
        ?.textContent?.trim(),
      'Attached card from source response'
    );
    assert.equal(
      el
        .shadowRoot!.querySelector(
          '.selected-payment-method .payment-method-meta'
        )
        ?.textContent?.trim(),
      '•••• 4444'
    );
  });

  test('uses an existing billing address when one is selected', async () => {
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

    window.fetch = async (input: RequestInfo | URL) => {
      const request = input instanceof Request ? input : new Request(input);
      requests.push({
        url: request.url,
        method: request.method,
        headers: new Headers(request.headers),
        bodyText: await request.clone().text(),
        credentials: request.credentials,
      });

      if (request.url.endsWith('/interaction')) {
        return new Response(
          JSON.stringify({
            interactionId: 'interaction-payment',
            status: 'PAYMENT_SOURCE_REQUESTED',
            selectedSource,
            paymentSources: [selectedSource],
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
          {
            status: 200,
            headers: {'Content-Type': 'application/json'},
          }
        );
      }

      if (request.url.endsWith('/interaction/source/mask/card')) {
        return new Response(JSON.stringify({value: 'enc-card-1'}), {
          status: 200,
          headers: {'Content-Type': 'application/json'},
        });
      }

      if (request.url.endsWith('/interaction/source/mask/cvv')) {
        return new Response(JSON.stringify({value: 'enc-cvv-1'}), {
          status: 200,
          headers: {'Content-Type': 'application/json'},
        });
      }

      if (request.url.endsWith('/interaction/source/card')) {
        return new Response(
          JSON.stringify({
            sourceId: 'card-created-1',
            status: 'VERIFIED',
          }),
          {
            status: 200,
            headers: {'Content-Type': 'application/json'},
          }
        );
      }

      return new Response('{}', {
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

    const interactionRequestCount = requests.filter(
      (request) =>
        request.method === 'GET' &&
        new URL(request.url).pathname === '/interaction'
    ).length;

    await clickAction(el, 'add-card');
    await waitForRequest(requests, '/interaction', 'GET');
    assert.equal(
      requests.filter(
        (request) =>
          request.method === 'GET' &&
          new URL(request.url).pathname === '/interaction'
      ).length,
      interactionRequestCount + 1
    );
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
    await waitForRequest(requests, '/interaction/source/mask/card');
    await blurField(el, 'card-cvv');
    await waitForRequest(requests, '/interaction/source/mask/cvv');
    await clickAction(el, 'save-card');
    await waitFor(
      () =>
        el.interactionResponse?.selectedSource?.id === 'card-created-1' &&
        el.shadowRoot!.querySelector('.widget-title')?.textContent?.trim() ===
          'Payment method saved',
      'existing-address card did not return to the payment method list'
    );

    assert.notInclude(
      requests.map((request) => new URL(request.url).pathname),
      '/interaction/billing-address'
    );
    assert.include(
      requests.map((request) => new URL(request.url).pathname),
      '/interaction/source/card-created-1/attach'
    );

    const sourceRequest = requests.find(
      (request) => new URL(request.url).pathname === '/interaction/source/card'
    )!;
    const sourceBody = JSON.parse(sourceRequest.bodyText);

    assert.equal(sourceBody.billingAddressId, 'billing-1');
    assert.notExists(
      el.shadowRoot!.querySelector('[data-action="confirm-payment-source"]')
    );
    assert.exists(
      el.shadowRoot!.querySelector('[data-action="change-payment-source"]')
    );
    assert.exists(el.shadowRoot!.querySelector('.selected-payment-method'));
  });

  test('shows the card under-review outcome when card creation returns an under-review source without attaching it', async () => {
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

      if (request.url.endsWith('/interaction/source/mask/card')) {
        return new Response(JSON.stringify({value: 'enc-card-1'}), {
          status: 200,
          headers: {'Content-Type': 'application/json'},
        });
      }

      if (request.url.endsWith('/interaction/source/mask/cvv')) {
        return new Response(JSON.stringify({value: 'enc-cvv-1'}), {
          status: 200,
          headers: {'Content-Type': 'application/json'},
        });
      }

      if (request.url.endsWith('/interaction/billing-address')) {
        return new Response(JSON.stringify({value: 'billing-from-api-1'}), {
          status: 200,
          headers: {'Content-Type': 'application/json'},
        });
      }

      if (request.url.endsWith('/interaction/source/card')) {
        return new Response(
          JSON.stringify({
            sourceId: 'card-created-1',
            status: 'UNDER_REVIEW',
          }),
          {
            status: 200,
            headers: {'Content-Type': 'application/json'},
          }
        );
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
    await fillNewCardForm(el);
    await blurField(el, 'card-number');
    await waitForRequest(requests, '/interaction/source/mask/card');
    await blurField(el, 'card-cvv');
    await waitForRequest(requests, '/interaction/source/mask/cvv');
    await clickAction(el, 'save-card');
    await waitFor(
      () =>
        el.shadowRoot!.querySelector('.widget-title')?.textContent?.trim() ===
        'Verification pending review',
      'under-review card did not render the verification outcome'
    );

    assert.notInclude(
      requests.map((request) => new URL(request.url).pathname),
      '/interaction/source/card-created-1/attach'
    );
    assert.include(
      el.shadowRoot!.querySelector('.alert-warning')?.textContent?.trim() ?? '',
      'review is complete'
    );
    assert.exists(
      el.shadowRoot!.querySelector(
        '[data-action="done-payment-source-verification"]'
      )
    );
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

      if (request.url.endsWith('/interaction/source/mask/card')) {
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
    await setFieldValue(el, 'card-label', 'Ada corporate card');
    await setFieldValue(el, 'name-on-card', 'Ada Lovelace');
    await setFieldValue(el, 'card-number', '4111 1111 1111 1111');
    await setFieldValue(el, 'expiration-date', '04/30');
    await setFieldValue(el, 'card-cvv', '123');
    await setSelectValue(el, 'billing-country', 'US');
    await setFieldValue(el, 'billing-address-line-1', '1 Main St');
    await setFieldValue(el, 'billing-city', 'New York');
    await setSelectValue(el, 'billing-state', 'NY');
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
      [
        'POST /interaction/source/mask/card',
        'POST /interaction/source/mask/cvv',
      ]
    );
  });

  test('verify code posts OTP, email, channel, x-interaction-id, and uses sources from the validate response', async () => {
    const requests: CapturedRequest[] = [];
    const apiResponse: InteractionResponse = {
      interactionId: 'interaction-otp',
      status: 'PAYMENT_SOURCE_REQUESTED',
      paymentSources: [
        {
          tenderType: 'Card',
          id: 'validated-card',
          name: 'Card from validate response',
          card: {
            network: 'Visa',
            cardNumber: '4111111111114242',
          },
        },
      ],
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

    await waitForRequest(requests, '/interaction/otp/validate', 'POST');

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
    assert.deepEqual(
      requests.map(
        (request) => `${request.method} ${new URL(request.url).pathname}`
      ),
      ['POST /interaction/otp/validate']
    );
    assert.equal(
      el.interactionResponse?.paymentSources?.[0]?.id,
      'validated-card'
    );
    assert.equal(
      el.shadowRoot!.querySelector('.widget-title')?.textContent?.trim(),
      'Pay with'
    );
    assert.equal(
      el
        .shadowRoot!.querySelector('.payment-method-title')
        ?.textContent?.trim(),
      'Card from validate response'
    );
    assert.equal(
      el.shadowRoot!.querySelector('.payment-method-meta')?.textContent?.trim(),
      '•••• 4242'
    );
  });

  test('baseURL QA preset routes SDK-managed OTP validation requests to the CommerceHub preset origin', async () => {
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
          status: 'PAYMENT_SOURCE_REQUESTED',
          paymentSources: [],
        }),
        {status: 200, headers: {'Content-Type': 'application/json'}}
      );
    };

    const el = await renderConnect(
      {
        interactionId: 'interaction-otp',
        status: 'OTP_VALIDATION_PENDING',
        email: 'gregory.jablonski@fiserv.com',
      },
      undefined,
      'QA'
    );

    await setOtpValue(el, '123456');
    await clickAction(el, 'verify-otp');

    await waitForRequest(requests, '/interaction/otp/validate', 'POST');

    assert.equal(
      requests[0].url,
      `${COMMERCE_HUB_BASE_URLS.QA}/interaction/otp/validate`
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

  test('custom baseURL routes direct SDK-managed CommerceHub JSON requests to the custom origin', async () => {
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
      undefined,
      'https://custom-commercehub.example.test'
    );

    await clickAction(el, 'add-bank-account');
    await waitFor(() => Boolean(initConfig), 'PaymentSDK.init was not called');

    assert.equal(
      requests[0].url,
      'https://custom-commercehub.example.test/interaction/source/pbb/session'
    );
    assert.equal(
      requests[0].headers.get('x-interaction-id'),
      'interaction-payment'
    );
  });

  test('confirming a selected method refreshes payment info, emits onSuccess, and shows the selected payment review', async () => {
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
        return new Response(
          JSON.stringify({
            interactionId: 'interaction-payment',
            status: 'PAYMENT_SOURCE_ATTACHED',
            selectedSource: refreshedSource,
            paymentSources: [refreshedSource],
            billerAddress: [],
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
      paymentSources: [selectedSource],
    });
    const {successEvents, errorEvents} = recordOutputEvents(el);

    el.shadowRoot!.querySelector<HTMLButtonElement>(
      '.payment-method-row'
    )?.click();
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
      'Enter verification code'
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
    await waitFor(
      () => el.interactionResponse?.status === 'OTP_VALIDATION_FAILED',
      'OTP failure state did not render'
    );

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

  test('OTP verification shows a loading spinner and keeps OTP boxes still while pending', async () => {
    const pendingOtp = deferredResponse();

    window.fetch = async () => pendingOtp.promise;

    const el = await renderConnect({
      interactionId: 'interaction-otp',
      status: 'OTP_VALIDATION_PENDING',
      email: 'gregory.jablonski@fiserv.com',
    });

    await setOtpValue(el, '123456');
    await clickAction(el, 'verify-otp');

    const verifyButton = el.shadowRoot!.querySelector<HTMLButtonElement>(
      '[data-action="verify-otp"]'
    )!;
    const otpInput = el.shadowRoot!.querySelector<HTMLElement>('.otp-input')!;

    assert.equal(verifyButton.disabled, true);
    assert.equal(verifyButton.getAttribute('aria-busy'), 'true');
    assert.exists(verifyButton.querySelector('.button-spinner'));
    assert.equal(verifyButton.textContent?.trim(), 'Verifying...');
    assert.equal(getComputedStyle(otpInput).animationName, 'none');

    pendingOtp.resolve(
      new Response(
        JSON.stringify({
          interactionId: 'interaction-otp',
          status: 'PAYMENT_SOURCE_REQUESTED',
          paymentSources: [],
        }),
        {status: 200, headers: {'Content-Type': 'application/json'}}
      )
    );
    await flushElement(el);
  });

  test('saved payment verification shows an animated overlay for at least two seconds after verify step 1 returns', async () => {
    const timer = captureMinimumOverlayTimer();

    try {
      window.fetch = async (input: RequestInfo | URL) => {
        const request = input instanceof Request ? input : new Request(input);
        const pathname = new URL(request.url).pathname;

        if (pathname === '/interaction/verify/step1') {
          return new Response(
            JSON.stringify({
              status: 'REQUIRE_INFO',
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
            verificationInfo: {status: 'NOT_VERIFIED'},
            bankAccount: {
              bankName: 'Commerce National Bank',
              accountNumber: '9876543210',
            },
          },
        ],
      });

      await clickAction(el, 'verify-payment-source');
      await flushElement(el);

      assert.equal(timer.delay, 2000);
      assert.equal(
        el
          .shadowRoot!.querySelector('.widget-loading-title')
          ?.textContent?.trim(),
        'Verifying payment method'
      );
      assert.exists(el.shadowRoot!.querySelector('.widget-loading-animation'));
      assert.notExists(
        el.shadowRoot!.querySelector('.widget-loading-overlay .loading-spinner')
      );
      assert.equal(
        el.shadowRoot!.querySelector('.widget-title')?.textContent?.trim(),
        'Complete account verification'
      );

      timer.release();
      await flushElement(el);

      assert.notExists(el.shadowRoot!.querySelector('.widget-loading-overlay'));
    } finally {
      timer.restore();
    }
  });

  test('Connect your bank shows a loading frame until PaymentSDK init is ready', async () => {
    const pendingSession = deferredResponse();
    let initConfig: TestPaymentSdkInitConfiguration | undefined;

    paymentSdkWindow.PaymentSDK = {
      init: (configuration) => {
        initConfig = configuration;
      },
      destroy: () => undefined,
    };

    window.fetch = async () => pendingSession.promise;

    const el = await renderConnect({
      interactionId: 'interaction-payment',
      status: 'PAYMENT_SOURCE_REQUESTED',
      paymentSources: [],
    });

    await clickAction(el, 'add-bank-account');

    assert.equal(
      el.shadowRoot!.querySelector('.widget-title')?.textContent?.trim(),
      'Connect your bank'
    );
    assert.equal(
      el
        .shadowRoot!.querySelector('.provider-frame')
        ?.getAttribute('aria-busy'),
      'true'
    );
    assert.equal(
      el
        .shadowRoot!.querySelector('.provider-loading-overlay')
        ?.textContent?.trim(),
      'Connecting to your bank'
    );
    assert.equal(
      el.shadowRoot!.querySelector('.widget-shell')?.getAttribute('aria-busy'),
      'true'
    );
    assert.equal(
      el
        .shadowRoot!.querySelector('.widget-loading-title')
        ?.textContent?.trim(),
      'Connecting to your bank'
    );
    assert.include(
      el.shadowRoot!.querySelector('.widget-loading-helper')?.textContent ?? '',
      'Securely opening'
    );
    assert.equal(
      getComputedStyle(
        el.querySelector<HTMLElement>('#commerce-hub-pbb-provider')!
      ).minHeight,
      '500px'
    );

    pendingSession.resolve(
      new Response(
        JSON.stringify({
          aggregatorSessionId: 'agg-session-1',
          tokenID: 'access-token-1',
          pToken: 'p-token-1',
          publicKey: 'public-key-1',
        }),
        {status: 200, headers: {'Content-Type': 'application/json'}}
      )
    );
    await waitFor(() => Boolean(initConfig), 'PaymentSDK.init was not called');
    await flushElement(el);

    assert.notExists(el.shadowRoot!.querySelector('.provider-loading-overlay'));
    assert.notExists(el.shadowRoot!.querySelector('.widget-loading-overlay'));
    assert.equal(
      el
        .shadowRoot!.querySelector('.provider-frame')
        ?.getAttribute('aria-busy'),
      'false'
    );

    await initConfig!.onEvent({type: 'cancel'});
    await flushElement(el);
  });

  test('add bank account initializes PaymentSDK with a compact Connect your bank handoff', async () => {
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
        colors: {
          widgetBackground: '#fafafa',
          primary: '#123456',
          text: '#1f2937',
          copy: '#4b5563',
          border: '#d1d5db',
          placeholder: '#9ca3af',
          danger: '#dc2626',
          success: '#059669',
        },
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
      'Connect your bank'
    );
    assert.notExists(el.shadowRoot!.querySelector('.widget-shell-wide'));
    assert.notExists(el.shadowRoot!.querySelector('.widget-subtitle'));
    assert.notExists(el.shadowRoot!.querySelector('.provider-frame-header'));
    assert.exists(el.shadowRoot!.querySelector('#commerce-hub-pbb-provider'));
    const backLink = el.shadowRoot!.querySelector<HTMLButtonElement>(
      '.widget-header-action [data-action="back-to-payment-methods"]'
    );
    assert.equal(backLink?.textContent?.trim(), 'Back');
    assert.equal(backLink?.classList.contains('text-link-button'), true);
    assert.notExists(
      backLink?.closest('.card-form-back-header, .bank-provider-back-header')
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
    assert.deepEqual(initConfig?.appearance, {
      branding: {
        backgroundColor: '#fafafa',
        primaryColor: '#123456',
        primaryTextColor: '#1f2937',
        secondaryTextColor: '#4b5563',
        buttonColor: '#123456',
        dangerColor: '#dc2626',
        successColor: '#059669',
        borderColor: '#d1d5db',
        placeholderColor: '#9ca3af',
      },
    });
    assert.exists(providerContainer);
    assert.deepEqual(
      requests.map(
        (request) => `${request.method} ${new URL(request.url).pathname}`
      ),
      ['GET /interaction/source/pbb/session']
    );
    assert.equal(
      requests[0].url,
      `${DEFAULT_COMMERCE_HUB_BASE_URL}/interaction/source/pbb/session`
    );
    assert.equal(
      requests[0].headers.get('x-interaction-id'),
      'interaction-payment'
    );
    assert.equal(requests[0].credentials, 'include');
  });

  test('Connect your bank success verifies the finalized bank source and shows an under-review outcome without events', async () => {
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

      if (pathname === '/interaction/source/pbb/session') {
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

      if (
        pathname === '/interaction/source/pbb/session/agg-session-1/p-token-1'
      ) {
        return new Response(
          JSON.stringify({
            sourceId: 'bank-new',
            status: 'UNDER_REVIEW',
            docs: [{docType: 'BANK_STATEMENT', mandatory: true}],
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
        'GET /interaction/source/pbb/session',
        'PUT /interaction/source/pbb/session/agg-session-1/p-token-1',
      ]
    );
    assert.equal(
      el.shadowRoot!.querySelector('.widget-title')?.textContent?.trim(),
      'Bank account pending review'
    );
    assert.include(
      el.shadowRoot!.querySelector('.alert-warning')?.textContent?.trim() ?? '',
      'review is complete'
    );
    assert.equal(
      el
        .shadowRoot!.querySelector('.verification-status-badge')
        ?.textContent?.trim(),
      'Under review'
    );
    assert.equal(el.interactionResponse?.paymentSources?.[0]?.id, 'bank-new');
    assert.deepEqual(
      el.interactionResponse?.paymentSources?.[0]?.verificationInfo,
      {
        status: 'UNDER_REVIEW',
        docs: [{docType: 'BANK_STATEMENT', mandatory: true}],
      }
    );
    assert.isUndefined(el.interactionResponse?.selectedSource);
    assert.equal(el.interactionResponse?.status, 'PAYMENT_SOURCE_REQUESTED');
    assert.lengthOf(successEvents, 0);
    assert.lengthOf(errorEvents, 0);
  });

  test('Connect your bank success preselects a finalized VERIFIED bank source and shows payment-method-saved summary', async () => {
    const {el, requests, successEvents, errorEvents} =
      await completePayByBankFlow({finalizedStatus: 'VERIFIED'});

    assert.deepEqual(
      requests.map(
        (request) => `${request.method} ${new URL(request.url).pathname}`
      ),
      [
        'GET /interaction/source/pbb/session',
        'PUT /interaction/source/pbb/session/agg-session-1/p-token-1',
        'POST /interaction/source/bank-new/attach',
      ]
    );
    assert.equal(
      el.shadowRoot!.querySelector('.widget-title')?.textContent?.trim(),
      'Payment method saved'
    );
    assert.exists(el.shadowRoot!.querySelector('.selected-payment-method'));
    assert.notExists(el.shadowRoot!.querySelector('.alert-success'));
    assert.notExists(
      el.shadowRoot!.querySelector('[data-action="continue-bank-outcome"]')
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
    assert.equal(
      el
        .shadowRoot!.querySelector(
          '.selected-payment-method .payment-method-title'
        )
        ?.textContent?.trim(),
      'Operating account'
    );
    assert.equal(
      el
        .shadowRoot!.querySelector(
          '.selected-payment-method .payment-method-meta'
        )
        ?.textContent?.trim(),
      '•••• 3210'
    );
    assert.equal(
      el.interactionResponse?.paymentSources?.[0]?.verificationInfo?.status,
      'VERIFIED'
    );
    assert.equal(el.interactionResponse?.selectedSource?.id, 'bank-new');
    assert.equal(el.interactionResponse?.status, 'PAYMENT_SOURCE_ATTACHED');
    assert.lengthOf(successEvents, 1);
    assert.equal(successEvents[0].detail.id, 'bank-new');
    assert.lengthOf(errorEvents, 0);
  });

  test('Connect your bank success shows finalized UNDER_REVIEW bank sources on the pending-review outcome screen', async () => {
    const {el, requests} = await completePayByBankFlow({
      finalizedStatus: 'UNDER_REVIEW',
    });

    assert.deepEqual(
      requests.map(
        (request) => `${request.method} ${new URL(request.url).pathname}`
      ),
      [
        'GET /interaction/source/pbb/session',
        'PUT /interaction/source/pbb/session/agg-session-1/p-token-1',
      ]
    );
    assert.equal(
      el.shadowRoot!.querySelector('.widget-title')?.textContent?.trim(),
      'Bank account pending review'
    );
    assert.include(
      el.shadowRoot!.querySelector('.alert-warning')?.textContent?.trim() ?? '',
      'review is complete'
    );
    assert.equal(
      el
        .shadowRoot!.querySelector('.verification-status-badge')
        ?.textContent?.trim(),
      'Under review'
    );
    assert.equal(
      el
        .shadowRoot!.querySelector('.verification-status-badge')
        ?.classList.contains('verification-status-badge-warning'),
      true
    );
    assert.equal(
      el
        .shadowRoot!.querySelector(
          '.widget-header-action [data-action="done-bank-outcome"]'
        )
        ?.textContent?.trim(),
      'Done'
    );
    assert.notExists(
      el.shadowRoot!.querySelector(
        '.primitive-footer [data-action="done-bank-outcome"]'
      )
    );
    assert.isUndefined(el.interactionResponse?.selectedSource);

    await clickAction(el, 'done-bank-outcome');
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
        el.shadowRoot!.querySelector('.widget-title')?.textContent?.trim() ===
        'Pay with',
      'payment methods list did not render'
    );
  });

  test('Connect your bank success shows finalized REQUIRE_INFO bank sources on the SDK v3 required-info screen', async () => {
    const {el, requests} = await completePayByBankFlow({
      finalizedStatus: 'REQUIRE_INFO',
    });

    assert.deepEqual(
      requests.map(
        (request) => `${request.method} ${new URL(request.url).pathname}`
      ),
      [
        'GET /interaction/source/pbb/session',
        'PUT /interaction/source/pbb/session/agg-session-1/p-token-1',
      ]
    );
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
        ['name', 'Saved bank account'],
        ['number', '•••• ----'],
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
    assert.notExists(el.shadowRoot!.querySelector('.required-document-row'));
    assert.lengthOf(
      el.shadowRoot!.querySelectorAll(
        '.required-info-document.required-document-text-row'
      ),
      2
    );
    assert.deepEqual(
      [...el.shadowRoot!.querySelectorAll('.upload-row-requirements')].map(
        (node) => node.textContent?.trim()
      ),
      ['Bank statement', 'Driver license photo']
    );
    assert.deepEqual(
      [
        ...el.shadowRoot!.querySelectorAll('.required-info-requirement-badge'),
      ].map((node) => node.textContent?.trim()),
      ['Required', 'Optional']
    );
    assert.deepEqual(
      [
        ...el.shadowRoot!.querySelectorAll<HTMLElement>(
          '.required-info-document'
        ),
      ].map((node) => node.dataset.requiredInfoRequirement),
      ['required', 'optional']
    );
    assert.equal(
      el
        .shadowRoot!.querySelector(
          '.primitive-footer [data-action="submit-required-info"]'
        )
        ?.textContent?.trim(),
      'Verify'
    );
    assert.equal(
      el.shadowRoot!.querySelector<HTMLButtonElement>(
        '.primitive-footer [data-action="submit-required-info"]'
      )?.disabled,
      true
    );
    assert.notExists(
      el.shadowRoot!.querySelector('[data-action="use-different-bank-account"]')
    );
    assert.exists(el.shadowRoot!.querySelector('.required-info-file-input'));
    assert.isUndefined(el.interactionResponse?.selectedSource);
  });

  test('Connect your bank REQUIRE_INFO verification response opens the required-info screen and keeps file selection local only', async () => {
    const {el, requests} = await completePayByBankFlow({
      finalizedStatus: 'NOT_VERIFIED',
      verificationStatus: 'REQUIRE_INFO',
    });

    assert.deepEqual(
      requests.map(
        (request) => `${request.method} ${new URL(request.url).pathname}`
      ),
      [
        'GET /interaction/source/pbb/session',
        'PUT /interaction/source/pbb/session/agg-session-1/p-token-1',
      ]
    );
    assert.equal(
      el.shadowRoot!.querySelector('.widget-title')?.textContent?.trim(),
      'Complete account verification'
    );

    const requestCountBeforeFileSelection = requests.length;
    await selectRequiredInfoFile(el, 'may-bank-statement.pdf');

    assert.lengthOf(requests, requestCountBeforeFileSelection);
    assert.equal(
      el
        .shadowRoot!.querySelector('.upload-row-file-name')
        ?.textContent?.trim(),
      'may-bank-statement.pdf'
    );
    assert.deepEqual(
      el.interactionResponse?.paymentSources?.[0]?.verificationInfo,
      {
        status: 'REQUIRE_INFO',
        docs: [{docType: 'BANK_STATEMENT', mandatory: true}],
      }
    );
    assert.isUndefined(el.interactionResponse?.selectedSource);
  });

  test('Connect your bank required-info Verify enables when only optional information is provided', async () => {
    const {el} = await completePayByBankFlow({
      finalizedStatus: 'NOT_VERIFIED',
      verificationStatus: 'REQUIRE_INFO',
      verificationDocs: [
        {docType: 'BANK_STATEMENT', mandatory: true},
        {docType: 'DRIVER_LICENSE_PHOTO', mandatory: false},
      ],
    });
    const verifyButton = el.shadowRoot!.querySelector<HTMLButtonElement>(
      '.primitive-footer [data-action="submit-required-info"]'
    )!;
    const optionalUploadRow = el.shadowRoot!.querySelector<HTMLButtonElement>(
      '[data-required-info-requirement="optional"] .upload-row'
    )!;

    assert.equal(verifyButton.disabled, true);

    optionalUploadRow.click();
    await flushElement(el);
    await selectRequiredInfoFile(el, 'driver-license.pdf');

    assert.equal(verifyButton.disabled, false);
  });

  test('Connect your bank required-info Verify shows an account verification overlay while pending', async () => {
    const pendingUpload = deferredResponse();
    const {el} = await completePayByBankFlow({
      finalizedStatus: 'NOT_VERIFIED',
      verificationStatus: 'REQUIRE_INFO',
      requiredInfoStep2Status: 'VERIFIED',
      requiredInfoUploadResponse: pendingUpload.promise,
    });

    await selectRequiredInfoFile(el, 'may-bank-statement.pdf');
    await clickAction(el, 'submit-required-info');

    assert.equal(
      el.shadowRoot!.querySelector('.widget-shell')?.getAttribute('aria-busy'),
      'true'
    );
    assert.equal(
      el
        .shadowRoot!.querySelector('.widget-loading-title')
        ?.textContent?.trim(),
      'Verifying account'
    );
    assert.include(
      el.shadowRoot!.querySelector('.widget-loading-helper')?.textContent ?? '',
      'Reviewing your verification information'
    );

    pendingUpload.resolve(new Response(undefined, {status: 200}));
    await waitFor(
      () =>
        el.shadowRoot!.querySelector('.widget-title')?.textContent?.trim() ===
        'Payment method saved',
      'verified source was not attached'
    );
  });

  test('required-info verification keeps the animated overlay visible for at least two seconds after verify step 2 returns', async () => {
    const timer = captureMinimumOverlayTimer();

    try {
      const {el} = await completePayByBankFlow({
        finalizedStatus: 'NOT_VERIFIED',
        verificationStatus: 'REQUIRE_INFO',
        requiredInfoStep2Status: 'VERIFIED',
      });

      await selectRequiredInfoFile(el, 'may-bank-statement.pdf');
      await clickAction(el, 'submit-required-info');
      await flushElement(el);

      assert.equal(timer.delay, 2000);
      assert.equal(
        el
          .shadowRoot!.querySelector('.widget-loading-title')
          ?.textContent?.trim(),
        'Verifying account'
      );
      assert.exists(el.shadowRoot!.querySelector('.widget-loading-animation'));
      assert.notExists(
        el.shadowRoot!.querySelector('.widget-loading-overlay .loading-spinner')
      );
      assert.equal(
        el.shadowRoot!.querySelector('.widget-title')?.textContent?.trim(),
        'Payment method saved'
      );

      timer.release();
      await flushElement(el);

      assert.notExists(el.shadowRoot!.querySelector('.widget-loading-overlay'));
    } finally {
      timer.restore();
    }
  });

  test('Connect your bank required-info Verify uploads selected documents, finalizes verification, and attaches verified sources', async () => {
    const {el, requests, successEvents} = await completePayByBankFlow({
      finalizedStatus: 'NOT_VERIFIED',
      verificationStatus: 'REQUIRE_INFO',
      verificationDocs: [
        {docType: 'BANK_STATEMENT', mandatory: true},
        {docType: 'DRIVER_LICENSE_PHOTO', mandatory: false},
      ],
      requiredInfoStep2Status: 'VERIFIED',
      requiredInfoStep2SourceId: 'bank-verified',
    });

    await selectRequiredInfoFile(el, 'may-bank-statement.pdf');
    await clickAction(el, 'submit-required-info');
    await waitForRequest(requests, '/interaction/source/bank-verified/attach');

    assert.deepEqual(
      requests
        .slice(2)
        .map((request) => `${request.method} ${new URL(request.url).pathname}`),
      [
        'POST /interaction/doc/upload/bank-new/BANK_STATEMENT',
        'POST /interaction/verify/step2',
        'POST /interaction/source/bank-verified/attach',
      ]
    );
    assert.include(requests[2].headers.get('content-type') ?? '', 'multipart');
    assert.equal(
      requests[2].headers.get('x-interaction-id'),
      'interaction-payment'
    );
    assert.include(requests[2].bodyText, 'name="file"');
    assert.include(requests[2].bodyText, 'filename="may-bank-statement.pdf"');
    assert.equal(requests[3].bodyText, JSON.stringify({value: 'bank-new'}));
    assert.equal(
      el.interactionResponse?.paymentSources?.[0]?.verificationInfo?.status,
      'VERIFIED'
    );
    assert.equal(el.interactionResponse?.selectedSource?.id, 'bank-verified');
    assert.lengthOf(successEvents, 1);
    assert.equal(successEvents[0].detail.id, 'bank-verified');
  });

  test('Pay by Bank required-info Verify submits required information before optional information', async () => {
    const {el, requests} = await completePayByBankFlow({
      finalizedStatus: 'NOT_VERIFIED',
      verificationStatus: 'REQUIRE_INFO',
      verificationDocs: [
        {docType: 'BANK_STATEMENT', mandatory: true},
        {docType: 'DRIVER_LICENSE_PHOTO', mandatory: false},
      ],
      requiredInfoStep2Responses: [
        {
          status: 'REQUIRE_INFO',
          docs: [
            {docType: 'BANK_STATEMENT', mandatory: true},
            {docType: 'DRIVER_LICENSE_PHOTO', mandatory: false},
          ],
        },
        {status: 'UNDER_REVIEW'},
      ],
    });
    const optionalUploadRow = el.shadowRoot!.querySelector<HTMLButtonElement>(
      '[data-required-info-requirement="optional"] .upload-row'
    )!;

    await selectRequiredInfoFile(el, 'may-bank-statement.pdf');
    optionalUploadRow.click();
    await flushElement(el);
    await selectRequiredInfoFile(el, 'driver-license.pdf');
    await clickAction(el, 'submit-required-info');
    await waitFor(
      () =>
        el.shadowRoot!.querySelector('.widget-title')?.textContent?.trim() ===
        'Bank account pending review',
      'required-info verification did not finish'
    );

    assert.deepEqual(
      requests
        .slice(2)
        .map((request) => `${request.method} ${new URL(request.url).pathname}`),
      [
        'POST /interaction/doc/upload/bank-new/BANK_STATEMENT',
        'POST /interaction/verify/step2',
        'POST /interaction/doc/upload/bank-new/DRIVER_LICENSE_PHOTO',
        'POST /interaction/verify/step2',
      ]
    );
    assert.include(requests[2].bodyText, 'filename="may-bank-statement.pdf"');
    assert.equal(requests[3].bodyText, JSON.stringify({value: 'bank-new'}));
    assert.include(requests[4].bodyText, 'filename="driver-license.pdf"');
    assert.equal(requests[5].bodyText, JSON.stringify({value: 'bank-new'}));
    assert.equal(
      el.interactionResponse?.paymentSources?.[0]?.verificationInfo?.status,
      'UNDER_REVIEW'
    );
  });

  test('Pay by Bank required-info Verify submits text documents through uploadField and shows under-review outcomes', async () => {
    const {el, requests} = await completePayByBankFlow({
      finalizedStatus: 'NOT_VERIFIED',
      verificationStatus: 'REQUIRE_INFO',
      verificationDocs: [
        {docType: 'DRIVER_LICENSE_NUMBER', mandatory: true},
        {docType: 'SOCIAL_SECURITY_NUMBER', mandatory: true},
      ],
      requiredInfoStep2Status: 'UNDER_REVIEW',
    });

    assert.equal(
      el.shadowRoot!.querySelector<HTMLButtonElement>(
        '.primitive-footer [data-action="submit-required-info"]'
      )?.disabled,
      true
    );

    await setRequiredInfoValue(el, 'Driver license number', 'D1234567');
    await setRequiredInfoSsnSegments(el, ['123', '45', '6789']);
    await clickAction(el, 'submit-required-info');
    await waitForRequest(requests, '/interaction/verify/step2');

    assert.deepEqual(
      requests
        .slice(2)
        .map((request) => `${request.method} ${new URL(request.url).pathname}`),
      [
        'POST /interaction/verify/uploadField',
        'POST /interaction/verify/uploadField',
        'POST /interaction/verify/step2',
      ]
    );
    assert.equal(
      requests[2].bodyText,
      JSON.stringify({
        docType: 'DRIVER_LICENSE_NUMBER',
        value: 'bank-new',
        docValue: 'D1234567',
      })
    );
    assert.equal(
      requests[3].bodyText,
      JSON.stringify({
        docType: 'SOCIAL_SECURITY_NUMBER',
        value: 'bank-new',
        docValue: '123456789',
      })
    );
    assert.equal(
      el.shadowRoot!.querySelector('.widget-title')?.textContent?.trim(),
      'Bank account pending review'
    );
    assert.equal(
      el.interactionResponse?.paymentSources?.[0]?.verificationInfo?.status,
      'UNDER_REVIEW'
    );
    assert.isFalse(
      requests.some(
        (request) =>
          new URL(request.url).pathname ===
          '/interaction/source/bank-new/attach'
      )
    );
  });

  test('Connect your bank required-info upload failures stay on the form and show an inline error', async () => {
    const {el, requests} = await completePayByBankFlow({
      finalizedStatus: 'NOT_VERIFIED',
      verificationStatus: 'REQUIRE_INFO',
      requiredInfoStep2Status: 'VERIFIED',
      requiredInfoFailurePath:
        '/interaction/doc/upload/bank-new/BANK_STATEMENT',
    });

    await selectRequiredInfoFile(el, 'may-bank-statement.pdf');
    await clickAction(el, 'submit-required-info');
    await waitFor(
      () => Boolean(el.shadowRoot!.querySelector('.alert-danger')),
      'upload error was not shown'
    );

    assert.equal(
      el.shadowRoot!.querySelector('.widget-title')?.textContent?.trim(),
      'Complete account verification'
    );
    assert.include(
      el.shadowRoot!.querySelector('.alert-danger')?.textContent?.trim() ?? '',
      'Document upload failed'
    );
    assert.deepEqual(
      requests
        .slice(2)
        .map((request) => `${request.method} ${new URL(request.url).pathname}`),
      ['POST /interaction/doc/upload/bank-new/BANK_STATEMENT']
    );
    assert.equal(
      el.interactionResponse?.paymentSources?.[0]?.verificationInfo?.status,
      'REQUIRE_INFO'
    );
    assert.isUndefined(el.interactionResponse?.selectedSource);
  });

  test('Pay by Bank REQUIRE_INFO text documents render as local-only inputs', async () => {
    const {el, requests} = await completePayByBankFlow({
      finalizedStatus: 'NOT_VERIFIED',
      verificationStatus: 'REQUIRE_INFO',
      verificationDocs: [
        {docType: 'DRIVER_LICENSE_NUMBER', mandatory: true},
        {docType: 'SOCIAL_SECURITY_NUMBER', mandatory: true},
      ],
    });
    const requestCountBeforeEntry = requests.length;

    await setRequiredInfoValue(el, 'Driver license number', 'D1234567');
    await setRequiredInfoSsnSegments(el, ['123', '45', '6789']);

    assert.lengthOf(requests, requestCountBeforeEntry);
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
        value: input.value,
      })),
      [
        {
          label: 'Driver license number',
          type: 'text',
          value: 'D1234567',
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
      2
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
        value: input.value,
      })),
      [
        {
          type: 'password',
          inputmode: 'numeric',
          maxlength: '3',
          value: '123',
        },
        {
          type: 'password',
          inputmode: 'numeric',
          maxlength: '2',
          value: '45',
        },
        {
          type: 'password',
          inputmode: 'numeric',
          maxlength: '4',
          value: '6789',
        },
      ]
    );
    assert.deepEqual(
      [...el.shadowRoot!.querySelectorAll('.required-info-ssn-separator')].map(
        (node) => node.textContent?.trim()
      ),
      ['-', '-']
    );

    await pasteRequiredInfoSsnValue(el, '987-65-4321');

    assert.lengthOf(requests, requestCountBeforeEntry);
    assert.deepEqual(
      [
        ...el.shadowRoot!.querySelectorAll<HTMLInputElement>(
          '.required-info-ssn-input'
        ),
      ].map((input) => input.value),
      ['987', '65', '4321']
    );
    assert.notExists(el.shadowRoot!.querySelector('.required-info-file-input'));
    assert.notExists(el.shadowRoot!.querySelector('.upload-row-requirements'));
    assert.deepEqual(
      el.interactionResponse?.paymentSources?.[0]?.verificationInfo,
      {
        status: 'REQUIRE_INFO',
        docs: [
          {docType: 'DRIVER_LICENSE_NUMBER', mandatory: true},
          {docType: 'SOCIAL_SECURITY_NUMBER', mandatory: true},
        ],
      }
    );
    assert.isUndefined(el.interactionResponse?.selectedSource);
  });

  test('Pay by Bank success shows finalized DECLINED bank sources on the declined outcome screen', async () => {
    const {el, requests} = await completePayByBankFlow({
      finalizedStatus: 'DECLINED',
    });

    assert.deepEqual(
      requests.map(
        (request) => `${request.method} ${new URL(request.url).pathname}`
      ),
      [
        'GET /interaction/source/pbb/session',
        'PUT /interaction/source/pbb/session/agg-session-1/p-token-1',
      ]
    );
    assert.equal(
      el.shadowRoot!.querySelector('.widget-title')?.textContent?.trim(),
      'Bank account verification failed'
    );
    assert.include(
      el.shadowRoot!.querySelector('.alert-danger')?.textContent?.trim() ?? '',
      'could not be verified'
    );
    assert.equal(
      el
        .shadowRoot!.querySelector('.verification-status-badge')
        ?.textContent?.trim(),
      "Can't Use"
    );
    assert.equal(
      el
        .shadowRoot!.querySelector(
          '.widget-header-action [data-action="done-bank-outcome"]'
        )
        ?.textContent?.trim(),
      'Done'
    );
    assert.notExists(
      el.shadowRoot!.querySelector('[data-action="retry-bank-provider"]')
    );
    assert.notExists(
      el.shadowRoot!.querySelector('[data-action="use-different-bank-account"]')
    );
    assert.isUndefined(el.interactionResponse?.selectedSource);

    await clickAction(el, 'done-bank-outcome');
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
        el.shadowRoot!.querySelector('.widget-title')?.textContent?.trim() ===
        'Pay with',
      'payment methods list did not render'
    );

    assert.exists(el.shadowRoot!.querySelector('.payment-method-row'));
    assert.deepEqual(
      requests.map(
        (request) => `${request.method} ${new URL(request.url).pathname}`
      ),
      [
        'GET /interaction/source/pbb/session',
        'PUT /interaction/source/pbb/session/agg-session-1/p-token-1',
        'GET /interaction',
      ]
    );
  });

  test('Pay by Bank VERIFIED verification response preselects sourceId and attaches it', async () => {
    const {el, requests} = await completePayByBankFlow({
      finalizedStatus: 'NOT_VERIFIED',
      verificationStatus: 'VERIFIED',
      verificationSourceId: 'bank-verified',
    });

    assert.deepEqual(
      requests.map(
        (request) => `${request.method} ${new URL(request.url).pathname}`
      ),
      [
        'GET /interaction/source/pbb/session',
        'PUT /interaction/source/pbb/session/agg-session-1/p-token-1',
        'POST /interaction/source/bank-verified/attach',
      ]
    );
    assert.equal(
      el.shadowRoot!.querySelector('.widget-title')?.textContent?.trim(),
      'Payment method saved'
    );
    assert.exists(el.shadowRoot!.querySelector('.selected-payment-method'));
    assert.notExists(
      el.shadowRoot!.querySelector('[data-action="continue-bank-outcome"]')
    );
    assert.deepEqual(
      el.interactionResponse?.paymentSources?.[0]?.verificationInfo,
      {
        status: 'VERIFIED',
        docs: [{docType: 'BANK_STATEMENT', mandatory: true}],
      }
    );
    assert.equal(el.interactionResponse?.selectedSource?.id, 'bank-verified');
    assert.equal(el.interactionResponse?.status, 'PAYMENT_SOURCE_ATTACHED');
  });

  test('Pay by Bank success with no finalized bank source returns to payment methods', async () => {
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

      if (pathname === '/interaction/source/pbb/session') {
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

      if (
        pathname === '/interaction/source/pbb/session/agg-session-1/p-token-1'
      ) {
        return new Response(
          JSON.stringify({
            selectedSource: {
              id: 'card-new',
              tenderType: 'Card',
            },
          }),
          {status: 200, headers: {'Content-Type': 'application/json'}}
        );
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

    await clickAction(el, 'add-bank-account');
    await waitFor(() => Boolean(initConfig), 'PaymentSDK.init was not called');
    await initConfig!.onEvent({type: 'success'});
    await flushElement(el);

    assert.equal(
      el.shadowRoot!.querySelector('.widget-title')?.textContent?.trim(),
      'Add payment method'
    );
    assert.notExists(
      el.shadowRoot!.querySelector('[data-action="retry-bank-provider"]')
    );
    assert.notInclude(
      requests.map(
        (request) => `${request.method} ${new URL(request.url).pathname}`
      ),
      'POST /interaction/verify/step1'
    );
  });

  test('Pay by Bank success with no finalized bank source id returns to payment methods', async () => {
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

      if (pathname === '/interaction/source/pbb/session') {
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

      if (
        pathname === '/interaction/source/pbb/session/agg-session-1/p-token-1'
      ) {
        return new Response(
          JSON.stringify({
            selectedSource: {
              tenderType: 'BankAccount',
              bankAccount: {
                bankName: 'No Id Bank',
                accountNumber: '0000111122223333',
              },
            },
          }),
          {status: 200, headers: {'Content-Type': 'application/json'}}
        );
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

    await clickAction(el, 'add-bank-account');
    await waitFor(() => Boolean(initConfig), 'PaymentSDK.init was not called');
    await initConfig!.onEvent({type: 'success'});
    await flushElement(el);

    assert.equal(
      el.shadowRoot!.querySelector('.widget-title')?.textContent?.trim(),
      'Add payment method'
    );
    assert.notExists(
      el.shadowRoot!.querySelector('[data-action="retry-bank-provider"]')
    );
    assert.notInclude(
      requests.map(
        (request) => `${request.method} ${new URL(request.url).pathname}`
      ),
      'POST /interaction/verify/step1'
    );
  });

  test('Pay by Bank terminal events return to refreshed payment methods', async () => {
    for (const terminalType of ['failure', 'cancel', 'error']) {
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
              interactionId: `interaction-${terminalType}`,
              status: 'PAYMENT_SOURCE_REQUESTED',
              paymentSources: [
                {
                  tenderType: 'Card',
                  id: 'card-1',
                  name: 'Refreshed card',
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
        'Pay with',
        terminalType
      );
      assert.equal(
        el
          .shadowRoot!.querySelector('.payment-method-title')
          ?.textContent?.trim(),
        'Refreshed card',
        terminalType
      );
      assert.deepEqual(
        requests.map(
          (request) => `${request.method} ${new URL(request.url).pathname}`
        ),
        ['GET /interaction/source/pbb/session', 'GET /interaction'],
        terminalType
      );
      assert.notExists(
        el.shadowRoot!.querySelector('[data-action="retry-bank-provider"]')
      );
    }
  });

  test('Pay by Bank script load failure and incomplete session return to payment methods', async () => {
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
    const paymentSdkScriptSelector =
      'script[data-commerce-hub-pay-by-bank-sdk="true"]';

    await waitFor(
      () => Boolean(document.querySelector(paymentSdkScriptSelector)),
      'PaymentSDK script was not added'
    );
    const script = document.querySelector<HTMLScriptElement>(
      paymentSdkScriptSelector
    );

    assert.exists(script);
    script!.dispatchEvent(new Event('error'));
    await flushElement(scriptFailureEl);

    assert.equal(
      scriptFailureEl
        .shadowRoot!.querySelector('.widget-title')
        ?.textContent?.trim(),
      'Add payment method'
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
      'Add payment method'
    );
  });

  test('Pay by Bank terminal failure returns to payment methods and allows starting again', async () => {
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

    window.fetch = async () => {
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

    assert.equal(
      el.shadowRoot!.querySelector('.widget-title')?.textContent?.trim(),
      'Add payment method'
    );
    assert.notExists(
      el.shadowRoot!.querySelector('[data-action="retry-bank-provider"]')
    );

    await clickAction(el, 'add-bank-account');
    await waitFor(
      () => initCount === 2,
      'PaymentSDK.init was not called again'
    );

    assert.isAtLeast(destroyCount, 2);

    await initConfig!.onEvent({type: 'cancel'});
    await flushElement(el);

    assert.equal(
      el.shadowRoot!.querySelector('.widget-title')?.textContent?.trim(),
      'Add payment method'
    );
  });
});
