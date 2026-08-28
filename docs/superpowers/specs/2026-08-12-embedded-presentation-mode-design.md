# Embedded Presentation Mode Design

## Goal

Allow `<commerce-hub-connect>` to work as either a dialog-sized widget or an inline, parent-responsive component. Preserve the current dialog presentation as the default so existing integrations do not change.

## Public API

Export a `CommerceHubPresentationMode` type with two values:

```ts
type CommerceHubPresentationMode = 'dialog' | 'embedded';
```

Add a reactive `presentationMode` property and reflected `presentation-mode` attribute to the public custom element. Its default is `dialog`.

```ts
widget.presentationMode = 'embedded';
```

Angular consumers may use `[presentationMode]="'embedded'"`. The property is independent of `designConfig` because presentation semantics are not merchant theming.

## Dialog Mode

Dialog mode retains the current viewport-relative shell size, minimum height, internal scrolling, border, radius, shadow, and mobile viewport breakpoint behavior. This is the backward-compatible default.

## Embedded Mode

The custom-element host is a block-level inline-size container. Its shell fills the available parent width, has no dialog shadow, and does not impose the dialog width, height, or minimum height.

With no host height constraint, the shell and central content grow naturally and the page owns scrolling. If the host gives `<commerce-hub-connect>` a definite height, the shell fills that height, keeps its header and footer pinned, and scrolls only `.widget-content`.

Embedded responsive changes use container queries against the custom element rather than viewport media queries. At narrow container widths, multi-column forms and payment footers become one column, header actions and toolbars use the full width, row copy may wrap, and sheets fill the embedded shell. Viewport queries remain available for dialog mode only.

The SDK does not define an arbitrary embedded maximum height. The host owns any height policy.

## Accessibility and Behavior

Presentation mode changes layout only. Interaction state, events, focus behavior, keyboard controls, API calls, copy, and payment workflows remain identical. Existing shadow parts and design tokens remain supported.

## Testing and Documentation

Tests cover the default value, property and attribute assignment, mode class/attribute rendering, dialog CSS preservation, embedded width and height behavior, and container-query rules. README and framework examples document natural-height and host-bounded embedded integrations.

## Out of Scope

The Northstar showcase is not part of the wallet SDK source or SDK-hosted demos. It is implemented only in the Angular demo application.
