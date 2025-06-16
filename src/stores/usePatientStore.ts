import { create } from 'zustand';
import { db } from '../utils/db';
import type { Patient, PatientWithAppointments } from '../types/Patient';

interface PatientStore {
    patients: PatientWithAppointments[];
    loading: boolean;
    error: string | null;

    // Actions
    fetchPatients: () => Promise<void>;
    addPatient: (patient: Omit<Patient, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
    updatePatient: (id: number, patient: Partial<Patient>) => Promise<void>;
    deletePatient: (id: number) => Promise<void>;
    getPatient: (id: number) => Promise<Patient | undefined>;
    searchPatients: (query: string) => PatientWithAppointments[];
}

export const usePatientStore = create<PatientStore>((set, get) => ({
    patients: [],
    loading: false,
    error: null,

    fetchPatients: async () => {
        set({ loading: true, error: null });
        try {
            const patients = await db.patients.orderBy('lastName').toArray();

            // Get appointment counts for each patient
            const patientsWithAppointments: PatientWithAppointments[] = await Promise.all(
                patients.map(async (patient) => {
                    const appointments = await db.appointments
                        .where('patientId')
                        .equals(patient.id!)
                        .toArray();

                    const sortedAppointments = appointments.sort((a, b) =>
                        new Date(b.date).getTime() - new Date(a.date).getTime()
                    );

                    const futureAppointments = appointments.filter(
                        apt => new Date(apt.date) > new Date()
                    ).sort((a, b) =>
                        new Date(a.date).getTime() - new Date(b.date).getTime()
                    );

                    return {
                        ...patient,
                        appointmentCount: appointments.length,
                        lastAppointment: sortedAppointments[0]?.date,
                        nextAppointment: futureAppointments[0]?.date,
                    };
                })
            );

            set({ patients: patientsWithAppointments, loading: false });
        } catch (error) {
            console.error('Błąd podczas pobierania pacjentów:', error);
            set({ error: 'Błąd podczas pobierania pacjentów', loading: false });
        }
    },

    addPatient: async (patientData) => {
        set({ loading: true, error: null });
        try {
            await db.patients.add(patientData as Patient);
            await get().fetchPatients();
        } catch (error) {
            console.error('Błąd podczas dodawania pacjenta:', error);
            set({ error: 'Błąd podczas dodawania pacjenta', loading: false });
        }
    },

    updatePatient: async (id, patientData) => {
        set({ loading: true, error: null });
        try {
            await db.patients.update(id, patientData);
            await get().fetchPatients();
        } catch (error) {
            console.error('Błąd podczas aktualizacji pacjenta:', error);
            set({ error: 'Błąd podczas aktualizacji pacjenta', loading: false });
        }
    },

    deletePatient: async (id) => {
        set({ loading: true, error: null });
        try {
            // Delete all appointments for this patient first
            await db.appointments.where('patientId').equals(id).delete();
            await db.patients.delete(id);
            await get().fetchPatients();
        } catch (error) {
            console.error('Błąd podczas usuwania pacjenta:', error);
            set({ error: 'Błąd podczas usuwania pacjenta', loading: false });
        }
    },

    getPatient: async (id) => {
        try {
            return await db.patients.get(id);
        } catch (error) {
            console.error('Błąd podczas pobierania pacjenta:', error);
            set({ error: 'Błąd podczas pobierania pacjenta' });
            return undefined;
        }
    },

    searchPatients: (query) => {
        const { patients } = get();
        if (!query.trim()) return patients;

        const lowerQuery = query.toLowerCase();
        return patients.filter(patient =>
            patient.firstName.toLowerCase().includes(lowerQuery) ||
            patient.lastName.toLowerCase().includes(lowerQuery) ||
            patient.email?.toLowerCase().includes(lowerQuery) ||
            patient.phone?.includes(query)
        );
    },
})); 