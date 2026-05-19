# Embedded Widget Premium Minimal Design

## Summary

Refresh the embedded widget screens to feel more modern, compact, and premium
without reducing white-label flexibility. The redesign should improve visual
hierarchy, density, and polish across the existing widget flows while keeping
behavior, public APIs, and integration patterns unchanged.

## Goals

- Update the embedded widget to a compact premium-minimal visual direction.
- Preserve white-label capability through the existing `designConfig` copy and
  color overrides plus existing CSS custom property overrides.
- Keep the current interaction flow structure and business behavior intact.
- Improve the perceived quality of shared primitives such as shells, buttons,
  fields, alerts, selection rows, and outcome states.
- Maintain accessibility and keyboard usability across all screens.

## Non-Goals

- No redesign of the static demo shell in `dev/` or documentation shell in
  `docs-src/`.
- No change to API client behavior, interaction-response handling, or payment
  flow logic.
- No new runtime font dependency or branded visual system that host apps must
  adopt.
- No changes to generated files under `src/generated/`.

## Approved Direction

The approved direction is `premium minimal`, but compact rather than airy.

- Quiet, high-trust visual language with restrained defaults.
- Near-white surfaces, charcoal text, cool neutral borders, and a controlled
  dark-ink primary tone by default.
- Tighter spacing rhythm: compact gaps, shorter section breaks, and less card
  chrome.
- Controls should remain accessible but denser, targeting roughly `44px`
  control height instead of the current roomier layout.
- Payment rows, OTP inputs, alerts, and outcome cards should feel cleaner and
  less bulky while preserving clarity.
- Motion should stay minimal and respectful of `prefers-reduced-motion`.

## White-Label Strategy

The redesign must remain token-driven and host-friendly.

- Keep the existing `DesignConfig` surface unchanged:
  `colors`, `baseFontSize`, `baseFontWeight`, `shellPadding`, and `copy`.
- Continue to honor existing CSS custom property overrides such as
  `--chc-font-family` and the widget color tokens.
- Improve the defaults by refining internal spacing, radius, shadow, focus, and
  state styling rather than by introducing a fixed brand identity.
- Avoid remote font loading. Default typography should remain neutral and
  embeddable.
- Keep copy generic and reusable for merchants embedding the SDK in different
  branded contexts.
- If any extra CSS variables are introduced internally, they must be optional
  and fallback-based so current integrations keep working without changes.

## Approach

- Retune the shared style tokens in `src/internal/styles.ts` to use a more
  compact premium-minimal baseline.
- Keep markup changes small and local to shared primitives unless a structural
  adjustment is necessary for better alignment or state treatment.
- Reduce shell padding and visual weight while keeping enough separation between
  title, subtitle, content, and footer areas.
- Update buttons and fields to feel more premium through tighter radii, more
  deliberate focus states, calmer fills, and improved hover/selected states.
- Refine payment method rows and add-source actions so the list feels cleaner,
  tighter, and easier to scan.
- Tighten OTP, alert, empty, provider, detail, upload, loading, and outcome
  surfaces to match the compact system.
- Preserve existing flow copy and behavior unless a tiny structural hook is
  required for visual consistency.

## Screen Coverage

The redesign applies to all embedded widget-owned screens:

- OTP verification
- Saved payment methods list
- Selected payment method summary
- No saved payment methods state
- Add credit card form
- Credit card error state
- Bank provider container view
- Bank provider error state
- Bank outcome state

## Files

- `src/internal/styles.ts`
  Purpose: main density, token, and primitive styling refresh.
- `src/internal/primitives.ts`
  Purpose: minimal markup adjustments when needed for compact alignment and
  clearer premium state treatment.
- `src/internal/types.ts`
  Purpose: primitive option updates only if required by markup changes.
- `src/commerce-hub-connect.ts`
  Purpose: screen-level hooks or class usage only if necessary; no behavior
  changes.
- `src/test/commerce-hub-connect-primitives_test.ts`
  Purpose: primitive structure or class regressions if markup changes.
- `src/test/commerce-hub-connect-flow_test.ts`
  Purpose: screen-level regressions where compact redesign touches rendered
  structure.

## Testing Strategy

Use TDD for any behavior-adjacent markup or structure updates.

- Start with focused tests if a primitive structure or screen rendering contract
  needs to change.
- Verify existing tests still describe the supported widget behavior after the
  visual refresh.
- Run at minimum the focused widget tests affected by the redesign during
  iteration.
- Run `npm run build` and relevant browser tests before calling the work
  complete.

## Risks And Guardrails

- Do not hardcode a strong brand voice or house aesthetic that competes with
  merchant theming.
- Do not reduce contrast or focus visibility in pursuit of minimalism.
- Do not make controls visually compact by shrinking hit targets below usable
  size.
- Do not expand scope into demo/docs restyling during this pass.
