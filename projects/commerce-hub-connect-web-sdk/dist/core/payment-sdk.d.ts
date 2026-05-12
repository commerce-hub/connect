import type { CommerceHubPayByBankOptions } from '../contracts/sdk-models';
export type PaymentSdkEventType = 'success' | 'failure' | 'cancel' | 'error' | string;
export type PaymentSdkEvent = {
    type?: PaymentSdkEventType;
    payload?: unknown;
    [key: string]: unknown;
};
export type PaymentSdkInitConfiguration = {
    apiKey: string;
    accessToken: string;
    configId: string;
    containerId: string;
    onEvent: (event: PaymentSdkEvent) => void;
    environment?: string;
    locale?: string;
    aggregatorSessionId?: string;
    publicKey?: string;
    pToken?: string;
};
declare global {
    interface Window {
        PaymentSDK?: {
            init: (configuration: PaymentSdkInitConfiguration) => void;
            destroy?: () => void;
        };
    }
}
export declare function resolvePayByBankOptions(environment: string, options?: CommerceHubPayByBankOptions): Required<Pick<CommerceHubPayByBankOptions, 'apiKey' | 'configId' | 'environment' | 'locale' | 'paymentSdkUrl' | 'useSandbox'>> & CommerceHubPayByBankOptions;
export declare function loadPaymentSdkScript(scriptUrl: string, doc?: Document): Promise<void>;
export declare function destroyPaymentSdk(): void;
