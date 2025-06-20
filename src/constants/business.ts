// FERRO'S BUSINESS CONSTANTS - No more magic numbers!

// APPOINTMENT PRICING
export const DEFAULT_APPOINTMENT_PRICE = 150; // Domyślna cena wizyty w zł

// EXPORT PROCESSING  
export const EXPORT_CHUNK_SIZE = 500; // Chunk size dla eksportu danych

// UI CONSTANTS
export const PROGRESS_UPDATE_DELAY = 10; // Delay między chunkami dla UI responsiveness (ms)
export const NOTIFICATION_TIMEOUT = 5000; // Timeout dla auto-close notyfikacji (ms)

// FONT WEIGHTS (często używane w UI)
export const FONT_WEIGHT = {
    NORMAL: 400,
    MEDIUM: 500,
    BOLD: 700,
} as const; 