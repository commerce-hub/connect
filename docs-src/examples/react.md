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
  DesignConfig,
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
  designConfig?: DesignConfig;
  onPaymentSourceComplete?: (result: {
    selectedPaymentSourceId: string;
    completedPaymentSourceId?: string;
  }) => void;
  onTransferComplete?: (transactionId: string) => void;
}

export function CheckoutPayment({
  interactionResponse,
  designConfig,
  onPaymentSourceComplete,
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
    widget.designConfig = designConfig;
  }, [designConfig, interactionResponse]);

  useEffect(() => {
    const widget = widgetRef.current;

    if (!widget) {
      return;
    }

    const handleSelect = async (event: Event) => {
      const {detail: paymentSource} = event as OnSelectEvent;
      const completedPaymentSource = await fetch(
        `/api/commercehub/interaction/${encodeURIComponent(
          interactionResponse.interactionId ?? ''
        )}/complete`,
        {method: 'GET'}
      ).then((response) => response.json());

      onPaymentSourceComplete?.({
        selectedPaymentSourceId: paymentSource.id,
        completedPaymentSourceId: completedPaymentSource.id,
      });
    };
    const handleTransfer = (event: Event) => {
      const {detail: transaction} = event as OnTransferEvent;
      onTransferComplete?.(transaction.id);
    };

    widget.addEventListener('onSelect', handleSelect);
    widget.addEventListener('onTransfer', handleTransfer);

    return () => {
      widget.removeEventListener('onSelect', handleSelect);
      widget.removeEventListener('onTransfer', handleTransfer);
    };
  }, [interactionResponse, onPaymentSourceComplete, onTransferComplete]);

  return <commerce-hub-connect ref={widgetRef}></commerce-hub-connect>;
}
{% endraw %}
```

Assign object values such as `interactionResponse` and `designConfig` through
the DOM element ref instead of serializing them as HTML attributes. Register SDK
custom events with `addEventListener` so the same `onSelect` and `onTransfer`
event contracts work across React versions. Keep the merchant completion call
host-owned after `onSelect`; the widget does not complete the interaction for
React.
