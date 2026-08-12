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
wallet.interactionResponse = interactionResponse;
```

`presentationMode` defaults to `dialog`. Set it to `embedded` explicitly for inline integrations.

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

### SELECT-only flow

An embedded interaction containing only `SELECT` renders a native payment-method dropdown. A compact parent height is sufficient.

```css
.wallet-container--select-only {
  height: 2.75rem;
  min-height: 2.75rem;
  overflow: visible;
}
```

The native dropdown menu overlays surrounding host content when opened.

## Angular integration

Derive the layout state in the component instead of placing feature-selection logic directly in the template.

```ts
readonly isSelectOnly = computed(() => {
  const features = this.interactionResponse()?.features ?? [];
  return features.length === 1 && features[0] === 'SELECT';
});
```

```html
<div
  class="wallet-container"
  [class.wallet-container--select-only]="isSelectOnly()"
>
  <commerce-hub-connect
    [presentationMode]="'embedded'"
    [interactionResponse]="interactionResponse()"
    [designConfig]="designConfig"
    (onSelect)="handleSelect($event)"
    (onAddPaymentMethod)="handleAddPaymentMethod($event)"
  ></commerce-hub-connect>
</div>
```

The conditional class is required only when the same container supports both compact SELECT-only interactions and full-height embedded workflows. A host dedicated to one workflow can apply the appropriate sizing class statically.

## SELECT-only interactions

Create an interaction with exactly one feature:

```json
{
  "features": ["SELECT"]
}
```

In embedded mode, the SDK renders only a payment-method dropdown:

- Only selection-eligible payment methods are included.
- Verified cards and bank accounts require a provisioned recipient.
- If no eligible methods exist, the dropdown displays `No payment methods` and is disabled.
- Selecting a method calls the CommerceHub attach operation.
- The SDK emits `onSelect` only after the attach API succeeds.

```ts
handleSelect(event: CustomEvent<PaymentSource>): void {
  const selectedSource = event.detail;
  // Continue the host checkout or payout workflow.
}
```

The host should handle SDK errors according to its application-level error and retry strategy.

## Adding payment methods from a SELECT-only page

Do not mutate a SELECT-only interaction to enable account creation. Create a separate interaction with the same merchant and party context:

```ts
const addRequest = {
  ...selectRequest,
  features: ['ADD_ACCOUNT'],
};

const addInteraction = await createInteraction(addRequest);
```

Present the ADD_ACCOUNT interaction using the SDK’s default dialog mode:

```html
<commerce-hub-connect
  [presentationMode]="'dialog'"
  [interactionResponse]="addInteraction"
  (onAddPaymentMethod)="handleAddPaymentMethod($event)"
></commerce-hub-connect>
```

After `onAddPaymentMethod`:

1. Close the dialog.
2. Recreate or refresh the original SELECT interaction.
3. Assign the refreshed response to the embedded SDK.

The host may pre-create the ADD_ACCOUNT interaction in the background to reduce perceived dialog-launch latency.

## ADD_ACCOUNT-only interactions

Create an interaction containing only the add-account capability:

```json
{
  "features": ["ADD_ACCOUNT"]
}
```

Render it in embedded mode when adding a payment method is the page’s primary purpose:

```html
<div class="wallet-container">
  <commerce-hub-connect
    [presentationMode]="'embedded'"
    [interactionResponse]="addAccountInteraction"
    [designConfig]="designConfig"
    (onAddPaymentMethod)="handleAddPaymentMethod($event)"
  ></commerce-hub-connect>
</div>
```

The SDK presents the supported tender options defined by the interaction. After a payment method is created successfully, it emits `onAddPaymentMethod` with the created payment source.

```ts
handleAddPaymentMethod(event: CustomEvent<PaymentSource>): void {
  const createdSource = event.detail;
  // Update the host workflow or refresh its interaction state.
}
```

Use the standard embedded container height because ADD_ACCOUNT may open multi-step card, bank-account, verification, or required-information forms.

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
