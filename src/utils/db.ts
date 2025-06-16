import Dexie, { type Table } from 'dexie';
import type { Patient } from '../types/Patient';
import type { Appointment } from '../types/Appointment';

export class PsychFlowDB extends Dexie {
    patients!: Table<Patient>;
    appointments!: Table<Appointment>;

    constructor() {
        super('PsychFlowDB');

        // Version 1 - oryginalny schema
        this.version(1).stores({
            patients: '++id, firstName, lastName, email, phone, createdAt, updatedAt',
            appointments: '++id, patientId, date, status, createdAt, updatedAt'
        });

        // Version 2 - dodajemy indeksy z compound index i ISO stringami
        this.version(2).stores({
            patients: '++id, lastName, email, phone, [firstName+lastName]',
            appointments: '++id, patientId, date, status'
        }).upgrade(tx => {
            // Migracja: konwertuj wszystkie daty na ISO stringi
            return Promise.all([
                tx.table('patients').toCollection().modify(patient => {
                    if (patient.createdAt instanceof Date) {
                        patient.createdAt = patient.createdAt.toISOString();
                    }
                    if (patient.updatedAt instanceof Date) {
                        patient.updatedAt = patient.updatedAt.toISOString();
                    }
                    if (patient.birthDate instanceof Date) {
                        patient.birthDate = patient.birthDate.toISOString();
                    }
                }),
                tx.table('appointments').toCollection().modify(appointment => {
                    if (appointment.date instanceof Date) {
                        appointment.date = appointment.date.toISOString();
                    }
                    if (appointment.createdAt instanceof Date) {
                        appointment.createdAt = appointment.createdAt.toISOString();
                    }
                    if (appointment.updatedAt instanceof Date) {
                        appointment.updatedAt = appointment.updatedAt.toISOString();
                    }
                    if (appointment.reminderSentAt instanceof Date) {
                        appointment.reminderSentAt = appointment.reminderSentAt.toISOString();
                    }
                })
            ]);
        });

        // Add hooks for automatic timestamps (now using ISO strings)
        this.patients.hook('creating', function (_, obj: Partial<Patient>) {
            obj.createdAt = new Date().toISOString() as Date | string;
            obj.updatedAt = new Date().toISOString() as Date | string;
        });

        this.patients.hook('updating', function (modifications: Partial<Patient>) {
            modifications.updatedAt = new Date().toISOString() as Date | string;
        });

        this.appointments.hook('creating', function (_, obj: Partial<Appointment>) {
            obj.createdAt = new Date().toISOString() as Date | string;
            obj.updatedAt = new Date().toISOString() as Date | string;
        });

        this.appointments.hook('updating', function (modifications: Partial<Appointment>) {
            modifications.updatedAt = new Date().toISOString() as Date | string;
        });
    }
}

export const db = new PsychFlowDB(); 