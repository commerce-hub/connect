# Embedded Selector Cleanup Design

## Goal

Commit the reusable embedded-selector feature and updated integration guide without committing sensitive CERT test values or local-only experimental selector behavior.

## Committed Behavior

- Preserve the configurable embedded selector modes: `dropdown` and `radio-list`.
- Preserve radio-list rendering, popup behavior, loading feedback, default/native ordering, and the embedded add-payment action.
- Keep QA as the default Pay-by-Bank configuration.
- Continue supporting CERT through the existing configurable Pay-by-Bank environment and URL inputs.
- Document both selector modes in `docs-src/examples/embedded.md` and regenerate `docs-src/examples/CHC-Wallet-Embed-Integration-Guide.pdf` from that source.
- Record the PDF filename change from `embedded.pdf` to `CHC-Wallet-Embed-Integration-Guide.pdf`.

## Local-Only Behavior

The following experimental behavior and its tests remain available in the current working tree but must not be staged or committed:

- Including or attaching payment methods labeled `Verified, Pending` in embedded selectors.
- Deduplicating embedded dropdown options by payment account number.
- Limiting the embedded dropdown to five payment methods.
- Real CERT Pay-by-Bank API keys, configuration IDs, or other sensitive test values.

## Commit Strategy

Because committed and local-only edits share files, use selective staging. The working tree may retain the experimental hunks after the feature commit, while the Git index contains only the approved selector feature, QA defaults, safe tests, and documentation.

Before committing:

1. Inspect the staged diff independently from the working-tree diff.
2. Search the staged content for the real CERT values and experimental behavior.
3. Verify QA remains the committed default.
4. Run tests against a temporary clean representation of the staged tree when practical, so local-only changes do not mask committed-code failures.

## Documentation

The integration guide will explain:

- `embeddedSelectorMode` and the `embedded-selector-mode` attribute.
- The default `dropdown` mode.
- The optional `radio-list` mode.
- Host sizing considerations for each mode.
- Angular property binding examples.
- Selection, loading, and add-payment behavior supported by committed code.

The guide must not describe local-only verified-pending, deduplication, or five-item-limit behavior.
