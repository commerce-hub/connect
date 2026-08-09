# Compact Payment Bottom Sheet Design

## Goal

Apply the compact equal-weight tender-list design to the Add payment method bottom sheet while selecting branded images only for USA interactions.

## Regional presentation

Keep the existing country-aware tender model and action routing unchanged. The bottom-sheet renderer determines presentation from the normalized interaction country:

- For `US` or `USA`, render each tender's existing branded image. This produces the supplied Card, Pay by Bank, and Manual Bank Link artwork.
- For every other or missing country, ignore any tender brand image and render the existing compact card or bank SVG icon. Both non-USA bank and card options retain their current icons.

Do not add presentation-only fields to the shared tender model.

## Layout

Replace independently bordered bottom-sheet option cards with one bordered, rounded, white list container. Each option is a flat compact row containing the selected image/icon, title, wrapped subtitle, and existing decorative chevron.

Use the same spacing, minimum height, separators, hover treatment, and focus treatment as the no-saved-payment compact list. USA branded images use the same image dimensions as the empty-state rows. Non-USA SVG icons retain the existing icon-tile dimensions and colors.

All options retain equal visual weight. The sheet header, close control, backdrop, responsive sheet positioning, action names, order, copy, and navigation behavior remain unchanged.

## Text and accessibility

Allow bottom-sheet subtitles to wrap without a line clamp using normal white-space, visible overflow, and a readable line height. Brand images and SVG icons remain decorative because the adjacent visible title identifies each action. The buttons, dialog semantics, close-label, and keyboard focus behavior remain unchanged.

## Testing

Update flow/style tests to verify:

- USA bottom-sheet options render the matching three branded images and no SVG icon tiles.
- Non-USA Card and Bank account options render the existing card/bank SVG paths and no branded images.
- The option container has one outer border and zero gap.
- Rows have no independent rounded border, adjacent rows have separators, and subtitles wrap.
- Tender order, copy, actions, close behavior, and navigation remain unchanged.

Run focused flow tests, build, lint, package-surface checks, and the full suite. Report missing Playwright browsers as an environment block rather than a passing browser suite.
