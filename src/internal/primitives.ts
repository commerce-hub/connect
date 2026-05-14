import {html, TemplateResult} from 'lit';
import {ifDefined} from 'lit/directives/if-defined.js';

import type {
  AlertOptions,
  ButtonOptions,
  DetailItem,
  LoadingRowOptions,
  OtpGroupOptions,
  PaymentMethod,
  SourceActionOptions,
  StatusPillOptions,
  TextFieldOptions,
  UploadRowOptions,
  WidgetShellOptions,
} from './types.js';

const titleCase = (value: string) =>
  `${value.charAt(0).toUpperCase()}${value.slice(1)}`;

const paymentMethodEyebrow = ({type, eyebrow}: PaymentMethod): string => {
  if (eyebrow) {
    return eyebrow;
  }

  return type === 'bank' ? 'Saved bank account' : 'Saved credit card';
};

const paymentMethodTitle = ({brand, last4}: PaymentMethod): string =>
  `${brand} •••• ${last4}`;

const paymentMethodStatusLabel = (status: PaymentMethod['status']): string => {
  if (status === 'verified') {
    return 'Verified';
  }

  if (status === 'pending') {
    return 'Further info required';
  }

  return 'Not verified';
};

export const renderButton = ({
  label,
  variant = 'primary',
  action,
  type = 'button',
  disabled = false,
}: ButtonOptions): TemplateResult => html`
  <button
    class="button button-${variant}"
    type=${type}
    data-action=${ifDefined(action)}
    ?disabled=${disabled}
  >
    ${label}
  </button>
`;

export const renderTextField = ({
  id,
  label,
  value = '',
  placeholder,
  type = 'text',
  span = 'default',
  autocomplete,
  inputmode,
  disabled = false,
}: TextFieldOptions): TemplateResult => html`
  <div class="field ${span === 'full' ? 'field-full' : ''}">
    <label class="field-label" for=${id}>${label}</label>
    <input
      class="field-input"
      id=${id}
      type=${type}
      .value=${value}
      placeholder=${ifDefined(placeholder)}
      autocomplete=${ifDefined(autocomplete)}
      inputmode=${ifDefined(inputmode)}
      ?disabled=${disabled}
    />
  </div>
`;

export const renderOtpGroup = ({
  label,
  value = '',
  length = 6,
  disabled = false,
  error = false,
}: OtpGroupOptions): TemplateResult => {
  const digits = Array.from({length}, (_, index) => value[index] ?? '');

  return html`
    <fieldset
      class="otp-group ${error ? 'otp-group-error' : ''}"
      aria-label=${label}
    >
      <legend class="otp-label">${label}</legend>
      <div class="otp-inputs">
        ${digits.map(
          (digit, index) => html`
            <input
              class="otp-input"
              aria-label=${`${label} digit ${index + 1}`}
              inputmode="numeric"
              maxlength="1"
              pattern="[0-9]*"
              .value=${digit}
              ?disabled=${disabled}
            />
          `
        )}
      </div>
    </fieldset>
  `;
};

export const renderAlert = ({
  variant,
  message,
}: AlertOptions): TemplateResult => html`
  <div class="alert alert-${variant}" role="alert">${message}</div>
`;

export const renderStatusPill = ({
  status,
}: StatusPillOptions): TemplateResult => html`
  <span class="status-pill status-${status}">${titleCase(status)}</span>
`;

export const renderPaymentMethodRow = ({
  id,
  label,
  status,
  type,
  eyebrow,
  brand,
  last4,
  selected = false,
  disabled = false,
}: PaymentMethod): TemplateResult => {
  const method: PaymentMethod = {
    id,
    label,
    status,
    type,
    eyebrow,
    brand,
    last4,
    selected,
    disabled,
  };

  return html`
    <button
      class="payment-method-row"
      type="button"
      role="radio"
      aria-checked=${selected ? 'true' : 'false'}
      aria-disabled=${disabled ? 'true' : 'false'}
      data-payment-method-id=${id}
      ?disabled=${disabled}
    >
      <span class="payment-method-text">
        <span class="payment-method-eyebrow"
          >${paymentMethodEyebrow(method)}</span
        >
        <span class="payment-method-title">${paymentMethodTitle(method)}</span>
        <span class="payment-method-holder">${label}</span>
        <span class="payment-method-status status-text-${status}">
          ${paymentMethodStatusLabel(status)}
        </span>
      </span>
      <span class="payment-method-chevron" aria-hidden="true">›</span>
    </button>
  `;
};

export const renderSourceAction = ({
  label,
  subtitle,
  action,
  icon,
  disabled = false,
}: SourceActionOptions): TemplateResult => html`
  <button
    class="source-action source-action-${icon}"
    type="button"
    data-action=${action}
    ?disabled=${disabled}
  >
    <span class="source-action-icon" aria-hidden="true">+</span>
    <span class="source-action-copy">
      <span class="source-action-title">${label}</span>
      ${subtitle
        ? html`<span class="source-action-subtitle">${subtitle}</span>`
        : ''}
    </span>
  </button>
`;

export const renderDetailList = (items: DetailItem[]): TemplateResult => html`
  <div class="detail-list">
    ${items.map(
      (item) => html`
        <div class="detail-row">
          <span class="detail-label">${item.label}</span>
          <span class="detail-value">${item.value}</span>
        </div>
      `
    )}
  </div>
`;

export const renderUploadRow = ({
  label,
  requirements,
  actionLabel,
  action,
  error = false,
  disabled = false,
}: UploadRowOptions): TemplateResult => html`
  <button
    class="upload-row ${error ? 'upload-row-error' : ''}"
    type="button"
    data-action=${ifDefined(action)}
    ?disabled=${disabled}
  >
    <span class="upload-copy">
      <span class="upload-icon" aria-hidden="true">↑</span>
      <span class="upload-row-label">${label}</span>
      <span class="upload-row-requirements">${requirements}</span>
    </span>
    <span class="upload-row-action">${actionLabel}</span>
  </button>
`;

export const renderLoadingRow = ({
  title,
  helper,
}: LoadingRowOptions): TemplateResult => html`
  <div class="loading-row" role="status" aria-live="polite">
    <span class="loading-spinner" aria-hidden="true"></span>
    <span class="loading-row-copy">
      <span class="loading-row-title">${title}</span>
      <span class="loading-row-helper">${helper}</span>
    </span>
  </div>
`;

export const renderPoweredByFooter = (): TemplateResult => html`
  <footer class="powered-by-footer">
    <span>Powered by</span>
    <strong class="powered-by-brand">CommerceHub Connect</strong>
  </footer>
`;

export const renderFormGrid = (fields: TemplateResult[]): TemplateResult =>
  html` <div class="form-grid">${fields}</div> `;

export const renderWidgetShell = ({
  title,
  subtitle,
  content,
  width = 'default',
  ariaLabel = 'CommerceHub Connect',
  closeAction = 'close',
  showClose = true,
  showFooter = true,
}: WidgetShellOptions): TemplateResult => html`
  <section
    class="widget-shell ${width === 'wide' ? 'widget-shell-wide' : ''}"
    aria-label=${ariaLabel}
  >
    ${showClose
      ? html`
          <button
            class="widget-close"
            type="button"
            aria-label="Close CommerceHub Connect"
            data-action=${closeAction}
          >
            ×
          </button>
        `
      : ''}
    <h2 class="widget-title">${title}</h2>
    ${subtitle ? html`<p class="widget-subtitle">${subtitle}</p>` : ''}
    <div class="widget-content">${content}</div>
    ${showFooter ? renderPoweredByFooter() : ''}
  </section>
`;
