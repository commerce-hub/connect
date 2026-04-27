import { InjectionToken } from '@angular/core';

import {
  normalizeCommerceHubConnectEnvironment,
  type CommerceHubConnectEnvironment,
} from './commerce-hub-connect-environment';

export type CommerceHubConnectEnvironmentResolver = () => CommerceHubConnectEnvironment;

export const COMMERCE_HUB_CONNECT_ENVIRONMENT = new InjectionToken<CommerceHubConnectEnvironmentResolver>(
  'COMMERCE_HUB_CONNECT_ENVIRONMENT',
  {
    providedIn: 'root',
    factory: () => () => normalizeCommerceHubConnectEnvironment(),
  },
);
