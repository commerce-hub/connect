---
layout: example.11ty.cjs
title: <commerce-hub-connect> | Examples | Angular 22
tags: example
name: Angular 22
description: Bind SDK properties from an Angular 22 component
---

<h3>Angular 22 component</h3>

```ts
{% raw %}
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  input,
} from '@angular/core';
import 'commerce-hub-connect-sdk';
import type {
  CommerceHubBaseURLInput,
  DesignConfig,
  InteractionResponse,
  OnSelectEvent,
  OnTransferEvent,
} from 'commerce-hub-connect-sdk';

@Component({
  selector: 'app-checkout-payment',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <commerce-hub-connect
      [presentationMode]="'embedded'"
      [baseURL]="baseUrl"
      [interactionResponse]="interactionResponse()"
      [designConfig]="designConfig()"
      (onSelect)="handleSelect($event)"
      (onTransfer)="handleTransfer($event)"
    ></commerce-hub-connect>
  `,
})
export class CheckoutPaymentComponent {
  readonly interactionResponse = input.required<InteractionResponse>();
  readonly designConfig = input<DesignConfig>();
  readonly baseUrl: CommerceHubBaseURLInput = 'QA';
  selectedPaymentSourceId?: string;
  completedPaymentSourceId?: string;
  lastTransferId?: string;

  async handleSelect(event: Event) {
    const {detail: paymentSource} = event as OnSelectEvent;
    const completedPaymentSource = await fetch(
      `/api/commercehub/interaction/${encodeURIComponent(
        this.interactionResponse().interactionId ?? ''
      )}/complete`,
      {method: 'GET'}
    ).then((response) => response.json());

    this.selectedPaymentSourceId = paymentSource.id;
    this.completedPaymentSourceId = completedPaymentSource.id;
  }

  handleTransfer(event: Event) {
    const {detail: transaction} = event as OnTransferEvent;
    this.lastTransferId = transaction.id;
  }
}
{% endraw %}
```

Angular 22 components are standalone by default, so this example does not set
`standalone: true`. The component allows the custom element with
`CUSTOM_ELEMENTS_SCHEMA` and binds object values such as `interactionResponse`
and `designConfig` through Angular property bindings rather than serializing
them into HTML attributes. Keep `onSelect` as the widget boundary and complete
the merchant interaction from the Angular host.

The embedded wallet fills its parent width. Give the element and its wrapper a
definite height only when the wallet should scroll within a bounded host;
otherwise it grows naturally with the page.
