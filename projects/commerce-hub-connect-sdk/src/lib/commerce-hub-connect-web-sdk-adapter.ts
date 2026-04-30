import type {
  CommerceHubConnectEnvironment,
  CommerceHubConnectWebSdkMountOptions,
  CommerceHubConnectWebSdkNamespace,
} from './commerce-hub-connect-web-sdk-types';

declare global {
  interface Window {
    CommerceHubConnectWebSdk?: CommerceHubConnectWebSdkNamespace;
  }
}

const DEFAULT_WEB_SDK_SCRIPT_URL = './CommerceHubConnectSDK.js';

export const commerceHubConnectWebSdkAdapter = {
  async mount(
    target: string | Element,
    options: CommerceHubConnectWebSdkMountOptions,
    environment?: CommerceHubConnectEnvironment,
    scriptUrl: string = DEFAULT_WEB_SDK_SCRIPT_URL,
  ) {
    const sdk = await loadCommerceHubConnectWebSdk(scriptUrl);
    return sdk.mount(target, options, environment);
  },
};

async function loadCommerceHubConnectWebSdk(
  scriptUrl: string,
): Promise<CommerceHubConnectWebSdkNamespace> {
  if (window.CommerceHubConnectWebSdk) {
    return window.CommerceHubConnectWebSdk;
  }

  await new Promise<void>((resolve, reject) => {
    const existingScript = document.querySelector<HTMLScriptElement>(
      `script[data-commerce-hub-connect-web-sdk-script="${scriptUrl}"]`,
    );

    if (existingScript) {
      existingScript.addEventListener('load', () => resolve(), { once: true });
      existingScript.addEventListener(
        'error',
        () => reject(new Error(`Unable to load ${scriptUrl}.`)),
        { once: true },
      );
      return;
    }

    const script = document.createElement('script');
    script.async = true;
    script.dataset['commerceHubConnectWebSdkScript'] = scriptUrl;
    script.src = scriptUrl;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Unable to load ${scriptUrl}.`));
    document.head.appendChild(script);
  });

  if (!window.CommerceHubConnectWebSdk) {
    throw new Error('The web SDK script did not register window.CommerceHubConnectWebSdk.');
  }

  return window.CommerceHubConnectWebSdk;
}
