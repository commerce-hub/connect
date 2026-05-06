import type { Address, PaymentSource } from '../contracts/api-models';
import type { CardDraft } from '../core/controller';
import { escapeHtml } from '../web-sdk-utils';
import {
  canSubmitCard,
  CommerceHubConnectWidgetController,
  formatBillingAddressLabel,
  formatOtpDestination,
  formatSourceBadgeLabel,
  formatSourcePrimaryLabel,
  formatSourceSecondaryLabel,
  getDefaultCardDraft,
  getMaskedCardPreview,
  getMaskedCvvPreview,
  getNewBillingAddressValue,
} from '../core/controller';

const CARD_DRAFT_FIELD_NAMES = new Set<keyof CardDraft>([
  'name',
  'fullName',
  'cardNumber',
  'expiration',
  'cvc',
  'billingAddressValue',
  'country',
  'addressLine1',
  'addressLine2',
  'city',
  'state',
  'zip',
]);

export class CommerceHubConnectWidgetRenderer {
  private readonly unsubscribe: () => void;
  private lastRenderedStepKey: string | null = null;

  constructor(
    private readonly hostElement: HTMLElement,
    private readonly controller: CommerceHubConnectWidgetController,
  ) {
    this.unsubscribe = this.controller.subscribe(() => this.render());
    this.hostElement.addEventListener('click', this.handleClick);
    this.hostElement.addEventListener('submit', this.handleSubmit);
    this.hostElement.addEventListener('input', this.handleInput);
    this.hostElement.addEventListener('change', this.handleChange);
    this.hostElement.addEventListener('blur', this.handleBlur, true);
    this.hostElement.addEventListener('keydown', this.handleKeydown);
    this.hostElement.addEventListener('paste', this.handlePaste);
    this.render();
  }

  destroy(): void {
    this.unsubscribe();
    this.hostElement.removeEventListener('click', this.handleClick);
    this.hostElement.removeEventListener('submit', this.handleSubmit);
    this.hostElement.removeEventListener('input', this.handleInput);
    this.hostElement.removeEventListener('change', this.handleChange);
    this.hostElement.removeEventListener('blur', this.handleBlur, true);
    this.hostElement.removeEventListener('keydown', this.handleKeydown);
    this.hostElement.removeEventListener('paste', this.handlePaste);
    this.hostElement.replaceChildren();
  }

  private readonly handleClick = (event: Event): void => {
    const target = event.target;
    if (!(target instanceof Element)) {
      return;
    }

    const actionElement = target.closest<HTMLElement>('[data-action]');
    if (!actionElement) {
      return;
    }

    const action = actionElement.dataset['action'];
    switch (action) {
      case 'resend-otp':
        event.preventDefault();
        void this.controller.resendCode();
        break;
      case 'otp-alternate':
        event.preventDefault();
        void this.controller.onOtpAlternateAction();
        break;
      case 'back-email':
        event.preventDefault();
        this.controller.backToEmailEntry();
        break;
      case 'add-card':
        event.preventDefault();
        this.controller.showAddCardMethod();
        break;
      case 'add-bank':
        event.preventDefault();
        this.controller.showAddBankAccountMethod();
        break;
      case 'back-payment-list':
        event.preventDefault();
        this.controller.backToPaymentList();
        break;
      case 'select-source':
        event.preventDefault();
        if (actionElement.dataset['sourceId']) {
          this.controller.selectExistingSource(actionElement.dataset['sourceId'] as string);
        }
        break;
      case 'attach-selected-source':
        event.preventDefault();
        void this.controller.attachSelectedSource();
        break;
      default:
        break;
    }
  };

