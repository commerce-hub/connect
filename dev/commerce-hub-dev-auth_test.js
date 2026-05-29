import assert from 'node:assert/strict';
import test from 'node:test';

import {
  DEFAULT_COMMERCE_HUB_DEV_USER_EMAIL,
  createCommerceHubDevAuthHeaders,
  createCommerceHubDevAuthorization,
  isCommerceHubDevSignedMerchantInteractionRequest,
} from './commerce-hub-dev-auth.js';

test('creates the CommerceHub DEV HMAC authorization value', () => {
  assert.equal(
    createCommerceHubDevAuthorization({
      apiKey: 'test-key',
      apiSecret: 'test-secret',
      clientRequestId: '6716010',
      timestamp: '1779892447158',
      body: '{"email":"user@example.com","mode":"PRE_AUTHENTICATED"}',
    }),
    '4Y5PcdJ6P9f1WakAA3THpZufvixU0sMokNdhoXSSKs8='
  );
});

test('creates CommerceHub DEV HMAC request headers from env vars', () => {
  assert.deepEqual(
    createCommerceHubDevAuthHeaders({
      body: '{"email":"user@example.com","mode":"PRE_AUTHENTICATED"}',
      env: {
        COMMERCE_HUB_DEV_API_KEY: 'test-key',
        COMMERCE_HUB_DEV_API_SECRET: 'test-secret',
      },
      now: () => 1779892447158,
      createClientRequestId: () => 6716010,
    }),
    {
      'Api-Key': 'test-key',
      Authorization: '4Y5PcdJ6P9f1WakAA3THpZufvixU0sMokNdhoXSSKs8=',
      'Auth-Token-Type': 'HMAC',
      'Client-Request-Id': '6716010',
      Timestamp: '1779892447158',
      'x-user-email': DEFAULT_COMMERCE_HUB_DEV_USER_EMAIL,
    }
  );
});

test('requires CommerceHub DEV HMAC credentials from env vars', () => {
  assert.throws(
    () =>
      createCommerceHubDevAuthHeaders({
        body: '{"email":"user@example.com","mode":"PRE_AUTHENTICATED"}',
        env: {},
      }),
    /COMMERCE_HUB_DEV_API_KEY is required/
  );

  assert.throws(
    () =>
      createCommerceHubDevAuthHeaders({
        body: '{"email":"user@example.com","mode":"PRE_AUTHENTICATED"}',
        env: {
          COMMERCE_HUB_DEV_API_KEY: 'test-key',
        },
      }),
    /COMMERCE_HUB_DEV_API_SECRET is required/
  );
});

test('gates CommerceHub DEV HMAC auth to signed merchant interaction POST requests', () => {
  assert.equal(
    isCommerceHubDevSignedMerchantInteractionRequest({
      preset: 'DEV',
      method: 'POST',
      path: '/merchant/interaction/create',
    }),
    true
  );
  assert.equal(
    isCommerceHubDevSignedMerchantInteractionRequest({
      preset: 'DEV',
      method: 'POST',
      path: '/merchant/interaction/complete',
    }),
    true
  );
  assert.equal(
    isCommerceHubDevSignedMerchantInteractionRequest({
      preset: 'QA',
      method: 'POST',
      path: '/merchant/interaction/create',
    }),
    false
  );
  assert.equal(
    isCommerceHubDevSignedMerchantInteractionRequest({
      preset: 'DEV',
      method: 'GET',
      path: '/merchant/interaction/create',
    }),
    false
  );
  assert.equal(
    isCommerceHubDevSignedMerchantInteractionRequest({
      preset: 'DEV',
      method: 'POST',
      path: '/interaction',
    }),
    false
  );
});
