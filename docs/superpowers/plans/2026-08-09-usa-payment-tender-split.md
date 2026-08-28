# USA Payment Tender Split Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Present Card, Pay by Bank, and Manual Bank Link as separate USA add-payment tenders while preserving the existing non-USA bank flow and using the supplied brand images in the no-saved-payment-methods state.

**Architecture:** Introduce one pure resolver that produces ordered add-payment tender models from country, allowed tender types, and existing card/non-USA bank copy. Both the empty state and add-payment sheet consume this model; PBB and manual entry receive distinct flow actions. Optimized raster images are embedded as data URLs so all existing package and CDN build modes remain self-contained.

**Tech Stack:** TypeScript 5.9, Lit 3, CSS, Node.js asset-generation script, macOS `sips`, Mocha/Chai, Web Test Runner with Playwright Chromium.

---

## File map

- Create `scripts/generate-source-action-brand-images.cjs`: one-time deterministic image optimizer/data-URL module generator.
- Create `src/internal/source-action-brand-images.ts`: generated optimized card, PBB, and manual ACH image data URLs.
- Create `src/internal/add-payment-tenders.ts`: pure country-aware ordered tender resolver.
- Create `src/test/add-payment-tenders_test.ts`: focused tender availability/order/copy tests.
- Modify `src/internal/types.ts`: add the PBB flow action, tender model, and optional source-action brand image.
- Modify `src/internal/primitives.ts`: render optional decorative brand images in no-saved tender cards.
- Modify `src/internal/screens/payment-methods-screen.ts`: render resolved tender models instead of rebuilding Card/Bank choices.
- Modify `src/internal/styles.ts`: style branded white-background tender cards and remove obsolete PBB header-action rules.
- Modify `src/commerce-hub-connect.ts`: resolve one tender model, render the bottom sheet from it, route distinct actions, and remove the PBB header fallback.
- Modify `src/test/commerce-hub-connect-primitives_test.ts`: verify brand-image semantics and styling hooks.
- Modify `src/test/commerce-hub-connect-flow_test.ts`: verify both screen variants, navigation, filtering, compatibility, and PBB header cleanup.

### Task 1: Generate and render optimized brand images

**Files:**
- Create: `scripts/generate-source-action-brand-images.cjs`
- Create: `src/internal/source-action-brand-images.ts`
- Modify: `src/internal/types.ts:420-428`
- Modify: `src/internal/primitives.ts:959-1050`
- Modify: `src/internal/styles.ts:2285-2368`
- Test: `src/test/commerce-hub-connect-primitives_test.ts`

- [ ] **Step 1: Write the failing primitive test**

Add a test beside the existing `renderSourceAction` coverage:

```ts
test('renders a decorative brand image without replacing tender copy', async () => {
  const root = await renderHarness(
    renderSourceAction({
      label: 'Pay by Bank',
      subtitle: 'Directly connect with your bank account',
      action: 'add-pay-by-bank',
      icon: 'bank',
      brandImage: 'data:image/jpeg;base64,dGVzdA==',
    })
  );

  const button = root.querySelector<HTMLButtonElement>(
    '[data-action="add-pay-by-bank"]'
  )!;
  const image = button.querySelector<HTMLImageElement>(
    '.source-action-brand-image'
  )!;

  assert.isTrue(button.classList.contains('source-action-branded'));
  assert.equal(image.src, 'data:image/jpeg;base64,dGVzdA==');
  assert.equal(image.alt, '');
  assert.equal(image.getAttribute('aria-hidden'), 'true');
  assert.equal(
    button.querySelector('.source-action-title')?.textContent?.trim(),
    'Pay by Bank'
  );
});
```

- [ ] **Step 2: Build and run the primitive test to verify RED**

```bash
npm run build
BROWSERS=chromium npx wtr test/commerce-hub-connect-primitives_test.js
```

Expected: FAIL at TypeScript compilation because `add-pay-by-bank` and `brandImage` do not exist yet. If Chromium cannot launch, retain the compiler failure as RED evidence and continue after correcting only test syntax.

- [ ] **Step 3: Extend the source-action types**

In `src/internal/types.ts`, add `'add-pay-by-bank'` to `FlowActionName` and add the optional field to `SourceActionOptions`:

