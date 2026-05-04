import type { InteractionResponse, PaymentSource, Profile } from './contracts/api-models';
import {
  registerCommerceHubConnectWebSdk,
  resolveApiBaseUrl,
  type CommerceHubConnectWebSdkMountOptions,
} from './web-sdk';
import { commerceHubConnectWebSdkInlineCss } from './styles-inline';

function createConfiguration(overrides: Partial<CommerceHubConnectWebSdkMountOptions['configuration']> = {}) {
  return {
    onSuccess: jasmine.createSpy('onSuccess'),
    onError: jasmine.createSpy('onError'),
    ...overrides,
  };
}

function createInteraction(
  overrides: Partial<InteractionResponse> = {},
  paymentSources: PaymentSource[] = [],
): InteractionResponse {
  return {
    interactionId: 'interaction-1',
    status: 'EMAIL_REQUESTED',
    paymentSources,
    allowedTenderTypes: ['CARD', 'BANK_ACCOUNT'],
    allowEmailChange: true,
    ...overrides,
  };
}

describe('web sdk', () => {
  let fetchSpy: jasmine.Spy<typeof fetch>;
  let mountTarget: HTMLDivElement;

  beforeEach(() => {
    mountTarget = document.createElement('div');
    mountTarget.id = 'mount-target';
    document.body.appendChild(mountTarget);
    (globalThis as typeof globalThis & { __commerceHubConnectWebSdkInlineCss?: string })
      .__commerceHubConnectWebSdkInlineCss = '.commerce-hub-connect-web-sdk-mount { --spec-loaded: yes; }';
    delete window.CommerceHubConnectWebSdk;
    fetchSpy = spyOn(globalThis, 'fetch').and.callFake(async (input: RequestInfo | URL) => {
      const url = String(input);
      if (url.endsWith('/customer')) {
        return createJsonResponse(createBillingProfile());
      }

      fail(`Unexpected fetch request in web-sdk.spec: ${url}`);
      return createJsonResponse({});
    });
  });

  afterEach(() => {
    mountTarget.remove();
    delete window.CommerceHubConnectWebSdk;
  });

  it('registers the browser namespace and custom element', async () => {
    const namespace = await registerCommerceHubConnectWebSdk();

    expect(namespace.tagName).toBe('commerce-hub-connect-widget');
    expect(window.CommerceHubConnectWebSdk).toBe(namespace);
    expect(customElements.get(namespace.tagName)).toBeDefined();
  });

  it('resolves api base urls from the selected environment and runtime origin', () => {
    const localDocument = {
      currentScript: { src: 'http://localhost:8080/dist/CommerceHubConnectSDK.js' },
      location: { origin: 'https://merchant.example' },
    } as Document;

    const remoteDocument = {
      currentScript: { src: 'https://cdn.example/sdk/CommerceHubConnectSDK.js' },
      location: { origin: 'https://merchant.example' },
    } as Document;

    expect(resolveApiBaseUrl('cat', localDocument)).toBe(
      'http://localhost:8080/commerce-hub-proxy/cat',
    );
    expect(resolveApiBaseUrl('prod', remoteDocument)).toBe(
      'https://dev.openfx-nonprod.aws.fisv.cloud',
    );
  });

  it('maps white-label primary color to primary CTA styling', () => {
    expect(commerceHubConnectWebSdkInlineCss).toContain(
      '--ch-sdk-action: var(--ch-sdk-primary, #084acc);',
    );
    expect(commerceHubConnectWebSdkInlineCss).toContain('background: var(--ch-sdk-action);');
    expect(commerceHubConnectWebSdkInlineCss).toContain('border: 1px solid var(--ch-sdk-action);');
  });

  it('mounts an inline widget, injects the stylesheet once, and updates in place', async () => {
    const namespace = await registerCommerceHubConnectWebSdk();
    const savedCard: PaymentSource = {
      id: 'card-1',
      name: 'Primary Visa',
      tenderType: 'CARD',
      card: {
        cardNumber: '4111111111111111',
        cvv: '***',
        expirationMonth: '12',
        expirationYear: '30',
        nameOnCard: 'Smoke Tester',
        network: 'Visa',
      },
    };

    const stylesheetCountBeforeMount = document.head.querySelectorAll(
      '[data-commerce-hub-connect-web-sdk-style="true"]',
    ).length;

    const instance = await namespace.mount('#mount-target', {
      interaction: createInteraction(),
      configuration: createConfiguration(),
      whiteLabel: {
        primaryColor: '#ff5a1f',
      },
    });

    const stylesheetCountAfterMount = document.head.querySelectorAll(
      '[data-commerce-hub-connect-web-sdk-style="true"]',
    ).length;

    expect(stylesheetCountAfterMount).toBeGreaterThan(0);
    expect(stylesheetCountAfterMount).toBe(stylesheetCountBeforeMount || 1);
    expect(mountTarget.querySelector('.commerce-hub-connect-web-sdk-mount')).toBe(instance.hostElement);
    expect(instance.hostElement.textContent).toContain('Sign in');
    expect(instance.hostElement.style.getPropertyValue('--ch-sdk-primary').trim()).toBe('#ff5a1f');

    await instance.update({
      interaction: createInteraction(
        {
          interactionId: 'interaction-1',
          status: 'PAYMENT_SOURCE_REQUESTED',
          selectedSource: savedCard,
        },
        [savedCard],
      ),
      configuration: createConfiguration({ paymentSelectionTitle: 'Saved methods' }),
      whiteLabel: {
        primaryColor: '#1d4ed8',
      },
    });

    expect(document.head.querySelectorAll('[data-commerce-hub-connect-web-sdk-style="true"]').length).toBe(
      stylesheetCountAfterMount,
    );
    expect(instance.hostElement.textContent).toContain('Saved methods');
    expect(instance.hostElement.textContent).toContain('Primary Visa');
    expect(instance.hostElement.style.getPropertyValue('--ch-sdk-primary').trim()).toBe('#1d4ed8');

    instance.destroy();
    expect(mountTarget.querySelector('.commerce-hub-connect-web-sdk-mount')).toBeNull();
  });

  it('renders the host-mounted custom element with inline properties', async () => {
    const namespace = await registerCommerceHubConnectWebSdk();
    const element = namespace.createElement(
      {
        interaction: createInteraction(),
        configuration: createConfiguration(),
        whiteLabel: {
          secondaryColor: '#1d4ed8',
        },
      },
      'qa',
    );

    mountTarget.appendChild(element);
    await Promise.resolve();
    await Promise.resolve();

    expect(element.querySelector('.commerce-hub-connect-web-sdk-mount')).not.toBeNull();
    expect(element.textContent).toContain('Sign in');
    const emailInput = element.querySelector('input[name="email"]') as HTMLInputElement | null;
    expect(emailInput?.value).toBe('');
  });

  it('renders segmented otp inputs while preserving the hidden submitted value', async () => {
    const namespace = await registerCommerceHubConnectWebSdk();
    const instance = await namespace.mount('#mount-target', {
      interaction: createInteraction({
        status: 'OTP_VALIDATION_PENDING',
        email: 'gregory.jablonski@fiserv.com',
      }),
      configuration: createConfiguration(),
    });

    const otpDigits = instance.hostElement.querySelectorAll('.ch-sdk-otp-digit');
    const hiddenOtpInput = instance.hostElement.querySelector(
      'input[name="otp"][type="hidden"]',
    ) as HTMLInputElement | null;

    expect(instance.hostElement.textContent).toContain('Enter code');
    expect(otpDigits.length).toBe(6);
    expect(hiddenOtpInput).not.toBeNull();
    expect(instance.hostElement.querySelector('.ch-sdk-footer-brand')).toBeNull();

    instance.destroy();
  });

  it('encrypts sensitive card fields only on blur, blocks save until both succeed, and avoids duplicate blur calls', async () => {
    const namespace = await registerCommerceHubConnectWebSdk();
    const configuration = createConfiguration();
    const onSuccessSpy = configuration.onSuccess as jasmine.Spy;
    const fetchHarness = installCardFetchHarness(fetchSpy);

    const instance = await namespace.mount(
      '#mount-target',
      {
        interaction: createInteraction({
          status: 'PAYMENT_SOURCE_REQUESTED',
          allowedTenderTypes: ['CARD'],
        }),
        configuration,
      },
      'qa',
    );

    const controller = getMountedWidgetController(instance);
    await flushTasks();
    clickRequired(instance.hostElement, '[data-action="add-card"]');

    fillCardForm(instance.hostElement);
    expect(fetchHarness.counters.cardMask).toBe(0);
    expect(fetchHarness.counters.cvvMask).toBe(0);
    expect(getCardSubmitButton(instance.hostElement).disabled).toBeTrue();

    await controller.encryptCardField('cardNumber', getRequiredInput(instance.hostElement, 'cardNumber').value);
    expect(controller.getSnapshot().cardEncryption.cardNumber.status).toBe('encrypted');
    expect(fetchHarness.counters.cardMask).toBe(1);
    expect(fetchHarness.counters.cvvMask).toBe(0);
    expect(getCardSubmitButton(instance.hostElement).disabled).toBeTrue();

    await controller.encryptCardField('cardNumber', getRequiredInput(instance.hostElement, 'cardNumber').value);
    expect(fetchHarness.counters.cardMask).toBe(1);

    await controller.encryptCardField('cvc', getRequiredInput(instance.hostElement, 'cvc').value);
    expect(controller.getSnapshot().cardEncryption.cvc.status).toBe('encrypted');

    await controller.encryptCardField('cvc', getRequiredInput(instance.hostElement, 'cvc').value);
    expect(fetchHarness.counters.cvvMask).toBe(1);
    expect(getCardSubmitButton(instance.hostElement).disabled).toBeFalse();

    await controller.submitCard(readCardDraft(instance.hostElement));

    expect(fetchHarness.counters.source).toBe(1);
    expect(onSuccessSpy.calls.count()).toBe(1);
    expect(fetchHarness.lastSourceBody?.card.cardNumber).toBe('enc-card-1');
    expect(fetchHarness.lastSourceBody?.card.cvv).toBe('enc-cvv-1');
    expect(configuration.onSuccess).toHaveBeenCalledWith(
      jasmine.objectContaining({ paymentSourceId: 'card-created-1' }),
    );

    instance.destroy();
  });

  it('renders an inline error when blur encryption fails and clears it after a successful retry', async () => {
    const namespace = await registerCommerceHubConnectWebSdk();
    const fetchHarness = installCardFetchHarness(fetchSpy, {
      cardMaskResponses: [
        createJsonResponse({ message: 'Mask failed.' }, 500),
        createJsonResponse({ value: 'enc-card-1' }),
      ],
    });

    const instance = await namespace.mount(
      '#mount-target',
      {
        interaction: createInteraction({
          status: 'PAYMENT_SOURCE_REQUESTED',
          allowedTenderTypes: ['CARD'],
        }),
        configuration: createConfiguration(),
      },
      'qa',
    );
    const controller = getMountedWidgetController(instance);
    await flushTasks();
    clickRequired(instance.hostElement, '[data-action="add-card"]');

    fillCardForm(instance.hostElement);
    await controller.encryptCardField('cardNumber', getRequiredInput(instance.hostElement, 'cardNumber').value);

    expect(fetchHarness.counters.cardMask).toBe(1);
    expect(controller.getSnapshot().cardEncryption.cardNumber.status).toBe('failed');
    expect(controller.getSnapshot().cardDraftErrors.cardNumber).toBe(
      'Unable to encrypt the card number. Try again.',
    );
    expect(instance.hostElement.textContent).toContain('Unable to encrypt the card number. Try again.');
    expect(getCardSubmitButton(instance.hostElement).disabled).toBeTrue();

    await controller.encryptCardField('cardNumber', getRequiredInput(instance.hostElement, 'cardNumber').value);
    expect(fetchHarness.counters.cardMask).toBe(2);
    expect(controller.getSnapshot().cardEncryption.cardNumber.status).toBe('encrypted');
    expect(controller.getSnapshot().cardDraftErrors.cardNumber).toBeUndefined();
    expect(instance.hostElement.textContent).not.toContain('Unable to encrypt the card number. Try again.');

    await controller.encryptCardField('cvc', getRequiredInput(instance.hostElement, 'cvc').value);
    expect(fetchHarness.counters.cvvMask).toBe(1);
    expect(controller.getSnapshot().cardEncryption.cvc.status).toBe('encrypted');
    expect(getCardSubmitButton(instance.hostElement).disabled).toBeFalse();

    instance.destroy();
  });
});

