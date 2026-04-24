export interface CommerceHubConnectWebSdkClient {
  createInteraction(payload: unknown): Promise<unknown>;
  getInteractionStatus(): Promise<unknown>;
  sendInteractionOtp(payload: unknown): Promise<unknown>;
  sendInteractionOtpToEmail(payload: unknown): Promise<unknown>;
  validateInteractionOtp(payload: unknown): Promise<unknown>;
  getCustomerProfile(): Promise<unknown>;
}

interface CommerceHubConnectWebSdkNamespace {
  createClient(options?: { baseUrl?: string }): CommerceHubConnectWebSdkClient;
}

declare global {
  interface Window {
    CommerceHubConnectWebSdk?: CommerceHubConnectWebSdkNamespace;
  }
}

export async function loadBrowserSdk(): Promise<CommerceHubConnectWebSdkNamespace> {
  if (window.CommerceHubConnectWebSdk) {
    return window.CommerceHubConnectWebSdk;
  }

  await new Promise<void>((resolve, reject) => {
    const script = document.createElement('script');
    script.src = '/sdk/commerce-hub-connect-sdk.js';
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Unable to load /sdk/commerce-hub-connect-sdk.js'));
    document.head.appendChild(script);
  });

  if (!window.CommerceHubConnectWebSdk) {
    throw new Error('The browser SDK did not register window.CommerceHubConnectWebSdk.');
  }

  return window.CommerceHubConnectWebSdk;
}
