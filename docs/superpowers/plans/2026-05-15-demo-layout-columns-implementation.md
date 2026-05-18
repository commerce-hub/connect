# Demo Layout Columns Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reorder the static demo so create-interaction and design-config controls live in the first column, design config starts collapsed, and the create button sits at the bottom after design config.

**Architecture:** Keep the implementation inside `dev/index.html`. Use a semantic `<details>` wrapper for the design-config card so the form fields and JSON preview collapse together without adding new JS state. Drive the structure change from the existing static demo-host HTML test.

**Tech Stack:** Static HTML, inline CSS, inline browser JavaScript, TypeScript test source compiled to Web Test Runner JS.

---

### Task 1: Lock The New Demo Structure With A Failing Test

**Files:**
- Modify: `src/test/demo-host_test.ts`
- Test: `test/demo-host_test.js`

- [ ] **Step 1: Add a failing structure assertion**

Extend the existing demo-host test so it asserts:

```ts
const payloadPanelIndex = html.indexOf('<section class="payload-panel"');
const widgetPanelIndex = html.indexOf('<section class="demo-widget-panel"');
const designConfigIndex = html.indexOf('id="design-config-card"');
const actionRowIndex = html.indexOf('id="create-interaction-actions"');

assert.isBelow(
  payloadPanelIndex,
  widgetPanelIndex,
  'expected create interaction and design config to appear in the first column'
);
assert.include(html, '<details class="payload-card" id="design-config-card">');
assert.notInclude(html, '<details class="payload-card" id="design-config-card" open');
assert.include(html, 'id="create-interaction-actions"');
assert.isBelow(
  designConfigIndex,
  actionRowIndex,
  'expected the create interaction action row after the design config section'
);
assert.include(html, 'form="interaction-create-form"');
```

- [ ] **Step 2: Compile the updated test source**

Run:

```bash
npm run build
```

Expected:

- `test/demo-host_test.js` is regenerated from `src/test/demo-host_test.ts`

- [ ] **Step 3: Run the focused test to verify it fails**

Run:

```bash
BROWSERS=chromium npx wtr --files ./test/demo-host_test.js
```

Expected:

- the demo-host test fails because the page still has the old column order and non-collapsible design-config card

### Task 2: Update The Demo Markup And Styles

**Files:**
- Modify: `dev/index.html`

- [ ] **Step 1: Reorder the main columns**

Move the payload panel section before the widget panel section in `main.demo-layout` so the host-input content is the first column.

- [ ] **Step 2: Make design config collapsible**

Replace the static design-config article with a native collapsed details card:

```html
<details class="payload-card" id="design-config-card">
  <summary>
    <h2>Design config</h2>
  </summary>
  <div class="form-body" id="design-config-form">
    ...
    <pre id="design-config-preview" class="request-preview"></pre>
  </div>
</details>
```

Do not add the `open` attribute.

- [ ] **Step 3: Move the create button to the bottom**

Remove the submit button from inside the create form and add a final bottom action row after design config:

```html
<div class="form-actions" id="create-interaction-actions">
  <button
    class="primary-button"
    id="create-interaction-button"
    type="submit"
    form="interaction-create-form"
  >
    Create interaction
  </button>
</div>
```

- [ ] **Step 4: Add the minimal CSS for the collapsed card header**

Style the details summary so it reads like the other card headers and remove the default marker as needed for the current visual language.

### Task 3: Verify The Demo

**Files:**
- Test: `test/demo-host_test.js`

- [ ] **Step 1: Rebuild after the HTML/test changes**

Run:

```bash
npm run build
```

Expected:

- build completes successfully

- [ ] **Step 2: Re-run the focused demo-host test**

Run:

```bash
BROWSERS=chromium npx wtr --files ./test/demo-host_test.js
```

Expected:

- the focused demo-host test passes
