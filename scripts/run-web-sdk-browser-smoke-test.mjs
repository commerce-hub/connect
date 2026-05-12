import { spawn } from 'node:child_process';
import { createServer } from 'node:http';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const workspaceRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const projectRoot = path.join(workspaceRoot, 'projects', 'commerce-hub-connect-web-sdk');
const chromeExecutable =
  process.env.CHROME_BIN || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const smokeEntryUrlPath = '/smoke/index.html';
const smokeServerPort = 8080;
const smokeServerHost = 'localhost';
const expectedMerchantData = {
  clientId: 'marriot',
  merchantId: '101475000000009',
  terminalId: '10000001',
};

const CONTENT_TYPES = new Map([
  ['.css', 'text/css; charset=utf-8'],
  ['.html', 'text/html; charset=utf-8'],
  ['.js', 'text/javascript; charset=utf-8'],
  ['.json', 'application/json; charset=utf-8'],
  ['.svg', 'image/svg+xml'],
  ['.txt', 'text/plain; charset=utf-8'],
  ['.woff', 'font/woff'],
  ['.woff2', 'font/woff2'],
]);

const smokeState = {
  counters: Object.create(null),
  interactionHeaders: Object.create(null),
  interactions: new Map(),
  interactionOrder: [],
  currentInteractionId: null,
  nextInteractionNumber: 1,
};

await assertFileExists(chromeExecutable, 'Chrome executable');
await runCommand(process.execPath, [path.join(workspaceRoot, 'scripts', 'build-web-sdk-widget.mjs')]);

const server = createSmokeServer(projectRoot, smokeState);

try {
  await listen(server, smokeServerPort);
  const smokeUrl = `http://${smokeServerHost}:${smokeServerPort}${smokeEntryUrlPath}`;
  const dumpedDom = await runChromeSmoke(smokeUrl, chromeExecutable);
  const resultSummary = summarizeResults(dumpedDom);

  if (resultSummary) {
    console.log(resultSummary);
  }

  if (!dumpedDom.includes('data-smoke-status="passed"')) {
    console.error('Smoke test DOM did not report success.');
    console.error(
      JSON.stringify(
        {
          counters: smokeState.counters,
          interactionOrder: smokeState.interactionOrder,
        },
        null,
        2,
      ),
    );
    console.error(dumpedDom);
    process.exitCode = 1;
  }
} finally {
  await closeServer(server);
}

if (process.exitCode && process.exitCode !== 0) {
  process.exit(process.exitCode);
}

console.log('CommerceHub Connect Web SDK browser smoke test passed.');

