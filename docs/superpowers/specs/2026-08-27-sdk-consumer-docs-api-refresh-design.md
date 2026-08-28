# SDK Consumer Documentation and API Contract Refresh

## Goal

Bring the wallet SDK's customer-facing documentation and checked-in OpenAPI contract up to date with v0.12.4 without exposing internal SDK implementation details or MPP workarounds.

## Consumer documentation

Update `docs-src` so SDK consumers can install, import, initialize, and upgrade the public package correctly. The documentation will cover:

- the scoped package name `@commerce-hub/connect-wallet-sdk` and v0.12.4 installation;
- GitHub Packages authentication and the supported GitHub Release tarball installation alternative;
- imports from the scoped package;
- passing the Create Interaction response to `interactionResponse`;
- placing `client_id` and `configuration_id` under `interactionResponse.oauth` when the Create Interaction integration returns them separately;
- customer identity prefill from `InteractionResponse.entityData`;
- the read-only behavior of nonblank API-prefilled identity fields and editable behavior when values are absent;
- the existing public custom-element properties and events needed by consumers.

The documentation will not describe SDK implementation helpers, encryption mappings, AUD/BSB/BPAY compatibility transformations, internal request construction, diagnostic logs, or MPP internals.

## OpenAPI contract

Reconcile `swagger.json` with the public runtime API currently consumed by the SDK. The refresh will include:

- `POST /interaction/source/v2/ach` with `currencyCode`, the public v2 account request schema, and source-creation headers;
- the current Pay by Bank session creation and finalization routes and their public headers;
- the current `SessionData` response including `configId`;
- `InteractionResponse.entityData` and its public entity-data schema;
- current account and payment-source fields required by the public API.

Gateway-only OAuth augmentation will remain represented by the SDK's public TypeScript augmentation rather than being falsely attributed to the upstream MPP-generated schema, unless the public gateway OpenAPI contract explicitly owns it.

After updating Swagger, regenerate `src/generated/openapi.ts` using the repository's existing generation command and review the generated type diff.

## Validation

- Build the SDK and generated types.
- Build the Eleventy documentation site.
- Run localization, proxy-auth, and package-surface checks.
- Validate `swagger.json` as JSON and confirm required paths, headers, and schemas programmatically.
- Review generated pages for package/import/init consistency and absence of internal implementation guidance.

## Delivery

Commit the documentation, Swagger, and regenerated public types on `docs/sdk-consumer-api-refresh`. Do not publish a package, GitHub Release, or GitHub Pages deployment as part of this change unless separately requested.
