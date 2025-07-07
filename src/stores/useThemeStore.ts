import { create } from 'zustand';
import { COLOR_PALETTES, type PaletteId, type ColorPalette, isDarkPalette } from '../types/theme';

interface ThemeStore {
    currentPaletteId: PaletteId;
    currentPalette: ColorPalette;

    // Actions
    setPalette: (paletteId: PaletteId) => void;
    getAllPalettes: () => ColorPalette[];
}

// Ferro's Advanced Color Generator - HSL based
const hexToHsl = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
    return [h * 360, s * 100, l * 100];
};

const hslToHex = (h: number, s: number, l: number) => {
    l /= 100;
    const a = s * Math.min(l, 1 - l) / 100;
    const f = (n: number) => {
        const k = (n + h / 30) % 12;
        const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`;
};

// CSS Variables Manager - Ferro's Fixed System  
const updateCSSVariables = (palette: ColorPalette) => {
    const root = document.documentElement;
    const paletteId = palette.id as PaletteId;
    const isDark = isDarkPalette(paletteId);

    // Podstawowe kolory
    root.style.setProperty('--color-background', palette.background);
    root.style.setProperty('--color-surface', palette.surface);
    root.style.setProperty('--color-primary', palette.primary);
    root.style.setProperty('--color-accent', palette.accent);
    root.style.setProperty('--color-text', palette.text);

    // Generuj warianty kolorów na podstawie HSL
    const [primaryH, primaryS, primaryL] = hexToHsl(palette.primary);
    const [accentH, accentS, accentL] = hexToHsl(palette.accent);
    const [textH, textS, textL] = hexToHsl(palette.text);
    const [surfaceH, surfaceS, surfaceL] = hexToHsl(palette.surface);

    // Primary variants
    root.style.setProperty('--color-primary-hover', hslToHex(primaryH, primaryS, isDark ? Math.min(primaryL + 10, 90) : Math.max(primaryL - 10, 10)));
    root.style.setProperty('--color-primary-light', hslToHex(primaryH, primaryS * 0.6, isDark ? Math.min(primaryL + 30, 95) : Math.min(primaryL + 30, 95)));
    root.style.setProperty('--color-primary-dark', hslToHex(primaryH, primaryS, Math.max(primaryL - 15, 10)));

    // Accent variants
    root.style.setProperty('--color-accent-hover', hslToHex(accentH, accentS, isDark ? Math.min(accentL + 10, 90) : Math.max(accentL - 10, 10)));
    root.style.setProperty('--color-accent-light', hslToHex(accentH, accentS * 0.4, isDark ? Math.min(accentL + 35, 95) : Math.min(accentL + 35, 95)));

    // Text variants - Fixed logic
    root.style.setProperty('--color-text-muted', hslToHex(textH, textS * 0.6, isDark ? Math.max(textL - 30, 30) : Math.min(textL + 20, 70)));
    root.style.setProperty('--color-text-inverse', isDark ? '#000000' : '#ffffff');

    // Surface variants for better contrast
    if (isDark) {
        // Dark theme: surface variants
        root.style.setProperty('--color-surface-hover', hslToHex(surfaceH, surfaceS, Math.min(surfaceL + 8, 40)));
        root.style.setProperty('--color-surface-active', hslToHex(surfaceH, surfaceS, Math.min(surfaceL + 15, 50)));
    } else {
        // Light theme: surface variants
        root.style.setProperty('--color-surface-hover', hslToHex(surfaceH, surfaceS, Math.max(surfaceL - 8, 90)));
        root.style.setProperty('--color-surface-active', hslToHex(surfaceH, surfaceS, Math.max(surfaceL - 15, 85)));
    }

    // Debug: Set theme type variable
    root.style.setProperty('--theme-type', isDark ? 'dark' : 'light');

    // Debug info
    console.log(`🎨 Ferro Theme Applied: ${palette.name} (${isDark ? 'dark' : 'light'})`);
    console.log(`📊 Colors: bg=${palette.background}, surface=${palette.surface}, primary=${palette.primary}, text=${palette.text}`);
};

// Constants
// =====================================================================

const THEME_STORAGE_KEY = 'p-theme';

// Store Definition
// =====================================================================

const getStoredPaletteId = (): PaletteId => {
    try {
        const stored = localStorage.getItem(THEME_STORAGE_KEY);
        if (stored && stored in COLOR_PALETTES) {
            return stored as PaletteId;
        }
    } catch {
        // ignore
    }
    return 'darkgray'; // default - Dark Gray palette (professional)
};

const savePaletteId = (paletteId: PaletteId) => {
    try {
        localStorage.setItem(THEME_STORAGE_KEY, paletteId);
    } catch {
        // ignore localStorage errors
    }
};

export const useThemeStore = create<ThemeStore>((set) => {
    const initialPaletteId = getStoredPaletteId();
    const initialPalette = COLOR_PALETTES[initialPaletteId];

    // Ustaw początkowe CSS variables
    updateCSSVariables(initialPalette);

    return {
        currentPaletteId: initialPaletteId,
        currentPalette: initialPalette,

        setPalette: (paletteId: PaletteId) => {
            const palette = COLOR_PALETTES[paletteId];
            if (!palette) {
                console.error(`Ferro Error: Unknown palette ID: ${paletteId}`);
                return;
            }

            // Update CSS variables immediately
            updateCSSVariables(palette);

            // Update store
            set({
                currentPaletteId: paletteId,
                currentPalette: palette,
            });

            // Persist to localStorage
            savePaletteId(paletteId);
        },

        getAllPalettes: () => Object.values(COLOR_PALETTES),
    };
}); 