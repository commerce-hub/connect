# Payment Method Action Refinements Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make every Mark as default operation update the default without emitting `onSelect`, replace overflow-menu Edit with confirmed Delete, and prevent the last row's open menu from inheriting the list fade.

**Architecture:** Give source attachment an explicit `select` or `mark-default` intent and branch only its successful completion behavior. Keep delete confirmation in the existing host state but render it directly from a normal row, eliminating edit mode. Add a last-menu-open class at the payment-method screen boundary so CSS can temporarily remove the scroll-list mask without changing other menus.

**Tech Stack:** Lit 3, TypeScript 5.9, Shadow DOM CSS, Mocha, @web/test-runner, @open-wc/testing, Playwright Chromium.

---

## File Structure

- `src/commerce-hub-connect.ts`: attachment intent, default completion, delegated menu actions, and removal of edit-mode state.
- `src/internal/types.ts`: action-name and payment-screen-model cleanup.
- `src/internal/primitives.ts`: Delete menu item and confirmation-row rendering.
- `src/internal/screens/payment-methods-screen.ts`: row confirmation state and last-row-open class.
- `src/internal/styles.ts`: mask override and removal of obsolete edit/Done styling where unused.
- `src/test/commerce-hub-connect-payment-selection_test.ts`: saved-source default, direct delete, and last-row mask behavior.
- `src/test/commerce-hub-connect-flow_test.ts`: new-card default event contract and affected menu assertions.
- `src/test/commerce-hub-connect-primitives_test.ts`: primitive Delete/confirmation contracts and model cleanup.
- `README.md` and `docs-src/flow.md`: revised public event and flow documentation.
- `docs/commerce-hub-connect.bundled.js`: regenerated documentation bundle.

The worktree already contains overlapping uncommitted changes in most of these files. Preserve those changes and do not create implementation commits that would accidentally include them. Use path-scoped diffs as checkpoints instead.

### Task 1: Separate default assignment from checkout selection

**Files:**

- Modify: `src/commerce-hub-connect.ts:340-365,2420-2480,3980-4040,4530-4595`
- Modify: `src/internal/types.ts:58-75`
- Test: `src/test/commerce-hub-connect-payment-selection_test.ts:150-205,2290-2460`
- Test: `src/test/commerce-hub-connect-flow_test.ts:3990-4090`

- [ ] **Step 1: Change the saved-source test to require default-only completion**

Rename the existing test and replace its post-response success assertions with:

```ts
await markPaymentSourceAsDefault(el, 'card-1');
resolveAttachResponse?.(
  new Response(
    JSON.stringify({
      interactionId: 'interaction-payment',
      status: 'PAYMENT_SOURCE_ATTACHED',
      selectedSource: refreshedSource,
      paymentSources: [refreshedSource],
      billerAddress: [],
    }),
    {status: 200, headers: {'Content-Type': 'application/json'}}
  )
);

await waitFor(
  () => el.interactionResponse?.selectedSource?.id === 'card-1',
  'default source did not update'
);
await flushElement(el);

assert.lengthOf(successEvents, 0);
assert.lengthOf(legacySuccessEvents, 0);
assert.lengthOf(errorEvents, 0);
assert.equal(
  el.shadowRoot!.querySelector('.widget-title')?.textContent?.trim(),
  'Payment methods'
);
assert.equal(
  el
    .shadowRoot!.querySelector('.payment-method-default-label')
    ?.textContent?.trim(),
  'Default'
);
assert.notExists(el.shadowRoot!.querySelector('.selected-payment-method'));
```

- [ ] **Step 2: Change the new-card test to reject `onSelect`**

In the checked `#card-mark-as-default` card-save test, retain the `onAddPaymentMethod` and attach-request assertions, then require:

```ts
assert.deepEqual(eventOrder, ['onAddPaymentMethod']);
assert.equal(el.interactionResponse?.selectedSource?.id, 'card-created');
assert.equal(
  el.shadowRoot!.querySelector('.widget-title')?.textContent?.trim(),
  'Payment methods'
);
assert.notExists(el.shadowRoot!.querySelector('.selected-payment-method'));
```

- [ ] **Step 3: Run both focused tests and verify RED**

Run:

```bash
BROWSERS=chromium npm run test:dev -- --files src/test/commerce-hub-connect-payment-selection_test.ts src/test/commerce-hub-connect-flow_test.ts
```

Expected: FAIL because successful attachment still emits `onSelect` and switches to the selected-source confirmation screen.

