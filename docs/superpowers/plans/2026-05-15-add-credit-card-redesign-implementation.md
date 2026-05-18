# Add Credit Card Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restyle the add-credit-card flow to match the provided SDK reference while preserving the existing billing-address and card-save logic.

**Architecture:** Keep the current card-flow state machine in `src/commerce-hub-connect.ts`, but move the visual treatment into shared text/select field variants and a dedicated add-card footer layout. Reuse existing design tokens and copy resolution so the screen stays white-labelable through the SDK.

**Tech Stack:** Lit, TypeScript, shared primitive render helpers, web-test-runner

---

### Task 1: Redesign Expectations

**Files:**
- Modify: `src/test/commerce-hub-connect-flow_test.ts`
- Modify: `src/test/commerce-hub-connect-primitives_test.ts`

- [ ] Add failing flow assertions for the add-card screen title, subtitle, no close button, full-width/half-width field layout, always-visible billing-address select, back action, and updated save button label.
- [ ] Add failing primitive assertions for the new card-form field/select variants so styling is exercised outside the full SDK flow.
- [ ] Run: `BROWSERS=chromium npm run test:dev -- --files test/commerce-hub-connect-primitives_test.js`
- [ ] Run: `BROWSERS=chromium npm run test:dev -- --files test/commerce-hub-connect-flow_test.js`

### Task 2: Shared Card Form Primitives

**Files:**
- Modify: `src/internal/types.ts`
- Modify: `src/internal/primitives.ts`
- Modify: `src/internal/styles.ts`

- [ ] Extend text/select field options with a card-form variant and any minimal metadata needed for inline select captions.
- [ ] Implement the variant markup in shared primitives without changing existing default-field behavior.
- [ ] Add token-driven styles for card-form inputs, select chrome, two-action footer layout, and back-link treatment.
- [ ] Keep title/header sizing explicit, inherit the SDK base typography elsewhere, and keep all colors/fonts token-driven.

### Task 3: Add Card Screen Wiring

**Files:**
- Modify: `src/commerce-hub-connect.ts`
- Test: `src/test/commerce-hub-connect-flow_test.ts`

- [ ] Update `renderAddCardScreen()` to use the new card-form field/select variants, the reference copy, the bottom back/save layout, and `showClose: false`.
- [ ] Keep the existing billing-address logic intact, but always render the billing-address selector with the saved addresses plus `Add new billing address`.
- [ ] Switch country/state to select controls while preserving the existing draft validation and save pipeline.
- [ ] Remove the close button from card error screens as well so all SDK screens stay close-free.
- [ ] Run: `npm run build`
- [ ] Run: `BROWSERS=chromium npm run test:dev -- --files test/commerce-hub-connect-primitives_test.js`
- [ ] Run: `BROWSERS=chromium npm run test:dev -- --files test/commerce-hub-connect-flow_test.js`
- [ ] Run: `BROWSERS=chromium npm run test:prod -- --files test/commerce-hub-connect-primitives_test.js`
- [ ] Run: `BROWSERS=chromium npm run test:prod -- --files test/commerce-hub-connect-flow_test.js`
