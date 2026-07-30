# Payment Selection and Add Sheet Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restore verified-source radio selection and `Use selected method`, and replace separate Add buttons with an accessible icon-based add-payment bottom sheet.

**Architecture:** Keep draft selection in `selectedPaymentSourceId` and reuse the existing select-intent attach method. Render the sheet through the existing widget shell so it overlays the stable list without replacing screen state, while `addLauncherActive` controls open/closed state.

**Tech Stack:** Lit 3, TypeScript 5.9, Shadow DOM CSS, Mocha, @web/test-runner, Playwright.

---

### Task 1: Restore selection contracts

**Files:** `src/internal/types.ts`, `src/internal/primitives.ts`, `src/internal/screens/payment-methods-screen.ts`, `src/commerce-hub-connect.ts`, `src/test/commerce-hub-connect-payment-selection_test.ts`, `src/test/commerce-hub-connect-flow_test.ts`

- [ ] Add failing tests for verified radios, draft-only changes, the disabled/enabled `Use selected method` button, attach POST, selected review, and `onSelect`.
- [ ] Compile tests and confirm the current renderer lacks the required controls.
- [ ] Reintroduce `selected`/`selectable` row options, radio change handling, selected ID screen mapping, and the original configurable primary footer button.
- [ ] Build and lint.

### Task 2: Add the secondary action and modal sheet

**Files:** `src/internal/types.ts`, `src/internal/primitives.ts`, `src/internal/styles.ts`, `src/commerce-hub-connect.ts`, `src/test/commerce-hub-connect-primitives_test.ts`, `src/test/commerce-hub-connect-payment-selection_test.ts`, `src/test/commerce-hub-connect-accessibility_test.ts`

- [ ] Add failing tests for the two-button footer, no helper sentence, xmark close control, icon option cards, allowed tender filtering, direct single-type navigation, backdrop/Escape close, focus return, and focus trap.
- [ ] Add `bottomSheet` shell content and action names for opening/closing the sheet.
- [ ] Render the supplied xmark, credit-card, and building-columns path data inline with Font Awesome license comments.
- [ ] Add responsive footer, backdrop, sheet, option-card, icon-tile, and focus styles.
- [ ] Build and lint.

### Task 3: Documentation and verification

**Files:** `README.md`, `docs-src/flow.md`, `docs/commerce-hub-connect.bundled.js`, visual fixtures

- [ ] Document restored explicit selection and the consolidated Add sheet.
- [ ] Format touched files and rebuild the SDK/documentation bundle.
- [ ] Run build, lint, Node tests, browser tests where the environment permits, and `git diff --check`.

The worktree contains overlapping uncommitted changes. Do not commit implementation files without explicit authorization.
