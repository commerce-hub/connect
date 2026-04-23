# commerce-hub-connect-web-sdk

Embeddable web widget built from the Angular `commerce-hub-connect-sdk` library.

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

Load the built script on any website:

```html
<script src="/path/to/CommerceHubConnectSDK.js"></script>
<div id="wallet-sdk"></div>
<script>
  window.CommerceHubConnectWebSdk.mount('#wallet-sdk', {
    apiBaseUrl: 'https://your-host.example.com/api',
    configuration: {
      sessionReferenceId: 'merchant-session-001',
      authType: 'FINAL_SALE',
      onSuccess(result) { console.log(result); },
      onError(error) { console.error(error); }
    }
  });
</script>
```

The packaged script includes the widget styles and font assets, so no extra CSS file is required.

## APIs

- `window.CommerceHubConnectWebSdk.mount(target, options)` mounts the Angular widget into any element.
- `window.CommerceHubConnectWebSdk.createElement(options)` creates a `commerce-hub-connect-widget` custom element.
- The custom element also supports property assignment for `configuration`, `whiteLabel`, and `apiBaseUrl`.

## Examples

- `example/index.html`: existing browser API-client harness
- `example/widget.html`: widget demo that mounts the packaged plain-JS widget
