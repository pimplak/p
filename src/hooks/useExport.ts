import { notifications } from '@mantine/notifications';
import { useState } from 'react';
import { exportToExcel } from '../utils/export';
import type { AppointmentWithPatient } from '../types/Appointment';
import type { PatientWithAppointments } from '../types/Patient';

export function useExport(
    patients: PatientWithAppointments[],
    appointments: AppointmentWithPatient[]
) {
    const [exportOpened, setExportOpened] = useState(false);

    const handleExport = () => {
        setExportOpened(true);
    };

    const handleExportData = async (options: {
        exportPatients: boolean;
        exportAppointments: boolean;
        dateFrom: Date | null;
        dateTo: Date | null;
        selectedPatients: number[];
    }) => {
        try {
            const patientsToExport =
                options.selectedPatients.length > 0
                    ? patients.filter(p => options.selectedPatients.includes(p.id!))
                    : patients;

            await exportToExcel(patientsToExport, appointments, {
                patients: options.exportPatients,
                appointments: options.exportAppointments,
                dateFrom: options.dateFrom || undefined,
                dateTo: options.dateTo || undefined,
                selectedPatients:
                    options.selectedPatients.length > 0
                        ? options.selectedPatients
                        : undefined,
            });

            setExportOpened(false);
        } catch (error) {
            console.error('Export error:', error);
            notifications.show({
                title: 'Błąd',
                message: 'Nie udało się wyeksportować danych',
                color: 'red',
            });
        }
    };

    const closeExport = () => {
        setExportOpened(false);
    };

    return {
        exportOpened,
        handleExport,
        handleExportData,
        closeExport,
    };
} 