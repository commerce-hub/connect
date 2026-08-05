# Single Instrument Schema Auto-Skip Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Skip the bank instrument-schema selection screen when configuration inquiry provides exactly one valid selectable schema.

**Architecture:** Extend the existing configuration-inquiry success branch in `CommerceHubConnect` after schema validation. Reuse `selectableInstrumentSchemas` and `initializeManualBankAccountScreen` so the direct path initializes exactly the same schema-driven details form as explicit selection.

**Tech Stack:** TypeScript 5.9, Lit 3, Mocha/Open WC browser tests, Web Test Runner with Playwright Chromium

---

### Task 1: Add the single-schema flow regression test

**Files:**
- Modify: `src/test/commerce-hub-connect-flow_test.ts`

- [ ] **Step 1: Write the failing browser-flow test**

Add a test beside `non-USA bank entry defaults to manual schema selection` that stubs configuration inquiry with one valid schema and asserts direct details navigation:

```ts
test('single instrument schema skips selection and opens bank details', async () => {
  const requests: CapturedRequest[] = [];
  window.fetch = async (input: RequestInfo | URL) => {
    const request = input instanceof Request ? input : new Request(input);
    const pathname = new URL(request.url).pathname;

    requests.push({
      url: request.url,
      method: request.method,
      headers: new Headers(request.headers),
      bodyText: await request.clone().text(),
      credentials: request.credentials,
    });

    if (pathname === '/party/configuration-inquiry') {
      return bankAccountCountryConfigResponse([TEST_INSTRUMENT_SCHEMAS[0]]);
    }

    return new Response(JSON.stringify({}), {
      status: 200,
      headers: {'Content-Type': 'application/json'},
    });
  };

  const el = await renderConnect({
    interactionId: 'interaction-payment',
    status: 'PAYMENT_SOURCE_REQUESTED',
    country: 'CAN',
    allowedTenderTypes: ['BANK_ACCOUNT'],
    paymentSources: [],
  });

  await clickAction(el, 'add-bank-account');
  await waitForRequest(requests, '/party/configuration-inquiry');
  await waitFor(
    () =>
      el.shadowRoot!.querySelector('.widget-title')?.textContent?.trim() ===
      'Enter bank details',
    'single instrument schema did not open bank details'
  );

  assert.notExists(
    el.shadowRoot!.querySelector('#instrument-schema-currency')
  );
  assert.notExists(
    el.shadowRoot!.querySelector('#instrument-schema-account-type')
  );
  assert.notExists(
    el.shadowRoot!.querySelector('#instrument-schema-payment-type')
  );
  assert.exists(
    el.shadowRoot!.querySelector('commerce-hub-bank-account-jsonforms')
  );
  assert.exists(
    el.shadowRoot!.querySelector('input[name="accountHolderName"]')
  );
  assert.exists(el.shadowRoot!.querySelector('input[name="accountNumber"]'));
});
```

- [ ] **Step 2: Run the focused test and verify RED**

Run:

```bash
BROWSERS=chromium npm run test:dev -- --grep "single instrument schema skips selection"
```

Expected: FAIL because the widget title remains `Select bank account type` and the details form is not rendered.

- [ ] **Step 3: Commit the failing test**

```bash
git add src/test/commerce-hub-connect-flow_test.ts
git commit -m "test: cover single instrument schema navigation"
```

### Task 2: Auto-select the sole valid schema

**Files:**
- Modify: `src/commerce-hub-connect.ts`
- Test: `src/test/commerce-hub-connect-flow_test.ts`

- [ ] **Step 1: Compute selectable schemas once and preserve the zero-schema error**

Replace the repeated selection calculation in the configuration success branch with:

```ts
const instrumentSchemas = usableInstrumentSchemas(rawInstrumentSchemas);
const selectableSchemas = selectableInstrumentSchemas(instrumentSchemas);

if (instrumentSchemas.length === 0 || selectableSchemas.length === 0) {
  this.bankAccountConfigError = NO_INSTRUMENT_SCHEMAS_ERROR;
  this.bankFlowScreen = 'manual-config-error';
  return;
}
```

- [ ] **Step 2: Add the direct transition for one selectable schema**

Immediately after storing the validated schemas and clearing the configuration error, branch on the selection count:

```ts
this.bankAccountInstrumentSchemas = instrumentSchemas;
this.bankAccountConfigError = undefined;

if (selectableSchemas.length === 1) {
  this.selectedBankAccountInstrumentSchemaCode =
    selectableSchemas[0].schema.bavSupportedCode;
  this.initializeManualBankAccountScreen();
  return;
}

this.bankFlowScreen = 'manual-schema-selection';
```

- [ ] **Step 3: Run the focused test and verify GREEN**

Run:

```bash
BROWSERS=chromium npm run test:dev -- --grep "single instrument schema skips selection"
```

Expected: PASS.

- [ ] **Step 4: Run neighboring multi-schema and malformed-response tests**

Run:

```bash
BROWSERS=chromium npm run test:dev -- --grep "non-USA bank entry defaults to manual schema selection|manual schema selection blocks and retries failed and malformed responses"
```

Expected: both tests PASS, proving multiple schemas retain the chooser and malformed schemas retain the error/retry flow.

- [ ] **Step 5: Commit the implementation**

```bash
git add src/commerce-hub-connect.ts
git commit -m "feat: skip selection for single instrument schema"
```

### Task 3: Verify the SDK

**Files:**
- Verify: `src/commerce-hub-connect.ts`
- Verify: `src/test/commerce-hub-connect-flow_test.ts`

- [ ] **Step 1: Run the full Chromium development test suite**

```bash
BROWSERS=chromium npm run test:dev
```

Expected: all Chromium development-mode tests PASS.

- [ ] **Step 2: Run lint**

```bash
npm run lint
```

Expected: ESLint and Lit Analyzer finish with no errors.

- [ ] **Step 3: Run the TypeScript build**

```bash
npm run build
```

Expected: TypeScript compilation succeeds with exit code 0.

- [ ] **Step 4: Inspect only task-owned changes**

```bash
git diff --check HEAD~2 -- src/commerce-hub-connect.ts src/test/commerce-hub-connect-flow_test.ts
git status --short
```

Expected: no whitespace errors; unrelated pre-existing workspace changes remain untouched.