function getMountedWidgetController(instance: unknown): {
  getSnapshot(): any;
  encryptCardField(field: 'cardNumber' | 'cvc', value: string): Promise<void>;
  submitCard(draft: ReturnType<typeof readCardDraft>): Promise<void>;
} {
  return (instance as {
    controller: {
      getSnapshot(): any;
      encryptCardField(field: 'cardNumber' | 'cvc', value: string): Promise<void>;
      submitCard(draft: ReturnType<typeof readCardDraft>): Promise<void>;
    };
  }).controller;
}

function fillCardForm(hostElement: HTMLElement): void {
  setInputValue(getRequiredInput(hostElement, 'name'), 'Primary Visa');
  setInputValue(getRequiredInput(hostElement, 'fullName'), 'Smoke Tester');
  setInputValue(getRequiredInput(hostElement, 'cardNumber'), '4111111111111111');
  setInputValue(getRequiredInput(hostElement, 'expiration'), '12/30');
  setInputValue(getRequiredInput(hostElement, 'cvc'), '123');
  setInputValue(getRequiredInput(hostElement, 'addressLine1'), '123 Main St');
  setInputValue(getRequiredInput(hostElement, 'city'), 'New York');
  setInputValue(getRequiredInput(hostElement, 'state'), 'NY');
  setInputValue(getRequiredInput(hostElement, 'zip'), '10001');
}

