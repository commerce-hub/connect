# Customer Prefill and Read-only Fields Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Prefill API-provided customer identity data into Wallet SDK-owned card and manual bank forms and make only those populated controls visibly read-only.

**Architecture:** Add a focused customer-prefill utility that normalizes interaction entity data and maps it to fixed and schema-driven forms. Apply prefills only when each form is initialized, mark matching JSON Schema properties read-only, and use native readonly inputs plus state-level change guards. Keep the existing PBB `PaymentSDK.init.customer` contract unchanged.

Customer contact data must not populate payment identifiers. In particular, API email must not be mapped to the Interac `interacAccount` field.

**Tech Stack:** TypeScript, Lit, JSON Forms, Web Test Runner, Chai

---

### Task 1: Customer-prefill model

**Files:**

- Create: `src/internal/forms/customer-prefill.ts`
- Create: `src/test/customer-prefill_test.ts`

- [x] Write tests proving values are trimmed, blank values are omitted, a full name is assembled from either/both name components, and supported schema property aliases receive values.
- [x] Run `npx wtr src/test/customer-prefill_test.ts` and confirm the missing utility causes failure.
- [x] Implement a small immutable prefill model and helpers for fixed card and configuration-driven bank forms.
- [x] Re-run the helper assertions against the compiled module and confirm they pass (browser execution is unavailable in the current environment).

### Task 2: Primitive readonly semantics and styling

**Files:**

- Modify: `src/internal/primitives.ts`
- Modify: `src/internal/styles.ts`
- Modify: `src/test/commerce-hub-connect-primitives_test.ts`

- [x] Add a failing primitive test that requires `renderTextField` to emit native `readonly`, a readonly wrapper class, and no disabled state.
- [x] Attempt the browser test and record the environment's unavailable Playwright browser runtime.
- [x] Add a `readonly` option to the text-field primitive and neutral visual styling for readonly card-form controls.
- [x] Compile the primitive and test successfully; browser execution remains environment-blocked.

### Task 3: Card-form prefill and lock

**Files:**

- Modify: `src/commerce-hub-connect.ts`
- Modify: `src/test/commerce-hub-connect-flow_test.ts`

- [x] Add a failing flow test proving API first/last name initializes `name-on-card`, renders it readonly, and ignores a synthetic input event; add a partial-data case that remains editable when no name exists.
- [x] Attempt the browser test and record the environment's unavailable Playwright browser runtime.
- [x] Initialize the card draft from normalized API customer data, pass readonly to the primitive, and guard card updates for the locked field.
- [x] Compile the flow implementation and test successfully; browser execution remains environment-blocked.

### Task 4: Configuration-driven manual-bank prefill and lock

**Files:**

- Modify: `src/internal/forms/instrument-schema.ts`
- Modify: `src/commerce-hub-connect.ts`
- Modify: `src/test/instrument-schema-adapter_test.ts`
- Modify: `src/test/commerce-hub-connect-flow_test.ts`

- [x] Add failing adapter tests for prefilling supported identity paths and setting `readOnly` only where non-empty API data exists.
- [x] Attempt the browser test and record the environment's unavailable Playwright browser runtime.
- [x] Extend schema initial-data and normalization helpers to accept customer prefills while retaining the existing country behavior.
- [x] Add a failing flow test that proves `accountHolderName` is prefilled/read-only and attempted data-change events cannot replace it.
- [x] Apply prefills at manual-form initialization and restore locked API values in the data-change handler.
- [x] Verify the adapter behavior against the compiled module; browser execution remains environment-blocked.

### Task 5: Verification and commit

**Files:**

- Verify all modified source and test files.

- [x] Run `npm run build`.
- [x] Run `npm run check:localization`.
- [x] Run `npm_config_cache=/tmp/chc-sdk-npm-cache npm run test:package-surface`.
- [x] Attempt the affected browser test files; local Chrome exits during Playwright launch and managed browser download is blocked by the environment TLS certificate chain.
- [ ] Run `/opt/homebrew/bin/git diff --check` and inspect the complete diff.
- [ ] Commit only feature-related files; leave `INTERNAL_GITHUB_PACKAGES_INSTALLATION.md` untouched.
