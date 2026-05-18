# Demo Layout Columns Design

## Summary

Update the static demo host page at `dev/index.html` so the host-input panels move into the first column, `Design config` becomes collapsible and starts collapsed, and the `Create interaction` submit control moves to the bottom after the design-config section.

## Goals

- Make the host-input column the first column in the page layout.
- Keep `Create interaction request` above `Design config`.
- Render `Design config` as a collapsible section that is collapsed by default.
- Collapse the design-config JSON preview together with the design-config fields.
- Place `Create interaction` as the last button at the bottom after `Design config`.

## Non-Goals

- No change to the request builder behavior.
- No change to the design-config object shape or live widget syncing behavior.
- No new framework or component extraction for the static demo.

## Approach

Use semantic HTML rather than a JS-only collapse.

- Reorder the two top-level columns in `main.demo-layout` so the host payload column is first in the DOM and therefore the first visual column.
- Keep `Create interaction request` as a standard card and leave the form itself intact.
- Convert the `Design config` card into a native `<details>` panel with a `<summary>` header and no `open` attribute so it starts collapsed by default.
- Move the `Create interaction` button into a final bottom action row after the design-config card and connect it back to the existing form with `form="interaction-create-form"`.

Because the design-config preview will live inside the collapsed `<details>` content, it will collapse together with the form body automatically.

## Files

- `dev/index.html`
  Purpose: static demo markup, inline styles, and inline page behavior.
- `src/test/demo-host_test.ts`
  Purpose: source test covering the static demo HTML structure.
- `test/demo-host_test.js`
  Purpose: built JS test consumed by Web Test Runner after TypeScript compilation.

## Testing Strategy

Drive the change from the static HTML test first.

Add assertions that verify:

- the payload panel comes before the widget/scenario panel in the page layout
- the design-config section uses a collapsed-by-default details wrapper
- the bottom action row exists after the design-config section
- the `Create interaction` button submits `interaction-create-form` from that bottom row

Then implement the minimal HTML/CSS updates to make the test pass and re-run the focused demo-host test.
