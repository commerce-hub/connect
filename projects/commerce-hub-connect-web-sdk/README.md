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

This example is intentionally richer than the minimal integration snippet in the main web SDK
documentation.
