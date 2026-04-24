# Web SDK Mount Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a new browser bundle at `projects/commerce-hub-connect-web-sdk` that exposes `window.CommerceHubConnectWebSdk.mount(target, options, environment?)`, while aligning the Angular SDK library and demo app with shared `dev | qa | cat | prod` environment handling.

**Architecture:** Keep the Angular library as the single source of UI, models, services, theme, and shared environment helpers. Build a thin Angular application wrapper for the web SDK that mounts `CommerceHubConnectCaptureComponent`, resolves an environment to the injected API base URL, and exposes a browser namespace plus custom element. Test the shared environment logic and web-SDK validation helpers first, then wire the wrapper and docs around those verified primitives.

**Tech Stack:** Angular 20 standalone APIs, Angular Elements-style dynamic mounting with `createApplication`, Jasmine/Karma via Angular CLI, TypeScript, esbuild packaging script.

---

## File Map

- Modify: `projects/commerce-hub-connect-sdk/src/lib/models/sdk.models.ts`
- Create: `projects/commerce-hub-connect-sdk/src/lib/services/commerce-hub-connect-environment.ts`
- Create: `projects/commerce-hub-connect-sdk/src/lib/services/commerce-hub-connect-environment.spec.ts`
- Modify: `projects/commerce-hub-connect-sdk/src/public-api.ts`
- Modify: `projects/commerce-hub-connect-sdk/src/lib/services/commerce-hub-connect-api-base-url.token.ts`
- Modify: `src/app/app.config.ts`
- Create: `projects/commerce-hub-connect-web-sdk/package.json`
- Create: `projects/commerce-hub-connect-web-sdk/README.md`
- Create: `projects/commerce-hub-connect-web-sdk/src/index.html`
- Create: `projects/commerce-hub-connect-web-sdk/src/styles.css`
- Create: `projects/commerce-hub-connect-web-sdk/src/main.ts`
- Create: `projects/commerce-hub-connect-web-sdk/src/web-sdk-types.ts`
- Create: `projects/commerce-hub-connect-web-sdk/src/web-sdk-utils.ts`
- Create: `projects/commerce-hub-connect-web-sdk/src/web-sdk-utils.spec.ts`
- Create: `projects/commerce-hub-connect-web-sdk/src/web-sdk.ts`
- Create: `projects/commerce-hub-connect-web-sdk/tsconfig.app.json`
- Create: `projects/commerce-hub-connect-web-sdk/tsconfig.spec.json`
- Create: `projects/commerce-hub-connect-web-sdk/web-sdk.d.ts`
- Modify: `angular.json`
- Modify: `README.md`
- Modify: `projects/commerce-hub-connect-sdk/README.md`
- Modify: `docs/Web-SDK-Integration.md`

### Task 1: Add Shared Environment Helpers To The Angular Library

**Files:**
- Create: `projects/commerce-hub-connect-sdk/src/lib/services/commerce-hub-connect-environment.spec.ts`
- Create: `projects/commerce-hub-connect-sdk/src/lib/services/commerce-hub-connect-environment.ts`
- Modify: `projects/commerce-hub-connect-sdk/src/public-api.ts`
- Modify: `projects/commerce-hub-connect-sdk/src/lib/services/commerce-hub-connect-api-base-url.token.ts`

- [ ] **Step 1: Write the failing environment-helper tests**

```ts
import {
  COMMERCE_HUB_CONNECT_ENVIRONMENTS,
  normalizeCommerceHubConnectEnvironment,
  resolveCommerceHubConnectApiBaseUrl,
  isCommerceHubConnectEnvironment,
} from './commerce-hub-connect-environment';

describe('commerce hub connect environment helpers', () => {
  it('defaults missing environment values to prod', () => {
    expect(normalizeCommerceHubConnectEnvironment()).toBe('prod');
  });

  it('recognizes supported environments', () => {
    expect(COMMERCE_HUB_CONNECT_ENVIRONMENTS).toEqual(['dev', 'qa', 'cat', 'prod']);
    expect(isCommerceHubConnectEnvironment('qa')).toBeTrue();
    expect(isCommerceHubConnectEnvironment('staging')).toBeFalse();
  });

  it('resolves every environment to the same runtime origin api url', () => {
    expect(resolveCommerceHubConnectApiBaseUrl('dev', 'https://merchant.example')).toBe(
      'https://merchant.example/api',
    );
    expect(resolveCommerceHubConnectApiBaseUrl('qa', 'https://merchant.example')).toBe(
      'https://merchant.example/api',
    );
    expect(resolveCommerceHubConnectApiBaseUrl('cat', 'https://merchant.example')).toBe(
      'https://merchant.example/api',
    );
    expect(resolveCommerceHubConnectApiBaseUrl('prod', 'https://merchant.example')).toBe(
      'https://merchant.example/api',
    );
  });

  it('falls back to /api when no runtime origin is available', () => {
    expect(resolveCommerceHubConnectApiBaseUrl('prod')).toBe('/api');
  });
});
```

