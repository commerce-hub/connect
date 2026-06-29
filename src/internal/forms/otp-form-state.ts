export const OTP_LENGTH = 6;

export const sanitizeOtpValue = (value: string): string =>
  value.replace(/\D/g, '');

export const normalizeOtpValue = (
  values: readonly string[],
  length = OTP_LENGTH
): string => sanitizeOtpValue(values.join('')).slice(0, length);

export const writeOtpDigits = ({
  values,
  startIndex,
  value,
}: {
  values: readonly string[];
  startIndex: number;
  value: string;
}): {values: string[]; lastWrittenIndex: number} => {
  const nextValues = [...values];
  const digits = sanitizeOtpValue(value);
  let lastWrittenIndex = startIndex;

  digits
    .slice(0, Math.max(nextValues.length - startIndex, 0))
    .split('')
    .forEach((digit, offset) => {
      const targetIndex = startIndex + offset;

      if (targetIndex >= nextValues.length) {
        return;
      }

      nextValues[targetIndex] = digit;
      lastWrittenIndex = targetIndex;
    });

  return {values: nextValues, lastWrittenIndex};
};
