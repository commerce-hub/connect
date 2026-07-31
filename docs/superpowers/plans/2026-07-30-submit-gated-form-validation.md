# Submit-Gated Form Validation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Keep form actions visible but disabled until mandatory values are present, suppress inline errors until the first enabled action click, and clear resolved errors while editing.

**Architecture:** Separate mandatory-value presence from full validity. Pure helpers decide action availability; component-owned attempted flags decide whether existing error state is rendered, while existing validators remain authoritative for submission and live correction.

**Tech Stack:** TypeScript 5.9, Lit 3, JSON Forms, Mocha TDD, @web/test-runner, @open-wc/testing.

---

## Constraint

Do not create any Git commit. Leave the design, plan, implementation, tests, documentation, and generated output visible in the working tree until the user explicitly authorizes commits.

## File Structure

- Modify `src/internal/forms/card-form-state.ts` for card mandatory-value presence.
- Modify `src/internal/forms/bank-account-form-state.ts` for legacy-bank mandatory-value presence.
- Modify `src/internal/forms/transfer-form-state.ts` for transfer mandatory-value presence.
- Modify `src/internal/forms/instrument-schema.ts` for nested JSON Schema required-value presence.
- Modify `src/internal/forms/required-info-form-state.ts` for required-information text validation.
- Modify `src/test/form-state_test.ts` for pure helper coverage.
- Modify `src/commerce-hub-connect.ts` for attempted flags, error visibility, action availability, resets, and corrected-field revalidation.
- Modify `src/test/commerce-hub-connect-flow_test.ts` for card and bank validation behavior.
- Modify `src/test/commerce-hub-connect-payment-selection_test.ts` for transfer, OTP, and required-information behavior.
- Regenerate `docs/commerce-hub-connect.bundled.js` after implementation.

### Task 1: Add Mandatory-Value Presence Helpers

**Files:**

- Modify: `src/internal/forms/card-form-state.ts`
- Modify: `src/internal/forms/bank-account-form-state.ts`
- Modify: `src/internal/forms/transfer-form-state.ts`
- Modify: `src/internal/forms/instrument-schema.ts`
- Test: `src/test/form-state_test.ts`

- [ ] **Step 1: Add failing pure-helper tests**

Extend `src/test/form-state_test.ts` imports with:

```ts
import {
  hasRequiredCardDraftValues,
  // existing card helpers remain imported
} from '../internal/forms/card-form-state.js';
import {hasRequiredBankAccountDraftValues} from '../internal/forms/bank-account-form-state.js';
import {hasRequiredTransferDraftValues} from '../internal/forms/transfer-form-state.js';
import {hasRequiredJsonSchemaValues} from '../internal/forms/instrument-schema.js';
```

Add tests proving:

```ts
test('separates required card presence from validity', () => {
  const draft = {
    ...createCardDraft(),
    name: 'Card',
    fullName: 'A',
    cardNumber: '1',
    expirationDate: '1',
    cvv: '1',
    country: 'US',
    addressLine1: '1 Main',
    city: 'Brookfield',
    state: 'WI',
    zip: 'x',
  };

  assert.isTrue(hasRequiredCardDraftValues(draft));
  assert.isNotEmpty(validateCardDraft(draft));
  assert.isFalse(hasRequiredCardDraftValues({...draft, fullName: '   '}));
});

test('checks required legacy bank values without validating formats', () => {
  const draft = {
    accountNickname: 'Account',
    routingNumber: '1',
    accountNumber: '2',
    confirmAccountNumber: '3',
  };

  assert.isTrue(
    hasRequiredBankAccountDraftValues(draft, bankAccountFormSchema)
  );
  assert.isNotEmpty(validateBankAccountDraft(draft, bankAccountFormSchema));
  assert.isFalse(
    hasRequiredBankAccountDraftValues(
      {...draft, accountNumber: ''},
      bankAccountFormSchema
    )
  );
});

test('checks transfer presence independently from transfer validity', () => {
  const draft = {
    fromSourceId: 'same',
    toSourceId: 'same',
    amount: '-1',
  };

  assert.isTrue(hasRequiredTransferDraftValues(draft));
  assert.isNotEmpty(validateTransferDraft(draft, [{id: 'same'}]));
  assert.isFalse(hasRequiredTransferDraftValues({...draft, amount: ''}));
});

test('checks nested required JSON Schema values without format validation', () => {
  const schema = {
    type: 'object',
    properties: {
      accountNumber: {type: 'string', minLength: 4},
      address: {
        type: 'object',
        properties: {city: {type: 'string'}},
        required: ['city'],
      },
    },
    required: ['accountNumber', 'address'],
  };

  assert.isTrue(
    hasRequiredJsonSchemaValues(schema, {
      accountNumber: '1',
      address: {city: 'X'},
    })
  );
  assert.isFalse(
    hasRequiredJsonSchemaValues(schema, {
      accountNumber: '1',
      address: {city: '   '},
    })
  );
});
```

