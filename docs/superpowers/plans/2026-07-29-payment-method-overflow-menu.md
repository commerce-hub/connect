# Payment Method Overflow Menu Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace list-wide payment-method selection and edit controls with an accessible per-row overflow menu, direct default attachment, row-scoped deletion, and a `selectedSource`-backed Default label.

**Architecture:** Extend the payment-method view model with `isDefault`, keep row rendering in the existing primitives and payment-method screen modules, and let the Lit host own only the open-menu and edited-row IDs. New menu actions use the existing delegated click handler and existing attach/delete methods.

**Tech Stack:** Lit 3, TypeScript 5.9, Shadow DOM CSS, Mocha, @web/test-runner, @open-wc/testing, Playwright Chromium.

---

## File Structure

- `src/internal/types.ts`: menu action names, `PaymentMethod.isDefault`, and row-scoped screen state.
- `src/internal/primitives.ts`: Default label, ellipsis menu, verification affordance, and row edit controls.
- `src/internal/screens/payment-methods-screen.ts`: per-row state composition.
- `src/internal/styles.ts`: overflow menu, Default label, and revised row layout.
- `src/commerce-hub-connect.ts`: default mapping, menu/edit state, delegated actions, dismissal, and removal of old controls.
- `src/test/commerce-hub-connect-primitives_test.ts`: primitive semantics and accessibility.
- `src/test/commerce-hub-connect-payment-selection_test.ts`: feature combinations and end-to-end component behavior.
- `src/test/commerce-hub-connect-flow_test.ts`: regression assertions affected by removed controls.

The current worktree contains overlapping user changes. Do not create implementation commits unless the changed hunks have been isolated or the user explicitly authorizes committing them.

### Task 1: Define and test the row-menu view model

**Files:**

- Modify: `src/internal/types.ts:58-96,237-250,353-375`
- Test: `src/test/commerce-hub-connect-primitives_test.ts:1150-1570`

- [ ] **Step 1: Write failing primitive contract tests**

```ts
test('renders a default label and accessible payment method overflow menu', async () => {
  const method: PaymentMethod = {
    id: 'card-1',
    label: 'Corporate Visa',
    accountLabel: 'Visa ending 1111',
    type: 'card',
    brand: 'Visa',
    last4: '1111',
    status: 'verified',
    isDefault: true,
  };
  const root = await renderHarness(html`
    ${renderPaymentMethodRow(method, {
      menuOpen: true,
      showMarkAsDefault: true,
    })}
  `);
  const trigger = root.querySelector<HTMLButtonElement>(
    '[data-action="toggle-payment-source-menu"]'
  )!;
  const menu = root.querySelector<HTMLElement>('[role="menu"]')!;
  const markDefault = root.querySelector<HTMLButtonElement>(
    '[data-action="attach-payment-source"]'
  )!;

  assert.equal(
    trigger.getAttribute('aria-label'),
    'More actions for Corporate Visa'
  );
  assert.equal(trigger.getAttribute('aria-expanded'), 'true');
  assert.equal(trigger.getAttribute('aria-controls'), menu.id);
  assert.equal(
    trigger.querySelector('svg')?.getAttribute('viewBox'),
    '0 0 640 640'
  );
  assert.equal(
    root.querySelector('.payment-method-default-label')?.textContent,
    'Default'
  );
  assert.isFalse(markDefault.disabled);
  assert.equal(markDefault.dataset.paymentMethodId, 'card-1');
  assert.equal(
    root
      .querySelector('[data-action="edit-payment-source"]')
      ?.textContent?.trim(),
    'Edit'
  );
});

test('omits Mark as default when SELECT is unavailable', async () => {
  const root = await renderHarness(html`
    ${renderPaymentMethodRow(
      {
        id: 'bank-1',
        label: 'Operating account',
        brand: 'Bank',
        last4: '3210',
        status: 'under-review',
      },
      {menuOpen: true, showMarkAsDefault: false}
    )}
  `);

  assert.notExists(root.querySelector('[data-action="attach-payment-source"]'));
  assert.exists(root.querySelector('[data-action="edit-payment-source"]'));
});
```

- [ ] **Step 2: Run the primitive tests and verify RED**

Run:

```bash
BROWSERS=chromium npm run test:dev -- --files src/test/commerce-hub-connect-primitives_test.ts
```

Expected: FAIL because `isDefault`, `menuOpen`, and `showMarkAsDefault` do not exist.

- [ ] **Step 3: Add the type contract**

Add these `FlowActionName` members:

```ts
  | 'toggle-payment-source-menu'
  | 'edit-payment-source'
```

Add to `PaymentMethod`:

```ts
  isDefault?: boolean;
```

Replace `editing` and `selectedPaymentSourceId` in `PaymentMethodsScreenModel` with:

```ts
  openPaymentSourceMenuId?: string;
  editedPaymentSourceId?: string;
```

- [ ] **Step 4: Run the TypeScript build to expose every consumer**

Run `npm run build`.

Expected: FAIL at screen call sites that still pass the removed list-wide fields.

### Task 2: Render the ellipsis menu, Default label, and row-specific Edit UI

**Files:**

- Modify: `src/internal/primitives.ts:111-252,537-670`
- Modify: `src/internal/styles.ts:1260-1560`
- Test: `src/test/commerce-hub-connect-primitives_test.ts:1150-1570`

- [ ] **Step 1: Add a failing test for row-scoped Edit and verification**

```ts
test('shows delete only on the edited row while retaining verification', async () => {
  const root = await renderHarness(html`
    ${renderPaymentMethodRow(
      {
        id: 'card-1',
        label: 'Corporate Visa',
        brand: 'Visa',
        last4: '1111',
        status: 'verified',
      },
      {editing: true}
    )} ${renderPaymentMethodRow(
      {
        id: 'bank-1',
        label: 'Operating account',
        brand: 'Bank',
        last4: '3210',
        status: 'not-verified',
      },
      {showMarkAsDefault: true}
    )}
  `);
  const rows = root.querySelectorAll<HTMLElement>('.payment-method-row');

  assert.exists(rows[0].querySelector('[data-action="delete-payment-source"]'));
  assert.notExists(
    rows[1].querySelector('[data-action="delete-payment-source"]')
  );
  assert.exists(rows[1].querySelector('[data-action="verify-payment-source"]'));
  assert.exists(
    rows[1].querySelector('[data-action="toggle-payment-source-menu"]')
  );
});
```

