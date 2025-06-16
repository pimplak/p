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

// Predefiniowane palety - każda RADYKALNIE różna
export const COLOR_PALETTES: Record<string, ColorPalette> = {
    arctic: {
        name: 'Arctic Frost',
        id: 'arctic',
        background: '#f8fafb',  // lodowato białe tło
        surface: '#ffffff',     // czyste białe powierzchnie
        primary: '#0ea5e9',     // błękit arktyczny
        accent: '#3b82f6',      // intensywny niebieski
        text: '#1e293b',        // ciemnoszary tekst
    },

    forest: {
        name: 'Deep Forest',
        id: 'forest',
        background: '#0f1f0f',  // ciemne leśne tło
        surface: '#1a2e1a',     // zielonkawe powierzchnie
        primary: '#22c55e',     // żywy zielony
        accent: '#84cc16',      // limonkowy akcent
        text: '#f0fdf4',        // jasny tekst
    },

    sunset: {
        name: 'Golden Sunset',
        id: 'sunset',
        background: '#fef3e2',  // ciepłe kremowe tło
        surface: '#fff7ed',     // jasne pomarańczowe powierzchnie
        primary: '#f59e0b',     // złoty pomarańcz
        accent: '#dc2626',      // czerwony akcent
        text: '#451a03',        // ciemny brąz
    },

    midnight: {
        name: 'Midnight Purple',
        id: 'midnight',
        background: '#0f0f1a',  // ciemne fioletowe tło
        surface: '#1a1a2e',     // ciemnofioletowe powierzchnie
        primary: '#8b5cf6',     // fioletowy primary
        accent: '#ec4899',      // różowy akcent
        text: '#f3f4f6',        // jasny tekst
    },

    coral: {
        name: 'Coral Reef',
        id: 'coral',
        background: '#fef7f7',  // delikatnie różowe tło
        surface: '#fff1f2',     // jasne powierzchnie
        primary: '#f43f5e',     // koralowy primary
        accent: '#06b6d4',      // turkusowy akcent
        text: '#1f2937',        // ciemnoszary tekst
    },

    // === FERRO'S NEW CUSTOM PALETTES ===

    winefire: {
        name: 'Wine & Fire',
        id: 'winefire',
        background: '#ff9b54',  // sandy brown - najjaśniejszy
        surface: '#ff7f51',     // coral - powierzchnie
        primary: '#ce4257',     // amaranth - główny brand
        accent: '#720026',      // claret - kontrastowy akcent
        text: '#4f000b',        // chocolate cosmos - najciemniejszy tekst
    },

    springblush: {
        name: 'Spring Blush',
        id: 'springblush',
        background: '#f9ada0',  // melon - delikatne tło
        surface: '#83b692',     // cambridge blue - powierzchnie
        primary: '#f9627d',     // bright pink - główny
        accent: '#c65b7c',      // blush - akcent
        text: '#5b3758',        // violet jtc - ciemny tekst
    },

    earthgarden: {
        name: 'Earth Garden',
        id: 'earthgarden',
        background: '#bca371',  // ecru - ziemiste tło
        surface: '#a6b07e',     // sage - powierzchnie
        primary: '#68a357',     // asparagus - zielony primary
        accent: '#32965d',      // shamrock green - żywy akcent
        text: '#c97064',        // indian red - kontrastowy tekst
    },

    mysticdusk: {
        name: 'Mystic Dusk',
        id: 'mysticdusk',
        background: '#c4a69d',  // rosy brown - najjaśniejsze
        surface: '#98a886',     // cambridge blue - powierzchnie
        primary: '#735290',     // ultra violet - fioletowy primary
        accent: '#465c69',      // paynes gray - szary akcent
        text: '#363457',        // space cadet - ciemny tekst
    },

    neonnight: {
        name: 'Neon Night',
        id: 'neonnight',
        background: '#c2c1c2',  // silver - neutralne tło
        surface: '#683257',     // violet jtc - ciemne powierzchnie
        primary: '#bd4089',     // mulberry - główny fioletowy
        accent: '#f51aa4',      // hollywood cerise - neonowy akcent
        text: '#42213d',        // dark purple - głęboki tekst
    },

    retrofire: {
        name: 'Retro Fire',
        id: 'retrofire',
        background: '#eae2b7',  // vanilla - jasne retro tło
        surface: '#fcbf49',     // xanthous - żółte powierzchnie
        primary: '#f77f00',     // orange wheel - pomarańczowy primary
        accent: '#d62828',      // fire engine red - czerwony akcent
        text: '#003049',        // prussian blue - kontrastowy niebieski tekst
    },
};

export type PaletteId = keyof typeof COLOR_PALETTES;

// Helper do sprawdzania czy paleta jest ciemna
export const isDarkPalette = (paletteId: PaletteId): boolean => {
    const darkPalettes: PaletteId[] = ['forest', 'midnight', 'neonnight', 'mysticdusk'];
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