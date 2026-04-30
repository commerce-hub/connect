import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import type { CommerceHubConnectWebSdkInstance } from 'commerce-hub-connect-sdk';

import { commerceHubConnectWebSdkAdapter } from '../../projects/commerce-hub-connect-sdk/src/lib/commerce-hub-connect-web-sdk-adapter';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  let httpMock: HttpTestingController;
  let widgetInstance: CommerceHubConnectWebSdkInstance & {
    update: jasmine.Spy;
    destroy: jasmine.Spy;
  };

  beforeEach(async () => {
    widgetInstance = {
      containerElement: document.createElement('div'),
      hostElement: document.createElement('div'),
      update: jasmine.createSpy('update').and.resolveTo(),
      destroy: jasmine.createSpy('destroy'),
    } as CommerceHubConnectWebSdkInstance & {
      update: jasmine.Spy;
      destroy: jasmine.Spy;
    };

    spyOn(commerceHubConnectWebSdkAdapter, 'mount').and.resolveTo(widgetInstance);

    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('creates the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('creates interactions through the local proxy route and mounts the Angular binding', async () => {
    const fixture = TestBed.createComponent(AppComponent);
    const component = fixture.componentInstance as AppComponent & {
      createAndMount(): Promise<void>;
      activeInteraction: { (): { interactionId: string } | null };
      statusMessage: { (): string };
      resolvedApiBaseUrl: { (): string };
    };

    fixture.detectChanges();

    const createPromise = component.createAndMount();
    const request = httpMock.expectOne((request) =>
      request.url.endsWith('/commerce-hub-proxy/qa/merchant/interaction/create'),
    );

    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual(
      jasmine.objectContaining({
        authType: 'FINAL_SALE',
        email: 'gregory.jablonski@fiserv.com',
        allowedTenderTypes: ['CARD', 'BANK_ACCOUNT'],
        wallet: true,
        allowEmailChange: true,
      }),
    );

    request.flush({
      interactionId: 'interaction-1',
      status: 'EMAIL_REQUESTED',
      allowedTenderTypes: ['CARD', 'BANK_ACCOUNT'],
      allowEmailChange: true,
    });

    await createPromise;
    fixture.detectChanges();
    await fixture.whenStable();

    expect(component.resolvedApiBaseUrl().endsWith('/commerce-hub-proxy/qa')).toBeTrue();
    expect(component.activeInteraction()?.interactionId).toBe('interaction-1');
    expect(component.statusMessage()).toContain('Mounted interaction interaction-1');
    expect(commerceHubConnectWebSdkAdapter.mount).toHaveBeenCalled();
  });

  it('applies updates and destroys the mounted example state', async () => {
    const fixture = TestBed.createComponent(AppComponent);
    const component = fixture.componentInstance as AppComponent & {
      createAndMount(): Promise<void>;
      applyUpdate(): void;
      destroyBinding(): void;
      form: {
        patchValue(value: {
          environment?: 'dev';
          paymentSelectionTitle?: string;
          allowBankAccount?: boolean;
        }): void;
      };
      activeEnvironment: { (): string };
      activeConfiguration: { (): { paymentSelectionTitle?: string } | null };
      activeInteraction: { (): unknown };
      statusMessage: { (): string };
    };

    fixture.detectChanges();

    const createPromise = component.createAndMount();
    const request = httpMock.expectOne((request) =>
      request.url.endsWith('/commerce-hub-proxy/qa/merchant/interaction/create'),
    );
    request.flush({
      interactionId: 'interaction-2',
      status: 'EMAIL_REQUESTED',
      allowedTenderTypes: ['CARD', 'BANK_ACCOUNT'],
    });

    await createPromise;
    fixture.detectChanges();
    await fixture.whenStable();

    component.form.patchValue({
      environment: 'dev',
      paymentSelectionTitle: 'Updated from Angular',
      allowBankAccount: false,
    });
    component.applyUpdate();
    fixture.detectChanges();

    expect(component.activeEnvironment()).toBe('dev');
    expect(component.activeConfiguration()?.paymentSelectionTitle).toBe('Updated from Angular');
    expect(component.statusMessage()).toContain('Applied the latest host controls');

    component.destroyBinding();
    fixture.detectChanges();

    expect(component.activeInteraction()).toBeNull();
    expect(component.statusMessage()).toContain('Destroyed the mounted Angular binding instance');
  });
});
