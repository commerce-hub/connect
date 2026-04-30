# commerce-hub-connect-react-binding

Thin React binding over `commerce-hub-connect-web-sdk`.

## What ships

- `CommerceHubConnectReactBinding` — a React wrapper that delegates mount/update/unmount to the framework-agnostic web SDK
- `src/example-app.tsx` — a local example host mirroring the web SDK create/mount/update/destroy flow
- `src/fixture-app.tsx` + `fixture.html` — a smoke-test fixture that verifies the wrapper lifecycle in a browser

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
node ../../scripts/run-react-binding-smoke-test.mjs
```
