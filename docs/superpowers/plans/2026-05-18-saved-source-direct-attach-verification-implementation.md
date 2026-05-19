# Saved Source Direct Attach Verification Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the saved payment source confirm/select flow with direct attach for verified sources and chevron-triggered verification for unverified sources.

**Architecture:** Drive the change from focused saved-source tests first, then remove the selection-only render path from the main widget and shared primitives. Reuse the existing `/interaction/source/{paymentSourceId}/attach` and `/interaction/verify/step1` endpoints, and route unverified saved-source verification into a compact outcome screen inside the embedded widget shell.

**Tech Stack:** TypeScript, Lit, shared widget primitives/styles, @web/test-runner, @open-wc/testing

---

## File Map

- Modify: `src/test/commerce-hub-connect-payment-selection_test.ts`
  Purpose: lock the saved-source list contract to no confirm button, no radio controls, immediate attach for verified rows, and chevron verification for unverified rows.
- Modify: `src/test/commerce-hub-connect-flow_test.ts`
  Purpose: cover end-to-end attach and verification requests for embedded widget saved sources.
- Modify: `src/test/commerce-hub-connect-primitives_test.ts`
  Purpose: update primitive markup expectations for compact link-style rows without radios and with chevron affordances.
- Modify: `src/internal/types.ts`
  Purpose: remove obsolete confirm/change actions and selected flags, and add an action for saved-source verification.
- Modify: `src/internal/primitives.ts`
  Purpose: render saved-source rows as direct actions with optional chevrons instead of radios and selected-review markup.
- Modify: `src/internal/styles.ts`
  Purpose: remove radio and selected-review styling and support the chevron action plus verification outcome presentation.
- Modify: `src/commerce-hub-connect.ts`
  Purpose: remove selected review mode, attach verified saved sources immediately, start `/interaction/verify/step1` for unverified sources, and render the verification outcome screen.

### Task 1: Replace The Saved-Source Tests

**Files:**
- Modify: `src/test/commerce-hub-connect-payment-selection_test.ts`
- Modify: `src/test/commerce-hub-connect-flow_test.ts`
- Modify: `src/test/commerce-hub-connect-primitives_test.ts`

- [ ] **Step 1: Write failing saved-source widget tests**

Add tests for these behaviors:

```ts
test('saved source list renders without confirm button or radio controls', async () => {});
test('clicking a verified saved source attaches it immediately', async () => {});
test('attached saved source continues to render the list instead of a selected review screen', async () => {});
test('clicking the unverified source chevron starts verify step1 and shows the verification screen', async () => {});
```

Primitive assertions should check that `renderPaymentMethodRow(...)` no longer emits a radio control and that unverified bank rows render a chevron action surface.

- [ ] **Step 2: Run focused tests to verify RED**

Run:

```bash
BROWSERS=chromium npm run test:dev -- --files test/commerce-hub-connect-payment-selection_test.js
BROWSERS=chromium npm run test:dev -- --files test/commerce-hub-connect-primitives_test.js
BROWSERS=chromium npm run test:dev -- --files test/commerce-hub-connect-flow_test.js
```

Expected: FAIL because the current implementation still renders confirm/change actions, radio controls, and the selected review mode.

### Task 2: Implement Direct Attach And Verification

**Files:**
- Modify: `src/internal/types.ts`
- Modify: `src/internal/primitives.ts`
- Modify: `src/internal/styles.ts`
- Modify: `src/commerce-hub-connect.ts`

- [ ] **Step 1: Remove selection-only saved-source types**

Delete obsolete flow actions from `FlowActionName` and remove `selected?: boolean` from `PaymentMethod` if it is only serving the old saved-source review state.

- [ ] **Step 2: Update the row primitive**

Make `renderPaymentMethodRow(...)` behave like a compact `source-action-link`:

```ts
renderPaymentMethodRow({
  ...method,
  verified: method.verified,
  onVerifyAction: 'verify-payment-source',
});
```

Verified rows should be clickable attach surfaces. Unverified rows should not attach on row click and should render a trailing chevron button that dispatches the verify action.

- [ ] **Step 3: Remove selected-review rendering from the widget**

Delete the `renderSelectedPaymentSourceScreen(...)`, `shouldRenderSelectedPaymentSourceScreen()`, `confirmSelectedPaymentSource()`, and `change-payment-source` routing that only served the old review mode.

- [ ] **Step 4: Implement verified saved-source attach**

On verified row click, post to:

```ts
`/interaction/source/${paymentSource.id}/attach`
```

Then refresh widget interaction state as needed and emit `onSuccess` with the attached source only after the attach request succeeds.

- [ ] **Step 5: Implement unverified saved-source verification**

Wire the chevron action to the existing verification request:

```ts
await this.postInteractionStep('/interaction/verify/step1', {value: source.id});
```

Route the response into a generic saved-source verification outcome screen that handles verified, under-review, require-info, declined, and fallback failure states.

- [ ] **Step 6: Update shared styling**

Remove radio/selected-review CSS, preserve the compact premium-minimal row treatment, and style the chevron affordance plus verification outcome copy within the existing white-label token system.

### Task 3: Verify Green And Guard Regressions

**Files:**
- No additional edits expected

- [ ] **Step 1: Re-run the focused development suites**

Run:

```bash
BROWSERS=chromium npm run test:dev -- --files test/commerce-hub-connect-payment-selection_test.js
BROWSERS=chromium npm run test:dev -- --files test/commerce-hub-connect-primitives_test.js
BROWSERS=chromium npm run test:dev -- --files test/commerce-hub-connect-flow_test.js
```

Expected: PASS.

- [ ] **Step 2: Run production-mode coverage for the touched suites**

Run:

```bash
BROWSERS=chromium npm run test:prod -- --files test/commerce-hub-connect-payment-selection_test.js
BROWSERS=chromium npm run test:prod -- --files test/commerce-hub-connect-primitives_test.js
BROWSERS=chromium npm run test:prod -- --files test/commerce-hub-connect-flow_test.js
```

Expected: PASS.

- [ ] **Step 3: Run a fresh build**

Run:

```bash
npm run build
```

Expected: PASS.

- [ ] **Step 4: Summarize verification evidence**

Report:

- changed files
- focused commands that passed
- any residual repo-wide issues outside this saved-source change
