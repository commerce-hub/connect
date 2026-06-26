# Lit Alignment Audit

Source inspected for `lit-audit-current-widget` on 2026-06-26. This audit is intentionally non-runtime: it documents the current Lit alignment, recommended implementation work, and task ordering risks without changing widget behavior.

## Stable Public Contract

The following public surface is present and should remain stable in follow-up work:

- Single public custom element: `<commerce-hub-connect>` is registered by `@customElement('commerce-hub-connect')` on `CommerceHubConnect` in `src/commerce-hub-connect.ts:427-428`.
- Public properties: `.interactionResponse`, `.designConfig`, and `.baseURL` are Lit reactive properties at `src/commerce-hub-connect.ts:438-455`; `baseURL` is mapped to the `base-url` attribute at `src/commerce-hub-connect.ts:454-455`.
- Public event constants and typed event aliases: `ON_SELECT_EVENT`, `ON_ADD_PAYMENT_METHOD_EVENT`, `ON_VERIFY_PAYMENT_METHOD_EVENT`, `ON_DELETE_PAYMENT_METHOD_EVENT`, `ON_LIST_PAYMENT_METHODS_EVENT`, `ON_TRANSFER_EVENT`, and `ON_ERROR_EVENT` are exported at `src/commerce-hub-connect.ts:129-201`.
- Host-owned completion boundary: README flow keeps host checkout completion after `onSelect`, including `GET /merchant/interaction/{interactionId}/complete`, at `README.md:46-54` and `README.md:72-85`.
- No `onSuccess` reintroduction: tests still listen for legacy `onSuccess` only to assert it is not emitted at `src/test/commerce-hub-connect-payment-selection_test.ts:167-180` and `src/test/commerce-hub-connect-payment-selection_test.ts:1722-1725`.
- Browser custom element typing exists through `HTMLElementEventMap` and `HTMLElementTagNameMap` at `src/commerce-hub-connect.ts:7108-7120`.

## No-Op Observations

- The package is already Lit-based and framework-agnostic: `src/commerce-hub-connect.ts:1-2` imports Lit APIs, `package.json:65-67` depends on Lit 3, and README describes the SDK as Lit-based at `README.md:3-6`.
- The host uses shadow DOM styling via static Lit styles: `CommerceHubConnect.styles = primitiveStyles` at `src/commerce-hub-connect.ts:429`, with `primitiveStyles` defined in `src/internal/styles.ts:1-47`.
- Internal primitive render helpers are already separated from the host into `src/internal/primitives.ts`, and tests assert those helpers do not create extra public custom elements at `src/test/commerce-hub-connect-primitives_test.ts:81-88`.
- Generated OpenAPI types are not hand-augmented for gateway OAuth; the local `InteractionResponse` augmentation is in `src/commerce-hub-connect.ts:61-100`, and README documents that generated files should be regenerated instead of edited at `README.md:199-209`.
- Documentation tooling is present: `package.json:37-44` runs docs generation and custom-elements manifest analysis, and `package.json:93` points consumers to `custom-elements.json`.

## Findings By Implementation Priority

### 1. Duplicate `@state()` decorators should be removed first

Evidence:

- `bankOutcomeSource` has two adjacent `@state()` decorators at `src/commerce-hub-connect.ts:478-480`.
- `cardFlowScreen` has two adjacent `@state()` decorators at `src/commerce-hub-connect.ts:513-515`.

Why it matters for Lit alignment:

Lit decorators are part of the component's reactive metadata. Duplicate decorators are easy to miss in review, add noise to generated custom-element metadata, and make later state-model extraction more error-prone.

Recommended follow-up task: `lit-public-interoperability` for public metadata safety, or a small prerequisite patch before `lit-form-state-models`.

### 2. Host element owns too many responsibilities for idiomatic Lit composition

Evidence:

- The host declares a large set of private reactive state fields spanning OTP, bank linking, manual ACH, card entry, transfer, payment-source selection, deletion, verification, required-info upload, and refresh state at `src/commerce-hub-connect.ts:457-581`.
- The host routes every screen from a single `renderCurrentScreen()` branch at `src/commerce-hub-connect.ts:703-745`.
- The host renders full screens inline, such as OTP at `src/commerce-hub-connect.ts:748-821`, payment-source selection at `src/commerce-hub-connect.ts:823-953`, required info at `src/commerce-hub-connect.ts:1106-1120`, transfer at `src/commerce-hub-connect.ts:1299`, card at `src/commerce-hub-connect.ts:1500`, bank provider at `src/commerce-hub-connect.ts:1776`, and bank outcome at `src/commerce-hub-connect.ts:1930`.
- The host also owns event delegation and action routing for all flows at `src/commerce-hub-connect.ts:1987-2495`.

Why it matters for Lit alignment:

Keeping the public element as the single source of truth is compatible with Lit, but the current host mixes public API, orchestration, screen selection, screen templates, form state, and side effects. That makes reactive update boundaries hard to test independently and raises the risk that a small screen change mutates unrelated flow state.

Recommended follow-up task: `lit-screen-composition`, after `lit-form-state-models` has extracted typed state modules for card, ACH, transfer, OTP, and required-info drafts.

### 3. Side effects are spread across lifecycle methods, render-time paths, and host methods

Evidence:

- `willUpdate()` resets cross-flow state and syncs billing/selection when `interactionResponse` changes at `src/commerce-hub-connect.ts:583-628`.
- `updated()` applies style properties and starts interaction refreshes at `src/commerce-hub-connect.ts:630-645`.
- Rendering the payment-source screen can queue native balance refresh work at `src/commerce-hub-connect.ts:879-884`.
- Native balance refresh is queued with `queueMicrotask()` and then performs network work at `src/commerce-hub-connect.ts:4337-4402` and `src/commerce-hub-connect.ts:4405-4450`.
- Interaction refresh stores in-flight promises and emits `onListPaymentMethods` from the host at `src/commerce-hub-connect.ts:4467-4513`.
- Pay by Bank script loading and global SDK teardown are module-level side effects at `src/commerce-hub-connect.ts:7033-7098`, with host teardown in `disconnectedCallback()` at `src/commerce-hub-connect.ts:665-670`.

Why it matters for Lit alignment:

Lit reactive controllers are well-suited for reusable effects tied to host connection and update cycles. Moving API refresh, native balances, and Pay by Bank script lifecycle into focused controllers would make connection cleanup, in-flight request de-duplication, and render determinism easier to reason about while preserving the host-owned completion boundary.

Recommended follow-up task: `lit-controller-api-effects`, after `lit-event-contracts` clarifies event dispatch semantics.

### 4. Public event contracts are typed but underspecified for cross-shadow/framework bubbling

Evidence:

- The shared event helper dispatches `new CustomEvent<T>(name, {detail})` without `bubbles` or `composed` at `src/commerce-hub-connect.ts:672-674`.
- `onSelect` is also dispatched directly without `bubbles` or `composed` in `attachPaymentSource()` at `src/commerce-hub-connect.ts:3606-3611`.
- Tests attach listeners directly to the custom element at `src/test/commerce-hub-connect-flow_test.ts:408-430` and `src/test/commerce-hub-connect-payment-selection_test.ts:167-180`; they verify event order and absence of legacy events, but not composed/bubbling behavior.
- README and examples document direct element listeners for `onSelect` and `onTransfer` at `README.md:72-85`, `docs-src/examples/lit.md:24-30`, `docs-src/examples/react.md:75-80`, and `docs-src/examples/angular.md:30-35`.

Why it matters for Lit alignment:

Framework interop is stronger when custom-element events have a deliberate contract for `bubbles`, `composed`, `cancelable`, and typed detail. The current direct-listener pattern works, but the contract is implicit and not enforced by tests. Any future change should preserve event names and host-owned completion while deciding whether public SDK events should cross shadow boundaries.

Recommended follow-up task: `lit-event-contracts`.

### 5. Styling hooks rely on CSS custom properties but expose no `::part()` surface

Evidence:

- The stylesheet defines a broad `--chc-*` token surface on `:host` at `src/internal/styles.ts:4-47`.
- `designConfig` is applied by mutating host inline CSS properties in `syncDesignConfigStyles()` at `src/commerce-hub-connect.ts:4741-4787`.
- The mapped design config color properties are maintained in the host file at `src/commerce-hub-connect.ts:5900-5943`.
- There are no `part=` or `exportparts` attributes in the inspected primitives or host output; primitive templates expose internal class names such as `.widget-shell`, `.button`, `.payment-method-row`, and `.selected-payment-method` at `src/internal/primitives.ts:251-285`, `src/internal/primitives.ts:514-621`, and `src/internal/primitives.ts:918-967`.
- README documents `.designConfig` but does not document CSS custom properties or parts at `README.md:140-169`.

Why it matters for Lit alignment:

CSS custom properties are good theming hooks for shadow DOM, but framework-agnostic component consumers often need stable `::part()` names for targeted styling without relying on private classes. The current class-only internal structure makes styling hooks accidental rather than contractual.

Recommended follow-up task: `lit-styling-surface`.

### 6. Internal render primitives are useful, but screen composition is still class/data-action driven

Evidence:

- Render helpers return Lit templates and accept typed option objects in `src/internal/primitives.ts:251-380` and `src/internal/primitives.ts:514-967`.
- Interaction is wired through `data-action`, `data-card-field`, `data-bank-account-field`, `data-transfer-field`, and `data-required-info-doc-key` attributes rather than callback properties, as shown in `src/internal/primitives.ts:260-284`, `src/internal/primitives.ts:287-339`, `src/internal/primitives.ts:584-599`, and the host event router at `src/commerce-hub-connect.ts:1987-2404`.
- `FlowActionName` centralizes the current action vocabulary at `src/internal/types.ts:9-41`.

Why it matters for Lit alignment:

Delegated `data-action` routing keeps the public element single and avoids exposing internal custom elements, but it couples every primitive to the host's global action vocabulary. Private internal custom elements or render modules with explicit callback contracts would make screen-level behavior more testable without changing `<commerce-hub-connect>`.

Recommended follow-up task: `lit-screen-composition`, sequenced after `lit-form-state-models`.

### 7. Docs and examples cover basic framework binding but drift from the full public contract

Evidence:

- The Lit example binds `.interactionResponse`, `.baseURL`, `@onAddPaymentMethod`, and `@onSelect`, but the host `interactionResponse` field is not declared with a Lit reactive decorator in the example at `docs-src/examples/lit.md:21-30`.
- The React example assigns properties through a ref and listens for `onSelect` and `onTransfer`, but does not show `.designConfig` or the other operation events at `docs-src/examples/react.md:35-84`.
- The Angular example demonstrates property binding and `CUSTOM_ELEMENTS_SCHEMA`, but only covers `onSelect` and `onTransfer` at `docs-src/examples/angular.md:26-53`.
- README documents the full event table and design config at `README.md:124-169`, but the examples do not mirror that full surface.

Why it matters for Lit alignment:

Framework interoperability depends as much on accurate examples as runtime behavior. The examples correctly avoid attributes for object values, but follow-up docs should show the stable public property and event surface consistently, including `designConfig`, direct listener guidance, and the supported `onSelect` completion boundary.

Recommended follow-up task: `lit-test-docs-regeneration`, after `lit-event-contracts`, `lit-styling-surface`, and `lit-public-interoperability` settle the contracts.

## Task Ordering Notes

- `lit-event-contracts` should run before controller extraction so extracted controllers can use the finalized event helper and tests.
- `lit-controller-api-effects` should not move completion into a widget-owned service; `attachPaymentSource()` currently emits `onSelect` only after the SDK-managed attach completes at `src/commerce-hub-connect.ts:3564-3617`, while host checkout completion remains documented outside the widget at `README.md:46-54`.
- `lit-form-state-models` should run before `lit-screen-composition` because the host currently stores all form drafts and errors as reactive fields at `src/commerce-hub-connect.ts:482-568`.
- `lit-styling-surface` should define `part` names and CSS custom property documentation before `lit-test-docs-regeneration`.
- `lit-public-interoperability` should be rebased after event and styling contract changes so the custom-elements manifest and TypeScript declarations describe the final public surface.
- `lit-test-docs-regeneration` should run last because `package.json:37-44` regenerates docs and custom-elements metadata from source.

No assigned implementation task appears blocked by missing prior work in this checkout, but source-changing tasks should remain merge-sequenced because most of them touch `src/commerce-hub-connect.ts`.