- [ ] **Step 4: Add an explicit attachment intent and menu action**

Add this member to the existing `FlowActionName` union and add the local intent
type near the other flow types:

```ts
| 'mark-payment-source-default'

type PaymentSourceAttachmentIntent = 'select' | 'mark-default';
```

Change the overflow button action to `mark-payment-source-default`. In the delegated click handler, route it explicitly:

```ts
if (action === 'mark-payment-source-default') {
  if (paymentMethodId) {
    this.clearDeletePaymentSourceConfirmation();
    void this.attachPaymentSource(paymentMethodId, 'mark-default');
  }
  return;
}
```

Pass the same intent after creating a checked, verified card:

```ts
await this.attachPaymentSource(createdSource.id, 'mark-default');
```

Update the method signature:

```ts
private async attachPaymentSource(
  paymentSourceId: string,
  intent: PaymentSourceAttachmentIntent = 'select'
)
```

Replace the existing successful-completion block after `attachedSource` is
resolved with:

```ts
this.selectedPaymentSourceId = attachedSource.id;
this.setInteractionResponseFromSdk(refreshedInteractionResponse);

if (intent === 'mark-default') {
  this.paymentSourceView = 'list';
  return;
}

this.paymentSourceView = 'selected';
this.emitSdkEvent(ON_SELECT_EVENT, attachedSource);
this.focusAfterUpdate('[data-action="change-payment-source"]');
```

- [ ] **Step 5: Run the focused tests and verify GREEN**

Run the Step 3 command.

Expected: PASS; both saved and newly created defaults attach without `onSelect`, while the list remains rendered.

- [ ] **Step 6: Inspect the checkpoint without committing overlapping work**

Run:

```bash
git diff --check -- src/commerce-hub-connect.ts src/internal/types.ts src/internal/primitives.ts src/test/commerce-hub-connect-payment-selection_test.ts src/test/commerce-hub-connect-flow_test.ts
```

Expected: no output.

### Task 2: Replace Edit mode with direct confirmed Delete

**Files:**

- Modify: `src/internal/types.ts:58-75,235-255`
- Modify: `src/internal/primitives.ts:175-230,270-335,625-710`
- Modify: `src/internal/screens/payment-methods-screen.ts:20-55`
- Modify: `src/commerce-hub-connect.ts:710-735,770-800,1080-1140,2425-2530,4680-4780`
- Test: `src/test/commerce-hub-connect-primitives_test.ts:1010-1050,1430-1560`
- Test: `src/test/commerce-hub-connect-payment-selection_test.ts:1300-1420,1620-1910`
- Test: `src/test/commerce-hub-connect-flow_test.ts:470-500,1730-1770`

- [ ] **Step 1: Replace Edit/Done assertions with Delete/confirmation assertions**

Add or revise a component test to express the complete first-click behavior:

```ts
const openPaymentSourceMenu = async (
  el: CommerceHubConnect,
  paymentMethodId: string
) => {
  el.shadowRoot!.querySelector<HTMLButtonElement>(
    `[data-action="toggle-payment-source-menu"][data-payment-method-id="${paymentMethodId}"]`
  )!.click();
  await flushElement(el);
};

test('overflow Delete opens inline confirmation without edit mode or a request', async () => {
  const requests: CapturedRequest[] = [];
  window.fetch = async (input: RequestInfo | URL) => {
    const request = input instanceof Request ? input : new Request(input);
    requests.push({
      url: request.url,
      method: request.method,
      headers: new Headers(request.headers),
      bodyText: await request.clone().text(),
      credentials: request.credentials,
    });
    return new Response('', {status: 200});
  };
  const el = await renderConnect({
    interactionId: 'interaction-payment',
    status: 'PAYMENT_SOURCE_REQUESTED',
    paymentSources: [
      {
        tenderType: 'Card',
        id: 'card-1',
        name: 'Corporate card',
        verificationInfo: {status: 'VERIFIED'},
        card: {
          network: 'Visa',
          cardNumber: '4111111111111111',
        },
      },
    ],
  });

  await openPaymentSourceMenu(el, 'card-1');
  const deleteMenuItem = el.shadowRoot!.querySelector<HTMLButtonElement>(
    '[role="menuitem"][data-action="delete-payment-source"]'
  )!;
  assert.equal(deleteMenuItem.textContent?.trim(), 'Delete');
  assert.notExists(
    el.shadowRoot!.querySelector('[data-action="edit-payment-source"]')
  );
  assert.notExists(
    el.shadowRoot!.querySelector('[data-action="done-editing-payment-source"]')
  );

  deleteMenuItem.click();
  await flushElement(el);

  assert.lengthOf(requests, 0);
  assert.equal(
    el
      .shadowRoot!.querySelector('.payment-method-delete-confirmation')
      ?.textContent?.trim(),
    'Remove this payment method?'
  );
});
```

