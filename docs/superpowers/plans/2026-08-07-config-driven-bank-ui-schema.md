# Config-Driven Bank UI Schema Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Render manual bank-account fields in the order supplied by each configuration-inquiry `uiSchema`, including labeled enum selectors, while preserving billing-address behavior and generated-layout fallback.

**Architecture:** Extend the generated Config API types with the wire contract, then validate and normalize UI schemas in the existing instrument-schema adapter. The component selects the validated API layout or the existing generated layout, filters address controls when a saved address is selected, and injects the SDK billing-address control immediately before the first visible address control.

**Tech Stack:** TypeScript 5.9, Lit 3, JSON Forms Core, AJV, OpenAPI TypeScript, Web Test Runner.

---

### Task 1: Extend the Config API contract

**Files:**

- Modify: `config-swagger.yaml`
- Regenerate: `src/generated/config-openapi.ts`
- Test: `src/test/api-client_test.ts`

- [ ] Add `uiSchema` to `ConfigInstrumentSchema` using recursive `ConfigUiSchemaElement` and `ConfigUiSchemaControl` schemas supporting `VerticalLayout`, nested layouts, and `Control.scope`.
- [ ] Add `enum: string[]` and `x-enumLabels: Record<string, string>` to `ConfigInstrumentSchemaProperty`.
- [ ] Run `npm run generate:client` and verify generated `ConfigInstrumentSchema` exposes all three fields.
- [ ] Add compile-time API surface assertions for the configuration-inquiry response.

### Task 2: Validate and normalize the supplied schema

**Files:**

- Modify: `src/internal/forms/instrument-schema.ts`
- Test: `src/test/instrument-schema-adapter_test.ts`

- [ ] Write failing tests proving enum values and labels survive normalization.
- [ ] Write failing tests proving a valid API layout preserves exact element order and resolves dotted-property scopes against the normalized nested schema.
- [ ] Write failing tests for missing/unsupported layout types, malformed elements, duplicate scopes, and unresolved scopes; each must fall back to `createInstrumentSchemaUiSchema()`.
- [ ] Extend property validation so enum values are unique nonblank strings and every supplied label key belongs to the enum.
- [ ] Copy `enum` and `x-enumLabels` into normalized leaf schemas without mutating the wire response.
- [ ] Add `resolveInstrumentSchemaUiSchema(schema)` which returns the validated API layout or the existing generated layout.
- [ ] Add an address-control filter that recursively removes scopes beginning with `#/properties/address/` while preserving remaining order.
- [ ] Change billing-address injection to insert immediately before the first address control rather than regrouping all controls.

### Task 3: Render labeled enum controls

**Files:**

- Modify: `src/internal/jsonforms-lit/renderers.ts`
- Test: `src/test/jsonforms-lit-renderers_test.ts`

- [ ] Write a failing renderer test with `enum: ['CA', 'NY']` and `x-enumLabels: {CA: 'California', NY: 'New York'}`.
- [ ] Update `JsonFormsEnumControlRenderer` to use the label map for option text while retaining the enum code as the option value.
- [ ] Verify missing labels fall back to the enum code.

### Task 4: Integrate API UI schemas with billing-address selection

**Files:**

- Modify: `src/commerce-hub-connect.ts`
- Test: `src/test/commerce-hub-connect-flow_test.ts`

- [ ] Add the supplied US business/personal response fixture including `uiSchema`, dotted address properties, State enum, and enum labels.
- [ ] Write failing flow tests proving API order, billing-address insertion, labeled State options, and business/personal selection.
- [ ] Write failing tests proving saved-address selection removes address controls/requirements and New Address restores them without losing unrelated form data.
- [ ] Replace direct `createInstrumentSchemaUiSchema(formInstrumentSchema)` usage with the validated API layout. For saved addresses, filter the selected schema's API layout before injecting the billing-address control.
- [ ] Verify older responses without `uiSchema` retain generated-layout behavior.

### Task 5: Verify and commit

**Files:** all files above

- [ ] Run focused tests with `BROWSERS=chromium npm run test:dev` when a browser is available.
- [ ] Run `npm run lint`, `npm run build`, `npm run test:proxy-auth`, and `npm run test:package-surface`.
- [ ] Run `git diff --check` and inspect the feature diff separately from pre-existing API URL/documentation changes.
- [ ] Commit only the UI-schema implementation and its tests; leave unrelated working-tree changes unstaged.
