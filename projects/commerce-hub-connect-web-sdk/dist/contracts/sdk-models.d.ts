import type { InteractionResponse } from './api-models';
export type CommerceHubSdkFlowStep = 'email' | 'otp' | 'payment' | 'success';
export type CommerceHubErrorStage = 'mount' | 'session' | 'otp_send' | 'otp_validate' | 'payment_source' | 'interaction' | 'pay_by_bank';
export interface CommerceHubWhiteLabelOptions {
    primaryColor?: string;
    secondaryColor?: string;
    textColor?: string;
    logoUrl?: string;
    fontFamily?: string;
    emailEntry?: EmailEntryWhiteLabelOptions;
    otpVerification?: OtpVerificationWhiteLabelOptions;
    savedSource?: SavedSourceWhiteLabelOptions;
    addCard?: AddCardWhiteLabelOptions;
}
export interface CommerceHubFlowWhiteLabelOptions {
    title?: string;
    subtitle?: string;
    primaryButtonText?: string;
}
export interface EmailEntryWhiteLabelOptions extends CommerceHubFlowWhiteLabelOptions {
}
export interface OtpVerificationWhiteLabelOptions extends CommerceHubFlowWhiteLabelOptions {
}
export interface SavedSourceWhiteLabelOptions extends CommerceHubFlowWhiteLabelOptions {
}
export interface AddCardWhiteLabelOptions extends CommerceHubFlowWhiteLabelOptions {
}
export interface CommerceHubPayByBankOptions {
    apiKey?: string;
    configId?: string;
    paymentSdkUrl?: string;
    environment?: string;
    locale?: string;
    accessToken?: string;
    encryptionKey?: string;
    aggregatorKey?: string;
    useSandbox?: boolean;
}
export interface CommerceHubSdkError {
    message: string;
    stage: CommerceHubErrorStage;
    status?: number;
    cause?: unknown;
}
export interface CommerceHubSdkConfiguration {
    onSuccess: (interaction: InteractionResponse) => void;
    onError: (error: CommerceHubSdkError) => void;
    email?: string;
    paymentSelectionTitle?: string;
    paymentSelectionConfirmLabel?: string;
    whiteLabel?: CommerceHubWhiteLabelOptions;
    payByBank?: CommerceHubPayByBankOptions;
    wallet?: boolean;
}
export interface ResolvedCommerceHubWhiteLabelOptions {
    primaryColor: string;
    secondaryColor: string;
    textColor: string;
    logoUrl?: string;
    fontFamily: string;
    emailEntry: ResolvedCommerceHubFlowWhiteLabelOptions;
    otpVerification: ResolvedCommerceHubFlowWhiteLabelOptions;
    savedSource: ResolvedCommerceHubFlowWhiteLabelOptions;
    addCard: ResolvedCommerceHubFlowWhiteLabelOptions;
}
export interface ResolvedCommerceHubFlowWhiteLabelOptions {
    title?: string;
    subtitle?: string;
    primaryButtonText?: string;
}
