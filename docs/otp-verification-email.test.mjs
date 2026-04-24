import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const templatePath = new URL('./otp-verification-email.html', import.meta.url);

test('OTP email template uses one otp placeholder and static email-safe markup', async () => {
  const html = await readFile(templatePath, 'utf8');
  const placeholders = html.match(/\{\{[^}]+\}\}/g) ?? [];

  assert.deepEqual(placeholders, ['{{otp}}']);
  assert.match(html, /Don't share this code to anyone!/);
  assert.match(html, /Was this request not made by you\?/);
  assert.match(html, /Please do not reply\./);
  assert.match(html, /<table[\s>]/i);
  assert.doesNotMatch(html, /<script[\s>]/i);
});
