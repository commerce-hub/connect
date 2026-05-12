import type {
  Address,
  CardSource,
  CustomerMaskType,
  InteractionResponse,
  PaymentSource,
  Profile,
} from '../contracts/api-models';
import type { CommerceHubConnectEnvironment } from '../contracts/environment';
import type {
  CommerceHubErrorStage,
  CommerceHubSdkConfiguration,
  CommerceHubSdkError,
  CommerceHubSdkFlowStep,
  CommerceHubWhiteLabelOptions,
  ResolvedCommerceHubWhiteLabelOptions,
} from '../contracts/sdk-models';
import { CommerceHubConnectApiClient, CommerceHubConnectApiError } from './api-client';
import {
  detectCardNetwork,
  isValidCardNumber,
  isValidCvv,
  maskCardNumberForDisplay,
  maskCvvForDisplay,
  normalizeCardNumber,
  normalizeCvv,
  parseExpiration,
} from './card';
import {
  destroyPaymentSdk,
  loadPaymentSdkScript,
  resolvePayByBankOptions,
  type PaymentSdkEvent,
} from './payment-sdk';
import { createStableId } from '../web-sdk-utils';

const DEFAULT_ALLOWED_TENDERS = ['CARD', 'BANK_ACCOUNT'] as const;
const DEFAULT_WHITE_LABEL: ResolvedCommerceHubWhiteLabelOptions = {
  primaryColor: '#084acc',
  secondaryColor: '#667085',
  textColor: '#101828',
  fontFamily: '"Open Sans", sans-serif',
  emailEntry: {},
  otpVerification: {},
  savedSource: {},
  addCard: {},
};
const NEW_BILLING_ADDRESS_VALUE = '__new__';

export interface CardDraft {
  name: string;
  fullName: string;
  cardNumber: string;
  expiration: string;
  cvc: string;
  billingAddressValue: string;
  country: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  zip: string;
}

type SensitiveCardField = 'cardNumber' | 'cvc';
type CardEncryptionStatus = 'idle' | 'dirty' | 'encrypting' | 'encrypted' | 'failed';

interface SensitiveCardFieldEncryptionState {
  status: CardEncryptionStatus;
  normalizedValue: string;
  encryptedValue: string | null;
}

export interface CardEncryptionState {
  cardNumber: SensitiveCardFieldEncryptionState;
  cvc: SensitiveCardFieldEncryptionState;
}

export interface WidgetSnapshot {
  interaction: InteractionResponse;
  configuration: CommerceHubSdkConfiguration;
  environment: CommerceHubConnectEnvironment;
  apiBaseUrl: string;
  displayStep: CommerceHubSdkFlowStep;
  currentStep: CommerceHubSdkFlowStep;
  loading: boolean;
  submitting: boolean;
  bankLinkLoading: boolean;
  error: CommerceHubSdkError | null;
  email: string;
  otpCode: string;
  paymentEntryMode: 'list' | 'add';
  supportedTenderTypes: Array<'CARD' | 'BANK_ACCOUNT'>;
  selectedTenderType: 'CARD' | 'BANK_ACCOUNT';
  availableSources: PaymentSource[];
  selectedSourceId: string | null;
  selectedSource: PaymentSource | null;
  completedPaymentSource: PaymentSource | null;
  billingAddresses: Address[];
  cardDraft: CardDraft;
  cardDraftErrors: Partial<Record<keyof CardDraft, string>>;
  cardDraftMessage: string | null;
  cardEncryption: CardEncryptionState;
  requestedOtpMode: 'default' | 'email';
  whiteLabel: ResolvedCommerceHubWhiteLabelOptions;
  payByBankMountId: string;
  pendingPayByBankLaunch: boolean;
}

export class CommerceHubConnectWidgetController {
  private readonly listeners = new Set<() => void>();
  private api: CommerceHubConnectApiClient;
  private destroyed = false;
  private autoSubmittedInteractionId: string | null = null;

  private state: WidgetSnapshot;

  constructor(
    interaction: InteractionResponse,
    configuration: CommerceHubSdkConfiguration,
    whiteLabel: CommerceHubWhiteLabelOptions | undefined,
    environment: CommerceHubConnectEnvironment,
    apiBaseUrl: string,
  ) {
    this.api = new CommerceHubConnectApiClient(apiBaseUrl, interaction.interactionId);
    this.state = this.createSnapshot(
      interaction,
      configuration,
      whiteLabel,
      environment,
      apiBaseUrl,
    );
    void this.initialize();
  }

  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  getSnapshot(): WidgetSnapshot {
    return this.state;
  }

  async update(
    interaction: InteractionResponse,
    configuration: CommerceHubSdkConfiguration,
    whiteLabel: CommerceHubWhiteLabelOptions | undefined,
    environment: CommerceHubConnectEnvironment,
    apiBaseUrl: string,
  ): Promise<void> {
    this.api = new CommerceHubConnectApiClient(apiBaseUrl, interaction.interactionId);
    this.state = this.createSnapshot(
      interaction,
      configuration,
      whiteLabel,
      environment,
      apiBaseUrl,
      this.state,
    );
    this.notify();
    await this.initialize();
  }