```ts
export interface SourceActionOptions {
  label: string;
  subtitle?: string;
  action: FlowActionName;
  icon: SourceActionIcon;
  brandImage?: string;
  variant?: SourceActionVariant;
  disabled?: boolean;
}
```

- [ ] **Step 4: Render the decorative image**

Update `renderSourceAction` to destructure `brandImage`. For the card variant, add `source-action-branded` through `joinClassNames` and replace the SVG icon only when an image exists:

```ts
<button
  class=${joinClassNames(
    'source-action',
    `source-action-${icon}`,
    brandImage && 'source-action-branded'
  )}
  type="button"
  data-action=${action}
  ?disabled=${disabled}
>
  ${brandImage
    ? html`
        <span class="source-action-brand" aria-hidden="true">
          <img
            class="source-action-brand-image"
            src=${brandImage}
            alt=""
            aria-hidden="true"
          />
        </span>
      `
    : renderSourceActionIcon(icon)}
  <span class="source-action-copy">
    <span class="source-action-title">${label}</span>
    ${subtitle
      ? html`<span class="source-action-subtitle">${subtitle}</span>`
      : ''}
  </span>
</button>
```

Keep link-variant rendering unchanged and do not pass brand images to link actions.

- [ ] **Step 5: Add image/card styling**

Add the following beside `.source-action-icon` styles:

```css
.source-action-branded,
.source-action-branded:hover:not(:disabled),
.source-action-branded:focus-visible,
.source-action-branded:disabled {
  background: #fff;
}

.source-action-brand {
  width: 5rem;
  height: 3rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.source-action-brand-image {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: contain;
}
```

Update `.source-action` to use `grid-template-columns: 5rem minmax(0, 1fr)` only through a scoped `.source-action-branded` override so existing icon cards retain their current layout:

```css
.source-action-branded {
  grid-template-columns: 5rem minmax(0, 1fr);
}
```

- [ ] **Step 6: Create the image generator**

Create `scripts/generate-source-action-brand-images.cjs`:

```js
const {execFileSync} = require('node:child_process');
const {mkdtempSync, readFileSync, rmSync, writeFileSync} = require('node:fs');
const {tmpdir} = require('node:os');
const {basename, join, resolve} = require('node:path');

const [cardSource, payByBankSource, manualBankSource] = process.argv.slice(2);

if (!cardSource || !payByBankSource || !manualBankSource) {
  throw new Error(
    'Usage: node scripts/generate-source-action-brand-images.cjs <card> <pbb> <manual>'
  );
}

const temporaryDirectory = mkdtempSync(join(tmpdir(), 'chc-brand-images-'));
const target = resolve('src/internal/source-action-brand-images.ts');
const inputs = [
  ['CARD_SOURCE_ACTION_BRAND_IMAGE', cardSource],
  ['PAY_BY_BANK_SOURCE_ACTION_BRAND_IMAGE', payByBankSource],
  ['MANUAL_BANK_SOURCE_ACTION_BRAND_IMAGE', manualBankSource],
];

try {
  const constants = inputs.map(([name, source]) => {
    const optimized = join(temporaryDirectory, `${basename(source)}.jpg`);
    execFileSync('sips', [
      '-Z',
      '320',
      '-s',
      'format',
      'jpeg',
      '-s',
      'formatOptions',
      '80',
      source,
      '--out',
      optimized,
    ]);
    const encoded = readFileSync(optimized).toString('base64');
    return `export const ${name} =\n  'data:image/jpeg;base64,${encoded}';`;
  });

  writeFileSync(
    target,
    `// Generated by scripts/generate-source-action-brand-images.cjs.\n${constants.join(
      '\n\n'
    )}\n`
  );
} finally {
  rmSync(temporaryDirectory, {recursive: true, force: true});
}
```

- [ ] **Step 7: Generate the optimized embedded assets**

```bash
node scripts/generate-source-action-brand-images.cjs \
  /Users/unnikrishnan.b/Downloads/card_logo.jpg \
  /Users/unnikrishnan.b/Downloads/pbb_fiserv_logo.jpeg \
  /Users/unnikrishnan.b/Downloads/manual_ach_logo.jpeg
```

Expected: `src/internal/source-action-brand-images.ts` contains three `data:image/jpeg;base64,` constants; each decoded JPEG is no wider than 320 pixels.

- [ ] **Step 8: Verify GREEN and commit**

