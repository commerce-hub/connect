# Document Type Selectable List Design

## Goal

Replace the visible document-type radio controls with a cleaner selectable-list pattern while preserving single selection, accessibility, localization, and the existing upload flow.

## Scope

- Apply the selectable-list presentation when two to four document types are available.
- Retain the existing select control when more than four document types are available.
- Keep the single-document rule: the user selects one document type and uploads one file.
- Continue to ignore each document definition's mandatory flag for selection purposes.

## Interaction design

- Initially, no document type is selected.
- Each document type is presented as a full-width clickable row.
- Rows are visually neutral until selected.
- Every row shows a leading radio indicator. It is empty when unselected and filled when selected.
- The selected row also uses a subtle primary-color border and background.
- Native radio inputs remain in the DOM but are visually hidden. This preserves radio-group semantics, keyboard navigation, form behavior, and screen-reader announcements.
- Clicking anywhere on a row selects its radio input.
- Tab enters the radio group; arrow keys move selection; Space selects according to native browser behavior.
- The file picker remains disabled until a document type is selected.
- Changing the document type continues to clear an incompatible/current file according to the existing form-state behavior.

## Visual design

- Use a contiguous vertical list rather than separate radio cards.
- Use existing SDK design tokens for surface, border, text, primary color, focus ring, radius, and motion.
- Do not show an accent border, accent background, or filled radio dot before selection.
- Use the action-oriented heading “Choose a document type”.
- Group the “Upload document” heading and localized supported-format guidance inside a bordered upload panel.
- When a file is attached, place the existing danger-colored trash icon button at the right edge of the file row; expose its localized action through `aria-label` rather than visible text.
- Preserve a visible focus indicator independent of the selected state.
- Allow labels to wrap without clipping on narrow screens or with longer localized text.

## Accessibility

- Keep `role="radiogroup"`, its translated label, and helper-text association.
- Keep native `input[type="radio"]` elements and associated `label` elements.
- Hide inputs using a visually-hidden technique, not `display: none` or `visibility: hidden`.
- Ensure disabled and focus-visible states are perceivable.
- The visual radio indicator is hidden from assistive technology because the native radio provides its semantics.

## Testing

- Verify all options show an empty radio indicator and no option has selected styling initially.
- Verify clicking a row selects exactly one document type.
- Verify selected styling and the filled radio indicator appear only on the selected row.
- Verify the new heading and upload guidance are localized in English and French Canadian.
- Verify the attached-file remove action reuses the existing icon-button pattern and retains an accessible localized label.
- Verify the file picker is disabled before selection and enabled afterward.
- Verify native keyboard selection remains functional.
- Verify the dropdown remains in use for more than four document types.

## Out of scope

- API contract changes.
- Upload endpoint or payload changes.
- Changes to accepted file formats or validation messages.
- Changes to the document-type threshold for using the dropdown.