  destroy(): void {
    this.destroyed = true;
    destroyPaymentSdk();
    this.listeners.clear();
  }

  async submitEmail(email: string, mode: 'default' | 'email' = 'default'): Promise<void> {
    const normalizedEmail = email.trim();
    if (!isValidEmail(normalizedEmail)) {
      this.updateState({
        email: normalizedEmail,
        error: {
          message: 'Enter a valid email address.',
          stage: 'otp_send',
        },
      });
      return;
    }

    this.updateState({
      email: normalizedEmail,
      requestedOtpMode: mode,
      submitting: true,
      error: null,
      completedPaymentSource: null,
    });

    try {
      const interaction =
        mode === 'email'
          ? await this.api.sendInteractionOtpToEmail({ value: normalizedEmail })
          : await this.api.sendInteractionOtp({ value: normalizedEmail });
      this.commitInteraction(interaction);
    } catch (error) {
      this.failWith('otp_send', error);
    } finally {
      this.updateState({ submitting: false });
    }
  }

  async validateOtp(otp: string): Promise<void> {
    const normalizedOtp = otp.replace(/\D/g, '');
    if (!/^\d{6}$/.test(normalizedOtp)) {
      this.updateState({
        otpCode: normalizedOtp,
        error: {
          message: 'Enter the 6-digit code.',
          stage: 'otp_validate',
        },
      });
      return;
    }

    this.updateState({ otpCode: normalizedOtp, submitting: true, error: null });

    try {
      const interaction = await this.api.validateInteractionOtp({
        email: this.state.email,
        otp: normalizedOtp,
        channel: this.otpChannel(),
      });
      this.commitInteraction(interaction);
      await this.loadBillingAddresses({ reportError: true });
    } catch (error) {
      this.failWith('otp_validate', error);
    } finally {
      this.updateState({ submitting: false });
    }
  }

  backToEmailEntry(): void {
    this.updateState({
      otpCode: '',
      error: null,
    });

    this.commitInteraction({
      ...this.state.interaction,
      status: 'EMAIL_REQUESTED',
    });
  }

  async resendCode(): Promise<void> {
    if (!this.state.email) {
      return;
    }

    await this.submitEmail(this.state.email, this.state.requestedOtpMode);
  }

  async onOtpAlternateAction(): Promise<void> {
    if (this.otpChannel() === 'PHONE') {
      await this.submitEmail(this.state.email, 'email');
      return;
    }

    this.backToEmailEntry();
  }

  selectExistingSource(sourceId: string): void {
    this.updateState({ selectedSourceId: sourceId });
  }

  syncCardDraftField(field: keyof CardDraft, value: string, options?: { notify?: boolean }): void {
    this.state.cardDraft = {
      ...this.state.cardDraft,
      [field]: value,
    };

    if (isSensitiveCardField(field)) {
      const nextNormalizedValue = normalizeSensitiveCardFieldValue(field, value);
      this.state.cardEncryption = {
        ...this.state.cardEncryption,
        [field]: resolveDirtyCardEncryptionState(
          this.state.cardEncryption[field],
          nextNormalizedValue,
        ),
      };
    }

    if (options?.notify) {
      this.notify();
    }
  }

  async encryptCardField(field: SensitiveCardField, value: string): Promise<void> {
    this.syncCardDraftField(field, value);

    const normalizedValue = normalizeSensitiveCardFieldValue(field, value);
    const validationError = validateSensitiveCardField(field, value);

    if (!normalizedValue) {
      this.updateState({
        cardDraftErrors: omitCardDraftError(this.state.cardDraftErrors, field),
        cardEncryption: {
          ...this.state.cardEncryption,
          [field]: createCardEncryptionFieldState(),
        },
      });
      return;
    }

    if (validationError) {
      this.updateState({
        cardDraftErrors: {
          ...omitCardDraftError(this.state.cardDraftErrors, field),
          [field]: validationError,
        },
        cardEncryption: {
          ...this.state.cardEncryption,
          [field]: resolveDirtyCardEncryptionState(
            this.state.cardEncryption[field],
            normalizedValue,
          ),
        },
      });
      return;
    }

    const currentFieldState = this.state.cardEncryption[field];
    if (
      currentFieldState.status === 'encrypting' &&
      currentFieldState.normalizedValue === normalizedValue
    ) {
      return;
    }

    if (
      currentFieldState.status === 'encrypted' &&
      currentFieldState.normalizedValue === normalizedValue
    ) {
      return;
    }

    this.updateState({
      cardDraftErrors: omitCardDraftError(this.state.cardDraftErrors, field),
      cardDraftMessage: null,
      cardEncryption: {
        ...this.state.cardEncryption,
        [field]: {
          status: 'encrypting',
          normalizedValue,
          encryptedValue: null,
        },
      },
    });

    try {
      const encryptedValue = await this.maskSensitiveCardValue(field, value);
      if (
        normalizeSensitiveCardFieldValue(field, this.state.cardDraft[field]) !== normalizedValue
      ) {
        return;
      }

      this.updateState({
        cardDraftErrors: omitCardDraftError(this.state.cardDraftErrors, field),
        cardDraftMessage: null,
        cardEncryption: {
          ...this.state.cardEncryption,
          [field]: {
            status: 'encrypted',
            normalizedValue,
            encryptedValue,
          },
        },
      });
    } catch (error) {
      if (
        normalizeSensitiveCardFieldValue(field, this.state.cardDraft[field]) !== normalizedValue
      ) {
        return;
      }

      this.updateState({
        cardDraftErrors: {
          ...omitCardDraftError(this.state.cardDraftErrors, field),
          [field]: buildCardEncryptionErrorMessage(field),
        },
        cardDraftMessage: null,
        cardEncryption: {
          ...this.state.cardEncryption,
          [field]: {
            status: 'failed',
            normalizedValue,
            encryptedValue: null,
          },
        },
      });
      void error;
    }
  }

