# commerce-hub-connect-web-sdk

Framework-agnostic Commerce Hub inline widget built in pure TypeScript.

## What ships

The bundle exposes `window.CommerceHubConnectWebSdk` and can mount a host-managed inline widget into any DOM container without Angular, Prime, or PrimeNG runtime dependencies.

## Build

From the workspace root:

```bash
npm run build:web-sdk-widget
```

This writes:

- `projects/commerce-hub-connect-web-sdk/dist/CommerceHubConnectSDK.js`
- `projects/commerce-hub-connect-web-sdk/dist/CommerceHubConnectSDK.d.ts`

## Basic usage

```html
<div id="payment-container"></div>
<script src="./CommerceHubConnectSDK.js"></script>
<script>
  const interaction = await fetch('/merchant/interaction/create', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      sessionReferenceId: 'session-1',
      authType: 'FINAL_SALE',
      allowedTenderTypes: ['CARD', 'BANK_ACCOUNT'],
      wallet: true,
    }),
  }).then((response) => response.json());

  await window.CommerceHubConnectWebSdk.mount('#payment-container', {
    interaction,
    configuration: {
      onSuccess(result) {
        console.log('success', result);
      },
      onError(error) {
        console.error('error', error);
      },
      wallet: true,
      whiteLabel: {
        primaryColor: '#0a5dff',
      },
    },
  }, 'qa');
</script>
```

## Browser example

Run the local example host:

```bash
npm run build:web-sdk-widget
npm run start:web-sdk-example
```

Open `http://localhost:8080/`.

When served from that local server the SDK resolves Commerce Hub requests to `/commerce-hub-proxy/<environment>` for same-origin local testing.
