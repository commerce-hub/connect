import {
  CommerceHubAuthType,
  CommerceHubTenderType,
  InteractionResponse,
  PaymentSource,
} from './api.models';

export type CommerceHubSdkFlowStep = 'email' | 'otp' | 'payment' | 'success';

export type CommerceHubErrorStage =
  | 'session'
  | 'otp_send'
  | 'otp_validate'
  | 'payment_source'
  | 'interaction'
  | 'pay_by_bank';

export interface CommerceHubWhiteLabelOptions {
  primaryColor?: string;
  secondaryColor?: string;
  textColor?: string;
  logoUrl?: string;
  fontFamily?: string;
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

export interface CommerceHubSuccessResult {
  interaction: InteractionResponse | null;
  paymentSourceId?: string;
  paymentSource?: PaymentSource;
  tenderType?: CommerceHubTenderType;
  bankLinkResponse?: unknown;
  vaultReference?: string;
}

export interface CommerceHubSdkConfiguration {
  onSuccess: (result: CommerceHubSuccessResult) => void;
  onError: (error: CommerceHubSdkError) => void;
  sessionReferenceId: string;
  email?: string;
  region?: string;
  language?: string;
  merchantTransactionId?: string;
  merchantOrderId?: string;
  merchantInvoiceNumber?: string;
  authType: CommerceHubAuthType;
  expiryMinutes?: number;
  allowedTenderTypes?: CommerceHubTenderType[];
  allowEmailChange?: boolean;
  payByBank?: CommerceHubPayByBankOptions;
}

export interface ResolvedCommerceHubWhiteLabelOptions {
  primaryColor: string;
  secondaryColor: string;
  textColor: string;
  logoUrl?: string;
  fontFamily: string;
}

export interface ResolvedCommerceHubSdkConfiguration extends CommerceHubSdkConfiguration {
  region: string;
  language: string;
  allowedTenderTypes: CommerceHubTenderType[];
  payByBank?: CommerceHubPayByBankOptions;
}
