import { promises as fs } from 'node:fs';
import { createServer } from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const workspaceRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const defaultProjectRoot = path.join(workspaceRoot, 'projects', 'commerce-hub-connect-web-sdk');
const defaultHost = process.env.HOST || '127.0.0.1';
const defaultPort = normalizePort(process.env.PORT) ?? 8080;
const corsAllowMethods = 'GET, HEAD, POST, PUT, PATCH, DELETE, OPTIONS';
const defaultCorsAllowHeaders = 'Accept, Authorization, Content-Type, Origin, X-Requested-With';
const hopByHopHeaders = new Set([
  'connection',
  'keep-alive',
  'proxy-authenticate',
  'proxy-authorization',
  'te',
  'trailer',
  'transfer-encoding',
  'upgrade',
]);

const contentTypes = new Map([
  ['.css', 'text/css; charset=utf-8'],
  ['.d.ts', 'text/plain; charset=utf-8'],
  ['.html', 'text/html; charset=utf-8'],
  ['.js', 'text/javascript; charset=utf-8'],
  ['.json', 'application/json; charset=utf-8'],
  ['.map', 'application/json; charset=utf-8'],
  ['.svg', 'image/svg+xml'],
  ['.txt', 'text/plain; charset=utf-8'],
  ['.woff', 'font/woff'],
  ['.woff2', 'font/woff2'],
]);

export const exampleEntryUrlPath = '/example/index.html';
export const proxyRoutePrefix = '/commerce-hub-proxy';
export const defaultProxyTargets = Object.freeze({
  dev:
    process.env.COMMERCE_HUB_PROXY_DEV_BASE_URL || 'https://dev.openfx-nonprod.aws.fisv.cloud',
  qa: process.env.COMMERCE_HUB_PROXY_QA_BASE_URL || 'https://dev.openfx-nonprod.aws.fisv.cloud',
  cat:
    process.env.COMMERCE_HUB_PROXY_CAT_BASE_URL || 'https://dev.openfx-nonprod.aws.fisv.cloud',
  prod:
    process.env.COMMERCE_HUB_PROXY_PROD_BASE_URL || 'https://dev.openfx-nonprod.aws.fisv.cloud',
});

export function createExampleServer({
  fetchImpl = globalThis.fetch,
  projectRoot = defaultProjectRoot,
  proxyTargets = defaultProxyTargets,
} = {}) {
  if (typeof fetchImpl !== 'function') {
    throw new TypeError('fetchImpl must be a function.');
  }

  return createServer(async (request, response) => {
    try {
      const requestUrl = new URL(request.url || '/', 'http://127.0.0.1');
      const proxyMatch = matchProxyRequest(requestUrl.pathname, proxyTargets);

      if (proxyMatch) {
        await handleProxyRequest(request, response, requestUrl, proxyMatch, fetchImpl, proxyTargets);
        return;
      }

      if (!isStaticMethod(request.method)) {
        writePlainText(response, 405, 'Method Not Allowed');
        return;
      }

      await serveStaticFile(projectRoot, requestUrl.pathname, request.method === 'HEAD', response);
    } catch (error) {
      writeJson(response, 500, {
        message: error instanceof Error ? error.message : String(error),
      });
    }
  });
}

export function listen(server, port = defaultPort, host = defaultHost) {
  return new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(port, host, () => {
      const address = server.address();

      if (!address || typeof address === 'string') {
        reject(new Error('Unable to determine the example server address.'));
        return;
      }

      resolve(address.port);
    });
  });
}

export function closeServer(server) {
  return new Promise((resolve, reject) => {
    server.close((error) => {
      if (error) {
        reject(error);
        return;
      }

      resolve();
    });
  });
}

