/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */

import {legacyPlugin} from '@web/dev-server-legacy';

import {
  createCommerceHubDevAuthHeaders,
  isCommerceHubDevCreateInteractionRequest,
} from './dev/commerce-hub-dev-auth.js';

const mode = process.env.MODE || 'dev';
if (!['dev', 'prod'].includes(mode)) {
  throw new Error(`MODE must be "dev" or "prod", was "${mode}"`);
}

const COMMERCE_HUB_PROXY_PREFIX = '/__commercehub';
const COMMERCE_HUB_PROXY_TARGETS = {
  DEV: 'https://connect-dev.fiservapis.com/chc',
  QA: 'https://qa.openfx-nonprod.aws.fisv.cloud',
  PROD: 'https://qa.openfx-nonprod.aws.fisv.cloud',
};

const blockedProxyRequestHeaders = new Set([
  'connection',
  'content-length',
  'host',
  'origin',
  'referer',
  'transfer-encoding',
]);

const blockedProxyResponseHeaders = new Set([
  'content-encoding',
  'content-length',
  'transfer-encoding',
]);

const commerceHubProxyMiddleware = async (context, next) => {
  if (!context.path.startsWith(`${COMMERCE_HUB_PROXY_PREFIX}/`)) {
    await next();
    return;
  }

  const [, preset, ...pathParts] = context.path
    .slice(COMMERCE_HUB_PROXY_PREFIX.length)
    .split('/');
  const targetBaseUrl = COMMERCE_HUB_PROXY_TARGETS[preset];

  if (!targetBaseUrl) {
    context.status = 404;
    context.body = `Unknown CommerceHub proxy environment: ${preset}`;
    return;
  }

  const targetUrl = new URL(pathParts.join('/'), `${targetBaseUrl}/`);
  targetUrl.search = context.querystring;

  const proxyPath = `/${pathParts.join('/')}`;
  const headers = new Headers();
  for (const [header, value] of Object.entries(context.headers)) {
    if (!blockedProxyRequestHeaders.has(header) && value !== undefined) {
      headers.set(header, Array.isArray(value) ? value.join(', ') : value);
    }
  }

  const hasBody = !['GET', 'HEAD'].includes(context.method);
  const shouldSignDevCreateInteraction =
    isCommerceHubDevCreateInteractionRequest({
      preset,
      method: context.method,
      path: proxyPath,
    });
  let body = hasBody ? context.req : undefined;

  if (shouldSignDevCreateInteraction) {
    const bodyBuffer = await readRequestBody(context.req);

    try {
      applyHeaders(
        headers,
        createCommerceHubDevAuthHeaders({
          body: bodyBuffer.toString('utf8'),
        })
      );
    } catch (error) {
      context.status = 500;
      context.body = error instanceof Error ? error.message : String(error);
      return;
    }

    body = bodyBuffer;
  }

  const response = await fetch(targetUrl, {
    method: context.method,
    headers,
    body,
    ...(hasBody ? {duplex: 'half'} : {}),
  });

  context.status = response.status;
  response.headers.forEach((value, header) => {
    if (!blockedProxyResponseHeaders.has(header)) {
      context.set(header, value);
    }
  });
  context.body = Buffer.from(await response.arrayBuffer());
};

const applyHeaders = (target, headers) => {
  Object.entries(headers).forEach(([header, value]) => {
    target.set(header, value);
  });
};

const readRequestBody = async (request) => {
  const chunks = [];

  for await (const chunk of request) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }

  return Buffer.concat(chunks);
};

export default {
  nodeResolve: {exportConditions: mode === 'dev' ? ['development'] : []},
  preserveSymlinks: true,
  middleware: [commerceHubProxyMiddleware],
  plugins: [
    legacyPlugin({
      polyfills: {
        // Manually imported in index.html file
        webcomponents: false,
      },
    }),
  ],
};
