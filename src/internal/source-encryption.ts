export const encryptSourceValue = async (
  value: string,
  publicKeyInput: string
): Promise<string> => {
  const publicKey = await crypto.subtle.importKey(
    'spki',
    normalizePublicKeyDer(publicKeyInput),
    {name: 'RSA-OAEP', hash: 'SHA-512'},
    false,
    ['encrypt']
  );
  const encryptedValue = await crypto.subtle.encrypt(
    {name: 'RSA-OAEP'},
    publicKey,
    new TextEncoder().encode(value)
  );

  return arrayBufferToBase64(encryptedValue);
};

export const normalizePublicKeyDer = (publicKeyInput: string): ArrayBuffer => {
  const normalizedValue = publicKeyInput
    .trim()
    .replace(/-----BEGIN [^-]+-----/g, '')
    .replace(/-----END [^-]+-----/g, '')
    .replace(/\s/g, '')
    .replace(/-/g, '+')
    .replace(/_/g, '/');
  const paddedValue = normalizedValue.padEnd(
    normalizedValue.length + ((4 - (normalizedValue.length % 4)) % 4),
    '='
  );
  const binaryValue = atob(paddedValue);
  const bytes = new Uint8Array(binaryValue.length);

  for (let index = 0; index < binaryValue.length; index += 1) {
    bytes[index] = binaryValue.charCodeAt(index);
  }

  return bytes.buffer;
};

const arrayBufferToBase64 = (value: ArrayBuffer): string => {
  const bytes = new Uint8Array(value);
  let binaryValue = '';

  for (const byte of bytes) {
    binaryValue += String.fromCharCode(byte);
  }

  return btoa(binaryValue);
};
