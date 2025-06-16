import * as XLSX from 'xlsx';
import { format } from 'date-fns';
import { notifications } from '@mantine/notifications';
import type { PatientWithAppointments } from '../types/Patient';
import type { AppointmentWithPatient } from '../types/Appointment';

export interface ExportOptions {
    patients?: boolean;
    appointments?: boolean;
    dateFrom?: Date;
    dateTo?: Date;
    selectedPatients?: number[];
}

// Chunk size dla streaming
const CHUNK_SIZE = 500;

// Types for export data
interface PatientExportData {
    'ID': number | undefined;
    'Imię': string;
    'Nazwisko': string;
    'Email': string;
    'Telefon': string;
    'Data urodzenia': string;
    'Adres': string;
    'Kontakt awaryjny': string;
    'Telefon awaryjny': string;
    'Liczba wizyt': number;
    'Ostatnia wizyta': string;
    'Następna wizyta': string;
    'Notatki': string;
    'Data utworzenia': string;
}

interface AppointmentExportData {
    'ID': number | undefined;
    'Pacjent': string;
    'Data': string;
    'Godzina': string;
    'Czas trwania (min)': number;
    'Status': string;
    'Typ': string;
    'Telefon pacjenta': string;
    'Notatki': string;
    'Przypomnienie wysłane': string;
    'Data utworzenia': string;
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
        filteredAppointments = appointments.filter(appointment => {
            const appointmentDate = new Date(appointment.date);
            const afterFrom = !options.dateFrom || appointmentDate >= options.dateFrom;
            const beforeTo = !options.dateTo || appointmentDate <= options.dateTo;
            return afterFrom && beforeTo;
        });
    }

    let notificationId: string | null = null;

    try {
        // Export patients if requested - z progresem
        if (options.patients !== false && filteredPatients.length > 0) {
            notificationId = notifications.show({
                title: 'Eksport w toku...',
                message: 'Przetwarzanie danych pacjentów (0%)',
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
                    'ID': patient.id,
                    'Imię': patient.firstName,
                    'Nazwisko': patient.lastName,
                    'Email': patient.email || '',
                    'Telefon': patient.phone || '',
                    'Data urodzenia': patient.birthDate ? format(
                        typeof patient.birthDate === 'string'
                            ? new Date(patient.birthDate)
                            : patient.birthDate,
                        'dd.MM.yyyy'
                    ) : '',
                    'Adres': patient.address || '',
                    'Kontakt awaryjny': patient.emergencyContact || '',
                    'Telefon awaryjny': patient.emergencyPhone || '',
                    'Liczba wizyt': patient.appointmentCount,
                    'Ostatnia wizyta': patient.lastAppointment ? format(
                        typeof patient.lastAppointment === 'string'
                            ? new Date(patient.lastAppointment)
                            : patient.lastAppointment,
                        'dd.MM.yyyy'
                    ) : '',
                    'Następna wizyta': patient.nextAppointment ? format(
                        typeof patient.nextAppointment === 'string'
                            ? new Date(patient.nextAppointment)
                            : patient.nextAppointment,
                        'dd.MM.yyyy'
                    ) : '',
                    'Notatki': patient.notes || '',
                    'Data utworzenia': format(
                        typeof patient.createdAt === 'string'
                            ? new Date(patient.createdAt)
                            : patient.createdAt,
                        'dd.MM.yyyy HH:mm'
                    ),
                }));

                allPatientsData.push(...chunkData);

                // Update progress
                const progress = Math.round(((chunkIndex + 1) / totalChunks) * 100);
                notifications.update({
                    id: notificationId,
                    message: `Przetwarzanie danych pacjentów (${progress}%)`,
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
                    title: 'Eksport w toku...',
                    message: 'Przetwarzanie wizyt (0%)',
                    color: 'blue',
                    loading: true,
                    autoClose: false,
                });
            } else {
                notifications.update({
                    id: notificationId,
                    message: 'Przetwarzanie wizyt (0%)',
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

                const chunkData = chunk.map(appointment => ({
                    'ID': appointment.id,
                    'Pacjent': `${appointment.patient?.firstName} ${appointment.patient?.lastName}`,
                    'Data': format(
                        typeof appointment.date === 'string'
                            ? new Date(appointment.date)
                            : appointment.date,
                        'dd.MM.yyyy'
                    ),
                    'Godzina': format(
                        typeof appointment.date === 'string'
                            ? new Date(appointment.date)
                            : appointment.date,
                        'HH:mm'
                    ),
                    'Czas trwania (min)': appointment.duration,
                    'Status': getStatusLabel(appointment.status),
                    'Typ': appointment.type ? getTypeLabel(appointment.type) : '',
                    'Telefon pacjenta': appointment.patient?.phone || '',
                    'Notatki': appointment.notes || '',
                    'Przypomnienie wysłane': appointment.reminderSent ? 'Tak' : 'Nie',
                    'Data utworzenia': format(
                        typeof appointment.createdAt === 'string'
                            ? new Date(appointment.createdAt)
                            : appointment.createdAt,
                        'dd.MM.yyyy HH:mm'
                    ),
                }));

                allAppointmentsData.push(...chunkData);

                // Update progress
                const progress = Math.round(((chunkIndex + 1) / totalChunks) * 100);
                notifications.update({
                    id: notificationId,
                    message: `Przetwarzanie wizyt (${progress}%)`,
                });

                // Small delay for UI responsiveness
                await new Promise(resolve => setTimeout(resolve, 10));
            }

            const appointmentsWorksheet = XLSX.utils.json_to_sheet(allAppointmentsData);
            XLSX.utils.book_append_sheet(workbook, appointmentsWorksheet, 'Wizyty');
        }

        // Update final progress
        if (notificationId) {
            notifications.update({
                id: notificationId,
                message: 'Generowanie pliku...',
            });
        }

        // Generate filename with date range
        const dateRange = options.dateFrom && options.dateTo
            ? `_${format(options.dateFrom, 'dd-MM-yyyy')}_${format(options.dateTo, 'dd-MM-yyyy')}`
            : '';

        const filename = `psychflow_export${dateRange}_${format(new Date(), 'dd-MM-yyyy_HH-mm')}.xlsx`;

        // Download file
        XLSX.writeFile(workbook, filename);

        // Success notification
        if (notificationId) {
            notifications.update({
                id: notificationId,
                title: 'Eksport zakończony!',
                message: `Plik ${filename} został pobrany`,
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
                title: 'Błąd eksportu',
                message: 'Nie udało się wyeksportować danych',
                color: 'red',
                loading: false,
                autoClose: 5000,
            });
        }
        throw error;
    }
}

function getStatusLabel(status: string): string {
    const statusLabels: Record<string, string> = {
        'scheduled': 'Zaplanowana',
        'completed': 'Zakończona',
        'cancelled': 'Anulowana',
        'no_show': 'Niestawienie się',
        'rescheduled': 'Przełożona'
    };
    return statusLabels[status] || status;
}

function getTypeLabel(type: string): string {
    const typeLabels: Record<string, string> = {
        'initial': 'Pierwsza wizyta',
        'follow_up': 'Wizyta kontrolna',
        'therapy': 'Terapia',
        'consultation': 'Konsultacja',
        'assessment': 'Ocena'
    };
    return typeLabels[type] || type;
} 