# Instrument Schema Singleton Dropdowns Design

## Goal

Improve the configuration-inquiry instrument-schema chooser by automatically selecting any dropdown that has exactly one valid option. Show that selection as read-only, reveal and evaluate the next dropdown immediately, and open **Enter bank details** automatically when the cascade resolves one schema. Release the change as SDK version `0.10.5`.

## Selection Behavior

The existing selection order remains currency, account type, then payment type.

- A stage with no selected parent remains hidden.
- A stage with multiple valid options remains enabled and starts with its existing placeholder option.
- A stage with exactly one valid option is selected implicitly and rendered disabled so the shopper can see but not change the determined value.
- After an implicit or explicit selection, the next stage is evaluated immediately using the narrowed schema set.
- If all three stages uniquely resolve one schema, the SDK initializes the existing schema-driven form and opens **Enter bank details** without requiring **Continue**.
- If a shopper changes an enabled upstream dropdown, all dependent selections are recalculated. Singleton descendants are selected implicitly; ambiguous descendants remain empty and enabled.

The option count excludes placeholder entries such as **Select currency**.

## Architecture

Add one state-normalization method to `CommerceHubConnect` that accepts the selectable instrument schemas and reconciles the three selection properties in order. It will reuse the existing option helpers and `resolveInstrumentSchema`, making the API-response path and dropdown-change path share the same cascade rules.

The configuration-inquiry success path stores validated schemas, enters the selection state, and invokes normalization. Change handlers update the shopper-controlled value, clear downstream state as they do today, and invoke the same normalization method. Rendering derives each dropdown's disabled state from whether its valid option list has length one.

When normalization resolves a schema, it stores `selectedBankAccountInstrumentSchemaCode` and calls the existing `initializeManualBankAccountScreen`. Existing form setup, validation, billing-address handling, submission, and error behavior remain unchanged.

## Error and Compatibility Behavior

- Missing or empty raw schemas continue to open the legacy manual bank form.
- Malformed, duplicate, or otherwise unselectable schemas continue to show the existing configuration error and retry action.
- Multi-option paths retain the current user-driven dropdown flow and **Continue** behavior once a schema is explicitly resolved.
- Back navigation from details returns to the schema-selection screen; normalization restores any deterministic singleton values.

## Versioning

Set the root version in both `package.json` and the two root package records in `package-lock.json` to `0.10.5`. Dependency engine constraints that happen to contain similar version strings are not release metadata and remain unchanged.

## Tests

Browser-flow tests will prove that:

1. A sole currency is implicitly selected and disabled while multiple account types remain enabled.
2. A shopper-selected account type immediately reveals and implicitly selects a sole payment type.
3. A fully singleton cascade automatically opens **Enter bank details** without a Continue click.
4. Multiple options at a stage remain enabled and downstream controls wait for selection.
5. Malformed schema responses retain the existing error/retry behavior.

Verification includes the focused Chromium flow test, TypeScript build, lint, and package-version consistency checks.
