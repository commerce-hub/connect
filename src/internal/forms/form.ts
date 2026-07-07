import type {BankAccountDraft} from '../types.js';

export type BankAccountFormField = keyof BankAccountDraft;

export type BankAccountFormErrorKeyword =
  | 'required'
  | 'minLength'
  | 'maxLength'
  | 'pattern'
  | 'equals';

export type BankAccountFormFieldSchema = {
  type: 'string';
  title?: string;
  description?: string;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  'x-equalsField'?: BankAccountFormField;
  'x-errorMessages'?: Partial<Record<BankAccountFormErrorKeyword, string>>;
};

export type BankAccountFormSchema = {
  type: 'object';
  properties: Record<BankAccountFormField, BankAccountFormFieldSchema>;
  required: BankAccountFormField[];
};

export const bankAccountFormSchema: BankAccountFormSchema = {
  type: 'object',
  properties: {
    accountNickname: {
      type: 'string',
      minLength: 3,
      description: 'Please enter the account nickname',
      title: 'Account Nickname',
      'x-errorMessages': {
        required: 'Enter an account nickname of at least 3 characters.',
        minLength: 'Enter an account nickname of at least 3 characters.',
      },
    },
    routingNumber: {
      type: 'string',
      description: 'Please enter the routing number',
      title: 'Routing number',
      minLength: 9,
      maxLength: 9,
      pattern: '^[0-9]{9}$',
      'x-errorMessages': {
        required: 'Enter a routing number.',
        minLength: 'Enter a 9-digit routing number.',
        maxLength: 'Enter a 9-digit routing number.',
        pattern: 'Enter a 9-digit routing number.',
      },
    },
    accountNumber: {
      type: 'string',
      description: 'Please enter the account number',
      title: 'Account number',
      minLength: 9,
      maxLength: 9,
      pattern: '^[0-9]{9}$',
      'x-errorMessages': {
        required: 'Enter an account number.',
        minLength: 'Enter a 9-digit account number.',
        maxLength: 'Enter a 9-digit account number.',
        pattern: 'Enter a 9-digit account number.',
      },
    },
    confirmAccountNumber: {
      type: 'string',
      description: 'Confirm the account number',
      title: 'Confirm account number',
      minLength: 9,
      maxLength: 9,
      pattern: '^[0-9]{9}$',
      'x-equalsField': 'accountNumber',
      'x-errorMessages': {
        required: 'Confirm the account number.',
        minLength: 'Enter a 9-digit account number.',
        maxLength: 'Enter a 9-digit account number.',
        pattern: 'Enter a 9-digit account number.',
        equals: 'Account numbers must match.',
      },
    },
  },
  required: [
    'accountNickname',
    'routingNumber',
    'accountNumber',
    'confirmAccountNumber',
  ],
};

export const getBankAccountFieldSchema = (
  field: BankAccountFormField
): BankAccountFormFieldSchema => bankAccountFormSchema.properties[field];

export const getBankAccountFieldErrorMessage = (
  field: BankAccountFormField,
  keyword: BankAccountFormErrorKeyword,
  fallback: string
): string =>
  getBankAccountFieldSchema(field)['x-errorMessages']?.[keyword] ?? fallback;

export const getBankAccountEqualsField = (
  field: BankAccountFormField
): BankAccountFormField | undefined =>
  getBankAccountFieldSchema(field)['x-equalsField'];
