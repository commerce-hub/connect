import {
  COMMERCE_HUB_CONNECT_API_BASE_URL_BY_ENVIRONMENT,
  COMMERCE_HUB_CONNECT_ENVIRONMENTS,
  isCommerceHubConnectEnvironment,
  normalizeCommerceHubConnectEnvironment,
  resolveCommerceHubConnectApiBaseUrl,
} from './commerce-hub-connect-environment';

const expectedApiBaseUrl = 'https://dev.openfx-nonprod.aws.fisv.cloud';

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
    expect(COMMERCE_HUB_CONNECT_API_BASE_URL_BY_ENVIRONMENT.dev).toBe(expectedApiBaseUrl);
    expect(COMMERCE_HUB_CONNECT_API_BASE_URL_BY_ENVIRONMENT.qa).toBe(expectedApiBaseUrl);
    expect(COMMERCE_HUB_CONNECT_API_BASE_URL_BY_ENVIRONMENT.cat).toBe(expectedApiBaseUrl);
    expect(COMMERCE_HUB_CONNECT_API_BASE_URL_BY_ENVIRONMENT.prod).toBe(expectedApiBaseUrl);
  });

  it('returns the configured remote API url when the runtime origin is not local', () => {
    expect(resolveCommerceHubConnectApiBaseUrl('dev')).toBe(expectedApiBaseUrl);
    expect(resolveCommerceHubConnectApiBaseUrl('prod', 'https://merchant.example')).toBe(expectedApiBaseUrl);
    expect(resolveCommerceHubConnectApiBaseUrl('prod', 'null')).toBe(expectedApiBaseUrl);
    expect(resolveCommerceHubConnectApiBaseUrl('prod', 'file:///Users/demo/sdk/index.html')).toBe(
      expectedApiBaseUrl,
    );
  });

  it('returns a same-origin proxy path for local browser runtimes', () => {
    expect(resolveCommerceHubConnectApiBaseUrl('dev', 'http://localhost:63342')).toBe(
      'http://localhost:63342/commerce-hub-proxy/dev',
    );
    expect(resolveCommerceHubConnectApiBaseUrl('cat', 'https://127.0.0.1:8080')).toBe(
      'https://127.0.0.1:8080/commerce-hub-proxy/cat',
    );
  });
});
