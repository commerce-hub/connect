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

export const validateRequiredInfoSsn = (value: string): string | undefined =>
  normalizeRequiredInfoSsn(value).length === 9
    ? undefined
    : 'Enter a 9-digit Social Security number.';

export const storeRequiredInfoValue = (
  values: RequiredInfoValues,
  key: string,
  value: string
): RequiredInfoValues => ({
  ...values,
  [key]: value,
});

// Matches the document-upload endpoint's accepted formats (PDF, JPG, PNG).
const REQUIRED_INFO_DOCUMENT_ALLOWED_MIME_TYPES = new Set([
  'application/pdf',
  'image/jpeg',
  'image/png',
]);

const REQUIRED_INFO_DOCUMENT_ALLOWED_EXTENSIONS = new Set([
  'pdf',
  'jpg',
  'jpeg',
  'png',
]);

export const REQUIRED_INFO_DOCUMENT_ACCEPT =
  '.pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png';

export const REQUIRED_INFO_DOCUMENT_FILE_TYPE_ERROR =
  'Upload a PDF, JPEG, or PNG file.';

const requiredInfoFileExtension = (fileName: string): string =>
  fileName.slice(fileName.lastIndexOf('.') + 1).toLowerCase();

export const isAllowedRequiredInfoDocumentFile = (file: File): boolean => {
  if (REQUIRED_INFO_DOCUMENT_ALLOWED_MIME_TYPES.has(file.type.toLowerCase())) {
    return true;
  }

  // Fall back to the extension when the browser/OS reports no MIME type.
  return (
    !file.type &&
    REQUIRED_INFO_DOCUMENT_ALLOWED_EXTENSIONS.has(
      requiredInfoFileExtension(file.name)
    )
  );
};

export const validateRequiredInfoDocumentFile = (
  file: File
): string | undefined =>
  isAllowedRequiredInfoDocumentFile(file)
    ? undefined
    : REQUIRED_INFO_DOCUMENT_FILE_TYPE_ERROR;

// Magic-byte signatures for the allowed formats, used to catch files whose
// extension/MIME type was spoofed (e.g. a .zip renamed to .pdf).
const REQUIRED_INFO_DOCUMENT_SIGNATURES: readonly (readonly number[])[] = [
  [0x25, 0x50, 0x44, 0x46], // %PDF
  [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a], // PNG
  [0xff, 0xd8, 0xff], // JPEG
];

const REQUIRED_INFO_DOCUMENT_SIGNATURE_READ_LENGTH = Math.max(
  ...REQUIRED_INFO_DOCUMENT_SIGNATURES.map((signature) => signature.length)
);

const matchesRequiredInfoDocumentSignature = (
  header: Uint8Array,
  signature: readonly number[]
): boolean => signature.every((byte, index) => header[index] === byte);

const readRequiredInfoDocumentHeaderBytes = async (
  file: File
): Promise<Uint8Array> => {
  const buffer = await file
    .slice(0, REQUIRED_INFO_DOCUMENT_SIGNATURE_READ_LENGTH)
    .arrayBuffer();

  return new Uint8Array(buffer);
};

export const hasValidRequiredInfoDocumentSignature = async (
  file: File
): Promise<boolean> => {
  const header = await readRequiredInfoDocumentHeaderBytes(file);

  return REQUIRED_INFO_DOCUMENT_SIGNATURES.some((signature) =>
    matchesRequiredInfoDocumentSignature(header, signature)
  );
};

// Validates the file's extension/MIME type and its actual magic bytes, so a
// renamed file (e.g. a .zip renamed to .pdf) is rejected even though the
// browser reports the spoofed MIME type.
export const validateRequiredInfoDocumentFileContent = async (
  file: File
): Promise<string | undefined> => {
  if (!isAllowedRequiredInfoDocumentFile(file)) {
    return REQUIRED_INFO_DOCUMENT_FILE_TYPE_ERROR;
  }

  const hasValidSignature = await hasValidRequiredInfoDocumentSignature(file);

  return hasValidSignature ? undefined : REQUIRED_INFO_DOCUMENT_FILE_TYPE_ERROR;
};

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
