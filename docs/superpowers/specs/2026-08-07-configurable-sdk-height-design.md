# Configurable SDK Height Design

## Goal

Allow an embedding application to increase the CommerceHub Connect widget height without removing the SDK's viewport safety limit.

## Public API

Expose the CSS custom property `--chc-shell-height`. Its default value is `35.25rem`, preserving current behavior.

```css
commerce-hub-connect {
  --chc-shell-height: 42rem;
}
```

The widget shell uses the configured value while remaining capped by the available viewport:

```css
height: min(var(--chc-shell-height), calc(100dvh - 1.5rem));
```

The existing `20rem` minimum height and mobile full-viewport behavior remain unchanged. Overflowing content continues to scroll inside the widget.

## Documentation and Testing

Document the variable in the component API, README, and design configuration guide. Add style tests proving the default token and shell usage are present.