async function handleProxyRequest(request, response, requestUrl, proxyMatch, fetchImpl, proxyTargets) {
  const corsHeaders = buildCorsHeaders(request);

  if (request.method === 'OPTIONS') {
    response.writeHead(204, {
      ...corsHeaders,
      'cache-control': 'no-store',
    });
    response.end();
    return;
  }

  const upstreamBaseUrl = proxyTargets[proxyMatch.environment];

  if (!upstreamBaseUrl) {
    writeJson(
      response,
      404,
      {
        message: `Unknown Commerce Hub environment "${proxyMatch.environment}".`,
      },
      corsHeaders,
    );
    return;
  }

  const upstreamUrl = new URL(
    `${proxyMatch.upstreamPath}${requestUrl.search}`,
    ensureTrailingSlash(upstreamBaseUrl),
  );
  const requestHeaders = buildProxyRequestHeaders(request.headers);
  const requestBody = shouldIncludeBody(request.method) ? await readRequestBody(request) : undefined;

  try {
    const upstreamResponse = await fetchImpl(upstreamUrl, {
      body: requestBody?.length ? requestBody : undefined,
      headers: requestHeaders,
      method: request.method || 'GET',
    });
    const responseBody = Buffer.from(await upstreamResponse.arrayBuffer());
    const upstreamHeaders = Object.create(null);

    for (const [name, value] of upstreamResponse.headers) {
      if (!shouldForwardResponseHeader(name)) {
        continue;
      }

      upstreamHeaders[name] = value;
    }

    const responseHeaders = {
      ...upstreamHeaders,
      ...corsHeaders,
      'cache-control': 'no-store',
    };

    if (upstreamHeaders.vary) {
      responseHeaders.vary = mergeHeaderValues(upstreamHeaders.vary, corsHeaders.vary);
    }

    response.writeHead(upstreamResponse.status, responseHeaders);
    response.end(responseBody);
  } catch (error) {
    writeJson(
      response,
      502,
      {
        message: error instanceof Error ? error.message : String(error),
      },
      corsHeaders,
    );
  }
}

function buildCorsHeaders(request) {
  const origin = normalizeHeaderValue(request.headers.origin) || '*';
  const requestedHeaders = normalizeHeaderValue(request.headers['access-control-request-headers']);

  return {
    'access-control-allow-headers': requestedHeaders || defaultCorsAllowHeaders,
    'access-control-allow-methods': corsAllowMethods,
    'access-control-allow-origin': origin,
    'access-control-max-age': '86400',
    vary: 'Origin, Access-Control-Request-Headers, Access-Control-Request-Method',
  };
}

function buildProxyRequestHeaders(requestHeaders) {
  const headers = new Headers();

  for (const [name, value] of Object.entries(requestHeaders)) {
    if (!value) {
      continue;
    }

    const normalizedName = name.toLowerCase();

    if (
      hopByHopHeaders.has(normalizedName) ||
      normalizedName === 'accept-encoding' ||
      normalizedName === 'content-length' ||
      normalizedName === 'host' ||
      normalizedName === 'origin' ||
      normalizedName === 'referer' ||
      normalizedName.startsWith('proxy-') ||
      normalizedName.startsWith('sec-')
    ) {
      continue;
    }

    if (Array.isArray(value)) {
      for (const entry of value) {
        headers.append(name, entry);
      }

      continue;
    }

    headers.set(name, value);
  }

  return headers;
}

function matchProxyRequest(pathname, proxyTargets) {
  const decodedPath = decodeURIComponent(pathname);
  const prefixedMatch = decodedPath.match(/^\/(?:commerce-hub-proxy|api)\/([^/]+)(\/.*)?$/u);

  if (prefixedMatch) {
    return {
      environment: prefixedMatch[1],
      upstreamPath: prefixedMatch[2] || '/',
    };
  }

  const rewrittenMatch = decodedPath.match(/^\/([^/]+)(\/(?:interaction|merchant)\/.*)$/u);

  if (rewrittenMatch && proxyTargets[rewrittenMatch[1]]) {
    return {
      environment: rewrittenMatch[1],
      upstreamPath: rewrittenMatch[2],
    };
  }

  return null;
}