function createSmokeServer(rootDir, state) {
  return createServer(async (request, response) => {
    try {
      const requestUrl = new URL(request.url || '/', 'http://127.0.0.1');
      const normalizedPath = normalizeApiPath(requestUrl.pathname);

      if (requestUrl.pathname === '/__smoke__/state') {
        writeJson(response, 200, {
          counters: state.counters,
          interactionHeaders: state.interactionHeaders,
          interactions: state.interactionOrder,
          currentInteractionId: state.currentInteractionId,
        });
        return;
      }

      recordInteractionHeader(state, request, normalizedPath);

      if (normalizedPath === '/merchant/interaction/create' && request.method === 'POST') {
        incrementCounter(state, 'POST /merchant/interaction/create');
        const requestBody = await readJsonBody(request);
        const interaction = createInteractionRecord(state, requestBody);
        writeJson(response, 200, interaction.snapshot);
        return;
      }

      if (normalizedPath === '/interaction/otp/send' && request.method === 'POST') {
        incrementCounter(state, 'POST /interaction/otp/send');
        const interaction = requireCurrentInteraction(state);
        interaction.snapshot = {
          ...interaction.snapshot,
          status: 'OTP_VALIDATION_PENDING',
        };
        writeJson(response, 200, interaction.snapshot);
        return;
      }

      if (normalizedPath === '/interaction/otp/send/email' && request.method === 'POST') {
        incrementCounter(state, 'POST /interaction/otp/send/email');
        const interaction = requireCurrentInteraction(state);
        interaction.snapshot = {
          ...interaction.snapshot,
          status: 'OTP_VALIDATION_PENDING',
        };
        writeJson(response, 200, interaction.snapshot);
        return;
      }

      if (normalizedPath === '/interaction/otp/validate' && request.method === 'POST') {
        incrementCounter(state, 'POST /interaction/otp/validate');
        const interaction = requireCurrentInteraction(state);
        interaction.snapshot = buildPostOtpInteraction(interaction);
        writeJson(response, 200, interaction.snapshot);
        return;
      }

      if (normalizedPath === '/interaction' && request.method === 'GET') {
        incrementCounter(state, 'GET /interaction');
        const interaction = requireCurrentInteraction(state);
        writeJson(response, 200, interaction.snapshot);
        return;
      }

      if (
        normalizedPath.startsWith('/interaction/payment-source/') &&
        normalizedPath.endsWith('/attach') &&
        request.method === 'POST'
      ) {
        incrementCounter(state, `${request.method} ${normalizedPath}`);
        const interaction = requireCurrentInteraction(state);
        const paymentSourceId = normalizedPath
          .replace('/interaction/payment-source/', '')
          .replace('/attach', '')
          .split('/')[0];
        const source = findSource(interaction, paymentSourceId);

        interaction.snapshot = {
          ...interaction.snapshot,
          status: 'PAYMENT_SOURCE_ATTACHED',
          selectedSource: source,
          paymentSources: interaction.snapshot.paymentSources ?? [],
        };
        writeJson(response, 200, interaction.snapshot);
        return;
      }

      if (normalizedPath === '/customer' && request.method === 'GET') {
        incrementCounter(state, 'GET /customer');
        const interaction = requireCurrentInteraction(state);
        writeJson(response, 200, interaction.profile);
        return;
      }

      if (normalizedPath === '/customer/billing-address' && request.method === 'POST') {
        incrementCounter(state, 'POST /customer/billing-address');
        const interaction = requireCurrentInteraction(state);
        const requestBody = await readJsonBody(request);
        interaction.profile.billingAddress.push(requestBody);
        writeJson(response, 204, undefined);
        return;
      }

      if (normalizedPath === '/customer/source' && request.method === 'POST') {
        incrementCounter(state, 'POST /customer/source');
        const interaction = requireCurrentInteraction(state);
        const requestBody = await readJsonBody(request);
        interaction.createdCardCount += 1;
        const paymentSourceId = `card-created-${interaction.createdCardCount}`;
        const source = {
          ...requestBody,
          id: paymentSourceId,
        };
        interaction.profile.sources.unshift(source);
        interaction.snapshot = {
          ...interaction.snapshot,
          paymentSources: [source, ...(interaction.snapshot.paymentSources ?? [])],
        };
        writeJson(response, 200, { paymentSourceId });
        return;
      }

      if (
        normalizedPath.startsWith('/customer/mask/') &&
        request.method === 'POST'
      ) {
        incrementCounter(state, `${request.method} ${normalizedPath}`);
        const requestBody = await readJsonBody(request);
        writeJson(response, 200, {
          value: requestBody?.value ?? '',
        });
        return;
      }

      if (normalizedPath === '/pbb/session' && request.method === 'GET') {
        incrementCounter(state, 'GET /pbb/session');
        writeJson(response, 200, {
          aggregatorSessionId: 'agg-session-1',
          tokenID: 'access-token-1',
          pToken: 'p-token-1',
          publicKey: 'public-key-1',
        });
        return;
      }

      if (
        normalizedPath === '/pbb/session/agg-session-1/p-token-1' &&
        request.method === 'PUT'
      ) {
        incrementCounter(state, 'PUT /pbb/session/agg-session-1/p-token-1');
        const interaction = requireCurrentInteraction(state);
        const bankSource = {
          id: 'bank-created-1',
          name: 'Connected checking',
          tenderType: 'BANK_ACCOUNT',
          bankAccount: {
            bankName: 'Smoke National Bank',
            routingNumber: '110000000',
            accountNumber: '00001234',
            accountType: 'CHECKING',
          },
        };
        interaction.profile.sources.unshift(bankSource);
        interaction.snapshot = {
          ...interaction.snapshot,
          paymentSources: [bankSource, ...(interaction.snapshot.paymentSources ?? [])],
        };
        writeJson(response, 204, undefined);
        return;
      }

      if (
        normalizedPath.startsWith('/merchant/') ||
        normalizedPath.startsWith('/interaction/') ||
        normalizedPath.startsWith('/customer/') ||
        normalizedPath.startsWith('/pbb/')
      ) {
        incrementCounter(state, `${request.method || 'GET'} ${normalizedPath}`);
        writeJson(response, 404, {
          message: `No smoke stub is defined for ${request.method || 'GET'} ${normalizedPath}.`,
        });
        return;
      }

      await serveStaticFile(rootDir, requestUrl.pathname, response);
    } catch (error) {
      writeJson(response, 500, {
        message: error instanceof Error ? error.message : String(error),
      });
    }
  });
}

