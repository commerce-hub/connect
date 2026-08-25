# Supported Locales Extension Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Support `en`, `en-US`, `fr-CA`, and `es-US` throughout the wallet SDK and sample applications.

**Architecture:** Keep the existing translator and English fallback. Register `en` as a distinct resolved locale backed by the existing `en-US` catalog, add a complete `es-US` catalog, and propagate the resolved locale unchanged through rendering, API headers, and Pay by Bank.

**Tech Stack:** TypeScript, Lit, `intl-messageformat`, Web Test Runner, Node catalog validation.

---

### Task 1: Locale resolution and Spanish catalog

**Files:**
- Modify: `src/test/localization_test.ts`
- Modify: `src/internal/localization/localization.ts`
- Create: `src/internal/localization/catalogs/es-US.ts`

- [ ] Add failing tests asserting exact resolution for all four locale values, `EN_us` canonicalization, `es`/`es-MX` language fallback to `es-US`, and unsupported-language fallback to `en-US`.
- [ ] Run the focused localization test and confirm failures for `en` and `es-US`.
- [ ] Register `en` with `enUSMessages`, register `es-US` with `esUSMessages`, and keep `en-US` as the default.
- [ ] Translate every English catalog entry into US Spanish while preserving each ICU argument exactly.
- [ ] Run `npm run check:localization` and the focused localization test; expect both to pass.

### Task 2: Component behavior and propagation

**Files:**
- Modify: `src/test/commerce-hub-connect-flow_test.ts`
- Modify: `src/commerce-hub-connect.ts`

- [ ] Add failing component tests for representative `es-US` SDK text, reflected `lang="es-US"`, request `Accept-Language: es-US`, and PBB locale propagation.
- [ ] Run the focused tests and confirm they fail only where Spanish support is missing.
- [ ] Update public locale documentation comments and any locale-specific branching so all four resolved locales pass through unchanged.
- [ ] Run the focused component tests and expect them to pass.

### Task 3: Sample applications and documentation

**Files:**
- Modify: sample-app locale selector files discovered in the active sample-app package
- Modify: `README.md`
- Modify: `LOCALIZATION.md`
- Modify: `docs-src/examples/embedded.md`

- [ ] Add `English`, `English (US)`, `French (Canada)`, and `Spanish (US)` options to each wallet, embedded, and checkout sample selector.
- [ ] Document the supported-locale matrix, resolution rules, runtime switching, and API-provided English-content limitation.
- [ ] Update catalog contribution instructions to require both French Canadian and US Spanish translations.

### Task 4: Full verification

**Files:**
- Verify only; no planned production edits.

- [ ] Run `npm run check:localization`; expect all catalogs complete and valid.
- [ ] Run `npm run lint`; expect no new errors.
- [ ] Run `npm run build`; expect TypeScript compilation to pass.
- [ ] Run available unit and package-surface test commands; record any environment-blocked browser tests explicitly.
- [ ] Run `git diff --check` and inspect the final diff for unrelated worktree changes before staging.
