# CommerceHub Connect Web SDK

CommerceHub Connect Web SDK provides the `<commerce-hub-connect>` custom
element for embedding CommerceHub payment-source flows in merchant checkout and
account experiences. The SDK is Lit-based, framework-agnostic, and exports
TypeScript types generated from the CommerceHub OpenAPI schema.

## Install

The package is currently private while the public NPM release is prepared. The
planned package name is the current package name:

```bash
npm install commerce-hub-connect-sdk
```

Import the module once in the page or bundle where you use the element:

```ts
import 'commerce-hub-connect-sdk';
```

Then render the custom element:

```html
<commerce-hub-connect></commerce-hub-connect>
```

## End-to-end integration

The host application owns CommerceHub authentication and the initial interaction
request. The SDK owns the browser widget once the host passes an
`InteractionResponse` to the element.

1. Your backend creates or retrieves a CommerceHub interaction for the shopper.
2. Your frontend receives the resulting `InteractionResponse`.
3. Your frontend mounts `<commerce-hub-connect>` and assigns
   `.interactionResponse`.
4. The SDK uses the host response as bootstrap data for `interactionId` and
   optional gateway OAuth, immediately calls `GET /interaction`, and renders
   payment methods from that server-fetched interaction state.
5. The SDK renders the current interaction step and performs SDK-managed calls
   with `interactionResponse.interactionId` as the `x-interaction-id` header,
   and with `Authorization: Bearer <token>` when
   `interactionResponse.oauth.access_token` is present.
6. The shopper completes the required flow, such as OTP, saved source
   selection, card entry, ACH entry, Pay by Bank, or additional verification.
7. The shopper chooses a verified source and explicitly confirms with **Use
   selected method**. The SDK then attaches it and emits `onSelect` with the
   selected `PaymentSource` in `event.detail`.
8. The SDK also emits success-only operation events for SDK-managed source
   listing, creation, verification, deletion, and native account transfers.
9. Your host completes the merchant interaction with
   `GET /merchant/interaction/{interactionId}/complete` and treats the
   merchant response as the completed source.

```ts
import 'commerce-hub-connect-sdk';
import type {
  DesignConfig,
  InteractionResponse,
  OnSelectEvent,
} from 'commerce-hub-connect-sdk';

const interactionResponse: InteractionResponse = await fetch(
  '/api/commercehub/interaction'
).then((response) => response.json());

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
  widget.addEventListener('onSelect', async (event: Event) => {
    const {detail: paymentSource} = event as OnSelectEvent;

    // Store or reference paymentSource in host-owned state as needed.

    const completedPaymentSource = await fetch(
      `/api/commercehub/interaction/${encodeURIComponent(
        interactionResponse.interactionId ?? ''
      )}/complete`,
      {method: 'GET'}
    ).then((response) => response.json());

    // Continue the host checkout flow with completedPaymentSource.
  });
}
```

Assign object-valued SDK inputs such as `.interactionResponse` and
`.designConfig` as DOM properties. Do not pass them as HTML attributes, because
attributes can only carry strings. The `base-url` attribute is available only
for the string `.baseURL` value.

## SDK-managed requests

When the widget performs CommerceHub calls, it uses the `PROD` preset by
default. Set `.baseURL` only when the host needs a different CommerceHub preset
or a custom origin. The `PROD` preset resolves to
`https://connect.fiservapis.com/chc`, the `DEV` preset resolves to
`https://connect-dev.fiservapis.com/chc`, and the `QA` preset resolves to the
QA non-production CommerceHub origin.

```ts
widget.baseURL = 'PROD';
widget.baseURL = 'QA';
widget.baseURL = 'https://api.example.com';
```

SDK-managed calls include OTP validation and resend, payment-source attach and
delete, card and ACH source creation with local sensitive-value encryption,
source verification, required-info upload, Pay by Bank session handling, and
native account balance lookup and transfer initiation.

The widget always sends `x-interaction-id` with
`interactionResponse.interactionId`. When
`interactionResponse.oauth.access_token` is present, it also sends
`Authorization: Bearer <token>`.

