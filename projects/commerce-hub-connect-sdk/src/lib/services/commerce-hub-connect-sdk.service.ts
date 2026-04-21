import { HttpErrorResponse } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { firstValueFrom, Observable, throwError } from 'rxjs';
import { catchError, finalize, map, switchMap, tap } from 'rxjs/operators';

import {
  Address,
  ConsumeTokenRequest,
  CreateTokenRequest,
  CreateTokenResponse,
  InteractionCompletionRequest,
  CardNetwork,
  CardSource,
  CommerceHubTenderType,
  InteractionRequest,
  InteractionResponse,
  MachinePaymentResponse,
  OTPResponse,
  OtpValidateRequest,
  PayByBankSessionResponse,
  Payment,
  PaymentSource,
  PaymentsSearchRequest,
  PhoneDetails,
  Profile,
  StringHolder,
} from '../models/api.models';
import {
  CommerceHubErrorStage,
  CommerceHubPayByBankOptions,
  CommerceHubSdkConfiguration,
  CommerceHubSdkError,
  CommerceHubSdkFlowStep,
  CommerceHubSuccessResult,
  ResolvedCommerceHubSdkConfiguration,
} from '../models/sdk.models';
import { CommerceHubConnectApiService } from './commerce-hub-connect-api.service';

type PaymentSdkEventType = 'success' | 'failure' | 'cancel' | 'error' | string;

type PaymentSdkEvent = {
  type?: PaymentSdkEventType;
  payload?: unknown;
  [key: string]: unknown;
};

type PaymentSdkInitConfiguration = {
  apiKey: string;
  accessToken: string;
  configId: string;
  containerId: string;
  onEvent: (event: PaymentSdkEvent) => void;
  environment?: string;
  locale?: string;
  aggregatorSessionId?: string;
  publicKey?: string;
  pToken?: string;
};

declare global {
  interface Window {
    PaymentSDK?: {
      init: (configuration: PaymentSdkInitConfiguration) => void;
      destroy?: () => void;
    };
  }
}

const DEFAULT_ALLOWED_TENDERS: CommerceHubTenderType[] = [
  'CARD',
  'BANK_ACCOUNT',
];

const DEFAULT_BANK_LINK_OPTIONS = {
  apiKey: 'YqIvg89urE1WsAdgWwM1EiQTRM1ajSYCaLhnDvimvmHeB78A',
  configId: 'cce84049-0940-4926-9a54-9eaca0c09830',
  environment: 'qa',
  locale: 'en-US',
  paymentSdkUrl: 'https://connect-qa.fiservapis.com/pbb/sdk/web/v2/js/PaymentSDK.js',
  useSandbox: false,
} satisfies Required<
  Pick<
    CommerceHubPayByBankOptions,
    'apiKey' | 'configId' | 'environment' | 'locale' | 'paymentSdkUrl' | 'useSandbox'
  >
>;

type CreateSourceResponse = PaymentSource | { id?: string; sourceId?: string; paymentSourceId?: string } | string | null;

@Injectable()
export class CommerceHubConnectSdkService {
  private readonly api = inject(CommerceHubConnectApiService);

  private readonly sdkConfiguration = signal<ResolvedCommerceHubSdkConfiguration | null>(null);
  private readonly interactionState = signal<InteractionResponse | null>(null);
  private readonly otpDeliveryResponseState = signal<OTPResponse | null>(null);
  private readonly selectedTender = signal<CommerceHubTenderType>('CARD');
  private readonly loadingState = signal(false);
  private readonly submittingState = signal(false);
  private readonly bankLinkLoadingState = signal(false);
  private readonly lastErrorState = signal<CommerceHubSdkError | null>(null);

