// === FERRO'S THEME SYSTEM ===
// 10 palet - koniec z debilizmem kolekcjonowania tęczy

export interface ColorPalette {
  name: string;
  id: string;
  // Każda paleta = dokładnie 5 kolorów
  background: string; // główne tło aplikacji
  surface: string; // tło kart, paneli, modalów
  primary: string; // główny kolor brandowy
  accent: string; // kolor akcentów, CTA, hover
  text: string; // główny kolor tekstu
}

// === FERRO'S SIMPLIFIED COLOR SYSTEM ===
// 10 palet to wszystko czego potrzebujesz

export const COLOR_PALETTES: Record<string, ColorPalette> = {
  // === JASNY MOTYW ===
  arctic: {
    name: 'Arctic Frost',
    id: 'arctic',
    background: '#fafbfc', // glacial white
    surface: '#ffffff', // pure white cards
    primary: '#0284c7', // deep sky blue (główny brand)
    accent: '#0ea5e9', // bright blue (hover/accent)
    text: '#0f172a', // slate-900 (perfect contrast)
  },

  // === PASTELOWY RÓŻOWATY ===
  springblush: {
    name: 'Spring Blush',
    id: 'springblush',
    background: '#fdf2f8', // soft pink background
    surface: '#ffffff', // white surface
    primary: '#be185d', // deep pink primary
    accent: '#ec4899', // bright pink accent
    text: '#1f2937', // dark text
  },

  // === CIEMNY MOTYW ===
  darkpro: {
    name: 'Dark Professional',
    id: 'darkpro',
    background: '#0f1419', // deep slate background - spójny z primary
    surface: '#1a202c', // slate surface - harmonia z tłem
    primary: '#4f46e5', // professional indigo (bardziej neutral)
    accent: '#6366f1', // bright indigo accent
    text: '#e2e8f0', // soft white text (lepszy kontrast)
  },

  // === NOWA PALETA 1: EARTHY NATURAL ===
  earthy: {
    name: 'Earthy Natural',
    id: 'earthy',
    background: '#f8f7f0', // jasne tło z odcieniem beżu
    surface: '#ffffff', // białe karty
    primary: '#78bc61', // Mantis - główny zielony
    accent: '#e9806e', // Salmon - akcent pomarańczowy
    text: '#131200', // Smoky black - ciemny tekst
  },

  // === NOWA PALETA 2: FOREST VIBRANT ===
  forest: {
    name: 'Forest Vibrant',
    id: 'forest',
    background: '#f7faf0', // jasne tło z odcieniem zieleni
    surface: '#ffffff', // białe karty
    primary: '#436436', // Hunter green - główny ciemny zielony
    accent: '#d2ff28', // Lime - jaskrawy akcent
    text: '#420217', // Chocolate cosmos - bardzo ciemny tekst
  },

  // === NOWA PALETA 3: SUNSET WARM ===
  sunset: {
    name: 'Sunset Warm',
    id: 'sunset',
    background: '#fef9f0', // jasne tło z odcieniem pomarańczu
    surface: '#ffffff', // białe karty
    primary: '#f08700', // Tangerine - główny pomarańczowy
    accent: '#00a6a6', // Light sea green - akcent turkusowy
    text: '#2c2c2c', // ciemny tekst dla kontrastu
  },

  // === NOWA PALETA 4: OCEAN CALM ===
  ocean: {
    name: 'Ocean Calm',
    id: 'ocean',
    background: '#f0f8f6', // jasne tło z odcieniem niebiesko-zieleni
    surface: '#ffffff', // białe karty
    primary: '#55828b', // Blue (Munsell) - główny niebiesko-zielony
    accent: '#87bba2', // Cambridge blue - akcent zielony
    text: '#364958', // Charcoal - ciemny tekst
  },

  // === NOWA PALETA 5: VIBRANT CONTRAST ===
  vibrant: {
    name: 'Vibrant Contrast',
    id: 'vibrant',
    background: '#f8f7f0', // jasne tło z odcieniem beżu
    surface: '#ffffff', // białe karty
    primary: '#58355e', // Violet (JTC) - główny fioletowy
    accent: '#e03616', // Chili red - jaskrawy czerwony akcent
    text: '#2c2c2c', // ciemny tekst dla kontrastu
  },

  // === NOWA PALETA 6: PASTEL DREAM ===
  pastel: {
    name: 'Pastel Dream',
    id: 'pastel',
    background: '#f0f9ff', // jasne tło z odcieniem niebieskiego
    surface: '#ffffff', // białe karty
    primary: '#5998c5', // Celestial Blue - główny niebieski
    accent: '#d999b9', // Amaranth pink - pastelowy różowy akcent
    text: '#2c2c2c', // ciemny tekst dla kontrastu
  },

  // === NOWA PALETA 7: BOLD EARTH ===
  bold: {
    name: 'Bold Earth',
    id: 'bold',
    background: '#fef7f0', // jasne tło z odcieniem pomarańczu
    surface: '#ffffff', // białe karty
    primary: '#ee6c4d', // Burnt sienna - główny pomarańczowy
    accent: '#17a398', // Persian green - turkusowy akcent
    text: '#33312e', // Jet - bardzo ciemny tekst
  },

  // === CIEMNE WERSJE ===

  // === CIEMNA WERSJA EARTHY ===
  earthyDark: {
    name: 'Earthy Dark',
    id: 'earthyDark',
    background: '#1a1a16', // ciemne tło z odcieniem beżu
    surface: '#2a2a24', // ciemne karty
    primary: '#78bc61', // Mantis - główny zielony (bez zmian)
    accent: '#e9806e', // Salmon - akcent pomarańczowy (bez zmian)
    text: '#f0f0e8', // jasny tekst dla kontrastu
  },

  // === CIEMNA WERSJA OCEAN ===
  oceanDark: {
    name: 'Ocean Dark',
    id: 'oceanDark',
    background: '#0f1a1c', // ciemne tło z odcieniem niebiesko-zieleni
    surface: '#1a2a2e', // ciemne karty
    primary: '#87bba2', // Cambridge blue - jaśniejszy jako primary
    accent: '#5998c5', // Celestial Blue - akcent niebieski
    text: '#e8f4f0', // jasny tekst dla kontrastu
  },

  // === CIEMNA WERSJA VIBRANT ===
  vibrantDark: {
    name: 'Vibrant Dark',
    id: 'vibrantDark',
    background: '#1a161a', // ciemne tło z odcieniem fioletu
    surface: '#2a242a', // ciemne karty
    primary: '#b8b3e9', // Periwinkle - jaśniejszy jako primary
    accent: '#e03616', // Chili red - jaskrawy czerwony akcent
    text: '#f0f0f0', // jasny tekst dla kontrastu
  },
};

export type PaletteId = keyof typeof COLOR_PALETTES;

// Helper do sprawdzania czy paleta jest ciemna
export const isDarkPalette = (paletteId: PaletteId): boolean => {
  return ['darkpro', 'earthyDark', 'oceanDark', 'vibrantDark'].includes(paletteId);
};

// Helper do konwersji 5-kolorowej palety na Mantine theme
export interface MantineThemeColors {
  background: string;
  surface: string;
  primary: string[];
  accent: string[];
  text: string;
}

// === FERRO'S MANTINE 8 TYPES AUGMENTATION ===
// Rozszerzenie Mantine theme types dla lepszego TypeScript support

// Custom sizes for extended spacing and radius
export type ExtendedSpacing = 'xxs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
export type ExtendedRadius = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'round';

// Module augmentation for Mantine theme
declare module '@mantine/core' {
  export interface MantineThemeSizesOverride {
    spacing: Record<ExtendedSpacing, string>;
    radius: Record<ExtendedRadius, string>;
  }
}
