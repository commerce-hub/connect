import {LitElement, html, type PropertyValues, type TemplateResult} from 'lit';
import {customElement, property, state} from 'lit/decorators.js';

import type {components} from './generated/openapi.js';
import {createCommerceHubClient} from './internal/api-client.js';
import {primitiveStyles} from './internal/styles.js';
import {
  renderAlert,
  renderButton,
  renderEmptyState,
  renderOtpGroup,
  renderOtpResend,
  renderPaymentMethodRow,
  renderSourceAction,
  renderWidgetShell,
} from './internal/primitives.js';
import type {FlowActionName, PaymentMethod} from './internal/types.js';

export {
  createCommerceHubClient,
  DEFAULT_COMMERCE_HUB_BASE_URL,
  type CommerceHubClient,
  type CommerceHubClientOptions,
} from './internal/api-client.js';
export type {components, operations, paths} from './generated/openapi.js';

export type InteractionResponse = components['schemas']['InteractionResponse'];
export interface InteractionError {
  code?: string;
  message: string;
  cause?: unknown;
}

export type OnSuccessEvent = CustomEvent<InteractionResponse>;
export type OnErrorEvent = CustomEvent<InteractionError>;

export const ON_SUCCESS_EVENT = 'onSuccess';
export const ON_ERROR_EVENT = 'onError';

type PaymentSource = NonNullable<InteractionResponse['paymentSources']>[number];

const OTP_LENGTH = 6;

const demoPaymentMethods: PaymentMethod[] = [
  {
    id: 'visa-1111',
    label: 'James Anderson',
    type: 'card',
    brand: 'VISA',
    last4: '1111',
    status: 'verified',
    selected: true,
  },
  {
    id: 'amex-8000',
    label: 'James Anderson',
    type: 'card',
    brand: 'AMEX',
    last4: '8000',
    status: 'unverified',
  },
];

/**
 * CommerceHub Connect Web SDK widget shell.
 *
 * Renders the SDK-owned interaction flow slice for OTP verification and saved
 * payment-source selection.
 */
@customElement('commerce-hub-connect')
export class CommerceHubConnect extends LitElement {
  static override styles = primitiveStyles;

  @property({attribute: false})
  interactionResponse?: InteractionResponse;

  @property({attribute: false})
  designConfig?: DesignConfig;

  @state()
  private selectedPaymentSourceId?: string;

  @state()
  private otpValue = '';

  @state()
  private pendingAction?: FlowActionName;

  @state()
  private otpErrorMessage?: string;

  protected override willUpdate(changedProperties: PropertyValues<this>) {
    if (
      changedProperties.has('interactionResponse') &&
      this.interactionResponse
    ) {
      this.selectedPaymentSourceId = resolveSelectedPaymentSourceId(
        this.interactionResponse,
        this.selectedPaymentSourceId
      );
    }
  }

  protected override updated(changedProperties: PropertyValues<this>) {
    if (changedProperties.has('designConfig')) {
      this.syncDesignConfigStyles();
    }
  }

  override render() {
    return html`
      <div @click=${this.handleClick} @input=${this.handleInput}>
        ${this.renderCurrentScreen()}
      </div>
    `;
  }

  private renderCurrentScreen(): TemplateResult {
    const status = this.interactionResponse?.status;

    if (
      status === 'OTP_VALIDATION_PENDING' ||
      status === 'OTP_VALIDATION_FAILED'
    ) {
      return this.renderOtpScreen(status);
    }

    return this.renderPaymentSourceScreen();
  }