  showAddCardMethod(): void {
    this.updateState({
      paymentEntryMode: 'add',
      selectedTenderType: 'CARD',
      completedPaymentSource: null,
      error: null,
      pendingPayByBankLaunch: false,
      cardDraftMessage: null,
      cardDraftErrors: {},
    });
  }

  showAddBankAccountMethod(): void {
    this.updateState({
      paymentEntryMode: 'add',
      selectedTenderType: 'BANK_ACCOUNT',
      completedPaymentSource: null,
      error: null,
      pendingPayByBankLaunch: true,
    });
  }

  backToPaymentList(): void {
    this.updateState({
      paymentEntryMode: 'list',
      pendingPayByBankLaunch: false,
      completedPaymentSource: null,
      error: null,
    });
    destroyPaymentSdk();
  }

  async attachSelectedSource(): Promise<void> {
    const selectedSource = this.state.selectedSource;
    if (!selectedSource?.id) {
      return;
    }

    this.updateState({ submitting: true, error: null });

    try {
      const attachedInteraction = await this.api.attachPaymentMethod(selectedSource.id);
      this.commitInteraction(withUpsertedSource(attachedInteraction, selectedSource));
      this.state.configuration.onSuccess(attachedInteraction);
      this.updateState({
        completedPaymentSource: null,
        paymentEntryMode: 'list',
        selectedSourceId: selectedSource.id,
      });
    } catch (error) {
      this.failWith('payment_source', error);
    } finally {
      this.updateState({ submitting: false });
    }
  }

  async submitCard(draft: CardDraft): Promise<void> {
    const normalizedDraft = normalizeCardDraft(draft);
    const errors = validateCardDraft(normalizedDraft);
    const encryptionReadinessErrors = validateCardEncryptionReadiness(
      normalizedDraft,
      this.state.cardEncryption,
    );
    for (const field of ['cardNumber', 'cvc'] as const) {
      if (!errors[field] && encryptionReadinessErrors[field]) {
        errors[field] = encryptionReadinessErrors[field];
      }
    }

    if (Object.keys(errors).length > 0) {
      this.updateState({
        cardDraft: normalizedDraft,
        cardDraftErrors: errors,
        cardDraftMessage: null,
      });
      return;
    }

    this.updateState({
      cardDraft: normalizedDraft,
      cardDraftErrors: {},
      cardDraftMessage: null,
      submitting: true,
      error: null,
    });

    try {
      const maskedCardNumber = resolveEncryptedCardFieldValue(
        'cardNumber',
        normalizedDraft.cardNumber,
        this.state.cardEncryption,
      );
      const maskedCvv = resolveEncryptedCardFieldValue(
        'cvc',
        normalizedDraft.cvc,
        this.state.cardEncryption,
      );
      const { month, year } = parseExpiration(normalizedDraft.expiration);

      if (!month || !year) {
        this.updateState({
          cardDraftErrors: {
            expiration: 'Enter a valid expiration date.',
          },
          submitting: false,
        });
        return;
      }

      const billingAddressId = await this.resolveBillingAddressId(normalizedDraft);
      if (!billingAddressId) {
        this.updateState({
          cardDraftMessage: 'Unable to associate a billing address.',
          submitting: false,
        });
        return;
      }

      const cardSource: CardSource = {
        id: createStableId('source'),
        tenderType: 'CARD',
        name: normalizedDraft.name,
        billingAddressId,
        card: {
          nameOnCard: normalizedDraft.fullName,
          cardNumber: maskedCardNumber,
          cvv: maskedCvv,
          expirationMonth: month,
          expirationYear: year,
          network: detectCardNetwork(normalizedDraft.cardNumber),
          cardNumberEncrypted:
            maskedCardNumber !== normalizeCardNumber(normalizedDraft.cardNumber)
              ? maskedCardNumber
              : undefined,
          cvvEncrypted: maskedCvv !== normalizeCvv(normalizedDraft.cvc) ? maskedCvv : undefined,
        },
      };

      const response = await this.api.addSource(cardSource);
      const paymentSourceId = extractPaymentSourceId(response) ?? cardSource.id;

      if (!paymentSourceId) {
        throw new Error('Payment source creation completed without returning a source id.');
      }

      const attachedInteraction = await this.api.attachPaymentMethod(paymentSourceId);
      const createdSource: PaymentSource = {
        ...cardSource,
        id: paymentSourceId,
      };
      this.commitInteraction(withUpsertedSource(attachedInteraction, createdSource));
      this.state.configuration.onSuccess(attachedInteraction);
      this.updateState({
        completedPaymentSource: null,
        paymentEntryMode: 'list',
        selectedSourceId: paymentSourceId,
        cardDraft: defaultCardDraft(),
        cardEncryption: defaultCardEncryptionState(),
      });
      await this.loadBillingAddresses();
    } catch (error) {
      this.failWith('payment_source', error);
    } finally {
      this.updateState({ submitting: false });
    }
  }

