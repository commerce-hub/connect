import { type CommerceHubConnectEnvironment } from './contracts/environment';
import type { CommerceHubConnectWebSdkMountOptions } from './web-sdk-types';
export declare function resolveSdkRuntimeOrigin(doc?: Document): string | undefined;
export declare function resolveMountTarget(target: string | Element, doc?: Document): Element;
export declare function validateMountRequest(options: CommerceHubConnectWebSdkMountOptions, environment?: CommerceHubConnectEnvironment): void;
export declare function escapeHtml(value: string): string;
export declare function createStableId(prefix: string): string;
