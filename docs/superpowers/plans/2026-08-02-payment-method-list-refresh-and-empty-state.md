# Payment Method List Refresh and Empty-State Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the payment-method list refresh after mutations and return navigation, present the approved outlined empty state, protect the default method from deletion, and apply the recipient-status badge matrix.

**Architecture:** Keep recipient eligibility and labels in the existing pure payment-source helper, and keep row/menu rendering inside the payment primitives. Reuse the existing interaction refresh controller for authoritative post-mutation and return-to-list reads, with one list-navigation method enforcing refresh by default.

**Tech Stack:** TypeScript 5.9, Lit 3, Mocha TDD with `@open-wc/testing`, Web Test Runner/Playwright, ESLint, lit-analyzer.

---

## File map

- Modify `src/internal/payment-source-selection.ts`: produce the verified badge label from verification and recipient state.
- Modify `src/internal/primitives.ts`: render card/bank source icons without chevrons and suppress empty/default overflow menus.
- Modify `src/internal/screens/payment-methods-screen.ts`: render approved empty-state outlined actions.
- Modify `src/internal/styles.ts`: size and align the outlined empty-state controls and their SVG icons.
- Modify `src/commerce-hub-connect.ts`: update empty-state defaults and refresh after mutations and all list-return navigation.
- Modify `src/test/commerce-hub-connect-primitives_test.ts`: cover primitive structure, icons, chevron absence, and default menu behavior.
- Modify `src/test/commerce-hub-connect-payment-selection_test.ts`: cover empty-state integration, recipient labels, and attach refresh.
- Modify `src/test/commerce-hub-connect-flow_test.ts`: cover card/ACH refreshes and return-to-list refreshes.

### Task 1: Recipient labels and default method actions

**Files:**
- Modify: `src/internal/payment-source-selection.ts`
- Modify: `src/internal/primitives.ts`
- Test: `src/test/commerce-hub-connect-primitives_test.ts`
- Test: `src/test/commerce-hub-connect-payment-selection_test.ts`

- [ ] **Step 1: Write failing tests for the verified-label matrix**

Update `recipient provisioning controls verified bank labels and selection radios` so the expected labels are:

```ts
assert.deepEqual(
  rows.map((row) =>
    row.querySelector('.verification-status-badge')?.textContent?.trim()
  ),
  ['Verified & Provisioned', 'Verified & Provisioned', 'Verified']
);
```

Add a present-but-blank recipient source and assert that it has the `Verified` badge and no radio. Add a verified card assertion expecting `Verified & Provisioned`. Preserve the existing non-verified and missing-status assertions.

- [ ] **Step 2: Write a failing primitive test for the default method menu**

Render one default and one non-default method with `showMarkAsDefault: true`, then assert:

```ts
assert.exists(defaultRow.querySelector('.payment-method-default-label'));
assert.notExists(defaultRow.querySelector('[data-action="toggle-payment-source-menu"]'));
assert.notExists(defaultRow.querySelector('[data-action="delete-payment-source"]'));
assert.exists(nonDefaultRow.querySelector('[data-action="toggle-payment-source-menu"]'));
assert.exists(nonDefaultRow.querySelector('[data-action="mark-payment-source-default"]'));
assert.exists(nonDefaultRow.querySelector('[data-action="delete-payment-source"]'));
```

- [ ] **Step 3: Run the focused tests and verify RED**

```bash
BROWSERS=chromium npm run test:dev -- --files src/test/commerce-hub-connect-primitives_test.ts src/test/commerce-hub-connect-payment-selection_test.ts
```

Expected: failures show the old `Ready`/`Verified & Ready` labels and the default row still exposes overflow/delete controls.

- [ ] **Step 4: Implement the verified label helper**

Replace `paymentSourceVerificationLabel` with:

```ts
export const paymentSourceVerificationLabel = (
  source: PaymentSource
): string | undefined => {
  if (source.verificationInfo?.status !== 'VERIFIED') {
    return undefined;
  }

  if (
    isBankPaymentSource(source) &&
    source.recipient &&
    normalizedRecipientStatus(source) !== 'PROVISIONED'
  ) {
    return 'Verified';
  }

  return 'Verified & Provisioned';
};
```

Do not change `isPaymentSourceSelectionEligible`; it already matches the approved eligibility matrix.

- [ ] **Step 5: Suppress default deletion and empty overflow menus**

Inside `renderPaymentMethodOverflowAction`, compute:

```ts
const showMarkAsDefaultAction =
  showMarkAsDefault &&
  !method.isDefault &&
  isPaymentMethodSelectionEligible(method);
const showRemoveAction = !method.isDefault;
const showMenuTrigger = showMarkAsDefaultAction || showRemoveAction;
```

Always retain the `Default` label. Render the overflow trigger/menu only when `showMenuTrigger` is true, `Mark as default` only for `showMarkAsDefaultAction`, and `Remove` only for `showRemoveAction`.

- [ ] **Step 6: Run focused tests and verify GREEN**

Run the Step 3 command. Expected: both test files pass.

- [ ] **Step 7: Commit the status and menu behavior**

