export declare const COMMERCE_HUB_CONNECT_ENVIRONMENTS: readonly ["dev", "qa", "cat", "prod"];
export type CommerceHubConnectEnvironment = (typeof COMMERCE_HUB_CONNECT_ENVIRONMENTS)[number];
export declare const COMMERCE_HUB_CONNECT_API_BASE_URL_BY_ENVIRONMENT: Record<CommerceHubConnectEnvironment, string>;
export declare function isCommerceHubConnectEnvironment(value: unknown): value is CommerceHubConnectEnvironment;
export declare function normalizeCommerceHubConnectEnvironment(value?: CommerceHubConnectEnvironment | null): CommerceHubConnectEnvironment;
export declare function normalizeCommerceHubConnectRuntimeOrigin(runtimeOrigin?: string): string | undefined;
export declare function resolveCommerceHubConnectApiBaseUrl(environment?: CommerceHubConnectEnvironment, runtimeOrigin?: string): string;
