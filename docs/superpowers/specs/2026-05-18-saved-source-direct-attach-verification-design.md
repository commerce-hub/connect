# Saved Source Direct Attach And Verification Design

## Summary

Change the saved payment source flow so verified sources attach immediately on
row click, unverified sources expose a chevron action that starts
`/interaction/verify/step1`, and the widget no longer uses the
`confirm-payment-source` button, radio selection controls, or the selected
payment review screen.

## Goals

- Remove the extra confirmation step for verified saved payment sources.
- Attach verified saved sources immediately when the user clicks the row.
- Route unverified saved sources through the existing
  `/interaction/verify/step1` endpoint from a dedicated chevron action.
- Remove radio controls from the saved-source list and selected-review UI.
- Remove selected-state styling and the selected-payment-source review mode.
- Show a verification outcome screen after `verify/step1` for saved sources.

## Non-Goals

- No change to OTP validation behavior.
- No change to add-card or add-bank-account entry actions.
- No change to API shapes or generated OpenAPI types.
- No change to host white-label configuration APIs.

## Approved Direction

Use direct actions instead of selection state.

- Verified saved source row click calls the existing attach flow immediately.
- Unverified saved source rows do not attach on row click.
- Unverified saved source rows show a right chevron affordance.
- Clicking the chevron calls `/interaction/verify/step1` with the saved source
  id.
- The response routes the widget into a generic saved-source verification
  outcome screen with states for verified, pending review, more information
  required, declined, or failed.
- The old confirm button, selected-review screen, and change action are removed.

## White-Label Strategy

- Keep all visual changes inside the existing widget token system.
- Reuse current text, color, spacing, and shell overrides.
- Do not add required new public `DesignConfig` fields.
- Keep the new chevron and verification outcome surfaces styled via the current
  CSS custom property model.

## Files

- `src/commerce-hub-connect.ts`
  Purpose: remove confirm/select flow, attach verified sources immediately,
  start verification for unverified sources, and route into a generic saved
  source verification outcome screen.
- `src/internal/primitives.ts`
  Purpose: remove radio controls from payment rows, add a chevron action for
  unverified rows, and remove selected-review-specific row rendering.
- `src/internal/types.ts`
  Purpose: update primitive option types for the new saved-source row actions.
- `src/internal/styles.ts`
  Purpose: remove radio/selected-state styling and add chevron affordance and
  saved-source verification outcome styling.
- `src/test/commerce-hub-connect-flow_test.ts`
  Purpose: drive the new attach-and-verify behavior from flow tests.
- `src/test/commerce-hub-connect-payment-selection_test.ts`
  Purpose: replace confirm/selected-review tests with direct attach and
  verification-path tests.
- `src/test/commerce-hub-connect-primitives_test.ts`
  Purpose: update primitive assertions for row structure without radios and with
  chevron actions.

## Testing Strategy

- Write failing tests first for:
  verified row click attaching immediately, no confirm button, no radios, no
  selected-review layout, and unverified chevron verification routing.
- Verify failures are caused by the old selection-based behavior.
- Implement the minimal behavior and primitive changes to satisfy the new flow.
- Re-run focused widget tests plus `npm run build` before calling the work
  complete.

## Risks And Guardrails

- Do not accidentally attach unverified sources when the row itself is clicked.
- Do not leave stale selected-state logic behind in the render path.
- Do not regress the existing saved-source add-card/add-bank actions.
- Keep success event emission aligned with actual verified source attachment,
  not with intermediate selection.