- [ ] **Step 2: Run the payment-selection test and verify RED**

Run:

```bash
BROWSERS=chromium npm run test:dev -- --files src/test/commerce-hub-connect-payment-selection_test.ts
```

Expected: FAIL because the menu still renders Edit, confirmation depends on `editedPaymentSourceId`, and Done is still rendered.

- [ ] **Step 3: Render Delete and confirmation directly**

In the overflow menu, replace Edit with:

```ts
<button
  type="button"
  role="menuitem"
  data-action="delete-payment-source"
  data-payment-method-id=${method.id}
  ?disabled=${method.disabled}
>
  Delete
</button>
```

Make confirmation take precedence in `renderPaymentMethodRow`:

```ts
if (confirmingDelete) {
  return html`
    <div
      class="payment-method-row payment-method-row-edit payment-method-row-delete-confirming"
      part="payment-method-row"
      aria-label=${label}
      data-payment-method-id=${id}
    >
      ${renderPaymentMethodMain(
        {...method, showVerificationStatus: false},
        false
      )} ${renderPaymentMethodDeleteAction(id, label, deleteDisabled, true)}
    </div>
  `;
}
```

Remove the `editing` option and non-confirming delete-icon branch. In `renderPaymentMethodsScreen`, pass only `confirmingDelete`, `menuOpen`, and `showMarkAsDefault`.

- [ ] **Step 4: Remove edit-mode host and type state**

Remove:

```ts
private editedPaymentSourceId?: string;
```

Remove `edit-payment-source` and `done-editing-payment-source` from `FlowActionName`, remove `editedPaymentSourceId` from `PaymentMethodsScreenModel`, delete both click-handler branches, and remove all assignments that only clear that state.

Delete `doneAction` and pass no `titleAction` from the payment-method list. Render the Transfer toolbar based only on `showTransferAction`.

Keep the existing `deletePaymentSource` two-step contract unchanged: the menu's first Delete call arms `deleteConfirmationPaymentSourceId`; the confirmation's Delete call sends the request; Cancel and timeout clear it.

- [ ] **Step 5: Update primitive and flow regressions**

Replace primitive fixtures using `{editing: true}` or `editedPaymentSourceId` with `{confirmingDelete: true}`. Replace test helpers that click Edit with a helper that opens the menu and clicks Delete once:

```ts
const requestPaymentSourceDeletion = async (
  el: CommerceHubConnect,
  paymentMethodId: string
) => {
  await openPaymentSourceMenu(el, paymentMethodId);
  el.shadowRoot!.querySelector<HTMLButtonElement>(
    `[data-action="delete-payment-source"][data-payment-method-id="${paymentMethodId}"]`
  )!.click();
  await flushElement(el);
};
```

Retain separate tests for confirmation, Cancel, timeout, successful DELETE, and `onDeletePaymentMethod`.

- [ ] **Step 6: Run affected suites and verify GREEN**

Run:

```bash
BROWSERS=chromium npm run test:dev -- --files src/test/commerce-hub-connect-primitives_test.ts src/test/commerce-hub-connect-payment-selection_test.ts src/test/commerce-hub-connect-flow_test.ts
```

Expected: PASS with no Edit or Done action and with the existing two-step deletion behavior preserved.

- [ ] **Step 7: Inspect the checkpoint without committing overlapping work**

Run:

```bash
git diff --check -- src/commerce-hub-connect.ts src/internal/types.ts src/internal/primitives.ts src/internal/screens/payment-methods-screen.ts src/test/commerce-hub-connect-primitives_test.ts src/test/commerce-hub-connect-payment-selection_test.ts src/test/commerce-hub-connect-flow_test.ts
```

Expected: no output.

### Task 3: Exempt the last row's open menu from the fade mask

**Files:**

- Modify: `src/internal/screens/payment-methods-screen.ts:20-55`
- Modify: `src/internal/styles.ts:390-415`
- Test: `src/test/commerce-hub-connect-payment-selection_test.ts:680-730`

- [ ] **Step 1: Add failing mask-state coverage**

Extend the overflow-list test with last-row and non-last-row checks:

