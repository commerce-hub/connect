---
name: figma-generate-library
description: Generate or update a reusable Figma component library, UI kit, or design-system source file. Use when the user wants to create a shared library, define tokens or styles, build reusable component families and variants, convert ad-hoc screens into reusable primitives, or prepare a Figma file for publishing as a team library. Requires Figma MCP access.
---

# Generate Figma Library

Use this skill to create or evolve a reusable Figma library: foundations, variables, styles, components, component sets, and example compositions. Optimize for reuse, consistency, and publish readiness rather than a one-off screen.

## Skill Boundaries

- Use this skill for shared libraries, UI kits, design-system source files, and reusable component families.
- Do not use this skill for a single marketing page or app screen unless the user explicitly wants the underlying reusable library built first.
- Start by creating a new Figma file when the user needs a fresh library file.
- Switch to a code-implementation workflow when the user wants code generated from an existing Figma design rather than a library built inside Figma.

## Required Workflow

### Step 1: Define the Library Scope

Before editing Figma, identify:

- whether the work targets a new file or an existing library
- the platform scope: web, iOS, Android, or cross-platform
- the foundations required: color, spacing, radius, elevation, typography, icons
- the first component families to build: button, input, chip, card, navigation, modal, table, and so on
- the naming scheme to keep the file consistent

Ask follow-up questions only if they block execution. Otherwise, state assumptions and keep moving.

### Step 2: Create or Audit the File Structure

Set up or normalize the file before building components:

- add clear pages such as `Cover`, `Foundations`, `Components`, and `Patterns`
- place scratch work on a separate sandbox page instead of mixing it into publishable content
- inspect existing variables, styles, and component sets before creating new ones
- keep naming consistent from the start to avoid cleanup later

### Step 3: Build Foundations First

Create foundations before reusable components:

- variables for color, spacing, radius, stroke, opacity, and sizing where supported
- text styles for headings, body, labels, captions, and code or mono text if needed
- effect styles for shadows, blurs, and other repeated effects

Do not hardcode values inside components when a variable or style should exist. Reuse the same foundations across all families.

### Step 4: Build Primitive Component Families

Create the smallest reusable building blocks first:

- buttons
- text inputs and textareas
- selects, chips, badges, toggles, and checkboxes
- cards, list rows, tabs, and navigation items
- icon wrappers or icon-bearing controls when needed

Work one family at a time. After each `use_figma` call, inspect the result before starting the next family.

### Step 5: Add Variants and Component Properties

Convert primitives into maintainable library assets:

- use component sets for variant axes such as `size`, `tone`, `state`, or `emphasis`
- expose text, boolean, and instance-swap properties where consumers will need overrides
- prefer a few meaningful axes over a combinatorial explosion of variants
- split truly different responsibilities into separate components instead of forcing one giant set

### Step 6: Compose Higher-Level Patterns

After primitives are solid, create composed patterns from instances:

- search bars
- form rows
- modal headers and footers
- card headers
- navigation groups

Place these on `Patterns` or `Examples` pages so the core component library remains clean.

### Step 7: Validate Publish Readiness

Before considering the work complete:

- create example frames that show default, hover, focus, disabled, error, selected, and loading states where relevant
- confirm text styles, variables, and effects are bound consistently
- remove detached duplicates and accidental loose layers
- check that components resize correctly with Auto Layout, hug, fill, and min-size expectations
- make sure names are stable enough for downstream use by humans and automation

If the environment supports publishing, publish only after the library is organized and validated.

## Figma Rules

- Prefer variables, styles, and component properties over manual overrides.
- Prefer instances in examples and patterns; do not duplicate component internals by hand.
- Keep page-specific copy out of library components unless the component is intentionally content-opinionated.
- Use consistent naming such as `Category / Component / Variant` or the existing team convention.
- Make mobile and desktop differences explicit through separate families or clear variant axes.
- Keep icons, paddings, radii, and typography aligned to the same foundation system.

## Execution Pattern

When using `use_figma`, keep each run focused:

1. Inspect what already exists.
2. Make one coherent change set.
3. Return created or updated node identifiers, any imported keys, and any unresolved questions.
4. Re-inspect before the next change.

This avoids large brittle scripts and keeps the library structure recoverable if a step needs correction.

## Done Criteria

The skill has succeeded when:

- foundations exist and are reused across the file
- core families are real components or component sets, not loose frames
- important overrides are exposed through properties instead of manual detaching
- a patterns or examples area proves the library is usable
- the file is organized enough to publish or hand off without manual cleanup
