# Payment Method Action Refinements

## Goal

Refine saved-payment-method actions so marking a source as default does not act
as checkout selection, deletion starts directly from the overflow menu, and an
open menu on the last list row is not faded by the scroll affordance.

## Mark as default

The existing attach request remains the mechanism for making a payment source
the interaction default. Attachment must carry an explicit intent so normal
selection and default assignment have different completion behavior.

Every `Mark as default` path, including the saved-method overflow action and the
new-card checkbox, will:

- attach the verified source through the existing interaction source endpoint;
- update `interactionResponse` and its selected/default source;
- remain on or return to the payment-method list so the updated `Default` badge
  is visible; and
- not emit `onSelect`.

Other explicit selection paths retain the existing `onSelect` contract. The
existing pending overlay and inline attachment error remain in place for a
default-assignment request.

## Overflow actions and deletion

Replace `Edit` in each payment-method overflow menu with `Delete`. Remove the
single-row edit-mode state and the payment-screen `Done` action because they no
longer serve another behavior.

Choosing `Delete` closes the menu and arms the existing inline confirmation on
that row. No request is made until the shopper selects the confirmation's
`Delete` button. `Cancel`, the confirmation timeout, pending-state disabling,
the DELETE endpoint, interaction-response update, and
`onDeletePaymentMethod` event retain their current behavior.

The row renderer will display the confirmation state directly, without first
entering a separate edit mode.

## Last-row menu fade

The payment-method scroll list keeps its bottom gradient mask as an overflow
affordance. When the open overflow menu belongs to the last payment-method row,
the list receives a contextual class that disables both standard and WebKit
mask images. Closing that menu restores the gradient. Opening a menu on any
other row does not change the mask.

This targeted state avoids moving the menu outside the shadow-DOM list or
introducing viewport-positioning logic.

## Accessibility and errors

The overflow trigger retains its existing menu ARIA relationships and Escape
behavior. `Delete` remains a menu item, and the inline confirmation retains its
status message and labeled Cancel/Delete controls. Default-assignment and
deletion failures preserve the current list and existing recoverable error
behavior; neither failure emits a success event.

## Testing

Automated browser coverage will verify:

- saved-method `Mark as default` attaches the source, updates the badge, stays
  on the list, and does not emit `onSelect`;
- a new card marked as default attaches after creation without emitting
  `onSelect`;
- non-default selection behavior still emits `onSelect` where applicable;
- overflow menus contain `Delete` instead of `Edit`, and no `Done` action is
  rendered;
- the first Delete activation shows inline confirmation without a request;
- confirmation and cancellation preserve their current request/event behavior;
- the mask is disabled only while the last row's menu is open and is restored
  when it closes; and
- non-last-row menus retain the normal list fade.

README/event documentation and the generated documentation bundle will be
updated to match the revised `onSelect` contract.
