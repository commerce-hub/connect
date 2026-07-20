import type {TemplateResult} from 'lit';

import type {components} from '../generated/openapi.js';

type GeneratedInteractionResponse =
  components['schemas']['InteractionResponse'];
type LegacyInteractionStatus = 'PAYMENT_SOURCE_REQUESTED';
export type InteractionStatus =
  | GeneratedInteractionResponse['status']
  | LegacyInteractionStatus;
type GeneratedInteractionFeatures = NonNullable<
  GeneratedInteractionResponse['features']
>;

export type InteractionFeature = GeneratedInteractionFeatures[number];

/**
 * Gateway-injected OAuth details returned with an interaction response.
 *
 * This field is intentionally modeled outside the generated OpenAPI types
 * because the gateway adds it after the upstream CommerceHub response is
 * produced.
 */
export interface InteractionOAuth {
  token_type?: string;
  issued_at?: string;
  client_id?: string;
  access_token?: string;
  expires_in?: string;
  status?: string;
}

export type InteractionResponse = Omit<
  GeneratedInteractionResponse,
  'status'
> & {
  status?: InteractionStatus;
  oauth?: InteractionOAuth;
};

export type PaymentSource = NonNullable<
  InteractionResponse['paymentSources']
>[number];

export type NativePaymentSource = Extract<
  PaymentSource,
  {tenderType: 'NativeAccount'}
>;

export type NativeAccountBalanceInfo =
  components['schemas']['NativeAccountBalanceInfo'];
export type NativeAccountBalanceMap = Record<string, NativeAccountBalanceInfo>;

export type InteractionFlowStatus = NonNullable<
  components['schemas']['InteractionResponse']['status']
>;

export type FlowActionName =
  | 'verify-otp'
  | 'resend-otp'
  | 'attach-payment-source'
  | 'open-add-payment-source'
  | 'retry-interaction-refresh'
  | 'change-payment-source'
  | 'toggle-payment-source-edit-mode'
  | 'verify-payment-source'
  | 'delete-payment-source'
  | 'cancel-delete-payment-source'
  | 'done-payment-source-verification'
  | 'open-required-info-file-picker'
  | 'open-transfer'
  | 'edit-transfer'
  | 'confirm-transfer'
  | 'submit-required-info'
  | 'transfer'
  | 'add-bank-account'
  | 'add-ach-manually'
  | 'select-instrument-schema'
  | 'save-bank-account'
  | 'back-to-instrument-schema-selection'
  | 'add-card'
  | 'change-billing-address'
  | 'save-card'
  | 'use-bank-account-instead'
  | 'edit-card-details'
  | 'use-different-method'
  | 'retry-bank-provider'
  | 'back-to-bank-provider'
  | 'back-to-payment-methods'
  | 'continue-bank-outcome'
  | 'done-bank-outcome'
  | 'use-different-bank-account'
  | 'close';

export type OtpFormStatus = 'idle' | 'submitting' | 'resending' | 'failed';

export interface OtpFormState {
  value: string;
  status: OtpFormStatus;
  errorMessage?: string;
}

export type CardDraft = {
  name: string;
  fullName: string;
  cardNumber: string;
  expirationDate: string;
  cvv: string;
  billingAddressValue: string;
  country: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  zip: string;
};

export type BankAccountDraft = {
  accountNickname: string;
  routingNumber: string;
  accountNumber: string;
  confirmAccountNumber: string;
};

export type SensitiveCardField = 'cardNumber' | 'cvv';

export type SensitiveBankAccountField =
  | 'routingNumber'
  | 'accountNumber'
  | 'confirmAccountNumber';

export type CardEncryptionStatus =
  | 'idle'
  | 'dirty'
  | 'encrypting'
  | 'encrypted'
  | 'failed';

export type CardFieldEncryptionState = {
  status: CardEncryptionStatus;
  normalizedValue: string;
  encryptedValue?: string;
};

