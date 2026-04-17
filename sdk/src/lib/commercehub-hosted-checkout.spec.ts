import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommercehubHostedCheckout } from './commercehub-hosted-checkout';

describe('CommercehubHostedCheckout', () => {
  let component: CommercehubHostedCheckout;
  let fixture: ComponentFixture<CommercehubHostedCheckout>;
  let httpMock: HttpTestingController;
  let proxiedApiBaseUrl: string;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommercehubHostedCheckout],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    httpMock = TestBed.inject(HttpTestingController);
    proxiedApiBaseUrl = `${window.location.origin}/api`;
    fixture = TestBed.createComponent(CommercehubHostedCheckout);
    fixture.componentRef.setInput('launchRequest', {
      interaction: {
        sessionReferenceId: 'session-ref-1',
        authType: 'FINAL_SALE',
        email: 'buyer@example.com',
        allowedTenderTypes: ['CARD'],
      },
      payment: {
        amount: 149.99,
        currency: 'USD',
        callToAction: 'Pay now',
      },
    });

    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const initializeRequest = httpMock.expectOne(
      `${proxiedApiBaseUrl}/session/interaction/create`,
    );
    expect(initializeRequest.request.headers.get('x-demo-target-origin')).toBe(
      'http://localhost:8080',
    );
    initializeRequest.flush({
      interactionId: 'interaction-1',
      status: 'EMAIL_REQUESTED',
      email: 'buyer@example.com',
      paymentSources: [],
    });

    fixture.detectChanges();
    await fixture.whenStable();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('shows the add button in the source step', () => {
    (component as any).interaction.set({
      interactionId: 'interaction-1',
      status: 'PAYMENT_SOURCE_REQUESTED',
      email: 'buyer@example.com',
      paymentSources: [],
    });

    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Add');
  });

  it('adds a card source and refreshes the source list', async () => {
    (component as any).interaction.set({
      interactionId: 'interaction-1',
      status: 'PAYMENT_SOURCE_REQUESTED',
      email: 'buyer@example.com',
      paymentSources: [],
    });

    (component as any).openAddPaymentMethodChooser();
    (component as any).selectAddPaymentMethod('CARD');
    (component as any).cardForm.setValue({
      nameOnCard: 'Taylor Buyer',
      cardNumber: '4111111111111111',
      expirationMonth: '12',
      expirationYear: '2030',
      cvv: '123',
    });

    fixture.detectChanges();

    const submitPromise = (component as any).submitAddPaymentMethod();

    const addRequest = httpMock.expectOne(`${proxiedApiBaseUrl}/customer/source`);
    expect(addRequest.request.method).toBe('POST');
    expect(addRequest.request.body.tenderType).toBe('CARD');
    expect(addRequest.request.headers.get('x-demo-target-origin')).toBe('http://localhost:8080');
    addRequest.flush({});

    await fixture.whenStable();

    const profileRequest = httpMock.expectOne(`${proxiedApiBaseUrl}/customer`);
    expect(profileRequest.request.method).toBe('GET');
    expect(profileRequest.request.headers.get('x-demo-target-origin')).toBe(
      'http://localhost:8080',
    );
    profileRequest.flush({
      sources: [
        {
          id: 'source-1',
          name: 'Visa',
          tenderType: 'CARD',
          card: {
            cardNumber: '4111111111111111',
          },
        },
      ],
    });

    await submitPromise;
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Visa');
    expect(fixture.nativeElement.textContent).toContain('•••• 1111');
  });
});
