import { createTheme, type MantineColorsTuple, type MantineTheme } from '@mantine/core';
import { useMemo } from 'react';
import { useThemeStore } from '../stores/useThemeStore';
import { isDarkPalette } from '../types/theme';

// === FERRO'S ENHANCED COLOR GENERATOR ===
const createMantineColorTuple = (baseColor: string): MantineColorsTuple => {
    const hex = baseColor.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);

    // Enhanced color scaling for better contrast and visual hierarchy
    const scalingFactors = [0.95, 0.85, 0.75, 0.6, 0.4, 0.2, 0.1, 0.05, 0.02, 0.0];

    const shades = scalingFactors.map((factor) => {
        const newR = Math.round(r + (255 - r) * factor);
        const newG = Math.round(g + (255 - g) * factor);
        const newB = Math.round(b + (255 - b) * factor);

        return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
    });

    return shades as [string, string, string, string, string, string, string, string, string, string];
};

// === FERRO'S ENHANCED THEME TYPE ===
interface FerrroTheme extends MantineTheme {
    other: {
        iconSizes: {
            xs: number;
            sm: number;
            md: number;
            lg: number;
            xl: number;
        };
        layout: {
            containerSize: string;
            headerHeight: number;
            sidebarWidth: number;
            mobileNavHeight: number;
        };
        defaultSizes: {
            input: string;
            button: string;
        };
        zIndex: {
            app: number;
            modal: number;
            popover: number;
            overlay: number;
            max: number;
        };
    };
}

export const useTheme = () => {
    const { currentPalette, currentPaletteId, setPalette, getAllPalettes } = useThemeStore();

    // === FERRO'S ENHANCED MANTINE THEME ===
    const mantineTheme = useMemo((): FerrroTheme => {
        return createTheme({
            primaryColor: 'primary',

            // Enhanced color system with better palette integration
            colors: {
                primary: createMantineColorTuple(currentPalette.primary),
                accent: createMantineColorTuple(currentPalette.accent),
                gray: createMantineColorTuple(currentPalette.surface),
                // Add background and text as color tuples for better Mantine integration
                background: createMantineColorTuple(currentPalette.background),
                surface: createMantineColorTuple(currentPalette.surface),
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
                xxs: '0.25rem',
                xs: '0.5rem',
                sm: '0.75rem',
                md: '1rem',
                lg: '1.5rem',
                xl: '2rem',
                xxl: '3rem',
            },

            radius: {
                xs: '0.25rem',
                sm: '0.375rem',
                md: '0.5rem',
                lg: '0.75rem',
                xl: '1rem',
                round: '50%',
            },

            // === FERRO'S GUARANTEED THEME EXTENSIONS ===
            other: {
                // Icon sizes (guaranteed non-null)
                iconSizes: {
                    xs: 14,
                    sm: 16,
                    md: 18,
                    lg: 20,
                    xl: 24,
                },

                // Layout constants (guaranteed non-null)
                layout: {
                    containerSize: 'md',
                    headerHeight: 70,
                    sidebarWidth: 280,
                    mobileNavHeight: 80,
                },

                // Component sizes (guaranteed non-null)
                defaultSizes: {
                    input: 'sm',
                    button: 'sm',
                },

                // Mantine 8 z-index CSS variables
                zIndex: {
                    app: 100,
                    modal: 200,
                    popover: 300,
                    overlay: 400,
                    max: 9999,
                },
            },

            // === ENHANCED COMPONENT OVERRIDES ===
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
                    styles: {
                        root: {
                            backgroundColor: currentPalette.surface,
                            color: currentPalette.text,
                            borderColor: `${currentPalette.primary}20`,
                        },
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

                Container: {
                    defaultProps: {
                        size: 'md',
                    },
                },
            },
        }) as FerrroTheme;
    }, [currentPalette]);

    return {
        // Current theme state
        currentPalette,
        currentPaletteId,
        isDark: isDarkPalette(currentPaletteId),

        // Enhanced Mantine integration (guaranteed non-null)
        mantineTheme,

        // Actions
        setPalette,
        getAllPalettes,
    };
}; 