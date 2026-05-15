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
    --chc-radius-control: 10px;
    --chc-radius-card: 14px;
    --chc-radius-shell: 20px;
    --chc-input-height: 46px;
    --chc-font-weight: 300;
    --chc-divider: #eaecf0;
    --chc-focus-ring: rgba(0, 61, 230, 0.18);
    --chc-shell-shadow: 0 1px 2px rgba(16, 24, 40, 0.04),
      0 12px 24px rgba(16, 24, 40, 0.06);
    display: block;
    color: var(--chc-text);
    font-family: var(--chc-font-family);
    font-size: 16px;
    font-weight: var(--chc-font-weight);
  }

  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  .widget-shell {
    width: 100%;
    max-width: 420px;
    position: relative;
    padding: 28px 24px 24px;
    border-radius: var(--chc-radius-shell);
    background: var(--chc-surface);
    text-align: left;
  }

  .widget-shell-wide {
    max-width: 640px;
  }

  .widget-close {
    width: 36px;
    height: 36px;
    position: absolute;
    top: 18px;
    right: 14px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: 0;
    border-radius: 999px;
    background: transparent;
    color: var(--chc-muted);
    font: inherit;
    font-size: 1.5em;
    font-weight: 700;
    line-height: 1;
    cursor: pointer;
  }

  .widget-title {
    margin: 0;
    color: var(--chc-text);
    font-size: 1.15rem;
    font-weight: 700;
    letter-spacing: -0.02em;
    line-height: 1.2;
  }

  .widget-subtitle {
    margin: 8px 0 0;
    color: var(--chc-copy);
    font-size: 1em;
    font-weight: inherit;
    line-height: 1.5;
  }

  .widget-divider {
    height: 1px;
    margin-top: 16px;
    background: var(--chc-divider);
  }

  .widget-content {
    margin-top: 24px;
  }

  .primitive-stack {
    display: grid;
    gap: 12px;
  }

  .primitive-actions {
    display: grid;
    gap: 12px;
    margin-top: 16px;
  }

  .primitive-footer {
    display: grid;
    margin-top: 1rem;
  }

  .payment-action-links {
    display: grid;
    gap: 14px;
    margin-top: 4px;
    justify-items: start;
  }

  .otp-flow,
  .payment-flow {
    display: grid;
    gap: 16px;
  }

  .otp-support {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    flex-wrap: nowrap;
    text-align: center;
  }

  .otp-support-copy {
    margin: 0;
    color: var(--chc-copy);
    font-size: 0.9375em;
    line-height: 1.4667;
  }

  .otp-support-actions {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .otp-resend-prefix {
    color: var(--chc-copy);
  }

  .otp-resend {
    border: 0;
    padding: 0;
    background: transparent;
    color: var(--chc-primary);
    font: inherit;
    font-size: 0.9375em;
    font-weight: 500;
    line-height: 1.4667;
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
    border: 1px solid var(--chc-primary);
    border-radius: var(--chc-radius-control);
    padding: 7px 18px;
    font: inherit;
    font-size: 1.0625em;
    font-weight: 500;
    line-height: 1.2941;
    cursor: pointer;
  }

  .button-content {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }

  .button-icon {
    width: 1em;
    height: 1em;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 0.875em;
    line-height: 1;
  }

  .button-icon-check::before {
    content: '✓';
  }

  .button-icon-arrow-right::before {
    content: '→';
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
    gap: 6px;
    min-width: 0;
    text-align: left;
  }

  .field-full {
    grid-column: 1 / -1;
  }

  .field-label {
    color: var(--chc-text);
    font-size: 0.9375em;
    font-weight: 600;
    line-height: 1.4667;
  }

  .field-input {
    width: 100%;
    height: var(--chc-input-height);
    border: 1px solid var(--chc-border);
    border-radius: var(--chc-radius-control);
    padding: 0 16px;
    background: var(--chc-surface);
    color: var(--chc-text);
    font: inherit;
    font-size: 1em;
    line-height: 1.5;
    text-align: left;
  }

  .field-select {
    appearance: auto;
    text-align: left;
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
    font-size: 0.875em;
    font-weight: 600;
    line-height: 1.4286;
  }

  .form-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;
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
    width: 1px;
    height: 1px;
    position: absolute;
    overflow: hidden;
    clip: rect(0 0 0 0);
    white-space: nowrap;
  }

  .otp-inputs {
    display: grid;
    width: min(100%, 332px);
    margin: 0 auto;
    grid-template-columns: repeat(6, minmax(0, 1fr));
    gap: 8px;
  }

  .otp-input {
    width: 100%;
    height: 44px;
    border: 1px solid var(--chc-border);
    border-radius: 10px;
    background: var(--chc-surface);
    color: var(--chc-text);
    font: inherit;
    font-size: 1.25em;
    font-weight: 600;
    line-height: 1;
    text-align: center;
  }

  .otp-input:focus {
    border-color: var(--chc-primary);
    outline: 0;
    box-shadow: 0 0 0 4px var(--chc-focus-ring);
  }

  .otp-group-error .otp-input {
    border-color: var(--chc-danger);
    color: var(--chc-danger);
  }

  .alert {
    min-height: 52px;
    display: flex;
    align-items: center;
    border: 1px solid;
    border-radius: var(--chc-radius-control);
    padding: 12px 16px;
    font-size: 0.875em;
    font-weight: 600;
    line-height: 1.4286;
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
    min-width: 68px;
    min-height: 22px;
    align-items: center;
    justify-content: center;
    border: 1px solid;
    border-radius: 999px;
    padding: 1px 10px;
    font-size: 0.6875em;
    font-weight: 600;
    line-height: 1.2727;
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
    min-width: 82px;
    border-color: var(--chc-danger-border);
    background: var(--chc-danger-bg);
    color: var(--chc-danger);
  }

  .payment-method-row {
    width: 100%;
    display: grid;
    grid-template-columns: 18px 36px minmax(0, 1fr);
    gap: 12px;
    align-items: center;
    border: 1px solid var(--chc-border);
    border-radius: 16px;
    padding: 11px 14px;
    background: var(--chc-surface);
    color: var(--chc-text);
    font: inherit;
    text-align: left;
    cursor: pointer;
  }

  .payment-method-row[aria-checked='true'] {
    border-color: var(--chc-primary);
    box-shadow: 0 0 0 1px var(--chc-primary);
  }

  .payment-method-row:disabled {
    border-color: var(--chc-border);
    background: var(--chc-surface);
    color: var(--chc-placeholder);
    cursor: not-allowed;
  }

  .payment-method-radio {
    width: 18px;
    height: 18px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: 1px solid var(--chc-border-strong);
    border-radius: 999px;
    background: var(--chc-surface);
  }

  .payment-method-radio-dot {
    width: 8px;
    height: 8px;
    border-radius: 999px;
    background: transparent;
  }

  .payment-method-row[aria-checked='true'] .payment-method-radio {
    border-color: var(--chc-primary);
  }

  .payment-method-row[aria-checked='true'] .payment-method-radio-dot {
    background: var(--chc-primary);
  }

  .payment-method-icon-chip {
    width: 36px;
    height: 36px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: 1px solid var(--chc-border);
    border-radius: 999px;
    background: var(--chc-surface);
    color: var(--chc-primary);
    overflow: hidden;
  }

  .payment-method-icon-image {
    width: 24px;
    height: 24px;
    display: block;
  }

  .payment-method-copy {
    display: grid;
    gap: 2px;
    min-width: 0;
  }

  .payment-method-title {
    overflow: hidden;
    color: var(--chc-text);
    font-size: 1em;
    font-weight: 700;
    line-height: 1.25;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .payment-method-meta {
    color: var(--chc-muted);
    font-size: 0.875em;
    font-weight: inherit;
    line-height: 1.4286;
  }

  .payment-method-status {
    font-size: 0.8125em;
    font-weight: inherit;
    line-height: 1.3846;
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
    min-height: 78px;
    display: grid;
    grid-template-columns: 40px minmax(0, 1fr);
    align-items: center;
    gap: 16px;
    border: 1px solid var(--chc-border);
    border-radius: var(--chc-radius-card);
    padding: 16px 18px;
    background: var(--chc-surface);
    color: var(--chc-text);
    font: inherit;
    text-align: left;
    cursor: pointer;
  }

  .source-action:disabled {
    background: var(--chc-surface);
    color: var(--chc-placeholder);
    cursor: not-allowed;
  }

  .source-action-icon {
    --chc-source-action-icon-surface: color-mix(
      in srgb,
      var(--chc-primary) 15%,
      transparent
    );
    flex: 0 0 auto;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 6px 11px;
    border: 1px solid var(--chc-source-action-icon-surface);
    border-radius: 999px;
    background: var(--chc-source-action-icon-surface);
    color: var(--chc-primary);
    font-size: 1.75rem;
    font-weight: 300;
    line-height: 1;
  }

  .source-action-copy {
    display: grid;
    min-width: 0;
  }

  .source-action-title {
    overflow: hidden;
    color: var(--chc-text);
    font-size: 1.0625em;
    font-weight: 700;
    line-height: 1.4118;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .source-action-subtitle {
    overflow: hidden;
    color: var(--chc-muted);
    font-size: 0.9375em;
    font-weight: inherit;
    line-height: 1.4667;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .source-action-link {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr);
    gap: 10px;
    align-items: center;
    justify-content: start;
    border: 0;
    padding: 0;
    background: transparent;
    color: var(--chc-primary);
    font: inherit;
    text-align: left;
    cursor: pointer;
  }

  .source-action-link:disabled {
    color: var(--chc-muted);
    cursor: not-allowed;
  }

  .source-action:disabled .source-action-icon,
  .source-action-link:disabled .source-action-icon {
    --chc-source-action-icon-surface: color-mix(
      in srgb,
      var(--chc-muted) 15%,
      transparent
    );
    color: var(--chc-muted);
  }

  .source-action-link-copy {
    display: grid;
    gap: 2px;
    min-width: 0;
  }

  .source-action-link-title {
    color: currentColor;
    font-size: 1em;
    font-weight: 500;
    line-height: 1.4;
  }

  .source-action-link-subtitle {
    color: var(--chc-copy);
    font-size: 0.875em;
    line-height: 1.4286;
  }

  .source-action-link:disabled .source-action-link-subtitle {
    color: var(--chc-muted);
  }

  .detail-list {
    display: grid;
    border: 1px solid var(--chc-border);
    border-radius: var(--chc-radius-card);
    background: var(--chc-surface);
    overflow: hidden;
    text-align: left;
  }

  .empty-state {
    display: grid;
    gap: 6px;
    text-align: left;
  }

  .empty-state-title {
    margin: 0;
    color: var(--chc-text);
    font-size: 1em;
    font-weight: 700;
    line-height: 1.5;
  }

  .empty-state-message {
    margin: 0;
    color: var(--chc-copy);
    font-size: 0.9375em;
    line-height: 1.4667;
  }

  .detail-row {
    min-height: 76px;
    display: grid;
    gap: 2px;
    padding: 12px 24px;
  }

  .detail-row + .detail-row {
    border-top: 1px solid var(--chc-border);
  }

  .detail-label {
    color: var(--chc-muted);
    font-size: 1em;
    font-weight: 600;
    line-height: 1.375;
  }

  .detail-value {
    color: var(--chc-text);
    font-size: 1.25em;
    font-weight: 600;
    line-height: 1.4;
  }

  .upload-row {
    width: 100%;
    min-height: 72px;
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    align-items: center;
    gap: 16px;
    border: 1px dashed var(--chc-border-strong);
    border-radius: var(--chc-radius-card);
    padding: 0 18px;
    background: var(--chc-surface);
    color: var(--chc-copy);
    font: inherit;
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
    gap: 14px;
  }

  .upload-icon {
    width: 32px;
    color: var(--chc-primary);
    font-size: 1.5em;
    font-weight: 700;
    line-height: 1;
    text-align: center;
  }

  .upload-row-label {
    width: 1px;
    height: 1px;
    position: absolute;
    overflow: hidden;
    clip: rect(0 0 0 0);
    white-space: nowrap;
  }

  .upload-row-requirements {
    overflow: hidden;
    font-size: 1em;
    font-weight: inherit;
    line-height: 1.375;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .upload-row-action {
    color: var(--chc-primary);
    font-size: 1.125em;
    font-weight: 700;
    line-height: 1.3333;
    white-space: nowrap;
  }

  .loading-row {
    min-height: 84px;
    display: grid;
    grid-template-columns: 48px minmax(0, 1fr);
    align-items: center;
    gap: 16px;
    border: 1px solid var(--chc-border);
    border-radius: var(--chc-radius-card);
    padding: 16px 18px;
    background: var(--chc-surface);
    text-align: left;
  }

  .loading-spinner {
    width: 48px;
    height: 48px;
    border: 6px solid #dbe3f1;
    border-right-color: var(--chc-primary);
    border-radius: 999px;
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
    line-height: 1.3333;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .loading-row-helper {
    overflow: hidden;
    color: var(--chc-muted);
    font-size: 1em;
    font-weight: inherit;
    line-height: 1.5;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .provider-frame {
    display: grid;
    gap: 18px;
    text-align: left;
  }

  .bank-provider-flow {
    display: grid;
    gap: 20px;
  }

  .provider-frame-header {
    display: grid;
    gap: 4px;
  }

  .provider-frame-title {
    margin: 0;
    color: var(--chc-text);
    font-size: 1.125em;
    font-weight: 700;
    line-height: 1.3333;
  }

  .provider-frame-status {
    margin: 0;
    color: var(--chc-muted);
    font-size: 0.9375em;
    line-height: 1.4667;
  }

  .provider-frame-slot {
    display: block;
  }

  .provider-frame-container,
  ::slotted(.provider-frame-container) {
    width: 100%;
    min-height: 520px;
    background: var(--chc-soft-surface);
    overflow: hidden;
  }

  .outcome-shell {
    display: grid;
    justify-items: center;
    gap: 16px;
    text-align: center;
  }

  .outcome-icon {
    width: 72px;
    height: 72px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: 2px solid;
    border-radius: 999px;
    font-size: 2.25em;
    font-weight: 700;
    line-height: 1;
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
    line-height: 1.3636;
  }

  .outcome-message {
    margin: 0;
    color: var(--chc-copy);
    font-size: 1em;
    line-height: 1.5;
  }

  .outcome-content,
  .outcome-actions {
    width: 100%;
  }

  .outcome-actions {
    display: grid;
    gap: 12px;
  }

  .verification-details {
    display: grid;
    width: 100%;
    border: 1px solid var(--chc-border);
    border-radius: var(--chc-radius-card);
    background: var(--chc-surface);
    overflow: hidden;
    text-align: left;
  }

  .verification-detail-row {
    min-height: 64px;
    display: grid;
    gap: 2px;
    padding: 10px 20px;
  }

  .verification-detail-row + .verification-detail-row {
    border-top: 1px solid var(--chc-border);
  }

  .verification-detail-label {
    color: var(--chc-muted);
    font-size: 0.875em;
    font-weight: 600;
    line-height: 1.4286;
  }

  .verification-detail-value {
    color: var(--chc-text);
    font-size: 1.125em;
    font-weight: 700;
    line-height: 1.3333;
  }

  .text-link-button {
    min-height: 0;
    border: 0;
    padding: 0;
    background: transparent;
    color: var(--chc-primary);
    font: inherit;
    font-size: 0.9375em;
    font-weight: 500;
    line-height: 1.4667;
    cursor: pointer;
  }

  .text-link-button:disabled {
    color: var(--chc-muted);
    cursor: not-allowed;
  }

  .powered-by-footer {
    display: flex;
    justify-content: center;
    gap: 5px;
    margin-top: 20px;
    color: var(--chc-copy);
    font-size: 0.875em;
    font-weight: inherit;
    line-height: 1.4286;
    white-space: nowrap;
  }

  .powered-by-brand {
    color: var(--chc-text);
    font-weight: 700;
  }

  @media (max-width: 420px) {
    .widget-shell {
      padding: 24px 20px 20px;
      border-radius: 18px;
    }

    .widget-close {
      right: 8px;
    }

    .form-grid {
      grid-template-columns: minmax(0, 1fr);
    }

    .otp-inputs {
      width: 100%;
    }

    .otp-input {
      height: 40px;
    }

    .payment-method-row,
    .source-action,
    .upload-row,
    .loading-row {
      padding-right: 16px;
      padding-left: 16px;
    }

    .provider-frame-container,
    ::slotted(.provider-frame-container) {
      min-height: 460px;
    }

    .source-action-title,
    .payment-method-title {
      white-space: normal;
    }
  }
`;
