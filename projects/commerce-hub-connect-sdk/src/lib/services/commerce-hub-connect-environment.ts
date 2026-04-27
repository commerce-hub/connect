export const COMMERCE_HUB_CONNECT_ENVIRONMENTS = ['dev', 'qa', 'cat', 'prod'] as const;

export type CommerceHubConnectEnvironment =
  (typeof COMMERCE_HUB_CONNECT_ENVIRONMENTS)[number];

export const COMMERCE_HUB_CONNECT_API_BASE_URL_BY_ENVIRONMENT: Record<
  CommerceHubConnectEnvironment,
  string
> = {
  dev: 'https://dev.openfx-nonprod.aws.fisv.cloud',
  qa: 'https://dev.openfx-nonprod.aws.fisv.cloud',
  cat: 'https://dev.openfx-nonprod.aws.fisv.cloud',
  prod: 'https://dev.openfx-nonprod.aws.fisv.cloud',
};

const LOCAL_RUNTIME_HOSTNAMES = new Set(['localhost', '127.0.0.1', '[::1]']);
const LOCAL_PROXY_BASE_PATH = '/commerce-hub-proxy';

export function isCommerceHubConnectEnvironment(
  value: unknown,
): value is CommerceHubConnectEnvironment {
  return (
    typeof value === 'string' &&
    COMMERCE_HUB_CONNECT_ENVIRONMENTS.includes(value as CommerceHubConnectEnvironment)
  );
}

export function normalizeCommerceHubConnectEnvironment(
  value?: CommerceHubConnectEnvironment | null,
): CommerceHubConnectEnvironment {
  return value ?? 'prod';
}

export function normalizeCommerceHubConnectRuntimeOrigin(
  runtimeOrigin?: string,
): string | undefined {
  const trimmedOrigin = runtimeOrigin?.trim();

  if (!trimmedOrigin) {
    return undefined;
  }

  try {
    const parsedOrigin = new URL(trimmedOrigin);

    if (parsedOrigin.protocol !== 'http:' && parsedOrigin.protocol !== 'https:') {
      return undefined;
    }

    return parsedOrigin.origin;
  } catch {
    return undefined;
  }
}

export function resolveCommerceHubConnectApiBaseUrl(
  environment?: CommerceHubConnectEnvironment,
  runtimeOrigin?: string,
): string {
  const normalizedEnvironment = normalizeCommerceHubConnectEnvironment(environment);

  const normalizedRuntimeOrigin = normalizeCommerceHubConnectRuntimeOrigin(runtimeOrigin);

  if (normalizedRuntimeOrigin) {
    const parsedRuntimeOrigin = new URL(normalizedRuntimeOrigin);

    if (LOCAL_RUNTIME_HOSTNAMES.has(parsedRuntimeOrigin.hostname)) {
      return `${parsedRuntimeOrigin.origin}${LOCAL_PROXY_BASE_PATH}/${normalizedEnvironment}`;
    }
  }

  return COMMERCE_HUB_CONNECT_API_BASE_URL_BY_ENVIRONMENT[normalizedEnvironment];
}
