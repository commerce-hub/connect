# Instrument Schema Singleton Dropdowns Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Auto-select and disable singleton instrument-schema dropdowns, cascade immediately to dependent dropdowns, open bank details when the remaining path is unique, and release the SDK as `0.10.5`.

**Architecture:** Centralize selection reconciliation in `CommerceHubConnect`, reusing the existing option and schema-resolution helpers. Invoke reconciliation after configuration inquiry and after shopper changes, while rendering singleton option lists as disabled native selects.

**Tech Stack:** TypeScript 5.9, Lit 3, Mocha/Open WC browser tests, Web Test Runner/Playwright, npm package metadata

---

### Task 1: Define singleton cascade behavior with failing flow tests

**Files:**

- Modify: `src/test/commerce-hub-connect-flow_test.ts`

- [ ] **Step 1: Add a test for an implicit currency and a user-selected account path**

Create a configuration fixture with one currency, two account types, and one payment type under the selected account. Assert that currency is `CAD` and disabled immediately, account type is visible and enabled, payment type is initially hidden, then selecting the account reveals a disabled sole payment type and automatically opens **Enter bank details**.

```ts
test('implicitly selects singleton schema options and cascades to bank details', async () => {
  // Stub configuration inquiry with CAD-Canadian-B, CAD-Canadian-P,
  // and CAD-Interac-P schemas, then open add-bank-account.
  const currencySelect = el.shadowRoot!.querySelector<HTMLSelectElement>(
    '#instrument-schema-currency'
  )!;
  assert.equal(currencySelect.value, 'CAD');
  assert.isTrue(currencySelect.disabled);

  const accountTypeSelect = el.shadowRoot!.querySelector<HTMLSelectElement>(
    '#instrument-schema-account-type'
  )!;
  assert.equal(accountTypeSelect.value, '');
  assert.isFalse(accountTypeSelect.disabled);

  accountTypeSelect.value = 'BUSINESS';
  accountTypeSelect.dispatchEvent(new Event('change', {bubbles: true}));
  await waitFor(
    () =>
      el.shadowRoot!.querySelector('.widget-title')?.textContent?.trim() ===
      'Enter bank details',
    'singleton descendant did not open bank details'
  );
});
```

- [ ] **Step 2: Add a test for a fully singleton response**

Stub configuration inquiry with `[TEST_INSTRUMENT_SCHEMAS[0]]`; after clicking add-bank-account, wait for **Enter bank details** and assert no Continue click was required.

```ts
assert.equal(
  el.shadowRoot!.querySelector('.widget-title')?.textContent?.trim(),
  'Enter bank details'
);
assert.exists(
  el.shadowRoot!.querySelector('commerce-hub-bank-account-jsonforms')
);
```

- [ ] **Step 3: Run the focused browser test and verify RED**

```bash
PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  BROWSERS=chromium npm run test:dev -- --files src/test/commerce-hub-connect-flow_test.ts
```

Expected: the new tests fail because singleton values remain empty and require manual changes.

### Task 2: Implement centralized singleton reconciliation

**Files:**

- Modify: `src/commerce-hub-connect.ts`
- Test: `src/test/commerce-hub-connect-flow_test.ts`

- [ ] **Step 1: Add `reconcileInstrumentSchemaSelection`**

Add a private method that validates current selections in order and supplies the only option where a stage has exactly one:

```ts
private reconcileInstrumentSchemaSelection(openDetailsWhenResolved = true) {
  const selections = selectableInstrumentSchemas(
    this.bankAccountInstrumentSchemas
  );
  const currencyOptions = instrumentSchemaCurrencyOptions(selections);

  if (
    !currencyOptions.some(
      (option) => option.value === this.selectedBankCurrencyCode
    )
  ) {
    this.selectedBankCurrencyCode =
      currencyOptions.length === 1 ? currencyOptions[0].value : '';
    this.selectedBankAccountType = '';
    this.selectedBankPaymentType = '';
  }

  if (!this.selectedBankCurrencyCode) {
    this.selectedBankAccountInstrumentSchemaCode = undefined;
    return;
  }

  const accountTypeOptions = instrumentSchemaAccountTypeOptions(
    selections,
    this.selectedBankCurrencyCode
  );
  if (
    !accountTypeOptions.some(
      (option) => option.value === this.selectedBankAccountType
    )
  ) {
    this.selectedBankAccountType =
      accountTypeOptions.length === 1 ? accountTypeOptions[0].value : '';
    this.selectedBankPaymentType = '';
  }

  if (!this.selectedBankAccountType) {
    this.selectedBankAccountInstrumentSchemaCode = undefined;
    return;
  }

  const paymentTypeOptions = instrumentSchemaPaymentTypeOptions(
    selections,
    this.selectedBankCurrencyCode,
    this.selectedBankAccountType
  );
  if (
    !paymentTypeOptions.some(
      (option) => option.value === this.selectedBankPaymentType
    )
  ) {
    this.selectedBankPaymentType =
      paymentTypeOptions.length === 1 ? paymentTypeOptions[0].value : '';
  }

  const schema = resolveInstrumentSchema(
    selections,
    this.selectedBankCurrencyCode,
    this.selectedBankAccountType,
    this.selectedBankPaymentType
  );
  this.selectedBankAccountInstrumentSchemaCode = schema?.bavSupportedCode;

  if (schema && openDetailsWhenResolved) {
    this.initializeManualBankAccountScreen();
  }
}
```

- [ ] **Step 2: Invoke reconciliation after configuration inquiry**

After storing usable schemas and setting `bankFlowScreen` to `manual-schema-selection`, call `reconcileInstrumentSchemaSelection()` so initial singleton paths advance immediately.

- [ ] **Step 3: Invoke reconciliation after dropdown changes**

For currency and account changes, retain the existing dependent-state clearing and call `reconcileInstrumentSchemaSelection()`. For an explicit payment change, call `reconcileInstrumentSchemaSelection(false)` so existing multi-payment paths still require **Continue**.

- [ ] **Step 4: Disable singleton dropdowns in rendering**

Pass `disabled: <options>.length === 1` to each of the three `renderSelectField` calls. Keep placeholder options; the selected singleton value prevents the placeholder from displaying.

- [ ] **Step 5: Run the focused browser flow suite and verify GREEN**

Run the Task 1 browser command. Expected: all flow tests pass, including existing multi-option and malformed-response behavior.

### Task 3: Bump package metadata to 0.10.5

**Files:**

- Modify: `package.json`
- Modify: `package-lock.json`

- [ ] **Step 1: Add a failing metadata consistency check**

```bash
node -e 'const p=require("./package.json");const l=require("./package-lock.json");if(p.version!=="0.10.5"||l.version!==p.version||l.packages[""].version!==p.version)process.exit(1)'
```

Expected: exit 1 because main currently contains older metadata.

- [ ] **Step 2: Update root release versions**

Set `package.json.version`, `package-lock.json.version`, and `package-lock.json.packages[""].version` to `0.10.5`. Do not alter dependency engine constraints.

- [ ] **Step 3: Re-run the metadata check**

Expected: exit 0.

### Task 4: Verify and commit

**Files:**

- Verify: `src/commerce-hub-connect.ts`
- Verify: `src/test/commerce-hub-connect-flow_test.ts`
- Verify: `package.json`
- Verify: `package-lock.json`

- [ ] **Step 1: Run TypeScript build**

```bash
npm run build
```

Expected: exit 0.

- [ ] **Step 2: Run lint**

```bash
npm run lint
```

Expected: no errors; report any pre-existing warnings separately.

- [ ] **Step 3: Run non-browser release tests**

```bash
npm run test:proxy-auth && npm run test:package-surface
```

Expected: all tests pass.

- [ ] **Step 4: Check task-owned diffs and commit**

```bash
git diff --check
git status --short
git add src/commerce-hub-connect.ts src/test/commerce-hub-connect-flow_test.ts package.json package-lock.json
git commit -m "feat: auto-select singleton instrument schema options"
```
