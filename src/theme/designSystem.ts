// === FERRO'S BRUTAL DESIGN SYSTEM CONSTANTS ===
// Koniec z chaosem! Jeden plik, jedna prawda.

export const DESIGN_SYSTEM = {
    // === SPACING SYSTEM ===
    // Używaj TYLKO tych wartości. Koniec z wymyślaniem.
    spacing: {
        xs: 'xs',      // 4px  - micro spacing
        sm: 'sm',      // 8px  - tight spacing  
        md: 'md',      // 12px - DEFAULT spacing
        lg: 'lg',      // 16px - comfortable spacing
        xl: 'xl',      // 24px - loose spacing
    },

    // === COMPONENT SIZES ===
    // Konsystentne rozmiary dla wszystkich komponentów
    sizes: {
        button: 'sm',        // Kompaktowe buttony
        input: 'sm',         // Kompaktowe inputy
        actionIcon: 'sm',    // Małe ikony akcji
        badge: 'sm',         // Małe badges
        select: 'sm',        // Kompaktowe selecty
        themeIcon: 'lg',     // Większe ikony tematyczne
        fab: 'lg',           // Duże floating action buttons
    },

    // === TEXT SIZES ===
    text: {
        xs: 'xs',       // 12px - micro text
        sm: 'sm',       // 14px - small text
        md: 'md',       // 16px - DEFAULT text
        lg: 'lg',       // 18px - large text
        xl: 'xl',       // 20px - extra large text
    },

    // === CARD SYSTEM ===
    card: {
        shadow: 'sm',
        padding: 'lg',
        radius: 'md',
        withBorder: true,
    },

    // === BUTTON VARIANTS ===
    button: {
        primary: {
            variant: 'filled' as const,
            size: 'sm' as const,
            radius: 'md' as const,
        },
        secondary: {
            variant: 'light' as const,
            size: 'sm' as const,
            radius: 'md' as const,
        },
        ghost: {
            variant: 'subtle' as const,
            size: 'sm' as const,
            radius: 'md' as const,
        },
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

    // === MODAL SYSTEM ===
    modal: {
        radius: 'lg',
        centered: true,
        shadow: 'lg',
        overlayProps: {
            opacity: 0.4,
            blur: 4,
        },
    },

    // === ANIMATION CONSTANTS ===
    animation: {
        duration: 200,
        easing: 'ease-out',
    },

    // === BREAKPOINTS ===
    breakpoints: {
        sm: '768px',
        md: '1024px',
        lg: '1200px',
    },

    // === Z-INDEX SYSTEM ===
    zIndex: {
        modal: 1000,
        fab: 999,
        mobileNav: 998,
        tooltip: 997,
        dropdown: 996,
    },
} as const;

// === HELPER FUNCTIONS ===
export const getSpacing = (size: keyof typeof DESIGN_SYSTEM.spacing) => DESIGN_SYSTEM.spacing[size];
export const getSize = (component: keyof typeof DESIGN_SYSTEM.sizes) => DESIGN_SYSTEM.sizes[component];
export const getTextSize = (size: keyof typeof DESIGN_SYSTEM.text) => DESIGN_SYSTEM.text[size];
export const getIconSize = (size: keyof typeof DESIGN_SYSTEM.iconSizes) => DESIGN_SYSTEM.iconSizes[size];

// === COMPONENT PRESETS ===
export const PRESETS = {
    // Standard Card
    card: {
        shadow: DESIGN_SYSTEM.card.shadow,
        padding: DESIGN_SYSTEM.card.padding,
        radius: DESIGN_SYSTEM.card.radius,
        withBorder: DESIGN_SYSTEM.card.withBorder,
    },

    // Standard Stack
    stack: {
        gap: DESIGN_SYSTEM.spacing.md,
    },

    // Standard Group
    group: {
        gap: DESIGN_SYSTEM.spacing.sm,
    },

    // Standard Button
    button: {
        size: DESIGN_SYSTEM.button.primary.size,
        radius: DESIGN_SYSTEM.button.primary.radius,
    },

    // Standard Input
    input: {
        size: DESIGN_SYSTEM.sizes.input,
        radius: DESIGN_SYSTEM.card.radius,
    },

    // Standard Modal
    modal: {
        ...DESIGN_SYSTEM.modal,
    },

    // Standard FAB
    fab: {
        size: DESIGN_SYSTEM.sizes.fab,
        radius: 'xl' as const,
    },
} as const;

// === THEME COLORS ===
export const THEME_COLORS = {
    primary: 'indigo',
    secondary: 'blue',
    success: 'green',
    warning: 'yellow',
    danger: 'red',
    muted: 'gray',
} as const;

// === EXPORT EVERYTHING ===
export default DESIGN_SYSTEM; 