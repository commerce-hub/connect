import createClient, {type Client, type Middleware} from 'openapi-fetch';

import type {paths} from '../generated/openapi.js';

export type CommerceHubClient = Client<paths>;

export const DEFAULT_COMMERCE_HUB_BASE_URL =
  'https://dev.openfx-nonprod.aws.fisv.cloud';

export interface CommerceHubClientOptions {
  baseUrl?: string;
  headers?: HeadersInit;
  getHeaders?: () => HeadersInit | Promise<HeadersInit>;
}

export const createCommerceHubClient = (
  options: CommerceHubClientOptions
): CommerceHubClient => {
  const client = createClient<paths>({
    baseUrl: options.baseUrl ?? DEFAULT_COMMERCE_HUB_BASE_URL,
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
