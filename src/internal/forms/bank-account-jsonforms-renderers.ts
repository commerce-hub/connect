import {rankWith, scopeEndsWith} from '@jsonforms/core';
import {
  JsonFormsControl,
  litRenderers,
  type LitJsonFormsRendererRegistryEntry,
} from '../jsonforms-lit/index.js';
import {html, type TemplateResult} from 'lit';
import {customElement} from 'lit/decorators.js';
import {ifDefined} from 'lit/directives/if-defined.js';

import type {
  BankAccountDraft,
  BankAccountDraftErrors,
  BankAccountEncryptionState,
  SensitiveBankAccountField,
} from '../types.js';
import {bankAccountInputType} from './bank-account-form-state.js';

type BankAccountJsonFormsConfig = {
  draft: BankAccountDraft;
  errors: BankAccountDraftErrors;
  encryption: BankAccountEncryptionState;
  disabled: boolean;
  billingAddressTemplate?: TemplateResult;
};

export const BANK_BILLING_ADDRESS_CONTROL_SCOPE =
  '#/properties/__bankBillingAddress';

const bankAccountFieldIds: Record<keyof BankAccountDraft, string> = {
  accountNickname: 'ach-account-nickname',
  routingNumber: 'ach-routing-number',
  accountNumber: 'ach-account-number',
  confirmAccountNumber: 'ach-account-number-confirm',
};

const sensitiveFields = new Set<keyof BankAccountDraft>([
  'routingNumber',
  'accountNumber',
  'confirmAccountNumber',
]);

const isBankAccountField = (field: string): field is keyof BankAccountDraft =>
  field in bankAccountFieldIds;

const isSensitiveBankAccountJsonFormsField = (
  field: keyof BankAccountDraft
): field is SensitiveBankAccountField => sensitiveFields.has(field);

@customElement('commerce-hub-bank-account-control')
export class CommerceHubBankAccountControl extends JsonFormsControl {
  protected override render() {
    const props = this.controlProps;
    const field = props?.path;

    if (
      props === undefined ||
      props.visible === false ||
      field === undefined ||
      !isBankAccountField(field)
    ) {
      return html``;
    }

    const config = props.config as
      | Partial<BankAccountJsonFormsConfig>
      | undefined;
    const draft = config?.draft;
    const encryption = config?.encryption;
    const value = draft?.[field] ?? props.data ?? '';
    const error = config?.errors?.[field];
    const disabled =
      Boolean(config?.disabled) || !props.enabled || Boolean(props.readonly);
    const type =
      draft && encryption && isSensitiveBankAccountJsonFormsField(field)
        ? bankAccountInputType(field, draft, encryption)
        : 'text';
    const inputmode = isSensitiveBankAccountJsonFormsField(field)
      ? 'numeric'
      : undefined;
    const fieldClasses = ['field', 'field-full', 'field-card-form'];

    if (error) {
      fieldClasses.push('field-invalid');
    }

    return html`
      <div class=${fieldClasses.join(' ')}>
        <label
          class="field-label field-label-card-form"
          for=${bankAccountFieldIds[field]}
        >
          ${props.label}
        </label>
        <div class="field-control field-control-card-form">
          <input
            class="field-input field-input-card-form"
            id=${bankAccountFieldIds[field]}
            name=${field}
            type=${type}
            .value=${String(value)}
            autocomplete="off"
            inputmode=${ifDefined(inputmode)}
            data-bank-account-field=${field}
            aria-invalid=${error ? 'true' : 'false'}
            aria-describedby=${ifDefined(
              error ? `${bankAccountFieldIds[field]}-error` : undefined
            )}
            ?disabled=${disabled}
            @input=${(event: Event) => {
              props.handleChange(
                props.path,
                (event.currentTarget as HTMLInputElement).value
              );
            }}
          />
        </div>
        ${error
          ? html`
              <p
                class="field-error"
                id=${`${bankAccountFieldIds[field]}-error`}
              >
                ${error}
              </p>
            `
          : ''}
      </div>
    `;
  }
}

@customElement('commerce-hub-bank-billing-address-control')
export class CommerceHubBankBillingAddressControl extends JsonFormsControl {
  protected override render() {
    const config = this.controlProps?.config as
      | Partial<BankAccountJsonFormsConfig>
      | undefined;

    return config?.billingAddressTemplate ?? html``;
  }
}

export const bankBillingAddressJsonFormsRenderers: LitJsonFormsRendererRegistryEntry[] =
  [
    ...litRenderers,
    {
      tester: rankWith(20, scopeEndsWith('__bankBillingAddress')),
      renderer: 'commerce-hub-bank-billing-address-control',
    },
  ];

export const bankAccountJsonFormsRenderers: LitJsonFormsRendererRegistryEntry[] =
  [
    ...bankBillingAddressJsonFormsRenderers,
    {
      tester: rankWith(10, scopeEndsWith('accountNickname')),
      renderer: 'commerce-hub-bank-account-control',
    },
    {
      tester: rankWith(10, scopeEndsWith('routingNumber')),
      renderer: 'commerce-hub-bank-account-control',
    },
    {
      tester: rankWith(10, scopeEndsWith('accountNumber')),
      renderer: 'commerce-hub-bank-account-control',
    },
    {
      tester: rankWith(10, scopeEndsWith('confirmAccountNumber')),
      renderer: 'commerce-hub-bank-account-control',
    },
  ];

declare global {
  interface HTMLElementTagNameMap {
    'commerce-hub-bank-account-control': CommerceHubBankAccountControl;
    'commerce-hub-bank-billing-address-control': CommerceHubBankBillingAddressControl;
  }
}
