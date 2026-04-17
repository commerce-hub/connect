import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DOCUMENT } from '@angular/common';
import {
  Address,
  BankAccount,
  CreateRequest,
  DynamicSessionCard,
  HostedCheckoutCompletionRequest,
  HostedCheckoutInteraction,
  HostedCheckoutPaymentSource,
  InteractionRequest,
  OTPResponse,
  OTPValidateRequest,
  Payment,
  PaymentsSearchRequest,
  PhoneDetails,
  Profile,
  StringHolder,
} from './hosted-checkout.models';

@Injectable({
  providedIn: 'root',
})
export class HostedCheckoutApiService {
  private readonly http = inject(HttpClient);
  private readonly document = inject(DOCUMENT);
  private readonly windowRef = this.document.defaultView;

  retrieveBankInfo(baseUrl: string, aldSessionId: string) {
    const request = this.resolveRequestTarget(baseUrl);
    return this.http.put<BankAccount>(
      `${request.baseUrl}/pbb/session/${aldSessionId}`,
      null,
      this.buildOptions(request.proxyTargetOrigin),
    );
  }

  addSource(baseUrl: string, request: HostedCheckoutPaymentSource) {
    const requestTarget = this.resolveRequestTarget(baseUrl);
    return this.http.post<void>(
      `${requestTarget.baseUrl}/customer/source`,
      request,
      this.buildOptions(requestTarget.proxyTargetOrigin),
    );
  }

  updateSource(baseUrl: string, request: HostedCheckoutPaymentSource) {
    const requestTarget = this.resolveRequestTarget(baseUrl);
    return this.http.put<void>(
      `${requestTarget.baseUrl}/customer/source`,
      request,
      this.buildOptions(requestTarget.proxyTargetOrigin),
    );
  }

  addShippingAddress(baseUrl: string, request: Address) {
    const requestTarget = this.resolveRequestTarget(baseUrl);
    return this.http.post<void>(
      `${requestTarget.baseUrl}/customer/shipping-address`,
      request,
      this.buildOptions(requestTarget.proxyTargetOrigin),
    );
  }

  updateShippingAddress(baseUrl: string, id: string, request: Address) {
    const requestTarget = this.resolveRequestTarget(baseUrl);
    return this.http.put<void>(
      `${requestTarget.baseUrl}/customer/shipping-address/${id}`,
      request,
      this.buildOptions(requestTarget.proxyTargetOrigin),
    );
  }

  deleteShippingAddress(baseUrl: string, id: string) {
    const requestTarget = this.resolveRequestTarget(baseUrl);
    return this.http.delete<void>(
      `${requestTarget.baseUrl}/customer/shipping-address/${id}`,
      this.buildOptions(requestTarget.proxyTargetOrigin),
    );
  }

  addBillingAddress(baseUrl: string, request: Address) {
    const requestTarget = this.resolveRequestTarget(baseUrl);
    return this.http.post<void>(
      `${requestTarget.baseUrl}/customer/billing-address`,
      request,
      this.buildOptions(requestTarget.proxyTargetOrigin),
    );
  }

  updateBillingAddress(baseUrl: string, id: string, request: Address) {
    const requestTarget = this.resolveRequestTarget(baseUrl);
    return this.http.put<void>(
      `${requestTarget.baseUrl}/customer/billing-address/${id}`,
      request,
      this.buildOptions(requestTarget.proxyTargetOrigin),
    );
  }

  deleteBillingAddress(baseUrl: string, id: string) {
    const requestTarget = this.resolveRequestTarget(baseUrl);
    return this.http.delete<void>(
      `${requestTarget.baseUrl}/customer/billing-address/${id}`,
      this.buildOptions(requestTarget.proxyTargetOrigin),
    );
  }

  createInteraction(baseUrl: string, request: InteractionRequest) {
    const requestTarget = this.resolveRequestTarget(baseUrl);
    return this.http.post<HostedCheckoutInteraction>(
      `${requestTarget.baseUrl}/session/interaction/create`,
      request,
      this.buildOptions(requestTarget.proxyTargetOrigin),
    );
  }

