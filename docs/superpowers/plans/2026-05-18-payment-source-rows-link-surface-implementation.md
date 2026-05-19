# Payment Source Rows Link Surface Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make saved payment source rows use the same `source-action-link` surface treatment as the add-card and add-bank-account actions while keeping selection behavior unchanged.

**Architecture:** Drive the change from the payment-source flow test first, then implement the smallest possible style update in the shared widget stylesheet. Keep row-specific content and selected-state behavior intact; only align the shared surface language.

**Tech Stack:** TypeScript, Lit, shared CSS-in-JS styles, @web/test-runner, @open-wc/testing

---

## File Map

- Modify: `src/test/commerce-hub-connect-flow_test.ts`
  Purpose: lock the new row/action visual consistency in the payment-source flow.
- Modify: `src/internal/styles.ts`
  Purpose: align payment row surfaces to `source-action-link`.
- Read only unless needed: `src/test/commerce-hub-connect-primitives_test.ts`
  Purpose: only update if the surface change breaks an existing primitive assertion.

### Task 1: Write The Failing Flow Test

**Files:**
- Modify: `src/test/commerce-hub-connect-flow_test.ts`
- Test: `test/commerce-hub-connect-flow_test.js`

- [ ] **Step 1: Update the flow test to compare saved rows to add-action links**

Inside `renders payment methods with compact rows, link actions, and a Confirm CTA`, add style-parity assertions for an unselected saved row and the add-card link:

```ts
const unselectedRow = rows[1]!;

assert.equal(
  getComputedStyle(unselectedRow).backgroundColor,
  getComputedStyle(addCardLink).backgroundColor
);
assert.equal(
  getComputedStyle(unselectedRow).borderRadius,
  getComputedStyle(addCardLink).borderRadius
);
assert.equal(
  getComputedStyle(unselectedRow).paddingTop,
  getComputedStyle(addCardLink).paddingTop
);
assert.equal(
  getComputedStyle(unselectedRow).paddingLeft,
  getComputedStyle(addCardLink).paddingLeft
);
assert.equal(
  getComputedStyle(unselectedRow).columnGap,
  getComputedStyle(addCardLink).columnGap
);
assert.equal(getComputedStyle(unselectedRow).alignItems, 'center');
```

Keep the existing selected-row assertions so the stronger selected affordance remains covered.

- [ ] **Step 2: Run the focused flow test to verify RED**

Run:

```bash
npm run build
BROWSERS=chromium npm run test:dev -- --files test/commerce-hub-connect-flow_test.js
```

Expected: FAIL because payment rows still use slightly different padding, gap, and background from `source-action-link`.

### Task 2: Implement The Shared Surface Alignment

**Files:**
- Modify: `src/internal/styles.ts`
- Test: `test/commerce-hub-connect-flow_test.js`

- [ ] **Step 1: Align payment row surface metrics with `source-action-link`**

In `src/internal/styles.ts`, update `.payment-method-row` and `.selected-payment-method` so their shared surface matches `source-action-link`:

```ts
.payment-method-row,
.selected-payment-method {
  gap: 0.5rem;
  padding: 0.625rem 0.75rem;
  background: var(--chc-soft-surface);
}
```

Do not change:

```ts
grid-template-columns: 2.25rem minmax(0, 1fr) 1rem;
```

Keep the selected-row emphasis:

```ts
.payment-method-row[aria-checked='true'],
.selected-payment-method {
  border-color: var(--chc-primary);
  box-shadow: 0 0 0 0.0625rem
    color-mix(in srgb, var(--chc-primary) 28%, transparent);
}
```

- [ ] **Step 2: Rebuild and re-run the focused flow test to verify GREEN**

Run:

```bash
npm run build
BROWSERS=chromium npm run test:dev -- --files test/commerce-hub-connect-flow_test.js
```

Expected: PASS.

- [ ] **Step 3: Run the focused primitive test to guard against style regressions**

Run:

```bash
BROWSERS=chromium npm run test:dev -- --files test/commerce-hub-connect-primitives_test.js
```

Expected: PASS. If an assertion now encodes the old row spacing, update only the minimum affected expectation.

### Task 3: Final Verification

**Files:**
- No additional edits expected

- [ ] **Step 1: Verify the affected widget suites in production mode**

Run:

```bash
BROWSERS=chromium npm run test:prod -- --files test/commerce-hub-connect-flow_test.js
BROWSERS=chromium npm run test:prod -- --files test/commerce-hub-connect-primitives_test.js
```

Expected: PASS.

- [ ] **Step 2: Summarize results**

Report:

- the files changed
- the focused commands that passed
- any remaining repo-wide failures that are outside this row-surface change
