# SDK Language Support Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Localize all SDK-owned shopper text in bundled `en-US` and `fr-CA` catalogs while leaving API-provided content unchanged in English.

**Architecture:** Add a small SDK-owned localization module around `intl-messageformat`, expose a reactive `locale` property, and pass a typed translator into component and primitive presentation boundaries. Preserve legacy `designConfig.copy` precedence during migration, forward the resolved locale to PBB and API requests, and keep English as the guaranteed fallback.

**Tech Stack:** TypeScript 5.9, Lit 3, `intl-messageformat`, native `Intl`, Mocha, Web Test Runner

---

### Task 1: Localization runtime and catalogs

**Files:**
- Create: `src/internal/localization/catalogs/en-US.ts`
- Create: `src/internal/localization/catalogs/fr-CA.ts`
- Create: `src/internal/localization/localization.ts`
- Create: `src/test/localization_test.ts`
- Modify: `package.json`
- Modify: `package-lock.json`

- [ ] Write failing tests for exact `fr-CA`, base-language `fr`, unsupported-locale English fallback, ICU interpolation/plurals, and missing-key fallback.
- [ ] Run the focused test and confirm failure because the localization module is absent.
- [ ] Add `intl-messageformat` as a runtime dependency.
- [ ] Add a typed English source catalog and a complete French Canadian catalog.
- [ ] Implement `resolveLocale`, `createTranslator`, formatter caching, `message`, `number`, `currency`, `date`, and `direction`.
- [ ] Run the focused tests and commit the runtime/catalog slice.

The public runtime contract will be:

```ts
export type SupportedLocale = 'en-US' | 'fr-CA';
export type MessageKey = keyof typeof enUSMessages;

export interface Translator {
  readonly locale: SupportedLocale;
  readonly direction: 'ltr' | 'rtl';
  message(
    key: MessageKey,
    values?: Record<string, string | number | Date>
  ): string;
  number(value: number, options?: Intl.NumberFormatOptions): string;
  currency(value: number, currencyCode: string): string;
  date(value: Date | number, options?: Intl.DateTimeFormatOptions): string;
}
```

### Task 2: Public locale and propagation

**Files:**
- Modify: `src/commerce-hub-connect.ts`
- Modify: `src/internal/api-client.ts`
- Modify: `src/test/commerce-hub-connect-flow_test.ts`
- Modify: `src/test/api-client_test.ts`

- [ ] Write failing tests proving `locale` defaults to `en-US`, accepts `fr-CA` and `fr`, falls back for unsupported values, and rerenders when changed.
- [ ] Write failing tests proving SDK requests include `Accept-Language` and PBB receives the resolved locale.
- [ ] Add the reflected public `locale` property and recreate the translator when it changes.
- [ ] Add `Accept-Language` to SDK-managed requests without replacing an explicitly supplied header.
- [ ] Use the resolved component locale for PBB initialization; retain `designConfig.payByBank.locale` only as a legacy fallback when the public locale is not explicitly set.
- [ ] Run focused tests and commit locale propagation.

### Task 3: Shared shell, primitives, and payment-method localization

**Files:**
- Modify: `src/internal/primitives.ts`
- Modify: `src/internal/types.ts`
- Modify: `src/internal/payment-source-selection.ts`
- Modify: `src/commerce-hub-connect.ts`
- Modify: `src/test/commerce-hub-connect-primitives_test.ts`
- Modify: `src/test/commerce-hub-connect-payment-selection_test.ts`

- [ ] Write failing French tests for shell actions, loading labels, payment statuses, default labels, delete actions, empty states, and payment-method actions.
- [ ] Add semantic catalog keys for shared text and accessibility labels.
- [ ] Pass translated values through primitive option types instead of reading catalogs globally.
- [ ] Replace SDK-owned hard-coded strings in shared primitives and payment selection.
- [ ] Preserve merchant/user/account/provider names without translation.
- [ ] Run focused tests and commit the shared UI migration.

### Task 4: OTP and source-creation localization

**Files:**
- Modify: `src/commerce-hub-connect.ts`
- Modify: `src/internal/forms/card-form-state.ts`
- Modify: `src/internal/forms/bank-account-form-state.ts`
- Modify: `src/internal/forms/required-info-form-state.ts`
- Modify: `src/test/commerce-hub-connect-flow_test.ts`
- Modify: `src/test/form-state_test.ts`

- [ ] Write failing French tests for OTP, card, bank, billing-address, configuration-loading/error, and required-information screens.
- [ ] Migrate SDK-owned headings, labels, buttons, placeholders, helper text, loading text, accessibility text, and local validation errors to semantic keys.
- [ ] Keep `designConfig.copy` precedence as legacy override → selected catalog → English.
- [ ] Leave JSONForms titles and configured validation errors from APIs unchanged.
- [ ] Keep existing encryption, validation rules, and payload behavior unchanged.
- [ ] Run focused tests and commit the source-creation migration.

### Task 5: Verification, transfer, outcome, and formatting localization

**Files:**
- Modify: `src/commerce-hub-connect.ts`
- Modify: `src/internal/forms/transfer-form-state.ts`
- Modify: `src/internal/payment-source-selection.ts`
- Modify: `src/test/commerce-hub-connect-flow_test.ts`
- Modify: `src/test/commerce-hub-connect-payment-selection_test.ts`

- [ ] Write failing French tests for verification overlays, document requirements, transfer form/review/outcome, delete confirmation, and success/error screens.
- [ ] Move remaining SDK-owned text to catalogs.
- [ ] Replace the fixed `en-US` balance formatter with translator currency formatting.
- [ ] Keep raw API text unchanged when no stable SDK-owned error code exists.
- [ ] Run focused tests and commit the remaining flow migration.

### Task 6: Completeness and release verification

**Files:**
- Create: `scripts/check-localization.mjs`
- Modify: `package.json`
- Modify: `README.md`
- Test: localization and existing SDK test suites

- [ ] Add a catalog completeness/ICU syntax check and fail for missing French keys.
- [ ] Add a check for newly introduced hard-coded shopper strings in migrated files, with an explicit allowlist for identifiers, API values, logs, and API-provided content.
- [ ] Document `locale="en-US"` and `locale="fr-CA"`, fallback behavior, and API-content ownership.
- [ ] Run formatting checks, localization checks, build, lint, focused tests, and the full suite.
- [ ] Confirm the localization design document and unrelated CARD contract document remain uncommitted.
- [ ] Commit implementation and documentation changes only.

Verification commands:

```bash
npm run check:localization
npm run build
npm run lint
BROWSERS=chromium npm run test:dev
npm test
git diff --check
git status --short --branch
```
