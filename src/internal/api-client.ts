import createClient, {type Client, type Middleware} from 'openapi-fetch';

import type {paths} from '../generated/openapi.js';

export type CommerceHubClient = Client<paths>;

/** Default local origin used for SDK-managed CommerceHub requests. */
export const DEFAULT_COMMERCE_HUB_BASE_URL = 'http://localhost:8080';

/** Named CommerceHub environment presets accepted by the SDK. */
export type CommerceHubBaseURLPreset = 'DEV' | 'QA' | 'PROD';

/** CommerceHub preset name or custom origin URL. */
export type CommerceHubBaseURLInput = CommerceHubBaseURLPreset | string;

/** CommerceHub preset origins used by `resolveCommerceHubBaseURL`. */
export const COMMERCE_HUB_BASE_URLS: Record<CommerceHubBaseURLPreset, string> =
  {
    DEV: 'https://qa.openfx-nonprod.aws.fisv.cloud',
    QA: 'https://qa.openfx-nonprod.aws.fisv.cloud',
    PROD: 'https://qa.openfx-nonprod.aws.fisv.cloud',
  };

export interface CommerceHubClientOptions {
  /** CommerceHub preset or origin. Takes precedence over `baseURL`. */
  baseUrl?: CommerceHubBaseURLInput;
  /** CommerceHub preset or origin. Kept for DOM-property naming consistency. */
  baseURL?: CommerceHubBaseURLInput;
  /** Static headers added to every request. */
  headers?: HeadersInit;
  /** Dynamic headers added to every request after `headers`. */
  getHeaders?: () => HeadersInit | Promise<HeadersInit>;
}

/**
 * Resolves a CommerceHub preset or custom origin into a normalized base URL.
 */
export const resolveCommerceHubBaseURL = (
  baseURL?: CommerceHubBaseURLInput
): string => {
  if (!baseURL) {
    return DEFAULT_COMMERCE_HUB_BASE_URL;
  }

  return stripTrailingSlash(
    isCommerceHubBaseURLPreset(baseURL)
      ? COMMERCE_HUB_BASE_URLS[baseURL]
      : baseURL
  );
};

/**
 * Creates a typed CommerceHub API client for host-owned API calls.
 */
export const createCommerceHubClient = (
  options: CommerceHubClientOptions
): CommerceHubClient => {
  const client = createClient<paths>({
    baseUrl: resolveCommerceHubBaseURL(options.baseUrl ?? options.baseURL),
  });

  const headersMiddleware: Middleware = {
    async onRequest({request}) {
      const headers = new Headers(request.headers);

      applyHeaders(headers, options.headers);

      if (options.getHeaders) {
        applyHeaders(headers, await options.getHeaders());
      }

      return new Request(request, {headers});
    },
  };

  client.use(headersMiddleware);

  return client;
};

const applyHeaders = (target: Headers, headers?: HeadersInit) => {
  new Headers(headers).forEach((value, key) => target.set(key, value));
};

const isCommerceHubBaseURLPreset = (
  baseURL: string
): baseURL is CommerceHubBaseURLPreset =>
  Object.prototype.hasOwnProperty.call(COMMERCE_HUB_BASE_URLS, baseURL);

const stripTrailingSlash = (url: string) =>
  url.endsWith('/') ? url.slice(0, -1) : url;