- [ ] **Step 2: Run the primitive test and verify RED**

Run the Task 1 Chromium command.

Expected: FAIL because a row cannot yet render verification and an overflow button as siblings.

- [ ] **Step 3: Implement the supplied SVG menu helper**

Add `renderPaymentMethodOverflowAction(method, options)` with this markup:

```ts
const renderPaymentMethodOverflowAction = (
  method: PaymentMethod,
  {
    menuOpen,
    showMarkAsDefault,
    disabled,
  }: {
    menuOpen: boolean;
    showMarkAsDefault: boolean;
    disabled: boolean;
  }
): TemplateResult => {
  const menuId = `payment-method-menu-${method.id}`;
  const markDefaultDisabled = disabled || method.status !== 'verified';

  return html`
    <span class="payment-method-overflow">
      <button
        class="payment-method-overflow-button"
        type="button"
        aria-label=${`More actions for ${method.label}`}
        aria-haspopup="menu"
        aria-expanded=${menuOpen ? 'true' : 'false'}
        aria-controls=${menuId}
        data-action="toggle-payment-source-menu"
        data-payment-method-id=${method.id}
        ?disabled=${disabled}
      >
        <!--! Font Awesome Free 7.3.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc. -->
        <svg viewBox="0 0 640 640" aria-hidden="true">
          <path
            d="M320 208C289.1 208 264 182.9 264 152C264 121.1 289.1 96 320 96C350.9 96 376 121.1 376 152C376 182.9 350.9 208 320 208zM320 432C350.9 432 376 457.1 376 488C376 518.9 350.9 544 320 544C289.1 544 264 518.9 264 488C264 457.1 289.1 432 320 432zM376 320C376 350.9 350.9 376 320 376C289.1 376 264 350.9 264 320C264 289.1 289.1 264 320 264C350.9 264 376 289.1 376 320z"
          ></path>
        </svg>
      </button>
      ${menuOpen
        ? html`
            <span class="payment-method-menu" id=${menuId} role="menu">
              ${showMarkAsDefault
                ? html`<button
                    type="button"
                    role="menuitem"
                    data-action="attach-payment-source"
                    data-payment-method-id=${method.id}
                    ?disabled=${markDefaultDisabled}
                  >
                    Mark as default
                  </button>`
                : ''}
              <button
                type="button"
                role="menuitem"
                data-action="edit-payment-source"
                data-payment-method-id=${method.id}
                ?disabled=${disabled}
              >
                Edit
              </button>
            </span>
          `
        : ''}
    </span>
  `;
};
```

- [ ] **Step 4: Refactor the row without nested buttons**

Use a non-button `.payment-method-row` container. Inside it, render `.payment-method-row-main` as a native button only for `not-verified` and `require-info`; otherwise render a non-interactive span. Render the overflow trigger as its sibling. When `editing` is true, replace the overflow trigger with the existing delete action for that row.

Add this title-row output after the payment-method title:

```ts
${method.isDefault
  ? html`<span class="payment-method-default-label">Default</span>`
  : ''}
```

Change the row options to:

```ts
{
  editing = false,
  deleteDisabled = false,
  confirmingDelete = false,
  menuOpen = false,
  showMarkAsDefault = false,
}: {
  editing?: boolean;
  deleteDisabled?: boolean;
  confirmingDelete?: boolean;
  menuOpen?: boolean;
  showMarkAsDefault?: boolean;
} = {}
```

- [ ] **Step 5: Add the menu and revised-row styles**

```css
.payment-method-row {
  position: relative;
  grid-template-columns: minmax(0, 1fr) auto;
}
.payment-method-row-main {
  min-width: 0;
  display: grid;
  grid-template-columns: 2.375rem minmax(0, 1fr) auto;
  gap: 0.625rem;
  align-items: center;
  border: 0;
  padding: 0;
  background: transparent;
  color: inherit;
  font: inherit;
  text-align: left;
}
.payment-method-overflow {
  position: relative;
  justify-self: end;
}
.payment-method-overflow-button {
  width: 2.75rem;
  height: 2.75rem;
  display: inline-grid;
  place-items: center;
  border: 0;
  border-radius: 0.75rem;
  background: transparent;
  color: var(--chc-copy);
}
.payment-method-overflow-button svg {
  width: 1.25rem;
  height: 1.25rem;
  fill: currentColor;
}
.payment-method-menu {
  position: absolute;
  z-index: 4;
  top: calc(100% + 0.25rem);
  right: 0;
  min-width: 10rem;
  display: grid;
  gap: 0.125rem;
  border: 0.0625rem solid var(--chc-border);
  border-radius: 0.75rem;
  padding: 0.375rem;
  background: var(--chc-surface);
  box-shadow: 0 0.625rem 1.5rem rgba(16, 24, 40, 0.16);
}
.payment-method-default-label {
  display: inline-flex;
  align-items: center;
  min-height: 1.25rem;
  border: 0.0625rem solid color-mix(in srgb, var(--chc-primary) 28%, transparent);
  border-radius: 999rem;
  padding: 0.0625rem 0.4375rem;
  background: color-mix(in srgb, var(--chc-primary) 8%, white);
  color: var(--chc-primary);
  font-size: 0.6875rem;
}
```

Add these interaction declarations using the existing theme variables:

```css
.payment-method-overflow-button:hover:not(:disabled),
.payment-method-overflow-button:focus-visible,
.payment-method-menu button:hover:not(:disabled),
.payment-method-menu button:focus-visible {
  background: var(--chc-soft-surface);
}
.payment-method-overflow-button:focus-visible,
.payment-method-menu button:focus-visible {
  outline: 0.125rem solid var(--chc-focus-ring);
  outline-offset: 0.125rem;
}
.payment-method-overflow-button:disabled,
.payment-method-menu button:disabled {
  color: var(--chc-muted);
  cursor: not-allowed;
}
```

- [ ] **Step 6: Run primitive tests and verify GREEN**

Run the Task 1 Chromium command.

Expected: PASS after updating obsolete assertions that expected radios, button outer rows, or the list-wide edit variant.

