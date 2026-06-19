---
layout: page.11ty.cjs
title: <commerce-hub-connect> | End-to-End Flow
---

# End-to-End Flow

The SDK is a browser widget. The merchant host application still owns shopper
authentication, CommerceHub credentials, and the backend call that creates or
retrieves the initial interaction.

## 1. Create an interaction on your backend

Your backend should expose a merchant-owned endpoint that the frontend can call
without exposing CommerceHub credentials in the browser.

```ts
{% raw %}
app.post('/api/commercehub/interaction', async (request, response) => {
  const interactionResponse = await createCommerceHubInteraction({
    shopper: request.user,
    amount: request.body.amount,
    merchantReference: request.body.orderId,
  });

  response.json(interactionResponse);
});
{% endraw %}
```

The exact backend request is owned by the CommerceHub API integration. The
frontend handoff into this SDK starts once the host has an `InteractionResponse`.

## 2. Mount the widget

Import the SDK module and assign the interaction response as a DOM property.

```ts
{% raw %}
import 'commerce-hub-connect-sdk';

const widget = document.createElement('commerce-hub-connect');
widget.baseURL = 'QA';
const interactionResponse = await fetch('/api/commercehub/interaction', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({orderId, amount}),
}).then((response) => response.json());

widget.interactionResponse = interactionResponse;

document.querySelector('#payment-host')?.replaceChildren(widget);
{% endraw %}
```

```html
<div id="payment-host"></div>
```

## 3. Let the SDK advance the shopper flow

The widget uses the host-provided `InteractionResponse` as bootstrap data for
`interactionId` and optional gateway OAuth. When a new
`interactionResponse.interactionId` is assigned, it immediately calls
`GET /interaction` and uses that server-fetched response as the authoritative
state for payment methods, selected source, billing addresses, and status.
Host-provided `paymentSources` are not rendered as authoritative saved methods.

The widget always sends `interactionResponse.interactionId` as the
`x-interaction-id` header for SDK-managed CommerceHub calls. When
`interactionResponse.oauth.access_token` is present, it also sends
`Authorization: Bearer <token>`. Gateway OAuth from the host response is
preserved when the refreshed interaction response omits it.

SDK-managed calls include:

- OTP validation and resend.
- Card and manual ACH source creation.
- Sensitive card and ACH value masking.
- Saved source attach, verification, and deletion.
- Required-info upload and verification.
- Pay by Bank session launch and finalization.
- Native account balance lookup.

If `interactionResponse.interactionId` is missing, the widget does not call the
CommerceHub API and keeps the current screen stable.

## 4. Handle completion

Listen for `onSuccess` on the element. The event detail is the selected
`PaymentSource`. Keep `onSuccess` as the widget boundary, then have the host
complete the merchant interaction with
`GET /merchant/interaction/{interactionId}/complete` through your backend or
typed CommerceHub merchant client, and treat the response as the authoritative
completed `PaymentSource`.

```ts
{% raw %}
widget.addEventListener('onSuccess', async (event) => {
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
{% endraw %}
```

Do not assign the completion response back to `widget.interactionResponse`; the
completion response is a `PaymentSource`, not an `InteractionResponse`.

The widget handles recoverable flow errors in the UI, such as an invalid OTP or
source verification state. It does not currently emit a separate public error
event for those states.

## 5. Configure production behavior

SDK-managed browser calls use the `PROD` preset by default. Set `.baseURL` only
when the host needs a different CommerceHub environment or gateway origin.

```ts
{% raw %}
widget.baseURL = 'PROD';
widget.baseURL = 'QA';
widget.baseURL = 'https://api.example.com';
{% endraw %}
```

The `PROD` preset resolves to `https://connect.fiservapis.com/chc`, the `DEV`
preset resolves to `https://connect-dev.fiservapis.com/chc`, and the `QA`
preset resolves to the QA non-production CommerceHub origin.

Keep CommerceHub credentials, merchant tokens, and customer-sensitive backend
data out of browser code. The browser should receive only the interaction data
needed by the widget.

## 6. Regenerate OpenAPI types carefully

Generated OpenAPI types live in `src/generated/openapi.ts` for runtime paths and
`src/generated/merchant-openapi.ts` for merchant paths. Regenerate both with
`npm run generate:client` after `swagger.json` or `merchant-swagger.json`
changes.

The public `InteractionResponse` type intentionally augments the generated
OpenAPI type with optional `oauth` data injected by the CommerceHub gateway.
Do not hand-edit `src/generated/openapi.ts` to add that field; preserve the
local augmentation in `src/commerce-hub-connect.ts` after client regeneration.
