# CommerceHub Wallet SDK: Embedded Integration Guide

## Overview

Embedded mode places the CommerceHub Wallet SDK inside an application-owned page, form, or card. The host application controls placement and sizing while the SDK manages payment-method workflows and interaction-scoped CommerceHub API operations.

Use embedded mode when the wallet should appear as part of the surrounding application. Use the default dialog mode when the wallet should appear as a standalone modal experience.

## Prerequisites

Before rendering the SDK, the host application must:

- Load `commerce-hub-connect-sdk`.
- Create the initial CommerceHub interaction through its backend integration.
- Provide the resulting interaction response to the SDK as a DOM property.
- Allocate an appropriate parent width and height.
- Register handlers for the events required by its workflow.

## Basic initialization

```html
<div class="wallet-container">
  <commerce-hub-connect id="wallet"></commerce-hub-connect>
</div>
```

```ts
import 'commerce-hub-connect-sdk';

const wallet = document.querySelector('commerce-hub-connect');

wallet.presentationMode = 'embedded';
wallet.embeddedSelectorMode = 'dropdown';
wallet.interactionResponse = interactionResponse;
```

`presentationMode` defaults to `dialog`. Set it to `embedded` explicitly for inline integrations.

`embeddedSelectorMode` defaults to `dropdown`, which renders the compact native payment-method select. Set it to `radio-list` to use the richer expandable selector instead:

```ts
wallet.embeddedSelectorMode = 'radio-list';
```

The property reflects to the `embedded-selector-mode` HTML attribute, so static markup can configure the same mode:

```html
<commerce-hub-connect
  presentation-mode="embedded"
  embedded-selector-mode="radio-list"
></commerce-hub-connect>
```

Object-valued inputs such as `interactionResponse` and `designConfig` must be assigned as DOM properties rather than serialized HTML attributes.

## Parent-controlled sizing

The host application owns the embedded container’s width, height, and minimum height. The SDK fills the space provided by that container.

### Standard embedded flow

Use a bounded, responsive height for workflows that can contain forms, payment-method lists, or multiple screens.

```css
.wallet-container {
  width: 100%;
  height: min(36rem, calc(100dvh - 8rem));
  min-height: 20rem;
}

.wallet-container > commerce-hub-connect {
  width: 100%;
  height: 100%;
}
```

### Compact dropdown flow

The default `dropdown` selector uses a native select. A compact parent height is sufficient.

```css
.wallet-container--select-only {
  height: 2.75rem;
  min-height: 2.75rem;
  overflow: visible;
}
```

The native dropdown menu overlays surrounding host content when opened.

### Radio-list flow

The optional `radio-list` mode renders an SDK-styled trigger and popup containing payment-method rows. Give its container enough vertical space for the expanded popup, and keep host overflow visible (or otherwise account for clipping) so the list remains usable.

<!-- PDF page break: #pagebreak() -->

## Angular integration

Derive the layout state in the component instead of placing feature-selection logic directly in the template.

```ts
import type {
  OnAddPaymentMethodEvent,
  OnSelectEvent,
} from 'commerce-hub-connect-sdk';

readonly isSelectOnly = computed(() => {
  const features = this.interactionResponse()?.features ?? [];
  return features.length === 1 && features[0] === 'SELECT';
});

handleSelect(event: Event): void {
  const {detail: selectedSource} = event as OnSelectEvent;
  // Continue the host checkout or payout workflow.
}

handleAddPaymentMethod(event: Event): void {
  const {detail: createdSource} = event as OnAddPaymentMethodEvent;
  // Update the host workflow or refresh its interaction state.
}
```

```html
<div
  class="wallet-container"
  [class.wallet-container--select-only]="isSelectOnly()"
>
  <commerce-hub-connect
    [presentationMode]="'embedded'"
    [embeddedSelectorMode]="'dropdown'"
    [interactionResponse]="interactionResponse()"
    [designConfig]="designConfig"
    (onSelect)="handleSelect($event)"
    (onAddPaymentMethod)="handleAddPaymentMethod($event)"
  ></commerce-hub-connect>
</div>
```

The conditional class is required only when the same container supports both compact dropdown interactions and full-height embedded workflows. A host dedicated to one workflow can apply the appropriate sizing class statically. When switching the binding to `'radio-list'`, allow additional height for the expanded rows and ensure the host container's overflow does not clip them.

## SELECT-only interactions

Create an interaction with exactly one feature:

```json
{
  "features": ["SELECT"]
}
```

In embedded mode, the SDK renders the configured selector:

- `dropdown` is the default compact native select; `radio-list` is the optional expandable row presentation.
- Native payment methods appear first, followed by the default saved payment method and then the remaining saved methods.
- If no eligible methods exist, the dropdown displays `No payment methods` and is disabled.
- Selecting a method calls the CommerceHub attach operation and displays loading feedback while it completes.
- The SDK emits `onSelect` only after the attach API succeeds.

The host should handle SDK errors according to its application-level error and retry strategy.

## Adding payment methods from the selector

When the interaction includes `ADD_ACCOUNT` and allows a supported tender, the selector appends an **Add payment method** row after the available methods. Selecting it opens the add-payment-method experience.

Create the interaction with both capabilities when the embedded selector should offer this action:

```json
{
  "features": ["SELECT", "ADD_ACCOUNT"]
}
```

<!-- PDF page break: #pagebreak() -->

## ADD_ACCOUNT-only interactions

Create an interaction containing only the add-account capability:

```json
{
  "features": ["ADD_ACCOUNT"]
}
```

Render it in embedded mode when adding a payment method is the page’s primary purpose. For a framework-neutral integration, assign object-valued inputs as DOM properties and listen for the SDK event:

```html
<div class="wallet-container">
  <commerce-hub-connect id="add-account-wallet"></commerce-hub-connect>
</div>
```

```ts
import type {
  CommerceHubConnect,
  OnAddPaymentMethodEvent,
} from 'commerce-hub-connect-sdk';

const addAccountWallet = document.querySelector<CommerceHubConnect>(
  '#add-account-wallet'
);

if (!addAccountWallet) {
  throw new Error('Add-account wallet element was not found');
}

addAccountWallet.presentationMode = 'embedded';
addAccountWallet.interactionResponse = addAccountInteraction;
addAccountWallet.designConfig = designConfig;
addAccountWallet.addEventListener('onAddPaymentMethod', (event: Event) => {
  const {detail: createdSource} = event as OnAddPaymentMethodEvent;
  // Update the host workflow or refresh its interaction state.
});
```

The SDK presents the supported tender options defined by the interaction. After a payment method is created successfully, it emits `onAddPaymentMethod` with the created payment source.

Use the standard embedded container height because ADD_ACCOUNT may open multi-step card, bank-account, verification, or required-information forms.

<!-- PDF page break: #pagebreak() -->

## Design configuration

Use `designConfig` for merchant-safe visual customization:

```ts
const designConfig = {
  colors: {
    primary: '#5b3df5',
    text: '#172033',
    copy: '#667085',
    border: '#e4e7ec',
    surface: '#ffffff',
    widgetBackground: '#ffffff',
  },
  baseFontSize: '16px',
};
```

The opened native SELECT popup is partially controlled by the browser and operating system.
