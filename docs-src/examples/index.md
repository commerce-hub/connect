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
  widget.baseURL = 'QA';
}
{% endraw %}
```
