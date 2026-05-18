# Payment List Redesign Design

## Summary

Update the saved payment methods screen so it matches the provided reference:
compact radio-select rows, card-brand logo chips from the `flat-rounded` icon
set, link-style add actions, `Pay with` as the default title, and `Confirm` as
the primary CTA.

## Goals

- Match the payment-list page visual hierarchy from the reference image.
- Keep the implementation self-contained inside the SDK with no runtime asset
  fetching.
- Preserve white-label ability through the existing `designConfig.copy` API.
- Continue to support bank and card saved payment sources in one shared list.

## Non-Goals

- No redesign of OTP, bank-provider, or no-saved-payment-methods screens.
- No new runtime dependency or SVG asset pipeline.
- No change to payment-source selection or attach action behavior.

## Approach

- Change the saved payment methods screen defaults only:
  `Pay with`, no default subtitle, `Confirm`, add-card before add-bank, and no
  header divider.
- Keep `designConfig.copy.paymentMethods` override support. If a caller
  provides a subtitle or alternate action labels, those values still render.
- Replace the current payment row layout with a three-part structure:
  radio control, circular icon chip, and stacked copy. Verified rows render two
  lines; non-verified rows render a status line as a third line.
- Vendor a minimal `flat-rounded` SVG subset into a TypeScript helper and map
  normalized network names like `visa`, `mastercard`, `amex`, `discover`,
  `jcb`, and `maestro` to those assets, with `generic` as fallback.
- Keep bank rows on the same primitive, but render a bank icon chip instead of
  a chevron so cards and banks share one selection pattern.
- Render the add-card and add-bank actions as plus-prefixed link actions on the
  saved payment methods page while leaving the no-saved page on the existing
  card-style source actions.

## Files

- `src/commerce-hub-connect.ts`
  Purpose: payment-list screen defaults, order, and source-action variant usage.
- `src/internal/primitives.ts`
  Purpose: payment method row markup and link-style source action variant.
- `src/internal/styles.ts`
  Purpose: payment row, icon chip, radio, and link-action styling.
- `src/internal/types.ts`
  Purpose: primitive option type updates for new icon/variant support.
- `src/internal/payment-method-icons.ts`
  Purpose: vendored SVG map and payment-method icon resolution helpers.
- `src/test/commerce-hub-connect-primitives_test.ts`
  Purpose: primitive regression coverage for payment rows and icon rendering.
- `src/test/commerce-hub-connect-flow_test.ts`
  Purpose: flow-level regression coverage for screen defaults and action order.

## Testing Strategy

Drive the redesign from focused primitive and flow tests first.

- Update primitive tests to assert the new payment row structure:
  card logo chip, masked account copy, no chevron, and pending-status support.
- Update flow tests to assert `Pay with`, no default subtitle, no divider,
  add-card before add-bank, link-style action controls, and `Confirm`.
- After the tests fail for the right reasons, implement the minimal primitive,
  style, and copy changes to make them pass.
