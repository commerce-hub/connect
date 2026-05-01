import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import type * as webSdk from './commerce-hub-connect-web-sdk-types';

import { CommerceHubConnectWebSdkComponent } from './commerce-hub-connect-web-sdk.component';
import { commerceHubConnectWebSdkAdapter } from './commerce-hub-connect-web-sdk-adapter';

@Component({
  standalone: true,
  imports: [CommerceHubConnectWebSdkComponent],
  template: `
    <commerce-hub-connect-web-sdk
      [interaction]="interaction"
      [configuration]="configuration"
      [whiteLabel]="whiteLabel"
      [environment]="environment"
      (success)="successEvents.push($event)"
      (error)="errorEvents.push($event)"
    />
  `,
})
class HostComponent {
  readonly successEvents: webSdk.CommerceHubSuccessResult[] = [];
  readonly errorEvents: webSdk.CommerceHubSdkError[] = [];

  interaction: webSdk.InteractionResponse = {
    interactionId: 'interaction-1',
    status: 'EMAIL_REQUESTED',
    allowedTenderTypes: ['CARD'],
  };

  configuration: webSdk.CommerceHubSdkConfiguration = {
    onSuccess: jasmine.createSpy('onSuccess'),
    onError: jasmine.createSpy('onError'),
    paymentSelectionTitle: 'Saved payment methods',
  };

  whiteLabel: webSdk.CommerceHubWhiteLabelOptions = {
    primaryColor: '#0a5dff',
  };

  environment: webSdk.CommerceHubConnectEnvironment = 'qa';
}

describe('CommerceHubConnectWebSdkComponent', () => {
  let fixture: ComponentFixture<HostComponent>;
  let host: HostComponent;
  let mountSpy: jasmine.Spy<typeof commerceHubConnectWebSdkAdapter.mount>;
  let widgetInstance: webSdk.CommerceHubConnectWebSdkInstance & {
    update: jasmine.Spy;
    destroy: jasmine.Spy;
  };

  beforeEach(async () => {
    widgetInstance = {
      containerElement: document.createElement('div'),
      hostElement: document.createElement('div'),
      update: jasmine.createSpy('update').and.resolveTo(),
      destroy: jasmine.createSpy('destroy'),
    } as unknown as webSdk.CommerceHubConnectWebSdkInstance & {
      update: jasmine.Spy;
      destroy: jasmine.Spy;
    };

    mountSpy = spyOn(commerceHubConnectWebSdkAdapter, 'mount').and.resolveTo(widgetInstance);

    await TestBed.configureTestingModule({
      imports: [HostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HostComponent);
    host = fixture.componentInstance;
  });

  it('mounts the web sdk with the current Angular inputs', async () => {
    fixture.detectChanges();
    await fixture.whenStable();

    const bindingHost = fixture.nativeElement.querySelector(
      'commerce-hub-connect-web-sdk',
    ) as HTMLElement | null;

    expect(mountSpy).toHaveBeenCalledTimes(1);
    expect(bindingHost?.dataset['commerceHubConnectAngularBinding']).toBe('true');
    expect(mountSpy.calls.mostRecent().args[0]).toEqual(jasmine.any(HTMLDivElement));
    expect(mountSpy.calls.mostRecent().args[1]).toEqual(
      jasmine.objectContaining({
        interaction: host.interaction,
        whiteLabel: host.whiteLabel,
        replaceContents: true,
      }),
    );
    expect(mountSpy.calls.mostRecent().args[2]).toBe('qa');
    expect(mountSpy.calls.mostRecent().args[3]).toBe('./CommerceHubConnectSDK.js');
    expect(widgetInstance.update).not.toHaveBeenCalled();
  });

  it('delegates Angular input changes through the widget update lifecycle', async () => {
    fixture.detectChanges();
    await fixture.whenStable();

    host.whiteLabel = { primaryColor: '#1d4ed8' };
    host.interaction = {
      ...host.interaction,
      status: 'PAYMENT_SOURCE_REQUESTED',
      paymentSources: [
        {
          id: 'card-1',
          name: 'Primary Visa',
          tenderType: 'CARD',
          card: {
            cardNumber: '4111111111111111',
            cvv: '***',
            expirationMonth: '12',
            expirationYear: '30',
            nameOnCard: 'Smoke Tester',
            network: 'Visa',
          },
        },
      ],
    };

    fixture.detectChanges();
    await fixture.whenStable();

    expect(widgetInstance.update).toHaveBeenCalledTimes(1);
    expect(widgetInstance.update.calls.mostRecent().args[0]).toEqual(
      jasmine.objectContaining({
        interaction: host.interaction,
        whiteLabel: host.whiteLabel,
      }),
    );
    expect(widgetInstance.update.calls.mostRecent().args[1]).toBe('qa');
  });

  it('emits Angular outputs while preserving the supplied configuration callbacks', async () => {
    fixture.detectChanges();
    await fixture.whenStable();

    const mountOptions = mountSpy.calls.mostRecent().args[1] as webSdk.CommerceHubConnectWebSdkMountOptions;
    const successResult: webSdk.CommerceHubSuccessResult = {
      interaction: host.interaction,
      paymentSourceId: 'card-1',
      tenderType: 'CARD',
    };
    const sdkError: webSdk.CommerceHubSdkError = {
      message: 'mount failed',
      stage: 'mount',
    };

    mountOptions.configuration.onSuccess(successResult);
    mountOptions.configuration.onError(sdkError);

    expect(host.configuration.onSuccess).toHaveBeenCalledWith(successResult);
    expect(host.configuration.onError).toHaveBeenCalledWith(sdkError);
    expect(host.successEvents).toEqual([successResult]);
    expect(host.errorEvents).toEqual([sdkError]);
  });

  it('destroys the delegated widget instance when Angular tears down the host', async () => {
    fixture.detectChanges();
    await fixture.whenStable();

    fixture.destroy();
    await Promise.resolve();

    expect(widgetInstance.destroy).toHaveBeenCalledTimes(1);
  });
});
