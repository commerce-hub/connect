# commerce-hub-connect-sdk

Thin Angular binding over `commerce-hub-connect-web-sdk`.

## What ships

- `CommerceHubConnectWebSdkComponent` — an Angular wrapper that delegates mount/update/unmount to the framework-agnostic web SDK
- `example/example-app.component.ts` — a local example host mirroring the web SDK create/mount/update/destroy flow
- `example/fixture-app.component.ts` + `fixture.html` — a smoke-test fixture that verifies the wrapper lifecycle in a browser

## Build

```bash
ng build commerce-hub-connect-sdk
```

## Run the Angular example

From the workspace root:

```bash
npm run start:angular-binding-example
```

The Angular dev server proxies localhost Commerce Hub traffic through `/commerce-hub-proxy/<environment>` so the binding example can create live interactions just like the plain web SDK and React example hosts.

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

## Verification

```bash
ng build commerce-hub-connect-sdk
ng test commerce-hub-connect-sdk --watch=false --browsers=ChromeHeadless
npm run test:angular-binding-example
node ../../scripts/run-angular-binding-smoke-test.mjs
```
