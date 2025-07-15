import {
    createTheme,
    type MantineColorsTuple,
    type MantineTheme,
} from '@mantine/core';
import { useMemo } from 'react';
import classes from '../css/overrides.module.css';
import { useThemeStore } from '../stores/useThemeStore';
import { isDarkPalette } from '../types/theme';

// === FERRO'S ENHANCED COLOR GENERATOR ===
const createMantineColorTuple = (baseColor: string): MantineColorsTuple => {
    const hex = baseColor.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);

    // Enhanced color scaling for better contrast and visual hierarchy
    const scalingFactors = [
        0.95, 0.85, 0.75, 0.6, 0.4, 0.2, 0.1, 0.05, 0.02, 0.0,
    ];

    const shades = scalingFactors.map(factor => {
        const newR = Math.round(r + (255 - r) * factor);
        const newG = Math.round(g + (255 - g) * factor);
        const newB = Math.round(b + (255 - b) * factor);

        return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
    });

    return shades as [
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
    ];
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
    const { currentPalette, currentPaletteId, setPalette, getAllPalettes } =
        useThemeStore();

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

            fontFamily:
                'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',

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
                    // vars: () => ({
                    //     root: {
                    //         '--button-hover': currentPalette.accent,
                    //     },
                    // }),
                    styles: {
                        root: {
                            backgroundColor: currentPalette.primary,
                            color: currentPalette.surface,
                            border: `1px solid ${currentPalette.primary}`,
                            // '&:hover': {
                            //     backgroundColor: currentPalette.accent,
                            // },
                        },
                    },
                },

                TextInput: {
                    defaultProps: {
                        radius: 'md',
                        size: 'md',
                    },
                    styles: {
                        input: {
                            backgroundColor: currentPalette.surface,
                            color: currentPalette.text,
                            border: `1px solid ${currentPalette.primary}60`,
                            '&:focus': {
                                borderColor: currentPalette.primary,
                                boxShadow: `0 0 0 1px ${currentPalette.primary}`,
                            },
                        },
                        label: {
                            color: currentPalette.text,
                        },
                    },
                },

                Select: {
                    defaultProps: {
                        radius: 'md',
                        size: 'md',
                    },
                    styles: {
                        input: {
                            backgroundColor: currentPalette.surface,
                            color: currentPalette.text,
                            border: `1px solid ${currentPalette.primary}60`,
                        },
                        label: {
                            color: currentPalette.text,
                        },
                        dropdown: {
                            '--text-color': currentPalette.text,
                            '--accent-color': currentPalette.accent,
                            backgroundColor: currentPalette.surface,
                            border: `1px solid ${currentPalette.primary}60`,
                        },
                    },
                    classNames: {
                        option: classes['mantine-Select-option'],
                    },
                },

                Menu: {
                    defaultProps: {
                        radius: 'md',
                    },
                    vars: () => ({
                        root: {
                            '--menu-item-hover': currentPalette.surface,
                        },
                    }),
                    styles: {
                        root: {
                            backgroundColor: currentPalette.surface,
                            color: currentPalette.text,
                            border: `1px solid ${currentPalette.primary}40`,
                        },
                        item: {
                            color: currentPalette.text,
                        },
                        dropdown: {
                            backgroundColor: currentPalette.surface,
                            color: currentPalette.text,
                            border: `1px solid ${currentPalette.primary}40`,
                        },
                        itemLabel: {
                            color: currentPalette.text,
                        },
                    },
                },

                SegmentedControl: {
                    defaultProps: {
                        radius: 'sm',
                        size: 'sm',
                    },
                    styles: {
                        root: {
                            backgroundColor: currentPalette.primary,
                            color: currentPalette.text,
                        },
                        label: {
                            color: currentPalette.surface,
                        },
                        indicator: {
                            backgroundColor: currentPalette.accent,
                        },
                        innerlabel: {
                            color: currentPalette.primary,
                        },
                    },
                },

                DateInput: {
                    defaultProps: {
                        radius: 'md',
                        size: 'md',
                    },
                    styles: {
                        input: {
                            backgroundColor: currentPalette.surface,
                            color: currentPalette.text,
                            border: `1px solid ${currentPalette.primary}60`,
                            '&:focus': {
                                borderColor: currentPalette.primary,
                                boxShadow: `0 0 0 1px ${currentPalette.primary}`,
                            },
                        },
                        label: {
                            color: currentPalette.text,
                        },
                    },
                },

                NumberInput: {
                    defaultProps: {
                        radius: 'md',
                        size: 'md',
                    },
                    styles: {
                        input: {
                            backgroundColor: currentPalette.surface,
                            color: currentPalette.text,
                            border: `1px solid ${currentPalette.primary}60`,
                            '&:focus': {
                                borderColor: currentPalette.primary,
                                boxShadow: `0 0 0 1px ${currentPalette.primary}`,
                            },
                        },
                        label: {
                            color: currentPalette.text,
                        },
                        control: {
                            backgroundColor: currentPalette.surface,
                            color: currentPalette.text,
                            border: `1px solid ${currentPalette.primary}60`,
                        },
                    },
                },

                Textarea: {
                    defaultProps: {
                        radius: 'md',
                        size: 'md',
                    },
                    styles: {
                        input: {
                            backgroundColor: currentPalette.surface,
                            color: currentPalette.text,
                            border: `1px solid ${currentPalette.primary}60`,
                            '&:focus': {
                                borderColor: currentPalette.primary,
                                boxShadow: `0 0 0 1px ${currentPalette.primary}`,
                            },
                        },
                        label: {
                            color: currentPalette.text,
                        },
                    },
                },

                Checkbox: {
                    defaultProps: {
                        radius: 'sm',
                        size: 'md',
                    },
                    styles: {
                        input: {
                            '--checkbox-background': currentPalette.surface,
                            '--checkbox-border': `${currentPalette.primary}60`,
                            '--checkbox-checked-background': currentPalette.primary,
                            '--checkbox-checked-border': currentPalette.primary,
                        },
                        label: {
                            color: currentPalette.text,
                        },
                    },
                    classNames: {
                        input: classes['mantine-Checkbox-input'],
                    },
                },

                Table: {
                    defaultProps: {
                        radius: 'md',
                        size: 'md',
                    },
                    styles: {
                        root: {
                            backgroundColor: currentPalette.surface,
                            color: currentPalette.text,
                        },
                        tr: {
                            '--table-hover-background': `${currentPalette.primary}30`,
                            '--table-striped-background': `${currentPalette.primary}10`,
                        },
                        th: {
                            backgroundColor: currentPalette.surface,
                        },
                    },
                    classNames: {
                        tr: classes['mantine-Table-tr'],
                    },
                },

                Switch: {
                    defaultProps: {
                        radius: 'xl',
                        size: 'md',
                    },
                    styles: {
                        track: {
                            backgroundColor: `${currentPalette.primary}40`,
                            borderColor: currentPalette.primary,
                        },
                        thumb: {
                            backgroundColor: currentPalette.surface,
                            borderColor: currentPalette.primary,
                        },
                    },
                },

                DateTimePicker: {
                    defaultProps: {
                        radius: 'md',
                        size: 'md',
                    },
                    styles: {
                        input: {
                            backgroundColor: currentPalette.surface,
                            color: currentPalette.text,
                            border: `1px solid ${currentPalette.primary}60`,
                            '&:focus': {
                                borderColor: currentPalette.primary,
                                boxShadow: `0 0 0 1px ${currentPalette.primary}`,
                            },
                        },
                        label: {
                            color: currentPalette.text,
                        },
                    },
                },

                Tabs: {
                    defaultProps: {
                        radius: 'md',
                        size: 'md',
                    },
                    styles: {
                        root: {
                            '--tab-color': currentPalette.text,
                            '--tab-background': currentPalette.surface,
                            '--tab-border': `${currentPalette.primary}40`,
                            '--tab-hover': `${currentPalette.accent}20`,
                            '--tab-hover-border': `${currentPalette.accent}`,
                            '--tab-active-color': currentPalette.primary,
                            '--tab-active-background': currentPalette.surface,
                            '--tab-active-border': `${currentPalette.primary}`,
                        },
                    },
                    classNames: {
                        tab: classes['mantine-Tabs-tab'],
                        list: classes['mantine-Tabs-list'],
                    },
                },

                TagsInput: {
                    defaultProps: {
                        radius: 'md',
                        size: 'md',
                    },
                    styles: {
                        input: {
                            backgroundColor: currentPalette.surface,
                            color: currentPalette.text,
                            border: `1px solid ${currentPalette.primary}60`,
                            '&:focus': {
                                borderColor: currentPalette.primary,
                                boxShadow: `0 0 0 1px ${currentPalette.primary}`,
                            },
                        },
                        label: {
                            color: currentPalette.text,
                        },
                        pill: {
                            backgroundColor: `${currentPalette.primary}20`,
                            color: currentPalette.text,
                        },
                    },
                },

                Alert: {
                    defaultProps: {
                        radius: 'md',
                    },
                    styles: {
                        root: {
                            backgroundColor: currentPalette.surface,
                            color: currentPalette.text,
                            border: `1px solid ${currentPalette.primary}40`,
                        },
                        title: {
                            color: currentPalette.text,
                        },
                        message: {
                            color: currentPalette.text,
                        },
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

                Code: {
                    defaultProps: {
                        radius: 'md',
                    },
                    styles: {
                        root: {
                            backgroundColor: currentPalette.surface,
                            color: currentPalette.text,
                            border: `1px solid ${currentPalette.primary}40`,
                        },
                    },
                },

                Notification: {
                    defaultProps: {
                        radius: 'md',
                    },
                    styles: {
                        root: {
                            backgroundColor: currentPalette.surface,
                            color: currentPalette.surface,
                            border: `1px solid ${currentPalette.primary}`,
                        },
                        title: {
                            color: currentPalette.text,
                        },
                        description: {
                            color: currentPalette.text,
                        },
                        closeButton: {
                            color: currentPalette.text,
                            '&:hover': {
                                backgroundColor: currentPalette.accent,
                            },
                        },
                    },
                },

                CloseButton: {
                    defaultProps: {
                        radius: 'md',
                    },
                    styles: {
                        root: {
                            color: currentPalette.text,
                            '--close-button-hover-background': currentPalette.accent,
                        },
                    },
                    classNames: {
                        root: classes['mantine-CloseButton'],
                    },
                },

                Paper: {
                    defaultProps: {
                        radius: 'md',
                    },
                    styles: {
                        root: {
                            backgroundColor: currentPalette.surface,
                            color: currentPalette.text,
                            border: `1px solid ${currentPalette.primary}40`,
                        },
                    },
                },

                Drawer: {
                    defaultProps: {
                        radius: 'md',
                    },
                    styles: {
                        content: {
                            backgroundColor: currentPalette.surface,
                            color: currentPalette.text,
                            border: `1px solid ${currentPalette.primary}40`,
                        },
                        header: {
                            backgroundColor: currentPalette.surface,
                            color: currentPalette.text,
                            borderBottom: `1px solid ${currentPalette.primary}40`,
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
                    styles: {
                        content: {
                            backgroundColor: currentPalette.surface,
                            color: currentPalette.text,
                            border: `1px solid ${currentPalette.primary}40`,
                        },
                        body: {
                            color: currentPalette.text,
                        },
                        header: {
                            backgroundColor: currentPalette.surface,
                            borderBottom: `1px solid ${currentPalette.primary}40`,
                            color: currentPalette.text,
                        },
                        title: {
                            color: currentPalette.text,
                            fontWeight: 600,
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

        // Utility colors (theme-aware)
        utilityColors: {
            error: isDarkPalette(currentPaletteId) ? '#f87171' : '#dc2626',
            success: isDarkPalette(currentPaletteId) ? '#4ade80' : '#16a34a',
            warning: isDarkPalette(currentPaletteId) ? '#fbbf24' : '#d97706',
        },

        // Actions
        setPalette,
        getAllPalettes,
    };
};
