export type TenderType = 'CARD' | 'BANK_ACCOUNT' | 'DYNAMIC_SESSION_CARD';
export type AuthType = 'FINAL_SALE' | 'AUTH_ONLY';
export type CurrencyCode = 'USD';
export type OTPChannel = 'EMAIL' | 'PHONE';
export type InteractionStatus =
  | 'EMAIL_REQUESTED'
  | 'OTP_VALIDATION_PENDING'
  | 'OTP_VALIDATION_FAILED'
  | 'PAYMENT_SOURCE_REQUESTED'
  | 'PAYMENT_SOURCE_ATTACHED'
  | 'ABANDONED'
  | 'COMPLETED';
export type DynamicSessionCardStatus = 'ACTIVE' | 'INACTIVE';
export type PaymentType = 'CREDIT' | 'DEBIT';
export type PaymentChannel = 'ONLINE' | 'MACHINE';
export type PaymentStatus = 'PENDING' | 'APPROVED' | 'DECLINED';
export type CardNetwork = 'Visa' | 'Mastercard' | 'AmericanExpress' | 'Discover';

export interface InteractionRequest {
  sessionReferenceId: string;
  merchantTransactionId?: string;
  merchantOrderId?: string;
  merchantInvoiceNumber?: string;
  authType: AuthType;
  expiryMinutes?: number;
  email: string;
  allowedTenderTypes: TenderType[];
  allowEmailChange?: boolean;
}

export interface HostedCheckoutPaymentRequest {
  amount: number;
  currency: CurrencyCode;
  callToAction?: string;
}

export interface HostedCheckoutLaunchRequest {
  interaction: InteractionRequest;
  payment: HostedCheckoutPaymentRequest;
}

export interface InteractionCompletionRequest {
  interactionId: string;
  amount: number;
  currency: CurrencyCode;
}

export type HostedCheckoutCompletionRequest = InteractionCompletionRequest;

export interface StringHolder {
  value: string;
}

export interface OTPValidateRequest {
  email?: string;
  otp: string;
  channel?: OTPChannel;
}

export interface OTPResponse {
  email?: string;
  phone?: PhoneDetails;
  channel?: OTPChannel;
}

export interface PhoneDetails {
  countryCode?: string;
  phoneNumber?: string;
  verifiedTimestamp?: number;
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

export interface BankAccountDetail {
  bankName?: string;
  routingNumber?: string;
  accountNumber?: string;
  accountType?: string;
}

export interface CardDetail {
  cardNumber?: string;
  nameOnCard?: string;
  expirationMonth?: string;
  expirationYear?: string;
  cvv?: string;
  network?: CardNetwork;
}

export interface AbstractSource {
  id?: string;
  name?: string;
  tenderType: TenderType;
}

export type BaseSource = AbstractSource;

export interface Card extends AbstractSource {
  tenderType: 'CARD';
  card?: CardDetail;
}

export type CardSource = Card;

export interface BankAccount extends AbstractSource {
  tenderType: 'BANK_ACCOUNT';
  bankAccount?: BankAccountDetail;
}

export type BankAccountSource = BankAccount;

export interface DSCDisplayCard extends AbstractSource {
  tenderType: 'DYNAMIC_SESSION_CARD';
}

export type DynamicSessionCardSource = DSCDisplayCard;

export type PaymentSource = Card | BankAccount | DSCDisplayCard;
export type HostedCheckoutPaymentSource = PaymentSource;

export interface InteractionResponse {
  interactionId: string;
  status: InteractionStatus;
  email?: string;
  selectedSource?: PaymentSource;
  allowedTenderTypes?: TenderType[];
  paymentSources?: PaymentSource[];
  allowEmailChange?: boolean;
  phone?: PhoneDetails;
}

export type HostedCheckoutInteraction = InteractionResponse;

export interface HostedCheckoutCompletionEvent {
  interaction: HostedCheckoutInteraction;
  payment: HostedCheckoutPaymentRequest;
}

export interface CreateRequest {
  amount?: number;
  currency?: CurrencyCode;
  paymentSourceId?: string;
  expiryMinutes?: number;
}

export interface DynamicSessionCard {
  email?: string;
  id?: string;
  source?: PaymentSource;
  currency?: CurrencyCode;
  createTimestamp?: number;
  expiryTimestamp?: number;
  totalAmount?: number;
  saleAmount?: number;
  remainingAmount?: number;
  finalRefundedAmount?: number;
  status?: DynamicSessionCardStatus;
}

export interface PaymentsSearchRequest {
  fromDate?: number;
  toDate?: number;
}

export interface Payment {
  email?: string;
  merchantTransactionId?: string;
  agentId?: string;
  merchantOrderId?: string;
  merchantInvoiceNumber?: string;
  type?: PaymentType;
  amount?: number;
  currency?: CurrencyCode;
  timestamp?: number;
  source?: PaymentSource;
  channel?: PaymentChannel;
  status?: PaymentStatus;
  machinePaymentId?: string;
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

export interface HostedCheckoutBranding {
  merchantName: string;
  productName: string;
  eyebrow: string;
  supportLabel: string;
  supportCopy: string;
  primaryColor: string;
  primaryColorStrong: string;
  primaryContrastColor: string;
  inkColor: string;
  mutedInkColor: string;
  surfaceColor: string;
  borderColor: string;
  radius: string;
  fontFamily: string;
}

export const DEFAULT_HOSTED_CHECKOUT_BRANDING: HostedCheckoutBranding = {
  merchantName: 'CommerceHub Connect',
  productName: 'Hosted Checkout SDK',
  eyebrow: 'White-label hosted checkout',
  supportLabel: 'Need support?',
  supportCopy:
    'Route support, recovery, or brand-specific FAQs through your own merchant support surfaces.',
  primaryColor: '#0a5dff',
  primaryColorStrong: '#084ccf',
  primaryContrastColor: '#ffffff',
  inkColor: '#000000',
  mutedInkColor: '#64748b',
  surfaceColor: '#ffffff',
  borderColor: '#e5e5e5',
  radius: '1.75rem',
  fontFamily: '"Open Sans", sans-serif',
};

export function sourceDisplayName(source: HostedCheckoutPaymentSource): string {
  if (source.tenderType === 'BANK_ACCOUNT') {
    return source.bankAccount?.bankName || source.name || 'Bank account';
  }

  if (source.tenderType === 'DYNAMIC_SESSION_CARD') {
    return source.name || 'Dynamic session card';
  }

  return source.card?.network || source.name || 'Card';
}

export function sourceMaskedValue(source: HostedCheckoutPaymentSource): string {
  if (source.tenderType === 'BANK_ACCOUNT') {
    const accountNumber = source.bankAccount?.accountNumber;
    return accountNumber ? `•••• ${accountNumber.slice(-4)}` : 'Saved bank account';
  }

  if (source.tenderType === 'DYNAMIC_SESSION_CARD') {
    return 'Single-use wallet source';
  }

  const cardNumber = source.card?.cardNumber;
  return cardNumber ? `•••• ${cardNumber.slice(-4)}` : 'Saved payment card';
}

export function mergeBranding(
  defaults: HostedCheckoutBranding,
  overrides: Partial<HostedCheckoutBranding>,
): HostedCheckoutBranding {
  return {
    ...defaults,
    ...overrides,
  };
}
