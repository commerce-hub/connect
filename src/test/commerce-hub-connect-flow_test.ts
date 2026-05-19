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
  verificationDocs = [{docType: 'BANK_STATEMENT', mandatory: true}] as const,
}: {
  finalizedStatus: VerificationStatus;
  verificationStatus?: VerificationStatus;
  verificationDocs?: NonNullable<
    NonNullable<PaymentSource['verificationInfo']>['docs']
  >;
}) => {
  const requests: CapturedRequest[] = [];
  let initConfig: TestPaymentSdkInitConfiguration | undefined;
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
  const finalizedVerificationInfo =
    finalizedStatus === 'REQUIRE_INFO'
      ? resolvedVerificationInfo
      : {status: finalizedStatus};

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
            id: 'bank-new',
            tenderType: 'BankAccount',
            name: 'Operating account',
            verificationInfo: finalizedVerificationInfo,
            bankAccount: {
              bankName: 'Commerce National Bank',
              accountNumber: '9876543210',
            },
          },
        }),
        {status: 200, headers: {'Content-Type': 'application/json'}}
      );
    }

    if (pathname === '/interaction/verify/step1' && verificationStatus) {
      return new Response(
        JSON.stringify({
          status: verificationStatus,
          docs: verificationDocs,
        }),
        {status: 200, headers: {'Content-Type': 'application/json'}}
      );
    }

    if (pathname === '/interaction/source/bank-new/attach') {
      return new Response(
        JSON.stringify({
          interactionId: 'interaction-payment',
          status: 'PAYMENT_SOURCE_ATTACHED',
          selectedSource: {
            id: 'bank-new',
            tenderType: 'BankAccount',
            name: 'Operating account',
            verificationInfo: resolvedVerificationInfo,
            bankAccount: {
              bankName: 'Commerce National Bank',
              accountNumber: '9876543210',
            },
          },
          paymentSources: [
            {
              id: 'bank-new',
              tenderType: 'BankAccount',
              name: 'Operating account',
              verificationInfo: resolvedVerificationInfo,
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

  test('renders payment methods with left icons, trailing status icons, and utility add rows', async () => {
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
      ...el.shadowRoot!.querySelectorAll<HTMLButtonElement>(
        '.payment-method-row'
      ),
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
    assert.equal(rows[1].dataset.action, 'verify-payment-source');
    assert.equal(rows[2].dataset.action, 'verify-payment-source');
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
      'Visa •••• 4242'
    );
    assert.notExists(rows[0].querySelector('.payment-method-status'));
    assert.notExists(rows[0].querySelector('.verification-status-badge'));
    assert.exists(rows[0].querySelector('[data-payment-method-icon="visa"]'));
    assert.notExists(rows[0].querySelector('.payment-method-status-icon'));
    assert.notExists(rows[0].querySelector('.payment-method-chevron'));
    assert.equal(
      rows[1].querySelector('.payment-method-title')?.textContent?.trim(),
      'Operating account'
    );
    assert.equal(
      rows[1].querySelector('.payment-method-meta')?.textContent?.trim(),
      'Commerce National Bank •••• 3210'
    );
    assert.exists(rows[1].querySelector('[data-payment-method-icon="bank"]'));
    assert.notExists(rows[1].querySelector('.payment-method-status'));
    assert.notExists(rows[1].querySelector('.verification-status-badge'));
    assert.exists(rows[1].querySelector('.payment-method-status-icon-warning'));
    assert.exists(rows[1].querySelector('.payment-method-chevron'));
    assert.equal(
      rows[1]
        .querySelector('.payment-method-status-icon')
        ?.getAttribute('aria-label'),
      'Under review'
    );
    assert.equal(
      rows[2].querySelector('.payment-method-title')?.textContent?.trim(),
      'Travel card'
    );
    assert.equal(
      rows[2].querySelector('.payment-method-meta')?.textContent?.trim(),
      'Mastercard •••• 4444'
    );
    assert.exists(
      rows[2].querySelector('[data-payment-method-icon="mastercard"]')
    );
    assert.notExists(rows[2].querySelector('.payment-method-status'));
    assert.notExists(rows[2].querySelector('.verification-status-badge'));
    assert.exists(rows[2].querySelector('.payment-method-status-icon-danger'));
    assert.exists(rows[2].querySelector('.payment-method-chevron'));
    assert.notEqual(
      getComputedStyle(rows[0]).backgroundColor,
      getComputedStyle(rows[1]).backgroundColor
    );
    assert.equal(
      getComputedStyle(rows[1]).backgroundColor,
      'rgb(255, 255, 255)'
    );
    assert.equal(getComputedStyle(rows[0]).paddingTop, '12px');
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
      ['Add a credit or debit card', 'Add bank account']
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
    assert.equal(getComputedStyle(addCardLink).paddingTop, '12px');
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

  test('clicking an unverified saved source row starts verification', async () => {
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
    await waitFor(
      () =>
        el.shadowRoot!.querySelector('.widget-title')?.textContent?.trim() ===
        'Verification under review',
      'verification outcome did not render'
    );

    assert.deepEqual(
      requests.map(
        (request) => `${request.method} ${new URL(request.url).pathname}`
      ),
      ['POST /interaction/verify/step1']
    );
    assert.equal(
      el.shadowRoot!.querySelector('.widget-title')?.textContent?.trim(),
      'Verification under review'
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

  test('opens the add credit card screen with the redesigned inline card-entry layout', async () => {
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
      'Add a credit card'
    );
    assert.equal(
      el.shadowRoot!.querySelector('.widget-subtitle')?.textContent?.trim(),
      'Add a new payment method for this session.'
    );
    assert.notExists(el.shadowRoot!.querySelector('.widget-close'));
    assert.notExists(el.shadowRoot!.querySelector('.widget-divider'));
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
    assert.exists(
      el.shadowRoot!.querySelector('[data-action="back-to-payment-methods"]')
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
        'Bank connection unavailable',
      'bank provider error screen was not rendered'
    );
    await clickAction(el, 'back-to-payment-methods');
    await clickAction(el, 'add-card');
    assert.notInclude(
      requests.map((request) => new URL(request.url).pathname),
      '/customer'
    );
  });

  test('creates a new billing address, creates a verified customer card, and returns to the payment method list without attaching it', async () => {
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
            selectedSource: {
              id: 'card-created-1',
              tenderType: 'Card',
              name: 'Card from source response',
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
                name: 'Card from source response',
                verificationInfo: {status: 'VERIFIED'},
                card: {
                  network: 'Mastercard',
                  cardNumber: '5555555555554444',
                },
              },
            ],
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
          'Pay with',
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
    assert.equal(el.interactionResponse?.selectedSource?.id, 'card-created-1');
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
      'Card from source response'
    );
    assert.equal(
      el
        .shadowRoot!.querySelector(
          '.selected-payment-method .payment-method-meta'
        )
        ?.textContent?.trim(),
      'Mastercard •••• 4444'
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
            selectedSource: {
              id: 'card-created-1',
              tenderType: 'Card',
              name: 'Ada corporate card',
              verificationInfo: {status: 'VERIFIED'},
            },
            paymentSources: [
              {
                id: 'card-created-1',
                tenderType: 'Card',
                name: 'Ada corporate card',
                verificationInfo: {status: 'VERIFIED'},
              },
            ],
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
          'Pay with',
      'existing-address card did not return to the payment method list'
    );

    assert.notInclude(
      requests.map((request) => new URL(request.url).pathname),
      '/interaction/billing-address'
    );
    assert.notInclude(
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

  test('shows the card error screen when card creation returns a non-verified source without attaching it', async () => {
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
            selectedSource: {
              id: 'card-created-1',
              tenderType: 'Card',
              name: 'Card under review',
              verificationInfo: {status: 'UNDER_REVIEW'},
              card: {
                network: 'Visa',
                cardNumber: '4111111111111111',
              },
            },
            paymentSources: [
              {
                id: 'card-created-1',
                tenderType: 'Card',
                name: 'Card under review',
                verificationInfo: {status: 'UNDER_REVIEW'},
                card: {
                  network: 'Visa',
                  cardNumber: '4111111111111111',
                },
              },
            ],
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
        'Credit card not saved',
      'non-verified card did not render the card error screen'
    );

    assert.notInclude(
      requests.map((request) => new URL(request.url).pathname),
      '/interaction/source/card-created-1/attach'
    );
    assert.exists(
      el.shadowRoot!.querySelector('[data-action="edit-card-details"]')
    );
    assert.exists(
      el.shadowRoot!.querySelector('[data-action="use-different-method"]')
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
      ['GET /interaction/source/pbb/session']
    );
    assert.equal(
      requests[0].headers.get('x-interaction-id'),
      'interaction-payment'
    );
    assert.equal(requests[0].credentials, 'include');
  });

  test('Pay by Bank success verifies the finalized bank source and returns to the payment method list with status without events', async () => {
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
              id: 'bank-new',
              tenderType: 'BankAccount',
              name: 'Operating account',
              verificationInfo: {status: 'NOT_VERIFIED'},
              bankAccount: {
                bankName: 'Commerce National Bank',
                accountNumber: '9876543210',
              },
            },
          }),
          {status: 200, headers: {'Content-Type': 'application/json'}}
        );
      }

      if (pathname === '/interaction/verify/step1') {
        return new Response(
          JSON.stringify({
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
        'POST /interaction/verify/step1',
      ]
    );
    const verifyRequest = requests[2];
    assert.equal(verifyRequest.bodyText, JSON.stringify({value: 'bank-new'}));
    assert.equal(
      verifyRequest.headers.get('x-interaction-id'),
      'interaction-payment'
    );
    assert.equal(verifyRequest.credentials, 'include');
    assert.equal(
      el.shadowRoot!.querySelector('.widget-title')?.textContent?.trim(),
      'Pay with'
    );
    assert.notExists(el.shadowRoot!.querySelector('.selected-payment-method'));
    assert.equal(
      el
        .shadowRoot!.querySelector('.payment-method-title')
        ?.textContent?.trim(),
      'Operating account'
    );
    assert.equal(
      el.shadowRoot!.querySelector('.payment-method-meta')?.textContent?.trim(),
      'Commerce National Bank •••• 3210'
    );
    assert.notExists(
      el.shadowRoot!.querySelector('.verification-status-badge')
    );
    assert.exists(
      el.shadowRoot!.querySelector('.payment-method-status-icon-warning')
    );
    assert.exists(el.shadowRoot!.querySelector('.payment-method-chevron'));
    assert.equal(
      el
        .shadowRoot!.querySelector('.payment-method-status-icon')
        ?.getAttribute('aria-label'),
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

  test('Pay by Bank success preselects a finalized VERIFIED bank source without verification request', async () => {
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
      'Pay with'
    );
    assert.exists(el.shadowRoot!.querySelector('.selected-payment-method'));
    assert.notExists(
      el.shadowRoot!.querySelector('[data-action="continue-bank-outcome"]')
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
      'Operating account'
    );
    assert.equal(
      el
        .shadowRoot!.querySelector(
          '.selected-payment-method .payment-method-meta'
        )
        ?.textContent?.trim(),
      'Commerce National Bank •••• 3210'
    );
    assert.equal(
      el.interactionResponse?.paymentSources?.[0]?.verificationInfo?.status,
      'VERIFIED'
    );
    assert.equal(el.interactionResponse?.selectedSource?.id, 'bank-new');
    assert.equal(el.interactionResponse?.status, 'PAYMENT_SOURCE_ATTACHED');
    assert.lengthOf(successEvents, 0);
    assert.lengthOf(errorEvents, 0);
  });

  test('Pay by Bank success shows finalized UNDER_REVIEW bank sources in the payment method list', async () => {
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
      'Pay with'
    );
    assert.notExists(el.shadowRoot!.querySelector('.selected-payment-method'));
    assert.notExists(
      el.shadowRoot!.querySelector('.verification-status-badge')
    );
    assert.exists(
      el.shadowRoot!.querySelector('.payment-method-status-icon-warning')
    );
    assert.exists(el.shadowRoot!.querySelector('.payment-method-chevron'));
    assert.equal(
      el
        .shadowRoot!.querySelector('.payment-method-status-icon')
        ?.getAttribute('aria-label'),
      'Under review'
    );
    assert.isUndefined(el.interactionResponse?.selectedSource);
  });

  test('Pay by Bank success shows finalized REQUIRE_INFO bank sources on the required-info screen', async () => {
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
    assert.deepEqual(
      [...el.shadowRoot!.querySelectorAll('.required-info-summary-value')].map(
        (node) => node.textContent?.trim()
      ),
      ['Bank account', '•••• 3210', 'Operating account']
    );
    assert.equal(
      el
        .shadowRoot!.querySelector('.required-info-summary-status')
        ?.textContent?.trim(),
      'Advanced verification incomplete'
    );
    assert.deepEqual(
      [...el.shadowRoot!.querySelectorAll('.upload-row-requirements')].map(
        (node) => node.textContent?.trim()
      ),
      ['Bank statement', 'Driver license photo']
    );
    assert.equal(
      el
        .shadowRoot!.querySelector(
          '.primitive-footer [data-action="open-required-info-file-picker"]'
        )
        ?.textContent?.trim(),
      'Verify'
    );
    assert.equal(
      el
        .shadowRoot!.querySelector('[data-action="use-different-bank-account"]')
        ?.textContent?.trim(),
      'Use a different account'
    );
    assert.exists(el.shadowRoot!.querySelector('.required-info-file-input'));
    assert.isUndefined(el.interactionResponse?.selectedSource);
  });

  test('Pay by Bank verification step1 REQUIRE_INFO opens the required-info screen and keeps file selection local only', async () => {
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
        'POST /interaction/verify/step1',
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
        .shadowRoot!.querySelector('.required-info-selected-file')
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

  test('Pay by Bank success shows finalized DECLINED bank sources in the payment method list', async () => {
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
      'Pay with'
    );
    assert.notExists(el.shadowRoot!.querySelector('.selected-payment-method'));
    assert.notExists(
      el.shadowRoot!.querySelector('.verification-status-badge')
    );
    assert.exists(
      el.shadowRoot!.querySelector('.payment-method-status-icon-danger')
    );
    assert.exists(el.shadowRoot!.querySelector('.payment-method-chevron'));
    assert.equal(
      el
        .shadowRoot!.querySelector('.payment-method-status-icon')
        ?.getAttribute('aria-label'),
      'Declined'
    );
    assert.isUndefined(el.interactionResponse?.selectedSource);
  });

  test('Pay by Bank NOT_VERIFIED source runs verification and preselects when step1 returns VERIFIED', async () => {
    const {el, requests} = await completePayByBankFlow({
      finalizedStatus: 'NOT_VERIFIED',
      verificationStatus: 'VERIFIED',
    });

    assert.deepEqual(
      requests.map(
        (request) => `${request.method} ${new URL(request.url).pathname}`
      ),
      [
        'GET /interaction/source/pbb/session',
        'PUT /interaction/source/pbb/session/agg-session-1/p-token-1',
        'POST /interaction/verify/step1',
        'POST /interaction/source/bank-new/attach',
      ]
    );
    assert.equal(requests[2].bodyText, JSON.stringify({value: 'bank-new'}));
    assert.equal(
      el.shadowRoot!.querySelector('.widget-title')?.textContent?.trim(),
      'Pay with'
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
    assert.equal(el.interactionResponse?.selectedSource?.id, 'bank-new');
    assert.equal(el.interactionResponse?.status, 'PAYMENT_SOURCE_ATTACHED');
  });

  test('Pay by Bank success with no finalized bank source renders provider unavailable', async () => {
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
      'Bank connection unavailable'
    );
    assert.notInclude(
      requests.map(
        (request) => `${request.method} ${new URL(request.url).pathname}`
      ),
      'POST /interaction/verify/step1'
    );
  });

  test('Pay by Bank success with no finalized bank source id renders provider unavailable', async () => {
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
      'Bank connection unavailable'
    );
    assert.notInclude(
      requests.map(
        (request) => `${request.method} ${new URL(request.url).pathname}`
      ),
      'POST /interaction/verify/step1'
    );
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
