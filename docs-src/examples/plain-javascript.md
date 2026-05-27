---
layout: example.11ty.cjs
title: <commerce-hub-connect> | Examples | Plain JavaScript
tags: example
name: Plain JavaScript
description: Create and mount the widget imperatively
---

<h3>Imperative mount</h3>

```ts
{% raw %}
import 'commerce-hub-connect-sdk';

const host = document.querySelector('#commerce-hub-widget-host');
const widget = document.createElement('commerce-hub-connect');

widget.baseURL = 'QA';
widget.interactionResponse = await fetch('/api/commercehub/interaction', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({orderId: 'order-123'}),
}).then((response) => response.json());

widget.addEventListener('onSuccess', (event) => {
  const paymentSource = event.detail;

  fetch('/api/orders/order-123/payment-source', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({paymentSourceId: paymentSource.id}),
  });
});

host?.replaceChildren(widget);
{% endraw %}
```

```html
<div id="commerce-hub-widget-host"></div>
```
