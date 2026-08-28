# Non-US Bank Billing Address Selection Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reuse interaction billing addresses in the non-US manual-bank flow and offer an add-new address option without hiding schema-defined bank fields.

**Architecture:** Bank address selection is component-owned state rendered with existing address primitives. An immutable instrument-schema helper removes only the top-level `address` subtree when a saved address is selected, keeping JSON Forms validation aligned with visible controls. Submission either reuses the selected address ID or creates a new address before creating the ACH source.

**Tech Stack:** TypeScript, Lit 3, JSON Forms, Web Test Runner, Mocha TDD, Open WC testing.

---

### Task 1: Derive a bank schema without address fields

**Files:**

- Modify: `src/internal/forms/instrument-schema.ts`
- Test: `src/test/instrument-schema-adapter_test.ts`

- [ ] Add a failing test that calls `instrumentSchemaWithoutAddress(normalizedSchema)` and asserts that `address` is removed from `properties` and `required`, while `institutionNumber` and `transitNumber` remain unchanged and the input is not mutated.
- [ ] Run `BROWSERS=chromium npm run test:dev -- --files src/test/instrument-schema-adapter_test.ts` and confirm failure because the helper is not exported.
- [ ] Implement `instrumentSchemaWithoutAddress(schema: JsonSchema): JsonSchema` using copied root `properties` and `required` collections.
- [ ] Rerun the focused test and confirm it passes.

### Task 2: Render and reconcile bank billing-address selection

**Files:**

- Modify: `src/commerce-hub-connect.ts`
- Test: `src/test/commerce-hub-connect-flow_test.ts`

- [ ] Add failing component tests proving a saved address is summarized by default, `Change` reveals saved/new options, and choosing new shows address controls while institution and transit controls remain visible.
- [ ] Run focused flow tests and confirm the bank flow has no billing-address selector.
- [ ] Add bank-specific selected-address and selector-expanded state initialized from `billingAddresses`.
- [ ] Render the existing address summary/select primitives above JSON Forms.
- [ ] Derive JSON Forms schema, UI schema, data, and validity from the selected address mode so hidden address fields are not validated.
- [ ] Reconcile bank selection when interaction addresses refresh and preserve valid selection across schema navigation.
- [ ] Rerun the focused flow tests and confirm they pass.

### Task 3: Branch submission between saved and new addresses

**Files:**

- Modify: `src/commerce-hub-connect.ts`
- Test: `src/test/commerce-hub-connect-flow_test.ts`

- [ ] Add failing request tests proving saved-address submission skips `POST /interaction/billing-address` and uses the existing ID, while new-address submission retains the current POST behavior.
- [ ] Run the focused tests and verify the saved-address case fails on the unwanted address POST.
- [ ] Resolve the selected saved address from authoritative state or create a new one only for the sentinel selection.
- [ ] Keep current bank-source mapping, encryption, success events, and error handling unchanged after resolving the address ID.
- [ ] Rerun focused tests and confirm both request paths pass.

### Task 4: Verify the complete SDK

**Files:**

- Verify all modified files and existing regression coverage.

- [ ] Run `npm run build` and fix any strict TypeScript errors.
- [ ] Run `npm run lint` and fix any new lint errors.
- [ ] Run the focused instrument-schema and component-flow browser tests.
- [ ] Run `npm test` and report any environment-only limitations separately from code failures.
- [ ] Run `git diff --check` and inspect `git status --short` to confirm no generated or unrelated files changed.
