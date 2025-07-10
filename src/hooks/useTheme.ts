import { createTheme, type MantineColorsTuple } from '@mantine/core';
import { useMemo } from 'react';
import { useThemeStore } from '../stores/useThemeStore';
import { isDarkPalette } from '../types/theme';

// === FERRO'S OPTIMIZED COLOR GENERATOR ===
const createMantineColorTuple = (baseColor: string): MantineColorsTuple => {
    const hex = baseColor.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);

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

    // === FERRO'S LEAN MANTINE THEME ===
    const mantineTheme = useMemo(() => {
        return createTheme({
            primaryColor: 'primary',

            colors: {
                primary: createMantineColorTuple(currentPalette.primary),
                accent: createMantineColorTuple(currentPalette.accent),
                gray: createMantineColorTuple(currentPalette.surface),
            },

            fontFamily: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',

            // Mobile-optimized sizing
            fontSizes: {
                xs: '0.75rem',
                sm: '0.875rem',
                md: '1rem',
                lg: '1.125rem',
                xl: '1.25rem',
            },

            spacing: {
                xs: '0.5rem',
                sm: '0.75rem',
                md: '1rem',
                lg: '1.5rem',
                xl: '2rem',
            },

            radius: {
                xs: '0.25rem',
                sm: '0.375rem',
                md: '0.5rem',
                lg: '0.75rem',
                xl: '1rem',
            },

            // === ESSENTIAL COMPONENT OVERRIDES ===
            // Tylko najważniejsze - reszta przez CSS variables w globalStyles.ts
            components: {
                Button: {
                    defaultProps: {
                        radius: 'md',
                        size: 'md',
                    },
                },

                TextInput: {
                    defaultProps: {
                        radius: 'md',
                        size: 'md',
                    },
                },

                Card: {
                    defaultProps: {
                        radius: 'md',
                        shadow: 'sm',
                        padding: 'xl',
                    },
                },

                Modal: {
                    defaultProps: {
                        centered: true,
                        radius: 'lg',
                        overlayProps: {
                            opacity: 0.4,
                            blur: 4,
                        },
                    },
                },
            },
        });
    }, [currentPalette]);

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