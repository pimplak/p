/**
 * Date Utilities - Single Source of Truth for Date Handling
 *
 * ISO strings w DB, Date objects w kodzie UI
 */

import { format, parseISO, differenceInYears } from 'date-fns';
import { pl } from 'date-fns/locale';
import type { Patient } from '../types/Patient';

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
export function formatDate(date: Date | string | undefined): string {
  if (!date) return 'Brak danych';

  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, 'dd.MM.yyyy', { locale: pl });
}

export function formatDateTime(date: Date | string | undefined): string {
  if (!date) return 'Brak danych';

  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, 'dd.MM.yyyy HH:mm', { locale: pl });
}

/**
 * Calculate age from birth date
 */
export function calculateAge(
  birthDate: Date | string | undefined
): number | null {
  if (!birthDate) return null;

  const dateObj =
    typeof birthDate === 'string' ? parseISO(birthDate) : birthDate;
  return differenceInYears(new Date(), dateObj);
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

// Helper do wyświetlania nazwy pacjenta - używa 'nazwa' jeśli dostępna, w przeciwnym razie imię i nazwisko
export function getPatientDisplayName(patient: Patient): string {
  if (patient.nazwa) {
    return patient.nazwa;
  }
  return `${patient.firstName} ${patient.lastName}`;
}
