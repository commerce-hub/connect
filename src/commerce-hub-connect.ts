import {LitElement, html, type PropertyValues} from 'lit';
import {customElement, property} from 'lit/decorators.js';

import type {components} from './generated/openapi.js';
import {primitiveStyles} from './internal/styles.js';
import {
  renderButton,
  renderPaymentMethodRow,
  renderSourceAction,
  renderWidgetShell,
} from './internal/primitives.js';
import type {PaymentMethod} from './internal/types.js';

export {
  createCommerceHubClient,
  type CommerceHubClient,
  type CommerceHubClientOptions,
} from './internal/api-client.js';
export type {components, operations, paths} from './generated/openapi.js';

export type InteractionResponse = components['schemas']['InteractionResponse'];
export interface InteractionError {
  code?: string;
  message: string;
  cause?: unknown;
}

export type OnSuccessEvent = CustomEvent<InteractionResponse>;
export type OnErrorEvent = CustomEvent<InteractionError>;

export const ON_SUCCESS_EVENT = 'onSuccess';
export const ON_ERROR_EVENT = 'onError';

type PaymentSource = NonNullable<InteractionResponse['paymentSources']>[number];

const demoPaymentMethods: PaymentMethod[] = [
  {
    id: 'visa-1111',
    label: 'James Anderson',
    type: 'card',
    brand: 'VISA',
    last4: '1111',
    status: 'verified',
    selected: true,
  },
  {
    id: 'amex-8000',
    label: 'James Anderson',
    type: 'card',
    brand: 'AMEX',
    last4: '8000',
    status: 'unverified',
  },
];

/**
 * CommerceHub Connect Web SDK widget shell.
 *
 * The current implementation renders internal primitive examples from the
 * Figma source of truth. Flow behavior and CommerceHub API integration will be
 * layered on top of these primitives in later slices.
 *
 * @cssprop --chc-primary - Primary action color.
 * @cssprop --chc-text - Primary text color.
 * @cssprop --chc-copy - Secondary copy color.
 * @cssprop --chc-muted - Muted helper text color.
 * @cssprop --chc-border - Control border color.
 * @fires onSuccess - Emits an InteractionResponse object to the host.
 * @fires onError - Emits an InteractionError object to the host.
 */
@customElement('commerce-hub-connect')
export class CommerceHubConnect extends LitElement {
  static override styles = primitiveStyles;

  @property({attribute: false})
  interactionResponse?: InteractionResponse;

  protected override updated(changedProperties: PropertyValues<this>) {
    if (
      changedProperties.has('interactionResponse') &&
      this.interactionResponse
    ) {
      this.emitSuccess(this.interactionResponse);
    }
  }

  override render() {
    const paymentMethods = paymentMethodsFromInteractionResponse(
      this.interactionResponse
    );

    return renderWidgetShell({
      title: 'Payment methods',
      subtitle:
        'Use a saved bank account or credit card, or add a new payment method.',
      content: html`
        <div
          class="primitive-stack"
          role="radiogroup"
          aria-label="Payment methods"
        >
          ${paymentMethods.map((method) => renderPaymentMethodRow(method))}
        </div>
        <div class="primitive-actions">
          ${renderSourceAction({
            label: 'Add new bank account',
            subtitle: 'Connect a different account',
            action: 'add-bank-account',
            icon: 'bank',
          })}
          ${renderSourceAction({
            label: 'Add credit card',
            subtitle: 'Use card number and CVV',
            action: 'add-card',
            icon: 'card',
          })}
        </div>
        <div class="primitive-footer">
          ${renderButton({
            label: 'Continue with selected method',
            variant: 'primary',
            action: 'confirm',
          })}
        </div>
      `,
    });
  }

  protected emitSuccess(interactionResponse: InteractionResponse) {
    this.dispatchOutputEvent(ON_SUCCESS_EVENT, interactionResponse);
  }

  protected emitError(interactionError: InteractionError) {
    this.dispatchOutputEvent(ON_ERROR_EVENT, interactionError);
  }

  private dispatchOutputEvent<Detail>(name: string, detail: Detail) {
    this.dispatchEvent(
      new CustomEvent<Detail>(name, {
        detail,
        bubbles: true,
        composed: true,
      })
    );
  }
}

const paymentMethodsFromInteractionResponse = (
  interactionResponse?: InteractionResponse
): PaymentMethod[] => {
  const paymentSources = interactionResponse?.paymentSources;

  if (!paymentSources?.length) {
    return demoPaymentMethods;
  }

  const selectedSourceId = interactionResponse?.selectedSource?.id;

  return paymentSources.map((source) =>
    paymentSourceToPaymentMethod(source, selectedSourceId)
  );
};

const paymentSourceToPaymentMethod = (
  source: PaymentSource,
  selectedSourceId?: string
): PaymentMethod => ({
  id: source.id ?? source.name ?? source.tenderType,
  label: source.name ?? paymentSourceLabel(source),
  type: source.tenderType === 'BankAccount' ? 'bank' : 'card',
  brand: paymentSourceBrand(source),
  last4: paymentSourceLast4(source),
  status: verificationStatusToPaymentMethodStatus(
    source.verificationInfo?.status
  ),
  selected: Boolean(source.id && source.id === selectedSourceId),
});

const paymentSourceLabel = (source: PaymentSource): string => {
  if (source.tenderType === 'Card') {
    return 'Saved card';
  }

  if (source.tenderType === 'BankAccount') {
    return 'Saved bank account';
  }

  return 'Dynamic session card';
};

const paymentSourceBrand = (source: PaymentSource): string => {
  if (source.tenderType === 'Card') {
    return source.card?.network ?? 'Card';
  }

  if (source.tenderType === 'BankAccount') {
    return source.bankAccount?.bankName ?? 'Bank account';
  }

  return 'DSC';
};

const paymentSourceLast4 = (source: PaymentSource): string => {
  if (source.tenderType === 'Card') {
    return lastFour(source.card?.cardNumber);
  }

  if (source.tenderType === 'BankAccount') {
    return lastFour(source.bankAccount?.accountNumber);
  }

  return lastFour(source.id);
};

const lastFour = (value?: string): string =>
  value && value.length >= 4 ? value.slice(-4) : '----';

const verificationStatusToPaymentMethodStatus = (
  status?: NonNullable<PaymentSource['verificationInfo']>['status']
): PaymentMethod['status'] => {
  if (status === 'VERIFIED') {
    return 'verified';
  }

  if (status === 'UNDER_REVIEW' || status === 'REQUIRE_INFO') {
    return 'pending';
  }

  return 'unverified';
};

declare global {
  interface HTMLElementEventMap {
    [ON_SUCCESS_EVENT]: OnSuccessEvent;
    [ON_ERROR_EVENT]: OnErrorEvent;
  }

  interface HTMLElementTagNameMap {
    'commerce-hub-connect': CommerceHubConnect;
  }
}
