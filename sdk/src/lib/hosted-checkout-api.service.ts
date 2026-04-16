import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {
  HostedCheckoutCompletionRequest,
  HostedCheckoutInteraction,
  InteractionRequest,
} from './hosted-checkout.models';

@Injectable({
  providedIn: 'root',
})
export class HostedCheckoutApiService {
  private readonly http = inject(HttpClient);

  createInteraction(baseUrl: string, request: InteractionRequest) {
    return this.http.post<HostedCheckoutInteraction>(
      `${this.normalizeBaseUrl(baseUrl)}/session/interaction/create`,
      request,
    );
  }

  sendOtp(baseUrl: string, interactionId: string, email: string) {
    return this.http.post<HostedCheckoutInteraction>(
      `${this.normalizeBaseUrl(baseUrl)}/interaction/${interactionId}/otp/send`,
      { value: email },
    );
  }

  validateOtp(baseUrl: string, interactionId: string, otp: string) {
    return this.http.post<HostedCheckoutInteraction>(
      `${this.normalizeBaseUrl(baseUrl)}/interaction/${interactionId}/otp/validate`,
      JSON.stringify(otp),
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
      },
    );
  }

  attachPaymentMethod(baseUrl: string, interactionId: string, paymentSourceId: string) {
    return this.http.post<HostedCheckoutInteraction>(
      `${this.normalizeBaseUrl(baseUrl)}/interaction/${interactionId}/payment-source/${paymentSourceId}/attach`,
      {},
    );
  }

  getStatus(baseUrl: string, interactionId: string) {
    return this.http.get<HostedCheckoutInteraction>(
      `${this.normalizeBaseUrl(baseUrl)}/interaction/${interactionId}`,
    );
  }

  submitPayment(baseUrl: string, request: HostedCheckoutCompletionRequest) {
    return this.http.post<void>(`${this.normalizeBaseUrl(baseUrl)}/session/interaction/pay`, request);
  }

  private normalizeBaseUrl(baseUrl: string): string {
    return baseUrl.replace(/\/+$/, '');
  }
}
