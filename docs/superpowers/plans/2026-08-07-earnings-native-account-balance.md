# Earnings Native Account Balance Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Show only native payment sources whose trimmed top-level name ends with the exact suffix ` - Earnings`, and render their fetched balances beside the masked account number.

**Architecture:** Filter at the Wallet SDK payment-list mapping boundary so MPP responses, transfers, and interaction state remain unchanged. Reuse the native balance controller and API mapping; adjust the shared row primitive so native balance content renders inside the metadata row while non-native trailing behavior remains intact.

**Tech Stack:** TypeScript 5.9, Lit 3, `@web/test-runner`, Playwright Chromium, Mocha TDD, Chai.

---

## File Map

- Modify `src/commerce-hub-connect.ts`: add the suffix predicate and filter native list rows.
- Modify `src/internal/primitives.ts`: place native balance/loading content after the account label.
- Modify `src/internal/styles.ts`: style the inline native balance.
- Modify `src/test/commerce-hub-connect-payment-selection_test.ts`: cover filtering and end-to-end balance rendering.
- Modify `src/test/commerce-hub-connect-primitives_test.ts`: cover native inline placement and non-native trailing placement.

These files contain restored, uncommitted user work. Do not make implementation commits that mix this feature with those changes. Leave feature edits unstaged for review.

### Task 1: Filter the payment-method list by the exact Earnings suffix

**Files:**
- Modify: `src/test/commerce-hub-connect-payment-selection_test.ts`
- Modify: `src/commerce-hub-connect.ts`

- [ ] **Step 1: Write the failing integration test**

Add a payment-list test containing a card, a bank account, and verified native sources with these names:

```ts
const nativeSources = [
  {id: 'native-exact', name: 'Primary - Earnings'},
  {id: 'native-spaced', name: 'Reserve - Earnings   '},
  {id: 'native-lowercase', name: 'Primary - earnings'},
  {id: 'native-middle', name: 'Earnings - Reserve'},
  {id: 'native-missing', name: undefined},
];
```

Give each native source a unique `positionId`. Assert row IDs include the card, bank account, `native-exact`, and `native-spaced`, but exclude the other native IDs.

- [ ] **Step 2: Run the focused test and verify RED**

Run:

```bash
BROWSERS=chromium npm run test:dev -- --grep "shows only native accounts whose name ends with the Earnings suffix"
```

Expected: FAIL because all native payment sources currently map to rows.

- [ ] **Step 3: Add the minimal visibility predicate**

In `src/commerce-hub-connect.ts`, add:

```ts
const EARNINGS_NATIVE_ACCOUNT_NAME_SUFFIX = ' - Earnings';

const isVisiblePaymentListSource = (source: PaymentSource): boolean =>
  !isNativePaymentSource(source) ||
  source.name?.trim().endsWith(EARNINGS_NATIVE_ACCOUNT_NAME_SUFFIX) === true;
```

Filter only `paymentSources` inside `paymentMethodsFromInteractionResponse`:

```ts
return paymentSources
  .filter(isVisiblePaymentListSource)
  .map((source) =>
    paymentSourceToPaymentMethod(source, {
      ...options,
      isDefault: Boolean(selectedSourceId && source.id === selectedSourceId),
    })
  );
```

Do not apply the predicate to transfer sources, interaction data, or MPP calls.

- [ ] **Step 4: Run the focused test and verify GREEN**

Run the Step 2 command again. Expected: PASS with exact, case-sensitive suffix matching after trimming.

- [ ] **Step 5: Inspect the isolated diff**

```bash
git diff -- src/commerce-hub-connect.ts src/test/commerce-hub-connect-payment-selection_test.ts
```

Expected: only the predicate, list filter, and focused test are attributable to this task. Do not stage overlapping files.

### Task 2: Render native balance beside the account number

**Files:**
- Modify: `src/test/commerce-hub-connect-primitives_test.ts`
- Modify: `src/internal/primitives.ts`
- Modify: `src/internal/styles.ts`

- [ ] **Step 1: Write failing primitive placement tests**

Render this native method:

```ts
const nativeMethod: PaymentMethod = {
  id: 'native-earnings',
  label: 'Primary - Earnings',
  accountLabel: 'FFPTXNEARN xx 7890',
  balanceLabel: '$125.50',
  type: 'native',
  brand: 'FFPTXNEARN',
  last4: '7890',
  status: 'verified',
};
```

Assert:

