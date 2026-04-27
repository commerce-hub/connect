import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import type { CommerceHubSdkConfiguration, CommerceHubSdkError, CommerceHubSdkFlowStep } from '../models/sdk.models';
import type { CommerceHubTenderType, InteractionResponse } from '../models/api.models';
import { CommerceHubConnectApiService } from '../services/commerce-hub-connect-api.service';
import { CommerceHubConnectSdkService } from '../services/commerce-hub-connect-sdk.service';
import { CommerceHubPciVaultService } from '../services/commerce-hub-pci-vault.service';
import { CommerceHubConnectCaptureComponent } from './capture-payment.component';

class MockCommerceHubConnectSdkService {
  private readonly interactionState = signal<InteractionResponse | null>(null);

  readonly interaction = this.interactionState.asReadonly();
  readonly otpDeliveryResponse = signal(null).asReadonly();
  readonly loading = signal(false).asReadonly();
  readonly submitting = signal(false).asReadonly();
  readonly bankLinkLoading = signal(false).asReadonly();
  readonly lastError = signal<CommerceHubSdkError | null>(null).asReadonly();
  readonly selectedTenderType = signal<CommerceHubTenderType>('CARD').asReadonly();
  readonly supportedTenderTypes = signal<CommerceHubTenderType[]>(['CARD']).asReadonly();
  readonly currentStep = signal<CommerceHubSdkFlowStep>('email').asReadonly();

  readonly setConfiguration = jasmine.createSpy('setConfiguration');
  readonly initialize = jasmine
    .createSpy('initialize')
    .and.callFake((interaction: InteractionResponse) => {
      this.interactionState.set(interaction);
      return Promise.resolve(interaction);
    });
  readonly sendOtp = jasmine
    .createSpy('sendOtp')
    .and.callFake((email: string) =>
      Promise.resolve({
        interactionId: 'interaction-1',
        status: 'OTP_VALIDATION_PENDING',
        email,
      } satisfies InteractionResponse),
    );
  readonly validateOtp = jasmine.createSpy('validateOtp').and.returnValue(
    of({
      interactionId: 'interaction-1',
      status: 'PAYMENT_SOURCE_REQUESTED',
    } satisfies InteractionResponse),
  );
  readonly attachExistingPaymentSource = jasmine.createSpy('attachExistingPaymentSource');
  readonly launchPayByBank = jasmine.createSpy('launchPayByBank');
  readonly selectTenderType = jasmine.createSpy('selectTenderType');
}

describe('CommerceHubConnectCaptureComponent', () => {
  let fixture: ComponentFixture<CommerceHubConnectCaptureComponent>;
  let component: CommerceHubConnectCaptureComponent;
  let sdk: MockCommerceHubConnectSdkService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommerceHubConnectCaptureComponent],
    })
      .overrideComponent(CommerceHubConnectCaptureComponent, {
        set: {
          providers: [
            {
              provide: CommerceHubConnectSdkService,
              useClass: MockCommerceHubConnectSdkService,
            },
            {
              provide: CommerceHubPciVaultService,
              useValue: {},
            },
            {
              provide: CommerceHubConnectApiService,
              useValue: {},
            },
          ],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(CommerceHubConnectCaptureComponent);
    component = fixture.componentInstance;
    sdk = fixture.debugElement.injector.get(
      CommerceHubConnectSdkService,
    ) as unknown as MockCommerceHubConnectSdkService;
  });

  it('prefers configuration.email for OTP sending when interaction.email is masked', async () => {
    const interaction: InteractionResponse = {
      interactionId: 'interaction-1',
      status: 'EMAIL_REQUESTED',
      email: 'm*****@example.com',
      allowEmailChange: false,
      allowedTenderTypes: ['CARD'],
      paymentSources: [],
    };
    const configuration: CommerceHubSdkConfiguration = {
      email: 'merchant@example.com',
      onSuccess: () => undefined,
      onError: () => undefined,
      wallet: true,
    };

    fixture.componentRef.setInput('interaction', interaction);
    fixture.componentRef.setInput('configuration', configuration);
    fixture.detectChanges();
    await fixture.whenStable();

    expect((component as any).emailForm.getRawValue().email).toBe('merchant@example.com');

    await (component as any).submitEmail();

    expect(sdk.sendOtp).toHaveBeenCalledWith('merchant@example.com', 'default');
  });
});
