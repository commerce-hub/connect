import type { Address, CustomerMaskType, InteractionResponse, OtpValidateRequest, PayByBankSessionResponse, PaymentSource, Profile, StringHolder } from '../contracts/api-models';
export declare class CommerceHubConnectApiError extends Error {
    readonly status?: number | undefined;
    readonly body?: unknown | undefined;
    constructor(message: string, status?: number | undefined, body?: unknown | undefined);
}
export declare class CommerceHubConnectApiClient {
    private readonly baseUrl;
    private interactionId;
    constructor(baseUrl: string, interactionId?: string | null);
    setInteractionId(interactionId: string | null | undefined): void;
    getInteractionStatus(): Promise<InteractionResponse>;
    sendInteractionOtp(request: StringHolder): Promise<InteractionResponse>;
    sendInteractionOtpToEmail(request: StringHolder): Promise<InteractionResponse>;
    validateInteractionOtp(request: OtpValidateRequest): Promise<InteractionResponse>;
    attachPaymentMethod(paymentSourceId: string): Promise<InteractionResponse>;
    addSource(source: PaymentSource): Promise<string | {
        id?: string;
        sourceId?: string;
        paymentSourceId?: string;
    } | unknown>;
    getCustomerProfile(): Promise<Profile>;
    addBillingAddress(address: Address): Promise<void>;
    mask(type: CustomerMaskType, request: StringHolder): Promise<StringHolder>;
    createPayByBankSession(): Promise<PayByBankSessionResponse>;
    finalizePayByBankSession(aldSessionId: string, pToken: string): Promise<void>;
    private request;
    private buildHeaders;
    private isInteractionPath;
    private normalizeInteractionId;
}
