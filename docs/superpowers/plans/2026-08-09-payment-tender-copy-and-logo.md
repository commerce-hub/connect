# Payment Tender Copy and Logo Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Use the approved card and manual-bank titles in both payment-method launchers and replace only the USA empty-state manual-bank artwork.

**Architecture:** Keep the existing regional tender resolver as the single source of tender titles and brand-image selection. Change the shared default empty-state card copy, the fixed USA manual tender title, and regenerate the existing embedded image module through its optimizer without changing either launcher layout or the bottom-sheet SVG icons.

**Tech Stack:** TypeScript, Lit, Open WC/Web Test Runner, Node.js, macOS `sips`

---

### Task 1: Lock the approved tender copy in tests

**Files:**
- Modify: `src/test/add-payment-tenders_test.ts:47`
- Modify: `src/test/commerce-hub-connect-flow_test.ts:1749`
- Modify: `src/test/commerce-hub-connect-flow_test.ts:2069`
- Modify: `src/test/commerce-hub-connect-payment-selection_test.ts:2018`

- [ ] **Step 1: Update the USA resolver expectation**

Change the manual USA tender expectation to the exact approved title:

```ts
{
  action: 'add-ach-manually',
  title: 'Manual bank details',
  subtitle: 'Add your account details manually',
  icon: 'bank',
  branded: true,
}
```

- [ ] **Step 2: Update the bottom-sheet flow expectation**

Use these exact titles while retaining the existing action and SVG-path assertions:

```ts
[
  'Credit or debit card',
  'Pay by Bank',
  'Manual bank details',
]
```

- [ ] **Step 3: Update the USA empty-state flow expectation**

Change only the manual tender title in the expected model:

```ts
{
  action: 'add-ach-manually',
  title: 'Manual bank details',
  subtitle: 'Add your account details manually',
}
```

- [ ] **Step 4: Update the non-USA default empty-state expectation**

Change the default card item to:

```ts
{
  action: 'add-card',
  title: 'Credit or debit card',
  subtitle: 'Add your card details',
}
```

- [ ] **Step 5: Run the focused browser tests to verify they fail on old copy**

Run:

```bash
npm run test:dev -- --files src/test/add-payment-tenders_test.ts src/test/commerce-hub-connect-flow_test.ts src/test/commerce-hub-connect-payment-selection_test.ts
```

Expected: FAIL because runtime output still contains `Manual Bank Link` and `Add credit or debit card`. If Playwright cannot launch because its browser executable is absent, record that environment limitation and continue with build/static verification.

- [ ] **Step 6: Commit the failing expectations**

```bash
git add src/test/add-payment-tenders_test.ts src/test/commerce-hub-connect-flow_test.ts src/test/commerce-hub-connect-payment-selection_test.ts
git commit -m "test: update payment tender copy expectations"
```

### Task 2: Implement the approved tender copy

**Files:**
- Modify: `src/internal/add-payment-tenders.ts:63`
- Modify: `src/commerce-hub-connect.ts:7039`

- [ ] **Step 1: Rename the fixed USA manual tender**

In `resolveAddPaymentTenders`, use:

```ts
{
  action: 'add-ach-manually',
  title: 'Manual bank details',
  subtitle: 'Add your account details manually',
  icon: 'bank',
  brandImage: MANUAL_BANK_SOURCE_ACTION_BRAND_IMAGE,
}
```

- [ ] **Step 2: Rename the default empty-state card tender**

In `resolveNoSavedPaymentMethodsCopy`, use:

```ts
addCardTitle: copy?.addCardTitle ?? 'Credit or debit card',
```

Keep merchant-provided copy overrides and non-USA bank copy unchanged.

- [ ] **Step 3: Run the focused browser tests**

Run:

```bash
npm run test:dev -- --files src/test/add-payment-tenders_test.ts src/test/commerce-hub-connect-flow_test.ts src/test/commerce-hub-connect-payment-selection_test.ts
```

Expected: PASS. If Playwright browser installation blocks execution, confirm the TypeScript build in Task 4 and report the blocker rather than treating the browser suite as passed.

- [ ] **Step 4: Scan runtime source for retired defaults**

Run:

```bash
rg -n "Add credit or debit card|Manual Bank Link" src --glob '!src/test/**'
```

Expected: no matches.

- [ ] **Step 5: Commit the implementation**

```bash
git add src/internal/add-payment-tenders.ts src/commerce-hub-connect.ts
git commit -m "feat: standardize payment tender titles"
```

### Task 3: Replace the empty-state manual-bank artwork

**Files:**
- Modify: `src/internal/source-action-brand-images.ts`

- [ ] **Step 1: Preserve the current generated constants for comparison**

