import { InjectionToken } from '@angular/core';

export const COMMERCE_HUB_CONNECT_API_BASE_URL = new InjectionToken<string>(
  'COMMERCE_HUB_CONNECT_API_BASE_URL',
  {
    providedIn: 'root',
    factory: () => '/api',
  },
);