  private readonly handleSubmit = (event: Event): void => {
    const target = event.target;
    if (!(target instanceof HTMLFormElement)) {
      return;
    }

    event.preventDefault();

    switch (target.dataset['form']) {
      case 'email': {
        const formData = new FormData(target);
        void this.controller.submitEmail(String(formData.get('email') ?? ''));
        break;
      }
      case 'otp': {
        const formData = new FormData(target);
        void this.controller.validateOtp(String(formData.get('otp') ?? ''));
        break;
      }
      case 'card': {
        const formData = new FormData(target);
        void this.controller.submitCard({
          ...getDefaultCardDraft(),
          name: String(formData.get('name') ?? ''),
          fullName: String(formData.get('fullName') ?? ''),
          cardNumber: String(formData.get('cardNumber') ?? ''),
          expiration: String(formData.get('expiration') ?? ''),
          cvc: String(formData.get('cvc') ?? ''),
          billingAddressValue: String(
            formData.get('billingAddressValue') ?? getNewBillingAddressValue(),
          ),
          country: String(formData.get('country') ?? 'United States'),
          addressLine1: String(formData.get('addressLine1') ?? ''),
          addressLine2: String(formData.get('addressLine2') ?? ''),
          city: String(formData.get('city') ?? ''),
          state: String(formData.get('state') ?? ''),
          zip: String(formData.get('zip') ?? ''),
        });
        break;
      }
      default:
        break;
    }
  };

  private readonly handleInput = (event: Event): void => {
    const target = event.target;
    if (!(target instanceof HTMLInputElement)) {
      return;
    }

    if (target.dataset['otpDigitIndex'] !== undefined) {
      syncOtpDigits(target);
      return;
    }

    if (isCardDraftFormControl(target)) {
      this.controller.syncCardDraftField(target.name, target.value);
      if (isSensitiveCardInput(target)) {
        updateCardSubmitAvailability(target.form, this.controller);
      }
    }
  };

  private readonly handleChange = (event: Event): void => {
    const target = event.target;
    if (!(target instanceof HTMLInputElement || target instanceof HTMLSelectElement)) {
      return;
    }

    if (!isCardDraftFormControl(target)) {
      return;
    }

    this.controller.syncCardDraftField(target.name, target.value, {
      notify: target instanceof HTMLSelectElement,
    });
    if (target instanceof HTMLInputElement && isSensitiveCardInput(target)) {
      updateCardSubmitAvailability(target.form, this.controller);
    }
  };

  private readonly handleBlur = (event: Event): void => {
    const target = event.target;
    if (!(target instanceof HTMLInputElement) || !isSensitiveCardInput(target)) {
      return;
    }

    void this.controller.encryptCardField(target.name, target.value);
  };

  private readonly handleKeydown = (event: Event): void => {
    const keyboardEvent = event as KeyboardEvent;
    const target = keyboardEvent.target;
    if (!(target instanceof HTMLInputElement) || target.dataset['otpDigitIndex'] === undefined) {
      return;
    }

    const inputs = getOtpDigitInputs(target);
    const index = Number(target.dataset['otpDigitIndex'] ?? -1);
    if (index < 0) {
      return;
    }

    if (keyboardEvent.key === 'Backspace' && !target.value && index > 0) {
      keyboardEvent.preventDefault();
      const previous = inputs[index - 1];
      previous.value = '';
      syncOtpFormValue(previous.form, inputs);
      focusOtpInput(previous);
      return;
    }

    if (keyboardEvent.key === 'ArrowLeft' && index > 0) {
      keyboardEvent.preventDefault();
      focusOtpInput(inputs[index - 1]);
      return;
    }

    if (keyboardEvent.key === 'ArrowRight' && index < inputs.length - 1) {
      keyboardEvent.preventDefault();
      focusOtpInput(inputs[index + 1]);
    }
  };

  private readonly handlePaste = (event: Event): void => {
    const clipboardEvent = event as ClipboardEvent;
    const target = clipboardEvent.target;
    if (!(target instanceof HTMLInputElement) || target.dataset['otpDigitIndex'] === undefined) {
      return;
    }

    const digits = normalizeOtpDigits(clipboardEvent.clipboardData?.getData('text') ?? '');
    if (!digits) {
      return;
    }

    clipboardEvent.preventDefault();
    const inputs = getOtpDigitInputs(target);
    const startIndex = Number(target.dataset['otpDigitIndex'] ?? 0);
    let cursor = startIndex;

    for (const digit of digits) {
      if (cursor >= inputs.length) {
        break;
      }
      inputs[cursor].value = digit;
      cursor += 1;
    }

    syncOtpFormValue(target.form, inputs);
    focusOtpInput(inputs[Math.min(cursor, inputs.length - 1)]);
  };

