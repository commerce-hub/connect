# Compact Empty Payment List Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Render no-saved-payment tenders as one compact equal-weight list and allow source-action subtitles to wrap at every viewport width.

**Architecture:** Keep `renderSourceAction` as the shared semantic button primitive, adding one decorative chevron to its non-link variant. Scope compact container/row styling through `.payment-action-links`; global subtitle wrapping applies to all source-action variants without changing actions or data flow.

**Tech Stack:** Lit 3 templates, CSS, TypeScript 5.9, Mocha/Chai, Web Test Runner.

---

### Task 1: Specify compact-list structure and subtitle wrapping

**Files:**
- Modify: `src/test/commerce-hub-connect-primitives_test.ts:196-210`
- Modify: `src/test/commerce-hub-connect-primitives_test.ts:1125-1225`

- [ ] **Step 1: Replace the narrow-only wrapping assertion**

Replace `test('allows source action subtitles to wrap on narrow hosts', ...)` with:

```ts
test('allows source action subtitles to wrap at every viewport width', () => {
  assert.include(
    primitiveStyles.cssText,
    '.source-action-subtitle {\n    overflow: visible;'
  );
  assert.include(
    primitiveStyles.cssText,
    'line-height: 1.35;\n    text-overflow: clip;\n    white-space: normal;'
  );
});
```

- [ ] **Step 2: Update the empty-screen primitive assertions**

Replace dashed-border expectations with compact-list assertions:

```ts
const paymentActionLinks = emptyScreen.querySelector<HTMLElement>(
  '.payment-action-links'
)!;
assert.equal(getComputedStyle(paymentActionLinks).borderStyle, 'solid');
assert.equal(
  getComputedStyle(paymentActionLinks).backgroundColor,
  'rgb(255, 255, 255)'
);
assert.equal(getComputedStyle(paymentActionLinks).rowGap, '0px');

assert.equal(getComputedStyle(emptySourceActions[0]).borderStyle, 'none');
assert.equal(getComputedStyle(emptySourceActions[0]).borderRadius, '0px');
assert.equal(
  getComputedStyle(emptySourceActions[1]).borderTopStyle,
  'solid'
);
assert.equal(getComputedStyle(emptySourceActions[0]).minHeight, '64px');

for (const button of emptySourceActions) {
  const chevron = button.querySelector<HTMLElement>(
    '.source-action-chevron[aria-hidden="true"]'
  );
  assert.exists(chevron);
}
assert.notExists(emptyScreen.querySelector('.source-action-link-chevron'));
```

In the existing disabled/link primitive test, add:

```ts
assert.exists(
  root.querySelector(
    '[data-action="add-bank-account"] .source-action-chevron'
  )
);
assert.notExists(
  root.querySelector('[data-action="add-card"] .source-action-chevron')
);
assert.exists(
  root.querySelector('[data-action="add-card"] .source-action-link-chevron')
);
```

- [ ] **Step 3: Build and run the focused test to verify RED**

```bash
npm run build
BROWSERS=chromium npx wtr test/commerce-hub-connect-primitives_test.js
```

Expected: browser assertions fail because rows are still independently dashed and non-link actions have no chevron. If Playwright remains unavailable, record the launch block; the new expectations must still compile before implementation.

### Task 2: Implement the compact list and chevron

**Files:**
- Modify: `src/internal/primitives.ts:1028-1065`
- Modify: `src/internal/styles.ts:691-696`
- Modify: `src/internal/styles.ts:2285-2470`
- Modify: `src/internal/styles.ts:3210-3228`

- [ ] **Step 1: Add the decorative non-link chevron**

Append this after `.source-action-copy` in the non-link template only:

```ts
<span class="source-action-chevron" aria-hidden="true">
  <span class="source-action-chevron-icon"></span>
</span>
```

- [ ] **Step 2: Style the compact list container**

Replace `.payment-action-links` with:

```css
.payment-action-links {
  display: grid;
  gap: 0;
  margin-top: 0;
  overflow: hidden;
  border: 0.0625rem solid var(--chc-border);
  border-radius: var(--chc-radius-card);
  background: #fff;
  justify-items: stretch;
}
```

- [ ] **Step 3: Add scoped compact-row styles after the generic source-action rules**

```css
.payment-action-links .source-action {
  min-height: 4rem;
  grid-template-columns: auto minmax(0, 1fr) 1rem;
  gap: 0.75rem;
  border: 0;
  border-radius: 0;
  padding: 0.75rem 1rem;
  background: #fff;
  box-shadow: none;
}

.payment-action-links .source-action-branded {
  grid-template-columns: 5rem minmax(0, 1fr) 1rem;
}

.payment-action-links .source-action + .source-action {
  border-top: 0.0625rem solid var(--chc-border);
}

.payment-action-links .source-action:hover:not(:disabled),
.payment-action-links .source-action:focus-visible {
  border-color: var(--chc-border);
  border-style: solid;
  background: color-mix(in srgb, var(--chc-soft-surface) 70%, #fff);
  box-shadow: none;
}

.payment-action-links .source-action:focus-visible {
  position: relative;
  z-index: 1;
  outline-offset: -0.125rem;
}
```

- [ ] **Step 4: Make subtitle wrapping global**

Replace `.source-action-subtitle` with:

```css
.source-action-subtitle {
  overflow: visible;
  color: var(--chc-muted);
  font-weight: inherit;
  font-size: 0.875em;
  line-height: 1.35;
  text-overflow: clip;
  white-space: normal;
  overflow-wrap: anywhere;
}
```

Remove `.source-action-subtitle` from the mobile `white-space: normal` selector group and delete its now-redundant mobile overflow/text-overflow rule.

- [ ] **Step 5: Style the new chevron**

```css
.source-action-chevron {
  width: 1rem;
  height: 1rem;
  display: inline-grid;
  place-items: center;
  color: var(--chc-muted);
  justify-self: end;
}

.source-action-chevron-icon::before {
  content: '';
  width: 0.375rem;
  height: 0.375rem;
  display: block;
  border-top: 0.09375rem solid currentColor;
  border-right: 0.09375rem solid currentColor;
  transform: rotate(45deg);
}
```

- [ ] **Step 6: Verify GREEN and commit**

```bash
npm run build
BROWSERS=chromium npx wtr test/commerce-hub-connect-primitives_test.js
npm run lint
git diff --check
git add src/internal/primitives.ts src/internal/styles.ts src/test/commerce-hub-connect-primitives_test.ts
git commit -m "style: compact empty payment tender list"
```

Expected: build and lint pass; focused browser tests pass when Playwright is available. Report a missing-browser launch as an environment block rather than a test pass.

### Task 3: Regression verification

**Files:**
- Verify: `src/internal/primitives.ts`
- Verify: `src/internal/styles.ts`
- Verify: `src/test/commerce-hub-connect-primitives_test.ts`

- [ ] **Step 1: Run focused flow and primitive suites**

```bash
npm run build
BROWSERS=chromium npx wtr \
  test/commerce-hub-connect-primitives_test.js \
  test/commerce-hub-connect-flow_test.js
```

- [ ] **Step 2: Run full non-browser and project checks**

```bash
npm run lint
NPM_CONFIG_CACHE=/tmp/commercehub-connect-wallet-sdk-npm-cache npm test
```

Expected: proxy-auth and package-surface tests pass; browser suites pass only when Playwright browsers are installed.

- [ ] **Step 3: Inspect final state**

```bash
git diff HEAD~1 --check
git status --short --branch
```

Expected: no whitespace errors and a clean `feature/ui-changes` worktree.
