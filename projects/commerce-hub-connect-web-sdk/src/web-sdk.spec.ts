import type { InteractionResponse, PaymentSource } from './contracts/api-models';
import {
  registerCommerceHubConnectWebSdk,
  resolveApiBaseUrl,
  type CommerceHubConnectWebSdkMountOptions,
} from './web-sdk';

function createConfiguration(overrides: Partial<CommerceHubConnectWebSdkMountOptions['configuration']> = {}) {
  return {
    onSuccess: jasmine.createSpy('onSuccess'),
    onError: jasmine.createSpy('onError'),
    ...overrides,
  };
}

function createInteraction(
  overrides: Partial<InteractionResponse> = {},
  paymentSources: PaymentSource[] = [],
): InteractionResponse {
  return {
    interactionId: 'interaction-1',
    status: 'EMAIL_REQUESTED',
    paymentSources,
    allowedTenderTypes: ['CARD', 'BANK_ACCOUNT'],
    allowEmailChange: true,
    ...overrides,
  };
}

describe('web sdk', () => {
  let mountTarget: HTMLDivElement;

  beforeEach(() => {
    mountTarget = document.createElement('div');
    mountTarget.id = 'mount-target';
    document.body.appendChild(mountTarget);
    (globalThis as typeof globalThis & { __commerceHubConnectWebSdkInlineCss?: string })
      .__commerceHubConnectWebSdkInlineCss = '.commerce-hub-connect-web-sdk-mount { --spec-loaded: yes; }';
    delete window.CommerceHubConnectWebSdk;
  });

  afterEach(() => {
    mountTarget.remove();
    delete window.CommerceHubConnectWebSdk;
  });

  it('registers the browser namespace and custom element', async () => {
    const namespace = await registerCommerceHubConnectWebSdk();

    expect(namespace.tagName).toBe('commerce-hub-connect-widget');
    expect(window.CommerceHubConnectWebSdk).toBe(namespace);
    expect(customElements.get(namespace.tagName)).toBeDefined();
  });

  it('resolves api base urls from the selected environment and runtime origin', () => {
    const localDocument = {
      currentScript: { src: 'http://localhost:8080/dist/CommerceHubConnectSDK.js' },
      location: { origin: 'https://merchant.example' },
    } as Document;

    const remoteDocument = {
      currentScript: { src: 'https://cdn.example/sdk/CommerceHubConnectSDK.js' },
      location: { origin: 'https://merchant.example' },
    } as Document;

    expect(resolveApiBaseUrl('cat', localDocument)).toBe(
      'http://localhost:8080/commerce-hub-proxy/cat',
    );
    expect(resolveApiBaseUrl('prod', remoteDocument)).toBe(
      'https://dev.openfx-nonprod.aws.fisv.cloud',
    );
  });

  it('mounts an inline widget, injects the stylesheet once, and updates in place', async () => {
    const namespace = await registerCommerceHubConnectWebSdk();
    const savedCard: PaymentSource = {
      id: 'card-1',
      name: 'Primary Visa',
      tenderType: 'CARD',
      card: {
        cardNumber: '4111111111111111',
        cvv: '***',
        expirationMonth: '12',
        expirationYear: '30',
        nameOnCard: 'Smoke Tester',
        network: 'Visa',
      },
    };

    const stylesheetCountBeforeMount = document.head.querySelectorAll(
      '[data-commerce-hub-connect-web-sdk-style="true"]',
    ).length;

    const instance = await namespace.mount('#mount-target', {
      interaction: createInteraction(),
      configuration: createConfiguration(),
      whiteLabel: {
        primaryColor: '#ff5a1f',
      },
    });

    const stylesheetCountAfterMount = document.head.querySelectorAll(
      '[data-commerce-hub-connect-web-sdk-style="true"]',
    ).length;

    expect(stylesheetCountAfterMount).toBeGreaterThan(0);
    expect(stylesheetCountAfterMount).toBe(stylesheetCountBeforeMount || 1);
    expect(mountTarget.querySelector('.commerce-hub-connect-web-sdk-mount')).toBe(instance.hostElement);
    expect(instance.hostElement.textContent).toContain('Sign in');
    expect(instance.hostElement.style.getPropertyValue('--ch-sdk-primary').trim()).toBe('#ff5a1f');

    await instance.update({
      interaction: createInteraction(
        {
          interactionId: 'interaction-1',
          status: 'PAYMENT_SOURCE_REQUESTED',
          selectedSource: savedCard,
        },
        [savedCard],
      ),
      configuration: createConfiguration({ paymentSelectionTitle: 'Saved methods' }),
      whiteLabel: {
        primaryColor: '#1d4ed8',
      },
    });

    expect(document.head.querySelectorAll('[data-commerce-hub-connect-web-sdk-style="true"]').length).toBe(
      stylesheetCountAfterMount,
    );
    expect(instance.hostElement.textContent).toContain('Saved methods');
    expect(instance.hostElement.textContent).toContain('Primary Visa');
    expect(instance.hostElement.style.getPropertyValue('--ch-sdk-primary').trim()).toBe('#1d4ed8');

    instance.destroy();
    expect(mountTarget.querySelector('.commerce-hub-connect-web-sdk-mount')).toBeNull();
  });

  it('renders the host-mounted custom element with inline properties', async () => {
    const namespace = await registerCommerceHubConnectWebSdk();
    const element = namespace.createElement(
      {
        interaction: createInteraction(),
        configuration: createConfiguration(),
        whiteLabel: {
          secondaryColor: '#1d4ed8',
        },
      },
      'qa',
    );

    mountTarget.appendChild(element);
    await Promise.resolve();
    await Promise.resolve();

    expect(element.querySelector('.commerce-hub-connect-web-sdk-mount')).not.toBeNull();
    expect(element.textContent).toContain('Sign in');
    const emailInput = element.querySelector('input[name="email"]') as HTMLInputElement | null;
    expect(emailInput?.value).toBe('');
  });
});
