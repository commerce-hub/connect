import {css} from 'lit';

export const primitiveStyles = css`
  :host {
    --chc-text: #061b31;
    --chc-copy: #50617a;
    --chc-muted: #50617a;
    --chc-placeholder: #9ca3af;
    --chc-surface: #ffffff;
    --chc-widget-background: var(--chc-surface);
    --chc-soft-surface: #f8fafd;
    --chc-border: #e5edf5;
    --chc-border-strong: #8596a8;
    --chc-payment-method-background: var(--chc-surface);
    --chc-primary: #533afd;
    --chc-button-text: #ffffff;
    --chc-success: #047857;
    --chc-success-bg: #ecfdf3;
    --chc-success-border: #a6f4c5;
    --chc-danger: #c2410c;
    --chc-danger-bg: #fef3f2;
    --chc-danger-border: #fecdca;
    --chc-warning: #c2410c;
    --chc-warning-bg: #fffaeb;
    --chc-warning-border: #fedf89;
    --chc-disabled-text: #ffffff;
    --chc-disabled-surface: #c5ccd8;
    --chc-font-family: sohne-var, 'SF Pro Display', system-ui, -apple-system,
      'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
    --chc-radius-control: 0.5rem;
    --chc-radius-card: 0.5rem;
    --chc-input-height: 2.75rem;
    --chc-font-weight: 400;
    --chc-divider: #ebeef2;
    --chc-focus-ring: rgba(83, 58, 253, 0.2);
    --chc-motion-fast: 150ms;
    --chc-motion-base: 220ms;
    --chc-motion-slow: 260ms;
    --chc-motion-sheet: 300ms;
    --chc-motion-provider: 300ms;
    --chc-ease-standard: cubic-bezier(0.2, 0, 0, 1);
    --chc-ease-emphasized: cubic-bezier(0.16, 1, 0.3, 1);
    --chc-spinner-duration: 900ms;
    --chc-shell-padding: 0;
    display: block;
    color: var(--chc-text);
    font-family: var(--chc-font-family);
    font-size: 1rem;
    font-weight: var(--chc-font-weight);
  }

  .widget-frame {
    width: fit-content;
    position: relative;
    display: inline-grid;
    border-radius: 0.5rem;
    vertical-align: top;
  }

  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  .screen-reader-status {
    width: 0.0625rem;
    height: 0.0625rem;
    position: absolute;
    overflow: hidden;
    clip: rect(0 0 0 0);
    white-space: nowrap;
  }

  .widget-close,
  .widget-back-button,
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
    display: grid;
    grid-template-rows: auto minmax(0, 1fr) auto;
    position: relative;
    padding: var(--chc-shell-padding);
    overflow: hidden;
    border: 0.0625rem solid var(--chc-border);
    border-radius: 0.5rem;
    background: var(--chc-widget-background);
    text-align: left;
    animation: chc-shell-enter var(--chc-motion-base) var(--chc-ease-emphasized)
      both;
  }

  .widget-shell-dialog {
    width: min(24.125rem, calc(100vw - 1.5rem));
    height: min(35.25rem, calc(100dvh - 1.5rem));
    min-height: 20rem;
    box-shadow: 0 1.5rem 5rem
      color-mix(in srgb, var(--chc-text) 10%, transparent);
  }

  :host([presentation-mode='embedded']) {
    container-type: inline-size;
    width: 100%;
    max-width: 100%;
    min-width: 0;
    height: 100%;
  }

  :host([presentation-mode='embedded']) .widget-frame {
    width: 100%;
    height: 100%;
    display: grid;
  }

  .embedded-add-payment-dialog-backdrop {
    position: fixed;
    inset: 0;
    z-index: 1000;
    display: grid;
    place-items: center;
    padding: 0.75rem;
    background: color-mix(in srgb, var(--chc-text) 45%, transparent);
  }

  .embedded-add-payment-dialog-content {
    position: relative;
    max-width: 100%;
    max-height: 100%;
  }

  .embedded-add-payment-dialog-close {
    width: 2rem;
    height: 2rem;
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    z-index: 1;
    border: 0;
    padding: 0;
    background: transparent;
    color: var(--chc-muted);
    font: inherit;
    font-size: 1.25rem;
    cursor: pointer;
  }

  .embedded-add-payment-dialog-close:disabled {
    cursor: default;
    opacity: 0.5;
  }

  .widget-shell-embedded {
    width: 100%;
    height: 100%;
    min-height: 0;
    border: 0;
    box-shadow: none;
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
    font-size: 1.0625rem;
    font-weight: 600;
    letter-spacing: -0.01em;
  }

  .widget-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.625rem;
    padding: 0.875rem;
    border-bottom: 0.0625rem solid var(--chc-border);
  }

  .widget-heading {
    min-width: 0;
  }

  .widget-heading-row {
    min-width: 0;
    flex: 1 1 auto;
    display: flex;
    align-items: flex-start;
    gap: 0.25rem;
  }

  .widget-title-action {
    flex: 0 0 auto;
    align-self: center;
    margin-left: auto;
  }

  .widget-title-action .text-link-button {
    min-height: 2.75rem;
    display: inline-flex;
    align-items: center;
  }

  .widget-header:has(.widget-back-button) {
    padding-left: 0;
  }

  .widget-back-button {
    width: 2.75rem;
    height: 2.75rem;
    flex: 0 0 auto;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    margin: -0.5rem 0;
    border: 0;
    border-radius: 999rem;
    background: transparent;
    color: var(--chc-text);
    cursor: pointer;
    touch-action: manipulation;
  }

  .widget-back-button:hover:not(:disabled) {
    background: var(--chc-soft-surface);
  }

  .widget-back-button:focus-visible {
    outline: 0.125rem solid var(--chc-focus-ring);
    outline-offset: 0.125rem;
  }

  .widget-back-button:disabled {
    color: var(--chc-disabled-text);
    cursor: not-allowed;
  }

  .widget-back-icon {
    width: 1.25rem;
    height: 1.25rem;
    fill: currentColor;
    stroke: none;
  }

  .widget-header-action {
    flex: 0 0 auto;
  }

  .widget-header-action .text-link-button {
    color: var(--chc-primary);
    font-weight: inherit;
  }

  .widget-subtitle {
    margin: 0.25rem 0 0;
    color: var(--chc-copy);
    font-weight: inherit;
    font-size: 0.9375em;
    text-align: left;
  }

  .widget-divider {
    height: 0.0625rem;
    margin-top: 1rem;
    background: var(--chc-divider);
  }

  .widget-content {
    min-height: 0;
    margin: 0;
    padding: 0.75rem 0.875rem;
    overflow: auto;
    overscroll-behavior: contain;
  }

  .widget-action-footer {
    display: grid;
    gap: 0.5rem;
    padding: 0.75rem 0.875rem;
    border-top: 0.0625rem solid var(--chc-border);
    background: var(--chc-surface);
  }

  .payment-method-add-footer {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(10rem, 1fr));
    gap: 0.5rem;
  }

  .payment-method-add-footer
    .button-secondary[data-action='open-add-payment-source']:not(:disabled) {
    border-color: var(--chc-primary);
    background: var(--chc-surface);
    color: var(--chc-primary);
  }

  .embedded-payment-select-region {
    width: 100%;
    position: relative;
  }

  .embedded-payment-select {
    appearance: none;
    width: 100%;
    min-height: var(--chc-input-height);
    border: 0.0625rem solid var(--chc-border);
    border-radius: var(--chc-radius-control);
    padding: 0 2.5rem 0 0.75rem;
    background-color: var(--chc-surface);
    background-image:
      linear-gradient(45deg, transparent 50%, var(--chc-copy) 50%),
      linear-gradient(135deg, var(--chc-copy) 50%, transparent 50%);
    background-position:
      calc(100% - 1rem) 50%,
      calc(100% - 0.75rem) 50%;
    background-repeat: no-repeat;
    background-size: 0.25rem 0.25rem;
    color: var(--chc-text);
    font: inherit;
  }

  .embedded-payment-select:focus-visible {
    border-color: var(--chc-primary);
    outline: 0.1875rem solid var(--chc-focus-ring);
    outline-offset: 0.0625rem;
  }

  .embedded-payment-select:disabled {
    color: var(--chc-muted);
    cursor: wait;
  }

  .embedded-attach-progress {
    min-width: 0;
    flex: 1 1 auto;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.625rem;
    color: var(--chc-text);
    font-size: 0.8125rem;
    font-weight: 600;
  }

  .embedded-attach-progress-overlay {
    position: absolute;
    inset: 0;
    border: 0.0625rem solid var(--chc-border);
    border-radius: var(--chc-radius-control);
    background: color-mix(in srgb, var(--chc-surface) 94%, var(--chc-primary));
    pointer-events: none;
  }

  .embedded-attach-spinner {
    width: 1rem;
    height: 1rem;
    flex: 0 0 auto;
    border: 0.125rem solid
      color-mix(in srgb, var(--chc-primary) 22%, var(--chc-border));
    border-right-color: var(--chc-primary);
    border-radius: 50%;
    animation: chc-spinner-rotate var(--chc-spinner-duration) linear infinite;
  }

  .embedded-payment-radio-trigger[aria-busy='true'] {
    border-color: color-mix(in srgb, var(--chc-primary) 42%, var(--chc-border));
    background: color-mix(in srgb, var(--chc-surface) 96%, var(--chc-primary));
    cursor: wait;
  }

  .embedded-payment-radio-list {
    position: relative;
    width: 100%;
    overflow: visible;
  }

  .embedded-payment-radio-trigger {
    width: 100%;
    min-height: 3rem;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    border: 0.0625rem solid var(--chc-border);
    border-radius: var(--chc-radius-control);
    padding: 0.5rem 0.75rem;
    background: var(--chc-surface);
    color: var(--chc-text);
    font: inherit;
    text-align: left;
    cursor: pointer;
  }

  .embedded-payment-radio-trigger:focus-visible {
    border-color: var(--chc-primary);
    outline: 0.1875rem solid var(--chc-focus-ring);
    outline-offset: 0.0625rem;
  }

  .embedded-payment-radio-trigger[aria-expanded='true']
    .embedded-payment-radio-chevron {
    transform: rotate(180deg);
  }

  .embedded-payment-radio-popup {
    position: absolute;
    z-index: 50;
    top: calc(100% + 0.375rem);
    right: 0;
    left: 0;
    overflow: hidden;
    border: 0.0625rem solid var(--chc-border);
    border-radius: var(--chc-radius-control);
    background: var(--chc-surface);
    box-shadow: 0 0.75rem 2rem
      color-mix(in srgb, var(--chc-text) 16%, transparent);
  }

  .embedded-payment-radio-scroll {
    max-height: 11.625rem;
    overflow-y: auto;
    overscroll-behavior: contain;
  }

  .embedded-payment-radio-option {
    width: 100%;
    min-width: 0;
    min-height: 3.875rem;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    border: 0;
    border-bottom: 0.0625rem solid var(--chc-border);
    padding: 0.625rem 0.75rem;
    background: var(--chc-payment-method-background);
    color: var(--chc-text);
    font: inherit;
    text-align: left;
    cursor: pointer;
  }

  .embedded-payment-radio-option:last-child {
    border-bottom: 0;
  }

  .embedded-payment-radio-option[aria-selected='true'] {
    background: var(--chc-payment-selection-background);
  }

  .embedded-payment-radio-option:focus-visible {
    position: relative;
    z-index: 1;
    outline: 0.125rem solid var(--chc-focus-ring);
    outline-offset: -0.125rem;
  }

  .embedded-payment-radio-option:disabled {
    cursor: not-allowed;
    opacity: 0.7;
  }

  .embedded-payment-radio-indicator {
    width: 1rem;
    height: 1rem;
    flex: 0 0 auto;
    border: 0.125rem solid var(--chc-border-strong);
    border-radius: 50%;
    background: var(--chc-surface);
  }

  .embedded-payment-radio-option[aria-selected='true']
    .embedded-payment-radio-indicator {
    border: 0.3125rem solid var(--chc-primary);
  }

  .embedded-payment-radio-icon,
  .embedded-payment-radio-add-icon {
    width: 2.375rem;
    height: 1.875rem;
    flex: 0 0 auto;
    object-fit: contain;
    border-radius: 0.375rem;
  }

  .embedded-payment-radio-add-icon {
    display: grid;
    place-items: center;
    border: 0.0625rem dashed var(--chc-primary);
    background: color-mix(in srgb, var(--chc-primary) 6%, var(--chc-surface));
    color: var(--chc-primary);
    font-size: 1.25rem;
  }

  .embedded-payment-radio-copy {
    min-width: 0;
    flex: 1 1 auto;
    display: grid;
    gap: 0.125rem;
  }

  .embedded-payment-radio-copy strong,
  .embedded-payment-radio-copy span {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .embedded-payment-radio-copy strong {
    font-size: 0.875rem;
    font-weight: 600;
  }

  .embedded-payment-radio-copy span {
    color: var(--chc-copy);
    font-size: 0.75rem;
  }

  .embedded-payment-radio-chevron {
    color: var(--chc-muted);
    font-size: 1.25rem;
    transition: transform var(--chc-motion-fast) var(--chc-ease-standard);
  }

  .embedded-payment-radio-empty {
    min-height: 3.875rem;
    display: flex;
    align-items: center;
    padding: 0.75rem;
    border-bottom: 0.0625rem solid var(--chc-border);
    color: var(--chc-copy);
    font-size: 0.875rem;
  }

  .payment-method-radio {
    width: 1.125rem;
    height: 1.125rem;
    margin: 0;
    display: grid;
    appearance: none;
    place-items: center;
    border: 0.0625rem solid var(--chc-border);
    border-radius: 999rem;
    background: var(--chc-surface);
    cursor: pointer;
  }

  .payment-method-radio::before {
    content: '';
    width: 0.5rem;
    height: 0.5rem;
    border-radius: 999rem;
    background: var(--chc-primary);
    opacity: 0;
    transform: scale(0.65);
    transition: opacity var(--chc-motion-fast) var(--chc-ease-emphasized),
      transform var(--chc-motion-fast) var(--chc-ease-emphasized);
  }

  .payment-method-radio:checked {
    border-color: var(--chc-primary);
  }

  .payment-method-radio:checked::before {
    opacity: 1;
    transform: scale(1);
  }

  .payment-method-row-radio:has(.payment-method-radio:focus-visible) {
    outline: 0.1875rem solid var(--chc-focus-ring);
    outline-offset: 0.0625rem;
  }

  .widget-toolbar {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 0.625rem;
  }

  .widget-toolbar .text-link-button,
  .widget-header-action > .text-link-button {
    min-height: 2rem;
    border: 0.0625rem solid var(--chc-border);
    border-radius: var(--chc-radius-control);
    padding: 0 0.625rem;
    background: var(--chc-surface);
    color: var(--chc-text);
    font-size: 0.8125rem;
    font-weight: 600;
  }

  .widget-shell-payment-methods .widget-header {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    gap: 0.625rem;
  }

  .widget-shell-payment-methods .widget-title {
    font-size: 1.375rem;
    letter-spacing: -0.02em;
  }

  .widget-shell-payment-methods .widget-heading-row {
    width: 100%;
    align-items: center;
  }

  .widget-shell-payment-methods .widget-header-action,
  .widget-shell-payment-methods .widget-toolbar {
    width: 100%;
  }

  .payment-method-toolbar-skeleton {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 0.5rem;
  }

  .payment-method-toolbar-skeleton span {
    min-height: 2.25rem;
    display: block;
    border-radius: var(--chc-radius-control);
    background: var(--chc-border);
    animation: chc-skeleton-shimmer var(--chc-motion-provider)
      var(--chc-ease-standard) infinite alternate;
  }

  .widget-shell-payment-methods .widget-toolbar {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(0, 1fr));
    gap: 0.5rem;
  }

  .widget-shell-payment-methods .widget-toolbar .text-link-button {
    width: 100%;
    min-height: 2.25rem;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0 0.75rem;
    letter-spacing: 0.02em;
  }

  .widget-shell-payment-methods .widget-toolbar .text-link-button-primary {
    border-color: var(--chc-primary);
    background: var(--chc-primary);
    color: #fff;
  }

  .text-link-button-icon {
    width: 1rem;
    height: 1rem;
    position: relative;
    display: inline-flex;
    flex: 0 0 auto;
    align-items: center;
    justify-content: center;
  }

  .text-link-button-icon-add::before,
  .text-link-button-icon-add::after {
    content: '';
    width: 0.6875rem;
    height: 0.09375rem;
    position: absolute;
    border-radius: 999rem;
    background: currentColor;
  }

  .text-link-button-icon-add::after {
    transform: rotate(90deg);
  }

  .text-link-button-icon-edit {
    fill: currentColor;
  }

  .text-link-button-icon-transfer::before,
  .text-link-button-icon-transfer::after {
    content: '→';
    position: absolute;
    font-size: 0.875rem;
    font-weight: 600;
  }

  .text-link-button-icon-transfer::after {
    content: '←';
    transform: translateY(0.3125rem);
  }

  .widget-shell-payment-methods .widget-content {
    overflow: hidden;
  }

  .widget-shell-payment-methods .widget-content > .payment-flow,
  .widget-shell-payment-methods .widget-content .primitive-stack {
    min-height: 0;
    height: 100%;
  }

  .widget-shell-payment-methods .widget-content > .payment-flow {
    display: grid;
    align-content: start;
  }

  .widget-shell-payment-methods .payment-method-skeletons {
    align-content: start;
  }

  .widget-shell-payment-methods .widget-content .primitive-stack {
    position: relative;
    display: grid;
    gap: 0.0625rem;
    padding: 0.5rem 0 3rem;
    overflow: auto;
    overscroll-behavior: contain;
    isolation: isolate;
    scroll-padding-bottom: 3rem;
    -webkit-mask-image: linear-gradient(
      to bottom,
      #000 0,
      #000 calc(100% - 1.5rem),
      rgba(0, 0, 0, 0.55) 100%
    );
    mask-image: linear-gradient(
      to bottom,
      #000 0,
      #000 calc(100% - 1.5rem),
      rgba(0, 0, 0, 0.55) 100%
    );
    -webkit-mask-repeat: no-repeat;
    mask-repeat: no-repeat;
  }

  .widget-shell-payment-methods
    .widget-content
    .primitive-stack.primitive-stack-menu-open {
    padding-bottom: 6.5rem;
    -webkit-mask: none;
    mask: none;
    -webkit-mask-image: none;
    mask-image: none;
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
    position: sticky;
    bottom: -0.75rem;
    z-index: 1;
    display: grid;
    gap: 0.625rem;
    margin-top: 0.875rem;
    margin-right: -0.875rem;
    margin-left: -0.875rem;
    padding: 0.625rem 0.875rem 0.75rem;
    border-top: 0.0625rem solid var(--chc-border);
    background: var(--chc-surface);
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
    gap: 0;
    margin-top: 0;
    overflow: hidden;
    border: 0.0625rem solid var(--chc-border);
    border-radius: var(--chc-radius-card);
    background: #fff;
    justify-items: stretch;
  }

  .otp-flow,
  .payment-flow,
  .required-info-flow {
    display: grid;
    gap: 0.75rem;
    margin: 0;
    border: 0;
    padding: 0;
  }

  .required-info-card {
    display: grid;
    gap: 0.75rem;
    min-height: 9.75rem;
    border-radius: min(1rem, calc(var(--chc-radius-card) * 1.5));
    border: 0.0625rem solid var(--chc-border);
    padding: 1rem;
    background: color-mix(in srgb, var(--chc-primary) 6%, var(--chc-surface));
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
    background: color-mix(in srgb, var(--chc-primary) 6%, var(--chc-surface));
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
    font-size: 0.8125rem;
    font-weight: 600;
    letter-spacing: 0.02em;
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

  .button-icon-plus {
    width: 1.5em;
    height: 1.5em;
    flex: 0 0 auto;
    fill: currentColor;
  }

  .button-content:has(.button-icon-plus) {
    gap: 0.375rem;
  }

  .button-content:has(.button-icon-plus) .button-label {
    white-space: nowrap;
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
    color: var(--chc-button-text);
  }

  .widget-action-footer .button {
    min-height: 2.5rem;
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
    color: var(--chc-copy);
    font-weight: 600;
    font-size: 0.75rem;
    letter-spacing: 0.02em;
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
    border: 0.0625rem solid var(--chc-border-strong);
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

  .field-input:-webkit-autofill,
  .field-input:-webkit-autofill:hover {
    -webkit-text-fill-color: var(--chc-text);
    caret-color: var(--chc-text);
    box-shadow: 0 0 0 1000px var(--chc-surface) inset;
  }

  .field-input:-webkit-autofill:focus {
    -webkit-text-fill-color: var(--chc-text);
    caret-color: var(--chc-text);
    box-shadow: 0 0 0 1000px var(--chc-surface) inset,
      0 0 0 0.25rem var(--chc-focus-ring);
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
    border: 0.0625rem solid var(--chc-border-strong);
    border-radius: var(--chc-radius-control);
    background: var(--chc-surface);
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

  .field-control-reveal {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .field-control-reveal .field-input {
    flex: 1 1 auto;
    min-width: 0;
  }

  .field-reveal-toggle {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex: 0 0 auto;
    width: 1.5rem;
    height: 1.5rem;
    margin: 0;
    padding: 0;
    border: 0;
    border-radius: var(--chc-radius-control);
    background: transparent;
    color: var(--chc-muted);
    cursor: pointer;
    transition: color var(--chc-motion-fast) var(--chc-ease-standard);
  }

  .field-reveal-toggle:hover {
    color: var(--chc-text);
  }

  .field-reveal-toggle:focus-visible {
    outline: 0;
    color: var(--chc-primary);
    box-shadow: 0 0 0 0.1875rem var(--chc-focus-ring);
  }

  .field-reveal-toggle:disabled {
    color: var(--chc-muted);
    cursor: not-allowed;
    opacity: 0.6;
  }

  .field-reveal-icon {
    width: 1.125rem;
    height: 1.125rem;
    fill: currentColor;
  }

  .field-input-mask-wrap {
    position: relative;
    display: flex;
    align-items: center;
    flex: 1 1 auto;
    min-width: 0;
  }

  .field-input-mask-wrap .field-input {
    flex: 1 1 auto;
    min-width: 0;
    /* Monospace keeps digit and bullet advances equal so the (transparent)
       caret stays aligned with the visible overlay characters. */
    font-family: ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas,
      'Liberation Mono', monospace;
    letter-spacing: 0;
  }

  .field-input-mask-hidden {
    color: transparent;
    caret-color: var(--chc-text);
  }

  .field-input-mask-hidden::selection {
    color: transparent;
  }

  .field-input-mask-wrap .field-input-mask-hidden:-webkit-autofill,
  .field-input-mask-wrap .field-input-mask-hidden:-webkit-autofill:hover,
  .field-input-mask-wrap .field-input-mask-hidden:-webkit-autofill:focus {
    -webkit-text-fill-color: transparent;
  }

  .field-input-mask-overlay {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    pointer-events: none;
    font: inherit;
    font-family: ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas,
      'Liberation Mono', monospace;
    letter-spacing: 0;
    color: var(--chc-text);
    white-space: pre;
    overflow: hidden;
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

  .field-card-form .field-input:-webkit-autofill,
  .field-card-form .field-input:-webkit-autofill:hover,
  .field-card-form .field-input:-webkit-autofill:focus {
    -webkit-text-fill-color: var(--chc-text);
    caret-color: var(--chc-text);
    box-shadow: 0 0 0 1000px var(--chc-surface) inset;
  }

  .field-card-form
    .field-input-mask-wrap
    .field-input-mask-hidden:-webkit-autofill,
  .field-card-form
    .field-input-mask-wrap
    .field-input-mask-hidden:-webkit-autofill:hover,
  .field-card-form
    .field-input-mask-wrap
    .field-input-mask-hidden:-webkit-autofill:focus {
    -webkit-text-fill-color: transparent;
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
    align-items: start;
    gap: 0.875rem;
  }

  .card-form-screen .form-grid {
    gap: 0.875rem;
  }

  .bank-account-jsonforms .jsonforms-layout-vertical {
    display: grid;
    gap: 0.75rem;
  }

  .bank-account-jsonforms .jsonforms-control {
    display: grid;
    gap: 0.1875rem;
  }

  .bank-account-jsonforms .jsonforms-control label {
    color: var(--chc-copy);
    font-weight: inherit;
  }

  .bank-account-jsonforms .jsonforms-control input,
  .bank-account-jsonforms .jsonforms-control select {
    box-sizing: border-box;
    width: 100%;
    min-height: var(--chc-input-height);
    border: 0.0625rem solid var(--chc-border-strong);
    border-radius: var(--chc-radius-control);
    padding: 0.625rem 0.75rem;
    background: color-mix(
      in srgb,
      var(--chc-soft-surface) 82%,
      var(--chc-surface)
    );
    color: var(--chc-text);
    font-family: inherit;
    font-size: inherit;
    font-style: inherit;
    font-weight: inherit;
    transition: border-color var(--chc-motion-fast) var(--chc-ease-standard),
      box-shadow var(--chc-motion-fast) var(--chc-ease-standard),
      background-color var(--chc-motion-fast) var(--chc-ease-standard);
  }

  .bank-account-jsonforms .jsonforms-select-control {
    position: relative;
  }

  .bank-account-jsonforms .jsonforms-select-control::after {
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

  .bank-account-jsonforms .jsonforms-select-control select {
    appearance: none;
    padding-right: 2.5rem;
  }

  .bank-account-jsonforms .jsonforms-control input:focus,
  .bank-account-jsonforms .jsonforms-control select:focus {
    border-color: var(--chc-primary);
    outline: 0;
    background: var(--chc-surface);
    box-shadow: 0 0 0 0.25rem var(--chc-focus-ring);
  }

  .bank-account-jsonforms .jsonforms-control input:-webkit-autofill,
  .bank-account-jsonforms .jsonforms-control input:-webkit-autofill:hover,
  .bank-account-jsonforms .jsonforms-control select:-webkit-autofill,
  .bank-account-jsonforms .jsonforms-control select:-webkit-autofill:hover {
    -webkit-text-fill-color: var(--chc-text);
    caret-color: var(--chc-text);
    box-shadow: 0 0 0 1000px
      color-mix(in srgb, var(--chc-soft-surface) 82%, var(--chc-surface)) inset;
  }

  .bank-account-jsonforms .jsonforms-control input:-webkit-autofill:focus,
  .bank-account-jsonforms .jsonforms-control select:-webkit-autofill:focus {
    -webkit-text-fill-color: var(--chc-text);
    caret-color: var(--chc-text);
    box-shadow: 0 0 0 1000px var(--chc-surface) inset,
      0 0 0 0.25rem var(--chc-focus-ring);
  }

  .bank-account-jsonforms .jsonforms-control input:disabled,
  .bank-account-jsonforms .jsonforms-control select:disabled {
    border-color: var(--chc-border);
    background: color-mix(
      in srgb,
      var(--chc-soft-surface) 85%,
      var(--chc-border-strong)
    );
    color: var(--chc-muted);
    cursor: not-allowed;
    opacity: 1;
  }

  .bank-account-jsonforms
    .jsonforms-control
    :is(input, select)[aria-invalid='true'] {
    border-color: var(--chc-danger);
  }

  .bank-account-jsonforms .jsonforms-mask-control {
    box-sizing: border-box;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    min-height: var(--chc-input-height);
    padding: 0.625rem 0.75rem;
    border: 0.0625rem solid var(--chc-border-strong);
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

  .bank-account-jsonforms .jsonforms-mask-control:focus-within {
    border-color: var(--chc-primary);
    background: var(--chc-surface);
    box-shadow: 0 0 0 0.25rem var(--chc-focus-ring);
  }

  .bank-account-jsonforms .jsonforms-mask-wrap {
    position: relative;
    display: flex;
    align-items: center;
    flex: 1 1 auto;
    min-width: 0;
  }

  .bank-account-jsonforms .jsonforms-control input.jsonforms-mask-input {
    width: 100%;
    min-height: 0;
    border: 0;
    border-radius: 0;
    padding: 0;
    background: transparent;
    box-shadow: none;
    font-family: ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas,
      'Liberation Mono', monospace;
    letter-spacing: 0;
  }

  .bank-account-jsonforms .jsonforms-control input.jsonforms-mask-input:focus {
    border: 0;
    box-shadow: none;
    background: transparent;
  }

  .bank-account-jsonforms
    .jsonforms-control
    input.jsonforms-mask-input:-webkit-autofill,
  .bank-account-jsonforms
    .jsonforms-control
    input.jsonforms-mask-input:-webkit-autofill:hover,
  .bank-account-jsonforms
    .jsonforms-control
    input.jsonforms-mask-input:-webkit-autofill:focus {
    box-shadow: 0 0 0 1000px
      color-mix(in srgb, var(--chc-soft-surface) 82%, var(--chc-surface)) inset;
  }

  .bank-account-jsonforms
    .jsonforms-control
    input.jsonforms-mask-input.field-input-mask-hidden {
    color: transparent;
    caret-color: var(--chc-text);
  }

  .bank-account-jsonforms
    .jsonforms-control
    input.jsonforms-mask-input.field-input-mask-hidden:-webkit-autofill,
  .bank-account-jsonforms
    .jsonforms-control
    input.jsonforms-mask-input.field-input-mask-hidden:-webkit-autofill:hover,
  .bank-account-jsonforms
    .jsonforms-control
    input.jsonforms-mask-input.field-input-mask-hidden:-webkit-autofill:focus {
    -webkit-text-fill-color: transparent;
  }

  .bank-account-jsonforms .jsonforms-mask-overlay {
    position: absolute;
    inset: 0;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    pointer-events: none;
    font-family: ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas,
      'Liberation Mono', monospace;
    font-size: inherit;
    letter-spacing: 0;
    color: var(--chc-text);
    white-space: pre;
    overflow: hidden;
  }

  .bank-account-jsonforms .jsonforms-description {
    color: var(--chc-muted);
    font-size: 0.875em;
  }

  .bank-account-jsonforms .jsonforms-error {
    color: var(--chc-danger);
    font-size: 0.875em;
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
    border: 0.0625rem solid var(--chc-border-strong);
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
    gap: 0.625rem;
    align-items: center;
    border-radius: var(--chc-radius-card);
    padding: 0.5625rem;
    background: var(--chc-payment-method-background);
    color: var(--chc-text);
    text-align: left;
    border: 0.0625rem solid transparent;
  }

  .payment-method-row {
    position: relative;
    grid-template-columns: minmax(0, 1fr);
    row-gap: 0.625rem;
    column-gap: 0.5rem;
  }

  .payment-method-row-featured-informational {
    margin-bottom: 0.75rem;
  }

  .payment-method-row-featured-informational::after {
    content: '';
    position: absolute;
    right: 0.5625rem;
    bottom: -0.4375rem;
    left: 0.5625rem;
    height: 0.0625rem;
    background: var(--chc-border);
  }

  .payment-method-row-has-overflow {
    grid-template-columns: minmax(0, 1fr) auto;
  }

  .payment-method-row-has-affordance:not(.payment-method-row-has-overflow) {
    grid-template-columns: minmax(0, 1fr) auto;
  }

  .payment-method-row-has-overflow.payment-method-row-has-affordance {
    grid-template-columns: minmax(0, 1fr) auto auto;
    column-gap: 0.1875rem;
  }

  .payment-method-row-has-overflow-without-affordance {
    grid-template-columns: minmax(0, 1fr) auto 1rem;
    column-gap: 0.1875rem;
  }

  .payment-method-row-menu-open {
    z-index: 5;
  }

  .selected-payment-method {
    grid-template-columns: 2.375rem minmax(0, 1fr) auto;
  }

  .payment-method-row-main {
    min-width: 0;
    display: grid;
    grid-template-columns: 2.375rem minmax(0, 1fr) auto;
    gap: 0.625rem;
    align-items: center;
    border: 0;
    padding: 0;
    background: transparent;
    color: inherit;
    font-family: inherit;
    font-style: inherit;
    font-size: inherit;
    font-weight: inherit;
    text-align: left;
  }

  .payment-method-row-main-radio {
    grid-template-columns: 2.375rem minmax(0, 1fr) auto;
  }

  .payment-method-row-main-action {
    cursor: pointer;
  }

  .payment-method-row-main-action:focus-visible {
    outline: 0;
  }

  .payment-method-row-action {
    transition: border-color var(--chc-motion-base) var(--chc-ease-standard),
      background-color var(--chc-motion-base) var(--chc-ease-standard),
      box-shadow var(--chc-motion-base) var(--chc-ease-standard),
      transform var(--chc-motion-fast) var(--chc-ease-standard);
    cursor: pointer;
  }

  .payment-method-row-edit {
    grid-template-columns: minmax(0, 1fr) auto;
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

  .payment-method-row-selected {
    border-color: var(--chc-primary);
    background: var(--chc-soft-surface);
    box-shadow: 0 0 0 0.0625rem
      color-mix(in srgb, var(--chc-primary) 12%, transparent);
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

  .payment-flow .selected-payment-method {
    min-height: 15rem;
    grid-template-columns: 1fr;
    justify-items: center;
    align-content: center;
    text-align: center;
  }

  .payment-flow .selected-payment-method .payment-method-icon-chip {
    width: 3.25rem;
    height: 3.25rem;
  }

  .payment-flow .selected-payment-method .payment-method-icon-image {
    width: 2rem;
    height: 2rem;
  }

  .payment-flow .selected-payment-method .payment-method-copy {
    justify-items: center;
  }

  .payment-method-row-action:hover:not(:disabled),
  .payment-method-row-action:focus-visible {
    border-color: var(--chc-border);
    background: var(--chc-soft-surface);
    transform: translateY(-0.0625rem);
  }

  .payment-method-row-action:focus-visible {
    outline: 0;
  }

  .payment-method-row-action:has(
      .payment-method-row-main-action:focus-visible
    ) {
    border-color: var(--chc-border);
    background: var(--chc-soft-surface);
    outline: 0.125rem solid var(--chc-focus-ring);
    outline-offset: 0.125rem;
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

  .payment-method-overflow {
    position: relative;
    display: grid;
    align-items: center;
    align-self: stretch;
    gap: 0.375rem;
    justify-self: end;
  }

  .payment-method-row-affordance {
    min-width: 1rem;
    min-height: 1rem;
    display: inline-flex;
    align-items: center;
    justify-content: flex-end;
    align-self: stretch;
    justify-self: end;
  }

  .payment-method-row-affordance-radio {
    min-width: 1.125rem;
    min-height: 2.5rem;
  }

  .payment-method-overflow-button {
    width: 2.5rem;
    min-width: 2.5rem;
    height: 2.5rem;
    min-height: 2.5rem;
    display: inline-grid;
    place-items: center;
    border: 0;
    border-radius: 0.75rem;
    padding: 0;
    background: transparent;
    color: var(--chc-copy);
    cursor: pointer;
    touch-action: manipulation;
  }

  .payment-method-overflow-button svg {
    width: 1.25rem;
    height: 1.25rem;
    fill: currentColor;
  }

  .payment-method-overflow-button:hover:not(:disabled),
  .payment-method-overflow-button:focus-visible,
  .payment-method-menu button:hover:not(:disabled),
  .payment-method-menu button:focus-visible {
    background: var(--chc-soft-surface);
  }

  .payment-method-overflow-button:focus-visible,
  .payment-method-menu button:focus-visible {
    outline: 0.125rem solid var(--chc-focus-ring);
    outline-offset: 0.125rem;
  }

  .payment-method-overflow-button:disabled,
  .payment-method-menu button:disabled {
    color: var(--chc-muted);
    cursor: not-allowed;
  }

  .payment-method-menu {
    position: absolute;
    z-index: 4;
    top: calc(100% + 0.25rem);
    right: 0;
    min-width: 10rem;
    display: grid;
    gap: 0.125rem;
    border: 0.0625rem solid var(--chc-border);
    border-radius: 0.75rem;
    padding: 0.375rem;
    background: var(--chc-surface);
    box-shadow: 0 0.625rem 1.5rem rgba(16, 24, 40, 0.16);
  }

  .payment-method-menu-above {
    top: auto;
    bottom: calc(100% + 0.25rem);
  }

  .payment-method-menu button {
    min-height: 2.5rem;
    border: 0;
    border-radius: 0.5rem;
    padding: 0 0.75rem;
    background: transparent;
    color: var(--chc-text);
    font-family: inherit;
    font-style: inherit;
    font-size: inherit;
    font-weight: inherit;
    text-align: left;
    cursor: pointer;
  }

  .payment-method-default-label {
    flex: 0 0 auto;
    margin-left: auto;
    min-height: 1.375rem;
    display: inline-flex;
    align-items: center;
    border: 0.0625rem solid
      color-mix(in srgb, var(--chc-primary) 28%, transparent);
    border-radius: 999rem;
    padding: 0.125rem 0.5rem;
    background: color-mix(in srgb, var(--chc-primary) 8%, white);
    color: var(--chc-primary);
    font-size: 0.6875rem;
    font-weight: 600;
    white-space: nowrap;
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

  .payment-method-meta-row > .payment-method-balance,
  .payment-method-meta-row > .payment-method-balance-loading {
    flex: 0 0 auto;
    margin-left: 0.375rem;
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

  .payment-method-delete-confirm-button {
    width: 2.5rem;
    min-width: 2.5rem;
    height: 2.5rem;
    min-height: 2.5rem;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: 0.0625rem solid var(--chc-border-strong);
    border-radius: 0.625rem;
    padding: 0;
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

  .payment-method-delete-action-icon {
    width: 1.125rem;
    height: 1.125rem;
    fill: currentColor;
  }

  .payment-method-icon-chip {
    width: 2.375rem;
    height: 2.375rem;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    border: 0.0625rem solid var(--chc-border);
    border-radius: var(--chc-radius-card);
    background: var(--chc-soft-surface);
    color: var(--chc-text);
  }

  .payment-method-icon-image {
    width: 1.375rem;
    height: 1.375rem;
    display: block;
    object-fit: contain;
  }

  .payment-method-copy {
    display: grid;
    gap: 0.125rem;
    min-width: 0;
  }

  .payment-method-title {
    min-width: 0;
    display: block;
    overflow: hidden;
    color: var(--chc-text);
    font-size: 0.875rem;
    font-weight: 600;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .payment-method-title-row {
    min-width: 0;
    display: flex;
    align-items: center;
    gap: 0.4375rem;
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
    font-size: 0.8125rem;
    font-weight: 400;
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
    border: 0.0625rem solid transparent;
    flex: 0 0 auto;
    border-radius: var(--chc-radius-control);
    padding: 0.0625rem 0.4375rem;
    background: color-mix(in srgb, var(--chc-soft-surface) 85%, white);
    color: var(--chc-text);
    font-size: 0.575rem;
    font-weight: 400;
    letter-spacing: 0.005em;
  }

  .verification-status-label {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .verification-status-badge-success {
    border-color: var(--chc-border);
    background: var(--chc-surface);
    color: var(--chc-muted);
  }

  .verification-status-badge-warning {
    border-color: var(--chc-border);
    background: var(--chc-surface);
    color: var(--chc-muted);
  }

  .verification-status-badge-danger {
    border-color: var(--chc-border);
    background: var(--chc-surface);
    color: var(--chc-muted);
  }

  .verification-status-badge[data-verification-status='require-info'] {
    border-color: var(--chc-border);
    background: var(--chc-surface);
    color: var(--chc-muted);
  }

  .verification-status-badge[data-verification-status='not-verified'] {
    border-color: var(--chc-border);
    background: var(--chc-surface);
    color: var(--chc-muted);
  }

  .source-action {
    width: 100%;
    min-height: 4.5rem;
    display: grid;
    grid-template-columns: auto minmax(0, 1fr);
    align-items: center;
    gap: 0.75rem;
    border: 0.0625rem solid var(--chc-border);
    border-radius: var(--chc-radius-card);
    padding: 0.875rem 1rem;
    background: var(--chc-payment-method-background);
    color: var(--chc-text);
    text-align: left;
    cursor: pointer;
  }

  .source-action-card,
  .source-action-bank {
    border-width: 0.125rem;
    border-style: dashed;
    border-color: var(--chc-border-strong);
    transition: border-color var(--chc-motion-base) var(--chc-ease-standard),
      background-color var(--chc-motion-base) var(--chc-ease-standard),
      box-shadow var(--chc-motion-base) var(--chc-ease-standard);
  }

  .source-action-card:hover:not(:disabled),
  .source-action-card:focus-visible,
  .source-action-bank:hover:not(:disabled),
  .source-action-bank:focus-visible {
    border-color: var(--chc-border-strong);
    border-style: dashed;
    background: color-mix(
      in srgb,
      var(--chc-payment-method-background) 90%,
      var(--chc-soft-surface)
    );
    box-shadow: 0 0.5rem 1rem rgba(17, 24, 39, 0.04);
  }

  .source-action-card:focus-visible,
  .source-action-bank:focus-visible {
    outline: 0.125rem solid var(--chc-focus-ring);
    outline-offset: 0.125rem;
  }

  .source-action:disabled {
    background: var(--chc-payment-method-background);
    color: var(--chc-placeholder);
    cursor: not-allowed;
  }

  .source-action-branded {
    grid-template-columns: 5rem minmax(0, 1fr);
  }

  .source-action-branded,
  .source-action-branded:hover:not(:disabled),
  .source-action-branded:focus-visible,
  .source-action-branded:disabled {
    background: #fff;
  }

  .source-action-brand {
    width: 5rem;
    height: 3rem;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }

  .source-action-brand-image {
    width: 100%;
    height: 100%;
    display: block;
    object-fit: contain;
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

  .source-action-icon svg {
    width: 1.5rem;
    height: 1.5rem;
    fill: currentColor;
  }

  .source-action-card .source-action-icon,
  .source-action-bank .source-action-icon {
    font-size: 3rem;
  }

  .source-action-card .source-action-icon svg,
  .source-action-bank .source-action-icon svg {
    width: 2.5rem;
    height: 2.5rem;
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
    gap: 0.125rem;
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
    overflow: visible;
    color: var(--chc-muted);
    font-weight: inherit;
    font-size: 0.875em;
    line-height: 1.35;
    text-overflow: clip;
    white-space: normal;
    overflow-wrap: anywhere;
  }

  .source-action-chevron {
    width: 1rem;
    height: 1rem;
    display: inline-grid;
    place-items: center;
    color: var(--chc-muted);
    justify-self: end;
  }

  .source-action-chevron-icon::before {
    content: '';
    width: 0.375rem;
    height: 0.375rem;
    display: block;
    border-top: 0.09375rem solid currentColor;
    border-right: 0.09375rem solid currentColor;
    transform: rotate(45deg);
  }

  .payment-action-links .source-action {
    min-height: 4rem;
    grid-template-columns: auto minmax(0, 1fr) 1rem;
    gap: 0.75rem;
    border: 0;
    border-radius: 0;
    padding: 0.75rem 1rem;
    background: #fff;
    box-shadow: none;
  }

  .payment-action-links .source-action-branded {
    grid-template-columns: 5rem minmax(0, 1fr) 1rem;
  }

  .payment-action-links .source-action + .source-action {
    border-top: 0.0625rem solid var(--chc-border);
  }

  .payment-action-links .source-action:hover:not(:disabled),
  .payment-action-links .source-action:focus-visible {
    border-color: var(--chc-border);
    border-style: solid;
    background: color-mix(in srgb, var(--chc-soft-surface) 70%, #fff);
    box-shadow: none;
  }

  .payment-action-links .source-action:focus-visible {
    position: relative;
    z-index: 1;
    outline-offset: -0.125rem;
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

  .instrument-schema-selection {
    display: grid;
    gap: 0.875rem;
  }

  .instrument-schema-options {
    display: grid;
    gap: 0.625rem;
    margin: 0;
    border: 0;
    padding: 0;
  }

  .instrument-schema-options legend {
    margin-bottom: 0.25rem;
    padding: 0;
    color: var(--chc-muted);
    font-size: 0.875em;
  }

  .instrument-schema-option {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    min-height: 3rem;
    border: 0.0625rem solid var(--chc-border);
    border-radius: var(--chc-radius-control);
    padding: 0.75rem;
    background: var(--chc-surface);
    color: var(--chc-text);
    cursor: pointer;
  }

  .instrument-schema-option:focus-within {
    border-color: var(--chc-primary);
    box-shadow: 0 0 0 0.125rem
      color-mix(in srgb, var(--chc-primary) 20%, transparent);
  }

  .instrument-schema-option input {
    width: 1rem;
    height: 1rem;
    margin: 0;
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
    display: flex;
    background: var(--chc-soft-surface);
    overflow: hidden;
  }

  .provider-frame-container-loading,
  .provider-frame-loading ::slotted(.provider-frame-container) {
    min-height: 31.25rem;
  }

  .widget-shell-embedded .provider-frame,
  .widget-shell-embedded .provider-frame-slot {
    height: 100%;
    min-height: 0;
  }

  .widget-shell-embedded .provider-frame-container,
  .widget-shell-embedded ::slotted(.provider-frame-container),
  .widget-shell-embedded .provider-frame-container-loading,
  .widget-shell-embedded
    .provider-frame-loading
    ::slotted(.provider-frame-container) {
    height: 100%;
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

  .text-link-button:hover:not(:disabled) {
    transform: translateY(-0.0625rem);
  }

  .text-link-button:disabled {
    color: var(--chc-muted);
    cursor: not-allowed;
  }

  .text-link-button-secondary {
    gap: 0.25rem;
    border: 0.0625rem solid var(--chc-border);
    border-radius: var(--chc-radius-control);
    padding: 0 0.75rem;
    background: color-mix(
      in srgb,
      var(--chc-soft-surface) 82%,
      var(--chc-surface)
    );
    color: var(--chc-primary);
    font-size: 0.8125rem;
    font-weight: 600;
  }

  .payment-method-skeletons {
    display: grid;
    gap: 0;
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
    grid-template-columns: 2.375rem minmax(0, 1fr) 1.125rem;
    gap: 0.625rem;
    align-items: center;
    border: 0;
    border-bottom: 0.0625rem solid var(--chc-border);
    border-radius: var(--chc-radius-card);
    padding: 0.5625rem;
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
    width: 2.375rem;
    height: 2.375rem;
    border-radius: var(--chc-radius-card);
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

  @keyframes chc-shell-enter {
    from {
      opacity: 0;
      transform: translateY(0.5rem) scale(0.99);
    }

    to {
      opacity: 1;
      transform: none;
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
    .widget-shell-dialog {
      width: calc(100vw - 1rem);
      height: calc(100dvh - 1rem);
      border-radius: 0.5rem;
    }

    .widget-close {
      right: 0.375rem;
    }

    .form-grid {
      grid-template-columns: minmax(0, 1fr);
    }

    .payment-method-add-footer {
      grid-template-columns: minmax(0, 1fr);
    }

    .widget-header {
      align-items: flex-start;
      flex-direction: column;
    }

    .widget-header-action,
    .widget-toolbar {
      width: 100%;
    }

    .widget-toolbar > * {
      flex: 1 1 0;
    }

    .otp-inputs {
      width: 100%;
    }

    .payment-method-row,
    .source-action-link,
    .upload-row,
    .loading-row {
      padding-right: 0.75rem;
      padding-left: 0.75rem;
    }

    .widget-shell-dialog .provider-frame-container,
    .widget-shell-dialog ::slotted(.provider-frame-container) {
      min-height: 22.5rem;
    }

    .source-action-title,
    .source-action-link-title,
    .payment-method-title {
      white-space: normal;
    }
  }

  @container (max-width: 26.25rem) {
    .widget-shell-embedded .form-grid,
    .widget-shell-embedded .payment-method-add-footer {
      grid-template-columns: minmax(0, 1fr);
    }

    .widget-shell-embedded .widget-header {
      align-items: flex-start;
      flex-direction: column;
    }

    .widget-shell-embedded .widget-header-action,
    .widget-shell-embedded .widget-toolbar {
      width: 100%;
    }

    .widget-shell-embedded .widget-toolbar > * {
      flex: 1 1 0;
    }

    .widget-shell-embedded .payment-method-row,
    .widget-shell-embedded .source-action-link,
    .widget-shell-embedded .upload-row,
    .widget-shell-embedded .loading-row {
      padding-right: 0.75rem;
      padding-left: 0.75rem;
    }

    .widget-shell-embedded .source-action-title,
    .widget-shell-embedded .source-action-link-title,
    .widget-shell-embedded .payment-method-title {
      white-space: normal;
    }

  }

  @media (prefers-reduced-motion: reduce) {
    .widget-shell,
    .widget-close,
    .button,
    .field-input,
    .field-control-card-form,
    .payment-method-row,
    .source-action-link,
    .payment-method-delete-button,
    .payment-method-delete-confirm-button {
      transition: none;
      animation: none;
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
