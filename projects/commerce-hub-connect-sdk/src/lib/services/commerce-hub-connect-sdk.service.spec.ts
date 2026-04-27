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
});