  private renderOtpScreen(
    status: 'OTP_VALIDATION_PENDING' | 'OTP_VALIDATION_FAILED'
  ): TemplateResult {
    const copy = resolveOtpCopy(this.designConfig);
    const isFailed = status === 'OTP_VALIDATION_FAILED';
    const isSubmitting = this.pendingAction === 'verify-otp';
    const isResending = this.pendingAction === 'resend-otp';
    const email = this.interactionResponse?.email;

    return renderWidgetShell({
      title: copy.title,
      subtitle: copy.subtitle ?? defaultOtpSubtitle(email),
      content: html`
        <div class="otp-flow">
          ${isFailed
            ? renderAlert({
                variant: 'danger',
                message: this.otpErrorMessage ?? copy.failedMessage,
              })
            : ''}
          ${renderOtpGroup({
            label: 'Verification code',
            value: this.otpValue,
            length: OTP_LENGTH,
            disabled: isSubmitting,
            error: isFailed,
          })}
          <div class="otp-resend-row">
            <span class="otp-resend-prefix">${copy.resendPrefix}</span>
            ${renderOtpResend({
              label: isResending ? copy.resendPendingButton : copy.resendButton,
              action: 'resend-otp',
              disabled: isSubmitting || isResending,
            })}
          </div>
          <div class="primitive-footer">
            ${renderButton({
              label: isSubmitting
                ? copy.verifyingButton
                : isFailed
                ? copy.tryAgainButton
                : copy.verifyButton,
              variant: 'primary',
              action: 'verify-otp',
              disabled: isSubmitting || this.otpValue.length < OTP_LENGTH,
            })}
          </div>
        </div>
      `,
    });
  }

  private renderPaymentSourceScreen(): TemplateResult {
    const copy = resolvePaymentMethodsCopy(this.designConfig);
    const paymentMethods = paymentMethodsFromInteractionResponse(
      this.interactionResponse,
      this.selectedPaymentSourceId
    );

    if (!paymentMethods.length) {
      return this.renderNoSavedPaymentMethods();
    }

    return renderWidgetShell({
      title: copy.title,
      subtitle: copy.subtitle,
      content: html`
        <div class="payment-flow">
          <div
            class="primitive-stack"
            role="radiogroup"
            aria-label="Payment methods"
          >
            ${paymentMethods.map((method) => renderPaymentMethodRow(method))}
          </div>
          <div class="primitive-actions">
            ${renderSourceAction({
              label: copy.addBankAccountTitle,
              subtitle: copy.addBankAccountSubtitle,
              action: 'add-bank-account',
              icon: 'bank',
              disabled: this.pendingAction === 'attach-payment-source',
            })}
            ${renderSourceAction({
              label: copy.addCardTitle,
              subtitle: copy.addCardSubtitle,
              action: 'add-card',
              icon: 'card',
              disabled: this.pendingAction === 'attach-payment-source',
            })}
          </div>
          <div class="primitive-footer">
            ${renderButton({
              label:
                this.pendingAction === 'attach-payment-source'
                  ? copy.continuingButton
                  : copy.continueButton,
              variant: 'primary',
              action: 'attach-payment-source',
              disabled:
                this.pendingAction === 'attach-payment-source' ||
                !this.selectedPaymentSourceId,
            })}
          </div>
        </div>
      `,
    });
  }

  private renderNoSavedPaymentMethods(): TemplateResult {
    const copy = resolveNoSavedPaymentMethodsCopy(this.designConfig);

    return renderWidgetShell({
      title: copy.title,
      subtitle: copy.subtitle,
      content: html`
        <div class="payment-flow">
          ${renderEmptyState({
            title: copy.emptyTitle,
            message: copy.emptyMessage,
          })}
          <div class="primitive-actions">
            ${renderSourceAction({
              label: copy.addBankAccountTitle,
              subtitle: copy.addBankAccountSubtitle,
              action: 'add-bank-account',
              icon: 'bank',
            })}
            ${renderSourceAction({
              label: copy.addCardTitle,
              subtitle: copy.addCardSubtitle,
              action: 'add-card',
              icon: 'card',
            })}
          </div>
        </div>
      `,
    });
  }

