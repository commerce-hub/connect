# commerce-hub-connect-react-binding

Thin React binding over `commerce-hub-connect-web-sdk`.

## What ships in the package

- `dist/index.js` — the distributable React binding entry
- `dist/index.d.ts` — package typings
- `CommerceHubConnectReactBinding` — a React wrapper that delegates mount/update/unmount to the framework-agnostic web SDK

The example host and smoke-test fixture stay in the repo for local verification, but they are not
included when you pack or publish the library.

## Run the React example

From the workspace root:

```bash
npm run start:react-binding-example
```

Or from this directory:

```bash
npm run dev -- --host 127.0.0.1 --port 4173
```

The Vite dev server proxies localhost Commerce Hub traffic through `/commerce-hub-proxy/<environment>` so the binding example can create live interactions just like the plain web SDK host.

## Build

```bash
npm run build
```

This builds the distributable library into `dist/`.

To package it for handoff or publishing:

```bash
npm pack
```

To build the local example + fixture bundle used by the smoke test:

```bash
npm run build:example
```

## Basic usage

```tsx
import {
  CommerceHubConnectReactBinding,
  type CommerceHubSdkConfiguration,
  type InteractionResponse,
} from 'commerce-hub-connect-react-binding';

const interaction: InteractionResponse = {
  interactionId: 'interaction-1',
  status: 'EMAIL_REQUESTED',
  allowedTenderTypes: ['CARD'],
};

const configuration: CommerceHubSdkConfiguration = {
  onSuccess: (result) => console.log('success', result),
  onError: (error) => console.error('error', error),
};

export function Checkout() {
  return (
    <CommerceHubConnectReactBinding
      interaction={interaction}
      configuration={configuration}
      environment="qa"
    />
  );
}
```

The binding re-exports the shared web SDK types so React hosts can stay aligned with plain browser and Angular integrations.

## Verification

```bash
npm run typecheck
npm run build
npm run build:example
node ../../scripts/run-react-binding-smoke-test.mjs
```
