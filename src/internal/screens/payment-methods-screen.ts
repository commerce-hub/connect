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
  const menuOpen = methods.some(
    (method) => method.id === openPaymentSourceMenuId && !method.isDefault
  );

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
  tenders,
  canAddPaymentSources,
  deletePending = false,
  copy,
  showTransferAction = false,
}: NoSavedPaymentMethodsScreenModel): TemplateResult => {
  const showHelperCopy = Boolean(copy.emptyTitle || copy.emptyMessage);
  const hasAddPaymentActions = canAddPaymentSources && tenders.length > 0;

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
              ${tenders.map((tender) =>
                renderSourceAction({
                  label: tender.title,
                  subtitle: tender.subtitle,
                  action: tender.action,
                  icon: tender.icon,
                  brandImage: tender.brandImage,
                  disabled: deletePending,
                })
              )}
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