```bash
npm run build
BROWSERS=chromium npx wtr test/commerce-hub-connect-primitives_test.js
npx eslint src/internal/types.ts src/internal/primitives.ts src/test/commerce-hub-connect-primitives_test.ts
git diff --check
git add scripts/generate-source-action-brand-images.cjs src/internal/source-action-brand-images.ts src/internal/types.ts src/internal/primitives.ts src/internal/styles.ts src/test/commerce-hub-connect-primitives_test.ts
git commit -m "feat: add branded payment tender images"
```

Expected: build, focused test, lint, and diff check pass. If Playwright is unavailable, report the environment block while requiring all other checks to pass.

### Task 2: Resolve one ordered country-aware tender model

**Files:**
- Create: `src/internal/add-payment-tenders.ts`
- Create: `src/test/add-payment-tenders_test.ts`
- Modify: `src/internal/types.ts:225-280`

- [ ] **Step 1: Add failing resolver tests**

Create `src/test/add-payment-tenders_test.ts` with table-driven assertions:

```ts
import {assert} from '@open-wc/testing';

import {resolveAddPaymentTenders} from '../internal/add-payment-tenders.js';

const copy = {
  addCardTitle: 'Credit or debit card',
  addCardSubtitle: 'Add your card details',
  addBankAccountTitle: 'Bank account',
  addBankAccountSubtitle: 'Connect or enter an account',
};

suite('add payment tenders', () => {
  test('splits an allowed USA bank account into PBB and manual tenders', () => {
    assert.deepEqual(
      resolveAddPaymentTenders({
        isUsa: true,
        allowedTenderOptions: {
          card: true,
          bankAccount: true,
          nativeAccount: false,
        },
        copy,
      }).map(({action, title, subtitle, icon, brandImage}) => ({
        action,
        title,
        subtitle,
        icon,
        branded: brandImage?.startsWith('data:image/jpeg;base64,') === true,
      })),
      [
        {
          action: 'add-card',
          title: 'Credit or debit card',
          subtitle: 'Add your card details',
          icon: 'card',
          branded: true,
        },
        {
          action: 'add-pay-by-bank',
          title: 'Pay by Bank',
          subtitle: 'Directly connect with your bank account',
          icon: 'bank',
          branded: true,
        },
        {
          action: 'add-ach-manually',
          title: 'Manual Bank Link',
          subtitle: 'Add your account details manually',
          icon: 'bank',
          branded: true,
        },
      ]
    );
  });

  test('preserves one configured bank tender outside USA', () => {
    assert.deepEqual(
      resolveAddPaymentTenders({
        isUsa: false,
        allowedTenderOptions: {
          card: false,
          bankAccount: true,
          nativeAccount: false,
        },
        copy: {
          ...copy,
          addBankAccountTitle: 'Connect bank',
          addBankAccountSubtitle: 'Connect checking or savings',
        },
      }).map(({action, title, subtitle, icon, brandImage}) => ({
        action,
        title,
        subtitle,
        icon,
        brandImage,
      })),
      [
        {
          action: 'add-bank-account',
          title: 'Connect bank',
          subtitle: 'Connect checking or savings',
          icon: 'bank',
          brandImage: undefined,
        },
      ]
    );
  });

  test('filters card and both USA bank choices by allowed tender types', () => {
    const cardOnly = resolveAddPaymentTenders({
      isUsa: true,
      allowedTenderOptions: {
        card: true,
        bankAccount: false,
        nativeAccount: false,
      },
      copy,
    });
    const bankOnly = resolveAddPaymentTenders({
      isUsa: true,
      allowedTenderOptions: {
        card: false,
        bankAccount: true,
        nativeAccount: false,
      },
      copy,
    });

    assert.deepEqual(cardOnly.map(({action}) => action), ['add-card']);
    assert.deepEqual(bankOnly.map(({action}) => action), [
      'add-pay-by-bank',
      'add-ach-manually',
    ]);
  });
});
```

- [ ] **Step 2: Build to verify RED**

```bash
npm run build
```

Expected: FAIL because `add-payment-tenders.ts` and `AddPaymentTenderOption` do not exist.

- [ ] **Step 3: Add the shared tender model type**

In `src/internal/types.ts`, add:

```ts
export interface AddPaymentTenderOption {
  action:
    | 'add-card'
    | 'add-bank-account'
    | 'add-pay-by-bank'
    | 'add-ach-manually';
  title: string;
  subtitle: string;
  icon: 'card' | 'bank';
  brandImage?: string;
}
```

- [ ] **Step 4: Implement the pure resolver**

Create `src/internal/add-payment-tenders.ts`:

```ts
import {
  CARD_SOURCE_ACTION_BRAND_IMAGE,
  MANUAL_BANK_SOURCE_ACTION_BRAND_IMAGE,
  PAY_BY_BANK_SOURCE_ACTION_BRAND_IMAGE,
} from './source-action-brand-images.js';
import type {
  AddPaymentTenderOption,
  AllowedTenderOptions,
  NoSavedPaymentMethodsScreenCopy,
} from './types.js';

export const resolveAddPaymentTenders = ({
  isUsa,
  allowedTenderOptions,
  copy,
}: {
  isUsa: boolean;
  allowedTenderOptions: AllowedTenderOptions;
  copy: Pick<
    NoSavedPaymentMethodsScreenCopy,
    | 'addCardTitle'
    | 'addCardSubtitle'
    | 'addBankAccountTitle'
    | 'addBankAccountSubtitle'
  >;
}): AddPaymentTenderOption[] => {
  const tenders: AddPaymentTenderOption[] = [];

  if (allowedTenderOptions.card) {
    tenders.push({
      action: 'add-card',
      title: copy.addCardTitle,
      subtitle: copy.addCardSubtitle,
      icon: 'card',
      brandImage: CARD_SOURCE_ACTION_BRAND_IMAGE,
    });
  }

  if (!allowedTenderOptions.bankAccount) {
    return tenders;
  }

  if (!isUsa) {
    tenders.push({
      action: 'add-bank-account',
      title: copy.addBankAccountTitle,
      subtitle: copy.addBankAccountSubtitle,
      icon: 'bank',
    });
    return tenders;
  }

  tenders.push(
    {
      action: 'add-pay-by-bank',
      title: 'Pay by Bank',
      subtitle: 'Directly connect with your bank account',
      icon: 'bank',
      brandImage: PAY_BY_BANK_SOURCE_ACTION_BRAND_IMAGE,
    },
    {
      action: 'add-ach-manually',
      title: 'Manual Bank Link',
      subtitle: 'Add your account details manually',
      icon: 'bank',
      brandImage: MANUAL_BANK_SOURCE_ACTION_BRAND_IMAGE,
    }
  );

  return tenders;
};
```

- [ ] **Step 5: Verify GREEN and commit**

```bash
npm run build
BROWSERS=chromium npx wtr test/add-payment-tenders_test.js
npx eslint src/internal/add-payment-tenders.ts src/internal/types.ts src/test/add-payment-tenders_test.ts
git diff --check
git add src/internal/add-payment-tenders.ts src/internal/types.ts src/test/add-payment-tenders_test.ts
git commit -m "feat: resolve country-aware payment tenders"
```

Expected: build, focused resolver tests, lint, and diff check pass, subject to the documented Playwright environment availability.

### Task 3: Use the tender model in the empty state and bottom sheet

**Files:**
- Modify: `src/internal/screens/payment-methods-screen.ts:68-112`
- Modify: `src/commerce-hub-connect.ts:1270-1475`
- Modify: `src/commerce-hub-connect.ts:1744-1765`
- Modify: `src/commerce-hub-connect.ts:2770-2810`
- Modify: `src/commerce-hub-connect.ts:2885-2965`
- Modify: `src/commerce-hub-connect.ts:5550-5580`
- Modify: `src/test/commerce-hub-connect-flow_test.ts`

- [ ] **Step 1: Update USA empty-state expectations first**

Change the no-saved-payment-method test to expect three actions and exact copy:

```ts
const emptyTenderButtons = [
  ...el.shadowRoot!.querySelectorAll<HTMLButtonElement>(
    '.payment-action-links .source-action'
  ),
];
assert.deepEqual(
  emptyTenderButtons.map((button) => ({
    action: button.dataset.action,
    title: button.querySelector('.source-action-title')?.textContent?.trim(),
    subtitle: button
      .querySelector('.source-action-subtitle')
      ?.textContent?.trim(),
  })),
  [
    {
      action: 'add-card',
      title: 'Credit or debit card',
      subtitle: 'Add your card details',
    },
    {
      action: 'add-pay-by-bank',
      title: 'Pay by Bank',
      subtitle: 'Directly connect with your bank account',
    },
    {
      action: 'add-ach-manually',
      title: 'Manual Bank Link',
      subtitle: 'Add your account details manually',
    },
  ]
);
assert.deepEqual(
  emptyTenderButtons.map((button) =>
    button.querySelector<HTMLImageElement>('.source-action-brand-image')?.src
  ),
  [
    CARD_SOURCE_ACTION_BRAND_IMAGE,
    PAY_BY_BANK_SOURCE_ACTION_BRAND_IMAGE,
    MANUAL_BANK_SOURCE_ACTION_BRAND_IMAGE,
  ]
);
for (const button of emptyTenderButtons) {
  assert.equal(getComputedStyle(button).backgroundColor, 'rgb(255, 255, 255)');
}
```

Import the three brand-image constants into the flow test.

- [ ] **Step 2: Add USA bottom-sheet assertions**

In the saved-payment-method launcher test, open the sheet and assert:

```ts
await clickAction(el, 'open-add-payment-source');
const sheetOptions = [
  ...el.shadowRoot!.querySelectorAll<HTMLButtonElement>(
    '.add-payment-sheet-option'
  ),
];
assert.deepEqual(
  sheetOptions.map((option) => option.dataset.action),
  ['add-card', 'add-pay-by-bank', 'add-ach-manually']
);
assert.deepEqual(
  sheetOptions.map((option) =>
    option.querySelector('.add-payment-sheet-option-title')?.textContent?.trim()
  ),
  ['Credit or debit card', 'Pay by Bank', 'Manual Bank Link']
);
assert.equal(
  sheetOptions[1].querySelector('path')?.getAttribute('d'),
  BANK_SOURCE_ACTION_ICON_PATH
);
assert.equal(
  sheetOptions[2].querySelector('path')?.getAttribute('d'),
  BANK_SOURCE_ACTION_ICON_PATH
);
```

- [ ] **Step 3: Add filtering and non-USA compatibility tests**

Add a table-driven flow test that renders no saved sources with these interactions and asserts action arrays:

```ts
const cases: Array<{
  country?: string;
  allowedTenderTypes: NonNullable<InteractionResponse['allowedTenderTypes']>;
  actions: string[];
}> = [
  {
    country: ' usa ',
    allowedTenderTypes: ['CARD', 'BANK_ACCOUNT'],
    actions: ['add-card', 'add-pay-by-bank', 'add-ach-manually'],
  },
  {
    country: 'US',
    allowedTenderTypes: ['CARD'],
    actions: ['add-card'],
  },
  {
    country: 'USA',
    allowedTenderTypes: ['BANK_ACCOUNT'],
    actions: ['add-pay-by-bank', 'add-ach-manually'],
  },
  {
    country: 'CA',
    allowedTenderTypes: ['CARD', 'BANK_ACCOUNT'],
    actions: ['add-card', 'add-bank-account'],
  },
  {
    country: undefined,
    allowedTenderTypes: ['BANK_ACCOUNT'],
    actions: ['add-bank-account'],
  },
];

for (const testCase of cases) {
  const el = await renderConnect({
    interactionId: 'interaction-payment',
    status: 'PAYMENT_SOURCE_REQUESTED',
    country: testCase.country,
    allowedTenderTypes: [...testCase.allowedTenderTypes],
    paymentSources: [],
  });

  assert.deepEqual(
    [
      ...el.shadowRoot!.querySelectorAll<HTMLElement>(
        '.payment-action-links [data-action]'
      ),
    ].map((button) => button.dataset.action),
    testCase.actions
  );
}
```

For each case, render and compare `.payment-action-links [data-action]`. Add a separate non-USA design-copy assertion proving `addBankAccountTitle` and `addBankAccountSubtitle` still apply, and retain the existing card-copy assertion for the USA card tender.

- [ ] **Step 4: Build/run to verify RED**

```bash
npm run build
BROWSERS=chromium npx wtr test/commerce-hub-connect-flow_test.js
```

Expected: FAIL because both screens still build Card/Bank directly and new actions are not routed.

- [ ] **Step 5: Render no-saved tenders from the model**