```ts
const openMenu = async (paymentMethodId: string) => {
  el.shadowRoot!.querySelector<HTMLButtonElement>(
    `[data-action="toggle-payment-source-menu"][data-payment-method-id="${paymentMethodId}"]`
  )!.click();
  await flushElement(el);
};

await openMenu('card-1');
assert.include(getComputedStyle(list).maskImage, 'linear-gradient');

await openMenu(`card-${paymentSources.length}`);
assert.equal(getComputedStyle(list).maskImage, 'none');
assert.equal(getComputedStyle(list).webkitMaskImage, 'none');

await openMenu(`card-${paymentSources.length}`);
assert.include(getComputedStyle(list).maskImage, 'linear-gradient');
assert.include(getComputedStyle(list).webkitMaskImage, 'linear-gradient');
```

- [ ] **Step 2: Run the focused test and verify RED**

Run:

```bash
BROWSERS=chromium npm run test:dev -- --files src/test/commerce-hub-connect-payment-selection_test.ts
```

Expected: FAIL because the list always retains the gradient mask.

- [ ] **Step 3: Add contextual markup and CSS**

Compute the state in `renderPaymentMethodsScreen`:

```ts
const lastMethodId = methods[methods.length - 1]?.id;
const lastMenuOpen =
  Boolean(lastMethodId) && openPaymentSourceMenuId === lastMethodId;
```

Render the class:

```ts
<div
  class=${lastMenuOpen
    ? 'primitive-stack primitive-stack-menu-open-last'
    : 'primitive-stack'}
  aria-label="Payment methods"
>
```

Add the specificity-matched mask override:

```css
.widget-shell-payment-methods
  .widget-content
  .primitive-stack.primitive-stack-menu-open-last {
  -webkit-mask-image: none;
  mask-image: none;
}
```

- [ ] **Step 4: Run the focused test and verify GREEN**

Run the Step 2 command.

Expected: PASS; only the last row's open menu removes the mask, and closing it restores the gradient.

- [ ] **Step 5: Inspect the checkpoint without committing overlapping work**

Run:

```bash
git diff --check -- src/internal/screens/payment-methods-screen.ts src/internal/styles.ts src/test/commerce-hub-connect-payment-selection_test.ts
```

Expected: no output.

### Task 4: Align documentation and verify the complete change

**Files:**

- Modify: `README.md:145-165`
- Modify: `docs-src/flow.md:145-160`
- Regenerate: `docs/commerce-hub-connect.bundled.js`

- [ ] **Step 1: Update the event contract documentation**

Replace text that says Mark as default emits `onSelect` with:

```md
`onSelect` remains the completion boundary only for explicit payment-source
selection. Marking a saved source or a newly added card as default attaches the
source and updates the Default badge, but does not emit `onSelect` or complete
host-owned checkout work.
```

Describe saved-source overflow actions as Mark as default and Delete, including the inline Delete confirmation.

- [ ] **Step 2: Format touched source and documentation files**

Run:

```bash
npx prettier --write README.md docs-src/flow.md src/commerce-hub-connect.ts src/internal/types.ts src/internal/primitives.ts src/internal/screens/payment-methods-screen.ts src/internal/styles.ts src/test/commerce-hub-connect-primitives_test.ts src/test/commerce-hub-connect-payment-selection_test.ts src/test/commerce-hub-connect-flow_test.ts
```

Expected: files are formatted without errors.

- [ ] **Step 3: Rebuild the generated documentation**

Run:

```bash
npm run docs
```

Expected: exit 0 and `docs/commerce-hub-connect.bundled.js` reflects the new behavior.

- [ ] **Step 4: Run static verification**

Run:

```bash
npm run build
npm run lint
```

Expected: both commands exit 0 with no TypeScript, ESLint, or Lit diagnostics.

- [ ] **Step 5: Run the complete test suite**

Run:

```bash
BROWSERS=chromium npm test
```

Expected: development and production browser suites plus proxy-auth and package-surface tests pass.

- [ ] **Step 6: Review the final scoped diff**

Run:

```bash
git diff --check
git status --short
git diff -- README.md docs-src/flow.md src/commerce-hub-connect.ts src/internal/types.ts src/internal/primitives.ts src/internal/screens/payment-methods-screen.ts src/internal/styles.ts src/test/commerce-hub-connect-primitives_test.ts src/test/commerce-hub-connect-payment-selection_test.ts src/test/commerce-hub-connect-flow_test.ts
```

Expected: no whitespace errors; only intended behavior, test, documentation, and generated-file changes are present. Do not commit the overlapping worktree without explicit user authorization.
