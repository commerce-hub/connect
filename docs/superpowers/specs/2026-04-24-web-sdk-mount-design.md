# CommerceHub Connect Web SDK Mount Design

## Summary

Build a new `projects/commerce-hub-connect-web-sdk` application from scratch that wraps the existing Angular library in `projects/commerce-hub-connect-sdk` and exposes a browser API based on `window.CommerceHubConnectWebSdk.mount(target, options, environment?)`.

The web SDK will be the only place that owns browser embedding concerns such as mount target resolution, stylesheet injection, custom-element registration, and environment-to-base-URL resolution. The Angular library remains the source of UI, models, services, and shared environment typing/helpers.

## Goals

- Ship a framework-agnostic browser bundle that mounts `CommerceHubConnectCaptureComponent` into any DOM container.
- Use `window.CommerceHubConnectWebSdk.mount(...)` as the source-of-truth public API.
- Replace `apiBaseUrl` with an optional trailing `environment` parameter.
- Support `dev`, `qa`, `cat`, and `prod`, with `prod` as the default.
- Keep all four environments mapped to the same API URL for now.
- Keep Angular-library changes minimal and aligned with the new wrapper.
- Update the existing Angular demo only where needed to stay compatible with the shared environment model.

## Non-Goals

- No `init().onSuccess().onError().mount().launch()` API.
- No iframe-based isolation layer.
- No reuse, restore, or migration of any code under `projects/ORIG-commerce-hub-connect-web-sdk`.
- No environment-specific endpoints yet.

## Current Constraints

- The Angular library already contains the payment capture UI, services, models, theme, and base-URL DI token.
- The workspace already has an Angular build target and a bundling script for `projects/commerce-hub-connect-web-sdk`, but the project itself must be recreated cleanly.
- The SDK must continue to work for direct Angular consumers and for the new browser bundle.

## Public API

The browser bundle will expose:

```ts
type CommerceHubConnectEnvironment = 'dev' | 'qa' | 'cat' | 'prod';

interface CommerceHubConnectWebSdkMountOptions {
  configuration: CommerceHubSdkConfiguration;
  whiteLabel?: CommerceHubWhiteLabelOptions;
  replaceContents?: boolean;
}

interface CommerceHubConnectWebSdkInstance {
  readonly containerElement: Element;
  readonly hostElement: HTMLElement;
  update(
    options: CommerceHubConnectWebSdkMountOptions,
    environment?: CommerceHubConnectEnvironment,
  ): void;
  destroy(): void;
}

interface CommerceHubConnectWebSdkNamespace {
  readonly version: string;
  readonly tagName: string;
  mount(
    target: string | Element,
    options: CommerceHubConnectWebSdkMountOptions,
    environment?: CommerceHubConnectEnvironment,
  ): Promise<CommerceHubConnectWebSdkInstance>;
  createElement(
    options?: Omit<CommerceHubConnectWebSdkMountOptions, 'replaceContents'>,
    environment?: CommerceHubConnectEnvironment,
  ): CommerceHubConnectWidgetElement;
}
```

The custom element will support property assignment for:

- `configuration`
- `whiteLabel`
- `environment`

`environment` replaces `apiBaseUrl` everywhere in the web SDK contract.

## Environment Resolution

The shared environment type will be defined as:

```ts
type CommerceHubConnectEnvironment = 'dev' | 'qa' | 'cat' | 'prod';
```

`prod` is the default when the caller omits the parameter.

The initial environment map will contain all four keys, but every key will resolve to the same runtime-derived API URL:

```ts
const runtimeOrigin = resolveRuntimeOrigin();
const baseUrl = new URL('/api', runtimeOrigin).href;

{
  dev: baseUrl,
  qa: baseUrl,
  cat: baseUrl,
  prod: baseUrl,
}
```

Resolution rules:

1. If the web SDK bundle can determine its own script URL, use that origin.
2. Otherwise, fall back to `window.location.origin`.
3. Resolve `/api` from that origin.

This keeps all environments aligned today while leaving a single map ready for future divergence without changing the public API.

## Architecture

### Angular library

`projects/commerce-hub-connect-sdk` remains the single source of truth for:

- `CommerceHubConnectCaptureComponent`
- SDK service and API service
- shared models
- theme helpers
- environment type and environment-to-base-URL helper

