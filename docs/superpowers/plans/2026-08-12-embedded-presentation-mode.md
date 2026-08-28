# Embedded Presentation Mode Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a backward-compatible `dialog`/`embedded` presentation API whose embedded layout responds to its parent container and scrolls internally only when the host constrains its height.

**Architecture:** The public Lit element owns a reflected `presentation-mode` property and passes the resolved mode to the shared shell renderer. Dialog selectors retain existing viewport sizing; embedded selectors use full parent width, optional full parent height, and container queries while keeping the central content as the scroll region.

**Tech Stack:** TypeScript 5.9, Lit 3, CSS container queries, Open WC, Web Test Runner

---

### Task 1: Add the public presentation API

**Files:**
- Modify: `src/commerce-hub-connect.ts:661-690,1126-1144`
- Modify: `src/internal/types.ts`
- Modify: `src/internal/primitives.ts:1288-1370`
- Test: `src/test/commerce-hub-connect-primitives_test.ts`

- [ ] **Step 1: Write the failing public API test**

Add a test that creates the element, verifies `presentationMode === 'dialog'`, sets the attribute to `embedded`, waits for `updateComplete`, and asserts both the property and `.widget-shell-embedded` class. Then set the property back to `dialog` and assert the reflected attribute and `.widget-shell-dialog` class.

```ts
test('defaults to dialog presentation and reflects embedded presentation', async () => {
  const el = (await fixture(
    testingHtml`<commerce-hub-connect
      .interactionResponse=${createStyleInteractionResponse()}
    ></commerce-hub-connect>`
  )) as CommerceHubConnect;

  assert.equal(el.presentationMode, 'dialog');
  assert.isTrue(el.shadowRoot!.querySelector('.widget-shell')!.classList.contains('widget-shell-dialog'));

  el.setAttribute('presentation-mode', 'embedded');
  await el.updateComplete;
  assert.equal(el.presentationMode, 'embedded');
  assert.isTrue(el.shadowRoot!.querySelector('.widget-shell')!.classList.contains('widget-shell-embedded'));

  el.presentationMode = 'dialog';
  await el.updateComplete;
  assert.equal(el.getAttribute('presentation-mode'), 'dialog');
});
```

- [ ] **Step 2: Run the focused test and verify RED**

Run `npm run build && BROWSERS=chromium npm run test:dev -- --files test/commerce-hub-connect-primitives_test.js`.

Expected: TypeScript fails because `presentationMode` does not exist, or the assertion fails because no mode class is rendered.

- [ ] **Step 3: Implement the type, property, and shell class**

Export this type from `src/commerce-hub-connect.ts`:

```ts
export type CommerceHubPresentationMode = 'dialog' | 'embedded';
```

Add the public property:

```ts
@property({attribute: 'presentation-mode', reflect: true})
presentationMode: CommerceHubPresentationMode = 'dialog';
```

Add `presentationMode?: CommerceHubPresentationMode` to `WidgetShellOptions`, default it to `dialog` in `renderWidgetShell`, and add:

```ts
presentationMode === 'dialog' && 'widget-shell-dialog',
presentationMode === 'embedded' && 'widget-shell-embedded',
```

Pass `presentationMode: this.presentationMode` from the component's shell wrapper.

- [ ] **Step 4: Rebuild and rerun the focused test**

Run the command from Step 2. Expected: PASS.

- [ ] **Step 5: Commit SDK API changes**

```bash
git add src/commerce-hub-connect.ts src/internal/types.ts src/internal/primitives.ts src/test/commerce-hub-connect-primitives_test.ts
git commit -m "feat: add wallet presentation mode"
```

If local Git remains blocked by Xcode tooling, leave SDK changes uncommitted and report it.

### Task 2: Make embedded mode parent-responsive

**Files:**
- Modify: `src/internal/styles.ts:1-120,3220-3335`
- Test: `src/test/commerce-hub-connect-primitives_test.ts:1340-1370`

- [ ] **Step 1: Write failing CSS contract assertions**

