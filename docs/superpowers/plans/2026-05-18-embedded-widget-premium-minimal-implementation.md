# Embedded Widget Premium Minimal Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refresh the embedded widget screens to a compact premium-minimal look while preserving existing white-label behavior and flow logic.

**Architecture:** Keep the redesign concentrated in shared widget primitives and style tokens so every embedded screen inherits the refresh without changing business logic. Use TDD for any test-visible structure or style-default changes, then verify with focused browser tests and a full build.

**Tech Stack:** TypeScript, Lit, shared CSS-in-JS styles, @open-wc/testing, @web/test-runner, Playwright browsers

---

## File Map

- Modify: `src/internal/styles.ts`
  Purpose: compact premium-minimal defaults for shell, typography hierarchy, controls, rows, alerts, OTP, outcome, and detail surfaces.
- Modify: `src/test/commerce-hub-connect-primitives_test.ts`
  Purpose: assert updated widget token defaults and compact visual metrics that are safe to lock in tests.
- Modify: `src/test/commerce-hub-connect-flow_test.ts`
  Purpose: only if a screen-level structure/class assertion becomes necessary during implementation.
- Read only unless needed: `src/internal/primitives.ts`, `src/internal/types.ts`, `src/commerce-hub-connect.ts`
  Purpose: preserve existing rendering behavior unless a minimal structural hook is required.

### Task 1: Lock The New Default Visual Contract In Tests

**Files:**
- Modify: `src/test/commerce-hub-connect-primitives_test.ts`
- Test: `src/test/commerce-hub-connect-primitives_test.ts`

- [ ] **Step 1: Write the failing test updates for compact premium defaults**

Replace the current default-token expectations in `renders the widget shell with SDK v2 token defaults and shell affordances` with assertions for the new neutral premium defaults:

```ts
assert.equal(
  getComputedStyle(el)
    .getPropertyValue('--chc-primary')
    .trim()
    .toUpperCase(),
  '#162033'
);
assert.equal(
  getComputedStyle(el).getPropertyValue('--chc-text').trim().toUpperCase(),
  '#111827'
);
assert.equal(
  getComputedStyle(el).getPropertyValue('--chc-copy').trim().toUpperCase(),
  '#4B5565'
);
assert.equal(getComputedStyle(el).fontFamily.includes('Open Sans'), false);
assert.equal(
  getComputedStyle(el).getPropertyValue('--chc-font-weight').trim(),
  '400'
);
assert.equal(getComputedStyle(title).fontSize, '19.2px');
assert.equal(getComputedStyle(title).fontWeight, '600');
assert.equal(getComputedStyle(paymentMeta).fontWeight, '400');
```

Add compact shell and control assertions in the same test and `applies partial designConfig color and typography without resizing controls`:

```ts
assert.equal(getComputedStyle(shell).paddingTop, '24px');
assert.equal(getComputedStyle(shell).paddingRight, '20px');
assert.equal(getComputedStyle(shell).paddingBottom, '20px');
assert.equal(getComputedStyle(shell).paddingLeft, '20px');
assert.equal(getComputedStyle(button).minHeight, '44px');
assert.equal(getComputedStyle(button).fontWeight, '600');
assert.equal(getComputedStyle(button).paddingTop, '0px');
assert.equal(getComputedStyle(button).paddingBottom, '0px');
```

Tighten the OTP primitive test to assert the denser control height instead of the current loose padding values:

```ts
assert.equal(otpInputStyles.fontWeight, '400');
assert.equal(otpInputStyles.fontSize, '16px');
assert.equal(otpInputStyles.minHeight, '44px');
```

- [ ] **Step 2: Run the focused primitive test to verify RED**

Run:

```bash
BROWSERS=chromium npm run test:dev -- --files src/test/commerce-hub-connect-primitives_test.ts
```

Expected: FAIL because the current widget defaults still use the old blue palette, `Open Sans`, lighter body weight, and roomier spacing.

- [ ] **Step 3: Update test only if the failure is for the wrong reason**

If the test fails because the command path is wrong rather than because styles are old, re-run with the compiled path already used in this repo:

```bash
BROWSERS=chromium npm run test:dev -- --files test/commerce-hub-connect-primitives_test.js
```

Expected: FAIL on the new default-style assertions.

- [ ] **Step 4: Commit the red test state only if requested**

Do not commit unless the human explicitly asks for commits.

### Task 2: Implement The Compact Premium-Minimal Style System

**Files:**
- Modify: `src/internal/styles.ts`
- Read only unless needed: `src/internal/primitives.ts`, `src/commerce-hub-connect.ts`
- Test: `src/test/commerce-hub-connect-primitives_test.ts`

- [ ] **Step 1: Update the root token defaults in `src/internal/styles.ts`**

Change the top-level design tokens to a more neutral premium baseline and compact shell rhythm:

