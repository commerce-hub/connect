import type { InteractionResponse } from '../contracts/api-models';
import type { CommerceHubSdkConfiguration } from '../contracts/sdk-models';
import {
  canSubmitCard,
  CommerceHubConnectWidgetController,
  getDefaultCardDraft,
  type CardDraft,
} from './controller';

describe('CommerceHubConnectWidgetController', () => {
  let fetchSpy: jasmine.Spy<typeof fetch>;

  beforeEach(() => {
    fetchSpy = spyOn(globalThis, 'fetch').and.callFake(
      async (_input: RequestInfo | URL, _init?: RequestInit) =>
        createJsonResponse(createInteractionResponse()),
    );
  });

  it('refreshes the api client interaction id after committing a new interaction', async () => {
    const controller = createController({ interactionId: 'interaction-1' });

    fetchSpy.calls.reset();
    (controller as any).commitInteraction(
      createInteractionResponse({ interactionId: 'interaction-2' }),
    );

    await (controller as any).api.getInteractionStatus();

    const headers = requestHeadersFrom(fetchSpy);
    expect(headers['x-interaction-id']).toBe('interaction-2');

    controller.destroy();
  });

  it('auto-submits the configured email once on the initial email step', async () => {
    const controller = createController(
      {},
      createConfiguration({
        email: 'shopper@example.com',
      }),
    );

    await Promise.resolve();

    expect(requestCount(fetchSpy, '/interaction/otp/send')).toBe(1);

    controller.destroy();
  });

  it('skips the queued initial email submit after destroy', async () => {
    const controller = createController(
      {},
      createConfiguration({
        email: 'shopper@example.com',
      }),
    );

    controller.destroy();
    await Promise.resolve();

    expect(requestCount(fetchSpy, '/interaction/otp/send')).toBe(0);
  });

  it('stores an otp validation error when /interaction/otp/validate fails', async () => {
    fetchSpy.and.callFake(async (input: RequestInfo | URL) => {
      const url = String(input);
      if (url.endsWith('/interaction/otp/validate')) {
        return createJsonResponse({ message: 'Invalid code.' }, 400);
      }

      fail(`Unexpected fetch request: ${url}`);
      return createJsonResponse({});
    });

    const configuration = createConfiguration();
    const controller = new CommerceHubConnectWidgetController(
      createInteractionResponse({
        status: 'OTP_VALIDATION_PENDING',
        email: 'shopper@example.com',
      }),
      configuration,
      undefined,
      'qa',
      '/api',
    );

    await controller.validateOtp('123456');

    expect(configuration.onError).toHaveBeenCalledWith(
      jasmine.objectContaining({
        stage: 'otp_validate',
        message: 'Invalid code.',
        status: 400,
      }),
    );
    expect(controller.getSnapshot().error).toEqual(
      jasmine.objectContaining({
        stage: 'otp_validate',
        message: 'Invalid code.',
        status: 400,
      }),
    );

    controller.destroy();
  });

  it('stores a widget error when /customer fails after otp validation succeeds', async () => {
    fetchSpy.and.callFake(async (input: RequestInfo | URL) => {
      const url = String(input);
      if (url.endsWith('/interaction/otp/validate')) {
        return createJsonResponse(
          createInteractionResponse({
            status: 'PAYMENT_SOURCE_REQUESTED',
            email: 'shopper@example.com',
          }),
        );
      }

      if (url.endsWith('/customer')) {
        return createJsonResponse({ message: 'Customer lookup failed.' }, 500);
      }

      fail(`Unexpected fetch request: ${url}`);
      return createJsonResponse({});
    });

    const configuration = createConfiguration();
    const controller = new CommerceHubConnectWidgetController(
      createInteractionResponse({
        status: 'OTP_VALIDATION_PENDING',
        email: 'shopper@example.com',
      }),
      configuration,
      undefined,
      'qa',
      '/api',
    );

    await controller.validateOtp('123456');

    expect(controller.getSnapshot().displayStep).toBe('payment');
    expect(configuration.onError).toHaveBeenCalledWith(
      jasmine.objectContaining({
        stage: 'session',
        message: 'Customer lookup failed.',
        status: 500,
      }),
    );
    expect(controller.getSnapshot().error).toEqual(
      jasmine.objectContaining({
        stage: 'session',
        message: 'Customer lookup failed.',
        status: 500,
      }),
    );

    controller.destroy();
  });

  it('encrypts the card number on blur and skips unchanged re-blur requests', async () => {
    fetchSpy.and.callFake(async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = String(input);
      if (url.endsWith('/customer/mask/card')) {
        expect(requestJsonBody(init)).toEqual({ value: '4111111111111111' });
        return createJsonResponse({ value: 'enc-card-1' });
      }

      fail(`Unexpected fetch request: ${url}`);
      return createJsonResponse({});
    });

    const controller = createController();

    await controller.encryptCardField('cardNumber', '4111111111111111');
    await controller.encryptCardField('cardNumber', '4111111111111111');

    expect(requestCount(fetchSpy, '/customer/mask/card')).toBe(1);
    expect(controller.getSnapshot().cardEncryption.cardNumber).toEqual({
      status: 'encrypted',
      normalizedValue: '4111111111111111',
      encryptedValue: 'enc-card-1',
    });

    controller.destroy();
  });

  it('encrypts the cvc on blur and skips unchanged re-blur requests', async () => {
    fetchSpy.and.callFake(async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = String(input);
      if (url.endsWith('/customer/mask/cvv')) {
        expect(requestJsonBody(init)).toEqual({ value: '123' });
        return createJsonResponse({ value: 'enc-cvv-1' });
      }

      fail(`Unexpected fetch request: ${url}`);
      return createJsonResponse({});
    });

    const controller = createController();

    await controller.encryptCardField('cvc', '123');
    await controller.encryptCardField('cvc', '123');

    expect(requestCount(fetchSpy, '/customer/mask/cvv')).toBe(1);
    expect(controller.getSnapshot().cardEncryption.cvc).toEqual({
      status: 'encrypted',
      normalizedValue: '123',
      encryptedValue: 'enc-cvv-1',
    });

    controller.destroy();
  });

  it('blocks save until both sensitive fields have been encrypted', async () => {
    const controller = createController();

    await controller.submitCard(createCardDraft());

    expect(requestCount(fetchSpy, '/customer/source')).toBe(0);
    expect(controller.getSnapshot().cardDraftErrors).toEqual(
      jasmine.objectContaining({
        cardNumber: 'Encrypt the card number before saving.',
        cvc: 'Encrypt the CVC before saving.',
      }),
    );

    controller.destroy();
  });

  it('blocks save while card number encryption is still in flight', async () => {
    const pendingMask = createDeferred<Response>();
    fetchSpy.and.callFake(async (input: RequestInfo | URL) => {
      const url = String(input);
      if (url.endsWith('/customer/mask/card')) {
        return pendingMask.promise;
      }
      if (url.endsWith('/customer/mask/cvv')) {
        return createJsonResponse({ value: 'enc-cvv-1' });
      }

      fail(`Unexpected fetch request: ${url}`);
      return createJsonResponse({});
    });

    const controller = createController();
    await controller.encryptCardField('cvc', '123');

    const cardMaskPromise = controller.encryptCardField('cardNumber', '4111111111111111');
    expect(controller.getSnapshot().cardEncryption.cardNumber.status).toBe('encrypting');

    await controller.submitCard(createCardDraft());

    expect(requestCount(fetchSpy, '/customer/source')).toBe(0);
    expect(controller.getSnapshot().cardDraftErrors.cardNumber).toBe(
      'Encrypt the card number before saving.',
    );

    pendingMask.resolve(createJsonResponse({ value: 'enc-card-1' }));
    await cardMaskPromise;
    controller.destroy();
  });

  it('blocks save while cvc encryption is still in flight', async () => {
    const pendingMask = createDeferred<Response>();
    fetchSpy.and.callFake(async (input: RequestInfo | URL) => {
      const url = String(input);
      if (url.endsWith('/customer/mask/card')) {
        return createJsonResponse({ value: 'enc-card-1' });
      }
      if (url.endsWith('/customer/mask/cvv')) {
        return pendingMask.promise;
      }

      fail(`Unexpected fetch request: ${url}`);
      return createJsonResponse({});
    });

    const controller = createController();
    await controller.encryptCardField('cardNumber', '4111111111111111');

    const cvvMaskPromise = controller.encryptCardField('cvc', '123');
    expect(controller.getSnapshot().cardEncryption.cvc.status).toBe('encrypting');

    await controller.submitCard(createCardDraft());

    expect(requestCount(fetchSpy, '/customer/source')).toBe(0);
    expect(controller.getSnapshot().cardDraftErrors.cvc).toBe('Encrypt the CVC before saving.');

    pendingMask.resolve(createJsonResponse({ value: 'enc-cvv-1' }));
    await cvvMaskPromise;
    controller.destroy();
  });

  it('stores a field error when blur encryption fails and clears it after a successful retry', async () => {
    let shouldFail = true;
    fetchSpy.and.callFake(async (input: RequestInfo | URL) => {
      const url = String(input);
      if (url.endsWith('/customer/mask/card')) {
        return shouldFail
          ? createJsonResponse({ message: 'Mask failed.' }, 500)
          : createJsonResponse({ value: 'enc-card-1' });
      }

      fail(`Unexpected fetch request: ${url}`);
      return createJsonResponse({});
    });

    const controller = createController();

    await controller.encryptCardField('cardNumber', '4111111111111111');
    expect(controller.getSnapshot().cardDraftErrors.cardNumber).toBe(
      'Unable to encrypt the card number. Try again.',
    );
    expect(controller.getSnapshot().cardEncryption.cardNumber.status).toBe('failed');

    shouldFail = false;
    await controller.encryptCardField('cardNumber', '4111111111111111');

    expect(requestCount(fetchSpy, '/customer/mask/card')).toBe(2);
    expect(controller.getSnapshot().cardDraftErrors.cardNumber).toBeUndefined();
    expect(controller.getSnapshot().cardEncryption.cardNumber).toEqual({
      status: 'encrypted',
      normalizedValue: '4111111111111111',
      encryptedValue: 'enc-card-1',
    });

    controller.destroy();
  });

  it('marks previously encrypted fields dirty again after edits and re-blocks save', async () => {
    fetchSpy.and.callFake(async (input: RequestInfo | URL) => {
      const url = String(input);
      if (url.endsWith('/customer/mask/card')) {
        return createJsonResponse({ value: 'enc-card-1' });
      }
      if (url.endsWith('/customer/mask/cvv')) {
        return createJsonResponse({ value: 'enc-cvv-1' });
      }

      fail(`Unexpected fetch request: ${url}`);
      return createJsonResponse({});
    });

    const controller = createController();

    await controller.encryptCardField('cardNumber', '4111111111111111');
    await controller.encryptCardField('cvc', '123');
    expect(canSubmitCard(controller.getSnapshot())).toBeTrue();

    controller.syncCardDraftField('cardNumber', '4000000000000002');

    expect(canSubmitCard(controller.getSnapshot())).toBeFalse();
    expect(controller.getSnapshot().cardEncryption.cardNumber).toEqual({
      status: 'dirty',
      normalizedValue: '4000000000000002',
      encryptedValue: null,
    });

    controller.destroy();
  });

  it('submits with the cached encrypted values after both blur operations succeed', async () => {
    const configuration = createConfiguration();
    fetchSpy.and.callFake(async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = String(input);
      if (url.endsWith('/customer/mask/card')) {
        return createJsonResponse({ value: 'enc-card-1' });
      }
      if (url.endsWith('/customer/mask/cvv')) {
        return createJsonResponse({ value: 'enc-cvv-1' });
      }
      if (url.endsWith('/customer/source')) {
        const source = requestJsonBody(init);
        expect(source.card.cardNumber).toBe('enc-card-1');
        expect(source.card.cardNumberEncrypted).toBe('enc-card-1');
        expect(source.card.cvv).toBe('enc-cvv-1');
        expect(source.card.cvvEncrypted).toBe('enc-cvv-1');
        return createJsonResponse({ id: 'card-created-1' });
      }
      if (url.endsWith('/interaction/payment-source/card-created-1/attach')) {
        return createJsonResponse(
          createInteractionResponse({
            status: 'PAYMENT_SOURCE_ATTACHED',
            selectedSource: createSavedCardSource('card-created-1'),
            paymentSources: [createSavedCardSource('card-created-1')],
          }),
        );
      }
      if (url.endsWith('/customer')) {
        return createJsonResponse({ billingAddress: [] });
      }

      fail(`Unexpected fetch request: ${url}`);
      return createJsonResponse({});
    });

    const controller = createController(undefined, configuration);

    await controller.encryptCardField('cardNumber', '4111111111111111');
    await controller.encryptCardField('cvc', '123');
    await controller.submitCard(createCardDraft());

    expect(requestCount(fetchSpy, '/customer/source')).toBe(1);
    expect(configuration.onSuccess).toHaveBeenCalledWith(
      jasmine.objectContaining({
        paymentSourceId: 'card-created-1',
      }),
    );
    expect(controller.getSnapshot().cardEncryption.cardNumber.status).toBe('idle');
    expect(controller.getSnapshot().cardEncryption.cvc.status).toBe('idle');
    expect(controller.getSnapshot().cardDraft).toEqual(getDefaultCardDraft());

    controller.destroy();
  });
});