  private render(): void {
    const snapshot = this.controller.getSnapshot();
    applyTheme(this.hostElement, snapshot.whiteLabel);
    const stepKey = getStepRenderKey(snapshot);
    const isStepEntering =
      this.lastRenderedStepKey !== null && this.lastRenderedStepKey !== stepKey;
    this.lastRenderedStepKey = stepKey;
    const cardClass =
      snapshot.displayStep === 'payment' &&
      snapshot.paymentEntryMode === 'add' &&
      snapshot.selectedTenderType === 'CARD'
        ? ' ch-sdk-card--wide'
        : '';
    const cardBodyClass = [
      'ch-sdk-card-body',
      isStepEntering ? 'is-step-entering' : '',
      snapshot.displayStep === 'payment' && snapshot.paymentEntryMode === 'list'
        ? 'ch-sdk-card-body--payment-list'
        : '',
    ]
      .filter(Boolean)
      .join(' ');

    this.hostElement.innerHTML = `
      <section class="ch-sdk-shell">
        ${snapshot.whiteLabel.logoUrl ? `<header class="ch-sdk-header"><img src="${escapeHtml(snapshot.whiteLabel.logoUrl)}" alt="Merchant logo" class="ch-sdk-logo" /></header>` : ''}
        <div class="ch-sdk-card${cardClass}">
          <div class="${cardBodyClass}" data-step="${escapeHtml(stepKey)}">
            ${renderStatus(snapshot)}
            ${snapshot.error ? renderError(snapshot.error.message) : ''}
            ${renderStep(snapshot)}
          </div>
        </div>
      </section>
    `;

    if (
      snapshot.pendingPayByBankLaunch &&
      snapshot.displayStep === 'payment' &&
      snapshot.paymentEntryMode === 'add' &&
      snapshot.selectedTenderType === 'BANK_ACCOUNT'
    ) {
      queueMicrotask(() => {
        void this.controller.launchPayByBank(snapshot.payByBankMountId);
      });
    }
  }
}

function getStepRenderKey(
  snapshot: ReturnType<CommerceHubConnectWidgetController['getSnapshot']>,
): string {
  return [snapshot.displayStep, snapshot.paymentEntryMode, snapshot.selectedTenderType].join(':');
}

function renderStatus(
  snapshot: ReturnType<CommerceHubConnectWidgetController['getSnapshot']>,
): string {
  if (
    snapshot.displayStep === 'payment' &&
    snapshot.paymentEntryMode === 'add' &&
    snapshot.selectedTenderType === 'BANK_ACCOUNT'
  ) {
    return '';
  }

  const title = (() => {
    switch (snapshot.displayStep) {
      case 'otp':
        return 'Enter code';
      case 'payment':
        return snapshot.paymentEntryMode === 'add'
          ? snapshot.selectedTenderType === 'CARD'
            ? 'Add card'
            : 'Connect bank'
          : snapshot.configuration.paymentSelectionTitle?.trim() || 'Payment method';
      case 'success':
        return 'Payment method saved';
      case 'email':
      default:
        return 'Sign in';
    }
  })();

  const subtitle = (() => {
    switch (snapshot.displayStep) {
      case 'otp':
        return `We sent a six-digit code to ${escapeHtml(formatOtpDestination(snapshot))}.`;
      case 'payment':
        return snapshot.paymentEntryMode === 'add'
          ? snapshot.selectedTenderType === 'CARD'
            ? 'Save a new credit or debit card to this wallet.'
            : 'Continue in the secure bank-link frame.'
          : 'Choose a saved payment method or add a new one.';
      case 'success': {
        const source = snapshot.completedPaymentSource ?? snapshot.selectedSource;
        return source
          ? `${escapeHtml(formatSourcePrimaryLabel(source))} is ready to use.`
          : 'Payment source linked successfully.';
      }
      case 'email':
      default:
        return 'Enter the email address linked to this customer wallet.';
    }
  })();

  return `
    <div class="ch-sdk-title-block">
      <h2>${escapeHtml(title)}</h2>
      <p>${subtitle}</p>
    </div>
  `;
}

