# Commerce Hub Connect Wallet SDK

Angular 20 workspace containing:

- `projects/commerce-hub-connect-sdk`: reusable standalone SDK library
- `projects/commerce-hub-connect-web-sdk`: browser bundle that exposes `window.CommerceHubConnectWebSdk`
- `src/app`: Angular demo host application

## Features

- OTP-based interaction flow over the Commerce Hub APIs
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
  window.CommerceHubConnectWebSdk.mount(
    '#wallet-sdk',
    {
      configuration: {
        sessionReferenceId: 'merchant-session-001',
        authType: 'FINAL_SALE',
        email: 'merchant@example.com',
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
</script>
```

`environment` accepts `dev`, `qa`, `cat`, or `prod` and defaults to `prod` when omitted.
