# Configurable SDK Height Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Expose an application-configurable shell height and increase the default minimum height to `22rem`.

**Architecture:** Define `--chc-shell-height` on the component host, consume it in the existing viewport-capped shell height, and document it alongside other public CSS properties. Preserve the mobile viewport override and internal scrolling.

**Tech Stack:** Lit CSS, TypeScript component metadata, Markdown documentation, Web Test Runner.

---

### Task 1: Add failing public-style assertions

- Modify `src/test/commerce-hub-connect-primitives_test.ts` to require `--chc-shell-height: 35.25rem`, `height: min(var(--chc-shell-height), calc(100dvh - 1.5rem))`, and `min-height: 22rem`.

### Task 2: Implement the height token

- Modify `src/internal/styles.ts` to define and consume `--chc-shell-height` and raise the minimum to `22rem`.
- Add `@cssproperty --chc-shell-height` to `src/commerce-hub-connect.ts`.

### Task 3: Document and verify

- Update `README.md` and `docs-src/examples/design-config.md` with the new variable and usage example.
- Run build, lint, non-browser tests, and diff checks; leave unrelated existing edits unstaged.
