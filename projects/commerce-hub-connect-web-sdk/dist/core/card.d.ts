import type { CardNetwork } from '../contracts/api-models';
export declare function normalizeCardNumber(value: string): string;
export declare function normalizeCvv(value: string): string;
export declare function detectCardNetwork(cardNumber: string): CardNetwork | undefined;
export declare function isValidCardNumber(cardNumber: string): boolean;
export declare function parseExpiration(value: string): {
    month?: string;
    year?: string;
};
export declare function isValidCvv(value: string): boolean;
export declare function formatCardNumberForDisplay(cardNumber: string): string;
export declare function maskCardNumberForDisplay(cardNumber: string): string;
export declare function maskCvvForDisplay(cvv: string): string;
