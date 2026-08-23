import type {InteractionEntityData} from './types.js';

export type PayByBankCustomerDetails = Partial<{
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}>;

const nonBlankValue = (value: string | undefined): string | undefined => {
  const normalizedValue = value?.trim();

  return normalizedValue ? normalizedValue : undefined;
};

export const resolvePayByBankCustomerDetails = (
  entityData: InteractionEntityData | undefined
): PayByBankCustomerDetails => {
  const entries = [
    ['firstName', nonBlankValue(entityData?.firstName)],
    ['lastName', nonBlankValue(entityData?.lastName)],
    ['email', nonBlankValue(entityData?.email)],
    ['phone', nonBlankValue(entityData?.phoneDetails?.phoneNumber)],
  ] as const;

  return Object.fromEntries(
    entries.filter((entry) => entry[1])
  ) as PayByBankCustomerDetails;
};