export type CardEncryptionState = Record<
  SensitiveCardField,
  CardFieldEncryptionState
>;

export type BankAccountEncryptionState = Record<
  SensitiveBankAccountField,
  CardFieldEncryptionState
>;

export type CardDraftErrors = Partial<Record<keyof CardDraft, string>>;

export type BankAccountDraftErrors = Partial<
  Record<keyof BankAccountDraft, string>
>;

export type TransferDraft = {
  fromSourceId: string;
  toSourceId: string;
  amount: string;
};

export type TransferDraftErrors = Partial<Record<keyof TransferDraft, string>>;

export type TransferSource = {
  id?: string;
};

export type RequiredInfoValues = Record<string, string>;

export type RequiredInfoFiles = Record<string, File>;

export type RequiredInfoFileNames = Record<string, string>;

export interface OtpScreenModel {
  status: Extract<
    InteractionFlowStatus,
    'OTP_VALIDATION_PENDING' | 'OTP_VALIDATION_FAILED'
  >;
  value: string;
  length: number;
  destination?: string;
  failedMessage?: string;
  copy: OtpScreenCopy;
  submitting?: boolean;
  resending?: boolean;
}

export interface OtpScreenCopy {
  title: string;
  subtitle?: string;
  failedMessage: string;
  resendPrefix: string;
  resendButton: string;
  resendPendingButton: string;
  verifyButton: string;
  verifyingButton: string;
  tryAgainButton: string;
}

export interface AllowedTenderOptions {
  card: boolean;
  bankAccount: boolean;
  nativeAccount: boolean;
}

export interface PaymentMethodsScreenCopy {
  title: string;
  subtitle: string;
  addBankAccountTitle: string;
  addBankAccountSubtitle: string;
  addCardTitle: string;
  addCardSubtitle: string;
  continueButton: string;
  continuingButton: string;
}

export interface NoSavedPaymentMethodsScreenCopy {
  title: string;
  subtitle: string;
  emptyTitle: string;
  emptyMessage: string;
  addBankAccountTitle: string;
  addBankAccountSubtitle: string;
  addCardTitle: string;
  addCardSubtitle: string;
}

export interface PaymentMethodsScreenModel {
  status: 'PAYMENT_SOURCE_REQUESTED';
  methods: PaymentMethod[];
  allowedTenderOptions: AllowedTenderOptions;
  canAddPaymentSources: boolean;
  canSelectPaymentSources: boolean;
  editing: boolean;
  actionPending: boolean;
  selectedPaymentSourceId?: string;
  deleteConfirmationPaymentSourceId?: string;
  copy: PaymentMethodsScreenCopy;
  showTransferAction?: boolean;
}

export interface NoSavedPaymentMethodsScreenModel {
  allowedTenderOptions: AllowedTenderOptions;
  canAddPaymentSources: boolean;
  deletePending?: boolean;
  copy: NoSavedPaymentMethodsScreenCopy;
  showTransferAction?: boolean;
}

export type ButtonVariant = 'primary' | 'secondary';

export type ButtonType = 'button' | 'submit' | 'reset';

export type ButtonIcon = 'check' | 'arrow-right';

export type FieldVariant = 'default' | 'card-form';

export interface ButtonOptions {
  label: string;
  variant?: ButtonVariant;
  action?: string;
  type?: ButtonType;
  icon?: ButtonIcon;
  disabled?: boolean;
  loading?: boolean;
}

export interface TextFieldOptions {
  id: string;
  label: string;
  name?: string;
  value?: string;
  placeholder?: string;
  type?: TextFieldType;
  span?: 'default' | 'full';
  variant?: FieldVariant;
  autocomplete?: TextFieldAutocomplete;
  inputmode?: TextFieldInputMode;
  disabled?: boolean;
  dataField?: string;
  dataFieldScope?: 'card' | 'bankAccount' | 'transfer';
  error?: string;
}

export interface SelectFieldOption {
  value: string;
  label: string;
}

