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
      title: 'Confirm your email',
      verifyButton: 'Verify',
    },
    paymentMethods: {
      title: 'Choose payment method',
      continueButton: 'Use selected method',
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
