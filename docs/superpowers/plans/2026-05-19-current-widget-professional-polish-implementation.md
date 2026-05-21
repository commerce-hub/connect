# Current Widget Professional Polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Apply the approved A5 visual polish to the current saved payment methods widget without changing the overall flow structure or public theming API.

**Architecture:** Keep the existing `renderPaymentMethodRow(...)`, `renderSelectedPaymentMethod(...)`, and `renderSourceAction(...)` primitives as the implementation anchors. Move payment-row verification state out of the inline badge and into a trailing icon cluster, keep the existing left-side payment-brand chip, suppress saved-screen add-action subtitles at the call site only, and retune the shared row/link styles to match the approved cleaner baseline.

**Tech Stack:** TypeScript, Lit, shared widget primitives/styles, @web/test-runner, @open-wc/testing

---

## File Map

- Modify: `src/test/commerce-hub-connect-primitives_test.ts`
  Purpose: lock the row markup contract for left-side brand chips, icon-only trailing verification state, chevrons, and link-action chevrons.
- Modify: `src/test/commerce-hub-connect-flow_test.ts`
  Purpose: verify the saved payment methods screen uses a title-only header, left-side icons, no inline verification badges, no saved-screen add subtitles, and trailing warning/decline icons.
- Modify: `src/internal/primitives.ts`
  Purpose: keep the current row structure but replace inline row badges with a trailing status cluster, remove saved-row status text from the copy block, and add a trailing chevron to link-style add actions.
- Modify: `src/internal/styles.ts`
  Purpose: retune saved-row surfaces, remove the blue selected stripe, add trailing status icon styles, and make link actions read like utility rows instead of stacked buttons.
- Modify: `src/commerce-hub-connect.ts`
  Purpose: stop passing payment-methods add subtitles on the saved-methods screen while preserving them on the no-saved screen.

> **User preference:** Do **not** add commit steps to this plan and do **not** create commits during execution.

### Task 1: Lock The Approved Saved-Methods Contract In Tests

**Files:**
- Modify: `src/test/commerce-hub-connect-primitives_test.ts`
- Modify: `src/test/commerce-hub-connect-flow_test.ts`

- [ ] **Step 1: Update the saved-screen flow test to the A5 contract**

Replace the existing saved-methods screen assertions in
`src/test/commerce-hub-connect-flow_test.ts` with expectations for:

```ts
test('renders payment methods with left icons, trailing status icons, and utility add rows', async () => {
  const el = await renderConnect({
    interactionId: 'interaction-payment',
    status: 'PAYMENT_SOURCE_REQUESTED',
    selectedSource: {
      tenderType: 'Card',
      id: 'card-1',
      name: 'Corporate card',
    },
    paymentSources: [
      {
        tenderType: 'Card',
        id: 'card-1',
        name: 'Corporate card',
        verificationInfo: {status: 'VERIFIED'},
        card: {
          network: 'Visa',
          cardNumber: '4111111111114242',
        },
      },
      {
        tenderType: 'BankAccount',
        id: 'bank-1',
        name: 'Operating account',
        verificationInfo: {status: 'UNDER_REVIEW'},
        bankAccount: {
          bankName: 'Commerce National Bank',
          accountNumber: '9876543210',
        },
      },
      {
        tenderType: 'Card',
        id: 'card-2',
        name: 'Travel card',
        verificationInfo: {status: 'DECLINED'},
        card: {
          network: 'Amex',
          cardNumber: '378282246310005',
        },
      },
    ],
  });

  const rows = [
    ...el.shadowRoot!.querySelectorAll<HTMLButtonElement>('.payment-method-row'),
  ];

  assert.equal(
    el.shadowRoot!.querySelector('.widget-title')?.textContent?.trim(),
    'Pay with'
  );
  assert.notExists(el.shadowRoot!.querySelector('.widget-subtitle'));
  assert.exists(rows[0].querySelector('[data-payment-method-icon="visa"]'));
  assert.exists(rows[1].querySelector('[data-payment-method-icon="bank"]'));
  assert.exists(rows[2].querySelector('[data-payment-method-icon="amex"]'));
  assert.notExists(rows[0].querySelector('.payment-method-status'));
  assert.notExists(rows[0].querySelector('.payment-method-chevron'));
  assert.exists(rows[1].querySelector('.payment-method-status-icon-warning'));
  assert.exists(rows[1].querySelector('.payment-method-chevron'));
  assert.exists(rows[2].querySelector('.payment-method-status-icon-danger'));
  assert.exists(rows[2].querySelector('.payment-method-chevron'));
  assert.notExists(rows[1].querySelector('.verification-status-badge'));
  assert.notExists(rows[2].querySelector('.verification-status-badge'));
});
```

