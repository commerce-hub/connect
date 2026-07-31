# Remain on Payment Method List After Selection Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Keep the saved-payment-method list visible after **Use selected method** succeeds while preserving the existing attach state updates and `onSelect` payload.

**Architecture:** Change only the explicit-selection success branch in `attachPaymentSource`: retain the list view, emit the existing `PaymentSource`, and restore focus to the checked radio. Keep response merging, `selectedPaymentSourceId`, error handling, mark-default behavior, and other selected-summary entry paths unchanged.

**Tech Stack:** TypeScript 5.9, Lit 3, Mocha TDD, @web/test-runner, @open-wc/testing, Rollup, Eleventy.

---

## File Structure

- Modify `src/test/commerce-hub-connect-payment-selection_test.ts` to define the successful explicit-selection behavior and focus contract.
- Modify `src/commerce-hub-connect.ts` to keep the list visible and focus the checked radio after attachment.
- Regenerate `docs/commerce-hub-connect.bundled.js` so the checked-in browser bundle matches the SDK source.
- Modify `README.md` and `docs-src/flow.md` to document list-preserving selection without changing the `onSelect` contract.
- Regenerate `docs/flow/index.html` from `docs-src/flow.md`.

### Task 1: Keep Explicit Selection on the List

**Files:**

- Modify: `src/test/commerce-hub-connect-payment-selection_test.ts:2474`
- Modify: `src/commerce-hub-connect.ts:4615`
- Regenerate: `docs/commerce-hub-connect.bundled.js`

- [ ] **Step 1: Replace the selected-summary assertions with list and focus assertions**

In `src/test/commerce-hub-connect-payment-selection_test.ts`, replace the block beginning with `await clickAction(el, 'attach-payment-source');` through the final title assertion in the test `Use selected method attaches the draft source and emits onSelect` with:

```ts
    await clickAction(el, 'attach-payment-source');
    await waitFor(
      () => {
        const selectedRadio =
          el.shadowRoot!.querySelector<HTMLInputElement>(
            '.payment-method-radio:checked'
          );

        return (
          successEvents.length === 1 &&
          el.shadowRoot!.querySelector('.widget-title')?.textContent?.trim() ===
            'Payment methods' &&
          selectedRadio?.value === 'card-1' &&
          el.shadowRoot!.activeElement === selectedRadio
        );
      },
      'payment method list did not remain active after selection'
    );

    assert.deepEqual(
      requests.map(
        (request) => `${request.method} ${new URL(request.url).pathname}`
      ),
      ['POST /interaction/source/card-1/attach']
    );
    assert.equal(successEvents.length, 1);
    assert.equal(successEvents[0].detail.id, 'card-1');
    assert.lengthOf(legacySuccessEvents, 0);
    assert.lengthOf(errorEvents, 0);
    assert.notExists(
      el.shadowRoot!.querySelector('.selected-payment-method')
    );
    assert.equal(
      el.shadowRoot!.querySelector('.widget-title')?.textContent?.trim(),
      'Payment methods'
    );
```

- [ ] **Step 2: Run the focused test and verify it fails**

Run:

```bash
BROWSERS=chromium npm run test:dev -- --files src/test/commerce-hub-connect-payment-selection_test.ts
```

Expected: FAIL in `Use selected method attaches the draft source and emits onSelect` because the current success branch renders **Payment method saved** and focuses the Change action instead of the checked radio.

- [ ] **Step 3: Implement the minimal list-preserving success behavior**

In the explicit-selection success branch of `attachPaymentSource` in `src/commerce-hub-connect.ts`, replace:

```ts
      this.paymentSourceView = 'selected';
      this.emitSdkEvent(ON_SELECT_EVENT, attachedSource);
      this.focusAfterUpdate('[data-action="change-payment-source"]');
```

with:

```ts
      this.paymentSourceView = 'list';
      this.emitSdkEvent(ON_SELECT_EVENT, attachedSource);
      this.focusAfterUpdate('.payment-method-radio:checked');
```

Do not modify response merging, `selectedPaymentSourceId`, event detail, the `mark-default` branch, or the catch/finally blocks.

- [ ] **Step 4: Run the focused test and verify it passes**

Run:

```bash
BROWSERS=chromium npm run test:dev -- --files src/test/commerce-hub-connect-payment-selection_test.ts
```

Expected: PASS, including the updated explicit-selection test, existing mark-default test, and existing attachment-failure test.

