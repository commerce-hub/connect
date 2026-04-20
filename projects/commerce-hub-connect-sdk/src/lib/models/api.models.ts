export type CommerceHubAuthType = 'FINAL_SALE' | 'AUTH_ONLY';

export type CommerceHubTenderType = 'CARD' | 'BANK_ACCOUNT' | 'DYNAMIC_SESSION_CARD';

export type CommerceHubInteractionStatus =
  | 'EMAIL_REQUESTED'
  | 'OTP_VALIDATION_PENDING'
  | 'OTP_VALIDATION_FAILED'
  | 'PAYMENT_SOURCE_REQUESTED'
  | 'PAYMENT_SOURCE_ATTACHED'
  | 'ABANDONED'
  | 'COMPLETED';

export interface InteractionRequest {
  sessionReferenceId: string;
  merchantTransactionId?: string;
  merchantOrderId?: string;
  merchantInvoiceNumber?: string;
  authType: CommerceHubAuthType;
  expiryMinutes?: number;
  email: string;
  allowedTenderTypes?: CommerceHubTenderType[];
  allowEmailChange?: boolean;
}

export interface StringHolder {
  value: string;
}

export interface OtpValidateRequest {
  email: string;
  otp: string;
  channel: 'EMAIL' | 'PHONE';
}

export interface PhoneDetails {
  countryCode?: string;
  phoneNumber?: string;
  verifiedTimestamp?: number;
}

export interface AbstractSource {
  id?: string;
  name?: string;
  tenderType: CommerceHubTenderType;
}

export type CardNetwork = 'Visa' | 'Mastercard' | 'AmericanExpress' | 'Discover';

export interface CardDetail {
  cardNumber: string;
  nameOnCard: string;
  expirationMonth: string;
  expirationYear: string;
  cvv: string;
  network?: CardNetwork;
}

export interface CardSource extends AbstractSource {
  tenderType: 'CARD';
  card: CardDetail;
}

export interface BankAccountDetail {
  bankName: string;
  routingNumber: string;
  accountNumber: string;
  accountType: string;
}

export interface BankAccountSource extends AbstractSource {
  tenderType: 'BANK_ACCOUNT';
  bankAccount: BankAccountDetail;
}

export interface DynamicSessionCardSource extends AbstractSource {
  tenderType: 'DYNAMIC_SESSION_CARD';
}

export type PaymentSource = CardSource | BankAccountSource | DynamicSessionCardSource;

export interface InteractionResponse {
  interactionId: string;
  status: CommerceHubInteractionStatus;
  email?: string;
  selectedSource?: PaymentSource;
  allowedTenderTypes?: CommerceHubTenderType[];
  paymentSources?: PaymentSource[];
  allowEmailChange?: boolean;
  phone?: PhoneDetails;
}