- [ ] **Step 2: Run the focused test and verify RED**

Run:

```bash
BROWSERS=chromium npm run test:dev -- --files src/test/form-state_test.ts
```

Expected: compilation/test failure because the four presence helpers do not exist. If the managed environment blocks `0.0.0.0:8000`, record the infrastructure limitation before continuing with build-based verification.

- [ ] **Step 3: Implement the presence helpers**

In `card-form-state.ts`, add:

```ts
export const hasRequiredCardDraftValues = (draft: CardDraft): boolean => {
  const requiredValues = [
    draft.name,
    draft.fullName,
    draft.cardNumber,
    draft.expirationDate,
    draft.cvv,
    draft.billingAddressValue,
  ];

  if (draft.billingAddressValue === NEW_BILLING_ADDRESS_VALUE) {
    requiredValues.push(
      draft.country,
      draft.addressLine1,
      draft.city,
      draft.state,
      draft.zip
    );
  }

  return requiredValues.every((value) => Boolean(value.trim()));
};
```

In `bank-account-form-state.ts`, add:

```ts
export const hasRequiredBankAccountDraftValues = (
  draft: BankAccountDraft,
  schema: BankAccountFormSchema
): boolean =>
  (schema.required ?? []).every(
    (field) => !isBankAccountFormField(field) || Boolean(draft[field].trim())
  );
```

In `transfer-form-state.ts`, add:

```ts
export const hasRequiredTransferDraftValues = (draft: TransferDraft): boolean =>
  [draft.fromSourceId, draft.toSourceId, draft.amount].every((value) =>
    Boolean(value.trim())
  );
```

In `instrument-schema.ts`, add a recursive required-value helper using the existing `isRecord` guard:

```ts
export const hasRequiredJsonSchemaValues = (
  schema: JsonSchema,
  data: unknown
): boolean => {
  if (!isRecord(data)) {
    return (schema.required?.length ?? 0) === 0;
  }

  return (schema.required ?? []).every((key) => {
    const value = data[key];
    const property = schema.properties?.[key];

    if (
      property &&
      typeof property === 'object' &&
      property.type === 'object'
    ) {
      return hasRequiredJsonSchemaValues(property, value);
    }

    return typeof value === 'string'
      ? Boolean(value.trim())
      : value !== undefined && value !== null;
  });
};
```

- [ ] **Step 4: Run build and focused helper tests**

Run:

```bash
npm run build
BROWSERS=chromium npm run test:dev -- --files src/test/form-state_test.ts
```

Expected: build passes and helper tests pass when the browser runner is available.

### Task 2: Gate Card Errors Behind Save

**Files:**

- Modify: `src/commerce-hub-connect.ts`
- Test: `src/test/commerce-hub-connect-flow_test.ts`

- [ ] **Step 1: Add a failing card form behavior test**

Add a browser test that opens Add card and asserts:

```ts
assert.notExists(el.shadowRoot!.querySelector('.field-error'));
const saveButton = el.shadowRoot!.querySelector<HTMLButtonElement>(
  '[data-action="save-card"]'
)!;
assert.isTrue(saveButton.disabled);
```

Fill every mandatory field with non-empty malformed values, then assert the button is enabled and errors are still absent. Click Save, assert errors appear and no source-create request was sent. Correct one malformed field and assert only that field's error disappears. Clear a mandatory field and assert the button becomes disabled while its required error is visible.

- [ ] **Step 2: Add card attempted state and rendering gates**

Add:

```ts
@state()
private cardValidationAttempted = false;
```

Render every card `error` as:

```ts
error: this.cardValidationAttempted
  ? this.cardDraftErrors.<field>
  : undefined,
```

Use presence for availability:

```ts
disabled:
  isSaving ||
  isEncrypting ||
  !hasRequiredCardDraftValues(this.cardDraft),
```

At the start of `saveCard`, after pending/interaction guards, set `cardValidationAttempted = true`. While attempted, `updateCardDraftField` recalculates the edited field's draft validation error and removes it when valid. Reset the flag in `resetCardFlow` and after successful creation.

