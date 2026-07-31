# Config-driven ACH v2 implementation plan

## Goal

Build the bank-account request from the selected configuration-inquiry instrument schema and submit it to `/interaction/source/v2/ach`, while preserving the existing legacy fallback.

## Decisions

- Preserve configuration property names in the request; do not rename `bsbCode` to `routingCode`.
- Include `bavSupportedCode`, `productId`, `countryCode`, and `currencyCode` from the selected schema.
- Encrypt `accountNumber`, `bsbCode`, `routingCode`, and `interacAccount` when present.
- For current v2 testing, send `accountNumberReEntered` with the same encrypted account-number value.
- Do not synthesize legacy `accountType`; retain `bankAccountType` only when supplied by configuration.
- Send a new address inline. For an existing address, send only `{id}`.
- Do not call the billing-address creation endpoint from the v2 flow.
- Accept the documented v2 response and preserve compatibility with a verification response containing `sourceId`.
- If the v2 response has no usable source, refresh the interaction and correlate the created source by the client-generated request id.

## Steps

1. Add pure request-construction and sensitive-field encryption helpers.
2. Adapt the JSONForms data directly into the v2 request and exclude SDK-only form controls.
3. Route schema-driven bank creation to the currency-qualified v2 endpoint.
4. Retain the legacy ACH path when no instrument schemas are available.
5. Add request-shape, encryption, address, empty-response, and fallback regression tests.
6. Update the generated SDK documentation and verify build, lint, and tests.

