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
    return {label: 'Ready', tone: 'success'};
  }

  if (status === 'under-review') {
    return {label: 'Needs review', tone: 'warning'};
  }

  if (status === 'require-info') {
    return {label: 'Needs info', tone: 'warning'};
  }

  if (status === 'declined') {
    return {label: "Can't use", tone: 'danger'};
  }

  return {label: 'Action required', tone: 'warning'};
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
): boolean => status === 'require-info' || status === 'not-verified';

const isPaymentMethodRowClickable = (method: PaymentMethod): boolean =>
  isPaymentMethodStatusClickable(method.status);

const shouldRenderPaymentMethodStatus = (method: PaymentMethod): boolean =>
  method.showVerificationStatus !== false;

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
        ${shouldRenderPaymentMethodStatus(method)
          ? renderVerificationStatusBadge(method.status)
          : ''}
      </span>
      ${shouldRenderMeta
        ? html`
            <span class="payment-method-meta-row">
              <span class="payment-method-meta">${accountLabel}</span>
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
  paymentMethodLabel: string,
  disabled = false
): TemplateResult => {
  const deleteLabel = `Delete ${paymentMethodLabel}`;

  return html`
    <span class="payment-method-delete-action">
      <button
        class="payment-method-delete-confirm-button payment-method-delete-confirm-button-danger"
        type="button"
        aria-label=${deleteLabel}
        data-action="delete-payment-source"
        data-payment-method-id=${paymentMethodId}
        ?disabled=${disabled}
      >
        <!--! Font Awesome Free 7.3.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc. -->
        <svg
          class="payment-method-delete-action-icon"
          viewBox="0 0 640 640"
          aria-hidden="true"
          focusable="false"
        >
          <path
            d="M232.7 69.9L224 96L128 96C110.3 96 96 110.3 96 128C96 145.7 110.3 160 128 160L512 160C529.7 160 544 145.7 544 128C544 110.3 529.7 96 512 96L416 96L407.3 69.9C402.9 56.8 390.7 48 376.9 48L263.1 48C249.3 48 237.1 56.8 232.7 69.9zM512 208L128 208L149.1 531.1C150.7 556.4 171.7 576 197 576L443 576C468.3 576 489.3 556.4 490.9 531.1L512 208z"
          ></path>
        </svg>
      </button>
    </span>
  `;
};

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

const renderPaymentMethodMain = (
  method: PaymentMethod,
  clickable = isPaymentMethodRowClickable(method)
): TemplateResult => {
  const content = renderPaymentMethodContent(
    method,
    renderPaymentMethodTrailingContent(method, clickable)
  );

  if (clickable) {
    return html`
      <button
        class="payment-method-row-main payment-method-row-main-action"
        type="button"
        data-action="verify-payment-source"
        data-payment-method-id=${method.id}
        ?disabled=${method.disabled}
      >
        ${content}
      </button>
    `;
  }

  return html`<span class="payment-method-row-main">${content}</span>`;
};

const renderSelectablePaymentMethodMain = (
  method: PaymentMethod,
  selected: boolean
): TemplateResult => html`
  <label
    class="payment-method-row-main payment-method-row-main-action payment-method-row-main-radio"
  >
    <input
      class="payment-method-radio"
      type="radio"
      name="payment-method"
      value=${method.id}
      data-payment-method-radio="true"
      aria-label=${`Select ${method.label}`}
      .checked=${selected}
      ?disabled=${method.disabled}
    />
    ${renderPaymentMethodContent(
      method,
      html`<span class="payment-method-trailing">
        ${renderPaymentMethodBalance(method)}
      </span>`
    )}
  </label>
`;

const renderPaymentMethodOverflowAction = (
  method: PaymentMethod,
  {
    menuOpen,
    menuPlacement,
    showMarkAsDefault,
  }: {
    menuOpen: boolean;
    menuPlacement: 'above' | 'below';
    showMarkAsDefault: boolean;
  }
): TemplateResult => {
  const menuId = `payment-method-menu-${method.id}`;

  return html`
    <span class="payment-method-overflow">
      ${method.isDefault
        ? html`<span class="payment-method-default-label">Default</span>`
        : ''}
      <button
        class="payment-method-overflow-button"
        type="button"
        aria-label=${`More actions for ${method.label}`}
        aria-haspopup="true"
        aria-expanded=${menuOpen ? 'true' : 'false'}
        aria-controls=${menuId}
        data-action="toggle-payment-source-menu"
        data-payment-method-id=${method.id}
        ?disabled=${method.disabled}
      >
        <!--! Font Awesome Free 7.3.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc. -->
        <svg viewBox="0 0 640 640" aria-hidden="true">
          <path
            d="M320 208C289.1 208 264 182.9 264 152C264 121.1 289.1 96 320 96C350.9 96 376 121.1 376 152C376 182.9 350.9 208 320 208zM320 432C350.9 432 376 457.1 376 488C376 518.9 350.9 544 320 544C289.1 544 264 518.9 264 488C264 457.1 289.1 432 320 432zM376 320C376 350.9 350.9 376 320 376C289.1 376 264 350.9 264 320C264 289.1 289.1 264 320 264C350.9 264 376 289.1 376 320z"
          ></path>
        </svg>
      </button>
      ${menuOpen
        ? html`
            <span
              class=${joinClassNames(
                'payment-method-menu',
                menuPlacement === 'above' && 'payment-method-menu-above'
              )}
              id=${menuId}
              role="menu"
            >
              ${showMarkAsDefault &&
              !method.isDefault &&
              method.status === 'verified'
                ? html`
                    <button
                      type="button"
                      role="menuitem"
                      data-action="mark-payment-source-default"
                      data-payment-method-id=${method.id}
                      ?disabled=${method.disabled}
                    >
                      Mark as default
                    </button>
                  `
                : ''}
              <button
                type="button"
                role="menuitem"
                data-action="delete-payment-source"
                data-payment-method-id=${method.id}
                ?disabled=${method.disabled}
              >
                Delete
              </button>
            </span>
          `
        : ''}
    </span>
  `;
};

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
    part=${ifDefined(variant === 'primary' ? 'primary-action' : undefined)}
    type=${type}
    data-action=${ifDefined(action)}
    aria-busy=${loading ? 'true' : 'false'}
    ?disabled=${disabled || loading}
  >
    <span class="button-content">
      ${loading
        ? html`<span class="button-spinner" aria-hidden="true"></span>`
        : icon === 'plus'
        ? html`
            <!--! Font Awesome Free 7.3.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc. -->
            <svg
              class="button-icon button-icon-plus"
              viewBox="0 0 640 640"
              aria-hidden="true"
              focusable="false"
            >
              <path
                d="M352 128C352 110.3 337.7 96 320 96C302.3 96 288 110.3 288 128L288 288L128 288C110.3 288 96 302.3 96 320C96 337.7 110.3 352 128 352L288 352L288 512C288 529.7 302.3 544 320 544C337.7 544 352 529.7 352 512L352 352L512 352C529.7 352 544 337.7 544 320C544 302.3 529.7 288 512 288L352 288L352 128z"
              ></path>
            </svg>
          `
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
      data-transfer-field=${ifDefined(
        dataFieldScope === 'transfer' ? dataField : undefined
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
      data-transfer-field=${ifDefined(
        dataFieldScope === 'transfer' ? dataField : undefined
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
  <div class="alert alert-${variant}" part="alert" role="alert">
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
    isDefault,
    disabled = false,
  }: PaymentMethod,
  {
    deleteDisabled = false,
    confirmingDelete = false,
    menuOpen = false,
    menuPlacement = 'below',
    selected = false,
    selectable = false,
    showMarkAsDefault = false,
  }: {
    deleteDisabled?: boolean;
    confirmingDelete?: boolean;
    menuOpen?: boolean;
    menuPlacement?: 'above' | 'below';
    selected?: boolean;
    selectable?: boolean;
    showMarkAsDefault?: boolean;
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
    isDefault,
    disabled,
  };

  if (confirmingDelete) {
    return html`
      <div
        class=${joinClassNames(
          'payment-method-row',
          'payment-method-row-edit',
          'payment-method-row-delete-confirming'
        )}
        part="payment-method-row"
        aria-label=${label}
        data-payment-method-id=${id}
      >
        ${renderPaymentMethodMain(method, false)}
        ${renderPaymentMethodDeleteAction(id, label, deleteDisabled)}
      </div>
    `;
  }

  const rendersRadio = selectable && status === 'verified';

  return html`
    <div
      class=${joinClassNames(
        'payment-method-row',
        rendersRadio || isPaymentMethodRowClickable(method)
          ? 'payment-method-row-action'
          : 'payment-method-row-static',
        rendersRadio && 'payment-method-row-radio',
        selected && rendersRadio && 'payment-method-row-selected',
        menuOpen && 'payment-method-row-menu-open'
      )}
      part="payment-method-row"
      aria-label=${label}
      aria-disabled=${disabled ? 'true' : 'false'}
      data-payment-method-id=${id}
    >
      ${rendersRadio
        ? renderSelectablePaymentMethodMain(method, selected)
        : renderPaymentMethodMain(method)}
      ${renderPaymentMethodOverflowAction(method, {
        menuOpen,
        menuPlacement,
        showMarkAsDefault,
      })}
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
    <div
      class="selected-payment-method"
      part="payment-method-row"
      aria-label=${label}
    >
      ${renderPaymentMethodContent(
        method,
        renderPaymentMethodTrailingContent(method, false)
      )}
    </div>
  `;
};

const renderSourceActionIcon = (icon: SourceActionOptions['icon']) =>
  icon === 'transfer'
    ? html`
        <span
          class="source-action-icon source-action-icon-transfer"
          aria-hidden="true"
        >
          <span
            class="source-action-transfer-arrow source-action-transfer-arrow-forward"
          ></span>
          <span
            class="source-action-transfer-arrow source-action-transfer-arrow-back"
          ></span>
        </span>
      `
    : html`<span class="source-action-icon" aria-hidden="true">+</span>`;

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
          ${renderSourceActionIcon(icon)}
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
          ${renderSourceActionIcon(icon)}
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
    part="provider-frame"
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
  icon,
  variant = 'default',
  disabled = false,
}: TextLinkButtonOptions): TemplateResult => html`
  <button
    class=${joinClassNames(
      'text-link-button',
      `text-link-button-${variant}`,
      icon && `text-link-button-${icon}`
    )}
    type="button"
    data-action=${action}
    ?disabled=${disabled}
  >
    ${icon === 'edit'
      ? html`
          <!--! Font Awesome Free 7.3.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc. -->
          <svg
            class="text-link-button-icon text-link-button-icon-edit"
            viewBox="0 0 640 640"
            aria-hidden="true"
            focusable="false"
          >
            <path
              d="M535.6 85.7C513.7 63.8 478.3 63.8 456.4 85.7L432 110.1L529.9 208L554.3 183.6C576.2 161.7 576.2 126.3 554.3 104.4L535.6 85.7zM236.4 305.7C230.3 311.8 225.6 319.3 222.9 327.6L193.3 416.4C190.4 425 192.7 434.5 199.1 441C205.5 447.5 215 449.7 223.7 446.8L312.5 417.2C320.7 414.5 328.2 409.8 334.4 403.7L496 241.9L398.1 144L236.4 305.7zM160 128C107 128 64 171 64 224L64 480C64 533 107 576 160 576L416 576C469 576 512 533 512 480L512 384C512 366.3 497.7 352 480 352C462.3 352 448 366.3 448 384L448 480C448 497.7 433.7 512 416 512L160 512C142.3 512 128 497.7 128 480L128 224C128 206.3 142.3 192 160 192L256 192C273.7 192 288 177.7 288 160C288 142.3 273.7 128 256 128L160 128z"
            ></path>
          </svg>
        `
      : icon
      ? html`<span
          class=${`text-link-button-icon text-link-button-icon-${icon}`}
          aria-hidden="true"
        ></span>`
      : ''}
    <span>${label}</span>
  </button>
`;

export const renderPoweredByFooter = (): TemplateResult => html`
  <footer class="powered-by-footer" part="footer">
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
  backAction,
  backDisabled = false,
  titleAction,
  headerAction,
  footer,
  width = 'default',
  layout = 'default',
  ariaLabel = 'Commerce Hub Connect',
  closeAction = 'close',
  showClose = true,
  showDivider = false,
  showFooter = true,
  busy = false,
  overlay,
}: WidgetShellOptions): TemplateResult => html`
  <section
    class=${joinClassNames(
      'widget-shell',
      width === 'wide' && 'widget-shell-wide',
      layout === 'payment-methods' && 'widget-shell-payment-methods',
      busy && 'widget-shell-busy'
    )}
    part="shell"
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
    <div class="widget-header" part="header">
      <div class="widget-heading-row">
        ${backAction
          ? html`
              <button
                class="widget-back-button"
                type="button"
                aria-label="Back"
                data-action=${backAction}
                ?disabled=${backDisabled}
              >
                <!--! Font Awesome Free 7.3.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc. -->
                <svg
                  class="widget-back-icon"
                  viewBox="0 0 640 640"
                  aria-hidden="true"
                  focusable="false"
                >
                  <path
                    d="M201.4 297.4C188.9 309.9 188.9 330.2 201.4 342.7L361.4 502.7C373.9 515.2 394.2 515.2 406.7 502.7C419.2 490.2 419.2 469.9 406.7 457.4L269.3 320L406.6 182.6C419.1 170.1 419.1 149.8 406.6 137.3C394.1 124.8 373.8 124.8 361.3 137.3L201.3 297.3z"
                  ></path>
                </svg>
              </button>
            `
          : ''}
        <div class="widget-heading">
          <h2 class="widget-title" part="title">${title}</h2>
          ${subtitle ? html`<p class="widget-subtitle">${subtitle}</p>` : ''}
        </div>
        ${titleAction
          ? html`<div class="widget-title-action">${titleAction}</div>`
          : ''}
      </div>
      ${headerAction
        ? html`<div class="widget-header-action">${headerAction}</div>`
        : ''}
    </div>
    ${showDivider
      ? html`<div class="widget-divider" aria-hidden="true"></div>`
      : ''}
    <div class="widget-content" part="content">${content}</div>
    ${footer && showFooter
      ? html`<div class="widget-action-footer" part="footer">${footer}</div>`
      : ''}
    ${overlay ? html`<div class="widget-loading-overlay">${overlay}</div>` : ''}
  </section>
`;
