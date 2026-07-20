---
name: meeseeks-cloud-work
description: Use when delegating repo work to Meeseeks cloud agents, handing off implementation plans to isolated dev environments, launching many parallel cloud workers, or submitting Jira-style task payloads to the Meeseeks service.
---

# Meeseeks Cloud Work

## Overview

Use Meeseeks to run implementation, review, investigation, or verification work in isolated cloud dev environments. Each request creates an independent worker, so dispatch independent tasks concurrently instead of serializing them locally.

## Workflow

1. Build a decision-complete handoff plan before submitting work. Include goal, files or subsystems to inspect, exact expected behavior, test commands, and any constraints.
2. Split unrelated work into separate Meeseeks tasks. There is no practical single-worker bottleneck; use multiple workers when tasks do not share state or require sequential results.
3. Submit the task with `scripts/submit_meeseeks_task.py`.
4. Report the HTTP status, task ARN, and any response body to the user.

## Submit A Task

Use Python, not `curl`, for submissions:

```bash
python3 skills/meeseeks-cloud-work/scripts/submit_meeseeks_task.py \
  --repo-path "https://gitlab.onefiserv.net/na/gbs/carat-digital-ecommerce/ms-agentic-commerce-msac/commercehub-connect-wallet-sdk" \
  --jira-id "short-task-id" \
  --jira-description-file /path/to/plan.md
```

For short descriptions:

```bash
python3 skills/meeseeks-cloud-work/scripts/submit_meeseeks_task.py \
  --repo-path "https://gitlab.onefiserv.net/na/gbs/carat-digital-ecommerce/ms-agentic-commerce-msac/commercehub-connect-wallet-sdk" \
  --jira-id "remove-demo-accounts" \
  --jira-description "Remove the SDK demo payment-method fallback. Include tests and build verification."
```

Use `--dry-run` to inspect the payload without launching work.

## Handoff Requirements

- `repo_path`: Git URL Meeseeks should clone.
- `jira_id`: Stable short identifier for the cloud task.
- `jira_description`: The full plan. Do not leave this empty unless the user explicitly requests a placeholder task.

Write `jira_description` as instructions to an autonomous engineer. Include concrete acceptance criteria and verification commands. Mention generated files or docs explicitly when they are in scope.

## Parallel Dispatch

When there are multiple independent tasks:

- Create one plan per task.
- Give each task a unique `jira_id`.
- Submit each task separately.
- Do not dispatch parallel workers for changes that must touch the same files unless the handoff explains merge ordering.

## Safety

- Do not include secrets, tokens, customer data, private keys, or local-only credentials in `jira_description`.
- Prefer repo paths, branch names, commit SHAs, test commands, and public/non-secret environment names.
- If the user asks for a destructive or production-affecting cloud task, confirm the intended target and safeguards before submitting.
