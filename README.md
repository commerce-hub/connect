# CommerceHub Connect Wallet SDK

Angular 20 workspace containing:

- `projects/commerce-hub-connect-sdk`: reusable standalone SDK library
- `src/app`: demo host application that embeds the SDK

## Features

- OTP-based interaction flow using `POST /session/interaction/create`, OTP send/validate, and payment-source attach APIs through an internal `/api` proxy
- Card capture with validation, masking, and a PCI vault placeholder service
- Manual bank-account capture
- Optional Pay By Bank / BankLink launcher using the integration values from `docs/PayByBank_SDK_Ingration.md`
- PrimeNG 20 themed with PrimeUIX tokens and Tailwind v4 global styling

## Run Locally

Install dependencies:

```bash
npm install
```

Start the demo app with the local proxy to `http://localhost:8080`:

```bash
npm start
```

## Build

Build the demo application:

```bash
npm run build
```

Build the SDK library package:

```bash
npm run build:sdk
```

## Example Usage

```html
<commerce-hub-connect-capture
  [configuration]="sdkConfiguration"
  [whiteLabel]="whiteLabel"
/>
```

The full demo usage lives in `src/app/app.component.ts`.
