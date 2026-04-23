import path from 'node:path';

import {
  copyIfExists,
  normalizeProjectName,
  parseArgs,
  prepareGeneratedProject,
  projectDir,
  readText,
  workspaceRoot,
  workspaceRelative,
  writeText,
} from './generator-utils.mjs';

const options = parseArgs(process.argv.slice(2));
const projectName = normalizeProjectName(options.project ?? options.name, 'commerce-hub-connect-react-app');
const targetDir = projectDir(projectName);
const sdkProjectName = normalizeProjectName(options.sdkProject, 'commerce-hub-connect-web-sdk');
const sdkProjectDir = projectDir(sdkProjectName);
const sourceRoot = path.join(workspaceRoot, 'projects', 'commerce-hub-connect-sdk', 'src', 'lib');

const [apiModels, sdkModels] = await Promise.all([
  readText(path.join(sourceRoot, 'models', 'api.models.ts')),
  readText(path.join(sourceRoot, 'models', 'sdk.models.ts')),
]);

await prepareGeneratedProject(
  targetDir,
  {
    generator: 'generate-react-ts-app',
    projectName,
    sourceProject: workspaceRelative(sourceRoot),
    sdkProjectName,
  },
  { force: options.force },
);

const bundledSdk = await copyIfExists(
  path.join(sdkProjectDir, 'dist', 'commerce-hub-connect-sdk.js'),
  path.join(targetDir, 'public', 'sdk', 'commerce-hub-connect-sdk.js'),
);

await copyIfExists(
  path.join(sdkProjectDir, 'dist', 'commerce-hub-connect-sdk.css'),
  path.join(targetDir, 'public', 'sdk', 'commerce-hub-connect-sdk.css'),
);

if (!bundledSdk) {
  await writeText(path.join(targetDir, 'public', 'sdk', 'commerce-hub-connect-sdk.js'), placeholderSdkBundle());
}

await Promise.all([
  writeText(path.join(targetDir, 'package.json'), `${JSON.stringify(buildPackageJson(projectName), null, 2)}\n`),
  writeText(path.join(targetDir, 'tsconfig.json'), buildTsConfig()),
  writeText(path.join(targetDir, 'vite.config.ts'), buildViteConfig()),
  writeText(path.join(targetDir, 'index.html'), buildIndexHtml()),
  writeText(path.join(targetDir, 'README.md'), buildReadme(projectName, sdkProjectName, bundledSdk)),
  writeText(path.join(targetDir, 'src', 'main.tsx'), buildMainTsx()),
  writeText(path.join(targetDir, 'src', 'styles.css'), buildStyles()),
  writeText(path.join(targetDir, 'src', 'App.tsx'), buildAppTsx()),
  writeText(path.join(targetDir, 'src', 'sdk-loader.ts'), buildSdkLoader()),
  writeText(path.join(targetDir, 'src', 'generated', 'api-models.ts'), apiModels),
  writeText(
    path.join(targetDir, 'src', 'generated', 'sdk-models.ts'),
    sdkModels.replace('./api.models', './api-models'),
  ),
]);

console.log(`Generated ${projectName} in ${workspaceRelative(targetDir)}`);

function buildPackageJson(name) {
  return {
    name,
    private: true,
    version: '0.0.1',
    type: 'module',
    scripts: {
      dev: 'vite',
      build: 'vite build',
      preview: 'vite preview',
    },
    dependencies: {
      react: 'latest',
      'react-dom': 'latest',
    },
    devDependencies: {
      '@types/react': 'latest',
      '@types/react-dom': 'latest',
      '@vitejs/plugin-react': 'latest',
      typescript: 'latest',
      vite: 'latest',
    },
  };
}

function buildTsConfig() {
  return `{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "Bundler",
    "allowImportingTsExtensions": false,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true
  },
  "include": ["src", "vite.config.ts"]
}
`;
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
    <title>Commerce Hub React SDK Starter</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
`;
}

function buildReadme(name, sdkName, bundled) {
  return `# ${name}

Generated React + TypeScript starter app based on the Angular Commerce Hub wallet contract.

- It copies the Angular API and SDK model types into \`src/generated/\`.
- It loads the browser SDK bundle from \`public/sdk/commerce-hub-connect-sdk.js\`.
- It provides a small typed demo UI for the interaction / OTP flow.

Bundled browser SDK: ${bundled ? `copied from ${sdkName}` : `placeholder only; run the web SDK generator first and regenerate this app`}.
`;
}

function buildMainTsx() {
  return `import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './App';
import './styles.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
`;
}

function buildStyles() {
  return `:root {
  color: #0f172a;
  font-family: "Avenir Next", "Segoe UI", sans-serif;
  background: radial-gradient(circle at top left, #dbeafe, #f8fafc 42%, #eef2ff 100%);
}

body {
  margin: 0;
  min-height: 100vh;
}

#root {
  padding: 32px;
}

.app-shell {
  display: grid;
  gap: 24px;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
}

.app-panel {
  background: rgba(255, 255, 255, 0.92);
  border: 1px solid rgba(15, 23, 42, 0.08);
  border-radius: 24px;
  box-shadow: 0 24px 60px rgba(15, 23, 42, 0.12);
  padding: 24px;
}

.app-form,
.app-grid {
  display: grid;
  gap: 14px;
}

.app-grid {
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
}

.app-field {
  display: grid;
  gap: 6px;
}

.app-field input {
  border: 1px solid rgba(15, 23, 42, 0.12);
  border-radius: 14px;
  font: inherit;
  padding: 12px 14px;
}

.app-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.app-actions button {
  background: #0a5dff;
  border: 0;
  border-radius: 999px;
  color: #fff;
  cursor: pointer;
  font: inherit;
  padding: 12px 18px;
}

.app-json {
  background: #0f172a;
  border-radius: 18px;
  color: #e2e8f0;
  min-height: 240px;
  overflow: auto;
  padding: 18px;
  white-space: pre-wrap;
}
`;
}

