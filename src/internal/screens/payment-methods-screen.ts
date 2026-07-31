import {html, type TemplateResult} from 'lit';

import {
  renderEmptyState,
  renderPaymentMethodRow,
  renderPaymentMethodSkeletonRows,
  renderSourceAction,
} from '../primitives.js';
import type {
  NoSavedPaymentMethodsScreenModel,
  PaymentMethodsScreenModel,
} from '../types.js';

export const renderPaymentMethodsSkeletonScreen = (): TemplateResult => html`
  <div class="payment-flow">
    ${renderPaymentMethodSkeletonRows({
      count: 3,
      label: 'Loading payment methods',
    })}
  </div>
`;

export const renderPaymentMethodsScreen = ({
  methods,
  canAddPaymentSources,
  canSelectPaymentSources,
  actionPending,
  selectedPaymentSourceId,
  openPaymentSourceMenuId,
  paymentSourceMenuPlacement = 'below',
  deleteConfirmationPaymentSourceId,
}: PaymentMethodsScreenModel): TemplateResult => {
  const menuOpen = Boolean(openPaymentSourceMenuId);

  return html`
    <div class="payment-flow">
      <div
        class=${menuOpen
          ? 'primitive-stack primitive-stack-menu-open'
          : 'primitive-stack'}
        aria-label="Payment methods"
      >
        ${methods.map((method) =>
          renderPaymentMethodRow(
            {
              ...method,
              disabled: method.disabled || actionPending,
            },
            {
              deleteDisabled: actionPending,
              confirmingDelete: method.id === deleteConfirmationPaymentSourceId,
              menuOpen: method.id === openPaymentSourceMenuId,
              menuPlacement: paymentSourceMenuPlacement,
              selected: method.id === selectedPaymentSourceId,
              selectable: canSelectPaymentSources,
              showMarkAsDefault:
                canSelectPaymentSources || canAddPaymentSources,
            }
          )
        )}
      </div>
    </div>
  `;
};

export const renderNoSavedPaymentMethodsScreen = ({
  allowedTenderOptions,
  canAddPaymentSources,
  deletePending = false,
  copy,
  showTransferAction = false,
}: NoSavedPaymentMethodsScreenModel): TemplateResult => {
  const showHelperCopy = Boolean(copy.emptyTitle || copy.emptyMessage);
  const hasAddPaymentActions =
    canAddPaymentSources &&
    (allowedTenderOptions.card || allowedTenderOptions.bankAccount);

  return html`
    <div class="payment-flow">
      ${showHelperCopy
        ? renderEmptyState({
            title: copy.emptyTitle,
            message: copy.emptyMessage,
          })
        : ''}
      ${hasAddPaymentActions
        ? html`
            <div class="payment-action-links">
              ${allowedTenderOptions.card
                ? renderSourceAction({
                    label: copy.addCardTitle,
                    subtitle: copy.addCardSubtitle,
                    action: 'add-card',
                    icon: 'card',
                    variant: 'link',
                    disabled: deletePending,
                  })
                : ''}
              ${allowedTenderOptions.bankAccount
                ? renderSourceAction({
                    label: copy.addBankAccountTitle,
                    subtitle: copy.addBankAccountSubtitle,
                    action: 'add-bank-account',
                    icon: 'bank',
                    variant: 'link',
                    disabled: deletePending,
                  })
                : ''}
              ${showTransferAction
                ? renderSourceAction({
                    label: 'Transfer funds',
                    action: 'open-transfer',
                    icon: 'transfer',
                    variant: 'link',
                    disabled: deletePending,
                  })
                : ''}
            </div>
          `
        : ''}
    </div>
  `;
};