  readonly interaction = this.interactionState.asReadonly();
  readonly otpDeliveryResponse = this.otpDeliveryResponseState.asReadonly();
  readonly loading = this.loadingState.asReadonly();
  readonly submitting = this.submittingState.asReadonly();
  readonly bankLinkLoading = this.bankLinkLoadingState.asReadonly();
  readonly lastError = this.lastErrorState.asReadonly();
  readonly selectedTenderType = this.selectedTender.asReadonly();
  readonly supportedTenderTypes = computed(() => {
    const configured = this.sdkConfiguration()?.allowedTenderTypes ?? DEFAULT_ALLOWED_TENDERS;
    const interactionAllowed = this.interactionState()?.allowedTenderTypes ?? configured;
    const filtered = interactionAllowed.filter(isSupportedTenderType);

    return filtered.length ? filtered : configured;
  });
  readonly currentStep = computed<CommerceHubSdkFlowStep>(() => {
    const status = this.interactionState()?.status;

    switch (status) {
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
  });

  initialize(configuration: CommerceHubSdkConfiguration): Promise<InteractionResponse> {
    const resolved = this.resolveConfiguration(configuration);

    this.sdkConfiguration.set(resolved);
    this.lastErrorState.set(null);
    this.interactionState.set(null);
    this.otpDeliveryResponseState.set(null);
    this.loadingState.set(true);
    this.selectedTender.set(resolved.allowedTenderTypes[0] ?? 'CARD');
    this.api.setInteractionId(null);

    return firstValueFrom(
      this.api
        .createInteraction(this.toInteractionRequest(resolved))
        .pipe(
          tap((interaction) => this.commitInteraction(interaction)),
          finalize(() => this.loadingState.set(false)),
          catchError((error) => this.failWith('session', error)),
        ),
    );
  }

  sendOtp(email: string, mode: 'default' | 'email' = 'default'): Promise<InteractionResponse> {
    const interactionId = this.requireInteractionId();
    const payload: StringHolder = { value: email };

    this.submittingState.set(true);
    this.lastErrorState.set(null);

    return firstValueFrom(
      (mode === 'email'
        ? this.api.sendInteractionOtpToEmail(interactionId, payload)
        : this.api.sendInteractionOtp(interactionId, payload)
      ).pipe(
        tap((interaction) => this.commitInteraction(interaction)),
        finalize(() => this.submittingState.set(false)),
        catchError((error) => this.failWith('otp_send', error)),
      ),
    );
  }

  validateOtp(request: OtpValidateRequest): Observable<InteractionResponse> {
    const interactionId = this.requireInteractionId();

    this.submittingState.set(true);
    this.lastErrorState.set(null);

    return this.api.validateInteractionOtp(interactionId, request).pipe(
      tap((interaction) => this.commitInteraction(interaction)),
      finalize(() => this.submittingState.set(false)),
      catchError((error) => this.failWith('otp_validate', error)),
    );
  }

  submitCardSource(cardSource: Omit<CardSource, 'tenderType'>): Promise<CommerceHubSuccessResult> {
    const payload: CardSource = {
      ...cardSource,
      tenderType: 'CARD',
      card: {
        ...cardSource.card,
        network: cardSource.card.network ?? this.detectCardNetwork(cardSource.card.cardNumber),
      },
    };

    this.submittingState.set(true);
    this.lastErrorState.set(null);

    return firstValueFrom(
      this.createSource(payload).pipe(
        finalize(() => this.submittingState.set(false)),
        catchError((error) => this.failWith('payment_source', error)),
      ),
    );
  }

  attachExistingPaymentSource(source: PaymentSource): Promise<CommerceHubSuccessResult> {
    const paymentSourceId = source.id?.trim();

    if (!paymentSourceId) {
      const error = this.toSdkError('payment_source', 'Selected payment source does not have an id.');
      this.lastErrorState.set(error);
      this.sdkConfiguration()?.onError(error);
      return Promise.reject(error);
    }

    this.submittingState.set(true);
    this.lastErrorState.set(null);

    return firstValueFrom(
      this.attachPaymentSource(paymentSourceId).pipe(
        map((interaction) => ({
          interaction,
          paymentSourceId,
          paymentSource: source,
          tenderType: source.tenderType,
        })),
        tap((result) => this.sdkConfiguration()?.onSuccess(result)),
        finalize(() => this.submittingState.set(false)),
        catchError((error) => this.failWith('payment_source', error)),
      ),
    );
  }

  getInteraction(): Promise<InteractionResponse> {
    const interactionId = this.requireInteractionId();

    return firstValueFrom(
      this.api.getInteractionStatus(interactionId).pipe(
        tap((interaction) => this.commitInteraction(interaction)),
        catchError((error) => this.failWith('interaction', error)),
      ),
    );
  }

  addPaymentSource(source: PaymentSource): Observable<CreateSourceResponse> {
    return this.api.addSource(source);
  }

  updatePaymentSource(source: PaymentSource): Observable<void> {
    return this.api.updateSource(source);
  }

  addSource(source: PaymentSource): Observable<string> {
    return this.api.addSource(source);
  }

  updateSource(source: PaymentSource): Observable<void> {
    return this.api.updateSource(source);
  }

  getPaymentSource(sourceId: string): Observable<unknown> {
    return this.api.getCustomerProfile().pipe(
      map(
        (profile) =>
          profile.sources?.find((source) => source.id === sourceId) ??
          (profile.defaultSource?.id === sourceId ? profile.defaultSource : null),
      ),
    );
  }

  sendOtpToEmail(email: string): Promise<InteractionResponse> {
    return this.sendOtp(email, 'email');
  }

  deleteSource(sourceId: string): Observable<void> {
    return this.api.deleteSource(sourceId);
  }

  addShippingAddress(address: Address): Observable<void> {
    return this.api.addShippingAddress(address);
  }

  updateShippingAddress(id: string, address: Address): Observable<void> {
    return this.api.updateShippingAddress(id, address);
  }

  deleteShippingAddress(id: string): Observable<void> {
    return this.api.deleteShippingAddress(id);
  }

  addBillingAddress(address: Address): Observable<void> {
    return this.api.addBillingAddress(address);
  }

  updateBillingAddress(id: string, address: Address): Observable<void> {
    return this.api.updateBillingAddress(id, address);
  }

  deleteBillingAddress(id: string): Observable<void> {
    return this.api.deleteBillingAddress(id);
  }

  validateOpenOtp(userAgent: string, request: OtpValidateRequest): Observable<void> {
    return this.api.validateOpenOtp(request);
  }

  authenticate(request: StringHolder): Observable<OTPResponse> {
    return this.api.authenticate(request);
  }

  authenticateEmailOnly(request: StringHolder): Observable<OTPResponse> {
    return this.api.authenticateEmailOnly(request);
  }

  consumeMerchantToken(
    tokenId: string,
    request: ConsumeTokenRequest,
  ): Observable<MachinePaymentResponse> {
    return this.api.consumeMerchantToken(tokenId, request);
  }

  submitPayment(request: InteractionCompletionRequest): Observable<void> {
    return this.api.submitPayment(request);
  }

  createInteraction(request: InteractionRequest): Observable<InteractionResponse> {
    return this.api.createInteraction(request);
  }

  attachPaymentMethod(
    interactionId: string,
    paymentSourceId: string,
  ): Observable<InteractionResponse> {
    return this.api.attachPaymentMethod(interactionId, paymentSourceId);
  }

  sendInteractionOtp(interactionId: string, request: StringHolder): Observable<InteractionResponse> {
    return this.api.sendInteractionOtp(interactionId, request);
  }

  sendInteractionOtpToEmail(
    interactionId: string,
    request: StringHolder,
  ): Observable<InteractionResponse> {
    return this.api.sendInteractionOtpToEmail(interactionId, request);
  }

  updatePhone(phoneDetails: PhoneDetails): Observable<void> {
    return this.api.updatePhone(phoneDetails);
  }

  verifyPhoneOtp(request: StringHolder): Observable<void> {
    return this.api.verifyPhoneOtp(request);
  }

  updateName(request: StringHolder): Observable<void> {
    return this.api.updateName(request);
  }

  mask(type: string, request: StringHolder): Observable<StringHolder> {
    return this.api.mask(type, request);
  }

  searchCustomerActivity(request: PaymentsSearchRequest): Observable<Payment[]> {
    return this.api.searchCustomerActivity(request);
  }

  createAgentToken(request: CreateTokenRequest): Observable<CreateTokenResponse> {
    return this.api.createAgentToken(request);
  }

  consumeAgentMerchantToken(
    tokenId: string,
    request: StringHolder,
  ): Observable<MachinePaymentResponse> {
    return this.api.consumeAgentMerchantToken(tokenId, request);
  }

  cancelAgentMerchantToken(
    tokenId: string,
    request: StringHolder,
  ): Observable<MachinePaymentResponse> {
    return this.api.cancelAgentMerchantToken(tokenId, request);
  }

  getInteractionStatus(interactionId: string): Observable<InteractionResponse> {
    return this.api.getInteractionStatus(interactionId);
  }

  getCustomerProfile(): Observable<Profile> {
    return this.api.getCustomerProfile();
  }

  setMachinePaymentsEnabled(enable: boolean): Observable<void> {
    return this.api.setMachinePaymentsEnabled(enable);
  }

  cancelMerchantToken(tokenId: string): Observable<MachinePaymentResponse> {
    return this.api.cancelMerchantToken(tokenId);
  }

  async launchPayByBank(mountElementId: string): Promise<CommerceHubSuccessResult> {
    const configuration = this.sdkConfiguration();
    if (!configuration) {
      const error = this.toSdkError('pay_by_bank', {
        message: 'No SDK configuration is available for Pay by Bank.',
      });
      this.lastErrorState.set(error);
      this.sdkConfiguration()?.onError(error);
      throw error;
    }

    const payByBank = this.resolvePayByBankOptions(configuration.payByBank);
    this.bankLinkLoadingState.set(true);
    this.lastErrorState.set(null);

    try {
      const existingBankSourceIds = await this.getExistingBankSourceIds();
      const session = await firstValueFrom(this.api.createPayByBankSession());
      let { aggregatorSessionId, accessToken, pToken, publicKey } = this.resolvePayByBankSession(session);

      await this.loadPaymentSdkScript(payByBank.paymentSdkUrl);

      const paymentSdk = window.PaymentSDK;
      if (!paymentSdk?.init) {
        throw new Error('PaymentSDK.js loaded but PaymentSDK.init is not available on window.');
      }

      return await new Promise<CommerceHubSuccessResult>((resolve, reject) => {
        let settled = false;

        this.destroyPaymentSdk();
        paymentSdk.init({
          apiKey: payByBank.apiKey,
          accessToken,
          configId: payByBank.configId,
          environment: payByBank.environment,
          locale: payByBank.locale,
          publicKey: publicKey,
          pToken: pToken,
          containerId: mountElementId,
          ...(aggregatorSessionId ? { aggregatorSessionId } : {}),
          onEvent: async (event) => {
            if (settled || !this.isTerminalPaymentSdkEvent(event)) {
              return;
            }

            this.destroyPaymentSdk();

            if (event.type !== 'success') {
              settled = true;
              const sdkError = this.toSdkError(
                'pay_by_bank',
                this.describePaymentSdkTerminalEvent(event),
              );
              this.lastErrorState.set(sdkError);
              configuration.onError(sdkError);
              reject(sdkError);
              return;
            }

            try {
              await firstValueFrom(this.api.finalizePayByBankSession(aggregatorSessionId, pToken));
              const profile = await firstValueFrom(this.api.getCustomerProfile());
              const bankSource = this.resolveAttachedBankSource(profile, existingBankSourceIds);
              const paymentSourceId = bankSource.id?.trim();

              if (!paymentSourceId) {
                throw new Error('Pay by Bank completed but no bank payment source was returned by /customer.');
              }

              await firstValueFrom(this.attachPaymentSource(paymentSourceId));
              const result = this.buildAttachedSourceResult(paymentSourceId, bankSource, event);
              this.sdkConfiguration()?.onSuccess(result);
              settled = true;
              resolve(result);
            } catch (error) {
              const sdkError = this.toSdkError('pay_by_bank', error);
              this.lastErrorState.set(sdkError);
              configuration.onError(sdkError);
              settled = true;
              reject(sdkError);
            }
          },
        });
      });
    } catch (error) {
      this.destroyPaymentSdk();
      const sdkError = this.toSdkError('pay_by_bank', error);
      this.lastErrorState.set(sdkError);
      configuration.onError(sdkError);
      throw sdkError;
    } finally {
      this.bankLinkLoadingState.set(false);
    }
  }

  selectTenderType(tenderType: CommerceHubTenderType): void {
    this.selectedTender.set(tenderType);
  }

  private createSource(source: PaymentSource): Observable<CommerceHubSuccessResult> {
    const sourceWithId = source.id?.trim()
      ? source
      : ({
          ...source,
          id: this.createSourceId(),
        } satisfies PaymentSource);

    return this.addPaymentSource(sourceWithId).pipe(
      map((response) => {
        const paymentSourceId = this.extractSourceId(response) ?? sourceWithId.id;

        if (!paymentSourceId) {
          throw new Error('Payment source creation completed without returning a source id.');
        }

        return paymentSourceId;
      }),
      switchMap((paymentSourceId) => {
        const createdSource = {
          ...sourceWithId,
          id: paymentSourceId,
        } as PaymentSource;
        return this.attachPaymentSource(paymentSourceId).pipe(
          map(() => this.buildAttachedSourceResult(paymentSourceId, createdSource)),
        );
      }),
      tap((result) => this.sdkConfiguration()?.onSuccess(result)),
    );
  }

  private attachPaymentSource(
    paymentSourceId: string,
  ): Observable<InteractionResponse> {
    const interactionId = this.requireInteractionId();

    return this.api
      .attachPaymentMethod(interactionId, paymentSourceId)
      .pipe(tap((interaction) => this.commitInteraction(interaction)));
  }

  private commitInteraction(interaction: InteractionResponse): void {
    this.interactionState.set(interaction);
    this.api.setInteractionId(interaction.interactionId ?? null);

    const selected = interaction.selectedSource?.tenderType ?? this.selectedTender();
    const supported = interaction.allowedTenderTypes?.length
      ? interaction.allowedTenderTypes
      : this.supportedTenderTypes();

    this.selectedTender.set(supported.includes(selected) ? selected : supported[0] ?? 'CARD');
  }

  private upsertInteractionSource(source: PaymentSource): InteractionResponse | null {
    const currentInteraction = this.interactionState();

    if (!currentInteraction) {
      return null;
    }

    const paymentSources = currentInteraction.paymentSources ?? [];
    const nextPaymentSources = paymentSources.some((existingSource) => existingSource.id === source.id)
      ? paymentSources.map((existingSource) => (existingSource.id === source.id ? source : existingSource))
      : [source, ...paymentSources];

    const nextInteraction: InteractionResponse = {
      ...currentInteraction,
      paymentSources: nextPaymentSources,
      selectedSource: source,
    };

    this.commitInteraction(nextInteraction);

    return nextInteraction;
  }

  private buildAttachedSourceResult(
    paymentSourceId: string,
    fallbackSource?: PaymentSource,
    bankLinkResponse?: unknown,
  ): CommerceHubSuccessResult {
    const interactionSource =
      this.interactionState()?.paymentSources?.find((source) => source.id === paymentSourceId) ??
      (this.interactionState()?.selectedSource?.id === paymentSourceId
        ? this.interactionState()?.selectedSource
        : undefined) ??
      fallbackSource;

    const interaction = interactionSource ? this.upsertInteractionSource(interactionSource) : this.interactionState();

    return {
      interaction: interaction ?? null,
      paymentSourceId,
      paymentSource: interactionSource,
      tenderType: interactionSource?.tenderType,
      bankLinkResponse,
    };
  }

  private async getExistingBankSourceIds(): Promise<Set<string>> {
    try {
      const profile = await firstValueFrom(this.api.getCustomerProfile());

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

  private loadPaymentSdkScript(scriptUrl: string): Promise<void> {
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${scriptUrl}"]`);
    if (existing) {
      return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = scriptUrl;
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error(`Unable to load Pay by Bank script: ${scriptUrl}`));
      document.head.appendChild(script);
    });
  }

  private destroyPaymentSdk(): void {
    try {
      window.PaymentSDK?.destroy?.();
    } catch {
      // Ignore destroy failures so the next init can still proceed.
    }
  }

  private toInteractionRequest(configuration: ResolvedCommerceHubSdkConfiguration): InteractionRequest {
    return {
      sessionReferenceId: configuration.sessionReferenceId,
      merchantTransactionId: configuration.merchantTransactionId,
      merchantOrderId: configuration.merchantOrderId,
      merchantInvoiceNumber: configuration.merchantInvoiceNumber,
      authType: configuration.authType,
      expiryMinutes: configuration.expiryMinutes,
      ...(configuration.email?.trim() ? { email: configuration.email.trim() } : {}),
      allowedTenderTypes: configuration.allowedTenderTypes,
      allowEmailChange: configuration.allowEmailChange,
    };
  }

  private resolveConfiguration(
    configuration: CommerceHubSdkConfiguration,
  ): ResolvedCommerceHubSdkConfiguration {
    return {
      ...configuration,
      region: configuration.region ?? 'US',
      language: configuration.language ?? 'en_US',
      allowedTenderTypes:
        configuration.allowedTenderTypes?.filter(isSupportedTenderType).length
          ? configuration.allowedTenderTypes.filter(isSupportedTenderType)
          : DEFAULT_ALLOWED_TENDERS,
    };
  }

  private resolvePayByBankOptions(
    options?: CommerceHubPayByBankOptions,
  ): Required<
    Pick<
      CommerceHubPayByBankOptions,
      'apiKey' | 'configId' | 'environment' | 'locale' | 'paymentSdkUrl' | 'useSandbox'
    >
  > &
    CommerceHubPayByBankOptions {
    void options;

    return {
      ...DEFAULT_BANK_LINK_OPTIONS,
    };
  }

  private resolvePayByBankSession(session: PayByBankSessionResponse): {
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
      publicKey
    };
  }

