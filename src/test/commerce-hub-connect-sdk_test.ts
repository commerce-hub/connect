import {assert, fixture, html as testingHtml} from '@open-wc/testing';

import {CommerceHubConnect, type InteractionResponse} from '../commerce-hub-connect.js';

type CommerceHubSdkError = {
  message: string;
  stage: string;
  status?: number;
  cause?: unknown;
};

type CommerceHubSdkConfiguration = {
  baseUrl: string;
  onSuccess: (interaction: InteractionResponse) => void;
  onError: (error: CommerceHubSdkError) => void;
  paymentSelectionTitle?: string;
  paymentSelectionConfirmLabel?: string;
  whiteLabel?: {
    primaryColor?: string;
    secondaryColor?: string;
    textColor?: string;
    fontFamily?: string;
    logoUrl?: string;
  };
};

type CommerceHubSdkMountOptions = {
  interaction: InteractionResponse;
  configuration: CommerceHubSdkConfiguration;
};

type CommerceHubConnectSdkInstance = {
  element: CommerceHubConnect;
  update: (options: CommerceHubSdkMountOptions) => void;
  destroy: () => void;
};

type MountCommerceHubConnect = (
  target: string | Element,
  options: CommerceHubSdkMountOptions
) => CommerceHubConnectSdkInstance;

const waitFor = async (
  predicate: () => boolean,
  timeoutMs = 1000
): Promise<void> => {
  const startedAt = Date.now();

  while (Date.now() - startedAt < timeoutMs) {
    if (predicate()) {
      return;
    }

    await new Promise((resolve) => setTimeout(resolve, 10));
  }

  assert.fail('Timed out waiting for the expected SDK callback.');
};

suite('commerce-hub-connect sdk mount helper', () => {
  const originalFetch = window.fetch;

  teardown(() => {
    window.fetch = originalFetch;
  });

  test('does not call onSuccess on initial hydration and calls it after attach succeeds', async () => {
    const moduleNamespace = (await import('../commerce-hub-connect.js')) as Record<
      string,
      unknown
    >;
    const mountCommerceHubConnect = moduleNamespace[
      'mountCommerceHubConnect'
    ] as MountCommerceHubConnect | undefined;

    assert.isFunction(mountCommerceHubConnect);

    const attachedInteraction: InteractionResponse = {
      interactionId: 'interaction-1',
      status: 'PAYMENT_SOURCE_ATTACHED',
      selectedSource: {
        tenderType: 'Card',
        id: 'card-1',
        name: 'Corporate card',
      },
    };
    const successCalls: InteractionResponse[] = [];
    const errorCalls: CommerceHubSdkError[] = [];
    let receivedRequest: Request | undefined;

    window.fetch = async (input: RequestInfo | URL) => {
      receivedRequest = input instanceof Request ? input : new Request(input);

      return new Response(JSON.stringify(attachedInteraction), {
        status: 200,
        headers: {'Content-Type': 'application/json'},
      });
    };

    const host = document.createElement('div');
    document.body.append(host);

    const instance = mountCommerceHubConnect!(host, {
      interaction: {
        interactionId: 'interaction-1',
        status: 'PAYMENT_SOURCE_REQUESTED',
        selectedSource: {
          tenderType: 'Card',
          id: 'card-1',
          name: 'Corporate card',
        },
        paymentSources: [
          {
            tenderType: 'Card',
            id: 'card-1',
            name: 'Corporate card',
          },
        ],
      },
      configuration: {
        baseUrl: 'https://api.example.test',
        onSuccess: (interaction) => successCalls.push(interaction),
        onError: (error) => errorCalls.push(error),
      },
    });

    await instance.element.updateComplete;

    assert.lengthOf(successCalls, 0);

    instance.element.shadowRoot
      ?.querySelector<HTMLButtonElement>('button[data-action="confirm"]')
      ?.click();
    await instance.element.updateComplete;
    await waitFor(() => successCalls.length === 1);

    assert.equal(
      receivedRequest?.url,
      'https://api.example.test/interaction/payment-source/card-1/attach'
    );
    assert.lengthOf(successCalls, 1);
    assert.deepEqual(successCalls[0], attachedInteraction);
    assert.lengthOf(errorCalls, 0);

    instance.destroy();
    host.remove();
  });

  test('routes attach failures to onError', async () => {
    const moduleNamespace = (await import('../commerce-hub-connect.js')) as Record<
      string,
      unknown
    >;
    const mountCommerceHubConnect = moduleNamespace[
      'mountCommerceHubConnect'
    ] as MountCommerceHubConnect | undefined;

    assert.isFunction(mountCommerceHubConnect);

    const successCalls: InteractionResponse[] = [];
    const errorCalls: CommerceHubSdkError[] = [];

    window.fetch = async () =>
      new Response(JSON.stringify({message: 'Attach failed'}), {
        status: 500,
        headers: {'Content-Type': 'application/json'},
      });

    const host = (await fixture(
      testingHtml`<div id="sdk-host"></div>`
    )) as HTMLDivElement;

    const instance = mountCommerceHubConnect!(host, {
      interaction: {
        interactionId: 'interaction-1',
        status: 'PAYMENT_SOURCE_REQUESTED',
        selectedSource: {
          tenderType: 'Card',
          id: 'card-1',
          name: 'Corporate card',
        },
        paymentSources: [
          {
            tenderType: 'Card',
            id: 'card-1',
            name: 'Corporate card',
          },
        ],
      },
      configuration: {
        baseUrl: 'https://api.example.test',
        onSuccess: (interaction) => successCalls.push(interaction),
        onError: (error) => errorCalls.push(error),
      },
    });

    await instance.element.updateComplete;

    instance.element.shadowRoot
      ?.querySelector<HTMLButtonElement>('button[data-action="confirm"]')
      ?.click();
    await instance.element.updateComplete;
    await waitFor(() => errorCalls.length === 1);

    assert.lengthOf(successCalls, 0);
    assert.lengthOf(errorCalls, 1);
    assert.equal(errorCalls[0].stage, 'payment_source');
    assert.equal(errorCalls[0].status, 500);

    instance.destroy();
  });
});
