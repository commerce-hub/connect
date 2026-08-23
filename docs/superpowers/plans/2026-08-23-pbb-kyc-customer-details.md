# PBB KYC Customer Details Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Pass customer first name, last name, email, and phone number from the MPP interaction response into Bank Link Lite initialization.

**Architecture:** Extend the wallet interaction-response compatibility type with the latest MPP `entityData` shape and isolate normalization in a pure resolver. The PBB launcher spreads the normalized, nonblank values into `PaymentSDK.init`, preserving existing behavior for missing data and forwarding partial data for prefilling.

**Tech Stack:** TypeScript 5.9, Lit 3, OpenAPI base types, Mocha, Web Test Runner, Playwright Chromium

---

## File structure

- Modify `src/internal/types.ts`: model the latest MPP `InteractionResponse.entityData` contract without editing generated files.
- Create `src/internal/pay-by-bank-customer-details.ts`: normalize and map KYC values.
- Create `src/test/pay-by-bank-customer-details_test.ts`: unit-test normalization.
- Modify `src/commerce-hub-connect.ts`: pass the mapped values to PBB.
- Modify `src/test/commerce-hub-connect-flow_test.ts`: test the Payment SDK boundary.

### Task 1: Model and normalize customer details

**Files:**
- Modify: `src/internal/types.ts`
- Create: `src/internal/pay-by-bank-customer-details.ts`
- Test: `src/test/pay-by-bank-customer-details_test.ts`

- [ ] **Step 1: Write the failing resolver tests**

Create `src/test/pay-by-bank-customer-details_test.ts`:

```ts
import {assert} from '@open-wc/testing';
import {resolvePayByBankCustomerDetails} from '../internal/pay-by-bank-customer-details.js';

suite('Pay by Bank customer details', () => {
  test('maps complete data and uses phoneNumber without countryCode', () => {
    assert.deepEqual(resolvePayByBankCustomerDetails({
      firstName: ' John ', lastName: ' Doe ', email: ' john@example.com ',
      phoneDetails: {countryCode: '+1', phoneNumber: ' 2145550123 '},
    }), {
      firstName: 'John', lastName: 'Doe', email: 'john@example.com', phone: '2145550123',
    });
  });

  test('forwards partial data and omits blanks', () => {
    assert.deepEqual(resolvePayByBankCustomerDetails({
      firstName: ' Jane ', lastName: ' ', email: '',
      phoneDetails: {countryCode: '+1', phoneNumber: ' '},
    }), {firstName: 'Jane'});
  });

  test('returns no values when entity data is absent', () => {
    assert.deepEqual(resolvePayByBankCustomerDetails(undefined), {});
  });
});
```

- [ ] **Step 2: Verify the new test fails**

Run `BROWSERS=chromium npm run test:dev -- --files src/test/pay-by-bank-customer-details_test.ts`.

Expected: FAIL because `pay-by-bank-customer-details.js` does not exist.

- [ ] **Step 3: Add the MPP entity-data type**

Add before `InteractionResponse` in `src/internal/types.ts`:

```ts
export interface InteractionEntityData {
  partyId?: string;
  email?: string;
  phoneDetails?: {
    countryCode?: string;
    phoneNumber?: string;
    verifiedTimestamp?: number;
  };
  firstName?: string;
  lastName?: string;
  countryCode?: string;
  businessName?: string;
}
```

Add `entityData?: InteractionEntityData;` to the existing `InteractionResponse` extension. This follows its existing compatibility pattern for response fields not present in the older generated OpenAPI snapshot and avoids hand-editing `src/generated/openapi.ts`.

- [ ] **Step 4: Implement the resolver**

Create `src/internal/pay-by-bank-customer-details.ts`:

```ts
import type {InteractionEntityData} from './types.js';

export type PayByBankCustomerDetails = Partial<{
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}>;

const nonBlankValue = (value: string | undefined): string | undefined => {
  const normalizedValue = value?.trim();
  return normalizedValue ? normalizedValue : undefined;
};

export const resolvePayByBankCustomerDetails = (
  entityData: InteractionEntityData | undefined
): PayByBankCustomerDetails => {
  const entries = [
    ['firstName', nonBlankValue(entityData?.firstName)],
    ['lastName', nonBlankValue(entityData?.lastName)],
    ['email', nonBlankValue(entityData?.email)],
    ['phone', nonBlankValue(entityData?.phoneDetails?.phoneNumber)],
  ] as const;

  return Object.fromEntries(entries.filter((entry) => entry[1])) as PayByBankCustomerDetails;
};
```

