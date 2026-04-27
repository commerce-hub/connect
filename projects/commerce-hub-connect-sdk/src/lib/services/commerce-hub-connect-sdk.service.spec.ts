import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import type { InteractionResponse } from '../models/api.models';
import type { CommerceHubSdkConfiguration } from '../models/sdk.models';
import { COMMERCE_HUB_CONNECT_API_BASE_URL } from './commerce-hub-connect-api-base-url.token';
import { CommerceHubConnectSdkService } from './commerce-hub-connect-sdk.service';

describe('CommerceHubConnectSdkService', () => {
  let service: CommerceHubConnectSdkService;
  let httpMock: HttpTestingController;
  const paymentSdkUrl = 'https://sdk.example.test/PaymentSDK.js';
  const defaultPaymentSdkUrl = 'https://connect-qa.fiservapis.com/pbb/sdk/web/v2/js/PaymentSDK.js';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        CommerceHubConnectSdkService,
        {
          provide: COMMERCE_HUB_CONNECT_API_BASE_URL,
          useValue: () => 'http://localhost:8080',
        },
      ],
    });

    service = TestBed.inject(CommerceHubConnectSdkService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    delete window.PaymentSDK;
    document
      .querySelectorAll(`script[src="${paymentSdkUrl}"], script[src="${defaultPaymentSdkUrl}"]`)
      .forEach((script) => script.remove());
  });

  it('initializes from a pre-created interaction without creating a new one', async () => {
    const interaction: InteractionResponse = {
      interactionId: 'interaction-1',
      status: 'EMAIL_REQUESTED',
      email: 'merchant@example.com',
      paymentSources: [],
      allowedTenderTypes: ['CARD', 'BANK_ACCOUNT'],
      allowEmailChange: true,
    };

    const configuration: CommerceHubSdkConfiguration = {
      onSuccess: () => undefined,
      onError: () => undefined,
      wallet: true,
    };

    const initializePromise = service.initialize(interaction, configuration);

    await expectAsync(initializePromise).toBeResolvedTo(interaction);
    httpMock.expectNone('http://localhost:8080/merchant/interaction/create');
    expect(service.interaction()).toEqual(interaction);
    expect(service.selectedTenderType()).toBe('CARD');
  });

  it('passes configured pay by bank options through to PaymentSDK.init', async () => {
    const interaction: InteractionResponse = {
      interactionId: 'interaction-1',
      status: 'PAYMENT_SOURCE_REQUESTED',
      email: 'merchant@example.com',
      paymentSources: [],
      allowedTenderTypes: ['BANK_ACCOUNT'],
      allowEmailChange: true,
    };

    const configuration: CommerceHubSdkConfiguration = {
      onSuccess: () => undefined,
      onError: () => undefined,
      wallet: true,
      payByBank: {
        apiKey: 'merchant-api-key',
        configId: 'merchant-config-id',
        paymentSdkUrl,
        environment: 'cat',
        locale: 'es-US',
        useSandbox: true,
      },
    };

    await service.initialize(interaction, configuration);

    const existingScript = document.createElement('script');
    existingScript.src = paymentSdkUrl;
    document.head.appendChild(existingScript);

    const fallbackScript = document.createElement('script');
    fallbackScript.src = defaultPaymentSdkUrl;
    document.head.appendChild(fallbackScript);

    const paymentSdkInit = jasmine.createSpy('init').and.callFake((options: { onEvent: (event: { type: string }) => void }) => {
      options.onEvent({ type: 'cancel' });
    });
    window.PaymentSDK = {
      init: paymentSdkInit,
      destroy: jasmine.createSpy('destroy'),
    };

    const launchPromise = service.launchPayByBank('pay-by-bank-container');

    const existingProfileRequest = httpMock.expectOne('http://localhost:8080/customer');
    expect(existingProfileRequest.request.method).toBe('GET');
    existingProfileRequest.flush(
      { message: 'profile unavailable for this test' },
      { status: 500, statusText: 'Server Error' },
    );

    await new Promise((resolve) => setTimeout(resolve, 0));

    const [sessionRequest] = httpMock.match('http://localhost:8080/pbb/session');
    expect(sessionRequest).toBeDefined();
    expect(sessionRequest.request.method).toBe('GET');
    sessionRequest.flush({
      aggregatorSessionId: 'agg-session-1',
      tokenID: 'access-token-1',
      pToken: 'p-token-1',
      publicKey: 'public-key-1',
    });

    await expectAsync(launchPromise).toBeRejected();

    expect(paymentSdkInit).toHaveBeenCalledWith(
      jasmine.objectContaining({
        apiKey: 'merchant-api-key',
        configId: 'merchant-config-id',
        environment: 'cat',
        locale: 'es-US',
        containerId: 'pay-by-bank-container',
        aggregatorSessionId: 'agg-session-1',
        accessToken: 'access-token-1',
        pToken: 'p-token-1',
        publicKey: 'public-key-1',
      }),
    );
  });
});
