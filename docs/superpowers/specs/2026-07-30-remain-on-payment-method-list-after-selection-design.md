# Remain on Payment Method List After Selection Design

## Objective

Keep the saved-payment-method list visible after the shopper activates **Use selected method** and the attach request succeeds. The SDK must continue performing the attach operation, synchronizing its interaction state, and emitting `onSelect`, but it must not navigate to the **Payment method saved** summary screen for this action.

## Scope

This change applies only to explicit selection through **Use selected method**. It does not remove the selected-payment-source summary from other entry states or flows, and it does not change **Mark as default** behavior.

The public `onSelect` contract remains unchanged. Its `event.detail` continues to be the attached `PaymentSource`; no `selectedId` field or wrapper object is added.

## Success Flow

The existing attach success sequence remains authoritative:

1. POST `/interaction/source/{paymentSourceId}/attach`.
2. Merge the attach response into the current `InteractionResponse`.
3. Resolve the attached source from the response.
4. Update `selectedPaymentSourceId` and the component-owned `interactionResponse`.
5. Emit `onSelect` with the resolved `PaymentSource`.

After these operations, `paymentSourceView` remains `list`. The selected method stays represented in the list using the refreshed response state, and focus returns to that method's radio control. The component does not render the **Payment method saved** title or selected-source summary as a consequence of this action.

## Error and Pending Behavior

The existing pending overlay and action disabling remain unchanged while the attach request is active. If attachment fails, the list remains visible and the existing attachment error is displayed. No `onSelect` event is emitted on failure.

## Testing

Update the explicit-selection browser test to verify that a successful attach:

- sends the existing attach request;
- updates the selected method from the attach response;
- emits one `onSelect` event with the existing `PaymentSource` detail;
- continues rendering the payment-method list;
- does not render **Payment method saved** or the selected-source summary; and
- restores focus to the selected radio control.

Retain coverage proving that **Mark as default** attaches without emitting `onSelect` and that attachment failures remain on the list.

## Documentation

Update public flow documentation to state that explicit selection emits `onSelect` and remains on the saved-method list after attachment. Do not document any change to the event payload.