- [ ] **Step 5: Regenerate the checked-in SDK documentation bundle**

Run:

```bash
npm run docs:build
```

Expected: Rollup completes and updates `docs/commerce-hub-connect.bundled.js` with the list-preserving attach branch.

- [ ] **Step 6: Verify the behavior diff and commit it**

Run:

```bash
git diff --check
git diff -- src/commerce-hub-connect.ts src/test/commerce-hub-connect-payment-selection_test.ts docs/commerce-hub-connect.bundled.js
git status --short
```

Expected: only the behavior test, implementation, regenerated bundle, the plan file, and the pre-existing untracked architecture assessment appear; no `onSelect` type or payload changes appear.

Commit:

```bash
git add src/commerce-hub-connect.ts src/test/commerce-hub-connect-payment-selection_test.ts docs/commerce-hub-connect.bundled.js
git commit -m "Keep payment selection on method list"
```

### Task 2: Document the List-Preserving Flow

**Files:**

- Modify: `README.md:57`
- Modify: `docs-src/flow.md:67`
- Regenerate: `docs/flow/index.html`

- [ ] **Step 1: Update the README selection description**

In `README.md`, replace:

```md
Verified saved methods use radio controls. **Use selected method** remains
disabled until a method is selected, then attaches that source before emitting
`onSelect`. When adding is available, **Add payment method** sits beside the
selection action.
```

with:

```md
Verified saved methods use radio controls. **Use selected method** remains
disabled until a method is selected, then attaches that source, emits
`onSelect`, and keeps the saved-method list visible with that source selected.
When adding is available, **Add payment method** sits beside the selection
action.
```

Leave the following tender-option and bottom-sheet sentences unchanged.

- [ ] **Step 2: Update the detailed flow documentation**

In `docs-src/flow.md`, replace:

```md
Verified saved methods render as radio choices. The **Use selected method**
button is enabled after a choice is made and attaches that source before
emitting `onSelect`. **Add payment method** opens a modal bottom sheet with
```

with:

```md
Verified saved methods render as radio choices. The **Use selected method**
button is enabled after a choice is made, attaches that source, emits
`onSelect`, and keeps the saved-method list visible with that source selected.
**Add payment method** opens a modal bottom sheet with
```

Do not alter the event detail description: it remains `PaymentSource`.

- [ ] **Step 3: Regenerate the static flow page**

Run:

```bash
npm run docs:gen
```

Expected: Eleventy completes and `docs/flow/index.html` contains the new list-preserving description.

- [ ] **Step 4: Verify and commit the documentation**

Run:

```bash
rg -n "keeps the saved-method list visible" README.md docs-src/flow.md docs/flow/index.html
git diff --check
git status --short
```

Expected: the sentence appears in all three documentation representations, and the architecture assessment remains untracked.

Commit:

```bash
git add README.md docs-src/flow.md docs/flow/index.html
git commit -m "Document list-preserving payment selection"
```

### Task 3: Verify the Complete SDK Change

**Files:**

- Verify all files committed in Tasks 1 and 2.

- [ ] **Step 1: Run the TypeScript build**

Run:

```bash
npm run build
```

Expected: exit code 0 with no TypeScript errors.

- [ ] **Step 2: Run lint**

Run:

```bash
npm run lint
```

Expected: exit code 0. The two existing `jsonforms-lit-dispatch` missing-import warnings may remain; no errors or new warnings are introduced.

- [ ] **Step 3: Run package-level tests with a writable npm cache**

Run:

```bash
npm_config_cache=/tmp/chc-npm-cache npm run test:proxy-auth
npm_config_cache=/tmp/chc-npm-cache npm run test:package-surface
```

Expected: 4 proxy-auth tests and 3 package-surface tests pass.

- [ ] **Step 4: Run the full browser test suite**

Run:

```bash
npm run test:dev
npm run test:prod
```

Expected: both modes pass. If the managed environment blocks the runner from binding `0.0.0.0:8000` with `EPERM`, record that environment limitation and retain the focused test, build, lint, and package-test evidence.

- [ ] **Step 5: Audit the final branch state**

Run:

```bash
git diff --check
git status --short --branch --untracked-files=all
git log -5 --oneline --decorate
```

Expected: the index and tracked working tree are clean; only `architecture/commerce-hub-connect-sdk-architecture-assessment.md` remains untracked; the design, behavior, and documentation commits appear in history.
