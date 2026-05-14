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
 *
 * @cssprop --chc-primary - Primary action color.
 * @cssprop --chc-text - Primary text color.
 * @cssprop --chc-copy - Secondary copy color.
 * @cssprop --chc-muted - Muted helper text color.
 * @cssprop --chc-border - Control border color.
 * @fires onSuccess - Emits an InteractionResponse object to the host.
 * @fires onError - Emits an InteractionError object to the host.
 */
@customElement('commerce-hub-connect')
export class CommerceHubConnect extends LitElement {
  static override styles = primitiveStyles;

  @property({attribute: false})
  interactionResponse?: InteractionResponse;

  @state()
  private selectedPaymentSourceId?: string;

  @state()
  private otpValue = '';

  @state()
  private pendingAction?: FlowActionName;

  @state()
  private otpErrorMessage?: string;

  private sdkInteractionResponse?: InteractionResponse;

  private sdkSuccessResponse?: InteractionResponse;

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
    if (
      changedProperties.has('interactionResponse') &&
      this.interactionResponse
    ) {
      const isSdkUpdate =
        this.sdkInteractionResponse === this.interactionResponse;
      const shouldEmitSdkSuccess =
        this.sdkSuccessResponse === this.interactionResponse;

      this.sdkInteractionResponse = undefined;
      this.sdkSuccessResponse = undefined;

      if (isSdkUpdate) {
        if (shouldEmitSdkSuccess) {
          this.emitSuccess(this.interactionResponse);
        }

        return;
      }

      this.emitSuccess(this.interactionResponse);
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
    const isFailed = status === 'OTP_VALIDATION_FAILED';
    const isSubmitting = this.pendingAction === 'verify-otp';
    const isResending = this.pendingAction === 'resend-otp';
    const email = this.interactionResponse?.email;

    return renderWidgetShell({
      title: 'Verify your email',
      subtitle: `Enter the 6-digit code sent to ${
        email ?? 'your email address'
      }.`,
      content: html`
        <div class="otp-flow">
          ${isFailed
            ? renderAlert({
                variant: 'danger',
                message:
                  this.otpErrorMessage ?? 'The code does not match. Try again.',
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
            <span class="otp-resend-prefix">Did not receive a code?</span>
            ${renderOtpResend({
              label: isResending ? 'Sending code...' : 'Resend code in 30s',
              action: 'resend-otp',
              disabled: isSubmitting || isResending,
            })}
          </div>
          <div class="primitive-footer">
            ${renderButton({
              label: isSubmitting
                ? 'Verifying...'
                : isFailed
                ? 'Try again'
                : 'Verify code',
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
    const paymentMethods = paymentMethodsFromInteractionResponse(
      this.interactionResponse,
      this.selectedPaymentSourceId
    );

    if (!paymentMethods.length) {
      return this.renderNoSavedPaymentMethods();
    }

    return renderWidgetShell({
      title: 'Payment methods',
      subtitle:
        'Use a saved bank account or credit card, or add a new payment method.',
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
              label: 'Add new bank account',
              subtitle: 'Connect a different account',
              action: 'add-bank-account',
              icon: 'bank',
              disabled: this.pendingAction === 'attach-payment-source',
            })}
            ${renderSourceAction({
              label: 'Add credit card',
              subtitle: 'Use card number and CVV',
              action: 'add-card',
              icon: 'card',
              disabled: this.pendingAction === 'attach-payment-source',
            })}
          </div>
          <div class="primitive-footer">
            ${renderButton({
              label:
                this.pendingAction === 'attach-payment-source'
                  ? 'Continuing...'
                  : 'Continue',
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
    return renderWidgetShell({
      title: 'Payment methods',
      subtitle: 'Add a bank account or credit card to continue.',
      content: html`
        <div class="payment-flow">
          ${renderEmptyState({
            title: 'No saved payment methods',
            message:
              'There are no reusable payment methods available for this interaction.',
          })}
          <div class="primitive-actions">
            ${renderSourceAction({
              label: 'Add new bank account',
              subtitle: 'Connect a different account',
              action: 'add-bank-account',
              icon: 'bank',
            })}
            ${renderSourceAction({
              label: 'Add credit card',
              subtitle: 'Use card number and CVV',
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
      this.emitError({
        code: 'ACTION_NOT_AVAILABLE',
        message: 'This payment method action is not available in this flow.',
      });
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
      this.otpErrorMessage = 'The code does not match. Try again.';
      this.setInteractionResponseFromSdk({
        ...this.interactionResponse,
        status: 'OTP_VALIDATION_FAILED',
      });
      this.emitError({
        code: 'OTP_VALIDATION_FAILED',
        message: this.otpErrorMessage,
        cause,
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
      this.emitError({
        code: 'OTP_RESEND_FAILED',
        message: 'Unable to resend the verification code.',
        cause,
      });
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
      this.emitError({
        code: 'MISSING_PAYMENT_SOURCE',
        message: 'Select a payment method to continue.',
      });
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

      this.setInteractionResponseFromSdk(interactionResponse, {
        emitSuccess: true,
      });
    } catch (cause) {
      this.emitError({
        code: 'PAYMENT_SOURCE_ATTACH_FAILED',
        message: 'Unable to continue with the selected payment method.',
        cause,
      });
    } finally {
      this.pendingAction = undefined;
    }
  }

  private requireInteractionId(): string | undefined {
    const interactionId = this.interactionResponse?.interactionId;

    if (interactionId) {
      return interactionId;
    }

    this.emitError({
      code: 'MISSING_INTERACTION_ID',
      message:
        'CommerceHub Connect requires interactionResponse.interactionId to continue.',
    });

    return undefined;
  }

  private createSdkClient(interactionId: string) {
    return createCommerceHubClient({
      getHeaders: () => ({'x-interaction-id': interactionId}),
    });
  }

  private setInteractionResponseFromSdk(
    interactionResponse: InteractionResponse,
    options: {emitSuccess?: boolean} = {}
  ) {
    this.sdkInteractionResponse = interactionResponse;
    this.sdkSuccessResponse = options.emitSuccess
      ? interactionResponse
      : undefined;
    this.interactionResponse = interactionResponse;
  }

  protected emitSuccess(interactionResponse: InteractionResponse) {
    this.dispatchOutputEvent(ON_SUCCESS_EVENT, interactionResponse);
  }

  protected emitError(interactionError: InteractionError) {
    this.dispatchOutputEvent(ON_ERROR_EVENT, interactionError);
  }

  private dispatchOutputEvent<Detail>(name: string, detail: Detail) {
    this.dispatchEvent(
      new CustomEvent<Detail>(name, {
        detail,
        bubbles: true,
        composed: true,
      })
    );
  }
}

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
