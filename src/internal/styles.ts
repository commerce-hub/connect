import {css} from 'lit';

export const primitiveStyles = css`
  :host {
    --chc-text: #06103a;
    --chc-copy: #24304f;
    --chc-muted: #6b7288;
    --chc-placeholder: #7a849c;
    --chc-surface: #f7f9fc;
    --chc-soft-surface: #f1f4fa;
    --chc-border: #cbd3e3;
    --chc-border-strong: #b9c3d6;
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
    --chc-disabled-surface: #a9b8d8;
    --chc-font-family: 'Open Sans', Arial, sans-serif;
    --chc-radius-control: 8px;
    --chc-radius-card: 12px;
    --chc-radius-shell: 24px;
    --chc-input-height: 60px;
    --chc-button-height: 72px;
    display: block;
    color: var(--chc-text);
    font-family: var(--chc-font-family);
    font-size: 16px;
  }

  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  .widget-shell {
    width: 100%;
    max-width: 520px;
    position: relative;
    padding: 72px 48px 34px;
    border-radius: var(--chc-radius-shell);
    background: #fff;
    text-align: center;
  }

  .widget-shell-wide {
    max-width: 616px;
  }

  .widget-close {
    width: 44px;
    height: 44px;
    position: absolute;
    top: 32px;
    right: 28px;
    border: 0;
    background: transparent;
    color: var(--chc-text);
    font: inherit;
    font-size: 2.25em;
    font-weight: 700;
    line-height: 1;
    cursor: pointer;
  }

  .widget-title {
    margin: 0;
    color: #000;
    font-size: 2.125em;
    font-weight: 700;
    line-height: 1.2059;
  }

  .widget-subtitle {
    margin: 18px 0 0;
    color: var(--chc-copy);
    font-size: 1.25em;
    font-weight: 400;
    line-height: 1.5;
  }

  .widget-content {
    margin-top: 34px;
  }

  .primitive-stack {
    display: grid;
    gap: 16px;
  }

  .primitive-actions {
    display: grid;
    gap: 12px;
    margin-top: 24px;
  }

  .primitive-footer {
    display: grid;
    margin-top: 24px;
  }

  .otp-flow,
  .payment-flow {
    display: grid;
    gap: 18px;
  }

  .otp-resend-row {
    display: flex;
    min-height: 28px;
    align-items: center;
    justify-content: center;
    gap: 6px;
    color: var(--chc-muted);
    font-size: 1em;
    line-height: 1.375;
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
    font-weight: 700;
    cursor: pointer;
  }

  .otp-resend:disabled {
    color: var(--chc-muted);
    cursor: not-allowed;
  }

  .button {
    min-height: var(--chc-button-height);
    border: 1px solid var(--chc-primary);
    border-radius: var(--chc-radius-control);
    padding: 0 24px;
    font: inherit;
    font-size: 1.5em;
    font-weight: 700;
    line-height: 1.25;
    cursor: pointer;
  }

  .button-primary {
    background: var(--chc-primary);
    color: #fff;
  }

  .button-secondary {
    border-color: var(--chc-border);
    background: #fff;
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
    gap: 8px;
    min-width: 0;
    text-align: left;
  }

  .field-full {
    grid-column: 1 / -1;
  }

  .field-label {
    color: var(--chc-text);
    font-size: 1em;
    font-weight: 600;
    line-height: 1.375;
  }

  .field-input {
    width: 100%;
    height: var(--chc-input-height);
    border: 1.4px solid var(--chc-border);
    border-radius: var(--chc-radius-control);
    padding: 0 20px;
    background: #fff;
    color: var(--chc-text);
    font: inherit;
    font-size: 1.25em;
    line-height: 1.4;
    text-align: center;
  }

  .field-input::placeholder {
    color: var(--chc-placeholder);
  }

  .form-grid {
    display: grid;
    gap: 18px;
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
    grid-template-columns: repeat(6, minmax(0, 68px));
    gap: 16px;
  }

  .otp-input {
    width: 68px;
    height: 72px;
    border: 1.4px solid var(--chc-border);
    border-radius: 10px;
    color: var(--chc-text);
    font: inherit;
    font-size: 2em;
    font-weight: 400;
    line-height: 1.3125;
    text-align: center;
  }

  .otp-input:focus {
    border-color: var(--chc-primary);
    outline: 1px solid var(--chc-primary);
  }

  .otp-group-error .otp-input {
    border-color: var(--chc-danger);
    color: var(--chc-danger);
  }

  .alert {
    min-height: 64px;
    display: flex;
    align-items: center;
    border: 1px solid;
    border-radius: var(--chc-radius-control);
    padding: 12px 24px;
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
    min-height: 124px;
    display: grid;
    grid-template-columns: minmax(0, 1fr) 42px;
    gap: 12px;
    align-items: center;
    border: 1px solid var(--chc-border);
    border-radius: var(--chc-radius-card);
    padding: 15px 20px 16px 27px;
    background: #fff;
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

  .payment-method-text {
    display: grid;
    min-width: 0;
  }

  .payment-method-eyebrow {
    color: var(--chc-copy);
    font-size: 1em;
    font-weight: 400;
    line-height: 1.375;
  }

  .payment-method-title {
    overflow: hidden;
    color: var(--chc-text);
    font-size: 1.4375em;
    font-weight: 700;
    line-height: 1.3044;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .payment-method-holder {
    color: var(--chc-muted);
    font-size: 1.125em;
    font-weight: 400;
    line-height: 1.3889;
  }

  .payment-method-status {
    font-size: 1.0625em;
    font-weight: 400;
    line-height: 1.2941;
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

  .payment-method-chevron {
    color: var(--chc-text);
    font-size: 2.125em;
    font-weight: 700;
    line-height: 1;
    text-align: center;
  }

  .source-action {
    width: 100%;
    min-height: 86px;
    display: grid;
    grid-template-columns: 52px minmax(0, 1fr);
    align-items: center;
    gap: 24px;
    border: 1px solid var(--chc-border);
    border-radius: var(--chc-radius-card);
    padding: 16px 27px;
    background: #fff;
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
    width: 52px;
    height: 52px;
    flex: 0 0 auto;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 999px;
    background: var(--chc-soft-surface);
    color: var(--chc-primary);
    font-size: 1.75em;
    font-weight: 700;
    line-height: 1.2143;
  }

  .source-action-copy {
    display: grid;
    min-width: 0;
  }

  .source-action-title {
    overflow: hidden;
    color: var(--chc-text);
    font-size: 1.4375em;
    font-weight: 700;
    line-height: 1.3044;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .source-action-subtitle {
    overflow: hidden;
    color: var(--chc-muted);
    font-size: 1.0625em;
    font-weight: 400;
    line-height: 1.4706;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .detail-list {
    display: grid;
    border: 1px solid var(--chc-border);
    border-radius: var(--chc-radius-card);
    background: #fff;
    overflow: hidden;
    text-align: left;
  }

  .empty-state {
    display: grid;
    gap: 8px;
    border: 1px dashed var(--chc-border-strong);
    border-radius: var(--chc-radius-card);
    padding: 28px 24px;
    background: var(--chc-surface);
    text-align: left;
  }

  .empty-state-title {
    margin: 0;
    color: var(--chc-text);
    font-size: 1.375em;
    font-weight: 700;
    line-height: 1.3636;
  }

  .empty-state-message {
    margin: 0;
    color: var(--chc-muted);
    font-size: 1em;
    line-height: 1.5;
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
    min-height: 78px;
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    align-items: center;
    gap: 16px;
    border: 1px dashed var(--chc-border-strong);
    border-radius: var(--chc-radius-card);
    padding: 0 22px;
    background: #fff;
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
    font-weight: 400;
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
    min-height: 94px;
    display: grid;
    grid-template-columns: 56px minmax(0, 1fr);
    align-items: center;
    gap: 20px;
    border: 1px solid var(--chc-border);
    border-radius: var(--chc-radius-card);
    padding: 18px 23px;
    background: #fff;
    text-align: left;
  }

  .loading-spinner {
    width: 56px;
    height: 56px;
    border: 7px solid #dbe3f1;
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
    font-weight: 400;
    line-height: 1.5;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .powered-by-footer {
    display: flex;
    justify-content: center;
    gap: 5px;
    margin-top: 28px;
    color: var(--chc-copy);
    font-size: 1em;
    font-weight: 400;
    line-height: 1.375;
    white-space: nowrap;
  }

  .powered-by-brand {
    color: var(--chc-primary);
    font-weight: 700;
  }

  @media (max-width: 420px) {
    .widget-shell {
      padding: 64px 24px 28px;
      border-radius: 18px;
    }

    .widget-close {
      right: 16px;
    }

    .widget-title {
      font-size: 1.875em;
      line-height: 1.2;
    }

    .widget-subtitle {
      font-size: 1.125em;
      line-height: 1.5;
    }

    .otp-inputs {
      grid-template-columns: repeat(6, minmax(0, 1fr));
      gap: 8px;
    }

    .otp-input {
      width: 100%;
      height: 62px;
    }

    .payment-method-row,
    .source-action,
    .upload-row,
    .loading-row {
      padding-right: 18px;
      padding-left: 18px;
    }

    .source-action-title,
    .payment-method-title {
      white-space: normal;
    }
  }
`;
