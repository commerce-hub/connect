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
  requests: {
    createInteraction: [],
  },
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
    console.error(JSON.stringify(smokeState, null, 2));
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
        writeJson(response, 200, state);
        return;
      }

      if (normalizedPath === '/merchant/interaction/create' && request.method === 'POST') {
        incrementCounter(state, 'POST /merchant/interaction/create');
        const requestBody = await readJsonBody(request);

        state.requests.createInteraction.push(requestBody);

        writeJson(response, 200, {
          interactionId: `interaction-${state.requests.createInteraction.length}`,
          status: 'EMAIL_REQUESTED',
          email: requestBody?.email || '',
          allowedTenderTypes: requestBody?.allowedTenderTypes || ['CARD'],
          paymentSources: [],
          allowEmailChange: requestBody?.allowEmailChange ?? false,
        });
        return;
      }

      if (normalizedPath === '/interaction/otp/send' && request.method === 'POST') {
        incrementCounter(state, 'POST /interaction/otp/send');
        writeJson(response, 200, {
          interactionId: `interaction-${state.requests.createInteraction.length || 1}`,
          status: 'OTP_VALIDATION_PENDING',
          allowedTenderTypes: state.requests.createInteraction.at(-1)?.allowedTenderTypes || ['CARD'],
          paymentSources: [],
          allowEmailChange: state.requests.createInteraction.at(-1)?.allowEmailChange ?? false,
        });
        return;
      }

      if (normalizedPath === '/interaction/otp/send/email' && request.method === 'POST') {
        incrementCounter(state, 'POST /interaction/otp/send/email');
        writeJson(response, 200, {
          interactionId: `interaction-${state.requests.createInteraction.length || 1}`,
          status: 'OTP_VALIDATION_PENDING',
          allowedTenderTypes: state.requests.createInteraction.at(-1)?.allowedTenderTypes || ['CARD'],
          paymentSources: [],
          allowEmailChange: state.requests.createInteraction.at(-1)?.allowEmailChange ?? false,
        });
        return;
      }

      if (normalizedPath.startsWith('/merchant/') || normalizedPath.startsWith('/interaction/')) {
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
    '--virtual-time-budget=20000',
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

function readJsonBody(request) {
  return new Promise((resolve, reject) => {
    const chunks = [];

    request.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
    request.on('end', () => {
      const text = Buffer.concat(chunks).toString('utf8').trim();

      if (!text) {
        resolve({});
        return;
      }

      try {
        resolve(JSON.parse(text));
      } catch (error) {
        reject(error);
      }
    });
    request.on('error', reject);
  });
}

function writeJson(response, statusCode, body) {
  response.writeHead(statusCode, {
    'Cache-Control': 'no-store',
    'Content-Type': 'application/json; charset=utf-8',
  });
  response.end(JSON.stringify(body));
}

function writePlainText(response, statusCode, body) {
  response.writeHead(statusCode, {
    'Cache-Control': 'no-store',
    'Content-Type': 'text/plain; charset=utf-8',
  });
  response.end(body);
}

async function assertFileExists(filePath, label) {
  try {
    await fs.access(filePath);
  } catch {
    throw new Error(`${label} was not found at ${filePath}`);
  }
}

function runCommand(command, args, options = {}) {
  const { pipeStdout = true, pipeStderr = true } = options;

  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: workspaceRoot,
      stdio: ['ignore', 'pipe', 'pipe'],
    });

    let stdout = '';
    let stderr = '';

    child.stdout.on('data', (chunk) => {
      const text = chunk.toString();
      stdout += text;
      if (pipeStdout) {
        process.stdout.write(text);
      }
    });

    child.stderr.on('data', (chunk) => {
      const text = chunk.toString();
      stderr += text;
      if (pipeStderr) {
        process.stderr.write(text);
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

function isEnoent(error) {
  return Boolean(error && typeof error === 'object' && 'code' in error && error.code === 'ENOENT');
}
