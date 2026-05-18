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
  renderFormGrid,
  renderOutcomeShell,
  renderOtpGroup,
  renderOtpResend,
  renderPaymentMethodRow,
  renderProviderFrame,
  renderSelectedPaymentMethod,
  renderSelectField,
  renderSourceAction,
  renderTextField,
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

export type PaymentSource = NonNullable<
  InteractionResponse['paymentSources']
>[number];
export type OnSuccessEvent = CustomEvent<PaymentSource>;
export type OnErrorEvent = CustomEvent<InteractionError>;

export const ON_SUCCESS_EVENT = 'onSuccess';
export const ON_ERROR_EVENT = 'onError';

type BankPaymentSource = Extract<PaymentSource, {tenderType: 'BankAccount'}>;
type CardPaymentSource = Extract<PaymentSource, {tenderType: 'Card'}>;
type CardSourcePayload = Omit<CardPaymentSource, 'tenderType'> & {
  tenderType: 'CARD';
};
type Address = components['schemas']['Address'];
type BillingAddressResponse = components['schemas']['StringHolder'];
type SourceListResponse = PaymentSource[] | InteractionResponse;
type CreatedPaymentSourceResponse =
  | PaymentSource[]
  | (InteractionResponse & {
      id?: string;
      source?: PaymentSource;
      sourceId?: string;
      paymentSourceId?: string;
    });
