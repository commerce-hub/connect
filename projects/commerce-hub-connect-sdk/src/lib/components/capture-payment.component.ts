import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  computed,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { distinctUntilChanged, firstValueFrom, map } from 'rxjs';
import {
  CreditCard,
  CreditCardFormatDirective,
  CreditCardValidators,
  CvcFormatDirective,
  ExpiryFormatDirective,
} from 'angular-cc-library';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputOtpModule } from 'primeng/inputotp';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { SelectModule } from 'primeng/select';
import { TagModule } from 'primeng/tag';

import {
  Address,
  CardNetwork,
  CardSource,
  CommerceHubTenderType,
  PaymentSource,
} from '../models/api.models';
import {
  CommerceHubSdkConfiguration,
  CommerceHubSuccessResult,
  CommerceHubWhiteLabelOptions,
  ResolvedCommerceHubWhiteLabelOptions,
} from '../models/sdk.models';
import {
  CommerceHubPciVaultService,
  SecuredCardField,
} from '../services/commerce-hub-pci-vault.service';
import { CommerceHubConnectSdkService } from '../services/commerce-hub-connect-sdk.service';

type MaskedFieldState = SecuredCardField;
type BillingAddressOption = { label: string; value: string };
const NEW_BILLING_ADDRESS_VALUE = '__new__';
const DEFAULT_WHITE_LABEL: ResolvedCommerceHubWhiteLabelOptions = {
  primaryColor: '#0a5dff',
  secondaryColor: '#627d98',
  textColor: '#000000',
  fontFamily: 'Open Sans, sans-serif',
};

const US_STATES = [
  { code: 'AL', name: 'Alabama' },
  { code: 'AK', name: 'Alaska' },
  { code: 'AZ', name: 'Arizona' },
  { code: 'AR', name: 'Arkansas' },
  { code: 'CA', name: 'California' },
  { code: 'CO', name: 'Colorado' },
  { code: 'CT', name: 'Connecticut' },
  { code: 'DE', name: 'Delaware' },
  { code: 'FL', name: 'Florida' },
  { code: 'GA', name: 'Georgia' },
  { code: 'HI', name: 'Hawaii' },
  { code: 'ID', name: 'Idaho' },
  { code: 'IL', name: 'Illinois' },
  { code: 'IN', name: 'Indiana' },
  { code: 'IA', name: 'Iowa' },
  { code: 'KS', name: 'Kansas' },
  { code: 'KY', name: 'Kentucky' },
  { code: 'LA', name: 'Louisiana' },
  { code: 'ME', name: 'Maine' },
  { code: 'MD', name: 'Maryland' },
  { code: 'MA', name: 'Massachusetts' },
  { code: 'MI', name: 'Michigan' },
  { code: 'MN', name: 'Minnesota' },
  { code: 'MS', name: 'Mississippi' },
  { code: 'MO', name: 'Missouri' },
  { code: 'MT', name: 'Montana' },
  { code: 'NE', name: 'Nebraska' },
  { code: 'NV', name: 'Nevada' },
  { code: 'NH', name: 'New Hampshire' },
  { code: 'NJ', name: 'New Jersey' },
  { code: 'NM', name: 'New Mexico' },
  { code: 'NY', name: 'New York' },
  { code: 'NC', name: 'North Carolina' },
  { code: 'ND', name: 'North Dakota' },
  { code: 'OH', name: 'Ohio' },
  { code: 'OK', name: 'Oklahoma' },
  { code: 'OR', name: 'Oregon' },
  { code: 'PA', name: 'Pennsylvania' },
  { code: 'RI', name: 'Rhode Island' },
  { code: 'SC', name: 'South Carolina' },
  { code: 'SD', name: 'South Dakota' },
  { code: 'TN', name: 'Tennessee' },
  { code: 'TX', name: 'Texas' },
  { code: 'UT', name: 'Utah' },
  { code: 'VT', name: 'Vermont' },
  { code: 'VA', name: 'Virginia' },
  { code: 'WA', name: 'Washington' },
  { code: 'WV', name: 'West Virginia' },
  { code: 'WI', name: 'Wisconsin' },
  { code: 'WY', name: 'Wyoming' },
] as const;

