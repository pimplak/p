// === FERRO'S THEME SYSTEM ===
// 3 palety - koniec z debilizmem kolekcjonowania tęczy

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
// 3 palety to wszystko czego potrzebujesz

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
};

export type PaletteId = keyof typeof COLOR_PALETTES;

// Helper do sprawdzania czy paleta jest ciemna
export const isDarkPalette = (paletteId: PaletteId): boolean => {
  return paletteId === 'darkpro';
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
