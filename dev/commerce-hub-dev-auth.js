import {createHmac, randomInt} from 'node:crypto';

export const COMMERCE_HUB_DEV_AUTH_ENV = {
  apiKey: 'COMMERCE_HUB_DEV_API_KEY',
  apiSecret: 'COMMERCE_HUB_DEV_API_SECRET',
  userEmail: 'COMMERCE_HUB_DEV_USER_EMAIL',
};

export const DEFAULT_COMMERCE_HUB_DEV_USER_EMAIL = 'user@example.com';

export const COMMERCE_HUB_DEV_AUTH_DEFAULTS = {
  apiKey: 'OA8U37GoO1M8VAj2fRBDAiC4KeiJ3aGXBrI752kBAbKuw2PN',
  apiSecret: 'l2C7nX8hrl4g8DNS08dUQDbrQTVDBXp9rkCSKv50ivvphrNnG3JfnVSJO0G0riw4',
  userEmail: DEFAULT_COMMERCE_HUB_DEV_USER_EMAIL,
};

export const isCommerceHubDevCreateInteractionRequest = ({
  preset,
  method,
  path,
}) =>
  preset === 'DEV' &&
  method.toUpperCase() === 'POST' &&
  normalizePath(path) === '/merchant/interaction/create';

export const createCommerceHubDevAuthorization = ({
  apiKey,
  apiSecret,
  clientRequestId,
  timestamp,
  body,
}) =>
  createHmac('sha256', apiSecret)
    .update(`${apiKey}${clientRequestId}${timestamp}${body}`)
    .digest('base64');

export const createCommerceHubDevAuthHeaders = ({
  body,
  env = process.env,
  now = Date.now,
  createClientRequestId = () => randomInt(1, 10000001),
}) => {
  const apiKey =
    env[COMMERCE_HUB_DEV_AUTH_ENV.apiKey] ??
    COMMERCE_HUB_DEV_AUTH_DEFAULTS.apiKey;
  const apiSecret =
    env[COMMERCE_HUB_DEV_AUTH_ENV.apiSecret] ??
    COMMERCE_HUB_DEV_AUTH_DEFAULTS.apiSecret;

  const clientRequestId = String(createClientRequestId());
  const timestamp = String(now());

  return {
    'Api-Key': apiKey,
    Authorization: createCommerceHubDevAuthorization({
      apiKey,
      apiSecret,
      clientRequestId,
      timestamp,
      body,
    }),
    'Auth-Token-Type': 'HMAC',
    'Client-Request-Id': clientRequestId,
    Timestamp: timestamp,
    'x-user-email':
      env[COMMERCE_HUB_DEV_AUTH_ENV.userEmail] ??
      COMMERCE_HUB_DEV_AUTH_DEFAULTS.userEmail,
  };
};

const normalizePath = (path) => `/${path.replace(/^\/+|\/+$/g, '')}`;
