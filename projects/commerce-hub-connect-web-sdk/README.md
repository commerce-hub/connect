# commerce-hub-connect-web-sdk

Embeddable web widget bundle built on top of `commerce-hub-connect-sdk`.

The widget no longer creates interactions internally. Host applications are expected to call
`interaction/create` themselves and pass the returned `InteractionResponse` into
`window.CommerceHubConnectWebSdk.mount(..., { interaction, configuration, ... })`.

## Build

From the workspace root:

```bash
npm run build:web-sdk-widget
```

This writes:

- `projects/commerce-hub-connect-web-sdk/dist/CommerceHubConnectSDK.js`
- `projects/commerce-hub-connect-web-sdk/dist/CommerceHubConnectSDK.d.ts`

## Example Sandbox

After building the bundle, use `projects/commerce-hub-connect-web-sdk/example/index.html` as a
standalone sandbox. It loads `../dist/CommerceHubConnectSDK.js` directly and exposes the real
`window.CommerceHubConnectWebSdk.mount(target, options, environment?)` lifecycle through mount,
update, destroy, reset, and copy-config controls.

Run the standalone sandbox through the local Node service when you need a same-origin proxy for
Commerce Hub:

```bash
npm run build:web-sdk-widget
npm run start:web-sdk-example
```

Open `http://localhost:8080/`. When the page is served from that local server it automatically
resolves the selected environment to `/commerce-hub-proxy/<environment>` so `interaction/create`
and the SDK's follow-up API calls go through the Node proxy instead of hitting the Commerce Hub
origin directly.

This example is intentionally richer than the minimal integration snippet in the main web SDK
documentation.