async function serveStaticFile(projectRoot, requestPathname, headOnly, response) {
  const pathname = requestPathname === '/' ? exampleEntryUrlPath : requestPathname;
  const decodedPath = decodeURIComponent(pathname);
  const filePath = path.resolve(projectRoot, `.${decodedPath}`);

  if (!isPathInside(projectRoot, filePath)) {
    writePlainText(response, 403, 'Forbidden');
    return;
  }

  let resolvedPath = filePath;
  let fileStat;

  try {
    fileStat = await fs.stat(resolvedPath);
  } catch (error) {
    if (isEnoent(error)) {
      writePlainText(response, 404, 'Not found');
      return;
    }

    throw error;
  }

  if (fileStat.isDirectory()) {
    resolvedPath = path.join(resolvedPath, 'index.html');
  }

  let fileBuffer;

  try {
    fileBuffer = await fs.readFile(resolvedPath);
  } catch (error) {
    if (isEnoent(error)) {
      writePlainText(response, 404, 'Not found');
      return;
    }

    throw error;
  }

  response.writeHead(200, {
    'Cache-Control': 'no-store',
    'Content-Type': contentTypes.get(path.extname(resolvedPath).toLowerCase()) || 'application/octet-stream',
  });

  if (headOnly) {
    response.end();
    return;
  }

  response.end(fileBuffer);
}

async function readRequestBody(request) {
  const chunks = [];

  for await (const chunk of request) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }

  return chunks.length ? Buffer.concat(chunks) : Buffer.alloc(0);
}

function shouldForwardResponseHeader(name) {
  const normalizedName = name.toLowerCase();

  return (
    !hopByHopHeaders.has(normalizedName) &&
    normalizedName !== 'content-encoding' &&
    normalizedName !== 'content-length' &&
    !normalizedName.startsWith('access-control-')
  );
}

function isStaticMethod(method) {
  return method === 'GET' || method === 'HEAD';
}

function shouldIncludeBody(method) {
  return Boolean(method && method !== 'GET' && method !== 'HEAD');
}

function writeJson(response, statusCode, payload, extraHeaders = {}) {
  response.writeHead(statusCode, {
    'Cache-Control': 'no-store',
    'Content-Type': 'application/json; charset=utf-8',
    ...extraHeaders,
  });
  response.end(JSON.stringify(payload));
}

function writePlainText(response, statusCode, body) {
  response.writeHead(statusCode, {
    'Cache-Control': 'no-store',
    'Content-Type': 'text/plain; charset=utf-8',
  });
  response.end(body);
}

function ensureTrailingSlash(url) {
  return url.endsWith('/') ? url : `${url}/`;
}

function mergeHeaderValues(firstValue, secondValue) {
  if (!firstValue) {
    return secondValue;
  }

  if (!secondValue) {
    return firstValue;
  }

  return `${firstValue}, ${secondValue}`;
}

function normalizeHeaderValue(value) {
  if (Array.isArray(value)) {
    return value.join(', ');
  }

  return value || '';
}

function isPathInside(rootPath, childPath) {
  const relativePath = path.relative(rootPath, childPath);
  return Boolean(relativePath) ? !relativePath.startsWith('..') && !path.isAbsolute(relativePath) : true;
}

function isEnoent(error) {
  return Boolean(error && typeof error === 'object' && 'code' in error && error.code === 'ENOENT');
}

function normalizePort(value) {
  if (!value) {
    return undefined;
  }

  const port = Number.parseInt(value, 10);
  return Number.isInteger(port) && port > 0 ? port : undefined;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const server = createExampleServer();
  const shutdown = async () => {
    await closeServer(server).catch(() => undefined);
    process.exit(0);
  };

  process.once('SIGINT', shutdown);
  process.once('SIGTERM', shutdown);

  try {
    const port = await listen(server);

    console.log(`Commerce Hub web SDK example server listening on http://${defaultHost}:${port}`);
    console.log(`Standalone sandbox: http://${defaultHost}:${port}/`);
    console.log(`Proxy route: ${proxyRoutePrefix}/{dev|qa|cat|prod}/...`);
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  }
}
