import type {TemplateResult} from 'lit';

export type ButtonVariant = 'primary' | 'secondary';

export type ButtonType = 'button' | 'submit' | 'reset';

export interface ButtonOptions {
  label: string;
  variant?: ButtonVariant;
  action?: string;
  type?: ButtonType;
  disabled?: boolean;
}

export interface TextFieldOptions {
  id: string;
  label: string;
  value?: string;
  placeholder?: string;
  type?: TextFieldType;
  span?: 'default' | 'full';
  autocomplete?: TextFieldAutocomplete;
  inputmode?: TextFieldInputMode;
  disabled?: boolean;
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

export type PaymentMethodStatus = 'verified' | 'pending' | 'unverified';

export interface StatusPillOptions {
  status: PaymentMethodStatus;
}

export interface PaymentMethod {
  id: string;
  label: string;
  type?: 'bank' | 'card';
  eyebrow?: string;
  brand: string;
  last4: string;
  status: PaymentMethodStatus;
  selected?: boolean;
  disabled?: boolean;
}

export type SourceActionIcon = 'card' | 'bank';

export interface SourceActionOptions {
  label: string;
  subtitle?: string;
  action: string;
  icon: SourceActionIcon;
  disabled?: boolean;
}

export interface UploadRowOptions {
  label: string;
  requirements: string;
  actionLabel: string;
  action?: string;
  error?: boolean;
  disabled?: boolean;
}

export interface LoadingRowOptions {
  title: string;
  helper: string;
}

export interface DetailItem {
  label: string;
  value: string;
}

export interface WidgetShellOptions {
  title: string;
  subtitle?: string;
  content: TemplateResult;
  width?: 'default' | 'wide';
  ariaLabel?: string;
  closeAction?: string;
  showClose?: boolean;
  showFooter?: boolean;
}