function getRequiredInput(hostElement: HTMLElement, name: string): HTMLInputElement {
  const input = hostElement.querySelector(`input[name="${name}"]`);
  if (!(input instanceof HTMLInputElement)) {
    throw new Error(`Unable to find input ${name}`);
  }

  return input;
}

function getCardSubmitButton(hostElement: HTMLElement): HTMLButtonElement {
  const button = hostElement.querySelector('form[data-form="card"] button[type="submit"]');
  if (!(button instanceof HTMLButtonElement)) {
    throw new Error('Unable to find card submit button.');
  }

  return button;
}

function clickRequired(hostElement: HTMLElement, selector: string): void {
  const element = hostElement.querySelector(selector);
  if (!(element instanceof HTMLElement)) {
    throw new Error(`Unable to find element ${selector}`);
  }

  element.click();
}

function readCardDraft(hostElement: HTMLElement) {
  return {
    name: getRequiredInput(hostElement, 'name').value,
    fullName: getRequiredInput(hostElement, 'fullName').value,
    cardNumber: getRequiredInput(hostElement, 'cardNumber').value,
    expiration: getRequiredInput(hostElement, 'expiration').value,
    cvc: getRequiredInput(hostElement, 'cvc').value,
    billingAddressValue:
      (hostElement.querySelector('select[name="billingAddressValue"]') as HTMLSelectElement | null)?.value ??
      getRequiredInput(hostElement, 'billingAddressValue').value,
    country: getRequiredInput(hostElement, 'country').value,
    addressLine1: getRequiredInput(hostElement, 'addressLine1').value,
    addressLine2: getRequiredInput(hostElement, 'addressLine2').value,
    city: getRequiredInput(hostElement, 'city').value,
    state: getRequiredInput(hostElement, 'state').value,
    zip: getRequiredInput(hostElement, 'zip').value,
  };
}