function createInteractionRecord(state, requestBody) {
  assertExpectedMerchantData(requestBody?.merchantData);

  const scenario = String(requestBody?.sessionReferenceId ?? 'default').trim() || 'default';
  const interactionId = `interaction-${state.nextInteractionNumber++}`;
  const allowedTenderTypes = requestBody?.allowedTenderTypes?.length
    ? requestBody.allowedTenderTypes
    : ['CARD'];
  const email = requestBody?.email || '';

  const baseSnapshot =
    scenario === 'saved-source'
      ? {
          interactionId,
          status: 'EMAIL_REQUESTED',
          email,
          paymentSources: [],
          allowedTenderTypes,
          allowEmailChange: true,
        }
      : {
          interactionId,
          status: 'PAYMENT_SOURCE_REQUESTED',
          email,
          paymentSources: [],
          allowedTenderTypes,
          allowEmailChange: true,
        };

  const record = {
    scenario,
    interactionId,
    snapshot: baseSnapshot,
    profile: {
      email,
      billingAddress: [],
      sources: [],
    },
    createdCardCount: 0,
  };

  state.interactions.set(interactionId, record);
  state.interactionOrder.push(interactionId);
  state.currentInteractionId = interactionId;
  return record;
}

function assertExpectedMerchantData(merchantData) {
  if (
    merchantData?.clientId === expectedMerchantData.clientId &&
    merchantData?.merchantId === expectedMerchantData.merchantId &&
    merchantData?.terminalId === expectedMerchantData.terminalId
  ) {
    return;
  }

  throw new Error(
    `Smoke create request missing expected merchantData: ${JSON.stringify(merchantData)}`,
  );
}

function buildPostOtpInteraction(interaction) {
  if (interaction.scenario === 'saved-source') {
    const source = {
      id: 'card-saved-1',
      name: 'Visa saved card',
      tenderType: 'CARD',
      card: {
        cardNumber: '4111111111111111',
        nameOnCard: 'Smoke Tester',
        expirationMonth: '12',
        expirationYear: '30',
        cvv: '***',
        network: 'Visa',
      },
    };
    interaction.profile.sources = [source];
    return {
      ...interaction.snapshot,
      status: 'PAYMENT_SOURCE_REQUESTED',
      paymentSources: [source],
      selectedSource: source,
    };
  }

  return {
    ...interaction.snapshot,
    status: 'PAYMENT_SOURCE_REQUESTED',
  };
}

function findSource(interaction, paymentSourceId) {
  return (
    interaction.profile.sources.find((source) => source.id === paymentSourceId) ||
    interaction.snapshot.paymentSources?.find((source) => source.id === paymentSourceId) || {
      id: paymentSourceId,
      name: 'Attached source',
      tenderType: 'CARD',
      card: {
        cardNumber: '4111111111111111',
        nameOnCard: 'Attached source',
        expirationMonth: '12',
        expirationYear: '30',
        cvv: '***',
        network: 'Visa',
      },
    }
  );
}

function requireCurrentInteraction(state) {
  const interaction = state.interactions.get(state.currentInteractionId);
  if (!interaction) {
    throw new Error('No active smoke interaction is available.');
  }

  return interaction;
}

function normalizeApiPath(pathname) {
  return pathname
    .replace(/^\/api(?=\/)/, '')
    .replace(/^\/commerce-hub-proxy\/[^/]+(?=\/)/, '');
}

async function serveStaticFile(rootDir, requestPathname, response) {
  const pathname = requestPathname === '/' ? smokeEntryUrlPath : requestPathname;
  const resolvedPath = path.resolve(rootDir, `.${decodeURIComponent(pathname)}`);

  if (!resolvedPath.startsWith(rootDir)) {
    writePlainText(response, 403, 'Forbidden');
    return;
  }

  let filePath = resolvedPath;
  let stat;

  try {
    stat = await fs.stat(filePath);
  } catch (error) {
    if (isEnoent(error)) {
      writePlainText(response, 404, 'Not found');
      return;
    }

    throw error;
  }

  if (stat.isDirectory()) {
    filePath = path.join(filePath, 'index.html');
  }

  const extension = path.extname(filePath).toLowerCase();
  const fileBuffer = await fs.readFile(filePath);

  response.writeHead(200, {
    'Cache-Control': 'no-store',
    'Content-Type': CONTENT_TYPES.get(extension) || 'application/octet-stream',
  });
  response.end(fileBuffer);
}

