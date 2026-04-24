# CommerceHubConnectSdk

Reusable Angular SDK library for the Commerce Hub wallet capture flow.

## Build

```bash
ng build commerce-hub-connect-sdk
```

## Styling

The library ships:

- `commerce-hub-connect-sdk/theme/commerce-hub-sdk.css`
- `provideCommerceHubSdkTheme()`
- `commerceHubSdkThemePreset`

Angular hosts should import the stylesheet and register the theme provider. Browser hosts should use the packaged web bundle in `projects/commerce-hub-connect-web-sdk`, which mounts the same capture component behind `window.CommerceHubConnectWebSdk`.

## Shared Environment Helpers

The library exports:

- `CommerceHubConnectEnvironment`
- `COMMERCE_HUB_CONNECT_ENVIRONMENTS`
- `COMMERCE_HUB_CONNECT_API_BASE_URL_BY_ENVIRONMENT`
- `normalizeCommerceHubConnectEnvironment()`
- `resolveCommerceHubConnectApiBaseUrl()`

These helpers keep Angular hosts and the browser bundle aligned on `dev | qa | cat | prod`, with `prod` as the default.

## Tests

```bash
ng test commerce-hub-connect-sdk
```
