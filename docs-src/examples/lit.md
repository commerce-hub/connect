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
import 'commerce-hub-connect-sdk';
import type {
  InteractionResponse,
  OnAddPaymentMethodEvent,
  OnSelectEvent,
} from 'commerce-hub-connect-sdk';

class CheckoutPayment extends LitElement {
  interactionResponse?: InteractionResponse;

  render() {
    return html`<commerce-hub-connect
      .interactionResponse=${this.interactionResponse}
      .baseURL=${'QA'}
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