function renderError(message: string): string {
  return `<div class="ch-sdk-alert ch-sdk-alert--error">${escapeHtml(message)}</div>`;
}

function renderStep(
  snapshot: ReturnType<CommerceHubConnectWidgetController['getSnapshot']>,
): string {
  switch (snapshot.displayStep) {
    case 'otp':
      return renderOtpStep(snapshot);
    case 'payment':
      return snapshot.paymentEntryMode === 'add'
        ? snapshot.selectedTenderType === 'CARD'
          ? renderCardStep(snapshot)
          : renderBankStep(snapshot)
        : renderPaymentListStep(snapshot);
    case 'success':
      return renderSuccessStep(snapshot);
    case 'email':
    default:
      return renderEmailStep(snapshot);
  }
}

function renderEmailStep(
  snapshot: ReturnType<CommerceHubConnectWidgetController['getSnapshot']>,
): string {
  return `
    <form class="ch-sdk-form" data-form="email">
      <label class="ch-sdk-field">
        <span>Email address</span>
        <input name="email" type="email" value="${escapeHtml(snapshot.email)}" autocomplete="email" ${snapshot.interaction.allowEmailChange === false && snapshot.email ? 'disabled' : ''} required />
      </label>
      <button class="ch-sdk-button${snapshot.submitting ? ' is-loading' : ''}" type="submit" ${snapshot.submitting ? 'disabled aria-busy="true"' : ''}>${renderButtonLabel(snapshot.submitting ? 'Sending...' : 'Continue', 'arrow', snapshot.submitting)}</button>
    </form>
  `;
}

function renderOtpStep(
  snapshot: ReturnType<CommerceHubConnectWidgetController['getSnapshot']>,
): string {
  const otpDigits = getOtpDisplayDigits(snapshot.otpCode);
  const hasOtpError = snapshot.error?.stage === 'otp_validate';

  return `
    <form class="ch-sdk-form" data-form="otp">
      <input name="otp" type="hidden" value="${escapeHtml(snapshot.otpCode)}" />
      <div class="ch-sdk-otp-group${hasOtpError ? ' is-error' : ''}" role="group" aria-label="One-time code">
        ${otpDigits
          .map(
            (digit, index) => `
              <input
                class="ch-sdk-otp-digit"
                data-otp-digit-index="${index}"
                type="text"
                inputmode="numeric"
                pattern="[0-9]*"
                autocomplete="${index === 0 ? 'one-time-code' : 'off'}"
                maxlength="1"
                value="${escapeHtml(digit)}"
                aria-label="Digit ${index + 1}"
                ${hasOtpError ? 'aria-invalid="true"' : ''}
                ${snapshot.submitting ? 'disabled' : ''}
              />
            `,
          )
          .join('')}
      </div>
      <button class="ch-sdk-button${snapshot.submitting ? ' is-loading' : ''}" type="submit" ${snapshot.submitting ? 'disabled aria-busy="true"' : ''}>${renderButtonLabel(snapshot.submitting ? 'Verifying...' : 'Verify', 'check', snapshot.submitting)}</button>
      <div class="ch-sdk-inline-actions ch-sdk-inline-actions--centered">
        <button class="ch-sdk-link-button" data-action="otp-alternate" type="button" ${snapshot.submitting ? 'disabled' : ''}>${snapshot.interaction.phone?.phoneNumber && snapshot.requestedOtpMode !== 'email' ? 'Send code to email instead' : 'Use another email'}</button>
        <span class="ch-sdk-inline-separator" aria-hidden="true">•</span>
        <button class="ch-sdk-link-button" data-action="resend-otp" type="button" ${snapshot.submitting ? 'disabled' : ''}>Resend code</button>
      </div>
    </form>
  `;
}

