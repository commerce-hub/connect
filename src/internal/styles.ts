import {css} from 'lit';

export const primitiveStyles = css`
  :host {
    --chc-text: #111827;
    --chc-copy: #4b5565;
    --chc-muted: #6b7280;
    --chc-placeholder: #9ca3af;
    --chc-surface: #ffffff;
    --chc-soft-surface: #f7f8fa;
    --chc-border: #dde3ea;
    --chc-border-strong: #cdd5df;
    --chc-primary: #162033;
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
    --chc-radius-control: 0.75rem;
    --chc-radius-card: 1rem;
    --chc-radius-shell: 1rem;
    --chc-input-height: 2.75rem;
    --chc-font-weight: 400;
    --chc-divider: #ebeef2;
    --chc-focus-ring: rgba(22, 32, 51, 0.14);
    --chc-shell-padding: 1.5rem 1.25rem 1.25rem;
    --chc-shell-shadow: 0 0.125rem 0.375rem rgba(17, 24, 39, 0.04),
      0 0.75rem 1.5rem rgba(17, 24, 39, 0.08);
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
    max-width: 25.5rem;
    position: relative;
    padding: var(--chc-shell-padding);
    border: 0.0625rem solid
      color-mix(in srgb, var(--chc-border) 84%, var(--chc-surface));
    border-radius: var(--chc-radius-shell);
    background: var(--chc-surface);
    box-shadow: var(--chc-shell-shadow);
    text-align: left;
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
    font-weight: 600;
    cursor: pointer;
  }

  .widget-title {
    margin: 0;
    color: var(--chc-text);
    font-size: 1.2rem;
    font-weight: 600;
    letter-spacing: -0.02em;
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
    font-weight: 600;
  }

  .widget-subtitle {
    margin: 0.375rem 0 0;
    color: var(--chc-copy);
    font-weight: inherit;
    font-size: 0.9375em;
  }

  .widget-divider {
    height: 0.0625rem;
    margin-top: 1rem;
    background: var(--chc-divider);
  }

  .widget-content {
    margin-top: 1.125rem;
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

  .card-form-footer {
    display: grid;
    grid-template-columns: auto auto;
    align-items: center;
    justify-content: space-between;
    gap: 0.625rem;
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
    padding-right: 1.25rem;
    padding-left: 1.25rem;
  }

  .payment-action-links {
    display: grid;
    gap: 0.625rem;
    margin-top: 0;
    justify-items: stretch;
  }

  .otp-flow,
  .payment-flow {
    display: grid;
    gap: 0.75rem;
  }

  .otp-support {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.25rem;
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
    font-weight: 600;
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
    font-weight: 600;
    transition: border-color 120ms ease, background-color 120ms ease,
      box-shadow 120ms ease, transform 120ms ease;
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
    box-shadow: 0 0.5rem 1.25rem
      color-mix(in srgb, var(--chc-primary) 16%, transparent);
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

  .field-label {
    color: var(--chc-text);
    font-weight: 500;
    font-size: 0.875em;
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
    transition: border-color 120ms ease, box-shadow 120ms ease,
      background-color 120ms ease;
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
    min-height: var(--chc-input-height);
    padding: 0.625rem 0.75rem;
    border: 0.0625rem solid var(--chc-border);
    border-radius: var(--chc-radius-control);
    background: color-mix(
      in srgb,
      var(--chc-soft-surface) 82%,
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
    font-weight: 500;
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
    width: min(100%, 18.75rem);
    margin: 0 auto;
    grid-template-columns: repeat(6, minmax(0, 1fr));
    gap: 0.375rem;
  }

  .otp-input {
    min-height: var(--chc-input-height);
    border: 0.0625rem solid var(--chc-border);
    border-radius: 0.75rem;
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
    font-weight: 400;
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
    display: flex;
    align-items: center;
    border: 0.0625rem solid;
    border-radius: var(--chc-radius-control);
    padding: 0.625rem 0.75rem;
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
    min-width: 4rem;
    min-height: 1.5rem;
    align-items: center;
    justify-content: center;
    border: 0.0625rem solid;
    border-radius: 999rem;
    padding: 0.0625rem 0.5625rem;
    font-weight: 500;
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
    grid-template-columns: 2.25rem minmax(0, 1fr) 1rem;
    gap: 0.5rem;
    align-items: center;
    border-radius: 1rem;
    padding: 0.625rem 0.75rem;
    background: var(--chc-soft-surface);
    color: var(--chc-text);
    text-align: left;
    border: 0.0625rem solid var(--chc-border);
  }

  .payment-method-row-action {
    transition: border-color 120ms ease, background-color 120ms ease,
      box-shadow 120ms ease;
    cursor: pointer;
  }

  .payment-method-row-edit {
    grid-template-columns: 2.25rem minmax(0, 1fr) auto;
    cursor: default;
  }

  .selected-payment-method {
    border-color: var(--chc-primary);
    background: var(--chc-soft-surface);
    box-shadow: 0 0 0 0.0625rem
      color-mix(in srgb, var(--chc-primary) 28%, transparent);
  }

  .payment-method-row-action:hover:not(:disabled),
  .payment-method-row-action:focus-visible {
    border-color: var(--chc-primary);
    background: color-mix(
      in srgb,
      var(--chc-primary) 6%,
      var(--chc-soft-surface)
    );
    box-shadow: 0 0 0 0.0625rem
      color-mix(in srgb, var(--chc-primary) 24%, transparent);
  }

  .payment-method-row-action:focus-visible {
    outline: 0;
  }

  .payment-method-row-action:disabled {
    border-color: var(--chc-border);
    background: var(--chc-soft-surface);
    color: var(--chc-placeholder);
    cursor: not-allowed;
  }

  .payment-method-row-spacer {
    width: 1rem;
    height: 1rem;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  .payment-method-chevron {
    width: 1rem;
    height: 1rem;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: transparent;
    color: var(--chc-primary);
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
    transition: background-color 120ms ease, color 120ms ease;
    touch-action: manipulation;
  }

  .payment-method-delete-button:hover:not(:disabled),
  .payment-method-delete-button:focus-visible {
    background: color-mix(
      in srgb,
      var(--chc-danger) 10%,
      transparent
    );
  }

  .payment-method-delete-button:focus-visible {
    outline: 0;
    box-shadow: 0 0 0 0.125rem
      color-mix(in srgb, var(--chc-danger) 24%, transparent);
  }

  .payment-method-delete-button:disabled {
    color: var(--chc-muted);
    cursor: not-allowed;
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
    width: 2.25rem;
    height: 2.25rem;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 0.6875rem;
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
    font-weight: 600;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .payment-method-meta {
    color: var(--chc-copy);
    font-weight: inherit;
  }

  .payment-method-status {
    font-weight: inherit;
    font-size: 0.875em;
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
    min-height: 3.5rem;
    display: grid;
    grid-template-columns: auto minmax(0, 1fr);
    align-items: center;
    gap: 0.625rem;
    border: 0.0625rem solid var(--chc-border);
    border-radius: var(--chc-radius-card);
    padding: 0.75rem;
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
    font-size: 1.5rem;
    font-weight: 400;
  }

  .source-action-copy {
    display: grid;
    min-width: 0;
  }

  .source-action-title {
    overflow: hidden;
    color: var(--chc-text);
    font-weight: 600;
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
    grid-template-columns: auto minmax(0, 1fr);
    gap: 0.5rem;
    align-items: center;
    border: 0.0625rem solid var(--chc-border);
    border-radius: 1rem;
    padding: 0.625rem 0.75rem;
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
    font-weight: 600;
  }

  .source-action-link-subtitle {
    color: var(--chc-copy);
    font-size: 0.875em;
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
    gap: 0.25rem;
    text-align: left;
  }

  .empty-state-title {
    margin: 0;
    color: var(--chc-text);
    font-size: 1em;
    font-weight: 600;
  }

  .empty-state-message {
    margin: 0;
    color: var(--chc-copy);
  }

  .detail-row {
    min-height: 0;
    display: grid;
    gap: 0.125rem;
    padding: 0.75rem 1rem;
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
    min-height: 3.75rem;
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    align-items: center;
    gap: 0.75rem;
    border: 0.0625rem dashed var(--chc-border-strong);
    border-radius: var(--chc-radius-card);
    padding: 0 1rem;
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
    gap: 0.75rem;
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
    font-weight: 600;
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
    background: var(--chc-surface);
    text-align: left;
  }

  .loading-spinner {
    width: 2.5rem;
    height: 2.5rem;
    border: 0.3125rem solid #dbe3f1;
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
    font-size: 1.125em;
    font-weight: 600;
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
    gap: 0.875rem;
    text-align: left;
  }

  .bank-provider-flow {
    display: grid;
    gap: 0.875rem;
  }

  .provider-frame-header {
    display: grid;
    gap: 0.25rem;
  }

  .provider-frame-title {
    margin: 0;
    color: var(--chc-text);
    font-size: 1em;
    font-weight: 600;
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
    gap: 0.875rem;
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
    font-weight: 600;
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
    font-weight: 600;
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
    font-weight: 600;
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
    margin-top: 1.25rem;
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
      --chc-shell-padding: 1.25rem 1rem 1rem;
    }

    .widget-shell {
      border-radius: 0.875rem;
    }

    .widget-close {
      right: 0.375rem;
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
      padding-right: 0.75rem;
      padding-left: 0.75rem;
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

  @media (prefers-reduced-motion: reduce) {
    .widget-close,
    .button,
    .field-input,
    .field-control-card-form,
    .payment-method-row,
    .source-action-link {
      transition: none;
    }
  }
`;
