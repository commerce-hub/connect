import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { InputOtpModule } from 'primeng/inputotp';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TabsModule } from 'primeng/tabs';

import {
  BankAccountSource,
  CardSource,
  CommerceHubTenderType,
  PaymentSource,
} from '../models/api.models';
import {
  CommerceHubSdkConfiguration,
  CommerceHubWhiteLabelOptions,
  ResolvedCommerceHubWhiteLabelOptions,
} from '../models/sdk.models';
import { CommerceHubConnectSdkService } from '../services/commerce-hub-connect-sdk.service';

const DEFAULT_WHITE_LABEL: ResolvedCommerceHubWhiteLabelOptions = {
  primaryColor: '#0a5dff',
  secondaryColor: '#627d98',
  textColor: '#000000',
  fontFamily: 'Open Sans, sans-serif',
};

@Component({
  selector: 'commerce-hub-connect-capture',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    DividerModule,
    InputOtpModule,
    InputTextModule,
    MessageModule,
    ProgressSpinnerModule,
    TabsModule,
  ],
  providers: [CommerceHubConnectSdkService],
  host: {
    class: 'ch-sdk-host',
    '[style.--ch-primary-color]': 'brand().primaryColor',
    '[style.--ch-secondary-color]': 'brand().secondaryColor',
    '[style.--ch-text-color]': 'brand().textColor',
    '[style.--ch-font-family]': 'brand().fontFamily',
  },
  templateUrl: './capture-payment.component.html',
  styleUrl: './capture-payment.component.scss',
})
export class CommerceHubConnectCaptureComponent {
  private readonly formBuilder = inject(FormBuilder);
  protected readonly sdk = inject(CommerceHubConnectSdkService);

  readonly configuration = input.required<CommerceHubSdkConfiguration>();
  readonly whiteLabel = input<CommerceHubWhiteLabelOptions>();

