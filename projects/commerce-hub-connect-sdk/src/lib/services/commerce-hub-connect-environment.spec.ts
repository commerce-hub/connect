import {
  COMMERCE_HUB_CONNECT_API_BASE_URL_BY_ENVIRONMENT,
  COMMERCE_HUB_CONNECT_ENVIRONMENTS,
  isCommerceHubConnectEnvironment,
  normalizeCommerceHubConnectEnvironment,
  resolveCommerceHubConnectApiBaseUrl,
} from './commerce-hub-connect-environment';

describe('commerce hub connect environment helpers', () => {
  it('defaults missing environment values to prod', () => {
    expect(normalizeCommerceHubConnectEnvironment()).toBe('prod');
  });

  it('recognizes supported environments', () => {
    expect(COMMERCE_HUB_CONNECT_ENVIRONMENTS).toEqual(['dev', 'qa', 'cat', 'prod']);
    expect(isCommerceHubConnectEnvironment('qa')).toBeTrue();
    expect(isCommerceHubConnectEnvironment('staging')).toBeFalse();
  });

  it('maps every environment to the same explicit API base url for now', () => {
    expect(COMMERCE_HUB_CONNECT_API_BASE_URL_BY_ENVIRONMENT.dev).toBe('http://localhost:8080');
    expect(COMMERCE_HUB_CONNECT_API_BASE_URL_BY_ENVIRONMENT.qa).toBe('http://localhost:8080');
    expect(COMMERCE_HUB_CONNECT_API_BASE_URL_BY_ENVIRONMENT.cat).toBe('http://localhost:8080');
    expect(COMMERCE_HUB_CONNECT_API_BASE_URL_BY_ENVIRONMENT.prod).toBe('http://localhost:8080');
  });

  it('returns a self-contained API url regardless of runtime origin', () => {
    expect(resolveCommerceHubConnectApiBaseUrl('dev')).toBe('http://localhost:8080');
    expect(resolveCommerceHubConnectApiBaseUrl('prod', 'http://localhost:63342')).toBe(
      'http://localhost:8080',
    );
    expect(resolveCommerceHubConnectApiBaseUrl('prod', 'null')).toBe('http://localhost:8080');
    expect(resolveCommerceHubConnectApiBaseUrl('prod', 'file:///Users/demo/sdk/index.html')).toBe(
      'http://localhost:8080',
    );
  });
});