- [ ] **Step 3: Verify card behavior**

Run build and the focused flow test. Expected: no initial errors; presence enables Save; click reveals errors; correction clears; clearing disables.

### Task 3: Gate Schema and Legacy Bank Errors Behind Save

**Files:**

- Modify: `src/commerce-hub-connect.ts`
- Test: `src/test/commerce-hub-connect-flow_test.ts`

- [ ] **Step 1: Add failing schema-bank and legacy-bank behavior tests**

For schema bank entry, assert initial `.field-error` count is zero and Save is disabled. Fill required fields with non-empty invalid values, assert Save is enabled and errors remain hidden, click Save, then assert visible errors and no `/interaction/source/ach` request. Correct a field and assert its error clears. Clear a required field and assert Save disables.

Repeat the same contract for the legacy bank form.

- [ ] **Step 2: Add shared bank attempted state**

Add:

```ts
@state()
private bankAccountValidationAttempted = false;
```

For schema bank JSON Forms use:

```ts
.validationMode=${
  this.bankAccountValidationAttempted
    ? 'ValidateAndShow'
    : 'ValidateAndHide'
}
```

Enable Save based on:

```ts
hasRequiredJsonSchemaValues(
  this.bankAccountFormSchema,
  this.bankAccountFormData
);
```

Set the attempted flag before the `bankAccountFormValid` early return in `saveManualBankAccount`.

For legacy JSON Forms, use the same validation mode and pass `{}` for renderer errors and `[]` for additional errors before attempted. Enable Save with `hasRequiredBankAccountDraftValues` plus the existing pending/encryption guards. Set attempted before validation in `saveLegacyManualBankAccount`.

Reset the flag whenever bank flow/form state resets or a new schema is selected.

- [ ] **Step 3: Verify both bank modes**

Run build and focused bank tests. Expected: both modes satisfy initial-hidden, presence-enabled, submit-visible, correction-clear, and clear-to-disabled behavior.

### Task 4: Gate Transfer and Required-Information Actions

**Files:**

- Modify: `src/commerce-hub-connect.ts`
- Test: `src/test/commerce-hub-connect-payment-selection_test.ts`

- [ ] **Step 1: Add failing transfer tests**

Assert Transfer is initially visible and disabled with no errors. Populate From, To, and Amount with non-empty invalid values, assert enabled with no errors, click Transfer, assert errors and no API call, correct a field and assert its error clears, then clear a mandatory value and assert disabled with required error visible.

- [ ] **Step 2: Implement transfer attempted state**

Add `transferValidationAttempted`, render transfer errors only when attempted, enable using `hasRequiredTransferDraftValues`, set attempted in `reviewTransfer`, and reset it in `resetTransferFlow`. Existing `updateTransferDraftField` provides live recalculation after attempted.

- [ ] **Step 3: Align required-information presence**

Change `canSubmitRequiredInfo` so all documents treated as mandatory (`doc.mandatory !== false`) must have values. If none are mandatory, require at least one optional value. Keep the action visible and disabled until that condition is met. Add submit-attempted inline validation for malformed non-empty text values, including incomplete Social Security numbers, and clear the field error while editing. Existing submission errors already clear on text/file changes.

- [ ] **Step 4: Confirm OTP and required-information behavior**

Add assertions that OTP Verify is visible/disabled until all digits exist, server rejection appears only after Verify, and editing clears it. Add required-information assertions for visible/disabled, all-mandatory enablement, malformed SSN rejection without an API request, and edit clearing.

### Task 5: Regenerate and Verify Without Committing

**Files:**

- Regenerate: `docs/commerce-hub-connect.bundled.js`
- Verify every modified source and test file.

- [ ] **Step 1: Regenerate build and bundle**

Run:

```bash
npm run build
npm run docs:build
```

- [ ] **Step 2: Run lint and runnable tests**

Run:

```bash
npm run lint
npm_config_cache=/tmp/chc-npm-cache npm run test:proxy-auth
npm_config_cache=/tmp/chc-npm-cache npm run test:package-surface
BROWSERS=chromium npm run test:dev
BROWSERS=chromium npm run test:prod
```

Record the managed-environment `EPERM` port-bind limitation separately if browser tests cannot start.

- [ ] **Step 3: Audit the uncommitted working tree**

Run:

```bash
git diff --check
git status --short --branch --untracked-files=all
git diff --stat
```

Expected: all validation changes, design, plan, tests, and generated bundle remain uncommitted; the pre-existing architecture assessment remains untouched.