```ts
:host {
  --chc-text: #111827;
  --chc-copy: #4b5565;
  --chc-muted: #6b7280;
  --chc-placeholder: #9ca3af;
  --chc-surface: #ffffff;
  --chc-soft-surface: #f7f8fa;
  --chc-border: #dde3ea;
  --chc-border-strong: #cdd5df;
  --chc-primary: #162033;
  --chc-disabled-text: #ffffff;
  --chc-disabled-surface: #c5ccd8;
  --chc-font-family: Inter, 'Segoe UI', Arial, sans-serif;
  --chc-radius-control: 0.75rem;
  --chc-radius-card: 1rem;
  --chc-radius-shell: 1rem;
  --chc-input-height: 2.75rem;
  --chc-font-weight: 400;
  --chc-divider: #ebeef2;
  --chc-focus-ring: rgba(22, 32, 51, 0.14);
  --chc-shell-padding: 1.5rem 1.25rem 1.25rem;
  --chc-shell-shadow: 0 0.125rem 0.375rem rgba(17, 24, 39, 0.04),
    0 0.75rem 1.5rem rgba(17, 24, 39, 0.08);
}
```

- [ ] **Step 2: Compact the shell, headings, and layout rhythm**

Adjust shared shell spacing and hierarchy in `src/internal/styles.ts`:

```ts
.widget-shell {
  max-width: 25.5rem;
  padding: var(--chc-shell-padding);
  border: 0.0625rem solid color-mix(in srgb, var(--chc-border) 84%, white);
  border-radius: var(--chc-radius-shell);
  box-shadow: var(--chc-shell-shadow);
}

.widget-title {
  font-size: 1.2rem;
  font-weight: 600;
  letter-spacing: -0.02em;
}

.widget-subtitle {
  margin: 0.375rem 0 0;
  color: var(--chc-copy);
  font-size: 0.9375em;
}

.widget-content {
  margin-top: 1.125rem;
}

.primitive-stack,
.payment-flow,
.otp-flow,
.bank-provider-flow {
  gap: 0.75rem;
}

.primitive-actions,
.primitive-footer,
.payment-action-links,
.outcome-actions {
  gap: 0.625rem;
}
```

- [ ] **Step 3: Tighten controls and interaction states**

Update button, field, OTP, and link controls to the compact 44px rhythm:

```ts
.button {
  min-height: 2.75rem;
  border-radius: var(--chc-radius-control);
  padding: 0 1rem;
  font-weight: 600;
  transition: border-color 120ms ease, background-color 120ms ease,
    box-shadow 120ms ease, transform 120ms ease;
}

.button:hover:not(:disabled) {
  transform: translateY(-0.0625rem);
}

.field-input,
.field-control-card-form,
.otp-input,
.source-action-link {
  min-height: 2.75rem;
}

.field-input {
  padding: 0.625rem 0.75rem;
}

.otp-inputs {
  width: min(100%, 18.75rem);
  gap: 0.375rem;
}

.otp-input {
  border-radius: 0.75rem;
  font-weight: 400;
  padding: 0;
}
```

- [ ] **Step 4: Refine rows, alerts, and supporting surfaces**

Compact the supporting primitives without changing behavior:

```ts
.payment-method-row,
.selected-payment-method {
  grid-template-columns: 2.25rem minmax(0, 1fr) 1rem;
  gap: 0.625rem;
  border-radius: 1rem;
  padding: 0.75rem;
  background: color-mix(in srgb, var(--chc-soft-surface) 88%, white);
}

.payment-method-icon-chip {
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 0.6875rem;
}

.alert {
  min-height: 0;
  border-radius: 0.875rem;
  padding: 0.625rem 0.75rem;
}

.detail-row,
.verification-detail-row {
  min-height: 0;
  padding: 0.75rem 1rem;
}

.powered-by-footer {
  margin-top: 1.25rem;
  font-size: 0.875em;
}
```

- [ ] **Step 5: Re-run the focused primitive test to verify GREEN**

Run:

```bash
BROWSERS=chromium npm run test:dev -- --files src/test/commerce-hub-connect-primitives_test.ts
```

If the repo still expects compiled `test/*.js` paths, run:

```bash
BROWSERS=chromium npm run test:dev -- --files test/commerce-hub-connect-primitives_test.js
```

Expected: PASS with the new compact premium defaults.

- [ ] **Step 6: Refactor only if needed**

If multiple selectors repeat the same compact spacing or transition rules, extract them into existing shared selector groups inside `src/internal/styles.ts`. Do not add new public API.

### Task 3: Verify Screen-Level Stability And Ship

**Files:**
- Modify only if needed: `src/test/commerce-hub-connect-flow_test.ts`
- Test: `src/test/commerce-hub-connect-flow_test.ts`
- Test: package build output

- [ ] **Step 1: Run the focused flow test suite**

Run:

```bash
BROWSERS=chromium npm run test:dev -- --files src/test/commerce-hub-connect-flow_test.ts
```

Fallback if the runner needs compiled paths:

```bash
BROWSERS=chromium npm run test:dev -- --files test/commerce-hub-connect-flow_test.js
```

Expected: PASS. If a screen-level assertion fails because a class or structure changed, update only the minimum necessary assertions in `src/test/commerce-hub-connect-flow_test.ts`.

- [ ] **Step 2: Run the package build**

Run:

```bash
npm run build
```

Expected: PASS with no TypeScript or build errors.

- [ ] **Step 3: Run the full browser test suite if time allows or if focused tests reveal regressions**

Run:

```bash
npm test
```

Expected: PASS. If this is too slow for iteration, still run it before claiming the redesign is complete.

- [ ] **Step 4: Summarize outcomes**

Report:

- which files changed
- which focused tests and verification commands passed
- whether any public API or white-label surface changed
