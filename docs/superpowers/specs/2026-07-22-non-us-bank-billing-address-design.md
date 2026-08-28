# Non-US Bank Billing Address Selection Design

## Goal

Allow shoppers adding a non-US bank account to select an existing billing address from the interaction or add a new billing address, while continuing to enter all schema-defined banking fields such as institution number and transit number.

## Existing behavior

For non-US interactions, the SDK retrieves country tender instrument schemas and renders the selected schema through the existing JSON Forms binding. Address properties such as `address.firstLine`, `address.city`, and `address.postCode` are normalized into a nested JSON schema alongside banking properties such as `institutionNumber`, `transitNumber`, and account numbers.

On submission, the SDK currently always maps the schema form's address data into a new address, posts it to `/interaction/billing-address`, and uses the returned ID in the bank-source request. Although `GET /interaction` supplies `billerAddress[]` and the SDK already stores valid entries in `billingAddresses`, the non-US bank flow does not use them.

## User experience

The `Enter bank details` screen will show a billing-address control above the schema-driven bank form.

- When saved addresses exist, the first valid saved address is selected by default and displayed using the existing compact billing-address summary and `Change` interaction used by the add-card flow.
- Expanding the selector lists every saved address followed by `Add new billing address`.
- Selecting `Add new billing address` displays the address fields supplied by the selected country instrument schema.
- Selecting a saved address hides only schema fields below the top-level `address` property.
- Institution number, transit number, account number, confirmation, account-holder information, and every other non-address schema field remain visible and validated.
- When no saved address exists, `Add new billing address` is selected and the schema address fields are displayed immediately.
- Returning to instrument-schema selection and choosing another schema preserves the billing-address choice when it remains valid. New-address form data is reinitialized using the newly selected schema.

## State design

Add bank-flow-specific state rather than coupling bank entry to `cardDraft`:

- Selected bank billing-address value: a saved address ID or the existing new-address sentinel.
- Whether the bank billing-address selector is expanded.

The shared `billingAddresses` collection, address label helper, select primitive, summary markup, and new-address sentinel remain reused. Interaction refresh reconciliation ensures the selected saved ID still exists; otherwise it selects the first saved address or the new-address sentinel.

`resetBankFlow()` resets temporary bank form state but initializes the address selection from the current authoritative `billingAddresses` collection when the flow is opened.

## Schema handling

Keep server-provided instrument schemas immutable. Add a focused helper under `src/internal/forms/` that derives the JSON schema used by the bank form:

- New-address selection: return the full normalized schema.
- Saved-address selection: return a copy without the top-level `address` property and remove `address` from the root `required` array.

Generate the UI schema and initial form data from the same derived schema. Do not filter controls in the renderer, because hidden required address data would otherwise keep the form invalid.

This approach preserves all validation metadata and error translations for non-address fields and follows the existing schema-adapter boundary.

## Submission flow

When the shopper submits:

1. Confirm that the selected instrument schema and interaction ID exist.
2. Resolve the billing-address ID:
   - For a saved selection, verify it still exists in `billingAddresses` and use its existing ID.
   - For `Add new billing address`, map the form's nested `address` data through `createManualBankBillingAddress`, post it to `/interaction/billing-address`, and require the returned ID.
3. Build the bank source with `createManualBankAccountRequest` using that billing-address ID.
4. Encrypt sensitive bank values using the existing RSA-OAEP path.
5. Submit `/interaction/source/ach` and retain the current success, error, and event behavior.

Saved-address submission must not call `/interaction/billing-address`.

## Error handling

- A saved address ID that disappears after refresh is reconciled before rendering; if it is still stale during submission, show a user-facing billing-address selection error and do not create the bank source.
- A failed new-address request uses the existing bank-account submit error surface.
- Missing address fields for a new address remain governed by the server-provided JSON schema and its translated validation messages.
- Address selection is required before the Save action becomes enabled.

## Tests

Follow the repository's colocated `*_test.ts` browser-test convention and existing Mocha TDD style.

### Schema adapter tests

- Full schema retains nested address and banking properties for a new address.
- Saved-address derivation removes only the top-level address schema and required entry.
- Institution number and transit number remain present and required.
- The source configuration object is not mutated.

### Component flow tests

- Existing addresses from `GET /interaction` appear in the bank billing-address selector.
- The first saved address is initially summarized and banking fields remain visible.
- `Change` reveals saved addresses and `Add new billing address`.
- Selecting `Add new billing address` displays schema-defined address fields.
- Selecting a saved address hides address fields without hiding institution or transit fields.
- Saved-address submission uses the existing ID and makes no billing-address POST.
- New-address submission posts the mapped address and uses the returned ID.
- No saved addresses defaults to the new-address form.
- A stale selected address is reconciled safely.
- Switching instrument schemas preserves a valid saved selection and refreshes new-address fields.

### Regression verification

- Existing card billing-address tests remain unchanged and pass.
- Existing non-US schema inquiry, Canadian mapping, encryption, and ACH source tests pass.
- SDK build, lint, focused browser tests, and the full test suite pass before completion.

## Files expected to change

- `src/commerce-hub-connect.ts`: bank address state, rendering, reconciliation, and submission branching.
- `src/internal/forms/instrument-schema.ts` or a focused adjacent helper: immutable schema derivation that omits address fields for saved selections.
- `src/test/instrument-schema-adapter_test.ts`: schema derivation coverage.
- `src/test/commerce-hub-connect-flow_test.ts`: end-to-end component behavior and request assertions.

No generated OpenAPI files, public event contracts, or merchant-host APIs need to change.
