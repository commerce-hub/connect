# Submit-Gated Form Validation Design

## Objective

Prevent SDK forms from displaying inline validation errors on initial load. Keep each form's submit or primary action visible but disabled until every mandatory field contains a non-empty value. Once enabled, the action validates the form; invalid values display inline errors without sending an API request, and corrected values clear their corresponding errors immediately.

## Scope

The validation contract applies to SDK data-entry forms, including card entry, schema-driven bank entry, legacy bank entry, transfers, OTP, and required-information collection. Selection-only controls that already disable their action until a required selection exists retain that behavior.

Server and operation errors remain separate from inline field validation. They continue to appear only after the associated request fails and clear through the flow's existing edit, retry, or reset behavior.

## Validation State

Each data-entry flow owns a validation-attempted flag. The flag starts as `false`, becomes `true` when the enabled primary action is activated, and resets when the flow is reset, exited, completed, or initialized for a different interaction.

Before validation is attempted, internal validity may still be calculated for encryption and form readiness, but inline field errors are not rendered. After validation is attempted, the form renders current validation errors and keeps validation live while the shopper edits.

## Action Availability

Primary actions remain in the layout at all times.

- On initial load, the action is disabled because mandatory fields are empty.
- The action becomes enabled when every currently applicable mandatory field is non-empty, even when one or more values have an invalid format.
- Pending requests and active encryption continue to disable the action.
- If a mandatory field is cleared, the action becomes disabled again rather than disappearing.
- When all mandatory fields contain values again, the action becomes enabled.

Mandatory-field presence is distinct from full validity. Presence controls whether the action is clickable; validation controls whether clicking it can submit.

## Submit and Correction Behavior

When an enabled action is activated, the SDK validates the complete form. If validation fails, it sets the flow's validation-attempted flag, renders inline errors, and does not call the API.

After the first validation attempt, each input or selection change recalculates the affected validation state. An error is removed as soon as the corrected value satisfies its validation rules. Other unresolved errors remain visible. If a previously valid mandatory field is cleared after validation was attempted, its required error remains visible while the action becomes disabled.

## Form-Specific Behavior

### Card Entry

Button availability is based on non-empty mandatory card and active billing-address fields, not `isCardDraftReady`. Encryption-in-progress still disables the button. Card field errors are rendered only after Save is attempted, and edits clear resolved errors.

### Schema-Driven Bank Entry

JSON Forms uses hidden validation before Save is attempted and visible validation afterward. Button availability is derived from the active normalized schema's required fields and current billing-address mode, not `bankAccountFormValid`. JSON Forms continues recalculating errors so corrected fields clear automatically.

### Legacy Bank Entry

Button availability is based on non-empty required fields from the legacy bank schema. Existing encryption and validation logic remains authoritative, but its errors are passed to renderers only after Save is attempted. Corrected fields clear through the existing draft-state update path.

### Transfer

Button availability is based on non-empty From, To, and Amount values. Activating Transfer performs the existing full validation before advancing to confirmation. After an invalid attempt, edits remove resolved field errors and the button disables again if a mandatory value is cleared.

### OTP and Required Information

OTP keeps its visible action disabled until all required digits are present; server rejection appears only after Verify and clears when the OTP changes. Required-information actions remain visible and use mandatory document or text presence for availability. Non-empty malformed text, such as an incomplete Social Security number, enables Verify but is rejected locally after the action; its inline error clears as the shopper corrects it. Submission-level feedback remains separate and clears when the shopper changes a value or file.

## Accessibility

Disabled buttons remain discoverable in the expected layout. Inline errors retain their existing `aria-describedby` and error-element associations. Validation visibility changes must not remove labels, required semantics, or focusable inputs.

## Testing

Browser coverage will verify for each applicable form that:

- no inline errors appear on initial render;
- the primary action is visible and disabled while mandatory fields are empty;
- the action enables when mandatory fields are non-empty, including malformed values;
- activating the action with malformed values shows errors without an API request;
- correcting a field removes its error immediately;
- clearing a mandatory field after validation disables the action and displays its required error; and
- resetting or leaving the flow clears validation-attempted state.

Unit coverage will verify mandatory-presence helpers independently from full validators, including nested schema-driven bank fields and billing-address variants.
