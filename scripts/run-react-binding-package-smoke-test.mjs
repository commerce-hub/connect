import { spawn } from 'node:child_process';
import { createServer } from 'node:http';
import { promises as fs } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const workspaceRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const reactProjectRoot = path.join(workspaceRoot, 'projects', 'commerce-hub-connect-react-app');
const webSdkDistRoot = path.join(workspaceRoot, 'projects', 'commerce-hub-connect-web-sdk', 'dist');
const chromeExecutable =
  process.env.CHROME_BIN || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const serverHost = 'localhost';
const serverPort = 4175;
const tempRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'commerce-hub-react-package-smoke-'));

await assertFileExists(chromeExecutable, 'Chrome executable');
await runCommand('npm', ['run', 'build:web-sdk-widget'], workspaceRoot);
await runCommand('npm', ['pack', '--pack-destination', tempRoot], webSdkDistRoot);
await runCommand('npm', ['pack', '--pack-destination', tempRoot], reactProjectRoot);

const webSdkTarballPath = await resolveLatestTarballPath(tempRoot, 'commerce-hub-connect-web-sdk-');
const reactBindingTarballPath = await resolveLatestTarballPath(
  tempRoot,
  'commerce-hub-connect-react-binding-',
);
const appRoot = path.join(tempRoot, 'app');
const distRoot = path.join(appRoot, 'dist');
const indexUrl = `http://${serverHost}:${serverPort}/`;

await fs.mkdir(path.join(appRoot, 'src'), { recursive: true });
await fs.writeFile(
  path.join(appRoot, 'package.json'),
  buildPackageJson(webSdkTarballPath, reactBindingTarballPath),
);
await fs.writeFile(path.join(appRoot, 'tsconfig.json'), buildTsconfig());
await fs.writeFile(path.join(appRoot, 'vite.config.ts'), buildViteConfig());
await fs.writeFile(path.join(appRoot, 'index.html'), buildIndexHtml());
await fs.writeFile(path.join(appRoot, 'src', 'main.tsx'), buildMainTsx());

await runCommand('npm', ['install', '--no-audit', '--no-fund'], appRoot);
await runCommand('npm', ['run', 'build'], appRoot);

const server = createStaticServer(distRoot);

try {
  await listen(server, serverPort, serverHost);
  const dumpedDom = await runChromeSmoke(indexUrl, chromeExecutable);

  if (!dumpedDom.includes('data-package-binding-status="passed"')) {
    console.error('Packaged React binding smoke test DOM did not report success.');
    console.error(dumpedDom);
    process.exitCode = 1;
  }
} finally {
  await closeServer(server);
  await fs.rm(tempRoot, { recursive: true, force: true });
}

if (process.exitCode && process.exitCode !== 0) {
  process.exit(process.exitCode);
}

console.log('Commerce Hub packaged React binding smoke test passed.');

function buildPackageJson(webSdkTarballPath, reactBindingTarballPath) {
  return `${JSON.stringify(
    {
      name: 'commerce-hub-connect-react-package-smoke',
      private: true,
      type: 'module',
      scripts: {
        build: 'vite build',
      },
      dependencies: {
        'commerce-hub-connect-react-binding': `file:${reactBindingTarballPath}`,
        'commerce-hub-connect-web-sdk': `file:${webSdkTarballPath}`,
        react: '^19.2.0',
        'react-dom': '^19.2.0',
      },
      devDependencies: {
        '@vitejs/plugin-react': '^5.0.4',
        typescript: '^5.9.3',
        vite: '^7.3.2',
      },
    },
    null,
    2,
  )}\n`;
}

function buildTsconfig() {
  return `${JSON.stringify(
    {
      compilerOptions: {
        target: 'ES2020',
        module: 'ESNext',
        jsx: 'react-jsx',
        moduleResolution: 'Bundler',
        strict: true,
        skipLibCheck: true,
      },
    },
    null,
    2,
  )}\n`;
}

function buildViteConfig() {
  return `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
});
`;
}

function buildIndexHtml() {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Commerce Hub packaged React binding smoke</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
`;
}

function buildMainTsx() {
  return `import { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { CommerceHubConnectReactBinding } from 'commerce-hub-connect-react-binding';

const interaction = {
  interactionId: 'interaction-1',
  status: 'EMAIL_REQUESTED',
  allowedTenderTypes: ['CARD'],
  allowEmailChange: true,
} as const;

function App() {
  const [status, setStatus] = useState<'running' | 'passed' | 'failed'>('running');
  const [message, setMessage] = useState('Mounting packaged React binding...');

  useEffect(() => {
    let cancelled = false;
    const startedAt = Date.now();

    const poll = () => {
      if (cancelled || status === 'failed') {
        return;
      }

      const host = document.querySelector('[data-commerce-hub-connect-react-binding="true"]');
      const mountedWidget = host?.querySelector('.commerce-hub-connect-web-sdk-mount');

      if (mountedWidget) {
        setStatus('passed');
        setMessage('Packaged React binding mounted successfully.');
        return;
      }

      if (Date.now() - startedAt >= 5000) {
        setStatus('failed');
        setMessage('Timed out waiting for the packaged React binding to mount.');
        return;
      }

      window.setTimeout(poll, 50);
    };

    poll();

    return () => {
      cancelled = true;
    };
  }, [status]);

  useEffect(() => {
    const handleWindowError = (event: ErrorEvent) => {
      setStatus('failed');
      setMessage(event.message || 'Window error while mounting packaged React binding.');
    };

    window.addEventListener('error', handleWindowError);
    return () => {
      window.removeEventListener('error', handleWindowError);
    };
  }, []);

  return (
    <main>
      <div id="package-binding-status" data-package-binding-status={status}>
        {message}
      </div>
      <CommerceHubConnectReactBinding
        interaction={interaction}
        configuration={{
          onSuccess: () => undefined,
          onError: (error) => {
            setStatus('failed');
            setMessage(error.message);
          },
        }}
        whiteLabel={{
          primaryColor: '#0a5dff',
        }}
        environment="qa"
      />
    </main>
  );
}

createRoot(document.getElementById('root')!).render(<App />);
`;
}

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

async function resolveLatestTarballPath(directoryPath, filenamePrefix) {
  const entries = await fs.readdir(directoryPath);
  const tarballNames = entries
    .filter((entry) => entry.startsWith(filenamePrefix) && entry.endsWith('.tgz'))
    .sort();

  const latestTarballName = tarballNames.at(-1);
  if (!latestTarballName) {
    throw new Error(`Unable to find a tarball starting with ${filenamePrefix} in ${directoryPath}.`);
  }

  return path.join(directoryPath, latestTarballName);
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
  try {
    await fs.access(filePath);
  } catch {
    throw new Error(`${label} not found at ${filePath}`);
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
