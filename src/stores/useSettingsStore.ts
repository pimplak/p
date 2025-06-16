import { create } from 'zustand';

export type ColorPalette = 'naturalne' | 'magenta-rose';

interface SettingsStore {
    colorPalette: ColorPalette;
    darkMode: boolean;

    // Actions
    setColorPalette: (palette: ColorPalette) => void;
    toggleDarkMode: () => void;
}

// Prosty localStorage helper
const STORAGE_KEY = 'psychflow-settings';

const getStoredSettings = (): Partial<SettingsStore> => {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : {};
    } catch {
        return {};
    }
};

const saveSettings = (settings: Partial<SettingsStore>) => {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch {
        // Ignore localStorage errors
    }
};

export const useSettingsStore = create<SettingsStore>((set, get) => {
    const storedSettings = getStoredSettings();

    return {
        colorPalette: storedSettings.colorPalette || 'naturalne',
        darkMode: storedSettings.darkMode ?? true,

        setColorPalette: (palette) => {
            set({ colorPalette: palette });
            const state = get();
            saveSettings({ colorPalette: palette, darkMode: state.darkMode });
        },

        toggleDarkMode: () => {
            set((state) => ({ darkMode: !state.darkMode }));
            const state = get();
            saveSettings({ colorPalette: state.colorPalette, darkMode: state.darkMode });
        },
    };
}); 