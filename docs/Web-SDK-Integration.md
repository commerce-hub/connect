# CommerceHub Connect Web SDK Integration

## Overview

The CommerceHub Connect Web SDK packages the Angular `CommerceHubConnectCaptureComponent` into a browser bundle that can be mounted from any HTML page, React app, or other framework.

The bundle file is:

- `CommerceHubConnectSDK.js`

The browser namespace is:

- `window.CommerceHubConnectWebSdk`

## Build

From the workspace root:

```bash
npm run build:web-sdk-widget
```

This writes:

- `projects/commerce-hub-connect-web-sdk/dist/CommerceHubConnectSDK.js`
- `projects/commerce-hub-connect-web-sdk/dist/CommerceHubConnectSDK.d.ts`

The final JavaScript bundle inlines the SDK stylesheet, including any font assets referenced by that stylesheet.

## Public API

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
  version: string;
  tagName: string;
  mount(
    target: string | Element,
    options: CommerceHubConnectWebSdkMountOptions,
    environment?: CommerceHubConnectEnvironment,
  ): Promise<CommerceHubConnectWebSdkInstance>;
  createElement(
    options?: CommerceHubConnectWebSdkElementOptions,
    environment?: CommerceHubConnectEnvironment,
  ): CommerceHubConnectWidgetElement;
}
```

`environment` is the last parameter and defaults to `prod`.

## Environment Resolution

Supported environments:

- `dev`
- `qa`
- `cat`
- `prod`

Current behavior:

- all four environments resolve to the same explicit API base URL for now
- the current shared value is `http://localhost:8080`
- the resolved API URL is derived from the selected environment, not from the host page origin
- this keeps the bundle self-contained when it is loaded from static hosts such as IDE preview
  servers

## Sandbox Example

For a richer standalone integration harness, use:

- `projects/commerce-hub-connect-web-sdk/example/index.html`

That page loads `../dist/CommerceHubConnectSDK.js` directly, exposes the real
`window.CommerceHubConnectWebSdk.mount(target, options, environment?)` flow, and includes controls
for mount, update, destroy, reset, callback logging, and copying a ready-to-paste snippet.

## HTML Integration

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>CommerceHub Connect SDK</title>
  </head>
  <body>
    <div id="payment-container"></div>

    <script src="https://merchant.example/sdk/CommerceHubConnectSDK.js"></script>
    <script>
      let sdkInstance;

      async function mountSdk() {
        sdkInstance = await window.CommerceHubConnectWebSdk.mount(
          '#payment-container',
          {
            configuration: {
              sessionReferenceId: 'merchant-session-001',
              merchantId: '100014000315473',
              terminalId: '10000001',
              clientId: 'laika',
              authType: 'FINAL_SALE',
              email: 'merchant@example.com',
              wallet: true,
              onSuccess(result) {
                console.log('Payment source linked:', result);
              },
              onError(error) {
                console.error('SDK error:', error);
              },
            },
            whiteLabel: {
              primaryColor: '#0a5dff',
              secondaryColor: '#627d98',
              textColor: '#101828',
              fontFamily: '"Open Sans", sans-serif',
            },
          },
          'prod',
        );
      }

      mountSdk().catch((error) => console.error('SDK mount failed', error));
    </script>
  </body>
</html>
```

## Custom Element Integration

```html
<commerce-hub-connect-widget id="wallet-sdk"></commerce-hub-connect-widget>

<script>
  const widget = document.getElementById('wallet-sdk');

  widget.configuration = {
    sessionReferenceId: 'merchant-session-001',
    merchantId: '100014000315473',
    terminalId: '10000001',
    clientId: 'laika',
    authType: 'FINAL_SALE',
    email: 'merchant@example.com',
    onSuccess(result) {
      console.log(result);
    },
    onError(error) {
      console.error(error);
    },
  };

  widget.whiteLabel = {
    primaryColor: '#0a5dff',
    secondaryColor: '#627d98',
  };

  widget.environment = 'qa';
