# Commerce Hub React SDK handoff

This handoff includes two local npm package tarballs:

1. `commerce-hub-connect-web-sdk-0.0.1.tgz`
2. `commerce-hub-connect-react-binding-0.0.1.tgz`

The React package depends on the web SDK, so please install **both** tarballs.

## Requirements

- `react >= 18`
- `react-dom >= 18`

## Install

From the app root, place both tarballs in a local folder and run:

```bash
npm install ./commerce-hub-connect-web-sdk-0.0.1.tgz ./commerce-hub-connect-react-binding-0.0.1.tgz
```

If dependency resolution is picky, install them one at a time:

```bash
npm install ./commerce-hub-connect-web-sdk-0.0.1.tgz
npm install ./commerce-hub-connect-react-binding-0.0.1.tgz
```

For React consumers, that is the full setup. You do **not** need to add a script tag for
`CommerceHubConnectSDK.js` or manually initialize `window.CommerceHubConnectWebSdk`.

## Usage

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

## Notes

- Supported environments: `dev`, `qa`, `cat`, `prod`
- The React package re-exports shared SDK types from the web SDK
- If install order matters in your package manager, install the web SDK tarball first
- The web SDK tarball now provides the module API the React binding imports internally; the browser-global bundle remains available for non-React script-tag integrations
