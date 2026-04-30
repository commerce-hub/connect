import type {
  InteractionResponse,
  PayByBankSessionResponse,
  Profile,
} from '../contracts/api-models';
import { CommerceHubConnectApiClient } from './api-client';

describe('CommerceHubConnectApiClient', () => {
  let fetchSpy: jasmine.Spy<typeof fetch>;

  beforeEach(() => {
    fetchSpy = spyOn(globalThis, 'fetch').and.callFake(
      async (_input: RequestInfo | URL, _init?: RequestInit) =>
        createJsonResponse(createInteractionResponse()),
    );
  });

  it('adds x-interaction-id to interaction status requests', async () => {
    const client = new CommerceHubConnectApiClient('/api', 'interaction-1');

    await client.getInteractionStatus();

    expect(requestHeadersFrom(fetchSpy)).toEqual(
      jasmine.objectContaining({
        accept: 'application/json',
        'x-interaction-id': 'interaction-1',
      }),
    );
  });

  it('preserves json headers while adding x-interaction-id to otp requests', async () => {
    const client = new CommerceHubConnectApiClient('/api', 'interaction-1');

    await client.sendInteractionOtp({ value: 'merchant@example.com' });

    expect(requestHeadersFrom(fetchSpy)).toEqual(
      jasmine.objectContaining({
        accept: 'application/json',
        'content-type': 'application/json',
        'x-interaction-id': 'interaction-1',
      }),
    );
  });

  it('does not add x-interaction-id to non-interaction requests', async () => {
    const client = new CommerceHubConnectApiClient('/api', 'interaction-1');

    fetchSpy.and.callFake(async (_input: RequestInfo | URL, _init?: RequestInit) =>
      createJsonResponse(createProfileResponse()),
    );
    await client.getCustomerProfile();
    expect(requestHeadersFrom(fetchSpy)['x-interaction-id']).toBeUndefined();

    fetchSpy.and.callFake(async (_input: RequestInfo | URL, _init?: RequestInit) =>
      createJsonResponse(createPayByBankResponse()),
    );
    await client.createPayByBankSession();
    expect(requestHeadersFrom(fetchSpy)['x-interaction-id']).toBeUndefined();
  });

  it('uses the latest interaction id after updates', async () => {
    const client = new CommerceHubConnectApiClient('/api', 'interaction-1');
    client.setInteractionId('interaction-2');

    await client.attachPaymentMethod('payment-source-1');

    expect(requestHeadersFrom(fetchSpy)['x-interaction-id']).toBe('interaction-2');
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

function createProfileResponse(overrides: Partial<Profile> = {}): Profile {
  return {
    billingAddress: [],
    ...overrides,
  };
}

function createPayByBankResponse(
  overrides: Partial<PayByBankSessionResponse> = {},
): PayByBankSessionResponse {
  return {
    pToken: 'p-token',
    ...overrides,
  };
}