function renderPaymentListStep(
  snapshot: ReturnType<CommerceHubConnectWidgetController['getSnapshot']>,
): string {
  const sourcesMarkup =
    snapshot.availableSources.length > 0
      ? snapshot.availableSources
          .map((source) => renderSourceOption(source, snapshot.selectedSource?.id ?? null))
          .join('')
      : '<div class="ch-sdk-empty-state">No saved payment methods are available yet.</div>';
  const sourceActionsMarkup = [
    snapshot.supportedTenderTypes.includes('CARD')
      ? renderSourceAction('add-card', 'Add card', renderAddCardIcon())
      : '',
    snapshot.supportedTenderTypes.includes('BANK_ACCOUNT')
      ? renderSourceAction('add-bank', 'Add bank account', renderAddBankIcon())
      : '',
  ]
    .filter(Boolean)
    .join('');
  const sourceActionsListMarkup = sourceActionsMarkup
    ? `<div class="ch-sdk-source-actions-list">${sourceActionsMarkup}</div>`
    : '';

  return `
    <div class="ch-sdk-stack ch-sdk-stack--payment-list">
      <div class="ch-sdk-source-scroll" role="region" aria-label="Saved payment methods" tabindex="0">
        <div class="ch-sdk-source-list">${sourcesMarkup}</div>
      </div>
      ${sourceActionsListMarkup}
      <button class="ch-sdk-button${snapshot.submitting ? ' is-loading' : ''}" data-action="attach-selected-source" type="button" ${snapshot.submitting || !snapshot.selectedSource ? 'disabled' : ''} ${snapshot.submitting ? 'aria-busy="true"' : ''}>
        ${renderButtonLabel(
          snapshot.submitting
            ? 'Saving...'
            : snapshot.configuration.paymentSelectionConfirmLabel?.trim() || 'Confirm',
          'arrow',
          snapshot.submitting,
        )}
      </button>
    </div>
  `;
}

function renderSourceOption(source: PaymentSource, selectedSourceId: string | null): string {
  const isSelected = source.id === selectedSourceId;
  return `
    <button class="ch-sdk-source-option${isSelected ? ' is-selected' : ''}" data-action="select-source" data-source-id="${escapeHtml(source.id ?? '')}" type="button" aria-pressed="${isSelected ? 'true' : 'false'}">
      <span class="ch-sdk-source-radio" aria-hidden="true">${isSelected ? '<span class="ch-sdk-source-check"></span>' : ''}</span>
      <span class="ch-sdk-source-badge">${escapeHtml(formatSourceBadgeLabel(source))}</span>
      <span class="ch-sdk-source-copy">
        <strong>${escapeHtml(formatSourcePrimaryLabel(source))}</strong>
        <small>${escapeHtml(formatSourceSecondaryLabel(source))}</small>
      </span>
    </button>
  `;
}

function renderSourceAction(action: 'add-card' | 'add-bank', label: string, icon: string): string {
  return `
    <button class="ch-sdk-source-action" data-action="${action}" type="button">
      ${icon}
      <span>${escapeHtml(label)}</span>
    </button>
  `;
}

function renderAddCardIcon(): string {
  return `
    <svg class="ch-sdk-source-action-icon" viewBox="0 0 14 14" aria-hidden="true" focusable="false">
      <rect x="1.7" y="3.5" width="10.6" height="7" rx="1.5" fill="none" stroke="currentColor" stroke-width="1.4" />
      <path d="M3 5.7h8" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" />
      <path d="M5.4 8.6h3.2M7 7v3.2" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" />
    </svg>
  `;
}