@Component({
  selector: 'commerce-hub-connect-capture',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CreditCardFormatDirective,
    ExpiryFormatDirective,
    CvcFormatDirective,
    ButtonModule,
    CardModule,
    DividerModule,
    FloatLabelModule,
    InputOtpModule,
    InputTextModule,
    MessageModule,
    ProgressSpinnerModule,
    SelectModule,
    TagModule,
  ],
  providers: [CommerceHubConnectSdkService],
  host: {
    class: 'ch-sdk-host',
    '[style.--p-primary-color]': 'brand().primaryColor',
    '[style.--p-focus-ring-color]': 'brand().primaryColor',
    '[style.--p-button-primary-background]': 'brand().primaryColor',
    '[style.--p-button-primary-border-color]': 'brand().primaryColor',
    '[style.--p-button-primary-hover-background]': 'brand().secondaryColor',
    '[style.--p-button-primary-hover-border-color]': 'brand().secondaryColor',
    '[style.--p-button-primary-active-background]': 'brand().secondaryColor',
    '[style.--p-button-primary-active-border-color]': 'brand().secondaryColor',
    '[style.--p-button-primary-color]': 'primaryButtonTextColor()',
    '[style.--p-button-primary-hover-color]': 'primaryButtonTextColor()',
    '[style.--p-button-primary-active-color]': 'primaryButtonTextColor()',
    '[style.--p-button-primary-focus-ring-color]': 'brand().primaryColor',
  },
  templateUrl: './capture-payment.component.html',
  styleUrl: './capture-payment.component.scss',
})
export class CommerceHubConnectCaptureComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly formBuilder = inject(FormBuilder);
  protected readonly sdk = inject(CommerceHubConnectSdkService);
  private readonly pciVault = inject(CommerceHubPciVaultService);

  readonly configuration = input.required<CommerceHubSdkConfiguration>();
  readonly whiteLabel = input<CommerceHubWhiteLabelOptions>();
  private readonly maskedCardNumber = signal<MaskedFieldState | null>(null);
  private readonly maskedCvv = signal<MaskedFieldState | null>(null);
  private pendingMaskedCardNumber: Promise<string | undefined> | undefined;
  private pendingMaskedCvv: Promise<string | undefined> | undefined;

  protected readonly emailForm = this.formBuilder.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
  });

  protected readonly otpForm = this.formBuilder.nonNullable.group({
    otp: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]],
  });

  protected readonly cardForm = this.formBuilder.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    cardNumber: [
      '',
      [Validators.required, (control: AbstractControl<string>) => this.validateCardNumberControl(control)],
    ],
    network: ['' as CardNetwork | ''],
    expiration: ['', [Validators.required, CreditCardValidators.validateExpDate]],
    cvc: ['', [Validators.required, (control: AbstractControl<string>) => this.validateCvvControl(control)]],
    fullName: ['', [Validators.required, Validators.minLength(2)]],
    billingAddressValue: [NEW_BILLING_ADDRESS_VALUE, [Validators.required]],
    country: ['United States'],
    addressLine1: [''],
    addressLine2: [''],
    city: [''],
    state: [''],
    zip: [''],
  });

  private readonly billingAddresses = signal<Address[]>([]);
  protected readonly countryOptions = ['United States'];
  protected readonly states = [...US_STATES];
  protected readonly billingAddressOptions = computed<BillingAddressOption[]>(() => [
    ...this.billingAddresses()
      .map((address) => {
        const id = address.id?.trim();
        return id
          ? {
              value: id,
              label: formatBillingAddressLabel(address),
            }
          : null;
      })
      .filter((option): option is BillingAddressOption => option !== null),
    {
      value: NEW_BILLING_ADDRESS_VALUE,
      label: 'Add new billing address',
    },
  ]);
  protected readonly selectedBillingAddress = computed(() => {
    const selectedValue = this.cardForm.controls.billingAddressValue.value?.trim();
    if (!selectedValue || selectedValue === NEW_BILLING_ADDRESS_VALUE) {
      return undefined;
    }

    return this.billingAddresses().find((address) => address.id?.trim() === selectedValue);
  });
  protected readonly selectedBillingAddressLine1 = computed(() =>
    formatAddressLine1(this.selectedBillingAddress()),
  );
  protected readonly selectedBillingAddressLine2 = computed(() =>
    formatAddressLine2(this.selectedBillingAddress()),
  );
  protected readonly addingNewBillingAddress = computed(
    () => this.cardForm.controls.billingAddressValue.value === NEW_BILLING_ADDRESS_VALUE,
  );
  protected readonly submitted = signal(false);
  protected readonly otpSubmitted = signal(false);
  protected readonly cardSecurityErrorMessage = signal<string | null>(null);
  protected readonly isMaskingCardNumber = signal(false);
  protected readonly isMaskingCvv = signal(false);
  private readonly requestedOtpMode = signal<'default' | 'email'>('default');
  private readonly authStepOverride = signal<'email' | 'otp' | null>(null);
  protected readonly paymentEntryMode = signal<'list' | 'add'>('list');
  private readonly initializedPaymentInteractionId = signal<string | null>(null);
  private readonly autoContinueSessionReferenceId = signal<string | null>(null);
  private readonly selectedSourceId = signal<string | null>(null);
  private readonly completedSourceResult = signal<CommerceHubSuccessResult | null>(null);
  protected readonly brand = computed<ResolvedCommerceHubWhiteLabelOptions>(() => ({
    ...DEFAULT_WHITE_LABEL,
    ...this.whiteLabel(),
  }));
  protected readonly primaryButtonTextColor = computed(() => '#ffffff');
  protected readonly payByBankMountId = computed(
    () =>
      `commerce-hub-banklink-${this.sdk.interaction()?.interactionId ?? 'mount'}`.replace(
        /[^a-zA-Z0-9-_]/g,
        '-',
      ),
  );
  protected readonly errorMessage = computed(() => this.sdk.lastError()?.message ?? '');
  protected readonly errorStage = computed(() => this.sdk.lastError()?.stage);
  protected readonly cardSecurityBusy = computed(
    () => this.sdk.submitting() || this.isMaskingCardNumber() || this.isMaskingCvv(),
  );
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
  protected readonly hasSavedSources = computed(() => this.availableSources().length > 0);
  protected readonly canAddCard = computed(() => this.supportedTenderTypes().includes('CARD'));
  protected readonly canAddBankAccount = computed(() => this.supportedTenderTypes().includes('BANK_ACCOUNT'));
  protected readonly displayStep = computed(() => {
    if (this.completedSourceResult()) {
      return 'success';
    }

    const step = this.currentStep();

    if (step === 'email' || step === 'otp') {
      return this.authStepOverride() ?? step;
    }

    return step;
  });
  protected readonly logoUrl = computed(() => this.brand().logoUrl);
  protected readonly completedSource = computed(
    () => this.completedSourceResult()?.paymentSource ?? this.selectedSource(),
  );
  protected readonly otpChannel = computed<'EMAIL' | 'PHONE'>(() => {
    if (this.requestedOtpMode() === 'email') {
      return 'EMAIL';
    }

    return this.sdk.interaction()?.phone?.phoneNumber ? 'PHONE' : 'EMAIL';
  });
  protected readonly otpDestination = computed(() => {
    if (this.otpChannel() === 'PHONE') {
      return formatOtpPhone(this.sdk.interaction()?.phone);
    }

    return maskEmailAddress(
      this.emailForm.getRawValue().email ?? this.configuration().email,
    );
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
          ? 'Securely save a new payment method to continue.'
          : 'Choose a saved payment method or add a new one.';
      case 'success':
        return this.completedSourceResult()
          ? 'Your payment method has been saved successfully.'
          : 'Payment source linked successfully.';
      case 'email':
      default:
        return 'Enter your email address to access your payment dashboard.';
    }
  });
  protected readonly bankLinkReady = computed(() => {
    const payByBank = this.configuration().payByBank;

    return (
      hasConfiguredPayByBankValue(payByBank?.accessToken) &&
      hasConfiguredPayByBankValue(payByBank?.encryptionKey) &&
      hasConfiguredPayByBankValue(payByBank?.aggregatorKey)
    );
  });

  private readonly initializedSessionReferenceId = signal<string | null>(null);

  constructor() {
    effect(() => {
      const configuration = this.configuration();

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
        this.billingAddresses.set([]);
        this.completedSourceResult.set(null);
        this.clearSensitiveCardFields();
        return;
      }

      const interactionId = this.sdk.interaction()?.interactionId ?? 'payment';
      if (this.initializedPaymentInteractionId() !== interactionId) {
        this.initializedPaymentInteractionId.set(interactionId);
        this.paymentEntryMode.set('list');
        this.selectedSourceId.set(this.sdk.interaction()?.selectedSource?.id ?? null);
        this.completedSourceResult.set(null);
        void this.loadBillingAddresses();
      }
    });

    effect(() => {
      if (this.selectedTenderType() !== 'CARD' || this.paymentEntryMode() !== 'add') {
        this.clearSensitiveCardFields();
      }
    });

    this.cardForm.controls.cardNumber.valueChanges
      .pipe(
        map((cardNumber) => cardNetworkFromNumber(cardNumber)),
        distinctUntilChanged(),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((network) => {
        this.cardForm.controls.network.setValue(network ?? '', { emitEvent: false });
      });

    this.cardForm.controls.cardNumber.valueChanges
      .pipe(distinctUntilChanged(), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.resetMaskedCardNumber();
      });

    this.cardForm.controls.cvc.valueChanges
      .pipe(distinctUntilChanged(), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.resetMaskedCvv();
      });

    this.cardForm.controls.billingAddressValue.valueChanges
      .pipe(distinctUntilChanged(), takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => {
        this.applyBillingAddressValidators(value ?? NEW_BILLING_ADDRESS_VALUE);
      });

    this.applyBillingAddressValidators(this.cardForm.controls.billingAddressValue.value);
  }

  protected async submitEmail(): Promise<void> {
    this.submitted.set(true);

    if (this.emailForm.invalid) {
      this.emailForm.markAllAsTouched();
      return;
    }

    this.otpSubmitted.set(false);
    this.otpForm.reset();
    this.requestedOtpMode.set('default');
    this.authStepOverride.set('otp');
    await this.sdk.sendOtp(this.emailForm.getRawValue().email, 'default');
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
    this.requestedOtpMode.set('default');
    this.authStepOverride.set('email');
  }

  protected async resendCode(): Promise<void> {
    const emailAddress = this.emailForm.getRawValue().email;

    if (!emailAddress) {
      this.backToEmailEntry();
      return;
    }

    await this.sdk.sendOtp(emailAddress, this.requestedOtpMode());
  }

  protected async onOtpAlternateAction(): Promise<void> {
    if (this.otpChannel() === 'PHONE') {
      this.otpSubmitted.set(false);
      this.otpForm.reset();
      this.requestedOtpMode.set('email');
      this.authStepOverride.set('otp');
      await this.sdk.sendOtp(this.emailForm.getRawValue().email, 'email');
      return;
    }

    this.backToEmailEntry();
  }

  protected async submitPaymentSource(): Promise<void> {
    if (this.selectedTenderType() === 'CARD') {
      await this.submitCard();
      return;
    }

    const result = await this.sdk.launchPayByBank(this.payByBankMountId());
    this.handleCreatedPaymentSource(result);
  }

  protected showAddPaymentMethod(): void {
    this.paymentEntryMode.set('add');
  }

  protected showAddCardMethod(): void {
    this.sdk.selectTenderType('CARD');
    this.showAddPaymentMethod();
  }

  protected showAddBankAccountMethod(): void {
    this.sdk.selectTenderType('BANK_ACCOUNT');
    this.showAddPaymentMethod();
  }

  protected backToPaymentList(): void {
    this.completedSourceResult.set(null);
    this.paymentEntryMode.set('list');
    this.clearSensitiveCardFields();
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

  protected onCardNumberBlur(): void {
    void this.ensureMaskedCardNumber();
  }

  protected onCvvBlur(): void {
    void this.ensureMaskedCvv();
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
      case 'CARD':
      default:
        return 'Card';
    }
  }

  protected paymentTitle(): string {
    if (this.displayStep() === 'payment') {
      return this.paymentEntryMode() === 'add'
        ? this.selectedTenderType() === 'CARD'
          ? 'Add a Credit Card'
          : 'Add Bank Account'
        : 'Billing Information';
    }

    switch (this.displayStep()) {
      case 'otp':
        return 'Enter the code';
      case 'success':
        return this.completedSourceResult() ? 'Payment Method Saved' : 'Wallet ready';
      case 'email':
      default:
        return 'Sign in';
    }
  }

  protected sourcePrimaryLabel(source: PaymentSource): string {
    if (source.tenderType === 'CARD') {
      const cardSuffix = source.card.cardNumber.slice(-4) || '----';
      return `${source.card.network ?? 'Card'} **** ${cardSuffix}`;
    }

    return source.name?.trim() || source.bankAccount.bankName?.trim() || 'Bank account';
  }

  protected sourceSecondaryLabel(source: PaymentSource): string | undefined {
    if (source.tenderType === 'CARD') {
      const month = source.card.expirationMonth?.trim();
      const year = source.card.expirationYear?.trim();

      if (month && year) {
        return `Expires ${month}/${year}`;
      }

      return undefined;
    }

    return source.bankAccount.bankName?.trim() || source.bankAccount.accountType?.trim() || 'Bank account';
  }

  protected sourceTertiaryLabel(source: PaymentSource): string | undefined {
    if (source.tenderType === 'CARD') {
      return source.card.nameOnCard?.trim() || source.name?.trim() || undefined;
    }

    return `Acct •••• ${source.bankAccount.accountNumber.slice(-4) || '—'}`;
  }

  protected sourceBadgeLabel(source: PaymentSource): string {
    if (source.tenderType === 'CARD') {
      return source.card.network ?? 'Card';
    }

    return 'Bank';
  }

  protected showStepSummary(): boolean {
    return this.displayStep() !== 'payment' || this.paymentEntryMode() === 'add';
  }

  protected successStatusLabel(): string {
    return this.completedSourceResult() ? 'Payment Method Saved' : 'Payment Source Linked';
  }

  protected isSelectedSource(source: PaymentSource): boolean {
    return Boolean(source.id && source.id === this.selectedSource()?.id);
  }

  private async submitCard(): Promise<void> {
    if (this.cardForm.invalid) {
      this.cardForm.markAllAsTouched();
      return;
    }

    const maskedCardNumber = await this.ensureMaskedCardNumber();
    const maskedCvv = await this.ensureMaskedCvv();

    if (!maskedCardNumber || !maskedCvv) {
      if (!this.cardSecurityErrorMessage()) {
        this.cardSecurityErrorMessage.set('Unable to secure card details.');
      }
      return;
    }

    const value = this.cardForm.getRawValue();
    const rawCardNumber = normalizeCardNumber(value.cardNumber);
    const rawCvv = normalizeCvv(value.cvc);
    const { month, year } = parseExpiration(value.expiration);

    if (!month || !year) {
      return;
    }

    let billingAddressId = resolveSelectedBillingAddressId(value.billingAddressValue);

    if (billingAddressId === undefined) {
      const billingAddress = this.toBillingAddress({
        id: createBillingAddressId(),
        fullName: value.fullName,
        country: value.country,
        addressLine1: value.addressLine1,
        addressLine2: value.addressLine2,
        city: value.city,
        state: value.state,
        zip: value.zip,
      });

      await firstValueFrom(this.sdk.addBillingAddress(billingAddress));
      await this.loadBillingAddresses();
      billingAddressId = this.resolveCreatedBillingAddressId(billingAddress) ?? billingAddress.id?.trim();
      if (billingAddressId) {
        this.cardForm.controls.billingAddressValue.setValue(billingAddressId, { emitEvent: false });
        this.applyBillingAddressValidators(billingAddressId);
      }
    }

    if (!billingAddressId) {
      this.cardSecurityErrorMessage.set('Unable to associate a billing address.');
      return;
    }

    const source: Omit<CardSource, 'tenderType'> = {
      name: value.name.trim(),
      billingAddressId,
      card: {
        nameOnCard: value.fullName.trim(),
        cardNumber: maskedCardNumber,
        expirationMonth: month,
        expirationYear: year,
        cvv: maskedCvv,
        network: value.network || cardNetworkFromNumber(rawCardNumber),
        cardNumberEncrypted: maskedCardNumber !== rawCardNumber ? maskedCardNumber : undefined,
        cvvEncrypted: maskedCvv !== rawCvv ? maskedCvv : undefined,
      },
    };

    const result = await this.sdk.submitCardSource(source);
    this.handleCreatedPaymentSource(result);
  }

  private handleCreatedPaymentSource(result: CommerceHubSuccessResult): void {
    this.selectedSourceId.set(result.paymentSourceId ?? null);
    this.completedSourceResult.set(result);
    this.paymentEntryMode.set('list');
    this.clearSensitiveCardFields();
  }

  private validateCardNumberControl(control: AbstractControl<string>): ValidationErrors | null {
    const value = control.value ?? '';
    const maskedCardNumber = this.maskedCardNumber();

    if (maskedCardNumber && value === maskedCardNumber.displayValue) {
      return null;
    }

    return CreditCardValidators.validateCCNumber({ value } as AbstractControl);
  }

  private validateCvvControl(control: AbstractControl<string>): ValidationErrors | null {
    const value = control.value ?? '';
    const maskedCvv = this.maskedCvv();

    if (maskedCvv && value === maskedCvv.displayValue) {
      return null;
    }

    const normalizedValue = value.replace(/\s+/g, '');

    if (!normalizedValue) {
      return null;
    }

    return /^\d{3,4}$/.test(normalizedValue) ? null : { pattern: true };
  }

  private async ensureMaskedCardNumber(): Promise<string | undefined> {
    const cached = this.maskedCardNumber();
    if (cached) {
      return cached.maskedValue;
    }

    if (this.pendingMaskedCardNumber) {
      return this.pendingMaskedCardNumber;
    }

    const rawValue = normalizeCardNumber(this.cardForm.controls.cardNumber.value);
    if (!rawValue || this.cardForm.controls.cardNumber.invalid) {
      this.resetMaskedCardNumber();
      return undefined;
    }

    this.isMaskingCardNumber.set(true);
    this.cardSecurityErrorMessage.set(null);
    this.pendingMaskedCardNumber = (async () => {
      try {
        const securedField = await firstValueFrom(this.pciVault.secureCardNumber(rawValue));
        this.maskedCardNumber.set(securedField);
        this.cardForm.controls.cardNumber.setValue(securedField.displayValue, { emitEvent: false });
        this.cardForm.controls.cardNumber.updateValueAndValidity({ emitEvent: false });
        return securedField.maskedValue;
      } catch {
        this.resetMaskedCardNumber();
        this.cardSecurityErrorMessage.set('Unable to secure card number.');
        return undefined;
      } finally {
        this.pendingMaskedCardNumber = undefined;
        this.isMaskingCardNumber.set(false);
      }
    })();

    return this.pendingMaskedCardNumber;
  }

  private async ensureMaskedCvv(): Promise<string | undefined> {
    const cached = this.maskedCvv();
    if (cached) {
      return cached.maskedValue;
    }

    if (this.pendingMaskedCvv) {
      return this.pendingMaskedCvv;
    }

    const rawValue = normalizeCvv(this.cardForm.controls.cvc.value);
    if (!rawValue || this.cardForm.controls.cvc.invalid) {
      this.resetMaskedCvv();
      return undefined;
    }

    this.isMaskingCvv.set(true);
    this.cardSecurityErrorMessage.set(null);
    this.pendingMaskedCvv = (async () => {
      try {
        const securedField = await firstValueFrom(this.pciVault.secureCvv(rawValue));
        this.maskedCvv.set(securedField);
        this.cardForm.controls.cvc.setValue(securedField.displayValue, { emitEvent: false });
        this.cardForm.controls.cvc.updateValueAndValidity({ emitEvent: false });
        return securedField.maskedValue;
      } catch {
        this.resetMaskedCvv();
        this.cardSecurityErrorMessage.set('Unable to secure CVC.');
        return undefined;
      } finally {
        this.pendingMaskedCvv = undefined;
        this.isMaskingCvv.set(false);
      }
    })();

    return this.pendingMaskedCvv;
  }

  private resetMaskedCardNumber(): void {
    this.maskedCardNumber.set(null);
    this.pendingMaskedCardNumber = undefined;
    this.isMaskingCardNumber.set(false);
  }

  private resetMaskedCvv(): void {
    this.maskedCvv.set(null);
    this.pendingMaskedCvv = undefined;
    this.isMaskingCvv.set(false);
  }

  private async loadBillingAddresses(): Promise<void> {
    try {
      const profile = await firstValueFrom(this.sdk.getCustomerProfile());
      this.billingAddresses.set(profile.billingAddress ?? []);
    } catch {
      if (this.billingAddresses().length === 0) {
        this.cardForm.controls.billingAddressValue.setValue(NEW_BILLING_ADDRESS_VALUE, {
          emitEvent: false,
        });
        this.applyBillingAddressValidators(NEW_BILLING_ADDRESS_VALUE);
      }
    } finally {
      this.syncBillingAddressSelection();
    }
  }

  private syncBillingAddressSelection(): void {
    const existingAddressIds = this.billingAddresses()
      .map((address) => address.id?.trim())
      .filter((id): id is string => Boolean(id));
    const currentValue = this.cardForm.controls.billingAddressValue.value?.trim();

    if (currentValue && (currentValue === NEW_BILLING_ADDRESS_VALUE || existingAddressIds.includes(currentValue))) {
      return;
    }

    this.cardForm.controls.billingAddressValue.setValue(
      existingAddressIds[0] ?? NEW_BILLING_ADDRESS_VALUE,
      { emitEvent: false },
    );
    this.applyBillingAddressValidators(this.cardForm.controls.billingAddressValue.value);
  }

  private applyBillingAddressValidators(billingAddressValue: string): void {
    const useNewAddress = billingAddressValue === NEW_BILLING_ADDRESS_VALUE;
    const requiredFields = useNewAddress ? [Validators.required] : [];

    this.cardForm.controls.country.setValidators(requiredFields);
    this.cardForm.controls.addressLine1.setValidators(requiredFields);
    this.cardForm.controls.city.setValidators(requiredFields);
    this.cardForm.controls.state.setValidators(requiredFields);
    this.cardForm.controls.zip.setValidators(
      useNewAddress ? [Validators.required, Validators.pattern(/^\d{5}(?:-\d{4})?$/)] : [],
    );

    this.cardForm.controls.country.updateValueAndValidity({ emitEvent: false });
    this.cardForm.controls.addressLine1.updateValueAndValidity({ emitEvent: false });
    this.cardForm.controls.addressLine2.updateValueAndValidity({ emitEvent: false });
    this.cardForm.controls.city.updateValueAndValidity({ emitEvent: false });
    this.cardForm.controls.state.updateValueAndValidity({ emitEvent: false });
    this.cardForm.controls.zip.updateValueAndValidity({ emitEvent: false });
  }

  private toBillingAddress(value: {
    id?: string;
    fullName: string;
    country: string;
    addressLine1: string;
    addressLine2: string;
    city: string;
    state: string;
    zip: string;
  }): Address {
    return {
      id: value.id?.trim() || undefined,
      recipientNameOrAddress: value.fullName.trim(),
      country: value.country.trim(),
      street: value.addressLine1.trim(),
      houseNumberOrName: value.addressLine2.trim() || undefined,
      city: value.city.trim(),
      stateOrProvince: value.state.trim(),
      postalCode: value.zip.trim(),
    };
  }

  private resolveCreatedBillingAddressId(billingAddress: Address): string | undefined {
    const matchedAddress = this.billingAddresses().find((candidate) =>
      addressesMatch(candidate, billingAddress),
    );

    return matchedAddress?.id?.trim();
  }

  private clearSensitiveCardFields(): void {
    this.cardForm.patchValue(
      {
        cardNumber: '',
        cvc: '',
      },
      { emitEvent: false },
    );
    this.resetMaskedCardNumber();
    this.resetMaskedCvv();
    this.cardSecurityErrorMessage.set(null);
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

function resolveSelectedBillingAddressId(
  billingAddressValue: string | undefined,
): string | undefined {
  const normalized = billingAddressValue?.trim();
  if (!normalized || normalized === NEW_BILLING_ADDRESS_VALUE) {
    return undefined;
  }

  return normalized;
}

function formatBillingAddressLabel(address: Address): string {
  const line1 = formatAddressLine1(address);
  const line2 = formatAddressLine2(address);

  return [line1, line2].filter(Boolean).join(' — ') || 'Billing address';
}

function formatAddressLine1(address: Address | undefined): string {
  if (!address) {
    return '';
  }

  const street = address.street?.trim();
  const house = address.houseNumberOrName?.trim();

  return [street, house].filter(Boolean).join(', ') || address.recipientNameOrAddress?.trim() || 'Billing address';
}

function formatAddressLine2(address: Address | undefined): string {
  if (!address) {
    return '';
  }

  const city = address.city?.trim();
  const state = address.stateOrProvince?.trim();
  const postalCode = address.postalCode?.trim();

  return [city, state, postalCode].filter(Boolean).join(', ');
}

function addressesMatch(candidate: Address, target: Address): boolean {
  return (
    normalizeAddressValue(candidate.recipientNameOrAddress) ===
      normalizeAddressValue(target.recipientNameOrAddress) &&
    normalizeAddressValue(candidate.country) === normalizeAddressValue(target.country) &&
    normalizeAddressValue(candidate.street) === normalizeAddressValue(target.street) &&
    normalizeAddressValue(candidate.houseNumberOrName) ===
      normalizeAddressValue(target.houseNumberOrName) &&
    normalizeAddressValue(candidate.city) === normalizeAddressValue(target.city) &&
    normalizeAddressValue(candidate.stateOrProvince) === normalizeAddressValue(target.stateOrProvince) &&
    normalizeAddressValue(candidate.postalCode) === normalizeAddressValue(target.postalCode)
  );
}

function normalizeAddressValue(value: string | undefined): string {
  return value?.trim().toLowerCase() ?? '';
}

function normalizeCardNumber(value: string): string {
  return value.replace(/\D/g, '');
}

function normalizeCvv(value: string): string {
  return value.replace(/\D/g, '');
}

function parseExpiration(raw: string): { month?: string; year?: string } {
  const cleaned = raw.trim().replace(/\s+/g, '');
  const match = cleaned.match(/^(\d{1,2})[/-]?(\d{2,4})$/);

  if (!match) {
    return {};
  }

  const month = match[1].padStart(2, '0');
  const year = match[2].length === 2 ? `20${match[2]}` : match[2];

  return { month, year };
}

function createBillingAddressId(): string {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let result = '';

  for (let index = 0; index < 8; index += 1) {
    result += alphabet[Math.floor(Math.random() * alphabet.length)];
  }

  return result;
}

function cardNetworkFromNumber(cardNumber: string): CardNetwork | undefined {
  switch (CreditCard.cardType(cardNumber)) {
    case 'visa':
      return 'Visa';
    case 'mastercard':
      return 'Mastercard';
    case 'amex':
      return 'AmericanExpress';
    case 'discover':
      return 'Discover';
    default:
      return undefined;
  }
}

function hasConfiguredPayByBankValue(value: string | undefined): value is string {
  const normalized = value?.trim();

  return Boolean(normalized && !normalized.startsWith('replace-with-'));
}