function requestHeadersFrom(fetchSpy: jasmine.Spy<typeof fetch>): Record<string, string> {
  const [, init] = fetchSpy.calls.mostRecent().args as [RequestInfo | URL, RequestInit | undefined];
  const headers = new Headers(init?.headers);
  return Object.fromEntries(headers.entries());
}

function requestCount(fetchSpy: jasmine.Spy<typeof fetch>, pathSuffix: string): number {
  return fetchSpy.calls.allArgs().filter(([input]) => String(input).endsWith(pathSuffix)).length;
}

function requestJsonBody(init?: RequestInit): any {
  return init?.body ? JSON.parse(String(init.body)) : undefined;
}

function createJsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

function createInteractionResponse(
  overrides: Partial<InteractionResponse> = {},
): InteractionResponse {
  return {
    interactionId: 'interaction-1',
    status: 'EMAIL_REQUESTED',
    allowedTenderTypes: ['CARD'],
    ...overrides,
  };
}

function createConfiguration(
  overrides: Partial<CommerceHubSdkConfiguration> = {},
): CommerceHubSdkConfiguration {
  return {
    onSuccess: jasmine.createSpy('onSuccess'),
    onError: jasmine.createSpy('onError'),
    ...overrides,
  };
}

function createController(
  interactionOverrides: Partial<InteractionResponse> = {},
  configuration = createConfiguration(),
): CommerceHubConnectWidgetController {
  return new CommerceHubConnectWidgetController(
    createInteractionResponse(interactionOverrides),
    configuration,
    undefined,
    'qa',
    '/api',
  );
}

function createCardDraft(overrides: Partial<CardDraft> = {}): CardDraft {
  return {
    ...getDefaultCardDraft(),
    name: 'Primary Visa',
    fullName: 'Smoke Tester',
    cardNumber: '4111111111111111',
    expiration: '12/30',
    cvc: '123',
    billingAddressValue: 'billing-address-1',
    addressLine1: '123 Main St',
    city: 'New York',
    state: 'NY',
    zip: '10001',
    ...overrides,
  };
}

function createSavedCardSource(id = 'card-saved-1') {
  return {
    id,
    name: 'Primary Visa',
    tenderType: 'CARD' as const,
    card: {
      cardNumber: 'enc-card-1',
      cvv: 'enc-cvv-1',
      expirationMonth: '12',
      expirationYear: '30',
      nameOnCard: 'Smoke Tester',
      network: 'Visa' as const,
    },
  };
}

function createDeferred<T>() {
  let resolve!: (value: T | PromiseLike<T>) => void;
  let reject!: (reason?: unknown) => void;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}
