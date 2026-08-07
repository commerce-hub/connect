---
layout: example.11ty.cjs
title: <commerce-hub-connect> | Examples | Design Config
tags: example
name: Design Config
description: Customize merchant-safe colors, spacing, and copy
---

<h3>Design configuration</h3>

```ts
{% raw %}
import 'commerce-hub-connect-sdk';
import type {DesignConfig} from 'commerce-hub-connect-sdk';

const designConfig: DesignConfig = {
  colors: {
    primary: '#084acc',
    text: '#101828',
    copy: '#475467',
    border: '#cbd5e1',
    widgetBackground: '#ffffff',
    paymentMethodBackground: '#f8fafc',
  },
  baseFontSize: '16px',
  baseFontWeight: '400',
  shellPadding: '1.75rem 1.5rem 1.5rem',
  copy: {
    otp: {
      title: 'Verify OTP',
      verifyButton: 'Verify',
    },
    paymentMethods: {
      title: 'Choose payment method',
    },
    noSavedPaymentMethods: {
      title: 'Add payment method',
      addCardTitle: 'Add card',
      addBankAccountTitle: 'Add bank account',
    },
  },
};

const widget = document.querySelector('commerce-hub-connect');

if (widget) {
  widget.designConfig = designConfig;
}
{% endraw %}
```

Every `designConfig` field is optional. Omitted values fall back to SDK
defaults.

`designConfig` is the primary merchant-safe theming API. The widget also
exposes a small additive styling surface for hosts that need framework-friendly
CSS hooks without querying private shadow-DOM class names.

Stable shadow parts:

| Part                 | Surface                               |
| -------------------- | ------------------------------------- |
| `shell`              | Top-level widget shell.               |
| `header`             | Screen header row.                    |
| `title`              | Screen title.                         |
| `content`            | Screen content region.                |
| `footer`             | Pinned screen action footer.          |
| `primary-action`     | Primary CTA button.                   |
| `alert`              | Screen-level alert message.           |
| `payment-method-row` | Saved or selected payment-method row. |
| `provider-frame`     | Pay by Bank provider handoff frame.   |

```css
commerce-hub-connect::part(primary-action) {
  border-radius: 0.5rem;
}
```

Supported CSS custom properties are the stable tokens populated by
`designConfig`: `--chc-primary`, `--chc-text`, `--chc-copy`, `--chc-muted`,
`--chc-placeholder`, `--chc-surface`, `--chc-widget-background`,
`--chc-soft-surface`, `--chc-border`, `--chc-border-strong`,
`--chc-payment-method-background`, `--chc-success`, `--chc-success-bg`,
`--chc-success-border`, `--chc-danger`, `--chc-danger-bg`,
`--chc-danger-border`, `--chc-warning`, `--chc-warning-bg`,
`--chc-warning-border`, `--chc-disabled-text`, `--chc-disabled-surface`,
`--chc-font-weight`, and `--chc-shell-padding`.

Prefer `designConfig` when a matching field exists. Use `::part` or custom
properties only as additive escape hatches; private classes and internal spans
are not part of the public styling contract.

`colors.widgetBorder` maps to the border of the visible 386 × 564 widget shell.
