import { createServer } from 'node:http';
import { createReadStream, existsSync } from 'node:fs';
import { dirname, extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const demoRoot = normalize(__dirname);
const host = process.env.DEMO_HOST || '127.0.0.1';
const port = Number(process.env.DEMO_PORT || 4173);
const defaultTargetOrigin = (process.env.DEMO_TARGET_ORIGIN || 'http://localhost:8080').replace(/\/+$/, '');

const contentTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.ico': 'image/x-icon',
};

const sendJson = (response, statusCode, body) => {
  response.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
  });
  response.end(JSON.stringify(body));
};

const safeTargetOrigin = (value) => {
  const raw = (value || defaultTargetOrigin).trim().replace(/\/+$/, '');

  try {
    const url = new URL(raw);
    const isLocalHost =
      url.protocol === 'http:' &&
      (url.hostname === 'localhost' || url.hostname === '127.0.0.1');

    return isLocalHost ? url.origin : null;
  } catch {
    return null;
  }
};

const serveStaticFile = async (requestPath, response) => {
  const normalizedPath = requestPath === '/' ? '/index.html' : requestPath;
  const filePath = normalize(join(demoRoot, normalizedPath));

  if (!filePath.startsWith(demoRoot) || !existsSync(filePath)) {
    sendJson(response, 404, { message: 'Demo asset not found.' });
    return;
  }

  const extension = extname(filePath);
  response.writeHead(200, {
    'Content-Type': contentTypes[extension] || 'application/octet-stream',
    'Cache-Control': 'no-store',
  });

  createReadStream(filePath).pipe(response);
};

const proxyApiRequest = async (request, response, requestPath) => {
  const targetOrigin = safeTargetOrigin(request.headers['x-demo-target-origin']);

  if (!targetOrigin) {
    sendJson(response, 400, {
      message:
        'Invalid proxy target origin. Use a localhost HTTP backend, for example http://localhost:8080.',
    });
    return;
  }

  const targetUrl = `${targetOrigin}${requestPath.replace(/^\/api/, '')}`;
  const bodyBuffer =
    request.method === 'GET' || request.method === 'HEAD'
      ? undefined
      : Buffer.from(await readRequestBody(request));

  const upstreamResponse = await fetch(targetUrl, {
    method: request.method,
    headers: filterRequestHeaders(request.headers, targetOrigin),
    body: bodyBuffer,
  }).catch((error) => {
    sendJson(response, 502, {
      message: 'Proxy request failed.',
      detail: error instanceof Error ? error.message : String(error),
    });
    return null;
  });

  if (!upstreamResponse) {
    return;
  }

  const responseBuffer = Buffer.from(await upstreamResponse.arrayBuffer());
  const headers = filterResponseHeaders(upstreamResponse.headers);

  response.writeHead(upstreamResponse.status, headers);
  response.end(responseBuffer);
};

const filterRequestHeaders = (headers, targetOrigin) => {
  const forwarded = new Headers();

  for (const [key, value] of Object.entries(headers)) {
    if (!value) {
      continue;
    }

    const lowerKey = key.toLowerCase();
    if (
      lowerKey === 'host' ||
      lowerKey === 'origin' ||
      lowerKey === 'referer' ||
      lowerKey === 'content-length' ||
      lowerKey === 'x-demo-target-origin' ||
      lowerKey.startsWith('sec-fetch-')
    ) {
      continue;
    }

    forwarded.set(key, Array.isArray(value) ? value.join(', ') : value);
  }

  forwarded.set('origin', targetOrigin);
  return forwarded;
};

const filterResponseHeaders = (headers) => {
  const forwarded = {};

  headers.forEach((value, key) => {
    const lowerKey = key.toLowerCase();

    if (
      lowerKey === 'content-encoding' ||
      lowerKey === 'transfer-encoding' ||
      lowerKey === 'connection' ||
      lowerKey === 'access-control-allow-origin' ||
      lowerKey === 'access-control-allow-credentials' ||
      lowerKey === 'content-length'
    ) {
      return;
    }

    forwarded[key] = value;
  });

  forwarded['Cache-Control'] = 'no-store';
  return forwarded;
};

const readRequestBody = async (request) => {
  const chunks = [];

  for await (const chunk of request) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }

  return Buffer.concat(chunks);
};

const server = createServer(async (request, response) => {
  const requestUrl = new URL(request.url || '/', `http://${request.headers.host || `${host}:${port}`}`);

  if (requestUrl.pathname.startsWith('/api/')) {
    await proxyApiRequest(request, response, `${requestUrl.pathname}${requestUrl.search}`);
    return;
  }

  if (requestUrl.pathname === '/health') {
    sendJson(response, 200, {
      status: 'ok',
      demoRoot,
      defaultTargetOrigin,
    });
    return;
  }

  await serveStaticFile(requestUrl.pathname, response);
});

server.listen(port, host, () => {
  console.log(`Demo server running at http://${host}:${port}`);
  console.log(`Proxying /api/* to ${defaultTargetOrigin} unless x-demo-target-origin overrides it.`);
});