```bash
git add src/internal/payment-source-selection.ts src/internal/primitives.ts src/test/commerce-hub-connect-primitives_test.ts src/test/commerce-hub-connect-payment-selection_test.ts
git commit -m "feat: align payment method status actions"
```

### Task 2: Approved empty-list action design

**Files:**
- Modify: `src/internal/primitives.ts`
- Modify: `src/internal/screens/payment-methods-screen.ts`
- Modify: `src/internal/styles.ts`
- Modify: `src/commerce-hub-connect.ts`
- Test: `src/test/commerce-hub-connect-primitives_test.ts`
- Test: `src/test/commerce-hub-connect-payment-selection_test.ts`

- [ ] **Step 1: Update empty-state integration tests**

Replace the old header-launcher expectations with:

```ts
assert.equal(
  el.shadowRoot!.querySelector('.widget-title')?.textContent?.trim(),
  'Payment methods'
);
assert.notExists(el.shadowRoot!.querySelector('.widget-header-action'));
assert.exists(el.shadowRoot!.querySelector('[data-action="add-card"]'));
assert.notExists(el.shadowRoot!.querySelector('[data-action="add-bank-account"]'));
```

For both allowed tender types, assert the ordered buttons and copy:

```ts
assert.deepEqual(
  [...el.shadowRoot!.querySelectorAll<HTMLButtonElement>('.source-action')].map(
    (button) => [
      button.dataset.action,
      button.querySelector('.source-action-title')?.textContent?.trim(),
      button.querySelector('.source-action-subtitle')?.textContent?.trim(),
    ]
  ),
  [
    ['add-card', 'Add credit or debit card', 'Add your card details'],
    ['add-bank-account', 'Add bank account', 'Connect or enter an account'],
  ]
);
assert.notExists(el.shadowRoot!.querySelector('.source-action-link-chevron'));
```

- [ ] **Step 2: Add failing primitive icon assertions**

```ts
assert.exists(emptyScreen.querySelector('[data-action="add-card"] [data-source-action-icon="card"]'));
assert.exists(emptyScreen.querySelector('[data-action="add-bank-account"] [data-source-action-icon="bank"]'));
assert.notExists(emptyScreen.querySelector('.source-action-link-chevron'));
```

- [ ] **Step 3: Run focused tests and verify RED**

```bash
BROWSERS=chromium npm run test:dev -- --files src/test/commerce-hub-connect-primitives_test.ts src/test/commerce-hub-connect-payment-selection_test.ts
```

Expected: failures show the old heading/header launcher and missing inline actions/subtitles/icons.

- [ ] **Step 4: Render content-level outlined actions**

In `renderNoSavedPaymentMethodsScreen`, use the non-link source-action variant:

```ts
renderSourceAction({
  label: copy.addCardTitle,
  subtitle: copy.addCardSubtitle,
  action: 'add-card',
  icon: 'card',
  disabled: deletePending,
})
```

Apply the equivalent call for `add-bank-account`. Do not pass `variant: 'link'`.

- [ ] **Step 5: Add card and bank SVGs to the primitive**

Change `renderSourceActionIcon` so card and bank render the existing Font Awesome card/building-columns paths from `renderAddPaymentSourceOption`. Set `data-source-action-icon=${icon}`, `aria-hidden="true"`, and SVG `viewBox="0 0 640 640"` with `focusable="false"`. Preserve the transfer branch.

- [ ] **Step 6: Apply the empty-state shell and defaults**

In `renderNoSavedPaymentMethods`, remove `headerAction` and pass `canAddPaymentSources` through to `renderNoSavedPaymentMethodsScreen`. In `resolveNoSavedPaymentMethodsCopy`, set:

```ts
title: copy?.title ?? 'Payment methods',
addBankAccountSubtitle:
  copy?.addBankAccountSubtitle ?? 'Connect or enter an account',
addCardSubtitle: copy?.addCardSubtitle ?? 'Add your card details',
```

- [ ] **Step 7: Style option A**

Keep `.payment-action-links` as a one-column grid. Give `.source-action` `min-height: 4.5rem`, `gap: 0.75rem`, and `padding: 0.875rem 1rem`. Size `.source-action-icon svg` to `1.5rem` square with `fill: currentColor`; keep `.source-action-copy` left aligned with a small vertical gap. Do not add a trailing grid column.

- [ ] **Step 8: Run focused tests and verify GREEN**

Run the Step 3 command. Expected: both test files pass.

- [ ] **Step 9: Commit the empty-state UI**

```bash
git add src/internal/primitives.ts src/internal/screens/payment-methods-screen.ts src/internal/styles.ts src/commerce-hub-connect.ts src/test/commerce-hub-connect-primitives_test.ts src/test/commerce-hub-connect-payment-selection_test.ts
git commit -m "feat: add payment method empty actions"
```

### Task 3: Authoritative interaction refreshes

**Files:**
- Modify: `src/commerce-hub-connect.ts`
- Test: `src/test/commerce-hub-connect-payment-selection_test.ts`
- Test: `src/test/commerce-hub-connect-flow_test.ts`

- [ ] **Step 1: Write failing attach-refresh coverage**

