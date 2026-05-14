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
handles OTP validation, OTP resend, or saved payment-source attach actions, it
uses `interactionResponse.interactionId` as the `x-interaction-id` header. If
`interactionId` is missing, the widget does not call the CommerceHub API and
keeps the current screen stable. This flow slice does not emit `onSuccess` or
`onError` events.

## Theming

Host applications can override the SDK defaults with CSS custom properties.

```css
commerce-hub-connect {
  --chc-primary: #084acc;
  --chc-text: #101828;
  --chc-border: #cbd5e1;
}
```
