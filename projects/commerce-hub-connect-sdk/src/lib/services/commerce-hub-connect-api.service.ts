import {HttpClient, HttpHeaders} from '@angular/common/http';
import {inject, Injectable} from '@angular/core';
import {Observable} from 'rxjs';

import {
    Address,
    ConsumeTokenRequest,
    CreateTokenRequest,
    CreateTokenResponse,
    InteractionCompletionRequest,
    InteractionRequest,
    InteractionResponse,
    MachinePaymentResponse,
    OTPResponse,
    OtpValidateRequest,
    Payment,
    PaymentSource,
    PaymentsSearchRequest,
    PhoneDetails,
    Profile,
    StringHolder,
} from '../models/api.models';

@Injectable({
    providedIn: 'root',
})
export class CommerceHubConnectApiService {
    private readonly http = inject(HttpClient);
    private readonly baseUrl = '/api';

    private interactionId: string | null = null;

    setInteractionId(interactionId: string | null): void {
        this.interactionId = interactionId;
    }

    updateSource(source: PaymentSource): Observable<void> {
        return this.http.put<void>(this.url('/customer/source'), source, this.opts({withCredentials: true}));
    }

    addSource(source: PaymentSource): Observable<string> {
        return this.http.post(this.url('/customer/source'), source, {
            ...this.opts({withCredentials: true}),
            responseType: 'text',
        });
    }

    updateShippingAddress(id: string, address: Address): Observable<void> {
        return this.http.put<void>(
            this.url(`/customer/shipping-address/${this.path(id)}`),
            address,
            this.opts({withCredentials: true}),
        );
    }

    deleteShippingAddress(id: string): Observable<void> {
        return this.http.delete<void>(
            this.url(`/customer/shipping-address/${this.path(id)}`),
            this.opts({withCredentials: true}),
        );
    }

    updateBillingAddress(id: string, address: Address): Observable<void> {
        return this.http.put<void>(
            this.url(`/customer/billing-address/${this.path(id)}`),
            address,
            this.opts({withCredentials: true}),
        );
    }

    deleteBillingAddress(id: string): Observable<void> {
        return this.http.delete<void>(
            this.url(`/customer/billing-address/${this.path(id)}`),
            this.opts({withCredentials: true}),
        );
    }

    validateOpenOtp(request: OtpValidateRequest): Observable<void> {
        return this.http.post<void>(this.url('/open/otp/validate'), request, this.opts({withCredentials: true}));
    }

    authenticate(request: StringHolder): Observable<OTPResponse> {
        return this.http.post<OTPResponse>(this.url('/open/authenticate'), request, this.opts({withCredentials: true}));
    }

    authenticateEmailOnly(request: StringHolder): Observable<OTPResponse> {
        return this.http.post<OTPResponse>(
            this.url('/open/authenticate/email'),
            request,
            this.opts({withCredentials: true}),
        );
    }

    consumeMerchantToken(
        tokenId: string,
        request: ConsumeTokenRequest,
    ): Observable<MachinePaymentResponse> {
        return this.http.post<MachinePaymentResponse>(
            this.url(`/merchant/token/consume/${this.path(tokenId)}`),
            request,
            this.opts(),
        );
    }

    submitPayment(request: InteractionCompletionRequest): Observable<void> {
        return this.http.post<void>(this.url('/merchant/interaction/pay'), request, this.opts());
    }

    createInteraction(request: InteractionRequest): Observable<InteractionResponse> {
        return this.http.post<InteractionResponse>(this.url('/merchant/interaction/create'), request, this.opts());
    }

    attachPaymentMethod(
        interactionId: string,
        paymentSourceId: string,
    ): Observable<InteractionResponse> {
        return this.http.post<InteractionResponse>(
            this.url(`/interaction/payment-source/${this.path(paymentSourceId)}/attach`),
            {},
            this.opts(),
        );
    }

    validateInteractionOtp(
        interactionId: string,
        request: OtpValidateRequest,
    ): Observable<InteractionResponse> {
        return this.http.post<InteractionResponse>(
            this.url(`/interaction/otp/validate`),
            request,
            this.opts(),
        );
    }