Replace `NoSavedPaymentMethodsScreenModel.allowedTenderOptions` with `tenders: AddPaymentTenderOption[]`. Change `renderNoSavedPaymentMethodsScreen` to destructure `tenders` and replace its Card/Bank branches with:

```ts
const hasAddPaymentActions = canAddPaymentSources && tenders.length > 0;

// Inside payment-action-links:
${tenders.map((tender) =>
  renderSourceAction({
    label: tender.title,
    subtitle: tender.subtitle,
    action: tender.action,
    icon: tender.icon,
    brandImage: tender.brandImage,
    disabled: deletePending,
  })
)}
```

In `renderNoSavedPaymentMethods`, call `resolveAddPaymentTenders` with `isUsaInteractionCountry`, allowed tenders, and resolved copy; pass the result into the screen model.

- [ ] **Step 6: Render the bottom sheet from the same model**

Add a private resolver in `CommerceHubConnect`:

```ts
private addPaymentTenderOptions(): AddPaymentTenderOption[] {
  const copy = resolveNoSavedPaymentMethodsCopy(this.designConfig);

  return resolveAddPaymentTenders({
    isUsa: isUsaInteractionCountry(this.interactionResponse?.country),
    allowedTenderOptions: allowedTenderOptionsFromInteractionResponse(
      this.interactionResponse
    ),
    copy,
  });
}
```

Update `renderAddPaymentSourceSheet`:

```ts
const tenders = this.addPaymentTenderOptions();

// Inside add-payment-sheet-options:
${tenders.map((tender) => this.renderAddPaymentSourceOption(tender))}
```

Update `renderAddPaymentSourceOption` to accept `AddPaymentTenderOption`. Continue rendering only `CARD_SOURCE_ACTION_ICON_PATH` or `BANK_SOURCE_ACTION_ICON_PATH`; do not render `brandImage` in the bottom sheet.

- [ ] **Step 7: Route the new tender action and model-based launcher**

In the `open-add-payment-source` handler, use `this.addPaymentTenderOptions()`:

```ts
const tenders = this.addPaymentTenderOptions();
this.attachmentError = undefined;

if (tenders.length > 1) {
  this.addLauncherActive = true;
  this.focusAfterUpdate('[data-action="close-add-payment-source"]');
} else if (tenders[0]?.action === 'add-card') {
  void this.showAddCardScreen();
} else if (tenders[0]?.action === 'add-pay-by-bank') {
  void this.startPayByBankFlow();
} else if (tenders[0]?.action === 'add-ach-manually') {
  void this.showManualBankAccountScreen();
} else if (tenders[0]?.action === 'add-bank-account') {
  void this.startBankAccountFlow();
}
```

Add a dedicated event branch before the existing `add-bank-account` branch:

```ts
if (action === 'add-pay-by-bank') {
  this.addLauncherActive = false;
  this.paymentSourceView = 'list';
  this.resetCardFlow();
  this.resetRequiredInfo();
  this.resetBankFlow();
  void this.startPayByBankFlow();
  return;
}
```

Keep `add-bank-account` country-aware for non-USA compatibility and keep `add-ach-manually` routed directly to manual entry. Add both new action selectors to `focusPaymentSourceList` after `add-card`.

- [ ] **Step 8: Verify GREEN and commit**

```bash
npm run build
BROWSERS=chromium npx wtr test/commerce-hub-connect-flow_test.js
npx eslint src/commerce-hub-connect.ts src/internal/screens/payment-methods-screen.ts src/internal/types.ts src/test/commerce-hub-connect-flow_test.ts
git diff --check
git add src/commerce-hub-connect.ts src/internal/screens/payment-methods-screen.ts src/internal/types.ts src/test/commerce-hub-connect-flow_test.ts
git commit -m "feat: split USA bank payment tenders"
```

Expected: build, flow tests, lint, and diff check pass, subject to Playwright availability.

### Task 4: Remove the obsolete PBB header fallback and verify direct navigation

**Files:**
- Modify: `src/commerce-hub-connect.ts:2267-2305`
- Modify: `src/internal/styles.ts:2700-2715`
- Modify: `src/test/commerce-hub-connect-flow_test.ts:7320-7600`

- [ ] **Step 1: Change the PBB header test first**

Replace the existing compact-action assertions with:

```ts
assert.notExists(
  el.shadowRoot!.querySelector(
    '.widget-title-action [data-action="add-ach-manually"]'
  )
);
assert.notInclude(
  el.shadowRoot!.querySelector('.widget-header')?.textContent ?? '',
  'Connect another way'
);
```

Remove the old computed 12px/32px and centered-row assertions. Retain the title, back button, provider container, init configuration, and appearance assertions.

In `test('Connect your bank shows a loading frame until PaymentSDK init is ready', ...)`, replace its disabled fallback-button assertion with:

```ts
assert.notExists(
  el.shadowRoot!.querySelector(
    '.widget-title-action [data-action="add-ach-manually"]'
  )
);
```

Update the existing `test('add bank account initializes PaymentSDK with a compact Connect your bank handoff', ...)` to launch the new PBB action directly:

```ts
await clickAction(el, 'add-pay-by-bank');
await waitFor(() => Boolean(initConfig), 'PaymentSDK.init was not called');

assert.equal(
  el.shadowRoot!.querySelector('.widget-title')?.textContent?.trim(),
  'Connect your bank'
);
```

Remove that test's final `clickAction(el, 'add-ach-manually')` transition because manual entry is no longer launched from the provider header.

Update the existing `test('US manual bank entry loads its USD schema before creating an ACH source', ...)` to enter manual flow directly:

```ts
await clickAction(el, 'add-ach-manually');
await waitFor(
  () =>
    el.shadowRoot!.querySelector('.widget-title')?.textContent?.trim() ===
    'Select bank account type',
  'US instrument schema chooser did not load'
);
assert.isUndefined(initConfig);
```

Remove the old intermediate assertions for the PBB provider and `back-to-bank-provider`; retain the configuration request and ACH creation assertions already in that test.

- [ ] **Step 2: Build/run to verify RED**

```bash
npm run build
BROWSERS=chromium npx wtr test/commerce-hub-connect-flow_test.js
```

Expected: FAIL because the PBB header still renders the fallback action.

- [ ] **Step 3: Remove the header action and obsolete CSS**

Delete `titleAction` from `renderBankProviderScreen`. Remove these rules from `src/internal/styles.ts`:

```css
.bank-provider-alternate-action .button { /* entire rule */ }
.widget-heading-row:has(.bank-provider-alternate-action) { /* entire rule */ }
```

Do not modify the shared heading-row alignment rule.

- [ ] **Step 4: Verify GREEN and commit**

```bash
npm run build
BROWSERS=chromium npx wtr test/commerce-hub-connect-flow_test.js
npm run lint
git diff --check
git add src/commerce-hub-connect.ts src/internal/styles.ts src/test/commerce-hub-connect-flow_test.ts
git commit -m "refactor: remove PBB manual fallback action"
```

Expected: build, focused flow tests, lint, and diff check pass, subject to Playwright availability.

### Task 5: Full regression verification

**Files:**
- Verify all files changed in Tasks 1-4.

- [ ] **Step 1: Verify optimized asset size and dimensions**

```bash
node -e "import('./internal/source-action-brand-images.js').then(async (m) => { for (const [name, uri] of Object.entries(m)) { const bytes = Buffer.from(uri.split(',')[1], 'base64'); if (bytes.length > 30000) throw new Error(name + ' exceeds 30KB'); console.log(name, bytes.length); } })"
```

Expected: all three optimized images decode successfully and each is below 30KB. The generator's `sips -Z 320` invocation guarantees neither dimension exceeds 320 pixels.

- [ ] **Step 2: Run focused browser suites**

```bash
npm run build
BROWSERS=chromium npx wtr \
  test/add-payment-tenders_test.js \
  test/commerce-hub-connect-primitives_test.js \
  test/commerce-hub-connect-flow_test.js
```

Expected: all focused tests pass.

- [ ] **Step 3: Run full project checks**

```bash
npm run lint
npm test
```

Expected: lint, proxy-auth, package-surface, development browser, and production browser suites pass. If the known local Playwright executable or npm cache permission issues recur, report them exactly and do not claim those suites passed.

- [ ] **Step 4: Inspect final branch state**

```bash
git diff main...HEAD --check
git status --short --branch
git log --oneline main..HEAD
```

Expected: no whitespace errors, a clean `feature/ui-changes` worktree, and only the intended design, plan, asset, tender-model, rendering, navigation, and PBB-header commits.
