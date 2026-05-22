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
  PaymentMethodSkeletonRowsOptions,
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

const joinClassNames = (...classNames: Array<string | false | undefined>) =>
  classNames.filter(Boolean).join(' ');

const normalizeCopyValue = (value?: string): string | undefined => {
  const normalized = value?.trim();

  return normalized ? normalized : undefined;
};

const paymentMethodFallbackAccountLabel = ({
  label,
  brand,
  last4,
}: PaymentMethod): string => {
  const normalizedLabel = normalizeCopyValue(label);
  const normalizedBrand = normalizeCopyValue(brand);

  if (last4 && normalizedBrand && normalizedBrand !== normalizedLabel) {
    return `${normalizedBrand} •••• ${last4}`;
  }

  if (last4) {
    return `•••• ${last4}`;
  }

  return normalizedBrand ?? '';
};

type VerificationStatusPresentation = {
  label: string;
  tone: 'success' | 'warning' | 'danger';
};

const paymentMethodStatusPresentation = (
  status: PaymentMethod['status']
): VerificationStatusPresentation => {
  if (status === 'verified') {
    return {label: 'Verified', tone: 'success'};
  }

  if (status === 'under-review') {
    return {label: 'Under review', tone: 'warning'};
  }

  if (status === 'require-info') {
    return {label: 'Need More Information', tone: 'warning'};
  }

  if (status === 'declined') {
    return {label: "Can't Use", tone: 'danger'};
  }

  return {label: 'Action Required', tone: 'warning'};
};

export const renderVerificationStatusBadge = (
  status: PaymentMethod['status']
): TemplateResult => {
  const presentation = paymentMethodStatusPresentation(status);

  return html`
    <span
      class="verification-status-badge verification-status-badge-${presentation.tone}"
      data-verification-status=${status}
    >
      <span class="verification-status-label">${presentation.label}</span>
    </span>
  `;
};

const isPaymentMethodStatusClickable = (
  status: PaymentMethod['status']
): boolean =>
  status === 'verified' ||
  status === 'require-info' ||
  status === 'not-verified';

const isPaymentMethodRowClickable = (method: PaymentMethod): boolean =>
  isPaymentMethodStatusClickable(method.status);

const shouldRenderPaymentMethodStatus = (method: PaymentMethod): boolean =>
  method.showVerificationStatus !== false && method.status !== 'verified';

const renderPaymentMethodCopy = (method: PaymentMethod): TemplateResult => {
  const accountLabel =
    normalizeCopyValue(method.accountLabel) ??
    paymentMethodFallbackAccountLabel(method);
  const title = normalizeCopyValue(method.label) ?? accountLabel;
  const shouldRenderMeta = Boolean(accountLabel);

  return html`
    <span class="payment-method-copy">
      <span class="payment-method-title-row">
        <span class="payment-method-title">${title}</span>
      </span>
      ${shouldRenderMeta
        ? html`
            <span class="payment-method-meta-row">
              <span class="payment-method-meta">${accountLabel}</span>
              ${shouldRenderPaymentMethodStatus(method)
                ? renderVerificationStatusBadge(method.status)
                : ''}
            </span>
          `
        : ''}
    </span>
  `;
};

const renderPaymentMethodBalance = ({
  balanceLabel,
  balanceLoading,
}: PaymentMethod): TemplateResult | '' => {
  if (balanceLoading) {
    return html`
      <span
        class="payment-method-balance-loading"
        role="status"
        aria-label="Loading balance"
      ></span>
    `;
  }

  if (!balanceLabel) {
    return '';
  }

  return html`<span class="payment-method-balance">${balanceLabel}</span>`;
};

const renderPaymentMethodTrailingContent = (
  method: PaymentMethod,
  clickable: boolean
): TemplateResult => html`
  <span class="payment-method-trailing">
    ${renderPaymentMethodBalance(method)}
    ${clickable
      ? html`
          <span class="payment-method-chevron" aria-hidden="true">
            <span class="payment-method-chevron-icon"></span>
          </span>
        `
      : ''}
  </span>
`;

