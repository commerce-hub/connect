---
name: figma-implement-design
description: Implement application UI from Figma into production code. Use when the user wants a Figma frame, flow, component, modal, dashboard, form, or screen translated into the codebase; when they ask to "build this from Figma", "match the design", "implement this node", or "turn this mock into code"; or when Figma MCP context should drive code changes while reusing the project's components, tokens, and architecture.
---

# Implement Figma Design

Use this skill to translate Figma nodes into production code while preserving project conventions. Treat Figma MCP output as design intent and behavior reference, not as final code style.

## Skill Boundaries

- Use this skill when the source of truth is a Figma file, frame, or node and the deliverable is code.
- Use this skill for pages, sections, reusable components, dialogs, forms, tables, and dashboard views derived from Figma.
- Do not use this skill to create or edit Figma files directly; use a Figma-authoring workflow for that.
- Do not copy generated React or Tailwind literally into the codebase unless the project already uses those exact conventions.

## Required Workflow

Follow this sequence. Do not skip the context and verification steps.

### Step 1: Resolve Scope and Target

Identify:

- the exact Figma file and node or frame to implement
- the target surface in code: new component, existing component update, page, or feature
- the framework and styling system already used by the project
- any existing design-system or implementation rules the repo already carries

If the user gives a broad file without a specific node, narrow to the exact frame before implementing.

### Step 2: Gather Figma Context First

Always fetch structured design context before writing code:

1. Run `get_design_context` for the exact node or frame.
2. If the response is too large, run `get_metadata` to map the file, then fetch only the needed node subtree with `get_design_context`.
3. Run `get_screenshot` for the same node or variant so you can verify visuals and layout.

Do not start implementation from the screenshot alone. The screenshot is the visual reference; `get_design_context` is the structural source of truth.

### Step 3: Read the Codebase Before Choosing an Implementation

Inspect the codebase to answer:

- whether an equivalent component already exists
- where design tokens live
- what layout primitives the project uses
- how states, variants, and props are modeled
- how assets, icons, routing, and data loading are handled

If the repository has Figma-specific design-system rules, follow them before inventing new patterns.

### Step 4: Map the Design to Existing Primitives

Before building anything new, create a translation map:

- Figma typography -> project text styles or component variants
- Figma colors -> project tokens or variables
- Figma spacing and radius -> project spacing scale and shape tokens
- Figma controls -> existing buttons, inputs, cards, tabs, tables, and layout shells
- Figma interactions -> existing state patterns such as hover, focus, open, selected, disabled, loading, and error

Prefer composition of existing components over one-off markup that merely looks similar.

### Step 5: Implement in Small Vertical Slices

Do not attempt the entire screen in one pass unless it is trivial. Break the work into coherent slices:

- shell and layout
- repeated cards or rows
- form sections
- navigation or header areas
- supporting assets and icons

After each slice, compare the running UI against the screenshot and the structured Figma context before moving on.

### Step 6: Handle Assets Correctly

- If the Figma MCP response includes localhost-served assets, use those directly.
- Do not introduce placeholder art or a new icon library when the design already provides assets.
- Preserve SVGs where appropriate; use the project's existing image pipeline for raster assets.
- Store assets where the project convention expects them, not wherever is convenient in the moment.

### Step 7: Validate Behavior and Visual Parity

Before calling the work done:

- compare spacing, alignment, typography, radii, shadows, and colors against the screenshot
- verify states such as hover, focus, disabled, selected, loading, empty, and error when relevant
- test responsive behavior if the design implies multiple breakpoints
- confirm accessibility requirements still hold after the visual implementation
- run the project's normal verification path: build, tests, lint, or screenshot checks as applicable

## Implementation Rules

- Reuse existing components whenever a close match exists.
- Prefer project tokens and variables over hardcoded values.
- Treat Figma MCP code output as a hint, not a final patch.
- Preserve architectural boundaries: routing, state, data fetching, and accessibility patterns stay owned by the codebase.
- Name new components and files according to the repository's conventions.
- Avoid pixel-perfect hacks that fight the existing layout system unless the design truly requires them.

## When to Create New Components

Create a new component only when at least one of these is true:

- the design introduces a reusable pattern the codebase does not already have
- existing components cannot express the required states or structure without awkward overrides
- reuse would produce more code complexity than a focused new primitive

When you add a new component, keep it general enough to be reused by the rest of the feature set implied by the design.

## Done Criteria

The skill has succeeded when:

- the implemented UI matches the relevant Figma node closely
- the code follows the repository's actual architecture and styling conventions
- existing primitives were reused where appropriate
- assets and states are handled correctly
- the result is verified in the running app or project validation path, not only by code inspection
