import type {MessageKey} from '../localization.js';

export const frCAMessages: Partial<Record<MessageKey, string>> = {
  'actions.continue': 'Continuer',
  'otp.sentTo': 'Nous avons envoyé un code à {destination}.',
  'paymentMethods.count':
    '{count, plural, =0 {Aucun mode de paiement} one {# mode de paiement} other {# modes de paiement}}',
  'otp.title': 'Entrer le code de vérification',
  'otp.failedMessage': 'Le code ne correspond pas. Réessayez.',
  'otp.resendPrefix': "Vous n'avez pas reçu le code?",
  'otp.resendButton': 'Renvoyer le code',
  'otp.resendPendingButton': 'Envoi du code...',
  'otp.verifyButton': 'Vérifier',
  'otp.verifyingButton': 'Vérification...',
  'otp.tryAgainButton': 'Réessayer',
  'paymentMethods.title': 'Modes de paiement',
  'paymentMethods.addBankAccount': 'Ajouter un compte bancaire',
  'paymentMethods.addCard': 'Carte de crédit ou de débit',
  'paymentMethods.continue': 'Utiliser le mode sélectionné',
  'paymentMethods.continuing': 'Enregistrement...',
  'paymentMethods.addBankAccountDescription': 'Connecter ou saisir un compte',
  'paymentMethods.addCardDescription': 'Ajouter les détails de votre carte',
};