    sendInteractionOtp(interactionId: string, request: StringHolder): Observable<InteractionResponse> {
        return this.http.post<InteractionResponse>(
            this.url(`/interaction/otp/send`),
            request,
            this.opts(),
        );
    }

    sendInteractionOtpToEmail(
        interactionId: string,
        request: StringHolder,
    ): Observable<InteractionResponse> {
        return this.http.post<InteractionResponse>(
            this.url(`/interaction/otp/send/email`),
            request,
            this.opts(),
        );
    }

    addShippingAddress(address: Address): Observable<void> {
        return this.http.post<void>(this.url('/customer/shipping-address'), address, this.opts({withCredentials: true}));
    }

    updatePhone(phoneDetails: PhoneDetails): Observable<void> {
        return this.http.post<void>(this.url('/customer/phone'), phoneDetails, this.opts({withCredentials: true}));
    }

    verifyPhoneOtp(request: StringHolder): Observable<void> {
        return this.http.post<void>(this.url('/customer/phone/verify'), request, this.opts({withCredentials: true}));
    }

    updateName(request: StringHolder): Observable<void> {
        return this.http.post<void>(this.url('/customer/name'), request, this.opts({withCredentials: true}));
    }

    mask(type: string, request: StringHolder): Observable<StringHolder> {
        return this.http.post<StringHolder>(
            this.url(`/customer/mask/${this.path(type)}`),
            request,
            this.opts({withCredentials: true}),
        );
    }

    addBillingAddress(address: Address): Observable<void> {
        return this.http.post<void>(this.url('/customer/billing-address'), address, this.opts({withCredentials: true}));
    }

    searchCustomerActivity(request: PaymentsSearchRequest): Observable<Payment[]> {
        return this.http.post<Payment[]>(this.url('/customer/activity/search'), request, this.opts({withCredentials: true}));
    }

    createAgentToken(request: CreateTokenRequest): Observable<CreateTokenResponse> {
        return this.http.post<CreateTokenResponse>(this.url('/agent/token'), request, this.opts());
    }

    consumeAgentMerchantToken(
        tokenId: string,
        request: StringHolder,
    ): Observable<MachinePaymentResponse> {
        return this.http.post<MachinePaymentResponse>(
            this.url(`/agent/merchant/consume/${this.path(tokenId)}`),
            request,
            this.opts(),
        );
    }

    cancelAgentMerchantToken(
        tokenId: string,
        request: StringHolder,
    ): Observable<MachinePaymentResponse> {
        return this.http.post<MachinePaymentResponse>(
            this.url(`/agent/merchant/cancel/${this.path(tokenId)}`),
            request,
            this.opts(),
        );
    }

    getInteractionStatus(interactionId: string): Observable<InteractionResponse> {
        return this.http.get<InteractionResponse>(this.url(`/interaction`), this.opts());
    }

    getCustomerProfile(): Observable<Profile> {
        return this.http.get<Profile>(this.url('/customer'), this.opts({withCredentials: true}));
    }

    setMachinePaymentsEnabled(enable: boolean): Observable<void> {
        return this.http.get<void>(
            this.url(`/customer/machine-payments/${enable}`),
            this.opts({withCredentials: true}),
        );
    }

    cancelMerchantToken(tokenId: string): Observable<MachinePaymentResponse> {
        return this.http.delete<MachinePaymentResponse>(
            this.url(`/merchant/token/cancel/${this.path(tokenId)}`),
            this.opts(),
        );
    }

    deleteSource(sourceId: string): Observable<void> {
        return this.http.delete<void>(
            this.url(`/customer/source/${this.path(sourceId)}`),
            this.opts({withCredentials: true}),
        );
    }

    private url(path: string): string {
        return `${this.baseUrl}${path}`;
    }

    private path(value: string): string {
        return encodeURIComponent(value);
    }

    private headers(): HttpHeaders {
        let headers = new HttpHeaders();
        if (this.interactionId) {
            headers = headers.set('x-interaction-id', this.interactionId);
        }
        return headers;
    }

    private opts(extra: Record<string, unknown> = {}): Record<string, unknown> {
        return {headers: this.headers(), ...extra};
    }
}
