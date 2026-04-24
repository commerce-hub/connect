# commerce-hub-connect-web-sdk

Embeddable web widget built from the Angular `commerce-hub-connect-sdk` library and exposed as a browser custom element with Angular Elements.

## Build

From the workspace root:

```bash
npm run build:web-sdk-widget
```

This command rebuilds the Angular widget and packages it into a plain browser bundle:

- `projects/commerce-hub-connect-web-sdk/dist/CommerceHubConnectSDK.js`
- `projects/commerce-hub-connect-web-sdk/dist/CommerceHubConnectSDK.d.ts`

If you need the raw Angular application output for debugging, run:

```bash
npm run build:web-sdk-widget:angular
```

## Website Usage

Load the built script on any website and use the custom element directly:

```html
<script src="/path/to/CommerceHubConnectSDK.js"></script>
<commerce-hub-connect-widget id="wallet-sdk"></commerce-hub-connect-widget>
<script>
  const widget = document.getElementById('wallet-sdk');

  widget.addEventListener('commerce-hub-success', (event) => {
    console.log('success', event.detail);
  });

  widget.addEventListener('commerce-hub-error', (event) => {
    console.error('error', event.detail);
  });

  widget.apiBaseUrl = 'https://your-host.example.com/api';
  widget.configuration = {
    sessionReferenceId: 'merchant-session-001',
    authType: 'FINAL_SALE',
    email: 'merchant@example.com'
  };
</script>
```

The packaged script includes the widget styles and font assets, so no extra CSS file is required.

For local development:

- use `/api` only when the widget is served through this workspace's Angular dev server on `http://localhost:4500`
- use `http://localhost:8080` when opening the demo page from a static file server such as JetBrains `localhost:63342`

## APIs

- `commerce-hub-connect-widget` is the primary integration surface for any website.
- `configuration`, `whiteLabel`, and `apiBaseUrl` can be assigned as element properties from plain JavaScript.
- `configurationJson` and `whiteLabelJson` are available for declarative HTML/JSON usage.
- `commerce-hub-success` and `commerce-hub-error` are emitted as DOM `CustomEvent`s.
- `window.CommerceHubConnectWebSdk.define()`, `createElement()`, and `mount()` are convenience helpers around the custom element.

## Examples

- `example/index.html`: existing browser API-client harness
- `example/widget.html`: custom-element demo for the packaged web SDK
