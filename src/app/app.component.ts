import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { concat, of, Subject, switchMap, tap, timer } from 'rxjs';

import {
  CommerceHubAuthType,
  CommerceHubConnectCaptureComponent,
  CommerceHubPayByBankOptions,
  CommerceHubSdkConfiguration,
  CommerceHubSdkError,
  CommerceHubSuccessResult,
  CommerceHubTenderType,
  CommerceHubWhiteLabelOptions,
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
  private readonly destroyRef = inject(DestroyRef);
  private readonly formBuilder = inject(FormBuilder);
  private readonly initializeRequests = new Subject<{
    configuration: CommerceHubSdkConfiguration;
    whiteLabel: CommerceHubWhiteLabelOptions;
  }>();

  protected readonly events = signal<string[]>([]);
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
    region: ['US'],
    language: ['en_US'],
    merchantTransactionId: ['txn-10001'],
    merchantOrderId: ['order-20002'],
    merchantInvoiceNumber: ['invoice-30003'],
    authType: ['FINAL_SALE' as CommerceHubAuthType],
    expiryMinutes: [30],
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

  constructor() {
    this.initializeRequests
      .pipe(
        switchMap(({ configuration, whiteLabel }) =>
          concat(
            of(null).pipe(
              tap(() => {
                this.activeConfiguration.set(null);
                this.activeWhiteLabel.set(null);
              }),
            ),
            timer(0).pipe(
              tap(() => {
                this.activeWhiteLabel.set(whiteLabel);
                this.activeConfiguration.set(configuration);
              }),
            ),
          ),
        ),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }

  protected initializeSdk(): void {
    const value = this.demoForm.getRawValue();
    const allowedTenderTypes = this.resolveAllowedTenderTypes(value.allowCard, value.allowBankAccount);
    const payByBank = this.buildPayByBankOptions(value);
    const configuration: CommerceHubSdkConfiguration = {
      sessionReferenceId: this.requiredValue(value.sessionReferenceId, 'sdk-demo-session'),
      merchantId: this.optionalValue(value.merchantId),
      terminalId: this.optionalValue(value.terminalId),
      clientId: this.optionalValue(value.clientId),
      email: this.optionalValue(value.email),
      paymentSelectionTitle: this.optionalValue(value.paymentSelectionTitle),
      paymentSelectionConfirmLabel: this.optionalValue(value.paymentSelectionConfirmLabel),
      region: this.optionalValue(value.region),
      language: this.optionalValue(value.language),
      merchantTransactionId: this.optionalValue(value.merchantTransactionId),
      merchantOrderId: this.optionalValue(value.merchantOrderId),
      merchantInvoiceNumber: this.optionalValue(value.merchantInvoiceNumber),
      authType: value.authType,
      expiryMinutes: this.optionalNumber(value.expiryMinutes),
      allowEmailChange: value.allowEmailChange,
      wallet: value.wallet,
      allowedTenderTypes,
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
      `[INIT] session=${configuration.sessionReferenceId} tenders=${allowedTenderTypes.join(',')}`,
      ...current,
    ]);
    this.initializeRequests.next({ configuration, whiteLabel });
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
}
