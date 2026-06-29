---
layout: page.11ty.cjs
title: <commerce-hub-connect> | Install
---

# Install

```bash
npm install https://github.com/commerce-hub/connect/releases/download/v0.7.0/commerce-hub-connect-sdk-0.7.0.tgz
```

The package registers the `<commerce-hub-connect>` custom element when imported.

```ts
import 'commerce-hub-connect-sdk';
```

## Basic HTML

```html
<commerce-hub-connect></commerce-hub-connect>
```

## TypeScript

Use property assignment for complex values such as `interactionResponse` and
`designConfig`.

```ts
{% raw %}
import 'commerce-hub-connect-sdk';
import type {DesignConfig, InteractionResponse} from 'commerce-hub-connect-sdk';

const interactionResponse: InteractionResponse =
  await fetch('/api/commercehub/interaction').then((response) =>
    response.json()
  );
const designConfig: DesignConfig = {
  colors: {
    primary: '#084acc',
    text: '#101828',
    border: '#cbd5e1',
    widgetBackground: '#ffffff',
  },
};

const widget = document.querySelector('commerce-hub-connect');

if (widget) {
  widget.interactionResponse = interactionResponse;
  widget.designConfig = designConfig;
  widget.baseURL = 'QA';
}
{% endraw %}
```

The assigned `InteractionResponse` only bootstraps the widget with
`interactionId` and optional gateway OAuth. The SDK calls `GET /interaction`
when that id is assigned and renders saved or selected payment methods from the
server-fetched interaction state, not from host-provided `paymentSources`.

## Frameworks

The SDK is framework-agnostic. In React, Vue, Svelte, Angular, or Lit, import
the package once and pass complex values as DOM properties rather than HTML
attributes. This applies to `interactionResponse` and `designConfig`; object
values should not be serialized into markup.

See the [Lit example](../examples/lit/), [React example](../examples/react/),
[Angular 22 example](../examples/angular/), and
[plain JavaScript example](../examples/plain-javascript/) for components that
bind SDK properties and keep merchant completion host-owned after `onSelect`.

```ts
{% raw %}
widget.interactionResponse = interactionResponse;
widget.designConfig = designConfig;
{% endraw %}
```

Only `base-url` is available as a string attribute:

```html
<commerce-hub-connect base-url="QA"></commerce-hub-connect>
```

## Local development

```bash
npm i
npm run build
npm run serve
```

Open `/dev/index.html` for the local demo.
