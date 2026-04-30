import type { InteractionResponse } from '../contracts/api-models';
import type { CommerceHubSdkConfiguration } from '../contracts/sdk-models';
import { CommerceHubConnectWidgetController } from './controller';

describe('CommerceHubConnectWidgetController', () => {
  let fetchSpy: jasmine.Spy<typeof fetch>;

  beforeEach(() => {
    fetchSpy = spyOn(globalThis, 'fetch').and.callFake(
      async (_input: RequestInfo | URL, _init?: RequestInit) =>
        createJsonResponse(createInteractionResponse()),
    );
  });

  it('refreshes the api client interaction id after committing a new interaction', async () => {
    const controller = new CommerceHubConnectWidgetController(
      createInteractionResponse({ interactionId: 'interaction-1' }),
      createConfiguration(),
      undefined,
      'qa',
      '/api',
    );

    fetchSpy.calls.reset();
    (controller as any).commitInteraction(
      createInteractionResponse({ interactionId: 'interaction-2' }),
    );

    await (controller as any).api.getInteractionStatus();

    const headers = requestHeadersFrom(fetchSpy);
    expect(headers['x-interaction-id']).toBe('interaction-2');

    controller.destroy();
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
});

function requestHeadersFrom(fetchSpy: jasmine.Spy<typeof fetch>): Record<string, string> {
  const [, init] = fetchSpy.calls.mostRecent().args as [RequestInfo | URL, RequestInit | undefined];
  const headers = new Headers(init?.headers);
  return Object.fromEntries(headers.entries());
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