The library will not become aware of browser mounting or DOM host lifecycle. It will only expose the types and helper utilities needed by both Angular and web consumers.

### Web SDK application

`projects/commerce-hub-connect-web-sdk` will be a thin Angular application with:

- `src/main.ts` to register the SDK on load
- `src/web-sdk.ts` for the browser-facing wrapper
- `src/index.html` and `src/styles.css` as minimal Angular build entry files
- `web-sdk.d.ts` for distributable browser typings

The wrapper will:

- lazily create one Angular application instance with `createApplication()`
- inject `COMMERCE_HUB_CONNECT_API_BASE_URL` with the resolved environment URL
- dynamically create `CommerceHubConnectCaptureComponent`
- inject bundled styles once
- register `<commerce-hub-connect-widget>`
- expose `window.CommerceHubConnectWebSdk`

## Angular Library Changes

The library changes will stay narrow and support the new wrapper cleanly:

1. Keep `CommerceHubSdkConfiguration` as the shared configuration contract.
2. Preserve `whiteLabel` inside `configuration` as a valid input source.
3. Keep white-label merge order as:
   - library defaults
   - `configuration.whiteLabel`
   - standalone `whiteLabel` input from the wrapper
4. Keep `mount` as a valid `CommerceHubErrorStage` so browser-wrapper validation and mount failures can be reported consistently.
5. Add and export shared environment typing and a base-URL resolution helper from the library so both the web SDK and the Angular demo can consume the same logic.

The base URL DI token will continue to drive the API service. The web SDK will set it explicitly through DI. Direct Angular library consumers can continue to use the token or default behavior as they do now.

## Angular Demo Application Changes

The existing Angular demo application will only change where it helps validate or consume the shared environment model:

- add environment selection only if it materially improves local verification of the shared resolver
- otherwise keep the demo using the existing `/api` development proxy path
- if a shared environment helper is introduced in the library, wire the demo through that helper instead of duplicating the map

The demo is not the source of truth for the browser API, so it should not be reworked into the same `mount(...)` integration style.

## Build And Packaging

The existing `scripts/build-web-sdk-widget.mjs` flow remains the packaging path:

1. build the Angular web SDK application
2. inline stylesheet assets
3. emit a single IIFE bundle
4. copy `web-sdk.d.ts` into the distributable output

Expected outputs:

- `projects/commerce-hub-connect-web-sdk/dist/CommerceHubConnectSDK.js`
- `projects/commerce-hub-connect-web-sdk/dist/CommerceHubConnectSDK.d.ts`

## Validation And Error Handling

The wrapper will validate before mount:

- `target` resolves to an element
- `options` exists
- `options.configuration` exists
- `configuration.sessionReferenceId` is non-empty
- `configuration.onSuccess` is a function
- `configuration.onError` is a function
- `configuration.authType` is one of `FINAL_SALE` or `AUTH_ONLY`
- `environment`, when supplied, is one of `dev`, `qa`, `cat`, or `prod`

Failures during these checks or mount lifecycle should surface as `mount`-stage errors where appropriate.

`update()` will accept new options and an optional new environment. Because the environment currently resolves to the same URL for every value, changing it will not require a remount. If environment-specific URLs diverge later, the wrapper may tighten that behavior without changing the initial API shape.

## Testing And Verification

Implementation will follow TDD for the new behavior:

1. Add failing tests for environment resolution and defaulting to `prod`.
2. Add failing tests for mount option validation.
3. Add failing tests for the new web SDK typings and wrapper behavior where practical.
4. Implement the minimal code to satisfy those tests.
5. Run targeted verification:
   - web SDK build
   - Angular library build
   - relevant tests
   - Angular demo build if touched

## Documentation Updates

Update the root README, library README, and `docs/Web-SDK-Integration.md` so they all describe:

- `window.CommerceHubConnectWebSdk.mount(target, options, environment?)`
- `dev | qa | cat | prod`
- `prod` as the default
- no `apiBaseUrl`
- no `init(...)`
- no iframe claim

## Risks And Mitigations

- Browser bundling can drift from Angular library exports.
  Mitigation: keep the wrapper thin and import only from the library public API.

- Environment handling can become duplicated between the library, demo, and web wrapper.
  Mitigation: centralize environment typing and base-URL resolution in the library.

- README and integration doc drift can confuse consumers.
  Mitigation: update docs in the same change as the implementation.
