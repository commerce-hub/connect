---
layout: example.11ty.cjs
title: <commerce-hub-connect> | Examples | Basic
tags: example
name: Basic
description: Render the widget and assign an InteractionResponse
---

<commerce-hub-connect></commerce-hub-connect>

<h3>HTML</h3>

```html
<commerce-hub-connect></commerce-hub-connect>
```

<h3>JavaScript</h3>

```ts
{% raw %}
import 'commerce-hub-connect-sdk';

const widget = document.querySelector('commerce-hub-connect');

if (widget) {
  widget.interactionResponse = await fetch('/api/commercehub/interaction').then(
    (response) => response.json()
  );
  widget.designConfig = {
    colors: {
      primary: '#084acc',
      text: '#101828',
      border: '#cbd5e1',
      widgetBackground: '#ffffff',
    },
  };
  widget.baseURL = 'QA';
  widget.addEventListener('onSelect', async (event) => {
    const selectedPaymentSource = event.detail;
    const completedPaymentSource = await fetch(
      `/api/commercehub/interaction/${encodeURIComponent(
        widget.interactionResponse.interactionId
      )}/complete`,
      {method: 'GET'}
    ).then((response) => response.json());

    // Store or reference selectedPaymentSource in host-owned state as needed.
    // Continue the host checkout flow with completedPaymentSource.
  });
}
{% endraw %}
```

Assign object-valued inputs such as `interactionResponse` and `designConfig` as
DOM properties. `base-url` is the string attribute form of `.baseURL`. Keep
merchant completion host-owned after `onSelect`.