  private handleClick = (event: Event) => {
    const paymentMethodId = findDatasetValue(event, 'paymentMethodId');

    if (paymentMethodId) {
      this.selectedPaymentSourceId = paymentMethodId;
      return;
    }

    const action = findDatasetValue(event, 'action') as
      | FlowActionName
      | undefined;

    if (!action) {
      return;
    }

    if (action === 'verify-otp') {
      void this.verifyOtp();
      return;
    }

    if (action === 'resend-otp') {
      void this.resendOtp();
      return;
    }

    if (action === 'attach-payment-source') {
      void this.attachPaymentSource();
      return;
    }

    if (action === 'add-bank-account' || action === 'add-card') {
      return;
    }
  };

  private handleInput = (event: Event) => {
    const input = event
      .composedPath()
      .find(
        (item): item is HTMLInputElement =>
          item instanceof HTMLInputElement &&
          item.classList.contains('otp-input')
      );

    if (!input) {
      return;
    }

    input.value = input.value.replace(/\D/g, '').slice(-1);

    const inputs = [
      ...this.renderRoot.querySelectorAll<HTMLInputElement>('.otp-input'),
    ];

    this.otpValue = inputs
      .map((item) => item.value)
      .join('')
      .slice(0, OTP_LENGTH);
    this.otpErrorMessage = undefined;

    const index = Number(input.dataset.otpIndex);
    const nextInput = inputs[index + 1];

    if (input.value && nextInput) {
      nextInput.focus();
    }
  };

  private async verifyOtp() {
    if (this.otpValue.length < OTP_LENGTH) {
      return;
    }

    const interactionId = this.requireInteractionId();

    if (!interactionId) {
      return;
    }

    this.pendingAction = 'verify-otp';

    try {
      const response = await this.createSdkClient(interactionId).POST(
        '/interaction/otp/validate',
        {
          body: {
            otp: this.otpValue,
            email: this.interactionResponse?.email,
            channel: 'EMAIL',
          },
        }
      );
      const interactionResponse = interactionResponseFromApi(response);

      this.otpErrorMessage = undefined;
      this.setInteractionResponseFromSdk(interactionResponse);
    } catch (cause) {
      void cause;
      this.otpErrorMessage = undefined;
      this.setInteractionResponseFromSdk({
        ...this.interactionResponse,
        status: 'OTP_VALIDATION_FAILED',
      });
    } finally {
      this.pendingAction = undefined;
    }
  }

  private async resendOtp() {
    const interactionId = this.requireInteractionId();

    if (!interactionId) {
      return;
    }

    this.pendingAction = 'resend-otp';

    try {
      const response = await this.createSdkClient(interactionId).POST(
        '/interaction/otp/send/email'
      );
      const interactionResponse = interactionResponseFromApi(response);

      this.otpErrorMessage = undefined;
      this.setInteractionResponseFromSdk(interactionResponse);
    } catch (cause) {
      void cause;
    } finally {
      this.pendingAction = undefined;
    }
  }

  private async attachPaymentSource() {
    const interactionId = this.requireInteractionId();

    if (!interactionId) {
      return;
    }

    if (!this.selectedPaymentSourceId) {
      return;
    }

    this.pendingAction = 'attach-payment-source';

    try {
      const response = await this.createSdkClient(interactionId).POST(
        '/interaction/payment-source/{paymentSourceId}/attach',
        {
          params: {
            path: {paymentSourceId: this.selectedPaymentSourceId},
          },
        }
      );
      const interactionResponse = interactionResponseFromApi(response);

      this.setInteractionResponseFromSdk(interactionResponse);
    } catch (cause) {
      void cause;
    } finally {
      this.pendingAction = undefined;
    }
  }

  private requireInteractionId(): string | undefined {
    const interactionId = this.interactionResponse?.interactionId;

    if (interactionId) {
      return interactionId;
    }

    return undefined;
  }

  private createSdkClient(interactionId: string) {
    return createCommerceHubClient({
      getHeaders: () => ({'x-interaction-id': interactionId}),
    });
  }