Update attach-success and mark-as-default tests so `GET /interaction` returns the authoritative list and assert:

```ts
assert.deepEqual(
  requests.map((request) => `${request.method} ${new URL(request.url).pathname}`),
  ['POST /interaction/source/card-1/attach', 'GET /interaction']
);
assert.lengthOf(selectEvents, 1);
```

For mark-as-default, preserve its zero `onSelect` assertion.

- [ ] **Step 2: Write failing card and ACH refresh coverage**

In the successful card, legacy ACH, and v2 ACH flow tests, return the created source from `GET /interaction` and assert mutation-then-refresh ordering:

```ts
assert.deepEqual(requestedPaths.slice(-2), [
  '/interaction/source/card',
  '/interaction',
]);
```

Use `/interaction/source/ach` and `/interaction/source/v2/ach` for the ACH cases. Preserve one `onAddPaymentMethod` event per mutation.

- [ ] **Step 3: Write failing return-to-list refresh coverage**

Extend Escape/back tests so returning from card, bank, required-info, verification, and transfer views records one `GET /interaction`. Dispatch the public UI actions `back-to-payment-methods`, `change-payment-source`, `done-payment-source-verification`, `continue-bank-outcome`, and `done-bank-outcome`. Keep Pay by Bank terminal outcome/failure expectations.

- [ ] **Step 4: Run focused tests and verify RED**

```bash
BROWSERS=chromium npm run test:dev -- --files src/test/commerce-hub-connect-payment-selection_test.ts src/test/commerce-hub-connect-flow_test.ts
```

Expected: mutation tests lack the post-mutation GET and the Escape return lacks a refresh.

- [ ] **Step 5: Refresh after successful mutations**

After each successful local update in `saveCard`, `saveManualBankAccount`, and `saveLegacyManualBankAccount`, attempt the refresh separately from the completed mutation:

```ts
try {
  await this.fetchInteraction(interactionId);
} catch (cause) {
  void cause;
}
```

Place it after emitting the single add event and before presenting added-source status. A refresh failure must not convert a successful mutation into a save failure or emit the add event again. In `attachPaymentSource`, set the attach response, attempt the same isolated refresh, then resolve the authoritative attached source with the local source as fallback before emitting `onSelect`. Mark-as-default stays on the list and does not emit `onSelect`.

- [ ] **Step 6: Refresh list-return navigation by default**

```ts
private showPaymentSourceList({refresh = true}: {refresh?: boolean} = {})
```

Keep the existing `if (refresh) void this.refreshPaymentSourcesForList()` branch. The Escape path now refreshes; existing explicit callers remain valid, and the refresh controller deduplicates concurrent requests.

- [ ] **Step 7: Run focused tests and verify GREEN**

Run the Step 4 command. Expected: both files pass with mutation-then-refresh ordering and one completion event per mutation.

- [ ] **Step 8: Commit refresh behavior**

```bash
git add src/commerce-hub-connect.ts src/test/commerce-hub-connect-payment-selection_test.ts src/test/commerce-hub-connect-flow_test.ts
git commit -m "feat: refresh payment methods after mutations"
```

### Task 4: Full verification and scope audit

**Files:**
- Verify: all modified files
- Reference: `docs/superpowers/specs/2026-08-02-payment-method-list-refresh-and-empty-state-design.md`

- [ ] **Step 1: Format modified files**

```bash
npx prettier --write src/internal/payment-source-selection.ts src/internal/primitives.ts src/internal/screens/payment-methods-screen.ts src/internal/styles.ts src/commerce-hub-connect.ts src/test/commerce-hub-connect-primitives_test.ts src/test/commerce-hub-connect-payment-selection_test.ts src/test/commerce-hub-connect-flow_test.ts
```

Expected: Prettier exits 0. Keep unrelated `.agents/skills/deploy-commercehub-connect` files untouched.

- [ ] **Step 2: Run lint and build**

```bash
npm run lint
npm run build
```

Expected: both commands exit 0 without errors.

- [ ] **Step 3: Run the complete suite**

```bash
BROWSERS=chromium npm test
```

Expected: proxy-auth, package-surface, development browser, and production browser suites pass with zero failures.

- [ ] **Step 4: Audit requirements and diff**

```bash
git diff --check HEAD~3..HEAD
git status --short
git diff HEAD~3..HEAD -- src docs/superpowers/specs/2026-08-02-payment-method-list-refresh-and-empty-state-design.md
```

Confirm test evidence for the empty heading/actions, chevron absence, default deletion protection, complete badge/eligibility matrix, and every required refresh. Confirm pre-existing `.agents/skills/deploy-commercehub-connect` changes are not in feature commits.

- [ ] **Step 5: Commit formatting-only changes if produced**

```bash
git add src/internal/payment-source-selection.ts src/internal/primitives.ts src/internal/screens/payment-methods-screen.ts src/internal/styles.ts src/commerce-hub-connect.ts src/test/commerce-hub-connect-primitives_test.ts src/test/commerce-hub-connect-payment-selection_test.ts src/test/commerce-hub-connect-flow_test.ts
git diff --cached --quiet || git commit -m "style: format payment method updates"
```
