import type {ConfigInstrumentSchema} from './instrument-schema.js';

export type InstrumentSchemaAccountType = 'BUSINESS' | 'PERSONAL';

export type InstrumentSchemaSelection = {
  schema: ConfigInstrumentSchema;
  currencyCode: string;
  currencyName: string;
  accountType: InstrumentSchemaAccountType;
  paymentType: string;
};

export type InstrumentSchemaSelectionOption<Value extends string = string> = {
  value: Value;
  label: string;
};

const BAV_SUPPORTED_CODE_PATTERN = /^([^-]+)-(.+)-([BP])$/u;

const parseInstrumentSchemaSelection = (
  schema: ConfigInstrumentSchema
): InstrumentSchemaSelection | undefined => {
  const match = BAV_SUPPORTED_CODE_PATTERN.exec(schema.bavSupportedCode.trim());
  const schemaCurrencyCode = schema.currencyCode.trim().toUpperCase();
  const currencyName = schema.currencyName.trim();
  const parsedCurrencyCode = match?.[1].trim().toUpperCase();
  const paymentType = match?.[2].trim();
  const accountSuffix = match?.[3];

  if (
    !parsedCurrencyCode ||
    !paymentType ||
    !currencyName ||
    parsedCurrencyCode !== schemaCurrencyCode
  ) {
    return undefined;
  }

  return {
    schema,
    currencyCode: parsedCurrencyCode,
    currencyName,
    accountType: accountSuffix === 'B' ? 'BUSINESS' : 'PERSONAL',
    paymentType,
  };
};

export const selectableInstrumentSchemas = (
  schemas: ConfigInstrumentSchema[]
): InstrumentSchemaSelection[] => {
  const parsed = schemas.flatMap((schema) => {
    const selection = parseInstrumentSchemaSelection(schema);

    return selection ? [selection] : [];
  });
  const combinationCounts = new Map<string, number>();
  const combinationKey = (selection: InstrumentSchemaSelection) =>
    [selection.currencyCode, selection.accountType, selection.paymentType].join(
      '\u0000'
    );

  for (const selection of parsed) {
    const key = combinationKey(selection);
    combinationCounts.set(key, (combinationCounts.get(key) ?? 0) + 1);
  }

  return parsed.filter(
    (selection) => combinationCounts.get(combinationKey(selection)) === 1
  );
};

const uniqueOptions = <Value extends string>(
  options: Array<InstrumentSchemaSelectionOption<Value>>,
  keyOf: (option: InstrumentSchemaSelectionOption<Value>) => string = ({
    value,
  }) => value
): Array<InstrumentSchemaSelectionOption<Value>> => {
  const seen = new Set<string>();

  return options.filter((option) => {
    const key = keyOf(option);

    if (seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });
};

export const instrumentSchemaCurrencyOptions = (
  selections: InstrumentSchemaSelection[]
): InstrumentSchemaSelectionOption[] =>
  uniqueOptions(
    selections.map(({currencyCode, currencyName}) => ({
      value: currencyCode,
      label: currencyName,
    })),
    ({label}) => label
  );

export const instrumentSchemaAccountTypeOptions = (
  selections: InstrumentSchemaSelection[],
  currencyCode: string
): Array<InstrumentSchemaSelectionOption<InstrumentSchemaAccountType>> =>
  uniqueOptions(
    selections
      .filter((selection) => selection.currencyCode === currencyCode)
      .map(({accountType}) => ({
        value: accountType,
        label: accountType === 'BUSINESS' ? 'Business' : 'Personal',
      }))
  );

export const instrumentSchemaPaymentTypeOptions = (
  selections: InstrumentSchemaSelection[],
  currencyCode: string,
  accountType: InstrumentSchemaAccountType
): InstrumentSchemaSelectionOption[] =>
  uniqueOptions(
    selections
      .filter(
        (selection) =>
          selection.currencyCode === currencyCode &&
          selection.accountType === accountType
      )
      .map(({paymentType, schema}) => ({
        value: paymentType,
        label: schema.productId,
      }))
  );

export const resolveInstrumentSchema = (
  selections: InstrumentSchemaSelection[],
  currencyCode: string,
  accountType: InstrumentSchemaAccountType | '',
  paymentType: string
): ConfigInstrumentSchema | undefined => {
  const matches = selections.filter(
    (selection) =>
      selection.currencyCode === currencyCode &&
      selection.accountType === accountType &&
      selection.paymentType === paymentType
  );

  return matches.length === 1 ? matches[0].schema : undefined;
};
