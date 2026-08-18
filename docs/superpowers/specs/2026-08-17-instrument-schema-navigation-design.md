# Instrument Schema Navigation Design

## Goal

Prevent the **Select bank account type** screen from advancing unexpectedly when multiple valid instrument schemas exist, while preserving the existing shortcut when only one valid schema remains after validation and filtering.

## Behavior

The flow bases its decision on `selectableInstrumentSchemas`, not the raw API array:

- When exactly one valid, selectable schema remains, select it and open the bank-details screen automatically.
- When more than one valid, selectable schema remains, show the schema-selection screen.
- On that selection screen, dropdowns with one available option remain preselected and disabled.
- Preselection may resolve a complete schema and enable **Continue**, but it must not open the bank-details screen automatically.
- User changes may also resolve a complete schema and enable **Continue**, but navigation occurs only when the user activates **Continue**.
- Invalid or unusable raw schemas do not count toward the navigation decision.

## Implementation Boundary

Keep schema filtering, option derivation, selection resolution, rendering, and form initialization unchanged except for separating these two actions:

1. Reconciling/preselecting dropdown state and resolving the selected schema.
2. Opening the bank-details screen.

The initial configuration response may perform both actions only when its filtered selectable-schema count is exactly one. Multi-schema reconciliation performs only the first action; the existing `select-instrument-schema` action performs the second.

## Testing

Add or update browser-flow tests to prove:

1. With multiple valid schemas and singleton dropdown options, the chooser remains visible, singleton values are preselected, and **Continue** is enabled once a schema resolves.
2. Clicking **Continue** opens the bank-details screen.
3. With exactly one valid schema, the chooser is skipped and the bank-details screen opens automatically.
4. With multiple raw schemas but only one valid selectable schema after filtering, the chooser is skipped and the bank-details screen opens automatically.

## Out of Scope

- Changing schema validation or filtering rules.
- Changing dropdown labels, ordering, or disabled styling.
- Changing the bank-details form or submission behavior.