When a new `interactionResponse.interactionId` is assigned, the widget calls
`GET /interaction` before rendering saved or selected payment methods. Any
host-provided `paymentSources`, `selectedSource`, billing addresses, or status
fields are bootstrap data only; the SDK treats the server-fetched interaction as
the authoritative widget state. Gateway OAuth from the host response is
preserved when the server response omits it.

For `POST /interaction/source/card` and `POST /interaction/source/ach`, the
widget encrypts card, CVC, routing, and account-number values locally with
`interactionResponse.publicKey` using RSA-OAEP SHA-512. These source-create
calls also send `Api-Key` from `interactionResponse.oauth.client_id`,
`Auth-Token-Type` from `interactionResponse.oauth.token_type`, and `x-key-id`
from `interactionResponse.keyId`.

If `interactionResponse.interactionId` is missing, the widget keeps the current
screen stable and does not call the CommerceHub API.

If `interactionResponse` itself is missing, the widget renders a configuration
error and blocks shopper payment actions until the host assigns it.

## Events

`onSelect` remains the completion boundary for host-owned order or checkout
work. Its `event.detail` is the selected `PaymentSource`, and hosts should still
complete the merchant interaction from that event.

Changing the selected radio never performs a request. New and newly verified
sources emit their operation event, return to the method list as the draft
selection, and wait for explicit confirmation. This means `onSelect` is no
longer emitted automatically after source creation or verification.

The SDK also emits success-only operation events with raw operation results:

| Event                   | Detail                                                          |
| ----------------------- | --------------------------------------------------------------- |
| `onListPaymentMethods`  | `PaymentSource[]` from a successful `GET /interaction` refresh. |
| `onAddPaymentMethod`    | Created or finalized `PaymentSource`.                           |
| `onVerifyPaymentMethod` | Verified or updated `PaymentSource`.                            |
| `onDeletePaymentMethod` | Deleted payment source id.                                      |
| `onTransfer`            | `NativeAccountTransaction` returned by native account transfer. |

## Design configuration

Pass `.designConfig` to adjust merchant-safe colors, typography, spacing, copy,
and Pay by Bank provider settings. All fields are optional and omitted values
fall back to SDK defaults.

```ts
widget.designConfig = {
  colors: {
    primary: '#084acc',
    text: '#101828',
    border: '#cbd5e1',
    widgetBackground: '#ffffff',
    paymentMethodBackground: '#f8fafc',
  },
  baseFontSize: '16px',
  baseFontWeight: '400',
  shellPadding: '1.75rem 1.5rem 1.5rem',
  copy: {
    otp: {
      title: 'Confirm your email',
      verifyButton: 'Verify',
    },
    paymentMethods: {
      title: 'Choose payment method',
      continueButton: 'Use selected method',
    },
  },
};
```

`designConfig` remains the supported first choice for merchant theming. For
frameworks or host stylesheets that need additive hooks, the widget exposes
stable shadow parts: `shell`, `header`, `title`, `content`, `footer`,
`primary-action`, `alert`, `payment-method-row`, and `provider-frame`.

Supported CSS custom properties are the stable `designConfig` tokens:
`--chc-primary`, `--chc-text`, `--chc-copy`, `--chc-muted`,
`--chc-placeholder`, `--chc-surface`, `--chc-widget-background`,
`--chc-soft-surface`, `--chc-border`, `--chc-border-strong`,
`--chc-payment-method-background`, `--chc-success`, `--chc-success-bg`,
`--chc-success-border`, `--chc-danger`, `--chc-danger-bg`,
`--chc-danger-border`, `--chc-warning`, `--chc-warning-bg`,
`--chc-warning-border`, `--chc-disabled-text`, `--chc-disabled-surface`,
`--chc-font-weight`, and `--chc-shell-padding`.

```css
commerce-hub-connect::part(primary-action) {
  border-radius: 0.5rem;
}
```

Avoid styling internal shadow-DOM classes directly; those class names are not a
public API.

The `footer` part is the pinned screen-action region. `colors.widgetBorder`
controls the visible framed shell border.

## Framework integration

