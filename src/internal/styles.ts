import {css} from 'lit';

export const primitiveStyles = css`
  :host {
    --chc-text: #101828;
    --chc-copy: #667085;
    --chc-muted: #98a2b3;
    --chc-placeholder: #98a2b3;
    --chc-surface: #ffffff;
    --chc-soft-surface: #f8fafc;
    --chc-border: #d0d5dd;
    --chc-border-strong: #cbd5e1;
    --chc-primary: #003de6;
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
    --chc-disabled-surface: #b6c3db;
    --chc-font-family: 'Open Sans', Arial, sans-serif;
    --chc-radius-control: .55rem;;
    --chc-radius-card: 0.875rem;
    --chc-radius-shell: .55rem;
    --chc-input-height: 2.875rem;
    --chc-font-weight: 300;
    --chc-divider: #eaecf0;
    --chc-focus-ring: rgba(0, 61, 230, 0.18);
    --chc-shell-padding: 1.75rem 1.5rem 1.5rem;
    --chc-shell-shadow: 0 0.0625rem 0.125rem rgba(16, 24, 40, 0.04),
      0 0.75rem 1.5rem rgba(16, 24, 40, 0.06);
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
    max-width: 26.25rem;
    position: relative;
    padding: var(--chc-shell-padding);
    border-radius: var(--chc-radius-shell);
    background: var(--chc-surface);
    text-align: left;
  }

  .widget-shell-wide {
    max-width: 40rem;
  }

  .widget-close {
    width: 2.25rem;
    height: 2.25rem;
    position: absolute;
    top: 1.125rem;
    right: 0.875rem;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: 0;
    border-radius: 999rem;
    background: transparent;
    color: var(--chc-muted);
    font-size: 1.5em;
    font-weight: 700;
    cursor: pointer;
  }

  .widget-title {
    margin: 0;
    color: var(--chc-text);
    font-size: 1.15rem;
    font-weight: 700;
    letter-spacing: -0.02em;
  }

  .widget-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
  }

  .widget-header-action {
    flex: 0 0 auto;
  }

  .widget-header-action .text-link-button {
    color: var(--chc-primary);
    font-weight: 500;
  }

  .widget-subtitle {
    margin: 0.5rem 0 0;
    color: var(--chc-copy);
    font-weight: inherit;
  }

  .widget-divider {
    height: 0.0625rem;
    margin-top: 1rem;
    background: var(--chc-divider);
  }

  .widget-content {
    margin-top: 1.5rem;
  }

  .primitive-stack {
    display: grid;
    gap: 0.75rem;
  }

  .primitive-actions {
    display: grid;
    gap: 0.75rem;
    margin-top: 1rem;
  }

  .primitive-footer {
    display: grid;
    margin-top: 1rem;
  }

  .card-form-footer {
    display: grid;
    grid-template-columns: auto auto;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
    margin-top: 0.25rem;
  }

  .card-form-back {
    display: inline-flex;
    align-items: center;
  }

  .card-form-back .text-link-button {
    color: var(--chc-text);
  }

  .card-form-back .text-link-button:disabled {
    color: var(--chc-muted);
  }

  .card-form-back .text-link-button::before {
    content: '←';
    margin-right: 0.5rem;
  }

  .card-form-primary {
    display: grid;
    justify-items: end;
  }

  .card-form-footer .button {
    width: auto;
    padding-right: 1.5rem;
    padding-left: 1.5rem;
  }

  .payment-action-links {
    display: grid;
    gap: 0.625rem;
    margin-top: 0.25rem;
    justify-items: stretch;
  }

  .otp-flow,
  .payment-flow {
    display: grid;
    gap: 1rem;
  }

  .otp-support {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.1875rem;
    flex-wrap: nowrap;
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
    border: 0;
    padding: 0;
    background: transparent;
    color: var(--chc-primary);
    font-weight: 500;
    cursor: pointer;
  }

  .otp-resend:disabled {
    color: var(--chc-muted);
    cursor: not-allowed;
  }

  .button {
    width: 100%;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: 0.0625rem solid var(--chc-primary);
    border-radius: var(--chc-radius-control);
    padding: 0.4375rem 1.125rem;
    font-weight: 500;
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

  .button-icon-check::before {
    content: '✓';
  }

  .button-primary {
    background: var(--chc-primary);
    color: #fff;
  }

  .button-secondary {
    border-color: var(--chc-border);
    background: var(--chc-surface);
    color: var(--chc-text);
  }

  .button:disabled {
    border-color: var(--chc-disabled-surface);
    background: var(--chc-disabled-surface);
    color: var(--chc-disabled-text);
    cursor: not-allowed;
  }

  .field {
    display: grid;
    gap: 0.375rem;
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

  .field-label {
    color: var(--chc-text);
    font-weight: 500;
  }

  .field-input {
    width: 100%;
    min-height: var(--chc-input-height);
    border: 0.0625rem solid var(--chc-border);
    border-radius: var(--chc-radius-control);
    padding: .55rem;
    background: var(--chc-surface);
    color: var(--chc-text);
    text-align: left;
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
    font-weight: 500;
  }

  .field-control-card-form {
    width: 100%;
    padding: .55rem;
    border: 0.0625rem solid var(--chc-border);
    border-radius: var(--chc-radius-control);
    background: color-mix(
      in srgb,
      var(--chc-soft-surface) 70%,
      var(--chc-surface)
    );
    transition: border-color 120ms ease, box-shadow 120ms ease,
      background-color 120ms ease;
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
    right: 1.125rem;
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
    font-weight: 500;
  }

  .form-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 0.75rem;
  }

  .card-form-screen .form-grid {
    gap: 0.875rem 0.75rem;
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
    width: min(100%, 20.75rem);
    margin: 0 auto;
    grid-template-columns: repeat(6, minmax(0, 1fr));
    gap: 0.1875rem;
  }

  .otp-input {
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
    font-weight: 300;
    text-align: center;
    padding: 0.55rem;
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
    min-height: 3.25rem;
    display: flex;
    align-items: center;
    border: 0.0625rem solid;
    border-radius: var(--chc-radius-control);
    padding: .55rem;
    font-weight: 500;
    text-align: left;
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
    min-width: 4.25rem;
    min-height: 1.375rem;
    align-items: center;
    justify-content: center;
    border: 0.0625rem solid;
    border-radius: 999rem;
    padding: 0.0625rem 0.625rem;
    font-weight: 500;
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

  .payment-method-row {
    width: 100%;
    display: grid;
    grid-template-columns: 2.5rem minmax(0, 1fr) 1.125rem;
    gap: 0.75rem;
    align-items: center;
    border: 0.0625rem solid transparent;
    border-radius: 1.125rem;
    padding: 0.55rem 0.875rem;
    background: var(--chc-soft-surface);
    color: var(--chc-text);
    text-align: left;
    cursor: pointer;
  }

  .selected-payment-method {
    width: 100%;
    display: grid;
    grid-template-columns: 1.125rem 2.5rem minmax(0, 1fr);
    gap: 0.75rem;
    align-items: center;
    border: 0.0625rem solid var(--chc-primary);
    border-radius: 1.125rem;
    padding: 0.55rem 0.875rem;
    background: var(--chc-soft-surface);
    color: var(--chc-text);
    text-align: left;
  }

  .payment-method-row[aria-checked='true'] {
    border-color: var(--chc-primary);
    box-shadow: 0 0 0 0.0625rem var(--chc-primary);
  }

  .payment-method-row:disabled {
    border-color: transparent;
    background: var(--chc-soft-surface);
    color: var(--chc-placeholder);
    cursor: not-allowed;
  }

  .payment-method-radio {
    width: 1.125rem;
    height: 1.125rem;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: 0.0625rem solid var(--chc-border-strong);
    border-radius: 999rem;
    background: var(--chc-surface);
  }

  .payment-method-radio-dot {
    width: 100%;
    height: 100%;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 999rem;
    background: transparent;
    color: transparent;
    font-size: 0.75em;
    font-weight: 700;
  }

  .payment-method-radio-dot::before {
    content: '';
  }

  .payment-method-row[aria-checked='true'] .payment-method-radio {
    border-color: var(--chc-primary);
    background: var(--chc-primary);
  }

  .payment-method-row[aria-checked='true'] .payment-method-radio-dot {
    color: #fff;
  }

  .selected-payment-method .payment-method-radio {
    border-color: color-mix(in srgb, var(--chc-primary) 20%, var(--chc-border));
    background: var(--chc-surface);
  }

  .payment-method-row[aria-checked='true'] .payment-method-radio-dot::before {
    content: '✓';
  }

  .selected-payment-method .payment-method-radio-dot::before {
    content: '';
    width: 0.5rem;
    height: 0.5rem;
    border-radius: 999rem;
    background: var(--chc-primary);
  }

  .payment-method-icon-chip {
    width: 2.5rem;
    height: 2.5rem;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 0.75rem;
    background: var(--chc-surface);
    color: var(--chc-primary);
    overflow: hidden;
  }

  .payment-method-icon-image {
    width: 1.5rem;
    height: 1.5rem;
    display: block;
  }

  .payment-method-copy {
    display: grid;
    gap: 0.125rem;
    min-width: 0;
  }

  .payment-method-title {
    overflow: hidden;
    color: var(--chc-text);
    font-weight: 500;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .payment-method-meta {
    color: var(--chc-copy);
    font-weight: inherit;
  }

  .payment-method-status {
    font-weight: inherit;
  }

  .status-text-verified {
    color: var(--chc-success);
  }

  .status-text-pending {
    color: var(--chc-warning);
  }

  .status-text-unverified {
    color: var(--chc-danger);
  }

  .source-action {
    width: 100%;
    min-height: 4.25rem;
    display: grid;
    grid-template-columns: auto minmax(0, 1fr);
    align-items: center;
    gap: 0.75rem;
    border: 0.0625rem solid var(--chc-border);
    border-radius: var(--chc-radius-card);
    padding: 0.55rem 0.875rem;
    background: var(--chc-surface);
    color: var(--chc-text);
    text-align: left;
    cursor: pointer;
  }

  .source-action:disabled {
    background: var(--chc-surface);
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
    font-size: 1.75rem;
    font-weight: 300;
  }

  .source-action-copy {
    display: grid;
    min-width: 0;
  }

  .source-action-title {
    overflow: hidden;
    color: var(--chc-text);
    font-weight: 500;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .source-action-subtitle {
    overflow: hidden;
    color: var(--chc-muted);
    font-weight: inherit;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .source-action-link {
    width: 100%;
    display: grid;
    grid-template-columns: auto minmax(0, 1fr);
    gap: 0.5rem;
    align-items: center;
    border: 0.0625rem solid var(--chc-border);
    border-radius: 1.125rem;
    padding: 0.55rem 0.875rem;
    background: var(--chc-soft-surface);
    color: var(--chc-text);
    text-align: left;
    cursor: pointer;
    transition: border-color 120ms ease, background-color 120ms ease,
      box-shadow 120ms ease;
  }

  .source-action-link:hover:not(:disabled),
  .source-action-link:focus-visible {
    border-color: var(--chc-primary);
    background: color-mix(
      in srgb,
      var(--chc-primary) 6%,
      var(--chc-soft-surface)
    );
    box-shadow: 0 0 0 0.0625rem
      color-mix(in srgb, var(--chc-primary) 24%, transparent);
  }

  .source-action-link:focus-visible {
    outline: 0;
  }

  .source-action-link:disabled {
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
    font-weight: 500;
  }

  .source-action-link-subtitle {
    color: var(--chc-copy);
  }

  .source-action-link:disabled .source-action-link-subtitle {
    color: var(--chc-muted);
  }

  .detail-list {
    display: grid;
    border: 0.0625rem solid var(--chc-border);
    border-radius: var(--chc-radius-card);
    background: var(--chc-surface);
    overflow: hidden;
    text-align: left;
  }

  .empty-state {
    display: grid;
    gap: 0.375rem;
    text-align: left;
  }

  .empty-state-title {
    margin: 0;
    color: var(--chc-text);
    font-size: 1em;
    font-weight: 700;
  }

  .empty-state-message {
    margin: 0;
    color: var(--chc-copy);
  }

  .detail-row {
    min-height: 4.75rem;
    display: grid;
    gap: 0.125rem;
    padding: 0.75rem 1.5rem;
  }

  .detail-row + .detail-row {
    border-top: 0.0625rem solid var(--chc-border);
  }

  .detail-label {
    color: var(--chc-muted);
    font-weight: 500;
  }

  .detail-value {
    color: var(--chc-text);
    font-weight: 500;
  }

  .upload-row {
    width: 100%;
    min-height: 4.5rem;
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    align-items: center;
    gap: 1rem;
    border: 0.0625rem dashed var(--chc-border-strong);
    border-radius: var(--chc-radius-card);
    padding: 0 1.125rem;
    background: var(--chc-surface);
    color: var(--chc-copy);
    text-align: left;
    cursor: pointer;
  }

  .upload-row-error {
    border-color: var(--chc-danger);
    background: var(--chc-danger-bg);
  }

  .upload-copy {
    display: flex;
    min-width: 0;
    align-items: center;
    gap: 0.875rem;
  }

  .upload-icon {
    width: 2rem;
    color: var(--chc-primary);
    font-size: 1.5em;
    font-weight: 700;
    text-align: center;
  }

  .upload-row-label {
    width: 0.0625rem;
    height: 0.0625rem;
    position: absolute;
    overflow: hidden;
    clip: rect(0 0 0 0);
    white-space: nowrap;
  }

  .upload-row-requirements {
    overflow: hidden;
    font-weight: inherit;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .upload-row-action {
    color: var(--chc-primary);
    font-weight: 500;
    white-space: nowrap;
  }

  .loading-row {
    min-height: 5.25rem;
    display: grid;
    grid-template-columns: 3rem minmax(0, 1fr);
    align-items: center;
    gap: 1rem;
    border: 0.0625rem solid var(--chc-border);
    border-radius: var(--chc-radius-card);
    padding: 1rem 1.125rem;
    background: var(--chc-surface);
    text-align: left;
  }

  .loading-spinner {
    width: 3rem;
    height: 3rem;
    border: 0.375rem solid #dbe3f1;
    border-right-color: var(--chc-primary);
    border-radius: 999rem;
  }

  .loading-row-copy {
    display: grid;
    min-width: 0;
  }

  .loading-row-title {
    overflow: hidden;
    color: var(--chc-text);
    font-size: 1.3125em;
    font-weight: 700;
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
    gap: 1.125rem;
    text-align: left;
  }

  .bank-provider-flow {
    display: grid;
    gap: 1.25rem;
  }

  .provider-frame-header {
    display: grid;
    gap: 0.25rem;
  }

  .provider-frame-title {
    margin: 0;
    color: var(--chc-text);
    font-size: 1.125em;
    font-weight: 700;
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
    min-height: 32.5rem;
    background: var(--chc-soft-surface);
    overflow: hidden;
  }

  .outcome-shell {
    display: grid;
    justify-items: center;
    gap: 1rem;
    text-align: center;
  }

  .outcome-icon {
    width: 4.5rem;
    height: 4.5rem;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: 0.125rem solid;
    border-radius: 999rem;
    font-size: 2.25em;
    font-weight: 700;
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
    font-size: 1.375em;
    font-weight: 700;
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
    gap: 0.75rem;
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
    min-height: 4rem;
    display: grid;
    gap: 0.125rem;
    padding: 0.625rem 1.25rem;
  }

  .verification-detail-row + .verification-detail-row {
    border-top: 0.0625rem solid var(--chc-border);
  }

  .verification-detail-label {
    color: var(--chc-muted);
    font-weight: 500;
  }

  .verification-detail-value {
    color: var(--chc-text);
    font-weight: 500;
  }

  .text-link-button {
    min-height: 0;
    border: 0;
    padding: 0;
    background: transparent;
    color: var(--chc-primary);
    font-weight: 500;
    cursor: pointer;
  }

  .text-link-button:disabled {
    color: var(--chc-muted);
    cursor: not-allowed;
  }

  .powered-by-footer {
    display: flex;
    justify-content: center;
    gap: 0.3125rem;
    margin-top: 2rem;
    color: var(--chc-copy);
    font-weight: inherit;
    white-space: nowrap;
  }

  .powered-by-brand {
    color: var(--chc-copy);
    font-weight: 700;
  }

  @media (max-width: 26.25rem) {
    :host {
      --chc-shell-padding: 1.5rem 1.25rem 1.25rem;
    }

    .widget-shell {
      border-radius: 1.125rem;
    }

    .widget-close {
      right: 0.5rem;
    }

    .form-grid {
      grid-template-columns: minmax(0, 1fr);
    }

    .card-form-footer {
      grid-template-columns: minmax(0, 1fr);
    }

    .card-form-primary {
      justify-items: stretch;
    }

    .card-form-footer .button {
      width: 100%;
    }

    .otp-inputs {
      width: 100%;
    }

    .payment-method-row,
    .source-action,
    .source-action-link,
    .upload-row,
    .loading-row {
      padding-right: 0.875rem;
      padding-left: 0.875rem;
    }

    .provider-frame-container,
    ::slotted(.provider-frame-container) {
      min-height: 28.75rem;
    }

    .source-action-title,
    .source-action-link-title,
    .payment-method-title {
      white-space: normal;
    }
  }
`;
