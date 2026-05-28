---
layout: page.11ty.cjs
title: <commerce-hub-connect> | Home
---

# &lt;commerce-hub-connect>

`<commerce-hub-connect>` is the CommerceHub Connect Web SDK widget. It lets a
merchant host embed CommerceHub payment-source flows as a standards-based web
component while keeping CommerceHub authentication and interaction creation on
the host backend.

## What the SDK handles

- OTP verification and resend for CommerceHub interactions.
- Saved payment-source selection, attach, verification, and deletion.
- Card entry with sensitive value masking before source creation.
- Manual ACH entry and Pay by Bank provider handoff.
- Required-info collection for sources that need additional verification.
- Native account balance lookup when native sources are present.
- Merchant-safe styling and copy customization through `designConfig`.

## Integration shape

The host application creates or retrieves an interaction, passes the resulting
`InteractionResponse` into the widget, and listens for `onSuccess` when the
shopper finishes with a selected payment source. The host then completes the
merchant interaction with `POST /merchant/interaction/complete`; the widget does
not call that endpoint internally.

```ts
{% raw %}
import 'commerce-hub-connect-sdk';

const widget = document.querySelector('commerce-hub-connect');

if (widget) {
  widget.interactionResponse = await fetch('/api/commercehub/interaction').then(
    (response) => response.json()
  );
  widget.baseURL = 'QA';
  widget.addEventListener('onSuccess', async (event) => {
    const selectedPaymentSource = event.detail;
    const completedPaymentSource = await fetch(
      '/api/commercehub/interaction/complete',
      {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({value: widget.interactionResponse.interactionId}),
      }
    ).then((response) => response.json());

    console.log('Selected source', selectedPaymentSource);
    console.log('Completed source', completedPaymentSource);
  });
}
{% endraw %}
```

```html
<commerce-hub-connect></commerce-hub-connect>
```

## Request routing

SDK-managed CommerceHub calls always send
`interactionResponse.interactionId` as the `x-interaction-id` header. When
`interactionResponse.oauth.access_token` is present, they also send
`Authorization: Bearer <token>`. If the interaction id is missing, the widget
does not call the API and keeps the current screen stable.

The widget uses `http://localhost:8080` by default. Set `.baseURL` to a preset
or custom origin before the shopper starts the flow:

```ts
{% raw %}
widget.baseURL = 'QA';
widget.baseURL = 'https://api.example.com';
{% endraw %}
```

## Next steps

- Start with [Install](./install/) to add the package to an app.
- Read [End-to-End Flow](./flow/) for the merchant integration contract.
- Use [Examples](./examples/) for copy-paste integration patterns.
- Check [API](./api/) for generated custom-element API details.