  private detectCardNetwork(cardNumber: string): CardNetwork | undefined {
    const digits = cardNumber.replace(/\D/g, '');

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
  }

  private extractSourceId(response: unknown): string | undefined {
    if (!response) {
      return undefined;
    }

    if (typeof response === 'string') {
      return response;
    }

    if (typeof response !== 'object') {
      return undefined;
    }

    const record = response as Record<string, unknown>;
    const candidate =
      record['paymentSourceId'] ??
      record['sourceId'] ??
      record['id'] ??
      (typeof record['data'] === 'object' ? (record['data'] as Record<string, unknown>)['id'] : undefined);

    return typeof candidate === 'string' ? candidate : undefined;
  }

  private extractAldSessionId(response: unknown): string | undefined {
    const directKeys = [
      'aldSessionId',
      'ald_session_id',
      'aldSession',
      'ald_session',
      'sessionId',
      'session_id',
      'sid',
      'token',
    ];

    return this.findNestedStringValue(response, directKeys);
  }

  private isTerminalPaymentSdkEvent(event: PaymentSdkEvent | undefined): boolean {
    return ['success', 'failure', 'cancel', 'error'].includes(event?.type ?? '');
  }

  private describePaymentSdkTerminalEvent(event: PaymentSdkEvent): string {
    const eventType = event.type?.trim() || 'unknown';
    const eventMessage =
      this.findNestedStringValue(event, [
        'message',
        'description',
        'transactionStatusDescription',
        'responseVerbiage',
        'errorMessage',
      ]) ?? `PaymentSDK returned a terminal "${eventType}" event.`;

    return eventMessage;
  }

