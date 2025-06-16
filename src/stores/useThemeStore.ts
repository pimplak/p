import { create } from 'zustand';
import { COLOR_PALETTES, type PaletteId, type ColorPalette } from '../types/theme';

interface ThemeStore {
    currentPaletteId: PaletteId;
    currentPalette: ColorPalette;

    // Actions
    setPalette: (paletteId: PaletteId) => void;
    getAllPalettes: () => ColorPalette[];
}

// CSS Variables Manager - Ferro nie toleruje inline styles
const updateCSSVariables = (palette: ColorPalette) => {
    const root = document.documentElement;

    // Ustaw zmienne CSS dla całej aplikacji
    root.style.setProperty('--color-background', palette.background);
    root.style.setProperty('--color-surface', palette.surface);
    root.style.setProperty('--color-primary', palette.primary);
    root.style.setProperty('--color-accent', palette.accent);
    root.style.setProperty('--color-text', palette.text);

    // Dodatkowe zmienne dla różnych stanów
    root.style.setProperty('--color-primary-hover', palette.accent);
    root.style.setProperty('--color-accent-light', palette.primary + '20'); // 20% opacity
};

// localStorage persistence
const THEME_STORAGE_KEY = 'psychflow-theme';

const getStoredPaletteId = (): PaletteId => {
    try {
        const stored = localStorage.getItem(THEME_STORAGE_KEY);
        if (stored && stored in COLOR_PALETTES) {
            return stored as PaletteId;
        }
    } catch {
        // ignore
    }
    return 'arctic'; // default
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