const renderPaymentMethodDeleteAction = (
  paymentMethodId: string,
  deleteLabel: string,
  disabled = false,
  confirmingDelete = false
): TemplateResult => html`
  <span class="payment-method-delete-action">
    ${confirmingDelete
      ? html`
          <span class="payment-method-delete-confirmation" role="status"
            >press again to confirm</span
          >
        `
      : ''}
    <button
      class="payment-method-delete-button"
      type="button"
      aria-label=${confirmingDelete
        ? `${deleteLabel}. Press again to confirm`
        : deleteLabel}
      data-action="delete-payment-source"
      data-payment-method-id=${paymentMethodId}
      ?disabled=${disabled}
    >
      <span class="payment-method-delete-icon" aria-hidden="true"></span>
    </button>
  </span>
`;

const renderPaymentMethodContent = (
  method: PaymentMethod,
  trailingContent: TemplateResult
): TemplateResult => html`
  <span class="payment-method-icon-chip" aria-hidden="true">
    <img
      class="payment-method-icon-image"
      data-payment-method-icon=${resolvePaymentMethodIconName(method)}
      src=${resolvePaymentMethodIconDataUri(method)}
      alt=""
    />
  </span>
  ${renderPaymentMethodCopy(method)} ${trailingContent}
`;

export const renderButton = ({
  label,
  variant = 'primary',
  action,
  type = 'button',
  icon,
  disabled = false,
  loading = false,
}: ButtonOptions): TemplateResult => html`
  <button
    class=${joinClassNames(
      'button',
      `button-${variant}`,
      loading && 'button-loading'
    )}
    type=${type}
    data-action=${ifDefined(action)}
    aria-busy=${loading ? 'true' : 'false'}
    ?disabled=${disabled || loading}
  >
    <span class="button-content">
      ${loading
        ? html`<span class="button-spinner" aria-hidden="true"></span>`
        : icon
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
  variant = 'default',
  autocomplete,
  inputmode,
  disabled = false,
  dataField,
  dataFieldScope = 'card',
  error,
}: TextFieldOptions): TemplateResult => {
  const fieldClasses = joinClassNames(
    'field',
    span === 'full' && 'field-full',
    variant === 'card-form' && 'field-card-form',
    error && 'field-invalid'
  );
  const labelClasses = joinClassNames(
    'field-label',
    variant === 'card-form' && 'field-label-card-form'
  );
  const inputClasses = joinClassNames(
    'field-input',
    variant === 'card-form' && 'field-input-card-form'
  );
  const input = html`
    <input
      class=${inputClasses}
      id=${id}
      name=${ifDefined(name)}
      type=${type}
      .value=${value}
      placeholder=${ifDefined(placeholder)}
      autocomplete=${ifDefined(autocomplete)}
      inputmode=${ifDefined(inputmode)}
      data-card-field=${ifDefined(
        dataFieldScope === 'card' ? dataField : undefined
      )}
      data-bank-account-field=${ifDefined(
        dataFieldScope === 'bankAccount' ? dataField : undefined
      )}
      aria-invalid=${error ? 'true' : 'false'}
      aria-describedby=${ifDefined(error ? `${id}-error` : undefined)}
      ?disabled=${disabled}
    />
  `;

  return html`
    <div class=${fieldClasses}>
      <label class=${labelClasses} for=${id}>${label}</label>
      ${variant === 'card-form'
        ? html`
            <div class="field-control field-control-card-form">${input}</div>
          `
        : input}
      ${error
        ? html`<p class="field-error" id=${`${id}-error`}>${error}</p>`
        : ''}
    </div>
  `;
};

export const renderSelectField = ({
  id,
  label,
  name,
  value = '',
  options,
  span = 'default',
  variant = 'default',
  disabled = false,
  dataField,
  dataFieldScope = 'card',
  error,
}: SelectFieldOptions): TemplateResult => {
  const fieldClasses = joinClassNames(
    'field',
    variant !== 'card-form' && 'field-with-select',
    span === 'full' && 'field-full',
    variant === 'card-form' && 'field-card-form',
    error && 'field-invalid'
  );
  const labelClasses = joinClassNames(
    'field-label',
    variant === 'card-form' && 'field-label-card-form'
  );
  const selectClasses = joinClassNames(
    'field-input',
    'field-select',
    variant === 'card-form' && 'field-input-card-form'
  );
  const select = html`
    <select
      class=${selectClasses}
      id=${id}
      name=${ifDefined(name)}
      .value=${value}
      data-card-field=${ifDefined(
        dataFieldScope === 'card' ? dataField : undefined
      )}
      data-bank-account-field=${ifDefined(
        dataFieldScope === 'bankAccount' ? dataField : undefined
      )}
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
  `;

  return html`
    <div class=${fieldClasses}>
      <label class=${labelClasses} for=${id}>${label}</label>
      ${variant === 'card-form'
        ? html`
            <div
              class="field-control field-control-card-form field-with-select"
            >
              ${select}
            </div>
          `
        : select}
      ${error
        ? html`<p class="field-error" id=${`${id}-error`}>${error}</p>`
        : ''}
    </div>
  `;
};

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
  <div class="alert alert-${variant}" role="alert">
    <span class="alert-message">${message}</span>
  </div>
`;

