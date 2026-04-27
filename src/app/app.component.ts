import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { firstValueFrom } from 'rxjs';

import {
  CommerceHubAuthType,
  CommerceHubConnectApiService,
  CommerceHubConnectCaptureComponent,
  CommerceHubPayByBankOptions,
  CommerceHubSdkConfiguration,
  CommerceHubSdkError,
  CommerceHubSuccessResult,
  CommerceHubTenderType,
  CommerceHubWhiteLabelOptions,
  InteractionRequest,
  InteractionResponse,
} from 'commerce-hub-connect-sdk';

@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    CheckboxModule,
    InputTextModule,
    SelectModule,
    CommerceHubConnectCaptureComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  private readonly api = inject(CommerceHubConnectApiService);
  private readonly formBuilder = inject(FormBuilder);

  protected readonly events = signal<string[]>([]);
  protected readonly activeInteraction = signal<InteractionResponse | null>(null);
  protected readonly activeConfiguration = signal<CommerceHubSdkConfiguration | null>(null);
  protected readonly activeWhiteLabel = signal<CommerceHubWhiteLabelOptions | null>(null);
  protected readonly authTypeOptions = [
    { label: 'Final sale', value: 'FINAL_SALE' as CommerceHubAuthType },
    { label: 'Authorize only', value: 'AUTH_ONLY' as CommerceHubAuthType },
  ];

  protected readonly demoForm = this.formBuilder.nonNullable.group({
    sessionReferenceId: ['sdk-demo-session-20260421'],
    merchantId: ['100014000315473'],
    terminalId: ['10000001'],
    clientId: ['laika'],
    email: ['gregory.jablonski@fiserv.com'],
    paymentSelectionTitle: [''],
    paymentSelectionConfirmLabel: [''],
    merchantTransactionId: ['txn-10001'],
    merchantOrderId: ['order-20002'],
    merchantInvoiceNumber: ['invoice-30003'],
    authType: ['FINAL_SALE' as CommerceHubAuthType],
    expiryMinutes: [10],
    allowEmailChange: [true],
    wallet: [true],
    allowCard: [true],
    allowBankAccount: [true],
    primaryColor: ['#0a5dff'],
    secondaryColor: ['#627d98'],
    textColor: ['#0f172a'],
    fontFamily: ['"Open Sans", "Segoe UI", sans-serif'],
    logoUrl: [''],
    payByBankApiKey: [''],
    payByBankConfigId: [''],
    payByBankPaymentSdkUrl: [''],
    payByBankEnvironment: [''],
    payByBankLocale: [''],
    payByBankAccessToken: [''],
    payByBankEncryptionKey: [''],
    payByBankAggregatorKey: [''],
    payByBankUseSandbox: [false],
  });

  protected async initializeSdk(): Promise<void> {
    const value = this.demoForm.getRawValue();
    const allowedTenderTypes = this.resolveAllowedTenderTypes(value.allowCard, value.allowBankAccount);
    const payByBank = this.buildPayByBankOptions(value);
    const request: InteractionRequest = {
      sessionReferenceId: this.requiredValue(value.sessionReferenceId, 'sdk-demo-session'),
      email: this.optionalValue(value.email),
      merchantTransactionId: this.optionalValue(value.merchantTransactionId),
      merchantOrderId: this.optionalValue(value.merchantOrderId),
      merchantInvoiceNumber: this.optionalValue(value.merchantInvoiceNumber),
      authType: value.authType,
      expiryMinutes: this.optionalNumber(value.expiryMinutes),
      allowEmailChange: value.allowEmailChange,
      allowedTenderTypes,
      merchantData: this.buildMerchantData(value),
      wallet: value.wallet,
    };
    const configuration: CommerceHubSdkConfiguration = {
      email: this.optionalValue(value.email),
      paymentSelectionTitle: this.optionalValue(value.paymentSelectionTitle),
      paymentSelectionConfirmLabel: this.optionalValue(value.paymentSelectionConfirmLabel),
      wallet: value.wallet,
      payByBank,
      onSuccess: (result: CommerceHubSuccessResult) => this.handleSuccess(result),
      onError: (error: CommerceHubSdkError) => this.handleError(error),
    };
    const whiteLabel: CommerceHubWhiteLabelOptions = {
      primaryColor: this.optionalValue(value.primaryColor),
      secondaryColor: this.optionalValue(value.secondaryColor),
      textColor: this.optionalValue(value.textColor),
      fontFamily: this.optionalValue(value.fontFamily),
      logoUrl: this.optionalValue(value.logoUrl),
    };

    this.events.update((current) => [
      `[CREATE] session=${request.sessionReferenceId} tenders=${allowedTenderTypes.join(',')}`,
      ...current,
    ]);

    try {
      const interaction = await firstValueFrom(this.api.createInteraction(request));

      this.activeWhiteLabel.set(whiteLabel);
      this.activeInteraction.set(interaction);
      this.activeConfiguration.set(configuration);
      this.events.update((current) => [
        `[INITIALIZE] interaction=${interaction.interactionId} status=${interaction.status}`,
        ...current,
      ]);
    } catch (error) {
      this.handleError(this.toCreateInteractionError(error));
    }
  }

  private handleSuccess(result: CommerceHubSuccessResult): void {
    this.events.update((current) => [
      `[SUCCESS] tender=${result.tenderType ?? 'unknown'} source=${result.paymentSourceId ?? 'n/a'}`,
      ...current,
    ]);
  }

  private handleError(error: CommerceHubSdkError): void {
    this.events.update((current) => [
      `[ERROR] stage=${error.stage} message=${error.message}`,
      ...current,
    ]);
  }

  private resolveAllowedTenderTypes(
    allowCard: boolean,
    allowBankAccount: boolean,
  ): CommerceHubTenderType[] {
    const allowedTenderTypes: CommerceHubTenderType[] = [];

    if (allowCard) {
      allowedTenderTypes.push('CARD');
    }

    if (allowBankAccount) {
      allowedTenderTypes.push('BANK_ACCOUNT');
    }

    return allowedTenderTypes.length ? allowedTenderTypes : ['CARD'];
  }

  private buildPayByBankOptions(value: ReturnType<typeof this.demoForm.getRawValue>): CommerceHubPayByBankOptions | undefined {
    const payByBank: CommerceHubPayByBankOptions = {
      apiKey: this.optionalValue(value.payByBankApiKey),
      configId: this.optionalValue(value.payByBankConfigId),
      paymentSdkUrl: this.optionalValue(value.payByBankPaymentSdkUrl),
      environment: this.optionalValue(value.payByBankEnvironment),
      locale: this.optionalValue(value.payByBankLocale),
      accessToken: this.optionalValue(value.payByBankAccessToken),
      encryptionKey: this.optionalValue(value.payByBankEncryptionKey),
      aggregatorKey: this.optionalValue(value.payByBankAggregatorKey),
      useSandbox: value.payByBankUseSandbox,
    };

    return Object.values(payByBank).some((option) => option !== undefined && option !== false)
      ? payByBank
      : undefined;
  }

  private buildMerchantData(value: ReturnType<typeof this.demoForm.getRawValue>): InteractionRequest['merchantData'] {
    const merchantData = {
      clientId: this.optionalValue(value.clientId),
      merchantId: this.optionalValue(value.merchantId),
      terminalId: this.optionalValue(value.terminalId),
    };

    return Object.values(merchantData).some((option) => option !== undefined) ? merchantData : undefined;
  }

  private optionalValue(value: string): string | undefined {
    const trimmed = value.trim();

    return trimmed || undefined;
  }

  private requiredValue(value: string, fallbackPrefix: string): string {
    const trimmed = value.trim();

    return trimmed || `${fallbackPrefix}-${Date.now()}`;
  }

  private optionalNumber(value: number): number | undefined {
    return Number.isFinite(value) && value > 0 ? value : undefined;
  }

  private toCreateInteractionError(error: unknown): CommerceHubSdkError {
    const errorRecord = typeof error === 'object' && error !== null ? (error as Record<string, unknown>) : null;
    const errorPayload =
      errorRecord && typeof errorRecord['error'] === 'object' && errorRecord['error'] !== null
        ? (errorRecord['error'] as Record<string, unknown>)
        : null;

    const message =
      (typeof errorPayload?.['message'] === 'string' && errorPayload['message']) ||
      (typeof errorRecord?.['message'] === 'string' && errorRecord['message']) ||
      'Unable to create interaction before SDK initialization.';
    const status = typeof errorRecord?.['status'] === 'number' ? errorRecord['status'] : undefined;

    return {
      stage: 'session',
      message,
      status,
      cause: error,
    };
  }
}
