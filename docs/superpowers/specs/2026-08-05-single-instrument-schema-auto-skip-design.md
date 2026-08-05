# Single Instrument Schema Auto-Skip Design

## Goal

When the country-tender configuration inquiry yields exactly one valid, selectable instrument schema, skip the currency, account-type, and payment-type selection screen and open the bank details screen directly.

## Behavior

- Parse and validate the API response using the existing instrument-schema adapters.
- Compute the selectable schemas once after validation.
- If exactly one selectable schema remains, store that schema as the selected bank-account schema and initialize the existing schema-driven details form.
- If more than one selectable schema remains, preserve the current cascading selection screen and user flow.
- If no selectable schema remains, preserve the current configuration error screen and retry behavior.
- An absent or empty raw `instrumentSchemas` value continues to use the legacy manual bank-account screen.

The decision is based on valid selectable schemas rather than raw array length. A response containing one malformed schema therefore does not bypass validation or reach the details form.

## Implementation Boundary

Keep the branching in the existing configuration-inquiry success path in `src/commerce-hub-connect.ts`. Reuse the existing details-form initialization and selection state instead of introducing a new screen or parser. No API contract, dropdown component, or legacy-flow changes are required.

## State and Navigation

For the single-schema path, set the selected schema code from the sole schema and transition through the same initialization used after a user confirms a schema on the selection screen. This ensures the details form receives the same schema, validation rules, billing-address behavior, and back-navigation semantics as the current explicit-selection path.

## Error Handling

Network failures, malformed responses, and schemas that cannot be uniquely selected retain the current error message and **Try again** action. The shortcut must occur only after the existing usable/selectable validation succeeds.

## Tests

Add focused browser-flow coverage proving that:

1. One valid selectable schema goes directly from configuration loading to **Enter bank details**, without rendering any of the three selection dropdowns.
2. Multiple selectable schemas still render **Select bank account type** and the cascading dropdown flow.
3. One malformed schema still renders the existing configuration error/retry screen.

Run the focused Chromium browser test during development, then the SDK test suite, lint, and TypeScript build before completion.