  private findNestedStringValue(
    value: unknown,
    keys: readonly string[],
    visited = new Set<unknown>(),
  ): string | undefined {
    if (!value) {
      return undefined;
    }

    if (typeof value !== 'object' || visited.has(value)) {
      return undefined;
    }

    visited.add(value);
    const record = value as Record<string, unknown>;

    for (const key of keys) {
      const candidate = record[key];
      if (typeof candidate === 'string' && candidate.trim()) {
        return candidate.trim();
      }
    }

    for (const candidate of Object.values(record)) {
      if (typeof candidate !== 'object' || !candidate) {
        continue;
      }

      const nested = this.findNestedStringValue(candidate, keys, visited);
      if (nested) {
        return nested;
      }
    }

    return undefined;
  }

  private resolveAttachedBankSource(
    profile: Profile,
    existingBankSourceIds: ReadonlySet<string>,
  ): PaymentSource {
    const sources = profile.sources ?? [];
    const bankSources = sources.filter(
      (source): source is PaymentSource => source.tenderType === 'BANK_ACCOUNT',
    );

    const newBankSource = bankSources.find((source) => {
      const sourceId = source.id?.trim();
      return sourceId ? !existingBankSourceIds.has(sourceId) : false;
    });
    if (newBankSource) {
      return newBankSource;
    }

    if (profile.defaultSource?.tenderType === 'BANK_ACCOUNT') {
      return profile.defaultSource;
    }

    const selectedSource = this.interactionState()?.selectedSource;
    if (selectedSource?.tenderType === 'BANK_ACCOUNT') {
      const selectedSourceId = selectedSource.id?.trim();
      const refreshedSelectedSource = bankSources.find((source) => source.id?.trim() === selectedSourceId);
      if (refreshedSelectedSource) {
        return refreshedSelectedSource;
      }
    }

    const firstBankSource = bankSources[0];
    if (firstBankSource) {
      return firstBankSource;
    }

    throw new Error('Pay by Bank completed but no bank payment source is available in /customer.');
  }

