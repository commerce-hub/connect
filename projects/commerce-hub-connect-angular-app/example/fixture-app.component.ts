import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, signal } from '@angular/core';

import {
  CommerceHubConnectWebSdkComponent,
  type CommerceHubConnectEnvironment,
  type CommerceHubSdkConfiguration,
  type CommerceHubSdkError,
  type CommerceHubSuccessResult,
  type CommerceHubWhiteLabelOptions,
  type InteractionResponse,
} from 'commerce-hub-connect-sdk';

type FixtureStatus = 'running' | 'passed' | 'failed';

const initialInteraction: InteractionResponse = {
  interactionId: 'interaction-1',
  status: 'EMAIL_REQUESTED',
  allowedTenderTypes: ['CARD'],
  allowEmailChange: true,
};

const updatedInteraction: InteractionResponse = {
  ...initialInteraction,
  status: 'PAYMENT_SOURCE_REQUESTED',
  paymentSources: [
    {
      id: 'card-1',
      name: 'Primary Visa',
      tenderType: 'CARD',
      card: {
        cardNumber: '4111111111111111',
        cvv: '***',
        expirationMonth: '12',
        expirationYear: '30',
        nameOnCard: 'Smoke Tester',
        network: 'Visa',
      },
    },
  ],
};

@Component({
  selector: 'ch-angular-fixture-root',
  standalone: true,
  imports: [CommonModule, CommerceHubConnectWebSdkComponent],
  templateUrl: './fixture-app.component.html',
  styleUrl: './fixture-app.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AngularBindingFixtureAppComponent implements AfterViewInit {
  protected readonly bindingMounted = signal(true);
  protected readonly interaction = signal(initialInteraction);
  protected readonly configuration = signal(this.createConfiguration());
  protected readonly whiteLabel = signal<CommerceHubWhiteLabelOptions>({ primaryColor: '#0a5dff' });
  protected readonly environment = signal<CommerceHubConnectEnvironment>('qa');
  protected readonly status = signal<FixtureStatus>('running');
  protected readonly message = signal('Mounting the Angular binding...');

  ngAfterViewInit(): void {
    void this.runScenario();
  }

  private async runScenario(): Promise<void> {
    try {
      await this.waitFor(() => document.body.textContent?.includes('Sign in'));

      this.message.set('Updating the Angular binding...');
      this.interaction.set(updatedInteraction);
      this.configuration.set(this.createConfiguration('Saved methods'));
      this.whiteLabel.set({ primaryColor: '#1d4ed8' });
      await this.waitFor(() => document.body.textContent?.includes('Saved methods'));

      this.message.set('Unmounting the Angular binding...');
      this.bindingMounted.set(false);
      await this.waitFor(
        () => !document.querySelector('[data-commerce-hub-connect-angular-binding="true"]'),
      );

      this.message.set('Angular binding lifecycle passed.');
      this.status.set('passed');
    } catch (error) {
      this.status.set('failed');
      this.message.set(error instanceof Error ? error.message : String(error));
    }
  }

  private createConfiguration(
    paymentSelectionTitle: string = 'Select a payment method',
  ): CommerceHubSdkConfiguration {
    return {
      onSuccess: (_result: CommerceHubSuccessResult) => undefined,
      onError: (_error: CommerceHubSdkError) => undefined,
      paymentSelectionTitle,
    };
  }

  private async waitFor(
    condition: () => unknown,
    timeoutMs: number = 5000,
    intervalMs: number = 50,
  ): Promise<void> {
    const startedAt = Date.now();

    while (Date.now() - startedAt < timeoutMs) {
      if (condition()) {
        return;
      }

      await this.delay(intervalMs);
    }

    this.assertFixture(condition(), 'The Angular binding fixture timed out.');
  }

  private delay(timeoutMs: number): Promise<void> {
    return new Promise((resolve) => {
      window.setTimeout(resolve, timeoutMs);
    });
  }

  private assertFixture(condition: unknown, message: string): asserts condition {
    if (!condition) {
      throw new Error(message);
    }
  }
}
