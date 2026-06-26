# Lit Alignment Meeseeks Task Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` or `superpowers:executing-plans` when implementing any task from this file. Each task is intended to be a self-contained Meeseeks handoff with explicit files, constraints, acceptance criteria, and verification.

**Goal:** Align the CommerceHub Connect widget with Lit best practices across public interoperability, internal architecture, screen composition, styling hooks, and event contracts without breaking the existing SDK API.

**Architecture:** Keep `<commerce-hub-connect>` as the single public custom element and source of truth. Move internal concerns out of the large host element incrementally into focused Lit controllers, typed state modules, render modules, or private internal custom elements while preserving the existing public properties, exported types, and event names.

**Tech Stack:** Lit 3, TypeScript, custom elements, shadow DOM, `@web/test-runner`, Playwright, custom-elements manifest analyzer, Eleventy docs.

---

## Current State

- The public SDK element is `CommerceHubConnect` registered as `<commerce-hub-connect>` in `src/commerce-hub-connect.ts`.
- The public host API is property-first: `.interactionResponse`, `.designConfig`, and `.baseURL`; object values must remain DOM properties, not serialized attributes.
- The current public completion event is `onSelect`; host completion remains host-owned after `onSelect`.
- `src/commerce-hub-connect.ts` is large and mixes public API exports, interaction state, rendering, event delegation, form state, API calls, provider setup, and utility functions.
- `src/internal/primitives.ts` already provides render helpers, but those helpers are template functions rather than Lit components.
- `src/internal/styles.ts` contains the widget styling surface and existing CSS custom properties driven by `designConfig`.
- The Pay by Bank provider uses a named slot plus a light DOM container created by the host element.
- Docs and generated artifacts are coupled: source changes can require `npm run analyze`, `npm run docs`, and generated `custom-elements.json` / `docs/` updates.

## Non-Negotiable Constraints

- Do not rename `<commerce-hub-connect>`, `CommerceHubConnect`, `.interactionResponse`, `.designConfig`, `.baseURL`, `base-url`, or the existing public event constants.
- Do not reintroduce `onSuccess`; `onSelect` is the supported completion boundary.
- Do not move host-owned completion into the widget.
- Do not hand-edit `src/generated/openapi.ts` or `src/generated/merchant-openapi.ts`; regenerate them only after Swagger changes.
- Do not make implementation tasks depend on secrets, live merchant credentials, or real customer data.
- Keep checked-in generated docs in sync when docs or public custom-element metadata changes.
- Preserve browser test style: `@web/test-runner`, Mocha TDD syntax, and `@open-wc/testing`.

## Dispatch Guidance

- Use the task array below as the source for Meeseeks `jira_id` and `jira_description`.
- Prefer one Meeseeks worker per task, but do not merge workers that modify the same files without rebasing and rerunning verification.
- The safest merge sequence is:
  1. `lit-audit-current-widget`
  2. `lit-event-contracts`
  3. `lit-controller-api-effects`
  4. `lit-form-state-models`
  5. `lit-screen-composition`
  6. `lit-styling-surface`
  7. `lit-public-interoperability`
  8. `lit-test-docs-regeneration`
- Tasks with `parallel_group: "audit-docs"` can run in parallel with each other after the initial audit if they only produce reports or docs.
- Tasks with `parallel_group: "source"` should be treated as merge-sequenced because they are likely to touch `src/commerce-hub-connect.ts`.

## Meeseeks Task Array

