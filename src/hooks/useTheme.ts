import { createTheme, type MantineColorsTuple } from '@mantine/core';
import { useMemo } from 'react';
import { useThemeStore } from '../stores/useThemeStore';
import { isDarkPalette } from '../types/theme';

// Ferro's Mantine Theme Generator
// Konwertuje 5-kolorową paletę na pełny Mantine theme
const createMantineColorTuple = (baseColor: string): MantineColorsTuple => {
    // Generuj 10 odcieni z jednego koloru bazowego
    return [
        baseColor + '10', // lightest
        baseColor + '20',
        baseColor + '30',
        baseColor + '40',
        baseColor + '50',
        baseColor,        // base color
        baseColor + '80',
        baseColor + '90',
        baseColor + 'A0',
        baseColor + 'FF', // darkest
    ];
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

            fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',

            // Override some components to use our palette
            components: {
                AppShell: {
                    styles: () => ({
                        header: {
                            backgroundColor: 'var(--color-surface)',
                            borderColor: 'var(--color-primary)',
                        },
                        navbar: {
                            backgroundColor: 'var(--color-surface)',
                            borderColor: 'var(--color-primary)',
                        },
                        main: {
                            backgroundColor: 'var(--color-background)',
                        },
                    }),
                },

                NavLink: {
                    styles: () => ({
                        root: {
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