  private setInteractionResponseFromSdk(
    interactionResponse: InteractionResponse
  ) {
    this.interactionResponse = interactionResponse;
  }

  private syncDesignConfigStyles() {
    for (const property of designConfigStyleProperties) {
      this.style.removeProperty(property);
    }

    const colors = this.designConfig?.colors;

    if (colors) {
      for (const {field, property} of designConfigColorProperties) {
        const value = colors[field];

        if (value) {
          this.style.setProperty(property, value);
        }
      }
    }

    const baseFontSize = this.designConfig?.baseFontSize;

    if (baseFontSize) {
      this.style.fontSize = baseFontSize;
    } else {
      this.style.removeProperty('font-size');
    }
  }
}

export interface DesignConfig {
  colors?: DesignConfigColors;
  baseFontSize?: string;
  copy?: DesignConfigCopy;
}

export interface DesignConfigColors {
  primary?: string;
  text?: string;
  copy?: string;
  muted?: string;
  placeholder?: string;
  surface?: string;
  softSurface?: string;
  border?: string;
  borderStrong?: string;
  success?: string;
  successBackground?: string;
  successBorder?: string;
  danger?: string;
  dangerBackground?: string;
  dangerBorder?: string;
  warning?: string;
  warningBackground?: string;
  warningBorder?: string;
  disabledText?: string;
  disabledSurface?: string;
}

export interface DesignConfigCopy {
  otp?: DesignConfigOtpCopy;
  paymentMethods?: DesignConfigPaymentMethodsCopy;
  noSavedPaymentMethods?: DesignConfigNoSavedPaymentMethodsCopy;
}

export interface DesignConfigOtpCopy {
  title?: string;
  subtitle?: string;
  failedMessage?: string;
  resendPrefix?: string;
  resendButton?: string;
  resendPendingButton?: string;
  verifyButton?: string;
  verifyingButton?: string;
  tryAgainButton?: string;
}

export interface DesignConfigPaymentMethodsCopy {
  title?: string;
  subtitle?: string;
  addBankAccountTitle?: string;
  addBankAccountSubtitle?: string;
  addCardTitle?: string;
  addCardSubtitle?: string;
  continueButton?: string;
  continuingButton?: string;
}

export interface DesignConfigNoSavedPaymentMethodsCopy {
  title?: string;
  subtitle?: string;
  emptyTitle?: string;
  emptyMessage?: string;
  addBankAccountTitle?: string;
  addBankAccountSubtitle?: string;
  addCardTitle?: string;
  addCardSubtitle?: string;
}

interface ResolvedOtpCopy {
  title: string;
  subtitle?: string;
  failedMessage: string;
  resendPrefix: string;
  resendButton: string;
  resendPendingButton: string;
  verifyButton: string;
  verifyingButton: string;
  tryAgainButton: string;
}

interface ResolvedPaymentMethodsCopy {
  title: string;
  subtitle: string;
  addBankAccountTitle: string;
  addBankAccountSubtitle: string;
  addCardTitle: string;
  addCardSubtitle: string;
  continueButton: string;
  continuingButton: string;
}

interface ResolvedNoSavedPaymentMethodsCopy {
  title: string;
  subtitle: string;
  emptyTitle: string;
  emptyMessage: string;
  addBankAccountTitle: string;
  addBankAccountSubtitle: string;
  addCardTitle: string;
  addCardSubtitle: string;
}

const defaultOtpSubtitle = (email?: string): string =>
  `Enter the 6-digit code sent to ${email ?? 'your email address'}.`;

const resolveOtpCopy = (designConfig?: DesignConfig): ResolvedOtpCopy => {
  const copy = designConfig?.copy?.otp;

  return {
    title: copy?.title ?? 'Verify your email',
    subtitle: copy?.subtitle,
    failedMessage: copy?.failedMessage ?? 'The code does not match. Try again.',
    resendPrefix: copy?.resendPrefix ?? 'Did not receive a code?',
    resendButton: copy?.resendButton ?? 'Resend code in 30s',
    resendPendingButton: copy?.resendPendingButton ?? 'Sending code...',
    verifyButton: copy?.verifyButton ?? 'Verify code',
    verifyingButton: copy?.verifyingButton ?? 'Verifying...',
    tryAgainButton: copy?.tryAgainButton ?? 'Try again',
  };
};

