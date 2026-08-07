# Config-driven bank UI schema

## Status

Approved for implementation. The Config API now returns `uiSchema` on each
instrument schema.

## Goal

Allow the Config API to control which manual bank-account fields are displayed and their order while the wallet SDK continues to own the saved/new billing-address interaction and the existing JSON Forms look and feel.

## API contract

Each entry in `instrumentSchemas` continues to provide its JSON Schema fields:

- `properties`
- `required`
- validation constraints such as `minLength`, `maxLength`, `pattern`, and `enum`
- `x-errorMessages`
- `enum` and `x-enumLabels` for labeled select controls

Each entry additionally provides one JSON Forms `uiSchema`:

```json
{
  "uiSchema": {
    "type": "VerticalLayout",
    "elements": [
      {
        "type": "Control",
        "scope": "#/properties/accountHolderName"
      },
      {
        "type": "Control",
        "scope": "#/properties/accountNumber"
      },
      {
        "type": "Control",
        "scope": "#/properties/routingCode"
      },
      {
        "type": "Control",
        "scope": "#/properties/address/properties/firstLine"
      },
      {
        "type": "Control",
        "scope": "#/properties/address/properties/city"
      },
      {
        "type": "Control",
        "scope": "#/properties/address/properties/state"
      },
      {
        "type": "Control",
        "scope": "#/properties/address/properties/postCode"
      },
      {
        "type": "Control",
        "scope": "#/properties/address/properties/country"
      }
    ]
  }
}
```

The actual controls may vary by instrument schema. The SDK must preserve the order of `uiSchema.elements` exactly.

The API must not include the SDK-internal `#/properties/__bankBillingAddress` control. The SDK injects that control immediately before the first element whose scope starts with `#/properties/address/`.

Business and personal instruments remain separate when both are supported. For example, `USD-American-B` represents business and `USD-American-P` represents personal.

Enum-backed controls must contain usable values. In particular, `address.state.enum` must not be empty for a US state selector.
The SDK preserves the `enum` values and uses `x-enumLabels` to display the
corresponding human-readable option label while retaining the enum code as the
submitted value.

## SDK behavior

Update the wallet SDK to:

1. Add `uiSchema` to the generated Config API/OpenAPI type.
2. Validate the supplied UI schema before rendering it.
3. Confirm every control scope resolves to a property in the normalized JSON Schema.
4. Preserve the API-provided element order.
5. Inject the existing `__bankBillingAddress` control immediately before the first address control.
6. When a saved billing address is selected:
   - remove controls whose scopes start with `#/properties/address/` from the active UI schema;
   - use `instrumentSchemaWithoutAddress()` so hidden address fields and requirements do not invalidate the form.
7. When New Address is selected:
   - render all API-provided controls;
   - use the complete normalized instrument schema and its address validation.
8. Keep the current `VerticalLayout`, renderers, component styles, labels, and error presentation unchanged.
9. Preserve `enum` and `x-enumLabels` through normalization so JSON Forms
   renders labeled selectors such as the US State control.

The SDK must not maintain a hard-coded list of bank fields. New or differently ordered controls supplied by the API must render without an SDK release, provided their schemas and scopes are valid and supported by the existing JSON Forms renderers.

## UI-schema validation

The SDK should reject or safely fall back when:

- `uiSchema.type` is unsupported;
- `elements` is missing or is not an array;
- an element is not a supported JSON Forms control/layout;
- a control scope does not resolve against the normalized instrument schema;
- the schema contains duplicate control scopes.

When validation fails, use the existing SDK-generated `VerticalLayout`,
preserving backward compatibility with older or malformed API responses.

## Enum dropdown styling

JSON Forms enum controls in the bank-account form use the same control height,
border, radius, padding, typography, surface color, focus ring, disabled state,
and invalid state as the existing bank text inputs and SDK dropdowns. The
control retains the platform-native dropdown arrow.

Each enum dropdown prepends a blank-value option whose text is `Select`
followed by the lower-cased field label, such as `Select state`. This prompt
appears as the top item and keeps required enum controls invalid until the user
selects a configured value.

Enum dropdowns use the SDK custom chevron rather than the platform-native arrow.
The chevron is positioned one rem from the right edge to match other SDK
dropdowns.

Browser autofill must not apply a highlighted surface to enum dropdowns. An
autofilled value keeps the same neutral background and text color as a manually
selected value.

## Acceptance criteria

- Older responses without `uiSchema` continue using the current generated layout.
- API-provided controls render in exactly the supplied order.
- Previously unknown but renderer-supported fields render without hard-coded SDK ordering.
- The billing-address selector appears immediately before the first address field.
- Saved-address selection hides address controls and disables their validation.
- New-address selection displays address controls and enforces their validation.
- Switching repeatedly between saved and new addresses does not lose unrelated bank-field values.
- `USD-American-B` and `USD-American-P` retain their existing business/personal behavior.
- Existing form styling and interaction behavior remain visually unchanged.
- Enum controls display `x-enumLabels` and submit the associated `enum` code.
- Enum dropdowns visually match the other bank form controls in default,
  focused, disabled, and invalid states.
- Enum dropdowns show their field label as the first blank-value option.

## Verification plan

Add tests covering:

- Config response parsing with and without `uiSchema`;
- supplied element ordering;
- dynamic/unknown field scopes;
- invalid and duplicate scopes;
- billing-address control injection;
- saved-address filtering and validation;
- new-address restoration and validation;
- backward-compatible generated-layout fallback;
- unchanged business/personal account-holder mapping.
- enum dropdown style parity with existing bank form controls.
