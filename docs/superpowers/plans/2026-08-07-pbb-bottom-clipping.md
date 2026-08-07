# Pay by Bank Bottom Clipping Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Prevent the ready Pay by Bank provider UI from being clipped by retaining its 500px minimum height.

**Architecture:** Keep the provider container at `31.25rem` in desktop loading and ready states. Continue relying on the scrollable widget content region and preserve the compact mobile override.

**Tech Stack:** Lit CSS, Web Test Runner, TypeScript.

---

### Task 1: Add regression coverage

- [ ] Update provider primitive/flow assertions to require `31.25rem` for the ready container and confirm footer separation.
- [ ] Verify the assertion fails against the current `23.75rem` ready rule.

### Task 2: Fix and verify

- [ ] Change the desktop provider container minimum to `31.25rem` and remove the redundant loading-only override.
- [ ] Preserve the `22.5rem` mobile override.
- [ ] Run build, lint, non-browser tests, and diff checks.
- [ ] Commit only the clipping fix and tests.
