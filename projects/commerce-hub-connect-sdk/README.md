# commerce-hub-connect-sdk

Thin Angular binding over `commerce-hub-connect-web-sdk`.

## What ships

This package provides a standalone Angular component, `CommerceHubConnectWebSdkComponent`, that delegates wallet rendering to the framework-agnostic web SDK while keeping Angular-specific lifecycle handling in the wrapper.

## Build

```bash
ng build commerce-hub-connect-sdk
```

## Angular example host

The workspace root Angular app is the local example host for this binding.

```bash
npm run start:angular-binding-example
```

The example mirrors the web SDK host flow: create an interaction, mount the widget, apply updates, and destroy the binding while proxying localhost Commerce Hub calls through `/commerce-hub-proxy/<environment>`.

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
ng test commerce-hub-connect-sdk --watch=false --browsers=ChromeHeadless
npm run test:angular-binding-example
```
