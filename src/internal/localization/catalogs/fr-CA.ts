import type {MessageKey} from '../localization.js';

export const frCAMessages: Partial<Record<MessageKey, string>> = {
  'actions.continue': 'Continuer',
  'otp.sentTo': 'Nous avons envoyé un code à {destination}.',
  'paymentMethods.count':
    '{count, plural, =0 {Aucun mode de paiement} one {# mode de paiement} other {# modes de paiement}}',
};
