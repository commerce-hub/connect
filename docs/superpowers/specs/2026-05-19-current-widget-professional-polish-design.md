# Current Widget Professional Polish Design

## Summary

Polish the current embedded widget visual system using the approved `A5 left
icons + status icons` direction. Keep the existing widget structure, behavior,
and theming model intact. The primary design target is the saved payment
methods screen, with shared token refinements allowed where they improve the
professional baseline without changing flow architecture.

## Goals

- Make the current widget feel cleaner and more professional without
  introducing a new layout concept.
- Keep the existing payment-methods screen structure: title, edit action, saved
  source rows, add-source rows, and footer.
- Keep the current interaction model for selection, verification drilling, and
  add-source actions.
- Move brand chips to the left side of saved payment-source rows to stay closer
  to the current widget's familiar visual rhythm.
- Replace inline verification badges with a smaller trailing status treatment.
- Clean up add-source actions so they feel like utility rows rather than large
  stacked buttons.
- Preserve white-label flexibility through existing tokens and
  `designConfig`-driven overrides.

## Non-Goals

- No redesign of the overall payment-methods information architecture.
- No new enterprise dashboard, hero-card, deck, or featured-card treatments.
- No redesign of OTP, provider, outcome, or card-entry flows in this pass.
- No public API, `DesignConfig`, or generated-code changes.
- No interaction redesign for edit mode. Existing edit/delete behavior may be
  visually aligned to the new row geometry, but the behavior itself is not
  changing here.

## Approved Direction

Use the current widget layout with a cleaner, more restrained professional
surface treatment.

- Keep `Choose payment method` as a title-only header with the existing `Edit`
  action on the right.
- Keep the saved-payment-methods screen as a title-only header; do not add a
  subtitle/helper line.
- Remove the `Add payment method` section title entirely.
- Present saved payment sources as separate stacked surfaces rather than a
  grouped divided list.
- Use left-aligned brand chips for saved rows.
- Keep the selected row quieter than earlier concepts:
  subtle background, border, and shadow only.
- Remove the left blue selected-state border/accent stripe.
- Keep add-card and add-bank rows as separate stacked actions with a left plus
  icon and right chevron.
- Keep the footer, but quiet it further through lighter tone and spacing.

## Payment Source Row Structure

Saved payment-source rows should use this visual structure:

1. Left brand chip or payment icon.
2. Primary copy block with source title and secondary account/detail line.
3. Optional trailing status cluster for non-verified states.

The row remains one click target in normal mode. This spec does not add a
separate selection control, radio, or checkbox.

## Verification Status Treatment

Verification state should move out of the inline text-badge treatment and into
the trailing action area.

- `verified`
  No trailing status icon is shown.
- `under-review`
  Show an amber warning icon on the right.
- `require-info`
  Show an amber warning icon on the right.
- `not-verified`
  Show an amber warning icon on the right.
- `declined`
  Show a red warning icon on the right.

When a status icon is present, show a right chevron beside it. This indicates
that the row leads to more detail or a verification-related follow-up state.
Rows without a status icon do not show this chevron.

## Accessibility

The visual status treatment becomes icon-first, so semantic status text must
still exist for assistive technologies.

- Do not rely on color alone to communicate review or decline state.
- Status icons must expose equivalent accessible text through hidden text,
  `aria-label`, or another existing semantic hook.
- The row must remain keyboard-focusable and screen-reader-readable as a single
  actionable item.
- Selected-state visibility must come from more than the removed blue left
  border; border, fill, and focus treatment must still make selection obvious.

## Add Action Treatment

The add-source rows should remain in the same place and order, but read more
like lightweight utility actions than primary buttons.

- No section label above them.
- Left plus icon.
- Single line label.
- Right chevron.
- Light formal surface treatment that harmonizes with the saved rows without
  looking like an alert or selected state.

## Edit Mode Notes

Edit mode is not being redesigned from scratch, but any touched markup should
follow the same row geometry and left-icon placement.

- Keep the header-level `Edit` affordance and existing behavior.
- If delete controls appear in edit mode, they should occupy the same trailing
  action slot used by the status icon cluster in normal mode.
- Do not add extra structural chrome just for edit mode.

## White-Label Strategy

- Keep the change inside the existing widget token system.
- Continue honoring current font, color, spacing, and shell overrides.
- Do not introduce a required remote font or a branded visual identity.
- Reuse existing payment-brand assets; only their placement changes.
- Avoid adding new public theming fields unless implementation is blocked
  without them.

## Files

- `src/internal/styles.ts`
  Purpose: refresh row surfaces, left icon placement, trailing status cluster,
  add-row styling, and quieter selected state.
- `src/internal/primitives.ts`
  Purpose: adjust row markup order, render the trailing status-icon-plus-chevron
  cluster, enforce the title-only payment-methods header, and remove the
  add-actions section label.
- `src/internal/types.ts`
  Purpose: primitive option updates only if trailing-status rendering needs a
  small shape change.
- `src/commerce-hub-connect.ts`
  Purpose: status mapping or primitive call-site adjustments only if needed for
  the new trailing-state presentation.
- `src/test/commerce-hub-connect-flow_test.ts`
  Purpose: screen-level rendering assertions for source rows and add rows.
- `src/test/commerce-hub-connect-primitives_test.ts`
  Purpose: primitive structure assertions for left icon placement and trailing
  status rendering.

## Testing Strategy

- Use TDD for any markup or structure changes.
- Add or update focused tests for:
  - saved rows rendering brand chips on the left;
  - verified rows omitting the trailing status cluster;
  - under-review and declined rows rendering trailing status icons;
  - chevrons appearing only when a trailing status icon is present;
  - add rows rendering without the `Add payment method` section title.
- Re-run the focused widget tests touched by the changes.
- Run `npm run build` before calling the implementation complete.

## Risks And Guardrails

- Do not make the status treatment ambiguous by removing all readable semantics.
- Do not accidentally remove row clickability or keyboard support while
  reshuffling contents.
- Do not let add rows become visually stronger than saved rows.
- Do not reintroduce a concept-level redesign while implementing this polish.
- Do not widen scope into demo-shell or docs-shell restyling.
