# Payment Method Overflow Menu Design

## Objective

Replace the payment-method list's header Edit action and SELECT confirmation action with a row-level overflow menu. Preserve the existing attach and delete behavior while making each action target an explicit payment source. Identify the interaction's current selected source with a `Default` label.

## Scope

This change applies to saved payment-method lists for these feature combinations:

- `SELECT` with `ADD_ACCOUNT`: verified, non-default row menus contain `Mark as default` and `Edit`; all other row menus contain only `Edit`.
- `ADD_ACCOUNT` without `SELECT`: each row menu contains only `Edit`.

For both feature combinations, saved-method lists use the same explicit footer actions for the allowed tender types: `Add card` and/or `Add bank account`. The combined `SELECT` with `ADD_ACCOUNT` flow no longer uses the single header `Add` launcher. Transfer, empty-list, selected-source summary, verification, required-information, and source-creation flows retain their current behavior.

## Data Model and State

The component will replace list-wide `paymentSourceEditMode` state with two row-scoped source IDs:

- the payment source whose overflow menu is open;
- the payment source whose existing delete control is visible.

At most one menu and one row-level edit control may be active. Opening a menu closes any other menu. Choosing `Edit` closes the menu, reveals the existing delete control only on that row, and adds a `Done` action to the top-right of the same header row as the heading. Choosing `Done`, canceling deletion, or completing deletion clears the row edit state and any active delete confirmation.

The API does not expose `isDefault` or another persistent-wallet-default field. `InteractionResponse.selectedSource` is the available authoritative indicator, but the SDK also uses that field for verified preselection before explicit attachment. The mapping layer therefore marks a matching `selectedSource.id` as default only when the interaction status is `PAYMENT_SOURCE_ATTACHED`. In ready states, a verified matching source remains a preselection: it has no `Default` badge and remains eligible for `Mark as default`.

## Rendering and Interaction

Every saved payment-method row receives an accessible button at its right edge using the supplied Font Awesome vertical-ellipsis SVG path and license comment. The SVG will be embedded in the Lit template so the SDK has no runtime dependency on a local file URL.

The ellipsis button uses an accessible name containing the payment-method label. Its popup menu is associated through ARIA attributes. Only one popup is visible at a time. Clicking outside the active menu or pressing Escape closes it and restores focus to its trigger when appropriate.

For interactions with `SELECT`, `Mark as default` passes that row's source ID directly to the existing `attachPaymentSource` flow. It does not depend on a separate radio selection. The option is rendered only when the payment method is verified and is not already the interaction's default. Verified default rows and every non-verified status show only `Edit` in the overflow menu. A successful response updates `interactionResponse.selectedSource`, so the `Default` label moves to the returned selected source. During the attach request, the existing full-widget `Saving payment method` loading overlay is displayed. Existing attach errors remain visible on the list, and all row actions are disabled while an attach, verification, or deletion request is pending.

`Edit` exposes the existing delete button and confirmation UI on only the chosen row. It does not open a payment-source details form and does not expose delete controls for the other rows. While that row is being edited, the header shows `Done` through the shell's title-action slot so it is vertically aligned with the heading and anchored at the top right. `Done` uses the existing secondary text-link-button theme. The Transfer toolbar retains its existing header-action layout. Outside row edit mode, the header does not show either `Edit` or `Done`.

Whenever `ADD_ACCOUNT` is enabled and saved methods are present, the footer renders the existing explicit add buttons for the allowed tender types. When both card and bank account are allowed, both `Add card` and `Add bank account` are visible. This behavior is identical whether or not `SELECT` is also enabled. The combined flow does not render the single header `Add` launcher.

The `Default` label appears in the row's right-side action cluster immediately before the overflow button when its ID matches `interactionResponse.selectedSource.id`. It is visually separate from verification badges such as `Ready`, uses a larger minimum height and font size than the current compact label, and uses a semibold weight. The label describes selection for the current interaction; it does not claim a separate persistent wallet preference.

Existing non-verified navigation remains unchanged. A row with `REQUIRE_INFO` opens the required-information screen through its main row action. A row with `NOT_VERIFIED` starts the saved-source verification flow and navigates according to the response. `UNDER_REVIEW` and `DECLINED` rows remain inert. These row behaviors are independent from the overflow menu, whose `Edit` option remains available for every status.

## Removed UI

- Remove the header/title `Edit` action from the saved-method list. Restore the header `Done` action only while a row's existing delete UI is visible.
- Remove the `Use selected method` footer action for `SELECT` interactions.
- Remove radio controls and selected-row styling that existed only to stage the footer attach action.

The footer buttons for adding a card or bank account apply to both `ADD_ACCOUNT`-only and combined `SELECT` with `ADD_ACCOUNT` lists.

## Error and Pending States

The existing attach API, response merge, `onSelect` event, delete API, delete confirmation, and operation events remain the source of truth. A failed attach leaves the current `Default` label unchanged and renders the existing attachment error on the list. Pending operations disable overflow triggers and menu actions to prevent duplicate requests.

If `selectedSource` is absent, its ID does not match a listed source, or the interaction has not reached `PAYMENT_SOURCE_ATTACHED`, no row receives the `Default` label. If `paymentSources` is absent and the component falls back to rendering an attached `selectedSource`, that single row is labeled `Default`.

## Testing

Browser tests will cover:

- ellipsis buttons on every saved row, absence of the header Edit control, and conditional header Done behavior;
- absence of the SELECT footer button and radio controls;
- `Mark as default` only when `SELECT` is enabled;
- `Mark as default` only for verified, non-default rows, with default and non-verified menus containing only `Edit`;
- direct attachment of the clicked row and preservation of attach error behavior;
- the existing full-widget loading overlay while default attachment is pending;
- `Edit` revealing delete controls for only its row, `Done` aligning with the heading at the top right, and `Done` restoring the normal list state;
- the secondary `Done` theme;
- explicit add-card and add-bank-account footer actions for combined `SELECT` with `ADD_ACCOUNT` lists;
- menu dismissal, one-menu-at-a-time behavior, accessible names, and Escape handling;
- the larger, semibold `Default` label immediately left of the overflow button, derived from `selectedSource.id`, including no-match and fallback cases;
- verified preselected `selectedSource` rows remaining eligible until `PAYMENT_SOURCE_ATTACHED`;
- preserved required-info and not-verified row navigation, with under-review and declined rows remaining inert;
- preservation of `ADD_ACCOUNT`-only add buttons.

The focused browser test file will be run during development, followed by lint, the full test suite, and the TypeScript build.
