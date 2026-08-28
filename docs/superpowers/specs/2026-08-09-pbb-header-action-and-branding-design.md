# PBB Header Action and Branding Design

## Goal

Improve the Pay by Bank (PBB) handoff screen by making its manual-entry fallback easier to find without competing with the provider flow, and make the embedded PBB SDK visually consistent with the wallet SDK.

## Header action

Move the existing **Connect another way** action from the bottom footer to the top-right of the **Connect your bank** header. Use the widget shell's existing `titleAction` slot so the action remains aligned with the title and back button.

Render the action with the shared secondary-button primitive. Apply a PBB-specific compact class that reduces its font size, minimum height, and horizontal padding while retaining the shared button's focus, hover, disabled, and accessibility behavior. Keep the action disabled while the PBB provider is loading, matching the current behavior. Remove the now-empty provider footer and the obsolete centered-footer styling.

On narrow screens, the title row remains a single flex row. The action may shrink only to its intrinsic label width; the title keeps its existing truncation and minimum-width behavior.

## PBB appearance mapping

Continue passing PBB styling through `PaymentSDK.init({ appearance: { branding } })`. Populate every branding field accepted by the wallet SDK's current PBB integration:

- `backgroundColor`
- `primaryColor`
- `primaryTextColor`
- `secondaryTextColor`
- `buttonColor`
- `buttonTextColor`
- `dangerColor`
- `successColor`
- `borderColor`
- `placeholderColor`
- `fontFamily`
- `borderRadius`

Resolve these values from the wallet's default design tokens, then replace the applicable color values with nonblank merchant `designConfig.colors` overrides. Use the same fallback relationships as the wallet UI: widget background before surface, copy before muted, and border before widget-border or border-background. PBB does not accept the wallet's base font size, font weight, spacing, or shell padding, so those values are not forwarded.

This mapping is deterministic and does not inspect runtime computed styles or arbitrary host CSS custom-property overrides.

## Behavior and error handling

The action continues to dispatch `add-ach-manually`. It must remain unavailable while the PBB launch is busy, preventing navigation during provider initialization. Existing PBB startup, cancellation, completion, and error behavior remain unchanged.

All appearance values are normalized as nonblank strings before being included. The SDK initialization still proceeds if a merchant omits design configuration because wallet defaults provide the complete branding payload.

## Testing

Update the PBB flow tests to verify:

- **Connect another way** is rendered in the header title-action area and no provider footer is present.
- The action uses the secondary and PBB compact button classes.
- The action is disabled while provider startup is loading.
- Clicking the enabled action continues into manual ACH entry.
- `PaymentSDK.init` receives every supported branding field with wallet defaults.
- Merchant color overrides replace their corresponding default branding values while unchanged fields retain wallet defaults.

Run the focused Chromium flow tests during development, followed by the full test and lint commands before completion.
