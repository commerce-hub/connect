# Compact Empty Payment List Design

## Goal

Make the no-saved-payment-method tender choices easier to scan and ensure source-action subtitles wrap naturally at every supported viewport width.

## Layout

Replace the current stack of separately bordered dashed tender cards with one compact list container. The container has the wallet card border, white background, and card radius. Each tender occupies one full-width row with four visual regions:

1. The existing decorative tender brand image.
2. The title and subtitle copy.
3. Flexible remaining space within the copy column.
4. A right-facing decorative chevron.

Rows have no independent outer border or radius. Adjacent rows use a subtle divider. The first and last rows follow the parent container radius through clipping. All tenders retain equal size and visual weight; no option is featured or marked as recommended.

Use compact row padding and a minimum target height that remains comfortably above the WCAG 2.2 minimum. Keep the white background required by the supplied logo assets. Hover and focus-visible states use a subtle soft-surface tint without changing the logo background itself. The existing focus outline remains visible around the active row.

The add-payment bottom sheet is unchanged.

## Text behavior

Allow `.source-action-subtitle` to wrap at all viewport widths, not only under the existing `26.25rem` media query. Use normal white-space handling, visible overflow, clipped text-overflow behavior, and a readable multi-line line height. Do not impose a line clamp.

Keep source-action titles on one line with the existing ellipsis behavior. The current USA copy fits the available copy column; this avoids unnecessarily increasing row height.

## Component changes

Keep the existing source-action button semantics and action routing. Add a decorative chevron to the non-link source-action variant, hidden from assistive technology. Do not add the chevron to source-action link variants because those already render their own chevron.

Scope compact-list container and row styles through `.payment-action-links` so source actions used elsewhere retain their existing appearance.

## Testing

Update primitive/style tests to verify:

- Source-action subtitles have wrapping styles outside the mobile media query.
- The no-saved action container has one border and rounded white background.
- Tender rows do not render independent dashed borders.
- Adjacent rows have separators.
- Non-link source actions render a decorative chevron.
- Link source actions continue to render only their existing link chevron.
- Existing titles, subtitles, brand images, disabled behavior, and actions remain unchanged.

Run the focused primitive and flow browser tests, build, lint, and the full project suite. If the local Playwright executable remains unavailable, report that environment block separately from successful compiler and lint checks.
