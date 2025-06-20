import { createTheme, type MantineColorsTuple } from '@mantine/core';

// === FERRO'S PREMIUM THERAPEUTIC DESIGN SYSTEM ===
// Inspirowany: Headspace (spokój) + Linear (ostrość) + Notion (hierarchia) + Things 3 (typografia) + Raycast (keyboard-first)

// Primary Indigo - zaufanie i profesjonalizm
const primaryIndigo: MantineColorsTuple = [
    '#F0F2FF',  // lightest
    '#E0E7FF',  // lighter
    '#C7D2FE',  // light
    '#A5B4FC',  // medium-light
    '#818CF8',  // primary-light
    '#6366F1',  // PRIMARY
    '#4F46E5',  // primary-dark
    '#4338CA',  // dark
    '#3730A3',  // darker
    '#312E81'   // darkest
];

// Neutral Grays - clean hierarchy
const neutralGray: MantineColorsTuple = [
    '#FAFAFA',  // gray-50
    '#F4F4F5',  // gray-100
    '#E4E4E7',  // gray-200
    '#D4D4D8',  // gray-300
    '#A1A1AA',  // gray-400
    '#71717A',  // gray-500
    '#52525B',  // gray-600
    '#3F3F46',  // gray-700
    '#27272A',  // gray-800
    '#18181B'   // gray-900
];

// Success Green
const successGreen: MantineColorsTuple = [
    '#F0FDF4',
    '#DCFCE7',
    '#BBF7D0',
    '#86EFAC',
    '#4ADE80',
    '#22C55E',
    '#16A34A',
    '#15803D',
    '#166534',
    '#14532D'
];

// Warning Amber
const warningAmber: MantineColorsTuple = [
    '#FFFBEB',
    '#FEF3C7',
    '#FDE68A',
    '#FCD34D',
    '#FBBF24',
    '#F59E0B',
    '#D97706',
    '#B45309',
    '#92400E',
    '#78350F'
];

// Danger Red
const dangerRed: MantineColorsTuple = [
    '#FEF2F2',
    '#FEE2E2',
    '#FECACA',
    '#FCA5A5',
    '#F87171',
    '#EF4444',
    '#DC2626',
    '#B91C1C',
    '#991B1B',
    '#7F1D1D'
];

