import createClient, {type Client, type Middleware} from 'openapi-fetch';

import type {paths as configPaths} from '../generated/config-openapi.js';
import type {paths} from '../generated/openapi.js';
import type {paths as merchantPaths} from '../generated/merchant-openapi.js';

export type CommerceHubClient = Client<paths>;
export type CommerceHubMerchantClient = Client<merchantPaths>;
export type CommerceHubConfigClient = Client<configPaths>;

/** Default production origin used for SDK-managed CommerceHub requests. */
export const DEFAULT_COMMERCE_HUB_BASE_URL =
  'https://connect.fiservapis.com/chc';

/** Named CommerceHub environment presets accepted by the SDK. */
export type CommerceHubBaseURLPreset = 'DEV' | 'QA' | 'CERT' | 'PROD';

/** CommerceHub preset name or custom origin URL. */
export type CommerceHubBaseURLInput = CommerceHubBaseURLPreset | string;

/** CommerceHub preset origins used by `resolveCommerceHubBaseURL`. */
export const COMMERCE_HUB_BASE_URLS: Record<CommerceHubBaseURLPreset, string> =
  {
    DEV: 'https://connect-dev.fiservapis.com/chc',
    QA: 'https://connect-qa.fiservapis.com/chc',
    CERT: 'https://connect-cert.fiservapis.com/chc',
    PROD: 'https://connect.fiservapis.com/chc',
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

export const createCommerceHubClient = (
  options: CommerceHubClientOptions
): CommerceHubClient => createCommerceHubClientForPaths<paths>(options);

/**
 * Creates a typed CommerceHub Merchant API client for host-owned API calls.
 */
export const createCommerceHubMerchantClient = (
  options: CommerceHubClientOptions
): CommerceHubMerchantClient =>
  createCommerceHubClientForPaths<merchantPaths>(options);

/**
 * Creates a typed CommerceHub Party Configuration API client.
 */
export const createCommerceHubConfigClient = (
  options: CommerceHubClientOptions
): CommerceHubConfigClient =>
  createCommerceHubClientForPaths<configPaths>(options);

const createCommerceHubClientForPaths = <ApiPaths extends {}>(
  options: CommerceHubClientOptions
): Client<ApiPaths> => {
  const client = createClient<ApiPaths>({
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