</script>
```

## Configuration Reference

### `CommerceHubSdkConfiguration`

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `sessionReferenceId` | `string` | Yes | Unique session identifier from the backend |
| `merchantId` | `string` | No | Merchant identifier forwarded to `merchant/interaction/create` |
| `terminalId` | `string` | No | Terminal identifier forwarded to `merchant/interaction/create` |
| `clientId` | `string` | No | Client identifier forwarded to `merchant/interaction/create` |
| `authType` | `"FINAL_SALE" \| "AUTH_ONLY"` | Yes | Payment authorization mode |
| `onSuccess` | `(result) => void` | Yes | Success callback |
| `onError` | `(error) => void` | Yes | Error callback |
| `email` | `string` | No | Pre-filled customer email |
| `paymentSelectionTitle` | `string` | No | Override payment-selection heading |
| `paymentSelectionConfirmLabel` | `string` | No | Override payment-selection CTA label |
| `region` | `string` | No | Region code |
| `language` | `string` | No | Language code |
| `merchantTransactionId` | `string` | No | Merchant transaction reference |
| `merchantOrderId` | `string` | No | Merchant order reference |
| `merchantInvoiceNumber` | `string` | No | Merchant invoice reference |
| `expiryMinutes` | `number` | No | Session expiry window |
| `allowedTenderTypes` | `("CARD" \| "BANK_ACCOUNT")[]` | No | Allowed tender types |
| `allowEmailChange` | `boolean` | No | Allow the user to change email |
| `wallet` | `boolean` | No | Enable wallet flow |
| `whiteLabel` | `CommerceHubWhiteLabelOptions` | No | Inline white-label defaults |
| `payByBank` | `CommerceHubPayByBankOptions` | No | Pay By Bank configuration |

### `CommerceHubWhiteLabelOptions`

| Property | Type | Default |
|----------|------|---------|
| `primaryColor` | `string` | `#0a5dff` |
| `secondaryColor` | `string` | `#627d98` |
| `textColor` | `string` | `#101828` |
| `fontFamily` | `string` | `"Open Sans", "Segoe UI", sans-serif` |
| `logoUrl` | `string` | none |

White-label precedence is:

1. library defaults
2. `configuration.whiteLabel`
3. top-level `whiteLabel` passed into `mount()` or `createElement()`

## Success And Error Payloads

### `CommerceHubSuccessResult`

```ts
{
  interaction: InteractionResponse | null;
  paymentSourceId?: string;
  paymentSource?: PaymentSource;
  tenderType?: 'CARD' | 'BANK_ACCOUNT';
  bankLinkResponse?: unknown;
  vaultReference?: string;
}
```

### `CommerceHubSdkError`

```ts
{
  message: string;
  stage:
    | 'mount'
    | 'session'
    | 'otp_send'
    | 'otp_validate'
    | 'payment_source'
    | 'interaction'
    | 'pay_by_bank';
  status?: number;
  cause?: unknown;
}
```

## Instance Methods

- `instance.update(options, environment?)`: update configuration and white-label values without destroying the DOM container
- `instance.destroy()`: remove the mounted widget and clean up Angular resources

## Internal Flow

1. `registerCommerceHubConnectWebSdk()` registers the custom element and exposes `window.CommerceHubConnectWebSdk`.
2. `mount()` validates the request, resolves the environment, and injects the resolved API base URL into the Angular component tree.
3. `createApplication()` creates the shared Angular runtime once.
4. `createComponent(CommerceHubConnectCaptureComponent, ...)` mounts the capture component into the requested container.
5. The build script compiles the Angular application and bundles it into a single IIFE with inline CSS.

## Troubleshooting

| Issue | Resolution |
|-------|------------|
| Widget does not render | Confirm the script is loaded before calling `mount()` and that the target selector resolves to an element |
| `configuration.sessionReferenceId is required.` | Provide a non-empty session reference id in `options.configuration` |
| `environment must be one of dev, qa, cat, or prod.` | Pass only supported environment values |
| Missing styles | Use the packaged `CommerceHubConnectSDK.js` bundle produced by `build:web-sdk-widget`, which inlines the stylesheet |
