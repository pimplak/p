// === FERRO'S LEAN DESIGN SYSTEM ===
// Tylko to co jest FAKTYCZNIE używane

export const DESIGN_SYSTEM = {
    // === SPACING SYSTEM ===
    spacing: {
        xs: 'xs' as const,      // 4px  - micro spacing
        sm: 'sm' as const,      // 8px  - tight spacing  
        md: 'md' as const,      // 12px - DEFAULT spacing
        lg: 'lg' as const,      // 16px - comfortable spacing
        xl: 'xl' as const,      // 24px - loose spacing
    },

    // === COMPONENT SIZES ===
    // Used in PatientsPageHeader.tsx
    sizes: {
        input: 'sm' as const,
        button: 'sm' as const,
    },

    // === TEXT SIZES ===
    text: {
        xs: 'xs' as const,       // 12px - micro text
        sm: 'sm' as const,       // 14px - small text
        md: 'md' as const,       // 16px - DEFAULT text
        lg: 'lg' as const,       // 18px - large text
        xl: 'xl' as const,       // 20px - extra large text
    },

    // === ICON SIZES ===
    iconSizes: {
        xs: 14,
        sm: 16,
        md: 18,
        lg: 20,
        xl: 24,
    },

    // === LAYOUT CONSTANTS ===
    layout: {
        containerSize: 'md' as const,
        headerHeight: 70,
        sidebarWidth: 280,
        mobileNavHeight: 80,
    },
} as const;

// === HELPER FUNCTIONS ===
export const getSpacing = (size: keyof typeof DESIGN_SYSTEM.spacing) => DESIGN_SYSTEM.spacing[size];
export const getTextSize = (size: keyof typeof DESIGN_SYSTEM.text) => DESIGN_SYSTEM.text[size];
export const getIconSize = (size: keyof typeof DESIGN_SYSTEM.iconSizes) => DESIGN_SYSTEM.iconSizes[size];

// === COMPONENT PRESETS ===
// Tylko najpotrzebniejsze presets
export const PRESETS = {
    card: {
        shadow: 'sm' as const,
        padding: 'lg' as const,
        radius: 'md' as const,
        withBorder: true,
    },

    stack: {
        gap: DESIGN_SYSTEM.spacing.md,
    },

    group: {
        gap: DESIGN_SYSTEM.spacing.sm,
    },
} as const;

export default DESIGN_SYSTEM; 