function renderAddBankIcon(): string {
  return `
    <svg class="ch-sdk-source-action-icon" viewBox="0 0 14 14" aria-hidden="true" focusable="false">
      <path d="M2.2 5.4h9.6L7 2.2 2.2 5.4Z" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round" />
      <path d="M3 11.4h8M3.6 6.5v3.8M7 6.5v3.8M10.4 6.5v3.8" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" />
      <path d="M10 1.6v3M8.5 3.1h3" stroke="currentColor" stroke-width="1.1" stroke-linecap="round" />
    </svg>
  `;
}

function renderCardStep(
  snapshot: ReturnType<CommerceHubConnectWidgetController['getSnapshot']>,
): string {
  const draft = snapshot.cardDraft;
  const useNewBillingAddress =
    (draft.billingAddressValue || getNewBillingAddressValue()) === getNewBillingAddressValue();
  const billingAddressOptions = renderBillingAddressOptions(
    snapshot.billingAddresses,
    draft.billingAddressValue || getNewBillingAddressValue(),
  );
  const billingAddressControl =
    snapshot.billingAddresses.length > 0
      ? `<label class="ch-sdk-field">
          <span>Billing address</span>
          <select name="billingAddressValue">${billingAddressOptions}</select>
        </label>`
      : `<input name="billingAddressValue" type="hidden" value="${getNewBillingAddressValue()}" />`;
  const cardPreview = draft.cardNumber
    ? `<small class="ch-sdk-field-help">Preview: ${escapeHtml(getMaskedCardPreview(draft.cardNumber))}</small>`
    : '';
  const cvvPreview = draft.cvc
    ? `<small class="ch-sdk-field-help">Preview: ${escapeHtml(getMaskedCvvPreview(draft.cvc))}</small>`
    : '';

  return `
    <form class="ch-sdk-form" data-form="card">
      ${snapshot.cardDraftMessage ? `<div class="ch-sdk-alert ch-sdk-alert--error">${escapeHtml(snapshot.cardDraftMessage)}</div>` : ''}
      <div class="ch-sdk-grid ch-sdk-grid--two">
        ${renderInputField('Card label', 'name', draft.name, snapshot.cardDraftErrors.name)}
        ${renderInputField('Name on card', 'fullName', draft.fullName, snapshot.cardDraftErrors.fullName)}
      </div>
      <div class="ch-sdk-grid ch-sdk-grid--two">
        ${renderInputField('Card number', 'cardNumber', draft.cardNumber, snapshot.cardDraftErrors.cardNumber, 'text', 'cc-number')}
        ${renderInputField('Expiration', 'expiration', draft.expiration, snapshot.cardDraftErrors.expiration, 'text', 'cc-exp', 'MM/YY')}
      </div>
      ${cardPreview}
      <div class="ch-sdk-grid ch-sdk-grid--two">
        ${renderInputField('CVC', 'cvc', draft.cvc, snapshot.cardDraftErrors.cvc, 'password', 'cc-csc')}
        ${useNewBillingAddress ? renderInputField('Country', 'country', draft.country, snapshot.cardDraftErrors.country) : billingAddressControl}
      </div>
      ${cvvPreview}
      ${useNewBillingAddress ? billingAddressControl : ''}
      ${useNewBillingAddress ? renderNewBillingAddressFields(draft, snapshot.cardDraftErrors) : ''}
      <div class="ch-sdk-button-row">
        <button class="ch-sdk-button${snapshot.submitting ? ' is-loading' : ''}" type="submit" ${canSubmitCard(snapshot) ? '' : 'disabled'} ${snapshot.submitting ? 'aria-busy="true"' : ''}>${renderButtonLabel(snapshot.submitting ? 'Saving...' : 'Save payment method', 'arrow', snapshot.submitting)}</button>
        <button class="ch-sdk-button ch-sdk-button--secondary" data-action="back-payment-list" type="button" ${snapshot.submitting ? 'disabled' : ''}>Back</button>
      </div>
    </form>
  `;
}

