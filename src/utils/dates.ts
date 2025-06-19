/**
 * Date Utilities - Single Source of Truth for Date Handling
 * 
 * ISO strings w DB, Date objects w kodzie UI
 */

/**
 * Convert Date to ISO string for database storage
 */
export function toISO(date: Date | string | undefined): string | undefined {
    if (!date) return undefined;

    if (typeof date === 'string') {
        // Already ISO string, validate and return
        const parsed = new Date(date);
        return isNaN(parsed.getTime()) ? undefined : date;
    }

    if (date instanceof Date) {
        return isNaN(date.getTime()) ? undefined : date.toISOString();
    }

    return undefined;
}

/**
 * Convert ISO string or Date to Date object for UI usage
 */
export function toDate(date: Date | string | undefined): Date | undefined {
    if (!date) return undefined;

    if (date instanceof Date) {
        return isNaN(date.getTime()) ? undefined : date;
    }

    if (typeof date === 'string') {
        const parsed = new Date(date);
        return isNaN(parsed.getTime()) ? undefined : parsed;
    }

    return undefined;
}

/**
 * Safe date formatting - handles both Date and ISO string
 */
export function formatDate(
    date: Date | string | undefined,
    format: 'short' | 'long' | 'time' = 'short'
): string {
    const dateObj = toDate(date);
    if (!dateObj) return 'Brak danych';

    const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        ...(format === 'long' && { weekday: 'long' }),
        ...(format === 'time' && { hour: '2-digit', minute: '2-digit' })
    };

    return dateObj.toLocaleDateString('pl-PL', options);
}

/**
 * Calculate age from birth date
 */
export function calculateAge(birthDate: Date | string | undefined): number | null {
    const birth = toDate(birthDate);
    if (!birth) return null;

    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
    }

    return age;
}

/**
 * Check if date is today
 */
export function isToday(date: Date | string | undefined): boolean {
    const dateObj = toDate(date);
    if (!dateObj) return false;

    const today = new Date();
    return dateObj.toDateString() === today.toDateString();
}

/**
 * Get start and end of day for date range queries
 */
export function getDayRange(date: Date | string): { start: Date; end: Date } {
    const dateObj = toDate(date) || new Date();

    const start = new Date(dateObj);
    start.setHours(0, 0, 0, 0);

    const end = new Date(dateObj);
    end.setHours(23, 59, 59, 999);

    return { start, end };
} 