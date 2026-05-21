import createClient, {type Client, type Middleware} from 'openapi-fetch';

import type {paths} from '../generated/openapi.js';

export type CommerceHubClient = Client<paths>;

export const DEFAULT_COMMERCE_HUB_BASE_URL = 'http://localhost:8080';

export type CommerceHubBaseURLPreset = 'DEV' | 'QA' | 'PROD';
export type CommerceHubBaseURLInput = CommerceHubBaseURLPreset | string;

export const COMMERCE_HUB_BASE_URLS: Record<CommerceHubBaseURLPreset, string> =
  {
    DEV: 'https://qa.openfx-nonprod.aws.fisv.cloud',
    QA: 'https://qa.openfx-nonprod.aws.fisv.cloud',
    PROD: 'https://qa.openfx-nonprod.aws.fisv.cloud',
  };

export interface CommerceHubClientOptions {
  baseUrl?: CommerceHubBaseURLInput;
  baseURL?: CommerceHubBaseURLInput;
  headers?: HeadersInit;
  getHeaders?: () => HeadersInit | Promise<HeadersInit>;
}

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