export const renderOtpResend = ({
  label,
  action,
  disabled = false,
  loading = false,
}: OtpResendOptions): TemplateResult => html`
  <button
    class=${joinClassNames('otp-resend', loading && 'otp-resend-loading')}
    type="button"
    data-action=${action}
    aria-busy=${loading ? 'true' : 'false'}
    ?disabled=${disabled || loading}
  >
    ${loading
      ? html`<span class="otp-resend-spinner" aria-hidden="true"></span>`
      : ''}
    <span class="otp-resend-label">${label}</span>
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

export const renderPaymentMethodRow = (
  {
    id,
    label,
    status,
    type,
    eyebrow,
    brand,
    accountLabel,
    balanceLabel,
    balanceLoading,
    last4,
    showVerificationStatus,
    disabled = false,
  }: PaymentMethod,
  {
    variant = 'default',
    deleteDisabled = false,
    confirmingDelete = false,
    selected = false,
  }: {
    variant?: 'default' | 'edit';
    deleteDisabled?: boolean;
    confirmingDelete?: boolean;
    selected?: boolean;
  } = {}
): TemplateResult => {
  const method: PaymentMethod = {
    id,
    label,
    status,
    type,
    eyebrow,
    brand,
    accountLabel,
    balanceLabel,
    balanceLoading,
    last4,
    showVerificationStatus,
    disabled,
  };

  if (variant === 'edit') {
    const editMethod = {...method, showVerificationStatus: false};

    return html`
      <div
        class="payment-method-row payment-method-row-edit"
        aria-label=${label}
        data-payment-method-id=${id}
      >
        ${renderPaymentMethodContent(
          editMethod,
          renderPaymentMethodDeleteAction(
            id,
            `Delete ${label}`,
            deleteDisabled,
            confirmingDelete
          )
        )}
      </div>
    `;
  }

  if (isPaymentMethodRowClickable(method)) {
    return html`
      <button
        class=${joinClassNames(
          'payment-method-row',
          'payment-method-row-action',
          selected && 'payment-method-row-selected'
        )}
        type="button"
        aria-disabled=${disabled ? 'true' : 'false'}
        data-action=${status === 'verified'
          ? 'attach-payment-source'
          : 'verify-payment-source'}
        data-payment-method-id=${id}
        ?disabled=${disabled}
      >
        ${renderPaymentMethodContent(
          method,
          renderPaymentMethodTrailingContent(method, true)
        )}
      </button>
    `;
  }

  return html`
    <div
      class=${joinClassNames('payment-method-row', 'payment-method-row-static')}
      aria-label=${label}
      aria-disabled="true"
      data-payment-method-id=${id}
    >
      ${renderPaymentMethodContent(
        method,
        renderPaymentMethodTrailingContent(method, false)
      )}
    </div>
  `;
};

export const renderSelectedPaymentMethod = ({
  id,
  label,
  status,
  type,
  eyebrow,
  brand,
  accountLabel,
  balanceLabel,
  balanceLoading,
  last4,
  showVerificationStatus,
}: PaymentMethod): TemplateResult => {
  const method: PaymentMethod = {
    id,
    label,
    status,
    type,
    eyebrow,
    brand,
    accountLabel,
    balanceLabel,
    balanceLoading,
    last4,
    showVerificationStatus,
  };

  return html`
    <div class="selected-payment-method" aria-label=${label}>
      ${renderPaymentMethodContent(
        method,
        renderPaymentMethodTrailingContent(method, false)
      )}
    </div>
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
          <span class="source-action-link-chevron" aria-hidden="true">
            <span class="source-action-link-chevron-icon"></span>
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
  <div class="detail-list detail-list-compact">
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
  fileName,
  action,
  error = false,
  disabled = false,
}: UploadRowOptions): TemplateResult => html`
  <button
    class="upload-row ${error ? 'upload-row-error' : ''}"
    type="button"
    data-action=${ifDefined(action)}
    ?disabled=${disabled}
    aria-label=${`${actionLabel}. ${label}. ${fileName ?? 'No file chosen'}`}
  >
    <span class="upload-row-action">${actionLabel}</span>
    <span class="upload-row-file-name">${fileName ?? 'No file chosen'}</span>
    <span class="upload-row-label">${label}</span>
    <span class="upload-row-requirements">${requirements}</span>
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

export const renderPaymentMethodSkeletonRows = ({
  count = 3,
  label = 'Loading payment methods',
}: PaymentMethodSkeletonRowsOptions = {}): TemplateResult => html`
  <div class="payment-method-skeletons" role="status" aria-live="polite">
    <span class="payment-method-skeleton-label">${label}</span>
    ${Array.from(
      {length: count},
      () => html`
        <div class="payment-method-skeleton-row" aria-hidden="true">
          <span class="payment-method-skeleton-icon"></span>
          <span class="payment-method-skeleton-copy">
            <span
              class="payment-method-skeleton-line payment-method-skeleton-title"
            ></span>
            <span
              class="payment-method-skeleton-line payment-method-skeleton-meta"
            ></span>
          </span>
          <span class="payment-method-skeleton-trailing"></span>
        </div>
      `
    )}
  </div>
