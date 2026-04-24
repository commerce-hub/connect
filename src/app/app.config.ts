import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter } from '@angular/router';
import {
  COMMERCE_HUB_CONNECT_API_BASE_URL,
  provideCommerceHubSdkTheme,
} from 'commerce-hub-connect-sdk';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideAnimationsAsync(),
    provideHttpClient(),
    provideRouter(routes),
    provideCommerceHubSdkTheme(),
    {
      provide: COMMERCE_HUB_CONNECT_API_BASE_URL,
      useValue: () => '/api',
    },
  ],
};
