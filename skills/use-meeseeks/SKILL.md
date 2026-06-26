---
name: use-meeseeks
description: Use when delegating implementation, review, investigation, or verification work to Meeseeks cloud workers, especially when several isolated tasks can run in parallel outside the local checkout.
---

# Use Meeseeks

Meeseeks are cloud workers that run in their own isolated development environments. Use them when work can be delegated with a complete written task description, when parallel execution helps, or when the user explicitly asks for Meeseeks.

## When To Use

- Dispatch implementation from a complete plan.
- Split independent work into multiple cloud tasks.
- Ask for isolated review, investigation, or verification that should not mutate the local checkout.
- Avoid using Meeseeks for vague tasks, secret handling, local-only uncommitted changes, or work that requires interactive clarification.

## Dispatch Rules

- Send one Meeseek per independent task. There is no practical concurrency limit, so parallelize freely when tasks do not depend on each other.
- Make each `jira_description` decision-complete: goal, files/surfaces, exact behavior, tests, verification commands, and known assumptions.
- Include repo, branch, commit, MR, or patch context if the task depends on code that may not be on the default branch. Meeseeks cannot see uncommitted local files unless the description includes the relevant diff.
- Do not include secrets, tokens, customer data, private credentials, or hidden local files.
- Treat the response `task_arn` as the handle for the cloud run and report it to the user.

## Submit A Task

Use the bundled helper instead of hand-rolling JSON:

```bash
python3 skills/use-meeseeks/scripts/submit_meeseek.py \
  --jira-id remove-cors-from-demo \
  --description-file /tmp/meeseek-description.txt
```

The helper defaults to this repository's GitLab URL and the standard Meeseeks endpoint. Override them only when the user provides a different repo or endpoint:

```bash
python3 skills/use-meeseeks/scripts/submit_meeseek.py \
  --repo-path https://gitlab.onefiserv.net/group/project \
  --endpoint https://meeseek.clx-nonprod.aws.fisv.cloud/ \
  --jira-id my-task-id \
  --description "Do the specific work..."
```

Use `--dry-run` first when validating payload shape without sending a request.

## Good Description Template

```text
Goal:
[One sentence.]

Implementation:
- [Exact behavior and files/surfaces.]
- [Interfaces, constraints, and non-goals.]

Tests:
- [Specific tests to add/update.]
- [Commands to run.]

Acceptance:
- [Observable outcome.]
- [Anything to report back, such as task ARN, diff summary, or verification output.]
```

## Common Mistakes

- Sending a broad task like "fix the SDK"; instead, send one concrete objective per Meeseek.
- Assuming local uncommitted changes are visible; include the diff or push a branch first.
- Delegating dependent tasks concurrently without stating ordering or inputs.
- Omitting verification commands, which makes the result harder to trust.
