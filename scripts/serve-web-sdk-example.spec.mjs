import assert from 'node:assert/strict';
import { mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import test from 'node:test';

import {
  closeServer,
  createExampleServer,
  defaultProxyTargets,
  proxyRoutePrefix,
} from './serve-web-sdk-example.mjs';

test('serves the standalone example page from the server root', async (t) => {
  const projectRoot = await createProjectFixture();
  t.after(async () => {
    await rm(projectRoot, { recursive: true, force: true });
  });

  const server = createExampleServer({
    projectRoot,
    fetchImpl: async () => new Response('unexpected'),
  });

  await listen(server);
  t.after(async () => {
    await closeServer(server);
  });

  const response = await fetch(`${getBaseUrl(server)}/`);

  assert.equal(response.status, 200);
  assert.equal(await response.text(), '<!doctype html><title>Example sandbox fixture</title>');
});

test('answers proxy preflight requests without contacting the upstream host', async (t) => {
  const projectRoot = await createProjectFixture();
  t.after(async () => {
    await rm(projectRoot, { recursive: true, force: true });
  });

  let forwardedRequest = false;
  const server = createExampleServer({
    projectRoot,
    fetchImpl: async () => {
      forwardedRequest = true;
      return new Response('unexpected');
    },
  });

  await listen(server);
  t.after(async () => {
    await closeServer(server);
  });

  const response = await fetch(
    `${getBaseUrl(server)}${proxyRoutePrefix}/dev/merchant/interaction/create`,
    {
      method: 'OPTIONS',
      headers: {
        Origin: 'http://localhost:3000',
        'Access-Control-Request-Headers': 'content-type,authorization',
        'Access-Control-Request-Method': 'POST',
      },
    },
  );

  assert.equal(response.status, 204);
  assert.equal(response.headers.get('access-control-allow-origin'), 'http://localhost:3000');
  assert.match(response.headers.get('access-control-allow-methods') || '', /\bPOST\b/);
  assert.equal(forwardedRequest, false);
});

test('proxies interaction create requests to the selected Commerce Hub environment', async (t) => {
  const projectRoot = await createProjectFixture();
  t.after(async () => {
    await rm(projectRoot, { recursive: true, force: true });
  });

  let forwardedRequest;
  const server = createExampleServer({
    projectRoot,
    fetchImpl: async (url, init = {}) => {
      forwardedRequest = {
        body:
          init.body instanceof Uint8Array
            ? Buffer.from(init.body).toString('utf8')
            : String(init.body ?? ''),
        headers: new Headers(init.headers),
        method: init.method,
        url: String(url),
      };

      return new Response(JSON.stringify({ interactionId: 'interaction-1' }), {
        status: 201,
        headers: {
          'content-type': 'application/json',
          'x-upstream-trace': 'trace-123',
        },
      });
    },
  });

  await listen(server);
  t.after(async () => {
    await closeServer(server);
  });

  const response = await fetch(
    `${getBaseUrl(server)}${proxyRoutePrefix}/dev/merchant/interaction/create?source=example`,
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Origin: 'http://localhost:3000',
        'X-Trace': 'trace-1',
      },
      body: JSON.stringify({
        sessionReferenceId: 'session-1',
      }),
    },
  );

  assert.equal(response.status, 201);
  assert.deepEqual(await response.json(), { interactionId: 'interaction-1' });
  assert.equal(
    forwardedRequest?.url,
    `${defaultProxyTargets.dev}/merchant/interaction/create?source=example`,
  );
  assert.equal(forwardedRequest?.method, 'POST');
  assert.equal(forwardedRequest?.headers.get('accept'), 'application/json');
  assert.equal(forwardedRequest?.headers.get('content-type'), 'application/json');
  assert.equal(forwardedRequest?.headers.get('x-trace'), 'trace-1');
  assert.equal(forwardedRequest?.headers.get('origin'), null);
  assert.equal(
    forwardedRequest?.body,
    JSON.stringify({
      sessionReferenceId: 'session-1',
    }),
  );
  assert.equal(response.headers.get('x-upstream-trace'), 'trace-123');
});

test('preserves upstream vary values when adding local CORS vary headers', async (t) => {
  const projectRoot = await createProjectFixture();
  t.after(async () => {
    await rm(projectRoot, { recursive: true, force: true });
  });

  const server = createExampleServer({
    projectRoot,
    fetchImpl: async () =>
      new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: {
          'content-type': 'application/json',
          vary: 'accept-encoding',
        },
      }),
  });

  await listen(server);
  t.after(async () => {
    await closeServer(server);
  });

  const response = await fetch(`${getBaseUrl(server)}${proxyRoutePrefix}/dev/merchant/interaction/create`, {
    method: 'POST',
    headers: {
      Origin: 'http://localhost:3000',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({}),
  });

  assert.equal(response.status, 200);
  assert.equal(
    response.headers.get('vary'),
    'accept-encoding, Origin, Access-Control-Request-Headers, Access-Control-Request-Method',
  );
});

async function createProjectFixture() {
  const projectRoot = await mkdtemp(path.join(tmpdir(), 'commerce-hub-web-sdk-example-'));

  await mkdir(path.join(projectRoot, 'dist'), { recursive: true });
  await mkdir(path.join(projectRoot, 'example'), { recursive: true });
  await writeFile(
    path.join(projectRoot, 'dist', 'CommerceHubConnectSDK.js'),
    'window.CommerceHubConnectWebSdk = {};',
  );
  await writeFile(
    path.join(projectRoot, 'example', 'index.html'),
    '<!doctype html><title>Example sandbox fixture</title>',
  );

  return projectRoot;
}

function getBaseUrl(server) {
  const address = server.address();

  if (!address || typeof address === 'string') {
    throw new Error('Server address is not available.');
  }

  return `http://127.0.0.1:${address.port}`;
}

function listen(server, port = 0, host = '127.0.0.1') {
  return new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(port, host, () => resolve());
  });
}
