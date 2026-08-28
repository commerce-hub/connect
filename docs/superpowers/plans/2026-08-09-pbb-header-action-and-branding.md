# PBB Header Action and Branding Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Move the PBB manual-entry fallback into a compact secondary header action and send the wallet SDK's complete supported branding set to `PaymentSDK.init`.

**Architecture:** Reuse `renderWidgetShell`'s existing `titleAction` boundary and the shared secondary button primitive, adding only a PBB-scoped compact wrapper style. Keep PBB theming centralized in `resolvePaymentSdkAppearance`, where wallet defaults are merged with nonblank merchant color overrides and emitted only through fields accepted by `PaymentSdkAppearanceBranding`.

**Tech Stack:** TypeScript 5.9, Lit 3, CSS custom properties, Mocha/Chai, Web Test Runner with Playwright Chromium.

---

## File map

- Modify `src/commerce-hub-connect.ts`: render the header action and resolve the complete PBB branding payload.
- Modify `src/internal/styles.ts`: replace the footer-only layout rule with compact header-action styling.
- Modify `src/test/commerce-hub-connect-flow_test.ts`: cover header placement, loading state, manual-entry navigation, wallet defaults, and merchant overrides.

### Task 1: Move the manual-entry fallback into the PBB header

**Files:**
- Modify: `src/test/commerce-hub-connect-flow_test.ts:7420-7510`
- Modify: `src/commerce-hub-connect.ts:2267-2297`
- Modify: `src/internal/styles.ts:2689-2704`

- [ ] **Step 1: Write failing header-placement and behavior assertions**

Extend `test('add bank account initializes PaymentSDK with a compact Connect your bank handoff', ...)` after the existing back-button assertions:

```ts
const alternateAction = el.shadowRoot!.querySelector<HTMLButtonElement>(
  '.widget-title-action .bank-provider-alternate-action .button-secondary[data-action="add-ach-manually"]'
);
assert.exists(alternateAction);
assert.equal(alternateAction?.textContent?.trim(), 'Connect another way');
assert.notExists(el.shadowRoot!.querySelector('.widget-action-footer'));
assert.equal(getComputedStyle(alternateAction!).fontSize, '12px');
assert.equal(getComputedStyle(alternateAction!).minHeight, '32px');
```

In the existing pending-session/loading test, assert that the same action is disabled while the provider request is unresolved:

```ts
const loadingAlternateAction =
  el.shadowRoot!.querySelector<HTMLButtonElement>(
    '[data-action="add-ach-manually"]'
  );
assert.isTrue(loadingAlternateAction?.disabled);
```

At the end of the same initialized-provider test, use its existing fetch and `PaymentSDK` setup to verify navigation:

```ts
  await clickAction(el, 'add-ach-manually');
  await flushElement(el);

  assert.equal(
    el.shadowRoot!.querySelector('.widget-title')?.textContent?.trim(),
    'Select bank account type'
  );
```

- [ ] **Step 2: Run the focused test to verify failure**

Run:

```bash
BROWSERS=chromium npm run test:dev -- --grep "Pay by Bank|PBB header"
```

Expected: FAIL because the action is still inside `.widget-action-footer`, is a text-link button, and lacks the compact secondary-button dimensions.

- [ ] **Step 3: Render the existing label through the title-action boundary**

Change `renderBankProviderScreen()` in `src/commerce-hub-connect.ts` to remove `footer` and provide:

```ts
titleAction: html`
  <div class="bank-provider-alternate-action">
    ${renderButton({
      label: 'Connect another way',
      variant: 'secondary',
      action: 'add-ach-manually',
      disabled: this.bankLinkLoading,
    })}
  </div>
`,
```

Keep the existing title, back action, loading overlay, and provider-frame content unchanged.

- [ ] **Step 4: Add the PBB-scoped compact button rule**

Replace `.bank-provider-manual-link` in `src/internal/styles.ts` with:

```css
.bank-provider-alternate-action .button {
  width: auto;
  min-height: 2rem;
  padding: 0 0.625rem;
  font-size: 0.75rem;
  letter-spacing: 0;
  white-space: nowrap;
}
```

- [ ] **Step 5: Run the focused test and lint the changed TypeScript**

Run:

```bash
BROWSERS=chromium npm run test:dev -- --grep "Pay by Bank|PBB header"
npx eslint src/commerce-hub-connect.ts src/test/commerce-hub-connect-flow_test.ts
```

Expected: focused tests PASS and ESLint exits 0.

- [ ] **Step 6: Commit the header change**

```bash
git add src/commerce-hub-connect.ts src/internal/styles.ts src/test/commerce-hub-connect-flow_test.ts
git commit -m "feat: move PBB fallback action into header"
```

