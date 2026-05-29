import {createHmac, randomInt} from 'node:crypto';

export const COMMERCE_HUB_DEV_AUTH_ENV = {
  apiKey: 'COMMERCE_HUB_DEV_API_KEY',
  apiSecret: 'COMMERCE_HUB_DEV_API_SECRET',
  userEmail: 'COMMERCE_HUB_DEV_USER_EMAIL',
};

export const DEFAULT_COMMERCE_HUB_DEV_USER_EMAIL = 'user@example.com';

const SIGNED_MERCHANT_INTERACTION_POST_PATHS = new Set([
  '/merchant/interaction/create',
  '/merchant/interaction/complete',
]);

export const isCommerceHubDevSignedMerchantInteractionRequest = ({
  preset,
  method,
  path,
}) =>
  preset === 'DEV' &&
  method.toUpperCase() === 'POST' &&
  SIGNED_MERCHANT_INTERACTION_POST_PATHS.has(normalizePath(path));

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
  const apiKey = readRequiredEnv(env, COMMERCE_HUB_DEV_AUTH_ENV.apiKey);
  const apiSecret = readRequiredEnv(env, COMMERCE_HUB_DEV_AUTH_ENV.apiSecret);

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
      DEFAULT_COMMERCE_HUB_DEV_USER_EMAIL,
  };
};

const readRequiredEnv = (env, key) => {
  const value = env[key]?.trim();

  if (!value) {
    throw new Error(`${key} is required to sign CommerceHub DEV requests.`);
  }

  return value;
};

const normalizePath = (path) => `/${path.replace(/^\/+|\/+$/g, '')}`;
