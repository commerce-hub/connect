import assert from 'node:assert/strict';
import test from 'node:test';

import {
  COMMERCE_HUB_DEV_AUTH_DEFAULTS,
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

test('falls back to temporary hardcoded CommerceHub DEV HMAC credentials', () => {
  const body = '{"email":"user@example.com","mode":"PRE_AUTHENTICATED"}';
  const headers = createCommerceHubDevAuthHeaders({
    body,
    env: {},
    now: () => 1779892447158,
    createClientRequestId: () => 6716010,
  });

  assert.equal(headers['Api-Key'], COMMERCE_HUB_DEV_AUTH_DEFAULTS.apiKey);
  assert.equal(
    headers.Authorization,
    createCommerceHubDevAuthorization({
      apiKey: COMMERCE_HUB_DEV_AUTH_DEFAULTS.apiKey,
      apiSecret: COMMERCE_HUB_DEV_AUTH_DEFAULTS.apiSecret,
      clientRequestId: '6716010',
      timestamp: '1779892447158',
      body,
    })
  );
  assert.equal(headers['x-user-email'], DEFAULT_COMMERCE_HUB_DEV_USER_EMAIL);
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
