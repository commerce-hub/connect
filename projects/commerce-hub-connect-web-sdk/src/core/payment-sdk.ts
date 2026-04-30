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

const DEFAULT_BANK_LINK_OPTIONS = {
  apiKey: 'YqIvg89urE1WsAdgWwM1EiQTRM1ajSYCaLhnDvimvmHeB78A',
  configId: 'cce84049-0940-4926-9a54-9eaca0c09830',
  environment: 'qa',
  locale: 'en-US',
  paymentSdkUrl: 'https://connect-qa.fiservapis.com/pbb/sdk/web/v2/js/PaymentSDK.js',
  useSandbox: false,
} satisfies Required<
  Pick<
    CommerceHubPayByBankOptions,
    'apiKey' | 'configId' | 'environment' | 'locale' | 'paymentSdkUrl' | 'useSandbox'
  >
>;

export function resolvePayByBankOptions(
  environment: string,
  options?: CommerceHubPayByBankOptions,
): Required<
  Pick<
    CommerceHubPayByBankOptions,
    'apiKey' | 'configId' | 'environment' | 'locale' | 'paymentSdkUrl' | 'useSandbox'
  >
> &
  CommerceHubPayByBankOptions {
  const definedOverrides = Object.fromEntries(
    Object.entries(options ?? {}).filter(([, value]) => value !== undefined),
  ) as Partial<CommerceHubPayByBankOptions>;

  return {
    ...DEFAULT_BANK_LINK_OPTIONS,
    environment,
    ...definedOverrides,
  };
}

export async function loadPaymentSdkScript(scriptUrl: string, doc: Document = document): Promise<void> {
  if (window.PaymentSDK?.init) {
    return;
  }

  const existing = doc.querySelector<HTMLScriptElement>(`script[src="${scriptUrl}"]`);
  if (existing) {
    await waitForPaymentSdk(window, existing);
    return;
  }

  await new Promise<void>((resolve, reject) => {
    const script = doc.createElement('script');
    script.src = scriptUrl;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Unable to load Pay by Bank script: ${scriptUrl}`));
    doc.head.appendChild(script);
  });

  if (!window.PaymentSDK?.init) {
    throw new Error(`Pay by Bank script loaded but window.PaymentSDK.init is unavailable: ${scriptUrl}`);
  }
}

export function destroyPaymentSdk(): void {
  try {
    window.PaymentSDK?.destroy?.();
  } catch {
    // Ignore teardown failures.
  }
}

async function waitForPaymentSdk(targetWindow: Window, script: HTMLScriptElement): Promise<void> {
  if (targetWindow.PaymentSDK?.init) {
    return;
  }

  await new Promise<void>((resolve, reject) => {
    const cleanup = () => {
      script.removeEventListener('load', handleLoad);
      script.removeEventListener('error', handleError);
    };

    const handleLoad = () => {
      cleanup();
      resolve();
    };

    const handleError = () => {
      cleanup();
      reject(new Error(`Unable to load Pay by Bank script: ${script.src}`));
    };

    script.addEventListener('load', handleLoad, { once: true });
    script.addEventListener('error', handleError, { once: true });
  });

  if (!targetWindow.PaymentSDK?.init) {
    throw new Error(`Pay by Bank script loaded but window.PaymentSDK.init is unavailable: ${script.src}`);
  }
}
