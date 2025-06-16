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

// === NOWA PALETA MAGENTA-ROSE ===

// Dark Magenta - główny ciemny kolor
const darkMagenta: MantineColorsTuple = [
    '#faf3fb',  // bardzo jasny
    '#f0e4f2',  // jasny
    '#e1c9e5',  // jasny fioletowy
    '#d1abd6',  // średni jasny
    '#be89c5',  // średni
    '#a963b0',  // średni intensywny
    '#861388',  // główny dark magenta
    '#6e0f70',  // ciemny
    '#560c57',  // bardzo ciemny
    '#420943'   // najciemniejszy
];

// Brilliant Rose - główny akcent i przyciski
const brilliantRose: MantineColorsTuple = [
    '#fef5f9',  // bardzo jasny różowy
    '#fde8f1',  // jasny różowy
    '#fad0e4',  // jasny
    '#f6b5d6',  // średni jasny
    '#f194c4',  // średni
    '#eb6aaf',  // średni intensywny
    '#e15a97',  // główny brilliant rose
    '#c14480',  // ciemny
    '#a33169',  // bardzo ciemny
    '#872254'   // najciemniejszy
];

// Lavender Pink - jasne tła i subtelne akcenty
const lavenderPink: MantineColorsTuple = [
    '#fefcfd',  // prawie biały
    '#fdf8fa',  // bardzo jasny
    '#fbf3f6',  // jasny
    '#f8edf2',  // jasny różowawy
    '#f4e6ec',  // średni jasny
    '#f0dde5',  // średni
    '#eeabc4',  // główny lavender pink
    '#e194b8',  // średni ciemny
    '#d37eac',  // ciemny
    '#c569a0'   // najciemniejszy
];

// Puce - neutralne elementy i granice
const puce: MantineColorsTuple = [
    '#fbf8f9',  // bardzo jasny
    '#f6f1f3',  // jasny
    '#f0eaec',  // jasny szary
    '#e7dde0',  // średni jasny
    '#dccdd2',  // średni
    '#cdb8c0',  // średni ciemny
    '#c799a6',  // główny puce
    '#a97f8e',  // ciemny
    '#8b6876',  // bardzo ciemny
    '#6e5260'   // najciemniejszy
];

// Violet JTC - ciemne akcenty i teksty
const violetJtc: MantineColorsTuple = [
    '#f5f3f4',  // bardzo jasny fioletowy
    '#e9e4e7',  // jasny fioletowy
    '#dad0d6',  // jasny
    '#c8b9c2',  // średni jasny
    '#b39fab',  // średni
    '#9a8191',  // średni ciemny
    '#7e6474',  // ciemny
    '#624956',  // bardzo ciemny
    '#4b2840',  // główny violet jtc
    '#3a1f32'   // najciemniejszy
];

// Mapowanie standardowych kolorów Mantine dla palety naturalnej
const naturalBlue = ashGray;
const naturalGreen = yellowGreen;
const naturalRed = drabDarkBrown;

// Mapowanie standardowych kolorów Mantine dla palety magenta-rose
const magentaBlue = puce;
const magentaGreen = brilliantRose;
const magentaRed = violetJtc;

// Funkcja tworząca temat na podstawie wybranej palety
export const createAppTheme = (palette: 'naturalne' | 'magenta-rose' = 'naturalne') => {
    const isNatural = palette === 'naturalne';

    return createTheme({
        primaryColor: isNatural ? 'yellowGreen' : 'brilliantRose',
        colors: {
            // Zawsze dostępne kolory naturalne
            smokyBlack,
            yellowGreen,
            nyanza,
            ashGray,
            drabDarkBrown,

            // Zawsze dostępne kolory magenta-rose
            darkMagenta,
            brilliantRose,
            lavenderPink,
            puce,
            violetJtc,

            // Aliasy zależne od palety
            blue: isNatural ? naturalBlue : magentaBlue,
            green: isNatural ? naturalGreen : magentaGreen,
            red: isNatural ? naturalRed : magentaRed,
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
                    color: isNatural ? 'yellowGreen' : 'brilliantRose',
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
                    size: 'sm',
                    radius: 'sm',
                },
            },

            Alert: {
                defaultProps: {
                    variant: 'filled',
                    radius: 'md',
                },
            },

            Notification: {
                defaultProps: {
                    radius: 'md',
                    withCloseButton: true,
                },
            },

            Paper: {
                defaultProps: {
                    shadow: 'xs',
                    p: 'md',
                    radius: 'md',
                },
            },

            Stack: {
                defaultProps: {
                    gap: 'md',
                },
            },

            Group: {
                defaultProps: {
                    gap: 'md',
                },
            },

            Container: {
                defaultProps: {
                    size: 'xl',
                    px: 'md',
                },
            },
        },
    });
};

// Eksportujemy domyślny temat (naturalny)
export const theme = createAppTheme('naturalne'); 