  async launchPayByBank(containerId: string): Promise<void> {
    if (this.destroyed || this.state.bankLinkLoading) {
      return;
    }

    this.updateState({ bankLinkLoading: true, pendingPayByBankLaunch: false, error: null });

    try {
      const existingBankSourceIds = await this.getExistingBankSourceIds();
      const session = await this.api.createPayByBankSession();
      const { aggregatorSessionId, accessToken, pToken, publicKey } =
        resolvePayByBankSession(session);
      const payByBank = resolvePayByBankOptions(
        this.state.environment,
        this.state.configuration.payByBank,
      );

      await loadPaymentSdkScript(payByBank.paymentSdkUrl);
      const paymentSdk = window.PaymentSDK;
      if (!paymentSdk?.init) {
        throw new Error('PaymentSDK.js loaded but PaymentSDK.init is not available on window.');
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
          containerId,
          ...(aggregatorSessionId ? { aggregatorSessionId } : {}),
          onEvent: async (event) => {
            if (settled || !isTerminalPaymentSdkEvent(event)) {
              return;
            }

            destroyPaymentSdk();

            if (event.type !== 'success') {
              settled = true;
              reject(new Error(describePaymentSdkTerminalEvent(event)));
              return;
            }

            try {
              await this.api.finalizePayByBankSession(aggregatorSessionId, pToken);
              const profile = await this.api.getCustomerProfile();
              const bankSource = resolveAttachedBankSource(profile, existingBankSourceIds);
              const paymentSourceId = bankSource.id?.trim();
              if (!paymentSourceId) {
                throw new Error(
                  'Pay by Bank completed but no bank payment source was returned by /customer.',
                );
              }

              const attachedInteraction = await this.api.attachPaymentMethod(paymentSourceId);
              const nextInteraction = withUpsertedSource(attachedInteraction, bankSource);
              this.commitInteraction(nextInteraction);
              this.state.configuration.onSuccess(attachedInteraction);
              this.updateState({
                completedPaymentSource: null,
                paymentEntryMode: 'list',
                selectedSourceId: paymentSourceId,
              });
              settled = true;
              resolve();
            } catch (error) {
              settled = true;
              reject(error);
            }
          },
        });
      });
    } catch (error) {
      this.failWith('pay_by_bank', error);
    } finally {
      this.updateState({ bankLinkLoading: false });
    }
  }

  private createSnapshot(
    interaction: InteractionResponse,
    configuration: CommerceHubSdkConfiguration,
    whiteLabel: CommerceHubWhiteLabelOptions | undefined,
    environment: CommerceHubConnectEnvironment,
    apiBaseUrl: string,
    previous?: WidgetSnapshot,
  ): WidgetSnapshot {
    const selectedTenderType = resolveSelectedTenderType(interaction, previous?.selectedTenderType);
    const paymentEntryMode = previous?.paymentEntryMode === 'add' ? 'add' : 'list';
    const email = configuration.email?.trim() || interaction.email?.trim() || previous?.email || '';
    const completedPaymentSource =
      previous?.interaction.interactionId === interaction.interactionId
        ? previous.completedPaymentSource
        : null;

    return {
      interaction,
      configuration,
      environment,
      apiBaseUrl,
      displayStep: deriveDisplayStep(interaction, paymentEntryMode, completedPaymentSource),
      currentStep: deriveCurrentStep(interaction),
      loading: false,
      submitting: false,
      bankLinkLoading: false,
      error: null,
      email,
      otpCode:
        previous?.interaction.interactionId === interaction.interactionId ? previous.otpCode : '',
      paymentEntryMode,
      supportedTenderTypes: resolveSupportedTenderTypes(interaction),
      selectedTenderType,
      availableSources: resolveAvailableSources(interaction),
      selectedSource: resolveSelectedSource(interaction, previous?.selectedSourceId),
      selectedSourceId:
        previous?.interaction.interactionId === interaction.interactionId
          ? (previous?.selectedSourceId ?? interaction.selectedSource?.id ?? null)
          : (interaction.selectedSource?.id ?? null),
      completedPaymentSource,
      billingAddresses:
        previous?.interaction.interactionId === interaction.interactionId
          ? previous.billingAddresses
          : [],
      cardDraft:
        previous?.interaction.interactionId === interaction.interactionId
          ? previous.cardDraft
          : defaultCardDraft(),
      cardEncryption:
        previous?.interaction.interactionId === interaction.interactionId
          ? previous.cardEncryption
          : defaultCardEncryptionState(),
      cardDraftErrors: {},
      cardDraftMessage: null,
      requestedOtpMode: previous?.requestedOtpMode ?? 'default',
      whiteLabel: resolveWhiteLabel(configuration.whiteLabel, whiteLabel),
      payByBankMountId: `commerce-hub-banklink-${interaction.interactionId}`.replace(
        /[^a-zA-Z0-9-_]/g,
        '-',
      ),
      pendingPayByBankLaunch: false,
    };
  }

  private async initialize(): Promise<void> {
    if (this.canManagePaymentInCurrentSession()) {
      await this.loadBillingAddresses({ reportError: true });
    }

    if (
      this.state.email &&
      this.state.currentStep === 'email' &&
      this.autoSubmittedInteractionId !== this.state.interaction.interactionId
    ) {
      this.autoSubmittedInteractionId = this.state.interaction.interactionId;
      queueMicrotask(() => {
        void this.submitEmail(this.state.email, 'default');
      });
    }
  }

  private canManagePaymentInCurrentSession(): boolean {
    return this.state.currentStep === 'payment' || this.state.currentStep === 'success';
  }

  private async loadBillingAddresses(options?: { reportError?: boolean }): Promise<void> {
    try {
      const profile = await this.api.getCustomerProfile();
      this.updateState({
        billingAddresses: profile.billingAddress ?? [],
        ...(options?.reportError ? { error: null } : {}),
      });
    } catch (error) {
      if (options?.reportError) {
        this.failWith('session', error);
      }
    }
  }

  private otpChannel(): 'EMAIL' | 'PHONE' {
    if (this.state.requestedOtpMode === 'email') {
      return 'EMAIL';
    }

    return this.state.interaction.phone?.phoneNumber ? 'PHONE' : 'EMAIL';
  }

  private async resolveBillingAddressId(draft: CardDraft): Promise<string | undefined> {
    if (draft.billingAddressValue && draft.billingAddressValue !== NEW_BILLING_ADDRESS_VALUE) {
      return draft.billingAddressValue;
    }

    const address: Address = {
      id: createStableId('billing-address'),
      recipientNameOrAddress: draft.fullName,
      street: draft.addressLine1,
      houseNumberOrName: draft.addressLine2,
      city: draft.city,
      stateOrProvince: draft.state,
      postalCode: draft.zip,
      country: draft.country,
    };

    await this.api.addBillingAddress(address);
    return address.id;
  }

  private async maskSensitiveCardValue(field: SensitiveCardField, value: string): Promise<string> {
    const type: CustomerMaskType = field === 'cardNumber' ? 'card' : 'cvv';
    const masked = await this.api.mask(type, { value });
    return masked.value;
  }

  private async getExistingBankSourceIds(): Promise<Set<string>> {
    try {
      const profile = await this.api.getCustomerProfile();
      return new Set(
        (profile.sources ?? [])
          .filter((source): source is PaymentSource => source.tenderType === 'BANK_ACCOUNT')
          .map((source) => source.id?.trim())
          .filter((sourceId): sourceId is string => Boolean(sourceId)),
      );
    } catch {
      return new Set<string>();
    }
  }

  private commitInteraction(interaction: InteractionResponse): void {
    this.api.setInteractionId(interaction.interactionId ?? null);
    const nextAvailableSources = resolveAvailableSources(interaction);
    const nextSelectedSource = resolveSelectedSource(interaction, this.state.selectedSourceId);
    const nextCurrentStep = deriveCurrentStep(interaction);
    const nextDisplayStep = deriveDisplayStep(
      interaction,
      nextCurrentStep === 'payment' ? this.state.paymentEntryMode : 'list',
      this.state.completedPaymentSource,
    );

    this.updateState({
      interaction,
      availableSources: nextAvailableSources,
      selectedSource: nextSelectedSource,
      currentStep: nextCurrentStep,
      displayStep: nextDisplayStep,
      supportedTenderTypes: resolveSupportedTenderTypes(interaction),
      selectedTenderType: resolveSelectedTenderType(interaction, this.state.selectedTenderType),
    });
  }

  private failWith(stage: CommerceHubErrorStage, error: unknown): void {
    const sdkError = toSdkError(stage, error);
    this.updateState({ error: sdkError });
    this.state.configuration.onError(sdkError);
  }

  private updateState(partial: Partial<WidgetSnapshot>): void {
    this.state = {
      ...this.state,
      ...partial,
    };
    this.state.currentStep = deriveCurrentStep(this.state.interaction);
    this.state.displayStep = deriveDisplayStep(
      this.state.interaction,
      this.state.paymentEntryMode,
      this.state.completedPaymentSource,
    );
    this.state.availableSources = resolveAvailableSources(this.state.interaction);
    this.state.selectedSource = resolveSelectedSource(
      this.state.interaction,
      this.state.selectedSourceId,
    );
    this.notify();
  }

  private notify(): void {
    if (this.destroyed) {
      return;
    }

    for (const listener of this.listeners) {
      listener();
    }
  }
}

