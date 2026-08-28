# Document Type Selectable List Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Present accessible, full-width document rows with familiar empty/filled radio indicators and a clearer localized upload hierarchy.

**Architecture:** Preserve the existing native radio group and change only its presentation. Lit continues to own selection state and form events; CSS visually hides the native radio, styles the associated row and leading radio indicator, and groups upload guidance in a dedicated panel.

**Tech Stack:** TypeScript 5.9, Lit 3, CSS custom properties, Web Test Runner, Chai/Open WC

---

### Task 1: Lock the selectable-list behavior with tests

**Files:**
- Modify: `src/test/commerce-hub-connect-flow_test.ts:8520-8570`

- [ ] **Step 1: Extend the short-list test with failing presentation assertions**

Add assertions that each option has a full-row label, the radios expose the visually-hidden class, no row or checkmark is selected initially, clicking the Passport row selects exactly that radio, selected styling/checkmark appears on only that row, and the upload button becomes enabled.

```ts
const options = [
  ...el.shadowRoot!.querySelectorAll<HTMLElement>(
    '.required-info-document-type-option'
  ),
];
assert.lengthOf(options, 2);
assert.lengthOf(
  el.shadowRoot!.querySelectorAll('.required-info-document-type-check'),
  0
);
assert.isTrue(
  documentTypeRadios.every((radio) =>
    radio.classList.contains('visually-hidden')
  )
);

options[1].querySelector<HTMLLabelElement>('label')!.click();
await el.updateComplete;

assert.isFalse(documentTypeRadios[0].checked);
assert.isTrue(documentTypeRadios[1].checked);
assert.isTrue(options[1].classList.contains('required-info-document-type-option-selected'));
assert.lengthOf(options[1].querySelectorAll('.required-info-document-type-check'), 1);
assert.isFalse(
  el.shadowRoot!.querySelector<HTMLButtonElement>('.upload-row')!.disabled
);
```

- [ ] **Step 2: Run the focused test and verify RED**

Run:

```bash
npm run test:dev -- --files src/test/commerce-hub-connect-flow_test.ts
```

Expected: FAIL because the selectable-list classes and checkmark are not rendered.

### Task 2: Render accessible selectable rows

**Files:**
- Modify: `src/commerce-hub-connect.ts:2275-2305`

- [ ] **Step 1: Make the label the full selectable row**

Render each option with its existing native radio first, followed by a full-row label. Add `visually-hidden` to the radio. Add the selected modifier class only when the corresponding type matches `selectedRequiredInfoUploadDocType`, and render a decorative check only in that state.

```ts
const isSelected =
  doc.docType === this.selectedRequiredInfoUploadDocType;

return html`
  <div
    class=${isSelected
      ? 'required-info-document-type-option required-info-document-type-option-selected'
      : 'required-info-document-type-option'}
  >
    <input
      class="required-info-document-type-radio visually-hidden"
      id=${`required-info-document-type-${index}`}
      type="radio"
      name="requiredInfoDocumentType"
      value=${doc.docType ?? ''}
      .checked=${isSelected}
      ?disabled=${isSubmitting}
    />
    <label for=${`required-info-document-type-${index}`}>
      <span class="required-info-document-type-label">
        ${requiredInfoDocLabel(doc, this.translator)}
      </span>
      ${isSelected
        ? html`<span class="required-info-document-type-check" aria-hidden="true">✓</span>`
        : nothing}
    </label>
  </div>
`;
```

Use Lit's existing `nothing` import; add it to the import only if it is not already present.

- [ ] **Step 2: Run the focused test**

Run:

```bash
npm run test:dev -- --files src/test/commerce-hub-connect-flow_test.ts
```

Expected: selection behavior passes; visual-class assertions may remain red until Task 3.

### Task 3: Style the contiguous list and states

**Files:**
- Modify: `src/internal/styles.ts:1001-1037`

- [ ] **Step 1: Replace card-radio styling with list-row styling**

Use a zero-gap grid and contiguous borders. Make the label the interactive flex row, add hover only for enabled rows, use a subtle mixed primary background for selected rows, preserve a separate `:focus-visible + label` focus ring, dim disabled rows, and style the trailing check as a small primary-color circle. Ensure labels wrap with `min-width: 0` and `overflow-wrap: anywhere`.

- [ ] **Step 2: Run the focused flow test and verify GREEN**

Run:

```bash
npm run test:dev -- --files src/test/commerce-hub-connect-flow_test.ts
```

Expected: PASS.

### Task 4: Verify regressions and package output

**Files:**
- Verify only

- [ ] **Step 1: Check localization catalogs**

Run:

```bash
npm run check:localization
```

Expected: PASS with no missing or extra translation keys.

- [ ] **Step 2: Run the full development test suite**

Run:

```bash
npm run test:dev
```

Expected: all tests pass.

- [ ] **Step 3: Build the SDK**

Run:

```bash
npm run build
```

Expected: TypeScript exits successfully with no errors.

- [ ] **Step 4: Review the final diff**

Run:

```bash
git diff -- src/commerce-hub-connect.ts src/internal/styles.ts src/test/commerce-hub-connect-flow_test.ts
```

Expected: only selectable-list markup, styles, and focused regression tests are included.

No commit is included because the current worktree contains unrelated user changes and commits require explicit approval.

### Task 5: Align the selected-file remove action

**Files:**
- Modify: `src/commerce-hub-connect.ts`
- Modify: `src/internal/styles.ts`
- Test: `src/test/commerce-hub-connect-flow_test.ts`

- [ ] Reuse the existing payment-method trash icon button inside a two-column upload-action row.
- [ ] Keep `document.removeFile` as the localized accessible name and remove visible remove-link text.
- [ ] Verify the icon is decorative, the button is right-aligned, and removing the file preserves existing behavior.
