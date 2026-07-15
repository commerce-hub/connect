import {
  type JsonFormsI18nState,
  type JsonSchema,
  type UISchemaElement,
} from '@jsonforms/core';
import {LitElement, html, type PropertyValues, type TemplateResult} from 'lit';
import {customElement, property, state} from 'lit/decorators.js';

import type {components as ConfigComponents} from './generated/config-openapi.js';
import type {components} from './generated/openapi.js';
import {
  createCommerceHubClient,
  resolveCommerceHubBaseURL,
  type CommerceHubBaseURLInput,
} from './internal/api-client.js';
import {InteractionRefreshController} from './internal/controllers/interaction-refresh-controller.js';
import {NativeBalanceController} from './internal/controllers/native-balance-controller.js';
import {
  createInstrumentSchemaErrorTranslator,
  createInstrumentSchemaInitialData,
  createInstrumentSchemaUiSchema,
  normalizeInstrumentSchema,
  usableInstrumentSchemas,
  type ConfigInstrumentSchema,
} from './internal/forms/instrument-schema.js';
import {JsonFormsLit} from './internal/jsonforms-lit/index.js';
import {
  NEW_BILLING_ADDRESS_VALUE,
  billingAddressFromCardDraft,
  buildCardEncryptionErrorMessage,
  createCardDraft,
  createCardEncryptionFieldState,
  createCardEncryptionState,
  detectCardNetwork,
  formatCardDraftFieldValue,
  isCardDraftReady,
  isSensitiveCardField,
  normalizeCardDraft,
  normalizeCardNumber,
  normalizeSensitiveCardFieldValue,
  omitCardDraftError,
  parseExpirationDate,
  reconcileCardDraftBillingAddress,
  resolveDirtyCardEncryptionState,
  resolveEncryptedCardFieldValue,
  validateCardDraft,
  validateCardEncryptionReadiness,
  validateSensitiveCardField,
} from './internal/forms/card-form-state.js';
import {
  OTP_LENGTH,
  normalizeOtpValue,
  sanitizeOtpValue,
  writeOtpDigits,
} from './internal/forms/otp-form-state.js';
import {
  REQUIRED_INFO_SSN_SEGMENT_LENGTHS,
  hasRequiredInfoFile,
  hasRequiredInfoTextValue,
  normalizeRequiredInfoSsn,
  requiredInfoSsnSegmentMaxLength,
  requiredInfoSsnSegments,
  storeRequiredInfoFile,
  storeRequiredInfoValue,
} from './internal/forms/required-info-form-state.js';
import {
  TRANSFER_CURRENCY,
  createTransferDraft,
  formatTransferAmountForReview,
  isTransferDraftReady,
  normalizeTransferDraft,
  validateTransferDraft,
} from './internal/forms/transfer-form-state.js';
import {
  resolvePaymentMethodIconDataUri,
  resolvePaymentMethodIconName,
} from './internal/payment-method-icons.js';
import {encryptSourceValue} from './internal/source-encryption.js';
import {primitiveStyles} from './internal/styles.js';
import {
  defaultOtpSubtitle,
  findOtpInput,
  renderOtpScreen as renderOtpScreenContent,
} from './internal/screens/otp-screen.js';
import {
  renderNoSavedPaymentMethodsScreen,
  renderPaymentMethodsScreen as renderPaymentMethodsScreenContent,
  renderPaymentMethodsSkeletonScreen,
} from './internal/screens/payment-methods-screen.js';
import {
  renderAlert,
  renderButton,
  renderDetailList,
  renderEmptyState,
  renderFormGrid,
  renderOutcomeShell,
  renderProviderFrame,
  renderSelectedPaymentMethod,
  renderSelectField,
  renderTextField,
  renderTextLinkButton,
  renderUploadRow,
  renderVerificationStatusBadge,
  renderWidgetShell,
} from './internal/primitives.js';
import type {
  AllowedTenderOptions,
  CardDraft,
  CardDraftErrors,
  CardEncryptionState,
  FlowActionName,
  InteractionFeature,
  InteractionResponse,
  InteractionStatus,
  NativeAccountBalanceInfo,
  NativeAccountBalanceMap,
  NativePaymentSource,
  NoSavedPaymentMethodsScreenCopy,
  OtpScreenCopy,
  PaymentMethod,
  PaymentMethodsScreenCopy,
  PaymentSource,
  RequiredInfoFileNames,
  RequiredInfoFiles,
  RequiredInfoValues,
  SensitiveCardField,
  TransferDraft,
  TransferDraftErrors,
  WidgetShellOptions,
} from './internal/types.js';

export {
  COMMERCE_HUB_BASE_URLS,
  createCommerceHubConfigClient,
  createCommerceHubClient,
  createCommerceHubMerchantClient,
  DEFAULT_COMMERCE_HUB_BASE_URL,
  resolveCommerceHubBaseURL,
  type CommerceHubBaseURLInput,
  type CommerceHubBaseURLPreset,
  type CommerceHubConfigClient,
  type CommerceHubClient,
  type CommerceHubMerchantClient,
  type CommerceHubClientOptions,
} from './internal/api-client.js';
export type {components, operations, paths} from './generated/openapi.js';
export type {
  InteractionFeature,
  InteractionOAuth,
  InteractionResponse,
  PaymentSource,
} from './internal/types.js';
export type {
  components as MerchantComponents,
  operations as MerchantOperations,
  paths as MerchantPaths,
} from './generated/merchant-openapi.js';
export type {
  components as ConfigComponents,
  operations as ConfigOperations,
  paths as ConfigPaths,
} from './generated/config-openapi.js';

/**
 * Error payload reserved for future public SDK error events.
 */
export interface InteractionError {
  code?: string;
  message: string;
  cause?: unknown;
}

/**
 * CommerceHub native account transfer response returned after a transfer is
 * initiated.
 */
export type NativeAccountTransaction =
  components['schemas']['NativeAccountTransaction'];

/**
 * Event emitted after the widget successfully attaches or selects a verified
 * payment source.
 */
export type OnSelectEvent = CustomEvent<PaymentSource>;

/**
 * Event emitted after the widget successfully creates a payment source.
 */
export type OnAddPaymentMethodEvent = CustomEvent<PaymentSource>;

/**
 * Event emitted after the widget successfully verifies a payment source.
 */
export type OnVerifyPaymentMethodEvent = CustomEvent<PaymentSource>;

/**
 * Event emitted after the widget successfully deletes a payment source.
 */
export type OnDeletePaymentMethodEvent = CustomEvent<string>;

/**
 * Event emitted after the widget successfully refreshes listed payment sources.
 */
export type OnListPaymentMethodsEvent = CustomEvent<PaymentSource[]>;

/**
 * Event emitted after the widget successfully initiates a native account
 * transfer.
 */
export type OnTransferEvent = CustomEvent<NativeAccountTransaction>;

/**
 * Event type reserved for future public SDK error handling.
 */
export type OnErrorEvent = CustomEvent<InteractionError>;

/**
 * Name of the selection event emitted by `<commerce-hub-connect>`.
 */
export const ON_SELECT_EVENT = 'onSelect';

/**
 * Name of the payment-source creation event emitted by
 * `<commerce-hub-connect>`.
 */
export const ON_ADD_PAYMENT_METHOD_EVENT = 'onAddPaymentMethod';

/**
 * Name of the payment-source verification event emitted by
 * `<commerce-hub-connect>`.
 */
export const ON_VERIFY_PAYMENT_METHOD_EVENT = 'onVerifyPaymentMethod';

/**
 * Name of the payment-source deletion event emitted by
 * `<commerce-hub-connect>`.
 */
export const ON_DELETE_PAYMENT_METHOD_EVENT = 'onDeletePaymentMethod';

/**
 * Name of the payment-source list refresh event emitted by
 * `<commerce-hub-connect>`.
 */
export const ON_LIST_PAYMENT_METHODS_EVENT = 'onListPaymentMethods';

/**
 * Name of the native account transfer event emitted by
 * `<commerce-hub-connect>`.
 */
export const ON_TRANSFER_EVENT = 'onTransfer';

