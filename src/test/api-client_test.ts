import {assert} from '@open-wc/testing';

import {
  COMMERCE_HUB_BASE_URLS,
  DEFAULT_COMMERCE_HUB_BASE_URL,
  createCommerceHubClient,
  resolveCommerceHubBaseURL,
} from '../internal/api-client.js';

const PROD_COMMERCE_HUB_BASE_URL = 'https://connect.fiservapis.com/chc';

suite('commerce-hub-connect api client', () => {
  const originalFetch = window.fetch;

  teardown(() => {
    window.fetch = originalFetch;
  });

  test('resolves DEV, QA, and PROD presets to the configured CommerceHub origin', () => {
    assert.equal(
      resolveCommerceHubBaseURL('DEV'),
      'https://connect-dev.fiservapis.com/chc'
    );
    assert.equal(resolveCommerceHubBaseURL('QA'), COMMERCE_HUB_BASE_URLS.QA);
    assert.equal(
      resolveCommerceHubBaseURL('PROD'),
      PROD_COMMERCE_HUB_BASE_URL
    );
  });

  test('passes through custom base URLs and falls back to PROD by default', () => {
    assert.equal(
      resolveCommerceHubBaseURL('https://api.example.test'),
      'https://api.example.test'
    );
    assert.equal(resolveCommerceHubBaseURL(), PROD_COMMERCE_HUB_BASE_URL);
    assert.equal(DEFAULT_COMMERCE_HUB_BASE_URL, PROD_COMMERCE_HUB_BASE_URL);
  });

  test('uses configured base URL and merges static and dynamic headers', async () => {
    let receivedRequest: Request | undefined;

    window.fetch = async (input: RequestInfo | URL) => {
      receivedRequest = input instanceof Request ? input : new Request(input);

      return new Response(JSON.stringify({interactionId: 'interaction-1'}), {
        status: 200,
        headers: {'Content-Type': 'application/json'},
      });
    };

    const client = createCommerceHubClient({
      baseUrl: 'https://api.example.test',
      headers: {'X-Static-Header': 'static-value'},
      getHeaders: async () => ({
        Authorization: 'Bearer runtime-token',
        'X-Runtime-Header': 'runtime-value',
      }),
    });

    const response = await client.GET('/interaction');

    assert.equal(response.data?.interactionId, 'interaction-1');
    assert.equal(receivedRequest?.url, 'https://api.example.test/interaction');
    assert.equal(
      receivedRequest?.headers.get('X-Static-Header'),
      'static-value'
    );
    assert.equal(
      receivedRequest?.headers.get('Authorization'),
      'Bearer runtime-token'
    );
    assert.equal(
      receivedRequest?.headers.get('X-Runtime-Header'),
      'runtime-value'
    );
  });

  test('uses the PROD origin when no base URL option is provided', async () => {
    let receivedRequest: Request | undefined;

    window.fetch = async (input: RequestInfo | URL) => {
      receivedRequest = input instanceof Request ? input : new Request(input);

      return new Response(JSON.stringify({interactionId: 'interaction-1'}), {
        status: 200,
        headers: {'Content-Type': 'application/json'},
      });
    };

    const client = createCommerceHubClient({});

    await client.GET('/interaction');

    assert.equal(
      receivedRequest?.url,
      `${PROD_COMMERCE_HUB_BASE_URL}/interaction`
    );
  });

  test('uses baseUrl before baseURL when both client options are provided', async () => {
    let receivedRequest: Request | undefined;

    window.fetch = async (input: RequestInfo | URL) => {
      receivedRequest = input instanceof Request ? input : new Request(input);

      return new Response(JSON.stringify({interactionId: 'interaction-1'}), {
        status: 200,
        headers: {'Content-Type': 'application/json'},
      });
    };

    const client = createCommerceHubClient({
      baseUrl: 'https://base-url.example.test',
      baseURL: 'QA',
    });

    await client.GET('/interaction');

    assert.equal(
      receivedRequest?.url,
      'https://base-url.example.test/interaction'
    );
  });

  test('posts merchant interaction completion with a typed StringHolder body', async () => {
    let receivedRequest: Request | undefined;
    let receivedBody: unknown;

    window.fetch = async (input: RequestInfo | URL) => {
      receivedRequest = input instanceof Request ? input : new Request(input);
      receivedBody = await receivedRequest.json();

      return new Response(
        JSON.stringify({
          tenderType: 'Card',
          id: 'completed-source-1',
          name: 'Completed card',
          verificationInfo: {status: 'VERIFIED'},
          card: {network: 'Visa', cardNumber: '4111111111111111'},
        }),
        {
          status: 200,
          headers: {'Content-Type': 'application/json'},
        }
      );
    };

    const client = createCommerceHubClient({
      baseUrl: 'https://api.example.test',
    });

    const response = await client.POST('/merchant/interaction/complete', {
      body: {value: 'interaction-1'},
    });

    assert.equal(
      receivedRequest?.url,
      'https://api.example.test/merchant/interaction/complete'
    );
    assert.equal(receivedRequest?.method, 'POST');
    assert.deepEqual(receivedBody, {value: 'interaction-1'});
    assert.equal(response.data?.id, 'completed-source-1');
    assert.equal(response.data?.tenderType, 'Card');
  });
});
