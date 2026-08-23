# PBB KYC Customer Details Design

## Goal

Pass the authenticated customer's KYC details from the MPP interaction response to Bank Link Lite during `PaymentSDK.init`. When both names are available, PBB can skip its KYC screen. Partial data remains useful for prefilling the screen.

## Data source and mapping

MPP `development` exposes the customer profile as `InteractionResponse.entityData`. The wallet SDK will use that existing response rather than extending the PBB session contract or requiring the host merchant to repeat profile data.

| MPP interaction response | PBB initialization |
| --- | --- |
| `entityData.firstName` | `firstName` |
| `entityData.lastName` | `lastName` |
| `entityData.email` | `email` |
| `entityData.phoneDetails.phoneNumber` | `phone` |

The phone country code is deliberately not concatenated. PBB receives only `phoneNumber`, matching the agreed Bank Link Lite contract.

## Wallet SDK changes

The checked-in wallet OpenAPI artifacts currently omit `entityData` from `InteractionResponse`, although the latest MPP model includes it, and MPP core does not provide a checked-in generated OpenAPI artifact to consume. Model the latest `entityData` shape in the wallet's existing `InteractionResponse` compatibility extension, alongside other response additions absent from the older generated snapshot. Do not hand-edit `src/generated/openapi.ts`.

Extend the internal `PaymentSdkInitConfiguration` type with optional `firstName`, `lastName`, `email`, and `phone` properties. Resolve these values from the current interaction response immediately before launching PBB and include them in the existing `PaymentSDK.init` call.

Normalize each value by trimming surrounding whitespace. Omit values that are absent or blank; do not fabricate defaults. Forward partial data unchanged after normalization so PBB can prefill its KYC screen. PBB remains responsible for deciding whether its KYC screen is skipped, based on the presence of both required name fields.

## Scope and error behavior

No changes are required to the PBB session endpoint, hosted-page configuration, tokenize request, or the wallet SDK's public initialization API. Missing customer details do not block bank linking and do not create a new wallet-level validation error; PBB handles incomplete KYC data through its existing screen.

## Testing

Add focused browser tests around the Pay by Bank initialization boundary:

- complete entity data maps all four values into `PaymentSDK.init`;
- partial entity data forwards only the available nonblank values;
- whitespace is trimmed and blank values are omitted;
- missing entity data preserves the existing PBB initialization behavior;
- phone mapping uses `phoneNumber` only and excludes `countryCode`.

Run the focused Chromium test while iterating, followed by the repository build, lint, and full test commands before completion where the local environment supports them.