  submitPayment(baseUrl: string, request: HostedCheckoutCompletionRequest) {
    const requestTarget = this.resolveRequestTarget(baseUrl);
    return this.http.post<void>(
      `${requestTarget.baseUrl}/session/interaction/pay`,
      request,
      this.buildOptions(requestTarget.proxyTargetOrigin),
    );
  }

  authenticate(baseUrl: string, request: StringHolder) {
    const requestTarget = this.resolveRequestTarget(baseUrl);
    return this.http.post<OTPResponse>(
      `${requestTarget.baseUrl}/open/authenticate`,
      request,
      this.buildOptions(requestTarget.proxyTargetOrigin),
    );
  }

  authenticateEmailOnly(baseUrl: string, request: StringHolder) {
    const requestTarget = this.resolveRequestTarget(baseUrl);
    return this.http.post<OTPResponse>(
      `${requestTarget.baseUrl}/open/authenticate/email`,
      request,
      this.buildOptions(requestTarget.proxyTargetOrigin),
    );
  }

  validateOpenOtp(baseUrl: string, request: OTPValidateRequest, userAgent: string) {
    const requestTarget = this.resolveRequestTarget(baseUrl);
    return this.http.post<void>(
      `${requestTarget.baseUrl}/open/otp/validate`,
      request,
      this.buildOptions(requestTarget.proxyTargetOrigin, false, userAgent),
    );
  }

  createDynamicSessionCard(baseUrl: string, request: CreateRequest) {
    const requestTarget = this.resolveRequestTarget(baseUrl);
    return this.http.post<DynamicSessionCard>(
      `${requestTarget.baseUrl}/mpp/dsc/create`,
      request,
      this.buildOptions(requestTarget.proxyTargetOrigin),
    );
  }

  getActiveDynamicSessionCards(baseUrl: string) {
    const requestTarget = this.resolveRequestTarget(baseUrl);
    return this.http.get<DynamicSessionCard[]>(
      `${requestTarget.baseUrl}/mpp/dsc/active`,
      this.buildOptions(requestTarget.proxyTargetOrigin),
    );
  }

  cancelDynamicSessionCard(baseUrl: string, request: StringHolder) {
    const requestTarget = this.resolveRequestTarget(baseUrl);
    return this.http.delete<void>(`${requestTarget.baseUrl}/mpp/dsc/cancel`, {
      body: request,
      ...this.buildOptions(requestTarget.proxyTargetOrigin),
    });
  }

  sendOtp(baseUrl: string, interactionId: string, request: StringHolder) {
    const requestTarget = this.resolveRequestTarget(baseUrl);
    return this.http.post<HostedCheckoutInteraction>(
      `${requestTarget.baseUrl}/interaction/${interactionId}/otp/send`,
      request,
      this.buildOptions(requestTarget.proxyTargetOrigin),
    );
  }

  validateOtp(baseUrl: string, interactionId: string, request: OTPValidateRequest) {
    const requestTarget = this.resolveRequestTarget(baseUrl);
    return this.http.post<HostedCheckoutInteraction>(
      `${requestTarget.baseUrl}/interaction/${interactionId}/otp/validate`,
      request,
      this.buildOptions(requestTarget.proxyTargetOrigin),
    );
  }

  attachPaymentMethod(baseUrl: string, interactionId: string, paymentSourceId: string) {
    const requestTarget = this.resolveRequestTarget(baseUrl);
    return this.http.post<HostedCheckoutInteraction>(
      `${requestTarget.baseUrl}/interaction/${interactionId}/payment-source/${paymentSourceId}/attach`,
      {},
      this.buildOptions(requestTarget.proxyTargetOrigin),
    );
  }

  getStatus(baseUrl: string, interactionId: string) {
    const requestTarget = this.resolveRequestTarget(baseUrl);
    return this.http.get<HostedCheckoutInteraction>(
      `${requestTarget.baseUrl}/interaction/${interactionId}`,
      this.buildOptions(requestTarget.proxyTargetOrigin),
    );
  }

