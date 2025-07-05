import { createTheme, type MantineColorsTuple } from '@mantine/core';
import { useMemo } from 'react';
import { useThemeStore } from '../stores/useThemeStore';
import { isDarkPalette } from '../types/theme';

// Ferro's Advanced Color Palette Generator
// Generuje realistyczne odcienie koloru dla Mantine
const createMantineColorTuple = (baseColor: string): MantineColorsTuple => {
    // Usuń # jeśli istnieje
    const hex = baseColor.replace('#', '');

    // Konwertuj hex na RGB
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);

    // Generuj 10 odcieni od najjaśniejszego do najciemniejszego
    const shades: string[] = [];

    for (let i = 0; i < 10; i++) {
        const factor = 0.9 - (i * 0.1); // Od 0.9 do 0.0
        const newR = Math.round(r + (255 - r) * factor);
        const newG = Math.round(g + (255 - g) * factor);
        const newB = Math.round(b + (255 - b) * factor);

        const newHex = `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
        shades.push(newHex);
    }

    return shades as [string, string, string, string, string, string, string, string, string, string];
};

export const useTheme = () => {
    const { currentPalette, currentPaletteId, setPalette, getAllPalettes } = useThemeStore();

    // Generate Mantine theme from current 5-color palette
    const mantineTheme = useMemo(() => {
        const isDark = isDarkPalette(currentPaletteId);

        return createTheme({
            primaryColor: 'primary',

            colors: {
                // Convert our 5 colors to Mantine format
                primary: createMantineColorTuple(currentPalette.primary),
                accent: createMantineColorTuple(currentPalette.accent),
                // Use background and surface for gray scales
                gray: createMantineColorTuple(currentPalette.surface),
            },

            // Mobile-optimized sizing
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

            radius: {
                xs: '0.25rem',
                sm: '0.375rem',
                md: '0.5rem',
                lg: '0.75rem',
                xl: '1rem',
            },

            fontFamily: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',

            // Dark/Light mode specific overrides
            components: {
                AppShell: {
                    styles: () => ({
                        header: {
                            backgroundColor: 'var(--color-surface)',
                            borderColor: 'var(--color-primary)',
                            color: 'var(--color-text)',
                        },
                        navbar: {
                            backgroundColor: 'var(--color-surface)',
                            borderColor: 'var(--color-primary)',
                            color: 'var(--color-text)',
                        },
                        main: {
                            backgroundColor: 'var(--color-background)',
                            color: 'var(--color-text)',
                        },
                    }),
                },

                Paper: {
                    styles: () => ({
                        root: {
                            backgroundColor: 'var(--color-surface)',
                            color: 'var(--color-text)',
                            borderColor: isDark ? 'var(--color-primary)' : 'var(--mantine-color-gray-2)',
                        },
                    }),
                },

                Card: {
                    styles: () => ({
                        root: {
                            backgroundColor: 'var(--color-surface)',
                            color: 'var(--color-text)',
                            borderColor: isDark ? 'var(--color-primary)' : 'var(--mantine-color-gray-2)',
                        },
                    }),
                },

                Modal: {
                    styles: () => ({
                        content: {
                            backgroundColor: 'var(--color-surface)',
                            color: 'var(--color-text)',
                        },
                        header: {
                            backgroundColor: 'var(--color-surface)',
                            color: 'var(--color-text)',
                        },
                    }),
                },

                Button: {
                    styles: () => ({
                        root: {
                            '&[data-variant="filled"]': {
                                backgroundColor: 'var(--color-primary)',
                                color: 'var(--color-button-text)',
                                '&:hover': {
                                    backgroundColor: 'var(--color-primary-hover)',
                                },
                            },
                            '&[data-variant="outline"]': {
                                backgroundColor: 'transparent',
                                color: 'var(--color-text)',
                                borderColor: 'var(--color-input-border)',
                                '&:hover': {
                                    backgroundColor: 'var(--color-primary-light)',
                                    borderColor: 'var(--color-primary)',
                                },
                            },
                            '&[data-variant="light"]': {
                                backgroundColor: 'var(--color-accent-light)',
                                color: 'var(--color-text)',
                                '&:hover': {
                                    backgroundColor: 'var(--color-primary-light)',
                                },
                            },
                        },
                    }),
                },

                NavLink: {
                    styles: () => ({
                        root: {
                            color: 'var(--color-text)',
                            '&[data-active]': {
                                backgroundColor: 'var(--color-primary)',
                                color: isDark ? 'white' : 'var(--color-text)',
                            },
                            '&:hover': {
                                backgroundColor: 'var(--color-accent-light)',
                            },
                        },
                    }),
                },

                // Global Mantine component overrides for dark theme
                Text: {
                    styles: () => ({
                        root: {
                            color: 'var(--color-text)',
                        },
                    }),
                },

                Title: {
                    styles: () => ({
                        root: {
                            color: 'var(--color-text)',
                        },
                    }),
                },

                Container: {
                    styles: () => ({
                        root: {
                            color: 'var(--color-text)',
                        },
                    }),
                },

                Stack: {
                    styles: () => ({
                        root: {
                            color: 'var(--color-text)',
                        },
                    }),
                },

                Group: {
                    styles: () => ({
                        root: {
                            color: 'var(--color-text)',
                        },
                    }),
                },

                TextInput: {
                    styles: () => ({
                        input: {
                            backgroundColor: 'var(--color-input-bg)',
                            borderColor: 'var(--color-input-border)',
                            color: 'var(--color-text)',
                            '&:focus': {
                                borderColor: 'var(--color-primary)',
                            },
                        },
                        label: {
                            color: 'var(--color-text)',
                        },
                    }),
                },

                Select: {
                    styles: () => ({
                        input: {
                            backgroundColor: 'var(--color-input-bg)',
                            borderColor: 'var(--color-input-border)',
                            color: 'var(--color-text)',
                            '&:focus': {
                                borderColor: 'var(--color-primary)',
                            },
                        },
                        label: {
                            color: 'var(--color-text)',
                        },
                        dropdown: {
                            backgroundColor: 'var(--color-surface)',
                            borderColor: 'var(--color-input-border)',
                        },
                        option: {
                            color: 'var(--color-text)',
                            '&[data-selected]': {
                                backgroundColor: 'var(--color-primary)',
                                color: 'var(--color-button-text)',
                            },
                        },
                    }),
                },

                Textarea: {
                    styles: () => ({
                        input: {
                            backgroundColor: 'var(--color-input-bg)',
                            borderColor: 'var(--color-input-border)',
                            color: 'var(--color-text)',
                            '&:focus': {
                                borderColor: 'var(--color-primary)',
                            },
                        },
                        label: {
                            color: 'var(--color-text)',
                        },
                    }),
                },
            },
        });
    }, [currentPalette, currentPaletteId]);

    return {
        // Current theme state
        currentPalette,
        currentPaletteId,
        isDark: isDarkPalette(currentPaletteId),

        // Mantine integration
        mantineTheme,

        // Actions
        setPalette,
        getAllPalettes,

        // CSS utilities
        cssVars: {
            background: 'var(--color-background)',
            surface: 'var(--color-surface)',
            primary: 'var(--color-primary)',
            accent: 'var(--color-accent)',
            text: 'var(--color-text)',
        },
    };
}; 