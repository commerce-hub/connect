import {css} from 'lit';

export const primitiveStyles = css`
  :host {
    --chc-text: #111827;
    --chc-copy: #4b5565;
    --chc-muted: #6b7280;
    --chc-placeholder: #9ca3af;
    --chc-surface: #ffffff;
    --chc-widget-background: var(--chc-surface);
    --chc-soft-surface: #f8fafc;
    --chc-border: #d9e1ec;
    --chc-border-strong: #c6d0dd;
    --chc-payment-method-background: var(--chc-surface);
    --chc-primary: #1d4ed8;
    --chc-success: #047857;
    --chc-success-bg: #ecfdf3;
    --chc-success-border: #a6f4c5;
    --chc-danger: #f20d19;
    --chc-danger-bg: #fef3f2;
    --chc-danger-border: #fecdca;
    --chc-warning: #e88700;
    --chc-warning-bg: #fffaeb;
    --chc-warning-border: #fedf89;
    --chc-disabled-text: #ffffff;
    --chc-disabled-surface: #c5ccd8;
    --chc-font-family: Inter, 'Segoe UI', Arial, sans-serif;
    --chc-radius-control: 0.625rem;
    --chc-radius-card: 0.75rem;
    --chc-input-height: 2.5rem;
    --chc-font-weight: 400;
    --chc-divider: #ebeef2;
    --chc-focus-ring: rgba(29, 78, 216, 0.14);
    --chc-motion-fast: 120ms;
    --chc-motion-base: 180ms;
    --chc-motion-slow: 240ms;
    --chc-motion-provider: 300ms;
    --chc-ease-standard: cubic-bezier(0.2, 0, 0, 1);
    --chc-ease-emphasized: cubic-bezier(0.16, 1, 0.3, 1);
    --chc-spinner-duration: 900ms;
    --chc-shell-padding: 1.1875rem 1.1875rem 1rem;
    display: block;
    color: var(--chc-text);
    font-family: var(--chc-font-family);
    font-size: 1rem;
    font-weight: var(--chc-font-weight);
  }

  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  .widget-close,
  .otp-resend,
  .button,
  .field-input,
  .payment-method-row,
  .selected-payment-method,
  .source-action,
  .source-action-link,
  .upload-row,
  .text-link-button {
    font-family: inherit;
    font-size: inherit;
    font-style: inherit;
    font-weight: inherit;
  }

  .widget-shell {
    width: 100%;
    max-width: 25.25rem;
    position: relative;
    padding: var(--chc-shell-padding);
    border: 0;
    border-radius: 0;
    background: var(--chc-widget-background);
    text-align: left;
  }

  .widget-shell-busy {
    overflow: hidden;
  }

  .widget-shell-wide {
    max-width: 40rem;
  }

  .widget-close {
    width: 2rem;
    height: 2rem;
    position: absolute;
    top: 0.875rem;
    right: 0.75rem;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: 0;
    border-radius: 999rem;
    background: color-mix(in srgb, var(--chc-soft-surface) 88%, white);
    color: var(--chc-muted);
    font-size: 1.25em;
    font-weight: inherit;
    cursor: pointer;
  }

  .widget-title {
    margin: 0;
    color: var(--chc-text);
    font-size: 1.125rem;
    font-weight: inherit;
    letter-spacing: 0;
  }

  .widget-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.625rem;
  }

  .widget-header-action {
    flex: 0 0 auto;
  }

  .widget-header-action .text-link-button {
    color: var(--chc-primary);
    font-weight: inherit;
  }

  .widget-subtitle {
    margin: 0.375rem 0 0;
    color: var(--chc-copy);
    font-weight: inherit;
    font-size: 0.9375em;
    text-align: center;
  }

  .widget-divider {
    height: 0.0625rem;
    margin-top: 1rem;
    background: var(--chc-divider);
  }

  .widget-content {
    margin-top: 1.125rem;
    margin-right: auto;
    margin-left: auto;
  }

  .primitive-stack {
    display: grid;
    gap: 0.625rem;
  }

  .primitive-actions {
    display: grid;
    gap: 0.625rem;
    margin-top: 0.875rem;
  }

  .primitive-footer {
    display: grid;
    gap: 0.625rem;
    margin-top: 0.875rem;
  }

  .card-form-back-header,
  .bank-provider-back-header {
    display: inline-flex;
    align-items: center;
  }

  .card-form-back-header .text-link-button,
  .bank-provider-back-header .text-link-button {
    min-height: 1.875rem;
    display: inline-flex;
    align-items: center;
    border: 0.0625rem solid var(--chc-border);
    border-radius: 999rem;
    padding: 0 0.625rem;
    background: var(--chc-soft-surface);
    color: var(--chc-text);
    font-size: 0.875em;
    font-weight: inherit;
  }

  .card-form-back-header .text-link-button:disabled,
  .bank-provider-back-header .text-link-button:disabled {
    color: var(--chc-muted);
  }

  .card-form-back-header .text-link-button::before,
  .bank-provider-back-header .text-link-button::before {
    content: '←';
    margin-right: 0.375rem;
  }

  .card-form-primary {
    display: grid;
  }

  .payment-action-links {
    display: grid;
    gap: 0.625rem;
    margin-top: 0;
    justify-items: stretch;
  }

  .otp-flow,
  .payment-flow,
  .required-info-flow {
    display: grid;
    gap: 0.75rem;
  }

  .required-info-card {
    display: grid;
    gap: 0.75rem;
    min-height: 9.75rem;
    border-radius: min(1rem, calc(var(--chc-radius-card) * 1.5));
    border: 0.0625rem solid var(--chc-border);
    padding: 1rem;
    background: color-mix(
      in srgb,
      var(--chc-primary) 6%,
      var(--chc-surface)
    );
    color: var(--chc-text);
    overflow: hidden;
  }

  .required-info-card-top,
  .required-info-card-bottom {
    display: flex;
    min-width: 0;
    align-items: flex-start;
    justify-content: space-between;
    gap: 0.75rem;
  }

  .required-info-card-heading,
  .required-info-card-detail {
    display: grid;
    min-width: 0;
    gap: 0.25rem;
  }

  .required-info-card-label {
    color: var(--chc-copy);
    font-size: 0.8125em;
    font-weight: inherit;
    letter-spacing: 0;
  }

  .required-info-card-field {
    min-width: 0;
    overflow: hidden;
    color: var(--chc-text);
    font-weight: inherit;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .required-info-card-name {
    font-size: 1.0625em;
  }

  .required-info-card-number {
    font-size: 1.25em;
    letter-spacing: 0.12em;
  }

  .required-info-card-expiry {
    font-size: 1em;
  }

  .required-info-card-icon-chip {
    width: 3.75rem;
    height: 2.375rem;
    flex: 0 0 auto;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: 0;
    border-radius: 0.5rem;
    background: color-mix(
      in srgb,
      var(--chc-primary) 6%,
      var(--chc-surface)
    );
    color: var(--chc-primary);
    box-shadow: none;
  }

  .required-info-card-icon-image {
    max-width: 4rem;
    max-height: 3rem;
    display: block;
  }

  .required-info-card-icon-image[data-required-info-card-icon='bank'] {
    width: 1.625rem;
    height: 1.625rem;
    opacity: 0.78;
  }

  .required-info-card-status {
    display: inline-flex;
  }

  .required-info-card-status .verification-status-badge {
    border-color: var(--chc-warning-border);
    background: var(--chc-warning-bg);
  }

  .required-info-documents {
    display: grid;
    gap: 0.5rem;
    margin-top: 0.5rem;
  }

  .required-info-section-title {
    margin: 0;
    color: var(--chc-text);
    font-weight: inherit;
  }

  .required-info-document {
    display: grid;
    gap: 0.375rem;
  }

  .required-document-row {
    border: 0.0625rem solid var(--chc-border);
    border-radius: var(--chc-radius-card);
    padding: 0.5rem;
    background: color-mix(
      in srgb,
      var(--chc-soft-surface) 80%,
      var(--chc-surface)
    );
  }

  .required-info-ssn-control {
    display: grid;
    grid-template-columns:
      minmax(0, 4.5rem) auto minmax(0, 3.5rem) auto
      minmax(0, 5.5rem);
    max-width: 17rem;
    align-items: center;
    gap: 0.375rem;
  }

  .required-info-ssn-input {
    text-align: center;
  }

  .required-info-ssn-separator {
    color: var(--chc-copy);
    font-weight: inherit;
  }

  .required-info-selected-file {
    margin: 0;
    overflow: hidden;
    color: var(--chc-copy);
    font-size: 0.875em;
    font-weight: inherit;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .otp-support {
    display: grid;
    justify-items: center;
    gap: 0.1875rem;
    text-align: center;
  }

  .otp-support-copy {
    margin: 0;
    color: var(--chc-copy);
  }

  .otp-support-actions {
    display: flex;
    align-items: center;
    gap: 0.1875rem;
  }

  .otp-resend-prefix {
    color: var(--chc-copy);
  }

  .otp-resend {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.375rem;
    border: 0;
    padding: 0;
    background: transparent;
    color: var(--chc-primary);
    font-weight: inherit;
    cursor: pointer;
  }

  .otp-resend:disabled {
    color: var(--chc-muted);
    cursor: not-allowed;
  }

  .button {
    width: 100%;
    min-height: var(--chc-input-height);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: 0.0625rem solid var(--chc-primary);
    border-radius: var(--chc-radius-control);
    padding: 0 1rem;
    font-weight: inherit;
    transition: border-color var(--chc-motion-fast) var(--chc-ease-standard),
      background-color var(--chc-motion-fast) var(--chc-ease-standard),
      transform var(--chc-motion-fast) var(--chc-ease-emphasized);
    cursor: pointer;
  }

  .button-content {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.1875rem;
  }

  .button-icon {
    width: 1em;
    height: 1em;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 0.875em;
  }

  .button-spinner,
  .otp-resend-spinner {
    width: 1em;
    height: 1em;
    display: inline-flex;
    flex: 0 0 auto;
    border: 0.125rem solid color-mix(in srgb, currentColor 28%, transparent);
    border-right-color: currentColor;
    border-radius: 999rem;
    animation: chc-spinner-rotate var(--chc-spinner-duration) linear infinite;
  }

  .otp-resend-spinner {
    width: 0.875em;
    height: 0.875em;
  }

  .button-icon-check::before {
    content: '✓';
  }

  .button-primary {
    background: var(--chc-primary);
    color: #fff;
  }

  .button-secondary {
    border-color: var(--chc-border);
    background: color-mix(
      in srgb,
      var(--chc-soft-surface) 82%,
      var(--chc-surface)
    );
    color: var(--chc-text);
  }

  .button:hover:not(:disabled) {
    transform: translateY(-0.0625rem);
  }

  .button:disabled {
    border-color: var(--chc-disabled-surface);
    background: var(--chc-disabled-surface);
    color: var(--chc-disabled-text);
    cursor: not-allowed;
  }

  .field {
    display: grid;
    gap: 0.3125rem;
    min-width: 0;
    text-align: left;
  }

  .field-control {
    min-width: 0;
  }

  .field-with-select {
    position: relative;
  }

  .field-full {
    grid-column: 1 / -1;
  }

  .billing-address-summary {
    gap: 0.375rem;
    padding: 0.625rem 0.75rem;
    border: 0.0625rem solid var(--chc-border);
    border-radius: 0.5rem;
    background: var(--chc-soft-surface);
  }

  .billing-address-summary-heading {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
  }

  .billing-address-summary-value {
    margin: 0;
    color: var(--chc-copy);
    font-size: 0.875em;
  }

  .field-label {
    color: var(--chc-text);
    font-weight: inherit;
    font-size: 0.875em;
  }

  .field-label-row,
  .required-info-document-heading {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
  }

  .required-info-document-name {
    min-width: 0;
    overflow: hidden;
    color: var(--chc-text);
    font-size: 0.875em;
    font-weight: inherit;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .required-info-requirement-badge {
    display: inline-flex;
    flex: 0 0 auto;
    border-radius: 999rem;
    padding: 0.125rem 0.4375rem;
    font-size: 0.6875em;
    font-weight: inherit;
  }

  .required-info-requirement-badge-required {
    background: color-mix(
      in srgb,
      var(--chc-warning) 12%,
      var(--chc-warning-bg)
    );
    color: var(--chc-warning);
  }

  .required-info-requirement-badge-optional {
    background: color-mix(
      in srgb,
      var(--chc-muted) 10%,
      var(--chc-soft-surface)
    );
    color: var(--chc-muted);
  }

  .field-input {
    width: 100%;
    min-height: var(--chc-input-height);
    border: 0.0625rem solid var(--chc-border);
    border-radius: var(--chc-radius-control);
    padding: 0.625rem 0.75rem;
    background: var(--chc-surface);
    color: var(--chc-text);
    text-align: left;
    transition: border-color var(--chc-motion-fast) var(--chc-ease-standard),
      box-shadow var(--chc-motion-fast) var(--chc-ease-standard),
      background-color var(--chc-motion-fast) var(--chc-ease-standard);
  }

  .field-input:focus {
    border-color: var(--chc-primary);
    outline: 0;
    box-shadow: 0 0 0 0.25rem var(--chc-focus-ring);
  }

  .field-select {
    appearance: auto;
    text-align: left;
  }

  .field-card-form {
    gap: 0.1875rem;
  }

  .field-label-card-form {
    color: var(--chc-copy);
    font-weight: inherit;
  }

  .field-control-card-form {
    width: 100%;
    min-height: var(--chc-input-height);
    padding: 0.625rem 0.75rem;
    border: 0.0625rem solid var(--chc-border);
    border-radius: var(--chc-radius-control);
    background: color-mix(
      in srgb,
      var(--chc-soft-surface) 82%,
      var(--chc-surface)
    );
    transition: border-color var(--chc-motion-fast) var(--chc-ease-standard),
      box-shadow var(--chc-motion-fast) var(--chc-ease-standard),
      background-color var(--chc-motion-fast) var(--chc-ease-standard);
  }

  .field-control-card-form:focus-within {
    border-color: var(--chc-primary);
    background: var(--chc-surface);
    box-shadow: 0 0 0 0.25rem var(--chc-focus-ring);
  }

  .field-card-form.field-invalid .field-control-card-form {
    border-color: var(--chc-danger);
  }

  .field-card-form .field-input {
    min-height: 0;
    border: 0;
    border-radius: 0;
    padding: 0;
    background: transparent;
    box-shadow: none;
  }

  .field-card-form .field-input:focus {
    border-color: transparent;
    box-shadow: none;
  }

  .field-control-card-form.field-with-select::after {
    content: '';
    position: absolute;
    top: 50%;
    right: 1rem;
    width: 0.45rem;
    aspect-ratio: 1;
    border-right: 0.09375rem solid var(--chc-copy);
    border-bottom: 0.09375rem solid var(--chc-copy);
    transform: translateY(-65%) rotate(45deg);
    pointer-events: none;
  }

  .field-card-form .field-select {
    appearance: none;
    padding-right: 1.5rem;
  }

  .field-input::placeholder {
    color: var(--chc-placeholder);
  }

  .field-input[aria-invalid='true'] {
    border-color: var(--chc-danger);
  }

  .field-error {
    margin: 0;
    color: var(--chc-danger);
    font-weight: inherit;
    font-size: 0.875em;
  }

  .form-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 0.625rem;
  }

  .card-form-screen .form-grid {
    gap: 0.75rem 0.625rem;
  }

  .otp-group {
    display: grid;
    gap: 0;
    margin: 0;
    padding: 0;
    border: 0;
    min-inline-size: 0;
  }

  .otp-label {
    width: 0.0625rem;
    height: 0.0625rem;
    position: absolute;
    overflow: hidden;
    clip: rect(0 0 0 0);
    white-space: nowrap;
  }

  .otp-inputs {
    display: grid;
    width: min(100%, 17.5rem);
    margin: 0 auto;
    grid-template-columns: repeat(6, minmax(0, 1fr));
    gap: 0.5rem;
  }

  .otp-input {
    min-height: var(--chc-input-height);
    border: 0.0625rem solid var(--chc-border);
    border-radius: 0.625rem;
    background: var(--chc-surface);
    color: var(--chc-text);
    font-style: inherit;
    font-variant: inherit;
    font-stretch: inherit;
    font-family: inherit;
    font-optical-sizing: inherit;
    font-variation-settings: inherit;
    font-size: inherit;
    font-size-adjust: inherit;
    font-kerning: inherit;
    font-language-override: inherit;
    font-feature-settings: inherit;
    font-weight: inherit;
    text-align: center;
    padding: 0;
  }

  .otp-input:focus {
    border-color: var(--chc-primary);
    outline: 0;
    box-shadow: 0 0 0 0.25rem var(--chc-focus-ring);
  }

  .otp-group-error .otp-input {
    border-color: var(--chc-danger);
    color: var(--chc-danger);
  }

  .alert {
    min-height: 0;
    display: block;
    border: 0.0625rem solid;
    border-radius: var(--chc-radius-control);
    padding: 0.625rem 0.75rem;
    font-weight: inherit;
    text-align: left;
  }

  .alert-message {
    min-width: 0;
  }

  .alert-success {
    border-color: var(--chc-success-border);
    background: var(--chc-success-bg);
    color: var(--chc-success);
  }

  .alert-danger {
    border-color: var(--chc-danger-border);
    background: var(--chc-danger-bg);
    color: var(--chc-danger);
  }

  .alert-warning {
    border-color: var(--chc-warning-border);
    background: var(--chc-warning-bg);
    color: var(--chc-warning);
  }

  .status-pill {
    display: inline-flex;
    min-width: 4rem;
    min-height: 1.5rem;
    align-items: center;
    justify-content: center;
    border: 0.0625rem solid;
    border-radius: 999rem;
    padding: 0.0625rem 0.5625rem;
    font-weight: inherit;
    font-size: 0.8125em;
  }

  .status-verified {
    border-color: var(--chc-success-border);
    background: var(--chc-success-bg);
    color: var(--chc-success);
  }

  .status-pending {
    border-color: #d0d5dd;
    background: var(--chc-soft-surface);
    color: var(--chc-muted);
  }

  .status-unverified {
    min-width: 5.125rem;
    border-color: var(--chc-danger-border);
    background: var(--chc-danger-bg);
    color: var(--chc-danger);
  }

  .payment-method-row,
  .selected-payment-method {
    width: 100%;
    display: grid;
    grid-template-columns: 2.75rem minmax(0, 1fr) auto;
    gap: 0.625rem;
    align-items: center;
    border-radius: var(--chc-radius-card);
    padding: 0.625rem;
    background: var(--chc-payment-method-background);
    color: var(--chc-text);
    text-align: left;
    border: 0.0625rem solid var(--chc-border);
  }

  .payment-method-row-action {
    transition: border-color var(--chc-motion-base) var(--chc-ease-standard),
      background-color var(--chc-motion-base) var(--chc-ease-standard),
      box-shadow var(--chc-motion-base) var(--chc-ease-standard);
    cursor: pointer;
  }

  .payment-method-row-edit {
    grid-template-columns: 2.75rem minmax(0, 1fr) auto;
    cursor: default;
  }

  .payment-method-row-delete-confirming {
    border-color: var(--chc-danger-border);
    background: color-mix(
      in srgb,
      var(--chc-danger-bg) 70%,
      var(--chc-payment-method-background)
    );
  }

  .payment-method-row-static {
    cursor: default;
  }

  .selected-payment-method {
    border-color: var(--chc-border-strong);
    background: color-mix(
      in srgb,
      var(--chc-payment-method-background) 92%,
      var(--chc-soft-surface)
    );
    box-shadow: 0 0.625rem 1.125rem rgba(17, 24, 39, 0.05);
  }

  .payment-method-row-selected {
    border-color: color-mix(in srgb, var(--chc-primary) 24%, var(--chc-border));
    background: color-mix(
      in srgb,
      var(--chc-primary) 4%,
      var(--chc-payment-method-background)
    );
  }

  .payment-method-row-action:hover:not(:disabled),
  .payment-method-row-action:focus-visible {
    border-color: var(--chc-border-strong);
    background: color-mix(
      in srgb,
      var(--chc-payment-method-background) 88%,
      var(--chc-soft-surface)
    );
    box-shadow: 0 0.5rem 1rem rgba(17, 24, 39, 0.05);
  }

  .payment-method-row-action:focus-visible {
    outline: 0;
  }

  .payment-method-row-action:disabled {
    border-color: var(--chc-border);
    background: var(--chc-payment-method-background);
    color: var(--chc-placeholder);
    cursor: not-allowed;
  }

  .payment-method-row-spacer {
    width: 1rem;
    height: 1rem;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    justify-self: end;
  }

  .payment-method-trailing {
    width: auto;
    min-width: 1rem;
    min-height: 1rem;
    display: inline-flex;
    align-items: center;
    justify-content: flex-end;
    gap: 0.375rem;
    justify-self: end;
  }

  .payment-method-balance {
    display: inline-flex;
    justify-content: flex-end;
    color: var(--chc-text);
    font-size: 0.875em;
    font-weight: inherit;
    text-align: right;
    white-space: nowrap;
  }

  .payment-method-balance-loading {
    width: 3.75rem;
    height: 0.875rem;
    display: inline-flex;
    border-radius: 999rem;
    background: linear-gradient(
      90deg,
      color-mix(in srgb, var(--chc-border) 70%, transparent),
      color-mix(in srgb, var(--chc-soft-surface) 96%, white),
      color-mix(in srgb, var(--chc-border) 70%, transparent)
    );
    background-size: 200% 100%;
    animation: chc-skeleton-shimmer var(--chc-motion-provider)
      var(--chc-ease-standard) infinite;
  }

  .payment-method-chevron {
    width: 1rem;
    height: 1rem;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: transparent;
    color: var(--chc-muted);
    pointer-events: none;
  }

  .payment-method-chevron-icon {
    width: 0.5rem;
    height: 0.5rem;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  .payment-method-chevron-icon::before {
    content: '';
    width: 0.4375rem;
    height: 0.4375rem;
    border-right: 0.09375rem solid currentColor;
    border-bottom: 0.09375rem solid currentColor;
    transform: rotate(-45deg);
  }

  .payment-method-delete-button {
    width: 2.75rem;
    min-width: 2.75rem;
    height: 2.75rem;
    min-height: 2.75rem;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    justify-self: end;
    border: 0;
    border-radius: 0.75rem;
    padding: 0;
    background: transparent;
    color: var(--chc-danger);
    cursor: pointer;
    transition: background-color var(--chc-motion-fast) var(--chc-ease-standard),
      color var(--chc-motion-fast) var(--chc-ease-standard);
    touch-action: manipulation;
  }

  .payment-method-delete-button:hover:not(:disabled),
  .payment-method-delete-button:focus-visible {
    background: color-mix(in srgb, var(--chc-danger) 10%, transparent);
  }

  .payment-method-delete-button:focus-visible {
    outline: 0.125rem solid
      color-mix(in srgb, var(--chc-danger) 24%, transparent);
    outline-offset: 0.125rem;
  }

  .payment-method-delete-button:disabled {
    color: var(--chc-muted);
    cursor: not-allowed;
  }

  .payment-method-delete-action {
    min-width: 0;
    max-width: 100%;
    display: inline-flex;
    align-items: center;
    justify-content: flex-end;
    gap: 0.5rem;
  }

  .payment-method-delete-confirmation-group {
    max-width: min(20rem, 54vw);
    display: inline-flex;
    align-items: center;
    justify-content: flex-end;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .payment-method-delete-confirmation {
    max-width: min(9rem, 28vw);
    color: var(--chc-danger);
    font-size: 0.75rem;
    font-weight: inherit;
    text-align: right;
    white-space: normal;
  }

  .payment-method-delete-confirmation-controls {
    display: inline-flex;
    align-items: center;
    gap: 0.375rem;
  }

  .payment-method-delete-confirm-button {
    min-height: 2.5rem;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: 0.0625rem solid var(--chc-border-strong);
    border-radius: 0.625rem;
    padding: 0 0.75rem;
    background: var(--chc-surface);
    color: var(--chc-copy);
    font-family: inherit;
    font-style: inherit;
    font-size: 0.8125rem;
    font-weight: inherit;
    cursor: pointer;
    transition: border-color var(--chc-motion-fast) var(--chc-ease-standard),
      background-color var(--chc-motion-fast) var(--chc-ease-standard),
      color var(--chc-motion-fast) var(--chc-ease-standard);
    touch-action: manipulation;
  }

  .payment-method-delete-confirm-button:hover:not(:disabled),
  .payment-method-delete-confirm-button:focus-visible {
    border-color: var(--chc-border-strong);
    background: var(--chc-soft-surface);
    color: var(--chc-text);
  }

  .payment-method-delete-confirm-button:focus-visible {
    outline: 0.125rem solid var(--chc-focus-ring);
    outline-offset: 0.125rem;
  }

  .payment-method-delete-confirm-button:disabled {
    color: var(--chc-muted);
    cursor: not-allowed;
  }

  .payment-method-delete-confirm-button-danger {
    border-color: var(--chc-danger);
    background: var(--chc-danger);
    color: #ffffff;
  }

  .payment-method-delete-confirm-button-danger:hover:not(:disabled),
  .payment-method-delete-confirm-button-danger:focus-visible {
    border-color: color-mix(in srgb, var(--chc-danger) 84%, black);
    background: color-mix(in srgb, var(--chc-danger) 84%, black);
    color: #ffffff;
  }

  .payment-method-delete-confirm-button-danger:disabled {
    border-color: var(--chc-danger-border);
    background: var(--chc-danger-border);
    color: var(--chc-muted);
  }

  .payment-method-delete-icon {
    width: 1.25rem;
    height: 1.25rem;
    position: relative;
    display: inline-flex;
  }

  .payment-method-delete-icon::before,
  .payment-method-delete-icon::after {
    content: '';
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
  }

  .payment-method-delete-icon::before {
    top: 0.3125rem;
    width: 0.75rem;
    height: 0.6875rem;
    border: 0.09375rem solid currentColor;
    border-top: 0;
    border-radius: 0 0 0.15625rem 0.15625rem;
  }

  .payment-method-delete-icon::after {
    top: 0.1875rem;
    width: 0.9375rem;
    height: 0.125rem;
    background: currentColor;
    border-radius: 999rem;
    box-shadow: 0 -0.21875rem 0 -0.03125rem currentColor;
  }

  .payment-method-icon-chip {
    width: 2.75rem;
    height: 1.75rem;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    border: 0;
    border-radius: 0;
    color: var(--chc-primary);
  }

  .payment-method-icon-image {
    width: 2.75rem;
    height: 1.75rem;
    display: block;
    object-fit: contain;
  }

  .payment-method-copy {
    display: grid;
    gap: 0.25rem;
    min-width: 0;
  }

  .payment-method-title {
    min-width: 0;
    display: block;
    overflow: hidden;
    color: var(--chc-text);
    font-weight: inherit;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .payment-method-title-row {
    min-width: 0;
  }

  .payment-method-meta-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.375rem;
    min-width: 0;
    flex-wrap: nowrap;
  }

  .payment-method-meta {
    flex: 1 1 auto;
    min-width: 0;
    display: block;
    overflow: hidden;
    color: var(--chc-copy);
    text-overflow: ellipsis;
    font-weight: inherit;
    white-space: nowrap;
  }

  .payment-method-status {
    display: inline-flex;
    flex: 0 0 auto;
    margin-left: auto;
  }

  .verification-status-badge {
    max-width: 100%;
    display: inline-flex;
    align-items: center;
    border: 0.0625rem solid;
    border-radius: 999rem;
    padding: 0.1875rem 0.5rem;
    font-size: 0.75em;
    font-weight: inherit;
  }

  .verification-status-label {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .verification-status-badge-success {
    border-color: var(--chc-success-border);
    background: var(--chc-success-bg);
    color: var(--chc-success);
  }

  .verification-status-badge-warning {
    border-color: var(--chc-warning-border);
    background: var(--chc-warning-bg);
    color: var(--chc-warning);
  }

  .verification-status-badge-danger {
    border-color: var(--chc-danger-border);
    background: var(--chc-danger-bg);
    color: var(--chc-danger);
  }

  .source-action {
    width: 100%;
    min-height: 3.5rem;
    display: grid;
    grid-template-columns: auto minmax(0, 1fr);
    align-items: center;
    gap: 0.625rem;
    border: 0.0625rem solid var(--chc-border);
    border-radius: var(--chc-radius-card);
    padding: 0.75rem;
    background: var(--chc-payment-method-background);
    color: var(--chc-text);
    text-align: left;
    cursor: pointer;
  }

  .source-action:disabled {
    background: var(--chc-payment-method-background);
    color: var(--chc-placeholder);
    cursor: not-allowed;
  }

  .source-action-icon {
    flex: 0 0 auto;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    border: 0;
    border-radius: 0;
    background: transparent;
    color: var(--chc-primary);
    font-size: 1.5rem;
    font-weight: inherit;
  }

  .source-action-icon-transfer {
    position: relative;
    width: 1.5rem;
    height: 1.5rem;
    font-size: 0;
  }

  .source-action-transfer-arrow {
    position: absolute;
    width: 0.875rem;
    height: 0.4375rem;
    border-top: 0.125rem solid currentColor;
  }

  .source-action-transfer-arrow::after {
    content: '';
    position: absolute;
    top: -0.3125rem;
    width: 0.4375rem;
    height: 0.4375rem;
    border-top: 0.125rem solid currentColor;
    border-right: 0.125rem solid currentColor;
  }

  .source-action-transfer-arrow-forward {
    top: 0.4375rem;
    left: 0.25rem;
  }

  .source-action-transfer-arrow-forward::after {
    right: -0.0625rem;
    transform: rotate(45deg);
  }

  .source-action-transfer-arrow-back {
    right: 0.25rem;
    bottom: 0.3125rem;
    transform: rotate(180deg);
  }

  .source-action-transfer-arrow-back::after {
    right: -0.0625rem;
    transform: rotate(45deg);
  }

  .source-action-copy {
    display: grid;
    min-width: 0;
  }

  .source-action-title {
    overflow: hidden;
    color: var(--chc-text);
    font-weight: inherit;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .source-action-subtitle {
    overflow: hidden;
    color: var(--chc-muted);
    font-weight: inherit;
    font-size: 0.875em;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .source-action-link {
    width: 100%;
    min-height: var(--chc-input-height);
    display: grid;
    grid-template-columns: auto minmax(0, 1fr) auto;
    gap: 0.625rem;
    align-items: center;
    border: 0.0625rem solid var(--chc-border);
    border-style: dashed;
    border-radius: var(--chc-radius-card);
    padding: 0.625rem;
    background: var(--chc-payment-method-background);
    color: var(--chc-text);
    text-align: left;
    cursor: pointer;
    transition: border-color var(--chc-motion-base) var(--chc-ease-standard),
      background-color var(--chc-motion-base) var(--chc-ease-standard),
      box-shadow var(--chc-motion-base) var(--chc-ease-standard);
  }

  .source-action-link:hover:not(:disabled),
  .source-action-link:focus-visible {
    border-color: var(--chc-border-strong);
    background: color-mix(
      in srgb,
      var(--chc-payment-method-background) 90%,
      var(--chc-soft-surface)
    );
    box-shadow: 0 0.5rem 1rem rgba(17, 24, 39, 0.04);
  }

  .source-action-link:focus-visible {
    outline: 0;
  }

  .source-action-link:disabled {
    background: var(--chc-payment-method-background);
    color: var(--chc-muted);
    cursor: not-allowed;
  }

  .source-action:disabled .source-action-icon,
  .source-action-link:disabled .source-action-icon {
    color: var(--chc-muted);
  }

  .source-action-link-copy {
    display: grid;
    gap: 0.125rem;
    min-width: 0;
  }

  .source-action-link-title {
    color: currentColor;
    font-weight: inherit;
  }

  .source-action-link-subtitle {
    color: var(--chc-copy);
    font-size: 0.875em;
  }

  .source-action-link-chevron {
    width: 1rem;
    height: 1rem;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    justify-self: end;
    color: var(--chc-muted);
  }

  .source-action-link-chevron-icon {
    width: 0.5rem;
    height: 0.5rem;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  .source-action-link-chevron-icon::before {
    content: '';
    width: 0.4375rem;
    height: 0.4375rem;
    border-right: 0.09375rem solid currentColor;
    border-bottom: 0.09375rem solid currentColor;
    transform: rotate(-45deg);
  }

  .source-action-link:disabled .source-action-link-subtitle {
    color: var(--chc-muted);
  }

  .detail-list {
    display: grid;
    border: 0.0625rem solid var(--chc-border);
    border-radius: var(--chc-radius-card);
    background: var(--chc-payment-method-background);
    overflow: hidden;
    text-align: left;
  }

  .detail-list-compact {
    background: color-mix(
      in srgb,
      var(--chc-soft-surface) 82%,
      var(--chc-surface)
    );
  }

  .empty-state {
    display: grid;
    gap: 0.25rem;
    text-align: left;
  }

  .empty-state-title {
    margin: 0;
    color: var(--chc-text);
    font-size: 1em;
    font-weight: inherit;
  }

  .empty-state-message {
    margin: 0;
    color: var(--chc-copy);
  }

  .detail-row {
    min-height: 0;
    display: grid;
    gap: 0.125rem;
    padding: 0.625rem 0.75rem;
  }

  .detail-row + .detail-row {
    border-top: 0.0625rem solid var(--chc-border);
  }

  .detail-label {
    color: var(--chc-muted);
    font-weight: inherit;
  }

  .detail-value {
    color: var(--chc-text);
    font-weight: inherit;
  }

  .upload-row {
    width: 100%;
    min-height: 2.5rem;
    display: grid;
    grid-template-columns: auto minmax(0, 1fr);
    align-items: center;
    gap: 0;
    overflow: hidden;
    border: 0.0625rem solid var(--chc-border-strong);
    border-radius: 0.5rem;
    padding: 0;
    background: var(--chc-payment-method-background);
    color: var(--chc-copy);
    text-align: left;
    cursor: pointer;
  }

  .upload-row-error {
    border-color: var(--chc-danger);
    background: var(--chc-danger-bg);
  }

  .upload-row-label,
  .upload-row-requirements {
    width: 0.0625rem;
    height: 0.0625rem;
    position: absolute;
    overflow: hidden;
    clip: rect(0 0 0 0);
    white-space: nowrap;
  }

  .upload-row-file-name {
    min-width: 0;
    overflow: hidden;
    padding: 0 0.75rem;
    color: var(--chc-copy);
    font-size: 0.8125em;
    font-weight: inherit;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .upload-row-action {
    align-self: stretch;
    display: inline-flex;
    align-items: center;
    padding: 0 0.75rem;
    background: var(--chc-soft-surface);
    color: var(--chc-primary);
    font-weight: inherit;
    white-space: nowrap;
  }

  .loading-row {
    min-height: 0;
    display: grid;
    grid-template-columns: 2.5rem minmax(0, 1fr);
    align-items: center;
    gap: 0.75rem;
    border: 0.0625rem solid var(--chc-border);
    border-radius: var(--chc-radius-card);
    padding: 0.875rem 1rem;
    background: var(--chc-payment-method-background);
    text-align: left;
  }

  .loading-spinner {
    width: 2.5rem;
    height: 2.5rem;
    border: 0.3125rem solid #dbe3f1;
    border-right-color: var(--chc-primary);
    border-radius: 999rem;
    animation: chc-spinner-rotate var(--chc-spinner-duration) linear infinite;
  }

  .loading-spinner-small {
    width: 1.25rem;
    height: 1.25rem;
    border-width: 0.15625rem;
  }

  .loading-row-copy {
    display: grid;
    min-width: 0;
  }

  .loading-row-title {
    overflow: hidden;
    color: var(--chc-text);
    font-size: 1.125em;
    font-weight: inherit;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .loading-row-helper {
    overflow: hidden;
    color: var(--chc-muted);
    font-weight: inherit;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .provider-frame {
    display: grid;
    position: relative;
    gap: 0.875rem;
    text-align: left;
  }

  .provider-frame-loading {
    min-height: 31.25rem;
  }

  .bank-provider-flow {
    display: grid;
    gap: 0.875rem;
  }

  .bank-provider-manual-link {
    display: flex;
    justify-content: center;
  }

  .verification-outcome-flow {
    display: grid;
    gap: 0.75rem;
  }

  .provider-frame-header {
    display: grid;
    gap: 0.25rem;
  }

  .provider-frame-title {
    margin: 0;
    color: var(--chc-text);
    font-size: 1em;
    font-weight: inherit;
  }

  .provider-frame-status {
    margin: 0;
    color: var(--chc-muted);
  }

  .provider-frame-slot {
    display: block;
  }

  .provider-frame-container,
  ::slotted(.provider-frame-container) {
    width: 100%;
    min-height: 23.75rem;
    background: var(--chc-soft-surface);
    overflow: hidden;
  }

  .provider-frame-container-loading,
  .provider-frame-loading ::slotted(.provider-frame-container) {
    min-height: 31.25rem;
  }

  .provider-loading-overlay,
  .widget-loading-overlay {
    position: absolute;
    inset: 0;
    display: grid;
    place-items: center;
    border-radius: inherit;
    background: var(--chc-surface);
    color: var(--chc-text);
    text-align: center;
  }

  .provider-loading-overlay {
    align-content: center;
    gap: 0.75rem;
  }

  .provider-loading-label {
    color: var(--chc-copy);
    font-weight: inherit;
  }

  .widget-loading-status {
    max-width: 15rem;
    display: grid;
    justify-items: center;
    gap: 0.75rem;
    padding: 1rem;
  }

  .widget-loading-animation {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.375rem;
    min-height: 1rem;
  }

  .widget-loading-animation-dot {
    width: 0.5rem;
    height: 0.5rem;
    border-radius: 999rem;
    background: var(--chc-primary);
    animation: chc-loading-dot 900ms var(--chc-ease-standard) infinite;
  }

  .widget-loading-animation-dot:nth-child(2) {
    animation-delay: 150ms;
  }

  .widget-loading-animation-dot:nth-child(3) {
    animation-delay: 300ms;
  }

  .widget-loading-copy {
    display: grid;
    gap: 0.25rem;
  }

  .widget-loading-title {
    color: var(--chc-text);
    font-weight: inherit;
  }

  .widget-loading-helper {
    color: var(--chc-copy);
    font-size: 0.875em;
  }

  .outcome-shell {
    display: grid;
    justify-items: center;
    gap: 0.75rem;
    text-align: center;
  }

  .outcome-icon {
    width: 3.75rem;
    height: 3.75rem;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: 0.125rem solid;
    border-radius: 999rem;
    font-size: 1.75em;
    font-weight: inherit;
  }

  .outcome-success .outcome-icon {
    border-color: var(--chc-success-border);
    background: var(--chc-success-bg);
    color: var(--chc-success);
  }

  .outcome-success .outcome-icon::before {
    content: '✓';
  }

  .outcome-warning .outcome-icon {
    border-color: var(--chc-warning-border);
    background: var(--chc-warning-bg);
    color: var(--chc-warning);
  }

  .outcome-warning .outcome-icon::before {
    content: '!';
  }

  .outcome-danger .outcome-icon {
    border-color: var(--chc-danger-border);
    background: var(--chc-danger-bg);
    color: var(--chc-danger);
  }

  .outcome-danger .outcome-icon::before {
    content: '×';
  }

  .outcome-title {
    margin: 0;
    color: var(--chc-text);
    font-size: 1.1875em;
    font-weight: inherit;
  }

  .outcome-message {
    margin: 0;
    color: var(--chc-copy);
  }

  .outcome-content,
  .outcome-actions {
    width: 100%;
  }

  .outcome-actions {
    display: grid;
    gap: 0.625rem;
  }

  .verification-details {
    display: grid;
    width: 100%;
    border: 0.0625rem solid var(--chc-border);
    border-radius: var(--chc-radius-card);
    background: var(--chc-surface);
    overflow: hidden;
    text-align: left;
  }

  .verification-detail-row {
    min-height: 0;
    display: grid;
    gap: 0.125rem;
    padding: 0.75rem 1rem;
  }

  .verification-detail-row + .verification-detail-row {
    border-top: 0.0625rem solid var(--chc-border);
  }

  .verification-detail-label {
    color: var(--chc-muted);
    font-weight: inherit;
  }

  .verification-detail-value {
    color: var(--chc-text);
    display: inline-flex;
    align-items: center;
    flex-wrap: wrap;
    font-weight: inherit;
  }

  .text-link-button {
    min-height: 0;
    border: 0;
    padding: 0;
    background: transparent;
    color: var(--chc-primary);
    font-weight: inherit;
    cursor: pointer;
  }

  .text-link-button:disabled {
    color: var(--chc-muted);
    cursor: not-allowed;
  }

  .payment-method-skeletons {
    display: grid;
    gap: 0.625rem;
  }

  .payment-method-skeleton-label {
    width: 0.0625rem;
    height: 0.0625rem;
    position: absolute;
    overflow: hidden;
    clip: rect(0 0 0 0);
    white-space: nowrap;
  }

  .payment-method-skeleton-row {
    width: 100%;
    min-height: 3.625rem;
    display: grid;
    grid-template-columns: 2.25rem minmax(0, 1fr) 1rem;
    gap: 0.625rem;
    align-items: center;
    border: 0.0625rem solid var(--chc-border);
    border-radius: var(--chc-radius-card);
    padding: 0.625rem;
    background: var(--chc-payment-method-background);
  }

  .payment-method-skeleton-icon,
  .payment-method-skeleton-line,
  .payment-method-skeleton-trailing {
    display: block;
    border-radius: 999rem;
    background: linear-gradient(
      90deg,
      color-mix(in srgb, var(--chc-soft-surface) 92%, var(--chc-border)),
      color-mix(in srgb, var(--chc-border) 72%, var(--chc-surface)),
      color-mix(in srgb, var(--chc-soft-surface) 92%, var(--chc-border))
    );
    background-size: 200% 100%;
    animation: chc-skeleton-shimmer var(--chc-motion-provider)
      var(--chc-ease-standard) infinite alternate;
  }

  .payment-method-skeleton-icon {
    width: 2.25rem;
    height: 2.25rem;
    border-radius: 0.6875rem;
  }

  .payment-method-skeleton-copy {
    display: grid;
    gap: 0.375rem;
  }

  .payment-method-skeleton-title {
    width: 60%;
    height: 0.75rem;
  }

  .payment-method-skeleton-meta {
    width: 82%;
    height: 0.625rem;
  }

  .payment-method-skeleton-trailing {
    width: 1rem;
    height: 1rem;
  }

  @keyframes chc-spinner-rotate {
    to {
      transform: rotate(360deg);
    }
  }

  @keyframes chc-skeleton-shimmer {
    to {
      background-position: -100% 0;
    }
  }

  @keyframes chc-loading-dot {
    0%,
    80%,
    100% {
      opacity: 0.42;
      transform: translateY(0);
    }

    40% {
      opacity: 1;
      transform: translateY(-0.25rem);
    }
  }

  .powered-by-footer {
    display: flex;
    justify-content: center;
    gap: 0.3125rem;
    margin-top: 1rem;
    color: var(--chc-copy);
    font-size: 0.75em;
    font-weight: inherit;
    white-space: nowrap;
  }

  .powered-by-brand {
    font-weight: inherit;
  }

  @media (max-width: 26.25rem) {
    :host {
      --chc-shell-padding: 1rem 1rem 0.875rem;
    }

    .widget-shell {
      border-radius: 1rem;
    }

    .widget-close {
      right: 0.375rem;
    }

    .form-grid {
      grid-template-columns: minmax(0, 1fr);
    }

    .otp-inputs {
      width: 100%;
    }

    .payment-method-row,
    .source-action,
    .source-action-link,
    .upload-row,
    .loading-row {
      padding-right: 0.75rem;
      padding-left: 0.75rem;
    }

    .provider-frame-container,
    ::slotted(.provider-frame-container) {
      min-height: 22.5rem;
    }

    .source-action-title,
    .source-action-link-title,
    .payment-method-title {
      white-space: normal;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .widget-close,
    .button,
    .field-input,
    .field-control-card-form,
    .payment-method-row,
    .source-action-link,
    .payment-method-delete-button,
    .payment-method-delete-confirm-button {
      transition: none;
    }

    .button:hover:not(:disabled) {
      transform: none;
    }

    .loading-spinner,
    .button-spinner,
    .otp-resend-spinner,
    .widget-loading-animation-dot,
    .payment-method-skeleton-icon,
    .payment-method-skeleton-line,
    .payment-method-skeleton-trailing,
    .payment-method-balance-loading {
      animation: none;
    }
  }
`;
