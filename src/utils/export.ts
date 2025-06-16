import * as XLSX from 'xlsx';
import { format } from 'date-fns';
import type { PatientWithAppointments } from '../types/Patient';
import type { AppointmentWithPatient } from '../types/Appointment';

export interface ExportOptions {
    patients?: boolean;
    appointments?: boolean;
    dateFrom?: Date;
    dateTo?: Date;
    selectedPatients?: number[];
}

export function exportToExcel(
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

    // Export patients if requested
    if (options.patients !== false) {
        const patientsData = filteredPatients.map(patient => ({
            'ID': patient.id,
            'Imię': patient.firstName,
            'Nazwisko': patient.lastName,
            'Email': patient.email || '',
            'Telefon': patient.phone || '',
            'Data urodzenia': patient.birthDate ? format(new Date(patient.birthDate), 'dd.MM.yyyy') : '',
            'Adres': patient.address || '',
            'Kontakt awaryjny': patient.emergencyContact || '',
            'Telefon awaryjny': patient.emergencyPhone || '',
            'Liczba wizyt': patient.appointmentCount,
            'Ostatnia wizyta': patient.lastAppointment ? format(new Date(patient.lastAppointment), 'dd.MM.yyyy') : '',
            'Następna wizyta': patient.nextAppointment ? format(new Date(patient.nextAppointment), 'dd.MM.yyyy') : '',
            'Notatki': patient.notes || '',
            'Data utworzenia': format(new Date(patient.createdAt), 'dd.MM.yyyy HH:mm'),
        }));

        const patientsWorksheet = XLSX.utils.json_to_sheet(patientsData);
        XLSX.utils.book_append_sheet(workbook, patientsWorksheet, 'Pacjenci');
    }

    // Export appointments if requested
    if (options.appointments !== false) {
        const appointmentsData = filteredAppointments.map(appointment => ({
            'ID': appointment.id,
            'Pacjent': `${appointment.patient?.firstName} ${appointment.patient?.lastName}`,
            'Data': format(new Date(appointment.date), 'dd.MM.yyyy'),
            'Godzina': format(new Date(appointment.date), 'HH:mm'),
            'Czas trwania (min)': appointment.duration,
            'Status': getStatusLabel(appointment.status),
            'Typ': getTypeLabel(appointment.type),
            'Telefon pacjenta': appointment.patient?.phone || '',
            'Notatki': appointment.notes || '',
            'Przypomnienie wysłane': appointment.reminderSent ? 'Tak' : 'Nie',
            'Data utworzenia': format(new Date(appointment.createdAt), 'dd.MM.yyyy HH:mm'),
        }));

        const appointmentsWorksheet = XLSX.utils.json_to_sheet(appointmentsData);
        XLSX.utils.book_append_sheet(workbook, appointmentsWorksheet, 'Wizyty');
    }

    // Generate filename with date range
    const dateRange = options.dateFrom && options.dateTo
        ? `_${format(options.dateFrom, 'dd-MM-yyyy')}_${format(options.dateTo, 'dd-MM-yyyy')}`
        : '';

    const filename = `psychflow_export${dateRange}_${format(new Date(), 'dd-MM-yyyy_HH-mm')}.xlsx`;

    // Download file
    XLSX.writeFile(workbook, filename);
}

function getStatusLabel(status?: string) {
    switch (status) {
        case 'scheduled': return 'Zaplanowana';
        case 'completed': return 'Zakończona';
        case 'cancelled': return 'Anulowana';
        case 'no_show': return 'Nieobecność';
        case 'rescheduled': return 'Przełożona';
        default: return status || '';
    }
}

function getTypeLabel(type?: string) {
    switch (type) {
        case 'initial': return 'Wizyta wstępna';
        case 'follow_up': return 'Wizyta kontrolna';
        case 'therapy': return 'Terapia';
        case 'consultation': return 'Konsultacja';
        case 'assessment': return 'Ocena';
        default: return type || 'Wizyta';
    }
} 