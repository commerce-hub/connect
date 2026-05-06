import type { InteractionResponse, PaymentSource, Profile } from './contracts/api-models';
import {
  registerCommerceHubConnectWebSdk,
  resolveApiBaseUrl,
  type CommerceHubConnectWebSdkMountOptions,
} from './web-sdk';
import { commerceHubConnectWebSdkInlineCss } from './styles-inline';

function createConfiguration(
  overrides: Partial<CommerceHubConnectWebSdkMountOptions['configuration']> = {},
) {
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
    (
      globalThis as typeof globalThis & { __commerceHubConnectWebSdkInlineCss?: string }
    ).__commerceHubConnectWebSdkInlineCss =
      '.commerce-hub-connect-web-sdk-mount { --spec-loaded: yes; }';
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
    expect(commerceHubConnectWebSdkInlineCss).toContain('.ch-sdk-source-action');
    expect(commerceHubConnectWebSdkInlineCss).toContain('.ch-sdk-source-actions-list');
    expect(commerceHubConnectWebSdkInlineCss).toContain('.ch-sdk-source-scroll');
    expect(commerceHubConnectWebSdkInlineCss).toContain('max-height: 201px;');
    expect(commerceHubConnectWebSdkInlineCss).toContain('overflow-y: auto;');
    expect(commerceHubConnectWebSdkInlineCss).toContain('scrollbar-width: thin;');
    expect(commerceHubConnectWebSdkInlineCss).toContain('min-height: 36px;');
    expect(commerceHubConnectWebSdkInlineCss).toContain('box-shadow: none;');
    expect(commerceHubConnectWebSdkInlineCss).toContain('.ch-sdk-spinner');
    expect(commerceHubConnectWebSdkInlineCss).toContain('@media (prefers-reduced-motion: reduce)');
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
    const savedSources: PaymentSource[] = [
      savedCard,
      {
        id: 'card-2',
        name: 'Commerce National Bank',
        tenderType: 'BANK_ACCOUNT',
        bankAccount: {
          bankName: 'Commerce National Bank',
          routingNumber: '011000015',
          accountNumber: '0000001234',
          accountType: 'CHECKING',
        },
      },
      {
        id: 'card-3',
        name: 'Amex corporate card',
        tenderType: 'CARD',
        card: {
          cardNumber: '3782822463108000',
          cvv: '***',
          expirationMonth: '08',
          expirationYear: '31',
          nameOnCard: 'Smoke Tester',
          network: 'AmericanExpress',
        },
      },
      {
        id: 'card-4',
        name: 'Business checking',
        tenderType: 'BANK_ACCOUNT',
        bankAccount: {
          bankName: 'Business checking',
          routingNumber: '021000021',
          accountNumber: '0000002288',
          accountType: 'CHECKING',
        },
      },
    ];

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
    expect(mountTarget.querySelector('.commerce-hub-connect-web-sdk-mount')).toBe(
      instance.hostElement,
    );
    expect(instance.hostElement.textContent).toContain('Sign in');
    expect(instance.hostElement.style.getPropertyValue('--ch-sdk-primary').trim()).toBe('#ff5a1f');

    await instance.update({
      interaction: createInteraction(
        {
          interactionId: 'interaction-1',
          status: 'PAYMENT_SOURCE_REQUESTED',
          selectedSource: savedCard,
        },
        savedSources,
      ),
      configuration: createConfiguration({ paymentSelectionTitle: 'Saved methods' }),
      whiteLabel: {
        primaryColor: '#1d4ed8',
      },
    });

    expect(
      document.head.querySelectorAll('[data-commerce-hub-connect-web-sdk-style="true"]').length,
    ).toBe(stylesheetCountAfterMount);
    expect(instance.hostElement.textContent).toContain('Saved methods');
    expect(instance.hostElement.textContent).toContain('Primary Visa');
    expect(instance.hostElement.style.getPropertyValue('--ch-sdk-primary').trim()).toBe('#1d4ed8');
    expect(instance.hostElement.querySelector('.ch-sdk-source-option.is-selected')).not.toBeNull();
    expect(instance.hostElement.querySelector('.ch-sdk-source-check')).not.toBeNull();
    expect(instance.hostElement.querySelectorAll('.ch-sdk-source-action').length).toBe(2);
    expect(instance.hostElement.querySelector('.ch-sdk-source-actions-list')).not.toBeNull();
    const sourceScroll = instance.hostElement.querySelector('.ch-sdk-source-scroll');
    expect(sourceScroll).not.toBeNull();
    expect(sourceScroll?.querySelectorAll('.ch-sdk-source-option').length).toBe(
      savedSources.length,
    );
    expect(sourceScroll?.querySelector('.ch-sdk-source-actions-list')).toBeNull();
    expect(
      instance.hostElement.querySelector(
        '.ch-sdk-stack--payment-list > .ch-sdk-source-actions-list',
      ),
    ).not.toBeNull();
    expect(instance.hostElement.querySelector('[data-action="add-card"] svg')).not.toBeNull();
    expect(instance.hostElement.querySelector('[data-action="add-bank"] svg')).not.toBeNull();
    expect(instance.hostElement.querySelector('.ch-sdk-pill-actions')).toBeNull();
    expect(
      instance.hostElement.querySelector('.ch-sdk-source-option')?.getAttribute('aria-pressed'),
    ).toBe('true');

    instance.destroy();
    expect(mountTarget.querySelector('.commerce-hub-connect-web-sdk-mount')).toBeNull();
  });

  it('renders nested white-label copy for visible flow titles, subtitles, and primary buttons', async () => {
    const namespace = await registerCommerceHubConnectWebSdk();
    const savedCard = createSavedCardSource('card-1');
    const configuration = createConfiguration({
      paymentSelectionTitle: 'Legacy saved title',
      paymentSelectionConfirmLabel: 'Legacy saved confirm',
      whiteLabel: {
        emailEntry: {
          title: 'Config email title',
          subtitle: 'Config email subtitle',
          primaryButtonText: 'Config email button',
        },
        otpVerification: {
          title: 'Config OTP title',
          subtitle: 'Config OTP subtitle',
          primaryButtonText: 'Config OTP button',
        },
        savedSource: {
          title: 'Config saved title',
          subtitle: 'Config saved subtitle',
          primaryButtonText: 'Config saved button',
        },
        addCard: {
          title: 'Config card title',
          subtitle: 'Config card subtitle',
          primaryButtonText: 'Config card button',
        },
      },
    });
    const whiteLabel: CommerceHubConnectWebSdkMountOptions['whiteLabel'] = {
      emailEntry: {
        title: 'Merchant email title',
      },
      savedSource: {
        primaryButtonText: 'Merchant saved button',
      },
    };

    const instance = await namespace.mount('#mount-target', {
      interaction: createInteraction(),
      configuration,
      whiteLabel,
    });

    expect(instance.hostElement.textContent).toContain('Merchant email title');
    expect(instance.hostElement.textContent).toContain('Config email subtitle');
    expect(instance.hostElement.textContent).toContain('Config email button');

    await instance.update({
      interaction: createInteraction({
        status: 'OTP_VALIDATION_PENDING',
      }),
      configuration,
      whiteLabel,
    });

    expect(instance.hostElement.textContent).toContain('Config OTP title');
    expect(instance.hostElement.textContent).toContain('Config OTP subtitle');
    expect(instance.hostElement.textContent).toContain('Config OTP button');

    await instance.update({
      interaction: createInteraction(
        {
          status: 'PAYMENT_SOURCE_REQUESTED',
          selectedSource: savedCard,
        },
        [savedCard],
      ),
      configuration,
      whiteLabel,
    });
    await flushTasks();

    expect(instance.hostElement.textContent).toContain('Config saved title');
    expect(instance.hostElement.textContent).toContain('Config saved subtitle');
    expect(instance.hostElement.textContent).toContain('Merchant saved button');
    expect(instance.hostElement.textContent).not.toContain('Legacy saved title');
    expect(instance.hostElement.textContent).not.toContain('Legacy saved confirm');

    clickRequired(instance.hostElement, '[data-action="add-card"]');

    expect(instance.hostElement.textContent).toContain('Config card title');
    expect(instance.hostElement.textContent).toContain('Config card subtitle');
    expect(instance.hostElement.textContent).toContain('Config card button');

    instance.destroy();
  });

  it('keeps legacy saved-source copy fallbacks when nested white-label copy is absent', async () => {
    const namespace = await registerCommerceHubConnectWebSdk();
    const savedCard = createSavedCardSource('card-1');

    const instance = await namespace.mount('#mount-target', {
      interaction: createInteraction(
        {
          status: 'PAYMENT_SOURCE_REQUESTED',
          selectedSource: savedCard,
        },
        [savedCard],
      ),
      configuration: createConfiguration({
        paymentSelectionTitle: 'Legacy saved methods',
        paymentSelectionConfirmLabel: 'Legacy confirm',
      }),
    });
    await flushTasks();

    expect(instance.hostElement.textContent).toContain('Legacy saved methods');
    expect(instance.hostElement.textContent).toContain('Legacy confirm');

    instance.destroy();
  });

  it('preserves the saved payment method scroll position when selecting a lower source', async () => {
    const restoreScrollTop = installUnclampedScrollTopForSpec();
    const namespace = await registerCommerceHubConnectWebSdk();
    const savedSources = Array.from({ length: 8 }, (_value, index) => ({
      ...createSavedCardSource(`card-${index + 1}`),
      name: `Saved Visa ${index + 1}`,
    }));
    let instance: Awaited<ReturnType<typeof namespace.mount>> | undefined;

    try {
      instance = await namespace.mount('#mount-target', {
        interaction: createInteraction(
          {
            status: 'PAYMENT_SOURCE_REQUESTED',
            selectedSource: savedSources[0],
          },
          savedSources,
        ),
        configuration: createConfiguration(),
      });

      const sourceScroll = instance.hostElement.querySelector('.ch-sdk-source-scroll');
      if (!(sourceScroll instanceof HTMLElement)) {
        fail('Unable to find saved payment method scroll container.');
        return;
      }

      sourceScroll.scrollTop = 128;
      clickRequired(instance.hostElement, '[data-source-id="card-8"]');

      const nextSourceScroll = instance.hostElement.querySelector('.ch-sdk-source-scroll');
      expect(nextSourceScroll).not.toBe(sourceScroll);
      expect(nextSourceScroll).toEqual(jasmine.any(HTMLElement));
      expect((nextSourceScroll as HTMLElement).scrollTop).toBe(128);
      expect(
        instance.hostElement
          .querySelector('[data-source-id="card-8"]')
          ?.classList.contains('is-selected'),
      ).toBeTrue();
    } finally {
      restoreScrollTop();
      instance?.destroy();
    }
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

  it('marks otp inputs after invalid code submission', async () => {
    const namespace = await registerCommerceHubConnectWebSdk();
    const instance = await namespace.mount('#mount-target', {
      interaction: createInteraction({
        status: 'OTP_VALIDATION_PENDING',
        email: 'gregory.jablonski@fiserv.com',
      }),
      configuration: createConfiguration(),
    });

    const form = instance.hostElement.querySelector('form[data-form="otp"]');
    if (!(form instanceof HTMLFormElement)) {
      fail('Unable to find otp form.');
      return;
    }

    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));

    expect(instance.hostElement.textContent).toContain('Enter the 6-digit code.');
    expect(instance.hostElement.querySelector('.ch-sdk-otp-group.is-error')).not.toBeNull();
    expect(
      instance.hostElement.querySelectorAll('.ch-sdk-otp-digit[aria-invalid="true"]').length,
    ).toBe(6);

    instance.destroy();
  });

  it('renders bank handoff without a title block inside the widget shell', async () => {
    const namespace = await registerCommerceHubConnectWebSdk();
    const instance = await namespace.mount('#mount-target', {
      interaction: createInteraction({
        status: 'PAYMENT_SOURCE_REQUESTED',
        allowedTenderTypes: ['BANK_ACCOUNT'],
      }),
      configuration: createConfiguration(),
    });

    await flushTasks();
    clickRequired(instance.hostElement, '[data-action="add-bank"]');

    expect(instance.hostElement.querySelector('.ch-sdk-title-block')).toBeNull();
    expect(instance.hostElement.querySelector('.ch-sdk-bank-mount')).not.toBeNull();
    expect(instance.hostElement.querySelector('.ch-sdk-bank-status')).toBeNull();
    expect(instance.hostElement.textContent).not.toContain('Connecting to bank');
    expect(instance.hostElement.textContent).not.toContain('Connect bank');
    expect(instance.hostElement.textContent).not.toContain(
      'Continue in the secure bank-link frame.',
    );

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

    await controller.encryptCardField(
      'cardNumber',
      getRequiredInput(instance.hostElement, 'cardNumber').value,
    );
    expect(controller.getSnapshot().cardEncryption.cardNumber.status).toBe('encrypted');
    expect(fetchHarness.counters.cardMask).toBe(1);
    expect(fetchHarness.counters.cvvMask).toBe(0);
    expect(getCardSubmitButton(instance.hostElement).disabled).toBeTrue();

    await controller.encryptCardField(
      'cardNumber',
      getRequiredInput(instance.hostElement, 'cardNumber').value,
    );
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
    expect(controller.getSnapshot().displayStep).toBe('payment');
    expect(controller.getSnapshot().paymentEntryMode).toBe('list');
    expect(controller.getSnapshot().completedPaymentSource).toBeNull();
    expect(instance.hostElement.textContent).toContain('Payment method');
    expect(instance.hostElement.textContent).toContain('Primary Visa');
    expect(instance.hostElement.textContent).not.toContain('Payment method saved');
    expect(instance.hostElement.textContent).not.toContain('Manage payment methods');
    expect(instance.hostElement.querySelectorAll('.ch-sdk-source-action').length).toBe(2);
    const successInteraction = onSuccessSpy.calls.mostRecent().args[0] as InteractionResponse;
    expect(successInteraction).toEqual(
      jasmine.objectContaining({
        status: 'PAYMENT_SOURCE_ATTACHED',
        selectedSource: createSavedCardSource('card-created-1'),
      }),
    );
    expect(
      'paymentSourceId' in (successInteraction as unknown as Record<string, unknown>),
    ).toBeFalse();

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
    await controller.encryptCardField(
      'cardNumber',
      getRequiredInput(instance.hostElement, 'cardNumber').value,
    );

    expect(fetchHarness.counters.cardMask).toBe(1);
    expect(controller.getSnapshot().cardEncryption.cardNumber.status).toBe('failed');
    expect(controller.getSnapshot().cardDraftErrors.cardNumber).toBe(
      'Unable to encrypt the card number. Try again.',
    );
    expect(instance.hostElement.textContent).toContain(
      'Unable to encrypt the card number. Try again.',
    );
    expect(getCardSubmitButton(instance.hostElement).disabled).toBeTrue();

    await controller.encryptCardField(
      'cardNumber',
      getRequiredInput(instance.hostElement, 'cardNumber').value,
    );
    expect(fetchHarness.counters.cardMask).toBe(2);
    expect(controller.getSnapshot().cardEncryption.cardNumber.status).toBe('encrypted');
    expect(controller.getSnapshot().cardDraftErrors.cardNumber).toBeUndefined();
    expect(instance.hostElement.textContent).not.toContain(
      'Unable to encrypt the card number. Try again.',
    );

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
  return (
    instance as {
      controller: {
        getSnapshot(): any;
        encryptCardField(field: 'cardNumber' | 'cvc', value: string): Promise<void>;
        submitCard(draft: ReturnType<typeof readCardDraft>): Promise<void>;
      };
    }
  ).controller;
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
      (hostElement.querySelector('select[name="billingAddressValue"]') as HTMLSelectElement | null)
        ?.value ?? getRequiredInput(hostElement, 'billingAddressValue').value,
    country: getRequiredInput(hostElement, 'country').value,
    addressLine1: getRequiredInput(hostElement, 'addressLine1').value,
    addressLine2: getRequiredInput(hostElement, 'addressLine2').value,
    city: getRequiredInput(hostElement, 'city').value,
    state: getRequiredInput(hostElement, 'state').value,
    zip: getRequiredInput(hostElement, 'zip').value,
  };
}

function installUnclampedScrollTopForSpec(): () => void {
  const scrollTopValues = new WeakMap<Element, number>();
  const scrollTopDescriptor =
    Object.getOwnPropertyDescriptor(Element.prototype, 'scrollTop') ??
    Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'scrollTop');
  const scrollTopOwner =
    Object.getOwnPropertyDescriptor(Element.prototype, 'scrollTop') !== undefined
      ? Element.prototype
      : HTMLElement.prototype;

  Object.defineProperty(scrollTopOwner, 'scrollTop', {
    configurable: true,
    get(this: Element): number {
      return scrollTopValues.get(this) ?? 0;
    },
    set(this: Element, value: number): void {
      scrollTopValues.set(this, value);
    },
  });

  return () => {
    if (scrollTopDescriptor) {
      Object.defineProperty(scrollTopOwner, 'scrollTop', scrollTopDescriptor);
    } else {
      Reflect.deleteProperty(scrollTopOwner, 'scrollTop');
    }
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
