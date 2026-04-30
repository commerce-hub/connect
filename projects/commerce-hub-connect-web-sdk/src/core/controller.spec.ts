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
});

function requestHeadersFrom(fetchSpy: jasmine.Spy<typeof fetch>): Record<string, string> {
  const [, init] = fetchSpy.calls.mostRecent().args as [RequestInfo | URL, RequestInit | undefined];
  const headers = new Headers(init?.headers);
  return Object.fromEntries(headers.entries());
}

function createJsonResponse(body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status: 200,
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
