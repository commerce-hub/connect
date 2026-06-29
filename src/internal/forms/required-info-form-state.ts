import type {
  RequiredInfoFileNames,
  RequiredInfoFiles,
  RequiredInfoValues,
} from '../types.js';

export const REQUIRED_INFO_SSN_SEGMENT_LENGTHS = [3, 2, 4] as const;

export const normalizeRequiredInfoSsn = (value: string): string =>
  value.replace(/\D/g, '').slice(0, 9);

export const requiredInfoSsnSegments = (
  value: string
): [string, string, string] => {
  const digits = normalizeRequiredInfoSsn(value);

  return [digits.slice(0, 3), digits.slice(3, 5), digits.slice(5, 9)];
};

export const requiredInfoSsnSegmentMaxLength = (segmentIndex: number): number =>
  REQUIRED_INFO_SSN_SEGMENT_LENGTHS[segmentIndex] ?? 0;

export const storeRequiredInfoValue = (
  values: RequiredInfoValues,
  key: string,
  value: string
): RequiredInfoValues => ({
  ...values,
  [key]: value,
});

export const storeRequiredInfoFile = ({
  files,
  fileNames,
  key,
  file,
}: {
  files: RequiredInfoFiles;
  fileNames: RequiredInfoFileNames;
  key: string;
  file: File;
}): {files: RequiredInfoFiles; fileNames: RequiredInfoFileNames} => ({
  files: {
    ...files,
    [key]: file,
  },
  fileNames: {
    ...fileNames,
    [key]: file.name,
  },
});

export const hasRequiredInfoTextValue = (
  values: RequiredInfoValues,
  key: string
): boolean => Boolean(values[key]?.trim());

export const hasRequiredInfoFile = (
  files: RequiredInfoFiles,
  key: string
): boolean => Boolean(files[key]);
