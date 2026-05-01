import { spawn } from 'node:child_process';
import { createServer } from 'node:http';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const workspaceRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const distRoot = path.join(workspaceRoot, 'dist', 'commerce-hub-connect-angular-app');
const browserDistRoot = path.join(distRoot, 'browser');
const chromeExecutable =
  process.env.CHROME_BIN || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const serverHost = 'localhost';
const serverPort = 4175;
const fixtureUrl = `http://${serverHost}:${serverPort}/fixture.html`;

await assertFileExists(chromeExecutable, 'Chrome executable');
await runCommand('npm', ['run', 'build:angular-binding-example'], workspaceRoot);

const server = createStaticServer((await fileExists(browserDistRoot)) ? browserDistRoot : distRoot);

try {
  await listen(server, serverPort, serverHost);
  const dumpedDom = await runChromeSmoke(fixtureUrl, chromeExecutable);

  if (!dumpedDom.includes('data-angular-binding-status="passed"')) {
    console.error('Angular binding smoke test DOM did not report success.');
    console.error(dumpedDom);
    process.exitCode = 1;
  }
} finally {
  await closeServer(server);
}

if (process.exitCode && process.exitCode !== 0) {
  process.exit(process.exitCode);
}

console.log('Commerce Hub Angular binding smoke test passed.');

function createStaticServer(rootDir) {
  return createServer(async (request, response) => {
    try {
      const requestUrl = new URL(request.url || '/', 'http://127.0.0.1');
      const pathname = requestUrl.pathname === '/' ? '/index.html' : requestUrl.pathname;
      const filePath = path.resolve(rootDir, `.${decodeURIComponent(pathname)}`);

      if (!filePath.startsWith(rootDir)) {
        writePlainText(response, 403, 'Forbidden');
        return;
      }

      const stat = await fs.stat(filePath);
      if (!stat.isFile()) {
        writePlainText(response, 404, 'Not Found');
        return;
      }

      const body = await fs.readFile(filePath);
      response.writeHead(200, {
        'content-type': getContentType(filePath),
        'cache-control': 'no-store',
      });
      response.end(body);
    } catch (error) {
      if (isNotFound(error)) {
        writePlainText(response, 404, 'Not Found');
        return;
      }

      writePlainText(response, 500, error instanceof Error ? error.message : String(error));
    }
  });
}

function getContentType(filePath) {
  if (filePath.endsWith('.css')) {
    return 'text/css; charset=utf-8';
  }

  if (filePath.endsWith('.html')) {
    return 'text/html; charset=utf-8';
  }

  if (filePath.endsWith('.js')) {
    return 'text/javascript; charset=utf-8';
  }

  if (filePath.endsWith('.json')) {
    return 'application/json; charset=utf-8';
  }

  return 'text/plain; charset=utf-8';
}

function runCommand(command, args, cwd) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd,
      stdio: 'inherit',
    });

    child.on('error', reject);
    child.on('exit', (code) => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(new Error(`${command} ${args.join(' ')} exited with code ${code ?? 'unknown'}.`));
    });
  });
}

function listen(server, port, host) {
  return new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(port, host, resolve);
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

function runChromeSmoke(url, executable) {
  return new Promise((resolve, reject) => {
    const child = spawn(
      executable,
      [
        '--headless=new',
        '--disable-gpu',
        '--run-all-compositor-stages-before-draw',
        '--virtual-time-budget=7000',
        '--dump-dom',
        url,
      ],
      {
        stdio: ['ignore', 'pipe', 'pipe'],
      },
    );

    let stdout = '';
    let stderr = '';

    child.stdout.on('data', (chunk) => {
      stdout += chunk.toString();
    });
    child.stderr.on('data', (chunk) => {
      stderr += chunk.toString();
    });

    child.on('error', reject);
    child.on('exit', (code) => {
      if (code === 0) {
        resolve(stdout);
        return;
      }

      reject(
        new Error(
          stderr || `Chrome smoke run for ${url} exited with code ${code ?? 'unknown'}.`,
        ),
      );
    });
  });
}

async function assertFileExists(filePath, label) {
  if (!(await fileExists(filePath))) {
    throw new Error(`${label} not found at ${filePath}`);
  }
}

async function fileExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

function isNotFound(error) {
  return Boolean(error && typeof error === 'object' && 'code' in error && error.code === 'ENOENT');
}

function writePlainText(response, status, body) {
  response.writeHead(status, {
    'content-type': 'text/plain; charset=utf-8',
    'cache-control': 'no-store',
  });
  response.end(body);
}