### Task 3: Compose row state and remove list-wide controls

**Files:**

- Modify: `src/internal/screens/payment-methods-screen.ts:16-54`
- Modify: `src/commerce-hub-connect.ts:710-800,1030-1195,2435-2510,2778-2835,4660-4760`
- Test: `src/test/commerce-hub-connect-payment-selection_test.ts:1160-1615`

- [ ] **Step 1: Replace the old Edit-mode test with failing row-menu tests**

```ts
test('renders row menus without header Edit or SELECT footer controls', async () => {
  const el = await renderConnect({
    interactionId: 'interaction-payment',
    status: 'PAYMENT_SOURCE_REQUESTED',
    features: ['ADD_ACCOUNT', 'SELECT'],
    paymentSources: [
      {
        tenderType: 'Card',
        id: 'card-1',
        name: 'Corporate card',
        verificationInfo: {status: 'VERIFIED'},
        card: {network: 'Visa', cardNumber: '4111111111111111'},
      },
      {
        tenderType: 'BankAccount',
        id: 'bank-1',
        name: 'Operating account',
        verificationInfo: {status: 'UNDER_REVIEW'},
        bankAccount: {accountNumber: '9876543210'},
      },
    ],
  });

  assert.lengthOf(
    el.shadowRoot!.querySelectorAll(
      '[data-action="toggle-payment-source-menu"]'
    ),
    2
  );
  assert.notExists(
    el.shadowRoot!.querySelector(
      '[data-action="toggle-payment-source-edit-mode"]'
    )
  );
  assert.notExists(
    el.shadowRoot!.querySelector('[data-action="attach-payment-source"]')
  );
  assert.notExists(el.shadowRoot!.querySelector('.payment-method-radio'));
});
```

Add these companion tests:

```ts
test('Edit exposes delete only for its row', async () => {
  const el = await renderConnect({
    interactionId: 'interaction-payment',
    status: 'PAYMENT_SOURCE_REQUESTED',
    features: ['ADD_ACCOUNT', 'SELECT'],
    paymentSources: [
      {
        tenderType: 'Card',
        id: 'card-1',
        name: 'Corporate card',
        verificationInfo: {status: 'VERIFIED'},
        card: {network: 'Visa', cardNumber: '4111111111111111'},
      },
      {
        tenderType: 'BankAccount',
        id: 'bank-1',
        name: 'Operating account',
        verificationInfo: {status: 'UNDER_REVIEW'},
        bankAccount: {accountNumber: '9876543210'},
      },
    ],
  });
  el.shadowRoot!.querySelector<HTMLButtonElement>(
    '[data-action="toggle-payment-source-menu"][data-payment-method-id="card-1"]'
  )!.click();
  await flushElement(el);
  el.shadowRoot!.querySelector<HTMLButtonElement>(
    '[data-action="edit-payment-source"][data-payment-method-id="card-1"]'
  )!.click();
  await flushElement(el);

  assert.exists(
    el.shadowRoot!.querySelector(
      '[data-action="delete-payment-source"][data-payment-method-id="card-1"]'
    )
  );
  assert.notExists(
    el.shadowRoot!.querySelector(
      '[data-action="delete-payment-source"][data-payment-method-id="bank-1"]'
    )
  );
});

test('ADD_ACCOUNT-only menus omit Mark as default', async () => {
  const el = await renderConnect({
    interactionId: 'interaction-payment',
    status: 'PAYMENT_SOURCE_REQUESTED',
    features: ['ADD_ACCOUNT'],
    paymentSources: [
      {
        tenderType: 'Card',
        id: 'card-1',
        name: 'Corporate card',
        verificationInfo: {status: 'VERIFIED'},
        card: {network: 'Visa', cardNumber: '4111111111111111'},
      },
    ],
  });
  el.shadowRoot!.querySelector<HTMLButtonElement>(
    '[data-action="toggle-payment-source-menu"]'
  )!.click();
  await flushElement(el);

  assert.notExists(
    el.shadowRoot!.querySelector('[data-action="attach-payment-source"]')
  );
  assert.exists(
    el.shadowRoot!.querySelector('[data-action="edit-payment-source"]')
  );
  assert.exists(el.shadowRoot!.querySelector('.payment-method-add-footer'));
});

test('only one menu opens and Escape closes it with focus restored', async () => {
  const el = await renderConnect({
    interactionId: 'interaction-payment',
    status: 'PAYMENT_SOURCE_REQUESTED',
    features: ['ADD_ACCOUNT', 'SELECT'],
    paymentSources: [
      {
        tenderType: 'Card',
        id: 'card-1',
        name: 'Corporate card',
        verificationInfo: {status: 'VERIFIED'},
        card: {network: 'Visa', cardNumber: '4111111111111111'},
      },
      {
        tenderType: 'BankAccount',
        id: 'bank-1',
        name: 'Operating account',
        verificationInfo: {status: 'UNDER_REVIEW'},
        bankAccount: {accountNumber: '9876543210'},
      },
    ],
  });
  const triggers = el.shadowRoot!.querySelectorAll<HTMLButtonElement>(
    '[data-action="toggle-payment-source-menu"]'
  );

  triggers[0].click();
  await flushElement(el);
  triggers[1].click();
  await flushElement(el);
  assert.lengthOf(el.shadowRoot!.querySelectorAll('[role="menu"]'), 1);
  assert.equal(triggers[0].getAttribute('aria-expanded'), 'false');
  assert.equal(triggers[1].getAttribute('aria-expanded'), 'true');

  el.shadowRoot!.querySelector<HTMLElement>('.widget-title')!.click();
  await flushElement(el);
  assert.notExists(el.shadowRoot!.querySelector('[role="menu"]'));

  triggers[1].click();
  await flushElement(el);
  triggers[1].dispatchEvent(
    new KeyboardEvent('keydown', {
      key: 'Escape',
      bubbles: true,
      composed: true,
    })
  );
  await flushElement(el);
  assert.notExists(el.shadowRoot!.querySelector('[role="menu"]'));
  assert.strictEqual(el.shadowRoot!.activeElement, triggers[1]);
});
```

- [ ] **Step 2: Run payment-selection tests and verify RED**

Run:

```bash
BROWSERS=chromium npm run test:dev -- --files src/test/commerce-hub-connect-payment-selection_test.ts
```

