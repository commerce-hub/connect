# Payment actions and bank-form defaults plan

## Goal

Align payment-method actions and configuration-driven bank forms with the agreed UI behavior.

## Changes

- Render `Use selected method` and `Add payment method` as primary actions.
- Change only the visible overflow-menu label from `Delete` to `Remove`; retain internal action names and API behavior.
- Prefill only the configured `address.country` field from `interactionResponse.country`.
- Disable that country control when an interaction country exists and apply a clearly visible disabled background.
- Do not provide a hard-coded fallback. If the interaction has no country, leave the field editable.
- Keep action buttons visible but disabled until all mandatory values are present.
- Keep validation errors hidden on load; show them after the relevant action and clear corrected errors during editing.

## Verification

Cover button variants, visible copy, country prefill/editability, disabled styling, mandatory-field gating, and validation lifecycle without changing demo-app code.

