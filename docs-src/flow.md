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
widget.interactionResponse = await fetch('/api/commercehub/interaction', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({orderId, amount}),
}).then((response) => response.json());

document.querySelector('#payment-host')?.replaceChildren(widget);
{% endraw %}
```

```html
<div id="payment-host"></div>
```

## 3. Let the SDK advance the shopper flow

The widget renders the correct screen for the current interaction state. It
uses `interactionResponse.interactionId` as the `x-interaction-id` header for
SDK-managed CommerceHub calls.

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
complete the merchant interaction. Send `{value:
interactionResponse.interactionId}` to `POST /merchant/interaction/complete`
through your backend or typed CommerceHub client, and treat the response as the
authoritative completed `PaymentSource`.

```ts
{% raw %}
widget.addEventListener('onSuccess', async (event) => {
  const paymentSource = event.detail;

  const completedPaymentSource = await fetch(
    '/api/commercehub/interaction/complete',
    {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({value: interactionResponse.interactionId}),
    }
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

Set `.baseURL` to the CommerceHub environment or gateway origin that should
receive SDK-managed browser calls.

```ts
{% raw %}
widget.baseURL = 'QA';
widget.baseURL = 'https://api.example.com';
{% endraw %}
```

The `DEV` preset resolves to `https://connect-dev.fiservapis.com/chc`. The
current `QA` and `PROD` presets resolve to the QA non-production CommerceHub
origin until final environment values are published.

Keep CommerceHub credentials, merchant tokens, and customer-sensitive backend
data out of browser code. The browser should receive only the interaction data
needed by the widget.
