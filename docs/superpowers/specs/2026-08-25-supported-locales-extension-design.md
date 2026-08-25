# Supported Locales Extension Design

## Goal

Extend SDK-owned localization from `en-US` and `fr-CA` to the supported locale
set `en`, `en-US`, `fr-CA`, and `es-US` without changing API-owned content.

## Locale contract

- `en-US` remains the default and fallback locale.
- `en` is a first-class resolved locale. It shares the `en-US` message catalog
  but remains `en` for `lang`, `Intl`, `Accept-Language`, and Pay by Bank.
- `fr-CA` continues to use the Canadian French catalog.
- `es-US` uses a complete US Spanish catalog.
- Locale matching remains case-insensitive and accepts underscores.
- Unsupported English and Spanish regional variants resolve by language to
  `en` and `es-US`, respectively. Unsupported languages fall back to `en-US`.

## Architecture

The existing translator remains the sole localization boundary. Locale
configuration separates the resolved BCP 47 locale from its message catalog,
allowing `en` and `en-US` to reuse the same immutable English messages without
duplication. Spanish messages live in `catalogs/es-US.ts`. Every catalog must
contain the same keys and ICU arguments as the English source catalog.

SDK-owned labels, errors, accessibility text, numbers, currency, and dates use
the resolved locale. API-provided labels and messages continue to render as
received. SDK requests and Pay by Bank receive the resolved locale.

## User-facing integration

Hosts select a locale through the existing property or attribute:

```html
<commerce-hub-connect locale="es-US"></commerce-hub-connect>
```

No new public API is introduced. Sample-app language selectors expose all four
supported values and continue to set the SDK `locale` property.

## Validation

- Unit tests cover canonicalization, exact matching, language fallback, and
  unsupported-locale fallback.
- Catalog validation checks completeness, unknown keys, ICU syntax, and
  interpolation-argument parity for `fr-CA` and `es-US`.
- Component tests verify representative Spanish copy and locale propagation.
- Documentation lists all supported locales and explains API-content ownership.