function setInputValue(input: HTMLInputElement, value: string): void {
  input.value = value;
  input.dispatchEvent(new Event('input', { bubbles: true }));
  input.dispatchEvent(new Event('change', { bubbles: true }));
}

async function flushTasks(cycles = 3): Promise<void> {
  for (let index = 0; index < cycles; index += 1) {
    await Promise.resolve();
  }
}

function createJsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

function requestJsonBody(init?: RequestInit): any {
  return init?.body ? JSON.parse(String(init.body)) : undefined;
}

function createSavedCardSource(id = 'card-created-1'): PaymentSource {
  return {
    id,
    name: 'Primary Visa',
    tenderType: 'CARD',
    card: {
      cardNumber: 'enc-card-1',
      cvv: 'enc-cvv-1',
      expirationMonth: '12',
      expirationYear: '30',
      nameOnCard: 'Smoke Tester',
      network: 'Visa',
    },
  };
}

function createBillingProfile(overrides: Partial<Profile> = {}): Profile {
  return {
    billingAddress: [],
    ...overrides,
  };
}

function installCardFetchHarness(
  fetchSpy: jasmine.Spy<typeof fetch>,
  options?: {
    cardMaskResponses?: Response[];
    cvvMaskResponses?: Response[];
  },
) {
  const counters = {
    customer: 0,
    billingAddress: 0,
    cardMask: 0,
    cvvMask: 0,
    source: 0,
    attach: 0,
  };
  let lastSourceBody: any;
  const cardMaskResponses = [...(options?.cardMaskResponses ?? [])];
  const cvvMaskResponses = [...(options?.cvvMaskResponses ?? [])];

  fetchSpy.and.callFake(async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = String(input);
    if (url.endsWith('/customer')) {
      counters.customer += 1;
      return createJsonResponse(createBillingProfile());
    }
    if (url.endsWith('/customer/billing-address')) {
      counters.billingAddress += 1;
      return createJsonResponse({ ok: true });
    }
    if (url.endsWith('/customer/mask/card')) {
      counters.cardMask += 1;
      return cardMaskResponses.shift() ?? createJsonResponse({ value: 'enc-card-1' });
    }
    if (url.endsWith('/customer/mask/cvv')) {
      counters.cvvMask += 1;
      return cvvMaskResponses.shift() ?? createJsonResponse({ value: 'enc-cvv-1' });
    }
    if (url.endsWith('/customer/source')) {
      counters.source += 1;
      lastSourceBody = requestJsonBody(init);
      return createJsonResponse({ id: 'card-created-1' });
    }
    if (url.endsWith('/interaction/payment-source/card-created-1/attach')) {
      counters.attach += 1;
      return createJsonResponse(
        createInteraction(
          {
            status: 'PAYMENT_SOURCE_ATTACHED',
            selectedSource: createSavedCardSource('card-created-1'),
          },
          [createSavedCardSource('card-created-1')],
        ),
      );
    }

    fail(`Unexpected fetch request in card harness: ${url}`);
    return createJsonResponse({});
  });

  return {
    counters,
    get lastSourceBody() {
      return lastSourceBody;
    },
  };
}