Assert the stylesheet contains `container-type: inline-size`, `.widget-shell-embedded`, `width: 100%`, `height: 100%`, `min-height: 0`, `box-shadow: none`, and `@container (max-width: 26.25rem)`. Also retain assertions for dialog `100vw`, `100dvh`, and shadow declarations.

- [ ] **Step 2: Run the focused test and verify RED**

Run the Task 1 focused test command. Expected: FAIL because embedded/container rules are absent.

- [ ] **Step 3: Split base, dialog, and embedded sizing**

Set `container-type: inline-size` on `:host`. Move current width, height, minimum height, and shadow to `.widget-shell-dialog`. Add:

```css
.widget-shell-embedded {
  width: 100%;
  height: auto;
  min-height: 0;
  box-shadow: none;
}

:host([presentation-mode='embedded']) {
  width: 100%;
  max-width: 100%;
  min-width: 0;
}

:host([presentation-mode='embedded'][style*='height']) .widget-shell-embedded {
  height: 100%;
}
```

Do not depend solely on the inline-style selector: ensure the element and shell can inherit a definite host height through `height: 100%` without imposing height when the host is auto-sized. Validate the final computed behavior with the next test step and adjust the selector to the smallest reliable CSS contract.

- [ ] **Step 4: Add embedded container-query equivalents**

Scope existing viewport narrow rules to `.widget-shell-dialog`. Add an `@container (max-width: 26.25rem)` block for embedded form grid, payment footer, header/toolbars, row padding/wrapping, and sheet sizing. Keep `.widget-content { min-height: 0; overflow: auto; }` so definite host height pins header/footer.

- [ ] **Step 5: Verify computed natural and bounded layouts**

Add one fixture in an unconstrained `width: 360px` wrapper and assert embedded shell width matches the wrapper and height is content-driven. Add a second fixture with wrapper and custom element `height: 420px`; assert shell height is `420px` and content `overflowY` is `auto`.

- [ ] **Step 6: Run focused tests and build**

Run `npm run build`, the focused primitive test, and `npm run lint`. Expected: all exit 0; existing analyzer warnings may remain.

- [ ] **Step 7: Commit responsive SDK behavior**

```bash
git add src/internal/styles.ts src/test/commerce-hub-connect-primitives_test.ts
git commit -m "feat: make embedded wallet parent responsive"
```

### Task 3: Document integration modes

**Files:**
- Modify: `README.md:220-340`
- Modify: `docs-src/examples/angular.md`
- Modify: `docs-src/examples/plain-javascript.md`
- Test: `dev/package-surface_test.js`

- [ ] **Step 1: Add failing package/documentation checks**

Assert package types expose `CommerceHubPresentationMode` and documentation contains `presentationMode = 'embedded'`, `[presentationMode]="'embedded'"`, a natural-height example, and a bounded-height example.

- [ ] **Step 2: Run checks and verify RED**

Run `npm run build && node --test dev/package-surface_test.js`. Expected: FAIL on the missing presentation export or examples.

- [ ] **Step 3: Add exact usage documentation**

Document dialog as default and include:

```css
.wallet-host commerce-hub-connect { width: 100%; }
.wallet-host--bounded { height: min(36rem, calc(100dvh - 8rem)); }
.wallet-host--bounded commerce-hub-connect { width: 100%; height: 100%; }
```

Explain that the SDK supplies no embedded maximum height and that bounded hosts get pinned header/footer with content scrolling.

- [ ] **Step 4: Run SDK verification**

Run `npm run lint`, `npm run build`, `node --test dev/package-surface_test.js`, and `BROWSERS=chromium npm run test:dev`. Expected: all runnable checks pass. If browsers remain unavailable, report that environment blocker separately without claiming the browser suite passed.

- [ ] **Step 5: Commit SDK docs and tests**

```bash
git add README.md docs-src/examples/angular.md docs-src/examples/plain-javascript.md dev/package-surface_test.js docs/superpowers/specs/2026-08-12-embedded-presentation-mode-design.md docs/superpowers/plans/2026-08-12-embedded-presentation-mode.md
git commit -m "docs: describe embedded wallet integration"
```
