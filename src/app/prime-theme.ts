import {definePreset} from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';

export const commerceHubPreset = definePreset(Aura, {
    components: {
        button: {
            root: {
                /*borderRadius: '16px',
                paddingY: '0.95rem',
                paddingX: '1.2rem',
                gap: '0.55rem',
                label: {
                  fontWeight: '600',
                },*/
                primary: {
                    background: 'var(--ch-primary-color)',
                    hoverBackground: 'color-mix(in srgb, var(--ch-primary-color) 88%, black)',
                    activeBackground: 'color-mix(in srgb, var(--ch-primary-color) 74%, black)',
                    borderColor: 'var(--ch-primary-color)',
                    hoverBorderColor: 'color-mix(in srgb, var(--ch-primary-color) 88%, black)',
                    activeBorderColor: 'color-mix(in srgb, var(--ch-primary-color) 74%, black)',
                    color: '#ffffff',
                    hoverColor: '#ffffff',
                    activeColor: '#ffffff',
                },
            },
        },
        /* inputtext: {
           root: {
             background: 'var(--ch-surface-color)',
             borderColor: 'var(--ch-border-color)',
             hoverBorderColor: 'var(--ch-primary-color)',
             focusBorderColor: 'var(--ch-primary-color)',
             color: 'var(--ch-text-color)',
             placeholderColor: 'color-mix(in srgb, var(--ch-secondary-color) 74%, white)',
             borderRadius: '16px',
             paddingX: '1rem',
             paddingY: '0.95rem',
             focusRing: {
               width: '2px',
               style: 'solid',
               color: 'color-mix(in srgb, var(--ch-primary-color) 10%, white)',
               offset: '0',
               shadow: '0 0 0 4px color-mix(in srgb, var(--ch-primary-color) 12%, white)',
             },
           },
         },
         inputotp: {
           root: {
             gap: '0.75rem',
           },
         },
         divider: {
           root: {
             borderColor: 'color-mix(in srgb, var(--ch-secondary-color) 20%, white)',
           },
           horizontal: {
             margin: '1.35rem 0',
           },
         },
         tabs: {
           tablist: {
             borderWidth: '0',
             borderColor: 'transparent',
             background: 'transparent',
           },
           tab: {
             padding: '0.8rem 1rem',
             margin: '0 0.5rem 0 0',
             background: 'rgba(255,255,255,0.55)',
             hoverBackground: 'rgba(255,255,255,0.78)',
             activeBackground: 'rgba(255,255,255,0.95)',
             color: 'var(--ch-secondary-color)',
             hoverColor: 'var(--ch-text-color)',
             activeColor: 'var(--ch-primary-color)',
             borderWidth: '0',
           },
           tabpanel: {
             background: 'transparent',
             padding: '1rem 0 0',
           },
           activeBar: {
             height: '0',
           },
         },*/
    },
});
