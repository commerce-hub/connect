export const COMMERCE_HUB_CONNECT_ENVIRONMENTS = ['dev', 'qa', 'cat', 'prod'] as const;

export type CommerceHubConnectEnvironment =
  (typeof COMMERCE_HUB_CONNECT_ENVIRONMENTS)[number];

export const COMMERCE_HUB_CONNECT_API_BASE_URL_BY_ENVIRONMENT: Record<
  CommerceHubConnectEnvironment,
  string
> = {
  dev: 'http://localhost:8080',
  qa: 'http://localhost:8080',
  cat: 'http://localhost:8080',
  prod: 'http://localhost:8080',
};

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
  void runtimeOrigin;

  const normalizedEnvironment = normalizeCommerceHubConnectEnvironment(environment);
  return COMMERCE_HUB_CONNECT_API_BASE_URL_BY_ENVIRONMENT[normalizedEnvironment];
}