  protected readonly emailForm = this.formBuilder.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
  });

  protected readonly otpForm = this.formBuilder.nonNullable.group({
    otp: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]],
  });

  protected readonly cardForm = this.formBuilder.nonNullable.group(
    {
      nameOnCard: ['', [Validators.required, Validators.minLength(2)]],
      cardNumber: ['', [Validators.required, Validators.minLength(12), luhnValidator()]],
      expirationMonth: ['', [Validators.required, Validators.pattern(/^(0?[1-9]|1[0-2])$/)]],
      expirationYear: ['', [Validators.required, Validators.pattern(/^\d{2,4}$/)]],
      cvv: ['', [Validators.required, Validators.pattern(/^\d{3,4}$/)]],
    },
    { validators: cardExpiryValidator() },
  );

  protected readonly bankForm = this.formBuilder.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    bankName: ['', [Validators.required, Validators.minLength(2)]],
    routingNumber: ['', [Validators.required, Validators.pattern(/^\d{9}$/)]],
    accountNumber: ['', [Validators.required, Validators.pattern(/^\d{4,17}$/)]],
    accountType: ['CHECKING', [Validators.required]],
  });

  protected readonly bankAccountTypes = ['CHECKING', 'SAVINGS'];
  protected readonly submitted = signal(false);
  protected readonly otpSubmitted = signal(false);
  private readonly requestedOtpChannel = signal<'EMAIL' | 'PHONE'>('EMAIL');
  private readonly authStepOverride = signal<'email' | 'otp' | null>(null);
  protected readonly paymentEntryMode = signal<'list' | 'add'>('list');
  private readonly initializedPaymentInteractionId = signal<string | null>(null);
  private readonly autoContinueSessionReferenceId = signal<string | null>(null);
  private readonly selectedSourceId = signal<string | null>(null);
  protected readonly brand = computed<ResolvedCommerceHubWhiteLabelOptions>(() => ({
    ...DEFAULT_WHITE_LABEL,
    ...this.whiteLabel(),
  }));
  protected readonly payByBankMountId = computed(
    () =>
      `commerce-hub-banklink-${this.sdk.interaction()?.interactionId ?? 'mount'}`.replace(
        /[^a-zA-Z0-9-_]/g,
        '-',
      ),
  );
  protected readonly errorMessage = computed(() => this.sdk.lastError()?.message ?? '');
  protected readonly errorStage = computed(() => this.sdk.lastError()?.stage);
  protected readonly currentYear = new Date().getFullYear();
  protected readonly supportedTenderTypes = this.sdk.supportedTenderTypes;
  protected readonly selectedTenderType = this.sdk.selectedTenderType;
  protected readonly currentStep = this.sdk.currentStep;
  protected readonly availableSources = computed(() => {
    const allowedTenders = new Set(this.supportedTenderTypes());

    return (this.sdk.interaction()?.paymentSources ?? []).filter((source) =>
      allowedTenders.has(source.tenderType),
    );
  });
  protected readonly selectedSource = computed(() => {
    const selectedId = this.selectedSourceId();
    const interactionSelectedId = this.sdk.interaction()?.selectedSource?.id ?? null;
    const effectiveId = selectedId ?? interactionSelectedId;

    return (
      this.availableSources().find((source) => source.id === effectiveId) ??
      this.sdk.interaction()?.selectedSource ??
      null
    );
  });
  protected readonly displayStep = computed(() => {
    const step = this.currentStep();

    if (step === 'email' || step === 'otp') {
      return this.authStepOverride() ?? step;
    }

    return step;
  });
  protected readonly logoUrl = computed(() => this.brand().logoUrl);
  protected readonly otpChannel = computed<'EMAIL' | 'PHONE'>(() => {
    if (this.requestedOtpChannel() === 'EMAIL') {
      return 'EMAIL';
    }

    return this.sdk.interaction()?.phone?.phoneNumber ? 'PHONE' : 'EMAIL';
  });
  protected readonly otpDestination = computed(() => {
    if (this.otpChannel() === 'PHONE') {
      return formatOtpPhone(this.sdk.interaction()?.phone);
    }

    return maskEmailAddress(this.emailForm.getRawValue().email || this.configuration().email);
  });
  protected readonly otpAlternateActionLabel = computed(() =>
    this.otpChannel() === 'PHONE' ? 'Send code to email instead' : 'Use another email',
  );
  protected readonly summaryLabel = computed(() => {
    switch (this.displayStep()) {
      case 'otp':
        if (this.otpDestination()) {
          return `We send a one-time code to ${this.otpDestination()}.`;
        }

        return this.otpChannel() === 'PHONE'
          ? 'We send a one-time code to your phone.'
          : 'We send a one-time code to your email.';
      case 'payment':
        return this.paymentEntryMode() === 'add'
          ? 'Add the payment source you want to save to the virtual wallet.'
          : 'Choose from saved payment methods or add a new one.';
      case 'success':
        return 'Payment source linked successfully.';
      case 'email':
      default:
        return 'Enter your email address to access your payment dashboard.';
    }
  });
  protected readonly bankLinkReady = computed(() => {
    const configuration = this.configuration();
    const payByBank = configuration.payByBank;

    return Boolean(payByBank?.accessToken && payByBank.encryptionKey);
  });

  private readonly initializedSessionReferenceId = signal<string | null>(null);

  constructor() {
    effect(() => {
      const configuration = this.configuration();
      const whiteLabel = this.brand();

      this.emailForm.controls.email.setValue(configuration.email || "");
      if (configuration.allowEmailChange === false) {
        this.emailForm.controls.email.disable({ emitEvent: false });
      } else {
        this.emailForm.controls.email.enable({ emitEvent: false });
      }

      if (this.initializedSessionReferenceId() !== configuration.sessionReferenceId) {
        this.initializedSessionReferenceId.set(configuration.sessionReferenceId);
        void this.sdk.initialize(configuration);
      }

      document.documentElement.style.setProperty('--ch-primary-color', whiteLabel.primaryColor);
      document.documentElement.style.setProperty('--ch-secondary-color', whiteLabel.secondaryColor);
      document.documentElement.style.setProperty('--ch-text-color', whiteLabel.textColor);
      document.documentElement.style.setProperty('--ch-font-family', whiteLabel.fontFamily);
    });

    effect(() => {
      const configuration = this.configuration();
      const email = configuration.email?.trim();

      if (!email || this.autoContinueSessionReferenceId() === configuration.sessionReferenceId) {
        return;
      }

      if (this.sdk.loading() || this.currentStep() !== 'email' || this.emailForm.invalid) {
        return;
      }

      this.autoContinueSessionReferenceId.set(configuration.sessionReferenceId);
      queueMicrotask(() => {
        void this.submitEmail();
      });
    });

    effect(() => {
      const step = this.currentStep();

      if (step === 'payment' || step === 'success') {
        this.authStepOverride.set(null);
      }

      if (step === 'otp' && this.authStepOverride() !== 'email') {
        this.authStepOverride.set('otp');
      }

      if (step === 'email' && this.authStepOverride() !== 'otp') {
        this.authStepOverride.set('email');
      }

      if (this.displayStep() === 'otp') {
        this.otpSubmitted.set(false);
      }

      if (this.displayStep() === 'email') {
        this.submitted.set(false);
      }
    });

    effect(() => {
      if (this.currentStep() !== 'payment') {
        this.initializedPaymentInteractionId.set(null);
        this.selectedSourceId.set(null);
        return;
      }

      const interactionId = this.sdk.interaction()?.interactionId ?? 'payment';
      if (this.initializedPaymentInteractionId() !== interactionId) {
        this.initializedPaymentInteractionId.set(interactionId);
        this.paymentEntryMode.set(this.availableSources().length ? 'list' : 'add');
        this.selectedSourceId.set(this.sdk.interaction()?.selectedSource?.id ?? null);
      }
    });
  }

  protected async submitEmail(): Promise<void> {
    this.submitted.set(true);

    if (this.emailForm.invalid) {
      this.emailForm.markAllAsTouched();
      return;
    }

    this.otpSubmitted.set(false);
    this.otpForm.reset();
    this.requestedOtpChannel.set(this.sdk.interaction()?.phone?.phoneNumber ? 'PHONE' : 'EMAIL');
    this.authStepOverride.set('otp');
    await this.sdk.sendOtp(this.emailForm.getRawValue().email);
  }

  protected async submitOtp(): Promise<void> {
    this.otpSubmitted.set(true);

    if (this.otpForm.invalid) {
      this.otpForm.markAllAsTouched();
      return;
    }

    await this.sdk.validateOtp({
      email: this.emailForm.getRawValue().email,
      otp: this.otpForm.controls.otp.getRawValue(),
      channel: this.otpChannel(),
    });
  }

  protected backToEmailEntry(): void {
    this.submitted.set(false);
    this.otpSubmitted.set(false);
    this.otpForm.reset();
    this.requestedOtpChannel.set('EMAIL');
    this.authStepOverride.set('email');
  }

  protected async resendCode(): Promise<void> {
    const emailAddress = this.emailForm.getRawValue().email;

    if (!emailAddress) {
      this.backToEmailEntry();
      return;
    }

    await this.sdk.sendOtp(emailAddress);
  }

  protected async onOtpAlternateAction(): Promise<void> {
    if (this.otpChannel() === 'PHONE') {
      this.otpSubmitted.set(false);
      this.otpForm.reset();
      this.requestedOtpChannel.set('EMAIL');
      this.authStepOverride.set('otp');
      await this.sdk.sendOtp(this.emailForm.getRawValue().email);
      return;
    }

    this.backToEmailEntry();
  }

  protected async submitPaymentSource(): Promise<void> {
    if (this.selectedTenderType() === 'CARD') {
      await this.submitCard();
      return;
    }

    if (this.selectedTenderType() === 'BANK_ACCOUNT') {
      await this.submitBankAccount();
      return;
    }

    await this.sdk.launchPayByBank(this.payByBankMountId());
  }

  protected showAddPaymentMethod(): void {
    this.paymentEntryMode.set('add');
  }

  protected backToPaymentList(): void {
    this.paymentEntryMode.set('list');
  }

  protected selectExistingSource(source: PaymentSource): void {
    this.selectedSourceId.set(source.id ?? null);
  }

  protected async continueWithSelectedSource(): Promise<void> {
    const source = this.selectedSource();

    if (!source) {
      return;
    }

    await this.sdk.attachExistingPaymentSource(source);
  }

  protected onTenderTypeChange(value: string | number | undefined): void {
    if (value === 'CARD' || value === 'BANK_ACCOUNT' || value === 'DYNAMIC_SESSION_CARD') {
      this.sdk.selectTenderType(value);
    }
  }

  protected applyCardNumberMask(event: Event): void {
    const input = event.target as HTMLInputElement;
    const digits = input.value.replace(/\D/g, '').slice(0, 19);
    const masked = digits.replace(/(.{4})/g, '$1 ').trim();

    input.value = masked;
    this.cardForm.controls.cardNumber.setValue(masked, { emitEvent: false });
  }

  protected applyNumericMask(
    controlName: 'cvv' | 'expirationMonth' | 'expirationYear',
    event: Event,
    maxLength: number,
  ): void {
    const input = event.target as HTMLInputElement;
    const value = input.value.replace(/\D/g, '').slice(0, maxLength);

    input.value = value;
    this.cardForm.controls[controlName].setValue(value, { emitEvent: false });
  }

  protected applyBankNumericMask(
    controlName: 'routingNumber' | 'accountNumber',
    event: Event,
    maxLength: number,
  ): void {
    const input = event.target as HTMLInputElement;
    const value = input.value.replace(/\D/g, '').slice(0, maxLength);

    input.value = value;
    this.bankForm.controls[controlName].setValue(value, { emitEvent: false });
  }

  protected fieldInvalid(control: AbstractControl | null): boolean {
    return Boolean(control && control.invalid && (control.touched || control.dirty));
  }

  protected emailErrorMessage(): string {
    if (this.emailForm.controls.email.hasError('required')) {
      return 'Email address is required.';
    }

    if (this.emailForm.controls.email.hasError('email')) {
      return 'Enter a valid email address.';
    }

    return 'This field is incomplete.';
  }

  protected tenderLabel(tenderType: CommerceHubTenderType): string {
    switch (tenderType) {
      case 'BANK_ACCOUNT':
        return 'Bank Account';
      case 'DYNAMIC_SESSION_CARD':
        return 'Pay By Bank';
      case 'CARD':
      default:
        return 'Card';
    }
  }

  protected paymentTitle(): string {
    if (this.displayStep() === 'payment') {
      return this.paymentEntryMode() === 'add'
        ? 'Add a payment method'
        : 'Available payment methods';
    }

    switch (this.displayStep()) {
      case 'otp':
        return 'Enter the code';
      case 'success':
        return 'Wallet ready';
      case 'email':
      default:
        return 'Sign in';
    }
  }

  protected sourceLabel(source: PaymentSource): string {
    if (source.tenderType === 'CARD') {
      return source.name?.trim() || source.card.nameOnCard?.trim() || 'Saved card';
    }

    if (source.tenderType === 'BANK_ACCOUNT') {
      return (
        source.bankAccount.bankName?.trim() ||
        source.name?.trim() ||
        'Bank account'
      );
    }

    return source.name?.trim() || 'Pay By Bank';
  }

  protected sourceTypeLabel(source: PaymentSource): string {
    switch (source.tenderType) {
      case 'BANK_ACCOUNT':
        return 'Bank account';
      case 'DYNAMIC_SESSION_CARD':
        return 'Pay By Bank';
      case 'CARD':
      default:
        return source.card.network ?? 'Card';
    }
  }

  protected sourceDetailLabel(source: PaymentSource): string {
    if (source.tenderType === 'CARD') {
      return `•••• ${source.card.cardNumber.slice(-4) || '—'}`;
    }

    if (source.tenderType === 'BANK_ACCOUNT') {
      return `Acct •••• ${source.bankAccount.accountNumber.slice(-4) || '—'}`;
    }

    return source.id?.slice(-8) ?? 'Linked source';
  }

  protected isSelectedSource(source: PaymentSource): boolean {
    return Boolean(source.id && source.id === this.selectedSource()?.id);
  }

  private async submitCard(): Promise<void> {
    if (this.cardForm.invalid) {
      this.cardForm.markAllAsTouched();
      return;
    }

    const value = this.cardForm.getRawValue();
    const source: Omit<CardSource, 'tenderType'> = {
      name: value.nameOnCard,
      card: {
        nameOnCard: value.nameOnCard,
        cardNumber: value.cardNumber.replace(/\s/g, ''),
        expirationMonth: value.expirationMonth.padStart(2, '0'),
        expirationYear: normalizeCardYear(value.expirationYear),
        cvv: value.cvv,
      },
    };

    await this.sdk.submitCardSource(source);
  }

  private async submitBankAccount(): Promise<void> {
    if (this.bankForm.invalid) {
      this.bankForm.markAllAsTouched();
      return;
    }

    const value = this.bankForm.getRawValue();
    const source: Omit<BankAccountSource, 'tenderType'> = {
      name: value.name,
      bankAccount: {
        bankName: value.bankName,
        routingNumber: value.routingNumber,
        accountNumber: value.accountNumber,
        accountType: value.accountType,
      },
    };

    await this.sdk.submitBankAccountSource(source);
  }
}

