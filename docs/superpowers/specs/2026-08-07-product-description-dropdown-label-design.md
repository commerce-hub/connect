# Product description dropdown label design

## Goal

Display each configured bank product's human-readable `productDescription` in the **Select bank account type** dropdown instead of exposing its `productId`.

## Data contract

`productDescription` is an optional string on each configuration-inquiry instrument schema. The SDK trims it before display. When it is absent, blank, or not a string, the dropdown label falls back to the schema's `productId`.

The dropdown option value remains the payment type parsed from `bavSupportedCode`. Schema resolution and the bank-account creation payload remain unchanged, including submission of the selected schema's `productId`.

## Implementation

- Add `productDescription` to the generated configuration schema type and its source OpenAPI definition.
- Preserve an optional valid description while validating configuration-inquiry instrument schemas.
- Build payment-type option labels from the trimmed description, with `productId` as the fallback.
- Do not change dropdown ordering, deduplication, navigation, or request construction.

## Verification

Automated tests will cover:

- A nonblank description is displayed instead of the product ID.
- A missing or blank description falls back to the product ID.
- Selecting the description-labelled option still resolves the correct schema and submits its original `productId`.

