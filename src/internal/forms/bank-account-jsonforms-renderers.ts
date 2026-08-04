import {or, rankWith, scopeEndsWith} from '@jsonforms/core';
import {
  JsonFormsControl,
  litRenderers,
  type LitJsonFormsRendererRegistryEntry,
} from '../jsonforms-lit/index.js';
import {html, type TemplateResult} from 'lit';
import {customElement, state} from 'lit/decorators.js';
import {ifDefined} from 'lit/directives/if-defined.js';

import {
  renderRevealFieldIcon,
  revealFieldButtonLabel,
} from '../reveal-field-icons.js';

import type {
  BankAccountDraft,
  BankAccountDraftErrors,
  BankAccountEncryptionState,
  SensitiveBankAccountField,
} from '../types.js';
import {bankAccountInputType} from './bank-account-form-state.js';
import {maskRevealText} from './mask-reveal.js';

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

// How long the last typed sensitive character stays visible before it masks.
const LAST_CHAR_REVEAL_TIMEOUT_MS = 1500;

@customElement('commerce-hub-bank-account-control')
export class CommerceHubBankAccountControl extends JsonFormsControl {
  @state()
  private revealed = false;

  @state()
  private revealLastChar = false;

  private revealLastCharTimeoutId?: number;

  override disconnectedCallback() {
    super.disconnectedCallback();
    this.clearLastCharReveal();
  }

  private armLastCharReveal() {
    this.revealLastChar = true;
    if (this.revealLastCharTimeoutId !== undefined) {
      window.clearTimeout(this.revealLastCharTimeoutId);
    }
    this.revealLastCharTimeoutId = window.setTimeout(() => {
      this.revealLastChar = false;
      this.revealLastCharTimeoutId = undefined;
    }, LAST_CHAR_REVEAL_TIMEOUT_MS);
  }

  private clearLastCharReveal() {
    if (this.revealLastCharTimeoutId !== undefined) {
      window.clearTimeout(this.revealLastCharTimeoutId);
      this.revealLastCharTimeoutId = undefined;
    }
    this.revealLastChar = false;
  }

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
    const baseType =
      draft && encryption && isSensitiveBankAccountJsonFormsField(field)
        ? bankAccountInputType(field, draft, encryption)
        : 'text';
    const maskable = baseType === 'password';
    const type = maskable ? 'text' : baseType;
    const stringValue = String(value);
    const overlayHidesText = maskable && !this.revealed && stringValue !== '';
    const maskRevealValue = this.revealed
      ? ''
      : maskRevealText(stringValue, this.revealLastChar);
    const inputmode = isSensitiveBankAccountJsonFormsField(field)
      ? 'numeric'
      : undefined;
    const fieldClasses = ['field', 'field-full', 'field-card-form'];

    if (error) {
      fieldClasses.push('field-invalid');
    }

    const controlClasses = ['field-control', 'field-control-card-form'];

    if (maskable) {
      controlClasses.push('field-control-reveal');
    }

    const inputTemplate = html`
      <input
        class=${overlayHidesText
          ? 'field-input field-input-card-form field-input-mask-hidden'
          : 'field-input field-input-card-form'}
        id=${bankAccountFieldIds[field]}
        name=${field}
        type=${type}
        .value=${stringValue}
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
          if (maskable) {
            this.armLastCharReveal();
          }
        }}
        @blur=${() => {
          if (maskable) {
            this.clearLastCharReveal();
          }
        }}
      />
    `;

    return html`
      <div class=${fieldClasses.join(' ')}>
        <label
          class="field-label field-label-card-form"
          for=${bankAccountFieldIds[field]}
        >
          ${props.label}
        </label>
        <div class=${controlClasses.join(' ')}>
          ${maskable
            ? html`
                <div class="field-input-mask-wrap">
                  ${inputTemplate}
                  <span class="field-input-mask-overlay" aria-hidden="true"
                    >${maskRevealValue}</span
                  >
                </div>
              `
            : inputTemplate}
          ${maskable
            ? html`
                <button
                  class="field-reveal-toggle"
                  type="button"
                  aria-label=${revealFieldButtonLabel(this.revealed)}
                  aria-pressed=${this.revealed ? 'true' : 'false'}
                  aria-controls=${bankAccountFieldIds[field]}
                  ?disabled=${disabled}
                  @click=${() => {
                    this.revealed = !this.revealed;
                  }}
                >
                  ${renderRevealFieldIcon(this.revealed)}
                </button>
              `
            : ''}
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

// Stopgap: sensitive fields for the config-driven ACH form are matched by name
// until the instrument schema carries a `writeOnly`/`x-sensitive` flag.
const CONFIG_DRIVEN_SENSITIVE_SCOPES = [
  'accountNumber',
  'bsbCode',
  'interacAccount',
];

export const configDrivenBankAccountJsonFormsRenderers: LitJsonFormsRendererRegistryEntry[] =
  [
    ...bankBillingAddressJsonFormsRenderers,
    {
      tester: rankWith(
        20,
        or(
          ...CONFIG_DRIVEN_SENSITIVE_SCOPES.map((scope) => scopeEndsWith(scope))
        )
      ),
      renderer: 'jsonforms-lit-sensitive-text-control',
    },
  ];

declare global {
  interface HTMLElementTagNameMap {
    'commerce-hub-bank-account-control': CommerceHubBankAccountControl;
    'commerce-hub-bank-billing-address-control': CommerceHubBankBillingAddressControl;
  }
}