function renderNewBillingAddressFields(
  draft: ReturnType<CommerceHubConnectWidgetController['getSnapshot']>['cardDraft'],
  errors: ReturnType<CommerceHubConnectWidgetController['getSnapshot']>['cardDraftErrors'],
): string {
  return `
    ${renderInputField('Address line 1', 'addressLine1', draft.addressLine1, errors.addressLine1)}
    <input name="addressLine2" type="hidden" value="${escapeHtml(draft.addressLine2)}" />
    <div class="ch-sdk-grid ch-sdk-grid--two">
      ${renderInputField('City', 'city', draft.city, errors.city)}
      ${renderInputField('State', 'state', draft.state, errors.state)}
      ${renderInputField('ZIP code', 'zip', draft.zip, errors.zip)}
    </div>
  `;
}

function renderInputField(
  label: string,
  name: string,
  value: string,
  error?: string,
  type = 'text',
  autocomplete?: string,
  placeholder?: string,
): string {
  return `
    <label class="ch-sdk-field">
      <span>${escapeHtml(label)}</span>
      <input name="${escapeHtml(name)}" type="${escapeHtml(type)}" value="${escapeHtml(value)}" ${autocomplete ? `autocomplete="${escapeHtml(autocomplete)}"` : ''} ${placeholder ? `placeholder="${escapeHtml(placeholder)}"` : ''} ${error ? 'aria-invalid="true"' : ''} />
      ${error ? `<small class="ch-sdk-field-error">${escapeHtml(error)}</small>` : ''}
    </label>
  `;
}

function renderBankStep(
  snapshot: ReturnType<CommerceHubConnectWidgetController['getSnapshot']>,
): string {
  const isBankLoading = snapshot.pendingPayByBankLaunch || snapshot.bankLinkLoading;
  return `
    <div class="ch-sdk-stack">
      <div id="${escapeHtml(snapshot.payByBankMountId)}" class="ch-sdk-bank-mount${isBankLoading ? ' is-loading' : ''}" ${isBankLoading ? 'aria-busy="true"' : ''}></div>
      <div class="ch-sdk-button-row">
        <button class="ch-sdk-button ch-sdk-button--secondary" data-action="back-payment-list" type="button" ${snapshot.bankLinkLoading ? 'disabled' : ''}>Back</button>
      </div>
    </div>
  `;
}

function renderSuccessStep(
  snapshot: ReturnType<CommerceHubConnectWidgetController['getSnapshot']>,
): string {
  const source = snapshot.completedPaymentSource ?? snapshot.selectedSource;

  return `
    <div class="ch-sdk-stack">
      <div class="ch-sdk-alert ch-sdk-alert--success ch-sdk-alert--success-prominent">
        <span class="ch-sdk-success-icon" aria-hidden="true"><span></span></span>
        <span>${escapeHtml(
          source
            ? `${formatSourcePrimaryLabel(source)} is ready to use.`
            : 'Payment source linked successfully.',
        )}</span>
      </div>
      ${source ? renderSuccessSummary(source) : ''}
      <button class="ch-sdk-button ch-sdk-button--secondary" data-action="back-payment-list" type="button">Manage payment methods</button>
    </div>
  `;
}

function renderSuccessSummary(source: PaymentSource): string {
  return `
    <div class="ch-sdk-success-summary">
      <span class="ch-sdk-source-radio ch-sdk-source-radio--success" aria-hidden="true"><span class="ch-sdk-source-check"></span></span>
      <span class="ch-sdk-source-badge">${escapeHtml(formatSourceBadgeLabel(source))}</span>
      <div class="ch-sdk-source-copy">
        <strong>${escapeHtml(formatSourcePrimaryLabel(source))}</strong>
        <small>${escapeHtml(formatSourceSecondaryLabel(source))}</small>
      </div>
    </div>
  `;
}

function renderBillingAddressOptions(addresses: Address[], selectedValue: string): string {
  const options = [
    ...addresses
      .filter((address) => address.id?.trim())
      .map(
        (address) =>
          `<option value="${escapeHtml(address.id?.trim() ?? '')}" ${address.id?.trim() === selectedValue ? 'selected' : ''}>${escapeHtml(formatBillingAddressLabel(address))}</option>`,
      ),
    `<option value="${getNewBillingAddressValue()}" ${selectedValue === getNewBillingAddressValue() ? 'selected' : ''}>Add new billing address</option>`,
  ];

  return options.join('');
}

