# CommerceHub Connect Web SDK

This package provides the CommerceHub Connect widget as a Lit-based web
component. The current implementation establishes the internal primitive
foundation from the Figma source of truth and includes the first SDK-owned flow
slice for OTP verification and saved payment-method selection.

## Current scope

- Public web component: `<commerce-hub-connect>`
- Typed CommerceHub API client generated from `swagger.json`
- Internal primitives for widget shell, buttons, fields, OTP inputs, alerts,
  status pills, payment method rows, source actions, detail rows, and form grids
- SDK-owned OTP validation and saved payment-source confirmation actions
- Optional `designConfig` input for merchant-safe colors, typography, and copy

## Development

Install dependencies:

```bash
npm i
```

Build the component:

```bash
npm run build
```

Regenerate the typed API client after `swagger.json` changes:

```bash
npm run generate:client
```

Run tests:

```bash
npm test
```

Start the local demo:

```bash
npm run serve
```

Then open `/dev/index.html`.

## API client

The SDK exports a typed `fetch` client for the CommerceHub OpenAPI surface.
Generated schema types live in `src/generated/openapi.ts`; do not edit that
file by hand.

```ts
import {createCommerceHubClient} from './commerce-hub-connect.js';

const client = createCommerceHubClient({
  baseUrl: 'https://api.example.com',
  headers: {Authorization: `Bearer ${token}`},
});

const {data, error} = await client.GET('/interaction');
```

When `<commerce-hub-connect>` performs SDK-managed interaction calls, it uses
`http://localhost:8080` by default and sends `interactionResponse.interactionId`
as the `x-interaction-id` header. OTP validation and OTP resend require that
`interactionId`; if it is missing, the widget keeps the current screen stable
and does not call the API.

Saved payment-method confirmation is local: after the shopper selects a saved
method and presses Continue, the widget does not call
`/interaction/payment-source/{paymentSourceId}/attach`. Instead, it emits
`onSuccess` with the selected `PaymentSource` as `event.detail`. Initial
`interactionResponse` hydration does not emit `onSuccess`.

Pass an `InteractionResponse` into the component with a property binding when
the host app owns the API call:

```ts
import type {
  DesignConfig,
  InteractionResponse,
} from './commerce-hub-connect.js';

const interactionResponse: InteractionResponse = await loadInteraction();
const designConfig: DesignConfig = {
  colors: {
    primary: '#084acc',
    text: '#101828',
    border: '#cbd5e1',
  },
  baseFontSize: '16px',
  baseFontWeight: '300',
  copy: {
    otp: {
      title: 'Confirm your email',
      verifyButton: 'Verify',
    },
    paymentMethods: {
      title: 'Choose payment',
      continueButton: 'Use selected method',
    },
  },
};

html`<commerce-hub-connect
  .interactionResponse=${interactionResponse}
  .designConfig=${designConfig}
></commerce-hub-connect>`;
```

`designConfig` and all nested fields are optional. Any omitted color,
`baseFontSize`, `baseFontWeight`, title, subtitle, or button label falls back
to the SDK default.
