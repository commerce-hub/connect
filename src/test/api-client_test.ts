import {assert} from '@open-wc/testing';

import {createCommerceHubClient} from '../internal/api-client.js';

suite('commerce-hub-connect api client', () => {
  const originalFetch = window.fetch;

  teardown(() => {
    window.fetch = originalFetch;
  });

  test('uses configured base URL and merges static and dynamic headers', async () => {
    let receivedRequest: Request | undefined;

    window.fetch = async (input: RequestInfo | URL) => {
      receivedRequest = input instanceof Request ? input : new Request(input);

      return new Response(
        JSON.stringify({interactionId: 'interaction-1'}),
        {
          status: 200,
          headers: {'Content-Type': 'application/json'},
        }
      );
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
    assert.equal(
      receivedRequest?.url,
      'https://api.example.test/interaction'
    );
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
});
