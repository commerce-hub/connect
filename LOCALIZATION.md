# SDK localization

CommerceHub Connect owns and bundles its shopper-facing translations. Hosts
select a locale through `<commerce-hub-connect locale="fr-CA">`; they do not
provide translation catalogs. The SDK supports `en`, `en-US`, `fr-CA`, and
`es-US`, with `en-US` as the default and fallback. `en` reuses the US English
messages while remaining `en` for formatting and downstream locale headers.

## Architecture

```text
Component or helper
  -> translator.message('domain.key', values)
  -> locale resolver and cached ICU formatter
  -> selected catalog
  -> en-US fallback
```

`domain.key` is a semantic identifier. The domain identifies the owning area
and the key describes the message, for example `card.save`,
`actions.continue`, or `card.error.numberInvalid`.

SDK-owned labels, errors, status text, and accessibility text use catalogs.
API-provided field labels, enum values, and validation errors are rendered
unchanged. The resolved locale is still sent through `Accept-Language` and to
Pay by Bank so those services can localize their content independently.

## Add a message

Add the English source message to
`src/internal/localization/catalogs/en-US.ts`:

```ts
'card.removeConfirmation': 'Remove card ending in {last4}?',
```

Add the matching French Canadian message to
`src/internal/localization/catalogs/fr-CA.ts`:

```ts
'card.removeConfirmation':
  'Supprimer la carte se terminant par {last4}?',
```

Add the matching US Spanish message to
`src/internal/localization/catalogs/es-US.ts`:

```ts
'card.removeConfirmation':
  '¿Eliminar la tarjeta que termina en {last4}?',
```

Every translated locale must use the same ICU parameters. Catalog keys should describe
meaning rather than repeat English text.

## Use a message

Inside `CommerceHubConnect`:

```ts
this.translator.message('card.removeConfirmation', {last4: '4242'});
```

Pass the translator into helpers that create shopper-facing text:

```ts
const confirmationText = (last4: string, translator: Translator): string =>
  translator.message('card.removeConfirmation', {last4});
```

Use the formatter helpers for localized values:

```ts
translator.number(1250.75);
translator.currency(12.5, 'CAD');
translator.date(new Date());
```

## Add another locale

1. Add a catalog file under `src/internal/localization/catalogs/`.
2. Import and register it in `src/internal/localization/localization.ts` with
   its text direction.
3. Add locale-resolution tests in `src/test/localization_test.ts`.
4. Add representative component tests for translated copy and accessibility
   labels.
5. Add the locale to every sample-app language selector.
6. Document the supported locale in `README.md`.

## Validate catalogs

Run:

```bash
npm run check:localization
```

The check discovers catalog files automatically and verifies key
completeness, unknown keys, ICU syntax, and matching interpolation parameters.
It also runs as part of `npm test`.

Before releasing, also run:

```bash
npm run build
npm run lint
npm test
```