/**
 * Reserved error event name. The current widget renders recoverable flow errors
 * inline rather than emitting this event.
 */
export const ON_ERROR_EVENT = 'onError';

/**
 * Detail payloads for public SDK events emitted by `<commerce-hub-connect>`.
 */
interface SdkEventDetailMap {
  [ON_SELECT_EVENT]: PaymentSource;
  [ON_ADD_PAYMENT_METHOD_EVENT]: PaymentSource;
  [ON_VERIFY_PAYMENT_METHOD_EVENT]: PaymentSource;
  [ON_DELETE_PAYMENT_METHOD_EVENT]: string;
  [ON_LIST_PAYMENT_METHODS_EVENT]: PaymentSource[];
  [ON_TRANSFER_EVENT]: NativeAccountTransaction;
  [ON_ERROR_EVENT]: InteractionError;
}

/**
 * Public SDK event names mapped to their typed `CustomEvent` instances.
 */
interface SdkEventMap {
  [ON_SELECT_EVENT]: OnSelectEvent;
  [ON_ADD_PAYMENT_METHOD_EVENT]: OnAddPaymentMethodEvent;
  [ON_VERIFY_PAYMENT_METHOD_EVENT]: OnVerifyPaymentMethodEvent;
  [ON_DELETE_PAYMENT_METHOD_EVENT]: OnDeletePaymentMethodEvent;
  [ON_LIST_PAYMENT_METHODS_EVENT]: OnListPaymentMethodsEvent;
  [ON_TRANSFER_EVENT]: OnTransferEvent;
  [ON_ERROR_EVENT]: OnErrorEvent;
}

type SdkEventName = keyof SdkEventDetailMap & string;

type BankPaymentSource = Extract<PaymentSource, {tenderType: 'BankAccount'}>;
type CardPaymentSource = Extract<PaymentSource, {tenderType: 'Card'}>;
type VerificationInfo = NonNullable<PaymentSource['verificationInfo']>;
type CardSourcePayload = Omit<CardPaymentSource, 'tenderType'> & {
  tenderType: 'CARD';
};
type Address = components['schemas']['Address'];
type BillingAddressResponse = components['schemas']['StringHolder'];
type VerificationResponse = components['schemas']['VerificationResponse'];
type PartyConfigurationResponse =
  ConfigComponents['schemas']['PartyConfigurationResponse'];
type PayByBankSession = components['schemas']['SessionData'] & {
  accessToken?: string;
};
type TransferFlowScreen = 'form' | 'confirm';
type PaymentSourceToPaymentMethodOptions = {
  selected?: boolean;
  nativeBalances?: NativeAccountBalanceMap;
  nativeBalanceLoadingSourceIds?: readonly string[];
};
type VerificationOverlayAction =
  | 'verify-payment-source'
  | 'submit-required-info';
type SourceCreateContext = {
  publicKey: string;
  keyId: string;
  clientId: string;
  tokenType: string;
  accessToken: string;
};

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

const VERIFICATION_OVERLAY_MIN_DURATION_MS = 2000;
const PAY_BY_BANK_PROVIDER_CONTAINER_ID = 'commerce-hub-pbb-provider';
const NO_INSTRUMENT_SCHEMAS_ERROR =
  'No instrument schemas are available for this country. Try again.';

@customElement('commerce-hub-bank-account-jsonforms')
class CommerceHubBankAccountJsonForms extends JsonFormsLit {
  override createRenderRoot(): HTMLElement | DocumentFragment {
    return this;
  }
}

void CommerceHubBankAccountJsonForms;
const PAYMENT_SELECTION_READY_STATUS = 'OTP_VALIDATION_SUCCESS' as const;
const LEGACY_PAYMENT_SELECTION_READY_STATUS = 'PAYMENT_SOURCE_REQUESTED';
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

/**
 * CommerceHub Connect Web SDK widget shell.
 *
 * Renders SDK-managed shopper flows for CommerceHub interactions, including
 * OTP, saved payment-source selection, source creation, source verification,
 * Pay by Bank handoff, and required-info collection.
 *
 * @fires onSelect - Emitted with a `PaymentSource` detail after a verified
 * payment source is attached or selected.
 * @fires onAddPaymentMethod - Emitted with a `PaymentSource` detail after a
 * payment source is successfully created.
 * @fires onVerifyPaymentMethod - Emitted with a `PaymentSource` detail after a
 * payment source is successfully verified.
 * @fires onDeletePaymentMethod - Emitted with the deleted payment source id
 * after a payment source is successfully deleted.
 * @fires onListPaymentMethods - Emitted with a `PaymentSource[]` detail after
 * payment sources are successfully refreshed from the interaction.
 * @fires onTransfer - Emitted with a `NativeAccountTransaction` detail after a
 * native account transfer is successfully initiated.
 *
 * @csspart shell - Top-level widget shell.
 * @csspart header - Screen header row.
 * @csspart title - Screen title.
 * @csspart content - Screen content region.
 * @csspart footer - Powered-by footer.
 * @csspart primary-action - Primary CTA button.
 * @csspart alert - Screen-level alert message.
 * @csspart payment-method-row - Saved or selected payment-method row.
 * @csspart provider-frame - Pay by Bank provider handoff frame.
 *
 * @cssproperty --chc-primary - Primary brand color.
 * @cssproperty --chc-text - Primary text color.
 * @cssproperty --chc-copy - Secondary copy color.
 * @cssproperty --chc-muted - Muted text color.
 * @cssproperty --chc-placeholder - Form placeholder text color.
 * @cssproperty --chc-surface - Base surface color.
 * @cssproperty --chc-widget-background - Widget shell background color.
 * @cssproperty --chc-soft-surface - Subtle surface background color.
 * @cssproperty --chc-border - Default border color.
 * @cssproperty --chc-border-strong - Strong border color.
 * @cssproperty --chc-payment-method-background - Payment method row background.
 * @cssproperty --chc-success - Success foreground color.
 * @cssproperty --chc-success-bg - Success background color.
 * @cssproperty --chc-success-border - Success border color.
 * @cssproperty --chc-danger - Danger foreground color.
 * @cssproperty --chc-danger-bg - Danger background color.
 * @cssproperty --chc-danger-border - Danger border color.
 * @cssproperty --chc-warning - Warning foreground color.
 * @cssproperty --chc-warning-bg - Warning background color.
 * @cssproperty --chc-warning-border - Warning border color.
 * @cssproperty --chc-disabled-text - Disabled control text color.
 * @cssproperty --chc-disabled-surface - Disabled control surface color.
 * @cssproperty --chc-font-weight - Inherited SDK font weight.
 * @cssproperty --chc-shell-padding - Widget shell padding.
 */
@customElement('commerce-hub-connect')
export class CommerceHubConnect extends LitElement {
  static override styles = primitiveStyles;

  /**
   * Required CommerceHub interaction payload that controls the visible widget
   * state.
   *
   * Assign this as a DOM property before shopper interaction, not as an HTML
   * attribute. SDK-managed API calls use
   * `interactionResponse.interactionId` as the `x-interaction-id` header.
   */
  @property({attribute: false})
  interactionResponse!: InteractionResponse;

  /**
   * Optional merchant-safe colors, typography, spacing, copy, and Pay by Bank
   * provider settings.
   *
   * Assign this as a DOM property. Omitted nested values fall back to SDK
   * defaults.
   */
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
  private bankFlowScreen?:
    | 'provider'
    | 'outcome'
    | 'manual-config-loading'
    | 'manual-config-error'
    | 'manual-schema-selection'
    | 'manual';

  @state()
  private bankLinkLoading = false;

  @state()
  @state()
  private bankOutcomeSource?: BankPaymentSource;

  @state()
  private bankAccountInstrumentSchemas: ConfigInstrumentSchema[] = [];

  @state()
  private selectedBankAccountInstrumentSchemaCode?: string;

  @state()
  private bankAccountFormSchema?: JsonSchema;

  @state()
  private bankAccountFormUiSchema?: UISchemaElement;

  @state()
  private bankAccountFormData: Record<string, unknown> = {};

  private bankAccountFormI18n?: JsonFormsI18nState;