Expected: FAIL because global Edit, footer attach, and radios still exist.

- [ ] **Step 3: Pass row-scoped state through the screen**

```ts
renderPaymentMethodRow(
  {...method, disabled: method.disabled || actionPending},
  {
    editing: method.id === editedPaymentSourceId,
    deleteDisabled: actionPending,
    confirmingDelete: method.id === deleteConfirmationPaymentSourceId,
    menuOpen: method.id === openPaymentSourceMenuId,
    showMarkAsDefault: canSelectPaymentSources,
  }
);
```

- [ ] **Step 4: Replace global host state and rendering**

Replace `paymentSourceEditMode` with:

```ts
@state()
private openPaymentSourceMenuId?: string;

@state()
private editedPaymentSourceId?: string;
```

Clear both IDs when the interaction ID changes, when no methods remain, and in `showPaymentSourceList`. Remove the Edit/Done title action, the SELECT footer branch, radio-state wiring, and every read of `paymentSourceEditMode`. Keep Add, Transfer, and the `ADD_ACCOUNT`-only add footer. Render `attachmentError` directly above the payment-method list.

Add `PaymentMethodsScreenModel` to the existing type import from `internal/types.js`, then define and render this model in `renderPaymentSourceScreen`:

```ts
const paymentMethodsScreenModel: PaymentMethodsScreenModel = {
  status: 'PAYMENT_SOURCE_REQUESTED',
  methods: paymentMethods,
  allowedTenderOptions,
  canAddPaymentSources,
  canSelectPaymentSources,
  actionPending: isPaymentSourceActionPending,
  openPaymentSourceMenuId: this.openPaymentSourceMenuId,
  editedPaymentSourceId: this.editedPaymentSourceId,
  deleteConfirmationPaymentSourceId:
    this.deleteConfirmationPaymentSourceId,
  copy,
  showTransferAction,
};

content: html`
  ${this.attachmentError
    ? renderAlert({variant: 'danger', message: this.attachmentError})
    : ''}
  ${renderPaymentMethodsScreenContent(paymentMethodsScreenModel)}
`,
```

- [ ] **Step 5: Route menu toggle and Edit actions**

```ts
if (action === 'toggle-payment-source-menu') {
  this.clearDeletePaymentSourceConfirmation();
  this.editedPaymentSourceId = undefined;
  this.openPaymentSourceMenuId =
    this.openPaymentSourceMenuId === paymentMethodId
      ? undefined
      : paymentMethodId;
  return;
}

if (action === 'edit-payment-source') {
  this.openPaymentSourceMenuId = undefined;
  this.clearDeletePaymentSourceConfirmation();
  this.editedPaymentSourceId = paymentMethodId;
  return;
}
```

Close both row states at the start of `attach-payment-source`. When a click has no `data-action`, close the open menu unless its composed path contains `.payment-method-overflow`.

When `cancel-delete-payment-source` runs, clear both the confirmation and `editedPaymentSourceId`. After successful deletion, clear `editedPaymentSourceId` before applying the updated interaction response.

- [ ] **Step 6: Add Escape dismissal with focus restoration**

```ts
if (event.key === 'Escape' && this.openPaymentSourceMenuId) {
  const paymentMethodId = this.openPaymentSourceMenuId;
  event.preventDefault();
  this.openPaymentSourceMenuId = undefined;
  this.updateComplete.then(() => {
    this.renderRoot
      .querySelector<HTMLButtonElement>(
        `[data-action="toggle-payment-source-menu"][data-payment-method-id="${CSS.escape(
          paymentMethodId
        )}"]`
      )
      ?.focus();
  });
  return;
}
```

- [ ] **Step 7: Run payment-selection tests and verify GREEN**

Run the Task 3 Chromium command.

Expected: PASS after existing delete confirmation tests enter edit state through the target row menu.

### Task 4: Attach directly and derive the Default label

**Files:**

- Modify: `src/commerce-hub-connect.ts:350-360,4440-4590,6150-6245`
- Test: `src/test/commerce-hub-connect-payment-selection_test.ts:1820-2030`

- [ ] **Step 1: Replace the radio-confirmation test with a failing direct-action test**

```ts
test('Mark as default attaches its row and moves the Default label', async () => {
  const requests: CapturedRequest[] = [];
  const cardOne: PaymentSource = {
    tenderType: 'Card',
    id: 'card-1',
    name: 'Corporate card',
    verificationInfo: {status: 'VERIFIED'},
    card: {network: 'Visa', cardNumber: '4111111111111111'},
  };
  const cardTwo: PaymentSource = {
    tenderType: 'Card',
    id: 'card-2',
    name: 'Travel card',
    verificationInfo: {status: 'VERIFIED'},
    card: {network: 'Visa', cardNumber: '4111111111112222'},
  };
  window.fetch = async (input: RequestInfo | URL) => {
    const request = input instanceof Request ? input : new Request(input);
    requests.push({
      url: request.url,
      method: request.method,
      headers: new Headers(request.headers),
      bodyText: await request.clone().text(),
      credentials: request.credentials,
    });
    return new Response(
      JSON.stringify({
        interactionId: 'interaction-payment',
        status: 'PAYMENT_SOURCE_ATTACHED',
        selectedSource: cardTwo,
        paymentSources: [cardOne, cardTwo],
      }),
      {status: 200, headers: {'Content-Type': 'application/json'}}
    );
  };
  const el = await renderConnect({
    interactionId: 'interaction-payment',
    status: 'PAYMENT_SOURCE_REQUESTED',
    features: ['ADD_ACCOUNT', 'SELECT'],
    selectedSource: cardOne,
    paymentSources: [cardOne, cardTwo],
  });
  const {successEvents} = recordOutputEvents(el);

  el.shadowRoot!.querySelector<HTMLButtonElement>(
    '[data-action="toggle-payment-source-menu"][data-payment-method-id="card-2"]'
  )!.click();
  await flushElement(el);
  el.shadowRoot!.querySelector<HTMLButtonElement>(
    '[data-action="attach-payment-source"][data-payment-method-id="card-2"]'
  )!.click();
  await waitFor(() => successEvents.length === 1);
  await clickAction(el, 'change-payment-source');
  await waitFor(() =>
    Boolean(el.shadowRoot!.querySelector('.payment-method-default-label'))
  );

  assert.deepEqual(
    requests.map(
      (request) => `${request.method} ${new URL(request.url).pathname}`
    ),
    ['POST /interaction/source/card-2/attach', 'GET /interaction']
  );
  assert.equal(el.interactionResponse?.selectedSource?.id, 'card-2');
  assert.equal(
    el
      .shadowRoot!.querySelector('.payment-method-default-label')
      ?.closest('[data-payment-method-id]')
      ?.getAttribute('data-payment-method-id'),
    'card-2'
  );
});
```

- [ ] **Step 2: Run payment-selection tests and verify RED**

Run the Task 3 Chromium command.

Expected: FAIL because list models do not identify the current default source.

- [ ] **Step 3: Map `selectedSource.id` to `PaymentMethod.isDefault`**

Extend the mapper options:

```ts
type PaymentSourceToPaymentMethodOptions = {
  selected?: boolean;
  isDefault?: boolean;
  nativeBalances?: NativeAccountBalanceMap;
  nativeBalanceLoadingSourceIds?: readonly string[];
};
```

Assign `isDefault` in `paymentSourceToPaymentMethod`. In the list mapper use:

```ts
return {
  id: sourceId,
  label: paymentSourceDisplayName(source, {selected}),
  type: paymentSourcePaymentMethodType(source),
  brand: paymentSourceBrand(source),
  accountLabel: paymentSourceAccountLabel(source),
  balanceLabel: balance,
  balanceLoading:
    isNativePaymentSource(source) &&
    nativeBalanceLoadingSourceIds.includes(sourceId),
  last4: paymentSourceLast4(source),
  status: verificationStatusToPaymentMethodStatus(
    source.verificationInfo?.status
  ),
  showVerificationStatus: Boolean(source.verificationInfo?.status),
  isDefault,
};
```

In the list mapper use:

```ts
const selectedSourceId = interactionResponse?.selectedSource?.id;