Run:

```bash
git show HEAD:src/internal/source-action-brand-images.ts > /tmp/source-action-brand-images-before.ts
```

Expected: `/tmp/source-action-brand-images-before.ts` contains the three current JPEG data-URL constants.

- [ ] **Step 2: Regenerate all constants through the existing deterministic workflow**

Run:

```bash
node scripts/generate-source-action-brand-images.cjs \
  /Users/unnikrishnan.b/Downloads/card_logo.jpg \
  /Users/unnikrishnan.b/Downloads/pbb_fiserv_logo.jpeg \
  /Users/unnikrishnan.b/Downloads/manual_ach_logo.jpeg
```

Expected: `src/internal/source-action-brand-images.ts` is regenerated with three `data:image/jpeg;base64,` constants.

- [ ] **Step 3: Verify image identity, format, and size**

Run:

```bash
node - <<'NODE'
const fs = require('node:fs');
const parse = (path) => Object.fromEntries(
  [...fs.readFileSync(path, 'utf8').matchAll(/export const (\w+) =\n  '([^']+)'/g)]
    .map(([, name, value]) => [name, value])
);
const before = parse('/tmp/source-action-brand-images-before.ts');
const after = parse('src/internal/source-action-brand-images.ts');
for (const name of ['CARD_SOURCE_ACTION_BRAND_IMAGE', 'PAY_BY_BANK_SOURCE_ACTION_BRAND_IMAGE']) {
  if (before[name] !== after[name]) throw new Error(`${name} changed unexpectedly`);
}
const name = 'MANUAL_BANK_SOURCE_ACTION_BRAND_IMAGE';
if (before[name] === after[name]) throw new Error(`${name} did not change`);
if (!after[name].startsWith('data:image/jpeg;base64,')) throw new Error('manual image is not a JPEG data URL');
const bytes = Buffer.from(after[name].split(',')[1], 'base64');
if (bytes.length >= 50 * 1024) throw new Error(`manual image is ${bytes.length} bytes`);
if (bytes[0] !== 0xff || bytes[1] !== 0xd8) throw new Error('manual image lacks JPEG signature');
console.log(`manual image verified: ${bytes.length} bytes`);
NODE
```

Expected: `manual image verified: <size> bytes`, with size below 51,200 bytes. Card and Pay by Bank data URLs remain byte-for-byte unchanged; only the manual image changes.

- [ ] **Step 4: Confirm the bottom-sheet icon implementation is untouched**

Run:

```bash
git diff -- src/internal/source-action-brand-images.ts src/internal/add-payment-tenders.ts src/commerce-hub-connect.ts
```

Expected: no bottom-sheet template, CSS, or SVG path changes; the generated module changes only the manual constant.

- [ ] **Step 5: Commit the regenerated artwork**

```bash
git add src/internal/source-action-brand-images.ts
git commit -m "feat: update manual bank tender artwork"
```

### Task 4: Verify the complete change

**Files:**
- Verify: `src/internal/add-payment-tenders.ts`
- Verify: `src/internal/source-action-brand-images.ts`
- Verify: `src/commerce-hub-connect.ts`
- Verify: `src/test/add-payment-tenders_test.ts`
- Verify: `src/test/commerce-hub-connect-flow_test.ts`
- Verify: `src/test/commerce-hub-connect-payment-selection_test.ts`

- [ ] **Step 1: Build and lint**

Run:

```bash
npm run build
npm run lint
```

Expected: both commands exit 0.

- [ ] **Step 2: Run non-browser package checks**

Run:

```bash
NPM_CONFIG_CACHE=/tmp/commercehub-connect-wallet-sdk-npm-cache npm run test:proxy-auth
NPM_CONFIG_CACHE=/tmp/commercehub-connect-wallet-sdk-npm-cache npm run test:package-surface
```

Expected: both commands exit 0.

- [ ] **Step 3: Attempt the complete browser suite**

Run:

```bash
npm run test:dev
```

Expected: PASS when Playwright Chromium is installed. Otherwise, capture and report the missing-browser executable error as an environment block.

- [ ] **Step 4: Review the final diff and scope**

Run:

```bash
git status --short
git diff HEAD~3 --stat
git diff HEAD~3 -- src/internal/add-payment-tenders.ts src/commerce-hub-connect.ts src/test/add-payment-tenders_test.ts src/test/commerce-hub-connect-flow_test.ts src/test/commerce-hub-connect-payment-selection_test.ts
```

Expected: only approved title expectations/runtime copy and the embedded manual image changed; layouts, regional behavior, subtitles, navigation, and bottom-sheet SVG icons remain unchanged.

