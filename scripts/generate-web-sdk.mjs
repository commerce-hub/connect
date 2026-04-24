import path from 'node:path';

import {
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
const projectName = normalizeProjectName(
  options.project ?? options.name,
  'commerce-hub-connect-web-sdk-client',
);
const targetDir = projectDir(projectName);
const sourceRoot = path.join(workspaceRoot, 'projects', 'commerce-hub-connect-sdk', 'src', 'lib');

const [apiModels, sdkModels, themeCss] = await Promise.all([
  readText(path.join(sourceRoot, 'models', 'api.models.ts')),
  readText(path.join(sourceRoot, 'models', 'sdk.models.ts')),
  readText(path.join(sourceRoot, 'theme', 'commerce-hub-sdk.css')),
]);

await prepareGeneratedProject(
  targetDir,
  {
    generator: 'generate-web-sdk',
    projectName,
    sourceProject: workspaceRelative(sourceRoot),
  },
  { force: options.force },
);

await Promise.all([
  writeText(path.join(targetDir, 'package.json'), `${JSON.stringify(buildPackageJson(projectName), null, 2)}\n`),
  writeText(path.join(targetDir, 'README.md'), buildReadme(projectName)),
  writeText(path.join(targetDir, 'dist', 'commerce-hub-connect-sdk.js'), buildBundle()),
  writeText(path.join(targetDir, 'dist', 'commerce-hub-connect-sdk.css'), `${themeCss}\n`),
  writeText(path.join(targetDir, 'dist', 'commerce-hub-connect-sdk.d.ts'), buildTypes(apiModels, sdkModels)),
  writeText(path.join(targetDir, 'example', 'index.html'), buildExampleHtml()),
]);

console.log(`Generated ${projectName} in ${workspaceRelative(targetDir)}`);

function buildPackageJson(name) {
  return {
    name,
    version: '0.0.1',
    private: true,
    main: './dist/commerce-hub-connect-sdk.js',
    types: './dist/commerce-hub-connect-sdk.d.ts',
    files: ['dist', 'example', 'README.md'],
  };
}

function buildReadme(name) {
  return `# ${name}

Generated pure JavaScript SDK client based on the Angular API service layer.

It exposes the same browser-side HTTP contract used by the Angular library:

- create interaction
- send and validate OTP
- manage payment sources
- fetch customer profile
- launch Pay by Bank session calls

Example usage is available in \`example/index.html\`.
`;
}

function buildBundle() {
  return `(function (globalScope) {
  'use strict';

  function createClient(options) {
    var baseUrl = (options && options.baseUrl ? options.baseUrl : '/api').replace(/\\/$/, '');

    async function request(path, init, responseMode) {
      var response = await fetch(baseUrl + path, Object.assign({ headers: { Accept: 'application/json' } }, init || {}));
      var contentType = response.headers.get('content-type') || '';
      var body = response.status === 204
        ? undefined
        : responseMode === 'text'
          ? await response.text()
          : contentType.includes('application/json')
            ? await response.json()
            : await response.text();

      if (!response.ok) {
        var message = typeof body === 'string' && body ? body : body && body.message ? body.message : response.statusText;
        var error = new Error(message || 'Request failed.');
        error.status = response.status;
        error.body = body;
        throw error;
      }

      return body;
    }

    return {
      createInteraction: function (payload) {
        return request('/merchant/interaction/create', { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(payload) });
      },
      getInteractionStatus: function () {
        return request('/interaction', { method: 'GET' });
      },
      sendInteractionOtp: function (payload) {
        return request('/interaction/otp/send', { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(payload) });
      },
      sendInteractionOtpToEmail: function (payload) {
        return request('/interaction/otp/send/email', { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(payload) });
      },
      validateInteractionOtp: function (payload) {
        return request('/interaction/otp/validate', { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(payload) });
      },
      attachPaymentSource: function (paymentSourceId) {
        return request('/interaction/payment-source/' + encodeURIComponent(paymentSourceId) + '/attach', { method: 'POST', headers: { Accept: 'application/json' }, body: '{}' });
      },
      addSource: function (payload) {
        return request('/customer/source', { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json', Accept: 'application/json, text/plain' }, body: JSON.stringify(payload) }, 'text');
      },
      updateSource: function (payload) {
        return request('/customer/source', { method: 'PUT', credentials: 'include', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(payload) });
      },
      deleteSource: function (sourceId) {
        return request('/customer/source/' + encodeURIComponent(sourceId), { method: 'DELETE', credentials: 'include' });
      },
      getCustomerProfile: function () {
        return request('/customer', { method: 'GET', credentials: 'include' });
      },
      mask: function (type, payload) {
        return request('/customer/mask/' + encodeURIComponent(type), { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(payload) });
      },
      createPayByBankSession: function () {
        return request('/pbb/session', { method: 'GET', credentials: 'include' });
      },
      finalizePayByBankSession: function (aldSessionId, pToken) {
        return request('/pbb/session/' + encodeURIComponent(aldSessionId) + '/' + encodeURIComponent(pToken), { method: 'PUT', credentials: 'include' });
      }
    };
  }

  var api = {
    version: '0.0.1',
    createClient: createClient,
  };

  globalScope.CommerceHubConnectWebSdk = api;
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  }
})(typeof window !== 'undefined' ? window : globalThis);
`;
}

function buildTypes(apiModelsSource, sdkModelsSource) {
  const mergedModels = `${apiModelsSource}\n${sdkModelsSource.replace(/import\s*\{[\s\S]*?\}\s*from '\.\/api\.models';\n/, '')}`;

  return `${mergedModels}

export interface CommerceHubConnectWebSdkClientOptions {
  baseUrl?: string;
}

export interface CommerceHubConnectWebSdkClient {
  createInteraction(payload: InteractionRequest): Promise<InteractionResponse>;
  getInteractionStatus(): Promise<InteractionResponse>;
  sendInteractionOtp(payload: StringHolder): Promise<InteractionResponse>;
  sendInteractionOtpToEmail(payload: StringHolder): Promise<InteractionResponse>;
  validateInteractionOtp(payload: OtpValidateRequest): Promise<InteractionResponse>;
  attachPaymentSource(paymentSourceId: string): Promise<InteractionResponse>;
  addSource(payload: PaymentSource): Promise<string | unknown>;
  updateSource(payload: PaymentSource): Promise<void>;
  deleteSource(sourceId: string): Promise<void>;
  getCustomerProfile(): Promise<Profile>;
  mask(type: CustomerMaskType, payload: StringHolder): Promise<StringHolder>;
  createPayByBankSession(): Promise<PayByBankSessionResponse>;
  finalizePayByBankSession(aldSessionId: string, pToken: string): Promise<void>;
}

export interface CommerceHubConnectWebSdkNamespace {
  version: string;
  createClient(options?: CommerceHubConnectWebSdkClientOptions): CommerceHubConnectWebSdkClient;
}

declare const CommerceHubConnectWebSdk: CommerceHubConnectWebSdkNamespace;

declare global {
  interface Window {
    CommerceHubConnectWebSdk: CommerceHubConnectWebSdkNamespace;
  }
}

export = CommerceHubConnectWebSdk;
export as namespace CommerceHubConnectWebSdk;
`;
}

function buildExampleHtml() {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Commerce Hub Web SDK</title>
  </head>
  <body>
    <pre id="output">Loading...</pre>
    <script src="../dist/commerce-hub-connect-sdk.js"></script>
    <script>
      const client = window.CommerceHubConnectWebSdk.createClient({ baseUrl: '/api' });
      document.getElementById('output').textContent = JSON.stringify(Object.keys(client), null, 2);
    </script>
  </body>
</html>
`;
}
