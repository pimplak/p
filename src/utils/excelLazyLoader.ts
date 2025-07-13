/**
 * Lazy Excel Export Worker
 *
 * Używa dynamic import do ładowania XLSX tylko gdy potrzeba
 * i requestIdleCallback do off-main-thread procesowania
 */

import { notifications } from '@mantine/notifications';
import { EXPORT_CHUNK_SIZE, NOTIFICATION_TIMEOUT } from '../constants/business';
import type { WorkBook } from 'xlsx';

export interface ExcelExportData {
  sheets: Array<{
    name: string;
    data: Record<string, unknown>[];
  }>;
  filename: string;
}

/**
 * Lazy load XLSX and export data in background
 */
export async function lazyExportToExcel(
  exportData: ExcelExportData
): Promise<void> {
  const notificationId = notifications.show({
    title: 'Przygotowywanie eksportu...',
    message: 'Ładowanie biblioteki eksportu',
    color: 'blue',
    loading: true,
    autoClose: false,
  });

  try {
    // Dynamic import XLSX only when needed
    const XLSX = await import('xlsx');

    notifications.update({
      id: notificationId,
      message: 'Generowanie pliku Excel...',
    });

    // Use requestIdleCallback to prevent blocking main thread
    const workbook = await new Promise<WorkBook>(resolve => {
      const processExport = () => {
        const wb = XLSX.utils.book_new();

        exportData.sheets.forEach(sheet => {
          const worksheet = XLSX.utils.json_to_sheet(sheet.data);
          XLSX.utils.book_append_sheet(wb, worksheet, sheet.name);
        });

        resolve(wb);
      };

      // Use requestIdleCallback if available, otherwise setTimeout
      if ('requestIdleCallback' in window) {
        requestIdleCallback(processExport, { timeout: NOTIFICATION_TIMEOUT });
      } else {
        setTimeout(processExport, 0);
      }
    });

    notifications.update({
      id: notificationId,
      message: 'Pobieranie pliku...',
    });

    // Download file
    XLSX.writeFile(workbook, exportData.filename);

    notifications.update({
      id: notificationId,
      title: 'Sukces!',
      message: 'Plik został pobrany',
      color: 'green',
      loading: false,
      autoClose: 3000,
    });
  } catch (error) {
    console.error('Error during lazy Excel export:', error);

    notifications.update({
      id: notificationId,
      title: 'Błąd eksportu',
      message: 'Nie udało się wygenerować pliku Excel',
      color: 'red',
      loading: false,
      autoClose: NOTIFICATION_TIMEOUT,
    });

    throw error;
  }
}

/**
 * Process data in chunks with progress updates
 */
export async function processLargeDataset<T, R>(
  data: T[],
  processor: (chunk: T[]) => R[],
  options: {
    chunkSize?: number;
    onProgress?: (progress: number) => void;
  } = {}
): Promise<R[]> {
  const { chunkSize = EXPORT_CHUNK_SIZE, onProgress } = options;
  const result: R[] = [];
  const totalChunks = Math.ceil(data.length / chunkSize);

  for (let i = 0; i < totalChunks; i++) {
    const startIndex = i * chunkSize;
    const endIndex = Math.min(startIndex + chunkSize, data.length);
    const chunk = data.slice(startIndex, endIndex);

    // Process chunk
    const processedChunk = processor(chunk);
    result.push(...processedChunk);

    // Update progress
    const progress = Math.round(((i + 1) / totalChunks) * 100);
    onProgress?.(progress);

    // Yield control to prevent blocking
    await new Promise(resolve => setTimeout(resolve, 0));
  }

  return result;
}
