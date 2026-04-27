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
  interaction: InteractionResponse;
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
        const interaction = await fetch('/api/merchant/interaction/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({
            sessionReferenceId: 'merchant-session-001',
            merchantTransactionId: 'txn-10001',
            merchantOrderId: 'order-20002',
            merchantInvoiceNumber: 'invoice-30003',
            authType: 'FINAL_SALE',
            expiryMinutes: 10,
            email: 'merchant@example.com',
            allowedTenderTypes: ['CARD'],
            allowEmailChange: false,
            merchantData: {
              clientId: 'laika',
              merchantId: '100014000315473',
              terminalId: '10000001',
            },
            wallet: true,
          }),
        }).then((response) => response.json());

        sdkInstance = await window.CommerceHubConnectWebSdk.mount(
          '#payment-container',
          {
            interaction,
            configuration: {
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

  widget.interaction = {
    interactionId: 'interaction-1',
    status: 'EMAIL_REQUESTED',
    email: 'merchant@example.com',
    allowEmailChange: false,
    allowedTenderTypes: ['CARD'],
    paymentSources: [],
  };

  widget.configuration = {
    email: 'merchant@example.com',
    wallet: true,
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

### `CommerceHubConnectWebSdkMountOptions`

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `interaction` | `InteractionResponse` | Yes | Pre-created interaction returned from `interaction/create` |
| `configuration` | `CommerceHubSdkConfiguration` | Yes | Runtime SDK configuration used after interaction creation |
| `whiteLabel` | `CommerceHubWhiteLabelOptions` | No | White-label overrides applied on mount |
| `replaceContents` | `boolean` | No | Replace the target container contents before mount |

### `CommerceHubSdkConfiguration`

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `onSuccess` | `(result) => void` | Yes | Success callback |
| `onError` | `(error) => void` | Yes | Error callback |
| `email` | `string` | No | Unencrypted email used for `otp/send` when the interaction response email is masked |
| `paymentSelectionTitle` | `string` | No | Override payment-selection heading |
| `paymentSelectionConfirmLabel` | `string` | No | Override payment-selection CTA label |
| `wallet` | `boolean` | No | Enable wallet flow |
| `whiteLabel` | `CommerceHubWhiteLabelOptions` | No | Inline white-label defaults |
| `payByBank` | `CommerceHubPayByBankOptions` | No | Pay By Bank configuration |

Values that now belong to the external `interaction/create` request instead of
`CommerceHubSdkConfiguration`:

- `sessionReferenceId`
- `merchantTransactionId`
- `merchantOrderId`
- `merchantInvoiceNumber`
- `authType`
- `expiryMinutes`
- `allowEmailChange`
- `allowedTenderTypes`
- `merchantData.clientId`
- `merchantData.merchantId`
- `merchantData.terminalId`

`email` is still usually sent in the external `interaction/create` request, but the SDK also accepts
`configuration.email` so `otp/send` can use the unencrypted address when the interaction response
contains only a masked value.

`region`, `language`, and `mountElementId` are not used by the current SDK runtime and are no
longer part of the initialization contract.

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
2. The host page creates the interaction outside the SDK and passes the resulting `InteractionResponse` into `mount()`.
3. `mount()` validates the request, resolves the environment, and injects the resolved API base URL into the Angular component tree.
4. `createApplication()` creates the shared Angular runtime once.
5. `createComponent(CommerceHubConnectCaptureComponent, ...)` mounts the capture component into the requested container.
6. The build script compiles the Angular application and bundles it into a single IIFE with inline CSS.

## Troubleshooting

| Issue | Resolution |
|-------|------------|
| Widget does not render | Confirm the script is loaded before calling `mount()` and that the target selector resolves to an element |
| `interaction.interactionId is required.` | Pass the `InteractionResponse` returned by the external `interaction/create` call |
| `environment must be one of dev, qa, cat, or prod.` | Pass only supported environment values |
| Missing styles | Use the packaged `CommerceHubConnectSDK.js` bundle produced by `build:web-sdk-widget`, which inlines the stylesheet |
