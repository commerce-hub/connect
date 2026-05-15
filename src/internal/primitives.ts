import {html, TemplateResult} from 'lit';
import {ifDefined} from 'lit/directives/if-defined.js';

import {
  resolvePaymentMethodIconDataUri,
  resolvePaymentMethodIconName,
} from './payment-method-icons.js';
import type {
  AlertOptions,
  ButtonOptions,
  DetailItem,
  EmptyStateOptions,
  LoadingRowOptions,
  OtpGroupOptions,
  OtpResendOptions,
  OutcomeShellOptions,
  PaymentMethod,
  ProviderFrameOptions,
  SelectFieldOptions,
  SourceActionOptions,
  StatusPillOptions,
  TextLinkButtonOptions,
  TextFieldOptions,
  UploadRowOptions,
  WidgetShellOptions,
} from './types.js';

const titleCase = (value: string) =>
  `${value.charAt(0).toUpperCase()}${value.slice(1)}`;

const paymentMethodAccountLabel = ({brand, last4}: PaymentMethod): string =>
  last4 ? `•••• ${last4}` : brand;

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
  icon,
  disabled = false,
}: ButtonOptions): TemplateResult => html`
  <button
    class="button button-${variant}"
    type=${type}
    data-action=${ifDefined(action)}
    ?disabled=${disabled}
  >
    <span class="button-content">
      ${icon
        ? html`
            <span
              class="button-icon button-icon-${icon}"
              aria-hidden="true"
            ></span>
          `
        : ''}
      <span class="button-label">${label}</span>
    </span>
  </button>
`;

export const renderTextField = ({
  id,
  label,
  name,
  value = '',
  placeholder,
  type = 'text',
  span = 'default',
  autocomplete,
  inputmode,
  disabled = false,
  dataField,
  error,
}: TextFieldOptions): TemplateResult => html`
  <div class="field ${span === 'full' ? 'field-full' : ''}">
    <label class="field-label" for=${id}>${label}</label>
    <input
      class="field-input"
      id=${id}
      name=${ifDefined(name)}
      type=${type}
      .value=${value}
      placeholder=${ifDefined(placeholder)}
      autocomplete=${ifDefined(autocomplete)}
      inputmode=${ifDefined(inputmode)}
      data-card-field=${ifDefined(dataField)}
      aria-invalid=${error ? 'true' : 'false'}
      aria-describedby=${ifDefined(error ? `${id}-error` : undefined)}
      ?disabled=${disabled}
    />
    ${error
      ? html`<p class="field-error" id=${`${id}-error`}>${error}</p>`
      : ''}
  </div>
`;

export const renderSelectField = ({
  id,
  label,
  name,
  value = '',
  options,
  span = 'default',
  disabled = false,
  dataField,
  error,
}: SelectFieldOptions): TemplateResult => html`
  <div class="field ${span === 'full' ? 'field-full' : ''}">
    <label class="field-label" for=${id}>${label}</label>
    <select
      class="field-input field-select"
      id=${id}
      name=${ifDefined(name)}
      .value=${value}
      data-card-field=${ifDefined(dataField)}
      aria-invalid=${error ? 'true' : 'false'}
      aria-describedby=${ifDefined(error ? `${id}-error` : undefined)}
      ?disabled=${disabled}
    >
      ${options.map(
        (option) => html`
          <option value=${option.value} ?selected=${option.value === value}>
            ${option.label}
          </option>
        `
      )}
    </select>
    ${error
      ? html`<p class="field-error" id=${`${id}-error`}>${error}</p>`
      : ''}
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
              data-otp-index=${index}
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

export const renderOtpResend = ({
  label,
  action,
  disabled = false,
}: OtpResendOptions): TemplateResult => html`
  <button
    class="otp-resend"
    type="button"
    data-action=${action}
    ?disabled=${disabled}
  >
    ${label}
  </button>
