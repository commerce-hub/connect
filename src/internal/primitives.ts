import {html, TemplateResult} from 'lit';
import {ifDefined} from 'lit/directives/if-defined.js';

import type {
  AlertOptions,
  ButtonOptions,
  DetailItem,
  OtpGroupOptions,
  PaymentMethod,
  SourceActionIcon,
  SourceActionOptions,
  StatusPillOptions,
  TextFieldOptions,
  WidgetShellOptions,
} from './types.js';

const titleCase = (value: string) =>
  `${value.charAt(0).toUpperCase()}${value.slice(1)}`;

const iconSvg = (icon: SourceActionIcon) => {
  if (icon === 'card') {
    return html`
      <svg
        class="source-action-icon"
        viewBox="0 0 14 14"
        aria-hidden="true"
        focusable="false"
      >
        <rect
          x="1"
          y="3"
          width="12"
          height="8"
          rx="2"
          fill="none"
          stroke="currentColor"
          stroke-width="1.4"
        ></rect>
        <path d="M3 5.5h8" stroke="currentColor" stroke-width="1.2"></path>
        <path
          d="M5.2 8.7h3.6M7 6.9v3.6"
          stroke="currentColor"
          stroke-width="1.1"
          stroke-linecap="round"
        ></path>
      </svg>
    `;
  }

  return html`
    <svg
      class="source-action-icon"
      viewBox="0 0 14 14"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M2 5h10L7 2 2 5Z" fill="currentColor"></path>
      <path
        d="M3 6h1.5v4H3V6Zm3.25 0h1.5v4h-1.5V6ZM10 6h1.5v4H10V6Z"
        fill="currentColor"
      ></path>
      <path
        d="M2.2 11h9.6"
        stroke="currentColor"
        stroke-width="1.3"
        stroke-linecap="round"
      ></path>
    </svg>
  `;
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
}: OtpGroupOptions): TemplateResult => {
  const digits = Array.from({length}, (_, index) => value[index] ?? '');

  return html`
    <fieldset class="otp-group" aria-label=${label}>
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
  brand,
  last4,
  status,
  selected = false,
  disabled = false,
}: PaymentMethod): TemplateResult => html`
  <button
    class="payment-method-row"
    type="button"
    role="radio"
    aria-checked=${selected ? 'true' : 'false'}
    aria-disabled=${disabled ? 'true' : 'false'}
    data-payment-method-id=${id}
    ?disabled=${disabled}
  >
    <span class="payment-method-radio" aria-hidden="true"></span>
    <span class="payment-method-brand">${brand}</span>
    <span class="payment-method-text">
      <span class="payment-method-label">${label}</span>
      <span class="payment-method-meta">•••• ${last4}</span>
    </span>
    ${renderStatusPill({status})}
  </button>
`;

export const renderSourceAction = ({
  label,
  action,
  icon,
}: SourceActionOptions): TemplateResult => html`
  <button class="source-action" type="button" data-action=${action}>
    ${iconSvg(icon)}
    <span>${label}</span>
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

export const renderFormGrid = (fields: TemplateResult[]): TemplateResult =>
  html` <div class="form-grid">${fields}</div> `;

export const renderWidgetShell = ({
  title,
  subtitle,
  content,
  width = 'default',
  ariaLabel = 'CommerceHub Connect',
}: WidgetShellOptions): TemplateResult => html`
  <section
    class="widget-shell ${width === 'wide' ? 'widget-shell-wide' : ''}"
    aria-label=${ariaLabel}
  >
    <h2 class="widget-title">${title}</h2>
    ${subtitle ? html`<p class="widget-subtitle">${subtitle}</p>` : ''}
    <div class="widget-content">${content}</div>
  </section>
`;
