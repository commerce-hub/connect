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

The exact backend request is owned by the CommerceHub API integration. The
frontend handoff into this SDK starts once the host has an `InteractionResponse`.

## 2. Mount the widget

Import the SDK module and assign the interaction response as a DOM property.
Assign any `designConfig` object the same way. Do not pass either object-valued
property as an HTML attribute.

```ts
{% raw %}
import 'commerce-hub-connect-sdk';
import type {DesignConfig} from 'commerce-hub-connect-sdk';

const widget = document.createElement('commerce-hub-connect');
widget.baseURL = 'QA';
const designConfig: DesignConfig = {
  colors: {
    primary: '#084acc',
    text: '#101828',
    border: '#cbd5e1',
    widgetBackground: '#ffffff',
  },
};
const interactionResponse = await fetch('/api/commercehub/interaction', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({orderId, amount}),
}).then((response) => response.json());

widget.designConfig = designConfig;
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

Verified saved methods render as radio choices. The **Use selected method**
button is enabled after a choice is made, attaches that source, emits
`onSelect`, and keeps the saved-method list visible with that source selected.
**Add payment method** opens a modal bottom sheet with **Credit or debit card**
and **Bank account** options when both are allowed. If only one type is allowed,
the widget opens that flow directly.
The same bottom-sheet behavior applies to `ADD_ACCOUNT`-only interactions.

The widget always sends `interactionResponse.interactionId` as the
`x-interaction-id` header for SDK-managed CommerceHub calls. When
`interactionResponse.oauth.access_token` is present, it also sends
`Authorization: Bearer <token>`. Gateway OAuth from the host response is
preserved when the refreshed interaction response omits it.

For manual card and ACH source creation, the widget encrypts card, CVC, routing,
and account-number values locally with `interactionResponse.publicKey` using
RSA-OAEP SHA-512. It does not call `/interaction/source/mask/*`. The
`POST /interaction/source/card` and `POST /interaction/source/ach` calls also
send `Api-Key` from `interactionResponse.oauth.client_id`,
`Auth-Token-Type` from `interactionResponse.oauth.token_type`, and `x-key-id`
from `interactionResponse.keyId`. Missing `publicKey`, `keyId`,
`oauth.access_token`, `oauth.client_id`, or `oauth.token_type` blocks manual
card and ACH source creation with the existing inline encryption error.

SDK-managed calls include:

- OTP validation and resend.
- Card and manual ACH source creation.
- Saved source attach, verification, and deletion.
- Required-info upload and verification.
- Pay by Bank session launch and finalization.
- Native account balance lookup.

If `interactionResponse.interactionId` is missing, the widget does not call the
CommerceHub API and keeps the current screen stable.

If `interactionResponse` itself is missing, the widget renders a configuration
error and blocks shopper payment actions until the host assigns it.

## 4. Handle completion

Listen for `onSelect` on the element. The event detail is the selected
`PaymentSource`. Keep `onSelect` as the widget boundary, then have the host
complete the merchant interaction with
`GET /merchant/interaction/{interactionId}/complete` through your backend or
typed CommerceHub merchant client, and treat the response as the authoritative
completed `PaymentSource`.

```ts
{% raw %}
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
{% endraw %}
```

Do not assign the completion response back to `widget.interactionResponse`; the
completion response is a `PaymentSource`, not an `InteractionResponse`.

The SDK also emits success-only operation events for host telemetry or local UI
state. These events use raw operation results in `event.detail`:

| Event                   | Detail                                                          |
| ----------------------- | --------------------------------------------------------------- |
| `onListPaymentMethods`  | `PaymentSource[]` from a successful `GET /interaction` refresh. |
| `onAddPaymentMethod`    | Created or finalized `PaymentSource`.                           |
| `onVerifyPaymentMethod` | Verified or updated `PaymentSource`.                            |
| `onDeletePaymentMethod` | Deleted payment source id.                                      |
| `onTransfer`            | `NativeAccountTransaction` returned by native account transfer. |

The widget handles recoverable flow errors in the UI, such as an invalid OTP or
source verification state. It does not currently emit a separate public error
event for those states.

`onSelect` remains the completion boundary only for explicit payment-source
selection. Marking a saved source as default attaches it and updates the
**Default** badge, but does not emit `onSelect` or complete host-owned checkout
work. New-card forms do not include a default-selection control. A saved method
can be removed from its
overflow menu: the first **Delete** selection reveals a red **Delete** action
on the row for 10 seconds, and activating that action removes the method.

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
