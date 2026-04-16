export type TenderType = 'CARD' | 'BANK_ACCOUNT' | 'DYNAMIC_SESSION_CARD';
export type AuthType = 'FINAL_SALE';
export type CurrencyCode = 'USD';
export type InteractionStatus =
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
  authType: AuthType;
  expiryMinutes?: number;
  email: string;
  allowedTenderTypes: TenderType[];
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

export interface HostedCheckoutCompletionRequest {
  interactionId: string;
  amount: number;
  currency: CurrencyCode;
}

export interface StringHolder {
  value: string;
}

export interface PhoneDetails {
  countryCode?: string;
  phoneNumber?: string;
  verifiedTimestamp?: number;
}

export interface BaseSource {
  id?: string;
  name?: string;
  tenderType: TenderType;
}

export interface CardSource extends BaseSource {
  tenderType: 'CARD';
  card?: {
    cardNumber?: string;
    nameOnCard?: string;
    expirationMonth?: string;
    expirationYear?: string;
    cvv?: string;
    network?: 'Visa' | 'Mastercard' | 'AmericanExpress' | 'Discover';
  };
}

export interface BankAccountSource extends BaseSource {
  tenderType: 'BANK_ACCOUNT';
  bankAccount?: {
    bankName?: string;
    routingNumber?: string;
    accountNumber?: string;
    accountType?: string;
  };
}

export interface DynamicSessionCardSource extends BaseSource {
  tenderType: 'DYNAMIC_SESSION_CARD';
}

export type HostedCheckoutPaymentSource =
  | CardSource
  | BankAccountSource
  | DynamicSessionCardSource;

export interface HostedCheckoutInteraction {
  interactionId: string;
  status: InteractionStatus;
  email?: string;
  selectedSource?: HostedCheckoutPaymentSource;
  allowedTenderTypes?: TenderType[];
  paymentSources?: HostedCheckoutPaymentSource[];
  allowEmailChange?: boolean;
  phone?: PhoneDetails;
}

export interface HostedCheckoutCompletionEvent {
  interaction: HostedCheckoutInteraction;
  payment: HostedCheckoutPaymentRequest;
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
  supportCopy: 'Route support, recovery, or brand-specific FAQs through your own merchant support surfaces.',
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

export const SOURCE_LABELS: Record<TenderType, string> = {
  CARD: 'Cards',
  BANK_ACCOUNT: 'Bank accounts',
  DYNAMIC_SESSION_CARD: 'Dynamic session cards',
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
