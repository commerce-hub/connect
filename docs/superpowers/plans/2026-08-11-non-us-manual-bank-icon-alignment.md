# Non-US Manual Bank Icon Alignment Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Render the existing US manual-bank brand image on non-US manual bank actions so their copy aligns with branded card actions.

**Architecture:** Keep layout styling and action behavior unchanged. Add the existing manual-bank image to the non-US tender descriptor in `resolveAddPaymentTenders`, allowing the shared `renderSourceAction` branded-row path to provide the same 5rem leading column as the card row.

**Tech Stack:** TypeScript 5.9, Lit 3, Open WC testing, Web Test Runner

---

### Task 1: Reuse the manual-bank brand image outside the USA

**Files:**
- Modify: `src/test/add-payment-tenders_test.ts:3-87`
- Modify: `src/internal/add-payment-tenders.ts:1-52`
- Modify: `src/test/commerce-hub-connect-flow_test.ts:2139-2198`

- [ ] **Step 1: Write the failing tender-mapping test**

Import the existing asset in `src/test/add-payment-tenders_test.ts`:

```ts
import {MANUAL_BANK_SOURCE_ACTION_BRAND_IMAGE} from '../internal/source-action-brand-images.js';
```

Change the non-USA expected tender from `brandImage: undefined` to:

```ts
brandImage: MANUAL_BANK_SOURCE_ACTION_BRAND_IMAGE,
```

- [ ] **Step 2: Build and run the focused unit test to verify it fails**

Run:

```bash
npm run build
npx wtr --config web-test-runner.config.js --files test/add-payment-tenders_test.js
```

Expected: the test `preserves one configured bank tender outside USA` fails because the actual `brandImage` is `undefined`.

- [ ] **Step 3: Add rendered Canada regression coverage**

In `filters USA split bank tenders and preserves the non-USA bank tender`, extend each case with optional expected images and set the Canada case to:

```ts
{
  country: 'CA',
  allowedTenderTypes: ['CARD', 'BANK_ACCOUNT'],
  actions: ['add-card', 'add-bank-account'],
  brandImages: [
    CARD_SOURCE_ACTION_BRAND_IMAGE,
    MANUAL_BANK_SOURCE_ACTION_BRAND_IMAGE,
  ],
},
```

After the action assertion, conditionally assert the rendered image sources:

```ts
if (testCase.brandImages) {
  assert.deepEqual(
    [
      ...el.shadowRoot!.querySelectorAll<HTMLImageElement>(
        '.payment-action-links .source-action-brand-image'
      ),
    ].map((image) => image.src),
    testCase.brandImages
  );
}
```

Add `brandImages?: string[]` to the case type. The test file already imports both brand-image constants.

- [ ] **Step 4: Run the rendered test to verify the regression fails**

Run:

```bash
npm run build
npx wtr --config web-test-runner.config.js --files test/commerce-hub-connect-flow_test.js
```

Expected: `filters USA split bank tenders and preserves the non-USA bank tender` fails because Canada renders only the card brand image.

- [ ] **Step 5: Implement the minimal tender mapping change**

In the `!isUsa` branch of `src/internal/add-payment-tenders.ts`, add the existing image to the tender:

```ts
tenders.push({
  action: 'add-bank-account',
  title: copy.addBankAccountTitle,
  subtitle: copy.addBankAccountSubtitle,
  icon: 'bank',
  brandImage: MANUAL_BANK_SOURCE_ACTION_BRAND_IMAGE,
});
```

- [ ] **Step 6: Rebuild and run both focused tests**

Run:

```bash
npm run build
npx wtr --config web-test-runner.config.js --files test/add-payment-tenders_test.js test/commerce-hub-connect-flow_test.js
```

Expected: both focused test files pass with no browser errors.

- [ ] **Step 7: Run verification**

Run:

```bash
npm run lint
npm run build
npm run test:dev
```

Expected: lint, TypeScript build, and the development-mode test suite all pass.

- [ ] **Step 8: Commit the focused change**

```bash
git add src/internal/add-payment-tenders.ts src/test/add-payment-tenders_test.ts src/test/commerce-hub-connect-flow_test.ts docs/superpowers/specs/2026-08-11-non-us-manual-bank-icon-alignment-design.md docs/superpowers/plans/2026-08-11-non-us-manual-bank-icon-alignment.md
git commit -m "fix: align non-US manual bank action"
```

If the local Xcode command-line-tools failure still prevents Git from starting, leave the verified changes uncommitted and report that environment blocker.
