import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

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

  it('passes merchantId, terminalId, and clientId when creating an interaction', async () => {
    const configuration: CommerceHubSdkConfiguration = {
      sessionReferenceId: 'session-1',
      authType: 'FINAL_SALE',
      merchantId: '100014000315473',
      terminalId: '10000001',
      clientId: 'laika',
      onSuccess: () => undefined,
      onError: () => undefined,
    };

    const initializePromise = service.initialize(configuration);

    const request = httpMock.expectOne('http://localhost:8080/merchant/interaction/create');

    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual(
      jasmine.objectContaining({
        sessionReferenceId: 'session-1',
        authType: 'FINAL_SALE',
        merchantId: '100014000315473',
        terminalId: '10000001',
        clientId: 'laika',
      }),
    );

    request.flush({
      interactionId: 'interaction-1',
      status: 'EMAIL_REQUESTED',
      paymentSources: [],
      allowedTenderTypes: ['CARD', 'BANK_ACCOUNT'],
      allowEmailChange: true,
    });

    await expectAsync(initializePromise).toBeResolved();
  });
});