- [ ] **Step 2: Run the library test to verify it fails**

Run: `npx ng test commerce-hub-connect-sdk --watch=false --include='projects/commerce-hub-connect-sdk/src/lib/services/commerce-hub-connect-environment.spec.ts'`
Expected: FAIL because `commerce-hub-connect-environment.ts` does not exist yet.

- [ ] **Step 3: Implement the shared environment helper and exports**

```ts
export const COMMERCE_HUB_CONNECT_ENVIRONMENTS = ['dev', 'qa', 'cat', 'prod'] as const;

export type CommerceHubConnectEnvironment =
  (typeof COMMERCE_HUB_CONNECT_ENVIRONMENTS)[number];

export function isCommerceHubConnectEnvironment(
  value: unknown,
): value is CommerceHubConnectEnvironment {
  return (
    typeof value === 'string' &&
    COMMERCE_HUB_CONNECT_ENVIRONMENTS.includes(value as CommerceHubConnectEnvironment)
  );
}

export function normalizeCommerceHubConnectEnvironment(
  value?: CommerceHubConnectEnvironment | null,
): CommerceHubConnectEnvironment {
  return value ?? 'prod';
}

export function resolveCommerceHubConnectApiBaseUrl(
  environment?: CommerceHubConnectEnvironment,
  runtimeOrigin?: string,
): string {
  normalizeCommerceHubConnectEnvironment(environment);

  if (!runtimeOrigin?.trim()) {
    return '/api';
  }

  return new URL('/api', runtimeOrigin).href.replace(/\/$/, '');
}
```

`projects/commerce-hub-connect-sdk/src/lib/services/commerce-hub-connect-api-base-url.token.ts` should keep the existing token shape and use the shared helper in its default factory:

```ts
factory: () => () => resolveCommerceHubConnectApiBaseUrl('prod'),
```

`projects/commerce-hub-connect-sdk/src/public-api.ts` should export the new helper file.

- [ ] **Step 4: Run the library test to verify it passes**

Run: `npx ng test commerce-hub-connect-sdk --watch=false --include='projects/commerce-hub-connect-sdk/src/lib/services/commerce-hub-connect-environment.spec.ts'`
Expected: PASS with all four expectations green.

### Task 2: Add Web SDK Types And Validation Helpers First

**Files:**
- Create: `projects/commerce-hub-connect-web-sdk/src/web-sdk-types.ts`
- Create: `projects/commerce-hub-connect-web-sdk/src/web-sdk-utils.spec.ts`
- Create: `projects/commerce-hub-connect-web-sdk/src/web-sdk-utils.ts`
- Create: `projects/commerce-hub-connect-web-sdk/tsconfig.spec.json`
- Modify: `angular.json`

- [ ] **Step 1: Write the failing web-sdk helper tests**

```ts
import {
  resolveMountTarget,
  resolveSdkRuntimeOrigin,
  validateMountRequest,
} from './web-sdk-utils';

describe('web sdk utils', () => {
  it('prefers the script url origin over window location', () => {
    const documentStub = {
      currentScript: { src: 'https://cdn.example/sdk/CommerceHubConnectSDK.js' },
      location: { origin: 'https://merchant.example' },
    } as Document;

    expect(resolveSdkRuntimeOrigin(documentStub)).toBe('https://cdn.example');
  });

  it('falls back to window location origin when no script tag is available', () => {
    const documentStub = {
      currentScript: null,
      location: { origin: 'https://merchant.example' },
    } as Document;

    expect(resolveSdkRuntimeOrigin(documentStub)).toBe('https://merchant.example');
  });

  it('throws for invalid mount options', () => {
    expect(() =>
      validateMountRequest(
        {
          configuration: {
            sessionReferenceId: '',
            authType: 'FINAL_SALE',
            onSuccess: () => undefined,
            onError: () => undefined,
          },
        } as never,
        'qa',
      ),
    ).toThrowError('configuration.sessionReferenceId is required.');
  });

  it('throws for unsupported environments', () => {
    expect(() =>
      validateMountRequest(
        {
          configuration: {
            sessionReferenceId: 'session-1',
            authType: 'FINAL_SALE',
            onSuccess: () => undefined,
            onError: () => undefined,
          },
        },
        'uat' as never,
      ),
    ).toThrowError('environment must be one of dev, qa, cat, or prod.');
  });

  it('resolves selector targets from the document', () => {
    const element = document.createElement('div');
    element.id = 'mount-root';
    document.body.appendChild(element);

    expect(resolveMountTarget('#mount-root')).toBe(element);
  });
});
```

