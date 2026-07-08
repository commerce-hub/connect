import {rankWith, scopeEndsWith} from '@jsonforms/core';
import {html} from 'lit';
import {customElement} from 'lit/decorators.js';

import type {
  CardDraft,
  CardDraftErrors,
  SelectFieldOption,
  TextFieldAutocomplete,
  TextFieldInputMode,
} from '../types.js';
import {
  JsonFormsControl,
  litRenderers,
  type LitJsonFormsRendererRegistryEntry,
} from '../jsonforms-lit/index.js';
import {renderSelectField, renderTextField} from '../primitives.js';
import {NEW_BILLING_ADDRESS_VALUE} from './card-form-state.js';

type CardJsonFormsConfig = {
  draft: CardDraft;
  errors: CardDraftErrors;
  disabled: boolean;
  billingAddressOptions: SelectFieldOption[];
  countryOptions: SelectFieldOption[];
  stateOptions: SelectFieldOption[];
};

type CardTextFieldMetadata = {
  id: string;
  span?: 'default' | 'full';
  placeholder?: string;
  autocomplete?: TextFieldAutocomplete;
  inputmode?: TextFieldInputMode;
};

const cardFieldIds: Record<keyof CardDraft, string> = {
  name: 'card-label',
  cardNumber: 'card-number',
  expirationDate: 'expiration-date',
  cvv: 'card-cvv',
  fullName: 'name-on-card',
  billingAddressValue: 'billing-address',
  country: 'billing-country',
  addressLine1: 'billing-address-line-1',
  addressLine2: 'billing-address-line-2',
  city: 'billing-city',
  state: 'billing-state',
  zip: 'billing-zip',
};

const cardTextFieldMetadata: Partial<
  Record<keyof CardDraft, CardTextFieldMetadata>
> = {
  name: {
    id: cardFieldIds.name,
    span: 'full',
    placeholder: 'Corporate card',
  },
  cardNumber: {
    id: cardFieldIds.cardNumber,
    span: 'full',
    placeholder: '1234 1234 1234 1234',
    autocomplete: 'cc-number',
    inputmode: 'numeric',
  },
  expirationDate: {
    id: cardFieldIds.expirationDate,
    placeholder: 'MM / YY',
    autocomplete: 'cc-exp',
    inputmode: 'numeric',
  },
  cvv: {
    id: cardFieldIds.cvv,
    placeholder: '3 or 4 digits',
    autocomplete: 'cc-csc',
    inputmode: 'numeric',
  },
  fullName: {
    id: cardFieldIds.fullName,
    span: 'full',
    placeholder: 'Name on card',
    autocomplete: 'cc-name',
  },
  addressLine1: {
    id: cardFieldIds.addressLine1,
    span: 'full',
    placeholder: 'Street address',
    autocomplete: 'address-line1',
  },
  addressLine2: {
    id: cardFieldIds.addressLine2,
    span: 'full',
    placeholder: 'Apartment, suite, unit',
    autocomplete: 'address-line2',
  },
  city: {
    id: cardFieldIds.city,
    span: 'full',
    autocomplete: 'address-level2',
  },
  zip: {
    id: cardFieldIds.zip,
    span: 'full',
    placeholder: 'ZIP code',
    autocomplete: 'postal-code',
    inputmode: 'numeric',
  },
};

const cardSelectFields = new Set<keyof CardDraft>([
  'billingAddressValue',
  'country',
  'state',
]);

const newBillingAddressFields = new Set<keyof CardDraft>([
  'country',
  'addressLine1',
  'addressLine2',
  'city',
  'state',
  'zip',
]);

const isCardJsonFormsField = (field: string): field is keyof CardDraft =>
  field in cardFieldIds;

const shouldRenderCardField = (
  field: keyof CardDraft,
  draft?: CardDraft
): boolean =>
  !newBillingAddressFields.has(field) ||
  draft?.billingAddressValue === NEW_BILLING_ADDRESS_VALUE;

const cardSelectOptions = (
  field: keyof CardDraft,
  config?: Partial<CardJsonFormsConfig>
): SelectFieldOption[] => {
  if (field === 'billingAddressValue') {
    return config?.billingAddressOptions ?? [];
  }

  if (field === 'country') {
    return config?.countryOptions ?? [];
  }

  if (field === 'state') {
    return config?.stateOptions ?? [];
  }

  return [];
};

@customElement('commerce-hub-card-control')
export class CommerceHubCardControl extends JsonFormsControl {
  protected override render() {
    const props = this.controlProps;
    const field = props?.path;

    if (
      props === undefined ||
      props.visible === false ||
      field === undefined ||
      !isCardJsonFormsField(field)
    ) {
      return html``;
    }

    const config = props.config as Partial<CardJsonFormsConfig> | undefined;
    const draft = config?.draft;

    if (!shouldRenderCardField(field, draft)) {
      return html``;
    }

    const disabled =
      Boolean(config?.disabled) || !props.enabled || Boolean(props.readonly);
    const value = draft?.[field] ?? props.data ?? '';
    const error = config?.errors?.[field];

    if (cardSelectFields.has(field)) {
      return html`
        <div
          @change=${(event: Event) => {
            props.handleChange(
              props.path,
              (event.target as HTMLSelectElement).value
            );
          }}
        >
          ${renderSelectField({
            id: cardFieldIds[field],
            name: field === 'billingAddressValue' ? 'billingAddress' : field,
            label: props.label,
            value: String(value),
            options: cardSelectOptions(field, config),
            span: 'full',
            variant: 'card-form',
            dataField: field,
            error,
            disabled,
          })}
        </div>
      `;
    }

    const metadata = cardTextFieldMetadata[field];

    if (metadata === undefined) {
      return html``;
    }

    return html`
      <div
        @input=${(event: Event) => {
          props.handleChange(
            props.path,
            (event.target as HTMLInputElement).value
          );
        }}
      >
        ${renderTextField({
          id: metadata.id,
          name: field,
          label: props.label,
          value: String(value),
          placeholder: metadata.placeholder,
          span: metadata.span,
          variant: 'card-form',
          autocomplete: metadata.autocomplete,
          inputmode: metadata.inputmode,
          dataField: field,
          error,
          disabled,
        })}
      </div>
    `;
  }
}

export const cardJsonFormsRenderers: LitJsonFormsRendererRegistryEntry[] = [
  ...litRenderers,
  ...Object.keys(cardFieldIds).map((field) => ({
    tester: rankWith(10, scopeEndsWith(field)),
    renderer: 'commerce-hub-card-control',
  })),
];

declare global {
  interface HTMLElementTagNameMap {
    'commerce-hub-card-control': CommerceHubCardControl;
  }
}
