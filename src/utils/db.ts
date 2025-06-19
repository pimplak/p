import Dexie, { type Table } from 'dexie';
import type { Patient, Note, Goal } from '../types/Patient';
import type { Appointment } from '../types/Appointment';

export class PsychFlowDB extends Dexie {
    patients!: Table<Patient>;
    appointments!: Table<Appointment>;
    notes!: Table<Note>;
    goals!: Table<Goal>;

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

        // Version 3 - dodajemy status, tags do pacjentów oraz tabele notes i goals
        this.version(3).stores({
            patients: '++id, lastName, email, phone, status, [firstName+lastName]',
            appointments: '++id, patientId, date, status',
            notes: '++id, patientId, sessionId, type, createdAt',
            goals: '++id, patientId, status, targetDate, createdAt'
        }).upgrade(tx => {
            // Migracja: dodaj domyślny status 'active' do istniejących pacjentów
            return tx.table('patients').toCollection().modify(patient => {
                if (!patient.status) {
                    patient.status = 'active';
                }
                if (!patient.tags) {
                    patient.tags = [];
                }
            });
        });

        // Version 4 - dodajemy pola ceny i płatności do wizyt
        this.version(4).stores({
            patients: '++id, lastName, email, phone, status, [firstName+lastName]',
            appointments: '++id, patientId, date, status',
            notes: '++id, patientId, sessionId, type, createdAt',
            goals: '++id, patientId, status, targetDate, createdAt'
        }).upgrade(tx => {
            // Migracja: dodaj domyślne wartości dla nowych pól płatności
            return tx.table('appointments').toCollection().modify(appointment => {
                if (typeof appointment.price === 'undefined') {
                    appointment.price = 150; // Domyślna cena 150 zł
                }
                if (!appointment.paymentInfo) {
                    appointment.paymentInfo = {
                        isPaid: false
                    };
                }
            });
        });

        // Add hooks for automatic timestamps (now using ISO strings)
        this.patients.hook('creating', function (_, obj: Partial<Patient>) {
            obj.createdAt = new Date().toISOString() as Date | string;
            obj.updatedAt = new Date().toISOString() as Date | string;
            if (!obj.status) {
                obj.status = 'active';
            }
            if (!obj.tags) {
                obj.tags = [];
            }
        });

        this.patients.hook('updating', function (modifications: Partial<Patient>) {
            modifications.updatedAt = new Date().toISOString() as Date | string;
        });

        this.appointments.hook('creating', function (_, obj: Partial<Appointment>) {
            obj.createdAt = new Date().toISOString() as Date | string;
            obj.updatedAt = new Date().toISOString() as Date | string;
            if (typeof obj.price === 'undefined') {
                obj.price = 150; // Domyślna cena 150 zł
            }
            if (!obj.paymentInfo) {
                obj.paymentInfo = {
                    isPaid: false
                };
            }
        });

        this.appointments.hook('updating', function (modifications: Partial<Appointment>) {
            modifications.updatedAt = new Date().toISOString() as Date | string;
        });

        this.notes.hook('creating', function (_, obj: Partial<Note>) {
            obj.createdAt = new Date().toISOString() as Date | string;
            obj.updatedAt = new Date().toISOString() as Date | string;
        });

        this.notes.hook('updating', function (modifications: Partial<Note>) {
            modifications.updatedAt = new Date().toISOString() as Date | string;
        });

        this.goals.hook('creating', function (_, obj: Partial<Goal>) {
            obj.createdAt = new Date().toISOString() as Date | string;
            obj.updatedAt = new Date().toISOString() as Date | string;
            if (typeof obj.progress === 'undefined') {
                obj.progress = 0;
            }
        });

        this.goals.hook('updating', function (modifications: Partial<Goal>) {
            modifications.updatedAt = new Date().toISOString() as Date | string;
        });
    }
}

export const db = new PsychFlowDB(); 