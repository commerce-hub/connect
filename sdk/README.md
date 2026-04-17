# CommerceHub Connect Hosted Checkout SDK

Angular 20 SDK workspace containing:

- `commercehub-hosted-checkout`: reusable hosted checkout SDK library
- `browser-sdk/commercehub-connect-sdk.js`: generated single-file browser SDK with the Angular iframe app embedded inside it
- `browser-sdk-frame/`: Angular application used at build time and inlined into the browser SDK output
- `../demo`: plain HTML launcher page for the browser SDK

## Stack

- Angular 20
- PrimeNG 20
- Tailwind CSS 4

## Development

```bash
npm install
npm start
```

`npm start` runs the hosted checkout library build in watch mode.

Build the library package with:

```bash
npm run build
```

`npm run build` also builds the Angular iframe app, inlines it into `browser-sdk/commercehub-connect-sdk.js`, and copies that single distributable file to `../demo`.

## SDK usage

Browser SDK:

```html
<div id="checkout-root"></div>
<script src="./commercehub-connect-sdk.js"></script>
<script>
  const sdk = new window.CommerceHubConnectSdk({
    containerId: 'checkout-root',
    apiBaseUrl: '/api',
    launchRequest: {
      interaction: {
        sessionReferenceId: 'string',
        merchantTransactionId: 'string',
        merchantOrderId: 'string',
        merchantInvoiceNumber: 'string',
        authType: 'FINAL_SALE',
        expiryMinutes: 30,
        email: 'buyer@example.com',
        allowedTenderTypes: ['CARD', 'BANK_ACCOUNT', 'DYNAMIC_SESSION_CARD'],
      },
      payment: {
        amount: 149.99,
        currency: 'USD',
        callToAction: 'Pay with CommerceHub Connect',
      },
    },
    branding,
  });

sdk.mount();
</script>
```

The browser SDK output is a single JavaScript file. It creates its own iframe document from embedded Angular build artifacts, so merchants do not need to host `index.html`, `main.js`, `polyfills.js`, or any sidecar frame assets next to the SDK file.

Interaction params expected by the SDK:

- `sessionReferenceId`: required
- `merchantTransactionId`: optional
- `merchantOrderId`: optional
- `merchantInvoiceNumber`: optional
- `authType`: required, must be `FINAL_SALE`
- `expiryMinutes`: optional
- `email`: required
- `allowedTenderTypes`: required, use `CARD`, `BANK_ACCOUNT`, `DYNAMIC_SESSION_CARD`

Angular library:

```html
<ch-hosted-checkout
  [apiBaseUrl]="'http://localhost:8080'"
  [launchRequest]="launchRequest"
  [branding]="branding"
  (checkoutReady)="onCheckoutReady($event)"
  (completed)="onCompleted($event)"
/>
```

The library wraps these hosted checkout endpoints:

- `POST /session/interaction/create`
- `POST /interaction/{interactionId}/otp/send`
- `POST /interaction/{interactionId}/otp/validate`
- `POST /interaction/{interactionId}/payment-source/{paymentSourceId}/attach`
- `GET /interaction/{interactionId}`
- `POST /session/interaction/pay`
