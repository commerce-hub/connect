import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { firstValueFrom, Observable, of, throwError } from 'rxjs';
import { catchError, finalize, map, switchMap, tap } from 'rxjs/operators';

import {
  BankAccountSource,
  CardNetwork,
  CardSource,
  CommerceHubTenderType,
  InteractionRequest,
  InteractionResponse,
  OtpValidateRequest,
  PaymentSource,
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
import {
  CommerceHubPciVaultService,
  VaultedCardPayload,
} from './commerce-hub-pci-vault.service';

declare global {
  interface Window {
    CPSDK?: (
      apiKey: string,
      sandbox?: boolean,
    ) => {
      BankLink: (
          configuration: { accessToken: string; configId: string; encryptionKey: string; aggregatorKey: string; debug: boolean },
          options: Record<string, unknown>,
          callback: (response: unknown) => void,
      ) => { start: (mountElementId: string) => void };
    };
  }
}

const DEFAULT_ALLOWED_TENDERS: CommerceHubTenderType[] = [
  'CARD',
  'BANK_ACCOUNT',
  'DYNAMIC_SESSION_CARD',
];

const DEFAULT_BANK_LINK_OPTIONS = {
  apiKey: 'YqIvg89urE1WsAdgWwM1EiQTRM1ajSYCaLhnDvimvmHeB78A',
  configId: '864b884d-b03d-4af7-8bda-f0e9c343df11',
  paymentSdkUrl: 'https://connect-qa.fiservapis.com/pbb/sdk/web/v1/js/PaymentSDK.js',
  useSandbox: false,
} satisfies Required<Pick<CommerceHubPayByBankOptions, 'apiKey' | 'configId' | 'paymentSdkUrl' | 'useSandbox'>>;

type CreateSourceResponse = PaymentSource | { id?: string; sourceId?: string; paymentSourceId?: string } | string | null;

@Injectable()
export class CommerceHubConnectSdkService {
  private readonly http = inject(HttpClient);
  private readonly vault = inject(CommerceHubPciVaultService);

  private readonly baseUrl = '/api';
  private readonly sdkConfiguration = signal<ResolvedCommerceHubSdkConfiguration | null>(null);
  private readonly interactionState = signal<InteractionResponse | null>(null);
  private readonly selectedTender = signal<CommerceHubTenderType>('CARD');
  private readonly loadingState = signal(false);
  private readonly submittingState = signal(false);
  private readonly bankLinkLoadingState = signal(false);
  private readonly lastErrorState = signal<CommerceHubSdkError | null>(null);

  readonly interaction = this.interactionState.asReadonly();
  readonly loading = this.loadingState.asReadonly();
  readonly submitting = this.submittingState.asReadonly();
  readonly bankLinkLoading = this.bankLinkLoadingState.asReadonly();
  readonly lastError = this.lastErrorState.asReadonly();
  readonly selectedTenderType = this.selectedTender.asReadonly();
  readonly supportedTenderTypes = computed(() => {
    const configured = this.sdkConfiguration()?.allowedTenderTypes ?? DEFAULT_ALLOWED_TENDERS;
    const interactionAllowed = this.interactionState()?.allowedTenderTypes ?? configured;

    return interactionAllowed.length ? interactionAllowed : configured;
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
    this.loadingState.set(true);
    this.selectedTender.set(resolved.allowedTenderTypes[0] ?? 'CARD');

    return firstValueFrom(
      this.http
        .post<InteractionResponse>(
          `${this.baseUrl}/session/interaction/create`,
          this.toInteractionRequest(resolved),
        )
        .pipe(
          tap((interaction) => this.commitInteraction(interaction)),
          finalize(() => this.loadingState.set(false)),
          catchError((error) => this.failWith('session', error)),
        ),
    );
  }

  sendOtp(email: string): Promise<InteractionResponse> {
    const interactionId = this.requireInteractionId();
    const payload: StringHolder = { value: email };

    this.submittingState.set(true);
    this.lastErrorState.set(null);

    return firstValueFrom(
      this.http.post<InteractionResponse>(`${this.baseUrl}/interaction/${interactionId}/otp/send`, payload).pipe(
        tap((interaction) => this.commitInteraction(interaction)),
        finalize(() => this.submittingState.set(false)),
        catchError((error) => this.failWith('otp_send', error)),
      ),
    );
  }

  validateOtp(request: OtpValidateRequest): Promise<InteractionResponse> {
    const interactionId = this.requireInteractionId();

    this.submittingState.set(true);
    this.lastErrorState.set(null);

    return firstValueFrom(
      this.http
        .post<InteractionResponse>(
          `${this.baseUrl}/interaction/${interactionId}/otp/validate`,
          request,
        )
        .pipe(
          tap((interaction) => this.commitInteraction(interaction)),
          finalize(() => this.submittingState.set(false)),
          catchError((error) => this.failWith('otp_validate', error)),
        ),
    );
  }

  submitCardSource(cardSource: Omit<CardSource, 'tenderType'>): Promise<CommerceHubSuccessResult> {
    const payload: CardSource = {
      ...cardSource,
      tenderType: 'CARD',
      card: {
        ...cardSource.card,
        network: this.detectCardNetwork(cardSource.card.cardNumber),
      },
    };

    this.submittingState.set(true);
    this.lastErrorState.set(null);

    return firstValueFrom(
      this.vault.secureCardData(payload.card).pipe(
        switchMap((vaultResult) =>
          this.createAndAttachSource(payload).pipe(
            map((result) => ({
              ...result,
              vaultReference: vaultResult.vaultReference,
            })),
          ),
        ),
        finalize(() => this.submittingState.set(false)),
        catchError((error) => this.failWith('payment_source', error)),
      ),
    );
  }

  submitBankAccountSource(source: Omit<BankAccountSource, 'tenderType'>): Promise<CommerceHubSuccessResult> {
    const payload: BankAccountSource = {
      ...source,
      tenderType: 'BANK_ACCOUNT',
    };

    this.submittingState.set(true);
    this.lastErrorState.set(null);

    return firstValueFrom(
      this.createAndAttachSource(payload).pipe(
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
      this.http.get<InteractionResponse>(`${this.baseUrl}/interaction/${interactionId}`).pipe(
        tap((interaction) => this.commitInteraction(interaction)),
        catchError((error) => this.failWith('interaction', error)),
      ),
    );
  }

  addPaymentSource(source: PaymentSource): Observable<CreateSourceResponse> {
    return this.http.post<CreateSourceResponse>(`${this.baseUrl}/customer/source`, source);
  }

  updatePaymentSource(source: PaymentSource): Observable<unknown> {
    return this.http.put(`${this.baseUrl}/customer/source`, source);
  }

  getPaymentSource(sourceId: string): Observable<unknown> {
    return this.http.get(`${this.baseUrl}/customer/source/${sourceId}`);
  }

  async launchPayByBank(mountElementId: string): Promise<void> {
    const configuration = this.sdkConfiguration();
    const payByBank = this.resolvePayByBankOptions(configuration?.payByBank);

    if (!configuration || !payByBank.accessToken || !payByBank.encryptionKey) {
      const error = this.toSdkError('pay_by_bank', {
        message:
          'Pay by bank requires accessToken and encryptionKey to be supplied in configuration.payByBank.',
      });
      this.lastErrorState.set(error);
      configuration?.onError(error);
      throw error;
    }

    this.bankLinkLoadingState.set(true);
    this.lastErrorState.set(null);

    try {
      const aggregatorKey =
        payByBank.aggregatorKey ??
        (await firstValueFrom(this.http.get(`${this.baseUrl}/pbb/session`, { responseType: 'text' })));

      await this.loadBankLinkScript(payByBank.paymentSdkUrl);

      const cpSdk = window.CPSDK?.(payByBank.apiKey, payByBank.useSandbox);
      if (!cpSdk) {
        throw new Error('PaymentSDK.js loaded but CPSDK is not available on window.');
      }

      const bankLink = cpSdk.BankLink(
        {
          accessToken: payByBank.accessToken,
          configId: payByBank.configId,
          encryptionKey: payByBank.encryptionKey,
          aggregatorKey,
          debug: true
        },
        {},
        (response) => {
          const currentInteraction = this.interactionState();
          const responseId = this.extractSourceId(response);

          if (responseId && currentInteraction?.interactionId) {
            void firstValueFrom(this.attachPaymentSource(responseId, response).pipe(catchError(() => of(null))));
          }

          configuration.onSuccess({
            interaction: currentInteraction,
            tenderType: 'DYNAMIC_SESSION_CARD',
            paymentSourceId: responseId,
            bankLinkResponse: response,
          });
        },
      );

      bankLink.start(mountElementId);
    } catch (error) {
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

  private createAndAttachSource(source: PaymentSource): Observable<CommerceHubSuccessResult> {
    return this.addPaymentSource(source).pipe(
      map((response) => {
        const paymentSourceId = this.extractSourceId(response) ?? source.id;

        if (!paymentSourceId) {
          throw new Error('Payment source creation completed without returning a source id.');
        }

        return paymentSourceId;
      }),
      switchMap((paymentSourceId) =>
        this.attachPaymentSource(paymentSourceId, source).pipe(
          map((interaction) => ({
            interaction,
            paymentSourceId,
            paymentSource: source,
            tenderType: source.tenderType,
          })),
        ),
      ),
      tap((result) => this.sdkConfiguration()?.onSuccess(result)),
    );
  }

  private attachPaymentSource(
    paymentSourceId: string,
    payload?: unknown,
  ): Observable<InteractionResponse> {
    const interactionId = this.requireInteractionId();

    return this.http
      .post<InteractionResponse>(
        `${this.baseUrl}/interaction/${interactionId}/payment-source/${paymentSourceId}/attach`,
        payload ?? {},
      )
      .pipe(tap((interaction) => this.commitInteraction(interaction)));
  }

  private commitInteraction(interaction: InteractionResponse): void {
    this.interactionState.set(interaction);

    const selected = interaction.selectedSource?.tenderType ?? this.selectedTender();
    const supported = interaction.allowedTenderTypes?.length
      ? interaction.allowedTenderTypes
      : this.supportedTenderTypes();

    this.selectedTender.set(supported.includes(selected) ? selected : supported[0] ?? 'CARD');
  }

  private loadBankLinkScript(scriptUrl: string): Promise<void> {
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

  private toInteractionRequest(configuration: ResolvedCommerceHubSdkConfiguration): InteractionRequest {
    return {
      sessionReferenceId: configuration.sessionReferenceId,
      merchantTransactionId: configuration.merchantTransactionId,
      merchantOrderId: configuration.merchantOrderId,
      merchantInvoiceNumber: configuration.merchantInvoiceNumber,
      authType: configuration.authType,
      expiryMinutes: configuration.expiryMinutes,
      email: configuration.email || "",
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
        configuration.allowedTenderTypes?.length
          ? configuration.allowedTenderTypes
          : DEFAULT_ALLOWED_TENDERS,
    };
  }

  private resolvePayByBankOptions(
    options?: CommerceHubPayByBankOptions,
  ): Required<
    Pick<
      CommerceHubPayByBankOptions,
      'apiKey' | 'configId' | 'paymentSdkUrl' | 'useSandbox'
    >
  > &
    CommerceHubPayByBankOptions {
    return {
      ...DEFAULT_BANK_LINK_OPTIONS,
      ...options,
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

  private requireInteractionId(): string {
    const interactionId = this.interactionState()?.interactionId;

    if (!interactionId) {
      throw this.toSdkError('interaction', 'No interaction has been created yet.');
    }

    return interactionId;
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