- [ ] **Step 2: Update the saved-screen copy override test to keep the title-only header**

Change `renders payment methods copy from partial designConfig overrides` so the
saved screen still respects `copy.paymentMethods.title`, but intentionally does
**not** render the saved-screen subtitle or saved-screen add subtitles:

```ts
assert.equal(
  el.shadowRoot!.querySelector('.widget-title')?.textContent?.trim(),
  'Choose payment'
);
assert.notExists(el.shadowRoot!.querySelector('.widget-subtitle'));
assert.deepEqual(
  [...el.shadowRoot!.querySelectorAll('.source-action-link-title')].map(
    (item) => item.textContent?.trim()
  ),
  ['Use card', 'Use bank account']
);
assert.deepEqual(
  [...el.shadowRoot!.querySelectorAll('.source-action-link-subtitle')].map(
    (item) => item.textContent?.trim()
  ),
  []
);
```

Leave the existing no-saved-methods copy override test in place so the
no-saved screen continues to prove that optional subtitles still work there.

- [ ] **Step 3: Update primitive tests for row structure and status icons**

Revise the primitive tests around `renderPaymentMethodRow(...)` in
`src/test/commerce-hub-connect-primitives_test.ts` to lock the new row surface:

```ts
test('renders non-verified payment methods with a trailing warning icon and chevron', async () => {
  const method: PaymentMethod = {
    id: 'bank-1',
    label: 'Operating account',
    type: 'bank',
    brand: 'Commerce National Bank',
    last4: '3210',
    status: 'under-review',
  };

  const root = await renderHarness(html`
    <style>
      ${primitiveStyles.cssText}
    </style>
    ${renderPaymentMethodRow(method)}
  `);

  const row = root.querySelector<HTMLButtonElement>('.payment-method-row')!;

  assert.exists(row.querySelector('[data-payment-method-icon="bank"]'));
  assert.notExists(row.querySelector('.payment-method-status'));
  assert.exists(row.querySelector('.payment-method-status-icon-warning'));
  assert.exists(row.querySelector('.payment-method-chevron'));
});

test('renders declined payment methods with a trailing danger icon and chevron', async () => {
  const method: PaymentMethod = {
    id: 'card-2',
    label: 'Travel card',
    type: 'card',
    brand: 'Amex',
    last4: '1005',
    status: 'declined',
  };

  const root = await renderHarness(html`
    <style>
      ${primitiveStyles.cssText}
    </style>
    ${renderPaymentMethodRow(method)}
  `);

  assert.exists(root.querySelector('.payment-method-status-icon-danger'));
  assert.exists(root.querySelector('.payment-method-chevron'));
});

test('renders link-style source actions with a trailing chevron and no subtitle when none is provided', async () => {
  const root = await renderHarness(html`
    <style>
      ${primitiveStyles.cssText}
    </style>
    ${renderSourceAction({
      label: 'Add credit or debit card',
      action: 'add-card',
      icon: 'card',
      variant: 'link',
    })}
  `);

  assert.exists(root.querySelector('.source-action-link-chevron'));
  assert.notExists(root.querySelector('.source-action-link-subtitle'));
});
```

- [ ] **Step 4: Run focused tests to verify RED**

Run:

```bash
BROWSERS=chromium npm run test:dev -- --files test/commerce-hub-connect-primitives_test.js
BROWSERS=chromium npm run test:dev -- --files test/commerce-hub-connect-flow_test.js
```

Expected: FAIL because the current implementation still renders inline
verification badges in payment rows, still passes saved-screen add subtitles
through `renderPaymentSourceScreen(...)`, and does not render a trailing
chevron for link-style add actions.

### Task 2: Update The Shared Primitives And Saved-Screen Call Site

**Files:**
- Modify: `src/internal/primitives.ts`
- Modify: `src/commerce-hub-connect.ts`

- [ ] **Step 1: Keep the generic badge helper, but add a payment-row-specific trailing status helper**

