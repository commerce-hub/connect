import {IntlMessageFormat} from 'intl-messageformat';

import {enUSMessages} from './catalogs/en-US.js';
import {frCAMessages} from './catalogs/fr-CA.js';

export type MessageKey = keyof typeof enUSMessages;
export type MessageValues = Record<string, string | number | Date>;

export interface Translator {
  readonly locale: SupportedLocale;
  readonly direction: 'ltr' | 'rtl';
  message(key: MessageKey, values?: MessageValues): string;
  number(value: number, options?: Intl.NumberFormatOptions): string;
  currency(value: number, currencyCode: string): string;
  date(value: Date | number, options?: Intl.DateTimeFormatOptions): string;
}

const localeConfigs = {
  'en-US': {messages: enUSMessages, direction: 'ltr'},
  'fr-CA': {messages: frCAMessages, direction: 'ltr'},
} as const;

export type SupportedLocale = keyof typeof localeConfigs;

const DEFAULT_LOCALE: SupportedLocale = 'en-US';
const supportedLocales = Object.keys(localeConfigs) as SupportedLocale[];

const messageFormatCache = new Map<string, IntlMessageFormat>();
const translatorCache = new Map<SupportedLocale, Translator>();
const numberFormatCache = new Map<string, Intl.NumberFormat>();
const dateTimeFormatCache = new Map<string, Intl.DateTimeFormat>();

export const resolveSupportedLocale = (
  locale: string | undefined
): SupportedLocale => {
  const normalizedLocale = locale?.trim().replaceAll('_', '-');

  if (!normalizedLocale) {
    return DEFAULT_LOCALE;
  }

  let canonicalLocale: string;
  try {
    canonicalLocale = Intl.getCanonicalLocales(normalizedLocale)[0];
  } catch {
    return DEFAULT_LOCALE;
  }

  const exactLocale = supportedLocales.find(
    (supportedLocale) => supportedLocale === canonicalLocale
  );
  if (exactLocale) {
    return exactLocale;
  }

  const language = new Intl.Locale(canonicalLocale).language;
  return (
    supportedLocales.find(
      (supportedLocale) =>
        new Intl.Locale(supportedLocale).language === language
    ) ?? DEFAULT_LOCALE
  );
};

export const createTranslator = (locale?: string): Translator => {
  const resolvedLocale = resolveSupportedLocale(locale);
  const cachedTranslator = translatorCache.get(resolvedLocale);

  if (cachedTranslator) {
    return cachedTranslator;
  }

  const config = localeConfigs[resolvedLocale];
  const formatCacheKey = (
    kind: 'number' | 'date',
    options?: Intl.NumberFormatOptions | Intl.DateTimeFormatOptions
  ) => `${kind}:${resolvedLocale}:${JSON.stringify(options ?? {})}`;

  const translator: Translator = {
    locale: resolvedLocale,
    direction: config.direction,
    message: (key, values = {}) => {
      const message = config.messages[key] ?? enUSMessages[key];
      const cacheKey = `${resolvedLocale}:${key}:${message}`;
      let formatter = messageFormatCache.get(cacheKey);

      if (!formatter) {
        formatter = new IntlMessageFormat(message, resolvedLocale);
        messageFormatCache.set(cacheKey, formatter);
      }

      return String(formatter.format(values));
    },
    number: (value, options) => {
      const key = formatCacheKey('number', options);
      let formatter = numberFormatCache.get(key);
      if (!formatter) {
        formatter = new Intl.NumberFormat(resolvedLocale, options);
        numberFormatCache.set(key, formatter);
      }
      return formatter.format(value);
    },
    currency: (value, currencyCode) => {
      const options: Intl.NumberFormatOptions = {
        style: 'currency',
        currency: currencyCode,
      };
      const key = formatCacheKey('number', options);
      let formatter = numberFormatCache.get(key);
      if (!formatter) {
        formatter = new Intl.NumberFormat(resolvedLocale, options);
        numberFormatCache.set(key, formatter);
      }
      return formatter.format(value);
    },
    date: (value, options) => {
      const key = formatCacheKey('date', options);
      let formatter = dateTimeFormatCache.get(key);
      if (!formatter) {
        formatter = new Intl.DateTimeFormat(resolvedLocale, options);
        dateTimeFormatCache.set(key, formatter);
      }
      return formatter.format(value);
    },
  };

  translatorCache.set(resolvedLocale, translator);
  return translator;
};
