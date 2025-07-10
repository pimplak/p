import { createTheme } from '@mantine/core';
import type { ColorPalette } from '../types/theme';

// === FERRO'S ADVANCED COLOR PALETTE GENERATOR ===
const generateMantineColorTuple = (baseColor: string) => {
    const hex = baseColor.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);

    const shades: string[] = [];

    for (let i = 0; i < 10; i++) {
        let newR, newG, newB;

        if (i < 5) {
            // Jasne odcienie (0-4)
            const factor = (5 - i) * 0.15;
            newR = Math.min(255, Math.round(r + (255 - r) * factor));
            newG = Math.min(255, Math.round(g + (255 - g) * factor));
            newB = Math.min(255, Math.round(b + (255 - b) * factor));
        } else if (i === 5) {
            // Kolor bazowy
            newR = r;
            newG = g;
            newB = b;
        } else {
            // Ciemne odcienie (6-9)
            const factor = (i - 5) * 0.15;
            newR = Math.round(r * (1 - factor));
            newG = Math.round(g * (1 - factor));
            newB = Math.round(b * (1 - factor));
        }

        const newHex = `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
        shades.push(newHex);
    }

    return shades;
};

// === UNIFIED MANTINE THEME CREATOR ===
export const createUnifiedMantineTheme = (palette: ColorPalette) => {
    return createTheme({
        primaryColor: 'primary',

        colors: {
            primary: generateMantineColorTuple(palette.primary) as [string, string, string, string, string, string, string, string, string, string],
            accent: generateMantineColorTuple(palette.accent) as [string, string, string, string, string, string, string, string, string, string],
            gray: generateMantineColorTuple(palette.surface) as [string, string, string, string, string, string, string, string, string, string],
        },

        fontFamily: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        headings: {
            fontFamily: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            fontWeight: '600',
        },

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

        shadows: {
            xs: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
            sm: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
            md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        },

        components: {
            Button: {
                defaultProps: {
                    radius: 'md',
                    size: 'md',
                },
                styles: {
                    root: {
                        minHeight: '44px',
                        fontWeight: 500,
                        fontSize: '0.875rem',
                        transition: 'all 150ms cubic-bezier(0.4, 0, 0.2, 1)',

                        '&[data-variant="filled"]': {
                            backgroundColor: 'var(--color-primary)',
                            color: '#FFFFFF',
                            border: 'none',

                            '&:hover': {
                                backgroundColor: 'var(--color-primary-hover)',
                                transform: 'translateY(-1px)',
                                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                            },
                        },

                        '&[data-variant="light"]': {
                            backgroundColor: 'var(--color-accent-light)',
                            color: 'var(--color-text)',
                            border: 'none',

                            '&:hover': {
                                backgroundColor: 'var(--color-primary-light)',
                                transform: 'translateY(-1px)',
                            }
                        },
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
                        minHeight: '44px',
                        fontSize: '1rem',
                        backgroundColor: 'var(--color-surface)',
                        borderColor: 'var(--color-primary)',
                        color: 'var(--color-text)',
                        transition: 'border-color 150ms ease-out',

                        '&:focus': {
                            borderColor: 'var(--color-primary)',
                            boxShadow: '0 0 0 3px var(--color-primary-light)',
                        },
                    },
                }
            },

            DateInput: {
                defaultProps: {
                    radius: 'md',
                    size: 'md',
                },
                styles: {
                    input: {
                        minHeight: '44px',
                        fontSize: '1rem',
                        backgroundColor: 'var(--color-surface) !important',
                        borderColor: 'var(--color-primary) !important',
                        color: 'var(--color-text) !important',

                        '&:focus': {
                            borderColor: 'var(--color-primary) !important',
                            boxShadow: '0 0 0 3px var(--color-primary-light) !important',
                        }
                    },
                    wrapper: {
                        '& input': {
                            backgroundColor: 'var(--color-surface) !important',
                            borderColor: 'var(--color-primary) !important',
                            color: 'var(--color-text) !important',
                        }
                    }
                }
            },

            DateTimePicker: {
                defaultProps: {
                    radius: 'md',
                    size: 'md',
                },
                styles: {
                    input: {
                        minHeight: '44px',
                        fontSize: '1rem',
                        backgroundColor: 'var(--color-surface) !important',
                        borderColor: 'var(--color-primary) !important',
                        color: 'var(--color-text) !important',

                        '&:focus': {
                            borderColor: 'var(--color-primary) !important',
                            boxShadow: '0 0 0 3px var(--color-primary-light) !important',
                        }
                    },
                    wrapper: {
                        '& input': {
                            backgroundColor: 'var(--color-surface) !important',
                            borderColor: 'var(--color-primary) !important',
                            color: 'var(--color-text) !important',
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
                        backgroundColor: 'var(--color-surface)',
                        borderColor: 'var(--color-primary)',
                        color: 'var(--color-text)',

                        '&:focus': {
                            borderColor: 'var(--color-primary)',
                            boxShadow: '0 0 0 3px var(--color-primary-light)',
                        }
                    },
                    dropdown: {
                        backgroundColor: 'var(--color-surface)',
                        borderColor: 'var(--color-primary)',
                    },
                    option: {
                        color: 'var(--color-text)',
                        '&[data-selected]': {
                            backgroundColor: 'var(--color-primary)',
                            color: '#FFFFFF',
                        },
                    }
                }
            },

            Card: {
                defaultProps: {
                    radius: 'md',
                    shadow: 'sm',
                    padding: 'xl',
                },
                styles: {
                    root: {
                        backgroundColor: 'var(--color-surface)',
                        borderColor: 'var(--color-primary)',
                        color: 'var(--color-text)',
                        transition: 'all 150ms cubic-bezier(0.4, 0, 0.2, 1)',

                        '&:hover': {
                            transform: 'translateY(-1px)',
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
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
                },
                styles: {
                    content: {
                        backgroundColor: 'var(--color-surface)',
                        color: 'var(--color-text)',
                    },
                }
            },

            AppShell: {
                styles: {
                    header: {
                        backgroundColor: 'var(--color-surface)',
                        borderBottomColor: 'var(--color-primary)',
                        color: 'var(--color-text)',
                    },
                    navbar: {
                        backgroundColor: 'var(--color-surface)',
                        borderRightColor: 'var(--color-primary)',
                        color: 'var(--color-text)',
                    },
                    main: {
                        backgroundColor: 'var(--color-background)',
                        color: 'var(--color-text)',
                    }
                }
            },

            TimeInput: {
                defaultProps: {
                    radius: 'md',
                    size: 'md',
                },
                styles: {
                    input: {
                        minHeight: '44px',
                        fontSize: '1rem',
                        backgroundColor: 'var(--color-surface) !important',
                        borderColor: 'var(--color-primary) !important',
                        color: 'var(--color-text) !important',
                    },
                    wrapper: {
                        '& input': {
                            backgroundColor: 'var(--color-surface) !important',
                            borderColor: 'var(--color-primary) !important',
                            color: 'var(--color-text) !important',
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
                        fontSize: '1rem',
                        backgroundColor: 'var(--color-surface) !important',
                        borderColor: 'var(--color-primary) !important',
                        color: 'var(--color-text) !important',

                        '&:focus': {
                            borderColor: 'var(--color-primary) !important',
                            boxShadow: '0 0 0 3px var(--color-primary-light) !important',
                        }
                    },
                }
            },
        },
    });
};

export default createUnifiedMantineTheme; 