  private requireInteractionId(): string {
    const interactionId = this.interactionState()?.interactionId;

    if (!interactionId) {
      throw this.toSdkError('interaction', 'No interaction has been created yet.');
    }

    return interactionId;
  }

  private createSourceId(): string {
    const generatedId = globalThis.crypto?.randomUUID?.();

    if (generatedId) {
      return generatedId;
    }

    return `src_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
  }

  private failWith(stage: CommerceHubErrorStage, error: unknown): Observable<never> {
    const sdkError = this.toSdkError(stage, error);
    this.lastErrorState.set(sdkError);
    this.sdkConfiguration()?.onError(sdkError);

    return throwError(() => sdkError);
  }

  private toSdkError(stage: CommerceHubErrorStage, error: unknown): CommerceHubSdkError {
    if (typeof error === 'string') {
      return {
        stage,
        message: error,
      };
    }

    if (error instanceof HttpErrorResponse) {
      return {
        stage,
        status: error.status,
        message:
          typeof error.error === 'string'
            ? error.error
            : error.error?.message ?? error.message ?? 'Unexpected API error.',
        cause: error,
      };
    }

    if (error instanceof Error) {
      return {
        stage,
        message: error.message,
        cause: error,
      };
    }

    if (typeof error === 'object' && error) {
      const record = error as Record<string, unknown>;

      return {
        stage,
        status: typeof record['status'] === 'number' ? record['status'] : undefined,
        message:
          typeof record['message'] === 'string'
            ? record['message']
            : 'Unexpected SDK error.',
        cause: error,
      };
    }

    return {
      stage,
      message: 'Unexpected SDK error.',
      cause: error,
    };
  }
}

function isSupportedTenderType(value: string): value is CommerceHubTenderType {
  return value === 'CARD' || value === 'BANK_ACCOUNT';
}