export interface SelectFieldOptions {
  id: string;
  label: string;
  name?: string;
  value?: string;
  options: SelectFieldOption[];
  span?: 'default' | 'full';
  variant?: FieldVariant;
  disabled?: boolean;
  dataField?: string;
  dataFieldScope?: 'card' | 'bankAccount' | 'transfer';
  error?: string;
}

export type TextFieldType =
  | 'text'
  | 'email'
  | 'password'
  | 'tel'
  | 'url'
  | 'number'
  | 'search';

export type TextFieldAutocomplete =
  | 'on'
  | 'off'
  | 'name'
  | 'email'
  | 'cc-name'
  | 'cc-number'
  | 'cc-exp'
  | 'cc-csc'
  | 'country'
  | 'address-line1'
  | 'address-line2'
  | 'address-level1'
  | 'address-level2'
  | 'postal-code';

export type TextFieldInputMode =
  | 'none'
  | 'text'
  | 'tel'
  | 'url'
  | 'email'
  | 'numeric'
  | 'decimal'
  | 'search';

export interface OtpGroupOptions {
  label: string;
  value?: string;
  length?: number;
  disabled?: boolean;
  error?: boolean;
}

export type AlertVariant = 'success' | 'danger' | 'warning';

export interface AlertOptions {
  variant: AlertVariant;
  message: string;
}

export type PaymentMethodStatus =
  | 'verified'
  | 'under-review'
  | 'require-info'
  | 'declined'
  | 'not-verified';

export type StatusPillStatus = 'verified' | 'pending' | 'unverified';

export interface StatusPillOptions {
  status: StatusPillStatus;
}

export interface PaymentMethod {
  id: string;
  label: string;
  accountLabel?: string;
  balanceLabel?: string;
  balanceLoading?: boolean;
  type?: 'bank' | 'card' | 'native';
  eyebrow?: string;
  brand: string;
  last4: string;
  status: PaymentMethodStatus;
  showVerificationStatus?: boolean;
  disabled?: boolean;
}

export type SourceActionIcon = 'card' | 'bank' | 'transfer';
export type SourceActionVariant = 'card' | 'link';

export interface SourceActionOptions {
  label: string;
  subtitle?: string;
  action: FlowActionName;
  icon: SourceActionIcon;
  variant?: SourceActionVariant;
  disabled?: boolean;
}

export interface OtpResendOptions {
  label: string;
  action: FlowActionName;
  disabled?: boolean;
  loading?: boolean;
}

export interface EmptyStateOptions {
  title: string;
  message: string;
}

export interface UploadRowOptions {
  label: string;
  requirements: string;
  actionLabel: string;
  fileName?: string;
  action?: string;
  error?: boolean;
  disabled?: boolean;
}

export interface LoadingRowOptions {
  title: string;
  helper: string;
}

export interface ProviderFrameOptions {
  containerId: string;
  title?: string;
  loadingLabel?: string;
  loading?: boolean;
}

export interface PaymentMethodSkeletonRowsOptions {
  count?: number;
  label?: string;
}

export type OutcomeVariant = 'success' | 'warning' | 'danger';

export interface OutcomeShellOptions {
  variant: OutcomeVariant;
  title?: string;
  message?: string;
  content?: TemplateResult;
  actions?: TemplateResult;
}

export interface TextLinkButtonOptions {
  label: string;
  action: FlowActionName;
  disabled?: boolean;
}

export interface DetailItem {
  label: string;
  value: string | TemplateResult;
}

export interface WidgetShellOptions {
  title: string;
  subtitle?: string;
  content: TemplateResult;
  headerAction?: TemplateResult;
  footer?: TemplateResult;
  width?: 'default' | 'wide';
  ariaLabel?: string;
  closeAction?: string;
  showClose?: boolean;
  showDivider?: boolean;
  showFooter?: boolean;
  busy?: boolean;
  overlay?: TemplateResult;
}
