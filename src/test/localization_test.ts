import {assert} from '@open-wc/testing';

import {
  createTranslator,
  resolveSupportedLocale,
} from '../internal/localization/localization.js';

suite('localization', () => {
  test('resolves exact, base-language, and English fallback locales', () => {
    assert.equal(resolveSupportedLocale('en'), 'en');
    assert.equal(resolveSupportedLocale('en-US'), 'en-US');
    assert.equal(resolveSupportedLocale('EN_us'), 'en-US');
    assert.equal(resolveSupportedLocale('fr-CA'), 'fr-CA');
    assert.equal(resolveSupportedLocale('fr-FR'), 'fr-CA');
    assert.equal(resolveSupportedLocale('FR_ca'), 'fr-CA');
    assert.equal(resolveSupportedLocale('en-GB'), 'en');
    assert.equal(resolveSupportedLocale('es-US'), 'es-US');
    assert.equal(resolveSupportedLocale('es'), 'es-US');
    assert.equal(resolveSupportedLocale('es-MX'), 'es-US');
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
    assert.equal(
      createTranslator('en-US').message('document.type'),
      'Choose a document type'
    );
    assert.equal(
      createTranslator('fr-CA').message('document.type'),
      'Choisissez un type de document'
    );
    assert.equal(
      createTranslator('en-US').message('document.uploadOne'),
      'Upload document'
    );
    assert.equal(
      createTranslator('fr-CA').message('document.uploadOne'),
      'Téléverser le document'
    );
  });

  test('formats US Spanish messages', () => {
    assert.equal(
      createTranslator('es-US').message('actions.continue'),
      'Continuar'
    );
    assert.equal(
      createTranslator('es-US').message('paymentMethods.title'),
      'Métodos de pago'
    );
    assert.equal(
      createTranslator('es-US').message('document.fileTypeError'),
      'Tipo de archivo no compatible. Cargue un archivo JPG, PNG o PDF.'
    );
    assert.equal(createTranslator('en').message('actions.save'), 'Save');
    assert.equal(
      createTranslator('fr-CA').message('actions.save'),
      'Enregistrer'
    );
    assert.equal(createTranslator('es-US').message('actions.save'), 'Guardar');
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
    assert.strictEqual(createTranslator('es'), createTranslator('es-US'));
    assert.notStrictEqual(createTranslator('en'), createTranslator('en-US'));
  });
});
