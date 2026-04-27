import { getDebugNode } from '@angular/core';
import { of } from 'rxjs';

import {
  COMMERCE_HUB_CONNECT_API_BASE_URL_BY_ENVIRONMENT,
  CommerceHubConnectApiService,
  CommerceHubConnectSdkService,
  type CommerceHubSdkConfiguration,
  type InteractionResponse,
} from 'commerce-hub-connect-sdk';

import { mount, registerCommerceHubConnectWebSdk } from './web-sdk';

const ORIGINAL_API_BASE_URLS = {
  ...COMMERCE_HUB_CONNECT_API_BASE_URL_BY_ENVIRONMENT,
};

function createMountOptions(): {
  interaction: InteractionResponse;
  configuration: CommerceHubSdkConfiguration;
} {
  return {
    interaction: {
      interactionId: 'interaction-1',
      status: 'OTP_VALIDATION_PENDING',
      paymentSources: [],
      allowedTenderTypes: ['BANK_ACCOUNT'],
      allowEmailChange: true,
    },
    configuration: {
      onSuccess: () => undefined,
      onError: () => undefined,
      wallet: true,
    },
  };
}

describe('registerCommerceHubConnectWebSdk', () => {
  let mountTarget: HTMLDivElement | null = null;
  let expectedLocalProxyBaseUrl: string;

  beforeEach(() => {
    COMMERCE_HUB_CONNECT_API_BASE_URL_BY_ENVIRONMENT.dev = 'https://dev.example.test';
    COMMERCE_HUB_CONNECT_API_BASE_URL_BY_ENVIRONMENT.qa = 'https://qa.example.test';
    COMMERCE_HUB_CONNECT_API_BASE_URL_BY_ENVIRONMENT.cat = 'https://cat.example.test';
    COMMERCE_HUB_CONNECT_API_BASE_URL_BY_ENVIRONMENT.prod = 'https://prod.example.test';
    expectedLocalProxyBaseUrl = `${document.location.origin}/commerce-hub-proxy/cat`;

    mountTarget = document.createElement('div');
    document.body.appendChild(mountTarget);
  });

  afterEach(() => {
    Object.assign(COMMERCE_HUB_CONNECT_API_BASE_URL_BY_ENVIRONMENT, ORIGINAL_API_BASE_URLS);
    mountTarget?.remove();
    mountTarget = null;
    delete window.PaymentSDK;
  });

  it('registers the browser namespace and custom element', async () => {
    const namespace = await registerCommerceHubConnectWebSdk();

    expect(namespace.tagName).toBe('commerce-hub-connect-widget');
    expect(window.CommerceHubConnectWebSdk).toBe(namespace);
    expect(customElements.get(namespace.tagName)).toBeDefined();
  });

  it('resolves the api base url from the selected web sdk environment', async () => {
    const namespace = await registerCommerceHubConnectWebSdk();

    expect(namespace.resolveApiBaseUrl('cat')).toBe(expectedLocalProxyBaseUrl);
    expect(namespace.resolveApiBaseUrl()).toBe(`${document.location.origin}/commerce-hub-proxy/prod`);
  });

  it('initializes the api base url token from the selected web sdk environment', async () => {
    const instance = await mount(mountTarget!, createMountOptions(), 'cat');
    const debugNode = getDebugNode(instance.hostElement);
    const api = debugNode?.injector.get(CommerceHubConnectApiService) as
      | CommerceHubConnectApiService
      | undefined;

    expect(api).toBeDefined();
    expect(((api as any).resolveBaseUrl as () => string)()).toBe(expectedLocalProxyBaseUrl);

    instance.destroy();
  });

  it('ignores apiBaseUrl values passed at mount time and keeps the environment-based url', async () => {
    const instance = await mount(
      mountTarget!,
      {
        ...createMountOptions(),
        apiBaseUrl: 'https://merchant.example.test/commerce-hub/',
      } as any,
      'cat',
    );
    const debugNode = getDebugNode(instance.hostElement);
    const api = debugNode?.injector.get(CommerceHubConnectApiService) as
      | CommerceHubConnectApiService
      | undefined;

    expect(api).toBeDefined();
    expect(((api as any).resolveBaseUrl as () => string)()).toBe(expectedLocalProxyBaseUrl);

    instance.destroy();
  });

  it('passes the selected web sdk environment into pay by bank defaults', async () => {
    const instance = await mount(mountTarget!, createMountOptions(), 'cat');
    const debugNode = getDebugNode(instance.hostElement);
    const sdk = debugNode?.injector.get(CommerceHubConnectSdkService) as
      | CommerceHubConnectSdkService
      | undefined;

    expect(sdk).toBeDefined();

    const paymentSdkInit = jasmine
      .createSpy('init')
      .and.callFake((configuration: { onEvent: (event: { type: string }) => void }) => {
        configuration.onEvent({ type: 'cancel' });
      });

    window.PaymentSDK = {
      init: paymentSdkInit,
      destroy: jasmine.createSpy('destroy'),
    };

    spyOn<any>(sdk, 'getExistingBankSourceIds').and.resolveTo(new Set<string>());
    spyOn<any>(sdk, 'loadPaymentSdkScript').and.resolveTo();
    spyOn((sdk as any).api, 'createPayByBankSession').and.returnValue(
      of({
        aggregatorSessionId: 'agg-session-1',
        tokenID: 'access-token-1',
        pToken: 'p-token-1',
        publicKey: 'public-key-1',
      }),
    );

    await expectAsync(sdk!.launchPayByBank('pay-by-bank-container')).toBeRejected();

    expect(paymentSdkInit).toHaveBeenCalledWith(
      jasmine.objectContaining({
        environment: 'cat',
        containerId: 'pay-by-bank-container',
      }),
    );

    instance.destroy();
  });
});