return paymentSources.map((source) =>
  paymentSourceToPaymentMethod(source, {
    ...options,
    isDefault: Boolean(selectedSourceId && source.id === selectedSourceId),
  })
);
```

For the no-`paymentSources` fallback, pass `selected: true` and `isDefault: true`.

- [ ] **Step 4: Test no-match and selected-source fallback behavior**

```ts
test('labels only a selected source represented in the rendered list', async () => {
  const listedSource: PaymentSource = {
    tenderType: 'Card',
    id: 'card-1',
    name: 'Corporate card',
    verificationInfo: {status: 'VERIFIED'},
    card: {network: 'Visa', cardNumber: '4111111111111111'},
  };
  const unlistedSource: PaymentSource = {
    tenderType: 'Card',
    id: 'card-2',
    name: 'Travel card',
    verificationInfo: {status: 'VERIFIED'},
    card: {network: 'Visa', cardNumber: '4111111111112222'},
  };
  const noMatch = await renderConnect({
    status: 'PAYMENT_SOURCE_REQUESTED',
    features: ['ADD_ACCOUNT', 'SELECT'],
    selectedSource: unlistedSource,
    paymentSources: [listedSource],
  });
  assert.notExists(
    noMatch.shadowRoot!.querySelector('.payment-method-default-label')
  );

  const fallback = await renderConnect({
    status: 'PAYMENT_SOURCE_REQUESTED',
    features: ['ADD_ACCOUNT', 'SELECT'],
    selectedSource: listedSource,
  });
  assert.equal(
    fallback.shadowRoot!.querySelector('.payment-method-default-label')
      ?.textContent,
    'Default'
  );
});
```

- [ ] **Step 5: Preserve the previous default on attach failure**

Update the attach-failure test to click a row menu action. Assert that the list-level danger alert contains the API error, `interactionResponse.selectedSource.id` is unchanged, and its row retains `.payment-method-default-label`.

- [ ] **Step 6: Run payment-selection tests and verify GREEN**

Run the Task 3 Chromium command.

Expected: PASS with direct attachment, unchanged errors, and correct Default labels.

### Task 5: Regression cleanup and full verification

**Files:**

- Modify: `src/test/commerce-hub-connect-flow_test.ts`
- Modify: `src/test/commerce-hub-connect-primitives_test.ts`
- Modify: `src/test/commerce-hub-connect-payment-selection_test.ts`

- [ ] **Step 1: Locate obsolete behavior**

Run:

```bash
rg -n "Use selected method|payment-method-radio|toggle-payment-source-edit-mode|paymentSourceEditMode" src/test src
```

Expected: production matches are zero; test matches remain only in negative assertions proving those controls are absent. Convert positive assertions to row-menu interactions.

- [ ] **Step 2: Format only touched files**

```bash
npx prettier --write src/commerce-hub-connect.ts src/internal/primitives.ts src/internal/screens/payment-methods-screen.ts src/internal/styles.ts src/internal/types.ts src/test/commerce-hub-connect-payment-selection_test.ts src/test/commerce-hub-connect-primitives_test.ts src/test/commerce-hub-connect-flow_test.ts
```

Expected: exit 0 without modifying unrelated files.

- [ ] **Step 3: Run lint**

Run `npm run lint`.

Expected: exit 0 with no Lit Analyzer or ESLint errors.

- [ ] **Step 4: Run the full test suite**

Run `npm test`.

Expected: proxy-auth, package-surface, development browser, and production browser tests all PASS.

- [ ] **Step 5: Run the build**

Run `npm run build`.

Expected: exit 0 with package JavaScript and declarations compiled.

- [ ] **Step 6: Review the final diff against the spec**

```bash
git diff --check
git diff -- src/commerce-hub-connect.ts src/internal/primitives.ts src/internal/screens/payment-methods-screen.ts src/internal/styles.ts src/internal/types.ts src/test/commerce-hub-connect-payment-selection_test.ts src/test/commerce-hub-connect-primitives_test.ts src/test/commerce-hub-connect-flow_test.ts
```

Expected: no whitespace errors; the diff contains row menus, row-scoped edit/delete, direct attachment, Default labeling, and tests while preserving unrelated existing changes.

### Task 6: Restore row-edit Done and use explicit add buttons in combined flows

**Files:**

- Modify: `src/internal/types.ts:58-90`
- Modify: `src/commerce-hub-connect.ts:1030-1180,2420-2480`
- Test: `src/test/commerce-hub-connect-payment-selection_test.ts:1080-1510`
- Test: `src/test/commerce-hub-connect-flow_test.ts:1500-1570`
- Modify: `docs/superpowers/specs/2026-07-29-payment-method-overflow-menu-design.md`

- [x] **Step 1: Add failing tests for the combined-flow add footer and row-edit Done action**

Add a combined-feature regression test:

```ts
test('SELECT with ADD_ACCOUNT uses explicit add footer actions', async () => {
  const el = await renderConnect({
    interactionId: 'interaction-payment',
    status: 'PAYMENT_SOURCE_REQUESTED',
    features: ['ADD_ACCOUNT', 'SELECT'],
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

  assert.notExists(
    el.shadowRoot!.querySelector(
      '.widget-header-action [data-action="open-add-payment-source"]'
    )
  );
  assert.deepEqual(
    [
      ...el.shadowRoot!.querySelectorAll<HTMLButtonElement>(
        '.payment-method-add-footer button'
      ),
    ].map((button) => [button.dataset.action, button.textContent?.trim()]),
    [
      ['add-card', 'Add card'],
      ['add-bank-account', 'Add bank account'],
    ]
  );
});
```

Add a row-edit completion test:

```ts
test('Done exits row edit mode and restores its overflow action', async () => {
  const el = await renderConnect({
    interactionId: 'interaction-payment',
    status: 'PAYMENT_SOURCE_REQUESTED',
    features: ['ADD_ACCOUNT', 'SELECT'],
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

  el.shadowRoot!.querySelector<HTMLButtonElement>(
    '[data-action="toggle-payment-source-menu"]'
  )!.click();
  await flushElement(el);
  el.shadowRoot!.querySelector<HTMLButtonElement>(
    '[data-action="edit-payment-source"]'
  )!.click();
  await flushElement(el);

  const done = el.shadowRoot!.querySelector<HTMLButtonElement>(
    '.widget-header-action [data-action="done-editing-payment-source"]'
  )!;
  assert.equal(done.textContent?.trim(), 'Done');
  assert.exists(
    el.shadowRoot!.querySelector('[data-action="delete-payment-source"]')
  );

  done.click();
  await flushElement(el);

  assert.notExists(
    el.shadowRoot!.querySelector('[data-action="done-editing-payment-source"]')
  );
  assert.notExists(
    el.shadowRoot!.querySelector('[data-action="delete-payment-source"]')
  );
  assert.exists(
    el.shadowRoot!.querySelector('[data-action="toggle-payment-source-menu"]')
  );
});
```

- [x] **Step 2: Run the focused test and verify RED**

Run:

```bash
PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' BROWSERS=chromium npm run test:dev -- --files test/commerce-hub-connect-payment-selection_test.js
```

Expected: FAIL because the combined flow still renders the single header Add launcher without the footer and row edit mode has no Done action.

- [x] **Step 3: Add an explicit Done action and use the existing add footer for every `ADD_ACCOUNT` list**

Add `'done-editing-payment-source'` to `FlowActionName`.

In `handleClick`, clear row edit state and delete confirmation:

```ts
if (action === 'done-editing-payment-source') {
  this.clearDeletePaymentSourceConfirmation();
  this.editedPaymentSourceId = undefined;
  return;
}
```

In `renderPaymentSourceScreen`, make the conditional header action row-edit-specific and retain Transfer outside edit mode:

```ts
const toolbar = this.editedPaymentSourceId
  ? renderTextLinkButton({
      label: 'Done',
      action: 'done-editing-payment-source',
      disabled: isPaymentSourceActionPending,
    })
  : showTransferAction
  ? html`
      <div class="widget-toolbar" aria-label="Payment method actions">
        ${renderTextLinkButton({
          label: 'Transfer',
          action: 'open-transfer',
          icon: 'transfer',
          disabled: isPaymentSourceActionPending,
        })}
      </div>
    `
  : undefined;
```

Render the existing footer whenever `canAddPaymentSources` is true, without excluding `canSelectPaymentSources`:

```ts
footer: canAddPaymentSources
  ? html`
      <div
        class="payment-method-add-footer"
        aria-label="Add payment method"
      >
        ${allowedTenderOptions.card
          ? renderButton({
              label: 'Add card',
              action: 'add-card',
              icon: 'plus',
              variant: 'primary',
              disabled: isPaymentSourceActionPending,
            })
          : ''}
        ${allowedTenderOptions.bankAccount
          ? renderButton({
              label: 'Add bank account',
              action: 'add-bank-account',
              icon: 'plus',
              variant: 'primary',
              disabled: isPaymentSourceActionPending,
            })
          : ''}
      </div>
    `
  : undefined,
```

- [x] **Step 4: Run the focused test and verify GREEN**

Run the Step 2 command.

Expected: all payment-selection tests PASS, including the new combined-flow footer and Done regressions.

- [x] **Step 5: Update affected combined-flow assertions and navigation**

In `src/test/commerce-hub-connect-flow_test.ts`, replace combined-flow expectations for `['open-add-payment-source', 'Add']` with footer action expectations:

```ts
assert.notExists(
  el.shadowRoot!.querySelector(
    '.widget-header-action [data-action="open-add-payment-source"]'
  )
);
assert.deepEqual(
  [
    ...el.shadowRoot!.querySelectorAll<HTMLElement>(
      '.payment-method-add-footer [data-action]'
    ),
  ].map((button) => button.dataset.action),
  ['add-card', 'add-bank-account']
);
```

Rename the test to `renders payment methods with row menus, status badges, and direct add actions`. Replace its old `open-add-payment-source` click and tender-launcher assertions with direct card navigation:

```ts
await clickAction(el, 'add-card');

assert.equal(
  el.shadowRoot!.querySelector('.widget-title')?.textContent?.trim(),
  'Add card'
);
assert.notExists(el.shadowRoot!.querySelector('.tender-tabs'));
```

- [x] **Step 6: Run final verification**

Run:

```bash
npx prettier --check src/commerce-hub-connect.ts src/internal/types.ts src/test/commerce-hub-connect-payment-selection_test.ts src/test/commerce-hub-connect-flow_test.ts docs/superpowers/specs/2026-07-29-payment-method-overflow-menu-design.md docs/superpowers/plans/2026-07-29-payment-method-overflow-menu.md
npm run lint
npm run build
npm_config_cache=/tmp/chc-npm-cache PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' BROWSERS=chromium npm run test
git diff --check
```

Expected: formatting, lint, build, proxy tests, package tests, 226 development browser tests, 226 production browser tests, and whitespace validation all PASS.

### Task 8: Polish default actions, pending feedback, and badge prominence

> **Execution order:** Task 7 below is the completed prerequisite that places `Done` in the title-action slot. Apply this Task 8 amendment after Task 7 so the secondary variant is retained.

**Files:**

- Modify: `src/commerce-hub-connect.ts:1080-1140`
- Modify: `src/internal/primitives.ts:110-140,277-335`
- Modify: `src/internal/styles.ts:1378-1470`
- Test: `src/test/commerce-hub-connect-payment-selection_test.ts:1250-1430,1535-1605,2150-2250`
- Test: `src/test/commerce-hub-connect-primitives_test.ts:1150-1400`
- Modify: `docs/superpowers/specs/2026-07-29-payment-method-overflow-menu-design.md`

- [x] **Step 1: Add failing regressions for Done, menu eligibility, badge placement, and attach loading**

In the existing Done test, require the secondary theme:

```ts
assert.isTrue(done.classList.contains('text-link-button-secondary'));
```

In the existing selected-source Default test, require the label to be outside the title/status copy and immediately before the overflow button:

```ts
const defaultLabel = selectedRow.querySelector<HTMLElement>(
  '.payment-method-default-label'
)!;
const overflow = selectedRow.querySelector<HTMLElement>(
  '.payment-method-overflow'
)!;
const overflowButton = overflow.querySelector<HTMLButtonElement>(
  '.payment-method-overflow-button'
)!;

assert.strictEqual(defaultLabel.parentElement, overflow);
assert.strictEqual(defaultLabel.nextElementSibling, overflowButton);
assert.notExists(
  selectedRow.querySelector(
    '.payment-method-title-row .payment-method-default-label'
  )
);
assert.equal(getComputedStyle(defaultLabel).minHeight, '28px');
assert.equal(getComputedStyle(defaultLabel).fontSize, '13px');
assert.equal(getComputedStyle(defaultLabel).fontWeight, '600');
```

After opening the default row menu, assert that it contains only Edit:

```ts
assert.notExists(
  selectedRow.querySelector('[data-action="attach-payment-source"]')
);
assert.equal(
  selectedRow
    .querySelector('[data-action="edit-payment-source"]')
    ?.textContent?.trim(),
  'Edit'
);
```

Add a menu eligibility test for non-verified rows:

```ts
test('non-verified SELECT rows omit Mark as default and retain verification actions', async () => {
  const el = await renderConnect({
    interactionId: 'interaction-payment',
    status: 'PAYMENT_SOURCE_REQUESTED',
    features: ['ADD_ACCOUNT', 'SELECT'],
    paymentSources: [
      {
        tenderType: 'BankAccount',
        id: 'bank-require-info',
        name: 'Documents needed',
        verificationInfo: {status: 'REQUIRE_INFO'},
        bankAccount: {
          bankName: 'Commerce National Bank',
          accountNumber: '9876543210',
        },
      },
      {
        tenderType: 'BankAccount',
        id: 'bank-not-verified',
        name: 'Verification needed',
        verificationInfo: {status: 'NOT_VERIFIED'},
        bankAccount: {
          bankName: 'Commerce National Bank',
          accountNumber: '1234567890',
        },
      },
    ],
  });

  for (const paymentMethodId of ['bank-require-info', 'bank-not-verified']) {
    const row = el.shadowRoot!.querySelector<HTMLElement>(
      `[data-payment-method-id="${paymentMethodId}"]`
    )!;

    assert.exists(row.querySelector('[data-action="verify-payment-source"]'));
    row
      .querySelector<HTMLButtonElement>(
        '[data-action="toggle-payment-source-menu"]'
      )!
      .click();
    await flushElement(el);
    assert.notExists(
      row.querySelector('[data-action="attach-payment-source"]')
    );
    assert.exists(row.querySelector('[data-action="edit-payment-source"]'));
  }
});
```

In the deferred attach test, immediately after clicking Mark as default, require the existing overlay:

```ts
assert.equal(
  el.shadowRoot!.querySelector('.widget-loading-title')?.textContent?.trim(),
  'Saving payment method'
);
assert.equal(
  el.shadowRoot!.querySelector('.widget-loading-helper')?.textContent?.trim(),
  'Saving your payment method, please wait.'
);
assert.exists(el.shadowRoot!.querySelector('.widget-loading-animation'));
assert.equal(
  el.shadowRoot!.querySelector('.widget-shell')?.getAttribute('aria-busy'),
  'true'
);
```

- [x] **Step 2: Build and run focused tests to verify RED**

Run:

```bash
npm run build
PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' BROWSERS=chromium npm run test:dev -- --files test/commerce-hub-connect-payment-selection_test.js
```

Expected: FAIL because Done lacks the secondary class, the Default label remains in the title row, default/non-verified menus still expose Mark as default, and attach deliberately suppresses the existing loading overlay.

- [x] **Step 3: Apply the secondary Done theme and restore the attach overlay**

Set the existing text-link variant:

```ts
const doneAction = this.editedPaymentSourceId
  ? renderTextLinkButton({
      label: 'Done',
      action: 'done-editing-payment-source',
      variant: 'secondary',
      disabled: isPaymentSourceActionPending,
    })
  : undefined;
```

Use the loading helper for every payment-source pending action:

```ts
busy: isPaymentSourceActionPending,
overlay: paymentSourceActionLoadingOverlay(this.pendingAction),
```

- [x] **Step 4: Restrict Mark as default and move the Default badge**

Remove the Default label from `renderPaymentMethodCopy`. In `renderPaymentMethodOverflowAction`, render it before the overflow button:

```ts
<span class="payment-method-overflow">
  ${method.isDefault
    ? html`<span class="payment-method-default-label">Default</span>`
    : ''}
  <button class="payment-method-overflow-button" ...>
```

Render Mark as default only for eligible rows:

```ts
${showMarkAsDefault && !method.isDefault && method.status === 'verified'
  ? html`
      <button
        type="button"
        role="menuitem"
        data-action="attach-payment-source"
        data-payment-method-id=${method.id}
        ?disabled=${method.disabled}
      >
        Mark as default
      </button>
    `
  : ''}
```

This must not change `renderPaymentMethodMain`, `isPaymentMethodStatusClickable`, or the `verify-payment-source` action.

Distinguish attached defaults from verified preselection in `paymentMethodsFromInteractionResponse`:

```ts
const selectedSourceId =
  interactionResponse?.status === 'PAYMENT_SOURCE_ATTACHED'
    ? interactionResponse.selectedSource?.id
    : undefined;
```

Use the same status check for the selected-source-only fallback. A verified `selectedSource` in `OTP_VALIDATION_SUCCESS` or legacy `PAYMENT_SOURCE_REQUESTED` remains eligible for explicit attachment and does not receive the `Default` badge.

- [x] **Step 5: Increase badge prominence and align the action cluster**

Update the existing styles:

```css
.payment-method-overflow {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  justify-self: end;
}

.payment-method-default-label {
  min-height: 1.75rem;
  display: inline-flex;
  align-items: center;
  border: 0.0625rem solid color-mix(in srgb, var(--chc-primary) 28%, transparent);
  border-radius: 999rem;
  padding: 0.1875rem 0.625rem;
  background: color-mix(in srgb, var(--chc-primary) 8%, white);
  color: var(--chc-primary);
  font-size: 0.8125rem;
  font-weight: 600;
  white-space: nowrap;
}
```

- [x] **Step 6: Build and run focused tests to verify GREEN**

Run the Step 2 commands.

Expected: all 43 payment-selection tests PASS, including verified-status eligibility, preselection-versus-attachment, and existing verification navigation coverage.

- [x] **Step 7: Run final verification**

Run:

```bash
npx prettier --check src/commerce-hub-connect.ts src/internal/primitives.ts src/internal/styles.ts src/test/commerce-hub-connect-payment-selection_test.ts src/test/commerce-hub-connect-primitives_test.ts docs/superpowers/specs/2026-07-29-payment-method-overflow-menu-design.md docs/superpowers/plans/2026-07-29-payment-method-overflow-menu.md
npm run lint
npm run build
npm_config_cache=/tmp/chc-npm-cache PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' BROWSERS=chromium npm run test
git diff --check
```

Expected: formatting, lint, build, proxy tests, package tests, 228 development browser tests, 228 production browser tests, and whitespace validation all PASS. Existing `REQUIRE_INFO` and `NOT_VERIFIED` row actions still enter their prior verification flows; `UNDER_REVIEW` and `DECLINED` remain inert.

### Task 7: Align row-edit Done with the payment-method heading

**Files:**

- Modify: `src/commerce-hub-connect.ts:1080-1120`
- Test: `src/test/commerce-hub-connect-payment-selection_test.ts:1535-1595`
- Modify: `docs/superpowers/specs/2026-07-29-payment-method-overflow-menu-design.md`

- [x] **Step 1: Add a failing title-alignment regression to the existing Done test**

After locating the `Done` button, assert that it uses the shell title-action slot and is vertically aligned at the header's right edge:

```ts
const title = el.shadowRoot!.querySelector<HTMLElement>('.widget-title')!;
const header = el.shadowRoot!.querySelector<HTMLElement>('.widget-header')!;
const titleAction = done.closest<HTMLElement>('.widget-title-action');

assert.exists(titleAction);

const titleBounds = title.getBoundingClientRect();
const doneBounds = done.getBoundingClientRect();
const headerBounds = header.getBoundingClientRect();

assert.closeTo(
  doneBounds.top + doneBounds.height / 2,
  titleBounds.top + titleBounds.height / 2,
  1
);
assert.closeTo(doneBounds.right, headerBounds.right - 14, 1);
```

- [x] **Step 2: Build and run the focused test to verify RED**

Run:

```bash
npm run build
PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' BROWSERS=chromium npm run test:dev -- --files test/commerce-hub-connect-payment-selection_test.js
```

Expected: FAIL because `Done` is inside `.widget-header-action` on the second payment-method header row, so `titleAction` does not exist.

- [x] **Step 3: Render Done through `titleAction` while retaining Transfer in `headerAction`**

Replace the combined `toolbar` expression in `renderPaymentSourceScreen` with separate title and header actions:

```ts
const doneAction = this.editedPaymentSourceId
  ? renderTextLinkButton({
      label: 'Done',
      action: 'done-editing-payment-source',
      disabled: isPaymentSourceActionPending,
    })
  : undefined;
const toolbar =
  !this.editedPaymentSourceId && showTransferAction
    ? html`
        <div class="widget-toolbar" aria-label="Payment method actions">
          ${renderTextLinkButton({
            label: 'Transfer',
            action: 'open-transfer',
            icon: 'transfer',
            disabled: isPaymentSourceActionPending,
          })}
        </div>
      `
    : undefined;
```

Pass both slots to the shell:

```ts
return this.renderWidgetShell({
  title: copy.title,
  layout: 'payment-methods',
  titleAction: doneAction,
  headerAction: toolbar,
```

Do not change the generic header CSS or the Transfer toolbar layout.

- [x] **Step 4: Build and run the focused test to verify GREEN**

Run the Step 2 commands.

Expected: all 41 payment-selection tests PASS, with `Done` in `.widget-title-action`, centered against the title, and anchored to the top-right header padding.

- [x] **Step 5: Run final verification**

Run:

```bash
npx prettier --check src/commerce-hub-connect.ts src/test/commerce-hub-connect-payment-selection_test.ts docs/superpowers/specs/2026-07-29-payment-method-overflow-menu-design.md docs/superpowers/plans/2026-07-29-payment-method-overflow-menu.md
npm run lint
npm run build
npm_config_cache=/tmp/chc-npm-cache PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' BROWSERS=chromium npm run test
git diff --check
```

Expected: formatting, lint, build, proxy tests, package tests, 226 development browser tests, 226 production browser tests, and whitespace validation all PASS.
