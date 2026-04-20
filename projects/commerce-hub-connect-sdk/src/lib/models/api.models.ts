export type CommerceHubAuthType = 'FINAL_SALE' | 'AUTH_ONLY';

export type CommerceHubTenderType = 'CARD' | 'BANK_ACCOUNT';

export type CommerceHubInteractionStatus =
  | 'EMAIL_REQUESTED'
  | 'OTP_VALIDATION_PENDING'
  | 'OTP_VALIDATION_FAILED'
  | 'PAYMENT_SOURCE_REQUESTED'
  | 'PAYMENT_SOURCE_ATTACHED'
  | 'ABANDONED'
  | 'COMPLETED';

export type OtpChannel = 'EMAIL' | 'PHONE';

export type CardNetwork = 'Visa' | 'Mastercard' | 'AmericanExpress' | 'Discover';

export type CustomerMaskType = 'card' | 'cvv' | 'bn' | 'rt';

export type PaymentType = 'CREDIT' | 'DEBIT';

export type PaymentCurrency = 'USD';

export type PaymentChannel = 'ONLINE' | 'MACHINE';

export type PaymentStatus = 'PENDING' | 'APPROVED' | 'DECLINED';

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
  channel: OtpChannel;
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

export interface CardDetail {
  cardNumber: string;
  nameOnCard: string;
  expirationMonth: string;
  expirationYear: string;
  cvv: string;
  network?: CardNetwork;
  cardNumberEncrypted?: string;
  cvvEncrypted?: string;
}

export interface Card extends AbstractSource {
  tenderType: 'CARD';
  billingAddressId?: string;
  card: CardDetail;
}

export type CardSource = Card;

export interface BankAccountDetail {
  bankName: string;
  routingNumber: string;
  accountNumber: string;
  accountType: string;
  routingNumberEncrypted?: string;
  accountNumberEncrypted?: string;
}

export interface BankAccount extends AbstractSource {
  tenderType: 'BANK_ACCOUNT';
  bankAccount: BankAccountDetail;
}

export type BankAccountSource = BankAccount;

export type PaymentSource = Card | BankAccount;

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

export interface Address {
  id?: string;
  street?: string;
  houseNumberOrName?: string;
  recipientNameOrAddress?: string;
  city?: string;
  stateOrProvince?: string;
  postalCode?: string;
  country?: string;
}

export interface LoginInfo {
  timestamp?: number;
  browser?: string;
  os?: string;
  device?: string;
}

export interface Profile {
  email?: string;
  name?: string;
  phoneDetails?: PhoneDetails;
  shippingAddress?: Address[];
  billingAddress?: Address[];
  defaultSource?: PaymentSource;
  sources?: PaymentSource[];
  machinePayments?: boolean;
  logins?: Record<string, LoginInfo>;
}

export interface OTPResponse {
  email?: string;
  phone?: PhoneDetails;
  channel?: OtpChannel;
}

export interface Challenge {
  id?: string;
  realm?: string;
  method?: string;
  intent?: string;
  request?: string;
  digest?: string;
  expiresAt?: string;
  description?: string;
}

export interface ConsumeTokenRequest {
  challenge?: Challenge;
}

export interface CreateTokenRequest {
  cardId?: string;
  agentId?: string;
  challenge?: Challenge;
}

export interface CreateTokenResponse {
  tokenId?: string;
  expiresAt?: string;
}

export interface InteractionCompletionRequest {
  interactionId: string;
  amount: number;
  currency: PaymentCurrency;
}

export interface MachinePaymentResponse {
  success?: boolean;
  paymentTokenId?: string;
  message?: string;
  referenceId?: string;
}

export interface Payment {
  email?: string;
  merchantTransactionId?: string;
  agentId?: string;
  merchantOrderId?: string;
  merchantInvoiceNumber?: string;
  type?: PaymentType;
  amount?: number;
  currency?: PaymentCurrency;
  timestamp?: number;
  source?: PaymentSource;
  channel?: PaymentChannel;
  status?: PaymentStatus;
  referenceMerchantTransactionId?: string;
}

export interface PaymentsSearchRequest {
  fromDate?: number;
  toDate?: number;
}
