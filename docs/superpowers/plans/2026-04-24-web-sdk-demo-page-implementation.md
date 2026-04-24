# Web SDK Demo Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a rich standalone demo page at `projects/commerce-hub-connect-web-sdk/example/index.html` that loads the built web SDK bundle and exercises the real `window.CommerceHubConnectWebSdk.mount(target, options, environment?)` API.

**Architecture:** Keep the demo as a single HTML file with inline CSS and inline JavaScript. The page will own its own form defaults, option serialization, SDK instance lifecycle, action logging, and copyable integration snippet, while referencing the already-built `../dist/CommerceHubConnectSDK.js` bundle directly.

**Tech Stack:** Static HTML, inline CSS, inline browser JavaScript, existing web SDK bundle output.

---

### Task 1: Build The Standalone Sandbox Page

**Files:**
- Create: `projects/commerce-hub-connect-web-sdk/example/index.html`

- [ ] **Step 1: Write the demo file first with the required static structure**

Create a page that contains:

- a `<script src="../dist/CommerceHubConnectSDK.js"></script>` tag
- a left-side control panel form
- a right-side widget mount container
- an event log area
- a generated snippet area
- action buttons for `Mount`, `Update`, `Destroy`, `Reset Defaults`, and `Copy Config`

- [ ] **Step 2: Verify the file shape is present**

Run:

```bash
rg -n "CommerceHubConnectSDK.js|Mount|Update|Destroy|Copy Config|payment-container" projects/commerce-hub-connect-web-sdk/example/index.html
```

Expected:

- the example file exists
- it references `../dist/CommerceHubConnectSDK.js`
- the expected controls and mount container are present

- [ ] **Step 3: Implement the inline page behavior**

The page script must:

- define working default values
- serialize form values into:

```js
{
  configuration: { ... },
  whiteLabel: { ... }
}
```

- keep `environment` as the last `mount(...)` argument
- hold a single mutable SDK instance reference
- implement `mount`, `update`, `destroy`, `reset`, and `copyConfig` handlers
- log sandbox actions and SDK callbacks with timestamps
- disable `Update` and `Destroy` until an instance exists

- [ ] **Step 4: Re-run the static verification**

Run:

```bash
rg -n "CommerceHubConnectWebSdk.mount|instance.update|instance.destroy|navigator.clipboard|onSuccess|onError" projects/commerce-hub-connect-web-sdk/example/index.html
```

Expected:

- the page uses the real browser namespace
- it wires update and destroy behavior
- it contains callback logging and copy-config support

### Task 2: Document The Example And Verify The Bundle Still Works

**Files:**
- Modify: `projects/commerce-hub-connect-web-sdk/README.md`
- Modify: `docs/Web-SDK-Integration.md`

- [ ] **Step 1: Update docs to mention the sandbox page**

Add short references to:

- `projects/commerce-hub-connect-web-sdk/example/index.html`
- the fact that it loads `../dist/CommerceHubConnectSDK.js`
- the fact that it acts as a richer sandbox than the minimal documentation snippet

- [ ] **Step 2: Verify the web SDK still builds**

Run:

```bash
npx ng build commerce-hub-connect-web-sdk-widget
npm run build:web-sdk-widget
```

Expected:

- the Angular web SDK app build passes
- the packaged `CommerceHubConnectSDK.js` bundle is regenerated successfully

- [ ] **Step 3: Verify the example points at the built bundle and docs mention it**

Run:

```bash
rg -n "../dist/CommerceHubConnectSDK.js" projects/commerce-hub-connect-web-sdk/example/index.html
rg -n "example/index.html" projects/commerce-hub-connect-web-sdk/README.md docs/Web-SDK-Integration.md
```

Expected:

- the example loads the built bundle using the correct relative path
- both docs mention the example page
