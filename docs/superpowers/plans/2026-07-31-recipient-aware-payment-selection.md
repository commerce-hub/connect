# Recipient-aware payment selection implementation plan

## Goal

Prevent verified bank sources from being selected until a present recipient is provisioned, while preserving the pre-recipient API behavior.

## Steps

1. Add an optional recipient type to the public payment-source contract.
2. Implement pure helpers for the recipient-aware label and selection eligibility matrix.
3. Feed the helpers into payment-method primitives so non-selectable sources have no radio control.
4. Apply the same eligibility rule to initial selection, added-source preselection, attach guards, and verification completion.
5. Keep all existing non-verified status labels and non-bank verified behavior unchanged.
6. Add unit and browser-flow coverage for absent, provisioned, pending, blank, and non-bank recipient scenarios.
7. Run build, lint, Node tests, browser tests where the environment permits, and a clean worktree diff audit.
