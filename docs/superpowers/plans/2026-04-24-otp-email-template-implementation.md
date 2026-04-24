# OTP Email Template Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create a standalone email-client-safe HTML template at `docs/otp-verification-email.html` that matches the provided OTP email screenshot and uses only the `{{otp}}` placeholder.

**Architecture:** Keep the deliverable as a single static HTML file built with table-based email markup and inline styles. Add one lightweight Node test that reads the template from disk and verifies the placeholder contract, static copy, and email-safe structure without requiring the Angular/Karma test harness.

**Tech Stack:** Static HTML email markup, inline CSS, Node built-in test runner (`node --test`).

---

### Task 1: Add Template Verification First

**Files:**
- Create: `docs/otp-verification-email.test.mjs`
- Test: `docs/otp-verification-email.test.mjs`

- [x] **Step 1: Create a failing Node test for the template contract**

Add a test that:

- reads `docs/otp-verification-email.html`
- fails if the file does not exist
- asserts `{{otp}}` is the only placeholder token
- asserts the static warning/footer copy is present
- asserts the file uses table markup and contains no `<script>` tag

- [x] **Step 2: Run the test to verify the red state**

Run:

```bash
node --test docs/otp-verification-email.test.mjs
```

Expected:

- FAIL because `docs/otp-verification-email.html` does not exist yet

### Task 2: Create The HTML Email Template

**Files:**
- Create: `docs/otp-verification-email.html`
- Test: `docs/otp-verification-email.test.mjs`

- [x] **Step 1: Implement the email template**

Create a standalone HTML email file that includes:

- a light gray email background
- a centered header badge that approximates the reference image
- the static title split across two lines
- one prominent verification-code container rendering `{{otp}}`
- the static safety copy and warning card text from the approved design
- table-based layout with inline critical styles and no scripts

- [x] **Step 2: Re-run the Node test to verify green**

Run:

```bash
node --test docs/otp-verification-email.test.mjs
```

Expected:

- PASS with 1 passing test and 0 failures

- [x] **Step 3: Run a structural grep check on the final template**

Run:

```bash
rg -n "{{otp}}|Don't share this code to anyone!|Was this request not made by you\\?|Please do not reply\\.|<table" docs/otp-verification-email.html
```

Expected:

- the template contains the single OTP placeholder
- the key static copy is present
- the final markup uses table structure
