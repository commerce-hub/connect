# commerce-hub-connect-sdk

Thin Angular binding over `commerce-hub-connect-web-sdk`.

## What ships

This package provides a standalone Angular component, `CommerceHubConnectWebSdkComponent`, that delegates wallet rendering to the framework-agnostic web SDK while keeping Angular-specific lifecycle handling in the wrapper.

## Build

```bash
ng build commerce-hub-connect-sdk
```

## Basic usage

```ts
import { Component } from '@angular/core';
import {
  CommerceHubConnectWebSdkComponent,
  type CommerceHubSdkConfiguration,
  type InteractionResponse,
} from 'commerce-hub-connect-sdk';

@Component({
  standalone: true,
  imports: [CommerceHubConnectWebSdkComponent],
  template: `
    <commerce-hub-connect-web-sdk
      [interaction]="interaction"
      [configuration]="configuration"
      environment="qa"
    />
  `,
})
export class DemoComponent {
  interaction: InteractionResponse = {
    interactionId: 'interaction-1',
    status: 'EMAIL_REQUESTED',
    allowedTenderTypes: ['CARD'],
  };

  configuration: CommerceHubSdkConfiguration = {
    onSuccess: (result) => console.log('success', result),
    onError: (error) => console.error('error', error),
  };
}
```

The Angular binding re-exports the web SDK types so Angular hosts can share one typed configuration model with browser-host integrations.

## Tests

```bash
ng test commerce-hub-connect-sdk
```