```json
[
  {
    "jira_id": "lit-audit-current-widget",
    "title": "Audit current Lit alignment and risk areas",
    "parallel_group": "audit-docs",
    "goal": "Produce a source-backed audit of where the widget already follows Lit practices and where it should be refactored.",
    "files_to_inspect": [
      "src/commerce-hub-connect.ts",
      "src/internal/primitives.ts",
      "src/internal/styles.ts",
      "src/internal/types.ts",
      "src/test/commerce-hub-connect-flow_test.ts",
      "src/test/commerce-hub-connect-payment-selection_test.ts",
      "src/test/commerce-hub-connect-primitives_test.ts",
      "docs-src/examples/lit.md",
      "docs-src/examples/react.md",
      "docs-src/examples/angular.md",
      "README.md",
      "package.json"
    ],
    "expected_changes": [
      "Create docs/lit-alignment-audit.md with findings ordered by implementation priority.",
      "Identify duplicated decorators, oversized host-element responsibilities, lifecycle side effects, event dispatch gaps, styling hook gaps, and docs/example drift.",
      "For each finding, include exact file references, why it matters for Lit alignment, and a recommended follow-up task id from this array."
    ],
    "constraints": [
      "Do not change runtime behavior.",
      "Do not edit generated docs or generated TypeScript.",
      "Do not treat large-file size alone as a bug; connect each finding to maintainability, Lit idioms, host interoperability, or testability."
    ],
    "acceptance_criteria": [
      "The audit clearly separates no-op observations from recommended implementation work.",
      "The audit confirms the existing public API and event names that must remain stable.",
      "The audit lists any tasks that should be blocked or reordered based on live source inspection."
    ],
    "verification": [
      "Run: git diff --check",
      "Expected: no whitespace errors."
    ]
  },
  {
    "jira_id": "lit-event-contracts",
    "title": "Standardize event dispatch and type maps",
    "parallel_group": "source",
    "goal": "Make public and internal event dispatch consistent with Lit/custom-element interoperability while preserving existing event names.",
    "files_to_modify": [
      "src/commerce-hub-connect.ts",
      "src/test/commerce-hub-connect-flow_test.ts",
      "src/test/commerce-hub-connect-payment-selection_test.ts",
      "src/test/commerce-hub-connect-primitives_test.ts"
    ],
    "expected_changes": [
      "Introduce a typed internal event map for SDK event names and detail payloads in `src/commerce-hub-connect.ts` or `src/internal/types.ts`.",
      "Route every public SDK event dispatch through one helper such as `emitSdkEvent`.",
      "Keep public events non-renamed: `onSelect`, `onAddPaymentMethod`, `onVerifyPaymentMethod`, `onDeletePaymentMethod`, `onListPaymentMethods`, `onTransfer`, and reserved `onError`.",
      "For any event emitted by future internal subcomponents, document whether it should bubble and cross shadow DOM with `bubbles: true` and `composed: true`; do not change current public event bubbling semantics unless tests prove consumers need it."
    ],
    "constraints": [
      "Do not rename exported event constants or exported event types.",
      "Do not emit `onError` for existing inline recoverable errors.",
      "Do not change the `onSelect` detail payload; it remains `PaymentSource`."
    ],
    "acceptance_criteria": [
      "A source search finds no direct `this.dispatchEvent(new CustomEvent(ON_...` calls outside the approved helper.",
      "Existing event-order assertions still pass.",
      "Event helper typing prevents passing the wrong detail type for the known SDK event constants."
    ],
    "verification": [
      "Run: npm run build",
      "Expected: TypeScript build succeeds.",
      "Run: BROWSERS=chromium npm run test:dev -- --files test/commerce-hub-connect-flow_test.js",
      "Expected: focused browser suite passes.",
      "Run: BROWSERS=chromium npm run test:dev -- --files test/commerce-hub-connect-payment-selection_test.js",
      "Expected: focused browser suite passes."
    ]
  },
  {
    "jira_id": "lit-controller-api-effects",
    "title": "Extract SDK API and refresh orchestration into controllers",
    "parallel_group": "source",
    "goal": "Move request orchestration and refresh side effects out of the host element into focused Lit-friendly internal controllers or service modules.",
    "files_to_modify": [
      "src/commerce-hub-connect.ts",
      "src/internal/api-client.ts",
      "src/internal/types.ts"
    ],
    "files_to_create": [
      "src/internal/controllers/interaction-refresh-controller.ts",
      "src/internal/controllers/native-balance-controller.ts"
    ],
    "tests_to_modify": [
      "src/test/commerce-hub-connect-flow_test.ts",
      "src/test/commerce-hub-connect-payment-selection_test.ts"
    ],
    "expected_changes": [
      "Extract the interaction refresh state currently represented by interaction snapshot ids, in-flight promises, and refresh error message into `InteractionRefreshController`.",
      "Extract native account balance fetch key, queued fetch key, loading ids, and balance map behavior into `NativeBalanceController`.",
      "Controllers should accept the host as `ReactiveControllerHost` and expose plain readonly state plus explicit methods the host can call from lifecycle or render paths.",
      "Controllers should call `host.requestUpdate()` after state changes instead of requiring the host to mirror controller state into many `@state` fields.",
      "The host element should keep public properties and rendering decisions, but delegate refresh and balance orchestration."
    ],
    "constraints": [
      "Do not change request URLs, headers, bearer-token behavior, OAuth handling, or `baseURL` resolution.",
      "Do not introduce a global singleton for interaction state.",
      "Do not fetch balances from render in a way that creates request loops; preserve current dedupe behavior."
    ],
    "acceptance_criteria": [
      "The host element has fewer private fields for refresh and native balance bookkeeping.",
      "Refresh skeleton and retry behavior are unchanged in browser tests.",
      "Balance loading indicators and balance labels remain unchanged for native accounts."
    ],
    "verification": [
      "Run: npm run build",
      "Expected: TypeScript build succeeds.",
      "Run: BROWSERS=chromium npm run test:dev -- --files test/commerce-hub-connect-payment-selection_test.js",
      "Expected: payment selection tests pass.",
      "Run: BROWSERS=chromium npm run test:dev -- --files test/commerce-hub-connect-flow_test.js",
      "Expected: flow tests pass."
    ]
  },
  {
    "jira_id": "lit-form-state-models",
    "title": "Isolate form state and field update models",
    "parallel_group": "source",
    "goal": "Move OTP, card, manual ACH, transfer, and required-info form state updates into focused typed modules so the Lit host renders state instead of owning all field algorithms.",
    "files_to_modify": [
      "src/commerce-hub-connect.ts",
      "src/internal/types.ts",
      "src/test/commerce-hub-connect-flow_test.ts"
    ],
    "files_to_create": [
      "src/internal/forms/card-form-state.ts",
      "src/internal/forms/bank-account-form-state.ts",
      "src/internal/forms/transfer-form-state.ts",
      "src/internal/forms/otp-form-state.ts",
      "src/internal/forms/required-info-form-state.ts",
      "src/test/form-state_test.ts"
    ],
    "expected_changes": [
      "Move pure field formatting, normalization, validation, and readiness logic into `src/internal/forms/*` modules.",
      "Keep API-calling methods in the host or controller layer; form modules should not perform fetches.",
      "Add direct unit coverage for pure form modules so basic validation and formatting do not require full browser-flow tests.",
      "Update host handlers to call form module functions and assign returned immutable next-state objects."
    ],
    "constraints": [
      "Do not change user-facing copy, data-action names, or data-field names unless a test explicitly documents an intentional additive change.",
      "Do not move encryption network calls into pure form modules.",
      "Do not weaken sensitive-field validation or encryption readiness checks."
    ],
    "acceptance_criteria": [
      "Card number, expiration, CVV, ACH routing/account, transfer amount, OTP, and required-info SSN behaviors remain covered.",
      "Pure form tests can run without mounting `<commerce-hub-connect>`.",
      "Focused flow tests still pass after the host is rewired to the new modules."
    ],
    "verification": [
      "Run: npm run build",
      "Expected: TypeScript build succeeds.",
      "Run: BROWSERS=chromium npm run test:dev -- --files test/form-state_test.js",
      "Expected: new pure form-state browser tests pass.",
      "Run: BROWSERS=chromium npm run test:dev -- --files test/commerce-hub-connect-flow_test.js",
      "Expected: flow tests pass."
    ]
  },
  {
    "jira_id": "lit-screen-composition",
    "title": "Split high-value screens into focused Lit internals",
    "parallel_group": "source",
    "goal": "Introduce private internal Lit components or strongly typed screen render modules for the screens that benefit most from composition.",
    "files_to_modify": [
      "src/commerce-hub-connect.ts",
      "src/internal/primitives.ts",
      "src/internal/styles.ts",
      "src/internal/types.ts",
      "src/test/commerce-hub-connect-primitives_test.ts",
      "src/test/commerce-hub-connect-flow_test.ts"
    ],
    "files_to_create": [
      "src/internal/screens/otp-screen.ts",
      "src/internal/screens/payment-methods-screen.ts"
    ],
    "expected_changes": [
      "Extract OTP rendering and OTP-focused input events into a dedicated internal screen component or screen module.",
      "Extract payment-method list rendering, edit-mode rendering, skeleton rendering, and no-saved-methods rendering into a dedicated internal screen component or screen module.",
      "Use typed properties and callback/event boundaries instead of reading host private fields from internal screens.",
      "Keep `<commerce-hub-connect>` as the only documented public element; internal screen tags, if used, must not be exported as public API."
    ],
    "constraints": [
      "Do not create a full design system library in this task.",
      "Do not split every screen at once; OTP and payment methods are the first slice.",
      "Do not change visible copy or CSS class names that tests and docs depend on unless the change is explicitly additive."
    ],
    "acceptance_criteria": [
      "The host element delegates OTP and payment-method rendering through typed internal boundaries.",
      "Existing OTP keyboard, paste, submit, resend, and error behaviors remain intact.",
      "Existing saved payment method selection, edit, delete confirmation, verification, and add-action behaviors remain intact."
    ],
    "verification": [
      "Run: npm run build",
      "Expected: TypeScript build succeeds.",
      "Run: BROWSERS=chromium npm run test:dev -- --files test/commerce-hub-connect-primitives_test.js",
      "Expected: primitives tests pass.",
      "Run: BROWSERS=chromium npm run test:dev -- --files test/commerce-hub-connect-flow_test.js",
      "Expected: flow tests pass.",
      "Run: BROWSERS=chromium npm run test:dev -- --files test/commerce-hub-connect-payment-selection_test.js",
      "Expected: payment selection tests pass."
    ]
  },
  {
    "jira_id": "lit-styling-surface",
    "title": "Add documented Lit-friendly styling hooks",
    "parallel_group": "source-docs",
    "goal": "Expose additive shadow-DOM styling hooks that complement `designConfig` without weakening encapsulation.",
    "files_to_modify": [
      "src/internal/primitives.ts",
      "src/internal/styles.ts",
      "src/commerce-hub-connect.ts",
      "src/test/commerce-hub-connect-primitives_test.ts",
      "docs-src/examples/design-config.md",
      "docs-src/api.11ty.cjs",
      "README.md"
    ],
    "expected_changes": [
      "Audit existing CSS custom properties set from `designConfig` and document which are stable enough to expose.",
      "Add `part` attributes only for stable high-level surfaces such as shell, header, title, content, footer, primary action, alert, payment-method row, and provider frame.",
      "Document that `designConfig` remains the primary merchant-safe theming API; `::part` and CSS custom properties are additive escape hatches.",
      "Add tests that verify representative `part` attributes exist in rendered shadow DOM."
    ],
    "constraints": [
      "Do not make internal implementation-only spans part of the public styling contract.",
      "Do not remove existing CSS custom properties or `designConfig` fields.",
      "Do not expose sensitive provider internals as styling API."
    ],
    "acceptance_criteria": [
      "Docs list the stable part names and supported CSS custom properties.",
      "Existing `designConfig` tests still pass.",
      "The public styling surface is additive and does not require consumers to pierce shadow DOM by class name."
    ],
    "verification": [
      "Run: npm run build",
      "Expected: TypeScript build succeeds.",
      "Run: BROWSERS=chromium npm run test:dev -- --files test/commerce-hub-connect-primitives_test.js",
      "Expected: primitives tests pass.",
      "Run: npm run docs",
      "Expected: docs build and custom-elements analysis succeed."
    ]
  },
  {
    "jira_id": "lit-public-interoperability",
    "title": "Tighten public docs and framework examples",
    "parallel_group": "audit-docs",
    "goal": "Improve Lit, React, Angular, and plain JavaScript examples so they teach the correct custom-element integration model.",
    "files_to_modify": [
      "README.md",
      "COMMERCE_HUB_CONNECT_DOCS.md",
      "docs-src/index.md",
      "docs-src/install.md",
      "docs-src/flow.md",
      "docs-src/examples/lit.md",
      "docs-src/examples/react.md",
      "docs-src/examples/angular.md",
      "docs-src/examples/plain-javascript.md"
    ],
    "expected_changes": [
      "Make the Lit example use reactive properties for host-owned `interactionResponse` and typed event handlers.",
      "Make the React example keep property assignment through a ref and event subscription through `addEventListener`.",
      "Make the Angular example keep `CUSTOM_ELEMENTS_SCHEMA` and property bindings for object values.",
      "Ensure all examples describe `onSelect` as the widget boundary and host completion as host-owned.",
      "Add guidance that object-valued properties should not be passed as HTML attributes."
    ],
    "constraints": [
      "Do not invent a new mount helper unless a separate public API task explicitly adds it.",
      "Do not document internal screen components or internal controllers as public API.",
      "Do not include live credentials, merchant tokens, or real customer data."
    ],
    "acceptance_criteria": [
      "Examples consistently use `.interactionResponse`, `.designConfig`, `.baseURL`, and `onSelect` correctly for each framework.",
      "Docs do not mention `onSuccess` except possibly as migration history if already present and intentional.",
      "Generated docs are updated if docs source changes."
    ],
    "verification": [
      "Run: npm run docs",
      "Expected: docs build succeeds and generated `docs/` output reflects source changes.",
      "Run: git diff --check",
      "Expected: no whitespace errors."
    ]
  },
  {
    "jira_id": "lit-test-docs-regeneration",
    "title": "Final integration verification and generated artifact sync",
    "parallel_group": "final",
    "goal": "After implementation tasks merge, regenerate public artifacts and run the full verification suite required for SDK submission.",
    "files_to_modify": [
      "custom-elements.json",
      "docs/",
      "commerce-hub-connect.js",
      "commerce-hub-connect.d.ts",
      "internal/",
      "test/"
    ],
    "expected_changes": [
      "Run the existing build and docs scripts instead of hand-editing generated artifacts.",
      "Confirm root package outputs and generated docs reflect the final source state.",
      "Create a short verification note in the Meeseeks response summarizing commands, pass/fail status, and any residual risks."
    ],
    "constraints": [
      "Run this task only after source and docs tasks have merged.",
      "Do not patch generated output manually to hide source or analyzer failures.",
      "If a focused browser test fails, inspect the failure before broadening or skipping verification."
    ],
    "acceptance_criteria": [
      "`npm run build` succeeds.",
      "`npm run lint` succeeds.",
      "`npm test` succeeds, or any failure is source-backed and explicitly reported with failing test names.",
      "`npm run docs` succeeds when public docs or custom-element metadata changed.",
      "`git diff --check` reports no whitespace errors."
    ],
    "verification": [
      "Run: npm run build",
      "Expected: TypeScript package outputs are generated successfully.",
      "Run: npm run lint",
      "Expected: lit-analyzer and ESLint pass.",
      "Run: npm test",
      "Expected: proxy auth, development browser tests, and production browser tests pass.",
      "Run: npm run docs",
      "Expected: docs build, custom-elements analysis, bundled docs asset, and Eleventy generation pass.",
      "Run: git diff --check",
      "Expected: no whitespace errors."
    ]
  }
]
```

## Suggested Meeseeks Submission Pattern

Use one task description file per selected task. For a dry run, use:

```bash
python3 .agents/skills/meeseeks-cloud-work/scripts/submit_meeseeks_task.py \
  --repo-path "https://gitlab.onefiserv.net/na/gbs/carat-digital-ecommerce/ms-agentic-commerce-msac/commercehub-connect-wallet-sdk" \
  --jira-id "lit-audit-current-widget" \
  --jira-description-file plans/2026-06-26-lit-alignment-meeseeks-tasks.md \
  --dry-run
```

When submitting individual tasks, copy the selected object plus the global constraints into a task-specific markdown file so the worker receives only the relevant scope.

## Local Plan Verification

For this planning file itself:

```bash
git diff --check
```

Expected result: no whitespace errors.