function applyTheme(
  hostElement: HTMLElement,
  whiteLabel: ReturnType<CommerceHubConnectWidgetController['getSnapshot']>['whiteLabel'],
): void {
  hostElement.style.setProperty('--ch-sdk-primary', whiteLabel.primaryColor);
  hostElement.style.setProperty('--ch-sdk-secondary', whiteLabel.secondaryColor);
  hostElement.style.setProperty('--ch-sdk-text', whiteLabel.textColor);
  hostElement.style.setProperty('--ch-sdk-font-family', whiteLabel.fontFamily);
}

function isSensitiveCardInput(
  target: HTMLInputElement,
): target is HTMLInputElement & { name: 'cardNumber' | 'cvc' } {
  return (
    target.form?.dataset['form'] === 'card' &&
    (target.name === 'cardNumber' || target.name === 'cvc')
  );
}

function isCardDraftFieldName(name: string): name is keyof CardDraft {
  return CARD_DRAFT_FIELD_NAMES.has(name as keyof CardDraft);
}

function isCardDraftFormControl(
  target: HTMLInputElement | HTMLSelectElement,
): target is (HTMLInputElement | HTMLSelectElement) & { name: keyof CardDraft } {
  return target.form?.dataset['form'] === 'card' && isCardDraftFieldName(target.name);
}

function updateCardSubmitAvailability(
  form: HTMLFormElement | null,
  controller: CommerceHubConnectWidgetController,
): void {
  const submitButton = form?.querySelector<HTMLButtonElement>('button[type="submit"]');
  if (!submitButton) {
    return;
  }

  submitButton.disabled = !canSubmitCard(controller.getSnapshot());
}

function renderButtonLabel(label: string, _icon: 'arrow' | 'check', loading = false): string {
  return `<span class="ch-sdk-button-label">${loading ? '<span class="ch-sdk-spinner" aria-hidden="true"></span>' : ''}<span>${escapeHtml(label)}</span></span>`;
}

function getOtpDisplayDigits(code: string): string[] {
  const digits = normalizeOtpDigits(code).split('');
  return Array.from({ length: 6 }, (_, index) => digits[index] ?? '');
}

function normalizeOtpDigits(value: string): string {
  return value.replace(/\D/g, '').slice(0, 6);
}

function getOtpDigitInputs(input: HTMLInputElement): HTMLInputElement[] {
  return Array.from(input.form?.querySelectorAll<HTMLInputElement>('[data-otp-digit-index]') ?? []);
}

function syncOtpFormValue(form: HTMLFormElement | null, inputs: HTMLInputElement[]): void {
  const hiddenInput = form?.querySelector<HTMLInputElement>('input[name="otp"]');
  if (!hiddenInput) {
    return;
  }

  hiddenInput.value = inputs.map((otpInput) => normalizeOtpDigits(otpInput.value)).join('');
}

function focusOtpInput(input: HTMLInputElement | undefined): void {
  if (!input) {
    return;
  }

  input.focus();
  input.select();
}

function syncOtpDigits(target: HTMLInputElement): void {
  const inputs = getOtpDigitInputs(target);
  const index = Number(target.dataset['otpDigitIndex'] ?? -1);
  if (index < 0) {
    return;
  }

  const digits = normalizeOtpDigits(target.value);
  if (digits.length <= 1) {
    target.value = digits;
    syncOtpFormValue(target.form, inputs);
    if (digits) {
      focusOtpInput(inputs[index + 1]);
    }
    return;
  }

  let cursor = index;
  for (const digit of digits) {
    if (cursor >= inputs.length) {
      break;
    }
    inputs[cursor].value = digit;
    cursor += 1;
  }

  syncOtpFormValue(target.form, inputs);
  focusOtpInput(inputs[Math.min(cursor, inputs.length - 1)]);
}