function resolveWhiteLabel(
  configurationWhiteLabel: CommerceHubWhiteLabelOptions | undefined,
  instanceWhiteLabel: CommerceHubWhiteLabelOptions | undefined,
): ResolvedCommerceHubWhiteLabelOptions {
  return {
    ...DEFAULT_WHITE_LABEL,
    ...configurationWhiteLabel,
    ...instanceWhiteLabel,
    emailEntry: {
      ...DEFAULT_WHITE_LABEL.emailEntry,
      ...configurationWhiteLabel?.emailEntry,
      ...instanceWhiteLabel?.emailEntry,
    },
    otpVerification: {
      ...DEFAULT_WHITE_LABEL.otpVerification,
      ...configurationWhiteLabel?.otpVerification,
      ...instanceWhiteLabel?.otpVerification,
    },
    savedSource: {
      ...DEFAULT_WHITE_LABEL.savedSource,
      ...configurationWhiteLabel?.savedSource,
      ...instanceWhiteLabel?.savedSource,
    },
    addCard: {
      ...DEFAULT_WHITE_LABEL.addCard,
      ...configurationWhiteLabel?.addCard,
      ...instanceWhiteLabel?.addCard,
    },
  };
}

function deriveCurrentStep(interaction: InteractionResponse): CommerceHubSdkFlowStep {
  switch (interaction.status) {
    case 'OTP_VALIDATION_PENDING':
    case 'OTP_VALIDATION_FAILED':
      return 'otp';
    case 'PAYMENT_SOURCE_REQUESTED':
    case 'PAYMENT_SOURCE_ATTACHED':
      return 'payment';
    case 'COMPLETED':
      return 'success';
    case 'EMAIL_REQUESTED':
    case 'ABANDONED':
    default:
      return 'email';
  }
}

