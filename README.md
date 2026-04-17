# CommerceHub Connect Wallet SDK

This repository contains:

- `sdk/`: Angular 20 workspace plus browser SDK source and build pipeline
- `demo/`: framework-free HTML, CSS, and JavaScript demo page that consumes the built SDK artifact

## Hosted Checkout API Coverage

The SDK flow uses the localhost Swagger endpoints from:

- `session-controller`
- `interaction-controller`

Implemented endpoints:

- `POST /session/interaction/create`
- `POST /interaction/{interactionId}/otp/send`
- `POST /interaction/{interactionId}/otp/validate`
- `POST /interaction/{interactionId}/payment-source/{paymentSourceId}/attach`
- `GET /interaction/{interactionId}`
- `POST /session/interaction/pay`

## SDK Interaction Params

The SDK uses this interaction payload shape:

- `sessionReferenceId`: required
- `merchantTransactionId`: optional
- `merchantOrderId`: optional
- `merchantInvoiceNumber`: optional
- `authType`: required, `FINAL_SALE`
- `expiryMinutes`: optional
- `email`: required
- `allowedTenderTypes`: required array of `CARD`, `BANK_ACCOUNT`, `DYNAMIC_SESSION_CARD`

## Build

Build the Angular workspace and generate the embeddable browser SDK:

```bash
cd sdk
npm install
npm run build
```

This produces:

- `sdk/dist/commercehub-connect-sdk.js`
- `demo/commercehub-connect-sdk.js`

## Angular Library

Build the Angular SDK package:

```bash
cd sdk
npx ng build commercehub-hosted-checkout
```

The packaged output is written to `sdk/dist/commercehub-hosted-checkout`.

## Browser SDK

The iframe-based browser SDK source lives in:

- `sdk/browser-sdk/commercehub-connect-sdk.js`
- `sdk/scripts/build-browser-sdk.mjs`

Browser SDK contract:

- caller provides a container `div` id via `containerId`
- caller provides `apiBaseUrl` as either a same-origin proxy path such as `/api` or a backend origin such as `http://localhost:8080`
- SDK creates and manages its own iframe internally
- caller mounts with `sdk.mount()`

## Pure HTML Demo

The demo page is now outside the Angular workspace:

- `demo/index.html`
- `demo/app.js`
- `demo/commercehub-connect-sdk.js`
- `demo/server.js`

Run the demo through the local proxy server so browser requests stay same-origin:

```bash
node demo/server.js
```

Then open `http://127.0.0.1:4173`. The demo proxies `/api/*` to `http://localhost:8080` by default and avoids the CORS failure from direct browser calls to the backend.
When `apiBaseUrl` is cross-origin, the Angular SDK now routes requests through the local `/api` proxy automatically and forwards the backend origin in `x-demo-target-origin`.
