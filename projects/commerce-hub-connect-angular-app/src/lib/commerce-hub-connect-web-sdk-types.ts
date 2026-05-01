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

export interface InteractionMerchantData {
  clientId?: string;
  merchantId?: string;
  terminalId?: string;
}

export interface InteractionRequest {
  sessionReferenceId: string;
  merchantTransactionId?: string;
  merchantOrderId?: string;
  merchantInvoiceNumber?: string;
  authType: CommerceHubAuthType;
  expiryMinutes?: number;
  email?: string;
  allowedTenderTypes?: CommerceHubTenderType[];
  allowEmailChange?: boolean;
  merchantData?: InteractionMerchantData;
  wallet?: boolean;
}

export interface StringHolder {
  value: string;
}

export interface OtpValidateRequest {
  email: string;
  otp: string;
  channel: OtpChannel;
}

export interface PayByBankSessionResponse {
  aggregatorSessionId?: string;
  tokenID?: string;
  accessToken?: string;
  publicKey?: string;
  pToken?: string;
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

export type CommerceHubSdkFlowStep = 'email' | 'otp' | 'payment' | 'success';

export type CommerceHubErrorStage =
  | 'mount'
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
  email?: string;
  paymentSelectionTitle?: string;
  paymentSelectionConfirmLabel?: string;
  whiteLabel?: CommerceHubWhiteLabelOptions;
  payByBank?: CommerceHubPayByBankOptions;
  wallet?: boolean;
}

export type CommerceHubConnectEnvironment = 'dev' | 'qa' | 'cat' | 'prod';

export interface CommerceHubConnectWebSdkMountOptions {
  interaction: InteractionResponse;
  configuration: CommerceHubSdkConfiguration;
  whiteLabel?: CommerceHubWhiteLabelOptions;
  replaceContents?: boolean;
}

export interface CommerceHubConnectWebSdkInstance {
  readonly containerElement: Element;
  readonly hostElement: HTMLElement;
  update(
    options: CommerceHubConnectWebSdkMountOptions,
    environment?: CommerceHubConnectEnvironment,
  ): Promise<void>;
  destroy(): void;
}

export interface CommerceHubConnectWebSdkNamespace {
  readonly version: string;
  readonly tagName: string;
  resolveApiBaseUrl(environment?: CommerceHubConnectEnvironment): string;
  mount(
    target: string | Element,
    options: CommerceHubConnectWebSdkMountOptions,
    environment?: CommerceHubConnectEnvironment,
  ): Promise<CommerceHubConnectWebSdkInstance>;
}