### Task 2: Populate all PBB-supported wallet branding fields

**Files:**
- Modify: `src/test/commerce-hub-connect-flow_test.ts:7420-7548`
- Modify: `src/commerce-hub-connect.ts:474-492`
- Modify: `src/commerce-hub-connect.ts:7043-7095`

- [ ] **Step 1: Expand the merchant-override expectation**

Update the existing `assert.deepEqual(initConfig?.appearance, ...)` expectation to retain its current merchant colors and add the supported wallet values that do not have merchant color overrides:

```ts
assert.deepEqual(initConfig?.appearance, {
  branding: {
    backgroundColor: '#fafafa',
    primaryColor: '#123456',
    primaryTextColor: '#1f2937',
    secondaryTextColor: '#4b5563',
    buttonColor: '#123456',
    buttonTextColor: '#ffffff',
    dangerColor: '#dc2626',
    successColor: '#059669',
    borderColor: '#d1d5db',
    placeholderColor: '#9ca3af',
    fontFamily:
      "sohne-var, 'SF Pro Display', system-ui, -apple-system, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
    borderRadius: '8px',
  },
});
```

- [ ] **Step 2: Add a default-branding assertion**

In `test('add bank account uses built-in Pay by Bank credentials when designConfig omits them', ...)`, append:

```ts
assert.deepEqual(initConfig?.appearance, {
  branding: {
    backgroundColor: '#ffffff',
    primaryColor: '#533afd',
    primaryTextColor: '#061b31',
    secondaryTextColor: '#50617a',
    buttonColor: '#533afd',
    buttonTextColor: '#ffffff',
    dangerColor: '#c2410c',
    successColor: '#047857',
    borderColor: '#e5edf5',
    placeholderColor: '#9ca3af',
    fontFamily:
      "sohne-var, 'SF Pro Display', system-ui, -apple-system, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
    borderRadius: '8px',
  },
});
```

- [ ] **Step 3: Run the focused test to verify failure**

Run:

```bash
BROWSERS=chromium npm run test:dev -- --grep "built-in Pay by Bank credentials|compact Connect your bank handoff"
```

Expected: FAIL because `buttonTextColor`, `fontFamily`, and `borderRadius` are absent and the no-config payload currently has an empty branding object.

- [ ] **Step 4: Define wallet branding defaults and merge accepted overrides**

Add a typed constant beside `PaymentSdkAppearanceBranding`:

```ts
const DEFAULT_PAYMENT_SDK_BRANDING: Required<PaymentSdkAppearanceBranding> = {
  backgroundColor: '#ffffff',
  primaryColor: '#533afd',
  primaryTextColor: '#061b31',
  secondaryTextColor: '#50617a',
  buttonColor: '#533afd',
  buttonTextColor: '#ffffff',
  dangerColor: '#c2410c',
  successColor: '#047857',
  borderColor: '#e5edf5',
  placeholderColor: '#9ca3af',
  fontFamily:
    "sohne-var, 'SF Pro Display', system-ui, -apple-system, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
  borderRadius: '8px',
};
```

Initialize the resolver from those defaults:

```ts
const branding: PaymentSdkAppearanceBranding = {
  ...DEFAULT_PAYMENT_SDK_BRANDING,
};
```

Keep the existing normalized override calls for background, primary, primary text, secondary text, button, danger, success, border, and placeholder. Do not add unsupported font-size, font-weight, spacing, or shell-padding properties.

- [ ] **Step 5: Run the focused tests and type-check**

Run:

```bash
BROWSERS=chromium npm run test:dev -- --grep "built-in Pay by Bank credentials|compact Connect your bank handoff"
npm run build
```

Expected: focused tests PASS and TypeScript exits 0.

- [ ] **Step 6: Commit the branding change**

```bash
git add src/commerce-hub-connect.ts src/test/commerce-hub-connect-flow_test.ts
git commit -m "feat: align PBB branding with wallet styles"
```

### Task 3: Verify the complete change

**Files:**
- Verify: `src/commerce-hub-connect.ts`
- Verify: `src/internal/styles.ts`
- Verify: `src/test/commerce-hub-connect-flow_test.ts`

- [ ] **Step 1: Run the full development browser suite**

```bash
BROWSERS=chromium npm run test:dev
```

Expected: all Chromium development-mode tests PASS.

- [ ] **Step 2: Run the full project verification**

```bash
npm run lint
npm test
```

Expected: lint, proxy-auth, package-surface, development browser, and production browser suites all PASS.

- [ ] **Step 3: Inspect the final diff and worktree**

```bash
git diff main...HEAD --check
git status --short
```

Expected: no whitespace errors and no uncommitted implementation files. The two feature commits and the design/plan documentation commits are the only intentional branch changes.
