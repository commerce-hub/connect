# CommerceHub Connect Web SDK

CommerceHub Connect Web SDK provides the `<commerce-hub-connect>` custom
element for embedding CommerceHub payment-source flows in merchant checkout and
account experiences. The SDK is Lit-based, framework-agnostic, and exports
TypeScript types generated from the CommerceHub OpenAPI schema.

## Install

The package is currently private while the public NPM release is prepared. The
planned package name is the current package name:

```bash
npm install commerce-hub-connect-sdk
```

Import the module once in the page or bundle where you use the element:

```ts
import 'commerce-hub-connect-sdk';
```

Then render the custom element:

```html
<commerce-hub-connect></commerce-hub-connect>
```

## End-to-end integration

The host application owns CommerceHub authentication and the initial interaction
request. The SDK owns the browser widget once the host passes an
`InteractionResponse` to the element.

1. Your backend creates or retrieves a CommerceHub interaction for the shopper.
2. Your frontend receives the resulting `InteractionResponse`.
3. Your frontend mounts `<commerce-hub-connect>` and assigns
   `.interactionResponse`.
4. The SDK renders the current interaction step and performs SDK-managed calls
   with `interactionResponse.interactionId` as the `x-interaction-id` header,
   and with `Authorization: Bearer <token>` when
   `interactionResponse.oauth.access_token` is present.
5. The shopper completes the required flow, such as OTP, saved source
   selection, card entry, ACH entry, Pay by Bank, or additional verification.
6. The SDK emits `onSuccess` with the selected `PaymentSource` in
   `event.detail` after a verified source is attached or selected.
7. Your host completes the merchant interaction with
   `POST /merchant/interaction/complete`, sending
   `{value: interactionResponse.interactionId}` and treating the returned
   `PaymentSource` as the completed source.

```ts
import 'commerce-hub-connect-sdk';
import type {
  InteractionResponse,
  OnSuccessEvent,
} from 'commerce-hub-connect-sdk';

const interactionResponse: InteractionResponse = await fetch(
  '/api/commercehub/interaction'
).then((response) => response.json());

const widget = document.querySelector('commerce-hub-connect');

if (widget) {
  widget.interactionResponse = interactionResponse;
  widget.baseURL = 'QA';
  widget.addEventListener('onSuccess', async (event: Event) => {
    const {detail: paymentSource} = event as OnSuccessEvent;

    console.log('Selected payment source', paymentSource);

    const completedPaymentSource = await fetch(
      '/api/commercehub/interaction/complete',
      {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({value: interactionResponse.interactionId}),
      }
    ).then((response) => response.json());

    console.log('Completed payment source', completedPaymentSource);
  });
}
```

## SDK-managed requests

When the widget performs CommerceHub calls, it uses `http://localhost:8080` by
default. Set `.baseURL` to one of the CommerceHub presets or to a custom origin.
The `DEV` preset resolves to `https://connect-dev.fiservapis.com/chc`. The
current `QA` and `PROD` presets resolve to the QA non-production CommerceHub
origin until final environment values are published.

```ts
widget.baseURL = 'QA';
widget.baseURL = 'https://api.example.com';
```

SDK-managed calls include OTP validation and resend, payment-source attach and
delete, card and ACH source creation, sensitive value masking, source
verification, required-info upload, Pay by Bank session handling, and native
account balance lookup.

The widget always sends `x-interaction-id` with
`interactionResponse.interactionId`. When
`interactionResponse.oauth.access_token` is present, it also sends
`Authorization: Bearer <token>`.

If `interactionResponse.interactionId` is missing, the widget keeps the current
screen stable and does not call the CommerceHub API.

## Design configuration

Pass `.designConfig` to adjust merchant-safe colors, typography, spacing, copy,
and Pay by Bank provider settings. All fields are optional and omitted values
fall back to SDK defaults.

```ts
widget.designConfig = {
  colors: {
    primary: '#084acc',
    text: '#101828',
    border: '#cbd5e1',
    widgetBackground: '#ffffff',
    paymentMethodBackground: '#f8fafc',
  },
  baseFontSize: '16px',
  baseFontWeight: '400',
  shellPadding: '1.75rem 1.5rem 1.5rem',
  copy: {
    otp: {
      title: 'Confirm your email',
      verifyButton: 'Verify',
    },
    paymentMethods: {
      title: 'Choose payment method',
      continueButton: 'Use selected method',
    },
  },
};
```

## Typed API client

The SDK also exports a typed `openapi-fetch` client for CommerceHub API calls
owned by the host application.

```ts
import {createCommerceHubClient} from 'commerce-hub-connect-sdk';

const client = createCommerceHubClient({
  baseURL: 'QA',
  getHeaders: async () => ({
    Authorization: `Bearer ${await loadCommerceHubToken()}`,
  }),
});

const {data, error} = await client.GET('/interaction');
```

Generated OpenAPI types live in `src/generated/openapi.ts`; regenerate them
with `npm run generate:client` after `swagger.json` changes.

## Development

```bash
npm i
npm run build
npm test
```

Run the local demo:

```bash
npm run serve
```

Then open `/dev/index.html`.
