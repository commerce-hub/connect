# Instrument Schema Navigation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Require an explicit Continue click on the multi-schema bank-account chooser while retaining automatic navigation when filtering leaves exactly one valid selectable schema.

**Architecture:** Keep schema reconciliation responsible only for deriving and preselecting dropdown state. Make the configuration-loading boundary decide whether to open bank details based on the filtered `selectableInstrumentSchemas` count, while the existing Continue action remains the navigation path for multi-schema responses.

**Tech Stack:** TypeScript, Lit, `@web/test-runner`, Mocha TDD, Chai, Playwright Chromium

---

## File Structure

- Modify `src/test/commerce-hub-connect-flow_test.ts`: cover explicit confirmation for multi-schema resolution and automatic navigation for one filtered valid schema.
- Modify `src/commerce-hub-connect.ts`: separate selection reconciliation from navigation and apply the one-valid-schema shortcut after filtering.

### Task 1: Separate Multi-Schema Resolution From Navigation

**Files:**
- Modify: `src/test/commerce-hub-connect-flow_test.ts:3030-3170`
- Modify: `src/commerce-hub-connect.ts:3695-3730`
- Modify: `src/commerce-hub-connect.ts:4190-4330`

- [ ] **Step 1: Change the existing multi-schema cascade test to require Continue**

Rename `singleton schema options cascade to bank details` to `singleton options resolve a multi-schema choice without navigating` and replace its final automatic-navigation assertions with:

```ts
    accountTypeSelect.value = 'BUSINESS';
    accountTypeSelect.dispatchEvent(new Event('change', {bubbles: true}));
    await flushElement(el);

    assert.equal(
      el.shadowRoot!.querySelector('.widget-title')?.textContent?.trim(),
      'Select bank account type'
    );
    const paymentTypeSelect = el.shadowRoot!.querySelector<HTMLSelectElement>(
      '#instrument-schema-payment-type'
    )!;
    assert.equal(paymentTypeSelect.value, 'Canadian');
    assert.isTrue(paymentTypeSelect.disabled);

    const continueButton = el.shadowRoot!.querySelector<HTMLButtonElement>(
      '[data-action="select-instrument-schema"]'
    )!;
    assert.isFalse(continueButton.disabled);
    assert.notExists(
      el.shadowRoot!.querySelector('commerce-hub-bank-account-jsonforms')
    );

    await clickAction(el, 'select-instrument-schema');

    assert.equal(
      el.shadowRoot!.querySelector('.widget-title')?.textContent?.trim(),
      'Enter bank details'
    );
    assert.exists(
      el.shadowRoot!.querySelector('commerce-hub-bank-account-jsonforms')
    );
```

- [ ] **Step 2: Run the focused browser test and verify RED**

Run:

```bash
BROWSERS=chromium npm run test:dev -- --files src/test/commerce-hub-connect-flow_test.ts
```

Expected: FAIL because selecting `BUSINESS` currently changes the title to `Enter bank details` before Continue is clicked.

- [ ] **Step 3: Add a filtered-singleton regression test**

Immediately after `fully singleton schema response opens bank details automatically`, add a test whose configuration response contains one valid schema and one invalid schema:

```ts
  test('filtered singleton schema response opens bank details automatically', async () => {
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
        return bankAccountCountryConfigResponse([
          TEST_INSTRUMENT_SCHEMAS[0],
          {...TEST_INSTRUMENT_SCHEMAS[1], bavSupportedCode: '   '},
        ]);
      }

      return new Response(JSON.stringify({}), {
        status: 200,
        headers: {'Content-Type': 'application/json'},
      });
    };

    const el = await renderConnect({
      interactionId: 'interaction-filtered-singleton',
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
      'filtered singleton schema did not open bank details'
    );

    assert.notExists(
      el.shadowRoot!.querySelector('[data-action="select-instrument-schema"]')
    );
    assert.exists(
      el.shadowRoot!.querySelector('commerce-hub-bank-account-jsonforms')
    );
  });
```

- [ ] **Step 4: Run the focused test and confirm the new singleton case is GREEN while the multi-schema case remains RED**

Run:

```bash
BROWSERS=chromium npm run test:dev -- --files src/test/commerce-hub-connect-flow_test.ts
```

Expected: the filtered-singleton test passes under existing behavior; the renamed multi-schema test fails on premature navigation.

- [ ] **Step 5: Make reconciliation state-only and move singleton navigation to configuration loading**

In all three dropdown change handlers, call reconciliation without requesting navigation:

```ts
      this.reconcileInstrumentSchemaSelection();
```

This includes replacing `this.reconcileInstrumentSchemaSelection(false)` in the payment-type handler.

In the configuration response handler, retain the filtered selections and explicitly navigate only for a singleton:

```ts
      const instrumentSchemas = usableInstrumentSchemas(rawInstrumentSchemas);
      const selections = selectableInstrumentSchemas(instrumentSchemas);

      if (instrumentSchemas.length === 0 || selections.length === 0) {
        this.bankAccountConfigError = NO_INSTRUMENT_SCHEMAS_ERROR;
        this.bankFlowScreen = 'manual-config-error';
        return;
      }

      this.bankAccountInstrumentSchemas = instrumentSchemas;
      this.bankAccountConfigError = undefined;
      this.bankFlowScreen = 'manual-schema-selection';
      this.reconcileInstrumentSchemaSelection();

      if (selections.length === 1) {
        this.initializeManualBankAccountScreen();
      }
```

Change the reconciliation signature and remove its navigation tail:

```ts
  private reconcileInstrumentSchemaSelection() {
```

The method must still end by assigning the resolved code:

```ts
    this.selectedBankAccountInstrumentSchemaCode = schema?.bavSupportedCode;
```

Delete:

```ts
    if (schema && openDetailsWhenResolved) {
      this.initializeManualBankAccountScreen();
    }
```

- [ ] **Step 6: Run the focused flow test and verify GREEN**

Run:

```bash
BROWSERS=chromium npm run test:dev -- --files src/test/commerce-hub-connect-flow_test.ts
```

Expected: PASS, including the explicit-Continue multi-schema test and both singleton auto-navigation tests.

- [ ] **Step 7: Run formatting checks, lint, and build**

Run:

```bash
npx prettier --check src/commerce-hub-connect.ts src/test/commerce-hub-connect-flow_test.ts
npm run lint
npm run build
```

Expected: all commands exit 0 without TypeScript, ESLint, Lit Analyzer, or formatting errors.

- [ ] **Step 8: Run the complete test suite**

Run:

```bash
npm test
```

Expected: proxy-auth, package-surface, development browser, and production browser suites all pass.

- [ ] **Step 9: Commit the implementation**

```bash
git add src/commerce-hub-connect.ts src/test/commerce-hub-connect-flow_test.ts
git commit -m "Require confirmation for instrument schema selection"
```
