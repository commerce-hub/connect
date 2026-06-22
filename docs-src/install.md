---
layout: page.11ty.cjs
title: <commerce-hub-connect> | Install
---

# Install

The SDK is being prepared for the public NPM registry. The current package name
is `commerce-hub-connect-sdk`.

```bash
npm install commerce-hub-connect-sdk
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
import type {InteractionResponse} from 'commerce-hub-connect-sdk';

const interactionResponse: InteractionResponse =
  await fetch('/api/commercehub/interaction').then((response) =>
    response.json()
  );

const widget = document.querySelector('commerce-hub-connect');

if (widget) {
  widget.interactionResponse = interactionResponse;
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
attributes.

See the [Angular 22 example](../examples/angular/) for a component that binds
SDK properties in the template and handles `onSelect`.

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
