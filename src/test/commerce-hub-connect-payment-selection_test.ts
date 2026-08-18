import {fixture, assert, html as testingHtml} from '@open-wc/testing';

import '../commerce-hub-connect.js';
import type {
  CommerceHubConnect,
  CommerceHubBaseURLInput,
  InteractionResponse,
  PaymentSource,
} from '../commerce-hub-connect.js';
import {StaleInteractionRefreshError} from '../internal/controllers/interaction-refresh-controller.js';

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

const captureDeleteActionTimer = () => {
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

const assertDeleteActionUsesTrashIcon = (button: HTMLButtonElement) => {
  assert.equal(button.textContent?.trim(), '');
  assert.exists(
    button.querySelector(
      '.payment-method-delete-action-icon[aria-hidden="true"]'
    )
  );
};

const flushElement = async (el: CommerceHubConnect) => {
  await el.updateComplete;
  await nextFrame();
  await el.updateComplete;
};

const TEST_COMMERCE_HUB_BASE_URL = 'http://commercehub.test';
const TEST_INTERACTION_FEATURES: NonNullable<InteractionResponse['features']> =
  ['ADD_ACCOUNT', 'SELECT', 'TRANSFER'];

const renderConnect = async (
  interactionResponse: InteractionResponse,
  baseURL: CommerceHubBaseURLInput = TEST_COMMERCE_HUB_BASE_URL,
  options: {initialInteractionResponse?: InteractionResponse | false} = {}
) => {
  const shouldStubInitialInteraction =
    options.initialInteractionResponse !== false;
  const interactionResponseForTest =
    interactionResponseWithTestFeatures(interactionResponse);

  if (shouldStubInitialInteraction) {
    const fetchForTest = window.fetch;
    let servedInitialInteraction = false;
    const initialInteractionResponse =
      options.initialInteractionResponse === false
        ? false
        : interactionResponseWithTestFeatures(
            options.initialInteractionResponse ?? interactionResponse
          );

    window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
      const request = input instanceof Request ? input : new Request(input);

      if (
        !servedInitialInteraction &&
        request.method === 'GET' &&
        new URL(request.url).pathname === '/interaction'
      ) {
        servedInitialInteraction = true;

        return new Response(JSON.stringify(initialInteractionResponse), {
          status: 200,
          headers: {'Content-Type': 'application/json'},
        });
      }

      return fetchForTest(input, init);
    };
  }

  const el = (await fixture(
    testingHtml`<commerce-hub-connect
      .interactionResponse=${interactionResponseForTest}
      .baseURL=${baseURL}
    ></commerce-hub-connect>`
  )) as CommerceHubConnect;

  await flushElement(el);

  if (shouldStubInitialInteraction) {
    await waitFor(
      () => !el.shadowRoot!.querySelector('.payment-method-skeletons'),
      'initial interaction refresh did not settle'
    );
  }

  return el;
};

const interactionResponseWithTestFeatures = (
  interactionResponse: InteractionResponse
): InteractionResponse => ({
  ...interactionResponse,
  features: interactionResponse.features ?? [...TEST_INTERACTION_FEATURES],
});

const clickAction = async (el: CommerceHubConnect, action: string) => {
  el.shadowRoot!.querySelector<HTMLButtonElement>(
    `[data-action="${action}"]`
  )!.click();
  await flushElement(el);
};

const requestPaymentSourceDeletion = async (
  el: CommerceHubConnect,
  paymentMethodId: string
) => {
  el.shadowRoot!.querySelector<HTMLButtonElement>(
    `[data-action="toggle-payment-source-menu"][data-payment-method-id="${paymentMethodId}"]`
  )!.click();
  await flushElement(el);
  el.shadowRoot!.querySelector<HTMLButtonElement>(
    `[data-action="delete-payment-source"][data-payment-method-id="${paymentMethodId}"]`
  )!.click();
  await flushElement(el);
};

const markPaymentSourceAsDefault = async (
  el: CommerceHubConnect,
  paymentMethodId: string
) => {
  el.shadowRoot!.querySelector<HTMLButtonElement>(
    `[data-action="toggle-payment-source-menu"][data-payment-method-id="${paymentMethodId}"]`
  )!.click();
  await flushElement(el);
  const markAsDefaultButton = el.shadowRoot!.querySelector<HTMLButtonElement>(
    `[data-action="mark-payment-source-default"][data-payment-method-id="${paymentMethodId}"]`
  )!;
  assert.isFalse(
    markAsDefaultButton.disabled,
    `Mark as default should be enabled for ${paymentMethodId}`
  );
  markAsDefaultButton.click();
  await flushElement(el);
};

const recordOutputEvents = (el: Element) => {
  const successEvents: CustomEvent<PaymentSource>[] = [];
  const legacySuccessEvents: CustomEvent<PaymentSource>[] = [];
  const listPaymentMethodsEvents: CustomEvent<PaymentSource[]>[] = [];
  const errorEvents: CustomEvent<unknown>[] = [];

  el.addEventListener('onSelect', (event) => {
    successEvents.push(event as CustomEvent<PaymentSource>);
  });
  el.addEventListener('onSuccess', (event) => {
    legacySuccessEvents.push(event as CustomEvent<PaymentSource>);
  });
  el.addEventListener('onListPaymentMethods', (event) => {
    listPaymentMethodsEvents.push(event as CustomEvent<PaymentSource[]>);
  });
  el.addEventListener('onError', (event) => {
    errorEvents.push(event as CustomEvent<unknown>);
  });

  return {
    successEvents,
    legacySuccessEvents,
    listPaymentMethodsEvents,
    errorEvents,
  };
};

