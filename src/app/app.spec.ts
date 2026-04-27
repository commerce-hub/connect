import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { COMMERCE_HUB_CONNECT_API_BASE_URL } from 'commerce-hub-connect-sdk';

import { AppComponent } from './app.component';

describe('AppComponent', () => {
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: COMMERCE_HUB_CONNECT_API_BASE_URL,
          useValue: () => '/api',
        },
      ],
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

  it('creates interactions with nested merchantData', async () => {
    const fixture = TestBed.createComponent(AppComponent);
    const component = fixture.componentInstance as AppComponent & {
      demoForm: { getRawValue(): { allowBankAccount: boolean; allowCard: boolean; allowEmailChange: boolean } };
      initializeSdk(): Promise<void>;
    };
    const formValue = component.demoForm.getRawValue();
    const allowedTenderTypes = [
      ...(formValue.allowCard ? ['CARD'] : []),
      ...(formValue.allowBankAccount ? ['BANK_ACCOUNT'] : []),
    ];

    const initializePromise = component.initializeSdk();

    const request = httpMock.expectOne('/api/merchant/interaction/create');

    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual(
      jasmine.objectContaining({
        sessionReferenceId: 'sdk-demo-session-20260421',
        merchantTransactionId: 'txn-10001',
        merchantOrderId: 'order-20002',
        merchantInvoiceNumber: 'invoice-30003',
        authType: 'FINAL_SALE',
        expiryMinutes: 10,
        email: 'gregory.jablonski@fiserv.com',
        allowedTenderTypes,
        allowEmailChange: formValue.allowEmailChange,
        wallet: true,
        merchantData: {
          clientId: 'laika',
          merchantId: '100014000315473',
          terminalId: '10000001',
        },
      }),
    );

    request.flush({
      interactionId: 'interaction-1',
      status: 'EMAIL_REQUESTED',
      email: 'gregory.jablonski@fiserv.com',
      allowEmailChange: formValue.allowEmailChange,
      allowedTenderTypes,
      paymentSources: [],
    });

    await initializePromise;
  });
});
