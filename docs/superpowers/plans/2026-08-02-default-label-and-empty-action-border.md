# Default Label and Empty-Action Border Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Move the `Default` pill into the payment-method metadata row to recover title width, and give empty-state card/bank actions dotted outlines.

**Architecture:** Keep payment-method copy composition in `primitives.ts` and layout behavior in `styles.ts`. Reuse existing `source-action-card` and `source-action-bank` modifier classes so the dotted outline does not affect transfer actions, the saved-list footer, or the add-method sheet.

**Tech Stack:** TypeScript 5.9, Lit 3, CSS in Lit templates, Mocha TDD with `@open-wc/testing`, Web Test Runner/Playwright.

---

## File map

- Modify `src/internal/primitives.ts`: render the default pill in the metadata row and omit the empty default overflow container.
- Modify `src/internal/styles.ts`: expand default rows to one outer column, keep the pill right-aligned/non-shrinking, and add dotted empty-action styles.
- Modify `src/test/commerce-hub-connect-primitives_test.ts`: cover structure, metadata fallback, narrow layout, and dotted action modifiers.
- Modify `src/test/commerce-hub-connect-payment-selection_test.ts`: update integrated default-placement assertions and verify saved-list behavior remains unchanged.

### Task 1: Move the Default pill into payment metadata

**Files:**
- Modify: `src/internal/primitives.ts`
- Modify: `src/internal/styles.ts`
- Test: `src/test/commerce-hub-connect-primitives_test.ts`
- Test: `src/test/commerce-hub-connect-payment-selection_test.ts`

- [ ] **Step 1: Write failing primitive structure tests**

Update the existing default-row test to assert:

```ts
const defaultLabel = defaultRow.querySelector<HTMLElement>(
  '.payment-method-default-label'
)!;

assert.isTrue(defaultRow.classList.contains('payment-method-row-default'));
assert.isTrue(
  defaultLabel.parentElement?.classList.contains('payment-method-meta-row')
);
assert.notExists(
  defaultRow.querySelector('.payment-method-overflow')
);
assert.equal(getComputedStyle(defaultLabel).marginLeft, 'auto');
assert.equal(getComputedStyle(defaultLabel).flexShrink, '0');
```

Render a default method without `accountLabel`, `brand`, or `last4` and assert that `.payment-method-meta-row` still exists, contains the default pill, and has no `.payment-method-meta`.

- [ ] **Step 2: Update the integrated placement assertion**

In the payment-selection test that currently expects the default pill inside `.payment-method-overflow`, change the relationship assertions to:

```ts
assert.strictEqual(
  defaultLabel.parentElement,
  selectedRow.querySelector('.payment-method-meta-row')
);
assert.notExists(selectedRow.querySelector('.payment-method-overflow'));
assert.notExists(
  selectedRow.querySelector('.payment-method-title-row .payment-method-default-label')
);
```

Preserve assertions proving there is no overflow trigger, Mark as default, or Remove action on the default row.

- [ ] **Step 3: Run the focused tests and verify RED**

```bash
BROWSERS=chromium npm run test:dev -- --files src/test/commerce-hub-connect-primitives_test.ts src/test/commerce-hub-connect-payment-selection_test.ts
```

Expected: failures show the pill is still under `.payment-method-overflow`, the default row lacks its one-column modifier, and metadata-free default rows lack the fallback row.

- [ ] **Step 4: Render the pill in the metadata row**

In `renderPaymentMethodCopy`, render metadata when either account metadata or the default pill is present:

```ts
const shouldRenderMeta = Boolean(accountLabel) || method.isDefault;
```

Use this metadata-row body:

```ts
<span class="payment-method-meta-row">
  ${accountLabel
    ? html`<span class="payment-method-meta">${accountLabel}</span>`
    : ''}
  ${method.isDefault
    ? html`<span class="payment-method-default-label">Default</span>`
    : ''}
</span>
```

Remove the default label from `renderPaymentMethodOverflowAction`. If the method has no actions, return an empty template before rendering `.payment-method-overflow`:

```ts
if (!hasActions) {
  return html``;
}
```

- [ ] **Step 5: Add the default-row layout modifier**

Add the row class alongside the existing row-state classes:

```ts
isDefault && 'payment-method-row-default'
```

Add focused styles:

```css
.payment-method-row-default {
  grid-template-columns: minmax(0, 1fr);
}

.payment-method-default-label {
  flex: 0 0 auto;
  margin-left: auto;
}
```

Keep the existing pill colors, padding, border, font size, and weight unchanged.