`<commerce-hub-connect>` is the only public custom element. Lit hosts should use
property bindings:

```ts
html`<commerce-hub-connect
  .interactionResponse=${interactionResponse}
  .designConfig=${designConfig}
  .baseURL=${'QA'}
  @onSelect=${handleSelect}
></commerce-hub-connect>`;
```

React hosts should assign SDK properties through a ref and subscribe with
`addEventListener`, because React attributes are string-oriented for custom
elements:

```tsx
useEffect(() => {
  const widget = widgetRef.current;

  if (!widget) {
    return;
  }

  widget.interactionResponse = interactionResponse;
  widget.designConfig = designConfig;
  widget.baseURL = 'QA';
}, [designConfig, interactionResponse]);

useEffect(() => {
  const widget = widgetRef.current;

  if (!widget) {
    return;
  }

  const handleSelect = (event: Event) => {
    const {detail: paymentSource} = event as OnSelectEvent;
    // Complete the merchant interaction from the React host.
  };

  widget.addEventListener('onSelect', handleSelect);

  return () => widget.removeEventListener('onSelect', handleSelect);
}, []);
```

Angular hosts should allow the custom element with `CUSTOM_ELEMENTS_SCHEMA` and
use property bindings for object values:

```html
<commerce-hub-connect
  [interactionResponse]="interactionResponse"
  [designConfig]="designConfig"
  [baseURL]="baseUrl"
  (onSelect)="handleSelect($event)"
></commerce-hub-connect>
```

## Typed API clients

The SDK exports typed `openapi-fetch` clients for service contracts. Use
`createCommerceHubClient` for widget/runtime interaction-service paths and
`createCommerceHubMerchantClient` for host-owned merchant-service paths. Use
`createCommerceHubConfigClient` for party configuration inquiry paths.

```ts
import {
  createCommerceHubConfigClient,
  createCommerceHubClient,
  createCommerceHubMerchantClient,
} from 'commerce-hub-connect-sdk';

const runtimeClient = createCommerceHubClient({
  baseURL: 'QA',
  getHeaders: async () => ({
    Authorization: `Bearer ${await loadCommerceHubToken()}`,
  }),
});

const merchantClient = createCommerceHubMerchantClient({baseURL: 'QA'});
const configClient = createCommerceHubConfigClient({baseURL: 'QA'});

const {data, error} = await runtimeClient.GET('/interaction');
const completed = await merchantClient.GET(
  '/merchant/interaction/{interactionId}/complete',
  {params: {path: {interactionId: data?.interactionId ?? ''}}}
);
const countries = await configClient.POST('/party/configuration-inquiry', {
  params: {
    header: {
      'Client-Id': 'client-1',
      'User-Id': 'user-1',
    },
  },
  body: {configurationType: 'COUNTRIES'},
});
```

Generated OpenAPI types live in `src/generated/openapi.ts` for runtime paths and
`src/generated/merchant-openapi.ts` for merchant paths. Party configuration
inquiry types live in `src/generated/config-openapi.ts`, generated from
`config-swagger.yaml` with the public client path normalized to
`/party/configuration-inquiry`. Regenerate all clients with
`npm run generate:client` after `swagger.json`, `merchant-swagger.json`, or
`config-swagger.yaml` changes. Runtime types are exported as `components`,
`operations`, and `paths`; merchant types are exported as `MerchantComponents`,
`MerchantOperations`, and `MerchantPaths`; config types are exported as
`ConfigComponents`, `ConfigOperations`, and `ConfigPaths`.

The public `InteractionResponse` type intentionally augments the generated
OpenAPI type with optional `oauth` data injected by the CommerceHub gateway.
Do not hand-edit `src/generated/openapi.ts` to add that field; preserve the
local augmentation in `src/commerce-hub-connect.ts` after client regeneration.

## Development

```bash
npm i
npm run build
npm test
npm run test:visual
```

Update the checked-in Chromium baselines intentionally with
`npm run test:visual:update`. If Playwright browsers are not installed locally,
set `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` to a compatible Chrome executable.

Run the local demo:

```bash
npm run serve
```

Then open `/dev/index.html`.
