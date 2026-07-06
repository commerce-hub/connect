import {assert} from '@open-wc/testing';

import {
  encryptSourceValue,
  normalizePublicKeyDer,
} from '../internal/source-encryption.js';

suite('source encryption', () => {
  test('normalizes PEM and base64url public keys to the same DER bytes', async () => {
    const {publicKey} = await createTestKeyPair();
    const publicKeyDer = await crypto.subtle.exportKey('spki', publicKey);
    const publicKeyBase64 = arrayBufferToBase64(publicKeyDer);
    const publicKeyPem = [
      '-----BEGIN PUBLIC KEY-----',
      publicKeyBase64,
      '-----END PUBLIC KEY-----',
    ].join('\n');
    const publicKeyBase64Url = publicKeyBase64
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/g, '');

    assert.deepEqual(
      new Uint8Array(normalizePublicKeyDer(publicKeyPem)),
      new Uint8Array(publicKeyDer)
    );
    assert.deepEqual(
      new Uint8Array(normalizePublicKeyDer(publicKeyBase64Url)),
      new Uint8Array(publicKeyDer)
    );
  });

  test('encrypts a source value with RSA-OAEP SHA-512', async () => {
    const {publicKey, privateKey} = await createTestKeyPair();
    const publicKeyBase64 = arrayBufferToBase64(
      await crypto.subtle.exportKey('spki', publicKey)
    );

    const encryptedValue = await encryptSourceValue(
      '4111111111111111',
      publicKeyBase64
    );
    const decryptedValue = await crypto.subtle.decrypt(
      {name: 'RSA-OAEP'},
      privateKey,
      base64ToArrayBuffer(encryptedValue)
    );

    assert.notEqual(encryptedValue, '4111111111111111');
    assert.equal(new TextDecoder().decode(decryptedValue), '4111111111111111');
  });
});

const createTestKeyPair = async (): Promise<CryptoKeyPair> =>
  crypto.subtle.generateKey(
    {
      name: 'RSA-OAEP',
      modulusLength: 2048,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: 'SHA-512',
    },
    true,
    ['encrypt', 'decrypt']
  );

const arrayBufferToBase64 = (value: ArrayBuffer): string => {
  const bytes = new Uint8Array(value);
  let binaryValue = '';

  for (const byte of bytes) {
    binaryValue += String.fromCharCode(byte);
  }

  return btoa(binaryValue);
};

const base64ToArrayBuffer = (base64Value: string): ArrayBuffer => {
  const binaryValue = atob(base64Value);
  const bytes = new Uint8Array(binaryValue.length);

  for (let index = 0; index < binaryValue.length; index += 1) {
    bytes[index] = binaryValue.charCodeAt(index);
  }

  return bytes.buffer;
};
