import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';

import {
  CommerceHubConnectWebSdkComponent,
  type CommerceHubConnectEnvironment,
  type CommerceHubSdkConfiguration,
  type CommerceHubSdkError,
  type CommerceHubTenderType,
  type CommerceHubWhiteLabelOptions,
  type InteractionResponse,
} from 'commerce-hub-connect-sdk';
import { resolveApiBaseUrl } from 'commerce-hub-connect-web-sdk';

type ExampleStatusTone = 'neutral' | 'success' | 'error';

type ExampleFormValue = {
  environment: CommerceHubConnectEnvironment;
  email: string;
  clientId: string;
  merchantId: string;
  terminalId: string;
  paymentSelectionTitle: string;
  paymentSelectionConfirmLabel: string;
  primaryColor: string;
  secondaryColor: string;
  textColor: string;
  logoUrl: string;
  wallet: boolean;
  allowCard: boolean;
  allowBankAccount: boolean;
};

@Component({
  selector: 'ch-angular-example-root',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CommerceHubConnectWebSdkComponent],
  templateUrl: './example-app.component.html',
  styleUrl: './example-app.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AngularBindingExampleAppComponent {
  private readonly http = inject(HttpClient);
  private readonly formBuilder = inject(FormBuilder);

  protected readonly form = this.formBuilder.nonNullable.group({
    environment: 'qa' as CommerceHubConnectEnvironment,
    email: 'gregory.jablonski@fiserv.com',
    clientId: 'marriot',
    merchantId: '101475000000009',
    terminalId: '10000001',
    paymentSelectionTitle: 'Pay with',
    paymentSelectionConfirmLabel: 'Confirm',
    primaryColor: '#0a5dff',
    secondaryColor: '#627d98',
    textColor: '#0f172a',
    logoUrl: '',
    wallet: true,
    allowCard: true,
    allowBankAccount: true,
  });

  protected readonly activeInteraction = signal<InteractionResponse | null>(null);
  protected readonly activeConfiguration = signal<CommerceHubSdkConfiguration | null>(null);
  protected readonly activeWhiteLabel = signal<CommerceHubWhiteLabelOptions | null>(null);
  protected readonly activeEnvironment = signal<CommerceHubConnectEnvironment>('qa');
  protected readonly eventLog = signal<string[]>([]);
  protected readonly statusTone = signal<ExampleStatusTone>('neutral');
  protected readonly statusMessage = signal(
    'Create an interaction to mount the Angular binding.',
  );
  protected readonly isBusy = signal(false);
  protected readonly environmentOptions: CommerceHubConnectEnvironment[] = [
    'dev',
    'qa',
    'cat',
    'prod',
  ];
  protected readonly resolvedApiBaseUrl = computed(() =>
    resolveApiBaseUrl(this.form.controls.environment.getRawValue()),
  );
  protected readonly formattedEventLog = computed(() =>
    this.eventLog().length ? this.eventLog().join('\n\n') : 'No events yet.',
  );

  protected async createAndMount(): Promise<void> {
    const formValue = this.form.getRawValue();

    this.isBusy.set(true);
    this.statusTone.set('neutral');
    this.statusMessage.set('Creating a Commerce Hub interaction...');

    try {
      const interaction = await firstValueFrom(
        this.http.post<InteractionResponse>(
          `${resolveApiBaseUrl(formValue.environment)}/merchant/interaction/create`,
          {
            sessionReferenceId: `angular-binding-example-${Date.now()}`,
            authType: 'FINAL_SALE',
            email: formValue.email,
            allowedTenderTypes: this.resolveAllowedTenderTypes(formValue),
            merchantData: this.buildMerchantData(formValue),
            wallet: formValue.wallet,
            allowEmailChange: true,
          },
        ),
      );

      this.activeInteraction.set(interaction);
      this.activeConfiguration.set(this.buildConfiguration(formValue));
      this.activeWhiteLabel.set(this.buildWhiteLabel(formValue));
      this.activeEnvironment.set(formValue.environment);
      this.statusTone.set('success');
      this.statusMessage.set(`Mounted interaction ${interaction.interactionId}.`);
      this.appendLog('mount', interaction);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      this.statusTone.set('error');
      this.statusMessage.set(message);
      this.appendLog('mount error', message);
    } finally {
      this.isBusy.set(false);
    }
  }

  protected applyUpdate(): void {
    const interaction = this.activeInteraction();
    if (!interaction) {
      const message = 'Mount the widget before applying updates.';
      this.statusTone.set('error');
      this.statusMessage.set(message);
      this.appendLog('update', message);
      return;
    }

    const formValue = this.form.getRawValue();
    this.activeConfiguration.set(this.buildConfiguration(formValue));
    this.activeWhiteLabel.set(this.buildWhiteLabel(formValue));
    this.activeEnvironment.set(formValue.environment);
    this.statusTone.set('success');
    this.statusMessage.set('Applied the latest host controls to the Angular binding.');
    this.appendLog('update', {
      environment: formValue.environment,
      paymentSelectionTitle: formValue.paymentSelectionTitle,
      allowedTenderTypes: this.resolveAllowedTenderTypes(formValue),
    });
  }

  protected destroyBinding(): void {
    const interaction = this.activeInteraction();
    if (!interaction) {
      const message = 'Nothing is mounted yet.';
      this.statusTone.set('neutral');
      this.statusMessage.set(message);
      this.appendLog('destroy', message);
      return;
    }

    this.activeInteraction.set(null);
    this.activeConfiguration.set(null);
    this.activeWhiteLabel.set(null);
    this.statusTone.set('neutral');
    this.statusMessage.set('Destroyed the mounted Angular binding instance.');
    this.appendLog('destroy', `Destroyed interaction ${interaction.interactionId}.`);
  }

  private buildConfiguration(formValue: ExampleFormValue): CommerceHubSdkConfiguration {
    return {
      email: formValue.email,
      wallet: formValue.wallet,
      paymentSelectionTitle: formValue.paymentSelectionTitle,
      paymentSelectionConfirmLabel: formValue.paymentSelectionConfirmLabel,
      onSuccess: (interaction: InteractionResponse) => this.appendLog('onSuccess', interaction),
      onError: (error: CommerceHubSdkError) => this.appendLog('onError', error),
    };
  }

  private buildWhiteLabel(formValue: ExampleFormValue): CommerceHubWhiteLabelOptions {
    return {
      primaryColor: formValue.primaryColor,
      secondaryColor: formValue.secondaryColor,
      textColor: formValue.textColor,
      logoUrl: formValue.logoUrl || undefined,
    };
  }

  private resolveAllowedTenderTypes(formValue: ExampleFormValue): CommerceHubTenderType[] {
    const allowed: CommerceHubTenderType[] = [];

    if (formValue.allowCard) {
      allowed.push('CARD');
    }

    if (formValue.allowBankAccount) {
      allowed.push('BANK_ACCOUNT');
    }

    return allowed.length ? allowed : ['CARD'];
  }

  private buildMerchantData(formValue: ExampleFormValue): {
    clientId: string;
    merchantId: string;
    terminalId: string;
  } {
    return {
      clientId: formValue.clientId,
      merchantId: formValue.merchantId,
      terminalId: formValue.terminalId,
    };
  }

  private appendLog(label: string, payload?: unknown): void {
    const lines = [`[${new Date().toLocaleTimeString()}] ${label}`];

    if (payload !== undefined) {
      lines.push(typeof payload === 'string' ? payload : JSON.stringify(payload, null, 2));
    }

    this.eventLog.update((entries) => [lines.join('\n'), ...entries]);
  }
}
