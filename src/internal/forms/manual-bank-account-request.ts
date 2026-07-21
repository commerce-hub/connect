import type {components} from '../../generated/openapi.js';
import type {ConfigInstrumentSchema} from './instrument-schema.js';

type Address = components['schemas']['Address'];
type ManualBankBillingAddress = Address & {state?: string};

const CANADIAN_ROUTING_NUMBER = '1223';

export type ManualBankAccountRequest = {
  id: string;
  name: string;
  billingAddressId: string;
  productCode: string;
  tenderType: 'BANK_ACCOUNT';
  accountHolderType?: 'BUSINESS' | 'PERSONAL';
  bankAccount: components['schemas']['BankAccountDetail'];
};

export type SourceValueEncryptor = (value: string) => Promise<string>;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const stringValue = (value: unknown): string =>
  typeof value === 'string' ? value.trim() : '';

const formValue = (
  data: Record<string, unknown>,
  ...keys: string[]
): string => {
  for (const key of keys) {
    const value = stringValue(data[key]);

    if (value) {
      return value;
    }
  }

  return '';
};

const isInteracSchema = (schema: ConfigInstrumentSchema): boolean =>
  schema.productId === 'POINTERAC' ||
  schema.bavSupportedCode.toUpperCase().includes('INTERAC');

const isCanadianSchema = (schema: ConfigInstrumentSchema): boolean =>
  schema.countryCode.toUpperCase() === 'CA';

const accountHolderType = (
  schema: ConfigInstrumentSchema
): 'BUSINESS' | 'PERSONAL' | undefined => {
  if (!isCanadianSchema(schema)) {
    return undefined;
  }

  return schema.bavSupportedCode.toUpperCase().endsWith('-B')
    ? 'BUSINESS'
    : 'PERSONAL';
};

export const createManualBankBillingAddress = (
  data: Record<string, unknown>,
  id: string
): ManualBankBillingAddress => {
  const address = isRecord(data.address) ? data.address : {};

  return {
    id,
    recipientNameOrAddress: formValue(
      data,
      'accountHolderName',
      'accountNickname'
    ),
    street: formValue(address, 'firstLine'),
    city: formValue(address, 'city'),
    state: formValue(address, 'state'),
    postalCode: formValue(address, 'postCode'),
    country: formValue(address, 'country'),
  };
};

export const createManualBankAccountRequest = (
  data: Record<string, unknown>,
  schema: ConfigInstrumentSchema,
  billingAddressId: string,
  id: string
): ManualBankAccountRequest => {
  const interac = isInteracSchema(schema);
  const canadian = isCanadianSchema(schema);
  const accountNumber = interac
    ? formValue(data, 'interacAccount')
    : formValue(data, 'accountNumber');
  const bankAccount: components['schemas']['BankAccountDetail'] = {
    accountNumber,
    accountNumberReEntered:
      formValue(data, 'confirmAccountNumber') || accountNumber,
    asset: {
      type: 'CURRENCY',
      id: schema.currencyCode,
    },
  };

  if (interac) {
    bankAccount.accountType = 'CHECKING';
    bankAccount.accountIdentificationNumberType = 'INTERAC';
  } else if (canadian) {
    bankAccount.accountType = 'CHECKING';
    bankAccount.routingNumber = CANADIAN_ROUTING_NUMBER;
    bankAccount.institutionNumber = formValue(data, 'institutionNumber');
    bankAccount.transitNumber = formValue(data, 'transitNumber');
    bankAccount.accountIdentificationNumberType = 'CANADIAN';
  } else {
    const bankName = formValue(data, 'bankName');
    const accountType = formValue(data, 'accountType');

    bankAccount.routingNumber = formValue(data, 'routingNumber');
    bankAccount.country =
      schema.countryCode.toUpperCase() === 'US'
        ? 'USA'
        : schema.countryCode.toUpperCase();

    if (bankName) {
      bankAccount.bankName = bankName;
    }
    if (accountType) {
      bankAccount.accountType = accountType;
    }
  }

  const holderType = accountHolderType(schema);

  return {
    id,
    name: formValue(data, 'accountHolderName', 'accountNickname'),
    billingAddressId,
    productCode: schema.productId,
    tenderType: 'BANK_ACCOUNT',
    ...(holderType ? {accountHolderType: holderType} : {}),
    bankAccount,
  };
};

export const encryptManualBankAccountRequest = async (
  request: ManualBankAccountRequest,
  encryptValue: SourceValueEncryptor
): Promise<ManualBankAccountRequest> => {
  const {accountNumber, accountNumberReEntered, routingNumber} =
    request.bankAccount;

  if (!accountNumber || !accountNumberReEntered) {
    throw new Error('Bank account details are required for encryption.');
  }

  const [
    encryptedAccountNumber,
    encryptedAccountNumberReEntered,
    encryptedRoutingNumber,
  ] = await Promise.all([
    encryptValue(accountNumber),
    encryptValue(accountNumberReEntered),
    routingNumber ? encryptValue(routingNumber) : Promise.resolve(undefined),
  ]);

  return {
    ...request,
    bankAccount: {
      ...request.bankAccount,
      ...(encryptedRoutingNumber
        ? {
            routingNumber: encryptedRoutingNumber,
            routingNumberEncrypted: encryptedRoutingNumber,
          }
        : {}),
      accountNumber: encryptedAccountNumber,
      accountNumberEncrypted: encryptedAccountNumber,
      accountNumberReEntered: encryptedAccountNumberReEntered,
    },
  };
};
