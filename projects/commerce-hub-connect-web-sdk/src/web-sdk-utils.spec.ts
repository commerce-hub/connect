import {
  resolveMountTarget,
  resolveSdkRuntimeOrigin,
  validateMountRequest,
} from './web-sdk-utils';

describe('web sdk utils', () => {
  it('prefers the script url origin over window location', () => {
    const documentStub = {
      currentScript: { src: 'https://cdn.example/sdk/CommerceHubConnectSDK.js' },
      location: { origin: 'https://merchant.example' },
    } as Document;

    expect(resolveSdkRuntimeOrigin(documentStub)).toBe('https://cdn.example');
  });

  it('falls back to window location origin when no script tag is available', () => {
    const documentStub = {
      currentScript: null,
      location: { origin: 'https://merchant.example' },
    } as Document;

    expect(resolveSdkRuntimeOrigin(documentStub)).toBe('https://merchant.example');
  });

  it('ignores file-based script origins and falls back to the page origin', () => {
    const documentStub = {
      currentScript: { src: 'file:///Users/demo/CommerceHubConnectSDK.js' },
      location: { origin: 'https://merchant.example' },
    } as Document;

    expect(resolveSdkRuntimeOrigin(documentStub)).toBe('https://merchant.example');
  });

  it('returns undefined when neither the script nor the page expose a usable origin', () => {
    const documentStub = {
      currentScript: { src: 'file:///Users/demo/CommerceHubConnectSDK.js' },
      location: { origin: 'null' },
    } as Document;

    expect(resolveSdkRuntimeOrigin(documentStub)).toBeUndefined();
  });

  it('throws for invalid mount options', () => {
    expect(() =>
      validateMountRequest(
        {
          interaction: {
            interactionId: '',
            status: 'EMAIL_REQUESTED',
          },
          configuration: {
            onSuccess: () => undefined,
            onError: () => undefined,
          },
        } as never,
        'qa',
      ),
    ).toThrowError('interaction.interactionId is required.');
  });

  it('throws for unsupported environments', () => {
    expect(() =>
      validateMountRequest(
        {
          interaction: {
            interactionId: 'interaction-1',
            status: 'EMAIL_REQUESTED',
          },
          configuration: {
            onSuccess: () => undefined,
            onError: () => undefined,
          },
        },
        'uat' as never,
      ),
    ).toThrowError('environment must be one of dev, qa, cat, or prod.');
  });

  it('ignores legacy apiBaseUrl values because backend selection is environment-driven', () => {
    expect(() =>
      validateMountRequest(
        {
          interaction: {
            interactionId: 'interaction-1',
            status: 'EMAIL_REQUESTED',
          },
          configuration: {
            onSuccess: () => undefined,
            onError: () => undefined,
          },
          apiBaseUrl: 'ftp://merchant.example/commerce-hub',
        } as never,
        'qa',
      ),
    ).not.toThrow();
  });

  it('resolves selector targets from the document', () => {
    const element = document.createElement('div');
    element.id = 'mount-root';
    document.body.appendChild(element);

    expect(resolveMountTarget('#mount-root')).toBe(element);
  });
});
