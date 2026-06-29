---
layout: example.11ty.cjs
title: <commerce-hub-connect> | Examples | Lit
tags: example
name: Lit
description: Bind SDK properties from a Lit host component
---

<h3>Lit template</h3>

```ts
{% raw %}
import {html, LitElement} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import 'commerce-hub-connect-sdk';
import type {
  CommerceHubBaseURLInput,
  DesignConfig,
  InteractionResponse,
  OnAddPaymentMethodEvent,
  OnSelectEvent,
} from 'commerce-hub-connect-sdk';

@customElement('checkout-payment')
class CheckoutPayment extends LitElement {
  @property({attribute: false})
  interactionResponse?: InteractionResponse;

  @property({attribute: false})
  designConfig?: DesignConfig;

  @property({attribute: 'base-url'})
  baseURL: CommerceHubBaseURLInput = 'QA';

  render() {
    return html`<commerce-hub-connect
      .interactionResponse=${this.interactionResponse}
      .designConfig=${this.designConfig}
      .baseURL=${this.baseURL}
      @onAddPaymentMethod=${this.handlePaymentMethodAdded}
      @onSelect=${this.handleSelect}
    ></commerce-hub-connect>`;
  }

  private handlePaymentMethodAdded(event: OnAddPaymentMethodEvent) {
    this.dispatchEvent(
      new CustomEvent('payment-method-added', {detail: event.detail})
    );
  }

  private async handleSelect(event: OnSelectEvent) {
    const completedPaymentSource = await fetch(
      `/api/commercehub/interaction/${encodeURIComponent(
        this.interactionResponse?.interactionId ?? ''
      )}/complete`,
      {method: 'GET'}
    ).then((response) => response.json());

    this.dispatchEvent(
      new CustomEvent('payment-source-selected', {
        detail: {
          selectedPaymentSource: event.detail,
          completedPaymentSource,
        },
      })
    );
  }
}
{% endraw %}
```

Lit hosts should pass object-valued SDK inputs with property bindings such as
`.interactionResponse=${...}` and `.designConfig=${...}`. Keep `onSelect` as
the widget boundary: the event detail is the selected `PaymentSource`, and the
host owns the merchant completion call and any checkout state updates.