Do **not** remove `renderVerificationStatusBadge(...)`, because it is still used
outside the saved rows. Instead, add a payment-row-specific helper near
`paymentMethodStatusPresentation(...)`:

```ts
const paymentMethodStatusIconTone = (
  status: PaymentMethod['status']
): 'warning' | 'danger' => (status === 'declined' ? 'danger' : 'warning');

const renderPaymentMethodVerificationAction = (
  status: PaymentMethod['status']
): TemplateResult => {
  const presentation = paymentMethodStatusPresentation(status);

  return html`
    <span class="payment-method-trailing">
      <span
        class="payment-method-status-icon payment-method-status-icon-${paymentMethodStatusIconTone(status)}"
        data-verification-status=${status}
        aria-label=${presentation.label}
        title=${presentation.label}
      >
        !
      </span>
      <span class="payment-method-chevron" aria-hidden="true">
        <span class="payment-method-chevron-icon"></span>
      </span>
    </span>
  `;
};
```

- [ ] **Step 2: Remove inline row badges from the payment-method copy block**

Change `renderPaymentMethodCopy(...)` so the copy block stops rendering
`.payment-method-status` inline:

```ts
const renderPaymentMethodCopy = (method: PaymentMethod): TemplateResult => html`
  <span class="payment-method-copy">
    <span class="payment-method-title-row">
      <span class="payment-method-title">${method.label}</span>
    </span>
    <span class="payment-method-meta-row">
      <span class="payment-method-meta">
        ${paymentMethodAccountLabel(method)}
      </span>
    </span>
  </span>
`;
```

Then update the unverified/default row path to pass the status-aware helper:

```ts
return html`
  <button
    class="payment-method-row payment-method-row-action"
    type="button"
    aria-disabled=${disabled ? 'true' : 'false'}
    data-action="verify-payment-source"
    data-payment-method-id=${id}
    ?disabled=${disabled}
  >
    ${renderPaymentMethodContent(
      method,
      renderPaymentMethodVerificationAction(method.status)
    )}
  </button>
`;
```

Keep the verified/default row on `renderPaymentMethodSpacer()` so verified rows
stay visually quiet and do not show the chevron cluster.

- [ ] **Step 3: Add a trailing chevron to link-style add actions**

Extend the `variant === 'link'` branch of `renderSourceAction(...)` in
`src/internal/primitives.ts`:

```ts
<button
  class="source-action-link source-action-link-${icon}"
  type="button"
  data-action=${action}
  ?disabled=${disabled}
>
  <span class="source-action-icon" aria-hidden="true">+</span>
  <span class="source-action-link-copy">
    <span class="source-action-link-title source-action-title">${label}</span>
    ${subtitle
      ? html`
          <span class="source-action-link-subtitle source-action-subtitle">
            ${subtitle}
          </span>
        `
      : ''}
  </span>
  <span class="source-action-link-chevron" aria-hidden="true">
    <span class="source-action-link-chevron-icon"></span>
  </span>
</button>
```

- [ ] **Step 4: Stop passing saved-screen add subtitles at the payment-methods call site**

In `src/commerce-hub-connect.ts`, update `renderPaymentSourceScreen()` only:

```ts
${renderSourceAction({
  label: copy.addCardTitle,
  action: 'add-card',
  icon: 'card',
  variant: 'link',
  disabled: isPaymentSourceActionPending,
})}
${renderSourceAction({
  label: copy.addBankAccountTitle,
  action: 'add-bank-account',
  icon: 'bank',
  variant: 'link',
  disabled: isPaymentSourceActionPending,
})}
```

Do **not** remove the subtitle arguments in `renderNoSavedPaymentMethods()`.
That screen should continue to support optional helper copy from
`copy.noSavedPaymentMethods`.

### Task 3: Retune Shared Styles To Match The Approved A5 Surface

**Files:**
- Modify: `src/internal/styles.ts`

- [ ] **Step 1: Quiet the selected payment row without the blue left stripe**

Update the saved-row and selected-summary surface styling around
`src/internal/styles.ts:639-682`:

