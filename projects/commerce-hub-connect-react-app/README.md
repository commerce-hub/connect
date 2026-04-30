# commerce-hub-connect-react-binding

Thin React binding over `commerce-hub-connect-web-sdk`.

## What ships

- `CommerceHubConnectReactBinding` — a React wrapper that delegates mount/update/unmount to the framework-agnostic web SDK
- a small internal Vite fixture app used only to verify the wrapper lifecycle in a browser

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
