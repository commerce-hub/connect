# SDK Consumer Documentation and API Contract Refresh Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Update the customer-facing documentation and public runtime OpenAPI contract for wallet SDK v0.12.4 without publishing internal implementation details.

**Architecture:** Treat `docs-src` as the editable customer documentation source and `docs` as generated output. Reconcile the checked-in runtime `swagger.json` with the public routes and schemas the SDK consumes, then regenerate `src/generated/openapi.ts` through the existing generator.

**Tech Stack:** Markdown, Eleventy, OpenAPI 3.1 JSON, TypeScript, `openapi-typescript`, Node.js.

---

### Task 1: Update installation and initialization documentation

**Files:**
- Modify: `docs-src/install.md`
- Modify: `docs-src/index.md`
- Modify: `docs-src/flow.md`
- Modify: `docs-src/examples/plain-javascript.md`
- Modify: `docs-src/examples/lit.md`
- Modify: `docs-src/examples/react.md`
- Modify: `docs-src/examples/angular.md`

- [ ] **Step 1: Replace legacy package installation and imports**

Use `@commerce-hub/connect-wallet-sdk@0.12.4` for GitHub Packages examples, document the `.npmrc` scope configuration, and provide the v0.12.4 GitHub Release tarball alternative. Replace every `commerce-hub-connect-sdk` import with `@commerce-hub/connect-wallet-sdk`.

- [ ] **Step 2: Update initialization examples**

Keep the public initialization boundary as:

```ts
widget.interactionResponse = interactionResponse;
```

Where an example demonstrates a Create Interaction response that returns OAuth fields separately, merge `client_id` and `configuration_id` into `interactionResponse.oauth` before assignment. Do not document internal request/header construction.

- [ ] **Step 3: Add customer identity behavior**

Document that nonblank `entityData.firstName`, `lastName`, `email`, and `phoneDetails.phoneNumber` values prefill supported identity fields; combined-name fields use first and last name; API-prefilled values are read-only and submitted; absent or blank values remain editable.

- [ ] **Step 4: Verify public terminology**

Search `docs-src` for legacy package imports and internal terms:

```bash
rg -n "commerce-hub-connect-sdk|AccountMapper|VaultService|bsbCode.*bankCode|console.debug" docs-src
```

Expected: no legacy package import and no internal implementation details.

### Task 2: Reconcile the runtime OpenAPI document

**Files:**
- Modify: `swagger.json`

- [ ] **Step 1: Add or update public paths**

Represent these runtime contracts:

```text
POST /interaction/source/v2/ach?currencyCode={currencyCode}
GET  /interaction/source/pbb/session
PUT  /interaction/source/pbb/session/{pToken}
```

Document the public request headers used by source creation and PBB session operations, without describing SDK implementation logic.

- [ ] **Step 2: Add current public schemas**

Add/update `Account`, `EntityData`, `SessionData`, and `InteractionResponse` so the schema exposes current request fields, `entityData`, and `SessionData.configId`.

- [ ] **Step 3: Remove the obsolete PBB finalization path**

Remove:

```text
/interaction/source/pbb/session/{aldSessionId}/{pToken}
```

and retain the current `{pToken}` finalization contract.

- [ ] **Step 4: Validate the JSON contract**

Run a Node assertion that parses `swagger.json` and verifies the three current paths, absence of the obsolete path, `SessionData.configId`, and `InteractionResponse.entityData`.

### Task 3: Regenerate public API types

**Files:**
- Modify: `src/generated/openapi.ts`

- [ ] **Step 1: Regenerate clients**

Run:

```bash
npm run generate:client
```

- [ ] **Step 2: Review generated changes**

Confirm generated runtime types include the v2 ACH request, current PBB paths, `EntityData`, and `SessionData.configId`. Confirm merchant and configuration generated files have no unrelated semantic changes.

- [ ] **Step 3: Build**

Run:

```bash
npm run build
```

Expected: TypeScript build exits successfully.

### Task 4: Generate and validate the customer documentation site

**Files:**
- Modify generated files under: `docs/`

- [ ] **Step 1: Generate documentation**

Run:

```bash
npm run docs
```

- [ ] **Step 2: Inspect generated pages**

Confirm generated install, home, flow, framework examples, and API pages contain scoped package examples and the public v0.12.4 behavior, with no internal compatibility details.

- [ ] **Step 3: Run repository checks**

Run:

```bash
npm run check:localization
npm run test:proxy-auth
NPM_CONFIG_CACHE=/tmp/chc-sdk-docs-npm-cache npm run test:package-surface
npm run lint
```

Expected: all checks pass, allowing only explicitly identified pre-existing warnings.

### Task 5: Commit and hand off

**Files:**
- Commit all approved documentation, Swagger, regenerated type, and generated-site changes.

- [ ] **Step 1: Review scope**

Run `git diff --check`, review `git diff --stat`, and confirm no package publication, release creation, or unrelated files are included.

- [ ] **Step 2: Commit**

```bash
git add docs-src docs swagger.json src/generated/openapi.ts
git commit -m "docs: refresh v0.12.4 consumer API guidance"
```

- [ ] **Step 3: Report verification and branch**

Provide the branch name, commit SHA, validation results, and any API-contract assumptions requiring API-team confirmation. Do not push or publish unless explicitly requested.
