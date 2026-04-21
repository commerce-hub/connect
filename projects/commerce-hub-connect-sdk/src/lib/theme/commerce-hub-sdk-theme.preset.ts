import { definePreset } from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';

export const commerceHubSdkThemePreset = definePreset(Aura, {
  primitive: {
    borderRadius: {
      none: '0',
      xs: '0.375rem',
      sm: '0.625rem',
      md: '0.875rem',
      lg: '1rem',
      xl: '1.25rem',
    },
  },
  semantic: {
    primary: {
      0: '#ffffff',
      50: 'color-mix(in srgb, var(--brand-primary-color) 10%, white)',
      100: 'color-mix(in srgb, var(--brand-primary-color) 16%, white)',
      200: 'color-mix(in srgb, var(--brand-primary-color) 24%, white)',
      300: 'color-mix(in srgb, var(--brand-primary-color) 36%, white)',
      400: 'color-mix(in srgb, var(--brand-primary-color) 52%, white)',
      500: 'var(--brand-primary-color)',
      600: 'color-mix(in srgb, var(--brand-primary-color) 88%, black)',
      700: 'color-mix(in srgb, var(--brand-primary-color) 76%, black)',
      800: 'color-mix(in srgb, var(--brand-primary-color) 64%, black)',
      900: 'color-mix(in srgb, var(--brand-primary-color) 52%, black)',
      950: 'color-mix(in srgb, var(--brand-primary-color) 40%, black)',
    },
    tertiary: {
      0: '#ffffff',
      50: 'color-mix(in srgb, var(--brand-secondary-color) 10%, white)',
      100: 'color-mix(in srgb, var(--brand-secondary-color) 16%, white)',
      200: 'color-mix(in srgb, var(--brand-secondary-color) 24%, white)',
      300: 'color-mix(in srgb, var(--brand-secondary-color) 36%, white)',
      400: 'color-mix(in srgb, var(--brand-secondary-color) 52%, white)',
      500: 'var(--brand-secondary-color)',
      600: 'color-mix(in srgb, var(--brand-secondary-color) 88%, black)',
      700: 'color-mix(in srgb, var(--brand-secondary-color) 76%, black)',
      800: 'color-mix(in srgb, var(--brand-secondary-color) 64%, black)',
      900: 'color-mix(in srgb, var(--brand-secondary-color) 52%, black)',
      950: 'color-mix(in srgb, var(--brand-secondary-color) 40%, black)',
    },
    focusRing: {
      width: '2px',
      style: 'solid',
      color: 'color-mix(in srgb, var(--brand-primary-color) 22%, white)',
      offset: '0',
      shadow: '0 0 0 4px color-mix(in srgb, var(--brand-primary-color) 12%, white)',
    },
    colorScheme: {
      light: {
        primary: {
          color: 'var(--brand-primary-color)',
          contrastColor: 'var(--brand-on-primary-color)',
          hoverColor: 'color-mix(in srgb, var(--brand-primary-color) 88%, black)',
          activeColor: 'color-mix(in srgb, var(--brand-primary-color) 76%, black)',
        },
        tertiary: {
          color: 'var(--brand-secondary-color)',
          contrastColor: 'var(--brand-on-secondary-color)',
          hoverColor: 'color-mix(in srgb, var(--brand-secondary-color) 88%, black)',
          activeColor: 'color-mix(in srgb, var(--brand-secondary-color) 76%, black)',
        },
      },
      dark: {
        primary: {
          color: 'var(--brand-primary-color)',
          contrastColor: 'var(--brand-on-primary-color)',
          hoverColor: 'color-mix(in srgb, var(--brand-primary-color) 80%, white)',
          activeColor: 'color-mix(in srgb, var(--brand-primary-color) 68%, white)',
        },
        tertiary: {
          color: 'var(--brand-secondary-color)',
          contrastColor: 'var(--brand-on-secondary-color)',
          hoverColor: 'color-mix(in srgb, var(--brand-secondary-color) 80%, white)',
          activeColor: 'color-mix(in srgb, var(--brand-secondary-color) 68%, white)',
        },
      },
    },
  },
});
