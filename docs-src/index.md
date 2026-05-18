---
layout: page.11ty.cjs
title: <commerce-hub-connect> ⌲ Home
---

# &lt;commerce-hub-connect>

`<commerce-hub-connect>` is the public Web SDK widget shell. The first SDK flow
slice renders OTP verification, saved payment-method selection, and the
no-saved-payment-methods variant.

## Basic usage

<section class="columns">
  <div>

```html
<commerce-hub-connect></commerce-hub-connect>
```

  </div>
  <div>

<commerce-hub-connect></commerce-hub-connect>

  </div>
</section>

## Interaction calls

Hosts pass an `InteractionResponse` into `.interactionResponse`. When the SDK
handles OTP validation or OTP resend, it uses
`interactionResponse.interactionId` as the `x-interaction-id` header. If
`interactionId` is missing, the widget does not call the CommerceHub API and
keeps the current screen stable.

Saved payment-method confirmation does not call
`/interaction/payment-source/{paymentSourceId}/attach`. After a shopper selects
a saved method and presses Continue, the widget emits `onSuccess` with the
selected `PaymentSource` as `event.detail`. Initial `interactionResponse`
hydration does not emit `onSuccess`.

## Design configuration

Host applications can pass an optional `.designConfig` object to override
merchant-safe colors, the base text size, the base font weight, and current
screen copy. The object and all nested fields are optional.

```ts
{% raw %}
html`<commerce-hub-connect
  .interactionResponse=${interactionResponse}
  .designConfig=${{
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
  }}
></commerce-hub-connect>`;
{% endraw %}
```
