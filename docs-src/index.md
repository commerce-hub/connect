---
layout: page.11ty.cjs
title: <commerce-hub-connect> ⌲ Home
---

# &lt;commerce-hub-connect>

`<commerce-hub-connect>` is the public Web SDK widget shell. The first SDK slice
ships internal primitives that match the CommerceHub Connect Figma source of
truth and can later be composed into the full payment-method flow.

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

## Theming

Host applications can override the SDK defaults with CSS custom properties.

```css
commerce-hub-connect {
  --chc-primary: #084acc;
  --chc-text: #101828;
  --chc-border: #cbd5e1;
}
```
