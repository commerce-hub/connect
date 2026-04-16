import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { Button } from 'primeng/button';
import { InputOtp } from 'primeng/inputotp';
import { InputText } from 'primeng/inputtext';
import { Message } from 'primeng/message';
import { ProgressSpinner } from 'primeng/progressspinner';
import { HostedCheckoutApiService } from './hosted-checkout-api.service';
import {
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

@Component({
  selector: 'ch-hosted-checkout',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    Button,
    InputOtp,
    InputText,
    Message,
    ProgressSpinner,
    CurrencyPipe,
  ],
  templateUrl: './commercehub-hosted-checkout.html',
  styleUrl: './commercehub-hosted-checkout.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommercehubHostedCheckout {
  private readonly api = inject(HostedCheckoutApiService);
  private readonly formBuilder = inject(FormBuilder);
  private started = false;

  apiBaseUrl = input('http://localhost:8080');
  launchRequest = input.required<HostedCheckoutLaunchRequest>();
  branding = input<Partial<HostedCheckoutBranding>>({});

  checkoutReady = output<string>();
  statusChanged = output<InteractionStatus>();
  completed = output<HostedCheckoutCompletionEvent>();
  failed = output<string>();
  closed = output<void>();

  protected readonly interaction = signal<HostedCheckoutCompletionEvent['interaction'] | null>(null);
  protected readonly isBusy = signal(false);
  protected readonly errorMessage = signal('');
  protected readonly selectedSourceId = signal<string | null>(null);
  protected readonly activeAction = signal<
    'init' | 'send-otp' | 'verify-otp' | 'attach-source' | 'pay' | 'refresh' | ''
  >('');

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

  protected readonly paymentLabel = computed(() => this.launchRequest().payment.callToAction ?? 'Pay now');

  protected readonly maskedEmail = computed(() => this.maskEmail(this.emailForm.controls.email.value ?? ''));

  protected readonly canChangeEmail = computed(
    () => this.interaction()?.allowEmailChange ?? true,
  );

  protected readonly emailForm = this.formBuilder.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
  });

  protected readonly otpForm = this.formBuilder.nonNullable.group({
    otp: ['', [Validators.required, Validators.minLength(6)]],
  });

  constructor() {
    effect(() => {
      const request = this.launchRequest();

      if (request?.interaction?.email) {
        this.emailForm.patchValue({ email: request.interaction.email }, { emitEvent: false });
      }

      if (!this.started) {
        this.started = true;
        queueMicrotask(() => void this.initializeCheckout());
      }
    });
  }

  protected async initializeCheckout(): Promise<void> {
    this.errorMessage.set('');
    this.activeAction.set('init');
    this.isBusy.set(true);

    try {
      const interaction = await firstValueFrom(
        this.api.createInteraction(this.apiBaseUrl(), this.launchRequest().interaction),
      );

      this.applyInteraction(interaction);
      this.checkoutReady.emit(interaction.interactionId);
    } catch (error) {
      this.handleError(error, 'Unable to start hosted checkout.');
    } finally {
      this.isBusy.set(false);
      this.activeAction.set('');
    }
  }

  protected async sendOtp(): Promise<void> {
    this.errorMessage.set('');
    this.emailForm.markAllAsTouched();

    if (this.emailForm.invalid || !this.interaction()?.interactionId) {
      return;
    }

    this.activeAction.set('send-otp');
    this.isBusy.set(true);

    try {
      const interaction = await firstValueFrom(
        this.api.sendOtp(
          this.apiBaseUrl(),
          this.interaction()!.interactionId,
          this.emailForm.controls.email.getRawValue(),
        ),
      );

      this.applyInteraction(interaction);
      this.otpForm.reset();
    } catch (error) {
      this.handleError(error, 'Unable to send a one-time code.');
    } finally {
      this.isBusy.set(false);
      this.activeAction.set('');
    }
  }

  protected async verifyOtp(): Promise<void> {
    this.errorMessage.set('');
    this.otpForm.markAllAsTouched();

    if (this.otpForm.invalid || !this.interaction()?.interactionId) {
      return;
    }

    this.activeAction.set('verify-otp');
    this.isBusy.set(true);

    try {
      const interaction = await firstValueFrom(
        this.api.validateOtp(
          this.apiBaseUrl(),
          this.interaction()!.interactionId,
          this.otpForm.controls.otp.getRawValue(),
        ),
      );

      this.applyInteraction(interaction);

      if (interaction.status === 'OTP_VALIDATION_FAILED') {
        this.errorMessage.set('The verification code did not match. Try again.');
      }
    } catch (error) {
      this.handleError(error, 'Unable to verify the one-time code.');
    } finally {
      this.isBusy.set(false);
      this.activeAction.set('');
    }
  }

  protected async selectAndAttachSource(source: HostedCheckoutPaymentSource): Promise<void> {
    if (!source.id || !this.interaction()?.interactionId) {
      return;
    }

    this.errorMessage.set('');
    this.selectedSourceId.set(source.id);
    this.activeAction.set('attach-source');
    this.isBusy.set(true);

    try {
      const interaction = await firstValueFrom(
        this.api.attachPaymentMethod(this.apiBaseUrl(), this.interaction()!.interactionId, source.id),
      );

      this.applyInteraction(interaction);
    } catch (error) {
      this.handleError(error, 'Unable to attach the selected payment method.');
    } finally {
      this.isBusy.set(false);
      this.activeAction.set('');
    }
  }

  protected async completePayment(): Promise<void> {
    if (!this.interaction()?.interactionId) {
      return;
    }

    this.errorMessage.set('');
    this.activeAction.set('pay');
    this.isBusy.set(true);

    try {
      await firstValueFrom(
        this.api.submitPayment(this.apiBaseUrl(), {
          interactionId: this.interaction()!.interactionId,
          amount: this.launchRequest().payment.amount,
          currency: this.launchRequest().payment.currency,
        }),
      );

      const interaction = await firstValueFrom(
        this.api.getStatus(this.apiBaseUrl(), this.interaction()!.interactionId),
      );

      this.applyInteraction(interaction);
    } catch (error) {
      this.handleError(error, 'Payment could not be completed.');
    } finally {
      this.isBusy.set(false);
      this.activeAction.set('');
    }
  }

  protected async refreshStatus(): Promise<void> {
    if (!this.interaction()?.interactionId) {
      return;
    }

    this.activeAction.set('refresh');
    this.isBusy.set(true);

    try {
      const interaction = await firstValueFrom(
        this.api.getStatus(this.apiBaseUrl(), this.interaction()!.interactionId),
      );
      this.applyInteraction(interaction);
    } catch (error) {
      this.handleError(error, 'Checkout status could not be refreshed.');
    } finally {
      this.isBusy.set(false);
      this.activeAction.set('');
    }
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

  private maskEmail(email: string): string {
    const [name, domain] = email.trim().split('@');

    if (!name || !domain) {
      return email;
    }

    const visible = name.length <= 2 ? name[0] ?? '' : `${name[0]}${name[1]}`;
    return `${visible}${'*'.repeat(Math.max(1, name.length - visible.length))}@${domain}`;
  }
}
