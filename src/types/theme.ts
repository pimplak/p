// === FERRO'S THEME SYSTEM ===
// 5-kolorowe palety dla brutalne różnych motywów

export interface ColorPalette {
    name: string;
    id: string;
    // Każda paleta = dokładnie 5 kolorów
    background: string;   // główne tło aplikacji
    surface: string;      // tło kart, paneli, modalów
    primary: string;      // główny kolor brandowy
    accent: string;       // kolor akcentów, CTA, hover
    text: string;         // główny kolor tekstu
}

// === FERRO'S BRUTAL COLOR SYSTEM ===
// Palety oparte na teorii kolorów, nie na przypadku

export const COLOR_PALETTES: Record<string, ColorPalette> = {
    // === LIGHT PROFESSIONAL THEMES ===

    arctic: {
        name: 'Arctic Frost',
        id: 'arctic',
        background: '#fafbfc',  // glacial white
        surface: '#ffffff',     // pure white cards
        primary: '#0284c7',     // deep sky blue (główny brand)
        accent: '#0ea5e9',      // bright blue (hover/accent)
        text: '#0f172a',        // slate-900 (perfect contrast)
    },

    sunset: {
        name: 'Golden Sunset',
        id: 'sunset',
        background: '#fffbf5',  // warm cream background
        surface: '#ffffff',     // clean white cards
        primary: '#ea580c',     // sunset orange (główny)
        accent: '#f59e0b',      // golden amber (akcent)
        text: '#1c1917',        // stone-900 (excellent readability)
    },

    coral: {
        name: 'Coral Reef',
        id: 'coral',
        background: '#fef7f7',  // soft coral background
        surface: '#ffffff',     // pure white cards
        primary: '#dc2626',     // coral red (główny)
        accent: '#f97316',      // warm orange (kontrastowy akcent)
        text: '#1f2937',        // gray-800 (strong contrast)
    },

    // === WARM HARMONIOUS THEMES ===

    winefire: {
        name: 'Wine & Fire',
        id: 'winefire',
        background: '#fef2f2',  // soft wine background
        surface: '#ffffff',     // clean white surface
        primary: '#991b1b',     // deep wine red
        accent: '#dc2626',      // fire red accent
        text: '#1f2937',        // dark gray text
    },

    springblush: {
        name: 'Spring Blush',
        id: 'springblush',
        background: '#fdf2f8',  // soft pink background
        surface: '#ffffff',     // white surface
        primary: '#be185d',     // deep pink primary
        accent: '#ec4899',      // bright pink accent
        text: '#1f2937',        // dark text
    },

    earthgarden: {
        name: 'Earth Garden',
        id: 'earthgarden',
        background: '#f7f5f0',  // earthy cream
        surface: '#ffffff',     // clean white
        primary: '#059669',     // forest green
        accent: '#10b981',      // bright emerald
        text: '#1f2937',        // dark text
    },

    // === VIBRANT MODERN THEMES ===

    mysticdusk: {
        name: 'Mystic Dusk',
        id: 'mysticdusk',
        background: '#faf5ff',  // soft purple background
        surface: '#ffffff',     // white surface
        primary: '#7c3aed',     // mystic violet
        accent: '#a855f7',      // bright purple
        text: '#1f2937',        // dark text
    },

    neonnight: {
        name: 'Neon Night',
        id: 'neonnight',
        background: '#f0f9ff',  // soft cyan background
        surface: '#ffffff',     // white surface
        primary: '#0891b2',     // cyan primary
        accent: '#06b6d4',      // bright cyan
        text: '#1f2937',        // dark text
    },

    retrofire: {
        name: 'Retro Fire',
        id: 'retrofire',
        background: '#fffbeb',  // warm amber background
        surface: '#ffffff',     // white surface
        primary: '#d97706',     // retro amber
        accent: '#f59e0b',      // bright yellow
        text: '#1f2937',        // dark text
    },

    // === DARK PROFESSIONAL THEMES ===

    forest: {
        name: 'Deep Forest',
        id: 'forest',
        background: '#0c1810',  // forest night
        surface: '#1a2f1a',     // dark moss surface
        primary: '#22c55e',     // forest green
        accent: '#4ade80',      // bright lime
        text: '#f0fdf4',        // soft mint text
    },

    midnight: {
        name: 'Midnight Purple',
        id: 'midnight',
        background: '#0f0a1a',  // deep purple night
        surface: '#1e1a2e',     // dark purple surface
        primary: '#8b5cf6',     // royal violet
        accent: '#a78bfa',      // light purple
        text: '#f3f4f6',        // soft gray text
    },

    darkpro: {
        name: 'Dark Professional',
        id: 'darkpro',
        background: '#0a0e1a',  // professional dark blue
        surface: '#1e293b',     // slate surface
        primary: '#3b82f6',     // professional blue
        accent: '#60a5fa',      // bright blue
        text: '#f1f5f9',        // crisp white text
    },

    darkslate: {
        name: 'Dark Slate',
        id: 'darkslate',
        background: '#0f172a',  // slate-900 background
        surface: '#1e293b',     // slate-800 surface
        primary: '#6366f1',     // indigo primary
        accent: '#8b5cf6',      // violet accent
        text: '#f1f5f9',        // slate-100 text
    },

    darkgray: {
        name: 'Dark Gray',
        id: 'darkgray',
        background: '#111827',  // gray-900 background
        surface: '#1f2937',     // gray-800 surface
        primary: '#10b981',     // emerald primary
        accent: '#34d399',      // bright emerald
        text: '#f9fafb',        // gray-50 text
    },

    darkcarbon: {
        name: 'Dark Carbon',
        id: 'darkcarbon',
        background: '#0c0c0c',  // pure carbon black
        surface: '#1c1c1e',     // carbon surface
        primary: '#ef4444',     // red primary
        accent: '#f87171',      // bright red accent
        text: '#ffffff',        // pure white text
    },
};

export type PaletteId = keyof typeof COLOR_PALETTES;

// Helper do sprawdzania czy paleta jest ciemna
export const isDarkPalette = (paletteId: PaletteId): boolean => {
    const darkPalettes: PaletteId[] = [
        'forest', 'midnight', 'darkpro', 'darkslate', 'darkgray', 'darkcarbon'
    ];
    return darkPalettes.includes(paletteId);
};

// Helper do konwersji 5-kolorowej palety na Mantine theme
export interface MantineThemeColors {
    background: string;
    surface: string;
    primary: string[];
    accent: string[];
    text: string;
} 