- [ ] **Step 2: Run the web-sdk test to verify it fails**

Run: `npx ng test commerce-hub-connect-web-sdk-widget --watch=false --include='projects/commerce-hub-connect-web-sdk/src/web-sdk-utils.spec.ts'`
Expected: FAIL because the test target and helper files do not exist yet.

- [ ] **Step 3: Add the web-sdk test target and implement minimal helper code**

`angular.json` should gain a `test` target under `commerce-hub-connect-web-sdk-widget` using `@angular/build:karma` and `projects/commerce-hub-connect-web-sdk/tsconfig.spec.json`.

`projects/commerce-hub-connect-web-sdk/src/web-sdk-types.ts` should define:

```ts
export interface CommerceHubConnectWebSdkMountOptions {
  configuration: CommerceHubSdkConfiguration;
  whiteLabel?: CommerceHubWhiteLabelOptions;
  replaceContents?: boolean;
}
```

`projects/commerce-hub-connect-web-sdk/src/web-sdk-utils.ts` should implement:

```ts
export function resolveSdkRuntimeOrigin(doc: Document = document): string | undefined
export function resolveMountTarget(target: string | Element, doc: Document = document): Element
export function validateMountRequest(
  options: CommerceHubConnectWebSdkMountOptions,
  environment?: CommerceHubConnectEnvironment,
): void
```

Validation should reject:

- missing `options`
- missing `configuration`
- empty `sessionReferenceId`
- non-function `onSuccess`
- non-function `onError`
- auth types other than `FINAL_SALE` or `AUTH_ONLY`
- environments outside `dev | qa | cat | prod`

- [ ] **Step 4: Run the web-sdk helper test to verify it passes**

Run: `npx ng test commerce-hub-connect-web-sdk-widget --watch=false --include='projects/commerce-hub-connect-web-sdk/src/web-sdk-utils.spec.ts'`
Expected: PASS with the validation and origin-resolution cases green.

### Task 3: Build The New Web SDK Wrapper And Bundle Surface

**Files:**
- Create: `projects/commerce-hub-connect-web-sdk/package.json`
- Create: `projects/commerce-hub-connect-web-sdk/README.md`
- Create: `projects/commerce-hub-connect-web-sdk/src/index.html`
- Create: `projects/commerce-hub-connect-web-sdk/src/styles.css`
- Create: `projects/commerce-hub-connect-web-sdk/src/main.ts`
- Create: `projects/commerce-hub-connect-web-sdk/src/web-sdk.ts`
- Create: `projects/commerce-hub-connect-web-sdk/tsconfig.app.json`
- Create: `projects/commerce-hub-connect-web-sdk/web-sdk.d.ts`

- [ ] **Step 1: Write the failing wrapper integration test**

Create a narrow test around registration behavior in `projects/commerce-hub-connect-web-sdk/src/web-sdk-utils.spec.ts`:

```ts
it('defaults the environment parameter to prod during validation', () => {
  expect(() =>
    validateMountRequest({
      configuration: {
        sessionReferenceId: 'session-1',
        authType: 'FINAL_SALE',
        onSuccess: () => undefined,
        onError: () => undefined,
      },
    }),
  ).not.toThrow();
});
```

- [ ] **Step 2: Run the web-sdk helper test to verify the new case fails if defaulting is missing**

Run: `npx ng test commerce-hub-connect-web-sdk-widget --watch=false --include='projects/commerce-hub-connect-web-sdk/src/web-sdk-utils.spec.ts'`
Expected: FAIL if `validateMountRequest()` does not yet accept an omitted environment.

- [ ] **Step 3: Implement the wrapper, registration, and browser typings**

`projects/commerce-hub-connect-web-sdk/src/web-sdk.ts` should:

```ts
export async function registerCommerceHubConnectWebSdk(): Promise<CommerceHubConnectWebSdkNamespace>
export async function mount(
  target: string | Element,
  options: CommerceHubConnectWebSdkMountOptions,
  environment?: CommerceHubConnectEnvironment,
): Promise<CommerceHubConnectWebSdkInstance>
```

