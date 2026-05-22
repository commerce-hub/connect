import {LitElement, html, type PropertyValues, type TemplateResult} from 'lit';
import {customElement, property, state} from 'lit/decorators.js';

import type {components} from './generated/openapi.js';
import {
  createCommerceHubClient,
  resolveCommerceHubBaseURL,
  type CommerceHubBaseURLInput,
} from './internal/api-client.js';
import {
  resolvePaymentMethodIconDataUri,
  resolvePaymentMethodIconName,
} from './internal/payment-method-icons.js';
import {primitiveStyles} from './internal/styles.js';
import {
  renderAlert,
  renderButton,
  renderEmptyState,
  renderFormGrid,
  renderOutcomeShell,
  renderOtpGroup,
  renderOtpResend,
  renderPaymentMethodRow,
  renderPaymentMethodSkeletonRows,
  renderProviderFrame,
  renderSelectedPaymentMethod,
  renderSelectField,
  renderSourceAction,
  renderTextField,
  renderTextLinkButton,
  renderUploadRow,
  renderVerificationStatusBadge,
  renderWidgetShell,
} from './internal/primitives.js';
import type {
  FlowActionName,
  PaymentMethod,
  WidgetShellOptions,
} from './internal/types.js';

export {
  COMMERCE_HUB_BASE_URLS,
  createCommerceHubClient,
  DEFAULT_COMMERCE_HUB_BASE_URL,
  resolveCommerceHubBaseURL,
  type CommerceHubBaseURLInput,
  type CommerceHubBaseURLPreset,
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

export type PaymentSource = NonNullable<
  InteractionResponse['paymentSources']
>[number];
export type OnSuccessEvent = CustomEvent<PaymentSource>;
export type OnErrorEvent = CustomEvent<InteractionError>;

export const ON_SUCCESS_EVENT = 'onSuccess';
export const ON_ERROR_EVENT = 'onError';

type BankPaymentSource = Extract<PaymentSource, {tenderType: 'BankAccount'}>;
type CardPaymentSource = Extract<PaymentSource, {tenderType: 'Card'}>;
type NativePaymentSource = Extract<
  PaymentSource,
  {tenderType: 'NativeAccount'}
>;
type VerificationInfo = NonNullable<PaymentSource['verificationInfo']>;
type CardSourcePayload = Omit<CardPaymentSource, 'tenderType'> & {
  tenderType: 'CARD';
};
type BankAccountSourcePayload = Omit<BankPaymentSource, 'tenderType'> & {
  tenderType: 'BANK_ACCOUNT';
  bankAccount: NonNullable<BankPaymentSource['bankAccount']>;
};
type Address = components['schemas']['Address'];
type BillingAddressResponse = components['schemas']['StringHolder'];
type VerificationResponse = components['schemas']['VerificationResponse'];
type NativeAccountBalanceInfo =
  components['schemas']['NativeAccountBalanceInfo'];
type NativeAccountBalanceMap = Record<string, NativeAccountBalanceInfo>;
type PayByBankSession = components['schemas']['SessionData'] & {
  accessToken?: string;
};
type CardDraft = {
  name: string;
  fullName: string;
  cardNumber: string;
  expirationDate: string;
  cvv: string;
  billingAddressValue: string;
  country: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  zip: string;
};
type BankAccountDraft = {
  routingNumber: string;
  accountNumber: string;
  accountNumberReEntered: string;
};
type SensitiveCardField = 'cardNumber' | 'cvv';
type SensitiveBankAccountField =
  | 'routingNumber'
  | 'accountNumber'
  | 'accountNumberReEntered';
type CardEncryptionStatus =
  | 'idle'
  | 'dirty'
  | 'encrypting'
  | 'encrypted'
  | 'failed';
type CardFieldEncryptionState = {
  status: CardEncryptionStatus;
  normalizedValue: string;
  encryptedValue?: string;
};
type CardEncryptionState = Record<SensitiveCardField, CardFieldEncryptionState>;
type BankAccountEncryptionState = Record<
  SensitiveBankAccountField,
  CardFieldEncryptionState
>;
type CardDraftErrors = Partial<Record<keyof CardDraft, string>>;
type BankAccountDraftErrors = Partial<Record<keyof BankAccountDraft, string>>;
type AllowedTenderOptions = {
  card: boolean;
  bankAccount: boolean;
  nativeAccount: boolean;
};
type PaymentSourceToPaymentMethodOptions = {
  selected?: boolean;
  nativeBalances?: NativeAccountBalanceMap;
  nativeBalanceLoadingSourceIds?: readonly string[];
};
type VerificationOverlayAction =
  | 'verify-payment-source'
  | 'submit-required-info';

type PaymentSdkEvent = {
  type?: 'success' | 'failure' | 'cancel' | 'error' | string;
  payload?: unknown;
  [key: string]: unknown;
};

type PaymentSdkInitConfiguration = {
  apiKey: string;
  accessToken: string;
  containerId: string;
  locale: string;
  appearance: PaymentSdkAppearance;
  configId: string;
  onEvent: (event: PaymentSdkEvent) => void | Promise<void>;
  environment?: string;
  aggregatorSessionId?: string;
  publicKey?: string;
  pToken?: string;
};

type PaymentSdkAppearance = {
  branding: PaymentSdkAppearanceBranding;
};

type PaymentSdkAppearanceBranding = Partial<{
  backgroundColor: string;
  primaryColor: string;
  primaryTextColor: string;
  secondaryTextColor: string;
  buttonColor: string;
  buttonTextColor: string;
  dangerColor: string;
  successColor: string;
  borderColor: string;
  placeholderColor: string;
  fontFamily: string;
  borderRadius: string;
}>;

const OTP_LENGTH = 6;
const VERIFICATION_OVERLAY_MIN_DURATION_MS = 2000;
const PAY_BY_BANK_PROVIDER_CONTAINER_ID = 'commerce-hub-pbb-provider';
const NEW_BILLING_ADDRESS_VALUE = '__new__';
const BILLING_COUNTRY_OPTIONS = [
  {value: '', label: 'Select country or region'},
  {value: 'US', label: 'United States'},
];
const BILLING_STATE_OPTIONS = [
  ['AL', 'Alabama'],
  ['AK', 'Alaska'],
  ['AZ', 'Arizona'],
  ['AR', 'Arkansas'],
  ['CA', 'California'],
  ['CO', 'Colorado'],
  ['CT', 'Connecticut'],
  ['DE', 'Delaware'],
  ['FL', 'Florida'],
  ['GA', 'Georgia'],
  ['HI', 'Hawaii'],
  ['ID', 'Idaho'],
  ['IL', 'Illinois'],
  ['IN', 'Indiana'],
  ['IA', 'Iowa'],
  ['KS', 'Kansas'],
  ['KY', 'Kentucky'],
  ['LA', 'Louisiana'],
  ['ME', 'Maine'],
  ['MD', 'Maryland'],
  ['MA', 'Massachusetts'],
  ['MI', 'Michigan'],
  ['MN', 'Minnesota'],
  ['MS', 'Mississippi'],
  ['MO', 'Missouri'],
  ['MT', 'Montana'],
  ['NE', 'Nebraska'],
  ['NV', 'Nevada'],
  ['NH', 'New Hampshire'],
  ['NJ', 'New Jersey'],
  ['NM', 'New Mexico'],
  ['NY', 'New York'],
  ['NC', 'North Carolina'],
  ['ND', 'North Dakota'],
  ['OH', 'Ohio'],
  ['OK', 'Oklahoma'],
  ['OR', 'Oregon'],
  ['PA', 'Pennsylvania'],
  ['RI', 'Rhode Island'],
  ['SC', 'South Carolina'],
  ['SD', 'South Dakota'],
  ['TN', 'Tennessee'],
  ['TX', 'Texas'],
  ['UT', 'Utah'],
  ['VT', 'Vermont'],
  ['VA', 'Virginia'],
  ['WA', 'Washington'],
  ['WV', 'West Virginia'],
  ['WI', 'Wisconsin'],
  ['WY', 'Wyoming'],
  ['DC', 'District of Columbia'],
].map(([value, label]) => ({value, label}));
const BILLING_STATE_SELECT_OPTIONS = [
  {value: '', label: 'Select state'},
  ...BILLING_STATE_OPTIONS,
];
const DEFAULT_PAY_BY_BANK_OPTIONS = {
  apiKey: 'YqIvg89urE1WsAdgWwM1EiQTRM1ajSYCaLhnDvimvmHeB78A',
  configId: 'cce84049-0940-4926-9a54-9eaca0c09830',
  environment: 'qa',
  locale: 'en-US',
  paymentSdkUrl:
    'https://connect-qa.fiservapis.com/pbb/sdk/web/v2/js/PaymentSDK.js',
} satisfies Required<DesignConfigPayByBank>;
const DELETE_CONFIRMATION_TIMEOUT_MS = 5000;

const demoPaymentMethods: PaymentMethod[] = [
  {
    id: 'visa-1111',
    label: 'James Anderson',
    type: 'card',
    brand: 'VISA',
    last4: '1111',
    status: 'verified',
  },
  {
    id: 'amex-8000',
    label: 'James Anderson',
    type: 'card',
    brand: 'AMEX',
    last4: '8000',
    status: 'not-verified',
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

  /**
   * CommerceHub API base URL preset or custom origin for SDK-managed requests.
   */
  @property({attribute: 'base-url'})
  baseURL?: CommerceHubBaseURLInput;

  @state()
  private selectedPaymentSourceId?: string;

  @state()
  private otpValue = '';

  @state()
  private pendingAction?: FlowActionName;

  @state()
  private minimumVerificationOverlayAction?: VerificationOverlayAction;

  @state()
  private otpErrorMessage?: string;

  @state()
  private bankFlowScreen?: 'provider' | 'outcome' | 'manual';

  @state()
  private bankLinkLoading = false;

  @state()
  @state()
  private bankOutcomeSource?: BankPaymentSource;

  @state()
  private bankAccountDraft: BankAccountDraft = createBankAccountDraft();

  @state()
  private bankAccountDraftErrors: BankAccountDraftErrors = {};

  @state()
  private bankAccountEncryption: BankAccountEncryptionState =
    createBankAccountEncryptionState();

  @state()
  private bankAccountSubmitError?: string;

  @state()
  @state()
  private cardFlowScreen?: 'form' | 'error';

  @state()
  private cardDraft: CardDraft = createCardDraft();

  @state()
  private cardDraftErrors: CardDraftErrors = {};

  @state()
  private cardEncryption: CardEncryptionState = createCardEncryptionState();

  @state()
  private cardSubmitError?: string;

  @state()
  private billingAddresses: Address[] = [];

  @state()
  private nativeAccountBalances: NativeAccountBalanceMap = {};

  @state()
  private nativeBalanceLoadingSourceIds: string[] = [];

  @state()
  private paymentSourceView?: 'list' | 'selected';

  @state()
  private paymentSourceEditMode = false;

  @state()
  private deleteConfirmationPaymentSourceId?: string;

  private deleteConfirmationTimeoutId?: number;

  @state()
  private savedSourceVerificationSource?: PaymentSource;

  @state()
  private savedSourceVerificationFailed = false;

  @state()
  private requiredInfoSource?: PaymentSource;

  @state()
  private requiredInfoValues: Record<string, string> = {};

  @state()
  private requiredInfoFileNames: Record<string, string> = {};

  @state()
  private requiredInfoSubmitError?: string;

  private requiredInfoFiles: Record<string, File> = {};

  private pendingRequiredInfoDocKey?: string;

  private interactionRefreshInteractionId?: string;
  private interactionRefreshPromise?: Promise<InteractionResponse>;
  private nativeBalanceFetchKey?: string;
  private nativeBalanceQueuedFetchKey?: string;
  private minimumVerificationOverlayToken = 0;

  protected override willUpdate(changedProperties: PropertyValues<this>) {
    if (
      changedProperties.has('interactionResponse') &&
      this.interactionResponse
    ) {
      const previousInteractionResponse = changedProperties.get(
        'interactionResponse'
      ) as InteractionResponse | undefined;

      if (
        previousInteractionResponse?.interactionId !==
        this.interactionResponse.interactionId
      ) {
        this.clearDeletePaymentSourceConfirmation();
        this.paymentSourceView = undefined;
        this.paymentSourceEditMode = false;
        this.interactionRefreshInteractionId = undefined;
        this.interactionRefreshPromise = undefined;
        this.nativeBalanceFetchKey = undefined;
        this.nativeBalanceQueuedFetchKey = undefined;
        this.nativeAccountBalances = {};
        this.nativeBalanceLoadingSourceIds = [];
        this.billingAddresses = [];
        this.resetSavedSourceVerification();
        this.resetRequiredInfo();
      }

      if (
        !this.interactionResponse.paymentSources?.length &&
        !this.interactionResponse.selectedSource
      ) {
        this.paymentSourceEditMode = false;
      }

      this.syncBillingAddressesFromInteractionResponse(
        this.interactionResponse
      );
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

    if (
      changedProperties.has('interactionResponse') &&
      this.deleteConfirmationPaymentSourceId &&
      !this.findPaymentSourceById(this.deleteConfirmationPaymentSourceId)
    ) {
      this.clearDeletePaymentSourceConfirmation();
    }

    if (changedProperties.has('interactionResponse')) {
      void this.refreshPaymentSourcesFromInteraction();
    }
  }

  override render() {
    return html`
      <div
        @click=${this.handleClick}
        @input=${this.handleInput}
        @keydown=${this.handleKeyDown}
        @change=${this.handleChange}
        @paste=${this.handlePaste}
        @focusin=${this.handleFocusIn}
        @focusout=${this.handleFocusLost}
        @blur=${this.handleFocusLost}
      >
        ${this.renderCurrentScreen()}
      </div>
    `;
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    this.clearDeletePaymentSourceConfirmation();
    this.removePayByBankProviderContainer();
    destroyPaymentSdk();
  }

  private renderWidgetShell({
    busy = false,
    overlay,
    ...options
  }: WidgetShellOptions): TemplateResult {
    const minimumOverlay = verificationActionLoadingOverlay(
      this.minimumVerificationOverlayAction
    );

    return renderWidgetShell({
      ...options,
      busy: busy || Boolean(minimumOverlay),
      overlay: overlay ?? minimumOverlay,
    });
  }

  private showMinimumVerificationOverlay(action: VerificationOverlayAction) {
    const overlayToken = (this.minimumVerificationOverlayToken += 1);

    this.minimumVerificationOverlayAction = action;
    window.setTimeout(() => {
      if (this.minimumVerificationOverlayToken === overlayToken) {
        this.minimumVerificationOverlayAction = undefined;
      }
    }, VERIFICATION_OVERLAY_MIN_DURATION_MS);
  }

  private renderCurrentScreen(): TemplateResult {
    if (this.bankFlowScreen === 'provider') {
      return this.renderBankProviderScreen();
    }

    if (this.bankFlowScreen === 'outcome') {
      return this.renderBankOutcomeScreen();
    }

    if (this.bankFlowScreen === 'manual') {
      return this.renderManualBankAccountScreen();
    }

    if (this.cardFlowScreen === 'form') {
      return this.renderAddCardScreen();
    }

    if (this.cardFlowScreen === 'error') {
      return this.renderCardErrorScreen();
    }

    if (this.requiredInfoSource) {
      return this.renderRequiredInfoScreen();
    }

    if (this.savedSourceVerificationSource) {
      return this.renderSavedSourceVerificationOutcomeScreen();
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
    const destination = resolveOtpDestination(this.interactionResponse);

    return this.renderWidgetShell({
      title: copy.title,
      subtitle: copy.subtitle ?? defaultOtpSubtitle(destination),
      showClose: false,
      showDivider: false,
      busy: isSubmitting || isResending,
      overlay: isSubmitting
        ? renderWidgetLoadingOverlay({
            title: 'Verifying code',
            helper: 'Verifying your code, please wait.',
          })
        : isResending
        ? renderWidgetLoadingOverlay({
            title: 'Sending code',
            helper: 'Sending a new code, please wait.',
          })
        : undefined,
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
          <div class="primitive-footer">
            ${renderButton({
              label: isSubmitting
                ? copy.verifyingButton
                : isFailed
                ? copy.tryAgainButton
                : copy.verifyButton,
              icon: !isSubmitting && !isFailed ? 'check' : undefined,
              variant: 'primary',
              action: 'verify-otp',
              loading: isSubmitting,
              disabled: isSubmitting || this.otpValue.length < OTP_LENGTH,
            })}
          </div>
          <div class="otp-support">
            <p class="otp-support-copy otp-resend-prefix">
              ${copy.resendPrefix}
            </p>
            <div class="otp-support-actions">
              ${renderOtpResend({
                label: isResending
                  ? copy.resendPendingButton
                  : copy.resendButton,
                action: 'resend-otp',
                loading: isResending,
                disabled: isSubmitting || isResending,
              })}
            </div>
          </div>
        </div>
      `,
    });
  }

  private renderPaymentSourceScreen(): TemplateResult {
    const copy = resolvePaymentMethodsCopy(this.designConfig);
    const paymentMethods = paymentMethodsFromInteractionResponse(
      this.interactionResponse,
      {
        nativeBalances: this.nativeAccountBalances,
        nativeBalanceLoadingSourceIds: this.nativeBalanceLoadingSourceIds,
      }
    );
    const allowedTenderOptions = allowedTenderOptionsFromInteractionResponse(
      this.interactionResponse
    );
    const hasAddPaymentActions =
      allowedTenderOptions.card || allowedTenderOptions.bankAccount;
    const isPaymentSourceActionPending =
      this.pendingAction === 'attach-payment-source' ||
      this.pendingAction === 'verify-payment-source' ||
      this.pendingAction === 'delete-payment-source';
    const isEditingPaymentSources =
      this.paymentSourceEditMode && paymentMethods.length > 0;

    if (this.shouldRenderPaymentSourceRefreshSkeleton()) {
      return this.renderWidgetShell({
        title: copy.title,
        showClose: false,
        content: html`
          <div class="payment-flow">
            ${renderPaymentMethodSkeletonRows({
              count: 3,
              label: 'Loading payment methods',
            })}
          </div>
        `,
      });
    }

    if (!paymentMethods.length) {
      return this.renderNoSavedPaymentMethods();
    }

    if (this.shouldRenderSelectedPaymentSourceScreen()) {
      return this.renderSelectedPaymentSourceScreen();
    }

    this.queueNativeAccountBalanceRefresh();

    return this.renderWidgetShell({
      title: copy.title,
      headerAction: renderTextLinkButton({
        label: isEditingPaymentSources ? 'Done' : 'Edit',
        action: 'toggle-payment-source-edit-mode',
        disabled: isPaymentSourceActionPending,
      }),
      showClose: false,
      busy: isPaymentSourceActionPending,
      overlay: paymentSourceActionLoadingOverlay(this.pendingAction),
      content: html`
        <div class="payment-flow">
          <div class="primitive-stack" aria-label="Payment methods">
            ${paymentMethods.map((method) =>
              renderPaymentMethodRow(
                {
                  ...method,
                  disabled: method.disabled || isPaymentSourceActionPending,
                },
                {
                  variant: isEditingPaymentSources ? 'edit' : 'default',
                  deleteDisabled: isPaymentSourceActionPending,
                  confirmingDelete:
                    method.id === this.deleteConfirmationPaymentSourceId,
                  selected: method.id === this.selectedPaymentSourceId,
                }
              )
            )}
          </div>
          ${isEditingPaymentSources
            ? ''
            : !hasAddPaymentActions
            ? ''
            : html`
                <div class="payment-action-links">
                  ${allowedTenderOptions.card
                    ? renderSourceAction({
                        label: copy.addCardTitle,
                        action: 'add-card',
                        icon: 'card',
                        variant: 'link',
                        disabled: isPaymentSourceActionPending,
                      })
                    : ''}
                  ${allowedTenderOptions.bankAccount
                    ? renderSourceAction({
                        label: copy.addBankAccountTitle,
                        action: 'add-bank-account',
                        icon: 'bank',
                        variant: 'link',
                        disabled: isPaymentSourceActionPending,
                      })
                    : ''}
                </div>
              `}
        </div>
      `,
    });
  }

  private renderSelectedPaymentSourceScreen(): TemplateResult {
    const selectedSource = selectedPaymentSourceFromInteractionResponse(
      this.interactionResponse,
      this.selectedPaymentSourceId
    );

    if (!selectedSource) {
      this.paymentSourceView = 'list';
      return this.renderPaymentSourceScreen();
    }

    return this.renderWidgetShell({
      title: 'Payment method saved',
      headerAction: renderTextLinkButton({
        label: 'Change',
        action: 'change-payment-source',
        disabled: this.pendingAction === 'attach-payment-source',
      }),
      showClose: false,
      showDivider: false,
      busy: this.pendingAction === 'attach-payment-source',
      overlay:
        this.pendingAction === 'attach-payment-source'
          ? renderWidgetLoadingOverlay({
              title: isBankPaymentSource(selectedSource)
                ? 'Saving bank account'
                : 'Saving payment method',
              helper: 'Saving your payment method, please wait.',
            })
          : undefined,
      content: html`
        <div class="payment-flow">
          ${renderSelectedPaymentMethod(
            paymentSourceToPaymentMethod(selectedSource, {
              selected: true,
              nativeBalances: this.nativeAccountBalances,
              nativeBalanceLoadingSourceIds: this.nativeBalanceLoadingSourceIds,
            })
          )}
        </div>
      `,
    });
  }

  private shouldRenderSelectedPaymentSourceScreen(): boolean {
    if (this.paymentSourceView === 'list') {
      return false;
    }

    return (
      this.interactionResponse?.status === 'PAYMENT_SOURCE_ATTACHED' ||
      this.paymentSourceView === 'selected'
    );
  }

  private shouldRenderPaymentSourceRefreshSkeleton(): boolean {
    const interactionResponse = this.interactionResponse;
    const interactionId = interactionResponse?.interactionId;

    if (!interactionId) {
      return false;
    }

    if (this.interactionRefreshPromise) {
      return true;
    }

    return (
      this.shouldRefreshPaymentSourcesFromInteraction() &&
      interactionResponse?.paymentSources === undefined
    );
  }

  private renderSavedSourceVerificationOutcomeScreen(): TemplateResult {
    const source = this.savedSourceVerificationSource;
    const outcome = resolveSavedSourceVerificationOutcome(
      source,
      this.savedSourceVerificationFailed
    );
    const showHeaderBack =
      outcome.kind === 'declined' || outcome.kind === 'pending';

    return this.renderWidgetShell({
      title: outcome.title,
      headerAction: showHeaderBack
        ? renderTextLinkButton({
            label: 'Back',
            action: 'done-payment-source-verification',
          })
        : undefined,
      showClose: false,
      showDivider: false,
      content: html`
        <div class="verification-outcome-flow">
          ${renderAlert({
            variant: outcome.variant,
            message: outcome.message,
          })}
          ${source ? renderRequiredInfoSourceCard(source) : ''}
          ${showHeaderBack
            ? ''
            : html`
                <div class="primitive-footer">
                  ${renderButton({
                    label: 'Back to payment methods',
                    action: 'done-payment-source-verification',
                  })}
                </div>
              `}
        </div>
      `,
    });
  }

  private renderRequiredInfoScreen(): TemplateResult {
    const source = this.requiredInfoSource;

    if (!source) {
      return this.renderPaymentSourceScreen();
    }

    const docs = requiredInfoDocs(source);
    const firstUploadDocKey = firstRequiredInfoUploadDocKey(docs);
    const isSubmitting = this.pendingAction === 'submit-required-info';
    const canSubmit = this.canSubmitRequiredInfo();

    return this.renderWidgetShell({
      title: 'Complete account verification',
      headerAction: renderTextLinkButton({
        label: 'Back',
        action: 'back-to-payment-methods',
        disabled: isSubmitting,
      }),
      showClose: false,
      showDivider: false,
      busy: isSubmitting,
      overlay: isSubmitting
        ? renderWidgetLoadingOverlay({
            title: 'Verifying account',
            helper: 'Reviewing your verification information, please wait.',
          })
        : undefined,
      content: html`
        <div class="required-info-flow">
          ${renderRequiredInfoSourceCard(source)}
          ${this.requiredInfoSubmitError
            ? renderAlert({
                variant: 'danger',
                message: this.requiredInfoSubmitError,
              })
            : ''}

          <div class="required-info-documents">
            <p class="required-info-section-title">Required information</p>
            <div class="primitive-stack">
              ${docs.map((doc, index) => {
                const key = requiredInfoDocKey(doc, index);
                const currentValue = isRequiredInfoTextDoc(doc)
                  ? this.requiredInfoValues[key]
                  : this.requiredInfoFileNames[key];

                if (isRequiredInfoTextDoc(doc)) {
                  return renderRequiredInfoTextField({
                    doc,
                    key,
                    value: currentValue ?? '',
                  });
                }

                return html`
                  <div
                    class="required-info-document required-document-text-row"
                    data-required-info-doc-key=${key}
                    data-required-info-requirement=${requiredInfoRequirementKind(
                      doc
                    )}
                  >
                    <div class="required-info-document-heading">
                      <span class="required-info-document-name"
                        >${requiredInfoDocLabel(doc)}</span
                      >
                      ${renderRequiredInfoRequirementBadge(doc)}
                    </div>
                    ${renderUploadRow({
                      label: 'Required document',
                      requirements: requiredInfoDocLabel(doc),
                      actionLabel: 'Choose file',
                      fileName: currentValue,
                      action: 'open-required-info-file-picker',
                      disabled: isSubmitting,
                    })}
                  </div>
                `;
              })}
            </div>
          </div>

          ${firstUploadDocKey
            ? html`
                <input
                  class="required-info-file-input"
                  type="file"
                  data-required-info-file-input="true"
                  hidden
                />
              `
            : ''}

          <div
            class="primitive-footer"
            data-required-info-doc-key=${firstUploadDocKey ?? ''}
          >
            ${renderButton({
              label: isSubmitting ? 'Verifying...' : 'Verify',
              action: 'submit-required-info',
              loading: isSubmitting,
              disabled: isSubmitting || !canSubmit,
            })}
          </div>
        </div>
      `,
    });
  }

  private renderNoSavedPaymentMethods(): TemplateResult {
    const copy = resolveNoSavedPaymentMethodsCopy(this.designConfig);
    const showHelperCopy = Boolean(copy.emptyTitle || copy.emptyMessage);
    const isDeletePending = this.pendingAction === 'delete-payment-source';
    const allowedTenderOptions = allowedTenderOptionsFromInteractionResponse(
      this.interactionResponse
    );
    const hasAddPaymentActions =
      allowedTenderOptions.card || allowedTenderOptions.bankAccount;

    return this.renderWidgetShell({
      title: copy.title,
      subtitle: copy.subtitle,
      showClose: false,
      showDivider: false,
      content: html`
        <div class="payment-flow">
          ${showHelperCopy
            ? renderEmptyState({
                title: copy.emptyTitle,
                message: copy.emptyMessage,
              })
            : ''}
          ${hasAddPaymentActions
            ? html`
                <div class="payment-action-links">
                  ${allowedTenderOptions.card
                    ? renderSourceAction({
                        label: copy.addCardTitle,
                        subtitle: copy.addCardSubtitle,
                        action: 'add-card',
                        icon: 'card',
                        variant: 'link',
                        disabled: isDeletePending,
                      })
                    : ''}
                  ${allowedTenderOptions.bankAccount
                    ? renderSourceAction({
                        label: copy.addBankAccountTitle,
                        subtitle: copy.addBankAccountSubtitle,
                        action: 'add-bank-account',
                        icon: 'bank',
                        variant: 'link',
                        disabled: isDeletePending,
                      })
                    : ''}
                </div>
              `
            : ''}
        </div>
      `,
    });
  }

  private renderAddCardScreen(): TemplateResult {
    const isSaving = this.pendingAction === 'save-card';
    const isEncrypting =
      this.cardEncryption.cardNumber.status === 'encrypting' ||
      this.cardEncryption.cvv.status === 'encrypting';
    const billingAddressOptions = [
      ...this.billingAddresses.map((address) => ({
        value: address.id ?? '',
        label: billingAddressLabel(address),
      })),
      {
        value: NEW_BILLING_ADDRESS_VALUE,
        label: 'Add new billing address',
      },
    ];
    const shouldRenderNewBillingAddressFields =
      this.cardDraft.billingAddressValue === NEW_BILLING_ADDRESS_VALUE;
    const billingAddressFields: TemplateResult[] = [];

    billingAddressFields.push(
      renderSelectField({
        id: 'billing-address',
        name: 'billingAddress',
        label: 'Billing address',
        value: this.cardDraft.billingAddressValue,
        options: billingAddressOptions,
        span: 'full',
        variant: 'card-form',
        dataField: 'billingAddressValue',
        error: this.cardDraftErrors.billingAddressValue,
        disabled: isSaving,
      })
    );

    if (shouldRenderNewBillingAddressFields) {
      billingAddressFields.push(
        renderSelectField({
          id: 'billing-country',
          name: 'country',
          label: 'Country or region',
          value: this.cardDraft.country,
          options: BILLING_COUNTRY_OPTIONS,
          span: 'full',
          variant: 'card-form',
          dataField: 'country',
          error: this.cardDraftErrors.country,
          disabled: isSaving,
        }),
        renderTextField({
          id: 'billing-address-line-1',
          name: 'addressLine1',
          label: 'Address',
          value: this.cardDraft.addressLine1,
          placeholder: 'Street address',
          span: 'full',
          variant: 'card-form',
          autocomplete: 'address-line1',
          dataField: 'addressLine1',
          error: this.cardDraftErrors.addressLine1,
          disabled: isSaving,
        }),
        renderTextField({
          id: 'billing-address-line-2',
          name: 'addressLine2',
          label: 'Address line 2',
          value: this.cardDraft.addressLine2,
          placeholder: 'Apartment, suite, unit',
          span: 'full',
          variant: 'card-form',
          autocomplete: 'address-line2',
          dataField: 'addressLine2',
          error: this.cardDraftErrors.addressLine2,
          disabled: isSaving,
        }),
        renderTextField({
          id: 'billing-city',
          name: 'city',
          label: 'City',
          value: this.cardDraft.city,
          span: 'full',
          variant: 'card-form',
          autocomplete: 'address-level2',
          dataField: 'city',
          error: this.cardDraftErrors.city,
          disabled: isSaving,
        }),
        renderSelectField({
          id: 'billing-state',
          name: 'state',
          label: 'State',
          value: this.cardDraft.state,
          options: BILLING_STATE_SELECT_OPTIONS,
          span: 'full',
          variant: 'card-form',
          dataField: 'state',
          error: this.cardDraftErrors.state,
          disabled: isSaving,
        }),
        renderTextField({
          id: 'billing-zip',
          name: 'zip',
          label: 'ZIP code',
          value: this.cardDraft.zip,
          placeholder: 'ZIP code',
          span: 'full',
          variant: 'card-form',
          autocomplete: 'postal-code',
          inputmode: 'numeric',
          dataField: 'zip',
          error: this.cardDraftErrors.zip,
          disabled: isSaving,
        })
      );
    }

    return this.renderWidgetShell({
      title: 'Add card',
      headerAction: renderTextLinkButton({
        label: 'Back',
        action: 'back-to-payment-methods',
        disabled: isSaving,
      }),
      showClose: false,
      showDivider: false,
      busy: isSaving,
      overlay: isSaving
        ? renderWidgetLoadingOverlay({
            title: 'Saving card',
            helper: 'Securely saving your card, please wait.',
          })
        : undefined,
      content: html`
        <div class="payment-flow card-form-screen">
          ${this.cardSubmitError
            ? renderAlert({variant: 'danger', message: this.cardSubmitError})
            : ''}
          ${renderFormGrid([
            renderTextField({
              id: 'card-label',
              name: 'name',
              label: 'Card Name',
              value: this.cardDraft.name,
              placeholder: 'Corporate card',
              span: 'full',
              variant: 'card-form',
              dataField: 'name',
              error: this.cardDraftErrors.name,
              disabled: isSaving,
            }),
            renderTextField({
              id: 'card-number',
              name: 'cardNumber',
              label: 'Card number',
              value: this.cardDraft.cardNumber,
              placeholder: '1234 1234 1234 1234',
              span: 'full',
              variant: 'card-form',
              autocomplete: 'cc-number',
              inputmode: 'numeric',
              dataField: 'cardNumber',
              error: this.cardDraftErrors.cardNumber,
              disabled: isSaving,
            }),
            renderTextField({
              id: 'expiration-date',
              name: 'expirationDate',
              label: 'Expiration',
              value: this.cardDraft.expirationDate,
              placeholder: 'MM / YY',
              variant: 'card-form',
              autocomplete: 'cc-exp',
              inputmode: 'numeric',
              dataField: 'expirationDate',
              error: this.cardDraftErrors.expirationDate,
              disabled: isSaving,
            }),
            renderTextField({
              id: 'card-cvv',
              name: 'cvv',
              label: 'CVC',
              value: this.cardDraft.cvv,
              placeholder: '3 or 4 digits',
              variant: 'card-form',
              autocomplete: 'cc-csc',
              inputmode: 'numeric',
              dataField: 'cvv',
              error: this.cardDraftErrors.cvv,
              disabled: isSaving,
            }),
            renderTextField({
              id: 'name-on-card',
              name: 'fullName',
              label: 'Full name',
              value: this.cardDraft.fullName,
              placeholder: 'Name on card',
              span: 'full',
              variant: 'card-form',
              autocomplete: 'cc-name',
              dataField: 'fullName',
              error: this.cardDraftErrors.fullName,
              disabled: isSaving,
            }),
            ...billingAddressFields,
          ])}
          <div class="primitive-footer card-form-primary">
            <div class="card-form-primary">
              ${renderButton({
                label: isSaving ? 'Saving payment method' : 'Save card',
                action: 'save-card',
                loading: isSaving,
                disabled:
                  isSaving ||
                  isEncrypting ||
                  !isCardDraftReady(this.cardDraft, this.cardEncryption),
              })}
            </div>
          </div>
        </div>
      `,
    });
  }

  private renderCardErrorScreen(): TemplateResult {
    return this.renderWidgetShell({
      title: 'Credit card not saved',
      subtitle:
        'We could not save this card. Check the card details or use a different payment method.',
      showClose: false,
      showDivider: false,
      content: renderOutcomeShell({
        variant: 'danger',
        content: this.cardSubmitError
          ? renderAlert({variant: 'danger', message: this.cardSubmitError})
          : undefined,
        actions: html`
          ${renderButton({
            label: 'Edit card details',
            action: 'edit-card-details',
          })}
          ${renderTextLinkButton({
            label: 'Use a different method',
            action: 'use-different-method',
          })}
        `,
      }),
    });
  }

  private renderBankProviderScreen(): TemplateResult {
    return this.renderWidgetShell({
      title: 'Connect your bank',
      headerAction: renderTextLinkButton({
        label: 'Back',
        action: 'back-to-payment-methods',
        disabled: this.bankLinkLoading,
      }),
      showClose: false,
      showDivider: false,
      busy: this.bankLinkLoading,
      overlay: this.bankLinkLoading
        ? renderWidgetLoadingOverlay({
            title: 'Connecting to your bank',
            helper: 'Securely opening your bank connection, please wait.',
          })
        : undefined,
      content: html`
        <div class="bank-provider-flow">
          ${renderProviderFrame({
            containerId: PAY_BY_BANK_PROVIDER_CONTAINER_ID,
            loading: this.bankLinkLoading,
            loadingLabel: 'Connecting to your bank',
          })}
          <div class="bank-provider-manual-link">
            ${renderTextLinkButton({
              label: 'Link Account Manually',
              action: 'add-ach-manually',
              disabled: this.bankLinkLoading,
            })}
          </div>
        </div>
      `,
    });
  }

  private renderManualBankAccountScreen(): TemplateResult {
    const isSaving = this.pendingAction === 'save-ach-manual';
    const isEncrypting =
      this.bankAccountEncryption.routingNumber.status === 'encrypting' ||
      this.bankAccountEncryption.accountNumber.status === 'encrypting' ||
      this.bankAccountEncryption.accountNumberReEntered.status ===
        'encrypting';

    return this.renderWidgetShell({
      title: 'Add ACH Manually',
      headerAction: renderTextLinkButton({
        label: 'Back',
        action: 'back-to-payment-methods',
        disabled: isSaving,
      }),
      showClose: false,
      showDivider: false,
      busy: isSaving,
      overlay: isSaving
        ? renderWidgetLoadingOverlay({
            title: 'Saving bank account',
            helper: 'Securely saving your bank account, please wait.',
          })
        : undefined,
      content: html`
        <div class="payment-flow card-form-screen">
          ${this.bankAccountSubmitError
            ? renderAlert({
                variant: 'danger',
                message: this.bankAccountSubmitError,
              })
            : ''}
          ${renderFormGrid([
            renderTextField({
              id: 'ach-routing-number',
              name: 'routingNumber',
              label: 'Routing number',
              value: this.bankAccountDraft.routingNumber,
              span: 'full',
              variant: 'card-form',
              autocomplete: 'off',
              inputmode: 'numeric',
              dataField: 'routingNumber',
              dataFieldScope: 'bankAccount',
              error: this.bankAccountDraftErrors.routingNumber,
              disabled: isSaving,
            }),
            renderTextField({
              id: 'ach-account-number',
              name: 'accountNumber',
              label: 'Account number',
              value: this.bankAccountDraft.accountNumber,
              type: bankAccountInputType(
                'accountNumber',
                this.bankAccountDraft,
                this.bankAccountEncryption
              ),
              span: 'full',
              variant: 'card-form',
              autocomplete: 'off',
              inputmode: 'numeric',
              dataField: 'accountNumber',
              dataFieldScope: 'bankAccount',
              error: this.bankAccountDraftErrors.accountNumber,
              disabled: isSaving,
            }),
            renderTextField({
              id: 'ach-account-number-confirm',
              name: 'accountNumberReEntered',
              label: 'Confirm account number',
              value: this.bankAccountDraft.accountNumberReEntered,
              type: bankAccountInputType(
                'accountNumberReEntered',
                this.bankAccountDraft,
                this.bankAccountEncryption
              ),
              span: 'full',
              variant: 'card-form',
              autocomplete: 'off',
              inputmode: 'numeric',
              dataField: 'accountNumberReEntered',
              dataFieldScope: 'bankAccount',
              error: this.bankAccountDraftErrors.accountNumberReEntered,
              disabled: isSaving,
            }),
          ])}
          <div class="primitive-footer card-form-primary">
            <div class="card-form-primary">
              ${renderButton({
                label: isSaving ? 'Saving bank account' : 'Save bank account',
                action: 'save-ach-manual',
                loading: isSaving,
                disabled:
                  isSaving ||
                  isEncrypting ||
                  !isBankAccountDraftReady(
                    this.bankAccountDraft,
                    this.bankAccountEncryption
                  ),
              })}
            </div>
          </div>
        </div>
      `,
    });
  }

  private renderBankOutcomeScreen(): TemplateResult {
    const outcome = resolveBankOutcome(this.bankOutcomeSource);
    const showHeaderDone =
      outcome.kind === 'declined' || outcome.kind === 'pending';

    return this.renderWidgetShell({
      title: outcome.title,
      headerAction: showHeaderDone
        ? renderTextLinkButton({
            label: 'Done',
            action: 'done-bank-outcome',
          })
        : undefined,
      showClose: false,
      showDivider: false,
      content: html`
        <div class="verification-outcome-flow">
          ${renderAlert({variant: outcome.variant, message: outcome.message})}
          ${this.bankOutcomeSource
            ? renderRequiredInfoSourceCard(this.bankOutcomeSource)
            : ''}
          ${showHeaderDone
            ? ''
            : html`
                <div class="primitive-footer">
                  ${outcome.kind === 'verified'
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
                          label: this.bankLinkLoading
                            ? 'Retrying'
                            : 'Try again',
                          action: 'retry-bank-provider',
                          loading: this.bankLinkLoading,
                          disabled: this.bankLinkLoading,
                        })}
                        ${renderTextLinkButton({
                          label: 'Use a different account',
                          action: 'use-different-bank-account',
                          disabled: this.bankLinkLoading,
                        })}
                      `}
                </div>
              `}
        </div>
      `,
    });
  }

  private handleClick = (event: Event) => {
    const action = findDatasetValue(event, 'action') as
      | FlowActionName
      | undefined;
    const paymentMethodId = findDatasetValue(event, 'paymentMethodId');

    if (!action) {
      return;
    }

    if (action === 'attach-payment-source') {
      if (paymentMethodId) {
        this.clearDeletePaymentSourceConfirmation();
        this.paymentSourceEditMode = false;
        this.selectedPaymentSourceId = paymentMethodId;
        this.paymentSourceView = 'selected';
        void this.attachPaymentSource(paymentMethodId);
      }
      return;
    }

    if (action === 'change-payment-source') {
      this.resetRequiredInfo();
      this.showPaymentSourceList({refresh: true});
      return;
    }

    if (action === 'toggle-payment-source-edit-mode') {
      this.clearDeletePaymentSourceConfirmation();
      this.paymentSourceEditMode = !this.paymentSourceEditMode;
      return;
    }

    if (action === 'verify-payment-source') {
      if (paymentMethodId) {
        this.clearDeletePaymentSourceConfirmation();
        this.paymentSourceEditMode = false;
        void this.verifySavedPaymentSource(paymentMethodId);
      }
      return;
    }

    if (action === 'delete-payment-source') {
      if (paymentMethodId) {
        void this.deletePaymentSource(paymentMethodId);
      }
      return;
    }

    if (action === 'cancel-delete-payment-source') {
      this.clearDeletePaymentSourceConfirmation();
      return;
    }

    if (action === 'done-payment-source-verification') {
      this.resetSavedSourceVerification();
      this.showPaymentSourceList({refresh: true});
      return;
    }

    if (action === 'open-required-info-file-picker') {
      this.pendingRequiredInfoDocKey =
        findDatasetValue(event, 'requiredInfoDocKey') ??
        this.firstRequiredInfoDocKey();
      this.renderRoot
        .querySelector<HTMLInputElement>('.required-info-file-input')
        ?.click();
      return;
    }

    if (action === 'submit-required-info') {
      void this.submitRequiredInfo();
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

    if (
      action === 'add-bank-account' ||
      action === 'use-bank-account-instead' ||
      action === 'retry-bank-provider' ||
      action === 'use-different-bank-account'
    ) {
      this.paymentSourceEditMode = false;
      this.paymentSourceView = 'list';
      this.resetCardFlow();
      this.resetRequiredInfo();
      void this.startPayByBankFlow();
      return;
    }

    if (action === 'add-ach-manually') {
      this.paymentSourceEditMode = false;
      this.paymentSourceView = 'list';
      this.resetCardFlow();
      this.resetRequiredInfo();
      this.showManualBankAccountScreen();
      return;
    }

    if (action === 'back-to-payment-methods') {
      this.resetCardFlow();
      this.resetBankFlow();
      this.resetRequiredInfo();
      this.showPaymentSourceList({refresh: true});
      return;
    }

    if (action === 'continue-bank-outcome' || action === 'done-bank-outcome') {
      this.resetBankFlow();
      this.showPaymentSourceList({refresh: true});
      return;
    }

    if (action === 'add-card') {
      this.paymentSourceEditMode = false;
      this.paymentSourceView = 'list';
      this.resetRequiredInfo();
      void this.showAddCardScreen();
      return;
    }

    if (action === 'save-card') {
      void this.saveCard();
      return;
    }

    if (action === 'save-ach-manual') {
      void this.saveManualBankAccount();
      return;
    }

    if (action === 'edit-card-details') {
      this.cardFlowScreen = 'form';
      return;
    }

    if (action === 'use-different-method') {
      this.resetCardFlow();
      this.resetRequiredInfo();
      this.showPaymentSourceList({refresh: true});
      return;
    }
  };

  private handleInput = (event: Event) => {
    const requiredInfoSsnInput = findRequiredInfoSsnInput(event);

    if (requiredInfoSsnInput) {
      this.storeRequiredInfoSsnInput(requiredInfoSsnInput);
      return;
    }

    const cardInput = event
      .composedPath()
      .find(
        (item): item is HTMLInputElement =>
          item instanceof HTMLInputElement && Boolean(item.dataset.cardField)
      );

    if (cardInput) {
      this.updateCardDraftField(
        cardInput.dataset.cardField as keyof CardDraft,
        cardInput.value
      );
      return;
    }

    const bankAccountInput = event
      .composedPath()
      .find(
        (item): item is HTMLInputElement =>
          item instanceof HTMLInputElement &&
          Boolean(item.dataset.bankAccountField)
      );

    if (bankAccountInput) {
      this.updateBankAccountDraftField(
        bankAccountInput.dataset.bankAccountField as keyof BankAccountDraft,
        bankAccountInput.value
      );
      return;
    }

    const requiredInfoInput = event
      .composedPath()
      .find(
        (item): item is HTMLInputElement =>
          item instanceof HTMLInputElement &&
          Boolean(item.dataset.requiredInfoDocKey)
      );

    if (requiredInfoInput) {
      this.storeRequiredInfoValue(
        requiredInfoInput.dataset.requiredInfoDocKey!,
        requiredInfoInput.value
      );
      return;
    }

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

    const inputs = this.getOtpInputs();
    const index = Number(input.dataset.otpIndex);
    const digits = sanitizeOtpValue(input.value);

    if (!digits) {
      input.value = '';
      this.syncOtpValueFromInputs(inputs);
      return;
    }

    if (digits.length === 1) {
      input.value = digits;
      this.syncOtpValueFromInputs(inputs);
      this.focusOtpInput(inputs, index + 1);
      return;
    }

    const lastWrittenIndex = this.writeOtpDigits(inputs, index, digits);

    this.syncOtpValueFromInputs(inputs);
    this.focusOtpInput(
      inputs,
      Math.min(index + digits.length, inputs.length - 1),
      lastWrittenIndex
    );
  };

  private handleKeyDown = (event: KeyboardEvent) => {
    const input = findOtpInput(event);

    if (!input) {
      return;
    }

    const inputs = this.getOtpInputs();
    const index = Number(input.dataset.otpIndex);

    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      this.focusOtpInput(inputs, index - 1);
      return;
    }

    if (event.key === 'ArrowRight') {
      event.preventDefault();
      this.focusOtpInput(inputs, index + 1);
      return;
    }

    if (event.key === 'Backspace') {
      event.preventDefault();

      if (input.value) {
        input.value = '';
      } else if (index > 0) {
        inputs[index - 1].value = '';
      }

      this.syncOtpValueFromInputs(inputs);
      this.focusOtpInput(inputs, Math.max(index - 1, 0));
      return;
    }

    if (event.key === 'Delete') {
      event.preventDefault();
      input.value = '';
      this.syncOtpValueFromInputs(inputs);
      return;
    }

    if (
      event.ctrlKey ||
      event.metaKey ||
      event.altKey ||
      event.key.length !== 1
    ) {
      return;
    }

    if (!/\d/.test(event.key)) {
      event.preventDefault();
    }
  };

  private handleChange = (event: Event) => {
    const requiredInfoFileInput = event
      .composedPath()
      .find(
        (item): item is HTMLInputElement =>
          item instanceof HTMLInputElement &&
          Boolean(item.dataset.requiredInfoFileInput)
      );

    if (requiredInfoFileInput) {
      this.storeRequiredInfoSelectedFile(requiredInfoFileInput.files?.[0]);
      requiredInfoFileInput.value = '';
      return;
    }

    const cardSelect = event
      .composedPath()
      .find(
        (item): item is HTMLSelectElement =>
          item instanceof HTMLSelectElement && Boolean(item.dataset.cardField)
      );

    if (cardSelect) {
      this.updateCardDraftField(
        cardSelect.dataset.cardField as keyof CardDraft,
        cardSelect.value
      );
      return;
    }

    const bankAccountSelect = event
      .composedPath()
      .find(
        (item): item is HTMLSelectElement =>
          item instanceof HTMLSelectElement &&
          Boolean(item.dataset.bankAccountField)
      );

    if (!bankAccountSelect) {
      return;
    }

    this.updateBankAccountDraftField(
      bankAccountSelect.dataset.bankAccountField as keyof BankAccountDraft,
      bankAccountSelect.value
    );
  };

  private handlePaste = (event: Event) => {
    const ssnInput = findRequiredInfoSsnInput(event);

    if (ssnInput) {
      this.pasteRequiredInfoSsnInput(event, ssnInput);
      return;
    }

    const input = findOtpInput(event);

    if (!input) {
      return;
    }

    const clipboardEvent = event as Event & {
      clipboardData?: {
        getData?: (type: string) => string;
      };
    };
    const clipboardText =
      typeof clipboardEvent.clipboardData?.getData === 'function'
        ? clipboardEvent.clipboardData.getData('text')
        : '';
    const digits = sanitizeOtpValue(clipboardText);

    if (!digits) {
      return;
    }

    event.preventDefault();

    const inputs = this.getOtpInputs();
    const index = Number(input.dataset.otpIndex);
    const lastWrittenIndex = this.writeOtpDigits(inputs, index, digits);

    this.syncOtpValueFromInputs(inputs);
    this.focusOtpInput(
      inputs,
      Math.min(index + digits.length, inputs.length - 1),
      lastWrittenIndex
    );
  };

  private handleFocusIn = (event: FocusEvent) => {
    const input = findOtpInput(event);

    if (!input || !input.value) {
      return;
    }

    requestAnimationFrame(() => {
      if (this.renderRoot.contains(input)) {
        input.select();
      }
    });
  };

  private handleFocusLost = (event: Event) => {
    const cardInput = event
      .composedPath()
      .find(
        (item): item is HTMLInputElement =>
          item instanceof HTMLInputElement &&
          isSensitiveCardField(item.dataset.cardField)
      );

    if (cardInput) {
      void this.encryptCardField(
        cardInput.dataset.cardField as SensitiveCardField,
        cardInput.value
      );
      return;
    }

    const bankAccountInput = event
      .composedPath()
      .find(
        (item): item is HTMLInputElement =>
          item instanceof HTMLInputElement &&
          isSensitiveBankAccountField(item.dataset.bankAccountField)
      );

    if (!bankAccountInput) {
      return;
    }

    void this.encryptBankAccountField(
      bankAccountInput.dataset.bankAccountField as SensitiveBankAccountField,
      bankAccountInput.value
    );
  };

  private getOtpInputs(): HTMLInputElement[] {
    return [
      ...this.renderRoot.querySelectorAll<HTMLInputElement>('.otp-input'),
    ];
  }

  private getRequiredInfoSsnInputs(key: string): HTMLInputElement[] {
    return [
      ...this.renderRoot.querySelectorAll<HTMLInputElement>(
        '.required-info-ssn-input'
      ),
    ].filter((input) => input.dataset.requiredInfoDocKey === key);
  }

  private storeRequiredInfoSsnInput(input: HTMLInputElement) {
    const key = input.dataset.requiredInfoDocKey;

    if (!key) {
      return;
    }

    const inputs = this.getRequiredInfoSsnInputs(key);
    const inputIndex = inputs.indexOf(input);
    const segmentLength = requiredInfoSsnInputMaxLength(input);
    const digits = normalizeRequiredInfoSsn(input.value);

    if (inputIndex < 0) {
      return;
    }

    if (digits.length > segmentLength) {
      const lastWrittenIndex = this.writeRequiredInfoSsnDigits(
        inputs,
        inputIndex,
        digits
      );

      this.syncRequiredInfoSsnValue(key, inputs);
      this.focusRequiredInfoSsnInput(inputs, lastWrittenIndex);
      return;
    }

    input.value = digits.slice(0, segmentLength);
    this.syncRequiredInfoSsnValue(key, inputs);

    if (input.value.length >= segmentLength) {
      this.focusRequiredInfoSsnInput(inputs, inputIndex + 1);
    }
  }

  private pasteRequiredInfoSsnInput(event: Event, input: HTMLInputElement) {
    const key = input.dataset.requiredInfoDocKey;

    if (!key) {
      return;
    }

    const clipboardEvent = event as Event & {
      clipboardData?: {
        getData?: (type: string) => string;
      };
    };
    const clipboardText =
      typeof clipboardEvent.clipboardData?.getData === 'function'
        ? clipboardEvent.clipboardData.getData('text')
        : '';
    const digits = normalizeRequiredInfoSsn(clipboardText);

    if (!digits) {
      return;
    }

    event.preventDefault();

    const inputs = this.getRequiredInfoSsnInputs(key);
    const inputIndex = inputs.indexOf(input);

    if (inputIndex < 0) {
      return;
    }

    const lastWrittenIndex = this.writeRequiredInfoSsnDigits(
      inputs,
      inputIndex,
      digits
    );

    this.syncRequiredInfoSsnValue(key, inputs);
    this.focusRequiredInfoSsnInput(inputs, lastWrittenIndex);
  }

  private writeRequiredInfoSsnDigits(
    inputs: HTMLInputElement[],
    startIndex: number,
    digits: string
  ): number {
    let cursor = 0;
    let lastWrittenIndex = startIndex;

    inputs.forEach((input, index) => {
      if (index < startIndex) {
        return;
      }

      const length = requiredInfoSsnInputMaxLength(input);
      const value = digits.slice(cursor, cursor + length);
      input.value = value;

      if (value) {
        lastWrittenIndex = index;
      }

      cursor += length;
    });

    return lastWrittenIndex;
  }

  private syncRequiredInfoSsnValue(key: string, inputs: HTMLInputElement[]) {
    this.storeRequiredInfoValue(
      key,
      normalizeRequiredInfoSsn(inputs.map((input) => input.value).join(''))
    );
  }

  private focusRequiredInfoSsnInput(
    inputs: HTMLInputElement[],
    targetIndex: number
  ) {
    inputs[Math.min(targetIndex, inputs.length - 1)]?.focus();
  }

  private syncOtpValueFromInputs(inputs = this.getOtpInputs()) {
    this.otpValue = inputs
      .map((item) => item.value)
      .join('')
      .slice(0, OTP_LENGTH);
    this.otpErrorMessage = undefined;
  }

  private writeOtpDigits(
    inputs: HTMLInputElement[],
    startIndex: number,
    value: string
  ): number {
    const digits = sanitizeOtpValue(value);
    let lastWrittenIndex = startIndex;

    digits
      .slice(0, Math.max(inputs.length - startIndex, 0))
      .split('')
      .forEach((digit, offset) => {
        const targetIndex = startIndex + offset;
        const targetInput = inputs[targetIndex];

        if (!targetInput) {
          return;
        }

        targetInput.value = digit;
        lastWrittenIndex = targetIndex;
      });

    return lastWrittenIndex;
  }

  private focusOtpInput(
    inputs: HTMLInputElement[],
    targetIndex: number,
    fallbackIndex = targetIndex
  ) {
    const input =
      inputs[targetIndex] ??
      inputs[Math.max(0, Math.min(fallbackIndex, inputs.length - 1))];

    if (!input) {
      return;
    }

    input.focus();
  }

  private async showAddCardScreen() {
    this.clearDeletePaymentSourceConfirmation();
    this.resetBankFlow();
    this.cardFlowScreen = 'form';
    this.cardSubmitError = undefined;

    const interactionId = this.interactionResponse?.interactionId;
    const hasSavedSourceContext = Boolean(
      this.interactionResponse?.selectedSource ||
        this.interactionResponse?.paymentSources?.length
    );

    if (
      interactionId &&
      hasSavedSourceContext &&
      !this.billingAddresses.length &&
      this.interactionResponse?.billerAddress === undefined
    ) {
      try {
        await this.fetchInteraction(interactionId);
      } catch (cause) {
        void cause;
      }
    }
  }

  private showManualBankAccountScreen() {
    this.clearDeletePaymentSourceConfirmation();
    this.resetBankFlow();
    this.bankFlowScreen = 'manual';
    this.bankAccountDraft = createBankAccountDraft();
    this.bankAccountDraftErrors = {};
    this.bankAccountEncryption = createBankAccountEncryptionState();
    this.bankAccountSubmitError = undefined;
  }

  private updateBankAccountDraftField(
    field: keyof BankAccountDraft,
    value: string
  ) {
    if (
      isSensitiveBankAccountField(field) &&
      isEncryptedBankAccountDisplayValue(
        value,
        this.bankAccountEncryption[field]
      )
    ) {
      const nextDraft = {
        ...this.bankAccountDraft,
        [field]: value,
      };

      this.bankAccountDraft = nextDraft;
      this.bankAccountDraftErrors = validateBankAccountDraft(
        normalizeBankAccountDraftForValidation(
          nextDraft,
          this.bankAccountEncryption
        )
      );
      this.bankAccountSubmitError = undefined;
      return;
    }

    const formattedValue = formatBankAccountDraftFieldValue(field, value);
    const nextDraft = {
      ...this.bankAccountDraft,
      [field]: formattedValue,
    };
    let nextEncryption = this.bankAccountEncryption;

    if (isSensitiveBankAccountField(field)) {
      if (
        isEncryptedBankAccountDisplayValue(
          formattedValue,
          this.bankAccountEncryption[field]
        )
      ) {
        return;
      }

      nextEncryption = {
        ...this.bankAccountEncryption,
        [field]: resolveDirtyCardEncryptionState(
          this.bankAccountEncryption[field],
          normalizeBankAccountNumber(formattedValue)
        ),
      };
    }

    this.bankAccountDraft = nextDraft;
    this.bankAccountEncryption = nextEncryption;
    this.bankAccountDraftErrors = validateBankAccountDraft(
      normalizeBankAccountDraftForValidation(nextDraft, nextEncryption)
    );
    this.bankAccountSubmitError = undefined;
  }

  private updateCardDraftField(field: keyof CardDraft, value: string) {
    const formattedValue = formatCardDraftFieldValue(field, value);

    this.cardDraft = {
      ...this.cardDraft,
      [field]: formattedValue,
    };

    this.cardSubmitError = undefined;

    if (isSensitiveCardField(field)) {
      this.cardEncryption = {
        ...this.cardEncryption,
        [field]: resolveDirtyCardEncryptionState(
          this.cardEncryption[field],
          normalizeSensitiveCardFieldValue(field, formattedValue)
        ),
      };
    }
  }

  private async encryptCardField(
    field: SensitiveCardField,
    value: string
  ): Promise<void> {
    this.updateCardDraftField(field, value);

    const normalizedValue = normalizeSensitiveCardFieldValue(field, value);
    const validationError = validateSensitiveCardField(field, value);

    if (!normalizedValue) {
      this.cardDraftErrors = omitCardDraftError(this.cardDraftErrors, field);
      this.cardEncryption = {
        ...this.cardEncryption,
        [field]: createCardEncryptionFieldState(),
      };
      return;
    }

    if (validationError) {
      this.cardDraftErrors = {
        ...omitCardDraftError(this.cardDraftErrors, field),
        [field]: validationError,
      };
      this.cardEncryption = {
        ...this.cardEncryption,
        [field]: resolveDirtyCardEncryptionState(
          this.cardEncryption[field],
          normalizedValue
        ),
      };
      return;
    }

    const currentFieldState = this.cardEncryption[field];

    if (
      (currentFieldState.status === 'encrypting' ||
        currentFieldState.status === 'encrypted') &&
      currentFieldState.normalizedValue === normalizedValue
    ) {
      return;
    }

    this.cardDraftErrors = omitCardDraftError(this.cardDraftErrors, field);
    this.cardEncryption = {
      ...this.cardEncryption,
      [field]: {
        status: 'encrypting',
        normalizedValue,
      },
    };

    try {
      const encryptedValue = await this.maskSensitiveCardValue(
        field,
        normalizedValue
      );

      if (
        normalizeSensitiveCardFieldValue(field, this.cardDraft[field]) !==
        normalizedValue
      ) {
        return;
      }

      this.cardDraftErrors = omitCardDraftError(this.cardDraftErrors, field);
      this.cardEncryption = {
        ...this.cardEncryption,
        [field]: {
          status: 'encrypted',
          normalizedValue,
          encryptedValue,
        },
      };
    } catch (cause) {
      void cause;

      if (
        normalizeSensitiveCardFieldValue(field, this.cardDraft[field]) !==
        normalizedValue
      ) {
        return;
      }

      this.cardDraftErrors = {
        ...omitCardDraftError(this.cardDraftErrors, field),
        [field]: buildCardEncryptionErrorMessage(field),
      };
      this.cardEncryption = {
        ...this.cardEncryption,
        [field]: {
          status: 'failed',
          normalizedValue,
        },
      };
    }
  }

  private async encryptBankAccountField(
    field: SensitiveBankAccountField,
    value: string
  ): Promise<void> {
    const currentFieldState = this.bankAccountEncryption[field];

    if (isEncryptedBankAccountDisplayValue(value, currentFieldState)) {
      this.bankAccountDraft = {
        ...this.bankAccountDraft,
        [field]: value,
      };
      this.bankAccountSubmitError = undefined;
      return;
    }

    this.updateBankAccountDraftField(field, value);

    const normalizedValue = normalizeBankAccountNumber(value);

    if (!normalizedValue) {
      const nextEncryption = {
        ...this.bankAccountEncryption,
        [field]: createCardEncryptionFieldState(),
      };

      this.bankAccountEncryption = nextEncryption;
      this.bankAccountDraftErrors = validateBankAccountDraft(
        normalizeBankAccountDraftForValidation(
          this.bankAccountDraft,
          nextEncryption
        )
      );
      return;
    }

    if (
      (currentFieldState.status === 'encrypting' ||
        currentFieldState.status === 'encrypted') &&
      currentFieldState.normalizedValue === normalizedValue
    ) {
      return;
    }

    this.bankAccountDraftErrors = omitBankAccountDraftError(
      this.bankAccountDraftErrors,
      field
    );
    this.bankAccountEncryption = {
      ...this.bankAccountEncryption,
      [field]: {
        status: 'encrypting',
        normalizedValue,
      },
    };

    try {
      const encryptedValue = await this.maskSensitiveBankAccountValue(
        field,
        normalizedValue
      );

      if (
        normalizeBankAccountNumber(this.bankAccountDraft[field]) !==
        normalizedValue
      ) {
        return;
      }

      const nextDraft = {
        ...this.bankAccountDraft,
        [field]: maskSensitiveDisplayValue(normalizedValue),
      };
      const nextEncryption = {
        ...this.bankAccountEncryption,
        [field]: {
          status: 'encrypted',
          normalizedValue,
          encryptedValue,
        },
      };

      this.bankAccountDraft = nextDraft;
      this.bankAccountEncryption = nextEncryption;
      this.bankAccountDraftErrors = validateBankAccountDraft(
        normalizeBankAccountDraftForValidation(nextDraft, nextEncryption)
      );
    } catch (cause) {
      void cause;

      if (
        normalizeBankAccountNumber(this.bankAccountDraft[field]) !==
        normalizedValue
      ) {
        return;
      }

      const nextEncryption = {
        ...this.bankAccountEncryption,
        [field]: {
          status: 'failed',
          normalizedValue,
        },
      };

      this.bankAccountEncryption = nextEncryption;
      this.bankAccountDraftErrors = {
        ...validateBankAccountDraft(
          normalizeBankAccountDraftForValidation(
            this.bankAccountDraft,
            nextEncryption
          )
        ),
        [field]: buildBankAccountEncryptionErrorMessage(field),
      };
    }
  }

  private async maskSensitiveCardValue(
    field: SensitiveCardField,
    value: string
  ): Promise<string> {
    const interactionId = this.requireInteractionId();

    if (!interactionId) {
      throw new Error('An interaction id is required to encrypt card details.');
    }

    const type = field === 'cardNumber' ? 'card' : 'cvv';
    const response = await this.requestCommerceHubJson<{value?: string}>(
      `/interaction/source/mask/${type}`,
      interactionId,
      {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({value}),
        credentials: 'include',
      }
    );
    const encryptedValue = response.value?.trim();

    if (!encryptedValue) {
      throw new Error('The card encryption response did not include a value.');
    }

    return encryptedValue;
  }

  private async maskSensitiveBankAccountValue(
    field: SensitiveBankAccountField,
    value: string
  ): Promise<string> {
    const interactionId = this.requireInteractionId();

    if (!interactionId) {
      throw new Error('An interaction id is required to encrypt ACH details.');
    }

    const type = field === 'routingNumber' ? 'rt' : 'bn';
    const response = await this.requestCommerceHubJson<{value?: string}>(
      `/interaction/source/mask/${type}`,
      interactionId,
      {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({value}),
        credentials: 'include',
      }
    );
    const encryptedValue = response.value?.trim();

    if (!encryptedValue) {
      throw new Error('The ACH encryption response did not include a value.');
    }

    return encryptedValue;
  }

  private async saveCard() {
    if (this.pendingAction === 'save-card') {
      return;
    }

    const interactionId = this.requireInteractionId();

    if (!interactionId) {
      return;
    }

    const normalizedDraft = normalizeCardDraft(this.cardDraft);
    const errors = {
      ...validateCardDraft(normalizedDraft),
      ...validateCardEncryptionReadiness(normalizedDraft, this.cardEncryption),
    };

    if (Object.keys(errors).length > 0) {
      this.cardDraft = normalizedDraft;
      this.cardDraftErrors = errors;
      this.cardSubmitError = undefined;
      return;
    }

    this.pendingAction = 'save-card';
    this.cardDraft = normalizedDraft;
    this.cardDraftErrors = {};
    this.cardSubmitError = undefined;

    try {
      const encryptedCardNumber = resolveEncryptedCardFieldValue(
        'cardNumber',
        normalizedDraft.cardNumber,
        this.cardEncryption
      );
      const encryptedCvv = resolveEncryptedCardFieldValue(
        'cvv',
        normalizedDraft.cvv,
        this.cardEncryption
      );
      const expiration = parseExpirationDate(normalizedDraft.expirationDate);

      if (!expiration) {
        this.cardDraftErrors = {
          expirationDate: 'Enter a valid expiration date.',
        };
        return;
      }

      const billingAddressId = await this.resolveBillingAddressId(
        interactionId,
        normalizedDraft
      );
      const cardSource: CardSourcePayload = {
        id: '',
        tenderType: 'CARD',
        name: normalizedDraft.name,
        billingAddressId,
        card: {
          nameOnCard: normalizedDraft.fullName,
          cardNumber: encryptedCardNumber,
          cvv: encryptedCvv,
          cardNumberEncrypted: encryptedCardNumber,
          cvvEncrypted: encryptedCvv,
          expirationMonth: expiration.month,
          expirationYear: expiration.year,
          network: detectCardNetwork(normalizedDraft.cardNumber),
        },
      };
      const verificationResponse =
        await this.requestCommerceHubJson<VerificationResponse>(
          '/interaction/source/card',
          interactionId,
          {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(cardSource),
            credentials: 'include',
          }
        );
      const createdSource = this.sourceWithVerificationResponse(
        cardPaymentSourceFromPayload(cardSource, normalizedDraft.cardNumber),
        verificationResponse
      ) as CardPaymentSource & {id: string};
      const paymentSourceId = sourceIdFromVerificationResponse(
        verificationResponse,
        'The card creation response did not include a source id.'
      );
      const nextInteractionResponse = this.interactionResponseWithAddedSource(
        interactionId,
        createdSource
      );

      this.cardFlowScreen = undefined;
      this.cardDraft = createCardDraft();
      this.cardDraftErrors = {};
      this.cardEncryption = createCardEncryptionState();
      this.cardSubmitError = undefined;
      this.setInteractionResponseFromSdk(nextInteractionResponse);

      if (createdSource.verificationInfo?.status === 'VERIFIED') {
        await this.attachPaymentSource(paymentSourceId);
        return;
      }

      this.showAddedPaymentSourceStatus(createdSource);
    } catch (cause) {
      this.cardSubmitError = apiErrorMessage(cause);
      this.cardFlowScreen = 'error';
    } finally {
      this.pendingAction = undefined;
    }
  }

  private async saveManualBankAccount() {
    if (this.pendingAction === 'save-ach-manual') {
      return;
    }

    const interactionId = this.requireInteractionId();

    if (!interactionId) {
      return;
    }

    const normalizedDraft = normalizeBankAccountDraftForValidation(
      this.bankAccountDraft,
      this.bankAccountEncryption
    );
    const errors = validateBankAccountDraft(normalizedDraft);

    if (Object.keys(errors).length > 0) {
      this.bankAccountDraft = normalizeBankAccountDraftForDisplay(
        this.bankAccountDraft,
        this.bankAccountEncryption
      );
      this.bankAccountDraftErrors = errors;
      this.bankAccountSubmitError = undefined;
      return;
    }

    this.pendingAction = 'save-ach-manual';
    this.bankAccountDraft = normalizeBankAccountDraftForDisplay(
      this.bankAccountDraft,
      this.bankAccountEncryption
    );
    this.bankAccountDraftErrors = {};
    this.bankAccountSubmitError = undefined;

    try {
      await this.encryptChangedBankAccountFields();

      const encryptedNormalizedDraft = normalizeBankAccountDraftForValidation(
        this.bankAccountDraft,
        this.bankAccountEncryption
      );
      const postEncryptionErrors = validateBankAccountDraft(
        encryptedNormalizedDraft
      );

      if (Object.keys(postEncryptionErrors).length > 0) {
        this.bankAccountDraftErrors = postEncryptionErrors;
        this.bankAccountSubmitError = undefined;
        return;
      }

      const encryptedRoutingNumber = resolveBankAccountPayloadFieldValue(
        'routingNumber',
        this.bankAccountDraft,
        this.bankAccountEncryption
      );
      const encryptedAccountNumber = resolveBankAccountPayloadFieldValue(
        'accountNumber',
        this.bankAccountDraft,
        this.bankAccountEncryption
      );
      const encryptedAccountNumberReEntered =
        resolveBankAccountPayloadFieldValue(
          'accountNumberReEntered',
          this.bankAccountDraft,
          this.bankAccountEncryption
        );
      const displayAccountNumber = bankAccountFieldLastFour(
        'accountNumber',
        this.bankAccountEncryption,
        encryptedNormalizedDraft
      );
      const bankAccountSource: BankAccountSourcePayload = {
        id: '',
        tenderType: 'BANK_ACCOUNT',
        bankAccount: {
          routingNumber: encryptedRoutingNumber,
          accountNumber: encryptedAccountNumber,
          accountNumberReEntered: encryptedAccountNumberReEntered,
          routingNumberEncrypted: encryptedRoutingNumber,
          accountNumberEncrypted: encryptedAccountNumber,
        },
      };
      const verificationResponse =
        await this.requestCommerceHubJson<VerificationResponse>(
          '/interaction/source/ach',
          interactionId,
          {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(bankAccountSource),
            credentials: 'include',
          }
        );
      const createdSource = this.sourceWithVerificationResponse(
        bankPaymentSourceFromPayload(bankAccountSource, displayAccountNumber),
        verificationResponse
      ) as BankPaymentSource & {id: string};
      const paymentSourceId = sourceIdFromVerificationResponse(
        verificationResponse,
        'The bank account creation response did not include a source id.'
      );
      const nextInteractionResponse = this.interactionResponseWithAddedSource(
        interactionId,
        createdSource
      );

      this.bankFlowScreen = undefined;
      this.bankAccountDraft = createBankAccountDraft();
      this.bankAccountDraftErrors = {};
      this.bankAccountEncryption = createBankAccountEncryptionState();
      this.bankAccountSubmitError = undefined;
      this.setInteractionResponseFromSdk(nextInteractionResponse);

      if (createdSource.verificationInfo?.status === 'VERIFIED') {
        await this.attachPaymentSource(paymentSourceId);
        return;
      }

      this.showAddedPaymentSourceStatus(createdSource);
    } catch (cause) {
      this.bankAccountSubmitError = apiErrorMessage(cause);
    } finally {
      this.pendingAction = undefined;
    }
  }

  private async encryptChangedBankAccountFields(): Promise<void> {
    for (const field of [
      'routingNumber',
      'accountNumber',
      'accountNumberReEntered',
    ] as const) {
      const value = this.bankAccountDraft[field];
      const encryptedField = this.bankAccountEncryption[field];

      if (isEncryptedBankAccountDisplayValue(value, encryptedField)) {
        continue;
      }

      const normalizedValue = normalizeBankAccountNumber(value);

      if (!normalizedValue) {
        continue;
      }

      const isAlreadyEncrypted =
        encryptedField.status === 'encrypted' &&
        encryptedField.normalizedValue === normalizedValue &&
        Boolean(encryptedField.encryptedValue);

      if (!isAlreadyEncrypted) {
        await this.encryptBankAccountField(field, value);
      }
    }
  }

  private async resolveBillingAddressId(
    interactionId: string,
    draft: CardDraft
  ): Promise<string> {
    if (draft.billingAddressValue !== NEW_BILLING_ADDRESS_VALUE) {
      return draft.billingAddressValue;
    }

    const billingAddress = billingAddressFromCardDraft(draft);

    const response = await this.requestCommerceHubJson<BillingAddressResponse>(
      '/interaction/billing-address',
      interactionId,
      {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(billingAddress),
        credentials: 'include',
      }
    );
    const billingAddressId = response.value?.trim();

    if (!billingAddressId) {
      throw new Error('The billing address response did not include an id.');
    }

    return billingAddressId;
  }

  private async verifyOtp() {
    if (this.pendingAction === 'verify-otp') {
      return;
    }

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
    if (this.pendingAction === 'resend-otp') {
      return;
    }

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

  private async attachPaymentSource(paymentSourceId: string) {
    if (this.pendingAction === 'attach-payment-source') {
      return;
    }

    const interactionId = this.requireInteractionId();
    const source = this.findPaymentSourceById(paymentSourceId);

    if (!interactionId || !source) {
      return;
    }

    if (source.verificationInfo?.status !== 'VERIFIED') {
      return;
    }

    this.selectedPaymentSourceId = paymentSourceId;
    this.paymentSourceView = 'selected';
    this.pendingAction = 'attach-payment-source';

    try {
      const interactionResponse =
        await this.requestCommerceHubJson<InteractionResponse>(
          `/interaction/source/${encodeURIComponent(paymentSourceId)}/attach`,
          interactionId,
          {method: 'POST', credentials: 'include'}
        );
      const refreshedInteractionResponse = interactionResponseWithSelection(
        this.interactionResponse ?? {interactionId},
        interactionResponse,
        paymentSourceId
      );
      const attachedSource =
        selectedPaymentSourceFromInteractionResponse(
          refreshedInteractionResponse,
          paymentSourceId
        ) ??
        refreshedInteractionResponse.paymentSources?.find(
          (paymentSource) => paymentSource.id === paymentSourceId
        ) ??
        source;

      this.selectedPaymentSourceId = attachedSource.id;
      this.setInteractionResponseFromSdk(refreshedInteractionResponse);
      this.paymentSourceView = 'selected';
      this.dispatchEvent(
        new CustomEvent(ON_SUCCESS_EVENT, {detail: attachedSource})
      );
    } catch (cause) {
      void cause;
    } finally {
      this.pendingAction = undefined;
    }
  }

  private async verifySavedPaymentSource(paymentSourceId: string) {
    if (this.pendingAction === 'verify-payment-source') {
      return;
    }

    const interactionId = this.requireInteractionId();
    const source = this.findPaymentSourceById(paymentSourceId);

    if (!interactionId || !source) {
      return;
    }

    if (requiresAdditionalVerificationInfo(source)) {
      this.savedSourceVerificationSource = undefined;
      this.savedSourceVerificationFailed = false;
      this.selectedPaymentSourceId = undefined;
      this.paymentSourceView = 'list';
      this.showRequiredInfoSource(source);
      return;
    }

    if (source.verificationInfo?.status !== 'NOT_VERIFIED') {
      return;
    }

    this.savedSourceVerificationSource = undefined;
    this.savedSourceVerificationFailed = false;
    this.selectedPaymentSourceId = undefined;
    this.paymentSourceView = 'list';
    this.pendingAction = 'verify-payment-source';

    try {
      const verifiedSource = await this.verifyPaymentSourceStep1(
        interactionId,
        {
          ...source,
          id: paymentSourceId,
        }
      );
      const nextInteractionResponse = withUpsertedSourcePreservingSelection(
        {
          ...(this.interactionResponse ?? {interactionId}),
          selectedSource: this.interactionResponse?.selectedSource,
          status: 'PAYMENT_SOURCE_REQUESTED',
        },
        verifiedSource
      );

      this.setInteractionResponseFromSdk(nextInteractionResponse);

      if (requiresAdditionalVerificationInfo(verifiedSource)) {
        this.showRequiredInfoSource(verifiedSource);
        return;
      }

      if (verifiedSource.verificationInfo?.status === 'VERIFIED') {
        const verifiedSourceId = verifiedSource.id?.trim() || paymentSourceId;

        this.pendingAction = undefined;
        await this.attachPaymentSource(verifiedSourceId);
        return;
      }

      this.savedSourceVerificationSource = verifiedSource;
      this.savedSourceVerificationFailed = false;
    } catch (cause) {
      void cause;
      this.savedSourceVerificationSource = source;
      this.savedSourceVerificationFailed = true;
    } finally {
      if (this.pendingAction === 'verify-payment-source') {
        this.pendingAction = undefined;
      }
    }
  }

  private async deletePaymentSource(paymentSourceId: string) {
    if (this.pendingAction === 'delete-payment-source') {
      return;
    }

    const interactionId = this.requireInteractionId();
    const source = this.findPaymentSourceById(paymentSourceId);

    if (!interactionId || !source) {
      return;
    }

    if (this.deleteConfirmationPaymentSourceId !== paymentSourceId) {
      this.armDeletePaymentSourceConfirmation(paymentSourceId);
      return;
    }

    this.clearDeletePaymentSourceConfirmation();
    this.pendingAction = 'delete-payment-source';

    try {
      await this.requestCommerceHubJson<unknown>(
        `/interaction/source/${encodeURIComponent(paymentSourceId)}`,
        interactionId,
        {
          method: 'DELETE',
          credentials: 'include',
        }
      );

      const nextInteractionResponse = interactionResponseWithoutPaymentSource(
        this.interactionResponse ?? {interactionId},
        paymentSourceId
      );

      if (!nextInteractionResponse.paymentSources?.length) {
        this.paymentSourceEditMode = false;
      }

      this.setInteractionResponseFromSdk(nextInteractionResponse);
    } catch (cause) {
      void cause;
    } finally {
      this.pendingAction = undefined;
    }
  }

  private armDeletePaymentSourceConfirmation(paymentSourceId: string) {
    this.clearDeletePaymentSourceConfirmation();
    this.deleteConfirmationPaymentSourceId = paymentSourceId;
    this.deleteConfirmationTimeoutId = window.setTimeout(() => {
      if (this.deleteConfirmationPaymentSourceId === paymentSourceId) {
        this.clearDeletePaymentSourceConfirmation();
      }
    }, DELETE_CONFIRMATION_TIMEOUT_MS);
  }

  private clearDeletePaymentSourceConfirmation() {
    if (this.deleteConfirmationTimeoutId !== undefined) {
      window.clearTimeout(this.deleteConfirmationTimeoutId);
      this.deleteConfirmationTimeoutId = undefined;
    }

    this.deleteConfirmationPaymentSourceId = undefined;
  }

  private findPaymentSourceById(
    paymentSourceId: string
  ): PaymentSource | undefined {
    const paymentSources = this.interactionResponse?.paymentSources ?? [];

    return (
      paymentSources.find((source) => source.id === paymentSourceId) ??
      (this.interactionResponse?.selectedSource?.id === paymentSourceId
        ? this.interactionResponse.selectedSource
        : undefined)
    );
  }

  private resetSavedSourceVerification() {
    this.savedSourceVerificationSource = undefined;
    this.savedSourceVerificationFailed = false;
  }

  private showPaymentSourceList({refresh = false}: {refresh?: boolean} = {}) {
    this.clearDeletePaymentSourceConfirmation();
    this.paymentSourceEditMode = false;
    this.paymentSourceView = 'list';

    if (refresh) {
      void this.refreshPaymentSourcesForList();
    }
  }

  private async refreshPaymentSourcesForList() {
    const interactionId = this.interactionResponse?.interactionId;

    if (!interactionId) {
      return;
    }

    try {
      await this.fetchInteraction(interactionId);
    } catch (cause) {
      void cause;
    }
  }

  private interactionResponseWithAddedSource(
    interactionId: string,
    source: PaymentSource
  ): InteractionResponse {
    const sourceId = source.id?.trim();
    const shouldPreselectSource =
      Boolean(sourceId) && shouldPreselectAddedPaymentSource(source);
    const baseInteractionResponse = {
      ...(this.interactionResponse ?? {interactionId}),
      status: 'PAYMENT_SOURCE_REQUESTED' as const,
    };

    if (shouldPreselectSource) {
      return withUpsertedSource(baseInteractionResponse, source);
    }

    return withUpsertedSourcePreservingSelection(
      {
        ...baseInteractionResponse,
        selectedSource: this.interactionResponse?.selectedSource,
      },
      source
    );
  }

  private showAddedPaymentSourceStatus(source: PaymentSource) {
    const sourceId = source.id?.trim();

    this.resetSavedSourceVerification();
    this.resetRequiredInfo();

    if (requiresAdditionalVerificationInfo(source)) {
      this.selectedPaymentSourceId = undefined;
      this.paymentSourceView = 'list';
      this.showRequiredInfoSource(source);
      return;
    }

    if (source.verificationInfo?.status === 'VERIFIED') {
      this.selectedPaymentSourceId = sourceId;
      this.paymentSourceView = 'selected';
      return;
    }

    this.selectedPaymentSourceId = undefined;
    this.paymentSourceView = 'list';

    if (isBankPaymentSource(source)) {
      this.bankOutcomeSource = source;
      this.bankFlowScreen = 'outcome';
      return;
    }

    this.savedSourceVerificationSource = source;
    this.savedSourceVerificationFailed = false;
  }

  private showRequiredInfoSource(source: PaymentSource) {
    this.requiredInfoSource = source;
    this.requiredInfoValues = {};
    this.requiredInfoFileNames = {};
    this.requiredInfoFiles = {};
    this.requiredInfoSubmitError = undefined;
    this.pendingRequiredInfoDocKey = undefined;
  }

  private resetRequiredInfo() {
    this.requiredInfoSource = undefined;
    this.requiredInfoValues = {};
    this.requiredInfoFileNames = {};
    this.requiredInfoFiles = {};
    this.requiredInfoSubmitError = undefined;
    this.pendingRequiredInfoDocKey = undefined;
  }

  private firstRequiredInfoDocKey(): string {
    return (
      firstRequiredInfoUploadDocKey(
        requiredInfoDocs(this.requiredInfoSource)
      ) ?? requiredInfoDocKey(requiredInfoDocs(this.requiredInfoSource)[0], 0)
    );
  }

  private storeRequiredInfoValue(key: string, value: string) {
    this.requiredInfoValues = {
      ...this.requiredInfoValues,
      [key]: value,
    };
    this.requiredInfoSubmitError = undefined;
  }

  private storeRequiredInfoSelectedFile(file?: File) {
    const source = this.requiredInfoSource;

    if (!source || !file) {
      this.pendingRequiredInfoDocKey = undefined;
      return;
    }

    const key =
      this.pendingRequiredInfoDocKey ?? this.firstRequiredInfoDocKey();

    this.requiredInfoFiles = {
      ...this.requiredInfoFiles,
      [key]: file,
    };
    this.requiredInfoFileNames = {
      ...this.requiredInfoFileNames,
      [key]: file.name,
    };
    this.requiredInfoSubmitError = undefined;
    this.pendingRequiredInfoDocKey = undefined;
  }

  private canSubmitRequiredInfo(): boolean {
    const source = this.requiredInfoSource;

    if (!source?.id?.trim()) {
      return false;
    }

    return requiredInfoDocs(source).some((doc, index) => {
      const key = requiredInfoDocKey(doc, index);

      if (isRequiredInfoTextDoc(doc)) {
        return Boolean(this.requiredInfoValues[key]?.trim());
      }

      return Boolean(this.requiredInfoFiles[key]);
    });
  }

  private async submitRequiredInfo() {
    if (this.pendingAction === 'submit-required-info') {
      return;
    }

    const interactionId = this.requireInteractionId();
    const source = this.requiredInfoSource;
    const sourceId = source?.id?.trim();

    if (!interactionId || !source || !sourceId) {
      return;
    }

    if (!this.canSubmitRequiredInfo()) {
      this.requiredInfoSubmitError =
        'Add required or optional information before verifying.';
      return;
    }

    this.pendingAction = 'submit-required-info';
    this.requiredInfoSubmitError = undefined;

    try {
      const docs = requiredInfoDocs(source);
      const requiredEntries = this.providedRequiredInfoEntries(docs, true);
      const optionalEntries = this.providedRequiredInfoEntries(docs, false);
      let verifiedSource = source;

      if (requiredEntries.length > 0) {
        await this.uploadRequiredInfoEntries(
          interactionId,
          sourceId,
          requiredEntries
        );
        verifiedSource = this.sourceWithVerificationResponse(
          verifiedSource,
          await this.verifyRequiredInfoStep2(interactionId, sourceId)
        );

        if (
          requiresAdditionalVerificationInfo(verifiedSource) &&
          optionalEntries.length > 0
        ) {
          await this.uploadRequiredInfoEntries(
            interactionId,
            sourceId,
            optionalEntries
          );
          verifiedSource = this.sourceWithVerificationResponse(
            verifiedSource,
            await this.verifyRequiredInfoStep2(interactionId, sourceId)
          );
        }
      } else {
        await this.uploadRequiredInfoEntries(
          interactionId,
          sourceId,
          optionalEntries
        );
        verifiedSource = this.sourceWithVerificationResponse(
          verifiedSource,
          await this.verifyRequiredInfoStep2(interactionId, sourceId)
        );
      }

      const nextInteractionResponse = withUpsertedSourcePreservingSelection(
        {
          ...(this.interactionResponse ?? {interactionId}),
          selectedSource: this.interactionResponse?.selectedSource,
          status: 'PAYMENT_SOURCE_REQUESTED',
        },
        verifiedSource
      );

      this.setInteractionResponseFromSdk(nextInteractionResponse);

      if (verifiedSource.verificationInfo?.status === 'VERIFIED') {
        const verifiedSourceId = verifiedSource.id?.trim() || sourceId;

        this.resetRequiredInfo();
        this.pendingAction = undefined;
        await this.attachPaymentSource(verifiedSourceId);
        return;
      }

      if (requiresAdditionalVerificationInfo(verifiedSource)) {
        this.requiredInfoSource = verifiedSource;
        this.requiredInfoValues = {};
        this.requiredInfoFileNames = {};
        this.requiredInfoFiles = {};
        return;
      }

      this.resetRequiredInfo();
      this.savedSourceVerificationSource = verifiedSource;
      this.savedSourceVerificationFailed = false;
      this.selectedPaymentSourceId = verifiedSource.id;
      this.paymentSourceView = 'list';
    } catch (cause) {
      this.requiredInfoSubmitError =
        apiErrorMessage(cause) ||
        'We could not submit the required information. Please try again.';
    } finally {
      if (this.pendingAction === 'submit-required-info') {
        this.pendingAction = undefined;
      }
    }
  }

  private providedRequiredInfoEntries(
    docs: RequiredInfoDoc[],
    required: boolean
  ): {doc: RequiredInfoDoc; index: number}[] {
    return docs
      .map((doc, index) => ({doc, index}))
      .filter(
        ({doc, index}) =>
          (required ? doc.mandatory === true : doc.mandatory !== true) &&
          this.hasRequiredInfoValue(doc, index)
      );
  }

  private hasRequiredInfoValue(doc: RequiredInfoDoc, index: number): boolean {
    const key = requiredInfoDocKey(doc, index);

    if (isRequiredInfoTextDoc(doc)) {
      return Boolean(this.requiredInfoValues[key]?.trim());
    }

    return Boolean(this.requiredInfoFiles[key]);
  }

  private async uploadRequiredInfoEntries(
    interactionId: string,
    sourceId: string,
    entries: {doc: RequiredInfoDoc; index: number}[]
  ) {
    for (const {doc, index} of entries) {
      const docType = doc.docType;

      if (!docType) {
        continue;
      }

      const key = requiredInfoDocKey(doc, index);

      if (isRequiredInfoTextDoc(doc)) {
        const value = this.requiredInfoValues[key]?.trim();

        if (value) {
          await this.uploadRequiredInfoField(
            interactionId,
            sourceId,
            docType,
            value
          );
        }
        continue;
      }

      const file = this.requiredInfoFiles[key];

      if (file) {
        await this.uploadRequiredInfoDocument(
          interactionId,
          sourceId,
          docType,
          file
        );
      }
    }
  }

  private async verifyRequiredInfoStep2(
    interactionId: string,
    sourceId: string
  ): Promise<VerificationResponse> {
    this.showMinimumVerificationOverlay('submit-required-info');

    return this.requestCommerceHubJson<VerificationResponse>(
      '/interaction/verify/step2',
      interactionId,
      {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({value: sourceId}),
        credentials: 'include',
      }
    );
  }

  private sourceWithVerificationResponse(
    source: PaymentSource,
    verificationResponse: VerificationResponse
  ): PaymentSource {
    const {sourceId, ...verificationInfo} = verificationResponse;
    const verifiedSourceId = sourceId?.trim();

    return {
      ...source,
      id: verifiedSourceId || source.id,
      verificationInfo: {
        ...source.verificationInfo,
        ...verificationInfo,
      },
    };
  }

  private async uploadRequiredInfoField(
    interactionId: string,
    sourceId: string,
    docType: NonNullable<RequiredInfoDoc['docType']>,
    docValue: string
  ) {
    await this.requestCommerceHubJson<unknown>(
      '/interaction/verify/uploadField',
      interactionId,
      {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({docType, value: sourceId, docValue}),
        credentials: 'include',
      }
    );
  }

  private async uploadRequiredInfoDocument(
    interactionId: string,
    sourceId: string,
    docType: NonNullable<RequiredInfoDoc['docType']>,
    file: File
  ) {
    const formData = new FormData();

    formData.set('file', file);

    await this.requestCommerceHubJson<unknown>(
      `/interaction/doc/upload/${encodeURIComponent(
        sourceId
      )}/${encodeURIComponent(docType)}`,
      interactionId,
      {
        method: 'POST',
        body: formData,
        credentials: 'include',
      }
    );
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
    this.bankOutcomeSource = undefined;
    this.bankLinkLoading = true;
    this.ensurePayByBankProviderContainer(PAY_BY_BANK_PROVIDER_CONTAINER_ID);
    await this.updateComplete;

    try {
      await this.launchPayByBankProvider(
        interactionId,
        PAY_BY_BANK_PROVIDER_CONTAINER_ID
      );
    } catch (cause) {
      void cause;
      this.resetBankFlow();
      this.showPaymentSourceList({refresh: true});
    } finally {
      this.bankLinkLoading = false;
    }
  }

  private async launchPayByBankProvider(
    interactionId: string,
    containerId: string
  ) {
    const session = await this.requestCommerceHubJson<PayByBankSession>(
      '/interaction/source/pbb/session',
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
        appearance: resolvePaymentSdkAppearance(this.designConfig),
        publicKey,
        pToken,
        aggregatorSessionId,
        containerId,
        onEvent: async (event) => {
          if (settled || !isTerminalPaymentSdkEvent(event)) {
            return;
          }

          destroyPaymentSdk();

          if (event.type !== 'success') {
            settled = true;
            this.resetBankFlow();
            this.showPaymentSourceList({refresh: true});
            resolve();
            return;
          }

          try {
            const verificationResponse = await this.finalizePayByBankSession(
              interactionId,
              aggregatorSessionId,
              pToken
            );
            const resolvedBankSource =
              bankPaymentSourceFromVerificationResponse(verificationResponse);
            const paymentSourceId = resolvedBankSource.id?.trim();

            if (!paymentSourceId) {
              throw new Error(
                'Connect your bank completed but the resolved bank payment source did not include an id.'
              );
            }
            const nextInteractionResponse =
              this.interactionResponseWithAddedSource(
                interactionId,
                resolvedBankSource
              );

            this.setInteractionResponseFromSdk(nextInteractionResponse);
            this.resetBankFlow();

            if (resolvedBankSource.verificationInfo?.status === 'VERIFIED') {
              await this.attachPaymentSource(paymentSourceId);
              settled = true;
              resolve();
              return;
            }

            this.showAddedPaymentSourceStatus(resolvedBankSource);
            settled = true;
            resolve();
          } catch (cause) {
            settled = true;
            reject(cause);
          }
        },
      });
      this.bankLinkLoading = false;
    });
  }

  private async refreshPaymentSourcesFromInteraction() {
    const interactionId = this.interactionResponse?.interactionId;

    if (!interactionId || !this.shouldRefreshPaymentSourcesFromInteraction()) {
      return;
    }

    this.interactionRefreshInteractionId = interactionId;

    try {
      await this.fetchInteraction(interactionId);
    } catch (cause) {
      void cause;
    }
  }

  private queueNativeAccountBalanceRefresh() {
    const interactionId = this.interactionResponse?.interactionId;
    const nativeSources = nativePaymentSourcesFromInteractionResponse(
      this.interactionResponse
    );

    if (!interactionId || nativeSources.length === 0) {
      const shouldClearBalanceState =
        this.nativeBalanceFetchKey !== undefined ||
        this.nativeBalanceQueuedFetchKey !== undefined ||
        Object.keys(this.nativeAccountBalances).length > 0 ||
        this.nativeBalanceLoadingSourceIds.length > 0;

      this.nativeBalanceQueuedFetchKey = undefined;

      if (!shouldClearBalanceState) {
        return;
      }

      queueMicrotask(() => {
        const currentNativeSources =
          nativePaymentSourcesFromInteractionResponse(this.interactionResponse);

        if (currentNativeSources.length === 0) {
          this.nativeBalanceFetchKey = undefined;
          this.nativeAccountBalances = {};
          this.nativeBalanceLoadingSourceIds = [];
        }
      });
      return;
    }

    const fetchKey = nativeBalanceFetchKey(interactionId, nativeSources);

    if (
      this.nativeBalanceFetchKey === fetchKey ||
      this.nativeBalanceQueuedFetchKey === fetchKey
    ) {
      return;
    }

    this.nativeBalanceQueuedFetchKey = fetchKey;

    queueMicrotask(() => {
      if (this.nativeBalanceQueuedFetchKey !== fetchKey) {
        return;
      }

      this.nativeBalanceQueuedFetchKey = undefined;

      const currentInteractionId = this.interactionResponse?.interactionId;
      const currentNativeSources = nativePaymentSourcesFromInteractionResponse(
        this.interactionResponse
      );

      if (
        !currentInteractionId ||
        currentNativeSources.length === 0 ||
        nativeBalanceFetchKey(currentInteractionId, currentNativeSources) !==
          fetchKey
      ) {
        return;
      }

      void this.refreshNativeAccountBalances();
    });
  }

  private async refreshNativeAccountBalances() {
    const interactionId = this.interactionResponse?.interactionId;
    const nativeSources = nativePaymentSourcesFromInteractionResponse(
      this.interactionResponse
    );

    if (!interactionId || nativeSources.length === 0) {
      this.nativeBalanceFetchKey = undefined;
      this.nativeBalanceQueuedFetchKey = undefined;
      this.nativeAccountBalances = {};
      this.nativeBalanceLoadingSourceIds = [];
      return;
    }

    const fetchKey = nativeBalanceFetchKey(interactionId, nativeSources);

    if (this.nativeBalanceFetchKey === fetchKey) {
      return;
    }

    this.nativeBalanceFetchKey = fetchKey;
    this.nativeAccountBalances = {};
    this.nativeBalanceLoadingSourceIds = nativeSources.map(paymentSourceId);

    try {
      const response = await this.createSdkClient(interactionId).GET(
        '/interaction/source/native/balances'
      );

      if (this.nativeBalanceFetchKey !== fetchKey) {
        return;
      }

      this.nativeAccountBalances = response.data ?? {};
    } catch (cause) {
      void cause;

      if (this.nativeBalanceFetchKey === fetchKey) {
        this.nativeAccountBalances = {};
      }
    } finally {
      if (this.nativeBalanceFetchKey === fetchKey) {
        this.nativeBalanceLoadingSourceIds = [];
      }
    }
  }

  private shouldRefreshPaymentSourcesFromInteraction(): boolean {
    const interactionResponse = this.interactionResponse;
    const interactionId = interactionResponse?.interactionId;

    if (!interactionId) {
      return false;
    }

    if (this.interactionRefreshInteractionId === interactionId) {
      return false;
    }

    return (
      (interactionResponse.status === 'PAYMENT_SOURCE_REQUESTED' ||
        interactionResponse.status === 'PAYMENT_SOURCE_ATTACHED') &&
      interactionResponse.paymentSources === undefined
    );
  }

  private async fetchInteraction(
    interactionId: string
  ): Promise<InteractionResponse> {
    if (
      this.interactionRefreshInteractionId === interactionId &&
      this.interactionRefreshPromise
    ) {
      return this.interactionRefreshPromise;
    }

    this.interactionRefreshInteractionId = interactionId;
    this.interactionRefreshPromise = this.createSdkClient(interactionId)
      .GET('/interaction')
      .then((response) => interactionResponseFromApi(response))
      .then((interactionResponse) => {
        const refreshedInteractionResponse = interactionResponseWithSelection(
          this.interactionResponse ?? {interactionId},
          interactionResponse,
          this.selectedPaymentSourceId
        );

        this.setInteractionResponseFromSdk(refreshedInteractionResponse);

        return refreshedInteractionResponse;
      })
      .finally(() => {
        this.interactionRefreshPromise = undefined;
        this.requestUpdate();
      });

    return this.interactionRefreshPromise;
  }

  private syncBillingAddressesFromInteractionResponse(
    interactionResponse: InteractionResponse
  ) {
    if (!interactionResponse.billerAddress) {
      return;
    }

    this.billingAddresses = interactionResponse.billerAddress.filter(
      (address) => Boolean(address.id?.trim())
    );
    this.cardDraft = reconcileCardDraftBillingAddress(
      this.cardDraft,
      this.billingAddresses
    );
  }

  private async finalizePayByBankSession(
    interactionId: string,
    aggregatorSessionId: string,
    pToken: string
  ): Promise<VerificationResponse> {
    return this.requestCommerceHubJson<VerificationResponse>(
      `/interaction/source/pbb/session/${encodeURIComponent(
        aggregatorSessionId
      )}/${encodeURIComponent(pToken)}`,
      interactionId,
      {method: 'PUT', credentials: 'include'}
    );
  }

  private async verifyPaymentSourceStep1(
    interactionId: string,
    source: PaymentSource
  ): Promise<PaymentSource> {
    this.showMinimumVerificationOverlay('verify-payment-source');

    const verificationResponse =
      await this.requestCommerceHubJson<VerificationResponse>(
        '/interaction/verify/step1',
        interactionId,
        {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({value: source.id}),
          credentials: 'include',
        }
      );

    return this.sourceWithVerificationResponse(source, verificationResponse);
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

    const request = new Request(
      `${resolveCommerceHubBaseURL(this.baseURL)}${path}`,
      {
        ...init,
        headers,
      }
    );
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
    this.bankOutcomeSource = undefined;
    this.bankLinkLoading = false;
    this.bankAccountDraft = createBankAccountDraft();
    this.bankAccountDraftErrors = {};
    this.bankAccountEncryption = createBankAccountEncryptionState();
    this.bankAccountSubmitError = undefined;
    this.removePayByBankProviderContainer();
  }

  private resetCardFlow() {
    this.cardFlowScreen = undefined;
    this.cardDraft = createCardDraft();
    this.cardDraftErrors = {};
    this.cardEncryption = createCardEncryptionState();
    this.cardSubmitError = undefined;
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
      baseURL: this.baseURL,
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

    const baseFontWeight = this.designConfig?.baseFontWeight?.trim();

    if (baseFontWeight) {
      this.style.setProperty(
        DESIGN_CONFIG_FONT_WEIGHT_PROPERTY,
        baseFontWeight
      );
    } else {
      this.style.removeProperty(DESIGN_CONFIG_FONT_WEIGHT_PROPERTY);
    }

    const shellPadding = this.designConfig?.shellPadding?.trim();

    if (shellPadding) {
      this.style.setProperty(
        DESIGN_CONFIG_SHELL_PADDING_PROPERTY,
        shellPadding
      );
    } else {
      this.style.removeProperty(DESIGN_CONFIG_SHELL_PADDING_PROPERTY);
    }
  }
}

export interface DesignConfig {
  colors?: DesignConfigColors;
  baseFontSize?: string;
  baseFontWeight?: string;
  shellPadding?: string;
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
  widgetBackground?: string;
  widgetBorder?: string;
  borderBackground?: string;
  softSurface?: string;
  paymentMethodBackground?: string;
  paymentSelectionBackground?: string;
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

const createCardDraft = (): CardDraft => ({
  name: '',
  fullName: '',
  cardNumber: '',
  expirationDate: '',
  cvv: '',
  billingAddressValue: NEW_BILLING_ADDRESS_VALUE,
  country: '',
  addressLine1: '',
  addressLine2: '',
  city: '',
  state: '',
  zip: '',
});

const createBankAccountDraft = (): BankAccountDraft => ({
  routingNumber: '',
  accountNumber: '',
  accountNumberReEntered: '',
});

const createCardEncryptionFieldState = (): CardFieldEncryptionState => ({
  status: 'idle',
  normalizedValue: '',
});

const createCardEncryptionState = (): CardEncryptionState => ({
  cardNumber: createCardEncryptionFieldState(),
  cvv: createCardEncryptionFieldState(),
});

const createBankAccountEncryptionState = (): BankAccountEncryptionState => ({
  routingNumber: createCardEncryptionFieldState(),
  accountNumber: createCardEncryptionFieldState(),
  accountNumberReEntered: createCardEncryptionFieldState(),
});

const sanitizeOtpValue = (value: string): string => value.replace(/\D/g, '');

const findOtpInput = (event: Event): HTMLInputElement | undefined =>
  event
    .composedPath()
    .find(
      (item): item is HTMLInputElement =>
        item instanceof HTMLInputElement && item.classList.contains('otp-input')
    );

const findRequiredInfoSsnInput = (event: Event): HTMLInputElement | undefined =>
  event
    .composedPath()
    .find(
      (item): item is HTMLInputElement =>
        item instanceof HTMLInputElement &&
        item.classList.contains('required-info-ssn-input')
    );

const normalizeRequiredInfoSsn = (value: string): string =>
  value.replace(/\D/g, '').slice(0, 9);

const requiredInfoSsnSegments = (value: string): [string, string, string] => {
  const digits = normalizeRequiredInfoSsn(value);

  return [digits.slice(0, 3), digits.slice(3, 5), digits.slice(5, 9)];
};

const requiredInfoSsnInputMaxLength = (input: HTMLInputElement): number => {
  const segmentIndex = Number(input.dataset.requiredInfoSsnSegment);

  return REQUIRED_INFO_SSN_SEGMENT_LENGTHS[segmentIndex] ?? 0;
};

const isSensitiveCardField = (field?: string): field is SensitiveCardField =>
  field === 'cardNumber' || field === 'cvv';

const isSensitiveBankAccountField = (
  field?: string
): field is SensitiveBankAccountField =>
  field === 'routingNumber' ||
  field === 'accountNumber' ||
  field === 'accountNumberReEntered';

const normalizeCardNumber = (value: string): string => value.replace(/\D/g, '');

const formatCardDraftFieldValue = (
  field: keyof CardDraft,
  value: string
): string => {
  if (field === 'cardNumber') {
    return formatCardNumberForDisplay(value);
  }

  if (field === 'expirationDate') {
    return formatExpirationDateForDisplay(value);
  }

  if (field === 'cvv') {
    return normalizeCvv(value).slice(0, 4);
  }

  return value;
};

const formatCardNumberForDisplay = (value: string): string => {
  const digits = normalizeCardNumber(value).slice(0, 19);

  return formatDigitsByGroups(digits, resolveCardNumberGroupPattern(digits));
};

const resolveCardNumberGroupPattern = (digits: string): number[] => {
  if (/^3[47]/.test(digits)) {
    return [4, 6, 5];
  }

  if (/^3(?:0[0-5]|[68])/.test(digits)) {
    return [4, 6, 4];
  }

  return [4, 4, 4, 4, 3];
};

const formatDigitsByGroups = (digits: string, groups: number[]): string => {
  const parts: string[] = [];
  let offset = 0;

  for (const size of groups) {
    if (offset >= digits.length) {
      break;
    }

    parts.push(digits.slice(offset, offset + size));
    offset += size;
  }

  if (offset < digits.length) {
    parts.push(digits.slice(offset));
  }

  return parts.join(' ');
};

const normalizeCvv = (value: string): string => value.replace(/\D/g, '');

const formatExpirationDateForDisplay = (value: string): string => {
  const digits = value.replace(/\D/g, '').slice(0, 6);

  if (digits.length <= 2) {
    return digits.length === 2 ? `${digits} / ` : digits;
  }

  return `${digits.slice(0, 2)} / ${digits.slice(2)}`;
};

const normalizeSensitiveCardFieldValue = (
  field: SensitiveCardField,
  value: string
): string =>
  field === 'cardNumber' ? normalizeCardNumber(value) : normalizeCvv(value);

const normalizeCardDraft = (draft: CardDraft): CardDraft => ({
  name: draft.name.trim(),
  fullName: draft.fullName.trim(),
  cardNumber: draft.cardNumber.trim(),
  expirationDate: draft.expirationDate.trim(),
  cvv: draft.cvv.trim(),
  billingAddressValue:
    draft.billingAddressValue.trim() || NEW_BILLING_ADDRESS_VALUE,
  country: draft.country.trim(),
  addressLine1: draft.addressLine1.trim(),
  addressLine2: draft.addressLine2.trim(),
  city: draft.city.trim(),
  state: draft.state.trim(),
  zip: draft.zip.trim(),
});

const normalizeBankAccountNumber = (value: string): string =>
  value.replace(/\D/g, '');

const isEncryptedBankAccountDisplayValue = (
  value: string,
  encryptedField: CardFieldEncryptionState
): boolean =>
  encryptedField.status === 'encrypted' &&
  Boolean(encryptedField.normalizedValue) &&
  value === maskSensitiveDisplayValue(encryptedField.normalizedValue);

const maskSensitiveDisplayValue = (value: string): string => {
  if (value.length <= 4) {
    return value;
  }

  return `${'•'.repeat(value.length - 4)}${lastFour(value)}`;
};

const bankAccountInputType = (
  field: SensitiveBankAccountField,
  draft: BankAccountDraft,
  encryption: BankAccountEncryptionState
): 'password' | 'text' => {
  if (field === 'routingNumber') {
    return 'text';
  }

  return isEncryptedBankAccountDisplayValue(draft[field], encryption[field])
    ? 'text'
    : 'password';
};

const formatBankAccountDraftFieldValue = (
  field: keyof BankAccountDraft,
  value: string
): string => {
  if (field === 'routingNumber') {
    return normalizeBankAccountNumber(value).slice(0, 9);
  }

  if (field === 'accountNumber' || field === 'accountNumberReEntered') {
    return normalizeBankAccountNumber(value).slice(0, 17);
  }

  return value;
};

const normalizeBankAccountDraftForValidation = (
  draft: BankAccountDraft,
  encryption: BankAccountEncryptionState
): BankAccountDraft => ({
  routingNumber: normalizeBankAccountDraftFieldForValidation(
    'routingNumber',
    draft,
    encryption
  ),
  accountNumber: normalizeBankAccountDraftFieldForValidation(
    'accountNumber',
    draft,
    encryption
  ),
  accountNumberReEntered: normalizeBankAccountDraftFieldForValidation(
    'accountNumberReEntered',
    draft,
    encryption
  ),
});

const normalizeBankAccountDraftFieldForValidation = (
  field: SensitiveBankAccountField,
  draft: BankAccountDraft,
  encryption: BankAccountEncryptionState
): string => {
  const value = draft[field];
  const encryptedField = encryption[field];

  if (isEncryptedBankAccountDisplayValue(value, encryptedField)) {
    return encryptedField.normalizedValue;
  }

  return normalizeBankAccountNumber(value);
};

const normalizeBankAccountDraftForDisplay = (
  draft: BankAccountDraft,
  encryption: BankAccountEncryptionState
): BankAccountDraft => ({
  routingNumber: normalizeBankAccountDraftFieldForDisplay(
    'routingNumber',
    draft,
    encryption
  ),
  accountNumber: normalizeBankAccountDraftFieldForDisplay(
    'accountNumber',
    draft,
    encryption
  ),
  accountNumberReEntered: normalizeBankAccountDraftFieldForDisplay(
    'accountNumberReEntered',
    draft,
    encryption
  ),
});

const normalizeBankAccountDraftFieldForDisplay = (
  field: SensitiveBankAccountField,
  draft: BankAccountDraft,
  encryption: BankAccountEncryptionState
): string => {
  const value = draft[field];

  return isEncryptedBankAccountDisplayValue(value, encryption[field])
    ? value
    : normalizeBankAccountNumber(value);
};

const validateBankAccountDraft = (
  draft: BankAccountDraft
): BankAccountDraftErrors => {
  const errors: BankAccountDraftErrors = {};
  const routingNumber = normalizeBankAccountNumber(draft.routingNumber);
  const accountNumber = normalizeBankAccountNumber(draft.accountNumber);
  const accountNumberReEntered = normalizeBankAccountNumber(
    draft.accountNumberReEntered
  );

  if (!routingNumber) {
    errors.routingNumber = 'Enter a routing number.';
  } else if (routingNumber.length !== 9) {
    errors.routingNumber = 'Enter a 9-digit routing number.';
  }

  if (!accountNumber) {
    errors.accountNumber = 'Enter an account number.';
  }

  if (!accountNumberReEntered) {
    errors.accountNumberReEntered = 'Confirm the account number.';
  } else if (accountNumber && accountNumberReEntered !== accountNumber) {
    errors.accountNumberReEntered = 'Account numbers must match.';
  }

  return errors;
};

const isBankAccountDraftReady = (
  draft: BankAccountDraft,
  encryption: BankAccountEncryptionState
): boolean => {
  const normalizedDraft = normalizeBankAccountDraftForValidation(
    draft,
    encryption
  );

  return (
    Object.keys(validateBankAccountDraft(normalizedDraft)).length === 0 &&
    (['routingNumber', 'accountNumber', 'accountNumberReEntered'] as const)
      .every((field) => {
        const encryptedField = encryption[field];
        const normalizedValue = normalizedDraft[field];

        return (
          encryptedField.status === 'encrypted' &&
          encryptedField.normalizedValue === normalizedValue &&
          Boolean(encryptedField.encryptedValue)
        );
      })
  );
};

const validateCardDraft = (draft: CardDraft): CardDraftErrors => {
  const errors: CardDraftErrors = {};

  if (!draft.name) {
    errors.name = 'Enter a card name.';
  }

  if (!draft.fullName) {
    errors.fullName = 'Enter the full name.';
  }

  if (!isValidCardNumber(draft.cardNumber)) {
    errors.cardNumber = 'Enter a valid card number.';
  }

  if (!parseExpirationDate(draft.expirationDate)) {
    errors.expirationDate = 'Enter a valid expiration date.';
  }

  if (!isValidCvv(draft.cvv)) {
    errors.cvv = 'Enter a valid CVC.';
  }

  if (!draft.billingAddressValue) {
    errors.billingAddressValue = 'Select a billing address.';
  }

  if (draft.billingAddressValue === NEW_BILLING_ADDRESS_VALUE) {
    if (!draft.country) {
      errors.country = 'Select a country or region.';
    }

    if (!draft.addressLine1) {
      errors.addressLine1 = 'Enter an address.';
    }

    if (!draft.city) {
      errors.city = 'Enter a city.';
    }

    if (!draft.state) {
      errors.state = 'Select a state.';
    }

    if (!/^\d{5}(?:-\d{4})?$/.test(draft.zip)) {
      errors.zip = 'Enter a valid ZIP code.';
    }
  }

  return errors;
};

const isCardDraftReady = (
  draft: CardDraft,
  encryption: CardEncryptionState
): boolean =>
  Object.keys(validateCardDraft(normalizeCardDraft(draft))).length === 0 &&
  Object.keys(validateCardEncryptionReadiness(draft, encryption)).length === 0;

const validateSensitiveCardField = (
  field: SensitiveCardField,
  value: string
): string | undefined => {
  if (field === 'cardNumber') {
    return isValidCardNumber(value) ? undefined : 'Enter a valid card number.';
  }

  return isValidCvv(value) ? undefined : 'Enter a valid CVC.';
};

const buildCardEncryptionErrorMessage = (field: SensitiveCardField): string =>
  field === 'cardNumber'
    ? 'Unable to encrypt the card number. Try again.'
    : 'Unable to encrypt the CVC. Try again.';

const buildBankAccountEncryptionErrorMessage = (
  field: SensitiveBankAccountField
): string =>
  field === 'routingNumber'
    ? 'Unable to encrypt the routing number. Try again.'
    : 'Unable to encrypt the account number. Try again.';

const resolveDirtyCardEncryptionState = (
  previous: CardFieldEncryptionState,
  normalizedValue: string
): CardFieldEncryptionState => {
  if (!normalizedValue) {
    return createCardEncryptionFieldState();
  }

  if (
    previous.normalizedValue === normalizedValue &&
    (previous.status === 'encrypting' || previous.status === 'encrypted')
  ) {
    return previous;
  }

  return {
    status: 'dirty',
    normalizedValue,
  };
};

const omitCardDraftError = (
  errors: CardDraftErrors,
  field: keyof CardDraft
): CardDraftErrors => {
  const nextErrors = {...errors};

  delete nextErrors[field];

  return nextErrors;
};

const omitBankAccountDraftError = (
  errors: BankAccountDraftErrors,
  field: keyof BankAccountDraft
): BankAccountDraftErrors => {
  const nextErrors = {...errors};

  delete nextErrors[field];

  return nextErrors;
};

const validateCardEncryptionReadiness = (
  draft: CardDraft,
  encryption: CardEncryptionState
): CardDraftErrors => {
  const errors: CardDraftErrors = {};

  for (const field of ['cardNumber', 'cvv'] as const) {
    const normalizedValue = normalizeSensitiveCardFieldValue(
      field,
      draft[field]
    );
    const encryptedField = encryption[field];

    if (!normalizedValue) {
      continue;
    }

    const isEncrypted =
      encryptedField.status === 'encrypted' &&
      encryptedField.normalizedValue === normalizedValue &&
      Boolean(encryptedField.encryptedValue);

    if (!isEncrypted) {
      errors[field] =
        encryptedField.status === 'failed'
          ? buildCardEncryptionErrorMessage(field)
          : field === 'cardNumber'
          ? 'Encrypt the card number before saving.'
          : 'Encrypt the CVC before saving.';
    }
  }

  return errors;
};

const resolveEncryptedCardFieldValue = (
  field: SensitiveCardField,
  value: string,
  encryption: CardEncryptionState
): string => {
  const normalizedValue = normalizeSensitiveCardFieldValue(field, value);
  const encryptedField = encryption[field];

  if (
    encryptedField.status !== 'encrypted' ||
    encryptedField.normalizedValue !== normalizedValue ||
    !encryptedField.encryptedValue
  ) {
    throw new Error(
      field === 'cardNumber'
        ? 'Card number encryption must complete before saving.'
        : 'CVC encryption must complete before saving.'
    );
  }

  return encryptedField.encryptedValue;
};

const resolveBankAccountPayloadFieldValue = (
  field: SensitiveBankAccountField,
  draft: BankAccountDraft,
  encryption: BankAccountEncryptionState
): string => {
  const value = draft[field];
  const normalizedValue = normalizeBankAccountNumber(value);
  const encryptedField = encryption[field];
  const matchesEncryptedValue =
    isEncryptedBankAccountDisplayValue(value, encryptedField) ||
    normalizedValue === encryptedField.normalizedValue;

  if (
    encryptedField.status === 'encrypted' &&
    encryptedField.encryptedValue &&
    matchesEncryptedValue
  ) {
    return encryptedField.encryptedValue;
  }

  if (!normalizedValue) {
    return '';
  }

  throw new Error('ACH detail encryption must complete before saving.');
};

const bankAccountFieldLastFour = (
  field: SensitiveBankAccountField,
  encryption: BankAccountEncryptionState,
  draft: BankAccountDraft
): string => lastFour(encryption[field].normalizedValue || draft[field]);

const isValidCardNumber = (value: string): boolean => {
  const digits = normalizeCardNumber(value);

  if (digits.length < 12 || digits.length > 19) {
    return false;
  }

  let sum = 0;
  let shouldDouble = false;

  for (let index = digits.length - 1; index >= 0; index -= 1) {
    let digit = Number(digits[index]);

    if (shouldDouble) {
      digit *= 2;

      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    shouldDouble = !shouldDouble;
  }

  return sum % 10 === 0;
};

const isValidCvv = (value: string): boolean =>
  /^\d{3,4}$/.test(normalizeCvv(value));

const parseExpirationDate = (
  value: string
): {month: string; year: string} | undefined => {
  const digits = value.replace(/\D/g, '');
  const month = digits.slice(0, 2);
  const yearDigits = digits.slice(2);
  const monthNumber = Number(month);

  if (month.length !== 2 || monthNumber < 1 || monthNumber > 12) {
    return undefined;
  }

  if (yearDigits.length === 2) {
    return {month, year: `20${yearDigits}`};
  }

  if (yearDigits.length === 4) {
    return {month, year: yearDigits};
  }

  return undefined;
};

const detectCardNetwork = (
  value: string
): NonNullable<CardPaymentSource['card']>['network'] | undefined => {
  const digits = normalizeCardNumber(value);

  if (/^4/.test(digits)) {
    return 'Visa';
  }

  if (/^(5[1-5]|2[2-7])/.test(digits)) {
    return 'Mastercard';
  }

  if (/^3[47]/.test(digits)) {
    return 'AmericanExpress';
  }

  if (/^(6011|65|64[4-9])/.test(digits)) {
    return 'Discover';
  }

  return undefined;
};

const reconcileCardDraftBillingAddress = (
  draft: CardDraft,
  billingAddresses: Address[]
): CardDraft => {
  const savedAddressIds = billingAddresses
    .map((address) => address.id?.trim())
    .filter((addressId): addressId is string => Boolean(addressId));

  if (!savedAddressIds.length) {
    return {
      ...draft,
      billingAddressValue: NEW_BILLING_ADDRESS_VALUE,
    };
  }

  if (savedAddressIds.includes(draft.billingAddressValue)) {
    return draft;
  }

  const hasNewBillingAddressInput = [
    draft.country,
    draft.addressLine1,
    draft.addressLine2,
    draft.city,
    draft.state,
    draft.zip,
  ].some((value) => value.trim());

  if (
    draft.billingAddressValue === NEW_BILLING_ADDRESS_VALUE &&
    hasNewBillingAddressInput
  ) {
    return draft;
  }

  return {
    ...draft,
    billingAddressValue: savedAddressIds[0],
  };
};

const billingAddressLabel = (address: Address): string => {
  const stateZip = [address.stateOrProvince, address.postalCode]
    .filter(Boolean)
    .join(' ');
  const cityStateZip = [address.city, stateZip].filter(Boolean).join(', ');
  const label = [address.street, cityStateZip].filter(Boolean).join(', ');

  return label || address.id || 'Saved billing address';
};

const billingAddressFromCardDraft = (draft: CardDraft): Address => ({
  id: createLocalBillingAddressId(),
  recipientNameOrAddress: draft.fullName,
  country: draft.country,
  street: draft.addressLine1,
  houseNumberOrName: draft.addressLine2 || undefined,
  city: draft.city,
  stateOrProvince: draft.state,
  postalCode: draft.zip,
});

let billingAddressIdCounter = 0;

const createLocalBillingAddressId = (): string => {
  billingAddressIdCounter += 1;

  return `billing-address-${Date.now().toString(
    36
  )}-${billingAddressIdCounter.toString(36)}`;
};

const cardPaymentSourceFromPayload = (
  source: CardSourcePayload,
  displayCardNumber?: string
): CardPaymentSource => {
  const displayLast4 = normalizeCardNumber(displayCardNumber ?? '').slice(-4);

  return {
    ...source,
    tenderType: 'Card',
    card: {
      ...source.card,
      ...(displayLast4 ? {cardNumber: displayLast4} : {}),
    },
  };
};

const bankPaymentSourceFromPayload = (
  source: BankAccountSourcePayload,
  displayAccountNumber?: string
): BankPaymentSource => {
  const displayLast4 = normalizeBankAccountNumber(
    displayAccountNumber ?? ''
  ).slice(-4);

  return {
    ...source,
    tenderType: 'BankAccount',
    bankAccount: {
      ...source.bankAccount,
      ...(displayLast4 ? {accountNumber: displayLast4} : {}),
    },
  };
};

const bankPaymentSourceFromVerificationResponse = (
  response: VerificationResponse
): BankPaymentSource & {id: string} => ({
  id: sourceIdFromVerificationResponse(
    response,
    'Connect your bank completed but the verification response did not include a source id.'
  ),
  tenderType: 'BankAccount',
  verificationInfo: verificationInfoFromVerificationResponse(response),
  bankAccount: {},
});

const sourceIdFromVerificationResponse = (
  response: VerificationResponse,
  errorMessage: string
): string => {
  const sourceId = response.sourceId?.trim();

  if (!sourceId) {
    throw new Error(errorMessage);
  }

  return sourceId;
};

const verificationInfoFromVerificationResponse = (
  response: VerificationResponse
): VerificationInfo => {
  const {sourceId, ...verificationInfo} = response;

  void sourceId;

  return verificationInfo;
};

const defaultOtpSubtitle = (destination?: string): string =>
  `We sent a one-time code to ${destination ?? 'your contact method'}.`;

const resolveOtpDestination = (
  interactionResponse?: InteractionResponse
): string | undefined => {
  const email = interactionResponse?.email?.trim();

  if (email) {
    return email;
  }

  const countryCode = interactionResponse?.phone?.countryCode?.trim();
  const phoneNumber = interactionResponse?.phone?.phoneNumber?.trim();

  return [countryCode, phoneNumber].filter(Boolean).join(' ') || undefined;
};

const resolveOtpCopy = (designConfig?: DesignConfig): ResolvedOtpCopy => {
  const copy = designConfig?.copy?.otp;

  return {
    title: copy?.title ?? 'Enter verification code',
    subtitle: copy?.subtitle,
    failedMessage: copy?.failedMessage ?? 'The code does not match. Try again.',
    resendPrefix: copy?.resendPrefix ?? "Didn't receive the code?",
    resendButton: copy?.resendButton ?? 'Resend code',
    resendPendingButton: copy?.resendPendingButton ?? 'Sending code...',
    verifyButton: copy?.verifyButton ?? 'Verify',
    verifyingButton: copy?.verifyingButton ?? 'Verifying...',
    tryAgainButton: copy?.tryAgainButton ?? 'Try again',
  };
};

const resolvePaymentMethodsCopy = (
  designConfig?: DesignConfig
): ResolvedPaymentMethodsCopy => {
  const copy = designConfig?.copy?.paymentMethods;

  return {
    title: copy?.title ?? 'Pay with',
    subtitle: copy?.subtitle ?? '',
    addBankAccountTitle: copy?.addBankAccountTitle ?? 'Add bank account',
    addBankAccountSubtitle: copy?.addBankAccountSubtitle ?? '',
    addCardTitle: copy?.addCardTitle ?? 'Add credit or debit card',
    addCardSubtitle: copy?.addCardSubtitle ?? '',
    continueButton: copy?.continueButton ?? 'Confirm',
    continuingButton: copy?.continuingButton ?? 'Confirming...',
  };
};

const resolveNoSavedPaymentMethodsCopy = (
  designConfig?: DesignConfig
): ResolvedNoSavedPaymentMethodsCopy => {
  const copy = designConfig?.copy?.noSavedPaymentMethods;

  return {
    title: copy?.title ?? 'Add payment method',
    subtitle: copy?.subtitle ?? '',
    emptyTitle: copy?.emptyTitle ?? '',
    emptyMessage: copy?.emptyMessage ?? '',
    addBankAccountTitle: copy?.addBankAccountTitle ?? 'Add bank account',
    addBankAccountSubtitle: copy?.addBankAccountSubtitle ?? '',
    addCardTitle: copy?.addCardTitle ?? 'Add credit or debit card',
    addCardSubtitle: copy?.addCardSubtitle ?? '',
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

const resolvePaymentSdkAppearance = (
  designConfig?: DesignConfig
): PaymentSdkAppearance => {
  const colors = designConfig?.colors;
  const branding: PaymentSdkAppearanceBranding = {};

  setPaymentSdkBrandingValue(
    branding,
    'backgroundColor',
    firstPaymentSdkBrandingValue(colors?.widgetBackground, colors?.surface)
  );
  setPaymentSdkBrandingValue(branding, 'primaryColor', colors?.primary);
  setPaymentSdkBrandingValue(branding, 'buttonColor', colors?.primary);
  setPaymentSdkBrandingValue(branding, 'primaryTextColor', colors?.text);
  setPaymentSdkBrandingValue(
    branding,
    'secondaryTextColor',
    firstPaymentSdkBrandingValue(colors?.copy, colors?.muted)
  );
  setPaymentSdkBrandingValue(branding, 'dangerColor', colors?.danger);
  setPaymentSdkBrandingValue(branding, 'successColor', colors?.success);
  setPaymentSdkBrandingValue(
    branding,
    'borderColor',
    firstPaymentSdkBrandingValue(
      colors?.border,
      colors?.widgetBorder,
      colors?.borderBackground
    )
  );
  setPaymentSdkBrandingValue(
    branding,
    'placeholderColor',
    colors?.placeholder
  );

  return {branding};
};

const firstPaymentSdkBrandingValue = (
  ...values: (string | undefined)[]
): string | undefined =>
  values.map((value) => value?.trim()).find((value) => Boolean(value));

const setPaymentSdkBrandingValue = (
  branding: PaymentSdkAppearanceBranding,
  field: keyof PaymentSdkAppearanceBranding,
  value?: string
) => {
  const trimmedValue = value?.trim();

  if (trimmedValue) {
    branding[field] = trimmedValue;
  }
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
  {field: 'widgetBackground', property: '--chc-widget-background'},
  {field: 'borderBackground', property: '--chc-border'},
  {field: 'widgetBorder', property: '--chc-border'},
  {field: 'softSurface', property: '--chc-soft-surface'},
  {
    field: 'paymentSelectionBackground',
    property: '--chc-payment-method-background',
  },
  {
    field: 'paymentMethodBackground',
    property: '--chc-payment-method-background',
  },
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

const DESIGN_CONFIG_FONT_WEIGHT_PROPERTY = '--chc-font-weight';
const DESIGN_CONFIG_SHELL_PADDING_PROPERTY = '--chc-shell-padding';

const designConfigStyleProperties = [
  ...designConfigColorProperties.map(({property}) => property),
  DESIGN_CONFIG_FONT_WEIGHT_PROPERTY,
  DESIGN_CONFIG_SHELL_PADDING_PROPERTY,
];

const paymentMethodsFromInteractionResponse = (
  interactionResponse?: InteractionResponse,
  options: PaymentSourceToPaymentMethodOptions = {}
): PaymentMethod[] => {
  const paymentSources = interactionResponse?.paymentSources;

  if (!paymentSources?.length) {
    const selectedSource =
      selectedPaymentSourceFromInteractionResponse(interactionResponse);

    if (selectedSource) {
      return [
        paymentSourceToPaymentMethod(selectedSource, {
          ...options,
          selected: true,
        }),
      ];
    }

    return interactionResponse?.status === 'PAYMENT_SOURCE_REQUESTED'
      ? []
      : demoPaymentMethods;
  }

  return paymentSources.map((source) =>
    paymentSourceToPaymentMethod(source, options)
  );
};

const allowedTenderOptionsFromInteractionResponse = (
  interactionResponse?: InteractionResponse
): AllowedTenderOptions => {
  const allowedTenderTypes = interactionResponse?.allowedTenderTypes;

  if (!allowedTenderTypes) {
    return {card: true, bankAccount: true, nativeAccount: true};
  }

  return {
    card: allowedTenderTypes.includes('CARD'),
    bankAccount: allowedTenderTypes.includes('BANK_ACCOUNT'),
    nativeAccount: allowedTenderTypes.includes('NATIVE_ACCOUNT'),
  };
};

const paymentSourceToPaymentMethod = (
  source: PaymentSource,
  {
    selected = false,
    nativeBalances = {},
    nativeBalanceLoadingSourceIds = [],
  }: PaymentSourceToPaymentMethodOptions = {}
): PaymentMethod => {
  const sourceId = paymentSourceId(source);
  const nativeBalance = isNativePaymentSource(source)
    ? nativeAccountBalanceForSource(source, nativeBalances)
    : undefined;
  const balance =
    nativeBalance?.balance === undefined
      ? undefined
      : formatNativeAccountBalance(nativeBalance.balance);

  return {
    id: sourceId,
    label: paymentSourceDisplayName(source, {selected}),
    type: paymentSourcePaymentMethodType(source),
    brand: paymentSourceBrand(source),
    accountLabel: paymentSourceAccountLabel(source),
    balanceLabel: balance,
    balanceLoading:
      isNativePaymentSource(source) &&
      nativeBalanceLoadingSourceIds.includes(sourceId),
    last4: paymentSourceLast4(source),
    status: verificationStatusToPaymentMethodStatus(
      source.verificationInfo?.status
    ),
    showVerificationStatus: Boolean(source.verificationInfo?.status),
  };
};

const paymentSourceDisplayName = (
  source: PaymentSource,
  {selected = false}: {selected?: boolean} = {}
): string => {
  if (isCardPaymentSource(source)) {
    if (selected) {
      return (
        source.name?.trim() ||
        source.card?.nameOnCard?.trim() ||
        paymentSourceLabel(source)
      );
    }

    return (
      source.card?.nameOnCard?.trim() ||
      source.name?.trim() ||
      paymentSourceLabel(source)
    );
  }

  if (isBankPaymentSource(source)) {
    return (
      source.name?.trim() ||
      source.bankAccount?.bankName?.trim() ||
      paymentSourceLabel(source)
    );
  }

  if (isNativePaymentSource(source)) {
    return (
      source.account?.accountName?.trim() ||
      source.name?.trim() ||
      paymentSourceLabel(source)
    );
  }

  return source.name?.trim() || paymentSourceLabel(source);
};

const paymentSourceLabel = (source: PaymentSource): string => {
  if (isCardPaymentSource(source)) {
    return 'Saved card';
  }

  if (isBankPaymentSource(source)) {
    return source.bankAccount?.bankName ?? 'Saved bank account';
  }

  if (isNativePaymentSource(source)) {
    return 'Native account';
  }

  return 'Dynamic session card';
};

const paymentSourceBrand = (source: PaymentSource): string => {
  if (isCardPaymentSource(source)) {
    return source.card?.network ?? 'Card';
  }

  if (isBankPaymentSource(source)) {
    return source.bankAccount?.bankName ?? 'Bank account';
  }

  if (isNativePaymentSource(source)) {
    return source.account?.accountType ?? 'Native account';
  }

  return 'DSC';
};

const paymentSourceAccountLabel = (source: PaymentSource): string => {
  const last4 = paymentSourceLast4(source);
  const masked = `•••• ${last4}`;

  if (isNativePaymentSource(source)) {
    const accountType = source.account?.accountType?.trim();

    return accountType ? `${accountType} ${masked}` : masked;
  }

  return masked;
};

const paymentSourceLast4 = (source: PaymentSource): string => {
  if (isCardPaymentSource(source)) {
    return lastFour(source.card?.cardNumber);
  }

  if (isBankPaymentSource(source)) {
    return lastFour(source.bankAccount?.accountNumber);
  }

  if (isNativePaymentSource(source)) {
    return lastFour(source.account?.accountHandle);
  }

  return lastFour(source.id);
};

const paymentSourceId = (source: PaymentSource): string =>
  source.id?.trim() || source.name?.trim() || source.tenderType;

const paymentSourcePaymentMethodType = (
  source: PaymentSource
): PaymentMethod['type'] => {
  if (isBankPaymentSource(source)) {
    return 'bank';
  }

  if (isNativePaymentSource(source)) {
    return 'native';
  }

  return 'card';
};

const nativePaymentSourcesFromInteractionResponse = (
  interactionResponse?: InteractionResponse
): NativePaymentSource[] =>
  (interactionResponse?.paymentSources ?? []).filter(isNativePaymentSource);

const nativeBalanceFetchKey = (
  interactionId: string,
  sources: NativePaymentSource[]
): string =>
  `${interactionId}:${sources
    .map((source) => nativeAccountBalanceMatchKeys(source).join(','))
    .join('|')}`;

const nativeAccountBalanceForSource = (
  source: NativePaymentSource,
  balances: NativeAccountBalanceMap
): NativeAccountBalanceInfo | undefined => {
  for (const key of nativeAccountBalanceMatchKeys(source)) {
    const balance = balances[key];

    if (balance) {
      return balance;
    }
  }

  return Object.values(balances).find((balance) =>
    nativeAccountBalanceMatchKeys(source).includes(balance.id?.trim() ?? '')
  );
};

const nativeAccountBalanceMatchKeys = (source: NativePaymentSource): string[] =>
  [source.id, source.account?.accountHandle]
    .map((value) => value?.trim())
    .filter((value): value is string => Boolean(value));

const formatNativeAccountBalance = (balance: number): string =>
  nativeAccountBalanceFormatter.format(balance);

const nativeAccountBalanceFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

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

  return interactionResponse?.selectedSource?.id;
};

const resolvePreferredPaymentSource = (
  paymentSources: PaymentSource[],
  preferredPaymentSourceId?: string
): PaymentSource | undefined => {
  if (preferredPaymentSourceId) {
    const preferredSource = paymentSources.find(
      (source) => source.id === preferredPaymentSourceId
    );

    if (preferredSource) {
      return preferredSource;
    }
  }

  return undefined;
};

const selectedPaymentSourceFromInteractionResponse = (
  interactionResponse?: InteractionResponse,
  selectedPaymentSourceId?: string
): PaymentSource | undefined => {
  if (selectedPaymentSourceId) {
    const selectedSource = interactionResponse?.paymentSources?.find(
      (source) => source.id === selectedPaymentSourceId
    );

    if (selectedSource) {
      return selectedSource;
    }
  }

  return interactionResponse?.selectedSource;
};

const interactionResponseWithSelection = (
  current: InteractionResponse,
  response: InteractionResponse,
  preferredPaymentSourceId?: string
): InteractionResponse => {
  const base = {
    ...current,
    ...response,
  };
  const paymentSources =
    response.paymentSources ?? current.paymentSources ?? [];
  const selectedSource =
    resolvePreferredPaymentSource(
      paymentSources,
      preferredPaymentSourceId ?? response.selectedSource?.id
    ) ??
    response.selectedSource ??
    current.selectedSource;

  return {
    ...base,
    selectedSource,
    paymentSources,
  };
};

const interactionResponseWithoutPaymentSource = (
  current: InteractionResponse,
  paymentSourceId: string
): InteractionResponse => {
  const paymentSources = (current.paymentSources ?? []).filter(
    (source) => source.id !== paymentSourceId
  );
  const selectedSource =
    current.selectedSource?.id === paymentSourceId
      ? undefined
      : current.selectedSource;

  return {
    ...current,
    status:
      current.status === 'PAYMENT_SOURCE_ATTACHED' && !selectedSource
        ? 'PAYMENT_SOURCE_REQUESTED'
        : current.status,
    selectedSource,
    paymentSources,
  };
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

  if (status === 'UNDER_REVIEW') {
    return 'under-review';
  }

  if (status === 'REQUIRE_INFO') {
    return 'require-info';
  }

  if (status === 'DECLINED') {
    return 'declined';
  }

  return 'not-verified';
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
      'The /interaction/source/pbb/session response is missing one or more required values.'
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

const withUpsertedSource = (
  interactionResponse: InteractionResponse,
  source: PaymentSource
): InteractionResponse => {
  const paymentSources = upsertPaymentSources(
    interactionResponse.paymentSources ?? [],
    source
  );

  return {
    ...interactionResponse,
    selectedSource: source,
    paymentSources,
  };
};

const withUpsertedSourcePreservingSelection = (
  interactionResponse: InteractionResponse,
  source: PaymentSource
): InteractionResponse => ({
  ...interactionResponse,
  paymentSources: upsertPaymentSources(
    interactionResponse.paymentSources ?? [],
    source
  ),
});

const upsertPaymentSources = (
  paymentSources: PaymentSource[],
  source: PaymentSource
): PaymentSource[] => {
  const nextPaymentSources = paymentSources.some(
    (paymentSource) => paymentSource.id === source.id
  )
    ? paymentSources.map((paymentSource) =>
        paymentSource.id === source.id ? source : paymentSource
      )
    : [source, ...paymentSources];

  return nextPaymentSources;
};

const shouldPreselectAddedPaymentSource = (source: PaymentSource): boolean =>
  source.verificationInfo?.status === 'VERIFIED';

type WidgetLoadingOverlayCopy = {
  title: string;
  helper: string;
};

const renderWidgetLoadingOverlay = ({
  title,
  helper,
}: WidgetLoadingOverlayCopy): TemplateResult => html`
  <div class="widget-loading-status" role="status" aria-live="polite">
    <span class="widget-loading-animation" aria-hidden="true">
      <span class="widget-loading-animation-dot"></span>
      <span class="widget-loading-animation-dot"></span>
      <span class="widget-loading-animation-dot"></span>
    </span>
    <span class="widget-loading-copy">
      <span class="widget-loading-title">${title}</span>
      <span class="widget-loading-helper">${helper}</span>
    </span>
  </div>
`;

const verificationActionLoadingOverlay = (
  action?: VerificationOverlayAction
): TemplateResult | undefined => {
  if (action === 'verify-payment-source') {
    return renderWidgetLoadingOverlay({
      title: 'Verifying payment method',
      helper: 'Verifying your payment method, please wait.',
    });
  }

  if (action === 'submit-required-info') {
    return renderWidgetLoadingOverlay({
      title: 'Verifying account',
      helper: 'Reviewing your verification information, please wait.',
    });
  }

  return undefined;
};

const paymentSourceActionLoadingOverlay = (
  action?: FlowActionName
): TemplateResult | undefined => {
  if (action === 'verify-payment-source') {
    return verificationActionLoadingOverlay(action);
  }

  if (action === 'delete-payment-source') {
    return renderWidgetLoadingOverlay({
      title: 'Deleting payment method',
      helper: 'Deleting your payment method, please wait.',
    });
  }

  if (action === 'attach-payment-source') {
    return renderWidgetLoadingOverlay({
      title: 'Saving payment method',
      helper: 'Saving your payment method, please wait.',
    });
  }

  return undefined;
};

type BankOutcome = {
  kind: 'verified' | 'pending' | 'requires-info' | 'declined' | 'failed';
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

  if (status === 'UNDER_REVIEW') {
    return {
      kind: 'pending',
      variant: 'warning',
      title: 'Bank account pending review',
      message: 'We will update this bank account after review is complete.',
    };
  }

  if (status === 'REQUIRE_INFO') {
    return {
      kind: 'requires-info',
      variant: 'warning',
      title: 'Complete account verification',
      message:
        'Additional information is required before this bank account can be verified.',
    };
  }

  if (status === 'DECLINED') {
    return {
      kind: 'declined',
      variant: 'danger',
      title: 'Bank account verification failed',
      message: 'This bank account could not be verified.',
    };
  }

  return {
    kind: 'failed',
    variant: 'danger',
    title: 'Bank account not verified',
    message: 'This bank account is not verified yet.',
  };
};

const resolveSavedSourceVerificationOutcome = (
  source?: PaymentSource,
  failed = false
): BankOutcome => {
  const subject = paymentSourceVerificationSubject(source);
  const subjectLowerCase = subject.toLowerCase();
  const status = source?.verificationInfo?.status;

  if (failed) {
    return {
      kind: 'failed',
      variant: 'danger',
      title:
        subject === 'Bank account'
          ? 'Bank account verification failed'
          : `${subject} not verified`,
      message: `We could not verify this ${subjectLowerCase} right now.`,
    };
  }

  if (status === 'VERIFIED') {
    return {
      kind: 'verified',
      variant: 'success',
      title:
        subject === 'Bank account'
          ? 'Bank account verified'
          : `${subject} saved`,
      message: `This ${subjectLowerCase} is verified and ready to use.`,
    };
  }

  if (status === 'UNDER_REVIEW') {
    return {
      kind: 'pending',
      variant: 'warning',
      title:
        subject === 'Bank account'
          ? 'Bank account pending review'
          : 'Verification pending review',
      message: `We will update this ${subjectLowerCase} after review is complete.`,
    };
  }

  if (status === 'REQUIRE_INFO') {
    return {
      kind: 'requires-info',
      variant: 'warning',
      title: 'Complete account verification',
      message: `Additional information is required before this ${subjectLowerCase} can be verified.`,
    };
  }

  if (status === 'DECLINED') {
    return {
      kind: 'declined',
      variant: 'danger',
      title:
        subject === 'Bank account'
          ? 'Bank account verification failed'
          : `${subject} declined`,
      message: `This ${subjectLowerCase} could not be verified.`,
    };
  }

  return {
    kind: 'failed',
    variant: 'danger',
    title:
      subject === 'Bank account'
        ? 'Bank account not verified'
        : `${subject} not verified`,
    message: `This ${subjectLowerCase} is not verified yet.`,
  };
};

type RequiredInfoDoc = NonNullable<
  NonNullable<PaymentSource['verificationInfo']>['docs']
>[number];
type RequiredInfoTextInputType = 'text' | 'password';
type RequiredInfoTextInputMode = 'text' | 'numeric';
const REQUIRED_INFO_SSN_SEGMENT_LENGTHS = [3, 2, 4] as const;

const requiredInfoDocs = (source?: PaymentSource): RequiredInfoDoc[] => {
  const docs = source?.verificationInfo?.docs ?? [];

  return docs.length > 0 ? docs : [{}];
};

const requiredInfoDocKey = (doc?: RequiredInfoDoc, index = 0): string =>
  `${doc?.docType ?? 'DOCUMENT'}-${index}`;

const isRequiredInfoTextDoc = (doc: RequiredInfoDoc): boolean =>
  doc.docType === 'DRIVER_LICENSE_NUMBER' ||
  doc.docType === 'SOCIAL_SECURITY_NUMBER';

const isRequiredInfoDocMandatory = (doc: RequiredInfoDoc): boolean =>
  doc.mandatory !== false;

const requiredInfoRequirementKind = (
  doc: RequiredInfoDoc
): 'required' | 'optional' =>
  isRequiredInfoDocMandatory(doc) ? 'required' : 'optional';

const requiredInfoRequirementLabel = (doc: RequiredInfoDoc): string =>
  isRequiredInfoDocMandatory(doc) ? 'Required' : 'Optional';

const renderRequiredInfoRequirementBadge = (
  doc: RequiredInfoDoc
): TemplateResult => html`
  <span
    class="required-info-requirement-badge required-info-requirement-badge-${requiredInfoRequirementKind(
      doc
    )}"
  >
    ${requiredInfoRequirementLabel(doc)}
  </span>
`;

const firstRequiredInfoUploadDocKey = (
  docs: RequiredInfoDoc[]
): string | undefined => {
  const uploadDocIndex = docs.findIndex((doc) => !isRequiredInfoTextDoc(doc));

  return uploadDocIndex >= 0
    ? requiredInfoDocKey(docs[uploadDocIndex], uploadDocIndex)
    : undefined;
};

const requiredInfoTextInputType = (
  doc: RequiredInfoDoc
): RequiredInfoTextInputType =>
  doc.docType === 'SOCIAL_SECURITY_NUMBER' ? 'password' : 'text';

const requiredInfoTextInputMode = (
  doc: RequiredInfoDoc
): RequiredInfoTextInputMode =>
  doc.docType === 'SOCIAL_SECURITY_NUMBER' ? 'numeric' : 'text';

const renderRequiredInfoTextField = ({
  doc,
  key,
  value,
}: {
  doc: RequiredInfoDoc;
  key: string;
  value: string;
}): TemplateResult => {
  if (doc.docType === 'SOCIAL_SECURITY_NUMBER') {
    return renderRequiredInfoSsnField({doc, key, value});
  }

  const id = `required-info-${key}`;

  return html`
    <div
      class="required-info-document required-info-text-document required-document-text-row"
      data-required-info-doc-key=${key}
      data-required-info-requirement=${requiredInfoRequirementKind(doc)}
    >
      <div class="field field-full">
        <div class="field-label-row">
          <label class="field-label" for=${id}
            >${requiredInfoDocLabel(doc)}</label
          >
          ${renderRequiredInfoRequirementBadge(doc)}
        </div>
        <input
          class="field-input required-info-text-input"
          id=${id}
          name=${key}
          type=${requiredInfoTextInputType(doc)}
          .value=${value}
          autocomplete="off"
          inputmode=${requiredInfoTextInputMode(doc)}
          data-required-info-doc-key=${key}
          aria-label=${requiredInfoDocLabel(doc)}
        />
      </div>
    </div>
  `;
};

const renderRequiredInfoSsnField = ({
  doc,
  key,
  value,
}: {
  doc: RequiredInfoDoc;
  key: string;
  value: string;
}): TemplateResult => {
  const label = requiredInfoDocLabel(doc);
  const segments = requiredInfoSsnSegments(value);
  const id = `required-info-${key}-ssn-0`;

  return html`
    <div
      class="required-info-document required-info-text-document required-info-ssn-document required-document-text-row"
      data-required-info-doc-key=${key}
      data-required-info-requirement=${requiredInfoRequirementKind(doc)}
    >
      <div class="field field-full">
        <div class="field-label-row">
          <label class="field-label" for=${id}>${label}</label>
          ${renderRequiredInfoRequirementBadge(doc)}
        </div>
        <div class="required-info-ssn-control" role="group" aria-label=${label}>
          ${REQUIRED_INFO_SSN_SEGMENT_LENGTHS.map(
            (length, index) => html`
              ${index > 0
                ? html`
                    <span class="required-info-ssn-separator" aria-hidden="true"
                      >-</span
                    >
                  `
                : ''}
              <input
                class="field-input required-info-ssn-input"
                id=${`required-info-${key}-ssn-${index}`}
                name=${`${key}-${index}`}
                type="password"
                .value=${segments[index]}
                autocomplete="off"
                inputmode="numeric"
                maxlength=${length}
                data-required-info-doc-key=${key}
                data-required-info-ssn-segment=${String(index)}
                aria-label=${`${label} part ${index + 1}`}
              />
            `
          )}
        </div>
      </div>
    </div>
  `;
};

const requiredInfoDocLabel = (doc: RequiredInfoDoc): string => {
  if (doc.docType === 'BANK_STATEMENT') {
    return 'Bank statement';
  }

  if (doc.docType === 'DRIVER_LICENSE_PHOTO') {
    return 'Driver license photo';
  }

  if (doc.docType === 'DRIVER_LICENSE_NUMBER') {
    return 'Driver license number';
  }

  if (doc.docType === 'SOCIAL_SECURITY_NUMBER') {
    return 'Social Security number';
  }

  return 'Required document';
};

const requiredInfoSourceTypeLabel = (source: PaymentSource): string => {
  if (isBankPaymentSource(source)) {
    return 'Bank account';
  }

  if (isCardPaymentSource(source)) {
    return 'Card';
  }

  if (isNativePaymentSource(source)) {
    return 'Native account';
  }

  return 'Dynamic session card';
};

const requiredInfoSourceName = (source: PaymentSource): string => {
  if (isCardPaymentSource(source)) {
    return (
      source.card?.nameOnCard?.trim() ||
      source.name?.trim() ||
      paymentSourceLabel(source)
    );
  }

  if (isBankPaymentSource(source)) {
    return (
      source.name?.trim() ||
      source.bankAccount?.bankName?.trim() ||
      paymentSourceLabel(source)
    );
  }

  if (isNativePaymentSource(source)) {
    return (
      source.account?.accountName?.trim() ||
      source.name?.trim() ||
      paymentSourceLabel(source)
    );
  }

  return source.name?.trim() || paymentSourceLabel(source);
};

const requiredInfoSourceMaskedNumber = (source: PaymentSource): string =>
  isCardPaymentSource(source)
    ? `•••• •••• •••• ${paymentSourceLast4(source)}`
    : `•••• ${paymentSourceLast4(source)}`;

const requiredInfoSourceExpiry = (
  source: PaymentSource
): string | undefined => {
  if (!isCardPaymentSource(source)) {
    return undefined;
  }

  const month = source.card?.expirationMonth?.trim();
  const year = source.card?.expirationYear?.trim();

  if (!month || !year) {
    return undefined;
  }

  const normalizedMonth = month.padStart(2, '0');
  const normalizedYear = year.slice(-2);

  return `${normalizedMonth}/${normalizedYear}`;
};

const paymentSourceIconMethod = (
  source: PaymentSource
): Pick<PaymentMethod, 'type' | 'brand'> => ({
  type: paymentSourcePaymentMethodType(source),
  brand: paymentSourceBrand(source),
});

const renderRequiredInfoSourceCard = (
  source: PaymentSource
): TemplateResult => {
  const iconMethod = paymentSourceIconMethod(source);
  const iconName = resolvePaymentMethodIconName(iconMethod);
  const expiry = requiredInfoSourceExpiry(source);

  return html`
    <div
      class="required-info-card"
      aria-label="Payment source requiring verification"
    >
      <div class="required-info-card-top">
        <div class="required-info-card-heading">
          <span class="required-info-card-label"
            >${requiredInfoSourceTypeLabel(source)}</span
          >
          <span
            class="required-info-card-field required-info-card-name"
            data-required-info-card-field="name"
            >${requiredInfoSourceName(source)}</span
          >
        </div>
        <span class="required-info-card-icon-chip" aria-hidden="true">
          <img
            class="required-info-card-icon-image"
            data-required-info-card-icon=${iconName}
            src=${resolvePaymentMethodIconDataUri(iconMethod)}
            alt=""
          />
        </span>
      </div>

      <div
        class="required-info-card-field required-info-card-number"
        data-required-info-card-field="number"
      >
        ${requiredInfoSourceMaskedNumber(source)}
      </div>

      <div class="required-info-card-bottom">
        <div class="required-info-card-detail">
          <span class="required-info-card-label">Status</span>
          <span class="required-info-card-status">
            ${renderVerificationStatusBadge(
              verificationStatusToPaymentMethodStatus(
                source.verificationInfo?.status
              )
            )}
          </span>
        </div>
        ${expiry
          ? html`
              <div class="required-info-card-detail">
                <span class="required-info-card-label">Expiry</span>
                <span
                  class="required-info-card-field required-info-card-expiry"
                  data-required-info-card-field="expiry"
                  >${expiry}</span
                >
              </div>
            `
          : ''}
      </div>
    </div>
  `;
};

const requiresAdditionalVerificationInfo = (source: PaymentSource): boolean =>
  source.verificationInfo?.status === 'REQUIRE_INFO';

const paymentSourceVerificationSubject = (source?: PaymentSource): string =>
  source && isBankPaymentSource(source)
    ? 'Bank account'
    : source && isNativePaymentSource(source)
    ? 'Native account'
    : 'Payment method';

const isBankPaymentSource = (
  source: PaymentSource
): source is BankPaymentSource =>
  source.tenderType === 'BankAccount' ||
  (source.tenderType as string) === 'BANK_ACCOUNT';

const isCardPaymentSource = (
  source: PaymentSource
): source is CardPaymentSource =>
  source.tenderType === 'Card' || (source.tenderType as string) === 'CARD';

const isNativePaymentSource = (
  source: PaymentSource
): source is NativePaymentSource =>
  source.tenderType === 'NativeAccount' ||
  (source.tenderType as string) === 'NATIVE_ACCOUNT';

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
      reject(
        new Error(`Unable to load Connect your bank script: ${scriptUrl}`)
      );
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
      `Connect your bank script loaded but window.PaymentSDK.init is unavailable: ${scriptUrl}`
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
