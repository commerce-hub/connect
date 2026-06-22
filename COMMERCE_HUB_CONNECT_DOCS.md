# CommerceHub Connect Web SDK Documentation

CommerceHub Connect Web SDK provides the `<commerce-hub-connect>` custom
element for embedding CommerceHub payment-source flows in merchant checkout and
account experiences. The SDK is Lit-based, framework-agnostic, and exports
TypeScript types generated from the CommerceHub OpenAPI schema.

This file consolidates the public documentation into one Markdown document for
easy review, sharing, or publication outside the generated docs site.

## What the SDK Handles

- OTP verification and resend for CommerceHub interactions.
- Saved payment-source selection, attach, verification, and deletion.
- Card entry with sensitive value masking before source creation.
- Manual ACH entry and Pay by Bank provider handoff.
- Required-info collection for sources that need additional verification.
- Native account balance lookup when native sources are present.
- Merchant-safe styling and copy customization through `designConfig`.

## Install

The SDK is being prepared for the public NPM registry. The current package name
is `commerce-hub-connect-sdk`.

```bash
npm install commerce-hub-connect-sdk
```

The package registers the `<commerce-hub-connect>` custom element when imported.

```ts
import 'commerce-hub-connect-sdk';
```

Render the custom element in the page where the shopper should complete the
CommerceHub flow.

```html
<commerce-hub-connect></commerce-hub-connect>
```

## End-to-End Integration

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
6. The SDK emits `onSelect` with the selected `PaymentSource` in
   `event.detail` after a verified source is attached or selected.
7. Your host completes the merchant interaction with
   `GET /merchant/interaction/{interactionId}/complete` and treats the
   merchant response as the completed source.

## Backend Integration Contract

The SDK is a browser widget. The merchant host application still owns shopper
authentication, CommerceHub credentials, and the backend call that creates or
retrieves the initial interaction.

Your backend should expose a merchant-owned endpoint that the frontend can call
without exposing CommerceHub credentials in the browser.

```ts
app.post('/api/commercehub/interaction', async (request, response) => {
  const interactionResponse = await createCommerceHubInteraction({
    shopper: request.user,
    amount: request.body.amount,
    merchantReference: request.body.orderId,
  });

  response.json(interactionResponse);
});
```

The exact backend request is owned by the CommerceHub API integration. The
frontend handoff into this SDK starts once the host has an `InteractionResponse`.

## Basic Frontend Mount

Use property assignment for complex values such as `interactionResponse` and
`designConfig`.

```ts
import 'commerce-hub-connect-sdk';
import type {InteractionResponse} from 'commerce-hub-connect-sdk';

const interactionResponse: InteractionResponse = await fetch(
  '/api/commercehub/interaction'
).then((response) => response.json());

const widget = document.querySelector('commerce-hub-connect');

if (widget) {
  widget.interactionResponse = interactionResponse;
  widget.baseURL = 'QA';
}
```

Only `base-url` is available as a string attribute.

```html
<commerce-hub-connect base-url="QA"></commerce-hub-connect>
```

For complex values, assign DOM properties instead of HTML attributes.

```ts
widget.interactionResponse = interactionResponse;
widget.designConfig = designConfig;
```

## Plain JavaScript Example

```ts
import 'commerce-hub-connect-sdk';

const host = document.querySelector('#commerce-hub-widget-host');
const widget = document.createElement('commerce-hub-connect');

widget.baseURL = 'QA';
widget.interactionResponse = await fetch('/api/commercehub/interaction', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({orderId: 'order-123'}),
}).then((response) => response.json());

widget.addEventListener('onSelect', async (event) => {
  const paymentSource = event.detail;
  const completedPaymentSource = await fetch(
    `/api/commercehub/interaction/${encodeURIComponent(
      widget.interactionResponse.interactionId
    )}/complete`,
    {method: 'GET'}
  ).then((response) => response.json());

  fetch('/api/orders/order-123/payment-source', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      selectedPaymentSourceId: paymentSource.id,
      completedPaymentSourceId: completedPaymentSource.id,
    }),
  });
});

host?.replaceChildren(widget);
```

```html
<div id="commerce-hub-widget-host"></div>
```

## Lit Example