Implementation requirements:

- create one Angular application lazily with `createApplication()`
- provide `HttpClient`, animations, zone change detection, browser error listeners, and `provideCommerceHubSdkTheme()`
- resolve `runtimeOrigin` from the current script or document location
- convert `environment` into a base URL using `resolveCommerceHubConnectApiBaseUrl()`
- inject `COMMERCE_HUB_CONNECT_API_BASE_URL` with that resolved URL when mounting the capture component
- insert the host element into the target container
- set the component `configuration` and `whiteLabel` inputs
- inject styles once using `globalThis.__commerceHubConnectWebSdkInlineCss` when present
- expose `window.CommerceHubConnectWebSdk`
- register `commerce-hub-connect-widget`
- let the custom element use `configuration`, `whiteLabel`, and `environment` properties

`projects/commerce-hub-connect-web-sdk/src/main.ts` should be:

```ts
import 'zone.js';

import { registerCommerceHubConnectWebSdk } from './web-sdk';

void registerCommerceHubConnectWebSdk();
```

`projects/commerce-hub-connect-web-sdk/web-sdk.d.ts` should describe the same public browser API and expose the custom element type.

- [ ] **Step 4: Run the web-sdk helper test to verify it passes**

Run: `npx ng test commerce-hub-connect-web-sdk-widget --watch=false --include='projects/commerce-hub-connect-web-sdk/src/web-sdk-utils.spec.ts'`
Expected: PASS with the default-environment case green.

- [ ] **Step 5: Build the browser bundle**

Run: `npm run build:web-sdk-widget`
Expected: Angular build succeeds and writes:

- `projects/commerce-hub-connect-web-sdk/dist/CommerceHubConnectSDK.js`
- `projects/commerce-hub-connect-web-sdk/dist/CommerceHubConnectSDK.d.ts`

### Task 4: Align The Angular Demo And Documentation

**Files:**
- Modify: `projects/commerce-hub-connect-sdk/src/lib/models/sdk.models.ts`
- Modify: `src/app/app.config.ts`
- Modify: `README.md`
- Modify: `projects/commerce-hub-connect-sdk/README.md`
- Modify: `docs/Web-SDK-Integration.md`

- [ ] **Step 1: Write the failing library test for sdk model compatibility**

Extend `projects/commerce-hub-connect-sdk/src/lib/services/commerce-hub-connect-environment.spec.ts` with:

```ts
it('keeps mount as a valid sdk error stage', () => {
  const stage: CommerceHubErrorStage = 'mount';
  expect(stage).toBe('mount');
});
```

- [ ] **Step 2: Run the library test to verify it fails if the shared model drifted**

Run: `npx ng test commerce-hub-connect-sdk --watch=false --include='projects/commerce-hub-connect-sdk/src/lib/services/commerce-hub-connect-environment.spec.ts'`
Expected: FAIL only if `mount` is not available in the exported error-stage union.

- [ ] **Step 3: Implement the remaining compatibility and docs changes**

Apply the following:

- keep `mount` in `CommerceHubErrorStage`
- keep `configuration.whiteLabel` supported in `CommerceHubSdkConfiguration`
- update `src/app/app.config.ts` to provide `COMMERCE_HUB_CONNECT_API_BASE_URL` using the shared helper so the demo stays aligned with the new environment resolution approach without changing its local `/api` behavior
- rewrite README examples to use `window.CommerceHubConnectWebSdk.mount('#wallet-sdk', { ... }, 'prod')`
- remove doc references to `apiBaseUrl`, `init(...)`, and iframe isolation

The app provider shape should look like:

```ts
{
  provide: COMMERCE_HUB_CONNECT_API_BASE_URL,
  useValue: () => resolveCommerceHubConnectApiBaseUrl('dev', window.location.origin),
}
```

- [ ] **Step 4: Run focused verification**

Run:

```bash
npx ng test commerce-hub-connect-sdk --watch=false --include='projects/commerce-hub-connect-sdk/src/lib/services/commerce-hub-connect-environment.spec.ts'
npx ng test commerce-hub-connect-web-sdk-widget --watch=false --include='projects/commerce-hub-connect-web-sdk/src/web-sdk-utils.spec.ts'
npx ng build commerce-hub-connect-sdk
npx ng build commercehub-connect-wallet-sdk
```

Expected:

- both focused test commands PASS
- library build PASS
- demo app build PASS

- [ ] **Step 5: Run final full packaging verification**

Run: `npm run build:web-sdk-widget`
Expected: PASS with regenerated browser bundle and type definition output.