suite('commerce-hub-connect payment selection', () => {
  const originalFetch = window.fetch;
  const originalConfirm = window.confirm;

  teardown(() => {
    window.fetch = originalFetch;
    window.confirm = originalConfirm;
  });

  test('verified saved methods render draft-selection radios and the primary action', async () => {
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
          tenderType: 'Card',
          id: 'card-2',
          name: 'Travel card',
          verificationInfo: {status: 'VERIFIED'},
          card: {
            network: 'Mastercard',
            cardNumber: '5555555555554444',
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

    assert.lengthOf(rows, 3);
    assert.lengthOf(
      el.shadowRoot!.querySelectorAll(
        '[data-action="toggle-payment-source-menu"]'
      ),
      3
    );
    assert.notExists(
      el.shadowRoot!.querySelector(
        '[data-action="mark-payment-source-default"]'
      )
    );
    assert.notExists(el.shadowRoot!.querySelector('.selected-payment-method'));
    const radios = [
      ...el.shadowRoot!.querySelectorAll<HTMLInputElement>(
        '.payment-method-radio'
      ),
    ];
    const useSelectedButton = el.shadowRoot!.querySelector<HTMLButtonElement>(
      '[data-action="attach-payment-source"]'
    )!;
    const {successEvents} = recordOutputEvents(el);

    assert.lengthOf(radios, 2);
    assert.isTrue(radios[0].checked);
    assert.isFalse(radios[1].checked);
    assert.equal(
      rows[0].querySelector('.verification-status-badge')?.textContent?.trim(),
      'Verified'
    );
    assert.strictEqual(
      radios[0].closest('label')?.firstElementChild,
      radios[0],
      'radio should be the left-most control in the selectable row'
    );
    assert.notExists(rows[2].querySelector('.payment-method-radio'));
    assert.equal(useSelectedButton.textContent?.trim(), 'Use selected method');
    assert.isFalse(useSelectedButton.disabled);

    radios[1].checked = true;
    radios[1].dispatchEvent(
      new Event('change', {bubbles: true, composed: true})
    );
    await flushElement(el);

    assert.isFalse(radios[0].checked);
    assert.isTrue(radios[1].checked);
    assert.isFalse(useSelectedButton.disabled);
    assert.lengthOf(successEvents, 0);
    assert.notExists(
      rows[0].querySelector('[data-action="verify-payment-source"]')
    );
    assert.notExists(
      rows[2].querySelector('[data-action="verify-payment-source"]')
    );
  });

  test('Use selected method stays disabled when no verified source is available', async () => {
    const el = await renderConnect({
      interactionId: 'interaction-payment',
      status: 'PAYMENT_SOURCE_REQUESTED',
      features: ['SELECT'],
      paymentSources: [
        {
          tenderType: 'BankAccount',
          id: 'bank-review',
          name: 'Review account',
          verificationInfo: {status: 'UNDER_REVIEW'},
          bankAccount: {accountNumber: '9876543210'},
        },
      ],
    });

    assert.notExists(el.shadowRoot!.querySelector('.payment-method-radio'));
    assert.isTrue(
      el.shadowRoot!.querySelector<HTMLButtonElement>(
        '[data-action="attach-payment-source"]'
      )!.disabled
    );
  });

  test('embedded SELECT-only renders a dropdown and emits after attach completes', async () => {
    const attachResponse = createDeferred<Response>();
    const sources: PaymentSource[] = [
      {
        tenderType: 'Card',
        id: 'card-1',
        name: 'Corporate card',
        verificationInfo: {status: 'VERIFIED'},
        card: {network: 'Visa', cardNumber: '4111111111111111'},
      },
      {
        tenderType: 'BankAccount',
        id: 'bank-review',
        name: 'Review account',
        verificationInfo: {status: 'UNDER_REVIEW'},
        bankAccount: {accountNumber: '9876543210'},
      },
    ];
    const el = await renderConnect({
      interactionId: 'interaction-payment',
      status: 'PAYMENT_SOURCE_REQUESTED',
      features: ['SELECT'],
      paymentSources: sources,
    });
    el.presentationMode = 'embedded';
    await flushElement(el);
    const {successEvents} = recordOutputEvents(el);
    const select = el.shadowRoot!.querySelector<HTMLSelectElement>(
      '[data-embedded-payment-select]'
    )!;

    assert.exists(select);
    assert.strictEqual(
      select.parentElement,
      el.shadowRoot!.querySelector('.widget-frame')
    );
    assert.notExists(el.shadowRoot!.querySelector('.widget-shell'));
    assert.notExists(el.shadowRoot!.querySelector('.embedded-payment-select-label'));
    assert.deepEqual(
      [...select.options].map(({value}) => value),
      ['', 'card-1']
    );
    assert.notExists(el.shadowRoot!.querySelector('.payment-method-row'));
    assert.notExists(
      el.shadowRoot!.querySelector('[data-action="attach-payment-source"]')
    );

    window.fetch = async (input: RequestInfo | URL) => {
      const request = input instanceof Request ? input : new Request(input);
      const pathname = new URL(request.url).pathname;

      if (pathname.endsWith('/attach')) {
        return attachResponse.promise;
      }

      return new Response(
        JSON.stringify({
          interactionId: 'interaction-payment',
          status: 'PAYMENT_SOURCE_ATTACHED',
          selectedSource: sources[0],
          paymentSources: sources,
        }),
        {status: 200, headers: {'Content-Type': 'application/json'}}
      );
    };

    select.value = 'card-1';
    select.dispatchEvent(new Event('change', {bubbles: true, composed: true}));
    await flushElement(el);
    assert.isTrue(select.disabled);
    assert.lengthOf(successEvents, 0);

    attachResponse.resolve(
      new Response(
        JSON.stringify({
          interactionId: 'interaction-payment',
          status: 'PAYMENT_SOURCE_ATTACHED',
          selectedSource: sources[0],
          paymentSources: sources,
        }),
        {status: 200, headers: {'Content-Type': 'application/json'}}
      )
    );
    await waitFor(() => successEvents.length === 1);
    assert.equal(successEvents[0].detail.id, 'card-1');
  });

  test('embedded SELECT-only disables a No payment methods dropdown when empty', async () => {
    const el = await renderConnect({
      interactionId: 'interaction-payment',
      status: 'PAYMENT_SOURCE_REQUESTED',
      features: ['SELECT'],
      paymentSources: [],
    });
    el.presentationMode = 'embedded';
    await flushElement(el);
    const select = el.shadowRoot!.querySelector<HTMLSelectElement>(
      '[data-embedded-payment-select]'
    )!;

    assert.exists(select);
    assert.isTrue(select.disabled);
    assert.deepEqual(
      [...select.options].map(({value, text}) => ({value, text})),
      [{value: '', text: 'No payment methods'}]
    );
    assert.notExists(el.shadowRoot!.querySelector('.widget-shell'));
  });

  test('embedded selector exposes attach failures and remains available for retry', async () => {
    let attachAttempts = 0;
    const el = await renderConnect({
      interactionId: 'interaction-payment',
      status: 'PAYMENT_SOURCE_REQUESTED',
      features: ['SELECT'],
      paymentSources: [
        {
          tenderType: 'Card',
          id: 'card-1',
          name: 'Corporate card',
          verificationInfo: {status: 'VERIFIED'},
          recipient: {id: 'recipient-1', status: 'PROVISIONED'},
          card: {network: 'Visa', cardNumber: '4111111111114242'},
        },
      ],
    });
    el.presentationMode = 'embedded';
    await flushElement(el);
    window.fetch = async () => {
      attachAttempts += 1;
      return new Response(JSON.stringify({message: 'Attach was declined'}), {
        status: 409,
        headers: {'Content-Type': 'application/json'},
      });
    };

    let select = el.shadowRoot!.querySelector<HTMLSelectElement>(
      '[data-embedded-payment-select]'
    )!;
    select.value = 'card-1';
    select.dispatchEvent(new Event('change', {bubbles: true, composed: true}));
    await waitFor(
      () => Boolean(el.shadowRoot!.querySelector('[role="alert"]')),
      'embedded attach error did not render'
    );

    const alert = el.shadowRoot!.querySelector<HTMLElement>('[role="alert"]')!;
    assert.include(alert.textContent ?? '', 'Attach was declined');
    select = el.shadowRoot!.querySelector<HTMLSelectElement>(
      '[data-embedded-payment-select]'
    )!;
    assert.isFalse(select.disabled);

    select.value = 'card-1';
    select.dispatchEvent(new Event('change', {bubbles: true, composed: true}));
    await waitFor(() => attachAttempts === 2, 'embedded attach retry did not run');
  });

  test('embedded SELECT with ADD_ACCOUNT appends Add payment method and opens it in a dialog', async () => {
    const el = await renderConnect({
      interactionId: 'interaction-payment',
      status: 'PAYMENT_SOURCE_REQUESTED',
      features: ['SELECT', 'ADD_ACCOUNT'],
      allowedTenderTypes: ['CARD'],
      paymentSources: [
        {
          tenderType: 'Card',
          id: 'card-1',
          name: 'Corporate card',
          verificationInfo: {status: 'VERIFIED'},
          recipient: {id: 'recipient-1', status: 'PROVISIONED'},
          card: {network: 'Visa', cardNumber: '4111111111111111'},
        },
      ],
    });
    el.presentationMode = 'embedded';
    await flushElement(el);
    const select = el.shadowRoot!.querySelector<HTMLSelectElement>(
      '[data-embedded-payment-select]'
    )!;

    assert.deepEqual(
      [...select.options].map(({value, textContent}) => ({
        value,
        label: textContent?.trim(),
      })),
      [
        {value: '', label: 'Select payment method'},
        {value: 'card-1', label: 'Corporate card · Visa · xx 1111'},
        {value: '__chc_add_payment__', label: 'Add payment method'},
      ]
    );

    select.value = '__chc_add_payment__';
    select.dispatchEvent(new Event('change', {bubbles: true, composed: true}));
    await flushElement(el);

    assert.exists(
      el.shadowRoot!.querySelector('[data-embedded-add-payment-dialog]')
    );
    assert.exists(el.shadowRoot!.querySelector('.widget-shell-dialog'));
    assert.exists(el.shadowRoot!.querySelector('[data-action="add-card"]'));

    el.shadowRoot!
      .querySelector<HTMLButtonElement>(
        '[data-action="close-embedded-add-payment-dialog"]'
      )!
      .click();
    await flushElement(el);

    assert.notExists(
      el.shadowRoot!.querySelector('[data-embedded-add-payment-dialog]')
    );
    assert.exists(
      el.shadowRoot!.querySelector('[data-embedded-payment-select]')
    );
  });

  test('embedded SELECT with ADD_ACCOUNT keeps Add payment method enabled when no methods exist', async () => {
    const el = await renderConnect({
      interactionId: 'interaction-payment',
      status: 'PAYMENT_SOURCE_REQUESTED',
      features: ['ADD_ACCOUNT', 'SELECT'],
      allowedTenderTypes: ['CARD'],
      paymentSources: [],
    });
    el.presentationMode = 'embedded';
    await flushElement(el);
    const select = el.shadowRoot!.querySelector<HTMLSelectElement>(
      '[data-embedded-payment-select]'
    )!;

    assert.isFalse(select.disabled);
    assert.deepEqual(
      [...select.options].map(({value, textContent}) => ({
        value,
        label: textContent?.trim(),
      })),
      [
        {value: '', label: 'No payment methods'},
        {value: '__chc_add_payment__', label: 'Add payment method'},
      ]
    );
  });

  test('embedded radio-list mode renders unselected instruments and Add payment method as list rows', async () => {
    const el = await renderConnect({
      interactionId: 'interaction-payment',
      status: 'PAYMENT_SOURCE_REQUESTED',
      features: ['SELECT', 'ADD_ACCOUNT'],
      allowedTenderTypes: ['CARD'],
      paymentSources: [
        {
          tenderType: 'Card',
          id: 'card-1',
          name: 'Corporate card',
          verificationInfo: {status: 'VERIFIED'},
          recipient: {id: 'recipient-1', status: 'PROVISIONED'},
          card: {network: 'Visa', cardNumber: '4111111111114242'},
        },
      ],
    });
    el.presentationMode = 'embedded';
    el.setAttribute('embedded-selector-mode', 'radio-list');
    await flushElement(el);

    assert.notExists(
      el.shadowRoot!.querySelector('[data-embedded-payment-select]')
    );
    const group = el.shadowRoot!.querySelector<HTMLElement>(
      '[data-embedded-payment-radio-list]'
    )!;
    const trigger = group.querySelector<HTMLButtonElement>(
      '[data-action="toggle-embedded-payment-selector"]'
    )!;

    assert.equal(trigger.getAttribute('aria-expanded'), 'false');
    assert.equal(trigger.getAttribute('aria-haspopup'), 'listbox');
    assert.notExists(group.querySelector('[role="listbox"]'));
    trigger.click();
    await flushElement(el);

    const option = group.querySelector<HTMLButtonElement>(
      '[data-action="attach-payment-source"]'
    )!;
    const addOption = group.querySelector<HTMLButtonElement>(
      '[data-action="open-embedded-add-payment-dialog"]'
    )!;

    assert.equal(group.getAttribute('part'), 'embedded-payment-method-list');
    assert.equal(group.querySelector('[role="listbox"]')?.getAttribute('part'), 'embedded-payment-method-popup');
    assert.equal(option.getAttribute('role'), 'option');
    assert.equal(option.getAttribute('aria-selected'), 'false');
    assert.equal(option.tabIndex, 0);
    assert.equal(option.getAttribute('part'), 'embedded-payment-method-option');
    assert.include(option.textContent ?? '', 'Corporate card');
    assert.include(option.textContent ?? '', '4242');
    assert.equal(
      addOption.getAttribute('part'),
      'embedded-add-payment-method-option'
    );
    assert.include(addOption.textContent ?? '', 'Add payment method');
    assert.strictEqual(
      addOption,
      group.querySelector('[role="listbox"]')?.lastElementChild
    );

    addOption.click();
    await flushElement(el);
    assert.exists(
      el.shadowRoot!.querySelector('[data-embedded-add-payment-dialog]')
    );
  });

  test('embedded radio-list mode shows attach progress inside its trigger', async () => {
    const el = await renderConnect({
      interactionId: 'interaction-payment',
      status: 'PAYMENT_SOURCE_REQUESTED',
      features: ['SELECT'],
      paymentSources: [
        {
          tenderType: 'Card',
          id: 'card-1',
          name: 'Corporate card',
          verificationInfo: {status: 'VERIFIED'},
          recipient: {id: 'recipient-1', status: 'PROVISIONED'},
          card: {network: 'Visa', cardNumber: '4111111111114242'},
        },
      ],
    });
    el.presentationMode = 'embedded';
    el.setAttribute('embedded-selector-mode', 'radio-list');
    (
      el as unknown as {
        pendingAction?: string;
      }
    ).pendingAction = 'attach-payment-source';
    el.requestUpdate();
    await flushElement(el);

    const trigger = el.shadowRoot!.querySelector<HTMLButtonElement>(
      '[data-action="toggle-embedded-payment-selector"]'
    )!;
    const progress = trigger.querySelector<HTMLElement>(
      '[data-embedded-attach-progress]'
    );

    assert.equal(trigger.getAttribute('aria-busy'), 'true');
    assert.isTrue(trigger.disabled);
    assert.include(progress?.textContent ?? '', 'Securing payment method…');
    assert.exists(progress?.querySelector('.embedded-attach-spinner'));
  });

  test('embedded radio-list arrow keys move focus through payment and Add options', async () => {
    const el = await renderConnect({
      interactionId: 'interaction-payment',
      status: 'PAYMENT_SOURCE_REQUESTED',
      features: ['SELECT', 'ADD_ACCOUNT'],
      allowedTenderTypes: ['CARD'],
      paymentSources: [
        {
          tenderType: 'Card',
          id: 'card-1',
          name: 'Corporate card',
          verificationInfo: {status: 'VERIFIED'},
          recipient: {id: 'recipient-1', status: 'PROVISIONED'},
          card: {network: 'Visa', cardNumber: '4111111111114242'},
        },
        {
          tenderType: 'Card',
          id: 'card-2',
          name: 'Travel card',
          verificationInfo: {status: 'VERIFIED'},
          recipient: {id: 'recipient-2', status: 'PROVISIONED'},
          card: {network: 'Mastercard', cardNumber: '5555555555554444'},
        },
      ],
    });
    el.presentationMode = 'embedded';
    el.setAttribute('embedded-selector-mode', 'radio-list');
    await flushElement(el);

    el.shadowRoot!
      .querySelector<HTMLButtonElement>(
        '[data-action="toggle-embedded-payment-selector"]'
      )!
      .click();
    await flushElement(el);

    const options = [
      ...el.shadowRoot!.querySelectorAll<HTMLButtonElement>(
        '.embedded-payment-radio-option[role="option"]:not(:disabled)'
      ),
    ];
    assert.lengthOf(options, 3);
    assert.deepEqual(
      options.map((option) => option.tabIndex),
      [0, -1, -1]
    );

    options[0].focus();
    options[0].dispatchEvent(
      new KeyboardEvent('keydown', {
        key: 'ArrowDown',
        bubbles: true,
        composed: true,
      })
    );
    assert.strictEqual(el.shadowRoot!.activeElement, options[1]);
    assert.deepEqual(
      options.map((option) => option.tabIndex),
      [-1, 0, -1]
    );

    options[1].dispatchEvent(
      new KeyboardEvent('keydown', {
        key: 'ArrowDown',
        bubbles: true,
        composed: true,
      })
    );
    assert.strictEqual(el.shadowRoot!.activeElement, options[2]);
    assert.equal(options[2].dataset.action, 'open-embedded-add-payment-dialog');
    assert.deepEqual(
      options.map((option) => option.tabIndex),
      [-1, -1, 0]
    );

    options[2].dispatchEvent(
      new KeyboardEvent('keydown', {
        key: 'ArrowUp',
        bubbles: true,
        composed: true,
      })
    );
    assert.strictEqual(el.shadowRoot!.activeElement, options[1]);
  });

  test('embedded radio-list popup manages focus, Escape, and outside click', async () => {
    const el = await renderConnect({
      interactionId: 'interaction-payment',
      status: 'PAYMENT_SOURCE_REQUESTED',
      features: ['SELECT', 'ADD_ACCOUNT'],
      allowedTenderTypes: ['CARD'],
      paymentSources: [
        {
          tenderType: 'Card',
          id: 'card-1',
          name: 'Corporate card',
          isDefault: true,
          verificationInfo: {status: 'VERIFIED'},
          recipient: {id: 'recipient-1', status: 'PROVISIONED'},
          card: {network: 'Visa', cardNumber: '4111111111114242'},
        },
        {
          tenderType: 'Card',
          id: 'card-2',
          name: 'Travel card',
          verificationInfo: {status: 'VERIFIED'},
          recipient: {id: 'recipient-2', status: 'PROVISIONED'},
          card: {network: 'Mastercard', cardNumber: '5555555555554444'},
        },
      ],
    });
    el.presentationMode = 'embedded';
    el.setAttribute('embedded-selector-mode', 'radio-list');
    await flushElement(el);
    const trigger = el.shadowRoot!.querySelector<HTMLButtonElement>(
      '[data-action="toggle-embedded-payment-selector"]'
    )!;

    trigger.click();
    await flushElement(el);
    const selectedOption = el.shadowRoot!.querySelector<HTMLButtonElement>(
      '[role="option"][aria-selected="true"]'
    )!;
    assert.strictEqual(el.shadowRoot!.activeElement, selectedOption);

    selectedOption.dispatchEvent(
      new KeyboardEvent('keydown', {
        key: 'Escape',
        bubbles: true,
        composed: true,
      })
    );
    await flushElement(el);
    assert.notExists(el.shadowRoot!.querySelector('[role="listbox"]'));
    assert.strictEqual(el.shadowRoot!.activeElement, trigger);

    trigger.click();
    await flushElement(el);
    document.body.dispatchEvent(
      new MouseEvent('click', {bubbles: true, composed: true})
    );
    await flushElement(el);
    assert.notExists(el.shadowRoot!.querySelector('[role="listbox"]'));
  });

  test('embedded radio-list focuses Add when it is the only enabled option', async () => {
    const el = await renderConnect({
      interactionId: 'interaction-payment',
      status: 'PAYMENT_SOURCE_REQUESTED',
      features: ['SELECT', 'ADD_ACCOUNT'],
      allowedTenderTypes: ['CARD'],
      paymentSources: [],
    });
    el.presentationMode = 'embedded';
    el.setAttribute('embedded-selector-mode', 'radio-list');
    await flushElement(el);

    el.shadowRoot!
      .querySelector<HTMLButtonElement>(
        '[data-action="toggle-embedded-payment-selector"]'
      )!
      .click();
    await flushElement(el);

    const addOption = el.shadowRoot!.querySelector<HTMLButtonElement>(
      '[role="option"][data-action="open-embedded-add-payment-dialog"]'
    )!;
    assert.equal(addOption.tabIndex, 0);
    assert.strictEqual(el.shadowRoot!.activeElement, addOption);
  });

  test('embedded standard select shows attach progress in the dropdown area', async () => {
    const el = await renderConnect({
      interactionId: 'interaction-payment',
      status: 'PAYMENT_SOURCE_REQUESTED',
      features: ['SELECT'],
      paymentSources: [
        {
          tenderType: 'Card',
          id: 'card-1',
          name: 'Corporate card',
          verificationInfo: {status: 'VERIFIED'},
          recipient: {id: 'recipient-1', status: 'PROVISIONED'},
          card: {network: 'Visa', cardNumber: '4111111111114242'},
        },
      ],
    });
    el.presentationMode = 'embedded';
    (
      el as unknown as {
        pendingAction?: string;
      }
    ).pendingAction = 'attach-payment-source';
    el.requestUpdate();
    await flushElement(el);

    const region = el.shadowRoot!.querySelector<HTMLElement>(
      '[data-embedded-payment-select-region]'
    )!;
    const progress = region.querySelector<HTMLElement>(
      '[data-embedded-attach-progress]'
    )!;

    assert.equal(region.getAttribute('aria-busy'), 'true');
    assert.equal(progress.getAttribute('aria-label'), 'Securing payment method');
    assert.exists(region.querySelector('.embedded-attach-spinner'));
  });

  test('embedded selectors promote native and default options while keeping add last', async () => {
    const interactionResponse: InteractionResponse = {
      interactionId: 'interaction-payment',
      status: 'PAYMENT_SOURCE_REQUESTED',
      features: ['SELECT', 'ADD_ACCOUNT'],
      allowedTenderTypes: ['CARD', 'BANK_ACCOUNT', 'NATIVE_ACCOUNT'],
      paymentSources: [
        {
          tenderType: 'Card',
          id: 'card-other',
          name: 'Other card',
          verificationInfo: {status: 'VERIFIED'},
          recipient: {id: 'recipient-other', status: 'PROVISIONED'},
          card: {network: 'Visa', cardNumber: '4111111111111111'},
        },
        {
          tenderType: 'Card',
          id: 'card-default',
          name: 'Default card',
          isDefault: true,
          verificationInfo: {status: 'VERIFIED'},
          recipient: {id: 'recipient-default', status: 'PROVISIONED'},
          card: {network: 'Visa', cardNumber: '4111111111114242'},
        },
        {
          tenderType: 'NativeAccount',
          id: 'native-account-1',
          name: 'Commerce wallet - Earnings',
          verificationInfo: {status: 'VERIFIED'},
          account: {
            positionId: 'wallet-position-7890',
            nickName: 'Commerce wallet',
            productType: 'Wallet',
            token: 'native-token-1',
          },
        },
      ],
    };
    const el = (await fixture(
      testingHtml`<commerce-hub-connect
        .presentationMode=${'embedded'}
        .interactionResponse=${interactionResponse}
        .baseURL=${TEST_COMMERCE_HUB_BASE_URL}
      ></commerce-hub-connect>`
    )) as CommerceHubConnect;
    await flushElement(el);

    const select = el.shadowRoot!.querySelector<HTMLSelectElement>(
      '[data-embedded-payment-select]'
    )!;
    const orderedSelectOptions = [...select.options]
      .filter((option) => option.value)
      .map((option) => option.value);
    assert.deepEqual(orderedSelectOptions, [
      'native-account-1',
      'card-default',
      'card-other',
      '__chc_add_payment__',
    ]);
    assert.equal(select.value, 'card-default');

    el.setAttribute('embedded-selector-mode', 'radio-list');
    await flushElement(el);
    el.shadowRoot!
      .querySelector<HTMLButtonElement>(
        '[data-action="toggle-embedded-payment-selector"]'
      )!
      .click();
    await flushElement(el);

    const orderedRows = [
      ...el.shadowRoot!.querySelectorAll<HTMLElement>(
        '[role="listbox"] [data-payment-method-id], [role="listbox"] [data-action="open-embedded-add-payment-dialog"]'
      ),
    ].map((row) => row.dataset.paymentMethodId ?? '__chc_add_payment__');
    assert.deepEqual(orderedRows, [
      'native-account-1',
      'card-default',
      'card-other',
      '__chc_add_payment__',
    ]);
    assert.include(
      el.shadowRoot!.querySelector('[data-action="toggle-embedded-payment-selector"]')
        ?.textContent ?? '',
      'Default card'
    );
  });

  test('embedded SELECT-only does not show payment methods chrome while refreshing', async () => {
    const refreshResponse = createDeferred<Response>();
    window.fetch = async () => refreshResponse.promise;
    const interactionResponse: InteractionResponse = {
      interactionId: 'interaction-payment',
      status: 'PAYMENT_SOURCE_REQUESTED',
      features: ['SELECT'],
      paymentSources: [],
    };
    const el = (await fixture(
      testingHtml`<commerce-hub-connect
        .presentationMode=${'embedded'}
        .interactionResponse=${interactionResponse}
        .baseURL=${TEST_COMMERCE_HUB_BASE_URL}
      ></commerce-hub-connect>`
    )) as CommerceHubConnect;
    await flushElement(el);

    assert.exists(
      el.shadowRoot!.querySelector('[data-embedded-payment-select]')
    );
    assert.notInclude(el.shadowRoot!.textContent ?? '', 'Payment methods');
    assert.notExists(el.shadowRoot!.querySelector('.widget-shell'));

    refreshResponse.resolve(
      new Response(JSON.stringify(interactionResponse), {
        status: 200,
        headers: {'Content-Type': 'application/json'},
      })
    );
  });

  test('dialog SELECT-only keeps the payment method list', async () => {
    const el = await renderConnect({
      interactionId: 'interaction-payment',
      status: 'PAYMENT_SOURCE_REQUESTED',
      features: ['SELECT'],
      paymentSources: [
        {
          tenderType: 'Card',
          id: 'card-1',
          name: 'Corporate card',
          verificationInfo: {status: 'VERIFIED'},
          card: {network: 'Visa', cardNumber: '4111111111111111'},
        },
      ],
    });

    assert.notExists(
      el.shadowRoot!.querySelector('[data-embedded-payment-select]')
    );
    assert.exists(el.shadowRoot!.querySelector('.payment-method-row'));
  });

  test('missing verification status is not selectable or markable as default', async () => {
    const el = await renderConnect({
      interactionId: 'interaction-payment',
      status: 'PAYMENT_SOURCE_REQUESTED',
      features: ['ADD_ACCOUNT', 'SELECT'],
      paymentSources: [
        {
          tenderType: 'Card',
          id: 'card-without-verification-status',
          name: 'Unverified card',
          card: {
            network: 'Visa',
            cardNumber: '4111111111111111',
          },
        },
        {
          tenderType: 'Card',
          id: 'card-default',
          name: 'Default card',
          isDefault: true,
          verificationInfo: {status: 'VERIFIED'},
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
    const useSelectedButton = el.shadowRoot!.querySelector<HTMLButtonElement>(
      '[data-action="attach-payment-source"]'
    )!;

    assert.notExists(row.querySelector('.verification-status-badge'));
    assert.notExists(row.querySelector('.payment-method-radio'));
    assert.isTrue(useSelectedButton.disabled);

    row
      .querySelector<HTMLButtonElement>(
        '[data-action="toggle-payment-source-menu"]'
      )!
      .click();
    await flushElement(el);

    assert.notExists(
      row.querySelector('[data-action="mark-payment-source-default"]')
    );
    assert.deepEqual(
      [
        ...el.shadowRoot!.querySelectorAll<HTMLElement>(
          '.payment-method-row'
        ),
      ].map((row) => row.dataset.paymentMethodId),
      ['card-default', 'card-1']
    );
  });

  test('recipient provisioning controls verified bank labels and selection radios', async () => {
    const el = await renderConnect({
      interactionId: 'interaction-payment',
      status: 'PAYMENT_SOURCE_REQUESTED',
      features: ['SELECT'],
      paymentSources: [
        {
          tenderType: 'BankAccount',
          id: 'bank-without-recipient',
          name: 'Existing bank',
          verificationInfo: {status: 'VERIFIED'},
          bankAccount: {accountNumber: '1111111111'},
        },
        {
          tenderType: 'BankAccount',
          id: 'bank-provisioned',
          name: 'Status-provisioned bank',
          verificationInfo: {status: 'VERIFIED'},
          recipient: {id: 'recipient-1', status: 'PROVISIONED'},
          bankAccount: {accountNumber: '2222222222'},
        },
        {
          tenderType: 'BankAccount',
          id: 'bank-provision-status-provisioned',
          name: 'Provision-status-provisioned bank',
          verificationInfo: {status: 'VERIFIED'},
          recipient: {
            id: 'recipient-2',
            provisionStatus: 'PROVISIONED',
          },
          bankAccount: {accountNumber: '5555555555'},
        },
        {
          tenderType: 'BankAccount',
          id: 'bank-recipient-pending',
          name: 'Pending recipient bank',
          verificationInfo: {status: 'VERIFIED'},
          recipient: {id: 'recipient-3', status: 'PENDING'},
          bankAccount: {accountNumber: '3333333333'},
        },
        {
          tenderType: 'BankAccount',
          id: 'bank-recipient-blank',
          name: 'Blank recipient bank',
          verificationInfo: {status: 'VERIFIED'},
          recipient: {id: 'recipient-4', status: '   '},
          bankAccount: {accountNumber: '4444444444'},
        },
      ],
    });
    const rows = [
      ...el.shadowRoot!.querySelectorAll<HTMLElement>('.payment-method-row'),
    ];
    const radios = [
      ...el.shadowRoot!.querySelectorAll<HTMLInputElement>(
        '.payment-method-radio'
      ),
    ];

    assert.deepEqual(
      rows.map((row) =>
        row.querySelector('.verification-status-badge')?.textContent?.trim()
      ),
      [
        'Verified, Pending',
        'Verified, Provisioned',
        'Verified, Provisioned',
        'Verified, Pending',
        'Verified, Pending',
      ]
    );
    assert.deepEqual(
      radios.map((radio) => radio.value),
      ['bank-provisioned', 'bank-provision-status-provisioned']
    );
    assert.isTrue(radios[0].checked);
    assert.notExists(rows[3].querySelector('.payment-method-radio'));
    assert.notExists(rows[4].querySelector('.payment-method-radio'));
  });

  test('verified bank with a non-provisioned recipient leaves selection disabled', async () => {
    const el = await renderConnect({
      interactionId: 'interaction-payment',
      status: 'PAYMENT_SOURCE_REQUESTED',
      features: ['SELECT'],
      paymentSources: [
        {
          tenderType: 'BankAccount',
          id: 'bank-recipient-pending',
          name: 'Pending recipient bank',
          verificationInfo: {status: 'VERIFIED'},
          recipient: {id: 'recipient-2', status: 'PENDING'},
          bankAccount: {accountNumber: '3333333333'},
        },
      ],
    });

    assert.equal(
      el
        .shadowRoot!.querySelector('.verification-status-badge')
        ?.textContent?.trim(),
      'Verified, Pending'
    );
    assert.notExists(el.shadowRoot!.querySelector('.payment-method-radio'));
    assert.isTrue(
      el.shadowRoot!.querySelector<HTMLButtonElement>(
        '[data-action="attach-payment-source"]'
      )!.disabled
    );
  });

  test('recipient provisioning controls verified card labels and selection radios', async () => {
    const el = await renderConnect({
      interactionId: 'interaction-payment',
      status: 'PAYMENT_SOURCE_REQUESTED',
      features: ['SELECT'],
      paymentSources: [
        {
          tenderType: 'Card',
          id: 'card-without-recipient',
          name: 'Existing card',
          verificationInfo: {status: 'VERIFIED'},
          card: {cardNumber: '4111111111111111'},
        },
        {
          tenderType: 'Card',
          id: 'card-status-provisioned',
          name: 'Status-provisioned card',
          verificationInfo: {status: 'VERIFIED'},
          recipient: {id: 'recipient-1', status: 'PROVISIONED'},
          card: {cardNumber: '4222222222222222'},
        },
        {
          tenderType: 'Card',
          id: 'card-provision-status-provisioned',
          name: 'Provision-status-provisioned card',
          verificationInfo: {status: 'VERIFIED'},
          recipient: {
            id: 'recipient-2',
            provisionStatus: 'PROVISIONED',
          },
          card: {cardNumber: '4333333333333333'},
        },
        {
          tenderType: 'Card',
          id: 'card-recipient-pending',
          name: 'Pending recipient card',
          verificationInfo: {status: 'VERIFIED'},
          recipient: {
            id: 'recipient-3',
            provisionStatus: 'PENDING_PROVISIONING',
          },
          card: {cardNumber: '4444444444444444'},
        },
      ],
    });
    const rows = [
      ...el.shadowRoot!.querySelectorAll<HTMLElement>('.payment-method-row'),
    ];
    const radios = [
      ...el.shadowRoot!.querySelectorAll<HTMLInputElement>(
        '.payment-method-radio'
      ),
    ];

    assert.deepEqual(
      rows.map((row) =>
        row.querySelector('.verification-status-badge')?.textContent?.trim()
      ),
      [
        'Verified, Pending',
        'Verified, Provisioned',
        'Verified, Provisioned',
        'Verified, Pending',
      ]
    );
    assert.deepEqual(
      radios.map((radio) => radio.value),
      ['card-status-provisioned', 'card-provision-status-provisioned']
    );
    assert.isTrue(radios[0].checked);
    assert.notExists(rows[0].querySelector('.payment-method-radio'));
    assert.notExists(rows[3].querySelector('.payment-method-radio'));
  });

  test('initial interaction refresh replaces stale host payment sources with the server response', async () => {
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
              id: 'server-card',
              name: 'Server Visa',
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
    };

    const el = await renderConnect(
      {
        interactionId: 'interaction-payment',
        status: 'PAYMENT_SOURCE_REQUESTED',
        paymentSources: [
          {
            tenderType: 'Card',
            id: 'stale-card',
            name: 'Stale Mastercard',
            verificationInfo: {status: 'VERIFIED'},
            card: {
              network: 'Mastercard',
              cardNumber: '5555555555554444',
            },
          },
        ],
      },
      TEST_COMMERCE_HUB_BASE_URL,
      {initialInteractionResponse: false}
    );

    await waitFor(
      () =>
        el
          .shadowRoot!.querySelector('.payment-method-title')
          ?.textContent?.trim() === 'Server Visa',
      'server payment method was not shown'
    );

    assert.deepEqual(
      requests.map(
        (request) => `${request.method} ${new URL(request.url).pathname}`
      ),
      ['GET /interaction']
    );
    assert.notInclude(el.shadowRoot!.textContent ?? '', 'Stale Mastercard');
    assert.deepEqual(
      el.interactionResponse?.paymentSources?.map((source) => source.id),
      ['server-card']
    );
  });

  test('stale interaction refresh cannot overwrite or clear a newer interaction refresh', async () => {
    const requests: CapturedRequest[] = [];
    const interactionA = createDeferred<Response>();
    const interactionB = createDeferred<Response>();

    window.fetch = async (input: RequestInfo | URL) => {
      const request = input instanceof Request ? input : new Request(input);
      const interactionId = request.headers.get('x-interaction-id');

      requests.push({
        url: request.url,
        method: request.method,
        headers: new Headers(request.headers),
        bodyText: await request.clone().text(),
        credentials: request.credentials,
      });

      return interactionId === 'interaction-a'
        ? interactionA.promise
        : interactionB.promise;
    };

    const el = await renderConnect(
      {
        interactionId: 'interaction-a',
        status: 'PAYMENT_SOURCE_REQUESTED',
        paymentSources: [],
      },
      TEST_COMMERCE_HUB_BASE_URL,
      {initialInteractionResponse: false}
    );
    const {listPaymentMethodsEvents} = recordOutputEvents(el);

    await waitFor(
      () =>
        requests.some(
          (request) =>
            request.headers.get('x-interaction-id') === 'interaction-a'
        ),
      'interaction A refresh did not start'
    );

    el.interactionResponse = {
      interactionId: 'interaction-b',
      status: 'PAYMENT_SOURCE_REQUESTED',
      paymentSources: [],
    };
    await flushElement(el);
    await waitFor(
      () =>
        requests.some(
          (request) =>
            request.headers.get('x-interaction-id') === 'interaction-b'
        ),
      'interaction B refresh did not start'
    );

    interactionA.resolve(
      new Response(
        JSON.stringify({
          interactionId: 'interaction-a',
          status: 'PAYMENT_SOURCE_REQUESTED',
          paymentSources: [
            {
              tenderType: 'Card',
              id: 'card-a',
              name: 'Stale interaction A card',
              verificationInfo: {status: 'VERIFIED'},
              card: {network: 'Visa', cardNumber: '4111111111111111'},
            },
          ],
        }),
        {status: 200, headers: {'Content-Type': 'application/json'}}
      )
    );
    await flushElement(el);

    const deduplicatedBRefresh = (
      el as unknown as {
        fetchInteraction: (
          interactionId: string
        ) => Promise<InteractionResponse>;
      }
    ).fetchInteraction('interaction-b');

    assert.lengthOf(
      requests.filter(
        (request) => request.headers.get('x-interaction-id') === 'interaction-b'
      ),
      1
    );
    assert.equal(el.interactionResponse?.interactionId, 'interaction-b');
    assert.lengthOf(listPaymentMethodsEvents, 0);

    interactionB.resolve(
      new Response(
        JSON.stringify({
          interactionId: 'interaction-b',
          status: 'PAYMENT_SOURCE_REQUESTED',
          paymentSources: [
            {
              tenderType: 'Card',
              id: 'card-b',
              name: 'Current interaction B card',
              verificationInfo: {status: 'VERIFIED'},
              card: {network: 'Mastercard', cardNumber: '5555555555554444'},
            },
          ],
        }),
        {status: 200, headers: {'Content-Type': 'application/json'}}
      )
    );
    await deduplicatedBRefresh;
    await flushElement(el);

    assert.equal(el.interactionResponse?.interactionId, 'interaction-b');
    assert.deepEqual(
      el.interactionResponse?.paymentSources?.map((source) => source.id),
      ['card-b']
    );
    assert.lengthOf(listPaymentMethodsEvents, 1);
    assert.deepEqual(
      listPaymentMethodsEvents[0].detail.map((source) => source.id),
      ['card-b']
    );
    assert.lengthOf(requests, 2);
  });

  test('suspended fresh refresh rejects after interaction reset without disturbing the new refresh', async () => {
    const requests: CapturedRequest[] = [];
    const interactionA = createDeferred<Response>();
    const interactionB = createDeferred<Response>();
    const freshInteractionB = createDeferred<Response>();
    const interactionC = createDeferred<Response>();
    let interactionBRequestCount = 0;

    window.fetch = async (input: RequestInfo | URL) => {
      const request = input instanceof Request ? input : new Request(input);
      const interactionId = request.headers.get('x-interaction-id');

      requests.push({
        url: request.url,
        method: request.method,
        headers: new Headers(request.headers),
        bodyText: await request.clone().text(),
        credentials: request.credentials,
      });

      if (interactionId === 'interaction-a') {
        return interactionA.promise;
      }

      if (interactionId === 'interaction-b') {
        interactionBRequestCount += 1;
        return interactionBRequestCount === 1
          ? interactionB.promise
          : freshInteractionB.promise;
      }

      return interactionC.promise;
    };

    const el = await renderConnect(
      {
        interactionId: 'interaction-a',
        status: 'PAYMENT_SOURCE_REQUESTED',
        paymentSources: [],
      },
      TEST_COMMERCE_HUB_BASE_URL,
      {initialInteractionResponse: false}
    );
    const {listPaymentMethodsEvents} = recordOutputEvents(el);
    const refreshMethods = el as unknown as {
      fetchInteraction: (interactionId: string) => Promise<InteractionResponse>;
      fetchFreshInteraction: (
        interactionId: string
      ) => Promise<InteractionResponse>;
    };

    await waitFor(
      () =>
        requests.some(
          (request) =>
            request.headers.get('x-interaction-id') === 'interaction-a'
        ),
      'interaction A refresh did not start'
    );
    const staleFreshResult = refreshMethods
      .fetchFreshInteraction('interaction-a')
      .then(
        () => undefined,
        (cause: unknown) => cause
      );

    el.interactionResponse = {
      interactionId: 'interaction-b',
      status: 'PAYMENT_SOURCE_REQUESTED',
      paymentSources: [],
    };
    await flushElement(el);
    await waitFor(
      () =>
        requests.some(
          (request) =>
            request.headers.get('x-interaction-id') === 'interaction-b'
        ),
      'interaction B refresh did not start'
    );

    interactionA.resolve(
      new Response(
        JSON.stringify({
          interactionId: 'interaction-a',
          status: 'PAYMENT_SOURCE_REQUESTED',
          paymentSources: [],
        }),
        {status: 200, headers: {'Content-Type': 'application/json'}}
      )
    );
    const staleCause = await staleFreshResult;
    const deduplicatedBRefresh =
      refreshMethods.fetchInteraction('interaction-b');

    assert.instanceOf(staleCause, Error);
    assert.include((staleCause as Error).message, 'stale');
    assert.lengthOf(
      requests.filter(
        (request) => request.headers.get('x-interaction-id') === 'interaction-a'
      ),
      1
    );
    assert.lengthOf(
      requests.filter(
        (request) => request.headers.get('x-interaction-id') === 'interaction-b'
      ),
      1
    );

    interactionB.resolve(
      new Response(
        JSON.stringify({
          interactionId: 'interaction-b',
          status: 'PAYMENT_SOURCE_REQUESTED',
          paymentSources: [
            {
              tenderType: 'Card',
              id: 'card-b',
              name: 'Current interaction B card',
              verificationInfo: {status: 'VERIFIED'},
              card: {network: 'Visa', cardNumber: '4111111111114242'},
            },
          ],
        }),
        {status: 200, headers: {'Content-Type': 'application/json'}}
      )
    );
    await deduplicatedBRefresh;
    await flushElement(el);

    const immediateStaleCause = await refreshMethods
      .fetchFreshInteraction('interaction-a')
      .then(
        () => undefined,
        (cause: unknown) => cause
      );

    assert.instanceOf(immediateStaleCause, Error);
    assert.include((immediateStaleCause as Error).message, 'stale');
    assert.equal(el.interactionResponse?.interactionId, 'interaction-b');
    assert.deepEqual(
      el.interactionResponse?.paymentSources?.map((source) => source.id),
      ['card-b']
    );
    assert.lengthOf(listPaymentMethodsEvents, 1);
    assert.lengthOf(requests, 2);

    const midFlightFreshResult = refreshMethods
      .fetchFreshInteraction('interaction-b')
      .then(
        () => undefined,
        (cause: unknown) => cause
      );
    await waitFor(
      () => interactionBRequestCount === 2,
      'fresh interaction B request did not start'
    );

    el.interactionResponse = {
      interactionId: 'interaction-c',
      status: 'PAYMENT_SOURCE_REQUESTED',
      paymentSources: [],
    };
    await flushElement(el);
    await waitFor(
      () =>
        requests.some(
          (request) =>
            request.headers.get('x-interaction-id') === 'interaction-c'
        ),
      'interaction C refresh did not start'
    );

    freshInteractionB.resolve(
      new Response(
        JSON.stringify({
          interactionId: 'interaction-b',
          status: 'PAYMENT_SOURCE_REQUESTED',
          paymentSources: [],
        }),
        {status: 200, headers: {'Content-Type': 'application/json'}}
      )
    );
    const midFlightStaleCause = await midFlightFreshResult;
    const deduplicatedCRefresh =
      refreshMethods.fetchInteraction('interaction-c');

    assert.instanceOf(midFlightStaleCause, Error);
    assert.include((midFlightStaleCause as Error).message, 'stale');
    assert.lengthOf(
      requests.filter(
        (request) => request.headers.get('x-interaction-id') === 'interaction-c'
      ),
      1
    );

    interactionC.resolve(
      new Response(
        JSON.stringify({
          interactionId: 'interaction-c',
          status: 'PAYMENT_SOURCE_REQUESTED',
          paymentSources: [
            {
              tenderType: 'Card',
              id: 'card-c',
              name: 'Current interaction C card',
              verificationInfo: {status: 'VERIFIED'},
              card: {network: 'Visa', cardNumber: '4111111111111111'},
            },
          ],
        }),
        {status: 200, headers: {'Content-Type': 'application/json'}}
      )
    );
    await deduplicatedCRefresh;
    await flushElement(el);

    assert.equal(el.interactionResponse?.interactionId, 'interaction-c');
    assert.deepEqual(
      el.interactionResponse?.paymentSources?.map((source) => source.id),
      ['card-c']
    );
    assert.lengthOf(listPaymentMethodsEvents, 2);
    assert.lengthOf(requests, 4);
  });

  test('failed fresh refresh rejects as stale after interaction reset without disturbing the new refresh', async () => {
    const requests: CapturedRequest[] = [];
    const freshInteractionA = createDeferred<Response>();
    const interactionB = createDeferred<Response>();

    window.fetch = async (input: RequestInfo | URL) => {
      const request = input instanceof Request ? input : new Request(input);
      const interactionId = request.headers.get('x-interaction-id');

      requests.push({
        url: request.url,
        method: request.method,
        headers: new Headers(request.headers),
        bodyText: await request.clone().text(),
        credentials: request.credentials,
      });

      return interactionId === 'interaction-a'
        ? freshInteractionA.promise
        : interactionB.promise;
    };

    const el = await renderConnect({
      interactionId: 'interaction-a',
      status: 'PAYMENT_SOURCE_REQUESTED',
      paymentSources: [],
    });
    const {listPaymentMethodsEvents} = recordOutputEvents(el);
    const refreshMethods = el as unknown as {
      fetchInteraction: (interactionId: string) => Promise<InteractionResponse>;
      fetchFreshInteraction: (
        interactionId: string
      ) => Promise<InteractionResponse>;
    };
    const staleRefreshResult = refreshMethods
      .fetchFreshInteraction('interaction-a')
      .then(
        () => undefined,
        (cause: unknown) => cause
      );

    await waitFor(
      () =>
        requests.some(
          (request) =>
            request.headers.get('x-interaction-id') === 'interaction-a'
        ),
      'fresh interaction A refresh did not start'
    );

    el.interactionResponse = {
      interactionId: 'interaction-b',
      status: 'PAYMENT_SOURCE_REQUESTED',
      paymentSources: [],
    };
    await flushElement(el);
    await waitFor(
      () =>
        requests.some(
          (request) =>
            request.headers.get('x-interaction-id') === 'interaction-b'
        ),
      'interaction B refresh did not start'
    );

    freshInteractionA.reject(new Error('Interaction A refresh failed'));
    const staleCause = await staleRefreshResult;
    const deduplicatedBRefresh =
      refreshMethods.fetchInteraction('interaction-b');

    assert.instanceOf(staleCause, StaleInteractionRefreshError);
    assert.equal(el.interactionResponse?.interactionId, 'interaction-b');
    assert.lengthOf(listPaymentMethodsEvents, 0);
    assert.notExists(
      el.shadowRoot!.querySelector('[data-action="retry-interaction-refresh"]')
    );
    assert.lengthOf(
      requests.filter(
        (request) => request.headers.get('x-interaction-id') === 'interaction-b'
      ),
      1
    );

    interactionB.resolve(
      new Response(
        JSON.stringify({
          interactionId: 'interaction-b',
          status: 'PAYMENT_SOURCE_REQUESTED',
          paymentSources: [
            {
              tenderType: 'Card',
              id: 'card-b',
              name: 'Current interaction B card',
              verificationInfo: {status: 'VERIFIED'},
              card: {network: 'Visa', cardNumber: '4111111111114242'},
            },
          ],
        }),
        {status: 200, headers: {'Content-Type': 'application/json'}}
      )
    );
    await deduplicatedBRefresh;
    await flushElement(el);

    assert.equal(el.interactionResponse?.interactionId, 'interaction-b');
    assert.deepEqual(
      el.interactionResponse?.paymentSources?.map((source) => source.id),
      ['card-b']
    );
    assert.lengthOf(listPaymentMethodsEvents, 1);
    assert.deepEqual(
      listPaymentMethodsEvents[0].detail.map((source) => source.id),
      ['card-b']
    );
    assert.lengthOf(requests, 2);
  });

  test('initial interaction refresh loads saved methods when the host payment sources are empty', async () => {
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
              tenderType: 'BankAccount',
              id: 'server-bank',
              name: 'Server checking',
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
    };

    const el = await renderConnect(
      {
        interactionId: 'interaction-payment',
        status: 'PAYMENT_SOURCE_REQUESTED',
        paymentSources: [],
      },
      TEST_COMMERCE_HUB_BASE_URL,
      {initialInteractionResponse: false}
    );

    await waitFor(
      () =>
        el
          .shadowRoot!.querySelector('.payment-method-title')
          ?.textContent?.trim() === 'Server checking',
      'server saved method was not shown'
    );

    assert.deepEqual(
      requests.map(
        (request) => `${request.method} ${new URL(request.url).pathname}`
      ),
      ['GET /interaction']
    );
  });

  test('authoritative empty payment sources clear a stale selected source', async () => {
    const staleSource: PaymentSource = {
      tenderType: 'Card',
      id: 'stale-card',
      name: 'Stale selected card',
      verificationInfo: {status: 'VERIFIED'},
      card: {network: 'Visa', cardNumber: '4111111111111111'},
    };

    window.fetch = async () =>
      new Response(
        JSON.stringify({
          interactionId: 'interaction-payment',
          status: 'PAYMENT_SOURCE_REQUESTED',
          allowedTenderTypes: ['CARD'],
          paymentSources: [],
        }),
        {status: 200, headers: {'Content-Type': 'application/json'}}
      );

    const el = await renderConnect(
      {
        interactionId: 'interaction-payment',
        status: 'PAYMENT_SOURCE_ATTACHED',
        allowedTenderTypes: ['CARD'],
        selectedSource: staleSource,
        paymentSources: [staleSource],
      },
      TEST_COMMERCE_HUB_BASE_URL,
      {initialInteractionResponse: false}
    );

    await waitFor(
      () =>
        Boolean(
          el.shadowRoot!.querySelector('.source-action[data-action="add-card"]')
        ),
      'authoritative empty direct-add state did not render'
    );

    assert.isUndefined(el.interactionResponse?.selectedSource);
    assert.deepEqual(el.interactionResponse?.paymentSources, []);
    assert.notInclude(el.shadowRoot!.textContent ?? '', 'Stale selected card');
    assert.notExists(el.shadowRoot!.querySelector('.payment-method-row'));
    assert.notExists(
      el.shadowRoot!.querySelector('.payment-method-default-label')
    );
    assert.exists(
      el.shadowRoot!.querySelector('.source-action[data-action="add-card"]')
    );
  });

  test('initial interaction refresh blocks stale selected-source UI until the server response arrives', async () => {
    const requests: CapturedRequest[] = [];
    const deferred = createDeferred<Response>();

    window.fetch = async (input: RequestInfo | URL) => {
      const request = input instanceof Request ? input : new Request(input);

      requests.push({
        url: request.url,
        method: request.method,
        headers: new Headers(request.headers),
        bodyText: await request.clone().text(),
        credentials: request.credentials,
      });

      return deferred.promise;
    };

    const el = await renderConnect(
      {
        interactionId: 'interaction-payment',
        status: 'PAYMENT_SOURCE_ATTACHED',
        selectedSource: {
          tenderType: 'Card',
          id: 'stale-card',
          name: 'Stale selected card',
          verificationInfo: {status: 'VERIFIED'},
          card: {
            network: 'Visa',
            cardNumber: '4111111111111111',
          },
        },
        paymentSources: [
          {
            tenderType: 'Card',
            id: 'stale-card',
            name: 'Stale selected card',
            verificationInfo: {status: 'VERIFIED'},
            card: {
              network: 'Visa',
              cardNumber: '4111111111111111',
            },
          },
        ],
      },
      TEST_COMMERCE_HUB_BASE_URL,
      {initialInteractionResponse: false}
    );

    assert.exists(el.shadowRoot!.querySelector('.payment-method-skeletons'));
    assert.exists(
      el.shadowRoot!.querySelector('.payment-method-toolbar-skeleton')
    );
    assert.notExists(el.shadowRoot!.querySelector('.selected-payment-method'));
    assert.notInclude(el.shadowRoot!.textContent ?? '', 'Stale selected card');

    deferred.resolve(
      new Response(
        JSON.stringify({
          interactionId: 'interaction-payment',
          status: 'PAYMENT_SOURCE_ATTACHED',
          selectedSource: {
            tenderType: 'Card',
            id: 'server-card',
            name: 'Server selected card',
            verificationInfo: {status: 'VERIFIED'},
            card: {
              network: 'Visa',
              cardNumber: '4111111111114242',
            },
          },
          paymentSources: [
            {
              tenderType: 'Card',
              id: 'server-card',
              name: 'Server selected card',
              verificationInfo: {status: 'VERIFIED'},
              card: {
                network: 'Visa',
                cardNumber: '4111111111114242',
              },
            },
          ],
        }),
        {status: 200, headers: {'Content-Type': 'application/json'}}
      )
    );

    await waitFor(
      () =>
        el
          .shadowRoot!.querySelector(
            '.selected-payment-method .payment-method-title'
          )
          ?.textContent?.trim() === 'Server selected card',
      'server selected source was not shown'
    );

    assert.deepEqual(
      requests.map(
        (request) => `${request.method} ${new URL(request.url).pathname}`
      ),
      ['GET /interaction']
    );
  });

  test('initial interaction refresh sends interaction and gateway auth headers while preserving oauth', async () => {
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
              id: 'server-card',
              name: 'Server Visa',
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
    };

    const el = await renderConnect(
      {
        interactionId: 'interaction-payment',
        status: 'PAYMENT_SOURCE_REQUESTED',
        oauth: {access_token: 'gateway-token'},
        paymentSources: [
          {
            tenderType: 'Card',
            id: 'stale-card',
            name: 'Stale Mastercard',
            verificationInfo: {status: 'VERIFIED'},
            card: {
              network: 'Mastercard',
              cardNumber: '5555555555554444',
            },
          },
        ],
      },
      TEST_COMMERCE_HUB_BASE_URL,
      {initialInteractionResponse: false}
    );

    await waitFor(
      () =>
        el
          .shadowRoot!.querySelector('.payment-method-title')
          ?.textContent?.trim() === 'Server Visa',
      'server payment method was not shown'
    );

    assert.equal(
      requests[0].headers.get('x-interaction-id'),
      'interaction-payment'
    );
    assert.equal(
      requests[0].headers.get('Authorization'),
      'Bearer gateway-token'
    );
    assert.equal(el.interactionResponse?.oauth?.access_token, 'gateway-token');
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
          name: 'Digital wallet - Earnings',
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
      'Wallet xx 7890'
    );
    assert.exists(rows[3].querySelector('[data-payment-method-icon="native"]'));
    assert.exists(
      el.shadowRoot!.querySelector('[data-action="open-add-payment-source"]')
    );
    assert.notExists(el.shadowRoot!.querySelector('[data-action="add-card"]'));
    assert.notExists(
      el.shadowRoot!.querySelector('[data-action="add-bank-account"]')
    );
    assert.notExists(
      el.shadowRoot!.querySelector('[data-action="add-ach-manually"]')
    );
  });

  test('shows only native accounts whose name ends with the Earnings suffix', async () => {
    window.fetch = async () =>
      new Response(JSON.stringify({}), {
        status: 200,
        headers: {'Content-Type': 'application/json'},
      });

    const nativeSource = (
      id: string,
      name: string | undefined,
      positionId: string
    ): PaymentSource => ({
      tenderType: 'NativeAccount',
      id,
      name,
      verificationInfo: {status: 'VERIFIED'},
      account: {
        positionId,
        nickName: name ?? 'Unnamed native account',
        productType: 'FFPTXNEARN',
        token: `${id}-token`,
      },
    });

    const el = await renderConnect({
      interactionId: 'interaction-earnings-filter',
      status: 'PAYMENT_SOURCE_REQUESTED',
      allowedTenderTypes: ['CARD', 'BANK_ACCOUNT', 'NATIVE_ACCOUNT'],
      paymentSources: [
        {
          tenderType: 'Card',
          id: 'card-1',
          name: 'Corporate card',
          verificationInfo: {status: 'VERIFIED'},
          card: {network: 'Visa', cardNumber: '4111111111114242'},
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
        nativeSource('native-exact', 'Primary - Earnings', 'position-exact'),
        nativeSource(
          'native-spaced',
          'Reserve - Earnings   ',
          'position-spaced'
        ),
        nativeSource(
          'native-lowercase',
          'Primary - earnings',
          'position-lowercase'
        ),
        nativeSource('native-middle', 'Earnings - Reserve', 'position-middle'),
        nativeSource('native-missing', undefined, 'position-missing'),
      ],
    });

    const renderedIds = [
      ...el.shadowRoot!.querySelectorAll<HTMLElement>('.payment-method-row'),
    ].map((row) => row.dataset.paymentMethodId);

    assert.deepEqual(renderedIds, [
      'native-exact',
      'native-spaced',
      'card-1',
      'bank-1',
    ]);

    const earningsRow = el.shadowRoot!.querySelector<HTMLElement>(
      '[data-payment-method-id="native-exact"]'
    )!;
    assert.isTrue(
      earningsRow.classList.contains(
        'payment-method-row-featured-informational'
      )
    );
    assert.notExists(earningsRow.querySelector('.payment-method-radio'));
    assert.notExists(
      earningsRow.querySelector('[data-action="toggle-payment-source-menu"]')
    );
    assert.notExists(earningsRow.querySelector('.verification-status-badge'));
  });

  test('fades a partially visible next payment method when the list overflows', async () => {
    const paymentSources: PaymentSource[] = Array.from(
      {length: 10},
      (_, index) => ({
        tenderType: 'Card',
        id: `card-${index + 1}`,
        name: `Card ${index + 1}`,
        verificationInfo: {status: 'VERIFIED'},
        card: {
          network: 'Visa',
          cardNumber: `411111111111${String(index).padStart(4, '0')}`,
        },
      })
    );
    const el = await renderConnect({
      interactionId: 'interaction-payment',
      status: 'PAYMENT_SOURCE_REQUESTED',
      paymentSources,
    });
    const list = el.shadowRoot!.querySelector<HTMLElement>('.primitive-stack')!;
    const rows = [...list.querySelectorAll<HTMLElement>('.payment-method-row')];
    const listStyles = getComputedStyle(list);
    const listBottom = list.getBoundingClientRect().bottom;

    assert.isAbove(list.scrollHeight, list.clientHeight);
    assert.isTrue(
      rows.some((row) => {
        const bounds = row.getBoundingClientRect();
        return bounds.top < listBottom && bounds.bottom > listBottom;
      })
    );
    assert.include(listStyles.maskImage, 'linear-gradient');
    assert.include(listStyles.webkitMaskImage, 'linear-gradient');
    assert.include(listStyles.maskImage, 'rgba(0, 0, 0, 0.55)');
    assert.equal(listStyles.paddingBottom, '48px');
    assert.equal(listStyles.rowGap, '1px');

    rows[0]
      .querySelector<HTMLButtonElement>(
        '[data-action="toggle-payment-source-menu"]'
      )!
      .click();
    await flushElement(el);
    assert.equal(getComputedStyle(list).maskImage, 'none');
    assert.equal(getComputedStyle(list).webkitMaskImage, 'none');
    assert.isTrue(rows[0].classList.contains('payment-method-row-menu-open'));
    assert.equal(getComputedStyle(rows[0]).zIndex, '5');
    rows[0]
      .querySelector<HTMLButtonElement>(
        '[data-action="toggle-payment-source-menu"]'
      )!
      .click();
    await flushElement(el);
    assert.include(getComputedStyle(list).maskImage, 'linear-gradient');

    list.scrollTop = list.scrollHeight;
    await nextFrame();

    const lastRowBounds = rows[rows.length - 1].getBoundingClientRect();
    assert.isAtMost(lastRowBounds.bottom, list.getBoundingClientRect().bottom);

    rows[rows.length - 1]
      .querySelector<HTMLButtonElement>(
        '[data-action="toggle-payment-source-menu"]'
      )!
      .click();
    await flushElement(el);
    assert.equal(getComputedStyle(list).maskImage, 'none');
    assert.equal(getComputedStyle(list).webkitMaskImage, 'none');
    const lastMenu = rows[rows.length - 1].querySelector<HTMLElement>(
      '.payment-method-menu'
    )!;
    assert.isTrue(lastMenu.classList.contains('payment-method-menu-above'));
    assert.isAtMost(
      lastMenu.getBoundingClientRect().bottom,
      rows[rows.length - 1].getBoundingClientRect().top
    );

    rows[rows.length - 1]
      .querySelector<HTMLButtonElement>(
        '[data-action="toggle-payment-source-menu"]'
      )!
      .click();
    await flushElement(el);
    assert.include(getComputedStyle(list).maskImage, 'linear-gradient');
    assert.include(getComputedStyle(list).webkitMaskImage, 'linear-gradient');
  });

  test('fetches native account balances and renders them beside the account number after row loading state', async () => {
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
          name: 'Commerce wallet - Earnings',
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
          name: 'Rewards wallet - Earnings',
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
        ?.querySelector(
          '.payment-method-meta-row .payment-method-balance-loading'
        )
    );
    assert.exists(
      el
        .shadowRoot!.querySelector(
          '[data-payment-method-id="native-account-2"]'
        )
        ?.querySelector(
          '.payment-method-meta-row .payment-method-balance-loading'
        )
    );

    balanceResponse.resolve(
      new Response(
        JSON.stringify({
          'native-account-1': {
            balance: 125.5,
          },
          'wallet-position-4321': {
            availableBalance: 9,
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
          ?.querySelector('.payment-method-meta-row .payment-method-balance')
          ?.textContent?.trim() === '$125.50',
      'expected native account balance to render'
    );

    assert.equal(
      el
        .shadowRoot!.querySelector(
          '[data-payment-method-id="native-account-2"]'
        )
        ?.querySelector('.payment-method-meta-row .payment-method-balance')
        ?.textContent?.trim(),
      '$9.00'
    );
    assert.notExists(
      el.shadowRoot!.querySelector(
        '[data-payment-method-id="native-account-1"] .payment-method-trailing .payment-method-balance'
      )
    );
  });

  test('shows native account balance when selected payment method is displayed', async () => {
    const requests: CapturedRequest[] = [];
    const balanceResponse = createDeferred<Response>();
    const nativeSource: PaymentSource = {
      tenderType: 'NativeAccount',
      id: 'native-account-1',
      name: 'Commerce wallet - Earnings',
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

      if (
        request.method === 'PATCH' &&
        pathname === '/interaction/source/native-account-1'
      ) {
        return new Response(JSON.stringify({}), {
          status: 200,
          headers: {'Content-Type': 'application/json'},
        });
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

    await markPaymentSourceAsDefault(el, 'native-account-1');
    await waitFor(
      () => el.interactionResponse?.status === 'PAYMENT_SOURCE_ATTACHED',
      'native account was not marked as default'
    );

    assert.notExists(el.shadowRoot!.querySelector('.selected-payment-method'));
    assert.exists(
      el.shadowRoot!.querySelector(
        '.payment-method-row .payment-method-balance-loading'
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
            '.payment-method-row .payment-method-balance'
          )
          ?.textContent?.trim() === '$42.25',
      'expected default native account balance to render'
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
      name: 'Commerce wallet - Earnings',
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
      features: [...TEST_INTERACTION_FEATURES],
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

  test('renders a direct card action in the empty state when card is the only allowed tender', async () => {
    const el = await renderConnect({
      interactionId: 'interaction-payment',
      status: 'PAYMENT_SOURCE_REQUESTED',
      allowedTenderTypes: ['CARD'],
      paymentSources: [],
    });
    const text = el.shadowRoot!.textContent ?? '';

    assert.equal(
      el.shadowRoot!.querySelector('.widget-title')?.textContent?.trim(),
      'Payment methods'
    );
    assert.notExists(el.shadowRoot!.querySelector('.widget-header-action'));
    assert.notExists(
      el.shadowRoot!.querySelector(
        '.widget-header-action [data-action="open-add-payment-source"]'
      )
    );
    assert.notExists(el.shadowRoot!.querySelector('.payment-method-row'));
    assert.notInclude(text, 'James Anderson');
    assert.notInclude(text, 'visa-1111');
    assert.notInclude(text, 'amex-8000');
    assert.exists(
      el.shadowRoot!.querySelector('.source-action[data-action="add-card"]')
    );
    assert.notExists(
      el.shadowRoot!.querySelector('[data-action="add-bank-account"]')
    );
    assert.notExists(
      el.shadowRoot!.querySelector('[data-action="add-ach-manually"]')
    );
    assert.notExists(
      el.shadowRoot!.querySelector('.source-action-link-chevron')
    );

    await clickAction(el, 'add-card');

    assert.equal(
      el.shadowRoot!.querySelector('.widget-title')?.textContent?.trim(),
      'Add card'
    );
    assert.notExists(el.shadowRoot!.querySelector('.add-payment-sheet'));
  });

  test('renders ordered direct card and bank actions in the ADD_ACCOUNT-only empty state', async () => {
    const el = await renderConnect({
      interactionId: 'interaction-payment',
      status: 'PAYMENT_SOURCE_REQUESTED',
      features: ['ADD_ACCOUNT'],
      allowedTenderTypes: ['CARD', 'BANK_ACCOUNT'],
      paymentSources: [],
    });

    assert.equal(
      el.shadowRoot!.querySelector('.widget-title')?.textContent?.trim(),
      'Payment methods'
    );
    assert.notExists(el.shadowRoot!.querySelector('.widget-header-action'));
    assert.notExists(
      el.shadowRoot!.querySelector(
        '.widget-header-action [data-action="open-add-payment-source"]'
      )
    );

    const sourceActions = [
      ...el.shadowRoot!.querySelectorAll<HTMLButtonElement>(
        '.payment-action-links .source-action'
      ),
    ];

    assert.deepEqual(
      sourceActions.map((button) => ({
        action: button.dataset.action,
        title: button
          .querySelector('.source-action-title')
          ?.textContent?.trim(),
        subtitle: button
          .querySelector('.source-action-subtitle')
          ?.textContent?.trim(),
      })),
      [
        {
          action: 'add-card',
          title: 'Credit or debit card',
          subtitle: 'Add your card details',
        },
        {
          action: 'add-bank-account',
          title: 'Add bank account',
          subtitle: 'Connect or enter an account',
        },
      ]
    );
    assert.equal(getComputedStyle(sourceActions[0]).borderStyle, 'dashed');
    assert.equal(getComputedStyle(sourceActions[1]).borderStyle, 'dashed');
    assert.notExists(
      el.shadowRoot!.querySelector('.source-action-link-chevron')
    );
    assert.notExists(el.shadowRoot!.querySelector('.add-payment-sheet'));

    await clickAction(el, 'add-bank-account');

    assert.equal(
      el.shadowRoot!.querySelector('.widget-title')?.textContent?.trim(),
      'Select bank account type'
    );
    assert.notExists(el.shadowRoot!.querySelector('.add-payment-sheet'));
  });

  test('renders consolidated Add payment method when selection is unavailable', async () => {
    const el = await renderConnect({
      interactionId: 'interaction-payment',
      status: 'PAYMENT_SOURCE_REQUESTED',
      features: ['ADD_ACCOUNT'],
      allowedTenderTypes: ['CARD', 'BANK_ACCOUNT'],
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

    assert.equal(
      el.shadowRoot!.querySelector('.widget-title')?.textContent?.trim(),
      'Payment methods'
    );
    assert.notExists(
      el.shadowRoot!.querySelector(
        '[data-action="mark-payment-source-default"]'
      )
    );
    assert.notExists(
      el.shadowRoot!.querySelector(
        '.widget-header-action [data-action="open-add-payment-source"]'
      )
    );

    const addFooter = el.shadowRoot!.querySelector<HTMLElement>(
      '.payment-method-add-footer'
    )!;
    const addButtons = [
      ...addFooter.querySelectorAll<HTMLButtonElement>('button'),
    ];

    assert.deepEqual(
      addButtons.map((button) => [
        button.dataset.action,
        button.textContent?.trim(),
      ]),
      [['open-add-payment-source', 'Add payment method']]
    );
    assert.isTrue(addButtons[0].classList.contains('button-primary'));
    assert.notEqual(getComputedStyle(addButtons[0]).borderStyle, 'dotted');
    assert.notExists(el.shadowRoot!.querySelector('.add-payment-sheet'));
    addButtons.forEach((button) => {
      const buttonContent = button.querySelector('.button-content')!;
      const plusIcon = button.querySelector<SVGElement>('.button-icon-plus')!;
      const buttonLabel = button.querySelector('.button-label')!;
      const buttonContentStyles = getComputedStyle(buttonContent);
      const plusIconStyles = getComputedStyle(plusIcon);
      const labelRange = document.createRange();

      labelRange.selectNodeContents(buttonLabel);

      assert.strictEqual(buttonContent.firstElementChild, plusIcon);
      assert.lengthOf(labelRange.getClientRects(), 1);
      assert.equal(buttonContentStyles.gap, '6px');
      assert.closeTo(
        parseFloat(plusIconStyles.width),
        parseFloat(plusIconStyles.fontSize) * 1.5,
        0.01
      );
      assert.closeTo(
        parseFloat(plusIconStyles.height),
        parseFloat(plusIconStyles.fontSize) * 1.5,
        0.01
      );
      assert.equal(plusIcon.getAttribute('viewBox'), '0 0 640 640');
      assert.equal(
        plusIcon.querySelector('path')?.getAttribute('d'),
        'M352 128C352 110.3 337.7 96 320 96C302.3 96 288 110.3 288 128L288 288L128 288C110.3 288 96 302.3 96 320C96 337.7 110.3 352 128 352L288 352L288 512C288 529.7 302.3 544 320 544C337.7 544 352 529.7 352 512L352 352L512 352C529.7 352 544 337.7 544 320C544 302.3 529.7 288 512 288L352 288L352 128z'
      );
      assert.equal(
        getComputedStyle(plusIcon).fill,
        getComputedStyle(button).color
      );
    });
  });

  test('SELECT with ADD_ACCOUNT renders selection and consolidated add actions', async () => {
    const el = await renderConnect({
      interactionId: 'interaction-payment',
      status: 'PAYMENT_SOURCE_REQUESTED',
      features: ['ADD_ACCOUNT', 'SELECT'],
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

    assert.notExists(
      el.shadowRoot!.querySelector(
        '.widget-header-action [data-action="open-add-payment-source"]'
      )
    );
    assert.deepEqual(
      [
        ...el.shadowRoot!.querySelectorAll<HTMLButtonElement>(
          '.payment-method-add-footer button'
        ),
      ].map((button) => [button.dataset.action, button.textContent?.trim()]),
      [
        ['attach-payment-source', 'Use selected method'],
        ['open-add-payment-source', 'Add payment method'],
      ]
    );

    const addButton = el.shadowRoot!.querySelector<HTMLButtonElement>(
      '[data-action="open-add-payment-source"]'
    )!;
    const primaryButton = el.shadowRoot!.querySelector<HTMLButtonElement>(
      '[data-action="attach-payment-source"]'
    )!;
    const addButtonStyles = getComputedStyle(addButton);

    assert.isTrue(addButton.classList.contains('button-primary'));
    assert.isTrue(primaryButton.classList.contains('button-primary'));
    assert.equal(
      getComputedStyle(addButton.querySelector('.button-icon-plus')!).fill,
      addButtonStyles.color
    );
    assert.equal(
      getComputedStyle(addButton.querySelector('.button-label')!).color,
      addButtonStyles.color
    );
    assert.equal(
      addButtonStyles.backgroundColor,
      getComputedStyle(primaryButton).backgroundColor
    );
  });

  test('Add payment method opens an in-shell tender list without a bottom sheet', async () => {
    const el = await renderConnect({
      interactionId: 'interaction-payment',
      status: 'PAYMENT_SOURCE_REQUESTED',
      features: ['ADD_ACCOUNT', 'SELECT'],
      allowedTenderTypes: ['CARD', 'BANK_ACCOUNT'],
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

    await clickAction(el, 'open-add-payment-source');

    const shell = el.shadowRoot!.querySelector<HTMLElement>('.widget-shell')!;
    const cardOption = shell.querySelector<HTMLButtonElement>(
      '[data-action="add-card"]'
    )!;
    const bankOption = shell.querySelector<HTMLButtonElement>(
      '[data-action="add-bank-account"]'
    )!;

    assert.equal(
      shell.querySelector('.widget-title')?.textContent?.trim(),
      'Add payment method'
    );
    assert.exists(shell.querySelector('[data-action="back-to-payment-methods"]'));
    assert.notExists(el.shadowRoot!.querySelector('.add-payment-sheet'));
    assert.notExists(el.shadowRoot!.querySelector('.add-payment-sheet-layer'));
    assert.equal(
      cardOption.textContent?.replace(/\s+/g, ' ').trim(),
      'Credit or debit card Add your card details'
    );
    assert.equal(
      bankOption.textContent?.replace(/\s+/g, ' ').trim(),
      'Bank account Connect or enter an account'
    );
    assert.isTrue(cardOption.classList.contains('source-action'));
    assert.isTrue(bankOption.classList.contains('source-action'));
  });

  test('embedded ADD_ACCOUNT-only presentation uses the same in-shell tender list', async () => {
    const el = await renderConnect({
      interactionId: 'interaction-payment',
      status: 'PAYMENT_SOURCE_REQUESTED',
      features: ['ADD_ACCOUNT'],
      allowedTenderTypes: ['CARD', 'BANK_ACCOUNT'],
      paymentSources: [
        {
          tenderType: 'Card',
          id: 'card-1',
          name: 'Corporate card',
          verificationInfo: {status: 'VERIFIED'},
          card: {network: 'Visa', cardNumber: '4111111111111111'},
        },
      ],
    });
    el.presentationMode = 'embedded';
    await flushElement(el);

    await clickAction(el, 'open-add-payment-source');

    assert.equal(
      el.shadowRoot!.querySelector('.widget-title')?.textContent?.trim(),
      'Add payment method'
    );
    assert.lengthOf(
      el.shadowRoot!.querySelectorAll('.payment-action-links .source-action'),
      2
    );
    assert.notExists(el.shadowRoot!.querySelector('.add-payment-sheet'));
  });

  test('a single allowed tender still opens the in-shell tender list', async () => {
    const el = await renderConnect({
      interactionId: 'interaction-payment',
      status: 'PAYMENT_SOURCE_REQUESTED',
      features: ['ADD_ACCOUNT'],
      allowedTenderTypes: ['CARD'],
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

    const addFooter = el.shadowRoot!.querySelector<HTMLElement>(
      '.payment-method-add-footer'
    )!;
    const addButtons = addFooter.querySelectorAll<HTMLButtonElement>('button');

    assert.lengthOf(addButtons, 1);
    assert.equal(addButtons[0].dataset.action, 'open-add-payment-source');
    assert.include(addButtons[0].textContent ?? '', 'Add payment method');
    assert.closeTo(
      addButtons[0].getBoundingClientRect().width,
      addFooter.getBoundingClientRect().width,
      0.01
    );

    addButtons[0].click();
    await flushElement(el);

    assert.equal(
      el.shadowRoot!.querySelector('.widget-title')?.textContent?.trim(),
      'Add payment method'
    );
    el.shadowRoot!
      .querySelector<HTMLButtonElement>('[data-action="add-card"]')!
      .click();
    await flushElement(el);

    assert.exists(
      el.shadowRoot!.querySelector('form[data-submit-action="save-card"]')
    );
    assert.notExists(el.shadowRoot!.querySelector('.add-payment-sheet'));
  });

  test('renders per-row menus with verified selection controls', async () => {
    const el = await renderConnect({
      interactionId: 'interaction-payment',
      status: 'PAYMENT_SOURCE_REQUESTED',
      features: ['ADD_ACCOUNT', 'SELECT'],
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

    assert.lengthOf(
      el.shadowRoot!.querySelectorAll(
        '[data-action="toggle-payment-source-menu"]'
      ),
      2
    );
    assert.notExists(
      el.shadowRoot!.querySelector(
        '[data-action="toggle-payment-source-edit-mode"]'
      )
    );
    assert.notExists(
      el.shadowRoot!.querySelector(
        '[data-action="mark-payment-source-default"]'
      )
    );
    assert.lengthOf(
      el.shadowRoot!.querySelectorAll('.payment-method-radio'),
      1
    );
  });

  test('opens SELECT row actions from the ellipsis button', async () => {
    const el = await renderConnect({
      interactionId: 'interaction-payment',
      status: 'PAYMENT_SOURCE_REQUESTED',
      features: ['ADD_ACCOUNT', 'SELECT'],
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

    el.shadowRoot!.querySelector<HTMLButtonElement>(
      '[data-action="toggle-payment-source-menu"][data-payment-method-id="card-1"]'
    )!.click();
    await flushElement(el);

    assert.exists(el.shadowRoot!.querySelector('[role="menu"]'));
    assert.equal(
      el
        .shadowRoot!.querySelector(
          '[data-action="mark-payment-source-default"]'
        )
        ?.textContent?.trim(),
      'Mark as default'
    );
    assert.equal(
      el
        .shadowRoot!.querySelector('[data-action="delete-payment-source"]')
        ?.textContent?.trim(),
      'Remove'
    );
    const list = el.shadowRoot!.querySelector<HTMLElement>('.primitive-stack')!;
    const menu = el.shadowRoot!.querySelector<HTMLElement>('[role="menu"]')!;

    assert.equal(getComputedStyle(list).paddingBottom, '104px');
    assert.isAtMost(
      menu.getBoundingClientRect().bottom,
      list.getBoundingClientRect().bottom
    );
  });

  test('ADD_ACCOUNT-only verified row actions include Mark as default', async () => {
    const el = await renderConnect({
      interactionId: 'interaction-payment',
      status: 'PAYMENT_SOURCE_REQUESTED',
      features: ['ADD_ACCOUNT'],
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

    el.shadowRoot!.querySelector<HTMLButtonElement>(
      '[data-action="toggle-payment-source-menu"][data-payment-method-id="card-1"]'
    )!.click();
    await flushElement(el);

    assert.equal(
      el
        .shadowRoot!.querySelector(
          '[data-action="mark-payment-source-default"]'
        )
        ?.textContent?.trim(),
      'Mark as default'
    );
    assert.exists(
      el.shadowRoot!.querySelector('[data-action="delete-payment-source"]')
    );
  });

  test('non-verified SELECT rows omit Mark as default and retain verification actions', async () => {
    const el = await renderConnect({
      interactionId: 'interaction-payment',
      status: 'PAYMENT_SOURCE_REQUESTED',
      features: ['ADD_ACCOUNT', 'SELECT'],
      paymentSources: [
        {
          tenderType: 'BankAccount',
          id: 'bank-require-info',
          name: 'Documents needed',
          verificationInfo: {status: 'REQUIRE_INFO'},
          bankAccount: {
            bankName: 'Commerce National Bank',
            accountNumber: '9876543210',
          },
        },
        {
          tenderType: 'BankAccount',
          id: 'bank-not-verified',
          name: 'Verification needed',
          verificationInfo: {status: 'NOT_VERIFIED'},
          bankAccount: {
            bankName: 'Commerce National Bank',
            accountNumber: '1234567890',
          },
        },
      ],
    });

    for (const paymentMethodId of ['bank-require-info', 'bank-not-verified']) {
      const row = el.shadowRoot!.querySelector<HTMLElement>(
        `[data-payment-method-id="${paymentMethodId}"]`
      )!;

      assert.exists(row.querySelector('[data-action="verify-payment-source"]'));
      row
        .querySelector<HTMLButtonElement>(
          '[data-action="toggle-payment-source-menu"]'
        )!
        .click();
      await flushElement(el);
      assert.notExists(
        row.querySelector('[data-action="mark-payment-source-default"]')
      );
      assert.exists(row.querySelector('[data-action="delete-payment-source"]'));
    }
  });

  test('keeps a verified preselected source eligible until it is attached', async () => {
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
    const el = await renderConnect({
      interactionId: 'interaction-payment',
      status: 'PAYMENT_SOURCE_REQUESTED',
      features: ['ADD_ACCOUNT', 'SELECT'],
      selectedSource,
      paymentSources: [selectedSource],
    });
    const selectedRow = el.shadowRoot!.querySelector<HTMLElement>(
      '[data-payment-method-id="card-1"]'
    )!;

    assert.notExists(
      selectedRow.querySelector('.payment-method-default-label')
    );

    selectedRow
      .querySelector<HTMLButtonElement>(
        '[data-action="toggle-payment-source-menu"]'
      )!
      .click();
    await flushElement(el);

    assert.equal(
      selectedRow
        .querySelector('[data-action="mark-payment-source-default"]')
        ?.textContent?.trim(),
      'Mark as default'
    );
  });

  test('labels the attached interaction selectedSource as Default', async () => {
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
    window.fetch = async () =>
      new Response(
        JSON.stringify({
          interactionId: 'interaction-payment',
          status: 'PAYMENT_SOURCE_ATTACHED',
          features: ['ADD_ACCOUNT', 'SELECT'],
          selectedSource,
          paymentSources: [
            selectedSource,
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
          ],
        }),
        {status: 200, headers: {'Content-Type': 'application/json'}}
      );
    const el = await renderConnect({
      interactionId: 'interaction-payment',
      status: 'PAYMENT_SOURCE_ATTACHED',
      features: ['ADD_ACCOUNT', 'SELECT'],
      selectedSource,
      paymentSources: [
        selectedSource,
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
      ],
    });
    await clickAction(el, 'change-payment-source');
    const selectedRow = el.shadowRoot!.querySelector<HTMLElement>(
      '[data-payment-method-id="card-1"]'
    )!;
    const otherRow = el.shadowRoot!.querySelector<HTMLElement>(
      '[data-payment-method-id="bank-1"]'
    )!;

    assert.equal(
      selectedRow.querySelector('.payment-method-default-label')?.textContent,
      'Default'
    );
    assert.notExists(otherRow.querySelector('.payment-method-default-label'));
    const defaultLabel = selectedRow.querySelector<HTMLElement>(
      '.payment-method-default-label'
    )!;

    assert.strictEqual(
      defaultLabel.parentElement,
      selectedRow.querySelector('.payment-method-meta-row')
    );
    assert.notExists(selectedRow.querySelector('.payment-method-overflow'));
    assert.notExists(
      selectedRow.querySelector(
        '.payment-method-title-row .payment-method-default-label'
      )
    );
    assert.equal(getComputedStyle(defaultLabel).minHeight, '25px');
    assert.equal(getComputedStyle(defaultLabel).fontSize, '12px');
    assert.equal(getComputedStyle(defaultLabel).padding, '3px 9px');
    assert.equal(getComputedStyle(defaultLabel).fontWeight, '600');

    assert.notExists(
      selectedRow.querySelector('[data-action="toggle-payment-source-menu"]')
    );
    assert.notExists(
      selectedRow.querySelector('[data-action="mark-payment-source-default"]')
    );
    assert.notExists(
      selectedRow.querySelector('[data-action="delete-payment-source"]')
    );
  });

  test('dismisses row menus outside and with Escape', async () => {
    const el = await renderConnect({
      interactionId: 'interaction-payment',
      status: 'PAYMENT_SOURCE_REQUESTED',
      features: ['ADD_ACCOUNT', 'SELECT'],
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
          verificationInfo: {status: 'VERIFIED'},
          bankAccount: {
            bankName: 'Commerce National Bank',
            accountNumber: '9876543210',
          },
        },
      ],
    });
    const trigger = (paymentMethodId: string) =>
      el.shadowRoot!.querySelector<HTMLButtonElement>(
        `[data-action="toggle-payment-source-menu"][data-payment-method-id="${paymentMethodId}"]`
      )!;

    trigger('card-1').click();
    await flushElement(el);
    trigger('bank-1').click();
    await flushElement(el);
    assert.lengthOf(el.shadowRoot!.querySelectorAll('[role="menu"]'), 1);
    assert.equal(trigger('card-1').getAttribute('aria-expanded'), 'false');
    assert.equal(trigger('bank-1').getAttribute('aria-expanded'), 'true');

    el.shadowRoot!.querySelector<HTMLElement>('.widget-title')!.click();
    await flushElement(el);
    assert.notExists(el.shadowRoot!.querySelector('[role="menu"]'));

    trigger('bank-1').click();
    await flushElement(el);
    trigger('bank-1').dispatchEvent(
      new KeyboardEvent('keydown', {
        key: 'Escape',
        bubbles: true,
        composed: true,
      })
    );
    await flushElement(el);
    assert.notExists(el.shadowRoot!.querySelector('[role="menu"]'));
    assert.strictEqual(el.shadowRoot!.activeElement, trigger('bank-1'));
  });

  test('overflow Remove keeps row details and exposes one red delete action', async () => {
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

    await requestPaymentSourceDeletion(el, 'card-1');

    assert.notExists(
      el.shadowRoot!.querySelector(
        '[data-action="done-editing-payment-source"]'
      )
    );
    const armedRow = el.shadowRoot!.querySelector<HTMLElement>(
      '.payment-method-row[data-payment-method-id="card-1"]'
    )!;
    assert.notExists(
      armedRow.querySelector('.payment-method-delete-confirmation')
    );
    assert.equal(
      armedRow.querySelector('.payment-method-title')?.textContent?.trim(),
      'Corporate card'
    );
    assert.equal(
      armedRow.querySelector('.payment-method-meta')?.textContent?.trim(),
      'Visa xx 1111'
    );
    assert.notExists(
      armedRow.querySelector('[data-action="cancel-delete-payment-source"]')
    );
    assertDeleteActionUsesTrashIcon(
      armedRow.querySelector<HTMLButtonElement>(
        '[data-action="delete-payment-source"]'
      )!
    );
    assert.notExists(
      el.shadowRoot!.querySelector(
        '.payment-method-row[data-payment-method-id="bank-1"] .payment-method-delete-confirmation'
      )
    );
  });

  test('source deletion requires the armed red action and removes the source', async () => {
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

      if (
        request.method === 'GET' &&
        new URL(request.url).pathname.endsWith('/interaction')
      ) {
        return new Response(
          JSON.stringify({
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
          }),
          {status: 200, headers: {'Content-Type': 'application/json'}}
        );
      }

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

    await requestPaymentSourceDeletion(el, 'card-1');

    const deleteButton = () =>
      el.shadowRoot!.querySelector<HTMLButtonElement>(
        '[data-action="delete-payment-source"][data-payment-method-id="card-1"]'
      )!;

    assert.lengthOf(requests, 0);
    assert.notExists(
      el.shadowRoot!.querySelector(
        '[data-action="cancel-delete-payment-source"][data-payment-method-id="card-1"]'
      )
    );
    assertDeleteActionUsesTrashIcon(deleteButton());

    deleteButton().click();
    await flushElement(el);

    assert.deepEqual(
      requests.map(
        (request) => `${request.method} ${new URL(request.url).pathname}`
      ),
      ['DELETE /interaction/source/card-1', 'GET /interaction']
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
    assert.exists(
      el.shadowRoot!.querySelector('[data-action="open-add-payment-source"]')
    );
    assert.notExists(el.shadowRoot!.querySelector('[data-action="add-card"]'));
    assert.notExists(
      el.shadowRoot!.querySelector('[data-action="add-bank-account"]')
    );
    assert.notExists(
      el.shadowRoot!.querySelector('[data-action="delete-payment-source"]')
    );
  });

  test('stale deletion cannot remove a source after it becomes default', async () => {
    const requests: CapturedRequest[] = [];
    const deleteEvents: CustomEvent<string>[] = [];
    const source: PaymentSource = {
      tenderType: 'Card',
      id: 'card-1',
      name: 'Corporate card',
      verificationInfo: {status: 'VERIFIED'},
      card: {network: 'Visa', cardNumber: '4111111111111111'},
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
      paymentSources: [source],
    });
    const deletionMethods = el as unknown as {
      deleteConfirmationPaymentSourceId?: string;
      deletePaymentSource: (paymentSourceId: string) => Promise<void>;
    };
    el.addEventListener('onDeletePaymentMethod', (event) => {
      deleteEvents.push(event as CustomEvent<string>);
    });

    await requestPaymentSourceDeletion(el, 'card-1');
    assert.equal(deletionMethods.deleteConfirmationPaymentSourceId, 'card-1');

    el.interactionResponse = {
      interactionId: 'interaction-payment',
      status: 'PAYMENT_SOURCE_ATTACHED',
      selectedSource: source,
      paymentSources: [source],
    };
    await flushElement(el);
    await deletionMethods.deletePaymentSource('card-1');
    await flushElement(el);

    assert.isUndefined(deletionMethods.deleteConfirmationPaymentSourceId);
    assert.lengthOf(requests, 0);
    assert.lengthOf(deleteEvents, 0);
    assert.equal(el.interactionResponse?.selectedSource?.id, 'card-1');
    assert.deepEqual(
      el.interactionResponse?.paymentSources?.map(
        (paymentSource) => paymentSource.id
      ),
      ['card-1']
    );
  });

  test('arming source deletion waits for the red delete action', async () => {
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

    await requestPaymentSourceDeletion(el, 'card-1');

    assert.notExists(
      el.shadowRoot!.querySelector('.payment-method-delete-confirmation')
    );
    assert.notExists(
      el.shadowRoot!.querySelector(
        '[data-action="cancel-delete-payment-source"]'
      )
    );
    assertDeleteActionUsesTrashIcon(
      el.shadowRoot!.querySelector<HTMLButtonElement>(
        '[data-action="delete-payment-source"]'
      )!
    );
    assert.lengthOf(requests, 0);
    assert.deepEqual(
      el.interactionResponse?.paymentSources?.map((source) => source.id),
      ['card-1']
    );
  });

  test('red delete action moves between payment source rows', async () => {
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

    await requestPaymentSourceDeletion(el, 'card-1');

    const cardRow = el.shadowRoot!.querySelector<HTMLElement>(
      '.payment-method-row[data-payment-method-id="card-1"]'
    );
    const bankRow = el.shadowRoot!.querySelector<HTMLElement>(
      '.payment-method-row[data-payment-method-id="bank-1"]'
    );

    assertDeleteActionUsesTrashIcon(
      cardRow!.querySelector<HTMLButtonElement>(
        '[data-action="delete-payment-source"]'
      )!
    );
    assert.notExists(
      bankRow?.querySelector('[data-action="delete-payment-source"]')
    );

    await requestPaymentSourceDeletion(el, 'bank-1');

    assert.notExists(
      el
        .shadowRoot!.querySelector<HTMLElement>(
          '.payment-method-row[data-payment-method-id="card-1"]'
        )
        ?.querySelector('[data-action="delete-payment-source"]')
    );
    assertDeleteActionUsesTrashIcon(
      el
        .shadowRoot!.querySelector<HTMLElement>(
          '.payment-method-row[data-payment-method-id="bank-1"]'
        )!
        .querySelector<HTMLButtonElement>(
          '[data-action="delete-payment-source"]'
        )!
    );
    assert.lengthOf(requests, 0);
  });

  test('red delete action clears after ten seconds', async () => {
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

    const deleteActionTimer = captureDeleteActionTimer();

    try {
      await requestPaymentSourceDeletion(el, 'card-1');

      assert.equal(deleteActionTimer.delay, 10000);
      assertDeleteActionUsesTrashIcon(
        el.shadowRoot!.querySelector<HTMLButtonElement>(
          '[data-action="delete-payment-source"]'
        )!
      );

      deleteActionTimer.release();
      await flushElement(el);

      assert.notExists(
        el.shadowRoot!.querySelector('[data-action="delete-payment-source"]')
      );
      assert.lengthOf(requests, 0);
      assert.deepEqual(
        el.interactionResponse?.paymentSources?.map((source) => source.id),
        ['card-1']
      );
    } finally {
      deleteActionTimer.restore();
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
              id: 'billing-without-address-details',
              recipientNameOrAddress: 'Ada Lovelace',
            },
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

    const el = await renderConnect(
      {
        interactionId: 'interaction-payment',
        status: 'PAYMENT_SOURCE_REQUESTED',
      },
      TEST_COMMERCE_HUB_BASE_URL,
      {initialInteractionResponse: false}
    );

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
      'Visa xx 1111'
    );

    await clickAction(el, 'open-add-payment-source');
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

  test('initial interaction refresh failure hides host payment methods and exposes retry', async () => {
    const requests: CapturedRequest[] = [];
    let shouldFail = true;

    window.fetch = async (input: RequestInfo | URL) => {
      const request = input instanceof Request ? input : new Request(input);

      requests.push({
        url: request.url,
        method: request.method,
        headers: new Headers(request.headers),
        bodyText: await request.clone().text(),
        credentials: request.credentials,
      });

      if (shouldFail) {
        throw new Error('network unavailable');
      }

      return new Response(
        JSON.stringify({
          interactionId: 'interaction-payment',
          status: 'PAYMENT_SOURCE_REQUESTED',
          paymentSources: [
            {
              tenderType: 'Card',
              id: 'server-card',
              name: 'Server Visa',
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
    };

    const el = await renderConnect(
      {
        interactionId: 'interaction-payment',
        status: 'PAYMENT_SOURCE_REQUESTED',
        paymentSources: [
          {
            tenderType: 'Card',
            id: 'stale-card',
            name: 'Stale Mastercard',
            verificationInfo: {status: 'VERIFIED'},
            card: {
              network: 'Mastercard',
              cardNumber: '5555555555554444',
            },
          },
        ],
      },
      TEST_COMMERCE_HUB_BASE_URL,
      {initialInteractionResponse: false}
    );
    const {errorEvents} = recordOutputEvents(el);

    await waitFor(
      () =>
        Boolean(
          el.shadowRoot!.querySelector(
            '[data-action="retry-interaction-refresh"]'
          )
        ),
      'retry action was not shown'
    );

    assert.equal(
      el.shadowRoot!.querySelector('.widget-title')?.textContent?.trim(),
      'Payment methods unavailable'
    );
    assert.include(
      el.shadowRoot!.querySelector('.alert-danger')?.textContent?.trim() ?? '',
      "We couldn't load payment methods."
    );
    assert.notInclude(el.shadowRoot!.textContent ?? '', 'Stale Mastercard');
    assert.notExists(el.shadowRoot!.querySelector('.payment-method-row'));
    assert.lengthOf(errorEvents, 0);

    shouldFail = false;
    await clickAction(el, 'retry-interaction-refresh');
    await waitFor(
      () =>
        el
          .shadowRoot!.querySelector('.payment-method-title')
          ?.textContent?.trim() === 'Server Visa',
      'retry did not render the server payment method'
    );

    assert.deepEqual(
      requests.map(
        (request) => `${request.method} ${new URL(request.url).pathname}`
      ),
      ['GET /interaction', 'GET /interaction']
    );
  });

  test('Use selected method attaches the draft source and emits onSelect', async () => {
    const requests: CapturedRequest[] = [];
    const selectedSource: PaymentSource = {
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
    const authoritativeSource: PaymentSource = {
      ...selectedSource,
      name: 'Authoritative corporate Visa',
      card: {
        ...selectedSource.card,
        network: 'Mastercard',
        cardNumber: '5555555555554444',
      },
    };

    window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
      const request =
        input instanceof Request ? input : new Request(input, init);
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
            selectedSource,
            paymentSources: [selectedSource],
          }),
          {status: 200, headers: {'Content-Type': 'application/json'}}
        );
      }

      return new Response(
        JSON.stringify({
          interactionId: 'interaction-payment',
          status: 'PAYMENT_SOURCE_ATTACHED',
          selectedSource: authoritativeSource,
          paymentSources: [authoritativeSource],
        }),
        {status: 200, headers: {'Content-Type': 'application/json'}}
      );
    };

    const el = await renderConnect({
      interactionId: 'interaction-payment',
      status: 'PAYMENT_SOURCE_REQUESTED',
      paymentSources: [selectedSource],
    });
    const {successEvents, legacySuccessEvents, errorEvents} =
      recordOutputEvents(el);
    const radio = el.shadowRoot!.querySelector<HTMLInputElement>(
      '.payment-method-radio'
    )!;

    radio.checked = true;
    radio.dispatchEvent(new Event('change', {bubbles: true, composed: true}));
    await flushElement(el);
    await clickAction(el, 'attach-payment-source');
    await waitFor(() => {
      const selectedRadio = el.shadowRoot!.querySelector<HTMLInputElement>(
        '.payment-method-radio:checked'
      );

      return (
        successEvents.length === 1 &&
        el.shadowRoot!.querySelector('.widget-title')?.textContent?.trim() ===
          'Payment methods' &&
        selectedRadio?.value === 'card-1' &&
        el.shadowRoot!.activeElement === selectedRadio
      );
    }, 'payment method list did not remain active after selection');

    assert.deepEqual(
      requests.map(
        (request) => `${request.method} ${new URL(request.url).pathname}`
      ),
      ['POST /interaction/source/card-1/attach', 'GET /interaction']
    );
    assert.equal(successEvents.length, 1);
    assert.equal(successEvents[0].detail.id, 'card-1');
    assert.equal(successEvents[0].detail.name, 'Authoritative corporate Visa');
    assert.equal(
      (successEvents[0].detail as Extract<PaymentSource, {tenderType: 'Card'}>)
        .card?.network,
      'Mastercard'
    );
    assert.lengthOf(legacySuccessEvents, 0);
    assert.lengthOf(errorEvents, 0);
    assert.notExists(el.shadowRoot!.querySelector('.selected-payment-method'));
    assert.equal(
      el.shadowRoot!.querySelector('.widget-title')?.textContent?.trim(),
      'Payment methods'
    );
  });

  test('Mark as default attaches its row without emitting onSelect', async () => {
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

      if (
        request.method === 'PATCH' &&
        pathname === '/interaction/source/card-1'
      ) {
        return new Promise((resolve) => {
          resolveAttachResponse = resolve;
        });
      }

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
    };

    const el = await renderConnect({
      interactionId: 'interaction-payment',
      status: 'PAYMENT_SOURCE_REQUESTED',
      paymentSources: [selectedSource],
    });
    const {successEvents, legacySuccessEvents, errorEvents} =
      recordOutputEvents(el);

    assert.notExists(el.shadowRoot!.querySelector('.selected-payment-method'));
    assert.lengthOf(requests, 0);
    assert.equal(successEvents.length, 0);

    await markPaymentSourceAsDefault(el, 'card-1');
    assert.notExists(el.shadowRoot!.querySelector('.selected-payment-method'));
    assert.equal(
      el
        .shadowRoot!.querySelector('.widget-loading-title')
        ?.textContent?.trim(),
      'Saving payment method'
    );
    assert.equal(
      el
        .shadowRoot!.querySelector('.widget-loading-helper')
        ?.textContent?.trim(),
      'Saving your payment method, please wait.'
    );
    assert.exists(el.shadowRoot!.querySelector('.widget-loading-animation'));
    assert.equal(
      el.shadowRoot!.querySelector('.widget-shell')?.getAttribute('aria-busy'),
      'true'
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

    await waitFor(
      () =>
        el.interactionResponse?.selectedSource?.id === 'card-1' &&
        requests.some(
          (request) =>
            request.method === 'GET' &&
            new URL(request.url).pathname === '/interaction'
        ) &&
        !el.shadowRoot!.querySelector('.widget-loading-animation'),
      'authoritative default source refresh did not complete'
    );
    await flushElement(el);

    assert.deepEqual(
      requests.map(
        (request) => `${request.method} ${new URL(request.url).pathname}`
      ),
      ['PATCH /interaction/source/card-1', 'GET /interaction']
    );
    assert.equal(
      requests[0].headers.get('x-interaction-id'),
      'interaction-payment'
    );
    assert.equal(
      requests[0].headers.get('Content-Type'),
      'application/json'
    );
    assert.deepEqual(JSON.parse(requests[0].bodyText), {isDefault: true});
    assert.equal(requests[0].credentials, 'include');
    assert.lengthOf(successEvents, 0);
    assert.lengthOf(legacySuccessEvents, 0);
    assert.lengthOf(errorEvents, 0);
    assert.equal(el.interactionResponse?.selectedSource?.id, 'card-1');
    assert.equal(el.interactionResponse?.status, 'PAYMENT_SOURCE_ATTACHED');
    assert.equal(
      el.shadowRoot!.querySelector('.widget-title')?.textContent?.trim(),
      'Payment methods'
    );
    assert.notExists(
      el.shadowRoot!.querySelector('[data-action="confirm-payment-source"]')
    );
    assert.equal(
      el
        .shadowRoot!.querySelector('.payment-method-row .payment-method-title')
        ?.textContent?.trim(),
      'Corporate Visa'
    );
    assert.equal(
      el
        .shadowRoot!.querySelector('.payment-method-row .payment-method-meta')
        ?.textContent?.trim(),
      'Visa xx 1111'
    );
    assert.equal(
      el
        .shadowRoot!.querySelector('.payment-method-default-label')
        ?.textContent?.trim(),
      'Default'
    );
    assert.notExists(el.shadowRoot!.querySelector('.selected-payment-method'));
  });

  test('attach failure keeps the draft selection and exposes inline retry feedback', async () => {
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

      return new Response(JSON.stringify({message: 'Attach was declined'}), {
        status: 409,
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
          card: {network: 'Visa', cardNumber: '4111111111111111'},
        },
      ],
    });
    const {successEvents} = recordOutputEvents(el);

    await clickAction(el, 'attach-payment-source');
    await waitFor(
      () => Boolean(el.shadowRoot!.querySelector('.alert-danger')),
      'attach error did not render'
    );

    assert.deepEqual(
      requests.map(
        (request) => `${request.method} ${new URL(request.url).pathname}`
      ),
      ['POST /interaction/source/card-1/attach']
    );
    assert.equal(successEvents.length, 0);
    assert.notExists(el.shadowRoot!.querySelector('.selected-payment-method'));
    assert.isTrue(
      el.shadowRoot!.querySelector<HTMLInputElement>('.payment-method-radio')!
        .checked
    );
    assert.include(
      el.shadowRoot!.querySelector('.alert-danger')?.textContent ?? '',
      'Attach was declined'
    );
  });

  test('attach remains successful and emits onSelect once when its interaction refresh fails', async () => {
    const requests: CapturedRequest[] = [];
    const source: PaymentSource = {
      tenderType: 'Card',
      id: 'card-1',
      name: 'Local attached card',
      verificationInfo: {status: 'VERIFIED'},
      card: {network: 'Visa', cardNumber: '4111111111111111'},
    };

    window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
      const request =
        input instanceof Request ? input : new Request(input, init);
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
            selectedSource: source,
            paymentSources: [source],
          }),
          {status: 200, headers: {'Content-Type': 'application/json'}}
        );
      }

      return new Response(JSON.stringify({message: 'Refresh unavailable'}), {
        status: 503,
        headers: {'Content-Type': 'application/json'},
      });
    };

    const el = await renderConnect({
      interactionId: 'interaction-payment',
      status: 'PAYMENT_SOURCE_REQUESTED',
      paymentSources: [source],
    });
    const {successEvents, errorEvents} = recordOutputEvents(el);

    await clickAction(el, 'attach-payment-source');
    await waitFor(
      () =>
        successEvents.length === 1 &&
        !el.shadowRoot!.querySelector('.widget-loading-animation'),
      'attach did not complete with its local fallback'
    );

    assert.deepEqual(
      requests.map(
        (request) => `${request.method} ${new URL(request.url).pathname}`
      ),
      ['POST /interaction/source/card-1/attach', 'GET /interaction']
    );
    assert.equal(successEvents[0].detail.name, 'Local attached card');
    assert.lengthOf(successEvents, 1);
    assert.lengthOf(errorEvents, 0);
    assert.notExists(el.shadowRoot!.querySelector('.alert-danger'));
  });

  test('failed stale attach refresh cannot affect a newer interaction', async () => {
    const requests: CapturedRequest[] = [];
    const attachResponse = createDeferred<Response>();
    const interactionA = createDeferred<Response>();
    const interactionB = createDeferred<Response>();
    const sourceA: PaymentSource = {
      tenderType: 'Card',
      id: 'card-a',
      name: 'Interaction A card',
      verificationInfo: {status: 'VERIFIED'},
      card: {network: 'Visa', cardNumber: '4111111111111111'},
    };
    const sourceB: PaymentSource = {
      tenderType: 'Card',
      id: 'card-b',
      name: 'Interaction B card',
      verificationInfo: {status: 'VERIFIED'},
      card: {network: 'Mastercard', cardNumber: '5555555555554444'},
    };

    window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
      const request =
        input instanceof Request ? input : new Request(input, init);

      requests.push({
        url: request.url,
        method: request.method,
        headers: new Headers(request.headers),
        bodyText: await request.clone().text(),
        credentials: request.credentials,
      });

      if (request.method === 'POST') {
        return attachResponse.promise;
      }

      return request.headers.get('x-interaction-id') === 'interaction-a'
        ? interactionA.promise
        : interactionB.promise;
    };

    const el = await renderConnect({
      interactionId: 'interaction-a',
      status: 'PAYMENT_SOURCE_REQUESTED',
      paymentSources: [sourceA],
    });
    const {successEvents, listPaymentMethodsEvents, errorEvents} =
      recordOutputEvents(el);
    const attachmentPromise = (
      el as unknown as {
        attachPaymentSource: (paymentSourceId: string) => Promise<void>;
      }
    ).attachPaymentSource('card-a');

    await waitFor(
      () => requests.some((request) => request.method === 'POST'),
      'interaction A attach did not start'
    );
    attachResponse.resolve(
      new Response(
        JSON.stringify({
          interactionId: 'interaction-a',
          status: 'PAYMENT_SOURCE_ATTACHED',
          selectedSource: sourceA,
          paymentSources: [sourceA],
        }),
        {status: 200, headers: {'Content-Type': 'application/json'}}
      )
    );
    await waitFor(
      () =>
        requests.some(
          (request) =>
            request.method === 'GET' &&
            request.headers.get('x-interaction-id') === 'interaction-a'
        ),
      'interaction A authoritative refresh did not start'
    );

    el.interactionResponse = {
      interactionId: 'interaction-b',
      status: 'PAYMENT_SOURCE_REQUESTED',
      paymentSources: [],
    };
    await flushElement(el);
    await waitFor(
      () =>
        requests.some(
          (request) =>
            request.method === 'GET' &&
            request.headers.get('x-interaction-id') === 'interaction-b'
        ),
      'interaction B refresh did not start'
    );

    interactionA.reject(new Error('Interaction A refresh failed'));
    await attachmentPromise;
    await flushElement(el);

    assert.equal(el.interactionResponse?.interactionId, 'interaction-b');
    assert.isUndefined(el.interactionResponse?.selectedSource);
    assert.lengthOf(successEvents, 0);
    assert.lengthOf(listPaymentMethodsEvents, 0);
    assert.lengthOf(errorEvents, 0);
    assert.notExists(el.shadowRoot!.querySelector('.selected-payment-method'));
    assert.notExists(el.shadowRoot!.querySelector('.alert-danger'));

    interactionB.resolve(
      new Response(
        JSON.stringify({
          interactionId: 'interaction-b',
          status: 'PAYMENT_SOURCE_REQUESTED',
          paymentSources: [sourceB],
        }),
        {status: 200, headers: {'Content-Type': 'application/json'}}
      )
    );
    await waitFor(
      () =>
        el
          .shadowRoot!.querySelector('.payment-method-title')
          ?.textContent?.trim() === 'Interaction B card',
      'interaction B did not remain authoritative'
    );

    assert.equal(el.interactionResponse?.interactionId, 'interaction-b');
    assert.deepEqual(
      el.interactionResponse?.paymentSources?.map((source) => source.id),
      ['card-b']
    );
    assert.lengthOf(successEvents, 0);
    assert.lengthOf(listPaymentMethodsEvents, 1);
    assert.deepEqual(
      listPaymentMethodsEvents[0].detail.map((source) => source.id),
      ['card-b']
    );
    assert.lengthOf(errorEvents, 0);
    assert.notExists(el.shadowRoot!.querySelector('.alert-danger'));
  });

  test('stale attach rejection cannot clear a newer attach busy guard', async () => {
    const requests: CapturedRequest[] = [];
    const attachA = createDeferred<Response>();
    const attachB = createDeferred<Response>();
    const sourceA: PaymentSource = {
      tenderType: 'Card',
      id: 'card-a',
      name: 'Interaction A card',
      verificationInfo: {status: 'VERIFIED'},
      card: {network: 'Visa', cardNumber: '4111111111111111'},
    };
    const sourceB: PaymentSource = {
      tenderType: 'Card',
      id: 'card-b',
      name: 'Interaction B card',
      verificationInfo: {status: 'VERIFIED'},
      card: {network: 'Mastercard', cardNumber: '5555555555554444'},
    };

    window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
      const request =
        input instanceof Request ? input : new Request(input, init);
      const interactionId = request.headers.get('x-interaction-id');

      requests.push({
        url: request.url,
        method: request.method,
        headers: new Headers(request.headers),
        bodyText: await request.clone().text(),
        credentials: request.credentials,
      });

      if (request.method === 'POST') {
        return interactionId === 'interaction-a'
          ? attachA.promise
          : attachB.promise;
      }

      const source = interactionId === 'interaction-a' ? sourceA : sourceB;

      return new Response(
        JSON.stringify({
          interactionId,
          status: 'PAYMENT_SOURCE_REQUESTED',
          paymentSources: [source],
        }),
        {status: 200, headers: {'Content-Type': 'application/json'}}
      );
    };

    const el = await renderConnect({
      interactionId: 'interaction-a',
      status: 'PAYMENT_SOURCE_REQUESTED',
      paymentSources: [sourceA],
    });
    const {successEvents, errorEvents} = recordOutputEvents(el);
    const attachmentMethods = el as unknown as {
      pendingAction?: string;
      attachmentError?: string;
      attachPaymentSource: (paymentSourceId: string) => Promise<void>;
    };
    const interactionAOperation =
      attachmentMethods.attachPaymentSource('card-a');

    await waitFor(
      () =>
        requests.some(
          (request) =>
            request.method === 'POST' &&
            request.headers.get('x-interaction-id') === 'interaction-a'
        ),
      'interaction A attach did not start'
    );

    el.interactionResponse = {
      interactionId: 'interaction-b',
      status: 'PAYMENT_SOURCE_REQUESTED',
      paymentSources: [sourceB],
    };
    await flushElement(el);
    await waitFor(
      () =>
        el
          .shadowRoot!.querySelector('.payment-method-title')
          ?.textContent?.trim() === 'Interaction B card',
      'interaction B payment source did not render'
    );

    const interactionBOperation =
      attachmentMethods.attachPaymentSource('card-b');
    await waitFor(
      () =>
        requests.some(
          (request) =>
            request.method === 'POST' &&
            request.headers.get('x-interaction-id') === 'interaction-b'
        ),
      'interaction B attach did not start'
    );

    await attachmentMethods.attachPaymentSource('card-b');
    assert.lengthOf(
      requests.filter((request) => request.method === 'POST'),
      2
    );

    attachA.reject(new Error('Interaction A attach failed'));
    await interactionAOperation;
    await flushElement(el);

    assert.equal(attachmentMethods.pendingAction, 'attach-payment-source');
    assert.isUndefined(attachmentMethods.attachmentError);
    assert.lengthOf(
      requests.filter((request) => request.method === 'POST'),
      2
    );
    assert.lengthOf(successEvents, 0);
    assert.lengthOf(errorEvents, 0);
    assert.notExists(el.shadowRoot!.querySelector('.alert-danger'));

    attachB.resolve(
      new Response(
        JSON.stringify({
          interactionId: 'interaction-b',
          status: 'PAYMENT_SOURCE_ATTACHED',
          selectedSource: sourceB,
          paymentSources: [sourceB],
        }),
        {status: 200, headers: {'Content-Type': 'application/json'}}
      )
    );
    await interactionBOperation;
    await flushElement(el);

    assert.isUndefined(attachmentMethods.pendingAction);
    assert.isUndefined(attachmentMethods.attachmentError);
    assert.equal(el.interactionResponse?.interactionId, 'interaction-b');
    assert.equal(el.interactionResponse?.selectedSource?.id, 'card-b');
    assert.lengthOf(successEvents, 1);
    assert.equal(successEvents[0].detail.id, 'card-b');
    assert.lengthOf(errorEvents, 0);
  });

  test('mark-as-default remains successful without onSelect when its interaction refresh fails', async () => {
    const requests: CapturedRequest[] = [];
    const source: PaymentSource = {
      tenderType: 'Card',
      id: 'card-1',
      name: 'Local default card',
      verificationInfo: {status: 'VERIFIED'},
      card: {network: 'Visa', cardNumber: '4111111111111111'},
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

      if (
        request.method === 'PATCH' &&
        pathname === '/interaction/source/card-1'
      ) {
        return new Response(JSON.stringify({}), {
          status: 200,
          headers: {'Content-Type': 'application/json'},
        });
      }

      return new Response(JSON.stringify({message: 'Refresh unavailable'}), {
        status: 503,
        headers: {'Content-Type': 'application/json'},
      });
    };

    const el = await renderConnect({
      interactionId: 'interaction-payment',
      status: 'PAYMENT_SOURCE_REQUESTED',
      paymentSources: [source],
    });
    const {successEvents, errorEvents} = recordOutputEvents(el);

    await markPaymentSourceAsDefault(el, 'card-1');
    await waitFor(
      () =>
        el.interactionResponse?.selectedSource?.id === 'card-1' &&
        !el.shadowRoot!.querySelector('.widget-loading-animation'),
      'mark-as-default did not complete with its local fallback'
    );

    assert.deepEqual(
      requests.map(
        (request) => `${request.method} ${new URL(request.url).pathname}`
      ),
      ['PATCH /interaction/source/card-1', 'GET /interaction']
    );
    assert.lengthOf(successEvents, 0);
    assert.lengthOf(errorEvents, 0);
    assert.notExists(el.shadowRoot!.querySelector('.alert-danger'));
    assert.equal(
      el
        .shadowRoot!.querySelector('.payment-method-default-label')
        ?.textContent?.trim(),
      'Default'
    );
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
      'Payment methods'
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
      'Visa xx 1111'
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
    const verifyButton = row.querySelector<HTMLButtonElement>(
      '[data-action="verify-payment-source"]'
    )!;

    verifyButton.click();
    await flushElement(el);

    assert.equal(row.tagName, 'DIV');
    assert.equal(verifyButton.tagName, 'BUTTON');
    assert.equal(
      row.querySelector('.verification-status-badge')?.textContent?.trim(),
      'Needs info'
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
      'Needs review'
    );
    assert.equal(
      el.interactionResponse?.paymentSources?.[0]?.verificationInfo?.status,
      'UNDER_REVIEW'
    );
    assert.equal(
      el.shadowRoot!.querySelector('.widget-title')?.textContent?.trim(),
      'Payment methods'
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
      "Can't use"
    );
    assert.equal(
      el.shadowRoot!.querySelector('.widget-title')?.textContent?.trim(),
      'Payment methods'
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
      '.payment-method-row [data-action="verify-payment-source"]'
    )?.click();
    await flushElement(el);

    assert.lengthOf(requests, 0);
    assert.equal(
      el.shadowRoot!.querySelector('.widget-title')?.textContent?.trim(),
      'Complete account verification'
    );
    const backButton = el.shadowRoot!.querySelector<HTMLButtonElement>(
      '.widget-back-button[data-action="back-to-payment-methods"]'
    );
    assert.equal(backButton?.getAttribute('aria-label'), 'Back');
    assert.equal(backButton?.textContent?.trim(), '');
    assert.exists(backButton?.closest('.widget-heading-row'));
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
      'Needs info'
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
    const backButton = el.shadowRoot!.querySelector<HTMLButtonElement>(
      '.widget-back-button[data-action="back-to-payment-methods"]'
    );
    assert.equal(backButton?.getAttribute('aria-label'), 'Back');
    assert.equal(backButton?.textContent?.trim(), '');
    assert.exists(backButton?.closest('.widget-heading-row'));
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
      'Needs info'
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
    assert.notExists(
      el.shadowRoot!.querySelector('#transfer-currency'),
      'expected no currency dropdown'
    );
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
    assert.isTrue(transferButton!.disabled);
    assert.notExists(el.shadowRoot!.querySelector('.field-error'));

    fromSelect!.value = 'bank-1';
    fromSelect!.dispatchEvent(new Event('change', {bubbles: true}));
    toSelect!.value = 'bank-1';
    toSelect!.dispatchEvent(new Event('change', {bubbles: true}));
    amountInput!.value = '-1';
    amountInput!.dispatchEvent(new Event('input', {bubbles: true}));
    await flushElement(el);

    assert.isFalse(
      el.shadowRoot!.querySelector<HTMLButtonElement>(
        '[data-action="transfer"]'
      )!.disabled
    );
    assert.notExists(el.shadowRoot!.querySelector('.field-error'));

    await clickAction(el, 'transfer');

    assert.include(
      el.shadowRoot!.textContent,
      'Select a different destination account.'
    );
    assert.include(
      el.shadowRoot!.textContent,
      'Enter an amount greater than zero.'
    );

    toSelect!.value = 'native-account-1';
    toSelect!.dispatchEvent(new Event('change', {bubbles: true}));
    amountInput!.value = '25.75';
    amountInput!.dispatchEvent(new Event('input', {bubbles: true}));
    await flushElement(el);

    assert.notExists(el.shadowRoot!.querySelector('.field-error'));

    amountInput!.value = '';
    amountInput!.dispatchEvent(new Event('input', {bubbles: true}));
    await flushElement(el);

    assert.isTrue(
      el.shadowRoot!.querySelector<HTMLButtonElement>(
        '[data-action="transfer"]'
      )!.disabled
    );
    assert.include(el.shadowRoot!.textContent, 'Enter an amount.');
  });

  test('reviews transfer details before posting selected accounts amount USD currency and auth headers', async () => {
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
          asset: {type: 'CURRENCY', id: 'USD'},
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

    fromSelect.value = 'bank-1';
    fromSelect.dispatchEvent(new Event('change', {bubbles: true}));
    toSelect.value = 'native-account-1';
    toSelect.dispatchEvent(new Event('change', {bubbles: true}));
    amountInput.value = '25.75';
    amountInput.dispatchEvent(new Event('input', {bubbles: true}));
    await flushElement(el);

    await clickAction(el, 'transfer');

    assert.lengthOf(requests, 0);
    assert.equal(
      el.shadowRoot!.querySelector('.widget-title')?.textContent?.trim(),
      'Confirm transfer'
    );
    assert.deepEqual(
      [
        ...el.shadowRoot!.querySelectorAll<HTMLElement>(
          '.detail-list .detail-row'
        ),
      ].map((row) => [
        row.querySelector('.detail-label')?.textContent?.trim(),
        row.querySelector('.detail-value')?.textContent?.trim(),
      ]),
      [
        ['From', 'Operating account'],
        ['To', 'Commerce wallet'],
        ['Amount', '25.75 USD'],
      ]
    );

    await clickAction(el, 'confirm-transfer');

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
      asset: {type: 'CURRENCY', id: 'USD'},
    });
    assert.equal(
      el.shadowRoot!.querySelector('.alert-success')?.textContent?.trim(),
      'Transfer initiated.'
    );
  });

  test('returns from transfer confirmation to the filled transfer form without posting', async () => {
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

      return new Response('{}', {
        status: 200,
        headers: {'Content-Type': 'application/json'},
      });
    };

    const el = await renderConnect({
      interactionId: 'interaction-transfer',
      status: 'OTP_VALIDATION_SUCCESS',
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

    fromSelect.value = 'bank-1';
    fromSelect.dispatchEvent(new Event('change', {bubbles: true}));
    toSelect.value = 'native-account-1';
    toSelect.dispatchEvent(new Event('change', {bubbles: true}));
    amountInput.value = '25.75';
    amountInput.dispatchEvent(new Event('input', {bubbles: true}));
    await flushElement(el);

    await clickAction(el, 'transfer');
    await clickAction(el, 'edit-transfer');

    assert.lengthOf(requests, 0);
    assert.equal(
      el.shadowRoot!.querySelector('.widget-title')?.textContent?.trim(),
      'Transfer funds'
    );
    assert.equal(
      el.shadowRoot!.querySelector<HTMLSelectElement>('#transfer-from-source')
        ?.value,
      'bank-1'
    );
    assert.equal(
      el.shadowRoot!.querySelector<HTMLSelectElement>('#transfer-to-source')
        ?.value,
      'native-account-1'
    );
    assert.equal(
      el.shadowRoot!.querySelector<HTMLInputElement>('#transfer-amount')?.value,
      '25.75'
    );
    assert.notExists(
      el.shadowRoot!.querySelector('#transfer-currency'),
      'expected no currency dropdown'
    );
  });
});