`;

export const renderProviderFrame = ({
  containerId,
  title,
  loadingLabel,
  loading = false,
}: ProviderFrameOptions): TemplateResult => html`
  <div
    class=${joinClassNames(
      'provider-frame',
      loading && 'provider-frame-loading'
    )}
    aria-busy=${loading ? 'true' : 'false'}
  >
    ${title
      ? html`
          <div class="provider-frame-header">
            ${title ? html`<p class="provider-frame-title">${title}</p>` : ''}
            ${loadingLabel && !loading
              ? html`
                  <p
                    class="provider-frame-status"
                    role="status"
                    aria-live="polite"
                  >
                    ${loadingLabel}
                  </p>
                `
              : ''}
          </div>
        `
      : ''}
    <slot class="provider-frame-slot" name=${containerId}>
      <div
        class=${joinClassNames(
          'provider-frame-container',
          loading && 'provider-frame-container-loading'
        )}
        id=${containerId}
      ></div>
    </slot>
    ${loading
      ? html`
          <div
            class="provider-loading-overlay"
            role="status"
            aria-live="polite"
          >
            <span class="loading-spinner" aria-hidden="true"></span>
            <span class="provider-loading-label">
              ${loadingLabel ?? 'Loading provider'}
            </span>
          </div>
        `
      : ''}
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
  headerAction,
  width = 'default',
  ariaLabel = 'Commerce Hub Connect',
  closeAction = 'close',
  showClose = true,
  showFooter = true,
  busy = false,
  overlay,
}: WidgetShellOptions): TemplateResult => html`
  <section
    class=${joinClassNames(
      'widget-shell',
      width === 'wide' && 'widget-shell-wide',
      busy && 'widget-shell-busy'
    )}
    aria-label=${ariaLabel}
    aria-busy=${busy ? 'true' : 'false'}
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
    <div class="widget-header">
      <h2 class="widget-title">${title}</h2>
      ${headerAction
        ? html`<div class="widget-header-action">${headerAction}</div>`
        : ''}
    </div>
    ${subtitle ? html`<p class="widget-subtitle">${subtitle}</p>` : ''}
    <div class="widget-divider" aria-hidden="true"></div>
    <div class="widget-content">${content}</div>
    ${overlay ? html`<div class="widget-loading-overlay">${overlay}</div>` : ''}
    ${showFooter ? renderPoweredByFooter() : ''}
  </section>
`;
