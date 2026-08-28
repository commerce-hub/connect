# Non-US Manual Bank Icon Alignment Design

## Problem

The empty payment-method screen uses a branded image for the card action but a narrower generic bank icon for the non-US manual bank action. Their different leading-column widths cause the two `.source-action-copy` elements to start at different horizontal positions. USA actions align because all three tender rows use branded images with the same reserved width.

## Design

Reuse `MANUAL_BANK_SOURCE_ACTION_BRAND_IMAGE`, currently used by the USA `add-ach-manually` tender, as the `brandImage` for the non-USA `add-bank-account` tender. Keep its action, title, subtitle, and bank icon fallback unchanged. Do not alter shared grid CSS or introduce a country-specific image asset.

This makes the non-US card and manual bank rows use the existing branded-row layout and therefore the same leading-column width.

## Testing

Extend the add-payment-tender unit coverage to assert that a non-USA bank tender uses `MANUAL_BANK_SOURCE_ACTION_BRAND_IMAGE`. Add or update rendered payment-screen coverage for Canada to verify that both actions are branded and use the expected card and manual-bank images. Run the focused tests, the SDK build, and the relevant broader test suite.

## Scope

Only the non-USA empty-state bank action presentation changes. USA tender rendering, navigation actions, labels, subtitles, and manual bank-entry behavior remain unchanged.