- [ ] **Step 5: Verify the resolver tests pass**

Run `BROWSERS=chromium npm run test:dev -- --files src/test/pay-by-bank-customer-details_test.ts`.

Expected: 3 tests PASS.

- [ ] **Step 6: Commit the resolver slice**

```bash
git add src/internal/types.ts src/internal/pay-by-bank-customer-details.ts src/test/pay-by-bank-customer-details_test.ts
git commit -m "Add PBB customer detail resolver"
```

### Task 2: Initialize PBB with KYC values

**Files:**
- Modify: `src/commerce-hub-connect.ts`
- Modify: `src/test/commerce-hub-connect-flow_test.ts`

- [ ] **Step 1: Extend the test configuration and write a failing flow test**

Add optional `firstName`, `lastName`, `email`, and `phone` strings to `TestPaymentSdkInitConfiguration`. Add a PBB flow test whose interaction contains:

```ts
entityData: {
  firstName: ' John ',
  lastName: ' Doe ',
  email: ' john@example.com ',
  phoneDetails: {countryCode: '+1', phoneNumber: ' 2145550123 '},
}
```

Capture `PaymentSDK.init` using the existing test pattern, click `add-pay-by-bank`, and assert:

```ts
assert.include(initConfig, {
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
  phone: '2145550123',
});
```

Add a second launch with `{firstName: ' Jane ', lastName: ' ', email: ''}` and assert `firstName === 'Jane'` while `lastName`, `email`, and `phone` are not properties. Add a launch without `entityData` and assert none of the four KYC keys are properties.

- [ ] **Step 2: Verify the flow test fails**

Run `BROWSERS=chromium npm run test:dev -- --files src/test/commerce-hub-connect-flow_test.ts`.

Expected: FAIL because `PaymentSDK.init` lacks the mapped KYC properties.

- [ ] **Step 3: Extend production PaymentSDK configuration**

Add to `PaymentSdkInitConfiguration` in `src/commerce-hub-connect.ts`:

```ts
firstName?: string;
lastName?: string;
email?: string;
phone?: string;
```

- [ ] **Step 4: Resolve and pass details**

Import:

```ts
import {resolvePayByBankCustomerDetails} from './internal/pay-by-bank-customer-details.js';
```

In `launchPayByBankProvider`, after resolving the session/options, add:

```ts
const customerDetails = resolvePayByBankCustomerDetails(
  this.interactionResponse?.entityData
);
```

Spread `...customerDetails` into `paymentSdk.init` immediately after `aggregatorSessionId`.

- [ ] **Step 5: Verify focused tests pass**

Run:

```bash
BROWSERS=chromium npm run test:dev -- --files src/test/pay-by-bank-customer-details_test.ts src/test/commerce-hub-connect-flow_test.ts
```

Expected: all tests in both files PASS.

- [ ] **Step 6: Commit the integration slice**

```bash
git add src/commerce-hub-connect.ts src/test/commerce-hub-connect-flow_test.ts
git commit -m "Pass KYC details to PBB initialization"
```

### Task 3: Verify and finalize

**Files:**
- Verify: all changed feature files
- Commit: `docs/superpowers/plans/2026-08-23-pbb-kyc-customer-details.md`

- [ ] **Step 1: Check formatting**

Run `npx prettier --check src/internal/types.ts src/internal/pay-by-bank-customer-details.ts src/test/pay-by-bank-customer-details_test.ts src/commerce-hub-connect.ts src/test/commerce-hub-connect-flow_test.ts`.

Expected: all files pass. If needed, run the same paths with `--write` and review the diff.

- [ ] **Step 2: Run build and lint**

Run `npm run build && npm run lint`.

Expected: TypeScript, Lit Analyzer, and ESLint exit successfully.

- [ ] **Step 3: Run the full suite**

Run `npm test`.

Expected: proxy-auth, package-surface, development browser, and production browser tests pass.

- [ ] **Step 4: Confirm branch scope**

Run:

```bash
git status --short --branch
git log --oneline main..HEAD
git diff --stat main...HEAD
```

Expected: only design, plan, resolver/model, PBB initialization, and related tests are committed. `docs/superpowers/specs/2026-08-18-sdk-localization-migration-design.md` remains untracked.

- [ ] **Step 5: Commit the plan**

```bash
git add docs/superpowers/plans/2026-08-23-pbb-kyc-customer-details.md
git commit -m "Add PBB KYC implementation plan"
```