const resolvePaymentMethodsCopy = (
  designConfig?: DesignConfig
): ResolvedPaymentMethodsCopy => {
  const copy = designConfig?.copy?.paymentMethods;

  return {
    title: copy?.title ?? 'Payment methods',
    subtitle:
      copy?.subtitle ??
      'Use a saved bank account or credit card, or add a new payment method.',
    addBankAccountTitle: copy?.addBankAccountTitle ?? 'Add new bank account',
    addBankAccountSubtitle:
      copy?.addBankAccountSubtitle ?? 'Connect a different account',
    addCardTitle: copy?.addCardTitle ?? 'Add credit card',
    addCardSubtitle: copy?.addCardSubtitle ?? 'Use card number and CVV',
    continueButton: copy?.continueButton ?? 'Continue',
    continuingButton: copy?.continuingButton ?? 'Continuing...',
  };
};

const resolveNoSavedPaymentMethodsCopy = (
  designConfig?: DesignConfig
): ResolvedNoSavedPaymentMethodsCopy => {
  const copy = designConfig?.copy?.noSavedPaymentMethods;

  return {
    title: copy?.title ?? 'Payment methods',
    subtitle:
      copy?.subtitle ?? 'Add a bank account or credit card to continue.',
    emptyTitle: copy?.emptyTitle ?? 'No saved payment methods',
    emptyMessage:
      copy?.emptyMessage ??
      'There are no reusable payment methods available for this interaction.',
    addBankAccountTitle: copy?.addBankAccountTitle ?? 'Add new bank account',
    addBankAccountSubtitle:
      copy?.addBankAccountSubtitle ?? 'Connect a different account',
    addCardTitle: copy?.addCardTitle ?? 'Add credit card',
    addCardSubtitle: copy?.addCardSubtitle ?? 'Use card number and CVV',
  };
};

const designConfigColorProperties: {
  field: keyof DesignConfigColors;
  property: string;
}[] = [
  {field: 'primary', property: '--chc-primary'},
  {field: 'text', property: '--chc-text'},
  {field: 'copy', property: '--chc-copy'},
  {field: 'muted', property: '--chc-muted'},
  {field: 'placeholder', property: '--chc-placeholder'},
  {field: 'surface', property: '--chc-surface'},
  {field: 'softSurface', property: '--chc-soft-surface'},
  {field: 'border', property: '--chc-border'},
  {field: 'borderStrong', property: '--chc-border-strong'},
  {field: 'success', property: '--chc-success'},
  {field: 'successBackground', property: '--chc-success-bg'},
  {field: 'successBorder', property: '--chc-success-border'},
  {field: 'danger', property: '--chc-danger'},
  {field: 'dangerBackground', property: '--chc-danger-bg'},
  {field: 'dangerBorder', property: '--chc-danger-border'},
  {field: 'warning', property: '--chc-warning'},
  {field: 'warningBackground', property: '--chc-warning-bg'},
  {field: 'warningBorder', property: '--chc-warning-border'},
  {field: 'disabledText', property: '--chc-disabled-text'},
  {field: 'disabledSurface', property: '--chc-disabled-surface'},
];

const designConfigStyleProperties = designConfigColorProperties.map(
  ({property}) => property
);