- [ ] **Step 6: Run focused tests and verify GREEN**

Run the Step 3 command. Expected: both browser test files pass.

- [ ] **Step 7: Commit the default-label layout**

```bash
git add src/internal/primitives.ts src/internal/styles.ts src/test/commerce-hub-connect-primitives_test.ts src/test/commerce-hub-connect-payment-selection_test.ts
git commit -m "feat: move default label into payment metadata"
```

### Task 2: Add dotted empty-state action borders

**Files:**
- Modify: `src/internal/styles.ts`
- Test: `src/test/commerce-hub-connect-primitives_test.ts`
- Test: `src/test/commerce-hub-connect-payment-selection_test.ts`

- [ ] **Step 1: Write failing dotted-border tests**

In the empty-screen primitive test, select the card and bank actions plus an independently rendered transfer action and assert:

```ts
assert.equal(getComputedStyle(cardAction).borderStyle, 'dotted');
assert.equal(getComputedStyle(bankAction).borderStyle, 'dotted');
assert.equal(getComputedStyle(transferAction).borderStyle, 'solid');
```

Add source-style assertions proving hover/focus retain the dotted modifier and stronger border color:

```ts
assert.include(
  primitiveStyles.cssText,
  '.source-action-card:hover:not(:disabled)'
);
assert.include(
  primitiveStyles.cssText,
  '.source-action-bank:focus-visible'
);
assert.include(primitiveStyles.cssText, 'border-color: var(--chc-border-strong)');
```

In the integration test, assert the empty-state card/bank actions compute to `dotted`, while the saved-list footer `Add payment method` button and add-sheet options do not.

- [ ] **Step 2: Run the focused tests and verify RED**

```bash
BROWSERS=chromium npm run test:dev -- --files src/test/commerce-hub-connect-primitives_test.ts src/test/commerce-hub-connect-payment-selection_test.ts
```

Expected: card and bank actions report `solid`, and the dotted hover/focus selectors are absent.

- [ ] **Step 3: Implement modifier-specific dotted styles**

Add:

```css
.source-action-card,
.source-action-bank {
  border-style: dotted;
  transition: border-color var(--chc-motion-base) var(--chc-ease-standard),
    background-color var(--chc-motion-base) var(--chc-ease-standard),
    box-shadow var(--chc-motion-base) var(--chc-ease-standard);
}

.source-action-card:hover:not(:disabled),
.source-action-card:focus-visible,
.source-action-bank:hover:not(:disabled),
.source-action-bank:focus-visible {
  border-color: var(--chc-border-strong);
  border-style: dotted;
  background: color-mix(
    in srgb,
    var(--chc-payment-method-background) 90%,
    var(--chc-soft-surface)
  );
  box-shadow: 0 0.5rem 1rem rgba(17, 24, 39, 0.04);
}

.source-action-card:focus-visible,
.source-action-bank:focus-visible {
  outline: 0.125rem solid var(--chc-focus-ring);
  outline-offset: 0.125rem;
}
```

Do not change `.source-action-transfer`, `.source-action-link`, `.payment-method-add-footer`, or `.add-payment-sheet-option`.

- [ ] **Step 4: Run focused tests and verify GREEN**

Run the Step 2 command. Expected: both browser test files pass.

- [ ] **Step 5: Commit dotted action styling**

```bash
git add src/internal/styles.ts src/test/commerce-hub-connect-primitives_test.ts src/test/commerce-hub-connect-payment-selection_test.ts
git commit -m "style: dot empty payment action borders"
```

### Task 3: Full verification

**Files:**
- Verify: all files changed by Tasks 1 and 2

- [ ] **Step 1: Format the modified files**

```bash
npx prettier --write src/internal/primitives.ts src/internal/styles.ts src/test/commerce-hub-connect-primitives_test.ts src/test/commerce-hub-connect-payment-selection_test.ts
```

Expected: Prettier exits 0.

- [ ] **Step 2: Run build and lint**

```bash
npm run build
npm run lint
```

Expected: build exits 0; lint exits 0 with only the two existing JSONForms missing-import warnings.

- [ ] **Step 3: Run the complete suite**

```bash
BROWSERS=chromium npm test
```

Expected: proxy-auth, package-surface, development browser, and production browser suites pass with zero failures.

- [ ] **Step 4: Audit scope and worktree state**

```bash
git diff --check HEAD~2..HEAD
git status --short
```

Confirm only the approved default-pill placement and dotted empty card/bank outlines changed. Confirm the pre-existing `.agents/skills/deploy-commercehub-connect` edits are not included in feature commits.