function maskEmailAddress(email: string | null | undefined): string | undefined {
  const trimmed = email?.trim();
  if (!trimmed || !trimmed.includes('@')) {
    return undefined;
  }

  const [localPart, domain] = trimmed.split('@');
  if (!localPart || !domain) {
    return undefined;
  }

  const visible = localPart.slice(0, Math.min(2, localPart.length));
  return `${visible}${'*'.repeat(Math.max(1, localPart.length - visible.length))}@${domain}`;
}

function maskPhoneLast4(phoneNumber: string | null | undefined): string | undefined {
  const digits = phoneNumber?.replace(/\D/g, '') ?? '';
  if (!digits) {
    return undefined;
  }

  const last4 = digits.slice(-4);
  return `***-***-${last4}`;
}

function formatOtpPhone(
  phone: { countryCode?: string; phoneNumber?: string } | undefined,
): string | undefined {
  const countryCode = phone?.countryCode?.trim();
  const maskedPhone = maskPhoneLast4(phone?.phoneNumber);

  return [countryCode, maskedPhone].filter(Boolean).join(' ') || undefined;
}

function luhnValidator(): ValidatorFn {
  return (control: AbstractControl<string>): ValidationErrors | null => {
    const digits = control.value?.replace(/\D/g, '') ?? '';

    if (!digits) {
      return null;
    }

    let sum = 0;
    let shouldDouble = false;

    for (let index = digits.length - 1; index >= 0; index -= 1) {
      let digit = Number.parseInt(digits[index], 10);

      if (shouldDouble) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }

      sum += digit;
      shouldDouble = !shouldDouble;
    }

    return sum % 10 === 0 ? null : { luhn: true };
  };
}

function cardExpiryValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const month = control.get('expirationMonth')?.value;
    const year = control.get('expirationYear')?.value;

    if (!month || !year) {
      return null;
    }

    const normalizedYear = Number.parseInt(normalizeCardYear(year), 10);
    const normalizedMonth = Number.parseInt(month, 10);
    const now = new Date();
    const expiry = new Date(normalizedYear, normalizedMonth, 0, 23, 59, 59, 999);

    return expiry >= now ? null : { expired: true };
  };
}

function normalizeCardYear(year: string): string {
  return year.length === 2 ? `20${year}` : year;
}
