import type {TemplateResult} from 'lit';

import type {components} from '../generated/openapi.js';

export type InteractionFlowStatus = NonNullable<
  components['schemas']['InteractionResponse']['status']
>;

export type FlowActionName =
  | 'verify-otp'
  | 'resend-otp'
  | 'attach-payment-source'
  | 'retry-interaction-refresh'
  | 'change-payment-source'
  | 'toggle-payment-source-edit-mode'
  | 'verify-payment-source'
  | 'delete-payment-source'
  | 'cancel-delete-payment-source'
  | 'done-payment-source-verification'
  | 'open-required-info-file-picker'
  | 'open-transfer'
  | 'submit-required-info'
  | 'transfer'
  | 'add-bank-account'
  | 'add-ach-manually'
  | 'add-card'
  | 'change-billing-address'
  | 'save-ach-manual'
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

export interface OtpScreenModel {
  status: Extract<
    InteractionFlowStatus,
    'OTP_VALIDATION_PENDING' | 'OTP_VALIDATION_FAILED'
  >;
  email?: string;
  form: OtpFormState;
}

export interface PaymentMethodsScreenModel {
  status: Extract<InteractionFlowStatus, 'PAYMENT_SOURCE_REQUESTED'>;
  methods: PaymentMethod[];
  attaching?: boolean;
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

export type SourceActionIcon = 'card' | 'bank';
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
  width?: 'default' | 'wide';
  ariaLabel?: string;
  closeAction?: string;
  showClose?: boolean;
  showDivider?: boolean;
  showFooter?: boolean;
  busy?: boolean;
  overlay?: TemplateResult;
}
