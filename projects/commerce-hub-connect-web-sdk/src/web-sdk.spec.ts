import { registerCommerceHubConnectWebSdk } from './web-sdk';

describe('registerCommerceHubConnectWebSdk', () => {
  it('registers the browser namespace and custom element', async () => {
    const namespace = await registerCommerceHubConnectWebSdk();

    expect(namespace.tagName).toBe('commerce-hub-connect-widget');
    expect(window.CommerceHubConnectWebSdk).toBe(namespace);
    expect(customElements.get(namespace.tagName)).toBeDefined();
  });
});
