# Product Description Dropdown Label Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Display an instrument schema's `productDescription` in the bank-account-type dropdown, falling back to `productId` without changing selection or submission values.

**Architecture:** Extend the configuration-inquiry OpenAPI schema with the optional display field and regenerate its TypeScript type. Keep display-label selection inside `instrumentSchemaPaymentTypeOptions`, where schema metadata is already converted into UI options; the option value remains the payment type parsed from `bavSupportedCode`.

**Tech Stack:** TypeScript, Lit, OpenAPI YAML, openapi-typescript, Web Test Runner, Mocha/Chai

---

### Task 1: Specify the dropdown label behavior with a failing flow test

**Files:**
- Modify: `src/test/commerce-hub-connect-flow_test.ts:90-180`
- Test: `src/test/commerce-hub-connect-flow_test.ts:3080-3150`

- [ ] **Step 1: Give one configured product a description and retain one without it**

Add a description to the first `TEST_INSTRUMENT_SCHEMAS` entry only:

```ts
{
  bavSupportedCode: 'CAD-Canadian-B',
  productId: 'POLOCALBANK',
  productDescription: 'Bank Account',
  countryCode: 'CA',
  // existing fields remain unchanged
}
```

Leave the `POINTERAC` entry without `productDescription` to exercise the fallback.

- [ ] **Step 2: Change the dropdown assertion to the required labels**

```ts
assert.deepEqual(
  [...paymentTypeSelect.options].map((option) =>
    option.textContent?.trim()
  ),
  ['Select payment type', 'Bank Account', 'POINTERAC']
);
```

- [ ] **Step 3: Run the focused test and verify it fails**

Run:

```bash
npm run test:dev -- --grep "cascading instrument schema selectors"
```

Expected: FAIL because the first rendered label is still `POLOCALBANK` rather than `Bank Account`.

- [ ] **Step 4: Commit the failing behavioral test**

```bash
git add src/test/commerce-hub-connect-flow_test.ts
git commit -m "test: specify product description dropdown label"
```

### Task 2: Add the API field and implement label fallback

**Files:**
- Modify: `config-swagger.yaml:4118-4140`
- Regenerate: `src/generated/config-openapi.ts`
- Modify: `src/internal/forms/instrument-schema-selection.ts:116-132`
- Test: `src/test/commerce-hub-connect-flow_test.ts`

- [ ] **Step 1: Add the optional description to the OpenAPI schema**

Place this after `productId` without adding it to the `required` list:

```yaml
productDescription:
  type: string
  description: Human-readable product name displayed in instrument selection controls.
  example: "Bank Account"
```

- [ ] **Step 2: Regenerate the configuration API type**

Run:

```bash
npm run generate:client
```

Expected: `src/generated/config-openapi.ts` adds `productDescription?: string` to `ConfigInstrumentSchema`.

- [ ] **Step 3: Use the trimmed description with a product-ID fallback**

Change the option mapping in `instrumentSchemaPaymentTypeOptions` to:

```ts
.map(({paymentType, schema}) => {
  const productDescription =
    typeof schema.productDescription === 'string'
      ? schema.productDescription.trim()
      : '';

  return {
    value: paymentType,
    label: productDescription || schema.productId,
  };
})
```

This keeps the option value and downstream schema resolution unchanged.

- [ ] **Step 4: Run the focused test and verify it passes**

Run:

```bash
npm run test:dev -- --grep "cascading instrument schema selectors"
```

Expected: PASS, including the existing assertion that the submitted `sourceBody.productId` is `POLOCALBANK`.

- [ ] **Step 5: Verify generated files, build, and lint**

Run:

```bash
npm run build
npm run lint
git diff --check
```

Expected: all commands exit successfully; Lit analyzer may report its existing warnings but no errors.

- [ ] **Step 6: Commit the implementation**

```bash
git add config-swagger.yaml src/generated/config-openapi.ts src/internal/forms/instrument-schema-selection.ts
git commit -m "feat: display product descriptions in bank type dropdown"
```

