import {assert} from '@open-wc/testing';

import {
  createTranslator,
  resolveSupportedLocale,
} from '../internal/localization/localization.js';

suite('localization', () => {
  test('resolves exact, base-language, and English fallback locales', () => {
    assert.equal(resolveSupportedLocale('fr-CA'), 'fr-CA');
    assert.equal(resolveSupportedLocale('fr-FR'), 'fr-CA');
    assert.equal(resolveSupportedLocale('FR_ca'), 'fr-CA');
    assert.equal(resolveSupportedLocale('en-GB'), 'en-US');
    assert.equal(resolveSupportedLocale('unsupported'), 'en-US');
    assert.equal(resolveSupportedLocale(undefined), 'en-US');
  });

  test('formats English and French messages', () => {
    assert.equal(
      createTranslator('en-US').message('actions.continue'),
      'Continue'
    );
    assert.equal(
      createTranslator('fr-CA').message('actions.continue'),
      'Continuer'
    );
    assert.equal(
      createTranslator('fr-CA').message('verification.verify'),
      'Vérifier'
    );
    assert.equal(
      createTranslator('fr-CA').message('verification.verifying'),
      'Vérification...'
    );
  });

  test('formats ICU message parameters and plurals', () => {
    const translator = createTranslator('fr-CA');

    assert.equal(
      translator.message('otp.sentTo', {destination: 'a@example.com'}),
      'Nous avons envoyé un code à a@example.com.'
    );
    assert.equal(
      translator.message('paymentMethods.count', {count: 2}),
      '2 modes de paiement'
    );
  });

  test('provides a complete French catalog entry', () => {
    assert.equal(
      createTranslator('fr-CA').message('localization.englishFallback'),
      'Solution de repli en anglais'
    );
  });

  test('formats currency using the resolved locale', () => {
    assert.include(createTranslator('fr-CA').currency(12.5, 'CAD'), '12,50');
  });

  test('reuses translators for the same resolved locale', () => {
    assert.strictEqual(createTranslator('fr'), createTranslator('fr-CA'));
  });
});