  updatePhone(baseUrl: string, request: PhoneDetails) {
    const requestTarget = this.resolveRequestTarget(baseUrl);
    return this.http.post<void>(
      `${requestTarget.baseUrl}/customer/phone`,
      request,
      this.buildOptions(requestTarget.proxyTargetOrigin),
    );
  }

  verifyPhoneOtp(baseUrl: string, request: StringHolder) {
    const requestTarget = this.resolveRequestTarget(baseUrl);
    return this.http.post<void>(
      `${requestTarget.baseUrl}/customer/phone/verify`,
      request,
      this.buildOptions(requestTarget.proxyTargetOrigin),
    );
  }

  updateName(baseUrl: string, request: StringHolder) {
    const requestTarget = this.resolveRequestTarget(baseUrl);
    return this.http.post<void>(
      `${requestTarget.baseUrl}/customer/name`,
      request,
      this.buildOptions(requestTarget.proxyTargetOrigin),
    );
  }

  searchPayments(baseUrl: string, request: PaymentsSearchRequest) {
    const requestTarget = this.resolveRequestTarget(baseUrl);
    return this.http.post<Payment[]>(
      `${requestTarget.baseUrl}/activity/search`,
      request,
      this.buildOptions(requestTarget.proxyTargetOrigin),
    );
  }

  getAggregationSessionId(baseUrl: string) {
    const requestTarget = this.resolveRequestTarget(baseUrl);
    return this.http.get<string>(
      `${requestTarget.baseUrl}/pbb/session`,
      this.buildOptions(requestTarget.proxyTargetOrigin),
    );
  }

  getCustomerProfile(baseUrl: string) {
    const requestTarget = this.resolveRequestTarget(baseUrl);
    return this.http.get<Profile>(
      `${requestTarget.baseUrl}/customer`,
      this.buildOptions(requestTarget.proxyTargetOrigin),
    );
  }

  setMachinePayments(baseUrl: string, enable: boolean) {
    const requestTarget = this.resolveRequestTarget(baseUrl);
    return this.http.get<void>(
      `${requestTarget.baseUrl}/customer/machine-payments/${enable}`,
      this.buildOptions(requestTarget.proxyTargetOrigin),
    );
  }

  deleteSource(baseUrl: string, sourceId: string) {
    const requestTarget = this.resolveRequestTarget(baseUrl);
    return this.http.delete<void>(
      `${requestTarget.baseUrl}/customer/source/${sourceId}`,
      this.buildOptions(requestTarget.proxyTargetOrigin),
    );
  }

  private normalizeBaseUrl(baseUrl: string): string {
    return baseUrl.replace(/\/+$/, '');
  }

  private resolveRequestTarget(baseUrl: string): { baseUrl: string; proxyTargetOrigin: string } {
    const normalizedBaseUrl = this.normalizeBaseUrl(baseUrl);

    if (!this.windowRef) {
      return {
        baseUrl: normalizedBaseUrl,
        proxyTargetOrigin: '',
      };
    }

    try {
      const currentOrigin = this.windowRef.location.origin;
      const targetUrl = new URL(normalizedBaseUrl, currentOrigin);

      if (targetUrl.origin === currentOrigin) {
        return {
          baseUrl: normalizedBaseUrl,
          proxyTargetOrigin: '',
        };
      }

      return {
        baseUrl: `${currentOrigin}/api`,
        proxyTargetOrigin: targetUrl.origin,
      };
    } catch {
      return {
        baseUrl: normalizedBaseUrl,
        proxyTargetOrigin: '',
      };
    }
  }

  private buildOptions(
    proxyTargetOrigin: string,
    forceJsonContentType = false,
    userAgent?: string,
  ) {
    let headers = new HttpHeaders();

    if (forceJsonContentType) {
      headers = headers.set('Content-Type', 'application/json');
    }

    if (userAgent?.trim()) {
      headers = headers.set('User-Agent', userAgent.trim());
    }

    if (proxyTargetOrigin.trim()) {
      headers = headers.set('x-demo-target-origin', proxyTargetOrigin.replace(/\/+$/, ''));
    }

    return headers.keys().length ? { headers } : {};
  }
}