export const therapeuticTheme = createTheme({
    primaryColor: 'indigo',

    colors: {
        indigo: primaryIndigo,
        gray: neutralGray,
        green: successGreen,
        yellow: warningAmber,
        red: dangerRed,
    },

    // Inter font family
    fontFamily: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    headings: {
        fontFamily: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        fontWeight: '600',
        sizes: {
            h1: { fontSize: '2rem', lineHeight: '2.5rem' },
            h2: { fontSize: '1.5rem', lineHeight: '2rem' },
            h3: { fontSize: '1.25rem', lineHeight: '1.75rem' },
            h4: { fontSize: '1.125rem', lineHeight: '1.75rem' },
            h5: { fontSize: '1rem', lineHeight: '1.5rem' },
            h6: { fontSize: '0.875rem', lineHeight: '1.25rem' }
        }
    },

    // Typography scale 1.25
    fontSizes: {
        xs: '0.75rem',   // 12px
        sm: '0.875rem',  // 14px
        md: '1rem',      // 16px base
        lg: '1.125rem',  // 18px
        xl: '1.25rem',   // 20px
    },

    // 8px base grid
    spacing: {
        xs: '0.25rem',   // 4px
        sm: '0.5rem',    // 8px
        md: '0.75rem',   // 12px
        lg: '1rem',      // 16px
        xl: '1.5rem',    // 24px
    },

    // Everything gets rounded corners
    defaultRadius: 'md',
    radius: {
        xs: '0.25rem',   // 4px
        sm: '0.375rem',  // 6px  
        md: '0.5rem',    // 8px
        lg: '0.75rem',   // 12px
        xl: '1rem',      // 16px
    },

    // Line heights for readability
    lineHeights: {
        xs: '1.4',
        sm: '1.45',
        md: '1.55',
        lg: '1.6',
        xl: '1.65',
    },

    // Shadows - subtle and premium
    shadows: {
        xs: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        sm: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    },

    // Premium component customization
    components: {
        Card: {
            defaultProps: {
                shadow: 'sm',
                padding: 'xl',
                radius: 'md',
                withBorder: false,
            },
            styles: {
                root: {
                    backgroundColor: 'white',
                    border: '1px solid var(--mantine-color-gray-1)',
                    transition: 'all 200ms ease-out',
                    '&:hover': {
                        transform: 'translateY(-1px)',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                    }
                }
            }
        },

        Button: {
            defaultProps: {
                radius: 'md',
                size: 'md',
            },
            styles: {
                root: {
                    fontWeight: 500,
                    transition: 'all 200ms ease-out',
                    '&:hover': {
                        transform: 'translateY(-1px)',
                    }
                }
            }
        },

        TextInput: {
            defaultProps: {
                radius: 'md',
                size: 'md',
            },
            styles: {
                input: {
                    minHeight: '44px', // Mobile-friendly
                    fontSize: '1rem',
                    backgroundColor: 'var(--mantine-color-gray-0)',
                    border: '1px solid var(--mantine-color-gray-2)',
                    transition: 'border-color 200ms ease-out',
                    '&:focus': {
                        borderColor: '#6366F1',
                        boxShadow: '0 0 0 1px #6366F1',
                    }
                }
            }
        },

        Textarea: {
            defaultProps: {
                radius: 'md',
                size: 'md',
            },
            styles: {
                input: {
                    minHeight: '44px',
                    fontSize: '1rem',
                    backgroundColor: 'var(--mantine-color-gray-0)',
                    border: '1px solid var(--mantine-color-gray-2)',
                    transition: 'border-color 200ms ease-out',
                    '&:focus': {
                        borderColor: '#6366F1',
                        boxShadow: '0 0 0 1px #6366F1',
                    }
                }
            }
        },

        Select: {
            defaultProps: {
                radius: 'md',
                size: 'md',
            },
            styles: {
                input: {
                    minHeight: '44px',
                    fontSize: '1rem',
                    backgroundColor: 'var(--mantine-color-gray-0)',
                    border: '1px solid var(--mantine-color-gray-2)',
                    transition: 'border-color 200ms ease-out',
                    '&:focus': {
                        borderColor: '#6366F1',
                        boxShadow: '0 0 0 1px #6366F1',
                    }
                }
            }
        },

        Modal: {
            defaultProps: {
                centered: true,
                radius: 'lg',
                overlayProps: {
                    opacity: 0.4,
                    blur: 4,
                },
                transitionProps: {
                    transition: 'fade',
                    duration: 200,
                    timingFunction: 'ease-out'
                },
            },
            styles: {
                content: {
                    borderRadius: '0.75rem',
                }
            }
        },

        Paper: {
            defaultProps: {
                shadow: 'xs',
                padding: 'xl',
                radius: 'md',
            },
            styles: {
                root: {
                    backgroundColor: 'white',
                    border: '1px solid var(--mantine-color-gray-1)',
                }
            }
        },

        AppShell: {
            defaultProps: {
                padding: { base: 'md', sm: 'xl' },
            },
            styles: {
                main: {
                    backgroundColor: 'var(--mantine-color-gray-0)',
                    minHeight: '100vh',
                }
            }
        },

        Container: {
            defaultProps: {
                size: 'xl', // max-width: 1200px
                px: { base: 'md', sm: 'xl' },
            }
        },

        Stack: {
            defaultProps: {
                gap: 'lg',
            }
        },

        Group: {
            defaultProps: {
                gap: 'md',
            }
        },

        Badge: {
            defaultProps: {
                radius: 'md',
                size: 'sm',
                variant: 'light',
            }
        },

        Notification: {
            defaultProps: {
                radius: 'md',
                withCloseButton: true,
            },
            styles: {
                root: {
                    borderRadius: '0.5rem',
                }
            }
        }
    },

    // Custom CSS variables for additional styling
    other: {
        // Layout constants
        sidebarWidth: '280px',
        containerMaxWidth: '1200px',

        // Transition timing
        transitionSpeed: '200ms',
        transitionEasing: 'ease-out',

        // Custom shadows for specific use cases
        cardHoverShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        buttonHoverShadow: '0 4px 12px rgba(99, 102, 241, 0.15)',
    }
});

// Export the theme as default
export default therapeuticTheme; 