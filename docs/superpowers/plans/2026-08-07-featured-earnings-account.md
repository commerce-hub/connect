# Featured Earnings Account Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Pin the visible Earnings native account above regular payment methods and render it as a separated informational balance row.

**Architecture:** Add an explicit payment-method presentation flag at the source-to-view-model boundary. Stable-partition visible sources so Earnings is first, then let the shared row primitive suppress interactions/status and apply the featured visual class from that flag.

**Tech Stack:** TypeScript, Lit, CSS, Web Test Runner.

---

### Task 1: Mapping and ordering

- [ ] Add failing payment-selection coverage with Earnings after card/bank sources in the API response.
- [ ] Assert Earnings renders first while remaining methods preserve their order.
- [ ] Add `presentation?: 'featured-informational'` to `PaymentMethod` and set it only for the qualifying Earnings native source.
- [ ] Set `showVerificationStatus: false` and `selectionEligible: false` for that source.

### Task 2: Static primitive behavior

- [ ] Add failing primitive coverage proving featured rows have no radio, overflow menu, delete/mark-default actions, chevron, or verification badge.
- [ ] Preserve account label and balance content.
- [ ] Update row rendering to suppress every affordance for the featured presentation and add `payment-method-row-featured-informational`.

### Task 3: Visual separation and verification

- [ ] Add a soft-surface background and extra bottom margin to the featured row.
- [ ] Verify build, lint, available tests, and staged diff.
- [ ] Commit only the feature files while leaving unrelated local work unstaged.
