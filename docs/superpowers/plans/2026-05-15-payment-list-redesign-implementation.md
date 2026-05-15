# Payment List Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the saved payment methods screen to match the approved layout with compact radio rows, vendored flat-rounded card logos, link-style add actions, and updated default copy.

**Architecture:** Keep the payment-list redesign inside the existing SDK primitives. Drive the change from failing primitive and flow tests first, then add a small icon helper module for the vendored SVGs and update the payment-list screen to use the new row and action variants.

**Tech Stack:** Lit, TypeScript, CSS-in-JS via `lit` `css`, Web Test Runner.

---

### Task 1: Lock The Payment List Defaults With Failing Tests

**Files:**
- Modify: `src/test/commerce-hub-connect-flow_test.ts`
- Modify: `src/test/commerce-hub-connect-primitives_test.ts`
- Test: `test/commerce-hub-connect-flow_test.js`
- Test: `test/commerce-hub-connect-primitives_test.js`

- [ ] **Step 1: Update the flow expectations**

Assert the saved payment methods screen renders `Pay with`, no default subtitle,
no divider, add-card before add-bank, and `Confirm`.

- [ ] **Step 2: Update the primitive expectations**

Assert the payment row renders a radio affordance, icon chip, primary title from
`label`, masked account text, and no chevron.

- [ ] **Step 3: Compile the updated tests**

Run:

```bash
npm run build
```

Expected:

- the generated `test/*.js` files reflect the updated TypeScript tests

- [ ] **Step 4: Run the focused tests and verify they fail**

Run:

```bash
BROWSERS=chromium npm run test:dev -- --files test/commerce-hub-connect-primitives_test.js
BROWSERS=chromium npm run test:dev -- --files test/commerce-hub-connect-flow_test.js
```

Expected:

- failures show the current payment row structure, copy defaults, and saved-page
  actions do not match the approved design

### Task 2: Implement The Payment Row And Link Actions

**Files:**
- Create: `src/internal/payment-method-icons.ts`
- Modify: `src/internal/primitives.ts`
- Modify: `src/internal/styles.ts`
- Modify: `src/internal/types.ts`
- Modify: `src/commerce-hub-connect.ts`

- [ ] **Step 1: Add the vendored SVG icon helper**

Create a focused helper that returns inline SVG markup for supported card
networks and a bank fallback icon.

- [ ] **Step 2: Update the payment row primitive**

Replace the chevron-based payment row with a radio-plus-icon-chip layout that
uses the payment source `label` as the title and masked account digits as the
secondary line.

- [ ] **Step 3: Add the link-style source action variant**

Extend the source action primitive so the saved payment methods page can render
plus-prefixed text links while the no-saved page keeps the existing card-style
actions.

- [ ] **Step 4: Update the saved payment methods screen defaults**

Change the default title to `Pay with`, default subtitle to empty, default CTA
to `Confirm`, render add-card before add-bank, and disable the header divider
for the saved payment methods screen.

### Task 3: Verify The Redesign

**Files:**
- Test: `test/commerce-hub-connect-primitives_test.js`
- Test: `test/commerce-hub-connect-flow_test.js`

- [ ] **Step 1: Rebuild after implementation**

Run:

```bash
npm run build
```

Expected:

- the SDK compiles successfully

- [ ] **Step 2: Re-run the focused dev tests**

Run:

```bash
BROWSERS=chromium npm run test:dev -- --files test/commerce-hub-connect-primitives_test.js
BROWSERS=chromium npm run test:dev -- --files test/commerce-hub-connect-flow_test.js
```

Expected:

- both focused suites pass in dev mode

- [ ] **Step 3: Re-run the focused prod tests**

Run:

```bash
BROWSERS=chromium npm run test:prod -- --files test/commerce-hub-connect-primitives_test.js
BROWSERS=chromium npm run test:prod -- --files test/commerce-hub-connect-flow_test.js
```

Expected:

- both focused suites pass in prod mode