`;

export const renderEmptyState = ({
  title,
  message,
}: EmptyStateOptions): TemplateResult => html`
  <div class="empty-state">
    <p class="empty-state-title">${title}</p>
    <p class="empty-state-message">${message}</p>
  </div>
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
      <span class="payment-method-radio" aria-hidden="true">
        <span class="payment-method-radio-dot"></span>
      </span>
      <span class="payment-method-icon-chip" aria-hidden="true">
        <img
          class="payment-method-icon-image"
          data-payment-method-icon=${resolvePaymentMethodIconName(method)}
          src=${resolvePaymentMethodIconDataUri(method)}
          alt=""
        />
      </span>
      <span class="payment-method-copy">
        <span class="payment-method-title">${label}</span>
        <span class="payment-method-meta">
          ${paymentMethodAccountLabel(method)}
        </span>
        ${status === 'verified'
          ? ''
          : html`
              <span class="payment-method-status status-text-${status}">
                ${paymentMethodStatusLabel(status)}
              </span>
            `}
      </span>
    </button>
  `;
};

export const renderSourceAction = ({
  label,
  subtitle,
  action,
  icon,
  variant = 'card',
  disabled = false,
}: SourceActionOptions): TemplateResult =>
  variant === 'link'
    ? html`
        <button
          class="source-action-link source-action-link-${icon}"
          type="button"
          data-action=${action}
          ?disabled=${disabled}
        >
          <span class="source-action-icon" aria-hidden="true">+</span>
          <span class="source-action-link-copy">
            <span class="source-action-link-title source-action-title">
              ${label}
            </span>
            ${subtitle
              ? html`
                  <span
                    class="source-action-link-subtitle source-action-subtitle"
                  >
                    ${subtitle}
                  </span>
                `
              : ''}
          </span>
        </button>
      `
    : html`
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

export const renderProviderFrame = ({
  containerId,
  title,
  loadingLabel,
}: ProviderFrameOptions): TemplateResult => html`
  <div class="provider-frame">
    ${title || loadingLabel
      ? html`
          <div class="provider-frame-header">
            ${title
              ? html`<p class="provider-frame-title">${title}</p>`
              : ''}
            ${loadingLabel
              ? html`
                  <p class="provider-frame-status" role="status" aria-live="polite">
                    ${loadingLabel}
                  </p>
                `
              : ''}
          </div>
        `
      : ''}
    <slot class="provider-frame-slot" name=${containerId}>
      <div class="provider-frame-container" id=${containerId}></div>
    </slot>
  </div>
`;

export const renderOutcomeShell = ({
  variant,
  title,
  message,
  content,
  actions,
}: OutcomeShellOptions): TemplateResult => html`
  <div class="outcome-shell outcome-${variant}">
    <span class="outcome-icon" aria-hidden="true"></span>
    ${title ? html`<p class="outcome-title">${title}</p>` : ''}
    ${message ? html`<p class="outcome-message">${message}</p>` : ''}
    ${content ? html`<div class="outcome-content">${content}</div>` : ''}
    ${actions ? html`<div class="outcome-actions">${actions}</div>` : ''}
  </div>
`;

export const renderVerificationDetails = (
  items: DetailItem[]
): TemplateResult => html`
  <div class="verification-details">
    ${items.map(
      (item) => html`
        <div class="verification-detail-row">
          <span class="verification-detail-label">${item.label}</span>
          <span class="verification-detail-value">${item.value}</span>
        </div>
      `
    )}
  </div>
`;

export const renderTextLinkButton = ({
  label,
  action,
  disabled = false,
}: TextLinkButtonOptions): TemplateResult => html`
  <button
    class="text-link-button"
    type="button"
    data-action=${action}
    ?disabled=${disabled}
  >
    ${label}
  </button>
`;

export const renderPoweredByFooter = (): TemplateResult => html`
  <footer class="powered-by-footer">
    <span>Powered by</span>
    <strong class="powered-by-brand">Commerce Hub Connect</strong>
  </footer>
`;

export const renderFormGrid = (fields: TemplateResult[]): TemplateResult =>
  html` <div class="form-grid">${fields}</div> `;

export const renderWidgetShell = ({
  title,
  subtitle,
  content,
  width = 'default',
  ariaLabel = 'Commerce Hub Connect',
  closeAction = 'close',
  showClose = true,
  showDivider = true,
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
            aria-label="Close Commerce Hub Connect"
            data-action=${closeAction}
          >
            ×
          </button>
        `
      : ''}
    <h2 class="widget-title">${title}</h2>
    ${subtitle ? html`<p class="widget-subtitle">${subtitle}</p>` : ''}
    ${showDivider
      ? html`<div class="widget-divider" aria-hidden="true"></div>`
      : ''}
    <div class="widget-content">${content}</div>
    ${showFooter ? renderPoweredByFooter() : ''}
  </section>
`;
