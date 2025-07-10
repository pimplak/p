import { create } from 'zustand';
import { COLOR_PALETTES, type PaletteId, type ColorPalette } from '../types/theme';

interface ThemeStore {
    currentPaletteId: PaletteId;
    currentPalette: ColorPalette;

    // Actions
    setPalette: (paletteId: PaletteId) => void;
    getAllPalettes: () => ColorPalette[];
}

// Constants
const THEME_STORAGE_KEY = 'p-theme';

// Store Definition
const getStoredPaletteId = (): PaletteId => {
    try {
        const stored = localStorage.getItem(THEME_STORAGE_KEY);
        if (stored && stored in COLOR_PALETTES) {
            return stored as PaletteId;
        }
    } catch {
        // ignore
    }
    return 'springblush'; // default - Spring Blush (różowa paleta)
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

    return {
        currentPaletteId: initialPaletteId,
        currentPalette: initialPalette,

        setPalette: (paletteId: PaletteId) => {
            const palette = COLOR_PALETTES[paletteId];
            if (!palette) {
                console.error(`Ferro Error: Unknown palette ID: ${paletteId}`);
                return;
            }

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