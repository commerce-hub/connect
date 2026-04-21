import { EnvironmentProviders } from '@angular/core';
import { providePrimeNG } from 'primeng/config';

import { commerceHubSdkThemePreset } from './commerce-hub-sdk-theme.preset';

export interface CommerceHubSdkThemeOptions {
  ripple?: boolean;
  inputVariant?: 'outlined' | 'filled';
  darkModeSelector?: string | false;
  cssLayer?: boolean;
}

export function provideCommerceHubSdkTheme(
  options: CommerceHubSdkThemeOptions = {},
): EnvironmentProviders {
  return providePrimeNG({
    ripple: options.ripple ?? false,
    inputVariant: options.inputVariant ?? 'filled',
    theme: {
      preset: commerceHubSdkThemePreset,
      options: {
        darkModeSelector: options.darkModeSelector ?? false,
        cssLayer: options.cssLayer ?? false,
      },
    },
  });
}