function buildSdkLoader() {
  return `export interface CommerceHubConnectWebSdkClient {
  createInteraction(payload: unknown): Promise<unknown>;
  getInteractionStatus(): Promise<unknown>;
  sendInteractionOtp(payload: unknown): Promise<unknown>;
  sendInteractionOtpToEmail(payload: unknown): Promise<unknown>;
  validateInteractionOtp(payload: unknown): Promise<unknown>;
  getCustomerProfile(): Promise<unknown>;
}

interface CommerceHubConnectWebSdkNamespace {
  createClient(options?: { baseUrl?: string }): CommerceHubConnectWebSdkClient;
}

declare global {
  interface Window {
    CommerceHubConnectWebSdk?: CommerceHubConnectWebSdkNamespace;
  }
}

export async function loadBrowserSdk(): Promise<CommerceHubConnectWebSdkNamespace> {
  if (window.CommerceHubConnectWebSdk) {
    return window.CommerceHubConnectWebSdk;
  }

  await new Promise<void>((resolve, reject) => {
    const script = document.createElement('script');
    script.src = '/sdk/commerce-hub-connect-sdk.js';
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Unable to load /sdk/commerce-hub-connect-sdk.js'));
    document.head.appendChild(script);
  });

  if (!window.CommerceHubConnectWebSdk) {
    throw new Error('The browser SDK did not register window.CommerceHubConnectWebSdk.');
  }

  return window.CommerceHubConnectWebSdk;
}
`;
}

function buildAppTsx() {
  return `import { useEffect, useState } from 'react';

import type { InteractionRequest, OtpValidateRequest } from './generated/api-models';
import type { CommerceHubAuthType } from './generated/api-models';
import { loadBrowserSdk } from './sdk-loader';
import type { CommerceHubConnectWebSdkClient } from './sdk-loader';

const initialRequest: InteractionRequest = {
  sessionReferenceId: 'react-demo-session',
  email: 'merchant@example.com',
  authType: 'FINAL_SALE',
};

export default function App() {
  const [request, setRequest] = useState<InteractionRequest>(initialRequest);
  const [otp, setOtp] = useState('123456');
  const [client, setClient] = useState<CommerceHubConnectWebSdkClient | null>(null);
  const [response, setResponse] = useState('SDK not loaded yet.');

  useEffect(() => {
    loadBrowserSdk()
      .then((sdk) => setClient(sdk.createClient({ baseUrl: '/api' })))
      .catch((error) => setResponse(String(error)));
  }, []);

  async function run(label: string, work: () => Promise<unknown>) {
    try {
      const result = await work();
      setResponse(label + '\\n\\n' + JSON.stringify(result, null, 2));
    } catch (error) {
      setResponse(label + '\\n\\n' + String(error));
    }
  }

  const otpPayload: OtpValidateRequest = {
    email: request.email ?? '',
    otp,
    channel: 'EMAIL',
  };

  return (
    <main className="app-shell">
      <section className="app-panel">
        <p>React TS starter generated from the Angular wallet contract.</p>
        <div className="app-form">
          <div className="app-grid">
            <label className="app-field">
              <span>Session Reference ID</span>
              <input value={request.sessionReferenceId} onChange={(event) => setRequest((current) => ({ ...current, sessionReferenceId: event.target.value }))} />
            </label>
            <label className="app-field">
              <span>Email</span>
              <input value={request.email ?? ''} onChange={(event) => setRequest((current) => ({ ...current, email: event.target.value }))} />
            </label>
            <label className="app-field">
              <span>Auth Type</span>
              <input value={request.authType as CommerceHubAuthType} onChange={(event) => setRequest((current) => ({ ...current, authType: event.target.value as CommerceHubAuthType }))} />
            </label>
            <label className="app-field">
              <span>OTP</span>
              <input value={otp} onChange={(event) => setOtp(event.target.value)} />
            </label>
          </div>
          <div className="app-actions">
            <button type="button" onClick={() => client && run('createInteraction', () => client.createInteraction(request))}>Create interaction</button>
            <button type="button" onClick={() => client && run('getInteractionStatus', () => client.getInteractionStatus())}>Get interaction</button>
            <button type="button" onClick={() => client && run('sendInteractionOtp', () => client.sendInteractionOtp({ value: request.email ?? '' }))}>Send OTP</button>
            <button type="button" onClick={() => client && run('sendInteractionOtpToEmail', () => client.sendInteractionOtpToEmail({ value: request.email ?? '' }))}>Send OTP To Email</button>
            <button type="button" onClick={() => client && run('validateInteractionOtp', () => client.validateInteractionOtp(otpPayload))}>Validate OTP</button>
            <button type="button" onClick={() => client && run('getCustomerProfile', () => client.getCustomerProfile())}>Get customer profile</button>
          </div>
        </div>
      </section>

      <section className="app-panel">
        <pre className="app-json">{response}</pre>
      </section>
    </main>
  );
}
`;
}

function placeholderSdkBundle() {
  return `(function (globalScope) {
  globalScope.CommerceHubConnectWebSdk = {
    createClient: function () {
      throw new Error('Browser SDK bundle not found. Generate the web SDK project first.');
    }
  };
})(typeof window !== 'undefined' ? window : globalThis);
`;
}
