# Commerce Hub Connect Wallet SDK

Angular 20 workspace containing:

- `projects/commerce-hub-connect-sdk`: reusable standalone SDK library
- `projects/commerce-hub-connect-web-sdk`: browser bundle that exposes `window.CommerceHubConnectWebSdk`
- `src/app`: Angular demo host application

## Features

- OTP-based interaction flow over the Commerce Hub APIs
- External interaction creation, with the created `InteractionResponse` passed into SDK initialization
- Card capture with validation, masking, and PCI-vault integration hooks
- Optional bank account capture and Pay By Bank support
- White-label theming through shared SDK configuration
- Framework-agnostic web bundle with `mount(target, options, environment?)`

## Run Locally

Install dependencies:

```bash
npm install
```

Start the Angular demo application with the local `/api` proxy:

```bash
npm start
```

## Build

Build the Angular demo application:

```bash
npm run build
```

Build the Angular SDK library:

```bash
npm run build:sdk
```

Build the embeddable web SDK bundle:

```bash
npm run build:web-sdk-widget
```

That command writes:

- `projects/commerce-hub-connect-web-sdk/dist/CommerceHubConnectSDK.js`
- `projects/commerce-hub-connect-web-sdk/dist/CommerceHubConnectSDK.d.ts`

## Optional Generator

Generate a low-level browser API client scaffold without the widget wrapper:

```bash
npm run generate:web-sdk-client
```

## Browser Integration

```html
<script src="/path/to/CommerceHubConnectSDK.js"></script>
<div id="wallet-sdk"></div>
<script>
  async function startWallet() {
    const createResponse = await fetch('/api/merchant/interaction/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        sessionReferenceId: 'merchant-session-001',
        merchantTransactionId: 'txn-10001',
        merchantOrderId: 'order-20002',
        merchantInvoiceNumber: 'invoice-30003',
        authType: 'FINAL_SALE',
        expiryMinutes: 10,
        email: 'merchant@example.com',
        allowedTenderTypes: ['CARD'],
        allowEmailChange: false,
        merchantData: {
          clientId: 'laika',
          merchantId: '100014000315473',
          terminalId: '10000001',
        },
        wallet: true,
      }),
    }).then((response) => response.json());

    await window.CommerceHubConnectWebSdk.mount(
      '#wallet-sdk',
      {
        interaction: createResponse,
        configuration: {
          email: 'merchant@example.com',
          wallet: true,
          onSuccess(result) {
            console.log(result);
          },
          onError(error) {
            console.error(error);
          },
        },
        whiteLabel: {
          primaryColor: '#0a5dff',
          secondaryColor: '#627d98',
        },
      },
      'prod',
    );
  }

  startWallet().catch((error) => console.error(error));
</script>
```

`environment` accepts `dev`, `qa`, `cat`, or `prod` and defaults to `prod` when omitted.

## Initialize Boundary

Parameters moved out of `CommerceHubSdkConfiguration` and into the external `interaction/create`
request because the SDK no longer uses them after creation:

- `sessionReferenceId`
- `merchantTransactionId`
- `merchantOrderId`
- `merchantInvoiceNumber`
- `authType`
- `expiryMinutes`
- `allowEmailChange`
- `allowedTenderTypes`
- `merchantData.clientId`
- `merchantData.merchantId`
- `merchantData.terminalId`

Parameters that remain in `CommerceHubSdkConfiguration` because the mounted SDK still uses them
after creation:

- `onSuccess`
- `onError`
- `email` for `otp/send` when the interaction response does not carry the raw address
- `paymentSelectionTitle`
- `paymentSelectionConfirmLabel`
- `wallet`
- `whiteLabel`
- `payByBank`

Previously exposed `region`, `language`, and `mountElementId` were not used by the current SDK
flow and are no longer part of the initialization contract.
