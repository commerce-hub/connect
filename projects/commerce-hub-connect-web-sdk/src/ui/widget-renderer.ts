import type { Address, PaymentSource } from '../contracts/api-models';
import { escapeHtml } from '../web-sdk-utils';
import {
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

export class CommerceHubConnectWidgetRenderer {
  private readonly unsubscribe: () => void;

  constructor(
    private readonly hostElement: HTMLElement,
    private readonly controller: CommerceHubConnectWidgetController,
  ) {
    this.unsubscribe = this.controller.subscribe(() => this.render());
    this.hostElement.addEventListener('click', this.handleClick);
    this.hostElement.addEventListener('submit', this.handleSubmit);
    this.hostElement.addEventListener('input', this.handleInput);
    this.hostElement.addEventListener('keydown', this.handleKeydown);
    this.hostElement.addEventListener('paste', this.handlePaste);
    this.render();
  }

  destroy(): void {
    this.unsubscribe();
    this.hostElement.removeEventListener('click', this.handleClick);
    this.hostElement.removeEventListener('submit', this.handleSubmit);
    this.hostElement.removeEventListener('input', this.handleInput);
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
    if (!(target instanceof HTMLInputElement) || target.dataset['otpDigitIndex'] === undefined) {
      return;
    }

    syncOtpDigits(target);
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
    this.hostElement.innerHTML = `
      <section class="ch-sdk-shell">
        ${snapshot.whiteLabel.logoUrl ? `<header class="ch-sdk-header"><img src="${escapeHtml(snapshot.whiteLabel.logoUrl)}" alt="Merchant logo" class="ch-sdk-logo" /></header>` : ''}
        <div class="ch-sdk-card">
          <div class="ch-sdk-card-body">
            ${renderStatus(snapshot)}
            ${snapshot.error ? renderError(snapshot.error.message) : ''}
            ${renderStep(snapshot)}
          </div>
          <footer class="ch-sdk-footer-brand" aria-label="Commerce Hub Connect">Commerce Hub Connect</footer>
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

function renderStatus(snapshot: ReturnType<CommerceHubConnectWidgetController['getSnapshot']>): string {
  const title = (() => {
    switch (snapshot.displayStep) {
      case 'otp':
        return 'Enter the code';
      case 'payment':
        return snapshot.paymentEntryMode === 'add'
          ? snapshot.selectedTenderType === 'CARD'
            ? 'Add a credit card'
            : '' // iframe has title
          : snapshot.configuration.paymentSelectionTitle?.trim() || 'Pay with';
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
        return `We send a one-time code to ${escapeHtml(formatOtpDestination(snapshot))}.`;
      case 'payment':
        return snapshot.paymentEntryMode === 'add'
          ? snapshot.selectedTenderType === 'CARD'
            ? 'Securely save a new card using the same streamlined experience.'
            : '' // iframe has its own instructions
          : 'Choose a saved payment method or add a new one.';
      case 'success': {
        const source = snapshot.completedResult?.paymentSource ?? snapshot.selectedSource;
        return source
          ? `${escapeHtml(formatSourcePrimaryLabel(source))} is ready to use.`
          : 'Payment source linked successfully.';
      }
      case 'email':
      default:
        return 'Enter your email address to access your payment dashboard.';
    }
  })();

  return `
    <div class="ch-sdk-title-block${snapshot.displayStep === 'email' || snapshot.displayStep === 'otp' || snapshot.displayStep === 'success' ? ' ch-sdk-title-block--centered' : ''}">
      <h2>${escapeHtml(title)}</h2>
      <p>${subtitle}</p>
    </div>
  `;
}

function renderError(message: string): string {
  return `<div class="ch-sdk-alert ch-sdk-alert--error">${escapeHtml(message)}</div>`;
}

function renderStep(snapshot: ReturnType<CommerceHubConnectWidgetController['getSnapshot']>): string {
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

function renderEmailStep(snapshot: ReturnType<CommerceHubConnectWidgetController['getSnapshot']>): string {
  return `
    <form class="ch-sdk-form" data-form="email">
      <label class="ch-sdk-field">
        <span>Email address</span>
        <input name="email" type="email" value="${escapeHtml(snapshot.email)}" autocomplete="email" ${snapshot.interaction.allowEmailChange === false && snapshot.email ? 'disabled' : ''} required />
      </label>
      <button class="ch-sdk-button" type="submit" ${snapshot.submitting ? 'disabled' : ''}>${renderButtonLabel(snapshot.submitting ? 'Sending...' : 'Continue', 'arrow')}</button>
    </form>
  `;
}

function renderOtpStep(snapshot: ReturnType<CommerceHubConnectWidgetController['getSnapshot']>): string {
  const otpDigits = getOtpDisplayDigits(snapshot.otpCode);

  return `
    <form class="ch-sdk-form" data-form="otp">
      <input name="otp" type="hidden" value="${escapeHtml(snapshot.otpCode)}" />
      <div class="ch-sdk-otp-group" role="group" aria-label="One-time code">
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
                ${snapshot.submitting ? 'disabled' : ''}
              />
            `,
          )
          .join('')}
      </div>
      <button class="ch-sdk-button" type="submit" ${snapshot.submitting ? 'disabled' : ''}>${renderButtonLabel(snapshot.submitting ? 'Verifying...' : 'Verify', 'check')}</button>
      <p class="ch-sdk-helper-copy">Didn’t receive the code?</p>
      <div class="ch-sdk-inline-actions ch-sdk-inline-actions--centered">
        <button class="ch-sdk-link-button" data-action="otp-alternate" type="button" ${snapshot.submitting ? 'disabled' : ''}>${snapshot.interaction.phone?.phoneNumber && snapshot.requestedOtpMode !== 'email' ? 'Send code to email instead' : 'Use another email'}</button>
        <span class="ch-sdk-inline-separator" aria-hidden="true">•</span>
        <button class="ch-sdk-link-button" data-action="resend-otp" type="button" ${snapshot.submitting ? 'disabled' : ''}>Resend code</button>
      </div>
    </form>
  `;
}

function renderPaymentListStep(snapshot: ReturnType<CommerceHubConnectWidgetController['getSnapshot']>): string {
  const sourcesMarkup =
    snapshot.availableSources.length > 0
      ? snapshot.availableSources
          .map((source) => renderSourceOption(source, snapshot.selectedSource?.id ?? null))
          .join('')
      : '<div class="ch-sdk-empty-state">No saved payment methods are available yet.</div>';

  return `
    <div class="ch-sdk-stack">
      <div class="ch-sdk-source-list">${sourcesMarkup}</div>
      <div class="ch-sdk-pill-actions">
        ${snapshot.supportedTenderTypes.includes('CARD') ? '<button class="ch-sdk-pill-button" data-action="add-card" type="button">Add a credit or debit card</button>' : ''}
        ${snapshot.supportedTenderTypes.includes('BANK_ACCOUNT') ? '<button class="ch-sdk-pill-button" data-action="add-bank" type="button">Add bank account</button>' : ''}
      </div>
      <button class="ch-sdk-button" data-action="attach-selected-source" type="button" ${snapshot.submitting || !snapshot.selectedSource ? 'disabled' : ''}>
        ${renderButtonLabel(
          snapshot.submitting ? 'Saving...' : snapshot.configuration.paymentSelectionConfirmLabel?.trim() || 'Confirm',
          'arrow',
        )}
      </button>
    </div>
  `;
}

function renderSourceOption(source: PaymentSource, selectedSourceId: string | null): string {
  const isSelected = source.id === selectedSourceId;
  return `
    <button class="ch-sdk-source-option${isSelected ? ' is-selected' : ''}" data-action="select-source" data-source-id="${escapeHtml(source.id ?? '')}" type="button">
      <span class="ch-sdk-source-radio" aria-hidden="true">${isSelected ? '<span></span>' : ''}</span>
      <span class="ch-sdk-source-badge">${escapeHtml(formatSourceBadgeLabel(source))}</span>
      <span class="ch-sdk-source-copy">
        <strong>${escapeHtml(formatSourcePrimaryLabel(source))}</strong>
        <small>${escapeHtml(formatSourceSecondaryLabel(source))}</small>
      </span>
    </button>
  `;
}

function renderCardStep(snapshot: ReturnType<CommerceHubConnectWidgetController['getSnapshot']>): string {
  const draft = snapshot.cardDraft;
  const useNewBillingAddress =
    (draft.billingAddressValue || getNewBillingAddressValue()) === getNewBillingAddressValue();
  const billingAddressOptions = renderBillingAddressOptions(
    snapshot.billingAddresses,
    draft.billingAddressValue || getNewBillingAddressValue(),
  );
  const cardPreview = draft.cardNumber
    ? `<small class="ch-sdk-field-help">Preview: ${escapeHtml(getMaskedCardPreview(draft.cardNumber))}</small>`
    : '';
  const cvvPreview = draft.cvc
    ? `<small class="ch-sdk-field-help">Preview: ${escapeHtml(getMaskedCvvPreview(draft.cvc))}</small>`
    : '';

  return `
    <form class="ch-sdk-form" data-form="card">
      ${snapshot.cardDraftMessage ? `<div class="ch-sdk-alert ch-sdk-alert--error">${escapeHtml(snapshot.cardDraftMessage)}</div>` : ''}
      <div class="ch-sdk-form-intro">
        <strong>Card details</strong>
        <p>Enter the payment details you want to save to this profile.</p>
      </div>
      <div class="ch-sdk-grid ch-sdk-grid--two">
        ${renderInputField('Card name', 'name', draft.name, snapshot.cardDraftErrors.name)}
        ${renderInputField('Name on card', 'fullName', draft.fullName, snapshot.cardDraftErrors.fullName)}
      </div>
      <div class="ch-sdk-grid ch-sdk-grid--two">
        ${renderInputField('Card number', 'cardNumber', draft.cardNumber, snapshot.cardDraftErrors.cardNumber, 'text', 'cc-number')}
        ${renderInputField('Expiration', 'expiration', draft.expiration, snapshot.cardDraftErrors.expiration, 'text', 'cc-exp', 'MM/YY')}
      </div>
      ${cardPreview}
      <div class="ch-sdk-grid ch-sdk-grid--two">
        ${renderInputField('CVC', 'cvc', draft.cvc, snapshot.cardDraftErrors.cvc, 'password', 'cc-csc')}
        <label class="ch-sdk-field">
          <span>Billing address</span>
          <select name="billingAddressValue">${billingAddressOptions}</select>
        </label>
      </div>
      ${cvvPreview}
      ${useNewBillingAddress ? renderNewBillingAddressFields(draft, snapshot.cardDraftErrors) : ''}
      <div class="ch-sdk-button-row">
        <button class="ch-sdk-button" type="submit" ${snapshot.submitting ? 'disabled' : ''}>${renderButtonLabel(snapshot.submitting ? 'Saving...' : 'Save payment method', 'arrow')}</button>
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
    <div class="ch-sdk-grid ch-sdk-grid--two">
      ${renderInputField('Country', 'country', draft.country, errors.country)}
      ${renderInputField('Address line 1', 'addressLine1', draft.addressLine1, errors.addressLine1)}
      ${renderInputField('Address line 2', 'addressLine2', draft.addressLine2, errors.addressLine2)}
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
      <input name="${escapeHtml(name)}" type="${escapeHtml(type)}" value="${escapeHtml(value)}" ${autocomplete ? `autocomplete="${escapeHtml(autocomplete)}"` : ''} ${placeholder ? `placeholder="${escapeHtml(placeholder)}"` : ''} />
      ${error ? `<small class="ch-sdk-field-error">${escapeHtml(error)}</small>` : ''}
    </label>
  `;
}

function renderBankStep(snapshot: ReturnType<CommerceHubConnectWidgetController['getSnapshot']>): string {
  return `
    <div class="ch-sdk-stack">
      <div class="ch-sdk-bank-panel">
        <div id="${escapeHtml(snapshot.payByBankMountId)}" class="ch-sdk-bank-mount"></div>
      </div>
      <div class="ch-sdk-button-row">
        <button class="ch-sdk-button ch-sdk-button--secondary" data-action="back-payment-list" type="button" ${snapshot.bankLinkLoading ? 'disabled' : ''}>Back</button>
      </div>
    </div>
  `;
}

function renderSuccessStep(snapshot: ReturnType<CommerceHubConnectWidgetController['getSnapshot']>): string {
  const source = snapshot.completedResult?.paymentSource ?? snapshot.selectedSource;

  return `
    <div class="ch-sdk-stack">
      <div class="ch-sdk-alert ch-sdk-alert--success ch-sdk-alert--success-prominent">
        ${escapeHtml(
          source ? `${formatSourcePrimaryLabel(source)} is ready to use.` : 'Payment source linked successfully.',
        )}
      </div>
      ${source ? renderSuccessSummary(source) : ''}
      <button class="ch-sdk-button ch-sdk-button--secondary" data-action="back-payment-list" type="button">Manage payment methods</button>
    </div>
  `;
}

function renderSuccessSummary(source: PaymentSource): string {
  return `
    <div class="ch-sdk-success-summary">
      <div>
        <span class="ch-sdk-source-badge">${escapeHtml(formatSourceBadgeLabel(source))}</span>
      </div>
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

function renderButtonLabel(label: string, icon: 'arrow' | 'check'): string {
  const iconMarkup =
    icon === 'arrow'
      ? '<span class="ch-sdk-button-icon" aria-hidden="true">→</span>'
      : '<span class="ch-sdk-button-icon" aria-hidden="true">✓</span>';

  return `<span class="ch-sdk-button-label">${escapeHtml(label)}</span>${iconMarkup}`;
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