function listen(server, port) {
  return new Promise((resolve, reject) => {
    server.once('error', (error) => {
      if (error && typeof error === 'object' && 'code' in error && error.code === 'EADDRINUSE') {
        reject(
          new Error(
            `Unable to start the smoke server on http://${smokeServerHost}:${port} because that port is already in use.`,
          ),
        );
        return;
      }

      reject(error);
    });
    server.listen(port, smokeServerHost, () => {
      const address = server.address();

      if (!address || typeof address === 'string') {
        reject(new Error('Unable to determine smoke server address.'));
        return;
      }

      resolve(address.port);
    });
  });
}

function closeServer(server) {
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

async function runChromeSmoke(url, executablePath) {
  const args = [
    '--headless=new',
    '--disable-gpu',
    '--hide-scrollbars',
    '--mute-audio',
    '--no-first-run',
    '--no-default-browser-check',
    '--disable-background-networking',
    '--disable-default-apps',
    '--disable-sync',
    '--dump-dom',
    '--virtual-time-budget=25000',
    url,
  ];

  const { stdout } = await runCommand(executablePath, args, { pipeStdout: false });
  return stdout;
}

function summarizeResults(dom) {
  const matches = [...dom.matchAll(/<li data-result="(pass|fail)">([\s\S]*?)<\/li>/g)];

  if (!matches.length) {
    return '';
  }

  return matches
    .map(([, result, body]) => {
      const title = body
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
      return `${result.toUpperCase()}: ${title}`;
    })
    .join('\n');
}

function incrementCounter(state, key) {
  state.counters[key] = (state.counters[key] || 0) + 1;
}

function recordInteractionHeader(state, request, normalizedPath) {
  if (!normalizedPath.startsWith('/')) {
    return;
  }

  const requestKey = `${request.method || 'GET'} ${normalizedPath}`;
  if (
    requestKey !== 'GET /pbb/session' &&
    requestKey !== 'PUT /pbb/session/agg-session-1/p-token-1'
  ) {
    return;
  }

  state.interactionHeaders[requestKey] = request.headers['x-interaction-id'] ?? null;
}

function readJsonBody(request) {
  return new Promise((resolve, reject) => {
    const chunks = [];

    request.on('data', (chunk) => {
      chunks.push(chunk);
    });

    request.on('end', () => {
      const buffer = Buffer.concat(chunks);
      if (!buffer.length) {
        resolve({});
        return;
      }

      try {
        resolve(JSON.parse(buffer.toString('utf8')));
      } catch (error) {
        reject(error);
      }
    });

    request.on('error', reject);
  });
}

function writeJson(response, status, body) {
  response.writeHead(status, {
    'Cache-Control': 'no-store',
    'Content-Type': 'application/json; charset=utf-8',
  });
  response.end(body === undefined ? '' : JSON.stringify(body));
}

function writePlainText(response, status, body) {
  response.writeHead(status, {
    'Cache-Control': 'no-store',
    'Content-Type': 'text/plain; charset=utf-8',
  });
  response.end(body);
}

async function assertFileExists(filePath, label) {
  try {
    await fs.access(filePath);
  } catch {
    throw new Error(`${label} was not found at ${filePath}.`);
  }
}

function isEnoent(error) {
  return Boolean(error && typeof error === 'object' && 'code' in error && error.code === 'ENOENT');
}

function runCommand(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    let stdout = '';
    let stderr = '';
    const child = spawn(command, args, {
      cwd: workspaceRoot,
      stdio: options.pipeStdout === false ? ['ignore', 'pipe', 'inherit'] : ['ignore', 'pipe', 'pipe'],
    });

    child.stdout?.on('data', (chunk) => {
      stdout += chunk.toString();
      if (options.pipeStdout === false) {
        process.stdout.write(chunk);
      }
    });

    child.stderr?.on('data', (chunk) => {
      stderr += chunk.toString();
      if (options.pipeStdout !== false) {
        process.stderr.write(chunk);
      }
    });

    child.on('error', reject);
    child.on('exit', (code) => {
      if (code === 0) {
        resolve({ stdout, stderr });
        return;
      }

      reject(new Error(`${command} ${args.join(' ')} exited with code ${code ?? 'unknown'}.`));
    });
  });
}
