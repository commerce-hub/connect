# CommerceHub Connect Web SDK

This package provides the CommerceHub Connect widget as a Lit-based web
component. The current implementation establishes the internal primitive
foundation from the Figma source of truth so future SDK flow work can compose a
single public `<commerce-hub-connect>` element.

## Current scope

- Public web component: `<commerce-hub-connect>`
- Typed CommerceHub API client generated from `swagger.json`
- Internal primitives for widget shell, buttons, fields, OTP inputs, alerts,
  status pills, payment method rows, source actions, detail rows, and form grids
- CSS custom property tokens for merchant-safe theming
- No payment flow state machine yet

## Development

Install dependencies:

```bash
npm i
```

Build the component:

```bash
npm run build
```

Regenerate the typed API client after `swagger.json` changes:

```bash
npm run generate:client
```

Run tests:

```bash
npm test
```

Start the local demo:

```bash
npm run serve
```

Then open `/dev/index.html`.

## API client

The SDK exports a typed `fetch` client for the CommerceHub OpenAPI surface.
Generated schema types live in `src/generated/openapi.ts`; do not edit that
file by hand.

```ts
import {createCommerceHubClient} from './commerce-hub-connect.js';

const client = createCommerceHubClient({
  baseUrl: 'https://api.example.com',
  headers: {Authorization: `Bearer ${token}`},
});

const {data, error} = await client.GET('/customer');
```

Pass an `InteractionResponse` into the component with a property binding when
the host app owns the API call:

```ts
import type {InteractionResponse} from './commerce-hub-connect.js';

const interactionResponse: InteractionResponse = await loadInteraction();

html`<commerce-hub-connect
  .interactionResponse=${interactionResponse}
></commerce-hub-connect>`;
```

## Theming

The widget ships with Figma-aligned defaults and can be themed by setting CSS
custom properties on the host element or an ancestor.

```css
commerce-hub-connect {
  --chc-primary: #084acc;
  --chc-text: #101828;
  --chc-border: #cbd5e1;
}
```
