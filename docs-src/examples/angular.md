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
  InteractionResponse,
  OnSuccessEvent,
} from 'commerce-hub-connect-sdk';

@Component({
  selector: 'app-checkout-payment',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <commerce-hub-connect
      [baseURL]="baseUrl"
      [interactionResponse]="interactionResponse()"
      (onSuccess)="handleSuccess($event)"
    ></commerce-hub-connect>
  `,
})
export class CheckoutPaymentComponent {
  readonly interactionResponse = input.required<InteractionResponse>();
  readonly baseUrl: CommerceHubBaseURLInput = 'QA';
  selectedPaymentSourceId?: string;

  handleSuccess(event: Event) {
    const {detail: paymentSource} = event as OnSuccessEvent;
    this.selectedPaymentSourceId = paymentSource.id;
  }
}
{% endraw %}
```

Angular 22 components are standalone by default, so this example does not set
`standalone: true`. The component allows the custom element with
`CUSTOM_ELEMENTS_SCHEMA` and binds object values such as `interactionResponse`
through Angular property bindings rather than serializing them into HTML
attributes.