function deriveDisplayStep(
  interaction: InteractionResponse,
  paymentEntryMode: 'list' | 'add',
  completedPaymentSource: PaymentSource | null,
): CommerceHubSdkFlowStep {
  if (completedPaymentSource) {
    return 'success';
  }

  const currentStep = deriveCurrentStep(interaction);
  if (paymentEntryMode === 'add' && currentStep === 'payment') {
    return 'payment';
  }

  return currentStep;
}

function resolveSupportedTenderTypes(
  interaction: InteractionResponse,
): Array<'CARD' | 'BANK_ACCOUNT'> {
  const interactionAllowed = interaction.allowedTenderTypes ?? [...DEFAULT_ALLOWED_TENDERS];
  const filtered = interactionAllowed.filter(
    (tender): tender is 'CARD' | 'BANK_ACCOUNT' => tender === 'CARD' || tender === 'BANK_ACCOUNT',
  );

  return filtered.length > 0 ? filtered : [...DEFAULT_ALLOWED_TENDERS];
}

function resolveSelectedTenderType(
  interaction: InteractionResponse,
  previous?: 'CARD' | 'BANK_ACCOUNT',
): 'CARD' | 'BANK_ACCOUNT' {
  const supported = resolveSupportedTenderTypes(interaction);
  const selected = interaction.selectedSource?.tenderType ?? previous;
  return supported.includes(selected ?? 'CARD') ? (selected ?? supported[0]) : supported[0];
}

function resolveAvailableSources(interaction: InteractionResponse): PaymentSource[] {
  const allowed = new Set(resolveSupportedTenderTypes(interaction));
  return (interaction.paymentSources ?? []).filter((source) => allowed.has(source.tenderType));
}

function resolveSelectedSource(
  interaction: InteractionResponse,
  selectedSourceId?: string | null,
): PaymentSource | null {
  const availableSources = resolveAvailableSources(interaction);
  const interactionSelectedId = interaction.selectedSource?.id ?? null;
  const effectiveId = selectedSourceId ?? interactionSelectedId;

  return (
    availableSources.find((source) => source.id === effectiveId) ??
    interaction.selectedSource ??
    null
  );
}

function normalizeCardDraft(draft: CardDraft): CardDraft {
  return {
    name: draft.name.trim(),
    fullName: draft.fullName.trim(),
    cardNumber: draft.cardNumber.trim(),
    expiration: draft.expiration.trim(),
    cvc: draft.cvc.trim(),
    billingAddressValue: draft.billingAddressValue?.trim() || NEW_BILLING_ADDRESS_VALUE,
    country: draft.country.trim() || 'United States',
    addressLine1: draft.addressLine1.trim(),
    addressLine2: draft.addressLine2.trim(),
    city: draft.city.trim(),
    state: draft.state.trim(),
    zip: draft.zip.trim(),
  };
}

function defaultCardDraft(): CardDraft {
  return {
    name: '',
    fullName: '',
    cardNumber: '',
    expiration: '',
    cvc: '',
    billingAddressValue: NEW_BILLING_ADDRESS_VALUE,
    country: 'United States',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    zip: '',
  };
}

function defaultCardEncryptionState(): CardEncryptionState {
  return {
    cardNumber: createCardEncryptionFieldState(),
    cvc: createCardEncryptionFieldState(),
  };
}

function createCardEncryptionFieldState(): SensitiveCardFieldEncryptionState {
  return {
    status: 'idle',
    normalizedValue: '',
    encryptedValue: null,
  };
}

