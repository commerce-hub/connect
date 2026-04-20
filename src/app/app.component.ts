import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  CommerceHubConnectCaptureComponent,
  CommerceHubSdkConfiguration,
  CommerceHubSdkError,
  CommerceHubSuccessResult,
  CommerceHubWhiteLabelOptions,
} from 'commerce-hub-connect-sdk';

@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, CommerceHubConnectCaptureComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  protected readonly events = signal<string[]>([]);

  protected readonly sdkConfiguration: CommerceHubSdkConfiguration = {
    sessionReferenceId: 'sdk-demo-session-20260417',
    email: 'gregory.jablonski@fiserv.com',
    authType: 'FINAL_SALE',
    merchantTransactionId: 'txn-10001',
    merchantOrderId: 'order-20002',
    merchantInvoiceNumber: 'invoice-30003',
    expiryMinutes: 30,
    allowEmailChange: true,
    allowedTenderTypes: ['CARD', 'BANK_ACCOUNT', 'DYNAMIC_SESSION_CARD'],
    payByBank: {
      accessToken: 'replace-with-session-token-id',
      encryptionKey: 'replace-with-session-public-key',
    },
    onSuccess: (result: CommerceHubSuccessResult) => this.handleSuccess(result),
    onError: (error: CommerceHubSdkError) => this.handleError(error),
  };

  protected readonly whiteLabel: CommerceHubWhiteLabelOptions = {
    primaryColor: '#0a5dff',
    secondaryColor: '#6b7280',
    textColor: '#0f172a',
    fontFamily: '"Open Sans", "Segoe UI", sans-serif',
  };

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
}
