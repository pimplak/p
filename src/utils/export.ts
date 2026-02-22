import { notifications } from '@mantine/notifications';
import { format } from 'date-fns';
import * as XLSX from 'xlsx';
import { EXPORT_CHUNK_SIZE } from '../constants/business';
import i18n from '../i18n/config';
import { db } from './db';
import type { AppointmentWithPatient } from '../types/Appointment';
import type { PatientWithAppointments, Patient } from '../types/Patient';

export interface ExportOptions {
  patients?: boolean;
  appointments?: boolean;
  dateFrom?: Date;
  dateTo?: Date;
  selectedPatients?: number[];
}

// Chunk size dla streaming
const CHUNK_SIZE = EXPORT_CHUNK_SIZE;

// Types for export data
interface PatientExportData {
  Imię: string;
  Nazwisko: string;
  Adres: string;
  Telefon: string;
  Email: string;
}

interface AppointmentExportData {
  Imię: string;
  Nazwisko: string;
  Adres: string;
  'Data wizyty': string;
  'Data zapłaty': string;
  Kwota: string;
}

export async function exportToExcel(
  patients: PatientWithAppointments[],
  appointments: AppointmentWithPatient[],
  options: ExportOptions = {}
) {
  const workbook = XLSX.utils.book_new();

  // Filter data based on options
  let filteredPatients = patients;
  let filteredAppointments = appointments;

  if (options.selectedPatients && options.selectedPatients.length > 0) {
    filteredPatients = patients.filter(patient =>
      options.selectedPatients!.includes(patient.id!)
    );
    filteredAppointments = appointments.filter(appointment =>
      options.selectedPatients!.includes(appointment.patientId)
    );
  }

  if (options.dateFrom || options.dateTo) {
    filteredAppointments = filteredAppointments.filter(appointment => {
      const appointmentDate = new Date(appointment.date);
      const afterFrom =
        !options.dateFrom || appointmentDate >= options.dateFrom;
      const beforeTo = !options.dateTo || appointmentDate <= options.dateTo;
      return afterFrom && beforeTo;
    });
  }

  let notificationId: string | null = null;

  try {
    // Export patients if requested - z progresem
    if (options.patients !== false && filteredPatients.length > 0) {
      notificationId = notifications.show({
        title: i18n.t('export.progress.exportInProgress'),
        message: i18n.t('export.progress.processingPatients', { progress: 0 }),
        color: 'blue',
        loading: true,
        autoClose: false,
      });

      const allPatientsData: PatientExportData[] = [];
      const totalPatients = filteredPatients.length;
      const totalChunks = Math.ceil(totalPatients / CHUNK_SIZE);

      // Process patients in chunks
      for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
        const startIndex = chunkIndex * CHUNK_SIZE;
        const endIndex = Math.min(startIndex + CHUNK_SIZE, totalPatients);
        const chunk = filteredPatients.slice(startIndex, endIndex);

        // Transform chunk to worksheet data
        const chunkData = chunk.map(patient => ({
          Imię: patient.firstName,
          Nazwisko: patient.lastName,
          Adres: patient.address || '',
          Telefon: patient.phone || '',
          Email: patient.email || '',
        }));

        allPatientsData.push(...chunkData);

        // Update progress
        const progress = Math.round(((chunkIndex + 1) / totalChunks) * 100);
        notifications.update({
          id: notificationId,
          message: i18n.t('export.progress.processingPatients', { progress }),
        });

        // Small delay for UI responsiveness
        await new Promise(resolve => setTimeout(resolve, 10));
      }

      const patientsWorksheet = XLSX.utils.json_to_sheet(allPatientsData);
      XLSX.utils.book_append_sheet(workbook, patientsWorksheet, 'Pacjenci');
    }

    // Export appointments if requested - z progresem
    if (options.appointments !== false && filteredAppointments.length > 0) {
      if (!notificationId) {
        notificationId = notifications.show({
          title: i18n.t('export.progress.exportInProgress'),
          message: i18n.t('export.progress.processingAppointments', { progress: 0 }),
          color: 'blue',
          loading: true,
          autoClose: false,
        });
      } else {
        notifications.update({
          id: notificationId,
          message: i18n.t('export.progress.processingAppointments', { progress: 0 }),
        });
      }

      const allAppointmentsData: AppointmentExportData[] = [];
      const totalAppointments = filteredAppointments.length;
      const totalChunks = Math.ceil(totalAppointments / CHUNK_SIZE);

      // Process appointments in chunks
      for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
        const startIndex = chunkIndex * CHUNK_SIZE;
        const endIndex = Math.min(startIndex + CHUNK_SIZE, totalAppointments);
        const chunk = filteredAppointments.slice(startIndex, endIndex);

        // Pobierz pełne dane pacjentów dla tego chunka
        const patientIds = [...new Set(chunk.map(apt => apt.patientId))];
        const fullPatients = await Promise.all(
          patientIds.map(id => db.patients.get(id))
        );
        const patientMap = new Map(
          fullPatients
            .filter((p): p is Patient => p !== undefined)
            .map(p => [p.id!, p])
        );

        const chunkData = chunk.map(appointment => {
          const fullPatient = patientMap.get(appointment.patientId);
          return {
            Imię:
              fullPatient?.firstName || appointment.patient?.firstName || '',
            Nazwisko:
              fullPatient?.lastName || appointment.patient?.lastName || '',
            Adres: fullPatient?.address || '',
            'Data wizyty': format(
              typeof appointment.date === 'string'
                ? new Date(appointment.date)
                : appointment.date,
              'dd.MM.yyyy'
            ),
            'Data zapłaty':
              appointment.paymentInfo?.isPaid && appointment.paymentInfo?.paidAt
                ? format(
                    typeof appointment.paymentInfo.paidAt === 'string'
                      ? new Date(appointment.paymentInfo.paidAt)
                      : appointment.paymentInfo.paidAt,
                    'dd.MM.yyyy HH:mm'
                  )
                : '',
            Kwota: appointment.price ? `${appointment.price}` : '',
          };
        });

        allAppointmentsData.push(...chunkData);

        // Update progress
        const progress = Math.round(((chunkIndex + 1) / totalChunks) * 100);
        notifications.update({
          id: notificationId,
          message: i18n.t('export.progress.processingAppointments', { progress }),
        });

        // Small delay for UI responsiveness
        await new Promise(resolve => setTimeout(resolve, 10));
      }

      const appointmentsWorksheet =
        XLSX.utils.json_to_sheet(allAppointmentsData);
      XLSX.utils.book_append_sheet(workbook, appointmentsWorksheet, 'Wizyty');
    }

    // Update final progress
    if (notificationId) {
      notifications.update({
        id: notificationId,
        message: i18n.t('export.progress.generatingFile'),
      });
    }

    // Generate filename with date range
    const dateRange =
      options.dateFrom && options.dateTo
        ? `_${format(options.dateFrom, 'dd-MM-yyyy')}_${format(options.dateTo, 'dd-MM-yyyy')}`
        : '';

    const filename = `p_export${dateRange}_${format(new Date(), 'dd-MM-yyyy_HH-mm')}.xlsx`;

    // Download file
    XLSX.writeFile(workbook, filename);

    // Success notification
    if (notificationId) {
      notifications.update({
        id: notificationId,
        title: i18n.t('export.progress.completed'),
        message: i18n.t('export.progress.fileDownloaded', { filename }),
        color: 'green',
        loading: false,
        autoClose: 3000,
      });
    }
  } catch (error) {
    console.error('Błąd podczas eksportu:', error);
    if (notificationId) {
      notifications.update({
        id: notificationId,
        title: i18n.t('export.progress.exportError'),
        message: i18n.t('export.progress.exportFailed'),
        color: 'red',
        loading: false,
        autoClose: 5000,
      });
    }
    throw error;
  }
}
