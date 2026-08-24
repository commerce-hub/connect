import {IntlMessageFormat} from 'intl-messageformat';

import {enUSMessages} from './catalogs/en-US.js';
import {frCAMessages} from './catalogs/fr-CA.js';

export type SupportedLocale = 'en-US' | 'fr-CA';
export type MessageKey = keyof typeof enUSMessages;
export type MessageValues = Record<string, string | number | Date>;

export interface Translator {
  readonly locale: SupportedLocale;
  readonly direction: 'ltr' | 'rtl';
  message(key: MessageKey, values?: MessageValues): string;
  number(value: number, options?: Intl.NumberFormatOptions): string;
  currency(value: number, currencyCode: string): string;
  date(
    value: Date | number,
    options?: Intl.DateTimeFormatOptions
  ): string;
}

const catalogs: Record<SupportedLocale, Partial<Record<MessageKey, string>>> = {
  'en-US': enUSMessages,
  'fr-CA': frCAMessages,
};

const messageFormatCache = new Map<string, IntlMessageFormat>();

export const resolveSupportedLocale = (
  locale: string | undefined
): SupportedLocale => {
  const normalizedLocale = locale?.trim().replace('_', '-').toLowerCase();

  if (normalizedLocale === 'fr' || normalizedLocale?.startsWith('fr-')) {
    return 'fr-CA';
  }

  return 'en-US';
};

export const createTranslator = (locale?: string): Translator => {
  const resolvedLocale = resolveSupportedLocale(locale);

  return {
    locale: resolvedLocale,
    direction: 'ltr',
    message: (key, values = {}) => {
      const message = catalogs[resolvedLocale][key] ?? enUSMessages[key];
      const cacheKey = `${resolvedLocale}:${key}:${message}`;
      let formatter = messageFormatCache.get(cacheKey);

      if (!formatter) {
        formatter = new IntlMessageFormat(message, resolvedLocale);
        messageFormatCache.set(cacheKey, formatter);
      }

      return String(formatter.format(values));
    },
    number: (value, options) =>
      new Intl.NumberFormat(resolvedLocale, options).format(value),
    currency: (value, currencyCode) =>
      new Intl.NumberFormat(resolvedLocale, {
        style: 'currency',
        currency: currencyCode,
      }).format(value),
    date: (value, options) =>
      new Intl.DateTimeFormat(resolvedLocale, options).format(value),
  };
};
