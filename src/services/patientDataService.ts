// FERRO'S PATIENT DATA SERVICE - Pure Dexie operations, no UI state
import { validatePatientForm } from '../schemas';
import { db } from '../utils/db';
import type { Patient, PatientWithAppointments } from '../types/Patient';

export interface FetchPatientsOptions {
    showArchived?: boolean;
}

export class PatientDataService {
    // FETCH - podstawowe pobranie pacjentów z DB
    static async fetchPatients(options: FetchPatientsOptions = {}): Promise<PatientWithAppointments[]> {
        const { showArchived = false } = options;

        // Pobierz pacjentów według statusu
        const patients = await (showArchived
            ? db.patients.orderBy('lastName').toArray()
            : db.patients.where('status').equals('active').toArray()
        );

        // Sortuj po lastName
        patients.sort((a, b) => a.lastName.localeCompare(b.lastName));

        if (patients.length === 0) {
            return [];
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
        return patients.map(patient => {
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
    }

    // CREATE - dodanie nowego pacjenta
    static async createPatient(patientData: Omit<Patient, 'id' | 'createdAt' | 'updatedAt'>): Promise<number> {
        // Walidacja Zod przed zapisem
        const validatedData = validatePatientForm(patientData);
        return await db.patients.add(validatedData as Patient) as number;
    }

    // UPDATE - aktualizacja pacjenta
    static async updatePatient(id: number, patientData: Partial<Patient>): Promise<void> {
        // Walidacja Zod przed aktualizacją (partial update)
        const validatedData = validatePatientForm(patientData);
        await db.patients.update(id, validatedData);
    }

    // DELETE - usunięcie pacjenta i jego wizyt
    static async deletePatient(id: number): Promise<void> {
        // Delete all appointments for this patient first
        await db.appointments.where('patientId').equals(id).delete();
        await db.patients.delete(id);
    }

    // ARCHIVE - archiwizacja pacjenta
    static async archivePatient(id: number): Promise<void> {
        await db.patients.update(id, { status: 'archived' });
    }

    // RESTORE - przywrócenie pacjenta
    static async restorePatient(id: number): Promise<void> {
        await db.patients.update(id, { status: 'active' });
    }

    // GET BY ID - pobranie pojedynczego pacjenta
    static async getPatientById(id: number): Promise<Patient | undefined> {
        return await db.patients.get(id);
    }

    // SEARCH - wyszukiwanie pacjentów (pure function, działa na przekazanych danych)
    static searchPatients(patients: PatientWithAppointments[], query: string): PatientWithAppointments[] {
        if (!query.trim()) return patients;

        const lowerQuery = query.toLowerCase();
        return patients.filter(patient =>
            patient.firstName.toLowerCase().includes(lowerQuery) ||
            patient.lastName.toLowerCase().includes(lowerQuery) ||
            patient.email?.toLowerCase().includes(lowerQuery) ||
            patient.phone?.includes(query) ||
            patient.tags?.some(tag => tag.toLowerCase().includes(lowerQuery))
        );
    }
} 