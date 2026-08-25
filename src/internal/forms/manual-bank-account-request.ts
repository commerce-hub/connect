import type {components} from '../../generated/openapi.js';
import type {ConfigInstrumentSchema} from './instrument-schema.js';

type Address = components['schemas']['Address'];
type ManualBankBillingAddress = Address & {state?: string};

const CANADIAN_ROUTING_NUMBER = '1223';

export const BANK_BILLING_ADDRESS_FORM_PROPERTY = '__bankBillingAddress';

export type ConfigDrivenAddressSelection =
  | {kind: 'new'}
  | {kind: 'existing'; id: string};

export type ConfigDrivenBankAccountRequest = Record<string, unknown> & {
  id: string;
  name: string;
  tenderType: 'BANK_ACCOUNT';
  bavSupportedCode: string;
  productId: string;
  countryCode: string;
  currencyCode: string;
};

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

const CONFIG_DRIVEN_ENCRYPTED_FIELDS = [
  'accountNumber',
  'iban',
  'routingCode',
  'bsbCode',
  'interacAccount',
  'clabe',
] as const;

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

export const accountHolderTypeFromBavSupportedCode = (
  bavSupportedCode: string
): 'BUSINESS' | 'PERSONAL' => {
  const suffix = /-([BP])$/u.exec(bavSupportedCode.trim())?.[1];

  if (suffix === 'B') {
    return 'BUSINESS';
  }

  if (suffix === 'P') {
    return 'PERSONAL';
  }

  throw new Error(
    'The selected instrument schema does not identify a business or personal account.'
  );
};

export const createConfigDrivenBankAccountRequest = ({
  data,
  schema,
  addressSelection,
  id,
}: {
  data: Record<string, unknown>;
  schema: ConfigInstrumentSchema;
  addressSelection: ConfigDrivenAddressSelection;
  id: string;
}): ConfigDrivenBankAccountRequest => {
  const requestId = id.trim();

  if (!requestId) {
    throw new Error('The bank account request requires an id.');
  }

  const configuredValues: Record<string, unknown> = {...data};
  const configuredAddress = isRecord(data.address)
    ? {...data.address}
    : undefined;

  delete configuredValues[BANK_BILLING_ADDRESS_FORM_PROPERTY];
  delete configuredValues.accountNumberReEntered;

  if (addressSelection.kind === 'existing') {
    const addressId = addressSelection.id.trim();

    if (!addressId) {
      throw new Error('Select a billing address.');
    }

    configuredValues.address = {id: addressId};
  } else if (configuredAddress) {
    configuredValues.address = configuredAddress;
  } else {
    delete configuredValues.address;
  }

  return {
    ...configuredValues,
    id: requestId,
    name: formValue(data, 'accountHolderName', 'accountNickname'),
    tenderType: 'BANK_ACCOUNT',
    bavSupportedCode: schema.bavSupportedCode.trim(),
    productId: schema.productId.trim(),
    countryCode: schema.countryCode.trim().toUpperCase(),
    currencyCode: schema.currencyCode.trim().toUpperCase(),
  };
};

const isConfigDrivenEncryptedField = (key: string): boolean =>
  CONFIG_DRIVEN_ENCRYPTED_FIELDS.some(
    (field) => field.toLowerCase() === key.toLowerCase()
  );

const encryptConfigDrivenValue = async (
  value: unknown,
  encryptValue: SourceValueEncryptor
): Promise<unknown> => {
  if (!isRecord(value)) {
    return value;
  }

  const encryptedEntries = await Promise.all(
    Object.entries(value).map(async ([key, entryValue]) => {
      if (isConfigDrivenEncryptedField(key)) {
        const entryStringValue = stringValue(entryValue);

        return [
          key,
          entryStringValue ? await encryptValue(entryStringValue) : entryValue,
        ];
      }

      return [key, await encryptConfigDrivenValue(entryValue, encryptValue)];
    })
  );

  return Object.fromEntries(encryptedEntries);
};

const IBAN_ACCOUNT_TYPE = 'IBAN';
const ACCOUNT_NUMBER_SOURCE_FIELDS = [
  'accountNumber',
  'interacAccount',
  'clabe',
] as const;

const configDrivenStringValue = (
  request: ConfigDrivenBankAccountRequest,
  fieldNames: readonly string[]
): string | undefined => {
  for (const fieldName of fieldNames) {
    const requestKey = Object.keys(request).find(
      (key) => key.toLowerCase() === fieldName.toLowerCase()
    );
    const value = requestKey ? stringValue(request[requestKey]) : '';

    if (value) {
      return value;
    }
  }

  return undefined;
};

// Only a top-level `iban` maps to the API's ACH-style account number fields;
// a nested bankAccount.iban (if present) is left encrypted in place.
const withIbanAsAccountNumber = (
  request: ConfigDrivenBankAccountRequest
): ConfigDrivenBankAccountRequest => {
  const ibanKey = Object.keys(request).find(
    (key) => key.toLowerCase() === 'iban'
  );
  const ibanValue = ibanKey ? stringValue(request[ibanKey]) : '';

  if (!ibanKey || !ibanValue) {
    return request;
  }

  const {[ibanKey]: _discardedIban, ...rest} = request as Record<
    string,
    unknown
  >;

  return {
    ...rest,
    accountType: IBAN_ACCOUNT_TYPE,
    accountNumber: ibanValue,
    accountNumberReEntered: ibanValue,
    accountIdentificationNumberType: IBAN_ACCOUNT_TYPE,
  } as unknown as ConfigDrivenBankAccountRequest;
};

export const encryptConfigDrivenBankAccountRequest = async (
  request: ConfigDrivenBankAccountRequest,
  encryptValue: SourceValueEncryptor
): Promise<ConfigDrivenBankAccountRequest> => {
  const encryptedRequest = withIbanAsAccountNumber(
    (await encryptConfigDrivenValue(
      request,
      encryptValue
    )) as ConfigDrivenBankAccountRequest
  );
  const encryptedAccountNumber = configDrivenStringValue(
    encryptedRequest,
    ACCOUNT_NUMBER_SOURCE_FIELDS
  );

  return {
    ...encryptedRequest,
    ...(encryptedAccountNumber
      ? {accountNumberReEntered: encryptedAccountNumber}
      : {}),
  };
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
