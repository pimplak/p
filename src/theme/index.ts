import { createTheme, type MantineColorsTuple } from '@mantine/core';

// Smoky Black - ciemne tło i teksty
const smokyBlack: MantineColorsTuple = [
    '#f5f4f0',  // bardzo jasny dla tekstów na ciemnym
    '#e8e6e0',  // jasny szary
    '#d4d0c8',  // średni jasny
    '#bfb9ae',  // średni
    '#a8a095',  // średni ciemny
    '#8f867b',  // ciemny
    '#756c61',  // bardzo ciemny
    '#5c5248',  // prawie czarny
    '#423930',  // bardzo ciemny brąz
    '#100b00'   // główny smoky black
];

// Yellow Green - główny akcent i przyciski
const yellowGreen: MantineColorsTuple = [
    '#f8fef0',  // bardzo jasny zielony
    '#f0fcde',  // jasny zielony tło
    '#e4f8c4',  // jasny zielony
    '#d4f3a3',  // średni jasny
    '#c2ed7f',  // średni
    '#aee458',  // średni intensywny
    '#85cb33',  // główny yellow green
    '#6ba828',  // ciemny
    '#53831f',  // bardzo ciemny
    '#3d5f17'   // najciemniejszy
];

// Nyanza - jasne tła i subtelne akcenty
const nyanza: MantineColorsTuple = [
    '#fefffe',  // prawie biały
    '#fcfefc',  // bardzo jasny
    '#f8fcf8',  // jasny
    '#f3faf3',  // jasny zielonkawy
    '#eef7ee',  // średni jasny
    '#e8f4e8',  // średni
    '#efffc8',  // główny nyanza
    '#d9f0b8',  // średni ciemny
    '#c4e2a8',  // ciemny
    '#afd498'   // najciemniejszy
];

// Ash Gray - neutralne elementy i granice
const ashGray: MantineColorsTuple = [
    '#f9faf9',  // bardzo jasny
    '#f3f5f4',  // jasny
    '#eaeeed',  // jasny szary
    '#dde3e0',  // średni jasny
    '#cdd6d2',  // średni
    '#b8c7c1',  // średni ciemny
    '#a5cbc3',  // główny ash gray
    '#8ba99f',  // ciemny
    '#72897c',  // bardzo ciemny
    '#5a6b5e'   // najciemniejszy
];

// Drab Dark Brown - ciemne akcenty i teksty
const drabDarkBrown: MantineColorsTuple = [
    '#f6f5f3',  // bardzo jasny brąz
    '#edeae6',  // jasny brąz
    '#e0dbd4',  // jasny
    '#d0c8be',  // średni jasny
    '#beb3a5',  // średni
    '#a8998a',  // średni ciemny
    '#8e7d6d',  // ciemny
    '#6f5e4f',  // bardzo ciemny
    '#504439',  // prawie czarny
    '#3b341f'   // główny drab dark brown
];

// Mapowanie standardowych kolorów Mantine na naszą paletę
const blue = ashGray;        // niebieski -> ash gray
const green = yellowGreen;   // zielony -> yellow green  
const red = drabDarkBrown;   // czerwony -> drab dark brown

export const theme = createTheme({
    primaryColor: 'yellowGreen',
    colors: {
        smokyBlack,
        yellowGreen,
        nyanza,
        ashGray,
        drabDarkBrown,
        // Aliasy dla kompatybilności
        blue,
        green,
        red,
    },
    defaultRadius: 'md',
    fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',

    // MOBILE-OPTIMIZED SIZING
    fontSizes: {
        xs: '0.7rem',
        sm: '0.8rem',
        md: '0.9rem',
        lg: '1.1rem',
        xl: '1.3rem',
    },

    spacing: {
        xs: '0.5rem',
        sm: '0.75rem',
        md: '1rem',
        lg: '1.25rem',
        xl: '1.5rem',
    },

    breakpoints: {
        xs: '36em',
        sm: '48em',
        md: '62em',
        lg: '75em',
        xl: '88em',
    },

    components: {
        AppShell: {
            defaultProps: {
                padding: 'sm',
            },
        },

        Button: {
            defaultProps: {
                variant: 'filled',
                color: 'yellowGreen',
                size: 'sm',
                radius: 'md',
            },
        },

        Card: {
            defaultProps: {
                shadow: 'sm',
                withBorder: true,
                radius: 'md',
                padding: 'sm',
            },
        },

        Table: {
            defaultProps: {
                striped: true,
                highlightOnHover: true,
                fontSize: 'sm',
            },
        },

        Modal: {
            defaultProps: {
                centered: true,
                overlayProps: {
                    opacity: 0.75,
                    blur: 4,
                    backgroundOpacity: 0.55,
                },
                size: 'md',
                transitionProps: { transition: 'fade', duration: 200 },
            },
        },

        TextInput: {
            defaultProps: {
                variant: 'filled',
                size: 'sm',
            },
        },

        Select: {
            defaultProps: {
                variant: 'filled',
                size: 'sm',
            },
        },

        NumberInput: {
            defaultProps: {
                variant: 'filled',
                size: 'sm',
            },
        },

        Textarea: {
            defaultProps: {
                variant: 'filled',
                size: 'sm',
            },
        },

        NavLink: {
            defaultProps: {
                variant: 'filled',
            },
        },

        Badge: {
            defaultProps: {
                color: 'ashGray',
                variant: 'filled',
                size: 'sm',
            },
        },

        Alert: {
            defaultProps: {
                color: 'ashGray',
            },
        },

        ActionIcon: {
            defaultProps: {
                size: 'sm',
                variant: 'light',
            },
        },
    },
}); 