  @state()
  private bankAccountConfigError?: string;

  private bankAccountConfigRequestToken = 0;

  private bankProviderRequestToken = 0;

  private cancelPayByBankLaunch?: () => void;

  @state()
  private transferDraft: TransferDraft = createTransferDraft();

  @state()
  private transferDraftErrors: TransferDraftErrors = {};

  @state()
  private transferSubmitError?: string;

  @state()
  private transferSubmitSuccess = false;

  @state()
  private transferFlowActive = false;

  @state()
  private transferFlowScreen: TransferFlowScreen = 'form';

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
  private billingAddressSelectorExpanded = false;

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
  private requiredInfoValues: RequiredInfoValues = {};

  @state()
  private requiredInfoFileNames: RequiredInfoFileNames = {};

  @state()
  private requiredInfoSubmitError?: string;

  private requiredInfoFiles: RequiredInfoFiles = {};

  private pendingRequiredInfoDocKey?: string;

  private readonly interactionRefresh = new InteractionRefreshController(this);
  private readonly nativeBalance = new NativeBalanceController(this);
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
        this.interactionRefresh.reset({requestUpdate: false});
        this.nativeBalance.reset({requestUpdate: false});
        this.billingAddresses = [];
        this.resetBankFlow();
        this.resetTransferFlow();
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
    this.resetBankFlow();
  }

  private emitSdkEvent<Name extends SdkEventName>(
    name: Name,
    detail: SdkEventDetailMap[Name]
  ) {
    // Host-emitted public SDK events intentionally preserve the current
    // non-bubbling, non-composed semantics. Future internal subcomponent
    // events that need to reach this host across shadow DOM should use
    // bubbles: true and composed: true instead of this public SDK helper.
    this.dispatchEvent(
      new CustomEvent<SdkEventDetailMap[Name]>(name, {detail})
    );
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
    if (!this.interactionResponse) {
      return this.renderMissingInteractionResponseScreen();
    }

    if (this.bankFlowScreen === 'provider') {
      return this.renderBankProviderScreen();
    }

    if (this.bankFlowScreen === 'outcome') {
      return this.renderBankOutcomeScreen();
    }

    if (this.bankFlowScreen === 'manual-config-loading') {
      return this.renderManualBankAccountConfigLoadingScreen();
    }

    if (this.bankFlowScreen === 'manual-config-error') {
      return this.renderManualBankAccountConfigErrorScreen();
    }

    if (this.bankFlowScreen === 'manual-schema-selection') {
      return this.renderManualBankAccountSchemaSelectionScreen();
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

    if (this.shouldRenderTransferScreen()) {
      return this.renderTransferScreen();
    }

    return this.renderPaymentSourceScreen();
  }

  private renderMissingInteractionResponseScreen(): TemplateResult {
    return this.renderWidgetShell({
      title: 'Configuration required',
      showClose: false,
      showDivider: false,
      content: html`
        <div class="payment-flow">
          ${renderAlert({
            variant: 'danger',
            message:
              'CommerceHub Connect requires an interaction response before it can load payment methods.',
          })}
        </div>
      `,
    });
  }

  private renderOtpScreen(
    status: 'OTP_VALIDATION_PENDING' | 'OTP_VALIDATION_FAILED'
  ): TemplateResult {
    const copy = resolveOtpCopy(this.designConfig);
    const isSubmitting = this.pendingAction === 'verify-otp';
    const isResending = this.pendingAction === 'resend-otp';
    const destination = resolveOtpDestination(this.interactionResponse);
    let overlay: TemplateResult | undefined;

    if (isSubmitting) {
      overlay = renderWidgetLoadingOverlay({
        title: 'Verifying code',
        helper: 'Verifying your code, please wait.',
      });
    } else if (isResending) {
      overlay = renderWidgetLoadingOverlay({
        title: 'Sending code',
        helper: 'Sending a new code, please wait.',
      });
    }

    return this.renderWidgetShell({
      title: copy.title,
      subtitle: copy.subtitle ?? defaultOtpSubtitle(destination),
      showClose: false,
      showDivider: false,
      busy: isSubmitting || isResending,
      overlay,
      content: renderOtpScreenContent({
        status,
        value: this.otpValue,
        length: OTP_LENGTH,
        destination,
        failedMessage: this.otpErrorMessage,
        copy,
        submitting: isSubmitting,
        resending: isResending,
      }),
    });
  }

  private renderPaymentSourceScreen(): TemplateResult {
    const copy = resolvePaymentMethodsCopy(this.designConfig);
    const paymentMethods = paymentMethodsFromInteractionResponse(
      this.interactionResponse,
      {
        nativeBalances: this.nativeBalance.balances,
        nativeBalanceLoadingSourceIds: this.nativeBalance.loadingSourceIds,
      }
    );
    const allowedTenderOptions = allowedTenderOptionsFromInteractionResponse(
      this.interactionResponse
    );
    const canAddPaymentSources = isInteractionFeatureEnabled(
      this.interactionResponse,
      'ADD_ACCOUNT'
    );
    const canSelectPaymentSources = isInteractionFeatureEnabled(
      this.interactionResponse,
      'SELECT'
    );
    const showTransferAction =
      allowedTenderOptions.bankAccount &&
      isAddSelectTransferFeatureEnabled(this.interactionResponse);
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
        content: renderPaymentMethodsSkeletonScreen(),
      });
    }

    if (this.shouldRenderPaymentSourceRefreshError()) {
      return this.renderPaymentSourceRefreshErrorScreen();
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
      content: renderPaymentMethodsScreenContent({
        status: 'PAYMENT_SOURCE_REQUESTED',
        methods: paymentMethods,
        allowedTenderOptions,
        canAddPaymentSources,
        canSelectPaymentSources,
        editing: isEditingPaymentSources,
        actionPending: isPaymentSourceActionPending,
        selectedPaymentSourceId: this.selectedPaymentSourceId,
        deleteConfirmationPaymentSourceId:
          this.deleteConfirmationPaymentSourceId,
        copy,
        showTransferAction,
      }),
    });
  }

  private renderPaymentSourceRefreshErrorScreen(): TemplateResult {
    return this.renderWidgetShell({
      title: 'Payment methods unavailable',
      showClose: false,
      content: html`
        <div class="payment-flow">
          ${renderAlert({
            variant: 'danger',
            message:
              this.interactionRefresh.errorMessage ??
              "We couldn't load payment methods. Try again.",
          })}
          <div class="primitive-footer">
            ${renderButton({
              label: 'Try again',
              variant: 'primary',
              action: 'retry-interaction-refresh',
            })}
          </div>
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
              nativeBalances: this.nativeBalance.balances,
              nativeBalanceLoadingSourceIds:
                this.nativeBalance.loadingSourceIds,
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
    return this.interactionRefresh.shouldRenderSkeleton(
      this.interactionResponse
    );
  }

  private shouldRenderPaymentSourceRefreshError(): boolean {
    return this.interactionRefresh.shouldRenderError(this.interactionResponse);
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
            <p class="required-info-section-title">
              Information needed to complete verification
            </p>
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
    const isDeletePending = this.pendingAction === 'delete-payment-source';
    const allowedTenderOptions = allowedTenderOptionsFromInteractionResponse(
      this.interactionResponse
    );
    const canAddPaymentSources = isInteractionFeatureEnabled(
      this.interactionResponse,
      'ADD_ACCOUNT'
    );
    const showTransferAction =
      allowedTenderOptions.bankAccount &&
      isAddSelectTransferFeatureEnabled(this.interactionResponse);

    return this.renderWidgetShell({
      title: copy.title,
      subtitle: copy.subtitle,
      showClose: false,
      showDivider: false,
      content: renderNoSavedPaymentMethodsScreen({
        allowedTenderOptions,
        canAddPaymentSources,
        deletePending: isDeletePending,
        copy,
        showTransferAction,
      }),
    });
  }

  private shouldRenderTransferScreen(): boolean {
    const interactionResponse = this.interactionResponse;

    return (
      (this.transferFlowActive ||
        isTransferOnlyFeatureEnabled(interactionResponse)) &&
      isPaymentSelectionReadyStatus(interactionResponse?.status)
    );
  }

  private renderTransferScreen(): TemplateResult {
    const transferSources = transferPaymentSourcesFromInteractionResponse(
      this.interactionResponse
    );
    const isSubmitting = this.pendingAction === 'transfer';
    const headerAction = this.transferFlowActive
      ? renderTextLinkButton({
          label: 'Back',
          action: 'back-to-payment-methods',
          disabled: isSubmitting,
        })
      : undefined;

    if (transferSources.length < 2) {
      return this.renderWidgetShell({
        title: 'Transfer funds',
        headerAction,
        showClose: false,
        showDivider: false,
        content: html`
          <div class="payment-flow">
            ${renderEmptyState({
              title: 'Transfer unavailable',
              message:
                'At least two verified bank or native accounts are required to transfer funds.',
            })}
          </div>
        `,
      });
    }

    const accountOptions = [
      {value: '', label: 'Select account'},
      ...transferSources.map((source) => ({
        value: paymentSourceId(source),
        label: paymentSourceDisplayName(source),
      })),
    ];
    const normalizedDraft = normalizeTransferDraft(this.transferDraft);
    const fromSource = transferSources.find(
      (source) => paymentSourceId(source) === normalizedDraft.fromSourceId
    );
    const toSource = transferSources.find(
      (source) => paymentSourceId(source) === normalizedDraft.toSourceId
    );

    if (
      this.transferFlowScreen === 'confirm' &&
      fromSource &&
      toSource &&
      isTransferDraftReady(normalizedDraft, transferSources)
    ) {
      return this.renderTransferConfirmationScreen(
        fromSource,
        toSource,
        normalizedDraft,
        isSubmitting
      );
    }

    return this.renderWidgetShell({
      title: 'Transfer funds',
      headerAction,
      showClose: false,
      showDivider: false,
      busy: isSubmitting,
      overlay: isSubmitting
        ? renderWidgetLoadingOverlay({
            title: 'Initiating transfer',
            helper: 'Submitting your transfer, please wait.',
          })
        : undefined,
      content: html`
        <div class="payment-flow card-form-screen">
          ${this.transferSubmitError
            ? renderAlert({
                variant: 'danger',
                message: this.transferSubmitError,
              })
            : ''}
          ${this.transferSubmitSuccess
            ? renderAlert({
                variant: 'success',
                message: 'Transfer initiated.',
              })
            : ''}
          ${renderFormGrid([
            renderSelectField({
              id: 'transfer-from-source',
              name: 'fromSourceId',
              label: 'From',
              value: this.transferDraft.fromSourceId,
              options: accountOptions,
              span: 'full',
              variant: 'card-form',
              dataField: 'fromSourceId',
              dataFieldScope: 'transfer',
              error: this.transferDraftErrors.fromSourceId,
              disabled: isSubmitting,
            }),
            renderSelectField({
              id: 'transfer-to-source',
              name: 'toSourceId',
              label: 'To',
              value: this.transferDraft.toSourceId,
              options: accountOptions,
              span: 'full',
              variant: 'card-form',
              dataField: 'toSourceId',
              dataFieldScope: 'transfer',
              error: this.transferDraftErrors.toSourceId,
              disabled: isSubmitting,
            }),
            renderTextField({
              id: 'transfer-amount',
              name: 'amount',
              label: 'Amount',
              value: this.transferDraft.amount,
              variant: 'card-form',
              inputmode: 'decimal',
              dataField: 'amount',
              dataFieldScope: 'transfer',
              error: this.transferDraftErrors.amount,
              disabled: isSubmitting,
            }),
          ])}
          <div class="primitive-footer card-form-primary">
            <div class="card-form-primary">
              ${renderButton({
                label: isSubmitting ? 'Transferring' : 'Transfer',
                action: 'transfer',
                loading: isSubmitting,
                disabled:
                  isSubmitting ||
                  !isTransferDraftReady(this.transferDraft, transferSources),
              })}
            </div>
          </div>
        </div>
      `,
    });
  }

  private renderTransferConfirmationScreen(
    fromSource: PaymentSource,
    toSource: PaymentSource,
    draft: TransferDraft,
    isSubmitting: boolean
  ): TemplateResult {
    return this.renderWidgetShell({
      title: 'Confirm transfer',
      headerAction: renderTextLinkButton({
        label: 'Back',
        action: 'edit-transfer',
        disabled: isSubmitting,
      }),
      showClose: false,
      showDivider: false,
      busy: isSubmitting,
      overlay: isSubmitting
        ? renderWidgetLoadingOverlay({
            title: 'Initiating transfer',
            helper: 'Submitting your transfer, please wait.',
          })
        : undefined,
      content: html`
        <div class="payment-flow card-form-screen">
          ${this.transferSubmitError
            ? renderAlert({
                variant: 'danger',
                message: this.transferSubmitError,
              })
            : ''}
          ${renderDetailList([
            {label: 'From', value: paymentSourceDisplayName(fromSource)},
            {label: 'To', value: paymentSourceDisplayName(toSource)},
            {label: 'Amount', value: formatTransferAmountForReview(draft)},
          ])}
          <div class="primitive-footer card-form-primary">
            <div class="card-form-primary">
              ${renderButton({
                label: isSubmitting ? 'Transferring' : 'Confirm transfer',
                action: 'confirm-transfer',
                loading: isSubmitting,
                disabled: isSubmitting,
              })}
            </div>
            <div class="card-form-primary">
              ${renderButton({
                label: 'Edit',
                variant: 'secondary',
                action: 'edit-transfer',
                disabled: isSubmitting,
              })}
            </div>
          </div>
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
    const selectedBillingAddress = this.billingAddresses.find(
      (address) => address.id === this.cardDraft.billingAddressValue
    );
    const shouldRenderBillingAddressSummary =
      Boolean(selectedBillingAddress) && !this.billingAddressSelectorExpanded;
    const shouldRenderBillingAddressSelector =
      !shouldRenderBillingAddressSummary;
    const shouldRenderNewBillingAddressFields =
      shouldRenderBillingAddressSelector &&
      this.cardDraft.billingAddressValue === NEW_BILLING_ADDRESS_VALUE;
    const billingAddressFields: TemplateResult[] = [];

    if (selectedBillingAddress && shouldRenderBillingAddressSummary) {
      billingAddressFields.push(html`
        <div class="billing-address-summary field field-full">
          <div class="billing-address-summary-heading">
            <span class="billing-address-summary-label field-label"
              >Billing address</span
            >
            ${renderTextLinkButton({
              label: 'Change',
              action: 'change-billing-address',
              disabled: isSaving,
            })}
          </div>
          <p class="billing-address-summary-value">
            ${billingAddressLabel(selectedBillingAddress)}
          </p>
        </div>
      `);
    } else {
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
    }

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
              label: 'Connect another way',
              action: 'add-ach-manually',
              disabled: this.bankLinkLoading,
            })}
          </div>
        </div>
      `,
    });
  }

  private renderManualBankAccountConfigLoadingScreen(): TemplateResult {
    return this.renderWidgetShell({
      title: 'Select an instrument schema',
      headerAction: renderTextLinkButton({
        label: 'Back',
        action: 'back-to-bank-provider',
        disabled: true,
      }),
      showClose: false,
      showDivider: false,
      busy: true,
      overlay: renderWidgetLoadingOverlay({
        title: 'Loading instrument schemas',
        helper: 'Loading the available bank account options, please wait.',
      }),
      content: html`<div class="payment-flow card-form-screen"></div>`,
    });
  }

  private renderManualBankAccountConfigErrorScreen(): TemplateResult {
    return this.renderWidgetShell({
      title: 'Select an instrument schema',
      headerAction: renderTextLinkButton({
        label: 'Back',
        action: 'back-to-bank-provider',
      }),
      showClose: false,
      showDivider: false,
      content: html`
        <div class="payment-flow card-form-screen">
          ${renderAlert({
            variant: 'danger',
            message:
              this.bankAccountConfigError ??
              'Unable to load instrument schemas. Try again.',
          })}
          <div class="primitive-footer card-form-primary">
            ${renderButton({
              label: 'Try again',
              action: 'add-ach-manually',
            })}
          </div>
        </div>
      `,
    });
  }

  private renderManualBankAccountSchemaSelectionScreen(): TemplateResult {
    return this.renderWidgetShell({
      title: 'Select an instrument schema',
      headerAction: renderTextLinkButton({
        label: 'Back',
        action: 'back-to-bank-provider',
      }),
      showClose: false,
      showDivider: false,
      content: html`
        <div class="instrument-schema-selection">
          <fieldset
            class="instrument-schema-options"
            aria-label="Instrument schemas"
          >
            <legend>Available instrument schemas</legend>
            ${this.bankAccountInstrumentSchemas.map(
              (schema) => html`
                <label class="instrument-schema-option">
                  <input
                    type="radio"
                    name="instrument-schema"
                    value=${schema.bavSupportedCode}
                    data-instrument-schema-code=${schema.bavSupportedCode}
                    .checked=${this.selectedBankAccountInstrumentSchemaCode ===
                    schema.bavSupportedCode}
                  />
                  <span>${schema.bavSupportedCode}</span>
                </label>
              `
            )}
          </fieldset>
          <div class="primitive-footer card-form-primary">
            ${renderButton({
              label: 'Continue',
              action: 'select-instrument-schema',
              disabled: !this.selectedBankAccountInstrumentSchemaCode,
            })}
          </div>
        </div>
      `,
    });
  }

  private renderManualBankAccountScreen(): TemplateResult {
    const bankAccountFormSchema = this.bankAccountFormSchema;
    const bankAccountFormUiSchema = this.bankAccountFormUiSchema;

    if (!bankAccountFormSchema || !bankAccountFormUiSchema) {
      return this.renderManualBankAccountConfigErrorScreen();
    }

    return this.renderWidgetShell({
      title: 'Enter bank details',
      headerAction: renderTextLinkButton({
        label: 'Back',
        action:
          this.bankAccountInstrumentSchemas.length > 1
            ? 'back-to-instrument-schema-selection'
            : 'back-to-bank-provider',
      }),
      showClose: false,
      showDivider: false,
      content: html`
        <div class="payment-flow card-form-screen">
          <commerce-hub-bank-account-jsonforms
            class="bank-account-jsonforms"
            .schema=${bankAccountFormSchema}
            .uischema=${bankAccountFormUiSchema}
            .data=${this.bankAccountFormData}
            .i18n=${this.bankAccountFormI18n}
            .validationMode=${'ValidateAndShow'}
            @data-change=${this.handleBankAccountFormDataChange}
          ></commerce-hub-bank-account-jsonforms>
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

    if (action === 'retry-interaction-refresh') {
      void this.retryInteractionRefresh();
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

    if (action === 'open-transfer') {
      this.paymentSourceEditMode = false;
      this.paymentSourceView = 'list';
      this.resetCardFlow();
      this.resetBankFlow();
      this.resetRequiredInfo();
      this.resetTransferFlow();
      this.transferFlowActive = true;
      return;
    }

    if (action === 'transfer') {
      this.reviewTransfer();
      return;
    }

    if (action === 'edit-transfer') {
      this.transferFlowScreen = 'form';
      return;
    }

    if (action === 'confirm-transfer') {
      void this.submitTransfer();
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

    if (action === 'select-instrument-schema') {
      this.initializeManualBankAccountScreen();
      return;
    }

    if (action === 'back-to-instrument-schema-selection') {
      this.clearManualBankAccountForm();
      this.bankFlowScreen = 'manual-schema-selection';
      return;
    }

    if (
      action === 'add-bank-account' ||
      action === 'use-bank-account-instead' ||
      action === 'retry-bank-provider' ||
      action === 'back-to-bank-provider' ||
      action === 'use-different-bank-account'
    ) {
      this.paymentSourceEditMode = false;
      this.paymentSourceView = 'list';
      this.resetCardFlow();
      this.resetRequiredInfo();
      this.resetBankFlow();
      void this.startPayByBankFlow();
      return;
    }

    if (action === 'add-ach-manually') {
      this.paymentSourceEditMode = false;
      this.paymentSourceView = 'list';
      this.resetCardFlow();
      this.resetRequiredInfo();
      void this.showManualBankAccountScreen();
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

    if (action === 'change-billing-address') {
      this.billingAddressSelectorExpanded = true;
      return;
    }

    if (action === 'save-card') {
      void this.saveCard();
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

    const transferInput = event
      .composedPath()
      .find(
        (item): item is HTMLInputElement =>
          item instanceof HTMLInputElement &&
          Boolean(item.dataset.transferField)
      );

    if (transferInput) {
      this.updateTransferDraftField(
        transferInput.dataset.transferField as keyof TransferDraft,
        transferInput.value
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
    const instrumentSchemaInput = event
      .composedPath()
      .find(
        (item): item is HTMLInputElement =>
          item instanceof HTMLInputElement &&
          item.name === 'instrument-schema' &&
          Boolean(item.dataset.instrumentSchemaCode)
      );

    if (instrumentSchemaInput) {
      this.selectedBankAccountInstrumentSchemaCode =
        instrumentSchemaInput.dataset.instrumentSchemaCode;
      return;
    }

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

    const transferSelect = event
      .composedPath()
      .find(
        (item): item is HTMLSelectElement =>
          item instanceof HTMLSelectElement &&
          Boolean(item.dataset.transferField)
      );

    if (transferSelect) {
      this.updateTransferDraftField(
        transferSelect.dataset.transferField as keyof TransferDraft,
        transferSelect.value
      );
    }
  };

  private handleBankAccountFormDataChange = (
    event: CustomEvent<{data?: unknown}>
  ) => {
    const data = event.detail.data;

    this.bankAccountFormData =
      typeof data === 'object' && data !== null && !Array.isArray(data)
        ? (data as Record<string, unknown>)
        : {};
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
    }
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
    const segmentLength = requiredInfoSsnSegmentMaxLength(
      Number(input.dataset.requiredInfoSsnSegment)
    );
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

      const length = requiredInfoSsnSegmentMaxLength(
        Number(input.dataset.requiredInfoSsnSegment)
      );
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
    this.otpValue = normalizeOtpValue(inputs.map((item) => item.value));
    this.otpErrorMessage = undefined;
  }

  private writeOtpDigits(
    inputs: HTMLInputElement[],
    startIndex: number,
    value: string
  ): number {
    const result = writeOtpDigits({
      values: inputs.map((input) => input.value),
      startIndex,
      value,
    });

    result.values.forEach((nextValue, index) => {
      inputs[index].value = nextValue;
    });

    return result.lastWrittenIndex;
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
    this.billingAddressSelectorExpanded =
      this.cardDraft.billingAddressValue === NEW_BILLING_ADDRESS_VALUE ||
      !this.billingAddresses.length;

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

  private async showManualBankAccountScreen() {
    const interactionId = this.requireInteractionId();
    const country = this.interactionResponse?.country?.trim();

    this.clearDeletePaymentSourceConfirmation();
    this.resetBankFlow();

    const requestToken = ++this.bankAccountConfigRequestToken;
    this.bankFlowScreen = 'manual-config-loading';

    if (!interactionId) {
      this.bankAccountConfigError =
        'CommerceHub Connect requires an interaction response before bank details can load.';
      this.bankFlowScreen = 'manual-config-error';
      return;
    }

    if (!country) {
      this.bankAccountConfigError =
        'Bank account details are not available because the interaction response is missing a country.';
      this.bankFlowScreen = 'manual-config-error';
      return;
    }

    try {
      const configResponse = await this.fetchManualBankAccountCountryConfig(
        interactionId,
        country
      );

      if (
        !this.isCurrentManualBankAccountConfigRequest(
          requestToken,
          interactionId,
          country
        )
      ) {
        if (requestToken === this.bankAccountConfigRequestToken) {
          this.resetBankFlow();
        }

        return;
      }

      const instrumentSchemas = usableInstrumentSchemas(
        configResponse.instrumentSchemas
      );

      if (instrumentSchemas.length === 0) {
        this.bankAccountConfigError = NO_INSTRUMENT_SCHEMAS_ERROR;
        this.bankFlowScreen = 'manual-config-error';
        return;
      }

      this.bankAccountInstrumentSchemas = instrumentSchemas;
      this.bankAccountConfigError = undefined;

      if (instrumentSchemas.length === 1) {
        this.selectedBankAccountInstrumentSchemaCode =
          instrumentSchemas[0].bavSupportedCode;
        this.initializeManualBankAccountScreen();
        return;
      }

      this.bankFlowScreen = 'manual-schema-selection';
    } catch (cause) {
      if (
        !this.isCurrentManualBankAccountConfigRequest(
          requestToken,
          interactionId,
          country
        )
      ) {
        if (requestToken === this.bankAccountConfigRequestToken) {
          this.resetBankFlow();
        }

        return;
      }

      this.bankAccountConfigError = apiErrorMessage(cause);
      this.bankFlowScreen = 'manual-config-error';
    }
  }

  private isCurrentManualBankAccountConfigRequest(
    requestToken: number,
    interactionId: string | undefined,
    country: string | undefined
  ): boolean {
    return (
      requestToken === this.bankAccountConfigRequestToken &&
      Boolean(interactionId) &&
      Boolean(country) &&
      this.interactionResponse?.interactionId === interactionId &&
      this.interactionResponse?.country?.trim() === country
    );
  }

  private initializeManualBankAccountScreen() {
    const selectedSchema = this.bankAccountInstrumentSchemas.find(
      (schema) =>
        schema.bavSupportedCode === this.selectedBankAccountInstrumentSchemaCode
    );

    if (!selectedSchema) {
      return;
    }

    const formSchema = normalizeInstrumentSchema(selectedSchema);

    this.bankFlowScreen = 'manual';
    this.bankAccountFormSchema = formSchema;
    this.bankAccountFormUiSchema =
      createInstrumentSchemaUiSchema(selectedSchema);
    this.bankAccountFormData =
      createInstrumentSchemaInitialData(selectedSchema);
    this.bankAccountFormI18n = {
      translateError: createInstrumentSchemaErrorTranslator(selectedSchema),
    };
    this.bankAccountConfigError = undefined;
  }

  private clearManualBankAccountForm() {
    this.bankAccountFormSchema = undefined;
    this.bankAccountFormUiSchema = undefined;
    this.bankAccountFormData = {};
    this.bankAccountFormI18n = undefined;
  }

  private updateTransferDraftField(field: keyof TransferDraft, value: string) {
    const nextDraft = normalizeTransferDraft({
      ...this.transferDraft,
      [field]: value,
    });

    this.transferDraft = nextDraft;
    this.transferDraftErrors = validateTransferDraft(
      nextDraft,
      transferPaymentSourcesFromInteractionResponse(this.interactionResponse)
    );
    this.transferFlowScreen = 'form';
    this.transferSubmitError = undefined;
    this.transferSubmitSuccess = false;
  }

  private updateCardDraftField(field: keyof CardDraft, value: string) {
    const formattedValue = formatCardDraftFieldValue(field, value);

    this.cardDraft = {
      ...this.cardDraft,
      [field]: formattedValue,
    };

    if (field === 'billingAddressValue') {
      this.billingAddressSelectorExpanded =
        formattedValue === NEW_BILLING_ADDRESS_VALUE;
    }

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
      const encryptedValue = await this.encryptSensitiveSourceValue(
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

  private async encryptSensitiveSourceValue(value: string): Promise<string> {
    const sourceCreateContext = this.requireSourceCreateContext();

    return encryptSourceValue(value, sourceCreateContext.publicKey);
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

    let sourceCreateContext: SourceCreateContext;

    try {
      sourceCreateContext = this.requireSourceCreateContext();
    } catch (cause) {
      this.cardDraft = normalizedDraft;
      this.cardDraftErrors = {};
      this.cardSubmitError = apiErrorMessage(cause);
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
            headers: this.createSourceCreateHeaders(
              interactionId,
              sourceCreateContext,
              {'Content-Type': 'application/json'}
            ),
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
      this.emitSdkEvent(ON_ADD_PAYMENT_METHOD_EVENT, createdSource);

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

  private reviewTransfer() {
    if (this.pendingAction === 'transfer') {
      return;
    }

    const transferSources = transferPaymentSourcesFromInteractionResponse(
      this.interactionResponse
    );
    const normalizedDraft = normalizeTransferDraft(this.transferDraft);
    const errors = validateTransferDraft(normalizedDraft, transferSources);

    if (Object.keys(errors).length > 0) {
      this.transferDraft = normalizedDraft;
      this.transferDraftErrors = errors;
      this.transferSubmitError = undefined;
      this.transferSubmitSuccess = false;
      return;
    }

    this.transferDraft = normalizedDraft;
    this.transferDraftErrors = {};
    this.transferSubmitError = undefined;
    this.transferSubmitSuccess = false;
    this.transferFlowScreen = 'confirm';
  }

  private async submitTransfer() {
    if (this.pendingAction === 'transfer') {
      return;
    }

    const interactionId = this.requireInteractionId();

    if (!interactionId) {
      return;
    }

    const transferSources = transferPaymentSourcesFromInteractionResponse(
      this.interactionResponse
    );
    const normalizedDraft = normalizeTransferDraft(this.transferDraft);
    const errors = validateTransferDraft(normalizedDraft, transferSources);

    if (Object.keys(errors).length > 0) {
      this.transferDraft = normalizedDraft;
      this.transferDraftErrors = errors;
      this.transferFlowScreen = 'form';
      this.transferSubmitError = undefined;
      this.transferSubmitSuccess = false;
      return;
    }

    this.pendingAction = 'transfer';
    this.transferDraft = normalizedDraft;
    this.transferDraftErrors = {};
    this.transferSubmitError = undefined;
    this.transferSubmitSuccess = false;

    try {
      const transaction =
        await this.requestCommerceHubJson<NativeAccountTransaction>(
          '/interaction/source/native/transfer',
          interactionId,
          {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              fromSourceId: normalizedDraft.fromSourceId,
              toSourceId: normalizedDraft.toSourceId,
              amount: Number(normalizedDraft.amount),
              asset: {
                type: 'CURRENCY',
                id: TRANSFER_CURRENCY,
              },
            }),
            credentials: 'include',
          }
        );

      this.transferFlowScreen = 'form';
      this.transferSubmitSuccess = true;
      this.emitSdkEvent(ON_TRANSFER_EVENT, transaction);
    } catch (cause) {
      this.transferSubmitError = apiErrorMessage(cause);
    } finally {
      this.pendingAction = undefined;
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
      this.emitSdkEvent(ON_SELECT_EVENT, attachedSource);
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
          status: PAYMENT_SELECTION_READY_STATUS,
        },
        verifiedSource
      );

      this.setInteractionResponseFromSdk(nextInteractionResponse);
      this.emitSdkEvent(ON_VERIFY_PAYMENT_METHOD_EVENT, verifiedSource);

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
      this.emitSdkEvent(ON_DELETE_PAYMENT_METHOD_EVENT, paymentSourceId);
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
    this.resetTransferFlow();

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
      status: PAYMENT_SELECTION_READY_STATUS,
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
    this.requiredInfoValues = storeRequiredInfoValue(
      this.requiredInfoValues,
      key,
      value
    );
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

    const nextState = storeRequiredInfoFile({
      files: this.requiredInfoFiles,
      fileNames: this.requiredInfoFileNames,
      key,
      file,
    });

    this.requiredInfoFiles = nextState.files;
    this.requiredInfoFileNames = nextState.fileNames;
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
        return hasRequiredInfoTextValue(this.requiredInfoValues, key);
      }

      return hasRequiredInfoFile(this.requiredInfoFiles, key);
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
        this.emitSdkEvent(ON_VERIFY_PAYMENT_METHOD_EVENT, verifiedSource);

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
          this.emitSdkEvent(ON_VERIFY_PAYMENT_METHOD_EVENT, verifiedSource);
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
        this.emitSdkEvent(ON_VERIFY_PAYMENT_METHOD_EVENT, verifiedSource);
      }

      const nextInteractionResponse = withUpsertedSourcePreservingSelection(
        {
          ...(this.interactionResponse ?? {interactionId}),
          selectedSource: this.interactionResponse?.selectedSource,
          status: PAYMENT_SELECTION_READY_STATUS,
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
      return hasRequiredInfoTextValue(this.requiredInfoValues, key);
    }

    return hasRequiredInfoFile(this.requiredInfoFiles, key);
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

    const requestToken = ++this.bankProviderRequestToken;

    this.bankFlowScreen = 'provider';
    this.bankOutcomeSource = undefined;
    this.bankLinkLoading = true;
    this.ensurePayByBankProviderContainer(PAY_BY_BANK_PROVIDER_CONTAINER_ID);
    await this.updateComplete;

    try {
      await this.launchPayByBankProvider(
        interactionId,
        PAY_BY_BANK_PROVIDER_CONTAINER_ID,
        requestToken
      );
    } catch (cause) {
      if (
        !this.isCurrentPayByBankProviderRequest(requestToken, interactionId)
      ) {
        return;
      }

      console.error('CommerceHub Connect Pay by Bank failed', cause);
      this.resetBankFlow();
      this.showPaymentSourceList({refresh: true});
    } finally {
      if (requestToken === this.bankProviderRequestToken) {
        this.cancelPayByBankLaunch = undefined;
        this.bankLinkLoading = false;
      }
    }
  }

  private isCurrentPayByBankProviderRequest(
    requestToken: number,
    interactionId: string
  ): boolean {
    return (
      this.isConnected &&
      requestToken === this.bankProviderRequestToken &&
      this.interactionResponse?.interactionId === interactionId &&
      this.bankFlowScreen === 'provider'
    );
  }

  private async launchPayByBankProvider(
    interactionId: string,
    containerId: string,
    requestToken: number
  ) {
    const session = await this.requestCommerceHubJson<PayByBankSession>(
      '/interaction/source/pbb/session',
      interactionId,
      {method: 'GET', credentials: 'include'}
    );

    if (!this.isCurrentPayByBankProviderRequest(requestToken, interactionId)) {
      return;
    }

    const {aggregatorSessionId, accessToken, pToken, publicKey} =
      resolvePayByBankSession(session);
    const payByBank = resolvePayByBankOptions(this.designConfig?.payByBank);

    await loadPaymentSdkScript(payByBank.paymentSdkUrl);

    if (!this.isCurrentPayByBankProviderRequest(requestToken, interactionId)) {
      return;
    }

    const paymentSdk = window.PaymentSDK;

    if (!paymentSdk?.init) {
      throw new Error(
        'PaymentSDK.js loaded but PaymentSDK.init is not available on window.'
      );
    }

    await new Promise<void>((resolve, reject) => {
      let settled = false;
      const cancel = () => {
        settled = true;
        resolve();
      };

      this.cancelPayByBankLaunch = cancel;

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
          if (
            settled ||
            !isTerminalPaymentSdkEvent(event) ||
            !this.isCurrentPayByBankProviderRequest(requestToken, interactionId)
          ) {
            return;
          }

          settled = true;
          this.bankLinkLoading = true;
          destroyPaymentSdk();

          if (event.type !== 'success') {
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

            if (
              !this.isCurrentPayByBankProviderRequest(
                requestToken,
                interactionId
              )
            ) {
              resolve();
              return;
            }

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
            this.emitSdkEvent(ON_ADD_PAYMENT_METHOD_EVENT, resolvedBankSource);
            this.resetBankFlow();

            if (resolvedBankSource.verificationInfo?.status === 'VERIFIED') {
              await this.attachPaymentSource(paymentSourceId);
              resolve();
              return;
            }

            this.showAddedPaymentSourceStatus(resolvedBankSource);
            resolve();
          } catch (cause) {
            if (
              !this.isCurrentPayByBankProviderRequest(
                requestToken,
                interactionId
              )
            ) {
              resolve();
              return;
            }

            reject(cause);
          }
        },
      });

      if (
        !settled &&
        this.isCurrentPayByBankProviderRequest(requestToken, interactionId)
      ) {
        this.bankLinkLoading = false;
      }
    });
  }

  private async refreshPaymentSourcesFromInteraction() {
    await this.interactionRefresh.refreshFromInteraction(
      this.interactionRefreshOptions()
    );
  }

  private queueNativeAccountBalanceRefresh() {
    this.nativeBalance.queueRefresh(
      () => this.interactionResponse,
      (interactionId) => this.fetchNativeAccountBalances(interactionId)
    );
  }

  private async fetchNativeAccountBalances(
    interactionId: string
  ): Promise<NativeAccountBalanceMap> {
    const response = await this.createSdkClient(interactionId).GET(
      '/interaction/source/native/balances'
    );

    return response.data ?? {};
  }

  private async fetchInteraction(
    interactionId: string
  ): Promise<InteractionResponse> {
    return this.interactionRefresh.fetch(
      interactionId,
      this.interactionRefreshOptions()
    );
  }

  private async retryInteractionRefresh() {
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

  private interactionRefreshOptions() {
    return {
      getCurrentInteractionResponse: () => this.interactionResponse,
      getSelectedPaymentSourceId: () => this.selectedPaymentSourceId,
      requestInteraction: (interactionId: string) =>
        this.createSdkClient(interactionId)
          .GET('/interaction')
          .then((response) => interactionResponseFromApi(response)),
      mergeInteractionResponse: interactionResponseWithSelection,
      setInteractionResponse: (interactionResponse: InteractionResponse) =>
        this.setInteractionResponseFromSdk(interactionResponse),
      emitListPaymentMethods: (paymentSources: PaymentSource[]) =>
        this.emitSdkEvent(ON_LIST_PAYMENT_METHODS_EVENT, paymentSources),
    };
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
    this.billingAddressSelectorExpanded =
      this.cardDraft.billingAddressValue === NEW_BILLING_ADDRESS_VALUE;
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
    const headers = this.createInteractionHeaders(interactionId, init.headers);

    if (!headers.has('Accept')) {
      headers.set('Accept', 'application/json');
    }

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

  private async fetchManualBankAccountCountryConfig(
    interactionId: string,
    country: string
  ): Promise<PartyConfigurationResponse> {
    return this.requestCommerceHubJson<PartyConfigurationResponse>(
      '/party/configuration-inquiry',
      interactionId,
      {
        method: 'POST',
        headers: {
          'Client-Id': createRandomUuid(),
          'Content-Type': 'application/json',
          'User-Id': createRandomUuid(),
        },
        body: JSON.stringify({
          configurationType: 'COUNTRY_TENDER',
          country,
        }),
        credentials: 'include',
      }
    );
  }

  private resetBankFlow() {
    this.bankAccountConfigRequestToken += 1;
    this.cancelPayByBankProvider();
    this.bankFlowScreen = undefined;
    this.bankOutcomeSource = undefined;
    this.bankLinkLoading = false;
    this.bankAccountInstrumentSchemas = [];
    this.selectedBankAccountInstrumentSchemaCode = undefined;
    this.clearManualBankAccountForm();
    this.bankAccountConfigError = undefined;
    this.removePayByBankProviderContainer();
  }

  private cancelPayByBankProvider() {
    this.bankProviderRequestToken += 1;
    this.cancelPayByBankLaunch?.();
    this.cancelPayByBankLaunch = undefined;
    destroyPaymentSdk();
  }

  private resetCardFlow() {
    this.cardFlowScreen = undefined;
    this.cardDraft = createCardDraft();
    this.cardDraftErrors = {};
    this.cardEncryption = createCardEncryptionState();
    this.cardSubmitError = undefined;
    this.billingAddressSelectorExpanded = false;
  }

  private resetTransferFlow() {
    this.transferFlowActive = false;
    this.transferFlowScreen = 'form';
    this.transferDraft = createTransferDraft();
    this.transferDraftErrors = {};
    this.transferSubmitError = undefined;
    this.transferSubmitSuccess = false;
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
      getHeaders: () => this.createInteractionHeaders(interactionId),
    });
  }

  private createInteractionHeaders(
    interactionId: string,
    init?: HeadersInit
  ): Headers {
    const headers = new Headers(init);
    const accessToken = this.interactionResponse?.oauth?.access_token?.trim();

    headers.set('x-interaction-id', interactionId);

    if (accessToken && !headers.has('Authorization')) {
      headers.set('Authorization', `Bearer ${accessToken}`);
    }

    return headers;
  }

  private createSourceCreateHeaders(
    interactionId: string,
    sourceCreateContext: SourceCreateContext,
    init?: HeadersInit
  ): Headers {
    const headers = this.createInteractionHeaders(interactionId, init);

    headers.set('Api-Key', sourceCreateContext.clientId);
    headers.set('Auth-Token-Type', sourceCreateContext.tokenType);
    headers.set('x-key-id', sourceCreateContext.keyId);

    return headers;
  }

  private requireSourceCreateContext(): SourceCreateContext {
    const publicKey = this.interactionResponse?.publicKey?.trim();
    const keyId = this.interactionResponse?.keyId?.trim();
    const oauth = this.interactionResponse?.oauth;
    const clientId = oauth?.client_id?.trim();
    const tokenType = oauth?.token_type?.trim();
    const accessToken = oauth?.access_token?.trim();

    if (!publicKey || !keyId || !clientId || !tokenType || !accessToken) {
      throw new Error(
        'Payment source encryption is not configured. Try again later.'
      );
    }

    return {
      publicKey,
      keyId,
      clientId,
      tokenType,
      accessToken,
    };
  }

  private setInteractionResponseFromSdk(
    interactionResponse: InteractionResponse
  ) {
    this.interactionResponse =
      this.interactionResponseWithPreservedGatewayOAuth(interactionResponse);
  }

  private interactionResponseWithPreservedGatewayOAuth(
    interactionResponse: InteractionResponse
  ): InteractionResponse {
    if (interactionResponse.oauth && interactionResponse.features) {
      return interactionResponse;
    }

    const currentInteractionResponse = this.interactionResponse;

    if (
      !currentInteractionResponse ||
      (currentInteractionResponse.interactionId &&
        interactionResponse.interactionId &&
        currentInteractionResponse.interactionId !==
          interactionResponse.interactionId)
    ) {
      return interactionResponse;
    }

    return {
      ...interactionResponse,
      oauth: interactionResponse.oauth ?? currentInteractionResponse.oauth,
      features:
        interactionResponse.features ?? currentInteractionResponse.features,
    };
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
  /** Merchant-safe color overrides for the widget. */
  colors?: DesignConfigColors;
  /** Base font size applied to the host element, such as `16px`. */
  baseFontSize?: string;
  /** Base font weight used by SDK text that inherits the design token. */
  baseFontWeight?: string;
  /** Padding applied inside the widget shell, such as `1.75rem 1.5rem`. */
  shellPadding?: string;
  /** Screen-level copy overrides. */
  copy?: DesignConfigCopy;
  /** Pay by Bank provider configuration overrides. */
  payByBank?: DesignConfigPayByBank;
}

/**
 * Pay by Bank provider configuration used when a shopper starts the bank
 * handoff flow.
 */
export interface DesignConfigPayByBank {
  apiKey?: string;
  configId?: string;
  paymentSdkUrl?: string;
  environment?: string;
  locale?: string;
}

/**
 * Color tokens that can be overridden by merchant hosts.
 */
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
  /** Copy for OTP verification and resend screens. */
  otp?: DesignConfigOtpCopy;
  /** Copy for saved payment-source screens. */
  paymentMethods?: DesignConfigPaymentMethodsCopy;
  /** Copy for the no-saved-payment-methods screen. */
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

type ResolvedOtpCopy = OtpScreenCopy;
type ResolvedPaymentMethodsCopy = PaymentMethodsScreenCopy;
type ResolvedNoSavedPaymentMethodsCopy = NoSavedPaymentMethodsScreenCopy;

const findRequiredInfoSsnInput = (event: Event): HTMLInputElement | undefined =>
  event
    .composedPath()
    .find(
      (item): item is HTMLInputElement =>
        item instanceof HTMLInputElement &&
        item.classList.contains('required-info-ssn-input')
    );

const billingAddressLabel = (address: Address): string => {
  const stateZip = [address.stateOrProvince, address.postalCode]
    .filter(Boolean)
    .join(' ');
  const cityStateZip = [address.city, stateZip].filter(Boolean).join(', ');
  const label = [address.street, cityStateZip].filter(Boolean).join(', ');

  return label || address.id || 'Saved billing address';
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
  setPaymentSdkBrandingValue(branding, 'placeholderColor', colors?.placeholder);

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

    return [];
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
      source.account?.nickName?.trim() ||
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
    return source.account?.productType ?? 'Native account';
  }

  return 'DSC';
};

const paymentSourceAccountLabel = (source: PaymentSource): string => {
  const last4 = paymentSourceLast4(source);
  const masked = `•••• ${last4}`;

  if (isNativePaymentSource(source)) {
    const accountType = source.account?.productType?.trim();

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
    return lastFour(source.account?.positionId ?? source.account?.token);
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

const transferPaymentSourcesFromInteractionResponse = (
  interactionResponse?: InteractionResponse
): PaymentSource[] =>
  (interactionResponse?.paymentSources ?? []).filter(
    (source) =>
      (isBankPaymentSource(source) || isNativePaymentSource(source)) &&
      source.verificationInfo?.status === 'VERIFIED' &&
      Boolean(paymentSourceId(source))
  );

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

  return undefined;
};

const nativeAccountBalanceMatchKeys = (source: NativePaymentSource): string[] =>
  [source.id, source.account?.positionId, source.account?.token]
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

const isPaymentSelectionReadyStatus = (status?: InteractionStatus): boolean =>
  status === PAYMENT_SELECTION_READY_STATUS ||
  status === LEGACY_PAYMENT_SELECTION_READY_STATUS;

const isInteractionFeatureEnabled = (
  interactionResponse: InteractionResponse | undefined,
  feature: InteractionFeature
): boolean => Boolean(interactionResponse?.features?.includes(feature));

const areInteractionFeaturesEnabled = (
  interactionResponse: InteractionResponse | undefined,
  features: InteractionFeature[]
): boolean =>
  features.every((feature) =>
    isInteractionFeatureEnabled(interactionResponse, feature)
  );

const isTransferOnlyFeatureEnabled = (
  interactionResponse?: InteractionResponse
): boolean =>
  Boolean(
    isInteractionFeatureEnabled(interactionResponse, 'TRANSFER') &&
      !isInteractionFeatureEnabled(interactionResponse, 'ADD_ACCOUNT') &&
      !isInteractionFeatureEnabled(interactionResponse, 'SELECT')
  );

const isAddSelectTransferFeatureEnabled = (
  interactionResponse?: InteractionResponse
): boolean =>
  areInteractionFeaturesEnabled(interactionResponse, [
    'ADD_ACCOUNT',
    'SELECT',
    'TRANSFER',
  ]);

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
        ? PAYMENT_SELECTION_READY_STATUS
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

const createRandomUuid = (): string => {
  if (globalThis.crypto?.randomUUID) {
    return globalThis.crypto.randomUUID();
  }

  const bytes = new Uint8Array(16);
  globalThis.crypto?.getRandomValues(bytes);
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = [...bytes].map((byte) => byte.toString(16).padStart(2, '0'));

  return `${hex.slice(0, 4).join('')}-${hex.slice(4, 6).join('')}-${hex
    .slice(6, 8)
    .join('')}-${hex.slice(8, 10).join('')}-${hex.slice(10, 16).join('')}`;
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

  if (doc.docType === 'BANK_LETTER') {
    return 'Bank letter';
  }

  if (doc.docType === 'BANK_CHECK') {
    return 'Bank check';
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
      source.account?.nickName?.trim() ||
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

  interface HTMLElementEventMap extends SdkEventMap {}

  interface HTMLElementTagNameMap {
    'commerce-hub-bank-account-jsonforms': CommerceHubBankAccountJsonForms;
    'commerce-hub-connect': CommerceHubConnect;
  }
}
