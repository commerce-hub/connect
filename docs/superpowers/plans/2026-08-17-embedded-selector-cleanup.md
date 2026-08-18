# Embedded Selector Cleanup Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Commit the embedded selector feature and refreshed integration guide while preserving sensitive CERT values and experimental selector behavior only as local uncommitted changes.

**Architecture:** Treat the Git index as the approved release candidate and the working tree as the superset containing local experiments. Update the Markdown guide and generated PDF normally, then stage source/test hunks selectively and audit the staged tree independently before committing.

**Tech Stack:** TypeScript, Lit, `@web/test-runner`, Mocha/Chai, Markdown, Pandoc, Typst, Git partial staging

---

## File Structure

- Modify `docs-src/examples/embedded.md`: document the two supported selector modes and host integration.
- Rename/regenerate `docs-src/examples/CHC-Wallet-Embed-Integration-Guide.pdf`: generated copy of the Markdown guide.
- Selectively stage `src/commerce-hub-connect.ts`: commit selector-mode behavior but exclude experimental eligibility/deduplication/limit changes and CERT secrets.
- Stage `src/internal/styles.ts`: commit selector-mode and loading styles.
- Stage `src/internal/types.ts`: commit selector mode, actions, and `isDefault` typing.
- Selectively stage `src/test/commerce-hub-connect-payment-selection_test.ts`: commit stable selector tests but exclude experimental verified-pending, deduplication, and five-item-limit assertions.
- Selectively stage `src/test/commerce-hub-connect-flow_test.ts`: exclude real CERT credentials and retain QA-default expectations in the committed tree.

### Task 1: Update and Regenerate the Embedded Integration Guide

**Files:**
- Modify: `docs-src/examples/embedded.md`
- Delete: `docs-src/examples/embedded.pdf`
- Create: `docs-src/examples/CHC-Wallet-Embed-Integration-Guide.pdf`

- [ ] **Step 1: Extend the SELECT-only documentation**

Document the default dropdown property assignment:

```ts
wallet.presentationMode = 'embedded';
wallet.embeddedSelectorMode = 'dropdown';
wallet.interactionResponse = interactionResponse;
```

Add an optional radio-list example:

```ts
wallet.embeddedSelectorMode = 'radio-list';
```

Explain that `dropdown` is the default compact native select and `radio-list` renders an SDK-styled trigger and popup. Describe successful attachment, loading feedback, default/native ordering, and the add-payment row only when `ADD_ACCOUNT` is available. Do not document verified-pending eligibility, account-number deduplication, or a five-option limit.

- [ ] **Step 2: Update the Angular example**

Add the property binding:

```html
[embeddedSelectorMode]="'dropdown'"
```

Explain that hosts choosing `radio-list` need enough visible space for the trigger and must allow the popup to overflow without clipping.

- [ ] **Step 3: Regenerate the renamed PDF**

Run:

```bash
pandoc docs-src/examples/embedded.md \
  --pdf-engine=typst \
  -o docs-src/examples/CHC-Wallet-Embed-Integration-Guide.pdf
```

Expected: a non-empty PDF generated from the updated Markdown. Stage deletion of `docs-src/examples/embedded.pdf` so Git records the documentation asset rename/replacement.

- [ ] **Step 4: Verify the guide source and generated artifact**

Run:

```bash
rg -n "embeddedSelectorMode|radio-list|dropdown" docs-src/examples/embedded.md
test -s docs-src/examples/CHC-Wallet-Embed-Integration-Guide.pdf
```

Expected: both selector modes appear in Markdown and the PDF exists with non-zero size.

### Task 2: Stage and Commit Only Approved Selector Changes

**Files:**
- Selectively stage: `src/commerce-hub-connect.ts`
- Stage: `src/internal/styles.ts`
- Stage: `src/internal/types.ts`
- Selectively stage: `src/test/commerce-hub-connect-payment-selection_test.ts`
- Selectively stage: `src/test/commerce-hub-connect-flow_test.ts`
- Stage: `docs-src/examples/embedded.md`
- Stage: `docs-src/examples/embedded.pdf` deletion
- Stage: `docs-src/examples/CHC-Wallet-Embed-Integration-Guide.pdf`

- [ ] **Step 1: Build the approved index with partial staging**

Stage complete approved files and documentation:

```bash
git add src/internal/styles.ts src/internal/types.ts \
  docs-src/examples/embedded.md \
  docs-src/examples/embedded.pdf \
  docs-src/examples/CHC-Wallet-Embed-Integration-Guide.pdf
```

Use interactive partial staging for the two source/test files with mixed local-only hunks:

```bash
git add -p src/commerce-hub-connect.ts
git add -p src/test/commerce-hub-connect-payment-selection_test.ts
git add -p src/test/commerce-hub-connect-flow_test.ts
```

Include selector mode, popup, loading UI, add-payment behavior, safe ordering, `isDefault`, and QA expectations. Exclude:

- `Verified, Pending` inclusion and relaxed attach eligibility.
- `embeddedPaymentSourceNumberKey`, its call sites, and option deduplication.
- `.slice(0, 5)` and its limit test.
- Real CERT API key/config ID and their exact test assertions.
- CERT as the default Pay-by-Bank environment or default Payment SDK URL.

When a hunk mixes approved and excluded changes, use the patch editor to stage only the approved lines.

- [ ] **Step 2: Audit the staged diff for forbidden content**

Run:

```bash
git diff --cached --check
git diff --cached --stat
git diff --cached | rg -n "GhTk3|cfad67|Verified, Pending|embeddedPaymentSourceNumberKey|slice\(0, 5\)|connect-cert"
```

Expected: the first two commands succeed; the final search returns no matches. Inspect `git diff --cached` completely and confirm committed defaults remain QA.

- [ ] **Step 3: Verify local-only changes remain unstaged**

Run:

```bash
git diff | rg -n "GhTk3|cfad67|Verified, Pending|embeddedPaymentSourceNumberKey|slice\(0, 5\)|connect-cert"
```

Expected: the local-only experiment and real CERT test values still appear in the unstaged working-tree diff.

- [ ] **Step 4: Run source verification**

Run:

```bash
npm run lint
npm run build
BROWSERS=chromium npm run test:dev -- --files src/test/commerce-hub-connect-payment-selection_test.ts
BROWSERS=chromium npm run test:dev -- --files src/test/commerce-hub-connect-flow_test.ts
```

Expected: all commands exit 0. These runs validate the current working tree; the staged audit remains authoritative for commit contents.

- [ ] **Step 5: Commit the approved feature**

Run:

```bash
git commit -m "Add configurable embedded payment selector"
```

Expected: the commit contains only the staged selector feature and documentation. The experimental behaviors and CERT values remain visible under `git status` as unstaged modifications.

- [ ] **Step 6: Inspect the committed tree and remaining local diff**

Run:

```bash
git show --check --stat --oneline HEAD
git show HEAD | rg -n "GhTk3|cfad67|Verified, Pending|embeddedPaymentSourceNumberKey|slice\(0, 5\)|connect-cert"
git status --short
```

Expected: the forbidden-content search returns no matches, while `git status` still reports local-only source/test changes.

### Task 3: Resume Instrument Schema Navigation

**Files:**
- Follow: `docs/superpowers/plans/2026-08-17-instrument-schema-navigation.md`

- [ ] **Step 1: Execute the existing test-first plan**

Use the already approved instrument-schema plan. Preserve all remaining local-only selector changes while modifying and committing only the instrument-schema navigation behavior and its regression tests.
