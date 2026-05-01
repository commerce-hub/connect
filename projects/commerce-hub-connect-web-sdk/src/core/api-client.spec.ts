import type {
  InteractionResponse,
  PayByBankSessionResponse,
  Profile,
  StringHolder,
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

  it('adds x-interaction-id to /customer requests when an interaction id exists', async () => {
    const client = new CommerceHubConnectApiClient('/api', 'interaction-1');

    fetchSpy.and.callFake(async (_input: RequestInfo | URL, _init?: RequestInit) =>
      createJsonResponse(createProfileResponse()),
    );
    await client.getCustomerProfile();

    expect(requestHeadersFrom(fetchSpy)['x-interaction-id']).toBe('interaction-1');
    expect(requestInitFrom(fetchSpy)?.credentials).toBe('include');
  });

  it('adds x-interaction-id to nested /customer requests when an interaction id exists', async () => {
    const client = new CommerceHubConnectApiClient('/api', 'interaction-1');

    fetchSpy.and.callFake(async (_input: RequestInfo | URL, _init?: RequestInit) =>
      createJsonResponse(createStringHolderResponse()),
    );
    await client.mask('card', { value: '4111111111111111' });

    expect(requestHeadersFrom(fetchSpy)).toEqual(
      jasmine.objectContaining({
        accept: 'application/json',
        'content-type': 'application/json',
        'x-interaction-id': 'interaction-1',
      }),
    );
    expect(requestInitFrom(fetchSpy)?.credentials).toBe('include');
  });

  it('does not add x-interaction-id to /customer requests when an interaction id is absent', async () => {
    const client = new CommerceHubConnectApiClient('/api');

    fetchSpy.and.callFake(async (_input: RequestInfo | URL, _init?: RequestInit) =>
      createJsonResponse(createProfileResponse()),
    );
    await client.getCustomerProfile();

    expect(requestHeadersFrom(fetchSpy)['x-interaction-id']).toBeUndefined();
    expect(requestInitFrom(fetchSpy)?.credentials).toBe('include');
  });

  it('adds x-interaction-id to /pbb/session requests when an interaction id exists', async () => {
    const client = new CommerceHubConnectApiClient('/api', 'interaction-1');

    fetchSpy.and.callFake(async (_input: RequestInfo | URL, _init?: RequestInit) =>
      createJsonResponse(createPayByBankResponse()),
    );
    await client.createPayByBankSession();

    expect(requestHeadersFrom(fetchSpy)).toEqual(
      jasmine.objectContaining({
        accept: 'application/json',
        'x-interaction-id': 'interaction-1',
      }),
    );
    expect(requestInitFrom(fetchSpy)?.credentials).toBe('include');
  });

  it('adds x-interaction-id to nested /pbb/session requests when an interaction id exists', async () => {
    const client = new CommerceHubConnectApiClient('/api', 'interaction-1');

    fetchSpy.and.callFake(async (_input: RequestInfo | URL, _init?: RequestInit) =>
      new Response(null, { status: 204 }),
    );
    await client.finalizePayByBankSession('agg-session-1', 'p-token-1');

    expect(requestHeadersFrom(fetchSpy)).toEqual(
      jasmine.objectContaining({
        accept: 'application/json',
        'x-interaction-id': 'interaction-1',
      }),
    );
    expect(requestInitFrom(fetchSpy)?.credentials).toBe('include');
  });

  it('does not add x-interaction-id to /pbb/session requests when an interaction id is absent', async () => {
    const client = new CommerceHubConnectApiClient('/api');

    fetchSpy.and.callFake(async (_input: RequestInfo | URL, _init?: RequestInit) =>
      createJsonResponse(createPayByBankResponse()),
    );
    await client.createPayByBankSession();

    expect(requestHeadersFrom(fetchSpy)['x-interaction-id']).toBeUndefined();
  });

  it('does not add x-interaction-id to unrelated requests', async () => {
    const client = new CommerceHubConnectApiClient('/api', 'interaction-1');

    fetchSpy.and.callFake(async (_input: RequestInfo | URL, _init?: RequestInit) =>
      createJsonResponse({ ok: true }),
    );
    await (client as any).request('/merchant/session', { method: 'GET' });

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
  const init = requestInitFrom(fetchSpy);
  const headers = new Headers(init?.headers);
  return Object.fromEntries(headers.entries());
}

function requestInitFrom(fetchSpy: jasmine.Spy<typeof fetch>): RequestInit | undefined {
  const [, init] = fetchSpy.calls.mostRecent().args as [RequestInfo | URL, RequestInit | undefined];
  return init;
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

function createStringHolderResponse(
  overrides: Partial<StringHolder> = {},
): StringHolder {
  return {
    value: 'masked-value',
    ...overrides,
  };
}
