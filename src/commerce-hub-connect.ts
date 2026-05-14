import {LitElement, html, type PropertyValues, type TemplateResult} from 'lit';
import {customElement, property, state} from 'lit/decorators.js';

import type {components} from './generated/openapi.js';
import {
  createCommerceHubClient,
  DEFAULT_COMMERCE_HUB_BASE_URL,
} from './internal/api-client.js';
import {primitiveStyles} from './internal/styles.js';
import {
  renderAlert,
  renderButton,
  renderEmptyState,
  renderOutcomeShell,
  renderOtpGroup,
  renderOtpResend,
  renderPaymentMethodRow,
  renderProviderFrame,
  renderSourceAction,
  renderTextLinkButton,
  renderVerificationDetails,
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
type BankPaymentSource = Extract<PaymentSource, {tenderType: 'BankAccount'}>;
type CustomerProfile = components['schemas']['Profile'];
type PayByBankSession = components['schemas']['SessionData'] & {
  accessToken?: string;
};

type PaymentSdkEvent = {
  type?: 'success' | 'failure' | 'cancel' | 'error' | string;
  payload?: unknown;
  [key: string]: unknown;
};

type PaymentSdkInitConfiguration = {
  apiKey: string;
  accessToken: string;
  configId: string;
  containerId: string;
  onEvent: (event: PaymentSdkEvent) => void | Promise<void>;
  environment?: string;
  locale?: string;
  aggregatorSessionId?: string;
  publicKey?: string;
  pToken?: string;
};

const OTP_LENGTH = 6;
const PAY_BY_BANK_PROVIDER_CONTAINER_ID = 'commerce-hub-pbb-provider';

const DEFAULT_PAY_BY_BANK_OPTIONS = {
  apiKey: 'YqIvg89urE1WsAdgWwM1EiQTRM1ajSYCaLhnDvimvmHeB78A',
  configId: 'cce84049-0940-4926-9a54-9eaca0c09830',
  environment: 'qa',
  locale: 'en-US',
  paymentSdkUrl:
    'https://connect-qa.fiservapis.com/pbb/sdk/web/v2/js/PaymentSDK.js',
} satisfies Required<DesignConfigPayByBank>;

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

  @state()
  private bankFlowScreen?: 'provider' | 'provider-error' | 'outcome';

  @state()
  private bankLinkLoading = false;

  @state()
  private bankProviderError?: string;

  @state()
  private bankOutcomeSource?: BankPaymentSource;

  @state()
  private bankTerminalEvent?: PaymentSdkEvent;

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

  override disconnectedCallback() {
    super.disconnectedCallback();
    this.removePayByBankProviderContainer();
    destroyPaymentSdk();
  }

  private renderCurrentScreen(): TemplateResult {
    if (this.bankFlowScreen === 'provider') {
      return this.renderBankProviderScreen();
    }

    if (this.bankFlowScreen === 'provider-error') {
      return this.renderBankProviderErrorScreen();
    }

    if (this.bankFlowScreen === 'outcome') {
      return this.renderBankOutcomeScreen();
    }

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

  private renderBankProviderScreen(): TemplateResult {
    return renderWidgetShell({
      title: 'Add bank account',
      subtitle: 'Connect your bank account through a secure provider.',
      width: 'wide',
      content: renderProviderFrame({
        containerId: PAY_BY_BANK_PROVIDER_CONTAINER_ID,
        title: 'Secure bank provider',
        loadingLabel: this.bankLinkLoading
          ? 'Connecting to your bank...'
          : undefined,
      }),
    });
  }

  private renderBankProviderErrorScreen(): TemplateResult {
    return renderWidgetShell({
      title: 'Bank connection unavailable',
      subtitle:
        this.bankProviderError ??
        'We could not connect to your bank provider right now.',
      content: renderOutcomeShell({
        variant: 'danger',
        message: describePaymentSdkTerminalEvent(this.bankTerminalEvent),
        actions: html`
          ${renderButton({
            label: 'Retry',
            action: 'retry-bank-provider',
            disabled: this.bankLinkLoading,
          })}
          ${renderTextLinkButton({
            label: 'Back',
            action: 'back-to-payment-methods',
            disabled: this.bankLinkLoading,
          })}
        `,
      }),
    });
  }

  private renderBankOutcomeScreen(): TemplateResult {
    const outcome = resolveBankOutcome(this.bankOutcomeSource);

    return renderWidgetShell({
      title: outcome.title,
      subtitle: outcome.message,
      content: renderOutcomeShell({
        variant: outcome.variant,
        content: this.bankOutcomeSource
          ? renderVerificationDetails(
              bankSourceVerificationDetails(this.bankOutcomeSource)
            )
          : undefined,
        actions:
          outcome.kind === 'verified'
            ? renderButton({
                label: 'Continue',
                action: 'continue-bank-outcome',
              })
            : outcome.kind === 'pending'
            ? renderButton({
                label: 'Done',
                action: 'done-bank-outcome',
              })
            : html`
                ${renderButton({
                  label: 'Try again',
                  action: 'retry-bank-provider',
                  disabled: this.bankLinkLoading,
                })}
                ${renderTextLinkButton({
                  label: 'Use a different account',
                  action: 'use-different-bank-account',
                  disabled: this.bankLinkLoading,
                })}
              `,
      }),
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

    if (
      action === 'add-bank-account' ||
      action === 'retry-bank-provider' ||
      action === 'use-different-bank-account'
    ) {
      void this.startPayByBankFlow();
      return;
    }

    if (action === 'back-to-payment-methods') {
      this.resetBankFlow();
      return;
    }

    if (action === 'continue-bank-outcome' || action === 'done-bank-outcome') {
      this.resetBankFlow();
      return;
    }

    if (action === 'add-card') {
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

  private async startPayByBankFlow() {
    if (this.bankLinkLoading) {
      return;
    }

    const interactionId = this.requireInteractionId();

    if (!interactionId) {
      return;
    }

    this.bankFlowScreen = 'provider';
    this.bankProviderError = undefined;
    this.bankOutcomeSource = undefined;
    this.bankTerminalEvent = undefined;
    this.bankLinkLoading = true;
    this.ensurePayByBankProviderContainer(PAY_BY_BANK_PROVIDER_CONTAINER_ID);
    await this.updateComplete;

    try {
      await this.launchPayByBankProvider(
        interactionId,
        PAY_BY_BANK_PROVIDER_CONTAINER_ID
      );
    } catch (cause) {
      this.bankProviderError = apiErrorMessage(cause);
      this.bankFlowScreen = 'provider-error';
    } finally {
      this.bankLinkLoading = false;
    }
  }

  private async launchPayByBankProvider(
    interactionId: string,
    containerId: string
  ) {
    const existingBankSourceIds = await this.getExistingBankSourceIds(
      interactionId
    );
    const session = await this.requestCommerceHubJson<PayByBankSession>(
      '/pbb/session',
      interactionId,
      {method: 'GET', credentials: 'include'}
    );
    const {aggregatorSessionId, accessToken, pToken, publicKey} =
      resolvePayByBankSession(session);
    const payByBank = resolvePayByBankOptions(this.designConfig?.payByBank);

    await loadPaymentSdkScript(payByBank.paymentSdkUrl);

    const paymentSdk = window.PaymentSDK;

    if (!paymentSdk?.init) {
      throw new Error(
        'PaymentSDK.js loaded but PaymentSDK.init is not available on window.'
      );
    }

    await new Promise<void>((resolve, reject) => {
      let settled = false;

      destroyPaymentSdk();

      paymentSdk.init({
        apiKey: payByBank.apiKey,
        accessToken,
        configId: payByBank.configId,
        environment: payByBank.environment,
        locale: payByBank.locale,
        publicKey,
        pToken,
        aggregatorSessionId,
        containerId,
        onEvent: async (event) => {
          if (settled || !isTerminalPaymentSdkEvent(event)) {
            return;
          }

          this.bankTerminalEvent = event;
          destroyPaymentSdk();

          if (event.type !== 'success') {
            settled = true;
            reject(new Error(describePaymentSdkTerminalEvent(event)));
            return;
          }

          try {
            await this.finalizePayByBankSession(
              interactionId,
              aggregatorSessionId,
              pToken
            );
            const profile = await this.getCustomerProfile(interactionId);
            const bankSource = resolveAttachedBankSource(
              profile,
              existingBankSourceIds
            );
            const paymentSourceId = bankSource.id?.trim();

            if (!paymentSourceId) {
              throw new Error(
                'Pay by Bank completed but no bank payment source was returned by /customer.'
              );
            }

            const response = await this.createSdkClient(interactionId).POST(
              '/interaction/payment-source/{paymentSourceId}/attach',
              {
                params: {
                  path: {paymentSourceId},
                },
              }
            );
            const attachedInteraction = interactionResponseFromApi(response);

            this.selectedPaymentSourceId = paymentSourceId;
            this.bankOutcomeSource = bankSource;
            this.bankFlowScreen = 'outcome';
            this.setInteractionResponseFromSdk(
              withUpsertedSource(attachedInteraction, bankSource)
            );
            settled = true;
            resolve();
          } catch (cause) {
            settled = true;
            reject(cause);
          }
        },
      });
    });
  }

  private async getExistingBankSourceIds(
    interactionId: string
  ): Promise<Set<string>> {
    try {
      const profile = await this.getCustomerProfile(interactionId);

      return new Set(
        (profile.sources ?? [])
          .filter(isBankPaymentSource)
          .map((source) => source.id?.trim())
          .filter((sourceId): sourceId is string => Boolean(sourceId))
      );
    } catch {
      return new Set<string>();
    }
  }

  private async getCustomerProfile(
    interactionId: string
  ): Promise<CustomerProfile> {
    return this.requestCommerceHubJson<CustomerProfile>(
      '/customer',
      interactionId,
      {method: 'GET', credentials: 'include'}
    );
  }

  private async finalizePayByBankSession(
    interactionId: string,
    aggregatorSessionId: string,
    pToken: string
  ): Promise<void> {
    await this.requestCommerceHubJson<unknown>(
      `/pbb/session/${encodeURIComponent(
        aggregatorSessionId
      )}/${encodeURIComponent(pToken)}`,
      interactionId,
      {method: 'PUT', credentials: 'include'}
    );
  }

  private async requestCommerceHubJson<T>(
    path: string,
    interactionId: string,
    init: RequestInit
  ): Promise<T> {
    const headers = new Headers(init.headers);

    if (!headers.has('Accept')) {
      headers.set('Accept', 'application/json');
    }

    headers.set('x-interaction-id', interactionId);

    const request = new Request(`${DEFAULT_COMMERCE_HUB_BASE_URL}${path}`, {
      ...init,
      headers,
    });
    const response = await fetch(request);
    const contentType = response.headers.get('content-type') ?? '';
    const body =
      response.status === 204
        ? undefined
        : contentType.includes('application/json')
        ? await response.json()
        : await response.text();

    if (!response.ok) {
      throw new Error(apiErrorMessage(body) || response.statusText);
    }

    return body as T;
  }

  private resetBankFlow() {
    this.bankFlowScreen = undefined;
    this.bankProviderError = undefined;
    this.bankOutcomeSource = undefined;
    this.bankTerminalEvent = undefined;
    this.bankLinkLoading = false;
    this.removePayByBankProviderContainer();
  }

  private ensurePayByBankProviderContainer(containerId: string): HTMLElement {
    const existing = [...this.children].find(
      (child): child is HTMLElement =>
        child instanceof HTMLElement && child.id === containerId
    );
    const container = existing ?? document.createElement('div');

    container.id = containerId;
    container.slot = containerId;
    container.className = 'provider-frame-container';
    container.replaceChildren();

    if (!existing) {
      this.appendChild(container);
    }

    return container;
  }

  private removePayByBankProviderContainer() {
    [...this.children]
      .filter(
        (child): child is HTMLElement =>
          child instanceof HTMLElement &&
          child.id === PAY_BY_BANK_PROVIDER_CONTAINER_ID
      )
      .forEach((child) => child.remove());
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
  payByBank?: DesignConfigPayByBank;
}

export interface DesignConfigPayByBank {
  apiKey?: string;
  configId?: string;
  paymentSdkUrl?: string;
  environment?: string;
  locale?: string;
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

const resolvePayByBankOptions = (
  options?: DesignConfigPayByBank
): Required<DesignConfigPayByBank> => {
  const definedOverrides = Object.fromEntries(
    Object.entries(options ?? {}).filter(([, value]) => value !== undefined)
  ) as DesignConfigPayByBank;

  return {
    ...DEFAULT_PAY_BY_BANK_OPTIONS,
    ...definedOverrides,
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
  type: isBankPaymentSource(source) ? 'bank' : 'card',
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

  if (isBankPaymentSource(source)) {
    return 'Saved bank account';
  }

  return 'Dynamic session card';
};

const paymentSourceBrand = (source: PaymentSource): string => {
  if (source.tenderType === 'Card') {
    return source.card?.network ?? 'Card';
  }

  if (isBankPaymentSource(source)) {
    return source.bankAccount?.bankName ?? 'Bank account';
  }

  return 'DSC';
};

const paymentSourceLast4 = (source: PaymentSource): string => {
  if (source.tenderType === 'Card') {
    return lastFour(source.card?.cardNumber);
  }

  if (isBankPaymentSource(source)) {
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

const resolvePayByBankSession = (
  session: PayByBankSession
): {
  aggregatorSessionId: string;
  accessToken: string;
  pToken: string;
  publicKey: string;
} => {
  const aggregatorSessionId = session.aggregatorSessionId?.trim();
  const accessToken = session.tokenID?.trim() || session.accessToken?.trim();
  const pToken = session.pToken?.trim();
  const publicKey = session.publicKey?.trim();

  if (!aggregatorSessionId || !accessToken || !pToken || !publicKey) {
    throw new Error(
      'The /pbb/session response is missing one or more required values.'
    );
  }

  return {
    aggregatorSessionId,
    accessToken,
    pToken,
    publicKey,
  };
};

const isTerminalPaymentSdkEvent = (event: PaymentSdkEvent): boolean =>
  event.type === 'success' ||
  event.type === 'cancel' ||
  event.type === 'failure' ||
  event.type === 'error';

const describePaymentSdkTerminalEvent = (event?: PaymentSdkEvent): string => {
  if (typeof event?.payload === 'string' && event.payload.trim()) {
    return event.payload;
  }

  if (event?.type === 'cancel') {
    return 'Pay by Bank was cancelled.';
  }

  if (event?.type === 'failure' || event?.type === 'error') {
    return 'Pay by Bank failed.';
  }

  return 'Pay by Bank did not complete successfully.';
};

const resolveAttachedBankSource = (
  profile: CustomerProfile,
  existingBankSourceIds: Set<string>
): BankPaymentSource => {
  const bankSources = (profile.sources ?? []).filter(isBankPaymentSource);

  const bankSource =
    bankSources.find((source) => {
      const sourceId = source.id?.trim();

      return sourceId ? !existingBankSourceIds.has(sourceId) : false;
    }) ?? bankSources[0];

  if (!bankSource) {
    throw new Error(
      'Pay by Bank completed but no bank payment source was returned by /customer.'
    );
  }

  return bankSource;
};

const withUpsertedSource = (
  interactionResponse: InteractionResponse,
  source: PaymentSource
): InteractionResponse => {
  const paymentSources = interactionResponse.paymentSources ?? [];
  const nextPaymentSources = paymentSources.some(
    (paymentSource) => paymentSource.id === source.id
  )
    ? paymentSources.map((paymentSource) =>
        paymentSource.id === source.id ? source : paymentSource
      )
    : [source, ...paymentSources];

  return {
    ...interactionResponse,
    selectedSource: source,
    paymentSources: nextPaymentSources,
  };
};

type BankOutcome = {
  kind: 'verified' | 'pending' | 'failed';
  variant: 'success' | 'warning' | 'danger';
  title: string;
  message: string;
};

const resolveBankOutcome = (source?: PaymentSource): BankOutcome => {
  const status = source?.verificationInfo?.status;

  if (status === 'VERIFIED') {
    return {
      kind: 'verified',
      variant: 'success',
      title: 'Bank account verified',
      message: 'Your bank account is connected and ready to use.',
    };
  }

  if (status === 'UNDER_REVIEW' || status === 'REQUIRE_INFO') {
    return {
      kind: 'pending',
      variant: 'warning',
      title: 'Verification pending review',
      message: 'We will update this bank account after review is complete.',
    };
  }

  return {
    kind: 'failed',
    variant: 'danger',
    title: 'Bank account not verified',
    message: 'This bank account could not be verified.',
  };
};

const bankSourceVerificationDetails = (
  source: BankPaymentSource
): {label: string; value: string}[] => [
  {label: 'Bank', value: source.bankAccount?.bankName ?? 'Bank account'},
  {
    label: 'Last 4 digits',
    value: lastFour(source.bankAccount?.accountNumber),
  },
  {
    label: 'Verification status',
    value: verificationStatusLabel(source.verificationInfo?.status),
  },
];

const verificationStatusLabel = (
  status?: NonNullable<PaymentSource['verificationInfo']>['status']
): string => {
  if (status === 'VERIFIED') {
    return 'Verified';
  }

  if (status === 'UNDER_REVIEW' || status === 'REQUIRE_INFO') {
    return 'Pending review';
  }

  return 'Not verified';
};

const isBankPaymentSource = (
  source: PaymentSource
): source is BankPaymentSource =>
  source.tenderType === 'BankAccount' ||
  (source.tenderType as string) === 'BANK_ACCOUNT';

let paymentSdkScriptPromise: Promise<void> | undefined;
let paymentSdkScriptUrl: string | undefined;

const loadPaymentSdkScript = async (scriptUrl: string): Promise<void> => {
  if (window.PaymentSDK?.init) {
    return;
  }

  if (paymentSdkScriptPromise && paymentSdkScriptUrl === scriptUrl) {
    await paymentSdkScriptPromise;
    return;
  }

  paymentSdkScriptUrl = scriptUrl;
  paymentSdkScriptPromise = new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(
      `script[data-commerce-hub-pay-by-bank-sdk="true"][src="${scriptUrl}"]`
    );
    const script = existing ?? document.createElement('script');

    const cleanup = () => {
      script.removeEventListener('load', handleLoad);
      script.removeEventListener('error', handleError);
    };

    const handleLoad = () => {
      cleanup();
      resolve();
    };

    const handleError = () => {
      cleanup();
      paymentSdkScriptPromise = undefined;
      paymentSdkScriptUrl = undefined;
      reject(new Error(`Unable to load Pay by Bank script: ${scriptUrl}`));
    };

    script.addEventListener('load', handleLoad, {once: true});
    script.addEventListener('error', handleError, {once: true});

    if (!existing) {
      script.src = scriptUrl;
      script.async = true;
      script.dataset.commerceHubPayByBankSdk = 'true';
      document.head.appendChild(script);
    }
  });

  await paymentSdkScriptPromise;

  if (!window.PaymentSDK?.init) {
    throw new Error(
      `Pay by Bank script loaded but window.PaymentSDK.init is unavailable: ${scriptUrl}`
    );
  }
};

const destroyPaymentSdk = () => {
  try {
    window.PaymentSDK?.destroy?.();
  } catch {
    // Ignore provider teardown errors.
  }
};

declare global {
  interface Window {
    PaymentSDK?: {
      init: (configuration: PaymentSdkInitConfiguration) => void;
      destroy?: () => void;
    };
  }

  interface HTMLElementEventMap {
    [ON_SUCCESS_EVENT]: OnSuccessEvent;
    [ON_ERROR_EVENT]: OnErrorEvent;
  }

  interface HTMLElementTagNameMap {
    'commerce-hub-connect': CommerceHubConnect;
  }
}
