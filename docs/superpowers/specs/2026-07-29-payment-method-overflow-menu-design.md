# Payment Method Overflow Menu Design

## Objective

Replace the payment-method list's header Edit action and SELECT footer action with a row-level overflow menu. Preserve the existing attach and delete behavior while making each action target an explicit payment source. Identify the interaction's current selected source with a `Default` label.

## Scope

This change applies to saved payment-method lists for these feature combinations:

- `SELECT` with `ADD_ACCOUNT`: each row menu contains `Mark as default` and `Edit`.
- `ADD_ACCOUNT` without `SELECT`: each row menu contains only `Edit`.

Transfer and add-account entry points remain unchanged. Empty-list, selected-source summary, verification, required-information, and source-creation flows retain their current behavior.

## Data Model and State

The component will replace list-wide `paymentSourceEditMode` state with two row-scoped source IDs:

- the payment source whose overflow menu is open;
- the payment source whose existing delete control is visible.

At most one menu and one row-level edit control may be active. Opening a menu closes any other menu. Choosing `Edit` closes the menu and reveals the existing delete control only on that row. Canceling or completing deletion clears the row edit state.

The API does not expose `isDefault` or another persistent-wallet-default field. `InteractionResponse.selectedSource` is the available authoritative indicator for the payment method attached to the current interaction. The mapping layer will compare `selectedSource.id` with each `paymentSources[].id` and mark the matching payment-method model as the default.

## Rendering and Interaction

Every saved payment-method row receives an accessible button at its right edge using the supplied Font Awesome vertical-ellipsis SVG path and license comment. The SVG will be embedded in the Lit template so the SDK has no runtime dependency on a local file URL.

The ellipsis button uses an accessible name containing the payment-method label. Its popup menu is associated through ARIA attributes. Only one popup is visible at a time. Clicking outside the active menu or pressing Escape closes it and restores focus to its trigger when appropriate.

For interactions with `SELECT`, `Mark as default` passes that row's source ID directly to the existing `attachPaymentSource` flow. It does not depend on a separate radio selection. The action is disabled for an already-default or non-verified source because the former is a no-op and the previous selection flow allowed attachment only for verified sources. A successful response updates `interactionResponse.selectedSource`, so the `Default` label moves to the returned selected source. Existing attach errors remain visible on the list, and all row actions are disabled while an attach, verification, or deletion request is pending.

`Edit` exposes the existing delete button and confirmation UI on only the chosen row. It does not open a payment-source details form and does not expose delete controls for the other rows.

The compact `Default` label appears beside the payment-method title when its ID matches `interactionResponse.selectedSource.id`. The label describes selection for the current interaction; it does not claim a separate persistent wallet preference.

## Removed UI

- Remove the header/title `Edit` and `Done` actions from the saved-method list.
- Remove the `Use selected method` footer action for `SELECT` interactions.
- Remove radio controls and selected-row styling that existed only to stage the footer attach action.

The `ADD_ACCOUNT`-only footer buttons for adding a card or bank account remain unchanged.

## Error and Pending States

The existing attach API, response merge, `onSelect` event, delete API, delete confirmation, and operation events remain the source of truth. A failed attach leaves the current `Default` label unchanged and renders the existing attachment error on the list. Pending operations disable overflow triggers and menu actions to prevent duplicate requests.

If `selectedSource` is absent or its ID does not match a listed source, no row receives the `Default` label. If `paymentSources` is absent and the component falls back to rendering `selectedSource`, that single row is labeled `Default`.

## Testing

Browser tests will cover:

- ellipsis buttons on every saved row and the absence of header Edit/Done controls;
- absence of the SELECT footer button and radio controls;
- `Mark as default` only when `SELECT` is enabled;
- direct attachment of the clicked row and preservation of attach error behavior;
- `Edit` revealing delete controls for only its row;
- menu dismissal, one-menu-at-a-time behavior, accessible names, and Escape handling;
- the `Default` label derived from `selectedSource.id`, including no-match and fallback cases;
- preservation of `ADD_ACCOUNT`-only add buttons.

The focused browser test file will be run during development, followed by lint, the full test suite, and the TypeScript build.
