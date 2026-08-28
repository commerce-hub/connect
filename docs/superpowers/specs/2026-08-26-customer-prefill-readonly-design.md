# API customer prefill and read-only fields

## Scope

Prefill customer identity values returned in `InteractionResponse.entityData` in Wallet SDK-owned card and manual bank-account forms. A field is read-only only when its value was supplied by the API after trimming. Missing, empty, or whitespace-only values remain editable. Pay by Bank remains outside this UI behavior: the Wallet SDK continues passing the same non-empty values in `PaymentSDK.init.customer`, and the hosted PBB SDK decides how to render them.

## Data mapping

Normalize API values once into a customer-prefill model containing `firstName`, `lastName`, `email`, and the phone number. Preserve individual fields for configuration-driven schemas and derive the full customer name from the available first and last name values for combined-name controls such as card `fullName` and manual-bank `accountHolderName`.

Only prefill a control whose semantic field is represented by the API data. Do not overwrite user-entered data during re-renders or interaction refreshes. Apply prefills when a new add-card or add-bank-account form is initialized.

For configuration-driven manual forms, support canonical identity property names and the existing combined account-holder field. Read-only state is expressed in the normalized JSON Schema for matching API-prefilled properties. Unrelated fields, including account credentials and addresses, remain editable.

Payment identifiers are never populated from customer contact data. In particular, the Interac `interacAccount` field remains empty and editable even when the interaction API supplies an email address.

For the fixed card form, initialize `fullName` from the API name and render that input as read-only. Email and phone are not added to the card form because the current card request/UI has no such controls.

## UI and accessibility

Use native `readonly` semantics for text inputs rather than `disabled`. This keeps values focusable, available to assistive technology, included in form behavior, and eligible for validation/submission. Read-only inputs receive a distinct neutral surface, subdued text, and a normal text cursor so users can visually recognize that the value cannot be changed while still being able to select and copy it.

Do not display an error merely because an API-prefilled value is immutable. Existing schema and form validation continues to apply. If an API value is invalid for a required field, submission remains blocked under the existing validation behavior.

## Data integrity

Input/change handlers must ignore attempted updates to API-owned read-only fields. This provides a state-level guard in addition to the browser control and prevents synthetic events from changing locked values. Empty API values establish no lock.

## Testing

Add unit and flow coverage for:

- trimming and resolving full and partial customer data;
- prefilling and locking combined-name card and manual-bank fields;
- prefilling and locking supported identity fields in configuration-driven schemas;
- leaving absent/blank fields editable;
- preserving API-prefilled values when change events are attempted;
- continuing to pass customer data to `PaymentSDK.init.customer` without adding PBB UI-control flags;
- visible read-only styling and native accessibility semantics.

## Non-goals

- No changes to the embedded PBB SDK.
- No new customer fields are added to forms that do not already contain them.
- No changes to MPP APIs or request contracts.
- No locking of address, account, routing, card-number, expiry, or security-code fields.
