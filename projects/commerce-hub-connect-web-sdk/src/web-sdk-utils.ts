import {
  type CommerceHubConnectEnvironment,
  isCommerceHubConnectEnvironment,
  normalizeCommerceHubConnectRuntimeOrigin,
} from 'commerce-hub-connect-sdk';

import type { CommerceHubConnectWebSdkMountOptions } from './web-sdk-types';

export function resolveSdkRuntimeOrigin(doc: Document = document): string | undefined {
  const currentScript = doc.currentScript as { src?: string } | null;
  const scriptOrigin = normalizeCommerceHubConnectRuntimeOrigin(currentScript?.src);

  if (scriptOrigin) {
    return scriptOrigin;
  }

  return normalizeCommerceHubConnectRuntimeOrigin(doc.location?.origin);
}

export function resolveMountTarget(target: string | Element, doc: Document = document): Element {
  if (typeof target !== 'string') {
    return target;
  }

  const resolvedTarget = doc.querySelector(target);
  if (!resolvedTarget) {
    throw new Error(`Unable to find a mount target for selector: ${target}`);
  }

  return resolvedTarget;
}

export function validateMountRequest(
  options: CommerceHubConnectWebSdkMountOptions,
  environment?: CommerceHubConnectEnvironment,
): void {
  if (!options || typeof options !== 'object') {
    throw new Error('Mount options are required.');
  }

  if (!options.configuration || typeof options.configuration !== 'object') {
    throw new Error('A CommerceHubSdkConfiguration object is required.');
  }

  if (!options.configuration.sessionReferenceId?.trim()) {
    throw new Error('configuration.sessionReferenceId is required.');
  }

  if (typeof options.configuration.onSuccess !== 'function') {
    throw new Error('configuration.onSuccess must be a function.');
  }

  if (typeof options.configuration.onError !== 'function') {
    throw new Error('configuration.onError must be a function.');
  }

  if (
    options.configuration.authType !== 'FINAL_SALE' &&
    options.configuration.authType !== 'AUTH_ONLY'
  ) {
    throw new Error('configuration.authType must be FINAL_SALE or AUTH_ONLY.');
  }

  if (environment !== undefined && !isCommerceHubConnectEnvironment(environment)) {
    throw new Error('environment must be one of dev, qa, cat, or prod.');
  }
}