const paymentMethodsFromInteractionResponse = (
  interactionResponse?: InteractionResponse,
  selectedPaymentSourceId?: string
): PaymentMethod[] => {
  const paymentSources = interactionResponse?.paymentSources;

  if (!paymentSources?.length) {
    return interactionResponse?.status === 'PAYMENT_SOURCE_REQUESTED'
      ? []
      : demoPaymentMethods;
  }

  const selectedSourceId =
    selectedPaymentSourceId ?? interactionResponse?.selectedSource?.id;

  return paymentSources.map((source) =>
    paymentSourceToPaymentMethod(source, selectedSourceId)
  );
};

const paymentSourceToPaymentMethod = (
  source: PaymentSource,
  selectedSourceId?: string
): PaymentMethod => ({
  id: source.id ?? source.name ?? source.tenderType,
  label: source.name ?? paymentSourceLabel(source),
  type: source.tenderType === 'BankAccount' ? 'bank' : 'card',
  brand: paymentSourceBrand(source),
  last4: paymentSourceLast4(source),
  status: verificationStatusToPaymentMethodStatus(
    source.verificationInfo?.status
  ),
  selected: Boolean(source.id && source.id === selectedSourceId),
});

const paymentSourceLabel = (source: PaymentSource): string => {
  if (source.tenderType === 'Card') {
    return 'Saved card';
  }

  if (source.tenderType === 'BankAccount') {
    return 'Saved bank account';
  }

  return 'Dynamic session card';
};

const paymentSourceBrand = (source: PaymentSource): string => {
  if (source.tenderType === 'Card') {
    return source.card?.network ?? 'Card';
  }

  if (source.tenderType === 'BankAccount') {
    return source.bankAccount?.bankName ?? 'Bank account';
  }

  return 'DSC';
};

const paymentSourceLast4 = (source: PaymentSource): string => {
  if (source.tenderType === 'Card') {
    return lastFour(source.card?.cardNumber);
  }

  if (source.tenderType === 'BankAccount') {
    return lastFour(source.bankAccount?.accountNumber);
  }

  return lastFour(source.id);
};

const resolveSelectedPaymentSourceId = (
  interactionResponse?: InteractionResponse,
  currentSelection?: string
): string | undefined => {
  const paymentSources = interactionResponse?.paymentSources;

  if (!paymentSources?.length) {
    return undefined;
  }

  if (
    currentSelection &&
    paymentSources.some((source) => source.id === currentSelection)
  ) {
    return currentSelection;
  }

  return interactionResponse?.selectedSource?.id ?? paymentSources[0].id;
};

const interactionResponseFromApi = (response: {
  data?: InteractionResponse;
  error?: unknown;
}): InteractionResponse => {
  if (response.data) {
    return response.data;
  }

  throw new Error(apiErrorMessage(response.error));
};

const apiErrorMessage = (error: unknown): string => {
  if (typeof error === 'string') {
    return error;
  }

  if (
    error &&
    typeof error === 'object' &&
    'message' in error &&
    typeof error.message === 'string'
  ) {
    return error.message;
  }

  return 'CommerceHub API request failed.';
};

const findDatasetValue = (
  event: Event,
  key: keyof HTMLElement['dataset']
): string | undefined => {
  const element = event
    .composedPath()
    .find(
      (item): item is HTMLElement =>
        item instanceof HTMLElement && Boolean(item.dataset[key])
    );

  return element?.dataset[key];
};

const lastFour = (value?: string): string =>
  value && value.length >= 4 ? value.slice(-4) : '----';

const verificationStatusToPaymentMethodStatus = (
  status?: NonNullable<PaymentSource['verificationInfo']>['status']
): PaymentMethod['status'] => {
  if (status === 'VERIFIED') {
    return 'verified';
  }

  if (status === 'UNDER_REVIEW' || status === 'REQUIRE_INFO') {
    return 'pending';
  }

  return 'unverified';
};

declare global {
  interface HTMLElementEventMap {
    [ON_SUCCESS_EVENT]: OnSuccessEvent;
    [ON_ERROR_EVENT]: OnErrorEvent;
  }

  interface HTMLElementTagNameMap {
    'commerce-hub-connect': CommerceHubConnect;
  }
}