```ts
import {html, LitElement} from 'lit';
import 'commerce-hub-connect-sdk';
import type {
  InteractionResponse,
  OnSelectEvent,
} from 'commerce-hub-connect-sdk';

class CheckoutPayment extends LitElement {
  interactionResponse?: InteractionResponse;

  render() {
    return html`<commerce-hub-connect
      .interactionResponse=${this.interactionResponse}
      .baseURL=${'QA'}
      @onSelect=${this.handleSelect}
    ></commerce-hub-connect>`;
  }

  private async handleSelect(event: OnSelectEvent) {
    const completedPaymentSource = await fetch(
      `/api/commercehub/interaction/${encodeURIComponent(
        this.interactionResponse?.interactionId ?? ''
      )}/complete`,
      {method: 'GET'}
    ).then((response) => response.json());

    this.dispatchEvent(
      new CustomEvent('payment-source-selected', {
        detail: {
          selectedPaymentSource: event.detail,
          completedPaymentSource,
        },
      })
    );
  }
}
```

## SDK-Managed Requests

When the widget performs CommerceHub calls, it uses the `PROD` preset by
default. Set `.baseURL` only when the host needs a different CommerceHub preset
or a custom origin. The `PROD` preset resolves to
`https://connect.fiservapis.com/chc`, the `DEV` preset resolves to
`https://connect-dev.fiservapis.com/chc`, and the `QA` preset resolves to the
QA non-production CommerceHub origin.

```ts
widget.baseURL = 'PROD';
widget.baseURL = 'QA';
widget.baseURL = 'https://api.example.com';
```

SDK-managed calls include:

- OTP validation and resend.
- Card and manual ACH source creation.
- Sensitive card and ACH value masking.
- Saved source attach, verification, and deletion.
- Required-info upload and verification.
- Pay by Bank session launch and finalization.
- Native account balance lookup.

The widget always sends `x-interaction-id` with
`interactionResponse.interactionId`. When
`interactionResponse.oauth.access_token` is present, it also sends
`Authorization: Bearer <token>`.

If `interactionResponse.interactionId` is missing, the widget does not call the
CommerceHub API and keeps the current screen stable.

## Handling Completion

Listen for `onSelect` on the element. The event detail is the selected
`PaymentSource`. Keep `onSelect` as the widget boundary, then have the host
complete the merchant interaction with
`GET /merchant/interaction/{interactionId}/complete` through your backend or
typed CommerceHub merchant client, and treat the response as the authoritative
completed `PaymentSource`.

```ts
widget.addEventListener('onSelect', async (event) => {
  const paymentSource = event.detail;

  const completedPaymentSource = await fetch(
    `/api/commercehub/interaction/${encodeURIComponent(
      interactionResponse.interactionId
    )}/complete`,
    {method: 'GET'}
  ).then((response) => response.json());

  await fetch('/api/orders/confirm-payment-source', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      orderId,
      selectedPaymentSourceId: paymentSource.id,
      completedPaymentSourceId: completedPaymentSource.id,
    }),
  });
});
```

Do not assign the completion response back to `widget.interactionResponse`; the
completion response is a `PaymentSource`, not an `InteractionResponse`.

The widget handles recoverable flow errors in the UI, such as an invalid OTP or
source verification state. It does not currently emit a separate public error
event for those states.

## Design Configuration

Pass `.designConfig` to adjust merchant-safe colors, typography, spacing, copy,
and Pay by Bank provider settings. Most fields are optional and omitted values
fall back to SDK defaults. If the Pay by Bank handoff is enabled, provide
`payByBank.apiKey` and `payByBank.configId` from your CommerceHub integration.

```ts
import 'commerce-hub-connect-sdk';
import type {DesignConfig} from 'commerce-hub-connect-sdk';

const designConfig: DesignConfig = {
  colors: {
    primary: '#084acc',
    text: '#101828',
    copy: '#475467',
    border: '#cbd5e1',
    widgetBackground: '#ffffff',
    paymentMethodBackground: '#f8fafc',
  },
  baseFontSize: '16px',
  baseFontWeight: '400',
  shellPadding: '1.75rem 1.5rem 1.5rem',
  payByBank: {
    apiKey: '<pay-by-bank-api-key>',
    configId: '<pay-by-bank-config-id>',
  },
  copy: {
    otp: {
      title: 'Confirm your email',
      verifyButton: 'Verify',
    },
    paymentMethods: {
      title: 'Choose payment method',
      continueButton: 'Use selected method',
    },
    noSavedPaymentMethods: {
      title: 'Add payment method',
      addCardTitle: 'Add card',
      addBankAccountTitle: 'Add bank account',
    },
  },
};

const widget = document.querySelector('commerce-hub-connect');

if (widget) {
  widget.designConfig = designConfig;
}
```

