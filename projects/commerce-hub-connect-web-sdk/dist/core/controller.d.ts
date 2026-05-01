import type { Address, InteractionResponse, PaymentSource } from '../contracts/api-models';
import type { CommerceHubConnectEnvironment } from '../contracts/environment';
import type { CommerceHubSdkConfiguration, CommerceHubSdkError, CommerceHubSdkFlowStep, CommerceHubSuccessResult, CommerceHubWhiteLabelOptions, ResolvedCommerceHubWhiteLabelOptions } from '../contracts/sdk-models';
export interface CardDraft {
    name: string;
    fullName: string;
    cardNumber: string;
    expiration: string;
    cvc: string;
    billingAddressValue: string;
    country: string;
    addressLine1: string;
    addressLine2: string;
    city: string;
    state: string;
    zip: string;
}
type SensitiveCardField = 'cardNumber' | 'cvc';
type CardEncryptionStatus = 'idle' | 'dirty' | 'encrypting' | 'encrypted' | 'failed';
interface SensitiveCardFieldEncryptionState {
    status: CardEncryptionStatus;
    normalizedValue: string;
    encryptedValue: string | null;
}
export interface CardEncryptionState {
    cardNumber: SensitiveCardFieldEncryptionState;
    cvc: SensitiveCardFieldEncryptionState;
}
export interface WidgetSnapshot {
    interaction: InteractionResponse;
    configuration: CommerceHubSdkConfiguration;
    environment: CommerceHubConnectEnvironment;
    apiBaseUrl: string;
    displayStep: CommerceHubSdkFlowStep;
    currentStep: CommerceHubSdkFlowStep;
    loading: boolean;
    submitting: boolean;
    bankLinkLoading: boolean;
    error: CommerceHubSdkError | null;
    email: string;
    otpCode: string;
    paymentEntryMode: 'list' | 'add';
    supportedTenderTypes: Array<'CARD' | 'BANK_ACCOUNT'>;
    selectedTenderType: 'CARD' | 'BANK_ACCOUNT';
    availableSources: PaymentSource[];
    selectedSourceId: string | null;
    selectedSource: PaymentSource | null;
    completedResult: CommerceHubSuccessResult | null;
    billingAddresses: Address[];
    cardDraft: CardDraft;
    cardDraftErrors: Partial<Record<keyof CardDraft, string>>;
    cardDraftMessage: string | null;
    cardEncryption: CardEncryptionState;
    requestedOtpMode: 'default' | 'email';
    whiteLabel: ResolvedCommerceHubWhiteLabelOptions;
    payByBankMountId: string;
    pendingPayByBankLaunch: boolean;
}
export declare class CommerceHubConnectWidgetController {
    private readonly listeners;
    private api;
    private destroyed;
    private autoSubmittedInteractionId;
    private state;
    constructor(interaction: InteractionResponse, configuration: CommerceHubSdkConfiguration, whiteLabel: CommerceHubWhiteLabelOptions | undefined, environment: CommerceHubConnectEnvironment, apiBaseUrl: string);
    subscribe(listener: () => void): () => void;
    getSnapshot(): WidgetSnapshot;
    update(interaction: InteractionResponse, configuration: CommerceHubSdkConfiguration, whiteLabel: CommerceHubWhiteLabelOptions | undefined, environment: CommerceHubConnectEnvironment, apiBaseUrl: string): Promise<void>;
    destroy(): void;
    submitEmail(email: string, mode?: 'default' | 'email'): Promise<void>;
    validateOtp(otp: string): Promise<void>;
    backToEmailEntry(): void;
    resendCode(): Promise<void>;
    onOtpAlternateAction(): Promise<void>;
    selectExistingSource(sourceId: string): void;
    syncCardDraftField(field: keyof CardDraft, value: string, options?: {
        notify?: boolean;
    }): void;
    encryptCardField(field: SensitiveCardField, value: string): Promise<void>;
    showAddCardMethod(): void;
    showAddBankAccountMethod(): void;
    backToPaymentList(): void;
    attachSelectedSource(): Promise<void>;
    submitCard(draft: CardDraft): Promise<void>;
    launchPayByBank(containerId: string): Promise<void>;
    private createSnapshot;
    private initialize;
    private canManagePaymentInCurrentSession;
    private loadBillingAddresses;
    private otpChannel;
    private resolveBillingAddressId;
    private maskSensitiveCardValue;
    private getExistingBankSourceIds;
    private commitInteraction;
    private failWith;
    private updateState;
    private notify;
}
export declare function formatOtpDestination(snapshot: WidgetSnapshot): string;
export declare function formatSourcePrimaryLabel(source: PaymentSource): string;
export declare function formatSourceSecondaryLabel(source: PaymentSource): string;
export declare function formatSourceBadgeLabel(source: PaymentSource): string;
export declare function formatBillingAddressLabel(address: Address): string;
export declare function getNewBillingAddressValue(): string;
export declare function getDefaultCardDraft(): CardDraft;
export declare function getMaskedCardPreview(cardNumber: string): string;
export declare function getMaskedCvvPreview(cvv: string): string;
export declare function canSubmitCard(snapshot: WidgetSnapshot): boolean;
export {};