type CustomerProfile = components['schemas']['Profile'];
type VerificationResponse = components['schemas']['VerificationResponse'];
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
type SensitiveCardField = 'cardNumber' | 'cvv';
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
type CardDraftErrors = Partial<Record<keyof CardDraft, string>>;

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
  private billingAddressesLoading = false;

  @state()
  private paymentSourceView?: 'list' | 'selected';

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
        this.paymentSourceView = undefined;
      }

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

    if (this.cardFlowScreen === 'form') {
      return this.renderAddCardScreen();
    }

    if (this.cardFlowScreen === 'error') {
      return this.renderCardErrorScreen();
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

    return renderWidgetShell({
      title: copy.title,
      subtitle: copy.subtitle ?? defaultOtpSubtitle(destination),
      showClose: false,
      showDivider: false,
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
                disabled: isSubmitting || isResending,
              })}
            </div>
          </div>
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

    if (this.shouldRenderSelectedPaymentSourceScreen()) {
      return this.renderSelectedPaymentSourceScreen(copy);
    }

    return renderWidgetShell({
      title: copy.title,
      subtitle: copy.subtitle,
      showClose: false,
      showDivider: false,
      content: html`
        <div class="payment-flow">
          <div
            class="primitive-stack"
            role="radiogroup"
            aria-label="Payment methods"
          >
            ${paymentMethods.map((method) => renderPaymentMethodRow(method))}
          </div>
          <div class="payment-action-links">
            ${renderSourceAction({
              label: copy.addCardTitle,
              subtitle: copy.addCardSubtitle,
              action: 'add-card',
              icon: 'card',
              variant: 'link',
              disabled: this.pendingAction === 'confirm-payment-source',
            })}
            ${renderSourceAction({
              label: copy.addBankAccountTitle,
              subtitle: copy.addBankAccountSubtitle,
              action: 'add-bank-account',
              icon: 'bank',
              variant: 'link',
              disabled: this.pendingAction === 'confirm-payment-source',
            })}
          </div>
          <div class="primitive-footer">
            ${renderButton({
              label:
                this.pendingAction === 'confirm-payment-source'
                  ? copy.continuingButton
                  : copy.continueButton,
              icon:
                this.pendingAction === 'confirm-payment-source'
                  ? undefined
                  : 'arrow-right',
              variant: 'primary',
              action: 'confirm-payment-source',
              disabled:
                this.pendingAction === 'confirm-payment-source' ||
                !this.selectedPaymentSourceId,
            })}
          </div>
        </div>
      `,
    });
  }

  private renderSelectedPaymentSourceScreen(
    copy: ResolvedPaymentMethodsCopy
  ): TemplateResult {
    const selectedSource = selectedPaymentSourceFromInteractionResponse(
      this.interactionResponse,
      this.selectedPaymentSourceId
    );

    if (!selectedSource) {
      this.paymentSourceView = 'list';
      return this.renderPaymentSourceScreen();
    }

    return renderWidgetShell({
      title: copy.title,
      headerAction: renderTextLinkButton({
        label: 'Change',
        action: 'change-payment-source',
        disabled: this.pendingAction === 'confirm-payment-source',
      }),
      showClose: false,
      showDivider: false,
      content: html`
        <div class="payment-flow">
          ${renderSelectedPaymentMethod(
            paymentSourceToPaymentMethod(selectedSource, selectedSource.id)
          )}
        </div>
      `,
    });
  }

  private shouldRenderSelectedPaymentSourceScreen(): boolean {
    if (this.interactionResponse?.status === 'PAYMENT_SOURCE_ATTACHED') {
      return true;
    }

    return this.paymentSourceView === 'selected';
  }

  private renderNoSavedPaymentMethods(): TemplateResult {
    const copy = resolveNoSavedPaymentMethodsCopy(this.designConfig);
    const showHelperCopy = Boolean(copy.emptyTitle || copy.emptyMessage);

    return renderWidgetShell({
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
          <div class="payment-action-links">
            ${renderSourceAction({
              label: copy.addCardTitle,
              subtitle: copy.addCardSubtitle,
              action: 'add-card',
              icon: 'card',
              variant: 'link',
            })}
            ${renderSourceAction({
              label: copy.addBankAccountTitle,
              subtitle: copy.addBankAccountSubtitle,
              action: 'add-bank-account',
              icon: 'bank',
              variant: 'link',
            })}
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

    return renderWidgetShell({
      title: 'Add a credit card',
      subtitle: 'Add a new payment method for this session.',
      showClose: false,
      showDivider: false,
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
          <div class="card-form-footer">
            <div class="card-form-back">
              ${renderTextLinkButton({
                label: 'Back',
                action: 'back-to-payment-methods',
                disabled: isSaving,
              })}
            </div>
            <div class="card-form-primary">
              ${renderButton({
                label: isSaving ? 'Saving card...' : 'Save card',
                action: 'save-card',
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
    return renderWidgetShell({
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
    return renderWidgetShell({
      title: 'Add bank account',
      width: 'wide',
      showClose: false,
      showDivider: false,
      content: html`
        <div class="bank-provider-flow">
          ${renderProviderFrame({
            containerId: PAY_BY_BANK_PROVIDER_CONTAINER_ID,
          })}
          <div class="primitive-footer">
            ${renderButton({
              label: 'Back',
              variant: 'secondary',
              action: 'back-to-payment-methods',
              disabled: this.bankLinkLoading,
            })}
          </div>
        </div>
      `,
    });
  }

  private renderBankProviderErrorScreen(): TemplateResult {
    return renderWidgetShell({
      title: 'Bank connection unavailable',
      subtitle:
        this.bankProviderError ??
        'We could not connect to your bank provider right now.',
      showClose: false,
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
      showClose: false,
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

    if (action === 'confirm-payment-source') {
      void this.confirmSelectedPaymentSource();
      return;
    }

    if (action === 'change-payment-source') {
      this.paymentSourceView = 'list';
      return;
    }

    if (
      action === 'add-bank-account' ||
      action === 'use-bank-account-instead' ||
      action === 'retry-bank-provider' ||
      action === 'use-different-bank-account'
    ) {
      this.paymentSourceView = 'list';
      this.resetCardFlow();
      void this.startPayByBankFlow();
      return;
    }

    if (action === 'back-to-payment-methods') {
      this.paymentSourceView = 'list';
      this.resetCardFlow();
      this.resetBankFlow();
      return;
    }

    if (action === 'continue-bank-outcome' || action === 'done-bank-outcome') {
      this.resetBankFlow();
      return;
    }

    if (action === 'add-card') {
      this.paymentSourceView = 'list';
      this.showAddCardScreen();
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
      this.paymentSourceView = 'list';
      this.resetCardFlow();
      return;
    }
  };

  private handleInput = (event: Event) => {
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
    const cardSelect = event
      .composedPath()
      .find(
        (item): item is HTMLSelectElement =>
          item instanceof HTMLSelectElement && Boolean(item.dataset.cardField)
      );

    if (!cardSelect) {
      return;
    }

    this.updateCardDraftField(
      cardSelect.dataset.cardField as keyof CardDraft,
      cardSelect.value
    );
  };

  private handlePaste = (event: Event) => {
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
    const input = event
      .composedPath()
      .find(
        (item): item is HTMLInputElement =>
          item instanceof HTMLInputElement &&
          isSensitiveCardField(item.dataset.cardField)
      );

    if (!input) {
      return;
    }

    void this.encryptCardField(
      input.dataset.cardField as SensitiveCardField,
      input.value
    );
  };

  private getOtpInputs(): HTMLInputElement[] {
    return [...this.renderRoot.querySelectorAll<HTMLInputElement>('.otp-input')];
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

  private showAddCardScreen() {
    this.resetBankFlow();
    this.cardFlowScreen = 'form';
    this.cardSubmitError = undefined;
    void this.loadBillingAddressesForInteraction();
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

  private async saveCard() {
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
      const sourceResponse =
        await this.requestCommerceHubJson<CreatedPaymentSourceResponse>(
          '/interaction/source/card',
          interactionId,
          {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(cardSource),
            credentials: 'include',
          }
        );
      const createdSource = resolveCreatedPaymentSource(sourceResponse);
      const paymentSourceId = createdSource.id;

      if (createdSource.verificationInfo?.status !== 'VERIFIED') {
        throw new Error('The card could not be verified.');
      }

      const sourceInteractionResponse = interactionResponseWithSourceList(
        this.interactionResponse ?? {interactionId},
        sourceResponse,
        paymentSourceId
      );
      this.cardFlowScreen = undefined;
      this.cardDraft = createCardDraft();
      this.cardDraftErrors = {};
      this.cardEncryption = createCardEncryptionState();
      this.cardSubmitError = undefined;
      this.paymentSourceView = 'list';
      this.selectedPaymentSourceId = paymentSourceId;
      this.setInteractionResponseFromSdk(
        withUpsertedSource(
          {
            ...sourceInteractionResponse,
            status: 'PAYMENT_SOURCE_REQUESTED',
          },
          createdSource
        )
      );
    } catch (cause) {
      this.cardSubmitError = apiErrorMessage(cause);
      this.cardFlowScreen = 'error';
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

  private async confirmSelectedPaymentSource() {
    if (this.pendingAction === 'confirm-payment-source') {
      return;
    }

    if (!this.selectedPaymentSourceId) {
      return;
    }

    const selectedPaymentSourceId = this.selectedPaymentSourceId;
    let selectedSource = selectedPaymentSourceFromInteractionResponse(
      this.interactionResponse,
      selectedPaymentSourceId
    );

    this.pendingAction = 'confirm-payment-source';

    const interactionId = this.requireInteractionId();

    try {
      if (interactionId) {
        const profile = await this.getCustomerProfile(interactionId);
        const paymentSources = profile.sources ?? [];
        const refreshedSelectedSource =
          paymentSources.find((source) => source.id === selectedPaymentSourceId) ??
          selectedSource;

        this.syncBillingAddressesFromProfile(profile);
        selectedSource = refreshedSelectedSource;
        this.selectedPaymentSourceId = refreshedSelectedSource?.id;
        this.setInteractionResponseFromSdk({
          ...this.interactionResponse,
          interactionId,
          selectedSource: refreshedSelectedSource,
          paymentSources,
        });
      }
    } catch (cause) {
      void cause;
    } finally {
      this.pendingAction = undefined;
    }

    if (!selectedSource) {
      return;
    }

    this.paymentSourceView = 'selected';
    this.dispatchEvent(new CustomEvent(ON_SUCCESS_EVENT, {detail: selectedSource}));
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
            const sourceResponse = await this.finalizePayByBankSession(
              interactionId,
              aggregatorSessionId,
              pToken
            );
            const bankSource = resolvePayByBankSourceFromSourceResponse(
              sourceResponse
            );
            const resolvedBankSource = await this.resolvePayByBankOutcomeSource(
              interactionId,
              bankSource
            );
            const paymentSourceId = resolvedBankSource.id;
            const sourceInteractionResponse = interactionResponseWithSourceList(
              this.interactionResponse ?? {interactionId},
              sourceResponse,
              paymentSourceId
            );

            this.selectedPaymentSourceId = paymentSourceId;
            this.bankOutcomeSource = resolvedBankSource;
            this.bankFlowScreen = 'outcome';
            this.setInteractionResponseFromSdk(
              withUpsertedSource(
                sourceInteractionResponse,
                resolvedBankSource
              )
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

  private async getCustomerProfile(
    interactionId: string
  ): Promise<CustomerProfile> {
    return this.requestCommerceHubJson<CustomerProfile>(
      '/customer',
      interactionId,
      {method: 'GET', credentials: 'include'}
    );
  }

  private async loadBillingAddressesForInteraction(): Promise<void> {
    const interactionId = this.requireInteractionId();

    if (!interactionId || this.billingAddressesLoading) {
      return;
    }

    this.billingAddressesLoading = true;

    try {
      const profile = await this.getCustomerProfile(interactionId);

      if (this.requireInteractionId() !== interactionId) {
        return;
      }

      this.syncBillingAddressesFromProfile(profile);
    } catch {
      this.billingAddresses = [];
      this.cardDraft = {
        ...this.cardDraft,
        billingAddressValue: NEW_BILLING_ADDRESS_VALUE,
      };
    } finally {
      this.billingAddressesLoading = false;
    }
  }

  private syncBillingAddressesFromProfile(profile: CustomerProfile) {
    this.billingAddresses = (profile.billingAddress ?? []).filter((address) =>
      Boolean(address.id?.trim())
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
  ): Promise<SourceListResponse> {
    return this.requestCommerceHubJson<SourceListResponse>(
      `/interaction/source/pbb/session/${encodeURIComponent(
        aggregatorSessionId
      )}/${encodeURIComponent(pToken)}`,
      interactionId,
      {method: 'PUT', credentials: 'include'}
    );
  }

  private async resolvePayByBankOutcomeSource(
    interactionId: string,
    source: BankPaymentSource
  ): Promise<BankPaymentSource> {
    if (source.verificationInfo?.status !== 'NOT_VERIFIED') {
      return source;
    }

    return this.verifyPayByBankSource(interactionId, source);
  }

  private async verifyPayByBankSource(
    interactionId: string,
    source: BankPaymentSource
  ): Promise<BankPaymentSource> {
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

    return {
      ...source,
      verificationInfo: {
        ...source.verificationInfo,
        ...verificationResponse,
      },
    };
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
      this.style.setProperty(DESIGN_CONFIG_SHELL_PADDING_PROPERTY, shellPadding);
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

const createCardEncryptionFieldState = (): CardFieldEncryptionState => ({
  status: 'idle',
  normalizedValue: '',
});

const createCardEncryptionState = (): CardEncryptionState => ({
  cardNumber: createCardEncryptionFieldState(),
  cvv: createCardEncryptionFieldState(),
});

const sanitizeOtpValue = (value: string): string => value.replace(/\D/g, '');

const findOtpInput = (event: Event): HTMLInputElement | undefined =>
  event.composedPath().find(
    (item): item is HTMLInputElement =>
      item instanceof HTMLInputElement && item.classList.contains('otp-input')
  );

const isSensitiveCardField = (field?: string): field is SensitiveCardField =>
  field === 'cardNumber' || field === 'cvv';

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

const createdPaymentSourcesFromResponse = (
  response?: CreatedPaymentSourceResponse
): PaymentSource[] => {
  if (!response) {
    return [];
  }

  if (Array.isArray(response)) {
    return response;
  }

  return [
    response.selectedSource,
    response.source,
    ...(response.paymentSources ?? []),
  ].filter((source): source is PaymentSource => Boolean(source));
};

const resolveCreatedPaymentSource = (
  response?: CreatedPaymentSourceResponse
): PaymentSource & {id: string} => {
  const paymentSourceId = resolveCreatedPaymentSourceId(response);
  const source =
    createdPaymentSourcesFromResponse(response).find(
      (paymentSource) => paymentSource.id?.trim() === paymentSourceId
    ) ??
    createdPaymentSourcesFromResponse(response).find((paymentSource) =>
      paymentSource.id?.trim()
    );

  if (!source) {
    throw new Error(
      'The card creation response did not include a created source.'
    );
  }

  if (!isCardPaymentSource(source)) {
    throw new Error(
      'The card creation response did not include a card source.'
    );
  }

  return {
    ...source,
    id: paymentSourceId,
  };
};

const resolveCreatedPaymentSourceId = (
  response?: CreatedPaymentSourceResponse
): string => {
  if (Array.isArray(response)) {
    const paymentSourceId = response
      .find((source) => source.id?.trim())
      ?.id?.trim();

    if (paymentSourceId) {
      return paymentSourceId;
    }
  }

  const paymentSourceId =
    !Array.isArray(response) &&
    (response?.selectedSource?.id?.trim() ||
      response?.source?.id?.trim() ||
      response?.sourceId?.trim() ||
      response?.paymentSourceId?.trim() ||
      response?.id?.trim() ||
      response?.paymentSources
        ?.find((source) => source.id?.trim())
        ?.id?.trim());

  if (!paymentSourceId) {
    throw new Error('The card creation response did not include a source id.');
  }

  return paymentSourceId;
};

const defaultOtpSubtitle = (destination?: string): string =>
  `We send a one-time code to ${destination ?? 'your contact method'}.`;

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
    title: copy?.title ?? 'Enter the code',
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
    addCardTitle: copy?.addCardTitle ?? 'Add a credit or debit card',
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
    addCardTitle: copy?.addCardTitle ?? 'Add a credit or debit card',
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

const DESIGN_CONFIG_FONT_WEIGHT_PROPERTY = '--chc-font-weight';
const DESIGN_CONFIG_SHELL_PADDING_PROPERTY = '--chc-shell-padding';

const designConfigStyleProperties = [
  ...designConfigColorProperties.map(({property}) => property),
  DESIGN_CONFIG_FONT_WEIGHT_PROPERTY,
  DESIGN_CONFIG_SHELL_PADDING_PROPERTY,
];

const paymentMethodsFromInteractionResponse = (
  interactionResponse?: InteractionResponse,
  selectedPaymentSourceId?: string
): PaymentMethod[] => {
  const paymentSources = interactionResponse?.paymentSources;

  if (!paymentSources?.length) {
    const selectedSource = selectedPaymentSourceFromInteractionResponse(
      interactionResponse,
      selectedPaymentSourceId
    );

    if (selectedSource) {
      return [paymentSourceToPaymentMethod(selectedSource, selectedSource.id)];
    }

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
  if (isCardPaymentSource(source)) {
    return 'Saved card';
  }

  if (isBankPaymentSource(source)) {
    return 'Saved bank account';
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

  return 'DSC';
};

const paymentSourceLast4 = (source: PaymentSource): string => {
  if (isCardPaymentSource(source)) {
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

const paymentSourcesFromSourceListResponse = (
  response: SourceListResponse
): PaymentSource[] => (Array.isArray(response) ? response : response.paymentSources ?? []);

const interactionResponseWithSourceList = (
  current: InteractionResponse,
  response: SourceListResponse,
  preferredPaymentSourceId?: string
): InteractionResponse => {
  const paymentSources = paymentSourcesFromSourceListResponse(response);
  const base = Array.isArray(response)
    ? current
    : {
        ...current,
        ...response,
      };
  const selectedSource =
    resolvePreferredPaymentSource(
      paymentSources,
      preferredPaymentSourceId ?? base.selectedSource?.id
    ) ?? base.selectedSource;

  return {
    ...base,
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

const resolvePayByBankSourceFromSourceResponse = (
  response: SourceListResponse
): BankPaymentSource => {
  const paymentSources = Array.isArray(response)
    ? response
    : [response.selectedSource, ...(response.paymentSources ?? [])];
  const source = paymentSources.find(
    (paymentSource): paymentSource is BankPaymentSource =>
      Boolean(paymentSource && isBankPaymentSource(paymentSource))
  );

  if (!source) {
    throw new Error(
      'Pay by Bank completed but no bank payment source was returned by /interaction/source/pbb/session.'
    );
  }

  const paymentSourceId = source.id?.trim();

  if (!paymentSourceId) {
    throw new Error(
      'Pay by Bank completed but the returned bank payment source did not include an id.'
    );
  }

  return {
    ...source,
    id: paymentSourceId,
  };
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
      title: 'Verification pending review',
      message: 'We will update this bank account after review is complete.',
    };
  }

  if (status === 'REQUIRE_INFO') {
    return {
      kind: 'requires-info',
      variant: 'warning',
      title: 'More information required',
      message:
        'Additional information is required before this bank account can be verified.',
    };
  }

  if (status === 'DECLINED') {
    return {
      kind: 'declined',
      variant: 'danger',
      title: 'Bank account declined',
      message: 'This bank account could not be verified.',
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

  if (status === 'UNDER_REVIEW') {
    return 'Pending review';
  }

  if (status === 'REQUIRE_INFO') {
    return 'More information required';
  }

  if (status === 'DECLINED') {
    return 'Declined';
  }

  return 'Not verified';
};

const isBankPaymentSource = (
  source: PaymentSource
): source is BankPaymentSource =>
  source.tenderType === 'BankAccount' ||
  (source.tenderType as string) === 'BANK_ACCOUNT';

const isCardPaymentSource = (
  source: PaymentSource
): source is CardPaymentSource =>
  source.tenderType === 'Card' || (source.tenderType as string) === 'CARD';

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
