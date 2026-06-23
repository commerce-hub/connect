---
layout: example.11ty.cjs
title: <commerce-hub-connect> | Examples | React
tags: example
name: React
description: Bind SDK properties from a React component
---

<h3>React component</h3>

```tsx
{% raw %}
import {useEffect, useRef} from 'react';
import type {DetailedHTMLProps, HTMLAttributes} from 'react';
import 'commerce-hub-connect-sdk';
import type {
  CommerceHubBaseURLInput,
  CommerceHubConnect,
  InteractionResponse,
  OnSelectEvent,
  OnTransferEvent,
} from 'commerce-hub-connect-sdk';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'commerce-hub-connect': DetailedHTMLProps<
        HTMLAttributes<CommerceHubConnect>,
        CommerceHubConnect
      >;
    }
  }
}

const baseUrl: CommerceHubBaseURLInput = 'QA';

interface CheckoutPaymentProps {
  interactionResponse: InteractionResponse;
  onSelectedPaymentSourceChange?: (paymentSourceId: string) => void;
  onTransferComplete?: (transactionId: string) => void;
}

export function CheckoutPayment({
  interactionResponse,
  onSelectedPaymentSourceChange,
  onTransferComplete,
}: CheckoutPaymentProps) {
  const widgetRef = useRef<CommerceHubConnect | null>(null);

  useEffect(() => {
    const widget = widgetRef.current;

    if (!widget) {
      return;
    }

    widget.baseURL = baseUrl;
    widget.interactionResponse = interactionResponse;
  }, [interactionResponse]);

  useEffect(() => {
    const widget = widgetRef.current;

    if (!widget) {
      return;
    }

    const handleSelect = (event: OnSelectEvent) => {
      onSelectedPaymentSourceChange?.(event.detail.id);
    };
    const handleTransfer = (event: OnTransferEvent) => {
      onTransferComplete?.(event.detail.id);
    };

    widget.addEventListener('onSelect', handleSelect);
    widget.addEventListener('onTransfer', handleTransfer);

    return () => {
      widget.removeEventListener('onSelect', handleSelect);
      widget.removeEventListener('onTransfer', handleTransfer);
    };
  }, [onSelectedPaymentSourceChange, onTransferComplete]);

  return <commerce-hub-connect ref={widgetRef}></commerce-hub-connect>;
}
{% endraw %}
```

Assign object values such as `interactionResponse` through the DOM element ref
instead of serializing them as HTML attributes. Register SDK custom events with
`addEventListener` so the same `onSelect` and `onTransfer` event contracts work
across React versions.