function isSensitiveCardField(field: keyof CardDraft): field is SensitiveCardField {
  return field === 'cardNumber' || field === 'cvc';
}

function normalizeSensitiveCardFieldValue(field: SensitiveCardField, value: string): string {
  return field === 'cardNumber' ? normalizeCardNumber(value) : normalizeCvv(value);
}

function validateSensitiveCardField(field: SensitiveCardField, value: string): string | undefined {
  if (field === 'cardNumber') {
    return isValidCardNumber(value) ? undefined : 'Enter a valid card number.';
  }

  return isValidCvv(value) ? undefined : 'Enter a valid CVC.';
}

function buildCardEncryptionErrorMessage(field: SensitiveCardField): string {
  return field === 'cardNumber'
    ? 'Unable to encrypt the card number. Try again.'
    : 'Unable to encrypt the CVC. Try again.';
}

function resolveDirtyCardEncryptionState(
  previous: SensitiveCardFieldEncryptionState,
  normalizedValue: string,
): SensitiveCardFieldEncryptionState {
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
    encryptedValue: null,
  };
}

function omitCardDraftError(
  errors: Partial<Record<keyof CardDraft, string>>,
  field: keyof CardDraft,
): Partial<Record<keyof CardDraft, string>> {
  const nextErrors = {
    ...errors,
  };
  delete nextErrors[field];
  return nextErrors;
}

