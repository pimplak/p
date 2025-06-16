import { create } from 'zustand';
import { produce } from 'immer';
import { db } from '../utils/db';
import { validatePatientForm } from '../schemas';
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

            if (patients.length === 0) {
                set({ patients: [], loading: false });
                return;
            }

            // Jedno zapytanie po wszystkie wizyty - koniec z N+1!
            const patientIds = patients.map(p => p.id!).filter(Boolean);
            const allAppointments = await db.appointments
                .where('patientId')
                .anyOf(patientIds)
                .toArray();

            // Grupuj wizyty po patientId (manual groupBy bo Dexie nie ma tego)
            const appointmentsByPatient = new Map<number, typeof allAppointments>();
            allAppointments.forEach(appointment => {
                const patientId = appointment.patientId;
                if (!appointmentsByPatient.has(patientId)) {
                    appointmentsByPatient.set(patientId, []);
                }
                appointmentsByPatient.get(patientId)!.push(appointment);
            });

            // Mapuj pacjentów z danymi o wizytach
            const patientsWithAppointments: PatientWithAppointments[] = patients.map(patient => {
                const appointments = appointmentsByPatient.get(patient.id!) || [];

                // Sortuj wizyty by date (najnowsze pierwsze)
                const sortedAppointments = appointments.sort((a, b) => {
                    const dateA = typeof a.date === 'string' ? new Date(a.date) : a.date;
                    const dateB = typeof b.date === 'string' ? new Date(b.date) : b.date;
                    return dateB.getTime() - dateA.getTime();
                });

                // Znajdź przyszłe wizyty (posortowane chronologicznie)
                const now = new Date();
                const futureAppointments = appointments
                    .filter(apt => {
                        const appointmentDate = typeof apt.date === 'string' ? new Date(apt.date) : apt.date;
                        return appointmentDate > now;
                    })
                    .sort((a, b) => {
                        const dateA = typeof a.date === 'string' ? new Date(a.date) : a.date;
                        const dateB = typeof b.date === 'string' ? new Date(b.date) : b.date;
                        return dateA.getTime() - dateB.getTime();
                    });

                return {
                    ...patient,
                    appointmentCount: appointments.length,
                    lastAppointment: sortedAppointments[0]?.date,
                    nextAppointment: futureAppointments[0]?.date,
                };
            });

            set({ patients: patientsWithAppointments, loading: false });
        } catch (error) {
            console.error('Błąd podczas pobierania pacjentów:', error);
            set({ error: 'Błąd podczas pobierania pacjentów', loading: false });
        }
    },

    addPatient: async (patientData) => {
        set({ loading: true, error: null });
        try {
            // Walidacja Zod przed zapisem
            const validatedData = validatePatientForm(patientData);
            const id = await db.patients.add(validatedData as Patient);

            // Optimistic update - dodaj pacjenta do store
            set(produce((state: PatientStore) => {
                const newPatient: PatientWithAppointments = {
                    ...validatedData as Patient,
                    id: id as number,
                    appointmentCount: 0,
                    lastAppointment: undefined,
                    nextAppointment: undefined,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                };
                state.patients.push(newPatient);
                // Sortuj po lastName
                state.patients.sort((a, b) => a.lastName.localeCompare(b.lastName));
                state.loading = false;
            }));
        } catch (error) {
            console.error('Błąd podczas dodawania pacjenta:', error);
            set({ error: 'Błąd podczas dodawania pacjenta', loading: false });
        }
    },

    updatePatient: async (id, patientData) => {
        set({ loading: true, error: null });
        try {
            // Walidacja Zod przed aktualizacją (partial update)
            const validatedData = validatePatientForm(patientData);
            await db.patients.update(id, validatedData);

            // Optimistic update - zaktualizuj pacjenta w store
            set(produce((state: PatientStore) => {
                const index = state.patients.findIndex(p => p.id === id);
                if (index !== -1) {
                    Object.assign(state.patients[index], validatedData, {
                        updatedAt: new Date().toISOString()
                    });
                    // Re-sortuj jeśli zmieniono nazwisko
                    if (validatedData.lastName) {
                        state.patients.sort((a, b) => a.lastName.localeCompare(b.lastName));
                    }
                }
                state.loading = false;
            }));
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

            // Optimistic update - usuń pacjenta ze store
            set(produce((state: PatientStore) => {
                state.patients = state.patients.filter(p => p.id !== id);
                state.loading = false;
            }));
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