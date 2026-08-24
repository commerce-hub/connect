import {assert} from '@open-wc/testing';

import {
  createTranslator,
  resolveSupportedLocale,
} from '../internal/localization/localization.js';

suite('localization', () => {
  test('resolves exact, base-language, and English fallback locales', () => {
    assert.equal(resolveSupportedLocale('fr-CA'), 'fr-CA');
    assert.equal(resolveSupportedLocale('fr-FR'), 'fr-CA');
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

  test('uses English when a French message is missing', () => {
    assert.equal(
      createTranslator('fr-CA').message('localization.englishFallback'),
      'English fallback'
    );
  });

  test('formats currency using the resolved locale', () => {
    assert.include(createTranslator('fr-CA').currency(12.5, 'CAD'), '12,50');
  });
});