```ts
const metaRow = row.querySelector('.payment-method-meta-row')!;
assert.equal(
  metaRow.querySelector('.payment-method-balance')?.textContent?.trim(),
  '$125.50'
);
assert.notExists(
  row.querySelector('.payment-method-trailing .payment-method-balance')
);
```

Render another native method with `balanceLoading: true` and assert the loader is inside `.payment-method-meta-row`, not `.payment-method-trailing`. Render a card with `balanceLabel: '$10.00'` and assert it stays in `.payment-method-trailing`.

- [ ] **Step 2: Run the focused primitive tests and verify RED**

```bash
BROWSERS=chromium npm run test:dev -- --grep "renders native balance beside the account number"
```

Expected: FAIL because balance content currently renders only in `.payment-method-trailing`.

- [ ] **Step 3: Move native balance content into metadata**

In `renderPaymentMethodCopy`, use:

```ts
const hasInlineNativeBalance =
  method.type === 'native' &&
  (Boolean(method.balanceLabel) || method.balanceLoading === true);
const shouldRenderMeta =
  Boolean(accountLabel) || method.isDefault || hasInlineNativeBalance;
```

Immediately after `.payment-method-meta`, render:

```ts
${method.type === 'native' ? renderPaymentMethodBalance(method) : ''}
```

Retain trailing balance only for non-native methods:

```ts
const renderPaymentMethodTrailingContent = (
  method: PaymentMethod,
  _clickable: boolean
): TemplateResult => html`
  <span class="payment-method-trailing">
    ${method.type === 'native' ? '' : renderPaymentMethodBalance(method)}
  </span>
`;
```

- [ ] **Step 4: Add focused inline styling**

In `src/internal/styles.ts`, add:

```css
.payment-method-meta-row > .payment-method-balance,
.payment-method-meta-row > .payment-method-balance-loading {
  flex: 0 0 auto;
  margin-left: 0.375rem;
}
```

This keeps the balance adjacent while preserving the Default badge's `margin-left: auto` behavior.

- [ ] **Step 5: Run the focused primitive tests and verify GREEN**

Run the Step 2 command again. Expected: PASS for native value/loading placement and preserved card placement.

- [ ] **Step 6: Inspect the isolated diff**

```bash
git diff -- src/internal/primitives.ts src/internal/styles.ts src/test/commerce-hub-connect-primitives_test.ts
```

Expected: only native placement, styling, and tests are attributable to this task. Do not stage overlapping files.

### Task 3: Verify end-to-end balance behavior

**Files:**
- Modify: `src/test/commerce-hub-connect-payment-selection_test.ts`

- [ ] **Step 1: Make existing native balance fixtures qualify**

In the existing balance test, change visible native names to `Commerce wallet - Earnings` and `Rewards wallet - Earnings`. Keep API and ID/position-ID matching assertions.

- [ ] **Step 2: Add inline integration assertions**

Assert each native loading placeholder is within `.payment-method-meta-row`. After resolving the balance response, assert:

```ts
const nativeRow = el.shadowRoot!.querySelector(
  '[data-payment-method-id="native-account-1"]'
)!;
assert.equal(
  nativeRow
    .querySelector('.payment-method-meta-row .payment-method-balance')
    ?.textContent?.trim(),
  '$125.50'
);
assert.notExists(
  nativeRow.querySelector('.payment-method-trailing .payment-method-balance')
);
```

Remove the obsolete right-aligned trailing-placement assertion.

- [ ] **Step 3: Run focused native tests**

```bash
BROWSERS=chromium npm run test:dev -- --grep "native account"
```

Expected: all native list, loading, selected-method, and balance tests pass. If another list-based fixture now needs the suffix, update its name without broadening the predicate.

- [ ] **Step 4: Run static verification**

```bash
npm run lint
npm run build
```

Expected: both exit 0 without TypeScript, ESLint, or Lit analyzer errors.

- [ ] **Step 5: Run the full suite**

```bash
npm test
```

Expected: proxy-auth, package-surface, development browser, and production browser suites all exit 0.

- [ ] **Step 6: Review final scope**

```bash
git diff --check
git status --short
git diff -- src/commerce-hub-connect.ts src/internal/primitives.ts src/internal/styles.ts src/test/commerce-hub-connect-payment-selection_test.ts src/test/commerce-hub-connect-primitives_test.ts
```

Expected: no whitespace errors or conflicts. Report feature edits separately from pre-existing local changes and leave implementation changes unstaged.
