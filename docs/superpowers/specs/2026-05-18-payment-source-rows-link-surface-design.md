# Payment Source Rows Link Surface Design

## Summary

Align saved payment source rows with the same `source-action-link` visual
language used by the add-card and add-bank-account actions, while preserving
the existing row-specific selection behavior, accessibility semantics, and
interaction flow.

## Goals

- Make saved payment source rows feel visually consistent with the add-card and
  add-bank-account link actions.
- Keep the existing payment-row content structure: icon chip, payment copy, and
  trailing selection control.
- Preserve the stronger selected-state affordance so selected saved sources are
  still distinct from plain add actions.
- Keep behavior unchanged for click selection, disabled states, and confirmation
  flow.

## Non-Goals

- No change to payment source selection logic or event flow.
- No change to button copy, action ordering, or API behavior.
- No redesign of the add-card/add-bank row contents beyond using them as the
  visual reference.
- No public API changes to `DesignConfig` or white-label overrides.

## Approved Direction

Use full primitive convergence at the surface level.

- Saved payment source rows should use the same surface treatment as
  `.source-action-link`: matching soft background, border, radius, padding, and
  hover/focus behavior.
- The payment rows should keep their payment-specific contents and trailing
  radio/check control.
- Selected rows should remain visually stronger than unselected rows through a
  clearer border/ring treatment.
- The standalone selected-payment-source block should share the same aligned
  surface styling so the list and selected summary remain consistent.

## White-Label Strategy

- Keep this change entirely within the existing widget token system.
- Continue to respect existing color, font, spacing, and shell overrides.
- Do not introduce new required public theming fields.
- Reuse current CSS custom properties so host theming still drives the final
  result.

## Files

- `src/internal/styles.ts`
  Purpose: align payment row surfaces to the `source-action-link` treatment.
- `src/test/commerce-hub-connect-flow_test.ts`
  Purpose: update focused screen assertions for the row/action visual
  consistency.
- `src/test/commerce-hub-connect-primitives_test.ts`
  Purpose: update primitive-level assertions if shared row metrics change.

## Testing Strategy

- Write the focused failing test first against the payment-source screen.
- Verify the failure is caused by the current row/action visual mismatch.
- Implement the smallest style change necessary in shared styles.
- Re-run the focused widget tests and `npm run build` before calling the change
  complete.
