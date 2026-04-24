import { InjectionToken } from '@angular/core';

import { resolveCommerceHubConnectApiBaseUrl } from './commerce-hub-connect-environment';

export type CommerceHubConnectApiBaseUrlResolver = () => string;

export const COMMERCE_HUB_CONNECT_API_BASE_URL = new InjectionToken<CommerceHubConnectApiBaseUrlResolver>(
  'COMMERCE_HUB_CONNECT_API_BASE_URL',
  {
    providedIn: 'root',
    factory: () => () => resolveCommerceHubConnectApiBaseUrl('prod'),
  },
);