## Public Custom Element API

### Element

```html
<commerce-hub-connect></commerce-hub-connect>
```

### Properties

| Property              | Type                               | Description                                                                                          |
| --------------------- | ---------------------------------- | ---------------------------------------------------------------------------------------------------- |
| `interactionResponse` | `InteractionResponse` or undefined | CommerceHub interaction payload that controls the visible widget state. Assign as a DOM property.    |
| `designConfig`        | `DesignConfig` or undefined        | Optional colors, typography, spacing, copy, and Pay by Bank provider settings. Assign as a property. |
| `baseURL`             | `CommerceHubBaseURLInput`          | CommerceHub API base URL preset or custom origin for SDK-managed requests.                           |

### Attribute

| Attribute  | Property  | Description                                                      |
| ---------- | --------- | ---------------------------------------------------------------- |
| `base-url` | `baseURL` | String attribute for CommerceHub preset names or custom origins. |

### Event

| Event       | Detail          | Description                                                                                |
| ----------- | --------------- | ------------------------------------------------------------------------------------------ |
| `onSelect` | `PaymentSource` | Emitted after a verified payment source is attached or selected by the SDK-managed widget. |

## Exported Types and Helpers

The SDK exports:

- `CommerceHubConnect`
- `InteractionResponse`
- `PaymentSource`
- `DesignConfig`
- `OnSelectEvent`
- `OnErrorEvent`
- `ON_SELECT_EVENT`
- `ON_ERROR_EVENT`
- `createCommerceHubClient`
- `createCommerceHubMerchantClient`
- `resolveCommerceHubBaseURL`
- `COMMERCE_HUB_BASE_URLS`
- `DEFAULT_COMMERCE_HUB_BASE_URL`
- `CommerceHubBaseURLInput`
- `CommerceHubBaseURLPreset`
- `CommerceHubClient`
- `CommerceHubMerchantClient`
- `CommerceHubClientOptions`
- OpenAPI-derived `components`, `operations`, and `paths` types
- OpenAPI-derived `MerchantComponents`, `MerchantOperations`, and
  `MerchantPaths` types

## Typed API Clients

The SDK exports typed `openapi-fetch` clients for both service contracts. Use
`createCommerceHubClient` for widget/runtime interaction-service paths and
`createCommerceHubMerchantClient` for host-owned merchant-service paths.

```ts
import {
  createCommerceHubClient,
  createCommerceHubMerchantClient,
} from 'commerce-hub-connect-sdk';

const runtimeClient = createCommerceHubClient({
  baseURL: 'QA',
  getHeaders: async () => ({
    Authorization: `Bearer ${await loadCommerceHubToken()}`,
  }),
});

const merchantClient = createCommerceHubMerchantClient({baseURL: 'QA'});

const {data, error} = await runtimeClient.GET('/interaction');
const completed = await merchantClient.GET(
  '/merchant/interaction/{interactionId}/complete',
  {params: {path: {interactionId: data?.interactionId ?? ''}}}
);
```

Both client factories accept:

| Option       | Description                                                      |
| ------------ | ---------------------------------------------------------------- |
| `baseUrl`    | CommerceHub preset or origin. Takes precedence over `baseURL`.   |
| `baseURL`    | CommerceHub preset or origin. Kept for DOM-property consistency. |
| `headers`    | Static headers added to every request.                           |
| `getHeaders` | Dynamic headers added to every request after static headers.     |

## Environment and Security Notes

- Keep CommerceHub credentials, merchant tokens, and customer-sensitive backend
  data out of browser code.
- The browser should receive only the interaction data needed by the widget.
- The SDK uses the `PROD` preset by default for SDK-managed browser calls.
- Set `.baseURL` only when the host needs a different CommerceHub environment
  or gateway origin.

## Development Commands

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

The public `InteractionResponse` type intentionally augments the generated
OpenAPI type with optional `oauth` data injected by the CommerceHub gateway.
Do not hand-edit `src/generated/openapi.ts` to add that field; preserve the
local augmentation in `src/commerce-hub-connect.ts` after client regeneration.

Run tests:

```bash
npm test
```

Start the local demo:

```bash
npm run serve
```

Then open `/dev/index.html`.

Rebuild generated docs and bundled documentation assets:

```bash
npm run docs
```

Generated OpenAPI types live in `src/generated/openapi.ts` for runtime paths and
`src/generated/merchant-openapi.ts` for merchant paths; do not edit generated
files by hand.
