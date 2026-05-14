import {css} from 'lit';

export const primitiveStyles = css`
  :host {
    --chc-text: #101828;
    --chc-copy: #344054;
    --chc-muted: #667085;
    --chc-surface: #f3f5f8;
    --chc-border: #cbd5e1;
    --chc-badge-border: #e4e7ec;
    --chc-primary: #084acc;
    --chc-success: #047857;
    --chc-success-bg: #ecfdf3;
    --chc-success-border: #a6f4c5;
    --chc-danger: #b42318;
    --chc-danger-bg: #fef3f2;
    --chc-danger-border: #fecdca;
    --chc-warning: #b54708;
    --chc-warning-bg: #fffaeb;
    --chc-warning-border: #fedf89;
    --chc-disabled-text: #98a2b3;
    --chc-disabled-surface: #f2f4f7;
    --chc-page-bg: #edf2f7;
    --chc-font-family: 'Open Sans', Arial, sans-serif;
    --chc-radius-control: 8px;
    --chc-radius-shell: 12px;
    --chc-space-2: 8px;
    --chc-space-3: 12px;
    --chc-space-4: 16px;
    --chc-space-5: 20px;
    --chc-input-height: 42px;
    --chc-button-height: 44px;
    display: block;
    color: var(--chc-text);
    font-family: var(--chc-font-family);
  }

  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  .widget-shell {
    width: 100%;
    max-width: 386px;
    padding: var(--chc-space-5);
    border-radius: var(--chc-radius-shell);
    background: #fff;
  }

  .widget-shell-wide {
    max-width: 430px;
  }

  .widget-title {
    margin: 0;
    color: var(--chc-text);
    font-size: 22px;
    font-weight: 700;
    line-height: 28px;
  }

  .widget-subtitle {
    margin: 4px 0 0;
    color: var(--chc-muted);
    font-size: 14px;
    font-weight: 400;
    line-height: 20px;
  }

  .widget-content {
    margin-top: 18px;
  }

  .primitive-stack {
    display: grid;
    gap: var(--chc-space-2);
  }

  .primitive-actions {
    display: grid;
    gap: var(--chc-space-2);
    margin-top: var(--chc-space-3);
  }

  .primitive-footer {
    display: grid;
    margin-top: var(--chc-space-4);
  }

  .button {
    min-height: var(--chc-button-height);
    border: 1px solid var(--chc-primary);
    border-radius: var(--chc-radius-control);
    padding: 0 var(--chc-space-4);
    font: inherit;
    font-size: 14px;
    font-weight: 700;
    line-height: 20px;
    cursor: pointer;
  }

  .button-primary {
    background: var(--chc-primary);
    color: #fff;
  }

  .button-secondary {
    border-color: var(--chc-border);
    background: #fff;
    color: var(--chc-copy);
  }

  .button:disabled {
    cursor: not-allowed;
    opacity: 0.62;
  }

  .field {
    display: grid;
    gap: 7px;
    min-width: 0;
  }

  .field-full {
    grid-column: 1 / -1;
  }

  .field-label {
    color: var(--chc-copy);
    font-size: 12px;
    font-weight: 600;
    line-height: 16px;
  }

  .field-input {
    width: 100%;
    height: var(--chc-input-height);
    border: 1px solid var(--chc-border);
    border-radius: var(--chc-radius-control);
    padding: 0 var(--chc-space-3);
    background: #fff;
    color: var(--chc-text);
    font: inherit;
    font-size: 14px;
    line-height: 20px;
  }

  .field-input::placeholder {
    color: var(--chc-muted);
  }

  .form-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 18px 14px;
  }

  .otp-group {
    display: grid;
    gap: var(--chc-space-2);
  }

  .otp-label {
    color: var(--chc-copy);
    font-size: 12px;
    font-weight: 600;
    line-height: 16px;
  }

  .otp-inputs {
    display: grid;
    grid-template-columns: repeat(6, minmax(0, 51px));
    gap: var(--chc-space-2);
  }

  .otp-input {
    width: 51px;
    height: 48px;
    border: 1px solid var(--chc-border);
    border-radius: var(--chc-radius-control);
    color: var(--chc-text);
    font: inherit;
    font-size: 18px;
    font-weight: 700;
    line-height: 22px;
    text-align: center;
  }

  .alert {
    min-height: 50px;
    display: flex;
    align-items: center;
    border: 1px solid;
    border-radius: var(--chc-radius-control);
    padding: var(--chc-space-3);
    font-size: 14px;
    font-weight: 600;
    line-height: 20px;
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
    font-size: 11px;
    font-weight: 600;
    line-height: 14px;
  }

  .status-verified {
    border-color: var(--chc-success-border);
    background: var(--chc-success-bg);
    color: var(--chc-success);
  }

  .status-pending {
    border-color: #d0d5dd;
    background: var(--chc-disabled-surface);
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
    min-height: 64px;
    display: grid;
    grid-template-columns: 18px 54px minmax(0, 1fr) auto;
    gap: var(--chc-space-3);
    align-items: center;
    border: 1px solid var(--chc-border);
    border-radius: var(--chc-radius-control);
    padding: 12px;
    background: #fff;
    color: var(--chc-text);
    font: inherit;
    text-align: left;
    cursor: pointer;
  }

  .payment-method-row[aria-checked='true'] {
    border-color: var(--chc-text);
  }

  .payment-method-row:disabled {
    border-color: #d0d5dd;
    background: #f9fafb;
    color: var(--chc-disabled-text);
    cursor: not-allowed;
    opacity: 0.62;
  }

  .payment-method-radio {
    width: 18px;
    height: 18px;
    border: 1px solid var(--chc-border);
    border-radius: 999px;
    background: #fff;
  }

  .payment-method-row[aria-checked='true'] .payment-method-radio::after {
    content: '';
    display: block;
    width: 8px;
    height: 8px;
    margin: 4px;
    border-radius: 999px;
    background: var(--chc-text);
  }

  .payment-method-brand {
    height: 32px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: 1px solid var(--chc-badge-border);
    border-radius: 6px;
    background: var(--chc-surface);
    color: var(--chc-primary);
    font-size: 11px;
    font-weight: 700;
    line-height: 14px;
  }

  .payment-method-row:disabled .payment-method-brand {
    border-color: #d0d5dd;
    background: var(--chc-disabled-surface);
    color: var(--chc-disabled-text);
  }

  .payment-method-text {
    min-width: 0;
  }

  .payment-method-label {
    overflow: hidden;
    color: currentColor;
    font-size: 14px;
    font-weight: 600;
    line-height: 20px;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .payment-method-meta {
    color: var(--chc-muted);
    font-size: 12px;
    line-height: 16px;
  }

  .payment-method-row:disabled .payment-method-meta {
    color: var(--chc-disabled-text);
  }

  .source-action {
    min-height: 36px;
    display: inline-flex;
    align-items: center;
    gap: var(--chc-space-3);
    border: 0;
    border-radius: var(--chc-radius-control);
    padding: 0 var(--chc-space-3);
    background: #fff;
    color: var(--chc-primary);
    font: inherit;
    font-size: 13px;
    font-weight: 600;
    line-height: 18px;
    cursor: pointer;
  }

  .source-action-icon {
    width: 14px;
    height: 14px;
    flex: 0 0 auto;
  }

  .detail-list {
    display: grid;
    gap: var(--chc-space-2);
  }

  .detail-row {
    min-height: 58px;
    display: grid;
    gap: 2px;
    border: 1px solid var(--chc-badge-border);
    border-radius: var(--chc-radius-control);
    padding: 8px var(--chc-space-3);
    background: #fff;
  }

  .detail-label {
    color: var(--chc-muted);
    font-size: 12px;
    font-weight: 600;
    line-height: 16px;
  }

  .detail-value {
    color: var(--chc-text);
    font-size: 14px;
    font-weight: 600;
    line-height: 20px;
  }

  @media (max-width: 420px) {
    .form-grid {
      grid-template-columns: 1fr;
    }

    .otp-inputs {
      grid-template-columns: repeat(6, minmax(0, 1fr));
    }

    .otp-input {
      width: 100%;
    }
  }
`;
