import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  computed,
  inject,
  input,
  output,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { rxResource, takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { EMPTY, Observable, throwError } from 'rxjs';
import { catchError, finalize, switchMap, tap } from 'rxjs/operators';
import { Button, ButtonModule } from 'primeng/button';
import { InputOtp } from 'primeng/inputotp';
import { InputText } from 'primeng/inputtext';
import { Message } from 'primeng/message';
import { ProgressSpinner } from 'primeng/progressspinner';
import { HostedCheckoutApiService } from './hosted-checkout-api.service';
import {
  BankAccountSource,
  CardSource,
  DEFAULT_HOSTED_CHECKOUT_BRANDING,
  HostedCheckoutBranding,
  HostedCheckoutCompletionEvent,
  HostedCheckoutLaunchRequest,
  HostedCheckoutPaymentSource,
  InteractionStatus,
  mergeBranding,
  sourceDisplayName,
  sourceMaskedValue,
} from './hosted-checkout.models';

type AddPaymentMethodType = 'CARD' | 'BANK_ACCOUNT' | 'PAYPAY' | 'VENMO';

interface AddPaymentMethodOption {
  type: AddPaymentMethodType;
  label: string;
  description: string;
  icon: string;
  supported: boolean;
}

interface InitializationRequest {
  apiBaseUrl: string;
  interaction: HostedCheckoutLaunchRequest['interaction'];
}

const ADD_PAYMENT_METHOD_OPTIONS: readonly AddPaymentMethodOption[] = [
  {
    type: 'CARD',
    label: 'Card',
    description: 'Save a debit or credit card to this wallet.',
    icon: 'pi pi-credit-card',
    supported: true,
  },
  {
    type: 'BANK_ACCOUNT',
    label: 'Bank account',
    description: 'Add an account for ACH-style payments.',
    icon: 'pi pi-building-columns',
    supported: true,
  },
  {
    type: 'PAYPAY',
    label: 'PayPay',
    description: 'Wallet shortcut shown here for future API support.',
    icon: 'pi pi-wallet',
    supported: false,
  },
  {
    type: 'VENMO',
    label: 'Venmo',
    description: 'Social wallet option staged for future API support.',
    icon: 'pi pi-mobile',
    supported: false,
  },
];

@Component({
  selector: 'ch-hosted-checkout',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    Button,
    ButtonModule,
    InputOtp,
    InputText,
    Message,
    ProgressSpinner,
    CurrencyPipe,
  ],
  templateUrl: './commercehub-hosted-checkout.html',
  styleUrl: './commercehub-hosted-checkout.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'ch-hosted-checkout-host',
  },
  encapsulation: ViewEncapsulation.None,
})
export class CommercehubHostedCheckout {
  private readonly api = inject(HostedCheckoutApiService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly formBuilder = inject(FormBuilder);

  apiBaseUrl = input('http://localhost:8080');
  launchRequest = input.required<HostedCheckoutLaunchRequest>();
  branding = input<Partial<HostedCheckoutBranding>>({});

  checkoutReady = output<string>();
  statusChanged = output<InteractionStatus>();
  completed = output<HostedCheckoutCompletionEvent>();
  failed = output<string>();
  closed = output<void>();

  protected readonly interaction = signal<HostedCheckoutCompletionEvent['interaction'] | null>(
    null,
  );
  protected readonly isBusy = signal(false);
  protected readonly errorMessage = signal('');
  protected readonly selectedSourceId = signal<string | null>(null);
  protected readonly activeAction = signal<
    'send-otp' | 'verify-otp' | 'attach-source' | 'add-source' | 'pay' | 'refresh' | ''
  >('');
  protected readonly addPaymentMethodOpen = signal(false);
  protected readonly selectedAddPaymentMethod = signal<AddPaymentMethodType | null>(null);
  protected readonly addPaymentMethodOptions = ADD_PAYMENT_METHOD_OPTIONS;
  private readonly initializationRequest = signal<InitializationRequest | undefined>(undefined);

  protected readonly brand = computed(() =>
    mergeBranding(DEFAULT_HOSTED_CHECKOUT_BRANDING, this.branding()),
  );

  protected readonly availableSources = computed(
    () => this.interaction()?.paymentSources?.filter((source) => !!source.id) ?? [],
  );

  protected readonly selectedSource = computed(() => {
    const currentInteraction = this.interaction();
    const explicitSelection = this.selectedSourceId();

    return (
      currentInteraction?.paymentSources?.find((source) => source.id === explicitSelection) ??
      currentInteraction?.selectedSource ??
      null
    );
  });

  protected readonly currentStep = computed(() => {
    const status = this.interaction()?.status;

    if (!status) {
      return 'email';
    }

    if (status === 'EMAIL_REQUESTED') {
      return 'email';
    }

    if (status === 'OTP_VALIDATION_PENDING' || status === 'OTP_VALIDATION_FAILED') {
      return 'otp';
    }

    if (status === 'PAYMENT_SOURCE_REQUESTED') {
      return 'source';
    }

    if (status === 'PAYMENT_SOURCE_ATTACHED') {
      return 'review';
    }

    if (status === 'COMPLETED') {
      return 'completed';
    }

    return 'email';
  });

  protected readonly paymentLabel = computed(
    () => this.launchRequest().payment.callToAction ?? 'Pay now',
  );

  protected readonly maskedEmail = computed(() =>
    this.maskEmail(this.emailForm.controls.email.value ?? ''),
  );

  protected readonly canChangeEmail = computed(() => this.interaction()?.allowEmailChange ?? true);

  protected readonly selectedAddPaymentMethodOption = computed(() => {
    const selectedMethod = this.selectedAddPaymentMethod();
    return this.addPaymentMethodOptions.find((option) => option.type === selectedMethod) ?? null;
  });

  protected readonly emailForm = this.formBuilder.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
  });

  protected readonly otpForm = this.formBuilder.nonNullable.group({
    otp: ['', [Validators.required, Validators.minLength(6)]],
  });

  protected readonly cardForm = this.formBuilder.nonNullable.group({
    nameOnCard: ['', [Validators.required]],
    cardNumber: ['', [Validators.required, Validators.minLength(12)]],
    expirationMonth: ['', [Validators.required, Validators.pattern(/^(0?[1-9]|1[0-2])$/)]],
    expirationYear: ['', [Validators.required, Validators.pattern(/^\d{2,4}$/)]],
    cvv: ['', [Validators.required, Validators.minLength(3)]],
  });

  protected readonly bankAccountForm = this.formBuilder.nonNullable.group({
    bankName: ['', [Validators.required]],
    routingNumber: ['', [Validators.required, Validators.minLength(4)]],
    accountNumber: ['', [Validators.required, Validators.minLength(4)]],
    accountType: ['', [Validators.required]],
  });

  constructor() {
    queueMicrotask(() => {
      const { interaction } = this.launchRequest();

      this.prepareInitialization(interaction.email);
      this.initializationRequest.set({
        apiBaseUrl: this.apiBaseUrl(),
        interaction,
      });
    });
  }

  protected readonly initializeInteraction = rxResource<
    HostedCheckoutCompletionEvent['interaction'] | null,
    InitializationRequest | undefined
  >({
    defaultValue: null,
    params: () => this.initializationRequest(),
    stream: ({ params }) => {
      return this.api.createInteraction(params.apiBaseUrl, params.interaction).pipe(
        tap((nextInteraction) => {
          this.applyInteraction(nextInteraction);
          this.checkoutReady.emit(nextInteraction.interactionId);
        }),
        catchError((error) => {
          this.handleError(error, 'Unable to start hosted checkout.');
          return throwError(() => error);
        }),
      );
    },
  });

  protected readonly isInitializing = computed(() => {
    const status = this.initializeInteraction.status();
    return (
      this.initializationRequest() === undefined || status === 'loading' || status === 'reloading'
    );
  });

  protected sendOtp(): void {
    this.errorMessage.set('');
    this.emailForm.markAllAsTouched();

    if (this.emailForm.invalid || !this.interaction()?.interactionId) {
      return;
    }

    this.executeRequest({
      action: 'send-otp',
      source$: this.api.sendOtp(
        this.apiBaseUrl(),
        this.interaction()!.interactionId,
        { value: this.emailForm.controls.email.getRawValue() },
      ),
      onSuccess: (interaction) => {
        this.applyInteraction(interaction);
        this.otpForm.reset();
      },
      fallbackMessage: 'Unable to send a one-time code.',
    });
  }

  protected verifyOtp(): void {
    this.errorMessage.set('');
    this.otpForm.markAllAsTouched();

    if (this.otpForm.invalid || !this.interaction()?.interactionId) {
      return;
    }

    this.executeRequest({
      action: 'verify-otp',
      source$: this.api.validateOtp(
        this.apiBaseUrl(),
        this.interaction()!.interactionId,
        {
          email: this.emailForm.controls.email.getRawValue(),
          otp: this.otpForm.controls.otp.getRawValue(),
          channel: 'EMAIL',
        },
      ),
      onSuccess: (interaction) => {
        this.applyInteraction(interaction);

        if (interaction.status === 'OTP_VALIDATION_FAILED') {
          this.errorMessage.set('The verification code did not match. Try again.');
        }
      },
      fallbackMessage: 'Unable to verify the one-time code.',
    });
  }

  protected selectAndAttachSource(source: HostedCheckoutPaymentSource): void {
    if (!source.id || !this.interaction()?.interactionId) {
      return;
    }

    this.errorMessage.set('');
    this.selectedSourceId.set(source.id);
    this.executeRequest({
      action: 'attach-source',
      source$: this.api.attachPaymentMethod(
        this.apiBaseUrl(),
        this.interaction()!.interactionId,
        source.id,
      ),
      onSuccess: (interaction) => this.applyInteraction(interaction),
      fallbackMessage: 'Unable to attach the selected payment method.',
    });
  }

  protected submitAddPaymentMethod(): void {
    const selectedMethod = this.selectedAddPaymentMethod();

    if (selectedMethod === 'CARD') {
      this.cardForm.markAllAsTouched();

      if (this.cardForm.invalid) {
        return;
      }

      const request: CardSource = {
        name: 'Saved card',
        tenderType: 'CARD',
        card: {
          nameOnCard: this.cardForm.controls.nameOnCard.getRawValue().trim(),
          cardNumber: this.cardForm.controls.cardNumber.getRawValue().replace(/\s+/g, ''),
          expirationMonth: this.cardForm.controls.expirationMonth.getRawValue().trim(),
          expirationYear: this.cardForm.controls.expirationYear.getRawValue().trim(),
          cvv: this.cardForm.controls.cvv.getRawValue().trim(),
        },
      };

      this.addPaymentMethod(request);
      return;
    }

    if (selectedMethod === 'BANK_ACCOUNT') {
      this.bankAccountForm.markAllAsTouched();

      if (this.bankAccountForm.invalid) {
        return;
      }

      const request: BankAccountSource = {
        name: this.bankAccountForm.controls.bankName.getRawValue().trim(),
        tenderType: 'BANK_ACCOUNT',
        bankAccount: {
          bankName: this.bankAccountForm.controls.bankName.getRawValue().trim(),
          routingNumber: this.bankAccountForm.controls.routingNumber.getRawValue().trim(),
          accountNumber: this.bankAccountForm.controls.accountNumber.getRawValue().trim(),
          accountType: this.bankAccountForm.controls.accountType.getRawValue().trim(),
        },
      };

      this.addPaymentMethod(request);
      return;
    }
  }

  protected openAddPaymentMethodChooser(): void {
    this.errorMessage.set('');
    this.addPaymentMethodOpen.set(true);
    this.selectedAddPaymentMethod.set(null);
  }

  protected closeAddPaymentMethodChooser(): void {
    this.errorMessage.set('');
    this.addPaymentMethodOpen.set(false);
    this.selectedAddPaymentMethod.set(null);
    this.resetAddPaymentMethodForms();
  }

  protected selectAddPaymentMethod(method: AddPaymentMethodType): void {
    this.errorMessage.set('');
    this.selectedAddPaymentMethod.set(method);
  }

  protected backToAddPaymentMethodChooser(): void {
    this.errorMessage.set('');
    this.selectedAddPaymentMethod.set(null);
  }

  protected isSupportedAddPaymentMethod(type: AddPaymentMethodType): boolean {
    return type === 'CARD' || type === 'BANK_ACCOUNT';
  }

  protected sourceName(source: HostedCheckoutPaymentSource): string {
    return sourceDisplayName(source);
  }

  protected sourceValue(source: HostedCheckoutPaymentSource): string {
    return sourceMaskedValue(source);
  }

  protected sourceIcon(source: HostedCheckoutPaymentSource): string {
    if (source.tenderType === 'BANK_ACCOUNT') {
      return 'pi pi-building-columns';
    }

    if (source.tenderType === 'DYNAMIC_SESSION_CARD') {
      return 'pi pi-ticket';
    }

    return 'pi pi-credit-card';
  }

  protected statusLabel(status: InteractionStatus | undefined): string {
    if (!status) {
      return 'Preparing checkout';
    }

    return status.replaceAll('_', ' ');
  }

  protected emailErrorMessage(): string {
    const emailControl = this.emailForm.controls.email;

    if (emailControl.hasError('required')) {
      return 'Enter an email address.';
    }

    if (emailControl.hasError('email')) {
      return 'Enter a valid email address.';
    }

    return '';
  }

  protected otpErrorMessage(): string {
    const otpControl = this.otpForm.controls.otp;

    if (otpControl.hasError('required')) {
      return 'Enter the six-digit code.';
    }

    if (otpControl.hasError('minlength')) {
      return 'Use the full code from the email message.';
    }

    return '';
  }

  protected addPaymentMethodErrorMessage(): string {
    if (this.selectedAddPaymentMethod() === 'CARD' && this.cardForm.invalid) {
      return 'Complete all card fields before saving the payment method.';
    }

    if (this.selectedAddPaymentMethod() === 'BANK_ACCOUNT' && this.bankAccountForm.invalid) {
      return 'Complete all bank account fields before saving the payment method.';
    }

    return '';
  }

  protected addPaymentMethodTitle(): string {
    return this.selectedAddPaymentMethodOption()?.label ?? 'Choose a method';
  }

  protected addPaymentMethodDescription(): string {
    const selectedMethod = this.selectedAddPaymentMethodOption();

    if (!selectedMethod) {
      return 'Pick the payment method you want to add to the hosted wallet.';
    }

    if (!selectedMethod.supported) {
      return 'This wallet option is visible in the UI, but the current API does not expose a save-source endpoint for it yet.';
    }

    return selectedMethod.description;
  }

  protected completePayment(): void {
    if (!this.interaction()?.interactionId) {
      return;
    }

    this.errorMessage.set('');
    this.executeRequest({
      action: 'pay',
      source$: this.api
        .submitPayment(
          this.apiBaseUrl(),
          {
            interactionId: this.interaction()!.interactionId,
            amount: this.launchRequest().payment.amount,
            currency: this.launchRequest().payment.currency,
          },
        )
        .pipe(switchMap(() => this.api.getStatus(this.apiBaseUrl(), this.interaction()!.interactionId))),
      onSuccess: (interaction) => this.applyInteraction(interaction),
      fallbackMessage: 'Payment could not be completed.',
    });
  }

  protected refreshStatus(): void {
    if (!this.interaction()?.interactionId) {
      return;
    }

    this.executeRequest({
      action: 'refresh',
      source$: this.api.getStatus(this.apiBaseUrl(), this.interaction()!.interactionId),
      onSuccess: (interaction) => this.applyInteraction(interaction),
      fallbackMessage: 'Checkout status could not be refreshed.',
    });
  }

  protected useAnotherEmail(): void {
    this.errorMessage.set('');
    this.otpForm.reset();
    this.selectedSourceId.set(null);
    this.interaction.update((interaction) =>
      interaction ? { ...interaction, status: 'EMAIL_REQUESTED', paymentSources: [] } : interaction,
    );
    this.statusChanged.emit('EMAIL_REQUESTED');
  }

  protected closeCheckout(): void {
    this.closed.emit();
  }

  private addPaymentMethod(request: HostedCheckoutPaymentSource): void {
    if (!this.interaction()?.interactionId) {
      return;
    }

    this.errorMessage.set('');
    this.executeRequest({
      action: 'add-source',
      source$: this.api.addSource(this.apiBaseUrl(), request).pipe(
        switchMap(() => this.api.getCustomerProfile(this.apiBaseUrl())),
      ),
      onSuccess: (profile) => {
        this.updateAvailablePaymentSources(profile.sources ?? []);
        this.closeAddPaymentMethodChooser();
      },
      fallbackMessage: 'Unable to add the new payment method.',
    });
  }

  private updateAvailablePaymentSources(paymentSources: HostedCheckoutPaymentSource[]): void {
    const currentInteraction = this.interaction();

    if (!currentInteraction) {
      return;
    }

    const currentSelectedSourceId = this.selectedSourceId();
    const selectedSource =
      paymentSources.find((source) => source.id === currentSelectedSourceId) ??
      currentInteraction.selectedSource;

    this.interaction.set({
      ...currentInteraction,
      paymentSources,
      selectedSource,
    });
  }

  private prepareInitialization(email: string): void {
    this.errorMessage.set('');
    this.interaction.set(null);
    this.selectedSourceId.set(null);
    this.isBusy.set(false);
    this.activeAction.set('');
    this.addPaymentMethodOpen.set(false);
    this.selectedAddPaymentMethod.set(null);
    this.otpForm.reset();
    this.resetAddPaymentMethodForms();
    this.emailForm.patchValue({ email }, { emitEvent: false });
  }

  private applyInteraction(interaction: HostedCheckoutCompletionEvent['interaction']): void {
    this.interaction.set(interaction);
    this.statusChanged.emit(interaction.status);

    if (interaction.email) {
      this.emailForm.patchValue({ email: interaction.email }, { emitEvent: false });
    }

    if (interaction.selectedSource?.id) {
      this.selectedSourceId.set(interaction.selectedSource.id);
    } else if (interaction.paymentSources?.length === 1 && interaction.paymentSources[0].id) {
      this.selectedSourceId.set(interaction.paymentSources[0].id!);
    }

    if (interaction.status === 'COMPLETED') {
      this.completed.emit({
        interaction,
        payment: this.launchRequest().payment,
      });
    }
  }

  private handleError(error: unknown, fallbackMessage: string): void {
    const message =
      typeof error === 'object' &&
      error !== null &&
      'message' in error &&
      typeof error.message === 'string'
        ? error.message
        : fallbackMessage;

    this.errorMessage.set(message);
    this.failed.emit(message);
  }

  private executeRequest<T>({
    action,
    source$,
    onSuccess,
    fallbackMessage,
  }: {
    action: 'send-otp' | 'verify-otp' | 'attach-source' | 'add-source' | 'pay' | 'refresh';
    source$: Observable<T>;
    onSuccess: (value: T) => void;
    fallbackMessage: string;
  }): void {
    this.activeAction.set(action);
    this.isBusy.set(true);

    source$
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap((value) => onSuccess(value)),
        catchError((error) => {
          this.handleError(error, fallbackMessage);
          return EMPTY;
        }),
        finalize(() => {
          this.isBusy.set(false);
          this.activeAction.set('');
        }),
      )
      .subscribe();
  }

  private resetAddPaymentMethodForms(): void {
    this.cardForm.reset({
      nameOnCard: '',
      cardNumber: '',
      expirationMonth: '',
      expirationYear: '',
      cvv: '',
    });
    this.bankAccountForm.reset({
      bankName: '',
      routingNumber: '',
      accountNumber: '',
      accountType: '',
    });
  }

  private maskEmail(email: string): string {
    const [name, domain] = email.trim().split('@');

    if (!name || !domain) {
      return email;
    }

    const visible = name.length <= 2 ? (name[0] ?? '') : `${name[0]}${name[1]}`;
    return `${visible}${'*'.repeat(Math.max(1, name.length - visible.length))}@${domain}`;
  }
}