function validateCardEncryptionReadiness(
  draft: CardDraft,
  cardEncryption: CardEncryptionState,
): Partial<Record<keyof CardDraft, string>> {
  const errors: Partial<Record<keyof CardDraft, string>> = {};
  for (const field of ['cardNumber', 'cvc'] as const) {
    const normalizedValue = normalizeSensitiveCardFieldValue(field, draft[field]);
    const encryptedField = cardEncryption[field];
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
}

function resolveEncryptedCardFieldValue(
  field: SensitiveCardField,
  value: string,
  cardEncryption: CardEncryptionState,
): string {
  const normalizedValue = normalizeSensitiveCardFieldValue(field, value);
  const encryptedField = cardEncryption[field];
  if (
    encryptedField.status !== 'encrypted' ||
    encryptedField.normalizedValue !== normalizedValue ||
    !encryptedField.encryptedValue
  ) {
    throw new Error(
      field === 'cardNumber'
        ? 'Card number encryption must complete before saving.'
        : 'CVC encryption must complete before saving.',
    );
  }

  return encryptedField.encryptedValue;
}

function validateCardDraft(draft: CardDraft): Partial<Record<keyof CardDraft, string>> {
  const errors: Partial<Record<keyof CardDraft, string>> = {};

  if (!draft.name) {
    errors.name = 'Card name is required.';
  }

  if (!draft.fullName) {
    errors.fullName = 'Name on card is required.';
  }

  if (!isValidCardNumber(draft.cardNumber)) {
    errors.cardNumber = 'Enter a valid card number.';
  }

  if (!parseExpiration(draft.expiration).month) {
    errors.expiration = 'Enter a valid expiration date.';
  }

  if (!isValidCvv(draft.cvc)) {
    errors.cvc = 'Enter a valid CVC.';
  }

  if (draft.billingAddressValue === NEW_BILLING_ADDRESS_VALUE) {
    if (!draft.addressLine1) {
      errors.addressLine1 = 'Address line 1 is required.';
    }
    if (!draft.city) {
      errors.city = 'City is required.';
    }
    if (!draft.state) {
      errors.state = 'State is required.';
    }
    if (!draft.zip) {
      errors.zip = 'ZIP code is required.';
    }
  }

  return errors;
}

function extractPaymentSourceId(response: unknown): string | undefined {
  if (!response) {
    return undefined;
  }

  if (typeof response === 'string') {
    return response.trim() || undefined;
  }

  if (typeof response === 'object') {
    const record = response as Record<string, unknown>;
    const sourceId =
      (typeof record['id'] === 'string' ? record['id'] : undefined) ??
      (typeof record['sourceId'] === 'string' ? record['sourceId'] : undefined) ??
      (typeof record['paymentSourceId'] === 'string' ? record['paymentSourceId'] : undefined);
    return sourceId?.trim() || undefined;
  }

  return undefined;
}

function resolvePayByBankSession(session: {
  aggregatorSessionId?: string;
  tokenID?: string;
  accessToken?: string;
  publicKey?: string;
  pToken?: string;
}): {
  aggregatorSessionId: string;
  accessToken: string;
  pToken: string;
  publicKey: string;
} {
  const aggregatorSessionId = session.aggregatorSessionId?.trim();
  const accessToken = session.tokenID?.trim() || session.accessToken?.trim();
  const pToken = session.pToken?.trim();
  const publicKey = session.publicKey?.trim();

  if (!aggregatorSessionId || !accessToken || !pToken || !publicKey) {
    throw new Error('The /pbb/session response is missing one or more required values.');
  }

  return {
    aggregatorSessionId,
    accessToken,
    pToken,
    publicKey,
  };
}

function isTerminalPaymentSdkEvent(event: PaymentSdkEvent): boolean {
  return (
    event.type === 'success' ||
    event.type === 'cancel' ||
    event.type === 'failure' ||
    event.type === 'error'
  );
}

function describePaymentSdkTerminalEvent(event: PaymentSdkEvent): string {
  if (typeof event.payload === 'string' && event.payload.trim()) {
    return event.payload;
  }

  if (event.type === 'cancel') {
    return 'Pay by Bank was cancelled.';
  }

  if (event.type === 'failure' || event.type === 'error') {
    return 'Pay by Bank failed.';
  }

  return 'Pay by Bank did not complete successfully.';
}

function resolveAttachedBankSource(
  profile: Profile,
  existingBankSourceIds: Set<string>,
): PaymentSource {
  const bankSources = (profile.sources ?? []).filter(
    (source): source is PaymentSource => source.tenderType === 'BANK_ACCOUNT',
  );

  return (
    bankSources.find((source) => {
      const sourceId = source.id?.trim();
      return sourceId ? !existingBankSourceIds.has(sourceId) : false;
    }) ??
    bankSources.at(0) ??
    (() => {
      throw new Error(
        'Pay by Bank completed but no bank payment source was returned by /customer.',
      );
    })()
  );
}

function withUpsertedSource(
  interaction: InteractionResponse,
  source: PaymentSource,
): InteractionResponse {
  const paymentSources = interaction.paymentSources ?? [];
  const nextPaymentSources = paymentSources.some(
    (existingSource) => existingSource.id === source.id,
  )
    ? paymentSources.map((existingSource) =>
        existingSource.id === source.id ? source : existingSource,
      )
    : [source, ...paymentSources];

  return {
    ...interaction,
    paymentSources: nextPaymentSources,
    selectedSource: source,
  };
}

function toSdkError(stage: CommerceHubErrorStage, error: unknown): CommerceHubSdkError {
  if (error instanceof CommerceHubConnectApiError) {
    return {
      stage,
      status: error.status,
      message: error.message,
      cause: error.body,
    };
  }

  if (error instanceof Error) {
    return {
      stage,
      message: error.message,
      cause: error,
    };
  }

  return {
    stage,
    message: typeof error === 'string' ? error : 'An unexpected error occurred.',
    cause: error,
  };
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function formatOtpDestination(snapshot: WidgetSnapshot): string {
  if (snapshot.interaction.phone?.phoneNumber && snapshot.requestedOtpMode !== 'email') {
    return snapshot.interaction.phone.phoneNumber;
  }

  return maskEmail(snapshot.email || snapshot.interaction.email || '');
}

function maskEmail(email: string): string {
  const [localPart, domain] = email.split('@');
  if (!localPart || !domain) {
    return email;
  }

  const visibleLocal = localPart.slice(0, 2);
  return `${visibleLocal}${'*'.repeat(Math.max(0, localPart.length - visibleLocal.length))}@${domain}`;
}

export function formatSourcePrimaryLabel(source: PaymentSource): string {
  if (source.tenderType === 'CARD') {
    return (
      source.name?.trim() ||
      source.card.nameOnCard?.trim() ||
      `${source.card.network ?? 'Card'} card`
    );
  }

  return source.bankAccount.bankName?.trim() || source.name?.trim() || 'Bank account';
}

export function formatSourceSecondaryLabel(source: PaymentSource): string {
  if (source.tenderType === 'CARD') {
    return `•••• ${source.card.cardNumber.slice(-4) || '----'}`;
  }

  return `•••• ${source.bankAccount.accountNumber.slice(-4) || '----'}`;
}

export function formatSourceBadgeLabel(source: PaymentSource): string {
  if (source.tenderType === 'CARD') {
    switch (source.card.network) {
      case 'AmericanExpress':
        return 'AMEX';
      case 'Mastercard':
        return 'MC';
      case 'Discover':
        return 'DISC';
      case 'Visa':
        return 'VISA';
      default:
        return 'CARD';
    }
  }

  const bankName = source.bankAccount.bankName?.trim();
  if (!bankName) {
    return 'BANK';
  }

  return (
    bankName
      .split(/\s+/)
      .map((part) => part[0] ?? '')
      .join('')
      .slice(0, 4)
      .toUpperCase() || 'BANK'
  );
}

export function formatBillingAddressLabel(address: Address): string {
  return [
    address.recipientNameOrAddress,
    address.street,
    address.houseNumberOrName,
    address.city,
    address.stateOrProvince,
    address.postalCode,
  ]
    .filter(Boolean)
    .join(', ');
}

export function getNewBillingAddressValue(): string {
  return NEW_BILLING_ADDRESS_VALUE;
}

export function getDefaultCardDraft(): CardDraft {
  return defaultCardDraft();
}

export function getMaskedCardPreview(cardNumber: string): string {
  return maskCardNumberForDisplay(cardNumber);
}

export function getMaskedCvvPreview(cvv: string): string {
  return maskCvvForDisplay(cvv);
}

export function canSubmitCard(snapshot: WidgetSnapshot): boolean {
  return (
    snapshot.cardEncryption.cardNumber.status === 'encrypted' &&
    snapshot.cardEncryption.cvc.status === 'encrypted' &&
    !snapshot.submitting
  );
}
