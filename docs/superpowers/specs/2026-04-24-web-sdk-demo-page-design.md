# CommerceHub Connect Web SDK Demo Page Design

## Summary

Add a standalone rich sandbox page at `projects/commerce-hub-connect-web-sdk/example/index.html` that loads the built `../dist/CommerceHubConnectSDK.js` bundle and demonstrates the real browser API:

```js
window.CommerceHubConnectWebSdk.mount(target, options, environment?)
```

The page is intended to be a practical merchant-facing example and an internal verification harness for the browser bundle.

## Goals

- Provide a plain standalone HTML page with no framework dependency.
- Load the built web SDK bundle from `../dist/CommerceHubConnectSDK.js`.
- Offer a rich sandbox, not a minimal snippet.
- Let a user mount, update, destroy, and reset the widget from one page.
- Show the real `mount(...)` contract, including `environment` as the last parameter.
- Make the example easy to copy into external merchant environments.

## Non-Goals

- No Angular route or Angular-hosted demo for this page.
- No multi-file example split across separate JS and CSS assets.
- No attempt to cover every possible SDK field in the first version.
- No new framework or build pipeline just for the example page.

## Output Location

Create the source demo page at:

- `projects/commerce-hub-connect-web-sdk/example/index.html`

It will reference:

- `../dist/CommerceHubConnectSDK.js`

The page is source-only. It does not need its own separate copy step into `dist/`.

## Approach

Use a single self-contained HTML file with:

- markup for the sandbox interface
- inline CSS for layout and presentation
- inline JavaScript for form serialization, instance lifecycle, and event logging

This keeps the example portable, easy to inspect, and easy to copy into a merchant host page.

## Page Layout

The page will use a two-column desktop layout that collapses to a single column on smaller screens.

### Left column

The left column is the control panel and includes:

- SDK configuration inputs
- white-label inputs
- environment selector
- action buttons

### Right column

The right column is the live preview surface and includes:

- a visible mount container for the widget
- a callback and action log
- optional snippet output area for copy/paste

## Supported Controls

The initial sandbox will expose the most useful integration fields:

### Configuration

- `sessionReferenceId`
- `email`
- `authType`
- `wallet`
- `allowEmailChange`
- `allowedTenderTypes`
- `paymentSelectionTitle`
- `paymentSelectionConfirmLabel`

### White label

- `primaryColor`
- `secondaryColor`
- `textColor`
- `fontFamily`
- `logoUrl`

### Environment

- `dev`
- `qa`
- `cat`
- `prod`

Default selection:

- `prod`

## Actions

The page will provide these actions:

- `Mount`
- `Update`
- `Destroy`
- `Reset Defaults`
- `Copy Config`

### Action behavior

- `Mount` creates a new SDK instance using the current form values and environment.
- `Mount` replaces any previously mounted instance first.
- `Update` calls `instance.update(options, environment?)` on the active instance.
- `Destroy` removes the active instance and clears the live widget container.
- `Reset Defaults` restores the form to a known-good baseline and clears the log, but does not silently remount the widget.
- `Copy Config` generates a real `window.CommerceHubConnectWebSdk.mount(...)` snippet using the current form values.

### Button state

- `Update` is disabled until an instance exists.
- `Destroy` is disabled until an instance exists.
- `Mount`, `Reset Defaults`, and `Copy Config` remain available at all times.

## Data Serialization

The page script will serialize form values into:

```ts
{
  configuration: CommerceHubSdkConfiguration,
  whiteLabel?: CommerceHubWhiteLabelOptions,
}
```

Serialization rules:

- omit empty optional string fields
- omit `whiteLabel` fields that are blank
- omit `allowedTenderTypes` entries that are unchecked
- keep `environment` outside the options object as the last `mount(...)` argument

The generated snippet should stay clean and realistic by excluding empty optional fields.

## Instance Lifecycle

The page owns a single mutable SDK instance reference:

- `null` before mount
- set after successful `mount(...)`
- updated in place after `update(...)`
- reset to `null` after `destroy()`

The page should treat repeated `destroy()` attempts as a safe no-op from the user’s perspective and log that no active instance existed.

## Event Logging

The sandbox will log both SDK callbacks and page-level actions:

- `mount`
- `update`
- `destroy`
- `reset-defaults`
- `copy-config`
- `onSuccess`
- `onError`

Each entry should include:

- timestamp
- event name
- pretty-printed payload when available

The log helps both debugging and integration understanding.

## Default Values

The page should ship with working sample defaults so it can be used immediately after building the SDK bundle.

Recommended defaults:

- `sessionReferenceId`: a non-empty sample value such as `merchant-session-demo-001`
- `email`: `merchant@example.com`
- `authType`: `FINAL_SALE`
- `wallet`: enabled
- `allowEmailChange`: enabled
- `primaryColor`: `#0a5dff`
- `secondaryColor`: `#627d98`
- `textColor`: `#101828`
- `fontFamily`: `"Open Sans", sans-serif`
- `environment`: `prod`

## Error Handling

The sandbox must fail visibly and remain interactive.

Expected behaviors:

- If the bundle did not register `window.CommerceHubConnectWebSdk`, log a clear load error.
- If `mount()` throws, catch the error, log it, and keep the page usable.
- If `update()` throws, catch the error, log it, and preserve the current page state.
- If `destroy()` runs with no active instance, log that there was nothing to destroy.

Errors should be presented in the same log surface used for callbacks and actions.

## UX Direction

The page should feel intentionally designed rather than like a raw internal fixture:

- clear visual separation between controls and live widget
- readable spacing and typography
- obvious button hierarchy
- responsive behavior on mobile and desktop
- useful visual treatment for logs and generated snippet output

The page should still remain practical and implementation-focused rather than marketing-oriented.

## Verification

Primary verification is manual and workflow-based:

1. Build the bundle with `npm run build:web-sdk-widget`.
2. Open `projects/commerce-hub-connect-web-sdk/example/index.html`.
3. Confirm the page loads the bundle from `../dist/CommerceHubConnectSDK.js`.
4. Confirm `Mount` creates the widget successfully.
5. Confirm `Update` reuses the instance.
6. Confirm `Destroy` removes the widget.
7. Confirm `Reset Defaults` restores baseline values.
8. Confirm `Copy Config` generates a valid `mount(...)` snippet.
9. Confirm the page remains usable after load or runtime errors.

No new automated tests are required for the initial single-file example page. If the example later grows extracted helper logic, that logic should be tested separately at that time.

## Risks And Mitigations

- The example could drift from the real browser API.
  Mitigation: make the page call the real built namespace and real `mount(...)` signature directly.

- The page could become too large and hard to maintain.
  Mitigation: keep it single-file but split responsibilities clearly inside the script: defaults, serialization, lifecycle, logging, and snippet generation.

- The example could become misleading if it includes too many optional fields.
  Mitigation: include only the most useful integration controls in the first version and omit blank optional values from the generated snippet.
