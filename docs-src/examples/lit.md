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
  OnSuccessEvent,
} from 'commerce-hub-connect-sdk';

class CheckoutPayment extends LitElement {
  interactionResponse?: InteractionResponse;

  render() {
    return html`<commerce-hub-connect
      .interactionResponse=${this.interactionResponse}
      .baseURL=${'QA'}
      @onSuccess=${this.handleSuccess}
    ></commerce-hub-connect>`;
  }

  private handleSuccess(event: OnSuccessEvent) {
    this.dispatchEvent(
      new CustomEvent('payment-source-selected', {detail: event.detail})
    );
  }
}
{% endraw %}
```