```css
.payment-method-row,
.selected-payment-method {
  width: 100%;
  display: grid;
  grid-template-columns: 2.25rem minmax(0, 1fr) auto;
  gap: 0.625rem;
  align-items: center;
  border-radius: 1rem;
  padding: 0.75rem;
  background: var(--chc-surface);
  color: var(--chc-text);
  text-align: left;
  border: 0.0625rem solid var(--chc-border);
}

.selected-payment-method {
  border-color: var(--chc-border-strong);
  background: color-mix(in srgb, var(--chc-surface) 92%, var(--chc-soft-surface));
  box-shadow: 0 0.625rem 1.125rem rgba(17, 24, 39, 0.05);
}

.payment-method-row-action:hover:not(:disabled),
.payment-method-row-action:focus-visible {
  border-color: var(--chc-border-strong);
  background: color-mix(in srgb, var(--chc-surface) 88%, var(--chc-soft-surface));
  box-shadow: 0 0.5rem 1rem rgba(17, 24, 39, 0.05);
}
```

This intentionally removes the stronger primary-colored selected treatment from
the saved rows.

- [ ] **Step 2: Add the trailing status cluster styles**

Replace the old row-status assumptions with a trailing icon cluster:

```css
.payment-method-trailing {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  justify-self: end;
}

.payment-method-status-icon {
  width: 1.25rem;
  height: 1.25rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 999rem;
  font-size: 0.75rem;
  font-weight: 700;
  line-height: 1;
}

.payment-method-status-icon-warning {
  border: 0.0625rem solid var(--chc-warning-border);
  background: var(--chc-warning-bg);
  color: var(--chc-warning);
}

.payment-method-status-icon-danger {
  border: 0.0625rem solid var(--chc-danger-border);
  background: var(--chc-danger-bg);
  color: var(--chc-danger);
}

.payment-method-chevron {
  width: 1rem;
  height: 1rem;
  color: var(--chc-muted);
}
```

Keep the existing generic `verification-status-badge` styles because the badge
helper is still used outside the saved payment row.

- [ ] **Step 3: Make link-style add actions feel like utility rows**

Retune `.source-action-link` around `src/internal/styles.ts:954-1015`:

```css
.source-action-link {
  width: 100%;
  min-height: var(--chc-input-height);
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  gap: 0.625rem;
  align-items: center;
  border: 0.0625rem solid var(--chc-border);
  border-radius: 1rem;
  padding: 0.625rem 0.75rem;
  background: var(--chc-surface);
  color: var(--chc-text);
  text-align: left;
  cursor: pointer;
}

.source-action-link-copy {
  display: grid;
  gap: 0;
  min-width: 0;
}

.source-action-link-chevron {
  width: 1rem;
  height: 1rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--chc-muted);
}

.source-action-link-chevron-icon::before {
  content: '';
  width: 0.4375rem;
  height: 0.4375rem;
  border-right: 0.09375rem solid currentColor;
  border-bottom: 0.09375rem solid currentColor;
  transform: rotate(-45deg);
}
```

Keep the plus icon on the left, but drop the stronger “button” feel by using
the normal surface background and single-line copy on the saved-methods screen.

### Task 4: Verify Green And Preserve The Existing No-Saved Screen Contract

**Files:**
- No additional edits expected

- [ ] **Step 1: Re-run the focused development suites**

Run:

```bash
BROWSERS=chromium npm run test:dev -- --files test/commerce-hub-connect-primitives_test.js
BROWSERS=chromium npm run test:dev -- --files test/commerce-hub-connect-flow_test.js
```

Expected: PASS.

- [ ] **Step 2: Re-run the same focused suites in production mode**

Run:

```bash
BROWSERS=chromium npm run test:prod -- --files test/commerce-hub-connect-primitives_test.js
BROWSERS=chromium npm run test:prod -- --files test/commerce-hub-connect-flow_test.js
```

Expected: PASS.

- [ ] **Step 3: Run a fresh build**

Run:

```bash
npm run build
```

Expected: PASS.

- [ ] **Step 4: Summarize verification evidence**

Report:

- changed files
- focused commands that passed
- confirmation that the no-saved screen still supports `widget-subtitle` and
  add-action subtitles while the saved-methods screen no longer does

## Self-Review

- **Spec coverage:** This plan covers the approved A5 saved-row treatment,
  title-only saved-screen header, left-side brand chips, trailing warning/error
  icons plus chevrons, removal of inline row badges, removal of the blue left
  selected stripe, and quieter add-action rows.
- **Placeholder scan:** No `TODO`, `TBD`, or “similar to above” placeholders
  remain.
- **Type consistency:** The new work stays within the existing `PaymentMethod`
  and `SourceActionOptions` shapes; no public type rename or signature drift is
  introduced.
